const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'home-float-v40.js'),'utf8');

function target(){
  const listeners=new Map(),options=new Map();
  return {
    options,
    addEventListener(type,fn,settings){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn);options.set(type,settings);},
    removeEventListener(type,fn){listeners.get(type)?.delete(fn);},
    emit(type,event={}){[...(listeners.get(type)||[])].forEach(fn=>fn(event));},
    listenerCount(){return [...listeners.values()].reduce((total,set)=>total+set.size,0);},
  };
}
function fixture(){
  const hero=target(),window=target(),document=target(),reduced=target(),frames=new Map();
  let nextId=0,writes=0,reads=0,now=0;
  let logoTransform='';
  const logo={style:{get transform(){return logoTransform;},set transform(value){logoTransform=value;writes++;}}};
  hero.getBoundingClientRect=()=>{reads++;return {left:0,top:0,width:600,height:500};};
  hero.querySelector=selector=>selector==='.wordmark'?logo:null;
  document.hidden=false;reduced.matches=false;
  const figures=Array.from({length:10},(_,i)=>{
    let transform='';
    const body={style:{get transform(){return transform;},set transform(value){transform=value;writes++;}}};
    const figure={body,viewBox:{baseVal:{width:164}},querySelector:()=>body,getBoundingClientRect:()=>{reads++;return {left:180+i%5*46,top:170+Math.floor(i/5)*64,width:46,height:64};}};
    figure.closest=()=>figure;
    return figure;
  });
  document.querySelector=()=>hero;document.querySelectorAll=()=>figures;
  const state={view:'home',sheet:null};
  const context=vm.createContext({Y:state,window,document,matchMedia:()=>reduced,performance:{now:()=>now},
    requestAnimationFrame(fn){const id=++nextId;frames.set(id,fn);return id;},
    cancelAnimationFrame(id){frames.delete(id);},
  });
  vm.runInContext(source,context);
  context.startHomeFloatV40();
  return {context,state,hero,window,document,reduced,frames,figures,logo,
    writes:()=>writes,reads:()=>reads,poses:()=>[...figures.map(figure=>figure.body.style.transform),logo.style.transform],
    flush(dt=1000/60){now+=dt;const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(now));},
    advance(ms,dt=1000/60){for(let elapsed=0;elapsed<ms;elapsed+=dt)this.flush(Math.min(dt,ms-elapsed));},
    settle(){for(let i=0;frames.size&&i<300;i++)this.flush();assert.equal(frames.size,0,'settled motion must stop requesting frames');},
    pointer(index,extra={}){return {target:figures[index],clientX:203+index%5*46,clientY:202+Math.floor(index/5)*64,pointerId:1,pointerType:'touch',button:0,...extra};},
    move(){hero.emit('pointermove',{clientX:490,clientY:280,pointerType:'mouse'});},
    listenerCount(){return [hero,window,document,reduced].reduce((total,item)=>total+item.listenerCount(),0);},
  };
}

function pose(figure){
  const values=figure.body.style.transform.match(/-?[\d.]+(?=px|deg)/g)?.map(Number)||[0,0,0];
  return {x:values[0]*46/164,y:values[1]*46/164,r:values[2]};
}

test('快速鼠标移动合并到单一 RAF，保留 Logo 幅度，十人分层并在稳定后停帧',()=>{
  const run=fixture();
  for(let i=0;i<20;i++)run.hero.emit('pointermove',{clientX:i*10,clientY:20});
  run.move();
  assert.equal(run.frames.size,1);assert.equal(run.writes(),0);
  run.flush();
  assert.equal(run.writes(),11);assert.equal(run.frames.size,1);
  assert.ok(run.poses().every(pose=>pose&&!/NaN|Infinity/.test(pose)));
  assert.ok(new Set(run.poses()).size>1);
  const latest=fixture();latest.move();latest.flush();
  assert.deepEqual(run.poses(),latest.poses());
  assert.equal(run.logo.style.transform,'translate(3.80px,0.48px) rotate(0.76deg)');
  run.settle();
  assert.equal(run.reads(),11,'layout should be read once, not once per animation frame');
  assert.equal(run.logo.style.transform,latest.logo.style.transform);
  assert.ok(new Set(run.figures.map(figure=>figure.body.style.transform)).size>=5);
});

test('靠近者上浮更明显，移开柔和回弹，位移与倾角有界',()=>{
  const run=fixture(),event=run.pointer(2,{pointerType:'mouse'});
  run.hero.emit('pointermove',event);run.settle();
  const near=pose(run.figures[2]),far=pose(run.figures[9]);
  assert.ok(near.y<-10,'nearby actor should have a visible lift');
  assert.ok(near.y<far.y-5,'nearby actor should lift more than a distant actor');
  const before=run.poses();run.hero.emit('pointerleave');
  assert.deepEqual(run.poses(),before,'leaving must not snap figures to their origins');
  run.flush();
  assert.ok(pose(run.figures[2]).y>near.y&&pose(run.figures[2]).y<0);
  assert.ok(Math.abs(pose(run.figures[2]).y-near.y)<1);
  run.settle();assert.ok(run.poses().every(value=>value===''));
  for(const point of [{clientX:5000,clientY:5000},{clientX:-5000,clientY:-5000}]){
    run.hero.emit('pointermove',{...point,pointerType:'mouse'});
    for(let i=0;i<150;i++){
      run.flush();
      for(const figure of run.figures){const p=pose(figure);assert.ok(Math.abs(p.x)<=18.1&&Math.abs(p.y)<=22.1&&Math.abs(p.r)<=8.1);}
    }
  }
});

