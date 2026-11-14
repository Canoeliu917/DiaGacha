const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const cards=JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
require('./copy-overrides-v39.js').applyCopyOverridesV39(cards,{});
const active=new Set(read('docs/ACTIVE_CARDS_V39.json').activeIds);
const curated=read('scripts/collision-curated-v55.json');
const reviews=['PLAYS','CRAFT','ROLES','SPACES'].flatMap(kind=>read(`docs/FACT_AUDIT_${kind}_V49.json`).reviews);
const sources={},sourceByUrl=new Map();
for(const [id,source] of Object.entries(curated.verifiedSources)){
  sources[id]={id,...source,provenance:'primary-checked-v55'};sourceByUrl.set(source.url,id);
}
const prior=[...new Map(reviews.flatMap(row=>row.sources||[]).filter(row=>row.url).map(row=>[row.url,row])).values()].sort((a,b)=>a.url.localeCompare(b.url,'en'));
for(const source of prior){
  if(sourceByUrl.has(source.url))continue;
  const id='V49_'+String(sourceByUrl.size+1).padStart(3,'0');
  sources[id]={id,title:source.title,url:source.url,provenance:'existing-card-audit-v49'};sourceByUrl.set(source.url,id);
}
const facts=Object.fromEntries(cards.filter(card=>active.has(card.id)).map(card=>{
  const review=reviews.find(row=>row.id===card.id);
  if(!card.note||!card.action||!review?.sources?.length)throw Error(`Missing card evidence: ${card.id}`);
  const learning={剧目:'比较同一冲突如何被不同人物、演法与空间改变；改编设想不冒充原剧情节。',风格体系:'比较呈现方式与具体行动；同一手段可以被不同演法使用。',导演手法:'检查这项手段改变了什么信息、关系或选择，而不是只让画面热闹。',主演:'先保留人物的目标、身体条件与原作身份，再设计跨作品的相遇。',配角:'明确自己的目标以及如何改变对方选择，不把配角只当作解释剧情的人。',环境:'明确通路、距离、视线、声响与资源，比较它们怎样限制行动。'}[card.dimension];
  const constraint=card.dimension==='环境'?card.note:['主演','配角'].includes(card.dimension)?'不得因跨卡创作取消卡面已明确的身份、发声、视力或行动条件。':'先确认执行卡面行动所需的人物、物件与空间条件；组合联想不自动成为原作事实。';
  return [card.id,{id:card.id,name:card.name,dimension:card.dimension,note:card.note,action:card.action,constraint,learning,
    workIds:card.workIds||[],sourceRefs:[...new Set(review.sources.map(source=>sourceByUrl.get(source.url)).filter(Boolean))]}];
}));
const familiesFile=path.join(__dirname,'collision-families-v55.json');
const families=fs.existsSync(familiesFile)?read('scripts/collision-families-v55.json').rules:[];
const data={version:55,sourceBoundary:curated.sourceBoundary,dimensions:['剧目','风格体系','导演手法','主演','配角','环境'],facts,sources,
  rules:curated.rules.map(row=>({level:'curated',...row})),families};
fs.writeFileSync(path.join(__dirname,'collision-data-v55.json'),JSON.stringify(data));
console.log(JSON.stringify({cards:Object.keys(facts).length,sources:Object.keys(sources).length,curated:data.rules.length,families:families.length}));
