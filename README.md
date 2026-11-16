# DiaGacha · 咫牌

戏剧混搭抽卡网页游戏。当前版本 **v57**（2026-11-16）面向小范围邀请试玩：500 张常驻卡，777 张长期总图鉴。

## 打开游戏与版本记录

- **[手机／电脑打开 v57](https://canoeliu917.github.io/DiaGacha/?v=57)**
- **[固定分享入口 v57](https://canoeliu917.github.io/DiaGacha/releases/v57/index.html)**
- **[500张卡的碰撞学习图鉴](https://canoeliu917.github.io/DiaGacha/docs/collision-explorer-v55.html)**
- **[全部版本更新记录：v21–v57](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/CHANGELOG.md)**
- [v57 本次改动与验收](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/CHANGELOG-v57.md)
- [最新版完整源码](https://github.com/Canoeliu917/DiaGacha/tree/codex/scoring-v38) · [v56 固定试玩归档](https://canoeliu917.github.io/DiaGacha/releases/v56/index.html) · [v55 固定试玩归档](https://canoeliu917.github.io/DiaGacha/releases/v55/index.html) · [v54 固定试玩归档](https://canoeliu917.github.io/DiaGacha/releases/v54/index.html)

当前游戏由 `codex/scoring-v38` 分支根目录发布。仓库默认首页也提供上述导航；查看或下载完整最新版时，请使用“最新版完整源码”。下载后直接在浏览器打开其中的 `index.html` 即可游玩。

根目录游戏入口指向最近发布版，网址中的 `?v=数字` 仅用于刷新缓存。v54 起使用 `releases/v54/index.html` 固定版本路径分享结果；以后的更新必须保留该文件，保证旧卡组继续显示当时的故事和分数。更早版本请通过更新记录中的固定提交和源码快照查看。

[原 Sites 入口](https://diagacha-v38.whole-elk-7752.chatgpt.site)为旧入口；请使用上方 GitHub Pages 入口。同一浏览器中同一域名的根目录和版本目录共用收藏；不同浏览器、域名和设备不自动同步，可通过「我的存档」导出／导入。

## 视觉设计记录

- [红线视觉设计 V10：效果图、交互预览与跨电脑接续记录](docs/red-thread-design/2026-11-16-v10/README.md)

## v57 更新

- 500 张正式卡的「在咫台检索」对齐到已核对的 https://diastage.art 检索地址和分类。这是深链对齐，不是重写卡面文案。
- 编号、名称、维度、稀有度、攻防、名气、评分、小注、看点和标签都不改。277 张预留卡不改。
- 新分享指向 `releases/v57/index.html`。公开入口使用 `?v=57`。v54、v55、v56 归档不改。

## v56 更新

- 500 张正式卡的小注、看点、简介和标签换成已审核文案；编号、名称、稀有度、攻防、名气和评分不变。
- 146 条名词解释换成带例子的审核稿。33 张原先缺少压轴短文的卡补入短文，原有高星短文保留。
- 卡面详情增加「在咫台检索」。点开标签仍先看游戏内名词解释，解释下可再检索该术语。
- 新分享指向 `releases/v56/index.html`。v54、v55 归档不改。

## v55 更新

- 六张卡下分别替换同维收藏，六芒星与卡组分紧随其后。自有卡可以反复换，故事、奖励和分享同步更新；首场试选仍只领取一张。
- 倒数第二页解释同星奖励、原作关系、创意碰撞及实际计入分数。取消自动轮流跳动，特殊进化仅柔和亮一次。
- 47组精选双卡、10类人工行动规则、4组三卡进化；500张卡都有知识和探索路径，103,650组跨维双卡已索引。精选、规则生成与探索提问分别标示，不把索引冒称逐对人工审读。
- 新增112条按剧情及人物行动匹配的标题。人物×空间反馈优先显示，碰撞片段明确是主故事之外的可能展开。
- 综合包空间低星单卡上限从8%降为5%；高星出率、保底、原小人和卡牌数值保留。

[完整规则与范围](docs/COLLISION_GUIDE_V55.md) · [全部双卡索引CSV](docs/COLLISION_INDEX_V55.csv) · [新增标题清单](docs/STORY_TITLES_V55.md)

## v54 历史更新

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
- [咫人原型与规格](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/figure-design/README.md)

v50 已整合 500 张常驻卡的逐卡核心事实记录：464 张新增核查，36 张复用此前证据。这不等于通读 500 部原剧或全文逐句认证；部分证据仅覆盖公开摘要、预览与可见段落。评分仍是游戏编辑判断，跨剧故事属于创作联想。人物造型按轮廓、姿态、衣饰和道具区分，不把几何不同冒称为感知相似度低于某个百分比。
