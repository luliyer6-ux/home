/* A shared native fullscreen control for the standalone study tools. */
(() => {
  'use strict';
  if (document.getElementById('siteFullscreenControl')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'siteFullscreenControl';
  button.className = 'site-fullscreen-control';
  button.setAttribute('aria-label', '进入全屏');
  button.setAttribute('aria-pressed', 'false');
  button.title = '进入全屏';
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4"/></svg>';

  const toolbar = document.querySelector('.x-top');
  const more = toolbar?.querySelector('.x-more');
  const actions = document.querySelector('.top-actions');
  const localToolbar = document.querySelector('.toolbar-right');
  if (toolbar) toolbar.insertBefore(button, more || null);
  else if (actions) actions.append(button);
  else if (localToolbar) localToolbar.prepend(button);
  else { button.classList.add('is-floating'); document.body.append(button); }

  const isFullscreen = () => document.fullscreenElement === document.documentElement ||
    document.webkitFullscreenElement === document.documentElement;
  const labels = { enter: '进入全屏', exit: '退出全屏' };
  const update = () => {
    const active = isFullscreen();
    const label = active ? labels.exit : labels.enter;
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', label);
    button.title = label;
    button.innerHTML = active
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4"/></svg>';
  };
  const announceFailure = () => {
    let note = document.getElementById('siteFullscreenStatus');
    if (!note) {
      note = document.createElement('span');
      note.id = 'siteFullscreenStatus';
      note.className = 'site-fullscreen-status';
      note.setAttribute('role', 'status');
      note.setAttribute('aria-live', 'polite');
      document.body.append(note);
    }
    note.textContent = '此浏览器或当前页面暂不支持全屏';
    note.hidden = false;
    clearTimeout(note._hideTimer);
    note._hideTimer = setTimeout(() => { note.hidden = true; }, 3000);
  };
  button.addEventListener('click', async () => {
    try {
      if (isFullscreen()) {
        await (document.exitFullscreen?.() || document.webkitExitFullscreen?.());
      } else if (document.documentElement.requestFullscreen) {
        try { await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); }
        catch { await document.documentElement.requestFullscreen(); }
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else {
        announceFailure();
      }
    } catch {
      announceFailure();
    }
    update();
  });
  document.addEventListener('fullscreenchange', update);
  document.addEventListener('webkitfullscreenchange', update);
  update();
})();
