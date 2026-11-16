# 咫牌 500 卡与咫台 20261116-cont 续轮全文覆盖（2026-11-16）

独立验收，不以同步回执自报数为准。依据工作机 `D:\GrokBot\DiaStage\DiaMotif\records\diagacha-remaining-coverage-20261116-cont-audit.json`（mtime 2026-11-16 04:46:09 上海时间，SHA256 `C20BEF032E4E6A8BAD14AB6A9F26CD69395373BCA87A2A18582870ACFA0D7E94`）逐行复算，并与同目录 ready、gaps、verification、link-evidence、corrections 以及 `DiaMotif\knowledge\diagacha-search-index-20261116-cont.json`（同一时刻，SHA256 `74C669E70A0E83DF680B753C6C2A0ADEE0DDCFAE374AA32429C532A00B77D440`）交叉核对。随后在本机 `http://127.0.0.1:4318` 对 16 条新资源、43 张新升级卡、保护项、复调剧场撤回，以及「窖娥冤」用字更正做了抽检（摘要时间 2026-11-16 04:53:48 上海时间）。覆盖数字与回执一致：322／1／176／1。

本次只做本地深链对齐，未发布、未开 GitHub PR 或 v58、未改正式 Pages，也未把卡面链接改到临时隧道或本机地址。检索域名一律保持 `https://diastage.art`。未改任何正式卡的编号、名称、维度、稀有度、分数或攻击／防御／声望。这是机器识别，不是逐字人工校勘。PDF 原件仍本机私有，未开放整本下载。《西厢记》仍不发布。夜间第二轮、batch21 与第三轮无后缀终稿已核文件未被改写。这是续轮带 `cont` 后缀的最终稿，不要覆盖第三轮终稿。

回执称「最终稿与 cont-batch10 内容完全一致」。独立核过：只有搜索索引 SHA256 与 batch10 相同；审计、ready、gaps、verification、link-evidence 的哈希和体积并不相同。覆盖与 43 张名单以本目录最终审计为准。

## 覆盖

| 状态 | 夜间第二轮 | 第三轮最终 | 20261116-cont | 说明 |
| --- | ---: | ---: | ---: | --- |
| 详细出处 DETAILED | 223 | 279 | 322 | 能核实同作品人物／空间或术语解释的正文 |
| 仅书目 METADATA_ONLY | 1 | 1 | 1 | 只剩田汉剧目卡 `xplay-guantheplay`《关汉卿》 |
| 暂缺 MISS | 275 | 219 | 176 | 本轮仍不能核实正文 |
| 不发布 BLOCKED | 1 | 1 | 1 | 《西厢记》`play-xixiang` / WXJ-S01 |

相对第三轮终稿：DETAILED 净增 43，全部为 MISS→DETAILED；原 279 张详细出处全部保留。相对夜间基线：净增 99。`style-v21-polyphonic`（复调剧场）保持 MISS，未按早期续轮批次的升级名单写入。500 张卡 id 与夜间、第三轮终稿、正式 v57 完全相同，名称与维度无漂移。

分维：剧目 56/100 详细（另 1 张仅书目、1 张不发布）；主演 59/100 详细；配角 66/85 详细；风格体系 54/75 详细；导演手法 42/75 详细；环境 45/65 详细。

最终索引与审计：500 个 id 一致；`diastageSearchUrl` 与审计 `url`、正式 v57、第三轮最终本地包均无差异；`diastageCategory` 亦无差异。全部 URL 均为 `https://diastage.art/?q=...`，可选 `category`，无隧道或 localhost。URL 中的查询词都在该卡索引 `searchQueries` 里。16 张卡的索引 `resourceIds` 仍是审计 `hitIds` 的超集（旧 F 盘目录 id），与夜间已记录情况同类。交接文件用字为「咫台」「窦娥冤」，未见「窖娥冤」「迢台」。

本轮新升的 43 张均在本机公开检索中核到所报命中 id 与正文，且该 id 均为第一命中。未把词面提及、同名他剧、父剧命中或改编替代改判为详细。未因《窦娥冤》把田汉《关汉卿》升为详细。未因早期批次把复调剧场升为详细。本次未逐字重读全部正文；机器识别仍不等于人工校勘。

仍缺 176 张可核正文，另加 1 张仅书目、1 张不发布。续轮进程已结束；后续若再增详细出处，需要新的合法来源。

