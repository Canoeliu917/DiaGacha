"""Remove verified filler from cardEssays only; preview by default, apply with --write."""
import argparse
import collections
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

# These are complete, repeatedly observed sentence templates, not a keyword filter.
TEMPLATES = [
    r'.+把一种本应稳妥的安排，变成必须当面完成的较量。',
    r'.+最尖锐的地方，在于它让熟悉的关系突然无法沿用旧的规则。',
    r'.+并不急着给答案，它先让人看清：谁有权提问，谁只能回答。',
    r'围绕.+出现的不是单纯的故事，而是人如何在压力里重新寻找自己的位置。',
    r'一旦进入.+所展开的处境，退让和坚持都会立刻显出价钱。',
    r'.+不能只靠解释过关，因为行动已经把关系推到无法假装的一步。',
    r'权力并不总以喝令出场，它常常改写.+的含义，使亲近本身变成负担。',
    r'冲突的核心不是谁更会说话，而是.+还能否在被观看时保持自己的名字。',
    r'.+越想守住.+，就越要比对方更准确地看清规则里的缝隙。',
    r'别人可以谈论道理，.+却必须在.+和体面之间当场做出取舍。',
    r'观看因此不只是知情，而是被迫判断自己会站在哪一边。',
    r'真正难演的不是情绪高涨，而是一个人必须当着别人的面承认自己改变了立场。',
    r'笑或静默都来自同一件事：人们忽然看清自己一直假装不知道的关系。',
    r'舞台的力量在于让借口失去藏身之地，使每个选择都留下可以被核对的痕迹。',
    r'事情可以结束，可人物还要继续生活，这使任何胜利都带着未付清的账。',
    r'观众看见的不是结局本身，而是人在众目睽睽之下如何把退路一步步走窄。',
    r'冲突能够被记住，是因为它把私人决定变成了必须当众承担的后果。',
    r'一旦代价变得可见，人物就不能再把伤害解释成偶然。',
    r'观众随之明白，.+一旦被当众核对，亲密与权力就再难假装互不相关。',
    r'笑声或静默都指向同一事实——.+已经不能再用旧身份安全地待在原处。',
    r'对.+而言，问题已不只是对错，而是还能否在被看见之后继续生活。',
    r'.+把.+写成一种必须当面完成的事：它既保护人，也使人无处后退。',
    r'.+因此比情节摘要更锋利：它让人看见选择如何改变同处一室的人。',
    r'于是.+最动人的部分往往不在高潮本身，而在高潮过后仍要被承担的关系。',
    # Includes the observed truncated variants: 把抽象。 / 把抽象的。 / 收回到称。
    r'.+把抽象(?:的(?:压力.*?)?)?。',
]
TEMPLATE_PATTERNS = [re.compile(pattern) for pattern in TEMPLATES]
TRUNCATED_PADDING = re.compile(r'.+把抽象(?:的(?:压力(?:收(?:回(?:到(?:称(?:呼)?)?)?)?)?)?)?。')
DANGLING_END = re.compile(r'(?:收回到|因为|所以|但是|然而|以及|例如|比如|成为|变成|意味着|取决于|来自于|围绕着|关于|对于|以及其|把|将|使|与|和|的)[。！？]$')


def sentences(text):
    return [part.strip() for part in re.findall(r'.+?(?:[。！？][”’」』"]*|$)', text, re.S) if part.strip()]


def clean_essay(text):
    kept, removed, seen = [], [], set()
    for sentence in sentences(text):
        reason = None
        if sentence in seen:
            reason = 'duplicate_sentence'
        elif TRUNCATED_PADDING.fullmatch(sentence):
            reason = 'truncated_template'
        else:
            for index, pattern in enumerate(TEMPLATE_PATTERNS, 1):
                if pattern.fullmatch(sentence):
                    reason = f'template_{index:02d}'
                    break
        seen.add(sentence)
        if reason:
            removed.append({'reason': reason, 'sentence': sentence})
        else:
            kept.append(sentence)
    return ''.join(kept), removed


def strings(value, prefix=''):
    if isinstance(value, str):
        yield prefix, value
    elif isinstance(value, dict):
        for key, item in value.items():
            yield from strings(item, f'{prefix}.{key}' if prefix else key)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from strings(item, f'{prefix}[{index}]')


