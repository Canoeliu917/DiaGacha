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

v40 的首页小人可随指针轻柔浮动。六卡总览只展示同星与羁绊评价，点击词条时实际关联卡同步轻震；演后谈逐维呈现卡片与六芒星角分，最后成图并计分。高星介绍在卡面均分区域逐句显隐，全部结束后震动开裂亮牌。1 至 7 星依次为白、绿、蓝、紫、橙、彩虹粉、炫光黑，七星保留暗场揭幕。普通 5 星出率为 10%、6 星为 5%。点击 ATK 或 DEF 可分别展开解释；低星同样保留核心知识与出处。演后谈以明确标注的虚构故事串联六维，另列戏剧科普和阅读参考，编辑依据见 [EDITORIAL_V40.md](docs/EDITORIAL_V40.md)。继续采用整数评分、同星剧组称号与原作羁绊；总分含奖励最多 100。卡面保留纸片小人画风，已有收藏与旧分享链接仍可读取。

数值是游戏编辑判断。32 张来源锚点与 745 张历史初评分开标记，不等于全卡学术审定。卡面造型审查按轮廓、姿态、服饰与道具进行，不把 SVG 不同或配色不同当作感知相似度证明。

复现本轮更新：依次运行 `python scripts/build-art-profiles-v39.py`、`python scripts/integrate-scoring-v38.py`、`python scripts/integrate-v39.py`、`node scripts/build-high-star-copy-v40.cjs`、`python scripts/integrate-v40.py`。常驻范围以 `docs/ACTIVE_CARDS_V39.json` 的固定 ID 列表为准。
