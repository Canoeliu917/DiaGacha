# DiaGacha · 咫牌

戏剧混搭抽卡网页游戏。当前公开游戏为 **v51**（2026-11-14）：500 张常驻卡，777 张长期总图鉴。

## 打开游戏与版本记录

- **[手机／电脑打开最新版](https://canoeliu917.github.io/DiaGacha/?v=51)**
- **[全部版本更新记录：v21–v51](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/CHANGELOG.md)**
- [v51 本次改动与验收](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/CHANGELOG-v51.md)
- [最新版完整源码](https://github.com/Canoeliu917/DiaGacha/tree/codex/scoring-v38) · [v51 固定源码快照](https://github.com/Canoeliu917/DiaGacha/tree/99392d3509bccf9b2c7fff62acd615794d01316a)

当前游戏由 `codex/scoring-v38` 分支根目录发布。仓库默认首页也提供上述导航；查看或下载完整最新版时，请使用“最新版完整源码”。下载后直接在浏览器打开其中的 `index.html` 即可游玩。

游戏入口始终指向最近发布版，网址中的 `?v=51` 仅用于刷新缓存，不能用来切换历史版本。历史版本请通过更新记录中的固定提交和源码快照查看。

[原 Sites 入口](https://diagacha-v38.whole-elk-7752.chatgpt.site)仍同步更新；若出现访问拦截，请使用上方 GitHub Pages 手机入口。不同域名的收藏保存在各自浏览器存储中，切换入口不会删除原网址的收藏。

## v51 更新

- 放大抽卡左上角的稀有度称号和星标；手机六卡总览中称号与星列分行，完整保留七颗星。
- 5／6／7 星在卡面完全揭幕后逐颗亮起，再进入总览；跳过、减少动态和详情返回保留完整显示。
- 收敛微笑与狡黠笑弧，把黑色新月形“笑口”改为小嘴与独立下巴胡须，覆盖 41 张常驻人物牌。

本版 142 项自动检查通过，GitHub Pages 线上文件与验收版本一致。浏览器预览服务连接超时，本版手机动效未完成实际目测，不能据自动检查声称实体 iPhone／微信内核或真实帧率已验证。

## 玩法与资料

一包六张，组成剧目、主演、配角、演法、手段、空间六个维度。卡片综合分取攻防均值四舍五入，按统一档位决定星级；同星和明确原作羁绊可加分，整台含奖励最多 100 分。点击 ATK／DEF 查看解释；“咫言咫语”将虚构故事、戏剧科普和资料参考分开呈现。

- [评分规则](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/SCORING.md) · [六维量表与参考](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/RUBRIC.md) · [抽卡出现率](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/RATES.md)
- [固定常驻名单](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/ACTIVE_CARDS_V39.json) · [卡片数据](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/cards.json)
- [500 张核心事实核查说明](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/FACT_AUDIT_V50.md) · [此前 v48 核查记录](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/docs/FACT_AUDIT_V48.md)
- [后续版本记录方式](https://github.com/Canoeliu917/DiaGacha/blob/codex/scoring-v38/changelog/README.md)

v50 已整合 500 张常驻卡的逐卡核心事实记录：464 张新增核查，36 张复用此前证据。这不等于通读 500 部原剧或全文逐句认证；部分证据仅覆盖公开摘要、预览与可见段落。评分仍是游戏编辑判断，跨剧故事属于创作联想。人物造型按轮廓、姿态、衣饰和道具区分，不把几何不同冒称为感知相似度低于某个百分比。
