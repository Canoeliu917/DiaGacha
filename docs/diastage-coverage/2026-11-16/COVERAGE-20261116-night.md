# 咫牌 500 卡与咫台夜间第二轮全文覆盖（2026-11-16）

独立验收，不以任务自报数为准。依据工作机 `D:\GrokBot\DiaStage\DiaMotif\records\diagacha-remaining-coverage-20261115-audit.json`（mtime 2026-11-15 21:51 上海时间）逐行复算，并与同目录 `verification.json`、`ready.txt`（2026-11-16 02:51 上海时间，EXITCODE=0）、`DiaMotif\knowledge\diagacha-search-index-20261115-night.json`（mtime 2026-11-15 21:40 上海时间）交叉核对。随后在本机 `http://127.0.0.1:4318` 抽检检索与正文（约 2026-11-16 02:57–03:01 上海时间）。覆盖数字与回执一致。

本次只做本地深链对齐，未发布、未开 GitHub PR 或 v57、未改正式 Pages，也未把卡面链接改到临时隧道或本机地址。检索域名一律保持 `https://diastage.art`。未改任何正式卡的编号、名称、维度、稀有度、分数或攻击／防御／声望。这是机器识别，不是逐字人工校勘。PDF 原件仍本机私有，未开放整本下载。《西厢记》仍不发布。

## 覆盖

| 状态 | 晚间基线 | 夜间第二轮 | 说明 |
| --- | ---: | ---: | --- |
| 详细出处 DETAILED | 104 | 223 | 能核实同作品人物／空间或术语解释的正文 |
| 仅书目 METADATA_ONLY | 3 | 1 | 只剩关汉卿剧目卡 `xplay-guantheplay` |
| 暂缺 MISS | 392 | 275 | 本批正文尚不能核实 |
| 不发布 BLOCKED | 1 | 1 | 《西厢记》`play-xixiang` / WXJ-S01 |

DETAILED 净增 119。转移关系：MISS→DETAILED 117；METADATA_ONLY→DETAILED 2（纱幕 `ydir-gauze`、台词节奏 `xdir-nian`）；原 104 张详细出处全部保留；METADATA_ONLY 留 1、BLOCKED 留 1、MISS 留 275。无回退。审计里的 `previousStatus` 与晚间审计状态全部一致。500 张卡 id 与晚间、正式版、夜间索引完全相同。

分维：剧目 37/100 详细（另 1 张仅书目、1 张不发布）；主演 44/100；配角 55/85；风格体系 44/75；导演手法 25/75；环境 18/65。

夜间索引与审计：500 个 id 一致；`diastageSearchUrl` 与审计 `url` 无差异；`diastageCategory` 与审计 `category` 无差异；全部 URL 均为 `https://diastage.art/?q=...`，可选 `category`，无隧道或 localhost。URL 中的查询词都在该卡 `searchQueries` 里。16 张卡的索引 `resourceIds` 是审计 `hitIds` 的超集（多保留了书目／概念或旧 F 盘目录 id，详细正文 id 都在）；另 2 张只是同组 id 顺序不同。未发现正式身份字段被改。`verification.json` 中 `cardIdentityPreserved` 为 true。审计、索引、ready 用字检查未见把「咫台／咫牌」写成缺笔或近形错字，也未见「繁漪」被写错。

审查新升为详细出处的 119 张时，19 张新剧目卡的来源标题均与卡名相符；主演／配角／环境的举证多为同剧正文或英文原文中的实际发言角色／场景，理由里出现的「不是他剧提及」是排除性说明，不是反例。纱幕、台词节奏的摘录是术语讲解，不是点到为止的书目。未把词面提及、同名他剧或父剧命中改判为详细。本次未逐字重读全部正文；机器识别仍不等于人工校勘。

## 业主新授权 5 项

这 5 项都不是 500 张正式卡的 id 或名称，因此不会作为卡条目出现在夜间 500 卡索引里。已在本机公开检索中抽检，情况如下。

