/* 网址直达年份（和 408 页的 ?year=&q= 一致），给数学二和英语二用。
   数学二：/works/math2/?year=2019&q=15     q 是第几题（1 开始）
   英语二：/works/gpt-english-2-exams.html?year=2024&part=reading
           part 可选 cloze 完形 / reading 阅读 / newtype 新题型 / translation 翻译 / smallWriting 小作文 / largeWriting 大作文 / full 综合卷
   页面自己的初始化不动；这里只在初始化完成后切到指定年份。参数不合法就什么都不做。
   直接在仓库里维护（不是本机源工程生成的），见 docs/LULIY-建站与维护指南.md 第 15.13 节。 */
(() => {
  let p;
  try { p = new URLSearchParams(location.search); } catch (e) { return; }
  const year = (p.get('year') || '').trim();
  if (!/^\d{4}$/.test(year)) return;
  const exam = document.body && document.body.dataset.exam;
  const $ = id => document.getElementById(id);
  // 等页面把年份下拉框填好再动手，最多等 8 秒
  const waitFor = (test, done) => {
    const t0 = Date.now();
    (function tick() {
      let ok = false;
      try { ok = test(); } catch (e) {}
      if (ok) { done(); return; }
      if (Date.now() - t0 < 8000) setTimeout(tick, 80);
    })();
  };

  if (exam === 'math2') {
    const q = Number(p.get('q'));
    waitFor(() => { const s = $('yearSelect'); return s && s.options.length > 0 && $('questionContent') && $('questionContent').childElementCount > 0; }, () => {
      const s = $('yearSelect');
      if (![...s.options].some(o => o.value === year)) return;
      if (s.value !== year) { s.value = year; s.dispatchEvent(new Event('change', { bubbles: true })); }
      if (Number.isInteger(q) && q >= 1) {
        // 题号按钮由 app.js 渲染在 #questionGrid 里，按顺序点第 q 个
        waitFor(() => $('yearSelect').value === year && $('questionGrid') && $('questionGrid').querySelectorAll('button').length >= q, () => {
          const b = $('questionGrid').querySelectorAll('button')[q - 1];
          if (b) b.click();
        });
      }
    });
    return;
  }

  if (exam === 'english') {
    const TYPES = ['cloze', 'reading', 'newtype', 'translation', 'smallWriting', 'largeWriting', 'full'];
    const part = TYPES.includes(p.get('part')) ? p.get('part') : null;
    waitFor(() => window.E2Complete && typeof window.E2Complete.select === 'function' && window.E2Complete.active, () => {
      const E = window.E2Complete;
      const type = part || E.active.type || 'cloze';
      if (E.active.year === year && E.active.type === type) return;
      Promise.resolve(E.select(type, year, 'practice')).catch(() => {});
    });
  }
})();
