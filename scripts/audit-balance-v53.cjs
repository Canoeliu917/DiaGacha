const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
let harness=fs.readFileSync(path.join(root,'scripts/check-balance.cjs'),'utf8').split('const originalOwned')[0];
harness=harness.replace('scoring:DiaScoring}', 'scoring:DiaScoring,productionScore,Ae,Pe,balancedWeightsV53,actualRatesV53,DiaRatesV40}');
const loaded={exports:{}};
new Function('require','__dirname','module',harness+'\nmodule.exports={loadRuntime,randomFromSeed,htmlSha256:crypto.createHash("sha256").update(html).digest("hex")};')(require,path.join(root,'scripts'),loaded);
const {loadRuntime,randomFromSeed}=loaded.exports;
const {runtime:game}=loadRuntime([]);
const cards=Array.from(game.activeCards),dims=Array.from(game.x,d=>d.key),ranks=Array.from(game.v);
const counts=Object.fromEntries(dims.map(dim=>[dim,Object.fromEntries(ranks.map(rank=>[rank,cards.filter(c=>c.dimension===dim&&c.rarity===rank).length]))]));
const probabilities=[];
for(const dim of dims){
  for(const row of game.balancedWeightsV53(game.activeCards,dim,game.DiaRatesV40.standard))probabilities.push({id:row.card.id,name:row.card.name,dimension:dim,rarity:row.card.rarity,p:row.chance});
}
const summary={version:'V53',htmlSha256:loaded.exports.htmlSha256,pool:cards.length,counts,top10:probabilities.toSorted((a,b)=>b.p-a.p).slice(0,10),tasks:Array.from(game.Ae)};
summary.collectionExpectationWithoutGiftsPityOrTargeting=Object.fromEntries([1,5,10,25,50,100,200,500,1000,2000,5000,10000].map(n=>[n,Number(probabilities.reduce((sum,c)=>sum+1-(1-c.p)**n,0).toFixed(2))]));
summary.newCardChanceByPack=Object.fromEntries([10,50,100,200,500,1000,2000].map(n=>[n,Number((probabilities.reduce((sum,c)=>sum+c.p*(1-c.p)**n,0)/6*100).toFixed(2))]));
const rng=randomFromSeed(20261114),scoreN=30000,scores=[],bins={},bonuses={resonance:0,bonds:0,base:0,anyBond:0,anyResonance:0},bondCounts={},rare={atLeastSSR:0,atLeastUR:0,LR:0},repeatTop={any:0,all:0};
const common=new Set(['style-v21-epistolary','dir-v21-endingloop','v23-role-silentman']);
for(let n=0;n<scoreN;n++){
  const draw=game.drawMixPack(game.activeCards,rng),result=game.productionScore(draw);
  scores.push(result.score);bins[result.grade]=(bins[result.grade]||0)+1;
  bonuses.base+=result.base;bonuses.resonance+=result.resonance;bonuses.bonds+=result.bonds;
  bonuses.anyBond+=result.bonds>0;bonuses.anyResonance+=result.resonance>0;
  for(const bond of result.bondDetails)bondCounts[bond.id]=(bondCounts[bond.id]||0)+1;
  const tiers=draw.map(c=>ranks.indexOf(c.rarity));rare.atLeastSSR+=Math.max(...tiers)>=4;rare.atLeastUR+=Math.max(...tiers)>=5;rare.LR+=Math.max(...tiers)===6;
  const repeat=draw.filter(c=>common.has(c.id)).length;repeatTop.any+=repeat>0;repeatTop.all+=repeat===3;
}
scores.sort((a,b)=>a-b);
summary.normalPackSample={seed:20261114,packs:scoreN,mean:Number((scores.reduce((a,b)=>a+b,0)/scoreN).toFixed(3)),minimum:scores[0],p10:scores[Math.floor(scoreN*.1)],median:scores[Math.floor(scoreN*.5)],p90:scores[Math.floor(scoreN*.9)],p99:scores[Math.floor(scoreN*.99)],max:scores.at(-1),gradesPercent:Object.fromEntries(Object.entries(bins).map(([k,v])=>[k,Number((v/scoreN*100).toFixed(3))])),meanBase:bonuses.base/scoreN,meanResonance:bonuses.resonance/scoreN,meanBonds:bonuses.bonds/scoreN,anyBondPercent:bonuses.anyBond/scoreN*100,bondTypePercent:Object.fromEntries(Object.entries(bondCounts).map(([k,v])=>[k,v/scoreN*100])),rarePercent:Object.fromEntries(Object.entries(rare).map(([k,v])=>[k,v/scoreN*100])),threeCommonCardsPercent:Object.fromEntries(Object.entries(repeatTop).map(([k,v])=>[k,v/scoreN*100]))};
const sessions=[];
for(let run=0;run<20;run++){
  game.Y.loop=game.emptyLoop();
  const rng=randomFromSeed(20261114+run),owned=new Set(),milestones={},snapshots={};
  for(let pack=1;pack<=1000;pack++){
    for(const card of game.drawMixPack(game.activeCards,rng))owned.add(card.id);
    for(const mark of [100,300,400,450,500])if(owned.size>=mark&&!milestones[mark])milestones[mark]=pack;
    if([10,50,100,200,500,1000].includes(pack))snapshots[pack]=owned.size;
  }
  sessions.push({milestones,snapshots});
}
summary.collectionSessions={sessions:20,packsEach:1000,mode:'ordinary mix, actual pity; no gift, targeted milestone bonus, or single-dimension pack',snapshots:Object.fromEntries([10,50,100,200,500,1000].map(n=>{const v=sessions.map(s=>s.snapshots[n]).sort((a,b)=>a-b);return[n,{min:v[0],median:v[10],max:v.at(-1),mean:v.reduce((a,b)=>a+b)/v.length}];})),milestones:Object.fromEntries([100,300,400,450,500].map(n=>{const v=sessions.map(s=>s.milestones[n]).filter(Boolean).sort((a,b)=>a-b);return[n,{reached:v.length,medianAmongReached:v[Math.floor(v.length/2)]||null,min:v[0]||null,max:v.at(-1)||null}];}))};


