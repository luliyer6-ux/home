/* LULIY early routing, inlined at the very top of <head> by optimize-home.py (runs before intro.js and the router).
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

/* Phones: a short opening screen on the first visit of a session, in the colours of the chosen appearance.
   The thinker is drawn as a thin outline with a light travelling round it, breathing slowly (still with reduced
   motion). It lifts once the page has rendered: at least 0.7 s, at most 1.5 s after the document is parsed. */
(function () {
  try {
    if (!matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) >= 600) return;
    var q = new URLSearchParams(location.search);
    if (q.get('intro') === '1' || q.get('intro') === 'eye') return;
    if (sessionStorage.getItem('luliy-loader-seen')) return;
    sessionStorage.setItem('luliy-loader-seen', '1');
  } catch (e) { return; }
  var a = 'dark';
  try { a = localStorage.getItem('luliy-appearance') || (localStorage.getItem('luliy-paper-ink') === 'light' ? 'cc' : 'dark'); } catch (e) {}
  var C = {
    cc: ['linear-gradient(189deg,#1f1f38 .55%,#18182d 30.38%,#111222 65.19%,#0c0d1b 100%)', 'rgba(234,223,190,.42)', '#f0d68f'],
    light: ['#faf9f5', 'rgba(20,20,19,.34)', '#9b7444'],
    dark: ['#111110', 'rgba(242,237,228,.36)', '#d8b878']
  }[a] || null;
  if (!C) C = ['#111110', 'rgba(242,237,228,.36)', '#d8b878'];
  var shapes = ['M13 52H47Q48 52 48 53V57Q48 58 47 58H13Q12 58 12 57V53Q12 52 13 52Z',
    'M30 52L30 44Q30 38 34 35L38 35Q38 41 36 44L36 52Z', 'M16 52L16 42Q16 38 20 37L25 39Q24 43 22 44L22 52Z',
    'M19 38Q18 33 22 31L33 31Q35 33 34 36L23 38Q21 39 19 38Z', 'M24 32Q21 26 22 19Q23 13 29 11L34 12Q36 16 35 21L33 31Q28 33 24 32Z',
    'M24 16Q19 18 18 24Q17 28 20 30L23 30Q21 27 22 23Q23 19 27 17Z', 'M18 25Q15 21 16 16Q17 12 22 11L25 14Q21 15 20 19Q19 22 21 25Z',
    'M21.5 9A6.5 7 0 1 0 34.5 9A6.5 7 0 1 0 21.5 9Z', 'M33 8Q35.5 9 34.5 11.5Q33 12 32 10.5Z'];
  var paths = function (cls) { return shapes.map(function (d, i) { return '<path class="' + cls + '" pathLength="1" d="' + d + '" style="--i:' + i + '"/>'; }).join(''); };
  var css = '#luliy-loader{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:' + C[0] + ';transition:opacity 450ms cubic-bezier(.22,.61,.36,1)}' +
    '#luliy-loader.is-done{opacity:0;pointer-events:none}' +
    '#luliy-loader svg{width:88px;height:88px;overflow:visible;fill:none;stroke-linejoin:round;stroke-linecap:round}' +
    '#luliy-loader .o{stroke:' + C[1] + ';stroke-width:.55;animation:luliy-loader-breathe 2.4s cubic-bezier(.65,0,.35,1) infinite alternate}' +
    '#luliy-loader .l{stroke:' + C[2] + ';stroke-width:.9;stroke-dasharray:.16 .84;stroke-dashoffset:1;animation:luliy-loader-run 1.9s linear infinite;animation-delay:calc(var(--i) * -.21s)}' +
    '#luliy-loader .g{filter:drop-shadow(0 0 2.2px ' + C[2] + ')}' +
    '@keyframes luliy-loader-breathe{from{opacity:.55}to{opacity:1}}@keyframes luliy-loader-run{to{stroke-dashoffset:0}}' +
    '@media(prefers-reduced-motion:reduce){#luliy-loader .o{animation:none;opacity:1}#luliy-loader .l{display:none}}' +
    'html.luliy-calm #luliy-loader .o{animation:none;opacity:1}html.luliy-calm #luliy-loader .l{display:none}';
  var style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  var el = document.createElement('div');
  el.id = 'luliy-loader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<svg viewBox="0 0 60 60">' + paths('o') + '<g class="g">' + paths('l') + '</g></svg>';
  document.documentElement.appendChild(el);
  var shown = Date.now(), parsed = 0, gone = false;
  function done() {
    if (gone) return;
    gone = true;
    el.classList.add('is-done');
    setTimeout(function () { el.remove(); style.remove(); }, 500);
  }
  function check() {
    if (gone) return;
    var main = document.getElementById('main'), now = Date.now();
    if ((main && main.firstElementChild && now - shown >= 700) || (parsed && now - parsed >= 1500)) { done(); return; }
    setTimeout(check, 80);
  }
  document.addEventListener('DOMContentLoaded', function () { parsed = Date.now(); check(); });
  setTimeout(done, 6000); // never stay up, whatever happens
})();
