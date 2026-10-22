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
    let far = null, queued = 0;
    const measure = () => {
      queued = 0;
      const above = document.querySelector('.page-above');
      if (!above) return;
      const gap = above.getBoundingClientRect().bottom - innerHeight; // > 0: footer still covered by this much
      const nextFar = far ? gap > innerHeight * 0.6 : gap > innerHeight; // hysteresis
      const nextCovered = gap >= 1;
      if (nextFar !== far) { far = nextFar; contact.classList.toggle('luliy-far', far); }
      // Compare with the live value: the prologue saves and restores inert on its own.
      if (contact.inert !== nextCovered) contact.inert = nextCovered;
    };
    const queue = () => { if (!queued) queued = requestAnimationFrame(measure); };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    addEventListener('hashchange', queue);
    addEventListener('luliy:intro-complete', queue);
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
  /* 3. Phones: the article list is home (see home-early.js), so the ULIY logo leads there too.
     The full galaxy home stays in the directory (首頁). */
  (() => {
    // Same phone test as home-early.js.
    const phone = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 600;
    const brand = document.querySelector('#header a.brand');
    if (phone && brand && brand.getAttribute('href') === '#/') brand.setAttribute('href', '#/posts');
  })();

  /* 4. Phones, article pages: the header and the two floating buttons step aside while reading down,
     and come back on any upward scroll, near the top and near the end. */
  (() => {
    const mobile = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const main = document.getElementById('main');
    const body = document.body;
    if (!main) return;
    let reading = false, hidden = false, lastY = scrollY, queued = 0;
    const setHidden = h => { if (h !== hidden) { hidden = h; body.classList.toggle('luliy-chrome-hidden', h); } };
    const route = () => {
      const next = mobile.matches && !!main.querySelector('.source-body, .article-body');
      if (next !== reading) { reading = next; body.classList.toggle('luliy-reading', next); }
      if (!reading) setHidden(false);
      lastY = scrollY;
    };
    const measure = () => {
      queued = 0;
      if (!reading) { route(); return; } // the reader body can arrive after the route change
      const y = scrollY, dy = y - lastY;
      if (Math.abs(dy) < 8) return;
      lastY = y;
      const above = document.querySelector('.page-above');
      const nearEnd = above && above.getBoundingClientRect().bottom - innerHeight < innerHeight * 0.5;
      const tocOpen = !!main.querySelector('.reader-toc-toggle[aria-expanded="true"]');
      setHidden(dy > 0 && y > 160 && !nearEnd && !tocOpen);
    };
    addEventListener('scroll', () => { if (!queued) queued = requestAnimationFrame(measure); }, { passive: true });
    addEventListener('hashchange', route);
    mobile.addEventListener('change', route);
    new MutationObserver(route).observe(main, { childList: true });
    route();
  })();

  /* 5. Phones: wide photographs in an article run edge to edge (CSS .luliy-bleed, max-width 700px).
     Only a lone image that already fills a column centred on the screen; small pictures, inline icons,
     images inside lists or quotes and very long screenshots keep their place. */
  (() => {
    const narrow = matchMedia('(max-width: 700px)');
    const main = document.getElementById('main');
    if (!main) return;
    const check = img => {
      if (!narrow.matches || img.classList.contains('luliy-bleed')) return;
      if (!img.complete || !img.naturalWidth) { img.addEventListener('load', () => check(img), { once: true }); return; }
      const body = img.closest('.source-body, .article-body');
      if (!body) return;
      const block = img.parentElement === body ? img : img.closest('p, figure');
      if (!block || (block !== img && block.parentElement !== body)) return;
      if (block !== img) {
        if (block.querySelectorAll('img, video, iframe').length !== 1) return;
        const caption = block.querySelector('figcaption')?.textContent.trim() || '';
        if (block.textContent.trim() !== caption) return;
      }
      const col = body.getBoundingClientRect(), r = img.getBoundingClientRect();
      const centred = Math.abs(col.left + col.width / 2 - document.documentElement.clientWidth / 2) < 2;
      const fills = r.width >= col.width - 2 && img.naturalWidth >= col.width;
      const long = img.naturalHeight > img.naturalWidth * 2;
      if (centred && fills && !long) img.classList.add('luliy-bleed');
    };
    let queued = 0;
    const scan = () => { queued = 0; if (narrow.matches) main.querySelectorAll('.source-body img, .article-body img').forEach(check); };
    new MutationObserver(() => { if (!queued) queued = requestAnimationFrame(scan); }).observe(main, { childList: true, subtree: true });
    narrow.addEventListener('change', scan);
    scan();
  })();

  /* 6. Directory pictures (shelf, reading portraits, project portrait: about 5 MB of PNG) wait until the
     directory is about to open (runtime-fixes.py moves their URL to data-src). Computers fetch them once
     the page is idle; phones on intent only. */
  (() => {
    const d = document.getElementById('directory');
    if (!d) return;
    const fill = () => d.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
    if (d.open) { fill(); return; }
    new MutationObserver(() => { if (d.open) fill(); }).observe(d, { attributes: true, attributeFilter: ['open'] });
    const openers = '#directoryOpen, #studyGlobalOpen, [aria-controls="directory"]';
    for (const type of ['pointerdown', 'focusin']) document.addEventListener(type, e => { if (e.target.closest?.(openers)) fill(); }, { capture: true, passive: true });
    const phone = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 600;
    if (phone || document.documentElement.classList.contains('luliy-save-data')) return;
    const idle = () => setTimeout(() => (window.requestIdleCallback ? requestIdleCallback(fill, { timeout: 4000 }) : fill()), 2000);
    if (document.readyState === 'complete') idle(); else addEventListener('load', idle, { once: true });
  })();

  /* 7. Android back gesture closes the article contents panel instead of leaving the page
     (dialogs and popovers already do this natively). */
  (() => {
    const main = document.getElementById('main');
    if (!main || !('CloseWatcher' in window)) return;
    let watcher = null;
    const toggle = () => main.querySelector('.reader-toc-toggle, .study-reader-toc-toggle');
    const sync = () => {
      const t = toggle(), open = !!t && t.getAttribute('aria-expanded') === 'true';
      if (open && !watcher) {
        try { watcher = new CloseWatcher(); } catch (e) { return; }
        watcher.onclose = () => { watcher = null; const b = toggle(); if (b && b.getAttribute('aria-expanded') === 'true') b.click(); };
      } else if (!open && watcher) { const w = watcher; watcher = null; w.destroy(); }
    };
    new MutationObserver(sync).observe(main, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-expanded'] });
  })();

  /* 8. Offline reading: /sw.js keeps the page shell, cached assets and articles already read
     (see site-publish/sw.js; it never touches Drive, sign-in or anything but GET). */
  (() => {
    if (!('serviceWorker' in navigator) || location.protocol !== 'https:') return;
    const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
    if (document.readyState === 'complete') register(); else addEventListener('load', register, { once: true });
  })();
})();
