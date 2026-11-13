# DiaGacha · 咫牌

戏剧混搭抽卡网页游戏。当前公开游戏为 **v52**（2026-11-14）：500 张常驻卡，777 张长期总图鉴。

## 打开游戏与版本记录

- **[手机／电脑打开最新版](https://canoeliu917.github.io/DiaGacha/?v=52)**
- **[全部版本更新记录：v21–v52](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/CHANGELOG.md)**
- [v52 本次改动与验收](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/CHANGELOG-v52.md)
- [最新版完整源码](https://github.com/Canoeliu917/DiaGacha/tree/codex/scoring-v38) · [v52 固定源码快照](https://github.com/Canoeliu917/DiaGacha/tree/d8eb8677d54b24d074c8a3372003a819497dc435)

当前游戏由 `codex/scoring-v38` 分支根目录发布。仓库默认首页也提供上述导航；查看或下载完整最新版时，请使用“最新版完整源码”。下载后直接在浏览器打开其中的 `index.html` 即可游玩。

游戏入口始终指向最近发布版，网址中的 `?v=52` 仅用于刷新缓存，不能用来切换历史版本。历史版本请通过更新记录中的固定提交和源码快照查看。

[原 Sites 入口](https://diagacha-v38.whole-elk-7752.chatgpt.site)为旧入口；本次 v52 更新请使用上方 GitHub Pages 入口。不同域名的收藏保存在各自浏览器存储中，切换入口不会删除原网址的收藏。

## v52 更新

- 主标题库扩充为 224 条，按当前故事情境选用；其中 200 条可由常驻六卡组合选出，其余兼容旧五卡和预留剧目。
- 同一组卡重新打开、分享或生成长图时保持同题；更换六维卡片可改变标题。
- 固定 2,000 组抽样的不同主标题由 24 种增至 190 种，去掉地点前缀后统计。

150 项自动测试通过；390／1280 像素 Chrome 视口的 8 个代表页面通过标题与溢出检查。[完整改动、测试和发布记录](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/CHANGELOG-v52.md)。

## 玩法与资料

一包六张，组成剧目、主演、配角、演法、手段、空间六个维度。卡片综合分取攻防均值四舍五入，按统一档位决定星级；同星和明确原作羁绊可加分，整台含奖励最多 100 分。点击 ATK／DEF 查看解释；“咫言咫语”将虚构故事、戏剧科普和资料参考分开呈现。

- [评分规则](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/SCORING.md) · [六维量表与参考](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/RUBRIC.md) · [抽卡出现率](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/RATES.md)
- [固定常驻名单](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/ACTIVE_CARDS_V39.json) · [卡片数据](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/cards.json)
- [500 张核心事实核查说明](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/FACT_AUDIT_V50.md) · [此前 v48 核查记录](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/FACT_AUDIT_V48.md)
- [后续版本记录方式](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/README.md)

v50 已整合 500 张常驻卡的逐卡核心事实记录：464 张新增核查，36 张复用此前证据。这不等于通读 500 部原剧或全文逐句认证；部分证据仅覆盖公开摘要、预览与可见段落。评分仍是游戏编辑判断，跨剧故事属于创作联想。人物造型按轮廓、姿态、衣饰和道具区分，不把几何不同冒称为感知相似度低于某个百分比。
