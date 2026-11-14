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
const dimensions=['剧目','风格体系','导演手法','主演','配角','环境'];
const base=dimensions.map(dimension=>pool.find(card=>card.dimension===dimension));
const plain=value=>JSON.parse(JSON.stringify(value));
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
function harness(stored=new Map()){
  const events=[],owned=JSON.parse(stored.get('test.owned')||JSON.stringify(base.map(card=>card.id)));
  const sandbox={e:all,activeCards:pool,K:escape,copyDimension:dim=>dim,Ct:card=>`<svg data-art="${card.id}"></svg>`,
    productionScore:cards=>scoring.production(cards),shortScene:talk.shortScene,dramaticTitleV40:talk.dramaticTitleV40,shareStoryBeatV54:talk.shareStoryBeatV54,
    localStorage:{getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,String(value))},
    Y:{view:'result',drawn:base.slice(),owned,rehearsal:{originalIds:base.map(card=>card.id),change:null},rehearsalPreview:'',fromShare:false},
    Z:()=>events.push('render'),Q:message=>events.push(message),finishProductionV40(){},lastSharePoster:null,
    w:cards=>cards.map(card=>card.id).join('.'),sessionStorage:{setItem(){}},history:{state:{},replaceState(){}},
    location:{protocol:'https:',pathname:'/DiaGacha/'},
    document:{getElementById:()=>({focus(){}}),querySelector:()=>({focus(){}})},
  };
  sandbox.er=id=>{sandbox.Y.owned=[...new Set([...sandbox.Y.owned,id])];stored.set('test.owned',JSON.stringify(sandbox.Y.owned));events.push({grant:id});};
  const context=vm.createContext(sandbox);
  for(const file of ['share-v53.js','v54-achievements.js','gameplay-v53.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),context,{filename:file});
  vm.runInContext('globalThis.api={recordOwnProgramV54,exportProgressV54,importProgressV54,sanitizeProgressV54,mergeProgressV54,starterCandidateIdsV54,starterSpentV54,recordPreviewV54,recordRewriteV54,renderAchievementsV54,renderRehearsalV53,handleRehearsalV53,applyRewriteV53,previewRewriteV53,stagePersonaV53};',context);
  return {api:context.api,context,events,stored};
}
function preview(game,id){game.api.handleRehearsalV53('rewrite-preview',{dataset:{cardId:id}});}
function confirm(game){game.api.handleRehearsalV53('rewrite-confirm',{});}

test('首场固定两张同维候选，三版故事不同；预览不入藏，仅确认的一张入藏',()=>{
  const game=harness(),before=game.context.Y.owned.slice();
  game.api.recordOwnProgramV54(base);
  const starter=game.api.exportProgressV54().starter;
  assert.equal(starter.candidates.length,2);
  const choices=starter.candidates.map(id=>pool.find(card=>card.id===id));
  assert.equal(choices[0].dimension,choices[1].dimension);
  const stories=[base,...choices.map(choice=>base.map(card=>card.dimension===choice.dimension?choice:card))].map(talk.shortScene);
  assert.equal(new Set(stories).size,3);
  preview(game,starter.candidates[0]);preview(game,starter.candidates[1]);
  assert.deepEqual(plain(game.context.Y.owned),before);
  confirm(game);
  assert.deepEqual(plain(game.context.Y.owned).sort(),[...before,starter.candidates[1]].sort());
  assert.ok(!game.context.Y.owned.includes(starter.candidates[0]));
  assert.equal(game.events.filter(event=>event.grant).length,1);
  assert.ok(game.api.exportProgressV54().unlocked.includes('compare'));
  const snapshot=JSON.stringify(game.api.exportProgressV54());confirm(game);
  assert.equal(JSON.stringify(game.api.exportProgressV54()),snapshot);
  assert.equal(game.events.filter(event=>event.grant).length,1);
});

test('刷新保持候选与比较进度，确认后回到原始卡组或新局均不重新赠送',()=>{
  const first=harness();first.api.recordOwnProgramV54(base);
  const starter=plain(first.api.exportProgressV54().starter);
  preview(first,starter.candidates[0]);
  const resumed=harness(first.stored);
  assert.deepEqual(plain(resumed.api.exportProgressV54().starter),starter);
  preview(resumed,starter.candidates[1]);confirm(resumed);
  const reloaded=harness(first.stored);
  assert.ok(reloaded.api.exportProgressV54().unlocked.includes('compare'));
  assert.equal(reloaded.api.starterCandidateIdsV54(base,reloaded.context.Y.rehearsal).length,0);
  assert.equal(reloaded.api.previewRewriteV53(base,all,reloaded.context.Y.owned,reloaded.context.Y.rehearsal,starter.candidates[0]),null,'Unclaimed gift stays unavailable');
  assert.ok(reloaded.api.previewRewriteV53(base,all,pool.map(card=>card.id),reloaded.context.Y.rehearsal,starter.candidates[0]),'An independently owned copy remains usable');
  const other=base.map(card=>card.dimension==='剧目'?pool.find(next=>next.dimension==='剧目'&&next.id!==card.id):card);
  reloaded.api.recordOwnProgramV54(other);
  assert.deepEqual(plain(reloaded.api.exportProgressV54().starter.ids),starter.ids);
  assert.equal(reloaded.api.starterCandidateIdsV54(other,{originalIds:other.map(card=>card.id)}).length,0);
});

test('并存页面完成首包不会覆盖另一页已获得印记或重开赠卡',()=>{
  const stored=new Map(),first=harness(stored),oldPage=harness(stored);
  first.api.recordOwnProgramV54(base);
  const choices=first.api.exportProgressV54().starter.candidates;
  preview(first,choices[0]);preview(first,choices[1]);confirm(first);
  const earned=plain(first.api.exportProgressV54());
  oldPage.api.recordOwnProgramV54(base);
  assert.deepEqual(plain(oldPage.api.exportProgressV54()),earned);
  assert.deepEqual(JSON.parse(stored.get('diamasha.progress.v54')),earned);
  assert.equal(oldPage.api.starterCandidateIdsV54(base,oldPage.context.Y.rehearsal).length,0);
});

test('两页均已预览时，后确认的页面不能领取第二张首场候选',()=>{
  const first=harness();first.api.recordOwnProgramV54(base);
  const oldPage=harness(first.stored),choices=first.api.exportProgressV54().starter.candidates;
  preview(first,choices[0]);preview(oldPage,choices[1]);
  confirm(first);confirm(oldPage);
  assert.equal(first.events.filter(event=>event.grant).length,1);
  assert.equal(oldPage.events.filter(event=>event.grant).length,0);
  assert.equal(oldPage.api.exportProgressV54().starter.claimedId,choices[0]);
  assert.equal(oldPage.context.Y.rehearsal.change,null);
});

test('存储失败时同步仍保留本页已获得印记与已消费首场',()=>{
  const game=harness();game.api.recordOwnProgramV54(base);
  const choices=game.api.exportProgressV54().starter.candidates;
  game.context.localStorage.setItem=()=>{throw Error('quota');};
  preview(game,choices[0]);preview(game,choices[1]);confirm(game);
  const saved=plain(game.api.exportProgressV54());
  assert.equal(saved.starter.claimedId,choices[1]);
  assert.ok(saved.unlocked.includes('compare'));
  game.context.localStorage.getItem=()=>{throw Error('storage unavailable');};
  assert.deepEqual(plain(game.api.exportProgressV54()),saved);
  confirm(game);
  assert.equal(game.events.filter(event=>event.grant).length,1);
});

test('另一页明确导入替换进度后，旧页面不会把原成就合并回来',()=>{
  const stored=new Map(),oldPage=harness(stored),importPage=harness(stored);
  oldPage.api.recordOwnProgramV54(base);
  assert.ok(oldPage.api.exportProgressV54().unlocked.includes('opening'));
  importPage.api.importProgressV54({version:1,unlocked:[],dimensions:[],starter:null,previews:[]});
  assert.deepEqual(plain(oldPage.api.exportProgressV54().unlocked),[]);
  assert.equal(oldPage.api.exportProgressV54().starter,null);
});

test('浏览好友节目单、渲染称号、同一候选重复预览均不伪造完成事件',()=>{
  const game=harness();game.context.Y.fromShare=true;
  game.api.renderAchievementsV54();game.api.renderRehearsalV53(game.context.Y,all);
  assert.deepEqual(plain(game.api.exportProgressV54().unlocked),[]);
  assert.equal(game.api.exportProgressV54().starter,null);
  const candidate=pool.find(card=>card.dimension==='主演'&&card.id!==base[3].id);
  game.context.Y.owned.push(candidate.id);
  preview(game,candidate.id);preview(game,candidate.id);confirm(game);
  assert.ok(game.api.exportProgressV54().unlocked.includes('rewrite'));
  assert.ok(!game.api.exportProgressV54().unlocked.includes('compare'));
  assert.ok(!game.api.exportProgressV54().unlocked.includes('opening'));
  assert.equal(game.context.Y.fromShare,false,'Applying a genuinely owned card creates an own programme');
});

test('单维候选保留卡面分页名称星级单卡分，点击收藏同步正文，不再重复分项账单',()=>{
  const game=harness();game.context.Y.owned=pool.map(card=>card.id);
  game.api.handleRehearsalV53('rewrite-open',{dataset:{dimension:'主演'}});
  let markup=game.api.renderRehearsalV53(game.context.Y,all);
  assert.equal((markup.match(/data-action="rewrite-preview"/g)||[]).length,12);
  assert.match(markup,/data-art=/);assert.match(markup,/单卡 \d+ 分/);assert.match(markup,/\d 星/);
  const candidate=pool.find(card=>card.dimension==='主演'&&card.id!==base[3].id);
  assert.ok(markup.includes(escape(candidate.name)));
  preview(game,candidate.id);markup=game.api.renderRehearsalV53(game.context.Y,all);
  assert.equal(game.context.Y.drawn[3].id,candidate.id);
  assert.doesNotMatch(markup,/rewrite-comparison-v54|对照原来的故事|同星奖励|羁绊奖励|分数升降|data-action="rewrite-confirm"/);
  assert.match(markup,/查看初始卡组/);
});

test('七枚印记以真实换前后结果判定，不依赖升分高星或转发，导入导出保留完整小集合',()=>{
  const game=harness();game.api.recordOwnProgramV54(base);
  let personaChanged=false,reunion=false;
  for(const dimension of dimensions){
    // Different programmes retain a single confirmation each; choose by narrative and source links.
    const initial=base.map(card=>card.dimension==='主演'?pool.find(next=>next.dimension==='主演'&&!next.workIds?.some(id=>base[0].workIds?.includes(id))):card);
    if(dimension!=='环境')initial[5]=pool.filter(card=>card.dimension==='环境')[dimensions.indexOf(dimension)+1];
    const options=pool.filter(card=>card.dimension===dimension&&!initial.some(item=>item.id===card.id));
    const scored=options.map(candidate=>{
      const drawn=initial.map(card=>card.dimension===dimension?candidate:card),before=scoring.production(initial),after=scoring.production(drawn);
      return {candidate,drawn,before,after,
        persona:game.api.stagePersonaV53(initial).number!==game.api.stagePersonaV53(drawn).number,
        reunion:after.bondDetails.some(bond=>!before.bondDetails.some(old=>old.id===bond.id))};
    });
    const choice=(dimension==='主演'?scored.find(row=>row.reunion):null)||(['风格体系','导演手法'].includes(dimension)?scored.find(row=>row.persona):null)||scored[0];
    const rehearsal={originalIds:initial.map(card=>card.id),change:null};
    const other=options.find(card=>card.id!==choice.candidate.id);
    game.api.recordPreviewV54(initial,rehearsal,other.id);game.api.recordPreviewV54(initial,rehearsal,choice.candidate.id);
    const result=game.api.applyRewriteV53(initial,all,pool.map(card=>card.id),rehearsal,choice.candidate.id,cards=>scoring.production(cards));
    assert.ok(result);game.api.recordRewriteV54(initial,result);
    personaChanged ||= ['风格体系','导演手法'].includes(dimension)&&choice.persona;reunion ||= choice.reunion;
  }
  assert.equal(personaChanged,true);assert.equal(reunion,true);
  const saved=plain(game.api.exportProgressV54());
  assert.deepEqual(saved.unlocked.slice().sort(),['opening','rewrite','compare','persona','perspectives','reunion','weaver'].sort());
  assert.equal(saved.dimensions.length,6);
  assert.deepEqual(plain(game.api.importProgressV54(saved)),saved);
  assert.equal(game.context.Y.task,undefined,'achievements do not add task rewards or change rates');
});

test('存档校验剔除未知字段和失效候选；纯合并不会清掉已消费首局或改变输入',()=>{
  const game=harness();game.api.recordOwnProgramV54(base);
  const initial=plain(game.api.exportProgressV54()),id=initial.starter.candidates[0];
  preview(game,id);confirm(game);const spent=plain(game.api.exportProgressV54());
  const before=JSON.stringify({initial,spent});
  const merged=plain(game.api.mergeProgressV54(spent,initial));
  assert.equal(merged.starter.claimedId,id);
  assert.equal(JSON.stringify({initial,spent}),before);
  assert.equal(game.api.exportProgressV54().starter.claimedId,id);
  const cleaned=plain(game.api.sanitizeProgressV54({unlocked:['opening','admin','opening'],dimensions:['主演','fake'],secret:'discard',starter:{ids:base.map(card=>card.id),candidates:['not-a-card',id]}}));
  assert.deepEqual(cleaned.unlocked,['opening']);assert.deepEqual(cleaned.dimensions,['主演']);
  assert.equal(cleaned.starter,null);assert.ok(!Object.hasOwn(cleaned,'secret'));
});
