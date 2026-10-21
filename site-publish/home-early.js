/* LULIY early routing, inlined at the very top of <head> by optimize-home.py (runs before intro.js and the router).
   Phones open on the article list: a bare https://luliy.me/ becomes #/posts, so the prologue and galaxy home are skipped.
   The full home stays one tap away (directory -> 首頁) and is kept for ?home, ?intro=1 and every deep link. */
(function () {
  try {
    // Use the screen, not the viewport: this runs before <meta name=viewport>, when phones still report 980px.
    if (!matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) >= 600) return;
    var q = new URLSearchParams(location.search);
    if (q.has('home') || q.get('intro') === '1' || q.get('intro') === 'eye') return;
    var path = location.pathname.replace(/\/+$/, '');
    if (path !== '' && !/^\/index\.html$/i.test(path)) return;
    if (location.hash && !/^#\/?(?:\?|$)/.test(location.hash)) return;
    history.replaceState(history.state, '', location.pathname + location.search + '#/posts');
  } catch (e) {}
})();
