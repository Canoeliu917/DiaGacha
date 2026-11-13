const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const scoring=require('./scoring-v38.js');
const talk=require('./talk-v39.js');
const {DiaRatesV40}=require('./rates-v40.js');
const source=fs.readFileSync(path.join(__dirname,'gameplay-v53.js'),'utf8');
const root=path.resolve(__dirname,'..');
const cards=JSON.parse(fs.readFileSync(path.join(root,'docs/cards.json'),'utf8'));
const activeIds=new Set(JSON.parse(fs.readFileSync(path.join(root,'docs/ACTIVE_CARDS_V39.json'),'utf8')).activeIds);
const pool=cards.filter(card=>activeIds.has(card.id));
const ranks=Object.keys(DiaRatesV40.standard);
const dimensions=['剧目','风格体系','导演手法','主演','配角','环境'];
const base=dimensions.map(dimension=>pool.find(card=>card.dimension===dimension));
const score=drawn=>scoring.production(drawn);
const plain=value=>JSON.parse(JSON.stringify(value));
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
function resolveTier(cards,rank){
  const same=cards.filter(card=>card.rarity===rank);
  if(same.length)return same;
  const at=ranks.indexOf(rank);
  for(let distance=1;distance<ranks.length;distance++){
    for(const candidate of [at-distance,at+distance]){
      const matching=cards.filter(card=>card.rarity===ranks[candidate]);
      if(matching.length)return matching;
    }
  }
  return cards;
}
function harness(extra={}){
  const events=[];
  const context={module:{exports:{}},ee:resolveTier,DiaRatesV40,x:dimensions.map(key=>({key})),
    K:escape,copyDimension:dimension=>dimension,e:cards,productionScore:score,
    dramaticTitleV40:talk.dramaticTitleV40,shortScene:talk.shortScene,
    Y:{view:'result',drawn:base.slice(),owned:pool.map(card=>card.id),rehearsal:null,rehearsalPreview:'',fromShare:true},
    Z:()=>events.push('render'),Q:text=>events.push(text),finishProductionV40:()=>events.push('finish'),
    lastSharePoster:'old image',w:drawn=>drawn.map(card=>card.id).join('.'),
    sessionStorage:{setItem:(key,value)=>events.push({key,value})},
    history:{state:{existing:true},replaceState:(state,unused,url)=>events.push({state,url})},
    document:{getElementById:id=>({focus:()=>events.push('focus:'+id)}),querySelector:selector=>({focus:()=>events.push('focus:'+selector)})},
    ...extra,
  };
  vm.createContext(context);vm.runInContext(source,context);
  return {game:context.module.exports,context,events};
}
const {game}=harness();

test('普通与赠礼每维合计100%，1–4星单卡不超8%，5–7星总概率原样保留',()=>{
  const before=JSON.stringify(pool);
  for(const table of Object.values(DiaRatesV40))for(const dimension of dimensions){
    const rows=game.balancedWeightsV53(pool,dimension,table);
    assert.ok(Math.abs(rows.reduce((sum,row)=>sum+row.chance,0)-1)<1e-10,dimension);
    assert.equal(rows.length,pool.filter(card=>card.dimension===dimension).length);
    for(const {card,chance}of rows){assert.ok(chance>0&&Number.isFinite(chance),card.id);if(ranks.indexOf(card.rarity)<4)assert.ok(chance<=.08000000001,card.id);}
    const actual=game.actualRatesV53(pool,dimension,table);
    for(const rank of ['SSR','UR','LR'])assert.ok(Math.abs(actual[rank]-table[rank])<1e-10,dimension+rank);
    for(const rank of ranks){const probabilities=rows.filter(row=>row.card.rarity===rank).map(row=>row.chance);assert.ok(probabilities.every(chance=>Math.abs(chance-probabilities[0])<1e-10));}
  }
  assert.equal(JSON.stringify(pool),before);
});

