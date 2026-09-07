/* ============================================================
   gallery.js —— 作品墙交互：Lightbox + 悬停/长按预览浮窗
   ------------------------------------------------------------
   · 点击卡片 → 全屏 Lightbox（Esc / 点遮罩 / 点 × 关闭）
   · PC（hover:hover 设备）：悬停卡片 → 跟随鼠标的毛玻璃预览浮窗
   · 触摸：长按 500ms → 预览浮窗；移动 >10px 判定为滚动自动取消；
     松手即隐藏；长按产生的 click 被吞掉，不会误开 Lightbox
   · 事件全部委托在 document 上：语言切换重渲染卡片不影响绑定
   · 卡片可键盘聚焦，Enter / Space 打开 Lightbox（无障碍）
   ============================================================ */
(function() {
  'use strict';
  const DCS = window.DCS, S = DCS.state, DATA = window.DCS_DATA;

  const HOVERABLE = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  let lb = null, lbImg, lbTitle, lbDate, lbDesc;   // Lightbox 元素
  let pv = null, pvImg, pvTitle, pvGid = null;     // 预览浮窗元素
  let lockedContainer = null, lastFocus = null;
  let suppressClick = false;   // 长按成立后置 true：吞掉松手紧随的 click
  let pressTimer = null;      // 长按 500ms 计时器
  let touchXY = null;         // touchstart 起始坐标（区分滚动与长按）
  let pvRaf = null;           // 浮窗跟随鼠标的 rAF 节流

  const findItem = id => (DATA.GALLERY || []).find(g => g.id === id);
  const curLang  = () => S.currentLang || 'zh-CN';
  const pick     = m => (m && (m[curLang()] || m['zh-CN'])) || '';

  /* ================= Lightbox ================= */

  function buildLightbox() {
    if (lb) return;
    lb = document.createElement('div');
    lb.id = 'lightbox-overlay';
    lb.innerHTML = `
      <button id="lb-close" type="button" aria-label="关闭"><span class="svg-ico ico-close"></span></button>
      <figure class="lb-figure">
        <img id="lb-img" alt="">
        <figcaption>
          <div id="lb-title"></div>
          <div id="lb-date"></div>
          <p id="lb-desc"></p>
        </figcaption>
      </figure>`;
    document.body.appendChild(lb);
    lbImg   = lb.querySelector('#lb-img');
    lbTitle = lb.querySelector('#lb-title');
    lbDate  = lb.querySelector('#lb-date');
    lbDesc  = lb.querySelector('#lb-desc');

    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    lb.querySelector('#lb-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
    });
  }

  function openLightbox(id) {
    const g = findItem(id);
    if (!g) return;
    buildLightbox();
    hidePreview();                                   // 打开大图前先收掉预览浮窗
    lbImg.src   = g.imgLarge || g.img;               // imgLarge 可选：有则大图用高清版
    lbImg.alt   = pick(g.title);
    lbTitle.textContent = pick(g.title);
    lbDate.textContent  = g.date || '';
    lbDesc.textContent  = pick(g.desc);
    lb.classList.add('open');
    lockedContainer = S.activeContainer;             // 锁定当前页滚动
    if (lockedContainer) lockedContainer.style.overflow = 'hidden';
    lastFocus = document.activeElement;
    lb.querySelector('#lb-close').focus();
  }

  function closeLightbox() {
    if (!lb || !lb.classList.contains('open')) return;
    lb.classList.remove('open');
    if (lockedContainer) { lockedContainer.style.overflow = ''; lockedContainer = null; }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ================= 预览浮窗 ================= */

  function buildPreview() {
    if (pv) return;
    pv = document.createElement('div');
    pv.id = 'gallery-preview';
    pv.setAttribute('aria-hidden', 'true');
    pv.innerHTML = '<img id="gp-img" alt=""><div class="gp-title" id="gp-title"></div>';
    document.body.appendChild(pv);
    pvImg   = pv.querySelector('#gp-img');
    pvTitle = pv.querySelector('#gp-title');
  }

  /* 定位：默认在坐标右下方，右侧放不下翻到左侧，整体钳制在视口内 */
  function placePreview(x, y) {
    const w = pv.offsetWidth, h = pv.offsetHeight;
    let left = x + 22, top = y + 22;
    if (left + w > window.innerWidth - 12)  left = x - w - 22;
    if (left < 12) left = 12;
    if (top + h > window.innerHeight - 12)  top = y - h - 22;
    if (top < 12) top = 12;
    pv.style.transform = 'translate(' + Math.round(left) + 'px,' + Math.round(top) + 'px)';
  }

  function showPreview(id, x, y) {
    const g = findItem(id);
    if (!g) return;
    buildPreview();
    if (pvGid !== id) {                              // 同一张不重复设置 src
      pvGid = id;
      pvImg.src = g.img;
      pvImg.alt = pick(g.title);
      pvTitle.textContent = pick(g.title);
    }
    placePreview(x, y);
    pv.classList.add('show');
  }

  function movePreview(x, y) {                       // 鼠标移动：rAF 节流更新位置
    if (pvRaf) return;
    pvRaf = requestAnimationFrame(() => {
      pvRaf = null;
      if (pv && pv.classList.contains('show')) placePreview(x, y);
    });
  }

  function hidePreview() {
    if (pv) pv.classList.remove('show');
  }

  /* ================= 事件绑定（全部委托） ================= */

  function bindEvents() {

    /* 点击 → Lightbox（长按产生的 click 被 suppressClick 吞掉） */
    document.addEventListener('click', e => {
      const card = e.target.closest('.gallery-card');
      if (!card) return;
      if (suppressClick) { suppressClick = false; return; }
      openLightbox(card.dataset.gid);
    });

    /* 键盘：聚焦卡片后 Enter / Space 打开 */
    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const ae = document.activeElement;
      if (ae && ae.classList && ae.classList.contains('gallery-card')) {
        e.preventDefault();
        openLightbox(ae.dataset.gid);
      }
    });

    /* ---- PC 悬停预览（仅 hover:hover 设备启用，避免触屏误触） ---- */
    if (HOVERABLE) {
      document.addEventListener('mouseover', e => {
        const card = e.target.closest('.gallery-card');
        if (card) showPreview(card.dataset.gid, e.clientX, e.clientY);
      });
      document.addEventListener('mousemove', e => {
        if (e.target.closest && e.target.closest('.gallery-card')) movePreview(e.clientX, e.clientY);
      });
      document.addEventListener('mouseout', e => {
        const card = e.target.closest('.gallery-card');
        if (card && !(e.relatedTarget && card.contains(e.relatedTarget))) hidePreview();
      });
    }

    /* ---- 触摸长按预览 ---- */
    document.addEventListener('touchstart', e => {
      const card = e.target.closest('.gallery-card');
      if (!card) return;
      const t = e.touches[0];
      touchXY = { x: t.clientX, y: t.clientY };
      clearTimeout(pressTimer);
      pressTimer = setTimeout(() => {
        suppressClick = true;                        // 长按成立：吞掉松手后的 click
        showPreview(card.dataset.gid, touchXY.x, touchXY.y);
      }, 500);
    }, { passive: true });

    document.addEventListener('touchmove', e => {
      if (!touchXY) return;
      const t = e.touches[0];
      if (Math.abs(t.clientX - touchXY.x) > 10 || Math.abs(t.clientY - touchXY.y) > 10) {
        clearTimeout(pressTimer);                    // 判定为滚动：取消长按
        suppressClick = false;
        hidePreview();
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
      hidePreview();                                 // 松手即隐藏
      setTimeout(() => { suppressClick = false; }, 400);  // 保险复位
    });

    /* 长按会唤起系统右键菜单（保存图片等），作品墙上屏蔽 */
    document.addEventListener('contextmenu', e => {
      if (e.target.closest && e.target.closest('.gallery-card')) e.preventDefault();
    });

    /* 滚动 / 缩放窗口时浮窗位置失效，直接隐藏 */
    document.addEventListener('scroll', hidePreview, true);
    window.addEventListener('resize', hidePreview);
  }

  bindEvents();
  window.DCS.gallery = { openLightbox, closeLightbox };
})();
