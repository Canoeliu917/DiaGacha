function preambleLines(card) {
  const count = { SSR: 2, UR: 3, LR: 4 }[card?.rarity] || 0;
  if (!count) return [];
  const sentences = text => (String(text || '').match(/[^。！？!?\n]+[。！？!?]+[”’」』）)]*|[^。！？!?\n]+$/g) || [])
    .map(line => line.trim()).filter(Boolean).map(line => /[。！？!?][”’」』）)]*$/.test(line) ? line : `${line}。`);
  const expanded = typeof highStarNotesV40 === 'function' ? highStarNotesV40(card) : [];
  const sources = [card.note, card.observe, ...expanded, card.stage, card.blurb,
    typeof cardEssays === 'undefined' ? '' : cardEssays[card.id]].map(sentences);
  const ordered = [...sources.map(lines => lines[0]), ...sources.flatMap(lines => lines.slice(1))].filter(Boolean);
  if (card.tags?.length) ordered.push(`${card.name}的排演关键词是${card.tags.map(tag => `「${tag}」`).join('、')}。`);
  return [...new Set(ordered)].slice(0, count);
}

function revealProfileV40(rarity, reduced = false) {
  const level = { SSR: 1, UR: 2, LR: 3 }[rarity] || 0;
  return { level, lines: level ? level + 1 : 0, waves: reduced ? 0 : level,
    shake: !reduced && level > 0, charge: reduced ? 0 : ({ C: 0, UC: 40, R: 80, SR: 180 }[rarity] || 240) };
}

var revealTimersV40 = new Set(), revealCleanupV40 = null;
function revealLinesMarkupV40(card,shown=false){
  return preambleLines(card).map((line,i)=>`<p class="pre-line"${shown?'':' hidden'}><span class="reveal-line-label">${['这一张','看点','细读','再看一层'][i]}</span>${K(line)}</p>`).join('');
}
function restoreRevealIntroV40(){
  const booster=Y.booster,card=booster?.cards?.[booster.index];
  if(Y.view!=='pack'||booster?.phase!=='card'||!booster.revealDone||!card)return;
  const host=document.querySelector('.pack-preamble'),zone=document.querySelector('.pack-zone');
  if(!host||!zone)return;
  host.className='pack-preamble reveal-intro-v40';
  host.hidden=!preambleLines(card).length;
  host.innerHTML=revealLinesMarkupV40(card,true);
  zone.insertAdjacentElement('afterend',host);
}
function revealClearV40() {
  revealTimersV40.forEach(id => window.clearTimeout(id));
  revealTimersV40.clear();
  if (revealCleanupV40) revealCleanupV40();
  revealCleanupV40 = null;
}

function $() {
  revealClearV40();
  const booster = Y.booster, card = booster?.cards?.[booster.index];
  if (!card || booster.phase !== 'card' || booster.revealDone) return;
  const run = X, index = booster.index;
  const zone = document.querySelector('.pack-zone'), flip = zone?.querySelector('.flip');
  const host = document.querySelector('.pack-preamble');
  if (!zone || !flip) return;
  const reduced = J || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const profile = revealProfileV40(card.rarity, reduced), lines = preambleLines(card);
  const skip = !!booster.skipPreamble;
  booster.skipPreamble = false;
  const current = () => run === X && Y.booster === booster && booster.phase === 'card' && booster.index === index;
  const later = (fn, delay) => {
    const id = window.setTimeout(() => {
      revealTimersV40.delete(id);
      if (current()) fn();
    }, delay);
    revealTimersV40.add(id);
  };
  let paper = null, effects = null;
  revealCleanupV40 = () => {
    paper?.remove(); effects?.remove();
    flip.classList.remove('is-reveal-climax', 'is-charging');
    zone.classList.remove('is-preamble', 'is-waiting', `wait-${card.rarity}`);
  };
  zone.classList.add('reveal-zone-v40');
  flip.classList.add('reveal-v40', `rarity-${card.rarity}`);
  flip.style.setProperty('--reveal-strength', String(profile.level || 1));
  if (host) {
    host.className = 'pack-preamble reveal-intro-v40';
    host.removeAttribute('style');
    host.removeAttribute('data-rows');
    host.setAttribute('aria-label', `${card.name}，开场小注`);
    host.setAttribute('aria-live', 'polite');
    host.innerHTML = revealLinesMarkupV40(card);
    zone.insertAdjacentElement('afterend', host);
    host.hidden = !lines.length;
  }
  const showLine = i => {
    const line = host?.querySelectorAll('.pre-line')[i];
    if (line) { line.hidden = false; line.classList.add('is-on'); }
  };
  const showAllLines = () => lines.forEach((_, i) => showLine(i));
  const finish = () => {
    booster.revealDone = true;
    if (!reduced && !skip) Oe(card.rarity);
    if (booster.index >= booster.cards.length - 1) later(() => {
      if (!window.__dgNoSpread) enterSpread();
    }, reduced ? 120 : 1000);
  };
  const showCard = () => {
    flip.classList.remove('is-charging', 'no-anim');
    flip.classList.add('is-flipped', 'is-type-rarity', 'is-type-name');
  };
  if (reduced || skip) {
    flip.classList.add('no-anim');
    showCard();
    flip.classList.add('no-anim');
    showAllLines();
    finish();
    return;
  }
  De(card.rarity);
  if (!profile.level || !lines.length) {
    flip.classList.add('is-charging');
    later(showCard, profile.charge);
    later(finish, profile.charge + 460);
    return;
  }
  flip.classList.add('is-flipped', 'no-anim');
  paper = document.createElement('div');
  paper.className = 'reveal-paper-v40';
  paper.setAttribute('aria-hidden', 'true');
  paper.innerHTML = '<i class="reveal-sheet-left"></i><i class="reveal-sheet-right"></i>';
  flip.appendChild(paper);
  const climax = () => {
    showCard();
    effects = document.createElement('div');
    effects.className = 'reveal-effects-v40';
    effects.setAttribute('aria-hidden', 'true');
    const cracks = ['M150 211 133 174 147 149 118 107 126 67 103 0', 'M150 211 183 185 192 142 226 117 239 70 300 42', 'M150 211 115 232 105 270 62 289 49 338 0 367', 'M150 211 178 250 167 283 198 325 186 366 210 423', 'M150 211 207 216 232 247 266 252 300 283'];
    effects.innerHTML = `<i class="reveal-flare-v40"></i><svg class="reveal-cracks-v40" viewBox="0 0 300 423" preserveAspectRatio="none">${cracks.slice(0, profile.level + 2).map((path, i) => `<path d="${path}" pathLength="1" style="--crack-delay:${i * 35}ms"/>`).join('')}</svg>${Array.from({ length: profile.waves }, (_, i) => `<i class="reveal-wave-v40" style="--wave-delay:${i * 180}ms"></i>`).join('')}`;
    flip.appendChild(effects);
    flip.classList.add('is-reveal-climax');
    paper.classList.add('is-torn');
    later(() => { paper.remove(); flip.classList.remove('is-reveal-climax'); }, 780);
    later(() => effects.remove(), 1550);
    later(finish, 900);
  };
  let step = 0;
  const nextLine = () => {
    showLine(step);
    paper.style.setProperty('--reveal-cut', `${Math.round((step + 1) / (lines.length + 1) * 76)}%`);
    step += 1;
    if (window.__dgHoldAfter != null && step >= window.__dgHoldAfter) return;
    const readTime = Math.min(2400, Math.max(1500, lines[step - 1].length * 36));
    later(step < lines.length ? nextLine : climax, readTime);
  };
  later(nextLine, 100);
}
