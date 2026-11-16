# 咫牌 500 卡与咫台第三轮 batch21 全文覆盖（2026-11-16）

独立验收，不以同步回执自报数为准。依据工作机 `D:\GrokBot\DiaStage\DiaMotif\records\diagacha-remaining-coverage-20261116-batch21-audit.json`（mtime 2026-11-16 03:45:07 上海时间）逐行复算，并与同目录 `verification.json`、`ready.txt`、`link-evidence.json` 以及 `DiaMotif\knowledge\diagacha-search-index-20261116-batch21.json`（同一时间戳）交叉核对。随后在本机 `http://127.0.0.1:4318` 对 20 条新公开资源与 45 张新升级卡抽检检索与正文（约 2026-11-16 03:56–04:00 上海时间）。覆盖数字与回执一致：268／1／230／1。

本次只做本地深链对齐，未发布、未开 GitHub PR 或 v58、未改正式 Pages，也未把卡面链接改到临时隧道或本机地址。检索域名一律保持 `https://diastage.art`。未改任何正式卡的编号、名称、维度、稀有度、分数或攻击／防御／声望。这是机器识别，不是逐字人工校勘。PDF 原件仍本机私有，未开放整本下载。《西厢记》仍不发布。第三轮仍在进行，本批是累计稿 batch21，不是无后缀的最终 ready。顺序处理 183/276 只是工作队列进度，不能当成覆盖口径。

夜间第二轮已核基线文件未被改写。

## 覆盖

| 状态 | 夜间第二轮 | batch21 | 说明 |
| --- | ---: | ---: | --- |
| 详细出处 DETAILED | 223 | 268 | 能核实同作品人物／空间或术语解释的正文 |
| 仅书目 METADATA_ONLY | 1 | 1 | 只剩田汉剧目卡 `xplay-guantheplay`《关汉卿》 |
| 暂缺 MISS | 275 | 230 | 本批正文尚不能核实 |
| 不发布 BLOCKED | 1 | 1 | 《西厢记》`play-xixiang` / WXJ-S01 |

DETAILED 净增 45。转移关系：MISS→DETAILED 45；原 223 张详细出处全部保留；METADATA_ONLY 留 1、BLOCKED 留 1、MISS 留 230。无回退。审计里的 `previousStatus` 与夜间审计状态全部一致。500 张卡 id 与夜间审计、夜间索引、夜间本地包、正式 v57 链接表完全相同。

分维：剧目 54/100 详细（另 1 张仅书目、1 张不发布）；主演 53/100 详细；配角 64/85 详细；风格体系 45/75 详细；导演手法 31/75 详细；环境 21/65 详细。

batch21 索引与审计：500 个 id 一致；`diastageSearchUrl` 与审计 `url` 无差异；`diastageCategory` 与审计 `category` 无差异；全部 URL 均为 `https://diastage.art/?q=...`，可选 `category`，无隧道或 localhost。URL 中的查询词都在该卡 `searchQueries` 里。16 张卡的索引 `resourceIds` 是审计 `hitIds` 的超集（多保留了旧 F 盘目录 id，详细正文 id 都在），与夜间已记录的超集情况同类，不是本批新问题。未发现正式身份字段被改。审计、索引、ready 用字检查未见把「咫台／咫牌」写成缺笔或近形错字，也未见「繁漪」被写错。交接文件里的正式卡名已经是「伪君子」「埃癸斯托斯」「忒修斯」；同步文字里一度出现的「伪吗子」「埃發斯托斯」「彼修斯」只出现在对话更正前，未写入本批稿件。

审查新升为详细出处的 45 张时，17 张新剧目卡的命中标题均与正式卡名相符；主演／配角的举证为同剧公开全文中的实际发言角色（西文剧本以原文角色名为准，中文卡名多出现在正文前的关联卡行）。环境卡「窦娥刑场」「法场」指向关汉卿《窦娥冤》第三折，不是田汉《关汉卿》。「石库门」指向《上海屋檐下》开场弄堂房子布景。导演／风格术语卡的摘录是对相近手法的讲解（例如以「哑剧」条目说明「形体无言」，以林冲夜奔说明「夜行调度」），不是点到为止的书目。未把词面提及、同名他剧、父剧命中或改编替代改判为详细。未因《窦娥冤》把田汉《关汉卿》升为详细。本次未逐字重读全部正文；机器识别仍不等于人工校勘。

仍缺 230 张可核正文，另加 1 张仅书目、1 张不发布。第三轮队列还剩 93 项未核，后续批次还可能继续增加详细出处。

## 本轮新公开文字 20 条

均在本机 `GET /api/diamotif/script-text/{id}` 得到 HTTP 200，并可在相应分类检索到同一 id（石库门、窦娥刑场摘录在 knowledge／专用 id 下，不在 scripts 剧名检索里冒充全剧）。字数按 UTF-8 解码后的字符计。

