const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { DiaRatesV40, effectiveRatesV40 } = require('./rates-v40.js');
const root = path.resolve(__dirname, '..');
const previous = { C: 22, UC: 26, R: 26, SR: 15, SSR: 7, UR: 3, LR: 1 };
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const startup = 'Zn.addEventListener(`click`,Tr),Er()';
assert.equal(html.split(startup).length, 2);
const storage = new Map();
const sandbox = {
  console, URL, URLSearchParams, Intl, navigator: {},
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  sessionStorage: { getItem: () => null, setItem() {} },
  document: { querySelector: () => ({}), getElementById: () => null },
  location: { href: 'https://example.invalid/', protocol: 'https:', hash: '', search: '', pathname: '/' },
  matchMedia: () => ({ matches: false }),
};
sandbox.window = sandbox;
const context = vm.createContext(sandbox);
const expose = 'globalThis.fixture={activeCards,C,Cboosted,ee,drawMixPack,emptyLoop,Y,v,x,copyDimension,setBase(table){y=table}}';
for (const block of html.replace(startup, expose).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) vm.runInContext(block[1], context, { timeout: 10000 });
const game = context.fixture;
const ranks = Array.from(game.v), dimensions = Array.from(game.x, item => item.key);
const pool = Array.from(game.activeCards), activeIds = new Set(pool.map(card => card.id));
const poolBefore = JSON.stringify(pool);
const round = value => Number(value.toFixed(4));
const rateReport = { standardBefore: previous, standardAfter: DiaRatesV40.standard, giftUnchanged: DiaRatesV40.gift, activeCards: pool.length, seed: 20261112, packsPerMode: 20000 };
const effective = table => Object.fromEntries(dimensions.map(dimension => [dimension, effectiveRatesV40(pool, dimension, table, game.ee)]));
function reset(table = DiaRatesV40.standard) { game.setBase(table); game.Y.loop = game.emptyLoop(); }
function seeded(seed) {
  let state = seed >>> 0;
  return () => { state = (state + 0x6D2B79F5) >>> 0; let t = state; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function packTheory(table) {
  const actual = Object.values(effective(table));
  const once = predicate => round(100 * (1 - actual.reduce((chance, row) => chance * (1 - ranks.filter(predicate).reduce((sum, rank) => sum + row[rank], 0) / 100), 1)));
  return { five: once(rank => rank === 'SSR'), six: once(rank => rank === 'UR'), fiveOrSix: once(rank => ['SSR', 'UR'].includes(rank)), atLeastFive: once(rank => ['SSR', 'UR', 'LR'].includes(rank)), atLeastSix: once(rank => ['UR', 'LR'].includes(rank)), seven: once(rank => rank === 'LR') };
}

test('普通五星七到十、六星三到五，总和100；七星与赠礼概率不变', () => {
  assert.equal(pool.length, 500);
  for (const table of Object.values(DiaRatesV40)) assert.equal(Object.values(table).reduce((sum, chance) => sum + chance, 0), 100);
  assert.deepEqual(DiaRatesV40.standard, { C: 20, UC: 24, R: 25, SR: 15, SSR: 10, UR: 5, LR: 1 });
  assert.deepEqual(DiaRatesV40.gift, { C: 8, UC: 12, R: 25, SR: 24, SSR: 18, UR: 9, LR: 4 });
  reset();
  for (const [table, draw] of [[DiaRatesV40.standard, game.C], [DiaRatesV40.gift, game.Cboosted]]) {
    const counts = Object.fromEntries(ranks.map(rank => [rank, 0]));
    for (let i = 0; i < 10000; i++) counts[draw(() => (i + .5) / 10000)]++;
    assert.deepEqual(counts, Object.fromEntries(ranks.map(rank => [rank, table[rank] * 100])));
    let boundary = 0;
    for (const rank of ranks) {
      assert.equal(draw(() => (boundary + .000001) / 100), rank);
      boundary += table[rank];
      assert.equal(draw(() => (boundary - .000001) / 100), rank);
    }
  }
});

test('实际每维出率使用真实缺档回退，五星六星均存在，不扩充500卡池', () => {
  const missing = [];
  for (const dimension of dimensions) {
    const subset = pool.filter(card => card.dimension === dimension);
    for (const rank of ranks) if (!subset.some(card => card.rarity === rank)) missing.push({ dimension, requested: rank, actual: game.ee(subset, rank)[0].rarity });
    for (const table of Object.values(DiaRatesV40)) {
      const actual = effectiveRatesV40(pool, dimension, table, game.ee);
      assert.equal(Object.values(actual).reduce((sum, chance) => sum + chance, 0), 100);
      assert.equal(actual.SSR, table.SSR);
      assert.equal(actual.UR, table.UR + (dimension === '导演手法' ? table.LR : 0));
      assert.equal(actual.LR, dimension === '导演手法' ? 0 : table.LR);
    }
  }
  assert.deepEqual(missing, [{ dimension: '剧目', requested: 'C', actual: 'UC' }, { dimension: '导演手法', requested: 'LR', actual: 'UR' }]);
  const rates = effective(DiaRatesV40.standard);
  assert.equal(rates.剧目.C, 0);
  assert.equal(rates.剧目.UC, 44);
  assert.equal(rates.导演手法.UR, 6);
  assert.equal(effective(DiaRatesV40.gift).导演手法.UR, 13);
  rateReport.missingTiers = missing;
  rateReport.effectiveStandardPercent = rates;
  rateReport.effectiveGiftPercent = effective(DiaRatesV40.gift);
  assert.equal(JSON.stringify(pool), poolBefore);
});

test('30包五星以上、60包六星以上保底与一次性赠礼保持兼容', () => {
  const atLeast = (cards, minimum) => cards.some(card => ranks.indexOf(card.rarity) >= ranks.indexOf(minimum));
  reset();
  for (let i = 1; i <= 30; i++) {
    const cards = game.drawMixPack(game.activeCards, () => 0);
    assert.equal(atLeast(cards, 'SSR'), i === 30);
  }
  assert.equal(game.Y.loop.pitySSR, 0);
  reset(); game.Y.loop.pityUR = 58;
  assert.equal(atLeast(game.drawMixPack(game.activeCards, () => 0), 'UR'), false);
  assert.equal(game.Y.loop.pityUR, 59);
  assert.equal(atLeast(game.drawMixPack(game.activeCards, () => 0), 'UR'), true);
  assert.equal(game.Y.loop.pityUR, 0);
  assert.equal(game.Y.loop.pitySSR, 0);
  reset(); game.Y.loop.blessedNext = true;
  const gift = game.drawMixPack(game.activeCards, () => .8);
  assert.ok(gift.every(card => card.rarity === 'SSR'));
  assert.equal(game.Y.loop.blessedNext, false);
  const ordinary = game.drawMixPack(game.activeCards, () => .8);
  assert.ok(ordinary.every(card => card.rarity === 'SR'));
  for (const dimension of dimensions) {
    reset(); game.Y.loop.pendingDim = dimension;
    const cards = game.drawMixPack(game.activeCards, () => 0);
    assert.equal(cards.find(card => card.dimension === dimension).rarity, 'SSR');
    assert.equal(game.Y.loop.pendingDim, '');
  }
});

test('帮助表直接复用抽率配置与真实fallback，各维普通和赠礼展示正确', () => {
  const ui = vm.createContext({ K: String, copyDimension: game.copyDimension, ee: game.ee, x: game.x });
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'rates-v40.js'), 'utf8'), ui);
  const markup = ui.ratesHelpV40(pool);
  assert.ok(markup.includes('20%、24%、25%、15%、10%、5%、1%'));
  assert.ok(markup.includes('8%、12%、25%、24%、18%、9%、4%'));
  const rows = [...markup.matchAll(/<tr><th scope="row">([^<]+)<\/th>(.*?)<\/tr>/g)];
  assert.equal(rows.length, 12);
  for (const [kindIndex, table] of Object.values(DiaRatesV40).entries()) {
    for (const [dimensionIndex, dimension] of dimensions.entries()) {
      const row = rows[kindIndex * 6 + dimensionIndex];
      assert.equal(row[1], game.copyDimension(dimension));
      const shown = [...row[2].matchAll(/<td>(\d+)%<\/td>/g)].map(match => Number(match[1]));
      assert.deepEqual(shown, Object.values(effectiveRatesV40(pool, dimension, table, game.ee)));
    }
  }
});

