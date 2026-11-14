const fs=require('node:fs'),path=require('node:path');
let harness=fs.readFileSync(path.join(__dirname,'check-balance.cjs'),'utf8').split('const originalOwned')[0];
harness=harness.replace('scoring:DiaScoring}', 'scoring:DiaScoring,Ct,productionScore,productionCuesV40,collisionDetailsV55,collisionPanelV55,balancedWeightsV53,originalBalancedWeightsV55,actualRatesV53,DiaRatesV40,Un,shortScene,dramaticTitleV40,dramaticTitleV55,nn,shareUrlV53,collisionDataV55}');
const loaded={exports:{}};
new Function('require','__dirname','module',harness+'\nmodule.exports={loadRuntime,randomFromSeed};')(require,__dirname,loaded);
module.exports=loaded.exports;
