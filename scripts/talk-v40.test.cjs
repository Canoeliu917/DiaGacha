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
const examples = [
  {
    name: '用户组合：餐车里的庄园交接',
    ids: ['play-cherry', 'ystyle-street', 'ydir-handkerchief', 'xrole-pozzo', 'role2-duncan', 'place-v21-diningcar'],
  },
  {
    name: '原作人物吻合：安葬与禁令',
    ids: ['play-antigone', 'style-classic', 'dir-body', 'role-anti', 'role2-creon', 'place-thebes'],
  },
  {
    name: '旧五卡：一人排演未完成的离开',
    ids: ['play-godot', 'style-absurd', 'dir-freeze', 'role-vladimir', 'place-road'],
  },
];
function checkComplete(drawn) {
  const paragraphs = talk.nn(drawn);
  assert.equal(paragraphs.length, 4);
  assert.deepEqual(talk.nn([...drawn].reverse()), paragraphs);
  assert.deepEqual(talk.fiveTalk(drawn), paragraphs);
  assert.equal(talk.shortScene([...drawn].reverse()), talk.shortScene(drawn));
  assert.match(paragraphs[0], /^本局创作／排演设想：/);
  assert.match(paragraphs[0], /以下动作与相遇均为本局改编/);
  for (const text of [...paragraphs, talk.shortScene(drawn)]) {
    assert.ok(text.length > 30);
    assert.match(text, /[。！？][”’」』"]?$/);
    assert.doesNotMatch(text, /undefined|\[object Object\]|\{(?:a|b|prop)\}|。{2}|收回到。/);
    assert.doesNotMatch(text, /^(底本 |主演 |配角 |空间 |演法 )/);
    assert.doesNotMatch(text, /同作关系|原作羁绊|两人原本|两人本是/);
  }
  assert.ok(talk.dramaticTitleV40(drawn).length <= 35);
  assert.ok(talk.talkSourcesV40(drawn));
}

test('用户组合围绕同一场庄园交接逐场推进，信任、道具和公共见证改变关系', () => {
  const drawn = draw(examples[0].ids);
  const [opening, encounter, reversal, ending] = talk.nn(drawn);
  checkComplete(drawn);
  assert.equal(talk.dramaticTitleV40(drawn), '餐车｜饭还没吃完，园子已经易主');
  assert.match(opening, /庄园出售/);
  assert.match(opening, /餐车.*餐桌/);
  assert.match(opening, /波卓.*指挥.*邓肯等自己坐好/);
  assert.match(opening, /邓肯把暂时代管的钥匙放在两人之间/);
  assert.match(encounter, /邓肯把周到的欢迎当作善意/);
  assert.match(encounter, /波卓.*庄园钥匙挪近自己/);
  assert.match(encounter, /邓肯伸手要接时，波卓却先把杯子递过去/);
  assert.match(reversal, /邓肯伸手要拿回钥匙，波卓却把它压在掌下/);
  assert.match(reversal, /到站广播/);
  assert.match(reversal, /餐车的一段过道向公共观看区敞开.*演员扮作旅客/);
  assert.match(reversal, /拦路请求.*临时的街头戏台/);
  assert.match(reversal, /见证者.*条件说完整/);
  assert.match(ending, /钥匙给了你，留下的人怎么办/);
  assert.doesNotMatch(talk.nn(drawn).join(''), /《等待戈多》|《麦克白》|主演 波卓|配角 邓肯/);
  assert.equal(talk.talkSourcesV40(drawn), '波卓：《等待戈多》；邓肯：《麦克白》');
  assert.match(talk.shortScene(drawn), /点头变成了让权.*钥匙易手/);
});

test('原作人物吻合仍明确是本局排演，保留安葬与禁令，不把同作自动写成亲密羁绊', () => {
  const drawn = draw(examples[1].ids);
  const text = talk.nn(drawn).join('');
  checkComplete(drawn);
  assert.match(text, /安提戈涅捧着土，请克瑞翁让出一条路/);
  assert.match(text, /克瑞翁.*逐字重申自己的要求/);
  assert.match(text, /把土覆了下去/);
  assert.match(text, /克瑞翁必须决定是否亲手抹去/);
  assert.doesNotMatch(text, /买下|偿还|欠钱|相爱|结为|同作关系/);
  const disguised = drawn.map(card => ({ ...card, workIds: ['same-work'] }));
  assert.deepEqual(talk.nn(disguised), talk.nn(drawn));
});

test('5卡旧链接保持独演，人物来源只含抽到的演员，任意顺序不影响故事', () => {
  const drawn = draw(examples[2].ids);
  checkComplete(drawn);
  const text = talk.nn(drawn).join('');
  assert.match(text, /全场由弗拉季米尔独演/);
  assert.match(text, /同一演员换位试说的回答，不另添人物/);
  assert.match(text, /弗拉季米尔走到对面.*随即回到原位/);
  assert.doesNotMatch(text, /爱斯特拉冈|波卓|邓肯|配角 [^：]/);
  assert.equal(talk.talkSourcesV40(drawn), '弗拉季米尔：《等待戈多》');
  assert.doesNotMatch(text, /两人同时|两副身体/);
  assert.match(text, /演员先后在两个位置迎上去/);
});

test('777旧分享卡和500常驻卡均保留身份并能进入四场故事', () => {
  assert.equal(cards.length, 777);
  assert.equal(activeIds.size, 500);
  assert.deepEqual(new Set(cards.map(card => card.id)), new Set(identities.map(card => card.id)));
  const base = draw(examples[0].ids);
  for (const card of cards) {
    const drawn = base.map(item => item.dimension === card.dimension ? card : item);
    checkComplete(drawn);
    if (['主演', '配角'].includes(card.dimension)) {
      assert.ok(card.sourcePlayLabel, card.id);
      assert.ok(talk.talkSourcesV40(drawn).includes(`${card.name}：${card.sourcePlayLabel}`), card.id);
    }
  }
});

test('交叉抽样覆盖不同结构的组合、顺序与5卡，不改输入数据', () => {
  let seed = 0x40d1a;
  const randomIndex = size => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed % size;
  };
  const before = JSON.stringify(cards);
  for (let index = 0; index < 1200; index++) {
    let drawn = pools.map(pool => pool[randomIndex(pool.length)]);
    if (index % 3 === 0) drawn = drawn.filter(card => card.dimension !== '配角');
    checkComplete(drawn);
  }
  assert.equal(JSON.stringify(cards), before);
});

test('六张卡都改变排演；未单独映射的卡沿用完整编辑动作，没有关键词分类或截断补句', () => {
  const base = draw(examples[0].ids);
  const baseline = talk.nn(base).join('');
  for (let index = 0; index < dimensions.length; index++) {
    const substitute = pools[index].find(card => card.id !== base[index].id);
    const drawn = base.map((card, position) => position === index ? substitute : card);
    assert.notEqual(talk.nn(drawn).join(''), baseline, substitute.id);
  }
  const synthetic = base.map(card => ({ ...card, id: `unmapped-${card.dimension}`, stage: `请把这张${card.dimension}卡的动作完整做完，再等对方回应。` }));
  const text = talk.nn(synthetic).join('');
  for (const card of synthetic) assert.ok(text.includes(card.stage), card.dimension);
  const longSentence = '这个决定需要等对方把话说完再作回答'.repeat(30) + '。';
  synthetic[3].stage = longSentence;
  assert.ok(talk.nn(synthetic).join('').includes(longSentence));
  assert.equal(talk.copySentenceV39(longSentence), longSentence);
  assert.equal(talk.stageSentenceV39('排演时，让演员先坐下。'), '让演员先坐下。');
  const innocent = synthetic.map(card => ({ ...card, note: '钱财罪责王位背叛', tags: ['复仇', '欠债'] }));
  assert.deepEqual(talk.nn(innocent), talk.nn(synthetic));
});

test('街头剧与第四堵墙同时抽到时明确内外层，不要求演员一边破墙一边不承认观众', () => {
  const drawn = draw(examples[0].ids.map(id => id === 'ydir-handkerchief' ? 'dir-wall' : id));
  assert.match(talk.nn(drawn)[2], /围观发生在戏外.*第四堵墙.*演员不向观众索取回答/);
});

test('倒叙回看关系变化，不把其他主题硬写成争夺道具成功', () => {
  const drawn = draw(['play-doll', 'style-real', 'dir-flashback', 'role-nora', 'role2-kristine-linde', 'place-parlor']);
  const text = talk.nn(drawn).join('');
  assert.match(text, /倒叙先演两人已经无法照原来的方式说话/);
  assert.doesNotMatch(text, /娜拉得手|行李已经易手/);
  const cherry = draw(examples[0].ids.map(id => id === 'ydir-handkerchief' ? 'dir-body' : id));
  assert.doesNotMatch(talk.nn(cherry)[2], /放下杯子/);
});

if (process.argv.includes('--samples')) {
  for (const example of examples) {
    const drawn = draw(example.ids);
    console.log(`\n${example.name}\n${talk.dramaticTitleV40(drawn)}\n${talk.shortScene(drawn)}\n\n${talk.nn(drawn).join('\n\n')}\n人物来源：${talk.talkSourcesV40(drawn)}\n`);
  }
}
