# DiaGacha v35 — 稀有卡开场白改为多行交叠渐显

Base: v34 index.html (sha256 73425a45…795a). Built by `apply-v35.py` (asserts base hash), writes index.html + DiaGacha-mvp-index.html (byte-identical).

## Change (only the 压轴/独步/绝唱 preamble during the scratch reveal)
- Lines no longer swap in one top row. All lines of the preamble are laid out as rows in a grid
  stacked downward; each line fades in on its own row, and the next line starts fading in
  (one row lower) while the previous line is about to fade out.
- Timing: beat 1240 → **1400 ms** per line; each line lives **2100 ms**
  (fade-in 0–441 ms, full until ~1554 ms, fade-out to 2100 ms) ⇒ ~700 ms where two lines are
  on screen together (~550 ms of actual cross-fade). Last line fades in and stays until the reveal, then
  the whole stack fades out over 380 ms while the veil clears. typeHold (SSR 1200 / UR 1600 / LR 2000) unchanged.
  Total preamble is +160 ms per line (SSR +0.5 s, UR +0.6–0.8 s, LR +0.8–1.0 s).
- Placement: computed from the card's layout box (offsets, not transformed rect, so the deal
  animation can't skew it): inset max(24px,10% width) from each side, top max(30px, 9% height) (below the
  L-marks and rarity chip), bottom at 46% of card height (above the dimension/name block revealed by the
  veil). Never over prev/next, dealt chips or deed.page badges.
- Fit: tries all rows at normal size, then fewer rows; then a tighter size (.92rem); minimum 2 rows. When
  fewer rows than lines, lines cycle rows (i % rows) — adjacent lines are always on different rows.
  At 390 px: SSR → 2 rows (tight, two-line wraps), UR/LR → 3 rows (normal size).
- Each line: own paper pill, `text-wrap:balance`, `overflow-wrap:anywhere`; no clipping.
- prefers-reduced-motion: one line at a time, no animation (beat 280 ms as before).
- a11y: only the current line is not aria-hidden.

Untouched: line texts/pools, scratch regions & order, 21 figure types, typography, album, chips,
badge-clearance CSS, scores/pool/pity/essays, all 777 cards. Brand strings counted identical to v34.
