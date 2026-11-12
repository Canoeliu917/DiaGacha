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

test('高低悬殊的风格、手法、人物和空间均有各自解释', () => {
  const wall = statRationaleV40(get('dir-wall'));
  assert.equal(wall.atk.value, 30);
  assert.equal(wall.def.value, 98);
  assert.match(wall.atk.reason, /不直接承认观众.*稳定场内关系/);
  assert.match(wall.def.reason, /明确约定.*假想边界/);
  assert.match(statRationaleV40(get('style-classic')).def.reason, /时间、地点与行动的集中/);
  assert.match(statRationaleV40(get('role-laura')).atk.reason, /接近、迟疑与退缩/);
  assert.match(statRationaleV40(get('role-laura')).def.reason, /玻璃小兽/);
  assert.match(statRationaleV40(get('place-proscenium')).def.reason, /画框.*遮挡与出入/);
  assert.match(statRationaleV40(get('xdir-enter')).def.reason, /不同观众.*不一定.*相同/);
});

test('不足以支持历史低分时保留不确定，不编造作品结构缺陷', () => {
  const faust = statRationaleV40(get('xplay-faust'));
  assert.match(faust.atk.reason, /不能.*推导出58/);
  assert.match(faust.def.reason, /不足以证明59.*待复核/);
  const bald = statRationaleV40(get('xplay-bald'));
  assert.match(bald.def.reason, /不能因缺少线性情节断言结构不完整/);
  assert.match(statRationaleV40(get('play-godot')).atk.reason, /有意义的延宕/);
  assert.match(statRationaleV40(get('play-godot')).def.reason, /开放结局不等于结构未完成/);
});

test('9张一星卡都有针对自身功能的解释，限制与原作价值分开说明', () => {
  const common = cards.filter(card => activeIds.has(card.id) && card.rarity === 'C');
  assert.equal(common.length, 9);
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
  assert.match(warren.atk.reason, /财富的来源.*要求独立.*无法说明/);
  assert.match(warren.def.reason, /两句简介不足以断言结构薄弱/);
});

test('低星手法解释适用条件与限制，金枝和凯瑟琳分别保留具体处境', () => {
  assert.match(statRationaleV40(get('xstyle-walk')).def.reason, /跟上.*视听条件.*信息缺失/);
  assert.match(statRationaleV40(get('ydir-jijifeng')).def.reason, /听清信息.*辨认因果.*吞掉关键回应/);
  assert.match(statRationaleV40(get('ydir-rankou')).def.reason, /灯光、观看距离.*化妆不能代替步态/);
  assert.match(statRationaleV40(get('ystyle-budaixi')).def.reason, /不直接规定怎样说话、行动.*自己的处境与愿望/);
  const jinzhi = statRationaleV40(get('v23-role-jinzhi'));
  const catherine = statRationaleV40(get('v23-sup-catherine'));
  assert.match(jinzhi.atk.reason, /身体、生育和屈辱.*不能把受苦直接当成行动弱/);
  assert.match(catherine.atk.reason, /工作、恋爱与独立.*迫使埃迪回应/);
  assert.notEqual(jinzhi.atk.reason, catherine.atk.reason);
});

test('32张锚点只展示已有且能算回当前分值的子项，来源逐项复用记录', () => {
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

test('500活跃及777全部旧卡都有完整依据，输出不修改任何卡字段', () => {
  assert.equal(cards.length, 777);
  assert.equal(cards.filter(card => activeIds.has(card.id)).length, 500);
  const before = JSON.stringify(cards);
  const reasons = new Set();
  for (const card of cards) {
    const result = statRationaleV40(card);
    assert.equal(result.atk.value, card.atk);
    assert.equal(result.def.value, card.def);
    for (const axis of ['atk', 'def']) {
      assert.equal(result[axis].label, card[`${axis}_axis`], card.id);
      assert.match(result[axis].reason, /[。！？][”’」』"]?$/, card.id);
      assert.doesNotMatch(result[axis].reason, /undefined|\[object Object\]|。{2}|因为.*[一二三四五六七]星|稀有度.*所以/, card.id);
      assert.ok(result[axis].evidence, card.id);
    }
    reasons.add(result.atk.reason);
    if (card.review.status === '历史编辑初评') {
      assert.equal(result.needsReview, true, card.id);
      assert.deepEqual(result.atk.criteria, [], card.id);
      assert.deepEqual(result.def.criteria, [], card.id);
    }
  }
  assert.ok(reasons.size >= 750, `distinct concrete readings: ${reasons.size}`);
  assert.equal(JSON.stringify(cards), before);
});

test('普通卡保留完整文案并明确把stage标作排演示例，不把改编动作写成原作事实', () => {
  const card = get('role2-neighbor');
  const result = statRationaleV40(card);
  assert.ok(result.atk.reason.includes(card.observe));
  assert.ok(result.def.reason.includes(card.stage));
  assert.match(result.def.reason, /卡片给出的排演示例是/);
  const long = '需要在这一场中等对方把话完整说完再决定是否离开'.repeat(30) + '。';
  const synthetic = { id: 'unknown', name: '未知', dimension: '配角', atk: 60, def: 70, note: long, stage: long, tags: ['对手戏'] };
  const explanation = statRationaleV40(synthetic);
  assert.ok(explanation.atk.reason.includes(long));
  assert.ok(explanation.def.reason.includes(long));
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
  assert.equal(statRationaleV40(get('place-proscenium')).atk.value, 28);
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
