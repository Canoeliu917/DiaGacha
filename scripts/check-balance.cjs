const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const documentedCards = JSON.parse(fs.readFileSync(path.join(root, 'docs/cards.json'), 'utf8'));
const activeManifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/ACTIVE_CARDS_V39.json'), 'utf8'));
const seed = 20261112;
const sampleSize = 100000;
const plain = value => JSON.parse(JSON.stringify(value));
const round = (value, digits = 4) => Number(value.toFixed(digits));
const percent = (count, total = sampleSize) => round(count / total * 100);

function randomFromSeed(value) {
  let state = value >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let mixed = Math.imul(state ^ state >>> 15, state | 1);
    mixed ^= mixed + Math.imul(mixed ^ mixed >>> 7, mixed | 61);
    return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
  };
}

function loadRuntime(ownedIds) {
  const storage = new Map([['diamasha.owned', JSON.stringify(ownedIds)]]);
  const storageApi = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
  };
  const app = {};
  const fixedTime = Date.UTC(2026, 10, 12, 4);
  class SimulationDate extends Date {
    constructor(...args) { super(...(args.length ? args : [fixedTime])); }
    static now() { return fixedTime; }
  }
  const simulationMath = Object.create(Math);
  simulationMath.random = randomFromSeed(seed);
  const sandbox = {
    console, URL, URLSearchParams, Intl, Date: SimulationDate, Math: simulationMath,
    localStorage: storageApi, sessionStorage: { getItem: () => null, setItem() {} },
    document: {
      querySelector: selector => selector === '#app' ? app : null,
      getElementById: () => null,
    },
    location: { href: 'https://example.invalid/', protocol: 'https:', hash: '', search: '', pathname: '/' },
    matchMedia: () => ({ matches: false }),
  };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  const startup = 'Zn.addEventListener(`click`,Tr),Er()';
  assert.equal(html.split(startup).length - 1, 1, '找不到唯一的应用启动点；请核对内嵌运行时');
  const instrumented = html.replace(startup,
    'globalThis.__DG_TEST__={e,activeCards,T,Xt,drawMixPack,vr,ne,re,w,Y,C,Cboosted,ee,te,ce,pickScoredCard,emptyLoop,v,x,y,Kt,readOwned:$n,remember:er,scoring:DiaScoring}');
  const scripts = [...instrumented.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length, 'HTML 中没有内联脚本');
  for (const [index, script] of scripts.entries()) {
    vm.runInContext(script[1], context, { filename: `index.html:inline-${index + 1}`, timeout: 10000 });
  }
  assert.ok(context.__DG_TEST__, '未能导出真实应用闭包');
  return { runtime: context.__DG_TEST__, storage, simulationMath };
}

const originalOwned = [...new Set([...documentedCards.slice(0, 2).map(card => card.id), activeManifest.reserveIds[0]])];
const { runtime: game, storage, simulationMath } = loadRuntime(originalOwned);
const cards = Array.from(game.e);
const pool = Array.from(game.activeCards);
const activeIds = new Set(pool.map(card => card.id));
const rarities = Array.from(game.v);
const dimensions = Array.from(game.x, dimension => dimension.key);
const byId = new Map(cards.map(card => [card.id, card]));
const blankRarities = () => Object.fromEntries(rarities.map(rarity => [rarity, 0]));
const bucket = (dimension, rarity) => pool.filter(card => card.dimension === dimension && (!rarity || card.rarity === rarity));
const firstCast = () => dimensions.map(dimension => bucket(dimension)[0]);
const checks = [];
function check(name, verify) {
  verify();
  checks.push(name);
  process.stdout.write(`PASS ${name}\n`);
}
function resetLoop() {
  game.Y.loop = game.emptyLoop();
  storage.delete('diamasha.loop');
}
function rankedAtLeast(drawn, rarity) {
  return drawn.some(card => rarities.indexOf(card.rarity) >= rarities.indexOf(rarity));
}
function production(drawn) {
  const result = game.Xt(drawn);
  assert.ok(result.scoring, 'Xt 必须暴露真实 scoring 明细');
  assert.equal(result.score, result.scoring.score, '结果页总分与明细不一致');
  assert.equal(result.scoring.base, Math.round(result.scoring.weightedMean), '基础分全额计入后四舍五入到整数');
  assert.equal(result.score, Math.min(100, Math.max(0,
    result.scoring.base + result.scoring.resonance + result.scoring.bonds)));
  for (const field of ['score', 'base', 'resonance', 'bonds']) assert.ok(Number.isInteger(result.scoring[field]), `${field} 必须是整数`);
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.ok(result.scoring.crew?.title, '必须给出独立的剧组称号');
  return result.scoring;
}