const tables=Object.fromEntries(Object.entries(game.DiaRatesV40).map(([kind,table])=>[kind,Object.fromEntries(dims.map(dim=>[dim,game.actualRatesV53(game.activeCards,dim,table)]))]));
summary.actualRates=tables;
fs.writeFileSync(path.join(root,'docs/validation/v53-balance.json'),JSON.stringify(summary,null,2));
let markdown='# v53 综合包实际星级出率\n\n以下为当前 index.html 的真实 balancedWeightsV53 / actualRatesV53 计算，保底与指定维度替换前。单维包仍走原档位抽取与同包去重规则。1–4星单卡在同一维度最多8%，5–7星概率不变。表格四舍五入至两位小数，合计可能因舍入出现0.01个百分点误差。\n\n';
for(const [kind,rows]of Object.entries(tables)){
  markdown+='## '+(kind==='standard'?'普通综合包':'今日赠礼综合包')+'\n\n| 维度 | C | UC | R | SR | SSR | UR | LR |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n';
  for(const [dim,row]of Object.entries(rows))markdown+='| '+dim+' | '+ranks.map(rank=>Number(row[rank].toFixed(2))+'%').join(' | ')+' |\n';
  markdown+='\n';
}
markdown+='对应 index.html SHA-256：'+loaded.exports.htmlSha256+'\n';
fs.writeFileSync(path.join(root,'docs/validation/v53-rates.md'),markdown);

console.log(JSON.stringify({packs:summary.normalPackSample.packs,mean:summary.normalPackSample.mean,common:summary.normalPackSample.threeCommonCardsPercent,sha:summary.htmlSha256},null,2));
