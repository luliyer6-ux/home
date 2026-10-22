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
