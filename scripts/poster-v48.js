let lastSharePoster=null;
function showPosterDialog(url,mode,button){
  const dialog=document.createElement('dialog');
  dialog.className='poster-dialog';
  const title=mode===`short`?`朋友圈分享图`:`长按保存长图`;
  const alt=mode===`short`?`本局分享图：剧名、真实得分、卡组、故事摘要与游戏二维码`:`本局节目单：卡组、六芒星、这台分数、综评和咫言咫语`;
  dialog.setAttribute('aria-label',title);
  dialog.innerHTML=`<h2>${title}</h2><p>长按下方图片，选择“存储图像”或“保存到相册”。也可以下载原图。</p><img class="poster-save-image" alt="${alt}" src="${url}"><div class="dock"><a class="btn primary" href="${url}" download="DiaGacha-${mode===`short`?`朋友圈分享图`:`节目单`}.png">${mode===`short`?`下载分享图`:`下载长图`}</a><button type="button" class="btn ghost">关闭</button></div>`;
  dialog.querySelector('button').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{dialog.remove();button?.focus?.({preventScroll:true});},{once:true});
  document.body.append(dialog);
  dialog.showModal();
}
function expandPosterDetailsV48(poster){
  // A normal section has the same measured height in the page and the canvas clone.
  poster.querySelectorAll('details').forEach(details=>{
    const section=document.createElement('section');
    section.className=details.className;
    const summary=details.querySelector('summary');
    if(summary){
      const heading=document.createElement('h3');
      heading.className='poster-reference-title';
      heading.textContent=summary.textContent;
      section.append(heading);
      summary.remove();
    }
    section.append(...details.childNodes);
    details.replaceWith(section);
  });
}
async function sharePoster(button,mode=`long`){
  if(button?.disabled)return;
  const cards=productionCardsV40().slice(),key=cards.map(card=>card.id).join('.');
  const stillCurrent=()=>productionCardsV40().map(card=>card.id).join('.')===key;
  const label=button?button.textContent:'';
  if(button){button.disabled=true;button.textContent='生成中…';}
  let poster;
  try{
    await document.fonts.ready;
    if(!stillCurrent())return;
    finishProductionV40();
    // Rebuild a completed programme instead of cloning in-flight opacity and transforms.
    const template=document.createElement('template');
    template.innerHTML=mode===`short`?socialPosterV53(cards):Un({...ar(),drawn:cards,talkOpen:true});
    poster=template.content.firstElementChild;
    poster.classList.add('poster-static');
    poster.querySelector('.share-block')?.remove();
    poster.querySelector('.top-actions')?.remove();
    poster.querySelector('.try-own')?.remove();
    poster.querySelector('.result-share-actions-v53')?.remove();
    poster.querySelector('.result-share-note-v53')?.remove();
    poster.querySelector('.rewrite-panel')?.remove();
    const scoringDetails=poster.querySelector('.score-explanation details');
    if(scoringDetails){
      if(mode===`short`)scoringDetails.remove();
      else scoringDetails.querySelector('summary')?.remove();
    }
    if(mode===`short`){
      poster.querySelector('.talk')?.remove();
      poster.querySelector('.chem-list')?.remove();
      poster.querySelector('.score-weight-note')?.remove();
      poster.querySelector('.sheet-fine')?.remove();
    }else{
      poster.querySelector('.talk-short')?.remove();
      poster.querySelector('.talk-toggle')?.remove();
      const full=poster.querySelector('.talk-full');
      if(full)full.hidden=false;
    }
    expandPosterDetailsV48(poster);
    const seal=document.createElement('p');
    seal.className='poster-seal';
    seal.textContent=posterSealText(Y.loop);
    poster.querySelector('.result-wrap')?.append(seal);
    poster.querySelectorAll('[data-action]').forEach(el=>el.removeAttribute('data-action'));
    poster.setAttribute('aria-hidden','true');
    poster.style.cssText='position:absolute;left:-10000px;top:0;width:390px;max-width:none;min-height:0;height:auto;max-height:none;margin:0;box-sizing:border-box;pointer-events:none';
    document.body.append(poster);
    const radar=poster.querySelector('.hex-radar');
    if(radar){radar.setAttribute('width','300');radar.setAttribute('height','228');}
    const canvas=await loadPosterRenderer()(poster,{scale:mode===`short`?3:2,backgroundColor:'#f3efe6',logging:false,windowWidth:390,windowHeight:844,scrollX:0,scrollY:0});
    if(!stillCurrent())return;
    const url=canvas.toDataURL('image/png');
    lastSharePoster={url,mode};
    showPosterDialog(url,mode,button);
  }catch(error){
    console.error('Poster generation failed',error);
    Q((mode===`short`?`分享图`:`长图`)+'生成失败，请重试。');
  }finally{
    poster?.remove();
    if(button){button.disabled=false;button.textContent=label;}
  }
}
function savePoster(button){
  if(lastSharePoster){showPosterDialog(lastSharePoster.url,lastSharePoster.mode,button);return;}
  sharePoster(button,`long`);
}
