function productionScore(cards) {
  const style = cards.find(card => card.dimension === '风格体系');
  const method = cards.find(card => card.dimension === '导演手法');
  const compatible = Wt(style.id).some(system => Wt(method.id).some(other => other.id === system.id));
  return DiaScoring.production(cards, {}, compatible);
}

function scoreNumber(value) { return Number(value.toFixed(2)).toString(); }

function scoreBreakdown(result, cards) {
  const names = ids => ids.map(id => cards.find(card => card.id === id)?.name || id).join(' × ');
  const colors = result.resonanceDetails.map(item =>
    `<li>${K(b[item.rarity])} ${item.count} 张同色：+${scoreNumber(item.points)}</li>`);
  const bonds = result.bondDetails.map(item =>
    `<li>${K(item.label)}：${K(names(item.cardIds))}，+${scoreNumber(item.points)}</li>`);
  const strongest = [...result.contributions].sort((a, b) => b.score - a.score)[0];
  const weakest = [...result.contributions].sort((a, b) => a.score - b.score)[0];
  return `<section class="score-explanation" aria-label="剧目评分明细">
    <h2>剧目综评 · ${K(result.grade)}</h2>
    <p>六维基础 ${scoreNumber(result.base)} + 同色共鸣 ${scoreNumber(result.resonance)} + 剧目羁绊 ${scoreNumber(result.bonds)} → <strong>${scoreNumber(result.score)} 分</strong>（总分上限 100）</p>
    <p>${K(copyDimension(strongest.dimension))}最突出（${strongest.score}）；${K(copyDimension(weakest.dimension))}可继续打磨（${weakest.score}）。${result.bonds ? '本台已触发可核对的搭配关系。' : '本台暂无已确认的羁绊；跨剧混搭不扣分。'}</p>
    <details><summary>查看本台加分与六维贡献</summary>
      <ul>${colors.length ? colors.join('') : '<li>没有两张以上同色卡，共鸣 +0。</li>'}${bonds.length ? bonds.join('') : '<li>没有已确认的原作或演法手段关系，羁绊 +0。</li>'}</ul>
      <ul>${result.contributions.map(item => `<li>${K(copyDimension(item.dimension))}：${item.score} × ${scoreNumber(item.weight * 100)}% = ${scoreNumber(item.contribution)}</li>`).join('')}</ul>
      <p>使用完整精度相加后，最终分保留一位小数；明细的显示舍入可能相差 0.1。</p>
    </details>
  </section>`;
}

function cardReviewDetails(card) {
  const review = card.review;
  if (!review) return '';
  const sources = review.sourceIds.map(id => SCORING_SOURCES[id]).filter(Boolean);
  return `<details class="card-rating-evidence"><summary>评分依据 · ${K(review.status)}</summary>
    <p>综合 = (${card.atk} + ${card.def}) ÷ 2，四舍五入后为 ${T(card)}。星级与稀有度不重复计入此分。</p>
    <p>策展指数 ${review.curation} = 综合 × 60% + 参考分 ${review.reference} × 40%，对应${K(b[card.rarity])} ${fn[card.rarity]} 星。</p>
    ${review.author ? `<p>作者／相关创作者：${K(review.author)}</p>` : ''}
    <p>${K(review.rationale)}</p>
    ${review.atkRubric ? `<p>ATK 三项：${review.atkRubric.join(' / ')}；DEF 三项：${review.defRubric.join(' / ')}。每项 0–4，轴分 = 50 + 4 × 三项合计。具体项目见「游戏玩法」。</p>` : '<p>这张卡沿用提档前的编辑初评，尚未完成逐项文献复核；历史名作分只用于透明校准策展参考，不代表学术定论。</p>'}
    ${sources.length ? `<ul>${sources.map(source => `<li><a href="${K(source.url)}" target="_blank" rel="noopener noreferrer">${K(source.title)}</a></li>`).join('')}</ul>` : ''}
    <p>资料支持作品、人物或方法的背景；具体数值与星级是本游戏的编辑判断，资料机构未给这些分数。</p>
  </details>`;
}

const AXIS_RUBRICS = {
  剧目: ['目标与阻力／冲突递进／选择后果', '结构自洽／线索呼应／舞台可实现性'],
  风格体系: ['观看方式改变／表达辨识度／行动转化', '方法清晰／训练可复用／实践支撑'],
  导演手法: ['注意力调度／行动推进／表达增益', '规则清晰／执行可控／情境适配'],
  主演: ['目标驱动／主动选择／改变局势', '动机一致／人物层次／原作身份'],
  配角: ['施加阻力／关系转折／影响主角选择', '独立动机／关系层次／原作功能'],
  环境: ['空间限制／行动机会／戏剧张力', '表演承载／调度可行／叙事情境']
};

