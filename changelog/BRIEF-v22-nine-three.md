# DiaGacha·咫牌 v22 brief — raise five-persona average to 9.3+

Work ONLY in `/workspace/diagacha-v22-work/`.
NEVER modify `/workspace/diagacha-v21-freeze/` (immutable v21 archive, 2,194,903 bytes).
Primary file: `DiaGacha-mvp-index.html`. Keep `index.html` an identical copy when you finish.
Do not publish to deed.page.

Goal: implement the three improvements below, in this order, on the frozen v21 six-cast / 700-card build, without regressing standing product rules.

## Standing rules (do not regress)

- Brand is always **咫牌**. Zero 哏牌 or 叛牌.
- Single-file HTML IIFE, `file://` classic script, no `type=module`.
- No 戏曲 / 京剧 / 昆曲 / 唱念做打 on cards or generated copy.
- Visible rarity titles: 龙套 / 班底 / 当行 / 头牌 / 压轴 / 独步 / 绝唱 (1–7 star glyphs). Never show C–LR letters in the UI. Two-star title stays 班底, not 配角.
- Rarity from S=(atk+def)/2: <68 龙套, 68–73 班底, 73–78 当行, 78–82 头牌, 82–86 压轴, 86–90 独步, ≥90 绝唱.
- T = round(atk*0.4+def*0.4+rarityBase*0.2), bases {C:55,UC:64,R:73,SR:82,SSR:90,UR:96,LR:100}. Do not change this or 这台 weights.
- 这台 six-card weights stay [.22,.14,.16,.20,.16,.12] (剧本 22 / 演法 14 / 手段 16 / 主角 20 / 配角 16 / 空间 12), plus existing first-three-rule hexBonus, then clamp(round(...), 55, 99).
- Old five-card `#m=` shares keep legacy weights [.24,.18,.20,.24,.14], 五芒星, 「这一台没有配角入册」, and must not invent a sixth card. Scores and 演后谈 for those links stay identical to v21.
- Result page: labeled minis 剧本/演法/手段/主角/配角/空间, hexagram radar, 这台 between minis and 综评 nickname, 护名 before 诗学 if that block remains.
- 看点 and 险处 stay independent judgments, not excerpts of 演后谈.
- Optional 排演参考 stays folded in card detail. No「为何值得收」「为何得到这个分数」「点角看卡」. Ban「X一停…必须抓住」.
- 综评 stays a divergent production definition / short scene, not a name-stack of the six cards.
- Pack cover: no stacked redundant copy (large 抽 + 点按翻开).
- Bag / 总图鉴: two filter rows only (kinds on row 1 including 配角 and 空间, 按星级/按综合分 on row 2), nowrap at 390px. 已收集 x/N · %%.
- Glossary tags must not jump the sheet to the top (restore `.sheet.scrollTop`; no document scrollIntoView).
- 4-star+ entrances stay on the card zone, tray stays paper, prefers-reduced-motion kills loops/motes, mute kills sound only.
- Left/right blank areas plus 上一张/下一张 still switch cards.
- Existing 700 cards (fields, SVG art, 141 old essays + 161 new v21 essays) must remain verbatim versus `/workspace/diagacha-v21-freeze/DiaGacha-mvp-index.html`.

## Knife 1 — pity, daily bonus, collection, task progress

The game is already unlimited and free. Do NOT add stamina, energy, or any cap that blocks normal 综合卡池 opening.

1. Soft pity, visible on the pack page, e.g. 「再开 x 包，必出压轴以上」.
   - Count 综合卡池 packs (six-card mixed packs), not shared-link views and not 单维包 unless you have a clear reason and document it.
   - Within 30 such packs: at least one card of 压轴 or higher (五星 / SSR+).
   - Within 60 such packs: at least one 独步 or 绝唱 (六星+).
   - If a pack naturally hits that rarity, reset the corresponding counter.
   - When pity fires, force that pack to include the guaranteed rarity in a suitable seat, then reset.
   - Persist counters in localStorage without wiping owned cards or existing task state.
2. Daily bonus, not a restriction: one claimable daily gift (a better-odds 综合包, or a 单维包 token, plus a visible「今日已领」state). Timezone Asia/Shanghai. Normal opening remains free after claiming or skipping.
3. Collection milestones at 100 / 300 / 500 unique owned cards, and at full collection (use the live pool length, which will be 706 after knife 3). Reward a one-time chosen-dimension high-star draw chance, or a cosmetic. Do not inflate card T / 这台 scores.
4. 单维包 tasks: a compact, glanceable progress + claim panel reachable from home or nav. Do not hide the only entry behind “read the 演后谈 first”. Existing completions may remain one way to earn a 单维包.

## Knife 2 — share images, share landing, readable 演后谈

