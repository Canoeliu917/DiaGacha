"""Build explicit semantic art records from the current named card pool.

Names and descriptions are authoritative. Old IDs are identifiers only: several
were recycled. This script does not use random numbers, ID hashes, or rarity.
"""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text(encoding="utf8")
pool = json.loads(re.search(r'JSON\.parse\(`(\[\{"id":.*?\])`\)', html, re.S).group(1))
copy_path=ROOT / "scripts/copy-overrides-v39.js"
if copy_path.exists():
    copy_text=copy_path.read_text(encoding="utf8")
    patches,_=json.JSONDecoder().raw_decode(copy_text[copy_text.index("{"):])
    for card in pool:
        patch=patches.get(card["id"],{})
        for field in ("note","observe","stage","blurb"):
            if field in patch: card[field]=patch[field]
        if "note" in patch: card["blurb"]=patch["note"]
by_id = {c["id"]: c for c in pool}
plays = {c["name"]: c for c in pool if c["dimension"] == "剧目"}

GENERIC = set("信使 邻人 见证者 审问者 旧情人 债主 密探 书记官 房东 情敌 继母 来客 逃兵 报讯的孩子 前妻 庇护人 送葬人".split())
ALIASES = {"底层": "在底层", "大胆妈妈和她的孩子们": "大胆妈妈"}
EXPLICIT_SOURCES = {
    "沉默的人": ["车站"], "凯特·凯勒": ["都是我的儿子"],
    "安·迪弗": ["都是我的儿子"], "哈里·霍普": ["送冰的人来了"],
    "提瑞西阿斯": ["俄狄浦斯王", "安提戈涅"],
    "安德洛玛刻": ["特洛亚妇女"], "赫卡柏": ["特洛亚妇女"],
    "俄瑞斯忒斯": ["奠酒人", "厄勒克特拉"], "皮拉得斯": ["奠酒人"],
}
MULTI_TRADITION = {"提瑞西阿斯", "安德洛玛刻", "赫卡柏", "俄瑞斯忒斯", "皮拉得斯"}
role_sources = {}
for c in pool:
    if c["dimension"] not in ("主演", "配角"):
        continue
    name, note = c["name"], c.get("note", "")
    titles = list(dict.fromkeys(re.findall(r"《([^》]+)》", note)))
    if name in GENERIC:
        titles, status = [], "角色类型，非特定原作"
    elif name == "福斯塔夫":
        titles, status = ["亨利四世（莎士比亚）"], "同名异作已区分"
    elif name in EXPLICIT_SOURCES:
        titles, status = EXPLICIT_SOURCES[name], "依角色和剧情核对"
    elif titles:
        titles, status = titles[:1], "当前角色说明明示原作"
    elif c.get("workIds"):
        titles = [by_id[i]["name"] for i in c["workIds"]]
        status = "当前卡名、说明与原作关系核对"
    else:
        raise ValueError(f"Unresolved role source: {name}")
    ids = [plays[ALIASES.get(t, t)]["id"] for t in titles if ALIASES.get(t, t) in plays]
    label = "、".join("《" + t + "》" for t in titles)
    if name == "福斯塔夫":
        label = "《亨利四世》（莎士比亚）"
    if name in GENERIC:
        label = "角色类型，非特定原作"
    elif name in MULTI_TRADITION:
        label = "古希腊悲剧人物，见" + label + "等"
    role_sources[c["id"]] = {
        "id": c["id"], "name": name, "dimension": c["dimension"],
        "sourcePlayLabel": label, "sourcePlayIds": ids, "sourceTitles": titles,
        "sourceKind": "generic" if name in GENERIC else "tradition" if name in MULTI_TRADITION else "work",
        "basis": note, "review": status,
    }

(ROOT / "docs/ROLE_SOURCES_V39.json").write_text(json.dumps({
    "version": 39, "count": len(role_sources),
    "scope": "按当前姓名与剧情识别原作；没有剧目卡仍保留来源标题。通用角色不指定原作，跨剧神话人物列相关剧目而不宣称唯一出处。",
    "corrections": [{"cardId": "yrole-falstaff", "removeWorkIds": ["play-v21-henryiv"], "reason": "福斯塔夫属于莎士比亚的《亨利四世》，现有同名剧目卡是皮兰德娄作品。"}],
    "cards": list(role_sources.values()),
}, ensure_ascii=False, indent=2) + "\n", encoding="utf8")

# Each play has named dramatic objects, not an author portrait or a recycled ID's image.
# era | principal scenic silhouette | secondary sign. Symbols are stage shorthand,
# not claims that every historical production used exactly these objects.
PLAY_SPEC = """
俄狄浦斯王|greek|crossroad|staff
茶馆|china-modern|teahouse|teapot
哈姆雷特|renaissance|battlement|skull
雷雨|china-modern|room|bolt
麦克白|medieval|battlement|dagger
等待戈多|timeless|tree|boot
萨勒姆的女巫|puritan|court|noose
玩偶之家|europe19|door|letter
推销员之死|america20|kitchen|suitcase
窦娥冤|china-old|scaffold|snow
四川好人|parable|shop|mask
樱桃园|russia1900|orchard|axe
西厢记|china-old|garden|letter
贵妇还乡|europe20|station|coin
日出|china-modern|room|coin
原野|china-modern|forest|dagger
恋爱的犀牛|contemporary|city|rhino
玻璃动物园|america20|room|unicorn
李尔王|medieval|storm|crown
奥赛罗|renaissance|battlement|handkerchief
安提戈涅|greek|tomb|dirt
美狄亚|greek|door|dagger
赵氏孤儿|china-old|gate|bundle
桃花扇|china-old|garden|bloodfan
建筑大师|europe19|tower|ladder
暗恋桃花源|china-modern|split|flower
北京人|china-modern|room|bird
白毛女|china-modern|cave|rope
欲望号街车|america20|room|bulb
三姐妹|russia1900|room|clock
海达·高布乐|europe19|room|pistol
浮士德|renaissance|study|book
海鸥|russia1900|lake|bird
万尼亚舅舅|russia1900|study|map
伪君子|europe17|room|mask
吝啬鬼|europe17|room|coin
费加罗的婚礼|europe18|door|letter
伽利略传|renaissance|observatory|telescope
高加索灰阑记|parable|circle|scales
犀牛|europe20|city|rhino
秃头歌女|europe20|room|clock
椅子|timeless|chairs|door
热铁皮屋顶上的猫|america20|room|crutch
进入黑夜的漫长旅程|america20|room|bottle
莎乐美|biblical|palace|tray
皮格马利翁|europe1900|study|flower
仲夏夜之梦|renaissance|forest|flower
威尼斯商人|renaissance|court|scales
罗密欧与朱丽叶|renaissance|balcony|flower
第十二夜|renaissance|split|mask
家|china-modern|courtyard|book
屈原|china-old|temple|torch
关汉卿|china-old|stage|scroll
骆驼祥子|china-modern|street|rickshaw
龙须沟|china-modern|courtyard|water
天下第一楼|china-modern|shop|tray
桑树坪纪事|china-modern|village|grain
狗儿爷涅槃|china-modern|field|dirt
商鞅|china-old|gate|scroll
曹操与杨修|china-old|tent|sword
立秋|china-modern|shop|coin
被缚的普罗米修斯|greek|cliff|chain
阿伽门农|greek|gate|axe
特洛亚妇女|greek|ruin|bundle
酒神的伴侣|greek|forest|staff
利西翠妲|greek|gate|key
鸟|greek|sky|bird
费德尔|classical|palace|flame
熙德|medieval|battlement|sword
一仆二主|europe18|doors|tray
三毛钱歌剧|europe1900|street|coin
终局|timeless|room|trash
克拉普的最后录音带|europe20|study|tape
榆树下的欲望|america19|farm|tree
人民公敌|europe19|bathhouse|water
群鬼|europe19|room|sun
培尔·金特|europe19|mountain|mask
钦差大臣|russia19|office|letter
在底层|russia1900|cellar|lamp
圣女贞德|medieval|scaffold|flame
华伦夫人的职业|europe19|room|coin
暴风雨|renaissance|island|staff
理查三世|medieval|battlement|crown
裘力斯·凯撒|roman|palace|dagger
阴谋与爱情|europe18|room|letter
威廉·退尔|medieval|mountain|applebow
蔡文姬|china-old|tent|scroll
上海屋檐下|china-modern|courtyard|window
升官图|china-modern|office|chop
陈毅市长|china-modern|office|map
窝头会馆|china-modern|courtyard|bowl
蒋公的面子|china-modern|dining|cup
朱莉小姐|europe19|kitchen|bird
野鸭|europe19|attic|duck
造谣学校|europe18|room|screen
大胆妈妈|europe17|road|wagon
肮脏的手|europe20|office|pistol
奠酒人|greek|tomb|jug
厄勒克特拉|greek|gate|tomb
谁害怕弗吉尼亚·伍尔夫|america20|room|bottle
禁闭|europe20|room|door
正义者|europe20|street|clock
卡利古拉|roman|palace|mirror
误会|europe20|inn|key
女仆|europe20|room|mirror
阳台|europe20|balcony|mask
快乐的日子|timeless|mound|bag
伤心之家|europe1900|room|ship
巴巴拉少校|europe1900|factory|coin
六个寻找作者的剧中人|europe20|stage|mask
亨利四世|europe20|palace|mask
死无葬身之地|europe20|prison|rope
动物园的故事|america20|bench|dog
美国梦|america20|room|mask
十二怒汉|america20|jury|scales
背叛|contemporary|room|clock
都是我的儿子|america20|yard|gear
哥本哈根|europe20|circle|atom
沃伊采克|europe19|barracks|blade
丹东之死|europe18|assembly|guillotine
恋马狂|contemporary|stable|horse
艺术|contemporary|gallery|whitecanvas
车站|china-modern|station|clock
如梦之梦|contemporary|circle|water
生死场|china-modern|field|grain
送冰的人来了|america20|bar|bottle
春醒|europe1900|classroom|book
桥头眺望|america20|dock|bridge
"""
play_specs = {a: {"era": b, "scene": c, "symbol": d} for a, b, c, d in (line.split("|") for line in PLAY_SPEC.strip().splitlines())}
assert set(play_specs) == set(plays), (set(plays) - set(play_specs), set(play_specs) - set(plays))
PLAY_DETAILS = {
    "玩偶之家":("door",["key","letter"],"门与信箱夹住娜拉的家庭生活，钥匙与借据信构成去留选择。"),
    "费加罗的婚礼":("doors",["letter","wedding"],"并列房门与交错的信件把婚礼筹备变成身份和权力的周旋。"),
    "日出":("hotel",["mirror","coin"],"旅馆镜面与金钱处在同一室内，精致生活被经济交换包围。"),
    "吝啬鬼":("vault",["chest","coin"],"紧闭钱箱占据室内中心，钥匙和散落钱币将占有欲具象化。"),
    "恋爱的犀牛":("zoo",["rhino","heart"],"栅栏中的单只犀牛与栏外爱心相隔，强调马路的职业和难以抵达的爱情。"),
    "犀牛":("herd",["rhino","person"],"城市街道上一群犀牛同向奔走，与一位仍是人的身形对置。"),
    "三姐妹":("threewindows",["clock","suitcase"],"三扇并列窗对应三姐妹，共用时钟与未启程的箱子呈现留与走。"),
    "秃头歌女":("clockroom",["clock","speech"],"客厅的错位时钟和断裂对话气泡，让语言循环替代情节进展。"),
    "伪君子":("room",["book","mask"],"表面虔敬的书本置于假面之前，室内门后保留窥探位置。"),
    "美国梦":("consumerroom",["box","mask"],"消费品包装箱与整齐客厅中的空面具并置，指向家庭与商品化身份。"),
    "进入黑夜的漫长旅程":("nightwindow",["bottle","clock"],"长窗从日光转成夜色，酒瓶与时钟留在同一张家庭桌上。"),
    "谁害怕弗吉尼亚·伍尔夫":("duelroom",["bottle","brokenglass"],"相对的两把椅子围住酒瓶与破杯，客厅成为夫妻言语角力场。"),
    "艺术":("gallery",["whitecanvas","eye"],"画框内保持几乎全白，三个人的观看位置围绕这块空白展开。"),
    "等待戈多":("tree",["boot","bowler"],"一棵孤树、乡路、靴子与圆顶礼帽组成等待，没有把戈多画成到场人物。"),
    "樱桃园":("orchard",["flower","axe"],"盛开树冠与砍树斧在画面两端，旧庄园的记忆与拍卖后的变化共存。"),
    "俄狄浦斯王":("crossroad",["crown","staff"],"王冠置于交叉道路上方，手杖连起追查与失明后的流亡。"),
    "哈姆雷特":("battlement",["skull","curtain"],"城垛、骷髅和小型戏幕把宫廷窥探、死亡思考及戏中戏连在一起。"),
    "雷雨":("room",["window","bolt"],"闭合客厅的百叶窗被一道雷电切开，压抑家庭秩序与爆发同框。"),
    "萨勒姆的女巫":("court",["letter","noose"],"供词纸张与绞索分处审判席两侧，拒绝签字的冲突清楚可辨。"),
    "奥赛罗":("battlement",["handkerchief","sword"],"军人城垛前的小手帕被突出，私人伪证与军事权力形成尺度反差。"),
}

