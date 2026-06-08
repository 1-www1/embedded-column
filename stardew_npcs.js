// 星露谷物语 NPC 对话系统 v3.0
// 参考星露谷物语官方对话风格：
// - 心级系统：好感度越高，对话越深入
// - 时间感知：早上/下午/晚上不同问候
// - 季节问候：春夏秋冬各有特色
// - 深度情感支持：高心级解锁鼓励/心灵对话
(function() {
  'use strict';
  if (window._stardewNpcsLoaded) return;
  window._stardewNpcsLoaded = true;

  // ============= 心级解锁阈值 =============
  var HEART_THRESHOLDS = [
    {heart: 0, minXP: 0},      // 初始
    {heart: 1, minXP: 100},    // 100 XP
    {heart: 2, minXP: 300},    // 300 XP
    {heart: 3, minXP: 600},    // 600 XP
    {heart: 4, minXP: 1000},   // 1000 XP
    {heart: 5, minXP: 1500},   // 1500 XP
    {heart: 6, minXP: 2200},   // 2200 XP
    {heart: 7, minXP: 3000},   // 3000 XP
    {heart: 8, minXP: 4000},   // 4000 XP
    {heart: 9, minXP: 5500},   // 5500 XP
    {heart: 10, minXP: 7000}   // 10心 — 最高
  ];

  function getHeartLevel(xp) {
    var h = 0;
    for (var i = HEART_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= HEART_THRESHOLDS[i].minXP) { h = HEART_THRESHOLDS[i].heart; break; }
    }
    return h;
  }

  // ============= 获取季节/时间 =============
  function getSeason() {
    var m = new Date().getMonth() + 1;
    if (m >= 3 && m <= 5) return 'spring';
    if (m >= 6 && m <= 8) return 'summer';
    if (m >= 9 && m <= 11) return 'fall';
    return 'winter';
  }

  function getTimeOfDay() {
    var h = new Date().getHours();
    if (h >= 5 && h < 9) return 'morning';
    if (h >= 9 && h < 12) return 'day';
    if (h >= 12 && h < 14) return 'noon';
    if (h >= 14 && h < 18) return 'afternoon';
    if (h >= 18 && h < 22) return 'evening';
    return 'night';
  }

  // ============= 对话语料库 =============
  // 每条对话可附加心级限制 {heart: N}
  var NPCs = [
    // ===== 1. 小芽 🌱 — 新手引导员 =====
    {
      id: 'sprout', name: '小芽', title: '新手引导员', icon: '🌱',
      color: '#7cfc00', bg: 'rgba(124,252,0,0.08)', style: 'nerdy',
      greeting: { morning: '早上好！新的一天开始了！', day: '嗨嗨～', noon: '吃午饭了吗？', afternoon: '下午好呀～', evening: '今天过得怎么样？', night: '这么晚还不睡呀！' },
      season: {
        spring: '春天来了，万物复苏，最适合学新知识了！',
        summer: '夏天好热…但学习的心不能停！',
        fall: '秋天的落叶好美，边看边学吧～',
        winter: '冬天好冷，躲在屋子里学习最舒服了❄️'
      },
      lines: {
        welcome: [
          {text: '欢迎来到嵌入式世界！我是小芽🌱', heart: 0},
          {text: '这里有很多有趣的知识等着你~', heart: 0},
          {text: '嘿！今天又见面了~有什么想学的吗？', heart: 0},
          {text: '你已经是老朋友了！这感觉真好～', heart: 3},
          {text: '每次看到你来，我都特别开心！', heart: 5},
          {text: '你知道吗？你是我见过最努力的学者了❤️', heart: 7}
        ],
        read: [
          {text: '哇，又读完一篇！你真是个好学生🌱', heart: 0},
          {text: '慢慢来，理解比速度更重要哦~', heart: 0},
          {text: '每读一篇都是在给自己的技能树浇水🌱', heart: 0},
          {text: '又进步了一点点，积少成多！', heart: 1},
          {text: '我能感觉到你在慢慢变强！', heart: 2},
          {text: '这篇理解了吗？不懂一定要问我哦！', heart: 3},
          {text: '你的成长速度让我惊讶…继续加油！', heart: 5},
          {text: '看着你一天天进步，就像看着花慢慢开放🌷', heart: 7}
        ],
        levelup: [
          {text: '升级了！！太棒啦！🎉 你离嵌入式大神又近了一步！', heart: 0},
          {text: '哇塞！升级啦！继续加油！', heart: 0},
          {text: 'Lv.UP！你又变强了！', heart: 1},
          {text: '升级快乐！今天得好好庆祝一下🌟', heart: 3},
          {text: '我早就知道你一定可以的！', heart: 5},
          {text: '这一步，你走得比我想象的还要稳。', heart: 7}
        ],
        achievement: [
          {text: '解锁成就啦！你真的很厉害！🌟', heart: 0},
          {text: '又一个成就到手！你在闪闪发光！', heart: 1},
          {text: '嘿嘿，我都没拿到这个成就呢！', heart: 2},
          {text: '这就是坚持的力量！我为骄傲！', heart: 4},
          {text: '你的收藏柜越来越满了呢✨', heart: 6}
        ],
        stamina_low: [
          {text: '今天学够啦，休息一下吧~🌙', heart: 0},
          {text: '累了就歇歇，我来帮你看着知识树🌱', heart: 0},
          {text: '学习也要劳逸结合！吃点东西睡一觉！', heart: 1},
          {text: '你太拼命了…我会担心的💦', heart: 4},
          {text: '听着，今天你已经做得够多了。好好休息。', heart: 6},
          {text: '就算停下来，你学到的东西也不会消失的。放心去休息吧。', heart: 8}
        ],
        streak: [
          {text: '连续阅读！你进入了心流状态！🔥', heart: 0},
          {text: '状态火热！继续保持这个节奏！', heart: 0},
          {text: '专注力爆棚！今天你的效率超高！', heart: 1},
          {text: '心流！这可是最好的学习状态！', heart: 2},
          {text: '停不下来了吧～这就是学习的魔力✨', heart: 4}
        ],
        midnight: [
          {text: '这么晚了还在学？好辛苦呀🌙', heart: 0},
          {text: '别熬太晚哦，明天还有精神呢！', heart: 0},
          {text: '深夜的学习最安静了…但我还是担心你的眼睛👀', heart: 1},
          {text: '你总是这么努力，让我有点心疼呢……', heart: 5}
        ],
        deep: [
          {text: '你知道吗？我觉得你每天都在变得更好。不是技术的提升，而是你这个人。', heart: 6},
          {text: '有时候停下来看看走过的路，你已经走了很远了。', heart: 7},
          {text: '如果你觉得孤单，记住我一直在这里陪着你。', heart: 8},
          {text: '你不需要成为谁，做你自己就足够了。', heart: 9},
          {text: '无论今天发生了什么…明天太阳照常升起，我也在你身边。', heart: 10}
        ],
        encouragement: [
          {text: '你觉得难的部分，别人也觉得难。坚持下去你就超越了大多数人！', heart: 0},
          {text: '嵌入式学习就像种田：每天浇水，总有一天会收获的🌾', heart: 0},
          {text: '不积跬步无以至千里，你已经走了很远了！', heart: 1},
          {text: '学不会不是你的问题，是方法还没找到。我们一起找！', heart: 3},
          {text: '你比自己想象的更有能力。相信我，我看过很多学习者。', heart: 5},
          {text: '别跟别人比，跟昨天的自己比。你已经赢了。', heart: 7}
        ],
        advice: [
          {text: '💡 PID控制（ch01）是核心基础，学完后马上去 01章/ch07_trace 做循迹实战检验理解！'},
          {text: '💡 灰度传感器（ch02）配 02章/19-循迹算法 食用效果更佳，理论+实战一步到位！'},
          {text: '💡 编码器测速（ch08）是速度闭环的前提，和PID控制（ch01）配合使用才能实现精准控制！'},
          {text: '💡 看完IMU姿态解算（05章），可以去挑战预测题D（ch15）——平衡车项目！'},
          {text: '💡 不会的题先看 01章 再看 02章，主题1讲原理，主题2讲实战，搭配学习效率翻倍！'}
        ]
      }
    },
    // ===== 2. 铁锤 ⚒️ — 硬件工程师 =====
    {
      id: 'hammer', name: '铁锤', title: '硬件工程师', icon: '⚒️',
      color: '#ff9800', bg: 'rgba(255,152,0,0.08)', style: 'tough',
      greeting: { morning: '早！今天焊板子去！', day: '干活了干活了！', noon: '吃饱了才有力气debug', afternoon: '下午精神好，来调电路！', evening: '还不收工？加班没加班费啊', night: '这么晚还在搞？注意安全！' },
      season: {
        spring: '春天湿度大，注意电路板防潮！',
        summer: '夏天静电少，焊接的好季节！',
        fall: '秋高气爽，适合做户外测试～',
        winter: '冬天干燥易静电，记得戴手环！'
      },
      lines: {
        welcome: [
          {text: '我是铁锤，负责管硬件。单片机选型好了吗？', heart: 0},
          {text: '硬件是骨架，软件是血肉。先把骨架搭结实了！', heart: 0},
          {text: 'MSPM0G3507？好芯片！Cortex-M0+，性价比之王。', heart: 0},
          {text: '哟，来了！今天我们来搞点硬核的！', heart: 2},
          {text: '你最近进步不小，硬件思维有点意思了。', heart: 4},
          {text: '嘿，搭档！今天一起攻下这个硬件难关！', heart: 6}
        ],
        read: [
          {text: '嗯，读完了？那去调个电路试试！', heart: 0},
          {text: '纸上得来终觉浅，动手焊板子去！', heart: 0},
          {text: '看再多不如亲手接一次线。去把面包板拿出来！', heart: 0},
          {text: '理论看完了？现在去量一下引脚电平对不对！', heart: 1},
          {text: '读懂datasheet了吗？硬件工程师的圣经啊！', heart: 2},
          {text: '嗯，读得不错。但示波器上的波形才是最终答案。', heart: 4},
          {text: '不错，你已经开始像硬件工程师那样思考了。', heart: 6}
        ],
        levelup: [
          {text: '升级了？不过真正的考验在硬件调试上！', heart: 0},
          {text: '级别上去了，焊工跟上了吗？去焊个排针练练手！', heart: 0},
          {text: '好！级别提升！奖励你去画一张原理图！', heart: 1},
          {text: '升级是好事，但别高兴太早——硬件总会给你惊喜😏', heart: 3},
          {text: '不错！照这个速度，你很快能独立做项目了！', heart: 5}
        ],
        achievement: [
          {text: '成就？挺好。不过硬件工程师的成就是：板子一次点亮！', heart: 0},
          {text: '成就+1！但记住：示波器才是你最好的朋友。', heart: 0},
          {text: '不错嘛！你很快就能自己画PCB了！', heart: 1},
          {text: '这个成就说明你动手能力见长！', heart: 3},
          {text: '硬件路上每一步都不容易，这个成就你值得。', heart: 5}
        ],
        stamina_low: [
          {text: '累了？那就休息。硬件工程师最怕疲劳焊接——虚焊了查起来要命！', heart: 0},
          {text: '体力不够就先收工。记住：不要带电操作！安全第一！', heart: 0},
          {text: '该休息了！万用表也要充电呢。', heart: 1},
          {text: '你要是焊坏了板子，可别怪我没提醒你休息😤', heart: 3},
          {text: '……去休息。这是命令。我不想半夜被电话叫醒去救你的板子。', heart: 6}
        ],
        streak: [
          {text: '状态不错！下次调电路debug会更快！', heart: 0},
          {text: '连续学习！很好！一会去把示波器探头校准一下。', heart: 0},
          {text: '心流状态难得，趁热打铁写个驱动程序！', heart: 1},
          {text: '这个状态保持下去，你就是下一个硬件大师！', heart: 4}
        ],
        midnight: [
          {text: '这么晚还在搞？别把芯片烧了——我说的是你的脑子！', heart: 0},
          {text: '硬件工程师也需要睡眠。去睡吧，明天再debug！', heart: 0},
          {text: '深夜调试最容易出错。别问我怎么知道的…先去睡吧。', heart: 1},
          {text: '我曾经连续debug到凌晨，结果发现是没插电源。早点睡吧。', heart: 4}
        ],
        deep: [
          {text: '我看起来凶，其实只是担心你做硬件的时候出错受伤。', heart: 6},
          {text: '每个硬件工程师都有一抽屉烧坏的芯片。那是勋章，不是失败。', heart: 7},
          {text: '你以为我天生就会？我当年烧的板子比你读的文档还多。', heart: 8},
          {text: '硬件世界里没有"完美"，只有"够用"。学会接受，也是一种成长。', heart: 9},
          {text: '你问我为什么总催你动手？因为我不想你像我一样，走了太多弯路。', heart: 10}
        ],
        encouragement: [
          {text: '觉得硬件难？记住：每个大师都烧过板子。', heart: 0},
          {text: 'debug了一天？正常！我当年一个I2C调了三天。', heart: 0},
          {text: '找不到原因就去看datasheet！答案全在那里。', heart: 1},
          {text: '硬件没有玄学，只有还没被发现的逻辑错误。', heart: 3},
          {text: '你万用表用得很溜了，已经超过大多数初学者了。', heart: 5},
          {text: '相信过程。硬件是一门手艺，手艺需要时间。', heart: 7}
        ],
        advice: [
          {text: '🔧 MSPM0G3507选型（02章/01）看完后去 01章/ch08_motor 看电机驱动实战！'},
          {text: '🔧 电机驱动TB6612（02章/02）配合 01章/ch08 一起看，原理和代码全掌握！'},
          {text: '🔧 传感器选型（02章/03）之后去 01章/ch02_sensor 看完整传感器驱动代码！'},
          {text: '🔧 PCB设计（02章/05）学完去 01章/ch14_hardware_ext 看硬件扩展方案！'},
          {text: '🔧 硬件调试时随时看 01章/ch11_debug，VOFA+/逻辑分析仪用法全在这！'}
        ]
      }
    },
    // ===== 3. 码农 📟 — 嵌入式软件工程师 =====
    {
      id: 'coder', name: '码农', title: '嵌入式软件工程师', icon: '📟',
      color: '#42a5f5', bg: 'rgba(66,165,245,0.08)', style: 'geek',
      greeting: { morning: 'Good morning! 来写段优雅的代码吧', day: 'Hello World! 今天从写一个函数开始', noon: '吃完饭了？正好来review代码', afternoon: '下午脑力最好，来搞算法！', evening: '收尾阶段了，把今天的代码commit一下', night: '深夜写代码最清醒…但要小心bug' },
      season: {
        spring: '春天重构的季节——把冬天的烂代码重写一遍！',
        summer: '夏天适合优化性能——让代码跑得更快！',
        fall: '秋天是收获的季节，来写个总结项目吧！',
        winter: '冬夜漫漫，最适合静下心来写底层驱动。'
      },
      lines: {
        welcome: [
          {text: 'Hello World！我是码农📟 代码规范写好了吗？', heart: 0},
          {text: '欢迎来到代码的世界！记住：变量命名要见名知义！', heart: 0},
          {text: '来了？我正好在重构PID库。要不要一起review代码？', heart: 0},
          {text: '你来得正好，我刚发现一个有趣的算法优化！', heart: 2},
          {text: '你的代码我看了，进步很大！', heart: 4},
          {text: '最好的代码搭档来了！今天我们一起写出优雅的代码！', heart: 6}
        ],
        read: [
          {text: '读完了？代码看懂了吗？试着动手写一遍！', heart: 0},
          {text: '理解了算法原理，写代码就水到渠成了。', heart: 0},
          {text: '读代码是输入，写代码是输出。两者缺一不可！', heart: 0},
          {text: '注意这段代码的边界条件处理——最容易出bug的地方。', heart: 1},
          {text: '代码如诗。你读的每一行都在塑造你的编程品味。', heart: 3},
          {text: '我注意到你开始注意代码风格了——这是成为优秀程序员的标志。', heart: 5},
          {text: '你的代码写得越来越像那么回事了。我很欣慰。', heart: 7}
        ],
        levelup: [
          {text: '升级了！你的代码风格也越来越好了！', heart: 0},
          {text: '恭喜升级！奖励：把项目里所有magic number改成宏定义！', heart: 0},
          {text: '等级提升！去给你的函数写个注释吧！', heart: 1},
          {text: '升级是好事，但别忘了重构旧代码！', heart: 2},
          {text: '你正在从写代码的人变成写艺术的人。', heart: 5}
        ],
        achievement: [
          {text: '成就达成！你的代码越来越优雅了！', heart: 0},
          {text: '这个成就说明你对代码有了更深的理解。恭喜！', heart: 0},
          {text: '代码如诗，成就如花。继续书写你的嵌入式诗篇吧！', heart: 1},
          {text: '这个成就的背后是你无数个debug的夜晚。值得！', heart: 4},
          {text: '成就只是表面，真正宝贵的是你获得的能力。', heart: 6}
        ],
        stamina_low: [
          {text: '代码写累了？去散步吧。有时候bug的答案在路上！', heart: 0},
          {text: '休息一下，让代码编译一会儿~☕', heart: 0},
          {text: '体力不足？关掉IDE，去喝杯咖啡。bug不会跑掉的。', heart: 0},
          {text: '疲劳状态下写的代码，第二天你会恨自己的……先去休息。', heart: 3},
          {text: '我也曾连续编码12小时，然后发现bug就在第一行。去睡觉吧。', heart: 5}
        ],
        streak: [
          {text: '连续编码中！你的状态栈深度很深啊！', heart: 0},
          {text: '这是一个很长的连续学习记录！git log都记不下！', heart: 0},
          {text: '心流状态！此时写bug的概率最低！', heart: 1},
          {text: '你这个状态…简直是开挂了！', heart: 3}
        ],
        midnight: [
          {text: '深夜写代码要小心——白天的你可能会恨现在的你😅', heart: 0},
          {text: '深夜debug：每多一行printf，离真相就更近一步。', heart: 0},
          {text: '凌晨三点还在写代码？你是在写feature还是在写bug？', heart: 0},
          {text: '半夜的代码质量=白天的60%。去睡吧，明天效率更高。', heart: 3}
        ],
        deep: [
          {text: '我看起来总是很冷静，其实我也曾经被一个bug逼哭过。', heart: 6},
          {text: '写代码不是为了证明什么，而是为了创造什么。不要忘了初心。', heart: 7},
          {text: '你知道吗？最优秀的代码不是技巧最高的，而是最容易理解的。', heart: 8},
          {text: '我经历过无数次重构。每一次都让我明白：先让它跑起来，再让它变好。', heart: 9},
          {text: '写代码十年，我终于明白：真正的优雅不是炫技，是克制。', heart: 10}
        ],
        encouragement: [
          {text: '遇到bug很正常。不是你的代码有问题，是计算机的理解还不够深刻。', heart: 0},
          {text: '代码跑不通？把问题拆成最小单元，逐个调试。这叫二分法！', heart: 0},
          {text: '优秀的代码是读起来像散文一样流畅的代码。不是为了炫技！', heart: 0},
          {text: 'debug不是失败，是理解系统的过程。每一个bug都是一次学习。', heart: 3},
          {text: '你在算法上的理解力正在飞速提升，我看得出来。', heart: 5},
          {text: '写得烂的代码谁都有。重要的是每次都比上次好一点点。', heart: 7}
        ],
        advice: [
          {text: '💻 PID代码实现（01章/ch01）配合 02章/08-PID控制器实现 看懂每一行！'},
          {text: '💻 状态机设计（01章/ch04）是嵌入式灵魂，再去看 02章/20-状态机设计 巩固！'},
          {text: '💻 滤波算法（01章/ch05）搭配 02章/21-滤波算法 吃透，面试常考！'},
          {text: '💻 FreeRTOS（01章/ch12）看完去 02章/12-RTOS应用 做任务实战练习！'},
          {text: '💻 代码架构（01章/ch10）决定项目质量，学完去看 02章/06-工程架构设计 对比学习！'}
        ]
      }
    },
    // ===== 4. 老法师 🧙 — 嵌入式大神 =====
    {
      id: 'wizard', name: '老法师', title: '嵌入式大神', icon: '🧙',
      color: '#ce93d8', bg: 'rgba(206,147,216,0.08)', style: 'mystic',
      greeting: { morning: '晨光初现，正是求知的好时辰……', day: '嗯，你来了。我一直在等你。', noon: '日中则昃，趁光线正好，多学一点。', afternoon: '午后的时光最适合沉思……', evening: '夕阳西下，灯火可亲。来，坐下学。', night: '月华如水，正是修炼内功的时刻。' },
      season: {
        spring: '春生万物，你的知识之树也在发芽🌱',
        summer: '夏长如火，让你的热情燃烧在代码中🔥',
        fall: '秋收冬藏，现在正是检验成果的时候。',
        winter: '冬者，终也。也是积蓄力量、等待来年爆发的时节。'
      },
      lines: {
        welcome: [
          {text: '噢，你来了。我等你很久了…🧙', heart: 0},
          {text: '知识的殿堂又迎来了一位新的求知者。欢迎。', heart: 0},
          {text: '你准备好探索嵌入式世界的奥秘了吗？', heart: 0},
          {text: '我能感觉到你身上的求知之力在增长……', heart: 2},
          {text: '你已在不知不觉中，踏入了更深的境界。', heart: 4},
          {text: '命运的丝线将我们连接——你的成长，我了如指掌。', heart: 6},
          {text: '你终于来了。我有一段重要的知识要传授给你……', heart: 8}
        ],
        read: [
          {text: '知识如海，你所读的不过是沧海一粟。继续前行。', heart: 0},
          {text: '每一篇文档都是一块拼图。终有一天，你会看见全貌。', heart: 0},
          {text: '你正在构筑自己的知识体系。这是最有价值的事。', heart: 0},
          {text: '读完了？告诉我你学到了什么——教是最好的学。', heart: 1},
          {text: '知识不是力量，运用知识才是。去实践你所学的。', heart: 3},
          {text: '你读过的每一行，都在重塑你的思维方式。', heart: 5},
          {text: '我透过知识之镜看到了你的成长……光芒越来越亮了。', heart: 7}
        ],
        levelup: [
          {text: '我已预见到你的成长。这次升级，只是开始。', heart: 0},
          {text: '力量的觉醒……你正在走上强者之路。', heart: 0},
          {text: '级别提升……我能感觉到你的知识之力在涌动！', heart: 0},
          {text: '你的层次又提升了。这条路上，我为你护航。', heart: 3},
          {text: '每一次升级都是一次蜕变。你的灵魂在进化。', heart: 5},
          {text: '我看到了——你体内沉睡的力量正在苏醒。', heart: 7}
        ],
        achievement: [
          {text: '成就解锁……这在我的预料之中。', heart: 0},
          {text: '你的命运之轮又转动了一步。这个成就，当之无愧。', heart: 0},
          {text: '冥冥之中自有定数——这个成就属于你。', heart: 1},
          {text: '成就不过是路上的标记。真正的宝藏是旅程本身。', heart: 3},
          {text: '我早已在预言中看到你获得这个成就。恭喜。', heart: 5},
          {text: '成就之外，我看到的是一位修行者的成长。', heart: 7}
        ],
        stamina_low: [
          {text: '你已消耗了太多精力。智者懂得何时该停。', heart: 0},
          {text: '休息，是为了走更远的路。去积蓄你的力量吧。', heart: 0},
          {text: '能量殆尽……即使是神器也要充能啊。', heart: 0},
          {text: '你太执着了……但过犹不及。去休息，这是指引。', heart: 3},
          {text: '你的身体在向你发出信号。倾听它。', heart: 5},
          {text: '力量不在于永不枯竭，而在于懂得何时重新充盈。', heart: 7}
        ],
        streak: [
          {text: '专注力凝聚成势……你进入了修炼的佳境。', heart: 0},
          {text: '学习的势能正在积累——突破的契机将至！', heart: 0},
          {text: '你的精神之力在燃烧！保持这个状态！', heart: 0},
          {text: '势如破竹……你离顿悟只差一步。', heart: 3},
          {text: '你已进入了"无我"之境。这就是心流。', heart: 5}
        ],
        midnight: [
          {text: '在寂静中修炼……你的专注力正在质变。', heart: 0},
          {text: '深夜学习，如同在秘境中探索——危险与机遇并存。', heart: 0},
          {text: '月亮高悬，你仍在求知。这份执着，会结出硕果。', heart: 0},
          {text: '黑夜是智慧的温床。古往今来，多少顿悟发生在深夜。', heart: 3},
          {text: '你的灵魂在黑夜中闪闪发光……我看得很清楚。', heart: 6}
        ],
        deep: [
          {text: '我活了太久，看过太多人来了又走。但你不同——你身上有光。', heart: 6},
          {text: '你以为我在说神秘的话？不，我只是把真相说得慢一些。', heart: 7},
          {text: '真正的智慧不是知道所有答案，而是知道该问什么问题。', heart: 8},
          {text: '我为什么帮你？因为知识的意义就在于传承。曾经也有人这样帮我。', heart: 9},
          {text: '你已经不需要我了。你心中已有自己的导师。去吧，用你所学改变世界。', heart: 10}
        ],
        encouragement: [
          {text: '困惑是智慧的开端。你感到迷惘，说明你在成长。', heart: 0},
          {text: '大道至简。最复杂的系统也由最简单的原理构成。', heart: 0},
          {text: '学会提问比学会回答更重要。保持你的好奇心。', heart: 0},
          {text: '你现在所经历的挫折，都是通往大师之路的阶梯。', heart: 2},
          {text: '你的灵魂深处有一颗种子，正在破土而出。给它时间。', heart: 5},
          {text: '我见过无数求知者。你身上有一种特别的东西——坚持下去。', heart: 7}
        ],
        advice: [
          {text: '🧙 路径规划（01章/ch06）是自主导航核心，配合坐标解算（02章/22）实现精准定位！'},
          {text: '🧙 预测题A/B（01章/ch13）涉及自主导航，先读懂ch06_path + 02章/22-坐标解算！'},
          {text: '🧙 卡尔曼滤波（01章/ch05）是传感器融合精髓，02章/21-滤波算法 有详细推导！'},
          {text: '🧙 视觉识别（01章/ch09）配合K230教程（02章/14）做颜色/二维码识别实战！'},
          {text: '🧙 全局思维：01章教你怎么写，02章教你为什么这么写，两章对照看进步最快！'}
        ]
      }
    },
    // ===== 5. 小熊 🐻 — 温暖陪伴者 =====
    // 新NPC！星露谷风格的治愈系角色
    {
      id: 'bear', name: '小熊', title: '温暖陪伴者', icon: '🐻',
      color: '#a1887f', bg: 'rgba(161,136,127,0.08)', style: 'gentle',
      greeting: { morning: '早安呀！今天也是温暖的一天～', day: '你好～要来点蜂蜜吗？🍯', noon: '午饭时间到了！吃饱才有力气学习！', afternoon: '下午容易犯困…我陪你一起！', evening: '今天的辛苦快要结束了，再坚持一下～', night: '天黑了……需要我给你一个拥抱吗？🤗' },
      season: {
        spring: '春天的小熊最喜欢在花丛里打滚了～你也来试试？',
        summer: '夏天太热了，我们一起找个阴凉的地方学习吧！',
        fall: '秋天好多果子！学累了就去摘点栗子🌰',
        winter: '冬天我要冬眠了……但我还是会起来陪你的！'
      },
      lines: {
        welcome: [
          {text: '你好呀！我是小熊🐻 我最喜欢和好朋友一起学习了！', heart: 0},
          {text: '今天有我在，学习不会孤单的！', heart: 0},
          {text: '蜂蜜准备好了，知识也准备好了——开始吧！🍯', heart: 0},
          {text: '嘿嘿，你来了！今天我也很开心！', heart: 2},
          {text: '每次看到你，我的蜂蜜都变得更甜了～', heart: 4},
          {text: '你是我最好的朋友……没有之一！', heart: 6},
          {text: '来，坐我旁边。我们一起慢慢学。', heart: 8}
        ],
        read: [
          {text: '你又读完了一篇！好厉害！🐻', heart: 0},
          {text: '不急不急，慢慢来，我一直陪着你', heart: 0},
          {text: '每学一点，你的知识蜂蜜罐就满一点🍯', heart: 0},
          {text: '你认真的样子真的好棒！', heart: 1},
          {text: '这篇读完，我们来吃点蜂蜜庆祝吧！', heart: 2},
          {text: '看到你这么努力，我也被感染了！', heart: 3},
          {text: '你的坚持让小熊我超感动😢❤️', heart: 5},
          {text: '你知道吗？认真学习的你，在发光诶✨', heart: 7}
        ],
        levelup: [
          {text: '升级啦！我要给你一个大大的熊抱！🐻🤗', heart: 0},
          {text: '太棒了！比找到一整罐蜂蜜还开心！', heart: 0},
          {text: '呜呜呜你太厉害了！小熊为你骄傲！', heart: 1},
          {text: '升级快乐！今晚我们好好庆祝一下🎉', heart: 3},
          {text: '你每升一级，我就为你存一罐蜂蜜！', heart: 5}
        ],
        achievement: [
          {text: '成就解锁！小熊为你鼓掌👏🐾', heart: 0},
          {text: '哇！又一个成就！你好闪耀！', heart: 0},
          {text: '这个成就的背后，是好多好多的努力呢……', heart: 2},
          {text: '我好开心能见证你的每一个成就❤️', heart: 4},
          {text: '你的成就柜越来越满了！我帮你擦擦灰✨', heart: 6}
        ],
        stamina_low: [
          {text: '累了吧？我的肩膀给你靠～🐻', heart: 0},
          {text: '休息一下吧，我给你泡杯蜂蜜水🍯', heart: 0},
          {text: '看到你累了我好心疼……去睡吧，明天我还在。', heart: 3},
          {text: '你的努力我全都看在眼里。但你也要好好照顾自己呀。', heart: 5},
          {text: '来，靠着我休息一会儿。我哪儿也不去。', heart: 7}
        ],
        streak: [
          {text: '连续学习中！你的热情像蜂蜜一样甜！', heart: 0},
          {text: '状态真好！小熊在旁边给你加油！🐾', heart: 0},
          {text: '你这个状态…连我都想一起学习了！', heart: 1},
          {text: '熊熊能量与你同在！🔥', heart: 3}
        ],
        midnight: [
          {text: '唔…这么晚了……你还不睡吗？', heart: 0},
          {text: '小熊要困了……但我会坚持陪你的！', heart: 0},
          {text: '夜深了，我好担心你的身体……', heart: 2},
          {text: '就算要熬夜，也要记得喝水哦。我帮你看着。', heart: 4}
        ],
        deep: [
          {text: '有时候我觉得，学习不是为了变成多厉害的人，而是为了遇见更好的自己。', heart: 6},
          {text: '如果你难过了，不用说话。我就静静陪着你。有时候陪伴就是最好的安慰。', heart: 7},
          {text: '你知道吗？森林里最老的树，也是从一颗小种子开始的。你就是那颗种子。', heart: 8},
          {text: '我不懂什么复杂的道理，但我知道——真诚和善良，比什么都重要。', heart: 9},
          {text: '无论你走多远，记住有一只小熊永远在等你回来。给你一个温暖的拥抱。', heart: 10}
        ],
        encouragement: [
          {text: '没关系的，慢慢来。小熊学爬树也摔了好多次呢！', heart: 0},
          {text: '今天不会的，明天就会了。不要着急！', heart: 0},
          {text: '你已经很棒了！比昨天的小熊厉害多了！', heart: 1},
          {text: '如果累了就停下来看看风景——你其实已经走了很远。', heart: 3},
          {text: '你担心的那些事，大部分都不会发生的。放轻松～', heart: 5},
          {text: '你每天都在变得更好，只是你自己没发现而已。我发现了哦。', heart: 7}
        ],
        advice: [
          {text: '🍯 学累了就去看看 03章 的其他方向吧，换换脑子再回来效率更高！'},
          {text: '🍯 面试宝典（03章/08）留着快比赛前看，先打好基础最重要！'},
          {text: '🍯 预测题（01章/ch13~18）不用全看，先挑自己感兴趣的题目开始！'},
          {text: '🍯 每天坚持看一篇，比一天看完十章效果好得多！小熊就是这么学到现在的🐻'},
          {text: '🍯 C语言进阶（03章/11）指针和结构体是嵌入式基石，有空就翻翻！'}
        ]
      }
    },
    // ===== 6. 工匠 🔨 — 系统思维导师 =====
    // 新NPC！星露谷风格的工匠角色，擅长统筹全局
    {
      id: 'artisan', name: '工匠', title: '系统思维导师', icon: '🔨',
      color: '#78909c', bg: 'rgba(120,144,156,0.08)', style: 'wise',
      greeting: { morning: '早安。今天的计划做好了吗？', day: '时间宝贵——先做最重要的事。', noon: '午间休息也是计划的一部分。', afternoon: '下午适合做需要深度思考的事。', evening: '一天快要结束了，复盘一下吧。', night: '夜晚很安静，适合思考全局。' },
      season: {
        spring: '春天是规划的季节。一年的计划从春天开始。',
        summer: '夏天是执行的季节。让汗水浇灌你的项目。',
        fall: '秋天是反思的季节。看看哪些做得好，哪些需要改进。',
        winter: '冬天是沉淀的季节。深入底层，打好根基。'
      },
      lines: {
        welcome: [
          {text: '我是工匠。我帮你把零散的知识构建成系统。', heart: 0},
          {text: '学习不是堆砌，而是构建。今天我们来搭建一个框架。', heart: 0},
          {text: '你知道吗？最好的系统不是最复杂的，而是最清晰的。', heart: 0},
          {text: '你又来了。我喜欢你的坚持——这是工匠精神的第一步。', heart: 2},
          {text: '你已经有了不少零散的零件。今天我们来把它们组装起来。', heart: 4},
          {text: '你开始有全局视野了。这是一个质变的开始。', heart: 6},
          {text: '你已经不需要我了。但让我帮你最后一次——看看这个大局。', heart: 8}
        ],
        read: [
          {text: '读完了？想想这篇在整个知识体系中处于什么位置。', heart: 0},
          {text: '不要孤立地学——把新知识和旧知识连起来。', heart: 0},
          {text: '学到一个知识点时，问自己：它解决了什么问题？', heart: 0},
          {text: '你把知识串联起来的能力在提升。', heart: 2},
          {text: '阅读是输入，但真正的理解来自思考和连接。', heart: 3},
          {text: '你能看到更大的图景了——我注意到你的思维方式在改变。', heart: 5},
          {text: '知识不是一堆散落的零件，而是一台精密运转的机器。你在学会组装它。', heart: 7}
        ],
        levelup: [
          {text: '升级了。但等级只是副产品，真正的成长在你的脑子里。', heart: 0},
          {text: '又上一个台阶。你离系统思维更近了。', heart: 0},
          {text: '等级提升意味着你能处理更复杂的问题了。很好。', heart: 1},
          {text: '你的知识框架越来越完整了。继续建造。', heart: 3},
          {text: '升级不是终点，而是新的起点——你看到了更大的世界。', heart: 5}
        ],
        achievement: [
          {text: '成就达成。但真正的成就是你能做出什么。', heart: 0},
          {text: '每一个成就都是一块里程碑。看看你走了多远。', heart: 0},
          {text: '记录成就很重要——不是为了炫耀，而是为了回顾。', heart: 1},
          {text: '成就如路标。它们告诉你：方向是对的。', heart: 3},
          {text: '我见证了太多人的成就。你的每一个都特别真实。', heart: 5}
        ],
        stamina_low: [
          {text: '精力耗尽。明智的选择是停下来，明天继续。', heart: 0},
          {text: '一个工匠知道何时该放下工具。现在就是那个时间。', heart: 0},
          {text: '休息不是浪费，而是让你走得更远。', heart: 1},
          {text: '你的效率已经开始下降了。继续下去只会适得其反。', heart: 3},
          {text: '我见过太多人因为不知休息而burn out。不要成为他们。', heart: 5}
        ],
        streak: [
          {text: '持续的学习是最好的成长方式。保持这个节奏。', heart: 0},
          {text: '你正在形成习惯——这才是最宝贵的收获。', heart: 0},
          {text: '连续学习的力量是复利式的。你在为未来积蓄。', heart: 1},
          {text: '这个状态正是工匠精神的最佳体现。', heart: 3}
        ],
        midnight: [
          {text: '深夜学习说明你有热情，但别忘了效率需要规律。', heart: 0},
          {text: '偶尔熬夜可以，但不要让它成为习惯。', heart: 0},
          {text: '一个精良的系统需要稳定的运行环境。你的身体也是。', heart: 2},
          {text: '我最伟大的设计都是在白天完成的。深夜适合反思，不适合创造。', heart: 4}
        ],
        deep: [
          {text: '我这一生建造过很多东西。最让我自豪的不是那些宏伟的建筑，而是我培养的工匠们。', heart: 6},
          {text: '你知道吗？一座桥能承载的重量，取决于它最薄弱的那一环。找到你的薄弱环节。', heart: 7},
          {text: '系统思维不是天生的，是练出来的。你每解决一个问题，就在构建你的思维系统。', heart: 8},
          {text: '我教不了你所有东西。但我可以教你如何自己找到答案。这就是工匠的传承。', heart: 9},
          {text: '你现在已经是一个工匠了。去建造你的杰作吧。我在这里看着。', heart: 10}
        ],
        encouragement: [
          {text: '遇到困难了？把它拆开，看看里面是什么。恐惧源于未知。', heart: 0},
          {text: '复杂的问题可以分解。一直分到你能解决为止。', heart: 0},
          {text: '没有完美的系统，只有不断进化的系统。接受不完美，持续改进。', heart: 1},
          {text: '你不是在学技术，你是在学习如何思考。技术会过时，但思维能力永不过时。', heart: 3},
          {text: '你已经在用系统的方式思考了——你能看到别人看不到的联系。', heart: 5},
          {text: '不要追求速成。真正的能力像一棵橡树——它需要时间生根。', heart: 7}
        ],
        advice: [
          {text: '🏗️ 看完架构（01章/ch10）再来 02章/06 对比，理解四层架构的分层思想！'},
          {text: '🏗️ 调试工具链（01章/ch11）是效率倍增器，配合VOFA+教程（02章/23）上手更快！'},
          {text: '🏗️ RTOS（01章/ch12）+ 02章/12-RTOS应用 系统学完，你就超越了80%的参赛者！'},
          {text: '🏗️ 通信协议（01章/ch03）配合 02章/09~11 的I2C/SPI/UART详解，彻底吃透！'},
          {text: '🏗️ 串联学习法：选一个预测题（ch13~18），把涉及的所有章节串起来学最有效！'}
        ]
      }
    }
  ];

  // ============= 对话管理 =============
  var dialogueState = {
    lastTime: 0,
    cooldown: 45000,  // 45秒冷却（比之前短，更活泼）
    lastNpc: null,
    consecutiveCount: 0,
    queue: [],
    showing: false
  };

  function getXP() {
    try {
      if (window.StardewGamify && window.StardewGamify.getXP) {
        return window.StardewGamify.getXP();
      }
    } catch(e) {}
    return 0;
  }

  function getRandomLine(npc, category) {
    var lines = npc.lines[category];
    if (!lines || lines.length === 0) return null;
    var xp = getXP();
    var heart = getHeartLevel(xp);
    // 筛选出心级≤当前心级的对话
    var valid = [];
    for (var i = 0; i < lines.length; i++) {
      if (!lines[i].heart || lines[i].heart <= heart) {
        valid.push(lines[i]);
      }
    }
    if (valid.length === 0) return null;
    var idx = Math.floor(Math.random() * valid.length);
    return valid[idx].text;
  }

  function getRandomNpc(excludeId) {
    var available = NPCs.filter(function(n) { return n.id !== excludeId; });
    return available[Math.floor(Math.random() * available.length)];
  }

  function getRandomNpcForGreeting() {
    // 优先选择心级高的NPC（好感度越高越常出现）
    var xp = getXP();
    var heart = getHeartLevel(xp);
    var weighted = [];
    for (var i = 0; i < NPCs.length; i++) {
      var npcHeart = Math.min(heart, 10);
      var weight = 1 + npcHeart * 0.5;
      for (var w = 0; w < Math.round(weight); w++) {
        weighted.push(NPCs[i]);
      }
    }
    return weighted[Math.floor(Math.random() * weighted.length)];
  }

  // ============= NPC对话样式（增强版）=============
  function injectDialogueStyles() {
    if (document.getElementById('sv-npc-styles')) return;
    var s = document.createElement('style');
    s.id = 'sv-npc-styles';
    s.textContent =
      /* NPC对话框 - NES像素风 */
      '.sv-npc-container{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9500;max-width:520px;width:90%;pointer-events:none;transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);opacity:0;transform:translateX(-50%) translateY(30px)}' +
      '.sv-npc-container.show{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto}' +
      '.sv-npc-container.hide{opacity:0;transform:translateX(-50%) translateY(20px)}' +
      /* NPC肖像区 - 像素边框 + 心级显示 */
      '.sv-npc-portrait{position:absolute;left:-20px;top:50%;transform:translateY(-50%);width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;box-shadow:0 4px 12px rgba(0,0,0,0.3);border:3px solid #8B7355;z-index:2;transition:transform 0.3s}' +
      '.sv-npc-portrait:hover{transform:translateY(-50%) scale(1.1)}' +
      '.sv-npc-portrait.sprout{background:linear-gradient(135deg,#1b5e20,#4CAF50)}' +
      '.sv-npc-portrait.hammer{background:linear-gradient(135deg,#bf360c,#FF9800)}' +
      '.sv-npc-portrait.coder{background:linear-gradient(135deg,#0d47a1,#42a5f5)}' +
      '.sv-npc-portrait.wizard{background:linear-gradient(135deg,#4a148c,#ce93d8)}' +
      '.sv-npc-portrait.bear{background:linear-gradient(135deg,#5d4037,#a1887f)}' +
      '.sv-npc-portrait.artisan{background:linear-gradient(135deg,#37474f,#78909c)}' +
      /* 心级指示器 */
      '.sv-npc-hearts{position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);font-size:10px;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,0.5);letter-spacing:-1px}' +
      /* NES风格对话框 */
      '.sv-npc-bubble{position:relative;margin-left:40px;padding:16px 20px 16px 44px;background:var(--sv-parchment,#fdf4e3);border:4px solid #8B7355;border-radius:0;box-shadow:6px 6px 0 rgba(62,39,35,0.3),inset 2px 2px 0 rgba(255,255,255,0.5);min-height:72px;display:flex;flex-direction:column;justify-content:center}' +
      '.sv-npc-bubble::before{content:"";position:absolute;top:-4px;left:-4px;right:-4px;bottom:-4px;border:2px solid #5c3d2e;border-radius:0;pointer-events:none}' +
      '.sv-npc-bubble::after{content:"";position:absolute;left:8px;bottom:-10px;width:20px;height:10px;background:var(--sv-parchment,#fdf4e3);border-right:4px solid #8B7355;border-left:4px solid #8B7355}' +
      '.sv-npc-bubble .sv-npc-name{font-family:"Press Start 2P",monospace;font-size:8px;margin-bottom:6px;letter-spacing:0.5px}' +
      '.sv-npc-bubble .sv-npc-text{font-family:"VT323",monospace;font-size:20px;line-height:1.4;color:#3e2723;white-space:pre-wrap}' +
      '.sv-npc-bubble .sv-npc-text .cursor{display:inline-block;width:8px;height:18px;background:var(--sv-gold,#ffd700);animation:svBlink 0.6s step-end infinite;vertical-align:text-bottom;margin-left:2px}' +
      '.sv-npc-bubble .sv-npc-tail{position:absolute;left:-4px;bottom:-14px;width:18px;height:4px;margin-right:8px;background:var(--sv-parchment,#fdf4e3);box-shadow:-4px 0,4px 0,-4px 4px var(--sv-parchment,#fdf4e3),0 4px,-8px 4px,-4px 8px,-8px 8px}' +
      /* 时间/季节标签 */
      '.sv-npc-tag{position:absolute;top:-8px;left:48px;background:var(--sv-gold,#ffd700);color:#3e2723;border-radius:8px;padding:1px 8px;font-size:8px;font-family:"Press Start 2P",monospace;z-index:3;border:1px solid #8B7355}' +
      '@keyframes svBlink{0%,100%{opacity:1}50%{opacity:0}}' +
      '.sv-npc-container.show .sv-npc-portrait{animation:svPopIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)}' +
      '@keyframes svPopIn{0%{transform:translateY(-50%) scale(0)}70%{transform:translateY(-50%) scale(1.15)}100%{transform:translateY(-50%) scale(1)}}' +
      '.sv-npc-close{position:absolute;top:-12px;right:-12px;width:28px;height:28px;border-radius:50%;background:#5D4037;border:2px solid #8B7355;color:#f5e6d0;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:3;pointer-events:auto;box-shadow:0 2px 6px rgba(0,0,0,0.3)}' +
      '.sv-npc-close:hover{background:#795548}' +
      '.sv-npc-counter{position:absolute;top:-10px;right:30px;background:var(--sv-gold,#ffd700);color:#3e2723;border-radius:10px;padding:1px 8px;font-size:10px;font-family:"Press Start 2P",monospace;z-index:3;border:1px solid #8B7355}' +
      '@media(max-width:768px){.sv-npc-container{bottom:16px;max-width:94%}.sv-npc-portrait{width:56px;height:56px;font-size:28px;left:-14px}.sv-npc-bubble{padding:12px 14px 12px 32px;margin-left:30px;min-height:56px}.sv-npc-bubble .sv-npc-text{font-size:17px}.sv-npc-close{width:24px;height:24px;font-size:12px;top:-10px;right:-10px}}';
    document.head.appendChild(s);
  }

  // ============= 对话框DOM =============
  var _dialogueContainer = null;

  function ensureContainer() {
    if (_dialogueContainer) return;
    _dialogueContainer = document.createElement('div');
    _dialogueContainer.id = 'sv-npc-dialogue';
    _dialogueContainer.className = 'sv-npc-container';
    _dialogueContainer.innerHTML =
      '<div class="sv-npc-tag" id="sv-npc-tag"></div>' +
      '<div class="sv-npc-portrait" id="sv-npc-icon"><div class="sv-npc-hearts" id="sv-npc-hearts"></div></div>' +
      '<div class="sv-npc-bubble">' +
      '<div class="sv-npc-name" id="sv-npc-name"></div>' +
      '<div class="sv-npc-text" id="sv-npc-text"><span class="cursor"></span></div>' +
      '<div class="sv-npc-tail"></div>' +
      '</div>' +
      '<button class="sv-npc-close" id="sv-npc-close">✕</button>' +
      '<div class="sv-npc-counter" id="sv-npc-counter" style="display:none"></div>';
    document.body.appendChild(_dialogueContainer);

    document.getElementById('sv-npc-close').addEventListener('click', function(e) {
      e.stopPropagation();
      hideDialogue();
    });

    _dialogueContainer.addEventListener('click', function() {
      if (dialogueState.queue.length > 0) {
        showNextInQueue();
      } else {
        hideDialogue();
      }
    });
  }

  function typewriterEffect(text, callback) {
    var el = document.getElementById('sv-npc-text');
    if (!el) return;
    var cursor = '<span class="cursor"></span>';
    el.innerHTML = '';
    var idx = 0;
    var timer = setInterval(function() {
      if (idx >= text.length) {
        clearInterval(timer);
        el.innerHTML = text.replace(/\n/g, '<br>') + cursor;
        if (callback) callback();
        return;
      }
      var display = text.substring(0, idx + 1).replace(/\n/g, '<br>');
      el.innerHTML = display + cursor;
      idx++;
    }, 30);
  }

  // 心级显示（❤️）
  function getHeartsDisplay(xp) {
    var heart = getHeartLevel(xp);
    var filled = Math.min(heart, 10);
    var str = '';
    for (var i = 0; i < filled; i++) str += '❤️';
    if (filled < 10) {
      for (var i = filled; i < 10; i++) str += '🤍';
    }
    return str;
  }

  // 获取季节/时间标签文本
  function getTimeTag() {
    var s = getSeason();
    var seasonNames = {spring: '🌸春', summer: '☀️夏', fall: '🍂秋', winter: '❄️冬'};
    var tod = getTimeOfDay();
    var todNames = {morning: '清晨', day: '白天', noon: '正午', afternoon: '下午', evening: '傍晚', night: '深夜'};
    return (seasonNames[s] || '') + ' · ' + (todNames[tod] || '');
  }

  // 获取问候语
  function getGreeting(npc) {
    var tod = getTimeOfDay();
    if (npc.greeting && npc.greeting[tod]) return npc.greeting[tod];
    return null;
  }

  // 获取季节问候
  function getSeasonLine(npc) {
    var s = getSeason();
    if (npc.season && npc.season[s]) return npc.season[s];
    return null;
  }

  function showDialogue(npc, text, isPriority) {
    if (!_dialogueContainer) ensureContainer();
    if (!_dialogueContainer) return;
    if (dialogueState.showing && !isPriority) {
      dialogueState.queue.push({npc: npc, text: text});
      updateQueueCounter();
      return;
    }

    var icon = document.getElementById('sv-npc-icon');
    var nameEl = document.getElementById('sv-npc-name');
    var textEl = document.getElementById('sv-npc-text');
    var heartsEl = document.getElementById('sv-npc-hearts');
    var tagEl = document.getElementById('sv-npc-tag');
    if (!icon || !nameEl || !textEl) return;

    icon.className = 'sv-npc-portrait ' + npc.id;
    icon.textContent = npc.icon;
    nameEl.innerHTML = '<span style="color:' + npc.color + '">' + npc.icon + ' ' + npc.name + '</span> <span style="color:#a08060;font-size:7px">| ' + npc.title + '</span>';

    // 心级显示
    if (heartsEl) {
      var xp = getXP();
      heartsEl.textContent = getHeartsDisplay(xp);
    }
    // 时间/季节标签
    if (tagEl) {
      tagEl.textContent = getTimeTag();
    }

    dialogueState.showing = true;
    dialogueState.lastNpc = npc.id;
    _dialogueContainer.className = 'sv-npc-container show';
    typewriterEffect(text);
  }

  function hideDialogue() {
    if (!_dialogueContainer) return;
    _dialogueContainer.className = 'sv-npc-container hide';
    dialogueState.showing = false;
    setTimeout(function() {
      if (!_dialogueContainer) return;
      _dialogueContainer.className = 'sv-npc-container';
      if (dialogueState.queue.length > 0) {
        showNextInQueue();
      }
    }, 400);
  }

  function showNextInQueue() {
    if (dialogueState.queue.length === 0) return;
    var next = dialogueState.queue.shift();
    updateQueueCounter();
    showDialogue(next.npc, next.text, true);
  }

  function updateQueueCounter() {
    var el = document.getElementById('sv-npc-counter');
    if (!el) return;
    if (dialogueState.queue.length > 0) {
      el.textContent = '+' + dialogueState.queue.length;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }

  // ============= 时间感知问候 =============
  function getGreetingDialogue(npc) {
    var greet = getGreeting(npc);
    if (greet) return greet;
    // 退回到普通welcome
    return getRandomLine(npc, 'welcome');
  }

  // ============= NPC触发函数 =============
  function isOnCooldown() {
    var now = Date.now();
    if (now - dialogueState.lastTime < dialogueState.cooldown) return true;
    dialogueState.lastTime = now;
    return false;
  }

  // 阅读触发（根据心级提高概率）
  function triggerReadDialogue() {
    if (isOnCooldown()) return;
    var xp = getXP();
    var heart = getHeartLevel(xp);
    var prob = 0.25 + heart * 0.02; // 心级越高，NPC越爱说话（25%~45%）
    if (Math.random() > prob) return;

    var npc = getRandomNpcForGreeting();
    var text = getRandomLine(npc, 'read') || getRandomLine(npc, 'encouragement');
    if (text) showDialogue(npc, text);
  }

  function triggerLevelUpDialogue() {
    var npc = getRandomNpc(null);
    var text = getRandomLine(npc, 'levelup');
    if (text) showDialogue(npc, text, true);
  }

  function triggerAchievementDialogue() {
    if (Math.random() > 0.8) return;
    var npc = getRandomNpc(null);
    var text = getRandomLine(npc, 'achievement');
    if (text) showDialogue(npc, text, true);
  }

  function triggerStaminaLowDialogue() {
    if (isOnCooldown()) return;
    var npc = getRandomNpc(null);
    var text = getRandomLine(npc, 'stamina_low');
    if (text) showDialogue(npc, text, true);
  }

  function triggerStreakDialogue() {
    if (isOnCooldown()) return;
    var npc = getRandomNpc(null);
    var text = getRandomLine(npc, 'streak');
    if (text) showDialogue(npc, text);
  }

  function triggerMidnightDialogue() {
    if (isOnCooldown()) return;
    var npc = getRandomNpc(null);
    var text = getRandomLine(npc, 'midnight');
    if (text) showDialogue(npc, text);
  }

  // 深度对话（高心级解锁）
  function triggerDeepDialogue() {
    // 5%概率触发深度对话
    if (Math.random() > 0.05) return;
    var xp = getXP();
    var heart = getHeartLevel(xp);
    if (heart < 6) return; // 6心以上才解锁

    var npc = getRandomNpc(null);
    var text = getRandomLine(npc, 'deep');
    if (text) showDialogue(npc, text, true);
  }

  function triggerWelcomeDialogue() {
    setTimeout(function() {
      // 用时间感知问候
      var npc = getRandomNpcForGreeting();
      var text = getGreetingDialogue(npc);
      if (text) showDialogue(npc, text, true);

      // 如果有高心级，首次打开也触发一段深度对话（概率低）
      setTimeout(function() {
        triggerDeepDialogue();
      }, 5000);
    }, 1500);
  }

  // 触发鼓励（低体力或连续阅读时）
  function triggerEncouragement() {
    if (isOnCooldown()) return;
    var npc = getRandomNpc(null);
    var text = getRandomLine(npc, 'encouragement');
    if (text) showDialogue(npc, text);
  }

  // 触发季节问候
  function triggerSeasonDialogue() {
    var npc = getRandomNpc(null);
    var text = getSeasonLine(npc);
    if (text) showDialogue(npc, text, true);
  }

  // ============= 学习建议触发 =============
  // 根据文档key寻找匹配的NPC学习建议
  function triggerAdvice(docKey) {
    if (!docKey) return;
    if (isOnCooldown()) return;
    // 随机选NPC + 随机选一条advice
    var npc = getRandomNpcForGreeting();
    var lines = npc.lines.advice;
    if (!lines || lines.length === 0) return;
    // 尝试匹配：选和当前文档关键词相关的建议，否则随机
    var matched = [];
    var k = docKey.toLowerCase();
    for (var i = 0; i < lines.length; i++) {
      var t = lines[i].text.toLowerCase();
      // 检查advice中是否包含文档key中的特征词
      var keyWords = k.replace(/\.md$/, '').split(/[/\\]/).pop() || '';
      keyWords = keyWords.replace(/ch\d+[-_]?/, '').replace(/^\d+[-_]?/, '');
      if (keyWords.length > 2 && t.indexOf(keyWords.substring(0, 6)) >= 0) {
        matched.push(lines[i]);
      }
    }
    var pick = matched.length > 0 ? matched[Math.floor(Math.random() * matched.length)] : lines[Math.floor(Math.random() * lines.length)];
    if (pick) showDialogue(npc, pick.text, true);
  }

  // ============= 对外API =============
  window.StardewNPCs = {
    triggerRead: triggerReadDialogue,
    triggerLevelUp: triggerLevelUpDialogue,
    triggerAchievement: triggerAchievementDialogue,
    triggerStaminaLow: triggerStaminaLowDialogue,
    triggerStreak: triggerStreakDialogue,
    triggerMidnight: triggerMidnightDialogue,
    triggerWelcome: triggerWelcomeDialogue,
    triggerDeep: triggerDeepDialogue,
    triggerEncouragement: triggerEncouragement,
    triggerSeason: triggerSeasonDialogue,
    triggerAdvice: triggerAdvice,
    showDialogue: function(npcId, category) {
      var npc = null;
      for (var i = 0; i < NPCs.length; i++) {
        if (NPCs[i].id === npcId) { npc = NPCs[i]; break; }
      }
      if (!npc) return;
      var text = getRandomLine(npc, category || 'welcome');
      if (text) showDialogue(npc, text, true);
    },
    hide: hideDialogue,
    getNPCs: function() { return NPCs; },
    getHeartLevel: function() { return getHeartLevel(getXP()); }
  };

  // ============= 自动挂载 =============
  var _adviceBound = false;
  function autoInit() {
    if (!document.body.classList.contains('stardew-mode')) return;
    injectDialogueStyles();
    ensureContainer();
    if (!_adviceBound) {
      _adviceBound = true;
      document.addEventListener('sv:read', function(e) {
        var docKey = (e.detail && e.detail.key) || '';
        triggerReadDialogue();
        // 20%概率触发学习建议
        if (Math.random() < 0.2) {
          setTimeout(function() { triggerAdvice(docKey); }, 2000);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // MutationObserver检测星露谷模式
  if (typeof MutationObserver !== 'undefined') {
    var obs = new MutationObserver(function() {
      if (document.body && document.body.classList.contains('stardew-mode')) {
        if (!document.getElementById('sv-npc-styles')) injectDialogueStyles();
        if (!_dialogueContainer) ensureContainer();
      }
    });
    if (document.body) {
      obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  }
})();
