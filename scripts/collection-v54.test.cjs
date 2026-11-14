const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/collection-v54.js','utf8');
const ctx={module:{exports:{}},e:[{id:'a'},{id:'b'},{id:'c'}],localStorage:{getItem:()=>null}};
vm.runInNewContext(source,ctx);const {cleanCollectionV54,planDrawCollectionV54}=ctx.module.exports;
const plain=v=>JSON.parse(JSON.stringify(v));
test('same-pack duplicates and owned duplicates each pay exactly once',()=>{
 const next=planDrawCollectionV54({owned:['a'],credits:2},[{id:'a'},{id:'b'},{id:'b'}]);
 assert.deepEqual(plain(next),{owned:['a','b'],credits:4,lastDraw:{ids:['a','b','b'],fresh:['b'],repeated:['a','b']}});
});
test('single repeat refunds its spent credit; new single consumes it',()=>{
 assert.equal(planDrawCollectionV54({owned:['a'],credits:1},[{id:'a'}],1).credits,1);
 assert.equal(planDrawCollectionV54({owned:['a'],credits:1},[{id:'b'}],1).credits,0);
});
test('zero credits cannot be spent, including repeated cards',()=>{
 assert.throws(()=>planDrawCollectionV54({owned:['a'],credits:0},[{id:'a'}],1));
});
test('opening saved collection restores balance without paying again',()=>{
 const next=planDrawCollectionV54({owned:['a'],credits:0},[{id:'a'}]);
 const restored=cleanCollectionV54(JSON.parse(JSON.stringify(next)),ctx.e);
 assert.equal(restored.credits,1);assert.equal(restored.lastDraw,null);
});
test('invalid imported balances or unknown cards are rejected',()=>{
 for(const credits of [-1,1.2,Infinity,'2'])assert.throws(()=>cleanCollectionV54({owned:[],credits},ctx.e));
 assert.throws(()=>cleanCollectionV54({owned:['unknown'],credits:0},ctx.e));
});
test('cards earned in an older release merge without generating duplicate credits',()=>{
 const next={module:{exports:{}},e:ctx.e,localStorage:{getItem:k=>k==='diamasha.collection.v54'?JSON.stringify({owned:['a'],credits:2}):JSON.stringify(['a','b'])}};
 vm.runInNewContext(source+';globalThis.restoredCollection=collectionV54;',next);
 assert.deepEqual(plain(next.restoredCollection),{owned:['a','b'],credits:2,lastDraw:null});
});
test('a draw reads another tab latest collection and credit balance before settling',()=>{
 const values=new Map(),next={module:{exports:{}},e:ctx.e,Y:{owned:[]},storageFailedV53:false,localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)}};
 vm.createContext(next);vm.runInContext(source,next);
 values.set('diamasha.collection.v54',JSON.stringify({owned:['a'],credits:3}));
 vm.runInContext('settleDrawV54([{id:"b"}],1)',next);
 const saved=JSON.parse(values.get('diamasha.collection.v54'));
 assert.deepEqual(saved.owned,['a','b']);assert.equal(saved.credits,2);
});
