/* Specific stage spaces in the same flat paper-cut vocabulary. */
function spaceArtV39(card){
  const ink='#29251f',paper='#eee1c7',red='#984d45',blue='#6e8190',wood='#9d8061',gold='#c8ad70';
  const p=(d,c=paper,w=2)=>`<path d="${d}" fill="${c}" stroke="${ink}" stroke-width="${w}" stroke-linejoin="round"/>`;
  const line=(d,c=ink,w=2)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const rect=(x,y,w,h,c=paper)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${ink}" stroke-width="2"/>`;
  const ellipse=(x,y,rx,ry,c=paper)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${ink}" stroke-width="2"/>`;
  const item=(name,x,y,scale=.6)=>`<g transform="translate(${x} ${y}) scale(${scale})">${ArtProfilesV39.symbol(name,I)}</g>`;
  const room=()=>rect(-139,16,278,140,'#e8dcc5')+p('M-139 156 L-105 126 H105 L139 156 Z','#d5c3a6');
  const lattice=(x,y,w,h)=>rect(x,y,w,h,'#c5d0cb')+line(`M${x+w/2} ${y} V${y+h} M${x} ${y+h/2} H${x+w} M${x+w/4} ${y} V${y+h} M${x+w*3/4} ${y} V${y+h}`);
  const chair=(x,y)=>rect(x-12,y-33,24,27,wood)+rect(x-14,y-7,28,8,wood)+line(`M${x-11} ${y} V${y+23} M${x+11} ${y} V${y+23}`,ink,3);
  const roof=(y=25)=>p(`M-146 ${y-6} Q-121 ${y+9} -102 ${y} L0 ${y-28} L102 ${y} Q121 ${y+9} 146 ${y-6} L128 ${y+22} H-128 Z`,red);
  const chineseHall=()=>roof(37)+rect(-117,59,234,91,'#e6d6b8')+rect(-123,52,10,105,red)+rect(113,52,10,105,red)+p('M-134 159 H134 L143 169 H-143 Z',wood);
  let body;
  switch(card.name){
    case '周公馆':
      body=room()+lattice(-121,31,56,69)+rect(68,29,52,65,wood)+rect(76,37,36,45,'#d2c7b0')+line('M84 47 L103 75 M103 47 L84 75',wood)+chair(0,120)+rect(-48,131,96,7,wood)+line('M-40 138 V157 M40 138 V157',wood,4)+item('cup',-20,119,.45)+item('bottle',26,107,.45)+p('M-135 20 H-62 L-79 84 L-127 99 Z',red)+p('M132 20 H122 V104 L101 81 Z',red);
      break;
    case '曾家花厅':
      body=chineseHall()+lattice(-95,68,39,54)+lattice(57,68,39,54)+rect(-42,65,84,70,'#c5c5af')+line('M0 65 V135 M-42 103 H42',wood,3)+rect(-42,133,84,7,wood)+line('M-33 140 V159 M33 140 V159',wood,3)+ellipse(0,116,27,4,wood)+item('bird',76,98,.35)+p('M54 101 V66 Q76 44 98 66 V101 Z','none')+line('M65 59 V101 M76 53 V101 M87 59 V101')+item('clock',-77,41,.4);
      break;
    case '娜拉的客厅':
      body=room()+rect(66,31,53,119,wood)+rect(74,41,37,92,'#cab79b')+rect(86,78,27,19,paper)+line('M89 83 H110',ink,3)+ellipse(108,107,3,3,gold)+p('M-120 112 H31 V139 H-120 Z',blue)+p('M-126 97 Q-112 86 -100 100 H12 Q32 86 39 99 V129 H-126 Z',blue)+line('M-111 139 V155 M20 139 V155',wood,4)+rect(-56,146,83,5,wood)+item('letter',86,90,.25)+item('key',45,140,.35)+item('plant',-87,59,.75);
      break;
    case '斯特拉的公寓':
      body=room()+lattice(-121,34,44,54)+rect(-63,46,91,60,'#cbbcab')+p('M-67 40 H33 V64 L8 73 L-10 62 L-29 77 L-67 64 Z','#b7b29d')+rect(-67,107,95,12,blue)+rect(-70,119,6,30,wood)+rect(26,119,6,30,wood)+rect(63,31,59,119,wood)+line('M69 35 V147 M81 35 V147 M93 35 V147 M105 35 V147 M117 35 V147',paper,2)+line('M-105 16 V42')+item('lamp',-105,48,.4)+ellipse(69,120,30,10,wood)+line('M69 130 V153',wood,4)+item('cup',65,106,.32);
      break;
    case '画舫':
      body=line('M-147 151 Q-110 139 -73 151 T1 151 T75 151 T149 151',blue,3)+p('M-137 118 Q0 139 139 118 L109 149 H-103 Z',wood)+p('M-88 67 H81 L109 83 H-115 Z',red)+rect(-87,84,169,37,wood)+[-63,-14,35].map(x=>lattice(x,87,34,27)).join('')+p('M-108 84 L-96 58 M101 83 L87 57','none')+line('M-125 118 H126 M-116 112 H117',gold,3)+item('lamp',-101,100,.28)+item('lamp',94,100,.28)+line('M119 111 L143 66',wood,4);
      break;
    case '甲板':
      body=p('M-140 157 L-78 57 H79 L140 157 Z',wood)+[-90,-45,0,45,90].map(x=>line(`M${x} 155 L${x*.55} 58`,paper,2)).join('')+line('M-134 147 H134 M-115 118 H115 M-99 92 H99',ink,1)+line('M-140 110 L-87 26 H87 L140 110 M-132 96 L-81 37 H81 L132 96',ink,3)+[-110,-55,0,55,110].map(x=>line(`M${x} 113 V${45+Math.abs(x)*.36}`,ink,3)).join('')+rect(-5,2,10,121,wood)+item('rope',73,133,.52)+item('wheel',-63,73,.57)+line('M-146 52 Q-122 37 -98 52 M99 52 Q123 37 147 52',blue,3);
      break;
    case '殡仪馆':
      body=rect(-128,26,256,130,'#dfd9cc')+p('M-132 27 H132 L109 8 H-109 Z','#777970')+rect(-99,43,198,102,'#b6b8af')+p('M-96 45 H-56 L-67 130 H-96 Z',blue)+p('M96 45 H56 L67 130 H96 Z',blue)+p('M-46 97 L-29 83 H31 L47 97 L34 130 H-34 Z',wood)+line('M-36 101 H36',gold,3)+[-80,80].map(x=>ellipse(x,91,18,24,'#7c8870')+ellipse(x,91,9,15,paper)+line(`M${x} 115 V147`,wood,3)).join('')+rect(-62,144,124,8,wood);
      break;
    case '修道院':
      body=rect(-136,49,272,108,'#d5cdb8')+[-90,0,90].map(x=>p(`M${x-32} 153 V87 Q${x-32} 63 ${x} 39 Q${x+32} 63 ${x+32} 87 V153 Z`,'#a9b7ae')+line(`M${x} 43 V153`,paper,2)).join('')+p('M-143 52 H143 L119 20 H-119 Z',blue)+rect(-11,2,22,31,paper)+line('M0 -2 V24 M-10 7 H10',ink,3)+p('M-145 159 H145 L126 172 H-126 Z',wood)+item('plant',0,123,.43);
      break;
    case '祠堂':
      body=chineseHall()+rect(-70,71,140,70,wood)+[-43,0,43].map(x=>p(`M${x-12} 126 V84 Q${x} 70 ${x+12} 84 V126 Z`,ink)+line(`M${x} 86 V115`,gold,2)).join('')+rect(-82,133,164,8,red)+line('M-72 141 V161 M72 141 V161',wood,4)+item('bowl',0,120,.45)+line('M-6 115 V95 M0 115 V90 M6 115 V96',ink,1.6)+item('flower',-104,105,.45)+item('flower',104,105,.45);
      break;
    case '金殿':
      body=chineseHall()+rect(-80,67,160,66,gold)+ellipse(0,93,31,31,red)+p('M-24 113 V88 L-16 77 L-7 86 H7 L16 77 L24 88 V113 Z',gold)+rect(-29,113,58,10,red)+line('M-21 122 V139 M21 122 V139',wood,4)+p('M-75 141 H75 L87 150 H-87 Z',gold)+p('M-87 150 H87 L99 160 H-99 Z',paper)+item('column',-96,101,.7)+item('column',96,101,.7);
      break;
    case '裕泰茶馆':
      body=chineseHall()+lattice(-99,70,45,62)+lattice(54,70,45,62)+rect(-41,65,82,64,'#a6b3a9')+rect(-43,25,86,29,ink)+line('M-28 34 H28 M-28 44 H28',gold,3)+[-57,57].map(x=>rect(x-29,122,58,6,wood)+line(`M${x-22} 128 V151 M${x+22} 128 V151`,wood,3)+rect(x-36,141,72,5,wood)+item('teapot',x,107,.5)).join('')+line('M0 67 V128',wood,3)+item('cup',-31,112,.25)+item('cup',82,112,.25);
      break;
    case '广播控制室':
      body=room()+rect(-122,28,244,57,ink)+[-94,-47,0,47,94].map(x=>rect(x-16,38,32,19,'#90aaa5')+line(`M${x-11} 48 H${x+11}`,paper,1.5)).join('')+p('M-117 98 H117 L133 147 H-133 Z',wood)+Array.from({length:9},(_,i)=>{const x=-100+i*25;return line(`M${x} 110 V136`,paper,2)+rect(x-5,114+i%3*6,10,5,red)}).join('')+item('mic',-72,87,.6)+item('ear',83,85,.55)+line('M-115 149 V163 M115 149 V163',ink,4);
      break;
    case '大使馆避难厅':
      body=room()+rect(66,34,55,115,wood)+rect(76,43,35,88,'#b7c5bf')+ellipse(91,69,12,12,gold)+line('M85 66 H97 M85 72 H97')+[-83,-39,5].map(x=>chair(x,124)).join('')+rect(-119,29,139,48,'#a6b5b3')+line('M-110 46 H11 M-110 62 H-18',paper,3)+item('bundle',-80,146,.5)+item('passport',29,119,.55)+rect(22,134,36,5,wood)+line('M27 139 V157 M54 139 V157',wood,3);
      break;
    case '矿井吊笼':
      body=rect(-126,8,252,151,'#b3aa92')+rect(-70,38,140,116,blue)+rect(-78,29,156,12,wood)+rect(-78,147,156,13,wood)+[-61,-31,0,31,61].map(x=>line(`M${x} 41 V147`,ink,4)).join('')+line('M-65 73 H65 M-65 112 H65',ink,3)+ellipse(0,16,12,12,wood)+line('M0 28 V37 M-17 6 V158 M17 6 V158',ink,2)+item('lamp',-105,75,.44)+line('M95 43 V127 M87 53 L95 40 L103 53',gold,4);
      break;
    case '石库门':
      body=rect(-135,24,270,137,'#b0987f')+Array.from({length:6},(_,i)=>line(`M-135 ${34+i*21} H135`,paper,1.4)).join('')+p('M-65 157 V49 L-79 49 L-62 26 H62 L79 49 H65 V157 Z','#d4d0bf')+rect(-49,54,98,104,ink)+line('M0 56 V156',wood,3)+[-18,18].map(x=>ellipse(x,105,5,8,gold)).join('')+lattice(-121,45,39,61)+lattice(82,45,39,61)+p('M-72 159 H72 L87 171 H-87 Z',wood);
      break;
    default:return null;
  }
  return {wash:'#f4eee2',body:`<g data-space-v39="${K(card.name)}">${body}</g>`};
}
