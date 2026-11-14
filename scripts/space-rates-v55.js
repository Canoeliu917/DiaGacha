const originalBalancedWeightsV55=balancedWeightsV53;
balancedWeightsV53=function(pool,dimension,table,resolveTier=ee){
  const rows=originalBalancedWeightsV55(pool,dimension,table,resolveTier);
  if(dimension!=='环境')return rows;
  const low=rows.filter(row=>v.indexOf(row.card.rarity)<=3),total=low.reduce((sum,row)=>sum+row.chance,0);
  if(!low.length)return rows;
  const cap=Math.max(.05,total/low.length);
  let open=low.slice(),remaining=total;
  while(open.length){
    const weight=open.reduce((sum,row)=>sum+row.chance,0);
    const high=open.filter(row=>(weight?remaining*row.chance/weight:remaining/open.length)>cap+1e-12);
    if(!high.length){for(const row of open)row.chance=weight?remaining*row.chance/weight:remaining/open.length;break;}
    for(const row of high){row.chance=cap;remaining-=cap;}
    open=open.filter(row=>!high.includes(row));
  }
  return rows;
};
const originalRatesHelpV55=ratesHelpV53;
ratesHelpV53=function(pool){return originalRatesHelpV55(pool).replace('1–4 星单张卡在同一维度的基础概率最多 8%','1–4 星单张卡在同一维度的基础概率最多 8%，空间卡则最多 5%');};
