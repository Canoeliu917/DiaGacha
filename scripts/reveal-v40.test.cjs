const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, 'reveal-v40.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'reveal-v40.css'), 'utf8');

function liveCards() {
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
  for (const block of html.replace(startup, 'globalThis.fixture={e,activeCards,cardEssays,highStarNotesV40}').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) vm.runInContext(block[1], context, { timeout: 10000 });
  return context.fixture;
}
const fixture = liveCards();
const copyContext = vm.createContext({ cardEssays: fixture.cardEssays, highStarNotesV40: fixture.highStarNotesV40 });
vm.runInContext(source, copyContext);

test('500张常驻四至七星分别提供三至六句介绍，277张预留兼容卡完整保留已有实卡句', () => {
  const counts = { SR: 3, SSR: 4, UR: 5, LR: 6 };
  const activeIds = new Set(fixture.activeCards.map(card => card.id));
  assert.equal(activeIds.size, 500);
  assert.equal(fixture.e.length - activeIds.size, 277);
  let checked = 0;
  for (const card of fixture.e) {
    const lines = copyContext.preambleLines(card);
    const expected = counts[card.rarity] || 0;
    if (activeIds.has(card.id) || !expected) assert.equal(lines.length, expected, card.id);
    else assert.ok(lines.length >= 3 && lines.length <= expected, card.id);
    assert.equal(new Set(lines).size, lines.length, card.id);
    const original = [card.note, card.observe, ...fixture.highStarNotesV40(card), card.stage, card.blurb, fixture.cardEssays[card.id]].join('\n');
    if (expected && lines.length < expected) {
      const available = (original.match(/[^。！？!?\n]+[。！？!?]+[”’」』）)]*/g) || []).map(line => line.trim()).filter(line => line.length >= 6);
      for (const line of available) assert.ok(lines.includes(line), `${card.id}: 预留卡已有完整句被省略 ${line}`);
    }
    for (const line of lines) {
      assert.ok(line.length >= 6, `${card.id}: ${line}`);
      assert.match(line, /[。！？!?][”’」』）)]*$/);
      assert.ok(original.includes(line), `${card.id}: 未使用实卡完整句 ${line}`);
      assert.doesNotMatch(line, /先别忙着出声|这一张要走完整出|全场只等这一声|排演关键词是|\.\.\.|…$/);
    }
    if (lines.length) checked++;
  }
  assert.ok(checked > 20);
});

test('跳过泛短句时仍保留有意义的简短看点，不拿类别占用介绍句数', () => {
  const lines = copyContext.preambleLines({ rarity: 'SR', note: '一种演法。门槛还记得。',
    observe: '人物离开后，留下的物件仍能提示曾经发生的事。', stage: '这处空间让过去与现在保留了联系。' });
  assert.equal(lines.length, 3);
  assert.ok(lines.includes('门槛还记得。'));
  assert.ok(!lines.includes('一种演法。'));
});

