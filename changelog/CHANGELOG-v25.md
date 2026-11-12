# DiaGacha·咫牌 v25

Tight mobile layout and a routing fix on the shipped v24 page. No pool, score, rarity, essay, art, pity, or copy changes.

## 再开一桌 / 自己开一桌

- 「再开一桌」 (`data-action="again"`) now starts a fresh 综合卡池 pack via `cr()`, the same path as 「再开一包」 / `repack` and the home 综合卡池 button.
- 「自己开一桌」 on the bad-link page (`data-action="start"`) does the same, so it no longer drops into the leftover 六封 (`view=pull`) flow.
- Previous result state is cleared (`drawn`, `index`, `fromShare`, `talkOpen`) before `cr()` opens a sealed mix pack.
- The `Hn` / `view=pull` renderer is left in the file unused.

## Pack card detail (图一)

- The card sheet is pinned to the top of the viewport and uses almost the full height above the badge clearance, so the illustration and ATK/DEF bars sit higher.
- Art frame, title, score, axes, and 戏剧小注 spacing are tightened on short phone viewports. Copy is not shortened or removed.
- On a short phone viewport, 戏剧小注 and the start of its first paragraph should be visible without scrolling. 「看懂这张卡」 and folded 「排演参考」 may still need a short scroll or expand.

## deed.page badge clearance

- Host badges (“Report abuse”, “Published with deed.page”) cannot be removed. Screens now reserve `--deed-badge-clear` (72px + `safe-area-inset-bottom`) at the bottom.
- Pack tray buttons (看安利 / 跳过动画 / 上一张 / 下一张), sheet text, result actions, and other primary buttons sit above that zone.
- The pack reveal tray sticks above the clearance so the lower button row is not covered.

## Other primary screens

- Sealed mix pack: slightly smaller deck and tighter pity/title spacing on short viewports so the pack and pity lines fit without a forced scroll.
- Result first screen: slightly tighter hex / score spacing; 演后谈 still expands and may scroll.
- No user-facing information was deleted.