1. 洪昇《长生殿》（`owner-ocr-20261115-night-csd-s01`）：scripts 检索 HTTP 200、total=4，自身排第一，`publicSearch=true`，`reviewStatus=OWNER_APPROVED`。正文 `GET /api/diamotif/script-text/...` HTTP 200，`text/plain`，实测 99946 字（回执写 99682）。题头标明新文化书社 1933 年五月四版新式标点本、FIRSTPASS_COMPLETE 276/276、首遍稿、1624 处疑读未裁决、不是核审稿或定本，并写明本次不开展回校／二遍／核审。正文中可见〔〕疑读。全文〔＝1625、〕＝1625，与题头「1624 处」相差 1。检索同词还命中《杨贵妃之死》《夜店》《梧桐雨》，那些是相关作品或他剧，不能替代本剧正文。

2. 白朴《梧桐雨》（`owner-ocr-20261115-night-bp-s01`）：scripts 检索 HTTP 200、total=1，自身正文 HTTP 200，实测 12564 字（回执写 12308）。题头标明明顾曲斋刻《古杂剧二十种》第 3 册、FIRSTPASS_COMPLETE 27/27、首遍稿、117 处疑读未裁决、不是核审稿或定本；同样写明未开下一遍。全文〔＝115、〕＝115，与题头「117 处」相差 2。

3. 柯仲平《无敌民兵》（`owner-ocr-20261115-night-kzp-s01`）：scripts 检索 HTTP 200、total=1，自身正文 HTTP 200，实测 60133 字。题头写明新华书店 1949 年版、库中 NLC 原扫描 169 页的既有未审 OCR、含扫描 5—166 页（戏剧文字扫描 9—152 页），识别进度 162/169 页，非人工终校或定本。检索摘要也写明没有扫描 1—4、167—169 页文字。正文从扫描页 5 的「前記」起，OCR 质量很差；括号不对称（〔＝46、〕＝23），不能按长生殿／梧桐雨那种疑读计数理解。

4. 田汉《关汉卿》：查询「关汉卿」且 category=scripts，HTTP 200、total=0，没有该剧公开正文。查询「关汉卿」且 category=knowledge，total=22，第一条是书目卡 `htc-20261108-guanhanqing`（《关汉卿》｜田汉·来源卡），与剧目卡仍为 METADATA_ONLY 相符。查询「田汉 关汉卿」或「田汉《关汉卿》」且 category=scripts 时，本机 total=1，命中的是关汉卿《窦娥冤》（`pd-script-20261108-ghq-s01-doueyuan`），不是田汉此剧；按规则不能算详细覆盖。回执写这两条查询 scripts total=0，与本机实测的 total 不一致，但结论一致：没有田汉《关汉卿》公开正文，也不能用关汉卿其他作品或《窦娥冤》替代。

5. 张道藩《开羽》：查询「开羽」（scripts 或未限分类）以及「關羽」「关羽」「张道藩」的 scripts 检索均为 HTTP 200、total=0。未见把赵清阁《關羽》当作《开羽》发布。

## 本机抽检

本机 API `GET /api/health` 为 200（抽检时时间戳 2026-11-15T18:57:29.222Z，即 2026-11-16 02:57:29 上海时间）。下列均为 `GET /api/diamotif/search`，HTTP 200。

| 查询 | 分类 | total | 第一条命中 | 是否同作品／相应正文 |
| --- | --- | ---: | --- | --- |
| 雷雨 | scripts | 2 | `...49001f98b0577ab6`《雷雨》曹禺 | 是；第二条为旧目录 id |
| 雷雨 繁漪 | scripts | 1 | 同上《雷雨》 | 是 |
| 繁漪 | scripts | 1 | 同上《雷雨》 | 是 |
| 茶馆 | scripts | 2 | `...47586e6650b35ad6`《茶馆》老舍 | 是；第二条为旧目录 id |
| 哈姆雷特 | scripts | 1 | `...13c938216219a670`《哈姆雷特》 | 是 |
| 间离术 | knowledge | 3 | 中央戏剧学院考研词条 | 术语条目命中 |
| 周公馆 | scripts | 1 | 《雷雨》曹禺 | 同剧空间 |
| 麦克白 | scripts | 1 | `owner-ocr-20261115-mit-macbeth`《麦克白》 | 是（英文公版） |
| 纱幕 | knowledge | 7 | 《戏剧艺术十五讲》 | 是；另有概念卡 `concept:scrim` |
| 台词节奏 | knowledge | 2 | 《中国话剧艺术史第4卷》 | 是；第二条为书目 |
| 西厢记 | scripts | 0 | — | 未公开 |
| 西厢记 | （不限） | 19 | 《桃花扇》等他书提及 | 结果中无 WXJ-S01，也无标题恰为「西厢记」的条目 |
| 长生殿 / 梧桐雨 / 无敌民兵 / 开羽 / 关汉卿 | 见上节 |  |  |  |