# Specific protagonists/supporting parts. Each row is a deliberate shape/gesture/prop
# decision; era defaults below cover less iconic parts without inventing costume history.
# name | figure | head | prop | pose | costume | secondary motif
ROLE_SPEC = """
俄狄浦斯|lipao|circlet|staff|guard|royal|crossroad
娜拉|changqun|bun|key|step|formal|door
哈姆雷特|doupeng|short|skull|hold|mourning|battlement
繁漪|qipao|wave|cup|fold|formal|window
麦克白|jiazhou|helmet|dagger|guard|royal|crown
窦娥|baiyi|long|none|raise|mourning|snow
普罗克托|gongzhuang|short|letter|guard|work|noose
麦克白夫人|changqun|bun|candle|hold|royal|blood
王利发|changshan|cap|towel|bow|work|teapot
沈黛|qipao|bun|mask|hold|plain|shop
周朴园|changshan|sidepart|glasses|fold|formal|clock
明明|tongqun|long|none|guard|plain|rhino
威利·洛曼|dayi|short|case|bow|worn|car
安提戈涅|pizhe|braid|dirt|guard|mourning|tomb
陈白露|qipao|wave|mirror|hold|formal|sun
爱斯特拉冈|zuozi|bowler|boot|bow|worn|tree
鲁侍萍|laozuo|bun|towel|fold|work|window
李香君|changqun|bun|bloodfan|guard|formal|flower
程婴|changshan|topknot|bundle|hold|worn|gate
卡特琳|laozuo|braid|drum|raise|work|wagon
美狄亚|pizhe|long|dagger|guard|mourning|door
李尔|goulou|white|staff|raise|worn|storm
伊阿古|zhifu|short|handkerchief|hold|formal|mask
大胆妈妈|gongzhuang|hood|wagon|step|work|coin
江滨柳|zuozi|white|letter|hold|plain|flower
愫方|qipao|bun|bundle|hold|plain|door
布兰奇|changqun|wave|bulb|hold|formal|lamp
劳拉|tongqun|wave|unicorn|hold|plain|glass
阿比盖尔|jinpao|hood|none|raise|plain|noose
洛夫伯格|dayi|wild|book|bow|worn|pistol
弗拉季米尔|dayi|bowler|hat|reach|worn|tree
奥菲利娅|changqun|long|flower|hold|plain|water
朱丽叶|changqun|braid|flower|reach|formal|balcony
罗密欧|duanda|short|sword|reach|formal|balcony
夏洛克|dayi|cap|scales|hold|formal|coin
伊莉莎|laozuo|widehat|flower|reach|work|book
海达|changqun|bun|pistol|guard|formal|book
伽利略|lipao|bald|telescope|raise|plain|globe
阿巴贡|dayi|cap|chest|fold|worn|coin
答尔丢夫|lipao|short|book|fold|plain|mask
费加罗|duanda|short|letter|step|work|door
梅菲斯特|doupeng|wild|book|reach|formal|flame
考狄利娅|changqun|braid|none|guard|plain|crown
苔丝狄蒙娜|baiyi|long|handkerchief|hold|plain|bed
波卓|dayi|bowler|rope|guard|formal|tree
幸运儿|goulou|white|case|bow|worn|rope
克里斯汀|laozuo|bun|bowl|hold|work|kitchen
红娘|duanda|braid|letter|step|plain|garden
崔莺莺|changqun|bun|fan|hold|formal|window
祥子|gongzhuang|short|none|step|work|rickshaw
虎妞|qipao|bun|key|guard|plain|rickshaw
周冲|duanda|short|book|reach|plain|bolt
四凤|laozuo|braid|towel|hold|work|door
金子|qipao|long|bundle|step|plain|forest
觉新|changshan|short|book|fold|formal|door
婵娟|changqun|braid|cup|hold|plain|flame
朱帘秀|changqun|bun|scroll|raise|formal|stage
曹操|jiazhou|cap|sword|guard|royal|tent
杨修|changshan|topknot|scroll|hold|formal|sword
狗儿爷|goulou|short|dirt|bow|worn|field
商鞅|lipao|cap|scroll|raise|formal|gate
普罗米修斯|pizhe|long|chain|raise|worn|cliff
克吕泰涅斯特拉|pizhe|circlet|axe|guard|royal|gate
三女巫|jinpao|hood|staff|fold|worn|cauldron
霍拉旭|duanda|short|book|hold|plain|battlement
鲍西娅|lipao|cap|scales|raise|formal|book
普洛斯彼罗|doupeng|white|staff|raise|layered|book
爱丽儿|duanda|wild|none|reach|plain|wind
理查三世|goulou|circlet|sword|guard|royal|crown
福斯塔夫|zuozi|widehat|cup|reach|worn|bottle
海尔茂|xizhuang|sidepart|letter|fold|formal|door
斯多克芒|dayi|short|book|raise|plain|water
赫列斯达可夫|lifu|sidepart|letter|raise|formal|coin
周萍|xizhuang|sidepart|none|fold|formal|bolt
仇虎|gongzhuang|wild|dagger|guard|worn|forest
觉慧|changshan|short|book|step|plain|door
常四爷|magua|cap|bird|hold|plain|teapot
格莱格斯|dayi|short|none|guard|plain|duck
厄勒克特拉|pizhe|long|jug|fold|mourning|tomb
埃利夫|zhifu|helmet|sword|step|worn|wagon
张生|changshan|cap|book|hold|plain|letter
泰斯曼|xizhuang|sidepart|book|hold|formal|pistol
喜儿|baiyi|white|rope|guard|worn|snow
玛莎|changqun|wave|cup|raise|formal|bottle
乔治|xizhuang|sidepart|book|fold|formal|bottle
霍尼|tongqun|short|cup|fold|plain|bottle
马路|gongzhuang|short|none|reach|work|rhino
侯方域|changshan|cap|fan|hold|formal|bloodfan
桃丽娜|laozuo|bun|none|guard|work|mask
麦克希思|xizhuang|sidepart|dagger|hold|formal|coin
汉姆|zuozi|bald|staff|guard|worn|window
琳达|changqun|bun|towel|fold|plain|suitcase
斯坦利|gongzhuang|short|bottle|guard|work|bulb
布鲁图斯|pizhe|laurel|dagger|fold|formal|column
克莉奥佩特拉|pizhe|circlet|none|raise|royal|snake
伊阿宋|jiazhou|short|sword|guard|formal|ship
索尔维格|changqun|braid|none|hold|plain|cabin
凯列班|goulou|wild|bundle|guard|worn|island
诸葛亮|changshan|cap|fan|hold|formal|gate
蒂兹尔|dayi|white|none|fold|formal|screen
克瑞翁|lipao|circlet|scroll|guard|royal|gate
伊斯墨涅|pizhe|braid|none|fold|plain|tomb
提瑞西阿斯|goulou|white|staff|raise|plain|crossroad
乳母（朱丽叶）|jinpao|hood|letter|hold|work|balcony
茂丘西奥|duanda|short|sword|step|formal|mask
班柯|jiazhou|helmet|sword|guard|formal|ghost
麦克德夫|jiazhou|short|sword|raise|worn|battlement
莱尔提斯|duanda|short|sword|guard|formal|skull
波洛涅斯|dayi|white|letter|fold|formal|screen
乔特鲁德|changqun|circlet|cup|hold|royal|battlement
克劳狄斯|lipao|circlet|cup|fold|royal|crown
爱米利娅|laozuo|bun|handkerchief|raise|work|bed
卡西奥|zhifu|short|sword|guard|formal|cup
罗德利哥|lifu|short|coin|reach|formal|handkerchief
高纳里尔|changqun|circlet|letter|guard|royal|crown
里根|changqun|bun|none|fold|royal|crown
爱德蒙|duanda|short|letter|hold|formal|sword
肯特|dayi|white|staff|guard|worn|storm
弄人|duanda|ribbon|bell|reach|worn|crown
格洛斯特|goulou|white|staff|bow|worn|cliff
爱德伽|poyi|wild|none|guard|worn|storm
马尔科姆|jiazhou|short|sword|hold|formal|branch
邓肯|lipao|circlet|none|hold|royal|crown
卡珊德拉|pizhe|long|staff|raise|mourning|flame
安德洛玛刻|pizhe|hood|bundle|hold|mourning|ruin
赫卡柏|goulou|white|none|raise|mourning|ruin
阿伽门农|jiazhou|helmet|sword|guard|royal|gate
埃癸斯托斯|pizhe|circlet|sword|guard|royal|axe
俄瑞斯忒斯|pizhe|short|sword|guard|mourning|tomb
皮拉得斯|pizhe|short|none|reach|plain|tomb
格劳刻|pizhe|circlet|cloak|hold|formal|flame
美狄亚的乳母|jinpao|hood|none|guard|plain|door
埃勾斯|lipao|circlet|staff|hold|royal|ship
玛尔塔|laozuo|bun|key|fold|work|inn
林丹太太|changqun|bun|letter|hold|plain|door
阮克医生|dayi|short|glasses|fold|formal|letter
柯洛克斯泰|dayi|sidepart|letter|guard|worn|key
杜瓦先生|dayi|white|letter|hold|formal|flower
洛巴辛|xizhuang|sidepart|axe|hold|work|orchard
加耶夫|lifu|white|cane|fold|formal|orchard
瓦里雅|changqun|bun|key|hold|work|orchard
安妮娅|tongqun|braid|none|step|plain|flower
特罗费莫夫|dayi|short|book|raise|worn|orchard
谢列布里亚科夫|zuozi|white|book|fold|formal|study
索尼娅|laozuo|braid|book|hold|work|lamp
叶列娜|changqun|bun|fan|hold|formal|map
奥尔加|changqun|bun|book|fold|work|clock
伊里娜|tongqun|braid|book|reach|plain|clock
图森巴赫|zhifu|short|none|hold|formal|clock
索列尼|zhifu|short|sword|guard|formal|clock
韦尔希宁|zhifu|sidepart|none|reach|formal|clock
安德烈|xizhuang|sidepart|violin|hold|worn|clock
特里波列夫|xizhuang|short|book|guard|plain|bird
阿尔卡季娜|changqun|wave|fan|raise|formal|stage
尼娜|tongqun|braid|bird|reach|plain|lake
特里戈林|xizhuang|sidepart|book|hold|formal|bird
路加|goulou|white|staff|hold|worn|lamp
佩佩尔|gongzhuang|short|none|guard|worn|cellar
市长|zhifu|short|letter|fold|formal|coin
卡巴诺娃|jinpao|hood|none|guard|formal|door
吉洪|dayi|short|none|bow|formal|door
鲍里斯|dayi|sidepart|letter|fold|formal|storm
希波吕托斯|duanda|short|sword|guard|plain|horse
俄诺涅|jinpao|hood|none|fold|plain|palace
忒修斯|jiazhou|circlet|sword|raise|royal|palace
克洛夫|goulou|short|ladder|step|worn|window
纳格|zuozi|white|none|fold|worn|trash
奈尔|zuozi|hood|none|hold|worn|trash
让|xizhuang|short|none|guard|formal|rhino
消防队长|zhifu|helmet|bell|raise|work|clock
克莱尔|laozuo|bun|mirror|hold|work|mask
索朗日|laozuo|hood|cup|guard|work|mask
鲁大海|gongzhuang|short|none|guard|work|gear
鲁贵|magua|cap|cup|fold|worn|coin
潘月亭|xizhuang|sidepart|coin|hold|formal|sun
李石清|xizhuang|sidepart|book|fold|formal|coin
黄省三|dayi|short|letter|bow|worn|door
方达生|xizhuang|short|book|reach|plain|sun
翠喜|qipao|bun|none|hold|worn|window
焦母|goulou|white|staff|guard|mourning|forest
焦大星|gongzhuang|short|none|fold|plain|forest
白傻子|poyi|wild|none|reach|worn|forest
曾文清|changshan|short|bird|hold|worn|window
曾思懿|qipao|bun|key|guard|formal|door
曾皓|zuozi|white|cane|fold|formal|clock
瑞贞|qipao|braid|bundle|step|plain|door
秦仲义|magua|cap|coin|guard|formal|teapot
松二爷|changshan|cap|bird|hold|worn|teapot
刘麻子|magua|cap|coin|reach|formal|teapot
康顺子|laozuo|bun|towel|hold|work|teapot
刘四爷|magua|white|key|guard|formal|rickshaw
小福子|laozuo|braid|bundle|hold|worn|rickshaw
匡复|dayi|short|letter|hold|worn|courtyard
杨彩玉|qipao|bun|none|fold|plain|window
林志成|changshan|short|book|bow|worn|courtyard
黄家楣|gongzhuang|short|none|step|work|courtyard
祁永年|gongzhuang|cap|dirt|guard|work|field
修鼎新|changshan|cap|book|fold|formal|tray
夏教授|changshan|short|book|fold|plain|cup
时教授|xizhuang|sidepart|book|hold|formal|cup
黑子|gongzhuang|short|none|guard|worn|train
蜜蜂|tongqun|braid|none|reach|plain|train
车长|zhifu|cap|lantern|raise|work|train
信使|duanda|short|letter|step|plain|road
邻人|dayi|short|none|reach|plain|window
见证者|dayi|short|none|raise|plain|eye
审问者|xizhuang|sidepart|book|guard|formal|lamp
旧情人|dayi|short|letter|hold|plain|clock
债主|xizhuang|sidepart|letter|guard|formal|coin
密探|doupeng|hood|letter|fold|plain|eye
书记官|xizhuang|sidepart|quill|hold|work|book
房东|dayi|short|key|guard|formal|door
情敌|xizhuang|short|none|guard|plain|flower
继母|changqun|bun|none|fold|formal|door
来客|dayi|short|case|hold|plain|door
逃兵|zhifu|short|bundle|step|worn|road
报讯的孩子|duanda|short|letter|raise|plain|road
前妻|changqun|bun|letter|hold|plain|clock
庇护人|dayi|short|key|reach|plain|door
送葬人|dayi|hood|flower|bow|mourning|tomb
奥赛罗|jiazhou|short|handkerchief|guard|formal|sword
瓦尼亚舅舅|dayi|short|pistol|fold|worn|study
阿斯特罗夫|dayi|short|map|hold|work|tree
贝兰杰|xizhuang|short|none|guard|worn|rhino
卡捷琳娜|changqun|braid|none|raise|plain|storm
费德尔|pizhe|circlet|none|fold|royal|flame
玛格丽特|changqun|wave|flower|hold|formal|letter
安东尼|jiazhou|laurel|sword|fold|royal|ship
伏伦妮娅|pizhe|white|none|raise|formal|crown
卡利古拉|pizhe|laurel|mirror|hold|royal|moon
玛丽·泰隆|changqun|white|none|fold|plain|bottle
埃德蒙·泰隆|dayi|short|book|hold|worn|window
阿曼达|changqun|bun|flower|hold|formal|unicorn
汤姆|dayi|short|book|step|worn|unicorn
温妮|zuozi|widehat|bag|hold|formal|mound
吉姆|xizhuang|sidepart|unicorn|hold|formal|lamp
乔·凯勒|gongzhuang|short|none|fold|work|gear
海森堡|xizhuang|sidepart|book|hold|formal|atom
沃伊采克|zhifu|short|blade|bow|worn|barracks
丹东|dayi|wave|none|fold|formal|guillotine
埃迪·卡伯恩|gongzhuang|short|none|guard|work|bridge
希基|xizhuang|sidepart|case|raise|formal|bottle
梅尔希奥|duanda|short|book|hold|plain|classroom
艾伦|duanda|short|none|guard|plain|horse
如梦之梦的医生|baiyi|short|book|hold|work|water
金枝|laozuo|braid|bundle|hold|worn|grain
沉默的人|dayi|short|none|fold|plain|station
塞尔吉|xizhuang|sidepart|none|hold|formal|whitecanvas
凯特·凯勒|changqun|bun|none|fold|plain|tree
玻尔|dayi|white|book|raise|formal|atom
玛丽|changqun|bun|bundle|hold|worn|barracks
罗伯斯庇尔|lifu|white|scroll|raise|formal|guillotine
凯瑟琳|tongqun|wave|none|reach|plain|bridge
安·迪弗|changqun|wave|letter|hold|plain|gear
护士|baiyi|bun|book|hold|work|horse
莫里茨|duanda|wild|book|bow|worn|classroom
赵三|gongzhuang|cap|dirt|guard|worn|grain
马主任|xizhuang|sidepart|book|guard|formal|station
哈里·霍普|zuozi|white|cup|fold|worn|bottle
马克|xizhuang|short|none|guard|plain|whitecanvas
"""
role_specs = {a: dict(zip(("fig", "head", "prop", "pose", "costume", "symbol"), rest)) for a, *rest in (line.split("|") for line in ROLE_SPEC.strip().splitlines())}
assert set(role_specs) == {c["name"] for c in pool if c["dimension"] in ("主演", "配角")}

