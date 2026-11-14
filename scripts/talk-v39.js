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

// Fictional story seeds inspired by the selected play, never claimed as original plot.
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
    ending: '{b}没有替{a}宣布结论，只把空着的位置让出来。{a}终于坐下，把刚才逼别人回答的问题，完整地问了自己一遍。',
    teaser: '{a}逼{b}补全一份证词，纠正细节时却暴露了自己的位置；原本准备给别人的审问，终于轮到自己回答。',
  },
  'play-hamlet': {
    title: '看戏的人先站了起来', premise: '借表演试探隐情、又无法轻易把反应当作证据的困境', prop: '写着戏词的纸',
    opening: '{a}邀请{b}看一段短戏，说只想请对方纠正几个细节，却把最刺痛人的一刻留到最后。',
    exchange: '{b}察觉自己被盯着，要求{a}也入戏；试探者只好亲手演出自己原本藏在台词后的指控。',
    reveal: '短戏还没结束，{b}先打断了它。{a}立刻把中断当成答案，{b}却要求重演，指出{a}删掉了最关键的一句话。',
    ending: '{a}读完被删掉的那句话，发现它会使自己的指控失去把握。{b}带走了那份戏词，要求下次见面时，先拿出证据。',
    teaser: '{a}排了一段戏试探{b}，对方却要{a}也入戏；一次意外停演把试探翻了面，谁在隐藏，谁在逼人认罪，突然都不再清楚。',
  },
  'play-macbeth': {
    title: '坐上那个位置以后', premise: '夺取权位之后，恐惧反过来支配行动的进程', prop: '象征席位的名牌',
    opening: '{a}盯住那个还空着的位置，请{b}替自己确认：只要先坐下，其他人就会承认。',
    exchange: '{b}要求{a}说明原来坐在那里的人为何不再回来；{a}绕开这句问话，忙着把名牌摆正。',
    reveal: '位置终于归了{a}，却不再容许{b}靠近。每一次脚步声都使{a}转身，刚才为{a}作证的人也成了需要防备的人。',
    ending: '{b}停止保证安全，把那张名牌留在原处。{a}有了想要的位置，却必须不停站起来检查身后，直到天亮，仍没能安心坐下来。',
    teaser: '{a}请{b}帮助确认一个席位，坐稳后却开始防备这位见证者；权位到手，安静先被赶了出去。',
  },
  'play-godot': {
    title: '说好离开，脚却没有动', premise: '等待一个始终未到的人、离开与留下互相抵消的处境', prop: '预留位置的标记',
    opening: '{a}替一个还没到的人留出位置，{b}问还要等多久；{a}提议先做一件小事，做完再决定。',
    exchange: '小事做完，{b}准备离开，{a}却想起他们还没确认对方会从哪边来。他们把东西拿起又放下，始终没能约定一个离开的时刻。',
    reveal: '终于有了一个像是到来的动静，两人同时转向那阵动静，认出只是自己先前留下的标记。等待没有获得答案，反倒添了一件必须收回的小东西。',
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
    ending: '{a}重新打开本子，却没有找到能接下这句话的一页。{b}停在近处，等{a}不用成绩作开头，再叫自己一次。',
    teaser: '{a}等{b}带来成功的消息，对方却承认再也演不下去；那本用来证明价值的成绩册，突然找不到可以翻开的下一页。',
  },
  'play-goodperson': {
    title: '答应帮忙的人换了一副面孔', premise: '维持善意与保护自身生计彼此冲突的困境', prop: '只剩一份的物资',
    opening: '{a}答应把最后一份物资让给{b}，说完才发现，自己明天也要靠它生活。',
    exchange: '{b}拿出刚才得到的承诺，{a}换了站姿和口气，声称现在必须按另一套规矩办事。',
    reveal: '{b}没有接受这个突如其来的新身份，而是准确复述了刚才那句温柔的话。同一个身体，无法同时躲开求助与追责。',
    ending: '{a}卸掉第二副口气，把仅剩的东西放在两人中间。{b}第一次看见答应帮助的人也无处可退，争执从谁更善良，变成这份生计究竟怎样维持。',
    teaser: '{a}先答应帮助{b}，又换一副面孔收回承诺；对方认出了同一个人，逼{a}同时面对自己的善意和明天的生计。',
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
    exchange: '{a}急着说明信有多重要，{b}却一次次把信递回，坚持要写信的人亲口说明，这封信会使收信的人失去什么。',
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
    ending: '{b}离开观看的位置，{a}仍把幕布开着，却不再重复邀请。那段无人接话的结尾，第一次成为{a}必须自己完成的演出。',
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
    ending: '{b}停下催促，{a}却仍不能把手中的旧物放回去。报复的念头仍在，但那些共同用过的东西使这次送行再也无法被说成两不相欠。',
    teaser: '{a}请求{b}容许最后一点停留，得到的时间却被用来清算共同生活；整齐的送行被打断，体面的措辞再也藏不住驱逐。',
  },
};

// These are new fictional encounters. Groups select a conflict, not a substitute synopsis.
const storySeedsV40={
  money:{title:'这笔钱究竟替谁说话',prop:'一本收支账簿',
    opening:'{a}带来一笔钱，想{project}，却要求不留下姓名。{b}拿出收支账簿，请{a}先写清来路，再决定这笔钱能不能收。',
    exchange:'{a}把数目加大，以为只是价钱没谈拢。{b}却翻出{debt}：这次准备花的钱，也是别人等着过日子的报酬。',
    reveal:'{a}承认自己也曾靠这笔钱过日子。{b}翻出亲自签收的旧账，才发现自己也曾从中受益，不能把责任全推给出资的人。',
    ending:'两人没有把账簿烧掉，也没有替彼此写下清白的结论。他们先把欠款列出来，再讨论剩下的钱能做什么；原先准备花钱办成的计划，被推迟到债还清以后。',
    teaser:'{a}想匿名出资，{b}却追问钱的来处。一本账簿把慷慨与欠债翻到同一页上，两人都无法只做审判别人的清白人。'},
  secret:{title:'少掉的那一页是谁拿走的',prop:'缺了一页的记录',
    opening:'{a}带来缺了一页的{record}，请{b}查明{incident}的经过。{b}认得纸上的字，却声称不记得缺掉的那一页。',
    exchange:'{a}逐项核对日期，{b}记得签名用的墨水，却略过{incident}的那一天。若不找回记录，就得由当日值守的人赔偿。',
    reveal:'{b}终于拿出藏起的那一页。它证明{a}没有做过被指控的事，也证明{a}当时知道真相，却选择了沉默。',
    ending:'{a}把散页装回记录，没有撕掉对自己不利的部分。{b}陪{a}把完整记录交出去，两人都不知道这能否换来原谅，至少下一个读到它的人不必再替他们补写谎话。',
    teaser:'{a}请{b}用一份记录洗清嫌疑，缺失的那页却握在对方手中。真相能解除一项指控，也会揭开一次更难解释的沉默。'},
  choice:{title:'替别人作出的决定被退回来了',prop:'已经写好的约定',
    opening:'{a}拿着一份写好的约定来见{b}，已经替对方安排{plan}，只等签名。{b}发现上面没有一项经过自己同意。',
    exchange:'{a}把每一处安排解释成关心，{b}却问，如果自己拒绝，两人的关系还能不能继续。这个问题使原本顺利的谈话停了下来。',
    reveal:'{b}划掉了约定中最优厚的条件，宁愿承担损失，也不愿让别人替自己决定。{a}第一次发现，付出的东西越多，并不意味着得到的答应越可靠。',
    ending:'{a}把那份约定留给{b}修改，自己带走未被接受的礼物。第二天收到的回信很短，只有一项新条件：下一次，请先问我想要什么。',
    teaser:'{a}为{b}写好了一份看似周全的未来。对方宁愿失去好处也不肯签字，让一次关心显出了支配的代价。'},
  shelter:{title:'留下一个人，要付出多少',prop:'仅剩的一份储备',
    opening:'{a}守着仅剩的一壶水和一包干粮，打算独自撑过今晚。{b}请求分走一半，说明自己已经没有别处可去。',
    exchange:'{a}先问对方能拿什么交换，{b}翻遍随身的东西，只有一个暂时无法兑现的承诺。拒绝很容易，说完以后继续睡觉却并不容易。',
    reveal:'{b}先把行李垫到通路旁，守住最容易被人靠近的位置，让{a}可以睡一会儿。{a}才看见，自己的一壶水能分成两份，独自守夜却不能同时休息。',
    ending:'他们没有许下永远互相照顾的话，只把这一夜要用的东西重新分了份。天亮时储备比从前更少，{a}却第一次不必独自确认周围是否安全。',
    teaser:'{b}向{a}求一夜容身，拿不出可供交换的东西。危险逼近后，谁在施舍、谁在保护谁，变得不再那么容易分清。'},
  identity:{title:'借来的名字还回去以后',prop:'写着另一个名字的名牌',
    opening:'{a}借用一个更容易获得信任的名字来见{b}。事情起初十分顺利，直到{b}问起一段只有名字真正的主人才能回答的往事。',
    exchange:'{a}编出的细节越多，{b}的疑问也越具体。{a}开始明白，自己借来的不只是名声，还有一份从未经历过、却必须负责的过去。',
    reveal:'{b}说出了真正的名字，承认早就识破了伪装，只想知道{a}会在什么时候停止。最难堪的不是谎话被揭穿，而是那份自己以为赢来的尊重，从头到尾都建立在对方的等待上。',
    ending:'{a}收起写着假名的名牌，重新介绍了自己。{b}没有保证仍给{a}同样的机会，却肯听{a}说完一个没有借用任何人经历的理由。',
    teaser:'{a}靠一个借来的名字赢得{b}的信任，却被一段从未经历过的往事困住。收起名牌以后，{a}必须用真正的自己再争取一次机会。'},
  waiting:{title:'等来的答复和想象的不一样',prop:'一封迟迟未拆的信',
    opening:'{a}和{b}守着一封刚送到的信，谁都知道它可能结束漫长的等待，却都请对方先拆。',
    exchange:'{a}已经为好消息安排好了今后的生活，{b}却偷偷准备了离开的东西。两人一边说无论结果怎样都能接受，一边只谈自己愿意听见的答案。',
    reveal:'信里没有承诺，只解释了为何一直没有答复。{a}埋怨来信的人太迟，{b}却承认自己早已猜到，只是不愿先打破共同维持的希望。',
    ending:'他们把信读完，没有再替寄信的人寻找新的借口。{b}拿起行李，{a}留下整理那些为未来准备的东西；这一次，离开和留下终于成了各自的选择。',
    teaser:'{a}与{b}终于等到一封信，却迟迟不肯拆开。真正到来的并非好消息或坏消息，而是他们再也不能借等待推迟的选择。'},
};
const storyGroupsV40={
  money:'play-sunrise play-baimao xplay-miser xplay-merchant xplay-camel xplay-lou xplay-liqiu yplay-threepenny yplay-mrswarren yplay-promotion yplay-wotu play-v21-majorbarbara play-v21-americandream',
  secret:'play-doue play-yuanye play-orphan xplay-galileo xplay-cat xplay-longday yplay-agamemnon yplay-elms yplay-enemy yplay-ghosts yplay-inspector yplay-fifteen yplay-crossroads yplay-drunken play-v21-malentendu play-v21-twelveangry play-v21-betrayal v23-play-allmysons v23-play-copenhagen v23-play-equus v23-play-viewbridge',
  choice:'play-palace play-beijing play-street play-butterfly xplay-figaro xplay-salome xplay-pygmalion xplay-dream xplay-romeo xplay-jia xplay-quyuan xplay-guantheplay yplay-bacchae yplay-lysistrata yplay-phedre yplay-cid yplay-intrigue yplay-tell yplay-jiang yplay-pipa yplay-redlantern play-v21-justes v23-play-springawake',
  shelter:'play-peach xplay-dragon xplay-sang xplay-doggy xplay-shangyang xplay-caoyang yplay-prometheus yplay-trojan yplay-birds yplay-lower yplay-joan yplay-caiwenji yplay-eaves yplay-chenyi yplay-farewell yplay-locket play-v21-unburied v23-play-woyzeck v23-play-danton v23-play-livefield',
  identity:'play-secret xplay-faust xplay-tartuffe xplay-caucasian xplay-rhino xplay-twelfth yplay-servant yplay-peer yplay-tempest yplay-richard yplay-caesar yplay-whitesnake play-v21-caligula play-v21-maids play-v21-balcony play-v21-sixcharacters play-v21-henryiv v23-play-art',
  waiting:'play-sisters xplay-vanya xplay-bald xplay-chairs yplay-endgame yplay-krapp play-v21-noexit play-v21-happydays play-v21-heartbreak play-v21-zoostory v23-play-busstop v23-play-dreamlike v23-play-iceman',
};

