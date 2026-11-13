const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { production } = require('./scoring-v38.js');

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const context = vm.createContext({ K: escapeHtml });
vm.runInContext(fs.readFileSync(path.join(__dirname, 'scoring-ui-v38.js'), 'utf8'), context);
const { productionCuesV40, scoreBreakdown } = context;
const plain = value => JSON.parse(JSON.stringify(value));
const dimensions = ['剧目', '风格体系', '导演手法', '主演', '配角', '环境'];
const rarities = ['C', 'UC', 'R', 'SR', 'SSR', 'UR', 'LR'];
function cast(score = 75) {
  return dimensions.map((dimension, index) => ({ id: `card-${index}`, name: `${dimension}卡`, dimension, rarity: rarities[index], atk: score, def: score }));
}
function assertScore(result, cues) {
  const sum = values => values.reduce((total, cue) => total + cue.points, 0);
  assert.equal(sum(cues), result.score - result.base);
  assert.ok(sum(cues.filter(cue => cue.kind === 'resonance')) <= 7);
  assert.ok(sum(cues.filter(cue => cue.kind === 'bond')) <= 8);
  assert.ok(cues.every(cue => Number.isInteger(cue.points) && cue.points >= 0));
}

test('每个星级的二至六卡都有独立戏剧短评与准确关联卡', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const rarity of rarities) {
    for (let count = 2; count <= 6; count++) {
      const cards = cast();
      const others = rarities.filter(value => value !== rarity);
      cards.forEach((card, index) => { card.rarity = index < count ? rarity : others[index - count]; });
      const result = production(cards);
      const before = JSON.stringify({ result, cards });
      const cues = productionCuesV40(result, cards);
      assert.equal(cues.length, 1);
      const cue = cues[0];
      assert.equal(cue.id, `resonance-${rarity}`);
      assert.equal(cue.kind, 'resonance');
      assert.equal(cue.rarity, rarity);
      assert.deepEqual(plain(cue.cardIds), cards.slice(0, count).map(card => card.id));
      assert.ok(cue.description.length >= 18 && cue.description.length <= 22, cue.description);
      assert.match(cue.description, /^[^。！？\n]+。$/);
      assert.doesNotMatch(cue.description, /…|\.\.\./);
      assert.doesNotMatch(cue.description,/一递一接|先搭起一个来回/);
      titles.add(cue.title);
      descriptions.add(cue.description);
      assertScore(result, cues);
      assert.equal(JSON.stringify({ result, cards }), before);
      const markup = scoreBreakdown(result, cards);
      assert.match(markup, new RegExp(`class="production-cue rarity-${rarity}"`));
      assert.ok(markup.includes(`data-rarity="${rarity}"`));
      assert.ok(markup.includes(`data-card-ids="${escapeHtml(JSON.stringify(cue.cardIds))}"`));
      assert.ok(markup.includes('同星合演，')&&markup.includes('回看关联卡牌'));
      assert.ok(markup.includes(`关联卡牌：${cards.slice(0, count).map(card => card.name).join('、')}。`));
      assert.equal(markup.split(result.crew.title).length - 1, 0, '不再重复展示剧组大称号');
      assert.equal((markup.match(/data-production-cue=/g)||[]).length,1);
    }
  }
  assert.equal(titles.size, 35);
  assert.equal(descriptions.size, 35);
});

test('总览评语关闭分值时连无障碍名称也不报加分数，仍保留准确关联卡',()=>{
  const cards=cast();cards.forEach((card,index)=>{card.rarity=index<2?'UC':'R';});
  const result=production(cards),markup=scoreBreakdown(result,cards,false);
  assert.doesNotMatch(markup,/cue-value|\+\d|加\d+分|本场分数|spread-score/);
  assert.ok(markup.includes('data-cue-id="resonance-UC"'));
  assert.ok(markup.includes('data-cue-id="resonance-R"'));
  assert.doesNotMatch(markup,/production-crew|<h2|小剧场班底/);
  assert.equal((markup.match(/data-production-cue=/g)||[]).length,2);
  const withPoints=scoreBreakdown(result,cards,true);
  assert.match(withPoints,/class="cue-value">\+\d/);
});

test('真实哈姆雷特卡组的四种同作羁绊与演法羁绊各有对应短评', () => {
  const database = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/cards.json'), 'utf8'));
  const picked = { 剧目: 'play-hamlet', 主演: 'role-hamlet', 配角: 'role2-laertes', 环境: 'place-elsinore' };
  const cards = dimensions.map(dimension => database.find(card => picked[dimension] ? card.id === picked[dimension] : card.dimension === dimension));
  const result = production(cards, {}, true);
  const cues = productionCuesV40(result, cards);
  const bonds = cues.filter(cue => cue.kind === 'bond');
  assert.equal(bonds.length, 5);
  assert.deepEqual(plain(bonds.map(cue => cue.id)), ['bond-play-lead', 'bond-play-support', 'bond-lead-support', 'bond-play-place', 'bond-style-method']);
  assert.equal(new Set(bonds.map(cue => cue.title)).size, 5);
  assert.equal(new Set(bonds.map(cue => cue.description)).size, 5);
  for (const cue of bonds) {
    const original = result.bondDetails.find(bond => `bond-${bond.id}` === cue.id);
    assert.deepEqual(plain(cue.cardIds), original.cardIds);
    assert.ok(cue.description.length >= 18 && cue.description.length <= 22, cue.description);
    assert.match(cue.description, /^[^。！？\n]+。$/);
    assert.doesNotMatch(cue.description, /…|\.\.\./);
  }
  assert.ok(cues.some(cue => cue.kind === 'resonance'));
  assertScore(result, cues);
  const markup = scoreBreakdown(result, cards);
  for (const cue of cues) assert.ok(markup.includes(`data-action="production-cue" data-cue-id="${cue.id}" data-production-cue="${cue.id}"`));
  for (const cue of bonds) assert.ok(markup.includes(`关联卡牌：${cue.cardIds.map(id => cards.find(card => card.id === id).name).join('、')}。`));
});

