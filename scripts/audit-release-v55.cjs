const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {loadRuntime,randomFromSeed}=require('./runtime-v55.cjs'),g=loadRuntime([]).runtime;
const seed=2026111501,rng=randomFromSeed(seed),count=30000;
g.Y.loop=g.emptyLoop();
let scoreSum=0,creative=0,evolutions=0,maximum=0,ledgerErrors=0;
const spaces=new Map(),ruleCounts={};
for(let i=0;i<count;i++){
 const cards=g.drawMixPack(g.activeCards,rng),result=g.productionScore(cards),cues=g.productionCuesV40(result,cards);
 scoreSum+=result.score;maximum=Math.max(maximum,result.score);
 if(result.bondDetails.some(row=>row.creative))creative++;
 if(result.collisions.some(row=>row.level==='evolution'))evolutions++;
 if(result.base+cues.reduce((sum,cue)=>sum+cue.points,0)!==result.score)ledgerErrors++;
 const space=cards.find(card=>card.dimension==='环境');spaces.set(space.id,(spaces.get(space.id)||0)+1);
 for(const row of result.bondDetails.filter(row=>row.creative))ruleCounts[row.id]=(ruleCounts[row.id]||0)+1;
}
const report={version:55,seed,count,sourceSHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../index.html'))).digest('hex'),method:'执行最终内嵌drawMixPack、productionScore、productionCuesV40；含保底，普通包，无赠礼，无代码替换',meanScore:scoreSum/count,maximum,creativePercent:creative/count*100,evolutionCount:evolutions,ledgerErrors,spacesObserved:spaces.size,ruleCounts};
fs.writeFileSync(path.join(__dirname,'../docs/validation/v55/integrated-simulation.json'),JSON.stringify(report,null,2));
if(ledgerErrors)throw Error('Score ledger mismatch');const {ruleCounts:counts,...summary}=report;console.log(JSON.stringify(summary));
