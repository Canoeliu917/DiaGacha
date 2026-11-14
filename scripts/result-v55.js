function Un(state){
  const cards=state.drawn,result=Xt(cards),score=result.score;
  const minis=displayCastMinis(cards).map(({card,weightLabel})=>`<div class="cast-slot-v55"><button type="button" class="cast-mini rarity-${K(card.rarity)}" data-action="detail" data-id="${K(card.id)}" aria-label="看${K(card.name)}，${K(b[card.rarity]||card.rarity)}"><span class="art-wrap">${artBadge(card)}${Ct(card)}</span><span class="mini-body"><span class="mini-slot">${K(weightLabel)}</span><span class="mini-name">${K(card.name)}</span></span></button>${renderRewriteEntryV55(state,card)}</div>`).join('');
  return `<section class="screen result-screen" data-screen="result">
    ${q(state).replace('DiaGacha</span>','DiaGacha·咫牌</span>')}
    <div class="result-wrap">
      ${state.fromShare?'<div class="try-own"><button type="button" class="btn primary" data-action="try-own">我也开一台</button></div>':''}
      <div class="result-premiere-v53"><p class="result-kicker-v53">今晚的意外好戏</p><h1 class="verdict">${K(dramaticTitleV40(cards))}</h1><p class="result-hook-v53">${cards.length===5?'五':'六'}张卡，开出你的意外好戏。</p></div>
      <div class="cast-row six-cast">${minis}</div>
      ${cards.length===5?'<p class="legacy-cast">这一台没有配角入册</p>':''}
      ${renderRehearsalV53(state)}
      <div class="result-final-score-v53" aria-label="卡组搭配分 ${score}，满分 100"><span>我的卡组评分</span><strong>${score}</strong><span>/ 100</span><span class="result-grade-v53">${K(result.scoring.grade)}</span></div>
      ${hexRadar(cards)}
      ${An(cards,state.talkOpen)}
      ${scoreBreakdown(result.scoring,cards)}
      ${stagePersonaMarkupV53(cards)}
      <div class="result-share-actions-v53"><button type="button" class="btn primary" data-action="poster-short">生成朋友圈分享图</button><button type="button" class="text-btn" data-action="copy-social">复制朋友圈文案</button></div>
      <p class="result-share-note-v53">保存这一台，邀朋友也开一场戏。</p>
      ${state.fromShare?'':renderAchievementsV54()}
      <section class="share-block"><h2>把节目单递出去</h2><div class="dock share-dock"><button type="button" class="btn ghost" data-action="again">再开一台</button><button type="button" class="btn ghost" data-action="poster">长按保存长图</button><button type="button" class="btn ghost" data-action="copy">复制链接</button><button type="button" class="btn ghost" data-action="native-share">转发给朋友</button></div></section>
    </div>
  </section>`;
}