# name | semantic composition | first sign | second sign
CONCEPT_SPEC = """
古典主义|triangle|column|scroll
斯坦尼体系|target|person|book
史诗剧场|stage|placard|book
残酷戏剧|radiate|hand|drum
荒诞派|loop|clock|chair
现实主义|room|table|window
写意戏剧|stage|chair|staff
表现主义|distort|mask|shadow
自然主义|room|plant|glass
浪漫主义|mountain|moon|flame
质朴戏剧|duet|person|eye
象征主义|mist|flower|moon
心理现实主义|portrait|eye|heart
后现代拼贴|split|book|screen
纪实剧场|archive|letter|mic
唯美主义|frame|flower|fan
假定性|stage|chair|mask
希腊悲剧|chorus|column|mask
即兴喜剧|duet|mask|scroll
极简舞台|stage|chair|none
夸张演技|radiate|mask|hand
长篇结构|timeline|book|clock
歌剧|sound|notes|mask
音乐剧|dance|notes|speech
环境戏剧|circle|audience|person
后戏剧剧场|cluster|person|screen
黑色幽默|split|mask|skull
身体剧场|dance|hand|person
社会问题剧|duet|scales|house
回顾式|reverse|clock|book
人像展览|chorus|person|window
开放结局|fork|door|question
独幕剧|stage|one|curtain
多幕剧|timeline|curtain|clock
戏中戏|nested|mask|audience
剪影叙事|shadow|person|lamp
叙述者|speech|person|book
默剧|gesture|hand|silence
论坛戏剧|audience|hand|repeat
一人一故事|duet|speech|ear
文献剧场|archive|letter|book
站点特定|site|map|gate
行走剧场|route|footprints|audience
声音剧场|sound|ear|wave
政治剧场|assembly|scales|placard
女性主义剧场|duet|scales|speech
喜剧|duet|mask|speech
悲剧|crack|mask|tomb
闹剧|doors|mask|footprints
悲喜剧|split|mask|tear
诗剧|speech|scroll|moon
舞剧|dance|person|notes
多线情节|fork|thread|clock
分场结构|timeline|frame|curtain
话剧|duet|speech|person
实验剧场|lab|stage|question
文乐|puppet|puppet|notes
史诗身体|chorus|person|drum
人物弧光|arc|person|arrow
贯穿行动|route|target|person
最高任务|target|arrow|person
滑稽戏|duet|mask|speech
双人剧|duet|person|person
情绪记忆|portrait|clock|heart
当众孤独|focus|person|audience
配角功能|network|person|arrow
群像结构|chorus|person|thread
讽刺短剧|frame|mask|mirror
演员距离|duet|mask|eye
史诗叙述|timeline|book|placard
场面调度|route|person|arrow
文明戏|stage|scroll|placard
活报剧|street|newspaper|speech
街头剧|street|audience|person
神秘剧|wagon|cross|scroll
道德剧|fork|scales|mask
受难剧|procession|cross|crown
喜歌剧|sound|mask|notes
轻歌剧|dance|fan|notes
物体剧场|objects|cup|chair
影像剧场|split|screen|person
装置剧场|site|frame|route
小丑戏剧|gesture|rednose|hat
面具剧|portrait|mask|hand
教育戏剧|circle|book|hand
社区剧场|circle|house|audience
被压迫者剧场|audience|chain|hand
形象剧场|freeze|person|person
隐形剧场|street|person|eye
魔幻现实主义|room|bird|moon
批判现实主义|room|scales|coin
诗意现实主义|room|flower|moon
叙事体戏剧|timeline|placard|book
仪式戏剧|circle|drum|flame
假面喜剧|duet|mask|bell
风俗喜剧|room|fan|mirror
客厅喜剧|room|chair|speech
通俗情节剧|fork|letter|dagger
古典诗学|triangle|book|column
规定情境|room|clock|map
书信体戏剧|exchange|letter|quill
法庭剧|court|scales|letter
悬疑剧|focus|key|question
寓言剧|frame|mask|scales
家庭剧|room|table|thread
心理惊悚剧|distort|eye|shadow
元戏剧|nested|mask|mirror
自传剧场|portrait|book|clock
复调剧场|chorus|speech|notes
极繁主义剧场|cluster|screen|notes
排练场戏剧|stage|book|mirror
广播剧|sound|mic|ear
读剧|speech|book|person
手语剧场|gesture|hand|eye
感官剧场|radiate|ear|hand
科幻戏剧|sky|atom|globe
室内剧|room|door|chair
总体戏剧|cluster|notes|lamp
逐字剧场|archive|mic|letter
市民悲剧|room|coin|tear
历史剧场|timeline|scroll|column
跨文化剧场|exchange|mask|speech
视觉戏剧|frame|eye|person
儿童剧场|circle|kite|book
新马戏|balance|rope|person
广场戏剧|circle|audience|sun
家庭室内剧|room|table|door
翻译剧场|exchange|speech|caption
第四堵墙|glasswall|person|audience
间离术|stage|placard|arrow
歌队介入|chorus|person|notes
空的空间|duet|person|eye
仪式调度|circle|person|drum
沉浸破墙|audience|door|person
蒙太奇|split|frame|scissors
一人分饰|transform|mask|mask
倒叙开场|reverse|clock|arrow
形体无言|gesture|person|silence
论坛停演|audience|stop|hand
当众迁景|move|chair|person
定格静场|freeze|person|stop
文档朗读|speech|letter|mic
投影并置|split|screen|person
旁白定场|speech|map|clock
假面|portrait|mask|hand
灯光分区|split|lamp|lamp
现场乐师|sound|violin|person
独白直给|speech|person|audience
黑场切断|blackout|lamp|stop
假定性公开|stage|mask|chair
多线并置|split|thread|arrow
慢动作|slow|person|clock
傀儡介入|puppet|puppet|hand
转台|revolve|stage|arrow
点名观众|audience|hand|speech
当场变装|transform|coat|mask
跟光|followlight|lamp|person
顶光|toplight|lamp|person
侧光|sidelight|lamp|person
追光|followlight|lamp|footprints
静场|freeze|person|silence
急停|freeze|footprints|stop
对视|duet|eye|eye
背身|back|person|audience
当众换景|move|door|person
观众入戏|audience|footprints|person
重复段落|loop|frame|repeat
打断|crack|speech|stop
合唱|chorus|notes|notes
旁唱评论|duet|notes|speech
节奏提示|timeline|drum|notes
造型停顿|freeze|hand|person
夜行调度|route|moon|footprints
虚拟赶路|route|staff|footprints
手势语法|gesture|hand|arrow
情绪突变|transform|mask|bolt
火焰效果|radiate|flame|lamp
环形走位|circle|footprints|arrow
台词节奏|timeline|speech|notes
分屏|split|screen|frame
镜像|mirror|person|person
群像|chorus|person|person
沉默|speech|silence|person
即兴插入|fork|speech|question
画外音|sound|speaker|frame
旁白|speech|book|person
出场准备|door|person|clock
手臂轨迹|gesture|hand|arc
手势定点|focus|hand|target
视线引导|route|eye|arrow
头部节奏|timeline|eye|notes
道具延展|gesture|hand|staff
小道具|objects|letter|glasses
打斗节拍|duet|sword|drum
跌倒动作|tilt|person|arrow
直体后倒|tilt|person|stop
低姿停顿|low|person|chair
肩倒|roll|person|arc
暗转|blackout|door|arrow
切光|split|lamp|stop
逆光|backlight|lamp|person
纱幕|scrim|person|lamp
升降台|lift|stage|arrow
车台|wagon|stage|wheel
群众演员|chorus|person|person
进场四拍|fourbeats|footprints|drum
加速节奏|accelerate|clock|arrow
大道具|objects|table|chair
底幕|curtain|frame|none
公开喝水|gesture|cup|person
双侧上下场|doors|person|arrow
内心独白|portrait|speech|heart
潜台词|layered|speech|heart
对白|duet|speech|speech
伴唱|duet|person|notes
齐唱|chorus|notes|one
冷场|duet|silence|clock
脚光|footlight|lamp|person
面光|frontlight|lamp|eye
雨幕|rain|water|curtain
烟雾|mist|smoke|person
天幕|sky|sun|curtain
边幕|wings|curtain|door
急奔调度|route|footprints|arrow
武器调度|duet|sword|arrow
年龄妆|portrait|mask|clock
步态设计|route|boot|person
闪回|reverse|frame|clock
角色互换|exchange|mask|person
复述证词|archive|speech|letter
同句异义|duet|speech|mask
现场拟音|sound|hand|objects
时间跳接|timeline|clock|scissors
声画错位|split|speaker|screen
实时字幕|split|caption|speech
台词接力|exchange|speech|arrow
道具易主|exchange|key|hand
空椅对话|duet|chair|speech
不可靠叙述|speech|mask|question
选择性重演|reverse|frame|eye
同时独白|split|speech|speech
遮挡揭示|scrim|eye|curtain
空间压缩|compress|person|wall
结尾回环|loop|door|arrow
水池舞台|pool|water|person
麦克风独白|speech|mic|person
演员读提示|speech|book|arrow
全员旁观|chorus|eye|person
物件传递链|exchange|cup|hand
反向计时|reverse|clock|stop
地面作图|floorplan|map|chalk
声音先行|sound|speaker|arrow
迟到开场|layered|clock|question
静默开场|freeze|person|silence
旋转门进出|revolve|door|person
记忆错位重演|split|clock|mirror
"""
concept_specs = {a: {"scene": b, "symbols": [c, d]} for a, b, c, d in (line.split("|") for line in CONCEPT_SPEC.strip().splitlines())}
assert set(concept_specs) == {c["name"] for c in pool if c["dimension"] in ("风格体系", "导演手法")}

