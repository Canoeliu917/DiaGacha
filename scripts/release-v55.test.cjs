const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {loadRuntime,randomFromSeed}=require('./runtime-v55.cjs');
const {runtime:g}=loadRuntime([]),cards=Array.from(g.activeCards),dims=Array.from(g.x,dim=>dim.key);
const draw=seed=>g.drawMixPack(g.activeCards,randomFromSeed(seed));
test('v54分享归档字节完全不变',()=>{
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../releases/v54/index.html'))).digest('hex');
 assert.equal(hash,'1ba713cc32fcec1ee8479dd9b6a1da4bc950618fa5e8e93ee350fe61258345c4');
});
test('v55分享归档字节完全不变',()=>{
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../releases/v55/index.html'))).digest('hex');
 assert.equal(hash,'ed6942deed45e61c53cbdd5eaa359c67cf4cf11a0c12ea4181db0f13af5aff5d');
});
test('500张原卡插画、小人和攻防星级与v54逐张相同',()=>{
 let harness=fs.readFileSync(path.join(__dirname,'check-balance.cjs'),'utf8').split('const originalOwned')[0];
 harness=harness.replace("path.join(root, 'index.html')","path.join(root, 'releases/v54/index.html')").replace('scoring:DiaScoring}','scoring:DiaScoring,Ct}');
 const old={exports:{}};
 new Function('require','__dirname','module',harness+'\nmodule.exports=loadRuntime([]).runtime;')(require,__dirname,old);
 for(const card of cards){const prior=old.exports.activeCards.find(row=>row.id===card.id);assert.ok(prior);assert.equal(g.Ct(card),old.exports.Ct(prior),card.id);for(const key of ['atk','def','rarity','name'])assert.equal(card[key],prior[key],card.id+'.'+key);}
});
test('达到100分后每项实际分为0且解释封顶，不重复堆分',()=>{
 const lineup=draw(5500).map(card=>({...card,atk:100,def:100})),result=g.productionScore(lineup),cues=g.productionCuesV40(result,lineup);
 assert.equal(result.score,100);assert.ok(cues.length);assert.ok(cues.every(cue=>cue.points===0));
 const markup=g.collisionPanelV55(result,lineup);assert.match(markup,/总分 100 分上限/);assert.match(markup,/同星 <b>\+0/);
});
test('空间最高单卡5%，其余维度及高星每张概率保持不变，65空间均可获得',()=>{
 for(const table of [g.DiaRatesV40.standard,g.DiaRatesV40.gift])for(const dim of dims){
  const before=g.originalBalancedWeightsV55(g.activeCards,dim,table),after=g.balancedWeightsV53(g.activeCards,dim,table);
  assert.ok(Math.abs(after.reduce((s,r)=>s+r.chance,0)-1)<1e-10);
  for(const row of after){assert.ok(row.chance>0);if(dim!=='环境'||['SSR','UR','LR'].includes(row.card.rarity))assert.equal(row.chance,before.find(r=>r.card.id===row.card.id).chance);else assert.ok(row.chance<=.05+1e-10);}
  if(dim==='环境')assert.equal(after.length,65);
 }
});
test('实际组合总分、奖励明细、预算及标题稳定，逆序卡组结果相同',()=>{
 for(let seed=1;seed<=250;seed++){
  const lineup=draw(seed),result=g.productionScore(lineup),cues=g.productionCuesV40(result,lineup);
  assert.equal(result.score,Math.min(100,result.base+result.resonance+result.bonds));
  assert.ok(result.bonds<=8&&result.resonance<=7);
  assert.equal(cues.reduce((sum,c)=>sum+c.points,0)+result.base,result.score);
  assert.ok(cues.every(c=>c.points>=0&&c.points<=c.rawPoints));
  const inverse=g.productionScore([...lineup].reverse());
  assert.equal(inverse.score,result.score);
  assert.equal(g.dramaticTitleV40(lineup),g.dramaticTitleV55(lineup));
  assert.equal(g.dramaticTitleV55(lineup),g.dramaticTitleV55([...lineup].reverse()));
  assert.match(g.shareUrlV53(lineup),/releases\/v57\/index.html/);
 }
});
test('结果页替换入口紧跟原卡，评分在六卡之后和故事之前，不再有长改写账单',()=>{
 const lineup=draw(55),html=g.Un({...g.Y,drawn:lineup,owned:cards.map(c=>c.id),fromShare:false,pool:cards});
 assert.equal((html.match(/class="cast-slot-v55"/g)||[]).length,6);
 assert.equal((html.match(/data-action="rewrite-open"/g)||[]).length,6);
 assert.ok(html.indexOf('cast-row')<html.indexOf('class="hex-panel"'));
 assert.ok(html.indexOf('class="hex-panel"')<html.indexOf('class="talk"'));
 assert.doesNotMatch(html,/改写这一幕|rewrite-jump|整台.*→|本场只可确认一次/);
});