function sceneTextV40(text,context){return text.replace(/\{(a|b|prop|place|project|debt|record|incident|plan)\}/g,(_,key)=>key==='place'?context.place.name:context[key]);}
function sceneArcV40(context){
  if(sceneArcsV40[context.play.id])return sceneArcsV40[context.play.id];
  const kind=Object.keys(storyGroupsV40).find(key=>storyGroupsV40[key].split(' ').includes(context.play.id));
  return storySeedsV40[kind||'secret'];
}
function sceneContextV40(cards){
  const context=talkCardsV39(cards);
  context.a=context.lead.name;
  context.b=context.support?.name;
  context.arc=sceneArcV40(context);context.prop=context.arc.prop.replace(/^(?:一本|一封|一份|一件|一方)/,'');
  Object.assign(context,{project:'修好一间漏雨的住处',debt:'一笔拖欠的修屋工钱',record:'值夜记录',incident:'库房的粮食被搬走',plan:'住处与明天的工作'},storyDetailsV54[context.play.id]);
  if(context.arc===storySeedsV40.secret)context.prop=context.record;
  if(context.arc===storySeedsV40.identity)context.prop='名牌';
  if(context.play.id==='play-doll')context.prop=context.a+'的行李';
  if(context.arc===storySeedsV40.waiting)context.prop='信';
  if(context.arc===storySeedsV40.choice)context.prop='约定';
  if(context.arc===storySeedsV40.shelter)context.prop='水壶和干粮包';
  if(!context.support&&context.play.id==='yplay-mrswarren')context.prop=context.lead.id==='v23-role-serge'?'白画':'准备展出的画';
  const key=context.play.id==='yplay-mrswarren'?'warren':sceneArcsV40[context.play.id]?context.play.id:Object.keys(storySeedsV40).find(key=>storySeedsV40[key]===context.arc);
  const state=storyStatesV54[key];
  context.state={...state,key,object:context.prop,holderName:state.holder==='b'?context.b:context.a,requesterName:state.holder==='b'?context.a:context.b};
  return context;
}
// Only the play arc resolves ownership, departure or acceptance. The other cards
// change how this still-open question is examined, not the answer in advance.
const storyStatesV54={
  'play-cherry':{holder:'b',question:'庄园交出以后，留下的人由谁安置'},
  'play-oedipus':{holder:'a',question:'旧案最后一段经过能否核对清楚'},
  'play-hamlet':{holder:'a',question:'这场试探究竟能不能作为指控的证据'},
  'play-macbeth':{holder:'a',question:'得到这个席位是否真的能使自己安心'},
  'play-godot':{holder:'a',question:'没有得到回信以前，要不要继续留下位置'},
  'play-doll':{holder:'a',question:'留下是否还意味着必须接受对方的一切安排'},
  'play-teahouse':{holder:'a',question:'还要让出多少，才能让今天的生意继续'},
  'play-thunder':{holder:'a',question:'认得旧物的人是否有权留下被遮住的过去'},
  'play-peony':{holder:'a',question:'签名是否会被用来证明自己从未答应的事'},
  'play-salesman':{holder:'a',question:'不成功以后，关系是否还能继续'},
  'play-goodperson':{holder:'a',question:'答应救急以后，自己明天靠什么生活'},
  'play-lear':{holder:'a',question:'分完地方以后，自己还能留在哪里'},
  'play-othello':{holder:'a',question:'最后拿到手帕的人是否就必须为全部经过负责'},
  'play-antigone':{holder:'a',question:'一纸禁令能否取消亲自告别的责任'},
  'play-xixiang':{holder:'a',question:'传话的人是否也必须代替写信的人承担后果'},
  'play-visit':{holder:'b',question:'开始享用好处以后，还能不能说自己从未答应'},
  'play-glass':{holder:'a',question:'一次靠近是否等于答应长久留下'},
  'xplay-seagull':{holder:'a',question:'喜欢作品是否等于愿意陪伴写出它的人'},
  'play-rhino':{holder:'a',question:'收下一件礼物是否就必须答应留下'},
  'play-medea':{holder:'b',question:'被允许留下的时间，能否由留下的人亲自使用'},
  money:{holder:'b',question:'继续投入新的计划能否抵消尚未付清的欠款'},
  secret:{holder:'a',question:'缺掉的那页能否同时保留有利和不利的事实'},
  choice:{holder:'a',question:'拒绝别人安排的未来以后，关系还能否继续'},
  shelter:{holder:'a',question:'有限的水与干粮，能不能换一种分担今夜的办法'},
  identity:{holder:'a',question:'不借用别人的名字，还能否得到同样的机会'},
  waiting:{holder:'a',question:'来信没有兑现期待时，要不要停止共同的等待'},
  warren:{holder:'b',question:'是否该用欠给劳动者的工钱支付这场画展'},
};
const storyDetailsV54={
  'play-sunrise':{project:'给失业者开一间夜间食堂',debt:'旅馆拖欠的清洁工钱'},
  'play-baimao':{project:'替一户人家修好过冬的屋顶',debt:'被扣去抵租的长工工钱'},
  'xplay-miser':{project:'修好一栋年久失修的房子',debt:'修缮房屋时压下的木工工钱'},
  'xplay-merchant':{project:'替货船添一套救生设备',debt:'尚未发给搬运者的货款'},
  'xplay-camel':{project:'给车夫置办一辆能独自谋生的新车',debt:'被车行扣下的修车工钱'},
  'xplay-lou':{project:'重新开起一间小饭馆',debt:'上次歇业时拖欠的伙计工钱'},
  'play-v21-majorbarbara':{project:'让救济食堂多开一晚',debt:'供应商拖欠的搬运工钱'},
  'play-v21-americandream':{project:'装出一个体面的新家',debt:'被装修账单藏起来的木工工钱'},
  'yplay-threepenny':{project:'替无处安身的人租一间房',debt:'此前收走却未归还的摊位押金'},
  'v23-play-equus':{record:'病房值班册',incident:'药柜被人在夜里打开'},
  'xplay-longday':{record:'家庭开支簿',incident:'保管的医药费被取走'},
  'play-yuanye':{record:'田地交接册',incident:'地界标记被人挪走'},
  'yplay-inspector':{record:'公款出入簿',incident:'修桥的钱被挪去招待来客'},
  'yplay-fifteen':{record:'来信登记簿',incident:'一封私人来信被抄出散发'},
  'xplay-galileo':{record:'观测记录',incident:'一页新的测量结果被删去'},
  'v23-play-allmysons':{record:'零件检验册',incident:'不合格的零件被装箱送走'},
  'v23-play-copenhagen':{record:'会面笔记',incident:'一段不能公开的谈话被传出去'},
  'v23-play-viewbridge':{record:'夜间出入簿',incident:'一位暂住者的行踪被人告发'},
  'v23-play-springawake':{plan:'离开学校后进厂工作的去路'},
  'play-beijing':{plan:'留在老屋照顾家人的日子'},
  'xplay-jia':{plan:'一桩从未征求意见的婚事'},
  'xplay-pygmalion':{plan:'搬进新住处并改换谋生方式'},
  'xplay-figaro':{plan:'婚后住在哪间房以及为谁做事'},
};
// These conditions belong to the fictional encounter, not to the original play.
// Each space supplies a physical constraint and its consequence during the meeting.
const storySpacesV54={
  'place-road':['暮色已经压低，岔路旁没有可以避雨的屋檐。','雨水浸湿了路边的草，双方把东西移到高处；继续等下去，就得承受更冷的一夜。'],
  'place-tea':['茶桌挤在过道旁，来客都能听见这场交谈。','伙计来收桌上的空杯；再不压低声音，邻桌就要听见争执的来由。'],
  'place-elsinore':['走廊每隔一会儿便有巡夜者经过，脚步会在石墙间回响。','巡夜的灯转过墙角，双方把东西收近，不能再借低声说话掩盖动作。'],
  'place-zhou':['窗闩扣着，唯一通往外面的路穿过家人常用的厅堂。','门外传来钥匙碰响的声音，再拖下去，这件事就不再只由双方知道。'],
  'place-dunsinane':['城门已经落闩，守夜的灯照着唯一的出口。','城外一阵号声逼近；一味防备彼此，并不能替双方守住那扇门。'],
  'place-parlor':['外衣与钥匙都挂在门旁，谁要离开都得经过对方面前。','门外传来钥匙碰响的声音，原本能被算作闲谈的话，现在必须说清。'],
  'place-exec':['警戒线拦在路中，能留下解释的时间只剩一小会儿。','守卫开始收紧警戒线，未说清的理由不能指望以后再补。'],
  'place-sichuan':['领粮的队伍绕过街角，每个名字只能领一份口粮。','发粮的人开始核对名册，空口答应的照顾也得有一份粮食作数。'],
  'place-cherry':['树下堆着准备搬走的箱子，通向屋内的小路只剩窄窄一条。','搬箱的人折返回来，留在树下的东西也要登记归属。'],
  'place-gullen':['赊账的店铺正逐家关门，剩下的灯照着无人结清的账板。','最后一间店开始落锁；离开这条街以前，双方得说清谁来承担眼前的事。'],
  'place-zoo':['铁栏把通路分成两边，隔着栏杆只能递过很小的东西。','清场的铃响了，双方必须绕到同一个出口才能继续交谈。'],
  'place-forest':['树影遮住来路，脚印走出几步便辨认不清。','风吹灭了小灯，谁要独自离开，都得承担认错道路的危险。'],
  'place-heath':['无遮无挡的风卷着尘土，手一松，东西就可能被吹走。','雨点落下来，双方先护住手边的东西，才有机会继续争执。'],
  'place-meixiang':['楼下仍有歌声，楼上的门却掩不住太响的争执。','楼下的歌声停了，屋里的话突然传得很远；要继续就得承担被听见的后果。'],
  'place-baihua':['宴席已经摆好，空着的席位都有写好名字的座签。','侍者来问多出的席位留给谁，双方不能继续把沉默算作对方同意。'],
  'place-stella':['薄帘只隔开视线，另一边的人仍能听见每一句话。','帘后响起椅子挪动的声音，想私下说完的话已经没有那么隐秘。'],
  'place-blackbox':['黑墙吸住了光，唯一亮着的出口必须共用。','照明只剩出口上方的一盏；双方都不能把暗处的一个动作当作可靠答复。'],
  'place-proscenium':['厚帘把房间截成两半，从一侧递出的东西要绕到开口才能接住。','帘子开始合拢，双方得先选同一侧，才不会把话隔断。'],
  'place-island':['涨潮正在淹没浅滩，唯一的小船还系在岸边。','潮水漫过系船的石头，独自上船就意味着把另一方留在岛上。'],
  'place-zeng':['旧家具把通路挤窄，外人来访必须经过一家人共用的门。','门外传来钥匙碰响的声音，双方不能再靠拖延把答复留到下一次。'],
  'xplace-dock':['装货的人正在收跳板，最后一条船还没解缆。','船工开始松开缆绳，留在岸上和一同上船不能再同时打算。'],
  'xplace-attic':['低矮的斜顶逼人弯腰，出口是一架一次只能过一人的梯子。','梯子被楼下的人扶住；谁先下去，谁就得把未处理的东西留给另一方。'],
  'xplace-balcony':['窄门通回屋里，栏杆外没有另一条退路。','屋内有人准备关门，继续站在栏杆旁已经不能回避眼前的答复。'],
  'xplace-market':['摊位收拢以后，双方之间只剩一条被货筐堵住的窄路。','摊主来搬货筐，原本藏在摊位后的交接露在了路人眼前。'],
  'xplace-factory':['下班铃刚响，出门的人都要在门房登记带走的东西。','门房翻开登记簿；双方得先说清归属，才能把东西带出去。'],
  'xplace-ancestral':['长凳按辈分摆着，靠门的地方才有不必让人代答的位置。','掌管钥匙的人来收凳子，双方只好离开原来的席次，把要求直接交给对方。'],
  'xplace-grave':['墓碑上的名字已经被雨打湿，铁门只留着一条能过人的缝。','守墓人提着锁链走来，双方得在门落锁前决定把什么带走、把什么留下。'],
  'xplace-shrine':['供桌前留着一排空碗，东西一旦放上去，就会被来祈愿的人看见。','有人来添灯油；刚才想藏起来的交接，现在不能再装作没有发生。'],
  'xplace-carriage':['过道被行李堵住，一方起身，另一方就得让出位置。','下一站的报站声响起，双方必须在车门打开前决定是否继续同行。'],
  'xplace-rooftop':['通往楼下的门会自行扣上，门边压着一块松动的砖。','风把门推回来，双方先护住门缝，才保住一起下楼的退路。'],
  'xplace-kitchen':['炉火还没熄，锅里只剩够今晚分用的一点热汤。','锅盖被蒸汽顶响，双方必须先关小火，才不至于连晚饭也烧干。'],
  'xplace-convent':['晚钟以后侧门就要关闭，出入必须留下名字。','晚钟响起，门簿也被送来；匿名离开的打算已经行不通。'],
  'xplace-snowfield':['雪把旧脚印渐渐盖住，能辨认的只有一串并行的足迹。','风卷着新雪扑来；双方若分头走，就会失去互相辨认的位置。'],
  'xplace-mine':['巷道里只能并肩放两盏灯，通风口传来的敲击会盖住说话声。','一盏灯开始变暗，双方得留出一盏照明，不能各顾各地走开。'],
  'yplace-crossroad':['两条路朝相反方向延伸，背起行李以后就很难继续交谈。','路口的人流把双方挤开；要把话说完，至少得有一方停下脚步。'],
  'yplace-globe':['环形走廊通向同一处出口，低声说的话也会沿木栏传开。','楼上的人探身望下来，双方只能把原本私下的条件摆到明处。'],
  'yplace-huafang':['船沿被灯笼照亮，岸上的人却看不清帘内正在发生什么。','船身一晃，双方先护住手里的东西；想藏在帘后的动作反而显了出来。'],
  'yplace-well':['取水的绳子只剩一根，井沿一次只容得下一个人站稳。','水桶卡在半途，必须有人扶住绳子，另一个人才腾得出手处理交接。'],
  'yplace-gongtang':['案前的记录簿摊开着，递上去的东西必须写明由谁经手。','记录者把笔递来；一旦留下名字，双方就不能把今天的承诺说成随口一提。'],
  'yplace-jindian':['台阶把来客与高处的座位分开，站在下面的人够不到递来的东西。','执事开始收起台阶旁的踏凳，要完成交接，就得有一方先走下自己的位置。'],
  'yplace-zhongjun':['帐外正在点名，交给门边的物件都会被带去清点。','传令者来收行装，双方必须说明哪些东西可以带走、哪些还没有谈妥。'],
  'yplace-shikumen':['门洞通着几户人家，谁在入口停久了都会挡住别人回家。','邻居提着灯回来，双方只好让开门口，不能再靠挡路逼对方留下。'],
  'yplace-chengmen':['门洞正在缩小，守门者等着最后一批行人通过。','沉重的门轴响起来，双方必须决定是一起出去，还是留下继续说清。'],
  'yplace-fachang':['围绳把能停留的位置划得很窄，每次伸手都会被看见。','执勤者抬起围绳催人退后，双方再也不能用挪开位置代替回答。'],
  'yplace-cafe':['桌上只有一张结账单，靠窗的位置马上要交给下一位客人。','店员来收账单，双方得把尚未谈妥的东西一起收好，不能只顾自己起身。'],
  'yplace-deck':['海风把脚下吹得不稳，船舷边没有地方藏住交接。','浪打上来，双方得先抓住同一段栏杆，才能腾手护住东西。'],
  'yplace-cliff':['落脚处只够错身，退得太急就会碰到松动的碎石。','一块碎石滚下去，双方都停住了；眼前的距离不能再靠逼近来缩短。'],
  'yplace-altar':['石台上只能放下一件东西，手伸进去就会遮住另一方的视线。','灯油将尽，双方把东西移到石台前沿，谁也不能背着对方完成交接。'],
  'yplace-dungeon':['小窗只能递过一只手，铁门则要等外面的人来开。','钥匙在锁孔里转动，双方得趁门打开时把还没说明的要求说清。'],
  'yplace-stable':['马匹被声响惊动，挡在门边的草料随时可能被踢散。','马蹄敲响木栏，双方先移开草料，才给彼此留出一条稳妥的通路。'],
  'yplace-ballroom':['音乐让低声的话听不清，停步的人又会挡住转圈的舞伴。','乐声停了，刚才以为能被音乐掩过去的那句话，清清楚楚留在了众人耳边。'],
  'yplace-office':['离开的人要归还钥匙，桌上的交接簿还空着最后一行。','值班人来锁柜子，双方必须在归还钥匙前决定把什么记进交接簿。'],
  'yplace-workshop':['机器一开，身旁的话就听不见；停机的空当只够核对几句话。','下一班机器启动，双方改把约定写下来，不能再凭一句没听清的答应继续。'],
  'place-v21-bordercheckpoint':['通行名单只登记已经确认的名字，行李要逐件查验。','检查员翻到最后一页，双方得说明这件东西属于谁，不能代替对方作答。'],
  'place-v21-willroom':['桌上摆着等待签收的副本，每个到场的人都得确认读过什么。','保管人来收原件，双方若不当场写下异议，沉默就会被记成已经看过。'],
  'place-v21-publicbath':['衣物都锁在门口，手里只留着一枚领取衣服的号码牌。','热水停了，取衣的队伍渐渐排起；双方得带上各自的号码牌，不能让未谈妥的事耽搁到衣物被收走。'],
  'place-v21-funeralhome':['告别的时段快结束了，门边的登记册上还空着一个名字。','工作人员来收花，双方得决定有没有一句话必须现在留下。'],
  'place-v21-lostproperty':['架上的东西都贴着号码，领走以前必须说明能辨认它的细节。','保管员拿来签领单，双方要先核对归属，不能只凭谁先伸手决定。'],
  'place-v21-photostudio':['待洗的照片夹在绳上，背面都记着拍摄日期。','一张照片从夹子里滑落，背面的日期被水渍洇开；双方先将手边的东西挪离水迹，才继续核对还未说清的条件。'],
  'place-v21-diningcar':['列车还没到站，{a}在餐车里等到了{b}。窄桌放不下太多东西，见面也不能无限拖延。','到站广播响起，邻桌的人开始收拾行李，双方必须在列车停下之前把事情说清。'],
  'place-v21-archive':['查阅过的材料要按页归还，缺一页就不能签字离开。','管理员来清点页码，双方必须说明自己手里的东西，不能把缺口留给下一位查阅者。'],
  'place-v22-gallery':['旁听的人不能随意插话，桌前的记录却会公开保留。','主持人准备结束记录，双方只剩最后一次机会，把自己的异议写进去。'],
  'place-v22-radiobooth':['话筒旁的红灯还没亮，玻璃外的人只能看见动作。','红灯忽然亮起，双方先把话筒推远，才发现刚才的私语也可能被传出去。'],
  'place-v22-cage':['吊笼一次只能升降一趟，装进去的东西必须和人一同走。','信号灯亮了，双方得在铁门闭合前决定，谁和这份东西一起留下。'],
  'place-v22-embassyhall':['避难的人挤在长凳上，登记处只有刚腾出的一席位置。','新一批避难者走进来，双方若要保留那个位置，就必须说明准备怎样照顾留下的人。'],
  'place-v22-observatory':['圆顶缓缓转动，窄梯是上下楼唯一的通道。','圆顶的缝隙移走了月光，双方打开手灯，才不至于把对方伸出的手看成阻拦。'],
};
function storyPlaceV40(context){
  const {place,a,b}=context;
  const [opening,turn]=storySpacesV54[place.id]||['门边只留下一处可以放东西的位置，双方必须共用。','门边的灯暗下来，双方把东西放到仍能看清的地方，继续核对尚未说清的要求。'];
  const open=place.id==='place-v21-diningcar'?sceneTextV40(opening,context):`${a}与${b}在${place.name}相遇。${opening}`;
  return {open,turn:sceneTextV40(turn,context)};
}

// Each beat changes an action or a piece of information in this fictional encounter.
const methodBeatsV53={
  "dir-wall": "双方像隔着第四堵墙，外面的热闹再近，也没人能替{a}答复{b}。{b}把{prop}推近，只等亲手作出的决定。",
  "dir-alien": "{b}用间离术般的停顿拆开一句漂亮话：交出{prop}与接受条件，是两件事。{a}不能再把其中一件算作另一件。",
  "dir-ritual": "仪式调度般的交接原有规矩：先放下{prop}，再伸手接。{b}这次没有伸手，{a}只好先核对约定。",
  "dir-montage": "眼前交接与先前的承诺像蒙太奇般相连；两个时刻一对照，{a}才承认自己答应过先等{b}同意。",
  "dir-body": "争执转成形体无言：{a}按住{prop}，{b}的手停在半途。谁先松手，谁就先把选择交回对方。",
  "dir-solo": "{a}把迟疑写下，像一段独白直给：想处置{prop}，也怕承担随之而来的责任。{b}看完才肯继续。",
  "dir-convention": "双方把假定性公开：触碰{prop}只表示愿意查看，不能算作答应。{a}想凭一次触碰催促{b}，却先被自己的约定拦住。",
  "dir-call": "{b}从旁观者中请来一位见证，点名观众因此有了实际用处。来人记下双方姓名便退开，决定仍留给{a}与{b}。",
  "xdir-toplight": "顶光落在{prop}上，脸却看不清。{b}不再猜{a}是否心软，只等那只手是否真的松开。",
  "xdir-spot": "追光随着{prop}移动。{a}想把它收回身侧，那个小动作却被{b}看得清清楚楚。",
  "xdir-backturn": "{a}以为背身便能结束；{b}没有追，只把{prop}留在转身必经的位置。再走一步，就得决定要不要带走它。",
  "xdir-changeset": "双方搬开遮挡的箱子，像一次当众换景。{prop}完全露出来，{a}无法再背着{b}收起它。",
  "xdir-enter": "{b}请旁观者暂托{prop}，这次观众入戏使双方都腾出了手。来人放稳东西便退开，怎样分担仍由{a}与{b}亲自决定。",
  "xdir-repeat": "交接成了一段重复段落：{a}再次递出{prop}，{b}却不再配合。伸出的手停在半途，催促终于失效。",
  "xdir-bang": "旁唱评论把那句“都为你好”唱了回来。{b}借歌声把{prop}放回{a}面前，要求先说明代价。",
  "xdir-drum": "敲击成了节奏提示，催{a}伸手；{b}故意错开一拍，让{prop}留在原处，不让匆忙算作同意。",
  "xdir-zoubian": "灯暗后，双方经历了一次夜行调度，只能沿窄路移动。{a}急着带走{prop}，却必须等{b}先站稳。",
  "xdir-sleeve": "双方的手势语法不同：{b}伸掌是想查看，{a}却当成索取。{prop}停在中间，直到这个手势被重新确认。",
  "xdir-facechange": "{a}把{prop}收近，{b}的笑意顿住。一次情绪突变使{a}明白，客气不等于允许自己拿走。",
  "xdir-nian": "{a}说得太快，{b}用停顿打断台词节奏，指向{prop}。是否交出，需要一个单独的答复。",
  "xdir-mirror": "{b}照着{a}的样子护住{prop}，形成镜像。{a}从对面看见自己的动作，才觉出商量已经像抢夺。",
  "xdir-group": "近处的群像各有要求：有人等路让开，有人等物件清点。{a}与{b}只能先移到一旁，不能用僵持挡住所有人。",
  "xdir-improvbit": "{b}提出一个即兴插入的办法：让{prop}先留在双方都能看见的地方，再逐项谈条件。{a}的催促暂时用不上了。",
  "xdir-voiceover": "催促的画外音传来，{a}以为有人替自己撑腰。{b}却不肯让一句无名的催促，代替在场的选择。",
  "ydir-lingzi": "{b}的目光落到{a}手上，一次视线引导让{prop}回到争执中心。{a}不能说着商量，却把东西藏在身后。",
  "ydir-fanwork": "{a}借{prop}隔出距离，道具延展却也挡住了交接。{b}不再靠近，等那道由物件划出的边界先放下来。",
  "ydir-handkerchief": "一只杯子成了小道具。{a}把{prop}挪近；{b}没有接过递来的杯子，反而要求把东西放回双方都碰得到的地方。",
  "ydir-dachushou": "双方同时伸手又收回，争夺露出打斗节拍。{b}先退开，{a}即使碰到{prop}，也不能算作已经谈妥。",
  "ydir-diaomao": "{a}追上去时绊了一下，跌倒动作打断争执。{b}先扶稳对方，却没有因此答应围绕{prop}提出的条件。",
  "ydir-jiangshi": "{a}退后失去支撑，身体直体后倒。{b}放下{prop}腾手扶住，危险暂时解除，分歧仍要解释。",
  "ydir-qiangbei": "{a}躲开伸来的手，一次肩倒使争执停住。{b}把{prop}移到安全处，等双方站稳再谈。",
  "ydir-darkchange": "暗转以后，{prop}换了位置。双方先核对各自摸到过哪里，不把黑暗里的移动算作已经交接。",
  "ydir-qieguang": "一侧暗下，另一侧亮起；切光照出{a}藏在身侧的手。{b}要求把{prop}放到亮处再谈。",
  "ydir-backlight": "逆光使{a}只剩轮廓，表情不再能作保证。{b}只看着{prop}，等是否交出的实际动作。",
  "ydir-gauze": "纱幕隔着双方。{a}以为对方看不见，把{prop}收近；纱后一亮，这个与承诺相反的动作却露出来了。",
  "ydir-liftstage": "脚下的升降台改变高度，双方不能平视。{b}暂停交接，等{a}回到彼此伸手能够碰到的位置。",
  "ydir-wagontage": "载物的车台滑向另一侧，{prop}快要离开伸手可及之处。{b}按住车轮，争来的停顿只够等{a}一次答复。",
  "ydir-jijifeng": "加速节奏催着双方争抢，{b}忽然收手。{a}碰到{prop}，却也看清没人愿意承认这次交接。",
  "ydir-shoujiu": "{a}把{prop}移到底幕后，想让争执暂时消失。{b}留在幕前，等东西被重新放回看得见的地方。",
  "ydir-chujiang": "双方从相反出口绕行，一次双侧上下场又在{prop}前相遇。{a}终于停下，把没答完的要求写清。",
  "ydir-duetline": "对白不再只争输赢：{a}每提一项要求，{b}便记下由谁承担。漏掉的责任渐渐有了名字。",
  "ydir-bansing": "伴唱慢下来，把交接前的停顿拖长。{a}不能匆匆收起{prop}，{b}便趁这时核对未答应的条件。",
  "ydir-qichang": "近处的齐唱整齐得容不下迟疑，{b}却偏偏停手。{a}才看见，不是每个人都愿意顺着节拍交出东西。",
  "ydir-coldstage": "冷场留下来，{b}不再接话。{a}先放下{prop}，写明自己愿承担的那一项，交谈才重新开始。",
  "ydir-footlight": "脚光把{a}的手影放得很大，像要拦路。{b}等手停稳，再重新靠近{prop}。",
  "ydir-facelight": "面光照出{a}未及收起的迟疑。{b}把{prop}留在中间，给改变主意的人亲自说明的机会。",
  "ydir-smoke": "烟雾遮住通路，双方都以为对方可能走了。雾散时{prop}仍在，{a}与{b}重新确认彼此还肯继续。",
  "ydir-legdrop": "{b}走到边幕后，{prop}却留在外面。{a}看见随时能离开的那方没有取走东西，便收起最后一句催促。",
  "ydir-paoyuan": "{a}几步追到{b}面前，急奔调度让准备好的理由乱了顺序。{b}停住，等追赶变成一句完整的请求。",
  "ydir-rankou": "灯照出{a}刻意加深的年龄妆。{b}不再凭外表判断资格，转而要求写明对{prop}的实际要求。",
  "dir-v21-testimony": "双方复述证词，把{prop}到过谁手里逐项记下。{a}漏了一次交接，{b}补上后，责任不再只落在最后接手的人身上。",
  "dir-v21-samewords": "“你拿着吧”显出同句异义：{a}以为只借一会儿，{b}以为从此归自己。双方先放回{prop}，再改写含糊的允许。",
  "dir-v21-livefoley": "响动使{a}转身；{b}露出敲击箱板的手，现场拟音拆穿了有人到来的判断。双方决定先看清，再回应催促。",
  "dir-v21-timecut": "时间跳接般的沉默过去，{prop}仍在原地。{b}划掉“稍后答复”，{a}必须承认拖延也会失去机会。",
  "dir-v21-soundimage": "远处笑声与停住的手形成声画错位。{a}无法借热闹假装谈妥，{b}还在{prop}前等答复。",
  "dir-v21-livesubtitles": "{b}逐字写下要求，像给交谈添上实时字幕。{a}发现少了“自愿”二字，先补回它，再继续交接。",
  "dir-v21-linerelay": "约定像台词接力被双方写完。{a}写“交出以后”，{b}补上“仍能拒绝”；{prop}不能换走拒绝的权利。",
  "dir-v21-proptransfer": "{prop}暂放到{b}手边，道具易主却没有转让归属。{a}补写“只是保管”，{b}才肯接手。",
  "dir-v21-emptychair": "空椅对话使双方想起没到场的人。{b}不肯让{a}代替缺席者答应，只把能由自己承担的那一份留下。",
  "dir-v21-unreliable": "{a}先说没碰过{prop}，又说把它移近了一点。不可靠叙述露出裂缝，{b}并排写下两句话，等一个解释。",
  "dir-v21-selectivereplay": "{a}回顾交接却只从伸手时说起；{b}打断选择性重演，坚持把此前的拒绝也算进去。",
  "dir-v21-simultaneoussolos": "双方各写要求，像两段同时独白。{a}把纸转过去，才发现自己写“谈妥”，{b}却写“尚未答应”。",
  "dir-v21-occlusion": "外衣被挪开，遮挡揭示了仍压着{prop}的手。{a}一直没松开，{b}才发现，已经交接只是一句与动作不符的话。",
  "dir-v21-compression": "行李挤窄落脚处，空间压缩使双方转身都要相让。{a}想带走{prop}，必须先等{b}让路。",
  "dir-v21-endingloop": "最后的交接成了结尾回环：{a}再次伸出开场时那只手，{b}先指向写明的责任。相同的动作，这次不能省掉条件。",
  "v23-dir-pool": "浅水漫上脚边，把这里变成水池舞台。{a}想挪近{prop}，水纹先到了{b}脚下，交接不得不回到明处。",
  "v23-dir-readstage": "{b}逐项核对纸上的步骤，像一次演员读提示。{a}不能把“先询问”省成直接伸手，双方先确认怎样处理{prop}。",
  "v23-dir-allwatch": "近处的人停步，全员旁观使{a}无法悄悄收走{prop}。来人只作见证，是否答应仍由{b}决定。",
  "v23-dir-objectchain": "{prop}沿物件传递链来到双方之间，经手者确认后退开。{b}记下经过，{a}不能把最后拿到当成全部事实。",
  "v23-dir-countdown": "钟声像反向计时，离开的时刻越来越近。{b}把{prop}放稳，{a}必须在继续等待与亲手交出之间选择。",
  "v23-dir-floorplan": "地面作图让边界变成一条线。{a}携{prop}跨过去以前，先停住等{b}同意。",
  "v23-dir-soundfirst": "声音先行，门外的脚步还没带来面孔。{a}想借来者作证，{b}却先指向未写清的约定，不能把自己的责任推给门外。",
  "v23-dir-silentopen": "回想刚才的静默开场，{a}只是移近{prop}，并未答应交出。{b}终于不再把那段沉默当默认。",
  "v23-dir-revolving": "旋转门进出使双方总错过交接。{b}最后守在{prop}旁，{a}停下来，不再借赶路跳过回答。",
  "v23-dir-misremember": "记忆错位重演显出分歧：{a}记得先伸手，{b}记得先拒绝。{prop}被放回，这次先确认是否同意。"
};