test('每模式两万包真实抽卡模拟符合理论，五星六星命中显著提升', () => {
  const results = {};
  for (const [label, table, gift] of [['previous', previous, false], ['current', DiaRatesV40.standard, false], ['gift', DiaRatesV40.gift, true]]) {
    reset(table);
    const rng = seeded(rateReport.seed);
    const counts = { five: 0, six: 0, fiveOrSix: 0, atLeastFive: 0, atLeastSix: 0, seven: 0 };
    const each = Object.fromEntries(dimensions.map(dimension => [dimension, Object.fromEntries(ranks.map(rank => [rank, 0]))]));
    for (let i = 0; i < rateReport.packsPerMode; i++) {
      if (gift) game.Y.loop.blessedNext = true;
      const cards = game.drawMixPack(game.activeCards, rng), found = new Set(cards.map(card => card.rarity));
      counts.five += found.has('SSR'); counts.six += found.has('UR'); counts.seven += found.has('LR');
      counts.fiveOrSix += found.has('SSR') || found.has('UR');
      counts.atLeastFive += found.has('SSR') || found.has('UR') || found.has('LR');
      counts.atLeastSix += found.has('UR') || found.has('LR');
      for (const card of cards) { assert.ok(activeIds.has(card.id)); each[card.dimension][card.rarity]++; }
    }
    const theory = packTheory(table), actual = Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, round(value / rateReport.packsPerMode * 100)]));
    for (const key of Object.keys(actual)) assert.ok(Math.abs(actual[key] - theory[key]) < 1.5, `${label}.${key}: ${actual[key]} vs ${theory[key]}`);
    results[label] = { theoryWithoutPityPercent: theory, simulationIncludingPityPercent: actual, actualByDimensionPercent: Object.fromEntries(Object.entries(each).map(([dimension, row]) => [dimension, Object.fromEntries(Object.entries(row).map(([rank, count]) => [rank, round(count / rateReport.packsPerMode * 100)]))])) };
  }
  assert.ok(results.current.simulationIncludingPityPercent.fiveOrSix - results.previous.simulationIncludingPityPercent.fiveOrSix > 10);
  assert.ok(results.current.simulationIncludingPityPercent.six - results.previous.simulationIncludingPityPercent.six > 7);
  assert.equal(JSON.stringify(pool), poolBefore);
  rateReport.simulation = results;
  if (process.argv.includes('--report')) fs.writeFileSync(path.join(root, 'docs/RATES_V40_REPORT.json'), JSON.stringify(rateReport, null, 2) + '\n');
  console.log(JSON.stringify(Object.fromEntries(Object.entries(results).map(([key, value]) => [key, value.simulationIncludingPityPercent]))));
});
