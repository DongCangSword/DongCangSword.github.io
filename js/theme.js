/* ============================================================
   theme.js —— 日夜间主题切换（1.2s 刷屏过渡）
   ============================================================ */
(function() {
  'use strict';
  const S = window.DCS.state;

  function setTheme(theme, animate = true) {
    if (theme === S.currentTheme) return;
    S.currentTheme = theme;
    localStorage.setItem('dcs_theme', theme);
    const icon = document.querySelector('#theme-toggle .icon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.classList.add('rotated');
      setTimeout(() => btn.classList.remove('rotated'), 600);
    }
    const apply = () => document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    if (animate && !S.reduced) {
      const overlay = document.getElementById('theme-transition');
      overlay.classList.remove('active');
      void overlay.offsetWidth;
      overlay.classList.add('active');
      setTimeout(apply, 100);
    } else {
      apply();
    }
  }

  window.DCS.theme = {
    setTheme,
    init() {
      const saved = localStorage.getItem('dcs_theme');
      if (saved) setTheme(saved, false);
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark', false);
      else setTheme('light', false);
      document.getElementById('theme-toggle').addEventListener('click', () => {
        setTheme(S.currentTheme === 'light' ? 'dark' : 'light', true);
      });
    }
  };
})();
