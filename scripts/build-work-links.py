"""Build conservative original-work links from the current embedded card pool.

Run: python -X utf8 scripts/build-work-links.py
No ID-name guesses, shared-author links, or shared-series links are made.
"""

import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LINKABLE = {"主演", "配角", "环境"}

# Explicitly checked against BOTH current cards. Excerpts guard against recycled IDs.
# These cover descriptions without book-title brackets, not author/series inference.
VERIFIED = [
    ("role-v21-othello", "奥赛罗", "play-othello", "奥赛罗", "伊阿古的诱导", "伊阿古利用奥赛罗的猜疑"),
    ("role-v21-unclevanya", "瓦尼亚舅舅", "xplay-vanya", "万尼亚舅舅", "多年劳动", "多年供养的教授"),
    ("role-v21-phedre", "费德尔", "yplay-phedre", "费德尔", "爱上丈夫之子希波吕托斯", "费德尔爱上继子希波吕托斯"),
    ("role-v21-caligularole", "卡利古拉", "play-v21-caligula", "卡利古拉", "加缪笔下的卡利古拉", "加缪的卡利古拉"),
    ("v23-role-joekeller", "乔·凯勒", "v23-play-allmysons", "都是我的儿子", "战时的零件交易", "乔·凯勒把不合格零件送上前线"),
    ("v23-role-heisenberg", "海森堡", "v23-play-copenhagen", "哥本哈根", "哥本哈根拜访旧日师友", "海森堡在战时拜访玻尔"),
    ("v23-role-woyzeck", "沃伊采克", "v23-play-woyzeck", "沃伊采克", "被军官役使、被医生取样的士兵", "士兵沃伊采克被长官役使、被医生实验"),
    ("v23-role-danton", "丹东", "v23-play-danton", "丹东之死", "厌倦清洗", "丹东厌倦流血"),
    ("v23-role-eddie", "埃迪·卡伯恩", "v23-play-viewbridge", "桥头眺望", "码头工人把侄女", "码头工人埃迪把侄女凯瑟琳"),
    ("v23-role-hickey", "希基", "v23-play-iceman", "送冰的人来了", "霍普旅馆里突然到来的推销员", "霍普旅馆的酒客"),
    ("v23-role-melchior", "梅尔希奥", "v23-play-springawake", "春醒", "春醒里较早获得知识的少年", "少年梅尔希奥与莫里茨"),
    ("v23-role-dreamdoctor", "如梦之梦的医生", "v23-play-dreamlike", "如梦之梦", "环湖倾听", "医生探访一位临终病人"),
    ("v23-role-serge", "塞尔吉", "v23-play-art", "艺术", "买下白画的朋友", "塞尔吉买下一幅几乎全白的画"),
    ("v23-sup-bohr", "玻尔", "v23-play-copenhagen", "哥本哈根", "接待海森堡的老师与旧友", "海森堡在战时拜访玻尔"),
    ("v23-sup-robespierre", "罗伯斯庇尔", "v23-play-danton", "丹东之死", "无法原谅丹东", "罗伯斯庇尔坚持纯洁"),
    ("v23-sup-moritz", "莫里茨", "v23-play-springawake", "春醒", "跟不上课程与身体变化的少年", "少年梅尔希奥与莫里茨"),
]


def description(card):
    return card.get("note", "") + "\n" + card.get("blurb", "")


def load_pool(html):
    match = re.search(r"JSON\.parse\(`(\[\{\"id\":.*?\])`\)", html, re.S)
    if not match:
        raise ValueError("Cannot find the embedded card pool")
    cards = json.loads(match.group(1))
    if len({card["id"] for card in cards}) != len(cards):
        raise ValueError("Duplicate card IDs")
    return cards, match.end()