test('三张44%热点实际降到8%，四部常见剧合计32%，高星掷点边界不被抬高',()=>{
  for(const id of ['style-v21-epistolary','dir-v21-endingloop','v23-role-silentman']){
    const card=pool.find(card=>card.id===id);
    const row=game.balancedWeightsV53(pool,card.dimension,DiaRatesV40.standard).find(row=>row.card.id===id);
    assert.equal(row.chance,.08);
  }
  assert.ok(Math.abs(game.actualRatesV53(pool,'剧目',DiaRatesV40.standard).R-32)<1e-10);
  for(const dimension of dimensions){
    assert.equal(game.drawBalancedV53(pool,dimension,DiaRatesV40.standard,()=>.8).rarity,'SR');
    assert.equal(game.drawBalancedV53(pool,dimension,DiaRatesV40.gift,()=>.8).rarity,'SSR');
    assert.equal(game.drawBalancedV53(pool,dimension,DiaRatesV40.standard,()=>.999999).rarity,'LR');
  }
});

test('真实抽取的概率区间覆盖全部500张常驻卡，不抽入预留卡',()=>{
  const reached=new Set();
  for(const dimension of dimensions){
    const rows=game.balancedWeightsV53(pool,dimension,DiaRatesV40.standard);
    let start=0;
    for(const row of rows){
      const card=game.drawBalancedV53(pool,dimension,DiaRatesV40.standard,()=>start+row.chance/2);
      assert.equal(card.id,row.card.id);
      assert.ok(activeIds.has(card.id));reached.add(card.id);start+=row.chance;
    }
  }
  assert.equal(reached.size,500);
});

test('预览不改原卡组，已收藏同维卡仅可确认一次，初始记录保留',()=>{
  const owned=pool.map(card=>card.id),state=game.createRehearsalV53(base);
  const candidate=pool.find(card=>card.dimension==='剧目'&&card.id!==base[0].id);
  const before=JSON.stringify({base,state,owned});
  const preview=game.previewRewriteV53(base,pool,owned,state,candidate.id,score);
  assert.equal(JSON.stringify({base,state,owned}),before);
  assert.equal(preview.drawn[0],candidate);
  assert.deepEqual(preview.drawn.slice(1),base.slice(1));
  assert.equal(preview.delta,score(preview.drawn).score-score(base).score);
  const result=game.applyRewriteV53(base,pool,owned,state,candidate.id,score);
  assert.deepEqual(plain(result.rehearsal.originalIds),base.map(card=>card.id));
  assert.deepEqual(plain(result.rehearsal.change),{fromId:base[0].id,toId:candidate.id,dimension:'剧目'});
  assert.equal(game.applyRewriteV53(result.drawn,pool,owned,result.rehearsal,base[0].id,score),null);
  assert.equal(game.applyRewriteV53(base,pool,[],state,candidate.id,score),null);
  assert.equal(game.applyRewriteV53(base,pool,owned,state,base[0].id,score),null);
});

test('允许为故事选择降分卡；旧五卡不会补出配角或变成六卡',()=>{
  const high=dimensions.map(dimension=>pool.filter(card=>card.dimension===dimension).sort((a,b)=>scoring.cardScore(b)-scoring.cardScore(a))[0]);
  const low=pool.filter(card=>card.dimension==='主演').sort((a,b)=>scoring.cardScore(a)-scoring.cardScore(b))[0];
  const result=game.applyRewriteV53(high,pool,[low.id],game.createRehearsalV53(high),low.id,score);
  assert.ok(result.delta<0);
  const solo=base.filter(card=>card.dimension!=='配角'),state=game.createRehearsalV53(solo),support=pool.find(card=>card.dimension==='配角');
  assert.equal(game.previewRewriteV53(solo,pool,[support.id],state,support.id,score),null);
  const lead=pool.find(card=>card.dimension==='主演'&&!solo.includes(card));
  const changed=game.applyRewriteV53(solo,pool,[lead.id],state,lead.id,score);
  assert.equal(changed.drawn.length,5);
  assert.ok(changed.drawn.every(card=>card.dimension!=='配角'));
  assert.equal(changed.rehearsal.originalIds.length,5);
});