SPACE_SPEC = """
候场区|wings|curtain|clock
裕泰茶馆|teahouse|teapot|table
艾尔西诺城堡|battlement|crown|ghost
周公馆|room|clock|window
乡间小路|tree|boot|road
荒园|garden|branch|gate
邓西嫩城堡|battlement|branch|crown
娜拉的客厅|room|door|letter
窦娥刑场|scaffold|snow|scroll
四川某城|shop|scales|coin
樱桃园|orchard|flower|axe
居伦城|station|coin|scales
城市动物园|zoo|rhino|fence
洛曼家厨房|kitchen|table|suitcase
黑林子|forest|moon|footprints
空台|stage|none|none
忒拜广场|palace|column|staff
李尔的荒原|storm|crown|staff
媚香楼|balcony|fan|flower
花亭|garden|table|flower
夜营|tent|lamp|moon
斯特拉的公寓|room|bed|bulb
素台|stage|chair|none
黑匣子|blackbox|chair|lamp
镜框式舞台|proscenium|curtain|audience
普洛斯彼罗的岛|island|staff|wave
曾家花厅|room|bird|clock
后台|wings|coat|mirror
城堡|battlement|gate|crown
法庭|court|scales|book
码头|dock|ship|suitcase
阁楼|attic|ladder|window
地下室|cellar|lamp|stairs
阳台|balcony|window|flower
宫廷|palace|column|crown
集市|market|coin|tray
工厂|factory|gear|bell
祠堂|temple|tablet|flame
戏台|proscenium|curtain|drum
书房|study|book|lamp
墓地|tomb|flower|tomb
神庙|temple|column|flame
医院|hospital|cross|door
教室|classroom|book|bell
轮船|ship|wheel|wave
车厢|train|window|suitcase
屋顶|rooftop|moon|city
废墟|ruin|column|branch
胡同|street|door|window
四合院|courtyard|door|tree
茶楼|teahouse|teapot|stool
厨房|kitchen|bowl|flame
监狱|prison|key|clock
修道院|temple|cross|bell
桥头|bridge|water|footprints
雪原|snowfield|snow|footprints
矿井|mine|lamp|rope
马戏团|circus|rope|drum
十字路口|crossroad|arrow|footprints
环球剧场|globe|stage|audience
侧桥|bridge|stage|footprints
乐池|pit|violin|notes
长亭|garden|branch|cup
绣楼|balcony|window|flower
池座|seats|audience|stage
客栈|inn|key|suitcase
画舫|ship|lamp|notes
井台|well|bowl|rope
公堂|court|chop|scroll
金殿|palace|crown|scroll
偏殿|room|door|crown
中军帐|tent|map|sword
渡口|dock|ship|water
赤壁|dock|ship|flame
石库门|courtyard|gate|window
亭子间|attic|window|lamp
土地庙|temple|tablet|bowl
城门|gate|guard|road
校场|yard|sword|drum
法场|scaffold|blade|scroll
病房|hospital|bed|door
咖啡馆|cafe|cup|table
月台|station|clock|suitcase
甲板|ship|rope|wind
灯塔|tower|lamp|wave
悬崖|cliff|wind|footprints
祭坛|altar|flame|bowl
迷宫|maze|arrow|footprints
地牢|prison|chain|stairs
温室|greenhouse|plant|glass
马厩|stable|horse|grain
葡萄园|field|plant|basket
舞厅|ballroom|notes|lamp
办公室|office|book|telephone
车间|factory|gear|hammer
桥廊|bridge|curtain|footprints
上台口|door|curtain|arrow
台心|stage|target|lamp
菜市口|scaffold|audience|blade
闺房|room|mirror|window
边境检查站|checkpoint|gate|passport
遗嘱宣读室|room|letter|coin
公共浴室|bathhouse|water|towel
婚礼宴厅|dining|flower|cup
避难所|shelter|bundle|bowl
殡仪馆|tomb|flower|letter
失物招领处|counter|suitcase|key
旧照相馆|gallery|camera|frame
售票窗口|counter|ticket|clock
电梯|lift|door|arrow
药房|counter|bottle|cross
餐车|train|table|cup
废弃游乐场|circus|wheel|branch
排练厅|stage|mirror|book
候审室|room|door|scales
档案室|archive|book|letter
议会旁听席|assembly|audience|book
隔离病房|glasswall|bed|cross
广播控制室|sound|mic|lamp
矿井吊笼|lift|fence|lamp
大使馆避难厅|checkpoint|passport|bundle
天文台圆顶|observatory|telescope|globe
飞机库后院|yard|gear|plane
夜间客厅|room|atom|lamp
军营冲洗房|bathhouse|water|helmet
雅各宾俱乐部|assembly|placard|scroll
长岸公寓|room|bridge|window
霍普旅馆酒吧|bar|bottle|cup
男生宿舍阁楼|attic|book|bed
精神科观察室|hospital|chair|book
环形莲池|pool|flower|footprints
冻土屯子|village|snow|grain
停运小站|station|clock|stop
"""
space_specs = {a: {"scene": b, "symbols": [c, d]} for a, b, c, d in (line.split("|") for line in SPACE_SPEC.strip().splitlines())}
assert set(space_specs) == {c["name"] for c in pool if c["dimension"] == "环境"}

