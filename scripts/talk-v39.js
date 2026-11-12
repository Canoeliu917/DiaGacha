function copySentenceV39(text) {
  const value = String(text || '').trim();
  return value && !/[。！？][”’」』"]?$/.test(value) ? `${value.replace(/[；，]+$/, '')}。` : value;
}

function stageSentenceV39(text) {
  return copySentenceV39(String(text || '').replace(/^排演时[，,：:]\s*/, ''));
}

function talkCardsV39(cards) {
  const byDimension = Object.fromEntries(cards.map(card => [card.dimension, card]));
  return {
    play: byDimension['剧目'], style: byDimension['风格体系'], method: byDimension['导演手法'],
    lead: byDimension['主演'], support: byDimension['配角'], place: byDimension['环境'],
  };
}

// These are rehearsal conflicts, not extra plot summaries or claimed original relationships.
// The explicit IDs keep a shared word such as "钱" or "罪" from choosing the story.
const sceneArcsV40 = {
  'play-cherry': {
    title: '饭还没吃完，园子已经易主', premise: '庄园出售与旧日生活迟迟不肯谢幕的矛盾', prop: '庄园钥匙',
    opening: '{a}请{b}为一场庄园交接作见证，却把要谈的出售说成一顿普通的送别饭。{b}把暂时代管的钥匙放在两人之间，谁都没有先说出“搬走”。',
    exchange: '{a}要求先承认交接，再慢慢商量谁能留下；{b}原以为自己只是在接受招待，如今连一次点头都可能被算作同意。',
    reveal: '交接的时刻到了。{b}伸手要拿回钥匙，{a}却把它压在掌下：“饭可以吃完，钥匙不能再带走。”刚才的盛情款待，原来已经悄悄划出了主人与客人的位置。',
    ending: '{b}把那句尚未说完的感谢咽回去，改问：“钥匙给了你，留下的人怎么办？”{a}还想继续招待，两人之间却再也坐不回刚才的距离。交接可以完成，送别终于无法伪装成团聚。',
    teaser: '{a}请{b}见证庄园交接，一场盛情款待却把点头变成了让权；等到钥匙易手，受邀的人才发现，自己连能否留下也必须重新请求。',
  },
  'play-oedipus': {
    title: '最后一个问题落回自己身上', premise: '追查真相反而暴露追问者自身的结构', prop: '记有证词的纸',
    opening: '{a}召来{b}，要求把一段旧事说清，声称只要找到最后的证人，这里就能恢复平静。',
    exchange: '{b}不肯回答那个预先写好答案的问题，反问{a}当时站在哪里；{a}把记有证词的纸推回去，坚持先查别人。',
    reveal: '两人重走那天的路线，{a}为了纠正{b}的一处细节，脱口说出只有在场者才知道的话。追问者突然成了必须解释的人。',
    ending: '{b}没有替他宣布结论，只把空着的位置让出来。{a}终于坐下，把刚才逼别人回答的问题，完整地问了自己一遍。',
    teaser: '{a}逼{b}补全一份证词，纠正细节时却暴露了自己的位置；原本准备给别人的审问，终于轮到自己回答。',
  },
  'play-hamlet': {
    title: '看戏的人先站了起来', premise: '借表演试探隐情、又无法轻易把反应当作证据的困境', prop: '写着戏词的纸',
    opening: '{a}邀请{b}看一段短戏，说只想请对方纠正几个细节，却把最刺痛人的一刻留到最后。',
    exchange: '{b}察觉自己被盯着，要求{a}也入戏；试探者只好亲手演出自己原本藏在台词后的指控。',
    reveal: '短戏还没结束，{b}先打断了它。{a}立刻把中断当成答案，{b}却要求重演，指出他删掉了最关键的一句话。',
    ending: '两人交换观看与被观看的位置，同一段戏再开始。{a}这次没有立刻下判断，台上的停顿第一次比那句指控更难承受。',
    teaser: '{a}排了一段戏试探{b}，对方却要他也入戏；一次意外停演把试探翻了面，谁在隐藏，谁在逼人认罪，突然都不再清楚。',
  },
  'play-macbeth': {
    title: '坐上那个位置以后', premise: '夺取权位之后，恐惧反过来支配行动的进程', prop: '象征席位的名牌',
    opening: '{a}盯住那个还空着的位置，请{b}替自己确认：只要先坐下，其他人就会承认。',
    exchange: '{b}要求{a}说明原来坐在那里的人为何不再回来；{a}绕开这句问话，忙着把名牌摆正。',
    reveal: '位置终于归了{a}，他却不再容许{b}靠近。每一次脚步声都使他转身，刚才为他作证的人也成了需要防备的人。',
    ending: '{b}停止保证安全，把那张名牌留在原处。{a}有了想要的位置，却必须不停站起来检查身后，整场在他无法安坐的动作里结束。',
    teaser: '{a}请{b}帮助确认一个席位，坐稳后却开始防备这位见证者；权位到手，安静先被赶了出去。',
  },
  'play-godot': {
    title: '说好离开，脚却没有动', premise: '等待一个始终未到的人、离开与留下互相抵消的处境', prop: '预留位置的标记',
    opening: '{a}替一个还没到的人留出位置，{b}问还要等多久；{a}提议先做一件小事，做完再决定。',
    exchange: '小事做完，{b}准备离开，{a}却想起他们还没确认对方会从哪边来。两人交换位置，把刚才的话又问一遍。',
    reveal: '终于有了一个像是到来的动静，两人同时迎上去，发现只是自己先前留下的标记。等待没有获得答案，反倒添了一件必须收回的小东西。',
    ending: '{b}说这次真的走了，{a}也答应。两人整理好东西，仍替那个未到的人留着位置；最后一个动作，是把已经拿起的标记重新放下。',
    teaser: '{a}和{b}约定做完最后一件小事就走，新的动静却让他们重新站回原位；所等的人没有出现，离开的决定也没有向前一步。',
  },
  'play-doll': {
    title: '这一次，先听我说完', premise: '亲密关系中的照料如何遮住不平等，以及离开前的自我确认', prop: '属于自己的行李',
    opening: '{a}把行李放在旁边，要求{b}先听完一次谈话；{b}以为只要恢复往常的称呼，就能把事情安抚过去。',
    exchange: '{a}问两人是否曾平等地做过一次决定，{b}却列出替对方安排过的每一件事。越细心的列举，越让那件行李显得必要。',
    reveal: '{b}忽然答应一切可以照旧，{a}反而停止收拾：问题已经不只是这一次争执，而是谁有权规定什么叫“照旧”。',
    ending: '{a}没有再解释自己的去向，只拿回行李。{b}第一次必须在无人接话的情况下说完挽留，留下的空位成为这场谈话真正的回答。',
    teaser: '{a}带着行李要求与{b}平等地谈一次，对方越努力证明照料周全，越显出从未让出决定权；一次挽留最终变成了离开的理由。',
  },
  'play-teahouse': {
    title: '下一位客人还会来吗', premise: '日常生计在时代更替中一步步失去容身之处的处境', prop: '留给客人的杯子',
    opening: '{a}请{b}坐下，照旧摆好杯子，想让今天看起来和从前一样；{b}带来的却是又一条不能照旧的消息。',
    exchange: '{a}把规矩改了一次又一次，只求有人留下；{b}每次准备落座，又被新的安排叫起来。',
    reveal: '两人终于商量妥当，{a}回头准备招呼下一位客人，才发现已经没有人等候。忙了一整场的让步，并没有换来生意继续。',
    ending: '{b}替{a}摆完最后一只杯子，却没有坐下。{a}仍按从前的声音招呼了一声，等不到回答后，才慢慢把那只杯子收回去。',
    teaser: '{a}不断修改规矩，只想让{b}安心坐下；等所有条件终于谈妥，他们却发现，等候下一杯茶的人已经散了。',
  },
  'play-thunder': {
    title: '认出旧物的人没有离开', premise: '被隐瞒的旧事穿透家庭秩序、使眼前关系崩解的冲突', prop: '一件旧家具上的饰物',
    opening: '{a}按惯例接待{b}，却发现来人先认出了那件旧物，叫出一个早已不许再提的名字。',
    exchange: '{a}试图把谈话改成一次普通的问候，{b}却把旧物转回从前的方向。眼前的整齐摆设，突然显出了被抹去的生活。',
    reveal: '{a}终于要求{b}不要再说，正好让对方确认：那些细节一直有人记得，所谓忘记只是另一种不准开口。',
    ending: '{b}不再解释那件旧物，径直站到原先被赶开的地方。{a}想恢复原来的秩序，必须先从这个仍活着的人面前经过。',
    teaser: '{b}认出了一件旧物，{a}极力把这次重逢说成初见；越急着结束谈话，越证明那段被遮住的过去从未真正过去。',
  },
  'play-peony': {
    title: '纸上只差一个名字', premise: '以承认为代价换取安全、拒绝让虚假证词代替自身的抉择', prop: '等候签名的纸',
    opening: '{a}把一张尚未签名的纸交给{b}，说只差最后一个名字，双方就可以平安离开。',
    exchange: '{b}要求当面读出纸上的话，{a}每读一句都把声音放低：写下的内容，远比刚才口头答应的多。',
    reveal: '{b}提出亲自带走这张纸，{a}立刻伸手阻止。原来对方需要的不只是一次承认，还要把这个名字交给所有人观看。',
    ending: '{b}拿回纸，让自己的名字停在尚未落笔的地方。{a}必须重新回答，究竟是在放人离开，还是借一个人的名字证明所有人都该服从。',
    teaser: '{a}说签一个名字就能平安离开，{b}却要求把那张纸带走；一次伸手阻拦，暴露了这场交易真正需要的是谁的服从。',
  },
  'play-salesman': {
    title: '你等的那声称赞没有来', premise: '成功幻梦与亲人真实需要无法对齐的矛盾', prop: '记录成绩的本子',
    opening: '{a}把一页成绩摊给{b}，等着一句“你做得很好”；{b}却来谈今天已经无法继续的生活。',
    exchange: '{a}不断把话题带回过去的机会，{b}每说一个眼前的困难，就被更辉煌的旧事盖过去。',
    reveal: '{b}合上本子，承认自己达不到那些期待，也不想再靠它们证明两人的关系。{a}最想听的成功消息，变成了一次拒绝继续表演成功。',
    ending: '{a}重新打开本子，却没有找到能接下这句话的一页。{b}停在近处，等他不用成绩作开头，再叫自己一次。',
    teaser: '{a}等{b}带来成功的消息，对方却承认再也演不下去；那本用来证明价值的成绩册，突然找不到可以翻开的下一页。',
  },
  'play-goodperson': {
    title: '答应帮忙的人换了一副面孔', premise: '维持善意与保护自身生计彼此冲突的困境', prop: '只剩一份的物资',
    opening: '{a}答应把最后一份物资让给{b}，说完才发现，自己明天也要靠它生活。',
    exchange: '{b}拿出刚才得到的承诺，{a}换了站姿和口气，声称现在必须按另一套规矩办事。',
    reveal: '{b}没有接受这个突如其来的新身份，而是准确复述了刚才那句温柔的话。同一个身体，无法同时躲开求助与追责。',
    ending: '{a}卸掉第二副口气，把仅剩的东西放在两人中间。{b}第一次看见答应帮助的人也无处可退，争执从谁更善良，变成这份生计究竟怎样维持。',
    teaser: '{a}先答应帮助{b}，又换一副面孔收回承诺；对方认出了同一个人，逼他同时面对自己的善意和明天的生计。',
  },
  'play-lear': {
    title: '分完以后，谁肯让一个位置', premise: '把爱当作可计量的表白、交出权力后才看清依靠的悲剧', prop: '标出各人份额的图',
    opening: '{a}请{b}先说一句足够动听的话，再把图上的一块划给对方；被分配的仿佛不是地方，而是爱。',
    exchange: '{b}不肯再增加表白，反问分完之后{a}准备待在哪里。{a}以为这个问题根本不需要商量。',
    reveal: '最后一块地方也被划出去了，{a}准备坐回自己的位置，却发现图上没有替自己保留任何一处。刚才的承诺，不能自动变成眼前的接纳。',
    ending: '{a}第一次放下那张图，向{b}请求一个具体的位置。{b}是否侧身相让，比开场时所有响亮的表白都更难回答。',
    teaser: '{a}用动听的表白决定如何分配，分完才发现自己没有留下的位置；最后必须向{b}请求的，是一句誓言无法保证的接纳。',
  },
  'play-othello': {
    title: '你只看见了最后那次交接', premise: '物件被误读为证据、猜疑夺走直接询问机会的过程', prop: '经过几双手的手帕',
    opening: '{a}拿出一方手帕，要求{b}解释它为什么会到自己手里，却不肯先交代是谁送来的。',
    exchange: '{b}想把手帕经过的路线走一遍，{a}每次都在最后一次交接处打断，认定结尾已经足够。',
    reveal: '两人终于倒着重走，手帕在一次无人留意的停顿中被移了位置。{a}看到的确实是一件真东西，给它安上的故事却并不完整。',
    ending: '{b}把手帕留在原地，要求{a}先问人，再看物。{a}伸出的手停住了：物证还在，凭它夺走对方说话机会的把握已经不在。',
    teaser: '{a}拿一方手帕追问{b}，却只肯相信最后一次交接；当两人倒着重走路线，真正改变局面的，是那个先前没有被看见的停顿。',
  },
  'play-antigone': {
    title: '禁令挡不住这一捧土', premise: '公共禁令与安葬亲人的义务无法两全的冲突', prop: '一捧准备覆下的土',
    opening: '{a}捧着土，请{b}让出一条路；{b}要求先读完挡在两人之间的禁令。',
    exchange: '{a}听完仍不放下手里的土，{b}便把“只做这一件事”的请求逐字改成违令的证明。',
    reveal: '{b}以为让请求者低头就能结束争执，{a}却借这个低身动作把土覆了下去。命令还没撤回，那个不准发生的行动已经完成。',
    ending: '{a}直起身，不再请求通行；{b}必须决定是否亲手抹去眼前的土。争论从抽象的服从，变成一个人愿不愿意做出下一步。',
    teaser: '{a}请求带着一捧土通过，{b}坚持先读禁令；一次被要求的低头，却让禁止的行动当场完成。',
  },
  'play-xixiang': {
    title: '递出去的话被退了回来', premise: '私人的爱情愿望必须穿过家长规矩与传话障碍的处境', prop: '不能当众读出的信',
    opening: '{a}请{b}转交一封信，只许送到，不许打开；{b}先问，若被拦下，该替谁承担这一趟。',
    exchange: '{a}急着说明信有多重要，{b}却一次次把信递回，让写信的人练习亲口说出那句话。',
    reveal: '交接终于成功，{b}却从另一边带回同一封信：收信的人要听见自己的名字被当面叫出，不肯再只靠传话决定未来。',
    ending: '{a}收起信，跟着{b}走向刚才不敢靠近的位置。最后一句没有写在纸上，两个人都必须留在现场听完。',
    teaser: '{a}请{b}转交一封不能公开的信，对方却把它一次次退回；当私语终于必须当面说出，传话的人也不再只是替别人多走一趟。',
  },
  'play-visit': {
    title: '大家都说没有答应', premise: '集体道德在利益诱惑中逐渐改变措辞的进程', prop: '写有许诺的纸',
    opening: '{a}提出一项条件，请{b}替所有人传话；{b}当场拒绝，却把那份许诺留了下来。',
    exchange: '{b}逐渐开始安排许诺兑现以后的日子，仍坚持没有答应。{a}不再催促，只请对方说清这些安排由谁承担代价。',
    reveal: '{b}发现每个人都在等别人先说出同意，自己先前的拒绝已经被当成一段可以略过的开场白。',
    ending: '{a}把条件原样再念一遍，{b}这次不能用大家的沉默代替自己的回答。那些已经开始享用的好处，留在场上等候一个明确的名字。',
    teaser: '{b}拒绝了{a}的条件，却开始安排条件兑现以后的生活；等到需要有人承担代价，所有人都说自己从未答应。',
  },
  'play-glass': {
    title: '来客离开以后的小东西', premise: '一次短暂靠近无法兑现全部期待、留下的人收拾破损的过程', prop: '一只易碎的小兽',
    opening: '{a}把平日不肯示人的小兽拿给{b}看，第一次容许对方靠近那个只属于自己的角落。',
    exchange: '{b}邀请{a}走出来试一次新的步子，{a}暂时忘了守住那件小东西，两人的距离终于缩短。',
    reveal: '小兽在靠近中受损，{b}又不得不说明自己另有去处。{a}原以为发生的是一个开始，听见的却是来客准备离开的理由。',
    ending: '{a}没有要求{b}留下，独自替小兽找了一个仍能站稳的位置。{b}走远后，这个微小的整理动作继续，把短暂的相遇留在了物件上。',
    teaser: '{a}把一件珍藏交给{b}，短暂的靠近却同时带来破损与离别；来客走后，留下的人必须亲手替它找一个能站稳的位置。',
  },
  'xplay-seagull': {
    title: '散场以后还在等回应的人', premise: '艺术上的渴望与爱情里的期待互相错认的困局', prop: '写着演出顺序的纸',
    opening: '{a}为{b}准备了一段新戏，口头上请对方评价作品，真正等的却是一句愿意留下。',
    exchange: '{b}认真谈起另一种向往，{a}把每句意见都听成对自己的拒绝，于是不断重开那段已经演完的戏。',
    reveal: '{b}终于说明，喜欢作品并不等于答应陪伴。{a}停在幕布前，发现自己一直在用一个问题索取另一个问题的答案。',
    ending: '{b}离开观看的位置，{a}仍把幕布开着，却不再重复邀请。那段无人接话的结尾，第一次成为他必须自己完成的演出。',
    teaser: '{a}请{b}来看一段新戏，却把所有评论都听成是否愿意留下；当作品和爱情终于被分开回答，开着的幕布只剩一个人收场。',
  },
  'play-rhino': {
    title: '你没有答应，我却听成了愿意', premise: '执着的爱情无法替另一个人作出选择的冲突', prop: '准备送出的礼物',
    opening: '{a}请{b}收下一件礼物，声称不需要回答，却始终挡在对方离开的方向。',
    exchange: '{b}拒绝把收下礼物当成承诺，{a}便不断解释自己付出了多少；每增加一项付出，两人之间就少一点能够退开的距离。',
    reveal: '{b}把礼物放下，当面重复一遍自己的选择。{a}终于无法把沉默或客气再解释成期待中的同意。',
    ending: '{a}必须让开那一步，才能知道{b}是否还会回来。两人没有拥抱收场，留下的通路比任何表白都更具体。',
    teaser: '{a}说礼物不需要回答，却迟迟不让{b}离开；对方把礼物放下以后，爱意终于必须面对一个不能代替别人作出的选择。',
  },
  'play-medea': {
    title: '行李已经放到门边', premise: '背叛与驱逐使亲密关系转化为报复冲动的冲突', prop: '已经收好的行李',
    opening: '{a}把行李交给{b}，请求再留一会儿；{b}以为只要允许这点时间，就已经尽到最后的体面。',
    exchange: '{a}逐件取出两人共同生活过的东西，{b}只肯讨论什么时候离开。一个人在清算被背弃的承诺，另一个人只想完成送行。',
    reveal: '{a}突然把行李全部打开，拒绝让过去被一次整齐的搬走遮住。{b}第一次意识到，给予期限并不能决定对方如何使用它。',
    ending: '{b}停下催促，{a}却仍不能把手中的旧物放回去。排演在报复尚未实施的一刻收住，把下一步会伤及谁留成两人必须直视的选择。',
    teaser: '{a}请求{b}容许最后一点停留，得到的时间却被用来清算共同生活；整齐的送行被打断，体面的措辞再也藏不住驱逐。',
  },
};

function sceneTextV40(text, context) {
  return text.replace(/\{(a|b|prop)\}/g, (_, key) => context[key]);
}

function sceneArcV40(context) {
  const { play, a, b } = context;
  const arc = sceneArcsV40[play.id];
  if (arc) return arc;
  return {
    title: '离场以前，把这句话说完', premise: '人物在行动中暴露彼此期待的排演线索', prop: '留在两人之间的一件物品',
    opening: `这一场从《${play.name}》的动作起步：“${stageSentenceV39(play.stage || play.hook || '让一次准备好的见面被迟来的回答打断。')}”${a}先将这一步做给${b}看，期待对方接下去，${b}却停在原处。`,
    exchange: `${a}要求把方才未完成的行动继续，${b}却提出交换位置，让发出要求的人先承受一次同样的等待。`,
    reveal: `两人照原来的顺序重来，位置却已经互换。${a}刚才觉得轻易就能做到的事，轮到自己才迟迟做不下去；${b}终于得到一次不被打断的回应。`,
    ending: `两人回到开场的位置，这次${a}等${b}先动。排练在那个原先被略过的停顿处结束，让《${play.name}》这条观察落在两人的距离里：“${copySentenceV39(play.observe || play.why || '同一个动作换了回应，就会显出不同的关系。')}”`,
    teaser: `${a}要${b}接住《${play.name}》里的一次行动，对方却要求先交换位置重来；当要求落到自己身上，原本笃定的人终于停了下来。`,
  };
}

function actorEntryV40(card, other, support) {
  const name = card.name;
  const entries = {
    'xrole-pozzo': `${name}先占住方便指挥的位置，要求${other}等自己坐好再谈；谁可以开口，也仿佛必须由他决定。`,
    'role2-duncan': `${name}把周到的欢迎当作善意，毫无戒备地接受${other}的安排，先答应相信对方。`,
    'role-oedipus': `${name}把询问的位置逐步移近${other}，每得到一个回答就追问下一句，不肯把任何停顿当作结束。`,
    'role-nora': `${name}先顺着${other}习惯的口气应答，随后把自己的位置移到与对方同一高度，要求这次把话听完。`,
    'role-hamlet': `${name}不急着向${other}说明意图，先把对方刚说过的话重复一遍，看哪一个字会让回应停住。`,
    'role-macbeth': `${name}让${other}先靠近，自己却反复看向身后；越想显得镇定，越不肯交出决定下一步的权力。`,
    'role-ladym': `${name}替${other}整理好外表，低声催对方把已经决定的事做完，不许动作泄露迟疑。`,
    'role-anti': `${name}听完${other}的阻拦，仍把身体转向自己要完成的事，让请求逐渐变成已经开始的行动。`,
    'role-lear': `${name}等着${other}先表明态度，把一个简单的停顿也听成了对自己的冷落。`,
    'role-iago': `${name}把一句话说到一半便停下，等${other}主动追问，再把猜测伪装成不得不说的提醒。`,
    'role-wang': `${name}先替${other}安排位置，尽力让双方都不难堪，自己的话却总被新的招呼打断。`,
    'role-vladimir': `${name}向${other}核对刚才说过的约定，怕遗漏一个细节，反而把准备开始的动作又拖住了。`,
    'role-gogo': `${name}暂时顾不上${other}提出的大问题，先停下照料疲惫的身体，让催促的人也不得不停一会儿。`,
    'role2-creon': `${name}听完${other}的请求，再逐字重申自己的要求；他把让步听成了所有规矩都将失效。`,
    'role2-banquo': `${name}记住${other}话里的承诺，却不急着附和，把一个尚未得到回答的问题留在两人之间。`,
    'role2-kristine-linde': `${name}没有替${other}继续遮掩，先把那件迟早要说清的事放回两人眼前。`,
  };
  if (entries[card.id]) return entries[card.id];
  const cue = stageSentenceV39(card.stage || card.hook || '先让对方把话说完，再决定是否靠近。');
  return support
    ? `${name}没有顺着${other}的节拍回答，而是做出自己的动作：“${cue}”${other}只好停下，等这个动作完成才有机会接话。`
    : `${name}带着自己的行动习惯入场：“${cue}”这一步直接占去了${other}原本可以从容回应的时间。`;
}

function scenePlaceV40(context) {
  const { place, a, b } = context;
  if (place.id === 'place-v21-diningcar') return {
    open: `把相遇放在行进中的餐车：${a}与${b}隔着一张窄餐桌，杯子随着车轮轻响，窗外景物不停后退，这顿饭却迟迟吃不完。`,
    turn: '到站广播响起，邻桌开始收拾行李。这场谈话再拖下去，也不能让列车替他们停留。',
    end: '列车再次开动，餐桌还在原处，刚才坐在桌边的人却已经不能按原来的关系继续用餐。',
  };
  if (place.id === 'place-road') return {
    open: `在乡间小路上，${a}与${b}隔着一段可以随时走开的距离，却总在准备错身时停住。`,
    turn: '远处传来脚步声，两人同时转向来路，又必须回过头面对尚未说完的话。',
    end: '路仍然通向远处，刚才谁也不肯让出的那一步，最后留给观众看清。',
  };
  if (place.id === 'place-parlor') return {
    open: `在娜拉的客厅里，${a}与${b}先照着熟悉的礼貌落座，门口就在视线以内，却不是谁都能轻易走过去。`,
    turn: '门边传来动静。原本像私下商量的谈话，忽然有了随时会被打断的期限。',
    end: '客厅的摆设没有变化，两人谁能留下、谁能走向门口，却要重新决定。',
  };
  const cue = stageSentenceV39(place.stage || place.hook || '让想离开的人必须从对方眼前经过。');
  return {
    open: `这次相遇发生在${place.name}，空间按这条动作线索组织：“${cue}”${a}先占住能发起谈话的位置，${b}要回应，就必须改变双方原有的距离。`,
    turn: `刚才那次空间动作又发生了。${b}这次不再为${a}先让开，两人必须在${place.name}里重新安排谁先通过、谁留下回答。`,
    end: `收场时回到${place.name}开场的距离，观众能看见同样的位置已经换了含义。`,
  };
}

function sceneMethodV40(context) {
  const { method, a, b, prop } = context;
  const effects = {
    'ydir-handkerchief': `小道具把争执变成可见的交接：${a}每说一次客气话，就把${prop}挪近自己；${b}伸手要接时，${a}却先把杯子递过去。等对方腾出手，关键物件已经到了另一边。`,
    'dir-wall': `这一段按第四堵墙处理：${a}始终只向${b}解释，谁也不借观众的目光求助。观众看得见两人都避开的${prop}，他们却继续假装它不重要。`,
    'dir-alien': `间离术落在一次具体中断上：${b}刚要答应，演员便暂时退出角色，复述${a}刚才省掉的条件；重新入戏后，那句答应已无法照原来的口气说出。`,
    'dir-freeze': `${b}将要接过${prop}的一刻，全场定格。只有${a}把刚才的请求再说一次；同一句话面对伸出却还没接住的手，显出了命令的意味。`,
    'dir-flashback': `倒叙先演两人已经无法照原来的方式说话的一刻，再退回见面以前。观众先看见关系变化，随后沿着${prop}的摆放与两人的停顿，追问${a}与${b}究竟在哪一步失去了原来的默契。`,
    'dir-body': `形体无言取消了这一轮解释。${a}靠近${prop}，${b}便改变站位；让出一步并不等于答应，下一次伸手必须重新取得允许。`,
    'dir-forum': `${b}快要作出答复时，论坛停演把动作停住，请观众提出另一种回应，再由演员重走同一段。${a}必须接住改变后的回答，不能照原来的结尾强行演下去。`,
    'dir-multi': `一人分饰让同一位演员依次说出${a}的要求与${b}的回应。每次换到另一个位置，上一句留下的压力都不能重置，直到演员自己也无法把两边同时安抚好。`,
  };
  if (effects[method.id]) return effects[method.id];
  return `两人的拉扯在“${method.name}”这一步被放大：“${stageSentenceV39(method.stage || method.hook || '把即将完成的动作停住，等一次回应再继续。')}”这次处理紧接着${a}的要求发生，${b}便把原本将要说出的答应收住，逼对方看清这一步造成的后果。`;
}

function sceneStyleV40(context) {
  const { style, place, method, support, a, b, prop } = context;
  if (style.id === 'ystyle-street') {
    const publicScene = place.id === 'place-v21-diningcar'
      ? `将餐车的一段过道向公共观看区敞开，${support ? '由演员扮作旅客' : '独演者换位模拟旅客的声音'}，以一次“请替我看住这件东西”的拦路请求聚拢视线。窄餐桌成了临时的街头戏台，来去的人都能看清交接`
      : `把${place.name}的一段通道向公共观看区敞开，以一次“请替我看住这件东西”的拦路请求让经过的人停下；场内的相遇就此变成能够被围观的公共事件`;
    const boundary = method.id === 'dir-wall'
      ? '围观发生在戏外；进入这段对话后仍守住第四堵墙，演员不向观众索取回答，见证由观看完成'
      : `让${support ? '扮作围观者的演员' : '换到围观位置的独演者'}复述：“刚才${prop}还在那一边。”${a}再也不能只对${b}低声解释，必须当着这些见证者把条件说完整`;
    return `街头剧在这里有一个明确的转换：${publicScene}。${boundary}。`;
  }
  const forms = {
    'style-absurd': `用荒诞派的重复把转折留下来：${a}与${b}再说一次开场的客气话，物件与站位却已改变；原本能维持谈话的句子，这次只暴露了两人再也接不上的关系。`,
    'style-epic': `史诗剧场让这次变化公开可读：演员把${prop}先前的位置指出来，再回到此刻的站位。观众可以沿着两次交接判断局面如何形成，而不只等待谁先落泪。`,
    'style-real': `现实主义把后果留在日常小事里：${b}仍要把刚才被打断的动作做完，${a}也无法用一段漂亮解释让双方立刻和好。沉默持续到其中一人真正改变动作。`,
    'style-stan': `按斯坦尼体系，让${a}仍想得到原先要的答复，${b}却带着新发现重新听每一句话。相同的行动目标碰上变化后的对手，逼出演员新的节奏与选择。`,
    'style-classic': `古典主义把这次翻转留在同一场相遇里：不另开一段往事替人解释，${a}与${b}都必须当场回应已经出现的后果，直到原来的要求得到一个新的回答。`,
    'style-physical': `身体剧场让${a}重做开场的靠近，${b}却用刚才被迫采取的姿态回应。两副身体交换了承受的位置，观众先看见谁在退让，再听见下一句话。`,
  };
  if (forms[style.id]) return forms[style.id];
  return `转折按“${style.name}”的方式重新落地：“${stageSentenceV39(style.stage || style.hook || '让同一个动作前后重复两次，第二次改变对方的回应。')}”把这一处理放回刚才的交锋，${a}重说原来的要求，${b}却不再给出原来的回应；变化从演法进入了两人的关系。`;
}

function sceneContextV40(cards) {
  const context = talkCardsV39(cards);
  context.a = context.lead.name;
  context.b = context.support ? context.support.name : '另一种声音';
  context.arc = sceneArcV40(context);
  context.prop = context.arc.prop;
  return context;
}

function dramaticTitleV40(cards) {
  const context = sceneContextV40(cards);
  const title = `${context.place.name}｜${context.arc.title}`;
  return title.length <= 35 ? title : context.arc.title;
}

function talkSourcesV40(cards) {
  const { lead, support } = talkCardsV39(cards);
  return [lead, support].filter(Boolean).map(card => card.sourcePlayLabel
    ? `${card.name}：${card.sourcePlayLabel}` : card.name).join('；');
}

function shortScene(cards) {
  const context = sceneContextV40(cards);
  const { play, place, style, method, arc, support, a } = context;
  const solo = support ? '' : `本局由${a}独演，对面的声音由同一演员换位试说。`;
  const form = style.id === 'ystyle-street' && method.id === 'ydir-handkerchief'
    ? '小道具的交接被街头剧放到众目睽睽之下，原本私下的条件，必须对每一个看见的人说清。'
    : `以${method.name}让这次变化发生，再用${style.name}重演开场的动作，让改变后的关系显出来。`;
  return `本局创作／排演设想：借《${play.name}》在${place.name}另写一场相遇。${solo}${sceneTextV40(arc.teaser, context)}${form}`;
}

function soloBlockingV40(text) {
  return text.replaceAll('两人同时迎上去', '演员先后在两个位置迎上去')
    .replaceAll('两人同时转向来路', '演员先从一个位置望向来路，再换到另一个位置重做')
    .replaceAll('两人交换位置', '演员换到对面的站位')
    .replaceAll('两人整理好东西', '演员依次整理两个位置的东西')
    .replaceAll('两副身体交换了承受的位置', '同一副身体轮流承担双方的位置');
}

function nn(cards) {
  const context = sceneContextV40(cards);
  const { play, lead, support, a, b, arc } = context;
  const space = scenePlaceV40(context);
  const solo = support ? '' : `这副旧五卡没有配角：全场由${a}独演，“另一种声音”是同一演员换位试说的回答，不另添人物；双方动作按先后顺序在两个位置完成。`;
  const counterpart = support
    ? actorEntryV40(support, a, true)
    : `${a}走到对面，替尚未得到的回应试说一句，随即回到原位；这场对话能否继续，必须由他自己承担。`;
  return [
    `本局创作／排演设想：借《${play.name}》中${arc.premise}另写一场戏，以下动作与相遇均为本局改编。${solo}${space.open}${sceneTextV40(arc.opening, context)}${actorEntryV40(lead, b, false)}`,
    `${counterpart}${sceneTextV40(arc.exchange, context)}${sceneMethodV40(context)}`,
    `${space.turn}${sceneTextV40(arc.reveal, context)}${sceneStyleV40(context)}`,
    `${sceneTextV40(arc.ending, context)}${space.end}`,
  ].map(text => support ? text : soloBlockingV40(text));
}

function fiveTalk(cards) { return nn(cards); }

if (typeof module !== 'undefined' && module.exports) module.exports = {
  copySentenceV39, stageSentenceV39, shortScene, nn, fiveTalk, dramaticTitleV40, talkSourcesV40,
};
