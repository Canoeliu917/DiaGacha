const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {collisionDetailsV55,data}=require('./collisions-v55.js');
const root=path.resolve(__dirname,'..'),cards=Object.values(data.facts);
const originalPoints={'剧目|主演':3,'剧目|配角':2,'剧目|环境':1,'主演|配角':1};
const csv=values=>values.map(value=>'"'+String(value??'').replaceAll('"','""')+'"').join(',')+'\r\n';
const file=path.join(root,'docs/COLLISION_INDEX_V55.csv'),fd=fs.openSync(file,'w');
fs.writeSync(fd,'\uFEFF'+csv(['pair_id','card_a_id','card_a_name','dimension_a','card_b_id','card_b_name','dimension_b','level','rule_ids','shared_work_ids','original_bonus','creative_bonus','source_refs']));
const counts={},dimensionPairs={},coverage=Object.fromEntries(cards.map(card=>[card.id,{candidatePairs:0,rewardedPairs:0}]));
let rows=0,buffer='';
for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++){
  if(cards[i].dimension===cards[j].dimension)continue;
  const pair=[cards[i],cards[j]].sort((a,b)=>data.dimensions.indexOf(a.dimension)-data.dimensions.indexOf(b.dimension)),[a,b]=pair;
  const type=pair.map(card=>card.dimension).join('|'),works=a.workIds.filter(id=>b.workIds.includes(id));
  const original=works.length?(originalPoints[type]||0):0,item=collisionDetailsV55(pair)[0];
  const level=original?'original-work':item.level==='generated-learning'?'exploration':item.level;
  const rules=[...(original?['original:'+type]:[]),...(item.level==='generated-learning'?[]:[item.ruleId||item.id])];
  buffer+=csv([[a.id,b.id].sort().join('|'),a.id,a.name,a.dimension,b.id,b.name,b.dimension,level,rules.join(';'),works.join(';'),original,item.bonus,item.sourceRefs.map(ref=>ref.id).join(';')]);
  counts[level]=(counts[level]||0)+1;dimensionPairs[type]=(dimensionPairs[type]||0)+1;rows++;
  for(const card of pair){coverage[card.id].candidatePairs++;if(original+item.bonus>0)coverage[card.id].rewardedPairs++;}
  if(rows%2000===0){fs.writeSync(fd,buffer);buffer='';}
}
fs.writeSync(fd,buffer);fs.closeSync(fd);
if(rows!==103650||Object.keys(dimensionPairs).length!==15||Object.values(coverage).some(row=>!row.candidatePairs))throw Error('Cross-dimension coverage incomplete');
const evolutions=data.rules.filter(row=>row.level==='evolution');
fs.writeFileSync(path.join(root,'docs/COLLISION_EVOLUTIONS_V55.csv'),'\uFEFF'+csv(['rule_id','card_ids','title','bonus','absorbs_pair_rule_ids','source_refs'])+evolutions.map(row=>csv([row.id,row.cardIds.join(';'),row.title,row.bonus,row.replaces.join(';'),row.sourceRefs.join(';')])).join(''));
const report={version:55,activeCards:cards.length,crossDimensionPairs:rows,dimensionPairs,levels:counts,curatedPairs:data.rules.filter(row=>row.cardIds.length===2).length,curatedFamilies:data.families.length,evolutions:evolutions.length,
  boundary:data.sourceBoundary,coverage,allCardsHaveLearning:Object.values(data.facts).every(row=>row.action&&row.constraint&&row.learning&&row.sourceRefs.length),
  csv:{path:'docs/COLLISION_INDEX_V55.csv',bytes:fs.statSync(file).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')},
  reviewScope:'精确精选逐条编辑；人工规则生成的卡对未逐对审读；exploration为不加分的学习比较。原作只按4类共同作品关系加分；v55不再采用旧Wt体系交集。'};
fs.writeFileSync(path.join(root,'docs/COLLISION_REPORT_V55.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({pairs:rows,levels:counts,dimensions:Object.keys(dimensionPairs).length,cardsWithLearning:500,cardsWithAnyReward:Object.values(coverage).filter(row=>row.rewardedPairs).length,csvBytes:report.csv.bytes}));