| 题名 | 资源 id | 公开正文字符 | 说明 |
| --- | --- | ---: | --- |
| 浮士德 | `owner-ocr-20261116-pd-faust` | 509737 | 完整公版德文第一、二部 |
| 皮格马利翁 | `owner-ocr-20261116-pd-pygmalion` | 188918 | 完整公版英文原作 |
| 阿伽门农 | `owner-ocr-20261116-pd-agamemnon` | 86500 | 完整公版历史英译 |
| 华伦夫人的职业 | `owner-ocr-20261116-pd-mrswarren` | 193825 | 完整公版英文原作 |
| 被缚的普罗米修斯 | `owner-ocr-20261116-pd-prometheus` | 59459 | 完整公版历史英译 |
| 费德尔 | `owner-ocr-20261116-pd-phedre` | 96298 | 完整公版历史英译 |
| 伤心之家 | `owner-ocr-20261116-pd-heartbreak` | 268363 | 完整公版英文原作 |
| 费加罗的婚礼 | `owner-ocr-20261116-pd-figaro` | 184574 | 完整公版法文原作 |
| 伪君子 | `owner-ocr-20261116-pd-tartuffe` | 104573 | 完整公版历史英译 |
| 厄勒克特拉 | `owner-ocr-20261116-pd-electra` | 70605 | 完整公版历史英译 |
| 造谣学校 | `owner-ocr-20261116-pd-scandal` | 162251 | 完整公版英文原作 |
| 培尔·金特 | `owner-ocr-20261116-pd-peer` | 359077 | 完整公版历史英译 |
| 吝啬鬼 | `owner-ocr-20261116-pd-miser` | 118450 | 完整公版历史英译 |
| 石库门｜上海屋檐下 | `owner-ocr-20261115-37c3a7507c4a7269-round3-yplace-shikumen` | 1611 | 《上海屋檐下》第一幕开场布景两页摘录，不是全剧；同作品全文另见 owner-ocr-20261115-37c3a7507c4a7269（HTTP 200，48006 字） |
| 巴巴拉少校 | `owner-ocr-20261116-pd-majorbarbara` | 183166 | 完整公版英文原作 |
| 丹东之死 | `owner-ocr-20261116-pd-danton` | 129414 | 完整公版德文原作 |
| 春醒 | `owner-ocr-20261116-pd-springawake` | 127210 | 完整公版德文原作 |
| 窦娥刑场／法场｜窦娥冤第三折 | `owner-ocr-20261116-doueyuan-execution` | 2402 | 关汉卿《窦娥冤》第三折摘录，不是全剧，也不是田汉《关汉卿》；全剧另见 pd-script-20261108-ghq-s01-doueyuan（HTTP 200，16043 字） |
| 鸟 | `owner-ocr-20261116-pd-birds` | 95985 | 完整公版历史法译 |
| 朱莉小姐 | `owner-ocr-20261116-pd-missjulia` | 119192 | 完整公版历史英译 |

其中 18 条是可核的完整公版剧本正文（德、英、法原文或历史译本，题头写明非中文译本、非人工终校）。「石库门｜上海屋檐下」与「窦娥刑场／法场｜窦娥冤第三折」是摘录，不宜按「完整作品正文」计，但不妨碍对应环境卡按同作品空间／场次升级为详细出处。

## 保护项

**《西厢记》`play-xixiang`：** 仍为 BLOCKED。本机 scripts 检索「西厢记」HTTP 200、total=0。`GET /api/diamotif/script-text/WXJ-S01` HTTP 404。knowledge 检索「西厢记」会命中他书提及，结果中无 WXJ-S01，不能视为本剧公开。正式卡面仍保留 `https://diastage.art/?q=西厢记&category=scripts`，未静默删除，也未发布正文。

**田汉《关汉卿》`xplay-guantheplay`：** 仍为 METADATA_ONLY，分类 knowledge，查询词「关汉卿」。本机 scripts「关汉卿」total=0。scripts「田汉 关汉卿」total=1，命中 `pd-script-20261108-ghq-s01-doueyuan`（《窦娥冤》），按规则不计田汉此剧正文。knowledge「关汉卿」total=22，第一条是来源卡 `htc-20261108-guanhanqing`，其 `script-text` 为 HTTP 404，没有可公开正文；其余多为教材／史论中的词面提及，不能把田汉剧目卡升为详细。窦娥刑场／法场与《窦娥冤》第三折的关联不改变此项判断。

## 本机抽检

