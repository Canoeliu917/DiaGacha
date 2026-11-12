# DiaGacha·咫牌 v31

Pack-layout occlusion, ceremonial typography linger, and a focused art audit, on the shipped v30 page. No pool, score, rarity math, essay, pity, gift, home topbar, or share-dock changes. Brand remains DiaGacha·咫牌, copied unchanged from v30. Work stayed in `/workspace/diagacha-v31-work/`; this version is not published.

Share actions stay exactly: 再开一桌, 生成长图, 复制链接, 转发给朋友.

## 1) Pack layout: sit the card lower, move controls to the bottom, keep chips on screen

User feedback fig1 showed a large unused blank under the pack card (especially on 1/6), with 上一张 / 下一张 locked to the mid-side edges. fig2, and the v30 390×680 shots, showed dealt-row chips cropped or covered by deed.page badges.

- Visible prev/next cues move to a `.pack-dock` under the card: 上一张 at bottom-left, 下一张 / 看这一台 / 看这一包 at bottom-right, now horizontal compact pills. Invisible `.edge-area` strips still accept the existing left/right tap-to-switch.
- Compact dealt-row chips sit in the dock’s middle cell (3+2 / 3+3 wrap unchanged). Chip type is slightly tighter so five previous chips remain fully inside a 390×680 viewport.
- The pack screen is a vertical flex: a modest gap under the header, the card sits lower into the leftover space, and the dock keeps `padding-bottom` so it clears deed.page badges. Host badges are not removed.
- The pack card still uses aspect-ratio 300/423, but may scale down with `max-height: calc(100dvh - 292px)` so the card, typography, dock, and chips all stay on screen. Art in the pack face flexes; the rarity seal and name stay inside the card, not cropped.
- Skip confirm (全部跳过 / 先看这张) remains below the dock. 单维包 packs use the same treatment.

## 2) Rare typography lingers after the scratch-off

For 压轴 / 独步 / 绝唱, after art and stars lift, the rarity title and card name are no longer a quick flash.

- Veil patches over 稀有度字 and the name lift more slowly.
- When those regions uncover, `.seal` and `.card-name` enter with a ceremonial `typeLinger` animation.
- After the last preamble line, the ceremony holds an extra beat so the type can be read and felt: about 1.2s (压轴), 1.6s (独步), 2.0s (绝唱), then the leftover veil clears. 1240ms line beats are unchanged.
- 头牌 keeps its existing wait and has no preamble lines, but its seal and name now use the same linger after the flip. `Yn.SR` is 2100ms (was 1400) so the type is not cut off by `revealDone`.
- Lower rarities stay quick. Skip / 先看这张 / 全部跳过 / `prefers-reduced-motion` still skip or shorten. Preamble lines still do not name the card, still use no C–LR letters, and still avoid 「X一停…」.

## 3) Art audit: distinctive faces, not a shallow pass on all 777

The 777 card faces are the personality of the game. A later shallow `Object.assign(xt, …)` had overwritten the original 146 paper-language recipes (俄狄浦斯王 as a smiling qipao-and-crown, 牡丹亭 as an apron and bowler, 等待戈多 without rags and tree, etc.). Meanwhile `ft()` mostly ignored the composer `bt()` (dress / hair / face / prop) and drew supporting casts as six generic silhouettes plus a small hashed icon.

- `ft()` now prefers a custom `ut[id]` illustration when one exists, then `bt(xt[id])` plus a lead motif from `Ze`, then the older hash renderers.
- After the shallow assign, the original 146 recipes are restored, then a v31 cluster patch is applied for all 120 配角 (`role2-*`) and all 71 v23 cards. Famous supporting roles are grouped by play (Theban cycle, Hamlet court, Lear family, Chekhov houses, 曹禺 / 老舍 / 北京人艺 rooms, and type-roles such as 密探 / 信使 / 弄人) so costume, face, and prop follow 剧目、人物、关系、特征 in the existing DiaGacha paper vocabulary (`ht` / `gt` / `vt` / `yt` / `I`).
- Places without a human figure use a large lead motif and wash, not a mis-tagged person (夜间客厅 is a lamp in a dark room, not a bearded play figure).
- This is not a shallow redraw of all 777. x/y-series cards that already had unique procedural signatures keep them unless they were in the restored 146 or the 191-cluster patch. Clusters and ids are listed in `ART-AUDIT-v31.md`.

## Layout verification (after the card-stack overflow fix)

A later measure showed the pack `.card` could grow past `.flip`, so the dock sat under an overflowing face. Pack-face descendants are now height-constrained (`height:100%`, art-wrap `flex:1`, overflow hidden) so typography stays inside the card and the dock keeps an ~12px gap. On desktop, `.pack-dock` is capped at `32rem` and centered under the card so 上一张 / chips / 下一张 stay clustered instead of stretching across the 720px column. Sheet `padding-bottom` is `96px` so a scrolled detail essay can clear deed.page badges. Checks and screenshots were recaptured at 390×680 and 1280×800 after these fixes.

## Review fixes (album faces, corner/bar overlap, badge clearance, hex entrance)

- 总图鉴 (`Wn` with `bag=false`) now shows every card’s illustration, collected or not. Uncollected tiles are slightly muted with a small lock mark — no “?” and no 未收集. Names and 综合 scores are omitted on album tiles only; 我的卡包 still shows names. Tiles still open detail; owned detail still shows the name.
- ATK/DEF tracks on the pack face are inset 16px so they no longer run through the bottom corner L marks.
- Pack dock `padding-bottom` is 110px (edge hit area 128px) so chips and 上一张 / 下一张 / 看这一台 sit fully above the deed.page badge zone. Host badges are unchanged.
- The hexagram grid, star, and score area use visibly rounded tips and a gentler grid. During the result entrance, each card lights only its own axis and number; other axes stay empty until that card arrives. 这台, 综评, and the talk wait until all six have landed. Skip / reduced-motion still skip or shorten.
