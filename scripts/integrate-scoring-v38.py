"""Install the scoring engine and its UI into the standalone HTML (idempotent)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / 'index.html'
html = path.read_text(encoding='utf-8')


def replace_once(old, new):
    global html
    assert html.count(old) == 1, (old[:80], html.count(old))
    html = html.replace(old, new, 1)


def replace_function(start, end, new):
    global html
    a = html.rindex(start)
    b = html.index(end, a + len(start))
    html = html[:a] + new + html[b:]


engine = (ROOT / 'scripts/scoring-v38.js').read_text(encoding='utf-8')
engine = engine.split("if (typeof module")[0]
ui = (ROOT / 'scripts/scoring-ui-v38.js').read_text(encoding='utf-8')
sources = json.loads((ROOT / 'docs/SCORING_ANCHORS.json').read_text(encoding='utf-8'))['sources']
block = '// SCORING_V38_START\n' + engine + '\nconst SCORING_SOURCES = ' + json.dumps(sources, ensure_ascii=False) + ';\n' + ui + '\n// SCORING_V38_END\n'
if '// SCORING_V38_START' in html:
    a = html.index('// SCORING_V38_START')
    b = html.index('// SCORING_V38_END', a) + len('// SCORING_V38_END\n')
    html = html[:a] + block + html[b:]
    path.write_text(html, encoding='utf-8')
    print('Refreshed embedded v38 engine, sources and UI.')
    raise SystemExit

replace_function('var ie={C:55,UC:64,R:73,SR:82,SSR:90,UR:96,LR:100};function T(e)', 'function ae()', block + 'function T(e){return DiaScoring.cardScore(e)}')
replace_function('function ae()', 'var oe=', 'function ae(){return "综合分＝ATK与DEF各占50%；星级和稀有度不重复计分。具体依据可展开查看。";}')
replace_function('function me()', 'function he(', 'function me(){return "星级与稀有度表示策展收藏档位，不直接抬高攻防。";}')
replace_function('function Xt(cards)', 'function pickScoredCard', '''function Xt(cards) {
  const scoring = productionScore(cards);
  const flags = new Set(scoring.bondDetails.map(item => item.id === 'style-method' ? 'unity' : 'home'));
  return {verdict:h(cards),title:an(cards),slots:Qt(cards),score:scoring.score,scoring,
    bonus:scoring.resonance+scoring.bonds,rules:[],marks:copyReview(cards,flags),
    paragraphs:nn(cards,flags).map(text=>[{text}])};
}
''')
replace_function('function pickScoredCard', 'function posterSealText', '''function pickScoredCard(cards,random){
  return cards[Math.min(cards.length-1,Math.floor(random()*cards.length))];
}
''')
replace_function('function on(e,t)', 'function K(e)', '')
replace_function('function Rn(e)', 'function zn(e', 'function Rn(e){return scoringHelp(e)}')
replace_once('${mn(e)}${_n(e)}${xn(e)}', '${mn(e)}${_n(e)}${cardReviewDetails(e)}${xn(e)}')
replace_once('分数综合经典地位、传唱度与这一桌的组合关系，仅作游戏参考。', 'v38：基础表现、同色共鸣与明确羁绊共同计分；具体分解见上方。分数是游戏编辑判断，不是文学作品排行榜。')
note_start = html.index('        <p class="score-weight-note">', html.index('function Un('))
note_end = html.index('</p>', note_start) + 4
html = html[:note_start] + '        ${scoreBreakdown(result.scoring,t)}' + html[note_end:]
replace_once('function copyFromPlay(card, play) { return card.note.includes(`《${play.name}》`) || (card.dimension === \'主演\' && (Ht[card.id] || []).includes(play.id)); }', 'function copyFromPlay(card, play) { return (card.workIds || []).includes(play.id); }')
# Explain the existing percentages as weights within the foundation.
replace_once('${copyDimension(cards[src].dimension)} · ${MINI_DISPLAY_PCT[i]}%', '${copyDimension(cards[src].dimension)} · 基础权重 ${MINI_DISPLAY_PCT[i]}%')
# A PNG cannot operate a disclosure: include details in long posters only.
poster_marker = "    if(mode===`short`){\n      poster.querySelector('.talk')?.remove();"
replace_once(poster_marker, "    const scoringDetails = poster.querySelector('.score-explanation details');\n    if(scoringDetails){\n      if(mode===`short`)scoringDetails.remove();\n      else {scoringDetails.open=true;scoringDetails.querySelector('summary')?.remove();}\n    }\n" + poster_marker)
# Keep the established visual style; only style the new scoring disclosures.
css = '''
.score-explanation{margin:1.25rem 0;padding:1rem 0;border-block:1px solid #b9afa1;line-height:1.65}
.score-explanation h2{font-size:1.1rem;margin:0 0 .6rem}.score-explanation p{margin:.5rem 0}
.score-explanation summary,.card-rating-evidence summary,.sheet details>summary{cursor:pointer;padding:.65rem 0;font-weight:600}
.score-explanation ul,.card-rating-evidence ul{padding-left:1.3rem}
.card-rating-evidence{margin:1rem 0;line-height:1.65}.card-rating-evidence a{color:#923333;text-decoration:underline;overflow-wrap:anywhere}
.sheet details{margin:.75rem 0}.score-explanation,.card-rating-evidence{font-variant-numeric:tabular-nums}
'''
html = html.replace('</style>', css + '</style>', 1)
path.write_text(html, encoding='utf-8')
print('Integrated v38 scoring, disclosures, probabilities and exact-work explanations.')