class Element {
  constructor() {
    this.classes = new Set(); this.attributes = {}; this.children = []; this.hidden = false; this.removed = false;
    this.classList = { add: (...names) => names.forEach(name => this.classes.add(name)), remove: (...names) => names.forEach(name => this.classes.delete(name)), contains: name => this.classes.has(name) };
    this.style = { setProperty: (name, value) => { this.attributes[name] = value; } };
  }
  set innerHTML(value) { this.markup = value; this.lines = [...value.matchAll(/<p\b[^>]*class="[^"]*\bpre-line\b[^"]*"[^>]*>/g)].map(match => { const line = new Element(); line.hidden = /\bhidden\b/.test(match[0]); return line; }); }
  get innerHTML() { return this.markup || ''; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
  querySelectorAll(selector) { return selector === '.pre-line' ? this.lines || [] : []; }
  appendChild(element) { this.children.push(element); element.parent = this; }
  remove() { this.removed = true; }
  insertAdjacentElement(position, element) { this.after = element; }
}
function runReveal(rarity, { reduced = false, skip = false, last = false } = {}) {
  const card = fixture.e.find(card => card.rarity === rarity), zone = new Element(), flip = new Element(), host = new Element(), screen = new Element();
  zone.querySelector = () => flip;
  const timers = new Map(); let timerId = 0, now = 0, soundCount = 0;
  const context = vm.createContext({
    X: 0, J: reduced, Y: { booster: { cards: [card, card], index: last?1:0, phase: 'card', revealDone: false, skipPreamble: skip } },
    K: String, cardEssays: fixture.cardEssays, highStarNotesV40: fixture.highStarNotesV40, De() {}, Oe() { soundCount++; }, enterSpread() {},
    document: { querySelector: selector => selector === '.pack-zone' ? zone : selector === '.pull-screen' ? screen : host, createElement: () => new Element() },
    matchMedia: () => ({ matches: reduced }),
    setTimeout(fn, delay) { const id = ++timerId; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  });
  context.window = context;
  vm.runInContext(source, context);
  context.$();
  const tick = () => {
    const [id, timer] = [...timers].sort((a, b) => a[1].at - b[1].at)[0];
    timers.delete(id); now = timer.at; timer.fn();
  };
  const finish = () => { for (let i = 0; timers.size && i < 30; i++) tick(); assert.equal(timers.size, 0); };
  return { context, zone, flip, host, screen, timers, tick, finish, soundCount: () => soundCount, elapsed: () => now };
}

test('卡面均分后一次只显一句，前句淡出才显后句，最后裂开并露出完整卡面', () => {
  for (const [rarity, lines, waves] of [['SR', 3, 0], ['SSR', 4, 1], ['UR', 5, 2], ['LR', 6, 3]]) {
    const run = runReveal(rarity);
    const paper=run.flip.children.find(child=>child.className==='reveal-paper-v40');
    assert.equal(run.host.attributes['--reveal-lines'],String(lines));
    run.tick();
    for (let i = 0; i < lines; i++) {
      assert.equal(run.host.lines.filter(line => !line.hidden).length, 1);
      assert.ok(run.host.lines[i].classes.has('is-on'));
      assert.ok(!paper.classes.has('is-torn'),'全部句子读完前不泄露卡面');
      run.tick();
      assert.ok(run.host.lines[i].classes.has('is-out'));
      assert.equal(run.host.lines.filter(line => !line.hidden).length, 1);
      run.tick();
      assert.ok(run.host.lines[i].hidden);
    }
    assert.equal(run.host.hidden,true);
    assert.equal(run.host.lines.filter(line=>!line.hidden).length,0);
    const effects = run.flip.children.find(child => child.className === 'reveal-effects-v40');
    assert.equal((effects.innerHTML.match(/class="reveal-wave-v40"/g) || []).length, waves);
    assert.ok(run.flip.classes.has('is-reveal-climax'));
    assert.ok(!paper.classes.has('is-torn'),'先显裂纹再拉开幕片');
    run.tick();
    assert.ok(paper.classes.has('is-torn'));
    run.finish();
    assert.ok(run.context.Y.booster.revealDone);
    assert.equal(run.context.revealTimersV40.size, 0);
    assert.ok(run.flip.children.filter(child=>child!==run.host).every(child => child.removed));
    assert.equal(run.host.parent,run.flip);
    assert.equal(run.soundCount(), 1);
  }
});

test('减少动态或跳过时立即露出完整卡面，无文字遮挡或等待计时', () => {
  for (const option of [{ reduced: true }, { skip: true }]) {
    const run = runReveal('LR', option);
    assert.ok(run.context.Y.booster.revealDone);
    assert.equal(run.host.hidden,true);
    assert.equal(run.host.lines.filter(line => !line.hidden).length, 0);
    assert.deepEqual(run.flip.children,[run.host]);
    assert.equal(run.timers.size, 0);
    assert.ok(!run.flip.classes.has('is-reveal-climax'));
    if (option.reduced) assert.equal(run.soundCount(), 0, '旧音效包含震动，降低动态时不调用');
  }
  assert.deepEqual(JSON.parse(JSON.stringify(copyContext.revealProfileV40('LR', true))), { level: 3, lines: 6, waves: 0, shake: false, charge: 0 });
});

test('下一张关闭或重绘均可清理计时，旧回调不改变新一张状态', () => {
  const run = runReveal('UR');
  run.tick();
  run.context.revealClearV40();
  assert.equal(run.timers.size, 0);
  assert.equal(run.context.revealTimersV40.size, 0);
  assert.ok(run.host.hidden);
  assert.ok(run.flip.children.filter(child=>child!==run.host).every(child => child.removed));
  assert.equal(run.context.Y.booster.revealDone, false);
  const stale = runReveal('LR');
  stale.context.X++;
  stale.finish();
  assert.equal(stale.context.Y.booster.revealDone, false);
  assert.equal(stale.soundCount(), 0);
});

test('一至三星快速完成，四星起有完整介绍且保留跳过与减动', () => {
  for (const rarity of ['C', 'UC', 'R']) {
    const run = runReveal(rarity);
    run.finish();
    assert.ok(run.context.Y.booster.revealDone);
    assert.ok(run.elapsed() < 700);
    assert.equal(run.host.lines.length, 0);
  }
  assert.match(css, /pointer-events: none/);
  assert.match(css, /background: transparent/);
  assert.match(css, /max-height: none/);
  assert.match(css, /-webkit-line-clamp: unset/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /infinite/);
  for (const rarity of ['SR', 'SSR', 'UR', 'LR']) {
    assert.equal(copyContext.revealProfileV40(rarity).lines, { SR: 3, SSR: 4, UR: 5, LR: 6 }[rarity]);
    for (const option of [{ reduced: true }, { skip: true }]) {
      const run = runReveal(rarity, option);
      assert.ok(run.context.Y.booster.revealDone);
      assert.equal(run.host.hidden, true);
      assert.equal(run.timers.size, 0);
    }
  }
});

test('完成揭晓后详情返回只显示卡面，不恢复遮挡文字或重播', () => {
  const run = runReveal('LR');run.finish();
  run.context.Y.view='pack';
  run.host.innerHTML='';run.host.hidden=true;
  run.context.restoreRevealIntroV40();
  assert.equal(run.host.hidden,true);
  assert.equal(run.host.lines.length,0);
  assert.equal(run.host.parent,run.flip);
  assert.equal(run.timers.size,0);
  assert.equal(run.soundCount(),1);
  assert.ok(run.flip.classes.has('reveal-v40'));
  assert.ok(run.screen.classes.has('reveal-restored-v40'));
});

test('最后一张高星跳过或减动后卡面停留，交给现有下一步按钮继续',()=>{
  for(const options of [{reduced:true,last:true},{skip:true,last:true}]){
    const run=runReveal('LR',options);
    assert.equal(run.host.parent,run.flip);
    assert.equal(run.host.hidden,true);
    assert.equal(run.host.lines.filter(line=>!line.hidden).length,0);
    assert.equal(run.context.Y.booster.revealDone,true);
    assert.equal(run.timers.size,0);
  }
});

test('只有七星启用暗场，切卡清理，详情返回恢复',()=>{
  const ordinary=runReveal('UR');
  assert.ok(!ordinary.screen.classes.has('reveal-black-stage'));
  const run=runReveal('LR');
  assert.ok(run.screen.classes.has('reveal-black-stage'));
  run.finish();run.context.revealClearV40();
  assert.ok(!run.screen.classes.has('reveal-black-stage'));
  run.context.Y.view='pack';run.context.restoreRevealIntroV40();
  assert.ok(run.screen.classes.has('reveal-black-stage'));
});