check('777 张卡的 ID、编号唯一且 docs/cards.json 与运行时评分一致', () => {
  assert.equal(cards.length, 777);
  assert.equal(byId.size, 777);
  assert.equal(documentedCards.length, 777);
  assert.deepEqual(cards.map(card => card.no).sort((a, b) => a - b), Array.from({ length: 777 }, (_, i) => i + 1));
  for (const row of documentedCards) {
    const card = byId.get(row.id);
    assert.ok(card, `文档存在未知卡 ${row.id}`);
    for (const field of ['name', 'dimension', 'rarity', 'atk', 'def', 'fame', 'no', 'review', 'workIds']) {
      assert.deepEqual(plain(card[field]), plain(row[field]), `${row.id}.${field} 不同步`);
    }
    assert.equal(game.T(card), row.score, `${row.id} 文档分数不一致`);
    assert.equal(game.T(card), Math.round((card.atk + card.def) / 2));
  }
});

check('常驻500与预留277分开，完整777个ID仍可读取旧收藏和分享', () => {
  assert.equal(pool.length, 500);
  assert.equal(activeIds.size, 500);
  assert.deepEqual([...activeIds].sort(), [...activeManifest.activeIds].sort());
  assert.equal(activeManifest.reserveIds.length, 277);
  assert.ok(activeManifest.reserveIds.every(id => byId.has(id) && !activeIds.has(id)));
  assert.equal(new Set([...activeManifest.activeIds, ...activeManifest.reserveIds]).size, cards.length);
  const reserved = byId.get(activeManifest.reserveIds[0]);
  const lineup = firstCast().map(card => card.dimension === reserved.dimension ? reserved : card);
  const decoded = game.re(game.e, game.ne(`#m=${game.w(lineup)}`, '').ids);
  assert.deepEqual(Array.from(decoded, card => card.id), lineup.map(card => card.id));
  production(decoded);
});

check('单卡不因稀有度或 fame 重复加分，且两轴提升单调不降', () => {
  for (const card of cards) {
    const baseline = game.T(card);
    for (const rarity of rarities) {
      assert.equal(game.T({ ...card, rarity, fame: 0 }), baseline);
      assert.equal(game.T({ ...card, rarity, fame: 100 }), baseline);
    }
    for (const axis of ['atk', 'def']) {
      assert.ok(game.T({ ...card, [axis]: Math.min(100, card[axis] + 1) }) >= baseline);
    }
  }
});

const rarityCounts = blankRarities();
const dimensionCounts = Object.fromEntries(dimensions.map(dimension => [dimension, blankRarities()]));
for (const card of pool) {
  assert.ok(rarities.includes(card.rarity));
  rarityCounts[card.rarity]++;
  dimensionCounts[card.dimension][card.rarity]++;
}
const effectiveBaseRates = {};
const missingTiers = [];
check('各维缺档按实际 ee() 回退统计，不伪造七档齐全', () => {
  assert.equal(Object.values(game.y).reduce((sum, weight) => sum + weight, 0), 100);
  for (const dimension of dimensions) {
    const pool = bucket(dimension);
    assert.ok(pool.length > 0);
    const effective = blankRarities();
    for (const rarity of rarities) {
      const resolved = Array.from(game.ee(pool, rarity));
      assert.ok(resolved.length > 0);
      assert.ok(resolved.every(card => card.dimension === dimension && byId.has(card.id)));
      const actual = [...new Set(resolved.map(card => card.rarity))];
      assert.equal(actual.length, 1, '有效卡池的回退应落到一个实际档位');
      if (dimensionCounts[dimension][rarity]) assert.equal(actual[0], rarity);
      else missingTiers.push({ dimension, requested: rarity, actual: actual[0], probabilityPercent: game.y[rarity] });
      effective[actual[0]] += game.y[rarity];
    }
    effectiveBaseRates[dimension] = effective;
    assert.equal(Object.values(effective).reduce((sum, weight) => sum + weight, 0), 100);
  }
});

