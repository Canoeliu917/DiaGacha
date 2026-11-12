function hexRadar(cards){
  const six=cards.length===6,labels=cards.map(card=>copyDimension(card.dimension));
  const scores=cards.map(T),radius=92;
  // One shared display scale: double the length differences in the common 50–90 range.
  const length=score=>{
    const value=Math.max(0,Math.min(100,score));
    return radius*(value<=50?value*.003:value<=90?.15+(value-50)*.02:.95+(value-90)*.005);
  };
  const point=(i,r)=>{const a=(i*360/cards.length-90)*Math.PI/180;return [170+Math.cos(a)*r,128+Math.sin(a)*r];};
  const ring=r=>labels.map((_,i)=>point(i,r));
  const values=scores.map((score,i)=>point(i,length(score)));
  const path=points=>'M'+points.map(p=>p.map(n=>n.toFixed(2)).join(',')).join(' L')+' Z';
  const labelPositions=six?[[170,12],[292,72],[292,184],[170,244],[48,184],[48,72]]:[[170,12],[294,96],[244,238],[96,238],[46,96]];
  return `<section class="hex-panel" aria-label="${six?'六':'五'}维评分，使用统一非线性尺度放大分差，数字为原分，尖角越长分数越高">
    <div class="hex-chart">
      <svg class="hex-radar" viewBox="0 0 340 258" aria-hidden="true">
        ${[1/3,2/3,1].map(fraction=>`<path class="hex-grid${fraction===1?' hex-grid-max':''}" d="${path(ring(radius*fraction))}"/>`).join('')}
        ${labels.map((_,i)=>`<line class="hex-axis" x1="170" y1="128" x2="${point(i,radius)[0]}" y2="${point(i,radius)[1]}"/>`).join('')}
        <path class="hex-area" data-base-points="${values.map(p=>p.join(',')).join(' ')}" d="${path(values)}"/>
        ${six?[[0,2,4],[1,3,5]].map(indices=>`<path class="hex-star" d="${path(indices.map(i=>values[i]))}"/>`).join(''):`<path class="hex-star" d="${path([0,2,4,1,3].map(i=>values[i]))}"/>`}
        ${labels.map((_,i)=>`<line class="hex-ray" data-axis="${i}" pathLength="1" x1="170" y1="128" x2="${values[i][0]}" y2="${values[i][1]}"/>`).join('')}
        ${values.map((p,i)=>`<circle class="hex-dot" data-axis="${i}" cx="${p[0]}" cy="${p[1]}" r="4" data-base-cx="${p[0]}" data-base-cy="${p[1]}"/>`).join('')}
      </svg>
      ${labels.map((label,i)=>`<button type="button" class="hex-corner" style="left:${labelPositions[i][0]/340*100}%;top:${labelPositions[i][1]/258*100}%" data-action="detail" data-id="${K(cards[i].id)}" aria-label="${K(label)}，${K(cards[i].name)}，${scores[i]}分，查看详情"><span class="hex-label">${K(label)}</span><span class="hex-value" data-final="${scores[i]}">${scores[i]}</span></button>`).join('')}
    </div>
    <p class="hex-caption">形状放大分差，数字为原分</p>
  </section>`;
}
