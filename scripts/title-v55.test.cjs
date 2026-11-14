const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const talk=require('./talk-v39.js');
const entries=require('./story-titles-v55.json');
const report=require('../docs/STORY_TITLE_COVERAGE_V55.json');
const fixtures=require('./story-title-v54-fixtures.json');
const source=fs.readFileSync(path.join(__dirname,'talk-v39.js'),'utf8');
const api=vm.runInNewContext(source+';({sceneContextV40,storyKeyV53,characterStrategyV54,storyTitleCandidatesV55,storyTitlesV55,storyTitlesV52})');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const cards=JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
require('./copy-overrides-v39.js').applyCopyOverridesV39(cards,{});
const byId=new Map(cards.map(c=>[c.id,c]));
const activeIds=new Set(JSON.parse(fs.readFileSync(path.join(root,'docs/ACTIVE_CARDS_V39.json'),'utf8')).activeIds);
const dims=['剧目','风格体系','导演手法','主演','配角','环境'];
const pools=dims.map(dim=>cards.filter(c=>c.dimension===dim&&activeIds.has(c.id)));
const core=title=>title.split('｜').at(-1);
const draw=ids=>ids.map(id=>{assert.ok(byId.has(id),id);return byId.get(id);});

test('至少100条完整新主标题有明确人物条件，主标题无旧文案复用或姓名前缀填数',()=>{
  assert.equal(entries.length,112);
  assert.equal(new Set(entries.map(e=>e.title)).size,112);
  assert.deepEqual(JSON.parse(JSON.stringify(api.storyTitlesV55)),entries);
  const old=new Set(Object.values(api.storyTitlesV52).flat());
  for(const entry of entries){
    assert.ok(!old.has(entry.title),entry.title);
    assert.ok(['lead','support'].includes(entry.actor));
    assert.ok(entry.branch&&entry.strategy&&entry.anchor);
    assert.doesNotMatch(entry.title,/[{}｜]|两个人|两人|亲眼|开口|喊出/);
    assert.ok(entry.title.length>=8&&entry.title.length<=25,entry.title);
  }
});

test('112条新标题均有真实可达卡组，108条可由正常六卡选择，错误人物策略不能套用',()=>{
  assert.equal(report.witnesses.length,112);
  assert.equal(report.witnesses.filter(w=>w.exampleIds.length===6).length,108);
  for(const witness of report.witnesses){
    const drawn=draw(witness.exampleIds),context=api.sceneContextV40(drawn);
    assert.ok(drawn.every(c=>activeIds.has(c.id)),witness.title);
    assert.equal(api.storyKeyV53(context),witness.branch);
    assert.equal(api.characterStrategyV54(context[witness.actor]).key,witness.strategy);
    assert.equal(core(talk.dramaticTitleV55(drawn)),witness.title);
    assert.ok(talk.nn(drawn).join('').includes(witness.anchor),witness.title);
    const dim=witness.actor==='lead'?'主演':'配角';
    const different=cards.find(c=>activeIds.has(c.id)&&c.dimension===dim&&api.characterStrategyV54(c).key!==witness.strategy);
    const replaced=drawn.map(c=>c.dimension===dim?different:c);
    assert.ok(!api.storyTitleCandidatesV55(api.sceneContextV40(replaced)).some(e=>e.title===witness.title),witness.title);
    assert.notEqual(core(talk.dramaticTitleV55(replaced)),witness.title);
  }
});

test('v55只新增标题入口；v54主标题与已复验核心故事保持一致',()=>{
  for(const fixture of fixtures){
    const drawn=draw(fixture.ids);
    assert.equal(talk.dramaticTitleV40(drawn),fixture.title,fixture.label);
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(talk.nn(drawn))).digest('hex'),fixture.storySha256,fixture.label);
  }
});

test('标题稳定、无卡片变更、无评分依赖，并能安全接到旧展示入口',()=>{
  const base=pools.map(pool=>pool[0]);
  for(const card of cards.filter(c=>activeIds.has(c.id))){
    const drawn=base.map(c=>c.dimension===card.dimension?card:c),before=JSON.stringify(drawn);
    const title=talk.dramaticTitleV55(drawn);
    assert.ok(title.length>=4&&title.length<=35,title);
    assert.doesNotMatch(title,/undefined|null|[{}<>\r\n]/);
    assert.equal(talk.dramaticTitleV55([...drawn].reverse()),title);
    assert.equal(talk.dramaticTitleV55(drawn.map(c=>({...c,atk:100,def:100,rarity:'LR'}))),title);
    assert.equal(JSON.stringify(drawn),before);
  }
  const aliased=vm.runInNewContext(source+';dramaticTitleV40=dramaticTitleV55;dramaticTitleV40;',{});
  assert.equal(aliased(base),talk.dramaticTitleV55(base));
});

test('独立抽样观察到100种以上新主标题，统计不把地点差异当作新标题',()=>{
  let seed=0x55d1a;const random=size=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return Math.floor(seed/4294967296*size);};
  const newTitles=new Set(entries.map(e=>e.title)),seen=new Set(),all=new Set();
  for(let i=0;i<5000;i++){
    const title=core(talk.dramaticTitleV55(pools.map(pool=>pool[random(pool.length)])));
    all.add(title);if(newTitles.has(title))seen.add(title);
  }
  assert.ok(seen.size>=100,`仅观察到${seen.size}条新主标题`);
  assert.equal(seen.size,report.newObservedCoreTitles);
  assert.equal(all.size,report.v55ObservedCoreTitles);
});

test('群体和已知能力限制保留在新版标题的适配中',()=>{
  const cases=[
    'play-godot.style-v21-courtroom.dir-v21-endingloop.yrole-witches.role2-nagg.xplace-grave',
    'play-godot.style-absurd.dir-v21-endingloop.v23-role-silentman.role2-nell.place-road',
    'play-lear.style-epic.dir-body.yrole-hamm.role2-sonya.place-parlor',
  ];
  for(const ids of cases){
    const title=talk.dramaticTitleV55(draw(ids.split('.')));
    assert.doesNotMatch(title,/两个人|两人|亲眼|开口|喊出|倒着走|站回|直起身/);
  }
});
