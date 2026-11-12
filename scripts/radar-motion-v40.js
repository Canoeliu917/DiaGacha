function hexSvg(){return document.querySelector('.result-screen .hex-radar');}
function hexBuildStart(){
  const svg=hexSvg();if(!svg)return;
  paintRadar(null,1);
  svg.classList.remove('is-star');
  svg.classList.add('is-building');
  svg.querySelectorAll('.is-lit').forEach(element=>element.classList.remove('is-lit'));
  svg.querySelectorAll('.hex-dot').forEach(dot=>{dot.style.opacity='';});
  document.querySelectorAll('.result-screen .hex-corner').forEach(corner=>corner.classList.remove('is-lit'));
}
function hexLight(index){
  const svg=hexSvg();if(!svg)return;
  svg.querySelectorAll(`[data-axis="${index}"]`).forEach(element=>element.classList.add('is-lit'));
  const corner=document.querySelectorAll('.result-screen .hex-corner')[index];
  if(!corner)return;
  corner.classList.add('is-lit');
  const value=corner.querySelector('.hex-value');
  if(value)value.textContent=String(Math.round(Number(value.dataset.final)||0));
}
function hexStar(){hexSvg()?.classList.add('is-star');}
function hexFinish(){
  const svg=hexSvg();if(!svg)return;
  svg.querySelectorAll('[data-axis]').forEach(element=>element.classList.add('is-lit'));
  document.querySelectorAll('.result-screen .hex-corner').forEach(corner=>{
    corner.classList.add('is-lit');
    const value=corner.querySelector('.hex-value');
    if(value)value.textContent=String(Math.round(Number(value.dataset.final)||0));
  });
  svg.classList.add('is-star');
  svg.classList.remove('is-building');
}