const styleBeatsV53={
  "style-stan": "这次对话有了斯坦尼体系看重的内心缘由：{b}怕交出{prop}以后再无拒绝的余地。{a}于是先把“可以反悔”写进约定。",
  "style-epic": "私人争执显出史诗剧场般的远景：凭什么拿着{prop}就能替别人决定？{b}把规矩写出来，{a}也得说明为何自己能够例外。",
  "style-absurd": "荒诞派似的循环出现了：{a}递出，{b}退回，谁都说马上就好。第三次伸手前，双方终于重问这件东西究竟要换取什么。",
  "style-real": "现实主义的账很具体：{b}摊开明天的饭钱和路费。{a}看见，答应今天的条件会使对方明天无钱可用。",
  "style-xieyi": "写意戏剧般的一道线由{prop}划出。{b}不肯越线，{a}只好先把东西放回双方都能碰到的位置。",
  "style-poor": "这场质朴戏剧只剩双方和{prop}，礼物与外衣都放到一旁。{a}再没有别的东西能岔开{b}的要求。",
  "style-kabuki": "{a}张开双臂，作出夸张演技般的保证，手却仍护着{prop}。{b}等双臂放下来，才重新请求查看。",
  "style-black": "双方把无法答应的事叫作圆满解决，黑色幽默先让客气话露了馅。{b}指向未完成的交接，谁也没能再笑着带过。",
  "style-physical": "争执变成身体剧场般的推近与后退。{b}退到无处可退，{a}才松开挡路的手，让谈判重新有了拒绝的空间。",
  "xstyle-kunqu": "谈话转成回顾式：{b}翻出昨天的约定，上面写着先征求同意。{a}才明白，急着完成交接已经违背自己的承诺。",
  "xstyle-chuanju": "双方接受一个开放结局：先说清眼前这一步，不预订以后是否还见。{a}划掉要求{b}一直留下的那句话。",
  "xstyle-yuju": "见面像独幕剧，不能靠另换时间地点结束。{b}守着{prop}，等{a}就在这里给出答复。",
  "xstyle-huangmei": "谈话像多幕剧分成两次，双方各自看完条件再回来。{b}带回圈出的“必须”二字，{a}得先解释它。",
  "xstyle-shadow": "灯影留下剪影叙事般的错觉，看似握手，真正的手却未相触。{b}退开半步，不让看似和解代替亲自同意。",
  "xstyle-puppetry": "{a}把自己当唯一的叙述者，从伸手讲起；{b}把开头移到此前的拒绝。不同起点放在一起，省去的责任重新出现。",
  "xstyle-forum": "{b}借论坛戏剧般的尝试提出新办法：把{prop}留在中间，双方分别写下同意的部分。{a}承认，选择不只有照办或离开。",
  "xstyle-site": "站点特定使这次相遇离不开{place}的通路。{b}要求先留出离开的地方，{a}不能用挡路换取点头。",
  "xstyle-walk": "争执成了行走剧场般的一段同行。{b}每走几步便停下看向{prop}，{a}想继续走，也得继续听完要求。",
  "xstyle-soundth": "声音剧场般的误会来自脚步：{a}把响动当催促，{b}指出那只是往返的回声。还没有谁替这次交接定下答案。",
  "xstyle-political": "政治剧场的中心成了决定权。{b}删去只有自己需要服从的条款，{a}也得接受同样的限制。",
  "xstyle-comedy": "双方同时端起礼物，又发现腾不出手接{prop}，礼让闹成喜剧。{b}先放下礼物，{a}也放下客气的搪塞。",
  "xstyle-danceplay": "步子本像舞剧般相互接应，{b}却在交接前停住。{a}收住向前的步子，重新确认对方是否愿意。",
  "xstyle-nanxi": "多线情节在此相撞：{a}想现在拿走{prop}，{b}却得赶在天黑前照顾病人。双方写定离开的时间，再谈能完成哪一步。",
  "xstyle-zaju": "双方按分场结构核对经过：先见面，再提要求，最后才交接。{b}指出中间少了答应的一步，{a}只好补问。",
  "xstyle-lab": "一次实验剧场般的尝试露出难处：双方闭口，只用手交接{prop}，却谁也不肯松手。{b}要求把不放开的理由写清。",
  "xstyle-bunraku": "像文乐中动作与讲述分开的时刻，{a}的保证仍在继续，手却没有松。{b}等那个动作，不再只接受口头保证。",
  "ystyle-qinqiang": "人物弧光落在一个小动作上：{a}本想再次收近{prop}，最后却停住。{b}这才获得亲手核对的机会。",
  "ystyle-yueopera": "{a}的贯穿行动始终是保住{prop}，换了理由，手却仍在原处。{b}索性先问，什么条件能让这只手松开。",
  "ystyle-errenzhuan": "冲突收成双人剧，旁人即使经过，也不能替双方决定。{a}要不要交出{prop}，必须正面接住{b}的答复。",
  "ystyle-zangxi": "被推开的手唤起{a}的情绪记忆。{b}先放稳{prop}，留出不必立刻回答的停顿，交接才不再像强迫。",
  "ystyle-budaixi": "{b}拒绝只承担配角功能，划掉约定里的随叫随到。{a}还想获得帮助，就得给对方选择来去的权利。",
  "ystyle-kyogen": "体面话变成讽刺短剧：{a}说一切自愿，却不许{b}放下{prop}。{b}当真放手，逼自愿二字接受检验。",
  "ystyle-takarazuka": "{a}借演员距离般的退后，看见自己一直占着通路。让开一步，{b}的停留才不再只能算作无路可走。",
  "ystyle-waterpuppet": "场面调度改变了条件：{b}移到出口，{a}守着{prop}。是否留下终于有实际选择，不能靠堵路得到同意。",
  "ystyle-wenmingxi": "商谈像文明戏，起初只有提纲，细处留待相遇。{b}补上代为保管，{a}才发现对方从未答应转让。",
  "ystyle-livingnews": "新通知像活报剧闯入争执：明天起领取东西都要登记姓名。双方得先说明，谁愿为{prop}签字。",
  "ystyle-street": "交接显出街头剧的公开意味，路人停下张望。{a}想略过的拒绝，被{b}清楚地留在纸上。",
  "ystyle-mystery": "神秘剧般的誓愿压在{prop}上：双方许过不伤及无辜。{b}要求写清各自承担的一份，{a}不能只重复誓言。",
  "ystyle-passion": "受难剧的代价有了数目：{b}愿意留下，却要少一夜睡眠。{a}无法再用顺手帮忙抹掉这份付出。",
  "ystyle-lightopera": "轻歌剧般的曲调还在，{b}的手却停住。{a}试着用玩笑催对方接过{prop}，没人接笑，条件只好重新说清。",
  "ystyle-object": "像一场物体剧场，{prop}留在正中，双方先后松手。谁再拿起，就得说明准备怎样处置。",
  "ystyle-install": "箱子像装置剧场般改变去路。{a}绕了半圈才靠近{b}，也承认不该总让对方为一次交接多走那段路。",
  "ystyle-image": "形象剧场般的静景出现：{b}站在出口，{a}守着{prop}。直到{a}侧身让路，继续留下才成为选择。",
  "ystyle-magicreal": "魔幻现实主义般的奇事发生了，{prop}忽然重得谁也拿不动。双方共同托住它，才有机会继续商量。",
  "ystyle-criticalreal": "批判现实主义的追问从眼前延伸：凭什么总由没有东西的人先付出？{b}要求共同担责，{a}不能只谈慷慨。",
  "ystyle-poeticreal": "诗意现实主义的余温落在动作里：{a}理平{prop}旁揉皱的纸，{b}没有阻止，终于肯把没答完的条件写下。",
  "ystyle-ritualstyle": "仪式戏剧般的程序走到最后，{b}却没伸出接物的手。{a}把{prop}放回起点，先问程序里漏掉的愿不愿意。",
  "ystyle-manner": "礼数绕成风俗喜剧，{a}请{b}入座，又坚持坐下便算答应。{b}索性站着，把座位与承诺分开。",
  "ystyle-drawingroom": "双方维持客厅喜剧般的礼貌，拒绝也绕着弯。{b}终于把{prop}摆正，明确写下尚未同意。",
  "ystyle-shinkoku": "通俗情节剧般的转折落在收条上：{a}写了自愿，{b}却从未签名。少掉的签名使交接停下，双方得重新确认。",
  "ystyle-sanskrit": "古典诗学的因果在眼前成形：{a}收近{prop}想保住主动，却使{b}彻底缩手。要继续谈，就得先把东西放回中间。",
  "ystyle-huagu": "规定情境被摆明：{b}最多再留一刻钟，也没有可抵押的东西。{a}划掉原先的交换要求，开始考虑别的责任。",
  "style-v21-epistolary": "未寄出的信使对话变成书信体戏剧。{b}早写下对{prop}的顾虑，{a}读到“怕再无选择”时，先收起催促。",
  "style-v21-courtroom": "争执像法庭剧转向证据。{b}把看见交出与猜到答应分开写，{a}只敢确认前一项，不能再把猜测当同意。",
  "style-v21-mystery": "悬疑剧般的疑点藏在{a}手上：既说交出，为什么还护着{prop}？{b}指向这个动作，要求重说经过。",
  "style-v21-fable": "寓言剧的难题并不遥远：双方想要{prop}，却都让对方先担责。{b}把纸分两栏，等各自写下愿承担的一项。",
  "style-v21-family": "家庭剧般的争执有了明天的分量。{b}提醒谈完仍要再次见面，{a}删去不再过问的要求，保留对方追问的权利。",
  "style-v21-psychothriller": "心理惊悚剧般的不安来自{prop}的位置：{a}记得在左，{b}刚移到右。双方重做移动，才分清事实与猜疑。",
  "style-v21-metatheatre": "相遇像元戏剧般露出双方各自扮的角色。{b}不再装作满意，把{prop}推回；{a}也得停止假装一切尽在掌握。",
  "style-v21-autobiographical": "{b}的坦白像自传剧场：曾经交出东西后，连拒绝都被夺走。{a}因此先在今天的约定中留下退出的一条。",
  "style-v21-polyphonic": "复调剧场里没有一句话替所有人收尾。{a}与{b}各保留一项要求：看清{prop}，也保留拒绝，交接不能省掉任何一件。",
  "style-v21-maximalist": "钟声脚步挤成极繁主义剧场般的喧闹。{b}把{prop}留在中间，{a}盯着未松的手，才没把催促误听成答应。",
  "style-v21-rehearsaldrama": "交接像排练场戏剧试了几回，{a}总在松手前停住。{b}划掉不许取回的一条，让这一次有了不同的条件。",
  "style-v21-radiodrama": "门外催促的声音像广播剧传来，看不见的人也在等结果。{a}先向{b}说明愿承担什么，不能只对着声音喊答应。",
  "style-v21-stagedreading": "双方像读剧那样核对条件。{b}在交出二字后停住，{a}补上经本人同意，先前没读清的限制终于留下。",
  "style-v21-signedtheatre": "手语剧场般的误读使双方停住：{b}指向身侧，是请放下{prop}，{a}却以为可以离开。双方重新确认手势再继续。",
  "style-v21-sensory": "感官剧场般的记忆被指尖唤醒，{a}碰到{prop}便缩手。{b}不把触碰算作同意，等对方自己重新伸手。",
  "v23-style-chamber": "室内剧般的对峙离得太近，一次回避也被{b}察觉。{b}把{prop}放远，给{a}重新考虑的时间。",
  "v23-style-total": "声响光线汇成总体戏剧般的催促，{b}的手却仍未伸出。{a}等声音停下，再询问是否愿意交接。",
  "v23-style-verbatim": "双方以逐字剧场般的耐心保留原话，连“我没答应”也不删。{a}想把记录改得体面，{b}却指向原句。",
  "v23-style-bourgeois-tragedy": "交接有了市民悲剧的重量：{b}靠同一份积蓄付房租。{a}要求今天全部交出，就得面对对方明天无处居住的代价。",
  "v23-style-historyplay": "历史剧场般的对照让双方回看上次交接：没有记名，责任无人承担。{b}这次摊开签收单，{a}也得写下自己的那份。",
  "v23-style-intercultural": "跨文化剧场般的误会来自礼节：{a}把收礼当答应，{b}只当作不失礼貌。双方先退回礼物，再确认{prop}归属。",
  "v23-style-visual": "视觉戏剧般的答案就在眼前：{a}递出{prop}，{b}却收起双手。拒绝被承认以前，东西不能继续向前。",
  "v23-style-translation": "翻译剧场般的换词改变要求：{a}写必须，{b}改成愿意。双方先确认这个差别，再处理{prop}。"
};

function mechanismContextV54(context){
  return context.support&&context.state.holder==='b'?{...context,a:context.b,b:context.a}:context;
}
function storyMethodV40(context){
  const original=context;
  if(context.play.id==='yplay-mrswarren'&&/形体|手势|身体|无言/.test(context.method.name))return `交接转成${context.method.name}：${context.a}按住账簿，指着几笔欠账；${context.b}伸手遮住那些名字，把话题转回展览。${context.a}没有接${context.b}递来的资助款，仍指着账上尚未付清的数目。`;
  context=mechanismContextV54(context);
  const beat=methodBeatsV53[context.method.id]||'{a}准备继续交接，{b}却停在{prop}前，要求先把遗漏的条件补齐。';
  let text=sceneTextV40(beat,context);
  if(!methodBeatsV53[context.method.id])text=`这次${context.method.name}使交接暂时停住。${text}`;
  for(const card of [original.lead,original.support].filter(Boolean))if(quietCharacterV53(card)){
    text=text.replace(`${card.name}说得太快`,`${card.name}写得太急`);
    if(context.a===card.name&&context.method.id==='dir-v21-unreliable')text=text.replace('先说没碰过','先写没碰过').replace('又说把它','又写把它');
  }
  if([original.lead,original.support].some(quietCharacterV53))text=text.replace('双方复述证词','双方用文字复述证词').replace('对白不再只争输赢','对白转到纸上，不再只争输赢');
  return text;
}
function storyStyleV40(context){
  context=mechanismContextV54(context);
  const beat=styleBeatsV53[context.style.id]||'{a}把请求重新摆到{b}面前。这次双方先说明各自要承担什么，再决定是否继续。';
  let text=sceneTextV40(beat,context);
  if(!styleBeatsV53[context.style.id])text=`这场争执带上${context.style.name}的意味。${text}`;
  if(context.style.id==='ystyle-errenzhuan')text=text.replace('冲突收成双人剧',/三女巫/.test(context.a+context.b)?'这场争执借双人剧的结构，只留下两个彼此相对的立场':'这场争执成了一出双人剧');
  if(context.style.id==='style-stan')text=text.replace(`怕交出${context.prop}以后再无拒绝的余地`,'怕点头以后再无拒绝的余地');
  if(context.state.key!=='money'&&context.state.key!=='warren'){
    if(context.style.id==='style-real')text=`现实主义的账很具体：${context.b}列出明天必须做完的工作。今天若把所有时间都耗在这里，明天就得拖着没有休息的身体继续。${context.a}因此不再把拖延当作没有代价。`;
    if(context.style.id==='v23-style-bourgeois-tragedy')text=`这次争执有了市民悲剧的重量：${context.b}明天还要靠自己的劳动维持生活，不能无限期在这里等候。${context.a}得把对方能承担的时间，也算进今天的要求里。`;
  }
  return text;
}


