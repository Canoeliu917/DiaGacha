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
    ending: '{b}没有替他宣布结论，只把空着的位置让出来。{a}终于坐下，把刚才逼别人回答的问题，完整地问了自己一遍。',
    teaser: '{a}逼{b}补全一份证词，纠正细节时却暴露了自己的位置；原本准备给别人的审问，终于轮到自己回答。',
  },
  'play-hamlet': {
    title: '看戏的人先站了起来', premise: '借表演试探隐情、又无法轻易把反应当作证据的困境', prop: '写着戏词的纸',
    opening: '{a}邀请{b}看一段短戏，说只想请对方纠正几个细节，却把最刺痛人的一刻留到最后。',
    exchange: '{b}察觉自己被盯着，要求{a}也入戏；试探者只好亲手演出自己原本藏在台词后的指控。',
    reveal: '短戏还没结束，{b}先打断了它。{a}立刻把中断当成答案，{b}却要求重演，指出他删掉了最关键的一句话。',
    ending: '{a}读完被删掉的那句话，发现它会使自己的指控失去把握。{b}带走了那份戏词，要求下次见面时，先拿出证据。',
    teaser: '{a}排了一段戏试探{b}，对方却要他也入戏；一次意外停演把试探翻了面，谁在隐藏，谁在逼人认罪，突然都不再清楚。',
  },
  'play-macbeth': {
    title: '坐上那个位置以后', premise: '夺取权位之后，恐惧反过来支配行动的进程', prop: '象征席位的名牌',
    opening: '{a}盯住那个还空着的位置，请{b}替自己确认：只要先坐下，其他人就会承认。',
    exchange: '{b}要求{a}说明原来坐在那里的人为何不再回来；{a}绕开这句问话，忙着把名牌摆正。',
    reveal: '位置终于归了{a}，他却不再容许{b}靠近。每一次脚步声都使他转身，刚才为他作证的人也成了需要防备的人。',
    ending: '{b}停止保证安全，把那张名牌留在原处。{a}有了想要的位置，却必须不停站起来检查身后，直到天亮，他也没能安心坐下来。',
    teaser: '{a}请{b}帮助确认一个席位，坐稳后却开始防备这位见证者；权位到手，安静先被赶了出去。',
  },
  'play-godot': {
    title: '说好离开，脚却没有动', premise: '等待一个始终未到的人、离开与留下互相抵消的处境', prop: '预留位置的标记',
    opening: '{a}替一个还没到的人留出位置，{b}问还要等多久；{a}提议先做一件小事，做完再决定。',
    exchange: '小事做完，{b}准备离开，{a}却想起他们还没确认对方会从哪边来。他们把东西拿起又放下，始终没能约定一个离开的时刻。',
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
    ending: '{b}停下催促，{a}却仍不能把手中的旧物放回去。报复的念头仍在，但那些共同用过的东西使这次送行再也无法被说成两不相欠。',
    teaser: '{a}请求{b}容许最后一点停留，得到的时间却被用来清算共同生活；整齐的送行被打断，体面的措辞再也藏不住驱逐。',
  },
};

