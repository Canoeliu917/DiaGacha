"""Apply cited reviews and derive every rarity from the integer card score."""
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RANKS = ['C', 'UC', 'R', 'SR', 'SSR', 'UR', 'LR']


def rarity_for_score(score):
    assert isinstance(score, int) and 0 <= score <= 100
    return RANKS[sum(score >= threshold for threshold in [60, 66, 72, 78, 84, 90])]


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
        # A tier migration must not undo a previous review or manufacture new axis scores.
        atk, defense = old['atk'], old['def']
        review = dict(old['review'])
        if anchor:
            assert anchor['name'] == card['name'], card['id']
            assert all(len(anchor[k]) == 3 and all(isinstance(n, int) and 0 <= n <= 4 for n in anchor[k]) for k in ['atkRubric', 'defRubric'])
            assert all(s in evidence['sources'] for s in anchor['sourceIds'])
            atk = 50 + 4 * sum(anchor['atkRubric'])
            defense = 50 + 4 * sum(anchor['defRubric'])
            review = {k: anchor[k] for k in ['reference', 'rationale', 'sourceIds', 'atkRubric', 'defRubric']}
            review.update(status='有来源的编辑复评', author=anchor.get('author', ''))
            for key in ['atkReason', 'defReason']:
                if key in anchor:
                    review[key] = anchor[key]
        total = math.floor((atk + defense) / 2 + .5)
        rarity = rarity_for_score(total)
        review.pop('curation', None)
        card.update(atk=atk, **{'def': defense}, rarity=rarity, review=review,
                    workIds=links[card['id']]['workIds'])
        audit.append({'id': card['id'], 'name': card['name'], 'dimension': card['dimension'],
                      'rarity': rarity, 'atk': atk, 'def': defense, 'fame': old['fame'],
                      'old': old['old'], 'score': total, 'review': review, 'workIds': card['workIds'], 'no': card['no']})
    # Keep card IDs, order, and collection numbers stable across score revisions.
    payload = json.dumps(cards, ensure_ascii=False, separators=(',', ':'))
    assert '`' not in payload and '${' not in payload
    html_path.write_text(html[:match.start(1)] + payload + html[match.end(1):], encoding='utf-8')
    (ROOT / 'docs/cards.json').write_text(json.dumps(audit, ensure_ascii=False, indent=0) + '\n', encoding='utf-8')
    print(f'Rebuilt {len(cards)} score-derived tiers; applied {len(anchors)} cited editorial anchors; kept card IDs and numbers.')


if __name__ == '__main__':
    rebuild()
