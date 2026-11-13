const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { applyCopyOverridesV39 } = require('./copy-overrides-v39.js');
const { statRationaleV40 } = require('./stat-rationale-v40.js');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const rawCards = JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
const cards = structuredClone(rawCards);
const essays = JSON.parse(html.match(/const cardEssays\s*=\s*(\{[\s\S]*?\});/)[1]);
applyCopyOverridesV39(cards, essays);
const highCopy = JSON.parse(html.match(/const highStarCopyV40 = (\{[\s\S]*?\n\});/)[1]);
const highSources = JSON.parse(html.match(/const highStarSourceDataV40 = (\{[\s\S]*?\n\});/)[1]);
const manifest = read('docs/ACTIVE_CARDS_V39.json');
const anchors = read('docs/SCORING_ANCHORS.json');
const reviews = read('docs/REVIEW_PLAYS_V48.json');
const audits = Object.fromEntries(['PLAYS', 'ROLES', 'CRAFT', 'SPACES'].map(group => [group, read(`docs/FACT_AUDIT_${group}_V48.json`)]));
const get = id => { const card = cards.find(card => card.id === id); assert.ok(card, id); return card; };
const proseFields = ['note', 'blurb', 'plot', 'observe', 'why', 'stage', 'hook', 'with', 'action'];
const allText = id => {
  const card = get(id);
  return [...proseFields.map(field => card[field] || ''), essays[id] || '', ...(highCopy[id] || []), card.review?.rationale || ''].join('\n');
};

test('实际启动校验接受完整问句、感叹句和引号，拒绝残句与非文本', () => {
  const validator = html.match(/function ge\(text,min\)\{[^}]*\}/);
  assert.ok(validator, '必须测试index中实际调用的ge，不能另造验证器');
  const complete = vm.runInNewContext(`(${validator[0]})`);
  for (const text of ['人物选择留下。', '他可以替别人决定吗？', '这次终于等到了！', '她问：“为什么？”', '他回答：「我愿意。」', '他说：『别走！』', '  问题仍然存在？  ']) {
    assert.equal(complete(text, 1), true, text);
  }
  for (const text of ['愿望和阻力之间', '他还没有回答，', '「话没说完」', '', '   ', null, undefined, 42]) {
    assert.equal(complete(text, 1), false, String(text));
  }
  assert.equal(complete('好。', 3), false, '最小长度要求仍然生效');
  for (const [label, pool] of [['原始', rawCards], ['运行', cards]]) {
    for (const card of pool) {
      for (const field of ['blurb', 'why', 'hook', 'with']) assert.equal(complete(card[field], 1), true, `${label} ${card.id}.${field}`);
    }
  }
});

