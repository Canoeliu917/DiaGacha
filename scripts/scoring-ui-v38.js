function productionScore(cards) {
  const style = cards.find(card => card.dimension === '风格体系');
  const method = cards.find(card => card.dimension === '导演手法');
  const compatible = Wt(style.id).some(system => Wt(method.id).some(other => other.id === system.id));
  return DiaScoring.production(cards, {}, compatible);
}

function scoreNumber(value) { return Math.round(value).toString(); }

function productionCuesV40(result, cards) {
  const byId = new Map(cards.map(card => [card.id, card]));
  const groups = {
    C: { titles: ['一桌搭戏','接住这句','板凳围台','合力支台','满台烟火'], scenes: [
      '桌子还没摆正，戏已经开了头；一个肯往下说，一个肯留在场上听。',
      '临时凑起的三位各有主意，一次抢话倒把冷场救了回来。',
      '四张板凳围出舞台，谁挪一下位置，其他人就得跟着改戏。',
      '道具不够便轮着用，上一场留下的东西，恰好成为下一场的由头。',
      '六路生手挤上小台，接漏、补位、忘词后的笑声，都成了今晚的戏。'] },
    UC: { titles: ['街角碰头','邻里接戏','巷口开场','满院好戏','街坊齐上阵'], scenes: [
      '街角的板凳刚坐热，一句熟人间的试探便让闲聊有了悬念。',
      '本来只是两边拌嘴，第三位带来的消息，让整条巷子都竖起耳朵。',
      '门里门外同时有了动静，四方来人把一桩家常事围成热闹场面。',
      '有人守门，有人传话，院子里的笑声和心事终于接上同一个节拍。',
      '街坊纷纷入场，小事被众人各说一遍，散场时竟有了不同的分量。'] },
    R: { titles: ['咫尺对戏','三面来风','四角生戏','小台满座','一屋入戏'], scenes: [
      '隔着咫尺对视，声音可以放轻；一回避开目光，反倒比台词更响。',
      '第三个立场走进近景，原先稳固的两边关系开始摇晃。',
      '小台四角都有了人，欲言又止与侧身让路，也成为观众看得见的动作。',
      '五道视线在有限空间里相遇，台上谁先沉默，谁就牵住了全场。',
      '一屋子的呼吸渐渐合拍，人物各走各的路，观众却能看见关系织成一张网。'] },
    SR: { titles: ['同行一站','转场有伴','四方走戏','行囊成班','带戏远行'], scenes: [
      '换过一处舞台仍能认出彼此的节奏，转身就有人替下一场留好入口。',
      '三路戏意在途中碰头，前一场的余音，成了后一场开口的理由。',
      '四方走位带出流动的场景，布景尚未落定，关系已经随转场改变。',
      '五份行囊装着不同本事，分工落到实处，临时舞台也能撑住长戏。',
      '六个位置都有人照应，换场不再只是搬动东西，而是把故事带往下一站。'] },
    SSR: { titles: ['好戏相逢','轮番亮相','彼此搭台','压轴相让','满台绝活'], scenes: [
      '两份拿手本事都收住半拍，把最亮的一刻留给对方回应，场面因此有了张力。',
      '三次亮相各留余地，高潮没有挤在一处，而是被前后推向更远。',
      '四方都能撑住场面，主次在一次转身间互换，谁退半步也仍然有戏。',
      '五路好戏学会相让，最有分量的停顿留在热闹之后，让余味慢慢落座。',
      '满台绝活各守一个关口，开场的期待、转折的险处与收尾的劲道终于连成一气。'] },
    UR: { titles: ['知音对坐','三声应和','功夫相照','五席成章','满堂余韵'], scenes: [
      '一点细微的迟疑也能被听见，未说出口的半句话，已经改变另一边的呼吸。',
      '三种声部并不追求齐声，各自保留棱角，却能在关键停顿处相遇。',
      '四份功夫藏进看似平常的动作，越不抢着说明，彼此之间越显出层次。',
      '五个位置各有沉默的分量，空处被认真留下，观众也有了补完故事的余地。',
      '六路表达收束到同一处回望，舞台已经静下，前面的动作仍在观众心里回响。'] },
    LR: { titles: ['传奇碰面','三章交响','四幕相连','今夜入史','共赴谢幕'], scenes: [
      '两种强烈的舞台记忆正面相遇，熟悉的形象被重新照亮，谁也无法照旧登场。',
      '三段各自成立的戏剧世界开始相互追问，答案不必相同，张力却能同台。',
      '四幕之间留下的裂缝，成了新关系生长的地方；经典的分量落在这一次相遇。',
      '五路来历沉入同一晚的舞台，掌声之前，先让不同的声音完整地听见彼此。',
      '六维在谢幕前最后一次相互照应，难得的阵容终于留下属于这一台的共同记忆。'] },
  };
  const bondCopy = {
    'play-lead': (play,lead) => ['主角归位', [
      `${lead}回到《${play}》，愿望不再悬在空中；原作的处境给每一次选择添上后果。`,
      `《${play}》为${lead}重新铺好来路，登场前的旧事也跟着进门，开口便带着重量。`,
      `${lead}与《${play}》重逢，熟悉的身份成为支点，人物可以把力气用在改变眼前局面上。`]],
    'play-support': (play,support) => ['侧幕来人', [
      `${support}进入《${play}》的关系网，侧面的一次回应，便能使主场的话换个方向。`,
      `《${play}》留给${support}一个有来历的位置，配角不必解释为何在场，便能牵动局势。`,
      `${support}带着《${play}》的旧关系登场，主场之外的目光，也开始影响台上的选择。`]],
    'lead-support': (lead,support) => ['对手接招', [
      `${lead}与${support}共享同一原作，彼此的言行有了前情；一句话可以同时是试探、阻拦或求援。`,
      `${lead}遇见${support}，熟悉不等于和解；同一部戏里的关系，让退让和坚持都更有分量。`,
      `${lead}与${support}不必从陌生人演起，原作留下的距离，足以让一次靠近或离开成为转折。`]],
    'play-place': (play,place) => ['旧地开幕', [
      `《${play}》落在${place}，进门、躲避与停留都有了来由；空间开始参与人物的决定。`,
      `${place}接住《${play}》的行动，熟悉的场所带回旧日关系，舞台上的远近也有了分量。`,
      `《${play}》重返${place}，场景不再只作背景；谁能进入、谁留在外面，都是戏的一部分。`]],
    'style-method': (style,method) => ['演法落地', [
      `${style}与${method}找到共同的发力点，形式上的主张，终于能在一次具体行动里被看见。`,
      `${method}替${style}找到落脚处，排演不止讨论想法，也能检验动作是否真的改变了观看。`,
      `${style}为${method}定下表达方向，手段有了所指，舞台上的选择也更容易形成整体。`]],
  };
  const cues = result.resonanceDetails.map(item => {
    const names = item.cardIds.slice(0, 2).map(id => byId.get(id).name).join('与');
    const copy = groups[item.rarity];
    return { id: `resonance-${item.rarity}`, kind: 'resonance', cardIds: [...item.cardIds], rarity: item.rarity,
      title: copy.titles[item.count - 2], description: `${names}${item.count > 2 ? '等伙伴' : ''}同台。${copy.scenes[item.count - 2]}`, points: item.points };
  });
  for (const item of result.bondDetails) {
    const [title, variants] = bondCopy[item.id](...item.cardIds.map(id => byId.get(id).name));
    const choice=[...item.cardIds.join('|')].reduce((sum,char)=>sum+char.codePointAt(0),0)%variants.length;
    const description=variants[choice];
    cues.push({ id: `bond-${item.id}`, kind: 'bond', cardIds: [...item.cardIds], title, description, points: item.points });
  }
  // Animation increments use the engine's capped totals; every triggered cue still gets its moment.
  const remaining = { resonance: result.resonance, bond: result.bonds };
  let scoreRoom = Math.max(0, result.score - result.base);
  for (const cue of cues) {
    const capped = Math.min(cue.points, remaining[cue.kind]);
    remaining[cue.kind] -= capped;
    cue.points = Math.min(capped, scoreRoom);
    scoreRoom -= cue.points;
  }
  return cues;
}

