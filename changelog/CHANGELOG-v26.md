# DiaGacha·咫牌 v26

Mobile layout and 单维包 open-pack flow on the shipped v25 page. No pool, score, rarity, essay, art, mix pity, daily-gift rules, 这台 weights, or card-copy changes, except the stale tasks-sheet line noted below.

## 1) Home: unstick, tasks live in the 任务 sheet

- Removed the on-home `.task-glance` block (单维包进度 list + 「打开任务」). That list was being chopped under deed.page badges and in-app browser chrome.
- The compact 2-column 单维包 grid stays as the main home display under 「单维包」.
- 「任务 · N 次」 on the home side and the topbar 「任务」 link still open the tasks sheet. Charge count and each task's progress / 可领 / 已领取 remain there (`现在可开 N 次` plus the existing task rows).
- 「领取今日赠礼」 stays on the home page.
- Home no longer reserves a tall `--deed-badge-clear` (72px) plate. Bottom padding is a small safe-area only, `html`/`body` can scroll (`overflow-y:auto`), and `.home-screen` is not locked to `100dvh`, so a leftover section is not clipped off.

## 2) 单维包 opens like 综合卡池

- `yr()` no longer consumes a charge and jumps to `view=bundle`. If there are no charges, it still opens the tasks sheet. Otherwise it opens a sealed pack (`view=pack`, `booster.phase=sealed`) labeled with the dimension pack name (剧本包 / 演法包 / …).
- The charge is consumed only when the sealed cover is actually opened (`ur()`): `Be` + `O()` + `er()` + `checkMilestones`. Leave / 闭 from the sealed cover keeps the charge. Mix pity is untouched: no `Le`, no `blessedNext`, no `pendingDim`.
- Draw is still `vr(se(pool, dim), 6)` — six cards of that one dimension, same rarity intra-weights.
- Flip, rare-wait, skip, 看安利, and left/right blank (plus bottom 上一张 / 下一张) reuse the mix-pack path. Mix pity lines are hidden on 单维包. After the sixth card, the existing bundle summary (`view=bundle`, `Pn`) opens, not the 这台 result page. The last-card button reads 「看这一包」.
- 「再开一包」 on the bundle (`repack`) starts another sealed pack of the same dimension if a charge remains; otherwise it opens the tasks sheet. It does not start a mix pack. Home 「开抽！！」 / mix `cr()` / 「再开一桌」 are unchanged.

## 3) Fig 1: card + border stay inside the viewport; no 「点空白处」 hint

- The 看安利 / card-detail overlay and sheet now fill the app viewport width with `max-width:100%`, `min-width:0`, `box-sizing:border-box`, and `overflow-x:clip`, so the trade-card, art, and border cannot hang off the screen.
- Removed the on-screen hint 「点空白处，看下一张」 and the JS that overwrote `.tap-hint` after a flip. 「左边上一张，右边下一张」 is also no longer shown as instructional copy. Default behavior is unchanged: tap the left blank → previous card, tap the right blank → next card. Bottom 上一张 / 下一张 stay. The rare-tier skip confirm (「前三稀有还会单独亮一下…」) remains a confirm, not a persistent hint over the card.

## 4) Fig 3: the gray band is now 卡面简介 area

- The overlay no longer reserves a 72px gray plate under the sheet (`padding:0`, sheet `height/max-height:100%`). The cream sheet / official block (戏剧小注, 看点, essay, folded 排演参考) extends to the bottom of the app viewport. Only a small safe-area padding remains so 收起 and pack-tray buttons are not flush against the home indicator.
- On this Free deed.page preview the two English host badges may still overlay the very bottom corner; that is acceptable here. They are not hidden in code.
- 戏剧小注 should still be visible without a forced first-screen scroll on a short viewport. Longer 看点 / essay / 看懂这张卡 / 排演参考 may still scroll.

## Copy fix

- Tasks sheet: 「出 5 张同一维的卡」 → 「出 6 张同一维的卡」, matching `vr(..., 6)`.
