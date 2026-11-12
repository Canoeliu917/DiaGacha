const test = require('node:test');
const assert = require('node:assert/strict');
const { cardScore, production } = require('./scoring-v38.js');

const dimensions = ['剧目', '风格体系', '导演手法', '主演', '配角', '环境'];
const rarities = ['C', 'UC', 'R', 'SR', 'SSR', 'UR'];
function cast(score = 80) {
  return dimensions.map((dimension, index) => ({
    id: `card-${index}`, name: `卡${index}`, dimension, rarity: rarities[index], atk: score, def: score,
  }));
}
function close(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
}

test('单卡只由两轴均分决定，名气和稀有度不会重复抬分', () => {
  assert.equal(cardScore({ atk: 0, def: 0 }), 0);
  assert.equal(cardScore({ atk: 100, def: 100 }), 100);
  assert.equal(cardScore({ atk: 71, def: 80, rarity: 'LR', fame: 100 }), 76);
  assert.equal(cardScore({ atk: 71, def: 80, rarity: 'C', fame: 0 }), 76);
  for (const invalid of [null, {}, { atk: NaN, def: 80 }, { atk: 80, def: Infinity }, { atk: -1, def: 80 }, { atk: 80, def: 101 }, { atk: '80', def: 80 }]) {
    assert.throws(() => cardScore(invalid), RangeError);
  }
});

test('六维按指定权重计分，输入顺序不影响结果且不会修改输入', () => {
  const cards = cast();
  cards.forEach((card, i) => { card.atk = card.def = [100, 80, 60, 40, 20, 0][i]; });
  const before = JSON.stringify(cards);
  const result = production(cards);
  close(result.weightedMean, 54);
  close(result.base, 54);
  assert.equal(result.score, 54);
  assert.deepEqual(result.contributions.map(item => item.weight), [.22, .14, .16, .20, .16, .12]);
  assert.deepEqual(production([...cards].reverse()), result);
  assert.equal(JSON.stringify(cards), before);
});

test('各卡两轴提高时整台分单调不降', () => {
  for (let index = 0; index < 6; index++) {
    for (const axis of ['atk', 'def']) {
      let previous = -Infinity;
      for (let value = 0; value <= 100; value++) {
        const cards = cast(50);
        cards[index][axis] = value;
        const score = production(cards).score;
        assert.ok(score >= previous, `${index}/${axis}/${value}`);
        previous = score;
      }
    }
  }
});

test('同色覆盖每个等级的二至六张，孤张不加分', () => {
  const rates = { C: .3, UC: .45, R: .6, SR: .8, SSR: 1, UR: 1.2, LR: 1.4 };
  for (const [rarity, rate] of Object.entries(rates)) {
    for (let count = 2; count <= 6; count++) {
      const cards = cast();
      const others = Object.keys(rates).filter(item => item !== rarity);
      cards.forEach((card, index) => { card.rarity = index < count ? rarity : others[index - count]; });
      const result = production(cards);
      close(result.resonance, Math.round((count - 1) * rate * 100) / 100);
      assert.equal(result.resonanceDetails.length, 1);
      assert.equal(result.resonanceDetails[0].count, count);
      assert.equal(result.resonanceDetails[0].cardIds.length, count);
    }
  }
  assert.equal(production(cast()).resonance, 0);
});

test('多个同色组可累加，低星同色也有收益', () => {
  const cards = cast();
  cards.forEach((card, index) => { card.rarity = ['C', 'C', 'UC', 'UC', 'R', 'R'][index]; });
  const result = production(cards);
  assert.equal(result.resonance, 1.35);
  assert.equal(result.resonanceDetails.length, 3);
  assert.equal(result.score, 81.4);
});

test('同名不同作或相似标签不能触发同作羁绊', () => {
  const cards = cast();
  cards.forEach((card, index) => { card.name = '俄狄浦斯'; card.tags = ['悲剧', '原作']; card.workIds = [`work-${index}`]; });
  assert.equal(production(cards).bonds, 0);
  assert.equal(production(cards).score, 80);
  assert.deepEqual(production(cards).bondDetails, []);
});