《麦克白》《雷雨》正文接口同样 HTTP 200，可打开全文。西厢记正式卡面仍保留 scripts 检索链接，未静默删除。

## 正式卡面深链（仅本地对齐，尚未并入正式版）

底稿为晚间已对齐、但未合入 GitHub 的 `cards-500-optimized-linked-aligned.json`。夜间包只更新了 `searchQueries`、`diastageCategory`、`diastageSearchUrl`、`diastageCoverage`；身份字段与晚间包、正式 v56 一致。所有链接仍指向 `https://diastage.art`。

对照现行正式版 v56 的「在咫台检索」字段，500 张里仍有 **126** 张需要日后补丁：

**A. 仍未合入正式版的 5 处 URL／分类修订（与晚间结论相同，夜间继续成立）：**

1. 媚香楼：分类 `knowledge` 改为 `scripts`（详细出处在《桃花扇》正文）。查询词不变。
2. 关汉卿（剧目卡）：分类 `scripts` 改为 `knowledge`，查询词只保留「关汉卿」、去掉「窦娥冤」。夜间仍为仅书目。
3. 商鞅：去掉重复检索词「商鞅 商鞅」，URL 改为只查「商鞅」。夜间仍为暂缺。
4. 阿伽门农：去掉重复检索词「阿伽门农 阿伽门农」，URL 改为只查「阿伽门农」。夜间仍为暂缺。
5. 瓦尼亚舅舅：检索词补上异写「万尼亚舅舅」，URL 改为 `万尼亚舅舅 瓦尼亚舅舅`；夜间索引另外补了英文名 `VOITSKI`。该卡已由暂缺升为详细出处（同剧英译《万尼亚舅舅》正文中的 IVAN (VANYA) VOITSKI）。

这 5 处会改 URL；其中 2 处同时改分类。正式版《西厢记》的 scripts 检索 URL 保持原样。

**B. 查询词更新 125 张（相对正式 v56；相对晚间对齐包是 122 张，URL／分类不再变化）：**

- 新增拉丁／英文别名 69 张（如 `VOITSKI`、`MACBETH`、`NORA`），与同剧英文正文对应，便于检索。
- 新增中文异写或相关词 30 张（如「间离效果」「贫困戏剧」「厄耳锡诺」「雷欧提斯」）。
- 新增「剧名＋卡名」组合查询 9 张。
- 收紧 2 张：`play-secret` 暗恋桃花源去掉过宽的「暗恋」「桃花源」；`yplay-threepenny` 三毛钱歌剧去掉「乞丐歌剧」（那是另一部作品）。
- **质量提醒：** 夜间索引给 55 张卡加了「卡名 卡名」这种重复查询（如「麦克白 麦克白」「史诗剧场 史诗剧场」），与晚间已修正的商鞅／阿伽门农问题同类。这些重复词**没有**写进 URL。本地包为与夜间索引对齐已照收；日后正式补丁可单独决定是否去掉。

**C. `diastageCoverage` 字段：** 相对晚间对齐包更新 119 张（117 张 MISS→DETAILED，2 张 METADATA_ONLY→DETAILED）。正式 v56 卡面本来没有这一字段。

名词解释 146 条里，与正式卡同名且本轮新升为详细出处的有：人物弧光、台词节奏、风俗喜剧、史诗剧场、质朴戏剧、神秘剧、升降台、纱幕、边幕。这些词条现有 `diastage.art` 链接已与审计一致，故未另改名词解释文件。

完整字段对照见 `LINK-CHANGES-20261116-night.json`。本地对齐包：`cards-500-optimized-linked-aligned-night.json`。卡面仍只放短词条和链接，不写入剧本全文。

## 本轮新升为详细出处的 119 张

