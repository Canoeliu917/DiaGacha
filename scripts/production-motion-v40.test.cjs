const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const DiaScoring = require('./scoring-v38.js');
const ui = fs.readFileSync(path.join(__dirname, 'scoring-ui-v38.js'), 'utf8');
const motion = fs.readFileSync(path.join(__dirname, 'production-motion-v40.js'), 'utf8');
const radarMotion = fs.readFileSync(path.join(__dirname, 'radar-motion-v40.js'), 'utf8');
const dimensions = ['剧目', '风格体系', '导演手法', '主演', '配角', '环境'];
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

class Element {
  constructor(classes = [], dataset = {}) {
    this.classes = new Set(classes); this.dataset = dataset; this.attributes = {}; this.properties = {}; this.children = [];
    this.isConnected = true; this.history = []; this.animations = []; this.events = {};
    this.classList = {
      add: (...names) => names.forEach(name => this.classes.add(name)),
      remove: (...names) => names.forEach(name => this.classes.delete(name)),
      contains: name => this.classes.has(name),
      toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name),
    };
    this.style = { setProperty: (name, value) => { this.properties[name] = value; }, removeProperty: name => { delete this.properties[name]; } };
  }
  set textContent(value) { this.text = String(value); this.history.push(this.text); }
  get textContent() { return this.text || ''; }
  set innerHTML(value) {
    this.markup = value;
    this.children = [...value.matchAll(/<span class="talk-beat">(.*?)<\/span>/g)].map(match => { const span = new Element(['talk-beat']); span.textContent = match[1]; return span; });
  }
  querySelectorAll(selector) { return selector === '.talk-beat' ? this.children : []; }
  setAttribute(name, value) { this.attributes[name] = value; }
  closest(selector) { return selector === '[hidden]' && this.hidden ? this : null; }
  animate(frames, options) { const animation = { frames, options, cancelled: false, cancel() { this.cancelled = true; } }; this.animations.push(animation); return animation; }
  addEventListener(name, fn) { this.events[name] = fn; }
  getBoundingClientRect() { return { top: 0, bottom: 200 }; }
  scrollIntoView() { this.scrolled = true; }
}

function cardsFor(score = 75) {
  return dimensions.map((dimension, index) => ({ id: `card-${index}`, name: `${dimension}卡`, dimension, rarity: 'UC', atk: score, def: score, workIds: ['work-shared'] }));
}

