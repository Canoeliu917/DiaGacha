const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { statRationaleV40 } = require('./stat-rationale-v40.js');
const { applyCopyOverridesV39 } = require('./copy-overrides-v39.js');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cards = JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
applyCopyOverridesV39(cards, {});
const activeIds = new Set(JSON.parse(fs.readFileSync(path.join(root, 'docs/ACTIVE_CARDS_V39.json'), 'utf8')).activeIds);
const anchors = JSON.parse(fs.readFileSync(path.join(root, 'docs/SCORING_ANCHORS.json'), 'utf8'));
const get = id => { const card = cards.find(card => card.id === id); assert.ok(card, id); return card; };

test('独白直给保留六星88分，分别说明内心行动与方法成熟，不把独白当成静止或自动满分', () => {
  const card = get('dir-solo'), result = statRationaleV40(card);
  assert.equal(card.rarity, 'UR');
  assert.equal(result.atk.value, 86);
  assert.equal(result.def.value, 90);
  assert.equal(Math.round((card.atk + card.def) / 2), 88);
  assert.match(result.atk.reason, /哈姆雷特.*思考和迟疑也属于行动/);
  assert.match(result.atk.reason, /具体文本与前后事件.*不因面向观众就自动满分/);
  assert.match(result.def.reason, /公开言行与内心想法的差距.*90 分/);
  assert.match(result.def.reason, /方法成熟不等于每次演出都自然有效/);
  assert.doesNotMatch(result.atk.reason + result.def.reason, /现有卡片写到：|卡片给出的排演示例是：/);
  assert.ok(result.sources.some(source => source.url === 'https://www.rsc.org.uk/hamlet/'));
  assert.equal(result.basisMode, 'documented-rubric');
});

test('68/95两张剧目分别用具体剧情解释冲突与结构的差别，不从星级倒推', () => {
  const krapp = statRationaleV40(get('yplay-krapp'));
  assert.equal(krapp.atk.value, 68);
  assert.equal(krapp.def.value, 95);
  assert.match(krapp.summary, /旧录音.*回听/);
  assert.match(krapp.atk.reason, /否认年轻自己的声音.*倒带/);
  assert.match(krapp.def.reason, /旧录音、当下的聆听和新留下的声音.*不同时段互相回应/);
  assert.equal(krapp.status, '历史编辑初评');
  assert.equal(krapp.basisMode, 'card-reading');
  assert.deepEqual(krapp.atk.criteria, []);
  assert.deepEqual(krapp.def.criteria, []);
  assert.match(krapp.note, /不反推精确分数/);
  const dinner = statRationaleV40(get('yplay-jiang'));
  assert.match(dinner.atk.reason, /三位教授.*是否赴宴.*对白/);
  assert.match(dinner.def.reason, /面子、原则、现实处境与旧事.*同一个赴宴决定/);
  assert.notEqual(dinner.atk.reason, krapp.atk.reason);
});

