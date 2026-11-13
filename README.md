# DiaGacha · 咫牌

戏剧混搭抽卡网页游戏。当前公开游戏为 **v53**（2026-11-14）：500 张常驻卡，777 张长期总图鉴。

## 打开游戏与版本记录

- **[手机／电脑打开最新版](https://canoeliu917.github.io/DiaGacha/?v=52)**
- **[全部版本更新记录：v21–v53](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/CHANGELOG.md)**
- [v53 本次改动与验收](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/CHANGELOG-v53.md)
- [最新版完整源码](https://github.com/Canoeliu917/DiaGacha/tree/codex/scoring-v38) · [v53 固定源码快照](https://github.com/Canoeliu917/DiaGacha/tree/0c746437565add57807c474d7a43b736c180cc3e)

当前游戏由 `codex/scoring-v38` 分支根目录发布。仓库默认首页也提供上述导航；查看或下载完整最新版时，请使用“最新版完整源码”。下载后直接在浏览器打开其中的 `index.html` 即可游玩。

游戏入口始终指向最近发布版，网址中的 `?v=52` 仅用于刷新缓存，不能用来切换历史版本。历史版本请通过更新记录中的固定提交和源码快照查看。

[原 Sites 入口](https://diagacha-v38.whole-elk-7752.chatgpt.site)为旧入口；本次 v53 更新请使用上方 GitHub Pages 入口。不同域名的收藏保存在各自浏览器存储中，切换入口不会删除原网址的收藏。

## v53 更新

- 一场可用收藏换一张同维卡，先看完整故事和分数变化，再确认；初始卡组可回看。
- 普通包低星单卡热点由44%限制到8%，保留高星概率与评分公式。
- 六维组合生成具体故事：75种演法、75种手段各有事件文本，人物与空间真正参与转折。224个标题保持稳定匹配。
- 12种本场戏格、1170像素宽的朋友圈分享图、真实评分与卡面、可还原组合的二维码。
- 开包进度与最近5份节目单可恢复；图鉴分页，长卡名完整显示，弹窗键盘操作可用。

186项自动测试全部通过；完成320／390／768／1280像素Chrome视口流程检查、4组分享图二维码实际解码及完整长图导出。[改动、验证与发布记录](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/CHANGELOG-v53.md)。

## 玩法与资料

一包六张，组成剧目、主演、配角、演法、手段、空间六个维度。卡片综合分取攻防均值四舍五入，按统一档位决定星级；同星和明确原作羁绊可加分，整台含奖励最多 100 分。点击 ATK／DEF 查看解释；“咫言咫语”讲述六维结合的虚构故事，卡片专业介绍与来源参考独立保留。

- [评分规则](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/SCORING.md) · [六维量表与参考](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/RUBRIC.md) · [抽卡出现率](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/RATES.md)
- [固定常驻名单](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/ACTIVE_CARDS_V39.json) · [卡片数据](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/cards.json)
- [500 张核心事实核查说明](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/FACT_AUDIT_V50.md) · [此前 v48 核查记录](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/FACT_AUDIT_V48.md)
- [后续版本记录方式](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/README.md)

v50 已整合 500 张常驻卡的逐卡核心事实记录：464 张新增核查，36 张复用此前证据。这不等于通读 500 部原剧或全文逐句认证；部分证据仅覆盖公开摘要、预览与可见段落。评分仍是游戏编辑判断，跨剧故事属于创作联想。人物造型按轮廓、姿态、衣饰和道具区分，不把几何不同冒称为感知相似度低于某个百分比。
