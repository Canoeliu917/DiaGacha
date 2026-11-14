const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const talk=require('./talk-v39.js');
const source=fs.readFileSync(path.join(__dirname,'talk-v39.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const cards=JSON.parse(html.match(/var e=JSON\.parse\(`([\s\S]*?)`\)/)[1]);
require('./copy-overrides-v39.js').applyCopyOverridesV39(cards,{});
const activeIds=new Set(JSON.parse(fs.readFileSync(path.join(root,'docs/ACTIVE_CARDS_V39.json'),'utf8')).activeIds);
const active=cards.filter(c=>activeIds.has(c.id));
const byId=new Map(cards.map(c=>[c.id,c]));
const dimensions=['剧目','风格体系','导演手法','主演','配角','环境'];
const pools=dimensions.map(dim=>active.filter(c=>c.dimension===dim));
const draw=ids=>ids.split('.').map(id=>{assert.ok(byId.has(id),id);return byId.get(id);});
const base=draw('yplay-birds.ystyle-errenzhuan.xdir-enter.yrole-qiuhu.role2-xiao-fuzi.yplace-gongtang');
const change=(drawn,id)=>drawn.map(c=>c.dimension===byId.get(id).dimension?byId.get(id):c);
const internals=vm.runInNewContext(source+';({storySpacesV54,sceneContextV40,storyPlaceV40,storyMethodV40,storyStyleV40,characterStrategyV54,characterMotiveV40})');
const stripNames=(text,drawn)=>drawn.reduce((s,c)=>s.replaceAll(c.name,'角色'),text);

test('500张常驻卡逐维替换后，六张准确卡名都进入连续正文而非文末清单',()=>{
  for(const card of active){
    const drawn=change(base,card.id),parts=talk.nn(drawn),body=parts.join('');
    assert.equal(parts.length,5);
    for(const item of drawn)assert.ok(body.includes(item.name),`${card.id}: ${item.name}`);
    assert.match(parts[0],/^故事联想：.*虚构/);
    assert.doesNotMatch(body,/undefined|\[object Object\]|\{\w+\}|渐渐安静下来|最危险的一件事|先前看似无关的小事/);
    const prose=drawn.reduce((s,c)=>s.replaceAll(c.name,''),body);
    assert.doesNotMatch(prose,/排练|排演|不妨让|建议.*表演|演员|观众/);
    assert.deepEqual(talk.nn([...drawn].reverse()),parts);
  }
});

test('65个空间有明确条件；去掉空间名称后仍有65种不同正文',()=>{
  const spaces=pools[5];
  assert.equal(spaces.length,65);
  const scenes=new Set();
  for(const place of spaces){
    assert.ok(internals.storySpacesV54[place.id],place.id);
    const drawn=change(base,place.id),c=internals.sceneContextV40(drawn),space=internals.storyPlaceV40(c);
    assert.ok(space.open.includes(place.name),place.id);
    assert.ok(space.turn.length>20,place.id);
    scenes.add(stripNames(space.open+space.turn,drawn));
  }
  assert.equal(scenes.size,65);
  assert.match(talk.nn(change(base,'xplace-grave')).join(''),/守墓人.*锁链/);
  assert.match(talk.nn(change(base,'yplace-gongtang')).join(''),/记录簿.*经手/);
  assert.match(talk.nn(change(base,'place-v21-photostudio')).join(''),/照片.*日期/);
});

test('三女巫是群体，不与一个配角被称作两人；双人剧不再否认刚出现的经手者',()=>{
  const drawn=change(base,'yrole-witches');
  for(const text of [talk.nn(drawn).join(''),talk.shortScene(drawn),talk.shareStoryBeatV54(drawn)])assert.doesNotMatch(text,/两人|两个人/);
  const body=talk.nn(base).join('');
  assert.match(body,/来人放稳东西便退开/);
  assert.match(body,/旁人即使经过，也不能替双方决定/);
  assert.doesNotMatch(body,/没有第三个人|附近没有可以代为传话的人/);
});

test('185人物的独有关注事项选择对应行动，人物不能抢先完成与主干相反的结局',()=>{
  const traits=JSON.parse(fs.readFileSync(path.join(__dirname,'story-characters-v54.json'),'utf8'));
  const roles=active.filter(c=>['主演','配角'].includes(c.dimension));
  assert.equal(roles.length,185);
  for(const role of roles){
    assert.ok(traits[role.id]?.move,role.id);
    assert.ok(traits[role.id]?.cost,role.id);
    const drawn=change(base,role.id),body=talk.nn(drawn).join('');
    assert.ok(body.includes(traits[role.id].priority),`角色的关注事项丢失: ${role.id}`);
    const other=drawn.find(c=>c.dimension===(role.dimension==='主演'?'配角':'主演')).name;
    const lead=drawn.find(c=>c.dimension==='主演');
    const same=role.dimension==='配角'&&internals.characterStrategyV54(lead).key===internals.characterStrategyV54(role).key;
    const move=internals.characterMotiveV40(role,other,'水壶和干粮包',same);
    assert.ok(body.includes(move),`由角色关注事项产生的行动丢失: ${role.id}`);
    assert.doesNotMatch(move.slice(move.indexOf('。')+1),/拿起行李离开|把.*送走|已经取得|结束.*等待|份额里.*钱/);
  }
  const bailu=change(base,'role-bailu');
  assert.notEqual(stripNames(talk.nn(base).join(''),base),stripNames(talk.nn(bailu).join(''),bailu));
  assert.notEqual(stripNames(talk.shortScene(base),base),stripNames(talk.shortScene(bailu),bailu));
  assert.notEqual(stripNames(talk.shareStoryBeatV54(base),base),stripNames(talk.shareStoryBeatV54(bailu),bailu));
  assert.equal(internals.characterStrategyV54(byId.get('yrole-qiuhu')).key,'grievance');
  assert.equal(internals.characterStrategyV54(byId.get('role-bailu')).key,'aid');
  const strategies=JSON.parse(fs.readFileSync(path.join(__dirname,'story-character-strategies-v54.json'),'utf8'));
  assert.deepEqual(Object.keys(strategies).sort(),roles.map(c=>c.id).sort());
  assert.ok(!Object.values(strategies).includes('caution'));
  const same=change(base,'role2-macduff'),sameBody=talk.nn(same).join('');
  assert.match(sameBody,/仇虎.*另列未了的旧责/);
  assert.match(sameBody,/麦克德夫在旧责旁补上自己记得的经过/);
  assert.doesNotMatch(sameBody,/最难承受的后果|一句话就能获得的轻松|最在意的是/);
});

test('食品、行李、白画和无声人物保持同一个事件状态，旧五卡也保留五名与具体手段',()=>{
  for(const lead of ['yrole-qiuhu','role-bailu']){
    const drawn=change(base,lead);
    assert.doesNotMatch(talk.nn(drawn).join('')+talk.shortScene(drawn),/家用|住宿费|新生活的钱|份额里.*钱/);
  }
  const home=draw('play-doll.style-stan.dir-v21-proptransfer.role-shen.role2-kristine-linde.place-parlor');
  const homeText=talk.nn(home).join('');
  assert.match(homeText,/只是保管/);
  assert.match(homeText,/沈黛没有再解释自己的去向，只拿回行李/);
  assert.doesNotMatch(homeText,/同意让.*使用.*行李|怕交出属于自己的行李/);
  assert.match(talk.shareStoryBeatV54(home),/沈黛拿起自己的行李离开/);
  const silent=draw('play-godot.style-absurd.dir-v21-endingloop.v23-role-silentman.role2-nell.place-road');
  const silentText=talk.nn(silent).join('');
  assert.doesNotMatch(silentText,/谁都说|结束无休止的等待|剩下的路只能用自己的脚走完|沉默的人说/);
  assert.match(silentText,/脚却留在原处/);
  const solo=draw('play-godot.style-absurd.dir-freeze.role-vladimir.place-road');
  for(const card of solo)assert.ok(talk.nn(solo).join('').includes(card.name),card.id);
  assert.match(talk.nn(solo)[2],/定格静场.*停顿/);
  assert.notEqual(talk.nn(solo)[2],talk.nn(change(solo,'dir-body'))[2]);
  assert.notEqual(talk.shortScene(solo),talk.shortScene(change(solo,'xdir-enter')));
  assert.notEqual(talk.shortScene(solo),talk.shortScene(change(solo,'style-v21-epistolary')));
  assert.doesNotMatch(talk.nn(change(solo,'place-v21-diningcar')).join(''),/等到了未到的来客/);
  const warren=draw('yplay-mrswarren.style-v21-radiodrama.dir-body.v23-role-serge.place-meixiang');
  const warrenText=talk.nn(warren).join('');
  for(const card of warren)assert.ok(warrenText.includes(card.name),card.id);
  assert.match(warrenText,/白画/);
  assert.match(warrenText,/决定先缩小展览规模/);
  assert.doesNotMatch(warrenText,/刘四爷|好友|undefined/);
  assert.equal((talk.shareStoryBeatV54(solo).match(/。/g)||[]).length,2);
  const warrenPair=draw('yplay-mrswarren.style-v21-radiodrama.dir-body.v23-role-serge.role2-liu-siye.place-meixiang');
  assert.doesNotMatch(talk.shareStoryBeatV54(warrenPair),/自己也曾依靠这笔钱/);
  const warrenMethod=internals.storyMethodV40(internals.sceneContextV40(warrenPair)).split('。')[0];
  assert.match(warrenMethod,/塞尔吉按住账簿.*刘四爷伸手遮住/);
  assert.ok(talk.nn(warrenPair).join('').includes(warrenMethod));
  assert.ok(talk.shortScene(warrenPair).includes(warrenMethod));
  const immobile=draw('play-godot.style-v21-courtroom.dir-v21-endingloop.yrole-witches.role2-nagg.xplace-grave');
  assert.doesNotMatch(talk.nn(immobile).join(''),/同时迎上去|同时迎向|再次伸出开场时伸出的手/);
  const blind=draw('play-lear.style-epic.dir-body.yrole-hamm.role2-sonya.place-parlor');
  assert.match(talk.nn(blind).join(''),/汉姆请索尼娅把图上的份额逐个读出，才听清/);
});

test('每个手段与演法都改变动作；静默开场明确回顾，结尾回环发生在决定之后',()=>{
  for(const dim of ['导演手法','风格体系']){
    const texts=active.filter(c=>c.dimension===dim).map(card=>{
      const drawn=change(base,card.id),c=internals.sceneContextV40(drawn);
      const beat=dim==='导演手法'?internals.storyMethodV40(c):internals.storyStyleV40(c);
      assert.ok(beat.includes(card.name),card.id);
      return beat.replaceAll(card.name,'');
    });
    assert.equal(new Set(texts).size,75);
  }
  assert.match(talk.nn(change(base,'v23-dir-silentopen')).join(''),/回想刚才的静默开场/);
  const loop=talk.nn(change(base,'dir-v21-endingloop'));
  assert.ok(loop[4].includes('结尾回环'));
  assert.ok(!loop.slice(0,4).join('').includes('结尾回环'));
});

test('无声人物经过所有手段与演法也不被要求开口，分享与正文一致',()=>{
  for(const lead of ['role-yuji','v23-role-silentman'])for(const play of ['yplay-birds','play-v21-majorbarbara','v23-play-art','play-godot']){
    const seed=change(change(base,lead),play),name=byId.get(lead).name;
    for(const card of active.filter(c=>['导演手法','风格体系'].includes(c.dimension))){
      const drawn=change(seed,card.id),body=talk.nn(drawn).join('')+talk.shareStoryBeatV54(drawn);
      assert.doesNotMatch(body,new RegExp(name+'[^。；，]{0,12}(?:开口|喊出|唱出|说得太快|先说|又说|脱口)'),card.id);
      assert.doesNotMatch(body,/谁都说|双方说好|两人说好|与小福子说好/,card.id);
    }
  }
});

test('名牌可被摆放后收起，食品持有者和私人资金目标不在转折中倒置',()=>{
  const identity=draw('v23-play-art.ystyle-ritualstyle.xdir-backturn.xrole-cao.role2-nell.place-v21-diningcar');
  const identityText=talk.nn(identity).join('')+talk.shortScene(identity);
  assert.doesNotMatch(identityText,/摘下.*名牌|取下.*名牌/);
  assert.match(identityText,/谁能使用这个名字/);
  assert.match(identityText,/收起写着假名的名牌/);
  const shelter=change(change(base,'v23-dir-silentopen'),'yplace-crossroad');
  const shelterText=talk.nn(shelter).join('');
  assert.match(shelterText,/仇虎只是移近水壶和干粮包，并未答应交出/);
  assert.doesNotMatch(shelterText,/小福子只是移近水壶和干粮包，并未答应交出|确认门外是否安全/);
  for(const play of ['play-v21-americandream','xplay-lou']){
    const drawn=change(base,play),text=talk.nn(drawn).join('')+talk.shortScene(drawn)+talk.dramaticTitleV40(drawn);
    assert.doesNotMatch(text,/善款|好事/);
    assert.match(text,/原先.*计划/);
  }
});

test('2000组组合的摘要保留同一个最后决定，不截断句子或靠评分改变结局',()=>{
  let state=20261114;
  const random=size=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return Math.floor(state/4294967296*size);};
  for(let i=0;i<2000;i++){
    const drawn=pools.map(pool=>pool[random(pool.length)]),short=talk.shortScene(drawn),ending=talk.shareStoryBeatV54(drawn);
    assert.ok(short.endsWith(ending),drawn.map(c=>c.id).join('.'));
    assert.equal((ending.match(/。/g)||[]).length,2,ending);
    assert.ok(short.length<=320,short);
    assert.match(short,/[。！？]$/);
    assert.doesNotMatch(short,/undefined|\{\w+\}|。{2}/);
    const rescored=drawn.map(c=>({...c,atk:100,def:100,rarity:'LR'}));
    assert.equal(talk.nn(rescored).join(''),talk.nn(drawn).join(''));
  }
  const money=draw('play-v21-majorbarbara.style-v21-courtroom.dir-v21-endingloop.role-v21-winnie.v23-sup-catherine.place-v21-diningcar');
  assert.match(talk.shortScene(money),/决定还债以后/);
});
