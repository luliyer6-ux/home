/* 数学二真题 · 相关公式面板
 * 依赖：vendor/katex.min.js（index.html 已引入）
 * 数据：./math2-formulas.json（按需加载）+ ./formula-map.json
 * 存储：仅使用独立 key 'math2-formula-panel-v1'（收藏），不触碰主存储 'math2-interactive-study-v1'。
 */
(() => {
  'use strict';
  const PANEL_KEY = 'math2-formula-panel-v1';
  let cachePromise = null;
  let lastQKey = '';

  const readPrefs = () => { try { return JSON.parse(localStorage.getItem(PANEL_KEY) || '{}'); } catch { return {}; } };
  const savePrefs = (p) => { try { localStorage.setItem(PANEL_KEY, JSON.stringify(p)); } catch { /* 忽略 */ } };
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // 先转义 HTML，再把 \(...\) 片段交给 KaTeX（与 app.js mdSafe 同策略）
  function tex(s) {
    const parts = [];
    const safe = esc(s).replace(/\\\(([\s\S]*?)\\\)/g, (_, t) => {
      try { parts.push(window.katex.renderToString(t, { throwOnError: false, trust: false })); }
      catch { parts.push('<code>' + esc(t) + '</code>'); }
      return '@@K' + (parts.length - 1) + '@@';
    });
    return safe.replace(/@@K(\d+)@@/g, (_, i) => parts[Number(i)]).replace(/\n/g, '<br>');
  }

  function loadData() {
    if (!cachePromise) {
      cachePromise = Promise.all([
        Promise.all([1, 2, 3, 4].map((i) => fetch('./math2-formulas-' + i + '.json').then((r) => { if (!r.ok) throw Error('公式库加载失败'); return r.json(); }))).then((parts) => ({ _meta: parts[0]._meta, cards: parts.flatMap((pt) => pt.cards || []) })),
        fetch('./formula-map.json').then((r) => { if (!r.ok) throw Error('映射表加载失败'); return r.json(); }).catch(() => ({ version: 1, mappings: [] })),
      ]).then(([formulas, map]) => {
        const cardsById = {};
        for (const c of formulas.cards || []) cardsById[c.id] = c;
        const mapByQ = {};
        for (const m of map.mappings || []) {
          const key = m.year + ':' + m.qno;
          const ids = (m.formula_ids || []).filter((id) => cardsById[id]);
          if (ids.length) mapByQ[key] = ids;
        }
        return { cardsById, mapByQ };
      });
    }
    return cachePromise;
  }

  function ensureShell() {
    let ov = document.getElementById('formulaOverlay');
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = 'formulaOverlay';
    ov.className = 'formula-overlay';
    ov.hidden = true;
    ov.innerHTML =
      '<div class="formula-backdrop" data-close></div>' +
      '<aside class="formula-panel" role="dialog" aria-modal="true" aria-label="相关公式">' +
      '<div class="formula-head"><strong id="formulaTitle">相关公式</strong>' +
      '<button class="formula-close" data-close aria-label="关闭">×</button></div>' +
      '<div id="formulaBody" class="formula-body"><p class="muted">加载中…</p></div>' +
      '</aside>';
    document.body.appendChild(ov);
    ov.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', (e) => {
      const o = document.getElementById('formulaOverlay');
      if (e.key === 'Escape' && o && !o.hidden) close();
    });
    return ov;
  }

  function cardHTML(c) {
    const prefs = readPrefs();
    const fav = !!(prefs.favorites && prefs.favorites[c.id]);
    const hasExample = c.example && c.example !== '源数据无，需后补';
    return '<article class="formula-card">' +
      '<div class="formula-topic">' + tex(c.topic) + (c.importance ? ' · ' + esc(c.importance) : '') + '</div>' +
      '<h4 class="formula-name">' + tex(c.title) + '</h4>' +
      '<div class="formula-tex">' + tex(c.formula) + '</div>' +
      '<details class="formula-sec" open><summary>适用条件</summary><div>' + tex(c.conditions) + '</div></details>' +
      (hasExample ? '<details class="formula-sec"><summary>例子</summary><div>' + tex(c.example) + '</div></details>' : '') +
      '<details class="formula-sec"><summary>常见误用</summary><div>' + tex(c.pitfalls) + '</div></details>' +
      '<button class="formula-fav" data-fav="' + esc(c.id) + '" aria-pressed="' + fav + '">' + (fav ? '★ 已收藏' : '☆ 收藏') + '</button>' +
      '</article>';
  }

  async function open(year, q) {
    const ov = ensureShell();
    const body = ov.querySelector('#formulaBody');
    ov.querySelector('#formulaTitle').textContent = year + ' 年 · ' + (q.label || ('第 ' + q.n + ' 题')) + ' · 相关公式';
    body.innerHTML = '<p class="muted">公式库加载中…</p>';
    ov.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('open')));
    document.body.classList.add('formula-open');
    try {
      const { cardsById, mapByQ } = await loadData();
      const ids = mapByQ[year + ':' + q.n] || [];
      body.innerHTML = ids.length
        ? ids.map((id) => cardHTML(cardsById[id])).join('')
        : '<p class="muted">本题暂未关联公式卡。</p>';
      body.querySelectorAll('[data-fav]').forEach((b) => {
        b.onclick = () => {
          const p = readPrefs(); p.favorites = p.favorites || {};
          if (p.favorites[b.dataset.fav]) delete p.favorites[b.dataset.fav]; else p.favorites[b.dataset.fav] = 1;
          savePrefs(p);
          const on = !!p.favorites[b.dataset.fav];
          b.textContent = on ? '★ 已收藏' : '☆ 收藏';
          b.setAttribute('aria-pressed', String(on));
        };
      });
    } catch (e) {
      body.innerHTML = '<p class="error">加载失败：' + esc(e.message) + '</p>';
    }
  }

  function close() {
    const ov = document.getElementById('formulaOverlay');
    if (!ov || ov.hidden) return;
    ov.classList.remove('open');
    document.body.classList.remove('formula-open');
    setTimeout(() => { ov.hidden = true; }, 260);
  }

  // 由 app.js renderQuestion 末尾调用；不触发重渲染，不读写主存储
  function mount(root, q, ctx) {
    if (!q || !root) return;
    const key = ctx.year + ':' + q.n;
    if (key !== lastQKey) { lastQKey = key; close(); }  // 切换题目时自动收起面板
    loadData().then(({ mapByQ }) => {
      const ids = mapByQ[key] || [];
      if (!ids.length || !ctx.allowed) return;      // 无映射或门控未通过：不打扰
      const card = root.querySelector('.question-card');
      if (!card || card.querySelector('[data-formula-btn]')) return;
      const btn = document.createElement('button');
      btn.className = 'formula-entry';
      btn.setAttribute('data-formula-btn', '');
      btn.textContent = '相关公式（' + ids.length + '）';
      btn.onclick = () => open(ctx.year, q);
      const anchor = card.querySelector('[data-explain]');
      if (anchor) anchor.insertAdjacentElement('afterend', btn);
      else card.appendChild(btn);
    }).catch(() => { /* 数据加载失败时静默不显示按钮 */ });
  }

  window.Math2FormulaPanel = { mount, open, close };
})();