原先 104 张详细出处全部保留，不重复抄录。

### 剧目（新 19）
- 俄狄浦斯王（`play-oedipus`）
- 麦克白（`play-macbeth`）
- 玩偶之家（`play-doll`）
- 李尔王（`play-lear`）
- 安提戈涅（`play-antigone`）
- 赵氏孤儿（`play-orphan`）
- 建筑大师（`play-palace`）
- 三姐妹（`play-sisters`）
- 海达·高布乐（`play-butterfly`）
- 万尼亚舅舅（`xplay-vanya`）
- 威尼斯商人（`xplay-merchant`）
- 罗密欧与朱丽叶（`xplay-romeo`）
- 人民公敌（`yplay-enemy`）
- 钦差大臣（`yplay-inspector`）
- 暴风雨（`yplay-tempest`）
- 理查三世（`yplay-richard`）
- 裘力斯·凯撒（`yplay-caesar`）
- 野鸭（`yplay-whitesnake`）
- 亨利四世（`play-v21-henryiv`）

### 主演（新 25）
- 俄狄浦斯（`role-oedipus`）  — 俄狄浦斯王
- 娜拉（`role-nora`）  — 玩偶之家
- 麦克白（`role-macbeth`）
- 麦克白夫人（`role-ladym`）  — 麦克白
- 安提戈涅（`role-anti`）
- 程婴（`role-chengying`）  — 赵氏孤儿
- 李尔（`role-lear`）  — 李尔王
- 洛夫伯格（`role-zhu`）  — 海达·高布乐
- 朱丽叶（`xrole-juliet`）  — 罗密欧与朱丽叶
- 海达（`xrole-hedda`）  — 海达·高布乐
- 考狄利娅（`xrole-cordelia`）  — 李尔王
- 三女巫（`yrole-witches`）  — 麦克白
- 普洛斯彼罗（`yrole-prospero`）  — 暴风雨
- 爱丽儿（`yrole-ariel`）  — 暴风雨
- 理查三世（`yrole-richardiii`）
- 福斯塔夫（`yrole-falstaff`）  — 亨利四世
- 海尔茂（`yrole-helmer`）  — 玩偶之家
- 斯多克芒（`yrole-stockmann`）  — 人民公敌
- 赫列斯达可夫（`yrole-khlestakov`）  — 钦差大臣
- 格莱格斯（`yrole-baisuzhen`）  — 野鸭
- 泰斯曼（`yrole-liangshanbo`）  — 海达·高布乐
- 布鲁图斯（`yrole-brutus`）  — 裘力斯·凯撒
- 凯列班（`yrole-wukong`）  — 暴风雨
- 瓦尼亚舅舅（`role-v21-unclevanya`）  — 万尼亚舅舅
- 阿斯特罗夫（`role-v21-astrov`）  — 万尼亚舅舅

### 配角（新 34）
- 克瑞翁（`role2-creon`）  — 安提戈涅
- 伊斯墨涅（`role2-ismene`）  — 安提戈涅
- 乳母（朱丽叶）（`role2-juliet-nurse`）  — 罗密欧与朱丽叶
- 茂丘西奥（`role2-mercutio`）  — 罗密欧与朱丽叶
- 班柯（`role2-banquo`）  — 麦克白
- 麦克德夫（`role2-macduff`）  — 麦克白
- 莱尔提斯（`role2-laertes`）  — 哈姆雷特
- 乔特鲁德（`role2-gertrude`）  — 哈姆雷特
- 高纳里尔（`role2-goneril`）  — 李尔王
- 里根（`role2-regan`）  — 李尔王
- 爱德蒙（`role2-edmund`）  — 李尔王
- 肯特（`role2-kent`）  — 李尔王
- 弄人（`role2-fool-lear`）  — 李尔王
- 格洛斯特（`role2-gloucester`）  — 李尔王
- 爱德伽（`role2-edgar`）  — 李尔王
- 马尔科姆（`role2-malcolm`）  — 麦克白
- 邓肯（`role2-duncan`）  — 麦克白
- 林丹太太（`role2-kristine-linde`）  — 玩偶之家
- 柯洛克斯泰（`role2-krogstad`）  — 玩偶之家
- 洛巴辛（`role2-lopakhin`）  — 樱桃园
- 瓦里雅（`role2-varya`）  — 樱桃园
- 安妮娅（`role2-anya-cherry`）  — 樱桃园
- 特罗费莫夫（`role2-trofimov`）  — 樱桃园
- 谢列布里亚科夫（`role2-serebryakov`）  — 万尼亚舅舅
- 索尼娅（`role2-sonya`）  — 万尼亚舅舅
- 叶列娜（`role2-yelena`）  — 万尼亚舅舅
- 图森巴赫（`role2-tuzenbach`）  — 三姐妹
- 索列尼（`role2-solyony`）  — 三姐妹
- 韦尔希宁（`role2-vershinin`）  — 三姐妹
- 安德烈（`role2-andrei-three-sisters`）  — 三姐妹
- 阿尔卡季娜（`role2-arkadina`）  — 海鸥
- 尼娜（`role2-nina`）  — 海鸥
- 特里戈林（`role2-trigorin`）  — 海鸥
- 市长（`role2-mayor-inspector`）  — 钦差大臣

