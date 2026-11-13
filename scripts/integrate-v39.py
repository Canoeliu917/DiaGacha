"""Embed the v39 presentation modules without changing card identities or saves."""
from pathlib import Path
import re
import json

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / 'index.html'
html = path.read_text(encoding='utf-8')

def replace_function(start, end, replacement):
    global html
    a = html.rindex(start)
    b = html.index(end, a + len(start))
    html = html[:a] + replacement + '\n' + html[b:]

active = json.loads((ROOT/'docs/ACTIVE_CARDS_V39.json').read_text(encoding='utf-8'))
sources = json.loads((ROOT/'docs/ROLE_SOURCES_V39.json').read_text(encoding='utf-8'))
data_block = '// V39_RELEASE_START\nconst activeCardIdsV39 = new Set(' + json.dumps(active['activeIds'],ensure_ascii=False) + ');\nconst activeCards = e.filter(card=>activeCardIdsV39.has(card.id));\n'
data_block += 'const roleSourcesV39 = ' + json.dumps({c['id']:c for c in sources['cards']},ensure_ascii=False) + ';\n'
data_block += '''function roleSourceLine(card){
  const source=roleSourcesV39[card.id];
  if(!source)return '';
  const label=source.sourceKind==='generic'?'角色类型':source.sourceKind==='tradition'?'相关剧目':'出自';
  return `<p class="role-source"><b>${label}</b> ${K(source.sourcePlayLabel)}</p>`;
}
for(const card of e){const source=roleSourcesV39[card.id];if(source){card.workIds=source.sourcePlayIds.slice();card.sourcePlayLabel=source.sourcePlayLabel;}}
// V39_RELEASE_END
'''
html=re.sub(r'// V39_RELEASE_START.*?// V39_RELEASE_END\n', '', html, flags=re.S)
html=html.replace('function Ct(e)',data_block+'function Ct(e)',1)
art_files = ['art-figures-v39.js','art-profiles-v39.data.js','art-profiles-v39.js','art-spaces-v39.js']
if all((ROOT/'scripts'/name).exists() for name in art_files):
    art_block='// V39_ART_START\n'+'\n'.join((ROOT/'scripts'/name).read_text(encoding='utf-8') for name in art_files)+'\nArtProfilesV39.apply(xt,e);\n// V39_ART_END\n'
    html=re.sub(r'// V39_ART_START.*?// V39_ART_END\n','',html,flags=re.S)
    html=html.replace('function Ct(e)',art_block+'function Ct(e)',1)
    replace_function('function ft(', 'var L=', 'function ft(card){return (card.dimension===\'环境\'&&spaceArtV39(card))||ArtProfilesV39.render(card,{figure:figBodyV39,glyph:I});}')
copy_files=['copy-overrides-v39.js','talk-v39.js']
if all((ROOT/'scripts'/name).exists() for name in copy_files):
    copy_block='// V39_COPY_START\n'+'\n'.join((ROOT/'scripts'/name).read_text(encoding='utf-8') for name in copy_files)+'\napplyCopyOverridesV39(e,cardEssays);\n// V39_COPY_END\n'
    html=re.sub(r'// V39_COPY_START.*?// V39_COPY_END\n','',html,flags=re.S)
    html=html.replace('var Xn=`diamasha.owned`',copy_block+'var Xn=`diamasha.owned`',1)
