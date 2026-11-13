/* Reproduce the review sheet without changing game art. Run from any directory. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const {Resvg} = require(path.join(root, '..', 'art-raster', 'node_modules', '@resvg', 'resvg-js'));
const output = path.resolve(root, '..', '..', 'outputs');
const scratch = path.resolve(root, '..', 'figure-comparison-v40');
fs.mkdirSync(output, {recursive:true});
fs.mkdirSync(scratch, {recursive:true});
const current = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const original = execFileSync('git', ['show','7efae312:index.html'], {cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const headCode = html => html.slice(html.indexOf('function figHead('), html.indexOf('function figProp('));
function palette(html, scope) {
  const start = html.indexOf('var L=', html.indexOf('function ft('));
  assert(start >= 0);
  vm.runInContext(html.slice(start, html.indexOf(';function mt',start)+1),scope);
}
const scope = vm.createContext({});
palette(current,scope);
vm.runInContext(headCode(current),scope);
vm.runInContext(fs.readFileSync(path.join(__dirname,'art-figures-v39.js'),'utf8'),scope);
const old = vm.createContext({});
palette(original,old);
vm.runInContext(original.slice(original.indexOf('function figHash('),original.indexOf('function bt(')),old);
const sameHead = headCode(current).replace(/\r/g,'') === headCode(original).replace(/\r/g,'');
const sameFace = scope.figFace.toString().replace(/\r/g,'') === old.figFace.toString().replace(/\r/g,'');
assert(sameFace,'The facial drawing changed; revise the continuity note.');
const baseline = {id:'comparison',n:0,head:'crop',hair:'crop',face:'quiet',skin:'fair',cloth:'#485766',prop:'none',costume:'plain'};
const features = {
  lipao:['宽袖直身','交领金线','对称长摆'],
  changqun:['方领收腰','钟形宽裙','弯臂捧手'],
  duanda:['V 领短衣','翻折袖口','分腿迈步'],
  jiazhou:['外扩肩甲','分格胸甲','分片甲裙'],
  doupeng:['不对称披风','深色开口','尖角长摆'],
  xizhuang:['双翻领','细长领带','短夹克长裤'],
  laozuo:['挂颈围裙','大方形口袋','围裙叠长衣'],
  pizhe:['斜肩扣针','斜线披褶','不齐裙摆'],
  poyi:['高低肩线','斜线补丁','锯齿破摆'],
  dayi:['宽翻领','长条围巾','双开长摆'],
  lifu:['领结白胸片','双燕尾长角','单臂高举'],
  zhifu:['肩章立领','双胸袋','腰带长裤'],
  changshan:['圆肩窄直身','偏襟横盘扣','两侧开衩'],
  qipao:['立领斜襟','明显收腰','单侧高衩'],
  magua:['对襟横盘扣','宽口短袖','短褂宽裤'],
  gongzhuang:['双背带','方形胸袋','宽裤迈步'],
  baiyi:['浅色外褂','开襟深内衫','翻领双口袋'],
  jinpao:['包头巾罩肩','披巾深色开口','闭合拖地袍'],
  tongqun:['平肩直筒','腰际横线','竖褶与平摆'],
  zuozi:['椅背横档','屈膝前伸','屈肘收手'],
  goulou:['前屈弓背','屈膝短步','伸手撑杖']
};
const entries = Object.entries(scope.FIGURE_FEATURES_V39);
assert.equal(entries.length,21);
assert.deepEqual(Object.keys(features),entries.map(([key])=>key));
const W=2240,H=2000,M=64,CW=288,CH=406,GAP=16,GRIDY=650;
const paper='#f3efe6',card='#fffcf8',ink='#241c16',muted='#776b5e',rule='#d8ccba',red='#963c35';
const esc = s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,size=24,fill=ink,weight=400,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${esc(s)}</text>`;
const line=(x1,y1,x2,y2,color=rule)=>`<path d="M${x1} ${y1} H${x2}" fill="none" stroke="${color}" stroke-width="1"/>`;
const wrapped = body=>`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="200" viewBox="-120 -20 240 200">${body}</svg>`;
const font={loadSystemFonts:false,fontFiles:['C:/Windows/Fonts/msyh.ttc','C:/Windows/Fonts/msyhbd.ttc'],defaultFontFamily:'Microsoft YaHei'};
let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${paper}"/><g font-family="Microsoft YaHei">`;
svg+=text(M,64,'DIAGACHA  /  咫牌 · 造型核对',21,muted,500,'letter-spacing="2"');
svg+=text(M,144,'21 种小人，逐一看清',58,ink,700);
svg+=text(W-M,137,'现版造型对照  ·  v49',24,muted,400,'text-anchor="end"');
svg+=line(M,178,W-M,178,ink);
svg+=text(M,222,'原版 / 现版小样',26,ink,700);
svg+=text(365,222,'相同头部与主衣色，直接比较剪影、衣领和衣摆。',24,muted);
const pairs=[['lipao','礼袍'],['changqun','长裙'],['xizhuang','西装']];
pairs.forEach(([fig,name],i)=>{
  const x=M+i*704;
  svg+=`<rect x="${x}" y="248" width="688" height="288" fill="${card}"/>`;
  svg+=text(x+24,286,name,28,ink,700);
  svg+=`<g transform="translate(${x+278} 282) scale(1.14)">${old.figBody({...baseline,fig})}</g>`;
  svg+=`<g transform="translate(${x+498} 282) scale(1.14)">${scope.figBodyV39({...baseline,fig})}</g>`;
  svg+=text(x+278,508,'原版',23,muted,400,'text-anchor="middle"');
  svg+=text(x+498,508,'现版',23,red,700,'text-anchor="middle"');
  svg+=text(x+388,398,'→',28,muted,400,'text-anchor="middle"');
});
svg+=text(M,578,'画风核对：圆脸、点眼与纸片感沿用；现版整理发型位置、衣装结构与动作。',25,ink);
svg+=text(M,618,'统一短发、表情、肤色与主衣色；保留类型默认姿态，无额外持物或服装叠层。',23,muted);
const bounds=[],rowStarts=[];
entries.forEach(([fig,feature],i)=>{
  const x=M+(i%7)*(CW+GAP),y=GRIDY+Math.floor(i/7)*(CH+GAP);
  const body=scope.figBodyV39({...baseline,fig});
  assert(!/undefined|NaN|Infinity/.test(body),fig);
  const bbox=new Resvg(wrapped(body),{font:{loadSystemFonts:false}}).getBBox();
  assert(bbox && bbox.x>=-90 && bbox.x+bbox.width<=90 && bbox.y>=-10 && bbox.y+bbox.height<=170,`${fig}: unexpected bounds ${JSON.stringify(bbox)}`);
  bounds.push({fig,name:feature.name,pose:feature.pose,bounds:bbox,labels:features[fig]});
  const number=String(i+1).padStart(2,'0');
  if(i%7===0)rowStarts.push(svg.length);
  svg+=`<g data-review-figure="${fig}"><rect x="${x}" y="${y}" width="${CW}" height="${CH}" fill="${card}"/>`;
  svg+=text(x+20,y+40,number,19,muted,500);
  svg+=text(x+CW/2,y+42,feature.name,29,ink,700,'text-anchor="middle"');
  svg+=`<g transform="translate(${x+CW/2} ${y+67}) scale(1.28)">${body}</g>`;
  svg+=line(x+24,y+288,x+CW-24,y+288);
  features[fig].forEach((label,j)=>{svg+=text(x+CW/2,y+323+j*31,label,24,j===0?ink:muted,j===0?500:400,'text-anchor="middle"');});
  svg+='</g>';
});
rowStarts.push(svg.length);
svg+=line(M,1932,W-M,1932);
svg+=text(M,1970,'读取实际游戏图形生成；原版取自 7efae312。浅色外褂、头巾等结构色保留。',21,muted);
svg+=text(W-M,1970,'21 / 21',21,red,700,'text-anchor="end"');
svg+='</g></svg>';
assert.equal((svg.match(/data-review-figure=/g)||[]).length,21);
const svgPath=path.join(output,'21-figure-comparison.svg');
const pngPath=path.join(output,'21-figure-comparison.png');
fs.writeFileSync(svgPath,svg);
const renderer=new Resvg(svg,{font});
fs.writeFileSync(pngPath,renderer.render().asPng());
// Outline text so the SVG remains portable without installed Chinese fonts.
fs.writeFileSync(svgPath,renderer.toString());
fs.writeFileSync(path.join(scratch,'verification.json'),JSON.stringify({count:entries.length,sameHead,baseline,bounds,source:'scripts/art-figures-v39.js',original:'7efae312:index.html',size:[W,H]},null,2));
// Cropped review images use the same SVG scene, with no browser or image redrawing.
for(let row=0;row<3;row++) {
  const y=GRIDY+row*(CH+GAP);
  const strip=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${CH+8}" viewBox="0 0 ${W} ${CH+8}"><rect width="${W}" height="${CH+8}" fill="${paper}"/><g font-family="Microsoft YaHei" transform="translate(0 ${4-y})">${svg.slice(rowStarts[row],rowStarts[row+1])}</g></svg>`;
  fs.writeFileSync(path.join(scratch,`review-row-${row+1}.png`),new Resvg(strip,{font}).render().asPng());
}
console.log(JSON.stringify({pngPath,svgPath,count:entries.length,sameHead,size:[W,H]},null,2));
