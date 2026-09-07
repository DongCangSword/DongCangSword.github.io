/* ============================================================
   router.js —— Hash 路由 + 导航提示（瞬时切换，无过渡动画）
   ------------------------------------------------------------
   · 页面切换：瞬时显示/隐藏
   · body[data-route] ：当前路由属性，供 CSS 按路由控制页脚显隐
   · 首页：底部中央静态文字提示（点击 → works）
   · works/skills：滚动到最底部出现「下一页」按钮（点击 → 下一页）
     · index 用提示替代按钮；about 是最后一页，无下一页
   · 内页：右下角常驻「回到首页」按钮
   ============================================================ */
(function() {
  'use strict';
  const DCS = window.DCS, S = DCS.state, DATA = window.DCS_DATA;

  const NAV_KEY = { index: 'nav_home', works: 'nav_work', skills: 'nav_tech', about: 'nav_about' };
  const NEXT_LABEL = { 'zh-CN': '下一页', 'zh-TW': '下一頁', 'en': 'Next' };

  function parseHash() {
    const h = (window.location.hash || '').replace(/^#/, '').toLowerCase();
    return DCS.ROUTES.indexOf(h) !== -1 ? h : 'index';
  }
  function getContainer(key) { return document.getElementById(DCS.PAGE_IDS[key]); }

  // ---------------- 三个提示元素（JS 动态挂载，无需改 HTML） ----------------
  function createNavCues() {
    // 首页：底部中央静态文字提示（down.svg 箭头）
    if (!document.getElementById('home-next-hint')) {
      const hint = document.createElement('button');
      hint.id = 'home-next-hint';
      hint.type = 'button';
      hint.setAttribute('aria-label', '进入下一页');
      hint.innerHTML = '<span class="txt"></span><span class="chev"><span class="svg-ico ico-down"></span></span>';
      hint.addEventListener('click', () => { window.location.hash = DCS.ROUTES[1]; });   // index → works
      document.body.appendChild(hint);
    }
    // works / skills：滚动到最底部出现（down.svg 箭头）
    if (!document.getElementById('next-page-btn')) {
      const btn = document.createElement('button');
      btn.id = 'next-page-btn';
      btn.type = 'button';
      btn.innerHTML = '<span class="label"></span><span class="svg-ico ico-down"></span>';
      btn.addEventListener('click', () => {
        const idx = DCS.ROUTES.indexOf(S.currentRoute);
        const next = DCS.ROUTES[idx + 1];
        if (next) window.location.hash = next;
      });
      document.body.appendChild(btn);
    }
    // 内页：右下角常驻回到首页（up.svg 箭头）
    if (!document.getElementById('back-home-btn')) {
      const btn = document.createElement('button');
      btn.id = 'back-home-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', '回到首页');
      btn.innerHTML = '<span class="ico"><span class="svg-ico ico-up"></span></span><span class="txt"></span>';
      btn.addEventListener('click', () => { window.location.hash = 'index'; });
      document.body.appendChild(btn);
    }
  }

  /** 三个提示的文案与显隐（路由/语言切换后调用；保留旧函数名供 i18n 调用） */
  function refreshNextButton() {
    const hint = document.getElementById('home-next-hint');
    const next = document.getElementById('next-page-btn');
    const back = document.getElementById('back-home-btn');
    const L = DATA.LANG[S.currentLang] || DATA.LANG['zh-CN'];
    const idx = DCS.ROUTES.indexOf(S.currentRoute);
    const nextKey = DCS.ROUTES[idx + 1] || null;

    if (hint) {
      hint.querySelector('.txt').textContent = L.home_next_hint || '继续探索';
      hint.classList.toggle('show', S.currentRoute === 'index');
    }
    if (next) {
      if (idx > 0 && nextKey) {              // 仅 works / skills 启用
        const name = L[NAV_KEY[nextKey]] || nextKey;
        next.querySelector('.label').textContent = (NEXT_LABEL[S.currentLang] || '下一页') + ' · ' + name;
        next.style.display = '';
        if (S.activeContainer) DCS.interactions.updateNextBtn(S.activeContainer);
      } else {
        next.style.display = 'none';         // 首页（用提示）与 about（无下一页）
      }
    }
    if (back) {
      back.querySelector('.txt').textContent = L.back_home || '回到首页';
      back.classList.toggle('show', S.currentRoute !== 'index');
    }
  }

  // ---------------- 路由切换（瞬时，无动画） ----------------
  function switchTo(oldKey, newKey) {
    const oldEl = oldKey ? getContainer(oldKey) : null;
    const newEl = getContainer(newKey);
    if (!newEl || newEl === oldEl) return;

    if (oldEl) {
      if (oldEl.getAnimations) oldEl.getAnimations().forEach(a => a.cancel());
      oldEl.classList.remove('active');
      oldEl.scrollTop = 0;                   // 离开时复位，下次进入从头开始
    }
    newEl.classList.add('active');
    newEl.scrollTop = 0;

    S.activeContainer = newEl;
    S.currentRoute = newKey;
    document.body.dataset.route = newKey;    // ★ 供 CSS 控制页脚等（仅 about 显示）

    DCS.interactions.resetRevealIO();
    DCS.interactions.setupPageInteractions(newEl);
    DCS.interactions.replayReveals(newEl);
    refreshNextButton();

    const bar = document.getElementById('scroll-progress');
    if (bar) bar.style.width = '0%';
    if (DCS.fx && DCS.fx.onRouteChange) DCS.fx.onRouteChange(newKey);
  }

  function activateInitial(key) {
    const el = getContainer(key);
    el.classList.add('active');
    S.activeContainer = el;
    S.currentRoute = key;
    document.body.dataset.route = key;       // ★ 首次加载/刷新时也要挂上
    updateNavActive(key);
    DCS.interactions.setupPageInteractions(el);
    DCS.interactions.replayReveals(el);
    refreshNextButton();
    if (DCS.fx && DCS.fx.onRouteChange) DCS.fx.onRouteChange(key);
  }

  function route() {
    const key = parseHash();
    if (key === S.currentRoute) return;
    if (!S.currentRoute) { activateInitial(key); return; }
    switchTo(S.currentRoute, key);
    updateNavActive(key);
  }

  // ---------------- 导航高亮 + 蓝色指示条 ----------------
  function updateNavActive(key) {
    DCS.$$('#nav-links a, #mobile-menu a').forEach(a => {
      const target = (a.getAttribute('href') || '').replace(/^#/, '').toLowerCase();
      a.classList.toggle('active', target === key);
    });
    updateIndicator();
  }
  function updateIndicator() {
    const activeLink = document.querySelector('#nav-links a.active');
    const indicator = document.getElementById('nav-indicator');
    if (!activeLink || !indicator) return;
    // 指示条是 #navbar 直接子级，计算也以 #navbar 矩形为基准 —— 两者一致，不会错位
    const nr = document.getElementById('navbar').getBoundingClientRect();
    const r = activeLink.getBoundingClientRect();
    indicator.style.left = (r.left - nr.left) + 'px';
    indicator.style.width = r.width + 'px';
  }
  function bindNavLinks() {
    DCS.$$('[data-nav]').forEach(link => {
      link.addEventListener('click', function(e) {
        const hash = this.getAttribute('href');
        if (!hash || !hash.startsWith('#')) return;
        const target = hash.replace(/^#/, '').toLowerCase();
        if (DCS.ui && DCS.ui.closeMobileMenu) DCS.ui.closeMobileMenu();
        if (target === S.currentRoute) { e.preventDefault(); return; }
        // 不同页：放行默认行为改 hash → hashchange → route()
      });
    });
  }

  window.DCS.router = {
    updateIndicator,
    refreshIndicator: updateIndicator,
    refreshNextButton,
    init() {
      createNavCues();
      window.addEventListener('hashchange', route);
      const h = (window.location.hash || '').replace(/^#/, '').toLowerCase();
      if (DCS.ROUTES.indexOf(h) === -1) {
        // 无/非法 hash：无痕重定向到 #index（route() 对重复激活幂等）
        try { window.location.replace('#index'); } catch (e) { window.location.hash = 'index'; }
      }
      activateInitial(parseHash());
      bindNavLinks();
      window.addEventListener('resize', () => {
        updateIndicator();
        if (S.activeContainer) DCS.interactions.updateNextBtn(S.activeContainer);
      });
      window.addEventListener('load', updateIndicator);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateIndicator);
    }
  };
})();