// These are new fictional encounters. Groups select a conflict, not a substitute synopsis.
const storySeedsV40={
  money:{title:'这笔钱究竟替谁说话',prop:'一本收支账簿',
    opening:'{a}带着一笔钱来找{b}，想资助一件自己珍视的东西，却要求不要留下出资人的姓名。{b}答应保密，仍拿出账簿，请他写明这笔钱从哪里来。',
    exchange:'{a}把数目一再加大，以为争执只是价钱没有谈拢。{b}却翻出另一笔尚未付清的欠款：受人称赞的慷慨，原来可以与别人迟迟拿不到的钱记在同一页上。',
    reveal:'{a}终于承认，自己也曾靠这笔不愿说明来路的钱过日子。{b}原本只想替生意收款，此时却发现自己同样不能把责任全推给付钱的人。',
    ending:'两人没有把账簿烧掉，也没有替彼此写下清白的结论。他们先把欠款列出来，再讨论剩下的钱能做什么；那件本来准备用来赢得称赞的好事，被推迟到债还清以后。',
    teaser:'{a}想匿名出资，{b}却追问钱的来处。一本账簿把慷慨与欠债翻到同一页上，两人都无法只做审判别人的清白人。'},
  secret:{title:'少掉的那一页是谁拿走的',prop:'缺了一页的记录',
    opening:'{a}带来一份缺页的记录，请{b}证明自己没有说谎。{b}认得纸上的字，却声称不记得缺掉的那一页。',
    exchange:'{a}逐项核对日期，发现{b}记得每一笔无关紧要的小事，偏偏把决定责任的那一天忘了。继续追问，可能毁掉两人仅存的信任；停止追问，又会让另一个无辜的人承担后果。',
    reveal:'{b}终于拿出藏起的那一页。它证明{a}没有做过被指控的事，也证明他当时知道真相，却选择了沉默。',
    ending:'{a}把散页装回记录，没有撕掉对自己不利的部分。{b}陪他把完整记录交出去，两人都不知道这能否换来原谅，至少下一个读到它的人不必再替他们补写谎话。',
    teaser:'{a}请{b}用一份记录洗清嫌疑，缺失的那页却握在对方手中。真相能解除一项指控，也会揭开一次更难解释的沉默。'},
  choice:{title:'替别人作出的决定被退回来了',prop:'已经写好的约定',
    opening:'{a}拿着一份写好的约定来见{b}，说自己已经把未来安排妥当，只等对方同意。{b}发现上面没有一项是自己亲口提出的。',
    exchange:'{a}把每一处安排解释成关心，{b}却问，如果自己拒绝，两人的关系还能不能继续。这个问题使原本顺利的谈话停了下来。',
    reveal:'{b}划掉了约定中最优厚的条件，宁愿承担损失，也不愿让别人替自己决定。{a}第一次发现，付出的东西越多，并不意味着得到的答应越可靠。',
    ending:'{a}把那份约定留给{b}修改，自己带走未被接受的礼物。第二天收到的回信很短，只有一项新条件：下一次，请先问我想要什么。',
    teaser:'{a}为{b}写好了一份看似周全的未来。对方宁愿失去好处也不肯签字，让一次关心显出了支配的代价。'},
  shelter:{title:'留下一个人，要付出多少',prop:'仅剩的一份储备',
    opening:'{a}守着仅剩的一份储备，原本打算独自撑过今晚。{b}来请求分走一半，并说明自己已经没有别处可去。',
    exchange:'{a}先问对方能拿什么交换，{b}翻遍随身的东西，只有一个暂时无法兑现的承诺。拒绝很容易，说完以后继续睡觉却并不容易。',
    reveal:'外面的动静使两人明白，各守一份储备也未必能平安到天亮。{b}主动承担最危险的一件事，{a}才发现眼前的人并非只会伸手索取。',
    ending:'他们没有许下永远互相照顾的话，只把这一夜要用的东西重新分了份。天亮时储备比从前更少，{a}却第一次不必独自确认门外是否安全。',
    teaser:'{b}向{a}求一夜容身，拿不出可供交换的东西。危险逼近后，谁在施舍、谁在保护谁，变得不再那么容易分清。'},
  identity:{title:'借来的名字还回去以后',prop:'写着另一个名字的名牌',
    opening:'{a}借用一个更容易获得信任的名字来见{b}。事情起初十分顺利，直到{b}问起一段只有名字真正的主人才能回答的往事。',
    exchange:'{a}编出的细节越多，{b}的疑问也越具体。他开始明白，自己借来的不只是名声，还有一份从未经历过、却必须负责的过去。',
    reveal:'{b}说出了真正的名字，承认早就识破了伪装，只想知道{a}会在什么时候停止。最难堪的不是谎话被揭穿，而是那份自己以为赢来的尊重，从头到尾都建立在对方的等待上。',
    ending:'{a}摘下名牌，重新介绍了自己。{b}没有保证仍给他同样的机会，却肯听他说完一个没有借用任何人经历的理由。',
    teaser:'{a}靠一个借来的名字赢得{b}的信任，却被一段从未经历过的往事困住。摘掉名牌以后，他必须用真正的自己再争取一次机会。'},
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

function sceneTextV40(text,context){return text.replace(/\{(a|b|prop)\}/g,(_,key)=>context[key]);}
function sceneArcV40(context){
  if(sceneArcsV40[context.play.id])return sceneArcsV40[context.play.id];
  const kind=Object.keys(storyGroupsV40).find(key=>storyGroupsV40[key].split(' ').includes(context.play.id));
  return storySeedsV40[kind||'secret'];
}
function sceneContextV40(cards){
  const context=talkCardsV39(cards);
  context.a=context.lead.name;
  context.b=context.support?.name;
  context.arc=sceneArcV40(context);context.prop=context.arc.prop;
  return context;
}
function storyPlaceV40({place,a,b}){
  if(place.id==='place-v21-diningcar')return {open:`列车还没到站，${a}在餐车里等到了${b}。窄桌上放不下太多东西，这次见面也不能无限拖延。`,turn:'到站广播响起，邻桌的人开始收拾行李，他们必须在列车停下之前把事情说清。'};
  if(place.id==='place-meixiang')return {open:`夜里的媚香楼仍有歌声，${a}和${b}却顾不上听。他们把谈话留在一间灯还亮着的屋里，希望楼下的人不要过问。`,turn:'楼下的歌声停了，屋里的争执突然传得很远。刚才还能压低声音掩饰的事，现在连窗外都可能听见。'};
  if(/车|站|船|港|码头|机场/.test(place.name))return {open:`${a}赶到${place.name}时，${b}已经准备离开。错过这次见面，下一封回信不知还要等多久。`,turn:'远处响起催促启程的声音。两人都明白，这次不能再靠“以后再谈”搪塞过去。'};
  if(/牢|监|审|法庭|刑/.test(place.name))return {open:`在${place.name}，${a}终于获准与${b}见面。能说话的时间不多，每一句都可能被门外的人听见。`,turn:'门外的人来催结束谈话。留下误会容易，补上解释的机会却未必还有。'};
  if(/路|街|广场|市集|桥|庭院/.test(place.name))return {open:`${a}在${place.name}拦住了${b}。本想私下解决的事，因为来往的人不断停留，渐渐无法保密。`,turn:'有人停下来问发生了什么。两人原本只想说给对方听的话，不得不接受旁人的追问。'};
  if(/家|厅|客厅|房|寓|宿舍/.test(place.name))return {open:`${a}来到${place.name}找${b}，门开着，却没人先说欢迎。屋里还留着日常生活的痕迹，使这次严肃的见面更加难以开口。`,turn:'门外传来钥匙碰响的声音，再拖下去，这件事就不再只由他们两个人知道。'};
  return {open:`${a}与${b}约在${place.name}见面。附近没有可以代为传话的人，这次必须由他们自己把条件说清。`,turn:`${place.name}渐渐安静下来。${b}提醒${a}，今天总得带着一个明确的答复离开。`};
}

function storyMethodV40({method,a,b,prop}){
  const name=method.name;
  if(/形体|手势|身体|无言/.test(name))return `${a}不再解释，只伸手按住${prop}；${b}没有抢夺，却也不肯把手收回。事情还没谈妥，那件东西已经暴露了双方都不愿放弃的部分。`;
  if(/小道具|道具易主|物件传递|道具延展/.test(name))return `${a}把${prop}悄悄挪到自己面前，以为这样就能抢先作主。${b}没有接过递来的杯子，反而要求把东西放回两人都碰得到的地方。`;
  if(/录|文档|证词|字幕|读提示/.test(name))return `${b}找到先前留下的一段文字，当着${a}的面逐字读出。它与刚才的说法有一处对不上，两人都无法再声称只是记错了。`;
  if(/倒叙|闪回|记忆|重演/.test(name))return `${b}提起两人第一次谈到此事的那个晚上。${a}记得的是一项已经得到同意的决定，${b}记得的却是一句根本没被听完的拒绝。`;
  if(/光|黑场|暗转|烟雾|遮挡|幕/.test(name))return `光线忽然暗下去，${a}以为${b}已经离开，低声说出了方才不肯承认的担忧。回答从近处传来：对方一直没有走。`;
  if(/声音|拟音|画外音|麦克风|旁唱|合唱|伴唱|齐唱|乐师|歌队/.test(name))return `一阵声音打断了争执。${a}停下后才听清，${b}已经把同一个问题问了三次；最响亮的那句辩解，始终没有回答它。`;
  if(/分饰|互换|假面|变装/.test(name))return `${b}假定自己才是提出要求的人，请${a}当面作答。${a}立即说出了反对的理由，随后才意识到，那正是自己刚才不肯让对方说完的话。`;
  if(/独白|潜台词|对白|同句|台词|旁白/.test(name))return `${a}终于把藏在客气话后面的要求说出口。${b}也不再回答那些礼貌的铺垫，直接说明自己最怕失去什么。`;
  if(/停|定格|慢动作|沉默|冷场|对视/.test(name))return `${b}没有立刻答应。沉默里，${a}几次想催促，最后却先补出了自己一直省略的条件。`;
  if(/观众|群众|群像|破墙|论坛|旁观|接力/.test(name))return `旁边有人复述了${a}刚才的承诺。${b}借着这句话要求说清条件，私下还能含混过去的说法，此刻已有第三个人记住。`;
  if(/雨|水池|火/.test(name))return `外面的动静逼得两人先护住${prop}。${a}发现${b}也在保护同一件东西，才肯把方才的责备缓一缓，听对方解释。`;
  return `${a}想尽快结束争执，${b}却指出${prop}还没有交代清楚。若只谈一时的输赢，明天还会有人为今天没有说完的话付出代价。`;
}

function storyStyleV40({style,a,b,prop}){
  const name=style.name;
  if(/广播|声音/.test(name))return `两人的声音隔着一道门传来，${a}起初把${b}的停顿听成同意。门打开以后，那句一直没说完的话终于清楚了：同情可以给，答应却还没有。`;
  if(/街头|广场|社区|政治|史诗|文献|纪实|逐字|活报/.test(name))return `事情不再只有他们自己知道。有人问${a}准备怎样兑现承诺，也有人问${b}，除了责备对方，自己愿意承担哪一部分。`;
  if(/荒诞|极简|黑色|小丑|闹剧|滑稽/.test(name))return `两人把客气话说得越来越周全，${prop}却仍夹在他们中间。${b}忽然笑了：再说十遍“都好商量”，也不能替任何人作出决定。`;
  if(/书信/.test(name))return `${b}拿出一封没寄出的信，${a}才知道，今天这番争执早已在对方心里发生过许多次。信里没有当面的强硬，只有一个反复被划掉又写上的请求。`;
  if(/悬疑|惊悚|法庭/.test(name))return `${a}问起一个先前忽略的细节，${b}的回答使双方都停了下来。原来他们一直以为对方知道的那件事，从未被真正说出口。`;
  if(/默剧|身体|舞剧|手语|形象|视觉|剪影/.test(name))return `${b}不再争辩，把${prop}留给${a}检查。看清它以后，${a}那句准备好的指责没有再说出口。`;
  if(/歌剧|音乐|喜歌|轻歌|诗剧|古典诗学/.test(name))return `${a}记起一句旧歌，本想借它把谈话说得轻松些。${b}却接出了被他省掉的下一句，歌里没有说完的遗憾，恰好是眼前尚未解决的事。`;
  if(/魔幻|象征|表现|寓言|梦|科幻/.test(name))return `${a}一度觉得${prop}比刚才更沉，仿佛连没说出口的话也压在上面。${b}问他还要不要继续，他才意识到，自己不能把决定交给一个想象中的征兆。`;
  if(/喜剧|即兴|双人|风俗|客厅/.test(name))return `两人都想给自己留些体面，解释却越说越露怯。${b}先承认了一件不光彩的小事，${a}忍不住笑出声，终于也说出了自己原本打算藏住的部分。`;
  return `${a}本以为把理由说明白，${b}就该接受。直到听见对方讲起明天的打算，他才发现，这个决定改变的不只是一场谈话，还有别人接下来要过的日子。`;
}

function characterMotiveV40(card,other){
  const a=card.name;
  const motives={
    'xrole-pozzo':`${a}惯于替别人发号施令，很难把${other}的迟疑当作平等的拒绝。`,
    'role2-duncan':`${a}愿意先相信礼貌与善意，因此直到条件被说破，才察觉自己可能判断错了。`,
    'role-hamlet':`${a}想得到一个可靠的答案，却又怀疑眼前每个看似自然的反应。`,
    'role-oedipus':`${a}相信查清真相就能恢复秩序，暂时还没想过，真相也可能使自己失去立场。`,
    'role-nora':`${a}不愿再把别人的周全安排当作自己的选择，这次尤其想亲自决定谈话的结果。`,
    'role-macbeth':`${a}渴望得到承认，却把可能失去它的危险看得比眼前的承诺更真切。`,
    'role-anti':`${a}愿意听完阻止自己的理由，却不愿以放弃责任换取安全。`,
    'role-lear':`${a}盼望得到一句毫无保留的保证，很容易把${other}的保留误认成不爱自己。`,
    'role-wang':`${a}先想保住生计与和气，自己的底线却也在一次次让步中逼近了。`,
    'role-vladimir':`${a}急于确认双方是否记得同一件事，仿佛约定还算数，今天就仍有继续下去的理由。`,
    'role-gogo':`${a}更在意眼下的疲惫与安顿，不愿让宏大的理由盖过此刻真实的难受。`,
    'v23-role-serge':`${a}要的并不只是一次赞同，而是别人承认他有权作出自己的判断。`,
    'role2-liu-siye':`${a}习惯把生意与家事都纳入自己能掌握的秩序，因此尤其不愿把决定权交出去。`,
    'role2-creon':`${a}把个人的让步看作所有规矩松动的开端，这使他很难只把眼前的请求当作一件小事。`,
  };
  return motives[card.id]||'';
}

function warrenStoryV40(context){
  const {a,b,place,style,lead,method}=context;
  const sound=/广播|声音/.test(style.name);
  const exchange=/形体|手势|身体|无言/.test(method.name)
    ? `${a}按住账簿，指着几笔欠账；${b}伸手遮住那些名字，把话题转回展览。${a}没有接他递来的资助款，仍指着账上尚未付清的数目。`
    : storyMethodV40(context);
  const purpose=lead.id==='v23-role-serge'
    ? `${a}带着自己珍爱的白画来到${place.name}，想办一次小展览，让别人认真看待自己的选择。${b}愿意负担费用，条件是展览必须挂他的名字。`
    : `${a}带着一幅画来到${place.name}，想办一次小展览。${b}愿意负担费用，条件是展览必须挂他的名字。`;
  return [
    `故事联想：取意于《华伦夫人的职业》，把不同作品中的人物放进一个虚构故事。${purpose}${a}起初觉得，这只是替对方留一点体面，至少终于有人肯为那幅画认真花钱。`,
    `${a}随后发现，${b}的账簿里还压着几笔未付的工钱。他问这些人什么时候能拿到钱，${b}反问：展览不花这笔钱，你愿意自己补上吗？${exchange}`,
    sound?`门外传来催账的声音。${a}起初只听见${b}笑着说“不会少你的”，随后听见脚步远去，笑声也立刻消失。他这才明白，自己盼望的资助，可能正是别人被一再拖延的报酬。`:`${a}终于承认，自己从前也曾接受同样来路的钱，只在轮到别人获利时才急着讲道德。${b}的讥讽击中了事实，却不能使那几笔拖欠的工钱自动消失。`,
    `${a}把画带回去，决定先缩小展览规模。他没有因此变成一个毫无牵连的清白人：自己也曾把赞助当作别人应给的认可。${b}失去了挂名的机会，账上的欠款仍要偿还；两人各失去了一样想要的东西，却都不能再把代价推给门外等工钱的人。`,
  ];
}

function soloStoryV40(context){
  const {play,lead,place}=context,a=lead.name;
  return [
    `故事联想：取意于《${play.name}》，以下为虚构的新故事。${a}独自留在${place.name}，等一封始终没有送到的回信。这一次，没有人能替他决定还要等多久。`,
    `${a}把准备寄出的第二封信写了又改，发现自己要求对方解释的事，也从未在第一封信里坦白。${/光|暗|黑/.test(context.method.name)?'灯忽然熄了，他在黑暗中说出纸上不敢写的那句话。':/身体|形体|手势|无言/.test(context.method.name)?'他把信塞进信封，又抽出来撕开封口，双手反复的动作比任何解释都诚实。':'他没有继续添字，先把每一句请求后面省去的条件补写出来。'}`,
    `天快亮时，${a}重新读完旧信，没有再把沉默解释成某种秘密的保证。${/声音|广播/.test(context.style.name)?'窗外的脚步几次使他误以为送信的人来了；听清声音渐渐远去，他才不再替每个动静编造一个好消息。':/荒诞|极简/.test(context.style.name)?'他写下“明天再说”，发现上一页、上上页也写着同样的话。这一次，他把日期写了上去。':'他把真正想问的问题写在纸上，第一次没有替收信的人预先写好答案。'}`,
    `${a}带着新信离开${place.name}，原来的问题仍没有解决，但等待不再占去他的全部生活。下一次回信到来时，他希望自己已经能承受一个不同的回答。`,
  ];
}
function theatreReadingV40(context){
  const {play,style,method,arc}=context;
  if(play.id==='yplay-mrswarren'){
    const radio=/广播|声音/.test(style.name)?'广播剧让门外催账的声音进入故事：人物看不见那些劳动者，却无法再装作他们不存在。':`“${style.name}”影响的是这场争执被感受到的方式，核心仍是人物肯为自己的主张付出什么代价。`;
    return `戏剧线索：《华伦夫人的职业》中，薇薇理解母亲早年的贫困处境，却不能接受她仍继续经营妓院获利，最终选择经济独立。作品把贫困如何限制选择、获利以后是否仍要负责，放进同一场母女争论。这则联想把问题转给接受赞助的人：拒绝一笔钱之后，能否承担自己的选择？${radio}`;
  }
  const theme=arc.premise?`《${play.name}》提供的联想入口，是${arc.premise}。`:`这则故事从《${play.name}》延伸出一个问题：当愿望需要别人付出代价时，谁有权决定？`;
  const firstSentence=text=>copySentenceV39(String(text||'').match(/[^。！？]+[。！？]?/)?.[0]||'');
  const note=firstSentence(style.note||style.blurb);
  const methodNote=firstSentence(method.note||method.blurb);
  return `戏剧线索：${theme}${note?`${style.name}：${note}`:''}${methodNote?`${method.name}的具体含义是：${methodNote}`:'人物是否改变决定，仍要从愿望、阻力和代价之间的关系来理解。'}`;
}
function nn(cards){
  const context=sceneContextV40(cards),{play,arc,a,b}=context;
  if(!context.support)return [...soloStoryV40(context),theatreReadingV40(context)];
  if(play.id==='yplay-mrswarren')return [...warrenStoryV40(context),theatreReadingV40(context)];
  const space=storyPlaceV40(context);
  return [
    `故事联想：取意于《${play.name}》，以下相遇与事件均为虚构。${space.open}${sceneTextV40(arc.opening,context)}${characterMotiveV40(context.lead,b)}`,
    `${sceneTextV40(arc.exchange,context)}${characterMotiveV40(context.support,a)}${storyMethodV40(context)}`,
    `${space.turn}${sceneTextV40(arc.reveal,context)}${storyStyleV40(context)}`,
    sceneTextV40(arc.ending,context),
    theatreReadingV40(context),
  ];
}
function shortScene(cards){
  const context=sceneContextV40(cards),{play,place,arc,support,a,b}=context;
  if(!support)return `故事联想：取意于《${play.name}》。${a}独自在${place.name}等一封没有到来的回信，却在重读旧信时发现，自己也一直没有坦白真正的问题。等下去还是寄出另一封信，终于只能由他自己决定。`;
  if(play.id==='yplay-mrswarren')return `故事联想：${a}想在${place.name}办一次画展，${b}愿意出资，却要把自己的名字挂上去。门外催讨工钱的人让这份慷慨变了意味：${a}若拒绝赞助，就得缩小自己的愿望；${b}也不能拿一次善举抵消拖欠。此为借《${play.name}》展开的虚构故事。`;
  return `故事联想：取意于《${play.name}》，在${place.name}虚构一次相遇。${sceneTextV40(arc.teaser,context)}`;
}
function dramaticTitleV40(cards){const c=sceneContextV40(cards),title=`${c.place.name}｜${c.support?c.arc.title:'还没寄出的那封信'}`;return title.length<=35?title:c.arc.title;}
function talkSourcesV40(cards){const {lead,support}=talkCardsV39(cards);return [lead,support].filter(Boolean).map(card=>card.sourcePlayLabel?`${card.name}：${card.sourcePlayLabel}`:card.name).join('；');}
function talkReferencesV40(cards){
  const ids=new Set(cards.flatMap(card=>[card.id,...(card.workIds||[])]));
  const references=[
    ['yplay-mrswarren','原作资料','萧伯纳《华伦夫人的职业》原文','https://www.gutenberg.org/files/1097/1097-h/1097-h.htm'],
    ['v23-play-art','原作资料','Concord Theatricals：《艺术》剧情介绍','https://www.concordtheatricals.com/s/13005/art'],
    ['xplay-camel','剧目资料','清华新清华学堂：《骆驼祥子》人物与演出介绍','https://www.hall.tsinghua.edu.cn/info/yc/2323'],
    ['place-meixiang','剧目资料','清华新清华学堂：昆剧《桃花扇》演出介绍','https://www.hall.tsinghua.edu.cn/info/yc/3072'],
  ].filter(([id])=>ids.has(id)).map(([,kind,title,url])=>({kind,title,url}));
  references.push({kind:'写作方法',title:'Bush Theatre：愿望、冲突与改变局面的事件',url:'https://www.bushtheatre.co.uk/news/student-guide-to-playwriting-scenes/'});
  return references;
}
function fiveTalk(cards){return nn(cards);}
if(typeof module!=='undefined'&&module.exports)module.exports={copySentenceV39,stageSentenceV39,shortScene,nn,fiveTalk,dramaticTitleV40,talkSourcesV40,talkReferencesV40};