test('手机点按仅招呼选中人物；滑动、长按、取消不触发，不拦截滚动',()=>{
  const run=fixture(),event=run.pointer(3,{preventDefault(){assert.fail('touch must remain passive');}});
  run.hero.emit('pointerdown',event);assert.equal(run.frames.size,0);
  run.window.emit('pointerup',event);assert.equal(run.frames.size,1);
  run.advance(350);
  assert.ok(pose(run.figures[3]).y<-3);
  assert.ok(run.figures.filter((_,i)=>i!==3).every(figure=>figure.body.style.transform===''));
  run.settle();assert.ok(run.poses().every(value=>value===''));
  for(const action of ['drag','hold','scroll','cancel']){
    run.hero.emit('pointerdown',event);
    if(action==='hold')run.advance(700);
    if(action==='scroll')run.window.emit('scroll');
    if(action==='cancel')run.hero.emit('pointercancel');
    run.window.emit('pointerup',action==='drag'?{...event,clientX:event.clientX+15}:event);
    assert.equal(run.frames.size,0,action);
  }
  assert.equal(run.hero.options.get('pointermove').passive,true);
  assert.equal(run.hero.options.get('pointerdown').passive,true);
  assert.equal(run.window.options.get('pointerup').passive,true);
  assert.equal(run.window.options.get('scroll').passive,true);
});

test('键盘触发招呼，60 Hz 与 120 Hz 动作接近且不另开定时器',()=>{
  const run=fixture();let prevented=0;
  run.hero.emit('keydown',{target:run.figures[7],key:'Enter',preventDefault(){prevented++;}});
  assert.equal(prevented,1);assert.equal(run.frames.size,1);
  run.advance(400);assert.ok(pose(run.figures[7]).y<-4);
  const high=fixture();high.hero.emit('keydown',{target:high.figures[7],key:' ',preventDefault(){}});
  high.advance(400,1000/120);
  assert.ok(Math.abs(pose(high.figures[7]).y-pose(run.figures[7]).y)<1);
  assert.ok(Math.abs(pose(high.figures[7]).r-pose(run.figures[7]).r)<1);
  run.settle();high.settle();
  run.hero.emit('keydown',{target:run.figures[7],key:'Enter',repeat:true,preventDefault(){assert.fail('ignore repeated keys');}});
  assert.equal(run.frames.size,0);
});

test('取消、滚动、变更窗口、减动及页面隐藏清除动画和待触发招呼',()=>{
  const run=fixture();
  for(const [target,event] of [[run.hero,'pointercancel'],[run.window,'scroll'],[run.window,'resize'],[run.window,'blur']]){
    run.move();run.flush();target.emit(event);
    assert.equal(run.frames.size,0);assert.ok(run.poses().every(value=>value===''));
  }
  run.move();run.flush();run.reduced.matches=true;run.reduced.emit('change');run.move();
  assert.equal(run.frames.size,0);assert.ok(run.poses().every(pose=>pose===''));
  run.hero.emit('pointerdown',run.pointer(0));run.window.emit('pointerup',run.pointer(0));
  assert.equal(run.frames.size,0);
  run.reduced.matches=false;run.move();run.flush();
  run.document.hidden=true;run.document.emit('visibilitychange');run.move();
  assert.equal(run.frames.size,0);assert.ok(run.poses().every(pose=>pose===''));
});

test('重绘先移除旧监听；离开首页或打开弹层后没有遗留帧和响应',()=>{
  const run=fixture(),listeners=run.listenerCount();
  run.context.startHomeFloatV40();assert.equal(run.listenerCount(),listeners);
  run.move();assert.equal(run.frames.size,1);
  run.context.stopHomeFloatV40();assert.equal(run.frames.size,0);assert.equal(run.listenerCount(),0);
  const writes=run.writes();run.move();run.flush();assert.equal(run.writes(),writes);
  run.state.view='pack';run.context.startHomeFloatV40();assert.equal(run.listenerCount(),0);
  run.state.view='home';run.state.sheet={kind:'help'};run.context.startHomeFloatV40();assert.equal(run.listenerCount(),0);
  run.state.sheet=null;run.context.startHomeFloatV40();assert.equal(run.listenerCount(),listeners);
  run.move();run.flush();assert.ok(run.poses().every(Boolean));
});
