const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const talk = require('./talk-v39.js');
const { applyCopyOverridesV39 } = require('./copy-overrides-v39.js');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(__dirname, 'talk-v39.js'), 'utf8');
const cards = JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
const activeIds = new Set(JSON.parse(fs.readFileSync(path.join(root, 'docs/ACTIVE_CARDS_V39.json'), 'utf8')).activeIds);
applyCopyOverridesV39(cards, {});
const dimensions = ['剧目', '风格体系', '导演手法', '主演', '配角', '环境'];
const pools = dimensions.map(dimension => cards.filter(card => card.dimension === dimension && activeIds.has(card.id)));
const base = pools.map(pool => pool[0]);
const coreTitle = title => title.split('｜').at(-1);
const validTitle = title => {
  assert.ok(title.length >= 4 && title.length <= 35, title);
  assert.doesNotMatch(title, /undefined|null|\[object Object\]|[{}<>]|[\r\n]/);
};
function draw(ids) {
  return ids.map(id => {
    const card = cards.find(item => item.id === id);
    assert.ok(card, id);
    return card;
  });
}
function randomDraws(count) {
  let seed = 0x52d1a;
  const random = size => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return Math.floor((seed / 0x100000000) * size);
  };
  return Array.from({ length: count }, () => pools.map(pool => pool[random(pool.length)]));
}
function titleGroups() {
  return vm.runInNewContext(`${source}\nJSON.parse(JSON.stringify(storyTitlesV52));`);
}
function candidates(group, drawn) {
  const lead = drawn.find(card => card.dimension === '主演');
  const support = drawn.find(card => card.dimension === '配角');
  return group.map(title => title.replace(/\{(a|b)\}/g, (_, key) => key === 'a' ? lead.name : support?.name));
}

test('500张常驻卡都能生成完整短标题，重排与重复渲染不变且不修改卡片', () => {
  const active = cards.filter(card => activeIds.has(card.id));
  assert.equal(active.length, 500);
  const before = JSON.stringify(active);
  for (const card of active) {
    const drawn = base.map(item => item.dimension === card.dimension ? card : item);
    const title = talk.dramaticTitleV40(drawn);
    validTitle(title);
    assert.equal(talk.dramaticTitleV40(drawn), title, card.id);
    assert.equal(talk.dramaticTitleV40([...drawn].reverse()), title, card.id);
  }
  assert.equal(JSON.stringify(active), before);
});

test('2000组常驻卡抽样产生至少50种主标题，不把地点差异算作标题丰富度', () => {
  const titles = new Set();
  for (const drawn of randomDraws(2000)) {
    const title = talk.dramaticTitleV40(drawn);
    validTitle(title);
    titles.add(coreTitle(title));
  }
  assert.ok(titles.size >= 50, `实际仅有 ${titles.size} 种去掉地点的主标题`);
});

test('更换六个维度中任一维度，都能改变主标题而不只是地点前缀', () => {
  for (let index = 0; index < dimensions.length; index++) {
    const titles = new Set(pools[index].map(card => coreTitle(talk.dramaticTitleV40(base.map((item, i) => i === index ? card : item)))));
    assert.ok(titles.size > 1, `${dimensions[index]}没有影响主标题`);
  }
});

test('28条故事分支各有至少8个不同标题，标题始终来自当前故事的候选', () => {
  const groups = titleGroups();
  const examples = {
    'play-cherry': 'play-cherry', 'play-oedipus': 'play-oedipus', 'play-hamlet': 'play-hamlet',
    'play-macbeth': 'play-macbeth', 'play-godot': 'play-godot', 'play-doll': 'play-doll',
    'play-teahouse': 'play-teahouse', 'play-thunder': 'play-thunder', 'play-peony': 'play-peony',
    'play-salesman': 'play-salesman', 'play-goodperson': 'play-goodperson', 'play-lear': 'play-lear',
    'play-othello': 'play-othello', 'play-antigone': 'play-antigone', 'play-xixiang': 'play-xixiang',
    'play-visit': 'play-visit', 'play-glass': 'play-glass', 'xplay-seagull': 'xplay-seagull',
    'play-rhino': 'play-rhino', 'play-medea': 'play-medea', money: 'play-sunrise', secret: 'play-doue',
    choice: 'play-palace', shelter: 'play-peach', identity: 'play-secret', waiting: 'play-sisters',
    warren: 'yplay-mrswarren', solo: 'play-godot',
  };
  assert.equal(Object.keys(examples).length, 28);
  for (const [key, playId] of Object.entries(examples)) {
    assert.ok(groups[key], key);
    assert.ok(new Set(groups[key]).size >= 8, `${key} 的不同标题不足8种`);
    for (const sample of randomDraws(120)) {
      let drawn = sample.map(card => card.dimension === '剧目' ? draw([playId])[0] : card);
      if (key === 'solo') drawn = drawn.filter(card => card.dimension !== '配角');
      const title = coreTitle(talk.dramaticTitleV40(drawn));
      assert.ok(candidates(groups[key], drawn).includes(title), `${key} 错配标题：${title}`);
    }
  }
  assert.ok(new Set(Object.values(groups).flat()).size >= 224);
});

test('旧五卡与华伦夫人使用各自故事标题，长地点不会退回不相干的通用标题', () => {
  const groups = titleGroups();
  const warren = draw(['yplay-mrswarren', 'style-v21-radiodrama', 'dir-body', 'v23-role-serge', 'role2-liu-siye', 'place-meixiang']);
  const solo = warren.filter(card => card.dimension !== '配角');
  for (const [key, drawn] of [['warren', warren], ['solo', solo]]) {
    const title = coreTitle(talk.dramaticTitleV40(drawn));
    assert.ok(candidates(groups[key], drawn).includes(title), title);
    assert.doesNotMatch(title, /缺页|缺失|那一页|无辜|嫌疑/);
    const longPlace = drawn.map(card => card.dimension === '环境' ? { ...card, name: '很长的空间名称'.repeat(10) } : card);
    assert.equal(talk.dramaticTitleV40(longPlace), title);
    validTitle(talk.dramaticTitleV40(longPlace));
    assert.equal(talk.dramaticTitleV40([...longPlace].reverse()), title);
  }
  assert.match(talk.nn(warren)[0], /展览/);
  assert.match(talk.shortScene(warren), /画展/);
  assert.match(talk.nn(solo)[0], /独自.*回信/);
  assert.match(talk.shortScene(solo), /独自.*回信/);
});

test('游戏页面内嵌的标题及故事实现与通过测试的源文件一致', () => {
  assert.ok(html.replace(/\r\n/g, '\n').includes(source.replace(/\r\n/g, '\n').trim()));
});
