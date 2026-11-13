const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const talk = require('./talk-v39.js');
const { applyCopyOverridesV39 } = require('./copy-overrides-v39.js');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cards = JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
const identities = JSON.parse(fs.readFileSync(path.join(root, 'docs/cards.json'), 'utf8'));
const activeIds = new Set(JSON.parse(fs.readFileSync(path.join(root, 'docs/ACTIVE_CARDS_V39.json'), 'utf8')).activeIds);
const sources = JSON.parse(fs.readFileSync(path.join(root, 'docs/ROLE_SOURCES_V39.json'), 'utf8')).cards;
applyCopyOverridesV39(cards, {});
for (const card of cards) {
  const source = sources.find(item => item.id === card.id);
  if (source) {
    card.sourcePlayLabel = source.sourcePlayLabel;
    card.workIds = source.sourcePlayIds.slice();
  }
}
const dimensions = ['剧目', '风格体系', '导演手法', '主演', '配角', '环境'];
const pools = dimensions.map(dimension => cards.filter(card => card.dimension === dimension));
function draw(ids) {
  return ids.map(id => {
    const card = cards.find(item => item.id === id);
    assert.ok(card, id);
    return card;
  });
}
const examples=[
 {name:'餐车里的庄园交接',ids:['play-cherry','ystyle-street','ydir-handkerchief','xrole-pozzo','role2-duncan','place-v21-diningcar']},
 {name:'画展资助与拖欠工钱',ids:['yplay-mrswarren','style-v21-radiodrama','dir-body','v23-role-serge','role2-liu-siye','place-meixiang']},
 {name:'没有补造配角的旧五卡',ids:['play-godot','style-absurd','dir-freeze','role-vladimir','place-road']},
];
function checkComplete(drawn){
 const paragraphs=talk.nn(drawn);
 assert.equal(paragraphs.length,5);
 assert.deepEqual(talk.nn([...drawn].reverse()),paragraphs);
 assert.deepEqual(talk.fiveTalk(drawn),paragraphs);
 assert.equal(talk.shortScene([...drawn].reverse()),talk.shortScene(drawn));
 assert.match(paragraphs[0],/^故事联想：/);
 assert.match(paragraphs[0],/虚构/);
 assert.match(paragraphs[4],/^戏剧线索：/);
 assert.ok(paragraphs[4].length<=300,'科普段不挤占完整故事');
 for(const text of [...paragraphs,talk.shortScene(drawn)]){
  assert.ok(text.length>30);
  assert.match(text,/[。！？][”’」』"]?$/);
  assert.doesNotMatch(text,/undefined|\[object Object\]|\{(?:a|b|prop)\}|。{2}|收回到。/);
 }
 for(const text of [...paragraphs.slice(0,4),talk.shortScene(drawn)]){
  const prose=drawn.reduce((value,card)=>value.replaceAll(card.name,''),text);
  assert.doesNotMatch(prose,/排演|排练|演员|观众|调度|谁先动|空间动作|先交换位置|按.{0,20}方式重新落地|把这一处理放回/);
 }
 assert.ok(talk.dramaticTitleV40(drawn).length<=35);
 assert.ok(talk.talkSourcesV40(drawn));
}
test('餐车里的交接具有具体欲望、限制、事件与后果，不再夹入排练说明',()=>{
 const drawn=draw(examples[0].ids),parts=talk.nn(drawn);
 checkComplete(drawn);
 assert.match(parts[0],/列车.*餐车.*庄园交接/);
 assert.match(parts[1],/点头.*同意.*钥匙/);
 assert.match(parts[2],/到站广播.*拿回钥匙.*压在掌下/);
 assert.match(parts[3],/留下的人怎么办/);
 assert.equal(talk.talkSourcesV40(drawn),'波卓：《等待戈多》；邓肯：《麦克白》');
});
test('用户华伦夫人组合从展览资助推进到工钱责任，声音改变信息而非空泛换位',()=>{
 const drawn=draw(examples[1].ids),parts=talk.nn(drawn);checkComplete(drawn);
 assert.match(parts[0],/塞尔吉.*白画.*媚香楼.*认真看待自己的选择.*刘四爷.*挂他的名字/);
 assert.match(parts[1],/未付的工钱.*自己补上/);
 assert.match(parts[1],/塞尔吉按住账簿.*刘四爷伸手遮住那些名字/);
 assert.doesNotMatch(parts[1],/不肯把手收回|暴露了双方都不愿放弃的部分/);
 assert.match(parts[2],/催账的声音.*被一再拖延的报酬/);
 assert.match(parts[3],/缩小展览规模.*挂名的机会.*欠款仍要偿还/);
 assert.match(parts[4],/薇薇.*贫困.*继续经营妓院获利.*经济独立.*广播剧/);
 assert.equal(talk.talkSourcesV40(drawn),'塞尔吉：《艺术》；刘四爷：《骆驼祥子》');
});
test('5卡旧局是一个人的故事，不编造第二张人物或原作关系',()=>{
 const drawn=draw(examples[2].ids);checkComplete(drawn);
 assert.match(talk.nn(drawn)[0],/弗拉季米尔独自/);
 assert.doesNotMatch(talk.nn(drawn).slice(0,4).join(''),/爱斯特拉冈|波卓|邓肯|同一演员|另一种声音/);
 assert.equal(talk.talkSourcesV40(drawn),'弗拉季米尔：《等待戈多》');
});
test('777历史卡与500常驻均可生成完整故事，人物来源不丢失',()=>{
 assert.equal(cards.length,777);assert.equal(activeIds.size,500);
 assert.deepEqual(new Set(cards.map(card=>card.id)),new Set(identities.map(card=>card.id)));
 const base=draw(examples[0].ids);
 for(const card of cards){const drawn=base.map(item=>item.dimension===card.dimension?card:item);checkComplete(drawn);
  if(['主演','配角'].includes(card.dimension))assert.ok(talk.talkSourcesV40(drawn).includes(`${card.name}：${card.sourcePlayLabel}`),card.id);
 }
});
test('1200组交叉抽样不变更数据，不把卡片排练字段抄进故事',()=>{
 let seed=0x40d1a;const random=size=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%size;};
 const before=JSON.stringify(cards);
 for(let i=0;i<1200;i++){let drawn=pools.map(pool=>pool[random(pool.length)]);if(i%3===0)drawn=drawn.filter(c=>c.dimension!=='配角');checkComplete(drawn);}
 assert.equal(JSON.stringify(cards),before);
 const base=draw(examples[0].ids),changed=base.map(c=>({...c,stage:'让演员重新交换位置，给观众看一次调度。',hook:'排练重来。'}));
 assert.deepEqual(talk.nn(changed),talk.nn(base));
});
test('六维改变故事或专业解读，单人故事同样接纳演法与手段',()=>{
 const base=draw(examples[0].ids),text=talk.nn(base).join('');
 for(let i=0;i<dimensions.length;i++){const other=pools[i].find(c=>c.id!==base[i].id),changed=base.map((c,j)=>j===i?other:c);assert.notEqual(talk.nn(changed).join(''),text,other.id);}
 const solo=draw(examples[2].ids),alternate=solo.map(c=>c.dimension==='导演手法'?cards.find(c=>c.id==='dir-body'):c);
 assert.notEqual(talk.nn(alternate)[1],talk.nn(solo)[1]);
});
test('原作与写作方法参考明确分开，只列已核实且与抽卡有关的资料',()=>{
 const refs=talk.talkReferencesV40(draw(examples[1].ids));
 assert.equal(refs.length,5);
 assert.ok(refs.some(r=>r.kind==='原作资料'&&r.url.includes('/1097/')));
 assert.ok(refs.some(r=>r.title.includes('骆驼祥子')));
 assert.ok(refs.some(r=>r.kind==='写作方法'));
 const unrelated=talk.talkReferencesV40(draw(examples[0].ids));
 assert.equal(unrelated.length,1);
 assert.equal(unrelated[0].kind,'写作方法');
});
if(process.argv.includes('--samples'))for(const example of examples){const drawn=draw(example.ids);console.log('\n'+example.name+'\n'+talk.nn(drawn).join('\n\n')+'\n人物来源：'+talk.talkSourcesV40(drawn));}
