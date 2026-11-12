const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'radar-v39.js'),'utf8');
const dimensions=['剧目','风格体系','导演手法','主演','配角','环境'];
const context=vm.createContext({T:card=>Math.round((card.atk+card.def)/2),copyDimension:value=>value,K:String});
vm.runInContext(source,context);
const cardsFor=scores=>scores.map((score,i)=>({id:`card-${i}`,name:`卡${i}`,dimension:dimensions[i],atk:score,def:score}));
const draw=scores=>context.hexRadar(cardsFor(scores));
const points=chart=>chart.match(/data-base-points="([^"]+)"/)[1].split(' ').map(pair=>pair.split(',').map(Number));
const lengths=chart=>points(chart).map(([x,y])=>Math.hypot(x-170,y-128));
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);

test('截图样例保持六个原分，常见分差的视觉距离放大两倍',()=>{
  const scores=[71,65,86,58,75,72],cards=cardsFor(scores),before=JSON.stringify(cards);
  const chart=context.hexRadar(cards),radii=lengths(chart);
  assert.deepEqual([...chart.matchAll(/data-final="(\d+)"/g)].map(match=>Number(match[1])),scores);
  assert.equal(JSON.stringify(cards),before);
  close(radii[2]-radii[3],92*(86-58)/100*2);
  assert.ok(radii[2]>92*.86,'较强角仍向外伸展');
  assert.ok(radii[3]<92*.58,'较弱角回收，避免形成近似正六边形');
  assert.match(chart,/形状放大分差，数字为原分/);
  assert.doesNotMatch(chart,/中心0分|中心 0|hex-scale/);
});

test('同分跨卡组半径一致，0至100严格单调，不作局内归一或随机变形',()=>{
  let previous=-1;
  for(let score=0;score<=100;score++){
    const first=lengths(draw([score,0,20,40,80,100]))[0];
    const second=lengths(draw([score,65,71,88,93,99]))[0];
    close(first,second);
    assert.ok(first>previous,`score ${score} must preserve order`);
    assert.ok(first<=92+1e-8);
    previous=first;
  }
  close(lengths(draw([0,50,90,100,50,90]))[0],0);
  close(lengths(draw([0,50,90,100,50,90]))[3],92);
  assert.equal(draw([58,65,71,75,86,72]),draw([58,65,71,75,86,72]));
});

test('同均分的不同分布保留不同形状，射线、圆点与导出底图使用同一组坐标',()=>{
  const varied=[58,65,71,75,86,77],uniform=[72,72,72,72,72,72];
  assert.equal(varied.reduce((a,b)=>a+b),uniform.reduce((a,b)=>a+b));
  assert.notEqual(draw(varied),draw(uniform));
  const chart=draw(varied),base=points(chart);
  const dots=[...chart.matchAll(/class="hex-dot" data-axis="\d+" cx="([^"]+)" cy="([^"]+)"/g)].map(match=>[Number(match[1]),Number(match[2])]);
  const rays=[...chart.matchAll(/class="hex-ray" data-axis="\d+" pathLength="1" x1="170" y1="128" x2="([^"]+)" y2="([^"]+)"/g)].map(match=>[Number(match[1]),Number(match[2])]);
  assert.deepEqual(dots,base);
  assert.deepEqual(rays,base);
  for(const indices of [[0,2,4],[1,3,5]]){
    const d='M'+indices.map(i=>base[i].map(value=>value.toFixed(2)).join(',')).join(' L')+' Z';
    assert.ok(chart.includes(`class="hex-star" d="${d}"`));
  }
});

test('旧五卡仍使用相同尺度并只显示实际五维',()=>{
  const chart=draw([0,50,70,90,100]),radii=lengths(chart);
  assert.equal(radii.length,5);
  [0,.15,.55,.95,1].forEach((fraction,i)=>close(radii[i],fraction*92));
  assert.equal((chart.match(/class="hex-corner"/g)||[]).length,5);
  assert.equal((chart.match(/class="hex-star"/g)||[]).length,1);
});
