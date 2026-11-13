const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const cards=JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
const byId=new Map(cards.map(c=>[c.id,c]));
const essays=JSON.parse(html.match(/const cardEssays\s*=\s*(\{[^\n]+\});/)[1]);
const high=JSON.parse(html.match(/const highStarCopyV40 = (\{[\s\S]*?\n\});/)[1]);
const sources=JSON.parse(html.match(/const highStarSourceDataV40 = (\{[\s\S]*?\n\});/)[1]);
const audits=['PLAYS','ROLES','CRAFT','SPACES'].map(g=>read(`docs/FACT_AUDIT_${g}_V49.json`));
test('V49逐卡核心事实记录精确覆盖500张常驻卡，每张保留具体事实和外部来源',()=>{
  const reviews=audits.flatMap(a=>a.reviews);
  assert.equal(reviews.length,500);
  assert.deepEqual(reviews.map(r=>r.id).sort(),read('docs/ACTIVE_CARDS_V39.json').activeIds.sort());
  for(const review of reviews){
    assert(review.factsChecked.length>0,review.id);
    assert(review.sources.length>0,review.id);
    for(const ref of review.sources){
      assert(ref.title&&/^https?:\/\//.test(ref.url),review.id);
      assert(sources[review.id].some(s=>s.url===ref.url),review.id+' source missing from game');
    }
  }
});
test('V49所有修订进入实际卡片、别名与高星介绍',()=>{
  for(const correction of audits.flatMap(a=>a.corrections)){
    const card=byId.get(correction.id);
    for(const [field,value] of Object.entries(correction.fields)){
      assert.equal(field==='essay'?essays[card.id]:card[field],value,card.id+'.'+field);
      if(field==='note')assert.equal(card.blurb,value);
      if(field==='observe')assert.equal(card.why,value);
      if(field==='stage'){assert.equal(card.hook,value);assert.equal(card.with,value);}
    }
    if(correction.highStar)assert.deepEqual(high[card.id],correction.highStar);
  }
});
test('版本、人物排行与契约事件不再使用已发现的错误表述',()=>{
  assert.equal(byId.get('xrole-zhulian').name,'朱帘秀');
  assert.match(byId.get('yrole-juehui').note,/长房.*第三/);
  assert.match(byId.get('xplay-tartuffe').note,/签下.*契约/);
  assert.match(byId.get('v23-role-jinzhi').note,/田沁鑫.*生死场.*赵三/);
  assert.match(high['xplay-sang'].join(''),/公社开会/);
  assert.doesNotMatch(high['xplay-sang'].join(''),/县里的庆典/);
});
test('事实修订不调整分数、稀有度、卡片编号或常驻数量',()=>{
  const manifest=read('docs/cards.json');
  assert.equal(cards.length,777);
  for(const entry of manifest){
    const card=byId.get(entry.id);
    for(const field of ['atk','def','rarity','no'])assert.equal(card[field],entry[field],entry.id+'.'+field);
  }
});
