// v54 is an immutable shared-story release. Only the current page and v55 are written.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),file=path.join(root,'index.html');
let html=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const source=name=>fs.readFileSync(path.join(__dirname,name),'utf8').replace(/\r\n/g,'\n').trim();
function region(start,end,content){const a=html.indexOf(start),b=html.indexOf(end,a+start.length);if(a<0||b<0)throw Error('Missing '+start);html=html.slice(0,a)+start+'\n'+content+'\n'+html.slice(b);}
function func(start,end,content){const a=html.lastIndexOf(start),b=html.indexOf(end,a+start.length);if(a<0||b<0)throw Error('Missing '+start);html=html.slice(0,a)+content+'\n'+html.slice(b);}
function add(marker,content,anchor){const start='// '+marker+'_START',end='// '+marker+'_END';if(html.includes(start))region(start,end,content);else {if(!html.includes(anchor))throw Error('Missing '+anchor);html=html.replace(anchor,start+'\n'+content+'\n'+end+'\n'+anchor);}}
for(const [tag,name] of [['GAMEPLAY_V53','gameplay-v53.js'],['RELIABILITY_V53','reliability-v53.js'],['POSTER_V48','poster-v48.js']])region('// '+tag+'_START','// '+tag+'_END',source(name));
region('// SHARE_V53_START','// SHARE_V53_END',source('vendor/qrcode-generator.js')+'\n'+source('share-v53.js'));
region('// V39_COPY_START','// V39_COPY_END',source('copy-overrides-v39.js')+'\n'+source('talk-v39.js')+'\napplyCopyOverridesV39(e,cardEssays);');
region('// PLAYER_V54_START','// PLAYER_V54_END',source('collection-v54.js')+'\n'+source('v54-achievements.js')+'\n'+source('save-v54.js'));
const data=JSON.parse(source('collision-data-v55.json'));
add('COLLISIONS_V55','const collisionDataV55='+JSON.stringify(data)+';\n'+source('collisions-v55.js')+'\n'+source('collision-ui-v55.js')+'\n'+source('production-motion-v55.js')+'\n'+source('space-rates-v55.js')+'\ndramaticTitleV40=dramaticTitleV55;', 'var Xn=`diamasha.owned`');
func('function Un(','function Wn(',source('result-v55.js'));
const css=source('gameplay-v55.css')+'\n'+source('collision-v55.css');
if(html.includes('/* PLAYER_V55_CSS_START */'))region('/* PLAYER_V55_CSS_START */','/* PLAYER_V55_CSS_END */',css);
else html=html.replace('</style>','/* PLAYER_V55_CSS_START */\n'+css+'\n/* PLAYER_V55_CSS_END */\n</style>');
// Existing sharing APIs keep their names, while the newly emitted URLs pin v55.
html=html.replaceAll('releases/v54/index.html','releases/v55/index.html');
html=html.replace('预览候选卡，看看人物、转折和结局怎么变，再决定换哪一张；每场可确认一次。','在六张卡下面点「替换」，从自己的收藏换卡，故事和评分会一起更新；首场试选卡只领取一张。');
html=html.replace('同一原作的人物与空间、合拍的演法与手段，还能触发羁绊，最多 +8。','原作关系、演法手段与精选创意碰撞共用羁绊奖励，最多 +8；部分三卡组合还会生成新的舞台事件。');
html=html.replace("item.id === 'style-method' ? 'unity' : 'home'","item.id === 'style-method' ? 'unity' : item.creative ? 'collision' : 'home'");
fs.writeFileSync(file,html,'utf8');
if(process.argv.includes('--archive')){
  const archive=path.join(root,'releases/v55/index.html');
  if(fs.existsSync(archive)&&fs.readFileSync(archive,'utf8')!==html)throw Error('v55 already frozen; use a new release');
  fs.mkdirSync(path.dirname(archive),{recursive:true});fs.writeFileSync(archive,html,'utf8');
}
console.log('Embedded v55'+(process.argv.includes('--archive')?' and frozen archive':''));
