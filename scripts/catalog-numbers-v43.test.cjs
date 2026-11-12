const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');
const { formatCardNoV43 } = require('./number-format-v43.js');

const root = path.resolve(__dirname, '..');

test('所有图鉴编号使用四位，数字含义不变', () => {
  for (let no = 1; no <= 777; no++) {
    assert.match(formatCardNoV43(no), /^\d{4}$/);
    assert.equal(Number(formatCardNoV43(no)), no);
  }
  assert.equal(formatCardNoV43(1), '0001');
  assert.equal(formatCardNoV43(111), '0111');
  assert.equal(formatCardNoV43(777), '0777');
});

test('129人工槽位全为常驻，迁移只改编号并保留非特殊卡相对顺序且可重跑', () => {
  const script = String.raw`
import importlib.util,json
from pathlib import Path
p=Path('scripts/number-catalog-v43.py')
s=importlib.util.spec_from_file_location('catalog',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
cards=json.loads(Path('docs/cards.json').read_text(encoding='utf-8'))
slots=json.loads(Path('docs/CATALOG_NUMBERS_V43.json').read_text(encoding='utf-8'))['specialSlots']
active=set(json.loads(Path('docs/ACTIVE_CARDS_V39.json').read_text(encoding='utf-8'))['activeIds'])
after=m.renumber(cards,slots,active)
assert sorted(c['no'] for c in after)==list(range(1,778))
assert [{k:v for k,v in c.items() if k!='no'} for c in cards]==[{k:v for k,v in c.items() if k!='no'} for c in after]
assert m.renumber(after,slots,active)==after
special={s['id'] for s in slots}
assert [c['id'] for c in sorted(cards,key=lambda c:c['no']) if c['id'] not in special]==[c['id'] for c in sorted(after,key=lambda c:c['no']) if c['id'] not in special]
assert len({c['dimension'] for c in after if c['no']<=50})==6
assert all(c['id'] in active for c in after if c['no'] in m.SPECIAL_NUMBERS)
html=Path('index.html').read_text(encoding='utf-8')
updated=m.integrate_format(html)
assert m.integrate_format(updated)==updated
assert 'e.albumSort||'+'\x60no\x60' in updated
assert 'albumSort:'+'\x60no\x60' in updated
assert updated.count('formatCardNoV43(e.no)')==4
assert updated.count('<style id="number-format-v43">')==1
print('PASS')
`;
  const result = spawnSync('python', ['-c', script], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /PASS/);
});

test('图鉴显式选择稀有度和分数排序仍按原分支运行，收藏继续使用ID', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const start = html.lastIndexOf('function Wn(');
  const end = html.indexOf('function ', start + 12);
  const context = { T: card => card.score };
  vm.createContext(context);
  const renderer = html.slice(start, end).replace('e.albumSort||`rarity`', 'e.albumSort||`no`');
  // Check the real comparator instead of rebuilding the surrounding UI dependencies.
  const sort = renderer.match(/a=a\.slice\(\)\.sort\((.*?)\);let o=/s);
  assert.ok(sort);
  const pool = [{ id: 'a', no: 30, score: 58, rarity: 'C' }, { id: 'b', no: 20, score: 90, rarity: 'LR' }, { id: 'c', no: 2, score: 80, rarity: 'SSR' }];
  context.a = pool;
  context.i = { C: 0, UC: 1, R: 2, SR: 3, SSR: 4, UR: 5, LR: 6 };
  for (const [choice, expected] of [['no', ['c', 'b', 'a']], ['score', ['b', 'c', 'a']], ['rarity', ['b', 'c', 'a']]]) {
    context.r = choice;
    assert.equal(vm.runInContext(`a.slice().sort(${sort[1]}).map(card=>card.id).join(',')`, context), expected.join(','));
  }
  assert.match(renderer, /t\.has\(e\.id\)/);
  assert.match(html, /er\([^)]*\.id\)/);
});

test('实际总图鉴缩略分支显示四位编号，未收集卡的可访问名称不泄露卡名', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const start = html.lastIndexOf('function Wn(');
  const end = html.indexOf('function ', start + 12);
  const context = {
    K: String, T: card => card.score, x: [], b: { C: '龙套', LR: '绝唱' },
    Ct: () => '<svg></svg>', pn: () => '<span class="seal"></span>',
    copyDimension: value => value, q: () => '', Fn: (owned, total) => `${owned}/${total}`,
    formatCardNoV43,
  };
  vm.createContext(context);
  vm.runInContext(html.slice(start, end), context);
  const markup = context.Wn({
    owned: ['owned'],
    pool: [
      { id: 'owned', name: '已收集角色', no: 1, rarity: 'LR', dimension: '主演' },
      { id: 'locked', name: '不应透露的角色', no: 2, rarity: 'C', dimension: '配角' },
    ],
  }, false);
  assert.equal((markup.match(/class="album-serial"/g) || []).length, 2);
  const visibleNumbers = [...markup.matchAll(/class="album-serial" aria-hidden="true">([^<]+)<\/span>/g)].map(match => match[1]);
  assert.deepEqual(visibleNumbers, ['0001', '0002']);
  assert.ok(visibleNumbers.every(text => text.length === 4));
  assert.match(markup, /aria-label="No\.0001，已收集角色，绝唱，主演"/);
  assert.match(markup, /aria-label="No\.0002，龙套，配角，尚未收入卡包"/);
  assert.doesNotMatch(markup, /不应透露的角色|class="score-line"/);
  assert.match(html, /<style id="number-format-v43">/);
});
