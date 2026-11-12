const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const startup = 'Zn.addEventListener(`click`,Tr),Er()';
assert.equal(html.split(startup).length, 2);
const context = vm.createContext({
  console, URL, URLSearchParams, Intl, navigator: {},
  localStorage: { getItem: () => null, setItem() {} }, sessionStorage: { getItem: () => null, setItem() {} },
  document: { querySelector: () => ({}), getElementById: () => null },
  location: { href: 'https://example.invalid/', protocol: 'https:', hash: '', search: '', pathname: '/' },
  matchMedia: () => ({ matches: true }),
});
context.window = context;
for (const block of html.replace(startup, 'globalThis.fixture={e,activeCards,roleSourcesV39,ar,Vn,Un,xn,nn,talkSourcesV40,productionScore,productionCuesV40,scoreBreakdown}').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
  vm.runInContext(block[1], context, { timeout: 10000 });
}
const game = context.fixture;
const names = {
  'yrole-hamm': ['汉姆', '终局'],
  'role2-andrei-three-sisters': ['安德烈', '三姐妹'],
  'role2-mayor-inspector': ['市长', '钦差大臣'],
  'role2-boris-storm': ['鲍里斯', '大雷雨'],
  'role2-jean-rhinoceros': ['让', '犀牛'],
  'role2-claire-maids': ['克莱尔', '女仆'],
  'role2-heizi-signal': ['黑子', '绝对信号'],
  'role-v21-margueritecamellia': ['玛格丽特', '茶花女'],
  'role-v21-tomglass': ['汤姆', '玻璃动物园'],
  'role-v21-jimglass': ['吉姆', '玻璃动物园'],
  'v23-role-alan': ['艾伦', '恋马狂'],
  'v23-role-jinzhi': ['金枝', '生死场'],
  'v23-sup-marie': ['玛丽', '沃伊采克'],
  'v23-sup-catherine': ['凯瑟琳', '桥头眺望'],
  'v23-sup-nurse': ['护士', '恋马狂'],
  'v23-sup-zhaosan': ['赵三', '生死场'],
  'v23-sup-stationmaster': ['马主任', '车站'],
  'v23-sup-marc': ['马克', '艺术'],
};
const get = id => { const card = game.e.find(item => item.id === id); assert.ok(card, id); return card; };
const plain = value => JSON.parse(JSON.stringify(value));
const dimensions = ['剧目', '风格体系', '导演手法', '主演', '配角', '环境'];
const cast = selected => dimensions.map(dimension => selected[dimension] ? get(selected[dimension]) : game.activeCards.find(card => card.dimension === dimension));

test('18个唯一角色简称在运行页及持久数据一致，15常驻3预留且出处未省略', () => {
  const stored = new Map(read('docs/cards.json').map(card => [card.id, card]));
  const sources = new Map(read('docs/ROLE_SOURCES_V39.json').cards.map(card => [card.id, card]));
  const activeIds = new Set(game.activeCards.map(card => card.id));
  assert.equal(Object.keys(names).filter(id => activeIds.has(id)).length, 15);
  assert.equal(Object.keys(names).length, 18);
  for (const [id, [name, title]] of Object.entries(names)) {
    const card = get(id), source = sources.get(id), runtimeSource = game.roleSourcesV39[id];
    assert.equal(card.name, name, id);
    assert.equal(stored.get(id).name, name, id);
    assert.equal(source.name, name, id);
    assert.deepEqual(plain(runtimeSource), source, id);
    assert.ok(source.sourceTitles.includes(title), id);
    assert.ok(source.sourcePlayLabel.includes(`《${title}》`), id);
    const detail = game.xn(card);
    assert.ok(detail.includes(source.sourcePlayLabel), `${id}: 详情来源`);
    assert.ok(detail.includes('role-source'), id);
  }
  assert.equal(get('role2-juliet-nurse').name, '乳母（朱丽叶）');
  assert.equal(get('role2-medea-nurse').name, '美狄亚的乳母');
  assert.equal(get('v23-role-dreamdoctor').name, '如梦之梦的医生');
  const roleNames = game.e.filter(card => ['主演', '配角'].includes(card.dimension)).map(card => card.name);
  assert.equal(new Set(roleNames).size, roleNames.length, '包括隐藏卡在内的角色名保持可区分');
});