test('桑树坪纪事以简短专属理由说明群像冲突与结构，正文保留人物、事件和来源', () => {
  const card = get('xplay-sang'), result = statRationaleV40(card);
  assert.equal(card.rarity, 'UR');
  assert.equal(result.atk.value, 88);
  assert.equal(result.def.value, 89);
  assert.match(result.atk.reason, /婚姻交易.*宗族排斥/);
  assert.match(result.def.reason, /事件相互映照.*歌队/);
  for (const axis of ['atk', 'def']) {
    assert.ok(result[axis].reason.length < 60);
    for (const text of [card.note, card.observe, card.stage]) assert.ok(!result[axis].reason.includes(text));
  }
  const essays = JSON.parse(fs.readFileSync(path.join(__dirname, 'high-star-plays-v40.json'), 'utf8'));
  const sources = JSON.parse(fs.readFileSync(path.join(__dirname, 'high-star-plays-sources-v40.json'), 'utf8'));
  const essay = essays[card.id].join('');
  for (const name of ['福林', '青女', '月娃', '李金斗', '王志科', '豁子', '徐晓钟', '歌队']) assert.ok(essay.includes(name), name);
  assert.ok(essay.length > 250);
  assert.equal(sources[card.id].length, 2);
  assert.ok(sources[card.id].every(source => /^https:\/\//.test(source.url) && source.title));
});

test('高低悬殊的风格、手法、人物和空间均有各自解释', () => {
  const wall = statRationaleV40(get('dir-wall'));
  assert.equal(wall.atk.value, 82);
  assert.equal(wall.def.value, 90);
  assert.match(wall.atk.reason, /注意力交给屋内关系.*时间和结构.*较有限/);
  assert.match(wall.def.reason, /所在环境与观看边界.*反复执行/);
  assert.match(statRationaleV40(get('style-classic')).def.reason, /时间、地点与行动的集中/);
  assert.match(statRationaleV40(get('role-laura')).atk.reason, /接近、迟疑与退缩/);
  assert.match(statRationaleV40(get('role-laura')).def.reason, /玻璃小兽/);
  assert.match(statRationaleV40(get('place-proscenium')).def.reason, /观看方向与表演区边界明确.*场馆与布景/);
  assert.match(statRationaleV40(get('xdir-enter')).def.reason, /不同观众.*不一定.*相同/);
});

test('不足以支持历史低分时保留不确定，不编造作品结构缺陷', () => {
  const faust = statRationaleV40(get('xplay-faust'));
  assert.equal(faust.basisMode, 'documented-rubric');
  assert.match(faust.atk.reason, /追求不断扩大.*具体代价/);
  assert.match(faust.def.reason, /两部.*赌约和格蕾琴.*终场/);
  const bald = statRationaleV40(get('xplay-bald'));
  assert.match(bald.def.reason, /不能因缺少线性情节断言结构不完整/);
  assert.match(statRationaleV40(get('play-godot')).atk.reason, /有意义的延宕/);
  assert.match(statRationaleV40(get('play-godot')).def.reason, /开放结局不等于结构未完成/);
});

test('新档位的一星卡保留自身功能解释，不以星级倒推低分', () => {
  const common = cards.filter(card => activeIds.has(card.id) && card.rarity === 'C');
  assert.equal(common.length, 2);
  for (const card of common) {
    const result = statRationaleV40(card);
    for (const axis of ['atk', 'def']) {
      assert.doesNotMatch(result[axis].reason, /现有卡片写到：|卡片给出的排演示例是：|因为.*一星/, card.id);
    }
  }
  assert.match(statRationaleV40(get('xplace-carriage')).def.reason, /座位、过道.*走位.*余地较小/);
  assert.match(statRationaleV40(get('style-v21-epistolary')).atk.reason, /收信者可能始终缺席.*转述与等待/);
  assert.match(statRationaleV40(get('dir-v21-endingloop')).atk.reason, /重新解释已经发生的行动.*不一定创造新的事件/);
  const silent = statRationaleV40(get('v23-role-silentman'));
  assert.match(silent.atk.reason, /先于其他人步行.*不能支持.*因为沉默所以行动弱.*复核/);
  const warren = statRationaleV40(get('yplay-mrswarren'));
  assert.match(warren.atk.reason, /母亲.*供养.*女儿.*独立.*共同生活/);
  assert.match(warren.def.reason, /收入来源.*金钱线索.*选择/);
});

test('低星手法解释适用条件与限制，金枝和凯瑟琳分别保留具体处境', () => {
  assert.match(statRationaleV40(get('xstyle-walk')).def.reason, /移动速度、可达性及视听条件.*稳定呈现/);
  assert.match(statRationaleV40(get('ydir-jijifeng')).def.reason, /听清信息.*辨认因果.*吞掉关键回应/);
  assert.match(statRationaleV40(get('ydir-rankou')).def.reason, /灯光、观看距离.*化妆不能代替步态/);
  assert.match(statRationaleV40(get('ystyle-budaixi')).def.reason, /不直接规定怎样说话、行动.*自己的处境与愿望/);
  const jinzhi = statRationaleV40(get('v23-role-jinzhi'));
  const catherine = statRationaleV40(get('v23-sup-catherine'));
  assert.match(jinzhi.atk.reason, /身体、生育和屈辱.*不能把受苦直接当成行动弱/);
  assert.match(catherine.atk.reason, /工作、恋爱与独立.*迫使埃迪回应/);
  assert.notEqual(jinzhi.atk.reason, catherine.atk.reason);
});

test('全部已复核锚点只展示能算回当前分值的子项，来源逐项复用记录', () => {
  assert.equal(anchors.cards.length, 74);
  for (const anchor of anchors.cards) {
    const card = get(anchor.id);
    const result = statRationaleV40(card);
    assert.equal(result.basisMode, 'documented-rubric', anchor.id);
    for (const axis of ['atk', 'def']) {
      assert.deepEqual(result[axis].criteria.map(item => item.score), anchor[`${axis}Rubric`], anchor.id);
      assert.equal(50 + 4 * result[axis].criteria.reduce((sum, part) => sum + part.score, 0), card[axis], anchor.id);
      assert.ok(result[axis].criteria.every(item => item.label), anchor.id);
    }
    assert.deepEqual(result.sources, card.review.sourceIds.map(id => ({ id, ...anchors.sources[id] })), anchor.id);
    assert.equal(result.reviewReason, card.review.rationale, anchor.id);
    assert.match(result.note, /不为游戏分值背书/);
  }
  const salesman = statRationaleV40(get('play-salesman'));
  assert.match(salesman.reviewReason, /奖.*具体冲突.*仍是编辑初评.*未完成逐场文本复核/);
});

test('阿伽门农剧目按六项复评为94，不将剧本锚点或理由误套给同名配角', () => {
  const original = get('yplay-agamemnon'), role = get('role2-agamemnon');
  const before = JSON.stringify([original, role]);
  const anchor = anchors.cards.find(card => card.id === original.id);
  assert.deepEqual(anchor.atkRubric, [4, 4, 3]);
  assert.deepEqual(anchor.defRubric, [4, 4, 3]);
  assert.equal(anchor.reference, 88);
  assert.ok(!anchors.cards.some(card => card.id === role.id));
  const reviewed = { ...original, atk: 50 + 4 * anchor.atkRubric.reduce((a, b) => a + b, 0), def: 50 + 4 * anchor.defRubric.reduce((a, b) => a + b, 0), review: { ...anchor, status: '有来源的编辑复评' } };
  const result = statRationaleV40(reviewed);
  assert.equal(result.basisMode, 'documented-rubric');
  assert.equal(result.atk.value, 94);
  assert.equal(result.def.value, 94);
  const total = Math.round((result.atk.value + result.def.value) / 2);
  assert.equal(total, 94);
  assert.ok(Number.isInteger(total));
  assert.match(result.atk.reason, /祭女的旧债.*谋杀/);
  assert.match(result.def.reason, /报捷、预言与杀戮.*行动已经成形/);
  for (const axis of ['atk', 'def']) assert.deepEqual(result[axis].criteria.map(item => item.score), [4, 4, 3]);
  assert.deepEqual(result.sources.map(source => source.id), ['S19', 'S20', 'S21']);
  assert.equal(role.dimension, '配角');
  assert.equal(role.atk, 91);
  assert.equal(role.def, 87);
  assert.notEqual(statRationaleV40(role).atk.reason, result.atk.reason);
  assert.equal(JSON.stringify([original, role]), before);
});

test('500活跃及777全部旧卡都有完整依据，输出不修改任何卡字段', () => {
  assert.equal(cards.length, 777);
  assert.equal(cards.filter(card => activeIds.has(card.id)).length, 500);
  const before = JSON.stringify(cards);
  for (const card of cards) {
    const result = statRationaleV40(card);
    assert.equal(result.atk.value, card.atk);
    assert.equal(result.def.value, card.def);
    for (const axis of ['atk', 'def']) {
      assert.equal(result[axis].label, card[`${axis}_axis`], card.id);
      assert.match(result[axis].reason, /[。！？][”’」』"]?$/, card.id);
      assert.doesNotMatch(result[axis].reason, /undefined|\[object Object\]|。{2}|因为.*[一二三四五六七]星|稀有度.*所以|现有卡片写到：|卡片给出的排演示例是：/, card.id);
      assert.ok(result[axis].evidence, card.id);
    }
    if (card.review.status === '历史编辑初评') {
      assert.equal(result.needsReview, true, card.id);
      assert.deepEqual(result.atk.criteria, [], card.id);
      assert.deepEqual(result.def.criteria, [], card.id);
    }
  }
  assert.equal(JSON.stringify(cards), before);
});

test('普通卡的轴解释不再复述小注、看点或排演文案，证据仍完整保留', () => {
  const card = get('role2-neighbor');
  const result = statRationaleV40(card);
  for (const axis of ['atk', 'def']) {
    for (const text of [card.note, card.observe, card.stage]) assert.ok(!result[axis].reason.includes(text));
  }
  assert.ok(result.atk.evidence.includes(card.observe));
  const long = '需要在这一场中等对方把话完整说完再决定是否离开'.repeat(30) + '。';
  const synthetic = { id: 'unknown', name: '未知', dimension: '配角', atk: 60, def: 70, note: long, stage: long, tags: ['对手戏'] };
  const explanation = statRationaleV40(synthetic);
  assert.ok(!explanation.atk.reason.includes(long));
  assert.ok(!explanation.def.reason.includes(long));
  assert.equal(explanation.atk.evidence, long);
  assert.equal(explanation.def.evidence, long);
  const stageOnly = statRationaleV40({ ...synthetic, note: '' });
  assert.equal(stageOnly.atk.evidenceLabel, '卡片排演示例（非原作事实）');
  assert.equal(stageOnly.def.evidenceLabel, '卡片排演示例（非原作事实）');
});

test('不依赖星级、参考分、攻防反推的子项或无依据的来源数量', () => {
  const card = get('yplay-krapp');
  const before = statRationaleV40(card);
  const changed = { ...card, rarity: 'LR', fame: 100, score: 100, review: { ...card.review, reference: 100, curation: 100 } };
  assert.deepEqual(statRationaleV40(changed), before);
  const forged = { ...card, review: { ...card.review, atkRubric: [4,4,4], defRubric: [3,3,3], sourceIds: ['invented-source'] } };
  const result = statRationaleV40(forged);
  assert.deepEqual(result.atk.criteria, []);
  assert.deepEqual(result.def.criteria, []);
  assert.deepEqual(result.sources, []);
});

test('低于新量表范围的旧分与99原样保留，缺资料或缺数值时不补写事实', () => {
  assert.equal(statRationaleV40(get('place-proscenium')).atk.value, 78);
  assert.equal(statRationaleV40(get('place-table')).def.value, 99);
  const unknown = { id: 'not-known', dimension: '主演', atk: 0, def: 99 };
  const empty = statRationaleV40(unknown);
  assert.equal(empty.atk.value, 0);
  assert.equal(empty.def.value, 99);
  assert.equal(empty.basisMode, 'insufficient');
  assert.match(empty.atk.reason, /未附足以解释.*暂不根据数值补写/);
  const missing = statRationaleV40({ ...unknown, atk: NaN, def: undefined, note: '人物站在门口。' });
  assert.equal(missing.atk.value, null);
  assert.equal(missing.def.value, null);
  assert.match(missing.summary, /数值记录不全/);
  const unlabeled = statRationaleV40({ id: 'other', dimension: '未知', atk: 98, def: 98, note: '仅有这条记录。', review: { atkRubric: [4,4,4], defRubric: [4,4,4] } });
  assert.deepEqual(unlabeled.atk.criteria, []);
  assert.doesNotMatch(JSON.stringify(unlabeled), /undefined/);
});

test('独立浏览器脚本可直接inline调用，不依赖CommonJS或外部资源', () => {
  const source = fs.readFileSync(path.join(root, 'scripts/stat-rationale-v40.js'), 'utf8');
  const context = vm.createContext({});
  vm.runInContext(source, context);
  context.card = get('yplay-krapp');
  const result = vm.runInContext('statRationaleV40(card)', context);
  assert.equal(result.atk.value, 68);
  assert.equal(result.def.value, 95);
});

if (process.argv.includes('--samples')) {
  for (const id of ['yplay-krapp', 'yplay-jiang', 'dir-wall', 'role-laura', 'play-oedipus']) {
    const card = get(id), result = statRationaleV40(card);
    console.log(`\n${card.name} ${card.atk}/${card.def} · ${result.status}\n${result.summary}\nATK ${result.atk.reason}\nDEF ${result.def.reason}\n${result.note}`);
  }
}
