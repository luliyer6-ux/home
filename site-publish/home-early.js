/* LULIY early routing, inlined at the very top of <head> by optimize-home.py (runs before the router).
   Phones open on the article list: a bare https://luliy.me/ becomes #/posts, and the prologue is skipped on phones.
   The full home stays one tap away (directory -> 首頁) and is kept for ?home, ?intro=1 and every deep link. */
(function () {
  // Data saver (Android "Lite mode" / Save-Data): CSS and home-fixes.js skip decorative downloads.
  try { if (navigator.connection && navigator.connection.saveData) document.documentElement.classList.add('luliy-save-data'); } catch (e) {}
  try {
    // Use the screen, not the viewport: this runs before <meta name=viewport>, when phones still report 980px.
    if (!matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) >= 600) return;
    var q = new URLSearchParams(location.search);
    if (q.has('home') || q.get('intro') === '1' || q.get('intro') === 'eye') return;
    // Articles open straight away: mark the prologue as seen, so intro.js does not cover the page
    // with its loading veil until every resource has finished (that is what returning visitors get already).
    try { localStorage.setItem('luliy_intro_seen_v1', String(Date.now())); } catch (e) {}
    var path = location.pathname.replace(/\/+$/, '');
    if (path !== '' && !/^\/index\.html$/i.test(path)) return;
    if (location.hash && !/^#\/?(?:\?|$)/.test(location.hash)) return;
    history.replaceState(history.state, '', location.pathname + location.search + '#/posts');
  } catch (e) {}
})();

/* Dark palettes (墨綠 / 暖墨 / 夜藍 / 酒紅, chosen in the theme picker, home-fixes.js block 14): put the saved one on
   <html data-palette> before the first paint; no saved choice defaults to 夜藍 (midnight), 'dark' means base dark chosen.
   The colours only apply on top of the dark appearance (design-tokens.css). */
(function () {
  try {
    var p = localStorage.getItem('luliy-palette');
    if (/^(forest|espresso|midnight|oxblood)$/.test(p || '')) document.documentElement.dataset.palette = p;
    else if (p !== 'dark') document.documentElement.dataset.palette = 'midnight';
  } catch (e) {}
})();

/* Footer pictures wait on touch screens. The footer sits fixed behind the page (curtain reveal), so the browser
   counts it as visible and loading="lazy" does nothing: every page used to fetch 0.8–2 MB of footer portraits
   (plus the 0.5 MB left art) that most readers never scroll down to. runtime-fixes.py routes the router's
   footerImage.src through LuliyFooterSrc; the left art ships as data-src. Desktop is unchanged. */
(function () {
  var wait = [], since = 0;
  function coarse() { try { return matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } }
  function near() {
    var d = document.documentElement;
    return d.scrollHeight - (window.scrollY + window.innerHeight) < window.innerHeight * 1.5;
  }
  function set(img, src) { if (img.getAttribute('src') !== src) img.src = src; }
  function flush(force) {
    if (!wait.length) return;
    // The router writes the footer before the page content exists, so "near the bottom" only counts
    // after the reader scrolled, or once the page has had a few seconds to fill in.
    if (!force && !(near() && (window.scrollY > 0 || Date.now() - since > 4000))) return;
    var list = wait; wait = [];
    for (var i = 0; i < list.length; i++) set(list[i][0], list[i][1]);
  }
  window.LuliyFooterSrc = function (img, src) {
    for (var i = wait.length - 1; i >= 0; i--) if (wait[i][0] === img) wait.splice(i, 1);
    if (!coarse()) { set(img, src); return; }
    wait.push([img, src]); since = Date.now();
    setTimeout(function () { flush(false); }, 4100);
  };
  addEventListener('scroll', function () { flush(false); }, { passive: true });
  addEventListener('resize', function () { flush(false); });
  addEventListener('focusin', function (e) { if (e.target && e.target.closest && e.target.closest('#contact')) flush(true); });
  document.addEventListener('DOMContentLoaded', function () {
    var art = document.querySelector('.footer-left-art[data-src]');
    if (art && !document.documentElement.classList.contains('luliy-save-data')) window.LuliyFooterSrc(art, art.dataset.src);
  });
})();