test('恢复已改写过的初始版本仍不能再次换卡，不伪造一份换卡记录',()=>{
  const candidate=pool.find(card=>card.dimension==='剧目'&&card.id!==base[0].id);
  const rehearsal={...game.createRehearsalV53(base),locked:true};
  assert.equal(game.previewRewriteV53(base,pool,[candidate.id],rehearsal,candidate.id,score),null);
  assert.equal(game.applyRewriteV53(base,pool,[candidate.id],rehearsal,candidate.id,score),null);
  const markup=game.renderRehearsalV53({drawn:base,owned:[candidate.id],rehearsal},pool,score);
  assert.match(markup,/已经改写过一次，当前查看初始卡组/);
  assert.match(markup,/查看初始卡组/);
  assert.doesNotMatch(markup,/data-rewrite-choice|data-action="rewrite-confirm"/);
  assert.equal(rehearsal.change,null);
});

test('预览包含新标题和完整短故事，空收藏说明继续收集，完成后仍有初始卡组',()=>{
  const replacement=pool.find(card=>card.dimension==='剧目'&&card.id!==base[0].id);
  const state={drawn:base,owned:[replacement.id],rehearsal:game.createRehearsalV53(base),rehearsalPreview:replacement.id};
  const preview=game.previewRewriteV53(base,pool,state.owned,state.rehearsal,replacement.id,score);
  const markup=game.renderRehearsalV53(state,pool,score);
  assert.ok(markup.includes(escape(talk.shortScene(preview.drawn))));
  assert.ok(markup.includes(escape(talk.dramaticTitleV40(preview.drawn))));
  assert.match(markup,/分数升降都可以选择/);
  assert.doesNotMatch(markup,/排练|排戏|原抽卡/);
  assert.match(game.renderRehearsalV53({...state,owned:[]},pool,score),/还没有可替换的收藏/);
  const changed=game.applyRewriteV53(base,pool,state.owned,state.rehearsal,replacement.id,score);
  const done=game.renderRehearsalV53({...state,drawn:changed.drawn,rehearsal:changed.rehearsal},pool,score);
  assert.match(done,/本场换卡已用/);assert.match(done,/查看初始卡组/);assert.doesNotMatch(done,/data-action="rewrite-confirm"/);
});

test('确认改写后分享hash使用新卡、海报缓存失效、重渲染保存且焦点可继续操作',()=>{
  const {game,context,events}=harness();
  const replacement=pool.find(card=>card.dimension==='主演'&&card.id!==base.find(card=>card.dimension==='主演').id);
  const initialIds=base.map(card=>card.id);
  assert.equal(game.handleRehearsalV53('rewrite-preview',{value:replacement.id}),true);
  assert.deepEqual(context.Y.drawn.map(card=>card.id),initialIds);
  assert.ok(events.includes('focus:rewrite-choice-v53'));
  assert.equal(game.handleRehearsalV53('rewrite-confirm',{}),true);
  assert.equal(context.Y.drawn.find(card=>card.dimension==='主演').id,replacement.id);
  assert.deepEqual(plain(context.Y.rehearsal.originalIds),initialIds);
  assert.equal(context.lastSharePoster,null);
  assert.equal(context.Y.fromShare,false);
  const history=events.find(event=>event.url);
  assert.equal(history.url,'#m='+context.Y.drawn.map(card=>card.id).join('.'));
  assert.equal(history.state.existing,true);
  assert.ok(events.includes('focus:.rewrite-panel'));
  const after=JSON.stringify(context.Y.drawn);
  game.handleRehearsalV53('rewrite-confirm',{});
  assert.equal(JSON.stringify(context.Y.drawn),after);
});
