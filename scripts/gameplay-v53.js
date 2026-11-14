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
let rewriteGalleryV54={key:'',dimension:'',page:0,open:false};
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
  const candidate=rewriteOptionsV53(cards,pool,rewriteEligibleIdsV54(cards,ownedIds,rehearsal)).find(card=>card.id===replacementId);
  if(!candidate)return null;
  const original=cards.find(card=>card.dimension===candidate.dimension);
  const drawn=cards.map(card=>card.dimension===candidate.dimension?candidate:card);
  const before=score(cards),after=score(drawn);
  return {drawn,before,after,delta:after.score-before.score,claimStarter:!ownedIds.includes(candidate.id),change:{fromId:original.id,toId:candidate.id,dimension:candidate.dimension}};
}
function applyRewriteV53(cards,pool,ownedIds,rehearsal,replacementId,score=productionScore){
  const preview=previewRewriteV53(cards,pool,ownedIds,rehearsal,replacementId,score);
  if(!preview)return null;
  return {...preview,rehearsal:{originalIds:(rehearsal?.originalIds||cards.map(card=>card.id)).slice(),change:preview.change}};
}
function rewriteCardV54(card,label=''){
  const stars=['C','UC','R','SR','SSR','UR','LR'].indexOf(card.rarity)+1;
  return `<span class="rewrite-card-v54 rarity-${K(card.rarity)}">${label?`<small class="rewrite-card-label-v54">${K(label)}</small>`:''}<span class="rewrite-card-art-v54" aria-hidden="true">${typeof Ct==='function'?Ct(card):''}</span><strong>${K(card.name)}</strong><span class="rewrite-card-meta-v55"><span class="rewrite-stars-v55" aria-label="${stars} 星">${'★'.repeat(stars)}</span><span>单卡 ${Math.round((card.atk+card.def)/2)} 分</span></span></span>`;
}
function syncRewriteGalleryV55(state){
  const key=(state.rehearsal?.originalIds||state.drawn.map(card=>card.id)).slice().sort().join('.');
  if(rewriteGalleryV54.key!==key)rewriteGalleryV54={key,dimension:'',page:0,open:false};
}
function rewriteEntryIdV55(dimension){return 'rewrite-open-v55-'+['剧目','风格体系','导演手法','主演','配角','环境'].indexOf(dimension);}
function renderRewriteEntryV55(state,card,pool=e){
  syncRewriteGalleryV55(state);
  const rehearsal=state.rehearsal||createRehearsalV53(state.drawn);
  const choices=rewriteOptionsV53(state.drawn,pool,rewriteEligibleIdsV54(state.drawn,state.owned||[],rehearsal)).filter(choice=>choice.dimension===card.dimension);
  return `<button type="button" id="${rewriteEntryIdV55(card.dimension)}" class="rewrite-entry-v55" data-action="rewrite-open" data-dimension="${K(card.dimension)}" aria-expanded="${rewriteGalleryV54.open&&rewriteGalleryV54.dimension===card.dimension}" aria-controls="rewrite-picker-v55" aria-label="替换${K(copyDimension(card.dimension))}，${choices.length} 张候选">替换<span>${choices.length}张</span></button>`;
}
function renderRehearsalV53(state,pool=e,score=productionScore){
  if(typeof syncProgressV54==='function')syncProgressV54();
  const cards=state.drawn;
  if(![5,6].includes(cards?.length))return '';
  syncRewriteGalleryV55(state);
  const rehearsal=state.rehearsal||createRehearsalV53(cards);
  const originals=rehearsal.originalIds.map(id=>pool.find(card=>card.id===id));
  const record=rehearsal.change||rehearsal.locked?`<details class="rewrite-record-v55"><summary>查看初始卡组 · ${score(originals).score} 分</summary><ul>${originals.map(card=>`<li>${K(copyDimension(card.dimension))}：${K(card.name)}</li>`).join('')}</ul></details>`:'';
  if(!rewriteGalleryV54.open)return record;
  const dimension=rewriteGalleryV54.dimension;
  const current=cards.find(card=>card.dimension===dimension);
  if(!current)return record;
  const giftIds=typeof starterCandidateIdsV54==='function'?starterCandidateIdsV54(cards,rehearsal):[];
  const owned=state.owned||[],selected=state.rehearsalPreview||'';
  const choices=rewriteOptionsV53(cards,pool,rewriteEligibleIdsV54(cards,owned,rehearsal)).filter(card=>card.dimension===dimension).sort((a,b)=>Number(giftIds.includes(b.id))-Number(giftIds.includes(a.id)));
  const preview=previewRewriteV53(cards,pool,owned,rehearsal,selected,score);
  const selectedHere=preview?.change.dimension===dimension?pool.find(card=>card.id===selected):null;
  const pages=Math.max(1,Math.ceil(choices.length/12)),page=Math.max(0,Math.min(pages-1,rewriteGalleryV54.page));
  const giftChoices=choices.some(card=>giftIds.includes(card.id)&&!owned.includes(card.id));
  const grid=choices.length?`<div id="rewrite-choice-v53" class="rewrite-choices-v54" tabindex="-1" aria-label="${K(copyDimension(dimension))}候选">${choices.slice(page*12,(page+1)*12).map(card=>`<button type="button" class="rewrite-choice-v54${selected===card.id?' is-selected':''}" data-action="rewrite-preview" data-card-id="${K(card.id)}" aria-pressed="${selected===card.id}">${rewriteCardV54(card,giftIds.includes(card.id)&&!owned.includes(card.id)?'首场试选':'点击替换')}</button>`).join('')}</div>`:'<p class="rewrite-note-v55">这个维度还没有可替换的收藏。</p>';
  const pager=pages>1?`<nav class="rewrite-pages-v54" aria-label="候选分页"><button type="button" class="text-btn" data-action="rewrite-page" data-page="${page-1}"${page===0?' disabled':''}>上一页</button><span>${page+1} / ${pages}</span><button type="button" class="text-btn" data-action="rewrite-page" data-page="${page+1}"${page+1===pages?' disabled':''}>下一页</button></nav>`:'';
  const selection=selectedHere?`<div class="rewrite-selection-v55" aria-live="polite"><div><p>${K(current.name)} → <strong>${K(selectedHere.name)}</strong></p>${preview.claimStarter?`<h3>${K(dramaticTitleV40(preview.drawn))}</h3><p>${K(shareStoryBeatV54(preview.drawn))}</p>`:''}</div><button type="button" class="btn primary" data-action="rewrite-confirm">${preview.claimStarter?'选这张入藏并替换':'确认替换'}</button></div>`:'';
  return `<section id="rewrite-picker-v55" class="rewrite-panel rewrite-panel-v55" tabindex="-1" aria-label="替换${K(copyDimension(dimension))}"><div class="rewrite-header-v55"><h2>${K(copyDimension(dimension))} · 选择一张</h2><button type="button" class="text-btn" data-action="rewrite-close" aria-label="收起替换候选">收起</button></div>${giftChoices?'<p class="rewrite-note-v55">首场两张试选，确认的一张才入藏。</p>':''}${grid}${pager}${selection}</section>${record}`;
}

