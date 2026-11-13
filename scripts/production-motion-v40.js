/* The same cast responds on the six-card table and the programme. */
let productionMotionV40=null;

function productionCardsV40(){
  return Y.view==='result'?Y.drawn:Y.view==='pack'&&Y.booster?.phase==='spread'&&Y.pack==='mix'?Y.booster.cards:[];
}
function motionReducedV40(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
function clearRadarCueV40(screen){
  screen.classList.remove('is-radar-sequence');
  screen.querySelectorAll('.is-radar-card').forEach(card=>card.classList.remove('is-radar-card'));
  hexRest();
}
function stopProductionV40(){
  talkClear();
  if(!productionMotionV40)return;
  productionMotionV40.observer?.disconnect();
  productionMotionV40.radarObserver?.disconnect();
  clearRadarCueV40(productionMotionV40.screen);
  productionMotionV40.animations.forEach(animation=>animation.cancel());
  if(productionMotionV40.frame)cancelAnimationFrame(productionMotionV40.frame);
  productionMotionV40=null;
}
function animateProductionV40(element,frames,options){
  if(!element?.animate||motionReducedV40())return;
  const animation=element.animate(frames,options);
  productionMotionV40?.animations.push(animation);
  return animation;
}
function countProductionV40(from,to,duration=460){
  const state=productionMotionV40,element=state?.scoreElement;
  if(!element)return;
  if(state.frame)cancelAnimationFrame(state.frame);
  if(motionReducedV40()){element.textContent=String(to);return;}
  const start=performance.now();
  const tick=now=>{
    if(productionMotionV40!==state||!element.isConnected)return;
    const progress=Math.min(1,(now-start)/duration);
    element.textContent=String(Math.round(from+(to-from)*(1-Math.pow(1-progress,3))));
    if(progress<1)state.frame=requestAnimationFrame(tick);
    else state.frame=0;
  };
  state.frame=requestAnimationFrame(tick);
}
function clearCueV40(screen){
  screen.querySelectorAll('.is-cue-card').forEach(card=>{card.classList.remove('is-cue-card','is-cue-bond');card.style.removeProperty('--cue-color');});
  screen.querySelectorAll('[data-production-cue]').forEach(button=>{button.classList.remove('is-cue-active');button.setAttribute('aria-pressed','false');});
}
function showProductionCueV40(cue,{replay=false}={}){
  const state=productionMotionV40;if(!state)return;
  state.cueAnimations?.forEach(animation=>animation.cancel());
  state.cueAnimations=[];
  const screen=state.screen;clearCueV40(screen);
  const buttons=[...screen.querySelectorAll('[data-production-cue]')].filter(button=>button.dataset.productionCue===cue.id);
  const color=buttons.length?getComputedStyle(buttons[0]).getPropertyValue('--cue-color').trim()||'#9c2f2f':'#9c2f2f';
  buttons.forEach(button=>{button.classList.add('is-cue-active');button.setAttribute('aria-pressed','true');});
  const selected=[...screen.querySelectorAll('.cast-mini,.spread-card')].filter(card=>cue.cardIds.includes(card.dataset.id));
  selected.forEach(card=>{
    card.style.setProperty('--cue-color',color);
    card.classList.add('is-cue-card');card.classList.toggle('is-cue-bond',cue.kind==='bond');
    const animation=animateProductionV40(card,[
      {transform:'translateY(0)',offset:0,easing:'cubic-bezier(.4,0,.2,1)'},
      {transform:'translateY(-1px)',offset:.35,easing:'cubic-bezier(.4,0,.2,1)'},
      {transform:'translateY(0)',offset:1},
    ],{duration:560,easing:'linear'});
    if(animation)state.cueAnimations.push(animation);
  });
  const status=screen.querySelector('.production-cue-status');
  if(status){status.textContent=`${cue.title} · ${cue.cardIds.map(id=>state.cards.find(card=>card.id===id).name).join(' × ')}${screen.classList.contains('result-screen')&&cue.points?' · +'+cue.points:''}`;status.style.setProperty('--cue-color',color);}
  if(replay){
    const row=screen.querySelector('.cast-row,.pack-spread');
    if(row){const box=row.getBoundingClientRect();if(box.top<0||box.bottom>innerHeight)row.scrollIntoView({behavior:motionReducedV40()?'instant':'smooth',block:'center'});}
  }
}
function finishProductionV40(){
  const state=productionMotionV40;if(!state)return;
  talkClear();
  state.radarObserver?.disconnect();
  clearRadarCueV40(state.screen);
  if(state.frame)cancelAnimationFrame(state.frame);
  if(state.scoreElement)state.scoreElement.textContent=String(state.result.score);
  state.automatic=false;
  if(state.screen.classList.contains('result-screen')){paintRadar(null,1);hexFinish();}
  markTalkSeen(state.key);
}
function replayProductionCueV40(id){
  const state=productionMotionV40;if(!state)return;
  finishProductionV40();
  const cue=state.cues.find(item=>item.id===id);
  if(cue)showProductionCueV40(cue,{replay:true});
}
function revealTalkV40(screen){
  const state=productionMotionV40;
  if(motionReducedV40())return;
  const reveal=container=>{
    if(container.dataset.revealedV40)return;
    container.dataset.revealedV40='true';
    const paragraphs=[screen.querySelector('.verdict'),...container.querySelectorAll('[data-talk-reveal]')].filter(node=>node&&!node.closest('[hidden]'));
    let beat=0;
    paragraphs.forEach(node=>{
      const parts=node.textContent.match(/[^。！？；]+[。！？；]?/g)||[node.textContent];
      node.innerHTML=parts.map(text=>`<span class="talk-beat">${K(text)}</span>`).join('');
      node.querySelectorAll('.talk-beat').forEach(span=>{
        animateProductionV40(span,[{opacity:.12},{opacity:1}],{duration:560,delay:Math.min(beat++*95,1400),fill:'backwards',easing:'ease-out'});
      });
    });
  };
  const talk=screen.querySelector('.talk');if(!talk)return;
  if(typeof IntersectionObserver==='undefined'){reveal(talk);return;}
  state.observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){reveal(entry.target);state.observer.unobserve(entry.target);}});},{threshold:.08});
  state.observer.observe(talk);
}
function enterProductionV40(){
  const cards=productionCardsV40();if(![5,6].includes(cards.length))return;
  const screen=document.querySelector('.result-screen,.pull-screen.is-spread');if(!screen)return;
  const result=productionScore(cards),key='v40:'+w(cards)+':'+(Y.view==='result'?'talk':'table');
  const cues=productionCuesV40(result,cards),scoreElement=screen.querySelector('.show-score b,.spread-score');
  productionMotionV40={screen,cards,result,key,cues,scoreElement,animations:[],frame:0,automatic:false};
  screen.querySelectorAll('[data-production-cue]').forEach(button=>button.setAttribute('aria-pressed','false'));
  revealTalkV40(screen);
  const complete=Y.sheet||hasTalkSeen(key)||motionReducedV40();
  if(complete){if(scoreElement)scoreElement.textContent=String(result.score);if(screen.classList.contains('result-screen'))hexFinish();return;}
  productionMotionV40.automatic=true;
  screen.addEventListener('click',()=>{if(productionMotionV40?.automatic)finishProductionV40();},{once:true,capture:true});
  if(scoreElement)scoreElement.textContent=String(result.base);
  const minis=[...screen.querySelectorAll('.cast-mini,.spread-card')];
  const state=productionMotionV40;
  const radar=screen.querySelector('.hex-panel');
  if(radar)hexBuildStart(false);
  else minis.forEach((card,index)=>animateProductionV40(card,[{opacity:.3,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:380,delay:index*70,fill:'backwards'}));
  const start=()=>{
    if(productionMotionV40!==state||!state.automatic||state.started||!screen.isConnected)return;
    state.started=true;
    state.radarObserver?.disconnect();
    let cueStart=520;
    if(radar){
      screen.classList.add('is-radar-sequence');
      minis.forEach((card,index)=>talkLater(()=>{
        if(productionMotionV40!==state||!state.automatic)return;
        const axis=[...screen.querySelectorAll('.hex-corner')].findIndex(node=>node.dataset.id===card.dataset.id);
        if(axis<0)return;
        card.classList.add('is-radar-card');
        hexLight(axis);
        talkLater(()=>{
          if(productionMotionV40!==state)return;
          card.classList.remove('is-radar-card');
          hexRest();
        },760);
      },180+index*940));
      const starAt=180+minis.length*940;
      talkLater(()=>{clearRadarCueV40(screen);hexStar();},starAt);
      cueStart=starAt+560;
    }
    let current=result.base;
    cues.forEach((cue,index)=>talkLater(()=>{
      if(productionMotionV40!==state)return;
      showProductionCueV40(cue);countProductionV40(current,current+cue.points);current+=cue.points;
    },cueStart+index*820));
    talkLater(()=>{if(productionMotionV40===state){finishProductionV40();clearCueV40(screen);}},cueStart+cues.length*820);
  };
  if(radar&&typeof IntersectionObserver!=='undefined'){
    state.radarObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.6))start();
    },{threshold:.6});
    state.radarObserver.observe(radar);
  }else start();
}
function spreadReviewV40(cards){
  const result=productionScore(cards);
  return `<div class="spread-review">${scoreBreakdown(result,cards,false)}</div>`;
}
function An(cards,open=false){
  const entries=nn(cards),education=entries.length===5?entries[4]:'';
  const paragraphs=entries.map(text=>`<p data-talk-reveal>${K(text)}</p>`).join('');
  const sources=typeof talkSourcesV40==='function'?talkSourcesV40(cards):'';
  const references=typeof talkReferencesV40==='function'?talkReferencesV40(cards):[];
  return `<section class="talk" aria-label="咫言咫语">
    <h2 data-talk-reveal>咫言咫语</h2>
    <div class="talk-short"${open?' hidden':''}><p data-talk-reveal>${K(shortScene(cards))}</p>${education?`<p class="talk-education" data-talk-reveal>${K(education)}</p>`:''}</div>
    <div class="talk-full"${open?'':' hidden'}>${paragraphs}</div>
    <button type="button" class="text-btn talk-toggle" data-action="expand-talk" aria-expanded="${open}">${open?'收起全文':'展开这场戏'}</button>
    ${sources?`<p class="talk-sources" data-talk-reveal>${K(sources)}</p>`:''}
    ${references.length?`<details class="talk-references"><summary>读剧参考</summary><ul>${references.map(ref=>`<li>${K(ref.kind)}：<a href="${K(ref.url)}" target="_blank" rel="noopener noreferrer">${K(ref.title)}</a></li>`).join('')}</ul></details>`:''}
  </section>`;
}