## 笔误更正（已对照正式卡名与正文）

这是对续轮终稿同步文字的更正，不是对交接文件的修改。交接文件与正式 500 卡本来就是正确用字。

剧名是《窦娥冤》，不是「窖娥冤」。本机 scripts「窦娥冤」命中 `pd-script-20261108-ghq-s01-doueyuan`，标题《窦娥冤》、作者关汉卿；正文「窦娥冤」5 次、「窖娥冤」0 次，从杂剧「楔子」起。scripts「窖娥冤」total=0。scripts「田汉 关汉卿」唯一命中也是这部杂剧，不得当作田汉《关汉卿》正文。

## 本轮新公开的 16 项资源

均在本机 `GET /api/diamotif/script-text/{id}` 得到 HTTP 200，并在相应查询词下命中同一 id。14 项是既有已公开作品的场景摘录，另加 1 篇 1911 年历史词条节录和 1 部 1879 年历史残篇。终稿未再新增完整定稿剧。

| 题名 | 资源 id | 公开正文字符 | 说明 |
| --- | --- | ---: | --- |
| 阳台｜西哈诺 | `owner-ocr-20261116-cont-xplace-balcony` | 3627 | 王文融译《西哈诺》阳台场面摘录；正文「阳台」多次出现 |
| 修道院｜西哈诺 | `owner-ocr-20261116-cont-xplace-convent` | 2849 | 同书第五幕十字架女修道院庭园摘录 |
| 雪原｜大雪地 | `owner-ocr-20261116-cont-xplace-snowfield` | 1908 | 《大雪地》开场雪野、雪丘、暴风雪摘录；「雪原」主要在题头，正文有「雪」「大雪地」 |
| 中军帐｜裘力斯·凯撒 | `owner-ocr-20261116-cont-yplace-zhongjun` | 17448 | MIT Moby Shakespeare《Julius Caesar》军帐议事；「中军帐」主要在题头，正文为英文 tent／Brutus |
| 公共浴室｜命运的拨弄，或蒸得舒服 | `owner-ocr-20261116-cont-place-v21-publicbath` | 5570 | 公共澡堂与蒸汽洗浴场面；正文多用「澡堂」 |
| 工厂｜巴巴拉少校 | `owner-ocr-20261116-cont-xplace-factory` | 10322 | Gutenberg #3790《Major Barbara》工厂参观；「工厂」主要在题头，正文有 foundry／factory／Undershaft |
| 甲板｜培尔·金特 | `owner-ocr-20261116-cont-yplace-deck` | 15344 | Gutenberg Ibsen 英译第五幕船尾高甲板；「甲板」主要在题头 |
| 旧照相馆｜野鸭 | `owner-ocr-20261116-cont-place-v21-photostudio` | 105302 | Gutenberg《野鸭》英译摄影室大段正文；体量接近先前阁楼摘录，中文「照相」主要在题头 |
| 受难剧｜Oberammergau | `owner-ocr-20261116-cont-eb1911-passion` | 2184 | Encyclopaedia Britannica 11th ed. 1911 历史词条节录；所列人数与年期属 1911 年描述 |
| 码头｜阮玲玉 | `owner-ocr-20261116-cont-xplace-dock` | 2122 | 《阮玲玉》江边码头登船离别摘录 |
| 墓地｜哈姆雷特 | `owner-ocr-20261116-cont-xplace-grave` | 4732 | 朱生豪译《哈姆雷特》第五幕第一场；OCR 作「募 地」，仍有小丑、掘坟、霍拉旭、头颅 |
| 厨房｜朱莉小姐 | `owner-ocr-20261116-cont-xplace-kitchen` | 16578 | Gutenberg #14347《Miss Julia》厨房布景与仆人场面 |
| 悬崖｜李尔王 | `owner-ocr-20261116-cont-yplace-cliff` | 14168 | MIT Moby Shakespeare《King Lear》多佛假想悬崖；不是实地登崖记录 |
| 地牢｜浮士德 | `owner-ocr-20261116-cont-yplace-dungeon` | 10519 | Gutenberg 德文《浮士德》第一部 Kerker 囚室；不把开篇书斋比喻当作地牢 |
| 舞厅｜樱桃园 | `owner-ocr-20261116-cont-yplace-ballroom` | 1413 | 童道明译《樱桃园》第三幕大厅舞会摘录 |
| 沃伊采克（1879 年 Franzos 版残篇） | `owner-ocr-20261116-cont-pd-woyzeck-franzos1879` | 46250 | Büchner Sämmtliche Werke，Franzos 编，1879，pp.161–201；德文残篇历史编订本，不是作者定稿或现代通行编排。正文拼写为 Wozzeck |

