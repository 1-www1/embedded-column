// 星露谷物语游戏化学习系统 v2.0
// 用于嵌入式学习专栏 viewer.html
// 新增：音效系统、连击系统、像素字体、面板增强、新成就/任务
(function() {
  'use strict';
  if (window._stardewGamifyLoaded) return;
  window._stardewGamifyLoaded = true;

  // ============= 常量定义 =============
  var P = "sv_";
  var LEVELS = [
    {lv:1, nm:"新手农夫",   xp:0,    ic:"🌱"},
    {lv:2, nm:"学徒",       xp:100,  ic:"🌿"},
    {lv:3, nm:"见习工程师", xp:300,  ic:"⚙️"},
    {lv:4, nm:"技术员",     xp:600,  ic:"🔧"},
    {lv:5, nm:"工程师",     xp:1000, ic:"🔩"},
    {lv:6, nm:"高级工程师", xp:1500, ic:"🏗️"},
    {lv:7, nm:"专家",       xp:2200, ic:"🎯"},
    {lv:8, nm:"大师",       xp:3000, ic:"👑"},
    {lv:9, nm:"传奇",       xp:4000, ic:"⭐"},
    {lv:10,nm:"嵌入式之神", xp:5500, ic:"🏆"}
  ];
  var ACH = [
    {id:"first_seed",   nm:"第一颗种子",   desc:"阅读第一篇文档",     ic:"🌱"},
    {id:"eager_10",     nm:"求知若渴",     desc:"阅读10篇文档",          ic:"📖"},
    {id:"learned_50",   nm:"博学多才",     desc:"阅读50篇文档",          ic:"📚"},
    {id:"note_10",      nm:"笔记达人",     desc:"写10条笔记",            ic:"✏️"},
    {id:"star_20",      nm:"学霸",         desc:"标记20篇已学",          ic:"⭐"},
    {id:"bookmark_15",  nm:"收藏家",       desc:"书签15篇文档",          ic:"🔖"},
    {id:"streak_5",     nm:"连续阅读",     desc:"连续阅读5篇不停歇",    ic:"🔥"},
    {id:"night_owl",    nm:"夜猫子",       desc:"在晚上10点后阅读",      ic:"🌙"},
    {id:"early_bird",   nm:"早起鸟",       desc:"在早上6点前阅读",      ic:"🌅"},
    {id:"full_clear",   nm:"全满通关",     desc:"所有文档标记已学",     ic:"🎯"},
    {id:"theme_switch", nm:"主题切换者",   desc:"切换到星露谷主题",     ic:"🎮"},
    {id:"explorer",     nm:"探索者",       desc:"访问所有主题分类",     ic:"🗺️"},
    {id:"xp_500",       nm:"攒钱能手",     desc:"积累500 XP",          ic:"💰"},
    {id:"xp_1000",      nm:"万元户",       desc:"积累1000 XP",         ic:"💎"},
    {id:"xp_2000",      nm:"小富即安",     desc:"积累2000 XP",         ic:"👑"},
    {id:"all_seasons",  nm:"四季轮回",     desc:"在四个季节都阅读过",   ic:"🍃"},
    {id:"stamina_master",nm:"体力大师",    desc:"累计恢复100体力",     ic:"💪"},
    {id:"speed_reader", nm:"速读者",       desc:"5分钟内阅读3篇文档",  ic:"⚡"},
    {id:"perfectionist",nm:"完美主义者",   desc:"写下20条笔记",         ic:"💡"},
    {id:"centurion",    nm:"百篇斩",       desc:"阅读100篇文档",        ic:"🏅"},
    {id:"quest_10",     nm:"任务达人",     desc:"完成10个每日任务",     ic:"📋"},
    {id:"code_wizard",  nm:"代码巫师",     desc:"累计阅读1小时",       ic:"🧙"},
    {id:"note_variety", nm:"笔记达人",     desc:"在3个不同分类写笔记", ic:"📝"},
    {id:"midnight_oil", nm:"挑灯夜战",     desc:"连续3晚10点后阅读",   ic:"🕯️"},
    {id:"social_lv",    nm:"社交达人",     desc:"访问9个所有分类",     ic:"🤝"},
    // 新增成就
    {id:"combo_5",      nm:"五连击!",      desc:"达到5连击",           ic:"🔥"},
    {id:"combo_10",     nm:"十连击!",      desc:"达到10连击",          ic:"💥"},
    {id:"quest_all",    nm:"全任务制霸",   desc:"一天内完成所有每日任务", ic:"🏆"},
    {id:"stamina_saver",nm:"体力节省者",   desc:"体力低于10时继续阅读",  ic:"💪"},
    {id:"midnight_5",   nm:"熬夜冠军",     desc:"累计5次深夜学习",       ic:"🦉"}
  ];
  var QUEST_POOL = [
    {id:"q_read3",  txt:"今天阅读3篇文档",         tgt:3, typ:"read",     rw:50},
    {id:"q_mark2",  txt:"标记2篇文档为已学",       tgt:2, typ:"mark",     rw:80},
    {id:"q_note1",  txt:"写1条笔记",               tgt:1, typ:"note",     rw:40},
    {id:"q_book3",  txt:"书签3篇文档",             tgt:3, typ:"bookmark", rw:30},
    {id:"q_review", txt:"复习旧文档",              tgt:1, typ:"review",   rw:60},
    {id:"q_read5",  txt:"今天阅读5篇文档",         tgt:5, typ:"read",     rw:100},
    {id:"q_xp_50",  txt:"获得50 XP",               tgt:50,typ:"xp",      rw:40},
    {id:"q_search", txt:"使用搜索功能1次",         tgt:1, typ:"search",  rw:50},
    {id:"q_cat3",   txt:"访问3个不同分类",         tgt:3, typ:"cat",     rw:60},
    {id:"q_streak3",txt:"连续阅读3篇不停歇",       tgt:3, typ:"streak",  rw:90},
    // 新增每日任务
    {id:"q_combo3", txt:"达到3连击",               tgt:3, typ:"combo",   rw:70},
    {id:"q_restore",txt:"恢复体力",                tgt:1, typ:"restore",  rw:30}
  ];
  var SEASONS = [
    {nm:"春天", ic:"🌸", mo:[3,4,5],   cl:"#4CAF50"},
    {nm:"夏天", ic:"☀️", mo:[6,7,8],   cl:"#FFC107"},
    {nm:"秋天", ic:"🍂", mo:[9,10,11], cl:"#FF9800"},
    {nm:"冬天", ic:"❄️", mo:[12,1,2],  cl:"#90CAF9"}
  ];

  // ============= 音效系统 v3.0 (星露谷风格 Chiptune) =============
  // 使用 Web Audio API 还原星露谷物语风格 8-bit 音效
  // 参考 NES 声音芯片：2 路脉冲波 + 三角波 + 噪声
  var _sfxCtx = null;
  var _sfxMuted = false;
  var _ambientPlaying = false;
  var _ambientTimeouts = [];

  function _sfxInitCtx() {
    if (!_sfxCtx) {
      try {
        _sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) { /* browser doesn't support Web Audio API */ }
    }
    if (_sfxCtx && _sfxCtx.state === 'suspended') {
      try { _sfxCtx.resume(); } catch(e) {}
    }
    return _sfxCtx;
  }

  function _sfxStopAmbient() {
    _ambientPlaying = false;
    for (var i = 0; i < _ambientTimeouts.length; i++) {
      clearTimeout(_ambientTimeouts[i]);
    }
    _ambientTimeouts = [];
  }

  /** NES 风格脉冲波工具：快速播放一个 note */
  function _sqNote(ctx, freq, start, dur, vol, ramp) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, start);
    if (ramp) osc.frequency.linearRampToValueAtTime(ramp, start + dur);
    gain.gain.setValueAtTime(vol, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.01);
    return osc;
  }

  /** 三角波工具 */
  function _trNote(ctx, freq, start, dur, vol) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.01);
  }

  /** 噪声爆发工具 */
  function _noiseBurst(ctx, start, dur, vol, highpass) {
    var bufSize = Math.floor(ctx.sampleRate * dur);
    var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < bufSize; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.15));
    }
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var filter = ctx.createBiquadFilter();
    filter.type = highpass ? 'highpass' : 'lowpass';
    filter.frequency.value = highpass ? 2000 : 800;
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(start);
    src.stop(start + dur + 0.01);
  }

  var SFX = {
    play: function(name, volume) {
      if (_sfxMuted) return;
      var ctx = _sfxInitCtx();
      if (!ctx) return;
      if (typeof volume !== 'number') volume = 0.5;

      switch (name) {
        case 'pageFlip':
          _sfxPageFlip(ctx, volume); break;
        case 'xpGain':
          _sfxXpGain(ctx, volume); break;
        case 'levelUp':
          _sfxLevelUp(ctx, volume); break;
        case 'achievement':
          _sfxAchievement(ctx, volume); break;
        case 'questComplete':
          _sfxQuestComplete(ctx, volume); break;
        case 'staminaLow':
          _sfxStaminaLow(ctx, volume); break;
        case 'staminaRestore':
          _sfxStaminaRestore(ctx, volume); break;
        case 'ambientMusic':
          _sfxAmbientMusic(ctx, volume); break;
        case 'stopAmbient':
          _sfxStopAmbient(); break;
        case 'itemPickup':
          _sfxItemPickup(ctx, volume); break;
        case 'heartSound':
          _sfxHeartSound(ctx, volume); break;
      }
    },
    mute: function() {
      _sfxMuted = true;
      _sfxStopAmbient();
    },
    unmute: function() { _sfxMuted = false; },
    isMuted: function() { return _sfxMuted; }
  };

  /* ===================================================
     星露谷风格音效集 (Web Audio API Chiptune)
     =================================================== */

  /**
   * 📖 翻书声 — 纸质噪声 + 轻柔点击
   * 星露谷参考：阅读/翻页时的轻快音效
   */
  function _sfxPageFlip(ctx, vol) {
    var now = ctx.currentTime;
    // 噪声：模拟纸张
    _noiseBurst(ctx, now, 0.08, vol * 0.15, false);
    // 软点击：模拟纸张碰触
    _sqNote(ctx, 1200, now + 0.03, 0.04, vol * 0.08);
  }

  /**
   * 💰 XP获得 — "拾取金币" 上行琶音
   * 星露谷参考：拾取物品/钱的清脆叮当声
   * 快速 C5→E5→G5→C6 方形波琶音
   */
  function _sfxXpGain(ctx, vol) {
    var now = ctx.currentTime;
    var notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    for (var i = 0; i < notes.length; i++) {
      _sqNote(ctx, notes[i], now + i * 0.045, 0.1, vol * 0.2);
    }
    // 叠加软三角波增加温暖感
    _trNote(ctx, 392, now + 0.02, 0.2, vol * 0.08); // 低音G4铺垫
  }

  /**
   * 🎉 升级 — 完整胜利号角
   * 星露谷参考：升级/季节变换时的欢庆音效
   * C大调和弦琶音 + 闪耀泛音层
   */
  function _sfxLevelUp(ctx, vol) {
    var now = ctx.currentTime;
    var notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 E5 G5 C6 E6
    // 主旋律：方形波（明亮）
    for (var i = 0; i < notes.length; i++) {
      _sqNote(ctx, notes[i], now + i * 0.07, 0.35, vol * 0.2);
    }
    // 和声层：三角波低八度（温暖）
    var bass = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4 E4 G4 C5 E5
    for (var i = 0; i < bass.length; i++) {
      _trNote(ctx, bass[i], now + i * 0.07, 0.5, vol * 0.1);
    }
  }

  /**
   * 🏆 成就解锁 — 闪耀上行琶音
   * 星露谷参考：成就/发现时的华丽音效
   * 两拍琶音：先上行再泛音
   */
  function _sfxAchievement(ctx, vol) {
    var now = ctx.currentTime;
    // 第一段：C5 E5 G5 C6
    var notes = [523.25, 659.25, 783.99, 1046.50];
    for (var i = 0; i < notes.length; i++) {
      _sqNote(ctx, notes[i], now + i * 0.1, 0.3, vol * 0.22);
    }
    // 第二段：高八度闪耀 C6 E6 G6
    var hi = [1046.50, 1318.51, 1567.98];
    for (var i = 0; i < hi.length; i++) {
      _sqNote(ctx, hi[i], now + 0.45 + i * 0.1, 0.4, vol * 0.18);
    }
    // 最后持续长音 C7（超高频闪耀）
    _sqNote(ctx, 2093.00, now + 0.75, 0.6, vol * 0.12);
  }

  /**
   * ✅ 任务完成 — "种子落地" 下行两声
   * 星露谷参考：播种/完成任务时的轻快音效
   */
  function _sfxQuestComplete(ctx, vol) {
    var now = ctx.currentTime;
    _sqNote(ctx, 880, now, 0.12, vol * 0.25);      // A5
    _sqNote(ctx, 659.25, now + 0.1, 0.15, vol * 0.22); // E5
    // 柔软的三角波收尾
    _trNote(ctx, 523.25, now + 0.2, 0.25, vol * 0.1);  // C5
  }

  /**
   * ⚠️ 体力不足 — 警告脉冲
   * 星露谷参考：矿石碎裂/危险警告音
   * 低频方形波脉冲 + 噪声
   */
  function _sfxStaminaLow(ctx, vol) {
    var now = ctx.currentTime;
    // 第一个脉冲
    _sqNote(ctx, 130, now, 0.15, vol * 0.2, 80);    // C3→降调
    // 第二个脉冲（更低沉）
    _sqNote(ctx, 110, now + 0.25, 0.2, vol * 0.18, 65);
    // 噪声点缀（碎石感）
    _noiseBurst(ctx, now + 0.05, 0.12, vol * 0.1, true);
    _noiseBurst(ctx, now + 0.3, 0.15, vol * 0.08, true);
  }

  /**
   * 💚 体力恢复 — "钓鱼抛竿" 上升滑音
   * 星露谷参考：钓鱼抛竿/喝回复药水
   * 上升滑音 + 清脆收尾
   */
  function _sfxStaminaRestore(ctx, vol) {
    var now = ctx.currentTime;
    // 上升滑音：300→900Hz
    _sqNote(ctx, 300, now, 0.35, vol * 0.2, 900);
    // 叠三角波增加厚度
    _trNote(ctx, 400, now, 0.3, vol * 0.1);
    // 收尾叮当声
    _sqNote(ctx, 1046.50, now + 0.25, 0.15, vol * 0.15); // C6
  }

  /**
   * 🎵 星露谷风格环境音乐 — 双声部五声音阶循环
   * 参考星露谷游戏内 BGM 风格：温柔、循环、五声音阶
   */
  function _sfxAmbientMusic(ctx, vol) {
    if (_ambientPlaying) return;
    _ambientPlaying = true;
    if (typeof vol !== 'number') vol = 0.05;

    // 主旋律（C大调五声音阶：C D E G A）
    var melody = [
      {f: 262, d: 0.6}, {f: 330, d: 0.4}, {f: 294, d: 0.3}, {f: 330, d: 0.4},  // C E D E
      {f: 392, d: 0.6}, {f: 330, d: 0.4}, {f: 294, d: 0.3}, {f: 262, d: 0.4},  // G E D C
      {f: 294, d: 0.5}, {f: 330, d: 0.3}, {f: 392, d: 0.5}, {f: 440, d: 0.3},  // D E G A
      {f: 392, d: 0.6}, {f: 330, d: 0.4}, {f: 294, d: 0.3}, {f: 262, d: 0.6},  // G E D C
      // 第二段（高音区）
      {f: 330, d: 0.5}, {f: 392, d: 0.3}, {f: 440, d: 0.4}, {f: 392, d: 0.4},  // E G A G
      {f: 523, d: 0.6}, {f: 440, d: 0.4}, {f: 392, d: 0.3}, {f: 330, d: 0.5},  // C5 A G E
      {f: 294, d: 0.4}, {f: 330, d: 0.3}, {f: 392, d: 0.4}, {f: 330, d: 0.3},  // D E G E
      {f: 294, d: 0.5}, {f: 262, d: 0.4}, {f: 294, d: 0.3}, {f: 330, d: 0.6}   // D C D E
    ];

    // 低音和声（C大调低音进行）
    var bassLine = [
      {f: 131, d: 2.4}, {f: 165, d: 2.4},  // C3 E3
      {f: 196, d: 2.4}, {f: 220, d: 2.4},  // G3 A3
      {f: 165, d: 1.8}, {f: 196, d: 1.8}, {f: 131, d: 1.2}  // E3 G3 C3
    ];

    // 计算总时长
    var melLen = 0;
    for (var i = 0; i < melody.length; i++) melLen += melody[i].d;
    var bassLen = 0;
    for (var i = 0; i < bassLine.length; i++) bassLen += bassLine[i].d;

    function playLoop() {
      if (!_ambientPlaying) return;
      var now = ctx.currentTime;

      // 主旋律：三角波（温暖音色）
      var t = 0;
      for (var i = 0; i < melody.length; i++) {
        var note = melody[i];
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = note.f;
        var tStart = now + t;
        gain.gain.setValueAtTime(0, tStart);
        gain.gain.linearRampToValueAtTime(vol * 0.7, tStart + 0.03);
        gain.gain.setValueAtTime(vol, tStart + note.d * 0.2);
        gain.gain.linearRampToValueAtTime(vol * 0.6, tStart + note.d * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, tStart + note.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(tStart);
        osc.stop(tStart + note.d + 0.02);
        t += note.d;
      }

      // 低音和声：正弦波（柔和基底）
      var bt = 0;
      for (var i = 0; i < bassLine.length; i++) {
        var bnote = bassLine[i];
        var bosc = ctx.createOscillator();
        var bgain = ctx.createGain();
        bosc.type = 'sine';
        bosc.frequency.value = bnote.f;
        var bStart = now + bt;
        bgain.gain.setValueAtTime(0, bStart);
        bgain.gain.linearRampToValueAtTime(vol * 0.5, bStart + 0.05);
        bgain.gain.linearRampToValueAtTime(vol * 0.3, bStart + bnote.d * 0.5);
        bgain.gain.exponentialRampToValueAtTime(0.001, bStart + bnote.d);
        bosc.connect(bgain);
        bgain.connect(ctx.destination);
        bosc.start(bStart);
        bosc.stop(bStart + bnote.d + 0.02);
        bt += bnote.d;
      }

      // 安排下一轮（用最长的循环时间）
      var loopTime = Math.max(melLen, bassLen) * 1000;
      _ambientTimeouts.push(setTimeout(playLoop, loopTime));
    }
    playLoop();
  }

  /**
   * 🎒 拾取物品 — 快速上升音
   * 星露谷参考：拾取地上的道具/矿物
   * 短促上行琶音
   */
  function _sfxItemPickup(ctx, vol) {
    var now = ctx.currentTime;
    var notes = [660, 880, 1100]; // ~E5 A5 C#6
    for (var i = 0; i < notes.length; i++) {
      _sqNote(ctx, notes[i], now + i * 0.03, 0.08, vol * 0.2);
    }
  }

  /**
   * ❤️ 心级事件 — 温暖和弦
   * 星露谷参考：好感度提升/心级事件
   * 温暖和弦琶音
   */
  function _sfxHeartSound(ctx, vol) {
    var now = ctx.currentTime;
    var notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    for (var i = 0; i < notes.length; i++) {
      _trNote(ctx, notes[i], now + i * 0.08, 0.4, vol * 0.2);
    }
    // 叠加柔和脉冲
    _sqNote(ctx, 1046.50, now + 0.3, 0.3, vol * 0.1);
  }

  // ============= 连击系统 =============
  var comboCount = 0;
  var comboTimer = null;
  var COMBO_TIMEOUT = 30000; // 30秒无操作重置连击

  /** 增加连击数 */
  function addCombo() {
    comboCount++;
    if (comboTimer) clearTimeout(comboTimer);
    comboTimer = setTimeout(resetCombo, COMBO_TIMEOUT);
    updateComboDisplay();
    // 连击 > 3 时额外奖励 XP
    if (comboCount > 3) {
      addXP(comboCount * 2);
      showComboFlash();
    }
    // 任务进度检查
    checkQuestProgress('combo', 1);
    // 成就检查
    if (comboCount >= 5) checkAchievement('combo_5');
    if (comboCount >= 10) checkAchievement('combo_10');
    // 连击音效（低连击=拾取声，高连击=金币声）
    if (comboCount > 5) {
      SFX.play('xpGain', 0.25);
    } else if (comboCount > 2) {
      SFX.play('itemPickup', 0.3);
    }
  }

  /** 重置连击数 */
  function resetCombo() {
    comboCount = 0;
    if (comboTimer) { clearTimeout(comboTimer); comboTimer = null; }
    updateComboDisplay();
  }

  /** 获取当前连击数 */
  function getCombo() { return comboCount; }

  /** 更新连击显示 */
  function updateComboDisplay() {
    var el = document.getElementById('sv-combo-display');
    if (!el) return;
    if (comboCount > 0) {
      el.style.display = 'block';
      el.innerHTML = '🔥 x' + comboCount;
      if (comboCount >= 3) {
        el.classList.add('sv-combo-fire');
      } else {
        el.classList.remove('sv-combo-fire');
      }
    } else {
      el.style.display = 'none';
      el.classList.remove('sv-combo-fire');
      el.innerHTML = '';
    }
  }

  /** 连击屏幕闪白特效 */
  function showComboFlash() {
    var el = document.createElement('div');
    el.className = 'sv-combo-flash';
    document.body.appendChild(el);
    setTimeout(function() {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 500);
  }

  // ============= 状态管理 =============
  var state = {
    xp: 0,
    stamina: 100,
    achs: [],
    quests: [],
    questProgress: {},
    lastDate: '',
    readCount: 0,
    markCount: 0,
    noteCount: 0,
    bookCount: 0,
    streak: 0,
    lastReadTime: 0,
    visitedCats: [],
    staminaRestoreCount: 0,
    searchCount: 0,
    catVisitCount: 0,
    nightOwlCount: 0,
    totalReadTime: 0,
    seasonReads: [],
    noteCategories: [],
    questsCompleted: 0,
    // 新增状态字段
    todayReadCount: 0,
    readLog: [],  // 每日阅读日历 [{date, count}]
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(P + 'state');
      if (raw) {
        var saved = JSON.parse(raw);
        for (var k in saved) {
          if (saved.hasOwnProperty(k)) state[k] = saved[k];
        }
      }
    } catch(e) { /* 忽略存储错误 */ }
  }

  function saveState() {
    try {
      localStorage.setItem(P + 'state', JSON.stringify(state));
    } catch(e) { /* 忽略存储错误 */ }
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  }

  // 检查是否需要每日重置
  function checkDailyReset() {
    var today = todayStr();
    if (state.lastDate !== today) {
      state.stamina = 100;
      state.lastDate = today;
      state.quests = [];
      state.questProgress = {};
      state.todayReadCount = 0;   // 每日重置今日已读
      generateDailyQuests();
      saveState();
    }
  }

  // ============= XP系统 =============
  function addXP(amount) {
    if (amount <= 0) return;
    var oldLevel = getLevelNum();
    state.xp += amount;
    saveState();
    showXPFloat(amount);
    SFX.play('xpGain', 0.25);     // XP获得音效
    var newLevel = getLevelNum();
    if (newLevel > oldLevel) {
      showLevelUpAnimation();
      SFX.play('levelUp', 0.4);   // 升级音效
      callNpc('triggerLevelUp');
    }
    updateXPBar();
    checkQuestProgress('xp', amount);
  }

  function getLevelNum() {
    var lv = 1;
    for (var i = LEVELS.length - 1; i >= 0; i--) {
      if (state.xp >= LEVELS[i].xp) { lv = LEVELS[i].lv; break; }
    }
    return lv;
  }

  function getLevel() {
    var n = getLevelNum();
    return LEVELS[n - 1];
  }

  function getXP() { return state.xp; }

  function getNextLevelXP() {
    var n = getLevelNum();
    if (n >= LEVELS.length) return LEVELS[LEVELS.length-1].xp;
    return LEVELS[n].xp;
  }

  function getPrevLevelXP() {
    var n = getLevelNum();
    if (n <= 1) return 0;
    return LEVELS[n-2].xp;
  }

  // ============= 体力系统 =============
  function useStamina(amount) {
    if (state.stamina <= 0) {
      showStaminaWarning();
      return false;
    }
    if (state.stamina < amount) {
      showStaminaWarning();
      return false;
    }
    state.stamina -= amount;
    saveState();
    updateStaminaBar();
    return true;
  }

  function restoreStamina(amount) {
    state.stamina = Math.min(100, state.stamina + amount);
    saveState();
    updateStaminaBar();
    SFX.play('staminaRestore', 0.3);  // 体力恢复音效
    checkQuestProgress('restore', 1); // 恢复体力任务
  }

  function getStamina() { return state.stamina; }

  function refreshStamina() {
    state.stamina = 100;
    saveState();
    updateStaminaBar();
  }

  // ============= 成就系统 =============
  function checkAchievement(id) {
    if (state.achs.indexOf(id) >= 0) return false;
    var ach = null;
    for (var i = 0; i < ACH.length; i++) {
      if (ACH[i].id === id) { ach = ACH[i]; break; }
    }
    if (!ach) return false;
    var unlocked = false;
    switch(id) {
      case 'first_seed':    unlocked = state.readCount >= 1; break;
      case 'eager_10':      unlocked = state.readCount >= 10; break;
      case 'learned_50':    unlocked = state.readCount >= 50; break;
      case 'note_10':       unlocked = state.noteCount >= 10; break;
      case 'star_20':       unlocked = state.markCount >= 20; break;
      case 'bookmark_15':   unlocked = state.bookCount >= 15; break;
      case 'streak_5':      unlocked = state.streak >= 5; break;
      case 'night_owl':     unlocked = new Date().getHours() >= 22; break;
      case 'early_bird':    unlocked = new Date().getHours() < 6; break;
      case 'theme_switch':  unlocked = true; break;
      case 'explorer':      unlocked = state.visitedCats.length >= 3; break;
      case 'full_clear':    unlocked = false; break;
      case 'xp_500':        unlocked = state.xp >= 500; break;
      case 'xp_1000':       unlocked = state.xp >= 1000; break;
      case 'xp_2000':       unlocked = state.xp >= 2000; break;
      case 'all_seasons':   unlocked = state.seasonReads && state.seasonReads.length >= 4; break;
      case 'stamina_master':unlocked = state.staminaRestoreCount >= 100; break;
      case 'speed_reader':  unlocked = false; break;
      case 'perfectionist': unlocked = state.noteCount >= 20; break;
      case 'centurion':     unlocked = state.readCount >= 100; break;
      case 'quest_10':     unlocked = (state.questsCompleted || 0) >= 10; break;
      case 'code_wizard':   unlocked = state.totalReadTime >= 3600; break;
      case 'note_variety':  unlocked = state.noteCategories && state.noteCategories.length >= 3; break;
      case 'midnight_oil':  unlocked = state.nightOwlCount >= 3; break;
      case 'social_lv':     unlocked = state.visitedCats.length >= 9; break;
      // 新增成就判定
      case 'combo_5':       unlocked = comboCount >= 5; break;
      case 'combo_10':      unlocked = comboCount >= 10; break;
      case 'quest_all':
        if (state.quests && state.quests.length > 0) {
          unlocked = true;
          for (var qi = 0; qi < state.quests.length; qi++) {
            var qid = state.quests[qi];
            var qq = null;
            for (var qj = 0; qj < QUEST_POOL.length; qj++) {
              if (QUEST_POOL[qj].id === qid) { qq = QUEST_POOL[qj]; break; }
            }
            if (!qq || (state.questProgress[qid] || 0) < qq.tgt) {
              unlocked = false;
              break;
            }
          }
        }
        break;
      case 'stamina_saver': unlocked = state.readCount > 0 && state.stamina <= 10; break;
      case 'midnight_5':    unlocked = state.nightOwlCount >= 5; break;
      default: break;
    }
    if (unlocked) {
      state.achs.push(id);
      saveState();
      showAchievementPopup(ach);
      SFX.play('achievement', 0.45);  // 成就解锁音效
      renderAchievementCount();
    }
    return unlocked;
  }

  function showAchievementPopup(ach) {
    callNpc('triggerAchievement');
    var overlay = document.createElement('div');
    overlay.className = 'sv-ach-popup';
    overlay.innerHTML = '<div class="sv-ach-box">' +
      '<div class="sv-ach-icon">' + ach.ic + '</div>' +
      '<div class="sv-ach-label">成就解锁!</div>' +
      '<div class="sv-ach-name">' + ach.nm + '</div>' +
      '<div class="sv-ach-desc">' + ach.desc + '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    setTimeout(function() {
      overlay.classList.add('sv-ach-show');
    }, 50);
    setTimeout(function() {
      overlay.classList.remove('sv-ach-show');
      setTimeout(function() {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 500);
    }, 3000);
  }

  function checkAllAchievements() {
    for (var i = 0; i < ACH.length; i++) {
      checkAchievement(ACH[i].id);
    }
  }

  function renderAchievementCount() {
    var el = document.getElementById('sv-ach-count');
    if (el) el.textContent = state.achs.length + '/' + ACH.length;
  }

  // ============= 每日任务 =============
  function generateDailyQuests() {
    var today = todayStr();
    var seed = 0;
    for (var i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    var pool = QUEST_POOL.slice();
    state.quests = [];
    state.questProgress = {};
    for (var j = 0; j < 3 && pool.length > 0; j++) {
      var idx = seed % pool.length;
      var q = pool.splice(idx, 1)[0];
      state.quests.push(q.id);
      state.questProgress[q.id] = 0;
      seed = (seed * 31 + 7) % 997;
    }
    saveState();
  }

  function checkQuestProgress(type, count) {
    if (!state.quests) return;
    for (var i = 0; i < state.quests.length; i++) {
      var qid = state.quests[i];
      var q = null;
      for (var j = 0; j < QUEST_POOL.length; j++) {
        if (QUEST_POOL[j].id === qid) { q = QUEST_POOL[j]; break; }
      }
      if (!q || q.typ !== type) continue;
      if (!state.questProgress[qid]) state.questProgress[qid] = 0;
      state.questProgress[qid] += count;
      if (state.questProgress[qid] >= q.tgt) {
        state.questProgress[qid] = q.tgt;
        showQuestComplete(q);
      }
    }
    saveState();
    renderDailyQuests();
  }

  function showQuestComplete(q) {
    var el = document.getElementById('sv-quest-notify');
    if (!el) return;
    el.textContent = '任务完成: ' + q.txt + ' +' + q.rw + ' XP';
    el.className = 'sv-quest-notify sv-quest-notify-show';
    SFX.play('questComplete', 0.35);  // 任务完成音效
    setTimeout(function() {
      el.className = 'sv-quest-notify';
    }, 2000);
    state.questsCompleted = (state.questsCompleted || 0) + 1;
    saveState();
    addXP(q.rw);
    // 检查全任务制霸成就
    checkAchievement('quest_all');
  }

  function claimQuestReward(qid) {
    var q = null;
    for (var j = 0; j < QUEST_POOL.length; j++) {
      if (QUEST_POOL[j].id === qid) { q = QUEST_POOL[j]; break; }
    }
    if (!q) return;
    var prog = state.questProgress[qid] || 0;
    if (prog >= q.tgt) {
      addXP(q.rw);
      state.questProgress[qid] = -1;
      saveState();
      renderDailyQuests();
    }
  }

  // ============= CSS样式注入 =============
  function injectStyles() {
    if (document.getElementById('sv-styles')) return;

    // 加载 Google Fonts 像素字体
    if (!document.getElementById('sv-font-link')) {
      var fontLink = document.createElement('link');
      fontLink.id = 'sv-font-link';
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
      document.head.appendChild(fontLink);
    }

    var s = document.createElement('style');
    s.id = 'sv-styles';
    s.textContent =
      // ===== 基础面板样式 =====
      '.sv-panel{background:rgba(62,39,35,0.92);border:3px solid #8B7355;border-radius:8px;padding:12px;margin:8px 0;color:#f5e6d0;font-family:"Press Start 2P","Courier New",monospace;font-size:10px;box-shadow:0 2px 8px rgba(0,0,0,0.4)}' +
      // ===== XP进度条 =====
      '.sv-xp-bar-wrap{background:#2a1f1a;border:2px solid #5c4a3a;border-radius:4px;height:18px;position:relative;overflow:hidden;margin:6px 0}' +
      '.sv-xp-bar-fill{height:100%;background:linear-gradient(90deg,#4CAF50,#8BC34A);transition:width 0.5s ease;border-radius:2px}' +
      '.sv-xp-text{position:absolute;top:0;left:0;right:0;text-align:center;line-height:18px;font-size:9px;color:#fff;text-shadow:1px 1px 0 #000}' +
      // ===== 体力条 =====
      '.sv-st-bar-wrap{background:#2a1f1a;border:2px solid #5c4a3a;border-radius:4px;height:14px;position:relative;overflow:hidden;margin:4px 0}' +
      '.sv-st-bar-fill{height:100%;background:linear-gradient(90deg,#FF9800,#FFC107);transition:width 0.5s ease;border-radius:2px}' +
      '.sv-st-text{position:absolute;top:0;left:0;right:0;text-align:center;line-height:14px;font-size:8px;color:#fff;text-shadow:1px 1px 0 #000}' +
      // ===== 等级显示 =====
      '.sv-level{font-size:14px;margin:4px 0;display:flex;align-items:center;gap:6px}' +
      '.sv-level-icon{font-size:20px}' +
      // ===== 季节指示器 =====
      '.sv-season{font-size:12px;margin:4px 0;padding:4px 8px;border-radius:4px;display:inline-block}' +
      // ===== 每日任务 =====
      '.sv-quest-item{padding:4px 0;border-bottom:1px dashed #5c4a3a;font-size:9px}' +
      '.sv-quest-item:last-child{border-bottom:none}' +
      '.sv-quest-done{color:#8BC34A;text-decoration:line-through}' +
      '.sv-quest-prog{color:#FFC107}' +
      // ===== 成就弹窗 =====
      '.sv-ach-popup{position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0);transition:background 0.5s;pointer-events:none}' +
      '.sv-ach-show{background:rgba(0,0,0,0.5)}' +
      '.sv-ach-box{background:linear-gradient(135deg,#3e2723,#5D4037);border:4px solid #FFD700;border-radius:12px;padding:24px 32px;text-align:center;color:#f5e6d0;transform:scale(0.5);transition:transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275);font-family:"Press Start 2P","Courier New",monospace}' +
      '.sv-ach-show .sv-ach-box{transform:scale(1)}' +
      '.sv-ach-icon{font-size:48px;margin-bottom:8px}' +
      '.sv-ach-label{font-size:10px;color:#FFD700;margin-bottom:4px}' +
      '.sv-ach-name{font-size:14px;margin-bottom:4px}' +
      '.sv-ach-desc{font-size:9px;color:#bcaaa4}' +
      // ===== XP浮动数字 =====
      '.sv-float{position:fixed;z-index:9999;font-family:"Press Start 2P","Courier New",monospace;font-size:14px;color:#FFD700;text-shadow:2px 2px 0 #000;pointer-events:none;animation:svFloat 1.5s ease-out forwards}' +
      '@keyframes svFloat{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-60px)}}' +
      // ===== 升级动画 =====
      '.sv-levelup{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);z-index:9999;font-family:"Press Start 2P","Courier New",monospace;font-size:20px;color:#FFD700;text-shadow:2px 2px 0 #000;animation:svLvUp 2s ease-out forwards;pointer-events:none}' +
      '@keyframes svLvUp{0%{transform:translate(-50%,-50%) scale(0);opacity:1}50%{transform:translate(-50%,-50%) scale(1.5);opacity:1}100%{transform:translate(-50%,-50%) scale(2);opacity:0}}' +
      // ===== 体力警告 =====
      '.sv-warn{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#5D4037;border:2px solid #FF9800;border-radius:8px;padding:10px 20px;color:#FFD700;font-family:"Press Start 2P","Courier New",monospace;font-size:10px;z-index:9999;opacity:0;transition:opacity 0.3s}' +
      '.sv-warn-show{opacity:1}' +
      // ===== 任务通知 =====
      '.sv-quest-notify{position:fixed;top:20px;right:20px;background:#2E7D32;border:2px solid #4CAF50;border-radius:8px;padding:10px 16px;color:#fff;font-family:"Press Start 2P","Courier New",monospace;font-size:10px;z-index:9999;opacity:0;transition:opacity 0.3s}' +
      '.sv-quest-notify-show{opacity:1}' +
      // ===== 成就面板按钮 =====
      '.sv-ach-btn{background:#4E342E;border:2px solid #8B7355;border-radius:4px;padding:4px 8px;color:#f5e6d0;cursor:pointer;font-size:9px;font-family:inherit;margin:2px}' +
      '.sv-ach-btn:hover{background:#6D4C41}';
    // ============= 新增样式 =============
    s.textContent +=
      // ===== 连击计数器 =====
      '.sv-combo{background:linear-gradient(135deg,rgba(255,87,34,0.9),rgba(255,152,0,0.9));border:2px solid #FFD700;border-radius:6px;padding:6px 12px;margin-top:6px;text-align:center;font-size:12px;color:#fff;text-shadow:1px 1px 2px #000;font-family:"Press Start 2P","Courier New",monospace;transition:all 0.3s ease;min-width:60px}' +
      // ===== 连击火焰动画 =====
      '.sv-combo-fire{animation:svComboFire 0.5s ease-in-out infinite alternate}' +
      '@keyframes svComboFire{0%{box-shadow:0 0 8px #FF5722,0 0 16px #FF9800}100%{box-shadow:0 0 16px #FF5722,0 0 32px #FFC107}}' +
      // ===== 游戏内时钟 =====
      '.sv-clock{font-family:"Press Start 2P","Courier New",monospace;font-size:8px;color:#FFD700;text-shadow:1px 1px 0 #000;white-space:nowrap}' +
      // ===== 连击屏幕闪白 =====
      '.sv-combo-flash{position:fixed;top:0;left:0;right:0;bottom:0;z-index:9998;pointer-events:none;animation:svComboFlash 0.5s ease-out forwards}' +
      '@keyframes svComboFlash{0%{box-shadow:inset 0 0 80px rgba(255,200,50,0.6)}30%{box-shadow:inset 0 0 120px rgba(255,200,50,0.3)}100%{box-shadow:inset 0 0 0px rgba(255,200,50,0)}}' +
      // ===== 面板信息行 =====
      '.sv-info-row{display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,0.15);font-size:8px;gap:4px}' +
      '.sv-info-item{display:flex;align-items:center;gap:2px}';

    document.head.appendChild(s);
  }

  // ============= UI渲染 =============
  /** 获取当前季节 */
  function getCurrentSeason() {
    var month = new Date().getMonth() + 1;
    for (var i = 0; i < SEASONS.length; i++) {
      if (SEASONS[i].mo.indexOf(month) >= 0) return SEASONS[i];
    }
    return SEASONS[2]; // fallback 秋天
  }

  function renderXPBar() {
    var el = document.getElementById('sv-xp-panel');
    if (!el) return;
    var lv = getLevel();
    var cur = state.xp - getPrevLevelXP();
    var need = getNextLevelXP() - getPrevLevelXP();
    if (need <= 0) { cur = 1; need = 1; }
    var pct = Math.min(100, Math.round(cur / need * 100));

    // 当前季节
    var season = getCurrentSeason();

    // 游戏内时钟（星露谷风格）
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var clockStr = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);

    // 今日已读
    var todayRead = state.todayReadCount || 0;

    // 连击显示
    var comboHtml = '';
    if (comboCount > 0) {
      var comboCls = comboCount >= 3 ? ' sv-combo-fire' : '';
      comboHtml = '<div class="sv-combo' + comboCls + '" id="sv-combo-display">🔥 x' + comboCount + '</div>';
    } else {
      comboHtml = '<div class="sv-combo" id="sv-combo-display" style="display:none"></div>';
    }

    el.innerHTML =
      '<div class="sv-panel">' +
      // 等级行
      '<div class="sv-level"><span class="sv-level-icon">' + lv.ic + '</span>' +
      '<span>Lv.' + lv.lv + ' ' + lv.nm + '</span></div>' +
      // XP进度条
      '<div class="sv-xp-bar-wrap"><div class="sv-xp-bar-fill" style="width:' + pct + '%"></div>' +
      '<div class="sv-xp-text">' + state.xp + ' / ' + getNextLevelXP() + ' XP</div></div>' +
      // 成就计数
      '<div style="font-size:8px;margin-top:2px">成就: <span id="sv-ach-count">' + state.achs.length + '/' + ACH.length + '</span></div>' +
      // 信息行：季节 + 时钟 + 今日已读
      '<div class="sv-info-row">' +
      '<span class="sv-info-item" style="color:' + season.cl + '">' + season.ic + ' ' + season.nm + '</span>' +
      '<span class="sv-clock">⏰ ' + clockStr + '</span>' +
      '<span class="sv-info-item">📖 ' + todayRead + '篇</span>' +
      '</div>' +
      // 连击数显示
      comboHtml +
      '</div>';
  }

  function updateXPBar() { renderXPBar(); }

  function renderStaminaBar() {
    var el = document.getElementById('sv-st-panel');
    if (!el) return;
    var pct = Math.max(0, Math.min(100, state.stamina));
    el.innerHTML =
      '<div class="sv-panel">' +
      '<div style="font-size:10px;margin-bottom:4px">体力 ❤️</div>' +
      '<div class="sv-st-bar-wrap"><div class="sv-st-bar-fill" style="width:' + pct + '%"></div>' +
      '<div class="sv-st-text">' + state.stamina + ' / 100</div></div>' +
      '</div>';
  }

  function updateStaminaBar() { renderStaminaBar(); }

  function renderDailyQuests() {
    var el = document.getElementById('sv-quest-panel');
    if (!el) return;
    if (!state.quests || state.quests.length === 0) {
      el.innerHTML = '';
      return;
    }
    var html = '<div class="sv-panel"><div style="font-size:10px;margin-bottom:6px">每日任务</div>';
    for (var i = 0; i < state.quests.length; i++) {
      var qid = state.quests[i];
      var q = null;
      for (var j = 0; j < QUEST_POOL.length; j++) {
        if (QUEST_POOL[j].id === qid) { q = QUEST_POOL[j]; break; }
      }
      if (!q) continue;
      var prog = state.questProgress[qid] || 0;
      var done = prog >= q.tgt;
      var claimed = prog === -1;
      var cls = claimed ? 'sv-quest-done' : (done ? 'sv-quest-prog' : '');
      var status = claimed ? '已领取' : (done ? '可领取' : prog + '/' + q.tgt);
      html += '<div class="sv-quest-item ' + cls + '">' + q.txt + ' <span style="float:right">' + status + '</span></div>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function renderSeasonIndicator() {
    var el = document.getElementById('sv-season-panel');
    if (!el) return;
    var season = getCurrentSeason();
    el.innerHTML = '<div class="sv-season" style="background:' + season.cl + '22;border:1px solid ' + season.cl + '">' +
      season.ic + ' ' + season.nm + '</div>';
  }

  /** 游戏内时钟独立渲染（每分钟刷新用） */
  function renderReadCalendar() {
    var el = document.getElementById('sv-heatmap-panel');
    if (!el) return;
    if (!state.readLog || state.readLog.length === 0) {
      el.innerHTML = '<div class="sv-panel" style="font-size:8px;padding:6px 10px;text-align:center">还没有阅读记录，开始学习吧！</div>';
      return;
    }
    var logs = state.readLog.slice(-35);
    var today = new Date();
    var html = '<div class="sv-panel"><div style="font-size:9px;margin-bottom:4px">阅读日历</div><div style="display:flex;flex-wrap:wrap;gap:3px">';
    for (var i = 0; i < logs.length; i++) {
      var d = logs[i];
      var intensity = Math.min(4, Math.ceil((d.count || 0) / 2));
      var colors = ['#2d1f1a', '#3d2b20', '#5a3d28', '#7a5535', '#9a7040'];
      var c = colors[intensity] || colors[4];
      var dateObj = new Date(d.date);
      var dayLabel = (dateObj.getMonth()+1) + '/' + dateObj.getDate();
      html += '<div style="width:22px;height:22px;background:' + c + ';border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:6px;color:' + (intensity > 2 ? '#f5e6d0' : '#8B7355') + '" title="' + d.date + ' ' + d.count + '篇">' + (d.count > 9 ? '9+' : d.count) + '</div>';
    }
    html += '</div></div>';
    el.innerHTML = html;
  }

function renderClock() {
    var el = document.getElementById('sv-clock-panel');
    if (!el) return;
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var clockStr = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
    el.innerHTML = '<div class="sv-panel" style="text-align:center;padding:8px"><span class="sv-clock">⏰ ' + clockStr + '</span></div>';
  }

  // ============= 动画效果 =============
  function showXPFloat(amount) {
    var el = document.createElement('div');
    el.className = 'sv-float';
    el.textContent = '+' + amount + ' XP';
    el.style.top = '40%';
    el.style.left = '50%';
    document.body.appendChild(el);
    setTimeout(function() {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1500);
  }

  function showLevelUpAnimation() {
    var lv = getLevel();
    var el = document.createElement('div');
    el.className = 'sv-levelup';
    el.textContent = 'LEVEL UP! ' + lv.ic + ' Lv.' + lv.lv;
    document.body.appendChild(el);
    setTimeout(function() {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2200);
  }

  function showStaminaWarning() {
    callNpc('triggerStaminaLow');
    SFX.play('staminaLow', 0.3);        // 体力不足警告音效
    var el = document.getElementById('sv-stamina-warn');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sv-stamina-warn';
      el.className = 'sv-warn';
      document.body.appendChild(el);
    }
    el.textContent = '今天太累了，明天再来吧!';
    el.className = 'sv-warn sv-warn-show';
    setTimeout(function() {
      el.className = 'sv-warn';
    }, 2000);
  }

  // ============= NPC对话辅助 =============
  function callNpc(method) {
    try {
      if (window.StardewNPCs && window.StardewNPCs[method]) {
        window.StardewNPCs[method]();
      }
    } catch(e) { /* NPC对话非关键功能，错误忽略 */ }
  }

  // ============= 行为钩子 =============
  function onDocumentRead() {
    var now = Date.now();
    // 每日首次阅读奖励
    if (!state._lastReadDate || state._lastReadDate !== todayStr()) {
      state._lastReadDate = todayStr();
      state.todayReadCount = 0;     // 重置今日已读
      addXP(15);
      saveState();
      callNpc('triggerWelcome');
    }

    // 检查体力
    if (!useStamina(5)) return;

    // 翻书音效（每日首次阅读额外拾取声）
    SFX.play('pageFlip', 0.3);
    if (state.todayReadCount === 0) SFX.play('itemPickup', 0.2);

    // 高心级触发温暖音效
    if (window.StardewNPCs && window.StardewNPCs.getHeartLevel) {
      if (window.StardewNPCs.getHeartLevel() >= 5 && Math.random() < 0.08) {
        SFX.play('heartSound', 0.2);
      }
    }

    // 阅读计数
    state.readCount++;
    state.todayReadCount = (state.todayReadCount || 0) + 1;

    // 更新阅读日历
    var today = todayStr();
    if (!state.readLog) state.readLog = [];
    var found = false;
    for (var _ri = 0; _ri < state.readLog.length; _ri++) {
      if (state.readLog[_ri].date === today) {
        state.readLog[_ri].count = (state.readLog[_ri].count || 0) + 1;
        found = true;
        break;
      }
    }
    if (!found) state.readLog.push({date: today, count: 1});
    // 只保留最近90天
    if (state.readLog.length > 90) state.readLog = state.readLog.slice(-90);

    // 累计阅读时间(秒)
    if (state.lastReadTime > 0) {
      state.totalReadTime = (state.totalReadTime || 0) + Math.min(300, (now - state.lastReadTime) / 1000);
    }
    saveState();

    // XP奖励
    addXP(10);

    // 连续阅读检查（streak）
    if (now - state.lastReadTime < 300000 && state.lastReadTime > 0) {
      state.streak++;
      if (state.streak % 3 === 0) addXP(20);
    } else {
      state.streak = 1;
    }
    state.lastReadTime = now;

    // 连击系统
    addCombo();

    // 体力节省者成就检查
    if (state.stamina <= 10) checkAchievement('stamina_saver');

    // 季节追踪
    var month = new Date().getMonth() + 1;
    var curSeason = month <= 2 || month === 12 ? 0 : month <= 5 ? 1 : month <= 8 ? 2 : 3;
    if (!state.seasonReads) state.seasonReads = [];
    if (state.seasonReads.indexOf(curSeason) < 0) {
      state.seasonReads.push(curSeason);
      saveState();
      checkAchievement('all_seasons');
    }
    saveState();

    // 任务进度
    checkQuestProgress('read', 1);

    // 时间成就
    var h = new Date().getHours();
    if (h >= 22) {
      state.nightOwlCount = (state.nightOwlCount || 0) + 1;
      saveState();
      checkAchievement('night_owl');
      checkAchievement('midnight_oil');
      checkAchievement('midnight_5');
    }
    if (h < 6) checkAchievement('early_bird');

    // 计数成就
    checkAchievement('first_seed');
    checkAchievement('eager_10');
    checkAchievement('learned_50');
    checkAchievement('centurion');
    checkAchievement('streak_5');
    checkAchievement('xp_500');
    checkAchievement('xp_1000');
    checkAchievement('xp_2000');
    checkAchievement('code_wizard');

    // NPC对话触发
    callNpc('triggerRead');
    if (h >= 22 || h < 4) callNpc('triggerMidnight');
    if (state.streak > 0 && state.streak % 3 === 0) callNpc('triggerStreak');
    renderReadCalendar();
  }

  function onDocumentMark() {
    state.markCount++;
    restoreStamina(10);
    state.staminaRestoreCount = (state.staminaRestoreCount || 0) + 10;
    saveState();
    addXP(50);
    checkQuestProgress('mark', 1);
    checkAchievement('star_20');
    checkAchievement('stamina_master');
  }

  function onNoteSaved(category) {
    state.noteCount++;
    if (category) {
      if (!state.noteCategories) state.noteCategories = [];
      if (state.noteCategories.indexOf(category) < 0) {
        state.noteCategories.push(category);
        saveState();
        checkAchievement('note_variety');
      }
    }
    saveState();
    addXP(30);
    checkQuestProgress('note', 1);
    checkAchievement('note_10');
    checkAchievement('perfectionist');
  }

  function onBookmark() {
    state.bookCount++;
    saveState();
    addXP(5);
    checkQuestProgress('bookmark', 1);
    checkAchievement('bookmark_15');
  }

  function onThemeSwitch() {
    checkAchievement('theme_switch');
  }

  function onCategoryVisit(cat) {
    if (state.visitedCats.indexOf(cat) < 0) {
      state.visitedCats.push(cat);
      saveState();
      checkAchievement('explorer');
      checkAchievement('social_lv');
    }
  }

  function onSearchUsed() {
    state.searchCount = (state.searchCount || 0) + 1;
    saveState();
    checkQuestProgress('search', 1);
  }

  // ============= DOM容器注入 =============
  function injectContainers() {
    // 侧边栏头部: XP面板
    var sidebar = document.querySelector('.sidebar') ||
                  document.querySelector('#sidebar') ||
                  document.querySelector('[class*="sidebar"]');
    if (sidebar && !document.getElementById('sv-xp-panel')) {
      var xpDiv = document.createElement('div');
      xpDiv.id = 'sv-xp-panel';
      sidebar.insertBefore(xpDiv, sidebar.firstChild);
    }
    // 内容区: 体力、任务、季节、时钟
    var content = document.querySelector('.content') ||
                  document.querySelector('#content') ||
                  document.querySelector('main') ||
                  document.querySelector('.viewer-content');
    if (content) {
      var ids = ['sv-season-panel', 'sv-st-panel', 'sv-heatmap-panel', 'sv-quest-panel', 'sv-quest-notify', 'sv-clock-panel'];
      for (var i = 0; i < ids.length; i++) {
        if (!document.getElementById(ids[i])) {
          var d = document.createElement('div');
          d.id = ids[i];
          content.insertBefore(d, content.firstChild);
        }
      }
    }
    // 备用: 如果找不到侧边栏，固定在屏幕左上角
    if (!document.getElementById('sv-xp-panel')) {
      var fixed = document.createElement('div');
      fixed.id = 'sv-xp-panel';
      fixed.style.cssText = 'position:fixed;top:10px;left:10px;z-index:9000;max-width:260px';
      document.body.appendChild(fixed);
    }
  }

  // ============= 初始化 =============
  var _inited = false;
  var _clockInterval = null;

  function init() {
    if (_inited) return;
    _inited = true;
    // 检查星露谷模式
    if (!document.body.classList.contains('stardew-mode')) return;
    loadState();
    checkDailyReset();
    injectStyles();
    injectContainers();
    renderXPBar();
    renderStaminaBar();
    renderDailyQuests();
    renderSeasonIndicator();
    renderReadCalendar();
    renderClock();
    renderAchievementCount();
    // 连接外部事件
    bindExternalEvents();
    // 启动游戏内时钟每分钟刷新
    if (!_clockInterval) {
      _clockInterval = setInterval(function() {
        if (!document.body.classList.contains('theme-stardew')) return;
        renderClock();
        if (document.getElementById('sv-xp-panel')) {
          renderXPBar();
        }
      }, 60000);
    }
    // 启动星露谷风格环境音乐（低音量）
    SFX.play('ambientMusic', 0.05);
  }

  function bindExternalEvents() {
    // 监听自定义事件，供外部代码触发
    document.addEventListener('sv:read', function() { onDocumentRead(); });
    document.addEventListener('sv:mark', function() { onDocumentMark(); });
    document.addEventListener('sv:note', function() { onNoteSaved(); });
    document.addEventListener('sv:bookmark', function() { onBookmark(); });
    document.addEventListener('sv:themeSwitch', function() { onThemeSwitch(); });
    document.addEventListener('sv:visitCat', function(e) {
      if (e.detail && e.detail.cat) onCategoryVisit(e.detail.cat);
    });
    document.addEventListener('sv:search', function() { onSearchUsed(); });
    // 连击相关事件
    document.addEventListener('sv:comboAdd', function() { addCombo(); });
    document.addEventListener('sv:comboReset', function() { resetCombo(); });
  }

  // ============= 暴露 API =============
  window.StardewGamify = {
    // XP/等级
    addXP: addXP,
    getLevel: getLevel,
    getXP: getXP,
    // 体力
    useStamina: useStamina,
    restoreStamina: restoreStamina,
    getStamina: getStamina,
    refreshStamina: refreshStamina,
    // 成就
    checkAchievement: checkAchievement,
    checkAllAchievements: checkAllAchievements,
    showAchievementPopup: showAchievementPopup,
    // 每日任务
    checkQuestProgress: checkQuestProgress,
    // 行为钩子
    init: init,
    onDocumentRead: onDocumentRead,
    onDocumentMark: onDocumentMark,
    onNoteSaved: onNoteSaved,
    onBookmark: onBookmark,
    onThemeSwitch: onThemeSwitch,
    onCategoryVisit: onCategoryVisit,
    onSearchUsed: onSearchUsed,
    // 状态查询
    getState: function() { return state; },
    // 连击系统
    addCombo: addCombo,
    resetCombo: resetCombo,
    getCombo: getCombo,
    // 音效系统
    SFX: SFX,
    // 全量刷新
    renderAll: function() {
      renderXPBar();
      renderStaminaBar();
      renderDailyQuests();
      renderSeasonIndicator();
      renderClock();
    }
  };

  // ============= 自动挂载 =============
  function autoMount() {
    if (document.body && document.body.classList.contains('stardew-mode')) {
      init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }

  // 每次 DOM 变化时检查是否需要初始化
  var _observer = null;
  if (typeof MutationObserver !== 'undefined') {
    _observer = new MutationObserver(function() {
      if (!_inited && document.body && document.body.classList.contains('stardew-mode')) {
        init();
      }
    });
    if (document.body) {
      _observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  }

})();

/* ---------- Service Worker 注册（离线缓存支持） ---------- */
(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function() {});
  }
})();

