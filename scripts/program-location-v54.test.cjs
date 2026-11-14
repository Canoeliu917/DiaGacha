const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context=vm.createContext({location:{protocol:'https:',pathname:'/DiaGacha/'}});
vm.runInContext(fs.readFileSync(require.resolve('./share-v53.js'),'utf8'),context);
const ids='play-godot.style-absurd.dir-freeze.role-vladimir.place-road';

test('节目单地址保留同源项目根，并把固定版本放入真实路径',()=>{
  for(const pathname of ['/DiaGacha/','/DiaGacha/index.html','/DiaGacha']){
    const actual=context.programLocationV54(ids,{protocol:'https:',pathname});
    assert.equal(actual,'/DiaGacha/releases/v54/index.html#m='+ids);
    assert.equal(new URL(actual,'https://example.org/DiaGacha/').origin,'https://example.org');
  }
  assert.equal(context.programLocationV54(ids),'/DiaGacha/releases/v54/index.html#m='+ids);
});

test('版本归档内再次生成节目单不会嵌套releases路径',()=>{
  for(const pathname of ['/DiaGacha/releases/v54/index.html','/DiaGacha/releases/v54/','/DiaGacha/releases/v53/index.html']){
    assert.equal(context.programLocationV54(ids,{protocol:'https:',pathname}),'/DiaGacha/releases/v54/index.html#m='+ids);
  }
});

test('根站点和任意子目录部署都使用当前站点下的归档',()=>{
  assert.equal(context.programLocationV54(ids,{protocol:'http:',pathname:'/'}),'/releases/v54/index.html#m='+ids);
  assert.equal(context.programLocationV54(ids,{protocol:'http:',pathname:'/index.html'}),'/releases/v54/index.html#m='+ids);
  assert.equal(context.programLocationV54(ids,{protocol:'https:',pathname:'/games/theatre/'}),'/games/theatre/releases/v54/index.html#m='+ids);
});

test('直接打开本地HTML时只更新卡组hash，不跳到不存在的归档目录',()=>{
  assert.equal(context.programLocationV54(ids,{protocol:'file:',pathname:'/C:/games/DiaGacha/index.html'}),'#m='+ids);
});
