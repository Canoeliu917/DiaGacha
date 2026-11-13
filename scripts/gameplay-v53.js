// Keep five-, six- and seven-star rates; spread crowded lower tiers across more cards.
const LOW_CARD_CAP_V53=.08;
function balancedWeightsV53(pool,dimension,table,resolveTier=ee){
  const cards=pool.filter(card=>card.dimension===dimension);
  const rows=cards.map(card=>({card,chance:0}));
  const byId=new Map(rows.map(row=>[row.card.id,row]));
  for(const [rarity,percent] of Object.entries(table)){
    const tier=resolveTier(cards,rarity);
    for(const card of tier)byId.get(card.id).chance+=percent/100/tier.length;
  }
  let remaining=rows.filter(row=>['C','UC','R','SR'].includes(row.card.rarity));
  let budget=remaining.reduce((sum,row)=>sum+row.chance,0);
  while(remaining.length){
    const weight=remaining.reduce((sum,row)=>sum+row.chance,0);
    const scale=budget/weight;
    const crowded=remaining.filter(row=>row.chance*scale>LOW_CARD_CAP_V53+1e-12);
    if(!crowded.length){for(const row of remaining)row.chance*=scale;break;}
    const fixed=new Set(crowded);
    for(const row of crowded)row.chance=LOW_CARD_CAP_V53;
    budget-=crowded.length*LOW_CARD_CAP_V53;
    remaining=remaining.filter(row=>!fixed.has(row));
  }
  return Object.keys(table).flatMap(rarity=>rows.filter(row=>row.card.rarity===rarity));
}
function drawBalancedV53(pool,dimension,table,rng=Math.random){
  const rows=balancedWeightsV53(pool,dimension,table);
  let roll=rng();
  for(const row of rows)if((roll-=row.chance)<0)return row.card;
  return rows[rows.length-1].card;
}
function actualRatesV53(pool,dimension,table){
  const rates=Object.fromEntries(Object.keys(table).map(rarity=>[rarity,0]));
  for(const row of balancedWeightsV53(pool,dimension,table))rates[row.card.rarity]+=row.chance*100;
  return rates;
}
function ratesHelpV53(pool){
  const ranks=Object.keys(DiaRatesV40.standard);
  const percent=value=>Number(value.toFixed(2))+'%';
  return `<p>综合包每维一张。普通包的 5／6／7 星单席概率为 10%／5%／1%；今日赠礼的下一综合包为 18%／9%／4%。</p>
    <p>为让更多卡有机会出现，1–4 星单张卡在同一维度的基础概率最多 8%。先按原星级权重与缺档回退分配，再把超出的概率按权重分给该维其余未到上限的 1–4 星卡。高星概率保持不变；保底与指定维度奖励仍可替换当包卡片。</p>
    <details><summary>查看各维实际出率</summary>${Object.entries(DiaRatesV40).map(([kind,table])=>`<div class="rates-table-scroll"><table><caption>${kind==='standard'?'普通综合包':'今日赠礼综合包'} · 保底替换前，百分比保留两位小数</caption><thead><tr><th scope="col">维度</th>${ranks.map((_,i)=>`<th scope="col">${i+1} 星</th>`).join('')}</tr></thead><tbody>${x.map(dim=>{
      const rates=actualRatesV53(pool,dim.key,table);
      return `<tr><th scope="row">${K(copyDimension(dim.key))}</th>${ranks.map(rank=>`<td>${percent(rates[rank])}</td>`).join('')}</tr>`;
    }).join('')}</tbody></table></div>`).join('')}</details><p>单维包每包六张、同包不重复；仍按原档位权重抽取，实际频率会受去重影响，不计入综合包保底。</p>`;
}