test('实际演后谈以金枝和凯瑟琳简称叙事，独立来源行完整保留两部作品', () => {
  const drawn = cast({ 剧目: 'v23-play-livefield', 主演: 'v23-role-jinzhi', 配角: 'v23-sup-catherine' });
  const story = game.nn(drawn).join('');
  assert.ok(story.includes('金枝') && story.includes('凯瑟琳'));
  assert.doesNotMatch(story, /金枝[（(]生死场|凯瑟琳[（(]桥头眺望/);
  const sources = game.talkSourcesV40(drawn);
  assert.ok(sources.includes('金枝：《生死场》'));
  assert.ok(sources.includes('凯瑟琳：《桥头眺望》'));
  const markup = game.Un({ ...game.ar(), drawn, fromShare: true, talkOpen: true });
  assert.ok(markup.includes(sources), '实际节目单保留完整原作说明');
  assert.doesNotMatch(markup, /金枝[（(]生死场|凯瑟琳[（(]桥头眺望/);
});

test('实际同作羁绊和卡组总览使用简称，关联卡仍由原ID与作品ID确定', () => {
  const drawn = cast({ 剧目: 'v23-play-livefield', 主演: 'v23-role-jinzhi', 配角: 'v23-sup-zhaosan' });
  const result = game.productionScore(drawn), cues = game.productionCuesV40(result, drawn);
  const pair = cues.find(cue => cue.id === 'bond-lead-support');
  assert.ok(pair);
  assert.deepEqual(plain(pair.cardIds).sort(), ['v23-role-jinzhi', 'v23-sup-zhaosan']);
  const bonus = game.scoreBreakdown(result, drawn, true);
  assert.ok(bonus.includes('关联卡牌：金枝、赵三。'));
  assert.doesNotMatch(bonus, /(?:金枝|赵三)[（(]生死场/);
  const markup = game.Vn({ ...game.ar(), drawn, pack: 'mix', booster: { cards: drawn, phase: 'spread' } });
  assert.ok(markup.includes('data-id="v23-role-jinzhi"'));
  assert.ok(markup.includes('data-id="v23-sup-zhaosan"'));
  assert.doesNotMatch(markup, /(?:金枝|赵三)[（(]生死场/);
});

test('Python简称规则保留重名和人物关系括注，只去除精确作品后缀且兼容中英文括号', () => {
  const cases = [
    ['cn', '主演', '金枝（生死场）', ['生死场']],
    ['en', '配角', '马克(艺术)', ['艺术']],
    ['same-a', '主演', '安娜（甲剧）', ['甲剧']],
    ['same-b', '配角', '安娜（乙剧）', ['乙剧']],
    ['bare', '主演', '让', []],
    ['same-bare', '配角', '让（犀牛）', ['犀牛']],
    ['relation', '配角', '乳母（朱丽叶）', ['罗密欧与朱丽叶']],
    ['identity', '主演', '如梦之梦的医生', ['如梦之梦']],
    ['not-role', '导演手法', '对白（示例）', ['示例']],
  ];
  const cards = cases.map(([id, dimension, name]) => ({ id, dimension, name }));
  const sources = Object.fromEntries(cases.map(([id, , , sourceTitles]) => [id, { sourceTitles }]));
  const code = "import json,runpy,sys; m=runpy.run_path('scripts/compact-role-names-v44.py'); x=json.load(sys.stdin); before=json.dumps(x,ensure_ascii=False); names=m['compact_names'](x['cards'],x['sources']); assert before==json.dumps(x,ensure_ascii=False); print(json.dumps(names,ensure_ascii=False))";
  const run = spawnSync('python', ['-X', 'utf8', '-c', code], { cwd: root, input: JSON.stringify({ cards, sources }), encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(JSON.parse(run.stdout), { cn: '金枝', en: '马克' });
});
