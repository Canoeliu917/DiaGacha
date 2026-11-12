const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'home-float-v40.js'),'utf8');

function target(){
  const listeners=new Map();
  return {
    addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn);},
    removeEventListener(type,fn){listeners.get(type)?.delete(fn);},
    emit(type,event={}){[...(listeners.get(type)||[])].forEach(fn=>fn(event));},
    listenerCount(){return [...listeners.values()].reduce((total,set)=>total+set.size,0);},
  };
}
function fixture(){
  const hero=target(),window=target(),document=target(),reduced=target(),frames=new Map();
  let nextId=0,writes=0;
  hero.getBoundingClientRect=()=>({left:0,top:0,width:600,height:500});
  document.hidden=false;reduced.matches=false;
  const figures=Array.from({length:10},(_,i)=>{
    let transform='';
    const body={style:{get transform(){return transform;},set transform(value){transform=value;writes++;}}};
    return {body,querySelector:()=>body,getBoundingClientRect:()=>({left:180+i%5*46,top:170+Math.floor(i/5)*64,width:46,height:64})};
  });
  document.querySelector=()=>hero;document.querySelectorAll=()=>figures;
  const state={view:'home',sheet:null};
  const context=vm.createContext({Y:state,window,document,matchMedia:()=>reduced,
    requestAnimationFrame(fn){const id=++nextId;frames.set(id,fn);return id;},
    cancelAnimationFrame(id){frames.delete(id);},
  });
  vm.runInContext(source,context);
  context.startHomeFloatV40();
  return {context,state,hero,window,document,reduced,frames,figures,
    writes:()=>writes,poses:()=>figures.map(figure=>figure.body.style.transform),
    flush(){const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn());},
    move(){hero.emit('pointermove',{clientX:490,clientY:280,pointerType:'mouse'});},
    listenerCount(){return [hero,window,document,reduced].reduce((total,item)=>total+item.listenerCount(),0);},
  };
}

test('快速鼠标移动合并到一帧，使用最新位置且十人有不同响应',()=>{
  const run=fixture();
  for(let i=0;i<20;i++)run.hero.emit('pointermove',{clientX:i*10,clientY:20});
  run.move();
  assert.equal(run.frames.size,1);assert.equal(run.writes(),0);
  run.flush();
  assert.equal(run.writes(),10);assert.equal(run.frames.size,0);
  assert.ok(run.poses().every(pose=>pose&&!/NaN|Infinity/.test(pose)));
  assert.ok(new Set(run.poses()).size>1);
  const latest=fixture();latest.move();latest.flush();
  assert.deepEqual(run.poses(),latest.poses());
});

test('移出、触摸松开和取消都归位；减动及隐藏时不启动帧',()=>{
  const run=fixture();run.move();run.flush();
  run.window.emit('pointerup',{pointerType:'mouse'});
  assert.ok(run.poses().every(Boolean));
  run.window.emit('pointerup',{pointerType:'touch'});
  assert.ok(run.poses().every(pose=>pose===''));
  for(const event of ['pointerleave','pointercancel']){
    run.move();run.hero.emit(event);assert.equal(run.frames.size,0);
    assert.ok(run.poses().every(pose=>pose===''));
  }
  run.move();run.flush();run.reduced.matches=true;run.reduced.emit('change');run.move();
  assert.equal(run.frames.size,0);assert.ok(run.poses().every(pose=>pose===''));
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
