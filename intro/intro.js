/*!
 * luliy.me 开场动画：单文件，无依赖
 *
 * 用法：把 intro 文件夹放到站点根目录，然后在首页 index.html 的 <head> 里加一行：
 *   <script src="intro/intro.js"></script>
 * 文件夹内容：intro.js  intro.mp4（竖屏）  intro-wide.mp4（横屏，可选）  poster.jpg（可选）
 * 只会下载当前屏幕用得上的那一个视频
 *
 * 调试：网址后加 ?intro=1 强制重播，?intro=0 强制跳过
 */
(function () {
  'use strict';

  /* ============ 只需要改这里 ============ */
  var CFG = {
    // 竖屏版（手机，屏幕宽 < 高时用）。路径相对于本脚本所在目录
    portrait: {
      video: 'intro.mp4',
      poster: 'poster.jpg',  // 视频加载前显示的首帧图，没有就留着也行
      pupilX: 0.5,           // 视频结尾"瞳孔"中心的位置，0~1，按视频画面算
      pupilY: 0.5
    },
    // 横屏版（电脑、横着拿的手机，屏幕宽 ≥ 高时用）
    // 16:9 版还没做好就把 video 留空，横屏会自动用竖屏版
    landscape: {
      video: 'intro-wide.mp4',
      poster: 'poster-wide.jpg',
      pupilX: 0.5,
      pupilY: 0.5
    },
    title: '世界以痛吻我，要我报之以歌',
    subtitle: 'The world has kissed my soul with its pain, asking for its return in songs.',
    titleAt: 4.5,            // 标题出现的时间点（秒）
    revealMs: 1300,          // 从瞳孔扩开、露出网站的时长
    startTimeoutMs: 4000,    // 视频这么久还没开始播，就直接放行
    storageKey: 'luliy_intro_seen_v1'
  };
  /* ===================================== */

  var root = document.documentElement;
  var scriptSrc = (document.currentScript && document.currentScript.src) || '';
  var base = scriptSrc.replace(/[^\/]*$/, '');
  var q = location.search;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function seen() {
    try { return localStorage.getItem(CFG.storageKey) === '1'; } catch (e) { return false; }
  }
  function mark() {
    try { localStorage.setItem(CFG.storageKey, '1'); } catch (e) {}
  }

  if (/[?&]intro=0(&|$)/.test(q)) return;
  if (!/[?&]intro=1(&|$)/.test(q) && (seen() || reduceMotion)) return;

  var FEATHER = 80; // 瞳孔扩开时边缘的柔化宽度（px）

  var CSS = `
html.intro-pending:not(.intro-ready){background:#000}
html.intro-pending,html.intro-pending body{overflow:hidden}
html.intro-pending:not(.intro-ready) body{visibility:hidden}
#luliy-intro{
  --x:50%;--y:50%;--r:0px;
  position:fixed;inset:0;z-index:2147483000;background:#000;overflow:hidden;
  -webkit-mask-image:radial-gradient(circle at var(--x) var(--y),transparent calc(var(--r) - ${FEATHER}px),#000 var(--r));
          mask-image:radial-gradient(circle at var(--x) var(--y),transparent calc(var(--r) - ${FEATHER}px),#000 var(--r));
}
#luliy-intro video{position:absolute;inset:0;width:100%;height:100%;display:block;background:#000}
#luliy-intro .li-title{
  position:absolute;left:0;right:0;bottom:calc(12% + env(safe-area-inset-bottom,0px));
  text-align:center;color:#e9d6ac;pointer-events:none;
  opacity:0;transition:opacity 1.4s ease;
}
#luliy-intro .li-zh{
  margin:0;padding-left:.45em;letter-spacing:.45em;
  font:600 clamp(28px,7vw,56px)/1.3 "Songti SC","Noto Serif SC","Source Han Serif SC",STSong,serif;
  text-shadow:0 2px 18px rgba(0,0,0,.6);
}
#luliy-intro .li-en{
  margin:.7em 0 0;letter-spacing:.06em;opacity:.72;
  font:italic 400 clamp(13px,3.2vw,20px)/1.4 Georgia,"Times New Roman",serif;
}
#luliy-intro.show-title .li-title{opacity:1}
#luliy-intro .li-skip{
  position:absolute;top:calc(env(safe-area-inset-top,0px) + 14px);right:16px;
  padding:6px 14px;border-radius:999px;cursor:pointer;
  color:rgba(255,255,255,.78);background:rgba(0,0,0,.35);
  border:1px solid rgba(255,255,255,.25);font:13px/1.4 system-ui,sans-serif;
}
#luliy-intro .li-skip:focus-visible{outline:2px solid #e9d6ac;outline-offset:2px}
#luliy-intro.is-revealing .li-title,
#luliy-intro.is-revealing .li-skip{opacity:0;transition:opacity .3s}
`;

  root.classList.add('intro-pending');
  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var el, video, cur;
  var px = 0, py = 0, far = 0;

  // 按屏幕比例选视频：宽 ≥ 高用横屏版（没填就退回竖屏版），否则用竖屏版
  function pick() {
    var wide = window.innerWidth >= window.innerHeight;
    return wide && CFG.landscape.video ? CFG.landscape : CFG.portrait;
  }
  var fading = false, finished = false, startTimer;

  // 算出瞳孔在屏幕上的位置，以及它到最远屏幕角的距离
  function layout() {
    if (!el || !video) return;
    var cw = el.clientWidth, ch = el.clientHeight;
    var vw = video.videoWidth, vh = video.videoHeight;
    if (!vw || !vh || !cw || !ch) return;
    // 屏幕比例和视频接近就铺满（会裁掉一点边）；差得多就完整显示，留黑边
    var r = (cw / ch) / (vw / vh);
    var cover = r >= 1 / 1.3 && r <= 1.3;
    video.style.objectFit = cover ? 'cover' : 'contain';
    var s = cover ? Math.max(cw / vw, ch / vh) : Math.min(cw / vw, ch / vh);
    px = (cw - vw * s) / 2 + cur.pupilX * vw * s;
    py = (ch - vh * s) / 2 + cur.pupilY * vh * s;
    far = Math.max(
      Math.hypot(px, py), Math.hypot(cw - px, py),
      Math.hypot(px, ch - py), Math.hypot(cw - px, ch - py)
    );
    el.style.setProperty('--x', px + 'px');
    el.style.setProperty('--y', py + 'px');
  }

  function finish(remember) {
    if (finished) return;
    finished = true;
    clearTimeout(startTimer);
    if (remember) mark();
    video.pause();
    el.remove();
    root.classList.remove('intro-pending', 'intro-ready');
    style.remove();
    window.removeEventListener('resize', layout);
    document.removeEventListener('keydown', onKey);
  }

  function fadeOut(remember) {
    if (finished || fading) return;
    fading = true;
    el.style.transition = 'opacity .4s';
    el.style.opacity = '0';
    setTimeout(function () { finish(remember); }, 420);
  }

  // 视频播完：从瞳孔位置扩开一个圆，露出真实网站
  function reveal() {
    if (finished || fading) return;
    fading = true;
    layout();
    el.classList.add('is-revealing');
    var max = far + FEATHER;
    var t0 = performance.now();
    (function tick(now) {
      var k = Math.min(1, (now - t0) / CFG.revealMs);
      var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // easeInOutCubic
      el.style.setProperty('--r', (max * e) + 'px');
      if (k < 1) requestAnimationFrame(tick); else finish(true);
    })(t0);
  }

  function onKey(e) { if (e.key === 'Escape') fadeOut(true); }

  function build() {
    el = document.createElement('div');
    el.id = 'luliy-intro';
    el.innerHTML =
      '<video></video>' +
      '<div class="li-title"><p class="li-zh"></p><p class="li-en"></p></div>' +
      '<button class="li-skip" type="button">跳过</button>';
    video = el.querySelector('video');
    el.querySelector('.li-zh').textContent = CFG.title;
    el.querySelector('.li-en').textContent = CFG.subtitle;

    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'auto';
    cur = pick();
    if (cur.poster) video.poster = base + cur.poster;
    video.src = base + cur.video;

    document.body.insertBefore(el, document.body.firstChild);
    root.classList.add('intro-ready');

    video.addEventListener('loadedmetadata', layout);
    video.addEventListener('playing', function () { clearTimeout(startTimer); });
    video.addEventListener('timeupdate', function () {
      if (video.currentTime >= CFG.titleAt) el.classList.add('show-title');
    });
    video.addEventListener('ended', reveal);
    video.addEventListener('error', function () { fadeOut(false); }); // 加载失败：直接放行，下次还会再试
    el.querySelector('.li-skip').addEventListener('click', function () { fadeOut(true); });
    window.addEventListener('resize', layout);
    document.addEventListener('keydown', onKey);

    startTimer = setTimeout(function () { fadeOut(false); }, CFG.startTimeoutMs);

    var p = video.play();
    if (p && p.catch) p.catch(function () { fadeOut(false); }); // 被浏览器拦截自动播放：直接放行
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
