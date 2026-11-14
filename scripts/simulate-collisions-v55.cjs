const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {collisionDetailsV55}=require('./collisions-v55.js');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const startup='Zn.addEventListener(`click`,Tr),Er()';
if(html.split(startup).length!==2)throw Error('Unexpected app entry point');
const values=new Map(),storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
const context=vm.createContext({console,URL,URLSearchParams,Intl,Date,Math,navigator:{},localStorage:storage,sessionStorage:storage,
  document:{querySelector:()=>({contains(){return false;}}),getElementById:()=>null},
  location:{href:'https://example.invalid/DiaGacha/',protocol:'https:',pathname:'/DiaGacha/',hash:'',search:''},matchMedia:()=>({matches:false})});
context.window=context;
const instrumented=html.replace(startup,'globalThis.simulationV55={activeCards,drawMixPack,productionScore,DiaScoring,Wt};');
for(const [i,match] of [...instrumented.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries())vm.runInContext(match[1],context,{filename:'index-inline-'+i,timeout:10000});
context.latestCollisionV55=collisionDetailsV55;
vm.runInContext('collisionDetailsV55=latestCollisionV55;',context);
if(!html.includes('const originalBalancedWeightsV55='))vm.runInContext(fs.readFileSync(path.join(__dirname,'space-rates-v55.js'),'utf8'),context);
const api=context.simulationV55,seed=2026111501,count=30000;
let state=seed;const rng=()=>((state=Math.imul(state,1664525)+1013904223>>>0)/4294967296);
const totals={score:0,baselineOriginalOnly:0,v54FormulaOnSameDraws:0,creativeMatched:0,creativeApplied:0,evolutionMatched:0,bondsAtCap:0,scoreAtCap:0,lowStarCreative:0};
const scoreBins={},newBonusBins={},ruleCounts={},samples=[];
for(let i=0;i<count;i++){
  const cards=api.drawMixPack(api.activeCards,rng),result=api.productionScore(cards),rows=collisionDetailsV55(cards),newRows=rows.filter(row=>row.bonus>0);
  const original=api.DiaScoring.production(cards),style=cards.find(card=>card.dimension==='风格体系'),method=cards.find(card=>card.dimension==='导演手法');
  const compatible=api.Wt(style.id).some(system=>api.Wt(method.id).some(other=>other.id===system.id));
  const legacy=api.DiaScoring.production(cards,{},compatible),applied=result.score-original.score;
  totals.score+=result.score;totals.baselineOriginalOnly+=original.score;totals.v54FormulaOnSameDraws+=legacy.score;
  totals.creativeMatched+=Number(newRows.length>0);totals.creativeApplied+=Number(applied>0);totals.evolutionMatched+=Number(rows.some(row=>row.level==='evolution'));
  totals.bondsAtCap+=Number(result.bonds===8);totals.scoreAtCap+=Number(result.score===100);
  totals.lowStarCreative+=Number(newRows.some(row=>row.cardIds.some(id=>['C','UC','R','SR'].includes(cards.find(card=>card.id===id).rarity))));
  const bin=String(Math.floor(result.score/10)*10);scoreBins[bin]=(scoreBins[bin]||0)+1;newBonusBins[applied]=(newBonusBins[applied]||0)+1;
  for(const row of newRows){const key=row.ruleId||row.id;ruleCounts[key]=(ruleCounts[key]||0)+1;}
  if(newRows.length&&samples.length<12)samples.push({ids:cards.map(card=>card.id),names:cards.map(card=>card.name),score:result.score,applied,creative:newRows.map(row=>({id:row.id,bonus:row.bonus,title:row.title}))});
}
const percent=value=>Number((100*value/count).toFixed(3)),mean=value=>Number((value/count).toFixed(4));
const report={version:55,seed,count,method:'执行当前index的drawMixPack，包括真实低星单卡上限、v55空间5%上限及连续保底；普通包，无每日赠礼或指定维度。仅注入最新collisionDetailsV55，未用均匀卡池抽样。',
  sourceHashes:Object.fromEntries(['index.html','scripts/collisions-v55.js','scripts/collision-data-v55.json','scripts/space-rates-v55.js'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')])),
  percentages:{creativeMatched:percent(totals.creativeMatched),creativeActuallyAdded:percent(totals.creativeApplied),evolutionMatched:percent(totals.evolutionMatched),newRewardIncludesOneToFourStar:percent(totals.lowStarCreative),bondsAtEight:percent(totals.bondsAtCap),scoreAtHundred:percent(totals.scoreAtCap)},
  meanScores:{v55:mean(totals.score),sameDrawsFourOriginalRulesOnly:mean(totals.baselineOriginalOnly),sameDrawsV54FormulaIncludingLegacyCompatibility:mean(totals.v54FormulaOnSameDraws)},scoreBins,newBonusBins,ruleCounts,samples};
fs.writeFileSync(path.join(root,'docs/validation/v55-collision-simulation.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({count,percentages:report.percentages,meanScores:report.meanScores,scoreBins,newBonusBins}));
