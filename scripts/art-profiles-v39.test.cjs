/* Run after build-art-profiles-v39.py. Integration SVG checks live in audit-art-v39.cjs. */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const cards=read('docs/cards.json');
const profiles=read('docs/ART_PROFILES_V39.json').cards;
const sources=read('docs/ROLE_SOURCES_V39.json').cards;
const active=new Set(read('docs/ACTIVE_CARDS_V39.json').activeIds);
const byId=new Map(profiles.map(p=>[p.id,p]));
const sourceById=new Map(sources.map(p=>[p.id,p]));
assert.equal(profiles.length,777);
assert.equal(byId.size,777);
assert.equal(sources.length,260);
assert.equal(active.size,500);
const figs=new Set('lipao changqun duanda jiazhou doupeng xizhuang laozuo pizhe poyi dayi lifu zhifu changshan qipao magua gongzhuang baiyi jinpao tongqun zuozi goulou'.split(' '));
const pose=new Set('stand step reach raise guard hold fold bow'.split(' '));
const costumes=new Set('plain royal formal work worn mourning layered puritan'.split(' '));
for(const c of cards){
  const p=byId.get(c.id); assert(p,c.id); assert.equal(p.name,c.name); assert.equal(p.dimension,c.dimension);
  assert(p.basis&&p.review&&p.visualCues.length>=3,c.id+' needs provenance and visual reasoning');
  assert(p.semanticDistinctKey&&!p.semanticDistinctKey.includes(c.id),'Distinct keys must describe shapes, not IDs');
  assert(!('gen'in p)&&!('n'in p),'No legacy rotating/hashing fields');
  if(p.fig){
    assert(figs.has(p.fig)); assert(pose.has(p.pose)); assert(costumes.has(p.costume));
    assert.equal(p.head,p.hair); assert(p.prop);
    const source=sourceById.get(c.id);assert(source&&source.sourcePlayLabel);
    assert.equal(source.name,c.name);
    if(source.sourceKind==='generic')assert.equal(source.sourcePlayIds.length,0);
  }
  if(p.kind==='play'&&active.has(p.id)){
    assert(p.cast?.length>0,p.name+' needs a dramatic cast'); assert(p.staging);
    for(const member of p.cast){
      if(member.roleId){
        const role=byId.get(member.roleId);assert(role&&role.kind==='role');
        assert(sourceById.get(member.roleId).sourcePlayIds.includes(p.id),p.name+' borrowed an unrelated character '+member.name);
      }else{assert(member.name&&figs.has(member.fig)); assert(member.prop&&pose.has(member.pose));}
    }
  }
}
assert.equal(byId.get('play-peony').name,'萨勒姆的女巫');
assert.equal(byId.get('role-liniang').name,'普罗克托');
assert.equal(byId.get('xstyle-kunqu').name,'回顾式');
assert.deepEqual(sourceById.get('yrole-falstaff').sourcePlayIds,[]);
assert.match(sourceById.get('yrole-falstaff').sourcePlayLabel,/莎士比亚/);
assert.match(sourceById.get('v23-role-serge').sourcePlayLabel,/《艺术》/);
const used=new Set(profiles.filter(p=>p.fig).map(p=>p.fig));assert.equal(used.size,21);
console.log('v39 semantic profiles: 777 names, 260 role sources, 100 active play casts and 21 figure shapes validated');
