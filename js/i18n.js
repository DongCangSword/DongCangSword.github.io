/* ============================================================
   i18n.js —— 多语言（简 / 繁 / EN）
   ============================================================ */
(function() {
  'use strict';
  const DCS = window.DCS, S = DCS.state, DATA = window.DCS_DATA;

  /** 仅更新静态文案（data-i18n 元素 + 头衔轮播 + 语言按钮标签） */
  function applyTexts(lang) {
    if (!DATA.LANG[lang]) return;
    S.currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (DATA.LANG[lang][key] !== undefined) el.textContent = DATA.LANG[lang][key];
    });
    S.rotatingIndex = 0;
    const list = DATA.LANG[lang].home_rotating || ['移动端开发'];
    const rot = document.getElementById('rotating-text');
    if (rot) rot.textContent = list[0];
    const idx = DATA.LANG_LIST.indexOf(lang);
    const label = document.getElementById('lang-label');
    if (label && idx !== -1) label.textContent = DATA.LANG_LABELS[idx];
  }

  /** 完整切换：静态文案 + 动态渲染 + 指示条位置重算 */
  function setLanguage(lang) {
    if (!DATA.LANG[lang]) return;
    localStorage.setItem('dcs_lang', lang);
    applyTexts(lang);
    DCS.render.all();
    if (DCS.router.refreshNextButton) DCS.router.refreshNextButton();  // ★ 新增：同步按钮文案
    // 文本宽度变化后指示条需要重算
    requestAnimationFrame(() => {
      if (DCS.router && DCS.router.refreshIndicator) DCS.router.refreshIndicator();
    });
  }

  window.DCS.i18n = {
    init() {
      const saved = localStorage.getItem('dcs_lang');
      const lang = (saved && DATA.LANG_LIST.indexOf(saved) !== -1) ? saved : DATA.LANG_LIST[0];
      applyTexts(lang);   // 首次只更新文案，渲染交给 main.js 统一执行
      document.getElementById('lang-toggle').addEventListener('click', () => {
        const next = DATA.LANG_LIST[(DATA.LANG_LIST.indexOf(S.currentLang) + 1) % DATA.LANG_LIST.length];
        setLanguage(next);
      });
    },
    setLanguage
  };
})();