test('四类审计恰好覆盖500张常驻卡，阅读与外部核验范围分别记录', () => {
  const counts = { PLAYS: 100, ROLES: 185, CRAFT: 150, SPACES: 65 };
  const dimensions = { PLAYS: ['剧目'], ROLES: ['主演', '配角'], CRAFT: ['导演手法', '风格体系'], SPACES: ['环境'] };
  const covered = [];
  for (const [group, audit] of Object.entries(audits)) {
    assert.equal(audit.coveredIds.length, counts[group], group);
    assert.equal(new Set(audit.coveredIds).size, counts[group], group);
    assert.ok(audit.scope, group);
    for (const id of audit.coveredIds) {
      assert.ok(dimensions[group].includes(get(id).dimension), `${group}: ${id}`);
      covered.push(id);
    }
    assert.equal(new Set(audit.evidenceCheckedIds).size, audit.evidenceCheckedIds.length, group);
    for (const id of audit.evidenceCheckedIds) assert.ok(audit.coveredIds.includes(id), `${group}: evidence ${id}`);
    assert.ok(audit.evidenceCheckedIds.length < audit.coveredIds.length, `${group}: 不把通读冒充逐卡文献认证`);
    for (const item of [...audit.corrections, ...(audit.latentRawIssues || [])]) assert.ok(audit.coveredIds.includes(item.id), `${group}: correction ${item.id}`);
    const sources = Array.isArray(audit.sources) ? audit.sources : Object.values(audit.sources || {});
    const sourceIds = new Set(sources.map(source => source.id).filter(Boolean).concat(Object.keys(Array.isArray(audit.sources) ? {} : audit.sources || {})));
    for (const item of audit.corrections) {
      for (const id of item.sourceIds || []) assert.ok(sourceIds.has(id), `${group}/${item.id}: missing source ${id}`);
    }
    const evidenceSources = (audit.evidence || []).flatMap(item => item.sources || []);
    for (const source of [...sources, ...evidenceSources]) {
      assert.ok(source.title && /^https?:\/\//.test(source.url), `${group}: malformed source`);
    }
  }
  assert.equal(covered.length, 500);
  assert.equal(new Set(covered).size, 500);
  assert.deepEqual(covered.sort(), [...manifest.activeIds].sort());
});

test('六剧复评分、稀有度和来源落到运行数据，未只修改审计文件', () => {
  const expected = {
    'play-rhino': [94, 90, 'LR'], 'play-secret': [90, 94, 'LR'],
    'v23-play-busstop': [86, 90, 'UR'], 'v23-play-dreamlike': [94, 90, 'LR'],
    'yplay-jiang': [86, 90, 'UR'], 'v23-play-livefield': [90, 90, 'LR'],
  };
  assert.deepEqual(reviews.cards.map(card => card.id).sort(), Object.keys(expected).sort());
  for (const review of reviews.cards) {
    const card = get(review.id), detail = statRationaleV40(card);
    assert.deepEqual([card.atk, card.def, card.rarity], expected[card.id], card.id);
    assert.equal(detail.basisMode, 'documented-rubric', card.id);
    for (const axis of ['atk', 'def']) {
      assert.equal(card[axis], 50 + 4 * review[`${axis}Rubric`].reduce((sum, value) => sum + value, 0), card.id);
      assert.equal(detail[axis].reason, review[`${axis}Reason`], card.id);
    }
    assert.deepEqual(card.review.sourceIds, review.sourceIds, card.id);
    for (const id of review.sourceIds) {
      const source = reviews.sources[id];
      assert.ok(source?.url, `${card.id}: ${id}`);
      assert.equal(anchors.sources[id]?.url, source.url, id);
      assert.ok((highSources[card.id] || []).some(item => item.url === source.url), `${card.id}: 展开来源缺失 ${id}`);
    }
  }
  assert.equal(Math.round((get('v23-play-dreamlike').atk + get('v23-play-dreamlike').def) / 2), 92);
});

test('已发布的正文覆盖和高星扩写都保留经过核实的主创、人物及版本区别', () => {
  const source = fs.readFileSync(path.join(root, 'scripts/copy-overrides-v39.js'), 'utf8');
  assert.ok(html.includes(source.trim()), 'index里的后置覆盖必须与已测试模块同步');
  assert.match(get('play-rhino').note, /廖一梅.*孟京辉.*1999/);
  assert.match(get('play-secret').note, /赖声川.*共同构思/);
  assert.match(get('v23-play-livefield').note, /萧红.*田沁鑫/);
  assert.match(get('v23-play-livefield').note, /改编|重新组织/);
  assert.match((highCopy['play-rhino'] || []).join(''), /明明.*不爱自己的自由|明明.*感情/);
  assert.match((highCopy['play-secret'] || []).join(''), /剧中的外层行动/);
  assert.doesNotMatch((highCopy['play-secret'] || []).join(''), /观众眼前真实发生/);
  assert.match((highCopy['v23-play-dreamlike'] || []).join(''), /顾香兰/);
  assert.match((highCopy['v23-play-livefield'] || []).join(''), /赵三.*二里半.*金枝.*成业/);
});

test('车站经过不停、五号病人和女医生的关键事实在正文及别名中不倒退', () => {
  assert.match(get('v23-play-busstop').note, /(?:经过|驶过).{0,12}不停/);
  assert.match(get('v23-play-dreamlike').note, /五号病人/);
  assert.match(get('v23-role-dreamdoctor').note, /女医生/);
  assert.match(get('v23-role-silentman').note, /步行/);
  assert.match(get('v23-sup-stationmaster').note, /供销社/);
  for (const id of ['v23-play-dreamlike', 'v23-role-dreamdoctor']) {
    assert.doesNotMatch(allText(id), /五个情人|五段爱情|环湖倾听|年轻男医生/, id);
  }
  assert.doesNotMatch(allText('v23-sup-stationmaster'), /对班车时刻胸有成竹|不断更正站牌上的数字/);
  assert.doesNotMatch(allText('v23-role-silentman'), /始终坐在时刻表下方/);
  for (const id of ['v23-role-dreamdoctor', 'v23-role-silentman']) {
    const raw = rawCards.find(card => card.id === id);
    const text = proseFields.map(field => raw[field] || '').join('\n');
    assert.doesNotMatch(text, /五段爱情|环湖倾听|始终坐在时刻表下方/, `${id}: 原始别名仍携带旧事实`);
  }
});

test('补正明确升官图两个职务、波莉之父和哥本哈根第三位人物', () => {
  assert.match(get('yplay-promotion').note, /分别.*知县.*秘书长/);
  assert.match(get('yplay-threepenny').note, /波莉的父亲.*皮丘姆/);
  assert.match(get('yplay-threepenny').note, /豪普特曼.*乞丐歌剧/);
  assert.match(get('v23-play-copenhagen').note, /玛格丽特.*(?:亡灵|灵魂)/);
  assert.match(get('v23-play-copenhagen').note, /史实.*想象/);
});

test('独立知识说明保留车站核心事实，故事与当前六卡资料明确分开并去重', () => {
  const source = fs.readFileSync(path.join(root, 'scripts/talk-v39.js'), 'utf8');
  assert.ok(html.replace(/\r/g, '').includes(source.replace(/\r/g, '').trim()), '测试的联想脚本必须已经内联发布');
  const drawn = ['v23-play-busstop', 'style-absurd', 'dir-freeze', 'v23-role-silentman', 'v23-sup-stationmaster', 'place-zoo'].map(get);
  const requested = [];
  const context = vm.createContext({
    highStarSourcesV40(card) {
      requested.push(card.id);
      const sources = highSources[card.id] || [];
      // 重复返回一个真实来源，确保同卡和跨卡的重合都不会重复显示。
      return sources.length ? [...sources, sources[0]] : [];
    },
  });
  vm.runInContext(source, context);
  const paragraphs = context.nn(drawn);
  const reading = context.theatreReadingV40(context.sceneContextV40(drawn));
  assert.ok(reading.includes(drawn[0].note), '独立知识说明必须保留完整的当前剧目核心介绍');
  assert.match(reading, /(?:经过|驶过).{0,12}不停/);
  assert.ok(!paragraphs.some(text => text.startsWith('戏剧线索：')), '原作科普不冒充虚构故事的结局');
  assert.match(paragraphs[0], /虚构/, '联想事件不能伪装成原剧情');
  const references = context.talkReferencesV40(drawn);
  assert.deepEqual(requested, drawn.map(card => card.id));
  const urls = references.map(reference => reference.url);
  assert.equal(urls.length, new Set(urls).size, '来源按URL去重');
  const expected = new Set(drawn.flatMap(card => (highSources[card.id] || []).map(reference => reference.url)));
  expected.add('https://www.bushtheatre.co.uk/news/student-guide-to-playwriting-scenes/');
  assert.deepEqual(new Set(urls), expected, '不能混入未抽到的卡片来源');
  assert.ok(references.some(reference => reference.kind === '卡片资料'));
  assert.ok(references.some(reference => reference.kind === '写作方法'));
});
