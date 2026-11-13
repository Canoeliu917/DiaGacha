/* DiaGacha v39: the existing paper figures, with semantic clothing and gestures.
 * Load after figHead/figTypeOf. Call figBodyV39({...xt[id], ...ART_PROFILES_V39[id]}).
 * No hash, random pose, gradients, texture, or replacement face/hair style.
 */
var FIGURE_FEATURES_V39 = {
  lipao: {name:"礼袍",outline:"宽袖直身",neck:"交领",hem:"对称长直摆",sleeve:"垂地阔袖",pose:"fold"},
  changqun: {name:"长裙",outline:"细腰钟形",neck:"方领",hem:"扇形及地裙",sleeve:"窄弯袖",pose:"hold"},
  duanda: {name:"短打",outline:"短衣分腿",neck:"开襟V领",hem:"腰下短摆",sleeve:"卷袖",pose:"step"},
  jiazhou: {name:"甲胄",outline:"横阔肩甲",neck:"护颈",hem:"分片甲裙",sleeve:"分节臂甲",pose:"guard"},
  doupeng: {name:"斗篷",outline:"偏侧风帆",neck:"高翻领",hem:"斜拖长角",sleeve:"藏臂开口",pose:"reach"},
  xizhuang: {name:"西装",outline:"方肩收腰",neck:"双翻领领带",hem:"短夹克分裤",sleeve:"袖口窄线",pose:"stand"},
  laozuo: {name:"劳作围裙",outline:"前宽后窄",neck:"围裙挂颈带",hem:"大围裙叠裙",sleeve:"上卷短袖",pose:"hold"},
  pizhe: {name:"古典披褶",outline:"单肩斜垂",neck:"露肩扣针",hem:"不齐披褶",sleeve:"单臂裸露",pose:"reach"},
  poyi: {name:"破衣",outline:"歪肩碎摆",neck:"撕裂领口",hem:"锯齿破摆",sleeve:"长短断袖",pose:"bow"},
  dayi: {name:"大衣",outline:"上窄下阔",neck:"宽翻领围巾",hem:"双开长摆",sleeve:"厚宽直袖",pose:"stand"},
  lifu: {name:"礼服",outline:"燕尾长角",neck:"白胸片领结",hem:"双燕尾分腿",sleeve:"窄礼服袖",pose:"raise"},
  zhifu: {name:"制服",outline:"挺直箱形",neck:"立领肩章",hem:"平腰带长裤",sleeve:"直肩袖章",pose:"guard"},
  changshan: {name:"长衫",outline:"窄直圆肩",neck:"偏襟盘扣",hem:"侧开衩长衫",sleeve:"筒状长袖",pose:"fold"},
  qipao: {name:"旗袍",outline:"收腰曲线",neck:"立领斜襟",hem:"单侧高衩",sleeve:"贴肩短袖",pose:"stand"},
  magua: {name:"马褂",outline:"上方下宽",neck:"对襟圆领",hem:"短褂宽裤",sleeve:"宽口短筒",pose:"fold"},
  gongzhuang: {name:"工装",outline:"背带分腿",neck:"双背带胸袋",hem:"宽直裤脚",sleeve:"短衫裸前臂",pose:"step"},
  baiyi: {name:"白衣",outline:"白长褂开门",neck:"白翻领深内衫",hem:"开襟下摆",sleeve:"宽白袖",pose:"hold"},
  jinpao: {name:"巾袍",outline:"头巾罩肩",neck:"包裹式兜巾",hem:"闭合拖地袍",sleeve:"披巾下双袖",pose:"fold"},
  tongqun: {name:"筒裙",outline:"平肩直筒",neck:"平直圆领",hem:"横纹直裙",sleeve:"短袖外露臂",pose:"stand"},
  zuozi: {name:"坐姿",outline:"低矮椅坐",neck:"弯腰襟口",hem:"折膝前伸",sleeve:"屈肘搭膝",pose:"hold"},
  goulou: {name:"佝偻",outline:"前屈弓背",neck:"低头垂领",hem:"屈膝短步",sleeve:"前伸撑杖",pose:"bow"}
};
var FIGURE_POSES_V39 = ["stand","step","reach","raise","guard","hold","fold","bow","offer","clutch","refuse","listen","point","conceal","open","stride"];
var FIGURE_COSTUMES_V39 = ["plain","royal","formal","work","worn","mourning","layered","puritan"];

