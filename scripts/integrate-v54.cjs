// Embed the edited modules into the standalone release; old archives stay untouched.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),file=path.join(root,'index.html');
let html=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const source=name=>fs.readFileSync(path.join(__dirname,name),'utf8').replace(/\r\n/g,'\n').trim();
function region(start,end,content){
 const a=html.indexOf(start),b=html.indexOf(end,a+start.length);
 if(a<0||b<0)throw Error('Missing region '+start);
 html=html.slice(0,a)+start+'\n'+content+'\n'+html.slice(b);
}
function replace(old,value){
 if(value.length>=old.length&&html.includes(value))return;
 if(html.includes(old)){html=html.replace(old,value);return;}
 if(value===''||html.includes(value))return;
 throw Error('Missing hook: '+old.slice(0,100));
}
function func(start,end,value){
 const a=html.lastIndexOf(start),b=html.indexOf(end,a+start.length);
 if(a<0||b<0)throw Error('Missing function '+start);
 html=html.slice(0,a)+value+html.slice(b);
}
function addedRegion(marker,content,anchor){
 const start='// '+marker+'_START',end='// '+marker+'_END';
 if(html.includes(start))region(start,end,content);
 else replace(anchor,start+'\n'+content+'\n'+end+'\n'+anchor);
}
for(const [tag,name] of [['GAMEPLAY_V53','gameplay-v53.js'],['RELIABILITY_V53','reliability-v53.js'],['SHARE_V53','share-v53.js'],['POSTER_V48','poster-v48.js']])region('// '+tag+'_START','// '+tag+'_END',source(name));
region('// SHARE_V53_START','// SHARE_V53_END',source('vendor/qrcode-generator.js')+'\n'+source('share-v53.js'));
region('// V39_COPY_START','// V39_COPY_END',source('copy-overrides-v39.js')+'\n'+source('talk-v39.js')+'\napplyCopyOverridesV39(e,cardEssays);');
region('/* SHARE_V53_CSS_START */','/* SHARE_V53_CSS_END */',source('share-v53.css'));
const motion=source('production-motion-v40.js');
func('function showProductionCueV40(', 'function finishProductionV40(', motion.slice(motion.indexOf('function showProductionCueV40('),motion.indexOf('function finishProductionV40(')));
const head=source('figure-head-v49.js');
func('function figFace(face){','function figProp(',head.slice(head.indexOf('function figFace(face){'))+'\n');
const playerCss=source('player-v54.css')+'\n'+source('gameplay-v54.css');
if(html.includes('/* PLAYER_V54_CSS_START */'))region('/* PLAYER_V54_CSS_START */','/* PLAYER_V54_CSS_END */',playerCss);
else replace('</style>','/* PLAYER_V54_CSS_START */\n'+playerCss+'\n/* PLAYER_V54_CSS_END */\n</style>');
addedRegion('PLAYER_V54',source('collection-v54.js')+'\n'+source('v54-achievements.js')+'\n'+source('save-v54.js'),'var Xn=`diamasha.owned`');
func('function $n(){','function er(', 'function $n(){return new Set(collectionV54.owned)}');
func('function er(id){','var Y=', 'function er(id){grantCollectionV54(id)}');
func('function rr(','function ir(', 'function rr(ids){return "https://canoeliu917.github.io/DiaGacha/releases/v54/index.html#m="+ids}');
replace('t.forEach(card=>er(card.id)),O(Y.task)','settleDrawV54(t),O(Y.task)');
replace('t.forEach(card=>er(card.id)),Le(Y.task)','settleDrawV54(t),Le(Y.task)');
replace('Y.drawn[Y.index]=n,er(n.id),tr=!0','Y.drawn[Y.index]=n,settleDrawV54([n]),tr=!0');
replace('function xr(){lastSharePoster=null;','function xr(){recordOwnProgramV54(Y.drawn);lastSharePoster=null;');
replace('history.pushState({lineup:e},``,`#m=${e}`)','history.pushState({lineup:e},``,programLocationV54(e))');
replace('if(handleRehearsalV53(n,t))return;','if(handleCollectionV54(n)||handleSaveV54(n)||handleRehearsalV53(n,t))return;');
if(!html.includes('if(n===`rewrite-jump`)'))replace('if(n===`resume-pack`)','if(n===`rewrite-jump`){document.querySelector(".rewrite-panel")?.scrollIntoView({behavior:J?"instant":"smooth",block:"start"});return;}if(n===`resume-pack`)');
replace('document.querySelector(".rewrite-panel")?.scrollIntoView({behavior:J?"instant":"smooth",block:"start"});','const panel=document.querySelector(".rewrite-panel");if(panel){panel.tabIndex=-1;panel.focus({preventScroll:true});panel.scrollIntoView({behavior:J?"instant":"smooth",block:"start"});}');
replace('e.sheet.kind===`packs`?packsSheet(e):','e.sheet.kind===`packs`?packsSheet(e):e.sheet.kind===`duplicates`?duplicatesSheetV54():e.sheet.kind===`storage`?storageSheetV54():');
replace('e.sheet.kind===`storage`?storageSheetV54():','e.sheet.kind===`storage`?storageSheetV54():e.sheet.kind===`feedback`?feedbackSheetV54():');
replace('Y.sheet?.kind===`packs`&&(n={kind:`packs`})','Y.sheet?.kind===`packs`&&(n={kind:`packs`}),Y.sheet?.kind===`duplicates`&&(n={kind:`duplicates`}),Y.sheet?.kind===`storage`&&(n={kind:`storage`})');
replace('Y.sheet?.kind===`storage`&&(n={kind:`storage`})','Y.sheet?.kind===`storage`&&(n={kind:`storage`}),Y.sheet?.kind===`feedback`&&(n={kind:`feedback`})');
if(!html.includes('class="player-tools-v54"'))replace('${renderResumeV53()}','${renderResumeV53()}\n        <div class="player-tools-v54">${duplicateEntryV54()}<button type="button" class="btn ghost" data-action="storage">我的存档</button></div>\n        ${renderAchievementsV54()}');
replace('${renderRehearsalV53(e)}','${renderRehearsalV53(e)}${e.fromShare?"":renderAchievementsV54()}');
replace('<button type="button" class="btn ghost" data-action="storage">我的存档</button>','<button type="button" class="btn ghost" data-action="storage">我的存档</button><button type="button" class="btn ghost" data-action="feedback">问题反馈</button>');
replace('<p class="dim-lead">这一次开出 ${K(t.length)} 张，都已收进图鉴。</p>','<p class="dim-lead">这一次开出 ${K(t.length)} 张，都已收进图鉴。</p>${duplicateReceiptV54(t)}');
replace('<div class="pack-spread">','${duplicateReceiptV54(t.cards||[])}<div class="pack-spread">');
replace('点选评语，看看是哪几张卡在呼应。','点选评语，查看已计入卡组分的同星与羁绊奖励。');
replace('<span>这台</span><strong>${K(n)}</strong>','<span>卡组分</span><strong>${K(n)}</strong>');
replace('aria-label="这台最终得分 ${K(n)}，满分 100"','aria-label="卡组搭配分 ${K(n)}，满分 100"');
replace('${stagePersonaMarkupV53(t)}\n        <div class="cast-row','<div class="cast-row');
replace('${An(t,e.talkOpen)}','${e.fromShare||e.rehearsal?.change||e.rehearsal?.locked?"":`<button type="button" class="btn ghost" data-action="rewrite-jump">换一张，比较另一种故事</button>`}\n        ${An(t,e.talkOpen)}\n        ${stagePersonaMarkupV53(t)}');
// Sharing is voluntary. Legacy saved share/copy flags never grant rewards.
replace('Ae=[{id:`share`,name:`分享这个网站`,detail:`点一次「已分享」。`,reward:1},{id:`copy`,name:`复制一条节目单`,detail:`复制分享链接，或点「已复制」。`,reward:1},','Ae=[');
replace('首页「开抽！！」开满 3 次。','首页「开一台好戏」开满 3 次。');
replace('拼成一台并读完咫言咫语','生成第一份节目单');
replace('六维收齐，看到咫言咫语。','完成综合包并打开自己的节目单。');
replace('text:t.lineup?`已读完`:`还没读`','text:t.lineup?`已生成`:`还未生成`');
replace('咫言咫语读完了，去任务里领一次单维包','第一份节目单已生成，可去任务领取一次单维包');
func('function Cr(isText=false){','function wr(', 'function Cr(isText=false){Q(isText?`文案已复制`:`链接已复制`)}');
replace('else if(n===`did-share`)Fe(Y.task),O(Y.task),br(`share`)||Q(Y.task.claimed.share?`这个任务领过了`:`还不能领`),Z({preserveScroll:!0});else if(n===`did-copy`)Ie(Y.task),O(Y.task),br(`copy`)||Q(Y.task.claimed.copy?`这个任务领过了`:`还不能领`),Z({preserveScroll:!0});','');
// This UI is intentionally action-led; the six-axis score remains an optional explanation.
html=html.replaceAll('揭晓本场戏格','打开这场故事');
replace('抽一台戏，认领今晚的戏格。<br>从收藏里换一张，看看故事怎么变。','抽六张卡，遇见一场意外。<br>亲手换一张，让故事往另一个方向走。');
replace('<ol><li>开一包，集齐剧本、演法、手段、主角、配角、空间，排成一台戏。</li>','<ol><li>开一包，六张卡组成一个跨作品的虚构故事。</li><li>预览候选卡，看看人物、转折和结局怎么变，再决定换哪一张；每场可确认一次。</li>');
replace('整场表现由六张卡共同决定，加上组队奖励，最高 100 分。','卡组分由六张卡共同决定，加上组队奖励，最高 100 分；它不评判故事好坏或玩家能力。');
replace('收藏和保底保存在当前浏览器；旧五卡分享也能继续看。','收藏和保底保存在当前浏览器，可在「我的存档」导出备份；旧五卡分享也能继续看。每张重复卡补偿一次全卡池单抽，不要求分享。');
fs.writeFileSync(file,html,'utf8');
if(process.argv.includes('--archive')){
 const archive=path.join(root,'releases/v54/index.html');
 if(fs.existsSync(archive)&&fs.readFileSync(archive,'utf8')!==html)throw Error('v54 archive already exists with different content; create a new version instead of changing shared stories.');
 fs.mkdirSync(path.dirname(archive),{recursive:true});fs.writeFileSync(archive,html,'utf8');
}
console.log('Embedded v54 modules'+(process.argv.includes('--archive')?' and archive':''));
