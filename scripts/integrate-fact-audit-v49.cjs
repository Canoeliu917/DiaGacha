const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r/g,'');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const json=p=>JSON.parse(read(p));
let html=read('index.html');
const cardsRE=/var e=JSON\.parse\(`([\s\S]*?)`\)/;
const essaysRE=/const cardEssays\s*=\s*(\{[^\n]+\});/;
const cards=JSON.parse(html.match(cardsRE)[1]),essays=JSON.parse(html.match(essaysRE)[1]);
const byId=new Map(cards.map(c=>[c.id,c]));
const active=new Set(json('docs/ACTIVE_CARDS_V39.json').activeIds);
const audits=['PLAYS','ROLES','CRAFT','SPACES'].map(g=>json(`docs/FACT_AUDIT_${g}_V49.json`));
const covered=audits.flatMap(a=>a.reviews.map(r=>r.id));
assert.equal(covered.length,500);
assert.deepEqual([...new Set(covered)].sort(),[...active].sort());
const oldCopy=read('scripts/copy-overrides-v39.js').trim();
const oldHigh=read('scripts/high-star-copy-v40.js').trim();
const {copyOverridesV39,applyCopyOverridesV39}=require('./copy-overrides-v39.js');
for(const item of audits.flatMap(a=>a.corrections)){
  assert(active.has(item.id),item.id);
  const patch=copyOverridesV39[item.id]||={};
  for(const [key,value] of Object.entries(item.fields)){
    assert(['note','observe','stage','essay'].includes(key),key);
    assert.equal(typeof value,'string');
    patch[key]=value;
  }
}
const names=audits.flatMap(a=>a.nameCorrections||[]);
for(const item of names)byId.get(item.id).name=item.name;
applyCopyOverridesV39(cards.filter(c=>active.has(c.id)),essays);
const newCopy=oldCopy.replace(/const copyOverridesV39 = [\s\S]*?;\s*\n\s*function applyCopyOverridesV39/,()=>`const copyOverridesV39 = ${JSON.stringify(copyOverridesV39,null,2)};\n\nfunction applyCopyOverridesV39`);
write('scripts/copy-overrides-v39.js',newCopy+'\n');
execFileSync(process.execPath,['scripts/build-high-star-copy-v40.cjs'],{cwd:root,stdio:'inherit'});
for(const [before,after] of [[oldCopy,newCopy],[oldHigh,read('scripts/high-star-copy-v40.js').trim()]]){
  assert.equal(html.split(before).length,2,'Expected one inline source');
  html=html.replace(before,()=>after);
}
html=html.replace(cardsRE,()=>`var e=JSON.parse(\`${JSON.stringify(cards)}\`)`);
html=html.replace(essaysRE,()=>`const cardEssays = ${JSON.stringify(essays)};`);
write('index.html',html);
let manifest=read('docs/cards.json');
for(const item of names)manifest=manifest.replace(JSON.stringify(item.previousName),JSON.stringify(item.name));
write('docs/cards.json',manifest);
console.log(JSON.stringify({reviewed:covered.length,corrected:audits.reduce((n,a)=>n+a.corrections.length,0),names:names.length,scoresChanged:0}));