function handleRehearsalV53(action,target){
  if(!['rewrite-open','rewrite-close','rewrite-preview','rewrite-confirm','rewrite-dimension','rewrite-page'].includes(action))return false;
  if(Y.view!=='result')return true;
  Y.rehearsal ||= createRehearsalV53(Y.drawn);
  syncRewriteGalleryV55(Y);
  if(action==='rewrite-close'){
    rewriteGalleryV54.open=false;Y.rehearsalPreview='';
    Z({preserveScroll:true});document.getElementById(rewriteEntryIdV55(rewriteGalleryV54.dimension))?.focus({preventScroll:true});return true;
  }
  if(action==='rewrite-open'||action==='rewrite-dimension'||action==='rewrite-page'){
    if(action!=='rewrite-page'){
      if(!Y.drawn.some(card=>card.dimension===target.dataset.dimension))return true;
      rewriteGalleryV54.dimension=target.dataset.dimension;rewriteGalleryV54.page=0;Y.rehearsalPreview='';
    }
    else rewriteGalleryV54.page=Number(target.dataset.page)||0;
    rewriteGalleryV54.open=true;
    Z({preserveScroll:true});
    const panel=document.getElementById('rewrite-picker-v55');
    panel?.focus({preventScroll:true});panel?.scrollIntoView?.({behavior:typeof J!=='undefined'&&J?'instant':'smooth',block:'start'});return true;
  }
  if(action==='rewrite-preview'){
    const id=target.value||target.dataset?.cardId||'';
    const preview=previewRewriteV53(Y.drawn,e,Y.owned,Y.rehearsal,id);
    Y.rehearsalPreview=preview?id:'';
    if(preview&&typeof recordPreviewV54==='function')recordPreviewV54(Y.drawn,Y.rehearsal,id);
    if(preview&&!preview.claimStarter)return handleRehearsalV53('rewrite-confirm',target);
    Z({preserveScroll:true});
    document.getElementById('rewrite-choice-v53')?.focus({preventScroll:true});
    return true;
  }
  const result=applyRewriteV53(Y.drawn,e,Y.owned,Y.rehearsal,Y.rehearsalPreview);
  if(!result){Q('请选择可替换的同维卡。');return true;}
  finishProductionV40();
  const earned=typeof recordRewriteV54==='function'?recordRewriteV54(Y.drawn,result):[];
  if(earned===null){Y.rehearsalPreview='';Z({preserveScroll:true});Q('这场试选已在另一个页面确认，请查看最近节目单。');return true;}
  if(result.claimStarter&&!Y.owned.includes(result.change.toId))er(result.change.toId);
  Y.drawn=result.drawn;Y.rehearsal=result.rehearsal;Y.rehearsalPreview='';Y.fromShare=false;
  rewriteGalleryV54.open=false;
  lastSharePoster=null;
  const lineup=w(Y.drawn);
  try{sessionStorage.setItem('diamasha.owner',lineup);}catch{}
  history.replaceState({...history.state,lineup},'',programLocationV54(lineup));
  Z({preserveScroll:true});
  const trigger=document.getElementById(rewriteEntryIdV55(result.change.dimension));
  trigger?.focus({preventScroll:true});trigger?.scrollIntoView?.({behavior:typeof J!=='undefined'&&J?'instant':'smooth',block:'nearest'});
  Q(earned.length?`已替换，获得印记：${earned.join('、')}。`:'已替换，故事与分享已更新。');
  return true;
}

if(typeof module!=='undefined'&&module.exports)module.exports={balancedWeightsV53,drawBalancedV53,actualRatesV53,createRehearsalV53,rewriteOptionsV53,previewRewriteV53,applyRewriteV53,renderRewriteEntryV55,renderRehearsalV53,handleRehearsalV53};
