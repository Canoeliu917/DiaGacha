const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const helper=fs.readFileSync(path.join(__dirname,'reliability-v53.js'),'utf8').trim();
const startup='Zn.addEventListener(`click`,Tr),Er()';
const key='diamasha.session.v53';
const plain=value=>JSON.parse(JSON.stringify(value));

function harness(stored=new Map(),options={}){
  let writes=0,render=()=>{};
  const app={contains:()=>true,querySelector:()=>null,innerHTML:''};
  const listeners=[],urls=[],document={activeElement:null,sheet:null,background:[],body:{classList:{toggle(){}}},scrollingElement:{scrollTop:0},
    querySelector(selector){return selector==='.sheet'?this.sheet:selector==='#app button'?this.background[0]:selector==='#app'?app:null;},
    querySelectorAll(){return [...this.background,...(this.sheet?.items||[])];},
    getElementById(){return null;},contains(node){return this.querySelectorAll().includes(node);},
    addEventListener(...args){listeners.push(args);}};
  const sandbox={console,URL,URLSearchParams,Intl,navigator:{},document,
    localStorage:{getItem:k=>stored.get(k)||null,setItem(k,value){writes++;if(options.failWrites)throw Error('QuotaExceededError');stored.set(k,String(value));}},
    sessionStorage:{getItem:()=>null,setItem(){}},
    location:{href:'https://canoeliu917.github.io/DiaGacha/?v=53',protocol:'https:',hash:'',search:'?v=53',pathname:'/DiaGacha/'},
    history:{pushState:(_state,_title,url)=>urls.push(url),replaceState(){}},
    addEventListener:(...args)=>listeners.push(args),matchMedia:()=>({matches:true})};
  sandbox.window=sandbox;
  const context=vm.createContext(sandbox);
  assert.equal(html.split(startup).length,2);
  const source=html.replace(startup,()=>`${html.includes('const sessionKeyV53=')?'':helper}
    const actualRenderV53=Z;
    globalThis.testReliability={e,x,activeCards,Y,w,er,saveSessionV53,resumePackV53,restoreProgramV53,renderResumeV53,
      captureSheetFocusV53,restoreSheetFocusV53,sheetKeydownV53,installReliabilityV53,savedRehearsalForCardsV53,reconcileRehearsalV53,wr,turnPageV42,
      applyRewriteV53,renderRehearsalV53,
      useActualRender(){Z=actualRenderV53;revealClearV40=stopProductionV40=stopHomeFloatV40=restoreRevealIntroV40=startHomeFloatV40=queueTalkEnter=()=>{};qn=()=>'';},
      setHistory(entries,cursor){pageHistoryV42=entries;pageCursorV42=cursor;},
      getSession:()=>sessionV53,setRender:fn=>{Z=fn;}};`);
  for(const [i,block]of [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries()){
    vm.runInContext(block[1],context,{filename:`reliability-inline-${i}`,timeout:10000});
  }
  const game=context.testReliability;
  game.setRender(()=>render());
  return {...game,document,stored,urls,listeners,setHash:hash=>{sandbox.location.hash=hash;},setRender:fn=>{render=fn;},writes:()=>writes};
}
function lineup(game){return game.x.map(dim=>game.activeCards.find(card=>card.dimension===dim.key));}
function booster(game,cards,extra={}){
  Object.assign(game.Y,{view:'pack',pack:'mix',drawn:[],booster:{phase:'card',cards,index:2,tutorial:false,tutorialNo:4,revealDone:false,...extra}});
}
function node(document,data){
  return {tagName:'BUTTON',dataset:data,isConnected:true,hidden:false,
    getClientRects:()=>[{}],focus(){document.activeElement=this;}};
}
function sheet(document,items){
  return {tagName:'DIV',dataset:{},items,isConnected:true,querySelectorAll:()=>items,
    contains:item=>items.includes(item),setAttribute(){},focus(){document.activeElement=this;}};
}

test('翻到一半的六卡包重载后恢复同一组牌和进度，不再消耗奖励、任务或收藏',()=>{
  const first=harness(),cards=lineup(first);
  booster(first,cards);
  first.Y.rehearsal={originalIds:cards.map(card=>card.id),change:null};
  first.saveSessionV53();
  const next=harness(first.stored),before=plain({task:next.Y.task,loop:next.Y.loop,owned:next.Y.owned});
  assert.match(next.renderResumeV53(),/继续上次开包/);
  next.resumePackV53();
  assert.equal(next.Y.view,'pack');
  assert.deepEqual(plain(next.Y.booster.cards.map(card=>card.id)),plain(cards.map(card=>card.id)));
  assert.equal(next.Y.booster.index,2);
  assert.equal(next.Y.booster.revealDone,true);
  assert.equal(next.Y.booster.askSkip,false);
  assert.deepEqual(plain(next.Y.rehearsal),plain(first.Y.rehearsal));
  assert.deepEqual(plain({task:next.Y.task,loop:next.Y.loop,owned:next.Y.owned}),before);
});

test('未拆封包和单维包都可恢复，单维包完成后不再显示未完成入口',()=>{
  const first=harness();
  booster(first,[],{phase:'sealed',index:0});first.saveSessionV53();
  const sealed=harness(first.stored),before=plain(sealed.Y.task);
  sealed.resumePackV53();
  assert.equal(sealed.Y.booster.phase,'sealed');assert.equal(sealed.Y.booster.cards.length,0);
  assert.deepEqual(plain(sealed.Y.task),before);
  const cards=first.activeCards.filter(card=>card.dimension==='剧目').slice(0,6);
  booster(first,cards);first.Y.pack='剧目';first.saveSessionV53();
  const single=harness(first.stored);single.resumePackV53();
  assert.equal(single.Y.pack,'剧目');
  assert.deepEqual(plain(single.Y.booster.cards.map(card=>card.id)),plain(cards.map(card=>card.id)));
  Object.assign(single.Y,{view:'bundle',bundle:single.Y.booster.cards,booster:null});single.saveSessionV53();
  assert.equal(single.getSession().draft,null);
});

test('已开齐卡组退出到首页仍可续玩，完成节目单会清除对应未完成包',()=>{
  const game=harness(),cards=lineup(game);booster(game,cards,{phase:'spread',index:5});game.saveSessionV53();
  Object.assign(game.Y,{view:'home',booster:null,drawn:[]});game.saveSessionV53();
  assert.ok(game.getSession().draft);
  const next=harness(game.stored);next.resumePackV53();
  assert.deepEqual(plain(next.Y.drawn.map(card=>card.id)),plain(cards.map(card=>card.id)));
  Object.assign(next.Y,{view:'result',booster:null});next.saveSessionV53();
  assert.equal(next.getSession().draft,null);assert.equal(next.getSession().recent.length,1);
});

test('最近节目单限5个不同卡组，刷新可找回旧五卡和改写状态，恢复不发奖励',()=>{
  const game=harness(),base=lineup(game),plays=game.activeCards.filter(card=>card.dimension==='剧目').slice(0,7);
  for(const play of plays){game.Y.view='result';game.Y.drawn=base.map(card=>card.dimension==='剧目'?play:card);game.saveSessionV53();}
  assert.equal(game.getSession().recent.length,5);
  const beforeWrites=game.writes();game.saveSessionV53();
  assert.equal(game.writes(),beforeWrites,'unmodified render does not rewrite storage');
  const original=base.map(card=>card.id),changed=base.map(card=>card.dimension==='剧目'?plays[1]:card);
  game.Y.drawn=changed;game.Y.rehearsal={originalIds:original,change:{fromId:base[0].id,toId:plays[1].id,dimension:'剧目'}};game.saveSessionV53();
  const next=harness(game.stored),before=plain({task:next.Y.task,loop:next.Y.loop,owned:next.Y.owned});
  next.restoreProgramV53(0);
  assert.deepEqual(plain(next.Y.drawn.map(card=>card.id)),plain(changed.map(card=>card.id)));
  assert.deepEqual(plain(next.Y.rehearsal),plain(game.Y.rehearsal));
  assert.deepEqual(plain({task:next.Y.task,loop:next.Y.loop,owned:next.Y.owned}),before);
  assert.equal(next.urls.at(-1),'#m='+next.w(changed));
  next.Y.drawn=base.filter(card=>card.dimension!=='配角');next.Y.rehearsal=null;next.saveSessionV53();
  const legacy=harness(next.stored);legacy.restoreProgramV53(0);
  assert.equal(legacy.Y.drawn.length,5);assert.doesNotMatch(legacy.renderResumeV53(),/undefined/);
});

test('打开其它旧节目单保留当前未完成包，损坏或失效卡组不会生成恢复入口',()=>{
  const game=harness(),cards=lineup(game);booster(game,cards);game.saveSessionV53();
  const other=cards.map(card=>card.dimension==='剧目'?game.activeCards.filter(item=>item.dimension==='剧目')[1]:card);
  game.Y.view='result';game.Y.drawn=other;game.saveSessionV53();
  game.restoreProgramV53(0);game.saveSessionV53();assert.ok(game.getSession().draft);
  for(const value of ['{broken',JSON.stringify({draft:{pack:'mix',phase:'card',ids:['missing']},recent:[null,{ids:['missing']},{ids:[]}]}),JSON.stringify({recent:'bad',draft:{pack:'made-up',phase:'sealed',ids:[]}})]){
    const next=harness(new Map([[key,value]]));assert.equal(next.renderResumeV53(),'');next.resumePackV53();next.restoreProgramV53(0);assert.equal(next.Y.view,'home');
  }
});

test('当前改写版与同场初始版都保留已用次数，其它新卡组不受影响',()=>{
  const game=harness(),base=lineup(game),replacement=game.activeCards.filter(card=>card.dimension==='剧目')[1];
  const changed=base.map(card=>card.dimension==='剧目'?replacement:card);
  const rehearsal={originalIds:base.map(card=>card.id),change:{fromId:base[0].id,toId:replacement.id,dimension:'剧目'}};
  Object.assign(game.Y,{view:'result',drawn:changed,rehearsal});game.saveSessionV53();
  const next=harness(game.stored);
  assert.deepEqual(plain(next.savedRehearsalForCardsV53(changed.slice().reverse())),plain(rehearsal));
  assert.equal(next.savedRehearsalForCardsV53(base).locked,true);
  assert.equal(next.savedRehearsalForCardsV53(base.map(card=>card.dimension==='剧目'?game.activeCards.filter(item=>item.dimension==='剧目')[2]:card)),null);
  next.setHash('#m='+next.w(changed));next.wr();
  assert.deepEqual(plain(next.Y.rehearsal),plain(rehearsal));
});

test('从最近节目单、原始hash、真实翻页恢复初始卡组，都不能再确认第二次改写',()=>{
  const game=harness(),base=lineup(game),replacement=game.activeCards.filter(card=>card.dimension==='剧目')[1];
  const original={originalIds:base.map(card=>card.id),change:null};
  Object.assign(game.Y,{view:'result',drawn:base,rehearsal:original});game.saveSessionV53();
  const changed=base.map(card=>card.dimension==='剧目'?replacement:card);
  const used={originalIds:original.originalIds,change:{fromId:base[0].id,toId:replacement.id,dimension:'剧目'}};
  Object.assign(game.Y,{drawn:changed,rehearsal:used});game.saveSessionV53();
  const next=harness(game.stored);
  next.restoreProgramV53(1);
  assert.equal(next.Y.rehearsal.locked,true);assert.equal(next.Y.rehearsal.change,null);
  assert.deepEqual(plain(next.Y.drawn.map(card=>card.id)),plain(base.map(card=>card.id)));
  assert.equal(next.applyRewriteV53(next.Y.drawn,next.e,[replacement.id],next.Y.rehearsal,replacement.id),null);
  const rendered=next.renderRehearsalV53(next.Y);
  assert.match(rendered,/已经改写过一次/);assert.doesNotMatch(rendered,/rewrite-confirm|<select/);
  const hash=harness(game.stored);hash.setHash('#m='+hash.w(base));hash.wr();assert.equal(hash.Y.rehearsal.locked,true);
  Object.assign(hash.Y,{view:'result',drawn:changed,rehearsal:used});
  const old={...plain(hash.Y),drawn:plain(base),rehearsal:plain(original)};
  hash.setHistory([{state:old,url:'#m='+hash.w(base),scroll:0},{state:plain(hash.Y),url:'#m='+hash.w(changed),scroll:0}],1);
  hash.useActualRender();hash.turnPageV42(-1);
  assert.equal(hash.Y.rehearsal.locked,true,'actual Z reconciles history state before render');
  assert.deepEqual(plain(hash.Y.drawn.map(card=>card.id)),plain(base.map(card=>card.id)));
});

test('localStorage写入失败时，连续收藏仍保留在内存且本页能恢复卡包',()=>{
  const game=harness(new Map(),{failWrites:true}),cards=lineup(game);
  for(const card of cards)game.er(card.id);
  assert.deepEqual(plain(game.Y.owned).sort(),plain(cards.map(card=>card.id)).sort());
  booster(game,cards);game.saveSessionV53();Object.assign(game.Y,{view:'home',booster:null});game.saveSessionV53();
  assert.match(game.renderResumeV53(),/浏览器尚未保存/);
  game.resumePackV53();assert.equal(game.Y.booster.cards.length,6);
});

test('弹窗进入获得焦点，Tab和Shift+Tab留在弹窗，重绘保留内部焦点，Escape返回原按钮',()=>{
  const game=harness(),doc=game.document,oldTrigger=node(doc,{action:'help'});
  doc.background=[oldTrigger];doc.activeElement=oldTrigger;game.Y.sheet={kind:'help'};
  game.captureSheetFocusV53();
  oldTrigger.isConnected=false;
  const trigger=node(doc,{action:'help'}),close=node(doc,{action:'close-sheet'}),last=node(doc,{action:'tag',id:'card',tag:'说明'});
  doc.background=[trigger];doc.sheet=sheet(doc,[close,last]);game.restoreSheetFocusV53();assert.equal(doc.activeElement,close);
  let prevented=0,stopped=0;
  const event={key:'Tab',shiftKey:false,preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;}};
  last.focus();game.sheetKeydownV53(event);assert.equal(doc.activeElement,close);
  event.shiftKey=true;game.sheetKeydownV53(event);assert.equal(doc.activeElement,last);
  trigger.focus();event.shiftKey=false;game.sheetKeydownV53(event);assert.equal(doc.activeElement,close);assert.equal(prevented,3);
  last.focus();game.captureSheetFocusV53();close.isConnected=false;last.isConnected=false;
  const nextClose=node(doc,{action:'close-sheet'}),nextLast=node(doc,{action:'tag',id:'card',tag:'说明'});
  doc.sheet=sheet(doc,[nextClose,nextLast]);game.restoreSheetFocusV53();assert.equal(doc.activeElement,nextLast);
  game.setRender(()=>{game.captureSheetFocusV53();doc.sheet=null;trigger.isConnected=false;doc.background=[node(doc,{action:'help'})];game.restoreSheetFocusV53();});
  event.key='Escape';game.sheetKeydownV53(event);
  assert.equal(game.Y.sheet,null);assert.equal(doc.activeElement,doc.background[0]);assert.equal(stopped,1);
});

test('无按钮弹窗也可聚焦，监听器只安装一次',()=>{
  const game=harness(),doc=game.document;game.Y.sheet={kind:'help'};doc.sheet=sheet(doc,[]);game.restoreSheetFocusV53();assert.equal(doc.activeElement,doc.sheet);
  let prevented=false;game.sheetKeydownV53({key:'Tab',preventDefault(){prevented=true;}});assert.equal(prevented,true);
  game.installReliabilityV53();game.installReliabilityV53();
  assert.equal(game.listeners.filter(row=>row[0]==='keydown').length,1);
  assert.equal(game.listeners.filter(row=>row[0]==='pagehide').length,1);
});

test('页面内嵌可靠性实现与独立源一致，并在卡池和卡包定义之后初始化',()=>{
  const normalized=html.replace(/\r\n/g,'\n');
  assert.ok(normalized.includes(helper.replace(/\r\n/g,'\n')));
  assert.ok(normalized.indexOf('const sessionKeyV53=')>normalized.indexOf('oe=[...x'));
  assert.ok(normalized.indexOf('const sessionKeyV53=')<normalized.indexOf(startup));
});
