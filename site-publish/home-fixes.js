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
    if (phone && brand && brand.getAttribute('href') === '#/') brand.setAttribute('href', '#/posts');
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
    const wash = () => {
      const w = mobile.matches && scrollY > 20 && (!home() || header.classList.contains('is-scrolled'));
      if (w !== washed) { washed = w; header.classList.toggle('luliy-washed', w); }
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
    const busy = () => !!(root.classList.contains('luliy-tab-scrolling') || root.classList.contains('luliy-cloth-open') || main.querySelector('.reader-toc-toggle[aria-expanded="true"], .article-filter-drawer[open]') || document.querySelector('dialog[open]'));
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
    addEventListener('hashchange', route);
    mobile.addEventListener('change', route);
    new MutationObserver(route).observe(main, { childList: true });
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
     (default 夜藍 midnight when nothing saved; base dark 暗黑 saves 'dark').
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
            date: d[k].createdDate || ''
          }));
          arr.sort((a, b) => b.date.localeCompare(a.date) || (+b.key.slice(1)) - (+a.key.slice(1)));
          posts = arr; postsLoading = false; built = '';
          if (open) fill();
        })
        .catch(() => { postsLoading = false; postsFailed = true; built = ''; if (open) fill(); });
    };
    const articles = () => posts || [];
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
      const key = l + '|' + (posts ? items.map(t => t.key).join(',') : postsLoading ? 'loading' : 'failed');
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
          items.forEach((t, idx) => {
            const li = document.createElement('li'), b = document.createElement('button');
            const no = document.createElement('span'), title = document.createElement('span');
            b.type = 'button'; b.className = 'luliy-article-row'; b.dataset.article = t.key;
            b.setAttribute('aria-label', t.title);
            no.className = 'luliy-article-no'; no.textContent = String(idx + 1).padStart(2, '0');
            title.className = 'luliy-article-title'; title.textContent = t.title;
            b.append(no, title); li.append(b); list.append(li);
          });
        }
        cloth.querySelector('.luliy-cloth-count').textContent = posts
          ? say('全部文章 · ' + items.length, 'All articles · ' + items.length, 'すべての記事 · ' + items.length)
          : '';
      }
      reflect();
    };
    const label = () => {
      if (button) {
        const t = say('文章', 'Articles', '記事');
        const span = button.querySelector('span');
        if (span.textContent !== t) span.textContent = t;
        button.setAttribute('aria-label', say('文章：陳列所有文章', 'Articles: show every article', '記事：すべての記事を表示'));
      }
      if (cloth) { hang.setAttribute('aria-label', say('全部文章', 'All articles', 'すべての記事')); if (open) fill(); else built = ''; }
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
      label();
    };
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
        var style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
        var el = document.createElement('div');
        el.id = 'luliy-room-loader';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = '<div class="lrl-mark"><i class="lrl-ring"></i><svg viewBox="0 0 60 60">' + paths('o') + paths('t', 4) + paths('l', 4) + '</svg></div>';
        if (a === 'light') el.innerHTML = '<img src="/assets/site/%5BIT-XIAOBIN%5D-1792981037054.png" alt="" aria-hidden="true">';
        document.documentElement.appendChild(el);
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
      setTimeout(() => { el.classList.add('is-done'); setTimeout(() => el.remove(), 500); }, wait);
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
    if (isRoom()) show();

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
    function choice() { return read(LS_CHOICE) || 'default'; }
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
          c = 'default';
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
      // Which thumbnail is selected: 'default' means "automatic" = this article's image, else the first artwork.
      var sel = c;
      if (c === 'default' && !cov) sel = items[0] && items[0].id !== 'none' ? items[0].id : 'none';
      if (c === 'custom' && !custom) sel = cov ? 'default' : (items[0] ? items[0].id : 'none');
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
      const t = (el.textContent || '').slice(0, 4000);
      if (KANA.test(t)) return 'ja';
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
          const want = trad && typeof conv === 'function' ? conv(o) : o;
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

  /* 27. Reading-page mascot (2026-10-30): the gold leaf-hair figure from the Luliy logo animation, cut out of the
     background (assets/mascot/). Reading pages only (#/article/, #/post/), desktop only, and only when the left
     margin beside the article is wide enough.
     She is drawn on a canvas from a 70-frame sheet (15 fps) and driven like a scrubber:
       - when an article opens she plays the whole clip once, then rests on the logo pose;
       - hovering the contents button turns her to the front and she holds there (and keeps holding while the
         contents panel is open); hovering the back-to-top button turns her to the far pose and holds;
         leaving a button winds her back to the resting pose;
       - hovering her or clicking her replays the clip and she says a line.
     Reduced motion / Save-Data: no sheet is fetched; three still poses cross-fade instead.
     Her button column also carries the article's contents + back-to-top buttons (the article's own two floating
     buttons are hidden by CSS while she is on screen). Revert = delete this block and its CSS. */
  (() => {
    const root = document.documentElement;
    const BASE = '/assets/mascot/';
    const REST = BASE + 'luliy-rest.webp?v=2', FRONT = BASE + 'luliy-front.webp', TURN = BASE + 'luliy-turn.webp', ATLAS = BASE + 'luliy-atlas.webp';
    const FW = 320, FH = 262, COLS = 10, NF = 70, FPS = 15, F_FRONT = 22, F_TURN = 45;
    const KEY = 'luliy-mascot-hidden';
    const WIDE = matchMedia('(min-width: 1180px) and (pointer: fine)');
    const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches || root.classList.contains('luliy-save-data');
    const T = s => (typeof window.LuliyInterfaceText === 'function' ? window.LuliyInterfaceText(s) : s);
    const read = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
    const write = v => { try { v ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch (e) {} };
    const reading = () => /^#\/(?:article|post)\//.test(location.hash || '');

    const box = document.createElement('div');
    box.className = 'luliy-mascot';
    box.hidden = true;
    box.innerHTML =
      '<div class="luliy-mascot-bubble" role="status" aria-live="polite"></div>' +
      '<div class="luliy-mascot-tools">' +
        '<button type="button" data-m="toc" aria-label="文章目录" aria-expanded="false" title="目录"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg></button>' +
        '<button type="button" data-m="top" aria-label="回到顶部" title="回到顶部"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>' +
        '<button type="button" data-m="hide" aria-label="收起看板娘" title="收起"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
      '</div>' +
      '<div class="luliy-mascot-stage" role="button" tabindex="0" aria-label="看板娘，点一下和她说话">' +
        '<img class="luliy-mascot-rest" src="' + REST + '" alt="" decoding="async" width="' + FW + '" height="' + FH + '">' +
        '<canvas class="luliy-mascot-canvas" width="' + FW + '" height="' + FH + '" aria-hidden="true"></canvas>' +
      '</div>';
    const peek = document.createElement('button');
    peek.type = 'button';
    peek.className = 'luliy-mascot-peek';
    peek.hidden = true;
    peek.textContent = '召唤看板娘';
    const stage = box.querySelector('.luliy-mascot-stage'), bubble = box.querySelector('.luliy-mascot-bubble');
    const canvas = box.querySelector('canvas'), ctx = canvas.getContext('2d');
    const tocBtn = box.querySelector('[data-m="toc"]'), topBtn = box.querySelector('[data-m="top"]');

    /* ---------- the scrubber ---------- */
    let atlas = null, loading = false, pos = 0, target = 0, spd = 1, mode = 'idle', raf = 0, lastT = 0, fade = 0, drawn = -1;
    let hoverToc = false, hoverTop = false, tocOpen = false, stillsReady = false;

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
      im.decoding = 'async';
      im.onload = () => {
        (im.decode ? im.decode() : Promise.resolve()).catch(() => {}).then(() => {
          atlas = im; drawn = -1; draw(pos);
          requestAnimationFrame(() => box.classList.add('has-canvas')); // hide the still only after the canvas shows the same frame
          retarget();
        });
      };
      im.onerror = () => { loading = false; };
      im.src = ATLAS;
    }
    function kick() { if (!raf && atlas) { lastT = performance.now(); raf = requestAnimationFrame(tick); } }
    function tick(now) {
      raf = 0;
      const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
      if (mode === 'wrap') { // end of the full clip: dissolve from its last frame into the resting frame
        fade += dt / .35;
        const k = Math.min(1, fade);
        ctx.clearRect(0, 0, FW, FH);
        ctx.globalAlpha = 1; ctx.drawImage(atlas, ((NF - 1) % COLS) * FW, (((NF - 1) / COLS) | 0) * FH, FW, FH, 0, 0, FW, FH);
        ctx.globalAlpha = k; ctx.drawImage(atlas, 0, 0, FW, FH, 0, 0, FW, FH);
        ctx.globalAlpha = 1; drawn = -1;
        if (k >= 1) { pos = 0; target = 0; mode = 'idle'; draw(0); retarget(); return; }
        raf = requestAnimationFrame(tick); return;
      }
      const dist = target - pos;
      if (Math.abs(dist) > 1e-3) {
        let v = FPS * spd;
        if (mode === 'hover') v *= Math.max(.35, Math.min(1, Math.abs(dist) / 4)); // ease into the held frame
        pos += Math.sign(dist) * Math.min(Math.abs(dist), v * dt);
        draw(pos);
      }
      if (Math.abs(target - pos) <= 1e-3) {
        pos = target; draw(pos);
        if (mode === 'intro') { mode = 'wrap'; fade = 0; raf = requestAnimationFrame(tick); }
        else if (pos === 0) mode = 'idle';
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    function wanted() { return hoverTop ? F_TURN : (hoverToc || tocOpen) ? F_FRONT : 0; }
    function ensureStills() {
      if (stillsReady) return;
      stillsReady = true;
      [['front', FRONT], ['turn', TURN]].forEach(([name, src]) => {
        const im = new Image();
        im.className = 'luliy-mascot-pose'; im.dataset.pose = name; im.alt = ''; im.decoding = 'async'; im.src = src;
        stage.appendChild(im);
      });
    }
    function retarget() {
      if (box.hidden) return;
      const f = wanted();
      if (still()) { ensureStills(); stage.dataset.pose = f === F_FRONT ? 'front' : f === F_TURN ? 'turn' : 'rest'; return; }
      if (!atlas) { if (f) loadAtlas(); return; }
      if (mode === 'wrap') return;                       // finishes by itself, then calls retarget() again
      if (mode === 'intro' && f === 0) return;           // nobody is hovering: let the opening clip finish
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
      if (atlas) { drawn = -1; draw(0); }
      stage.dataset.pose = 'rest';
    }
    // The sheet is fetched when she first appears (after the page is idle); it is never fetched in still mode.
    function warm() { (window.requestIdleCallback || (f => setTimeout(f, 1200)))(() => loadAtlas()); }

    /* ---------- words ---------- */
    const lines = [
      '慢慢读，不着急。',
      '若不知走哪，请注重脚下。',
      '点我旁边的目录按钮，可以换背景、调字体。',
      '读累了就休息一下，眼睛也需要留白。',
      '喜欢哪一节，可以点标题旁的链接分享。',
      '今天也有在进步吗？哪怕一点点也好。'
    ];
    let timer = 0, li = -1;
    function say(text, ms) {
      bubble.textContent = T(text);
      bubble.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => bubble.classList.remove('show'), ms || 4200);
    }
    function talk() { li = (li + 1 + Math.floor(Math.random() * (lines.length - 1))) % lines.length; say(lines[li]); }
    function greet() {
      const h = new Date().getHours();
      say(h < 6 ? '这么晚还在读，记得早点休息。' : h < 11 ? '早安，今天读点什么？' : h < 14 ? '午安，读完记得歇一会儿。' : h < 18 ? '下午好，配一杯茶刚好。' : '晚上好，适合安静地读点东西。');
    }

    /* Lean gently toward the cursor. */
    addEventListener('pointermove', e => {
      if (box.hidden || still()) return;
      const r = stage.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 700));
      const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 700));
      stage.style.transform = 'rotateY(' + (dx * 9).toFixed(2) + 'deg) rotateX(' + (-dy * 5).toFixed(2) + 'deg)';
    }, { passive: true });

    stage.addEventListener('mouseenter', playIntro);
    stage.addEventListener('click', () => { playIntro(); talk(); });
    stage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playIntro(); talk(); } });

    /* ---------- contents + back-to-top ----------
       The contents button drives the article's real toggle, so its panel, scroll-spy and Esc/close behaviour stay
       exactly as they were. */
    const realToggle = () => document.querySelector('#main .reader-toc-toggle');
    function reflect() {
      const t = realToggle();
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
      const t = realToggle();
      if (t) t.click();
      requestAnimationFrame(reflect);
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
    peek.addEventListener('click', () => { write(false); sync(); setTimeout(() => { playIntro(); say('我回来了。', 2400); }, 350); });

    /* Show only where there is room: a reading page, a wide screen, and a left margin beside the article. */
    function room() {
      const a = document.querySelector('#sourceArticleBody, #main .article-body');
      return !!a && a.getBoundingClientRect().left >= 240;
    }
    let lastHash = '', greeted = false, frame = 0;
    function sync() {
      frame = 0;
      const on = reading() && WIDE.matches && room();
      const hidden = read();
      const wasHidden = box.hidden;
      box.hidden = !on || hidden;
      peek.hidden = !on || !hidden;
      root.classList.toggle('luliy-mascot-on', !box.hidden); // CSS hides the article's own floating buttons while she carries them
      if (box.hidden) { bubble.classList.remove('show'); root.classList.remove('luliy-toc-open'); if (!wasHidden) reset(); return; }
      if (wasHidden) warm();
      reflect();
      decoratePanel();
      if (location.hash !== lastHash) {
        lastHash = location.hash;
        setTimeout(() => { playIntro(); if (!greeted) { greeted = true; greet(); } }, 900);
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };

    function mount() {
      document.body.append(box, peek);
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
      const avatar = el('img', 'lj-avatar'); avatar.src = '/favicon.svg'; avatar.alt = ''; avatar.width = 40; avatar.height = 40; avatar.decoding = 'async';
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
        const counts = new Map();
        items.forEach(i => tagsOf(i).forEach(g => counts.set(g, (counts.get(g) || 0) + 1)));
        const list = st.tag ? items.filter(i => i.labels.includes(st.tag)) : items;
        if (!items.length) {
          const box = el('div', 'lj-empty');
          box.append(el('p', null, J.failed ? L('暂时读不到短札，请稍后刷新重试。', 'Journal is temporarily unavailable. Please retry.', '短札を読み込めません。後でもう一度お試しください。')
            : L('还没有短札。', 'No notes yet.', 'まだ短札はありません。')));
          if (!J.failed) box.append(el('p', 'lj-hint', L('在 Gmeek 新建一个 Issue，加上 journal 标签，发布后这里就会出现。标题随便写，不会显示。', 'Create a Gmeek Issue with the label “journal” and it will appear here. The title is not shown.', 'Gmeek で journal ラベルの Issue を作ると、ここに表示されます。タイトルは表示されません。')));
          feed.append(box); wrap.append(feed); return;
        }
        if (!list.length) {
          const box = el('div', 'lj-empty'); box.append(el('p', null, L('这个标签下还没有短札。', 'No notes under this tag yet.', 'このタグの短札はまだありません。')));
          const a = el('a', 'lj-back', '← ' + L('全部短札', 'All notes', 'すべての短札')); a.href = jl({}); box.append(a); feed.append(box);
        }
        let more = null;
        const add = () => {
          const from = feed.querySelectorAll('.lj-note').length, to = Math.min(list.length, from + PAGE);
          for (let i = from; i < to; i++) feed.insertBefore(buildNote(list[i], false), more);
          if (more) { if (to >= list.length) more.remove(); else more.textContent = L('载入更多', 'Load more', 'さらに表示'); }
          return to;
        };
        if (list.length > PAGE) { more = el('button', 'lj-more', L('载入更多', 'Load more', 'さらに表示')); more.type = 'button'; more.addEventListener('click', () => { const first = feed.querySelectorAll('.lj-note').length; add(); feed.querySelectorAll('.lj-note')[first]?.querySelector('a')?.focus?.({ preventScroll: true }); }); feed.append(more); }
        add();
        // side: tags + count
        side.append(el('h2', 'lj-side-title', L('标签', 'Tags', 'タグ')));
        const nav = el('nav', 'lj-tagnav'); nav.setAttribute('aria-label', L('短札标签', 'Journal tags', '短札のタグ'));
        const all = el('a', null, L('全部', 'All', 'すべて')); all.href = jl({}); if (!st.tag) all.setAttribute('aria-current', 'page');
        all.append(el('span', null, String(items.length))); nav.append(all);
        [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN')).forEach(([g, n]) => {
          const a = el('a', null, g); a.href = jl({ tag: g }); if (st.tag === g) a.setAttribute('aria-current', 'page'); a.append(el('span', null, String(n))); nav.append(a);
        });
        side.append(nav);
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
    sync();
  })();

})();