/* 動態效果 (motion) switch, offered in the directory. When it is off, every script asking
   matchMedia('(prefers-reduced-motion: reduce)') hears "reduce" (and is told when it changes), so the moon, dust,
   galaxy and record player settle exactly as they do for system reduced motion; html.luliy-calm does the same for CSS. */
(function () {
  var root = document.documentElement, KEY = 'luliy-motion', calm = false;
  try { calm = localStorage.getItem(KEY) === 'off'; } catch (e) {}
  if (calm) root.classList.add('luliy-calm');
  var real = window.matchMedia && window.matchMedia.bind(window);
  if (!real) return;
  var wrapped = [];
  function Wrapped(mql, reduce) {
    var self = this;
    this._m = mql; this._reduce = reduce; this._fns = []; this.media = mql.media; this.onchange = null; this._last = this.matches;
    var relay = function () { self._fire(); };
    if (mql.addEventListener) mql.addEventListener('change', relay); else if (mql.addListener) mql.addListener(relay);
  }
  Object.defineProperty(Wrapped.prototype, 'matches', { get: function () { return this._reduce ? (this._m.matches || calm) : (this._m.matches && !calm); } });
  Wrapped.prototype._fire = function () {
    var now = this.matches;
    if (now === this._last) return;
    this._last = now;
    var ev = { type: 'change', matches: now, media: this.media };
    if (typeof this.onchange === 'function') try { this.onchange(ev); } catch (e) {}
    this._fns.slice().forEach(function (fn) { try { typeof fn === 'function' ? fn(ev) : fn.handleEvent(ev); } catch (e) {} });
  };
  Wrapped.prototype.addEventListener = function (type, fn) { if (type === 'change' && fn && this._fns.indexOf(fn) < 0) this._fns.push(fn); };
  Wrapped.prototype.removeEventListener = function (type, fn) { var i = this._fns.indexOf(fn); if (type === 'change' && i >= 0) this._fns.splice(i, 1); };
  Wrapped.prototype.addListener = function (fn) { this.addEventListener('change', fn); };
  Wrapped.prototype.removeListener = function (fn) { this.removeEventListener('change', fn); };
  Wrapped.prototype.dispatchEvent = function () { return true; };
  window.matchMedia = function (q) {
    var mql = real(q), m = /^\(\s*prefers-reduced-motion\s*:\s*(reduce|no-preference)\s*\)$/.exec(String(q).trim());
    if (!m) return mql;
    var w = new Wrapped(mql, m[1] === 'reduce');
    wrapped.push(w);
    return w;
  };
  window.LuliyMotion = {
    get calm() { return calm; },
    set: function (off) {
      calm = !!off;
      try { if (calm) localStorage.setItem(KEY, 'off'); else localStorage.removeItem(KEY); } catch (e) {}
      root.classList.toggle('luliy-calm', calm);
      wrapped.forEach(function (w) { w._fire(); });
      try { document.dispatchEvent(new CustomEvent('luliy:motion', { detail: { calm: calm } })); } catch (e) {}
    }
  };
})();

/* Site loader (2026-10-30). Every full page load, every device, every page of the site. It replaces the opening
   (prologue + eye, intro/intro.js, no longer loaded; its files stay in /intro) and the old phones-only first-visit screen.
   The pensive-figure L starts as a thin white outline; gold rises from the bottom and fills it, holds, fades, and starts again
   (no ring, no breathing). Only transform and opacity animate, so it keeps moving while the page is busy underneath.
   When the page is ready the gold is brought up to full quickly (<= 0.45 s) and then the cover fades, so every load ends on a full logo.
   window.LuliyLoaderLook() / LuliyLoaderFinish() let the Study / Records switch (home-fixes.js section 21) use the very same loader.
   It lifts only when the page below is really ready, so nobody sees a half-built page or a stutter:
     #/books   the study room is revealing (or fell back)      #/music   the turntable has drawn its first frame
     home      the homepage 3D study is prepared                 #/article the text is in
     elsewhere #main is rendered and nothing in it is still data-loading / aria-busy
   and the web fonts are ready. Shown at least 0.7 s (no flash), at most 8 s on the rooms and 6 s elsewhere.
   While it is up <html> has intro-pending, and lifting fires luliy:intro-complete: the code that used to wait for
   the opening (homepage handwriting, fade-ins) now waits for this instead. ?loader=0 skips it. */
