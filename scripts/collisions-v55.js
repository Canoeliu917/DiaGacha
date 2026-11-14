// Curated events are creative possibilities, not additions to the generated story.
const DiaCollisionsV55=(()=>{
  const data=typeof collisionDataV55!=='undefined'?collisionDataV55:require('./collision-data-v55.json');
  const originalPairs=new Set(['剧目|主演','剧目|配角','剧目|环境','主演|配角']);
  const guides={
    '剧目|风格体系':['剧本怎样被看见','剧本提供冲突与变化，演法改变这些信息如何呈现。','保留剧目的关键选择，比较不同演法怎样改变行动的呈现。','同一件事改用这种演法后，哪条信息提前、推迟或换了呈现渠道？'],
    '剧目|导演手法':['让冲突落到一个动作','剧本的处境需要具体手段才能成为可观察的场面。','检验手段是否改变信息、关系或选择，而不只是装饰场面。','手段落在冲突的哪一步？去掉它以后，人物还能得到同样的信息、作出同样的决定吗？'],
    '剧目|主演':['换一个人承担这件事','剧本中的压力与人物有来源的行动取向可以互相检验。','这是人物置入处境的比较；跨作人物不因此成为原作角色。','人物保留自己的目标后，会答应、拒绝还是另提条件？哪条原有因果因此需要改变？'],
    '剧目|配角':['谁使主线不能照旧','配角的请求、阻拦或帮助可以改变剧本中的选择。','配角有自己的目标，不只是替主角解释剧情的人。','配角在哪个决定之前介入？拿掉这次回应后，主线会少一个什么选择或代价？'],
    '剧目|环境':['换地方，代价也会变','空间的通路、距离与资源会限制剧本中的行动。','同一事件进入不同空间，应检查时间、出入和可见范围的变化。','哪一次见面、藏匿或离开会被此地的边界改变？如果都能原样发生，空间还没有进入事件。'],
    '风格体系|导演手法':['演法与动作互相检验','演法提供组织方式，手段提供可执行的变化。','手段可以跨演法使用；没有加分不表示艺术上不能结合。','手段把这种演法的哪一个要求变成了可看见或听见的变化？只改名称还不够。'],
    '风格体系|主演':['人物目标换一种呈现','人物仍保有目标，演法改变目标如何进入观看。','改变呈现方式，不等于替人物改写原作身份或身体条件。','人物想得到的东西保留以后，哪次停顿、发声或身体行动让目标变得更清楚？'],
    '风格体系|配角':['回应不只是一句台词','演法可以改变配角回应、见证或介入的方式。','不要因为配角篇幅较少就取消其选择和承担。','配角的拒绝或帮助怎样被看见？演法改变的是回应渠道，还是取消了这个人的意愿？'],
    '风格体系|环境':['观看方式遇到空间条件','演法的观看关系需要接受具体空间的距离、出入和声场条件。','空间与演法的组合是创作条件，不证明存在某次历史演出。','谁能听见、看见或先读到，具体被哪段距离或隔断改变？'],
    '导演手法|主演':['动作是否改变人物选择','手段需要让人物作出可辨认的行动或回应。','特别检查无声、失明或行动受限人物是否仍能执行这项手段。','人物如何执行这个动作？需要谁协助，或通过什么可感知的线索作出回应？'],
    '导演手法|配角':['一个回应改变节奏','配角对手段的回应可以改变交接、节奏或信息出现的时间。','不要把手段的效果强行写成所有人物都会接受的结果。','配角在哪一刻接住、打断或拒绝这个动作？这种回应会使哪一步不能照旧完成？'],
    '导演手法|环境':['动作遇到真实边界','手段的执行受空间通路、视线、声响与物件位置约束。','先说明物件在哪里、谁能接近，再描述它如何改变场面。','物件或信息从哪里到哪里，哪一次移动被此地的边界截住？'],
    '主演|配角':['两个目标如何碰面','主配角各自的行动不必一致；关系来自具体的请求与回应。','同作不等于亲密，跨作不等于相识；先区分来源再设计相遇。','一人的要求具体妨碍了另一人的什么目标？双方各保留哪项不能轻易放弃的条件？'],
    '主演|环境':['人物能在哪里作出选择','人物的目标遇到空间的限制，才会出现具体代价。','空间不应消除人物已经明确的身体条件或行动能力。','这里的通路、时限或资源会使人物等待、绕行还是请人经手？若行动可原样完成，空间还未改变事件。'],
    '配角|环境':['让配角也有能动的位置','空间给配角提供介入、退出或保留距离的条件。','不能只让配角站在背景里；仍要问其能改变什么。','配角能守住哪个入口、信息或资源？这个位置怎样影响另一人的进退，而不取消配角自己的目标？']
  };
  const pairKey=ids=>ids.slice().sort().join('|');
  const exactPairs=new Map(data.rules.filter(row=>row.cardIds.length===2).map(row=>[pairKey(row.cardIds),row]));
  const families=data.families.map(row=>({...row,left:new Set(row.left),right:new Set(row.right)}));
  function ordered(cards){
    if(!Array.isArray(cards)||cards.length<2||cards.length>6)throw Error('碰撞需要2至6张不同维度的卡牌');
    const seen=new Set(),dims=new Set();
    for(const card of cards){
      if(!card||typeof card.id!=='string'||seen.has(card.id)||!data.dimensions.includes(card.dimension)||dims.has(card.dimension))throw Error('碰撞卡牌id或维度无效');
      seen.add(card.id);dims.add(card.dimension);
    }
    return cards.slice().sort((a,b)=>data.dimensions.indexOf(a.dimension)-data.dimensions.indexOf(b.dimension));
  }
  function fact(card){return data.facts[card.id]||{...card,note:card.note||card.blurb||card.name,action:card.action||card.observe||card.name,workIds:card.workIds||[],sourceRefs:[]};}
  function refs(cards,additional=[]){return [...new Set([...additional,...cards.flatMap(card=>fact(card).sourceRefs)])].map(id=>data.sources[id]).filter(Boolean).map(row=>({...row}));}
  function sharedWorks(cards){return (cards[0].workIds||fact(cards[0]).workIds||[]).filter(id=>(cards[1].workIds||fact(cards[1]).workIds||[]).includes(id));}
  function originalReward(cards){
    const dimensions=cards.map(card=>card.dimension).join('|');
    return originalPairs.has(dimensions)&&sharedWorks(cards).length>0;
  }
  function basis(cards){return cards.map(card=>({cardId:card.id,text:fact(card).note}));}
  function generated(cards){
    const [a,b]=cards,[title,explanation,learning,check]=guides[cards.map(card=>card.dimension).join('|')];
    return {id:'learn:'+pairKey(cards.map(card=>card.id)),type:'learning',cardIds:cards.map(card=>card.id),title,
      explanation,event:`待验证的场面：${a.name}的卡面行动是“${fact(a).action}”；${b.name}的卡面行动是“${fact(b).action}”。${check}`,
      learning,bonus:0,level:'generated-learning',creative:false,interpretation:'editorial-question',factBasis:basis(cards),sourceRefs:refs(cards)};
  }
  function selected(rule,cards,level=rule.level){
    const sameOrigin=cards.length===2&&originalReward(cards);
    return {id:rule.id,type:level==='evolution'?'evolution':'creative-collision',cardIds:cards.map(card=>card.id),title:rule.title,
      explanation:rule.explanation,event:rule.event,learning:rule.learning,bonus:sameOrigin?0:rule.bonus,
      level,creative:true,interpretation:'editorial',factBasis:basis(cards),sourceRefs:refs(cards,rule.sourceRefs||[]),
      ...(sameOrigin?{bonusNote:'这两张卡已有原作羁绊奖励，本条只补充学习，不重复加分。'}:{}),
      ...(rule.replaces?{replaces:rule.replaces.slice()}:{}),...(level==='curated-rule'?{ruleId:rule.ruleId,reviewScope:'人工设计关系规则；具体卡对由规则生成，未逐对人工审读。'}:{})};
  }
  function details(cards){
    const list=ordered(cards),ids=new Set(list.map(card=>card.id)),out=[];
    for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
      const pair=[list[i],list[j]],key=pairKey(pair.map(card=>card.id));
      const exact=exactPairs.get(key);
      if(exact){out.push(selected(exact,pair));continue;}
      const family=families.find(row=>row.left.has(pair[0].id)&&row.right.has(pair[1].id)||row.left.has(pair[1].id)&&row.right.has(pair[0].id));
      if(!family){out.push(generated(pair));continue;}
      const a=pair.find(card=>family.left.has(card.id)),b=pair.find(card=>card.id!==a.id);
      const rendered={...family,id:family.id+':'+key,ruleId:family.id};
      for(const field of ['title','explanation','event','learning'])rendered[field]=rendered[field].replaceAll('{a}',a.name).replaceAll('{b}',b.name);
      out.push(selected(rendered,pair,'curated-rule'));
    }
    for(const rule of data.rules.filter(row=>row.cardIds.length===3&&row.cardIds.every(id=>ids.has(id))))out.push(selected(rule,list.filter(card=>rule.cardIds.includes(card.id))));
    for(const evolution of out.filter(row=>row.level==='evolution'))for(const row of out)if(evolution.replaces.includes(row.id)){
      row.bonus=0;row.evolvedBy=evolution.id;row.bonusNote='本项意象已并入三卡进化，不重复加分。';
    }
    const priority={evolution:0,curated:1,'curated-rule':2,'generated-learning':3};
    return out.sort((a,b)=>priority[a.level]-priority[b.level]||(a.id<b.id?-1:a.id>b.id?1:0));
  }
  return {details,data};
})();
function collisionDetailsV55(cards){return DiaCollisionsV55.details(cards);}
if(typeof module!=='undefined'&&module.exports)module.exports={collisionDetailsV55,data:DiaCollisionsV55.data};
