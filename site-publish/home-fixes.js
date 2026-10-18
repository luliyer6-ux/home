/* Small behaviour fixes injected by optimize-home.py. */
(() => {
  'use strict';
  const root = document.documentElement;
  let frame = 0;
  const update = () => {
    frame = 0;
    root.toggleAttribute('data-scrolled', window.scrollY > 24);
  };
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  addEventListener('hashchange', update);
  update();
})();
