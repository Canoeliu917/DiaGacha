const progressKeyV54='diamasha.progress.v54';
const achievementListV54=[
  ['opening','开幕人','自己完成第一包，生成节目单。'],
  ['rewrite','改写者','确认一次换卡，让故事采用你的选择。'],
  ['compare','两案之间','同场预览两张不同候选，再确认其中一张。'],
  ['persona','变调的人','换一张演法或手段，让本场戏格改变。'],
  ['perspectives','换个角度','改写过三个维度，其中有人物或空间，也有演法或手段。'],
  ['reunion','旧识重逢','亲手换卡，新增一条原作羁绊。需要对应的收藏。'],
  ['weaver','六维织戏人','六维都改写过，并完成两案之间、变调的人与旧识重逢。'],
];
const rewriteDimensionsV54=['剧目','风格体系','导演手法','主演','配角','环境'];
function emptyProgressV54(){return {version:1,unlocked:[],dimensions:[],starter:null,previews:[]};}
function normalizeProgressV54(value,pool=e){
  const out=emptyProgressV54();
  if(!value||typeof value!=='object')return out;
  const validIds=new Set(pool.map(card=>card.id));
  const unique=(items,allowed)=>Array.isArray(items)?[...new Set(items.filter(item=>allowed.has(item)))]:[];
  out.unlocked=unique(value.unlocked,new Set(achievementListV54.map(row=>row[0])));
  out.dimensions=unique(value.dimensions,new Set(rewriteDimensionsV54));
  const validLineup=ids=>Array.isArray(ids)&&[5,6].includes(ids.length)&&new Set(ids).size===ids.length&&
    rewriteDimensionsV54.filter(dim=>ids.length===6||dim!=='配角').every((dim,index)=>pool.some(card=>card.id===ids[index]&&card.dimension===dim));
  const starter=value.starter;
  if(starter&&starter.ids?.length===6&&validLineup(starter.ids)){
    const candidates=unique(starter.candidates,validIds).filter(id=>!starter.ids.includes(id));
    if(candidates.length===2&&pool.find(card=>card.id===candidates[0]).dimension===pool.find(card=>card.id===candidates[1]).dimension){
      out.starter={ids:starter.ids.slice(),candidates,claimedId:validIds.has(starter.claimedId)&&!starter.ids.includes(starter.claimedId)?starter.claimedId:null};
    }
  }
  out.previews=(Array.isArray(value.previews)?value.previews:[]).filter(row=>row&&validLineup(row.ids)).slice(0,5).map(row=>({ids:row.ids.slice(),candidates:unique(row.candidates,validIds).slice(0,2)}));
  return out;
}
function readProgressV54(){
  try{return normalizeProgressV54(JSON.parse(localStorage.getItem(progressKeyV54)||'null'));}
  catch{return emptyProgressV54();}
}
let progressV54=readProgressV54(),progressUnsavedV54=false;
function syncProgressV54(){
  // Stored progress is authoritative, including an explicit import in another page.
  // Preserve local changes only when this page could not save them.
  try{
    const latest=normalizeProgressV54(JSON.parse(localStorage.getItem(progressKeyV54)||'null'));
    progressV54=progressUnsavedV54?mergeProgressV54(latest,progressV54):latest;
  }catch{}
  return progressV54;
}
function saveProgressV54(){
  try{localStorage.setItem(progressKeyV54,JSON.stringify(progressV54));progressUnsavedV54=false;}
  catch{progressUnsavedV54=true;if(typeof storageFailureV53==='function')storageFailureV53();}
}
function exportProgressV54(){return JSON.parse(JSON.stringify(syncProgressV54()));}
function sanitizeProgressV54(value,pool=e){return normalizeProgressV54(value,pool);}
function mergeProgressV54(current,incoming,pool=e){
  const a=normalizeProgressV54(current,pool),b=normalizeProgressV54(incoming,pool);
  const previews=[];
  for(const row of [...b.previews,...a.previews]){
    const previous=previews.find(item=>lineupKeyV54(item.ids)===lineupKeyV54(row.ids));
    if(previous)previous.candidates=[...new Set([...previous.candidates,...row.candidates])].slice(0,2);
    else if(previews.length<5)previews.push({ids:row.ids.slice(),candidates:row.candidates.slice()});
  }
  return {version:1,unlocked:[...new Set([...a.unlocked,...b.unlocked])],dimensions:[...new Set([...a.dimensions,...b.dimensions])],
    starter:a.starter?.claimedId?a.starter:b.starter?.claimedId?b.starter:a.starter||b.starter,previews};
}
function importProgressV54(value){progressV54=normalizeProgressV54(value);saveProgressV54();return exportProgressV54();}
function lineupKeyV54(ids){return ids.slice().sort().join('.');}
function starterChoicesV54(cards,ownedIds,pool){
  const current=cards.find(card=>card.dimension==='风格体系');
  const preferred=['style-v21-epistolary','xstyle-soundth','ystyle-object','style-v21-courtroom'];
  const owned=new Set(ownedIds),seen=new Set([shortScene(cards)]),chosen=[];
  const choices=pool.filter(card=>card.dimension===current.dimension&&card.id!==current.id);
  choices.sort((a,b)=>Number(owned.has(a.id))-Number(owned.has(b.id))||
    (preferred.includes(a.id)?preferred.indexOf(a.id):preferred.length)-(preferred.includes(b.id)?preferred.indexOf(b.id):preferred.length));
  for(const candidate of choices){
    const story=shortScene(cards.map(card=>card.dimension===current.dimension?candidate:card));
    if(seen.has(story))continue;
    seen.add(story);chosen.push(candidate.id);
    if(chosen.length===2)break;
  }
  return chosen;
}
// Called only when a player completes their own pack, never when loading a share URL.
function recordOwnProgramV54(cards,pool=activeCards,ownedIds=Y.owned){
  if(cards.length!==6)return;
  syncProgressV54();
  if(!progressV54.unlocked.includes('opening')){
    progressV54.unlocked.push('opening');
    const candidates=starterChoicesV54(cards,ownedIds,pool);
    if(candidates.length===2)progressV54.starter={ids:cards.map(card=>card.id),candidates,claimedId:null};
    saveProgressV54();
  }
}
function starterMatchesV54(cards,rehearsal){
  const starter=progressV54.starter;
  return !!starter&&lineupKeyV54(rehearsal?.originalIds||cards.map(card=>card.id))===lineupKeyV54(starter.ids);
}
function starterCandidateIdsV54(cards,rehearsal){
  return starterMatchesV54(cards,rehearsal)&&!progressV54.starter.claimedId?progressV54.starter.candidates:[];
}
function starterSpentV54(cards,rehearsal){
  const starter=progressV54.starter;
  if(!starter?.claimedId)return false;
  if(starterMatchesV54(cards,rehearsal))return true;
  const chosen=e.find(card=>card.id===starter.claimedId);
  const result=starter.ids.map(id=>e.find(card=>card.id===id).dimension===chosen.dimension?chosen.id:id);
  return lineupKeyV54(cards.map(card=>card.id))===lineupKeyV54(result);
}
function recordPreviewV54(cards,rehearsal,candidateId){
  syncProgressV54();
  if(progressV54.unlocked.includes('compare'))return;
  const ids=rehearsal?.originalIds||cards.map(card=>card.id),key=lineupKeyV54(ids);
  const previous=progressV54.previews.find(row=>lineupKeyV54(row.ids)===key);
  const candidates=[candidateId,...(previous?.candidates||[]).filter(id=>id!==candidateId)].slice(0,2);
  progressV54.previews=[{ids:ids.slice(),candidates},...progressV54.previews.filter(row=>lineupKeyV54(row.ids)!==key)].slice(0,5);
  saveProgressV54();
}
function recordRewriteV54(beforeCards,result){
  syncProgressV54();
  if(starterSpentV54(beforeCards,result.rehearsal))return null;
  const earned=[],unlock=id=>{if(!progressV54.unlocked.includes(id)){progressV54.unlocked.push(id);earned.push(id);}};
  const key=lineupKeyV54(result.rehearsal.originalIds);
  const viewed=progressV54.previews.find(row=>lineupKeyV54(row.ids)===key)?.candidates||[];
  unlock('rewrite');
  if(viewed.length===2&&viewed.includes(result.change.toId))unlock('compare');
  if(['风格体系','导演手法'].includes(result.change.dimension)&&stagePersonaV53(beforeCards).number!==stagePersonaV53(result.drawn).number)unlock('persona');
  if(!progressV54.dimensions.includes(result.change.dimension))progressV54.dimensions.push(result.change.dimension);
  const dims=progressV54.dimensions;
  if(dims.length>=3&&dims.some(dim=>['主演','配角','环境'].includes(dim))&&dims.some(dim=>['风格体系','导演手法'].includes(dim)))unlock('perspectives');
  if(result.after.bondDetails.some(bond=>bond.id!=='style-method'&&!result.before.bondDetails.some(old=>old.id===bond.id)))unlock('reunion');
  if(dims.length===6&&['compare','persona','reunion'].every(id=>progressV54.unlocked.includes(id)))unlock('weaver');
  if(starterMatchesV54(beforeCards,result.rehearsal)&&!progressV54.starter.claimedId)progressV54.starter.claimedId=result.change.toId;
  progressV54.previews=progressV54.previews.filter(row=>lineupKeyV54(row.ids)!==key);
  saveProgressV54();
  return earned.map(id=>achievementListV54.find(row=>row[0]===id)[1]);
}
function renderAchievementsV54(){
  syncProgressV54();
  return `<section class="achievements-v54" aria-label="称号印记"><h2>我的称号印记 <small>${progressV54.unlocked.length} / 7</small></h2><p>把不同选择留成印记。只作纪念，不改变分数或抽卡概率。</p><details><summary>查看七枚印记与达成方式</summary><ol>${achievementListV54.map(([id,name,rule])=>`<li class="${progressV54.unlocked.includes(id)?'is-earned':''}"><strong>${progressV54.unlocked.includes(id)?'✦':'◇'} ${K(name)}</strong><span>${K(rule)}</span><small>${progressV54.unlocked.includes(id)?'已获得':'尚未获得'}</small></li>`).join('')}</ol><p>后几枚需要更多候选与不同维度的尝试，不要求高星、升分、签到或转发。</p></details>${progressV54.unlocked.length?`<div class="achievement-seals-v54" aria-label="已获得印记">${achievementListV54.filter(row=>progressV54.unlocked.includes(row[0])).map(row=>`<span>${K(row[1])}</span>`).join('')}</div>`:''}</section>`;
}
