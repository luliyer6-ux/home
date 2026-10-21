/* LULIY home fixes: small repo-owned behaviour, injected (deferred) by site-publish/optimize-home.py.
   Every block is independent and only reacts to real events; nothing here runs per frame. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  /* 1. Footer curtain. #contact is fixed behind .page-above and is uncovered by the last screen of scrolling.
     While it is far away, .luliy-far hides the footer moon canvas, so the moon's own IntersectionObserver
     stops its WebGL loop. While it is fully covered it is inert, so Tab does not walk into hidden links. */
  (() => {
    const contact = document.getElementById('contact');
    if (!contact) return;
    let far = null, covered = null, queued = 0;
    const measure = () => {
      queued = 0;
      const above = document.querySelector('.page-above');
      if (!above) return;
      const gap = above.getBoundingClientRect().bottom - innerHeight; // > 0: footer still covered by this much
      const nextFar = far ? gap > innerHeight * 0.6 : gap > innerHeight; // hysteresis
      const nextCovered = gap >= 1;
      if (nextFar !== far) { far = nextFar; contact.classList.toggle('luliy-far', far); }
      if (nextCovered !== covered) { covered = nextCovered; contact.inert = covered; }
    };
    const queue = () => { if (!queued) queued = requestAnimationFrame(measure); };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    addEventListener('hashchange', queue);
    const above = document.querySelector('.page-above');
    if (above && 'ResizeObserver' in window) new ResizeObserver(queue).observe(above);
    queue();
  })();

  /* 2. Opening verse: characters light up one by one, with breath at punctuation and line breaks
     (26ms per character, 105ms after punctuation, 300ms between lines, 1150ms each).
     Only on the first opening (not .intro-complete), only for Chinese/Japanese text, never with reduced motion.
     Screen readers get the whole line once; the per-character copy is aria-hidden. */
  (() => {
    const main = document.getElementById('main');
    if (!main) return;
    const done = new WeakSet();
    const PAUSE = /[，。！？；：、,.!?;:]/;
    const split = p => {
      const chars = document.createElement('span');
      chars.className = 'lv-chars';
      chars.setAttribute('aria-hidden', 'true');
      let t = 0;
      const build = (from, into) => {
        for (const n of from.childNodes) {
          if (n.nodeType === Node.TEXT_NODE) {
            for (const c of n.nodeValue) {
              if (/\s/.test(c)) { into.append(c); continue; }
              const s = document.createElement('span');
              s.className = 'lv-c';
              s.textContent = c;
              s.style.setProperty('--d', t + 'ms');
              into.append(s);
              t += PAUSE.test(c) ? 105 : 26;
            }
          } else if (n.nodeName === 'BR') {
            into.append(document.createElement('br'));
            t += 300;
          } else if (n.nodeType === Node.ELEMENT_NODE) {
            const copy = n.cloneNode(false);
            into.append(copy);
            build(n, copy);
          }
        }
      };
      build(p, chars);
      const label = document.createElement('span');
      label.className = 'sr-only';
      label.textContent = p.textContent.replace(/\s+/g, ' ').trim();
      p.replaceChildren(label, chars);
    };
    const start = p => {
      if (!root.classList.contains('intro-pending')) { p.classList.add('lv-run'); return; }
      // Hold the faint state under the prologue, then breathe in shortly after it lifts.
      const go = () => { p.style.setProperty('--lv-base', '450ms'); p.classList.add('lv-run'); };
      addEventListener('luliy:intro-complete', go, { once: true });
    };
    const CJK = /[\u3040-\u30ff\u3400-\u9fff]/;
    const check = () => {
      if (reduced.matches) return;
      const p = main.querySelector('.library-home:not(.intro-complete) .opening-verse');
      if (!p || done.has(p) || !CJK.test(p.textContent)) return;
      done.add(p);
      // Too late (the paragraph's own fade is already under way): leave it alone rather than flash.
      const fade = p.getAnimations?.().find(a => a.animationName === 'opening-text');
      if (fade && fade.currentTime > 1000) return;
      // Split right away, before the paragraph's own 1.15s fade starts, so nothing shows twice.
      split(p);
      p.classList.add('lv-breath');
      start(p);
    };
    new MutationObserver(check).observe(main, { childList: true });
    check();
  })();
})();
