const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { statRationaleV40 } = require('./stat-rationale-v40.js');
const { applyCopyOverridesV39 } = require('./copy-overrides-v39.js');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cards = JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
const stored = read('docs/cards.json');
const manifest = read('docs/ACTIVE_CARDS_V39.json');
const anchors = read('docs/SCORING_ANCHORS.json');
const reviews = ['PLAYS', 'ROLE_CRAFT', 'FAUST'].flatMap(name => read(`docs/REVIEW_${name}_V43.json`).cards);
const cardMap = new Map(cards.map(card => [card.id, card]));
const anchorMap = new Map(anchors.cards.map(card => [card.id, card]));
const axisScore = values => 50 + 4 * values.reduce((sum, value) => sum + value, 0);

test('777张数据与运行页攻防档位同步，500常驻及277预留完整分区', () => {
  assert.equal(cards.length, 777);
  assert.equal(cardMap.size, 777);
  assert.equal(stored.length, 777);
  assert.equal(manifest.activeIds.length, 500);
  assert.equal(manifest.reserveIds.length, 277);
  const partition = [...manifest.activeIds, ...manifest.reserveIds];
  assert.equal(new Set(partition).size, 777);
  assert.deepEqual(partition.slice().sort(), [...cardMap.keys()].sort());
  for (const record of stored) {
    const card = cardMap.get(record.id), score = Math.round((card.atk + card.def) / 2);
    const tier = score >= 90 ? 'LR' : score >= 84 ? 'UR' : score >= 78 ? 'SSR' : score >= 72 ? 'SR' : score >= 66 ? 'R' : score >= 60 ? 'UC' : 'C';
    assert.deepEqual([record.atk, record.def, record.rarity], [card.atk, card.def, card.rarity], card.id);
    assert.equal(record.score, score, card.id);
    assert.equal(card.rarity, tier, card.id);
  }
});

test('74个锚点均能算回当前两轴，新41张复核和来源已应用而非只改收藏等级', () => {
  assert.equal(anchors.cards.length, 74);
  assert.equal(anchorMap.size, 74);
  assert.equal(reviews.length, 41);
  assert.equal(new Set(reviews.map(review => review.id)).size, 41);
  for (const anchor of anchors.cards) {
    const card = cardMap.get(anchor.id);
    assert.ok(card, anchor.id);
    for (const axis of ['atk', 'def']) {
      const values = anchor[`${axis}Rubric`];
      assert.equal(values.length, 3, anchor.id);
      assert.ok(values.every(value => Number.isInteger(value) && value >= 0 && value <= 4), anchor.id);
      assert.equal(card[axis], axisScore(values), `${anchor.id}.${axis}`);
      assert.deepEqual(card.review[`${axis}Rubric`], values, anchor.id);
    }
    assert.equal(card.review.status, '有来源的编辑复评', anchor.id);
    assert.ok(anchor.sourceIds.length > 0, anchor.id);
    for (const id of anchor.sourceIds) {
      const source = anchors.sources[id];
      assert.ok(source?.title && /^https?:\/\//.test(source.url), `${anchor.id}: ${id}`);
    }
  }
  for (const review of reviews) {
    const anchor = anchorMap.get(review.id), card = cardMap.get(review.id);
    assert.ok(anchor, review.id);
    assert.equal(card.review.rationale, review.rationale, review.id);
    assert.equal(card.review.reference, review.reference, review.id);
    assert.deepEqual(card.review.sourceIds, review.sourceIds, review.id);
    assert.deepEqual(anchor.atkRubric, review.atkRubric, review.id);
    assert.deepEqual(anchor.defRubric, review.defRubric, review.id);
  }
});

test('新复评短理由与展开子项、来源同卡一致，500常驻介绍及全部角色来源保留', () => {
  applyCopyOverridesV39(cards, {});
  for (const review of reviews) {
    const card = cardMap.get(review.id), detail = statRationaleV40(card);
    assert.equal(detail.basisMode, 'documented-rubric', card.id);
    assert.equal(detail.needsReview, false, card.id);
    for (const axis of ['atk', 'def']) {
      assert.equal(detail[axis].reason, review[`${axis}Reason`], `${card.id}.${axis}`);
      assert.deepEqual(detail[axis].criteria.map(item => item.score), review[`${axis}Rubric`], card.id);
      assert.ok(detail[axis].reason.length < 150, `${card.id}: 简短轴理由`);
      assert.notEqual(detail[axis].reason, card.note, card.id);
    }
    for (const id of review.sourceIds) assert.ok(detail.sources.some(source => source.id === id && source.url === anchors.sources[id].url), `${card.id}: ${id}`);
  }
  for (const id of manifest.activeIds) {
    const card = cardMap.get(id);
    for (const field of ['note', 'observe']) assert.ok(card[field] && /[。！？]$/.test(card[field]), `${id}.${field}`);
  }
  const roleSources = new Map(read('docs/ROLE_SOURCES_V39.json').cards.map(source => [source.id, source]));
  const roles = cards.filter(card => ['主演', '配角'].includes(card.dimension));
  assert.equal(roles.length, 260);
  for (const role of roles) assert.ok(roleSources.get(role.id)?.sourcePlayLabel, `${role.id}: 原作来源`);
});
