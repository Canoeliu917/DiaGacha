"""Rebuild v38 card ratings from preserved pre-inflation values and cited anchors."""
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RANKS = ['C', 'UC', 'R', 'SR', 'SSR', 'UR', 'LR']
REFERENCE = {100: 94, 96: 88, 90: 82, 84: 76, 78: 68, 64: 58, 50: 50}


def rebuild():
    html_path = ROOT / 'index.html'
    html = html_path.read_text(encoding='utf-8')
    match = re.search(r'var e=JSON.parse\(`(\[.*?\])`\)', html, re.S)
    cards = json.loads(match[1])
    baseline = {c['id']: c for c in json.loads((ROOT / 'docs/cards.json').read_text(encoding='utf-8'))}
    evidence = json.loads((ROOT / 'docs/SCORING_ANCHORS.json').read_text(encoding='utf-8'))
    anchors = {c['id']: c for c in evidence['cards']}
    links = json.loads((ROOT / 'docs/WORK_LINKS.json').read_text(encoding='utf-8'))
    audit = []
    for card in cards:
        old = baseline[card['id']]
        anchor = anchors.get(card['id'])
        reference = REFERENCE[old['fame']]
        atk, defense = old['old'][1:]
        review = {'status': '历史编辑初评', 'reference': reference,
                  'rationale': '撤销旧版升档造成的攻防抬升；沿用提档前编辑数值，尚未逐项文献复核。',
                  'sourceIds': [], 'atkRubric': None, 'defRubric': None}
        if anchor:
            assert anchor['name'] == card['name'], card['id']
            assert all(len(anchor[k]) == 3 and all(isinstance(n, int) and 0 <= n <= 4 for n in anchor[k]) for k in ['atkRubric', 'defRubric'])
            assert all(s in evidence['sources'] for s in anchor['sourceIds'])
            atk = 50 + 4 * sum(anchor['atkRubric'])
            defense = 50 + 4 * sum(anchor['defRubric'])
            reference = anchor['reference']
            review = {k: anchor[k] for k in ['reference', 'rationale', 'sourceIds', 'atkRubric', 'defRubric']}
            review.update(status='有来源的编辑复评', author=anchor.get('author', ''))
        total = math.floor((atk + defense) / 2 + .5)
        curation = round(.6 * total + .4 * reference, 1)
        rarity = RANKS[sum(curation >= threshold for threshold in [60, 66, 72, 78, 84, 90])]
        review['curation'] = curation
        card.update(atk=atk, **{'def': defense}, rarity=rarity, review=review,
                    workIds=links[card['id']]['workIds'])
        audit.append({'id': card['id'], 'name': card['name'], 'dimension': card['dimension'],
                      'rarity': rarity, 'atk': atk, 'def': defense, 'fame': old['fame'],
                      'old': old['old'], 'score': total, 'review': review, 'workIds': card['workIds']})
    # Preserve card order: original illustration selection depends on the first 500 IDs.
    ranked = sorted(cards, key=lambda c: (-math.floor((c['atk'] + c['def']) / 2 + .5), -c['review']['curation'], c['id']))
    numbers = {c['id']: i + 1 for i, c in enumerate(ranked)}
    for card in cards:
        card['no'] = numbers[card['id']]
    for row in audit:
        row['no'] = numbers[row['id']]
    payload = json.dumps(cards, ensure_ascii=False, separators=(',', ':'))
    assert '`' not in payload and '${' not in payload
    html_path.write_text(html[:match.start(1)] + payload + html[match.end(1):], encoding='utf-8')
    (ROOT / 'docs/cards.json').write_text(json.dumps(audit, ensure_ascii=False, indent=0) + '\n', encoding='utf-8')
    print(f'Rebuilt {len(cards)} cards; {len(anchors)} cited editorial anchors; {len(cards) - len(anchors)} historical initial reviews.')


if __name__ == '__main__':
    rebuild()
