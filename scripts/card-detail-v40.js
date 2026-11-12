function statAxesMarkupV40(card){
  const review=statRationaleV40(card),dimension=x.find(item=>item.key===card.dimension);
  return `<div class="axes">${['atk','def'].map(axis=>{
    const stat=review[axis],value=Math.max(0,Math.min(100,Number(stat.value)||0));
    const hint=axis==='atk'?dimension?.atkHint:dimension?.defHint;
    return `<details class="axis axis-${axis} stat-axis">
      <summary><span class="axis-top"><span class="axis-ico">${axis==='atk'?sn:cn}</span><span class="axis-name">${axis.toUpperCase()} ${K(stat.label)}</span><b>${K(stat.value)}</b></span>
        <span class="axis-track" aria-hidden="true"><i style="width:${value}%"></i></span>${hint?`<span class="axis-hint">${K(hint)}</span>`:''}
      </summary>
      <div class="stat-axis-reading"><p>${K(stat.reason)}</p>
        ${review.sources.length?`<p class="stat-sources">资料：${review.sources.map(source=>`<a href="${K(source.url)}" target="_blank" rel="noopener noreferrer">${K(source.title)}</a>`).join('；')}</p>`:''}
        <p class="stat-note">${K(review.note)}</p>
      </div>
    </details>`;
  }).join('')}</div>`;
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
