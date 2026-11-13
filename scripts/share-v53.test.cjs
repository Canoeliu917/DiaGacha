const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const startup='Zn.addEventListener(`click`,Tr),Er()';

function harness(){
  const stored=new Map(),shares=[];
  const sandbox={
    console,URL,URLSearchParams,Intl,
    navigator:{share:async value=>{shares.push(value);}},
    localStorage:{getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,String(value))},
    sessionStorage:{getItem:()=>null,setItem(){}},
    document:{querySelector:()=>({contains:()=>true}),getElementById:()=>null},
    location:{href:'https://canoeliu917.github.io/DiaGacha/?v=53',protocol:'https:',hash:'',search:'?v=53',pathname:'/DiaGacha/'},
    matchMedia:()=>({matches:true}),
  };
  sandbox.window=sandbox;
  const context=vm.createContext(sandbox);
  assert.equal(html.split(startup).length,2);
  const source=html.replace(startup,`const qrPayloadsV53=[],realQrV53=qrcode;
    qrcode=(type,level)=>{
      const qr=realQrV53(type,level),add=qr.addData;
      qr.addData=function(payload,...args){qrPayloadsV53.push(payload);return add.call(this,payload,...args);};
      return qr;
    };
    globalThis.testShare={e,activeCards,ar,Un,Xt,w,K,dramaticTitleV40,shortScene,socialPosterV53,shareTextV53,shareOrCopy,Y,qrPayloads:qrPayloadsV53,
    dispatchPosterAction(action){
      const calls=[],original=sharePoster;
      sharePoster=(button,mode='long')=>calls.push({mode});
      try{const button={dataset:{action}};Tr({target:{closest:()=>button}});}
      finally{sharePoster=original;}
      return calls;
    }
  }`);
  for(const [i,block]of [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].entries()){
    vm.runInContext(block[1],context,{filename:`share-inline-${i}`,timeout:10000});
  }
  return {...context.testShare,shares};
}

const game=harness();
const examples=[
  ['v23-play-viewbridge','style-v21-epistolary','dir-v21-endingloop','v23-role-silentman','v23-sup-zhaosan','place-zeng'],
  ['play-cherry','ystyle-street','ydir-handkerchief','xrole-pozzo','role2-duncan','place-v21-diningcar'],
  ['yplay-mrswarren','style-v21-radiodrama','dir-body','v23-role-serge','role2-liu-siye','place-meixiang'],
  ['play-godot','style-absurd','dir-freeze','role-vladimir','place-road'],
];
function draw(ids){return ids.map(id=>{const card=game.e.find(item=>item.id===id);assert.ok(card,id);return card;});}
function checkPoster(cards){
  const poster=game.socialPosterV53(cards);
  assert.match(poster,/class="social-poster-v53(?:[\s"])/);
  assert.doesNotMatch(poster,/undefined|\[object Object\]|\{(?:a|b|prop)\}/);
  const score=poster.match(/<b\b[^>]*class="social-score-v53"[^>]*>(\d+)<\/b>/)?.[1];
  assert.equal(Number(score),game.Xt(cards).score,'poster uses the actual final score');
  assert.ok(poster.includes(game.K(game.Xt(cards).scoring.grade)),'poster uses the actual grade');
  assert.match(poster,/虚构故事/);
  const cardIds=[...poster.matchAll(/data-card-id="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(cardIds.slice().sort(),cards.map(card=>card.id).sort());
  for(const card of cards)assert.ok(poster.includes(game.K(card.name)),card.id+' name');
  const title=game.dramaticTitleV40(cards).split('｜').at(-1);
  assert.ok(poster.includes(game.K(title)),title);
  assert.equal(game.qrPayloads.at(-1),'https://canoeliu917.github.io/DiaGacha/?v=53#m='+game.w(cards));
  assert.match(poster,/class="social-qr-v53"[\s\S]*?<svg\b/);
  return poster;
}

test('朋友圈图保留真实六卡、整台评分、故事标题及可复现组合的二维码',()=>{
  for(const ids of examples.slice(0,3))checkPoster(draw(ids));
});

test('旧五卡分享不补造配角，并保留真实分数、独角故事和旧链接组合',()=>{
  const cards=draw(examples[3]),poster=checkPoster(cards);
  assert.equal([...poster.matchAll(/data-card-id=/g)].length,5);
  assert.doesNotMatch(poster,/undefined|爱斯特拉冈|波卓|邓肯/);
  assert.match(game.shareTextV53(cards),/独自/);
});

test('500张常驻卡逐张进入真实六卡海报，生成过程不改变卡牌数据',()=>{
  const base=draw(examples[0]),before=JSON.stringify(game.activeCards);
  assert.equal(game.activeCards.length,500);
  for(const card of game.activeCards){
    checkPoster(base.map(item=>item.dimension===card.dimension?card:item));
  }
  assert.equal(JSON.stringify(game.activeCards),before);
});

test('海报中的人物和空间文字按HTML转义，不能变成标签或事件属性',()=>{
  const value='<img src=x onerror="alert(1)"> & "名字"';
  const cards=draw(examples[0]).map(card=>['主演','环境'].includes(card.dimension)?{...card,name:value}:card);
  const poster=checkPoster(cards);
  assert.ok(poster.includes(game.K(value)));
  assert.ok(!poster.includes(value));
  assert.doesNotMatch(poster,/<img src=x|\bonerror="alert\(1\)"/);
});

test('转发文案与当前主标题、分数和故事摘要一致，原生分享使用相同内容',async()=>{
  for(const ids of examples){
    const cards=draw(ids),text=game.shareTextV53(cards);
    assert.ok(text.includes(game.dramaticTitleV40(cards)));
    assert.ok(text.includes(String(game.Xt(cards).score)));
    assert.ok(text.includes(game.shortScene(cards)),'keep the current story summary');
    assert.doesNotMatch(text,/undefined|\[object Object\]/);
    game.Y.drawn=cards;
    await game.shareOrCopy();
    const share=game.shares.at(-1);
    assert.equal(share.text,text);
    assert.equal(share.title,game.dramaticTitleV40(cards));
    assert.equal(new URL(share.url).hash,'#m='+game.w(cards));
  }
});

test('结算页分别提供朋友圈精简图和完整长图入口，导出路由不串用',()=>{
  const page=game.Un({...game.ar(),drawn:draw(examples[0]),talkOpen:false});
  assert.match(page,/<button\b[^>]*data-action="poster-short"[^>]*>/);
  assert.match(page,/<button\b[^>]*data-action="poster"[^>]*>/);
  assert.equal(game.dispatchPosterAction('poster-short')[0]?.mode,'short');
  assert.equal(game.dispatchPosterAction('poster')[0]?.mode,'long');
});

test('实际页面内嵌的分享实现与样式与独立源一致',()=>{
  const normalized=html.replace(/\r\n/g,'\n');
  for(const file of ['share-v53.js','share-v53.css','poster-v48.js']){
    const source=fs.readFileSync(path.join(__dirname,file),'utf8').replace(/\r\n/g,'\n').trim();
    assert.ok(normalized.includes(source),file);
  }
});