(function () {
  var root = document.documentElement;
  var CYCLE = 3.6, FULL = 0.64, FADE = 0.8; // seconds per loop; fraction where the logo is full; where the gold starts to fade

  // Colours follow the chosen appearance, so this is computed whenever a loader is built.
  function look() {
    var a = 'dark';
    try { a = localStorage.getItem('luliy-appearance') || (localStorage.getItem('luliy-paper-ink') === 'light' ? 'cc' : 'dark'); } catch (e) {}
    var sky = function (c) { return 'linear-gradient(189deg,' + c[0] + ' .55%,' + c[1] + ' 30.38%,' + c[2] + ' 65.19%,' + c[3] + ' 100%)'; };
    var P = {
      forest: ['#1d2a25', '#17221e', '#111a17', '#0b110f'], espresso: ['#2a231d', '#211c17', '#181411', '#0f0d0b'],
      midnight: ['#1d212b', '#171a22', '#111319', '#0a0b0f'], oxblood: ['#2b181b', '#221316', '#190e10', '#10090a']
    }[document.documentElement.dataset.palette];
    var C = {
      cc: [sky(['#1f1f38', '#18182d', '#111222', '#0c0d1b']), 'rgba(234,223,190,.42)', '#f0d68f'],
      light: ['#faf9f5', 'rgba(20,20,19,.34)', '#9b7444'],
      dark: [P ? sky(P) : '#111110', 'rgba(242,237,228,.36)', '#d8b878']
    }[a] || null;
    if (!C) C = ['#111110', 'rgba(242,237,228,.36)', '#d8b878'];
    var shapes = ['M8.8 57.8a24 24 0 0 1-4.8-1l.2-.2c1-.6 2.3-2.2 3.1-3.4 1.4-2.2 1.9-4.4 2-8q.3-4.6 1.7-8a24 24 0 0 1 5-7.4l.1.8c.3 1.5 1 3.9 1.3 4.8q.2.3.4 0l.7-.1-.3-1a24 24 0 0 1-1.3-5.6l.4.9a34 34 0 0 0 5 9.3q2 2.3 3.6 2 1.3-.5 2.4-2 1.6-2.4 2.7-6l.6-2 1-3.5c.2-1 .1-1.4-.6-2.5l-1.2-1.8-.2-.3h-2.2l-.4-.2-1 .5c-.9.5-.9.5-1.2.5l-.7-.2.4-.3 1.1-.7c1.2-.7 1.3-.7 2-.6h1.3c1.3 0 1.2 0 2.1 1.4l1.4 2.5q.3.4.1.8c0 .7-.5 3-1 4.4q0 .6-.3 1.3c-.7 2.6-2 5.8-3.2 7.5q-3.2 4.4-7.3.3l-1.3-1.7-.1.5-.2 1.6-.3 1.2A35 35 0 0 1 14.3 53c0 .1 1.8-.1 3-.4l2.9-1c3-1 4.2-1.3 6.7-1.9q8.3-1.9 15 1.1l1.4.8-.7-.1A20 20 0 0 0 31 51a62 62 0 0 0-8.6 3.3 37 37 0 0 1-6.9 2.8q-3.7.9-6.7.6',
      'M26 37.3c0-1-.9-3.4-2-5.7l-.7-2.2-.2-2q-.2-2.9-1.2-4.7c-.6-1.4-2-3-3.7-4q-1-.6.1-.2a11 11 0 0 1 3.8 2.7v-.3q0-1 1-2.3l.2-.4.2-.3v-1c0-1 0-1.3.4-1.8q.3-.5.2 0v1.3l.1-.2.4-.4 1.1-.8 1.3-1q0-.5.3 0 .6 1.1 2.2 1.3 1 0 .2-.1-.8-.3-1.5-1l-1-1.2 1 .3q2.4 1.1 4 .9a3 3 0 0 0 2.2-1.5q.1-.2 0 .4-.3 3-1.7 3.5l-.4.2q-.2 0-1 2.1c-.3 1-.3 1-.6 1l-.8-.2-.3-.1-.1.2q-.2.4-.6.4-.2 0-.3.2-.2.3-.5.2t-.7.5-1 .5q-.9 0-1.7-1.2t-1.2-.8q-.7.3-.8 1.3c-.1.6 0 .8.4 1.9q.8 1.4 1 2.6l.5 4.4.9 2.3.7 1.9.1-.2.9-1.5c.8-1 2-3 2.5-3.8l.4-1.2q0-.4-.5-.9-.7-.6-1-1.4l-.7-.8q-.9-.9-.3-.8c.9.1 1.1.3 2 1.5l.5.7c1 1 1.2 1.7.5 3.3l-2.2 3.6q-1.2 1.6-1.9 3.4z',
      'M45 58q-2-.3-4.3-1a24 24 0 0 0-12.6-1.2l-1 .2s1.5-.6 2.5-.8q5.8-1.4 11-.2c4 .9 5.7 1.1 7.2 1q1 0 0-.2-2 0-5.1-1a26 26 0 0 0-14.4-.5l-1.1.3-3.8 1.4a29 29 0 0 1 11.3-4.3h3.5c1.7.2 2.9.4 5 1l4.7 1.2h2.4a8 8 0 0 0 5.3-3l.4-.5-.4 1.6q-1 3-3.7 4.6c-1.8 1-4.5 1.6-7 1.3',
      'm29.1 12.9-1.3-.6q-.6-.6-1.3-.4-.5.2-.4 0l.8-.3h1.4q1.4 0 1.8-.2h-.5l-2-.2q-.4 0-.1-.2a5 5 0 0 1 1.8-1q.7-.3 2.5 0a4 4 0 0 0 2 0c.2 0-1 1.4-1.7 2q-1.3 1-3 .9',
      'M17.5 16.8h-1.8l.4-.4q1-1 1.7-1.1l1.5-.1h.9l.3-.1-.5.7q-1.1 1.3-2.6 1',
      'm26.1 7.3-.5-.2.4-.3.5-.3-.6.2-.4.1.5-.6q1.2-1 3.2-.2.6.3.2.4-.6 0-1.3.5-1 .7-2 .4',
      'M23.8 10.4V10l-.3-.8c-.3-.7-.3-.9 0-1.5q.6-.9 1-1v.4l.3 1.2V9l-.2.4-.4.6q-.3.6-.4.4',
      'm21.4 16.2.3-.9q.4-.7 1.4-1l.6-.3q.3 0 0 .3-.4.6-1.4 1.3l-.7.5z',
      'm32.8 9-.2-.1q-1.1-.7-1.4-1.2L31 6.6l1 .4q.6.6.8 1.3z',
      'M22.3 10.3c-.3 0-.6-.7-.7-1.2l-.2-.7h.5l.7.3q.4 0 .7.8l.3.8z',
      'm21.3 13.7.9-1q.4-.4 1-.4.8 0 .7.2l-1 .9h-.7l-.6.2z',
      'M19.5 13.2v-1q.1-.8.8-1.1.6-.3.2.1l-.2.6-.4 1-.3.6q0 .4-.1-.2',
      'M26.9 10.1v-1Q27 8 28 7.7q.3 0 0 .3l-.2.7c-.1.6-.1.6-.6 1z',
      'm30.7 9-.8-.4c-.2-.2-.6-.9-.5-1l.9.3.3.3.4.5q.5.5-.3.3',
      'm24.7 11.5-.5-.2-.5-.1.2-.1.1-.1q.4-.5 1-.6l1.1.2-.2.3q-.5.6-1.2.6',
      'M25.1 14.4v-.5q.2-.8.7-.9l.4-.2q.5-.3.3.3-.1.6-.9 1l-.3.2z',
      'm14.2 13.4.2-.3q.3-.6.7-.7l1-.2c.1 0-.3.8-.5.9q-.2.3-1 .3z',
      'M32.1 13.4h-.2c0-.2.6-.7.9-.8l.6-.1h.5l-.3.4c-.6.4-.8.5-1.5.5',
      'M26.6 25.1q-.6-.3-.7-.7l1-.1q.2-.1.6.4l.3.3c0 .1-.8.2-1.2.1',
      'M21.3 13q-.3-.8.3-1.4.3-.4.3.2.1.5-.2.9l-.2.4q0 .3-.2-.1',
      'M35 9.8v-.6q0-.6.6-.8.4-.3.3.1 0 .5-.6 1-.3.5-.4.3',
      'M19.4 10.4q0-.5.5-.8l.5.1c0 .2-.9.8-1 .7',
      'm17.6 13.9-.2-.2-.1-.1v-.2q.4-.5.7 0 .2.2 0 .3-.4.4-.4.2'];
    var light = a === 'light';
    var line = light ? 'rgba(20,20,19,.45)' : 'rgba(255,255,255,.55)', gold = light ? '#a67c45' : '#e0bd73', gold2 = light ? '#c9a468' : '#f3dca0';
    var paths = function () { return shapes.map(function (d) { return '<path d="' + d + '"/>'; }).join(''); };
    var K = '#luliy-room-loader ';
    var css = '#luliy-room-loader{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:' + C[0] + ';transition:opacity 450ms cubic-bezier(.22,.61,.36,1);will-change:opacity;transform:translateZ(0)}' +
      '#luliy-room-loader.is-done{opacity:0;pointer-events:none}' +
      K + '.lrl-mark{--s:104px;position:relative;width:var(--s);height:var(--s)}' +
      K + '.lrl-mark svg{position:absolute;left:0;bottom:0;width:var(--s);height:var(--s);overflow:visible;stroke-linejoin:round;stroke-linecap:round}' +
      K + '.lrl-line{fill:none;stroke:' + line + ';stroke-width:.6}' +
      // the rising window is 1.4x the logo tall: its soft top edge sits above the logo once the logo is full
      K + '.lrl-rise{position:absolute;left:-4px;right:-4px;bottom:0;height:calc(var(--s)*1.4);overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 30%);mask-image:linear-gradient(to bottom,transparent 0,#000 30%);will-change:transform,opacity;animation:luliy-loader-rise ' + CYCLE + 's cubic-bezier(.35,.12,.6,.88) infinite}' +
      K + '.lrl-rise-in{position:absolute;left:4px;bottom:0;width:var(--s);height:var(--s);will-change:transform;animation:luliy-loader-rise-in ' + CYCLE + 's cubic-bezier(.35,.12,.6,.88) infinite}' +
      K + '.lrl-rise-in svg{fill:' + gold + ';stroke:' + gold2 + ';stroke-width:.35}' +
      '@keyframes luliy-loader-rise{0%{transform:translateY(calc(var(--s)*1.4));opacity:1}' + (FULL * 100) + '%{transform:translateY(0);opacity:1}' + (FADE * 100) + '%{transform:translateY(0);opacity:1}94%{transform:translateY(0);opacity:0}100%{transform:translateY(calc(var(--s)*1.4));opacity:0}}' +
      '@keyframes luliy-loader-rise-in{0%{transform:translateY(calc(var(--s)*-1.4))}' + (FULL * 100) + '%{transform:translateY(0)}94%{transform:translateY(0)}100%{transform:translateY(calc(var(--s)*-1.4))}}' +
      // reduced motion / calm mode: a still logo, already gold
      '@media(prefers-reduced-motion:reduce){' + K + '.lrl-rise,' + K + '.lrl-rise-in{animation:none;transform:none;opacity:1}}' +
      'html.luliy-calm ' + K + '.lrl-rise,html.luliy-calm ' + K + '.lrl-rise-in{animation:none;transform:none;opacity:1}';
    var svg = '<svg viewBox="0 0 60 60">' + paths() + '</svg>';
    var html = '<div class="lrl-mark"><svg class="lrl-line" viewBox="0 0 60 60">' + paths() + '</svg><div class="lrl-rise"><div class="lrl-rise-in">' + svg + '</div></div></div>';
    return { css: css, html: html };
  }

  // Bring the gold to full quickly, then call done(). Mid-rise: speed the rise up (<= 0.45 s). Already full: a short hold.
  // Already fading out: nothing to finish, the cover fades straight away. Reduced motion (no animation): done at once.
  function finish(el, done) {
    var as = [];
    try { as = el.getAnimations({ subtree: true }).filter(function (x) { return x.effect && x.playState !== 'finished'; }); } catch (e) {}
    if (!as.length) { done(); return; }
    var t = (as[0].currentTime % (CYCLE * 1000)) / 1000;
    if (t >= CYCLE * FADE) { done(); return; }
    if (t >= CYCLE * FULL) { setTimeout(done, 220); return; }
    var left = CYCLE * FULL - t, ms = Math.min(450, Math.max(160, left * 1000));
    as.forEach(function (x) { x.playbackRate = (left * 1000) / ms; });
    setTimeout(function () {
      as.forEach(function (x) { x.pause(); x.currentTime = CYCLE * FULL * 1000; });
      setTimeout(done, 180);
    }, ms + 30);
  }
  window.LuliyLoaderLook = look;
  window.LuliyLoaderFinish = finish;

  try { if (new URLSearchParams(location.search).get('loader') === '0') return; } catch (e) {}
  var L = look();
  var style = document.createElement('style');
  style.textContent = L.css;
  (document.head || root).appendChild(style);
  var el = document.createElement('div');
  el.id = 'luliy-room-loader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = L.html;
  root.appendChild(el);
  root.classList.add('intro-pending');
  var state = window.LuliySiteLoader = { active: true };

  var t0 = Date.now(), gone = false, finishing = false, fontsOk = !document.fonts, prep = null, prepDone = false;
  if (document.fonts) document.fonts.ready.then(function () { fontsOk = true; }, function () { fontsOk = true; });
  function route() {
    var h = location.hash || '';
    if (/^#\/books(?=$|[/?])/.test(h)) return 'books';
    if (/^#\/music(?=$|[/?])/.test(h)) return 'music';
    if (!h || /^#\/?(?:\?|$)/.test(h)) return 'home';
    if (/^#\/article\//.test(h)) return 'article';
    return 'page';
  }
  function ready() {
    var main = document.getElementById('main');
    if (!main || !main.firstElementChild) return false;
    switch (route()) {
      case 'books': { var s = document.getElementById('studyRoom'); return !!s && (s.classList.contains('is-revealing') || s.classList.contains('has-fallback')); }
      case 'music': return !!main.querySelector('#recordMount.lr-webgl-ready, #recordMount .lr-webgl-ready, #recordMount.has-fallback, #recordMount .has-fallback');
      case 'home':
        if (!prep && typeof window.LuliyHomepagePrepare === 'function') {
          prep = Promise.resolve().then(window.LuliyHomepagePrepare).then(function () { prepDone = true; }, function () { prepDone = true; });
        }
        return prepDone;
      case 'article': { var b = document.getElementById('sourceArticleBody'); return !!b && b.dataset.loading !== 'true'; }
      default: return !main.querySelector('[data-loading="true"], [aria-busy="true"]');
    }
  }
  function lift(why) {
    if (gone) return;
    gone = true;
    state.reason = why || 'cap'; state.at = Date.now() - t0;
    clearTimeout(cap);
    setTimeout(function () {
      // two frames, so the page's first finished frame is on screen before the cover fades
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        el.classList.add('is-done');
        root.classList.remove('intro-pending');
        state.active = false;
        try { dispatchEvent(new CustomEvent('luliy:intro-complete')); } catch (e) {}
        setTimeout(function () { el.remove(); style.remove(); }, 500);
      }); });
    }, Math.max(0, 700 - (Date.now() - t0)));
  }
  function check() {
    if (gone) return;
    if (fontsOk && ready()) { if (!finishing) { finishing = true; finish(el, function () { lift('ready'); }); } return; }
    setTimeout(check, 80);
  }
  var r0 = route(), cap = setTimeout(lift, r0 === 'books' || r0 === 'music' ? 8000 : 6000);
  check();
})();