FIG_DRESS = {"lipao":"robe", "changqun":"gown", "duanda":"doublet", "jiazhou":"armor", "doupeng":"cape", "xizhuang":"suit", "laozuo":"apron", "pizhe":"greek", "poyi":"rags", "dayi":"coat", "lifu":"night", "zhifu":"uniform", "changshan":"scholar", "qipao":"qipao", "magua":"robe", "gongzhuang":"apron", "baiyi":"mourning", "jinpao":"robe", "tongqun":"gown", "zuozi":"coat", "goulou":"rags"}
ERA_LABELS = {"greek":"古希腊题材的披衣与柱廊", "roman":"古罗马题材的披衣与军服", "china-old":"中国古代题材的袍衫与发髻", "china-modern":"近现代中国题材的长衫、旗袍或劳动装", "america20":"二十世纪美国的西装与日常服", "america19":"十九世纪美国的日常服", "europe19":"十九世纪欧洲的长裙与外套", "europe1900":"世纪之交欧洲的礼服与工作服", "russia19":"十九世纪俄国服装语汇", "russia1900":"世纪之交俄国的长裙、西装与军服", "renaissance":"文艺复兴题材的短上衣、披风与长裙", "medieval":"中世纪题材的甲胄、披风与长袍", "europe17":"十七世纪欧洲的袍服与劳动装", "europe18":"十八世纪欧洲的外套与长裙", "europe20":"二十世纪欧洲的西装与日常服", "puritan":"十七世纪新英格兰的朴素长衣与劳动装", "classical":"古典题材的披衣与宫廷符号", "biblical":"圣经题材的袍服与宫廷符号", "timeless":"不指定写实年代；保持作品的简约舞台形象", "parable":"寓言性场景；不冒充地域民族志", "contemporary":"当代日常服与空间"}
PALETTES = {"royal":"#85552e", "formal":"#36485b", "work":"#786044", "worn":"#756751", "mourning":"#3b3944", "layered":"#5c496a", "plain":"#526b62"}
SPECIAL_COLORS = {"哈姆雷特":"#272932", "麦克白":"#506056", "麦克白夫人":"#702d3d", "奥菲利娅":"#c7b99b", "繁漪":"#623850", "窦娥":"#eee5ce", "喜儿":"#e9e4d6", "苔丝狄蒙娜":"#e9e1d3", "李香君":"#ad606b", "朱丽叶":"#ac736b", "普罗克托":"#685743", "阿比盖尔":"#565150", "诸葛亮":"#a4a78c"}
SPECIAL_FACES = {"俄狄浦斯":"blood", "提瑞西阿斯":"blind", "格洛斯特":"blind", "哈姆雷特":"pale", "李尔":"tired", "麦克白":"beard", "麦克白夫人":"tired", "繁漪":"storm", "娜拉":"resolve", "王利发":"tired", "威利·洛曼":"tired", "爱斯特拉冈":"tired", "弗拉季米尔":"tired", "汉姆":"blind", "阿巴贡":"frown", "伽利略":"beard", "曹操":"beard"}

