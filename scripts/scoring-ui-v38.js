function productionScore(cards) {
  const style = cards.find(card => card.dimension === '风格体系');
  const method = cards.find(card => card.dimension === '导演手法');
  const compatible = Wt(style.id).some(system => Wt(method.id).some(other => other.id === system.id));
  return DiaScoring.production(cards, {}, compatible);
}

function scoreNumber(value) { return Math.round(value).toString(); }

function productionCuesV40(result, cards) {
  const groups = {
    C: { titles: ['一桌搭戏','接住这句','板凳围台','合力支台','满台烟火'], scenes: [
      '一张桌子，也能搭起一场戏。',
      '三人各有主意，冷场也能接住。',
      '四张板凳，围出一方小天地。',
      '道具轮着用，好戏接着演。',
      '满台都是生手，也有满台烟火。'] },
    UC: { titles: ['街角碰头','邻里接戏','巷口开场','满院好戏','街坊齐上阵'], scenes: [
      '熟人一句试探，闲聊便成了戏。',
      '一条新消息，惹来三家议论。',
      '家常事传开，四邻都入了戏。',
      '一院笑声，藏着五份心事。',
      '街坊凑齐，小事也能唱成大戏。'] },
    R: { titles: ['咫尺对戏','三面来风','四角生戏','小台满座','一屋入戏'], scenes: [
      '一次目光躲闪，胜过千言万语。',
      '第三人到场，两边关系生变。',
      '四方各有心事，小台处处有戏。',
      '五道目光交会，一刻沉默生疑。',
      '一屋人物登场，六路关系相连。'] },
    SR: { titles: ['同行一站','转场有伴','四方走戏','行囊成班','带戏远行'], scenes: [
      '转场有了照应，好戏一路同行。',
      '三路戏意相逢，前后呼应成章。',
      '四方场景流转，人物关系随行。',
      '五份本事凑齐，小台也撑长戏。',
      '六席彼此照应，故事走向远方。'] },
    SSR: { titles: ['好戏相逢','轮番亮相','彼此搭台','压轴相让','满台绝活'], scenes: [
      '两份拿手好戏，彼此映衬生辉。',
      '三番亮相递进，高潮接连而来。',
      '四方都能撑场，退让也有分量。',
      '五路好戏相让，热闹过后有味。',
      '满台绝活呼应，开场收尾成篇。'] },
    UR: { titles: ['知音对坐','三声应和','功夫相照','五席成章','满堂余韵'], scenes: [
      '半句未说出口，知音已懂深意。',
      '三声各有棱角，相和更见余韵。',
      '四份功夫相照，平常处见深意。',
      '五席各留余白，观众心中有戏。',
      '六路表达相通，散场仍有回响。'] },
    LR: { titles: ['传奇碰面','三章交响','四幕相连','今夜入史','共赴谢幕'], scenes: [
      '两段传奇相逢，经典重焕光彩。',
      '三个世界交响，各有回声不息。',
      '四幕经典相连，旧事生出新意。',
      '五路传奇同台，今夜值得铭记。',
      '六维共赴谢幕，留下一台传奇。'] },
  };
  const bondCopy = {
    'play-lead': ['主角归位', [
      '主角重返原作，选择自有来由。',
      '主角来路清楚，登场更有分量。',
      '人物回到本戏，愿望有了根基。']],
    'play-support': ['侧幕来人', [
      '配角重回本戏，一言牵动局势。',
      '旧识带来前情，侧幕也有分量。',
      '原作配角归来，关系更见层次。']],
    'lead-support': ['对手接招', [
      '同剧人物相逢，一言便有前情。',
      '熟人未必和解，对手更知彼此。',
      '旧日关系仍在，进退自有分量。']],
    'play-place': ['旧地开幕', [
      '故事重返旧地，进退皆有来由。',
      '原作场景归来，往事随之入场。',
      '熟悉的地方，藏着人物的牵挂。']],
    'style-method': ['演法落地', [
      '演法配上手段，想法化为行动。',
      '手段呼应风格，舞台表达更清楚。',
      '形式找到所指，一招自有章法。']],
  };
  const cues = result.resonanceDetails.map(item => {
    const copy = groups[item.rarity];
    return { id: `resonance-${item.rarity}`, kind: 'resonance', cardIds: [...item.cardIds], rarity: item.rarity,
      title: copy.titles[item.count - 2], description: copy.scenes[item.count - 2], points: item.points };
  });
  for (const item of result.bondDetails) {
    const [title, variants] = bondCopy[item.id];
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
  const participants = cue => cue.cardIds.map(id => cards.find(card => card.id === id).name).join('、');
  const title = crewCue
    ? `<button type="button" class="production-crew rarity-${K(crewCue.rarity)}" ${attributes(crewCue)} aria-label="${K(result.crew.title)}，同星合演，回看关联卡牌">${K(result.crew.title)}</button>`
    : K(result.crew.title);
  return `<section class="score-explanation production-review" aria-label="演后短评">
    <h2 class="production-crew-title">${title}</h2>
    <p class="production-crew-description">${K(result.crew.description)}</p>
    ${cues.length ? `<ul class="production-cues">${cues.map(cue => `<li><button type="button" class="production-cue${cue.rarity ? ` rarity-${K(cue.rarity)}` : ''}" ${attributes(cue)} aria-label="${K(cue.title)}，${cue.kind === 'resonance' ? '同星合演' : '戏剧羁绊'}，${showPoints && cue.points ? `加${cue.points}分，` : ''}${K(cue.description)} 关联卡牌：${K(participants(cue))}。回看关联卡牌"><strong>${K(cue.title)}${showPoints && cue.points ? `<b class="cue-value">+${cue.points}</b>` : ''}</strong><span>${K(cue.description)}</span></button></li>`).join('')}</ul><p class="production-cue-status" role="status" aria-live="polite">点选评语，看看是哪几张卡在呼应。</p>` : ''}
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