/* Mainland China: raw.githubusercontent.com (article list, article bodies, about page, photos) is often blocked there,
   while luliy.me itself is reachable. Fetches of the blog's GitHub content go to the relay on this site first
   (functions/gh/, README 9.4); the relay also rewrites the photo addresses inside the text it returns.
   If the relay is missing (local preview) or cannot reach GitHub, the original address is tried. */
(function () {
  var web = /^https?:$/.test(location.protocol);
  var RAW = /^https:\/\/raw\.githubusercontent\.com\/luliy6\/luliy6\.github\.io\/(?:refs\/heads\/)?main\/((?:docs|static)\/[^?#]+)(\?[^#]*)?$/;
  var API = /^https:\/\/api\.github\.com\/repos\/luliy6\/luliy6\.github\.io\/(issues(?:\/\d+(?:\/comments)?)?(?:\?[^#]*)?)$/;
  var UA = /^https:\/\/github\.com\/user-attachments\/assets\/([0-9a-f]{8}-[0-9a-f-]{27})$/i;
  var CAMO = /^https:\/\/camo\.githubusercontent\.com\/([0-9a-f]{20,64}(?:\/[0-9a-f]+)?)$/i;
  function relay(href) {
    var m = RAW.exec(href);
    if (m) return '/gh/raw/' + m[1] + (m[2] || '');
    m = API.exec(href);
    return m ? '/gh/api/' + m[1] : null;
  }
  function picture(href) {
    var m = RAW.exec(href) || UA.exec(href) || CAMO.exec(href);
    if (!m || !web) return null;
    return (m[0].indexOf('https://raw.') === 0 ? '/gh/raw/' : m[0].indexOf('https://github.com/') === 0 ? '/gh/ua/' : '/gh/camo/') + m[1] + (m[2] || '');
  }
  var BACK = [[/^\/gh\/raw\//, 'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/'],
    [/^\/gh\/ua\//, 'https://github.com/user-attachments/assets/'], [/^\/gh\/camo\//, 'https://camo.githubusercontent.com/']];
  function direct(href) {
    var path = href.indexOf(location.origin + '/') === 0 ? href.slice(location.origin.length) : href;
    for (var i = 0; i < BACK.length; i++) if (BACK[i][0].test(path)) return path.replace(BACK[i][0], BACK[i][1]);
    return null;
  }
  // A picture that does not load gets one more try by the other road: relayed ones from GitHub itself
  // (relay down, or a local preview without it), GitHub ones (older saved covers and pages) through the relay.
  addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.luliyRetry) return;
    var src = img.getAttribute('src') ? img.src : '', next = src && (direct(src) || picture(src));
    if (!next) return;
    img.dataset.luliyRetry = '1';
    img.src = next;
  }, true);
  if (!web || !window.fetch) return;
  var real = window.fetch;
  window.LuliyRelayUrl = relay;
  window.fetch = function (input, init) {
    var href = typeof input === 'string' ? input : (input instanceof URL ? input.href : '');
    var via = href && relay(href);
    if (!via) return real.apply(this, arguments);
    var signal = init && init.signal;
    function original() { return real.call(window, href, init); }
    return real.call(window, via, init).then(function (r) {
      if (r.headers.get('X-Luliy-Relay') && r.status < 500 && r.status !== 403 && r.status !== 429) return r;
      if (signal && signal.aborted) return r;
      return original().catch(function () { return r; });
    }, function (e) {
      if (signal && signal.aborted) throw e;
      return original();
    });
  };
})();

/* Route flag for CSS: <html class="luliy-route-about"> while #/about is open. Phones hide the ULIY wordmark
   everywhere except About (home-fixes.css, "Brand on phones"); setting it here avoids a flash on a direct visit. */
(function () {
  function sync() {
    var r = (location.hash || '').replace(/^#\/?/, '').split(/[\/?]/)[0];
    document.documentElement.classList.toggle('luliy-route-about', r === 'about');
  }
  sync();
  addEventListener('hashchange', sync);
})();
/* Room gate (2026-10-30). Registered here, before the router's own hashchange listener, so that
   home-fixes.js (section 21) can hold a Study (#/books) or Records (#/music) navigation until its
   loader has painted. Until home-fixes.js has loaded, nothing is held. */
(function () {
  addEventListener('hashchange', function (e) {
    var gate = window.LuliyRoomGate;
    if (typeof gate === 'function') gate(e);
  });
})();

/* Journal split (2026-10-30). Gmeek Issues carrying the label `journal` are short notes (短札), not articles.
   This wraps fetch() for the Gmeek feed (postList.json) before the router's first request: the journal
   entries are taken out of the copy the article list, archive, home page and prev/next links see, and are
   kept on window.LuliyJournal for the 短札 tab (home-fixes.js section 32). The last good list is cached in
   localStorage so the tab still opens offline. Nothing is removed from the blog itself. */
(function () {
  var FEED = /\/luliy6\/luliy6\.github\.io\/main\/docs\/postList\.json(?:[?#]|$)/;
  var KEY = 'luliy-journal-feed-v1';
  var RAW = 'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/';
  var ORIGIN = 'https://blog.luliy.me/';
  var J = window.LuliyJournal = { items: null, failed: false };
  var orig = window.fetch;
  if (typeof orig !== 'function') return;
  function publish(items, failed) {
    J.items = items; J.failed = !!failed;
    try { dispatchEvent(new CustomEvent('luliy-journal-feed')); } catch (e) {}
  }
  function names(item) {
    var l = item && item.labels;
    return Array.isArray(l) ? l.map(function (x) { return String(x && x.name !== undefined ? x.name : x).trim(); }) : [];
  }
  function stamp(item) {
    var n = Number(item.createdAt);
    if (isFinite(n) && n > 0) return n > 1e12 ? n : n * 1000;
    return 0;
  }
  function convert(key, item) {
    var labels = names(item), url = '', body = '';
    try {
      var u = new URL(String(item.postUrl || ''), ORIGIN);
      if (u.origin === ORIGIN.slice(0, -1)) {
        url = u.href;
        var path = u.pathname.replace(/^\//, '');
        if (/^post\/[^?#]+\.html$/i.test(path)) body = RAW + path;
      }
    } catch (e) {}
    return {
      id: key, title: String(item.postTitle || ''), date: String(item.createdDate || ''), ts: stamp(item),
      labels: labels, url: url, bodyUrl: body, summary: String(item.postSummary || item.description || '').replace(/\s+/g, ' ').trim().slice(0, 160)
    };
  }
  function pinned(it) { return it.labels.some(function (l) { return /^pinned(?:-\d+)?$/i.test(l); }); }
  function sorted(list) {
    return list.sort(function (a, b) {
      return (pinned(b) - pinned(a)) || ((b.ts || 0) - (a.ts || 0)) || String(b.date).localeCompare(String(a.date)) || (Number(b.id.slice(1)) - Number(a.id.slice(1)));
    });
  }
  function fallback() {
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    publish(Array.isArray(cached) ? cached : [], true);
  }
  window.fetch = function (input) {
    var url = '';
    try { url = typeof input === 'string' ? input : (input && input.url) || String(input); } catch (e) {}
    var pending = orig.apply(this, arguments);
    if (!FEED.test(url)) return pending;
    return pending.then(function (res) {
      if (!res.ok) { fallback(); return res; }
      return res.clone().json().then(function (json) {
        if (!json || typeof json !== 'object') { fallback(); return res; }
        var rest = {}, journal = [];
        Object.keys(json).forEach(function (key) {
          var item = json[key];
          if (/^P\d+$/.test(key) && item && typeof item === 'object' && names(item).some(function (l) { return l.toLowerCase() === 'journal'; })) journal.push(convert(key, item));
          else rest[key] = item;
        });
        sorted(journal);
        try { localStorage.setItem(KEY, JSON.stringify(journal)); } catch (e) {}
        publish(journal, false);
        if (!journal.length) return res;
        return new Response(JSON.stringify(rest), { status: 200, headers: { 'content-type': 'application/json' } });
      }, function () { fallback(); return res; });
    }, function (error) { fallback(); throw error; });
  };
})();

