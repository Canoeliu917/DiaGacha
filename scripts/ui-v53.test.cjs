const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sandbox={console,URL,URLSearchParams,Intl,navigator:{},localStorage:{getItem:()=>null,setItem(){}},sessionStorage:{getItem:()=>null,setItem(){}},document:{querySelector:()=>({}),getElementById:()=>null},location:{href:'https://example.test/',protocol:'https:',hash:'',search:'',pathname:'/'},matchMedia:()=>({matches:true})};
sandbox.window=sandbox;
const context=vm.createContext(sandbox);
const source=html.replace('Zn.addEventListener(`click`,Tr),Er()','globalThis.game={e,activeCards,Y,ar,Wn,albumPageV53,stagePersonaV53,stagePersonaMarkupV53}');
for(const block of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))vm.runInContext(block[1],context,{timeout:10000});
const game=context.game;

test('图鉴分页覆盖500卡且无重复，首屏只构建48张图记',()=>{
  const ids=[];
  for(let i=0;i<11;i++)ids.push(...game.albumPageV53(game.activeCards,i).cards.map(card=>card.id));
  assert.equal(ids.length,500);assert.equal(new Set(ids).size,500);
  const markup=game.Wn(game.ar());
  assert.equal((markup.match(/class="album-hit"/g)||[]).length,48);
  assert.match(markup,/1 \/ 11 页 · 500 张/);
  assert.equal(game.albumPageV53([],9).current,0);
  assert.equal(game.albumPageV53(game.activeCards,999).cards.length,20);
});

test('戏格按实际演法与手段稳定生成，十二种均可由真实常驻卡到达',()=>{
  const names=new Set(),styles=game.activeCards.filter(card=>card.dimension==='风格体系'),methods=game.activeCards.filter(card=>card.dimension==='导演手法');
  for(const style of styles)for(const method of methods){
    const cards=[style,method],result=game.stagePersonaV53(cards);
    assert.deepEqual(result,game.stagePersonaV53(cards.slice().reverse()));
    assert.ok(result.basis.includes(style.name));assert.ok(result.basis.includes(method.name));
    assert.ok(!/击败|百分|超过|心理诊断/.test(result.line));names.add(result.name);
  }
  assert.equal(names.size,12);
});

test('新增UI与分享模块保持源码内嵌一致',()=>{
  const normalize=text=>text.replaceAll('\r\n','\n').trim();
  for(const file of ['ui-v53.js','ui-v53.css','share-v53.js','share-v53.css'])assert.ok(normalize(html).includes(normalize(fs.readFileSync(path.join(root,'scripts',file),'utf8'))),file);
});
