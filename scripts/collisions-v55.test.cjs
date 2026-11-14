const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {collisionDetailsV55,data}=require('./collisions-v55.js');
const card=id=>{assert.ok(data.facts[id],id);return data.facts[id];};
const pairs=ids=>collisionDetailsV55(ids.map(card));
test('500张卡均有动作、约束、学习建议和来源；每条规则只引用真实常驻卡',()=>{
  assert.equal(Object.keys(data.facts).length,500);
  for(const item of Object.values(data.facts)){
    assert.ok(item.action&&item.note&&item.constraint&&item.learning,item.id);
    assert.ok(item.sourceRefs.length,item.id);
    for(const id of item.sourceRefs)assert.match(data.sources[id].url,/^https?:\/\//);
  }
  assert.equal(new Set(data.rules.map(row=>row.id)).size,data.rules.length);
  assert.equal(new Set(data.rules.filter(row=>row.cardIds.length===2).map(row=>row.cardIds.slice().sort().join('|'))).size,data.rules.filter(row=>row.cardIds.length===2).length);
  for(const row of [...data.rules,...data.families])for(const id of row.cardIds||[...row.left,...row.right])assert.ok(data.facts[id],row.id+':'+id);
});
test('全部15种维度对都有学习关系；探索问题不硬加分',()=>{
  const sample=['play-oedipus','style-stan','dir-wall','role-oedipus','role2-creon','place-tea'].map(card);
  const details=collisionDetailsV55(sample);assert.equal(details.filter(row=>row.cardIds.length===2).length,15);
  for(const row of details){assert.ok(row.title&&row.explanation&&row.event&&row.learning);assert.ok(row.sourceRefs.length);if(row.level==='generated-learning')assert.equal(row.bonus,0);}
});
test('同作主配角只解释不重复奖励；同源并不伪造亲属关系',()=>{
  const row=pairs(['role-nora','role2-kristine-linde'])[0];assert.equal(row.bonus,0);assert.match(row.bonusNote,/不重复/);assert.match(row.learning,/同作/);
  const cross=pairs(['role-oedipus','role2-cassandra'])[0];assert.equal(cross.bonus,2);assert.match(cross.explanation,/不同作品/);assert.match(cross.learning,/不表示在原作中相识/);
});
test('v55演法手段由明确动作奖励，不使用旧Wt标签，也不被旧兼容判重吞分',()=>{
  assert.equal(pairs(['style-epic','dir-alien'])[0].bonus,1);
  assert.equal(pairs(['style-stan','dir-wall'])[0].bonus,1);
  assert.equal(pairs(['style-kabuki','dir-ritual'])[0].bonus,0);
});
test('三卡进化只形成场面，不生成卡；吸收同意象配对防止重复计分',()=>{
  const input=['play-godot','style-absurd','dir-v21-endingloop'].map(card),before=JSON.stringify(input);
  const rows=collisionDetailsV55(input),evolution=rows.find(row=>row.level==='evolution');
  assert.equal(evolution.bonus,3);assert.equal(evolution.cardIds.length,3);
  for(const id of evolution.replaces){const row=rows.find(row=>row.id===id);assert.equal(row.bonus,0);assert.equal(row.evolvedBy,evolution.id);}
  assert.equal(JSON.stringify(input),before);
});
test('规则生成保留实际人物来源和独立审读边界；星级与分数不改变关系',()=>{
  const input=['role-nora','role2-claudius'].map(card),rows=collisionDetailsV55(input),row=rows[0];
  assert.equal(row.level,'curated-rule');assert.equal(row.bonus,1);assert.match(row.reviewScope,/未逐对人工审读/);assert.equal(row.factBasis.length,2);
  const changed=input.map((c,i)=>({...c,rarity:i?'C':'LR',atk:i?1:99,def:i?1:99}));assert.deepEqual(collisionDetailsV55(changed),rows);
});
test('输入顺序不影响结果，字段不泄漏占位符，重复id或维度不会重复发奖',()=>{
  const input=['play-hamlet','style-v21-metatheatre','dir-v21-selectivereplay','role-nora','role2-claudius','place-parlor'].map(card);
  assert.deepEqual(collisionDetailsV55(input.slice().reverse()),collisionDetailsV55(input));
  assert.doesNotMatch(JSON.stringify(collisionDetailsV55(input)),/\{[ab]\}|undefined/);
  assert.throws(()=>collisionDetailsV55([card('role-nora'),card('role-nora')]));assert.throws(()=>collisionDetailsV55([card('role-nora'),card('role-hamlet')]));
});
test('浏览器预加载JSON后可直接调用同一API，不需要Node require',()=>{
  const context=vm.createContext({collisionDataV55:JSON.parse(JSON.stringify(data))});
  vm.runInContext(fs.readFileSync(__dirname+'/collisions-v55.js','utf8'),context);
  const input=['play-hamlet','dir-v21-selectivereplay'].map(card);
  assert.equal(JSON.stringify(context.collisionDetailsV55(input)),JSON.stringify(collisionDetailsV55(input)));
});
