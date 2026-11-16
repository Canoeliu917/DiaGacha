# 咫牌 500 卡与咫台第三轮最终全文覆盖（2026-11-16）

独立验收，不以同步回执自报数为准。依据工作机 `D:\GrokBot\DiaStage\DiaMotif\records\diagacha-remaining-coverage-20261116-audit.json`（mtime 2026-11-16 03:54:19 上海时间）逐行复算，并与同目录 `verification.json`、`ready.txt`（mtime 03:55:21）、`link-evidence.json` 以及 `DiaMotif\knowledge\diagacha-search-index-20261116.json`（均 03:54:19）交叉核对。随后在本机 `http://127.0.0.1:4318` 对相对 batch21 新升的 11 张卡、3 条新场景资源，以及保护项与三处用字更正做了抽检（约 2026-11-16 04:16–04:20 上海时间）。覆盖数字与回执一致：279／1／219／1。

本次只做本地深链对齐，未发布、未开 GitHub PR 或 v58、未改正式 Pages，也未把卡面链接改到临时隧道或本机地址。检索域名一律保持 `https://diastage.art`。未改任何正式卡的编号、名称、维度、稀有度、分数或攻击／防御／声望。这是机器识别，不是逐字人工校勘。PDF 原件仍本机私有，未开放整本下载。《西厢记》仍不发布。夜间第二轮与 batch21 已核文件未被改写。剩余名单 276/276 已全部处理，这是第三轮无批次后缀的最终稿，不是进行中的中间批次。

## 覆盖

| 状态 | 夜间第二轮 | batch21 | 第三轮最终 | 说明 |
| --- | ---: | ---: | ---: | --- |
| 详细出处 DETAILED | 223 | 268 | 279 | 能核实同作品人物／空间或术语解释的正文 |
| 仅书目 METADATA_ONLY | 1 | 1 | 1 | 只剩田汉剧目卡 `xplay-guantheplay`《关汉卿》 |
| 暂缺 MISS | 275 | 230 | 219 | 本轮仍不能核实正文 |
| 不发布 BLOCKED | 1 | 1 | 1 | 《西厢记》`play-xixiang` / WXJ-S01 |

相对夜间基线：DETAILED 净增 56，全部为 MISS→DETAILED；原 223 张详细出处全部保留。相对已核 batch21：再增 11 张，无回退。审计 `previousStatus` 与夜间审计状态全部一致。500 张卡 id 与夜间、batch21、正式 v57 完全相同，名称与维度无漂移。

分维：剧目 55/100 详细（另 1 张仅书目、1 张不发布）；主演 58/100 详细；配角 65/85 详细；风格体系 45/75 详细；导演手法 32/75 详细；环境 24/65 详细。

最终索引与审计：500 个 id 一致；`diastageSearchUrl` 与审计 `url`、正式 v57、batch21 本地包均无差异；`diastageCategory` 亦无差异。全部 URL 均为 `https://diastage.art/?q=...`，可选 `category`，无隧道或 localhost。URL 中的查询词都在该卡索引 `searchQueries` 里。16 张卡的索引 `resourceIds` 仍是审计 `hitIds` 的超集（旧 F 盘目录 id），与夜间已记录情况同类。交接文件用字为「咫台」「伪君子」「吝啬鬼」，未见「迢台」「吝窝鬼」「橗子」。

本轮新升的 11 张均在本机公开检索中核到所报命中 id 与正文。其中剧目《吝啬鬼》正文在 batch21 就已公开，当时已升级同剧阿巴贡，剧目卡本身留到终稿才改判，现已补上。未把词面提及、同名他剧、父剧命中或改编替代改判为详细。未因《窦娥冤》把田汉《关汉卿》升为详细。本次未逐字重读全部正文；机器识别仍不等于人工校勘。

仍缺 219 张可核正文，另加 1 张仅书目、1 张不发布。第三轮剩余名单已经走完，后续若再增详细出处，需要新的来源，而不是等待本名单的下一批。

## 三处用字更正（已对照正式卡名与正文）

这些是对终稿同步文字的更正，不是对交接文件的修改。交接文件与正式 500 卡本来就是正确用字。

