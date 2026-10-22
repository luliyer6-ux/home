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
    const busy = () => !!(main.querySelector('.reader-toc-toggle[aria-expanded="true"], .article-filter-drawer[open]') || document.querySelector('dialog[open]'));
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
    // CC shows the directory as a plain list (block 11), without the pictures.
    const fill = () => { if (root.dataset.appearance !== 'cc') d.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); }); };
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

  /* 11. CC appearance: the directory becomes a drawer from the right (after the GTA VI site): one plain list with
     the current page in cream, language, theme and a 動態效果 switch on top, Drive, the colophon and the social
     links at the bottom. Tap outside, swipe right, ×, Esc or back closes it. The other appearances keep the
     full-screen directory with its pictures (they only get the 動態效果 switch while motion is off). */
  (() => {
    const d = document.getElementById('directory');
    if (!d) return;
    const cc = () => root.dataset.appearance === 'cc';
    const lang = () => d.querySelector('#directoryLanguageOptions [aria-pressed="true"]')?.dataset.lang || 'zh-Hant';
    const T = (hant, hans, ja, en) => ({ zh: hans, ja, en })[lang()] || hant;
    const closeButton = () => d.querySelector('[data-close="directory"]');
    const animate = () => !reduced.matches && 'animate' in d && root.dataset.input !== 'keyboard';
    let slide = null, fade = null;
    const stop = () => { slide?.cancel(); fade?.cancel(); slide = fade = null; };
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
      // 文章 › opens 周記 and 編年史 right below it.
      const links = d.querySelector('#directoryLinks'), posts = links?.querySelector('a[href$="/posts"]');
      if (posts && !links.querySelector('.luliy-sub-toggle')) {
        posts.classList.add('luliy-has-sub');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'luliy-sub-toggle';
        b.setAttribute('aria-expanded', 'false');
        b.setAttribute('aria-controls', 'luliyPostsSub');
        b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
        const sub = document.createElement('div');
        sub.className = 'luliy-sub';
        sub.id = 'luliyPostsSub';
        sub.hidden = true;
        b.addEventListener('click', () => { const open = sub.hidden; sub.hidden = !open; b.setAttribute('aria-expanded', String(open)); });
        // (runtime-fixes.py keeps the directory's own preview/keyboard code on a[data-scene], so these extra links are ignored there.)
        sub.addEventListener('click', e => { if (e.target.closest('a')) setTimeout(() => d.open && closeButton()?.click(), 0); });
        posts.after(b, sub);
      }
      // The current page in cream (the directory's own aria-current follows the previewed picture instead).
      const here = location.hash.split('?')[0];
      links?.querySelectorAll('a[data-scene]').forEach(a => a.toggleAttribute('data-luliy-here', a.getAttribute('href') === here));
      const b = links?.querySelector('.luliy-sub-toggle'), sub = links?.querySelector('.luliy-sub');
      if (b && sub) {
        b.setAttribute('aria-label', T('文章分類', '文章分类', '記事の分類', 'Writing sections'));
        const hash = location.hash;
        const items = [['#/posts?view=archive&group=weekly', T('周記', '周记', '週記', 'Weekly')], ['#/posts?view=chronicle', T('編年史', '编年史', '年代記', 'Chronicle')]];
        const html = items.map(([h, t]) => `<a href="${h}"${hash === h || (h.endsWith('chronicle') && /view=chronicle/.test(hash)) ? ' aria-current="page"' : ''}>${t}</a>`).join('');
        if (sub.innerHTML !== html) sub.innerHTML = html;
      }
      // Bottom: 網站說明 next to LULIY Drive, then the footer's social links.
      const left = d.querySelector('.directory-other-left');
      let about = d.querySelector('.luliy-colophon-link');
      if (left && !about) { about = document.createElement('a'); about.className = 'luliy-colophon-link'; about.href = '#/colophon'; left.append(about); }
      if (about) about.textContent = T('網站說明', '网站说明', 'このサイトについて', 'Colophon');
      const bottom = d.querySelector('.directory-bottom'), social = document.querySelector('#contact .contact-social');
      if (bottom && social && !d.querySelector('.luliy-drawer-social')) {
        const copy = social.cloneNode(true);
        copy.className = 'luliy-drawer-social';
        copy.removeAttribute('id');
        copy.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
        // The copied buttons (more contacts, QR code) close the drawer, then press the footer's own button.
        const originals = [...social.querySelectorAll('button')];
        copy.querySelectorAll('button').forEach((btn, i) => btn.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          closeButton()?.click();
          setTimeout(() => originals[i]?.click(), 260);
        }));
        bottom.append(copy);
      }
    };
    const opened = () => {
      if (!d.open) return;
      build();
      if (!cc() || !animate()) return;
      stop();
      slide = d.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 460, easing: 'cubic-bezier(.19,1,.22,1)' });
      try { fade = d.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, pseudoElement: '::backdrop' }); } catch (e) {}
    };
    new MutationObserver(opened).observe(d, { attributes: true, attributeFilter: ['open'] });
    new MutationObserver(() => { if (d.open) build(); }).observe(d.querySelector('#directoryLinks') || d, { childList: true });
    document.addEventListener('luliy:motion', build);
    // Closing: the drawer slides back out while the directory's own close animation runs (180 ms).
    document.addEventListener('click', e => {
      if (!cc() || !d.open || !animate() || !e.target.closest?.('#directory [data-close="directory"]')) return;
      const from = getComputedStyle(d).transform;
      stop();
      slide = d.animate([{ transform: from === 'none' ? 'none' : from }, { transform: 'translateX(100%)' }], { duration: 190, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      try { fade = d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 190, pseudoElement: '::backdrop', fill: 'forwards' }); } catch (e) {}
    }, true);
    d.addEventListener('close', () => { stop(); d.style.transform = ''; });
    // Tap on the dimmed page beside the drawer.
    d.addEventListener('click', e => { if (cc() && e.target === d && e.clientX < d.getBoundingClientRect().left) closeButton()?.click(); });
    // Swipe right to close.
    let x0 = 0, y0 = 0, dx = 0, drag = null;
    d.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dx = 0; drag = cc() ? null : false; }, { passive: true });
    d.addEventListener('touchmove', e => {
      if (drag === false) return;
      const mx = e.touches[0].clientX - x0, my = e.touches[0].clientY - y0;
      if (drag === null) {
        if (Math.abs(mx) < 10 && Math.abs(my) < 10) return;
        drag = mx > 0 && Math.abs(mx) > Math.abs(my) * 1.3;
        if (!drag) return;
      }
      dx = Math.max(0, mx);
      d.style.transform = `translateX(${dx}px)`;
    }, { passive: true });
    d.addEventListener('touchend', () => {
      if (!drag) return;
      drag = null;
      if (dx > 80) { closeButton()?.click(); return; }
      if (animate()) d.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.19,1,.22,1)' });
      d.style.transform = '';
    });
  })();

  /* 12. CC: the browser bar (theme-color) takes the top colour of the night sky instead of the light paper
     colour the CC appearance inherits from the light theme. */
  (() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const SKY = '#1f1f38';
    let plain = meta.content;
    const sync = () => {
      const want = root.dataset.appearance === 'cc' ? SKY : plain;
      if (meta.content !== want) meta.content = want;
    };
    new MutationObserver(() => { if (meta.content !== SKY) plain = meta.content; sync(); }).observe(meta, { attributes: true, attributeFilter: ['content'] });
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-appearance'] });
    sync();
  })();

  /* 13. Directory: the × grows out of the header's =. The directory sets .icon-open in the same frame it opens, so
     its bars would simply appear crossed; .luliy-x is added two frames later, once the = has been drawn, and the
     bars turn (CSS). Closing removes .icon-open first, so the × folds back into = while the directory leaves.
     In CC the drawer's × is lined up with the header button, so the drawer lands with its × where the = was. */
  (() => {
    const d = document.getElementById('directory'), btn = document.getElementById('studyGlobalOpen');
    if (!d) return;
    const align = () => {
      const c = d.querySelector('.plain-close');
      d.style.removeProperty('--luliy-x-dx');
      d.style.removeProperty('--luliy-x-dy');
      if (!c || !btn || root.dataset.appearance !== 'cc') return;
      const h = btn.getBoundingClientRect();
      if (!h.width || h.bottom <= 0) return;
      // The drawer may already be sliding in: measure the button inside it and place the drawer at its final spot.
      const dr = d.getBoundingClientRect(), cr = c.getBoundingClientRect();
      const cx = document.documentElement.clientWidth - dr.width + (cr.left - dr.left) + cr.width / 2;
      const cy = cr.top - dr.top + cr.height / 2;
      d.style.setProperty('--luliy-x-dx', Math.round(h.left + h.width / 2 - cx) + 'px');
      d.style.setProperty('--luliy-x-dy', Math.round(h.top + h.height / 2 - cy) + 'px');
    };
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
      align();
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (d.open && d.classList.contains('icon-open')) d.classList.add('luliy-x');
        });
      });
    };
    new MutationObserver(sync).observe(d, { attributes: true, attributeFilter: ['open', 'class'] });
    addEventListener('resize', () => { if (d.open) align(); });
  })();
})();