# Cast selection and stage relationship are written per work. No first-available-role
# choice, random position, shared-author lookup or historical-ID inference is used.
PLAY_CAST = """
俄狄浦斯王|duel|俄狄浦斯,提瑞西阿斯|国王面向盲先知追问，二人的手杖形成相对方向。
茶馆|tableau|王利发,常四爷,秦仲义|掌柜在茶桌旁接待不同处境的茶客，三人的手上分别是服务、日常和资本。
哈姆雷特|reveal|哈姆雷特,克劳狄斯,波洛涅斯|王子举骷髅追问死亡，国王在侧、波洛涅斯藏在幕边，表现窥探宫廷。
雷雨|barrier|周朴园,鲁侍萍,繁漪|家长和旧人被客厅边界分隔，繁漪在另一层空间内凝视这次相认。
麦克白|triangle|麦克白,麦克白夫人,三女巫|将军与妻子形成夺权轴线，女巫退在高处，匕首处在预言与行动之间。
等待戈多|tableau|爱斯特拉冈,弗拉季米尔|一人坐着查靴，一人站立摸帽，空路与孤树留出等待的位置。
萨勒姆的女巫|duel|普罗克托,阿比盖尔|农夫守住供词纸，指控者抬手，审判门框与绞索限制两人的去路。
玩偶之家|exit|娜拉,海尔茂|娜拉带钥匙迈向打开的门，丈夫留在室内与信件一侧。
推销员之死|split|威利·洛曼,琳达|疲惫的推销员与照料他的妻子分处现实和回忆交叠的家庭空间。
窦娥冤|solitary|窦娥|白衣女子在刑场抬手申诉，雪从她上方落下，留白承受三桩誓愿。
四川好人|transform|沈黛|善良店主与保护生计的强硬化身并置，同一张脸在店铺两侧改变衣装。
樱桃园|diagonal|加耶夫,洛巴辛,瓦里雅|旧主站在树影一端，新主人携斧在另一端，管家钥匙落在二人之间。
西厢记|elevated|崔莺莺,张生,红娘|小姐处在楼窗较高处，书生在下方，红娘携信穿行二人之间。
日出|triangle|陈白露,潘月亭,黄省三|镜前女子、掌握金钱的人与低头求助者占据三个高度不同的位置。
原野|procession|仇虎,金子,焦母|逃亡者一前一后穿过黑林，拄杖的焦母留在后方的家族阴影里。
恋爱的犀牛|barrier|马路,明明|马路向明明伸手，栏杆与犀牛留在二人之间，使爱意表现为距离。
玻璃动物园|triangle|劳拉,阿曼达,汤姆|劳拉护住玻璃小兽，母亲朝向她，兄长的步子转向门外。
李尔王|surround|李尔,考狄利娅,弄人|破冠老人站在风暴中央，诚实的女儿和弄人在两旁保留照料与讽谏的关系。
奥赛罗|duel|奥赛罗,伊阿古,苔丝狄蒙娜|手帕从旗官一侧进入将领的猜疑，白衣女子被隔在另一空间。
安提戈涅|barrier|安提戈涅,克瑞翁|带土的女子朝坟墓行动，持法令的国王从门口阻止她。
美狄亚|duel|美狄亚,伊阿宋|披衣女子守在家门一侧，与持剑离去的伊阿宋正面对峙。
赵氏孤儿|solitary|程婴|医生弓身护住襁褓，城门与阴影把庇护者及遗孤压在画面中心。
桃花扇|duel|李香君,侯方域|染血的扇子介于恋人之间，楼窗中的爱情被时代和权势拉开。
暗恋桃花源|split|江滨柳|病中寻人的老人位于现实一半，桃花与空置的古装舞台占据另一半。
北京人|exit|愫方,曾文清,曾皓|照料他人的女子带包走向门，文清守着鸟笼，长辈坐在旧家中心。
白毛女|solitary|喜儿|白发女子从山洞阴影中向外伸手，绳索和雪地保留被压迫的痕迹。
欲望号街车|barrier|布兰奇,斯坦利|布兰奇护住柔光，斯坦利从另一侧逼近；窄小公寓使距离无法维持。
三姐妹|tableau|奥尔加,伊里娜,安德烈|人物分处三扇窗，书本、钟与乐器并置，离去愿望没有变成出发。
海达·高布乐|triangle|海达,洛夫伯格,泰斯曼|海达持枪居中，失落的手稿与两位持书男子形成互相牵制的三角。
浮士德|duel|梅菲斯特|诱惑者向一位求知者展开书本，书房与火焰构成交易的两端。
海鸥|triangle|尼娜,特里波列夫,特里戈林|年轻演员、青年作者与成名作家围绕剧本和海鸥形成不对称关系。
万尼亚舅舅|triangle|瓦尼亚舅舅,索尼娅,阿斯特罗夫|举枪的失意者、继续记账的索尼娅与持森林地图的医生处在同一庄园。
伪君子|reveal|答尔丢夫,桃丽娜|伪虔诚者抱书，女仆在门侧直面他，面具提示体面之下的欲望。
吝啬鬼|solitary|阿巴贡|老人收紧身体抱住钱箱，空旷地面与锁住的钱柜放大占有欲。
费加罗的婚礼|procession|费加罗|机敏的仆人携信穿越连通房门，婚戒留在路线中间。
伽利略传|elevated|伽利略|学者抬望远镜面对上方天体，脚边书本使发现与知识传播连在一起。
高加索灰阑记|barrier|沈黛|此项另用原作人物资料，不借用四川好人的角色。
犀牛|surround|贝兰杰,让|仍是人的贝兰杰抵住同伴变形与城市兽群，身体和群体运动相对。
秃头歌女|tableau|消防队长|来访的消防队长站在两组客厅座席之间，断裂对话围着失常时钟回转。
进入黑夜的漫长旅程|split|玛丽·泰隆,埃德蒙·泰隆|母亲与儿子分在长窗明暗两端，酒瓶与时钟使家庭伤痛延续到夜间。
皮格马利翁|duel|伊莉莎|卖花姑娘带花走向语言课堂，阶层门槛不是只换上礼服就能跨过。
威尼斯商人|duel|夏洛克,鲍西娅|债权人手中的秤与法官装束的鲍西娅相对，法庭关系围绕契约展开。
罗密欧与朱丽叶|elevated|朱丽叶,罗密欧|朱丽叶在楼窗高处伸手，罗密欧从较低处回应，建筑距离承担爱情的阻力。
家|exit|觉慧,觉新|弟弟带书走向外面，长兄守在家族秩序内，庭院成为相反选择的分界。
屈原|duel|婵娟|侍女捧杯面向举火的诗人，杯子把忠诚与牺牲连在一起。
关汉卿|duel|朱帘秀|演员持剧本面向写戏者，戏台与书卷提示作品遭禁演的共同处境。
骆驼祥子|procession|祥子,虎妞|车夫迈步拉车，虎妞留在车场钥匙一侧，人物生计和关系绑定于车。
天下第一楼|tableau|修鼎新|账册旁的经营者守着店内秩序，菜盘与来往通路呈现饭庄的多方压力。
狗儿爷涅槃|duel|狗儿爷,祁永年|老农弓身守土，对面人物指向土地的归属，田垄使一生执念可见。
商鞅|solitary|商鞅|改革者举起法令站在城门前，个人与新制度的尺度形成对照。
曹操与杨修|duel|曹操,杨修|持剑的权力者与持书卷的才士相对，军帐中的空隙成为试探。
被缚的普罗米修斯|elevated|普罗米修斯|被锁的人被置于高岩，展开的手臂和向下的链条形成受缚的形体。
阿伽门农|reveal|阿伽门农,克吕泰涅斯特拉,卡珊德拉|归来的统帅进入门，持斧者留在门内，预言者在另一侧示警。
费德尔|triangle|费德尔,希波吕托斯,俄诺涅|王后、青年与乳母形成不能直说的三角，宫门与火焰暗示压抑欲望。
三毛钱歌剧|solitary|麦克希思|衣着体面的强盗持刀站在街头，钱币与绞索相伴而不把他画成贵族英雄。
终局|barrier|汉姆,克洛夫,纳格|坐着的汉姆与离不开的克洛夫相对，垃圾桶和高窗限定家庭的终局空间。
人民公敌|surround|斯多克芒|医生举资料面对公共场所，水源在他和听众的位置之间。
培尔·金特|solitary|索尔维格|等待的女子站在林中屋旁，远山与空路为缺席的人留下位置。
钦差大臣|duel|赫列斯达可夫,市长|冒牌钦差与急于奉承的市长相对，信件与钱币在权力误认中流动。
暴风雨|triangle|普洛斯彼罗,爱丽儿,凯列班|持杖者处高位，精灵与岛民分处两侧，岛上的支配关系通过高差呈现。
理查三世|solitary|理查三世|弯曲的身体护住剑和王冠，城堡阶梯把攫取权力变成向上的动作。
裘力斯·凯撒|duel|布鲁图斯|持匕首的披衣者朝向空王座，公共理想与刺杀行动留在同一个空间。
上海屋檐下|tableau|匡复,杨彩玉,黄家楣|不同处境的人共享狭窄屋檐，书与信件串起失业、旧情和日常生存。
蒋公的面子|triangle|夏教授,时教授|教授隔着宴桌权衡赴宴，空着的主位让缺席的权力仍然在场。
朱莉小姐|barrier|克里斯汀|厨娘留在工作台边，另一对跨越阶级的身影处于厨房门内。
野鸭|reveal|格莱格斯|执意揭露真相者打开阁楼，野鸭处在被保护的生活与暴露之间。
造谣学校|reveal|蒂兹尔|老人从屏风旁出现，屏后空位和窥视方向构成谣言被拆穿的场面。
大胆妈妈|procession|大胆妈妈,卡特琳,埃利夫|母亲拉货车，哑女举鼓，士兵跟在另一方向，生计和战争拉扯一家人。
厄勒克特拉|duel|厄勒克特拉,俄瑞斯忒斯|坚持哀悼的姐姐与归来复仇的弟弟在墓前相对，奠酒器位于两人之间。
谁害怕弗吉尼亚·伍尔夫|duel|玛莎,乔治,霍尼|夫妻隔酒瓶互相攻防，客人退在侧边见证，破杯留在谈话中心。
卡利古拉|solitary|卡利古拉|皇帝持镜面对自己和不可得到的月亮，空王座放大绝对权力的孤立。
误会|barrier|玛尔塔|旅馆经营者守住钥匙与门口，来客的位置留给尚未说出的亲属身份。
女仆|mirror|克莱尔,索朗日|两名女仆面对镜子交换姿态，衣服与杯子介于模仿主人和实际行动之间。
快乐的日子|solitary|温妮|女子被土丘固定仍举包说话，物件虽近、身体却无法离开。
都是我的儿子|triangle|乔·凯勒,凯特·凯勒,安·迪弗|父亲守在院内，母亲等待归子，带信的来客使航空零件的责任进入家庭。
哥本哈根|circle|海森堡,玻尔|两位科学家沿环形空间相向，原子图与书本表现无法单凭公式化解的重访。
沃伊采克|barrier|沃伊采克,玛丽|受役使的士兵与抱婴女子隔着军营的边界，刀置于不对等生活的压力下。
丹东之死|duel|丹东,罗伯斯庇尔|厌倦流血者和举法令的纯洁论者对置，断头台远在背后成为共同后果。
恋马狂|barrier|艾伦,护士|青年与引见来访者的护士分在诊疗边界两侧，马的形象占据他的感知中心。
艺术|triangle|塞尔吉,马克|买画者与反对者指向同一幅白画，第三个观看位置暂留空位，使友情分歧可见。
车站|exit|沉默的人,马主任|沉默的人迈步离开等待队列，另一人仍守着时刻表与站牌。
如梦之梦|circle|如梦之梦的医生|女医生在环形水边倾听，空着的病人位置让生命故事沿圆环展开。
生死场|tableau|金枝,赵三|母亲护着襁褓，农人守着土地，劳作与生育位于同一片冻土上。
送冰的人来了|duel|希基,哈里·霍普|来访推销员向酒吧老板说话，一人站立、一人久坐，酒杯困住所谓明天。
春醒|duet|梅尔希奥,莫里茨|两个少年面对同一册知识，举书与低头的姿态显示理解和困惑的差距。
桥头眺望|barrier|埃迪·卡伯恩,凯瑟琳|码头工人挡在家门前，年轻女子朝外面的桥伸展，控制与离开的方向相反。
"""
play_cast = {a:{"staging":b,"castNames":c.split(","),"rationale":d} for a,b,c,d in (line.split("|") for line in PLAY_CAST.strip().splitlines())}
# Reserve-only work has no verified character card; do not borrow another play's person.
play_cast.pop("高加索灰阑记")

