# v57 · 咫台检索深链对齐

提交日期：2026-11-16（UTC+8）。

固定提交：见本分支提交 · [源码快照](https://github.com/Canoeliu917/DiaGacha/tree/codex/scoring-v38)

[打开 v57](https://canoeliu917.github.io/DiaGacha/?v=57) · [固定分享入口](https://canoeliu917.github.io/DiaGacha/releases/v57/index.html)

## 改动

- 这是检索深链对齐，不是重写 500 张卡面文案。正式卡的 id、名称、维度、稀有度、攻防、名气、图鉴编号、评分和审阅字段不改；小注、看点、简介、原因、标签、短句和排演句不改。277 张预留卡不改。原有 364 篇高星短文不改。146 条名词解释及其咫台链接不改：与正式卡同名的词条链接已经和核对结果一致。
- 500 张正式卡的 `diastageSearchUrl` 与 `diastageCategory` 对齐到已核对的 https://diastage.art 检索。其中 495 张本来就一致。实际改动 5 张的跳转地址，其中 2 张同时改分类：
  - 媚香楼：分类由 knowledge 改为 scripts。查询词仍是「媚香楼」。
  - 关汉卿剧目卡：分类由 scripts 改为 knowledge。查询词只用「关汉卿」。
  - 商鞅：去掉重复查询「商鞅 商鞅」，只查「商鞅」。
  - 阿伽门农：去掉重复查询「阿伽门农 阿伽门农」，只查「阿伽门农」。
  - 瓦尼亚舅舅：检索改为「万尼亚舅舅 瓦尼亚舅舅」。
- 《西厢记》仍不发布，正式卡上的 scripts 检索链接保留。
- 运行时没有 `searchQueries` 或 `diastageCoverage` 字段，本次不写入。跳转使用已去掉「卡名 卡名」重复词的检索地址。
- 新分享地址改为 `releases/v57/index.html`。公开入口使用 `?v=57` 刷新缓存。v54、v55、v56 归档文件未改。

## 验证与边界

- 500 个正式 id 与 `docs/ACTIVE_CARDS_V39.json` 的 `activeIds` 顺序一致。500 张 `diastageSearchUrl` / `diastageCategory` 与核对稿一致，网址全部是 https://diastage.art。
- 身份字段、文案字段、预留卡、高星短文和名词解释链接逐项比对未改。
- 分享地址测试改为指向 v57。v54 哈希仍为 `1ba713cc32fcec1ee8479dd9b6a1da4bc950618fa5e8e93ee350fe61258345c4`，v55 哈希仍为 `ed6942deed45e61c53cbdd5eaa359c67cf4cf11a0c12ea4181db0f13af5aff5d`。v56 归档字节保持发布时的哈希。
- 未做公开页面部署后的在线复核，也未逐条打开咫台检索结果。代码提交不等于已经上线。

## 发布

- 根目录页面与 `releases/v57/index.html` 为同一份 v57。v54、v55、v56 目录保持原字节。Pages 构建完成前，公开地址仍可能暂时显示上一版。本次不合并，留给发起方核对。

[返回版本总目](../CHANGELOG.md)
