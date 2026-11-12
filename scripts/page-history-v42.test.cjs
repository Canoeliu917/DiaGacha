const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'page-history-v42.js'),'utf8');
function harness(){
  const state={view:'home',index:0,drawn:[],pack:'mix',packCard:null,albumDim:'全部',albumSort:'rarity',fromShare:false,problems:[],bundle:[],booster:null,fromPack:false,slot:'',talkOpen:false,keptShare:null,sheet:null,owned:['already'],task:{charges:2,mix:4},loop:{pity:8}};
  const document={scrollingElement:{scrollTop:0}},location={pathname:'/',search:'',hash:''},urls=[];
  const context=vm.createContext({Y:state,document,location,history:{state:null,replaceState(_state,_title,url){urls.push(url);location.hash=url.includes('#')?'#'+url.split('#')[1]:'';}}});
  vm.runInContext(source,context);
  context.Z=()=>{context.recordPageV42();document.scrollingElement.scrollTop=0;};
  context.Z();
  return {state,context,document,location,urls,visit(view){state.view=view;context.Z();},size:()=>vm.runInContext('pageHistoryV42.length',context)};
}

test('首页双箭头禁用，前后翻页保留页面与滚动位置',()=>{
  const h=harness();
  assert.equal((h.context.renderPageArrowsV42().match(/ disabled/g)||[]).length,2);
  h.document.scrollingElement.scrollTop=160;
  h.visit('album');h.document.scrollingElement.scrollTop=420;
  h.visit('bag');h.document.scrollingElement.scrollTop=80;
  h.context.turnPageV42(-1);
  assert.equal(h.state.view,'album');assert.equal(h.document.scrollingElement.scrollTop,420);
  h.context.turnPageV42(-1);
  assert.equal(h.state.view,'home');assert.equal(h.document.scrollingElement.scrollTop,160);
  h.context.turnPageV42(1);
  assert.equal(h.state.view,'album');assert.equal(h.document.scrollingElement.scrollTop,420);
  h.context.turnPageV42(1);
  assert.equal(h.state.view,'bag');assert.equal(h.document.scrollingElement.scrollTop,80);
  assert.equal(h.size(),3);
});

test('同页过滤、详情及抽卡进度更新当前页，不生成伪页；新分支清除前进页',()=>{
  const h=harness();h.visit('album');
  h.state.albumDim='剧目';h.state.albumSort='name';h.context.Z();
  h.state.sheet={kind:'card',id:'a'};h.context.Z();
  assert.equal(h.size(),2);
  h.state.sheet=null;h.visit('bag');
  h.context.turnPageV42(-1);
  assert.equal(h.state.albumDim,'剧目');assert.equal(h.state.albumSort,'name');assert.equal(h.state.sheet,null);
  h.state.sheet={kind:'help'};h.context.Z();
  assert.equal(h.size(),3);
  assert.doesNotMatch(h.context.renderPageArrowsV42(),/data-action="page-forward"[^>]* disabled/);
  h.context.turnPageV42(1);assert.equal(h.state.view,'bag');
  h.context.turnPageV42(-1);assert.equal(h.state.sheet,null);
  h.visit('pack');h.state.booster={phase:'card',cards:[{id:'a'},{id:'b'}],index:0,revealDone:false};h.context.Z();
  h.state.booster.index=1;h.context.Z();
  assert.equal(h.size(),3);
  h.context.turnPageV42(1);
  assert.equal(h.state.view,'pack');assert.equal(h.state.booster.index,1);
  assert.match(h.context.renderPageArrowsV42(),/data-action="page-forward"[^>]* disabled/);
});

