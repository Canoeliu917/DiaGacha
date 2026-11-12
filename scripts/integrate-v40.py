"""Embed v40 card interactions, reveal sequences and theatre stories."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / 'index.html'
html = path.read_text(encoding='utf-8')
copy_block = '// V39_COPY_START\n' + '\n'.join((ROOT/'scripts'/name).read_text(encoding='utf-8') for name in ['copy-overrides-v39.js','talk-v39.js']) + '\napplyCopyOverridesV39(e,cardEssays);\n// V39_COPY_END\n'
html = re.sub(r'// V39_COPY_START.*?// V39_COPY_END\n', lambda match: copy_block, html, flags=re.S)

def replace_function(start, end, replacement):
    global html
    a = html.rindex(start)
    b = html.index(end, a + len(start))
    html = html[:a] + replacement + '\n' + html[b:]

def replace_once(old, new):
    global html
    if new in html:
        return
    assert html.count(old) == 1, (old[:90], html.count(old))
    html = html.replace(old, new, 1)

html = re.sub(r'// V40_RUNTIME_START.*?// V40_RUNTIME_END\n', '', html, flags=re.S)
html = re.sub(r'// V40_RATES_START.*?// V40_RATES_END\n', '', html, flags=re.S)
rates = '// V40_RATES_START\n' + (ROOT/'scripts/rates-v40.js').read_text(encoding='utf-8') + '\n// V40_RATES_END\n'
html = html.replace('var v=[`C`,`UC`', rates + 'var v=[`C`,`UC`', 1)
replace_once('y={C:22,UC:26,R:26,SR:15,SSR:7,UR:3,LR:1}', 'y=DiaRatesV40.standard')
replace_once('let table={C:8,UC:12,R:25,SR:24,SSR:18,UR:9,LR:4}', 'let table=DiaRatesV40.gift')
if 'function An(e,open=false)' in html:
    replace_function('function An(e,open=false)', 'function jn(', '')
replace_function('function preambleLines(card)', 'var talkTimers=', (ROOT/'scripts/reveal-v40.js').read_text(encoding='utf-8'))
replace_function('function finishTalkEnter()', 'function hexSvg(', 'function finishTalkEnter(){finishProductionV40();}')
replace_function('function hexSvg()', 'function paintRadar(', (ROOT/'scripts/radar-motion-v40.js').read_text(encoding='utf-8'))
replace_function('function queueTalkEnter()', 'window.__dgDebug=', 'function queueTalkEnter(){enterProductionV40();}')
if 'stopHomeFloatV40();const top=' not in html:
    replace_once('X+=1,tr=!1;const top=', 'X+=1,tr=!1;revealClearV40();stopProductionV40();const top=')
    replace_once('stopProductionV40();const top=', 'stopProductionV40();stopHomeFloatV40();const top=')
if 'startHomeFloatV40();document.body' not in html:
    replace_once('Zn.innerHTML=qn(ar());document.body', 'Zn.innerHTML=qn(ar());restoreRevealIntroV40();document.body')
    replace_once('restoreRevealIntroV40();document.body', 'restoreRevealIntroV40();startHomeFloatV40();document.body')
replace_once('<g transform="translate(160 8)">${bt(t)}</g></svg>', '<g class="parade-motion"><g transform="translate(160 8)">${bt(t)}</g></g></svg>')
replace_once('<svg class="parade-fig" viewBox="78 0 164 188" aria-hidden="true"><rect width="320"', '<svg class="parade-fig" viewBox="78 0 164 188" aria-hidden="true"><rect x="78" width="164"')
replace_once('if(Y.view===`result`&&(Y.drawn||[]).length)queueTalkEnter();}', 'if(Y.view===`result`&&(Y.drawn||[]).length)queueTalkEnter();else if(Y.view===`pack`&&Y.booster?.phase===`spread`)enterProductionV40();}')
replace_once('else if(n===`expand-talk`)', 'else if(n===`production-cue`)replayProductionCueV40(t.dataset.cueId);\n    else if(n===`expand-talk`)')
replace_once('<h1 class="verdict">${Mn(t)}</h1>', '<h1 class="verdict">${K(dramaticTitleV40(t))}</h1>')
replace_once('        <div class="spread-actions">', "        ${!isDim&&(t.cards||[]).length===6?spreadReviewV40(t.cards):''}\n        <div class=\"spread-actions\">")
if '${mn(e)}${statAxesMarkupV40(e)}${xn(e)}' not in html:
    replace_once('${mn(e)}${_n(e)}${cardReviewDetails(e)}${xn(e)}', '${mn(e)}${_n(e)}${statDisclosureV40(e)}${xn(e)}')
    replace_once('${mn(e)}${_n(e)}${statDisclosureV40(e)}${xn(e)}', '${mn(e)}${statAxesMarkupV40(e)}${xn(e)}')
if "poster.classList.add('poster-static')" not in html:
    replace_once("    poster=document.querySelector('.result-screen').cloneNode(true);", "    finishProductionV40();\n    poster=document.querySelector('.result-screen').cloneNode(true);\n    poster.classList.add('poster-static');")
replace_once("    poster=document.querySelector('.result-screen').cloneNode(true);", "    const source=document.querySelector('.result-screen');\n    if(source)poster=source.cloneNode(true);\n    else{const template=document.createElement('template');template.innerHTML=Un({...ar(),drawn:productionCardsV40(),talkOpen:true});poster=template.content.firstElementChild;}")

if 'function xn(card)' in html:
    replace_function('function xn(card)', 'function Sn(', '')
runtime = '\n'.join((ROOT/'scripts'/name).read_text(encoding='utf-8') for name in ['stat-rationale-v40.js','high-star-copy-v40.js','card-detail-v40.js','production-motion-v40.js','home-float-v40.js'])
block = '// V40_RUNTIME_START\n' + runtime + '\n// V40_RUNTIME_END\n'
startup = 'Zn.addEventListener(`click`,Tr),Er()'
assert html.count(startup) == 1
html = html.replace(startup, block + startup, 1)
html = re.sub(r'\n*/\* V40_PRESENTATION_START \*/.*?/\* V40_PRESENTATION_END \*/\n*', '\n', html, flags=re.S)
css = '\n/* V40_PRESENTATION_START */\n' + '\n'.join((ROOT/'scripts'/name).read_text(encoding='utf-8') for name in ['production-v40.css', 'reveal-v40.css', 'rarity-palette-v40.css','home-float-v40.css']) + '\n/* V40_PRESENTATION_END */\n'
# Place after all incumbent style blocks so reveal overrides do not get undone.
at = html.rindex('</style>')
html = html[:at] + css + html[at:]
path.write_text(html, encoding='utf-8')
print('Installed v40 table cues, scene, high-star reveal and rarity colours.')