function figV39Path(d,fill,stroke,width){return `<path d="${d}" fill="${fill||'none'}"${stroke?` stroke="${stroke}" stroke-width="${width||2}" stroke-linecap="round" stroke-linejoin="round"`:``}/>`}
function figV39Circle(x,y,r,fill){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`}

function figV39Legs(pose,top,ink,wide){
  if(pose===`stride`)return figV39Path(`M-13 ${top} H-1 L-26 145 L-42 157 H-53 L-33 138 Z M3 ${top} H15 L34 144 H49 V154 H26 L9 130 Z`,ink);
  if(pose===`step`)return figV39Path(`M-13 ${top} H-2 L-20 150 L-34 157 H-43 L-27 143 Z M3 ${top} H14 L26 148 H38 V156 H18 L7 132 Z`,ink);
  return figV39Path(wide?`M-20 ${top} H-3 L-5 154 H-29 L-25 147 Z M3 ${top} H20 L25 147 L30 154 H5 Z`:`M-14 ${top} H-3 L-5 150 L-13 157 H-23 L-16 146 Z M3 ${top} H14 L16 148 L24 157 H4 Z`,ink);
}

function figV39Arms(e,c,pose,skin){
  const paths={
    stand:[`M-20 58 L-29 83 L-25 107`,`M20 58 L29 83 L27 107`,[-25,107],[27,107]],
    step:[`M-20 58 L-34 76 L-43 91`,`M20 58 L33 75 L47 68`,[-43,91],[47,68]],
    reach:[`M-20 58 L-28 86 L-15 103`,`M20 58 L39 76 L61 76`,[-15,103],[61,76]],
    raise:[`M-20 58 L-30 83 L-26 104`,`M20 58 L38 50 L46 27`,[-26,104],[46,27]],
    guard:[`M-20 58 L-30 83 L8 84`,`M20 58 L30 75 L5 99`,[8,84],[5,99]],
    hold:[`M-20 58 L-32 83 L-9 97`,`M20 58 L32 83 L9 97`,[-9,97],[9,97]],
    fold:[`M-20 58 L-24 88 L12 91`,`M20 58 L24 82 L-7 92`,[12,91],[-7,92]],
    bow:[`M-20 64 L-34 92 L-25 118`,`M20 64 L31 91 L16 113`,[-25,118],[16,113]],
    offer:[`M-20 58 L-29 84 L-5 98`,`M20 58 L35 79 L58 65`,[-5,98],[58,65]],
    clutch:[`M-20 58 L-31 79 L8 82`,`M20 58 L30 86 L-3 74`,[8,82],[-3,74]],
    refuse:[`M-20 58 L-36 75 L-46 55`,`M20 58 L35 80 L48 59`,[-46,55],[48,59]],
    listen:[`M-20 58 L-30 84 L-17 106`,`M20 58 L34 43 L22 28`,[-17,106],[22,28]],
    point:[`M-20 58 L-31 83 L-9 101`,`M20 58 L40 53 L64 45`,[-9,101],[64,45]],
    conceal:[`M-20 58 L-35 86 L-18 112`,`M20 58 L29 86 L14 111`,[-18,112],[14,111]],
    open:[`M-20 58 L-41 69 L-62 58`,`M20 58 L41 69 L62 58`,[-62,58],[62,58]],
    stride:[`M-20 58 L-36 72 L-48 52`,`M20 58 L39 77 L50 100`,[-48,52],[50,100]]
  };
  const a=paths[pose]||paths.stand;
  const bare=[`pizhe`,`qipao`,`gongzhuang`,`tongqun`].includes(e.fig);
  return figV39Path(a[0],null,bare?skin:c,bare?5:7)+figV39Path(a[1],null,bare?skin:c,bare?5:7)+figV39Circle(...a[2],3.4,skin)+figV39Circle(...a[3],3.4,skin);
}

function figV39Clothes(type,c,pose,ink,paper,gold,e={}){
  const p=figV39Path, legs=(top,wide=false)=>figV39Legs(pose,top,ink,wide);
  switch(type){
    case `lipao`:return p(`M-17 50 L-35 58 L-40 136 L-23 145 L-19 92 L-21 156 H21 L19 92 L23 145 L40 136 L35 58 L17 50 Z`,c)+p(`M-13 50 L10 81 L16 53 M-19 102 H19`,null,gold,3)+p(`M0 81 V155`,null,gold,2);
    case `changqun`:return p(`M-15 50 H15 L10 80 Q28 109 57 155 H-57 Q-28 109 -10 80 Z`,c)+p(`M-10 80 H10 M-29 140 Q0 150 29 140`,null,gold,3)+p(`M-11 50 V60 H11 V50`,paper);
    case `duanda`:return legs(103)+p(`M-21 50 L-7 56 L0 70 L8 56 L22 50 L27 76 L16 78 L18 102 L1 110 L-18 102 L-16 78 L-28 74 Z`,c)+p(`M-8 56 L0 77 L8 56 M-17 96 H17`,null,gold,3)+p(`M-27 70 L-17 74 M18 73 L27 70`,null,paper,4);
    case `jiazhou`:return legs(120,true)+p(`M-40 54 L-26 41 L-10 48 H10 L26 41 L40 54 L34 74 L23 68 L20 99 L30 119 L10 128 L0 111 L-10 128 L-30 119 L-20 99 L-23 68 L-34 74 Z`,c)+p(`M-23 70 H23 M-20 84 H20 M-20 98 H20 M-12 48 V103 M12 48 V103`,null,gold,3)+p(`M-35 52 L-30 63 M35 52 L30 63`,null,paper,3);
    case `doupeng`:return legs(118)+p(`M-9 44 L-21 53 Q-54 83 -64 146 L-32 140 L-8 158 L22 142 L67 154 Q41 102 32 66 L13 44 L17 65 L-12 66 Z`,c)+p(`M-5 63 L15 68 L23 141 L-7 153 Z`,ink)+p(`M-11 59 L11 59`,null,gold,4);
    case `xizhuang`:return legs(111)+p(`M-24 50 L-8 54 L0 72 L8 54 L24 50 L21 113 L1 109 L-21 113 Z`,c)+p(`M-8 54 L0 95 L8 54 L13 65 L6 75 L10 81 L0 106 L-10 81 L-6 75 L-13 65 Z`,paper)+p(`M-2 66 H2 L4 87 L0 94 L-4 87 Z`,ink)+p(`M9 91 H18`,null,gold,2);
    case `laozuo`:return legs(145,true)+p(`M-24 51 H24 L28 147 H-28 Z`,c)+p(`M-11 56 L-15 83 L-24 139 H24 L15 83 L11 56 L7 56 L10 79 H-10 L-7 56 Z`,paper)+p(`M-13 102 H13 V120 H-13 Z`,null,ink,2)+p(`M-25 75 H25`,null,gold,3);
    case `pizhe`:return p(`M-20 50 L-4 56 L16 47 L34 101 L43 153 L8 145 L-9 158 L-35 133 L-21 88 Z`,c)+p(`M-12 58 L14 86 L28 125 M-24 92 L-8 139 M8 79 L19 148`,null,gold,2.5)+figV39Circle(16,52,4,gold);
    case `poyi`:return legs(128)+p(`M-22 57 L-9 49 L-2 61 L8 50 L20 55 L27 89 L16 96 L23 137 L10 132 L5 151 L-3 135 L-18 145 L-21 126 L-34 133 L-27 92 L-36 86 Z`,c)+p(`M-15 91 L-2 88 L2 103 L-12 108 Z M7 117 L18 120 L14 133 L3 128 Z`,paper)+p(`M-13 91 L-1 103 M7 119 L14 130`,null,ink,2);
    case `dayi`:return legs(135)+p(`M-27 49 L-9 53 L0 73 L9 53 L27 49 L34 142 L12 136 L0 152 L-12 136 L-34 142 Z`,c)+p(`M-10 51 L-18 75 L-5 86 L0 104 L5 86 L18 75 L10 51 L0 70 Z`,paper)+p(`M-8 50 H8 L13 116 H4 L0 68 L-8 66 Z`,gold)+p(`M-25 105 L-10 110 M10 110 L25 105`,null,ink,3);
    case `lifu`:return legs(103)+p(`M-21 50 L-7 54 H7 L21 50 L18 97 L39 149 L24 155 L5 108 H-5 L-24 155 L-39 149 L-18 97 Z`,c)+p(`M-8 54 H8 L5 93 H-5 Z`,paper)+p(`M-11 55 L0 61 L11 55 V66 L0 61 L-11 66 Z`,ink)+p(`M-20 97 H20`,null,gold,2.5);
    case `zhifu`:return legs(109)+p(`M-28 48 L-12 53 H12 L28 48 L24 109 H-24 Z`,c)+p(`M-10 46 H10 V60 H-10 Z`,c)+p(`M-27 51 H-16 M16 51 H27 M-24 98 H24`,null,gold,4)+p(`M-17 70 H-5 V81 H-17 Z M5 70 H17 V81 H5 Z`,null,paper,2)+p(`M0 59 V96`,null,ink,2);
    case `changshan`:return p(`M-17 49 Q0 44 17 49 L21 151 L9 144 L0 156 L-9 144 L-21 151 Z`,c)+p(`M-4 49 Q14 61 15 80 V144 M-17 119 L-20 149 M17 119 L20 149`,null,gold,2.5)+p(`M7 61 H16 M10 72 H17 M13 83 H18`,null,paper,3);
    case `qipao`:return p(`M-6 43 H6 V51 L17 55 L13 83 L10 96 L22 154 H6 L13 117 L3 154 H-19 L-10 96 L-13 83 L-17 55 L-6 51 Z`,c)+p(`M-6 49 Q10 60 13 77 M-4 56 H5 M3 64 H11`,null,gold,2.8)+p(`M-14 80 H14`,null,ink,2);
    case `magua`:return legs(100,true)+p(`M-25 49 L-10 49 Q0 62 10 49 H25 L31 95 L22 100 L17 78 L18 105 H-18 L-17 78 L-22 100 L-31 95 Z`,c)+p(`M0 57 V104 M-23 88 L-18 87 M18 87 L23 88`,null,paper,3)+p(`M-5 69 H5 M-5 82 H5 M-5 95 H5`,null,gold,3);
    case `gongzhuang`:return legs(108,true)+p(`M-23 50 H23 L27 76 L16 79 L18 110 H-18 L-16 79 L-27 76 Z`,paper)+p(`M-14 50 H-7 V77 H7 V50 H14 V76 L19 109 H-19 L-14 76 Z`,c)+p(`M-9 81 H9 V96 H-9 Z`,null,ink,2.5)+p(`M-18 105 H18`,null,gold,3);
    case `baiyi`:return legs(139)+p(`M-15 54 H15 L17 140 H-17 Z`,c)+p(`M-27 49 L-10 54 L-3 78 L-6 141 L-32 150 Z M27 49 L10 54 L3 78 L6 141 L32 150 Z`,paper)+p(`M-11 54 L-18 73 L-7 84 M11 54 L18 73 L7 84 M-25 102 H-12 V116 H-25 M12 102 H25 V116 H12`,null,gold,2.2);
    case `jinpao`:return p(`M-24 50 L-34 82 L-26 156 H26 L34 82 L24 50 Z`,c)+p(`M-30 30 Q-27 -2 0 -3 Q27 -2 30 30 L37 72 L16 80 L0 58 L-16 80 L-37 72 Z`,paper)+p(`M-22 32 Q0 18 22 32 L16 61 H-16 Z`,c)+p(`M-25 83 L-17 144 M25 83 L17 144`,null,gold,2.5);
    case `tongqun`:return p(`M-21 50 H21 L24 72 L15 76 L17 154 H-17 L-15 76 L-24 72 Z`,c)+p(`M-12 51 Q0 62 12 51 M-16 86 H16 M-17 141 H17`,null,paper,3)+p(`M-8 93 V133 M0 93 V133 M8 93 V133`,null,gold,2);
    case `zuozi`:return (['纳格','奈尔','温妮'].includes(e.name)?``:p(`M-31 74 H-24 V156 H-31 Z M24 74 H31 V156 H24 Z M-31 74 H31 V84 H-31 Z M-33 119 H33 V128 H-33 Z`,gold))+p(`M-18 66 H18 L25 115 L36 126 L28 139 L9 125 L-8 128 L-31 147 L-43 138 L-23 116 Z`,c)+p(`M25 136 L28 155 H16 L12 133 M-31 139 L-43 155 H-54 L-41 132`,ink)+p(`M-13 71 L0 91 L13 71`,null,paper,3);
    case `goulou`:return p(`M-22 71 Q-4 49 20 58 L35 102 L19 123 L18 142 L6 154 H-6 L5 135 L3 120 L-13 133 L-25 153 H-38 L-25 124 L-26 99 Z`,c)+p(`M11 118 L23 132 L18 155 H6 L12 135 L1 126`,ink)+p(`M-17 83 L6 80 L12 100 L-12 108 Z`,paper)+(e.propMode?``:p(`M40 82 Q48 76 50 85 V157`,null,gold,5));
    default:return ``;
  }
}

function figV39Costume(kind,type,c,paper,gold,ink){
  const p=figV39Path;
  switch(kind){
    case `royal`:return p(`M-22 51 L-34 61 L-26 99 L-15 80 L0 91 L15 80 L26 99 L34 61 L22 51 L0 66 Z`,paper)+p(`M-20 55 L0 72 L20 55 M-16 103 H16`,null,gold,4)+figV39Circle(0,76,5,gold);
    case `formal`:
      if([`changqun`,`tongqun`,`qipao`].includes(type))return p(`M-13 52 Q0 69 13 52 M-18 85 H18`,null,gold,3)+[-10,-5,0,5,10].map((x,i)=>figV39Circle(x,58+Math.min(i,4-i)*2,2.5,paper)).join(``);
      if([`lipao`,`changshan`,`magua`,`jinpao`].includes(type))return p(`M-10 49 L0 58 L10 49 M4 58 V116 M4 71 H16 M4 86 H16 M4 101 H16`,null,gold,3)+p(`M-18 121 H18`,null,paper,3);
      return p(`M-11 50 L0 63 L11 50 L7 79 L0 70 L-7 79 Z`,paper)+p(`M-4 61 L4 61 L3 91 L0 98 L-3 91 Z`,ink);
    case `work`:return p(`M-9 55 H9 V84 L20 128 H-20 L-9 84 Z`,paper)+p(`M-12 94 H12 V113 H-12 Z`,null,ink,2.5);
    case `worn`:return p(`M-15 81 L-3 77 L2 94 L-13 98 Z M3 116 L18 112 L21 132 L5 135 Z`,paper)+p(`M-13 83 L-1 92 M5 118 L19 130 M-12 101 L-18 120`,null,ink,2);
    case `mourning`:return p(`M-21 48 L-12 49 L-2 74 L7 126 L-1 132 L-13 80 Z`,ink)+p(`M-25 66 L-14 65 L-12 76 L-26 78 Z`,paper);
    case `layered`:return p(`M-23 53 L-9 51 L-1 89 L-13 124 L-27 115 Z M23 53 L9 51 L1 89 L13 124 L27 115 Z`,paper)+p(`M-23 55 L-9 64 M23 55 L9 64 M-8 95 H8`,null,gold,3);
    case `puritan`:return p(`M-14 49 L-2 53 L-2 72 H-15 Z M14 49 L2 53 L2 72 H15 Z`,paper)+p(`M-26 92 L-16 94 L-17 103 L-28 101 Z M26 92 L16 94 L17 103 L28 101 Z`,paper)+p(`M-15 106 H15`,null,ink,4);
    default:return ``;
  }
}

function figV39Object(prop,c,ink,paper,gold){
  const p=figV39Path, dot=figV39Circle;
  switch(prop){
    case `book`:return p(`M-22 -10 Q-8 -16 0 -7 Q8 -16 22 -10 V19 Q8 13 0 21 Q-8 13 -22 19 Z`,paper,ink,2)+p(`M0 -7 V20 M-17 -3 L-5 -2 M5 -2 L17 -3`,null,gold,2);
    case `letter`:return p(`M-24 -12 H24 V19 H-24 Z`,paper,ink,2)+p(`M-24 -12 L0 7 L24 -12 M-24 19 L-9 4 M24 19 L9 4`,null,gold,2);
    case `scroll`:return p(`M-23 -15 H23 V20 H-23 Z`,paper)+p(`M-23 -18 V23 M23 -18 V23`,null,gold,5)+p(`M-13 -5 H13 M-13 3 H13 M-13 11 H6`,null,ink,2);
    case `case`:case `chest`:return p(`M-24 -10 H24 V23 H-24 Z`,c,ink,2)+p(prop===`case`?`M-10 -10 V-21 H10 V-10`:`M-24 -10 Q0 -31 24 -10`,null,gold,4)+p(`M-24 0 H24 M-3 -4 H3 V7 H-3 Z`,null,gold,2);
    case `skull`:return p(`M-17 13 C-32 -23 31 -27 19 11 L12 13 V24 H-11 V13 Z`,paper,ink,2)+dot(-8,0,5,ink)+dot(9,0,5,ink)+p(`M0 6 L4 12 H-4 Z M-6 17 V23 M2 17 V23`,ink,ink,1);
    case `crown`:return p(`M-25 10 L-28 -17 L-12 -5 L0 -25 L12 -5 L28 -17 L25 10 Z`,gold)+p(`M-23 16 H23`,null,ink,3);
    case `fan`:case `bloodfan`:return p(`M0 23 L-31 -9 Q0 -38 31 -9 Z`,prop===`bloodfan`?paper:c,ink,1.8)+p(`M0 23 L-17 -18 M0 23 V-24 M0 23 L17 -18`,null,gold,2)+(prop===`bloodfan`?p(`M2 -20 L15 -13 L10 1 L2 -4 Z`,`#9c2f2f`):``);
    case `dagger`:case `sword`:case `blade`:return p(prop===`dagger`?`M0 -33 L8 8 H-8 Z`:`M0 -52 L6 -39 L5 10 H-5 L-6 -39 Z`,paper,ink,1.5)+p(`M-15 12 H15 M0 12 V33`,null,gold,5);
    case `staff`:return p(`M0 -46 V65`,null,gold,5)+dot(0,-47,7,c);
    case `candle`:case `torch`:return p(`M-6 -13 H6 V28 H-6 Z`,prop===`candle`?paper:gold)+p(`M0 -14 Q-15 -31 0 -46 Q16 -28 0 -14 Z`,`#9c2f2f`)+p(`M-14 30 H14`,null,ink,3);
    case `flower`:return p(`M0 4 L-6 37 M-3 23 Q-24 9 -14 31 Z`,null,`#3d4a34`,3)+dot(0,-12,8,c)+dot(-11,-1,8,c)+dot(11,-1,8,c)+dot(0,9,8,c)+dot(0,-1,5,gold);
    case `cup`:case `bowl`:return p(prop===`cup`?`M-16 -16 H13 V6 Q-1 28 -16 6 Z`:`M-27 -8 H27 Q19 22 0 22 Q-19 22 -27 -8 Z`,paper,ink,2.5)+(prop===`cup`?p(`M13 -10 Q36 -11 27 5 L13 9`,null,ink,3):``);
    case `bottle`:return p(`M-7 -23 H7 V-12 L15 -4 V23 H-15 V-4 L-7 -12 Z`,paper,ink,2)+p(`M-9 -26 H9 V-19 H-9 Z`,ink)+p(`M-10 1 H10 V13 H-10 Z`,c)+p(`M-7 7 H7`,null,gold,2);
    case `mask`:return p(`M-23 -22 Q0 -29 23 -22 L18 10 Q0 37 -18 10 Z`,paper,ink,2)+p(`M-16 -6 L-4 -4 M4 -4 L16 -6 M-8 12 Q0 4 8 12`,null,ink,3);
    case `key`:return p(`M-4 0 H31 M17 0 V13 M27 0 V10`,null,gold,5)+`<circle cx="-14" cy="0" r="12" fill="none" stroke="${gold}" stroke-width="5"/>`;
    case `scales`:return p(`M0 -29 V35 M-28 -21 H28 M-28 -21 L-40 7 H-16 Z M28 -21 L16 7 H40 Z M-17 35 H17`,null,gold,3)+dot(0,-31,4,ink);
    case `chain`:return [0,1,2,3].map(i=>`<ellipse cx="${i%2?3:-3}" cy="${i*16-20}" rx="8" ry="12" fill="none" stroke="${gold}" stroke-width="4"/>`).join(``);
    case `rope`:return p(`M0 -30 Q-24 -18 -8 0 Q15 16 3 32 L-9 48 M0 -30 Q23 -17 5 -1 Q-17 14 3 32`,null,gold,4);
    case `lantern`:return p(`M-11 -22 Q0 -40 11 -22 M-17 -20 H17 L23 13 L14 28 H-14 L-23 13 Z`,paper,gold,3)+p(`M-17 -20 H17 M-15 28 H15 M0 29 V42 M-7 -17 V25 M7 -17 V25`,null,c,3);
    case `umbrella`:return p(`M-40 -8 Q0 -64 40 -8 L26 -12 L13 -6 L0 -12 L-13 -6 L-26 -12 Z`,c)+p(`M0 -42 V44 Q0 57 -10 50`,null,gold,3);
    case `violin`:return p(`M-4 -35 H4 V-8 Q23 -15 18 0 Q9 6 21 17 Q28 38 0 38 Q-28 38 -21 17 Q-9 6 -18 0 Q-23 -15 -4 -8 Z`,c,ink,2)+p(`M0 -32 V31 M-9 7 L-9 20 M9 7 V20 M28 -34 L16 42`,null,gold,2);
    case `broom`:return p(`M0 -42 V24`,null,gold,5)+p(`M-10 18 H10 L25 53 H-25 Z`,c)+p(`M-6 24 L-11 48 M0 24 V49 M6 24 L11 48`,null,gold,2);
    case `hammer`:return p(`M0 -15 V42`,null,gold,7)+p(`M-22 -27 H22 V-8 H-22 Z`,ink);
    case `bell`:return p(`M-19 12 Q-11 -3 -11 -17 Q0 -33 11 -17 Q11 -3 19 12 Z`,gold)+p(`M-25 15 H25`,null,ink,4)+dot(0,22,5,gold);
    case `mirror`:return `<ellipse cx="0" cy="-10" rx="21" ry="27" fill="${paper}" stroke="${gold}" stroke-width="5"/>`+p(`M0 17 V42`,null,gold,7)+p(`M-9 -18 L8 -6`,null,`#a9bab9`,3);
    case `telescope`:return p(`M-30 3 L21 -25 L31 -7 L-20 22 Z`,gold,ink,2)+p(`M-29 3 L-20 21 M16 -22 L26 -5`,null,paper,5);
    case `globe`:return `<circle cx="0" cy="-6" r="25" fill="${paper}" stroke="${gold}" stroke-width="3"/>`+p(`M-20 -20 L-2 -12 L-7 1 L8 8 L4 18 M8 -27 L15 -11 L10 -2 L23 5`,null,c,5)+p(`M0 19 V34 M-18 35 H18`,null,gold,4);
    case `quill`:return p(`M-10 32 L8 -31 Q37 -43 20 -5 L-3 18 Z`,paper,ink,1.5)+p(`M-12 39 L16 -26`,null,gold,2.5);
    case `drum`:return p(`M-25 -13 H25 V22 Q0 35 -25 22 Z`,c,ink,2)+`<ellipse cx="0" cy="-13" rx="25" ry="9" fill="${paper}" stroke="${gold}" stroke-width="2"/>`+p(`M-23 -7 L-12 24 L0 -5 L12 24 L23 -7 M-22 -31 L12 -18 M22 -31 L-12 -18`,null,gold,3);
    case `towel`:return p(`M-21 -22 H18 L24 31 L10 24 L-1 32 L-12 25 L-23 31 Z`,paper)+p(`M-16 -11 H14 M-15 -4 H14`,null,gold,2);
    case `handkerchief`:return p(`M-23 -21 L21 -25 L27 20 L-19 25 Z`,paper)+p(`M-18 -16 L16 -19 L21 15 L-14 19 Z`,null,c,2)+p(`M-10 -6 L-4 -11 L2 -6 L-4 0 Z M8 7 L13 2 L18 7 L13 12 Z`,c);
    case `glasses`:return `<circle cx="-15" cy="0" r="13" fill="none" stroke="${ink}" stroke-width="3"/><circle cx="15" cy="0" r="13" fill="none" stroke="${ink}" stroke-width="3"/>`+p(`M-2 0 H2 M-28 -2 L-37 -11 M28 -2 L37 -11`,null,ink,3);
    case `bundle`:return p(`M-27 2 Q-25 -16 -9 -15 L23 -1 Q33 6 25 22 Q15 32 -4 22 Z`,paper)+dot(-14,-8,9,`#f3d2b8`)+p(`M-5 -10 L-12 18 M4 -6 L-3 22 M-23 4 L16 13`,null,gold,2)+dot(-17,-9,1.3,ink)+dot(-10,-7,1.3,ink);
    case `axe`:return p(`M-7 -37 L4 47`,null,gold,6)+p(`M-8 -31 Q12 -44 30 -29 L26 -9 Q10 -2 -6 -13 Z`,paper,ink,2);
    case `pistol`:return p(`M-29 -13 H24 V-6 H32 V3 H6 L-3 28 H-17 L-13 3 H-29 Z`,ink)+p(`M-8 5 H7 Q10 19 -5 16 Z`,null,gold,2);
    case `cane`:return p(`M-13 -29 Q-12 -44 0 -43 Q13 -42 11 -27 L4 53`,null,gold,5);
    case `coin`:return `<circle cx="0" cy="0" r="23" fill="${gold}"/><circle cx="0" cy="0" r="16" fill="none" stroke="${ink}" stroke-width="2"/>`+p(`M-4 -6 H5 V6 H-4 Z`,ink);
    case `ladder`:return p(`M-21 -48 V54 M21 -48 V54 M-21 -34 H21 M-21 -12 H21 M-21 10 H21 M-21 32 H21`,null,gold,5);
    case `map`:return p(`M-32 -17 L-11 -24 L11 -15 L32 -22 V24 L11 31 L-11 22 L-32 29 Z`,paper,ink,1.5)+p(`M-11 -22 V21 M11 -14 V30`,null,gold,2)+p(`M-28 7 L-18 2 L-8 9 L4 -2 L16 5 L26 -5`,null,c,3)+dot(4,-2,4,ink);
    case `bag`:return p(`M-14 -13 Q-22 -39 0 -39 Q22 -39 14 -13`,null,gold,4)+p(`M-23 -17 L23 -17 Q34 5 24 29 Q0 37 -24 29 Q-34 5 -23 -17 Z`,c)+p(`M-23 -13 H23 M0 -12 V31`,null,gold,2.5);
    case `whitecanvas`:return p(`M-31 -34 H31 V34 H-31 Z`,paper,gold,3)+p(`M-25 -28 H25 V28 H-25 Z`,`#fffcf8`)+p(`M-22 16 L20 -18 M-21 22 L23 -13`,null,`#f5f1e9`,2);
    case `verdict`:return p(`M-25 -28 H25 V28 L13 24 L1 29 L-10 24 L-25 28 Z`,paper)+p(`M-15 -15 H15 M-15 -6 H15 M-15 3 H7`,null,ink,2)+p(`M-13 14 L12 22 M-8 24 L12 12`,null,`#9c2f2f`,3);
    case `atom`:return p(`M-30 -29 H30 V30 H-30 Z`,paper,ink,2)+`<ellipse cx="0" cy="0" rx="22" ry="8" fill="none" stroke="${gold}" stroke-width="2"/><ellipse cx="0" cy="0" rx="22" ry="8" fill="none" stroke="${gold}" stroke-width="2" transform="rotate(60)"/><ellipse cx="0" cy="0" rx="22" ry="8" fill="none" stroke="${gold}" stroke-width="2" transform="rotate(-60)"/>`+dot(0,0,4,c);
    case `jester`:return p(`M0 28 V-6`,null,gold,4)+dot(0,-15,12,paper)+p(`M-12 -15 L-24 -33 L-3 -25 L7 -40 L12 -20 L26 -26 L15 -7 Z`,c)+dot(-23,-32,4,gold)+dot(7,-40,4,gold)+dot(26,-26,4,gold);
    case `chop`:return p(`M-21 -17 H21 V24 H-21 Z`,c)+p(`M-12 -6 H12 M-12 12 H12 M0 -13 V19`,null,gold,3);
    case `hat`:return `<ellipse cx="0" cy="12" rx="30" ry="8" fill="${ink}"/>`+p(`M-19 10 Q-21 -28 0 -26 Q21 -28 19 10 Z`,ink)+p(`M-19 4 H19`,null,gold,4);
    case `bird`:return p(`M-2 8 Q-27 -23 -36 -14 L-23 8 L-7 17 L0 25 L7 17 L23 8 L36 -14 Q27 -23 2 8 Z`,paper,ink,1.5)+p(`M0 10 L9 7 L2 16 Z`,gold);
    case `bulb`:return `<circle cx="0" cy="-8" r="22" fill="#f1dfad"/>`+p(`M-9 10 H9 V27 H-9 Z`,ink)+p(`M-5 9 L-9 -10 M5 9 L9 -10 M-15 -31 L-20 -40 M15 -31 L20 -40`,null,gold,3);
    case `unicorn`:return p(`M-23 11 H6 L14 -12 L22 -8 L23 13 L15 15 L12 31 H4 L4 18 H-12 L-16 31 H-23 Z M14 -12 L16 -31 L21 -10 Z`,paper,ink,2);
    case `wagon`:return p(`M-25 -13 H25 L21 17 H-21 Z`,c)+p(`M-25 -3 H25 M25 -9 L42 -25`,null,gold,4)+dot(-15,26,9,ink)+dot(15,26,9,ink);
    case `boot`:return p(`M-12 -28 H9 V5 L27 16 V28 H-22 V14 L-12 3 Z`,ink)+p(`M-13 -20 H9`,null,gold,3);
    case `cloak`:return p(`M-17 -24 L17 -24 L30 30 L0 22 L-30 30 Z`,c)+p(`M-14 -22 Q0 -9 14 -22`,null,gold,3);
    case `dirt`:return p(`M-27 17 L-15 5 L-5 11 L4 1 L18 8 L29 20 Z`,`#7a5a3a`);
    case `snow`:return p(`M-18 -13 V9 M-28 -8 L-8 4 M-28 4 L-8 -8 M18 5 V27 M8 10 L28 22 M8 22 L28 10`,null,paper,3);
    case `smoke`:return p(`M-20 8 H10`,null,paper,5)+p(`M10 8 H18`,null,c,5)+p(`M20 0 Q5 -10 21 -21 Q33 -31 20 -40`,null,`#a9a397`,3);
    case `pin`:case `ribbon`:return p(`M0 -3 L-26 -20 L-24 10 Z M0 -3 L26 -20 L24 10 Z M-4 3 L-11 33 L2 23 L10 33 L6 3 Z`,c)+dot(0,0,5,gold);
    case `whisper`:return p(`M-12 4 Q-19 -21 -7 -24 L2 -3 L16 -10 L23 5 L6 20 Z`,paper);
    default:return ``;
  }
}