function harness({ score = 75, legacy = false, spread = false, reduced = false, sheet = false, radarVisible = true, noObserver = false } = {}) {
  const cards = cardsFor(score).filter(card => !legacy || card.dimension !== '配角');
  const screen = new Element([spread ? 'is-spread' : 'result-screen']);
  const scoreElement = new Element(), status = new Element(), row = new Element(), radarPanel = new Element(['hex-panel']);
  const minis = [...cards].reverse().map(card => new Element([spread ? 'spread-card' : 'cast-mini'], { id: card.id }));
  const corners = cards.map(card => new Element(['hex-corner'], { id: card.id }));
  const values = cards.map(card => new Element(['hex-value'], { final: String(card.atk) }));
  corners.forEach((corner,index)=>{corner.querySelector=selector=>selector==='.hex-value'?values[index]:null;});
  const svg = new Element(), rays = cards.map((_,index)=>new Element(['hex-ray'],{axis:String(index)}));
  const dots = cards.map((_,index)=>new Element(['hex-dot'],{axis:String(index)}));
  svg.querySelectorAll=selector=>selector==='[data-axis]'?[...rays,...dots]:selector==='.hex-dot'?dots:selector==='.is-lit'?[...rays,...dots].filter(node=>node.classes.has('is-lit')):[...rays,...dots].filter(node=>selector===`[data-axis="${node.dataset.axis}"]`);
  const heading = new Element(), paragraph = new Element(), hiddenParagraph = new Element();
  heading.textContent = '演后谈'; paragraph.textContent = '先把钥匙放下。再听对方回答！'; hiddenParagraph.textContent = '展开后才出现。'; hiddenParagraph.hidden = true;
  const talk = new Element(); talk.querySelectorAll = selector => selector === '[data-talk-reveal]' ? [heading, paragraph, hiddenParagraph] : [];
  const timers = new Map(), frames = new Map(), seen = new Set(), observers = [], litAxes = [], litTimes = [], starTimes = [];
  let now = 0, sequence = 0, cues = [], buttons = [];
  const context = vm.createContext({
    K: escapeHtml, DiaScoring, Wt: () => [{ id: 'compatible-system' }],
    Y: { view: spread ? 'pack' : 'result', pack: 'mix', drawn: cards, booster: { phase: 'spread', cards }, sheet },
    matchMedia: () => ({ matches: reduced }), performance: { now: () => now }, innerHeight: 844,
    requestAnimationFrame(fn) { const id = ++sequence; frames.set(id, { fn, at: now + 16 }); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    talkLater(fn, delay) { const id = ++sequence; timers.set(id, { fn, at: now + delay }); return id; },
    talkClear() { timers.clear(); },
    hasTalkSeen: key => seen.has(key), markTalkSeen: key => seen.add(key), w: cards => cards.map(card => card.id).join('.'),
    paintRadar() { values.forEach(value=>{value.textContent=value.dataset.final;}); },
    getComputedStyle: element => ({ getPropertyValue: name => element.properties[name] || '#b45e29' }),
    document: { querySelector: selector => selector==='.result-screen .hex-radar'?svg:screen,querySelectorAll:selector=>selector==='.result-screen .hex-corner'?corners:[] },
    IntersectionObserver: class {
      constructor(fn) { this.callback = fn; observers.push(this); }
      observe(target) { this.target = target; }
      unobserve() { this.unobserved = true; }
      disconnect() { this.disconnected = true; }
    },
  });
  if(noObserver)context.IntersectionObserver=undefined;
  vm.runInContext(ui + '\n' + radarMotion + '\n' + motion, context);
  const light=context.hexLight,star=context.hexStar;
  context.hexLight=index=>{litAxes.push(index);litTimes.push(now);light(index);};
  context.hexStar=()=>{starTimes.push(now);star();};
  const enter=context.enterProductionV40;
  const intersectRadar=(ratio=1)=>{
    const observer=observers.find(item=>item.target===radarPanel);
    observer?.callback([{target:radarPanel,isIntersecting:ratio>0,intersectionRatio:ratio}]);
  };
  context.enterProductionV40=()=>{enter();if(radarVisible)intersectRadar();};
  const result = context.productionScore(cards);
  cues = context.productionCuesV40(result, cards);
  buttons = cues.map(cue => new Element([], { productionCue: cue.id }));
  screen.querySelector = selector => ({ '.show-score b,.spread-score': scoreElement, '.production-cue-status': status, '.cast-row,.pack-spread': row, '.talk': spread ? null : talk, '.hex-panel':spread?null:radarPanel }[selector] || null);
  screen.querySelectorAll = selector => ({
    '[data-production-cue]': buttons, '.cast-mini,.spread-card': minis, '.hex-corner': corners,
    '.is-cue-card': minis.filter(card => card.classes.has('is-cue-card')),
    '.is-radar-card': minis.filter(card => card.classes.has('is-radar-card')),
  }[selector] || []);
  const tick = () => {
    const next = [...timers].map(([id, entry]) => ({ id, ...entry, type: timers })).concat([...frames].map(([id, entry]) => ({ id, ...entry, type: frames }))).sort((a, b) => a.at - b.at)[0];
    if (!next) return false;
    next.type.delete(next.id); now = next.at; next.fn(now); return true;
  };
  const finish = () => { let count = 0; while (tick()) assert.ok(++count < 1000, '动画必须终止'); };
  return { context, cards, result, cues, screen, scoreElement, status, row, minis, corners, values, svg, rays, dots, buttons, talk, heading, paragraph, hiddenParagraph, timers, frames, observers, seen, litAxes, litTimes, starTimes, radarPanel, intersectRadar, tick, finish, currentTime:()=>now };
}

test('总览与演后谈按实际卡ID同时点亮，重排不串卡，重播不会重复加分', () => {
  for (const spread of [false, true]) {
    const run = harness({ spread });
    run.context.enterProductionV40(); run.finish();
    assert.equal(run.scoreElement.textContent, String(run.result.score));
    for (const cue of run.cues) {
      run.context.replayProductionCueV40(cue.id);
      const highlighted = run.minis.filter(card => card.classes.has('is-cue-card')).map(card => card.dataset.id).sort();
      assert.deepEqual(highlighted, [...cue.cardIds].sort());
      assert.ok(run.minis.filter(card => card.classes.has('is-cue-card')).every(card => card.classes.has('is-cue-bond') === (cue.kind === 'bond')));
      assert.equal(run.buttons.filter(button => button.attributes['aria-pressed'] === 'true').length, 1);
      assert.ok(cue.cardIds.every(id => run.status.textContent.includes(run.cards.find(card => card.id === id).name)));
      assert.equal(run.scoreElement.textContent, String(run.result.score));
      assert.equal(run.timers.size + run.frames.size, 0);
    }
    if (!spread) assert.deepEqual(run.litAxes, run.minis.map(card => run.cards.findIndex(item => item.id === card.dataset.id)));
  }
});

test('自动计分的每一帧都是整数，奖励封顶后仍点亮但不会超过100分', () => {
  for (const score of [75, 95, 100]) {
    const run = harness({ score }); run.context.enterProductionV40();
    assert.equal(run.scoreElement.textContent, String(run.result.base));
    run.finish();
    assert.ok(run.scoreElement.history.every(value => /^\d+$/.test(value) && Number(value) >= run.result.base && Number(value) <= run.result.score));
    assert.equal(run.scoreElement.textContent, String(run.result.score));
    assert.equal(run.timers.size + run.frames.size, 0);
    assert.equal(run.minis.filter(card => card.classes.has('is-cue-card')).length, 0);
  }
});

test('卡与角按实际ID同步，一次仅一个维度，760ms呈现及180ms停顿后才轮到下一维', () => {
  const run=harness();run.context.enterProductionV40();
  const rests=[];
  assert.ok(run.svg.classes.has('is-building'));
  assert.equal(run.corners.filter(node=>node.classes.has('is-lit')).length,0);
  while(!run.starTimes.length){
    assert.ok(run.tick());
    assert.ok(run.values.every(value=>/^\d+$/.test(value.textContent)));
    assert.equal(run.corners.filter(node=>node.classes.has('is-lit')).length,run.litAxes.length);
    const activeCards=run.minis.filter(card=>card.classes.has('is-radar-card'));
    const activeCorners=run.corners.filter(corner=>corner.classes.has('is-current'));
    assert.ok(activeCards.length<=1&&activeCorners.length<=1,'不得两个维度重叠播放');
    assert.deepEqual(activeCards.map(card=>card.dataset.id),activeCorners.map(corner=>corner.dataset.id),'同一帧卡与角必须匹配');
    if(!activeCards.length&&!run.starTimes.length)rests.push(run.currentTime());
  }
  assert.deepEqual(run.litTimes,[180,1120,2060,3000,3940,4880]);
  assert.deepEqual(rests,[940,1880,2820,3760,4700,5640]);
  assert.equal(run.starTimes[0],5820);
  assert.equal(run.minis.filter(card=>card.classes.has('is-cue-card')).length,0,'合图前不抢播奖励');
  assert.ok(run.minis.every(card=>card.animations.length===0),'卡面没有抢先播放的独立入场动画');
  assert.ok(!run.screen.classes.has('is-radar-sequence'));
  assert.equal(run.frames.size,0,'角点使用CSS渐显，无遗留计数RAF');
  run.finish();
  assert.ok(!run.svg.classes.has('is-building'));
  assert.ok(run.svg.classes.has('is-star'));
});

test('图表进入视野才启动六角和计分，重复交叉通知不会重复播放', () => {
  const run=harness({radarVisible:false});run.context.enterProductionV40();
  const observer=run.observers.find(item=>item.target===run.radarPanel);
  assert.ok(observer);
  assert.equal(run.timers.size+run.frames.size,0);
  assert.ok(run.svg.classes.has('is-building'));
  assert.equal(run.corners.filter(node=>node.classes.has('is-lit')).length,0);
  run.intersectRadar(0);run.intersectRadar(.2);run.intersectRadar(.59);
  assert.equal(run.timers.size+run.frames.size,0);
  run.intersectRadar(.6);
  const scheduled=run.timers.size;
  assert.ok(scheduled>0);
  assert.ok(observer.disconnected);
  run.intersectRadar(1);
  assert.equal(run.timers.size,scheduled);
  run.finish();
  assert.equal(run.litAxes.length,6);
  assert.equal(run.scoreElement.textContent,String(run.result.score));
});

test('图表尚未进入视野时离开或点击完成，旧观察回调不能重新启动动画', () => {
  for(const action of ['stopProductionV40','finishProductionV40']){
    const run=harness({radarVisible:false});run.context.enterProductionV40();
    const observer=run.observers.find(item=>item.target===run.radarPanel);
    run.context[action]();
    assert.ok(observer.disconnected);
    run.intersectRadar(1);
    assert.equal(run.timers.size+run.frames.size,0);
    assert.equal(run.litAxes.length,0);
    if(action==='finishProductionV40'){
      assert.equal(run.scoreElement.textContent,String(run.result.score));
      assert.ok(!run.svg.classes.has('is-building'));
    }
  }
});

test('无IntersectionObserver时立即启动序列，减动及详情不等待可见性', () => {
  const fallback=harness({noObserver:true,radarVisible:false});fallback.context.enterProductionV40();fallback.finish();
  assert.equal(fallback.litAxes.length,6);
  for(const option of [{reduced:true},{sheet:true}]){
    const run=harness({...option,radarVisible:false});run.context.enterProductionV40();
    assert.equal(run.observers.filter(observer=>observer.target===run.radarPanel).length,0);
    assert.ok(!run.svg.classes.has('is-building'));
    assert.equal(run.scoreElement.textContent,String(run.result.score));
  }
});

test('加分卡面只作一次短促轻震，回到原位且连续点选不叠加震动', () => {
  const run=harness({spread:true});run.context.enterProductionV40();run.finish();
  run.context.replayProductionCueV40(run.cues[0].id);
  const shakes=run.minis.flatMap(card=>card.animations).filter(animation=>animation.options.duration===340);
  assert.ok(shakes.length);
  for(const animation of shakes){
    assert.equal(animation.frames[0].transform,'translateX(0)');
    assert.equal(animation.frames.at(-1).transform,'translateX(0)');
    assert.ok(animation.frames.every(frame=>Object.keys(frame).join()==='transform'&&!frame.transform.includes('scale')));
    assert.equal(animation.options.delay,undefined,'相关卡同时回应');
  }
  run.context.replayProductionCueV40(run.cues.at(-1).id);
  assert.ok(shakes.every(animation=>animation.cancelled));
  const css=fs.readFileSync(path.join(__dirname,'production-v40.css'),'utf8');
  const cueRule=css.match(/\.cast-mini\.is-cue-card,\.spread-card\.is-cue-card\{([^}]*)\}/)[1];
  assert.doesNotMatch(cueRule,/scale|outline|translate/);
});

