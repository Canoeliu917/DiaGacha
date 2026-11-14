const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const talk=require('./talk-v39.js');
const source=fs.readFileSync(path.join(__dirname,'talk-v39.js'),'utf8');
const entries=require('./story-titles-v55.json');
const api=vm.runInNewContext(source+';({sceneContextV40,characterStrategyV54,storyTitleCandidatesV55,storyTitlesV52})');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const cards=JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
require('./copy-overrides-v39.js').applyCopyOverridesV39(cards,{});
const activeIds=new Set(JSON.parse(fs.readFileSync(path.join(root,'docs/ACTIVE_CARDS_V39.json'),'utf8')).activeIds);
const dims=['剧目','风格体系','导演手法','主演','配角','环境'];
const pools=dims.map(dim=>cards.filter(c=>c.dimension===dim&&activeIds.has(c.id)));
const base=pools.map(pool=>pool[0]);
const plays={money:'play-sunrise',secret:'play-doue',choice:'play-palace',shelter:'play-peach',identity:'play-secret',waiting:'play-sisters',warren:'yplay-mrswarren',solo:'play-godot'};
const labels={truth:'区分已知与猜测',autonomy:'各自保留决定权',aid:'先给对方实际便利',control:'确认保管与处置权限',memory:'将往事与今天分开',privacy:'保留不愿公开的私事',principle:'同一标准约束双方',grievance:'旧责不能被当前交易抵消',loyalty:'来往不能以接受条件交换',hope:'区分期待与已获答复',recognition:'要求具体的评价理由',care:'为照料他人留出时间',livelihood:'保留生活与休息所需',urgency:'当场处理不能再拖的一项'};
const witnesses=entries.map((entry,index)=>{
  const play=cards.find(c=>c.id===(plays[entry.branch]||entry.branch));
  const actorDimension=entry.actor==='lead'?'主演':'配角';
  const actor=cards.find(c=>activeIds.has(c.id)&&c.dimension===actorDimension&&api.characterStrategyV54(c).key===entry.strategy);
  if(!actor)throw Error('No active actor for '+entry.strategy);
  let drawn=base.map(c=>c.dimension==='剧目'?play:c.dimension===actorDimension?actor:c);
  if(entry.branch==='solo')drawn=drawn.filter(c=>c.dimension!=='配角');
  let found;
  for(const method of pools[2]){
    const sample=drawn.map(c=>c.dimension==='导演手法'?method:c);
    if(talk.dramaticTitleV55(sample).split('｜').at(-1)===entry.title){found=sample;break;}
  }
  if(!found)throw Error('Unreachable title: '+entry.title);
  if(found.some(card=>!activeIds.has(card.id)))throw Error('Inactive witness: '+entry.title);
  if(!talk.nn(found).join('').includes(entry.anchor))throw Error('Missing story anchor: '+entry.title);
  return {id:index+1,...entry,condition:`${entry.actor==='lead'?'主演':'配角'}的行动取向为「${labels[entry.strategy]}」`,exampleActor:actor.name,exampleIds:found.map(c=>c.id),actualTitle:talk.dramaticTitleV55(found)};
});
let seed=0x55d1a;
const random=size=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return Math.floor(seed/4294967296*size);};
const oldCores=new Set(),newCores=new Set(),selectedNew=new Set();
let matched=0;
for(let i=0;i<5000;i++){
  const drawn=pools.map(pool=>pool[random(pool.length)]);
  oldCores.add(talk.dramaticTitleV40(drawn).split('｜').at(-1));
  const title=talk.dramaticTitleV55(drawn).split('｜').at(-1);newCores.add(title);
  if(api.storyTitleCandidatesV55(api.sceneContextV40(drawn)).length){matched++;selectedNew.add(title);}
}
const oldTitles=Object.values(api.storyTitlesV52).flat();
const report={sampleSeed:'0x55d1a',sampleKind:'5000组常驻卡按维均匀抽样；不等同线上加权概率',sampleCount:5000,oldCatalog:oldTitles.length,oldConditionalCharacterTitles:0,newCatalog:entries.length,newUniqueCores:new Set(entries.map(e=>e.title)).size,newOverlapOld:entries.filter(e=>oldTitles.includes(e.title)).length,oldObservedCoreTitles:oldCores.size,v55ObservedCoreTitles:newCores.size,newConditionMatches:matched,newObservedCoreTitles:selectedNew.size,individuallyReachable:witnesses.length,witnesses};
fs.writeFileSync(path.join(root,'docs/STORY_TITLE_COVERAGE_V55.json'),JSON.stringify(report,null,2)+'\n');
const rows=witnesses.map(w=>`| ${w.id} | ${w.title} | ${w.branch} | ${w.condition} | ${w.exampleActor} | ${w.anchor} |`);
const intro=`# v55 主标题目录\n\n新增 **${entries.length} 条完整主标题**，去掉地点前缀后仍为 ${report.newUniqueCores} 条；与 v54 旧 224 条字面重合 ${report.newOverlapOld} 条。每条先匹配当前故事分支和指定人物的显式行动取向，再按完整卡组确定性选取。名称、稀有度、分数不用于假造人物个性。\n\nv54 的 dramaticTitleV40 和 224 条标题保留原行为；v55 使用独立 dramaticTitleV55。未命中新条件时，仍从当前剧情分支的旧标题中选择，并避开群体、静默或行动受限人物不适用的字眼。\n\n现有标题的优点是大多有具体情节锚点；弱点是人物不参与适配，只有卡 ID 影响散列选取。新标题每条均已找到一组实际可选中的常驻卡，并检查正文含所列锚点。原卡角色来源与跨作品虚构声明保持不变。\n\n按维均匀抽样 5000 组（种子 0x55d1a），旧版观察到 ${report.oldObservedCoreTitles} 个去地点主标题；v55 观察到 ${report.v55ObservedCoreTitles} 个，其中 ${report.newObservedCoreTitles} 个为新主标题，${report.newConditionMatches} 组命中新人物条件。全部 ${report.individuallyReachable} 条新标题通过定向卡组实际选择验证。此抽样不代表线上加权分布，也不表示每次只换一张卡都必然改名。\n\n完整卡组 ID 与统计见 [STORY_TITLE_COVERAGE_V55.json](STORY_TITLE_COVERAGE_V55.json)；可执行 \`node scripts/audit-story-titles-v55.cjs\` 重建。下表“人物条件”对应本局实际动作，不能仅按人物姓名替换套用。\n\n| # | 主标题（不含地点） | 当前故事分支 | 人物条件 | 可达样例人物 | 正文锚点 |\n| --- | --- | --- | --- | --- | --- |\n`;
fs.writeFileSync(path.join(root,'docs/STORY_TITLES_V55.md'),intro+rows.join('\n')+'\n');
console.log(JSON.stringify({...report,witnesses:undefined},null,2));
