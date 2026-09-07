/* ============================================================
   interactions.js —— 错峰入场、3D 倾斜、滚动联动、下一页按钮可见性
   （本轮：移除滚轮/触摸边界翻页，改为底部「下一页」按钮点击进入）
   ============================================================ */
(function() {
  'use strict';
  const DCS = window.DCS, S = DCS.state;
  const REVEAL_FADE_SEL = '.section-label, .section-title, .section-desc, .work-section-title, .tech-col h3';
  const REVEAL_SEL = '.work-card, .gallery-card, .tech-item, .about-contacts a';

  // ---------------- 错峰入场引擎（不变） ----------------
  let revealIO = null, revealBatch = [], flushScheduled = false;

  function ensureRevealIO() {
    if (revealIO) return revealIO;
    // root 必须是当前激活容器，否则叠放的四个容器会全部命中
    revealIO = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        revealBatch.push(en.target);
        revealIO.unobserve(en.target);
      }
      if (revealBatch.length && !flushScheduled) {
        flushScheduled = true;
        requestAnimationFrame(() => {
          revealBatch.forEach((el, i) => {
            el.style.setProperty('--d', (120 + Math.min(i * 80, 480)) + 'ms');
            el.classList.add(el.classList.contains('reveal-fade') ? 'reveal-fade-in' : 'reveal-in');
            el.addEventListener('animationend', () => {
              el.classList.remove('reveal', 'reveal-in', 'reveal-fade', 'reveal-fade-in');
              el.style.opacity = '1';
              el.style.transform = '';    // ★ 原为 'none'：清空内联，让 CSS :hover 上浮生效
            }, { once: true });
          });
          revealBatch = [];
          flushScheduled = false;
        });
      }
    }, {
      root: S.activeContainer || document.getElementById('app'),
      threshold: 0.08,
      rootMargin: '0px 0px -6% 0px'
    });
    return revealIO;
  }

  function resetRevealIO() {
    if (revealIO) { revealIO.disconnect(); revealIO = null; }
    revealBatch = [];
  }

  function reveal(el, type = 'reveal') {
    if (!el) return;
    if (S.reduced) { el.style.opacity = '1'; return; }
    el.classList.add(type);
    ensureRevealIO().observe(el);
  }

  function replayReveals(container) {
    resetRevealIO();
    const all = container.querySelectorAll(REVEAL_SEL + ',' + REVEAL_FADE_SEL);
    if (S.reduced) { all.forEach(el => { el.style.opacity = '1'; }); return; }
    const io = ensureRevealIO();
    all.forEach(el => {
      const type = el.matches(REVEAL_FADE_SEL) ? 'reveal-fade' : 'reveal';
      el.classList.remove('reveal', 'reveal-fade', 'reveal-in', 'reveal-fade-in');
      el.classList.add(type);
      el.style.opacity = '';
      el.style.transform = '';
      el.style.setProperty('--d', '0ms');
      io.observe(el);
    });
  }

  // ---------------- 卡片 3D 倾斜（不变） ----------------
  function attachTilt(card) {
    if (!S.hoverable || S.reduced) return;
    let raf = null;
    card.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add('tilting');
        card.style.transform = 'perspective(900px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 7).toFixed(2) + 'deg) translateY(-4px)';
      });
    });
    card.addEventListener('mouseleave', () => {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      card.classList.remove('tilting');
      card.style.transform = '';
    });
  }

  // ---------------- 下一页按钮可见性 ----------------
  const BOTTOM_EPS = 40;   // 距底部 40px 内视为「已到底」
  function updateNextBtn(container) {
    const btn = document.getElementById('next-page-btn');
    if (!btn || !container) return;
    const max = container.scrollHeight - container.clientHeight;
    const atBottom = max <= 8 || container.scrollTop >= max - BOTTOM_EPS;
    btn.classList.toggle('show', atBottom);
  }

  // ---------------- 页面级交互（每容器挂载一次） ----------------
  function setupPageInteractions(container) {
    if (!container || container.dataset.bound === '1') return;
    container.dataset.bound = '1';

    let ticking = false;
    container.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = container.scrollTop;
        if (!S.reduced) {
          container.querySelectorAll('.work-section-title, .tech-col h3').forEach(el => {
            el.style.transform = 'translateY(' + (y * 0.05).toFixed(1) + 'px)';
          });
        }
        const max = container.scrollHeight - container.clientHeight;
        const bar = document.getElementById('scroll-progress');
        if (bar) bar.style.width = (max > 8 ? (y / max) * 100 : 0) + '%';
        const nav = document.getElementById('navbar');
        if (nav) nav.classList.toggle('glass-deep', y > 8);
        updateNextBtn(container);
        ticking = false;
      });
    }, { passive: true });

    if (!container.dataset.revealed) {
      container.dataset.revealed = '1';
      container.querySelectorAll('.section-label, .section-title, .section-desc, .work-section-title')
        .forEach(el => reveal(el, 'reveal-fade'));
    }
  }

  window.DCS.interactions = { reveal, resetRevealIO, replayReveals, attachTilt, setupPageInteractions, updateNextBtn };
})();
