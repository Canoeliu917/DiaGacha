const fs = require('node:fs');
const path = require('node:path');
const groups = ['craft', 'plays', 'roles'];
const read = name => JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
const expanded = ['craft', 'plays', 'roles', 'spaces'].map(group => `high-star-${group}-v43.json`).filter(name => fs.existsSync(path.join(__dirname, name)));
const copy = Object.assign({}, ...groups.map(group => read(`high-star-${group}-v40.json`)), ...expanded.map(read));
const sources = Object.assign({}, ...groups.map(group => {
  const name = `high-star-${group}-sources-v40.json`;
  return fs.existsSync(path.join(__dirname, name)) ? read(name) : {};
}));
const anchors = read('../docs/SCORING_ANCHORS.json');
for (const card of anchors.cards) {
  const refs = [...(sources[card.id] || []), ...card.sourceIds.map(id => anchors.sources[id])];
  sources[card.id] = [...new Map(refs.map(source => [source.url, source])).values()];
}
const output = `// Generated from high-star-*-v40.json, high-star-*-v43.json and SCORING_ANCHORS.json. Edit the sources, then rebuild.
const highStarCopyV40 = ${JSON.stringify(copy, null, 2)};
const highStarSourceDataV40 = ${JSON.stringify(sources, null, 2)};

function highStarSentencesV40(text) {
  return (String(text || '').match(/[^。！？!?]+(?:[。！？!?]+[”’」』）)]*|$)/g) || []).map(sentence => sentence.trim()).filter(Boolean);
}

function highStarNotesV40(card) {
  if (!card || !['SSR', 'UR', 'LR'].includes(card.rarity)) return [];
  const known = new Set([...highStarSentencesV40(card.note || card.blurb), ...highStarSentencesV40(card.observe || card.why)]);
  const stored = highStarCopyV40[card.id];
  const legacy = typeof cardEssays === 'undefined' ? '' : cardEssays[card.id];
  return (stored || (legacy ? [legacy] : [])).map(paragraph => highStarSentencesV40(paragraph).filter(sentence => {
    if (known.has(sentence)) return false;
    known.add(sentence);
    return true;
  }).join('')).filter(Boolean);
}

function highStarSourcesV40(card) {
  return (highStarSourceDataV40[card?.id] || []).map(source => ({ ...source }));
}

if (typeof module !== 'undefined' && module.exports) module.exports = { highStarNotesV40, highStarSourcesV40, highStarSentencesV40 };
`;
fs.writeFileSync(path.join(__dirname, 'high-star-copy-v40.js'), output);
console.log(`Built high-star copy for ${Object.keys(copy).length} cards.`);
