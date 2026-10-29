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

/* Dark palettes (墨綠 / 暖墨 / 夜藍 / 酒紅, chosen in the theme picker, home-fixes.js block 14): put the saved one on
   <html data-palette> before the first paint. The colours only apply on top of the dark appearance (design-tokens.css). */
(function () {
  try {
    var p = localStorage.getItem('luliy-palette');
    if (/^(forest|espresso|midnight|oxblood)$/.test(p || '')) document.documentElement.dataset.palette = p;
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
   The brand mark (the pensive-figure L) is drawn as a thin outline, breathing slowly, with lights travelling round
   its four largest shapes (still with reduced motion). It lifts once the page has rendered: at least 0.7 s, at most 1.5 s after the document is parsed. */
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
  var paths = function (cls, n) { return shapes.slice(0, n).map(function (d, i) { return '<path class="' + cls + '" pathLength="1" d="' + d + '" style="--i:' + i + '"/>'; }).join(''); };
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
  el.innerHTML = '<svg viewBox="0 0 60 60">' + paths('o') + '<g class="g">' + paths('l', 4) + '</g></svg>';
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
