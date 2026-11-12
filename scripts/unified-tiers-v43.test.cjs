const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {cardScore,rarityForScore}=require('./scoring-v38.js');
const root=path.resolve(__dirname,'..');

test('综合分按同一整数边界决定七档，四舍五入先于分档，参考分不参与',()=>{
  const bands=[['C',0,59],['UC',60,65],['R',66,71],['SR',72,77],['SSR',78,83],['UR',84,89],['LR',90,100]];
  for(const [rarity,low,high] of bands) for(let score=low;score<=high;score++) assert.equal(rarityForScore(score),rarity);
  assert.equal(rarityForScore(cardScore({atk:65,def:66,reference:100})), 'R');
  assert.equal(rarityForScore(cardScore({atk:89,def:90,reference:0})), 'LR');
  for(const value of [NaN,Infinity,-1,101,75.5,'75']) assert.throws(()=>rarityForScore(value),RangeError);
  const result=spawnSync('python',['-X','utf8','-c',"import json,runpy; m=runpy.run_path('scripts/rebalance-cards.py'); print(json.dumps([m['rarity_for_score'](n) for n in range(101)]))"],{cwd:root,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(JSON.parse(result.stdout),Array.from({length:101},(_,score)=>rarityForScore(score)));
});

test('迁移只应用已记录复评，保留其他当前分值、卡序和编号，不按旧分或名气重新生成',()=>{
  const fixture=fs.mkdtempSync(path.join(root,'../tier-migration-v43-'));
  const review={status:'有来源的编辑复评',reference:100,curation:99,sourceIds:['S'],atkRubric:[3,3,3],defRubric:[4,3,3],rationale:'已记录的具体复评。'};
  const cards=[
    {id:'reviewed',name:'先前复评',dimension:'剧目',atk:86,def:90,no:303,rarity:'C',review},
    {id:'anchor',name:'新锚点',dimension:'主演',atk:64,def:64,no:12,rarity:'UC',review:{...review,status:'历史编辑初评'}},
    {id:'historical',name:'历史卡',dimension:'环境',atk:65,def:66,no:107,rarity:'LR',review:{...review,status:'历史编辑初评',atkRubric:null,defRubric:null}},
  ];
  const baseline=cards.map(card=>({...card,fame:100,old:['C',50,50],score:cardScore(card),workIds:[]}));
  const anchor={id:'anchor',name:'新锚点',atkRubric:[4,4,3],defRubric:[4,4,3],reference:0,rationale:'独立文本判断。',sourceIds:['S'],author:'作者',atkReason:'要求引起明确的对抗。',defReason:'前因和后果相互照应。'};
  fs.mkdirSync(path.join(fixture,'docs'));
  fs.writeFileSync(path.join(fixture,'index.html'),'var e=JSON.parse(`'+JSON.stringify(cards)+'`)');
  fs.writeFileSync(path.join(fixture,'docs/cards.json'),JSON.stringify(baseline));
  fs.writeFileSync(path.join(fixture,'docs/SCORING_ANCHORS.json'),JSON.stringify({sources:{S:{title:'Source',url:'https://example.invalid/'}},cards:[anchor]}));
  fs.writeFileSync(path.join(fixture,'docs/WORK_LINKS.json'),JSON.stringify(Object.fromEntries(cards.map(card=>[card.id,{workIds:[]}]))));
  const code="import importlib.util,sys; from pathlib import Path; s=importlib.util.spec_from_file_location('migration','scripts/rebalance-cards.py'); m=importlib.util.module_from_spec(s); s.loader.exec_module(m); m.ROOT=Path(sys.argv[1]); m.rebuild()";
  const run=()=>spawnSync('python',['-X','utf8','-c',code,fixture],{cwd:root,encoding:'utf8'});
  const first=run();assert.equal(first.status,0,first.stderr);
  const output=JSON.parse(fs.readFileSync(path.join(fixture,'docs/cards.json'),'utf8'));
  assert.deepEqual(output.map(card=>[card.id,card.no]),cards.map(card=>[card.id,card.no]));
  assert.deepEqual(output.map(card=>[card.atk,card.def,card.score,card.rarity]),[[86,90,88,'UR'],[94,94,94,'LR'],[65,66,66,'R']]);
  assert.equal(output[0].review.rationale,review.rationale);
  assert.equal(output[1].review.atkReason,anchor.atkReason);
  assert.equal(output[1].review.defReason,anchor.defReason);
  assert.ok(output.every(card=>!Object.hasOwn(card.review,'curation')));
  assert.deepEqual(output.map(card=>card.review.reference),[100,0,100]);
  const before=fs.readFileSync(path.join(fixture,'index.html'),'utf8');
  const second=run();assert.equal(second.status,0,second.stderr);
  assert.equal(fs.readFileSync(path.join(fixture,'index.html'),'utf8'),before);
  for(const file of ['cards.json','SCORING_ANCHORS.json','WORK_LINKS.json'])fs.unlinkSync(path.join(fixture,'docs',file));
  fs.unlinkSync(path.join(fixture,'index.html'));fs.rmdirSync(path.join(fixture,'docs'));fs.rmdirSync(fixture);
});