check('真实旧五卡与现六卡分享链接可往返解析并计分', () => {
  for (const drawn of [firstCast(), firstCast().filter(card => card.dimension !== '配角')]) {
    const encoded = game.w(drawn);
    for (const [hash, query] of [[`#m=${encoded}`, ''], ['', `?m=${encoded}`]]) {
      const parsed = game.ne(hash, query);
      assert.equal(parsed.kind, 'ids');
      const decoded = game.re(game.e, parsed.ids);
      assert.deepEqual(Array.from(decoded, card => card.id), drawn.map(card => card.id));
      const scored = production(decoded);
      assert.equal(scored.contributions.length, drawn.length);
      assert.ok(Math.abs(scored.contributions.reduce((sum, item) => sum + item.weight, 0) - 1) < 1e-9);
    }
  }
  assert.equal(game.ne('#m=not-a-real-lineup', '').kind, 'bad');
  assert.equal(game.re(game.e, ['missing', ...firstCast().slice(1).map(card => card.id)]), null);
});

let oedipusFixture, hamletFixture;
check('真实俄狄浦斯主角同作，以及已确认的哈姆雷特配角和空间羁绊', () => {
  const drawn = firstCast();
  for (const [dimension, id] of [['剧目', 'play-oedipus'], ['主演', 'role-oedipus'], ['配角', 'role2-tiresias'], ['环境', 'place-thebes']]) {
    assert.ok(byId.has(id), `缺少既有卡 ${id}`);
    drawn[dimensions.indexOf(dimension)] = byId.get(id);
  }
  const scored = production(drawn);
  assert.equal(scored.bondDetails.find(bond => bond.id === 'play-lead')?.points, 3);
  oedipusFixture = { cards: drawn.map(card => ({ id: card.id, name: card.name })), scoring: plain(scored) };
  for (const [dimension, id] of [['剧目', 'play-hamlet'], ['主演', 'role-hamlet'], ['配角', 'role2-laertes'], ['环境', 'place-elsinore']]) {
    assert.ok(byId.has(id), `缺少既有卡 ${id}`);
    drawn[dimensions.indexOf(dimension)] = byId.get(id);
  }
  const hamlet = production(drawn);
  for (const id of ['play-lead', 'play-support', 'lead-support', 'play-place']) {
    assert.ok(hamlet.bondDetails.some(bond => bond.id === id), `哈姆雷特组合未触发 ${id}`);
  }
  assert.ok(hamlet.bonds >= 7 && hamlet.bonds <= 8);
  hamletFixture = { cards: drawn.map(card => ({ id: card.id, name: card.name })), scoring: plain(hamlet) };
});

const sameColorFixtures = [];
check('实际卡池可组成的全同档六卡得到正确共鸣，重复卡不能刷分', () => {
  const sixCardBonuses = { C: 5, UC: 5, R: 6, SR: 6, SSR: 7, UR: 7, LR: 7 };
  for (const rarity of rarities) {
    const drawn = dimensions.map(dimension => bucket(dimension, rarity)[0]);
    if (drawn.some(card => !card)) continue;
    const scored = production(drawn);
    assert.equal(scored.resonance, sixCardBonuses[rarity]);
    assert.equal(scored.resonanceDetails.length, 1);
    sameColorFixtures.push({ rarity, cardIds: drawn.map(card => card.id), resonance: scored.resonance, score: scored.score });
  }
  assert.ok(sameColorFixtures.length > 0);
  const duplicate = firstCast();
  duplicate[1] = duplicate[0];
  assert.throws(() => game.scoring.production(duplicate), /重复/);
});

