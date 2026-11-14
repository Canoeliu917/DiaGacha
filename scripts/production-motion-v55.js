// Scores and axes are visible at once. Only a deliberately selected reward responds.
enterProductionV40=function(){
  const cards=productionCardsV40();if(![5,6].includes(cards.length))return;
  const screen=document.querySelector('.result-screen,.pull-screen.is-spread');if(!screen)return;
  const result=productionScore(cards),key='v55:'+w(cards)+':'+Y.view;
  productionMotionV40={screen,cards,result,key,cues:productionCuesV40(result,cards),scoreElement:screen.querySelector('.show-score b,.spread-score'),animations:[],frame:0,automatic:false};
  if(productionMotionV40.scoreElement)productionMotionV40.scoreElement.textContent=String(result.score);
  if(Y.view==='result'){paintRadar(null,1);hexFinish();}
  if(!Y.sheet&&!hasTalkSeen(key)){
    const evolution=screen.querySelector('.collision-reward-v55.is-evolution');
    animateProductionV40(evolution,[{boxShadow:'0 0 0 0 #9c742d00'},{boxShadow:'0 0 18px 0 #9c742d33'},{boxShadow:'0 0 0 0 #9c742d00'}],{duration:650,easing:'ease-out'});
  }
  markTalkSeen(key);
};
showProductionCueV40=function(cue){
  const state=productionMotionV40;if(!state)return;
  state.cueAnimations?.forEach(animation=>animation.cancel());state.cueAnimations=[];
  clearCueV40(state.screen);
  state.screen.querySelectorAll('[data-production-cue]').forEach(button=>{
    const selected=button.dataset.productionCue===cue.id;
    button.classList.toggle('is-cue-active',selected);button.setAttribute('aria-pressed',String(selected));
  });
  state.screen.querySelectorAll('.cast-mini,.spread-card').forEach(card=>{
    if(!cue.cardIds.includes(card.dataset.id))return;
    card.classList.add('is-cue-card');card.classList.toggle('is-cue-bond',cue.kind==='bond');
  });
  const status=state.screen.querySelector('.production-cue-status');
  if(status)status.textContent=`${cue.title} · ${cue.cardIds.map(id=>state.cards.find(card=>card.id===id).name).join(' × ')} · 已计入 ${cue.points} 分`;
};