test('点击完成立即终止计分，展开及详情返回不会重新从基础分播放', () => {
  const run = harness(); run.context.enterProductionV40(); run.tick();
  run.screen.events.click();
  assert.equal(run.scoreElement.textContent, String(run.result.score));
  assert.equal(run.timers.size + run.frames.size, 0);
  assert.equal(run.minis.filter(card=>card.classes.has('is-radar-card')).length,0);
  assert.equal(run.corners.filter(corner=>corner.classes.has('is-current')).length,0);
  run.context.stopProductionV40(); run.context.enterProductionV40();
  assert.equal(run.scoreElement.textContent, String(run.result.score));
  assert.equal(run.timers.size + run.frames.size, 0);
});

test('切路由清理待执行计时、RAF、观察器与卡牌动画，旧回调不改新画面', () => {
  const run = harness(); run.context.enterProductionV40();
  while (!run.frames.size) assert.ok(run.tick());
  const staleFrame = [...run.frames.values()][0].fn;
  const oldScore = run.scoreElement.textContent;
  run.context.stopProductionV40(); staleFrame(100000);
  assert.equal(run.scoreElement.textContent, oldScore);
  assert.equal(run.timers.size + run.frames.size, 0);
  assert.ok(run.observers.every(observer => observer.disconnected));
  assert.ok(run.minis.flatMap(card => card.animations).every(animation => animation.cancelled));
});