html=html.replace('<h3>戏剧小注</h3><p>${K(card.note)}</p>','<h3>戏剧小注</h3>${roleSourceLine(card)}<p>${K(card.note)}</p>')
html=html.replace('let t=drawMixPack(e);','let t=drawMixPack(activeCards);')
html=html.replace('vr(se(e,Y.pack),6)','vr(se(activeCards,Y.pack),6)')
html=html.replace('poolSize:e.length,','poolSize:activeCards.length,')
html=html.replace('owned:Y.owned,pool:e,','owned:Y.owned.filter(id=>activeCardIdsV39.has(id)),pool:activeCards,')
html=html.replace('n=(Y.owned||[]).length,marks=[100,300,500,e.length]','n=(Y.owned||[]).filter(id=>activeCardIdsV39.has(id)).length,marks=[100,300,500]')
html=html.replace('const full=String((typeof e!==`undefined`&&e.length)||777);','const full=String(activeCards.length);')
html=html.replace('观众看见人从暗处走到亮处，地点慢慢变成。','观众看见演员从暗处走向亮处，连接后台与表演区的窄路，让一次出场有了可见的过程。')
html=html.replace('const MINI_DISPLAY_PCT=[22,20,16,16,14,12];','')
html=html.replace('${copyDimension(cards[src].dimension)} · 基础权重 ${MINI_DISPLAY_PCT[i]}%','${copyDimension(cards[src].dimension)}')
replace_function('function hexRadar(cards)', 'function Qt(cards)', (ROOT / 'scripts/radar-v39.js').read_text(encoding='utf-8'))
replace_function('function clampTalk(text,min,max)', 'function shortScene(cards)', '''function clampTalk(text,min,max){
  const sentences=String(text||'').trim().match(/[^。！？]+[。！？]|[^。！？]+$/g)||[];
  let result='';
  for(const sentence of sentences){
    if(result&&result.length+sentence.length>max)break;
    result+=sentence;
  }
  return result;
}
''')
html=html.replace("const essay=(cardEssays[card.id]||midCardEssay(card));", "const essay=cardEssays[card.id]||'';")
if 'function midCardEssay(card)' in html:
    replace_function('function midCardEssay(card)', 'function xn(card)', '')
html=html.replace('d`,roundedPolyPath(pts,14)', "d`,'M'+pts.map(p=>p.join(',')).join(' L')+' Z'")
html=html.replace('综合分＝ATK与DEF各占50%；星级和稀有度不重复计分。具体依据可展开查看。','综合分综合攻防表现；玩法与加分规则见首页「游戏玩法」。')
html=html.replace('v38：基础表现、同色共鸣与明确羁绊共同计分；具体分解见上方。分数是游戏编辑判断，不是文学作品排行榜。','同星成组、原作羁绊都能加分；规则见首页「游戏玩法」。')
html=html.replace('${On(e)}<p class="sheet-fine">','<p class="sheet-fine">')
if 'function On(cards)' in html:
    replace_function('function On(cards)', 'function An(e,open=false)', '')
css='''
/* V39_RADAR_CSS_START */
.hex-chart{max-width:360px;margin:10px auto}
.hex-grid{stroke:#b6a992;stroke-width:1;opacity:.75}.hex-grid-max{stroke:#8c795b;stroke-width:1.5;opacity:1}
.hex-axis{stroke:#9d8d76;stroke-width:1;opacity:.65}
.hex-area{fill:#9c2f2f26;stroke:#9c2f2f;stroke-width:2.5;stroke-linejoin:miter}
.hex-star{stroke:#9c2f2f;stroke-width:1.5;opacity:.65;stroke-linejoin:miter}
.hex-ray{stroke:#9c2f2f;stroke-width:2;opacity:.7}.hex-dot{fill:#9c2f2f;stroke:#fffcf8;stroke-width:2}
.hex-scale{fill:#665745;font-size:9px;font-family:system-ui,sans-serif;font-variant-numeric:tabular-nums;paint-order:stroke;stroke:#f3efe6;stroke-width:3px;stroke-linejoin:round}
.hex-value{color:#9c2f2f;font-size:20px;font-weight:700}.hex-label{color:#4a3b2e}
.hex-caption{text-align:center;font-size:11px;color:#665745;margin:2px 0 6px}
.role-source{font-size:14px;line-height:1.6;margin:.4rem 0 .8rem;color:var(--ink)}
.sheet table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:13px;margin:.75rem 0}
.sheet th,.sheet td{text-align:center;padding:.45rem .15rem;border-bottom:1px solid var(--line)}
/* V39_RADAR_CSS_END */
'''
html=re.sub(r'\n*/\* V39_RADAR_CSS_START \*/.*?/\* V39_RADAR_CSS_END \*/\n*', '\n', html, flags=re.S)
html=html.replace('</style>',css+'</style>',1)
path.write_text(html,encoding='utf-8')
print('Installed v39 radar and complete-sentence rendering.')
