# DiaGacha·咫牌 v27

Mobile home first screen and pack-reveal gestures on the shipped v26 page. No pool, score, rarity, essay, art, mix pity, daily-gift rules, 这台 weights, or card-copy changes, except the one 游戏玩法 sentence noted below.

## 1) Home: first screen as clean as desktop; 单维包 lives below the fold

- Restored a full-viewport `.home-hero` (`min-height: calc(100dvh - topbar)`, with an `svh` fallback). The v25/v26 short-viewport override `.home-hero{min-height:0;padding:4px 0 16px}` and `.home-screen{min-height:unset}` had pulled the 单维包 grid onto the first screen.
- The first viewport after entering home is just the topbar + brand lockup (DiaGacha / 咫牌) + parade figures + 「戏剧抽卡游戏」 + the large 「开抽！！」 button + the small diagram·dialogue line. Same uncluttered composition as the desktop homepage.
- 单维包 (title, 「任务 · N 次」, the 2-column pack grid) and 领取今日赠礼 / 今日已领 stay in `.home-controls`, now starting at or just below the fold. The user swipes down to reach them. They are not deleted and not moved into the topbar.
- `html` / `body` still scroll (`overflow-y:auto`). The home screen is not `overflow:hidden`. Desktop stays equally clean.

## 2) Omit the four pack buttons; interact via the card shape

- In the mix and 单维 pack reveal UI (`Vn`), removed the visible four-button tray: 看安利, 跳过动画, 上一张, 下一张 (`.pack-actions` + `.step-nav`). No replacement dock.
- Invisible left/right `.edge-hit` controls remain: left blank → previous card, right blank → next card. On the last card, next still goes to 看这一台 (mix → result) or 看这一包 (dim pack → bundle).
- After a card has finished flipping (`revealDone`), a tap on the card face opens 看安利 / card detail (`data-action="detail"`). During sealed / dealing / charging / waiting, a tap on the card (not the edges) runs the existing skip path `gr()`. The rare 压轴+ confirm (`askSkip` / 全部跳过 / 先看这张) is unchanged.
- Sealed pack still opens on tap, as before.
- A discreet `1 / 6` caption stays near the card; it is not a button bar and not a sticky tray.
- Dropped the short-viewport shrink `min(62vw,220px,calc((100dvh - 23.5rem) * 300 / 423))` that existed to leave room for the tray. Pack/card width is `min(78vw,300px)` with a milder `dvh`/`svh` cap so the card stays on-screen and card-shaped (`aspect-ratio:300/423`). Colored rarity frames/glows stay inside the card (v24: no ghostly dark fringe).
- 看安利 remains on later result / six-envelope / other non-tray surfaces.

## Copy

- 游戏玩法: replaced the sentence that described bottom 「上一张 / 下一张」 buttons and 跳过动画 as a labeled control. It now matches the gestures: 左右空白换张；点开已翻开的卡片看戏剧小注；翻开过程中再点卡片可跳过动画；压轴及以上仍要看完或确认全部跳过. The rest of the help is unchanged.
