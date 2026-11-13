/* Shared paper head: rear hair stays behind the face; fringes and hats clear the eyes. */
function figHead(e,x,y,sc,flip){
  const skin=pt[e.skin]||pt.fair,f=flip?` scale(-1,1)`:``;
  const tilt=e.headTilt?` rotate(${Math.max(-8,Math.min(8,e.headTilt))})`:``;
  return `<g transform="translate(${x} ${y}) scale(${sc||1})${f}${tilt}">${figHairBack(e)}<circle cx="0" cy="0" r="18" fill="${skin}"/>${figHair(e)}${figFace(e.face)}</g>`;
}
function figHairBack(e){
  const h=e.head||e.hair||`crop`,ink=L;
  switch(h){
    case`long`:return `<path d="M-16 -12 C-26 3 -22 46 -17 68 L-10 73 L-8 66 C-13 43 -17 15 -8 -12 Z M16 -12 C26 3 22 46 17 68 L10 73 L8 66 C13 43 17 15 8 -12 Z" fill="${ink}"/>`;
    case`wave`:return `<path d="M-16 -12 C-30 1 -17 16 -25 29 C-32 42 -16 52 -22 65 L-13 70 C-1 53 -18 42 -13 29 C-6 14 -15 2 -8 -12 Z M16 -12 C30 1 17 16 25 29 C32 42 16 52 22 65 L13 70 C1 53 18 42 13 29 C6 14 15 2 8 -12 Z" fill="${ink}"/>`;
    case`braid`:return `<path d="M19 -5 Q27 18 21 39 Q27 58 19 85" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`;
    case`queue`:return `<path d="M15 -8 H22 L20 70 H15 Z" fill="${ink}"/>`;
    case`bun`:return `<circle cx="0" cy="-22" r="8" fill="${ink}"/>`;
    case`topknot`:return `<ellipse cx="0" cy="-24" rx="7" ry="9" fill="${ink}"/>`;
    case`hood`:return `<path d="M-23 20 Q-31 -9 -17 -23 Q0 -36 17 -23 Q31 -9 23 20 L15 26 H-15 Z" fill="${ink}"/>`;
    case`wimple`:return `<path d="M-22 10 Q-24 -18 0 -24 Q24 -18 22 10 L16 26 H-16 Z" fill="#efe6d4" stroke="#d8c8a8" stroke-width="1.5"/>`;
    case`veil`:return `<path d="M-18 -12 Q0 -30 18 -12 L24 96 H16 L10 8 H-10 L-16 96 H-24 Z" fill="#efe6d4" opacity=".92"/>`;
    case`habit`:return `<path d="M-24 20 Q-26 -16 0 -28 Q26 -16 24 20 L18 28 H-18 Z" fill="${ink}"/>`;
    default:return ``;
  }
}
function figHair(e){
  const h=e.head||e.hair||`crop`,ink=L;
  const crop=`<path d="M-17 -6 Q0 -24 17 -6 Q0 -11 -17 -6" fill="${ink}"/>`;
  switch(h){
    case`long`:return `<path d="M-17 -7 Q0 -23 17 -7 L3 -12 L0 -17 L-3 -12 Z" fill="${ink}"/>`;
    case`wave`:return `<path d="M-17 -7 Q-18 -20 0 -19 Q16 -22 17 -7 Q7 -13 2 -8 Q-4 -17 -17 -7" fill="${ink}"/>`;
    case`bun`:case`braid`:case`topknot`:case`queue`:return `<path d="M-16 -7 Q0 -21 16 -7 Q0 -12 -16 -7" fill="${ink}"/>`;
    case`crop`:return crop;
    case`short`:return `<path d="M-17 -7 L-13 -16 L-5 -18 L-1 -23 L6 -19 L14 -17 L17 -7 L7 -11 L1 -9 L-6 -12 Z" fill="${ink}"/>`;
    case`bowl`:return `<path d="M-18 -7 Q-19 -25 0 -25 Q19 -25 18 -7 Z" fill="${ink}"/>`;
    case`sidepart`:return `<path d="M-16 -6 Q-2 -26 6 -12 Q16 -22 16 -6 Q4 -10 -16 -6" fill="${ink}"/>`;
    case`wild`:return `<path d="M-18 -6 L-26 -26 L-8 -12 L0 -30 L10 -12 L26 -24 L16 -6 Z" fill="${ink}"/>`;
    case`white`:return `<path d="M-17 -6 Q0 -24 17 -6 Q0 -11 -17 -6" fill="#d6d2c8" stroke="#89877f" stroke-width="1.1"/>`;
    case`bald`:return ``;
    case`bowler`:return `<ellipse cx="0" cy="-11" rx="22" ry="4" fill="${ink}"/><path d="M-14 -11 Q0 -31 14 -11 Z" fill="${ink}"/>`;
    case`cap`:return `<path d="M-20 -7 H20 L16 -19 H-16 Z M-8 -19 H8 V-25 H-8 Z" fill="${ink}"/>`;
    case`circlet`:return `<path d="M-15 -8 Q0 -18 15 -8" fill="none" stroke="${z}" stroke-width="3.2"/><circle cx="0" cy="-18" r="3.4" fill="${z}"/>`;
    case`laurel`:return `<path d="M-16 -7 Q-8 -23 0 -11 Q8 -23 16 -7" fill="none" stroke="#3d4a34" stroke-width="3.4"/><path d="M-16 -7 Q0 -19 16 -7" fill="${ink}"/>`;
    case`helmet`:return `<path d="M-19 -8 Q0 -32 19 -8 Z" fill="#4a4a48"/><path d="M-2 -30 V-10" stroke="${z}" stroke-width="3"/><path d="M-21 -8 H21" stroke="#2a2a28" stroke-width="3"/>`;
    case`hood`:case`habit`:return `<path d="M-20 -5 Q0 -31 20 -5 L16 -8 Q0 -24 -16 -8 Z" fill="${ink}"/>`;
    case`widehat`:return `<ellipse cx="0" cy="-11" rx="30" ry="5" fill="${ink}"/><path d="M-13 -12 Q0 -34 13 -12 Z" fill="${ink}"/>`;
    case`phoenix`:return `<path d="M-24 -13 L-8 -27 L0 -11 L8 -29 L24 -13 L8 -15 L0 -7 L-8 -15 Z" fill="${z}"/>${crop}`;
    case`ribbon`:return `${crop}<path d="M8 -15 L22 -23 L16 -7 Z" fill="${B}"/>`;
    case`military`:return `<path d="M-19 -17 H19 L15 -8 H-15 Z" fill="#2c3a28"/><path d="M-20 -7 H20" stroke="${ink}" stroke-width="2"/><circle cx="0" cy="-13" r="2.6" fill="${z}"/>`;
    case`wimple`:return `<path d="M-19 -7 Q0 -27 19 -7 L15 -9 Q0 -22 -15 -9 Z" fill="#efe6d4" stroke="#d8c8a8" stroke-width="1.5"/>`;
    case`veil`:return `<path d="M-16 -7 Q0 -21 16 -7 Q0 -12 -16 -7" fill="${ink}"/>`;
    case`turban`:return `<path d="M-20 -7 Q-22 -23 0 -29 Q22 -23 20 -7 Q0 -11 -20 -7" fill="${ink}"/><path d="M-16 -14 Q0 -26 16 -14" fill="none" stroke="#c6a15a" stroke-width="3"/>`;
    case`peaked`:return `<path d="M-18 -18 H18 L14 -8 H-14 Z" fill="${ink}"/><path d="M-22 -7 H22" stroke="${ink}" stroke-width="3"/><path d="M-8 -18 H8 V-26 H-8 Z" fill="#2a2a28"/>`;
    default:return crop;
  }
}

