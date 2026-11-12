"""Apply the reviewed catalogue numbers without changing IDs, scores, or card order."""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPECIAL_NUMBERS = set(range(1, 51)) | set(range(10, 778, 10)) | {111 * n for n in range(1, 8)}


def renumber(cards, slots, active_ids):
    assert len(cards) == 777 and len({card['id'] for card in cards}) == 777
    assert sorted(card['no'] for card in cards) == list(range(1, 778))
    assert len(slots) == 129 and {slot['no'] for slot in slots} == SPECIAL_NUMBERS
    assert len({slot['id'] for slot in slots}) == 129
    assert all(slot['id'] in active_ids and slot['reason'].strip() for slot in slots)
    by_id = {card['id']: card for card in cards}
    assert all(by_id[slot['id']]['name'] == slot['name'] for slot in slots)
    assignments = {slot['id']: slot['no'] for slot in slots}
    free_numbers = iter(n for n in range(1, 778) if n not in SPECIAL_NUMBERS)
    for card in sorted(cards, key=lambda card: card['no']):
        if card['id'] not in assignments:
            assignments[card['id']] = next(free_numbers)
    return [dict(card, no=assignments[card['id']]) for card in cards]


def integrate_format(html):
    source = (ROOT / 'scripts/number-format-v43.js').read_text(encoding='utf-8').split('if (typeof module')[0]
    start, end = '// NUMBER_FORMAT_V43_START\n', '// NUMBER_FORMAT_V43_END\n'
    block = start + source + end
    if start in html:
        a = html.index(start)
        b = html.index(end, a) + len(end)
        html = html[:a] + block + html[b:]
    else:
        marker = 'function mn(e)'
        assert html.count(marker) == 1
        html = html.replace(marker, '\n' + block + marker, 1)
    old = 'String(e.no).padStart(3,`0`)'
    assert html.count(old) in (0, 2)
    html = html.replace(old, 'formatCardNoV43(e.no)')
    compact_title = '<span class="title-row">${pn(e.rarity)}</span>'
    serial = '<span class="album-serial" aria-hidden="true">${K(formatCardNoV43(e.no))}</span>'
    html = html.replace('<span class="album-serial" aria-hidden="true">No.${K(formatCardNoV43(e.no))}</span>', serial)
    if serial not in html:
        assert html.count(compact_title) == 1
        html = html.replace(compact_title, compact_title + '\n            ' + serial, 1)
    old_label = 'aria-label="${owned?'
    new_label = 'aria-label="No.${K(formatCardNoV43(e.no))}，${owned?'
    if old_label in html:
        assert html.count(old_label) == 1
        html = html.replace(old_label, new_label, 1)
    assert html.count(new_label) == 1 and html.count(serial) == 1
    assert html.count('formatCardNoV43(e.no)') == 4
    css = (ROOT / 'scripts/number-format-v43.css').read_text(encoding='utf-8')
    style = '<style id="number-format-v43">\n' + css + '</style>'
    if '<style id="number-format-v43">' in html:
        html = re.sub(r'<style id="number-format-v43">.*?</style>', lambda _: style, html, count=1, flags=re.S)
    else:
        html = html.replace('</head>', style + '\n</head>', 1)
    # Change only the initial/default order; explicit score and rarity choices stay available.
    html = html.replace('e.albumSort||`rarity`', 'e.albumSort||`no`')
    html = html.replace('albumSort:`rarity`', 'albumSort:`no`')
    return html


def rebuild(check_only=False):
    html_path, cards_path = ROOT / 'index.html', ROOT / 'docs/cards.json'
    html = html_path.read_text(encoding='utf-8')
    match = re.search(r'var e=JSON.parse\(`(\[.*?\])`\)', html, re.S)
    runtime_cards = json.loads(match[1])
    docs_cards = json.loads(cards_path.read_text(encoding='utf-8'))
    slots = json.loads((ROOT / 'docs/CATALOG_NUMBERS_V43.json').read_text(encoding='utf-8'))['specialSlots']
    active_ids = set(json.loads((ROOT / 'docs/ACTIVE_CARDS_V39.json').read_text(encoding='utf-8'))['activeIds'])
    assert [(c['id'], c['no']) for c in runtime_cards] == [(c['id'], c['no']) for c in docs_cards]
    updated_runtime = renumber(runtime_cards, slots, active_ids)
    updated_docs = renumber(docs_cards, slots, active_ids)
    payload = json.dumps(updated_runtime, ensure_ascii=False, separators=(',', ':'))
    assert '`' not in payload and '${' not in payload
    updated_html = integrate_format(html[:match.start(1)] + payload + html[match.end(1):])
    changed = sum(before['no'] != after['no'] for before, after in zip(docs_cards, updated_docs))
    if not check_only:
        html_path.write_text(updated_html, encoding='utf-8')
        cards_path.write_text(json.dumps(updated_docs, ensure_ascii=False, indent=0) + '\n', encoding='utf-8')
    print(f'{"Validated" if check_only else "Applied"} 129 reviewed slots; {changed} numbers changed; 777 IDs, scores, and array order preserved.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Validate the plan and integration without writing data.')
    rebuild(parser.parse_args().check)