test('明确俄狄浦斯对应能触发主角、配角、主配、原作空间，重复来源不重复计分', () => {
  const cards = cast();
  const workIds = ['work-oedipus-king', 'work-oedipus-king', 'work-oedipus-alias'];
  for (const index of [0, 3, 4, 5]) cards[index].workIds = [...workIds];
  cards[0].name = '俄狄浦斯王';
  cards[3].name = '俄狄浦斯';
  cards[4].name = '提瑞西阿斯';
  cards[5].name = '忒拜广场';
  const result = production(cards);
  assert.equal(result.bonds, 7);
  assert.equal(result.bondDetails.length, 4);
  assert.deepEqual(result.bondDetails.map(item => [item.id, item.points]), [
    ['play-lead', 3], ['play-support', 2], ['lead-support', 1], ['play-place', 1],
  ]);
  assert.equal(result.bondDetails[0].workIds.length, 2);
  assert.equal(production(cards, {}, true).bonds, 8);
});

test('显式来源映射补充每卡 workIds，兼容只由显式布尔标记开启', () => {
  const cards = cast();
  cards[0].workIds = ['play-oedipus'];
  const links = { 'card-3': ['play-oedipus'], 'card-4': ['play-oedipus'], 'card-5': ['play-oedipus'] };
  const before = JSON.stringify({ cards, links });
  const result = production(cards, links, true);
  assert.equal(result.bonds, 8);
  assert.equal(result.bondDetails.at(-1).id, 'style-method');
  assert.equal(JSON.stringify({ cards, links }), before);
  const documentedLinks = Object.fromEntries(Object.entries(links).map(([id, workIds]) => [id, { workIds, basis: '明确作品来源' }]));
  assert.deepEqual(production(cards, documentedLinks, true), result);
  assert.equal(production(cast(), {}, true).bonds, 1);
  assert.throws(() => production(cards, links, 'true'), TypeError);
});

test('五卡旧局按实际权重归一，不补配角且保留旧链接所需顺序自由', () => {
  const cards = cast().filter(card => card.dimension !== '配角');
  const result = production(cards);
  close(result.weightedMean, 80);
  close(result.contributions.reduce((sum, item) => sum + item.weight, 0), 1);
  close(result.contributions[0].weight, 22 / 84);
  assert.equal(result.score, 80);
  cards[0].workIds = cards[3].workIds = cards[4].workIds = ['work-hamlet'];
  assert.equal(production(cards, {}, true).bonds, 5);
});

test('无羁绊不折扣基础分，最低零分，基础与奖励相加后封顶一百分', () => {
  assert.equal(production(cast(0)).score, 0);
  assert.equal(production(cast(80)).score, 80);
  const cards = cast(100);
  cards.forEach(card => { card.rarity = 'LR'; card.workIds = ['work-test']; });
  const result = production(cards, {}, true);
  close(result.base, 100);
  assert.equal(result.resonance, 7);
  assert.equal(result.bonds, 8);
  assert.equal(result.base + result.resonance + result.bonds, 115);
  assert.equal(result.score, 100);
});

test('重复 id、重复维度和非法缺维度无法刷同色或羁绊', () => {
  const duplicateId = cast(); duplicateId[1].id = duplicateId[0].id;
  const duplicateDimension = cast(); duplicateDimension[1].dimension = duplicateDimension[0].dimension;
  const invalidDimension = cast(); invalidDimension[1].dimension = '作者';
  const invalidRarity = cast(); invalidRarity[0].rarity = 'INVALID';
  const invalidSources = cast(); invalidSources[0].workIds = 'work-hamlet';
  for (const cards of [duplicateId, duplicateDimension, invalidDimension, invalidRarity, invalidSources, cast().filter(card => card.dimension !== '剧目')]) {
    assert.throws(() => production(cards), TypeError);
  }
  for (const cards of [[], cast().slice(0, 4), [...cast(), cast()[0]], null]) {
    assert.throws(() => production(cards), RangeError);
  }
});
