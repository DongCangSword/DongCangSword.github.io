/* ============================================================
   main.js —— 启动编排、卡片事件委托、汉堡菜单
   ============================================================ */
(function() {
  'use strict';
  const DCS = window.DCS, S = DCS.state, DATA = window.DCS_DATA;

  // ---------- 汉堡菜单（挂到 DCS.ui 供 router 调用） ----------
  function openMobileMenu() {
    document.getElementById('mobile-menu').classList.add('open');
    document.getElementById('hamburger').classList.add('active');
    document.getElementById('hamburger').setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  window.DCS.ui = { openMobileMenu, closeMobileMenu };

  // ---------- 卡片按钮：document 级事件委托（动态渲染后无需重绑） ----------
  function initCardDelegation() {
    document.addEventListener('click', function(e) {
      const L = DATA.LANG[S.currentLang];
      const apkBtn = e.target.closest('[data-apk]');
      if (apkBtn) {
        const id = apkBtn.dataset.apk;
        if (confirm(L.confirm_download.replace('{id}', id))) {
          alert(L.alert_download.replace('{id}', id));
        }
        return;
      }
      const viewBtn = e.target.closest('[data-view]');
      if (viewBtn) {
        const u = viewBtn.dataset.view;
        if (u && u !== '#') window.open(u, '_blank'); // 直跳网页地址
        return;
      }
      const detailBtn = e.target.closest('[data-detail]');
      if (detailBtn && DCS.modal) {
        DCS.modal.open(detailBtn.dataset.detail); // 打开详情弹窗
      }
    });
  }

  // ---------- 启动 ----------
  function boot() {
    DCS.theme.init();      // 1. 主题（先行，避免闪白）
    DCS.router.init();     // 2. 路由：解析 hash、激活容器
    DCS.i18n.init();       // 3. 语言静态文案
    DCS.render.all();      // 4. 动态渲染（含页尾按钮状态）
    DCS.fx.init();         // 5. canvas / 时钟 / 故障 / 轮播
    initCardDelegation();  // 6. 卡片事件委托

    // 汉堡菜单
    const hb = document.getElementById('hamburger');
    if (hb) {
      hb.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.contains('open') ? closeMobileMenu() : openMobileMenu();
      });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });

    console.log('🟢 DONGCANGSWORD://v4.0 SPA（推入过渡）已加载');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