1. 卡面跳转文案是「在咫台检索」（咫为 U+54AB），不是「迢台」。正式包、最终索引与 ready.txt 均用「咫台」。
2. 关汉卿《窦娥冤》公开全文 `pd-script-20261108-ghq-s01-doueyuan` 在题头之后从「感天动地窦娥冤／楔子」起，蔡婆上场。全文「楔子」出现 1 次，「橗子」为 0。
3. `xplay-miser` 的正式卡名、查询词和既有 v57 跳转都是「吝啬鬼」，不是「吝窝鬼」；出处 `owner-ocr-20261116-pd-miser`。本机 scripts「吝啬鬼」命中该 id，scripts「吝窝鬼」total=0。跳转已是 `https://diastage.art/?q=吝啬鬼&category=scripts`。

## 相对 batch21 新公开的 3 个场景资源

均在本机 `GET /api/diamotif/script-text/{id}` 得到 HTTP 200，并在 knowledge 相应查询词下命中同一 id。

| 题名 | 资源 id | 公开正文字符 | 说明 |
| --- | --- | ---: | --- |
| 阁楼｜野鸭 | `owner-ocr-20261115-pd-duck-round3-xplace-attic` | 105278 | 易卜生《野鸭》英文历史译本的大段公开正文，抽检所见从第二幕起，含 garret／野鸭阁楼场面；「阁楼」三字主要在题头／关联卡行。父资源 `owner-ocr-20261115-pd-duck` |
| 车厢｜绝对信号 | `owner-ocr-20261115-8c32a0181555bd10-round3-xplace-carriage` | 2094 | 刘会远《绝对信号》开场约三页摘录（识别进度 3/3 页），地点为普通货车末节守车；不是全剧。父资源 `owner-ocr-20261115-8c32a0181555bd10` |
| 公堂｜窦娥冤第二折 | `owner-ocr-20261116-doueyuan-court` | 1646 | 关汉卿《窦娥冤》第二折升厅、告状、拷问、招认、散堂，不是田汉《关汉卿》。全剧见 `pd-script-20261108-ghq-s01-doueyuan`（16043 字，从楔子起） |

18 部完整公版剧本与 batch21 已核名单相同，终稿未再新增完整剧。场景资源合计 5 项：先前已核的石库门摘录、窦娥冤第三折，加上以上 3 项。

## 保护项

**《西厢记》`play-xixiang`：** 仍为 BLOCKED。本机 scripts「西厢记」total=0。`GET /api/diamotif/script-text/WXJ-S01` HTTP 404。正式卡面 scripts 检索链接保留，未发布正文。

**田汉《关汉卿》`xplay-guantheplay`：** 仍为 METADATA_ONLY。scripts「关汉卿」total=0。scripts「田汉 关汉卿」total=1，命中 `pd-script-20261108-ghq-s01-doueyuan`，标题《窦娥冤》、作者关汉卿，正文从杂剧楔子起，没有朱帘秀或田汉话剧，不计该剧详细出处。来源卡 `htc-20261108-guanhanqing` 正文 404。knowledge「关汉卿」仍有多条教材／史论提及，不能据此升级。

## 本机抽检

本机 API `GET /api/health` 为 200（抽检时时间戳 2026-11-15T20:15:58.245Z，即 2026-11-16 04:15:58 上海时间）。11 张新升级卡均按正式卡面既有查询词与分类检索，HTTP 200，结果含所报命中 id，正文 HTTP 200。3 条新场景资源正文均存在。保护项与三处用字更正结果见上节。

对外站点 `https://diastage.art/` 在 2026-11-16 04:20 上海时间探测仍为 HTTP 503。这只说明当时站点不可用，不是改域名的理由。本地对齐仍全部指向 `https://diastage.art`。

## 正式卡面深链（仅本地对齐，尚未并入正式版）

底稿为已核 batch21 本地包与正式 v57。最终本地包只把上述 11 张的 `diastageCoverage` 从 MISS 改为 DETAILED；身份字段、文案、`searchQueries`、`diastageCategory`、`diastageSearchUrl` 均未改。这 11 张以及先前 45 张在正式 v57 里的 URL／分类／已去重查询词已经指向现在核过的检索，因此 **相对 v57 的官方 URL／分类／查询词变更仍是 0**。

本地输出：