def build(html):
    cards, pool_end = load_pool(html)
    by_id = {card["id"]: card for card in cards}
    plays = {card["name"]: card for card in cards if card["dimension"] == "剧目"}
    if len(plays) != sum(card["dimension"] == "剧目" for card in cards):
        raise ValueError("Ambiguous duplicate play titles")
    aliases = {}
    for play in plays.values():
        for title in re.findall(r"(?:全名|又名|亦名)《([^》]+)》", description(play)):
            aliases[title] = play
    titles = {**aliases, **plays}
    links, pending, reasons = {}, [], Counter()
    for card in cards:
        card_id, dimension = card["id"], card["dimension"]
        text = description(card)
        quoted = list(dict.fromkeys(re.findall(r"《([^》]+)》", text)))
        work_ids = list(dict.fromkeys(titles[title]["id"] for title in quoted if title in titles))
        if dimension == "剧目":
            work_ids, basis = [card_id], "剧目卡本身。"
        elif dimension not in LINKABLE:
            work_ids, basis = [], "演法或舞台手段不因风格、作者或戏剧系列建立原作归属。"
        elif work_ids:
            names = "、".join("《" + title + "》" for title in quoted if title in titles)
            basis = "当前 note/blurb 明确引用" + names + "；按当前剧名或剧目说明中的明示全名匹配。"
        elif "同名" in text and card["name"] in plays:
            work_ids = [plays[card["name"]]["id"]]
            basis = "当前说明明确写同名戏剧，且卡名与现有剧目名完全一致。"
        else:
            qualified = re.findall(r"[（(]([^）)]+)[）)]", card["name"])
            work_ids = list(dict.fromkeys(titles[title]["id"] for title in qualified if title in titles))
            if work_ids:
                basis = "当前卡名括号明确限定原作，按现有剧目名精确匹配。"
            elif quoted:
                basis = "说明引用的作品未与现有剧目名称精确匹配：" + "、".join("《" + title + "》" for title in quoted) + "；不按相近名称推定。"
            else:
                basis = "当前名称和说明未明确限定可匹配的单部原作；通用身份、环境或系列归属不推定羁绊。"
        links[card_id] = {"workIds": work_ids, "basis": basis}

    for card_id, name, work_id, title, card_cue, play_cue in VERIFIED:
        card, play = by_id.get(card_id), by_id.get(work_id)
        valid = (card and play and card["name"] == name and play["name"] == title
                 and card_cue in description(card) and play_cue in description(play))
        if valid:
            links[card_id] = {"workIds": [work_id], "basis": f"逐项核对当前卡名及双向剧情证据：{name}说明含“{card_cue}”；《{title}》说明含“{play_cue}”。"}
        else:
            if card_id in links:
                links[card_id] = {"workIds": [], "basis": "人工核验条目的当前名称或剧情证据已改变，暂停归属并列入待核。"}
            pending.append({"id": card_id, "reason": "已核验条目与当前卡池不再一致。", "candidateWorkIds": [work_id]})

    # Old lookup tables are candidates only. They never create a link by themselves.
    for table in ("Ht", "Ut"):
        match = re.search(r"\b" + table + r"=(\{[^}]+\})", html[pool_end:])
        if not match:
            raise ValueError(f"Cannot find legacy {table} table")
        legacy = json.loads(match.group(1).replace("`", '"'))
        for card_id, work_ids in legacy.items():
            rejected = [work_id for work_id in work_ids if work_id not in links.get(card_id, {}).get("workIds", [])]
            if rejected:
                pending.append({"id": card_id, "name": by_id.get(card_id, {}).get("name"), "reason": f"旧 {table} 关系未由当前卡名和说明支持，不承袭。", "candidateWorkIds": rejected})
                if not links.get(card_id, {}).get("workIds") and card_id in links:
                    links[card_id]["basis"] += f" 旧 {table} 关系已隔离，见 WORK_LINKS_REVIEW.json。"

    for card in cards:
        entry = links[card["id"]]
        for work_id in entry["workIds"]:
            if by_id[work_id]["dimension"] != "剧目":
                raise ValueError(f"Non-play work ID: {work_id}")
        if not entry["workIds"]:
            reasons[card["dimension"]] += 1
    counts = Counter(card["dimension"] for card in cards)
    summary = {
        "cards": len(cards),
        "linkedCards": sum(bool(entry["workIds"]) for entry in links.values()),
        "linkedNonPlayCards": sum(bool(links[card["id"]]["workIds"]) for card in cards if card["dimension"] != "剧目"),
        "byDimension": {dim: {"total": count, "linked": count - reasons[dim]} for dim, count in counts.items()},
    }
    review = {
        "policy": "只认当前卡片中的明确原作或逐项剧情证据；作品未入池、泛用身份/环境、同作者和同系列均不自动建立羁绊。",
        "summary": summary,
        "pending": pending,
        "unmapped": [{"id": card["id"], "name": card["name"], "dimension": card["dimension"], "reason": links[card["id"]]["basis"]}
                     for card in cards if card["dimension"] in LINKABLE and not links[card["id"]]["workIds"]],
    }
    return links, review


if __name__ == "__main__":
    links, review = build((ROOT / "index.html").read_text(encoding="utf-8"))
    for filename, value in (("WORK_LINKS.json", links), ("WORK_LINKS_REVIEW.json", review)):
        (ROOT / "docs" / filename).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(review["summary"], ensure_ascii=False))
    print(f"Legacy/evidence review items: {len(review['pending'])}")