test('减动和打开详情直接显示最终分，旧五卡只联动存在卡', () => {
  for (const option of [{ reduced: true }, { sheet: true }, { reduced: true, legacy: true }]) {
    const run = harness(option); run.context.enterProductionV40();
    assert.equal(run.scoreElement.textContent, String(run.result.score));
    assert.equal(run.timers.size + run.frames.size, 0);
    assert.equal(run.minis.flatMap(card => card.animations).length, 0);
    assert.ok(run.cues.every(cue => cue.cardIds.every(id => run.cards.some(card => card.id === id))));
    if (option.reduced) {
      assert.equal(run.observers.length, 0);
      assert.equal(run.paragraph.textContent, '先把钥匙放下。再听对方回答！');
      assert.equal(run.paragraph.markup, undefined);
      run.context.replayProductionCueV40(run.cues[0].id);
      assert.equal(run.minis.flatMap(card => card.animations).length, 0);
    }
  }
});

test('演后谈只在进入视野时渐显完整句，未展开的全文不提前播放', () => {
  const run = harness(); run.context.enterProductionV40();
  const observer = run.observers[0];
  assert.equal(run.paragraph.markup, undefined);
  observer.callback([{ target: run.talk, isIntersecting: true }]);
  assert.equal(run.paragraph.children.map(span => span.textContent).join(''), run.paragraph.textContent);
  assert.equal(run.paragraph.children.length, 2);
  assert.ok(run.paragraph.children.every(span => span.animations.length === 1));
  assert.equal(run.hiddenParagraph.markup, undefined);
  assert.ok(observer.unobserved);
  observer.callback([{ target: run.talk, isIntersecting: true }]);
  assert.ok(run.paragraph.children.every(span => span.animations.length === 1));
});

