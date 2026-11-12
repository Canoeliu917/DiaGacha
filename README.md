# DiaGacha·咫牌

戏剧混搭抽卡网页游戏。现行版本 **v40**：500 张常驻卡，777 张长期总图鉴。

在浏览器中直接打开 `index.html` 即可游玩，或使用手机打开：

- [DiaGacha · 咫牌](https://diagacha-v38.whole-elk-7752.chatgpt.site)（网址保留旧版名称，内容随版本更新）

## 内容

- `index.html` — 现行完整游戏（500 张常驻、277 张预留，单文件，v40）
- [CHANGELOG.md](CHANGELOG.md) — 修改记录总目
- `changelog/` — 各版本原始修改记录与相关说明，内容未改写
- `docs/SCORING.md` — 卡牌分数与「这台」评分规则
- [docs/RUBRIC.md](docs/RUBRIC.md) — 六维量表、剧作家/剧目参考与来源
- [docs/BALANCE_REPORT.json](docs/BALANCE_REPORT.json) — 十万包模拟与边界验证
- `docs/RATES.md` — 抽卡出现率
- `docs/cards.json` — 卡牌数据

v40 为六卡总览和演后谈加入同星与羁绊点选联动、逐句渐显的连续排演故事、高星揭幕与 189 张高星卡的分层正文。1 至 7 星依次为白、绿、蓝、紫、橙、彩虹粉、炫光黑；七星以暗场揭幕，介绍始终附着卡面。加分卡面短促轻震，六芒星按卡片依次显示整数角分再成图。普通 5 星出率为 10%、6 星为 5%。详情中的「评分依据」可展开解释两轴。继续采用整数评分、同星剧组称号与原作羁绊；总分含奖励最多 100。角色介绍补充出处，卡面使用明确的人物、服饰、道具与场景配置，保留纸片小人的画风。预留卡不进入常驻抽取和图鉴，已有收藏与旧分享链接仍可读取。

数值是游戏编辑判断。32 张来源锚点与 745 张历史初评分开标记，不等于全卡学术审定。卡面造型审查按轮廓、姿态、服饰与道具进行，不把 SVG 不同或配色不同当作感知相似度证明。

复现本轮更新：依次运行 `python scripts/build-art-profiles-v39.py`、`python scripts/integrate-scoring-v38.py`、`python scripts/integrate-v39.py`、`node scripts/build-high-star-copy-v40.cjs`、`python scripts/integrate-v40.py`。常驻范围以 `docs/ACTIVE_CARDS_V39.json` 的固定 ID 列表为准。
