# DiaGacha · 咫牌

戏剧混搭抽卡网页游戏。当前版本 **v54**（2026-11-14）面向小范围邀请试玩：500 张常驻卡，777 张长期总图鉴。

## 打开游戏与版本记录

- **[手机／电脑打开 v54 邀请试玩版](https://canoeliu917.github.io/DiaGacha/releases/v54/index.html)**
- **[全部版本更新记录：v21–v54](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/CHANGELOG.md)**
- [v54 本次改动与验收](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/CHANGELOG-v54.md)
- [最新版完整源码](https://github.com/Canoeliu917/DiaGacha/tree/codex/scoring-v38) · [v54 固定源码快照](https://github.com/Canoeliu917/DiaGacha/tree/91d2623155e6fa48abadf976c6da99b9352cef8a)

当前游戏由 `codex/scoring-v38` 分支根目录发布。仓库默认首页也提供上述导航；查看或下载完整最新版时，请使用“最新版完整源码”。下载后直接在浏览器打开其中的 `index.html` 即可游玩。

根目录游戏入口指向最近发布版，网址中的 `?v=数字` 仅用于刷新缓存。v54 起使用 `releases/v54/index.html` 固定版本路径分享结果；以后的更新必须保留该文件，保证旧卡组继续显示当时的故事和分数。更早版本请通过更新记录中的固定提交和源码快照查看。

[原 Sites 入口](https://diagacha-v38.whole-elk-7752.chatgpt.site)为旧入口；请使用上方 GitHub Pages 入口。同一浏览器中同一域名的根目录和版本目录共用收藏；不同浏览器、域名和设备不自动同步，可通过「我的存档」导出／导入。

## v54 更新

- 首场给出两张同维候选，预览卡面、星级、单卡分、组合奖励与故事，再选一张永久收入收藏。以后从已有收藏改写，每场可确认一次。
- 七枚称号印记记录逐步增加的组合探索，不改变卡牌数值和抽率，不要求签到或传播。
- 每张重复卡补偿一次全卡池单抽；补抽仍重复就返还该次机会，刷新和导入不会重复发奖。
- 六个卡名进入连续故事，空间、演法、手段和人物选择参与事件。群体人物、无声人物及旧五卡保留各自边界。
- 分享图突出故事标题、具体转折与原有咫牌卡面；卡组分和戏格放在次要位置。二维码和当前地址都指向固定版本。
- 收藏、成就、补抽余额、任务、保底和最近节目单可导出为 JSON；导入先预览再确认。移除分享／复制奖励，增加问题反馈入口。

保留原有咫牌小人、衣饰、500 张常驻卡及评分和星级概率。免费、免登录的邀请试玩不等于已经验证公开朋友圈传播；真实微信与朋友体验按[首轮试玩清单](docs/INVITE_PLAYTEST_V54.md)验收。

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
