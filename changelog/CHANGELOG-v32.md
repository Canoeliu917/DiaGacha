# CHANGELOG-v32

v32 is a local work folder copied from shipped v31. It is not published.

## Player-facing

- Ten fully distinct little-person types (立袍、长裙、短打、甲胄、斗篷、西装、劳作、披、破衣、奇姿). Silhouette, palette, and pose differ at a glance, including in 总图鉴 thumbnails. The old shared robe, white chest rectangle, and default two-point hair are gone.
- 总图鉴 is six cards per row at 390px and on desktop. Tiles stay art-forward: faces only, no names, uncollected muted with a discreet lock. Opening an uncollected tile no longer reveals the name in the detail sheet.
- Official pack face and detail `.trade-card`: rarity title and stars sit in the top-left of the illustration (inside the frame). Dimension short name and card name sit directly under the picture. 综合 and ATK/DEF stay below, inset from the corner marks. The mid-card rarity box next to the name is removed. Spread faces get the same top-left rarity+stars treatment.
- Result / 演后谈 minis are compact card faces, not a squeezed text column: rarity+stars in the art’s top-left, dimension and weight under the picture with the full name (俄狄浦斯王 stays complete). Two rows of three at 390px. A slight paper-card thickness (thin edge + soft shadow) is on minis, spread faces, dealt chips, and a lighter edge on 总图鉴 tiles.
- 上一张 / 下一张 sit outside the card on their own row (lower left / right). First card hides 上一张; last is 看这一台 / 看这一包. Dealt chips live in a full-width band under that row, wrap 3+2 / 3+3, and do not share space with the buttons. Five-character names such as 玻璃动物园, 等待戈多, 西厢记 stay complete.
- 演后谈 first viewport: 这台, 综评 nickname, and the start of the talk stay clear of the fixed deed.page host badges at 390×680. Mid-essay can scroll.
- Typography linger for rare-card titles still plays, now on the top-left badge and the name under the art.

## Not changed

Pool membership, scores, rarity math, pity, gifts, essays, home topbar, talk entrance sequence, and the four share actions (再开一桌, 生成长图, 复制链接, 转发给朋友). 生成短图 stays removed. The brand string `DiaGacha·咫牌` is copied from v31 and was not search-replaced.

## Files

`index.html` and `DiaGacha-mvp-index.html` are byte-identical. v31 and earlier work folders were not mutated.
