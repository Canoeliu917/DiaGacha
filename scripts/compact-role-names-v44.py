"""Remove redundant work suffixes from unique role names, preserving source metadata."""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def compact_names(cards, sources):
    roles = [card for card in cards if card['dimension'] in ['主演', '配角']]
    candidates = {}
    for card in roles:
        match = re.fullmatch(r'(.+?)\s*[（(]([^（）()]+)[）)]', card['name'])
        if match and match[2] in sources[card['id']]['sourceTitles']:
            candidates[card['id']] = match[1].strip()
    counts = Counter(candidates.get(card['id'], card['name']) for card in roles)
    return {key: name for key, name in candidates.items() if counts[name] == 1}


def rebuild():
    html_path = ROOT / 'index.html'
    html = html_path.read_text(encoding='utf-8')
    match = re.search(r'var e=JSON.parse\(`(\[.*?\])`\)', html, re.S)
    cards = json.loads(match[1])
    source_path = ROOT / 'docs/ROLE_SOURCES_V39.json'
    source_data = json.loads(source_path.read_text(encoding='utf-8'))
    art_path = ROOT / 'docs/ART_PROFILES_V39.json'
    art = json.loads(art_path.read_text(encoding='utf-8'))
    names = compact_names(art['cards'], {card['id']: card for card in source_data['cards']})
    old_names = {card['name']: names[card['id']] for card in art['cards'] if card['id'] in names}
    for card in cards:
        if card['id'] in names:
            card['name'] = names[card['id']]
    payload = json.dumps(cards, ensure_ascii=False, separators=(',', ':'))
    html = html[:match.start(1)] + payload + html[match.end(1):]
    for filename, key in [('cards.json', None), ('ROLE_SOURCES_V39.json', 'cards'),
                          ('CATALOG_NUMBERS_V43.json', 'specialSlots'), ('SCORING_ANCHORS.json', 'cards')]:
        path = ROOT / 'docs' / filename
        data = json.loads(path.read_text(encoding='utf-8'))
        rows = data[key] if key else data
        changed = False
        for row in rows:
            if row['id'] in names:
                row['name'] = names[row['id']]
                changed = True
        if changed:
            path.write_text(json.dumps(data, ensure_ascii=False, indent=0 if key is None else 2) + '\n', encoding='utf-8')
        if filename == 'ROLE_SOURCES_V39.json':
            sources = {row['id']: row for row in rows}
    html = re.sub(r'const roleSourcesV39 = .*?;\nfunction roleSourceLine',
                  lambda _: 'const roleSourcesV39 = ' + json.dumps(sources, ensure_ascii=False) + ';\nfunction roleSourceLine', html, count=1)
    for record in art['cards']:
        if record['id'] in names:
            record['name'] = names[record['id']]
        for member in record.get('cast', []):
            if member.get('roleId') in names:
                member['name'] = names[member['roleId']]
    art_path.write_text(json.dumps(art, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    runtime_path = ROOT / 'scripts/art-profiles-v39.data.js'
    runtime_text = runtime_path.read_text(encoding='utf-8')
    runtime = json.loads(re.search(r'var ART_PROFILE_DATA_V39=(.*);', runtime_text)[1])
    for key, record in runtime.items():
        if key in names:
            record['name'] = names[key]
        for member in record.get('cast', []):
            if member.get('roleId') in names:
                member['name'] = names[member['roleId']]
    runtime_line = 'var ART_PROFILE_DATA_V39=' + json.dumps(runtime, ensure_ascii=False, separators=(',', ':')) + ';'
    runtime_path.write_text(re.sub(r'var ART_PROFILE_DATA_V39=.*;', lambda _: runtime_line, runtime_text), encoding='utf-8')
    html = re.sub(r'var ART_PROFILE_DATA_V39=.*;', lambda _: runtime_line, html, count=1)
    builder_path = ROOT / 'scripts/build-art-profiles-v39.py'
    builder = builder_path.read_text(encoding='utf-8')
    for old, new in old_names.items():
        builder = builder.replace(old, new)
    builder_path.write_text(builder, encoding='utf-8')
    html_path.write_text(html, encoding='utf-8')
    print(f'Compacted {len(names)} unique role names; IDs, scores and work sources preserved.')


if __name__ == '__main__':
    rebuild()
