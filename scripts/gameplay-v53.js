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
let rewriteGalleryV54={key:'',dimension:'',page:0};
function rewriteEligibleIdsV54(cards,ownedIds,rehearsal){
  return [...ownedIds,...(typeof starterCandidateIdsV54==='function'?starterCandidateIdsV54(cards,rehearsal):[])];
}
function rewriteOptionsV53(cards,pool,ownedIds){
  const owned=new Set(ownedIds),dimensions=new Set(cards.map(card=>card.dimension));
  const current=new Set(cards.map(card=>card.id));
  return pool.filter(card=>owned.has(card.id)&&dimensions.has(card.dimension)&&!current.has(card.id));
}
function previewRewriteV53(cards,pool,ownedIds,rehearsal,replacementId,score=productionScore){
  if(typeof syncProgressV54==='function')syncProgressV54();
  if(rehearsal?.change||rehearsal?.locked||(typeof starterSpentV54==='function'&&starterSpentV54(cards,rehearsal)))return null;
  const candidate=rewriteOptionsV53(cards,pool,rewriteEligibleIdsV54(cards,ownedIds,rehearsal)).find(card=>card.id===replacementId);
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
function rewriteCardV54(card,label=''){
  const stars=['C','UC','R','SR','SSR','UR','LR'].indexOf(card.rarity)+1;
  return `<span class="rewrite-card-v54 rarity-${K(card.rarity)}">${label?`<small class="rewrite-card-label-v54">${K(label)}</small>`:''}<span class="rewrite-card-art-v54">${typeof Ct==='function'?Ct(card):''}</span><strong>${K(card.name)}</strong><span>${K(copyDimension(card.dimension))} · ${stars} 星</span><small>单卡 ${Math.round((card.atk+card.def)/2)} 分</small></span>`;
}
function renderRehearsalV53(state,pool=e,score=productionScore){
  if(typeof syncProgressV54==='function')syncProgressV54();
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
  if(rehearsal.locked||(typeof starterSpentV54==='function'&&starterSpentV54(cards,rehearsal)))return `<section class="rewrite-panel" tabindex="-1"><h2>改写这一幕</h2><p>这台戏已经改写过一次，当前查看初始卡组。本场换卡已用，可以在最近节目单中继续查看改写后的版本。</p>${record}</section>`;
  const giftIds=typeof starterCandidateIdsV54==='function'?starterCandidateIdsV54(cards,rehearsal):[];
  const options=rewriteOptionsV53(cards,pool,rewriteEligibleIdsV54(cards,state.owned||[],rehearsal));
  if(!options.length)return `<section class="rewrite-panel"><h2>改写这一幕</h2><p>本场可以用已收藏的同维卡换一张。现在还没有可替换的收藏，继续收集后，就能试试不同人物或情境。</p>${record}</section>`;
  const selected=state.rehearsalPreview||'';
  const preview=previewRewriteV53(cards,pool,state.owned||[],rehearsal,selected,score);
  const signed=value=>value>0?'+'+value:String(value);
  const key=rehearsal.originalIds.slice().sort().join('.');
  if(rewriteGalleryV54.key!==key)rewriteGalleryV54={key,dimension:pool.find(card=>giftIds.includes(card.id))?.dimension||options[0].dimension,page:0};
  const dimensions=cards.map(card=>card.dimension).filter(dim=>options.some(card=>card.dimension===dim));
  if(!dimensions.includes(rewriteGalleryV54.dimension))rewriteGalleryV54.dimension=dimensions[0];
  const choices=options.filter(card=>card.dimension===rewriteGalleryV54.dimension).sort((a,b)=>Number(giftIds.includes(b.id))-Number(giftIds.includes(a.id)));
  const pages=Math.ceil(choices.length/12),page=Math.max(0,Math.min(pages-1,rewriteGalleryV54.page));
  const selector=`<div class="rewrite-dimensions-v54" aria-label="选择改写维度">${dimensions.map(dim=>`<button type="button" class="text-btn" data-action="rewrite-dimension" data-dimension="${K(dim)}" aria-pressed="${dim===rewriteGalleryV54.dimension}">${K(copyDimension(dim))}</button>`).join('')}</div><div id="rewrite-choice-v53" class="rewrite-choices-v54" tabindex="-1" aria-label="选择候选卡，先预览故事">${choices.slice(page*12,(page+1)*12).map(card=>`<button type="button" class="rewrite-choice-v54${selected===card.id?' is-selected':''}" data-action="rewrite-preview" data-card-id="${K(card.id)}" aria-pressed="${selected===card.id}">${rewriteCardV54(card,giftIds.includes(card.id)&&!(state.owned||[]).includes(card.id)?'首场试选 · 确认才入藏':'已收藏')}</button>`).join('')}</div>${pages>1?`<nav class="rewrite-pages-v54" aria-label="候选分页"><button type="button" class="text-btn" data-action="rewrite-page" data-page="${page-1}"${page===0?' disabled':''}>上一页</button><span>${page+1} / ${pages}</span><button type="button" class="text-btn" data-action="rewrite-page" data-page="${page+1}"${page+1===pages?' disabled':''}>下一页</button></nav>`:''}`;
  const comparison=preview?`<div class="rewrite-preview" aria-live="polite"><div class="rewrite-comparison-v54">${rewriteCardV54(pool.find(card=>card.id===preview.change.fromId),'当前')}${rewriteCardV54(pool.find(card=>card.id===preview.change.toId),'候选')}</div><h3>${K(dramaticTitleV40(preview.drawn))}</h3><p>${K(shortScene(preview.drawn))}</p><details class="rewrite-before-v54"><summary>对照原来的故事</summary><h4>${K(dramaticTitleV40(cards))}</h4><p>${K(shortScene(cards))}</p></details><p class="rewrite-score-v54">整台 ${preview.before.score} → ${preview.after.score} 分（${signed(preview.delta)}）</p><p>同星奖励 ${preview.before.resonance} → ${preview.after.resonance}；羁绊奖励 ${preview.before.bonds} → ${preview.after.bonds}。两项均已计入整台总分，不额外叠加。</p><p>分数升降都可以选择；确认后，这一幕会采用上面的故事。${giftIds.includes(preview.change.toId)&&!(state.owned||[]).includes(preview.change.toId)?'这张试选卡也会永久加入你的收藏。':''}</p><button type="button" class="btn primary" data-action="rewrite-confirm">就用这张，改写这一幕</button></div>`:'';
  return `<section class="rewrite-panel"><h2>改写这一幕</h2><p>换一张，故事会怎么变？点候选卡自由预览，比较故事再决定。本场只可确认一次。</p>${giftIds.length?'<p class="rewrite-gift-v54">首场有两张同维试选卡。可以都看看，确认的一张才入藏；另一张不会因预览获得。</p>':''}${selector}${comparison}${record}</section>`;
}
function handleRehearsalV53(action,target){
  if(!['rewrite-preview','rewrite-confirm','rewrite-dimension','rewrite-page'].includes(action))return false;
  if(Y.view!=='result')return true;
  Y.rehearsal ||= createRehearsalV53(Y.drawn);
  if(action==='rewrite-dimension'||action==='rewrite-page'){
    if(action==='rewrite-dimension'){rewriteGalleryV54.dimension=target.dataset.dimension;rewriteGalleryV54.page=0;}
    else rewriteGalleryV54.page=Number(target.dataset.page)||0;
    Z({preserveScroll:true});document.getElementById('rewrite-choice-v53')?.focus({preventScroll:true});return true;
  }
  if(action==='rewrite-preview'){
    const id=target.value||target.dataset?.cardId||'';
    const preview=previewRewriteV53(Y.drawn,e,Y.owned,Y.rehearsal,id);
    Y.rehearsalPreview=preview?id:'';
    if(preview&&typeof recordPreviewV54==='function')recordPreviewV54(Y.drawn,Y.rehearsal,id);
    Z({preserveScroll:true});
    document.getElementById('rewrite-choice-v53')?.focus({preventScroll:true});
    return true;
  }
  const result=applyRewriteV53(Y.drawn,e,Y.owned,Y.rehearsal,Y.rehearsalPreview);
  if(!result){Q('请先选择一张已收藏的同维卡；本场只能确认一次。');return true;}
  finishProductionV40();
  const giftIds=typeof starterCandidateIdsV54==='function'?starterCandidateIdsV54(Y.drawn,Y.rehearsal):[];
  const earned=typeof recordRewriteV54==='function'?recordRewriteV54(Y.drawn,result):[];
  if(earned===null){Y.rehearsalPreview='';Z({preserveScroll:true});Q('这场试选已在另一个页面确认，请查看最近节目单。');return true;}
  if(giftIds.includes(result.change.toId)&&!Y.owned.includes(result.change.toId))er(result.change.toId);
  Y.drawn=result.drawn;Y.rehearsal=result.rehearsal;Y.rehearsalPreview='';Y.fromShare=false;
  lastSharePoster=null;
  const lineup=w(Y.drawn);
  try{sessionStorage.setItem('diamasha.owner',lineup);}catch{}
  history.replaceState({...history.state,lineup},'',programLocationV54(lineup));
  Z({preserveScroll:true});
  document.querySelector('.rewrite-panel')?.focus({preventScroll:true});
  Q(earned.length?`已改写这一幕，获得印记：${earned.join('、')}。`:'已改写这一幕，分享与长图也会使用这组卡。');
  return true;
}

if(typeof module!=='undefined'&&module.exports)module.exports={balancedWeightsV53,drawBalancedV53,actualRatesV53,createRehearsalV53,rewriteOptionsV53,previewRewriteV53,applyRewriteV53,renderRehearsalV53,handleRehearsalV53};