## 保护项

**《西厢记》`play-xixiang`：** 仍为 BLOCKED。本机 scripts「西厢记」「西厢记 红娘」「红娘」均为 total=0。`GET /api/diamotif/script-text/WXJ-S01` HTTP 404。正式卡面 scripts 检索链接保留，未发布正文。知识栏命中是既有书籍提及，不是该剧正文。

**田汉《关汉卿》`xplay-guantheplay`：** 仍为 METADATA_ONLY。scripts「关汉卿」total=0。scripts「田汉 关汉卿」total=1，命中 `pd-script-20261108-ghq-s01-doueyuan`，标题《窦娥冤》、作者关汉卿，正文从杂剧楔子起，没有朱帘秀或田汉话剧，不计该剧详细出处。来源卡 `htc-20261108-guanhanqing` 正文 404。knowledge「关汉卿」仍有 22 条教材／史论提及（含对田汉该剧场次的转述），不能据此升级。

**`style-v21-polyphonic` 复调剧场：** 续轮早期批次曾升级，后因页 122–124 只支持多线索／视听对位、达不到「多种独立立场不被单一解释收束」的卡面要求而撤回。最终审计为 MISS，命中为空。本机 knowledge「复调剧场」total=0。不要按 cont-batch01 写入。

## 本机抽检

本机 API `GET /api/health` 为 200（摘要时间戳 2026-11-15T20:53:48.158Z，即 2026-11-16 04:53:48 上海时间）。43 张新升级卡均按正式卡面既有查询词与分类检索，HTTP 200，结果含所报命中 id，且该 id 均为第一命中。16 条新资源正文均存在。保护项与用字更正结果见上节。

对外站点 `https://diastage.art/` 在第三轮核验时（2026-11-16 03:56、04:20 上海时间）仍为 HTTP 503。本续轮未再改域名，本地对齐仍全部指向 `https://diastage.art`。

## 正式卡面深链（仅本地对齐，尚未并入正式版）

底稿为已核第三轮最终本地包与正式 v57。续轮本地包只把上述 43 张的 `diastageCoverage` 从 MISS 改为 DETAILED；身份字段、文案、`searchQueries`、`diastageCategory`、`diastageSearchUrl` 均未改。这 43 张以及先前 56 张在正式 v57 里的 URL／分类／已去重查询词已经指向现在核过的检索，因此 **相对 v57 的官方 URL／分类／查询词变更仍是 0**。

本地输出：

- `cards-500-optimized-linked-aligned-cont.json`：500 张本地包（覆盖 322／1／176／1）
- `LINK-CHANGES-20261116-cont.json`：相对 v57、夜间包、batch21 包与第三轮最终包的机器可读差异
- `OFFICIAL-LINKS-v58-draft.json`：仍是此前草稿，URL 与 v57 相同，字段只有 id、name、diastageSearchUrl、diastageCategory；本轮无需为改跳转而更新。域名仍是 `https://diastage.art`

《西厢记》正式 scripts 检索链接保留。关汉卿剧目卡仍为 knowledge／「关汉卿」。未写入 Name Name 重复查询词。是否把这份草稿做成正式 v58 补丁，由后续决定。若只论跳转目标，正式 v57 已经对准这 99 张，不必为改 URL 而发版。

## 本轮 43 张新详细出处

下列均为相对第三轮终稿新确认的 MISS→DETAILED。出处 id 已在本机检索中核到。

### 剧目（新 1）
- 沃伊采克（`v23-play-woyzeck`）  — scripts → `owner-ocr-20261116-cont-pd-woyzeck-franzos1879`  （1879 年 Franzos 德文残篇，不是作者定稿）

### 主演（新 1）
- 沃伊采克（`v23-role-woyzeck`）  — scripts → `owner-ocr-20261116-cont-pd-woyzeck-franzos1879`  （正文拼写 Wozzeck，含 Johann Franz Wozzeck 自报）

