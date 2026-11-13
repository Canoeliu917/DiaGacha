/* Regressions for the oversized grin: exercise the shared face renderer directly. */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ink='#211d18',mouth='#b5474a';
const scope=vm.createContext({L:ink,V:mouth,B:'#98413c',z:'#bb9653',pt:{fair:'#f1d2b7'}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'figure-head-v49.js'),'utf8'),scope);
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match=>[match[1],match[2]]));
const paths=face=>[...scope.figFace(face).matchAll(/<path\b[^>]*>/g)].map(match=>attrs(match[0]));
const points=d=>{
  const values=d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.equal(values.length%2,0,'These mouth/chin paths use explicit coordinate pairs');
  return values.reduce((all,value,i)=>i%2?all:[...all,[value,values[i+1]]],[]);
};
const bounds=d=>{
  const p=points(d),xs=p.map(p=>p[0]),ys=p.map(p=>p[1]);
  return {left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};
};

test('beard has a small separate mouth and chin hair, without a filled black grin',()=>{
  const shapes=paths('beard');
  const lip=shapes.find(p=>p.stroke===mouth),hair=shapes.filter(p=>p.fill===ink);
  assert.ok(lip,'The beard must not substitute for the mouth');
  assert.equal(lip.fill,'none');
  assert.equal(hair.length,1,'Keep one recognizable chin beard');
  const m=bounds(lip.d),b=bounds(hair[0].d);
  assert.ok(m.right-m.left<=8&&m.bottom-m.top<=2,'Mouth must remain closed and restrained');
  assert.ok(b.top>=12&&b.bottom<=23,'Black beard belongs below the mouth, at the chin');
  assert.ok(b.top-m.bottom>=3,'Visible skin separates mouth and beard');
  assert.ok(b.right-b.left>=8,'Do not remove the bearded identity');
});

test('smile and sly use short, shallow unfilled mouth curves',()=>{
  for(const face of ['smile','sly']){
    const lip=paths(face).find(p=>p.stroke===mouth);
    assert.ok(lip,face);
    assert.equal(lip.fill,'none',face);
    const b=bounds(lip.d);
    assert.ok(b.right-b.left<=8,`${face}: no wide grin`);
    assert.ok(b.top>=7&&b.bottom<=10,`${face}: shallow lower-face curve`);
    assert.ok(Number(lip['stroke-width'])<=1.8,`${face}: avoid a heavy mouth`);
    assert.equal(lip['stroke-linecap'],'round',`${face}: soft mouth ends`);
  }
});

test('all three adjusted faces retain the two original dot eyes',()=>{
  for(const face of ['beard','smile','sly']){
    const eyes=[...scope.figFace(face).matchAll(/<circle\b[^>]*>/g)].map(match=>attrs(match[0]));
    assert.deepEqual(eyes.map(e=>[Number(e.cx),Number(e.cy),Number(e.r),e.fill]),[
      [-6,-1,2.2,ink],[6,-1,2.2,ink]
    ],face);
  }
});

test('subtle smile, sly expression and beard stay distinct from neutral faces',()=>{
  const faces=['beard','smile','sly','quiet','cold','tired','scream','shy','storm','lips','pale','rouge','blood','whitepaint','resolve','wet'];
  assert.equal(new Set(faces.map(face=>scope.figFace(face))).size,faces.length);
  for(const face of ['beard','smile','sly']){
    const head=scope.figHead({head:'short',face,skin:'fair'},0,0,1,false);
    assert.ok(head.includes('<circle cx="0" cy="0" r="18"'),'Keep the circular face silhouette');
    assert.ok(head.includes(scope.figFace(face)),'Actual head uses the revised facial geometry');
  }
});
