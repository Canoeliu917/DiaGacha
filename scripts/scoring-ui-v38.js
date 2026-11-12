function productionScore(cards) {
  const style = cards.find(card => card.dimension === '风格体系');
  const method = cards.find(card => card.dimension === '导演手法');
  const compatible = Wt(style.id).some(system => Wt(method.id).some(other => other.id === system.id));
  return DiaScoring.production(cards, {}, compatible);
}

function scoreNumber(value) { return Math.round(value).toString(); }

function scoreBreakdown(result, cards) {
  const names = ids => ids.map(id => cards.find(card => card.id === id)?.name || id).join(' × ');
  const groups = result.resonanceDetails.map(item =>
    `<li>${fn[item.rarity]} 星 ${item.count} 张：+${item.points}</li>`);
  const bonds = result.bondDetails.map(item =>
    `<li>${K(item.label)}：${K(names(item.cardIds))}，+${item.points}</li>`);
  return `<section class="score-explanation" aria-label="本场评价与组队奖励">
    <h2>本场评价 · ${K(result.grade)} · ${result.score} 分</h2>
    <p>剧组称号：<strong>${K(result.crew.title)}</strong>${result.crew.count ? ` · ${fn[result.crew.rarity]} 星 ${result.crew.count} 人组` : ''}</p>
    <p>${K(result.crew.description)}</p>
    <p>基础 ${result.base} 分 · 同星 +${result.resonance} · 羁绊 +${result.bonds}（总分最多 100）</p>
    <details><summary>这次获得了哪些组队奖励</summary>
      <ul>${groups.length ? groups.join('') : '<li>凑齐两张同星卡，就有同星奖励。</li>'}${bonds.length ? bonds.join('') : '<li>本场暂未遇到原作或演法搭档。</li>'}</ul>
      <p>同星奖励合计最多 +7，羁绊最多 +8；剧组称号看人数最多的同星组，同人数取高星。</p>
    </details>
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
      <p>1–7 星的普通档位出率依次为 ${v.map(rank => `${y[rank]}%`).join('、')}；缺档会落到相邻档位，同档内等概率。连续 30 包未出 5 星以上、60 包未出 6 星以上时，对应一包会保底。</p>
      <p>收藏和保底保存在当前浏览器；旧五卡分享也能继续看。今日赠礼提高下次综合包的高星机会，单维包次数从任务领取。</p>
    </details>
    <details><summary>资料与评分参考</summary><p>资料用于核对作品背景；分数和星级是游戏的编辑判断。<a href="https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/RUBRIC.md" target="_blank" rel="noopener noreferrer">查看参考标准与来源</a></p></details>
    <p>翻卡时可以跳过动画，点卡片读小注；右上角可以关声音。</p>
    <p>当前常驻 ${K(state.poolSize || 500)} 张，长期总图鉴 777 张。其余 277 张暂不展示或抽取，已有收藏记录保留。</p>
    <button type="button" class="btn primary" data-action="close-sheet">开场吧</button>`;
}