test('实际内联总览与节目单模板把所有事件关联到页面上的卡片，五卡分享不补卡', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
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
  for (const block of html.replace(startup, 'globalThis.fixture={e,ar,Vn,Un,productionScore,productionCuesV40}').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) vm.runInContext(block[1], context, { timeout: 10000 });
  const game = context.fixture;
  const chosen = { 剧目: 'play-hamlet', 主演: 'role-hamlet', 配角: 'role2-laertes', 环境: 'place-elsinore' };
  const cards = dimensions.map(dimension => game.e.find(card => chosen[dimension] ? card.id === chosen[dimension] : card.dimension === dimension));
  for (const drawn of [cards, cards.filter(card => card.dimension !== '配角')]) {
    const result = game.productionScore(drawn), cues = game.productionCuesV40(result, drawn);
    const state = { ...game.ar(), drawn, fromShare: true, talkOpen: true, pack: 'mix', booster: { cards: drawn, phase: 'spread' } };
    const views = drawn.length === 6 ? [['spread-card', game.Vn(state)], ['cast-mini', game.Un(state)]] : [['cast-mini', game.Un(state)]];
    for (const [className, markup] of views) {
      const ids = [...markup.matchAll(new RegExp(`<button[^>]+class="${className}[^>]+data-id="([^"]+)"`, 'g'))].map(match => match[1]);
      assert.deepEqual(ids.slice().sort(), drawn.map(card => card.id).sort());
      for (const cue of cues) {
        assert.ok(markup.includes(`data-production-cue="${cue.id}"`));
        assert.ok(cue.cardIds.every(id => ids.includes(id)), cue.id);
      }
      assert.doesNotMatch(markup, /class="hex-scale"|本场评价 ·|剧组称号：/);
    }
  }
});
