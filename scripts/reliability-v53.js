const sessionKeyV53='diamasha.session.v53';
let sessionV53=readSessionV53(),sessionWrittenV53='',storageFailedV53=false;
let sheetReturnFocusV53=null,sheetInnerFocusV53=null,reliabilityInstalledV53=false;

function cardsFromIdsV53(ids){
  if(!Array.isArray(ids)||ids.length>6||new Set(ids).size!==ids.length)return null;
  const cards=ids.map(id=>e.find(card=>card.id===id));
  return cards.every(Boolean)?cards:null;
}
function savedRehearsalV53(value,cards){
  const original=cardsFromIdsV53(value?.originalIds);
  if(!original||!re(e,value.originalIds))return null;
  const change=value.change;
  if(change&&(!original.some(card=>card.id===change.fromId&&card.dimension===change.dimension)||!cards.some(card=>card.id===change.toId&&card.dimension===change.dimension)))return null;
  return {originalIds:original.map(card=>card.id),change:change?{fromId:change.fromId,toId:change.toId,dimension:change.dimension}:null,...(value.locked?{locked:true}:{})};
}
function reconcileRehearsalV53(cards=Y.drawn,rehearsal=Y.rehearsal,records=sessionV53.recent){
  const ordered=(cards||[]).slice().sort((a,b)=>x.findIndex(dim=>dim.key===a.dimension)-x.findIndex(dim=>dim.key===b.dimension));
  if(!re(e,ordered.map(card=>card.id)))return null;
  const state=savedRehearsalV53(rehearsal,cards)||{originalIds:cards.map(card=>card.id),change:null};
  const originalKey=state.originalIds.slice().sort().join('.');
  if(!state.change&&records.some(row=>(row.rehearsal?.change||row.rehearsal?.locked)&&row.rehearsal.originalIds.slice().sort().join('.')===originalKey))state.locked=true;
  return state;
}
function readSessionV53(){
  const empty={draft:null,recent:[]};
  try{
    const saved=JSON.parse(localStorage.getItem(sessionKeyV53)||'null');
    if(!saved||typeof saved!=='object')return empty;
    const recent=(Array.isArray(saved.recent)?saved.recent:[]).filter(row=>row&&Array.isArray(row.ids)&&re(e,row.ids)).slice(0,5).map(row=>{
      const cards=re(e,row.ids);
      return {ids:cards.map(card=>card.id),rehearsal:savedRehearsalV53(row.rehearsal,cards),fromShare:!!row.fromShare};
    });
    for(const row of recent)row.rehearsal=reconcileRehearsalV53(re(e,row.ids),row.rehearsal,recent);
    const draft=saved.draft,cards=cardsFromIdsV53(draft?.ids);
    const valid=draft&&oe.some(pack=>pack.id===draft.pack)&&['sealed','card','spread'].includes(draft.phase)&&cards&&
      (draft.phase==='sealed'?cards.length===0:cards.length===6&&(draft.pack==='mix'?!!re(e,draft.ids):cards.every(card=>card.dimension===draft.pack)));
    return {draft:valid?{pack:draft.pack,phase:draft.phase,ids:cards.map(card=>card.id),index:Math.max(0,Math.min(cards.length-1,Number.isInteger(draft.index)?draft.index:0)),tutorial:!!draft.tutorial,tutorialNo:Number(draft.tutorialNo)||0,rehearsal:savedRehearsalV53(draft.rehearsal,cards)}:null,recent};
  }catch{return empty;}
}
function storageFailureV53(){
  if(storageFailedV53)return;
  storageFailedV53=true;
  Q('浏览器暂时无法保存，当前收藏仍在；刷新前请先保留分享图或链接。');
}
function saveSessionV53(){
  const booster=Y.booster;
  if(Y.view==='pack'&&booster&&['sealed','card','spread'].includes(booster.phase)){
    sessionV53.draft={pack:Y.pack||'mix',phase:booster.phase,ids:(booster.cards||[]).map(card=>card.id),index:booster.index||0,tutorial:!!booster.tutorial,tutorialNo:booster.tutorialNo||0,rehearsal:savedRehearsalV53(Y.rehearsal,booster.cards||[])};
  }
  const completed=Y.view==='result'?Y.drawn:Y.view==='bundle'?Y.bundle:null;
  if(completed?.length&&sessionV53.draft&&completed.map(card=>card.id).sort().join('.')===sessionV53.draft.ids.slice().sort().join('.'))sessionV53.draft=null;
  if(Y.view==='result'&&re(e,(Y.drawn||[]).map(card=>card.id))){
    Y.rehearsal=reconcileRehearsalV53();
    const ids=Y.drawn.map(card=>card.id),key=ids.join('.');
    sessionV53.recent=[{ids,rehearsal:savedRehearsalV53(Y.rehearsal,Y.drawn),fromShare:!!Y.fromShare},...sessionV53.recent.filter(row=>row.ids.join('.')!==key)].slice(0,5);
    for(const row of sessionV53.recent)row.rehearsal=reconcileRehearsalV53(re(e,row.ids),row.rehearsal);
  }
  const serialized=JSON.stringify(sessionV53);
  if(serialized===sessionWrittenV53)return;
  try{localStorage.setItem(sessionKeyV53,serialized);sessionWrittenV53=serialized;}
  catch{storageFailureV53();}
}
function resumePackV53(){
  const saved=sessionV53.draft;
  if(!saved)return;
  const cards=cardsFromIdsV53(saved.ids);
  if(!cards)return;
  Object.assign(Y,{view:'pack',pack:saved.pack,packCard:null,sheet:null,index:0,fromPack:false,fromShare:false,keptShare:null,talkOpen:false,bundle:[],drawn:saved.phase==='spread'&&saved.pack==='mix'?cards:[],rehearsal:reconcileRehearsalV53(cards,saved.rehearsal),rehearsalPreview:null,
    booster:{phase:saved.phase,cards,index:saved.index,tutorial:saved.tutorial,tutorialNo:saved.tutorialNo,revealDone:saved.phase!=='sealed',askSkip:false,skipPreamble:false,showShare:false}});
  lastSharePoster=null;
  or();Z();
}
function restoreProgramV53(index){
  const saved=sessionV53.recent[index],cards=saved&&re(e,saved.ids);
  if(!cards)return;
  Object.assign(Y,{view:'result',drawn:cards,index:cards.length-1,sheet:null,booster:null,fromPack:false,fromShare:saved.fromShare,keptShare:null,talkOpen:false,rehearsal:reconcileRehearsalV53(cards,saved.rehearsal),rehearsalPreview:null});
  lastSharePoster=null;
  history.pushState({lineup:w(cards)},'','#m='+w(cards));Z();
}
function savedRehearsalForCardsV53(cards){
  const key=cards.map(card=>card.id).sort().join('.');
  const saved=[...sessionV53.recent,sessionV53.draft].find(row=>row&&row.ids.slice().sort().join('.')===key);
  const state=reconcileRehearsalV53(cards,saved?.rehearsal);
  return saved||state?.locked?state:null;
}
function renderResumeV53(){
  if(!sessionV53.draft&&!sessionV53.recent.length)return '';
  const draft=sessionV53.draft;
  const progress=draft?(draft.phase==='sealed'?'还没拆封':draft.phase==='spread'?'卡牌已齐，看看这台戏':`翻到第 ${draft.index+1} / ${draft.ids.length} 张`):'';
  return `<section class="resume-v53" aria-label="继续游戏">${draft?`<button class="btn resume-pack-v53" data-action="resume-pack">继续上次开包 <span>${progress}</span></button>`:''}${sessionV53.recent.length?`<details class="recent-programs-v53"><summary>最近的节目单 · ${sessionV53.recent.length}</summary><div>${sessionV53.recent.map((row,index)=>{const cards=re(e,row.ids);return `<button class="recent-program-v53" data-action="recent-show" data-index="${index}"><span>${K(dramaticTitleV40(cards))}</span><b>${Xt(cards).score} 分</b></button>`;}).join('')}</div></details>`:''}${storageFailedV53?'<p class="storage-note-v53">本次内容暂存在当前页面，浏览器尚未保存。</p>':''}</section>`;
}

