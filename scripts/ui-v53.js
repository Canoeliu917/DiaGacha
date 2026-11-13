function albumPageV53(cards,page){
  const pages=Math.max(1,Math.ceil(cards.length/48));
  const current=Math.min(pages-1,Math.max(0,Math.floor(Number(page)||0)));
  return {cards:cards.slice(current*48,(current+1)*48),current,pages,total:cards.length};
}
function albumPagerV53(page){
  if(page.pages===1)return '';
  return `<nav class="album-pager-v53" aria-label="图鉴分页"><button type="button" class="btn ghost" data-action="album-page" data-page="${page.current-1}"${page.current===0?' disabled':''}>上一页</button><span aria-live="polite">${page.current+1} / ${page.pages} 页 · ${page.total} 张</span><button type="button" class="btn ghost" data-action="album-page" data-page="${page.current+1}"${page.current+1===page.pages?' disabled':''}>下一页</button></nav>`;
}
