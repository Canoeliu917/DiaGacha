const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { highStarNotesV40, highStarSourcesV40, highStarSentencesV40 } = require('./high-star-copy-v40.js');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const startup = 'Zn.addEventListener(`click`,Tr),Er()';
assert.equal(html.split(startup).length, 2);
const sandbox = {
  console, URL, URLSearchParams, Intl, navigator: {},
  localStorage: { getItem: () => null, setItem() {} }, sessionStorage: { getItem: () => null, setItem() {} },
  document: { querySelector: () => ({}), getElementById: () => null },
  location: { href: 'https://example.invalid/', protocol: 'https:', hash: '', search: '', pathname: '/' },
  matchMedia: () => ({ matches: false }),
};
sandbox.window = sandbox;
const context = vm.createContext(sandbox);
for (const block of html.replace(startup, 'globalThis.fixture={activeCards,cardEssays}').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) vm.runInContext(block[1], context, { timeout: 10000 });
const { activeCards, cardEssays } = context.fixture;
const tiers = { SSR: { paragraphs: 1, sentences: 3 }, UR: { paragraphs: 2, sentences: 5 }, LR: { paragraphs: 3, sentences: 7 } };
const high = Array.from(activeCards).filter(card => tiers[card.rarity]);

test('500常驻中的189高星全覆盖，正文按五星六星七星逐层增加', () => {
  assert.equal(activeCards.length, 500);
  assert.equal(high.length, 189);
  const counts = { SSR: 0, UR: 0, LR: 0 }, lengths = { SSR: [], UR: [], LR: [] };
  for (const card of high) {
    const paragraphs = highStarNotesV40(card), minimum = tiers[card.rarity];
    assert.ok(paragraphs.length >= minimum.paragraphs, `${card.id}: ${paragraphs.length} paragraphs`);
    const existing = highStarSentencesV40(card.note + card.observe);
    const extra = paragraphs.flatMap(highStarSentencesV40);
    assert.ok(existing.length + extra.length >= minimum.sentences, `${card.id}: ${existing.length + extra.length} sentences`);
    for (const paragraph of paragraphs) {
      assert.ok(paragraph.length >= 24, `${card.id}: paragraph too short`);
      assert.match(paragraph, /[。！？!?][”’」』）)]*$/);
      assert.doesNotMatch(paragraph, /<[^>]+>|高星卡|稀有度|排演关键词|这一张.*上场/);
    }
    counts[card.rarity]++;
    lengths[card.rarity].push(paragraphs.join('').length);
  }
  assert.deepEqual(counts, { SSR: 105, UR: 56, LR: 28 });
  const mean = tier => lengths[tier].reduce((sum, value) => sum + value, 0) / lengths[tier].length;
  assert.ok(mean('UR') > mean('SSR'));
  assert.ok(mean('LR') > mean('UR'));
});

test('额外段落不复读note或observe，不靠跨卡相同套句填充', () => {
  const seen = new Map();
  for (const card of high) {
    const existing = new Set(highStarSentencesV40(card.note + card.observe));
    const extras = highStarNotesV40(card).flatMap(highStarSentencesV40);
    assert.equal(new Set(extras).size, extras.length, card.id);
    for (const sentence of extras) {
      assert.ok(!existing.has(sentence), `${card.id}: repeats original sentence`);
      assert.ok(!seen.has(sentence), `${card.id} repeats ${seen.get(sentence)}: ${sentence}`);
      seen.set(sentence, card.id);
    }
  }
});

test('阿伽门农剧目以七星三段介绍紫毯、卡珊德拉和开放结尾，来源与同名角色分开', () => {
  const card = high.find(card => card.id === 'yplay-agamemnon');
  assert.ok(card);
  assert.equal(card.dimension, '剧目');
  assert.equal(card.rarity, 'LR');
  const paragraphs = highStarNotesV40(card), text = paragraphs.join('');
  assert.equal(paragraphs.length, 3);
  assert.ok(highStarSentencesV40(text).length >= 7);
  for (const phrase of ['烽火报捷', '紫色织物', '卡珊德拉', '戏剧反讽', '歌队', '开放结尾']) assert.ok(text.includes(phrase), phrase);
  const sources = highStarSourcesV40(card);
  assert.equal(sources.length, 3);
  assert.ok(sources.some(source => source.url === 'https://classics.mit.edu/Aeschylus/agamemnon.html'));
  assert.ok(sources.some(source => source.url.startsWith('https://people.duke.edu/')));
  const role = high.find(card => card.id === 'role2-agamemnon');
  assert.ok(role);
  assert.notDeepEqual(highStarNotesV40(role), paragraphs);
});

test('艾尔西诺明确城垛内室厅堂的可见性，并区别现实Kronborg', () => {
  const card = high.find(card => card.id === 'place-elsinore');
  const paragraphs = highStarNotesV40(card), text = paragraphs.join('');
  for (const phrase of ['城垛守夜', '帷幕后偷听', '戏中戏', '谁能看见谁', 'Kronborg', '现存房间', '排演时可以']) assert.ok(text.includes(phrase), phrase);
  assert.ok(paragraphs.length >= 2);
  assert.ok(highStarSentencesV40(card.note + card.observe + text).length >= 5);
  const sources = highStarSourcesV40(card);
  assert.equal(sources.length, 2);
  assert.ok(sources.some(source => source.url.startsWith('https://www.folger.edu/')));
  assert.ok(sources.some(source => source.url.startsWith('https://kronborg.dk/')));
});

test('新事实有独立来源，方法分析与排演建议保持区分', () => {
  const globe = high.find(card => card.id === 'yplace-globe');
  const text = highStarNotesV40(globe).join('');
  assert.ok(text.includes('1599') && text.includes('1997') && text.includes('并非同一座'));
  assert.ok(highStarSourcesV40(globe).some(source => source.url.includes('shakespearesglobe.com')));
  const stan = high.find(card => card.id === 'style-stan');
  const paragraphs = highStarNotesV40(stan);
  assert.ok(paragraphs[2].startsWith('排演时可以'));
  assert.ok(paragraphs.join('').includes('同一句话') && paragraphs.join('').includes('对方'));
  for (const card of high) for (const source of highStarSourcesV40(card)) {
    assert.ok(source.title && new URL(source.url).protocol === 'https:');
  }
});

test('接口只返回独立纯文本段落，低星不扩写且不会修改输入', () => {
  const card = high[0], before = JSON.stringify(card), first = highStarNotesV40(card);
  first[0] = 'changed';
  assert.notEqual(highStarNotesV40(card)[0], 'changed');
  assert.equal(JSON.stringify(card), before);
  for (const low of activeCards.filter(card => !tiers[card.rarity])) assert.deepEqual(highStarNotesV40(low), []);
  assert.deepEqual(highStarNotesV40(null), []);
  const sourceCard = high.find(card => card.id === 'place-elsinore'), sources = highStarSourcesV40(sourceCard);
  sources[0].title = 'changed';
  assert.notEqual(highStarSourcesV40(sourceCard)[0].title, 'changed');
});

test('揭晓介绍可读新增正文，七星无需再用标签句填空', () => {
  const revealContext = vm.createContext({ cardEssays, highStarNotesV40 });
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'reveal-v40.js'), 'utf8'), revealContext);
  for (const card of high) {
    const lines = revealContext.preambleLines(card);
    assert.equal(lines.length, { SSR: 4, UR: 5, LR: 6 }[card.rarity]);
    assert.ok(lines.every(line => !line.includes('排演关键词是')));
    assert.ok(lines.every(line => /[。！？!?][”’」』）)]*$/.test(line)));
  }
});