function createRehearsalV53(cards){return {originalIds:cards.map(card=>card.id),change:null};}
function rewriteOptionsV53(cards,pool,ownedIds){
  const owned=new Set(ownedIds),dimensions=new Set(cards.map(card=>card.dimension));
  const current=new Set(cards.map(card=>card.id));
  return pool.filter(card=>owned.has(card.id)&&dimensions.has(card.dimension)&&!current.has(card.id));
}
function previewRewriteV53(cards,pool,ownedIds,rehearsal,replacementId,score=productionScore){
  if(rehearsal?.change||rehearsal?.locked)return null;
  const candidate=rewriteOptionsV53(cards,pool,ownedIds).find(card=>card.id===replacementId);
  if(!candidate)return null;
  const original=cards.find(card=>card.dimension===candidate.dimension);
  const drawn=cards.map(card=>card.dimension===candidate.dimension?candidate:card);
  const before=score(cards),after=score(drawn);
  return {drawn,before,after,delta:after.score-before.score,change:{fromId:original.id,toId:candidate.id,dimension:candidate.dimension}};
}
function applyRewriteV53(cards,pool,ownedIds,rehearsal,replacementId,score=productionScore){
  const preview=previewRewriteV53(cards,pool,ownedIds,rehearsal,replacementId,score);
  if(!preview)return null;
  return {...preview,rehearsal:{originalIds:(rehearsal?.originalIds||cards.map(card=>card.id)).slice(),change:preview.change}};
}
function renderRehearsalV53(state,pool=e,score=productionScore){
  const cards=state.drawn;
  if(![5,6].includes(cards?.length))return '';
  const rehearsal=state.rehearsal||createRehearsalV53(cards);
  const originals=rehearsal.originalIds.map(id=>pool.find(card=>card.id===id));
  const originalScore=score(originals).score;
  const record=`<details><summary>查看初始卡组 · ${originalScore} 分</summary><ul>${originals.map(card=>`<li>${K(copyDimension(card.dimension))}：${K(card.name)}</li>`).join('')}</ul></details>`;
  if(rehearsal.change){
    const from=pool.find(card=>card.id===rehearsal.change.fromId),to=pool.find(card=>card.id===rehearsal.change.toId);
    return `<section class="rewrite-panel" tabindex="-1"><h2>这一幕，经过你的选择</h2><p>${K(copyDimension(to.dimension))}：${K(from.name)} → ${K(to.name)}</p><p>初始卡组 ${originalScore} 分 → 改写后 ${score(cards).score} 分。本场换卡已用，故事与分享内容均采用当前卡组。</p>${record}</section>`;
  }
  if(rehearsal.locked)return `<section class="rewrite-panel" tabindex="-1"><h2>改写这一幕</h2><p>这台戏已经改写过一次，当前查看初始卡组。本场换卡已用，可以在最近节目单中继续查看改写后的版本。</p>${record}</section>`;
  const options=rewriteOptionsV53(cards,pool,state.owned||[]);
  if(!options.length)return `<section class="rewrite-panel"><h2>改写这一幕</h2><p>本场可以用已收藏的同维卡换一张。现在还没有可替换的收藏，继续收集后，就能试试不同人物或情境。</p>${record}</section>`;
  const selected=state.rehearsalPreview||'';
  const preview=previewRewriteV53(cards,pool,state.owned||[],rehearsal,selected,score);
  const signed=value=>value>0?'+'+value:String(value);
  const selector=cards.map(current=>{
    const choices=options.filter(card=>card.dimension===current.dimension);
    return choices.length?`<optgroup label="${K(copyDimension(current.dimension))} · 当前 ${K(current.name)}">${choices.map(card=>`<option value="${K(card.id)}"${card.id===selected?' selected':''}>${K(card.name)}</option>`).join('')}</optgroup>`:'';
  }).join('');
  const comparison=preview?`<div class="rewrite-preview" aria-live="polite"><p>${K(pool.find(card=>card.id===preview.change.fromId).name)} → ${K(pool.find(card=>card.id===preview.change.toId).name)}</p><h3>${K(dramaticTitleV40(preview.drawn))}</h3><p>${K(shortScene(preview.drawn))}</p><p>整台 ${preview.before.score} → ${preview.after.score} 分（${signed(preview.delta)}）；同星奖励 ${preview.before.resonance} → ${preview.after.resonance}，羁绊奖励 ${preview.before.bonds} → ${preview.after.bonds}。</p><p>分数升降都可以选择；确认后，这一幕会采用上面的故事。</p><button type="button" class="btn primary" data-action="rewrite-confirm">就用这张，改写这一幕</button></div>`:'';
  return `<section class="rewrite-panel"><h2>改写这一幕</h2><p>换一张，故事会怎么变？从已收藏的同维卡中选一张，先看分数变化，再决定。本场只可确认一次。</p><label for="rewrite-choice-v53">选择已收藏的卡</label><select id="rewrite-choice-v53" data-rewrite-choice><option value="">先选一张看看</option>${selector}</select>${comparison}${record}</section>`;
}
function handleRehearsalV53(action,target){
  if(!['rewrite-preview','rewrite-confirm'].includes(action))return false;
  if(Y.view!=='result')return true;
  Y.rehearsal ||= createRehearsalV53(Y.drawn);
  if(action==='rewrite-preview'){
    Y.rehearsalPreview=target.value;
    Z({preserveScroll:true});
    document.getElementById('rewrite-choice-v53')?.focus({preventScroll:true});
    return true;
  }
  const result=applyRewriteV53(Y.drawn,e,Y.owned,Y.rehearsal,Y.rehearsalPreview);
  if(!result){Q('请先选择一张已收藏的同维卡；本场只能确认一次。');return true;}
  finishProductionV40();
  Y.drawn=result.drawn;Y.rehearsal=result.rehearsal;Y.rehearsalPreview='';Y.fromShare=false;
  lastSharePoster=null;
  const lineup=w(Y.drawn);
  try{sessionStorage.setItem('diamasha.owner',lineup);}catch{}
  history.replaceState({...history.state,lineup},'',`#m=${lineup}`);
  Z({preserveScroll:true});
  document.querySelector('.rewrite-panel')?.focus({preventScroll:true});
  Q('已改写这一幕，分享与长图也会使用这组卡。');
  return true;
}

if(typeof module!=='undefined'&&module.exports)module.exports={balancedWeightsV53,drawBalancedV53,actualRatesV53,createRehearsalV53,rewriteOptionsV53,previewRewriteV53,applyRewriteV53,renderRehearsalV53,handleRehearsalV53};
