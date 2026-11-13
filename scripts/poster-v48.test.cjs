const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require.resolve('./poster-v48.js'),'utf8');

class Element{
  constructor(tag,text=''){this.tag=tag;this._text=text;this.childNodes=[];this.className='';this.attributes={};this.style={};this.hidden=false;this.classList={add:name=>this.className+=' '+name};}
  append(...nodes){for(const node of nodes){node.remove();node.parent=this;this.childNodes.push(node);}}
  remove(){if(this.parent){this.parent.childNodes=this.parent.childNodes.filter(node=>node!==this);this.parent=null;}}
  replaceWith(node){const parent=this.parent,index=parent.childNodes.indexOf(this);node.remove();parent.childNodes[index]=node;node.parent=parent;this.parent=null;}
  matches(selector){if(selector.startsWith('.'))return this.className.split(/\s+/).includes(selector.slice(1));if(selector==='[data-action]')return 'data-action' in this.attributes;return this.tag===selector;}
  querySelectorAll(selector){const nodes=[];for(const child of this.childNodes){if(child.matches(selector))nodes.push(child);nodes.push(...child.querySelectorAll(selector));}return nodes;}
  querySelector(selector){if(selector.includes(' ')){const [parent,child]=selector.split(' ');return this.querySelector(parent)?.querySelector(child)||null;}return this.querySelectorAll(selector)[0]||null;}
  setAttribute(key,value){this.attributes[key]=value;}
  removeAttribute(key){delete this.attributes[key];}
  addEventListener(){}
  showModal(){this.open=true;}
  get textContent(){return this._text+this.childNodes.map(node=>node.textContent).join('');}
  set textContent(text){this._text=text;this.childNodes=[];}
  set innerHTML(html){this.html=html;if(this.tag==='dialog')this.append(new Element('button'));}
}
function element(tag,cls,text=''){const node=new Element(tag,text);node.className=cls;return node;}
function fixture(){
  const poster=element('section','result-screen'),wrap=element('div','result-wrap'),talk=element('section','talk');
  const full=element('div','talk-full','最后一句完整保留。');full.hidden=true;
  const details=element('details','talk-references'),summary=element('summary','','读剧参考'),list=element('ul',''),item=element('li','','编剧资料：'),link=element('a','','完整的资料名称');link.setAttribute('href','https://example.org/source');item.append(link);list.append(item);details.append(summary,list);
  talk.append(element('div','talk-short','摘要'),full,element('button','talk-toggle','展开'),details);wrap.append(talk,element('section','share-block'));poster.append(wrap);
  return {poster,details,list,link,full};
}
function harness(render){
  const data=fixture(),body=new Element('body'),state={cards:[{id:'current-card'}]},button={textContent:'长按保存长图',disabled:false};
  const document={body,fonts:{ready:Promise.resolve()},createElement(tag){if(tag==='template')return {content:{firstElementChild:data.poster},set innerHTML(value){}};return new Element(tag);}};
  const ctx={document,console:{error(){}},Un(input){state.input=input;return '<section></section>';},ar:()=>({drawn:[{id:'old-card'}]}),productionCardsV40:()=>state.cards,finishProductionV40(){state.finished=true;},posterSealText:()=> '咫牌',Y:{loop:{}},Q:text=>state.toast=text,loadPosterRenderer:()=>async(poster,options)=>{state.options=options;state.rendered=poster;await render?.(poster);return {toDataURL:()=> 'data:image/png;base64,aW1hZ2U='};}};
  vm.createContext(ctx);vm.runInContext(source,ctx);
  return {...data,body,state,button,ctx};
}

test('长图在测量前将折叠参考变为普通区块，标题、链接与顺序完整保留',()=>{
  const h=harness();h.ctx.expandPosterDetailsV48(h.poster);
  assert.equal(h.poster.querySelectorAll('details').length,0);
  const refs=h.poster.querySelector('.talk-references');
  assert.equal(refs.tag,'section');assert.equal(refs.childNodes[0].tag,'h3');
  assert.equal(refs.childNodes[0].textContent,'读剧参考');
  assert.equal(refs.childNodes[1],h.list);assert.equal(h.link.attributes.href,'https://example.org/source');
  assert.equal(refs.textContent,'读剧参考编剧资料：完整的资料名称');
});
test('生成长图使用当前卡组的完整正文，先展开参考再渲染，并显示可长按的原图',async()=>{
  const h=harness(poster=>{
    assert.equal(poster.querySelectorAll('details').length,0);
    assert.equal(poster.querySelector('.talk-full').hidden,false);
    assert.equal(poster.querySelector('.talk-short'),null);
    assert.equal(poster.querySelector('.share-block'),null);
    assert.match(poster.textContent,/最后一句完整保留。读剧参考编剧资料：完整的资料名称咫牌/);
  });
  await h.ctx.sharePoster(h.button,'long');
  assert.equal(h.state.finished,true);assert.deepEqual(h.state.input.drawn,h.state.cards);assert.equal(h.state.input.talkOpen,true);
  assert.equal(h.state.options.scale,2);
  const dialog=h.body.querySelector('dialog');assert.ok(dialog?.open);
  assert.match(dialog.html,/<img class="poster-save-image"[^>]+src="data:image\/png;base64,aW1hZ2U="/);
  assert.match(dialog.html,/长按下方图片/);assert.match(dialog.html,/download="DiaGacha-节目单.png"/);
  assert.equal(h.poster.parent,null);assert.equal(h.button.disabled,false);assert.equal(h.button.textContent,'长按保存长图');
});
test('生成失败会恢复保存入口并移除临时长图，不残留遮挡页面的导出节点',async()=>{
  const h=harness(()=>{throw Error('render failed');});await h.ctx.sharePoster(h.button,'long');
  assert.equal(h.button.disabled,false);assert.equal(h.button.textContent,'长按保存长图');
  assert.equal(h.poster.parent,null);assert.equal(h.body.childNodes.length,0);assert.match(h.state.toast,/生成失败/);
});

test('导出途中改写卡组或离开结果页，不弹出旧图也不覆盖分享缓存',async()=>{
  for(const next of [[],[{id:'rewritten-card'}]]){
    let release,started;
    const entered=new Promise(resolve=>started=resolve),gate=new Promise(resolve=>release=resolve);
    const h=harness(async()=>{started();await gate;});
    const pending=h.ctx.sharePoster(h.button,'long');
    await entered;h.state.cards=next;release();await pending;
    assert.equal(h.body.querySelector('dialog'),null);
    assert.equal(h.poster.parent,null);assert.equal(h.button.disabled,false);
    assert.equal(vm.runInContext('lastSharePoster',h.ctx),null);
  }
});
