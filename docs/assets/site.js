/* ============================================================
   site.js —— 右下角「敲一下」角色挂件
   样式在 assets/extra.css，这里只负责行为
   换角色图：替换 assets/cheshire.png 即可（保持透明底 PNG）
   想静音：把下面 SOUND 改成 false
   ============================================================ */
(function () {
  "use strict";

  var SOUND = true;

  /* 找到 site.js 自己的地址，拼出 assets/cheshire.png 的绝对路径，
     这样文章在 /blog/2026/xx/ 这种多级目录里图片也不会丢 */
  var BASE = (function () {
    var me = document.currentScript;
    if (!me) {
      var ss = document.querySelectorAll('script[src]');
      for (var i = ss.length - 1; i >= 0; i--) {
        if (/site\.js(\?|$)/.test(ss[i].src)) { me = ss[i]; break; }
      }
    }
    if (me && me.src) return me.src.replace(/site\.js(\?.*)?$/, '');
    return 'assets/';
  })();

  function build() {
    if (document.querySelector('.mokuo')) return;

    var wrap = document.createElement('div');
    wrap.className = 'mokuo';

    var btn = document.createElement('button');
    btn.className = 'mokuo__btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', '敲一下');

    var img = document.createElement('img');
    img.className = 'mokuo__img';
    img.alt = '敲一下';
    img.draggable = false;
    img.src = BASE + 'cheshire.png';

    var ring = document.createElement('span');
    ring.className = 'mokuo__ring';

    var pop = document.createElement('div');
    pop.className = 'mokuo__pop';
    pop.textContent = '功德+1';

    var label = document.createElement('div');
    label.className = 'mokuo__label';

    var count = 0;
    try {
      count = parseInt(localStorage.getItem('mokuo_count') || '0', 10);
      if (!isFinite(count) || count < 0) count = 0;
    } catch (e) { count = 0; }
    label.textContent = '功德 ' + count;

    var ground = document.createElement('div');
    ground.className = 'mokuo__ground';

    btn.appendChild(img);
    btn.appendChild(ring);
    btn.appendChild(pop);
    wrap.appendChild(btn);
    wrap.appendChild(ground);
    wrap.appendChild(label);
    document.body.appendChild(wrap);

    var audioCtx = null;
    function tok() {
      if (!SOUND) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var t = audioCtx.currentTime;
        // 空腔木头音：低频三角波 + 快速衰减
        var osc = audioCtx.createOscillator();
        var g1 = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.09);
        g1.gain.setValueAtTime(0.18, t);
        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g1).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.14);
        // 一瞬间的敲击噪声
        var buf = audioCtx.createBuffer(1, 96, audioCtx.sampleRate);
        var ch = buf.getChannelData(0);
        for (var i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
        var src = audioCtx.createBufferSource();
        var g2 = audioCtx.createGain();
        src.buffer = buf;
        g2.gain.setValueAtTime(0.12, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        src.connect(g2).connect(audioCtx.destination);
        src.start(t);
      } catch (e) { /* 静音也能敲 */ }
    }

    function hit() {
      count++;
      label.textContent = '功德 ' + count;
      try { localStorage.setItem('mokuo_count', String(count)); } catch (e) {}
      btn.classList.remove('hit');
      void btn.offsetWidth;
      btn.classList.add('hit');
      ring.classList.remove('show');
      void ring.offsetWidth;
      ring.classList.add('show');
      pop.classList.remove('show');
      void pop.offsetWidth;
      pop.classList.add('show');
      tok();
      if (navigator.vibrate) { try { navigator.vibrate(18); } catch (e) {} }
    }

    btn.addEventListener('click', hit);
    btn.addEventListener('touchstart', function (e) {
      e.preventDefault();   // 手机上避免双击缩放和点击延迟
      hit();
    }, { passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
