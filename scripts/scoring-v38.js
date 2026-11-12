const DiaScoring = (() => {
  const WEIGHTS = { 剧目: 22, 风格体系: 14, 导演手法: 16, 主演: 20, 配角: 16, 环境: 12 };
  // Each row is the bonus for two through six distinct cards of the same rarity.
  const RESONANCE = {
    C: [1, 2, 3, 4, 5], UC: [1, 2, 3, 4, 5], R: [2, 3, 4, 5, 6], SR: [2, 3, 4, 5, 6],
    SSR: [3, 4, 5, 6, 7], UR: [3, 4, 5, 6, 7], LR: [4, 5, 6, 7, 7],
  };
  const CREWS = {
    C: ['草台班子', '一张桌、一盏灯，也能热热闹闹开场。'],
    UC: ['街坊剧社', '街坊来搭把手，好戏就在家门口。'],
    R: ['小剧场班底', '舞台虽小，每个人都有一束光。'],
    SR: ['巡演剧团', '带上默契，把好戏演到下一站。'],
    SSR: ['名角同台', '各有拿手好戏，也愿为彼此搭台。'],
    UR: ['殿堂剧团', '把千锤百炼的功夫，放进今晚这一场。'],
    LR: ['传奇剧组', '难得相逢，一起留下值得回味的一夜。'],
  };
  const BOND_RULES = [
    ['play-lead', '剧目与主角同作', '剧目', '主演', 3],
    ['play-support', '剧目与配角同作', '剧目', '配角', 2],
    ['lead-support', '主角与配角同作', '主演', '配角', 1],
    ['play-place', '剧目与空间同作', '剧目', '环境', 1],
  ];

  function cardScore(card) {
    if (!card || ![card.atk, card.def].every(value => Number.isFinite(value) && value >= 0 && value <= 100)) {
      throw new RangeError('卡牌攻防必须是 0–100 的有限数值');
    }
    return Math.round(0.5 * card.atk + 0.5 * card.def);
  }

  function grade(score) {
    return score >= 90 ? '绝佳' : score >= 80 ? '出彩' : score >= 70 ? '成台' : score >= 60 ? '初成' : '待磨';
  }

  function production(cards, links = {}, compatible = false) {
    if (!Array.isArray(cards) || ![5, 6].includes(cards.length)) {
      throw new RangeError('一台戏必须包含五张或六张卡牌');
    }
    if (!links || typeof links !== 'object' || Array.isArray(links) || typeof compatible !== 'boolean') {
      throw new TypeError('来源映射必须是对象，演法手段兼容标记必须是布尔值');
    }
    const ids = new Set();
    const byDimension = new Map();
    const sources = new Map();
    for (const card of cards) {
      cardScore(card);
      if (typeof card.id !== 'string' || !card.id.trim() || ids.has(card.id)) {
        throw new TypeError('卡牌 id 不能为空或重复');
      }
      if (!Object.hasOwn(WEIGHTS, card.dimension) || byDimension.has(card.dimension)) {
        throw new TypeError('卡牌维度必须合法且不能重复');
      }
      if (!Object.hasOwn(RESONANCE, card.rarity)) {
        throw new TypeError('卡牌稀有度不合法');
      }
      const workIds = card.workIds ?? [];
      const link = Object.hasOwn(links, card.id) ? links[card.id] : [];
      const explicit = Array.isArray(link) ? link : link?.workIds;
      if (![workIds, explicit].every(values => Array.isArray(values) && values.every(value => typeof value === 'string' && value.trim()))) {
        throw new TypeError('明确来源必须是非空作品 id 的数组');
      }
      ids.add(card.id);
      byDimension.set(card.dimension, card);
      sources.set(card.id, new Set([...workIds, ...explicit]));
    }
    const dimensions = Object.keys(WEIGHTS).filter(dimension => cards.length === 6 || dimension !== '配角');
    if (dimensions.some(dimension => !byDimension.has(dimension))) {
      throw new TypeError('五卡旧局只能缺少配角，六卡局必须包含全部六维');
    }

    const weightTotal = dimensions.reduce((sum, dimension) => sum + WEIGHTS[dimension], 0);
    const contributions = dimensions.map(dimension => {
      const card = byDimension.get(dimension);
      const weight = WEIGHTS[dimension] / weightTotal;
      const score = cardScore(card);
      return { cardId: card.id, dimension, score, weight, contribution: score * weight };
    });
    const weightedMean = contributions.reduce((sum, item) => sum + item.score * WEIGHTS[item.dimension], 0) / weightTotal;
    const base = Math.round(weightedMean);

    const resonanceDetails = Object.entries(RESONANCE).flatMap(([rarity, bonuses]) => {
      const cardIds = cards.filter(card => card.rarity === rarity).map(card => card.id);
      if (cardIds.length < 2) return [];
      const points = bonuses[cardIds.length - 2];
      return [{ rarity, count: cardIds.length, points, cardIds }];
    });
    const resonance = Math.min(7, resonanceDetails.reduce((sum, item) => sum + item.points, 0));
    const largestGroup = resonanceDetails.reduce((best, group) => !best || group.count >= best.count ? group : best, null);
    const crew = largestGroup
      ? { title: CREWS[largestGroup.rarity][0], description: CREWS[largestGroup.rarity][1], rarity: largestGroup.rarity, count: largestGroup.count }
      : { title: '跨界剧组', description: '各有一招，一起开场。', rarity: null, count: 0 };

    const bondDetails = [];
    for (const [id, label, first, second, points] of BOND_RULES) {
      const a = byDimension.get(first);
      const b = byDimension.get(second);
      if (!a || !b) continue;
      const workIds = [...sources.get(a.id)].filter(workId => sources.get(b.id).has(workId));
      if (workIds.length) bondDetails.push({ id, label, points, cardIds: [a.id, b.id], workIds });
    }
    if (compatible) {
      bondDetails.push({
        id: 'style-method', label: '演法与手段明确兼容', points: 1,
        cardIds: [byDimension.get('风格体系').id, byDimension.get('导演手法').id], workIds: [],
      });
    }
    const bonds = Math.min(8, bondDetails.reduce((sum, item) => sum + item.points, 0));
    const score = Math.max(0, Math.min(100, base + resonance + bonds));
    return { score, base, weightedMean, resonance, bonds, grade: grade(score), crew, contributions, resonanceDetails, bondDetails };
  }

  return { cardScore, production };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = DiaScoring;