function scoreBreakdown(result, cards, showPoints = false) {
  const cues = productionCuesV40(result, cards);
  const crewCue = cues.find(cue => cue.kind === 'resonance' && cue.rarity === result.crew.rarity);
  const attributes = cue => `data-action="production-cue" data-cue-id="${K(cue.id)}" data-production-cue="${K(cue.id)}" data-card-ids="${K(JSON.stringify(cue.cardIds))}" data-rarity="${K(cue.rarity || '')}"`;
  const title = crewCue
    ? `<button type="button" class="production-crew rarity-${K(crewCue.rarity)}" ${attributes(crewCue)} aria-label="${K(result.crew.title)}，同星合演，回看关联卡牌">${K(result.crew.title)}</button>`
    : K(result.crew.title);
  return `<section class="score-explanation production-review" aria-label="演后短评">
    <h2 class="production-crew-title">${title}</h2>
    <p class="production-crew-description">${K(result.crew.description)}</p>
    ${cues.length ? `<ul class="production-cues">${cues.map(cue => `<li><button type="button" class="production-cue${cue.rarity ? ` rarity-${K(cue.rarity)}` : ''}" ${attributes(cue)} aria-label="${K(cue.title)}，${cue.kind === 'resonance' ? '同星合演' : '戏剧羁绊'}，${showPoints && cue.points ? `加${cue.points}分，` : ''}${K(cue.description)} 回看关联卡牌"><strong>${K(cue.title)}${showPoints && cue.points ? `<b class="cue-value">+${cue.points}</b>` : ''}</strong><span>${K(cue.description)}</span></button></li>`).join('')}</ul><p class="production-cue-status" role="status" aria-live="polite">点选评语，看看是哪几张卡在呼应。</p>` : ''}
  </section>`;
}

