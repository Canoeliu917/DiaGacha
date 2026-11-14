/* Face-scale regressions: marks must remain readable without covering eyes or mouths. */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ink='#211d18',lip='#b5474a';
const scope=vm.createContext({L:ink,V:lip,B:'#98413c',z:'#bb9653',pt:{fair:'#f1d2b7'}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'figure-head-v49.js'),'utf8'),scope);
const tags=(face,type)=>[...scope.figFace(face).matchAll(new RegExp(`<${type}\\b[^>]*>`,'g'))].map(m=>Object.fromEntries([...m[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],a[2]])));
const xy=d=>{const n=d.match(/-?(?:\d*\.)?\d+/g).map(Number);assert.equal(n.length%2,0);return n.reduce((p,x,i)=>i%2?p:[...p,[x,n[i+1]]],[]);};

test('all revised makeup retains the original two dot eyes and round head',()=>{
  for(const face of ['blood','scar','wet','rouge','whitepaint']){
    assert.deepEqual(tags(face,'circle').map(e=>[+e.cx,+e.cy,+e.r,e.fill]),[[-6,-1,2.2,ink],[6,-1,2.2,ink]],face);
    assert.ok(scope.figHead({face,head:'crop',skin:'fair'},0,0,1,false).includes('<circle cx="0" cy="0" r="18"'),face);
  }
});

test('blood stays on one outer cheek; scar is a dry angled line on the other',()=>{
  const blood=tags('blood','path').filter(p=>p.fill&&p.fill!=='none');
  assert.equal(blood.length,2,'Short trickle and terminal drop, not a slash across the eyes');
  for(const p of blood)for(const [x,y] of xy(p.d))assert.ok(x>=9.5&&x<=14&&y>=2&&y<=14,'Blood clears dot eyes and open mouth');
  const scar=tags('scar','path').find(p=>p.stroke==='#9b735f');
  assert.equal(scar.fill,'none');
  assert.ok(!/[CQ]/.test(scar.d),'Dry scar uses corners, not a fluid contour');
  for(const [x,y] of xy(scar.d))assert.ok(x<=-9&&x>=-14&&y>=2&&y<=12,'Scar clears eyes, brows and mouth');
});

test('shy keeps its original closed eyes and a short off-centre mouth; smile stays small',()=>{
  const shy=tags('shy','path'),smile=tags('smile','path');
  assert.ok(shy.some(p=>p.d==='M-8 -1 H-3 M3 -1 H8'&&p.stroke===ink&&p['stroke-width']==='2'));
  const mouth=shy.find(p=>p.stroke===lip);
  assert.equal(mouth.fill,'none');
  for(const [x,y] of xy(mouth.d))assert.ok(x>0&&x<=5&&y>=8&&y<=11,'Off-centre shy mouth remains distinct without blush colour');
  assert.equal(smile.find(p=>p.stroke===lip).d,'M-4 8 Q0 10 4 8','Keep the original shallow 8-unit smile');
});

test('rouge is symmetric strong cheek colour, distinct from faint shy blush',()=>{
  const rouge=tags('rouge','ellipse').filter(p=>+p.cx!==0),shy=tags('shy','ellipse');
  assert.equal(rouge.length,2);assert.equal(shy.length,2);
  assert.equal(+rouge[0].cx,-(+rouge[1].cx));
  assert.equal(rouge[0].cy,rouge[1].cy);assert.equal(rouge[0].ry,rouge[1].ry);
  assert.ok(+rouge[0].opacity>=+shy[0].opacity+.2);
  assert.ok(+rouge[0].ry>+shy[0].ry,'Makeup has a broader cheek silhouette');
});

test('wet uses side patches rather than eye-origin tear lines',()=>{
  const patches=tags('wet','path').filter(p=>p.fill==='#8db1c5');
  assert.equal(patches.length,2);
  for(const p of patches){assert.match(p.d,/Z$/);for(const [x,y] of xy(p.d))assert.ok(Math.abs(x)>=9&&y>=-6.5&&y<=13,'Wet patch stays outside facial features');}
  assert.ok(+patches[0].opacity>+patches[1].opacity,'One main wet patch, one secondary patch');
});

test('white makeup has a visible pale patch boundary and no red cheek disks',()=>{
  const patch=tags('whitepaint','path').find(p=>p.fill==='#faf5e9');
  assert.ok(patch&&patch.stroke&&patch.stroke!=='none','Boundary distinguishes powder from simply pale skin');
  for(const [,y] of xy(patch.d))assert.ok(y>=-6.5,'Do not paint over fringe or brows');
  assert.equal(tags('whitepaint','ellipse').filter(p=>+p.cx!==0).length,0,'Do not reuse rouge cheeks');
  assert.notEqual(scope.figFace('whitepaint'),scope.figFace('pale'));
});
