function copySentenceV39(text) {
  const value = String(text || '').trim();
  return value && !/[。！？][”’」』"]?$/.test(value) ? `${value.replace(/[；，]+$/, '')}。` : value;
}

function stageSentenceV39(text) {
  return copySentenceV39(String(text || '').replace(/^排演时[，,：:]\s*/, ''));
}

function roleLabelV39(card) {
  return `${card.name}${card.sourcePlayLabel ? `（出自 ${card.sourcePlayLabel}）` : ''}`;
}

function talkCardsV39(cards) {
  const byDimension = Object.fromEntries(cards.map(card => [card.dimension, card]));
  return {
    play: byDimension['剧目'], style: byDimension['风格体系'], method: byDimension['导演手法'],
    lead: byDimension['主演'], support: byDimension['配角'], place: byDimension['环境'],
  };
}

function shortScene(cards) {
  const { play, style, method, lead, support, place } = talkCardsV39(cards);
  const cast = support ? `${roleLabelV39(lead)}与${roleLabelV39(support)}` : roleLabelV39(lead);
  return `排演设想：以《${play.name}》为底本，让${cast}在${place.name}登场。${stageSentenceV39(method.stage)}${stageSentenceV39(style.stage)}`;
}

function nn(cards) {
  const { play, style, method, lead, support, place } = talkCardsV39(cards);
  let people = `主演 ${roleLabelV39(lead)}：${copySentenceV39(lead.note)}`;
  if (support) {
    people += `配角 ${roleLabelV39(support)}：${copySentenceV39(support.note)}`;
    const sameWork = (lead.workIds || []).some(id => (support.workIds || []).includes(id));
    people += sameWork
      ? '两人有已确认的同作关系，可以先从原作关系排起。'
      : '保留两人各自的来历，再为这次同台安排相遇的理由。';
  }
  return [
    `底本《${play.name}》：${copySentenceV39(play.plot || play.note)}`,
    people,
    `空间 ${place.name}：${copySentenceV39(place.note)}排演可试：${stageSentenceV39(place.stage)}`,
    `演法 ${style.name}：${copySentenceV39(style.note)}手段 ${method.name}：${copySentenceV39(method.note)}组合练习：${stageSentenceV39(style.stage)}${stageSentenceV39(method.stage)}`,
  ];
}

function fiveTalk(cards) { return nn(cards); }

if (typeof module !== 'undefined' && module.exports) module.exports = { copySentenceV39, stageSentenceV39, shortScene, nn, fiveTalk };