check('旧收藏 ID 存档保持可读，新增收藏不清空旧收藏', () => {
  assert.deepEqual(Array.from(game.Y.owned), originalOwned);
  assert.deepEqual(Array.from(game.readOwned()), originalOwned);
  const addedId = cards.find(card => !originalOwned.includes(card.id)).id;
  game.remember(addedId);
  const saved = JSON.parse(storage.get('diamasha.owned'));
  assert.deepEqual(saved, [...originalOwned, addedId]);
  game.remember(addedId);
  assert.equal(JSON.parse(storage.get('diamasha.owned')).length, originalOwned.length + 1);
});

const pityFixtures = {};
check('真实综合包在连续未出货30/60包阈值触发保底，自然高档重置计数', () => {
  resetLoop();
  for (let pack = 1; pack <= 30; pack++) {
    const drawn = game.drawMixPack(game.activeCards, () => 0);
    if (pack < 30) assert.ok(!rankedAtLeast(drawn, 'SSR'));
    if (pack === 30) {
      assert.ok(rankedAtLeast(drawn, 'SSR'));
      pityFixtures.pack30 = Array.from(drawn, card => ({ id: card.id, rarity: card.rarity }));
    }
  }
  // SSR+ 保底也可能给出 UR/LR 并重置 UR 计数，因此独立构造合法的 58 包未出 UR 存档。
  resetLoop();
  game.Y.loop.pityUR = 58;
  assert.ok(!rankedAtLeast(game.drawMixPack(game.activeCards, () => 0), 'UR'));
  assert.equal(game.Y.loop.pityUR, 59);
  const drawn60 = game.drawMixPack(game.activeCards, () => 0);
  assert.ok(rankedAtLeast(drawn60, 'UR'));
  assert.equal(game.Y.loop.pityUR, 0);
  assert.equal(game.Y.loop.pitySSR, 0);
  pityFixtures.pack60 = Array.from(drawn60, card => ({ id: card.id, rarity: card.rarity }));
  game.Y.loop.pitySSR = 17;
  game.Y.loop.pityUR = 35;
  assert.ok(rankedAtLeast(game.drawMixPack(game.activeCards, () => .999999), 'UR'));
  assert.equal(game.Y.loop.pitySSR, 0);
  assert.equal(game.Y.loop.pityUR, 0);
});

const uniformSampling = { verifiedBuckets: 0, verifiedCardIntervals: 0 };
check('每维同档使用等宽随机区间抽取，单维六连不重复', () => {
  let largest = [];
  for (const dimension of dimensions) {
    for (const rarity of rarities) {
      const pool = bucket(dimension, rarity);
      if (!pool.length) continue;
      uniformSampling.verifiedBuckets++;
      for (let index = 0; index < pool.length; index++) {
        for (const offset of [.01, .5, .99]) {
          assert.equal(game.pickScoredCard(pool, () => (index + offset) / pool.length).id, pool[index].id);
        }
        uniformSampling.verifiedCardIntervals++;
      }
      if (pool.length > largest.length) largest = pool;
    }
    const drawn = game.vr(bucket(dimension), 6);
    assert.equal(drawn.length, 6);
    assert.equal(new Set(Array.from(drawn, card => card.id)).size, 6);
    assert.ok(drawn.every(card => card.dimension === dimension));
  }
  const draws = 100000;
  const rng = randomFromSeed(seed + 1);
  const counts = new Map(largest.map(card => [card.id, 0]));
  for (let i = 0; i < draws; i++) {
    const card = game.pickScoredCard(largest, rng);
    counts.set(card.id, counts.get(card.id) + 1);
  }
  const expected = draws / largest.length;
  const chiSquare = [...counts.values()].reduce((sum, count) => sum + (count - expected) ** 2 / expected, 0);
  uniformSampling.randomSample = {
    dimension: largest[0].dimension, rarity: largest[0].rarity, cards: largest.length, draws,
    expectedPerCard: round(expected), minimumCount: Math.min(...counts.values()), maximumCount: Math.max(...counts.values()),
    chiSquare: round(chiSquare), degreesOfFreedom: largest.length - 1,
    counts: Object.fromEntries(counts),
  };
});