test('多组同星与羁绊同时触发，累计分不穿透类别帽或总分帽', () => {
  for (const base of [75, 95, 100]) {
    const cards = cast(base);
    cards.forEach((card, index) => { card.rarity = ['SSR', 'SSR', 'UR', 'UR', 'LR', 'LR'][index]; card.workIds = ['same-play']; });
    const result = production(cards, {}, true);
    const cues = productionCuesV40(result, cards);
    assert.equal(result.resonance, 7);
    assert.equal(result.bonds, 8);
    assert.equal(cues.length, 8, '封顶后仍保留每个已触发事件，供卡面回应');
    assertScore(result, cues);
    if (base === 75) assert.deepEqual(plain(cues.slice(0, 3).map(cue => cue.points)), [3, 3, 1]);
    if (base === 100) assert.ok(cues.every(cue => cue.points === 0));
  }
});

test('长卡名不挤占单行短评，十五种羁绊文案均完整简短', () => {
  const descriptions = new Set();
  for (let variant = 0; variant < 3; variant++) {
    const cards = cast().map((card, index) => ({ ...card, id: `card-${index}-${variant}`, name: `一张名称非常长但必须完整保留来源的${card.dimension}卡`, workIds: ['same-play'] }));
    const result = production(cards, {}, true);
    const cues = productionCuesV40(result, cards).filter(cue => cue.kind === 'bond');
    const markup = scoreBreakdown(result, cards);
    for (const cue of cues) {
      descriptions.add(cue.description);
      assert.ok(cue.description.length >= 18 && cue.description.length <= 22, cue.description);
      assert.match(cue.description, /^[^。！？\n]+。$/);
      assert.doesNotMatch(cue.description, /…|\.\.\./);
      assert.ok(markup.includes(`<span>${cue.description}</span>`));
      assert.ok(markup.includes(`关联卡牌：${cue.cardIds.map(id => cards.find(card => card.id === id).name).join('、')}。`));
    }
  }
  assert.equal(descriptions.size, 15);
});

test('无奖励的混搭只保留普通短评，不显示大称号或重复总分', () => {
  const cards = cast();
  const result = production(cards);
  assert.deepEqual(plain(productionCuesV40(result, cards)), []);
  const markup = scoreBreakdown(result, cards);
  assert.ok(markup.includes('各有一招，一起开场。'));
  assert.doesNotMatch(markup,/跨界剧组|production-crew|<h2/);
  assert.doesNotMatch(markup, /data-production-cue|<ul|<button|暂无|暂未|扣分|缺少|不足/);
  assert.doesNotMatch(markup, /本场评价|剧组称号：|基础|组队奖励|加分方式|<details|75|100/);
});

test('五卡旧局只回看存在的卡，不虚构配角事件', () => {
  const cards = cast().filter(card => card.dimension !== '配角');
  cards.forEach(card => { card.rarity = 'UC'; card.workIds = ['legacy-play']; });
  const result = production(cards, {}, true);
  const cues = productionCuesV40(result, cards);
  assert.equal(cues[0].cardIds.length, 5);
  assert.equal(cues.length, 4);
  assert.ok(cues.every(cue => cue.cardIds.every(id => cards.some(card => card.id === id))));
  assert.ok(cues.every(cue => !cue.id.includes('support')));
  assertScore(result, cues);
  const markup = scoreBreakdown(result, cards);
  assert.doesNotMatch(markup, /配角|\+\d|基础|星\s*\d\s*人组|组队奖励|加分方式|data-points/);
});

test('每组只有一个加分词条，文本与事件属性均转义', () => {
  const cards = cast();
  cards.forEach((card, index) => { card.rarity = ['C', 'C', 'UC', 'UC', 'LR', 'LR'][index]; });
  cards[0].id = 'card-"<&';
  cards[0].name = '<img src=x onerror=alert(1)>';
  const result = production(cards);
  const markup = scoreBreakdown(result, cards);
  assert.match(markup, /class="production-cue rarity-LR"[^>]+data-cue-id="resonance-LR"/);
  assert.equal((markup.match(/data-production-cue=/g)||[]).length,3);
  assert.doesNotMatch(markup,/production-crew/);
  assert.ok(markup.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(markup.includes(escapeHtml(JSON.stringify([cards[0].id, cards[1].id]))));
  assert.doesNotMatch(markup, /<img|\+\d|本场评价|基础|组队奖励|data-points/);
});
