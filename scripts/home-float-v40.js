let homeFloatCleanupV40=null;
function stopHomeFloatV40(){homeFloatCleanupV40?.();homeFloatCleanupV40=null;}
function startHomeFloatV40(){
  stopHomeFloatV40();
  if(Y.view!=='home'||Y.sheet)return;
  const hero=document.querySelector('.home-hero'),figures=[...document.querySelectorAll('.parade-fig')];
  if(!hero||!figures.length)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const actors=figures.map(figure=>({figure,body:figure.querySelector('.parade-motion')})).filter(actor=>actor.body);
  let frame=0,point=null;
  const reset=()=>{
    if(frame)cancelAnimationFrame(frame);
    frame=0;point=null;
    actors.forEach(({body})=>{body.style.transform='';});
  };
  const paint=()=>{
    frame=0;
    if(!point||reduced.matches||document.hidden)return;
    const bounds=hero.getBoundingClientRect();
    const clamp=value=>Math.max(-1,Math.min(1,value));
    const x=clamp((point.x-bounds.left)/bounds.width*2-1),y=clamp((point.y-bounds.top)/bounds.height*2-1);
    const poses=actors.map(({figure},index)=>{
      const box=figure.getBoundingClientRect(),depth=.65+(index%5)*.09;
      const proximity=Math.max(0,1-Math.hypot(point.x-box.left-box.width/2,point.y-box.top-box.height/2)/140);
      const scale=164/box.width;
      return `translate(${(x*10*depth*scale).toFixed(2)}px,${((y*7*depth-proximity*4)*scale).toFixed(2)}px) rotate(${(x*4*(index%2?1:-1)).toFixed(2)}deg)`;
    });
    actors.forEach(({body},index)=>{body.style.transform=poses[index];});
  };
  const move=event=>{
    if(reduced.matches||document.hidden)return;
    point={x:event.clientX,y:event.clientY};
    if(!frame)frame=requestAnimationFrame(paint);
  };
  const release=event=>{if(event.pointerType!=='mouse')reset();};
  const visibility=()=>{if(document.hidden)reset();};
  hero.addEventListener('pointermove',move,{passive:true});
  hero.addEventListener('pointerdown',move,{passive:true});
  hero.addEventListener('pointerleave',reset);
  hero.addEventListener('pointercancel',reset);
  window.addEventListener('pointerup',release,{passive:true});
  window.addEventListener('blur',reset);
  window.addEventListener('resize',reset);
  window.addEventListener('scroll',reset,{passive:true});
  document.addEventListener('visibilitychange',visibility);
  reduced.addEventListener('change',reset);
  homeFloatCleanupV40=()=>{
    reset();
    hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerdown',move);
    hero.removeEventListener('pointerleave',reset);hero.removeEventListener('pointercancel',reset);
    window.removeEventListener('pointerup',release);window.removeEventListener('blur',reset);
    window.removeEventListener('resize',reset);window.removeEventListener('scroll',reset);
    document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',reset);
  };
}