profiles = []
for c in pool:
    name, dim = c["name"], c["dimension"]
    base = {"id":c["id"], "name":name, "dimension":dim, "kind":{"主演":"role", "配角":"role", "剧目":"play", "风格体系":"style", "导演手法":"method", "环境":"space"}[dim], "wash":"#f4eee2", "skin":"fair", "prop":"none", "head":"short", "hair":"short", "face":"quiet", "pose":"stand", "costume":"plain", "cloth":"#526b62", "fig":None, "dress":None}
    if dim in ("主演", "配角"):
        r = role_specs[name].copy()
        base.update(r)
        base["symbols"] = [r.pop("symbol")]
        base["scene"] = "portrait"
        source = role_sources[c["id"]]
        base["sourcePlayLabel"] = source["sourcePlayLabel"]
        base["sourcePlayIds"] = source["sourcePlayIds"]
        work = next((by_id[i]["name"] for i in source["sourcePlayIds"] if i in by_id), None)
        era = play_specs.get(work, {}).get("era", "contemporary")
        if name in MULTI_TRADITION: era = "greek"
        if name in ("福斯塔夫", "安东尼", "伏伦妮娅", "克莉奥佩特拉"): era = "renaissance" if name == "福斯塔夫" else "roman"
        if name == "诸葛亮": era = "china-old"
        if name in ("卡捷琳娜", "卡巴诺娃", "吉洪", "鲍里斯"): era = "russia19"
        if name in ("杜瓦先生", "玛格丽特"): era = "europe19"
        if name in ("黑子", "蜜蜂", "车长"): era = "china-modern"
        if name in GENERIC: era = "timeless"
        base["era"] = era
        base["dress"] = FIG_DRESS[base["fig"]]
        base["hair"] = base["head"]
        base["cloth"] = SPECIAL_COLORS.get(name, PALETTES[base["costume"]])
        base["face"] = SPECIAL_FACES.get(name, "quiet")
        if name == "奥赛罗": base["skin"] = "deep"
        if name == "报讯的孩子": base["kid"] = True
        base["visualCues"] = [ERA_LABELS[era], "人物轮廓、姿态与职业/行动道具按当前角色说明选择", c.get("observe", c["note"])]
        base["review"] = "角色与剧情逐名匹配；服饰为纸片舞台抽象，非历史服装复原"
    elif dim == "剧目":
        s = play_specs[name]
        base.update(era=s["era"], scene=s["scene"], symbols=[s["symbol"]])
        base["visualCues"] = [ERA_LABELS[s["era"]], c.get("titleCue", name), c.get("observe", c["note"])]
        base["review"] = "按剧目冲突、场景与关键物件逐名设计；不是剧作家肖像"
        if name in PLAY_DETAILS:
            scene, symbols, explanation = PLAY_DETAILS[name]
            base.update(scene=scene,symbols=symbols)
            base["visualCues"].append(explanation)
    else:
        spec = (space_specs if dim == "环境" else concept_specs)[name]
        base.update(spec)
        base["era"] = "not-applicable"
        base["visualCues"] = [name, c["note"], "空间或方法示意，不设无关人物身份"]
        base["review"] = "按当前概念定义逐名设计的空间/动作图解"
    base["lead"] = base["symbols"][0] if base["symbols"] else "none"
    base["set"] = base["scene"]
    base["basis"] = c["note"]
    profiles.append(base)