### 配角（新 1）
- 玛丽（`v23-sup-marie`）  — scripts → `owner-ocr-20261116-cont-pd-woyzeck-franzos1879`  （正式查询词只有「玛丽」，本机该词唯一命中即此残篇）

### 风格体系（新 9）
- 夸张演技（`style-kabuki`）  — knowledge → `owner-ocr-20261115-2bfb13e735e610fe`  （正式 id 仍是 style-kabuki；《升官图》夸张动作，不用歌舞伎原名替代）
- 身体剧场（`style-physical`）  — knowledge → `owner-ocr-20261115-aa3aeda0b230c02c`  （进念以身体姿势为基本字汇）
- 开放结局（`xstyle-chuanju`）  — knowledge → `owner-ocr-20261115-30fd94146fc8f81b`  （正式 id 仍是 xstyle-chuanju；《玩偶之家》结尾未封闭）
- 讽刺短剧（`ystyle-kyogen`）  — knowledge → `owner-ocr-20261115-2bfb13e735e610fe`  （正式 id 仍是 ystyle-kyogen；陈白尘《禁止小便》等短剧讽刺机制）
- 受难剧（`ystyle-passion`）  — knowledge → `owner-ocr-20261116-cont-eb1911-passion`  （1911 年百科词条节录）
- 仪式戏剧（`ystyle-ritualstyle`）  — knowledge → `owner-ocr-20261115-30fd94146fc8f81b`  （谢克纳仪式方法）
- 法庭剧（`style-v21-courtroom`）  — knowledge → `owner-ocr-20261115-ee4634c534a9845e`  （《时间证人》法庭叙事；原书称之为情节剧）
- 感官剧场（`style-v21-sensory`）  — knowledge → `owner-ocr-20261115-30fd94146fc8f81b`  （出处未使用「感官剧场」这一卡名）
- 视觉戏剧（`v23-style-visual`）  — knowledge → `owner-ocr-20261115-aa3aeda0b230c02c`  （与身体剧场同一进念段落的视觉意象侧面）

### 导演手法（新 10）
- 仪式调度（`dir-ritual`）  — knowledge → `owner-ocr-20261115-30fd94146fc8f81b`
- 独白直给（`dir-solo`）  — knowledge → `owner-ocr-20261115-2bfb13e735e610fe`  （田汉独白直接向观众剖露内心）
- 点名观众（`dir-call`）  — knowledge → `owner-ocr-20261115-30fd94146fc8f81b`  （出处未使用「点名观众」卡名）
- 旁唱评论（`xdir-bang`）  — knowledge → `owner-ocr-20261115-30fd94146fc8f81b`  （正式 id 仍是 xdir-bang；《三毛钱歌剧》歌曲评论剧情）
- 节奏提示（`xdir-drum`）  — knowledge → `owner-ocr-20261115-2dfac6a157db2369`  （《三堂会审》小锣点送）
- 情绪突变（`xdir-facechange`）  — knowledge → `owner-ocr-20261115-81ed6cbb60c2bc3c`  （正式 id 仍是 xdir-facechange；《妇女代表》态度转折）
- 视线引导（`ydir-lingzi`）  — knowledge → `owner-ocr-20261115-6bf889e81d90ed6f`  （正式 id 仍是 ydir-lingzi；集体视线转移焦点的练习）
- 加速节奏（`ydir-jijifeng`）  — knowledge → `owner-ocr-20261115-2dfac6a157db2369`  （正式 id 仍是 ydir-jijifeng；周信芳《四进士》念白加快）
- 时间跳接（`dir-v21-timecut`）  — knowledge → `owner-ocr-20261115-ee4634c534a9845e`  （《亚当与夏娃的意外》四场跨越十六年）
- 结尾回环（`dir-v21-endingloop`）  — knowledge → `owner-ocr-20261115-69812107a56d3d62`  （《秃头歌女》结局重复开场）

