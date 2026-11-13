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
      '一张桌子撑住舞台，两份心思接成一场好戏。',
      '三种主意轮番登场，停顿也被接成了笑声。',
      '四张板凳围出天地，散落的念头都有了去处。',
      '五份本事彼此借力，简陋的台面渐渐热闹。',
      '六路戏意挤满小台，锅碗声里也藏着人情。'] },
    UC: { titles: ['街角碰头','邻里接戏','巷口开场','满院好戏','街坊齐上阵'], scenes: [
      '街角一句熟悉招呼，把两份未说的心事牵起。',
      '三家议论绕过巷口，同一桩小事生出新滋味。',
      '四邻目光聚到门前，家常话里忽然生出悬念。',
      '一院笑声连着五份心事，热闹里也有人沉默。',
      '六席街坊都入了场，寻常日子也有悲喜回声。'] },
    R: { titles: ['咫尺对戏','三面来风','四角生戏','小台满座','一屋入戏'], scenes: [
      '一次目光躲闪，未出口的心事已让关系生变。',
      '第三道目光落下，原本安稳的两边各生波澜。',
      '四方心事挤在咫尺，转身之间已换了彼此位置。',
      '五道目光交错成网，一刻沉默牵动满台猜疑。',
      '一屋六路关系相连，谁先开口都能惊动全场。'] },
    SR: { titles: ['同行一站','转场有伴','四方走戏','行囊成班','带戏远行'], scenes: [
      '前场留下的伏笔，在下一次转场里得到回应。',
      '三路戏意走过不同场景，回头才见彼此照应。',
      '四方场景轮番流转，人物的旧话有了新回声。',
      '五份本事装进行囊，一次换景也能续住戏意。',
      '六席默契走过远近舞台，散场又带着故事启程。'] },
    SSR: { titles: ['好戏相逢','轮番亮相','彼此搭台','压轴相让','满台绝活'], scenes: [
      '两份绝活互相照亮，出手之外也看得见退让。',
      '三番亮相各留一线，后来的一幕接住前头余波。',
      '四方都能撑住台面，一次退让更见彼此分量。',
      '五路好戏轮番相让，掌声之外仍有细处留人。',
      '六份绝活不急着抢戏，开场的暗线连到谢幕。'] },
    UR: { titles: ['知音对坐','三声应和','功夫相照','五席成章','满堂余韵'], scenes: [
      '半句心事停在唇边，对面的沉默已听出深意。',
      '三道声音各有棱角，错落之间反而听见余韵。',
      '四份功夫照见彼此，平常动作里也藏着锋芒。',
      '五席各留一处空白，观众在未说尽处继续入戏。',
      '六路表达合成回响，灯光落下后心事仍未散场。'] },
    LR: { titles: ['传奇碰面','三章交响','四幕相连','今夜入史','共赴谢幕'], scenes: [
      '两段传奇在今夜碰面，熟悉的命运映出新面目。',
      '三个世界彼此应答，旧日的回声穿过新的舞台。',
      '四幕经典照见彼此，熟悉的结局又生出新疑问。',
      '五路传奇共聚一夜，台上的相逢留下台下的余波。',
      '六维在谢幕时彼此照应，好戏仍向散场之后延伸。'] },
  };
  const bondCopy = {
    'play-lead': ['主角归位', [
      '人物站回故事中央，心事终于接上最初的来路。',
      '台词认出了自己的主人，旧故事也有了呼吸。',
      '人物与本戏重新相认，行动牵出了心事的线。']],
    'play-support': ['侧幕来人', [
      '侧幕的身影走回本戏，一句回应牵动了全场。',
      '支线回到原来的故事，主角身旁多了一层回声。',
      '配角接上故事的暗线，没说完的话也有人承接。']],
    'lead-support': ['对手接招', [
      '两个人物出自同一故事，一来一往都带着旧意。',
      '主角的脚步有了应声，对手的停顿也生出分量。',
      '熟悉的人物彼此照见，台词之间多了一层暗流。']],
    'play-place': ['旧地开幕', [
      '故事落回熟悉的地方，门内门外都有了分量。',
      '人物脚下接上原作空间，旧日的回声随步而起。',
      '场景认出了故事的来处，一次进退也牵动旧意。']],
    'style-method': ['演法落地', [
      '演法与手段碰在一处，抽象的心思长出了动作。',
      '舞台的想法找到了做法，一句台词也落稳了脚。',
      '表达的路数彼此合拍，声音与动作接住了心意。']],
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
  const attributes = cue => `data-action="production-cue" data-cue-id="${K(cue.id)}" data-production-cue="${K(cue.id)}" data-card-ids="${K(JSON.stringify(cue.cardIds))}" data-rarity="${K(cue.rarity || '')}"`;
  const participants = cue => cue.cardIds.map(id => cards.find(card => card.id === id).name).join('、');
  return `<section class="score-explanation production-review" aria-label="演后短评">
    ${cues.length ? `<ul class="production-cues">${cues.map(cue => `<li><button type="button" class="production-cue${cue.rarity ? ` rarity-${K(cue.rarity)}` : ''}" ${attributes(cue)} aria-label="${K(cue.title)}，${cue.kind === 'resonance' ? '同星合演' : '戏剧羁绊'}，${showPoints && cue.points ? `加${cue.points}分，` : ''}${K(cue.description)} 关联卡牌：${K(participants(cue))}。回看关联卡牌"><strong>${K(cue.title)}${showPoints && cue.points ? `<b class="cue-value">+${cue.points}</b>` : ''}</strong><span>${K(cue.description)}</span></button></li>`).join('')}</ul><p class="production-cue-status" role="status" aria-live="polite">点选评语，看看是哪几张卡在呼应。</p>` : `<p>${K(result.crew.description)}</p>`}
  </section>`;
}

