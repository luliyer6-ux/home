/* 数学二公式背诵：复用现有 333 张已筛选公式卡，不改动真题作答记录。 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'math2-formula-study-v1';
  const state = { cards: [], visible: [], selected: '', revealed: false, records: {}, loaded: false };
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (saved && typeof saved === 'object' && saved.records && typeof saved.records === 'object') state.records = saved.records;
  } catch { /* 本机存储被禁用时仍可背诵 */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({version: 1, records: state.records})); } catch { $('formulaMessage').textContent = '无法在本机保存背诵进度，请检查浏览器存储空间。'; } };
  const record = id => state.records[id] || {};
  const heading = card => String(card.topic || '').split('/').map(s => s.trim()).filter(Boolean);
  const subject = card => heading(card)[0] || '其他';
  function latex(value) {
    const fragments = [];
    const text = escapeHTML(value).replace(/\\\(([^]*?)\\\)/g, (_, body) => {
      try { fragments.push(window.katex.renderToString(body, {throwOnError:false, trust:false, strict:'ignore'})); }
      catch { fragments.push('<code>' + escapeHTML(body) + '</code>'); }
      return '\uE000' + (fragments.length - 1) + '\uE001';
    });
    return text.replace(/\uE000(\d+)\uE001/g, (_, n) => fragments[Number(n)]).replace(/\n/g, '<br>');
  }
  function formulaLatex(value) {
    const source = String(value || '').trim();
    try {
      return window.katex.renderToString('\\begin{aligned}' + source + '\\end{aligned}', {displayMode:true, throwOnError:false, trust:false, strict:'ignore'});
    } catch { return '<pre>' + escapeHTML(source) + '</pre>'; }
  }
  function summary() {
    const known = state.cards.filter(card => record(card.id).known).length;
    const favorites = state.cards.filter(card => record(card.id).favorite).length;
    $('formulaSummary').textContent = `${state.cards.length} 张公式卡 · 已会 ${known} · 待背 ${state.cards.length - known} · 收藏 ${favorites}`;
    $('formulaTabCount').textContent = String(state.cards.length);
  }
  function filter() {
    const topic = $('formulaTopic').value, status = $('formulaStatus').value;
    const query = $('formulaSearch').value.trim().toLocaleLowerCase();
    state.visible = state.cards.filter(card => {
      if (topic && subject(card) !== topic) return false;
      const r = record(card.id);
      if (status === 'due' && r.known || status === 'known' && !r.known || status === 'favorite' && !r.favorite) return false;
      if (!query) return true;
      return [card.title, card.topic, card.formula, card.conditions, card.pitfalls, card.example].some(value => String(value || '').toLocaleLowerCase().includes(query));
    });
    if (!state.visible.some(card => card.id === state.selected)) { state.selected = state.visible[0]?.id || ''; state.revealed = false; }
    renderList(); renderCard(); summary();
  }
  function renderList() {
    const root = $('formulaList');
    if (!state.visible.length) { root.innerHTML = '<p class="formula-empty">没有符合条件的公式卡。调整筛选或搜索试试。</p>'; return; }
    root.innerHTML = state.visible.map((card, i) => `<button class="formula-list-item${card.id === state.selected ? ' selected' : ''}" type="button" data-card="${escapeHTML(card.id)}" ${card.id === state.selected ? 'aria-current="true"' : ''}><span class="formula-list-number">${i + 1}</span><span class="formula-list-name">${escapeHTML(card.title)}</span><span class="formula-list-mark">${record(card.id).favorite ? '★' : ''}${record(card.id).known ? '✓' : ''}</span></button>`).join('');
  }
  function renderCard() {
    const root = $('formulaCard'), card = state.cards.find(c => c.id === state.selected);
    if (!card) { root.innerHTML = '<p class="formula-empty">选择一张公式卡开始背诵。</p>'; return; }
    const index = state.visible.findIndex(c => c.id === card.id), r = record(card.id);
    const details = [
      ['适用条件', card.conditions], ['易错点', card.pitfalls], ['例题', card.example]
    ].filter(([, value]) => String(value || '').trim());
    root.innerHTML = `<div class="formula-card-meta"><span>${escapeHTML(heading(card).join(' / '))}</span><span>${index + 1} / ${state.visible.length}</span></div><h2>${escapeHTML(card.title)}</h2><div class="formula-answer" ${state.revealed ? '' : 'hidden'}><div class="formula-expression">${formulaLatex(card.formula)}</div>${details.map(([label, value]) => `<section class="formula-detail"><h3>${label}</h3><p>${latex(value)}</p></section>`).join('')}</div><div class="formula-concealed" ${state.revealed ? 'hidden' : ''}>先回忆公式，再显示内容。</div><div class="formula-card-actions"><button type="button" data-action="prev" ${index <= 0 ? 'disabled' : ''}>上一张</button><button type="button" class="primary" data-action="reveal">${state.revealed ? '隐藏公式' : '显示公式'}</button><button type="button" data-action="next" ${index >= state.visible.length - 1 ? 'disabled' : ''}>下一张</button></div><div class="formula-card-actions secondary"><button type="button" data-action="again" ${!state.revealed ? 'disabled' : ''}>还要再背</button><button type="button" data-action="known" ${!state.revealed ? 'disabled' : ''}>${r.known ? '取消已会' : '已会'}</button><button type="button" data-action="favorite" aria-pressed="${!!r.favorite}">${r.favorite ? '★ 已收藏' : '☆ 收藏'}</button></div>`;
  }
  function select(id) {
    state.selected = id; state.revealed = false; renderList(); renderCard();
    const list = $('formulaList'), active = list.querySelector('[aria-current="true"]'), scroller = matchMedia('(max-width:700px)').matches ? list : list.parentElement;
    if (active && scroller) {
      if (matchMedia('(max-width:700px)').matches) scroller.scrollLeft = Math.max(0, active.offsetLeft - scroller.offsetLeft - 10);
      else scroller.scrollTop = Math.max(0, active.offsetTop - scroller.offsetTop - 10);
    }
  }
  function move(step) { const at = state.visible.findIndex(c => c.id === state.selected); if (at + step >= 0 && at + step < state.visible.length) select(state.visible[at + step].id); }
  async function load() {
    if (state.loaded) return;
    $('formulaMessage').textContent = '正在读取公式卡…';
    try {
      const parts = await Promise.all([1, 2, 3, 4].map(async n => { const response = await fetch(`./math2-formulas-${n}.json`); if (!response.ok) throw Error(`第 ${n} 部分加载失败`); return response.json(); }));
      state.cards = parts.flatMap(part => part.cards || []);
      if (state.cards.length !== 333 || new Set(state.cards.map(card => card.id)).size !== 333) throw Error('公式卡数量或编号不完整');
      const topics = [...new Set(state.cards.map(subject))];
      $('formulaTopic').innerHTML = '<option value="">全部章节</option>' + topics.map(topic => `<option value="${escapeHTML(topic)}">${escapeHTML(topic)}</option>`).join('');
      state.loaded = true; $('formulaMessage').textContent = '';
      filter();
    } catch (error) {
      $('formulaMessage').textContent = `公式库加载失败：${error.message}。`;
      $('formulaList').innerHTML = '<button type="button" id="formulaRetry">重新加载</button>';
      $('formulaRetry').onclick = load;
    }
  }
  function show(view) {
    const formula = view === 'formula';
    document.body.classList.toggle('formula-mode', formula);
    $('examView').hidden = formula; $('formulaView').hidden = !formula;
    $('examTab').classList.toggle('active', !formula); $('formulaTab').classList.toggle('active', formula);
    $('examTab').toggleAttribute('aria-current', !formula); $('formulaTab').toggleAttribute('aria-current', formula);
    history.replaceState(null, '', location.pathname + location.search + (formula ? '#formulas' : ''));
    scrollTo({top: 0, behavior: 'instant'});
    if (formula) load();
  }
  $('examTab').onclick = () => show('exam'); $('formulaTab').onclick = () => show('formula');
  $('formulaTopic').onchange = filter; $('formulaStatus').onchange = filter; $('formulaSearch').oninput = filter;
  $('formulaList').onclick = event => { const button = event.target.closest('[data-card]'); if (button) select(button.dataset.card); };
  $('formulaCard').onclick = event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action || !state.selected) return;
    if (action === 'prev') return move(-1);
    if (action === 'next') return move(1);
    if (action === 'reveal') { state.revealed = !state.revealed; renderCard(); return; }
    const r = {...record(state.selected)};
    if (action === 'favorite') r.favorite = !r.favorite;
    if (action === 'known') r.known = !r.known;
    if (action === 'again') r.known = false;
    state.records[state.selected] = r; save(); filter();
    if (action === 'again' || action === 'known') move(1);
  };
  $('formulaReset').onclick = () => {
    if (!confirm('重置本轮“已会”标记？收藏会保留。')) return;
    for (const item of Object.values(state.records)) item.known = false;
    save(); filter(); $('formulaMessage').textContent = '本轮已重置，可以重新背诵。';
  };
  document.addEventListener('keydown', event => {
    if ($('formulaView').hidden || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName || '')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  if (location.hash === '#formulas') show('formula');
})();
