/**
 * DONGCANGSWORD v4.0 —— SPA 版
 * 基于 Hash 路由：#index / #works / #skills / #about
 * 所有跳转通过 location.hash 完成，hashchange 驱动页面切换
 * 浏览器前进/后退按钮由 hashchange 原生支持
 */
(function() {
  'use strict';

  // ============================================================
  // 0. 环境探测
  // ============================================================
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOVERABLE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ============================================================
  // 1. 数据（与 MPA 版一致，折叠展示）
  // ============================================================
  const ANDROID_PROJECTS = [
    { id: '01', name: '【替换】项目 Alpha', desc: '【替换】智能家居控制中心，支持多设备联动', tags: ['Kotlin', 'Jetpack Compose', 'MQTT'], badge: '安卓' },
    { id: '02', name: '【替换】项目 Beta', desc: '【替换】健身追踪应用，实时心率与运动分析', tags: ['Java', 'MVP', 'Room'], badge: '安卓' },
    { id: '03', name: '【替换】项目 Gamma', desc: '【替换】跨平台笔记工具，端到端加密同步', tags: ['Flutter', 'Dart', 'SQLite'], badge: '安卓' },
    { id: '04', name: '【替换】项目 Delta', desc: '【替换】AR 虚拟试衣间，实时肢体追踪', tags: ['React Native', 'TypeScript', 'ARKit'], badge: '安卓' }
  ];
  const WEB_PROJECTS = [
    { id: '05', name: '【替换】项目 Epsilon', desc: '【替换】数据可视化仪表盘，实时大屏展示', tags: ['React', 'TypeScript', 'D3'], badge: '网页' },
    { id: '06', name: '【替换】项目 Zeta', desc: '【替换】电商平台 PWA，离线优先架构', tags: ['Vue', 'Nuxt', 'Tailwind'], badge: '网页' },
    { id: '07', name: '【替换】项目 Eta', desc: '【替换】企业级协同白板，多人实时编辑', tags: ['Angular', 'RxJS', 'WebSocket'], badge: '网页' },
    { id: '08', name: '【替换】项目 Theta', desc: '【替换】轻量级博客系统，SSG 静态生成', tags: ['Svelte', 'Tailwind', 'Markdown'], badge: '网页' },
    { id: '09', name: '【替换】项目 Iota', desc: '【替换】AI 对话界面，流式响应与记忆管理', tags: ['Next.js', 'GraphQL', 'Vercel'], badge: '网页' }
  ];
  const TECH_DATA = {
    mobile: [
      { name: 'Kotlin / Java', pct: 88 },
      { name: 'Flutter / Dart', pct: 72 },
      { name: 'React Native', pct: 65 },
      { name: 'Android SDK', pct: 82 },
      { name: '性能优化', pct: 70 }
    ],
    frontend: [
      { name: 'React / Next.js', pct: 90 },
      { name: 'Vue / Nuxt', pct: 76 },
      { name: 'TypeScript', pct: 85 },
      { name: 'CSS / Tailwind', pct: 80 },
      { name: 'Web 性能', pct: 68 }
    ]
  };
  const ABOUT_TEXT = {
    'zh-CN': '<p>东仓刀，独立开发者与设计师。专注移动端与前端领域，追求简洁、高效、有温度的数字产品。</p><p>坚信技术是解决问题的工具，设计是传递价值的桥梁。持续探索人机交互的边界，致力于打造兼具美感与实用性的作品。</p><p>业余时间喜欢骑行、摄影，以及研究各种新奇的小众技术。</p>',
    'zh-TW': '<p>東倉刀，獨立開發者與設計師。專注移動端與前端領域，追求簡潔、高效、有溫度的數位產品。</p><p>堅信技術是解決問題的工具，設計是傳遞價值的橋樑。持續探索人機互動的邊界，致力於打造兼具美感與實用性的作品。</p><p>業餘時間喜歡騎行、攝影，以及研究各種新奇的小眾技術。</p>',
    'en': '<p>Dongcangsword, independent developer and designer. Focus on mobile and front-end, pursuing clean, efficient, and human-centered digital products.</p><p>Believe that technology is a tool to solve problems, and design is a bridge to convey value. Continuously exploring the boundaries of human-computer interaction, committed to creating works that blend aesthetics and practicality.</p><p>In spare time, enjoy cycling, photography, and researching novel niche technologies.</p>'
  };
  const CONTACTS = [
    { icon: '✉️', label: 'dongcang@example.com', href: 'mailto:dongcang@example.com' },
    { icon: '🐙', label: 'github.com/dongcangsword', href: 'https://github.com/dongcangsword' },
    { icon: '📝', label: 'blog.dongcang.dev', href: 'https://blog.dongcang.dev' },
    { icon: '📍', label: '中国 · 上海', href: '#' }
  ];
  const LANG = {
    'zh-CN': {
      nav_home: '首页', nav_work: '作品集', nav_tech: '技术栈', nav_about: '关于我',
      work_title: '精选项目', work_desc: '移动端与网页领域的实践探索',
      work_android: 'ANDROID / 安卓应用', work_web: 'WEB / 网页作品',
      tech_title: '技能图谱', tech_desc: '持续打磨的技术能力',
      tech_mobile: '📱 移动端', tech_frontend: '🌐 前端',
      about_title: '关于东仓刀',
      footer_note: '所有内容仅供展示 · 纯静态',
      btn_download: '⬇ 下载 APK', btn_preview: '◻ 预览', btn_detail: '详情 →',
      mock_placeholder: '📱 样机占位 · ',
      confirm_download: '确认下载 {id} 的 APK 文件？',
      alert_download: '[占位] 下载 {id}.apk (链接待替换)',
      alert_preview: '[占位] 预览 {id} (链接待替换)',
      alert_detail: '[占位] 查看 {id} 详情',
      home_title: '东仓刀',
      home_rotating: ['移动端开发', '前端设计', '全栈探索']
    },
    'zh-TW': {
      nav_home: '首頁', nav_work: '作品集', nav_tech: '技術棧', nav_about: '關於我',
      work_title: '精選項目', work_desc: '移動端與網頁領域的實踐探索',
      work_android: 'ANDROID / 安卓應用', work_web: 'WEB / 網頁作品',
      tech_title: '技能圖譜', tech_desc: '持續打磨的技術能力',
      tech_mobile: '📱 行動端', tech_frontend: '🌐 前端',
      about_title: '關於東倉刀',
      footer_note: '所有內容僅供展示 · 純靜態',
      btn_download: '⬇ 下載 APK', btn_preview: '◻ 預覽', btn_detail: '詳情 →',
      mock_placeholder: '📱 樣機佔位 · ',
      confirm_download: '確認下載 {id} 的 APK 檔案？',
      alert_download: '[佔位] 下載 {id}.apk (連結待替換)',
      alert_preview: '[佔位] 預覽 {id} (連結待替換)',
      alert_detail: '[佔位] 查看 {id} 詳情',
      home_title: '東倉刀',
      home_rotating: ['移動端開發', '前端設計', '全棧探索']
    },
    'en': {
      nav_home: 'Home', nav_work: 'Portfolio', nav_tech: 'Tech Stack', nav_about: 'About',
      work_title: 'Selected Projects', work_desc: 'Explorations in mobile and web',
      work_android: 'ANDROID / Apps', work_web: 'WEB / Websites',
      tech_title: 'Skill Map', tech_desc: 'Continuously honed abilities',
      tech_mobile: '📱 Mobile', tech_frontend: '🌐 Frontend',
      about_title: 'About Dongcangsword',
      footer_note: 'All content for demo · static',
      btn_download: '⬇ Download APK', btn_preview: '◻ Preview', btn_detail: 'Details →',
      mock_placeholder: '📱 Mockup · ',
      confirm_download: 'Confirm download APK for {id}?',
      alert_download: '[Placeholder] Download {id}.apk (link to replace)',
      alert_preview: '[Placeholder] Preview {id} (link to replace)',
      alert_detail: '[Placeholder] View {id} details',
      home_title: 'Dongcangsword',
      home_rotating: ['Mobile Dev', 'Frontend Design', 'Full Stack']
    }
  };

  // ============================================================
  // 2. 全局状态
  // ============================================================
  let currentLang = 'zh-CN';
  let currentTheme = 'light';
  let rotatingIndex = 0;
  // 路由相关
  const ROUTES = ['index', 'works', 'skills', 'about'];
  const PAGE_IDS = { index: 'page-index', works: 'page-works', skills: 'page-skills', about: 'page-about' };
  let currentRoute = null;          // 当前激活的页面 key
  let isTransitioning = false;      // 是否正处于切换过渡中
  let activeContainer = null;       // 当前激活的 .page-container DOM

  const $  = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // ============================================================
  // 3. 主题切换（沿用）
  // ============================================================
  function setTheme(theme, animate = true) {
    if (theme === currentTheme) return;
    currentTheme = theme;
    localStorage.setItem('dcs_theme', theme);
    const icon = document.querySelector('#theme-toggle .icon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.classList.add('rotated');
      setTimeout(() => btn.classList.remove('rotated'), 600);
    }
    if (animate) {
      const overlay = document.getElementById('theme-transition');
      overlay.classList.remove('active');
      void overlay.offsetWidth;
      overlay.classList.add('active');
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
      }, 100);
    } else {
      document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    }
  }
  const savedTheme = localStorage.getItem('dcs_theme');
  if (savedTheme) setTheme(savedTheme, false);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark', false);
  else setTheme('light', false);
  document.getElementById('theme-toggle').addEventListener('click', () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light', true);
  });

  // ============================================================
  // 4. 语言切换（SPA 下依然工作，因为 data-i18n 在 DOM 中全量存在）
  // ============================================================
  const LANG_LIST = ['zh-CN', 'zh-TW', 'en'];
  const LANG_LABELS = ['简', '繁', 'EN'];
  let langIndex = 0;
  const savedLang = localStorage.getItem('dcs_lang');
  if (savedLang) {
    const idx = LANG_LIST.indexOf(savedLang);
    if (idx !== -1) langIndex = idx;
  }
  function setLanguage(lang) {
    if (!LANG[lang]) return;
    currentLang = lang;
    localStorage.setItem('dcs_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (LANG[lang][key] !== undefined) el.textContent = LANG[lang][key];
    });
    const list = LANG[lang].home_rotating || ['移动端开发', '前端设计', '全栈探索'];
    rotatingIndex = 0;
    const rotatingEl = document.getElementById('rotating-text');
    if (rotatingEl) rotatingEl.textContent = list[0];
    window._rotatingList = list;
    renderProjects();
    renderTech();
    renderAbout();
    const label = document.getElementById('lang-label');
    if (label) label.textContent = LANG_LABELS[langIndex];
  }
  setLanguage(LANG_LIST[langIndex]);
  document.getElementById('lang-toggle').addEventListener('click', function() {
    langIndex = (langIndex + 1) % LANG_LIST.length;
    setLanguage(LANG_LIST[langIndex]);
  });
  if (document.getElementById('rotating-text')) {
    setInterval(() => {
      const list = window._rotatingList || LANG[currentLang].home_rotating || ['移动端开发'];
      rotatingIndex = (rotatingIndex + 1) % list.length;
      const el = document.getElementById('rotating-text');
      if (el) el.textContent = list[rotatingIndex];
    }, 3000);
  }

  // ============================================================
  // 5. 时钟 + 版本
  // ============================================================
  function updateClock() {
    const now = new Date();
    const clock = document.getElementById('clock');
    if (clock) clock.textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
  }
  setInterval(updateClock, 1000);
  updateClock();
  const buildEl = document.getElementById('build-version');
  if (buildEl) buildEl.textContent = 'DCS_3.0.1';
  const footerBuild = document.getElementById('footer-build');
  if (footerBuild) footerBuild.textContent = 'BUILD DCS_3.0.1';

  // ============================================================
  // 6. 首页故障效果
  // ============================================================
  const homeTitle = document.getElementById('home-title');
  if (homeTitle) {
    homeTitle.addEventListener('mouseenter', function() {
      this.classList.add('glitch');
      setTimeout(() => this.classList.remove('glitch'), 200);
    });
  }

  // ============================================================
  // 7. 动态背景（仅首页容器内存在）
  // ============================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let targetX = 0, targetY = 0;
    let animId = null;
    function initParticles() {
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor((w * h) / 15000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 1,
          alpha: Math.random() * 0.3 + 0.1
        });
      }
    }
    function drawBg() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const dx = (targetX - w/2) * 0.015;
      const dy = (targetY - h/2) * 0.015;
      const color = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || 'rgba(0,0,0,0.15)';
      for (const p of particles) {
        p.x += p.vx + dx * 0.006;
        p.y += p.vy + dy * 0.006;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
          const dx2 = particles[i].x - particles[j].x;
          const dy2 = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx2*dx2 + dy2*dy2);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = color.replace('0.15', String(0.04 * (1 - dist/100)));
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(drawBg);
    }
    function startBg() {
      if (REDUCED) { canvas.style.display = 'none'; return; }
      initParticles();
      if (animId) cancelAnimationFrame(animId);
      drawBg();
    }
    document.addEventListener('mousemove', (e) => { targetX = e.clientX; targetY = e.clientY; });
    document.addEventListener('mouseleave', () => { targetX = window.innerWidth/2; targetY = window.innerHeight/2; });
    window.addEventListener('resize', () => { if (particles.length) initParticles(); });
    startBg();
  }

  // ============================================================
  // 7.5 错峰入场引擎（root 必须指定为当前激活的滚动容器，
  //     否则 SPA 下 IntersectionObserver 默认以 viewport 为根，
  //     而所有容器都堆叠在视口内，会全部一次性触发）
  // ============================================================
  let revealIO = null;
  let revealBatch = [];
  let revealFlushScheduled = false;

  function ensureRevealIO() {
    if (revealIO) return revealIO;
    const root = activeContainer || document.getElementById('app');
    revealIO = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        revealBatch.push(en.target);
        revealIO.unobserve(en.target);
      }
      if (revealBatch.length && !revealFlushScheduled) {
        revealFlushScheduled = true;
        requestAnimationFrame(() => {
          revealBatch.forEach((el, i) => {
            el.style.setProperty('--d', (120 + Math.min(i * 80, 480)) + 'ms');
            el.classList.add(el.classList.contains('reveal-fade') ? 'reveal-fade-in' : 'reveal-in');
            el.addEventListener('animationend', () => {
              el.classList.remove('reveal', 'reveal-in', 'reveal-fade', 'reveal-fade-in');
              el.style.opacity = '1';
              el.style.transform = 'none';
            }, { once: true });
          });
          revealBatch = [];
          revealFlushScheduled = false;
        });
      }
    }, {
      root: root,                // ★ 关键：以当前激活容器为根
      threshold: 0.08,
      rootMargin: '0px 0px -6% 0px'
    });
    return revealIO;
  }

  function reveal(el, type = 'reveal') {
    if (!el) return;
    if (REDUCED) { el.style.opacity = '1'; return; }
    el.classList.add(type);
    ensureRevealIO().observe(el);
  }

  // 路由切换后需要重建 observer（root 变了）
  function resetRevealIO() {
    if (revealIO) { revealIO.disconnect(); revealIO = null; }
    revealBatch = [];
  }

  // ============================================================
  // 7.6 卡片 3D 倾斜
  // ============================================================
  function attachTilt(card) {
    if (!HOVERABLE || REDUCED) return;
    let raf = null;
    card.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add('tilting');
        card.style.transform =
          'perspective(900px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' +
          (px * 7).toFixed(2) + 'deg) translateY(-4px)';
      });
    });
    card.addEventListener('mouseleave', () => {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      card.classList.remove('tilting');
      card.style.transform = '';
    });
  }

  // ============================================================
  // 8. Hash 路由核心（★ SPA 的关键改动）
  // ============================================================
  function parseHash() {
    const h = (window.location.hash || '').replace(/^#/, '').toLowerCase();
    return ROUTES.indexOf(h) !== -1 ? h : 'index';
  }

  function getContainer(key) {
    return document.getElementById(PAGE_IDS[key]);
  }

  /**
   * 页面过渡：先让旧容器 exit（2s 淡出 + 方向位移），
   * 再让新容器 enter（2s 淡入 + 反方向位移进入）
   */
  function transitionTo(oldKey, newKey, dir) {
    const oldEl = oldKey ? getContainer(oldKey) : null;
    const newEl = getContainer(newKey);
    const DUR = REDUCED ? 10 : 2000;   // 与 CSS --transition-speed 保持一致

    // —— 1. 旧页出场 ——
    if (oldEl && oldEl !== newEl) {
      oldEl.classList.add('exit');
      oldEl.classList.add(dir === 'back' ? 'exit-to-below' : 'exit-to-above');
      // 等 CSS 过渡完成后清理状态（visibility 由 CSS 过渡延迟处理）
      setTimeout(() => {
        oldEl.classList.remove('active', 'exit', 'exit-to-above', 'exit-to-below');
      }, DUR + 50);
    }

    // —— 2. 新页入场 ——
    // 初始姿态：向前翻 = 从下方进场；向后翻 = 从上方进场
    newEl.classList.remove('active', 'exit', 'exit-to-above', 'exit-to-below');
    newEl.classList.add(dir === 'back' ? 'enter-from-above' : 'enter-from-below');
    // 强制 reflow 让浏览器记录初始姿态
    void newEl.offsetWidth;
    // 触发过渡
    requestAnimationFrame(() => requestAnimationFrame(() => {
      newEl.classList.add('active');
      newEl.classList.remove('enter-from-above', 'enter-from-below');
      // 新页滚回顶部
      newEl.scrollTop = 0;
    }));

    activeContainer = newEl;
    currentRoute = newKey;

    // 重建 IntersectionObserver（root 变了）
    resetRevealIO();
    // 触发新页内的错峰 + 进度条重置
    setupPageInteractions(newEl);
    const bar = document.getElementById('scroll-progress');
    if (bar) bar.style.width = '0%';

    // 冷却期防抖
    isTransitioning = true;
    setTimeout(() => { isTransitioning = false; }, DUR);
  }

  /** 路由主入口：读 hash → 决定方向 → 切换容器 → 更新导航 */
  function route() {
    const key = parseHash();
    if (key === currentRoute) return;
    const oldIdx = currentRoute ? ROUTES.indexOf(currentRoute) : -1;
    const newIdx = ROUTES.indexOf(key);
    const dir = (oldIdx !== -1 && newIdx < oldIdx) ? 'back' : 'forward';
    transitionTo(currentRoute, key, dir);
    updateNavActive(key);
  }

  /** 首次进入：若无 hash 或 hash 非法，重定向到 #index */
  function boot() {
    const h = (window.location.hash || '').replace(/^#/, '').toLowerCase();
    if (ROUTES.indexOf(h) === -1) {
      // 直接替换 hash 而不留历史记录
      window.location.replace('#index');
      return; // hashchange 会再次触发 route()
    }
    // 首次加载：直接激活，无过渡
    const key = parseHash();
    const el = getContainer(key);
    el.classList.add('active');
    activeContainer = el;
    currentRoute = key;
    updateNavActive(key);
    setupPageInteractions(el);
  }

  // 监听 hashchange + 首次执行
  window.addEventListener('hashchange', route);
  boot();

  // ============================================================
  // 8.5 导航链接（href="#xxx"）
  // hash 变化会自动触发 hashchange → route()
  // 这里只需：① 关闭移动端菜单 ② 防止与当前页重复点击
  // ============================================================
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      const target = hash.replace(/^#/, '').toLowerCase();
      // 已在该页面则不处理
      if (target === currentRoute) { e.preventDefault(); closeMobileMenu(); return; }
      // 允许默认行为（改 hash），让 hashchange 接管
      closeMobileMenu();
    });
  });

  /** 根据当前路由高亮导航 + 移动指示条 */
  function updateNavActive(key) {
    $$('#nav-links a, #mobile-menu a').forEach(a => {
      const target = (a.getAttribute('href') || '').replace(/^#/, '').toLowerCase();
      a.classList.toggle('active', target === key);
    });
    updateIndicator();
  }
  function updateIndicator() {
    const activeLink = document.querySelector('#nav-links a.active');
    const indicator = document.getElementById('nav-indicator');
    if (activeLink && indicator) {
      const rect = activeLink.getBoundingClientRect();
      const navRect = document.getElementById('navbar').getBoundingClientRect();
      indicator.style.left = (rect.left - navRect.left) + 'px';
      indicator.style.width = rect.width + 'px';
    }
  }
  window.addEventListener('load', updateIndicator);
  window.addEventListener('resize', updateIndicator);
  // 字体加载完成后重算一次
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateIndicator);
  }

  // ============================================================
  // 8.6 页面级交互（进度条 / 视差 / 边界手势翻页 / 导航毛玻璃投影）
  //     每个容器独立挂载一次
  // ============================================================
  function setupPageInteractions(container) {
    if (!container || container.dataset.bound === '1') return;
    container.dataset.bound = '1';   // 防止重复挂监听

    const key = container.dataset.page;
    const idx = ROUTES.indexOf(key);
    const TOP_EPS = 2;
    const BOTTOM_EPS = 2;
    const EDGE_DELTA_TRIGGER = 140;
    const EDGE_RESET_MS = 400;
    const SWIPE_DIST = 60;
    const COOLDOWN_MS = 1200;

    let entryCooldownUntil = performance.now() + 600;
    let edgeAccum = 0;
    let edgeResetTimer = null;

    function gotoBoundary(down) {
      if (isTransitioning) return;
      const nextIdx = down ? idx + 1 : idx - 1;
      if (nextIdx < 0 || nextIdx >= ROUTES.length) return;
      entryCooldownUntil = performance.now() + COOLDOWN_MS;
      // ★ SPA 中：改 hash → hashchange → route()
      window.location.hash = ROUTES[nextIdx];
    }

    function normDelta(e) {
      if (e.deltaMode === 1) return e.deltaY * 33;
      if (e.deltaMode === 2) return e.deltaY * 400;
      return e.deltaY;
    }

    // —— 滚轮边界翻页 ——
    container.addEventListener('wheel', (e) => {
      const now = performance.now();
      if (isTransitioning || now < entryCooldownUntil) { edgeAccum = 0; return; }
      const delta = normDelta(e);
      if (delta === 0) return;
      const atTop = container.scrollTop <= TOP_EPS;
      const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - BOTTOM_EPS;
      const down = delta > 0;
      if ((down && !atBottom) || (!down && !atTop)) { edgeAccum = 0; return; }
      edgeAccum += delta;
      clearTimeout(edgeResetTimer);
      edgeResetTimer = setTimeout(() => { edgeAccum = 0; }, EDGE_RESET_MS);
      if (Math.abs(edgeAccum) < EDGE_DELTA_TRIGGER) return;
      edgeAccum = 0;
      gotoBoundary(down);
    }, { passive: true });

    // —— 触摸边界翻页 ——
    let tStartX = 0, tStartY = 0, tTracking = false;
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) { tTracking = false; return; }
      tStartX = e.touches[0].clientX;
      tStartY = e.touches[0].clientY;
      tTracking = true;
    }, { passive: true });
    container.addEventListener('touchcancel', () => { tTracking = false; }, { passive: true });
    container.addEventListener('touchend', (e) => {
      if (!tTracking) return;
      tTracking = false;
      if (isTransitioning) return;
      if (performance.now() < entryCooldownUntil) return;
      const t = e.changedTouches[0];
      const dy = tStartY - t.clientY;
      const dx = tStartX - t.clientX;
      if (Math.abs(dy) < SWIPE_DIST || Math.abs(dy) < Math.abs(dx) * 1.2) return;
      const atTop = container.scrollTop <= TOP_EPS;
      const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - BOTTOM_EPS;
      if (dy > 0 && atBottom) gotoBoundary(true);
      else if (dy < 0 && atTop) gotoBoundary(false);
    }, { passive: true });

    // —— 滚动视差 + 进度条 + 导航毛玻璃投影 ——
    if (!REDUCED) {
      let ticking = false;
      container.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = container.scrollTop;
          container.querySelectorAll('.work-section-title, .tech-col h3').forEach(el => {
            el.style.transform = 'translateY(' + (y * 0.05).toFixed(1) + 'px)';
          });
          const max = container.scrollHeight - container.clientHeight;
          const bar = document.getElementById('scroll-progress');
          if (bar) bar.style.width = (max > 8 ? (y / max) * 100 : 0) + '%';
          const nav = document.getElementById('navbar');
          if (nav) nav.classList.toggle('glass-deep', y > 8);
          ticking = false;
        });
      }, { passive: true });
    }

    // —— 静态标题错峰淡入 ——
    if (!container.dataset.revealed) {
      container.dataset.revealed = '1';
      container.querySelectorAll('.section-label, .section-title, .section-desc, .work-section-title')
        .forEach(el => reveal(el, 'reveal-fade'));
    }
  }

  // ============================================================
  // 8.7 汉堡菜单
  // ============================================================
  function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger');
    if (menu.classList.contains('open')) closeMobileMenu();
    else openMobileMenu();
  }
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
  const hamburger = document.getElementById('hamburger');
  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });

  // ============================================================
  // 9. 动态渲染（卡片/技能/关于）
  //    卡片按钮改用事件委托，避免每次渲染都重新绑定
  // ============================================================
  function renderProjects() {
    const androidGrid = document.getElementById('android-grid');
    const webGrid = document.getElementById('web-grid');
    if (!androidGrid && !webGrid) return;
    const lang = currentLang;

    function createCard(project, isAndroid) {
      const card = document.createElement('div');
      card.className = 'work-card';
      const btnText = isAndroid ? LANG[lang].btn_download : LANG[lang].btn_preview;
      const actionAttr = isAndroid ? 'data-apk' : 'data-preview';
      card.innerHTML = `
        <div class="card-top"><span class="card-num">${project.id}</span><span class="card-badge">${project.badge}</span></div>
        <div class="card-name">${project.name}</div>
        <div class="card-desc">${project.desc}</div>
        <div class="card-tags">${project.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="card-mock">${LANG[lang].mock_placeholder}${project.id}</div>
        <div class="card-actions">
          <button class="primary" ${actionAttr}="${project.id}">${btnText}</button>
          <button class="secondary" data-detail="${project.id}">${LANG[lang].btn_detail}</button>
        </div>
      `;
      return card;
    }

    if (androidGrid) {
      androidGrid.innerHTML = '';
      ANDROID_PROJECTS.forEach(p => androidGrid.appendChild(createCard(p, true)));
    }
    if (webGrid) {
      webGrid.innerHTML = '';
      WEB_PROJECTS.forEach(p => webGrid.appendChild(createCard(p, false)));
    }

    // 错峰入场 + 3D 倾斜
    document.querySelectorAll('.work-card').forEach((card) => {
      reveal(card, 'reveal');
      attachTilt(card);
    });
  }

  function renderTech() {
    const grid = document.getElementById('tech-grid');
    if (!grid) return;
    const lang = currentLang;
    grid.innerHTML = '';

    const col1 = document.createElement('div');
    col1.className = 'tech-col';
    const h1 = document.createElement('h3');
    h1.textContent = LANG[lang].tech_mobile;
    reveal(h1, 'reveal-fade');
    col1.appendChild(h1);
    TECH_DATA.mobile.forEach(item => {
      const div = document.createElement('div');
      div.className = 'tech-item';
      div.innerHTML = `<div class="tech-label"><span>${item.name}</span><span class="pct">${item.pct}%</span></div><div class="tech-bar"><div class="fill" data-pct="${item.pct}" style="width:0%"></div></div>`;
      reveal(div, 'reveal');
      col1.appendChild(div);
    });
    grid.appendChild(col1);

    const col2 = document.createElement('div');
    col2.className = 'tech-col';
    const h2 = document.createElement('h3');
    h2.textContent = LANG[lang].tech_frontend;
    reveal(h2, 'reveal-fade');
    col2.appendChild(h2);
    TECH_DATA.frontend.forEach(item => {
      const div = document.createElement('div');
      div.className = 'tech-item';
      div.innerHTML = `<div class="tech-label"><span>${item.name}</span><span class="pct">${item.pct}%</span></div><div class="tech-bar"><div class="fill" data-pct="${item.pct}" style="width:0%"></div></div>`;
      reveal(div, 'reveal');
      col2.appendChild(div);
    });
    grid.appendChild(col2);

    // 进度条填充 —— root 指向当前激活容器
    const fills = grid.querySelectorAll('.fill');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const pct = parseFloat(el.dataset.pct);
          setTimeout(() => { el.style.width = pct + '%'; }, 200);
          obs.unobserve(el);
        }
      });
    }, { root: activeContainer || document.getElementById('app'), threshold: 0.3 });
    fills.forEach(el => obs.observe(el));
  }

  function renderAbout() {
    const textContainer = document.getElementById('about-text');
    const contactsContainer = document.getElementById('about-contacts');
    if (!textContainer && !contactsContainer) return;
    if (textContainer) textContainer.innerHTML = ABOUT_TEXT[currentLang] || ABOUT_TEXT['zh-CN'];
    if (contactsContainer) {
      contactsContainer.innerHTML = '';
      CONTACTS.forEach(c => {
        const a = document.createElement('a');
        a.href = c.href;
        a.innerHTML = `<span class="icon">${c.icon}</span> ${c.label}`;
        if (c.href === '#') a.addEventListener('click', (e) => e.preventDefault());
        reveal(a, 'reveal');
        contactsContainer.appendChild(a);
      });
    }
  }

  // ============================================================
  // 10. 卡片按钮事件委托（★ SPA 下卡片是动态生成的，
  //     集中委托在 document 上，语言切换后无需重新绑定）
  // ============================================================
  document.addEventListener('click', function(e) {
    const apkBtn = e.target.closest('[data-apk]');
    if (apkBtn) {
      const id = apkBtn.dataset.apk;
      if (confirm(LANG[currentLang].confirm_download.replace('{id}', id))) {
        alert(LANG[currentLang].alert_download.replace('{id}', id));
      }
      return;
    }
    const previewBtn = e.target.closest('[data-preview]');
    if (previewBtn) {
      const id = previewBtn.dataset.preview;
      alert(LANG[currentLang].alert_preview.replace('{id}', id));
      return;
    }
    const detailBtn = e.target.closest('[data-detail]');
    if (detailBtn) {
      const id = detailBtn.dataset.detail;
      alert(LANG[currentLang].alert_detail.replace('{id}', id));
    }
  });

  // ============================================================
  // 11. 首次渲染
  // ============================================================
  renderProjects();
  renderTech();
  renderAbout();

  console.log('🟢 DONGCANGSWORD://v4.0 SPA 已加载');
})();
