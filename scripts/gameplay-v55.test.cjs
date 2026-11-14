const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const scoring=require('./scoring-v38.js');
const talk=require('./talk-v39.js');
const root=path.resolve(__dirname,'..');
const all=JSON.parse(fs.readFileSync(path.join(root,'docs/cards.json'),'utf8'));
const active=new Set(JSON.parse(fs.readFileSync(path.join(root,'docs/ACTIVE_CARDS_V39.json'),'utf8')).activeIds);
const pool=all.filter(card=>active.has(card.id));
const dims=['剧目','风格体系','导演手法','主演','配角','环境'];
const base=dims.map(dimension=>pool.find(card=>card.dimension===dimension));
const plain=v=>JSON.parse(JSON.stringify(v));
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function harness(stored=new Map(),owned=pool.map(card=>card.id)){
 const events=[],scope={e:all,activeCards:pool,x:dims.map(key=>({key})),oe:[{id:'mix'}],K:escape,copyDimension:d=>d,Ct:c=>`<svg data-art="${c.id}"></svg>`,productionScore:scoring.production,shortScene:talk.shortScene,dramaticTitleV40:talk.dramaticTitleV40,shareStoryBeatV54:talk.shareStoryBeatV54,
  localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,String(v))},
  sessionStorage:{setItem(){}},location:{protocol:'https:',pathname:'/DiaGacha/'},history:{state:{},replaceState:(state,title,url)=>events.push({url}),pushState(){}},
  document:{getElementById:id=>({focus:()=>events.push({focus:id})}),querySelector:()=>null},
  Y:{view:'result',drawn:base.slice(),owned:owned.slice(),rehearsal:{originalIds:base.map(c=>c.id),change:null},rehearsalPreview:''},Q:m=>events.push(m),finishProductionV40(){},lastSharePoster:'cached',w:cards=>cards.map(c=>c.id).join('.'),
  re(cards,ids){if(!Array.isArray(ids)||![5,6].includes(ids.length)||new Set(ids).size!==ids.length)return null;const line=ids.map(id=>cards.find(c=>c.id===id));const expected=dims.filter(d=>ids.length===6||d!=='配角');return line.every((c,i)=>c?.dimension===expected[i])?line:null;}};
 scope.er=id=>{scope.Y.owned=[...new Set([...scope.Y.owned,id])];events.push({grant:id});};
 const context=vm.createContext(scope);
 for(const name of ['share-v53.js','v54-achievements.js','gameplay-v53.js','reliability-v53.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,name),'utf8'),context,{filename:name});
 vm.runInContext('globalThis.api={handleRehearsalV53,renderRehearsalV53,renderRewriteEntryV55,recordOwnProgramV54,exportProgressV54,starterCandidateIdsV54,recordRewriteV54,saveSessionV53,savedRehearsalV53,readSessionV53,restoreProgramV53,previewRewriteV53};',context);
 context.Z=()=>{context.api.saveSessionV53();events.push('render');};
 return {context,api:context.api,events,stored};
}
const click=(g,id)=>g.api.handleRehearsalV53('rewrite-preview',{dataset:{cardId:id}});
const open=(g,dimension)=>g.api.handleRehearsalV53('rewrite-open',{dataset:{dimension}});

test('同场跨维和同维连续替换即时更新，无额外入藏或分数副本，刷新保留最初卡组与最后动作',()=>{
 const g=harness(),ids=base.map(c=>c.id);g.api.saveSessionV53();
 const replacements=pool.filter(c=>c.dimension==='主演'&&!ids.includes(c.id)).slice(0,3);
 for(const card of replacements){click(g,card.id);assert.equal(g.context.Y.drawn[3].id,card.id);assert.equal(g.context.Y.rehearsalPreview,'');}
 const location=pool.find(c=>c.dimension==='环境'&&!ids.includes(c.id));click(g,location.id);
 assert.equal(g.context.Y.drawn[5].id,location.id);
 click(g,replacements[0].id);
 assert.equal(g.context.Y.rehearsal.change.fromId,replacements[2].id);
 assert.deepEqual(plain(g.context.Y.rehearsal.originalIds),ids);
 assert.equal(g.events.filter(e=>e.grant).length,0);
 assert.equal(g.context.lastSharePoster,null);
 const restored=harness(g.stored);restored.api.restoreProgramV53(0);
 assert.deepEqual(plain(restored.context.Y.drawn.map(c=>c.id)),plain(g.context.Y.drawn.map(c=>c.id)));
 assert.deepEqual(plain(restored.context.Y.rehearsal),plain(g.context.Y.rehearsal));
 click(restored,base[3].id);assert.equal(restored.context.Y.drawn[3].id,base[3].id);
 assert.equal(restored.context.Y.drawn[5].id,location.id);
});

test('先替换自有卡不会消费首场赠卡；领取一张后自有卡仍可继续替换且未选赠卡不可用',()=>{
 const other=pool.find(c=>c.dimension==='剧目'&&c.id!==base[0].id);
 const g=harness(new Map(),[...base.map(c=>c.id),other.id]);g.api.recordOwnProgramV54(base);
 const gifts=plain(g.api.exportProgressV54().starter.candidates);
 click(g,other.id);
 assert.equal(g.api.exportProgressV54().starter.claimedId,null);
 assert.deepEqual(plain(g.api.starterCandidateIdsV54(g.context.Y.drawn,g.context.Y.rehearsal)),gifts);
 click(g,gifts[0]);assert.equal(g.context.Y.drawn[1].id,base[1].id,'Gift needs explicit claim');
 open(g,'风格体系');click(g,gifts[0]);
 const previewLine=base.map(c=>c.dimension==='剧目'?other:c).map(c=>c.dimension==='风格体系'?all.find(c=>c.id===gifts[0]):c);
 assert.ok(g.api.renderRehearsalV53(g.context.Y,all).includes(escape(talk.shareStoryBeatV54(previewLine))));
 click(g,gifts[1]);g.api.handleRehearsalV53('rewrite-confirm',{});
 assert.equal(g.context.Y.drawn[1].id,gifts[1]);assert.equal(g.api.exportProgressV54().starter.claimedId,gifts[1]);
 click(g,base[0].id);click(g,other.id);assert.equal(g.context.Y.drawn[0].id,other.id);
 assert.equal(g.api.previewRewriteV53(g.context.Y.drawn,all,g.context.Y.owned,g.context.Y.rehearsal,gifts[0]),null);
 assert.equal(g.events.filter(e=>e.grant).length,1);
});

test('六个卡下入口可独立开启同维收藏，分页及长名字完整，收起和即时替换均返回对应按钮',()=>{
 const g=harness();
 assert.equal(g.api.renderRehearsalV53(g.context.Y,all),'');
 for(const card of base){const entry=g.api.renderRewriteEntryV55(g.context.Y,card,all);assert.match(entry,/data-action="rewrite-open"/);assert.ok(entry.includes(`data-dimension="${card.dimension}"`));}
 open(g,'主演');let markup=g.api.renderRehearsalV53(g.context.Y,all);
 const ids=[...markup.matchAll(/data-card-id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,12);
 assert.ok(ids.every(id=>all.find(c=>c.id===id).dimension==='主演'));
 assert.match(markup,/data-art=/);assert.match(markup,/aria-label="\d 星"/);assert.match(markup,/单卡 \d+ 分/);
 assert.doesNotMatch(markup,/对照原来的故事|整台 .*→|同星奖励|羁绊奖励|分数升降/);
 const candidate=all.find(c=>c.id===ids[0]),saved=candidate.name;candidate.name='极长卡名'.repeat(10)+'<测试&"';
 markup=g.api.renderRehearsalV53(g.context.Y,all);assert.ok(markup.includes(escape(candidate.name)));candidate.name=saved;
 g.api.handleRehearsalV53('rewrite-page',{dataset:{page:'1'}});markup=g.api.renderRehearsalV53(g.context.Y,all);
 assert.ok(!ids.includes([...markup.matchAll(/data-card-id="([^"]+)"/g)][0][1]));
 g.api.handleRehearsalV53('rewrite-close',{});assert.equal(g.api.renderRehearsalV53(g.context.Y,all),'');
 assert.equal(g.events.at(-1).focus,'rewrite-open-v55-3');
 open(g,'主演');click(g,ids[0]);assert.equal(g.events.findLast(e=>e.focus)?.focus,'rewrite-open-v55-3');
});

test('旧locked存档迁移为可替换状态，最后替换fromId可来自中途收藏，伪造异维记录仍拒绝',()=>{
 const g=harness(),choices=pool.filter(c=>c.dimension==='主演'&&!base.includes(c)).slice(0,2),current=base.map(c=>c.dimension==='主演'?choices[1]:c);
 const data={originalIds:base.map(c=>c.id),locked:true,change:{fromId:choices[0].id,toId:choices[1].id,dimension:'主演'}};
 const clean=g.api.savedRehearsalV53(data,current);assert.equal(clean.locked,undefined);assert.equal(clean.change.fromId,choices[0].id);
 assert.equal(g.api.savedRehearsalV53({...data,change:{...data.change,fromId:base[0].id}},current),null);
 assert.equal(g.api.savedRehearsalV53({...data,change:{...data.change,toId:base[3].id}},current),null);
 assert.ok(g.api.previewRewriteV53(current,all,g.context.Y.owned,clean,base[3].id));
});

test('查看分享不赠卡或成就；使用自己的收藏生成新节目单，原卡组保持不变',()=>{
 const g=harness(new Map(),base.map(c=>c.id));g.context.Y.fromShare=true;
 const candidate=pool.find(c=>c.dimension==='主演'&&!base.includes(c));
 const before=JSON.stringify({drawn:g.context.Y.drawn,owned:g.context.Y.owned,progress:g.api.exportProgressV54()});
 for(const card of base)assert.match(g.api.renderRewriteEntryV55(g.context.Y,card,all),/data-action="rewrite-open"/);
 open(g,'主演');click(g,candidate.id);g.api.handleRehearsalV53('rewrite-confirm',{});
 assert.match(g.api.renderRehearsalV53(g.context.Y,all),/没有可替换的收藏/);
 assert.equal(JSON.stringify({drawn:g.context.Y.drawn,owned:g.context.Y.owned,progress:g.api.exportProgressV54()}),before);
 assert.equal(g.context.lastSharePoster,'cached');
 g.context.Y.owned.push(candidate.id);click(g,candidate.id);
 assert.equal(g.context.Y.drawn[3].id,candidate.id);assert.equal(g.context.Y.fromShare,false);
 assert.equal(base[3].id,JSON.parse(before).drawn[3].id);
 assert.equal(g.events.filter(e=>e.grant).length,0);
 assert.deepEqual(plain(g.api.exportProgressV54().unlocked),['rewrite']);
 assert.ok(g.events.findLast(e=>e.url).url.includes(candidate.id));
});

test('创意组合与演法手段兼容不授予旧识重逢，只有新增且有来源的原作羁绊可以',()=>{
 const g=harness(),replacement=pool.find(c=>c.dimension==='主演'&&!base.includes(c));
 const result={drawn:base.map(c=>c.dimension==='主演'?replacement:c),rehearsal:{originalIds:base.map(c=>c.id)},change:{fromId:base[3].id,toId:replacement.id,dimension:'主演'},before:{bondDetails:[]},after:{bondDetails:[{id:'creative-pair',workIds:['invented']},{id:'style-method',workIds:[]}]}};
 g.api.recordRewriteV54(base,result);assert.ok(!g.api.exportProgressV54().unlocked.includes('reunion'));
 result.after.bondDetails=[{id:'play-lead',workIds:[]}];g.api.recordRewriteV54(base,result);assert.ok(!g.api.exportProgressV54().unlocked.includes('reunion'));
 result.after.bondDetails=[{id:'play-lead',workIds:['source-work']}];g.api.recordRewriteV54(base,result);assert.ok(g.api.exportProgressV54().unlocked.includes('reunion'));
});