const storyCharactersV54={
  "role-oedipus":{priority:"查到自己也不能停查"},
  "role-nora":{priority:"自己的去留由自己决定"},
  "role-hamlet":{priority:"先辨明真假再行动"},
  "role-fanyi":{priority:"不能又被一句安抚打发"},
  "role-macbeth":{priority:"得来的位置不能被夺回"},
  "role-doue":{priority:"不能为脱身牵连无辜"},
  "role-liniang":{priority:"不替自己不信的话署名"},
  "role-ladym":{priority:"不能让已经做下的事败露"},
  "role-wang":{priority:"保住明天还能开门的生计"},
  "role-shen":{priority:"救急不能耗尽自己的生计"},
  "role-zhou":{priority:"维持由自己掌握的家内秩序"},
  "role-willy":{priority:"不能被当成已经无用的人"},
  "role-anti":{priority:"不能让禁令取消告别的责任"},
  "role-bailu":{priority:"先替眼前的困境挡住一次催逼"},
  "role-gogo":{priority:"眼前的饥饿疲惫不能再被拖延"},
  "role-shiping":{priority:"不能再让无辜的人承受旧账"},
  "role-xiangjun":{priority:"去留和亲事不能拿来抵价"},
  "role-chengying":{priority:"保住受托者的身份与安全"},
  "role-yuji":{priority:"必须把迫近的危险传达出去"},
  "role-lear":{priority:"辨认失势后仍愿伸手的人"},
  "role-courage":{priority:"生计不能再以失去同伴为代价"},
  "role-blanche":{priority:"保留最后一点不被围观的体面"},
  "role-mengmei":{priority:"不能从指控者变成被追问者"},
  "role-zhu":{priority:"守住最后一点属于自己的成果"},
  "role-vladimir":{priority:"让等待保有可以核对的依据"},
  "xrole-ophelia":{priority:"零散的心事也要被认真看见"},
  "xrole-juliet":{priority:"由自己决定与谁建立关系"},
  "xrole-eliza":{priority:"学会规矩后仍能自己选择生活"},
  "xrole-hedda":{priority:"不能只在别人的安排里旁观"},
  "xrole-harpagon":{priority:"财物不能因人情而减少"},
  "xrole-tartuffe":{priority:"名声与实惠都不能松手"},
  "xrole-figaro":{priority:"不能让上位者的特权吞掉约定"},
  "xrole-mephisto":{priority:"让对方亲自接受交换的条件"},
  "xrole-cordelia":{priority:"不能用谎话换亲近与认可"},
  "xrole-pozzo":{priority:"继续占据发号施令的位置"},
  "xrole-lucky":{priority:"让一直被压住的疑问得到出口"},
  "xrole-chunxiang":{priority:"日常生计不能被临时冲动毁掉"},
  "xrole-hongniang":{priority:"撮合之后双方仍能面对面说话"},
  "xrole-xiangzi":{priority:"靠自己挣来的东西不能再失去"},
  "xrole-huniu":{priority:"亲自挑中的生活要落到实处"},
  "xrole-sifeng":{priority:"不能在不知情时被决定命运"},
  "xrole-juexin":{priority:"顾全关系也不能再放任损失"},
  "xrole-chanjuan":{priority:"受困的人未脱身就不能先走"},
  "xrole-zhulian":{priority:"危险的事实不能只因禁令被删掉"},
  "xrole-cao":{priority:"欣赏才智也不肯交出全部底牌"},
  "xrole-yangxiu":{priority:"看穿的用意不能装作不知"},
  "xrole-gouer":{priority:"自己守住的地界不能再让出"},
  "xrole-shang":{priority:"立下的规矩也必须约束自己"},
  "yrole-clytemnestra":{priority:"旧日牺牲不能被胜利遮过去"},
  "yrole-witches":{priority:"不让含混的预告变成单一保证"},
  "yrole-horatio":{priority:"替未能到场的人留下完整经过"},
  "yrole-prospero":{priority:"收回应有之物而不继续支配别人"},
  "yrole-ariel":{priority:"完成差事以后必须获得自由"},
  "yrole-richardiii":{priority:"借结盟取得下一步主动权"},
  "yrole-falstaff":{priority:"活着回去比漂亮的名声要紧"},
  "yrole-helmer":{priority:"家庭的体面不能在外人面前破裂"},
  "yrole-stockmann":{priority:"已经发现的危险必须公开"},
  "yrole-khlestakov":{priority:"不能在众人面前失去借来的体面"},
  "yrole-qiuhu":{priority:"不能让旧日伤害被一次交接抵消"},
  "yrole-juehui":{priority:"未来不能继续由旧规矩代写"},
  "yrole-baisuzhen":{priority:"不能靠隐瞒维持眼前的平静"},
  "yrole-guifei":{priority:"被夺走的人不能从记忆中删去"},
  "yrole-bawang":{priority:"不能让奖赏过的行动突然被改判"},
  "yrole-liangshanbo":{priority:"把可能失传的成果整理完整"},
  "yrole-tietmei":{priority:"不能让对方独占讲述两人关系的权力"},
  "yrole-aqing":{priority:"不能再让共同编出的故事代替现实"},
  "yrole-zijirong":{priority:"不被卷进无法承受的公开争吵"},
  "yrole-malu":{priority:"留住等待回应的位置"},
  "yrole-houfangyu":{priority:"重逢不能抹去分离时付出的代价"},
  "yrole-dorine":{priority:"不让漂亮话替有权者遮住私利"},
  "yrole-mackheath":{priority:"任何结盟都不能堵住退路"},
  "yrole-hamm":{priority:"仍要参与无法亲眼看见的决定"},
  "yrole-linda":{priority:"困顿中的人仍应被完整听见"},
  "yrole-brutus":{priority:"公共理由必须经得起公开检验"},
  "yrole-solveig":{priority:"接纳一个人而不把等待变成索取"},
  "yrole-wukong":{priority:"自己的生活与劳动不能任人征用"},
  "yrole-kuangzhong":{priority:"不能继续靠猜疑判断亲近的人"},
  "role2-creon":{priority:"不能因私人请求破坏公开命令"},
  "role2-ismene":{priority:"不能只让亲近的人独自承担危险"},
  "role2-juliet-nurse":{priority:"先保住被照料者眼前的安全"},
  "role2-mercutio":{priority:"不能让争一口气取代眼前的人"},
  "role2-banquo":{priority:"希望得到好处也不能先背弃忠诚"},
  "role2-macduff":{priority:"被伤害的人不能只剩一个复仇名目"},
  "role2-laertes":{priority:"为亲人讨回应答但不愿被利用"},
  "role2-polonius":{priority:"把关心落实成可监督的规矩"},
  "role2-gertrude":{priority:"维持关系也必须面对自己的选择"},
  "role2-claudius":{priority:"认错不能使已经取得的位置松动"},
  "role2-goneril":{priority:"得到的管理权必须能够真正使用"},
  "role2-regan":{priority:"不能让别人保留可反过来制约的余地"},
  "role2-edmund":{priority:"不再被既有身份排在机会之外"},
  "role2-kent":{priority:"忠诚不能只剩顺从和讨好"},
  "role2-fool-lear":{priority:"让难听的事实仍有机会被听见"},
  "role2-gloucester":{priority:"不能再把信任交给顺耳的解释"},
  "role2-edgar":{priority:"先让受困的人安全度过这一段"},
  "role2-malcolm":{priority:"盟友必须敢于拒绝不正当的要求"},
  "role2-duncan":{priority:"让立过功的承诺得到信任"},
  "role2-cassandra":{priority:"危险不能因为无人相信而被抹掉"},
  "role2-agamemnon":{priority:"胜利归来应当获得公开承认"},
  "role2-aegisthus":{priority:"受害的旧账要转成今天的处置权"},
  "role2-martha-misunderstanding":{priority:"尽快攒够摆脱眼前生活的代价"},
  "role2-kristine-linde":{priority:"重新开始必须立在真实处境上"},
  "role2-krogstad":{priority:"保住生计和重新被接纳的机会"},
  "role2-lopakhin":{priority:"在事情无法挽回前作出可执行决定"},
  "role2-gayev":{priority:"旧生活不能被一次清算说成无价值"},
  "role2-varya":{priority:"照料一切的人也需要明确的答复"},
  "role2-anya-cherry":{priority:"告别旧生活仍要保留开始的能力"},
  "role2-trofimov":{priority:"谈未来时自己也要离开旧特权"},
  "role2-serebryakov":{priority:"自己的晚年安稳应当得到优先安排"},
  "role2-sonya":{priority:"失望以后仍要守住能继续的日常"},
  "role2-yelena":{priority:"不能只作为被观看的人消磨时间"},
  "role2-tuzenbach":{priority:"新生活必须从亲手劳动开始"},
  "role2-solyony":{priority:"不能让自己被轻易忽略"},
  "role2-vershinin":{priority:"希望不能冒充今天就能兑现的承诺"},
  "role2-andrei-three-sisters":{priority:"不能让抱负彻底变成无法承认的失败"},
  "role2-treplev":{priority:"新尝试不能只因不熟悉就被判无用"},
  "role2-arkadina":{priority:"照料别人也不能使自己的位置消失"},
  "role2-nina":{priority:"继续做选择过的工作"},
  "role2-trigorin":{priority:"记录生活不能绕过当事人的意愿"},
  "role2-mayor-inspector":{priority:"不能让检查碰到自己的疏漏"},
  "role2-hippolytus":{priority:"不能为自保泄露受托的隐情"},
  "role2-oenone":{priority:"先替依赖自己的人保住处境"},
  "role2-theseus":{priority:"家内权威不能在质疑中停摆"},
  "role2-clov":{priority:"结束依赖不能只靠一句离开"},
  "role2-nagg":{priority:"即使行动受限也要留住与人的交换"},
  "role2-nell":{priority:"有限的接近也不能被匆忙取消"},
  "role2-jean-rhinoceros":{priority:"始终站在看来最有力量的秩序一边"},
  "role2-fire-chief":{priority:"不能让职责在无尽闲谈里落空"},
  "role2-claire-maids":{priority:"亲自试出支配别人的滋味与代价"},
  "role2-solange":{priority:"共同反抗必须按自己能掌握的次序"},
  "role2-li-shiqing":{priority:"在等级秩序里换到更稳的位置"},
  "role2-huang-shengsan":{priority:"一家人的饭钱不能被一句辞退抹掉"},
  "role2-fang-dasheng":{priority:"帮助必须真的抵达对方的处境"},
  "role2-jiao-mother":{priority:"家中发生的变化不能越过自己"},
  "role2-jiao-daxing":{priority:"不愿用割断一段关系保全另一段"},
  "role2-bai-shazi":{priority:"眼前明显的不同不能被装作没听见"},
  "role2-zeng-siyi":{priority:"只有可掌控的日常才算安稳"},
  "role2-zeng-hao":{priority:"衰落中的体面和身后安排不能被夺走"},
  "role2-ruizhen":{priority:"第一次说出的拒绝不能又被收回"},
  "role2-liu-mazi":{priority:"每次撮合都必须留下自己的抽成"},
  "role2-kang-shunzi":{priority:"不能再被当成没有去留权的交换物"},
  "role2-liu-siye":{priority:"家产和亲近的人都不能脱离掌控"},
  "role2-xiao-fuzi":{priority:"自己的希望不能以被照料者断炊为代价"},
  "role2-kuang-fu":{priority:"归来不能取消别人真实付出的生活"},
  "role2-yang-caiyu":{priority:"不能用抹去一段生活来证明另一段"},
  "role2-lin-zhicheng":{priority:"帮助过别人也不能抹去别人的关系"},
  "role2-huang-jiamei":{priority:"不能让亲近的人只看见自己的失意"},
  "role2-qi-yongnian":{priority:"旧日的支配位置不能被现实取消"},
  "role2-xiu-dingxin":{priority:"热闹的生意不能被各自私心吃空"},
  "role2-xia-professor":{priority:"庄严的立场也不能跳过实际生活"},
  "role2-shi-professor":{priority:"不能让一次接受被当作立场的出售"},
  "role2-mifeng":{priority:"亲近不能要求自己对危险装作不知"},
  "role-v21-unclevanya":{priority:"耗去的劳动不能永远被视作理所当然"},
  "role-v21-astrov":{priority:"眼前的方便不能耗尽以后生活的条件"},
  "role-v21-berenger":{priority:"不能只因多数改变就放弃自己的判断"},
  "role-v21-phedre":{priority:"不能再由遮掩的说法继续伤害旁人"},
  "role-v21-caligularole":{priority:"把认定的逻辑贯彻到底"},
  "role-v21-marytyrone":{priority:"暂时留在不必面对今日困境的记忆里"},
  "role-v21-edmundtyrone":{priority:"具体的身体需要不能被开销掩盖"},
  "role-v21-amanda":{priority:"不能让家人失去看似仅有的出路"},
  "role-v21-tomglass":{priority:"离开旧生活也不能假装牵挂不存在"},
  "role-v21-winnie":{priority:"受限的日子里仍要保有具体的秩序"},
  "role-v21-jimglass":{priority:"善意不能冒充无法兑现的亲近"},
  "v23-role-joekeller":{priority:"想保住家庭也不能把别人的损失删掉"},
  "v23-role-heisenberg":{priority:"危险的意图不能在含混措辞里被误认"},
  "v23-role-woyzeck":{priority:"被役使的身体也必须换得到生计"},
  "v23-role-danton":{priority:"疲惫的人也不应被不断加码的原则吞掉"},
  "v23-role-eddie":{priority:"把保护之名下的决定权留在自己手里"},
  "v23-role-hickey":{priority:"不能再靠明天会改变的幻想过今天"},
  "v23-role-melchior":{priority:"知识应当帮助求问的人而非惩罚求问"},
  "v23-role-alan":{priority:"不能把支撑自己的信念只当作怪癖"},
  "v23-role-dreamdoctor":{priority:"无法解决问题时也要保留倾听的尊严"},
  "v23-role-jinzhi":{priority:"摆脱旧束缚不能只是换一个发令者"},
  "v23-role-silentman":{priority:"不能继续把行动交给迟迟不来的答复"},
  "v23-role-serge":{priority:"自己的判断不能只凭别人一句嘲笑撤销"},
  "v23-sup-kate":{priority:"不能亲手取消仍在等待的归来"},
  "v23-sup-bohr":{priority:"共同的往事不能只按一人的版本改写"},
  "v23-sup-marie":{priority:"被珍视的愿望不能取消自己的意愿"},
  "v23-sup-robespierre":{priority:"公共原则不能成为私下通融的装饰"},
  "v23-sup-catherine":{priority:"独立选择不等于背叛照料过自己的人"},
  "v23-sup-nurse":{priority:"具体的变化必须传到能处理的人手中"},
  "v23-sup-moritz":{priority:"不能再用假装懂得掩住求助的需要"},
  "v23-sup-zhaosan":{priority:"不能让受过的恩惠抹平该追究的事"},
  "v23-sup-stationmaster":{priority:"不能让熟人关系的空保证继续误导众人"},
  "v23-sup-harryhope":{priority:"改变必须小到自己真的肯迈出一步"},
  "v23-sup-marc":{priority:"友情不能靠一致的品味强行维持"}
};
// A character can change the terms of the encounter, but cannot independently
// transfer its object or complete an exit before the play's decision does.
const characterStrategiesV54={
  care:{action:'{a}在{prop}旁摊开照料他人的时间表，不肯挪用那几个时段：“{priority}。”',response:'{a}也添上自己不能离开的时段，与{b}一项项错开：“{priority}。”',cost:'时间表留下来，{a}能用于这次商量的时间也缩短了。',beat:'{a}先留出照料他人的时间'},
  aid:{action:'{a}先把能歇脚的位置让给{b}，再将自己的条件放到{prop}旁：“{priority}。”',response:'{a}没有独占让出的便利，把位置留给双方轮换：“{priority}。”',cost:'{a}让出了歇脚的位置，只能站着等这次交谈结束。',beat:'{a}先把歇脚的位置让给{b}'},
  autonomy:{action:'{a}在{prop}旁给自己与{b}各留一行答复，不许一行替另一行作数：“{priority}。”',response:'{a}在属于自己的那一行标出尚未同意之处，把空白留给{b}亲自填写：“{priority}。”',cost:'两行答复没有被合成一句；{a}也得收住催促，容许{b}留下不同意见。',beat:'{a}给双方分别留下答复的位置'},
  grievance:{action:'{a}在{prop}旁另列未了的旧责，拒绝把今天的处置算作一笔勾销：“{priority}。”',response:'{a}在旧责旁补上自己记得的经过，不让受损的那一方从记录里消失：“{priority}。”',cost:'旧责多占了一页，{a}得先等这一页核对完，才能继续处理眼前的事。',beat:'{a}先把旧责与眼前的处置分开'},
  truth:{action:'{a}把关于{prop}的已知与猜测分开写下，自己不能证明的也留下空白：“{priority}。”',response:'{a}接过记录，圈出自己确知的一项，也没有替余下的空白填答案：“{priority}。”',cost:'{a}的说法也留在纸上，必须与对方的说法一起接受核对。',beat:'{a}先把已经证实的事与猜测分开'},
  control:{action:'{a}在{prop}旁写下由谁保管、何时交回、能否带走，连确认的次序也要握在手里：“{priority}。”',response:'{a}把最后确认的一栏圈到自己面前，不肯把决定全交给{b}：“{priority}。”',cost:'保管与处置的要求摊开以后，{a}也得逐条回应，不能只留一句命令。',beat:'{a}要求先写清保管与处置的权限'},
  livelihood:{action:'{a}在{prop}旁写明能承担的时数，先扣掉维持生活和休息所需的部分：“{priority}。”',response:'{a}也标出自己能承担的一段，不让缺下的时间自动算到自己头上：“{priority}。”',cost:'生活与休息的时间被留住了，{a}今天能够分担的事也少了一截。',beat:'{a}先保留维持生活和休息的时间'},
  privacy:{action:'{a}把{prop}留在明处，却把另写的私事压在手下，要求只公开与这件事有关的经过：“{priority}。”',response:'{a}也收起不愿示人的那一页，只留下愿意负责的内容：“{priority}。”',cost:'被手掌压住的那页仍未公开，{a}得承受这份保留带来的疑心。',beat:'{a}只肯公开与眼前的事有关的经过'},
  recognition:{action:'{a}把{prop}放稳，请{b}把对这次安排的异议写具体，才肯继续往下谈：“{priority}。”',response:'{a}把自己最不赞同的一项圈出，又给{b}留下解释的位置：“{priority}。”',cost:'{a}争来了具体的评价，也必须把不愿听的反对理由看完。',beat:'{a}坚持先听具体的理由'},
  loyalty:{action:'{a}把挡在双方之间的东西挪开，不肯让继续来往以接受{prop}的处置为条件：“{priority}。”',response:'{a}把拒绝这次安排与拒绝来往分开写明，交还给{b}：“{priority}。”',cost:'{a}让出了拒绝的余地，也失去了用这次条件留住对方的办法。',beat:'{a}不肯拿这次条件捆住双方的关系'},
  hope:{action:'{a}在{prop}旁把得到确认的事与仍在期待的事分开，不再替空白作保证：“{priority}。”',response:'{a}没有填满期待的那一栏，只在旁边留下还愿继续等的记号：“{priority}。”',cost:'空白仍留在纸上，{a}得把接下来的打算建立在尚无保证的事实上。',beat:'{a}把期待与已经得到的答复分开'},
  principle:{action:'{a}在{prop}旁把自己的要求重写一遍，将双方的名字互换，检查同样的条件是否仍能接受：“{priority}。”',response:'{a}把互换后的要求逐条核对，在自己也须承担的一项旁留下记号：“{priority}。”',cost:'名字换过一次，{a}不能再把同样的责任只写给对方。',beat:'{a}先把同样的要求放到自己身上'},
  memory:{action:'{a}在{prop}旁另铺一张纸，把记得的旧日经过与今天的日期分开，不愿任由往事被删掉：“{priority}。”',response:'{a}在旧日经过旁补上自己留下的记忆，却把今天的答复空着：“{priority}。”',cost:'两张纸并排留下，{a}得承认记忆可以保留，却不能替今天作答。',beat:'{a}把往日的经过与今天的答复分开'},
  urgency:{action:'{a}在{prop}旁写下必须当场处理的一项，再把可以留待以后的事划到另一边：“{priority}。”',response:'{a}指向尚未完成的那一项，留下记号，请{b}不要再用下一次替代：“{priority}。”',cost:'最急的一项被圈了出来，{a}也得留下处理它，不能只把催促交给对方。',beat:'{a}先圈出不能继续拖延的一项'},
};
const characterStrategyIdsV54={
  "role-oedipus": "truth",
  "role-nora": "autonomy",
  "role-hamlet": "truth",
  "role-fanyi": "recognition",
  "role-macbeth": "control",
  "role-doue": "principle",
  "role-liniang": "principle",
  "role-ladym": "privacy",
  "role-wang": "livelihood",
  "role-shen": "aid",
  "role-zhou": "control",
  "role-willy": "recognition",
  "role-anti": "loyalty",
  "role-bailu": "aid",
  "role-gogo": "urgency",
  "role-shiping": "grievance",
  "role-xiangjun": "autonomy",
  "role-chengying": "care",
  "role-yuji": "urgency",
  "role-lear": "loyalty",
  "role-courage": "care",
  "role-blanche": "privacy",
  "role-mengmei": "privacy",
  "role-zhu": "livelihood",
  "role-vladimir": "hope",
  "xrole-ophelia": "recognition",
  "xrole-juliet": "autonomy",
  "xrole-eliza": "autonomy",
  "xrole-hedda": "control",
  "xrole-harpagon": "control",
  "xrole-tartuffe": "privacy",
  "xrole-figaro": "principle",
  "xrole-mephisto": "control",
  "xrole-cordelia": "principle",
  "xrole-pozzo": "control",
  "xrole-lucky": "recognition",
  "xrole-chunxiang": "livelihood",
  "xrole-hongniang": "loyalty",
  "xrole-xiangzi": "livelihood",
  "xrole-huniu": "autonomy",
  "xrole-sifeng": "autonomy",
  "xrole-juexin": "loyalty",
  "xrole-chanjuan": "aid",
  "xrole-zhulian": "truth",
  "xrole-cao": "control",
  "xrole-yangxiu": "truth",
  "xrole-gouer": "control",
  "xrole-shang": "principle",
  "yrole-clytemnestra": "grievance",
  "yrole-witches": "truth",
  "yrole-horatio": "truth",
  "yrole-prospero": "autonomy",
  "yrole-ariel": "autonomy",
  "yrole-richardiii": "control",
  "yrole-falstaff": "autonomy",
  "yrole-helmer": "privacy",
  "yrole-stockmann": "truth",
  "yrole-khlestakov": "privacy",
  "yrole-qiuhu": "grievance",
  "yrole-juehui": "autonomy",
  "yrole-baisuzhen": "truth",
  "yrole-guifei": "memory",
  "yrole-bawang": "recognition",
  "yrole-liangshanbo": "memory",
  "yrole-tietmei": "autonomy",
  "yrole-aqing": "truth",
  "yrole-zijirong": "privacy",
  "yrole-malu": "hope",
  "yrole-houfangyu": "memory",
  "yrole-dorine": "truth",
  "yrole-mackheath": "autonomy",
  "yrole-hamm": "control",
  "yrole-linda": "care",
  "yrole-brutus": "principle",
  "yrole-solveig": "hope",
  "yrole-wukong": "autonomy",
  "yrole-kuangzhong": "truth",
  "role2-creon": "principle",
  "role2-ismene": "loyalty",
  "role2-juliet-nurse": "care",
  "role2-mercutio": "loyalty",
  "role2-banquo": "loyalty",
  "role2-macduff": "grievance",
  "role2-laertes": "grievance",
  "role2-polonius": "control",
  "role2-gertrude": "loyalty",
  "role2-claudius": "control",
  "role2-goneril": "control",
  "role2-regan": "control",
  "role2-edmund": "recognition",
  "role2-kent": "loyalty",
  "role2-fool-lear": "truth",
  "role2-gloucester": "truth",
  "role2-edgar": "aid",
  "role2-malcolm": "principle",
  "role2-duncan": "loyalty",
  "role2-cassandra": "truth",
  "role2-agamemnon": "recognition",
  "role2-aegisthus": "grievance",
  "role2-martha-misunderstanding": "livelihood",
  "role2-kristine-linde": "truth",
  "role2-krogstad": "livelihood",
  "role2-lopakhin": "urgency",
  "role2-gayev": "memory",
  "role2-varya": "care",
  "role2-anya-cherry": "hope",
  "role2-trofimov": "principle",
  "role2-serebryakov": "livelihood",
  "role2-sonya": "livelihood",
  "role2-yelena": "autonomy",
  "role2-tuzenbach": "livelihood",
  "role2-solyony": "recognition",
  "role2-vershinin": "hope",
  "role2-andrei-three-sisters": "recognition",
  "role2-treplev": "recognition",
  "role2-arkadina": "recognition",
  "role2-nina": "livelihood",
  "role2-trigorin": "privacy",
  "role2-mayor-inspector": "privacy",
  "role2-hippolytus": "privacy",
  "role2-oenone": "care",
  "role2-theseus": "control",
  "role2-clov": "autonomy",
  "role2-nagg": "loyalty",
  "role2-nell": "loyalty",
  "role2-jean-rhinoceros": "control",
  "role2-fire-chief": "urgency",
  "role2-claire-maids": "control",
  "role2-solange": "control",
  "role2-li-shiqing": "control",
  "role2-huang-shengsan": "livelihood",
  "role2-fang-dasheng": "aid",
  "role2-jiao-mother": "control",
  "role2-jiao-daxing": "loyalty",
  "role2-bai-shazi": "truth",
  "role2-zeng-siyi": "control",
  "role2-zeng-hao": "privacy",
  "role2-ruizhen": "autonomy",
  "role2-liu-mazi": "livelihood",
  "role2-kang-shunzi": "autonomy",
  "role2-liu-siye": "control",
  "role2-xiao-fuzi": "care",
  "role2-kuang-fu": "memory",
  "role2-yang-caiyu": "memory",
  "role2-lin-zhicheng": "loyalty",
  "role2-huang-jiamei": "privacy",
  "role2-qi-yongnian": "control",
  "role2-xiu-dingxin": "livelihood",
  "role2-xia-professor": "principle",
  "role2-shi-professor": "principle",
  "role2-mifeng": "truth",
  "role-v21-unclevanya": "livelihood",
  "role-v21-astrov": "principle",
  "role-v21-berenger": "autonomy",
  "role-v21-phedre": "truth",
  "role-v21-caligularole": "principle",
  "role-v21-marytyrone": "memory",
  "role-v21-edmundtyrone": "livelihood",
  "role-v21-amanda": "care",
  "role-v21-tomglass": "loyalty",
  "role-v21-winnie": "control",
  "role-v21-jimglass": "truth",
  "v23-role-joekeller": "grievance",
  "v23-role-heisenberg": "truth",
  "v23-role-woyzeck": "livelihood",
  "v23-role-danton": "livelihood",
  "v23-role-eddie": "control",
  "v23-role-hickey": "urgency",
  "v23-role-melchior": "aid",
  "v23-role-alan": "recognition",
  "v23-role-dreamdoctor": "aid",
  "v23-role-jinzhi": "autonomy",
  "v23-role-silentman": "urgency",
  "v23-role-serge": "autonomy",
  "v23-sup-kate": "hope",
  "v23-sup-bohr": "memory",
  "v23-sup-marie": "autonomy",
  "v23-sup-robespierre": "principle",
  "v23-sup-catherine": "autonomy",
  "v23-sup-nurse": "urgency",
  "v23-sup-moritz": "aid",
  "v23-sup-zhaosan": "grievance",
  "v23-sup-stationmaster": "truth",
  "v23-sup-harryhope": "hope",
  "v23-sup-marc": "loyalty"
};
function characterStrategyV54(card){
  return {priority:storyCharactersV54[card.id]?.priority||'先弄清自己真正愿意承担什么',key:characterStrategyIdsV54[card.id]||'truth'};
}
function characterMotiveV40(card,other,prop='手边的东西',response=false){
  const {priority,key}=characterStrategyV54(card),a=card.name;
  let text=characterStrategiesV54[key][response?'response':'action'];
  if(key==='control'&&prop==='名牌')text=text.replace('由谁保管、何时交回、能否带走','谁能使用这个名字、能用到何时、由谁说明来历');
  return text.replaceAll('{a}',a).replaceAll('{b}',other).replaceAll('{prop}',prop).replaceAll('{priority}',priority);
}
function characterCostV54(card,other='对方'){
  const {key}=characterStrategyV54(card);
  return characterStrategiesV54[key].cost.replaceAll('{a}',card.name).replaceAll('{b}',other);
}
function storyCharacterChoicesV54(c){
  const same=characterStrategyV54(c.lead).key===characterStrategyV54(c.support).key;
  return characterMotiveV40(c.lead,c.b,c.prop)+characterMotiveV40(c.support,c.a,c.prop,same);
}
function storyConsequencesV54(c){
  if(c.state.key==='identity'&&characterStrategyV54(c.lead).key==='control')return `${c.a}写出了使用名字的要求，也得说明自己的名牌从何而来。`;
  return characterCostV54(c.lead,c.b);
}

