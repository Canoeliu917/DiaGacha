const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){
 const values=new Map(),control={writes:0,failAt:0};
 const context={module:{exports:{}},e:[{id:'a'},{id:'b'}],x:[{key:'剧目'}],ke:'diamasha.tasks',LOOP_KEY:'diamasha.loop',sessionKeyV53:'diamasha.session.v53',re:()=>null,
 localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>{if(++control.writes===control.failAt)throw Error('quota');values.set(k,v)},removeItem:k=>values.delete(k)}};
 vm.createContext(context);
 for(const name of ['collection-v54.js','v54-achievements.js','save-v54.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+name,'utf8'),context);
 const input={format:'diagacha-save',version:1,collection:{owned:['a','b'],credits:3},progress:{version:1,unlocked:['opening'],dimensions:[],starter:null,previews:[]},task:{charges:1,mix:2,lineup:true,claimed:{lineup:true}},loop:{pitySSR:2,pityUR:2,dailyDate:'2026-11-14',dailyClaimed:false,blessedNext:false,pendingDim:'',milestones:{},cosmetics:[],pendingMilestone:0},session:{recent:[]}};
 return {...context.module.exports,context,values,control,input};
}
test('valid backup restores collection, credits and progress without awarding new rewards',()=>{
 const s=setup();s.commitSaveV54(s.input);s.commitSaveV54(s.input);
 assert.equal(JSON.parse(s.values.get('diamasha.collection.v54')).credits,3);
 assert.deepEqual(JSON.parse(s.values.get('diamasha.owned')),['a','b']);
 assert.deepEqual(JSON.parse(s.values.get('diamasha.progress.v54')).unlocked,['opening']);
});
test('unknown cards and wrong save versions cannot partially write',()=>{
 for(const change of [o=>o.version=9,o=>o.collection.owned=['missing'],o=>o.collection.credits=-1,o=>delete o.progress]){
  const s=setup();change(s.input);assert.throws(()=>s.commitSaveV54(s.input));assert.equal(s.control.writes,0);
 }
});
test('mid-import storage failure rolls every previous value back',()=>{
 const s=setup();s.values.set('diamasha.owned','["a"]');s.values.set('diamasha.collection.v54','old collection');
 const before=[...s.values.entries()];s.control.failAt=3;
 assert.throws(()=>s.commitSaveV54(s.input),/导入没有完成/);
 assert.deepEqual([...s.values.entries()],before);
});
test('share and copy rewards are never restored as claimable tasks',()=>{
 const s=setup();s.input.task.share=true;s.input.task.copy=true;s.input.task.claimed={share:true,copy:true,mix3:true};
 const saved=s.validateSaveV54(s.input);assert.equal(saved.task.share,false);assert.equal(saved.task.copy,false);
 assert.deepEqual(JSON.parse(JSON.stringify(saved.task.claimed)),{mix3:true});
});

test('export from an older open page includes the latest stored cards and credits',()=>{
 const s=setup(),c=s.context;s.commitSaveV54(s.input);
 let downloaded;
 Object.assign(c,{storageFailedV53:false,saveSessionV53(){},sessionV53:{recent:[]},Y:{task:{}},Me:()=>s.input.task,loadLoop:()=>s.input.loop,
  Blob:class{constructor(parts){downloaded=JSON.parse(parts[0]);}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},
  document:{createElement:()=>({click(){},remove(){}}),body:{append(){}}},setTimeout(){},Q(){}});
 c.exportSaveV54();
 assert.deepEqual(downloaded.collection.owned,['a','b']);assert.equal(downloaded.collection.credits,3);
 assert.deepEqual(downloaded.progress.unlocked,['opening']);assert.equal(downloaded.task.charges,1);
});
