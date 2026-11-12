function statDisclosureV40(card){
  const review=statRationaleV40(card);
  return `<details class="stat-rationale"><summary>评分依据 <span>为什么是这个分数</span></summary>
    <p class="stat-summary">${K(review.summary)}</p>
    ${['atk','def'].map(axis=>`<p class="stat-reason stat-${axis}"><b>${axis.toUpperCase()} ${K(review[axis].label)} · ${review[axis].value}</b>${K(review[axis].reason)}</p>`).join('')}
    ${review.sources.length?`<p class="stat-sources">资料：${review.sources.map(source=>`<a href="${K(source.url)}" target="_blank" rel="noopener noreferrer">${K(source.title)}</a>`).join('；')}</p>`:''}
    <p class="stat-note">${K(review.note)}</p>
  </details>`;
}

function xn(card){
  const high=['SSR','UR','LR'].includes(card.rarity);
  const notes=high&&typeof highStarNotesV40==='function'?highStarNotesV40(card):[cardEssays[card.id]||''];
  const sources=highStarSourcesV40(card);
  return `<article class="official">
    <h3>戏剧小注</h3>${roleSourceLine(card)}<p>${K(card.note)}</p>
    <p><b>看点：</b>${K(card.observe)}</p>
    ${notes.filter(Boolean).map(text=>`<p class="card-essay">${K(text)}</p>`).join('')}
    ${sources.length?`<p class="card-sources">阅读参考：${sources.map(source=>`<a href="${K(source.url)}" target="_blank" rel="noopener noreferrer">${K(source.title)}</a>`).join('；')}</p>`:''}
    <details class="rehearsal-note"><summary>排演参考（可选）</summary><p>${K(card.stage)}</p></details>
  </article>`;
}