function warrenStoryV40(context){
  const {a,b,place,style,lead,method}=context;
  const sound=/广播|声音/.test(style.name);
  const exchange=storyMethodV40(context);
  const purpose=lead.id==='v23-role-serge'
    ? `${a}带着自己珍爱的白画来到${place.name}，想办一次小展览，让别人认真看待自己的选择。${b}愿意负担费用，条件是展览必须挂自己的名字。`
    : `${a}带着一幅画来到${place.name}，想办一次小展览。${b}愿意负担费用，条件是展览必须挂自己的名字。`;
  return [
    `故事联想：取意于《华伦夫人的职业》，把不同作品中的人物放进一个虚构故事。${purpose}${a}起初觉得，这只是替对方留一点体面，至少终于有人肯为那幅画认真花钱。`,
    `${a}随后发现，${b}的账簿里还压着几笔未付的工钱。${a}问这些人什么时候能拿到钱，${b}反问：展览不花这笔钱，你愿意自己补上吗？${exchange}`,
    sound?`门外传来催账的声音。${a}起初只听见${b}笑着说“不会少你的”，随后听见脚步远去，笑声也立刻消失。${a}这才明白，自己盼望的资助，可能正是别人被一再拖延的报酬。`:`${a}终于承认，自己从前也曾接受同样来路的钱，只在轮到别人获利时才急着讲道德。${b}的讥讽击中了事实，却不能使那几笔拖欠的工钱自动消失。`,
    `${a}把画带回去，决定先缩小展览规模。${a}没有因此变成一个毫无牵连的清白人：自己也曾把赞助当作别人应给的认可。${b}失去了挂名的机会，账上的欠款仍要偿还；两人各失去了一样想要的东西，却都不能再把代价推给门外等工钱的人。`,
  ];
}

function quietCharacterV53(card){return ['role-yuji','v23-role-silentman'].includes(card?.id);}
function storyKeyV53(c){return !c.support?'solo':c.play.id==='yplay-mrswarren'?'warren':sceneArcsV40[c.play.id]?c.play.id:Object.keys(storySeedsV40).find(key=>storySeedsV40[key]===c.arc);}
const storyDecisionsV54={
  'play-cherry':['钥匙易手以后，{b}才知道留下也得征求许可。','{b}收回感谢，要求{a}先说清留下的人怎么办。'],
  'play-oedipus':['{a}纠正了一处只有在场者才知道的细节，疑问落回自己身上。','{a}坐进证人的位置，把刚才追问别人的事完整地问自己一遍。'],
  'play-hamlet':['{b}指出戏里删掉的一句话，使{a}的指控失去把握。','{a}补回原话，停止把对方的反应当作认罪，答应下次先拿出证据。'],
  'play-macbeth':['席位归了{a}，连{b}的脚步也变得可疑。','{b}不再保证安全；{a}守着得到的席位，却一夜未能安心坐下。'],
  'play-godot':['远处来的只是双方自己留下的标记，要等的人仍没有来。','{a}与{b}说好离开，却把标记放回空位，又留了下来。'],
  'play-doll':['{a}发现{b}的挽留仍要求一切照旧。','{a}拿起自己的行李离开，把决定生活的权利留在自己手里。'],
  'play-teahouse':['为留住客人改完最后一条规矩，门外已经无人等候。','{a}收起没能用上的杯子，{b}也没有再假装坐下便能挽救生意。'],
  'play-thunder':['{a}急着遮住旧物上的名字，反而证明自己没有忘记。','{b}重新站回曾被赶开的地方，不再允许{a}把重逢说成初见。'],
  'play-peony':['{b}想带走签字的纸，{a}却伸手拦住。','{b}收回笔，拒绝用自己的名字给尚未同意的条件作证。'],
  'play-salesman':['{b}合上成绩册，承认自己达不到{a}的期待。','双方留下来谈今天怎样生活，不再把成功当作相处的条件。'],
  'play-goodperson':['{b}认出强硬与温柔出自同一个人，换身份也卸不掉承诺。','{a}把储备放回中间，双方改谈明天各自怎样生活。'],
  'play-lear':['{a}分完最后一块地方，才发现没有给自己留下位置。','{a}放下分配图，向{b}请求一个实际容身的地方。'],
  'play-othello':['倒着核对交接时，双方发现手帕曾被移过位置。','{a}停止凭最后一双手下判断，让{b}把完整经过留下来。'],
  'play-antigone':['{a}借被命令低头的那一刻，把土覆了下去。','{a}直起身不再请求通行，{b}必须亲自决定是否抹去已经完成的告别。'],
  'play-xixiang':['送出的信原样退回，收信的人要求亲自到场。','{a}收起信，跟着{b}走向那个人，不再让传话者代替自己回答。'],
  'play-visit':['{b}发现大家嘴上拒绝，却已经照着许诺安排生活。','{b}不再借众人的沉默代答，必须亲自承担接受或拒绝的后果。'],
  'play-glass':['小兽受损之后，{b}才说明自己另有去处。','{a}没有挽留，独自替破损的小兽找一个还能站稳的位置。'],
  'xplay-seagull':['{b}把喜欢作品和答应陪伴分开回答。','{a}收回继续相邀的请求，留下完成那段无人接话的结尾。'],
  'play-rhino':['{b}放下礼物，明确拒绝继续留下。','{a}先让开通路，把是否回来留给{b}自己决定。'],
  'play-medea':['{a}摊开旧物，使这次送行无法再伪装成两不相欠。','{b}停下催促，允许{a}亲自决定怎样用完最后的停留时间。'],
  money:['账簿揭开{a}的出资背后还有未付的工钱，{b}也曾从中受益。','双方先列清欠款，决定还债以后再继续原先的计划。'],
  secret:['{b}交出藏起的那一页，洗清{a}的一项指控，也揭开知情不言的责任。','{a}保留对自己不利的记录，与{b}一起把完整材料交出去。'],
  choice:['{b}划掉最优厚的条件，宁愿损失好处也不交出选择。','{a}留下约定让{b}修改，答应下次先询问，不再替人安排。'],
  shelter:['{b}先去守住通路，把方便撤离的位置留给{a}。','{a}决定分出水和食物，双方轮流守夜，不再各自承担危险。'],
  identity:['{b}写出{a}真正的名字，表明早已识破借来的身份。','{a}收起写着假名的名牌，重新用自己的名字和理由争取机会。'],
  waiting:['信终于打开，里面没有许诺，只有不能赴约的解释。','{b}拿起行李，{a}留下整理东西，双方不再让等待决定各自的生活。'],
  warren:['{a}发现赞助中有未付的工钱，自己盼望的认可也被绑在出资条件上。','{a}决定缩小画展，{b}失去挂名的机会，拖欠的工钱仍须偿还。'],
  solo:['{a}发现要求别人解释的事，自己也从未在旧信里坦白。','{a}写下真正的问题，带着新信离开，不再让等待占去全部生活。'],
};
function storyPluralV54(text,c){
  if(quietCharacterV53(c.lead)||quietCharacterV53(c.support))text=text
    .replace(/谁都说/g,'纸上都写着').replace(/双方一边说|两人一边说/g,'双方一面写下')
    .replace(/双方说好/g,'双方以文字约好').replace(/双方都说/g,'双方都以文字表示')
    .replaceAll(`${c.a}与${c.b}说好`,`${c.a}与${c.b}以文字约好`);
  if(c.lead.id==='yrole-hamm'&&c.play.id==='play-lear')text=text.replace(`${c.a}准备坐回自己的位置，却发现图上没有替自己保留任何一处`,`${c.a}请${c.b}把图上的份额逐个读出，才听清没有给自己保留的地方`);
  if(!/三女巫|合唱队|众人|群体/.test(`${c.lead.name} ${c.support?.name||''}`))return text;
  return text.replace(/两个人/g,'双方').replace(/两人/g,'双方').replace(/两道影子/g,'几道影子').replace(/再次伸出开场时那只手/g,'又把手伸到开场时的位置').replace(/那只手/g,'伸出的手').replace(/这只手/g,'伸出的手');
}
function shareStoryBeatV54(cards){
  const c=sceneContextV40(cards);
  if(!c.support)return `${c.a}发现自己真正要问的是：${c.state.question}。${soloStoryV40(c)[4].match(/[^。]+。/)?.[0]||soloStoryV40(c)[4]}`;
  const [turn,decision]=storyDecisionsV54[storyKeyV53(c)].map(text=>sceneTextV40(text,c));
  const beat=c.state.key==='identity'&&characterStrategyV54(c.lead).key==='control'?`${c.a}要求先说清谁能使用这个名字`:sceneTextV40(characterStrategiesV54[characterStrategyV54(c.lead).key].beat,c);
  return storyPluralV54(beat+'，'+turn+decision,c);
}