本机 API `GET /api/health` 为 200（抽检时时间戳 2026-11-15T19:56:08.799Z，即 2026-11-16 03:56:08 上海时间）。检索与正文接口分别为 `GET /api/diamotif/search` 与 `GET /api/diamotif/script-text/{{id}}`。45 张新升级卡均按正式卡面既有查询词与分类检索，HTTP 200，结果中含所报命中 id，且该 id 正文 HTTP 200。20 条新资源正文均存在。保护项结果见上节。

对外站点 `https://diastage.art/` 在 2026-11-16 03:56 上海时间探测为 HTTP 503。这只说明当时站点不可用，不是改域名的理由。本地对齐仍全部指向 `https://diastage.art`。

## 正式卡面深链（仅本地对齐，尚未并入正式版）

底稿为夜间已对齐包 `cards-500-optimized-linked-aligned-night.json` 与正式 v57 `OFFICIAL-LINKS-v57.json`。batch21 本地包只把上述 45 张的 `diastageCoverage` 从 MISS 改为 DETAILED；身份字段、文案、`searchQueries`、`diastageCategory`、`diastageSearchUrl` 均未改。这 45 张在正式 v57 里的 URL／分类／已去重查询词已经指向现在核过的检索，因此 **相对 v57 的官方 URL／分类／查询词变更是 0**。

本地输出：

- `cards-500-optimized-linked-aligned-batch21.json`：500 张本地包
- `LINK-CHANGES-20261116-batch21.json`：相对 v57 与夜间包的机器可读差异（覆盖 45，链接字段 0）
- `OFFICIAL-LINKS-v58-draft.json`：草稿，尚未交付发布。字段只有 id、name、diastageSearchUrl、diastageCategory；不含 searchQueries、diastageCoverage；URL 与 v57 相同；域名仍是 `https://diastage.art`

《西厢记》正式 scripts 检索链接保留。关汉卿剧目卡仍为 knowledge／「关汉卿」。未写入 Name Name 重复查询词，也未把运行时覆盖字段写进官方草稿。

是否把这份草稿做成正式 v58 补丁，由后续决定。第三轮尚未结束，若目标是一次收齐剩余来源，可以等后续批次；若只论这 45 张的跳转目标，正式 v57 已经对准，不必为改 URL 而发版。

## 新升为详细出处的 45 张

### 剧目（新 17）
- 浮士德（`xplay-faust`）  — scripts → `owner-ocr-20261116-pd-faust`
- 伪君子（`xplay-tartuffe`）  — scripts → `owner-ocr-20261116-pd-tartuffe`
- 费加罗的婚礼（`xplay-figaro`）  — scripts → `owner-ocr-20261116-pd-figaro`
- 皮格马利翁（`xplay-pygmalion`）  — scripts → `owner-ocr-20261116-pd-pygmalion`
- 被缚的普罗米修斯（`yplay-prometheus`）  — scripts → `owner-ocr-20261116-pd-prometheus`
- 阿伽门农（`yplay-agamemnon`）  — scripts → `owner-ocr-20261116-pd-agamemnon`
- 鸟（`yplay-birds`）  — scripts → `owner-ocr-20261116-pd-birds`
- 费德尔（`yplay-phedre`）  — scripts → `owner-ocr-20261116-pd-phedre`
- 培尔·金特（`yplay-peer`）  — scripts → `owner-ocr-20261116-pd-peer`
- 华伦夫人的职业（`yplay-mrswarren`）  — scripts → `owner-ocr-20261116-pd-mrswarren`
- 朱莉小姐（`yplay-pipa`）  — scripts → `owner-ocr-20261116-pd-missjulia`  （正式 id 仍是 yplay-pipa，卡名是朱莉小姐）
- 造谣学校（`yplay-fifteen`）  — scripts → `owner-ocr-20261116-pd-scandal`
- 厄勒克特拉（`yplay-drunken`）  — scripts → `owner-ocr-20261116-pd-electra`
- 伤心之家（`play-v21-heartbreak`）  — scripts → `owner-ocr-20261116-pd-heartbreak`
- 巴巴拉少校（`play-v21-majorbarbara`）  — scripts → `owner-ocr-20261116-pd-majorbarbara`
- 丹东之死（`v23-play-danton`）  — scripts → `owner-ocr-20261116-pd-danton`
- 春醒（`v23-play-springawake`）  — scripts → `owner-ocr-20261116-pd-springawake`

