const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { applyCopyOverridesV39 } = require('./copy-overrides-v39.js');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sandbox = {
  console, URL, URLSearchParams, Intl, navigator: {},
  localStorage: { getItem: () => null, setItem() {} },
  sessionStorage: { getItem: () => null, setItem() {} },
  document: { querySelector: () => ({}), getElementById: () => null },
  location: { href: 'https://example.invalid/', protocol: 'https:', hash: '', search: '', pathname: '/' },
  matchMedia: () => ({ matches: true }),
};
sandbox.window = sandbox;
const context = vm.createContext(sandbox);
const startup = 'Zn.addEventListener(`click`,Tr),Er()';
assert.equal(html.split(startup).length, 2);
const script = html.replace(startup, 'globalThis.game={e,activeCards,roleSourcesV39,cardEssays,K,xn}');
for (const block of script.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) vm.runInContext(block[1], context, { timeout: 10000 });
const game = context.game;
applyCopyOverridesV39(game.e, game.cardEssays);
const render = card => game.xn(card);
const lowCards = game.activeCards.filter(card => ['C', 'UC', 'R', 'SR'].includes(card.rarity));

test('500张常驻卡详情保留全部核心释义与看点，低星不按字数或句数截断', () => {
  assert.equal(game.activeCards.length, 500);
  assert.equal(lowCards.length, 311);
  for (const card of game.activeCards) {
    const detail = render(card);
    for (const text of [card.note, card.observe]) {
      assert.ok(text && /[。！？]$/.test(text), card.id);
      assert.ok(detail.includes(game.K(text)), `${card.id}: full introduction`);
    }
    if (lowCards.includes(card) && game.cardEssays[card.id]) {
      assert.ok(detail.includes(game.K(game.cardEssays[card.id])), `${card.id}: existing essay`);
    }
    assert.doesNotMatch(detail, /看懂这张卡|收回到。|undefined|\[object Object\]/, card.id);
  }
  // The low-star text is not shortened even when a single sentence is long.
  const long = '同一个决定在不同处境下会有不同后果，'.repeat(30) + '人物必须承担自己的选择。';
  const base = lowCards.find(card => card.rarity === 'C');
  const detail = render({ ...base, note: long, observe: '这是一句独立的观察。' });
  assert.ok(detail.includes(game.K(long)));
});

test('所有常驻主配角在详情中保留原作来源，低星人物不只剩抽象性格', () => {
  const roles = game.activeCards.filter(card => ['主演', '配角'].includes(card.dimension));
  assert.ok(roles.length > 0);
  for (const card of roles) {
    const source = game.roleSourcesV39[card.id];
    assert.ok(source?.sourcePlayLabel, card.id);
    const detail = render(card);
    assert.ok(detail.includes('role-source'), card.id);
    assert.ok(detail.includes(game.K(source.sourcePlayLabel)), card.id);
    assert.ok(detail.includes(game.K(card.note)), card.id);
  }
  const serge = game.activeCards.find(card => card.id === 'v23-role-serge');
  assert.match(render(serge), /《艺术》/);
  assert.match(serge.note, /买下白画.*友情/);
  const silent = game.activeCards.find(card => card.id === 'v23-role-silentman');
  assert.match(silent.note, /《车站》.*先于其他人离开站牌.*步行/);
});

test('基础空间先说明其实际用途，再说明戏剧作用，不用隐喻代替定义', () => {
  const definitions = {
    'xplace-grave': /安葬.*追思/,
    'yplace-deck': /船上.*平台.*露天甲板的场景/,
    'yplace-cliff': /陡峭山崖.*高差.*通路/,
    'xplace-attic': /屋顶之下.*储物或居住/,
    'xplace-shrine': /供奉神明.*宗教仪式/,
    'yplace-jindian': /朝会.*宫廷殿堂/,
    'yplace-chengmen': /城墙.*通道/,
    'yplace-gongtang': /官署.*审理案件.*厅堂/,
    'place-baihua': /园林.*亭子.*这张卡采用/,
    'xplace-ancestral': /家族祭祀祖先.*宗族活动/,
    'xplace-convent': /共同生活与修行.*具体制度随传统而不同/,
    'xplace-balcony': /建筑外墙.*平台/,
    'yplace-fachang': /执行死刑的场所/,
    'yplace-zhongjun': /军营.*指挥、议事/,
    'place-v21-archive': /保存、整理与查阅档案/,
  };
  for (const [id, definition] of Object.entries(definitions)) {
    const card = game.activeCards.find(card => card.id === id);
    assert.ok(card, id);
    assert.match(card.note, definition, id);
  }
  assert.doesNotMatch(game.activeCards.find(card => card.id === 'yplace-cliff').note, /只能前进或后退/);
  assert.doesNotMatch(game.activeCards.find(card => card.id === 'yplace-chengmen').note, /必须经过的口/);
});