function focusMarkV53(node){
  return node?{node,data:{...node.dataset},tag:node.tagName}:null;
}
function findFocusV53(mark,scope=document){
  if(!mark)return null;
  if(mark.node.isConnected&&scope.contains?.(mark.node))return mark.node;
  if(!mark.data.action)return null;
  return [...scope.querySelectorAll('[data-action]')].find(node=>node.tagName===mark.tag&&Object.entries(mark.data).every(([key,value])=>node.dataset[key]===value));
}
function sheetFocusableV53(sheet){
  return [...sheet.querySelectorAll('button:not([disabled]),summary,a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(node=>!node.hidden&&node.getClientRects().length);
}
function captureSheetFocusV53(){
  const sheet=document.querySelector('.sheet');
  if(!sheet&&Y.sheet){sheetReturnFocusV53=focusMarkV53(document.activeElement);sheetInnerFocusV53=null;}
  else if(sheet&&Y.sheet)sheetInnerFocusV53=sheet.contains(document.activeElement)?focusMarkV53(document.activeElement):null;
}
function restoreSheetFocusV53(){
  const sheet=document.querySelector('.sheet');
  if(sheet&&Y.sheet){
    sheet.setAttribute('tabindex','-1');
    (findFocusV53(sheetInnerFocusV53,sheet)||sheetFocusableV53(sheet)[0]||sheet).focus({preventScroll:true});
  }else if(sheetReturnFocusV53){
    const target=findFocusV53(sheetReturnFocusV53)||document.querySelector('#app button');
    sheetReturnFocusV53=null;sheetInnerFocusV53=null;
    target?.focus({preventScroll:true});
  }
}
function sheetKeydownV53(event){
  const sheet=document.querySelector('.sheet');
  if(!sheet||!Y.sheet)return;
  if(event.key==='Escape'){
    event.preventDefault();event.stopImmediatePropagation();
    Y.sheet=null;Z({preserveScroll:true});
  }else if(event.key==='Tab'){
    const items=sheetFocusableV53(sheet),first=items[0]||sheet,last=items.at(-1)||sheet;
    if(!sheet.contains(document.activeElement)||(event.shiftKey?document.activeElement===first:document.activeElement===last)||!items.length){
      event.preventDefault();(event.shiftKey?last:first).focus({preventScroll:true});
    }
  }
}
function installReliabilityV53(){
  if(reliabilityInstalledV53)return;
  reliabilityInstalledV53=true;
  document.addEventListener('keydown',sheetKeydownV53,true);
  window.addEventListener('pagehide',saveSessionV53);
}