### 风格体系（新 23）
- 史诗剧场（`style-epic`）
- 荒诞派（`style-absurd`）
- 质朴戏剧（`style-poor`）
- 回顾式（`xstyle-kunqu`）
- 叙述者（`xstyle-puppetry`）
- 政治剧场（`xstyle-political`）
- 多线情节（`xstyle-nanxi`）
- 分场结构（`xstyle-zaju`）
- 实验剧场（`xstyle-lab`）
- 文乐（`xstyle-bunraku`）
- 人物弧光（`ystyle-qinqiang`）
- 配角功能（`ystyle-budaixi`）
- 演员距离（`ystyle-takarazuka`）
- 神秘剧（`ystyle-mystery`）
- 批判现实主义（`ystyle-criticalreal`）
- 风俗喜剧（`ystyle-manner`）
- 通俗情节剧（`ystyle-shinkoku`）
- 古典诗学（`ystyle-sanskrit`）  — 诗学
- 寓言剧（`style-v21-fable`）
- 家庭剧（`style-v21-family`）
- 总体戏剧（`v23-style-total`）
- 市民悲剧（`v23-style-bourgeois-tragedy`）
- 历史剧场（`v23-style-historyplay`）

### 导演手法（新 10）
- 背身（`xdir-backturn`）
- 当众换景（`xdir-changeset`）
- 观众入戏（`xdir-enter`）
- 台词节奏（`xdir-nian`）
- 切光（`ydir-qieguang`）
- 纱幕（`ydir-gauze`）
- 升降台（`ydir-liftstage`）
- 伴唱（`ydir-bansing`）
- 冷场（`ydir-coldstage`）
- 边幕（`ydir-legdrop`）

### 环境（新 8）
- 艾尔西诺城堡（`place-elsinore`）  — 哈姆雷特
- 邓西嫩城堡（`place-dunsinane`）  — 麦克白
- 娜拉的客厅（`place-parlor`）  — 玩偶之家
- 城市动物园（`place-zoo`）  — 恋爱的犀牛
- 李尔的荒原（`place-heath`）  — 李尔王
- 黑匣子（`place-blackbox`）
- 普洛斯彼罗的岛（`place-island`）  — 暴风雨
- 曾家花厅（`place-zeng`）  — 北京人

## 与回执的出入（不影响覆盖计数）

- 长生殿／梧桐雨正文实测字数与回执不完全相同（99946 对 99682，12564 对 12308）；〔〕实数与题头声明也差 1–2 处。题头关于首遍、疑读未裁决、未开回校／二遍／核审的说明，抽检属实。
- 「田汉 关汉卿」「田汉《关汉卿》」在 scripts 分类下本机 total=1，命中《窦娥冤》，不是田汉此剧。回执写 total=0。以「关汉卿」+scripts 计则双方都是 total=0。
- 上述出入不改变 223／1／275／1 的 500 卡覆盖数字，也不改变「没有田汉《关汉卿》公开正文、没有把《關羽》当作《开羽》发布」的结论。

未建议发布。若要并入正式版，需另开补丁，并继续使用 `https://diastage.art`。
