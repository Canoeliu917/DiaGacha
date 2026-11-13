function stagePersonaV53(cards){
  const style=cards.find(card=>card.dimension==='风格体系'),method=cards.find(card=>card.dimension==='导演手法');
  const text=[method?.name,style?.name,...(style?.tags||[])].join(' ');
  const types=[
    [/回环|重复|荒诞|循环/,'回环钉子户','都说该谢幕了，我还想把开场再演一遍。'],
    [/书信|文献|纪实|档案|法庭/,'证据收藏家','情绪可以上头，关键那张纸不能丢。'],
    [/声音|声场|广播|音乐|合唱|歌剧/,'声场掌舵人','人还没出场，气氛已经替我开口。'],
    [/形体|身体|默剧|哑剧|舞蹈|面具/,'身体翻译官','有些话说不出口，就让一个动作替我说。'],
    [/写意|象征|留白|极简|空台/,'留白造梦师','台上只放一把椅子，剩下的世界请你想象。'],
    [/梦|超现实|魔幻|表现主义|投影|影像/,'梦境放映员','现实装不下的心事，我换个舞台放映。'],
    [/间离|史诗|政治|论坛|压迫|介入/,'当场提问者','大家都在等结局，我先问一句：凭什么？'],
    [/古典|程式|三一律|仪式|能乐|歌舞伎/,'秩序拆装工','规矩我都记得，也知道哪一处值得松动。'],
    [/即兴|互动|参与|街头|环境|沉浸/,'现场接招王','计划可以改，递过来的戏我先接住。'],
    [/叙事|讲述|说书|独白|旁白|独角/,'灯下说书人','先别急着散场，我还有一句想告诉你。'],
    [/现实|自然|生活|市民|心理|斯坦尼/,'人间观察员','别人看大场面，我在看谁悄悄挪了椅子。'],
    [/.*/,'认真入戏派','哪怕只有一小束光，也要把这一场演认真。'],
  ];
  const index=types.findIndex(([pattern])=>pattern.test(text)),[,name,line]=types[index];
  return {name,line,number:String(index+1).padStart(2,'0'),basis:`${style?.name||'独角演法'} × ${method?.name||'舞台行动'}`};
}

function stagePersonaMarkupV53(cards){
  const persona=stagePersonaV53(cards);
  return `<div class="stage-persona-v53"><p><span>本场戏格 ${K(persona.number)}</span><strong>${K(persona.name)}</strong></p><blockquote>“${K(persona.line)}”</blockquote><small>${K(persona.basis)} · 卡组趣味解读</small></div>`;
}

function shareUrlV53(cards){
  const ordered=['剧目','风格体系','导演手法','主演','配角','环境'].map(dimension=>cards.find(card=>card.dimension===dimension)).filter(Boolean);
  return `https://canoeliu917.github.io/DiaGacha/?v=53#m=${w(ordered)}`;
}

function shareTextV53(cards){
  const result=Xt(cards),count=cards.length===6?'六':'五';
  const persona=stagePersonaV53(cards);
  return `今晚的戏格：${persona.name}。\n“${persona.line}”\n我这台戏，${result.score} 分 · ${result.scoring.grade}。\n《${dramaticTitleV40(cards)}》\n${shortScene(cards)}\n${count}张卡，开出你的意外好戏。`;
}

function socialPosterV53(cards){
  const result=Xt(cards),context=talkCardsV39(cards),count=cards.length===6?'六':'五';
  const title=dramaticTitleV40(cards).replace(`${context.place.name}｜`,'');
  const story=shortScene(cards).replace(/^故事联想：/,'').replace(/^取意于《[^》]*》[，。](?:在[^。]*虚构一次相遇。)?/,'').replace(/此为借《[^》]*》展开的虚构故事。$/,'');
  const cast=['剧目','主演','导演手法','配角','风格体系','环境'].map(dimension=>cards.find(card=>card.dimension===dimension)).filter(Boolean);
  const qr=qrcode(0,'M');
  qr.addData(shareUrlV53(cards));
  qr.make();
  return `<section class="social-poster-v53" aria-label="本局朋友圈节目单">
    <header class="social-header-v53"><span class="social-brand-v53">DiaGacha<span>· 咫牌</span></span><span class="social-edition-v53">我的节目单</span></header>
    <p class="social-tagline-v53">${count}张卡，开出你的意外好戏。</p>
    ${stagePersonaMarkupV53(cards)}
    <div class="social-hero-v53">
      <h1 class="social-title-v53">${K(title)}</h1>
      <div class="social-rating-v53" aria-label="这台 ${K(result.score)} 分，${K(result.scoring.grade)}"><span>这台</span><div><b class="social-score-v53">${K(result.score)}</b><small>/ 100</small></div><strong>${K(result.scoring.grade)}</strong></div>
    </div>
    <p class="social-setting-v53">取意《${K(context.play.name.replace(/^《|》$/g,''))}》<span>·</span>${K(context.place.name)}</p>
    <div class="social-cast-v53${cards.length===5?' social-five-v53':''}">${cast.map(card=>`<article class="social-card-v53 rarity-${K(card.rarity)}" data-card-id="${K(card.id)}"><div class="social-slot-v53"><span>${K(copyDimension(card.dimension))}</span>${starPips(card.rarity)}</div><div class="social-art-v53">${Ct(card)}</div><p class="social-card-name-v53">${K(card.name)}</p></article>`).join('')}</div>
    <div class="social-story-v53"><span class="social-story-label-v53">这一场 · 虚构故事</span><p>${K(story)}</p></div>
    <footer class="social-footer-v53"><div class="social-invite-v53"><p>你的下一台，<br>会是什么好戏？</p><span>长按识别二维码 · 看这台，也开一台</span><small>500 张常驻卡 · 戏剧混搭抽卡</small>${cards.length===5?'<small>旧五卡节目单</small>':''}</div><div class="social-qr-v53">${qr.createSvgTag({cellSize:2,margin:8,scalable:true})}</div></footer>
  </section>`;
}