// Written and physical exchanges preserve the selected conflict without giving a non-speaking character dialogue.
const quietStoriesV53={
  'play-cherry':[
    '{a}为庄园交接摆了一顿送别饭，请{b}留下见证。钥匙被放到两人中间，空着的席位看起来仍像在等待客人。',
    '{a}把交接书推过来，{b}却指着尚未吃完的饭。一个人想先完成让权，另一个人仍以为留下是被允许的。',
    '{b}伸手取回钥匙，{a}却按住不放。饭桌上的客气安排突然失效，谁是主人、谁必须离开，已经由这个动作分清。',
    '{b}把“留下的人怎么办”写在交接书的空处。{a}停下招待的动作，第一次正面处理那顿送别饭一直遮住的问题。'],
  'play-oedipus':[
    '{a}带来一份旧案记录，请{b}补出最后一段经过。两人照着记录在地上标位置，起初所有疑点都指向别处。',
    '{b}把一个标记推到{a}面前，要确认当时的位置。{a}将标记推回，仍把证词摆向另一个方向。',
    '两人重走那条路线，{a}主动纠正了一处只有在场者才知道的细节。手刚伸出去，追问便已经落回自己身上。',
    '{b}让出核对记录的位置，没有代替任何人作结论。{a}坐下，把原本准备要求别人解释的部分，逐项标在自己的名字旁。'],
  'play-hamlet':[
    '{a}给{b}看一段写好的交接过程，想从对方的反应中找出隐情。{b}把其中一个位置空出来，请{a}亲自补上。',
    '两人照着纸上的次序行动，{a}逐渐发现，自己也必须亲手完成那段原本只想用来试探别人的经过。',
    '{b}突然停住，指向被删掉的一行。{a}先把中断当成了答案，重新看过纸上的空缺后，却无法再坚持原先的判断。',
    '缺掉的内容终于被补回，{b}带走那份记录。{a}留在原处，下一次若还要追问，就必须拿出比一次停手更可靠的证据。'],
  'play-macbeth':[
    '{a}把自己的名牌摆到空着的席位前，请{b}见证。{b}没有阻止，却指向先前坐在那里的人的位置。',
    '{a}避开这个示意，只顾把名牌摆正。{b}每靠近一步，{a}就把手伸向席位，仿佛还需要再争一次。',
    '席位终于归了{a}，脚步声却不断使人回头。刚才的见证者也被挡在近处，{b}明白自己已经成了被防备的人。',
    '{b}把名牌留在原处，不再作安全的保证。到了天亮，{a}仍反复起身查看身后，想要的位置到手了，却没能安心坐下。'],
  'play-godot':[
    '{a}给没到的人留了一个位置，{b}收拾好东西等着离开。{a}又指向手边的一件小事，两人于是把行程往后推。',
    '那件事已经做完，{a}又去确认来人的方向。{b}把东西拿起再放下，离开的决定始终没有变成真正的一步。',
    '两人同时转向远处的动静，却只认出自己先前留下的标记。要等的人没来，反而又多了一件还得收回的东西。',
    '{a}与{b}都朝离开的方向点了头，脚却留在原处。最后，标记又被放回那个空位，两人仍替没来的人留着地方。'],
  'play-doll':[
    '{a}把自己的行李放到身旁，交给{b}一张列着问题的纸。{b}想沿用熟悉的安抚动作，却没有得到从前的回应。',
    '{b}逐项指着那些周全的安排，{a}则把从未征得同意的地方圈出。圈得越多，那件准备带走的行李就越难被忽略。',
    '{b}写下“一切照旧”，{a}却把这四个字单独划了出来。需要改变的不只是一项安排，还有决定什么才算正常的权利。',
    '{a}收回问题和行李，没有再交代自己的去向。{b}停在空出来的位置旁，终于不能把对方留下当作不必征求意见的事。'],
  'play-teahouse':[
    '{a}照旧摆好杯子，请{b}坐下，想让今日的生意继续。{b}却带来新的规矩，把空着的杯子又推了回来。',
    '{a}一项项调整桌上的安排，只求这位客人留下。{b}几次准备落座，又被新条件逼得站起，杯子始终没有用上。',
    '安排终于谈妥，{a}转向门口准备迎客，外面却已没有人等候。忙了一整场的让步，没能换来继续做生意的机会。',
    '{b}帮助摆完最后一只杯子，却没有坐下。{a}向空着的入口作了一个招呼的手势，等不到回应，才把杯子慢慢收回。'],
  'play-thunder':[
    '{a}按惯例接待{b}，来人却先抚过一件旧物，又在纸上写出一个被避而不谈的名字。两人都停在了那件东西旁。',
    '{a}试图把见面恢复成普通的问候，{b}却将旧物转回从前的方向。整齐的摆设里，那段被抹去的生活重新显了出来。',
    '{a}伸手盖住那个名字，这个动作反而使{b}确认，对方并没有忘记。所谓记不清，只是一直不愿让那段过去重新出现。',
    '{b}走回原先被赶开的地方，不再解释旧物。{a}若想恢复从前的安排，就得先经过这个仍站在面前的人。'],
  'play-peony':[
    '{a}递给{b}一张等候签名的纸，指向写着安全离开的那一行。{b}没有马上动笔，而是从头重新核对每一个字。',
    '纸上的内容比先前答应的更多，{b}把多出的部分指给{a}看。两人都停在那处空白，谁也不能把签名当成普通手续。',
    '{b}试着将整张纸带走，{a}立刻伸手拦下。原来需要被留下的不是事情的经过，而是一个可以展示给别人的名字。',
    '{b}收回笔，让名字停在未落下的地方。{a}必须重新处理眼前的选择：允许这个人离开，还是继续索取服从的证明。'],
  'play-salesman':[
    '{a}摊开记录成绩的本子，等着{b}给予肯定。{b}却把今天急需处理的事情摆到旁边，既没点头，也没有称赞。',
    '{a}每翻出一段过去的成绩，{b}就指向一件眼前的困难。两人都想得到回应，桌上却像放着两种互不相干的生活。',
    '{b}合上本子，写明自己达不到那些期待，也不想再靠成功证明关系。{a}等来的回应，偏偏是拒绝继续表演成功。',
    '{a}再次打开本子，却找不到能接住这个答复的一页。{b}仍留在近处，等对方放下成绩，重新看见站在面前的这个人。'],
  'play-goodperson':[
    '{a}把仅剩的物资递向{b}，递到半途却停住了。答应出去的帮助，也正是自己明天必须依靠的东西。',
    '{a}换了站姿，把先前允许的交接推开，像换了一个作主的人。{b}却指向刚才留下的承诺，不肯把责任交给一个新身份。',
    '{b}重做了一遍最初获得帮助的动作，{a}再也无法装成另一人。同一个身体，既承受索取，也承受刚才许诺的后果。',
    '{a}把物资放回两人中间，卸下那副强硬的姿态。{b}第一次看清答应帮忙的人同样没有退路，争执才转向明天究竟怎样生活。'],
  'play-lear':[
    '{a}把标出份额的图交给{b}，等待足够热切的表态。{b}没有增加讨好的动作，而是指向图外，询问分完以后谁还能留下。',
    '{a}继续划出最后一块地方，以为自己的位置无需另作安排。{b}却把已经给出去的份额一一标明，没有替对方留白。',
    '最后一块也被分出，{a}准备回到自己的位置，才发现图上已经没有属于自己的地方。先前的承诺并不能自动变成接纳。',
    '{a}放下图，向{b}伸手请求一个具体的位置。{b}是否愿意侧身相让，比开场时所有动听的表态都更能说明关系。'],
  'play-othello':[
    '{a}拿出一方手帕，请{b}解释它为何到了自己手里。{b}把几次交接的位置标出来，想让对方看完整条路线。',
    '{a}每次都停在最后一个位置，坚持那已经足够。{b}不肯让这个结尾代替全部经过，两人只好从这里倒着重走。',
    '走回一次先前无人留意的停顿，两人发现手帕曾被移过位置。东西是真的，{a}替它补上的那段故事却并不完整。',
    '{b}把手帕留在原地，请{a}先看向自己，再判断那件东西。物证还在，凭它夺走对方解释机会的把握却已经消失。'],
  'play-antigone':[
    '{a}捧着一把土，请{b}让路。{b}却将禁令举到两人中间，要求先确认哪些行动不被允许。',
    '{a}看完禁令，仍没有放下手里的土。{b}把这个坚持记录下来，原本只有一步路的请求，逐渐变成追究违令的证据。',
    '{b}示意{a}低头，{a}却借这个俯身的动作把土覆了下去。命令没有撤回，被禁止的那件事已经完成。',
    '{a}直起身，不再请求通行。{b}必须决定是否亲手抹去眼前的土，接下来的责任终于不能再交给一条抽象禁令。'],
  'play-xixiang':[
    '{a}托{b}转交一封不能公开的信，只允许送到，不允许拆开。{b}没有马上接手，先指向可能拦下这趟传递的地方。',
    '{b}一次次把信退回来，要求{a}先说明由谁承担被发现的后果。信越显得重要，传话的人就越不能被当成没有代价的帮手。',
    '信终于被送出，{b}却原样带了回来。收信的人留下短短的要求：必须亲自到场，不能再只靠一封信决定两人的未来。',
    '{a}收起信，跟着{b}走向原先不敢靠近的位置。最后的答复没有留在纸上，必须由在场的人看清彼此是否愿意继续。'],
  'play-visit':[
    '{a}提出一项有回报的条件，请{b}转告其他人。{b}当场拒绝，却没有退回写着许诺的那张纸。',
    '{b}开始安排许诺兑现后的生活，仍坚持没有答应。{a}指向这些安排，等待对方说明谁将为它们承担代价。',
    '{b}发现每个人都在等别人先表示同意，自己先前的拒绝已经被略过去。好处的去向清清楚楚，责任却始终没有主人。',
    '{a}将条件原样摆回面前，{b}这次不能借大家的沉默代答。那些已经开始享用的好处，仍在等一个明确负责的名字。'],
  'play-glass':[
    '{a}拿出平日藏着的小兽给{b}看，容许对方靠近自己的角落。{b}小心接住，那点珍藏第一次离开了原来的位置。',
    '{b}邀请{a}试着走出来，两人的距离缩短了。{a}暂时忘记护住小兽，一个没有留意的动作使它受了损。',
    '{b}把自己另有去处的消息留在纸上，{a}才知道这次靠近并不是新的承诺。破损的珍藏与不得不接受的离别同时留了下来。',
    '{a}没有阻拦{b}离开，独自给小兽找一个还能站稳的位置。来客走远后，这个微小的整理动作仍在继续。'],
  'xplay-seagull':[
    '{a}为{b}准备了一段新作，递出评看的邀请。表面等的是意见，真正希望得到的却是对方愿意留下的表示。',
    '{b}认真给出意见，{a}却把每处修改都看成拒绝。那段已经完成的东西被一次次重新摆开，答复仍没有到达彼此想要的位置。',
    '{b}把喜欢作品与答应陪伴分成两项，分别作了回答。{a}才看清，自己一直用一个问题索取另一个问题的答案。',
    '{b}离开观看的位置，{a}没有再重复邀请。那段无人接话的结尾仍留着，这一次必须由自己把它完成。'],
  'play-rhino':[
    '{a}把礼物交给{b}，表示不需要回报，身体却挡住了离开的方向。{b}没有把收下东西当成答应留下。',
    '{a}将为对方做过的事一项项列出，{b}却只指向被挡住的路。每多一份付出，能退开的距离反而更少。',
    '{b}把礼物放下，重新标明自己的选择。{a}终于无法把客气或沉默再算成期待中的同意，交接停在了明确的拒绝上。',
    '{a}必须先让开一步，才能知道{b}是否还愿意回来。两人没有拥抱收场，留下的通路比礼物与表白更需要被看见。'],
  'play-medea':[
    '{a}将行李放到门边，请{b}容许最后一点停留。{b}点头，以为只要给出这个期限，这次送行就算足够体面。',
    '{a}逐件取出曾经共同使用的东西，{b}却只指向离开的时间。一个人正在清算过去，另一个人只想尽快完成送行。',
    '{a}突然把行李全部摊开，拒绝让共同生活被一次整齐的搬走遮住。{b}才发现，允许停留并不能替对方决定怎样使用这段时间。',
    '{b}停下催促，{a}仍没把旧物放回去。那些曾经共同用过的东西留在中间，这场驱逐再也无法被包装成两不相欠。'],
  money:[
    '{a}带着一笔钱来资助{b}，却不愿留下姓名。{b}把账簿翻开，请对方先写明来处，再决定这笔钱能不能接。',
    '{a}把数目一再加大，{b}却指向同页的欠账。原来想靠慷慨换来的认可，并不能让别人一直拿不到的报酬消失。',
    '{a}在账旁标出自己也曾受益的部分，{b}也不能再把责任全推给出资人。一本账簿把两人的牵连并排留了下来。',
    '两人先列清欠款，再讨论余下的钱能做什么。没有谁在账上写下清白的结论，原先的计划只能等债务被处理以后继续。'],
  secret:[
    '{a}带来缺页的{record}，请{b}帮助查明{incident}的经过。{b}辨认出了纸上的字，却避开了中间那一处空白。',
    '{a}逐项标出日期，{b}记得无关紧要的细节，却偏偏略过决定责任的那天。不补上这一页，就还会有人替他们承担后果。',
    '{b}终于交出藏起的那一页。它证明{a}没有做过被指控的事，也留下了当时明知真相却选择不介入的记录。',
    '{a}把散页装回去，保留了对自己不利的部分。{b}陪着将完整记录交出，两人没有要求立刻被原谅，但下一个人不必再靠猜测补完真相。'],
  choice:[
    '{a}带来一份已经写好的约定，请{b}签下名字。{b}从头看完，才发现这份周全的未来里没有一项经过自己的同意。',
    '{a}指着那些优厚的条件，{b}却在旁边写下一个问题：如果拒绝，关系是否仍能继续。原先顺利的安排停在这里。',
    '{b}划掉最有利的一项，宁愿承担损失，也不肯把选择交出去。{a}第一次看到，给予得更多并不意味着能替对方决定。',
    '{a}留下约定让{b}修改，带走未被接受的礼物。第二天的回信只有一项新条件：下次先询问，而不是先安排。'],
  shelter:[
    '{a}守着仅剩的储备，打算独自撑过这一夜。{b}请求分走一半，却拿不出能立即兑现的交换条件。',
    '两人把东西摆到中间，{a}仍没有松手。{b}指向自己已经无处可去的方向，那份拒绝也因此变得不再轻松。',
    '外面的动静逼近，{b}先担起一件危险的事。{a}看见眼前的人并非只来索取，独自保住储备也未必能保住安全。',
    '两人重新分好今夜要用的东西，没有许下长久的保证。天亮时储备比从前更少，{a}却不必再独自确认门外的动静。'],
  identity:[
    '{a}借用另一个名字来见{b}，起初很容易便获得了接纳。{b}随后取出与那个名字有关的旧物，等待对方辨认。',
    '{a}试图补出更多细节，{b}却把疑问标得越来越具体。借来的名声连着一段自己没有经历过的过去，无法只取好处。',
    '{b}写下{a}真正的名字，表明早已识破，只是在等对方何时停止。那份以为已经赢来的尊重，原来始终没有真正到手。',
    '{a}收起写着假名的名牌，重新留下自己的名字与来意。{b}没有保证给予相同的机会，却肯继续看完这个不再借别人经历的理由。'],
  waiting:[
    '{a}与{b}守着刚刚送到的信，谁都没有先拆。两人知道它可能结束等待，却各自把开信的机会让给对方。',
    '{a}准备着收到好消息后的日子，{b}却把离开的东西放到近处。两人看起来都能接受结果，实际只准备了自己愿意面对的那一种。',
    '信终于打开，里面没有承诺，只解释了迟迟没有答复的原因。{b}承认早已猜到，只是不愿先打破两人共同维持的希望。',
    '两人完整看完信，没再替寄信的人补上借口。{b}拿起行李，{a}留下整理那些为未来准备的东西，离开与留下终于成为各自的选择。'],
  warren:[
    '{a}带着一幅画来到{place}，想办一次小展览。{b}愿意出资，却在约定上写下要求：展览必须挂自己的名字。',
    '{a}发现账簿里还压着几笔未付的工钱，把那些名字指给{b}看。{b}则把展览费用推回面前，询问拒绝这笔钱后由谁补上。',
    '{a}没有否认自己也曾接受同样来路的钱。{b}指出这份牵连，却不能因此划掉账上的欠款，两人的理由都遇到了实在的代价。',
    '{a}带回画，决定缩小展览规模。{b}失去挂名的机会，工钱仍须偿还，谁也不能靠这次交接把责任推给等候报酬的人。'],
};

function quietStoryV53(c){
  const beats=quietStoriesV53[storyKeyV53(c)];
  return beats.map(text=>sceneTextV40(text,c));
}


