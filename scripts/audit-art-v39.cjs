/* Audit the actual Ct(card) SVGs from the integrated application, not mock art. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const profiles = JSON.parse(fs.readFileSync(path.join(root, 'docs/ART_PROFILES_V39.json'), 'utf8')).cards;
const activeIds = JSON.parse(fs.readFileSync(path.join(root, 'docs/ACTIVE_CARDS_V39.json'), 'utf8')).activeIds;
const byProfile = new Map(profiles.map(p => [p.id,p]));
assert.equal(activeIds.length,500,'Expected 500 active cards');
assert.equal(new Set(activeIds).size,500,'Active card IDs must be unique');
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const storage = {getItem:()=>null,setItem(){},removeItem(){}};
const sandbox = {
  console,URL,URLSearchParams,Intl,Date,Math,
  localStorage:storage,sessionStorage:storage,
  document:{querySelector:s=>s==='#app'?{}:null,getElementById:()=>null},
  location:{href:'https://example.invalid/',protocol:'https:',hash:'',search:'',pathname:'/'},
  matchMedia:()=>({matches:false})
};
sandbox.window=sandbox;
const context=vm.createContext(sandbox);
const startup='Zn.addEventListener(`click`,Tr),Er()';
assert.equal(html.split(startup).length-1,1,'Expected one application startup marker');
const instrumented=html.replace(startup,'globalThis.__ART_AUDIT__={cards:e,Ct,ft,figBodyV39,figureTypes:Object.keys(FIGURE_FEATURES_V39),poses:FIGURE_POSES_V39,costumes:FIGURE_COSTUMES_V39}');
for(const [i,match] of [...instrumented.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries()){
  vm.runInContext(match[1],context,{filename:`index.html:inline-${i+1}`,timeout:10000});
}
const runtime=context.__ART_AUDIT__;
assert(runtime,'Application art renderer did not load');
const byCard=new Map(Array.from(runtime.cards,c=>[c.id,c]));

function normalize(svg){
  return svg
    .replace(/<(?:title|desc|text)\b[^>]*>[\s\S]*?<\/(?:title|desc|text)>/gi,'')
    .replace(/\s(?:id|class|aria-[\w-]+|data-[\w-]+)="[^"]*"/g,'')
    .replace(/url\(#[^)]+\)/g,'url(#clip)')
    .replace(/\s(?:fill|stroke|stop-color)="([^"]+)"/g,(all,value)=>all.replace(value,/^(none|transparent)$/i.test(value)?value:'INK'))
    .replace(/\s(?:opacity|fill-opacity|stroke-opacity)="[^"]*"/g,'')
    .replace(/#[0-9a-f]{3,8}\b/gi,'INK')
    .replace(/\s+/g,' ').replace(/> </g,'><').trim();
}
function groups(rows,key){
  const out=new Map();
  for(const row of rows){const k=key(row);if(!out.has(k))out.set(k,[]);out.get(k).push(row);}
  return [...out.entries()].filter(([,list])=>list.length>1).map(([signature,list])=>({signature,cards:list.map(r=>({id:r.id,name:r.name,dimension:r.dimension,profile:r.features}))}));
}
// Canonicalize metadata variants that do not actually change a family's SVG.
// In particular, bent figures keep a bent body, and seated figures ignore standing poses.
const effectiveVariants={};
for(const fig of runtime.figureTypes){
  const family={pose:{},costume:{}};
  for(const [field,variants] of [['pose',runtime.poses],['costume',runtime.costumes]]){
    const signatures=new Map();
    for(const variant of variants){
      const rec={fig,pose:'stand',costume:'plain',head:'short',face:'quiet',cloth:'#67715f',skin:'fair',prop:'none',[field]:variant};
      const signature=hash(normalize(runtime.figBodyV39(rec)));
      if(!signatures.has(signature))signatures.set(signature,variant);
      family[field][variant]=signatures.get(signature);
    }
  }
  effectiveVariants[fig]=family;
}
const rendered=activeIds.map(id=>{
  const card=byCard.get(id),p=byProfile.get(id);
  assert(card&&p,`Missing active card/profile: ${id}`);
  assert.equal(card.name,p.name,`Stale profile name: ${id}`);
  const svg=runtime.Ct(card);
  assert(svg.startsWith('<svg'),`${id} did not render SVG`);
  assert(!/NaN|undefined/.test(svg),`${id} has invalid SVG values`);
  if(p.kind==='role')assert(svg.includes('data-figure-v39='),`${id} bypassed the v39 figure renderer`);
  if(p.kind==='play'&&p.cast?.length)assert(svg.includes('data-figure-v39='),`${id} did not render its cast`);
  const cast=(p.cast||[]).map(actor=>{
    const rec={...(byProfile.get(actor.roleId)||{}),...actor};
    return Object.fromEntries(['fig','head','face','prop','pose','costume'].map(key=>[key,rec[key]]));
  });
  const features={kind:p.kind,fig:p.fig,head:p.head,face:p.face,prop:p.prop,pose:p.pose,costume:p.costume,scene:p.scene,symbols:p.symbols,staging:p.staging,cast};
  if(p.fig){features.effectivePose=effectiveVariants[p.fig].pose[p.pose];features.effectiveCostume=effectiveVariants[p.fig].costume[p.costume];}
  return {id,name:card.name,no:card.no,dimension:card.dimension,svg,shapeHash:hash(normalize(svg)),features};
});
const dimensionOrder=['主演','配角','剧目','风格体系','导演手法','环境'];
rendered.sort((a,b)=>dimensionOrder.indexOf(a.dimension)-dimensionOrder.indexOf(b.dimension)||a.no-b.no);
const duplicates=groups(rendered,r=>r.shapeHash);
const coreCollisions=groups(rendered,r=>JSON.stringify(r.features.kind==='role'?
  [r.features.fig,r.features.prop,r.features.effectivePose,r.features.effectiveCostume,r.features.scene]:
  [r.features.kind,r.features.scene,r.features.symbols]));
const exactFeatureCollisions=groups(rendered,r=>JSON.stringify(r.features));
const figureFields=['fig','pose','costume','prop','head'];
const roles=rendered.filter(row=>row.features.kind==='role');
const nearFigurePairs=[];
for(let i=0;i<roles.length;i++)for(let j=i+1;j<roles.length;j++){
  const a=roles[i],b=roles[j];
  const actual=(row,key)=>row.features[key==='pose'?'effectivePose':key==='costume'?'effectiveCostume':key];
  const matching=figureFields.filter(key=>actual(a,key)===actual(b,key));
  if(matching.length>=4)nearFigurePairs.push({cards:[{id:a.id,name:a.name},{id:b.id,name:b.name}],matching,different:figureFields.filter(key=>!matching.includes(key))});
}
const outDir=path.join(root,'..','figure-check-v39');
fs.mkdirSync(outDir,{recursive:true});
const report={
  version:39,indexSha256:hash(html),count:rendered.length,
  method:'Render every active card with the integrated Ct(card); remove colors, IDs, labels and opacity, then compare deterministic SVG geometry. Core feature groups flag near cases for human review. This is not a perceptual image-similarity percentage.',
  normalizedDuplicateGroups:duplicates,
  coreFeatureCollisionGroups:coreCollisions,
  exactFeatureCollisionGroups:exactFeatureCollisions,
  figureNearReview:{count:roles.length,fields:figureFields,threshold:'At least 4 of 5 equal: a human review queue, not a perceptual similarity percentage. Pose/costume aliases are normalized by rendering all 21 families with fixed colors/head/no prop; ineffective metadata differences do not count.',effectiveVariants,pairs:nearFigurePairs},
  note:'A feature collision is a review queue, not proof that two differently posed or differently detailed pictures look identical.'
};
fs.writeFileSync(path.join(outDir,'art-audit-v39.json'),JSON.stringify(report,null,2));
fs.writeFileSync(path.join(outDir,'rendered-cards-v39.json'),JSON.stringify(rendered));
fs.writeFileSync(path.join(outDir,'cards-v39.json'),JSON.stringify(rendered.map(({id,name,dimension,svg})=>({id,name,dimension,svg}))));
const escape=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const pages=Math.ceil(rendered.length/42);
const links=Array.from({length:pages},(_,i)=>`<a href="contact-${String(i+1).padStart(2,'0')}.html">${i+1}</a>`).join(' ');
for(let page=0;page<pages;page++){
  const cards=rendered.slice(page*42,page*42+42);
  const cells=cards.map(card=>{
    const p=card.features;
    const details=p.kind==='role'?[p.fig,p.head,p.prop,p.pose,p.costume,p.face]:[p.kind,p.scene,p.staging,...(p.symbols||[]),p.cast.length?`cast:${p.cast.map(c=>c.fig).join('+')}`:null];
    return `<article data-card-id="${escape(card.id)}">${card.svg}<b>${escape(card.name)}</b><small>${escape(card.dimension)} · #${card.no}</small><code>${escape(details.filter(Boolean).join(' / '))}</code></article>`;
  }).join('');
  fs.writeFileSync(path.join(outDir,`contact-${String(page+1).padStart(2,'0')}.html`),`<!doctype html><html lang="zh"><meta charset="utf-8"><title>DiaGacha v39 · ${page+1}/${pages}</title><style>*{box-sizing:border-box}body{margin:0;padding:18px;background:#f3efe6;color:#241c16;font:14px system-ui,sans-serif}h1{font-size:20px;margin:0 0 10px}nav{margin-bottom:16px}nav a{display:inline-block;padding:5px 10px;color:#9c2f2f}main{display:grid;grid-template-columns:repeat(7,160px);gap:14px 10px}article{background:#fffcf8;padding:0 0 7px;min-height:153px;overflow:hidden}article svg{display:block;width:160px;height:94px}b,small,code{display:block;margin:3px 6px}b{font-size:12px;line-height:1.25}small{font-size:10px;color:#746753}code{font:9px/1.25 monospace;color:#65594a;overflow-wrap:anywhere}</style><h1>第 ${page+1}/${pages} 页 · ${page*42+1}–${page*42+cards.length}/500</h1><nav>${links}</nav><main>${cells}</main></html>`);
}
console.log(JSON.stringify({count:rendered.length,normalizedDuplicateGroups:duplicates.length,coreFeatureCollisionGroups:coreCollisions.length,exactFeatureCollisionGroups:exactFeatureCollisions.length,nearFigurePairs:nearFigurePairs.length,outDir}));
