/* ============================================================
   fx.js —— Canvas 粒子背景（随路由启停）、时钟、标题故障、版本号
   ============================================================ */
(function() {
  'use strict';
  const S = window.DCS.state;

  // ---------- Canvas 粒子背景（仅首页） ----------
  let canvas, ctx, particles = [], targetX = 0, targetY = 0, rafId = null, running = false;

  function initParticles() {
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor((w * h) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1
      });
    }
  }

  function drawBg() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const dx = (targetX - w / 2) * 0.015;
    const dy = (targetY - h / 2) * 0.015;
    const color = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || 'rgba(0,0,0,0.15)';
    for (const p of particles) {
      p.x += p.vx + dx * 0.006;
      p.y += p.vy + dy * 0.006;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx2 = particles[i].x - particles[j].x;
        const dy2 = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = color.replace('0.15', String(0.04 * (1 - dist / 100)));
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(drawBg);
  }

  function pauseBg() { running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
  function resumeBg() {
    if (S.reduced || running || !canvas) return;
    running = true;
    rafId = requestAnimationFrame(drawBg);
  }

  // ---------- 时钟 ----------
  function updateClock() {
    const el = document.getElementById('clock');
    if (el) el.textContent = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  }

  window.DCS.fx = {
    /** 路由切换回调：离开首页暂停绘制，回到首页恢复（省电） */
    onRouteChange(key) { key === 'index' ? resumeBg() : pauseBg(); },
    init() {
      canvas = document.getElementById('bg-canvas');
      if (canvas && !S.reduced) {
        ctx = canvas.getContext('2d');
        initParticles();
        document.addEventListener('mousemove', (e) => { targetX = e.clientX; targetY = e.clientY; });
        document.addEventListener('mouseleave', () => { targetX = window.innerWidth / 2; targetY = window.innerHeight / 2; });
        window.addEventListener('resize', () => { if (particles.length) initParticles(); });
      } else if (canvas) {
        canvas.style.display = 'none';
      }
      // 时钟
      setInterval(updateClock, 1000);
      updateClock();
      // 版本号
      const b1 = document.getElementById('build-version');
      if (b1) b1.textContent = 'DCS_4.0.0';
      const b2 = document.getElementById('footer-build');
      if (b2) b2.textContent = 'BUILD DCS_4.0.0';
      // 标题故障效果
      const homeTitle = document.getElementById('home-title');
      if (homeTitle) {
        homeTitle.addEventListener('mouseenter', function() {
          this.classList.add('glitch');
          setTimeout(() => this.classList.remove('glitch'), 200);
        });
      }
      // 头衔轮播
      if (document.getElementById('rotating-text')) {
        setInterval(() => {
          const L = window.DCS_DATA.LANG[S.currentLang];
          const list = (L && L.home_rotating) || ['移动端开发'];
          S.rotatingIndex = (S.rotatingIndex + 1) % list.length;
          const el = document.getElementById('rotating-text');
          if (el) el.textContent = list[S.rotatingIndex];
        }, 3000);
      }
    }
  };
})();
