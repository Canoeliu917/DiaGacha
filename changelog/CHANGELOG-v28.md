# DiaGacha·咫牌 v28

UI moves from user feedback t134u, plus a short on-stage preamble before 压轴+ reveals (t136u), on the shipped v27 page. No pool, score, rarity, essay, art, pity math, gift rules, pack-flip gestures, or brand changes. Brand remains 咫牌 only.

## 1) Home: 单维包 is its own option; 任务 is obvious

- Removed the below-fold `.home-controls` block from the home screen (单维包 grid, 「任务 · N 次」, 今日赠礼 / 今日已领). The first screen stays the clean v27 hero: topbar + DiaGacha / 咫牌 + parade + 戏剧抽卡游戏 + 「开抽！！」 + the diagram line. Home no longer needs a scroll just to reveal leftover controls.
- The home topbar gains a distinct 「单维包」 entry next to 「任务」. It opens a new `packs` sheet (not the tasks sheet) with the same six-pack grid (`yr(dim)`: no charge → tasks sheet; charge consumed only when the sealed pack is actually opened) plus 领取今日赠礼 / 今日已领 and the same `daily-claim` copy.
- At 390px the nav wraps cleanly onto a second row instead of overlapping. Gaps and padding are slightly tighter. The hero fills the space under the (possibly wrapping) topbar so a two-line bar does not leave an empty scroller.
- The top-nav 「任务」 button uses brand cinnabar (`var(--cinnabar)`), bolder weight, and a concentrated badge for the available 单维包 charge count (可开 N 次). If N is 0 the badge hides, but the button itself still stands out from 游戏玩法 / 总图鉴.
- Tasks sheet (`Nn`): all existing tasks and rewards stay. 「现在可开 N 次」 is a clear line at the top. Unfinished and claimable rows stay first; 已领取 items are compacted below. 已分享 / 已复制 / claim are unchanged.
- 游戏玩法: only the sentence that used to say 单维包 are claimed from 首页任务进度 now points at the 「任务」 / 「单维包」 entries. The rest of the help is unchanged.

## 2) Result share dock: only five actions

- In 「把节目单递出去」, the URL field, 复制链接, and 送出链接 are gone.
- The dock is only: 生成短图, 生成长图, 分享至, 保存, 再开一桌, laid out as a compact 2-column grid. 再开一桌 sits in the left cell of the last row so a deed.page Free badge in the bottom-right corner is less likely to cover a button. Those host badges are not removed.
- 生成短图 / 生成长图 still open the existing poster preview dialog (download / long-press to save).
- 分享至 is always shown (not gated on `canShare`). If `navigator.share` is available it shares the same title/text/url payload as the old 送出链接. If share is missing or fails (other than AbortError), it falls back to the copy-link path (`Sr()` / clipboard) and toast, so WeChat / in-app browsers can still get the link. A successful copy still completes 复制一条节目单 the same way 复制链接 did.
- 保存 re-offers the last poster generated this visit in that same dialog. If none exists yet, it generates the short image and shows that dialog. No new image format.
- 再开一桌 (`again` → `cr()`) is unchanged. The tasks sheet 已复制 / 已分享 buttons stay as they are.

## 3) Pack header: one clear sentence

- Mix and 单维 pack headers no longer stack 随机六张 / 综合卡池 / 六张随机 plus two pity paragraphs.
- Short title stays: 综合卡池, or the dim pack name (剧本包 / 演法包 / …).
- Under it, exactly one sentence. Mix: 「一次开六张。再开 N 包必出压轴以上，再开 M 包必出独步或绝唱。」 Tutorial mix: 「新手第 N 台，一次开六张成一台。再开 …」 as one sentence. N and M still come from `Math.max(1, 30-(loop.pitySSR||0))` and `Math.max(1, 60-(loop.pityUR||0))`.
- Dim packs: title is the pack name; one sentence such as 「一次开六张剧本卡。」 (dimension short name). No pity line.
- The discreet `1 / 6` caption stays near the card. The four pack buttons stay gone. Left/right edge-hit, tap-to-detail, and tap-to-skip are unchanged from v27.

## 4) 压轴 / 独步 / 绝唱: a short on-stage preamble before the face

- Before a 压轴、独步 or 绝唱 card face is revealed, a short ceremonial preamble plays in the paper/theater voice. It does not name the card, and it does not use rarity letters (C–LR). The text is a small rarity (and optional dimension) pool, not 777 unique essays.
- 头牌 keeps the existing anticipation wait and has no preamble text.
- 压轴 shows 1 short line, then the existing flip/wait. 独步 shows 2 lines, then flip. 绝唱 shows 3 lines, then flip.
- Tapping during the preamble still uses the existing 压轴+ skip confirm. 「全部跳过」leaves the pack as before. 「先看这张」shortens the preamble and starts the existing flip/wait. `prefers-reduced-motion` skips the preamble and still reveals the card.
- Lower rarities stay quick. A soft stage glow plays during the preamble; 独步 / 绝唱 also get a brief stir. No dark WikiGacha-style veil, and no「X一停…」wording.

## 5) Visible prev/next, and a six-card spread after the pack

- Pack flip still uses left/right `.edge-hit` (no four-button tray). Those edges now show a paper/cream chip with a chevron and 「上一张」 / 「下一张」, so the tap target is visible.
- On the first card, the previous cue is omitted. On the sixth revealed card, the next cue reads 「看这一台」 (综合卡池) or 「看这一包」 (单维包) and opens the six-card spread, not the 尾页 or bundle yet.
- After the sixth card is face-up, the same spread also arrives on its own after a short beat (shorter when `prefers-reduced-motion` is on). Skip-all and skip-to-end land on this spread as well. Tap the flipped face still opens 戏剧小注; tap during flip or preamble still skips as before. No copy telling people to tap a blank area. Card size stays `aspect-ratio:300/423; width:min(78vw,300px)`.
- The spread lays the six real card faces out: one row of six on a wide screen, two rows of three at 390px. Mix packs use the result display order (剧本、主角、手段、配角、演法、空间) without changing the scoring array. Tap a face for the existing official detail; closing the sheet returns to the spread.
- Under a mix spread: 「分享卡组」 reveals the existing five-action dock (生成短图 / 生成长图 / 分享至 / 保存 / 再开一桌). 「查看演后谈」 goes to the existing result 尾页 (这台, 六芒星, 综评, 演后谈, then the same dock). 再开一桌 still calls `cr()`.
- Under a 单维包 spread: only 「看这一包」, which opens the existing bundle `Pn`. No invented mix share or 演后谈 on a dim pack.
