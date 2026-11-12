const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/ACTIVE_CARDS_V39.json'), 'utf8'));
const roleSources = JSON.parse(fs.readFileSync(path.join(root, 'docs/ROLE_SOURCES_V39.json'), 'utf8')).cards;
const stored = new Map([['diamasha.owned', JSON.stringify([manifest.activeIds[0],manifest.reserveIds[0]])]]);
const sandbox = {
  console, URL, URLSearchParams, Intl, navigator:{},
  localStorage:{getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,String(value))},
  sessionStorage:{getItem:()=>null,setItem(){}},
  document:{querySelector:()=>({}),getElementById:()=>null},
  location:{href:'https://example.invalid/',protocol:'https:',hash:'',search:'',pathname:'/'},
  matchMedia:()=>({matches:true}),
};
sandbox.window=sandbox;
const context=vm.createContext(sandbox);
const startup='Zn.addEventListener(`click`,Tr),Er()';
assert.equal(html.split(startup).length,2);
const script=html.replace(startup,'globalThis.testGame={e,activeCards,roleSourcesV39,roleSourceLine,ar,Wn,xn,Ct,T,Xt,An,hexRadar,scoreBreakdown,scoringHelp,clampTalk,cardEssays,cardReviewDetails,statAxesMarkupV40}');
for(const [i,block] of [...script.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries())vm.runInContext(block[1],context,{filename:`inline-${i}`,timeout:10000});
const game=context.testGame;
let passed=0;
function check(name,fn){fn();passed++;console.log('PASS '+name);}
const plain=value=>JSON.parse(JSON.stringify(value));

check('公开图鉴只显示500张，旧收藏中预留卡ID仍保留',()=>{
  const state=game.ar();
  assert.equal(state.poolSize,500);
  assert.equal(state.pool.length,500);
  assert.equal(state.owned.length,1);
  assert(JSON.parse(stored.get('diamasha.owned')).includes(manifest.reserveIds[0]));
  const album=game.Wn(state);
  const visibleIds=[...album.matchAll(/data-action="detail" data-id="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(visibleIds.length,500);
  assert.deepEqual(visibleIds.slice().sort(),manifest.activeIds.slice().sort());
});

check('所有主配角有明确来源行；塞尔吉出自艺术，同名亨利四世不串作',()=>{
  const roles=game.e.filter(c=>['主演','配角'].includes(c.dimension));
  assert.equal(roles.length,260);
  assert.equal(roleSources.length,260);
  for(const card of roles){
    const source=game.roleSourcesV39[card.id];
    assert(source&&source.sourcePlayLabel,card.id);
    const detail=game.xn(card);
    assert(detail.includes('role-source'),card.id);
    assert(!detail.includes('评分依据'),card.id);
  }
  assert(game.xn(roles.find(c=>c.name==='塞尔吉')).includes('《艺术》'));
  assert.equal(roles.find(c=>c.id==='yrole-falstaff').workIds.length,0);
  assert(game.xn(roles.find(c=>c.id==='yrole-falstaff')).includes('莎士比亚'));
});

check('500张释义保持完整句，没有旧补长残句或重复段落',()=>{
  for(const card of game.activeCards){
    for(const field of ['note','observe','stage']){
      assert(card[field]&&/[。！？]$/.test(card[field]),`${card.id}.${field}`);
      assert(!/(?:收回到|慢慢变成|把抽象的压力收回)[。！？]/.test(card[field]),`${card.id}.${field}`);
    }
    const essay=game.cardEssays[card.id]||'';
    const sentences=essay.match(/[^。！？]+[。！？]/g)||[];
    assert.equal(new Set(sentences).size,sentences.length,card.id);
    assert(!essay.includes('把抽象的压力收回到'),card.id);
    assert.equal(game.cardReviewDetails(card),'');
    assert(!game.xn(card).includes('看懂这张卡'));
    assert.equal((game.statAxesMarkupV40(card).match(/class="axis axis-(?:atk|def) stat-axis"/g)||[]).length,2);
    assert(!game.statAxesMarkupV40(card).includes('评分依据'));
    if(['SSR','UR','LR'].includes(card.rarity))assert.ok((game.xn(card).match(/class="card-essay"/g)||[]).length>={SSR:1,UR:2,LR:3}[card.rarity],`${card.id}: 高星介绍段落不足`);
  }
});

check('字数限制只省略完整句，不截断句子也不插入垫话',()=>{
  const first='这是一句比限制更长、但必须保持完整的说明。';
  assert.equal(game.clampTalk(first+'下一句。',3,8),first);
  assert.equal(game.clampTalk('句子很短。',200,300),'句子很短。');
});

check('六芒星以统一尺度放大分差，角分保持原值且没有刻度数字',()=>{
  const dims=['剧目','风格体系','导演手法','主演','配角','环境'];
  const scores=[0,20,40,60,80,100];
  const cards=dims.map((dimension,i)=>({...game.activeCards.find(c=>c.dimension===dimension),atk:scores[i],def:scores[i]}));
  const chart=game.hexRadar(cards);
  const points=chart.match(/data-base-points="([^"]+)"/)[1].split(' ').map(v=>v.split(',').map(Number));
  const lengths=[0,.06,.12,.35,.75,1].map(value=>92*value);
  points.forEach(([x,y],i)=>assert(Math.abs(Math.hypot(x-170,y-128)-lengths[i])<0.00001));
  assert(chart.includes('形状放大分差，数字为原分'));
  assert.deepEqual([...chart.matchAll(/data-final="(\d+)"/g)].map(match=>Number(match[1])),scores);
  assert.equal((chart.match(/class="hex-scale"/g)||[]).length,0);
  assert.equal((chart.match(/data-final="\d+"/g)||[]).length,6);
});

check('整场及奖励只显示整数，卡面教程集中到首页玩法',()=>{
  const dims=['剧目','风格体系','导演手法','主演','配角','环境'];
  const cards=dims.map(dimension=>game.activeCards.find(c=>c.dimension===dimension));
  const result=game.Xt(cards);
  assert(Number.isInteger(result.score));
  const text=game.scoreBreakdown(result.scoring,cards).replace(/<[^>]+>/g,'');
  assert(!/\d+\.\d+/.test(text));
  const help=game.scoringHelp({poolSize:500});
  assert(help.includes('500')&&help.includes('777')&&help.includes('277'));
  assert(help.includes('草台班子'));
  const review=game.An(cards,true);
  assert(review.includes('故事联想'));
  assert(review.includes('戏剧线索'));
  assert(!review.includes('不再独占')&&!review.includes('里的伦理分歧便会被简化'));
});

console.log(JSON.stringify({presentationChecks:passed,activeCards:game.activeCards.length,roleSources:roleSources.length}));
