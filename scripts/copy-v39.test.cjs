const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { copyOverridesV39, applyCopyOverridesV39 } = require('./copy-overrides-v39.js');
const talk = require('./talk-v39.js');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const rawCards = JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
const originalEssays = JSON.parse(html.match(/const cardEssays\s*=\s*(\{[^\n]+\});/)[1]);
const activeIds = new Set(JSON.parse(fs.readFileSync(path.join(root, 'docs/ACTIVE_CARDS_V39.json'), 'utf8')).activeIds);
const roleSources = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(root, 'docs/ROLE_SOURCES_V39.json'), 'utf8')).cards.map(card => [card.id, card.sourcePlayLabel]));
const copy = value => JSON.parse(JSON.stringify(value));

test('显式文案覆盖不改777张身份、分值、收藏或羁绊字段，覆盖卡ID全部存在', () => {
  const cards = copy(rawCards), essays = copy(originalEssays);
  const immutable = card => ['id', 'name', 'dimension', 'rarity', 'atk', 'def', 'fame', 'no', 'workIds', 'review'].map(key => card[key]);
  const before = cards.map(immutable);
  applyCopyOverridesV39(cards, essays);
  assert.equal(cards.length, 777);
  assert.deepEqual(cards.map(immutable), before);
  for (const [id, fields] of Object.entries(copyOverridesV39)) {
    assert.ok(cards.some(card => card.id === id), id);
    assert.ok(Object.keys(fields).every(field => ['note', 'observe', 'stage', 'essay'].includes(field)), id);
    const card = cards.find(item => item.id === id);
    if ('note' in fields) {
      assert.equal(card.blurb, card.note);
      if (card.dimension === '剧目') assert.equal(card.plot, card.note);
    }
    if ('observe' in fields) assert.equal(card.why, card.observe);
    if ('stage' in fields) {
      assert.equal(card.hook, card.stage);
      assert.equal(card.with, card.stage);
      assert.equal(card.action, card.stage.replace(/[。；]+$/, ''));
    }
    if ('essay' in fields) assert.equal(essays[id], fields.essay);
  }
  const once = JSON.stringify({ cards, essays });
  applyCopyOverridesV39(cards, essays);
  assert.equal(JSON.stringify({ cards, essays }), once);
});

test('500张卡均能生成完整排演文本，旧五卡不补配角，输入顺序自由', () => {
  const cards = copy(rawCards), essays = copy(originalEssays);
  applyCopyOverridesV39(cards, essays);
  for (const card of cards) card.sourcePlayLabel = roleSources[card.id];
  const dimensions = ['剧目', '风格体系', '导演手法', '主演', '配角', '环境'];
  const active = cards.filter(card => activeIds.has(card.id));
  const base = dimensions.map(dimension => active.find(card => card.dimension === dimension));
  for (const card of active) {
    const drawn = base.map(item => item.dimension === card.dimension ? card : item);
    const paragraphs = talk.nn(drawn);
    assert.equal(paragraphs.length, 4);
    assert.deepEqual(talk.nn([...drawn].reverse()), paragraphs);
    for (const role of drawn.filter(item => ['主演', '配角'].includes(item.dimension))) {
      assert.ok(role.sourcePlayLabel, role.id);
      assert.ok(talk.talkSourcesV40(drawn).includes(`${role.name}：${role.sourcePlayLabel}`), role.id);
    }
    for (const text of [...paragraphs, talk.shortScene(drawn)]) {
      assert.doesNotMatch(text, /undefined|\[object Object\]|收回到。|。{2}|排演可试：排演时/);
      assert.match(text, /[。！？][”’」』"]?$/);
    }
  }
  const legacy = base.filter(card => card.dimension !== '配角');
  assert.deepEqual(talk.fiveTalk(legacy), talk.nn(legacy));
  assert.doesNotMatch(talk.nn(legacy)[1], /配角/);
  assert.match(talk.nn(legacy)[0], /独演/);
});

test('同名不同作品不编造原作关系，长句保留完整且不会用字数补套话', () => {
  const dimensions = ['剧目', '风格体系', '导演手法', '主演', '配角', '环境'];
  const drawn = dimensions.map((dimension, index) => ({
    id: `test-${index}`, dimension, name: '相同名字', note: '这是完整的人物说明。',
    stage: '先让对方把话说完。', workIds: [`work-${index}`],
  }));
  assert.doesNotMatch(talk.nn(drawn)[1], /已确认的同作关系/);
  drawn[4].workIds = [...drawn[3].workIds];
  assert.doesNotMatch(talk.nn(drawn)[1], /已确认的同作关系/);
  const longSentence = '这个决定需要等待对方回答'.repeat(30) + '。';
  assert.equal(talk.copySentenceV39(longSentence), longSentence);
  assert.equal(talk.copySentenceV39('一句完整的问话？'), '一句完整的问话？');
  assert.equal(talk.copySentenceV39(''), '');
  assert.equal(talk.stageSentenceV39('排演时，让演员先坐下。'), '让演员先坐下。');
  assert.equal(talk.stageSentenceV39('让演员先坐下。'), '让演员先坐下。');
  assert.equal(talk.stageSentenceV39('人物在排演时离开。'), '人物在排演时离开。');
});
