let pageHistoryV42=[],pageCursorV42=-1,turningPageV42=false;
const pageFieldsV42=['view','index','drawn','pack','packCard','albumDim','albumSort','albumPage','fromShare','problems','bundle','booster','fromPack','slot','talkOpen','keptShare','rehearsal','rehearsalPreview'];
function pageSnapshotV42(){
  return JSON.parse(JSON.stringify(Object.fromEntries(pageFieldsV42.map(field=>[field,Y[field]]))));
}
function recordPageV42(){
  if(turningPageV42)return;
  const scroll=document.scrollingElement?.scrollTop||0,current=pageHistoryV42[pageCursorV42];
  if(current)current.scroll=scroll;
  const entry={state:pageSnapshotV42(),url:location.pathname+location.search+location.hash,scroll:current?.state.view===Y.view?scroll:0};
  if(current?.state.view===Y.view){pageHistoryV42[pageCursorV42]=entry;return;}
  pageHistoryV42.splice(pageCursorV42+1);
  pageHistoryV42.push(entry);
  pageCursorV42=pageHistoryV42.length-1;
}
function turnPageV42(direction){
  const next=pageCursorV42+(direction<0?-1:1);
  if(next<0||next>=pageHistoryV42.length)return;
  const current=pageHistoryV42[pageCursorV42];
  current.state=pageSnapshotV42();
  current.scroll=document.scrollingElement?.scrollTop||0;
  current.url=location.pathname+location.search+location.hash;
  pageCursorV42=next;
  const entry=pageHistoryV42[next];
  Object.assign(Y,JSON.parse(JSON.stringify(entry.state)),{sheet:null});
  if(Y.view==='pack'&&Y.booster?.phase==='card'){
    Y.booster.revealDone=true;
    Y.booster.askSkip=false;
    Y.booster.skipPreamble=false;
  }
  history.replaceState(history.state,'',entry.url);
  turningPageV42=true;
  try{Z();if(document.scrollingElement)document.scrollingElement.scrollTop=entry.scroll;}
  finally{turningPageV42=false;}
}
function renderPageArrowsV42(){
  const arrow='<svg viewBox="0 0 44 24" aria-hidden="true"><path d="M36 10C27 8 17 10 8 12M8 12L16 5M8 12L17 18"/></svg>';
  return `<nav class="page-arrows-v42" aria-label="页面翻页"><button type="button" class="page-arrow-v42" data-action="page-back" aria-label="上一页" title="上一页"${pageCursorV42<=0?' disabled':''}>${arrow}</button><button type="button" class="page-arrow-v42 page-arrow-next-v42" data-action="page-forward" aria-label="下一页" title="下一页"${pageCursorV42>=pageHistoryV42.length-1?' disabled':''}>${arrow}</button></nav>`;
}
