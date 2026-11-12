const DiaRatesV40 = {
  standard: { C: 20, UC: 24, R: 25, SR: 15, SSR: 10, UR: 5, LR: 1 },
  gift: { C: 8, UC: 12, R: 25, SR: 24, SSR: 18, UR: 9, LR: 4 },
};

function effectiveRatesV40(pool, dimension, table = DiaRatesV40.standard, resolveTier = ee) {
  const cards = pool.filter(card => card.dimension === dimension);
  const rates = Object.fromEntries(Object.keys(table).map(rarity => [rarity, 0]));
  for (const [rarity, chance] of Object.entries(table)) rates[resolveTier(cards, rarity)[0].rarity] += chance;
  return rates;
}

function ratesHelpV40(pool) {
  const ranks = Object.keys(DiaRatesV40.standard);
  const dimensions = x.map(dimension => dimension.key);
  return `<p>普通包的 1–7 星档位概率依次为 ${Object.values(DiaRatesV40.standard).map(value => `${value}%`).join('、')}；今日赠礼的下一综合包依次为 ${Object.values(DiaRatesV40.gift).map(value => `${value}%`).join('、')}。</p>
    <p>先抽星级，再在对应维度同档内等概率选卡。缺档时落到最近档位，同距离优先较低档：当前剧本没有 1 星，转入 2 星；手段没有 7 星，转入 6 星。</p>
    <details><summary>查看各维实际出率</summary>${Object.entries(DiaRatesV40).map(([kind, table]) => `<div class="rates-table-scroll"><table><caption>${kind === 'standard' ? '普通包' : '今日赠礼包'} · 每张卡的实际星级概率</caption><thead><tr><th scope="col">维度</th>${ranks.map((_, i) => `<th scope="col">${i + 1} 星</th>`).join('')}</tr></thead><tbody>${dimensions.map(dimension => {
      const actual = effectiveRatesV40(pool, dimension, table);
      return `<tr><th scope="row">${K(copyDimension(dimension))}</th>${ranks.map(rarity => `<td>${actual[rarity]}%</td>`).join('')}</tr>`;
    }).join('')}</tbody></table></div>`).join('')}</details>`;
}

if (typeof module !== 'undefined' && module.exports) module.exports = { DiaRatesV40, effectiveRatesV40 };
