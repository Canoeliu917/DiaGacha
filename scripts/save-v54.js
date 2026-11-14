let pendingSaveV54=null;
function feedbackSheetV54(){
  return `<h2 id="sheet-title">告诉我们哪里不对</h2><p>如果故事有矛盾、卡面看不清或按钮没反应，请保留截图，把下面的信息交给邀请你试玩的朋友。</p><p>可以直接说：我点了什么、原本期待什么、实际发生了什么。普通朋友的感受和戏剧资料的纠错都欢迎。</p><button type="button" class="btn primary" data-action="feedback-copy">复制本场与设备信息</button><p class="save-note-v54">只复制游戏版本、当前卡组链接和浏览器信息，不会发送消息或复制你的私人收藏。</p><button type="button" class="btn ghost" data-action="close-sheet">收回</button>`;
}
function saveIntegerV54(value,max=10000000){
  if(!Number.isSafeInteger(value)||value<0||value>max)throw Error('存档计数无效');
  return value;
}
function cleanTaskSaveV54(raw){
  if(!raw||typeof raw!=='object')throw Error('任务存档不完整');
  return {charges:saveIntegerV54(raw.charges),mix:saveIntegerV54(raw.mix),lineup:!!raw.lineup,share:false,copy:false,claimed:Object.fromEntries(['mix3','own8','lineup'].filter(id=>raw.claimed?.[id]===true).map(id=>[id,true]))};
}
function cleanLoopSaveV54(raw){
  if(!raw||typeof raw!=='object')throw Error('开包进度不完整');
  const dailyDate=String(raw.dailyDate||'');
  if(dailyDate&&!/^\d{4}-\d{2}-\d{2}$/.test(dailyDate))throw Error('赠礼日期无效');
  const pendingDim=x.some(dim=>dim.key===raw.pendingDim)?raw.pendingDim:'';
  return {pitySSR:saveIntegerV54(raw.pitySSR,60),pityUR:saveIntegerV54(raw.pityUR,60),dailyDate,dailyClaimed:!!raw.dailyClaimed,blessedNext:!!raw.blessedNext,pendingDim,milestones:Object.fromEntries([100,300,500].filter(n=>raw.milestones?.[n]===true).map(n=>[n,true])),cosmetics:Array.isArray(raw.cosmetics)?raw.cosmetics.filter(n=>typeof n==='string'&&n.length<40).slice(0,10):[],pendingMilestone:[100,300,500].includes(raw.pendingMilestone)?raw.pendingMilestone:0};
}
function cleanSessionSaveV54(raw){
  const recent=Array.isArray(raw?.recent)?raw.recent.slice(0,5).map(row=>{
    const cards=re(e,row.ids);if(!cards)throw Error('节目单卡组不完整');
    return {ids:cards.map(card=>card.id),rehearsal:savedRehearsalV53(row.rehearsal,cards),fromShare:!!row.fromShare};
  }):[];
  return {draft:null,recent};
}
function validateSaveV54(raw){
  if(raw?.format!=='diagacha-save'||raw.version!==1)throw Error('请选择咫牌 v54 导出的 JSON 存档');
  if(!raw.progress||raw.progress.version!==1)throw Error('成就存档版本不正确');
  return {format:'diagacha-save',version:1,collection:cleanCollectionV54(raw.collection,e),progress:sanitizeProgressV54(raw.progress),task:cleanTaskSaveV54(raw.task),loop:cleanLoopSaveV54(raw.loop),session:cleanSessionSaveV54(raw.session)};
}
function exportSaveV54(){
  saveSessionV53();
  if(!storageFailedV53)collectionV54=readCollectionV54();
  const data={format:'diagacha-save',version:1,createdAt:new Date().toISOString(),collection:collectionV54,progress:exportProgressV54(),task:storageFailedV53?Y.task:Me(),loop:storageFailedV53?currentLoop():loadLoop(),session:sessionV53};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download='咫牌存档-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  Q('存档已生成；若微信未下载，可在浏览器中打开后导出。');
}
function storageSheetV54(){
  return `<h2 id="sheet-title">我的存档</h2><p>收藏与成就保存在当前浏览器。换设备、清理浏览器数据或换网址后，不会自动同步。</p><p class="save-note-v54">导出包含收藏、成就、补抽次数、任务、保底与最近节目单。未完成的翻牌不会恢复，请先完成这一包。分享链接只保存那场戏，不能代替私人存档。</p><div class="dock"><button type="button" class="btn primary" data-action="save-export">导出 JSON 存档</button><button type="button" class="btn ghost" data-action="save-select">选择存档文件</button></div>${pendingSaveV54?`<div class="save-preview-v54"><h3>导入预览</h3><p>${pendingSaveV54.collection.owned.length} 张收藏 · ${pendingSaveV54.collection.credits} 次补抽</p><p>确认后替换本机当前进度，不会因导入卡牌额外发放奖励。建议先导出当前存档。</p><button type="button" class="btn primary" data-action="save-confirm">确认替换本机存档</button><button type="button" class="btn ghost" data-action="save-cancel">取消</button></div>`:''}<button type="button" class="btn ghost" data-action="close-sheet">收回</button>`;
}
async function chooseSaveV54(){
  const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
  input.onchange=async()=>{
    try{const file=input.files?.[0];if(!file)return;if(file.size>2000000)throw Error('文件过大，请选择导出的咫牌存档');pendingSaveV54=validateSaveV54(JSON.parse(await file.text()));Y.sheet={kind:'storage'};Z({preserveScroll:true});}
    catch(error){pendingSaveV54=null;Q(error instanceof SyntaxError?'这不是有效的 JSON 存档':error.message);}
  };
  input.click();
}
function commitSaveV54(data){
  // Validate everything before writing; an invalid file cannot partially replace progress.
  const saved=validateSaveV54(data),writes={
    [collectionKeyV54]:JSON.stringify(saved.collection),'diamasha.owned':JSON.stringify(saved.collection.owned),
    'diamasha.progress.v54':JSON.stringify(saved.progress),[ke]:JSON.stringify(saved.task),
    [LOOP_KEY]:JSON.stringify(saved.loop),[sessionKeyV53]:JSON.stringify(saved.session)
  },previous=Object.fromEntries(Object.keys(writes).map(key=>[key,localStorage.getItem(key)]));
  try{for(const [key,value] of Object.entries(writes))localStorage.setItem(key,value);}
  catch(error){for(const [key,value] of Object.entries(previous)){try{value===null?localStorage.removeItem(key):localStorage.setItem(key,value);}catch{}}throw Error('浏览器未能保存，导入没有完成；请保留存档文件。');}
  return saved;
}
function handleSaveV54(action){
  if(action==='feedback'){Y.sheet={kind:'feedback'};Z({preserveScroll:true});}
  else if(action==='feedback-copy'){Sr(`咫牌 v54 试玩反馈\n本场：${Y.view==='result'?shareUrlV53(Y.drawn):'首页或开包流程'}\n浏览器：${navigator.userAgent}\n我遇到的问题：`);}
  else if(action==='storage'){pendingSaveV54=null;Y.sheet={kind:'storage'};Z({preserveScroll:true});}
  else if(action==='save-export')exportSaveV54();
  else if(action==='save-select')chooseSaveV54();
  else if(action==='save-cancel'){pendingSaveV54=null;Z({preserveScroll:true});}
  else if(action==='save-confirm'&&pendingSaveV54){try{commitSaveV54(pendingSaveV54);location.replace(location.pathname);}catch(error){Q(error.message);}}
  else return false;
  return true;
}
if(typeof module!=='undefined'&&module.exports)module.exports={saveIntegerV54,cleanTaskSaveV54,cleanLoopSaveV54,validateSaveV54,commitSaveV54};
