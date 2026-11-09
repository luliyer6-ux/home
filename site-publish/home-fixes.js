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
  /* 3. Phones: the article list is home (see home-early.js), so the ULIY logo (and a tap on the L mark, block 16)
     leads there too. The full galaxy home stays in the directory (its L mark, and 首頁). */
  (() => {
    // Same phone test as home-early.js.
    const phone = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 600;
    const brand = document.querySelector('#header a.brand');
    // 2026-11-07: the new home is short and made for phones too, so the brand keeps '#/'.
    void phone; void brand;
  })();

  /* 4. Phones, every page: one header. It steps aside while scrolling down (on articles together with the two
     floating buttons) and comes back on any upward scroll, near the top and near the end. Once the page has
     moved, a soft wash in the page colour keeps content from showing through it (on the galaxy home only after
     the opening scene, which turns on .is-scrolled itself). It stays put while a sheet or dialog is open. */
  (() => {
    const mobile = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const main = document.getElementById('main');
    const header = document.getElementById('header');
    const body = document.body;
    if (!main || !header) return;
    let reading = false, hidden = false, washed = false, lastY = scrollY, queued = 0;
    const setHidden = h => { if (h !== hidden) { hidden = h; body.classList.toggle('luliy-chrome-hidden', h); } };
    const home = () => /^#?\/?(\?.*)?$/.test(location.hash);
    /* 2026-11-02: the frosted glass behind the header is its own element (.luliy-glass, just before the header, same
       z-index). Inside the header it could not blur: the header has a view-transition-name, which makes it a backdrop
       root in Chromium, so its blur saw nothing of the page. html.luliy-glass-on while the header is washed. */
    const glass = document.createElement('div');
    glass.className = 'luliy-glass'; glass.setAttribute('aria-hidden', 'true');
    header.before(glass);
    const fit = () => root.style.setProperty('--luliy-glass-h', header.offsetHeight + 'px');
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(header); else addEventListener('resize', fit);
    fit();
    const wash = () => {
      const w = mobile.matches && scrollY > 20 && (!home() || header.classList.contains('is-scrolled'));
      if (w !== washed) { washed = w; header.classList.toggle('luliy-washed', w); root.classList.toggle('luliy-glass-on', w && getComputedStyle(header).display !== 'none'); }
    };
    const route = () => {
      const next = mobile.matches && !!main.querySelector('.source-body, .article-body');
      if (next !== reading) { reading = next; body.classList.toggle('luliy-reading', next); }
      setHidden(false);
      lastY = scrollY;
      wash();
    };
    // Also while a header tab (block 17) scrolls the page to its section, so the tabs stay in view, and while the
    // records cloth (block 19) is down.
    const busy = () => !!(root.classList.contains('luliy-tab-scrolling') || root.classList.contains('luliy-cloth-open') || root.classList.contains('lk-drawer-open') || main.querySelector('.reader-toc-toggle[aria-expanded="true"], .article-filter-drawer[open]') || document.querySelector('dialog[open]'));
    const measure = () => {
      queued = 0;
      wash();
      if (!mobile.matches) { setHidden(false); return; }
      // The reader body can arrive after the route change.
      if (!reading && main.querySelector('.source-body, .article-body')) { reading = true; body.classList.add('luliy-reading'); }
      const y = scrollY, dy = y - lastY;
      if (Math.abs(dy) < 8) return;
      lastY = y;
      const above = document.querySelector('.page-above');
      const nearEnd = above && above.getBoundingClientRect().bottom - innerHeight < innerHeight * 0.5;
      setHidden(dy > 0 && y > 160 && !nearEnd && !busy());
    };
    addEventListener('scroll', () => { if (!queued) queued = requestAnimationFrame(measure); }, { passive: true });
    // route() reads scrollY, which forces a layout; on a page change it runs once, in the next frame, after the new
    // content is in (2026-11-01: it used to run on every #main mutation, in the middle of the router's work).
    let routeQ = 0;
    const routeSoon = () => { if (!routeQ) routeQ = requestAnimationFrame(() => { routeQ = 0; route(); }); };
    addEventListener('hashchange', routeSoon);
    mobile.addEventListener('change', route);
    new MutationObserver(routeSoon).observe(main, { childList: true });
    new MutationObserver(wash).observe(header, { attributes: true, attributeFilter: ['class'] });
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
    // Touch: showModal() focuses the first link (the thinker mark), and iOS draws a focus ring round it.
    // Focus the dialog itself instead; Tab still starts at the first link.
    const coarse = matchMedia('(pointer: coarse)');
    new MutationObserver(() => {
      if (!d.open) return;
      fill();
      if (coarse.matches) { if (!d.hasAttribute('tabindex')) d.tabIndex = -1; d.focus({ preventScroll: true }); }
    }).observe(d, { attributes: true, attributeFilter: ['open'] });
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

  /* 9. Phones, article list: 文章 / 編年史 become tabs in the header (like a phone app); the filter sits on the
     first year's row and opens as a bottom sheet: the page dims, the header steps away, and a tap outside, ×,
     dragging the sheet down, Esc or the Android back gesture closes it. A gold dot marks an active filter;
     the result line (全部文章 · 23 篇) moves into the sheet. */
  (() => {
    const mobile = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const main = document.getElementById('main');
    const header = document.getElementById('header');
    const inner = header?.querySelector('.header-inner');
    if (!main || !inner) return;
    const say = (zh, en, ja) => (/^en/.test(root.lang) ? en : /^ja/.test(root.lang) ? ja : zh);
    let tabs = null, watcher = null;
    const syncTabs = () => {
      const modes = mobile.matches ? main.querySelector('.article-modes') : null;
      if (!modes) {
        if (tabs) { tabs.remove(); tabs = null; header.classList.remove('luliy-has-tabs'); }
        return;
      }
      modes.closest('.shell')?.classList.add('luliy-has-header-modes');
      if (!tabs) { tabs = document.createElement('nav'); tabs.className = 'luliy-header-modes'; inner.append(tabs); header.classList.add('luliy-has-tabs'); }
      tabs.setAttribute('aria-label', modes.getAttribute('aria-label') || '');
      if (tabs.innerHTML !== modes.innerHTML) tabs.innerHTML = modes.innerHTML;
    };
    const lock = on => { root.classList.toggle('luliy-sheet-lock', on); document.body.classList.toggle('luliy-sheet-open', on); };
    const close = d => {
      if (!d.open || d.classList.contains('luliy-sheet-closing')) return;
      if (reduced.matches) { d.open = false; return; }
      d.classList.add('luliy-sheet-closing');
      setTimeout(() => { d.classList.remove('luliy-sheet-closing'); d.querySelector('.article-filter-panel').style.transform = ''; d.open = false; }, 230);
    };
    const sheet = d => {
      if (d.dataset.luliySheet) return;
      d.dataset.luliySheet = '1';
      const panel = d.querySelector('.article-filter-panel'), heading = panel?.querySelector('.article-filter-heading');
      if (!panel || !heading) return;
      const current = main.querySelector('.article-filter-current');
      if (current) heading.after(current);
      d.classList.toggle('luliy-filtered', !!current?.querySelector('.article-filter-condition'));
      const x = document.createElement('button');
      x.type = 'button';
      x.className = 'luliy-sheet-close';
      x.setAttribute('aria-label', say('關閉', 'Close', '閉じる'));
      x.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>';
      x.addEventListener('click', () => close(d));
      heading.append(x);
      // Same row as the first year heading, on the right.
      const toolbar = d.closest('.article-browse-toolbar'), h2 = main.querySelector('.post-year > h2');
      if (h2) { h2.after(d); h2.parentElement.classList.add('luliy-filter-row'); }
      if (toolbar && !toolbar.querySelector('.article-filter-drawer, .article-filter-current')) toolbar.classList.add('luliy-emptied');
      d.querySelector('summary').addEventListener('click', e => { if (d.open && mobile.matches) { e.preventDefault(); close(d); } });
      d.addEventListener('toggle', () => {
        lock(d.open && mobile.matches);
        if (d.open && 'CloseWatcher' in window && !watcher) {
          try { watcher = new CloseWatcher(); watcher.onclose = () => { watcher = null; close(d); }; } catch (e) {}
        } else if (!d.open && watcher) { const w = watcher; watcher = null; w.destroy(); }
      });
      // Drag the sheet down (from its top, or anywhere once it is scrolled to the top) to close it.
      let y0 = 0, dy = 0, t0 = 0, pull = false;
      panel.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; dy = 0; t0 = Date.now(); pull = panel.scrollTop <= 0; }, { passive: true });
      panel.addEventListener('touchmove', e => {
        if (!pull) return;
        dy = e.touches[0].clientY - y0;
        if (dy <= 0) { panel.style.transform = ''; return; }
        e.preventDefault();
        panel.style.transition = 'none';
        panel.style.transform = `translateY(${dy}px)`;
      }, { passive: false });
      panel.addEventListener('touchend', () => {
        if (!pull || dy <= 0) return;
        pull = false;
        panel.style.transition = '';
        if (dy > 90 || dy / Math.max(1, Date.now() - t0) > 0.6) close(d);
        else panel.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.19,1,.22,1)' }).onfinish = () => { panel.style.transform = ''; };
        if (!d.classList.contains('luliy-sheet-closing')) panel.style.transform = '';
      });
    };
    const sync = () => {
      syncTabs();
      const d = mobile.matches ? main.querySelector('.article-filter-drawer') : null;
      if (d) sheet(d);
      if (!main.querySelector('.article-filter-drawer[open]')) lock(false);
    };
    new MutationObserver(sync).observe(main, { childList: true });
    // Leaving the phone layout (a narrowed desktop window widening again): let the router draw the page afresh.
    mobile.addEventListener('change', () => { sync(); if (!mobile.matches && main.querySelector('[data-luliy-sheet]')) dispatchEvent(new HashChangeEvent('hashchange')); });
    sync();
  })();

  /* 10. Phones, record player: the view controls under the turntable fold into a ⋯ panel (eject, zoom, reset,
     arm, knob, glass), leaving 進入展覽 and ⋯ in the corner, so the row no longer runs off the screen. */
  (() => {
    const narrow = matchMedia('(max-width: 700px)');
    const main = document.getElementById('main');
    if (!main) return;
    let row = null;
    const set = open => {
      if (!row) return;
      row.classList.toggle('luliy-more-open', open);
      row.querySelector('.luliy-view-toggle')?.setAttribute('aria-expanded', String(open));
    };
    const fold = () => {
      // The playlist button sits in .lr-transport, which keeps its own box (the player watches it); on phones it
      // moves next to it so the grid in home-fixes.css can put it on the extras row, and back on wider screens.
      const meta = main.querySelector('.lr-standalone .lr-meta'), transport = meta?.querySelector('.lr-transport');
      const playlist = meta?.querySelector(narrow.matches ? '.lr-transport > .lr-album-trigger' : ':scope > .lr-album-trigger');
      if (playlist && transport) narrow.matches ? transport.after(playlist) : transport.append(playlist);
      const r = main.querySelector('.lr-standalone .lr-view-controls');
      if (!r || !narrow.matches || r.querySelector('.luliy-view-more')) { if (r && r !== row && r.querySelector('.luliy-view-more')) row = r; return; }
      row = r;
      const more = document.createElement('div');
      more.className = 'luliy-view-more';
      more.id = 'luliyViewMore';
      for (const el of [...r.children]) if (!el.matches('.lr-exhibition-entry')) more.append(el);
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'lr-icon-button luliy-view-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'luliyViewMore');
      const label = /^en/.test(root.lang) ? 'More controls' : /^ja/.test(root.lang) ? 'その他の操作' : '更多操作';
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
      toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.5" cy="12" r="1.7"/></svg>';
      toggle.addEventListener('click', () => set(!r.classList.contains('luliy-more-open')));
      r.append(more, toggle);
      r.addEventListener('keydown', e => { if (e.key === 'Escape' && r.classList.contains('luliy-more-open')) { set(false); toggle.focus(); } });
    };
    document.addEventListener('pointerdown', e => { if (row?.classList.contains('luliy-more-open') && !row.contains(e.target)) set(false); }, { passive: true });
    let queued = 0;
    new MutationObserver(() => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; fold(); }); }).observe(main, { childList: true, subtree: true });
    narrow.addEventListener('change', fold);
    fold();
  })();

  /* 11. 動態效果 switch in the directory, shown while motion is off (CSS), so it can be turned back on.
     (CC used to get its own drawer-style directory here; every appearance now shares the full-screen one.) */
  (() => {
    const d = document.getElementById('directory');
    if (!d) return;
    const lang = () => d.querySelector('#directoryLanguageOptions [aria-pressed="true"]')?.dataset.lang || 'zh-Hant';
    const T = (hant, hans, ja, en) => ({ zh: hans, ja, en })[lang()] || hant;
    const build = () => {
      const right = d.querySelector('.directory-display-right');
      let sw = d.querySelector('.luliy-motion-switch');
      if (right && !sw) {
        sw = document.createElement('button');
        sw.type = 'button';
        sw.className = 'luliy-motion-switch';
        sw.setAttribute('role', 'switch');
        sw.innerHTML = '<span class="luliy-switch-label"></span><span class="luliy-switch-track" aria-hidden="true"></span>';
        sw.addEventListener('click', () => window.LuliyMotion?.set(!window.LuliyMotion.calm));
        right.append(sw);
      }
      if (sw) {
        sw.setAttribute('aria-checked', String(!window.LuliyMotion?.calm));
        sw.querySelector('.luliy-switch-label').textContent = T('動態效果', '动态效果', 'モーション', 'Motion');
      }
    };
    new MutationObserver(() => { if (d.open) build(); }).observe(d, { attributes: true, attributeFilter: ['open'] });
    document.addEventListener('luliy:motion', build);
  })();

  /* 12. CC and the dark palettes (block 14): the browser bar (theme-color) takes the top colour of their sky instead
     of the flat colour the page sets (for CC, the light paper colour it inherits from the light theme). */
  (() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const SKY = { cc: '#1f1f38', forest: '#1d2a25', espresso: '#2a231d', midnight: '#1d212b', oxblood: '#2b181b' };
    const skies = Object.values(SKY);
    const key = () => root.dataset.appearance === 'cc' ? 'cc' : root.dataset.appearance === 'dark' ? root.dataset.palette : '';
    let plain = meta.content, sky = false;
    const sync = () => {
      const want = SKY[key()];
      if (want) { sky = true; if (meta.content !== want) meta.content = want; return; }
      // Leaving a sky: the page only rewrites the colour when the appearance changes, so take the plain one now.
      if (sky) { sky = false; plain = getComputedStyle(root).getPropertyValue('--bg').trim() || plain; }
      if (meta.content !== plain) meta.content = plain;
    };
    new MutationObserver(() => { if (!sky && !skies.includes(meta.content)) plain = meta.content; sync(); }).observe(meta, { attributes: true, attributeFilter: ['content'] });
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-appearance', 'data-palette'] });
    sync();
  })();

  /* 13. Directory: the × grows out of the header's =. The directory sets .icon-open in the same frame it opens, so
     its bars would simply appear crossed; .luliy-x is added two frames later, once the = has been drawn, and the
     bars turn (CSS). Closing removes .icon-open first, so the × folds back into = while the directory leaves. */
  (() => {
    const d = document.getElementById('directory');
    if (!d) return;
    let raf = 0;
    const sync = () => {
      const on = d.open && d.classList.contains('icon-open');
      if (!on) {
        cancelAnimationFrame(raf); raf = 0;
        // Only touch the class when it is there: classList.remove always rewrites the attribute, which would
        // wake this observer again, endlessly.
        if (d.classList.contains('luliy-x')) d.classList.remove('luliy-x');
        return;
      }
      if (raf || d.classList.contains('luliy-x')) return;
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (d.open && d.classList.contains('icon-open')) d.classList.add('luliy-x');
        });
      });
    };
    new MutationObserver(sync).observe(d, { attributes: true, attributeFilter: ['open', 'class'] });
  })();

  /* 14. Theme picker. The directory's theme button (runtime-fixes.py sends its click here instead of cycling
     dark -> light -> cc) opens a small window with seven colour circles: 暗黑, 白天, CC and four dark palettes,
     墨綠 / 暖墨 / 夜藍 / 酒紅 (design-tokens.css, skies in home-fixes.css). A palette is the dark appearance plus
     <html data-palette>, saved as localStorage luliy-palette; home-early.js restores it before the first paint
     (nothing saved = 暗黑, base dark, since 2026-11-07; it was 夜藍 midnight; 暗黑 saves 'dark').
     A circle applies its theme at once (a short cross-fade where view transitions exist) and the window stays
     open, so themes can be compared; tap outside, Esc or the theme button closes it. */
  (() => {
    // id, 繁, 简, 日, EN, then the circle: highlight, middle, edge.
    const THEMES = [
      ['dark', '暗黑', '暗黑', '暗色', 'Dark', '#2a2a27', '#141413', '#0a0a09'],
      ['light', '白天', '白天', '白昼', 'Day', '#ffffff', '#f6f4ee', '#e2ded3'],
      ['cc', 'CC', 'CC', 'CC', 'CC', '#3a3a63', '#1c1c34', '#0c0d1b'],
      ['forest', '墨綠', '墨绿', '深緑', 'Forest', '#3a5047', '#1b2722', '#0b110f'],
      ['espresso', '暖墨', '暖墨', '焦茶', 'Espresso', '#4d4034', '#251f19', '#0f0d0b'],
      ['midnight', '夜藍', '夜蓝', '濃紺', 'Midnight', '#3a4152', '#1a1d26', '#0a0b0f'],
      ['oxblood', '酒紅', '酒红', '臙脂', 'Oxblood', '#552d34', '#271619', '#10090a'],
    ];
    const PALETTES = ['forest', 'espresso', 'midnight', 'oxblood'];
    const lang = () => document.querySelector('#directoryLanguageOptions [aria-pressed="true"]')?.dataset.lang || 'zh-Hant';
    const pick = (hant, hans, ja, en) => ({ zh: hans, ja, en })[lang()] || hant;
    const current = () => {
      const a = root.dataset.appearance;
      if (a === 'dark' && PALETTES.includes(root.dataset.palette)) return root.dataset.palette;
      return ['dark', 'light', 'cc'].includes(a) ? a : 'dark';
    };
    const calm = () => reduced.matches || !!window.LuliyMotion?.calm;
    let dlg = null, card = null, nameEl = null, anchor = null, leaving = null;
    const swatches = () => [...dlg.querySelectorAll('.luliy-tp-swatch')];
    const nameOf = id => {
      const t = THEMES.find(x => x[0] === id);
      const local = pick(t[1], t[2], t[3], t[4]);
      return local === t[4] ? local : local + '<span>' + t[4] + '</span>';
    };
    const showName = id => { const html = nameOf(id); if (nameEl.innerHTML !== html) nameEl.innerHTML = html; };
    const mark = () => {
      const now = current();
      swatches().forEach(b => { const on = b.dataset.pick === now; b.setAttribute('aria-pressed', String(on)); b.tabIndex = on ? 0 : -1; });
      showName(now);
    };
    const label = () => {
      dlg.querySelector('.luliy-tp-title').textContent = pick('主題', '主题', 'テーマ', 'Theme');
      swatches().forEach(b => { const t = THEMES.find(x => x[0] === b.dataset.pick); b.setAttribute('aria-label', pick(t[1], t[2], t[3], t[4])); });
    };
    const place = () => {
      if (!dlg?.open) return;
      const vw = document.documentElement.clientWidth, vh = innerHeight, W = card.offsetWidth, H = card.offsetHeight, m = 12;
      const r = anchor?.isConnected ? anchor.getBoundingClientRect() : null;
      let left = (vw - W) / 2, top = (vh - H) / 2, ox = W / 2, oy = H / 2;
      if (r && r.width) {
        left = Math.max(m, Math.min(vw - W - m, r.left + r.width / 2 - W / 2));
        top = r.top - 12 - H;
        if (top < m + 32) top = Math.min(r.bottom + 12, vh - H - m); // no room above: open below the button
        ox = Math.max(0, Math.min(W, r.left + r.width / 2 - left));
        oy = top < r.top ? H : 0;
      }
      card.style.left = Math.round(left) + 'px';
      card.style.top = Math.round(top) + 'px';
      card.style.transformOrigin = Math.round(ox) + 'px ' + oy + 'px';
    };
    // Theme change with a cross-fade (the page's route transitions use the same mechanism; data-vt-dir picks the style).
    const fade = fn => {
      if (calm() || typeof document.startViewTransition !== 'function' || document.hidden) { fn(); return; }
      root.dataset.vtDir = 'theme';
      const done = () => { if (root.dataset.vtDir === 'theme') delete root.dataset.vtDir; };
      try { document.startViewTransition(fn).finished.then(done, done); } catch (e) { done(); fn(); }
    };
    const choose = id => {
      if (id === current()) return;
      const pal = PALETTES.includes(id) ? id : '', ap = pal ? 'dark' : id;
      fade(() => {
        if (pal) root.dataset.palette = pal; else delete root.dataset.palette;
        try { localStorage.setItem('luliy-palette', pal || 'dark'); } catch (e) {}
        if (root.dataset.appearance !== ap) {
          if (window.LuliySetAppearance) window.LuliySetAppearance(ap);
          else {
            root.dataset.appearance = ap; root.dataset.theme = ap === 'dark' ? 'dark' : 'light';
            try { localStorage.setItem('luliy-appearance', ap); localStorage.setItem('luliy-paper-ink', root.dataset.theme); } catch (e) {}
          }
        }
        mark();
      });
    };
    const hide = () => {
      if (!dlg?.open || leaving) return;
      if (calm() || !card.animate) { dlg.close(); return; }
      leaving = card.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.96)' }], { duration: 140, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      leaving.finished.then(() => dlg.close(), () => dlg.close());
    };
    const build = () => {
      dlg = document.createElement('dialog');
      dlg.className = 'luliy-theme-picker';
      dlg.setAttribute('aria-labelledby', 'luliyThemeTitle');
      dlg.innerHTML = '<div class="luliy-tp-card"><p class="luliy-tp-title" id="luliyThemeTitle"></p>' +
        '<div class="luliy-tp-row" role="group" aria-labelledby="luliyThemeTitle">' +
        THEMES.map(t => '<button type="button" class="luliy-tp-swatch" data-pick="' + t[0] + '" style="--tp-a:' + t[5] + ';--tp-b:' + t[6] + ';--tp-c:' + t[7] + '"></button>').join('') +
        '</div><p class="luliy-tp-name" aria-hidden="true"></p></div>';
      document.body.append(dlg);
      card = dlg.firstElementChild;
      nameEl = dlg.querySelector('.luliy-tp-name');
      const row = dlg.querySelector('.luliy-tp-row');
      row.addEventListener('click', e => { const b = e.target.closest('.luliy-tp-swatch'); if (b) choose(b.dataset.pick); });
      row.addEventListener('pointerover', e => { const b = e.target.closest('.luliy-tp-swatch'); if (b && e.pointerType === 'mouse') showName(b.dataset.pick); });
      row.addEventListener('pointerleave', () => showName(current()));
      row.addEventListener('focusin', e => { const b = e.target.closest('.luliy-tp-swatch'); if (b && b.matches(':focus-visible')) showName(b.dataset.pick); });
      row.addEventListener('focusout', () => showName(current()));
      row.addEventListener('keydown', e => {
        const list = swatches(), i = list.indexOf(document.activeElement);
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        let j = -1;
        if (step) j = (i + step + list.length) % list.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = list.length - 1;
        if (j < 0) return;
        e.preventDefault();
        list.forEach((b, k) => { b.tabIndex = k === j ? 0 : -1; });
        list[j].focus();
      });
      dlg.addEventListener('cancel', e => { e.preventDefault(); hide(); });
      dlg.addEventListener('click', e => { if (e.target === dlg) hide(); });
      dlg.addEventListener('close', () => { leaving?.cancel(); leaving = null; anchor = null; });
      addEventListener('resize', place);
    };
    window.LuliyThemePicker = button => {
      if (!dlg) build();
      if (dlg.open) { hide(); return; }
      anchor = button || null;
      label();
      mark();
      dlg.showModal();
      place();
      const on = dlg.querySelector('.luliy-tp-swatch[aria-pressed="true"]') || swatches()[0];
      on.focus({ preventScroll: true });
      if (calm() || !card.animate) return;
      card.animate([{ opacity: 0, transform: 'translateY(4px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.19,1,.22,1)' });
      swatches().forEach((b, i) => b.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: 40 + i * 24, easing: 'cubic-bezier(.19,1,.22,1)', fill: 'backwards' }));
    };
  })();

  /* 15. Music player bar (after the Rockstar GTA VI music page). The shared mini player (records engine plus the
     Drive media script) becomes one bar along the bottom of every page: cover and title | previous, play, next
     and progress | volume, queue, share, close. Volume: hover shows a vertical slider, click mutes (touch: tap
     shows the slider). Queue: a panel above the bar with the playback settings as a footer. Share: a small
     popover with the music page link. Phones get a compact bar (the cover is play/pause, × stops) whose text
     opens a bottom sheet with the full controls. The existing elements, handlers and state are kept: this block
     only moves them into three groups and adds what is new. The old drag-to-place is off in bar mode.
     CSS: home-fixes.css "Music player bar". */
  (() => {
    const phone = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const lang = () => {
      const p = document.querySelector('#directoryLanguageOptions [aria-pressed="true"]')?.dataset.lang;
      if (p) return p;
      const l = root.lang || '';
      return /^en/.test(l) ? 'en' : /^ja/.test(l) ? 'ja' : /Hans|CN/i.test(l) ? 'zh' : 'zh-Hant';
    };
    // 繁, 简, 日, EN
    const WORDS = {
      share: ['分享', '分享', '共有', 'Share'],
      close: ['關閉', '关闭', '閉じる', 'Close'],
      copy: ['複製連結', '复制链接', 'リンクをコピー', 'Copy link'],
      copied: ['已複製連結', '已复制链接', 'リンクをコピーしました', 'Link copied'],
      link: ['連結', '链接', 'リンク', 'Link'],
      more: ['更多分享方式', '更多分享方式', 'その他の共有方法', 'More options'],
      mail: ['電子郵件', '电子邮件', 'メール', 'Email'],
      volume: ['音量', '音量', '音量', 'Volume'],
      mute: ['靜音', '静音', 'ミュート', 'Mute'],
      unmute: ['取消靜音', '取消静音', 'ミュート解除', 'Unmute'],
      queue: ['播放列表', '播放列表', '再生キュー', 'Queue'],
      expand: ['展開播放器', '展开播放器', 'プレーヤーを開く', 'Open player'],
      collapse: ['收起播放器', '收起播放器', 'プレーヤーを閉じる', 'Close player'],
      listening: [t => '正在聽《' + t + '》', t => '正在听《' + t + '》', t => '「' + t + '」を聴いています', t => 'Listening to “' + t + '”'],
    };
    const say = (k, arg) => {
      const v = WORDS[k][{ zh: 1, ja: 2, en: 3 }[lang()] || 0];
      return typeof v === 'function' ? v(arg) : v;
    };
    const PATHS = {
      volume: 'M4 9h4l5-4v14l-5-4H4zM16.5 9q2.5 3 0 6M19 6.5q4.5 5.5 0 11',
      mute: 'M4 9h4l5-4v14l-5-4H4zM17 9.5l5 5M22 9.5l-5 5',
      queue: 'M3 6h13M3 11h13M3 16h7M15.5 19.5a2 2 0 1 1 0-.01V11.5l4.5-1.5',
      share: 'M12 15V4M8 7.5L12 3.5l4 4M5 11.5v7A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-7',
      close: 'M6 6l12 12M18 6L6 18',
      copy: 'M9 9h10v10H9zM5 15V5h10',
      done: 'M5 12.5l4.5 4.5L19 7.5',
      mail: 'M3.5 6h17v12h-17zM3.5 7l8.5 6.5L20.5 7',
      more: 'M5 12h.1M12 12h.1M19 12h.1',
      x: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zM17.61 20.64h2.04L6.49 3.24H4.3z',
      facebook: 'M9.1 23.69v-7.98H6.63v-3.67H9.1v-1.58c0-4.09 1.85-5.98 5.86-5.98.4 0 .96.04 1.47.1.38.04.76.1 1.14.2v3.32a8.6 8.6 0 0 0-.65-.04 27 27 0 0 0-.73 0c-.71 0-1.26.1-1.68.31-.28.14-.52.36-.68.63-.26.42-.37.99-.37 1.75v1.3h3.92l-.39 2.1-.29 1.57h-3.25v8.24C19.4 23.24 24 18.18 24 12.04c0-6.63-5.37-12-12-12S0 5.42 0 12.04c0 5.63 3.87 10.35 9.1 11.65z',
    };
    const FILLED = new Set(['x', 'facebook']);
    const svg = k => '<svg viewBox="0 0 24 24" aria-hidden="true"' + (FILLED.has(k) ? ' class="lm-fill"' : '') + '><path d="' + PATHS[k] + '"/></svg>';
    const make = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html) n.innerHTML = html; return n; };
    const set = (n, a, v) => { if (n && n.getAttribute(a) !== v) n.setAttribute(a, v); };
    const api = () => window.LuliyRecords;
    const now = () => { try { return api()?.getState?.() || {}; } catch (e) { return {}; } };
    const calm = () => reduced.matches || !!window.LuliyMotion?.calm;
    const EASE = 'cubic-bezier(.19,1,.22,1)';
    let mini = null, P = null, expanded = false, lastVolume = .45, watcher = null, subscribed = false, slide = null, volFrame = 0, volNext = 0;

    const shareUrl = () => location.origin + location.pathname + '#/music';
    const shareText = () => {
      const title = (mini?.querySelector('.lr-mini-title')?.textContent || '').trim();
      return (title ? say('listening', title) + ' · ' : '') + 'Luliy Records';
    };
    const setVolume = v => {
      volNext = Math.max(0, Math.min(1, Math.round(v * 100) / 100));
      if (!volFrame) volFrame = requestAnimationFrame(() => { volFrame = 0; api()?.setVolume?.(volNext); });
    };
    const toggleMute = () => {
      const v = Number(now().volume) || 0;
      if (v > 0) { lastVolume = v; setVolume(0); } else setVolume(lastVolume || .45);
    };

    // Popovers above the bar: the queue (the Drive script's panel) and share (ours). One at a time.
    const panelOpen = () => !!P && !P.panel.hidden;
    const closePanel = () => { if (panelOpen()) P.list.click(); };
    const shareOpen = () => !!P && !P.sharePop.hidden;
    const closeShare = refocus => {
      if (!shareOpen()) return;
      const inside = P.sharePop.contains(document.activeElement);
      P.sharePop.hidden = true;
      set(P.share, 'aria-expanded', 'false');
      if (refocus || inside) P.share.focus({ preventScroll: true });
    };
    const buildShare = () => {
      const url = shareUrl(), text = shareText(), enc = encodeURIComponent, pop = P.sharePop;
      pop.setAttribute('aria-label', say('share'));
      pop.innerHTML = '<div class="lm-bar-pop-head"><h2></h2><button type="button" class="lm-bar-x">' + svg('close') + '</button></div>' +
        '<div class="lm-bar-share-icons"></div>' +
        '<div class="lm-bar-share-url"><input type="text" readonly spellcheck="false"><button type="button" class="lm-bar-copy">' + svg('copy') + '</button></div>' +
        '<p class="lm-bar-sr" aria-live="polite"></p>';
      pop.querySelector('h2').textContent = say('share');
      const x = pop.querySelector('.lm-bar-x');
      x.setAttribute('aria-label', say('close'));
      x.addEventListener('click', () => closeShare(true));
      const icons = pop.querySelector('.lm-bar-share-icons');
      if (navigator.share) {
        const b = make('button', '', svg('more'));
        b.type = 'button'; b.setAttribute('aria-label', say('more')); b.title = say('more');
        b.addEventListener('click', () => { navigator.share({ title: 'Luliy Records', text, url }).catch(() => {}); });
        icons.append(b);
      }
      for (const [k, name, href] of [
        ['x', 'X', 'https://x.com/intent/post?text=' + enc(text) + '&url=' + enc(url)],
        ['facebook', 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url)],
        ['mail', say('mail'), 'mailto:?subject=' + enc(text) + '&body=' + enc(text + '\n' + url)],
      ]) {
        const a = make('a', '', svg(k));
        a.href = href; a.setAttribute('aria-label', name); a.title = name;
        if (k !== 'mail') { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        icons.append(a);
      }
      const input = pop.querySelector('input'), copy = pop.querySelector('.lm-bar-copy'), live = pop.querySelector('.lm-bar-sr');
      input.value = url; input.setAttribute('aria-label', say('link'));
      input.addEventListener('focus', () => input.select());
      copy.setAttribute('aria-label', say('copy')); copy.title = say('copy');
      let undo = 0;
      copy.addEventListener('click', async () => {
        let ok = false;
        try { await navigator.clipboard.writeText(url); ok = true; } catch (e) {
          input.focus(); input.select();
          try { ok = document.execCommand('copy'); } catch (e2) {}
        }
        if (!ok) return;
        copy.innerHTML = svg('done'); copy.classList.add('is-done'); live.textContent = say('copied');
        clearTimeout(undo);
        undo = setTimeout(() => { copy.innerHTML = svg('copy'); copy.classList.remove('is-done'); live.textContent = ''; }, 1800);
      });
    };
    const openShare = keyboard => {
      closePanel();
      buildShare();
      P.sharePop.hidden = false;
      set(P.share, 'aria-expanded', 'true');
      if (keyboard) P.sharePop.querySelector('.lm-bar-share-icons > *')?.focus();
    };

    // Phones: the compact bar opens into a bottom sheet (same elements, laid out by .lm-expanded).
    const expand = keyboard => {
      if (expanded || !P || !phone.matches || mini.hidden) return;
      if (slide) { slide.onfinish = null; slide.cancel(); slide = null; }
      expanded = true;
      P.vol.classList.remove('is-open');
      mini.classList.add('lm-expanded');
      root.classList.add('lm-sheet-open');
      P.scrim.hidden = false;
      mini.scrollTop = 0;
      label();
      if (!calm()) {
        mini.animate([{ translate: '0 100%' }, { translate: '0 0' }], { duration: 480, easing: EASE });
        P.scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320 });
      }
      if ('CloseWatcher' in window) {
        try { watcher = new CloseWatcher(); watcher.onclose = () => { watcher = null; collapse(); }; } catch (e) { watcher = null; }
      }
      if (keyboard) P.grip.focus({ preventScroll: true });
    };
    const collapse = instant => {
      if (!expanded || !P) return;
      expanded = false;
      if (watcher) { const w = watcher; watcher = null; w.destroy(); }
      closeShare(); closePanel(); P.vol.classList.remove('is-open');
      const refocus = mini.contains(document.activeElement);
      const done = () => {
        slide = null;
        if (expanded) return;
        mini.classList.remove('lm-expanded');
        mini.style.translate = '';
        root.classList.remove('lm-sheet-open');
        P.scrim.hidden = true;
        label();
        if (refocus) P.open.focus({ preventScroll: true });
      };
      if (instant || calm() || mini.hidden) { done(); return; }
      const from = mini.style.translate || '0 0';
      slide = mini.animate([{ translate: from }, { translate: '0 100%' }], { duration: 260, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      P.scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).onfinish = function () { this.cancel(); };
      slide.onfinish = () => {
        const a = slide; done(); a?.cancel();
        mini.animate([{ opacity: 0, translate: '0 14px' }, { opacity: 1, translate: '0 0' }], { duration: 320, easing: EASE });
      };
    };

    // Labels follow the site language; the records engine and the Drive script reset some on every update.
    const label = () => {
      if (!P) return;
      const muted = P.volBtn.dataset.muted === 'true', mouse = fine.matches && !phone.matches;
      const vName = mouse ? say(muted ? 'unmute' : 'mute') : say('volume');
      set(P.volBtn, 'aria-label', vName); set(P.volBtn, 'title', vName);
      if (mouse) { set(P.volBtn, 'aria-pressed', String(muted)); P.volBtn.removeAttribute('aria-expanded'); }
      else { P.volBtn.removeAttribute('aria-pressed'); set(P.volBtn, 'aria-expanded', String(P.vol.classList.contains('is-open'))); }
      set(P.volPop, 'aria-label', say('volume'));
      set(P.share, 'aria-label', say('share')); set(P.share, 'title', say('share'));
      const h = P.panelHead.querySelector('h2');
      if (h.textContent !== say('queue')) h.textContent = say('queue');
      set(P.panelHead.querySelector('.lm-bar-x'), 'aria-label', say('close'));
      set(P.grip, 'aria-label', say('collapse'));
      if (phone.matches && !expanded) {
        set(P.open, 'aria-label', say('expand')); set(P.open, 'aria-expanded', 'false'); set(P.open, 'title', say('expand'));
      } else {
        P.open.removeAttribute('aria-expanded');
        set(P.open, 'title', P.open.getAttribute('aria-label') || '');
      }
    };

    const sync = () => {
      if (!P) return;
      const s = now(), v = Math.max(0, Math.min(1, Number(s.volume) || 0)), muted = v === 0;
      if (v > 0) lastVolume = v;
      P.volPop.style.setProperty('--lm-vol', String(v));
      set(P.volPop, 'aria-valuenow', String(Math.round(v * 100)));
      set(P.volPop, 'aria-valuetext', Math.round(v * 100) + '%');
      if (P.volBtn.dataset.muted !== String(muted)) { P.volBtn.dataset.muted = String(muted); P.volBtn.innerHTML = svg(muted ? 'mute' : 'volume'); }
      mini.classList.toggle('lm-playing', !!s.playing);
      mini.classList.remove('lm-positioned');
      if (mini.hidden) { collapse(true); closeShare(); P.vol.classList.remove('is-open'); }
      label();
    };

    const upgrade = () => {
      const m = document.querySelector('.lr-mini.lm-mini[data-compact-ready]');
      if (!m || m.classList.contains('lm-bar')) return;
      const $ = s => m.querySelector(s);
      const open = $('.lr-mini-open'), controls = $('.lr-mini-controls'), progress = $('.lr-mini-progress'), close = $('.lr-mini-close'),
        volBtn = $('[data-lm-volume-toggle]'), list = $('[data-lm-list]'), panel = $('.lm-mini-panel'), seek = $('.lr-mini-seek');
      if (!open || !controls || !progress || !close || !volBtn || !list || !panel || !seek) return;
      mini = m;
      if (m.classList.contains('lm-collapsed')) $('[data-lm-fold]')?.click();
      const center = make('div', 'lm-bar-center'), right = make('div', 'lm-bar-right'), vol = make('div', 'lm-bar-vol');
      const volPop = make('div', 'lm-bar-vol-pop', '<span class="lm-bar-vol-track"><span class="lm-bar-vol-fill"></span></span>');
      volPop.id = 'lm-bar-volume'; volPop.tabIndex = 0;
      volPop.setAttribute('role', 'slider'); volPop.setAttribute('aria-orientation', 'vertical');
      volPop.setAttribute('aria-valuemin', '0'); volPop.setAttribute('aria-valuemax', '100');
      // The Drive script names buttons from data-lm-label on every update; the volume button is ours now (mute / slider).
      volBtn.removeAttribute('data-lm-label'); volBtn.setAttribute('aria-controls', 'lm-bar-volume');
      vol.append(volBtn, volPop);
      list.innerHTML = svg('queue');
      const share = make('button', 'lm-bar-share-btn', svg('share'));
      share.type = 'button'; share.setAttribute('aria-expanded', 'false'); share.setAttribute('aria-controls', 'lm-bar-share');
      const sharePop = make('div', 'lm-bar-share');
      sharePop.id = 'lm-bar-share'; sharePop.hidden = true; sharePop.setAttribute('role', 'dialog');
      const panelHead = make('div', 'lm-bar-panel-head', '<h2></h2><button type="button" class="lm-bar-x">' + svg('close') + '</button>');
      panel.prepend(panelHead);
      const grip = make('button', 'lm-bar-grip'); grip.type = 'button';
      const scrim = make('div', 'lm-bar-scrim'); scrim.hidden = true;
      document.body.append(scrim);
      center.append(controls, progress);
      right.append(vol, list, share, close);
      const keep = [...m.children].filter(n => ![open, panel].includes(n) && !n.classList.contains('lm-mini-error'));
      m.replaceChildren(grip, open, center, right, ...[$('.lm-mini-error')].filter(Boolean), panel, sharePop, ...keep);
      P = { open, center, right, vol, volBtn, volPop, list, share, sharePop, close, panel, panelHead, grip, scrim, seek };
      m.classList.add('lm-bar');
      m.classList.remove('lm-positioned');
      root.classList.add('lm-bar-mode');

      // Clicks that land on the bar outside its buttons would open the records page (records engine): keep them here.
      const contain = e => { if (!e.target.closest('[data-lr-mini]')) e.stopPropagation(); };
      center.addEventListener('click', contain);
      right.addEventListener('click', contain);
      sharePop.addEventListener('click', e => e.stopPropagation());
      grip.addEventListener('click', e => { e.stopPropagation(); collapse(); });
      scrim.addEventListener('click', () => collapse());
      panelHead.querySelector('.lm-bar-x').addEventListener('click', () => closePanel());
      share.addEventListener('click', e => { e.stopPropagation(); if (shareOpen()) closeShare(); else openShare(e.detail === 0); });
      list.addEventListener('click', () => closeShare(), true);
      // Volume button: click mutes (mouse); on touch a tap shows the slider. Capture runs before the old panel toggle.
      vol.addEventListener('click', e => {
        e.stopPropagation();
        if (!e.target.closest('[data-lm-volume-toggle]')) return;
        e.preventDefault();
        if (fine.matches && !phone.matches) toggleMute();
        else { vol.classList.toggle('is-open'); label(); }
      }, true);
      let dragId = null;
      const level = y => { const r = volPop.firstElementChild.getBoundingClientRect(); return r.height ? (r.bottom - y) / r.height : 0; };
      volPop.addEventListener('pointerdown', e => {
        if (e.button) return;
        e.preventDefault();
        dragId = e.pointerId;
        try { volPop.setPointerCapture(dragId); } catch (err) {}
        vol.classList.add('is-dragging');
        setVolume(level(e.clientY));
      });
      volPop.addEventListener('pointermove', e => { if (e.pointerId === dragId) setVolume(level(e.clientY)); });
      const end = e => { if (e.pointerId !== dragId) return; dragId = null; vol.classList.remove('is-dragging'); };
      for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) volPop.addEventListener(t, end);
      volPop.addEventListener('keydown', e => {
        const v = Number(now().volume) || 0;
        const step = { ArrowUp: .05, ArrowRight: .05, ArrowDown: -.05, ArrowLeft: -.05, PageUp: .1, PageDown: -.1 }[e.key];
        if (step) setVolume(v + step); else if (e.key === 'Home') setVolume(0); else if (e.key === 'End') setVolume(1); else return;
        e.preventDefault();
      });
      vol.addEventListener('wheel', e => {
        if (!fine.matches || !e.deltaY) return;
        e.preventDefault();
        setVolume((Number(now().volume) || 0) - Math.sign(e.deltaY) * .05);
      }, { passive: false });
      // The progress fill follows the thumb while seeking (otherwise it follows --lr-ring from the engine).
      seek.addEventListener('input', () => { const max = Number(seek.max) || 1; m.style.setProperty('--lm-seek', (Math.max(0, Math.min(1, Number(seek.value) / max)) * 100).toFixed(2) + '%'); });
      seek.addEventListener('change', () => requestAnimationFrame(() => m.style.removeProperty('--lm-seek')));
      // The old long press to drag the card does not apply to a bar.
      m.addEventListener('pointerdown', e => { if (e.target.closest('.lr-mini-open')) e.stopPropagation(); }, true);
      // Phones: the compact bar's text opens the sheet; in the sheet, cover and title open the records page.
      m.addEventListener('click', e => {
        if (!e.target.closest('.lr-mini-open')) return;
        if (phone.matches && !expanded) { e.preventDefault(); e.stopPropagation(); expand(e.detail === 0); }
        else if (expanded) collapse(true);
      }, true);
      // Swipe the sheet down to close it.
      let drag = null;
      m.addEventListener('touchstart', e => {
        drag = null;
        if (!expanded || e.touches.length !== 1 || m.scrollTop > 0) return;
        if (e.target.closest('input, [role="slider"], .lm-mini-panel, .lm-bar-share')) return;
        drag = { y: e.touches[0].clientY, dy: 0, t: performance.now(), moving: false };
      }, { passive: true });
      m.addEventListener('touchmove', e => {
        if (!drag) return;
        const dy = e.touches[0].clientY - drag.y;
        if (!drag.moving && dy < 6) { if (dy < 0) drag = null; return; }
        e.preventDefault();
        drag.moving = true; drag.dy = Math.max(0, dy);
        m.style.translate = '0 ' + drag.dy + 'px';
      }, { passive: false });
      const release = () => {
        const d = drag; drag = null;
        if (!d?.moving) return;
        const fast = d.dy / Math.max(1, performance.now() - d.t) > .6;
        if (d.dy > 120 || (fast && d.dy > 40)) collapse();
        else {
          m.style.translate = '';
          if (!calm()) m.animate([{ translate: '0 ' + d.dy + 'px' }, { translate: '0 0' }], { duration: 300, easing: EASE });
        }
      };
      m.addEventListener('touchend', release);
      m.addEventListener('touchcancel', release);
      sync();
    };

    // Outside taps close the popovers; Esc closes the newest layer.
    document.addEventListener('pointerdown', e => {
      if (!P || mini.hidden) return;
      const t = e.target;
      if (P.vol.classList.contains('is-open') && !P.vol.contains(t)) { P.vol.classList.remove('is-open'); label(); }
      if (shareOpen() && !P.sharePop.contains(t) && !P.share.contains(t)) closeShare();
      if (panelOpen() && !P.panel.contains(t) && !P.list.contains(t) && !P.share.contains(t)) closePanel();
    }, true);
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || e.defaultPrevented || !P) return;
      if (shareOpen()) { e.preventDefault(); closeShare(true); }
      else if (P.vol.classList.contains('is-open')) { e.preventDefault(); P.vol.classList.remove('is-open'); P.volBtn.focus(); label(); }
      else if (expanded) { e.preventDefault(); collapse(); }
    });
    phone.addEventListener?.('change', () => { if (!P) return; collapse(true); closeShare(); closePanel(); P.vol.classList.remove('is-open'); label(); });
    fine.addEventListener?.('change', () => label());
    new MutationObserver(() => label()).observe(root, { attributes: true, attributeFilter: ['lang'] });

    const tick = () => {
      if (P && !mini.isConnected) { P.scrim.remove(); P = null; mini = null; expanded = false; root.classList.remove('lm-bar-mode', 'lm-sheet-open'); }
      if (!P) upgrade();
      if (P) sync();
    };
    const hook = () => {
      const R = api();
      if (R && !subscribed && typeof R.subscribe === 'function') { subscribed = true; R.subscribe(() => queueMicrotask(tick)); }
      tick();
    };
    hook();
    new MutationObserver(() => { if (!subscribed || !P) hook(); }).observe(document.body, { childList: true });
  })();

  /* 16. The brand on phones ("mobile", same media query as home-fixes.css). Computers keep the original header and
     directory: the L mark opens the blog's GitHub Issues in a new tab, ULIY goes home (and closes the directory).
     Phones keep that wherever ULIY is shown: in the directory and in the header on About. Elsewhere the phone
     header shows only the L mark (ULIY is hidden by CSS), so there the mark takes over both jobs: a tap does what
     ULIY does (home, which on phones is the article list), and holding it for half a second opens the mark's own
     link, GitHub Issues, in a new tab. While held the mark shrinks
     slightly; when the half second is up it springs back (and a phone buzzes) to say "let go". Touch opens on
     touchend and mouse on click, both user gestures, so pop-up blockers let the tab through. Moving more than 10px
     (scrolling) cancels; the system long-press menu, text selection and dragging are suppressed (CSS).
     The header star (site-route-tail) normally sits on ULIY's Y; while that is hidden it moves to the mark's corner.
     On article pages (list #/posts and reading #/article/…) tap and hold swap: tap opens GitHub
     Issues, holding goes home. */
  (() => {
    const mq = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const SEL = '#header a.brand-mark';
    const HOLD = 500;
    const root = document.documentElement;
    const group = document.querySelector('#header .brand-group');
    // The header mark takes over on phones while ULIY beside it is hidden (every page but About).
    const takes = () => mq.matches && !root.classList.contains('luliy-route-about');
    const mark = e => (takes() && e.target.closest && e.target.closest(SEL)) || null;
    const partner = () => document.querySelector('#header a.brand');
    // Article pages (list #/posts and reading #/article/…): tap and hold swap —
    // tap opens GitHub Issues, holding goes home. Elsewhere the original meaning stands.
    const isArticlePage = () => /^#\/(posts|article)(\/|$|\?)/.test(location.hash || '');
    const swap = () => takes() && isArticlePage();
    const phoneLabel = () => {
      const l = root.lang || '';
      if (swap()) return l.startsWith('en') ? ['Luliy Issues (hold: home)', 'Tap: GitHub Issues · Hold: home']
        : l.startsWith('ja') ? ['Luliy Issues（長押し：ホーム）', 'タップ：GitHub Issues · 長押し：ホーム']
        : ['Luliy Issues（长按：首页）', '点按：GitHub Issues · 长按：首页'];
      return l.startsWith('en') ? ['Luliy home (hold: GitHub Issues)', 'Tap: home · Hold: GitHub Issues']
        : l.startsWith('ja') ? ['Luliy ホーム（長押し：GitHub Issues）', 'タップ：ホーム · 長押し：GitHub Issues']
        : ['Luliy 首页（长按：GitHub Issues）', '点按：首页 · 长按：GitHub Issues'];
    };
    let el = null, timer = 0, held = false, x = 0, y = 0;
    const clear = () => {
      clearTimeout(timer); timer = 0;
      if (el) el.classList.remove('luliy-pressing');
    };
    const end = () => { clear(); if (el) el.classList.remove('luliy-held'); el = null; held = false; };
    const sync = () => {
      const on = takes();
      const m = document.querySelector(SEL);
      if (!m) return;
      if (!('deskLabel' in m.dataset)) { m.dataset.deskLabel = m.getAttribute('aria-label') || ''; m.dataset.deskTitle = m.getAttribute('title') || ''; }
      const [label, title] = on ? phoneLabel() : [m.dataset.deskLabel, m.dataset.deskTitle];
      if (m.getAttribute('aria-label') !== label) m.setAttribute('aria-label', label);
      if (m.getAttribute('title') !== title) m.setAttribute('title', title);
      m.classList.toggle('luliy-takes', on);
      if (!on) end();
      if (group) m.classList.toggle('brand-cross-anchor', on && !group.classList.contains('has-page-name'));
    };
    mq.addEventListener('change', sync);
    addEventListener('hashchange', sync);
    if (group) new MutationObserver(sync).observe(group, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class', 'lang'] });
    sync();

    const open = (node) => {
      const target = node || el;
      const url = target && target.href;
      end();
      if (url) window.open(url, '_blank', 'noopener');
    };
    document.addEventListener('pointerdown', e => {
      const t = mark(e);
      if (!t || !e.isPrimary || e.button !== 0) return;
      end(); el = t; x = e.clientX; y = e.clientY;
      t.classList.add('luliy-pressing');
      timer = setTimeout(() => {
        timer = 0; held = true;
        t.classList.remove('luliy-pressing'); t.classList.add('luliy-held');
        if (navigator.vibrate) navigator.vibrate(12);
      }, HOLD);
    }, true);
    document.addEventListener('pointermove', e => {
      if (el && !held && Math.hypot(e.clientX - x, e.clientY - y) > 10) end();
    }, true);
    document.addEventListener('pointercancel', () => { if (!held) end(); }, true);
    // A short press: the click follows (home). Pointer up outside the mark: no click follows, so tidy up.
    document.addEventListener('pointerup', e => {
      if (!el) return;
      if (!held) { clear(); if (!el.contains(e.target)) end(); }
      else if (!el.contains(e.target) && e.pointerType === 'mouse') end();
    }, true);
    document.addEventListener('touchend', e => {
      if (!held || !el) return;
      e.preventDefault();               // no click (so no trip home) after a hold
      if (swap()) { const home = partner(); end(); if (home) home.click(); return; }
      open();
    }, { capture: true, passive: false });
    document.addEventListener('click', e => {
      const t = mark(e);
      if (!t) { end(); return; }
      e.preventDefault(); e.stopPropagation();
      if (held && t === el) { if (swap()) { end(); const home = partner(); if (home) home.click(); } else open(t); return; }
      end();
      if (swap()) { open(t); return; }
      const home = partner();
      if (home) home.click();
    }, true);
    document.addEventListener('contextmenu', e => {
      if (mark(e)) e.preventDefault();
    }, true);
    document.addEventListener('dragstart', e => {
      if (mark(e)) e.preventDefault();
    }, true);
  })();
  /* 17. Phones, Works (#/projects): 網頁 · 真題區 · 照片牆 as header tabs, the same look as the article list's tabs
     (block 9). A tap scrolls smoothly to that section (the header stays while it does, block 4); while the page is
     scrolled, the tab of the section in view lights up. 我的空間 at the bottom is not a tab: 照片牆 stays lit there. */
  (() => {
    const mobile = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const main = document.getElementById('main');
    const header = document.getElementById('header');
    const inner = header?.querySelector('.header-inner');
    if (!main || !inner) return;
    const say = (zh, en, ja) => (/^en/.test(root.lang) ? en : /^ja/.test(root.lang) ? ja : zh);
    const TABS = [
      ['.works-page > .works-web-heading', '網頁', 'Web', 'ウェブ'],
      ['.works-exams-section > .section-label', '真題區', 'Exams', '過去問'],
      ['.works-photo-wall > .section-label', '照片牆', 'Photos', '写真'],
    ];
    let nav = null, targets = [], current = -1, queued = 0, settle = 0, onEnd = null;
    const top = el => el.getBoundingClientRect().top;
    const mark = i => {
      if (!nav || i === current) return;
      current = i;
      nav.querySelectorAll('button').forEach((b, k) => { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    };
    const spy = () => {
      queued = 0;
      if (!nav || root.classList.contains('luliy-tab-scrolling')) return;
      targets = TABS.map(([sel]) => main.querySelector(sel));     // sections can arrive after the page
      const line = innerHeight * 0.35;
      let i = 0;
      targets.forEach((t, k) => { if (t && top(t) <= line) i = k; });
      mark(i);
    };
    const done = () => {
      clearTimeout(settle); settle = 0;
      if (onEnd) { removeEventListener('scrollend', onEnd); onEnd = null; }
      if (!root.classList.contains('luliy-tab-scrolling')) return;
      root.classList.remove('luliy-tab-scrolling');
      spy();
    };
    const go = i => {
      const t = main.querySelector(TABS[i][0]);
      if (!t) return;
      mark(i);
      const y = Math.max(0, top(t) + scrollY - (i ? 84 : 120));
      done();
      root.classList.add('luliy-tab-scrolling');
      onEnd = () => done();
      addEventListener('scrollend', onEnd, { once: true });
      settle = setTimeout(done, 1200);                 // no scrollend (older Safari) or nothing to scroll
      scrollTo({ top: y, behavior: reduced.matches ? 'auto' : 'smooth' });
    };
    const label = () => {
      if (!nav) return;
      nav.setAttribute('aria-label', say('作品分區', 'Works sections', '作品のセクション'));
      nav.querySelectorAll('button').forEach((b, k) => { const t = say(TABS[k][1], TABS[k][2], TABS[k][3]); if (b.textContent !== t) b.textContent = t; });
    };
    const sync = () => {
      const page = mobile.matches ? main.querySelector('.works-page') : null;
      if (!page) {
        if (nav) { nav.remove(); nav = null; targets = []; current = -1; header.classList.remove('luliy-has-works-tabs'); done(); }
        return;
      }
      targets = TABS.map(([sel]) => main.querySelector(sel));
      if (!nav) {
        nav = document.createElement('nav');
        nav.className = 'luliy-header-modes luliy-works-tabs';
        TABS.forEach((_, k) => { const b = document.createElement('button'); b.type = 'button'; b.addEventListener('click', () => go(k)); nav.append(b); });
        inner.append(nav);
        header.classList.add('luliy-has-works-tabs');
        current = -1;
      }
      label();
      spy();
    };
    addEventListener('scroll', () => { if (nav && !queued) queued = requestAnimationFrame(spy); }, { passive: true });
    addEventListener('resize', () => { if (nav && !queued) queued = requestAnimationFrame(spy); }, { passive: true });
    new MutationObserver(sync).observe(main, { childList: true });
    new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ['lang'] });
    mobile.addEventListener('change', sync);
    sync();
  })();
  /* 18. Phones, study page (#/books): the 3D room fills the screen behind a transparent header (home-fixes.css).
     The room's "··· 書房" button becomes a "···" in the middle of the header; its tools drop down from the header.
     A tap outside, choosing a tool (except 更多), Esc or the Android back gesture closes them. The room's own button
     stays in place, hidden, and does the work, so the room code is untouched. While a seek or volume line is
     dragged its filled part follows (--fill; the player writes it too, runtime-fixes.py). */
  (() => {
    const mobile = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const header = document.getElementById('header');
    const inner = header?.querySelector('.header-inner');
    if (!inner) return;
    const say = (zh, en, ja) => (/^en/.test(root.lang) ? en : /^ja/.test(root.lang) ? ja : zh);
    const toggle = () => document.querySelector('body.study-single-page #studyRoom .study-room-tools-toggle');
    const tools = () => document.getElementById('studyRoomTools');
    let dots = null, watcher = null;
    const seen = new WeakSet();
    const isOpen = () => { const t = tools(); return !!t && !t.hidden; };
    const place = () => root.style.setProperty('--luliy-drop-top', Math.round(header.getBoundingClientRect().bottom) + 'px');
    const reflect = () => {
      const open = isOpen();
      if (dots) dots.setAttribute('aria-expanded', String(open));
      if (open && !watcher && 'CloseWatcher' in window) {
        try { watcher = new CloseWatcher(); watcher.onclose = () => { watcher = null; close(); }; } catch (e) {}
      } else if (!open && watcher) { const w = watcher; watcher = null; w.destroy(); }
    };
    const close = () => { const t = toggle(); if (t && isOpen()) t.click(); reflect(); };
    const watch = () => {
      const t = toggle();
      if (t && !seen.has(t)) { seen.add(t); new MutationObserver(reflect).observe(t, { attributes: true, attributeFilter: ['aria-expanded'] }); }
    };
    const label = () => { if (dots) dots.setAttribute('aria-label', say('書房功能', 'Study controls', '書斎の操作')); };
    const sync = () => {
      const on = mobile.matches && document.body.classList.contains('study-single-page');
      if (!on) {
        if (dots) { close(); dots.remove(); dots = null; }
        return;
      }
      if (!dots) {
        dots = document.createElement('button');
        dots.type = 'button';
        dots.className = 'luliy-header-dots';
        dots.setAttribute('aria-controls', 'studyRoomTools');
        dots.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>';
        dots.addEventListener('click', () => { const t = toggle(); if (!t) return; watch(); place(); t.click(); reflect(); });
        inner.append(dots);
      }
      label();
      watch();
      reflect();
    };
    // A tap anywhere else closes the tools (the tap still reaches what it lands on).
    document.addEventListener('pointerdown', e => {
      if (!dots || !isOpen()) return;
      if (e.target.closest('#studyRoomTools, .luliy-header-dots')) return;
      close();
    }, true);
    document.addEventListener('click', e => {
      if (!dots) return;
      const b = e.target.closest('#studyRoomTools button');
      if (b && !b.classList.contains('study-room-more')) setTimeout(close, 0);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && dots && isOpen() && !watcher) close(); });
    document.addEventListener('input', e => {
      const r = e.target.closest && e.target.closest('#studyRoom :is(.study-room-seek, .study-room-volume)');
      if (r) r.style.setProperty('--fill', ((r.value - r.min) / ((r.max - r.min) || 1)) * 100 + '%');
    }, true);
    addEventListener('resize', () => { if (isOpen()) place(); }, { passive: true });
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ['lang'] });
    mobile.addEventListener('change', sync);
    sync();
  })();
  /* 19. Phones, records page (#/music). The sleep timer shows only its clock; while it runs, a small badge
     beside it counts the minutes left (♪ = stop at the end of this song). The engine keeps the timer to itself,
     so the badge starts from the moment it is chosen (or from the status line after a re-render) and checks the
     select every 2 s: the engine resets it to 0 when the timer ends. 唱片 in the middle of the header lets a
     cloth down from the header, with a wavy hem. On it every record lies as a vinyl disc, like those in the
     study's middle drawer: black, grooved, the cover as its centre label; 3 columns on phones, more on wider
     screens (home-fixes.css). A tap plays that record (LuliyRecords.play, as a tap on the shelf does) and the
     cloth rolls back up. The record playing is lit and turns slowly. 唱片 again, a swipe up, a tap outside, Esc
     or the Android back gesture closes it; with reduced motion it only fades. */
  (() => {
    const mobile = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const header = document.getElementById('header');
    const inner = header?.querySelector('.header-inner');
    const main = document.getElementById('main');
    if (!inner || !main) return;
    const say = (zh, en, ja) => (/^en/.test(root.lang) ? en : /^ja/.test(root.lang) ? ja : zh);
    const api = () => window.LuliyRecords;

    // The sleep timer badge.
    const started = new WeakMap();
    let tick = 0;
    const badge = () => {
      const label = main.querySelector('.lr-standalone .lr-sleep-label'), sel = label?.querySelector('.lr-sleep');
      if (!sel) { clearInterval(tick); tick = 0; return; }
      let b = label.querySelector('.luliy-sleep-badge');
      if (!b) { b = document.createElement('span'); b.className = 'luliy-sleep-badge'; b.setAttribute('aria-hidden', 'true'); label.append(b); }
      const v = sel.value;
      let text = '';
      if (v === 'end') text = '♪';
      else if (+v > 0) {
        let t = started.get(sel);
        if (!t || t.value !== v) {
          const m = /(\d+)/.exec(main.querySelector('.lr-standalone .lr-listening-status')?.textContent || '');
          t = { value: v, until: Date.now() + (m ? +m[1] : +v) * 60000 };
          started.set(sel, t);
        }
        text = String(Math.max(1, Math.ceil((t.until - Date.now()) / 60000)));
      }
      if (b.textContent !== text) b.textContent = text;
      label.classList.toggle('luliy-sleep-on', !!text);
      if (text && !tick) tick = setInterval(badge, 2000);
      else if (!text && tick) { clearInterval(tick); tick = 0; }
    };
    document.addEventListener('change', e => {
      if (!e.target.matches?.('.lr-standalone .lr-sleep')) return;
      started.set(e.target, { value: e.target.value, until: Date.now() + (+e.target.value || 0) * 60000 });
      setTimeout(badge, 0);
    }, true);

    // 唱片 and the cloth.
    let button = null, cloth = null, hang = null, scroller = null, list = null, watcher = null, unsubscribe = null;
    let open = false, built = '', last = '', hideTimer = 0;
    const lang = () => api()?.getState?.().lang || (/^en/.test(root.lang) ? 'en' : /^ja/.test(root.lang) ? 'ja' : 'zh');
    const records = () => {
      const r = api();
      if (!r?.tracks) return [];
      const tracks = r.tracks();
      const shelf = [...main.querySelectorAll('.lr-standalone .lr-arc-shelf [data-lr-track]')].map(c => +c.dataset.lrTrack);
      const order = shelf.length ? shelf : tracks.map((_, i) => i);
      return order.map(i => [i, tracks[i]]).filter(([, t]) => t && !t.revoked);
    };
    const reflect = () => {
      if (!list) return;
      const s = api()?.getState?.();
      if (!s) return;
      const key = s.index + ':' + !!(s.playing || s.loading);
      if (key === last) return;
      last = key;
      cloth.dataset.playing = String(!!(s.playing || s.loading));
      list.querySelectorAll('.luliy-disc').forEach(d => { if (+d.dataset.track === s.index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    };
    const fill = () => {
      const items = records(), l = lang();
      const key = l + '|' + items.map(([i, t]) => i + ':' + t.id).join(',');
      if (key === built) return;
      built = key; last = '';
      list.textContent = '';
      for (const [i, t] of items) {
        const li = document.createElement('li'), b = document.createElement('button'), art = document.createElement('span');
        const vinyl = document.createElement('span'), label = document.createElement('span'), name = document.createElement('span');
        const title = t.name?.[l] || t.name?.zh || t.title || '';
        b.type = 'button'; b.className = 'luliy-disc'; b.dataset.track = i; b.setAttribute('aria-label', title);
        art.className = 'luliy-disc-art'; vinyl.className = 'luliy-disc-vinyl'; label.className = 'luliy-disc-label';
        if (t.cover && typeof t.cover === 'string') label.style.backgroundImage = 'url("' + t.cover.replace(/"/g, '%22') + '")';
        else { label.classList.add('luliy-disc-blank'); label.textContent = title.slice(0, 1); }
        name.className = 'luliy-disc-name'; name.textContent = title; name.setAttribute('aria-hidden', 'true');
        vinyl.append(label); art.append(vinyl); b.append(art, name); li.append(b); list.append(li);
      }
      cloth.querySelector('.luliy-cloth-count').textContent = say('全部唱片 · ' + items.length, 'All records · ' + items.length, 'すべてのレコード · ' + items.length);
      reflect();
    };
    const label = () => {
      if (button) {
        const t = say('唱片', 'Records', 'レコード');
        const span = button.querySelector('span');
        if (span.textContent !== t) span.textContent = t;
        button.setAttribute('aria-label', say('唱片：陳列所有唱片', 'Records: show every record', 'レコード：すべてのレコードを表示'));
      }
      if (cloth) { hang.setAttribute('aria-label', say('全部唱片', 'All records', 'すべてのレコード')); if (open) fill(); else built = ''; }
    };
    const build = () => {
      cloth = document.createElement('div');
      cloth.className = 'luliy-cloth';
      cloth.hidden = true;
      cloth.innerHTML = '<div class="luliy-cloth-shade"></div><div class="luliy-cloth-hang" id="luliyCloth" role="region"><div class="luliy-cloth-fabric">'
        + '<div class="luliy-cloth-scroll"><p class="luliy-cloth-count"></p><ul class="luliy-cloth-grid"></ul></div>'
        + '<span class="luliy-cloth-grip" aria-hidden="true"></span></div></div>';
      hang = cloth.querySelector('.luliy-cloth-hang');
      scroller = cloth.querySelector('.luliy-cloth-scroll');
      list = cloth.querySelector('.luliy-cloth-grid');
      document.body.append(cloth);
      list.addEventListener('click', e => {
        const d = e.target.closest('.luliy-disc'), r = api();
        if (!d || !r) return;
        const i = +d.dataset.track, s = r.getState();
        if (i !== s.index) r.play(i);
        else if (!s.playing && !s.loading) r.toggle();
        close();
      });
      cloth.querySelector('.luliy-cloth-shade').addEventListener('click', () => close());
      cloth.addEventListener('touchmove', e => { if (!hang.contains(e.target)) e.preventDefault(); }, { passive: false });
      // Swipe up: from the hem, or anywhere once the records are scrolled to the end.
      let y0 = 0, dy = 0, t0 = 0, pull = false;
      hang.addEventListener('touchstart', e => {
        const y = e.touches[0].clientY, box = hang.getBoundingClientRect();
        y0 = y; dy = 0; t0 = Date.now();
        pull = y > box.bottom - 44 || scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      }, { passive: true });
      hang.addEventListener('touchmove', e => {
        if (!pull) return;
        dy = Math.min(0, e.touches[0].clientY - y0);
        if (!dy) { hang.style.transform = ''; return; }
        e.preventDefault();
        hang.style.transition = 'none';
        hang.style.transform = 'translateY(' + dy + 'px)';
      }, { passive: false });
      const release = () => {
        if (!pull) return;
        pull = false;
        const gone = dy < -70 || -dy / Math.max(1, Date.now() - t0) > 0.5;
        hang.style.transition = '';
        hang.style.transform = '';
        if (gone) close();
      };
      hang.addEventListener('touchend', release);
      hang.addEventListener('touchcancel', release);
    };
    const place = () => root.style.setProperty('--luliy-drop-top', Math.round(header.getBoundingClientRect().bottom) + 'px');
    const show = () => {
      if (open || !button) return;
      if (!cloth) build();
      clearTimeout(hideTimer);
      open = true;
      place();
      fill();
      scroller.scrollTop = 0;
      const current = list.querySelector('.luliy-disc[aria-current]');
      if (current) scroller.scrollTop = Math.max(0, current.offsetTop - scroller.clientHeight / 2 + current.offsetHeight / 2);
      cloth.hidden = false;
      void cloth.offsetWidth;                       // start the drop from the rolled-up position
      cloth.classList.add('is-open');
      root.classList.add('luliy-cloth-open');
      button.setAttribute('aria-expanded', 'true');
      if ('CloseWatcher' in window && !watcher) {
        try { watcher = new CloseWatcher(); watcher.onclose = () => { watcher = null; close(); }; } catch (e) {}
      }
    };
    const close = (instant = false) => {
      if (!open) return;
      open = false;
      cloth.classList.remove('is-open');
      root.classList.remove('luliy-cloth-open');
      button?.setAttribute('aria-expanded', 'false');
      if (watcher) { const w = watcher; watcher = null; w.destroy(); }
      clearTimeout(hideTimer);
      if (instant) cloth.hidden = true;
      else hideTimer = setTimeout(() => { if (!open) cloth.hidden = true; }, reduced.matches ? 200 : 420);
    };
    const sync = () => {
      const on = mobile.matches && document.body.classList.contains('record-single-page');
      if (!on) {
        if (button) { close(true); button.remove(); button = null; header.classList.remove('luliy-has-records-button'); }
        if (unsubscribe) { unsubscribe(); unsubscribe = null; }
        built = '';
        badge();
        return;
      }
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'luliy-header-records';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', 'luliyCloth');
        button.innerHTML = '<span></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';
        button.addEventListener('click', () => (open ? close() : show()));
        inner.append(button);
        header.classList.add('luliy-has-records-button');
      }
      if (!unsubscribe && api()?.subscribe) { try { unsubscribe = api().subscribe(() => { if (!tick) badge(); reflect(); }); } catch (e) {} }
      label();
      badge();
    };
    // A tap outside the cloth and 唱片 closes it (the shade takes taps below the hem; this catches the header).
    document.addEventListener('pointerdown', e => {
      if (!open || e.target.closest('.luliy-cloth-hang, .luliy-header-records, .luliy-cloth-shade')) return;
      close();
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open && !watcher) { close(); button?.focus(); } });
    addEventListener('resize', () => { if (open) place(); }, { passive: true });
    addEventListener('hashchange', () => close(true));
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ['lang'] });
    mobile.addEventListener('change', sync);
    sync();
  })();
  /* 20. Phones, article reading page (#/article/Pxx). 文章 in the middle of the header lets a
     cloth down from the header, the same cloth as the records one (block 19): on it every
     article lies as a row — the list number (01, 02, …; newest first, as on the article list
     page) and the title, no date. A tap opens that article (the cloth rolls back up); the
     article being read is marked. 文章 again, a swipe up, a tap outside, Esc or the Android
     back gesture closes it; with reduced motion it only fades. The list comes from the blog's
     postList.json (same source as the article list page), fetched once and cached. */
  (() => {
    const mobile = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const header = document.getElementById('header');
    const inner = header?.querySelector('.header-inner');
    const main = document.getElementById('main');
    if (!inner || !main) return;
    const say = (zh, en, ja) => (/^en/.test(root.lang) ? en : /^ja/.test(root.lang) ? ja : zh);
    // 文章 and the cloth.
    let button = null, cloth = null, hang = null, scroller = null, list = null, watcher = null;
    let open = false, built = '', last = '', hideTimer = 0;
    let posts = null, postsLoading = false, postsFailed = false;
    const lang = () => (/^en/.test(root.lang) ? 'en' : /^ja/.test(root.lang) ? 'ja' : 'zh');
    const currentKey = () => {
      const m = /^#\/article\/(P\d+)/i.exec(location.hash || '');
      return m ? m[1].toUpperCase() : '';
    };
    const loadPosts = () => {
      if (posts || postsLoading) return;
      postsLoading = true; postsFailed = false;
      fetch('https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/postList.json')
        .then(r => { if (!r.ok) throw new Error('postList ' + r.status); return r.json(); })
        .then(d => {
          const arr = Object.keys(d).filter(k => /^P\d+$/.test(k)).map(k => ({
            key: k.toUpperCase(),
            title: d[k].postTitle || '',
            date: d[k].createdDate || '',
            ts: (n => (isFinite(n) && n > 0 ? (n > 1e12 ? n : n * 1000) : (Date.parse(d[k].createdDate || '') || 0)))(Number(d[k].createdAt)),
            labels: (Array.isArray(d[k].labels) ? d[k].labels : []).map(l => String(l && l.name !== undefined ? l.name : l).trim()).filter(Boolean)
          }));
          arr.sort((a, b) => b.date.localeCompare(a.date) || (+b.key.slice(1)) - (+a.key.slice(1)));
          posts = arr; postsLoading = false; built = '';
          label();
          if (open) fill();
        })
        .catch(() => { postsLoading = false; postsFailed = true; built = ''; if (open) fill(); });
    };
    /* 2026-11-02: 文章 becomes the category of the article being read (Weekly, AI, study …) and the cloth lists only
       that category. weekly / 周記 wins over other labels; otherwise the first label. An article without labels
       keeps 文章 and every article. Labels: the feed, else block 37's cached map, else the category line. */
    const WEEKLY = /(^|[^a-z])weekly([^a-z]|$)|周[记記]|週記/i;
    const labelsOf = key => {
      const p = posts && posts.find(t => t.key === key);
      if (p) return p.labels;
      try { const m = JSON.parse(localStorage.getItem('luliy-label-map-v1') || '{}'); if (m && Array.isArray(m[key])) return m[key]; } catch (e) {}
      const c = main.querySelector('.source-reading .source-category');
      if (!c) return [];
      const parts = c.textContent.split('·').map(s => s.trim());
      return parts.length > 1 ? parts.slice(1).join('·').split('/').map(s => s.trim()).filter(Boolean) : [];
    };
    const catOf = key => {
      const ls = key ? labelsOf(key) : [];
      if (ls.some(l => WEEKLY.test(l))) return { name: 'Weekly', weekly: true, has: t => t.labels.some(l => WEEKLY.test(l)) };
      if (!ls.length) return null;
      const n = ls[0], low = n.toLowerCase();
      return { name: /^[a-z]/.test(n) ? n[0].toUpperCase() + n.slice(1) : n, weekly: false, has: t => t.labels.some(l => l.toLowerCase() === low) };
    };
    let cat = null;
    const articles = () => {
      const all = posts || [];
      if (!cat) return all;
      const own = all.filter(cat.has);
      return own.length ? own : all;
    };
    const reflect = () => {
      if (!list) return;
      const key = currentKey();
      if (key === last) return;
      last = key;
      list.querySelectorAll('.luliy-article-row').forEach(r => {
        if (r.dataset.article === key) r.setAttribute('aria-current', 'true');
        else r.removeAttribute('aria-current');
      });
    };
    const fill = () => {
      const items = articles(), l = lang();
      const key = l + '|' + (cat ? cat.name : '') + '|' + (posts ? items.map(t => t.key).join(',') : postsLoading ? 'loading' : 'failed');
      if (key !== built) {
        built = key;
        list.textContent = '';
        if (!posts) {
          const li = document.createElement('li');
          li.className = 'luliy-cloth-note';
          li.textContent = postsFailed
            ? say('载入失败，稍后再试', 'Could not load, try again later', '読み込めませんでした。あとでもう一度お試しください')
            : say('载入中…', 'Loading…', '読み込み中…');
          list.append(li);
        } else {
          // Weekly: numbered by issue (oldest = 01, as in the article's 第 N 期), newest first.
          const issue = cat && cat.weekly && items !== posts ? [...items].sort((a, b) => (a.ts - b.ts) || a.date.localeCompare(b.date) || (+a.key.slice(1)) - (+b.key.slice(1))) : null;
          items.forEach((t, idx) => {
            const li = document.createElement('li'), b = document.createElement('button');
            const no = document.createElement('span'), title = document.createElement('span');
            b.type = 'button'; b.className = 'luliy-article-row'; b.dataset.article = t.key;
            b.setAttribute('aria-label', t.title);
            no.className = 'luliy-article-no'; no.textContent = String(issue ? issue.indexOf(t) + 1 : idx + 1).padStart(2, '0');
            title.className = 'luliy-article-title'; title.textContent = t.title;
            b.append(no, title); li.append(b); list.append(li);
          });
        }
        const own = cat && posts && items !== posts;
        cloth.querySelector('.luliy-cloth-count').textContent = !posts ? ''
          : own && cat.weekly ? say('Weekly · 共 ' + items.length + ' 期', 'Weekly · ' + items.length + ' issues', 'Weekly · 全 ' + items.length + ' 号')
          : own ? cat.name + ' · ' + say(items.length + ' 篇', items.length + (items.length === 1 ? ' article' : ' articles'), items.length + ' 本')
          : say('全部文章 · ' + items.length, 'All articles · ' + items.length, 'すべての記事 · ' + items.length);
      }
      reflect();
    };
    const label = () => {
      cat = button ? catOf(currentKey()) : null;
      if (button) {
        const t = cat ? cat.name : say('文章', 'Articles', '記事');
        const span = button.querySelector('span');
        if (span.textContent !== t) span.textContent = t;
        button.setAttribute('aria-label', cat ? cat.name + say('：陳列本分類的文章', ': show this category', '：この分類の記事を表示') : say('文章：陳列所有文章', 'Articles: show every article', '記事：すべての記事を表示'));
      }
      if (cloth) { hang.setAttribute('aria-label', cat ? cat.name : say('全部文章', 'All articles', 'すべての記事')); if (open) fill(); else built = ''; }
    };
    const build = () => {
      cloth = document.createElement('div');
      cloth.className = 'luliy-cloth';
      cloth.hidden = true;
      cloth.innerHTML = '<div class="luliy-cloth-shade"></div><div class="luliy-cloth-hang" id="luliyArticleCloth" role="region"><div class="luliy-cloth-fabric">'
        + '<div class="luliy-cloth-scroll"><p class="luliy-cloth-count"></p><ul class="luliy-cloth-articles"></ul></div>'
        + '<span class="luliy-cloth-grip" aria-hidden="true"></span></div></div>';
      hang = cloth.querySelector('.luliy-cloth-hang');
      scroller = cloth.querySelector('.luliy-cloth-scroll');
      list = cloth.querySelector('.luliy-cloth-articles');
      document.body.append(cloth);
      list.addEventListener('click', e => {
        const r = e.target.closest('.luliy-article-row');
        if (!r) return;
        location.hash = '#/article/' + r.dataset.article;
        close();
      });
      cloth.querySelector('.luliy-cloth-shade').addEventListener('click', () => close());
      cloth.addEventListener('touchmove', e => { if (!hang.contains(e.target)) e.preventDefault(); }, { passive: false });
      // Swipe up: from the hem, or anywhere once the articles are scrolled to the end.
      let y0 = 0, dy = 0, t0 = 0, pull = false;
      hang.addEventListener('touchstart', e => {
        const y = e.touches[0].clientY, box = hang.getBoundingClientRect();
        y0 = y; dy = 0; t0 = Date.now();
        pull = y > box.bottom - 44 || scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      }, { passive: true });
      hang.addEventListener('touchmove', e => {
        if (!pull) return;
        dy = Math.min(0, e.touches[0].clientY - y0);
        if (!dy) { hang.style.transform = ''; return; }
        e.preventDefault();
        hang.style.transition = 'none';
        hang.style.transform = 'translateY(' + dy + 'px)';
      }, { passive: false });
      const release = () => {
        if (!pull) return;
        pull = false;
        const gone = dy < -70 || -dy / Math.max(1, Date.now() - t0) > 0.5;
        hang.style.transition = '';
        hang.style.transform = '';
        if (gone) close();
      };
      hang.addEventListener('touchend', release);
      hang.addEventListener('touchcancel', release);
    };
    const place = () => root.style.setProperty('--luliy-drop-top', Math.round(header.getBoundingClientRect().bottom) + 'px');
    const show = () => {
      if (open || !button) return;
      if (!cloth) build();
      clearTimeout(hideTimer);
      open = true;
      place();
      loadPosts();
      fill();
      scroller.scrollTop = 0;
      const current = list.querySelector('.luliy-article-row[aria-current]');
      if (current) scroller.scrollTop = Math.max(0, current.offsetTop - scroller.clientHeight / 2 + current.offsetHeight / 2);
      cloth.hidden = false;
      void cloth.offsetWidth;                       // start the drop from the rolled-up position
      cloth.classList.add('is-open');
      root.classList.add('luliy-cloth-open');
      button.setAttribute('aria-expanded', 'true');
      if ('CloseWatcher' in window && !watcher) {
        try { watcher = new CloseWatcher(); watcher.onclose = () => { watcher = null; close(); }; } catch (e) {}
      }
    };
    const close = (instant = false) => {
      if (!open) return;
      open = false;
      cloth.classList.remove('is-open');
      root.classList.remove('luliy-cloth-open');
      button?.setAttribute('aria-expanded', 'false');
      if (watcher) { const w = watcher; watcher = null; w.destroy(); }
      clearTimeout(hideTimer);
      if (instant) cloth.hidden = true;
      else hideTimer = setTimeout(() => { if (!open) cloth.hidden = true; }, reduced.matches ? 200 : 420);
    };
    const sync = () => {
      const on = mobile.matches && document.body.classList.contains('luliy-reading');
      if (!on) {
        if (button) { close(true); button.remove(); button = null; header.classList.remove('luliy-has-articles-button'); }
        built = '';
        return;
      }
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'luliy-header-articles';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', 'luliyArticleCloth');
        button.innerHTML = '<span></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';
        button.addEventListener('click', () => (open ? close() : show()));
        inner.append(button);
        header.classList.add('luliy-has-articles-button');
      }
      loadPosts();
      label();
    };
    // The article (and its category line) changes without a body class change: relabel once per frame.
    let relabelQ = 0;
    const relabel = () => { if (button && !relabelQ) relabelQ = requestAnimationFrame(() => { relabelQ = 0; label(); }); };
    addEventListener('hashchange', relabel);
    new MutationObserver(relabel).observe(main, { childList: true });
    // A tap outside the cloth and 文章 closes it (the shade takes taps below the hem; this catches the header).
    document.addEventListener('pointerdown', e => {
      if (!open || e.target.closest('.luliy-cloth-hang, .luliy-header-articles, .luliy-cloth-shade')) return;
      close();
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open && !watcher) { close(); button?.focus(); } });
    addEventListener('resize', () => { if (open) place(); }, { passive: true });
    addEventListener('hashchange', () => close(true));
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ['lang'] });
    mobile.addEventListener('change', sync);
    sync();
  })();

  /* 21. Study (#/books) and Records (#/music), all devices: a loader that covers the switch.
     2026-10-30 rework — before, the loader only appeared after the heavy work and then flickered:
       - The router's hashchange handler runs first and, inside a View Transition, tears down the
         homepage WebGL scenes (renderer.forceContextLoss) and builds the room. That blocks the main
         thread for a second or more. This loader's listener used to run after it, so it was created
         only once the work was nearly over.
       - Its animation (SVG stroke-dashoffset, SVG child opacity) runs on the main thread, so even
         when it was visible it froze, then jumped and faded out — the "flash at the end".
     Now:
       a) A hashchange listener in home-early.js (inlined at the top of <head>) runs before the
          router's and calls window.LuliyRoomGate below. For a room route it holds the event, shows the loader, waits two painted frames, then dispatches hashchange again for the
          router (with View Transitions off for that one dispatch: the loader already covers the swap).
       b) The loader animates only transform/opacity on its own layers, which the compositor keeps
          running while the main thread is busy.
       c) WEBGL_lose_context.loseContext() (what forceContextLoss calls) is queued until the room is
          visible and the browser is idle, instead of running in the middle of the switch.
     The loader stays up until the room is actually entering (Study: #studyRoom gets is-revealing or
     has-fallback; Records: the turntable host gets lr-webgl-ready or has-fallback), at most 8 s.
     It is a separate element (#luliy-room-loader) from the entry loader, so a direct load cannot
     pull it away. */
  (() => {
    const main = document.getElementById('main');
    if (!main) return;
    function createRoomLoader() {
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
        var css = '#luliy-room-loader{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:' + C[0] + ';transition:opacity 450ms cubic-bezier(.22,.61,.36,1);will-change:opacity;transform:translateZ(0)}' +
          '#luliy-room-loader.is-done{opacity:0;pointer-events:none}' +
          '#luliy-room-loader .lrl-mark{position:relative;width:88px;height:88px;will-change:transform,opacity;animation:luliy-loader-breathe 2.4s cubic-bezier(.65,0,.35,1) infinite alternate}' +
          '#luliy-room-loader svg{display:block;width:88px;height:88px;overflow:visible;fill:none;stroke-linejoin:round;stroke-linecap:round}' +
          '#luliy-room-loader .o{stroke:' + C[1] + ';stroke-width:.55}' +
          '#luliy-room-loader .l{stroke:' + C[2] + ';stroke-width:1}' +
          '#luliy-room-loader .t{stroke:' + C[2] + ';stroke-width:2.4;opacity:.3}' +
          '#luliy-room-loader .lrl-ring{position:absolute;inset:-22px;border-radius:50%;border:1px solid transparent;border-top-color:' + C[2] + ';border-right-color:' + C[1] + ';opacity:.7;will-change:transform;animation:luliy-loader-spin 1.6s linear infinite}' +
          '@keyframes luliy-loader-breathe{from{opacity:.6;transform:scale(.97)}to{opacity:1;transform:scale(1)}}@keyframes luliy-loader-spin{to{transform:rotate(360deg)}}' +
          '@media(prefers-reduced-motion:reduce){#luliy-room-loader .lrl-mark,#luliy-room-loader .lrl-ring{animation:none}#luliy-room-loader .lrl-ring{display:none}}' +
          'html.luliy-calm #luliy-room-loader .lrl-mark,html.luliy-calm #luliy-room-loader .lrl-ring{animation:none}html.luliy-calm #luliy-room-loader .lrl-ring{display:none}';
          if (a === 'light') css = '#luliy-room-loader{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:' + C[0] + ';transition:opacity 450ms cubic-bezier(.22,.61,.36,1);will-change:opacity;transform:translateZ(0)}' +
            '#luliy-room-loader.is-done{opacity:0;pointer-events:none}' +
            '#luliy-room-loader img{width:120px;height:120px;object-fit:contain;will-change:transform,opacity;animation:luliy-loader-breathe-img 2.4s cubic-bezier(.65,0,.35,1) infinite alternate}' +
            '@keyframes luliy-loader-breathe-img{from{opacity:.55;transform:scale(.96)}to{opacity:1;transform:scale(1)}}' +
            '@media(prefers-reduced-motion:reduce){#luliy-room-loader img{animation:none;opacity:1;transform:none}}' +
            'html.luliy-calm #luliy-room-loader img{animation:none;opacity:1;transform:none}';
        // The same loader as the site-wide one (home-early.js): outline, gold rising, no ring.
        var look = window.LuliyLoaderLook && window.LuliyLoaderLook();
        if (look) css = look.css;
        var style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
        var el = document.createElement('div');
        el.id = 'luliy-room-loader';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = '<div class="lrl-mark"><i class="lrl-ring"></i><svg viewBox="0 0 60 60">' + paths('o') + paths('t', 4) + paths('l', 4) + '</svg></div>';
        if (a === 'light') el.innerHTML = '<img src="/assets/site/%5BIT-XIAOBIN%5D-1792981037054.png" alt="" aria-hidden="true">';
        if (look) el.innerHTML = look.html;
        document.documentElement.appendChild(el);
        if (look && window.LuliyLoaderArm) window.LuliyLoaderArm(el);
      return el;
    }
    let loader = null, done = false, t0 = 0, cap = 0, hostObs = null, mainObs = null;
    const ROOM = /^#\/(books|music)(?=$|[/?])/;
    const roomOf = h => { const m = ROOM.exec(h || ''); return m ? m[1] : ''; };
    const isRoom = () => !!roomOf(location.hash);
    const pathOf = u => { const h = String(u || '').split('#')[1] || ''; return h.split('?')[0]; };
    const finish = () => {
      if (done || !loader) return;
      done = true;
      clearTimeout(cap);
      if (hostObs) { hostObs.disconnect(); hostObs = null; }
      if (mainObs) { mainObs.disconnect(); mainObs = null; }
      const el = loader;
      loader = null;
      const wait = Math.max(0, 700 - (Date.now() - t0));
      const lift = () => { el.classList.add('is-done'); setTimeout(() => el.remove(), 500); };
      setTimeout(() => (window.LuliyLoaderFinish ? window.LuliyLoaderFinish(el, lift) : lift()), wait);
    };
    const cancel = () => {
      clearTimeout(cap);
      if (hostObs) { hostObs.disconnect(); hostObs = null; }
      if (mainObs) { mainObs.disconnect(); mainObs = null; }
      if (loader) { loader.remove(); loader = null; }
      done = false;
    };
    // Records: the turntable marks its host lr-webgl-ready after its first frame; let that frame
    // reach the screen before lifting the loader.
    const ready = () => {
      if (roomOf(location.hash) === 'music') {
        const cover = document.getElementById('luliy-room-loader');
        if (cover && cover.dataset.recordsGate) return false; // Records page still holding it (tracks / cover / duration)
        return !!main.querySelector('#recordMount.lr-webgl-ready, #recordMount .lr-webgl-ready, #recordMount .has-fallback, #recordMount.has-fallback');
      }
      const host = document.getElementById('studyRoom');
      return !!host && (host.classList.contains('is-revealing') || host.classList.contains('has-fallback'));
    };
    const watchMain = () => {
      if (ready()) { requestAnimationFrame(() => requestAnimationFrame(finish)); return; }
      mainObs = new MutationObserver(() => {
        if (!ready()) return;
        mainObs.disconnect(); mainObs = null;
        requestAnimationFrame(() => requestAnimationFrame(finish));
      });
      mainObs.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    };
    const show = () => {
      if (!isRoom()) return;
      if (loader) { // already gating (a category switch re-mounted the room): re-watch the new host
        done = false;
        clearTimeout(cap);
        cap = setTimeout(finish, 8000);
        if (hostObs) { hostObs.disconnect(); hostObs = null; }
        if (mainObs) { mainObs.disconnect(); mainObs = null; }
        watchMain();
        return;
      }
      t0 = Date.now();
      done = false;
      loader = createRoomLoader();
      cap = setTimeout(finish, 8000);
      watchMain();
    };
    // Hold a room navigation until the loader has painted, then hand the same change to the router
    // and every other hashchange listener.
    let releasing = false;
    // home-early.js calls LuliyRoomGate from a hashchange listener registered before the router's.
    window.LuliyRoomGate = e => {
      if (releasing) return;
      if (!isRoom()) { cancel(); return; }
      if (pathOf(e.oldURL) === pathOf(e.newURL)) return; // query-only change: nothing is rebuilt
      e.stopImmediatePropagation();
      show();
      const target = location.hash;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (location.hash !== target) return; // a newer change already took over
        releasing = true;
        let shadowed = false;
        try { Object.defineProperty(document, 'startViewTransition', { value: undefined, configurable: true }); shadowed = true; } catch (err) {}
        try { dispatchEvent(new HashChangeEvent('hashchange', { oldURL: e.oldURL, newURL: e.newURL })); }
        finally {
          if (shadowed) delete document.startViewTransition;
          releasing = false;
        }
      }));
    };
    // A direct visit is already covered by the site loader (home-early.js), which waits for the same room signals.
    if (isRoom() && !(window.LuliySiteLoader && window.LuliySiteLoader.active)) show();
    addEventListener('luliy:records-gate', () => {
      if (loader && !done && ready()) { if (mainObs) { mainObs.disconnect(); mainObs = null; } requestAnimationFrame(() => requestAnimationFrame(finish)); }
    });

    // forceContextLoss() from the scenes being torn down: run it once the room is showing and the
    // browser is idle. The scenes have already disposed their buffers and textures and removed their
    // canvases, so a few seconds' delay only keeps an empty context alive a little longer.
    const queue = [];
    let flushing = false;
    const flush = () => {
      if (loader || !queue.length) { flushing = false; if (queue.length) later(); return; }
      try { queue.shift()(); } catch (err) {}
      if (queue.length) later(); else flushing = false;
    };
    const later = () => {
      flushing = true;
      if (window.requestIdleCallback) requestIdleCallback(flush, { timeout: 4000 });
      else setTimeout(flush, 600);
    };
    const wrap = proto => {
      if (!proto || proto.__luliyLoseWrapped) return;
      const get = proto.getExtension;
      proto.getExtension = function (name) {
        const ext = get.apply(this, arguments);
        if (ext && name === 'WEBGL_lose_context' && !ext.__luliyDeferred) {
          const lose = ext.loseContext;
          ext.loseContext = function () { queue.push(() => lose.call(ext)); if (!flushing) later(); };
          ext.__luliyDeferred = true;
        }
        return ext;
      };
      proto.__luliyLoseWrapped = true;
    };
    if (window.WebGLRenderingContext) wrap(WebGLRenderingContext.prototype);
    if (window.WebGL2RenderingContext) wrap(WebGL2RenderingContext.prototype);
  })();

  /* 22. Homepage Records portrait: use the user's own flipped photo (listen2.png).
     The app shell renders listen.png; swap it to listen2.png as soon as the Records
     portrait appears, so the flipped photo shows and no CSS flip is needed. */
  (function () {
    var URL2 = 'https://cloud.luliy.me/api/image?path=shared%2Flisten2.png';
    function swap() {
      var img = document.querySelector('#recordsHome .home-corner-image');
      if (img && img.getAttribute('src') !== URL2) img.setAttribute('src', URL2);
      return !!img;
    }
    if (!swap()) {
      var mo = new MutationObserver(function () { if (swap()) mo.disconnect(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
  })();

  /* 23. Homepage Records vinyl column (2026-10-27): at >=1600px the track list
     becomes a vinyl column to the right of the player (see home-fixes.css).
     The shelf is a sibling of .lr-layout, not inside it — home mounts the player
     with layout 'home', so the chunk never wraps the shelf in .lr-gallery (that
     only happens on the standalone #/music page) — and pure CSS cannot put a
     sibling into .lr-layout's grid. So move .lr-shelf into .lr-layout here when
     the viewport is >=1600px, and move it back (before .lr-collection) when it
     narrows. Moving the node keeps its listeners, so playback still works.
     Idempotent and stateless: place() only moves when the parent is wrong, so it
     is safe to run on every mutation and media change, including remounts. */
  (function () {
    var MQ = window.matchMedia('(min-width: 1600px)');
    function shelf() { return document.querySelector('#recordsHome .record-mount .lr-shelf'); }
    function layout() { return document.querySelector('#recordsHome .record-mount .lr-layout'); }
    function root() { return document.querySelector('#recordsHome .record-mount .lr-room'); }
    function collection() { return document.querySelector('#recordsHome .record-mount .lr-collection'); }
    function injectCovers() {
      var api = window.LuliyRecords;
      if (!api || typeof api.tracks !== 'function') return;
      var list;
      try { list = api.tracks(); } catch (e) { return; }
      if (!Array.isArray(list)) return;
      var cards = document.querySelectorAll('#recordsHome .record-mount .lr-record');
      for (var i = 0; i < cards.length; i++) {
        var t = list[i];
        if (!t || !t.cover) continue;
        var cover = cards[i].querySelector('.lr-cover');
        if (!cover || cover.querySelector('img')) continue;
        var img = document.createElement('img');
        img.src = t.cover;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        cover.appendChild(img);
      }
    }
    function place() {
      var s = shelf(), l = layout(), r = root();
      if (!s || !l || !r) return;
      if (MQ.matches) {
        if (s.parentElement !== l) l.appendChild(s);
      } else if (s.parentElement === l) {
        var c = collection();
        if (c) r.insertBefore(s, c); else r.appendChild(s);
      }
      injectCovers();
    }
    var mo = new MutationObserver(place);
    mo.observe(document.documentElement, { childList: true, subtree: true });
    if (MQ.addEventListener) MQ.addEventListener('change', place);
    else if (MQ.addListener) MQ.addListener(place);
    place();
  })();

  /* 24. Article reading page: background artwork, no footer, and the TOC tools (2026-10-30 rework).
     Reading pages are #/article/Pxx (source reader, .source-toc) and #/post/... (.article-toc).
     a) html.luliy-reading (set from the hash) hides the footer curtain and the space reserved for
        it (home-fixes.css), so an article ends at its own bottom and the artwork never has to hide.
        The header "联系" button (data-go-contact) scrolls to that footer, so on reading pages it
        opens the contact dialog instead.
     b) Desktop only (min-width 769px): a fixed full-viewport artwork layer is appended to
        .page-above with z-index -1 (above .page-above's background, below #main content). Choice
        and shade live in localStorage. A soft shade pool behind the text column plus a top
        gradient (home-fixes.css) keep text and the header icons readable over bright artwork.
        DEFAULT = NO BACKGROUND (2026-10-30 evening): with nothing stored the reading page is plain;
        the artwork only appears after the reader picks one in the TOC background panel. The panel's
        reset button returns to the plain page. To go back to "artwork by default", set
        DEFAULT_CHOICE below to 'default'.
     c) The TOC header uses SVG icons (Aa, find, background, close); the copy-link icon is hidden
        (the article meta row already has 分享). The background button opens a collapsed panel with
        one thumbnail per choice (this article's own image if it has one, every entry of
        data/backgrounds.json, none, my own picture), a shade slider and a reset. Opening it closes
        the Aa panel and the other way round.
     d) Reader width: the reader's default column (1600px) is migrated once to 820px; a width the
        reader has chosen themselves is left alone.
     Idempotent: apply() runs (at most once per frame) on changes inside #main, on hash changes and
     on media changes; injected nodes are only touched when something changed. */
  (function () {
    var DESKTOP = window.matchMedia('(min-width: 769px)');
    var LS_CHOICE = 'luliy-article-bg-choice';
    var LS_SCRIM = 'luliy-article-bg-scrim';
    var LS_CUSTOM = 'luliy-article-bg-custom';
    var BG_ID = 'luliy-article-bg';
    var DEFAULT_SCRIM = 30;
    var listCache = null, listLoading = false, sessionCustom = '', customVolatile = false;

    var ICON = {
      text: '<path d="M3.5 18 8 6.5 12.5 18M5.2 14h5.6"/><path d="m14.5 18 2.8-6.5 2.8 6.5M15.6 16h3.4"/>',
      find: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/>',
      bg: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.5"/><path d="m4.5 17 4.2-4.2 3.3 3.3 2.7-2.7 4.8 4.8"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      none: '<circle cx="12" cy="12" r="7.5"/><path d="m6.7 17.3 10.6-10.6"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      reset: '<path d="M5.5 12a6.5 6.5 0 1 0 2-4.7"/><path d="M5 4.5v3.8h3.8"/>',
      dim: '<circle cx="12" cy="12" r="7.5"/><path d="M12 4.5a7.5 7.5 0 0 1 0 15z" fill="currentColor" stroke="none"/>'
    };
    function svg(name) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICON[name] + '</svg>';
    }

    function main() { return document.getElementById('main'); }
    function above() { return document.querySelector('.page-above'); }
    function isReadingHash() { return /^#\/(?:article|post)\//.test(location.hash || ''); }
    function toc() {
      var m = main(); if (!m) return null;
      // Blog articles (#/article/Pxx) render via the source reader (.source-toc), not the
      // renderArticle template (.article-toc); study/book pages are out of scope.
      var hash = location.hash || '';
      if (hash.indexOf('#/article/') === 0) return m.querySelector('.source-toc');
      if (m.querySelector('.article-body')) return m.querySelector('.article-toc');
      return null;
    }
    function isActive() { return DESKTOP.matches && !!toc(); }
    function store(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
    function read(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
    function removeKey(k) { try { localStorage.removeItem(k); } catch (e) {} }
    // Nothing stored = no background. 'default' is now only ever an explicit pick of the
    // "文章配图" thumbnail (this article's own image); visitors who chose something keep it.
    var DEFAULT_CHOICE = 'none';
    function choice() { return read(LS_CHOICE) || DEFAULT_CHOICE; }
    var SCRIM_MIN = 15; // floor: a bright custom image can never be left unshaded under the text
    function scrimVal() {
      var v = parseInt(read(LS_SCRIM), 10);
      return isNaN(v) ? DEFAULT_SCRIM : Math.max(SCRIM_MIN, Math.min(100, v));
    }
    function coverSrc() {
      var m = main();
      var img = m && m.querySelector('.article-cover img');
      if (img && img.getAttribute('src')) return img.getAttribute('src');
      // Source-reader articles have no cover block; use the first image in the article body.
      var body = m && (m.querySelector('#sourceArticleBody') || m.querySelector('.article-body'));
      var first = body && body.querySelector('img');
      return first && first.getAttribute('src') ? first.getAttribute('src') : '';
    }
    function customSrc() { return read(LS_CUSTOM) || sessionCustom || ''; }

    /* (d) one-time migration of the reader's default width */
    (function migrateWidth() {
      try {
        if (localStorage.getItem('luliy-reader-width-v2')) return;
        var raw = localStorage.getItem('luliy-reader-prefs');
        var p = raw ? JSON.parse(raw) : {};
        if (!p || typeof p !== 'object') p = {};
        // The reader only honours a stored width when widthVersion is 2 (it resets anything else to 1600).
        if (p.widthVersion !== 2 || p.width === undefined || p.width === 1600) {
          p.width = 820; p.widthVersion = 2;
          localStorage.setItem('luliy-reader-prefs', JSON.stringify(p));
        }
        localStorage.setItem('luliy-reader-width-v2', '1');
      } catch (e) {}
    })();

    /* (a) reading class + contact button */
    function syncReading() {
      var on = isReadingHash();
      if (document.documentElement.classList.contains('luliy-reading') !== on) {
        document.documentElement.classList.toggle('luliy-reading', on);
      }
    }
    window.addEventListener('click', function (e) {
      if (!document.documentElement.classList.contains('luliy-reading')) return;
      var go = e.target && e.target.closest && e.target.closest('[data-go-contact]');
      if (!go) return;
      var open = document.querySelector('[data-contact]');
      if (!open) return;
      e.preventDefault(); e.stopImmediatePropagation();
      open.click();
    }, true);

    function loadList(cb) {
      if (listCache) { cb(listCache); return; }
      if (listLoading) { setTimeout(function () { loadList(cb); }, 200); return; }
      listLoading = true;
      // Absolute path: article addresses can be /article/Pxx, where a relative path breaks.
      fetch('/data/backgrounds.json', { cache: 'no-cache' }).then(function (r) {
        return r.ok ? r.json() : [];
      }).then(function (j) {
        listCache = Array.isArray(j) ? j : [];
        listLoading = false;
        cb(listCache);
      }).catch(function () {
        listCache = [];
        listLoading = false;
        cb(listCache);
      });
    }
    function resolveSrc(list) {
      var c = choice();
      if (c === 'none') return '';
      if (c === 'custom') return customSrc();
      if (c && c !== 'default') {
        for (var i = 0; i < list.length; i++) {
          if (list[i] && list[i].id === c) return list[i].src || '';
        }
      }
      var cov = coverSrc();
      if (cov) return cov;
      if (list.length && list[0]) return list[0].src || '';
      return '';
    }
    function layer() { return document.getElementById(BG_ID); }
    function ensureLayer() {
      var a = above(); if (!a) return null;
      var el = layer();
      if (!el) {
        el = document.createElement('div');
        el.id = BG_ID;
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = '<img alt=""><div class="luliy-article-bg-scrim"></div>';
        var img = el.querySelector('img');
        img.addEventListener('load', function () { img.style.opacity = '1'; });
        a.appendChild(el);
      }
      return el;
    }
    function removeLayer() { var el = layer(); if (el) el.remove(); }

    function apply() {
      syncReading();
      var t0 = toc();
      if (t0) iconify(t0);
      if (!isActive()) {
        removeLayer();
        document.body.classList.remove('luliy-article-bg-on');
        return;
      }
      loadList(function (list) {
        if (!isActive()) {
          removeLayer();
          document.body.classList.remove('luliy-article-bg-on');
          return;
        }
        var c = choice();
        if (c === 'custom' && !customSrc()) {
          removeKey(LS_CHOICE);
          c = choice();
        }
        var src = resolveSrc(list);
        var el = src ? ensureLayer() : layer();
        if (src && !el) return;
        var img = el && el.querySelector('img');
        if (src) {
          if (img.getAttribute('src') !== src) {
            img.style.opacity = '0';
            img.setAttribute('src', src);
          }
          el.style.setProperty('--luliy-bg-scrim', (scrimVal() / 100).toFixed(2));
          document.body.classList.add('luliy-article-bg-on');
        } else {
          // "无背景" (or nothing to show): take the artwork layer away entirely.
          removeLayer();
          document.body.classList.remove('luliy-article-bg-on');
        }
        syncSection(list);
      });
    }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

    /* (c) TOC header icons */
    function setIcon(btn, name) {
      if (btn.getAttribute('data-ico') === name) return;
      btn.innerHTML = svg(name);
      btn.setAttribute('data-ico', name);
      btn.classList.add('luliy-ico');
    }
    function iconify(t) {
      var i, list;
      list = t.querySelectorAll('[data-reader="settings"], .reader-color-toggle');
      for (i = 0; i < list.length; i++) setIcon(list[i], 'text');
      list = t.querySelectorAll('[data-reader="find"]');
      for (i = 0; i < list.length; i++) setIcon(list[i], 'find');
      list = t.querySelectorAll('.reader-toc-close');
      for (i = 0; i < list.length; i++) setIcon(list[i], 'close');
    }
    function closeAaPanels(t) {
      var o = t.querySelectorAll('.reader-options, .reader-color-panel'), i;
      for (i = 0; i < o.length; i++) o[i].hidden = true;
      var b = t.querySelectorAll('[data-reader="settings"], .reader-color-toggle');
      for (i = 0; i < b.length; i++) b[i].setAttribute('aria-expanded', 'false');
    }
    var kbd = false; // true when the last click on the toggle came from the keyboard (detail === 0)
    function setPanel(t, open) {
      var panel = t.querySelector('.luliy-bg-panel'), btn = t.querySelector('.luliy-bg-toggle');
      if (!panel || !btn) return;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        closeAaPanels(t);
        // Opened with the keyboard: move focus to the first choice so Tab/arrow keys continue inside the panel.
        if (kbd) { var first = panel.querySelector('button'); if (first) first.focus({ preventScroll: true }); }
      }
    }
    function handleFile(f) {
      if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        var im = new Image();
        im.onload = function () {
          var max = 1600, w = im.naturalWidth, h = im.naturalHeight;
          var sc = Math.min(1, max / Math.max(w, h));
          var cv = document.createElement('canvas');
          cv.width = Math.max(1, Math.round(w * sc));
          cv.height = Math.max(1, Math.round(h * sc));
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          var url = '';
          try { url = cv.toDataURL('image/jpeg', 0.82); } catch (err) {}
          if (!url) return;
          sessionCustom = url;
          customVolatile = !store(LS_CUSTOM, url); // too big for localStorage: valid for this visit only
          store(LS_CHOICE, 'custom');
          apply();
        };
        im.src = rd.result;
      };
      rd.readAsDataURL(f);
    }
    function ensureControls(t) {
      var hdr = t.querySelector(':scope > p');
      if (!hdr) return null;
      var btn = hdr.querySelector('.luliy-bg-toggle');
      var panel = t.querySelector('.luliy-bg-panel');
      if (btn && panel) return { btn: btn, panel: panel };
      if (btn) btn.remove();
      if (panel) panel.remove();
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'luliy-bg-toggle luliy-ico';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', '文章背景');
      btn.title = '文章背景';
      btn.innerHTML = svg('bg');
      var tools = hdr.querySelector('.reader-tools');
      if (tools) tools.appendChild(btn);
      else hdr.insertBefore(btn, hdr.querySelector('.reader-toc-close'));

      panel = document.createElement('div');
      panel.className = 'luliy-bg-panel';
      panel.hidden = true;
      panel.innerHTML = '<div class="luliy-bg-thumbs" role="group" aria-label="文章背景"></div>'
        + '<div class="luliy-bg-row"><span class="luliy-bg-dim" aria-hidden="true">' + svg('dim') + '</span>'
        + '<input type="range" min="15" max="100" step="1" aria-label="遮罩深浅" title="遮罩深浅">'
        + '<button type="button" class="luliy-bg-reset luliy-ico" aria-label="恢复默认" title="恢复默认">' + svg('reset') + '</button></div>'
        + '<input type="file" class="luliy-bg-file" accept="image/*" hidden>';
      var anchor = t.querySelector('.reader-tool-panels') || hdr;
      anchor.after(panel);

      btn.addEventListener('click', function (e) { kbd = e.detail === 0; setPanel(t, panel.hidden); kbd = false; });
      t.addEventListener('click', function (e) {
        if (e.target.closest('[data-reader="settings"], .reader-color-toggle')) setPanel(t, false);
        else if (e.target.closest('.reader-toc-close')) setPanel(t, false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !panel.hidden && t.isConnected) { var hadFocus = panel.contains(document.activeElement); setPanel(t, false); if (hadFocus) btn.focus(); }
      });
      var file = panel.querySelector('.luliy-bg-file');
      file.addEventListener('change', function (e) {
        var f = e.target.files && e.target.files[0];
        e.target.value = '';
        handleFile(f);
      });
      panel.querySelector('.luliy-bg-reset').addEventListener('click', function () {
        removeKey(LS_CHOICE);
        removeKey(LS_SCRIM);
        apply();
      });
      panel.querySelector('input[type=range]').addEventListener('input', function (e) {
        store(LS_SCRIM, String(e.target.value));
        var el = layer();
        if (el) el.style.setProperty('--luliy-bg-scrim', (e.target.value / 100).toFixed(2));
      });
      panel.querySelector('.luliy-bg-thumbs').addEventListener('click', function (e) {
        var b = e.target.closest('[data-bg]');
        if (!b) return;
        var id = b.getAttribute('data-bg');
        if (id === 'custom' && (!customSrc() || choice() === 'custom')) { file.click(); return; }
        store(LS_CHOICE, id);
        apply();
      });
      return { btn: btn, panel: panel };
    }
    function syncSection(list) {
      var t = toc(); if (!t) return;
      var ctl = ensureControls(t);
      if (!ctl) return;
      var cov = coverSrc(), custom = customSrc(), c = choice();
      var items = [];
      if (cov) items.push({ id: 'default', src: cov, name: '文章配图' });
      for (var i = 0; i < list.length; i++) {
        if (list[i] && list[i].id && list[i].src) items.push({ id: list[i].id, src: list[i].src, name: list[i].name || ('背景' + (i + 1)) });
      }
      items.push({ id: 'none', ico: 'none', name: '无背景' });
      items.push(custom ? { id: 'custom', src: custom, name: customVolatile ? '我的图片（仅本次访问有效，再点一次更换）' : '我的图片（再点一次更换）' }
                        : { id: 'custom', ico: 'plus', name: '上传我的图片' });
      // Which thumbnail is selected. Nothing stored = 'none' (无背景). An explicit 'default' pick means this
      // article's image; on an article without one the first artwork is shown, so that one is marked.
      var sel = c;
      if (c === 'default' && !cov) sel = items[0] && items[0].id !== 'none' ? items[0].id : 'none';
      if (c === 'custom' && !custom) sel = 'none';
      // The thumbnails are rebuilt only when the set of choices changes. A selection change just
      // flips aria-pressed: replacing the clicked button would detach it mid-click, and the TOC's
      // own "click outside closes the contents" handler would then close the whole panel.
      var html = '';
      for (var j = 0; j < items.length; j++) {
        var it = items[j];
        html += '<button type="button" data-bg="' + esc(it.id) + '" aria-pressed="false"'
          + ' aria-label="' + esc(it.name) + '" title="' + esc(it.name) + '"'
          + (it.id === 'custom' && customVolatile ? ' class="is-volatile"' : '') + '>'
          + (it.src ? '<img src="' + esc(it.src) + '" alt="" loading="lazy" decoding="async">' : svg(it.ico))
          + '</button>';
      }
      var box = ctl.panel.querySelector('.luliy-bg-thumbs');
      if (box.getAttribute('data-sig') !== html) {
        box.setAttribute('data-sig', html);
        box.innerHTML = html;
      }
      var cur = box.querySelectorAll('button');
      for (var k = 0; k < cur.length; k++) {
        var on = String(cur[k].getAttribute('data-bg') === sel);
        if (cur[k].getAttribute('aria-pressed') !== on) cur[k].setAttribute('aria-pressed', on);
      }
      var range = ctl.panel.querySelector('input[type=range]');
      if (document.activeElement !== range && range.value !== String(scrimVal())) range.value = String(scrimVal());
    }

    // Coalesce DOM changes inside #main into at most one apply() per frame.
    var pending = false;
    function schedule() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; apply(); });
    }
    var m0 = main();
    new MutationObserver(schedule).observe(m0 || document.documentElement, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () { syncReading(); schedule(); });
    if (DESKTOP.addEventListener) DESKTOP.addEventListener('change', schedule);
    else if (DESKTOP.addListener) DESKTOP.addListener(schedule);
    syncReading();
    apply();
  })();


  /* 25. Reading tab title (2026-10-30): on article pages (#/article/..., #/post/...) the browser tab
     shows only the article name. The router sets "<name> · Luliy Articles"; this strips the suffix
     whenever the title changes. Other pages keep their titles. The standalone pages in
     /articles/Pxx/ get the same title from site-publish/generate.py. */
  (() => {
    const SUFFIX = ' \u00b7 Luliy Articles';
    const fix = () => {
      if (!/^#\/(?:article|post)\//.test(location.hash || '')) return;
      const t = document.title;
      if (t.length > SUFFIX.length && t.endsWith(SUFFIX)) document.title = t.slice(0, -SUFFIX.length);
    };
    const el = document.querySelector('title');
    if (el) new MutationObserver(fix).observe(el, { childList: true, characterData: true, subtree: true });
    addEventListener('hashchange', fix);
    fix();
  })();

  /* 26. Accessibility + language follow-up (2026-10-30)
     a) one skip link only (the app also injects a button; the real <a href="#main"> stays);
     b) section-link buttons (⌁) are mouse/touch helpers, not Tab stops;
     c) the article body follows the site's own 繁體/简体 switch (window.LuliyInterfaceText) and
        every part of the page carries an accurate lang attribute. Code, <kbd> etc. stay untouched. */
  (() => {
    const root = document.documentElement;
    const SKIP = 'pre,code,kbd,samp,script,style,.reader-heading-link';
    const orig = new WeakMap();           // text node -> original text
    const HAN = /[㐀-鿿]/, KANA = /[぀-ヿ]/, LATIN = /[A-Za-z]/;
    let queued = false;

    const bodies = () => document.querySelectorAll('#sourceArticleBody:not([data-loading="true"]), #main .article-body');

    function guessLang(el) {
      const t = (el.textContent || '').slice(0, 6000);
      // Japanese only when kana is a real share of the text: a Chinese article that quotes a few Japanese words
      // (網站使用指南 has 「レコード」) used to count as Japanese and was never converted (2026-11-01).
      const kana = (t.match(/[぀-ヿ]/g) || []).length, han = (t.match(/[㐀-鿿]/g) || []).length;
      if (kana && kana >= Math.max(20, (kana + han) * 0.15)) return 'ja';
      if (HAN.test(t)) return 'zh';
      return LATIN.test(t) ? 'en' : '';
    }

    function syncBody(el) {
      const kind = guessLang(el);
      const trad = root.lang === 'zh-Hant';
      let lang = '';
      if (kind === 'zh') {
        // Only convert when the interface itself is Chinese; Japanese pages never come here.
        lang = trad ? 'zh-Hant' : 'zh-Hans';
        const conv = window.LuliyInterfaceText;
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
          acceptNode: n => n.parentElement && n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        });
        let n;
        while ((n = w.nextNode())) {
          const v = n.nodeValue;
          if (!HAN.test(v) && !orig.has(n)) continue;
          if (!orig.has(n)) orig.set(n, v);
          const o = orig.get(n);
          if (orig.get(n) !== undefined && n.__luliyOut === v) { /* ours, fall through to recompute */ }
          // Both directions (2026-11-01): LuliyInterfaceText converts to whichever script the site is in, so an article
          // written in 繁體 also turns into 简体 (it used to stay as written, e.g. 網站使用指南).
          const want = typeof conv === 'function' ? conv(o) : o;
          if (v !== want) { n.nodeValue = want; }
          n.__luliyOut = want;
        }
      } else if (kind) lang = kind;
      if (lang && el.getAttribute('lang') !== lang) el.setAttribute('lang', lang);
      if (!lang && el.hasAttribute('lang')) el.removeAttribute('lang');
    }

    function run() {
      queued = false;
      // (a) duplicate skip control
      document.querySelectorAll('.finish-skip').forEach(b => b.remove());
      // (b) heading link buttons: not tab stops
      document.querySelectorAll('.reader-heading-link:not([tabindex])').forEach(b => b.setAttribute('tabindex', '-1'));
      // (c) body language + script
      bodies().forEach(syncBody);
    }
    const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };

    const main = document.querySelector('#main') || document.body;
    new MutationObserver(schedule).observe(main, { childList: true, subtree: true });
    new MutationObserver(schedule).observe(root, { attributes: true, attributeFilter: ['lang'] });
    addEventListener('hashchange', schedule);
    // The skip button is injected by the app on load; remove it as soon as it appears.
    new MutationObserver(schedule).observe(document.body, { childList: true });
    run();
  })();

  /* 27. Loon, the site mascot (2026-10-30, reworked 2026-10-31): the gold leaf-hair figure from the Luliy logo animation.
     Full spec: README section 15.2 (and the project doc claude/loon-mascot-spec.md).
     Where: desktop only (>= 1180px, mouse); article reading pages, the 文章 / 短札 / 編年史 tabs and the works page
     (#/projects); only when the left margin is wide enough (reading 130-190px, lists 110-190px). She never pushes the page.
     She is drawn on a canvas from a 76-frame sheet (15 fps) and driven like a scrubber:
       - her dance (the whole clip) plays once per browsing session, on the first page she appears on; it is never
         interrupted - clicking her mid-dance only gets a "Let me dance!";
       - things she says on her own (greeting, the background hint) never turn her and never interrupt her;
       - background hint (2026-10-31): on a reading page, to someone who has never picked an article background, she says
         once per browsing session where the background button is, and lights up her button column; twice in all;
       - clicking her: she turns to you, her face fades in, she opens her eyes, answers, blinks while talking, then closes
         her eyes and turns back; a long press (0.6 s) gets a quote instead; clicking while she talks = next line;
       - contents button hovered / contents open: she faces you with her eyes closed; hovering her then opens them;
       - back-to-top hovered: she turns to the far pose.
     Reduced motion / Save-Data: no sheet is fetched; still poses cross-fade, no dance, no blinking.
     Her button column also carries the article's contents + back-to-top buttons (the article's own two floating
     buttons are hidden by CSS while she is on screen). Collapsed, she is a small "Loon" tab on the left edge.
     Revert = delete this block and its CSS (27, 27b, 27c). */
  (() => {
    const root = document.documentElement;
    const BASE = '/assets/mascot/';
    const REST = BASE + 'luliy-rest.webp?v=2', FRONT = BASE + 'luliy-front.webp', TURN = BASE + 'luliy-turn.webp', ATLAS = BASE + 'luliy-atlas-v2.webp';
    // Her talking face (2026-10-31): brows, nose, mouth and eyes in three states (closed / half / open). Only the face
    // area, drawn to sit exactly on frame F_FRONT (= luliy-front.webp). After she has turned to you the features fade in
    // with her eyes closed, then she opens them (closed -> half -> open); she blinks now and then while talking.
    const FACE = { c: BASE + 'luliy-face-closed-66dd0eb793.webp', h: BASE + 'luliy-face-half-7d622c4b81.webp', o: BASE + 'luliy-face-open-36fa744b9f.webp' }; // eyes closed / half / open
    const FW = 320, FH = 262, COLS = 10, NF = 76, FPS = 15, F_FRONT = 22, F_TURN = 45; // v2: 76 frames, the last 5 move her back to rest
    const KEY = 'luliy-mascot-hidden';
    const WIDE = matchMedia('(min-width: 1180px) and (pointer: fine)');
    const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches || root.classList.contains('luliy-save-data');
    const T = s => (typeof window.LuliyInterfaceText === 'function' ? window.LuliyInterfaceText(s) : s);
    const read = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
    const write = v => { try { v ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch (e) {} };
    const reading = () => /^#\/(?:article|post)\//.test(location.hash || '');
    // The journal (短札) tab also gets her; there she has no contents button (nothing to list), only ↑ and hide.
    const journal = () => /^#\/posts\?(?:[^#]*&)?view=journal(?:&|$)/.test(location.hash || '');
    // 文章 / 短札 / 編年史 tabs and the works page.
    const listPage = () => /^#\/(?:posts|projects)(?:[/?]|$)/.test(location.hash || '');
    const ss = { get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: k => { try { sessionStorage.setItem(k, '1'); } catch (e) {} } };

    const box = document.createElement('div');
    box.className = 'luliy-mascot';
    box.hidden = true;
    box.innerHTML =
      '<div class="luliy-mascot-bubble" role="status" aria-live="polite"></div>' +
      '<div class="luliy-mascot-tools">' +
        '<button type="button" data-m="back" aria-label="返回" title="返回"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>' +
        '<button type="button" data-m="toc" aria-label="文章目录" aria-expanded="false" title="目录"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg></button>' +
        '<button type="button" data-m="top" aria-label="回到顶部" title="回到顶部"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>' +
        '<button type="button" data-m="hide" aria-label="收起 Loon" title="收起"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
      '</div>' +
      '<div class="luliy-mascot-stage" role="button" tabindex="0" aria-label="Loon：点一下和她说话，长按听她说一句话">' +
        '<img class="luliy-mascot-rest" src="' + REST + '" alt="" decoding="async" width="' + FW + '" height="' + FH + '">' +
        '<canvas class="luliy-mascot-canvas" width="' + FW + '" height="' + FH + '" aria-hidden="true"></canvas>' +
        ['c', 'h', 'o'].map(k => '<img class="luliy-mascot-face" data-f="' + k + '" src="' + FACE[k] + '" alt="" decoding="async" aria-hidden="true">').join('') +
      '</div>';
    /* Collapsed (2026-10-31): a small tab on the left edge; normally only her resting pose, which reads as an "L".
       Hover / keyboard focus opens a hub: the hand-drawn gold "oon" is written behind her ("Loon") and a faint arc of four
       doors appears above her: 书房 / 作品 / 文章 / 唱片. She never moves. Pointing at a door erases what is behind her
       and writes the English word instead (Library / Lineup / Literature / LP: her "L" is the first letter of all four).
       The doors are real links (#/books, #/projects, #/posts, #/music). Clicking her still summons her.
       Geometry: her centre sits at GEO.cx / GEO.cy from the hub's bottom-left corner (see home-fixes.css 27d);
       the words are hand-drawn images (assets/mascot/luliy-w-*.webp), fetched only once the tab is first shown. */
    const peek = document.createElement('button');
    peek.type = 'button';
    peek.className = 'luliy-mascot-peek';
    peek.innerHTML = '<img class="lm-fig" src="' + REST + '" alt="" aria-hidden="true" decoding="async"><span class="lm-w" aria-hidden="true"></span>';
    peek.setAttribute('aria-label', '召唤 Loon');
    const GEO = { cx: 30, cy: 23, R: 118, r: 96, H: 34 };
    const LOON = { k: 'loon', img: 'luliy-w-loon-c23fa1905b.webp', w: 54.5 };
    const DOORS = [
      { k: 'library', href: '#/books', a: -90, zh: '书房', en: 'Library', ja: '書斎', img: 'luliy-w-library-f46ea56a07.webp', w: 75 },
      { k: 'lineup', href: '#/projects', a: -67, zh: '作品', en: 'Lineup', ja: '作品', img: 'luliy-w-lineup-f3828f53d5.webp', w: 67.3 },
      { k: 'literature', href: '#/posts', a: -44, zh: '文章', en: 'Literature', ja: '記事', img: 'luliy-w-literature-8563077ddb.webp', w: 100.5 },
      { k: 'lp', href: '#/music', a: -21, zh: '唱片', en: 'LP', ja: 'レコード', img: 'luliy-w-lp-e15fde3d3e.webp', w: 20.8 }
    ];
    const hub = document.createElement('div');
    hub.className = 'luliy-mascot-hub';
    hub.hidden = true;
    {
      const rad = d => d * Math.PI / 180, pt = (r, a) => (GEO.cx + r * Math.cos(rad(a))).toFixed(1) + ' ' + (-GEO.cy + r * Math.sin(rad(a))).toFixed(1);
      hub.innerHTML = '<span class="lm-zone"></span>' +
        '<svg class="lm-arc" viewBox="0 -200 200 200" aria-hidden="true" focusable="false"><path pathLength="1" d="M ' + pt(GEO.r, -100) + ' A ' + GEO.r + ' ' + GEO.r + ' 0 0 1 ' + pt(GEO.r, -27) + '"/></svg>';
      hub.appendChild(peek);
      DOORS.forEach(d => {
        const a = document.createElement('a');
        a.className = 'lm-it'; a.href = d.href; a.dataset.k = d.k;
        a.style.left = (GEO.cx + GEO.R * Math.cos(rad(d.a))).toFixed(1) + 'px';
        a.style.bottom = (GEO.cy - GEO.R * Math.sin(rad(d.a))).toFixed(1) + 'px';
        d.el = a; hub.appendChild(a);
      });
    }
    const hubW = peek.querySelector('.lm-w');
    let hubImgs = null, hubCur = null, hubCloseT = 0, canHost = false;
    const hubLoad = () => {
      if (hubImgs) return;
      hubImgs = {};
      [LOON].concat(DOORS).forEach(d => {
        const im = new Image(); im.className = 'lm-wd'; im.alt = ''; im.decoding = 'async'; im.referrerPolicy = 'no-referrer'; im.draggable = false;
        im.width = d.w; im.height = GEO.H; im.style.width = d.w + 'px'; im.style.height = GEO.H + 'px';
        im.src = BASE + d.img; hubImgs[d.k] = im; hubW.appendChild(im);
      });
    };
    const hubLabels = () => {
      const hant = root.lang === 'zh-Hant', en = /^en/.test(root.lang), ja = /^ja/.test(root.lang);
      DOORS.forEach(d => { d.el.textContent = en ? d.en : ja ? d.ja : hant ? T(d.zh) : d.zh; });
    };
    const hubShow = key => {
      if (hubCur === key) return;
      hubCur = key;
      const d = key === 'loon' ? LOON : DOORS.find(x => x.k === key);
      for (const k in hubImgs || {}) hubImgs[k].classList.toggle('on', k === key);
      DOORS.forEach(x => x.el.classList.toggle('on', x.k === key));
      hubW.style.width = d ? d.w + 'px' : '0px';
    };
    const hubOpen = () => {
      clearTimeout(hubCloseT);
      if (!hub.classList.contains('lm-open')) { hubLoad(); hubLabels(); hub.classList.add('lm-open'); }
      hubShow('loon');
    };
    const hubClose = () => { clearTimeout(hubCloseT); hub.classList.remove('lm-open'); hubShow(null); };
    peek.addEventListener('pointerenter', hubOpen);
    peek.addEventListener('focus', () => { if (peek.matches(':focus-visible')) hubOpen(); });
    hub.addEventListener('pointerenter', () => clearTimeout(hubCloseT));
    hub.addEventListener('pointerleave', () => { clearTimeout(hubCloseT); hubCloseT = setTimeout(hubClose, 300); });
    hub.addEventListener('focusout', e => { if (!hub.contains(e.relatedTarget)) hubClose(); });
    DOORS.forEach(d => {
      d.el.addEventListener('pointerenter', () => hubShow(d.k));
      d.el.addEventListener('focus', () => hubShow(d.k));
      d.el.addEventListener('click', hubClose);
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || !hub.classList.contains('lm-open')) return;
      hubClose(); if (hub.contains(document.activeElement)) document.activeElement.blur();
    });
    const stage = box.querySelector('.luliy-mascot-stage'), bubble = box.querySelector('.luliy-mascot-bubble');
    // Gold particles around her (LuliyParticles, home-early.js), shown only while she moves or talks (2026-10-30).
    if (window.LuliyParticles) {
      const pf = window.LuliyParticles('.luliy-mascot', 300, 250, 18, root.dataset.theme === 'light', 5);
      const ps = document.createElement('style'); ps.textContent = pf.css; document.head.appendChild(ps);
      stage.insertAdjacentHTML('afterbegin', pf.html);
    }
    let mvT = 0;
    function moving(on) {
      clearTimeout(mvT);
      if (on) { box.classList.add('lm-moving'); return; }
      mvT = setTimeout(() => { if (!raf && !bubble.classList.contains('show')) box.classList.remove('lm-moving'); }, 700);
    }
    const canvas = box.querySelector('canvas'), ctx = canvas.getContext('2d');
    const tocBtn = box.querySelector('[data-m="toc"]'), topBtn = box.querySelector('[data-m="top"]');

    /* ---------- the scrubber ---------- */
    let atlas = null, loading = false, pos = 0, target = 0, spd = 1, mode = 'idle', raf = 0, lastT = 0, fade = 0, drawn = -1;
    let hoverToc = false, hoverTop = false, tocOpen = false, stillsReady = false;
    let speakHold = false, talking = false, eyesUp = false, flowT = 0, blinkT = 0, eyeT = [];
    let hoverMe = false, gazing = false, closingFace = false, hintT = 0, wantDance = false, dancedMem = false; // click-to-talk: turn to you, open eyes, then speak

    function draw(i) {
      i = Math.max(0, Math.min(NF - 1, Math.round(i)));
      if (i === drawn || !atlas) return;
      drawn = i;
      ctx.clearRect(0, 0, FW, FH);
      ctx.drawImage(atlas, (i % COLS) * FW, ((i / COLS) | 0) * FH, FW, FH, 0, 0, FW, FH);
    }
    function loadAtlas() {
      if (atlas || loading || still()) return;
      loading = true;
      const im = new Image();
      im.decoding = 'async'; im.referrerPolicy = 'no-referrer';
      im.onload = () => {
        (im.decode ? im.decode() : Promise.resolve()).catch(() => {}).then(() => {
          atlas = im; drawn = -1; draw(pos);
          requestAnimationFrame(() => box.classList.add('has-canvas')); // hide the still only after the canvas shows the same frame
          retarget();
          if (wantDance) { wantDance = false; playIntro(); }
        });
      };
      im.onerror = () => { loading = false; };
      im.src = ATLAS;
    }
    function kick() { if (!raf && atlas) { moving(true); lastT = performance.now(); raf = requestAnimationFrame(tick); } }
    // The clip does not end on the resting pose and is still moving in its last frames. Instead of stopping on the
    // last frame and then dissolving (which read as a hitch), the opening clip slows down over its final frames
    // and, from BLEND_FROM on, fades into the resting frame while it is still moving: one continuous settle.
    // v2 (2026-10-30): the atlas now ends with 5 interpolated frames that move her back to the resting pose (plus one
    // in-between at the old jump after frame 58), so the clip loops by motion; BLEND_FROM now only marks those last
    // frames, where a hover waits for her to finish settling. blend() is kept but no longer called.
    const BLEND_FROM = NF - 6;
    const smooth = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
    function blend(p) {
      const k = smooth((p - BLEND_FROM) / (NF - 1 - BLEND_FROM)), i = Math.max(0, Math.min(NF - 1, Math.round(p)));
      ctx.clearRect(0, 0, FW, FH);
      if (k < 1) { ctx.globalAlpha = 1 - k; ctx.drawImage(atlas, (i % COLS) * FW, ((i / COLS) | 0) * FH, FW, FH, 0, 0, FW, FH); }
      ctx.globalAlpha = k; ctx.drawImage(atlas, 0, 0, FW, FH, 0, 0, FW, FH);
      ctx.globalAlpha = 1; drawn = -1;
    }
    function tick(now) {
      raf = 0;
      const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
      const dist = target - pos;
      if (Math.abs(dist) > 1e-3) {
        let v = FPS * spd;
        if (mode === 'hover') v *= Math.max(.35, Math.min(1, Math.abs(dist) / 4)); // ease into the held frame
        if (mode === 'intro') v *= Math.max(.45, Math.min(1, Math.abs(dist) / 12)); // ease out of the clip
        pos += Math.sign(dist) * Math.min(Math.abs(dist), v * dt);
        draw(pos); // v2 atlas: the clip itself moves back to rest (interpolated frames), no dissolve needed
      }
      if (Math.abs(target - pos) <= 1e-3) {
        if (mode === 'intro') { pos = 0; target = 0; mode = 'idle'; drawn = -1; draw(0); retarget(); if (!raf) moving(false); return; }
        pos = target; draw(pos);
        if (pos === F_FRONT && hoverMe && tocOpen && !talking && !eyesUp) gaze(true);
        if (pos === 0) mode = 'idle';
        moving(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    function wanted() { return speakHold ? F_FRONT : hoverTop ? F_TURN : (hoverToc || tocOpen) ? F_FRONT : 0; }
    function ensureStills() {
      if (stillsReady) return;
      stillsReady = true;
      [['front', FRONT], ['turn', TURN]].forEach(([name, src]) => {
        const im = new Image();
        im.className = 'luliy-mascot-pose'; im.dataset.pose = name; im.alt = ''; im.decoding = 'async'; im.referrerPolicy = 'no-referrer'; im.src = src;
        stage.appendChild(im);
      });
    }
    function retarget() {
      if (box.hidden) return;
      const f = wanted();
      // The face only fits frame F_FRONT: close her eyes before she turns away.
      if (box.dataset.face && f !== F_FRONT && !talking) {
        if (!closingFace) { closingFace = true; gazing = false; closeEyes(() => { closingFace = false; retarget(); }); }
        return;
      }
      if (still()) { ensureStills(); stage.dataset.pose = f === F_FRONT ? 'front' : f === F_TURN ? 'turn' : 'rest'; return; }
      if (!atlas) { if (f) loadAtlas(); return; }
      if (mode === 'intro') return;                      // she finishes her dance; its end calls retarget()
      if (f === target && mode !== 'idle') return;
      mode = 'hover'; target = f; spd = f >= pos ? 1.7 : 2.0;
      kick();
    }
    function playIntro() {
      if (box.hidden || still()) return;
      if (!atlas) { loadAtlas(); return; }
      if (mode !== 'idle' || pos !== 0 || wanted() !== 0) return;
      mode = 'intro'; target = NF - 1; spd = 1;
      kick();
    }
    function reset() {
      cancelAnimationFrame(raf); raf = 0; pos = 0; target = 0; mode = 'idle'; hoverToc = hoverTop = false;
      clearTimeout(flowT); clearTimeout(hintT); box.classList.remove('lm-hint'); talking = speakHold = false; clearEye(); setFace('');
      hoverMe = gazing = closingFace = wantDance = false;
      if (atlas) { drawn = -1; draw(0); }
      stage.dataset.pose = 'rest';
    }
    // The sheet is fetched when she first appears (after the page is idle); it is never fetched in still mode.
    function warm() { (window.requestIdleCallback || (f => setTimeout(f, 1200)))(() => loadAtlas()); }

    /* ---------- words ---------- */
    const journalLines = [
      '随手记一笔也好。',
      '短短几句，也是今天的痕迹。',
      '右边那些小方格，亮着的就是你写过的日子。',
      '不用写得很完整，先记下来。',
      '今天也有在进步吗？哪怕一点点也好。'
    ];
    const readingLines = [
      '慢慢读，不着急。',
      '若不知走哪，请注重脚下。',
      '点我旁边的目录按钮，可以换背景、调字体。',
      '读累了就休息一下，眼睛也需要留白。',
      '喜欢哪一节，可以点标题旁的链接分享。',
      '今天也有在进步吗？哪怕一点点也好。'
    ];
    let timer = 0, li = -1, lines = readingLines;
    // One sentence per line; a long sentence breaks at its comma; a tail of 1-3 characters joins the line above.
    // Each line wraps with text-wrap: balance (home-fixes.css 27c), so no line ends with a lone character.
    function lines4(text) {
      const out = [];
      (text.match(/[^。！？；!?;]+[。！？；!?;]*/g) || [text]).forEach(p => {
        if (p.length > 15 && /[，,]/.test(p)) out.push(...p.match(/[^，,]+[，,]?/g)); else out.push(p);
      });
      const merged = [];
      out.forEach(p => { if (merged.length && p.replace(/[，。！？；、,.!?;\s]/g, '').length <= 3) merged[merged.length - 1] += p; else merged.push(p); });
      return merged;
    }
    const escH = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    function say(text, ms) {
      const ls = Array.isArray(text) ? text.map(T) : lines4(T(text));
      bubble.innerHTML = ls.map(l => '<span class="lm-l">' + escH(l) + '</span>').join('');
      bubble.classList.add('show'); moving(true);
      clearTimeout(timer);
      timer = setTimeout(() => { bubble.classList.remove('show'); moving(false); }, ms || 4200);
    }
    // Long press: one of these, no attribution. Written as lines so they break where the sense breaks.
    const QUOTES = [
      ['世界上只有一种英雄主义，', '就是在认清生活的真相之后', '依然热爱生活。'],
      ['已有的事，后必再有；', '已行的事，后必再行。']
    ];
    let qi = -1;
    // 文章 list, 編年史 and the works page have their own lines (2026-10-31).
    const postsLines = [
      '挑一篇，慢慢读。',
      '不知道读哪篇？从最近的开始吧。',
      '每一篇，都是走过的一段路。',
      '若不知走哪，请注重脚下。'
    ];
    const chronicleLines = [
      '这里记着读过的书、看过的影片。',
      '换个年份看看，那时在想什么？',
      '一年一年翻过去，就是成长的样子。'
    ];
    const worksLines = [
      '这些都是亲手做出来的。',
      '点开一个，看看它能做什么。',
      '每个作品，都是一次尝试。',
      '今天也有在进步吗？哪怕一点点也好。'
    ];
    const chronicle = () => /^#\/posts\?(?:[^#]*&)?view=chronicle(?:&|$)/.test(location.hash || '');
    const works = () => /^#\/projects(?:[/?]|$)/.test(location.hash || '');
    function nextLine() { const own = reading() && typeof window.LuliyLoonLines === 'function' ? window.LuliyLoonLines() : null; lines = own && own.length ? own : journal() ? journalLines : reading() ? (root.classList.contains('lk-weekly') ? readingLines.filter(t => !/背景/.test(t)) : readingLines) : chronicle() ? chronicleLines : works() ? worksLines : postsLines; li = (li + 1 + Math.floor(Math.random() * (lines.length - 1))) % lines.length; return lines[li]; }
    function nextQuote() { qi = (qi + 1) % QUOTES.length; return QUOTES[qi]; }
    const readTime = text => Math.max(3400, (Array.isArray(text) ? text.join('') : text).length * 240 + 1800); // long lines stay up longer
    function setFace(st) { if (st) box.dataset.face = st; else delete box.dataset.face; }
    function clearEye() { eyeT.forEach(clearTimeout); eyeT = []; clearTimeout(blinkT); }
    function seq(steps) { let t = 0; steps.forEach(([d, st]) => { t += d; eyeT.push(setTimeout(() => setFace(st), t)); }); return t; }
    // Features fade in with eyes closed, then the lids lift: closed -> half -> open.
    function openEyes(done) {
      clearEye();
      if (still()) { setFace('o'); eyeT.push(setTimeout(() => { eyesUp = true; done(); }, 260)); return; }
      const t = seq([[0, 'c'], [230, 'h'], [80, 'o']]);
      eyeT.push(setTimeout(() => { eyesUp = true; blinkLoop(); done(); }, t + 140));
    }
    function closeEyes(done) {
      clearEye(); eyesUp = false;
      if (still()) { setFace(''); eyeT.push(setTimeout(done, 260)); return; }
      const t = seq([[0, 'h'], [80, 'c'], [160, '']]);
      eyeT.push(setTimeout(done, t + 240));
    }
    // A natural blink every 2.6–4.8 s while she is looking at you.
    function blinkLoop() {
      blinkT = setTimeout(() => {
        if (!eyesUp) return;
        seq([[0, 'h'], [50, 'c'], [80, 'h'], [50, 'o']]);
        blinkLoop();
      }, 2600 + Math.random() * 2200);
    }
    const atFront = () => still() || (!!atlas && mode !== 'intro' && Math.abs(pos - F_FRONT) < 1e-3);
    // Only when you click / long-press her: she turns to face you, opens her eyes, then answers; when the bubble
    // goes she closes her eyes and turns back. Things she says on her own (greeting, tips) never turn her.
    function respond(text) {
      if (box.hidden) return;
      if (mode === 'intro') { say('Let me dance!', 2200); return; }   // she does not stop dancing for you
      if (eyesUp) { clearTimeout(flowT); talking = speakHold = true; gazing = false; answer(text); return; } // already looking at you: answer at once
      clearTimeout(flowT); talking = true; speakHold = true;
      if (!still() && !atlas) loadAtlas();
      retarget();
      const wait = () => {
        if (!talking) return;
        if (atFront()) { flowT = setTimeout(() => openEyes(() => answer(text)), still() ? 300 : 120); }
        else flowT = setTimeout(wait, 50);
      };
      wait();
    }
    function answer(text) {
      const ms = readTime(text);
      say(text, ms);
      clearTimeout(flowT);
      flowT = setTimeout(() => {
        if (hoverMe && tocOpen) { talking = speakHold = false; gazing = true; return; } // still looking at you
        closeEyes(() => { talking = speakHold = false; retarget(); });
      }, ms);
    }
    // Article styles (section 37) may answer a click with their own words: window.LuliyLoonClick() returns a line or null.
    function talk() { const own = typeof window.LuliyLoonClick === 'function' ? window.LuliyLoonClick() : null; respond(own || nextLine()); }
    // Contents open and she already faces you: hovering her opens her eyes (no words); leaving closes them.
    function gaze(on) {
      if (on) { if (talking || eyesUp || mode === 'intro' || !atFront()) return; gazing = true; openEyes(() => {}); return; }
      if (!gazing) return;
      gazing = false;
      if (!talking) closeEyes(() => retarget());
    }
    // Things she says on her own never cut into an answer.
    function sayAuto(text, ms) { if (!talking) say(text, ms); }
    // For section 37: say something on her own (never over an answer, never while she dances, only when she is out).
    window.LuliyLoonSay = (text, ms) => { if (!box.hidden && mode !== 'intro') { sayAuto(text, ms || readTime(text)); return true; } return false; };
    // Background hint: reading pages only, for someone who has never picked a background (luliy-article-bg-choice,
    // section 24); once per browsing session, twice in all (localStorage luliy-loon-bg-hint). About 6 s after she
    // appears; waits while she talks or dances (gives up after ~20 s). Her button column lights up meanwhile.
    const HINT = ['想换个背景的话，', '点目录里的图片按钮。'];
    function bgHint() {
      clearTimeout(hintT);
      let n = 0;
      try { if (localStorage.getItem('luliy-article-bg-choice')) return; n = +localStorage.getItem('luliy-loon-bg-hint') || 0; } catch (e) { return; }
      if (n >= 2 || ss.get('luliy-loon-bg-hinted')) return;
      let tries = 0;
      const tryNow = () => {
        if (box.hidden || !reading() || !document.querySelector('#main .luliy-bg-toggle') || root.classList.contains('lk-weekly')) return;
        if (talking || mode === 'intro' || bubble.classList.contains('show')) { if (++tries < 10) hintT = setTimeout(tryNow, 1500); return; }
        ss.set('luliy-loon-bg-hinted');
        try { localStorage.setItem('luliy-loon-bg-hint', String(n + 1)); } catch (e) {}
        box.classList.add('lm-hint');
        say(HINT, 5600);
        hintT = setTimeout(() => box.classList.remove('lm-hint'), 5600);
      };
      hintT = setTimeout(tryNow, 6000);
    }
    // The dance plays once per browsing session.
    const DANCED = 'luliy-loon-danced';
    function dance() {
      if (still() || dancedMem || ss.get(DANCED)) return;
      dancedMem = true; ss.set(DANCED);
      if (atlas) playIntro(); else { wantDance = true; loadAtlas(); }
    }
    function greet() {
      if (journal()) { sayAuto('今天有什么想记下来的吗？'); return; }
      const h = new Date().getHours();
      sayAuto(h < 6 ? '这么晚还在读，记得早点休息。' : h < 11 ? '早安，今天读点什么？' : h < 14 ? '午安，读完记得歇一会儿。' : h < 18 ? '下午好，配一杯茶刚好。' : '晚上好，适合安静地读点东西。');
    }

    /* Lean gently toward the cursor. */
    addEventListener('pointermove', e => {
      if (box.hidden || still()) return;
      const r = stage.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 700));
      const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 700));
      stage.style.transform = 'rotateY(' + (dx * 9).toFixed(2) + 'deg) rotateX(' + (-dy * 5).toFixed(2) + 'deg)';
    }, { passive: true });

    // Click: an everyday line. Long press (0.6 s): a quote. Keyboard: Enter / Space, Shift+Enter for a quote.
    let pressT = 0, longFired = false;
    const endPress = () => { clearTimeout(pressT); box.classList.remove('lm-press'); };
    stage.addEventListener('pointerenter', e => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      hoverMe = true;
      if (tocOpen) gaze(true);   // contents open: she opens her eyes; otherwise hovering her does nothing
    });
    stage.addEventListener('pointerleave', () => { hoverMe = false; gaze(false); });
    stage.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      longFired = false; box.classList.add('lm-press'); clearTimeout(pressT);
      pressT = setTimeout(() => { longFired = true; box.classList.remove('lm-press'); respond(nextQuote()); }, 600);
    });
    stage.addEventListener('pointerup', endPress);
    stage.addEventListener('pointerleave', endPress);
    stage.addEventListener('pointercancel', endPress);
    stage.addEventListener('contextmenu', e => { if (longFired) e.preventDefault(); });
    // stopPropagation: the article closes its contents on any click outside them; talking to her should not.
    stage.addEventListener('click', e => { e.stopPropagation(); if (longFired) { longFired = false; return; } talk(); });
    stage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); respond(e.shiftKey ? nextQuote() : nextLine()); } });

    /* ---------- contents + back-to-top ----------
       The contents button drives the article's real toggle, so its panel, scroll-spy and Esc/close behaviour stay
       exactly as they were. */
    const realToggle = () => document.querySelector('#main .reader-toc-toggle');
    function reflect() {
      const t = realToggle();
      if (root.classList.contains('lk-weekly')) { // weekly (2026-11-02): her contents button opens the contents card in her bubble (block 36 f)
        const open = !!document.querySelector('.luliy-mascot .lk-card.open');
        tocBtn.hidden = true; // no separate contents button on weekly pages: the ribbon (or her speech bubble) opens the contents
        if (tocOpen) { tocOpen = false; root.classList.remove('luliy-toc-open'); retarget(); }
        return;
      }
      tocBtn.hidden = !t || t.hidden;
      const was = tocOpen;
      tocOpen = !!t && t.getAttribute('aria-expanded') === 'true';
      tocBtn.setAttribute('aria-expanded', String(tocOpen));
      tocBtn.classList.toggle('is-active', tocOpen);
      root.classList.toggle('luliy-toc-open', tocOpen && !box.hidden);
      if (was !== tocOpen) retarget();
    }
    /* A small count beside the panel title, e.g. "6 节". */
    function decoratePanel() {
      const title = document.querySelector('#readerToc > p > span:first-child');
      if (!title) return;
      // count the sections at the top level only (the lowest heading number present), not every sub-heading
      const items = [...document.querySelectorAll('#readerToc .reader-toc-item')];
      const lv = it => +((/level-h(\d)/.exec(it.className) || [])[1] || 9);
      const top = items.length ? Math.min(...items.map(lv)) : 0;
      const n = items.filter(it => lv(it) === top).length;
      let chip = title.querySelector('.luliy-toc-count');
      if (!chip) { chip = document.createElement('span'); chip.className = 'luliy-toc-count'; title.appendChild(chip); }
      const txt = !n ? '' : /^zh/.test(root.lang) ? T(n + ' 节') : String(n);
      if (chip.textContent !== txt) chip.textContent = txt;
    }
    tocBtn.addEventListener('click', e => {
      e.stopPropagation(); // the article closes its contents on any click outside the panel and its own button
      if (root.classList.contains('lk-weekly') && window.LuliyWeeklyCard) { window.LuliyWeeklyCard.toggle(); requestAnimationFrame(reflect); return; }
      const t = realToggle();
      if (t) t.click();
      requestAnimationFrame(reflect);
    });
    // Back: one step back in the site's own history; if she was opened straight onto this page, go to the home page instead.
    let inSite = 0;
    addEventListener('hashchange', () => { inSite++; });
    box.querySelector('[data-m="back"]').addEventListener('click', () => {
      if (inSite > 0) { inSite--; history.back(); } else location.hash = '#/';
    });
    topBtn.addEventListener('click', () => { scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' }); });
    // Hover or keyboard focus on a button sets her pose (mouse-click focus does not count).
    function bindPose(btn, set) {
      btn.addEventListener('pointerenter', () => { set(true); retarget(); });
      btn.addEventListener('pointerleave', () => { set(false); retarget(); });
      btn.addEventListener('focus', () => { if (btn.matches(':focus-visible')) { set(true); retarget(); } });
      btn.addEventListener('blur', () => { set(false); retarget(); });
    }
    bindPose(tocBtn, v => { hoverToc = v; });
    bindPose(topBtn, v => { hoverTop = v; });
    // The article's close button and Esc return focus to its own (now hidden) toggle; hand it to ours instead.
    const refocus = () => requestAnimationFrame(() => {
      const was = tocOpen; reflect();
      if (was && !tocOpen && !box.hidden && (document.activeElement === document.body || !document.activeElement)) tocBtn.focus({ preventScroll: true });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && tocOpen) refocus(); });
    document.addEventListener('click', e => { if (e.target.closest && e.target.closest('.reader-toc-close')) refocus(); else requestAnimationFrame(reflect); }, true);

    box.querySelector('[data-m="hide"]').addEventListener('click', () => { write(true); sync(); peek.focus(); });
    peek.addEventListener('click', () => { if (!canHost) return; write(false); sync(); setTimeout(() => { if (atlas) playIntro(); else { wantDance = true; loadAtlas(); } }, 350); });

    /* Show only where there is room: a wide screen and a left margin beside the content. She shrinks to fit the margin
       (190px down to 130px on reading pages, 110px on the lists and works page) and never pushes the page aside. */
    function room() {
      const a = reading() ? document.querySelector('#sourceArticleBody, #main .article-body') : listPage() ? document.querySelector('#main > .shell.subpage') : null;
      if (!a) return 0;
      const w = Math.min(190, Math.floor(a.getBoundingClientRect().left - 40)); // 14px edge + her tool buttons + a little air
      return w >= (reading() ? 130 : 110) ? w : 0;
    }
    let lastHash = '', greeted = false, frame = 0, frameT = 0;
    function sync() {
      cancelAnimationFrame(frame); clearTimeout(frameT); frame = 0;
      const fit = (reading() || listPage()) && WIDE.matches ? room() : 0, on = fit > 0;
      if (on) root.style.setProperty('--lm-w', fit + 'px'); else root.style.removeProperty('--lm-w');
      const hidden = read();
      const wasHidden = box.hidden;
      box.hidden = !on || hidden;
      // The tab is on every page of the site (2026-10-31): wherever she is not on screen, on a wide screen with a mouse, it
      // is there as the way to 书房 / 作品 / 文章 / 唱片. Where she can live (and was collapsed) clicking it also summons her;
      // on the other pages (home, about, study, records ...) it is navigation only.
      canHost = on;
      root.classList.toggle('lm-hub-up', /^#\/books(?:[/?]|$)/.test(location.hash || '')); // the study room has its own 书房 button in this corner
      hub.hidden = !WIDE.matches || !box.hidden;
      peek.setAttribute('aria-label', on ? '召唤 Loon' : 'Loon');
      const here = (location.hash || '#/').split('?')[0].split('/')[1] || '';
      DOORS.forEach(d => { if (d.href.split('/')[1] === here) d.el.setAttribute('aria-current', 'page'); else d.el.removeAttribute('aria-current'); });
      if (hub.hidden) hubClose(); else if (!hubImgs) setTimeout(hubLoad, 1500);
      root.classList.toggle('luliy-mascot-on', !box.hidden); // CSS hides the article's own floating buttons while she carries them
      if (box.hidden) { bubble.classList.remove('show'); root.classList.remove('luliy-toc-open'); if (!wasHidden) reset(); return; }
      if (wasHidden) warm();
      reflect();
      decoratePanel();
      const key = journal() ? '#posts-journal' : location.hash; // tag filters inside the journal do not replay her opening
      if (key !== lastHash) {
        lastHash = key;
        setTimeout(() => { dance(); if (!greeted && !ss.get('luliy-loon-greeted')) { greeted = true; ss.set('luliy-loon-greeted'); greet(); } }, 900);
        if (reading()) bgHint();
      }
    }
    // rAF can be starved for seconds while a heavy page (3D study / records) is loading: a timer backs it up.
    const schedule = () => { if (!frame) { frame = requestAnimationFrame(sync); frameT = setTimeout(sync, 300); } };

    function mount() {
      document.body.append(box, hub);
      addEventListener('hashchange', schedule);
      addEventListener('resize', schedule, { passive: true });
      if (WIDE.addEventListener) WIDE.addEventListener('change', schedule);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
      const main = document.querySelector('#main');
      if (main) new MutationObserver(schedule).observe(main, { childList: true, subtree: true });
      schedule();
    }
    if (document.readyState === 'complete') mount();
    else addEventListener('load', mount, { once: true });
  })();

  /* 32. Journal / 短札 (2026-10-30): a third tab on the article page (文章 · 短札 · 編年史) that shows the Gmeek
     Issues labelled `journal` as a quiet single-column timeline, X-style: avatar, time, text, images, no title.
     The entries come from window.LuliyJournal (home-early.js splits them out of the article feed, which is why
     文章 never lists them). Bodies are fetched lazily, sanitised, and images go into a grid with a viewer.
     Other labels on the Issue become the tags in the side column. Permalink: #/posts?view=journal&note=P58. */
  (() => {
    const FEED = 'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/postList.json';
    const RAW = 'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/';
    const ORIGIN = 'https://blog.luliy.me/';
    const PAGE = 8;
    const main = document.getElementById('main');
    if (!main) return;
    const T = s => (typeof window.LuliyInterfaceText === 'function' ? window.LuliyInterfaceText(s) : s);
    const trad = () => root.lang === 'zh-Hant';
    const L = (zh, en, ja) => (/^en/.test(root.lang) ? en : /^ja/.test(root.lang) ? ja : trad() ? T(zh) : zh);
    const jl = o => '#/posts?' + new URLSearchParams({ view: 'journal', ...o });
    const isPin = l => /^pinned(?:-\d+)?$/i.test(l);
    const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

    /* ---- data: window.LuliyJournal from home-early.js; if that script is an older copy, read the feed here ---- */
    let ownFetch = false;
    const fromFeed = json => Object.keys(json || {}).filter(k => /^P\d+$/.test(k) && json[k] && typeof json[k] === 'object'
      && (json[k].labels || []).some(l => String(l && l.name !== undefined ? l.name : l).trim().toLowerCase() === 'journal')).map(k => {
      const it = json[k]; let bodyUrl = '';
      try { const u = new URL(String(it.postUrl || ''), ORIGIN); const p = u.pathname.replace(/^\//, ''); if (u.origin === ORIGIN.slice(0, -1) && /^post\/[^?#]+\.html$/i.test(p)) bodyUrl = RAW + p; } catch (e) {}
      const n = Number(it.createdAt);
      return { id: k, title: String(it.postTitle || ''), date: String(it.createdDate || ''), ts: isFinite(n) && n > 0 ? (n > 1e12 ? n : n * 1000) : 0,
        labels: (it.labels || []).map(l => String(l && l.name !== undefined ? l.name : l).trim()), bodyUrl, summary: String(it.postSummary || it.description || '').replace(/\s+/g, ' ').trim().slice(0, 160) };
    }).sort((a, b) => (b.labels.some(isPin) - a.labels.some(isPin)) || (b.ts - a.ts) || String(b.date).localeCompare(String(a.date)));
    const ensureFeed = () => {
      if (window.LuliyJournal || ownFetch) return;
      ownFetch = true;
      setTimeout(() => {
        if (window.LuliyJournal && window.LuliyJournal.items) return;
        fetch(FEED, { cache: 'no-store' }).then(r => (r.ok ? r.json() : Promise.reject())).then(json => {
          if (window.LuliyJournal && window.LuliyJournal.items) return;
          window.LuliyJournal = { items: fromFeed(json), failed: false };
          dispatchEvent(new CustomEvent('luliy-journal-feed'));
        }).catch(() => { window.LuliyJournal = window.LuliyJournal || { items: [], failed: true }; window.LuliyJournal.failed = true; if (!window.LuliyJournal.items) window.LuliyJournal.items = []; dispatchEvent(new CustomEvent('luliy-journal-feed')); });
      }, 1500);
    };

    /* ---- body: fetch the Gmeek page, keep #postBody, strip it down to a safe subset ---- */
    const KEEP = new Set('A B BLOCKQUOTE BR CODE DEL DIV EM FIGCAPTION FIGURE H1 H2 H3 H4 H5 H6 HR I IMG LI OL P PRE S SMALL SPAN STRONG SUB SUP TABLE TBODY TD TH THEAD TR U UL'.split(' '));
    const DROP = new Set('SCRIPT STYLE IFRAME OBJECT EMBED SVG FORM BUTTON CANVAS META LINK INPUT SELECT TEXTAREA'.split(' '));
    const safeUrl = (v, base, mail) => { try { const u = new URL(v, base); return ['http:', 'https:'].includes(u.protocol) || (mail && u.protocol === 'mailto:') ? u.href : null; } catch (e) { return null; } };
    const clean = (node, base) => {
      if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.nodeValue);
      if (node.nodeType !== Node.ELEMENT_NODE || DROP.has(node.tagName)) return document.createDocumentFragment();
      const kids = () => { const f = document.createDocumentFragment(); node.childNodes.forEach(c => f.append(clean(c, base))); return f; };
      if (!KEEP.has(node.tagName)) return kids();
      if (/^H[1-6]$/.test(node.tagName)) { const p = el('p', 'lj-h'); p.append(kids()); return p; }
      const out = document.createElement(node.tagName.toLowerCase());
      if (node.tagName === 'A') { const h = safeUrl(node.getAttribute('href'), base, true); if (h) { out.href = h; if (!h.startsWith('mailto:')) { out.target = '_blank'; out.rel = 'noopener noreferrer'; } } }
      if (node.tagName === 'IMG') {
        const s = safeUrl(node.getAttribute('src') || node.getAttribute('data-src'), base);
        if (!s) return document.createDocumentFragment();
        out.referrerPolicy = 'no-referrer'; out.src = s; out.alt = node.getAttribute('alt') || ''; out.loading = 'lazy'; out.decoding = 'async';
      }
      out.append(kids());
      return out;
    };
    const bodies = new Map();
    const loadBody = item => {
      if (!item.bodyUrl) return Promise.reject(new Error('no body'));
      if (!bodies.has(item.id)) {
        const p = fetch(item.bodyUrl, { credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(12000) })
          .then(r => (r.ok ? r.text() : Promise.reject(new Error('http'))))
          .then(html => {
            if (html.length > 1.5e6) throw new Error('large');
            const src = new DOMParser().parseFromString(html, 'text/html').querySelector('#postBody');
            if (!src) throw new Error('invalid');
            const f = document.createDocumentFragment();
            src.childNodes.forEach(c => f.append(clean(c, item.bodyUrl)));
            return f;
          });
        p.catch(() => { if (bodies.get(item.id) === p) bodies.delete(item.id); });
        bodies.set(item.id, p);
      }
      return bodies.get(item.id).then(f => f.cloneNode(true));
    };

    /* ---- time ---- */
    const pad = n => String(n).padStart(2, '0');
    const when = item => {
      if (!item.ts) return { text: item.date, full: item.date };
      const d = new Date(item.ts), s = (Date.now() - item.ts) / 1000;
      const full = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      let text;
      if (s < 60) text = L('刚刚', 'just now', 'たった今');
      else if (s < 3600) { const n = Math.floor(s / 60); text = L(`${n} 分钟前`, `${n} min ago`, `${n}分前`); }
      else if (s < 86400) { const n = Math.floor(s / 3600); text = L(`${n} 小时前`, `${n} h ago`, `${n}時間前`); }
      else if (s < 604800) { const n = Math.floor(s / 86400); text = L(`${n} 天前`, `${n} d ago`, `${n}日前`); }
      else if (d.getFullYear() === new Date().getFullYear()) text = L(`${d.getMonth() + 1}月${d.getDate()}日`, `${d.getMonth() + 1}/${d.getDate()}`, `${d.getMonth() + 1}月${d.getDate()}日`);
      else text = L(`${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`, `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`);
      return { text, full };
    };

    /* ---- image viewer ---- */
    let viewer = null;
    const openViewer = (src, alt, opener) => {
      if (!viewer) {
        viewer = el('dialog', 'lj-viewer');
        viewer.setAttribute('aria-label', L('查看图片', 'Image viewer', '画像ビューア'));
        const close = el('button', 'lj-viewer-close', '×'); close.type = 'button';
        close.setAttribute('aria-label', L('关闭', 'Close', '閉じる'));
        const img = el('img'); img.alt = '';
        viewer.append(close, img);
        close.addEventListener('click', () => viewer.close());
        viewer.addEventListener('click', e => { if (e.target !== img) viewer.close(); });
        viewer.addEventListener('close', () => { document.body.classList.remove('lj-viewing'); viewer.__opener?.focus?.(); });
        document.body.append(viewer);
      }
      const img = viewer.querySelector('img'); img.src = src; img.alt = alt || '';
      viewer.__opener = opener;
      document.body.classList.add('lj-viewing');
      if (typeof viewer.showModal === 'function') viewer.showModal(); else viewer.setAttribute('open', '');
    };

    /* ---- one note ---- */
    const tagsOf = item => item.labels.filter(l => l.toLowerCase() !== 'journal' && !isPin(l));
    const buildNote = (item, single) => {
      const a = el('article', 'lj-note'); a.id = 'note-' + item.id; a.dataset.id = item.id; a.setAttribute('aria-busy', 'true');
      const avatar = el('a', 'lj-avatar-link'); avatar.href = '#/about'; avatar.setAttribute('aria-label', L('关于 Luliy', 'About Luliy', 'Luliy について')); avatar.title = L('关于', 'About', 'About'); { const im = el('img', 'lj-avatar'); im.src = 'https://cloud.luliy.me/api/image?path=shared%2Fluliy.png'; im.alt = ''; im.width = 40; im.height = 40; im.decoding = 'async'; im.referrerPolicy = 'no-referrer'; avatar.append(im); }
      const col = el('div', 'lj-col');
      const head = el('header', 'lj-head');
      head.append(el('strong', 'lj-name', 'Luliy'));
      const t = when(item);
      const link = el('a', 'lj-time'); link.href = jl({ note: item.id }); link.title = t.full;
      const time = el('time', null, t.text); if (item.ts) time.dateTime = new Date(item.ts).toISOString();
      link.append(time); head.append(el('span', 'lj-dot', '·'), link);
      if (item.labels.some(isPin)) head.append(el('span', 'lj-pin', L('置顶', 'Pinned', '固定')));
      const text = el('div', 'lj-text'); text.id = 'lj-text-' + item.id;
      text.append(el('span', 'lj-skel'), el('span', 'lj-skel lj-skel-short'));
      const media = el('div', 'lj-media'); media.hidden = true;
      col.append(head, text, media);
      const tags = tagsOf(item);
      if (tags.length) { const row = el('div', 'lj-tags'); tags.forEach(g => { const c = el('a', null, '#' + g); c.href = jl({ tag: g }); row.append(c); }); col.append(row); }
      {
        // block 34 (comments) loads after this block, so the API is checked a frame later, not now
        const bar = el('div', 'lj-cbar'), btn = el('button', 'lj-cbtn', L('评论', 'Comments', 'コメント'));
        btn.type = 'button'; btn.setAttribute('aria-expanded', 'false');
        const box = el('div', 'lj-comments'); box.hidden = true; box.id = 'lj-c-' + item.id; btn.setAttribute('aria-controls', box.id);
        const setOpen = open => {
          btn.setAttribute('aria-expanded', String(open)); box.hidden = !open; btn.classList.toggle('is-open', open);
          if (open) window.LuliyComments.fill(box, 'journal-' + item.id); else box.replaceChildren();
        };
        a._ljCloseComments = () => { if (!box.hidden) setOpen(false); };
        btn.addEventListener('click', () => {
          const open = box.hidden;
          if (open) document.querySelectorAll('.lj-note').forEach(n => { if (n !== a && n._ljCloseComments) n._ljCloseComments(); });
          setOpen(open);
        });
        // shown from the start so the note does not grow a frame later (2026-10-31); hidden again only if comments are off
        bar.append(btn); col.append(bar, box);
        requestAnimationFrame(() => { if (!window.LuliyComments) bar.hidden = true; else if (single) setOpen(true); });   // permalink: thread already open
      }
      a.append(avatar, col);

      const fill = frag => {
        text.replaceChildren();
        const imgs = [...frag.querySelectorAll('img')];
        imgs.forEach(img => {
          const parent = img.parentElement;
          img.remove();
          if (parent && parent.tagName === 'A' && !parent.textContent.trim() && !parent.querySelector('img')) { const gp = parent.parentElement; parent.remove(); if (gp && gp.tagName === 'P' && !gp.textContent.trim() && !gp.children.length) gp.remove(); }
          else if (parent && parent.tagName === 'P' && !parent.textContent.trim() && !parent.querySelector('img,br:not(:only-child)')) parent.remove();
        });
        frag.querySelectorAll('p').forEach(p => { if (!p.textContent.trim() && !p.children.length) p.remove(); });
        if (trad()) { const w = document.createTreeWalker(frag, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (/[㐀-鿿]/.test(n.nodeValue)) n.nodeValue = T(n.nodeValue); } }
        if (frag.textContent.trim() || frag.querySelector('pre,table')) text.append(frag); else text.hidden = !!imgs.length;
        if (imgs.length) {
          media.hidden = false; media.dataset.count = String(Math.min(imgs.length, 4));
          imgs.forEach(img => { const b = el('button', 'lj-shot'); b.type = 'button'; b.setAttribute('aria-label', L('查看大图', 'View image', '画像を拡大') + (img.alt ? '：' + img.alt : '')); b.append(img); b.addEventListener('click', () => openViewer(img.src, img.alt, b)); media.append(b); });
        }
        a.setAttribute('aria-busy', 'false');
        requestAnimationFrame(() => {
          if (single || text.hidden || text.scrollHeight <= 212) return;
          text.classList.add('is-clamped');
          const more = el('button', 'lj-expand', L('展开', 'Show more', '続きを読む')); more.type = 'button';
          more.setAttribute('aria-expanded', 'false'); more.setAttribute('aria-controls', text.id);
          more.addEventListener('click', () => {
            const open = text.classList.toggle('is-clamped') === false;
            more.setAttribute('aria-expanded', String(open));
            more.textContent = open ? L('收起', 'Show less', '閉じる') : L('展开', 'Show more', '続きを読む');
          });
          text.after(more);
        });
      };
      const fail = () => {
        text.replaceChildren();
        text.append(el('p', null, item.summary || item.title || ''));
        const retry = el('button', 'lj-retry', L('没能读到全文，点此重试', 'Could not load the full text — retry', '全文を読み込めません。再試行'));
        retry.type = 'button';
        retry.addEventListener('click', () => { retry.remove(); text.replaceChildren(el('span', 'lj-skel'), el('span', 'lj-skel lj-skel-short')); queue(item, fill, fail); });
        text.after(retry); a.setAttribute('aria-busy', 'false');
      };
      queue(item, fill, fail);
      return a;
    };
    /* at most three bodies in flight */
    const waiting = []; let active = 0;
    const queue = (item, ok, bad) => { waiting.push({ item, ok, bad }); pump(); };
    const pump = () => {
      while (active < 3 && waiting.length) {
        const job = waiting.shift(); active++;
        loadBody(job.item).then(job.ok, job.bad).catch(() => {}).finally(() => { active--; pump(); });
      }
    };

    /* ---- the tab's content ---- */
    let current = null;
    const mount = (after, q) => {
      current?.stop();
      const wrap = el('section', 'luliy-journal'); wrap.setAttribute('aria-label', L('短札', 'Journal', '短札'));
      after.after(wrap);
      const st = { tag: q.get('tag') || '', note: q.get('note') || '', shown: PAGE };
      const stop = () => { removeEventListener('luliy-journal-feed', draw); waiting.length = 0; };
      current = { wrap, stop };
      function draw() {
        wrap.replaceChildren(); waiting.length = 0;
        const J = window.LuliyJournal, items = J && J.items;
        if (!items) {
          ensureFeed();
          const p = el('p', 'lj-empty', L('正在读取短札…', 'Loading…', '読み込み中…')); p.setAttribute('role', 'status'); wrap.append(p); return;
        }
        const feed = el('div', 'lj-feed'); feed.setAttribute('role', 'feed');
        const side = el('aside', 'lj-side');
        if (st.note) {
          const item = items.find(i => i.id === st.note);
          const back = el('a', 'lj-back', '← ' + L('全部短札', 'All notes', 'すべての短札')); back.href = jl({});
          feed.append(back);
          if (item) feed.append(buildNote(item, true)); else feed.append(el('p', 'lj-empty', L('没有找到这条短札。', 'That note was not found.', 'この短札は見つかりません。')));
          wrap.append(feed); return;
        }
        const counts = new Map(), days = new Set();
        const dayKey = i => { if (i.ts) { const d = new Date(i.ts); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; } return i.date; };
        items.forEach(i => { tagsOf(i).forEach(g => counts.set(g, (counts.get(g) || 0) + 1)); if (dayKey(i)) days.add(dayKey(i)); });
        const list = st.tag ? items.filter(i => i.labels.includes(st.tag)) : items;
        if (!items.length) {
          const box = el('div', 'lj-empty');
          box.append(el('p', null, J.failed ? L('暂时读不到短札，请稍后刷新重试。', 'Journal is temporarily unavailable. Please retry.', '短札を読み込めません。後でもう一度お試しください。')
            : L('还没有短札。', 'No notes yet.', 'まだ短札はありません。')));
          if (!J.failed) box.append(el('p', 'lj-hint', L('在 Gmeek 新建一个 Issue，加上 journal 标签，发布后这里就会出现。标题随便写，不会显示。', 'Create a Gmeek Issue with the label “journal” and it will appear here. The title is not shown.', 'Gmeek で journal ラベルの Issue を作ると、ここに表示されます。タイトルは表示されません。')));
          feed.append(box); wrap.append(feed); return;
        }

        /* feed: paginated list, or the search results */
        let query = '', seq = 0;
        const fillFeed = (found) => {
          waiting.length = 0; feed.replaceChildren();
          const rows = found || list;
          if (found) {
            const s = el('p', 'lj-result', found.length ? L(`找到 ${found.length} 条`, `${found.length} found`, `${found.length} 件見つかりました`) : L('没有找到相关的短札。', 'Nothing found.', '見つかりませんでした。'));
            s.setAttribute('role', 'status'); feed.append(s);
          } else if (!rows.length) {
            const box = el('div', 'lj-empty'); box.append(el('p', null, L('这个标签下还没有短札。', 'No notes under this tag yet.', 'このタグの短札はまだありません。')));
            const a = el('a', 'lj-back', '← ' + L('全部短札', 'All notes', 'すべての短札')); a.href = jl({}); box.append(a); feed.append(box);
          }
          let more = null, shown = 0;
          const add = () => {
            const to = found ? rows.length : Math.min(rows.length, shown + PAGE);
            for (let i = shown; i < to; i++) feed.insertBefore(buildNote(rows[i], false), more);
            shown = to;
            if (more && shown >= rows.length) { more.remove(); more = null; }
          };
          if (!found && rows.length > PAGE) {
            more = el('button', 'lj-more', L('载入更多', 'Load more', 'さらに表示')); more.type = 'button';
            more.addEventListener('click', () => { const first = shown; add(); feed.querySelectorAll('.lj-note')[first]?.querySelector('a')?.focus?.({ preventScroll: true }); });
            feed.append(more);
          }
          add();
          // The bodies arrive a moment after the notes: only the note texts stay hidden until the first ones are filled
          // (at most 0.3 s; home-fixes.css 35), the rest of each note shows at once (2026-10-31).
          feed.classList.add('lj-settling');
          const reveal = () => feed.classList.remove('lj-settling');
          const capR = setTimeout(reveal, 300);
          const check = () => { if (!feed.isConnected) return; if (!feed.querySelector('.lj-note[aria-busy="true"]')) { clearTimeout(capR); requestAnimationFrame(reveal); } else setTimeout(check, 60); };
          check();
        };
        const plain = item => new Promise(res => queue(item, f => res(f.textContent || ''), () => res('')));
        const runSearch = async value => {
          const q = value.trim(), mine = ++seq; query = q;
          if (!q) { fillFeed(); return; }
          const texts = await Promise.all(list.map(plain));
          if (mine !== seq) return;
          const needles = [...new Set([q, T(q)])].map(s => s.toLowerCase());
          fillFeed(list.filter((item, i) => {
            const hay = [item.title, item.summary, item.labels.join(' '), texts[i]].join('\n').toLowerCase();
            const hayT = trad() ? T(hay) : hay;
            return needles.some(n => hay.includes(n) || hayT.includes(n));
          }));
        };

        /* side: profile card, activity grid, search, tags */
        const card = el('div', 'lj-card');
        const av = el('a', 'lj-card-avatar-link'); av.href = '#/about'; av.setAttribute('aria-label', L('关于 Luliy', 'About Luliy', 'Luliy について')); av.title = L('关于', 'About', 'About'); { const im = el('img', 'lj-card-avatar'); im.src = 'https://cloud.luliy.me/api/image?path=shared%2Fluliy.png'; im.alt = ''; im.width = 84; im.height = 84; im.decoding = 'async'; im.referrerPolicy = 'no-referrer'; av.append(im); }
        const stats = el('dl', 'lj-stats');
        [[L('短札', 'Notes', '短札'), items.length], [L('标签', 'Tags', 'タグ'), counts.size], [L('天', 'Days', '日'), days.size]].forEach(([k, v]) => { const d = el('div'); d.append(el('dt', null, k), el('dd', null, String(v))); stats.append(d); });
        const social = el('div', 'lj-social');
        const icon = d => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
        [['Email', 'mailto:me@luliy.me', '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'],
          ['GitHub', 'https://github.com/luliy6', '<path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'],
          ['Bilibili', 'https://space.bilibili.com/450483800', '<rect x="3" y="7" width="18" height="12" rx="3"/><path d="m8 3 3 4m5-4-3 4M8.5 12v1.5m7-1.5v1.5"/>'],
          ['Telegram', 'https://web.telegram.org/a/#-1002032433504', '<path d="M21.5 3.5 2.5 11l6 2.2 2.3 6.3 3.2-3.8 5 3.3 2.5-15.5Z"/><path d="m8.5 13.2 8-5.2"/>']].forEach(([name, url, d]) => {
          const a = el('a'); a.href = url; if (!url.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } a.setAttribute('aria-label', name === 'Email' ? 'me@luliy.me' : name); a.title = name === 'Email' ? 'me@luliy.me' : name; a.innerHTML = icon(d); social.append(a);
        });
        card.append(av, el('strong', 'lj-card-name', 'Luliy'), (() => { const sub = el('span', 'lj-card-sub ld-raw'); ['03于宁，', '高文大工，', '射手座，', 'INFJ+ADHD+AB'].forEach(t => sub.append(el('span', 'lj-nowrap', t))); return sub; })(), stats, social);

        const WEEKS = 16, now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7) - (WEEKS - 1) * 7);
        const byDay = new Map(); items.forEach(i => { const k = dayKey(i); if (k) byDay.set(k, (byDay.get(k) || 0) + 1); });
        const heat = el('div', 'lj-heat'); let recent = 0;
        const grid = el('div', 'lj-heat-grid'); grid.setAttribute('aria-hidden', 'true');
        for (let w = 0; w < WEEKS; w++) for (let d = 0; d < 7; d++) {
          const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d), cell = el('i');
          if (day > today) cell.className = 'is-future';
          else { const k = `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`, n = byDay.get(k) || 0; recent += n; cell.dataset.l = String(Math.min(n, 3)); cell.title = n ? `${k} · ${n}` : k; }
          grid.append(cell);
        }
        heat.append(el('h2', 'lj-side-title', L(`最近 ${WEEKS} 周`, `Last ${WEEKS} weeks`, `直近 ${WEEKS} 週間`)), grid);
        heat.setAttribute('role', 'img'); heat.setAttribute('aria-label', L(`最近 ${WEEKS} 周共 ${recent} 条短札`, `${recent} notes in the last ${WEEKS} weeks`, `直近 ${WEEKS} 週間で ${recent} 件`));

        const searchWrap = el('div', 'lj-search');
        const input = el('input'); input.type = 'search'; input.placeholder = L('搜索短札', 'Search notes', '短札を検索'); input.setAttribute('aria-label', L('搜索短札', 'Search notes', '短札を検索')); input.autocomplete = 'off'; input.enterKeyHint = 'search';
        let timer = 0; input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => runSearch(input.value), 250); });
        input.addEventListener('keydown', e => { if (e.key === 'Escape' && input.value) { input.value = ''; runSearch(''); e.stopPropagation(); } });
        searchWrap.append(input);

        const tagsBox = el('div', 'lj-tagbox');
        tagsBox.append(el('h2', 'lj-side-title', L('标签', 'Tags', 'タグ')));
        const nav = el('nav', 'lj-tagnav'); nav.setAttribute('aria-label', L('短札标签', 'Journal tags', '短札のタグ'));
        const all = el('a', null, L('全部', 'All', 'すべて')); all.href = jl({}); if (!st.tag) all.setAttribute('aria-current', 'page');
        all.append(el('span', null, String(items.length))); nav.append(all);
        [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN')).forEach(([g, n]) => {
          const a = el('a', null, g); a.href = jl({ tag: g }); if (st.tag === g) a.setAttribute('aria-current', 'page'); a.append(el('span', null, String(n))); nav.append(a);
        });
        tagsBox.append(nav);
        side.append(card, heat, searchWrap, tagsBox);
        fillFeed();
        wrap.append(feed, side);
      }
      addEventListener('luliy-journal-feed', draw);
      draw();
    };

    /* ---- tab + routing: runs after every render of #main ---- */
    const routeOf = () => { try { const u = new URL(location.hash.slice(1) || '/', 'https://luliy.local'); return { path: u.pathname.replace(/\/+$/, '') || '/', q: u.searchParams }; } catch (e) { return { path: '/', q: new URLSearchParams() }; } };
    let busy = false;
    const sync = () => {
      if (busy) return;
      const r = routeOf();
      if (current && !current.wrap.isConnected) { current.stop(); current = null; }
      if (r.path !== '/posts') return;
      const host = main.querySelector('.post-archive');
      const modes = host && host.querySelector('.article-modes');
      if (!modes) return;
      busy = true;
      try {
        let tab = modes.querySelector('[data-journal-tab]');
        if (!tab) {
          const first = modes.querySelector('a');
          if (!first) return;
          tab = document.createElement('a'); tab.dataset.journalTab = '';
          tab.href = (first.getAttribute('href') || '#/posts?view=archive').replace(/view=[a-z]+/, 'view=journal');
          tab.textContent = L('短札', 'Journal', '短札');
          first.after(tab);
        }
        const on = r.q.get('view') === 'journal';
        if (on) {
          modes.querySelectorAll('a').forEach(a => { if (a !== tab) a.removeAttribute('aria-current'); });
          tab.setAttribute('aria-current', 'page');
          if (!host.querySelector('.luliy-journal')) {
            const bar = modes.closest('.article-browse-toolbar') || modes;
            if (bar !== modes) [...bar.children].forEach(c => { if (c !== modes) c.remove(); });
            let n = bar.nextElementSibling;
            while (n) { const nx = n.nextElementSibling; n.remove(); n = nx; }
            host.classList.add('luliy-journal-view');
            mount(bar, r.q);
          }
        } else { host.classList.remove('luliy-journal-view'); }
        // phones: the header copy of the tabs was made before this tab existed
        const hdr = document.querySelector('#header .luliy-header-modes');
        if (hdr && hdr.innerHTML !== modes.innerHTML) hdr.innerHTML = modes.innerHTML;
      } finally { busy = false; }
    };
    new MutationObserver(sync).observe(main, { childList: true, subtree: true });
    addEventListener('hashchange', () => queueMicrotask(sync));
    // Section 39 calls this right after the router's update, before any MutationObserver hears about the new list:
    // the article list the router drew for 短札 is gone before other scripts start decorating its cards.
    window.LuliyJournalSync = sync;
    sync();

    /* ---- warm-up (2026-11-01): while 文章 / 編年史 is open, the first notes' texts are fetched and the avatar is
       decoded when the browser is idle, so the first switch to 短札 shows everything in its first frame. Skipped on
       Save-Data / 2G. The bodies land in the same cache loadBody() uses. */
    let warmed = false, warmImg = null;
    const warm = () => {
      if (warmed || routeOf().path !== '/posts') return;
      const J = window.LuliyJournal;
      if (!J || !J.items || !J.items.length) return;
      const c = navigator.connection;
      if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return;
      warmed = true;
      const idle = window.requestIdleCallback || (f => setTimeout(f, 200));
      idle(() => {
        J.items.slice(0, 4).forEach(it => { loadBody(it).catch(() => {}); });
        warmImg = new Image(); warmImg.decoding = 'async'; warmImg.src = '/assets/avatar/luliy.webp?v=5';
        if (warmImg.decode) warmImg.decode().catch(() => {});
      }, { timeout: 4000 });
    };
    const warmSoon = () => setTimeout(warm, 1200);
    addEventListener('luliy-journal-feed', warmSoon);
    addEventListener('hashchange', warmSoon);
    warmSoon();
  })();

  /* 33. Phones: the header tabs follow the finger (2026-11-02; replaces the 2026-10-30 swipe, which switched only
     once the finger was lifted). On #/posts (文章 · 短札 · 編年史) a sideways drag moves the page with the finger:
     while it moves, the pages become rounded cards with a dark seam between them, the next tab is already
     beside the current one, and the gold bar under the header tabs travels with it. On release the page goes
     to the next tab when it was dragged past 30% of the width or flicked; otherwise it springs back. A tap on a
     header tab slides the same way. Each tab keeps its own scroll position.
     How: the router draws one tab at a time, so the moving pages are copies. When a drag starts, the current
     page is copied (rows below the screen dropped), and the copy of each tab is kept for the next drag; a tab
     not seen yet shows placeholder rows. The copies sit in a fixed layer under the header, inert and hidden
     from screen readers, only while the finger is down or the page is settling. After the hash changes the real
     page is scrolled to where that tab was left, and the layer fades out (0.14 s) once the new content is in
     (短札: once the first notes on screen have their text, at most 0.35 s).
     Left alone: anything that scrolls sideways itself (tag row, code, tables), dialogs, the filter sheet, the
     image viewer, text selection, drags starting within 20 px of the screen edge (the system back gesture),
     reduced motion (the tabs then switch at once), and the Works page's header tabs (a quick swipe still
     presses the next one). */
  (() => {
    const mobile = matchMedia('(max-width: 768px), (pointer: coarse) and (max-height: 500px)');
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    const main = document.getElementById('main');
    if (!main) return;
    const GAP = 12, TH = .30, DUR = 380, VEL = .45, EDGE = 20, EASE = 'cubic-bezier(.2,.9,.25,1)';
    const onPosts = () => /^#\/posts(?:[?&]|$)/.test(location.hash || '');
    const viewOf = h => { try { return new URL(String(h || '').replace(/^#/, '') || '/', 'https://luliy.local').searchParams.get('view') || 'archive'; } catch (e) { return 'archive'; } };
    const tabsNow = () => [...document.querySelectorAll('#header .luliy-header-modes :is(a, button)')];
    const scrollsSideways = el => {
      for (let n = el; n && n !== document.body && n.nodeType === 1; n = n.parentElement) {
        if (n.scrollWidth > n.clientWidth + 2) { const o = getComputedStyle(n).overflowX; if (o === 'auto' || o === 'scroll') return true; }
        if (n.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName) || n.matches?.('dialog[open], .lj-viewer, [data-luliy-sheet], [role=dialog]')) return true;
      }
      return false;
    };
    const blocked = () => document.body.classList.contains('luliy-sheet-open') || document.body.classList.contains('lj-viewing') || !!document.querySelector('dialog[open]') || String(getSelection() || '').length > 0;

    /* ---- copies of each tab ---- */
    const snaps = new Map();   // view -> { node, y, top, left, width }
    const ROWS = 'li, article, section, .post-row, .post-year, .lj-note, .study-entry, .archive-card, .month';
    function snapshot() {
      const r = main.getBoundingClientRect(), vh = innerHeight;
      const live = [...main.querySelectorAll(ROWS)], below = live.map(n => n.getBoundingClientRect().top > vh + 160);
      const node = main.cloneNode(true), copy = [...node.querySelectorAll(ROWS)];
      if (copy.length === live.length) copy.forEach((n, i) => { if (below[i]) n.remove(); });
      node.removeAttribute('tabindex'); node.style.minHeight = '';
      return { node, y: scrollY, top: r.top + scrollY, left: r.left, width: r.width };
    }
    function skeleton() {
      const s = document.createElement('div'); s.className = 'lsw-skel';
      for (let i = 0; i < 7; i++) s.append(document.createElement('i'));
      return s;
    }

    /* ---- the moving layer ---- */
    let L = null;          // { stage, track, bar, pages, tabs, idx, W, rects }
    let s = null, busy = false, settleT = 0;
    function build(tabs, idx) {
      const W = innerWidth, header = document.getElementById('header');
      const stage = document.createElement('div'); stage.className = 'lsw-stage'; stage.setAttribute('aria-hidden', 'true'); stage.inert = true;
      stage.style.zIndex = String((parseInt(getComputedStyle(header || document.body).zIndex, 10) || 60) - 1);
      const bg = getComputedStyle(document.body).backgroundColor;
      stage.style.setProperty('--lsw-page', bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : 'var(--bg)');
      const track = document.createElement('div'); track.className = 'lsw-track';
      const pages = tabs.map((t, i) => {
        const p = document.createElement('div'); p.className = 'lsw-page';
        const sn = snaps.get(viewOf(t.getAttribute('href')));
        if (sn) {
          sn.node.style.cssText = `position:absolute;margin:0;top:${sn.top - sn.y}px;left:${sn.left}px;width:${sn.width}px;transform:none;animation:none`;
          p.append(sn.node);
        } else p.append(skeleton());
        track.append(p);
        return p;
      });
      stage.append(track);
      const bar = document.createElement('div'); bar.className = 'lsw-bar'; bar.setAttribute('aria-hidden', 'true');
      bar.style.zIndex = String((parseInt(getComputedStyle(header || document.body).zIndex, 10) || 60) + 1);
      const rects = tabs.map(t => t.getBoundingClientRect());
      bar.style.top = (rects[idx].bottom - 5) + 'px';
      document.body.append(stage, bar);
      root.classList.add('lsw-on');
      L = { stage, track, bar, pages, tabs, idx, W, rects };
      requestAnimationFrame(() => { if (L && L.stage === stage) stage.classList.add('lsw-round'); });
    }
    const pos = i => -i * (L.W + GAP);
    const currentX = () => { const m = getComputedStyle(L.track).transform; return m && m !== 'none' ? new DOMMatrixReadOnly(m).m41 : pos(L.idx); };
    function setX(x, ms) {
      L.track.style.transition = ms ? `transform ${ms}ms ${EASE}` : 'none';
      L.track.style.transform = `translate3d(${x}px,0,0)`;
      const p = Math.max(0, Math.min(L.tabs.length - 1, -x / (L.W + GAP))), i = Math.min(L.tabs.length - 2, Math.floor(p)), f = p - i;
      const a = L.rects[Math.max(0, i)], b = L.rects[Math.max(0, i) + 1] || a;
      const cx = (a.left + a.width / 2) + ((b.left + b.width / 2) - (a.left + a.width / 2)) * f;
      L.bar.style.transition = ms ? `transform ${ms}ms ${EASE}` : 'none';
      L.bar.style.transform = `translateX(${cx - 8}px)`;
    }
    function teardown(fade) {
      if (!L) return;
      const { stage, bar } = L; L = null;
      clearTimeout(settleT);
      const done = () => {
        stage.querySelectorAll('.lsw-page > *').forEach(n => n.remove());   // the copies stay in snaps for the next drag
        stage.remove(); bar.remove(); busy = false;
      };
      root.classList.remove('lsw-on');
      if (fade && !calm.matches) { stage.classList.add('lsw-out'); bar.remove(); setTimeout(done, 160); } else done();
    }
    // animate to tab t; when it is a different tab, change the hash, put the real page where that tab was left,
    // and let the layer go once the new content is in
    function settle(t, ms) {
      busy = true;
      t = Math.max(0, Math.min(L.tabs.length - 1, t));
      setX(pos(t), ms);
      const squareAt = Math.max(0, ms - 180);
      settleT = setTimeout(() => L && L.stage.classList.remove('lsw-round'), squareAt);
      setTimeout(() => {
        if (!L) return;
        if (t === L.idx) { teardown(false); return; }
        const a = L.tabs[t], href = a.getAttribute('href'), view = viewOf(href), sn = snaps.get(view);
        const y = sn ? sn.y : 0;
        addEventListener('hashchange', () => {      // added now, so it runs after every other listener (router, held height)
          if (viewOf(location.hash) !== view) { teardown(true); return; }
          scrollTo({ top: y, behavior: 'instant' });
          const t0 = performance.now();
          const ready = () => {
            const waiting = view === 'journal' && [...main.querySelectorAll('.lj-note[aria-busy="true"]')].some(n => n.getBoundingClientRect().top < innerHeight);
            if (waiting && performance.now() - t0 < 350) { setTimeout(ready, 50); return; }
            requestAnimationFrame(() => requestAnimationFrame(() => teardown(true)));
          };
          ready();
        }, { once: true });
        location.hash = href;
      }, ms);
    }

    /* ---- finger ---- */
    document.addEventListener('touchstart', e => {
      s = null;
      if (busy || e.touches.length !== 1 || !mobile.matches || !tabsNow().length || blocked()) return;
      const t = e.touches[0];
      if (t.clientX < EDGE || t.clientX > innerWidth - EDGE || e.target.closest?.('#header') || scrollsSideways(e.target)) return;
      s = { x: t.clientX, y: t.clientY, t: performance.now(), mode: null, base: 0, samples: [] };
    }, { passive: true });
    document.addEventListener('touchmove', e => {
      if (!s || e.touches.length !== 1) { s = null; return; }
      const t = e.touches[0], dx = t.clientX - s.x, dy = t.clientY - s.y;
      if (!s.mode) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dx) <= Math.abs(dy) * 1.2) { s = null; return; }
        const tabs = tabsNow(), idx = tabs.findIndex(a => a.hasAttribute('aria-current'));
        if (idx < 0) { s = null; return; }
        if (!onPosts() || calm.matches || tabs.some(a => a.tagName !== 'A')) { s.mode = 'flick'; s.tabs = tabs; s.idx = idx; return; }
        snaps.set(viewOf(tabs[idx].getAttribute('href')), snapshot());
        build(tabs, idx);
        s.mode = 'x'; s.x = t.clientX; s.base = pos(idx);
      }
      if (s.mode !== 'x') return;
      if (e.cancelable) e.preventDefault();
      let x = s.base + (t.clientX - s.x);
      const min = pos(L.tabs.length - 1);
      if (x > 0) x *= .32;                              // rubber band past the first / last tab
      if (x < min) x = min + (x - min) * .32;
      setX(x, 0);
      const now = performance.now();
      s.samples.push([now, t.clientX]); while (s.samples.length > 2 && now - s.samples[0][0] > 100) s.samples.shift();
    }, { passive: false });
    const end = cancelled => {
      const st = s; s = null;
      if (!st || !st.mode) return;
      if (st.mode === 'flick') {   // Works page tabs, reduced motion: the old quick swipe
        return;
      }
      if (!L) return;
      const sm = st.samples, v = sm.length > 1 ? (sm[sm.length - 1][1] - sm[0][1]) / Math.max(1, sm[sm.length - 1][0] - sm[0][0]) : 0;
      const p = -currentX() / (L.W + GAP), o = L.idx;
      let t;
      if (!cancelled && Math.abs(v) > VEL) t = v < 0 ? Math.floor(p) + 1 : Math.ceil(p) - 1;
      else t = Math.round(p + (p > o ? .5 - TH : p < o ? -(.5 - TH) : 0));
      t = Math.max(o - 1, Math.min(o + 1, t));
      const target = Math.max(0, Math.min(L.tabs.length - 1, t));
      const left = Math.abs(pos(target) - currentX());
      settle(target, Math.round(Math.max(180, Math.min(DUR, DUR * (.45 + .55 * left / L.W)))));
    };
    document.addEventListener('touchend', e => {
      const st = s;
      if (st && st.mode === 'flick') {
        const t = e.changedTouches[0], dx = t.clientX - st.x;
        s = null;
        if (Math.abs(dx) < 70 || performance.now() - st.t > 700) return;
        const next = st.tabs[st.idx + (dx < 0 ? 1 : -1)];
        if (next) { if (next.tagName === 'A') location.hash = next.getAttribute('href'); else next.click(); }
        return;
      }
      end(false);
    }, { passive: true });
    document.addEventListener('touchcancel', () => end(true), { passive: true });

    /* ---- a tap on a header tab slides the same way ---- */
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('#header .luliy-header-modes a');
      if (!a || !mobile.matches || calm.matches || !onPosts() || busy || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey) return;
      const tabs = tabsNow(), idx = tabs.findIndex(x => x.hasAttribute('aria-current')), to = tabs.indexOf(a);
      if (idx < 0 || to < 0 || to === idx) return;
      e.preventDefault();
      snaps.set(viewOf(tabs[idx].getAttribute('href')), snapshot());
      build(tabs, idx); setX(pos(idx), 0);
      requestAnimationFrame(() => settle(to, Math.round(DUR * .9)));
    }, true);
    // the router drew something else meanwhile (back button, a link): drop the layer
    addEventListener('hashchange', () => { if (L && !busy) teardown(false); });
  })();

  /* 34. Comments / 評論 (2026-10-30): Giscus (GitHub Discussions) under each blog article (#/article/Pxx).
     Same service as hulatu.com. The route is a hash, so location.pathname is the same for every article; the thread is
     therefore keyed by data-mapping="specific" + data-term="article-<id>" instead of by pathname.
     INERT until CATEGORY_ID is filled in (Discussions must be enabled and the giscus app installed first), so it can
     be deployed before the GitHub side is ready without showing visitors an error. */
  (function luliyComments() {
    var CFG = {
      repo: 'luliyer6-ux/home',
      repoId: 'R_kgDOUk8oUw',
      category: 'Announcements',
      categoryId: 'DIC_kwDOUk8oU84DJ_op'                     // <- fill in: DIC_... (see the setup steps)
    };
    if (!CFG.categoryId) return;
    var ORIGIN = 'https://giscus.app', queued = 0;
    function theme() { var t = document.documentElement.dataset.theme; return t === 'dark' ? 'dark' : 'light'; }
    function lang() {
      var l = ''; try { l = localStorage.getItem('luliy_lang') || ''; } catch (e) {}
      if (/en/i.test(l)) return 'en'; if (/ja/i.test(l)) return 'ja'; if (/Hans|CN/i.test(l)) return 'zh-CN'; return 'zh-TW';
    }
    function load(sec, slot, term) {
      if (slot.dataset.loaded) return; slot.dataset.loaded = '1';
      var s = document.createElement('script');
      s.src = ORIGIN + '/client.js'; s.async = true; s.crossOrigin = 'anonymous';
      var a = { repo: CFG.repo, 'repo-id': CFG.repoId, category: CFG.category, 'category-id': CFG.categoryId,
        mapping: 'specific', term: term, strict: '0', 'reactions-enabled': '1', 'emit-metadata': '0',
        'input-position': 'bottom', theme: theme(), lang: lang(), loading: 'lazy' };
      Object.keys(a).forEach(function (k) { s.setAttribute('data-' + k, a[k]); });
      slot.appendChild(s);
      var note = sec.querySelector('.lc-note'), t = setTimeout(function () {
        if (!sec.querySelector('iframe.giscus-frame') && note) note.textContent = '載入有點慢；評論由 GitHub 提供，需要能訪問 github.com 與 giscus.app。';
      }, 12000);
      new MutationObserver(function (m, o) {
        if (sec.querySelector('iframe.giscus-frame')) { clearTimeout(t); if (note) note.hidden = true; o.disconnect(); }
      }).observe(slot, { childList: true, subtree: true });
    }
    function mount() {
      queued = 0;
      var m = /^#\/article\/([\w-]+)/.exec(location.hash || ''); if (!m) return;
      var layout = document.querySelector('#main .source-layout'); if (!layout) return;
      var term = 'article-' + m[1], old = layout.querySelector(':scope > .luliy-comments');
      if (old) { if (old.dataset.term === term) return; old.remove(); }
      var sec = document.createElement('section');
      sec.className = 'luliy-comments'; sec.dataset.term = term; sec.setAttribute('aria-label', '評論');
      sec.innerHTML = '<h2>評論</h2><p class="lc-note" aria-live="polite">正在載入評論…</p><div class="lc-slot"></div>';
      layout.appendChild(sec);
      var slot = sec.querySelector('.lc-slot');
      if (!('IntersectionObserver' in window)) { load(sec, slot, term); return; }
      var io = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); load(sec, slot, term); }
      }, { rootMargin: '400px 0px' });
      io.observe(sec);
    }
    function queue() { if (!queued) { queued = 1; requestAnimationFrame(mount); } }
    new MutationObserver(queue).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', queue); queue();
    // keep the iframe's colours in step with the site's theme switch
    new MutationObserver(function () {
      document.querySelectorAll('iframe.giscus-frame').forEach(function (f) {
        if (f.contentWindow) f.contentWindow.postMessage({ giscus: { setConfig: { theme: theme() } } }, ORIGIN);
      });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // used by the journal (短札) cards: fill(box, term) loads one thread into box right away
    window.LuliyComments = { fill: function (box, term) {
      box.innerHTML = '<p class="lc-note" aria-live="polite">正在載入評論…</p><div class="lc-slot"></div>';
      load(box, box.querySelector('.lc-slot'), term);
    } };
  })();


  /* 35. 文章 / 短札 / 編年史 tab switches (2026-10-31): no collapse-and-grow, no lurch.
     a) The page height from just before the switch is held (min-height on #main) until the new tab has been quiet for
        300 ms (at most 1.5 s), then released once. The router swaps the content before this listener runs (it reacts
        to popstate), so a ResizeObserver keeps the last two heights: if the height changed just now, the one before
        that is the old tab's.
     b) No fade (removed 2026-10-31: it left a blank moment). home-fixes.css 35 keeps the scrollbar space reserved and
        gives 編年史's tabs the same box as the other two, so the tabs never move. */
  (() => {
    const main = document.getElementById('main');
    if (!main || !window.ResizeObserver) return;
    const tabs = h => /^#\/posts(?:\?|$)/.test(h || '');
    let prev = location.hash, lastH = 0, prevH = 0, lastAt = 0, quietT = 0, capT = 0, mo = null;
    new ResizeObserver(() => {
      if (main.style.minHeight) return;
      const h = main.offsetHeight;
      if (h !== lastH) { prevH = lastH; lastH = h; lastAt = performance.now(); }
    }).observe(main);
    const release = () => { clearTimeout(quietT); clearTimeout(capT); if (mo) { mo.disconnect(); mo = null; } main.style.minHeight = ''; };
    addEventListener('hashchange', () => {
      const was = prev; prev = location.hash;
      if (!tabs(was) || !tabs(location.hash)) return;
      const hold = performance.now() - lastAt < 250 && prevH ? prevH : lastH;   // the height of the tab we just left
      release();
      if (hold) main.style.minHeight = hold + 'px';
      const settle = () => { clearTimeout(quietT); quietT = setTimeout(release, 300); };
      mo = new MutationObserver(settle);
      mo.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-busy', 'hidden', 'class'] });
      settle(); capT = setTimeout(release, 1500);
    });
  })();


  /* 36. Weekly / 周記 magazine layout (2026-10-31). Only blog articles (#/article/Pxx) whose Issue carries the label
     `weekly` (any case; 周記 / 周记 / 週記 also count) get it; every other article, 短札 and 編年史 are untouched.
     a) html.lk-weekly switches on a paper page (home-fixes.css 36): 白紙 when the site appearance is light, 夜間
        otherwise. The stars, the article artwork, Loon, the record player, the old TOC and the orange meta row hide.
     b) Issue number: every weekly Issue in postList.json, oldest first (createdAt, then date, then P number), is
        第 1 期, 第 2 期 … The list is cached in localStorage so the number shows before the feed arrives.
     c) Inside the article: a kicker (WEEKLY · 第 N 期), a byline between a double rule (date, reading time, 分享),
        a drop cap on the first paragraph, short one-paragraph quotes as pull quotes, image alt text as captions,
        an end mark, and 上一期 / 下一期 between weekly issues instead of the general prev / next.
     d) A bottom status bar (目錄 · progress · time left · %) and a contents drawer from the left (h1 and h2 of
        the article; no numbering). Esc / the dim layer close it; focus returns to the button.
     Idempotent: apply() runs at most once per frame on #main changes and hash changes. */
  (() => {
    const main = document.getElementById('main');
    if (!main) return;
    const FEED = 'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/postList.json';
    const KEY = 'luliy-weekly-index-v1';
    const WEEKLY = /(^|[^a-z])weekly([^a-z]|$)|周[记記]|週記/i;
    const T = s => (typeof window.LuliyInterfaceText === 'function' ? window.LuliyInterfaceText(s) : s);
    const L = (zh, en, ja) => (/^en/.test(root.lang) ? en : /^ja/.test(root.lang) ? ja : root.lang === 'zh-Hant' ? T(zh) : zh);
    const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
    const labelNames = it => (Array.isArray(it && it.labels) ? it.labels : []).map(l => String(l && l.name !== undefined ? l.name : l).trim());

    /* ---- b) the weekly index ---- */
    let index = [];
    try { const c = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(c)) index = c; } catch (e) {}
    let fetched = false;
    const stamp = it => { const n = Number(it.createdAt); return isFinite(n) && n > 0 ? (n > 1e12 ? n : n * 1000) : (Date.parse(it.createdDate || '') || 0); };
    function loadIndex() {
      if (fetched || typeof fetch !== 'function') return;
      fetched = true;
      fetch(FEED).then(r => (r.ok ? r.json() : null)).then(json => {
        if (!json || typeof json !== 'object') return;
        const list = Object.keys(json).filter(k => /^P\d+$/.test(k) && json[k] && typeof json[k] === 'object' && labelNames(json[k]).some(l => WEEKLY.test(l)))
          .map(k => ({ id: k, title: String(json[k].postTitle || ''), date: String(json[k].createdDate || ''), ts: stamp(json[k]), url: String(json[k].postUrl || '') }))
          .sort((a, b) => (a.ts - b.ts) || a.date.localeCompare(b.date) || (Number(a.id.slice(1)) - Number(b.id.slice(1))));
        index = list;
        try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
        done = ''; schedule();
      }).catch(() => {});
    }

    /* ---- chrome: status bar + drawer (live outside #main, shown only on weekly pages) ---- */
    let issuesPop = null, curIssue = '', capSub = null, bar = null, drawer = null, dim = null, list = null, opener = null;
    function chrome() {
      if (bar) return;
      // Capsule (2026-11-02): WEEKLY · 第 N 期 | 01 02 … (the open one shows its name; the open section's sub-heading is added) | ↑.
      // Phones show the issue-less short form: the current chapter (tap: the full contents list) and ↑. Built by capsule().
      bar = el('div', 'lk-bar'); bar.setAttribute('role', 'navigation');
      const no = el('button', 'lk-no'), chs = el('span', 'lk-chs'), sub = el('span', 'lk-sub'), cur = el('button', 'lk-cur'), up = el('button', 'lk-top');
      cur.type = 'button'; cur.setAttribute('aria-expanded', 'false'); cur.setAttribute('aria-controls', 'lkDrawer');
      up.type = 'button'; capSub = sub;
      up.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>';
      up.addEventListener('click', () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
      no.type = 'button'; no.setAttribute('aria-haspopup', 'true'); no.setAttribute('aria-expanded', 'false');
      issuesPop = el('ul', 'lk-issues'); issuesPop.hidden = true; document.body.append(issuesPop);
      no.addEventListener('click', e => { e.stopPropagation(); issues(issuesPop.hidden); });
      document.addEventListener('click', e => { if (!issuesPop.hidden && !issuesPop.contains(e.target)) issues(false); });
      addEventListener('keydown', e => { if (e.key === 'Escape' && !issuesPop.hidden) { issues(false); no.focus(); } });
      bar.append(no, chs, cur, up);
      chs.addEventListener('click', e => { const a = e.target.closest('a[data-i]'); if (!a) return; e.preventDefault(); jump(+a.dataset.i); });
      dim = el('div', 'lk-dim');
      drawer = el('nav', 'lk-drawer'); drawer.id = 'lkDrawer'; drawer.tabIndex = -1;
      const head = el('header'); head.append(el('b'), el('span'));
      list = el('ol');
      const foot = el('footer'); foot.append(el('span', 'lk-dpct'), el('span', '', 'Esc'));
      drawer.append(head, list, foot);
      document.body.append(dim, drawer, bar);
      cur.addEventListener('click', () => toggle(!drawer.classList.contains('open')));
      dim.addEventListener('click', () => toggle(false));
      addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) { e.preventDefault(); toggle(false); } }, true);
      list.addEventListener('click', e => {
        const a = e.target.closest('a[data-i]'); if (!a) return;
        e.preventDefault();
        toggle(false, true); jump(+a.dataset.i);
      });
    }
    // The "W 1" label opens the list of every weekly issue (from the feed, so new issues show up by themselves).
    function issues(open) {
      if (!issuesPop) return;
      const no = bar.querySelector('.lk-no');
      if (open) {
        issuesPop.innerHTML = '';
        index.slice().reverse().forEach(it => {
          const n = index.indexOf(it) + 1, li = el('li'), a = el('a');
          a.href = '#/article/' + it.id; if (it.id === curIssue) a.setAttribute('aria-current', 'true');
          a.append(el('b', 'lk-in', issueName(n)), el('span', '', it.title || it.id));
          a.addEventListener('click', () => issues(false));
          li.append(a); issuesPop.append(li);
        });
        if (!index.length) issuesPop.append(el('li', 'lk-none', L('还没有期刊', 'No issues yet', 'まだ号がありません')));
        const r = bar.getBoundingClientRect();
        issuesPop.style.bottom = Math.round(innerHeight - r.top + 10) + 'px';
        issuesPop.style.left = Math.round(Math.max(10, Math.min(r.left, innerWidth - 330))) + 'px';
      }
      issuesPop.hidden = !open; no.setAttribute('aria-expanded', String(open));
    }
    /* ---- f) contents card in Loon's bubble (2026-11-02). Desktop with Loon on screen (html.luliy-mascot-on): a card shaped
       like her speech bubble sits above her: one line "W 1 · 01 章名 › 小节 ⌄" (↑ stays in her button column); click opens it upwards into the issue
       switcher and every heading. While she talks the closed card steps aside for the bubble (CSS :has). It is not inside
       her aria-live bubble, so chapter changes are not read out. Without Loon the capsule (.lk-bar) is shown instead. */
    // The issue icon (2026-11-02, replaces the "W 1" text): a magazine cover; the number is in its title / aria-label.
    const ISSUE_SVG = '<svg class="lk-ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="3" y="2" width="10" height="12" rx="1.2"/><path d="M5.5 5h5M5.5 7.5h5M5.5 10h3"/></svg>';
    const issueName = n => n > 0 ? L('第 ' + n + ' 期', 'Issue ' + n, '第 ' + n + ' 号') : L('周记', 'Weekly', '週記');
    let card = null, cardLine = null, cardPanel = null, cardIss = null, cardList = null, cardSig = '';
    function cardMount() {
      const box = document.querySelector('.luliy-mascot');
      if (!box) return null;
      if (card && card.isConnected) return card;
      card = el('div', 'lk-card');
      cardPanel = el('div', 'lk-card-panel'); cardPanel.id = 'lkCardPanel';
      const ih = el('button', 'lk-card-ib'); ih.type = 'button'; ih.setAttribute('aria-expanded', 'false');
      cardIss = el('ul', 'lk-card-iss'); cardIss.hidden = true;
      cardList = el('ol', 'lk-card-list');
      cardPanel.append(ih, cardIss, cardList);
      const row = el('div', 'lk-card-row');
      cardLine = el('button', 'lk-card-line'); cardLine.type = 'button'; cardLine.setAttribute('aria-expanded', 'false'); cardLine.setAttribute('aria-controls', 'lkCardPanel');
      row.append(cardLine); card.append(cardPanel, row); // ↑ is already in her button column, so the card has none
      box.append(card);
      // Hover opens it (and leaving closes it again); a click pins it open or closes it.
      let pin = false, hovT = 0;
      const fine = matchMedia('(hover: hover) and (pointer: fine)');
      const click = e => { e.stopPropagation(); const o = card.classList.contains('open'); if (o && !pin) { pin = true; return; } pin = !o; cardToggle(!o); };
      cardLine.addEventListener('click', click);
      row.addEventListener('click', click);
      card.addEventListener('pointerenter', () => { if (!fine.matches) return; clearTimeout(hovT); if (!card.classList.contains('open')) { pin = false; cardToggle(true); } });
      card.addEventListener('pointerleave', () => { if (!fine.matches || pin) return; clearTimeout(hovT); hovT = setTimeout(() => { if (!pin) cardToggle(false); }, 280); });
      card.addEventListener('lk-unpin', () => { pin = false; }); // the strip around the ribbon (its tail, its padding) counts too
      ih.addEventListener('click', e => { e.stopPropagation(); const o = cardIss.hidden; cardIss.hidden = !o; ih.setAttribute('aria-expanded', String(o)); });
      cardList.addEventListener('click', e => {
        const tw = e.target.closest('.lk-twist');
        if (tw) { e.preventDefault(); e.stopPropagation(); const li = tw.parentElement, k = +li.dataset.ch; cardOpen.set(k, !li.classList.contains('lk-opened')); cardSubs(); return; }
        const a = e.target.closest('a[data-i]'); if (!a) return;
        e.preventDefault(); e.stopPropagation(); cardToggle(false); jump(+a.dataset.i);
        // 2026-11-07: she no longer echoes the heading that was clicked (「…」，慢慢读。)
      });
      card.addEventListener('pointerdown', e => e.stopPropagation());
      const bub = box.querySelector('.luliy-mascot-bubble'); // clicking what she is saying also opens the contents
      if (bub) bub.addEventListener('click', e => { e.stopPropagation(); cardToggle(true); });
      document.addEventListener('click', e => { if (card.classList.contains('open') && !card.contains(e.target) && !(e.target.closest && e.target.closest('[data-m="toc"]'))) cardToggle(false); });
      addEventListener('keydown', e => { if (e.key === 'Escape' && card.classList.contains('open')) { e.preventDefault(); cardToggle(false); cardLine.focus({ preventScroll: true }); } }, true);
      cardSig = '';
      return card;
    }
    function cardFit() {
      if (!card) return;
      const body = main.querySelector('.source-body'), box = card.parentElement;
      if (!body || !box) return;
      const room = Math.round(body.getBoundingClientRect().left - 14 - 8 - 16); // her left edge 14px, bubble inset 8px, some air before the text
      card.style.setProperty('--lk-card-w', Math.max(170, Math.min(280, room)) + 'px');
      const top = box.getBoundingClientRect().top, head = document.querySelector('#header');
      const hb = head ? Math.max(0, head.getBoundingClientRect().bottom) : 0;
      const rowH = (card.querySelector('.lk-card-row') || {}).offsetHeight || 56;
      card.style.setProperty('--lk-card-max', Math.max(160, Math.round(top - hb - rowH - 40)) + 'px'); // the open page stops below the top bar
    }
    function cardToggle(open) {
      if (!card) return;
      if (open === undefined) open = !card.classList.contains('open');
      if (open) { cardIssues(); cardFill(); cardFit(); }
      card.classList.toggle('open', open);
      cardLine.setAttribute('aria-expanded', String(open));
      if (!open) { cardOpen.clear(); cardIss.hidden = true; card.querySelector('.lk-card-ib').setAttribute('aria-expanded', 'false'); card.dispatchEvent(new Event('lk-unpin')); }
      else { const c = cardList.querySelector('[aria-current]'); if (c) c.scrollIntoView({ block: 'nearest' }); }
    }
    window.LuliyWeeklyCard = { toggle: () => { if (cardMount()) cardToggle(); } };
    function cardIssues() {
      const ipos = index.findIndex(x => x.id === curIssue);
      const ih = card.querySelector('.lk-card-ib');
      ih.innerHTML = ISSUE_SVG + '<span>' + issueName(ipos + 1) + '</span><i aria-hidden="true">⌄</i>'; ih.title = L('全部期刊', 'All issues', '全ての号');
      cardIss.innerHTML = '';
      index.slice().reverse().forEach(it => {
        const n = index.indexOf(it) + 1, li = el('li'), a = el('a');
        a.href = '#/article/' + it.id; if (it.id === curIssue) a.setAttribute('aria-current', 'true');
        a.append(el('b', 'lk-in', issueName(n)), el('span', '', it.title || it.id));
        a.addEventListener('click', () => cardToggle(false)); // no 「翻到第N期了」 either
        li.append(a); cardIss.append(li);
      });
    }
    // The row shows its own "01", so a leading "一、" / "第一章" / "1." in the chapter name is dropped (display only).
    // Contents show names without the writer's own numbering (「一、」「第一章」「1.」「(1)」); the article itself keeps it.
    const tName = h => { const t = hText(h), u = t.replace(/^(?:第?[一二三四五六七八九十百零〇]+[、.．:：章节節部]|[（(]?\d{1,2}[)）]|\d{1,2}(?:\.\d{1,2})+(?:[、.．:：)）]|(?=\s))|\d{1,2}[、.．:：)）](?!\d))\s*/, ''); return u || t; };
    const cardOpen = new Map(); // chapter → true/false when the reader opened or shut it by hand
    function cardSubs() { // sub-sections show only under the chapter being read, or under one opened by hand
      if (!cardList) return;
      const c = current(); let ch = c; while (ch > 0 && heads[ch] && heads[ch].dataset.lkLevel !== '1') ch--;
      let num = 0; for (let i = 0; i <= ch && i < heads.length; i++) if (heads[i].dataset.lkLevel === '1') num++;
      ch = num; // the chapter's number (the rows are keyed by it)
      cardList.querySelectorAll('li').forEach(li => {
        if (!li.classList.contains('lk-child')) return;
        const k = +li.dataset.ch, on = k === -1 || (cardOpen.has(k) ? cardOpen.get(k) : k === ch);
        li.classList.toggle('lk-show', on);
      });
      cardList.querySelectorAll('li.lk-has-sub').forEach(li => {
        const k = +li.dataset.ch, on = cardOpen.has(k) ? cardOpen.get(k) : k === ch, b = li.querySelector('.lk-twist');
        li.classList.toggle('lk-opened', on); if (b) b.setAttribute('aria-expanded', String(on));
      });
    }
    function cardFill() {
      if (!card) return;
      const sig = heads.map(h => h.dataset.lkLevel + hText(h)).join('|');
      if (sig !== cardSig) {
        cardSig = sig; cardList.innerHTML = ''; cardOpen.clear(); let n = 0, last = null;
        heads.forEach((h, i) => {
          const one = h.dataset.lkLevel === '1', li = el('li'), a = el('a', one ? '' : 'l2');
          a.href = '#'; a.dataset.i = i;
          if (one) { a.append(el('b', '', String(++n).padStart(2, '0'))); li.dataset.ch = n; last = li; }
          else { li.classList.add('lk-child'); li.dataset.ch = last ? last.dataset.ch : -1; if (last && !last.classList.contains('lk-has-sub')) {
            last.classList.add('lk-has-sub'); const b = el('button', 'lk-twist'); b.type = 'button'; b.setAttribute('aria-label', L('展开小节', 'Show sections', '小見出しを開く')); b.setAttribute('aria-expanded', 'false'); b.textContent = '⌄'; last.append(b); } }
          a.append(el('span', '', tName(h))); li.style.setProperty('--i', i); li.prepend(a); cardList.append(li);
        });
        if (!heads.length) cardList.append(el('li', 'lk-none', L('这篇没有小标题', 'No headings in this article', '見出しはありません')));
      }
      cardSubs();
    }
    function cardNow() {
      if (!cardMount()) return;
      const c = current();
      let ch = c; while (ch > 0 && heads[ch] && heads[ch].dataset.lkLevel !== '1') ch--;
      let num = 0; for (let i = 0; i <= ch && i < heads.length; i++) if (heads[i].dataset.lkLevel === '1') num++;
      const ipos = index.findIndex(x => x.id === curIssue);
      const chName = heads[ch] && heads[ch].dataset.lkLevel === '1' ? tName(heads[ch]) : '';
      const hc = heads[c], subName = hc && hc.dataset.lkLevel === '2' ? hText(hc) : '';
      // 2026-11-07: the closed bubble is a row of ticks (one per heading, the current one lit) over "02 章名 · 小节".
      cardLine.innerHTML = '';
      const tk = el('span', 'lk-tk');
      // many headings → chapters only (one tick each), so the row stays short; the lit one is the chapter being read
      const many = heads.length > 10 && heads.some(h => h.dataset.lkLevel === '1');
      heads.forEach((h, i) => { const one = h.dataset.lkLevel === '1'; if (many && !one) return; tk.append(el('i', (one ? 'l1' : 'l2') + ((many ? i === ch : i === c) ? ' on' : ''))); });
      if (heads.length) cardLine.append(tk);
      // only the heading being read, written out in full (it may wrap)
      const now = el('span', 'lk-now');
      now.append(el('span', 'lk-cl-ch', hc ? tName(hc) : L('目录', 'Contents', '目次')));
      cardLine.append(now);
      cardLine.setAttribute('aria-label', issueName(ipos + 1) + ' · ' + L('目录：', 'Contents: ', '目次：') + (chName || '') + (subName ? ' › ' + subName : ''));
      cardList.querySelectorAll('a[data-i]').forEach(a => { if (+a.dataset.i === c) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      if (!card.classList.contains('open')) { cardSubs(); cardFit(); }
    }
    const lcToggle = h => { const sec = h.parentElement, o = !sec.classList.contains('lc-open'); sec.classList.toggle('lc-open', o); h.setAttribute('aria-expanded', String(o)); };
    document.addEventListener('click', e => { const h = e.target.closest && e.target.closest('html.lk-weekly .luliy-comments > h2'); if (h) lcToggle(h); });
    document.addEventListener('keydown', e => { const h = e.target.closest && e.target.closest('html.lk-weekly .luliy-comments > h2'); if (h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); lcToggle(h); } });
    function jump(i) {
      const h = heads[i];
      if (h) { const y = h.getBoundingClientRect().top + scrollY - (innerWidth <= 700 ? 84 : 120); scrollTo({ top: Math.max(0, y), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
    }
    const hText = h => { const c = h.cloneNode(true); c.querySelectorAll('button, .reader-heading-link, svg').forEach(n => n.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); };
    let capSig = '';
    function capsule() {
      if (!bar) return;
      const sig = heads.map(h => h.dataset.lkLevel + hText(h)).join('|') + '#' + (index.length);
      if (sig === capSig) return;
      capSig = sig;
      const chs = bar.querySelector('.lk-chs'); chs.innerHTML = '';
      let n = 0;
      heads.forEach((h, i) => {
        if (h.dataset.lkLevel !== '1') return;
        n++;
        const a = el('a'); a.href = '#'; a.dataset.i = i; a.dataset.ch = i;
        const num = el('span', 'lk-n', String(n).padStart(2, '0')), nm = el('span', 'lk-nm', tName(h));
        a.append(num, nm); a.title = tName(h); chs.append(a);
      });
      bar.classList.toggle('lk-nochap', !n);
    }
    function capsuleNow() {
      if (!bar) return;
      const c = current();
      let ch = c; while (ch > 0 && heads[ch] && heads[ch].dataset.lkLevel !== '1') ch--;
      const sub = capSub, cur = bar.querySelector('.lk-cur');
      let num = 0;
      bar.querySelectorAll('.lk-chs a').forEach(a => { const on = +a.dataset.ch === ch && heads[ch] && heads[ch].dataset.lkLevel === '1'; a.classList.toggle('act', on); if (on) { a.setAttribute('aria-current', 'true'); num = +a.querySelector('.lk-n').textContent; } else a.removeAttribute('aria-current'); });
      const hc = heads[c], isSub = hc && hc.dataset.lkLevel === '2';
      const actA = bar.querySelector('.lk-chs a.act'); if (actA && sub.parentNode !== actA) actA.append(sub); // inside the coloured pill, after the chapter name
      sub.textContent = isSub ? tName(hc) : ''; sub.classList.toggle('on', !!isSub);
      const chName = heads[ch] && heads[ch].dataset.lkLevel === '1' ? tName(heads[ch]) : '';
      cur.textContent = hc ? tName(hc) : (chName || L('目录', 'Contents', '目次')); // the heading being read, in full
    }
    let heads = [];
    function toggle(open, noFocus) {
      if (!drawer) return;
      if (open) { opener = document.activeElement; fillList(); }
      drawer.classList.toggle('open', open); dim.classList.toggle('open', open);
      bar.querySelector('.lk-cur').setAttribute('aria-expanded', String(open));
      root.classList.toggle('lk-drawer-open', open);
      if (open) { const cur = list.querySelector('a[aria-current]') || list.querySelector('a'); setTimeout(() => (cur || drawer).focus({ preventScroll: true }), 40); if (cur) cur.scrollIntoView({ block: 'nearest' }); }
      else if (!noFocus && opener && opener.focus) opener.focus({ preventScroll: true });
    }
    function current() { let c = 0; heads.forEach((h, i) => { if (h.getBoundingClientRect().top < 160) c = i; }); return c; }
    function fillList() {
      const c = current();
      list.innerHTML = '';
      heads.forEach((h, i) => {
        const li = el('li'), a = el('a', h.dataset.lkLevel === '2' ? 'l2' : '');
        a.href = '#'; a.dataset.i = i; a.textContent = tName(h);
        if (i === c) a.setAttribute('aria-current', 'true');
        li.append(a); list.append(li);
      });
      if (!heads.length) { const li = el('li', 'lk-none', L('这篇没有小标题', 'No headings in this article', '見出しはありません')); list.append(li); }
    }
    let minutes = 0;
    function progress() {
      if (!bar || !root.classList.contains('lk-weekly')) return;
      capsule(); capsuleNow(); if (cardMount()) { cardFill(); cardNow(); }
      if (drawer.classList.contains('open')) {
        const body = main.querySelector('.source-body');
        let p = 1;
        if (body) { const r = body.getBoundingClientRect(), total = r.height - innerHeight * .6; p = total > 0 ? Math.min(1, Math.max(0, (-r.top + innerHeight * .4) / total)) : 1; }
        drawer.querySelector('.lk-dpct').textContent = L('已读 ', 'Read ', '既読 ') + Math.round(p * 100) + '%';
      }
    }

    /* ---- c) decorate one article ---- */
    const meaningfulAlt = a => !!a && a.length > 1 && !/^(image|img|圖片|图片|screenshot)$/i.test(a) && !/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(a);
    function decorate(shell, id) {
      const body = shell.querySelector('.source-body'), h1 = shell.querySelector(':scope > h1'), meta = shell.querySelector('.source-meta');
      if (!body || !h1) return false;
      const pos = index.findIndex(x => x.id === id), no = pos >= 0 ? pos + 1 : 0;
      // kicker
      let kick = shell.querySelector(':scope > .lk-kick');
      if (!kick) { kick = el('p', 'lk-kick'); h1.before(kick); }
      // 2026-11-07: the kicker names the post's own GitHub labels (all of them, as written; pinned is internal); an issue adds its number
      kick.textContent = (labelLine(id, shell) || (root.classList.contains('lk-study') ? L('学习', 'STUDY', '学習') : root.classList.contains('lk-essay') ? L('随笔', 'ESSAY', '随筆') : 'WEEKLY')) + (no ? ' · ' + L('第 ' + no + ' 期', 'No. ' + no, '第 ' + no + ' 号') : '');
      // cover (2026-11-06): an image that opens the article (no text before it) becomes a full-width cover above the
      // issue line; the image leaves the body. No such image: nothing is added and the page is as before.
      (() => {
        let cov = shell.previousElementSibling && shell.previousElementSibling.classList.contains('lk-cover') ? shell.previousElementSibling : null;
        if (cov && cov.dataset.id !== id) { cov.remove(); cov = null; }
        if (cov) return;
        const box = body.querySelector('.markdown-body') || body;
        let img = null;
        for (const n of box.children) {
          if (n.classList.contains('lk-cover-src')) { img = null; break; }
          if (n.matches('blockquote, .lk-stand')) continue; // the > standfirst may come before the cover
          const i = n.matches('img') ? n : n.querySelector('img');
          if (i) { img = i; break; }
          if (n.textContent.trim()) break;
        }
        const src = img && img.getAttribute('src');
        if (!src) { shell.classList.remove('lk-cov'); return; }
        const fig = el('figure', 'lk-cover'), im = document.createElement('img');
        fig.dataset.id = id; im.src = src; im.alt = img.getAttribute('alt') || ''; im.decoding = 'async'; im.referrerPolicy = 'no-referrer';
        fig.append(im); shell.before(fig);
        shell.classList.add('lk-cov');
        const blk = img.closest('p') && img.closest('p').textContent.trim() === '' ? img.closest('p') : img;
        blk.classList.add('lk-cover-src');
      })();
      // byline
      if (!shell.querySelector(':scope > .lk-by') && meta) {
        const by = el('div', 'lk-by'), l = el('span'), r = el('span');
        l.append(el('b', '', 'LULIY'));
        const time = meta.querySelector('time');
        if (time) { const d = el('span', 'lk-date'); d.dataset.iso = time.textContent.trim(); r.append(d); }
        r.append(el('span', 'lk-rt'));
        const share = meta.querySelector('.source-share');
        if (share) { const b = el('button', 'lk-share', L('分享', 'Share', '共有')); b.type = 'button'; b.addEventListener('click', () => share.click()); r.append(b); }
        by.append(l, r); meta.after(by);
      }
      // date (2026-11-02): 2026年10月4日 in Chinese and Japanese, OCT 4, 2026 in English
      const dEl = shell.querySelector(':scope > .lk-by .lk-date');
      if (dEl) {
        const g = /^(\d{4})\D(\d{1,2})\D(\d{1,2})/.exec(dEl.dataset.iso || '');
        dEl.textContent = !g ? dEl.dataset.iso : /^en/.test(root.lang)
          ? ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][+g[2] - 1] + ' ' + (+g[3]) + ', ' + g[1]
          : g[1] + '年' + (+g[2]) + '月' + (+g[3]) + '日';
      }
      if (shell.classList.contains('lk-cov') && dEl && dEl.textContent) kick.textContent += ' · ' + dEl.textContent;
      fitTitle(h1);
      fitNumber(shell);
      const rt = meta && meta.querySelector('#sourceReadingTime'), mm = rt && rt.textContent.match(/(\d+)\s*(?:分|min)/i);
      minutes = mm ? +mm[1] : Math.max(1, Math.round(body.textContent.replace(/\s+/g, '').length / 400));
      const rts = shell.querySelector(':scope > .lk-by .lk-rt');
      if (rts) rts.textContent = L('约 ' + minutes + ' 分钟', minutes + ' min', '約 ' + minutes + ' 分');
      const sig = id + ':' + body.childElementCount + ':' + body.textContent.length;
      if (body.dataset.lkDone === sig) return true;
      if (!body.textContent.trim()) return false;
      // drop cap: the first block is a paragraph of text
      const first = body.firstElementChild && body.firstElementChild.matches('.markdown-body') ? body.firstElementChild : body;
      // standfirst (2026-11-02): a quote that opens the article (`> 這期寫……`, at most 200 characters) moves up under
      // the title as one line of introduction; the quote itself is hidden. No opening quote, no standfirst.
      const lead = [...first.children].find(n => !n.classList.contains('lk-cover-src') && (n.textContent.trim() || n.querySelector('img,video,iframe')));
      let stand = shell.querySelector(':scope > .lk-stand');
      const st = lead && lead.tagName === 'BLOCKQUOTE' && !lead.querySelector('img,video,iframe,pre,ul,ol,table') ? lead.textContent.replace(/\s+/g, ' ').trim() : '';
      if (st && st.length <= 200) {
        lead.classList.add('lk-stand-src');
        if (!stand) { stand = el('p', 'lk-stand'); h1.after(stand); }
        if (stand.textContent !== st) stand.textContent = st;
      } else if (stand) stand.remove();
      const firstBlock = [...first.children].find(n => !/^(H[1-6]|HR)$/.test(n.tagName) && !n.classList.contains('lk-stand-src') && n.textContent.trim());
      if (firstBlock && firstBlock.tagName === 'P' && !firstBlock.querySelector('img,video,iframe') && /^[「『“"(（]?[\p{L}\p{N}]/u.test(firstBlock.textContent.trim()) && firstBlock.textContent.trim().length > 20) firstBlock.classList.add('lk-first');
      // pull quotes
      body.querySelectorAll('blockquote').forEach(q => {
        if (q.closest('.markdown-alert') || q.parentElement.closest('blockquote') || q.classList.contains('lk-stand-src')) return;
        const ps = q.querySelectorAll(':scope > p'), t = q.textContent.trim();
        if (q.children.length === ps.length && ps.length === 1 && t.length && t.length <= 90) q.classList.add('lk-pull');
      });
      // captions from alt text
      body.querySelectorAll('img').forEach(img => {
        const alt = (img.getAttribute('alt') || '').trim();
        if (!meaningfulAlt(alt) || img.closest('a.lk-capd, figure')) return;
        const host = img.closest('p') && img.closest('p').textContent.trim() === '' ? img.closest('p') : img;
        if (host.nextElementSibling && host.nextElementSibling.classList.contains('lk-cap')) return;
        const cap = el(host === img ? 'span' : 'p', 'lk-cap', alt); host.after(cap);
      });
      // end mark
      const blocks = [...first.children].filter(n => n.textContent.trim() || n.querySelector('img'));
      const last = blocks[blocks.length - 1];
      if (last && last.tagName === 'P' && !last.querySelector('.lk-end')) { const s = el('span', 'lk-end'); s.setAttribute('aria-hidden', 'true'); last.append(s); }
      // headings for the drawer: the top two levels used in the article
      const hs = [...body.querySelectorAll('h1,h2,h3,h4')].filter(h => h.textContent.trim());
      const lv = [...new Set(hs.map(h => +h.tagName[1]))].sort((a, b) => a - b).slice(0, 2);
      heads = hs.filter(h => lv.includes(+h.tagName[1]));
      heads.forEach(h => { h.dataset.lkLevel = +h.tagName[1] === lv[0] ? '1' : '2'; });
      body.dataset.lkDone = sig;
      return true;
    }
    function series(shell, id) {
      const pos = index.findIndex(x => x.id === id);
      let nav = shell.querySelector('.lk-pn');
      if (pos < 0) { if (nav) nav.remove(); return; }
      const key = id + ':' + index.length;
      if (nav && nav.dataset.key === key) return;
      if (nav) nav.remove();
      nav = el('nav', 'lk-pn'); nav.dataset.key = key; nav.setAttribute('aria-label', L('上一期与下一期', 'Previous and next issue', '前号と次号'));
      const mk = (it, n, cls, lab) => { const a = el('a', cls); a.href = '#/article/' + it.id; const s = el('small', '', lab + ' · ' + L('第 ' + n + ' 期', 'No. ' + n, '第 ' + n + ' 号')); a.append(s, el('b', '', it.title)); return a; };
      nav.append(pos > 0 ? mk(index[pos - 1], pos, 'pv', L('← 上一期', '← Previous', '← 前号')) : el('span'));
      nav.append(pos < index.length - 1 ? mk(index[pos + 1], pos + 2, 'nx', L('下一期 →', 'Next →', '次号 →')) : el('span'));
      const nx = nav.querySelector('.nx');
      if (nx) {
        nx.querySelector('small').textContent = L('下期预告', 'Next issue', '次号予告') + ' · ' + L('第 ' + (pos + 2) + ' 期', 'No. ' + (pos + 2), '第 ' + (pos + 2) + ' 号');
        issueCover(index[pos + 1]).then(src => {
          if (!src || !nx.isConnected || nx.querySelector('img')) return;
          const im = document.createElement('img'); im.src = src; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async'; im.referrerPolicy = 'no-referrer';
          im.addEventListener('error', () => { im.remove(); nx.classList.remove('lk-has-img'); });
          nx.prepend(im); nx.classList.add('lk-has-img');
        });
      }
      const body = shell.querySelector('.source-body');
      if (body) body.after(nav); else (shell.querySelector(':scope > .source-end') || shell.lastElementChild).before(nav);
    }

    /* ---- 往期 (2026-11-06) ----
       a) 纸角: on the desk papers (b, g; desktop) the neighbouring issues lie under the sheet: a thin edge shows along
          its side and an index tab with the issue number sticks out near the top (previous on the left, next on the
          right). Hover pulls the tab out with the title; Loon names it; a click (or ← / →) opens it.
       b) 下期预告: after the article, the next issue as a card with its cover (fetched once, its opening image). */
    function stack(shell, id) {
      const pos = index.findIndex(x => x.id === id), key = id + ':' + index.length + ':' + root.lang;
      let st = shell.querySelector(':scope > .lk-stack');
      if (st && st.dataset.key === key) return;
      if (st) st.remove();
      if (pos < 0 || index.length < 2) return;
      st = el('div', 'lk-stack'); st.dataset.key = key;
      const mk = (it, n, side) => {
        const a = el('a', 'lk-under ' + side); a.href = '#/article/' + it.id;
        const lab = side === 'pv' ? L('上一期', 'Previous issue', '前号') : L('下一期', 'Next issue', '次号');
        a.setAttribute('aria-label', lab + ' · ' + issueName(n) + ' · ' + (it.title || it.id));
        const tab = el('span', 'lk-tab'); tab.append(el('b', '', String(n).padStart(2, '0')));
        const tip = el('span', 'lk-tip'); tip.append(el('small', '', lab), el('span', '', it.title || it.id));
        a.append(tab, tip);
        // the tip beside the tab already names the issue; Loon does not read it out too
        return a;
      };
      if (pos > 0) st.append(mk(index[pos - 1], pos, 'pv'));
      if (pos < index.length - 1) st.append(mk(index[pos + 1], pos + 2, 'nx'));
      shell.prepend(st);
    }
    // The cover of another issue: the opening image of its post (same rule as this page's cover). Cached per session.
    const coverCache = {};
    function issueCover(it) {
      if (coverCache[it.id]) return coverCache[it.id];
      let hit = null; try { hit = sessionStorage.getItem('lk-cover-' + it.id); } catch (e) {}
      if (hit !== null) return (coverCache[it.id] = Promise.resolve(hit));
      const name = (it.url || '').split('/').pop();
      if (!/^[\w.-]+\.html$/.test(name) || typeof fetch !== 'function') return Promise.resolve('');
      return (coverCache[it.id] = fetch(FEED.replace(/postList\.json$/, 'post/' + name)).then(r => (r.ok ? r.text() : '')).then(html => {
        const doc = new DOMParser().parseFromString(html || '', 'text/html');
        const box = doc.querySelector('#postBody') || doc.body;
        let src = '';
        for (const n of (box ? box.children : [])) {
          if (n.matches('blockquote')) continue;
          const i = n.matches('img') ? n : n.querySelector('img');
          if (i) { src = i.getAttribute('src') || ''; break; }
          if (n.textContent.trim()) break;
        }
        if (!/^https?:\/\//.test(src)) src = '';
        src = src.replace(/^https:\/\/camo\.githubusercontent\.com\/(?=[0-9a-f]{20})/i, location.origin + '/gh/camo/'); // same proxy the site uses
        try { sessionStorage.setItem('lk-cover-' + it.id, src); } catch (e) {}
        return src;
      }).catch(() => ''));
    }
    addEventListener('keydown', e => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.isComposing) return;
      if (!root.classList.contains('lk-weekly') || !/^Arrow(Left|Right)$/.test(e.key)) return;
      const t = e.target;
      if (t && t !== document.body && t !== document.documentElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A|IFRAME)$/.test(t.tagName) || t.closest('pre, [role="dialog"], .lk-card'))) return;
      const a = main.querySelector('.lk-stack .lk-under.' + (e.key === 'ArrowLeft' ? 'pv' : 'nx'));
      if (a) { e.preventDefault(); location.hash = a.getAttribute('href'); }
    });

    /* ---- apply ---- */
    let done = '', frame = 0;
    /* 2026-11-07: the weekly panel for every piece of writing. Articles whose labels are not ones that keep their own
       layout (AI, Study, Doc, Guidebook — sections 37/38 — and the data posts) get the same magazine page, without the
       issue parts (no number, no issue switcher, no neighbouring issues). html.lk-essay marks them. */
    function labelLine(id, shell) {
      let ls = null;
      try { ls = (JSON.parse(localStorage.getItem('luliy-label-map-v1') || '{}') || {})[id]; } catch (e) {}
      if (!Array.isArray(ls)) { const c = shell && shell.querySelector('.source-category'); ls = c ? c.textContent.split(/[·,/|]/).map(x => x.trim()).filter(Boolean) : []; }
      return ls.filter(l => l && !/^pinned$/i.test(l)).join(' · ');
    }
    const OWN = /^(ai|doc|guidebook|chronicle-data|timeline)$/i;   // 2026-11-07: Study joins (its notebook parts stay, section 37)
    function essay(id, shell) {
      let ls = null;
      try { ls = (JSON.parse(localStorage.getItem('luliy-label-map-v1') || '{}') || {})[id]; } catch (e) {}
      if (!Array.isArray(ls)) { const c = shell.querySelector('.source-category'); ls = c ? c.textContent.split(/[·,/|]/).map(x => x.trim()).filter(Boolean) : []; }
      if (ls.some(l => OWN.test(l))) return '';
      return ls.some(l => /^study$/i.test(l)) ? 'study' : ls.some(l => /^(library|讀書|读书)$/i.test(l)) ? 'read' : 'essay'; // 2026-11-07: 讀書 = Library (the book posts; 書房 and the blog's bookshelf use the same label)
    }
    function apply() {
      frame = 0;
      const m = /^#\/article\/(P\d+)(?:[?#/]|$)/.exec(location.hash || '');
      const shell = m && main.querySelector('.source-reading');
      const cat = shell && shell.querySelector('.source-category');
      const issue = !!(shell && ((cat && WEEKLY.test(cat.textContent)) || index.some(x => x.id === m[1])));
      const on = issue || !!(shell && essay(m[1], shell));
      const kind = !issue && shell ? essay(m[1], shell) : '';
      root.classList.toggle('lk-essay', on && !issue);
      root.classList.toggle('lk-study', on && kind === 'study');
      root.classList.toggle('lk-read', on && kind === 'read');
      if (!on) {
        if (root.classList.contains('lk-weekly')) { root.classList.remove('lk-weekly'); toggle(false, true); }
        paperButton(false); glow();
        done = ''; return;
      }
      loadIndex(); chrome();
      root.classList.add('lk-weekly');
      paper(); paperButton(true);
      bar.setAttribute('aria-label', L('阅读进度', 'Reading progress', '読書の進み具合'));
      drawer.setAttribute('aria-label', L('本文目录', 'Contents', '本文の目次'));
      const up = bar.querySelector('.lk-top'); up.setAttribute('aria-label', L('回到顶部', 'Back to top', 'ページの先頭へ')); up.title = up.getAttribute('aria-label');
      const key = m[1] + ':' + index.length + ':' + root.lang;
      const ipos = index.findIndex(x => x.id === m[1]);
      if (ipos >= 0) shell.dataset.lkNo = String(ipos + 1).padStart(2, '0'); else delete shell.dataset.lkNo;
      curIssue = m[1]; bar.querySelector('.lk-no').innerHTML = ISSUE_SVG; bar.querySelector('.lk-no').setAttribute('aria-label', issueName(ipos + 1) + ' · ' + L('全部期刊', 'All issues', '全ての号'));
      bar.querySelector('.lk-no').title = issueName(ipos + 1);
      if (decorate(shell, m[1])) {
        series(shell, m[1]); stack(shell, m[1]);
        drawer.querySelector('header b').textContent = shell.querySelector(':scope > h1').textContent.trim();
        const pos = index.findIndex(x => x.id === m[1]);
        drawer.querySelector('header span').textContent = (labelLine(curIssue, main.querySelector('.source-reading')) || (root.classList.contains('lk-study') ? L('学习', 'STUDY', '学習') : root.classList.contains('lk-essay') ? L('随笔', 'ESSAY', '随筆') : 'WEEKLY')) + (pos >= 0 ? ' · ' + L('第 ' + (pos + 1) + ' 期', 'No. ' + (pos + 1), '第 ' + (pos + 1) + ' 号') : '') + ' · LULIY';
        done = key;
      }
      glow();
      const byEl = shell.querySelector(':scope > .lk-by');
      const lcm = main.querySelector('.luliy-comments > h2'); // comments are folded on weekly pages (click 評論 to open)
      if (lcm && !lcm.hasAttribute('aria-expanded')) { lcm.setAttribute('role', 'button'); lcm.tabIndex = 0; lcm.setAttribute('aria-expanded', 'false'); }
      const rsm = shell.querySelector(':scope > .reader-resume'); // the site's 继续上次阅读 link is added before the byline; keep it under it
      if (byEl && rsm && byEl.nextElementSibling !== rsm) byEl.after(rsm);
      if (byEl) { if (ipos >= 0) byEl.dataset.lkNo = String(ipos + 1).padStart(2, '0'); else delete byEl.dataset.lkNo; }
      progress();
    }
    /* ---- e) paper (2026-11-02): four backgrounds, html.lk-p-<id> (home-fixes.css 36 g). The default is an (紙紋 + 期號);
       Loon's button column on weekly pages gets one more button that cycles them, and she says the name. The choice
       is kept in localStorage luliy-weekly-paper. Phones have no Loon, so they show the chosen (or default) paper. */
    const PAPERS = [
      ['g', '封面光', 'Cover glow', 'カバーの光'],
      ['b', '桌上的一本杂志', 'A magazine on a desk', '机の上の雑誌'],
      ['an', '纸纹＋期号', 'Grain + issue number', '紙の質感＋号数']
    ];
    const PKEY = 'luliy-weekly-paper';
    const paperNow = () => { let v = ''; try { v = localStorage.getItem(PKEY) || ''; } catch (e) {} return PAPERS.some(x => x[0] === v) ? v : 'g'; };
    function paper(v) {
      v = v || paperNow();
      // g is b (the magazine on a desk) plus the cover's light on the desk, so it carries both classes.
      PAPERS.forEach(x => root.classList.toggle('lk-p-' + x[0], x[0] === v || (x[0] === 'b' && v === 'g')));
      glow();
    }
    /* 封面光 (2026-11-06): the issue's cover, blurred and dimmed, lights the desk on both sides of the sheet (desktop;
       CSS hides it on phones). One fixed layer inside .page-above, under the content. No cover: no layer, plain desk. */
    let glowEl = null;
    function glow() {
      const img = root.classList.contains('lk-weekly') && root.classList.contains('lk-p-g') && main.querySelector('.lk-cover img');
      const src = img && img.getAttribute('src');
      const host = document.querySelector('.page-above');
      if (!src || !host) { if (glowEl) { glowEl.remove(); glowEl = null; } return; }
      if (!glowEl) { glowEl = el('div', 'lk-glow'); glowEl.setAttribute('aria-hidden', 'true'); }
      if (glowEl.dataset.src !== src) { glowEl.dataset.src = src; glowEl.style.backgroundImage = 'url("' + src.replace(/"/g, '%22') + '")'; }
      if (glowEl.parentElement !== host) host.prepend(glowEl);
    }
    let pbtn = null;
    function paperButton(on) {
      const tools = document.querySelector('.luliy-mascot .luliy-mascot-tools');
      if (!on || !tools) { if (pbtn) { pbtn.remove(); pbtn = null; } return; }
      if (!pbtn) {
        pbtn = document.createElement('button'); pbtn.type = 'button'; pbtn.dataset.m = 'paper';
        pbtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h6M9 18h3"/></svg>';
        pbtn.addEventListener('click', () => {
          const i = PAPERS.findIndex(x => x[0] === paperNow()), next = PAPERS[(i + 1) % PAPERS.length];
          try { localStorage.setItem(PKEY, next[0]); } catch (e) {}
          paper(next[0]);
          const name = L(next[1], next[2], next[3]);
          if (window.LuliyLoonSay) window.LuliyLoonSay(L('换成「', 'Paper: ', '紙を「') + name + L('」了。', '.', '」に。'), 2600);
          pbtn.title = L('换纸张', 'Change paper', '紙を変える') + ' · ' + name;
        });
      }
      const cur = PAPERS.find(x => x[0] === paperNow());
      pbtn.setAttribute('aria-label', L('换纸张', 'Change paper', '紙を変える'));
      pbtn.title = pbtn.getAttribute('aria-label') + ' · ' + L(cur[1], cur[2], cur[3]);
      const hide = tools.querySelector('[data-m="hide"]');
      if (pbtn.parentElement !== tools) tools.insertBefore(pbtn, hide);
    }
    /* The issue title stays on one line (2026-11-02): white-space nowrap, and the font shrinks until it fits the
       column, down to 60% of its normal size; a title still too long after that wraps as before. Re-fitted on resize. */
    function fitTitle(h1) {
      if (!h1) return;
      const k = h1.textContent + '|' + (h1.parentElement ? h1.parentElement.clientWidth : 0) + '|' + (document.fonts ? document.fonts.status : '');
      if (h1.dataset.lkFit === k) return;
      h1.classList.add('lk-fit'); h1.style.fontSize = '';
      const w = h1.clientWidth; if (!w) return;
      h1.dataset.lkFit = k;
      const base = parseFloat(getComputedStyle(h1).fontSize), need = h1.scrollWidth;
      if (need <= w + 1) return;
      const size = Math.floor(base * w / need * 0.98 * 10) / 10;
      if (size >= base * 0.6) h1.style.fontSize = size + 'px';
      else { h1.classList.remove('lk-fit'); h1.style.fontSize = (base * 0.6).toFixed(1) + 'px'; }
    }
    /* The issue number is as tall as the block above the double rule (kicker → rule), so the text reads centred on it
       vertically; horizontally it stays at the right. Set on .lk-by as --lk-num-size (digit height ≈ .72em). */
    function fitNumber(shell) {
      const by = shell && shell.querySelector(':scope > .lk-by'), kick = shell && shell.querySelector(':scope > .lk-kick');
      if (!by || !kick) return;
      const d = by.getBoundingClientRect().top - kick.getBoundingClientRect().top;
      if (d > 40) by.style.setProperty('--lk-num-size', Math.round(Math.max(90, Math.min(300, d / 0.72))) + 'px');
    }
    let fitQ = 0;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { const h = main.querySelector('.source-reading > h1'); if (h && root.classList.contains('lk-weekly')) { delete h.dataset.lkFit; fitTitle(h); fitNumber(main.querySelector('.source-reading')); } });
    addEventListener('resize', () => { if (!fitQ) fitQ = requestAnimationFrame(() => { fitQ = 0; if (root.classList.contains('lk-weekly')) { const sh = main.querySelector('.source-reading'); fitTitle(sh && sh.querySelector(':scope > h1')); fitNumber(sh); cardFit(); } }); }, { passive: true });
    // 1 → 一, 10 → 十, 12 → 十二, 20 → 二十, 105 → 一百零五 (issue numbers on the phone status bar).
    function cnNum(n) {
      const D = '零一二三四五六七八九';
      if (n < 10) return D[n];
      if (n < 20) return '十' + (n % 10 ? D[n % 10] : '');
      if (n < 100) return D[Math.floor(n / 10)] + '十' + (n % 10 ? D[n % 10] : '');
      if (n < 1000) { const r = n % 100; return D[Math.floor(n / 100)] + '百' + (!r ? '' : r < 10 ? '零' + D[r] : r < 20 ? '一' + cnNum(r) : cnNum(r)); }
      return String(n);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(apply); };
    (window.__lkSettle = window.__lkSettle || []).push(apply); // section 45 runs it at once when an article arrives
    new MutationObserver(schedule).observe(main, { childList: true, subtree: true });
    addEventListener('hashchange', schedule);
    addEventListener('scroll', () => { if (root.classList.contains('lk-weekly')) progress(); }, { passive: true });
    addEventListener('resize', progress);
    new MutationObserver(schedule).observe(root, { attributes: true, attributeFilter: ['lang'] });
    schedule();
  })();


  /* 37. Article styles by label (2026-11-01): 隨筆 musings · 成長 growth (also 成长 / 成長) · 學習 study · AI ai.
     Blog articles (#/article/Pxx) only; `weekly` wins (section 36), then ai > study > doc > guidebook > growth > musings.
     Loon stays. doc / guidebook only get their class here; section 38 builds them.
     html.ls-on plus ls-musings / ls-growth / ls-study / ls-ai (home-fixes.css 37). Labels come from the feed
     (cached in localStorage luliy-label-map-v1) or, before it arrives, from the category line on the page.
     a) Every style: its own head (eyebrow, meta line with date, reading time and 分享) instead of the orange row;
        no article artwork (and no background hint from Loon).
     b) 隨筆 / 成長 (夜讀手稿): stars dimmed, centred title with a gold hand-drawn line, short one-paragraph quotes in
        gold, --- as a small gold leaf, a signature at the end. 成長 adds the season in gold script and the week.
        Loon quotes the first gold line after ~9 s and says goodnight at the end.
     c) 學習 (夜間筆記本): squared paper behind the text, **bold** as a gold marker, GitHub alerts as 筆記 / 例子 /
        重點 / 注意 boxes, footnotes in the right margin when there is room, and 本篇要點 (the bold lines) with a
        flash-card review. Clicking Loon goes through the points one by one.
     d) AI (提示詞工作台): mono headings; code blocks that are prompts (language prompt, or text with {{name}})
        become cards: {{name}} becomes a field, 複製提示詞 copies the filled text. Loon answers a copy. */
  (() => {
    const main = document.getElementById('main');
    if (!main) return;
    const FEED = 'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/postList.json';
    const KEY = 'luliy-label-map-v1';
    const T = s => (typeof window.LuliyInterfaceText === 'function' ? window.LuliyInterfaceText(s) : s);
    const L = (zh, en, ja, hant) => (/^en/.test(root.lang) ? en : /^ja/.test(root.lang) ? ja : root.lang === 'zh-Hant' ? (hant || T(zh)) : zh);
    const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
    const STYLES = [
      ['ai', /^ai$/i], ['study', /^study$/i], ['doc', /^doc$/i], ['guide', /^guidebook$/i], ['growth', /^(growth|成长|成長)$/i], ['musings', /^(musings|隨筆|随笔)$/i]
    ];
    let map = {};
    try { map = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
    let fetched = false;
    function loadMap() {
      if (fetched || typeof fetch !== 'function') return;
      fetched = true;
      fetch(FEED).then(r => (r.ok ? r.json() : null)).then(json => {
        if (!json || typeof json !== 'object') return;
        const m = {};
        Object.keys(json).forEach(k => { if (/^P\d+$/.test(k) && json[k] && typeof json[k] === 'object') m[k] = (json[k].labels || []).map(l => String(l && l.name !== undefined ? l.name : l).trim()); });
        map = m;
        try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {}
        schedule();
      }).catch(() => {});
    }
    function styleOf(id, shell) {
      let labels = map[id];
      if (!labels) { const c = shell.querySelector('.source-category'); labels = c ? c.textContent.split(/[·,/|]/).map(x => x.trim()) : []; }
      if (labels.some(l => /^weekly$|周[记記]|週記/i.test(l))) return '';
      for (const [name, re] of STYLES) if (labels.some(l => re.test(l))) return name === 'growth' || name === 'musings' ? '' : name; // 2026-11-07: writing uses the weekly page (36)
      return '';
    }

    const leafSvg = () => '<svg viewBox="0 0 46 20" aria-hidden="true" focusable="false"><path d="M4 10C14 2 24 2 34 10 24 18 14 18 4 10Z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 10H42" stroke="currentColor"/><circle cx="42" cy="10" r="1.4" fill="currentColor"/></svg>';
    const lineSvg = '<svg viewBox="0 0 220 16" aria-hidden="true" focusable="false"><defs><linearGradient id="lsLineG" x1="0" x2="1"><stop offset="0" stop-color="#b18a48" stop-opacity="0"/><stop offset=".2" stop-color="#e0c58d"/><stop offset=".6" stop-color="#f6e9c6"/><stop offset="1" stop-color="#cba15f" stop-opacity=".2"/></linearGradient></defs><path d="M6 10C50 4 92 13 130 8S190 5 214 9" fill="none" stroke="url(#lsLineG)" stroke-width="2.4" stroke-linecap="round"/></svg>';
    const SEASON = m => (m >= 3 && m <= 5 ? 'Spring' : m >= 6 && m <= 8 ? 'Summer' : m >= 9 && m <= 11 ? 'Autumn' : 'Winter');
    function weekOf(d) { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return Math.ceil(((t - y) / 864e5 + 1) / 7); }
    const content = body => (body.firstElementChild && body.firstElementChild.matches('.markdown-body') ? body.firstElementChild : body);

    let state = { id: '', style: '', quote: '', keys: [], ki: 0, prompts: [], ended: false };
    function head(shell, style) {
      const h1 = shell.querySelector(':scope > h1'), meta = shell.querySelector('.source-meta');
      if (!h1 || shell.querySelector(':scope > .ls-head')) return;
      const box = el('div', 'ls-head');
      const time = meta && meta.querySelector('time'), dstr = time ? time.textContent.trim() : '', date = new Date(dstr.replace(/-/g, '/'));
      const EYE = { musings: [L('随 笔', 'Musings', '随 筆'), 'MUSINGS'], growth: [L('成 长', 'Growth', '成 長'), 'GROWTH'], study: ['STUDY', L('学习笔记', 'Study notes', '学習ノート')], ai: ['AI', 'PROMPT'] }[style];
      if (style === 'growth' && !isNaN(date)) box.append(el('div', 'ls-script', SEASON(date.getMonth() + 1)));
      box.append(el('div', 'ls-eyebrow', EYE[0] + ' · ' + EYE[1]));
      h1.before(box);
      const after = el('div', 'ls-meta');
      if (style === 'musings' || style === 'growth') { const u = el('span', 'ls-uline'); u.innerHTML = lineSvg; h1.after(u); u.after(after); } else h1.after(after);
      const parts = [];
      if (style === 'growth' && !isNaN(date)) parts.push(L('第 ' + weekOf(date) + ' 周', 'Week ' + weekOf(date), '第 ' + weekOf(date) + ' 週', '第 ' + weekOf(date) + ' 週'));
      if (dstr) parts.push(dstr.replace(/-/g, ' · '));
      parts.forEach(p => after.append(el('span', '', p)));
      after.append(el('span', 'ls-rt'));
      if (style === 'ai') after.append(el('span', 'ls-pn'));
      const share = meta && meta.querySelector('.source-share');
      if (share) { const b = el('button', 'ls-share', L('分享', 'Share', '共有')); b.type = 'button'; b.addEventListener('click', () => share.click()); after.append(b); }
    }
    function readingTime(shell) {
      const rt = shell.querySelector('#sourceReadingTime'), m = rt && rt.textContent.match(/(\d+)\s*(?:分|min)/i), s = shell.querySelector('.ls-rt');
      if (s) s.textContent = m ? L('约 ' + m[1] + ' 分钟', m[1] + ' min', '約 ' + m[1] + ' 分') : '';
    }

    function manuscript(shell, body, style) {
      const c = content(body);
      body.querySelectorAll('blockquote').forEach(q => {
        if (q.closest('.markdown-alert') || q.parentElement.closest('blockquote')) return;
        const ps = q.querySelectorAll(':scope > p'), t = q.textContent.trim();
        if (q.children.length === ps.length && ps.length === 1 && t.length && t.length <= 90) q.classList.add('ls-gq');
      });
      body.querySelectorAll('hr').forEach(hr => { if (hr.nextElementSibling && hr.nextElementSibling.classList.contains('ls-leaf')) return; const s = el('span', 'ls-leaf'); s.innerHTML = leafSvg(); hr.after(s); });
      if (!c.querySelector(':scope > .ls-sign')) c.append(el('p', 'ls-sign', style === 'growth' ? 'to be continued' : '— Luliy'));
      const q = body.querySelector('.ls-gq');
      state.quote = q ? q.textContent.trim() : '';
    }
    function notebook(shell, body) {
      const c = content(body);
      // GitHub alerts (> [!NOTE] …). The site strips their classes, so they arrive as <div><p>Note</p><p>…</p></div>;
      // a blockquote that still starts with [!NOTE] counts too.
      const KINDS = { note: 'note', tip: 'tip', important: 'important', warning: 'warning', caution: 'caution' };
      const NAMES = { note: L('笔记', 'Note', 'メモ'), tip: L('例子', 'Example', '例'), important: L('重点', 'Key idea', '要点'), warning: L('注意', 'Watch out', '注意'), caution: L('注意', 'Watch out', '注意') };
      body.querySelectorAll('div, blockquote').forEach(a => {
        if (a.classList.contains('ls-box') || a.closest('.ls-keys, .ls-box')) return;
        const p = a.firstElementChild; if (!p || p.tagName !== 'P') return;
        const t = p.textContent.trim(), m1 = /^(note|tip|important|warning|caution)$/i.exec(t), m2 = /^\[!(note|tip|important|warning|caution)\]\s*/i.exec(t);
        const k = m1 ? KINDS[m1[1].toLowerCase()] : m2 ? KINDS[m2[1].toLowerCase()] : '';
        if (!k || (m1 && a.children.length < 2)) return;
        a.classList.add('ls-box', 'ls-' + k);
        const title = el('p', 'ls-box-title', NAMES[k]);
        if (m1) p.replaceWith(title);
        else { p.innerHTML = p.innerHTML.replace(/^\s*\[![a-z]+\]\s*(<br\s*\/?>)?\s*/i, ''); if (!p.textContent.trim()) p.remove(); a.prepend(title); }
      });
      // key points from bold text
      const seen = new Set(), keys = [];
      body.querySelectorAll('strong, b').forEach(s => { if (s.closest('.ls-keys, .markdown-alert-title, table')) return; const t = s.textContent.replace(/\s+/g, ' ').trim(); if (t.length >= 2 && t.length <= 80 && !seen.has(t)) { seen.add(t); keys.push(t); } });
      state.keys = keys.slice(0, 8); state.ki = 0;
      let box = c.querySelector(':scope > .ls-keys');
      if (state.keys.length >= 2 && !box) {
        box = el('section', 'ls-keys'); box.setAttribute('aria-label', L('本篇要点', 'Key points', 'この記事の要点'));
        box.append(el('h3', '', L('本篇要点', 'Key points', 'この記事の要点')));
        const ol = el('ol'); state.keys.forEach(k => ol.append(el('li', '', k))); box.append(ol);
        const go = el('button', 'ls-go', L('开始复习', 'Review', '復習する', '開始複習')); go.type = 'button';
        const fc = el('div', 'ls-fc'); fc.hidden = true; fc.setAttribute('aria-live', 'polite');
        box.append(go, fc);
        let deck = [], i = 0, again = [];
        const show = () => {
          fc.hidden = false; fc.innerHTML = '';
          if (i >= deck.length) {
            fc.append(el('p', '', again.length ? L('复习完了，还有 ' + again.length + ' 张想再看。', 'Done. ' + again.length + ' to see again.', '終わり。もう一度：' + again.length + ' 枚', '複習完了，還有 ' + again.length + ' 張想再看。') : L('全部都记得，真棒。', 'You remembered them all.', '全部覚えていました。')));
            if (again.length) { const b = el('button', '', L('再看一次', 'Again', 'もう一度')); b.type = 'button'; b.onclick = () => { deck = again; again = []; i = 0; show(); }; const r = el('div', 'ls-row'); r.append(b); fc.append(r); }
            return;
          }
          fc.append(el('small', '', L('抽认卡 ', 'Card ', 'カード ') + (i + 1) + ' / ' + deck.length), el('p', 'ls-q', deck[i]));
          const r = el('div', 'ls-row'), ok = el('button', '', L('记得', 'Got it', '覚えた')), no = el('button', '', L('再看一次', 'Again', 'もう一度'));
          ok.type = no.type = 'button'; ok.onclick = () => { i++; show(); }; no.onclick = () => { again.push(deck[i]); i++; show(); };
          r.append(ok, no); fc.append(r); ok.focus({ preventScroll: true });
        };
        go.onclick = () => { deck = state.keys.slice(); i = 0; again = []; show(); };
        const end = footnoteHead(c) || c.querySelector(':scope > section[data-footnotes], :scope > .footnotes');
        if (end) end.before(box); else c.append(box);
      }
      sidenotes(body);
    }
    // GitHub footnotes arrive as <h2>Footnotes</h2><ol>…</ol> with links pointing at the blog; refs are <sup><a …#user-content-fn-N>.
    function footnoteHead(c) { return [...c.querySelectorAll(':scope > h2, :scope > h3')].find(h => { const x = h.cloneNode(true); x.querySelectorAll('button').forEach(b => b.remove()); return /^(footnotes|脚注|腳註|注释|註釋)$/i.test(x.textContent.trim()); }) || null; }
    function sidenotes(body) {
      const c = content(body);
      body.querySelectorAll('.ls-sn').forEach(n => n.remove());
      const fh = footnoteHead(c), list = fh && fh.nextElementSibling && fh.nextElementSibling.tagName === 'OL' ? fh.nextElementSibling : c.querySelector('section[data-footnotes] ol, .footnotes ol');
      const refs = [...body.querySelectorAll('sup > a[href*="#user-content-fn-"], a[data-footnote-ref]')].filter(a => !/fnref/.test(a.getAttribute('href') || ''));
      const room = innerWidth - body.getBoundingClientRect().right;
      const on = !!(list && refs.length && room >= 270 && matchMedia('(pointer: fine)').matches);
      body.classList.toggle('ls-has-sn', on);
      [fh, list].forEach(n => { if (n) n.classList.toggle('ls-fn-hidden', on); });
      if (!on) return;
      const items = [...list.children];
      const top0 = body.getBoundingClientRect().top;
      let last = -1e9;
      refs.forEach(a => {
        const num = ((a.getAttribute('href') || '').match(/user-content-fn-(\d+)/) || [])[1], li = num ? items[+num - 1] : null;
        if (!li) return;
        const n = el('aside', 'ls-sn'), clone = li.cloneNode(true);
        clone.querySelectorAll('a').forEach(x => { if (/fnref|↩/.test((x.getAttribute('href') || '') + x.textContent)) x.remove(); });
        n.append(el('b', '', num)); n.append(document.createTextNode(' ' + clone.textContent.replace(/\s+/g, ' ').trim()));
        let y = a.getBoundingClientRect().top - top0 - 4; if (y < last + 8) y = last + 8;
        n.style.top = y + 'px'; body.append(n); last = y + n.offsetHeight;
      });
    }
    function workbench(shell, body) {
      const pres = [...body.querySelectorAll('pre')].filter(p => !p.closest('.ls-pc') && (/prompt/i.test((p.getAttribute('lang') || '') + ' ' + p.className + ' ' + ((p.querySelector('code') || {}).className || '') + ' ' + (p.parentElement.className || '')) || /\{\{[^{}\n]{1,30}\}\}/.test(p.textContent)));
      const done = [...body.querySelectorAll('.ls-pc')];
      pres.forEach(pre => {
        const host = pre.parentElement.matches('.highlight, .snippet-clipboard-content, .reader-code, [class*="code-"]') && pre.parentElement !== body ? pre.parentElement : pre;
        const n = done.length + 1;
        let title = '', h = host; while ((h = h.previousElementSibling)) { if (/^H[1-4]$/.test(h.tagName)) { title = h.textContent.replace(/[⌁¶#]/g, '').trim(); break; } }
        const card = el('div', 'ls-pc'); card.dataset.name = title || L('提示词 ', 'Prompt ', 'プロンプト ') + n;
        const hd = el('header'); hd.append(el('b', '', '#' + n + ' ' + card.dataset.name)); card.append(hd);
        const pt = el('div', 'ls-pt'), raw = pre.textContent.replace(/\n$/, ''); let fields = 0;
        raw.split(/(\{\{[^{}\n]{1,30}\}\})/).forEach(part => {
          const m = part.match(/^\{\{([^{}\n]{1,30})\}\}$/);
          if (m) { const i = el('input'); i.type = 'text'; i.placeholder = m[1].trim(); i.setAttribute('aria-label', m[1].trim()); i.size = Math.max(4, m[1].trim().length * 2); i.addEventListener('input', () => { i.size = Math.max(4, (i.value || i.placeholder).length * 2); }); pt.append(i); fields++; }
          else pt.append(document.createTextNode(part));
        });
        card.append(pt);
        const ft = el('footer'); ft.append(el('span', '', fields ? L('可填 ' + fields + ' 处', fields + ' to fill', '入力欄 ' + fields) : L('直接复制', 'Copy as is', 'そのままコピー')));
        const cp = el('button', '', L('复制提示词', 'Copy prompt', 'コピー', '複製提示詞')); cp.type = 'button';
        cp.addEventListener('click', () => {
          const text = [...pt.childNodes].map(x => (x.nodeType === 3 ? x.data : x.value ? x.value : '{{' + x.placeholder + '}}')).join('');
          const ok = () => { cp.textContent = L('已复制 ✓', 'Copied ✓', 'コピー済み ✓', '已複製 ✓'); setTimeout(() => { cp.textContent = L('复制提示词', 'Copy prompt', 'コピー', '複製提示詞'); }, 1600); if (window.LuliyLoonSay) window.LuliyLoonSay(L('已复制，去试试吧。', 'Copied. Go try it.', 'コピーしたよ。試してみて。', '已複製，去試試吧。'), 3400); };
          const fb = () => { const a = el('textarea'); a.value = text; a.style.cssText = 'position:fixed;opacity:0'; document.body.append(a); a.select(); try { document.execCommand('copy'); ok(); } catch (e) {} a.remove(); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fb); else fb();
        });
        ft.append(cp); card.append(ft);
        host.replaceWith(card); done.push(card);
      });
      state.prompts = [...body.querySelectorAll('.ls-pc')].map(c => c.dataset.name);
      const pn = shell.querySelector('.ls-meta .ls-pn');
      if (pn) pn.textContent = state.prompts.length ? L(state.prompts.length + ' 个提示词', state.prompts.length + ' prompts', 'プロンプト ' + state.prompts.length) : '';
    }

    /* ---- Loon ---- */
    const LINES = {
      musings: () => [L('晚上好，适合慢慢读。', 'Good evening. Read slowly.', 'こんばんは。ゆっくり読もう。'), L('读慢一点也没关系。', 'No need to hurry.', '急がなくていいよ。')],
      growth: () => [L('又长大了一点。', 'A little more grown.', 'また少し成長したね。'), L('把这些留给一年后的自己。', 'Kept for you, a year from now.', '一年後の自分へ。')],
      study: () => [L('有不懂的地方，点我。', 'Stuck? Click me.', 'わからない所は私を押して。'), L('划线的是重点哦。', 'The marked lines are the key points.', '線のところが要点だよ。')],
      ai: () => [L('黄色的地方可以直接填。', 'Fill in the yellow boxes.', '黄色の所に書き込めるよ。'), L('填好再复制，贴过去就能用。', 'Fill, copy, paste.', '書いてコピーして貼るだけ。')]
    };
    LINES.doc = () => [L('按 / 可以搜索这篇。', 'Press / to search this page.', '/ でこのページを検索。'), L('按 ? 看快捷键。', 'Press ? for shortcuts.', '? でショートカット。')];
    LINES.guide = () => [L('一步一步来。', 'One step at a time.', '一歩ずつね。'), L('做完一步就按 x。', 'Press x when a step is done.', '終わったら x を押してね。')];
    window.LuliyLoonLines = () => (root.classList.contains('ls-on') && LINES[state.style] ? LINES[state.style]() : null);
    window.LuliyLoonClick = () => {
      if (!root.classList.contains('ls-on')) return null;
      if ((state.style === 'doc' || state.style === 'guide') && typeof window.LuliyManualClick === 'function') return window.LuliyManualClick();
      if (state.style === 'study' && state.keys.length) { const i = state.ki % state.keys.length; state.ki++; return [L('要点 ', 'Point ', '要点 ') + (i + 1) + ' / ' + state.keys.length, state.keys[i]]; }
      if (state.style === 'ai' && state.prompts.length) return [L('这篇有 ' + state.prompts.length + ' 个提示词：', state.prompts.length + ' prompts here:', 'プロンプトは ' + state.prompts.length + ' つ：')].concat(state.prompts.slice(0, 3).map((p, i) => '#' + (i + 1) + ' ' + p));
      if ((state.style === 'musings' || state.style === 'growth') && state.quote) return ['「' + state.quote.slice(0, 40) + (state.quote.length > 40 ? '…' : '') + '」', L('这句我很喜欢。', 'I like this line.', 'この一文が好き。')];
      return null;
    };
    let quoteT = 0;
    function onEnd() {
      if (state.ended || !root.classList.contains('ls-on')) return;
      const body = main.querySelector('.source-body'); if (!body) return;
      if (body.getBoundingClientRect().bottom > innerHeight + 40) return;
      state.ended = true;
      if (state.style === 'doc' || state.style === 'guide') return;
      const t = { musings: L('读完了，晚安。', 'The end. Good night.', '読み終わり。おやすみ。'), growth: L('下次再见。', 'See you next time.', 'またね。'), study: L('读完了！要不要复习一下要点？', 'Done! Review the key points?', '読了！要点を復習する？', '讀完了！要不要複習一下要點？'), ai: L('去试试看吧。', 'Go try it.', '試してみて。') }[state.style];
      if (t && window.LuliyLoonSay) window.LuliyLoonSay(t, 4200);
    }

    /* ---- apply ---- */
    let frame = 0;
    function apply() {
      frame = 0;
      const m = /^#\/article\/(P\d+)(?:[?#/]|$)/.exec(location.hash || '');
      const shell = m && main.querySelector('.source-reading');
      if (shell) loadMap();
      const mag = root.classList.contains('lk-weekly');
      let style = shell ? styleOf(m[1], shell) : '';
      if (mag && style !== 'study') style = '';
      // 2026-11-07: on the magazine page (section 36) a study article keeps only its notebook parts: html.lsm-study.
      ['musings', 'growth', 'study', 'ai', 'doc', 'guide'].forEach(s => root.classList.toggle('ls-' + s, !mag && s === style));
      root.classList.toggle('ls-on', !mag && !!style);
      root.classList.toggle('lsm-study', mag && style === 'study');
      if (!style) { if (state.id) { state = { id: '', style: '', quote: '', keys: [], ki: 0, prompts: [], ended: false }; clearTimeout(quoteT); } return; }
      loadMap();
      if (state.id !== m[1]) {
        state = { id: m[1], style, quote: '', keys: [], ki: 0, prompts: [], ended: false };
        clearTimeout(quoteT);
        if (style === 'musings' || style === 'growth') quoteT = setTimeout(() => { if (state.id === m[1] && state.quote && window.LuliyLoonSay) window.LuliyLoonSay(['「' + state.quote.slice(0, 40) + (state.quote.length > 40 ? '…' : '') + '」', L('这句我很喜欢。', 'I like this line.', 'この一文が好き。')], 5600); }, 9000);
      }
      state.style = style;
      if (style === 'doc' || style === 'guide') return;   // section 38 builds these
      if (!mag) { head(shell, style); readingTime(shell); }
      const body = shell.querySelector('.source-body');
      if (!body || !body.textContent.trim()) return;
      const sig = style + ':' + body.childElementCount + ':' + body.textContent.length;
      if (body.dataset.lsDone === sig) return;
      if (style === 'musings' || style === 'growth') manuscript(shell, body, style);
      else if (style === 'study') notebook(shell, body);
      else if (style === 'ai') workbench(shell, body);
      body.dataset.lsDone = style + ':' + body.childElementCount + ':' + body.textContent.length;
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(apply); };
    (window.__lkSettle = window.__lkSettle || []).push(apply); // section 45 runs it at once when an article arrives
    new MutationObserver(schedule).observe(main, { childList: true, subtree: true });
    addEventListener('hashchange', schedule);
    addEventListener('scroll', onEnd, { passive: true });
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { const b = main.querySelector('.source-body'); if (b && root.classList.contains('ls-study') || b && root.classList.contains('lsm-study')) sidenotes(b); }, 200); });
    schedule();
  })();


  /* 38. 工程手冊: Guidebook (教程) and Doc (說明書) (2026-11-01). html.ls-guide / html.ls-doc are set by section 37
     (a Doc label wins over Guidebook). Both: mono head, code blocks with a language tab and copy, `EOF`, a contents
     column fixed to the right of the text (or a ☰ button and bottom sheet when there is no room), keyboard keys
     (j / k sections, gg / G, ? help, Esc). Loon stays (section 37 lines; LuliyManualClick answers a click).
     a) Guidebook: the top heading level becomes STEP 01, 02 … on a rail (headings like 簡介 / 前言 / 目錄 / FAQ /
        參考 / 附錄 / 總結 / 細節 are not steps); a mission card (time, steps, the first list before step 1);
        「標記完成」 per step (x), kept in localStorage luliy-guide-done-<Pxx>; the contents show ✓ and progress.
     b) Doc: a DOC(7) header line, headings numbered 1 / 1.1 (unless they already carry a number), a # link per
        heading that copies the section link, and a filter in the contents (/): only matching sections stay,
        matches are marked; simplified and traditional characters match each other. */
  (() => {
    const main = document.getElementById('main');
    if (!main) return;
    const T = s => (typeof window.LuliyInterfaceText === 'function' ? window.LuliyInterfaceText(s) : s);
    const L = (zh, en, ja, hant) => (/^en/.test(root.lang) ? en : /^ja/.test(root.lang) ? ja : root.lang === 'zh-Hant' ? (hant || T(zh)) : zh);
    const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
    const pad = n => String(n).padStart(2, '0');
    const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
    const NUMRE = /^\s*(\d+(\.\d+)*[.、)）]?|[一二三四五六七八九十]+[、.．])\s*/;
    const SKIP = /^(\d+\.?\s*)?(简介|簡介|介绍|介紹|前言|序言?|目录|目錄|faq|常见问题|常見問題|参考|參考|附录|附錄|总结|總結|小结|小結|细节|細節|写在最后|寫在最後)/i;
    const norm = s => { const t = T(String(s)); return (t.length === s.length ? t : String(s)).toLowerCase(); };
    const kind = () => (root.classList.contains('ls-doc') ? 'doc' : root.classList.contains('ls-guide') ? 'guide' : '');
    const bare = t => t.replace(/^[^\p{L}\p{N}]+/u, '');   // leading emoji / symbols
    const headText = h => { const c = h.cloneNode(true); c.querySelectorAll('button, .lg-anc, .lg-num, .lg-sl').forEach(x => x.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); };

    let S = null;   // state of the article on screen
    let toc = null, fab = null, help = null;
    function chrome() {
      if (toc) return;
      toc = el('nav', 'lg-toc'); toc.setAttribute('aria-label', 'Contents');
      fab = el('button', 'lg-fab', '☰'); fab.type = 'button'; fab.setAttribute('aria-label', 'Contents');
      help = el('div', 'lg-help'); help.setAttribute('role', 'dialog'); help.setAttribute('aria-modal', 'true');
      document.body.append(toc, fab, help);
      fab.addEventListener('click', e => { e.stopPropagation(); toc.classList.toggle('lg-sheet'); });
      document.addEventListener('click', e => { if (toc.classList.contains('lg-sheet') && (e.target.closest('.lg-toc a') || !e.target.closest('.lg-toc, .lg-fab'))) toc.classList.remove('lg-sheet'); });
      help.addEventListener('click', e => { if (e.target === help) help.classList.remove('open'); });
      toc.addEventListener('click', e => {
        const a = e.target.closest('a[data-t]'); if (!a) return;
        e.preventDefault(); const h = document.getElementById(a.dataset.t); if (h) h.scrollIntoView({ behavior: smooth(), block: 'start' });
      });
    }
    function helpText() {
      help.innerHTML = '';
      const box = el('div'); box.append(el('h3', '', 'KEYBOARD'));
      [['j', L('下一节', 'Next section', '次の節')], ['k', L('上一节', 'Previous section', '前の節')]]
        .concat(S.kind === 'guide' ? [['x', L('勾选当前这一步', 'Mark this step done', 'この手順を完了')]] : [['/', L('搜索本文', 'Search this page', 'このページを検索')]])
        .concat([['g g', L('到顶部', 'Top', '先頭へ')], ['G', L('到底部', 'Bottom', '末尾へ')], ['?', L('开关这个说明', 'Toggle this help', 'このヘルプ')], ['Esc', L('关闭', 'Close', '閉じる')]])
        .forEach(([k, t]) => { const r = el('div'); r.append(el('kbd', '', k), document.createTextNode(t)); box.append(r); });
      help.append(box);
    }

    /* ---- shared pieces ---- */
    function codeBlocks(body) {
      body.querySelectorAll('pre').forEach(pre => {
        if (pre.closest('.lg-cb, .ls-pc, .mermaid')) return;
        const code = pre.querySelector('code') || pre;
        const lang = ((code.className.match(/language-([\w+-]+)/) || [])[1] || pre.getAttribute('lang') || 'code').toLowerCase();
        const box = el('div', 'lg-cb'), hd = el('div', 'lg-cbh'), cp = el('button', '', 'copy'); cp.type = 'button';
        hd.append(el('span', '', lang), cp); pre.before(box); box.append(hd, pre);
        cp.addEventListener('click', () => {
          const t = code.textContent, ok = () => { cp.textContent = 'copied ✓'; setTimeout(() => { cp.textContent = 'copy'; }, 1400); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, () => {}); else ok();
        });
      });
    }
    function head(shell, k, steps, secs) {
      const h1 = shell.querySelector(':scope > h1'), meta = shell.querySelector('.source-meta');
      let box = shell.querySelector(':scope > .lg-head');
      if (!box) { box = el('div', 'lg-head'); h1.before(box); }
      box.innerHTML = '';
      if (k === 'doc') { const m = el('div', 'lg-man'); m.append(el('span', '', 'DOC(7)'), el('span', '', 'LULIY MANUAL'), el('span', '', 'DOC(7)')); box.append(m); }
      else box.append(el('p', 'lg-kick', 'GUIDEBOOK · ' + L('教程', 'Guide', 'ガイド')));
      let chips = shell.querySelector(':scope > .lg-chips');
      if (!chips) { chips = el('div', 'lg-chips'); h1.after(chips); }
      chips.innerHTML = '';
      const time = meta && meta.querySelector('time'), d = time ? time.textContent.trim() : '';
      if (d) chips.append(el('span', '', k === 'doc' ? 'rev ' + d.replace(/-/g, '.') : d));
      const rt = meta && meta.querySelector('#sourceReadingTime'), mm = rt && rt.textContent.match(/(\d+)\s*(?:分|min)/i);
      S.min = mm ? +mm[1] : Math.max(1, Math.round(shell.querySelector('.source-body').textContent.replace(/\s+/g, '').length / 400));
      chips.append(el('span', '', L('约 ' + S.min + ' 分钟', S.min + ' min', '約 ' + S.min + ' 分')));
      const c = el('span'); c.append(el('b', '', String(k === 'doc' ? secs : steps)), document.createTextNode(k === 'doc' ? L(' 节', ' sections', ' 節', ' 節') : L(' 步', ' steps', ' 手順')));
      chips.append(c);
      if (k === 'guide') { const dn = el('span', 'lg-dn'); chips.append(dn); }
      const share = meta && meta.querySelector('.source-share');
      if (share) { const b = el('button', 'lg-share', L('分享', 'Share', '共有')); b.type = 'button'; b.addEventListener('click', () => share.click()); chips.append(b); }
      const help2 = el('button', 'lg-share', '?'); help2.type = 'button'; help2.setAttribute('aria-label', L('键盘快捷键', 'Keyboard shortcuts', 'キーボード')); help2.addEventListener('click', () => { helpText(); help.classList.add('open'); });
      chips.append(help2);
    }
    function eof(c) { if (!c.querySelector(':scope > .lg-eof')) c.append(el('p', 'lg-eof', 'EOF')); }
    const content = body => (body.firstElementChild && body.firstElementChild.matches('.markdown-body') ? body.firstElementChild : body);
    // Heading levels that structure the article: a level used only once (the article's own title repeated as # …) is skipped.
    function levels(root2, direct) {
      const q = n => (direct ? root2.querySelectorAll(':scope > h' + n) : root2.querySelectorAll('h' + n)).length;
      const used = [1, 2, 3, 4].filter(n => q(n) > 0);
      while (used.length > 1 && q(used[0]) < 2) used.shift();
      return used.slice(0, 2);
    }

    /* ---- a) Guidebook ---- */
    function buildGuide(shell, body, id) {
      const c = content(body);
      const lv = levels(c, true)[0];
      const TOP = lv ? 'H' + lv : '';
      const kids = [...c.childNodes];
      const frag = document.createDocumentFragment();
      let cur = el('div', 'lg-plain'); frag.append(cur);
      const steps = [];
      kids.forEach(n => {
        if (n.nodeType === 1 && n.tagName === TOP) {
          if (SKIP.test(headText(n))) { cur = el('div', 'lg-plain'); frag.append(cur); cur.append(n); return; }
          cur = el('section', 'lg-step'); steps.push(cur); frag.append(cur); cur.append(n); n.classList.add('lg-sh'); return;
        }
        cur.append(n);
      });
      c.append(frag);
      [...c.querySelectorAll(':scope > .lg-plain')].forEach(p => { if (!p.childNodes.length) p.remove(); });
      steps.forEach((s, i) => {
        const h = s.querySelector('.lg-sh');
        h.prepend(el('span', 'lg-sl', 'STEP ' + pad(i + 1)));
        if (!h.id) h.id = 'lg-step-' + (i + 1);
        const node = el('span', 'lg-node', String(i + 1)); node.setAttribute('aria-hidden', 'true'); s.prepend(node);
        const bar = el('div', 'lg-donebar'), b = el('button'); b.type = 'button'; bar.append(b); s.append(bar);
        b.addEventListener('click', () => toggleDone(i));
      });
      // mission card: time, steps, the first list before step 1
      const firstStep = steps[0];
      let need = null;
      // 「開始前需要」: the first list before step 1 that follows a heading or line about what you need (not the article's own 目錄)
      const NEED = /准备|準備|需要|前提|要求|工具|环境|環境|prereq|before you start|you need/i;
      for (const n of [...c.children]) {
        if (n === firstStep) break;
        for (const l of n.matches('ul, ol') ? [n] : [...n.querySelectorAll(':scope > ul, :scope > ol')]) {
          const prev = l.previousElementSibling; if (prev && NEED.test(prev.textContent) && !/目录|目錄/.test(prev.textContent)) { need = l; break; }
        }
        if (need) break;
      }
      if (steps.length) {
        const card = el('div', 'lg-mission');
        const cell = (k2, v, cls) => { const d = el('div'); d.append(el('small', '', k2)); const x = el(cls === 'p' ? 'p' : 'strong', '', v); d.append(x); card.append(d); };
        cell(L('预计时间', 'Time', '目安'), '≈ ' + Math.max(5, S.min * 3) + ' min');
        cell(L('步骤', 'Steps', '手順'), String(steps.length));
        if (need) cell(L('开始前需要', 'Before you start', '始める前に'), [...need.querySelectorAll(':scope > li')].map(li => li.textContent.trim()).filter(Boolean).slice(0, 4).join('；'), 'p');
        c.prepend(card);
      }
      S.steps = steps; S.heads = steps.map(s => s.querySelector('.lg-sh'));
      S.sub = steps.map(s => (lv && lv < 6 ? [...s.querySelectorAll('h' + (lv + 1))] : []));
      try { S.done = new Set(JSON.parse(localStorage.getItem('luliy-guide-done-' + id) || '[]')); } catch (e) { S.done = new Set(); }
      eof(c);
      return steps.length;
    }
    function toggleDone(i) {
      if (!S || S.kind !== 'guide' || !S.steps[i]) return;
      const n = i + 1; S.done.has(n) ? S.done.delete(n) : S.done.add(n);
      try { localStorage.setItem('luliy-guide-done-' + S.id, JSON.stringify([...S.done])); } catch (e) {}
      paintDone();
      if (S.done.has(n) && S.done.size === S.steps.length && window.LuliyLoonSay) window.LuliyLoonSay(L('全部完成，辛苦了。', 'All done. Well done.', '全部できた。おつかれさま。'), 4600);
    }
    function paintDone() {
      S.steps.forEach((s, i) => {
        const d = S.done.has(i + 1); s.classList.toggle('lg-done', d);
        const b = s.querySelector('.lg-donebar button'); b.innerHTML = '';
        b.append(document.createTextNode(d ? L('☑ 已完成 ', '☑ Done ', '☑ 完了 ') : L('☐ 标记完成 ', '☐ Mark done ', '☐ 完了にする ')), el('kbd', '', 'x'));
        b.setAttribute('aria-pressed', String(d));
      });
      const dn = document.querySelector('#main .lg-chips .lg-dn');
      if (dn) dn.textContent = L('已完成 ', 'Done ', '完了 ') + S.done.size + ' / ' + S.steps.length;
      buildToc();
    }

    /* ---- b) Doc ---- */
    function buildDoc(shell, body) {
      const c = content(body);
      const lvls = levels(body, false);
      const hs = !lvls.length ? [] : [...body.querySelectorAll(lvls.map(n => 'h' + n).join(','))].filter(h => headText(h) && !/^(footnotes|脚注|腳註)$/i.test(headText(h)));
      let a = 0, b = 0;
      hs.forEach((h, i) => {
        const lv = lvls.indexOf(+h.tagName[1]); if (lv === 0) { a++; b = 0; } else b++;
        const num = lv === 0 ? String(a || 0) : (a || 0) + '.' + b;
        if (!h.id) h.id = 'lg-sec-' + i;
        h.dataset.lgNum = num; h.dataset.lgLv = String(lv);
        h.dataset.lgOwn = NUMRE.test(bare(headText(h))) ? '1' : '';
        if (!h.dataset.lgOwn) h.prepend(el('span', 'lg-num', num));
        const anc = el('a', 'lg-anc', '#'); anc.href = '#' + h.id; anc.setAttribute('aria-label', L('复制本节链接', 'Copy link to this section', 'この節のリンクをコピー'));
        anc.addEventListener('click', e => {
          e.preventDefault();
          const own = h.querySelector('.reader-heading-link');   // the reader's own 複製本節連結
          if (own) own.click();
          anc.textContent = '✓'; setTimeout(() => { anc.textContent = '#'; }, 1200);
        });
        h.prepend(anc);
      });
      // blocks for the filter: a heading and what follows it until the next listed heading
      const set = new Set(hs);
      const blocks = []; let cur = null;
      [...c.children].forEach(n => { if (set.has(n)) { cur = { h: n, els: [] }; blocks.push(cur); } else if (cur && !n.matches('.lg-eof')) cur.els.push(n); });
      S.heads = hs; S.blocks = blocks; S.top = hs.filter(h => h.dataset.lgLv === '0').length;
      eof(c);
      return S.top;
    }
    // Matches are painted with the CSS Custom Highlight API: the text nodes are never split (the site's 繁簡 converter
    // watches them and would write the text again). Without the API the filter still works, just without the paint.
    const HL = typeof Highlight === 'function' && window.CSS && CSS.highlights;
    function unmark() { if (HL) CSS.highlights.delete('lg-hit'); }
    function filter(q) {
      if (!S || S.kind !== 'doc') return;
      unmark(); q = norm(q.trim()); let hits = 0; const ranges = [];
      S.blocks.forEach(bk => {
        const ok = !q || norm(bk.h.textContent + ' ' + bk.els.map(e => e.textContent).join(' ')).includes(q);
        [bk.h, ...bk.els].forEach(e => e.classList.toggle('lg-gone', !ok));
        const a = toc.querySelector('a[data-t="' + bk.h.id + '"]'); if (a) a.parentElement.hidden = !ok;
        if (!ok || !q) return; hits++;
        [bk.h, ...bk.els].forEach(e => {
          const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), ns = []; let n;
          while ((n = w.nextNode())) if (!n.parentNode.closest('.lg-anc, .lg-num, button') && norm(n.data).includes(q)) ns.push(n);
          ns.forEach(n => { const t = norm(n.data); let i = t.indexOf(q); while (i >= 0 && ranges.length < 400) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + q.length); ranges.push(r); i = t.indexOf(q, i + q.length); } });
        });
      });
      if (HL && ranges.length) CSS.highlights.set('lg-hit', new Highlight(...ranges));
      const f = toc.querySelector('.lg-foot');
      if (f) f.textContent = q ? (hits ? L(hits + ' 节符合', hits + ' sections match', hits + ' 節が一致') : L('没有符合的内容', 'No match', '一致なし')) : L(S.heads.length + ' 个标题 · 按 ? 看快捷键', S.heads.length + ' headings · ? for keys', '見出し ' + S.heads.length + ' · ? でキー');
    }

    /* ---- contents column ---- */
    function buildToc() {
      chrome(); toc.innerHTML = '';
      toc.append(el('h4', '', S.kind === 'guide' ? 'STEPS' : 'ON THIS PAGE'));
      if (S.kind === 'doc') {
        const lab = el('label', 'lg-find'), inp = el('input'); inp.type = 'search'; inp.placeholder = L('搜索本文', 'Search this page', 'このページを検索'); inp.setAttribute('aria-label', inp.placeholder);
        lab.append(inp, el('kbd', '', '/')); toc.append(lab);
        inp.addEventListener('input', () => filter(inp.value));
        inp.addEventListener('keydown', e => { if (e.key === 'Escape') { inp.value = ''; filter(''); inp.blur(); } });
      }
      const ol = el('ol');
      const item = (h, cls, num, mark) => {
        const li = el('li'), a = el('a', cls); a.href = '#' + h.id; a.dataset.t = h.id;
        if (mark != null) a.append(el('span', 'lg-ck', mark));
        if (num) a.append(el('span', 'lg-n', num));
        a.append(el('span', 'lg-tt', S.kind === 'guide' && cls !== 'lg-l2' ? headText(h).replace(/^STEP \d+\s*/, '').replace(NUMRE, '') : headText(h).replace(/^STEP \d+\s*/, '')));
        li.append(a); ol.append(li); return a;
      };
      if (S.kind === 'guide') S.steps.forEach((s, i) => { const d = S.done.has(i + 1); const a = item(S.heads[i], d ? 'lg-dn' : '', pad(i + 1), d ? '✓' : '○'); void a; (S.sub[i] || []).forEach(x => { if (!x.id) x.id = 'lg-s' + i + '-' + Math.random().toString(36).slice(2, 6); item(x, 'lg-l2'); }); });
      else S.heads.forEach(h => item(h, h.dataset.lgLv === '1' ? 'lg-l2' : '', h.dataset.lgOwn ? '' : h.dataset.lgNum));
      toc.append(ol);
      toc.append(el('div', 'lg-foot'));
      if (S.kind === 'guide') { toc.querySelector('.lg-foot').textContent = S.done.size + ' / ' + S.steps.length + L(' 步完成', ' steps done', ' 手順完了'); const bar = el('div', 'lg-bar'), i2 = el('i'); i2.style.width = (S.steps.length ? S.done.size / S.steps.length * 100 : 0) + '%'; bar.append(i2); toc.append(bar); }
      else filter(toc.querySelector('input').value || '');
      place(); spy();
    }
    function place() {
      if (!toc || !S) return;
      const b = main.querySelector('.source-body'); if (!b) return;
      const left = b.getBoundingClientRect().right + 44, room = innerWidth - left - 20;
      const side = room >= 210 && matchMedia('(min-width: 1180px)').matches;
      toc.classList.toggle('lg-side', side); root.classList.toggle('lg-has-side', side);
      if (side) { toc.style.left = left + 'px'; toc.style.width = Math.min(260, room) + 'px'; toc.classList.remove('lg-sheet'); }
      else { toc.style.left = ''; toc.style.width = ''; }
    }
    function current() { let c = 0; (S && S.heads || []).forEach((h, i) => { if (h.offsetParent && h.getBoundingClientRect().top < 150) c = i; }); return c; }
    function spy() {
      if (!S || !toc) return;
      const h = S.heads[current()]; toc.querySelectorAll('a.lg-on').forEach(a => a.classList.remove('lg-on'));
      if (!h) return; const a = toc.querySelector('a[data-t="' + h.id + '"]'); if (a) { a.classList.add('lg-on'); if (toc.classList.contains('lg-side')) { const r = a.getBoundingClientRect(), t = toc.getBoundingClientRect(); if (r.top < t.top + 60 || r.bottom > t.bottom - 40) a.scrollIntoView({ block: 'nearest' }); } }
    }
    function jump(d) {
      const hs = (S.heads || []).filter(h => h.offsetParent); if (!hs.length) return;
      const y = 150; let i;
      if (d > 0) { i = hs.findIndex(h => h.getBoundingClientRect().top > y + 4); if (i < 0) i = hs.length - 1; }
      else { i = 0; for (let j = hs.length - 1; j >= 0; j--) if (hs[j].getBoundingClientRect().top < y - 4) { i = j; break; } if (hs[i].getBoundingClientRect().top > y - 40 && i > 0) i--; }
      hs[i].scrollIntoView({ behavior: smooth(), block: 'start' });
    }
    let lastG = 0;
    addEventListener('keydown', e => {
      if (!S || !kind()) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === '?') { helpText(); help.classList.toggle('open'); e.preventDefault(); return; }
      if (k === 'Escape') { help.classList.remove('open'); toc.classList.remove('lg-sheet'); return; }
      if (help.classList.contains('open')) return;
      if (k === 'j') jump(1); else if (k === 'k') jump(-1);
      else if (k === 'G') scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth() });
      else if (k === 'g') { const n = Date.now(); if (n - lastG < 500) scrollTo({ top: 0, behavior: smooth() }); lastG = n; }
      else if (k === '/' && S.kind === 'doc') { const i = toc.querySelector('input'); if (i) { e.preventDefault(); if (!toc.classList.contains('lg-side')) toc.classList.add('lg-sheet'); i.focus(); } }
      else if (k === 'x' && S.kind === 'guide') toggleDone(current());
    });
    window.LuliyManualClick = () => {
      if (!S) return null;
      const i = current(), h = S.heads[i]; if (!h) return null;
      const t = headText(h).replace(/^STEP \d+\s*/, '');
      return S.kind === 'guide' ? [L('你在第 ' + (i + 1) + ' 步：', 'Step ' + (i + 1) + ':', '手順 ' + (i + 1) + '：') + t, L('做完了按 x。', 'Press x when done.', '終わったら x。')]
        : [L('这里是第 ' + h.dataset.lgNum + ' 节。', 'Section ' + h.dataset.lgNum + '.', '第 ' + h.dataset.lgNum + ' 節。'), L('按 / 可以搜索。', 'Press / to search.', '/ で検索。')];
    };

    /* ---- apply ---- */
    let frame = 0;
    function apply() {
      frame = 0;
      const k = kind(), m = /^#\/article\/(P\d+)(?:[?#/]|$)/.exec(location.hash || '');
      const shell = k && m && main.querySelector('.source-reading'), body = shell && shell.querySelector('.source-body');
      if (!k || !body || !body.textContent.trim() || !shell.querySelector(':scope > h1')) {
        if (!k && S) { S = null; unmark(); if (toc) { toc.innerHTML = ''; toc.classList.remove('lg-sheet', 'lg-side'); help.classList.remove('open'); } root.classList.remove('lg-has-side'); }
        return;
      }
      const sig = () => k + ':' + m[1] + ':' + body.childElementCount + ':' + body.textContent.length;
      if (body.dataset.lgDone === sig()) { place(); return; }
      if (body.querySelector('.lg-eof') && S && S.id === m[1] && S.kind === k) { body.dataset.lgDone = sig(); place(); return; }   // already built; only text changed (marks)
      S = { id: m[1], kind: k, heads: [], steps: [], sub: [], done: new Set(), blocks: [], min: 1 };
      head(shell, k, 0, 0);                 // reading time first (S.min)
      codeBlocks(body);
      const n = k === 'guide' ? buildGuide(shell, body, m[1]) : buildDoc(shell, body);
      head(shell, k, n, n);
      body.dataset.lgDone = sig();
      if (k === 'guide') paintDone(); else buildToc();
      try { if (!sessionStorage.getItem('luliy-manual-keys')) { sessionStorage.setItem('luliy-manual-keys', '1'); setTimeout(() => { if (window.LuliyLoonSay) window.LuliyLoonSay(L('按 ? 看快捷键。', 'Press ? for keyboard shortcuts.', '? でショートカット。'), 4200); }, 2500); } } catch (e) {}
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(apply); };
    (window.__lkSettle = window.__lkSettle || []).push(apply); // section 45 runs it at once when an article arrives
    new MutationObserver(schedule).observe(main, { childList: true, subtree: true });
    new MutationObserver(schedule).observe(root, { attributes: true, attributeFilter: ['class'] });
    addEventListener('hashchange', schedule);
    addEventListener('scroll', () => { if (S) spy(); }, { passive: true });
    addEventListener('resize', () => { if (S) { place(); spy(); } });
    schedule();
  })();

  /* 39. 文章 / 短札 / 編年史 switches in one frame (2026-11-01). Two things made a switch stall and blink:
     a) The router hands every change inside the same page (a tab, a tag, a page of the list) to a View Transition:
        the browser first freezes a snapshot of the whole page, waits for the new content, then cross-fades the two
        (home-fixes.css: lift + settle). On the article page that was ~12 frames on a desktop and 20–30 on a phone of
        a frozen, then see-through page. For #/posts → #/posts the update now runs straight away, with no snapshot;
        the tabs, the header and the stars never take part. Other page changes keep their transition. The wrapper
        sits on Document.prototype, so the room gate (section 22), which shadows document.startViewTransition for
        one dispatch and then deletes its own copy, does not remove it. Right after the update, 短札 (section 32)
        replaces the article list the router drew for it, before other scripts decorate that list's cards.
     b) Every render() re-announces the current theme (luliy:theme), and the star layer answers by measuring the
        page while the router is half-way through rebuilding it — a full extra style and layout pass per switch.
        An announcement that repeats the theme and appearance already announced is stopped before it reaches
        the listeners; a real change still goes through. */
  (() => {
    const hashPath = h => { try { return new URL(String(h || '').replace(/^#/, '') || '/', 'https://luliy.local').pathname.replace(/\/+$/, '') || '/'; } catch (e) { return null; } };
    const urlPath = u => { try { return hashPath(new URL(u).hash); } catch (e) { return null; } };
    // a) The router calls startViewTransition from its own hashchange listener. The event being dispatched says where
    // the change comes from and goes to (window.event; listeners on window run in the order they were added, so a
    // listener of ours cannot get in first). Without window.event: the last hash we saw, updated after the router.
    let lastHash = location.hash;
    addEventListener('hashchange', () => { lastHash = location.hash; });
    const stays = () => {
      const ev = window.event;
      if (ev && ev.type === 'hashchange') return urlPath(ev.oldURL) === '/posts' && urlPath(ev.newURL) === '/posts';
      if ('event' in window) return false;
      return lastHash !== location.hash && hashPath(lastHash) === '/posts' && hashPath(location.hash) === '/posts';
    };
    const proto = window.Document && Document.prototype, real = proto && proto.startViewTransition;
    if (typeof real === 'function') {
      const done = Promise.resolve();
      const wrapped = function (arg) {
        if (stays()) {
          const update = typeof arg === 'function' ? arg : arg && typeof arg.update === 'function' ? arg.update : null;
          let out;
          try { out = update ? update() : undefined; } catch (err) { setTimeout(() => { throw err; }); }
          try { if (typeof window.LuliyJournalSync === 'function') window.LuliyJournalSync(); } catch (err) {}
          const settled = Promise.resolve(out).then(() => {}, () => {});
          return { ready: done, finished: settled, updateCallbackDone: settled, types: new Set(), skipTransition() {} };
        }
        return real.apply(this, arguments);
      };
      try { Object.defineProperty(proto, 'startViewTransition', { value: wrapped, writable: true, configurable: true }); } catch (e) {}
    }
    // b) drop repeats of luliy:theme (dispatched on document, so a capturing listener on window does hear it first)
    let lastTheme = (root.dataset.theme || '') + '|' + (root.dataset.appearance || '');   // already announced before this file loaded
    addEventListener('luliy:theme', e => {
      const key = (e.detail && e.detail.theme) + '|' + (root.dataset.appearance || '');
      if (key === lastTheme) e.stopImmediatePropagation();
      lastTheme = key;
    }, true);
  })();

  /* 40. Typesetting on every article (2026-11-07): space between Chinese and Latin/digits, squeezed runs of
     full-width punctuation, and landscape photos a little wider than the column (on the magazine sheet only).
     - Spacing: CSS text-autospace where the browser has it (Chrome 140+, Safari 18.4+); elsewhere the Latin run is
       wrapped in <span class="lk-as"> with a quarter-em margin on its Chinese side (nothing is typed into the text,
       so copying gives the original).
     - Squeeze: the site's Chinese face has no halt/chws, so text-spacing-trim does nothing. For two punctuation
       marks in a row, the blank between their inks is measured once (canvas) and the first mark is pulled closer by
       at most half an em: <span class="lk-sq" style="--sq:.5em">」</span>。
     - Wide photos: an image wider than 1.3:1 and at least as wide as the target, alone in its paragraph, gets
       .lk-wide (CSS bleeds it to the sheet's edges; on phones to the screen's).
     Code, pre, kbd, maths and buttons are left alone. Each .source-body is done once (data-lk-ty). */
  (() => {
    const box = () => document.getElementById('main') || document.body; // #main is swapped by the router, so it is looked up each time
    const AUTO = !!(window.CSS && CSS.supports && CSS.supports('text-autospace', 'normal'));
    const CJK = '⺀-⿿぀-ヿ㄀-ㄯㆠ-ㆿ㐀-䶿一-鿿豈-﫿';
    const PUNCT = '，。、；：！？「」『』（）《》〈〉【】〔〕“”‘’';
    const SKIP = 'pre, code, kbd, samp, script, style, textarea, svg, button, .katex, .MathJax, .lk-sq, .lk-as, .reader-heading-link';
    const rePair = new RegExp('[' + PUNCT + '](?=[' + PUNCT + '])', 'g');
    let ink = null, inkFont = '';
    function measure(font) { // blank before (lead) and after (trail) each mark's ink, in em
      if (ink && inkFont === font) return ink;
      const c = document.createElement('canvas').getContext('2d'); c.font = '100px ' + font; ink = {}; inkFont = font;
      for (const ch of PUNCT) {
        const m = c.measureText(ch), w = m.width || 100;
        ink[ch] = { lead: Math.max(0, -m.actualBoundingBoxLeft) / 100, trail: Math.max(0, w - m.actualBoundingBoxRight) / 100, w: w / 100 };
      }
      return ink;
    }
    function texts(root) {
      const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.parentElement && n.parentElement.closest(SKIP)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
      let n; while ((n = w.nextNode())) out.push(n);
      return out;
    }
    function squeeze(node, m) {
      const t = node.nodeValue; rePair.lastIndex = 0;
      if (!rePair.test(t)) return;
      rePair.lastIndex = 0;
      const frag = document.createDocumentFragment(); let last = 0, hit = false, r;
      while ((r = rePair.exec(t))) {
        const a = m[t[r.index]], b = m[t[r.index + 1]];
        if (!a || !b || a.w < .8 || b.w < .8) continue; // only full-width marks
        const sq = Math.min(.5, Math.round(Math.max(0, a.trail + b.lead - .12) * 20) / 20);
        if (sq < .15) continue;
        frag.append(t.slice(last, r.index)); const sp = document.createElement('span'); sp.className = 'lk-sq'; sp.style.setProperty('--sq', sq + 'em'); sp.textContent = t[r.index];
        frag.append(sp); last = r.index + 1; hit = true;
      }
      if (!hit) return; frag.append(t.slice(last)); node.replaceWith(frag);
    }
    function space(node) {
      const t = node.nodeValue; if (!/[A-Za-z0-9]/.test(t)) return;
      // runs of Latin/digits inside Chinese: wrap each run, mark which side touches Chinese
      const re = new RegExp('[A-Za-z0-9][A-Za-z0-9@#%&+.,/\'’\\-]*[A-Za-z0-9%]|[A-Za-z0-9]', 'g'), cjk = new RegExp('[' + CJK + ']');
      const frag = document.createDocumentFragment(); let last = 0, hit = false, r;
      while ((r = re.exec(t))) {
        const L = cjk.test(t[r.index - 1] || ''), R = cjk.test(t[r.index + r[0].length] || '');
        if (!L && !R) continue;
        frag.append(t.slice(last, r.index)); const sp = document.createElement('span'); sp.className = 'lk-as' + (L ? ' l' : '') + (R ? ' r' : ''); sp.textContent = r[0];
        frag.append(sp); last = r.index + r[0].length; hit = true;
      }
      if (!hit) return; frag.append(t.slice(last)); node.replaceWith(frag);
    }
    function wide(body) {
      if (!root.classList.contains('lk-weekly')) return;
      body.querySelectorAll('img').forEach(img => {
        if (img.closest('td, th, li, blockquote, .markdown-alert, figure.lk-cover, a.lk-under') || img.classList.contains('lk-cover-src')) return;
        const p = img.closest('p'); if (p && p.textContent.trim()) return; // a photo with words beside it stays in the column
        const test = () => { const w = img.naturalWidth, h = img.naturalHeight, col = body.clientWidth;
          img.classList.toggle('lk-wide', !!(w && h && w / h >= 1.3 && w >= col + 60)); };
        if (img.complete) test(); else img.addEventListener('load', test, { once: true });
      });
    }
    // The squeeze only shows while the marks really are full width as rendered (a late web font may bring narrow ones):
    // a hidden 。 is measured in the text itself, again whenever fonts finish loading.
    function sqCheck(body) {
      if (!body || !body.querySelector('.lk-sq')) return;
      const s = document.createElement('span'); s.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:100px;letter-spacing:0;text-indent:0';
      s.textContent = '。'; body.append(s); const w = s.getBoundingClientRect().width; s.remove();
      body.classList.toggle('lk-sq-on', w >= 80);
    }
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', () => sqCheck(box().querySelector('.source-body')));
    const root = document.documentElement;
    function run() {
      const body = box().querySelector('.source-body');
      if (!body || body.dataset.loading === 'true' || body.dataset.lkTy === '1' || !body.textContent.trim()) return; // not the 正在载入 placeholder
      body.dataset.lkTy = '1';
      const go = () => {
        try {
          const m = measure(getComputedStyle(body).fontFamily);
          texts(body).forEach(n => { if (!AUTO) space(n); });
          texts(body).forEach(n => squeeze(n, m));
          wide(body);
          sqCheck(body);
        } catch (e) { /* typesetting is decoration; never break the page */ }
      };
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(go));
    }
    let t = 0;
    (window.__lkSettle = window.__lkSettle || []).push(run); // section 45 runs it at once when an article arrives
    new MutationObserver(() => { if (!t) t = setTimeout(() => { t = 0; run(); }, 150); }).observe(document.body, { childList: true, subtree: true }); // a throttle, not a debounce: the page never stops moving
    run();
    addEventListener('resize', () => { const b = box().querySelector('.source-body'); if (b) wide(b); }, { passive: true });
  })();

  /* 41. 首頁（2026-11-07 起為預設）。The old home (galaxy opening, 作品, 文章, 唱片) stays in the page, hidden by html.lh-on;
     .lh comes first: Luliy's avatar (no frame) and the brand (the header's L mark + ULIY, which the header hides here, so
     the page has one Luliy) with the line 「一個傻子，幻想找到自己，爲之堅持。」; on its right three stacked-card entrances
     「姚說」(the weekly archive) 「短札」(the journal) 「學習」(Study) 「讀書」(reading notes: label Library, as in 書房 and the blog's bookshelf — not `book`, which Gmeek keeps for the book.html single page; three spines) 「教程」(Doc + Guidebook). 姚說 shows three issue covers fanned out; 短札 / 學習 / 教程 are drawn objects (slips, a squared notebook with a pencil, a ring binder with index tabs) (taken
     from the posts, cached in localStorage lh-thumb-v1; a post without a picture gets a paper card with its first
     character); then the latest 姚說 issue as a magazine card and the five most recent pieces (from the site's own home
     list, so hidden labels stay hidden). The old home: directory → 其他 → 舊版首頁, or ?home=v1, for that visit only. */
  (() => {
    const root = document.documentElement;
    let classic = false;
    try { const q = new URLSearchParams(location.search).get('home'); if (q === 'v1' || q === 'classic') classic = true; localStorage.removeItem('luliy-home-v2'); } catch (e) {}
    const FEED = 'https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/postList.json';
    const WEEKLY = /(^|[^a-z])weekly([^a-z]|$)|周[记記]|週記/i;
    const AVATAR = 'https://cloud.luliy.me/api/image?path=shared%2Fluliy.png';
    const T = s => (typeof window.LuliyInterfaceText === 'function' ? window.LuliyInterfaceText(s) : s);
    const L = (zh, en) => (/^en/.test(root.lang) ? en : root.lang === 'zh-Hant' ? T(zh) : zh);
    const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
    const isHome = () => { const h = location.hash.replace(/^#\/?/, ''); return h === '' || h === '/'; };
    const names = it => (Array.isArray(it.labels) ? it.labels : []).map(l => String(l && l.name !== undefined ? l.name : l).trim());
    let feed = null;
    if (typeof fetch === 'function') fetch(FEED).then(r => r.ok ? r.json() : null).then(j => {
      if (!j) return;
      feed = Object.keys(j).filter(k => /^P\d+$/.test(k) && j[k] && typeof j[k] === 'object')
        .map(k => ({ id: k, title: String(j[k].postTitle || ''), date: String(j[k].createdDate || ''), ts: Number(j[k].createdAt) || 0, url: String(j[k].postUrl || ''), labels: names(j[k]) }));
      sig = ''; build();
    }).catch(() => {});
    // pictures for the stacks: the first image in a post (cached; '' = none)
    let thumbs = {}; try { thumbs = JSON.parse(localStorage.getItem('lh-thumb-v1') || '{}') || {}; } catch (e) {}
    const asked = {};
    function thumb(it) {
      if (it.id in thumbs) return Promise.resolve(thumbs[it.id]);
      if (asked[it.id]) return asked[it.id];
      const name = (it.url || '').split(/[?#]/)[0].split('/').pop();
      if (!/\.html$/i.test(name) || typeof fetch !== 'function') return Promise.resolve('');
      return (asked[it.id] = fetch(FEED.replace(/postList\.json$/, 'post/' + name)).then(r => r.ok ? r.text() : '').then(html => {
        const doc = new DOMParser().parseFromString(html || '', 'text/html');
        const img = (doc.querySelector('#postBody') || doc.body || doc).querySelector('img');
        let src = img ? img.getAttribute('src') || '' : '';
        if (!/^https?:\/\//.test(src)) src = '';
        src = src.replace(/^https:\/\/camo\.githubusercontent\.com\/(?=[0-9a-f]{20})/i, location.origin + '/gh/camo/');
        thumbs[it.id] = src; try { localStorage.setItem('lh-thumb-v1', JSON.stringify(thumbs)); } catch (e) {}
        return src;
      }).catch(() => ''));
    }
    function stack(label, href, items) { // the latest posts with a picture come first; the rest are paper cards
      const a = el('a', 'lh-st'); a.href = href;
      const pile = el('span', 'lh-pile'); pile.setAttribute('aria-hidden', 'true');
      const cards = [0, 1, 2].map(i => { const c = el('span', 'lh-c lh-c' + i); pile.append(c); return c; });
      const blank = (c, it) => { c.classList.add('lh-blank'); c.textContent = it && it.title ? it.title.replace(/^[\s「『"“《【\-—0-9.、]+/, '').charAt(0) : ''; };
      const pool = items.slice(0, 8);
      Promise.all(pool.map(it => thumb(it).then(src => ({ it, src })))).then(got => {
        const order = got.filter(g => g.src).concat(got.filter(g => !g.src));
        [cards[1], cards[0], cards[2]].forEach((c, i) => { // the front card (middle) gets the first picture
          const g = order[i];
          if (!g || !g.src) return blank(c, g && g.it);
          const im = el('img'); im.src = g.src; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async';
          im.addEventListener('error', () => { im.remove(); blank(c, g.it); }, { once: true }); c.append(im);
        });
      });
      a.append(pile, el('span', 'lh-sl', '「 ' + label + ' 」'));
      return a;
    }
    function spines(label, href) { // 讀書: three book spines on a shelf (decorative), not pictures
      const a = el('a', 'lh-st lh-books'); a.href = href;
      const shelf = el('span', 'lh-pile lh-shelf'); shelf.setAttribute('aria-hidden', 'true');
      [0, 1, 2].forEach(i => { const b = el('span', 'lh-spine lh-sp' + i); b.append(el('i'), el('i')); shelf.append(b); });
      a.append(shelf, el('span', 'lh-sl', '「 ' + label + ' 」'));
      return a;
    }
    function thing(kind, label, href) { // 短札 slips · 學習 notebook · 教程 binder: drawn objects, no pictures needed
      const a = el('a', 'lh-st lh-obj lh-k-' + kind); a.href = href;
      const box = el('span', 'lh-pile'); box.setAttribute('aria-hidden', 'true');
      if (kind === 'notes') [0, 1, 2].forEach(i => { const n = el('span', 'lh-slip lh-slip' + i); n.append(el('i'), el('i'), el('i')); box.append(n); });
      if (kind === 'book') { const pg = el('span', 'lh-page'); pg.append(el('i', 'lh-margin')); box.append(pg, el('span', 'lh-pencil')); }
      if (kind === 'binder') { const b = el('span', 'lh-binder'); b.append(el('i', 'lh-rings'), el('i', 'lh-label')); box.append(el('span', 'lh-tab lh-tab0'), el('span', 'lh-tab lh-tab1'), el('span', 'lh-tab lh-tab2'), b); }
      a.append(box, el('span', 'lh-sl', '「 ' + label + ' 」'));
      return a;
    }
    function brand() {
      const b = el('a', 'lh-brand'); b.href = '#/about'; b.setAttribute('aria-label', 'Luliy');
      const mark = document.querySelector('#header .brand-mark svg');
      if (mark) { const m = el('span', 'lh-mark'); m.append(mark.cloneNode(true)); m.setAttribute('aria-hidden', 'true'); b.append(m); }
      const w = el('span', 'lh-word', mark ? 'ULIY' : 'Luliy'), hb = document.querySelector('#header .brand');
      if (hb) w.style.fontFamily = getComputedStyle(hb).fontFamily; // the header's wordmark face
      b.append(w);
      return b;
    }
    let box = null, sig = '';
    function build() {
      const home = isHome();
      root.classList.toggle('lh-on', home && !classic);
      root.classList.toggle('lh-classic', home && classic);
      if (!home || classic) return;
      const ent = document.querySelector('.entrance');
      const entries = [...document.querySelectorAll('.home-articles .study-entry')];
      if (!ent) return; // built at once (the opening's logo flies to .lh-mark); the issue and the list fill in when the home list arrives
      const now = entries.map(a => a.getAttribute('href') + ((a.querySelector('.home-article-summary') || {}).textContent || '').length + ((a.querySelector('.study-entry-cover img') || {}).src || '')).join('|') + '#' + (feed ? feed.length : 0) + (window.LuliyJournal && window.LuliyJournal.items ? window.LuliyJournal.items.length : '');
      if (box && box.isConnected && now === sig) return;
      sig = now;
      if (!box || !box.isConnected) { box = el('section', 'lh'); box.setAttribute('aria-label', L('首页', 'Home')); ent.parentElement.insertBefore(box, ent); }
      box.innerHTML = '';
      const read = a => ({ href: a.getAttribute('href'), id: a.dataset.postId || '', label: (a.querySelector('small') || {}).textContent || '', title: (a.querySelector('strong') || {}).textContent || '',
        sum: (a.querySelector('.home-article-summary') || {}).textContent || '', date: (a.querySelector('time') || {}).textContent || '', cover: (a.querySelector('.study-entry-cover img') || {}).src || '' });
      const all = entries.map(read);
      // a) who, and the three stacks
      const top = el('div', 'lh-top');
      const intro = el('div', 'lh-intro');
      const face = el('img', 'lh-face'); face.src = AVATAR; face.alt = ''; face.decoding = 'async'; face.setAttribute('aria-hidden', 'true');
      face.addEventListener('error', () => face.remove(), { once: true });
      const who = el('div', 'lh-who'); who.append(brand(), el('p', '', L('一個傻子，幻想找到自己，爲之堅持。', 'A fool, dreaming of finding myself, and holding on.')));
      intro.append(face, who);
      const byTs = (x, y) => (y.ts - x.ts) || String(y.date).localeCompare(String(x.date));
      const pick = re => (feed || []).filter(it => it.labels.some(l => re.test(l))).sort(byTs);
      const journal = window.LuliyJournal && window.LuliyJournal.items && window.LuliyJournal.items.length ? window.LuliyJournal.items.map(it => ({ id: it.id, title: it.title, url: it.bodyUrl ? it.bodyUrl.split('/').pop() : '' })) : pick(/^journal$/i);
      const stacks = el('nav', 'lh-stacks'); stacks.setAttribute('aria-label', L('栏目', 'Sections'));
      stacks.append(stack(L('姚说', 'Yao Says'), '#/posts?view=archive&group=weekly', pick(WEEKLY)),
        thing('notes', L('短札', 'Journal'), '#/posts?view=journal'),
        thing('book', L('学习', 'Study'), '#/posts?view=archive&tags=Study'),
        spines(L('读书', 'Reading'), '#/posts?view=archive&tags=Library'), // 讀書 = Library posts (section 42 lists them; the router keeps books out of the archive)
        thing('binder', L('教程', 'Guides'), '#/posts?view=archive&tags=Doc,Guidebook'));
      void journal;
      top.append(intro, stacks);
      box.append(top);
      // b) the latest issue
      const wk = all.find(x => WEEKLY.test(x.label));
      if (wk) {
        const issues = pick(WEEKLY).reverse(), pos = issues.findIndex(x => x.id === wk.id) + 1;
        const card = el('a', 'lh-issue' + (wk.cover ? ' has-cover' : '')); card.href = wk.href;
        if (wk.cover) { const f = el('span', 'lh-cover'); const im = el('img'); im.src = wk.cover; im.alt = ''; im.decoding = 'async'; f.append(im); card.append(f); }
        const b = el('span', 'lh-ib');
        if (pos) b.dataset.no = String(pos).padStart(2, '0');
        b.append(el('small', 'lh-kick', L('最新一期', 'Latest issue') + ' · ' + wk.date));
        b.append(el('strong', 'lh-title', wk.title), el('span', 'lh-sum', wk.sum), el('span', 'lh-go', L('读这一期 →', 'Read this issue →')));
        card.append(b); box.append(card);
      }
      // c) recent writing
      const rest = all.filter(x => x !== wk).slice(0, 5);
      if (rest.length) {
        const sec = el('div', 'lh-recent');
        const hd = el('div', 'lh-rh'); const more = el('a', '', L('全部文章 →', 'All writing →')); more.href = '#/posts';
        hd.append(el('h2', '', L('最近', 'Recent')), more); sec.append(hd);
        const ol = el('ol');
        rest.forEach(x => { const li = el('li'), a = el('a'); a.href = x.href;
          a.append(el('span', 'lh-lab', x.label.split('·')[0].trim()), el('span', 'lh-t', x.title), el('time', '', x.date)); li.append(a); ol.append(li); });
        sec.append(ol); box.append(sec);
      }
    }
    // directory → 其他 → 舊版首頁 (shows the old home for this visit)
    function dirLink() {
      const home = document.querySelector('#directory .directory-other-home');
      if (!home || document.querySelector('#directory .directory-other-classic')) return;
      const a = el('a', 'directory-other-classic', L('旧版首页', 'Old home')); a.href = '#/';
      a.addEventListener('click', () => { classic = true; setTimeout(build, 0); });
      home.after(a);
    }
    let t = 0;
    const tick = () => { if (!t) t = setTimeout(() => { t = 0; dirLink(); build(); }, 200); };
    new MutationObserver(tick).observe(document.body, { childList: true, subtree: true });
    addEventListener('hashchange', () => { if (!isHome()) classic = false; build(); });
    addEventListener('luliy-journal-feed', () => { sig = ''; build(); });
    dirLink(); build();
  })();

  /* 42. 歸檔頁多選篩選（2026-11-07）. The site's archive (#/posts?view=archive) filters by one tag (?tag=). Here
     ?tags=a,b (any of them) is added on top: the router ignores it and lists everything, this hides the rest, renumbers,
     drops empty years and rewrites the filter line (one × chip per tag, the count). In the 篩選 drawer every 分類 link
     now toggles its tag in the set (several can be on), 全部分類 clears it, and the 類型 / 年份 links keep the set.
     Old ?tag= links still work (they become part of the set). Labels come from luliy-label-map-v1 (section 37). */
  (() => {
    const root = document.documentElement;
    const S2 = { '讀': '读', '書': '书', '長': '长', '學': '学', '習': '习', '說': '说', '創': '创', '記': '记', '週': '周', '隨': '随', '筆': '笔', '檔': '档', '程': '程' };
    const norm = x => String(x || '').trim().toLowerCase().replace(/[讀書長學習說創記週隨筆檔]/g, c => S2[c] || c);
    const route = () => { const h = location.hash; if (!/^#\/posts(\?|$)/.test(h)) return null; const q = new URLSearchParams(h.split('?')[1] || ''); const v = q.get('view'); return v && v !== 'archive' ? null : q; };
    const setOf = q => { const out = []; (q.get('tags') || '').split(',').concat(q.get('tag') || '').map(x => x.trim()).filter(Boolean).forEach(x => { if (!out.some(y => norm(y) === norm(x))) out.push(x); }); return out; };
    const href = (q, tags) => { const n = new URLSearchParams(q); n.delete('tag'); n.delete('tags'); n.set('view', 'archive'); if (tags.length) n.set('tags', tags.join(',')); return '#/posts?' + n.toString().replace(/%2C/gi, ','); };
    const labelsOf = a => {
      let m = null; try { m = JSON.parse(localStorage.getItem('luliy-label-map-v1') || 'null'); } catch (e) {}
      const id = a.dataset.postId;
      if (m && id && Array.isArray(m[id])) return m[id];
      const sm = a.querySelector('small'); return sm ? sm.textContent.split('·').map(x => x.trim()) : [];
    };
    let feed = null, asked = false;
    function loadFeed() {
      if (asked || typeof fetch !== 'function') return; asked = true;
      fetch('https://raw.githubusercontent.com/luliy6/luliy6.github.io/main/docs/postList.json').then(r => r.ok ? r.json() : null).then(j => {
        if (!j) return;
        feed = Object.keys(j).filter(k => /^P\d+$/.test(k) && j[k] && typeof j[k] === 'object').map(k => ({ id: k, title: String(j[k].postTitle || ''), date: String(j[k].createdDate || ''), ts: Number(j[k].createdAt) || 0,
          labels: (j[k].labels || []).map(l => String(l && l.name !== undefined ? l.name : l).trim()) }));
        sig = ''; run();
      }).catch(() => {});
    }
    function inject(box, q) {
      if (box.querySelector('.lk-inj')) return;
      if (!feed) { loadFeed(); return; }
      const year = q.get('year');
      const books = feed.filter(it => it.labels.some(l => /^library$/i.test(l)) && (!year || it.date.slice(0, 4) === year))
        .sort((a, b) => (b.ts - a.ts) || b.date.localeCompare(a.date));
      if (!books.length) return;
      const anchor = box.querySelector('.post-year, .section-more, .study-empty');
      const byYear = {}; books.forEach(b => { const y = b.date.slice(0, 4) || '—'; (byYear[y] = byYear[y] || []).push(b); });
      Object.keys(byYear).sort().reverse().forEach(y => {
        const sec = document.createElement('section'); sec.className = 'post-year lk-inj';
        const h = document.createElement('h2'); h.textContent = y; sec.append(h);
        const list = document.createElement('div'); list.className = 'study-list article-list';
        byYear[y].forEach(b => {
          const a = document.createElement('a'); a.className = 'study-entry ruic-card'; a.href = '#/article/' + b.id; a.dataset.postId = b.id;
          const shown = b.labels.filter(l => !/^(library|pinned|在读|在讀|reading|读完|讀完|已读|已讀|finished|read|想读|想讀|待读|待讀|to read)$/i.test(l));
          a.innerHTML = '<span class="study-index">01</span><span class="study-entry-copy"><small></small><strong></strong></span><time></time><span class="study-arrow" aria-hidden="true">→</span>';
          a.querySelector('small').textContent = ['Library'].concat(shown).join(' · '); a.querySelector('strong').textContent = b.title; a.querySelector('time').textContent = b.date;
          list.append(a);
        });
        sec.append(list);
        const same = [...box.querySelectorAll('.post-year:not(.lk-inj)')].find(x => ((x.querySelector('h2') || {}).textContent || '').trim() === y);
        if (same) { // the year already has a section: merge, newest first
          const host = same.querySelector('.study-list') || same; [...list.children].forEach(a => { a.classList.add('lk-inj-e'); host.append(a); });
          [...host.querySelectorAll('.study-entry')].sort((a, b) => ((b.querySelector('time') || {}).textContent || '').localeCompare((a.querySelector('time') || {}).textContent || '')).forEach(a => host.append(a));
          sec.classList.add('lk-inj-empty'); same.classList.add('lk-inj'); return;
        }
        anchor ? anchor.before(sec) : box.append(sec);
      });
    }
    // 讀書 (?tags=Library alone): the books stand on shelves, one per kind (the blog's bookshelf, in this site's colours)
    const STATE = /^(library|pinned|在读|在讀|reading|currently reading|读完|讀完|已读|已讀|finished|read|想读|想讀|待读|待讀|to read|want to read)$/i;
    const KINDS = ['小说', '成长', '投资', '传记', '现实', '杂项']; // six compartments, one page; anything else goes to 杂项
    const SPINE = [['#3d4a5c', '#efe6d2'], ['#8a5a3b', '#f3e9d4'], ['#66735f', '#f1eadb'], ['#2e2b27', '#d9c49a'], ['#cbb88f', '#3a2f22'], ['#7a3b34', '#f0e2cc'], ['#a7905f', '#2b241a']]; // linen, indigo, ochre, celadon, ink, rouge
    const hash = t => { let h = 0; for (const c of String(t)) { h = (h << 5) - h + c.charCodeAt(0); h |= 0; } return Math.abs(h); };
    function shelf(box, q) {
      if (box.querySelector('.lk-shelf')) return;
      const year = q.get('year');
      const books = feed.filter(it => it.labels.some(l => /^library$/i.test(l)) && (!year || it.date.slice(0, 4) === year)).sort((a, b) => (b.ts - a.ts) || b.date.localeCompare(a.date));
      const norm2 = x => norm(x);
      const kindOf = b => { const tags = b.labels.filter(l => !STATE.test(l)); return KINDS.find(k => tags.some(t => norm2(t) === norm2(k))) || '杂项'; };
      const stateOf = b => { const l = b.labels.map(x => x.toLowerCase()); return l.some(x => ['在读', '在讀', 'reading', 'currently reading'].includes(x)) ? 'reading' : l.some(x => ['读完', '讀完', '已读', '已讀', 'finished', 'read'].includes(x)) ? 'done' : l.some(x => ['想读', '想讀', '待读', '待讀', 'to read', 'want to read'].includes(x)) ? 'want' : ''; };
      const kinds = KINDS.slice();
      const wrap = document.createElement('div'); wrap.className = 'lk-shelf';
      const head = document.createElement('div'); head.className = 'lk-sh-head';
      head.innerHTML = '<strong></strong><span></span>'; head.querySelector('strong').textContent = '我的書架'; head.querySelector('span').textContent = '共 ' + books.length + ' 本 · 點書脊打開讀後感';
      wrap.append(head);
      // one page, six open shelves (小說 成長 投資 傳記 現實 雜項): a vertical label with the count in 冊, linen spines, a ribbon on the one being read
      const CN = n => { const d = '〇一二三四五六七八九'; if (n < 10) return d[n]; if (n < 20) return '十' + (n % 10 ? d[n % 10] : ''); if (n < 100) return d[Math.floor(n / 10)] + '十' + (n % 10 ? d[n % 10] : ''); return String(n); };
      const spine = b => {
        const h = hash(b.title), [bg, fg] = SPINE[h % SPINE.length], st = stateOf(b);
        const a = document.createElement('a'); a.className = 'lk-spine' + (st === 'reading' ? ' is-reading' : ''); a.href = '#/article/' + b.id;
        a.style.cssText = '--w:' + (28 + h % 12) + 'px;--h:' + (112 + h % 30) + 'px;--bg:' + bg + ';--fg:' + fg;
        a.setAttribute('aria-label', b.title + (b.date ? '，' + b.date : '') + (st === 'reading' ? '，在讀' : ''));
        const t = document.createElement('span'); t.className = 'lk-sp-title'; t.textContent = b.title;
        const tip = document.createElement('span'); tip.className = 'lk-sp-tip'; tip.innerHTML = '<strong></strong><small></small>';
        tip.querySelector('strong').textContent = '《' + b.title + '》'; tip.querySelector('small').textContent = [b.date, st === 'reading' ? '在讀' : st === 'done' ? '讀完' : st === 'want' ? '想讀' : ''].filter(Boolean).join(' · ');
        a.append(t, tip); a.addEventListener('click', e => openBook(e, a)); return a;
      };
      // opening a book: the spine grows to fill the screen, turns into the page colour, the article comes up underneath and the cover fades away
      const openBook = (e, a) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0 || matchMedia('(prefers-reduced-motion: reduce)').matches || !document.body.animate) return;
        e.preventDefault();
        const r = a.getBoundingClientRect(), dark = (root.dataset.appearance || 'dark') !== 'light' && root.dataset.appearance !== 'day';
        const page = dark ? '#0b0b0a' : '#f6f1e7';
        const fly = document.createElement('div'); fly.className = 'lk-bookfly'; fly.setAttribute('aria-hidden', 'true');
        fly.style.cssText = 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;background-color:' + a.style.getPropertyValue('--bg') + ';color:' + a.style.getPropertyValue('--fg');
        const tt = document.createElement('span'); tt.textContent = a.querySelector('.lk-sp-title').textContent; fly.append(tt);
        document.body.append(fly);
        const W = innerWidth, H = innerHeight, cw = Math.min(260, W * .6), ch = cw * 1.45;
        const mid = { left: (W - cw) / 2 + 'px', top: (H - ch) / 2 + 'px', width: cw + 'px', height: ch + 'px' };
        const anim = fly.animate([
          { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: '2px', offset: 0 },
          { ...mid, borderRadius: '3px', offset: .45 },
          { left: '0px', top: '0px', width: W + 'px', height: H + 'px', borderRadius: '0px', backgroundColor: page, offset: 1 }
        ], { duration: 820, easing: 'cubic-bezier(.65, 0, .25, 1)', fill: 'forwards' });
        tt.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 1, transform: 'scale(1.6)', offset: .45 }, { opacity: 0, transform: 'scale(2)' }], { duration: 820, easing: 'ease-in-out', fill: 'forwards' });
        anim.onfinish = () => {
          location.hash = a.getAttribute('href');
          const t0 = Date.now();
          const wait = () => { // until the article is on the page (or a second has gone by), then the cover lifts
            if (document.querySelector('#main .source-reading .lk-by') || Date.now() - t0 > 1400) {
              fly.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: 'ease-out', fill: 'forwards' }).onfinish = () => fly.remove();
            } else requestAnimationFrame(wait);
          };
          requestAnimationFrame(wait);
        };
      };
      head.querySelector('strong').textContent = '書架'; head.querySelector('span').textContent = '共' + CN(books.length) + '冊';
      const kase = document.createElement('div'); kase.className = 'lk-sh-case';
      kinds.forEach(k => {
        const list = books.filter(b => kindOf(b) === k);
        const sec = document.createElement('section'); sec.className = 'lk-sh-cell' + (list.length ? '' : ' is-empty');
        const lab = document.createElement('div'); lab.className = 'lk-sh-label'; lab.innerHTML = '<b></b><small></small>';
        lab.querySelector('b').textContent = k; lab.querySelector('small').textContent = CN(list.length) + '冊';
        const row = document.createElement('div'); row.className = 'lk-sh-books';
        if (!list.length) { const e = document.createElement('span'); e.className = 'lk-sh-empty'; e.textContent = '虛位以待'; row.append(e); }
        sec._sp = list.map(b => { const el = spine(b); el._b = b; return el; }); sec._sp.forEach(x => row.append(x));
        sec.append(lab, row); kase.append(sec);
      });
      wrap.append(kase);
      // full shelves: spines first get thinner; what still does not fit lies flat in a pile (「另有 N 冊」); the pile opens the shelf
      const fit = sec => {
        const row = sec.querySelector('.lk-sh-books'), all = sec._sp || [];
        if (!all.length) return;
        row.querySelectorAll('.lk-pile').forEach(x => x.remove());
        row.classList.remove('is-tight'); all.forEach(x => row.append(x));
        if (sec.classList.contains('is-open')) { const p = pile(sec, [], true); row.append(p); return; }
        const avail = row.clientWidth - 10, width = list => list.reduce((t, x) => t + x.offsetWidth + 3, 0);
        if (width(all) <= avail) return;
        row.classList.add('is-tight');
        if (width(all) <= avail) return;
        const keep = []; let used = 0; const PW = 78;
        for (const x of all) { if (used + x.offsetWidth + 3 + PW > avail) break; keep.push(x); used += x.offsetWidth + 3; }
        const rest = all.filter(x => !keep.includes(x)); rest.forEach(x => x.remove());
        row.append(pile(sec, rest, false));
      };
      const pile = (sec, rest, open) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'lk-pile' + (open ? ' is-open' : '');
        const bars = document.createElement('span'); bars.className = 'lk-pile-bars'; bars.setAttribute('aria-hidden', 'true');
        (open ? [] : rest.slice(0, 4)).forEach((x, i) => { const i2 = document.createElement('i'); i2.style.cssText = 'background:' + x.style.getPropertyValue('--bg') + ';width:' + (58 + (hash(x._b.title) % 14)) + 'px;margin-left:' + ((i % 2) * 5) + 'px'; bars.prepend(i2); });
        const t = document.createElement('span'); t.className = 'lk-pile-label'; t.textContent = open ? '收起' : '另有' + CN(rest.length) + '冊';
        b.append(bars, t); b.setAttribute('aria-expanded', String(open));
        b.addEventListener('click', () => { sec.classList.toggle('is-open', !open); fit(sec); if (!open) sec.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
        return b;
      };
      requestAnimationFrame(() => kase.querySelectorAll('.lk-sh-cell').forEach(fit));
      let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (kase.isConnected) kase.querySelectorAll('.lk-sh-cell').forEach(fit); }, 150); }, { passive: true });
      const anchor = box.querySelector('.section-more'); anchor ? anchor.before(wrap) : box.append(wrap);
    }
    let sig = '';
    function run() {
      const q = route(); const box = document.querySelector('#main .post-archive');
      if (!q || !box) return;
      const tags = setOf(q), want = tags.map(norm);
      const entries = [...box.querySelectorAll('.study-entry')];
      const now = location.hash + '|' + entries.length + '|' + (box.dataset.lkMulti || '');
      if (now === sig && box.dataset.lkMulti === location.hash) return;
      sig = now; box.dataset.lkMulti = location.hash;
      // a0) Library posts are books: the router keeps them out of the archive, so they are added here (from the feed)
      if (want.some(w => w === 'library')) inject(box, q);
      box.classList.toggle('lk-shelf-on', want.length === 1 && want[0] === 'library' && !!feed);
      if (want.length === 1 && want[0] === 'library' && feed) shelf(box, q);
      const all2 = [...box.querySelectorAll('.study-entry')]; entries.length = 0; all2.forEach(x => entries.push(x));
      // a) filter (only needed for ?tags=; ?tag= alone the router already did)
      let shown = 0;
      if (q.get('tags')) {
        entries.forEach(a => { const ok = !want.length || labelsOf(a).some(l => want.includes(norm(l))); a.hidden = !ok; if (ok) shown++; });
        box.querySelectorAll('.post-year').forEach(y => { y.hidden = !y.querySelector('.study-entry:not([hidden])'); });
        let i = 0; entries.forEach(a => { if (a.hidden) return; const n = a.querySelector('.study-index'); if (n) n.textContent = String(++i).padStart(2, '0'); });
      } else shown = entries.length;
      // b) the filter line
      const cur = box.querySelector('.article-filter-current');
      if (cur) {
        cur.querySelectorAll('.article-filter-condition').forEach(c => { // the router's chip for ?tag= and our old ones make way for one chip per tag
          const lab = (c.getAttribute('aria-label') || '').replace(/^[^：:]*[：:]\s*/, '').trim();
          if (c.classList.contains('lk-mc') || tags.some(t => norm(t) === norm(lab))) c.remove();
        });
        const small = cur.querySelector('small');
        tags.forEach(t => { const c = document.createElement('a'); c.className = 'article-filter-condition lk-mc'; c.href = href(q, tags.filter(x => x !== t)); c.setAttribute('aria-label', '清除篩選：' + t); c.textContent = t; const x = document.createElement('span'); x.setAttribute('aria-hidden', 'true'); x.textContent = '×'; c.append(x); small ? small.before(c) : cur.append(c); });
        if (tags.length) cur.querySelectorAll('.article-filter-condition:not(.lk-mc)').forEach(c => { // e.g. the year chip: clearing it keeps the tags
          const raw = c.dataset.lkHref || c.getAttribute('href') || ''; c.dataset.lkHref = raw; const lq = new URLSearchParams(raw.split('?')[1] || '');
          lq.delete('tag'); lq.set('tags', tags.join(',')); c.href = '#/posts?' + lq.toString().replace(/%2C/gi, ','); });
        if (small) small.textContent = small.textContent.replace(/\d+/, String(shown));
      }
      // c0) the router lists categories from articles only, so Library (the books) is added; the drawer stays open while choosing
      const drawer = box.querySelector('details.article-filter-drawer');
      if (drawer) {
        let keep = false; try { keep = sessionStorage.getItem('lk-filter-open') === '1'; } catch (e) {}
        if (keep) drawer.open = true;
        if (!drawer.dataset.lkKeep) {
          drawer.dataset.lkKeep = '1';
          drawer.addEventListener('click', e => { if (e.target.closest('.article-filter-panel a')) { window.__lkPick = Date.now(); try { sessionStorage.setItem('lk-filter-open', '1'); } catch (err) {} } }, true);
          drawer.addEventListener('toggle', () => { if (!drawer.open && Date.now() - (window.__lkPick || 0) > 1500) { try { sessionStorage.removeItem('lk-filter-open'); } catch (err) {} } }); // closed by the reader, not by a pick
        }
      }
      box.querySelectorAll('.article-filter-section').forEach(sec => {
        const h = (sec.querySelector('h3') || {}).textContent || '';
        if (!/分類|分类|Categor|カテゴリ/.test(h)) return;
        const nav = sec.querySelector('nav'); if (!nav || nav.querySelector('[data-lk-lib]')) return;
        if ([...nav.querySelectorAll('a')].some(a => /[?&]tag=Library(&|$)/i.test(a.dataset.lkHref || a.getAttribute('href') || ''))) return;
        const a = document.createElement('a'); a.textContent = 'Library'; a.dataset.lkLib = '1'; a.setAttribute('href', '#/posts?view=archive&tag=Library'); nav.append(a);
      });
      // c) the drawer: 分類 toggles, others keep the set
      box.querySelectorAll('.article-filter-section').forEach(sec => {
        const h = (sec.querySelector('h3') || {}).textContent || '';
        const cat = /分類|分类|Categor|カテゴリ/.test(h);
        sec.querySelectorAll('nav a').forEach(a => {
          const raw = a.dataset.lkHref || a.getAttribute('href'); a.dataset.lkHref = raw;
          const lq = new URLSearchParams((raw.split('?')[1] || ''));
          if (cat) {
            const t = lq.get('tag');
            if (!t) { a.href = href(q, []); if (tags.length) a.removeAttribute('aria-current'); else a.setAttribute('aria-current', 'page'); return; }
            const on = tags.some(x => norm(x) === norm(t));
            a.href = href(q, on ? tags.filter(x => norm(x) !== norm(t)) : tags.concat(t));
            if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
            a.classList.add('lk-multi');
          } else if (tags.length) {
            lq.delete('tag'); lq.delete('tags'); lq.set('tags', tags.join(','));
            a.href = '#/posts?' + lq.toString().replace(/%2C/gi, ',');
          }
        });
        if (cat && !sec.querySelector('.lk-multi-hint')) { const sm = document.createElement('small'); sm.className = 'lk-multi-hint'; sm.textContent = '可多選'; const hh = sec.querySelector('h3'); if (hh) hh.append(sm); }
      });
    }
    let t = 0;
    new MutationObserver(() => { if (!t) t = setTimeout(() => { t = 0; run(); }, 120); }).observe(document.body, { childList: true, subtree: true });
    addEventListener('hashchange', () => { sig = ''; setTimeout(run, 60); });
    run();
  })();

  /* 43. 讀書頁與學習頁（2026-11-07）. Both keep the weekly sheet (section 36); each gets its own parts.
     讀書 (html.lk-read, label Library): a book card under the byline, built from the first quote when it reads
       > 《書名》 作者 / > 讀完：2026-06 / > 評分：4   (lines in one quote) — with the post's first picture as the cover
       (the big cover is not used here). Other quotes become book excerpts; “——p.32” at the end becomes a page number;
       a quote starting with ★ is the one pulled out big. At the end 「本篇書摘」 collects every excerpt.
     傳記 (Library + 传记): on wide screens the portrait stands full height on the left (html.lk-bio, aside.lk-bio-side).
     學習 (html.lk-study): a line under the byline (N 章 · N 條重點 from 本篇要點 · 已讀 x／n; chapters = the top headings, or the second level when there is only one top heading); each chapter heading gets a
       circle to tick when read (localStorage lk-done-v1); a table with a Chinese column and a Latin column gets 「遮住中文」 for self-testing (tap a cell to see
       it); code blocks get 「複製」. Each page is done once (data-lk-x). */
  (() => {
    const root = document.documentElement;
    const T = s => (typeof window.LuliyInterfaceText === 'function' ? window.LuliyInterfaceText(s) : s);
    const L = (zh, en) => (/^en/.test(root.lang) ? en : root.lang === 'zh-Hant' ? T(zh) : zh);
    const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
    const CJK = /[㐀-鿿]/, LAT = /[A-Za-z]{2}/;
    const idNow = () => (/^#\/article\/(P\d+)/.exec(location.hash) || [])[1] || '';
    function reading(shell, body) {
      // a) the book card (the text is read whole: the site drops <br> in the standfirst copy)
      // A 豆瓣 link in that quote (2026-11-09) is enough: 「> 豆瓣：https://book.douban.com/subject/36104107/」 —
      // the title, author, publisher and cover come from /douban/<id> (functions/douban/, through NeoDB or the 豆瓣 page,
      // kept at Cloudflare's edge and in localStorage lk-book-v1). Whatever is written by hand wins.
      const DB = /book\.douban\.com\/subject\/(\d+)/;
      const META = /《[^》]+》[\s\S]*(讀完|读完|評分|评分|Finished|Rating)|^\s*《[^》]+》[^。！？]{0,30}$|book\.douban\.com\/subject\/\d+/;
      const quotes = [...body.querySelectorAll('blockquote')];
      const metas = quotes.filter(q => META.test(q.textContent.trim()) || [...q.querySelectorAll('a[href]')].some(a => DB.test(a.href)));
      const stand = shell.querySelector('.lk-stand');
      const src = metas[0] || (stand && META.test(stand.textContent.trim()) ? stand : null);
      let info = null, dbId = '';
      if (src) {
        const t = src.textContent.replace(/\s+/g, ' ').trim(), m = /《([^》]+)》/.exec(t);
        const lnk = [...src.querySelectorAll('a[href]')].map(a => DB.exec(a.href)).find(Boolean) || DB.exec(t);
        if (lnk) dbId = lnk[1];
        const STOP = /讀完|读完|評分|评分|Finished|Rating|豆瓣|douban|https?:/i;
        info = { title: m ? m[1] : '', author: m ? (t.slice(m.index + m[0].length).split(STOP)[0] || '').replace(/^[\s—\-·,，]+|[\s,，。]+$/g, '') : '', hand: {} };
        if (/^(作者|author)$/i.test(info.author)) info.author = ''; // the template's placeholder
        if (/^(書名|书名|title)$/i.test(info.title)) info.title = '';
        info.hand.title = !!info.title; info.hand.author = !!info.author;
        let r; if ((r = /(?:讀完|读完|Finished)[：:]\s*([0-9]{4})(?:\s*[-./年]\s*([0-9]{1,2})\s*月?(?:\s*[-./]?\s*([0-9]{1,2})\s*日?)?)?/i.exec(t))) // 2026 · 2026-11 · 2026-11-09 · 2026.11.9 · 2026年11月9日
          info.done = r[1] + (r[2] ? '-' + r[2].padStart(2, '0') + (r[3] ? '-' + r[3].padStart(2, '0') : '') : '');
        if ((r = /(?:評分|评分|Rating)[：:]\s*([0-5](?:\.5)?)/i.exec(t))) info.rate = +r[1];
        metas.forEach(q => q.classList.add('lk-bc-src'));
        if (stand && META.test(stand.textContent.trim())) stand.classList.add('lk-bc-src');
      }
      // the cover: the first picture outside quotes and tables — or one written inside the book-info quote itself (2026-11-09)
      const inQuote = [...body.querySelectorAll('blockquote.lk-bc-src img')][0];
      // with a 豆瓣 link the cover is 豆瓣's (a picture further down is the article's own — on a 傳記 page, the portrait),
      // unless a picture is written inside the book-info quote itself
      const cov = dbId ? inQuote : (document.querySelector('#main .lk-cover img') || [...body.querySelectorAll('img')].find(i => !i.closest('table') && (!i.closest('blockquote') || i.closest('blockquote.lk-bc-src'))));
      if (info && (info.title || dbId || cov)) {
        const card = el('div', 'lk-bookcard');
        if (cov || dbId) {
          const f = el('span', 'lk-bc-cover'); const im = el('img'); im.alt = '';
          im.src = cov ? (cov.currentSrc || cov.src) : '/douban/' + dbId + '/cover';
          if (!cov) im.addEventListener('error', () => { f.remove(); bio(idNow()); }, { once: true });
          f.append(im); card.append(f);
        }
        const tx = el('span', 'lk-bc-text');
        card.append(tx);
        const paint = bk => {
          const v = Object.assign({}, info);
          if (bk) { if (!v.hand.title && bk.title) v.title = bk.title; if (!v.hand.author && bk.author) v.author = bk.author; }
          tx.innerHTML = '';
          tx.append(el('small', 'lk-bc-kick', L('这次读的书', 'The book')));
          if (v.title) tx.append(el('strong', 'lk-bc-title', '《' + v.title + '》'));
          if (v.author) tx.append(el('span', 'lk-bc-author', v.author));
          const pub = bk ? [bk.publisher, bk.year].filter(Boolean).join(' · ') : '';
          if (pub) tx.append(el('span', 'lk-bc-pub', pub));
          const row = el('span', 'lk-bc-row');
          if (v.done) row.append(el('span', '', L('读完 ', 'Finished ') + v.done));
          if (v.rate) { const st = el('span', 'lk-bc-rate'); st.setAttribute('aria-label', v.rate + ' / 5'); const k = Math.round(v.rate); st.textContent = '★'.repeat(k) + '☆'.repeat(5 - k); row.append(st); }
          if (dbId) { const a = el('a', 'lk-bc-db', L('豆瓣', 'Douban')); a.href = 'https://book.douban.com/subject/' + dbId + '/'; a.target = '_blank'; a.rel = 'noopener'; row.append(a); }
          if (row.childNodes.length) tx.append(row);
        };
        let bk = null; try { bk = (JSON.parse(localStorage.getItem('lk-book-v1') || '{}') || {})[dbId] || null; } catch (e) {}
        paint(bk);
        if (dbId && (!bk || Date.now() - (bk.at || 0) > 30 * 864e5)) {
          const pid = idNow();
          fetch('/douban/' + dbId, { headers: { Accept: 'application/json' } }).then(r => r.ok ? r.json() : null).then(j => {
            if (!j || !j.title) return;
            j.at = Date.now();
            try { const all = JSON.parse(localStorage.getItem('lk-book-v1') || '{}') || {}; all[dbId] = j; localStorage.setItem('lk-book-v1', JSON.stringify(all)); } catch (e) {}
            if (!card.isConnected || idNow() !== pid) return;
            paint(j); bio(pid);
          }).catch(() => {});
        }
        const by = shell.querySelector('.lk-by'); (by || shell.querySelector('h1')).after(card);
        root.classList.add('lk-has-book');
        if (cov) { cov.classList.add('lk-bc-used'); const p = cov.closest('p'); if (p && !p.textContent.trim()) p.classList.add('lk-bc-used'); }
      }
      // b) excerpts, page numbers, the ★ one. The text is rewritten into a new <p> (the site's 繁簡 pass restores edited text nodes)
      const ex = [];
      quotes.forEach(q => {
        if (q.classList.contains('lk-bc-src') || q.closest('.markdown-alert, .ls-box')) return;
        let t = q.textContent.replace(/\s+/g, ' ').trim();
        const star = /^[★☆＊*]\s*/.test(t); if (star) t = t.replace(/^[★☆＊*]\s*/, '');
        let page = ''; const r = /\s*(?:——|—|--|－－)\s*(?:p\.?|P\.?|第)\s*(\d+)\s*[頁页]?\s*$/.exec(t); if (r) { page = r[1]; t = t.slice(0, r.index).trim(); }
        q.classList.toggle('lk-star', star); q.classList.toggle('lk-excerpt', !star);
        if (star || page) {
          q.classList.add('lk-rw');
          const np = el('p', 'lk-qtext', t); q.append(np);
          if (page) q.append(el('span', 'lk-pg', 'p.' + page));
        }
        ex.push({ text: t, page });
      });
      // c) 本篇書摘
      if (ex.length >= 2) {
        const sec = el('section', 'lk-quotes'); sec.append(el('h3', '', L('本篇书摘', 'Excerpts')));
        const ol = el('ol'); ex.forEach(x => { const li = el('li'); li.append(el('span', '', x.text)); if (x.page) li.append(el('small', '', 'p.' + x.page)); ol.append(li); });
        sec.append(ol); body.append(sec);
      }
    }
    function study(shell, body, id) {
      const all = [...body.querySelectorAll('h1, h2, h3')];
      let heads = all.filter(h => h.dataset.lkLevel === '1'); if (heads.length < 2) heads = all.filter(h => h.dataset.lkLevel === '2'); // one title on top: its sections are the chapters
      let done = {}; try { done = JSON.parse(localStorage.getItem('lk-done-v1') || '{}') || {}; } catch (e) {}
      const mine = new Set(done[id] || []);
      const bold = body.querySelectorAll('.ls-keys li').length; // the 本篇要點 count (section 37), not every bold word
      const rt = (shell.querySelector('.lk-rt') || {}).textContent || '';
      const line = el('div', 'lk-studymeta');
      const prog = el('span', 'lk-sm-prog');
      const upd = () => { prog.textContent = heads.length ? L('已读 ', 'Read ') + mine.size + ' / ' + heads.length : ''; prog.classList.toggle('all', heads.length && mine.size === heads.length); };
      void rt; // the byline already says how long
      [heads.length ? heads.length + L(' 章', ' chapters') : '', bold ? bold + L(' 条重点', ' key points') : ''].filter(Boolean).forEach(t => line.append(el('span', '', t)));
      line.append(prog); upd();
      const by = shell.querySelector('.lk-by'); (by || shell.querySelector('h1')).after(line);
      heads.forEach((h, i) => {
        const b = el('button', 'lk-done'); b.type = 'button'; b.setAttribute('aria-pressed', String(mine.has(i))); b.title = L('读完这一章', 'Mark this chapter read');
        b.setAttribute('aria-label', L('读完这一章', 'Mark this chapter read'));
        b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); if (mine.has(i)) mine.delete(i); else mine.add(i); b.setAttribute('aria-pressed', String(mine.has(i)));
          done[id] = [...mine]; try { localStorage.setItem('lk-done-v1', JSON.stringify(done)); } catch (err) {} upd(); });
        h.prepend(b);
      });
      body.querySelectorAll('table').forEach(tb => {
        if (tb.closest('.lk-tw')) return;
        const w = el('div', 'lk-tw'); tb.before(w); w.append(tb);
        const rows = [...tb.querySelectorAll('tbody tr')]; if (rows.length < 3) return;
        const n = Math.max(...rows.map(r => r.children.length)); let cjk = -1, lat = -1;
        for (let c = 0; c < n; c++) { const cells = rows.map(r => (r.children[c] || {}).textContent || '').filter(x => x.trim()); if (!cells.length) continue;
          const zc = cells.filter(x => CJK.test(x) && !LAT.test(x)).length / cells.length, lc = cells.filter(x => LAT.test(x) && !CJK.test(x)).length / cells.length;
          if (zc > .6 && cjk < 0) cjk = c; else if (lc > .6 && lat < 0) lat = c; }
        if (cjk < 0 || lat < 0) return;
        rows.forEach(r => { const td = r.children[cjk]; if (td) { td.classList.add('lk-mcol'); td.addEventListener('click', () => td.classList.toggle('lk-peek')); } });
        const bt = el('button', 'lk-maskbtn', L('遮住中文', 'Hide Chinese')); bt.type = 'button'; bt.setAttribute('aria-pressed', 'false');
        bt.addEventListener('click', () => { const on = !tb.classList.contains('lk-masked'); tb.classList.toggle('lk-masked', on); bt.setAttribute('aria-pressed', String(on)); bt.textContent = on ? L('显示中文', 'Show Chinese') : L('遮住中文', 'Hide Chinese'); tb.querySelectorAll('.lk-peek').forEach(x => x.classList.remove('lk-peek')); });
        w.before(bt);
      });
      body.querySelectorAll('pre').forEach(pre => {
        if (pre.querySelector('.lk-copy')) return;
        const b = el('button', 'lk-copy', L('复制', 'Copy')); b.type = 'button';
        b.addEventListener('click', () => { const t = (pre.querySelector('code') || pre).innerText; const ok = () => { b.textContent = L('已复制 ✓', 'Copied ✓'); setTimeout(() => { b.textContent = L('复制', 'Copy'); }, 1600); };
          if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, () => {}); });
        pre.append(b);
      });
      const head = document.querySelector('#header'); if (head) root.style.setProperty('--lk-head-h', Math.round(head.getBoundingClientRect().height) + 'px');
    }
    // 傳記 (Library + 传记/傳記): on wide screens the portrait (the post's first picture) stands in a full-height column on the left
    // and the sheet sits in the rest of the page (as on wangyurui.com's newsletter pages); phones keep the cover on top.
    let side = null;
    let tools = null;
    function bioOff() { root.classList.remove('lk-bio', 'lk-view', 'lk-biog'); if (side) { side.remove(); side = null; } if (tools) { tools.remove(); tools = null; } }
    // the side buttons (bottom right): 劃線 · 返回 · 頂部
    function bioTools(id) {
      if (tools && tools.dataset.id === id) return;
      if (tools) tools.remove();
      tools = el('div', 'lk-bio-tools'); tools.dataset.id = id;
      const btn = (cls, label, svg, text) => { const b = el('button', 'lk-bt ' + cls); b.type = 'button'; b.title = label; b.setAttribute('aria-label', label); b.innerHTML = svg; if (text) b.append(el('span', '', text)); tools.append(b); return b; };
      const pen = btn('lk-bt-pen', '劃線：按一下開始', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14M14.5 4.5l3 3L9 16H6v-3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></svg>');
      const back = btn('lk-bt-back', '返回', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5.5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      const top = btn('lk-bt-top', '回到頂部', '<svg viewBox="0 0 24 10" aria-hidden="true"><path d="M5 8l7-6 7 6" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>', '頂');
      const smooth = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      back.addEventListener('click', () => { if (history.length > 1) history.back(); else location.hash = '#/posts?view=archive&tags=Library'; });
      top.addEventListener('click', () => scrollTo({ top: 0, behavior: smooth() }));
      hlPanel(pen, id);
      document.body.append(tools);
    }
    /* 劃線 (2026-11-09). The pen is a switch: on → drag over text and it is highlighted at once (in the colour picked in the
       little panel: 金 重點 · 藍 疑問 · 紅 反對); tap a highlight → a small editor (change colour, write a note, erase).
       Off → the highlights stay and nothing reacts to selections; hovering a highlight with a note shows the note.
       The panel also lists them (click one to jump there) and copies them as Markdown quotes for the 書摘.
       Wide 傳記/觀點 pages: the pen is the first side button; elsewhere (phones, other reading notes) a floating pen.
       Saved in localStorage lk-hl-v1: { Pxx: [{ k, b: block index, s, e: character offsets, t: text, c: colour, n: note }] }. */
    const HK = 'lk-hl-v1', BLK = 'p, li, h1, h2, h3, h4, h5, h6, td, th, dd, dt';
    const COLS = [['gold', '重點'], ['blue', '疑問'], ['red', '反對']];
    let hlId = '', hlPop = null, hlPanel_ = null, hlTimer = 0, hlMode = false, hlOpen = false, hlFab = null, hlEd = null, hlTip = null;
    const hlPens = new Set();
    let hlCol = 'gold'; try { hlCol = localStorage.getItem('lk-hl-col') || 'gold'; } catch (e) {}
    const hlAll = () => { try { return JSON.parse(localStorage.getItem(HK) || '{}') || {}; } catch (e) { return {}; } };
    const hlGet = id => hlAll()[id] || [];
    const hlSet = (id, a) => { const all = hlAll(); if (a.length) all[id] = a; else delete all[id]; try { localStorage.setItem(HK, JSON.stringify(all)); } catch (e) {} };
    const hlBody = () => document.querySelector('#main .source-reading .source-body');
    const hlBlocks = () => { const b = hlBody(); return b ? [...b.querySelectorAll(BLK)].filter(x => !x.querySelector(BLK) && !x.closest('.lk-quotes, .lk-bookcard, .lk-hl-skip')) : []; };
    const hlOff = (blk, node, off) => { const r = document.createRange(); r.selectNodeContents(blk); r.setEnd(node, off); return r.toString().length; };
    const coarse = () => matchMedia('(pointer: coarse)').matches;
    const hlOn = () => !matchMedia('(max-width: 1000px), (pointer: coarse)').matches; // 2026-11-09: phones and tablets only read — drawing is for the computer
    const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Painted with the CSS Custom Highlight API (::highlight), so the article's text nodes are never split — the site's
    // 繁簡 pass rewrites text nodes from its own copy, and wrapping words in <mark> made it print them twice.
    const HL = !!(window.CSS && CSS.highlights && window.Highlight);
    let hlRanges = [];   // [{ k, r: Range, rec }]
    function hlRange(blk, s, e) {
      const w = document.createTreeWalker(blk, NodeFilter.SHOW_TEXT); let pos = 0, n, r = null;
      while ((n = w.nextNode())) {
        const len = n.nodeValue.length;
        if (!r && pos + len > s) { r = document.createRange(); r.setStart(n, s - pos); }
        if (r && pos + len >= e) { r.setEnd(n, e - pos); return r; }
        pos += len;
      }
      return null;
    }
    function hlPaint() {
      if (!HL) return;
      COLS.forEach(([c]) => [false, true].forEach(noted => {
        const name = 'lk-hl-' + c + (noted ? '-n' : ''), rs = hlRanges.filter(x => (x.rec.c || 'gold') === c && !!x.rec.n === noted).map(x => x.r);
        if (rs.length) CSS.highlights.set(name, new Highlight(...rs)); else CSS.highlights.delete(name);
      }));
    }
    function hlApply(id) {
      hlId = id; hlRanges = [];
      const bl = hlBlocks();
      hlGet(id).forEach(r => { const blk = bl[r.b]; if (!blk) return; const tx = blk.textContent; let s = r.s; if (tx.slice(r.s, r.e) !== r.t) { const i = tx.indexOf(r.t); if (i >= 0) s = i; else if (r.e > tx.length) return; } const rg = hlRange(blk, s, s + (r.e - r.s)); if (rg) hlRanges.push({ k: r.k, r: rg, rec: r }); }); // 繁簡 is one character for one: the offsets still hold
      hlPaint(); hlRefresh(); hlFabMake();
    }
    function hlHit(x, y) { // which highlight is under the pointer
      for (const h of hlRanges) for (const q of h.r.getClientRects()) if (x >= q.left - 1 && x <= q.right + 1 && y >= q.top - 1 && y <= q.bottom + 1) return h;
      return null;
    }
    let hlMo = 0;
    new MutationObserver(ms => { // the article was re-rendered or the 繁簡 switch rewrote its text: paint again
      const id = idNow(); if (!id || !root.classList.contains('lk-read') || !hlGet(id).length) return;
      const bd = hlBody(); if (!bd) return;
      const lost = !hlRanges.length || hlRanges.some(x => !x.r.startContainer.isConnected);
      if (!lost && !ms.some(m => m.type === 'characterData' && bd.contains(m.target))) return;
      if (!hlMo) hlMo = setTimeout(() => { hlMo = 0; if (root.classList.contains('lk-read') && idNow() === id && hlBlocks().length) hlApply(id); }, 150); // throttled: the page never stops mutating
    }).observe(document.body, { characterData: true, childList: true, subtree: true });
    window.addEventListener('hashchange', () => { if (idNow() !== hlId) { hlRanges = []; hlPaint(); } if (hlMode) hlModeSet(false); hlEdHide(); hlTipHide(); });
    function hlAdd() {
      const sel = getSelection(); if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      const rg = sel.getRangeAt(0), bd = hlBody(); if (!bd || !bd.contains(rg.commonAncestorContainer)) return;
      const id = idNow() || hlId, bl = hlBlocks(), recs = hlGet(id).slice();
      bl.forEach((blk, i) => {
        if (!rg.intersectsNode(blk)) return;
        const bs = document.createRange(); bs.selectNodeContents(blk);
        const s = rg.compareBoundaryPoints(Range.START_TO_START, bs) > 0 ? hlOff(blk, rg.startContainer, rg.startOffset) : 0;
        const e = rg.compareBoundaryPoints(Range.END_TO_END, bs) < 0 ? hlOff(blk, rg.endContainer, rg.endOffset) : blk.textContent.length;
        if (e <= s || !blk.textContent.slice(s, e).trim()) return;
        let a = s, z = e, notes = [];
        for (let j = recs.length - 1; j >= 0; j--) { const r = recs[j]; if (r.b === i && r.s <= z && r.e >= a) { a = Math.min(a, r.s); z = Math.max(z, r.e); if (r.n) notes.unshift(r.n); recs.splice(j, 1); } } // merge with neighbours, keep their notes
        const rec = { k: Date.now().toString(36) + i, b: i, s: a, e: z, t: blk.textContent.slice(a, z), c: hlCol };
        if (notes.length) rec.n = notes.join(' / ');
        recs.push(rec);
      });
      recs.sort((x, y) => x.b - y.b || x.s - y.s);
      hlSet(id, recs); sel.removeAllRanges(); hlApply(id);
    }
    function hlEdit(k, patch) { const id = idNow() || hlId; hlSet(id, hlGet(id).map(r => r.k === k ? Object.assign(r, patch) : r).map(r => { if (!r.n) delete r.n; return r; })); hlApply(id); }
    function hlDel(k) { const id = idNow() || hlId; hlSet(id, hlGet(id).filter(r => r.k !== k)); hlApply(id); }
    const place = (box, rect, below) => { // beside a rectangle, kept on screen
      const w = box.offsetWidth || 120, h = box.offsetHeight || 40;
      let y = below ? rect.bottom + 12 : rect.top - h - 10; if (y < 8) y = rect.bottom + 10; if (y + h > innerHeight - 8) y = Math.max(8, rect.top - h - 10);
      box.style.left = Math.max(8, Math.min(innerWidth - w - 8, rect.left + rect.width / 2 - w / 2)) + 'px'; box.style.top = y + 'px';
    };
    // pop-up fallback, only where no pen is showing
    function hlPopHide() { if (hlPop) hlPop.hidden = true; }
    function hlPopShow(rect) {
      if (!hlPop) {
        hlPop = el('div', 'lk-hl-pop'); const b = el('button'); b.type = 'button'; b.textContent = '劃線'; hlPop.append(b); document.body.append(hlPop);
        hlPop.addEventListener('pointerdown', e => e.preventDefault()); // keep the selection alive
        b.addEventListener('click', () => { hlAdd(); hlPopHide(); });
      }
      hlPop.hidden = false; place(hlPop, rect, coarse());
    }
    // the editor: colour · note · erase
    function hlEdHide() { if (hlEd && !hlEd.hidden) { const ta = hlEd.querySelector('textarea'); if (hlEd.dataset.k && ta.value.trim() !== (ta.dataset.was || '')) hlEdit(hlEd.dataset.k, { n: ta.value.trim() }); hlEd.hidden = true; } }
    function hlEdShow(h) {
      hlTipHide();
      if (!hlEd) {
        hlEd = el('div', 'lk-hl-ed'); hlEd.hidden = true; hlEd.setAttribute('role', 'dialog'); hlEd.setAttribute('aria-label', '編輯劃線');
        const row = el('div', 'lk-hl-sw');
        COLS.forEach(([c, name]) => { const b = el('button', 'lk-hl-c lk-hl-c-' + c); b.type = 'button'; b.dataset.c = c; b.append(el('i'), el('span', '', name)); b.addEventListener('click', () => { hlEdit(hlEd.dataset.k, { c }); hlEd.querySelectorAll('.lk-hl-c').forEach(x => x.classList.toggle('on', x.dataset.c === c)); }); row.append(b); });
        const ta = el('textarea'); ta.rows = 2; ta.placeholder = '寫一句批註……'; ta.maxLength = 300;
        ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); hlEdHide(); } e.stopPropagation(); });
        const foot = el('div', 'lk-hl-ft'), del = el('button', 'lk-hl-del', '擦掉'), ok = el('button', 'lk-hl-ok', '完成');
        del.type = ok.type = 'button';
        del.addEventListener('click', () => { const k = hlEd.dataset.k; hlEd.dataset.k = ''; hlEd.hidden = true; hlDel(k); });
        ok.addEventListener('click', hlEdHide);
        foot.append(del, ok); hlEd.append(row, ta, foot); document.body.append(hlEd);
      }
      const ta = hlEd.querySelector('textarea');
      hlEd.dataset.k = h.k; ta.value = h.rec.n || ''; ta.dataset.was = h.rec.n || '';
      hlEd.querySelectorAll('.lk-hl-c').forEach(x => x.classList.toggle('on', x.dataset.c === (h.rec.c || 'gold')));
      hlEd.hidden = false; place(hlEd, h.r.getBoundingClientRect(), true);
      if (!coarse()) ta.focus({ preventScroll: true });
    }
    // the note, on hover (or a tap outside 劃線模式)
    function hlTipHide() { if (hlTip) hlTip.hidden = true; }
    function hlTipShow(h, x, y) {
      if (!hlTip) { hlTip = el('div', 'lk-hl-tip'); hlTip.hidden = true; document.body.append(hlTip); }
      if (hlTip.dataset.k !== h.k || hlTip.hidden) { hlTip.dataset.k = h.k; hlTip.textContent = h.rec.n; hlTip.className = 'lk-hl-tip lk-hl-tip-' + (h.rec.c || 'gold'); }
      hlTip.hidden = false; place(hlTip, x == null ? h.r.getBoundingClientRect() : { left: x, right: x, width: 0, top: y - 14, bottom: y + 14 }, false);
    }
    // 劃線模式
    const hlBtnNow = () => [...hlPens, hlFab].find(b => b && b.isConnected && b.getClientRects().length) || null;
    const penShown = () => hlOn() && !!hlBtnNow();
    const hlSelOk = () => {
      const sel = getSelection(), bd = hlBody();
      if (!hlOn() || !root.classList.contains('lk-read') || !sel || sel.isCollapsed || !sel.rangeCount || !bd) return false;
      const c = sel.getRangeAt(0).commonAncestorContainer, ce = c.nodeType === 1 ? c : c.parentElement;
      return bd.contains(c) && !(ce && ce.closest('pre, code, .lk-hl-skip')) && !!sel.toString().trim();
    };
    function hlModeSet(on) {
      hlMode = !!on && penShown(); root.classList.toggle('lk-hl-mode', hlMode);
      [...hlPens, hlFab].forEach(b => { if (!b) return; b.classList.toggle('on', hlMode); b.setAttribute('aria-pressed', String(hlMode)); b.title = hlMode ? '劃線中：拖選文字即高亮，點高亮處改顏色、寫批註（再按一次筆結束）' : '劃線：按一下開始'; });
      if (!hlMode) { hlOpen = false; hlEdHide(); }
      if (hlPanel_) hlPanel_.hidden = !hlMode;
      hlPopHide(); hlTipHide(); hlRefresh();
    }
    function hlPenClick() { const was = hlMode; hlModeSet(!was); if (!was && hlSelOk()) hlAdd(); } // text already selected → highlight it right away
    function hlCheck() {
      if (hlMode) { if (coarse() && hlSelOk()) hlAdd(); return; } // touch: a long-press selection is added once it settles
      if (penShown() || !hlSelOk()) { hlPopHide(); return; }
      hlPopShow(getSelection().getRangeAt(0).getBoundingClientRect());
    }
    document.addEventListener('selectionchange', () => { clearTimeout(hlTimer); hlTimer = setTimeout(hlCheck, hlMode ? 700 : 160); });
    document.addEventListener('mouseup', e => { if (hlMode && !(hlEd && hlEd.contains(e.target))) setTimeout(() => { if (hlSelOk()) hlAdd(); }, 0); });
    document.addEventListener('click', e => {
      if ((hlPop && hlPop.contains(e.target)) || (hlEd && hlEd.contains(e.target))) return;
      const bd = hlBody(), sel = getSelection(), still = !sel || sel.isCollapsed;
      const h = bd && bd.contains(e.target) && still ? hlHit(e.clientX, e.clientY) : null;
      if (h && hlMode && hlOn()) { hlEdShow(h); return; }
      hlEdHide();
      if (h && h.rec.n) { hlTipShow(h); return; } // a tap shows the note too (phones have no hover)
      hlTipHide();
    });
    let hlMv = 0;
    document.addEventListener('mousemove', e => {
      if (hlMv || !hlRanges.length) return;
      hlMv = requestAnimationFrame(() => {
        hlMv = 0; const bd = hlBody(); if (!bd) return;
        const h = bd.contains(e.target) ? hlHit(e.clientX, e.clientY) : null;
        bd.classList.toggle('lk-hl-over', !!h && hlMode);
        if (h && h.rec.n && !(hlEd && !hlEd.hidden)) hlTipShow(h, e.clientX, e.clientY); else if (hlTip && !hlTip.hidden && !coarse()) hlTipHide();
      });
    });
    document.addEventListener('pointerdown', e => { if (hlEd && !hlEd.hidden && !hlEd.contains(e.target)) hlEdHide(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (hlEd && !hlEd.hidden) { hlEdHide(); return; } hlPopHide(); hlTipHide(); if (hlMode) hlModeSet(false); } });
    addEventListener('scroll', () => { if (hlTip && !hlTip.hidden) hlTipHide(); }, { passive: true });
    function hlClose() { if (hlMode) hlModeSet(false); hlPopHide(); hlEdHide(); hlTipHide(); }
    // Markdown for the 書摘: one quote per highlight; a note follows as a plain line (疑問 / 反對 say so)
    function hlMarkdown() {
      return hlGet(idNow() || hlId).map(r => {
        const q = '> ' + r.t.replace(/\s+/g, ' ').trim(), c = r.c || 'gold';
        const tag = c === 'blue' ? '疑問' : c === 'red' ? '反對' : '';
        const note = r.n ? (tag ? tag + '：' : '') + r.n : (tag ? tag : '');
        return note ? q + '\n\n' + note : q;
      }).join('\n\n') + '\n';
    }
    async function hlCopy(btn) {
      const md = hlMarkdown(); let ok = false;
      try { await navigator.clipboard.writeText(md); ok = true; } catch (e) {
        const ta = el('textarea'); ta.value = md; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0'; document.body.append(ta); ta.select();
        try { ok = document.execCommand('copy'); } catch (e2) {} ta.remove();
      }
      btn.textContent = ok ? '已複製 ✓' : '複製失敗'; setTimeout(() => { btn.textContent = '複製 Markdown'; }, 1600);
    }
    function hlRefresh() {
      if (!hlPanel_ || !hlId) return;
      const recs = hlGet(hlId); hlPanel_.innerHTML = '';
      const head = el('button', 'lk-hl-head'); head.type = 'button'; head.setAttribute('aria-expanded', String(hlOpen));
      head.append(el('span', 'lk-hl-dot lk-hl-dot-' + hlCol), el('span', '', '劃線中'), el('span', 'lk-hl-n', recs.length ? recs.length + ' 條' : ''), el('span', 'lk-hl-car', recs.length ? (hlOpen ? '收起' : '查看') : ''));
      head.addEventListener('click', () => { if (!recs.length) return; hlOpen = !hlOpen; hlRefresh(); });
      const sw = el('div', 'lk-hl-sw');
      COLS.forEach(([c, name]) => { const b = el('button', 'lk-hl-c lk-hl-c-' + c + (c === hlCol ? ' on' : '')); b.type = 'button'; b.title = '新劃線用' + name + '色'; b.append(el('i'), el('span', '', name)); b.addEventListener('click', () => { hlCol = c; try { localStorage.setItem('lk-hl-col', c); } catch (e) {} hlRefresh(); }); sw.append(b); });
      hlPanel_.append(head, sw);
      if (!recs.length) { hlPanel_.append(el('p', 'lk-hl-empty', coarse() ? '長按選取文字就會高亮；點高亮處改顏色、寫批註。再按一次筆結束。' : '拖選文字就會高亮；點高亮處改顏色、寫批註。再按一次筆結束。')); return; }
      if (hlOpen) {
        const ul = el('ul');
        recs.forEach(r => {
          const li = el('li', 'lk-hl-li-' + (r.c || 'gold')), go = el('button', 'lk-hl-go'), x = el('button', 'lk-hl-x', '×');
          go.append(el('span', 'lk-hl-q', r.t.length > 90 ? r.t.slice(0, 90) + '…' : r.t)); if (r.n) go.append(el('span', 'lk-hl-note', r.n));
          go.type = x.type = 'button'; x.setAttribute('aria-label', '擦掉這條劃線');
          go.addEventListener('click', () => { const h = hlRanges.find(y => y.k === r.k); if (!h) return; const q = h.r.getBoundingClientRect(); scrollBy({ top: q.top - innerHeight / 2 + q.height / 2, behavior: reduce() ? 'auto' : 'smooth' }); if (HL) { CSS.highlights.set('lk-hl-flash', new Highlight(h.r)); setTimeout(() => CSS.highlights.delete('lk-hl-flash'), 1400); } });
          x.addEventListener('click', () => hlDel(r.k));
          li.append(go, x); ul.append(li);
        });
        hlPanel_.append(ul);
      }
      const cp = el('button', 'lk-hl-copy', '複製 Markdown'); cp.type = 'button'; cp.title = '每條劃線一段 > 引用，批註接在下面，可直接貼進「書摘」';
      cp.addEventListener('click', () => hlCopy(cp)); hlPanel_.append(cp);
    }
    function hlPanelMake() { if (!hlPanel_) { hlPanel_ = el('div', 'lk-hl-panel'); hlPanel_.hidden = true; document.body.append(hlPanel_); } }
    function hlPanel(btn, id) { // the side-button pen of a 傳記/觀點 page
      if (hlMode) hlModeSet(false);
      hlId = id; hlPens.forEach(b => { if (!b.isConnected) hlPens.delete(b); }); hlPens.add(btn);
      btn.setAttribute('aria-pressed', 'false'); btn.title = '劃線：按一下開始';
      btn.addEventListener('pointerdown', e => e.preventDefault()); // keep a selection made before tapping the pen
      btn.addEventListener('click', hlPenClick);
      hlPanelMake();
    }
    function hlFabMake() { // the floating pen: phones and reading notes without the side buttons
      hlPanelMake();
      if (hlFab) return;
      hlFab = el('button', 'lk-hl-fab'); hlFab.type = 'button'; hlFab.setAttribute('aria-label', '劃線'); hlFab.setAttribute('aria-pressed', 'false'); hlFab.title = '劃線：按一下開始';
      hlFab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14M14.5 4.5l3 3L9 16H6v-3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></svg>';
      hlFab.addEventListener('pointerdown', e => e.preventDefault());
      hlFab.addEventListener('click', hlPenClick);
      document.body.append(hlFab);
    }
    const VIEW = /^(成长|成長|投资|投資)$/;   // 觀點類: the cover and the book's details stand on the left where 傳記 has its portrait
    function bio(id) {
      let ls = []; try { ls = (JSON.parse(localStorage.getItem('luliy-label-map-v1') || '{}') || {})[id] || []; } catch (e) {}
      if (!Array.isArray(ls) || !ls.length) { const c = document.querySelector('#main .source-reading .source-category'); ls = c ? c.textContent.split(/[·,/|]/).map(x => x.trim()).filter(Boolean) : []; } // before the label map arrives: the category line on the page
      const view = !ls.some(l => /^(传记|傳記|biography)$/i.test(l)) && ls.some(l => VIEW.test(l));
      const isBio = ls.some(l => /^(传记|傳記|biography)$/i.test(l));
      root.classList.toggle('lk-biog', isBio); // 傳記 typesetting that also holds on a phone (no portrait there)
      if (!view && !isBio) { bioOff(); return; }
      let src = '', text = null;
      if (view) {
        const card = document.querySelector('#main .lk-bookcard'), ci = card && card.querySelector('.lk-bc-cover img');
        if (!card || !ci) { bioOff(); return; }
        src = ci.currentSrc || ci.src; text = card.querySelector('.lk-bc-text');
      } else {
        const img = document.querySelector('#main .lk-cover img') || document.querySelector('#main .source-body img:not(.lk-bc-used)');
        if (!img) { bioOff(); return; }
        src = img.currentSrc || img.src;
      }
      if (side && side.classList.contains('lk-view-side') !== view) { side.remove(); side = null; }
      if (!side) { side = el('aside', 'lk-bio-side' + (view ? ' lk-view-side' : '')); side.setAttribute('aria-hidden', 'true'); side.append(el('img')); document.body.append(side); }
      const im = side.querySelector('img'); if (im.getAttribute('src') !== src) { im.src = src; im.alt = ''; }
      if (view) { // title, author, finished date and stars under the cover: copied from the book card
        let cap = side.querySelector('.lk-vs-cap'); if (!cap) { cap = el('div', 'lk-vs-cap'); side.append(cap); }
        const sig = text ? text.textContent : ''; if (cap.dataset.sig !== sig) { cap.dataset.sig = sig; cap.innerHTML = ''; if (text) [...text.children].filter(c => !c.classList.contains('lk-bc-kick')).forEach(c => cap.append(c.cloneNode(true))); }
      }
      side.dataset.id = id; root.classList.add('lk-bio'); root.classList.toggle('lk-view', view); bioTools(id);
    }
    function run() {
      const READ_ON = true; // 2026-11-07: 讀書 parts on (set false to switch them off)
      const read = READ_ON && root.classList.contains('lk-read'), st = root.classList.contains('lk-study');
      if (!read) root.classList.remove('lk-has-book');
      if (!read) { bioOff(); hlClose(); } else if (idNow() && document.querySelector('#main .source-reading .lk-by')) bio(idNow());
      if (!read && !st) return;
      const shell = document.querySelector('#main .source-reading'), body = shell && shell.querySelector('.source-body');
      const id = idNow();
      if (!body || !id || body.dataset.loading === 'true' || !shell.querySelector('.lk-by') || !body.textContent.trim()) return; // not the 正在载入 placeholder
      const key = id + (read ? ':r' : ':s');
      if (body.dataset.lkX === key) return;
      body.dataset.lkX = key;
      try { if (read) { reading(shell, body); bio(id); hlApply(id); } else study(shell, body, id); } catch (e) { /* decoration only */ }
    }
    let t = 0;
    (window.__lkSettle = window.__lkSettle || []).push(run); // section 45 runs it at once when an article arrives
    new MutationObserver(() => { if (!t) t = setTimeout(() => { t = 0; run(); }, 200); }).observe(document.body, { childList: true, subtree: true });
    run();
  })();

  /* 44. 目錄（aresluna 式，2026-11-07，先做好、預設關閉）. A black panel at the top right of an article: a header row (a book
     mark on the left, one dot per entry on the right — the chapter being read is lit in the accent colour, the one under
     the pointer in white); hover or focus opens the list below it (a tap pins it on touch screens): 「開頭」 unnumbered,
     then the chapters numbered 1, 2, 3…, the current one in the accent colour, the hovered row on a grey ground.
     Turn on: ?toc=v2 (remembered in localStorage luliy-toc-v2; ?toc=v1 turns it off), or window.LuliyToc.enable().
     While it is on, Loon's contents bubble steps aside. Chapters: the article's top headings (data-lk-level 1 from
     section 36), otherwise the highest heading level used. */
  (() => {
    const root = document.documentElement;
    const KEY = 'luliy-toc-v2';
    let on = false;
    try { const q = new URLSearchParams(location.search).get('toc'); if (q === 'v2') localStorage.setItem(KEY, '1'); if (q === 'v1') localStorage.removeItem(KEY); on = localStorage.getItem(KEY) === '1'; } catch (e) {}
    const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
    const name = h => { const c = h.cloneNode(true); c.querySelectorAll('button, .reader-heading-link, svg').forEach(n => n.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); };
    let box = null, list = null, dots = null, heads = [], sig = '', pinned = false, cur = -1, shut = 0;
    function chapters(body) { // all headings (h1–h3) in reading order
      const hs = [...body.querySelectorAll('h1, h2, h3')].filter(h => name(h));
      if (hs.length) return hs;
      const all = [...body.querySelectorAll('h1, h2, h3')];
      if (all.some(h => h.dataset.lkLevel)) { const one = all.filter(h => h.dataset.lkLevel === '1'); return one.length >= 2 ? one : all.filter(h => h.dataset.lkLevel === '2').length >= 2 ? all.filter(h => h.dataset.lkLevel === '2') : one; }
      for (const t of ['H1', 'H2', 'H3']) { const x = all.filter(h => h.tagName === t); if (x.length >= 2) return x; }
      return all;
    }
    function build(body) {
      heads = chapters(body);
      const s2 = heads.map(name).join('|');
      if (box && box.isConnected && s2 === sig) return;
      sig = s2;
      if (!box) {
        box = el('nav', 'lt-toc'); box.setAttribute('aria-label', '目錄'); // 2026-11-07: drawn as Maggie Appleton's contents (lines that open into titles)
        const head = el('button', 'lt-head'); head.type = 'button'; head.setAttribute('aria-expanded', 'false');
        head.innerHTML = '<svg class="lt-mark" viewBox="0 0 20 16" aria-hidden="true"><path d="M10 3.2C8.2 1.9 5.6 1.4 2 1.5v11.6c3.6-.1 6.2.4 8 1.7 1.8-1.3 4.4-1.8 8-1.7V1.5c-3.6-.1-6.2.4-8 1.7Zm0 0v11.6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>';
        dots = el('span', 'lt-dots'); dots.setAttribute('aria-hidden', 'true'); head.append(dots);
        list = el('ol', 'lt-list');
        const cap = el('p', 'lt-cap', '目錄');
        box.append(head, cap, list);
        head.addEventListener('click', () => { pinned = !box.classList.contains('open') || !pinned; setOpen(pinned); });
        box.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { clearTimeout(shut); setOpen(true); } });
        box.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !pinned) { clearTimeout(shut); shut = setTimeout(() => setOpen(false), 180); } }); // a short grace: brushing the edge does not blink it
        box.addEventListener('focusin', () => setOpen(true));
        box.addEventListener('focusout', e => { if (!box.contains(e.relatedTarget) && !pinned) setOpen(false); });
        addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { pinned = false; setOpen(false); } });
        document.addEventListener('pointerdown', e => { if (pinned && !box.contains(e.target)) { pinned = false; setOpen(false); } });
        list.addEventListener('pointerover', e => { const li = e.target.closest('li'); hover(li ? +li.dataset.i : -1); });
        list.addEventListener('pointerleave', () => hover(-1));
      }
      document.body.append(box);
      list.innerHTML = ''; dots.innerHTML = '';
      // 2026-11-07: every heading, as text only, indented by level; the writer's 一、/1./(2) numbering is dropped
      const strip = t => t.replace(/^(?:第?[一二三四五六七八九十百零〇]+[、.．:：章节節部]|[（(]?\d{1,2}[)）]|\d{1,2}(?:\.\d{1,2})+(?:[、.．:：)）]|(?=\s))|\d{1,2}[、.．:：)）](?!\d))\s*/, '') || t;
      const levels = [...new Set(heads.map(h => h.tagName))].sort();
      const entries = heads.map(h => ({ label: strip(name(h)), lv: Math.min(2, levels.indexOf(h.tagName)), go: () => jump(h) }));
      entries.forEach((it, i) => {
        const li = el('li'); li.dataset.i = i; li.className = 'lt-l' + it.lv; li.style.setProperty('--i', Math.min(i, 14));
        const a = el('a'); a.href = '#'; a.append(el('b', '', it.n ? String(it.n) : ''), el('span', '', it.label));
        a.addEventListener('click', e => { e.preventDefault(); it.go(); pinned = false; setOpen(false); });
        li.append(a); list.append(li); dots.append(el('i', 'd' + it.lv));
      });
      cur = -1; now();
    }
    const smooth = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    function jump(h) { const y = h.getBoundingClientRect().top + scrollY - (innerWidth <= 700 ? 84 : 110); scrollTo({ top: Math.max(0, y), behavior: smooth() }); }
    function setOpen(o) { if (!box) return; box.classList.toggle('open', o); box.querySelector('.lt-head').setAttribute('aria-expanded', String(o)); if (!o) hover(-1); }
    function hover(i) { if (!dots) return; [...dots.children].forEach((d, k) => d.classList.toggle('hov', k === i)); }
    function now() {
      if (!box || !box.isConnected) return;
      let c = 0; heads.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * .3) c = i; });
      if (c === cur) return; cur = c;
      [...list.children].forEach((li, k) => { const a = li.firstChild; if (k === c) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      [...dots.children].forEach((d, k) => d.classList.toggle('on', k === c));
    }
    function run() {
      const wide = matchMedia('(min-width: 1001px)').matches;
      const m = /^#\/article\/P\d+/.test(location.hash) && (on || (wide && root.classList.contains('lk-bio'))); // 傳記 pages use it in place of Loon
      root.classList.toggle('lt-on', m);
      const body = m && document.querySelector('#main .source-reading .source-body');
      if (!body || !body.textContent.trim()) { if (box) box.remove(); return; }
      build(body);
    }
    let t = 0;
    (window.__lkSettle = window.__lkSettle || []).push(run); // section 45 runs it at once when an article arrives
    new MutationObserver(() => { if (!t) t = setTimeout(() => { t = 0; run(); }, 250); }).observe(document.body, { childList: true, subtree: true });
    addEventListener('scroll', () => requestAnimationFrame(now), { passive: true });
    addEventListener('hashchange', () => { sig = ''; setTimeout(run, 80); });
    window.LuliyToc = { enable() { on = true; try { localStorage.setItem(KEY, '1'); } catch (e) {} sig = ''; run(); }, disable() { on = false; try { localStorage.removeItem(KEY); } catch (e) {} run(); } };
    run();
  })();

  /* 47. 寫作語法說明（2026-11-08）. On the home page a small circled question mark stands at the right of 「教程」 in the row
     of five; pointing at it, focusing it from the keyboard or tapping it opens a card of the Markdown that turns into this
     site's own styles. Esc or a tap outside closes it. */
  (() => {
    const root = document.documentElement;
    const T = s => (typeof window.LuliyInterfaceText === 'function' ? window.LuliyInterfaceText(s) : s);
    const zh = s => (root.lang === 'zh-Hant' ? T(s) : s);
    const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
    const ROWS = [
      ['全部', [
        ['> 一句话', '单段、90 字内：放大的引言'],
        ['第一段', '首字放大'],
        ['![说明](图片)', '说明文字变成图说'],
        ['单独一段的横图', '比正文略宽'],
        ['---', '「· · ·」分隔（传记页不显示）'],
        ['> [!NOTE] / [!TIP] / [!WARNING]', '提示框'],
        ['<details><summary>标题</summary>…', '可收合的段落'],
        ['`<head>`', '写 HTML 标签要用反引号包起来，不然会被吃掉'],
      ]],
      ['读书 Library', [
        ['> 《书名》作者\n> 读完：2026-06\n> 评分：4', '书卡与星星（文内第一张图当封面）'],
        ['> 原文……——p.32', '摘录，末尾变页码，收进「本篇书摘」'],
        ['> ★ 一句话', '本篇最重要的一句，放大'],
        ['+ 传记', '左侧人像（文内要有照片）'],
        ['+ 成长 / 投资', '左侧封面和书名'],
      ]],
      ['学习 Study', [
        ['## 本篇要点 + 加粗句', '顶部显示「N 条重点」'],
        ['中文栏 | 英文栏 表格', '「遮住中文」自测'],
        ['```代码```', '「复制」按钮'],
      ]],
    ];
    let btn = null, card = null, open = false, shut = 0;
    function set(v) { open = v; if (!btn) return; btn.setAttribute('aria-expanded', String(v)); card.classList.toggle('on', v); }
    function build() {
      const box = el('div', 'lk-howto');
      btn = el('button', 'lk-howto-btn'); btn.type = 'button'; btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', zh('写作语法')); btn.title = zh('写作语法');
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.25"/><path d="M9.4 9.3a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.3-2.6 4"/><circle cx="12" cy="17.2" r=".9" class="dot"/></svg>';
      card = el('div', 'lk-howto-card'); card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', zh('写作语法'));
      card.append(el('div', 'lk-howto-h', zh('怎么写')));
      ROWS.forEach(([g, rows]) => {
        card.append(el('div', 'lk-howto-g', zh(g)));
        const dl = el('dl');
        rows.forEach(([k, v]) => { dl.append(el('dt', '', k), el('dd', '', zh(v))); });
        card.append(dl);
      });
      card.append(el('div', 'lk-howto-f', zh('中英文之间不用打空格，网站会自动留空隙。')));
      box.append(card, btn);
      box.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { clearTimeout(shut); place(); set(true); } });
      box.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { clearTimeout(shut); shut = setTimeout(() => set(false), 200); } });
      btn.addEventListener('click', () => { place(); set(!open); });
      box.addEventListener('focusin', () => { if (btn.matches(':focus-visible')) set(true); }); // keyboard only: a tap focuses too, and its click toggles
      box.addEventListener('focusout', e => { if (!box.contains(e.relatedTarget)) set(false); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) { set(false); btn.focus(); } });
      document.addEventListener('pointerdown', e => { if (open && !box.contains(e.target)) set(false); });
      return box;
    }
    let box = null;
    function place() { // the card stays on screen: it opens below the mark, as far left as it needs
      if (!box || !card) return;
      const r = btn.getBoundingClientRect(), w = Math.min(380, innerWidth - 32);
      card.style.left = Math.round(Math.max(16, Math.min(r.right - w, innerWidth - 16 - w)) - r.left) + 'px';
    }
    function run() {
      const cell = document.querySelector('html.lh-on .lh-stacks .lh-k-binder');
      if (!cell) { if (box) { box.remove(); box = btn = card = null; open = false; } return; }
      if (!box || !cell.parentElement.contains(box)) { if (box) box.remove(); box = build(); box.classList.add('lk-howto-home'); cell.parentElement.append(box); }
      const sl = cell.querySelector('.lh-sl'), P = cell.parentElement.getBoundingClientRect(), r = (sl || cell).getBoundingClientRect(), bw = btn.offsetWidth || 30; // just right of the 「教程」 label
      box.style.left = Math.round(Math.min(r.right - P.left - 2, P.width - bw + 4)) + 'px'; box.style.top = Math.round(r.top - P.top + r.height / 2 - bw / 2) + 'px';
      place();
    }
    (window.__lkSettle = window.__lkSettle || []).push(run);
    let t = 0;
    new MutationObserver(() => { if (!t) t = setTimeout(() => { t = 0; run(); }, 200); }).observe(document.body, { childList: true, subtree: true });
    addEventListener('hashchange', () => setTimeout(run, 60));
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { t = 0; run(); }, 150); });
    run();
  })();

  /* 46. 多餘換行（2026-11-08）. A line break at the very start or end of a paragraph, list item, quote or table cell, and a
     second break right after another, only add an empty line: they come from how the issue text was typed. They are taken
     out of article bodies and 短札 entries (code blocks untouched). */
  (function () {
    const blank = n => n && n.nodeType === 3 && !n.textContent.trim();
    function edge(br, dir) { let n = br[dir]; while (blank(n)) n = n[dir]; return !n; }
    function tidy() {
      document.querySelectorAll('#main .source-body br, #main .luliy-journal-view br').forEach(br => {
        const host = br.parentElement;
        if (!host || host.closest('pre, code, .katex, svg') || !/^(P|LI|BLOCKQUOTE|TD|TH|DIV)$/.test(host.tagName)) return;
        let n = br.nextSibling; while (blank(n)) n = n.nextSibling;
        if (edge(br, 'previousSibling') || edge(br, 'nextSibling') || (n && n.nodeName === 'BR' && host.tagName !== 'DIV')) br.remove(); // in a plain block a double break may be a paragraph gap: kept
      });
    }
    (window.__lkSettle = window.__lkSettle || []).push(tidy);
    let t = 0;
    new MutationObserver(() => { if (!t) t = setTimeout(() => { t = 0; tidy(); }, 160); }).observe(document.body, { childList: true, subtree: true });
    tidy();
  })();

  /* 45. 進文章不閃舊樣式（2026-11-07）. The router draws an article in its plain layout first; sections 36–44 then dress it
     (weekly sheet, 讀書／學習 parts, typesetting, 傳記 portrait, contents) a few frames to a few hundred ms later, so a
     click showed the old look for a moment. Now: on the way into #/article/Pxx the sheet is held invisible
     (html.lk-veil); the moment its text is in the page, every section's dressing runs at once (window.__lkSettle,
     registered by each section), and two frames later the sheet fades in already dressed. A cap of 1.2 s lifts it
     whatever happens, so a slow or failed part can never leave a blank page. */
  (function () {
    const root = document.documentElement;
    const idOf = () => { const m = /^#\/article\/(P\d+)/.exec(location.hash || ''); return m ? m[1] : ''; };
    const bodyNow = () => document.querySelector('#main .source-reading .source-body');
    let cap = 0, fade = 0, armed = false, lifting = false, stale = null, shown = '';
    function bioSoon() { // section 43 b's test, read ahead: Library + 传记 on a wide screen
      if (!matchMedia('(min-width: 1001px)').matches) return false;
      let ls = []; try { ls = (JSON.parse(localStorage.getItem('luliy-label-map-v1') || '{}') || {})[idOf()] || []; } catch (e) {}
      if (!Array.isArray(ls) || !ls.length) { const c = document.querySelector('#main .source-reading .source-category'); ls = c ? c.textContent.split(/[·,/|]/).map(x => x.trim()).filter(Boolean) : []; } // before the label map arrives: the category line on the page
      return ls.some(l => /^(library|讀書|读书)$/i.test(l)) && ls.some(l => /^(传记|傳記|biography)$/i.test(l));
    }
    function lift() {
      clearTimeout(cap); armed = false; lifting = false;
      if (!root.classList.contains('lk-veil')) return;
      root.classList.remove('lk-veil'); root.classList.add('lk-arrive');
      clearTimeout(fade); fade = setTimeout(() => root.classList.remove('lk-arrive'), 400);
    }
    function check() {
      if (!armed && shown && idOf() && idOf() !== shown) { arm(); return; } // the hash moved on before its hashchange event
      if (!armed || lifting) return;
      const body = bodyNow();
      if (body && body.dataset.loading === 'true') stale = null; // the router reloads in place: from here this element is the new page
      if (!body || body === stale || body.dataset.loading === 'true' || !body.textContent.trim()) return; // the 正在载入 placeholder is not the text
      if (bioSoon() && !body.querySelector('img') && !document.querySelector('#main .lk-cover img')) return; // 傳記: its portrait comes with the first picture
      lifting = true; shown = idOf();
      (window.__lkSettle || []).forEach(f => { try { f(); } catch (e) { /* dressing only */ } });
      requestAnimationFrame(() => requestAnimationFrame(lift)); // section 40 typesets one frame after fonts are ready
    }
    function arm(next) {
      const id = typeof next === 'string' ? next : idOf();
      if (!id) { if (armed) lift(); shown = ''; return; }
      const cur = bodyNow();
      if (id === shown && cur && cur.dataset.loading !== 'true') return; // same article, only the query changed: nothing to hide
      stale = cur; // the page being left: never mistaken for the new one
      armed = true; lifting = false; root.classList.add('lk-veil');
      clearTimeout(cap); cap = setTimeout(lift, 1200);
      check();
    }
    addEventListener('hashchange', () => arm());
    document.addEventListener('click', e => { // hide the page being left at the click itself, before the hash even changes
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href^="#/article/P"]'); const m = a && /^#\/article\/(P\d+)/.exec(a.getAttribute('href'));
      if (m && m[1] !== idOf()) arm(m[1]);
    }, true);
    new MutationObserver(check).observe(document.body, { childList: true, subtree: true }); // runs before the browser paints
    if (idOf()) { if (bodyNow() && bodyNow().dataset.loading !== 'true') shown = idOf(); else arm(); }
  })();

})();