let threeHighThreeLow;
check('真实卡池三张UR/LR加三张C/UC不保证90分，覆盖可组成的维度分配', () => {
  const rng = randomFromSeed(seed + 2);
  const scores = [];
  const excludedDimensionAssignments = [];
  let eligibleDimensionAssignmentCount = 0;
  let lowest, highest;
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 5; b++) for (let c = b + 1; c < 6; c++) {
    const high = new Set([a, b, c]);
    const candidatePools = dimensions.map((dimension, index) => bucket(dimension).filter(card => high.has(index)
      ? rarities.indexOf(card.rarity) >= 5 : rarities.indexOf(card.rarity) <= 1));
    const unavailable = dimensions.flatMap((dimension, index) => candidatePools[index].length ? []
      : [{ dimension, requiredTiers: high.has(index) ? 'UR/LR' : 'C/UC' }]);
    if (unavailable.length) {
      excludedDimensionAssignments.push({ highDimensions: [...high].map(index => dimensions[index]), unavailable });
      continue;
    }
    eligibleDimensionAssignmentCount++;
    for (let sample = 0; sample < 100; sample++) {
      const drawn = candidatePools.map(pool => {
        return pool[Math.floor(rng() * pool.length)];
      });
      const scored = production(drawn);
      scores.push(scored.score);
      if (!lowest || scored.score < lowest.score || !highest || scored.score > highest.score) {
        const fixture = { score: scored.score, cards: drawn.map(card => ({ id: card.id, rarity: card.rarity, score: game.T(card) })) };
        if (!lowest || scored.score < lowest.score) lowest = fixture;
        if (!highest || scored.score > highest.score) highest = fixture;
      }
    }
  }
  scores.sort((a, b) => a - b);
  assert.ok(eligibleDimensionAssignmentCount > 0, '真实卡池至少须能组成一种三高三低组合');
  assert.equal(eligibleDimensionAssignmentCount + excludedDimensionAssignments.length, 20);
  assert.equal(scores.length, eligibleDimensionAssignmentCount * 100);
  assert.ok(scores[0] < 90, '三高三低不应被强制保送到90分');
  threeHighThreeLow = {
    definition: '3张UR/LR + 3张C/UC；枚举20种高档维度分配，对真实可组成的每种分配抽样100组，缺档组合单列',
    requestedDimensionAssignmentCount: 20, eligibleDimensionAssignmentCount,
    excludedDimensionAssignmentCount: excludedDimensionAssignments.length, excludedDimensionAssignments,
    seed: seed + 2, samples: scores.length,
    mean: round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
    p10: scores[Math.ceil(scores.length * .1) - 1], p50: scores[Math.ceil(scores.length * .5) - 1],
    p90: scores[Math.ceil(scores.length * .9) - 1], minimum: scores[0], maximum: scores.at(-1),
    atLeast80Percent: percent(scores.filter(score => score >= 80).length, scores.length),
    atLeast90Percent: percent(scores.filter(score => score >= 90).length, scores.length),
    capped100Percent: percent(scores.filter(score => score === 100).length, scores.length),
    lowestFixture: lowest, highestFixture: highest,
  };
});

if (process.argv.includes('--checks-only')) {
  process.stdout.write(JSON.stringify({ checks: checks.length, missingTiers, uniformSampling, threeHighThreeLow }, null, 2) + '\n');
  process.exit(0);
}