/* ---------- 移动端增强 ---------- */
(function() {
  'use strict';

  /* 1. 防止 overscroll 导致页面空白 */
  if (window.navigator) {
    document.addEventListener('touchmove', function(e) {
      var el = e.target;
      /* 允许可滚动元素内部滚动 */
      while (el && el !== document.body) {
        var cs = window.getComputedStyle(el);
        if (cs.overflowY === 'auto' || cs.overflowY === 'scroll') return;
        el = el.parentElement;
      }
      /* 阻止 body 层级 overscroll */
      if (el === document.body) { /* pass */ }
    }, { passive: true });
  }

  /* 2. 图片懒加载 — 延迟加载不在视口中的图片 */
  var lazyImages = document.querySelectorAll('.content img:not([loading="lazy"])');
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(function(img) { img.loading = 'lazy'; });
  }

  /* 3. 代码块触摸优化 — 在移动设备上允许水平滚动 */
  var codeBlocks = document.querySelectorAll('.content pre');
  function updateCodeHeight() {
    var isMobile = window.innerWidth <= 768;
    codeBlocks.forEach(function(pre) {
      if (isMobile) {
        var maxH = Math.min(pre.scrollHeight, window.innerHeight * 0.55);
        pre.style.maxHeight = maxH + 'px';
      } else {
        pre.style.maxHeight = '';
      }
    });
  }
  var _codeDebounce = null;
  window.addEventListener('resize', function() {
    clearTimeout(_codeDebounce);
    _codeDebounce = setTimeout(updateCodeHeight, 200);
  });

  /* 4. 改善侧边栏关闭体验 — 点击已打开的文档标题关闭侧边栏 */
  document.addEventListener('click', function(e) {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar || !sidebar.classList.contains('open')) return;
    var link = e.target.closest('.nav-group a, [data-key="__welcome"], [data-key="__stats"]');
    if (link) {
      sidebar.classList.remove('open');
      var overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.classList.remove('show');
    }
  });

  /* 5. iOS 安全区域适配（已有 env()，额外处理横屏） */
  if (window.navigator.standalone) {
    document.documentElement.classList.add('ios-standalone');
  }

  /* 6. 防止双击缩放（不影响代码块） */
  document.addEventListener('dblclick', function(e) {
    if (!e.target.closest('pre') && !e.target.closest('code')) {
      e.preventDefault();
    }
  });

  /* 7. 页面完全加载后隐藏 loading 状态 */
  if (document.querySelector('.loading-indicator')) {
    window.addEventListener('load', function() {
      var li = document.querySelector('.loading-indicator');
      if (li) li.style.display = 'none';
    });
  }

  /* 8. 底部导航栏智能隐藏（下滑隐藏，上滑显示） */
  (function() {
    var bottomBar = document.querySelector('.mobile-bottom-bar');
    if (!bottomBar) return;
    var lastScrollY = window.scrollY;
    var ticking = false;
    var minScroll = 80; /* 滚动超过80px才触发 */
    var hideThreshold = 30; /* 向下滑动超过30px隐藏 */

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          var currentScrollY = window.scrollY;
          var delta = currentScrollY - lastScrollY;

          if (Math.abs(delta) > 5 && currentScrollY > minScroll) {
            if (delta > hideThreshold) {
              /* 向下滚动 → 隐藏底部栏 */
              bottomBar.style.transform = 'translateY(100%)';
              bottomBar.style.transition = 'transform .25s ease';
            } else if (delta < -10) {
              /* 向上滚动 → 显示底部栏 */
              bottomBar.style.transform = 'translateY(0)';
            }
          }

          /* 到达页面底部时强制显示 */
          if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 20) {
            bottomBar.style.transform = 'translateY(0)';
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    /* 页面加载后短暂延迟后确保底部栏可见 */
    setTimeout(function() { bottomBar.style.transform = 'translateY(0)'; }, 500);
  })();

})();