### 环境（新 21）
- 居伦城（`place-gullen`）  — knowledge → `owner-ocr-20261115-19de3835eabedbba`  （《戏剧本体论》对《贵妇还乡》虚构小城的实质说明，不是剧目正文）
- 花亭（`place-baihua`）  — knowledge → `owner-ocr-20261115-2dfac6a157db2369`  （《贵妃醉酒》百花亭摆宴、赴约者未到）
- 斯特拉的公寓（`place-stella`）  — knowledge → `owner-ocr-20261115-69812107a56d3d62`  （《戏剧鉴赏》对《欲望号街车》贫民窟小公寓的场景说明，不是剧目正文）
- 码头（`xplace-dock`）  — knowledge → `owner-ocr-20261116-cont-xplace-dock`  （《阮玲玉》码头摘录）
- 阳台（`xplace-balcony`）  — knowledge → `owner-ocr-20261116-cont-xplace-balcony`  （《西哈诺》阳台摘录）
- 集市（`xplace-market`）  — knowledge → `owner-ocr-20261115-9c5d86616b9cdc47`  （小学教材《买椟还珠》课堂剧，地点为白天集市）
- 工厂（`xplace-factory`）  — knowledge → `owner-ocr-20261116-cont-xplace-factory`  （《巴巴拉少校》工厂参观；「工厂」主要在题头）
- 墓地（`xplace-grave`）  — knowledge → `owner-ocr-20261116-cont-xplace-grave`  （《哈姆雷特》第五幕第一场；OCR 疑读保留）
- 厨房（`xplace-kitchen`）  — knowledge → `owner-ocr-20261116-cont-xplace-kitchen`  （《朱莉小姐》厨房；「厨房」主要在题头）
- 修道院（`xplace-convent`）  — knowledge → `owner-ocr-20261116-cont-xplace-convent`
- 雪原（`xplace-snowfield`）  — knowledge → `owner-ocr-20261116-cont-xplace-snowfield`  （《大雪地》雪野摘录；「雪原」主要在题头）
- 中军帐（`yplace-zhongjun`）  — knowledge → `owner-ocr-20261116-cont-yplace-zhongjun`  （《裘力斯·凯撒》军帐；不伪称中国古代军制说明）
- 城门（`yplace-chengmen`）  — knowledge → `owner-ocr-20261115-37e6bc40a999fa88`  （罗锦鳞谈《忒拜城》七座可升降幕条城门的舞台设计）
- 甲板（`yplace-deck`）  — knowledge → `owner-ocr-20261116-cont-yplace-deck`  （《培尔·金特》甲板；「甲板」主要在题头）
- 悬崖（`yplace-cliff`）  — knowledge → `owner-ocr-20261116-cont-yplace-cliff`  （《李尔王》多佛假想悬崖）
- 祭坛（`yplace-altar`）  — knowledge → `owner-ocr-20261115-30fd94146fc8f81b`  （古希腊歌舞场中央祭坛的空间说明）
- 地牢（`yplace-dungeon`）  — knowledge → `owner-ocr-20261116-cont-yplace-dungeon`  （《浮士德》Kerker 囚室）
- 舞厅（`yplace-ballroom`）  — knowledge → `owner-ocr-20261116-cont-yplace-ballroom`  （《樱桃园》第三幕大厅舞会摘录）
- 遗嘱宣读室（`place-v21-willroom`）  — knowledge → `owner-ocr-20261115-2de2862507b7ee86`  （徐訏《遗产》律师在屋内宣读遗嘱的史论说明，不是剧目正文）
- 公共浴室（`place-v21-publicbath`）  — knowledge → `owner-ocr-20261116-cont-place-v21-publicbath`
- 旧照相馆（`place-v21-photostudio`）  — knowledge → `owner-ocr-20261116-cont-place-v21-photostudio`  （《野鸭》旧式摄影室；大段英文正文）

## 备注与限制

- 西文或德文摘录的中文卡名多只出现在正文前的「关联卡」行；判定依据是同剧原文场景词或可定位的中文场面，例如 tent、foundry、kitchen、Kerker、Wozzeck、Marie、cliff，或「募地」场中的小丑与掘坟。
- 若干环境卡（居伦城、花亭、斯特拉的公寓、集市、城门、祭坛、遗嘱宣读室）的出处是教材、史论或访谈中的实质空间说明，不是该剧连续场次正文。已核到具体场景或舞台设计，按公开全文中的同作品空间或可引用的空间解释接受。
- 「旧照相馆」资源体量很大，但仍以《野鸭》摄影室场面支持环境卡，不把它改记成新的完整剧目增量。《沃伊采克》只按 Franzos 1879 残篇计，须在说明里写清版本。
- leftover id 一律按正式现卡名核含义，不恢复歌舞伎、川剧、翎子、急急风等旧义。
- 本批稿件写明机器识别不等于人工终校；低文字量页及 OCR 疑读保留。
