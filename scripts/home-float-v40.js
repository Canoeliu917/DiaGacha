let homeFloatCleanupV40=null;
function stopHomeFloatV40(){homeFloatCleanupV40?.();homeFloatCleanupV40=null;}
function startHomeFloatV40(){
  stopHomeFloatV40();
  if(Y.view!=='home'||Y.sheet)return;
  const hero=document.querySelector('.home-hero'),figures=[...document.querySelectorAll('.parade-fig')];
  if(!hero)return;
  const logo=hero.querySelector('.wordmark');
  if(!figures.length&&!logo)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const actors=figures.map((figure,index)=>({figure,body:figure.querySelector('.parade-motion'),index,x:0,y:0,r:0,vx:0,vy:0,vr:0,greeting:null})).filter(actor=>actor.body);
  let frame=0,point=null,pressed=null,layout=null,lastTime=null,logoDirty=false;
  const clamp=(value,limit=1)=>Math.max(-limit,Math.min(limit,value));
  const enabled=()=>!reduced.matches&&!document.hidden;
  const schedule=()=>{if(!frame&&enabled())frame=requestAnimationFrame(paint);};
  const actorAt=event=>actors.find(actor=>actor.figure===event.target?.closest?.('.parade-fig'));
  const reset=()=>{
    if(frame)cancelAnimationFrame(frame);
    frame=0;point=null;pressed=null;layout=null;lastTime=null;logoDirty=false;
    actors.forEach(actor=>{actor.x=actor.y=actor.r=actor.vx=actor.vy=actor.vr=0;actor.greeting=null;actor.body.style.transform='';});
    if(logo)logo.style.transform='';
  };
  const paint=time=>{
    frame=0;
    if(!enabled()){reset();return;}
    if(!layout)layout={hero:hero.getBoundingClientRect(),figures:actors.map(({figure})=>figure.getBoundingClientRect())};
    const bounds=layout.hero,dt=Math.min((lastTime===null?1000/60:time-lastTime)/1000,.032);
    lastTime=time;
    const x=point?clamp((point.x-bounds.left)/Math.max(1,bounds.width)*2-1):0,y=point?clamp((point.y-bounds.top)/Math.max(1,bounds.height)*2-1):0;
    let moving=false;
    actors.forEach((actor,index)=>{
      const box=layout.figures[index],depth=.72+(actor.index%5)*.13;
      const dx=point?point.x-box.left-box.width/2:0,dy=point?point.y-box.top-box.height/2:0;
      const near=point?Math.max(0,1-Math.hypot(dx,dy)/125):0,lean=clamp(dx/75);
      const progress=actor.greeting===null?1:Math.min(1,(time-actor.greeting)/850);
      const greeting=actor.greeting===null?0:Math.sin(Math.PI*progress)**2;
      if(progress===1)actor.greeting=null;
      const targets={x:clamp(x*12*depth+lean*near*5,18),y:clamp(y*8*depth-near*11-greeting*10,22),r:clamp(x*2.5*(actor.index%2?1:-1)+lean*near*4+Math.sin(progress*Math.PI*2)*greeting*8*(actor.index%2?1:-1),8)};
      for(const axis of ['x','y','r']){
        const velocity=`v${axis}`;
        actor[velocity]+=(targets[axis]-actor[axis])*170*dt;
        actor[velocity]*=Math.exp(-21*dt);
        actor[axis]+=actor[velocity]*dt;
        if(Math.abs(targets[axis]-actor[axis])<.015&&Math.abs(actor[velocity])<.1){actor[axis]=targets[axis];actor[velocity]=0;}
        else moving=true;
      }
      const scale=(actor.figure.viewBox?.baseVal?.width||164)/Math.max(1,box.width);
      actor.body.style.transform=actor.x||actor.y||actor.r?`translate3d(${(actor.x*scale).toFixed(2)}px,${(actor.y*scale).toFixed(2)}px,0) rotate(${actor.r.toFixed(2)}deg)`:'';
      if(actor.greeting!==null)moving=true;
    });
    if(logo&&logoDirty){logo.style.transform=point?`translate(${(x*6).toFixed(2)}px,${(y*4).toFixed(2)}px) rotate(${(x*1.2).toFixed(2)}deg)`:'';logoDirty=false;}
    if(moving)schedule();else lastTime=null;
  };
  const move=event=>{
    if(!enabled()||event.pointerType==='touch')return;
    point={x:event.clientX,y:event.clientY};logoDirty=true;schedule();
  };
  const down=event=>{
    if(!enabled()||event.isPrimary===false||event.button>0)return;
    const actor=actorAt(event);
    pressed=actor?{actor,id:event.pointerId,x:event.clientX,y:event.clientY,time:performance.now()}:null;
    move(event);
  };
  const release=event=>{
    if(!enabled())return;
    if(pressed&&pressed.id===event.pointerId&&pressed.actor===actorAt(event)&&Math.hypot(event.clientX-pressed.x,event.clientY-pressed.y)<10&&performance.now()-pressed.time<650){pressed.actor.greeting=performance.now();schedule();}
    pressed=null;
    if(event.pointerType!=='mouse'&&point){point=null;logoDirty=true;schedule();}
  };
  const leave=()=>{point=null;pressed=null;logoDirty=true;schedule();};
  const key=event=>{
    const actor=actorAt(event);
    if(!actor||event.repeat||!['Enter',' '].includes(event.key))return;
    event.preventDefault();
    if(enabled()){actor.greeting=performance.now();schedule();}
  };
  const visibility=()=>{if(document.hidden)reset();};
  hero.addEventListener('pointermove',move,{passive:true});
  hero.addEventListener('pointerdown',down,{passive:true});
  hero.addEventListener('pointerleave',leave);
  hero.addEventListener('pointercancel',reset);
  hero.addEventListener('keydown',key);
  window.addEventListener('pointerup',release,{passive:true});
  window.addEventListener('blur',reset);
  window.addEventListener('resize',reset);
  window.addEventListener('scroll',reset,{passive:true});
  document.addEventListener('visibilitychange',visibility);
  reduced.addEventListener('change',reset);
  homeFloatCleanupV40=()=>{
    reset();
    hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerdown',down);
    hero.removeEventListener('pointerleave',leave);hero.removeEventListener('pointercancel',reset);hero.removeEventListener('keydown',key);
    window.removeEventListener('pointerup',release);window.removeEventListener('blur',reset);
    window.removeEventListener('resize',reset);window.removeEventListener('scroll',reset);
    document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',reset);
  };
}