1. Two export actions: 「生成短图」and 「生成长图」. Both offline html2canvas, 780px wide, no clipped text, brand 咫牌 present.
   - Short image: only the six minis, hexagram, 这台, nickname, and one or two lines of 综评. No full 演后谈.
   - Long image: current full poster, including the complete 演后谈 and marks.
2. When a share `#m=` link is opened (fromShare), put a clear 「我也开一台」control near the top. It starts a new 综合卡池 pack for the visitor and must not destroy the shared lineup until they actually open their own pack. Old five-card links still render as five-card results.
3. 演后谈 on the result page defaults to a short scene of about 120–180 Chinese characters: who, where, and what conflict (入局 + 对手戏 essence). 「展开全文」reveals the rest (空间条件, 演法/手段观看契约, 艺术性与戏剧性).
4. The default short layer must avoid unexplained jargon (假定性, 间离, 观看契约, etc.). If a term is necessary, make it a tappable glossary tag.
5. You cannot fully test iOS WeChat “save to album” here. Make the export robust (fonts, 780px, complete content) and record that real-device WeChat album saving is still unverified. Do not invent a passing WeChat test.

## Knife 3 — varied 演后谈 + six new 空间绝唱

1. Keep 对手戏 as the heart of the talk. Do not always use the same five-paragraph order. Lead with this lineup’s strongest conflict (sometimes 对手戏, sometimes 底本, sometimes 空间 if the space is the engine).
2. Several distinct openings and closings, so repeated pulls do not share one cadence.
3. In the expanded layer, 艺术性 / 戏剧性 should read like a short critique, not a labeled template paragraph.
4. 看点 / 险处 stay independent. Music-theatre still prefers the singing-contract branch.
5. Add **six new** 环境 / 空间 cards at 绝唱 (S≥90, rarity LR). Do not change any existing card’s stats, art, notes, or essays (including the current two 环境 绝唱).
   - After this, pool length is **706**: 剧目 116, 风格体系 116, 导演手法 116, 主演 116, 配角 120, 环境 122.
   - Update 已收集 x/706 and every place that assumed 700.
   - New cards: drama-knowledge environments, no 戏曲, distinctive SVG illustrations, 环境 ATK/DEF axes, real glossary tags, unique high-star essays that do not copy older essays.
   - 绝唱 in 空间 should then be 8.

## Verification and deliverables

Add or extend checks under `/workspace/diagacha-v22-work/`:

- Existing 700 cards + essays + art verbatim vs the freeze HTML.
- Pool 706; 环境 122 with 8 绝唱; brand 咫牌 only.
- Pity: natural hit resets; forced inclusion when due; persistence; UI copy present.
- Daily bonus does not block normal packs.
- Milestones fire once at the thresholds against live pool length.
- Short vs long poster content (short has no full 演后谈; long has complete talk).
- Share landing shows 我也开一台; five-card legacy links unchanged vs freeze (score + talk + 「没有配角入册」).
- 这台 six-card and five-card formulas unchanged.
- Default talk 120–180 characters for sampled lineups; expanded talk is longer and still includes 对手戏; 看点/险处 are not excerpts.
- Structure variation: in a large sample (e.g. 200+ lineups), the first paragraph type is not unique/identical.
- 390px no horizontal overflow; two-row bag filters; glossary scroll; 4-star+ entrances still on the card; mute / reduced motion.

Screenshots at 390 (and 780 for posters), saved in the work folder:

- pack page with pity copy
- daily bonus / milestone or task panel
- share-landing with 我也开一台
- result with default short 演后谈
- result with 演后谈 expanded
- short poster
- long poster
- bag showing 706 (or x/706)
- one new 空间 绝唱 card detail

Write `CHANGELOG-v22-nine-three.md` with what changed, pool counts, pity rules, and leftover risks (including unverified WeChat album save).

## Report back

Paths of the HTML, changelog, checks, screenshots; verification summary; any leftover risk. Do not publish. If something cannot be done without regressing a standing rule, stop that piece, keep the rest, and say so plainly.

## Add-on (user, 2026-11-11) — rarer color and anticipation

Fold into the same v22 build:

1. 头牌 / 压轴 / 独步 / 绝唱 colors more vivid and saturated (border, rarity glow, frame). Low-rarity cards stay quieter for contrast. Tray/buttons stay paper.
2. Reveal animations for these rarities more obvious: larger motion, clearer light, a longer readable beat than v21. Effects only on the card zone. prefers-reduced-motion kills loops/motes; mute kills sound only.
3. Before a 4-star+ card flips, add a short anticipation wait (charge / dim / hold / delayed flip). 独步 and 绝唱 wait longer than 头牌. Skip remains, but one skip must not silently drop remaining high-card anticipation unless the player confirms skip-all, consistent with current 压轴+ skip rules.

Add 390 screenshots of the pre-reveal wait and the four vivid entrances. Document timings in the changelog. Brand remains 咫牌 only.
