const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {statRationaleV40}=require('./stat-rationale-v40.js');
const cards=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/cards.json'),'utf8'));
const K=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const context=vm.createContext({K,statRationaleV40,x:[{key:'剧目',atkHint:'冲突强度',defHint:'叙事完整'}],sn:'<svg></svg>',cn:'<svg></svg>'});
vm.runInContext(fs.readFileSync(path.join(__dirname,'card-detail-v40.js'),'utf8'),context);

test('ATK与DEF各自作为原生展开入口，分数条和概念提示始终在summary中',()=>{
  const card=cards.find(card=>card.id==='yplay-krapp'),review=statRationaleV40(card);
  const markup=context.statAxesMarkupV40(card);
  const sections=[...markup.matchAll(/<details class="axis axis-(atk|def) stat-axis">([\s\S]*?)<\/details>/g)];
  assert.equal(sections.length,2);
  for(const [,axis,body] of sections){
    const summary=body.match(/<summary>([\s\S]*?)<\/summary>/)[1];
    assert.ok(summary.includes(axis.toUpperCase()));
    assert.ok(summary.includes(`<b>${card[axis]}</b>`));
    assert.ok(summary.includes(`width:${card[axis]}%`));
    assert.ok(summary.includes('axis-hint'));
    assert.ok(body.includes(K(review[axis].reason)));
    assert.ok(!summary.includes(K(review[axis].reason)));
  }
  assert.doesNotMatch(markup,/评分依据|为什么是这个分数|stat-rationale|<details[^>]* open/);
});

test('轴解释保留来源和编辑判断说明，内容转义且不改写原分数',()=>{
  const card=cards.find(card=>card.id==='play-hamlet'),before=JSON.stringify(card);
  const markup=context.statAxesMarkupV40(card),review=statRationaleV40(card);
  for(const source of review.sources)assert.ok(markup.includes(K(source.url)));
  assert.ok(markup.includes(K(review.note)));
  assert.equal(JSON.stringify(card),before);
  const injected={...card,id:'new-card',note:'<img src=x onerror=alert(1)>。',observe:'<script>不好</script>。',review:{}};
  assert.doesNotMatch(context.statAxesMarkupV40(injected),/<img|<script>/);
});
