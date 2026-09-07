/* ============================================================
   render.js —— 动态内容渲染
   · 作品卡：技术栈/语言图标标签（chips）
   · 作品墙：瀑布流卡片（renderGallery，多语言标题/描述）
   · 关于我
   （原技术栈页 renderTech 已随页面改造移除）
   ============================================================ */
(function() {
  'use strict';
  const DCS = window.DCS, S = DCS.state, DATA = window.DCS_DATA;

  /* 多语言取值：三语对象按当前语言取，缺语言回退 zh-CN；纯字符串字段原样返回 */
  function pick(m) {
    const lang = S.currentLang || 'zh-CN';
    if (m == null) return '';
    if (typeof m === 'string') return m;
    return m[lang] || m['zh-CN'] || '';
  }

  /* 生成技术标签 HTML：先技术栈（蓝）、后语言（灰） */
  function chips(p) {
    const out = [];
    (p.stack || []).forEach(k => {
      const t = DATA.TECH_ICONS[k];
      if (t) out.push('<span class="tech-chip stack"><img src="' + t.icon + '" alt="' + t.label + '" loading="lazy">' + t.label + '</span>');
    });
    (p.langs || []).forEach(k => {
      const t = DATA.TECH_ICONS[k];
      if (t) out.push('<span class="tech-chip lang"><img src="' + t.icon + '" alt="' + t.label + '" loading="lazy">' + t.label + '</span>');
    });
    return out.join('');
  }

  function renderProjects() {
    const androidGrid = document.getElementById('android-grid');
    const webGrid = document.getElementById('web-grid');
    if (!androidGrid && !webGrid) return;
    const lang = S.currentLang;

    function createAndroidCard(p) {
      const card = document.createElement('div');
      card.className = 'work-card';
      const mockHTML = p.mock
        ? '<img src="' + p.mock + '" alt="' + pick(p.name) + '" loading="lazy" decoding="async">'
        : DATA.LANG[lang].mock_placeholder + p.id;
      card.innerHTML = `
        <div class="card-top"><span class="card-num">${p.id}</span><span class="card-badge">${pick(p.badge)}</span></div>
        <div class="card-name">${pick(p.name)}</div>
        <div class="card-tech">${chips(p)}</div>
        <div class="card-mock${p.mock ? ' has-img' : ''}">${mockHTML}</div>
        <div class="card-actions">
          <button class="primary" data-apk="${p.id}"><span class="svg-ico ico-download"></span>${DATA.LANG[lang].btn_download}</button>
          <button class="secondary" data-detail="${p.id}">${DATA.LANG[lang].btn_detail}</button>
        </div>`;
      /* 样机图加载失败：自动回退占位文字，不出碎图图标 */
      const mImg = card.querySelector('.card-mock img');
      if (mImg) mImg.addEventListener('error', () => {
        card.querySelector('.card-mock').classList.remove('has-img');
        mImg.replaceWith(document.createTextNode(DATA.LANG[lang].mock_placeholder + p.id));
      });
      return card;
    }

    function createWebCard(p) {
      const card = document.createElement('div');
      card.className = 'work-card';
      const mockHTML = p.mock
        ? '<img src="' + p.mock + '" alt="' + pick(p.name) + '" loading="lazy" decoding="async">'
        : DATA.LANG[lang].mock_placeholder + p.id;
      card.innerHTML = `
        <div class="card-top"><span class="card-num">${p.id}</span><span class="card-badge">${pick(p.badge)}</span></div>
        <div class="card-name">${pick(p.name)}</div>
        <div class="card-desc">${pick(p.desc)}</div>
        <div class="card-tech">${chips(p)}</div>
        <div class="card-mock${p.mock ? ' has-img' : ''}">${mockHTML}</div>
        <div class="card-actions">
          <button class="primary" data-view="${p.url}">${DATA.LANG[lang].btn_view}</button>
        </div>`;
      const mImg = card.querySelector('.card-mock img');
      if (mImg) mImg.addEventListener('error', () => {
        card.querySelector('.card-mock').classList.remove('has-img');
        mImg.replaceWith(document.createTextNode(DATA.LANG[lang].mock_placeholder + p.id));
      });
      return card;
    }

    if (androidGrid) {
      androidGrid.innerHTML = '';
      DATA.ANDROID_PROJECTS.forEach(p => androidGrid.appendChild(createAndroidCard(p)));
    }
    if (webGrid) {
      webGrid.innerHTML = '';
      DATA.WEB_PROJECTS.forEach(p => webGrid.appendChild(createWebCard(p)));
    }

    document.querySelectorAll('.work-card').forEach(card => {
      DCS.interactions.reveal(card, 'reveal');
      DCS.interactions.attachTilt(card);
    });
  }

  /* ---------------- 作品墙（瀑布流） ---------------- */
  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    const lang = S.currentLang || 'zh-CN';
    grid.innerHTML = '';
    (DATA.GALLERY || []).forEach(g => {
      const title = (g.title && (g.title[lang] || g.title['zh-CN'])) || '';
      const card = document.createElement('figure');
      card.className = 'gallery-card';
      card.dataset.gid = g.id;
      card.setAttribute('role', 'button');       // 可键盘聚焦
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', title);
      card.innerHTML =
        '<img src="' + g.img + '" alt="" loading="lazy" decoding="async">' +
        '<figcaption class="g-cap">' +
          '<span class="g-title"></span>' +
          '<span class="g-date">' + (g.date || '') + '</span>' +
        '</figcaption>';
      card.querySelector('img').alt = title;     // 安全设置文案（防引号转义问题）
      card.querySelector('.g-title').textContent = title;
      DCS.interactions.reveal(card, 'reveal');  // 复用错峰入场
      grid.appendChild(card);
    });
  }

  function renderAbout() {
    const text = document.getElementById('about-text');
    const contacts = document.getElementById('about-contacts');
    if (text) text.innerHTML = DATA.ABOUT_TEXT[S.currentLang] || DATA.ABOUT_TEXT['zh-CN'];
    if (contacts) {
      contacts.innerHTML = '';
      DATA.CONTACTS.forEach(c => {
        const a = document.createElement('a');
        a.href = c.href;
        a.innerHTML = '<span class="icon">' + c.icon + '</span> ' + c.label;
        if (c.href === '#') a.addEventListener('click', (e) => e.preventDefault());
        DCS.interactions.reveal(a, 'reveal');
        contacts.appendChild(a);
      });
    }
  }
  /* ---- 页尾（fixed 常驻，四页共用）：只负责翻页按钮的状态与事件 ---- */
  /* 翻页顺序 = 页面导航顺序，与 data.js 的 PAGE_IDS 键一致 */
  const PAGE_ORDER = ['index', 'works', 'skills', 'about'];

  function currentPage() {
    const h = (location.hash || '#index').replace(/^#/, '').split('?')[0];
    return h || 'index';
  }

  /* 按当前页更新两按钮：禁用态 + 首页「开始探索」文案 */
  function updateFooterNav() {
    const prevBtn = document.getElementById('footer-prev');
    const nextBtn = document.getElementById('footer-next');
    if (!prevBtn || !nextBtn) return;
    const L = DATA.LANG[S.currentLang] || DATA.LANG['zh-CN'];
    const idx = PAGE_ORDER.indexOf(currentPage());

    prevBtn.disabled = idx <= 0;                                        /* 首页无上一页 */
    nextBtn.disabled = (idx === -1) || (idx >= PAGE_ORDER.length - 1);  /* 末页无下一页 */

    const label = nextBtn.querySelector('.pn-label');
    if (label) label.textContent = (idx === 0)
      ? (L.footer_start || '开始探索')
      : (L.footer_next || '下一页');
  }

  function stepPage(dir) {
    const idx = PAGE_ORDER.indexOf(currentPage());
    if (idx === -1) return;
    const target = PAGE_ORDER[idx + dir];
    if (!target || location.hash === '#' + target) return;
    location.hash = target;          /* 只改 hash，切页/过渡交给现有 router */
  }

  function renderFooter() {
    const year = document.getElementById('footer-year');
    if (year) year.textContent = new Date().getFullYear();

    const prevBtn = document.getElementById('footer-prev');
    const nextBtn = document.getElementById('footer-next');
    if (prevBtn && !prevBtn.dataset.bound) {
      prevBtn.dataset.bound = '1';
      prevBtn.addEventListener('click', () => stepPage(-1));
    }
    if (nextBtn && !nextBtn.dataset.bound) {
      nextBtn.dataset.bound = '1';
      nextBtn.addEventListener('click', () => stepPage(1));
    }
    updateFooterNav();
  }

  /* 路由切页后刷新按钮状态 */
  window.addEventListener('hashchange', updateFooterNav);

  window.DCS.render = { all() { renderProjects(); renderGallery(); renderAbout(); renderFooter(); } };
})();
