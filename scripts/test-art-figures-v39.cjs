const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scope = vm.createContext({});
const paletteStart = html.indexOf('var L=', html.indexOf('function ft('));
vm.runInContext(html.slice(paletteStart, html.indexOf(';function mt', paletteStart) + 1), scope);
vm.runInContext(html.slice(html.indexOf('function figHead('), html.indexOf('function figProp(')), scope);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'art-figures-v39.js'), 'utf8'), scope);
const {figBodyV39: draw, FIGURE_FEATURES_V39: types, FIGURE_POSES_V39: poses, FIGURE_COSTUMES_V39: costumes} = scope;
const baseline = {cloth:'#39546c', skin:'fair', hair:'crop', face:'quiet', prop:'none', pose:'stand', costume:'plain'};
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const geometry = text => text.replace(/\sdata-[\w-]+="[^"]*"/g,'');
const outputs = [];
for (const type of Object.keys(types)) {
  for (const pose of poses) {
    for (const costume of costumes) {
      const body = draw({...baseline, fig:type, pose, costume});
      assert(!/undefined|NaN|Infinity/.test(body), `${type}/${pose}/${costume}: bad SVG value`);
      assert(body.includes(`data-figure-v39="${type}"`));
      outputs.push({name:`${type}-${pose}-${costume}`, body});
    }
  }
}
assert.equal(Object.keys(types).length, 21);
const monochrome = Object.keys(types).map(fig => draw({...baseline,fig}));
assert.equal(new Set(monochrome.map(geometry).map(hash)).size, 21, 'All 21 body geometries must differ with color, head, pose, prop held constant');
assert.equal(new Set(Object.values(types).map(t => [t.outline,t.neck,t.hem,t.sleeve].join('|'))).size, 21);
assert.equal(draw({...baseline,fig:'duanda',id:'a',n:1}), draw({...baseline,fig:'duanda',id:'b',n:998}), 'IDs/hashes must not create random art');
assert.notEqual(geometry(draw({...baseline,fig:'duanda',pose:'step'})), geometry(draw({...baseline,fig:'duanda',pose:'stand'})));
assert.notEqual(geometry(draw({...baseline,fig:'xizhuang',costume:'work'})), geometry(draw({...baseline,fig:'xizhuang',costume:'plain'})));
assert.notEqual(geometry(draw({...baseline,fig:'zuozi',pose:'fold'})),geometry(draw({...baseline,fig:'zuozi',pose:'hold'})));
assert.notEqual(draw({...baseline,fig:'goulou',head:'broken-crown'}),draw({...baseline,fig:'goulou',head:'white'}));
assert.notEqual(draw({...baseline,fig:'goulou',face:'blind'}),draw({...baseline,fig:'goulou',face:'tired'}));
outputs.push({name:'lear-broken-crown',body:draw({...baseline,fig:'goulou',head:'broken-crown',prop:'staff',costume:'worn'})});
outputs.push({name:'gloucester-blind',body:draw({...baseline,fig:'goulou',head:'white',face:'blind',prop:'cane',costume:'worn'})});
const propCases = [...fs.readFileSync(path.join(__dirname, 'art-figures-v39.js'), 'utf8').split('function figV39Object')[1].split('function figBodyV39')[0].matchAll(/case `([^`]+)`/g)].map(m => m[1]);
for (const prop of propCases) {
  const body = draw({...baseline,fig:'duanda',prop,pose:'hold'});
  assert(body.includes(`data-figure-prop="${prop}"`), `Missing prop ${prop}`);
  assert(!/undefined|NaN|Infinity/.test(body));
  outputs.push({name:`prop-${prop}`,body});
}
const outDir = path.join(root, '..', 'figure-check-v39');
fs.mkdirSync(outDir, {recursive:true});
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-90 -12 180 190">${body}</svg>`;
fs.writeFileSync(path.join(outDir,'all-figures.json'),JSON.stringify(outputs.map(x=>({...x,svg:svg(x.body)}))));
fs.writeFileSync(path.join(outDir,'features.json'),JSON.stringify(types,null,2));
const cells = Object.entries(types).map(([fig,feature],i)=>`<g transform="translate(${(i%7)*170+85} ${Math.floor(i/7)*208+12})">${draw({...baseline,fig,pose:feature.pose})}<text y="184" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#241c16">${feature.name} · ${fig}</text></g>`).join('');
fs.writeFileSync(path.join(outDir,'figures-v39.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="1190" height="624" viewBox="0 0 1190 624"><rect width="1190" height="624" fill="#f3efe6"/>${cells}</svg>`);
console.log(JSON.stringify({types:21, combinations:21*poses.length*costumes.length, props:propCases.length, fixtures:outputs.length, outDir}));
