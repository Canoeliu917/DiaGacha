# V42 · 游戏翻页、卡片解释与六芒星对比

Git 提交日期：2026-11-12 17:14:51（UTC+8）。这是提交时间，不是部署完成时间。

- [固定提交 d9caa7a](https://github.com/Canoeliu917/DiaGacha/commit/d9caa7aab4a0fc419492bd3245abf2a0cf2bdbee)
- [该提交的源码快照](https://github.com/Canoeliu917/DiaGacha/tree/d9caa7aab4a0fc419492bd3245abf2a0cf2bdbee)

本记录根据提交内容和带版本号的工作文件追溯整理。新增的 `scripts/page-history-v42.js`、配套样式与测试，以及 `scripts/radar-contrast-v42.test.cjs` 是版本依据；当时没有独立的 V42 日志或历史 Git tag。网址中的旧 `?v=` 参数不是历史源码或游戏快照。

## 改动

- 新增游戏内前后页箭头，保留页面、滚动位置和已抽卡组；返回不回滚收藏、次数或保底，也不重新抽卡。
- 首页大 Logo 与十个小人共同响应指针，并在离开、隐藏或减少动态效果时清理响应。
- 六芒星使用统一非线性显示尺度，放大常见分差；六维数字保持原分，同一分数在不同卡组中的半径一致。
- ATK／DEF 解释共享一次来源与编辑说明，减少重复；扩写《桑树坪记事》的具体事件与群像介绍。
- 复核《阿伽门农》，将 ATK／DEF 调整为 94／94，补充原作、分场和教学资料；来源锚点从 32 张增至 33 张。分数属于游戏编辑判断，资料本身不提供这些数值。

## 检查证据与限制

该提交新增 `scripts/page-history-v42.test.cjs`，覆盖翻页边界、滚动恢复、卡组快照和存档不回滚；`scripts/radar-contrast-v42.test.cjs` 检查原分不变、全区间单调、跨卡组同分同半径及旧五卡兼容。卡详情和首页交互的专项测试同步更新。

`docs/SCORING_ANCHORS.json` 保存《阿伽门农》的分项、来源和复评理由；`scripts/high-star-plays-sources-v40.json` 与对应正文保存剧目扩写资料。以上是当时保留的检查代码与记录，本次未重跑旧测试，不补写历史通过数量、部署时间或真实手机测试结论。

[返回修改记录总目](../CHANGELOG.md)