function figFace(face){const eye=`<circle cx="-6" cy="-1" r="2.2" fill="${L}"/><circle cx="6" cy="-1" r="2.2" fill="${L}"/>`;switch(face){case`beard`:return`${eye}<path d="M-3 8 Q0 9 3 8" fill="none" stroke="${V}" stroke-width="1.6" stroke-linecap="round"/><path d="M-6 13 L-4 19 L0 22 L4 19 L6 13 L2 14 L-2 14 Z" fill="${L}"/>`;case`smile`:return`${eye}<path d="M-4 8 Q0 10 4 8" fill="none" stroke="${V}" stroke-width="1.6" stroke-linecap="round"/>`;case`scream`:return`${eye}<ellipse cx="0" cy="9" rx="5" ry="7" fill="${L}"/>`;case`cold`:return`${eye}<path d="M-5 8 H5" stroke="${L}" stroke-width="2.2"/>`;case`tired`:return`${eye}<path d="M-10 3 H-3 M3 3 H10" stroke="${L}" stroke-width="1.8"/><path d="M-4 9 H4" stroke="${L}" stroke-width="2"/>`;case`sly`:return`<path d="M-10 -10 H-2 M2 -5 H10" stroke="${L}" stroke-width="2.4"/>${eye}<path d="M-3 8.5 Q1 9.5 4 8" fill="none" stroke="${V}" stroke-width="1.6" stroke-linecap="round"/>`;case`shy`:return`<circle cx="-11" cy="4" r="4" fill="${V}" opacity=".5"/><circle cx="11" cy="4" r="4" fill="${V}" opacity=".5"/><path d="M-8 -1 H-3 M3 -1 H8" stroke="${L}" stroke-width="2"/><ellipse cx="0" cy="9" rx="3.2" ry="1.8" fill="${V}"/>`;case`storm`:return`<path d="M-12 -8 H-1 M1 -8 H12" stroke="${L}" stroke-width="3.4" stroke-linecap="round"/>${eye}<ellipse cx="0" cy="9" rx="6" ry="2.4" fill="#4a1824"/>`;case`lips`:return`${eye}<ellipse cx="0" cy="9" rx="7" ry="3.2" fill="${V}"/>`;case`pale`:return`${eye}<ellipse cx="0" cy="9" rx="5.5" ry="2.4" fill="${V}"/>`;case`rouge`:return`<circle cx="-11" cy="4" r="4.5" fill="${V}" opacity=".55"/><circle cx="11" cy="4" r="4.5" fill="${V}" opacity=".55"/>${eye}<ellipse cx="0" cy="9" rx="5.5" ry="2.6" fill="${V}"/>`;case`blood`:return`${eye}<path d="M-12 -6 L12 8" stroke="${B}" stroke-width="5" stroke-linecap="round"/>`;case`whitepaint`:return`<circle cx="-10" cy="4" r="5" fill="${V}"/><circle cx="10" cy="4" r="5" fill="${V}"/>${eye}<ellipse cx="0" cy="9" rx="5.5" ry="2.8" fill="${B}"/>`;case`resolve`:return`<path d="M-10 -10 H-2 M2 -10 H10" stroke="${L}" stroke-width="2.6"/>${eye}<ellipse cx="0" cy="9" rx="5" ry="2.2" fill="${V}"/>`;case`wet`:return`${eye}<path d="M-12 -18 L-16 2 M12 -16 L16 4" stroke="#7ea0b8" stroke-width="2.6"/><ellipse cx="0" cy="9" rx="4" ry="2" fill="${V}"/>`;case`quiet`:return`${eye}<path d="M-3 8 H3" stroke="${V}" stroke-width="2"/>`;default:return`${eye}<path d="M-3 8 H3" stroke="${L}" stroke-width="1.8"/>`}}
