const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const talk=require('./talk-v39.js');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const cards=JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
require('./copy-overrides-v39.js').applyCopyOverridesV39(cards,{});
const active=new Set(JSON.parse(fs.readFileSync(path.join(root,'docs/ACTIVE_CARDS_V39.json'),'utf8')).activeIds);
const byId=new Map(cards.map(card=>[card.id,card]));
const dims=['剧目','风格体系','导演手法','主演','配角','环境'];
const pools=dims.map(dim=>cards.filter(card=>active.has(card.id)&&card.dimension===dim));
const base=['play-doue','style-real','dir-wall','role-fanyi','role2-kristine-linde','place-zeng'].map(id=>byId.get(id));
const change=(drawn,dimension,id)=>drawn.map(card=>card.dimension===dimension?byId.get(id):card);
const body=drawn=>talk.nn(drawn).join('');
function assertStory(drawn){
  const parts=talk.nn(drawn),text=parts.join('');
  assert.equal(parts.length,5);
  assert.match(parts[0],/^故事联想：.*虚构/);
  assert.doesNotMatch(text,/undefined|\[object Object\]|\{\w+\}|戏剧线索：|排练建议|具体含义是/);
  for(const part of parts){assert.ok(part.length>25,part);assert.match(part,/[。！？]$/);}
  assert.deepEqual(talk.nn([...drawn].reverse()),parts);
  assert.equal(talk.shortScene([...drawn].reverse()),talk.shortScene(drawn));
  assert.ok(talk.shortScene(drawn).length<=320);
}

test('六维组合产出连续故事，科普定义不冒充故事的结尾',()=>{
  assertStory(base);
  for(const card of cards.filter(card=>active.has(card.id)))assertStory(base.map(item=>item.dimension===card.dimension?card:item));
});
test('75种手段与75种演法分别在故事正文中产生可辨识的事件',()=>{
  for(const dim of ['导演手法','风格体系']){
    const texts=pools[dims.indexOf(dim)].map(card=>body(change(base,dim,card.id)));
    assert.equal(new Set(texts).size,75,dim);
    const summaries=pools[dims.indexOf(dim)].map(card=>talk.shortScene(change(base,dim,card.id)));
    assert.equal(new Set(summaries).size,75,dim+'摘要');
  }
  assert.notEqual(body(base),body(change(base,'导演手法','dir-montage')));
  assert.notEqual(body(base),body(change(base,'风格体系','style-v21-polyphonic')));
  assert.match(body(change(base,'导演手法','dir-montage')),/两个时刻|先前的承诺/);
  assert.match(body(change(base,'风格体系','style-v21-polyphonic')),/各保留一项要求/);
});
test('人物来源中的差异进入动机，不再只将繁漪改名为奥菲利娅',()=>{
  const other=change(base,'主演','xrole-ophelia');
  assert.notEqual(body(base).replaceAll('繁漪','角色'),body(other).replaceAll('奥菲利娅','角色'));
});
test('女性组合没有单数男性代词，旧五卡也不把娜拉称为他',()=>{
  const female=change(base,'主演','role-nora');
  const hasMalePronoun=text=>/(^|[^其])他(?!们|人)/.test(text);
  for(const play of pools[0]){
    const drawn=change(female,'剧目',play.id);
    for(const sample of [drawn,drawn.filter(card=>card.dimension!=='配角')]){
      assert.ok(!hasMalePronoun(body(sample)),body(sample));
      assert.ok(!hasMalePronoun(talk.shortScene(sample)),talk.shortScene(sample));
    }
  }
});
test('卡特琳与沉默的人在全部故事分支通过动作或文字参与，不被写成开口说话',()=>{
  const voices=/卡特琳(?:[^。！？；]{0,45})(?:说出口|低声说|说出|喊|唱|叫出|招呼了一声)|沉默的人(?:[^。！？；]{0,45})(?:说出口|低声说|说出|喊|唱|叫出|招呼了一声)/;
  for(const lead of ['role-yuji','v23-role-silentman'])for(const play of pools[0]){
    let drawn=change(change(base,'主演',lead),'剧目',play.id);
    for(const method of ['dir-solo','xdir-toplight','xdir-voiceover','dir-v21-simultaneoussolos']){
      const sample=change(drawn,'导演手法',method);assertStory(sample);
      assert.doesNotMatch(body(sample),voices);
      assert.doesNotMatch(talk.shortScene(sample),voices);
    }
    const solo=drawn.filter(card=>card.dimension!=='配角');assertStory(solo);assert.doesNotMatch(body(solo),voices);
  }
  const kattrin=change(change(base,'主演','role-yuji'),'导演手法','dir-solo');
  assert.match(body(kattrin),/手势|文字|写|动作/);
  assert.match(body(kattrin),/门外传来钥匙碰响/);
  assert.match(talk.shortScene(kattrin),/门外传来钥匙碰响/);
  assert.match(talk.shortScene(kattrin),/交出藏起的那一页/);
});
test('独立知识函数跳过空分类句，保留声音先行等卡的真实定义',()=>{
  const source=fs.readFileSync(path.join(root,'scripts/talk-v39.js'),'utf8');
  const reading=vm.runInNewContext(source+';cards=>theatreReadingV40(sceneContextV40(cards))');
  for(const id of ['v23-dir-soundfirst','v23-dir-objectchain','v23-dir-readstage']){
    const text=reading(change(base,'导演手法',id));
    assert.doesNotMatch(text,/具体含义是：一种舞台手段。/);
    assert.match(text,id==='v23-dir-soundfirst'?/音响或话语先到达/:id==='v23-dir-objectchain'?/依次传递/:/念出舞台提示/);
  }
});