resetLoop();
simulationMath.random = randomFromSeed(seed);
const rng = randomFromSeed(seed);
const scores = [];
const actualByDimension = Object.fromEntries(dimensions.map(dimension => [dimension, blankRarities()]));
const bondTriggers = {};
const resonanceTriggers = blankRarities();
let total = 0, above80 = 0, above90 = 0, capped100 = 0, withBonds = 0, withResonance = 0, totalBonds = 0, totalResonance = 0;
let atLeastSSR = 0, atLeastUR = 0, atLeastLR = 0;
process.stdout.write(`Simulating ${sampleSize.toLocaleString('en-US')} actual drawMixPack + Xt calls…\n`);
const started = performance.now();
for (let pack = 0; pack < sampleSize; pack++) {
  const drawn = game.drawMixPack(game.activeCards, rng);
  assert.ok(drawn.every(card => activeIds.has(card.id)), '预留卡不得进入常驻抽取');
  const scored = game.Xt(drawn).scoring;
  assert.ok(scored && ['score', 'base', 'resonance', 'bonds'].every(field => Number.isInteger(scored[field])), `第 ${pack + 1} 包评分必须是整数`);
  scores.push(scored.score);
  total += scored.score;
  above80 += scored.score >= 80;
  above90 += scored.score >= 90;
  capped100 += scored.score === 100;
  withBonds += scored.bonds > 0;
  withResonance += scored.resonance > 0;
  totalBonds += scored.bonds;
  totalResonance += scored.resonance;
  atLeastSSR += rankedAtLeast(drawn, 'SSR');
  atLeastUR += rankedAtLeast(drawn, 'UR');
  atLeastLR += rankedAtLeast(drawn, 'LR');
  for (const card of drawn) actualByDimension[card.dimension][card.rarity]++;
  for (const bond of scored.bondDetails) bondTriggers[bond.id] = (bondTriggers[bond.id] || 0) + 1;
  for (const group of scored.resonanceDetails) resonanceTriggers[group.rarity]++;
}
const elapsedSeconds = round((performance.now() - started) / 1000, 2);
scores.sort((a, b) => a - b);
const percentile = p => scores[Math.ceil(scores.length * p) - 1];
const scoreHistogram = {};
for (const score of scores) scoreHistogram[String(score)] = (scoreHistogram[String(score)] || 0) + 1;
const toPercentages = counts => Object.fromEntries(Object.entries(counts).map(([key, count]) => [key, percent(count)]));
const report = {
  version: 'V43', seed, sampleSize, simulatedDate: '2026-11-12',
  formula: 'clamp(0,100,round(weightedMean) + resonance + bonds)；基础分四舍五入，同星使用整数表且最多7、羁绊最多8；普通五星10%、六星5%',
  htmlSha256: crypto.createHash('sha256').update(html).digest('hex'),
  scope: {
    source: '实际 index.html 内嵌闭包；仅替换末尾 UI 启动为测试导出',
    generator: 'drawMixPack(activeCards, seededRandom)', scorer: 'Xt(cards).scoring',
    includesHardPity: true, includesDailyGift: false, includesCollectionRewardChoice: false,
    simulationOnly: true, elapsedSeconds,
  },
  checks: { passed: checks.length, names: checks },
  cardCount: cards.length, activeCardCount: pool.length, reserveCardCount: cards.length - pool.length,
  activeRarityCounts: rarityCounts, activeDimensionCounts: dimensionCounts,
  requestedBaseRatesPercent: plain(game.y), missingTiers, effectiveBaseRatesPercent: effectiveBaseRates,
  score: {
    mean: round(total / sampleSize), p10: percentile(.1), p50: percentile(.5), p90: percentile(.9),
    atLeast80Percent: percent(above80), atLeast90Percent: percent(above90), capped100Percent: percent(capped100),
    minimum: scores[0], maximum: scores.at(-1), histogram: scoreHistogram,
  },
  packRarity: { atLeastSSRPercent: percent(atLeastSSR), atLeastURPercent: percent(atLeastUR), atLeastLRPercent: percent(atLeastLR) },
  actualRarityCountsByDimension: actualByDimension,
  actualRarityPercentByDimension: Object.fromEntries(dimensions.map(dimension => [dimension, toPercentages(actualByDimension[dimension])])),
  bonuses: {
    withBondsPercent: percent(withBonds), meanBonds: round(totalBonds / sampleSize),
    bondTriggerPercent: toPercentages(bondTriggers),
    withResonancePercent: percent(withResonance), meanResonance: round(totalResonance / sampleSize),
    resonanceTriggerPercent: toPercentages(resonanceTriggers),
  },
  fixtures: { oedipus: oedipusFixture, hamlet: hamletFixture, sameColor: sameColorFixtures, pity: pityFixtures },
  uniformSampling,
  threeHighThreeLow,
};
const destination = path.join(root, 'docs/BALANCE_REPORT.json');
fs.writeFileSync(destination, JSON.stringify(report, null, 2) + '\n');
process.stdout.write(JSON.stringify({ checks: checks.length, missingTiers, score: { ...report.score, histogram: undefined }, bonuses: report.bonuses, elapsedSeconds, report: destination }, null, 2) + '\n');