function cardReviewDetails() { return ''; }

function scoringHelp(state) {
  const bonuses = [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [2, 3, 4, 5, 6], [2, 3, 4, 5, 6], [3, 4, 5, 6, 7], [3, 4, 5, 6, 7], [4, 5, 6, 7, 7]];
  return `<h2 id="sheet-title">怎么玩</h2>
    <ol><li>开一包，集齐剧本、演法、手段、主角、配角、空间，排成一台戏。</li><li>两张同星就加分，1 星也能组「草台班子」；同星越多，奖励越多，最多 +7。</li><li>同一原作的人物与空间、合拍的演法与手段，还能触发羁绊，最多 +8。</li></ol>
    <p>整场表现由六张卡共同决定，加上组队奖励，最高 100 分。所有得分都是整数；混搭也能好看，没有羁绊不扣分。</p>
    <details><summary>查看同星加分表</summary>
      <table><thead><tr><th>星级</th><th>2 张</th><th>3 张</th><th>4 张</th><th>5 张</th><th>6 张</th></tr></thead><tbody>${bonuses.map((row, i) => `<tr><th>${i + 1} 星</th>${row.map(points => `<td>+${points}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <p>不同同星组可以一起加分，总共最多 +7。剧组称号看人数最多的一组，同人数取高星；整场评价看总分。</p>
    </details>
    <details><summary>抽取与保存</summary>
      ${ratesHelpV40(activeCards)}
      <p>连续 30 包未出 5 星以上、60 包未出 6 星以上时，对应一包会保底。</p>
      <p>收藏和保底保存在当前浏览器；旧五卡分享也能继续看。今日赠礼提高下次综合包的高星机会，单维包次数从任务领取。</p>
    </details>
    <details><summary>资料与评分参考</summary><p>资料用于核对作品背景；分数和星级是游戏的编辑判断。<a href="https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/RUBRIC.md" target="_blank" rel="noopener noreferrer">查看参考标准与来源</a></p></details>
    <p>翻卡时可以跳过动画，点卡片读小注；右上角可以关声音。</p>
    <p>当前常驻 ${K(state.poolSize || 500)} 张，长期总图鉴 777 张。其余 277 张暂不展示或抽取，已有收藏记录保留。</p>
    <button type="button" class="btn primary" data-action="close-sheet">开场吧</button>`;
}