function cardReviewDetails() { return ''; }

function scoringHelp(state) {
  const bonuses = [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [2, 3, 4, 5, 6], [2, 3, 4, 5, 6], [3, 4, 5, 6, 7], [3, 4, 5, 6, 7], [4, 5, 6, 7, 7]];
  const colors = ['白色','绿色','蓝色','紫色','橙色','彩虹粉','炫光黑'];
  const scoreBands = v.map((rarity, index) => {
    const values = Array.from({length:101}, (_, score) => score).filter(score => DiaScoring.rarityForScore(score) === rarity);
    return `<tr><th scope="row">${index + 1} 星</th><td>${values[0]}–${values.at(-1)} 分</td><td>${rarity}</td><td>${colors[index]}</td></tr>`;
  }).join('');
  return `<h2 id="sheet-title">怎么玩</h2>
    <ol><li>开一包，集齐剧本、演法、手段、主角、配角、空间，排成一台戏。</li><li>两张同星就加分，1 星也能组「草台班子」；同星越多，奖励越多，最多 +7。</li><li>同一原作的人物与空间、合拍的演法与手段，还能触发羁绊，最多 +8。</li></ol>
    <p>整场表现由六张卡共同决定，加上组队奖励，最高 100 分。所有得分都是整数；混搭也能好看，没有羁绊不扣分。</p>
    <details><summary>单卡分数与星级</summary>
      <p>单卡综合分是 ATK 与 DEF 的平均值，四舍五入为整数；这个分数直接决定星级、稀有度和颜色。文化参考资料不额外加分，同星与羁绊只影响整场表现。</p>
      <table class="score-bands"><thead><tr><th>星级</th><th>综合分</th><th>稀有度</th><th>卡色</th></tr></thead><tbody>${scoreBands}</tbody></table>
      <p>例如综合 75 分是四星，88 分是六星，94 分是七星。修改资料介绍不会改变星级；攻防复评后，星级随新综合分更新。</p>
    </details>
    <details><summary>查看同星加分表</summary>
      <table><thead><tr><th>星级</th><th>2 张</th><th>3 张</th><th>4 张</th><th>5 张</th><th>6 张</th></tr></thead><tbody>${bonuses.map((row, i) => `<tr><th>${i + 1} 星</th>${row.map(points => `<td>+${points}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <p>不同同星组可以一起加分，总共最多 +7。每组同星与原作羁绊各有短评，点词条可回看参与卡牌。</p>
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