### 主演（新 9）
- 伊莉莎（`xrole-eliza`）  — scripts → `owner-ocr-20261116-pd-pygmalion`
- 阿巴贡（`xrole-harpagon`）  — scripts → `owner-ocr-20261116-pd-miser`
- 答尔丢夫（`xrole-tartuffe`）  — scripts → `owner-ocr-20261116-pd-tartuffe`
- 费加罗（`xrole-figaro`）  — scripts → `owner-ocr-20261116-pd-figaro`
- 梅菲斯特（`xrole-mephisto`）  — scripts → `owner-ocr-20261116-pd-faust`
- 克吕泰涅斯特拉（`yrole-clytemnestra`）  — scripts → `owner-ocr-20261116-pd-agamemnon`
- 桃丽娜（`yrole-dorine`）  — scripts → `owner-ocr-20261116-pd-tartuffe`
- 索尔维格（`yrole-solveig`）  — scripts → `owner-ocr-20261116-pd-peer`
- 费德尔（`role-v21-phedre`）  — scripts → `owner-ocr-20261116-pd-phedre`

### 配角（新 9）
- 卡珊德拉（`role2-cassandra`）  — scripts → `owner-ocr-20261116-pd-agamemnon`
- 阿伽门农（`role2-agamemnon`）  — scripts → `owner-ocr-20261116-pd-agamemnon`
- 埃癸斯托斯（`role2-aegisthus`）  — scripts → `owner-ocr-20261116-pd-agamemnon`
- 希波吕托斯（`role2-hippolytus`）  — scripts → `owner-ocr-20261116-pd-phedre`
- 俄诺涅（`role2-oenone`）  — scripts → `owner-ocr-20261116-pd-phedre`
- 忒修斯（`role2-theseus`）  — scripts → `owner-ocr-20261116-pd-phedre`
- 曾皓（`role2-zeng-hao`）  — scripts → `owner-ocr-20261115-a0e7d368411023a8`  （《北京人》；公开 OCR 把「曾皓」误读为「曾。 嵌」等，人物表与老太爷发言仍在）
- 罗伯斯庇尔（`v23-sup-robespierre`）  — scripts → `owner-ocr-20261116-pd-danton`
- 莫里茨（`v23-sup-moritz`）  — scripts → `owner-ocr-20261116-pd-springawake`

### 风格体系（新 1）
- 行走剧场（`xstyle-walk`）  — knowledge → `owner-ocr-20261115-ee4634c534a9845e`

### 导演手法（新 6）
- 形体无言（`dir-body`）  — knowledge → `owner-ocr-20261115-0aa2d1aaad98b2a7`
- 重复段落（`xdir-repeat`）  — knowledge → `owner-ocr-20261115-c0f15eccc4864518`
- 夜行调度（`xdir-zoubian`）  — knowledge → `owner-ocr-20261115-19de3835eabedbba`
- 即兴插入（`xdir-improvbit`）  — knowledge → `owner-ocr-20261115-ce228fb6864c23b2`
- 急奔调度（`ydir-paoyuan`）  — knowledge → `owner-ocr-20261115-a95a3d6966cee2d9`
- 水池舞台（`v23-dir-pool`）  — knowledge → `owner-ocr-20261115-a95a3d6966cee2d9`

### 环境（新 3）
- 窦娥刑场（`place-exec`）  — knowledge → `owner-ocr-20261116-doueyuan-execution`  （《窦娥冤》第三折，不是田汉《关汉卿》）
- 石库门（`yplace-shikumen`）  — knowledge → `owner-ocr-20261115-37c3a7507c4a7269-round3-yplace-shikumen`  （《上海屋檐下》开场弄堂房子布景；正文用「弄堂房子」，「石库门」三字主要出现在资源题头／关联卡行）
- 法场（`yplace-fachang`）  — knowledge → `owner-ocr-20261116-doueyuan-execution`  （《窦娥冤》第三折，不是田汉《关汉卿》）
## 备注与限制

- 西文／法文／德文剧本的中文卡名多只出现在正文前的「关联卡」行；判定详细出处依据的是同剧原文中的角色名与作品标题，例如 Eliza／LIZA、Harpagon、Tartuffe、Figaro、MEPHISTOPHELES、Clytemnestra、Dorine、Solveig、Cassandra、Aegisthus、Hippolytus、Oenone、Theseus、Phaedra、Robespierre、Moritz。
- `role2-zeng-hao` 公开 OCR 未正确写出「曾皓」，但人物表作「曾。 嵌——在北平落户的旧世家的老太爷」，且「老太爷」「曾文清」「曾家」在《北京人》全文中大量出现，按同作品人物计。
- 术语卡公开正文往往不用卡面四字原词，而是讲解相近手法；已在公开正文中核到对应段落（哑剧、巴士行走演出、动作的重复、林冲夜奔、即兴与范本、《高考 1977》追火车、《霸王歌行》血水／玻璃缸等）。
- `yplay-pipa` 是正式 500 里的既有 id，卡名是「朱莉小姐」，不是琵琶记。
- `v23-sup-moritz` 正式查询词仍是单独的「莫里茨」，未改成「春醒 莫里茨」；本机该词已命中《春醒》正文。
- 本批稿件写明机器识别不等于人工终校；低文字量页及疑读保留。
