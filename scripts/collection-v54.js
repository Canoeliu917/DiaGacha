// Collection and duplicate credits commit together, so reopening a pack cannot pay twice.
const collectionKeyV54='diamasha.collection.v54';
let collectionV54=readCollectionV54(),singleBusyV54=false;
function cleanCollectionV54(raw,pool){
  if(!raw||typeof raw!=='object'||!Array.isArray(raw.owned)||!Number.isSafeInteger(raw.credits)||raw.credits<0)throw Error('收藏存档格式不正确');
  const known=new Set(pool.map(card=>card.id));
  if(raw.owned.length>pool.length||raw.owned.some(id=>!known.has(id)))throw Error('存档包含当前版本无法识别的卡牌');
  return {owned:[...new Set(raw.owned)],credits:raw.credits,lastDraw:null};
}
function readCollectionV54(){
  let saved=null;
  try{
    const raw=JSON.parse(localStorage.getItem(collectionKeyV54)||'null');
    if(raw)saved=cleanCollectionV54(raw,e);
  }catch{}
  let legacy=[];
  try{legacy=JSON.parse(localStorage.getItem('diamasha.owned')||'[]');}catch{}
  const known=new Set(e.map(card=>card.id));
  return {owned:[...new Set([...(saved?.owned||[]),...(Array.isArray(legacy)?legacy.filter(id=>known.has(id)):[])])],credits:saved?.credits||0,lastDraw:null};
}
function planDrawCollectionV54(state,cards,spend=0){
  if(!Number.isSafeInteger(spend)||spend<0||state.credits<spend)throw Error('补抽次数不足');
  const owned=new Set(state.owned),fresh=[],repeated=[];
  for(const card of cards){
    if(owned.has(card.id))repeated.push(card.id);
    else{owned.add(card.id);fresh.push(card.id);}
  }
  const credits=state.credits-spend+repeated.length;
  if(!Number.isSafeInteger(credits))throw Error('补抽次数超出存档范围');
  return {owned:[...owned],credits,lastDraw:{ids:cards.map(card=>card.id),fresh,repeated}};
}
function writeCollectionV54(next){
  collectionV54=next;
  Y.owned=next.owned.slice();
  try{localStorage.setItem(collectionKeyV54,JSON.stringify(next));}
  catch{storageFailureV53();}
  // Keep older releases able to read newly collected cards.
  try{localStorage.setItem('diamasha.owned',JSON.stringify(next.owned));}catch{}
}
function grantCollectionV54(id){
  if(typeof storageFailedV53==='undefined'||!storageFailedV53)collectionV54=readCollectionV54();
  writeCollectionV54({...collectionV54,owned:[...new Set([...collectionV54.owned,id])]});
}
function settleDrawV54(cards,spend=0){
  if(typeof storageFailedV53==='undefined'||!storageFailedV53)collectionV54=readCollectionV54();
  const next=planDrawCollectionV54(collectionV54,cards,spend);
  writeCollectionV54(next);
  Y.drawReceiptV54=next.lastDraw;
  return next.lastDraw;
}
function duplicateReceiptV54(cards){
  const receipt=Y.drawReceiptV54;
  if(!receipt||receipt.ids.join('.')!==cards.map(card=>card.id).join('.'))return '';
  return `<p class="draw-receipt-v54" role="status">新增 ${receipt.fresh.length} 张${receipt.repeated.length?` · 重复 ${receipt.repeated.length} 张，已补偿 ${receipt.repeated.length} 次全卡池单抽`:' · 已收入收藏'}</p>`;
}
function duplicateEntryV54(){
  return `<button type="button" class="btn ghost" data-action="duplicates">重复卡补抽 · ${collectionV54.credits} 次</button>`;
}
function duplicatesSheetV54(){
  const card=e.find(card=>card.id===Y.lastSingleV54),receipt=collectionV54.lastDraw;
  return `<h2 id="sheet-title">重复卡补抽</h2><p>每张重复卡补偿一次单抽。当前可用 <strong>${collectionV54.credits}</strong> 次。</p><p>从 500 张常驻卡中抽一张：先按普通包星级概率选档，再在全池该档等概率选卡。不消耗综合包保底；抽到重复卡会返还本次机会。</p>${card?`<div class="single-reveal-v54">${Cn(card)}<p role="status">${receipt?.repeated.includes(card.id)?'这张已有，已返还 1 次机会。':'新卡，已收入收藏。'}</p></div>`:''}<div class="dock"><button type="button" class="btn primary" data-action="duplicate-draw" ${singleBusyV54||collectionV54.credits<1?'disabled':''}>${singleBusyV54?'正在揭晓…':'抽取 1 张'}</button><button type="button" class="btn ghost" data-action="close-sheet">收回</button></div>`;
}
function handleCollectionV54(action){
  if(action==='duplicates'){if(!storageFailedV53)collectionV54=readCollectionV54();Y.sheet={kind:'duplicates'};Y.lastSingleV54=null;Z({preserveScroll:true});return true;}
  if(action!=='duplicate-draw')return false;
  if(!storageFailedV53)collectionV54=readCollectionV54();
  if(singleBusyV54||collectionV54.credits<1)return true;
  singleBusyV54=true;
  const tier=ee(activeCards,C()),card=tier[Math.floor(Math.random()*tier.length)];
  settleDrawV54([card],1);Y.lastSingleV54=card.id;
  checkMilestones();Z({preserveScroll:true});
  setTimeout(()=>{singleBusyV54=false;if(Y.sheet?.kind==='duplicates')Z({preserveScroll:true});},420);
  return true;
}
if(typeof module!=='undefined'&&module.exports)module.exports={cleanCollectionV54,planDrawCollectionV54};