function scoringHelp(state) {
  const rates = v.map(rank => `<li>${pn(rank)}<span>${y[rank]}%</span></li>`).join('');
  const tiers = ['<60', '60–<66', '66–<72', '72–<78', '78–<84', '84–<90', '≥90'];
  const resonance = [.3, .45, .6, .8, 1, 1.2, 1.4];
  return `<h2 id="sheet-title">游戏玩法与评分 · v38</h2>
    <ol><li>综合包每次开六张：剧本、演法、手段、主角、配角、空间各一张。</li><li>翻卡后看释义与评分依据，再看这一台的综评。</li><li>同色成组、同剧人物与场景、明确兼容的演法手段都能加分。</li></ol>
    <h3>单卡与整台</h3>
    <p>单卡综合 = ATK 50% + DEF 50%（四舍五入）。整台 = 六维加权均分 + 同色共鸣（最多 7）+ 剧目羁绊（最多 8），最终封顶 100 分。没有羁绊不扣基础分。</p>
    <p>基础权重：剧本 22%、主角 20%、手段 16%、配角 16%、演法 14%、空间 12%。旧五卡分享按已有五维重新归一，不补卡、不扣缺席分。</p>
    <p>90 起为「绝佳」，80 起「出彩」，70 起「成台」，60 起「初成」，60 以下「待磨」。这是本游戏的组合评价，不给文学作品或作者排总榜。</p>
    <details><summary>同色共鸣怎样加分</summary><p>同稀有度至少两张才生效。每组加分 =（张数 − 1）× 下表系数；不同颜色组相加，同一张不重复算。颜色相同必须是同一稀有度代码，不能仅看插画底色。</p><ul>${v.map((rank, i) => `<li>${K(b[rank])} ${i + 1} 星：每多一张 +${resonance[i]}；两张 +${resonance[i]}，六张 +${scoreNumber(resonance[i] * 5)}</li>`).join('')}</ul></details>
    <details><summary>同剧与六维羁绊怎样加分</summary><ul><li>剧本＋原作主角：+3，例如《俄狄浦斯王》＋俄狄浦斯。</li><li>剧本＋原作配角：+2。</li><li>主角＋配角同属一部作品：+1。</li><li>剧本＋明确的原作空间：+1。</li><li>演法＋手段属于已登记的同一方法体系：+1。</li></ul><p>同一关系只记一次，最多 8 分。用明确作品 ID 和关系表判定；同作者、名字相似、泛用空间或主题相近都不会自动算同剧。不因跨剧或实验风格自动扣分。</p></details>
    <details><summary>六维 ATK／DEF 参考标准</summary><ol class="help-dims">${x.map(dim => `<li><b>${K(dim.short)}</b><small>ATK ${K(dim.atk)}：${K(AXIS_RUBRICS[dim.key][0])}。</small><small>DEF ${K(dim.def)}：${K(AXIS_RUBRICS[dim.key][1])}。</small></li>`).join('')}</ol><p>有来源的复评每轴三项，每项 0–4：0 未形成、1 有限、2 清晰、3 突出、4 具示范性。轴分 = 50 + 4 × 三项合计，范围 50–98；未知不能当作 0。非线性与荒诞结构可同样获得高 DEF。未逐项复核的卡会标「历史编辑初评」。</p></details>
    <details><summary>星级、稀有度与剧作家如何参考</summary><p>星级与边框颜色一一对应。策展指数 = 单卡综合 × 60% + 参考分 × 40%；它决定收藏档位，不反向抬高攻防。</p><ul>${v.map((rank, i) => `<li>${K(b[rank])} ${i + 1} 星：策展指数 ${tiers[i].replaceAll('<', '&lt;')}。</li>`).join('')}</ul><p>参考分考察该作品／人物／方法／空间的历史影响、持续舞台实践、教学研究与代表性。剧作家的贡献是背景证据，不能让其所有作品和角色自动成为绝唱；主配角采用相同门槛。</p><p>有来源的锚点与历史初评分开标记，卡片详情可查看依据。诺贝尔、普利策、剧院、大学或 UNESCO 资料不直接等于游戏分数。</p></details>
    <details><summary>抽取概率与保底</summary><ul class="rate-list">${rates}</ul><p>先抽档位，再在该维度同档内等概率选一张，不再优待同档高分卡。若该维缺档则向相邻档位回退，因此每维实际概率见版本规则表。综合包连续 30 包未出压轴以上，第 30 包保证一张；连续 60 包未出独步以上，第 60 包保证一张，自然出货重置对应计数。</p><p>单维包从任务领取次数，一次六张同维卡；今日赠礼仍为下次综合包提高高档机会。卡片收藏和保底保存在当前浏览器，更新不清空；旧分享链接按 v38 重新算分。</p></details>
    <p>翻卡时可跳过动画；点已翻开的卡查看小注与评分依据。右上角可以关闭声音。</p>
    <p class="sheet-fine">牌池 ${K(state.poolSize || '')} 张。评分版本 v38：同一套公式用于卡面、图鉴、雷达、综评与分享图。</p>
    <button type="button" class="btn primary" data-action="close-sheet">知道了</button>`;
}