function soloStoryV40(context){
  const {play,lead,place,method,style,state,prop}=context,a=lead.name;
  const opening=storySpacesV54[place.id]?.[0]||'来路只剩一条，离开以前必须把手边的东西收好。';
  const space=place.id==='place-v21-diningcar'?'列车仍在行进，窄桌放不下太多东西，见面也不能无限拖延。':opening.replace(/\{a\}/g,a).replace(/\{b\}/g,'未到的来客').replace(/双方/g,a);
  const methodBeat=/定格|静场/.test(method.name)?`${method.name}般的一次停顿留住了${a}。伸向${prop}的手没有继续，先前被匆忙略过的那句要求终于被重新读完。`
    :/光|暗|纱|影/.test(method.name)?`${method.name}改变了信纸上的亮处。${a}挪动纸页，原先藏在折痕里的“必须”二字露出来，才发现请求已经被自己写成了命令。`
    :/形体|手势|无言|身体/.test(method.name)?`${a}经历了一次${method.name}：手伸向${prop}又收回。信还没有寄出，身体已经暴露了自己其实并未准备好承担答复。`
    :/跌|倒|打斗|急奔/.test(method.name)?`${a}起身太急，一次${method.name}打断了离开的动作。扶稳手边的${prop}以后，信上催促别人的话也被划掉了一句。`
    :/声音|画外音|旁唱|伴唱|齐唱|对白|独白|拟音|台词/.test(method.name)?`${method.name}把旧日的声音带回耳边。${a}对照当时留下的文字，发现自己只记住了愿意听的半句，便把漏掉的限制补回新信。`
    :/蒙太奇|时间|重演|重复|回环|镜像|记忆/.test(method.name)?`${a}借${method.name}把新旧两封信并排放好。同一个要求在两次书写里换了条件，谁也不能替这处改动解释，只有自己。`
    :/空间|地面|升降|车台|门|上下场|换景|水池/.test(method.name)?`${method.name}使原先顺手的通路改变了。${a}先给${prop}找一处能放稳的位置，才重新盘算怎样带着它继续生活。`
    :/字幕|读提示|复述|叙述|同句|间离|假定/.test(method.name)?`${a}用${method.name}重新核对信上的条件，把承诺和猜测分开。那句一直被当成答应的话，原来从未写进收到的回信。`
    :`${a}在${method.name}中重新安排${prop}与信纸的位置：要带走的留在近处，要等待别人同意的留出空白。这个动作迫使自己分清已经决定与仍在索取的事。`;
  const styleBeat=/荒诞|极简/.test(style.name)?`等待露出${style.name}的循环：${a}又写下“明天再说”，上一页却也是同样的话。这一次终于给等待写上日期。`
    :/书信|读剧|逐字|法庭|悬疑/.test(style.name)?`${style.name}让字句本身成了阻力。${a}逐项核对旧信，把没有获得的答应从自己的计划里删去。`
    :/声音|广播|轻歌|文乐/.test(style.name)?`${style.name}般的声响使${a}几次抬头，随后脚步又远去。没有回信到来，猜作好消息的动静只剩普通的声音。`
    :/身体|手语|感官|舞剧|视觉|写意/.test(style.name)?`${style.name}把迟疑留在动作里。${a}迟迟没有封好信，最后先把一项自己也不肯承担的条件划掉。`
    :/政治|史诗|历史|批判|市民|现实/.test(style.name)?`${style.name}使${a}想到信外的日子：一个答应会占用别人的劳动与时间。新信里因此先写自己愿意承担的一份。`
    :`${style.name}让${a}重新面对${state.question}。这一次不替没有回信的人作答，只在信上写清自己的选择与愿意付出的代价。`;
  const endings={
    money:`${a}在新信里列出欠款，决定先处理债务，再继续原先的计划，不再让善意替未付的报酬作掩护。`,
    secret:`${a}把对自己不利的那页也放进信封，决定交出完整记录。真相不再只用来替自己辩护。`,
    choice:`${a}划掉替别人安排的条款，只寄出一份可以拒绝的请求。关系能否继续，交给下一次真正的答复。`,
    shelter:`${a}没有把水与干粮全部收走，而是留下另一份，决定先守住今晚的通路。`,
    identity:`${a}收起借来的名牌，在新信上留下自己的名字，接受这可能换不来从前的机会。`,
    warren:`${a}把${prop}收好，在信里拒绝以拖欠的工钱作赞助，决定先缩小展览规模。`,
    'play-doll':`${a}拿起自己的行李，把去向写进新信，决定不再用等候回信推迟离开。`,
    'play-antigone':`${a}收好信，仍捧着那一把土，决定先完成自己必须承担的告别。`,
  };
  const ending=endings[state.key]||`${a}把真正的问题写进新信，决定不再把沉默当作同意。该带走的${prop}被仔细收好，收信人的答复则仍留着空白。`;
  return [
    `故事联想：取意于《${play.name}》，以下为虚构的新故事。${a}独自在${place.name}等回信，手边留着${prop}。${space}`,
    `${a}把第二封信写了又改，真正要问的是：${state.question}。${a}最不肯放下的，是${characterStrategyV54(lead).priority}；却发现自己还没有把这件事向收信的人说明。`,
    methodBeat,styleBeat,ending,
  ].map(text=>storyPluralV54(text,context));
}
function theatreReadingV40(context){
  const {play,style,method,arc}=context;
  if(play.id==='yplay-mrswarren'){
    const radio=/广播|声音/.test(style.name)?'广播剧让门外催账的声音进入故事：人物看不见那些劳动者，却无法再装作他们不存在。':`“${style.name}”影响的是这场争执被感受到的方式，核心仍是人物肯为自己的主张付出什么代价。`;
    return `戏剧线索：《华伦夫人的职业》中，薇薇理解母亲早年的贫困处境，却不能接受她仍继续经营妓院获利，最终选择经济独立。作品把贫困如何限制选择、获利以后是否仍要负责，放进同一场母女争论。这则联想把问题转给接受赞助的人：拒绝一笔钱之后，能否承担自己的选择？${radio}`;
  }
  const theme=arc.premise?`《${play.name}》提供的联想入口，是${arc.premise}。`:`这则故事从《${play.name}》延伸出一个问题：当愿望需要别人付出代价时，谁有权决定？`;
  const firstSentence=text=>copySentenceV39((String(text||'').match(/[^。！？]+[。！？]?/g)||[]).find(sentence=>!/^一种舞台手段[。！？]?$/.test(sentence.trim()))||'');
  const note=firstSentence(style.note||style.blurb);
  const methodNote=firstSentence(method.note||method.blurb);
  return `戏剧线索：${copySentenceV39(play.note||play.blurb)}${theme}${note?`${style.name}：${note}`:''}${methodNote?`${method.name}的具体含义是：${methodNote}`:'人物是否改变决定，仍要从愿望、阻力和代价之间的关系来理解。'}`;
}
function nn(cards){
  const c=sceneContextV40(cards),{play,arc,a,b}=c;
  if(!c.support)return soloStoryV40(c);
  const quiet=quietCharacterV53(c.lead)||quietCharacterV53(c.support);
  if(quiet){
    const [opening,exchange,reveal,ending]=quietStoryV53(c),space=storyPlaceV40(c);
    return [`故事联想：取意于《${play.name}》，以下跨作品相遇与事件均为虚构。${space.open}${opening}`,
      exchange+storyCharacterChoicesV54(c)+storyStyleV40(c),
      (c.method.id==='dir-v21-endingloop'?'':storyMethodV40(c))+reveal,
      space.turn+storyConsequencesV54(c),
      (c.method.id==='dir-v21-endingloop'?storyMethodV40(c):'')+ending].map(text=>storyPluralV54(text,c));
  }
  if(play.id==='yplay-mrswarren'){
    const [opening,exchange,reveal,ending]=warrenStoryV40(c);
    return [opening,exchange+storyCharacterChoicesV54(c)+storyStyleV40(c),reveal,
      storyPlaceV40(c).turn+storyConsequencesV54(c),ending].map(text=>storyPluralV54(text,c));
  }
  const space=storyPlaceV40(c);
  return [
    `故事联想：取意于《${play.name}》，以下跨作品相遇与事件均为虚构。${space.open}${sceneTextV40(arc.opening,c)}`,
    sceneTextV40(arc.exchange,c)+storyCharacterChoicesV54(c)+storyStyleV40(c),
    (c.method.id==='dir-v21-endingloop'?'':storyMethodV40(c))+sceneTextV40(arc.reveal,c),
    space.turn+storyConsequencesV54(c),
    (c.method.id==='dir-v21-endingloop'?storyMethodV40(c):'')+sceneTextV40(arc.ending,c),
  ].map(text=>storyPluralV54(text,c));
}
function shortScene(cards){
  const c=sceneContextV40(cards),{play,place,arc,support,a,b}=c;
  const first=text=>text.match(/[^。！？]+[。！？]?/)?.[0]||'';
  if(!support){
    const paragraphs=soloStoryV40(c),decision=shareStoryBeatV54(cards);
    let text=`故事联想：取意于《${play.name}》，以下为虚构故事。${a}独自在${place.name}等回信。`;
    for(const effect of [first(paragraphs[2]),first(paragraphs[3])])if((text+effect+decision).length<=320)text+=effect;
    return text+decision;
  }
  const intro=`故事联想：取意于《${play.name}》，在${place.name}虚构一次跨作品相遇。`;
  const decision=shareStoryBeatV54(cards);
  const effects=[first(storyMethodV40(c)),first(storyStyleV40(c)),first(storyPlaceV40(c).turn)];
  let text=intro;
  // Keep whole sentences. The decision has priority over decorative detail.
  for(const effect of effects)if((text+effect+decision).length<=320)text+=effect;
  return storyPluralV54(text+decision,c);
}
// Titles follow the same story branches as nn; card IDs keep replays and posters stable.
const storyTitlesV52 = {
  'play-cherry': [
    "这顿送别饭，谁还能留下",
    "钥匙易手，客气话还没说完",
    "请你入席，也请你搬走",
    "一次点头换走了整座园子",
    "主人的位置在饭桌上换了",
    "把感谢咽下去的人",
    "盛情款待到了交钥匙的时候",
    "送别的人不肯说送别",
  ],
  'play-oedipus': [
    "请你解释，你为何记得这么清楚",
    "问到最后，轮到自己作证",
    "那天你也站在那里",
    "纠正一句话，露出一个人",
    "审问者坐进了空位",
    "追问者也得解释自己的过去",
    "想查清别人，先说清自己",
    "一条旧路走回了自己面前",
  ],
  'play-hamlet': [
    "试探别人的人也被请上台",
    "停演还不能算作认罪",
    "那句被删掉的话要重演",
    "先把自己的指控演完",
    "一场戏能证明多少事",
    "补回一句，指控就站不住了",
    "看戏可以，请先拿出证据",
    "重演一次，指控却没了把握",
  ],
  'play-macbeth': [
    "名牌摆正了，人却坐不稳",
    "位置归你，脚步声归谁",
    "刚刚作证的人也要防备",
    "争来的席位留不住安静",
    "到了天亮，也没坐得安心",
    "把名牌留下，把保证带走",
    "原来坐在那里的人呢",
    "席位是我的，身后却不敢交给你",
  ],
  'play-godot': [
    "小事做完了，离开仍得再等",
    "留给来人的位置还空着",
    "拿起又放下的离开",
    "来的只是我们留下的标记",
    "走之前，还得再等一会儿",
    "两个人同意了，谁也没有走",
    "东西都收好了，位置还留着",
    "等的人没来，走的人没走",
  ],
  'play-doll': [
    "照料得越周全，行李越必要",
    "挽留的话落在了空位上",
    "谁有权决定一切照旧",
    "熟悉的称呼留不住一个人",
    "行李旁边的一次平等谈话",
    "请别替我安排留下的理由",
    "离开之前，把关系说清楚",
    "你说照旧，我拿回行李",
  ],
  'play-teahouse': [
    "规矩谈妥了，客人却散了",
    "杯子摆好了，谁来坐下",
    "最后一声招呼无人应答",
    "让了一整场，没留住一桌人",
    "旧声音招呼不了新日子",
    "为了让你坐下，改了多少规矩",
    "把最后一只杯子收回去",
    "还想照旧做一日生意",
  ],
  'play-thunder': [
    "那件旧物认得来客",
    "重逢不能再说成初见",
    "不准开口的人还记得",
    "家具转回去，旧事露出来",
    "那个名字为何不能再提",
    "忘记的人急着结束谈话",
    "被赶开的地方有人站回去了",
    "想恢复原样，先经过这个人",
  ],
  'play-peony': [
    "名字可以签，纸却不能带走",
    "读到最后，平安另有价钱",
    "伸手拦住的究竟是纸还是人",
    "我的名字要给谁看",
    "口头答应的没有纸上那么多",
    "空着的签名留住了回答",
    "要放人走，还是要人服从",
    "笔还未落，条件已经变了",
  ],
  'play-salesman': [
    "合上成绩册，听我说今天",
    "辉煌的旧事盖住了眼前",
    "不成功，还能不能叫我的名字",
    "那一页写不下今天的生活",
    "我来认输，你还在等捷报",
    "不用成绩开头的一次相认",
    "成功的故事终于演不下去了",
    "本子翻开后，没有话可接",
  ],
  'play-goodperson': [
    "换了口气，承诺还在原地",
    "答应帮你的人也没有退路",
    "最后一份东西放在两人中间",
    "那句温柔的话是谁说的",
    "明天的生计来追今天的善意",
    "两副面孔分不了一份储备",
    "认出了你，也认出了你的为难",
    "先别争谁好，先说怎样活",
  ],
  'play-lear': [
    "把地方分完，才想起自己",
    "一张图分完，自己留在哪里",
    "动听的话换不来一个座位",
    "分给你的地方，能让我待吗",
    "誓言说完了，谁肯侧身",
    "把爱量完以后无处容身",
    "请求一个地方比表白更难",
    "最后一块划出去之后",
  ],
  'play-othello': [
    "手帕是真的，故事却不全",
    "先问人，再看那件东西",
    "倒着走一遍，谁移动了证据",
    "最后一双手不是全部经过",
    "你没看见的那次停顿",
    "证物还在，把握却不在了",
    "一方手帕抢走了谁的回答",
    "伸手之前，让人把话说完",
  ],
  'play-antigone': [
    "低下头，做完被禁止的事",
    "命令还在，土已经覆下",
    "读完禁令也没有放下双手",
    "让人低头，未必让人服从",
    "这一捧土，要由谁抹去",
    "不再请求通行的人直起身",
    "一句请求被改成违令的证据",
    "禁令之后，还有谁的下一步",
  ],
  'play-xixiang': [
    "信送到了，话还得当面说",
    "转交可以，代价由谁来担",
    "不能公开的信被原样退回",
    "收信的人要亲耳听见名字",
    "最后一句没有写在纸上",
    "别让传话的人替你走完",
    "收起信，走到那个人面前",
    "一封信来回，谁也不能缺席",
  ],
  'play-visit': [
    "嘴上拒绝，日子已经安排好",
    "好处收下了，同意谁来说",
    "请把条件原样再念一遍",
    "人人等着别人先答应",
    "留着许诺的人说没答应",
    "沉默替谁签下了同意",
    "拒绝怎么成了可以略过的话",
    "代价在场，等一个名字",
  ],
  'play-glass': [
    "靠近了一步，小兽留下了伤",
    "以为是开始，听见的是告别",
    "来客另有去处，珍藏留下裂痕",
    "替破损的小兽找一个位置",
    "那次靠近没有许诺留下",
    "你走以后，还得让它站稳",
    "珍藏给人看过，就有了伤痕",
    "替一次相遇找个站稳的地方",
  ],
  'xplay-seagull': [
    "请你评戏，其实想问你留不留",
    "喜欢这出戏，不等于留下",
    "演完的戏又开了一次幕",
    "一句评论被听成了拒绝",
    "作品和爱情各等一个回答",
    "用一个问题索取另一个答案",
    "幕布仍开着，邀请却停了",
    "无人接话的结尾自己演完",
  ],
  'play-rhino': [
    "礼物放下以后，请让路",
    "不必回答，为何不许离开",
    "每多说一份付出，少一步退路",
    "客气不能替人答应",
    "给出去的礼物换不来同意",
    "让开这一步，才知道会不会回来",
    "拒绝的人已经说得很清楚",
    "通路比表白更需要留下",
  ],
  'play-medea': [
    "行李打开了，送行停下来",
    "允许再留一会儿以后",
    "旧东西拿出来，旧承诺算清楚",
    "体面的送行藏着驱逐",
    "你在催离开，我在算从前",
    "留给我的时间，由我来用",
    "共同用过的东西还没收完",
    "搬走以后也不是两不相欠",
  ],
  'money': [
    "欠款还在，称赞请等一等",
    "钱可以匿名，来路不能",
    "一笔出资翻出了另一笔欠债",
    "慷慨的人也曾靠这笔钱生活",
    "收钱的人不能只问数目",
    "继续花钱以前，先把欠账列清",
    "两个人都写不出清白的结论",
    "原先的计划要等还债以后",
  ],
  'secret': [
    "洗清嫌疑，却说不清沉默",
    "记得每件小事，忘了那一天",
    "无辜的人还在替谁承担",
    "完整的记录，两个人一起交",
    "对自己不利的那页也留下",
    "追问会失去你，不问会冤枉谁",
    "藏起来的真相救不了沉默的人",
    "交出全部以后，还能被原谅吗",
  ],
  'choice': [
    "为我安排的未来，请先问过我",
    "最优厚的那一条被划掉了",
    "不接受好意，还能不能相处",
    "带走礼物，把修改权留下",
    "回信只添了一项新条件",
    "周全的约定里没有我的意思",
    "宁肯失去好处，也要自己决定",
    "关心说到最后成了支配",
  ],
  'shelter': [
    "储备分少了，危险有人共担",
    "拿不出交换的东西，却肯担起危险",
    "拒绝容易，今夜却难安睡",
    "求收留的人先担起了危险",
    "天亮后少了储备，多了同伴",
    "各守一份，也未必过得了今夜",
    "谁在施舍，谁在保护谁",
    "只约定今夜怎样一起过",
  ],
  'identity': [
    "借来的名声要偿还谁的过去",
    "那个名字有你没活过的日子",
    "早就认出你，只等你停下来",
    "收起名牌，再争一次机会",
    "细节编得越多，问题越具体",
    "以自己的名字重新介绍",
    "尊重里藏着一场漫长的等待",
    "没有借来的经历，还剩什么理由",
  ],
  'waiting': [
    "信已经到了，谁敢先拆",
    "备好未来的人等来一段解释",
    "希望是两个人一起瞒住的",
    "一人准备明天，一人准备离开",
    "读完这封信，就别再找借口",
    "等到了回信，没等到承诺",
    "行李拿起后，等待才结束",
    "不同的答案要各自承受",
  ],
  'solo': [
    "等不到回信，先读懂自己的信",
    "第二封信不再替对方作答",
    "催别人解释的人也没有坦白",
    "把省去的条件补回信里",
    "天亮以前，把真正的问题写下",
    "信封里终于放进自己的选择",
    "沉默不是寄给我的保证",
    "回信未到，生活可以先走",
  ],
  'warren': [
    "画展的名字，账上的工钱",
    "愿意赞助的人为何还欠着钱",
    "把画带回去，把欠薪留下来算",
    "拒绝这笔钱，谁来缩小愿望",
    "一场展览抵不了几笔欠账",
    "画还没挂，名字先谈好了",
    "失去挂名以后仍要还债",
    "不能用别人的工钱换认可",
  ],
};

