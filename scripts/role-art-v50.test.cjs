/* Integration checks: execute the application's real Ct/ft renderers and both curated role files. */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const stored=read('docs/cards.json');
const profiles=new Map(read('docs/ART_PROFILES_V39.json').cards.map(profile=>[profile.id,profile]));
const selected=read('docs/ACTIVE_CARDS_V39.json').activeIds;
const leads=read('scripts/art-role-leads-v50.json');
const support=read('scripts/art-role-support-v50.json');
const overrides={...leads,...support};
const startup='Zn.addEventListener(`click`,Tr),Er()';
assert.equal(html.split(startup).length,2,'Expected one application startup marker');
const storage={getItem:()=>null,setItem(){},removeItem(){}};
const scope=vm.createContext({console,URL,URLSearchParams,Intl,Date,Math,
  localStorage:storage,sessionStorage:storage,
  document:{querySelector:selector=>selector==='#app'?{}:null,getElementById:()=>null},
  location:{href:'https://example.invalid/',protocol:'https:',hash:'',search:'',pathname:'/'},
  matchMedia:()=>({matches:false})});
scope.window=scope;
const instrumented=html.replace(startup,'globalThis.__ROLE_ART_V50__={cards:e,activeCards,Ct,ft,ArtProfilesV39,figV39Object,L,z}');
for(const [i,block] of [...instrumented.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries()){
  vm.runInContext(block[1],scope,{filename:`index.html:inline-${i+1}`,timeout:10000});
}
const game=scope.__ROLE_ART_V50__;
assert.ok(game,'Actual application runtime must load');
const plain=value=>JSON.parse(JSON.stringify(value));
const isRole=card=>['主演','配角'].includes(card.dimension);
const active=Array.from(game.activeCards);
const activeIds=new Set(active.map(card=>card.id));
const roles=active.filter(isRole);
const reserve=Array.from(game.cards).filter(card=>isRole(card)&&!activeIds.has(card.id));
const rows=roles.map(card=>({id:card.id,name:card.name,profile:game.ArtProfilesV39.get(card),body:game.ft(card).body,svg:game.Ct(card)}));

function normalize(svg){
  return svg.replace(/<(?:title|desc|text)\b[^>]*>[\s\S]*?<\/(?:title|desc|text)>/gi,'')
    .replace(/\s(?:id|class|aria-[\w-]+|data-[\w-]+)="[^"]*"/g,'')
    .replace(/url\(#[^)]+\)/g,'url(#clip)')
    .replace(/\s(?:fill|stroke|stop-color)="([^"]+)"/g,(all,value)=>all.replace(value,/^(none|transparent)$/i.test(value)?value:'INK'))
    .replace(/\s(?:opacity|fill-opacity|stroke-opacity)="[^"]*"/g,'')
    .replace(/#[0-9a-f]{3,8}\b/gi,'INK')
    .replace(/\s+/g,' ').replace(/> </g,'><').trim();
}
// Read complete nested groups rather than accepting a marker whose SVG content is empty.
function groups(svg,attribute){
  const stack=[],found=[];
  for(const match of svg.matchAll(/<(\/?)g\b[^>]*>/g)){
    if(!match[1])stack.push({tag:match[0],start:match.index+match[0].length});
    else{
      const open=stack.pop();
      assert.ok(open,'SVG groups must be balanced');
      const value=open.tag.match(new RegExp(`\\b${attribute}="([^"]*)"`));
      if(value)found.push({value:value[1],body:svg.slice(open.start,match.index)});
    }
  }
  assert.equal(stack.length,0,'SVG groups must be balanced');
  return found;
}

test('卡池仍为777/500；185常驻人物与持久卡片的ID、名字、维度完全一致',()=>{
  const identity=cards=>Array.from(cards,({id,name,dimension})=>({id,name,dimension})).sort((a,b)=>a.id.localeCompare(b.id));
  assert.equal(game.cards.length,777);
  assert.equal(active.length,500);
  assert.equal(activeIds.size,500);
  assert.deepEqual([...activeIds].sort(),[...selected].sort());
  assert.deepEqual(identity(game.cards),identity(stored));
  assert.equal(roles.length,185);
  assert.equal(new Set(roles.map(card=>card.id)).size,185);
  assert.equal(reserve.length,75);
});

test('两份逐卡设计恰好覆盖185常驻人物，真实卡面使用v50构图与源文件字段',()=>{
  assert.equal(Object.keys(leads).length,100);
  assert.equal(Object.keys(support).length,85);
  assert.equal(Object.keys(overrides).length,185,'No ID may occur in both source files');
  assert.deepEqual(Object.keys(overrides).sort(),roles.map(card=>card.id).sort());
  for(const row of rows){
    assert.ok(row.svg.includes(row.body),`${row.id}: Ct must contain actual ft.body`);
    const visual=Object.fromEntries(Object.entries(overrides[row.id]).filter(([key])=>!['designIntent','distinguishFrom'].includes(key)));
    assert.deepEqual(plain(Object.fromEntries(Object.keys(visual).map(key=>[key,row.profile[key]]))),visual,`${row.id}: stale integrated visual profile`);
    const documented=profiles.get(row.id);
    for(const field of ['designIntent','distinguishFrom']){
      assert.ok(overrides[row.id][field]?.trim(),`${row.id}: missing ${field}`);
      assert.equal(documented[field],overrides[row.id][field],`${row.id}: stale design documentation`);
    }
    assert.equal(groups(row.body,'data-portrait-v50').length,1,`${row.id}: missing v50 portrait`);
    assert.equal(groups(row.body,'data-portrait-v50')[0].value,row.profile.portraitLayout,row.id);
    assert.equal(row.svg.match(/viewBox="([^"]+)"/)[1],'25 0 270 188',`${row.id}: actual portrait viewport`);
  }
});

test('独立标志物不重复出现在手上；手持模式实际包含所选道具的SVG图形',()=>{
  for(const row of rows){
    const p=row.profile;
    assert.ok(['held','emblem'].includes(p.propMode),`${row.id}: explicit prop mode required`);
    const held=groups(row.body,'data-figure-prop'),emblems=groups(row.body,'data-role-emblem');
    const expected=normalize(game.figV39Object(p.prop,p.cloth,game.L,'#efe6d4',game.z));
    if(p.prop==='none'){
      assert.equal(held.length+emblems.length,0,`${row.id}: no invented prop`);
      continue;
    }
    assert.ok(/<(?:path|rect|circle|ellipse|polygon|polyline|line)\b/.test(expected),`${row.id}: prop must resolve to actual geometry`);
    if(p.propMode==='emblem'){
      assert.equal(held.length,0,`${row.id}: emblem must not also be held`);
      assert.equal(emblems.length,1,`${row.id}: one independent main emblem required`);
      assert.equal(emblems[0].value,p.prop,row.id);
      assert.equal(normalize(emblems[0].body),expected,`${row.id}: actual emblem geometry`);
    }else{
      assert.equal(emblems.length,0,`${row.id}: held object must not be repeated as an emblem`);
      assert.equal(held.length,groups(row.body,'data-figure-v39').length,`${row.id}: every depicted person holds the selected prop`);
      for(const item of held){
        assert.equal(item.value,p.prop,row.id);
        assert.equal(normalize(item.body),expected,`${row.id}: actual held geometry`);
      }
    }
    assert.ok(groups(row.body,'data-role-context').every(item=>item.value!==p.prop),`${row.id}: main prop must not be repeated as context`);
  }
});

test('实际777张SVG有效，185人物去除颜色与标注后没有完全重复的几何',()=>{
  for(const card of game.cards){
    const svg=game.Ct(card);
    assert.ok(svg.startsWith('<svg'),card.id);
    assert.doesNotMatch(svg,/NaN|undefined|Infinity/,card.id);
  }
  const signatures=new Map(),duplicates=[];
  for(const row of rows){
    const signature=crypto.createHash('sha256').update(normalize(row.body)).digest('hex');
    if(signatures.has(signature))duplicates.push([signatures.get(signature),row.id]);
    else signatures.set(signature,row.id);
  }
  assert.deepEqual(duplicates,[],'Exact SVG geometry comparison; this is not a perceptual similarity percentage');
});

test('75张预留人物仍为预留，不冒充已逐卡设计的v50常驻人物',()=>{
  for(const card of reserve){
    assert.equal(overrides[card.id],undefined,card.id);
    assert.doesNotMatch(game.Ct(card),/data-portrait-v50=|data-role-emblem=/,card.id);
    assert.equal(game.ArtProfilesV39.get(card).portraitLayout,undefined,card.id);
  }
});

test('真实ft.body在人物卡范围内；输出不含背景矩形和印章的边界报告',()=>{
  const {Resvg}=require(path.join(root,'../art-raster/node_modules/@resvg/resvg-js'));
  const limits={left:-135,right:135,top:-8,bottom:180};
  const bounds=rows.map(row=>{
    // A generous viewport avoids clipping during measurement; only ft.body is included.
    const drawing=new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -200 600 600" width="600" height="600">${row.body}</svg>`,{font:{loadSystemFonts:false}});
    const box=drawing.getBBox();
    assert.ok(box,`${row.id}: body needs visible geometry`);
    const bbox={left:box.x,top:box.y,right:box.x+box.width,bottom:box.y+box.height};
    const overflow=Object.fromEntries(Object.entries({left:limits.left-bbox.left,right:bbox.right-limits.right,top:limits.top-bbox.top,bottom:bbox.bottom-limits.bottom}).filter(([,value])=>value>.01));
    return {id:row.id,name:row.name,bbox,overflow};
  });
  const failures=bounds.filter(row=>Object.keys(row.overflow).length);
  const report={version:50,indexSha256:crypto.createHash('sha256').update(html).digest('hex'),count:bounds.length,limits,
    method:'Resvg getBBox on actual integrated ft(card).body, including its existing ground ellipse and contextual symbols, without Ct background or seal. Bounding boxes apply SVG transforms; path bounds are approximate. This measures geometry, not perceived similarity.',
    failures,bounds};
  const output=path.join(root,'../figure-v50-bounds.json');
  fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  assert.deepEqual(failures,[],`Out-of-bounds portraits; full report: ${output}`);
});
