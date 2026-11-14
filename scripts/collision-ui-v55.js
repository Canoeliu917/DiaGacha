// Original-work and creative rewards share the existing eight-point budget.
const sourceProductionCuesV55=productionCuesV40;
productionScore=function(cards){
  const result=DiaScoring.production(cards),collisions=collisionDetailsV55(cards);
  const rewardedPairs=new Set(result.bondDetails.map(item=>[...item.cardIds].sort().join('|')));
  const creative=collisions.filter(item=>item.bonus>0&&!rewardedPairs.has([...item.cardIds].sort().join('|')))
    .map(item=>({id:item.id,name:item.title,points:item.bonus,cardIds:item.cardIds,creative:true}));
  const bondDetails=[...result.bondDetails,...creative];
  const bonds=Math.min(8,bondDetails.reduce((sum,item)=>sum+item.points,0));
  const score=Math.min(100,result.base+result.resonance+bonds);
  return {...result,score,bonds,bondDetails,collisions,grade:score>=90?'绝佳':score>=80?'出彩':score>=70?'成台':score>=60?'初成':'待磨'};
};
productionCuesV40=function(result,cards){
  const source={...result,bondDetails:result.bondDetails.filter(item=>!item.creative)};
  const cues=sourceProductionCuesV55(source,cards);
  for(const item of result.bondDetails.filter(item=>item.creative)){
    const collision=result.collisions.find(row=>row.id===item.id);
    cues.push({id:'bond-'+item.id,kind:'bond',cardIds:item.cardIds,title:collision.title,description:collision.explanation,points:item.points,level:collision.level});
  }
  // Allocate caps once, in the same order used by the displayed ledger.
  let starRoom=7,bondRoom=8,totalRoom=100-result.base;
  for(const cue of cues){
    const original=cue.kind==='resonance'?result.resonanceDetails.find(row=>'resonance-'+row.rarity===cue.id):result.bondDetails.find(row=>'bond-'+row.id===cue.id);
    cue.rawPoints=original.points;
    const room=cue.kind==='resonance'?starRoom:bondRoom;
    const withinBudget=Math.min(cue.rawPoints,room);
    if(cue.kind==='resonance')starRoom-=withinBudget;else bondRoom-=withinBudget;
    cue.points=Math.min(withinBudget,totalRoom);totalRoom-=cue.points;
  }
  return cues;
};
function collisionPanelV55(result,cards){
  const cues=productionCuesV40(result,cards),names=ids=>ids.map(id=>cards.find(card=>card.id===id)?.name||'').join(' × ');
  const sourceReasons={
    'play-lead':'剧本与主角有共同原作，人物的行动可以回到原文中核对。',
    'play-support':'剧本与配角有共同原作，能沿配角看见故事的另一条线。',
    'lead-support':'主角与配角出自同一作品；同作不等于他们在原作里一定直接交谈。',
    'play-place':'剧本与空间有共同原作，地点给人物的进退增加具体条件。',
    'style-method':'演法与手段共享已收录的戏剧体系，便于比较理念如何变成动作。'
  };
  const reward=cue=>{
    const collision=result.collisions.find(item=>'bond-'+item.id===cue.id);
    const originals=result.bondDetails.find(item=>'bond-'+item.id===cue.id)?.workIds||[];
    const works=originals.map(id=>collisionDataV55.facts[id]?.name).filter(Boolean);
    const reason=cue.kind==='resonance'?`${cue.cardIds.length} 张 ${v.indexOf(cue.rarity)+1} 星卡组成同星组，按同星表获得 ${cue.rawPoints} 分。`:(works.length?`共同原作：${works.map(name=>'《'+name+'》').join('、')}。`:'')+(sourceReasons[cue.id.slice(5)]||collision?.explanation||cue.description);
    return `<li class="collision-reward-v55${collision?.level==='evolution'?' is-evolution':''}"><button type="button" class="production-cue" data-action="production-cue" data-cue-id="${K(cue.id)}" data-production-cue="${K(cue.id)}" aria-pressed="false" aria-label="${K(cue.title)}，已计入 ${cue.points} 分。关联卡牌：${K(cue.cardIds.map(id=>cards.find(card=>card.id===id).name).join('、'))}。回看关联卡牌"><strong>${K(cue.title)}</strong><b class="cue-value">+${cue.points}</b><small>${K(names(cue.cardIds))}</small></button><p>${K(reason)}</p>${cue.points<cue.rawPoints?`<p class="collision-limit-v55">规则分 +${cue.rawPoints}；受${cue.kind==='resonance'?'同星 7 分':'羁绊 8 分'}及总分 100 分上限影响，本次实际计入 +${cue.points}。</p>`:''}${collision?`<p><b>${collision.level==='evolution'?'组合进化':'创意碰撞'}：</b>${K(collision.event)}</p><p class="collision-learning-v55">想一想：${K(collision.learning)}</p>`:''}</li>`;
  };
  const appliedStars=cues.filter(cue=>cue.kind==='resonance').reduce((sum,cue)=>sum+cue.points,0),appliedBonds=cues.filter(cue=>cue.kind==='bond').reduce((sum,cue)=>sum+cue.points,0);
  const paid=new Set(result.bondDetails.map(item=>item.id));
  const learning=result.collisions.filter(item=>!paid.has(item.id));
  const featured=learning.find(item=>item.cardIds.some(id=>cards.find(card=>card.id===id)?.dimension==='环境')&&item.cardIds.some(id=>cards.find(card=>card.id===id)?.dimension==='主演'));
  const remaining=learning.filter(item=>item!==featured);
  const learn=item=>`<article class="collision-study-v55"><h4>${K(item.title)}</h4><small>${K(names(item.cardIds))}</small><p>${K(item.explanation)}</p><p><b>可以这样发生：</b>${K(item.event)}</p><p class="collision-learning-v55">想一想：${K(item.learning)}</p>${item.bonusNote?`<p class="collision-limit-v55">${K(item.bonusNote)}</p>`:''}${item.sourceRefs?.length?`<details><summary>卡牌知识依据</summary><ul>${item.sourceRefs.filter(ref=>/^https?:\/\//.test(ref.url)).map(ref=>`<li><a href="${K(ref.url)}" target="_blank" rel="noopener noreferrer">${K(ref.title)}</a></li>`).join('')}</ul><p>资料用于核对卡牌知识；本组情节为创意联想。</p></details>`:''}</article>`;
  return `<section class="collision-panel-v55" aria-label="卡面碰撞与加分原因">
    <p class="eyebrow">${cards.length===6?'六':'五'}张卡，怎样碰出一场戏</p><h2>这一组的化学反应</h2>
    <div class="collision-totals-v55"><span>基础 <b>${result.base}</b></span><span>同星 <b>+${appliedStars}</b></span><span>羁绊 <b>+${appliedBonds}</b></span><span>卡组分 <b>${result.score}</b></span></div>
    <p class="collision-note-v55">同星最多 +7，原作关系与创意碰撞合计最多 +8，总分最高 100。这里展示实际计入的分数。</p>
    <p class="collision-note-v55">从这些卡出发，还可能发生下面的片段；它们是主故事之外的创作提案。分数记录卡组搭配，不评判戏剧作品的高低。</p>
    ${cues.length?`<ul class="collision-rewards-v55">${cues.map(reward).join('')}</ul>`:'<p>本组没有同星或精选奖励，仍可以从下面的碰撞开始探索。</p>'}
    <p class="production-cue-status" role="status" aria-live="polite">点奖励名称，查看参与的卡牌。</p>
    ${featured?`<p class="collision-note-v55">不加分，也可以试这一种相遇</p>${learn(featured)}`:''}
    ${remaining.length?`<details class="collision-more-v55"><summary>还有 ${remaining.length} 种碰撞可以试一试</summary><p>下面是创作提问，不是原作已发生的情节，也不额外加分。</p>${remaining.map(learn).join('')}</details>`:''}
    <details class="collision-recipes-v55"><summary>四组隐藏一幕 · 进化图鉴</summary><p class="collision-note-v55">收集后自由搭建；无需一次抽齐。三卡进化共用羁绊 8 分上限，不生成新的永久收藏卡。</p>${collisionDataV55.rules.filter(rule=>rule.level==='evolution').map(rule=>`<article class="collision-study-v55"><h4>${K(rule.title)}</h4><small>${K(rule.cardIds.map(id=>collisionDataV55.facts[id].name).join(' × '))}</small><p>${K(rule.event)}</p></article>`).join('')}</details>
    <p class="collision-note-v55"><a href="https://canoeliu917.github.io/DiaGacha/docs/collision-explorer-v55.html" target="_blank" rel="noopener noreferrer">查看500张卡的碰撞图鉴</a></p>
  </section>`;
}
scoreBreakdown=function(result,cards){return collisionPanelV55(result,cards);};
spreadReviewV40=function(cards){return `<div class="spread-review">${collisionPanelV55(productionScore(cards),cards)}</div>`;};