overrides_path = ROOT / "scripts/art-classic-overrides-v39.json"
if overrides_path.exists():
    raw = json.loads(overrides_path.read_text(encoding="utf8"))
    overrides = raw["cards"] if isinstance(raw, dict) else raw
    by_profile_id = {p["id"]: p for p in profiles}
    for row in overrides:
        target = by_profile_id[row["id"]]
        assert target["name"] == row["name"], row
        for k, v in row.items():
            if k not in ("id", "name", "reason", "rationale", "basis", "evidence"):
                if k == "symbol": target["symbols"] = [v]
                else: target[k] = v
        target["hair"] = target["head"]
        target["dress"] = FIG_DRESS[target["fig"]]
        target["lead"] = target["symbols"][0]
        target["review"] += "；经典人物造型复核"
        if row.get("reason"): target["visualCues"].append(row["reason"])

# Character-specific choices are authored against the current role and its source.
role_v50 = {}
for group in ("leads", "support"):
    source = ROOT / f"scripts/art-role-{group}-v50.json"
    if source.exists():
        role_v50.update(json.loads(source.read_text(encoding="utf8")))
for target in profiles:
    if target["id"] not in role_v50:
        continue
    patch = role_v50[target["id"]]
    assert target["kind"] == "role"
    target.update(patch)
    target["hair"] = target["head"]
    target["dress"] = FIG_DRESS[target["fig"]]
    target["lead"] = target["symbols"][0] if target["symbols"] else target["prop"]
    target["visualCues"].extend([patch["designIntent"], patch["distinguishFrom"]])
    target["review"] += "；v50逐角色轮廓、姿态与标志物精修"

def stage_person(name, fig, head, prop, pose="hold", costume="plain", cloth=None):
    return {"name":name,"fig":fig,"dress":FIG_DRESS[fig],"head":head,"hair":head,"prop":prop,"pose":pose,"costume":costume,"cloth":cloth or PALETTES[costume],"skin":"fair","face":"quiet"}

virtual_cast = {
    "浮士德": [stage_person("浮士德", "changshan", "white", "book", "reach", "plain")],
    "屈原": [stage_person("屈原", "changshan", "topknot", "torch", "raise", "mourning")],
    "关汉卿": [stage_person("关汉卿（剧中人物）", "changshan", "cap", "scroll", "hold", "plain")],
    "皮格马利翁": [stage_person("希金斯", "xizhuang", "sidepart", "book", "guard", "formal")],
    "朱莉小姐": [stage_person("朱莉", "changqun", "bun", "cup", "reach", "formal"),stage_person("让", "zhifu", "short", "none", "guard", "work")],
    "野鸭": [stage_person("海德维希", "tongqun", "braid", "bird", "hold", "plain")],
    "三姐妹": [stage_person("玛莎（三姐妹）", "changqun", "bun", "none", "fold", "mourning")],
    "艺术": [stage_person("伊凡", "xizhuang", "short", "none", "fold", "plain")],
    "如梦之梦": [stage_person("五号病人", "zuozi", "short", "none", "bow", "plain", "#d0c6b5")],
    "四川好人": [stage_person("隋达（沈黛的化身）", "xizhuang", "cap", "coin", "guard", "formal")],
    "罗密欧与朱丽叶": [],
}
by_profile_name = {p["name"]:p for p in profiles if p["dimension"] in ("主演","配角")}
for p in profiles:
    if p["kind"] != "play" or p["name"] not in play_cast:
        continue
    spec = play_cast[p["name"]]
    names = spec["castNames"]
    if p["name"] == "三姐妹": names = ["奥尔加", "伊里娜"]
    p["cast"] = [{"roleId":by_profile_name[n]["id"],"name":n} for n in names]
    p["cast"].extend(virtual_cast.get(p["name"],[]))
    p["staging"] = spec["staging"]
    p["visualCues"].append(spec["rationale"])
    p["castBasis"] = "原作人物仅用于这幅剧目图的场面，不新增卡片，不产生原作羁绊。"

play_override_path=ROOT / "scripts/art-play-cast-overrides-v39.json"
if play_override_path.exists():
    raw=json.loads(play_override_path.read_text(encoding="utf8"))
    for row in raw["plays"]:
        target=next(p for p in profiles if p["id"]==row["id"])
        assert target["name"]==row["name"]
        target["cast"]=row["cast"]
        target["staging"]=row["staging"]
        target["visualCues"].append(row["rationale"])
        target["castBasis"]="依当前原作剧情设计的剧中人；舞台图记，不新增卡片。"

warren=next(p for p in profiles if p["id"]=="yplay-mrswarren")
warren.update(staging="duel", cast=[stage_person("华伦夫人","changqun","widehat","coin","hold","formal","#785064"),stage_person("薇薇","tongqun","bun","book","guard","plain","#526b62")])
warren["visualCues"].append("母亲的金钱与女儿的书本处在客厅两侧，母亲伸向女儿、女儿守住自己的位置，使经济独立与家庭情感的冲突可见。")
warren["castBasis"]="当前剧情明示母女关系；服装为十九世纪欧洲舞台抽象，不新增卡片。"

FIG_LABELS=dict(zip(FIG_DRESS, "立袍 长裙 短打 甲胄 斗篷 西装 劳作服 单肩披衣 破衣 大衣 礼服 制服 长衫 旗袍 马褂 工装 白衣 头巾袍 筒裙 坐姿 佝偻".split()))
POSE_LABELS={"stand":"站定", "step":"迈步", "reach":"向对象伸手", "raise":"抬手申述", "guard":"阻挡或守住", "hold":"捧持", "fold":"收臂克制", "bow":"低头弓身", "offer":"前伸递出", "clutch":"收紧护住", "refuse":"抬手拒绝", "listen":"侧耳倾听", "point":"指向对象", "conceal":"收手掩藏", "open":"展开双臂", "stride":"跨步向前"}
COSTUME_LABELS={"plain":"朴素衣饰", "royal":"冠服礼制", "formal":"正式领口", "work":"劳动围裙或工作层", "worn":"磨损与补丁", "mourning":"丧服暗边", "layered":"披层", "puritan":"清教徒白方领"}
for p in profiles:
    if p["fig"]:
        p["visualCues"].insert(0,f"大轮廓：{FIG_LABELS[p['fig']]}；动作：{POSE_LABELS[p['pose']]}；衣饰：{COSTUME_LABELS[p['costume']]}。")
    else:
        p["visualCues"].insert(0,"主意象与空间关系："+p["scene"]+"；物件："+"、".join(p["symbols"])+"。这些构图字段由逐名语义表明确选择。")
    shape_fields=("fig","head","face","prop","pose","costume","propMode","headTilt","lean","portraitLayout")
    cast_shapes=[]
    by_profile_id={item["id"]:item for item in profiles}
    for member in p.get("cast",[]):
        appearance={**by_profile_id.get(member.get("roleId"),{}),**member}
        cast_shapes.append([appearance.get(k) for k in shape_fields])
    p["semanticDistinctKey"]=json.dumps([*[p.get(k) for k in shape_fields],p["scene"],p["symbols"],p.get("staging"),cast_shapes],ensure_ascii=False,separators=(",",":"))

assert len(profiles) == len({p["id"] for p in profiles}) == 777
doc = {"version":39, "count":777, "scope":"全部 777 张显式语义分类；公开常驻范围另由 ACTIVE_CARDS_V39.json 控制。逐名依据当前卡片介绍设计，不等同全部原作的服饰考据。", "method":"没有随机 hash、按稀有度换衣或轮转塞道具。角色采用 21 类纸片轮廓、明确姿态及相关物件；剧目为场景意象，不误作作者肖像。", "reviewBoundary":"本轮完成逐名语义配置与规则校验。服饰、肤色与道具位置均为游戏舞台抽象，存在跨版本演出差异；未经逐剧舞台史、服装史深入考证，不称全部视觉已获学术核验。", "cards":profiles}
(ROOT / "docs/ART_PROFILES_V39.json").write_text(json.dumps(doc,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
# Runtime contains only rendering and provenance labels, while review prose stays in docs.
runtime_keys = ("id","name","dimension","kind","wash","skin","prop","head","hair","face","pose","costume","cloth","fig","dress","symbols","scene","era","lead","set","kid","cast","staging","propMode","headTilt","lean","portraitLayout")
runtime = {p["id"]:{k:p[k] for k in runtime_keys if k in p} for p in profiles}
(ROOT / "scripts/art-profiles-v39.data.js").write_text("/* Generated by build-art-profiles-v39.py; do not hand edit. */\nvar ART_PROFILE_DATA_V39="+json.dumps(runtime,ensure_ascii=False,separators=(",",":"))+";\n",encoding="utf8")
print("Built",len(profiles),"art profiles and",len(role_sources),"role sources")
print("Figures",dict(Counter(p["fig"] for p in profiles if p["fig"])))
print("Symbols", " ".join(sorted({s for p in profiles for s in p["symbols"]})))