function dramaticTitleV40(cards){
  const c=sceneContextV40(cards);
  const group=Object.keys(storySeedsV40).find(key=>storySeedsV40[key]===c.arc);
  const key=!c.support?'solo':c.play.id==='yplay-mrswarren'?'warren':sceneArcsV40[c.play.id]?c.play.id:group;
  const titles=storyTitlesV52[key];
  const seed=[c.play,c.style,c.method,c.lead,c.support,c.place].map(card=>card?.id||'').join('|');
  let hash=2166136261;
  for(const char of seed)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
  const title=sceneTextV40(titles[hash%titles.length],c);
  const located=`${c.place.name}｜${title}`;
  return located.length<=35?located:title;
}
// v55 titles are admitted by story and character action before deterministic selection.
const storyTitlesV55=[
  {
    "branch": "play-cherry",
    "actor": "lead",
    "strategy": "control",
    "title": "留人吃饭的人，连留下的资格也要管",
    "anchor": "钥匙"
  },
  {
    "branch": "play-cherry",
    "actor": "support",
    "strategy": "autonomy",
    "title": "钥匙可以交出，去留不能代签",
    "anchor": "钥匙"
  },
  {
    "branch": "play-cherry",
    "actor": "lead",
    "strategy": "aid",
    "title": "让出一个座位，还欠一个容身之处",
    "anchor": "钥匙"
  },
  {
    "branch": "play-cherry",
    "actor": "support",
    "strategy": "memory",
    "title": "还留着旧日生活，已经不能替留下作主",
    "anchor": "钥匙"
  },
  {
    "branch": "play-oedipus",
    "actor": "lead",
    "strategy": "truth",
    "title": "连自己的空白也不能略过",
    "anchor": "证"
  },
  {
    "branch": "play-oedipus",
    "actor": "lead",
    "strategy": "privacy",
    "title": "想留下的秘密，偏在证词里有了位置",
    "anchor": "证"
  },
  {
    "branch": "play-oedipus",
    "actor": "support",
    "strategy": "principle",
    "title": "换到证人的位置，还认不认同一条规矩",
    "anchor": "证"
  },
  {
    "branch": "play-oedipus",
    "actor": "lead",
    "strategy": "grievance",
    "title": "追问旧责的人，被旧事叫住了",
    "anchor": "证"
  },
  {
    "branch": "play-hamlet",
    "actor": "lead",
    "strategy": "truth",
    "title": "给疑心排的戏，还欠一份证据",
    "anchor": "戏"
  },
  {
    "branch": "play-hamlet",
    "actor": "support",
    "strategy": "autonomy",
    "title": "被试探的人，决定让戏停在哪句",
    "anchor": "戏"
  },
  {
    "branch": "play-hamlet",
    "actor": "lead",
    "strategy": "control",
    "title": "连交接都要掌握，却管不住那句原话",
    "anchor": "戏"
  },
  {
    "branch": "play-hamlet",
    "actor": "support",
    "strategy": "recognition",
    "title": "要我接受指控，请先留下完整的台词",
    "anchor": "戏"
  },
  {
    "branch": "play-macbeth",
    "actor": "lead",
    "strategy": "control",
    "title": "席位归自己，安稳却没有一并交来",
    "anchor": "位置"
  },
  {
    "branch": "play-macbeth",
    "actor": "support",
    "strategy": "loyalty",
    "title": "替你守住关系，却不能保证你安心",
    "anchor": "位置"
  },
  {
    "branch": "play-macbeth",
    "actor": "lead",
    "strategy": "privacy",
    "title": "身后的事遮住了，席位仍坐不安稳",
    "anchor": "位置"
  },
  {
    "branch": "play-macbeth",
    "actor": "support",
    "strategy": "truth",
    "title": "名牌能证明席位，不能证明安全",
    "anchor": "位置"
  },
  {
    "branch": "play-godot",
    "actor": "lead",
    "strategy": "urgency",
    "title": "最急的是离开，最后却保留了空位",
    "anchor": "标记"
  },
  {
    "branch": "play-godot",
    "actor": "lead",
    "strategy": "hope",
    "title": "把保证留空，还给未来留着地方",
    "anchor": "标记"
  },
  {
    "branch": "play-godot",
    "actor": "support",
    "strategy": "loyalty",
    "title": "不愿催散相伴，也不愿替等待点头",
    "anchor": "标记"
  },
  {
    "branch": "play-godot",
    "actor": "support",
    "strategy": "livelihood",
    "title": "休息的时间划好了，等候还没有结束",
    "anchor": "标记"
  },
  {
    "branch": "play-doll",
    "actor": "lead",
    "strategy": "autonomy",
    "title": "行李可以暂存，生活不能交人保管",
    "anchor": "行李"
  },
  {
    "branch": "play-doll",
    "actor": "lead",
    "strategy": "aid",
    "title": "先给你让座，再把自己的行李带走",
    "anchor": "行李"
  },
  {
    "branch": "play-doll",
    "actor": "support",
    "strategy": "control",
    "title": "挽留写了许多条，偏没有平等这一条",
    "anchor": "行李"
  },
  {
    "branch": "play-doll",
    "actor": "support",
    "strategy": "memory",
    "title": "从前的照料，不能替今天决定去留",
    "anchor": "行李"
  },
  {
    "branch": "play-teahouse",
    "actor": "lead",
    "strategy": "livelihood",
    "title": "想保住明日生计，今天的杯子却空了",
    "anchor": "杯"
  },
  {
    "branch": "play-teahouse",
    "actor": "lead",
    "strategy": "aid",
    "title": "位置已经让好，留下的人仍不肯入席",
    "anchor": "杯"
  },
  {
    "branch": "play-teahouse",
    "actor": "lead",
    "strategy": "control",
    "title": "每条规矩都改过，生意却没有答应",
    "anchor": "杯"
  },
  {
    "branch": "play-teahouse",
    "actor": "support",
    "strategy": "loyalty",
    "title": "愿意再相见，救不了今天这桌生意",
    "anchor": "杯"
  },
  {
    "branch": "play-thunder",
    "actor": "lead",
    "strategy": "privacy",
    "title": "私事压在手下，旧物却认出了来客",
    "anchor": "旧物"
  },
  {
    "branch": "play-thunder",
    "actor": "support",
    "strategy": "grievance",
    "title": "今天可以重逢，昨天不能一笔勾销",
    "anchor": "旧物"
  },
  {
    "branch": "play-thunder",
    "actor": "lead",
    "strategy": "control",
    "title": "位置仍由你安排，记忆已经不听命令",
    "anchor": "旧物"
  },
  {
    "branch": "play-thunder",
    "actor": "support",
    "strategy": "memory",
    "title": "把旧日另留一页，也给自己留个位置",
    "anchor": "旧物"
  },
  {
    "branch": "play-peony",
    "actor": "support",
    "strategy": "autonomy",
    "title": "空着的签名，是我亲自留下的答案",
    "anchor": "纸"
  },
  {
    "branch": "play-peony",
    "actor": "lead",
    "strategy": "control",
    "title": "既要名字，也想保管这个名字的用途",
    "anchor": "纸"
  },
  {
    "branch": "play-peony",
    "actor": "support",
    "strategy": "truth",
    "title": "纸上的承诺，要对得上刚才的条件",
    "anchor": "纸"
  },
  {
    "branch": "play-peony",
    "actor": "support",
    "strategy": "principle",
    "title": "换你来签，也肯留下这个名字吗",
    "anchor": "纸"
  },
  {
    "branch": "play-salesman",
    "actor": "lead",
    "strategy": "recognition",
    "title": "想被认真对待，却只肯收下好成绩",
    "anchor": "本子"
  },
  {
    "branch": "play-salesman",
    "actor": "support",
    "strategy": "loyalty",
    "title": "成绩可以认输，来往不该跟着作废",
    "anchor": "本子"
  },
  {
    "branch": "play-salesman",
    "actor": "lead",
    "strategy": "memory",
    "title": "过去另铺一页，今天却写不进那本册子",
    "anchor": "本子"
  },
  {
    "branch": "play-salesman",
    "actor": "support",
    "strategy": "livelihood",
    "title": "没有成功的消息，只有必须过下去的日子",
    "anchor": "本子"
  },
  {
    "branch": "play-goodperson",
    "actor": "lead",
    "strategy": "aid",
    "title": "愿意先让一回，也得留住明天的一份",
    "anchor": "物资"
  },
  {
    "branch": "play-goodperson",
    "actor": "lead",
    "strategy": "livelihood",
    "title": "生计只剩一份，答应过的话却有两种",
    "anchor": "物资"
  },
  {
    "branch": "play-goodperson",
    "actor": "support",
    "strategy": "truth",
    "title": "换了面孔，同一句承诺仍认得出来",
    "anchor": "物资"
  },
  {
    "branch": "play-goodperson",
    "actor": "lead",
    "strategy": "privacy",
    "title": "另藏一页私事，也藏不住同一个人",
    "anchor": "物资"
  },
  {
    "branch": "play-lear",
    "actor": "lead",
    "strategy": "control",
    "title": "分配都经自己确认，自己却没有份额",
    "anchor": "图"
  },
  {
    "branch": "play-lear",
    "actor": "support",
    "strategy": "aid",
    "title": "先给人一点方便，最后却要接住无处容身",
    "anchor": "图"
  },
  {
    "branch": "play-lear",
    "actor": "lead",
    "strategy": "recognition",
    "title": "要过那么多认可，最后只求一个地方",
    "anchor": "图"
  },
  {
    "branch": "play-lear",
    "actor": "support",
    "strategy": "autonomy",
    "title": "分给我的地方，不等于替我答应收留",
    "anchor": "图"
  },
  {
    "branch": "secret",
    "actor": "lead",
    "strategy": "privacy",
    "title": "留给自己的秘密，正好堵住别人的清白",
    "anchor": "记录"
  },
  {
    "branch": "secret",
    "actor": "lead",
    "strategy": "urgency",
    "title": "急着洗清嫌疑，也得把不利的那页留下",
    "anchor": "记录"
  },
  {
    "branch": "identity",
    "actor": "lead",
    "strategy": "memory",
    "title": "另留一页自己的往事，才知道假名借走了什么",
    "anchor": "名牌"
  },
  {
    "branch": "identity",
    "actor": "support",
    "strategy": "loyalty",
    "title": "不愿断了来往，也不替假名留下位置",
    "anchor": "名牌"
  },
  {
    "branch": "play-antigone",
    "actor": "lead",
    "strategy": "loyalty",
    "title": "不能替告别点头，也不能让禁令代答",
    "anchor": "土"
  },
  {
    "branch": "play-antigone",
    "actor": "support",
    "strategy": "control",
    "title": "规矩留在纸上，土已经留在地上",
    "anchor": "土"
  },
  {
    "branch": "play-antigone",
    "actor": "lead",
    "strategy": "principle",
    "title": "同一条责任，不能只要求别人承担",
    "anchor": "土"
  },
  {
    "branch": "play-antigone",
    "actor": "support",
    "strategy": "autonomy",
    "title": "要求别人服从以后，轮到自己选择",
    "anchor": "土"
  },
  {
    "branch": "play-xixiang",
    "actor": "support",
    "strategy": "autonomy",
    "title": "我可以递信，却不替你承担答复",
    "anchor": "信"
  },
  {
    "branch": "play-xixiang",
    "actor": "lead",
    "strategy": "privacy",
    "title": "想把私语藏好，来信却要人亲自到场",
    "anchor": "信"
  },
  {
    "branch": "play-xixiang",
    "actor": "support",
    "strategy": "care",
    "title": "替你送信以前，得给照料的人留出时间",
    "anchor": "信"
  },
  {
    "branch": "play-xixiang",
    "actor": "lead",
    "strategy": "urgency",
    "title": "最急的一封信，最后仍要自己回答",
    "anchor": "信"
  },
  {
    "branch": "play-visit",
    "actor": "support",
    "strategy": "privacy",
    "title": "可以藏起私事，藏不起已经安排的好处",
    "anchor": "许诺"
  },
  {
    "branch": "play-visit",
    "actor": "support",
    "strategy": "autonomy",
    "title": "谁也不能替我同意，包括我借来的沉默",
    "anchor": "许诺"
  },
  {
    "branch": "play-visit",
    "actor": "lead",
    "strategy": "principle",
    "title": "要求按自己的规矩，也得承担同一份代价",
    "anchor": "许诺"
  },
  {
    "branch": "play-visit",
    "actor": "support",
    "strategy": "hope",
    "title": "期待还没算作答应，日子已经照它安排",
    "anchor": "许诺"
  },
  {
    "branch": "play-glass",
    "actor": "lead",
    "strategy": "recognition",
    "title": "愿意把珍藏给你，也得接住离开的理由",
    "anchor": "小兽"
  },
  {
    "branch": "play-glass",
    "actor": "support",
    "strategy": "autonomy",
    "title": "靠近过一回，不等于答应一直留下",
    "anchor": "小兽"
  },
  {
    "branch": "play-glass",
    "actor": "lead",
    "strategy": "aid",
    "title": "把方便先让给来客，把破损留给自己整理",
    "anchor": "小兽"
  },
  {
    "branch": "play-glass",
    "actor": "lead",
    "strategy": "memory",
    "title": "旧日可以留一页，小兽得另找一个位置",
    "anchor": "小兽"
  },
  {
    "branch": "xplay-seagull",
    "actor": "lead",
    "strategy": "recognition",
    "title": "要的是作品的评价，舍不得的却是来客",
    "anchor": "戏"
  },
  {
    "branch": "xplay-seagull",
    "actor": "support",
    "strategy": "autonomy",
    "title": "给作品留一句答复，给去留另留一行",
    "anchor": "戏"
  },
  {
    "branch": "xplay-seagull",
    "actor": "lead",
    "strategy": "hope",
    "title": "期待还没有填满，戏已经到了散场时刻",
    "anchor": "戏"
  },
  {
    "branch": "xplay-seagull",
    "actor": "support",
    "strategy": "loyalty",
    "title": "愿意认真相待，也可以不答应陪伴",
    "anchor": "戏"
  },
  {
    "branch": "play-rhino",
    "actor": "lead",
    "strategy": "control",
    "title": "礼物的去向能登记，人的去留不能",
    "anchor": "礼物"
  },
  {
    "branch": "play-rhino",
    "actor": "support",
    "strategy": "autonomy",
    "title": "给礼物一个位置，给拒绝留一条通路",
    "anchor": "礼物"
  },
  {
    "branch": "play-rhino",
    "actor": "lead",
    "strategy": "aid",
    "title": "能让出歇脚处，能不能也让出拒绝的余地",
    "anchor": "礼物"
  },
  {
    "branch": "play-rhino",
    "actor": "support",
    "strategy": "loyalty",
    "title": "不收下这份安排，也不该被迫断了来往",
    "anchor": "礼物"
  },
  {
    "branch": "choice",
    "actor": "lead",
    "strategy": "memory",
    "title": "过去另存一页，别把对方的未来也写完",
    "anchor": "约定"
  },
  {
    "branch": "choice",
    "actor": "support",
    "strategy": "urgency",
    "title": "先处理眼前的拒绝，别拿明天的好处催人",
    "anchor": "约定"
  },
  {
    "branch": "shelter",
    "actor": "lead",
    "strategy": "livelihood",
    "title": "守住休息的时间，才愿意分出今夜的水",
    "anchor": "水"
  },
  {
    "branch": "shelter",
    "actor": "support",
    "strategy": "autonomy",
    "title": "求一份水，也要给自己的答复留一行",
    "anchor": "水"
  },
  {
    "branch": "money",
    "actor": "lead",
    "strategy": "truth",
    "title": "出钱的人，也得把自己的旧账翻完",
    "anchor": "账"
  },
  {
    "branch": "money",
    "actor": "support",
    "strategy": "autonomy",
    "title": "要不要收钱，不能只听出钱的人",
    "anchor": "账"
  },
  {
    "branch": "money",
    "actor": "support",
    "strategy": "aid",
    "title": "给出资的人让座，仍要把欠款算清",
    "anchor": "账"
  },
  {
    "branch": "money",
    "actor": "lead",
    "strategy": "privacy",
    "title": "可以不留姓名，不能不交代来路",
    "anchor": "账"
  },
  {
    "branch": "secret",
    "actor": "lead",
    "strategy": "truth",
    "title": "给自己留的空白，最后也得由自己补上",
    "anchor": "记录"
  },
  {
    "branch": "secret",
    "actor": "support",
    "strategy": "privacy",
    "title": "私事可以遮住，少掉的那页不能",
    "anchor": "记录"
  },
  {
    "branch": "secret",
    "actor": "lead",
    "strategy": "grievance",
    "title": "旧责不能抵消，新证据也不能只留一半",
    "anchor": "记录"
  },
  {
    "branch": "secret",
    "actor": "support",
    "strategy": "principle",
    "title": "把标准换到自己，藏着的那页也该交出",
    "anchor": "记录"
  },
  {
    "branch": "choice",
    "actor": "support",
    "strategy": "autonomy",
    "title": "最好的条件，也不能占掉我的答复",
    "anchor": "约定"
  },
  {
    "branch": "choice",
    "actor": "lead",
    "strategy": "control",
    "title": "未来排好了次序，却还没有获得同意",
    "anchor": "约定"
  },
  {
    "branch": "choice",
    "actor": "lead",
    "strategy": "aid",
    "title": "好意可以先给，答应必须等对方自己来",
    "anchor": "约定"
  },
  {
    "branch": "choice",
    "actor": "support",
    "strategy": "loyalty",
    "title": "拒绝这份安排，还想保留下一次相见",
    "anchor": "约定"
  },
  {
    "branch": "shelter",
    "actor": "lead",
    "strategy": "aid",
    "title": "先让你歇一会儿，才知道今夜能轮流守",
    "anchor": "水"
  },
  {
    "branch": "shelter",
    "actor": "lead",
    "strategy": "grievance",
    "title": "旧日不能一笔勾销，今夜却可以一起守",
    "anchor": "水"
  },
  {
    "branch": "shelter",
    "actor": "support",
    "strategy": "care",
    "title": "求来一夜安稳，也要给照料的人留出时间",
    "anchor": "水"
  },
  {
    "branch": "shelter",
    "actor": "lead",
    "strategy": "control",
    "title": "水和干粮能归我，守夜不能永远只靠我",
    "anchor": "水"
  },
  {
    "branch": "identity",
    "actor": "lead",
    "strategy": "control",
    "title": "想规定名字的用途，先得解释自己的假名",
    "anchor": "名牌"
  },
  {
    "branch": "identity",
    "actor": "lead",
    "strategy": "privacy",
    "title": "可以留下隐私，不能再借别人的过去",
    "anchor": "名牌"
  },
  {
    "branch": "identity",
    "actor": "support",
    "strategy": "truth",
    "title": "不急着揭穿你，先把假名后面的空白核清",
    "anchor": "名牌"
  },
  {
    "branch": "identity",
    "actor": "lead",
    "strategy": "recognition",
    "title": "想听一个具体理由，最后得拿出真正的自己",
    "anchor": "名牌"
  },
  {
    "branch": "waiting",
    "actor": "lead",
    "strategy": "hope",
    "title": "期待那一栏还空着，信已经给出了答案",
    "anchor": "信"
  },
  {
    "branch": "waiting",
    "actor": "support",
    "strategy": "autonomy",
    "title": "回信没有许诺，去留仍各有一行答复",
    "anchor": "信"
  },
  {
    "branch": "waiting",
    "actor": "lead",
    "strategy": "memory",
    "title": "过去另留一页，未来不能替来信续写",
    "anchor": "信"
  },
  {
    "branch": "waiting",
    "actor": "support",
    "strategy": "urgency",
    "title": "该当场处理的，是不再替等待找借口",
    "anchor": "信"
  },
  {
    "branch": "warren",
    "actor": "lead",
    "strategy": "autonomy",
    "title": "展览可以缩小，自己的判断不能挂牌出售",
    "anchor": "展览"
  },
  {
    "branch": "warren",
    "actor": "support",
    "strategy": "control",
    "title": "可以争一个挂名，不能把欠薪也交给别人",
    "anchor": "展览"
  },
  {
    "branch": "warren",
    "actor": "lead",
    "strategy": "recognition",
    "title": "想让作品被认真对待，先别拿工钱换认可",
    "anchor": "展览"
  },
  {
    "branch": "warren",
    "actor": "support",
    "strategy": "privacy",
    "title": "账外可以留私事，账上的工钱必须留下",
    "anchor": "展览"
  },
  {
    "branch": "solo",
    "actor": "lead",
    "strategy": "truth",
    "title": "等别人给答案，先把自己的信补完整",
    "anchor": "信"
  },
  {
    "branch": "solo",
    "actor": "lead",
    "strategy": "autonomy",
    "title": "没有回信，也不能替别人填下同意",
    "anchor": "信"
  },
  {
    "branch": "solo",
    "actor": "lead",
    "strategy": "hope",
    "title": "把希望留在信里，把保证留成空白",
    "anchor": "信"
  },
  {
    "branch": "solo",
    "actor": "lead",
    "strategy": "memory",
    "title": "旧信能留下过去，不能代签今天的选择",
    "anchor": "信"
  }
];
function storyTitleCandidatesV55(context){
  const branch=storyKeyV53(context);
  return storyTitlesV55.filter(entry=>entry.branch===branch&&context[entry.actor]&&characterStrategyV54(context[entry.actor]).key===entry.strategy);
}
function dramaticTitleV55(cards){
  const c=sceneContextV40(cards),matched=storyTitleCandidatesV55(c);
  let candidates=matched.map(entry=>entry.title);
  if(!candidates.length){
    candidates=storyTitlesV52[storyKeyV53(c)];
    const quiet=[c.lead,c.support].some(quietCharacterV53);
    const limited=[c.lead,c.support].some(card=>['yrole-hamm','role2-nagg','role2-nell','role-v21-winnie'].includes(card?.id));
    const blind=[c.lead,c.support].some(card=>card?.id==='yrole-hamm');
    candidates=candidates.filter(title=>(!quiet||!/开口|一声招呼|原样再念|亲耳听见/.test(title))&&(!limited||!/倒着走|走到|站回|直起身|侧身|坐下/.test(title))&&(!blind||!/看见|看戏|读完/.test(title)));
  }
  const seed=[c.play,c.style,c.method,c.lead,c.support,c.place].map(card=>card?.id||'').join('|');
  let hash=2166136261;
  for(const char of seed)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
  const title=storyPluralV54(sceneTextV40(candidates[hash%candidates.length],c),c);
  const located=c.place.name+'｜'+title;
  return located.length<=35?located:title;
}
function talkSourcesV40(cards){const {lead,support}=talkCardsV39(cards);return [lead,support].filter(Boolean).map(card=>card.sourcePlayLabel?`${card.name}：${card.sourcePlayLabel}`:card.name).join('；');}
function talkReferencesV40(cards){
  const ids=new Set(cards.flatMap(card=>[card.id,...(card.workIds||[])]));
  const references=[
    ['yplay-mrswarren','原作资料','萧伯纳《华伦夫人的职业》原文','https://www.gutenberg.org/files/1097/1097-h/1097-h.htm'],
    ['v23-play-art','原作资料','Concord Theatricals：《艺术》剧情介绍','https://www.concordtheatricals.com/s/13005/art'],
    ['xplay-camel','剧目资料','清华新清华学堂：《骆驼祥子》人物与演出介绍','https://www.hall.tsinghua.edu.cn/info/yc/2323'],
    ['place-meixiang','剧目资料','清华新清华学堂：昆剧《桃花扇》演出介绍','https://www.hall.tsinghua.edu.cn/info/yc/3072'],
  ].filter(([id])=>ids.has(id)).map(([,kind,title,url])=>({kind,title,url}));
  if(typeof highStarSourcesV40==='function'){
    for(const card of cards)for(const source of highStarSourcesV40(card))references.push({kind:'卡片资料',...source});
  }
  references.push({kind:'写作方法',title:'Bush Theatre：愿望、冲突与改变局面的事件',url:'https://www.bushtheatre.co.uk/news/student-guide-to-playwriting-scenes/'});
  return [...new Map(references.map(source=>[source.url,source])).values()];
}
function fiveTalk(cards){return nn(cards);}
if(typeof module!=='undefined'&&module.exports)module.exports={dramaticTitleV55,shareStoryBeatV54,copySentenceV39,stageSentenceV39,shortScene,nn,fiveTalk,dramaticTitleV40,talkSourcesV40,talkReferencesV40};