- `cards-500-optimized-linked-aligned-final.json`：500 张本地包（覆盖 279／1／219／1）
- `LINK-CHANGES-20261116-final.json`：相对 v57、夜间包与 batch21 包的机器可读差异
- `OFFICIAL-LINKS-v58-draft.json`：已按最终核验更新说明的草稿，尚未交付发布。字段只有 id、name、diastageSearchUrl、diastageCategory；URL 与 v57 相同；域名仍是 `https://diastage.art`

《西厢记》正式 scripts 检索链接保留。关汉卿剧目卡仍为 knowledge／「关汉卿」。未写入 Name Name 重复查询词。是否把这份草稿做成正式 v58 补丁，由后续决定。若只论跳转目标，正式 v57 已经对准这 56 张，不必为改 URL 而发版。

## 本轮 56 张新详细出处

其中 45 张已在 batch21 独立核过，见 `COVERAGE-20261116-batch21.md`。下面只列相对 batch21 新确认的 11 张。

### 相对 batch21 新升 11 张

#### 剧目（新 1）
- 吝啬鬼（`xplay-miser`）  — scripts → `owner-ocr-20261116-pd-miser`

#### 主演（新 5）
- 丹东（`v23-role-danton`）  — scripts → `owner-ocr-20261116-pd-danton`
- 梅尔希奥（`v23-role-melchior`）  — scripts → `owner-ocr-20261116-pd-springawake`
- 厄勒克特拉（`yrole-guifei`）  — scripts → `owner-ocr-20261116-pd-electra`  （正式 id 仍是 yrole-guifei，卡名是厄勒克特拉）
- 克里斯汀（`xrole-chunxiang`）  — scripts → `owner-ocr-20261116-pd-missjulia`  （正式 id 仍是 xrole-chunxiang，卡名是克里斯汀）
- 蒂兹尔（`yrole-kuangzhong`）  — scripts → `owner-ocr-20261116-pd-scandal`  （正式 id 仍是 yrole-kuangzhong，卡名是蒂兹尔；举证对应 Sir Peter Teazle，同剧也有 Lady Teazle）

#### 配角（新 1）
- 黄家楣（`role2-huang-jiamei`）  — scripts → `owner-ocr-20261115-37c3a7507c4a7269`  （《上海屋檐下》；公开 OCR 把「黄家楣」误读为「黄家权」等，人物表与对白仍在）

#### 导演手法（新 1）
- 假定性公开（`dir-convention`）  — knowledge → `owner-ocr-20261115-30fd94146fc8f81b`  （《戏剧鉴赏》分析奥斯特玛雅《哈姆雷特》明场换装、直接与观众说话）

#### 环境（新 3）
- 阁楼（`xplace-attic`）  — knowledge → `owner-ocr-20261115-pd-duck-round3-xplace-attic`  （《野鸭》英文公译中的 garret；「阁楼」三字主要在资源题头／关联卡行）
- 车厢（`xplace-carriage`）  — knowledge → `owner-ocr-20261115-8c32a0181555bd10-round3-xplace-carriage`  （《绝对信号》货车守车开场三页摘录，不是全剧；正文多用「守车」）
- 公堂（`yplace-gongtang`）  — knowledge → `owner-ocr-20261116-doueyuan-court`  （关汉卿《窦娥冤》第二折升厅拷问场面，不是田汉《关汉卿》）

## 备注与限制

- 西文剧本的中文卡名多只出现在正文前的「关联卡」行；判定依据是同剧原文角色名或场景词，例如 Danton、Melchior、Electra、Christine、Teazle、Harpagon、garret。
- `role2-huang-jiamei` 公开 OCR 未稳定写出「黄家楣」，常见「黄家权」等误读，但《上海屋檐下》人物与对白可定位，按同作品人物计。
- `yrole-kuangzhong` 正式卡名是「蒂兹尔」，证据按 Sir Peter Teazle 计；同剧 Lady Teazle 也在正文中。
- 「车厢」「公堂」是场景摘录，不是全剧；「阁楼」资源体量很大，但仍以《野鸭》阁楼／garret 场面支持环境卡，不把它改记成新的完整剧目增量。
- 本批稿件写明机器识别不等于人工终校；低文字量页及疑读保留。
