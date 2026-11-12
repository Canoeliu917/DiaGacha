# DiaGacha·咫牌 v30

High-rarity reveal, official-detail close, and dealt-row chips from user feedback t144u, t145u, and t146u, on the shipped v29 page. No pool, score, rarity math, essay, art, pity, gift, home topbar, spread-star, or result-mini changes. Brand remains 咫牌 only; the v29 product string is left unchanged.

## 1) t144u — 压轴 / 独步 / 绝唱: longer on-stage lines, scratch-off

- 压轴 has 3 lines (was 1), 独步 4–5 (was 2), 绝唱 5–6 (was 3). Lines stay in a small rarity and dimension pool; they never name the card, never use C–LR letters, and do not use 「X一停…」 or WikiGacha wording. 绝唱 may appear as a rarity cue.
- During the preamble the real card face sits under a cream paper/foil veil, not a black veil. Each new line scratches or lifts one region: illustration first, then stars, then the name later, then the leftover veil. The current line shows in `.pack-preamble`.
- Pace is 1240ms per line (280ms when `prefers-reduced-motion`), plus the scratch motion. After the last line the leftover veil lifts and the face settles into `revealDone`. There is no second long flip that hides the face again. 绝唱 is a short ceremony (about 8–9s), not a stall.
- 头牌 still has its wait and no poem. 龙套 / 班底 / 当行 stay quick.
- Reduced motion shortens beats and completes scratches quickly, but still reveals the card (it no longer skips the ceremony entirely).
- Skip is unchanged in meaning: tap during the preamble still asks to confirm; 「全部跳过」 goes to the six-card spread; 「先看这张」 shortens the ceremony and reveals this card fully. Left/right edge cues and a tap on the flipped face for detail stay as in v29.

## 2) t145u — Tap the official card face to close

- On the official detail sheet, tapping the `.trade-card` block itself (rarity header, illustration, dimension and title) closes the sheet, same as 「收回」.
- Tapping ATK/DEF, 戏剧小注, 看点, the essay, 看懂这张卡, glossary tags, or 排演参考 does not close the sheet. The bottom 「收回」 button and an overlay/backdrop click still close it.
- Closing returns to whatever was underneath. If a pack flip had not finished revealing, the existing `close-sheet` → `$()` resume path still runs.

## 3) t146u — Dealt-row chips stay on screen, in rarity colors

- Already-flipped cards sit in the blank space under the main pack card, only during `phase==='card'` (not on the six-card spread or 尾页).
- The row wraps (3+2 or 3+3) and no longer uses a sideways scroller. Up to five previous chips fit when looking at the sixth card; all stay inside the 390px viewport, with a little bottom safe-area so deed.page badges are less likely to cover a chip. Host badges are not removed, and no large reserved badge plate was added.
- Each chip uses that card’s rarity color (龙套灰, 班底银, 当行绿, 头牌蓝, 压轴紫, 独步金, 绝唱彩虹): border and a light tint, plus the name and a short rarity cue with stars. Tapping a chip still opens official detail.
- The main pack card stays `aspect-ratio:300/423; width:min(78vw,300px)`. Packing padding above the card is slightly tighter so the row can sit on screen. 单维包 packs use the same treatment.

## 4) t147u — Animate the 演后谈 / result page, retune the four share actions

- After 「查看演后谈」, the 尾页 no longer appears fully formed. The six top minis enter one by one in the existing display order (剧本、主角、手段、配角、演法、空间). At the same time the radar polygon grows from the center and the six axis T values count in. The T / 这台 math, weights, and axis layout are unchanged. v29 mini clipping is kept: art stays in the left pane, names stay in the text rail, percentage type stays small.
- 这台 (`.show-score`) appears only after the six slots and hex scores have landed, at about 2.4s in the full ceremony (verdict follows at 2.6s). The 综评 line still uses 护名 before 诗学. The 演后谈 short body then reveals phrase by phrase; the share dock, chemistry list, and fine print arrive with the first phrase (around 3.2s). The full essay is never dumped in one paint.
- Tap anywhere on the result screen skips to the finished state. `prefers-reduced-motion` jumps to the finished page. Re-opening the same result in the session, opening a shared `#m=` link, or a 5-card legacy share uses a short entrance (~0.5–0.8s to 这台). Five-card shares still show five minis and the legacy note, and do not invent a sixth card.
- Share docks on both the result page and the spread 「分享卡组」 block now show exactly four actions, in this order: 再开一桌 (`again` → `cr()`), 生成长图 (`poster`), 复制链接 (`copy` → `Sr()`, still completing the 复制一条节目单 task), 转发给朋友 (`native-share` → `shareOrCopy()`, always visible, with clipboard fallback). 「生成短图」「保存」「分享至」 are removed from the UI. The short-poster helper remains in code for internal use. The heading is still 「把节目单递出去」. No URL field and no 送出链接.