function figBodyV39(e){
  e=e||{};
  const requested=e.fig||(typeof figTypeOf===`function`?figTypeOf(e):`lipao`);
  const type=FIGURE_FEATURES_V39[requested]?requested:`lipao`;
  const pose=FIGURE_POSES_V39.includes(e.pose)?e.pose:FIGURE_FEATURES_V39[type].pose;
  const c=e.cloth||`#3a3a48`,ink=typeof L===`string`?L:`#1c1916`,paper=`#efe6d4`,gold=typeof z===`string`?z:`#c6a15a`;
  const skin=typeof pt!==`undefined`?(pt[e.skin]||pt.fair):`#e8c4a0`;
  let body=figV39Clothes(type,c,pose,ink,paper,gold,e);
  const rgb=/^#[0-9a-f]{6}$/i.test(c)?[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)):[];
  if(rgb.length&&rgb.reduce((a,b)=>a+b,0)/3>205)body=`<g stroke="${ink}" stroke-width="1.5" stroke-linejoin="round">${body}</g>`;
  if(type!==`zuozi`&&type!==`goulou`)body+=figV39Arms({...e,fig:type},c,pose,skin)+figV39Costume(e.costume,type,c,paper,gold,ink);
  else if(type===`zuozi`&&FIGURE_POSES_V39.indexOf(pose)>=8)body+=`<g transform="translate(0 17)">${figV39Arms({...e,fig:type},c,pose,skin)}</g>`;
  else if(type===`zuozi`){
    const folded=pose===`fold`,guarded=pose===`guard`;
    body+=figV39Path(folded?`M-19 75 L-28 94 M19 75 L28 94`:guarded?`M-19 75 L-31 98 M19 75 L34 90`:`M-19 75 L-30 100 M19 75 L30 100`,null,c,7);
    body+=figV39Path(folded?`M-28 94 L17 105 M28 94 L-17 101`:guarded?`M-31 98 L-8 105 M34 90 L17 66`:`M-30 100 L-8 105 M30 100 L8 105`,null,skin,4.5);
    const hands=folded?[[17,105],[-17,101]]:guarded?[[-8,105],[17,66]]:[[-8,105],[8,105]];
    body+=hands.map(([x,y])=>figV39Circle(x,y,3.4,skin)).join(``);
  }
  else if(type===`goulou`&&e.propMode&&pose!==`bow`)body+=`<g transform="translate(12 14) scale(.85)">${figV39Costume(e.costume,type,c,paper,gold,ink)}${figV39Arms(e,c,pose,skin)}</g>`;
  else body+=figV39Path(`M12 75 L30 92 L45 88`,null,c,7)+figV39Circle(45,88,3.4,skin);
  const head=type===`zuozi`?[0,45,1]:type===`goulou`?[14,42,.95]:pose===`bow`?[0,34,1]:[0,28,1];
  body+=figHead({...e,head:e.head===`broken-crown`?`white`:e.head,face:e.face===`blind`?`tired`:e.face},...head);
  if(e.head===`broken-crown`)body+=`<g transform="translate(${head[0]} ${head[1]}) scale(${head[2]})">${figV39Path(`M-21 -10 L-24 -27 L-10 -17 L-4 -31 L2 -18 L7 -24 L11 -17 L22 -23 L19 -7 L4 -10 L1 -20 L-4 -10 Z`,gold)}</g>`;
  if(e.face===`blind`)body+=`<g transform="translate(${head[0]} ${head[1]}) scale(${head[2]})">${figV39Path(`M-18 -7 L18 -5 L18 4 L-18 2 Z`,paper)}${figV39Path(`M-18 -3 L18 0`,null,ink,2)}</g>`;
  const object=e.propMode===`emblem`?``:figV39Object(e.prop,c,ink,paper,gold);
  if(object){
    let anchor=e.prop===`staff`?[45,92,.9]:pose===`hold`?[0,type===`zuozi`?110:97,.8]:pose===`raise`?[48,32,.68]:pose===`reach`?[57,80,.7]:[40,103,.8];
    if(e.propMode===`held`){
      const hands={stand:[27,107],step:[47,68],reach:[61,76],raise:[46,27],guard:[5,99],hold:[0,97],fold:[-7,92],bow:[16,113],offer:[58,65],clutch:[-3,74],refuse:[48,59],listen:[-17,106],point:[64,45],conceal:[14,111],open:[62,58],stride:[50,100]};
      const hand=type===`goulou`?(pose!==`bow`?[12+hands[pose][0]*.85,14+hands[pose][1]*.85]:[45,88]):type===`zuozi`?(FIGURE_POSES_V39.indexOf(pose)>=8?[hands[pose][0],hands[pose][1]+17]:pose===`guard`?[17,66]:pose===`fold`?[-17,101]:[8,105]):hands[pose];
      const grip={cup:[23,0],case:[0,-21],bag:[0,-34],lantern:[0,-30],dagger:[0,23],sword:[0,23],blade:[0,23],fan:[0,23],bloodfan:[0,23],quill:[-10,32],candle:[0,18],torch:[0,18],flower:[-4,28],hammer:[0,24],mirror:[0,28],cane:[0,-32],umbrella:[0,27],key:[-14,0],jester:[0,18]}[e.prop]||[0,8];
      const s=(e.prop===`staff`?Math.min(.9,(157-hand[1])/65):.72)*(pose===`raise`?.8:1);
      anchor=e.prop===`staff`?[hand[0],hand[1],s]:[hand[0]-grip[0]*s,hand[1]-grip[1]*s,s];
    }
    const raised=e.propMode===`held`&&(pose===`raise`||(['dagger','sword','blade'].includes(e.prop)&&['clutch','guard','hold','fold'].includes(pose)));
    const pivot=e.prop===`staff`?[0,0]:['fan','bloodfan','dagger','sword','blade'].includes(e.prop)?[0,23]:e.prop===`mirror`?[0,28]:[0,8];
    body+=`<g data-figure-prop="${e.prop}" transform="translate(${anchor[0]} ${anchor[1]}) scale(${anchor[2]})${raised?` rotate(45 ${pivot[0]} ${pivot[1]})`:``}">${object}</g>`;
  }
  if(e.lean)body=`<g transform="rotate(${Math.max(-6,Math.min(6,e.lean))} 0 156)">${body}</g>`;
  if(e.kid)body=`<g transform="translate(0 34) scale(.78)">${body}</g>`;
  return `<g data-figure-v39="${type}" data-pose="${pose}" data-costume="${e.costume||'plain'}">${body}</g>`;
}

function figParadeV50(rec){
  const figure=figBodyV39(rec);
  if(rec.propMode!==`emblem`||rec.prop===`none`)return figure;
  const emblem=figV39Object(rec.prop,rec.cloth,L,`#efe6d4`,z);
  return `<g transform="translate(-11 4) scale(.96)">${figure}</g><g transform="translate(56 83) scale(.59)"><g class="parade-emblem">${emblem}</g></g>`;
}

if(typeof module!==`undefined`&&module.exports)module.exports={figBodyV39,figV39Object,FIGURE_FEATURES_V39,FIGURE_POSES_V39,FIGURE_COSTUMES_V39};
