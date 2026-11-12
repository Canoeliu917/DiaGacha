# DiaGacha·咫牌 v29

Home topbar and bottom diagram line from user feedback t142u, on the shipped v28 page. No pool, score, rarity, essay, art, pity math, gift rules, pack-flip gestures, or brand changes. Brand remains 咫牌 only; the v28 product string is left unchanged.

## 1) Home topbar: two clear rows

- The top-left brand name is larger than in v28 (about 1.2rem).
- 「游戏玩法」 moves to the top-right, on the same row as the brand. The mute control stays on that row.
- The second row is only 「任务」「单维包」「总图鉴」「我的卡包」, in that order, with slightly larger type than v28, and right-aligned.
- 「任务」 still uses brand cinnabar and the charge badge. The four entries still open the same sheets as v28. The hero still fills the space under the (now explicitly two-row) topbar so the first screen does not need a leftover scroller.

## 2) Home .dia-set: typewriter, slightly lower

- The line is still `diagram · dialogue · diagonal · diary`.
- It uses an English typewriter / monospaced stack (`American Typewriter`, `Courier New`, `Courier`, and system mono fallbacks) instead of the previous sans.
- It sits closer to the bottom edge than the v28 14px offset.

No other screens were redesigned in this pass.

## 3) Six-card spread: stars at the top-left, no rarity titles

- Spread faces no longer show a 头牌 / 压轴 / 独步 / 绝唱 / 当行 / 班底 seal.
- A horizontal star row sits in the top-left corner of each spread card, on a small paper chip so it stays readable on dark art.
- The footer still has the dimension and card name. Official detail, the on-stage flip, and the album are unchanged.

## 4) Result minis: smaller percentage, no overflowing art

- The weight line (剧本 · 22% and the rest) is 8px, smaller than the previous 10px.
- The illustration is clipped to the left pane: the 320/188 aspect-ratio no longer stretches the art across the name and star column, and it no longer leaks past the frame (the 穿帮 the screenshot showed). Name and stars stay visible in the right column.
