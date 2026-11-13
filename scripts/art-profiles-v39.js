/* Semantic paper-theatre compositions. Load art-profiles-v39.data.js first.
 * The renderer never chooses a shape from an ID, hash, rarity or array position.
 */
(function(root){
  'use strict';
  const ink='#29251f', paper='#eee1c7', red='#984d45', sage='#7c8870', blue='#6e8190';
  const line=(d,c=ink,w=3)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const shape=(d,c=paper)=>`<path d="${d}" fill="${c}" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/>`;
  const box=(x,y,w,h,c=paper)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${ink}" stroke-width="2.2"/>`;
  const circle=(x,y,r,c=paper)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${ink}" stroke-width="2"/>`;
  const move=(body,x=0,y=0,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;
  const arrow=(x,y,x2,y2)=>line(`M${x} ${y} L${x2} ${y2}`)+line(`M${x2-5} ${y2-6} L${x2} ${y2} L${x2+5} ${y2-6}`);
  let diagramFigure=null;
  const person=(pose='stand')=>{
    if(diagramFigure)return move(diagramFigure({fig:'duanda',dress:'doublet',head:'short',hair:'short',face:'quiet',skin:'fair',cloth:blue,prop:'none',pose,costume:'plain'}),0,-39,.47);
    throw new Error('The paper figure renderer is required for concept actors');
  };
  const raw={
    none:()=>'', person:()=>person(), guard:()=>person('reach'), hand:()=>shape('M-12 20 L-18 2 Q-21 -9 -16 -11 L-8 0 V-27 Q-3 -32 0 -26 V-8 L4 -30 Q10 -34 11 -25 L10 -7 L16 -24 Q22 -26 21 -17 L18 1 L25 -9 Q33 -11 29 -1 L20 22 Z'),
    eye:()=>shape('M-33 0 Q0 -28 33 0 Q0 28 -33 0 Z')+circle(0,0,10,ink),
    ear:()=>line('M-9 24 Q-24 8 -15 -14 Q-7 -33 12 -23 Q32 -15 18 2 Q5 9 6 20 Q1 32 -9 24 M-8 -9 Q6 -20 13 -6 L3 6'),
    heart:()=>shape('M0 25 C-51 -6 -23 -40 0 -16 C24 -40 51 -6 0 25 Z',red),
    speech:()=>shape('M-32 -20 H32 V13 H5 L-12 29 V13 H-32 Z')+line('M-22 -8 H22 M-22 2 H11'),
    silence:()=>raw.speech()+line('M-32 30 L32 -30',red,5),
    notes:()=>line('M-13 17 V-23 L23 -30 V10 M-13 -15 L23 -22',ink,4)+shape('M-13 12 C-35 5 -37 30 -17 28 Q-9 25 -13 12 Z',ink)+shape('M23 5 C1 -2 -1 23 19 21 Q27 18 23 5 Z',ink),
    mic:()=>box(-9,-30,18,33,ink)+line('M-17 -15 V0 Q0 20 17 0 V-15 M0 13 V34 M-16 34 H16'),
    speaker:()=>shape('M-25 -10 H-11 L9 -28 V28 L-11 10 H-25 Z',blue)+line('M18 -16 Q33 0 18 16 M27 -24 Q48 0 27 24'),
    wave:()=>line('M-40 0 Q-30 -20 -20 0 T0 0 T20 0 T40 0',blue,4),
    water:()=>line('M-42 -10 Q-28 -22 -14 -10 T14 -10 T42 -10 M-42 5 Q-28 -7 -14 5 T14 5 T42 5 M-42 20 Q-28 8 -14 20 T14 20 T42 20',blue,3),
    wind:()=>line('M-42 -13 H22 Q42 -13 31 -26 M-32 2 H40 M-36 17 H17 Q36 17 24 30',blue),
    bolt:()=>shape('M6 -36 L-21 4 H-2 L-10 36 L24 -10 H5 Z',red),
    moon:()=>shape('M16 -30 C-22 -31 -33 12 -3 29 Q16 38 31 16 Q-6 24 16 -30 Z',paper),
    star:()=>shape('M0 -31 L8 -9 L31 -9 L13 5 L20 29 L0 14 L-20 29 L-13 5 L-31 -9 L-8 -9 Z'),
    tree:()=>line('M0 32 V-18 M0 7 L-20 -8 M0 -5 L21 -26',ink,5)+circle(-18,-22,15,sage)+circle(8,-31,19,sage)+circle(23,-16,14,sage),
    branch:()=>line('M-30 25 L24 -28 M-7 3 L-24 -13 M7 -12 L31 -6',ink,4),
    plant:()=>line('M0 32 V-20',sage,4)+shape('M0 -6 Q-33 -30 -29 -4 Q-13 8 0 -6 Z',sage)+shape('M0 10 Q33 -15 29 12 Q13 23 0 10 Z',sage),
    grain:()=>line('M0 35 V-30',ink,3)+[-22,-8,6].map(y=>shape(`M0 ${y+10} Q-24 ${y-10} -15 ${y-17} Q1 ${y-12} 0 ${y+10} Z`,paper)+shape(`M0 ${y+10} Q24 ${y-10} 15 ${y-17} Q-1 ${y-12} 0 ${y+10} Z`,paper)).join(''),
    telescope:()=>shape('M-34 -19 L26 -33 L34 -5 L-26 9 Z',blue)+line('M0 0 V35 M0 7 L-22 36 M0 7 L23 36'),
    atom:()=>circle(0,0,5,red)+[0,60,120].map(r=>`<ellipse cx="0" cy="0" rx="37" ry="14" transform="rotate(${r})" fill="none" stroke="${blue}" stroke-width="2.6"/>`).join(''),
    globe:()=>circle(0,0,30,blue)+`<ellipse cx="0" cy="0" rx="12" ry="30" fill="none" stroke="${paper}" stroke-width="2.4"/>`+line('M-30 0 H30 M-24 -16 H24 M-24 16 H24',paper,2),
    map:()=>shape('M-36 -22 L-12 -30 L12 -20 L36 -29 V25 L12 33 L-12 23 L-36 31 Z')+line('M-12 -30 V23 M12 -20 V33 M-29 9 Q-13 -19 4 3 T28 -8',blue,2),
    footsteps:()=>raw.footprints(),
    footprints:()=>shape('M-21 -28 Q-34 -30 -31 -9 L-24 5 L-14 0 L-15 -18 Z',ink)+shape('M13 4 Q0 2 3 23 L10 37 L20 32 L19 14 Z',ink),
    arrow:()=>line('M-35 0 H33 M17 -15 L33 0 L17 15',red,5),
    route:()=>line('M-33 30 V-15 H5 V15 H33 V-30',blue,4)+shape('M24 -23 L33 -35 L42 -23 Z',blue),
    arc:()=>line('M-35 23 Q0 -39 35 23',red,4),
    repeat:()=>line('M-26 -10 Q-7 -40 22 -18 L30 -9 M17 -10 H31 V-25 M26 10 Q7 40 -22 18 L-30 9 M-17 10 H-31 V25',red,4),
    target:()=>circle(0,0,30)+circle(0,0,19)+circle(0,0,7,red),
    stop:()=>shape('M-13 -31 H13 L31 -13 V13 L13 31 H-13 L-31 13 V-13 Z',red)+line('M-18 0 H18',paper,6),
    question:()=>line('M-15 -20 Q-2 -40 16 -23 Q27 -9 7 3 L0 14',ink,5)+circle(0,29,3,ink),
    one:()=>line('M-12 -18 L2 -31 V31 M-12 31 H17',ink,5),
    thread:()=>line('M-37 -20 Q-8 29 9 -5 T38 24 M-37 20 Q-8 -29 9 5 T38 -24',red,3),
    scissors:()=>circle(-19,20,10)+circle(5,26,10)+line('M-12 12 L28 -30 M1 17 L-10 -33'),
    chair:()=>box(-21,-30,42,29)+line('M-22 -1 V34 M22 -1 V34 M-22 12 H22',ink,4),
    table:()=>shape('M-38 -5 H38 L31 9 H-31 Z')+line('M-28 9 V35 M28 9 V35',ink,4),
    bowl:()=>shape('M-35 -12 H35 Q30 26 0 28 Q-30 26 -35 -12 Z')+line('M-22 31 H22'),
    drum:()=>`<ellipse cx="0" cy="-15" rx="33" ry="12" fill="${paper}" stroke="${ink}" stroke-width="2"/>`+box(-33,-15,66,39,red)+`<ellipse cx="0" cy="-15" rx="33" ry="12" fill="${paper}" stroke="${ink}" stroke-width="2"/>`+line('M-23 -34 L20 -17 M24 -37 L-12 -17',ink,4),
    violin:()=>shape('M-14 -17 Q-33 -16 -27 2 Q-9 9 -23 16 Q-34 39 0 38 Q34 39 23 16 Q9 9 27 2 Q33 -16 14 -17 Z','#b57a54')+box(-5,-39,10,39,blue)+line('M0 -37 V29 M-34 -23 L34 33',ink,2),
    chop:()=>box(-24,-5,48,34,red)+box(-11,-24,22,19)+line('M-15 14 H15 M0 4 V24',paper,3),
    blade:()=>shape('M0 -36 L13 8 H-13 Z',blue)+line('M-21 11 H21 M0 11 V36',ink,5),
    mask:()=>shape('M-30 -27 Q0 -41 30 -27 V14 Q0 42 -30 14 Z')+line('M-20 -9 H-7 M7 -9 H20 M-13 12 Q0 24 13 12'),
    bed:()=>box(-38,-6,76,21)+box(-32,-16,23,10)+line('M-38 -26 V34 M38 -2 V34',ink,4),
    frame:()=>box(-39,-30,78,60)+box(-31,-22,62,44,'#f7f2e7'),
    whitecanvas:()=>box(-42,-33,84,66,'#dfc9a2')+box(-34,-25,68,50,'#fffdf5')+line('M-31 15 L30 5','#f0eee3',1),
    brokenglass:()=>shape('M-25 -27 L26 -27 L16 9 H-15 Z','none')+line('M-7 -27 L4 -8 L-6 2 L8 9 M0 10 V30 M-16 30 H16'),
    glass:()=>shape('M-27 -29 H27 L18 22 H-18 Z','#dfe7e0')+line('M-14 -17 L-19 12','#fff9e9',4),
    box:()=>shape('M-34 -20 L1 -32 L35 -19 V23 L0 35 L-34 22 Z')+line('M-34 -20 L0 -7 L35 -19 M0 -7 V35 M-17 -26 L17 -13'),
    chest:()=>box(-35,-13,70,42)+shape('M-35 -13 Q0 -45 35 -13 Z',paper)+box(-5,-5,10,16,red),
    bag:()=>shape('M-27 -10 H27 L34 30 H-34 Z')+line('M-16 -10 V-19 Q0 -38 16 -19 V-10'),
    basket:()=>shape('M-34 -5 H34 L25 31 H-25 Z')+line('M-25 -5 Q0 -43 25 -5 M-27 8 H27 M-24 20 H24 M-13 -5 L-10 31 M13 -5 L10 31'),
    bundle:()=>shape('M-25 -12 Q0 -42 25 -12 L32 26 Q0 39 -32 26 Z')+circle(0,-15,10)+line('M-24 -3 L20 23 M24 -3 L-20 23'),
    handkerchief:()=>shape('M-29 -27 L30 -22 L25 31 L-32 24 Z','#f5eede')+line('M-24 -19 L23 -15 L18 23 L-25 17',red,2)+circle(-10,-3,3,red)+circle(9,10,3,red),
    towel:()=>shape('M-32 -25 L-12 -16 L26 -25 L32 27 L-25 31 Z','#ece7d4')+line('M-20 20 H23 M-19 25 H23',blue,2),
    bulb:()=>circle(0,-8,24,'#ede3aa')+box(-9,14,18,14,blue)+line('M-8 22 H8 M-7 29 H7'),
    quill:()=>shape('M-22 29 Q-16 -26 29 -34 Q34 10 -22 29 Z')+line('M-27 36 L21 -25'),
    newspaper:()=>box(-35,-29,70,58)+box(-26,-19,21,20,blue)+line('M2 -19 H26 M2 -10 H26 M-26 10 H26 M-26 20 H26'),
    caption:()=>box(-43,-17,86,34,ink)+line('M-33 -6 H-6 M4 -6 H32 M-32 6 H16',paper,3),
    placard:()=>box(-38,-32,76,45)+line('M0 13 V40 M-27 -19 H24 M-27 -7 H15',ink,3),
    passport:()=>box(-24,-33,48,66,blue)+circle(0,-4,13,paper)+line('M-13 21 H13',paper,3),
    ticket:()=>shape('M-38 -18 H38 V-5 Q25 0 38 5 V18 H-38 V5 Q-25 0 -38 -5 Z')+line('M-8 -16 V16 M3 -8 H26 M3 6 H20',ink,2),
    telephone:()=>shape('M-26 -27 Q0 -43 26 -27 L33 -14 L18 -5 L8 -17 H-8 L-18 -5 L-33 -14 Z',ink)+box(-28,1,56,30)+circle(0,15,10),
    camera:()=>box(-37,-20,74,47,blue)+box(-21,-29,26,9)+circle(0,3,19)+circle(0,3,11,ink),
    gear:()=>shape('M-9 -35 H9 L13 -23 L24 -21 L34 -10 L25 0 L28 13 L15 27 L3 24 L-9 35 L-22 26 L-21 12 L-34 4 L-30 -13 L-17 -15 Z',blue)+circle(0,0,12,paper),
    hammer:()=>shape('M-25 -30 H21 V-10 H-25 Z',blue)+shape('M-5 -10 H7 L12 35 H-10 Z'),
    helmet:()=>shape('M-32 7 Q-30 -33 0 -33 Q30 -33 32 7 Z',blue)+line('M-36 9 H36 M0 -33 V7'),
    plane:()=>shape('M-7 -34 H7 L10 -9 L37 11 L37 18 L9 8 L6 29 L18 34 V39 L0 34 L-18 39 V34 L-6 29 L-9 8 L-37 18 V11 L-10 -9 Z',blue),
    wheel:()=>circle(0,0,31)+circle(0,0,7,ink)+line('M0 -30 V30 M-30 0 H30 M-21 -21 L21 21 M21 -21 L-21 21'),
    ladder:()=>line('M-19 -35 V35 M19 -35 V35 M-19 -23 H19 M-19 -8 H19 M-19 8 H19 M-19 24 H19',ink,4),
    stairs:()=>line('M-37 29 H-17 V9 H3 V-11 H23 V-31 H39',ink,5),
    fence:()=>line('M-32 -31 V31 M-16 -31 V31 M0 -31 V31 M16 -31 V31 M32 -31 V31 M-37 -12 H37 M-37 15 H37',ink,3),
    wall:()=>box(-39,-30,78,60)+line('M-39 -10 H39 M-39 10 H39 M-13 -30 V-10 M13 -10 V10 M-13 10 V30'),
    coat:()=>shape('M-16 -30 L-36 -10 L-24 8 L-14 -2 L-20 32 H20 L14 -2 L24 8 L36 -10 L16 -30 L0 -18 Z',blue),
    curtain:()=>shape('M-40 -34 H-5 Q-9 5 -33 17 L-36 34 H-40 Z',red)+shape('M40 -34 H5 Q9 5 33 17 L36 34 H40 Z',red)+line('M-44 -34 H44'),
    cross:()=>shape('M-8 -32 H8 V-9 H31 V8 H8 V32 H-8 V8 H-31 V-9 H-8 Z',red),
    tablet:()=>shape('M-21 31 V-18 Q0 -42 21 -18 V31 Z')+line('M-9 -9 H9 M0 -19 V16'),
    wedding:()=>circle(-10,0,23,paper)+circle(15,0,23,'none')+line('M-16 -25 L-10 -36 L-4 -25',red),
    chain:()=>[-24,0,24].map(x=>`<ellipse cx="${x}" cy="0" rx="18" ry="11" fill="none" stroke="${ink}" stroke-width="5"/>`).join(''),
    rope:()=>line('M-33 -32 Q-44 0 -12 0 H16 Q38 0 27 22 Q19 36 4 23 Q-11 8 6 1 M-33 -32 L-24 -23',paper,7)+line('M-33 -32 Q-44 0 -12 0 H16 Q38 0 27 22 Q19 36 4 23 Q-11 8 6 1',ink,2),
    snake:()=>line('M-26 25 C32 35 -25 -3 15 -9 Q40 -15 18 -30',sage,8)+circle(19,-28,5,sage),
    horse:()=>shape('M-29 17 L-24 -11 L-5 -19 L8 -35 L28 -29 L38 -9 L20 -5 L13 11 L8 34 H-1 L-4 12 H-17 L-22 34 H-32 Z',blue)+circle(22,-22,2,ink),
    dog:()=>shape('M-28 4 L-11 -1 L12 0 L17 -20 L31 -11 L37 1 L21 9 L18 30 H8 L6 12 H-13 L-17 30 H-27 Z',sage)+line('M-28 6 L-39 -6'),
    kite:()=>shape('M0 -34 L24 0 L0 26 L-24 0 Z',red)+line('M0 -34 V26 M-24 0 H24 M0 26 Q23 38 4 47'),
    puppet:()=>circle(0,-15,10)+shape('M-10 -2 H10 L16 23 H-16 Z',red)+line('M-8 22 L-20 37 M8 22 L20 37 M-10 4 L-27 13 M10 4 L27 13 M0 -25 V-43 M-27 13 V-43 M27 13 V-43 M-31 -43 H31'),
    rednose:()=>circle(0,0,29)+circle(-9,-6,3,ink)+circle(9,-6,3,ink)+circle(0,5,9,red)+line('M-12 17 Q0 30 12 17'),
    tear:()=>shape('M0 -33 Q42 17 12 32 Q-19 42 -24 16 Q-26 4 0 -33 Z',blue),
    shadow:()=>`<g transform="skewX(-24) scale(1 .72)">${person()}</g>`,
    audience:()=>[-26,0,26].map(x=>move(person(),x,7,.5)).join(''),
    objects:()=>move(raw.cup?raw.cup():raw.box(),-17,9,.6)+move(raw.chair(),20,-3,.7),
    chalk:()=>shape('M-30 22 L22 -29 L31 -20 L-21 31 Z','#f4efe0'),
    guillotine:()=>line('M-26 -37 V38 M26 -37 V38 M-26 -37 H26 M-36 38 H36',ink,5)+shape('M-23 -30 H23 V-7 L-23 9 Z',blue)+box(-31,21,62,12),
    torch:()=>line('M-4 4 L3 38',ink,8)+shape('M-9 7 Q-34 -8 -6 -38 Q-11 -8 7 -19 Q34 7 -9 7 Z',red),
    crutch:()=>line('M-23 -32 H23 M-14 -32 L0 3 L14 -32 M0 3 V37 M-8 37 H8',ink,5),
    bloodfan:()=>raw.fan?raw.fan()+circle(11,0,8,red):shape('M0 29 L-38 -15 Q0 -45 38 -15 Z')+circle(11,0,8,red),
    sword:()=>shape('M0 -40 L8 -24 L3 13 H-3 L-8 -24 Z','#e6e9de')+line('M-15 13 H15 M0 13 V36',ink,5),
    dirt:()=>shape('M-34 21 L-19 2 L-3 10 L10 -12 L35 23 Z','#947554'),
    pistol:()=>shape('M-35 -13 H34 V1 H-6 L-4 29 H-24 L-26 4 H-35 Z',blue),
    house:()=>shape('M-36 -2 L0 -35 L36 -2 V32 H-36 Z')+box(-10,7,20,25,blue),
    door:()=>box(-24,-36,48,72)+shape('M-19 -31 L14 -23 V29 L-19 33 Z',blue)+circle(8,4,2,paper),
    hat:()=>shape('M-25 9 Q-25 -28 0 -28 Q25 -28 25 9 Z',ink)+shape('M-38 6 Q0 18 38 6 L36 15 Q0 27 -36 15 Z',ink),
    car:()=>shape('M-38 9 L-31 -13 H-16 L-6 -27 H18 L30 -9 L39 -3 V18 H-38 Z',blue)+circle(-23,19,9,ink)+circle(25,19,9,ink),
    train:()=>box(-35,-28,70,49,blue)+box(-27,-20,23,18,paper)+box(6,-20,23,18,paper)+circle(-21,24,9,ink)+circle(21,24,9,ink),
    ship:()=>shape('M-40 12 H40 L23 33 H-23 Z',blue)+line('M0 -37 V12')+shape('M5 -32 L34 4 H5 Z')+raw.water(),
    smoke:()=>line('M-22 32 Q-40 6 -18 -6 T-2 -34 M13 34 Q-4 10 17 -6 T25 -36','#aaa58f',8),
    ghost:()=>shape('M-25 31 V-12 Q-23 -38 0 -38 Q23 -38 25 -12 V31 L12 21 L0 31 L-12 21 Z','#f2ecd9')+circle(-8,-9,3,ink)+circle(8,-9,3,ink),
    mound:()=>shape('M-42 30 Q-30 -20 0 -14 Q30 -18 42 30 Z','#ad9576'),
  };
  const old=new Set('key letter book lamp cup teapot fan coin mask clock column sun bird suitcase axe dagger crown cane skull wagon scales flower tomb bundle pistol flame rhino staff jug glasses noose tower gate duck screen unicorn apple tape trash bottle scroll stool bell laurel boot rickshaw tray bowler blood snow hand cauldron window bun mirror applebow'.split(' '));
  const architecture=new Set('battlement balcony barracks cellar city classroom cliff courtyard crossroad field forest garden gate gallery inn island kitchen lake orchard palace road ruin shop stage station storm study tent bridge'.split(' '));
  function symbol(name,glyph){
    if(raw[name])return raw[name]();
    if(old.has(name)&&typeof glyph==='function')return glyph(name);
    if(architecture.has(name))return move(scene(name),0,-10,.32);
    if(name==='glass')return raw.glass();
    if(name==='cabin')return raw.house();
    throw new Error('Unknown semantic art symbol: '+name);
  }

  const sceneFloor=()=>line('M-117 148 H119',ink,3);
  function room(windows=1){return box(-111,26,222,122,'#e8dcc4')+Array.from({length:windows},(_,i)=>box(-76+i*70,44,48,49,'#f7f0dc')+line(`M${-52+i*70} 44 V93 M${-76+i*70} 67 H${-28+i*70}`)).join('')+line('M-111 148 L-89 130 H89 L111 148',ink,2);}
  function building(type){
    const details={
      room:()=>room(), hotel:()=>room(2)+move(raw.bed(),45,117,.7),
      chairs:()=>[-75,-25,25,75].map((x,i)=>move(raw.chair(),x,113-i%2*25,.9)).join(''),
      bench:()=>box(-86,78,172,25)+box(-86,112,172,12)+line('M-70 80 V147 M70 80 V147',ink,5),
      threewindows:()=>room(3), nightwindow:()=>room(2)+move(raw.moon(),54,65,.55)+move(raw.sun?raw.sun():raw.star(),-54,65,.45),
      clockroom:()=>room(2)+line('M-111 26 L111 40 M-111 40 L111 26',ink,1),
      duelroom:()=>room()+move(raw.chair(),-67,116,.6)+move(raw.chair(),67,116,.6),
      consumerroom:()=>room()+move(raw.box(),-65,116,.6),
      vault:()=>box(-104,35,208,112,'#e4d4b8')+box(-81,50,162,94,blue)+circle(0,96,26,paper)+line('M0 70 V122 M-26 96 H26'),
      door:()=>box(-78,28,156,119)+move(raw.door(),0,94,1.5),
      doors:()=>[-74,0,74].map(x=>move(raw.door(),x,93,1.5)).join(''),
      inn:()=>room(2)+move(raw.key?raw.key():raw.door(),0,118,.55),
      shop:()=>shape('M-110 45 H110 L91 77 H-91 Z',red)+box(-90,77,180,68)+line('M-110 45 L-75 77 M-55 45 L-37 77 M0 45 V77 M55 45 L37 77 M110 45 L75 77'),
      market:()=>[-65,65].map(x=>move(building('shop'),x,49,.5)).join(''),
      teahouse:()=>building('shop')+move(raw.table(),-38,121,.75)+move(raw.chair(),53,116,.65),
      cafe:()=>room(2)+move(raw.table(),0,122,1), bar:()=>room(2)+box(-92,105,184,39,'#ad8b63'),
      study:()=>room()+box(28,41,66,84,blue)+line('M28 63 H94 M28 85 H94 M28 107 H94')+move(raw.table(),-37,123,.85),
      archive:()=>box(-108,29,216,116)+[-70,0,70].map(x=>box(x-26,43,52,95,blue)+line(`M${x-26} 66 H${x+26} M${x-26} 90 H${x+26} M${x-26} 114 H${x+26}`,paper,2)).join(''),
      office:()=>room()+move(raw.table(),0,120,1.3),
      classroom:()=>room()+box(-70,39,140,41,sage)+[-70,0,70].map(x=>move(raw.table(),x,122,.55)).join(''),
      kitchen:()=>room()+box(-97,100,194,44)+circle(-60,103,17,ink)+circle(-16,103,17,ink)+box(27,94,52,17,blue),
      dining:()=>room(2)+move(raw.table(),0,120,1.9), ballroom:()=>room(3)+line('M-108 145 L-54 105 L0 145 L54 105 L108 145',blue),
      hospital:()=>room()+move(raw.bed(),-16,123,1.6)+move(raw.cross(),72,56,.5),
      bathhouse:()=>room(2)+line('M-64 40 V67 Q-44 67 -44 86 M36 40 V67 Q56 67 56 86',blue,4)+move(raw.water(),0,128,1.8),
      attic:()=>shape('M-115 72 L0 18 L115 72 V147 H-115 Z')+box(-25,50,50,36,blue)+line('M-109 77 L0 28 L109 77'),
      cellar:()=>box(-112,28,224,120,'#b3a28b')+box(-35,28,70,25,paper)+move(raw.stairs(),-79,101,1),
      courtyard:()=>box(-110,45,73,100)+box(37,45,73,100)+box(-37,24,74,75)+shape('M-119 45 L-74 18 L-30 45 M30 45 L74 18 L119 45')+line('M-37 147 H37'),
      balcony:()=>box(-66,25,132,72,blue)+box(-91,93,182,53)+[-70,-35,0,35,70].map(x=>line(`M${x} 97 V143`)).join(''),
      battlement:()=>shape('M-116 146 V58 H-96 V36 H-76 V58 H-56 V36 H-36 V58 H36 V36 H56 V58 H76 V36 H96 V58 H116 V146 Z','#aaa58f')+shape('M-22 146 V103 Q0 72 22 103 V146 Z',ink),
      gate:()=>box(-105,38,210,108)+shape('M-48 146 V89 Q0 28 48 89 V146 Z',ink)+line('M-112 38 H112',red,6),
      palace:()=>[-84,-28,28,84].map(x=>box(x-9,55,18,87)).join('')+shape('M-114 54 L0 15 L114 54 Z')+box(-118,139,236,11),
      temple:()=>building('palace')+box(-26,104,52,32,red),
      court:()=>box(-107,37,214,110)+box(-91,78,182,28,blue)+line('M-83 106 V145 M-45 106 V145 M-7 106 V145 M31 106 V145 M69 106 V145'),
      jury:()=>building('court')+[-70,-42,-14,14,42,70].map(x=>circle(x,61,7,ink)).join(''),
      assembly:()=>shape('M-111 65 Q0 8 111 65 L86 145 H-86 Z')+line('M-96 90 Q0 43 96 90 M-88 117 Q0 75 88 117',blue,5),
      prison:()=>box(-101,27,202,120,'#b1a38e')+[-70,-35,0,35,70].map(x=>line(`M${x} 29 V145`,ink,7)).join(''),
      scaffold:()=>line('M-84 146 V28 H66 M56 28 V67',ink,8)+box(-107,137,214,13),
      tent:()=>shape('M-115 146 L0 20 L115 146 Z',sage)+shape('M-26 146 L0 58 L26 146 Z',ink)+line('M0 20 V146'),
      shelter:()=>building('tent')+move(raw.bundle(),-58,127,.5), barracks:()=>room(2)+move(raw.bed(),-53,121,.8)+move(raw.bed(),53,121,.8),
      factory:()=>shape('M-115 146 V73 L-45 37 V73 L24 37 V73 L93 37 V146 Z',blue)+box(72,7,19,51,ink)+line('M-94 99 H72 M-94 121 H72',paper,7),
      counter:()=>room()+box(-71,49,142,57,ink)+box(-88,109,176,34),
      gallery:()=>room(2)+move(raw.whitecanvas(),0,87,1.2),
      train:()=>box(-119,40,238,105,blue)+[-80,0,80].map(x=>box(x-29,51,58,51,paper)).join('')+line('M-112 119 H112',ink,6),
      station:()=>line('M-118 146 H118 M-91 146 V38 M91 146 V38',ink,5)+shape('M-117 38 L-94 19 H94 L117 38 Z',blue)+box(-52,51,104,31),
      checkpoint:()=>building('gate')+line('M-101 109 H102',red,8)+line('M-72 103 L-59 115 M-33 103 L-20 115 M6 103 L19 115 M45 103 L58 115',paper,4),
      rooftop:()=>shape('M-115 146 V81 L-42 28 L31 81 H115 V146 Z',blue)+line('M-110 79 H32'),
      stable:()=>building('attic')+box(-70,89,140,58,blue)+line('M-70 89 L70 147 M70 89 L-70 147',paper,3),
      greenhouse:()=>shape('M-106 146 V65 L0 20 L106 65 V146 Z','#d6e0d1')+line('M0 20 V146 M-53 44 V146 M53 44 V146 M-106 65 H106 M-106 105 H106'),
      observatory:()=>shape('M-105 146 V82 Q-94 12 0 12 Q94 12 105 82 V146 Z',blue)+line('M0 14 V83 H104 M-104 83 H-15',paper,3),
      tower:()=>shape('M-42 146 L-29 39 H29 L42 146 Z')+box(-40,22,80,29,blue)+line('M-40 22 L0 4 L40 22 M-25 52 H25'),
      cliff:()=>shape('M-113 144 L-98 53 L-15 53 L-7 91 L31 96 L42 147 Z','#a1917c')+line('M-98 53 H-5 M-37 75 L-51 132'),
      ruin:()=>shape('M-110 146 V61 L-85 41 L-63 61 V89 L-37 75 V146 Z','#b4a58a')+shape('M20 146 V97 L41 83 V42 H73 V69 L104 49 V146 Z','#b4a58a'),
      tomb:()=>[-65,13,73].map((x,i)=>move(raw.tablet(),x,110-i*13,.8)).join('')+line('M-112 146 H112'),
      altar:()=>box(-94,98,188,49)+box(-107,85,214,15)+move(raw.torch(),0,65,.8),
      well:()=>line('M-60 146 V42 H60 V146',ink,5)+shape('M-76 43 L0 12 L76 43 Z',red)+box(-67,108,134,39)+line('M0 42 V114'),
      dock:()=>line('M-116 118 H36 M-98 118 V147 M-40 118 V147',ink,7)+move(raw.ship(),71,108,.8)+move(raw.water(),0,149,2),
      ship:()=>move(raw.ship(),0,94,2.3), bridge:()=>shape('M-116 138 Q0 11 116 138 L98 146 Q0 51 -98 146 Z')+move(raw.water(),0,146,2),
      island:()=>shape('M-113 132 Q-64 81 9 110 Q77 80 114 135 Z',sage)+move(raw.water(),0,146,2.4)+move(raw.tree(),-57,78,.8),
      lake:()=>move(raw.water(),0,129,2.6)+move(raw.branch(),-88,65,.9),
      pool:()=>`<ellipse cx="0" cy="110" rx="111" ry="37" fill="${blue}" stroke="${ink}" stroke-width="3"/>`+`<ellipse cx="0" cy="110" rx="84" ry="23" fill="none" stroke="${paper}" stroke-width="2"/>`,
      forest:()=>[-76,0,76].map((x,i)=>move(raw.tree(),x,85-i*9,1.6)).join(''), orchard:()=>building('forest')+[-77,0,77].map(x=>circle(x,42,5,red)).join(''),
      garden:()=>line('M-109 146 H109 M-88 146 V55 Q0 -4 88 55 V146',sage,7)+move(raw.plant(),-71,119,.9)+move(raw.plant(),71,119,.9),
      field:()=>[-75,-25,25,75].map(x=>move(raw.grain(),x,106,1.1)).join(''), vineyard:()=>building('field'),
      village:()=>move(raw.house(),-60,108,1.3)+move(raw.house(),61,96,1.5)+line('M-117 148 H117'),
      farm:()=>building('village')+move(raw.grain(),0,124,.6),
      tree:()=>line('M-114 146 Q0 128 114 146')+line('M29 142 L22 39 M24 79 L-3 47 M24 65 L52 23',ink,5),
      road:()=>shape('M-102 148 L-12 28 H12 L102 148 Z','#c6b89c'),
      crossroad:()=>shape('M-95 146 L-35 97 L-111 47 L-88 24 L0 82 L88 24 L111 47 L35 97 L95 146 Z','#cab99a'),
      street:()=>building('road')+box(-109,40,48,95,blue)+box(61,57,48,78,red),
      city:()=>[-91,-42,10,65].map((x,i)=>box(x,28+i*12,44,117-i*12,blue)+box(x+10,44+i*12,12,16,paper)).join(''),
      herd:()=>building('street'), zoo:()=>building('garden')+line('M-90 62 V142 M-45 46 V142 M0 41 V142 M45 46 V142 M90 62 V142',ink,4),
      storm:()=>line('M-109 145 H109')+move(raw.wind(),0,51,2.4)+move(raw.bolt(),70,102,1.1),
      snowfield:()=>line('M-118 139 Q0 100 118 139',blue)+[-74,-24,36,84].map(x=>circle(x,44,4,paper)).join(''),
      sky:()=>move(raw.moon(),70,62,1)+[-73,-19,25].map(x=>move(raw.star(),x,55,.4)).join(''),
      mountain:()=>shape('M-116 146 L-52 26 L-6 105 L45 14 L116 146 Z',sage),
      cave:()=>shape('M-117 148 Q-112 28 0 25 Q112 28 117 148 Z','#a08e76')+shape('M-70 148 Q-61 66 0 67 Q61 66 70 148 Z',ink),
      mound:()=>move(raw.mound(),0,106,2.7), yard:()=>line('M-114 146 H114')+line('M-108 42 V146 M-78 42 V146 M-48 42 V146 M-108 67 H-28',ink,3),
      mine:()=>building('cave')+line('M-43 146 V72 H43 V146',paper,7),
      maze:()=>line('M-107 146 V30 H107 V145 H-75 V62 H76 V112 H-43 V90 H35',ink,8),
      circus:()=>shape('M-119 145 L-85 74 L0 21 L85 74 L119 145 Z',red)+shape('M-34 145 L0 74 L34 145 Z',paper)+line('M0 21 V0 L30 9 H0'),
    };
    return details[type]?details[type]():null;
  }
  function scene(type){
    const built=building(type); if(built!==null)return built;
    const p=(x,y=103,s=1,pose)=>move(person(pose),x,y,s);
    const stage=()=>line('M-114 143 H114 M-108 150 H108',ink,4);
    const two=()=>p(-62)+p(62);
    const ring=()=>`<ellipse cx="0" cy="106" rx="99" ry="35" fill="none" stroke="${ink}" stroke-width="3"/>`;
    switch(type){
      case 'portrait':return '';
      case 'triangle':return shape('M-93 137 L0 24 L93 137 Z','none')+circle(0,25,10,red)+circle(-92,137,10,blue)+circle(92,137,10,sage);
      case 'target':return move(raw.target(),0,87,1.9)+move(raw.arrow(),-76,112,.9);
      case 'stage':return stage()+box(-92,30,184,7,ink);
      case 'radiate':return Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return line(`M${Math.cos(a)*34} ${89+Math.sin(a)*34} L${Math.cos(a)*104} ${89+Math.sin(a)*56}`,red,3)}).join('');
      case 'loop':return ring()+move(raw.repeat(),0,98,1.8);
      case 'duet':return two()+line('M-27 91 H27',red,3)+stage();
      case 'distort':return shape('M-108 37 L85 22 L111 146 L-91 128 Z','none')+`<g transform="translate(7 91) skewX(20)">${person()}</g>`;
      case 'mist':return move(raw.smoke(),-58,96,1.7)+move(raw.smoke(),59,83,1.7);
      case 'split':return box(-111,31,105,114,'#dfd3bd')+box(6,31,105,114,'#d4ddd4')+line('M0 23 V152',ink,3);
      case 'frame':return box(-109,30,218,115)+box(-100,39,200,97,'#f4eee2');
      case 'chorus':return [-86,-43,0,43,86].map((x,i)=>p(x,i%2?101:113,.75)).join('')+stage();
      case 'timeline':return line('M-110 121 H110',ink,3)+[-85,-28,28,85].map(x=>box(x-20,48,40,51)+line(`M${x} 99 V130`)).join('');
      case 'reverse':return scene('timeline')+move(raw.arrow(),0,33,1.3).replace('scale(1.3)','scale(-1.3 1.3)');
      case 'sound':return box(-108,38,216,104,'#e0daca')+move(raw.wave(),0,94,2.2);
      case 'dance':return p(-47,102,1.2,'reach')+`<g transform="translate(54 93) rotate(-15) scale(1.15)">${person('reach')}</g>`+line('M-101 147 Q0 126 101 147',blue,3);
      case 'circle':return ring()+[-72,0,72].map((x,i)=>p(x,i===1?62:118,.65)).join('');
      case 'cluster':return box(-108,40,71,51)+box(37,33,72,54)+p(0,108,1.1)+line('M-100 146 L-48 100 M100 146 L48 100',blue);
      case 'nested':return box(-112,30,224,115)+box(-77,50,154,94,red)+box(-48,71,96,73,paper)+p(0,109,.7);
      case 'shadow':return shape('M-88 33 H67 L116 145 H-118 Z','#d1d0bc')+`<g transform="translate(0 99) skewX(-24)">${person()}</g>`;
      case 'speech':return p(-72,109)+move(raw.speech(),41,69,1.45)+stage();
      case 'gesture':return p(0,108,1.35,'reach')+line('M-71 71 Q0 17 71 71',red,3);
      case 'audience':return p(0,76,.9,'reach')+[-88,-44,0,44,88].map(x=>p(x,136,.48)).join('')+line('M-110 111 H110',red,2);
      case 'site':return move(raw.map(),0,90,2.5)+circle(22,96,13,red);
      case 'route':return line('M-106 133 H-48 V58 H27 V115 H104',blue,7)+move(raw.arrow(),88,115,.65);
      case 'crack':return box(-108,34,216,112)+line('M12 34 L-17 73 L19 92 L-18 146',red,7);
      case 'fork':return line('M0 147 V95 L-87 39 M0 95 L87 39',ink,5)+move(raw.question(),0,57,.65);
      case 'lab':return box(-108,31,216,115)+move(raw.atom(),0,84,1.7)+stage();
      case 'puppet':return move(raw.puppet(),0,95,1.6)+p(-86,114,.7)+p(86,114,.7);
      case 'arc':return line('M-109 139 Q0 -50 109 139',red,4)+p(-87,125,.6)+p(86,125,.8,'reach');
      case 'focus':return shape('M-20 22 H20 L90 146 H-90 Z','#e3d59b')+p(0,108,1.2);
      case 'network':return [-84,0,84].map(x=>p(x,102,.78)).join('')+line('M-84 45 H84 M-84 45 V67 M0 45 V67 M84 45 V67',red,3);
      case 'wagon':return box(-95,64,190,63)+circle(-62,137,14,ink)+circle(62,137,14,ink);
      case 'procession':return [-80,-27,27,80].map(x=>p(x,108,.75)).join('')+move(raw.arrow(),0,143,1.2);
      case 'objects':return move(raw.table(),0,126,2.5)+box(-89,29,178,6,ink);
      case 'freeze':return p(0,102,1.25,'reach')+line('M-86 46 V135 M86 46 V135',red,5);
      case 'exchange':return two()+line('M-39 58 H39 M25 47 L39 58 L25 69 M39 137 H-39 M-25 126 L-39 137 L-25 148',red,3);
      case 'balance':return line('M-112 116 H112 M-98 116 V148 M98 116 V148',ink,5)+p(0,76,.8,'reach');
      case 'glasswall':return p(-64)+p(64)+box(-9,25,18,127,'#c8d9d0')+line('M-7 38 L7 53 M-7 60 L7 75 M-7 82 L7 97','#f6f4e7',2);
      case 'move':return p(-86,105,.8,'reach')+move(raw.chair(),0,110,1.1)+move(raw.arrow(),64,108,.7);
      case 'transform':return p(0,109,1.15)+move(raw.mask(), -72,52,.9)+line('M-70 78 Q0 118 70 78',red,3);
      case 'blackout':return box(-110,30,220,115,ink)+line('M-108 145 L108 32',red,4);
      case 'slow':return p(-66,110,.85)+p(0,110,.85)+p(66,110,.85)+line('M-107 147 H107',blue,2);
      case 'revolve':return ring()+p(0,92,.9)+move(raw.repeat(),78,116,.7);
      case 'followlight':return shape('M-106 26 L-76 26 L81 145 H-26 Z','#e5d597')+p(42,108,1.1)+move(raw.arrow(),0,146,.9);
      case 'toplight':return shape('M-20 22 H20 L71 148 H-71 Z','#e5d597')+p(0,106,1.1);
      case 'sidelight':return shape('M-117 49 V78 L85 148 V30 Z','#e5d597')+p(23,107,1.1);
      case 'backlight':return circle(0,75,54,'#e5d597')+`<g transform="translate(0 106)">${person()}</g>`;
      case 'footlight':return shape('M-110 25 H110 L20 148 H-20 Z','#e5d597')+p(0,103,1.05);
      case 'frontlight':return shape('M-115 145 L-37 29 H37 L115 145 Z','#e5d597')+p(0,103,1.05)+line('M-55 148 H55',red,6);
      case 'mirror':return p(-60)+`<g transform="translate(60 103) scale(-1 1)">${person()}</g>`+line('M0 27 V149',blue,3);
      case 'back':return p(0,108,1.2)+circle(0,79,12,ink)+line('M-12 96 H12',paper,2);
      case 'low':return move(raw.chair(),0,118,1.1)+p(0,118,.75)+line('M-92 60 H92',blue,2);
      case 'tilt':return `<g transform="translate(3 105) rotate(52)">${person()}</g>`+stage();
      case 'roll':return `<g transform="translate(0 117) rotate(112)">${person()}</g>`+move(raw.arc(),0,55,1.4)+stage();
      case 'scrim':return p(0,106,1.1)+box(-103,29,206,117,'none')+Array.from({length:14},(_,i)=>line(`M${-102+i*16} 30 V146`,sage,1.5)).join('');
      case 'lift':return box(-78,31,156,97)+line('M-90 25 V147 M90 25 V147 M-78 128 H78',ink,4)+arrow(-105,143,-105,55)+arrow(105,55,105,143);
      case 'fourbeats':return [-90,-30,30,90].map((x,i)=>circle(x,96,19,i%2?blue:paper)+line(`M${x} 116 V146`)).join('');
      case 'accelerate':return [-105,-44,-1,29,50,65,76,84].map(x=>line(`M${x} 51 V132`,ink,3)).join('')+move(raw.arrow(),0,144,1.8);
      case 'curtain':return move(raw.curtain(),0,91,2.5)+stage();
      case 'layered':return box(-106,32,178,93,'#e6d6ba')+box(-72,54,178,93,'#cbd7cf')+line('M-91 37 L91 142',red,2);
      case 'rain':return Array.from({length:12},(_,i)=>line(`M${-110+i*20} 31 L${-121+i*20} 139`,blue,2)).join('')+stage();
      case 'wings':return move(raw.curtain(),0,86,2.2)+line('M-113 145 H113 M-72 40 V145 M72 40 V145',ink,3);
      case 'blackbox':return box(-110,27,220,120,ink)+box(-89,45,178,82,'#69675d')+[-75,-37,0,37,75].map(x=>box(x-12,135,24,12,paper)).join('');
      case 'proscenium':return box(-111,24,222,124)+box(-92,40,184,105,ink)+move(raw.curtain(),0,88,2.1);
      case 'globe':return ` <ellipse cx="0" cy="99" rx="113" ry="49" fill="${paper}" stroke="${ink}" stroke-width="3"/>`+`<ellipse cx="0" cy="91" rx="75" ry="27" fill="#f4eee2" stroke="${ink}" stroke-width="2"/>`+line('M-108 92 Q0 170 108 92 M-110 79 Q0 153 110 79',ink,2)+box(-34,81,68,55,red);
      case 'seats':return [0,1,2].map(row=>[-80,-40,0,40,80].map(x=>box(x-12,57+row*30,24,17,blue)).join('')).join('')+box(-85,23,170,16);
      case 'pit':return scene('seats')+shape('M-116 112 Q0 156 116 112 V148 H-116 Z',ink);
      case 'floorplan':return box(-110,31,220,116,'#d5d0bd')+line('M-74 50 H75 V127 H17 V91 H-74 Z M17 91 V50 M-39 50 V89',paper,5);
      case 'compress':return p(0,108)+shape('M-116 30 L-36 63 V146 H-116 Z',blue)+shape('M116 30 L36 63 V146 H116 Z',blue);
      default:throw new Error('Unknown semantic art scene: '+type);
    }
  }
  function compose(rec,glyph){
    const actor=(pose='stand',x=0,y=105,s=1)=>move(person(pose),x,y,s);
    // These are actions in the illustrated method, not generic faces pasted onto a badge.
    if(rec.name==='间离术')return scene('stage')+actor('raise',-42,103,1.1)+move(symbol('placard',glyph),23,63,.85)+move(symbol('mask',glyph),71,132,.55);
    if(rec.name==='年龄妆')return scene('split')+actor('hold',-56,108,1.2)+move(diagramFigure({fig:'duanda',head:'white',face:'tired',skin:'fair',cloth:blue,prop:'none',pose:'hold',costume:'plain'}),58,63,.55)+move(symbol('quill',glyph),0,94,.55);
    if(rec.name==='画外音')return box(-58,30,165,118)+actor('guard',20,106,1.2)+move(symbol('speaker',glyph),-98,58,.65)+line('M-72 61 L-44 75',red,3);
    if(rec.name==='实时字幕')return scene('stage')+actor('reach',-38,95,1.15)+actor('hold',47,95,1.15)+move(symbol('caption',glyph),0,140,2.1);
    if(rec.name==='空椅对话')return scene('stage')+actor('reach',-64,105,1.2)+move(symbol('chair',glyph),62,116,1.1)+line('M-27 78 Q0 56 26 78',red,2);
    if(rec.name==='第四堵墙')return scene('glasswall')+move(symbol('audience',glyph),-83,142,.7);
    if(rec.name==='形体无言'||rec.name==='默剧')return scene('gesture')+move(symbol('silence',glyph),95,48,.55);
    if(rec.name==='对白')return actor('reach',-63,107,1.2)+actor('hold',63,107,1.2)+move(symbol('speech',glyph),-20,42,.55)+move(symbol('speech',glyph),40,57,.55)+sceneFloor();
    if(rec.name==='手语剧场')return actor('raise',-40,106,1.4)+move(symbol('hand',glyph),72,76,.9)+move(symbol('eye',glyph),68,127,.5);
    if(rec.name==='当众孤独')return scene('focus')+move(symbol('audience',glyph),-97,137,.5);
    if(rec.name==='文档朗读'||rec.name==='读剧'||rec.name==='演员读提示')return scene('stage')+actor('hold',-20,105,1.35)+move(symbol('book',glyph),18,88,.65)+move(symbol(rec.name==='演员读提示'?'arrow':'letter',glyph),88,65,.6);
    if(rec.name==='现场乐师')return scene('stage')+actor('hold',0,106,1.25)+move(symbol('violin',glyph),24,99,.8)+move(symbol('notes',glyph),82,50,.55);
    if(rec.scene==='split'){
      let pair=scene('split')+actor('reach',-63,113,.95)+actor(rec.name==='同时独白'?'raise':'hold',63,113,.95);
      const signs=(rec.symbols||[]).filter(n=>n!=='none'&&n!=='person');
      signs.slice(0,2).forEach((n,i)=>{pair+=move(symbol(n,glyph),i?63:-63,53,.53)});
      if(rec.name==='切光')pair+=box(-111,137,105,8,ink)+box(6,137,105,8,'#e5d597');
      return pair;
    }
    if(rec.scene==='lift')return scene('lift')+actor('stand',0,83,.9)+line('M-77 123 H77',red,4);
    if(rec.scene==='wagon')return scene('wagon')+actor('stand',0,53,.95)+move(symbol(rec.symbols?.[0]||'arrow',glyph),-62,95,.55);
    if(rec.scene==='accelerate')return scene('accelerate')+actor('step',-77,105,1.15)+move(symbol('clock',glyph),-66,35,.5);
    if(rec.scene==='fourbeats')return scene('fourbeats')+actor('step',-89,57,.85);
    if(rec.scene==='wings')return scene('wings')+actor('step',-78,112,.95)+move(symbol('arrow',glyph),-19,118,.65);
    let body=scene(rec.scene);
    // A 'person' symbol is already fulfilled by the scene's paper actor. Drawing an
    // extra mini-person made a two-person scene misleadingly contain four people.
    const names=(rec.symbols||[]).filter(x=>x&&x!=='none'&&(!['style','method'].includes(rec.kind)||x!=='person'));
    if(rec.scene==='herd'){
      body+=[-61,-3,55].map((x,i)=>move(symbol('rhino',glyph),x,98+i*9,.64)).join('')+move(person(),94,105,.7);
      return body;
    }
    const locations=names.length===1?[[0,106,.94]]:names.length===2?[[-47,109,.73],[50,106,.73]]:[[-64,111,.66],[0,94,.66],[64,111,.66]];
    const actorless=new Set(['room','stage','garden','portrait','frame','triangle','archive','court','street','threewindows','sound','objects','site','timeline','reverse','blackout','curtain','doors','factory','sky','blackbox','proscenium','floorplan','rain','route','loop','fork','network','exchange','lab','assembly','cluster','mist','target','crack','radiate','clockroom','layered']);
    const needsActor=(rec.kind==='style'||rec.kind==='method')&&actorless.has(rec.scene);
    if(needsActor){
      const action=rec.scene==='route'||rec.scene==='doors'?'step':['archive','room','objects'].includes(rec.scene)?'hold':['court','assembly','radiate','sound'].includes(rec.scene)?'raise':'reach';
      body+=actor(action,-56,108,1.08);
      names.forEach((name,i)=>{body+=move(symbol(name,glyph),i?94:48,i?129:67,.6)});
    }else{
      const concept=rec.kind==='style'||rec.kind==='method';
      const top=names.length===1?[[0,37,.58]]:[[-55,35,.49],[57,36,.49]];
      names.forEach((name,i)=>{const at=concept?top[Math.min(i,top.length-1)]:locations[Math.min(i,locations.length-1)];body+=move(symbol(name,glyph),...at)});
    }
    return body;
  }
  function playScene(rec,figure,glyph){
    const members=(rec.cast||[]).map(entry=>{
      const linked=entry.roleId?records()[entry.roleId]:{};
      if(entry.roleId&&!linked)throw new Error('Missing play cast: '+entry.roleId);
      return {...linked,...entry,skin:entry.skin||(linked&&linked.skin)||'fair',face:entry.face||(linked&&linked.face)||'quiet',cloth:entry.cloth||(linked&&linked.cloth)||blue,prop:entry.prop||(linked&&linked.prop)||'none',costume:entry.costume||(linked&&linked.costume)||'plain'};
    });
    const scenic=rec.scene==='circle'?`<ellipse cx="0" cy="106" rx="99" ry="35" fill="none" stroke="${ink}" stroke-width="3"/>`:scene(rec.scene);
    const background=`<g opacity=".45">${scenic}</g>`;
    const positions={
      duel:[[-65,49,.65,false],[65,49,.65,true],[103,30,.43,true]],
      duet:[[-61,49,.65,false],[61,49,.65,true]],
      barrier:[[-68,49,.65,false],[68,49,.65,true],[0,20,.44,false]],
      exit:[[76,46,.67,false],[-55,49,.65,false],[-101,32,.45,false]],
      reveal:[[-56,49,.65,false],[64,49,.65,true],[106,28,.46,true]],
      triangle:[[0,47,.68,false],[-83,48,.58,false],[83,48,.58,true]],
      solitary:[[0,35,.76,false]],
      surround:[[0,41,.72,false],[-82,52,.58,false],[82,52,.58,true]],
      elevated:[[43,7,.57,true],[-65,53,.64,false],[2,57,.58,false]],
      diagonal:[[-73,46,.65,false],[72,45,.66,true],[0,65,.53,false]],
      split:[[-64,48,.65,false],[64,48,.65,true]],
      procession:[[-77,48,.64,false],[4,48,.64,false],[82,53,.6,false]],
      tableau:[[-64,49,.65,false],[64,49,.65,true],[0,47,.61,false]],
      transform:[[-62,47,.66,false],[62,47,.66,true]],
      mirror:[[-61,47,.66,false],[61,47,.66,true]],
      circle:[[-68,43,.64,false],[67,51,.64,true],[0,31,.49,false]],
    };
    const layout=positions[rec.staging];if(!layout)throw new Error('Unknown play staging: '+rec.staging);
    if(members.length>layout.length)throw new Error('Play cast exceeds intentional positions: '+rec.name);
    let body=background;
    if(rec.staging==='barrier')body+=line('M0 62 V155',red,3);
    if(rec.staging==='exit')body+=line('M23 28 V155 M23 28 H116',ink,3);
    if(rec.staging==='elevated')body+=line('M10 95 H105',ink,5);
    if(rec.staging==='reveal')body+=move(raw.curtain(),82,81,1.7);
    members.forEach((member,i)=>{
      const [x,y,s,flip]=layout[i];
      let actor=figure(member);
      if(member.name==='三女巫')actor=[-32,0,32].map((offset,j)=>move(figure(member),offset,j===1?-10:0,.55)).join('');
      if(member.name==='温妮')actor+=move(raw.mound(),0,144,1.3);
      body+=`<g transform="translate(${x} ${y}) scale(${flip?-s:s} ${s})">${actor}</g>`;
    });
    // Stage objects sit on the ground or table line, never replace the dramatic cast.
    const names=(rec.symbols||[]).filter(x=>x!=='none');
    names.slice(0,2).forEach((name,i)=>{
      const x=names.length===1?0:i?-25:23;
      body+=move(symbol(name,glyph),x,143,.38);
    });
    if(rec.scene==='herd')body+=[-73,-16,44].map(x=>move(symbol('rhino',glyph),x,54,.42)).join('');
    return body;
  }
  function records(){return root.ART_PROFILE_DATA_V39||(typeof ART_PROFILE_DATA_V39!=='undefined'?ART_PROFILE_DATA_V39:{});}
  function rolePortrait(rec,figure,glyph){
    const side=rec.portraitLayout==='left'?-1:rec.portraitLayout==='right'?1:0;
    const x=side*25,emblemX=side?-side*89:-91;
    const object=typeof figV39Object==='function'?figV39Object:root.figV39Object;
    let body=`<ellipse cx="${x}" cy="166" rx="64" ry="4" fill="#ded1b8"/>`;
    if(rec.name==='三女巫')body+=[-64,0,64].map((dx,i)=>move(figure(rec),dx,32-i*9,.75)).join('');
    else if(['纳格','奈尔','温妮'].includes(rec.name))body+=`<svg x="${x-100}" y="-8" width="200" height="118" viewBox="-100 -8 200 118" overflow="hidden">${move(figure(rec),0,-2,1.08)}</svg>`;
    else body+=move(figure(rec),x,-2,1.07);
    if(rec.propMode==='emblem'&&rec.prop!=='none'&&object){
      body+=`<g data-role-emblem="${rec.prop}" transform="translate(${emblemX} 70) scale(.9)">${object(rec.prop,rec.cloth,ink,'#efe6d4','#c6a15a')}</g>`;
    }
    const names=(rec.symbols||[]).filter(name=>name&&name!=='none'&&name!==rec.prop&&!(['纳格','奈尔','温妮'].includes(rec.name)&&['trash','mound'].includes(name)));
    if(names.length)body+=`<g data-role-context="${names[0]}" opacity=".8">${move(symbol(names[0],glyph),side?emblemX:94,134,.48)}</g>`;
    if(rec.name==='温妮')body+=move(raw.mound(),x,131,1.5);
    if(rec.name==='纳格'||rec.name==='奈尔')body+=move(shape('M-44 103 H44 L37 167 H-37 Z','#89918b')+`<ellipse cx="0" cy="103" rx="44" ry="7" fill="#aaa895" stroke="${ink}" stroke-width="2.2"/>`+line('M-25 116 L-22 156 M0 116 V156 M25 116 L22 156',ink,2),x);
    return `<g data-portrait-v50="${rec.portraitLayout}">${body}</g>`;
  }
  const api={
    get(value){return records()[typeof value==='string'?value:value.id]},
    apply(target,cards){
      for(const c of cards){const rec=api.get(c);if(!rec||rec.name!==c.name)throw new Error('Art profile mismatch: '+c.id);target[c.id]={...rec};}
      return target;
    },
    symbol, scene,
    render(card,options={}){
      const rec=api.get(card);
      if(!rec)throw new Error('Missing semantic art profile: '+card.id);
      const figure=options.figure||(typeof figBodyV39==='function'?figBodyV39:root.figBodyV39);
      const glyph=options.glyph||(typeof I==='function'?I:undefined);
      diagramFigure=figure;
      let body;
      if(rec.kind==='play'&&rec.cast&&rec.cast.length){
        if(typeof figure!=='function')throw new Error('Missing paper figure renderer');
        body=playScene(rec,figure,glyph);
      }else if(rec.fig&&rec.portraitLayout){
        if(typeof figure!=='function')throw new Error('Missing paper figure renderer');
        body=rolePortrait(rec,figure,glyph);
      }else if(rec.fig){
        if(typeof figure!=='function')throw new Error('Missing paper figure renderer');
        const ground=`<ellipse cx="0" cy="160" rx="68" ry="6" fill="#ded1b8"/>`;
        if(rec.name==='三女巫')body=ground+[-62,0,62].map((x,i)=>move(figure(rec),x,29-i*7,.72)).join('');
        else body=ground+move(figure(rec),0,5,.95);
        const names=(rec.symbols||[]).filter(x=>x!=='none');
        names.forEach((name,i)=>{body+=move(symbol(name,glyph),i%2?105:-103,110-i*39,.72)});
        if(rec.name==='温妮')body+=move(raw.mound(),0,143,1.4);
        if(rec.name==='纳格'||rec.name==='奈尔')body+=move(symbol('trash',glyph),0,138,1.15);
      }else body=compose(rec,glyph);
      return {wash:rec.wash||'#f4eee2',body};
    }
  };
  root.ArtProfilesV39=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