def scan_fields(cards, essays):
    findings, field_count = [], 0
    for card in cards:
        for field, text in [*strings(card), ('essay', essays.get(card['id'], ''))]:
            field_count += 1
            for sentence in sentences(text):
                if TRUNCATED_PADDING.fullmatch(sentence):
                    reason = 'confirmed_truncated_template'
                elif DANGLING_END.search(sentence):
                    reason = 'possible_dangling_ending_manual_review'
                else:
                    continue
                findings.append({'id': card['id'], 'name': card['name'], 'field': field, 'reason': reason, 'sentence': sentence})
    return {'stringFieldsChecked': field_count, 'findings': findings}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true', help='Apply only the cardEssays JSON replacement to index.html')
    args = parser.parse_args()
    html_path = ROOT / 'index.html'
    original = html_path.read_bytes()
    html = original.decode('utf-8')
    marker = re.search(r'const cardEssays\s*=\s*', html)
    if not marker:
        raise ValueError('Cannot locate cardEssays')
    essays, length = json.JSONDecoder().raw_decode(html[marker.end():])
    card_marker = re.search(r'var e=JSON\.parse\(`', html)
    if not card_marker:
        raise ValueError('Cannot locate the complete card data')
    cards, _ = json.JSONDecoder().raw_decode(html[card_marker.end():])
    assert len(cards) == len(essays) == 777
    assert set(essays) == {card['id'] for card in cards}

    cleaned, changes, reasons = {}, [], collections.Counter()
    for card_id, text in essays.items():
        cleaned[card_id], removed = clean_essay(text)
        if removed:
            reasons.update(item['reason'] for item in removed)
            changes.append({'id': card_id, 'retainedText': cleaned[card_id], 'removed': removed})
        assert clean_essay(cleaned[card_id])[0] == cleaned[card_id], 'Cleanup must be idempotent'
    replacement = json.dumps(cleaned, ensure_ascii=False, separators=(',', ':'))
    updated = html[:marker.end()] + replacement + html[marker.end() + length:]
    assert json.JSONDecoder().raw_decode(updated[marker.end():])[0] == cleaned
    assert list(cleaned) == list(essays), 'Card IDs and order must remain unchanged'
    if args.write and changes:
        html_path.write_bytes(updated.encode('utf-8'))

    manifest_path = ROOT / 'docs/ACTIVE_CARDS_V39.json'
    active_ids = set(json.loads(manifest_path.read_text(encoding='utf-8-sig'))['activeIds']) if manifest_path.exists() else set(essays)
    before_scan = scan_fields(cards, essays)
    after_scan = scan_fields(cards, cleaned)
    report = {
        'version': 'v39', 'applied': args.write, 'scope': 'Only the cardEssays JSON; original card fields are scanned but never modified',
        'originalHtmlSha256': hashlib.sha256(original).hexdigest(),
        'resultHtmlSha256': hashlib.sha256(updated.encode('utf-8')).hexdigest(),
        'cards': len(essays), 'changedCards': len(changes), 'removedSentences': sum(reasons.values()),
        'retainedEssays': sum(bool(text) for text in cleaned.values()),
        'emptyEssays': sum(not text for text in cleaned.values()),
        'active': {'cards': len(active_ids), 'changedCards': sum(item['id'] in active_ids for item in changes),
                   'retainedEssays': sum(bool(cleaned[card_id]) for card_id in active_ids),
                   'emptyEssays': sum(not cleaned[card_id] for card_id in active_ids)},
        'removedByReason': dict(reasons),
        'emptyEssayIds': [card_id for card_id, text in cleaned.items() if not text],
        'fieldScanBefore': before_scan, 'fieldScanAfter': after_scan,
        'scanLimit': 'A rule-based scan of every string field; potential dangling endings require human review and are not proof of a grammatical error.',
        'changes': changes,
    }
    destination = ROOT / 'docs/COPY_CLEANUP_V39.json'
    destination.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({key: report[key] for key in ['applied', 'cards', 'changedCards', 'removedSentences', 'retainedEssays', 'emptyEssays', 'active']}, ensure_ascii=False, indent=2))
    print(f'Before/after scan findings: {len(before_scan["findings"])}/{len(after_scan["findings"])}')
    print(f'Report: {destination}')


if __name__ == '__main__':
    main()