test('真实下一张与演后谈流程能继续使用快照卡组，不重新抽卡、不重复奖励',()=>{
  const h=harness(),dimensions=['script','lead','tech','support','style','space'];
  const cards=dimensions.map((dimension,index)=>({id:'card-'+index,dimension,rarity:3,atk:70+index,def:78,tags:['来源'],note:'介绍'}));
  h.state.booster={phase:'card',cards,index:4,revealDone:false,askSkip:false};h.visit('pack');
  h.state.drawn=cards;h.state.booster=null;h.visit('result');
  h.state.task.lineup=true;h.state.task.claimed={lineup:false};
  const economy=JSON.stringify([h.state.owned,h.state.task,h.state.loop]);
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const extract=(name,next)=>{const start=html.lastIndexOf('function '+name+'(');return html.slice(start,html.indexOf(next,start));};
  let rewards=0,draws=0,reveals=0;
  Object.assign(h.context,{lastSharePoster:null,x:dimensions.map(key=>({key})),pe:()=>false,ue:()=>false,dr:()=>draws++,$:()=>reveals++,w:items=>items.map(card=>card.id).join('.'),Re:()=>rewards++,O:()=>{},Q:()=>{},sessionStorage:{setItem:()=>{}}});
  h.context.history.pushState=(_state,_title,url)=>{h.location.hash=url;};
  vm.runInContext(extract('fr','function enterSpread')+extract('enterSpread','function pr')+extract('pr','function mr')+extract('hr','function gr')+extract('xr','async function Sr'),h.context);
  h.context.turnPageV42(-1);
  h.context.hr(true);assert.equal(h.state.booster.index,5);assert.equal(reveals,1);
  h.context.hr(true);assert.equal(h.state.booster.phase,'spread');
  assert.deepEqual(JSON.parse(JSON.stringify(h.state.drawn)),cards);
  h.context.pr();assert.equal(h.state.view,'result');assert.equal(h.state.booster,null);
  assert.equal(draws,0);assert.equal(rewards,0);
  assert.equal(JSON.stringify([h.state.owned,h.state.task,h.state.loop]),economy);
});

test('返回保留已抽卡组及分享地址，不回滚收藏、次数、保底或再次触发揭晓',()=>{
  const h=harness(),cards=[{id:'a',atk:88,def:90},{id:'b',atk:61,def:70}];
  h.state.booster={phase:'card',cards,index:1,revealDone:false,askSkip:true,skipPreamble:true};
  h.location.hash='#m=a.b';h.visit('pack');
  h.state.drawn=cards.slice();h.state.booster=null;h.state.talkOpen=true;h.visit('result');
  h.state.owned.push('a','b');h.state.task.charges=1;h.state.task.mix=5;h.state.loop.pity=9;
  const owned=h.state.owned,task=h.state.task,loop=h.state.loop;
  h.context.turnPageV42(-1);
  assert.equal(h.state.view,'pack');assert.deepEqual(JSON.parse(JSON.stringify(h.state.booster.cards)),cards);
  assert.equal(h.state.booster.index,1);assert.equal(h.state.booster.revealDone,true);
  assert.equal(h.state.booster.askSkip,false);assert.equal(h.state.booster.skipPreamble,false);
  assert.equal(h.state.owned,owned);assert.equal(h.state.task,task);assert.equal(h.state.loop,loop);
  assert.equal(h.state.task.charges,1);assert.equal(h.state.task.mix,5);assert.equal(h.state.loop.pity,9);
  assert.equal(h.urls.at(-1),'/#m=a.b');
  h.context.turnPageV42(1);
  assert.equal(h.state.view,'result');assert.equal(h.state.talkOpen,true);
  assert.deepEqual(JSON.parse(JSON.stringify(h.state.drawn)),cards);
});

test('首页边界不调用渲染，已展开详情也不会作为返回目标',()=>{
  const h=harness();let renders=0;const original=h.context.Z;h.context.Z=()=>{renders++;original();};
  h.context.turnPageV42(-1);h.context.turnPageV42(1);assert.equal(renders,0);
  h.state.sheet={kind:'help'};h.context.Z();h.visit('album');h.context.turnPageV42(-1);
  assert.equal(h.state.view,'home');assert.equal(h.state.sheet,null);assert.equal(h.size(),2);
  assert.doesNotMatch(source,/owned|\.task|\.loop|localStorage|sessionStorage|Math\.random|\.pushState\(/);
});
