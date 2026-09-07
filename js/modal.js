/* ============================================================
   modal.js —— 安卓应用详情弹窗
   · open(id)：按项目 id 查数据、填充、弹出（首次调用时构建 DOM）
   · 轮播：截图（数据无 shots 时生成占位图）、左右按钮循环翻页、
     指示器圆点直跳 —— 位移按视口像素计算，一次点击翻一整张
   · 关闭：右上角按钮 / 点击遮罩 / Escape
   · 弹出期间锁定当前页面容器滚动
   ============================================================ */
(function() {
  'use strict';
  const DCS = window.DCS, S = DCS.state, DATA = window.DCS_DATA;

  let overlay = null, track = null, dotsEl = null;
  let cur = 0, count = 0, lastFocus = null, lockedContainer = null;
  let shotRatio = 1550 / 3302;   // 截图宽高比，populate 时按真实图片自动更新

  function findProject(id) {
    return (DATA.ANDROID_PROJECTS || []).find(p => p.id === id);
  }

  /* 无真实截图时生成 SVG 占位图（在 data.js 的 shots 里填 URL 即可替换） */
  function shotSVG(name, i, total) {
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='288' height='560'>" +
      "<rect width='288' height='560' fill='#e3e3e8'/>" +
      "<rect x='10' y='10' width='268' height='540' rx='20' fill='#f7f7f9' stroke='#d8d8dd'/>" +
      "<rect x='44' y='40' width='200' height='14' rx='7' fill='#e8e8ed'/>" +
      "<text x='144' y='270' font-family='-apple-system,sans-serif' font-size='17' fill='#7c7c82' text-anchor='middle'>" + name + "</text>" +
      "<text x='144' y='300' font-family='-apple-system,sans-serif' font-size='13' fill='#aeaeb4' text-anchor='middle'>SCREENSHOT " + (i + 1) + " / " + total + "</text>" +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* 首次调用时构建弹窗骨架（含全部事件绑定） */
  function build() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-appname">
        <button class="m-close" type="button" aria-label="关闭"><span class="svg-ico ico-close"></span></button>
        <div class="m-stage">
          <button class="m-arrow m-prev" type="button" aria-label="上一张"><span class="svg-ico ico-left"></span></button>
          <div class="m-viewport"><div class="m-track" id="m-track"></div></div>
          <button class="m-arrow m-next" type="button" aria-label="下一张"><span class="svg-ico ico-right"></span></button>
        </div>
        <div class="m-dots" id="m-dots"></div>
        <div class="m-head">
          <div class="m-appicon" id="m-appicon"></div>
          <div class="m-appname" id="m-appname"></div>
        </div>
        <p class="m-desc" id="m-desc"></p>
        <div class="m-req">
          <span class="m-req-label" id="m-req-label"></span>
          <span class="m-req-text" id="m-req"></span>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    track = overlay.querySelector('#m-track');
    dotsEl = overlay.querySelector('#m-dots');

    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('.m-close').addEventListener('click', close);
    overlay.querySelector('.m-prev').addEventListener('click', () => go(cur - 1));
    overlay.querySelector('.m-next').addEventListener('click', () => go(cur + 1));

    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  go(cur - 1);
      if (e.key === 'ArrowRight') go(cur + 1);
    });

    /* 窗口尺寸变化后重算位移基准，保证仍精确整张 */
    window.addEventListener('resize', () => {
      if (overlay.classList.contains('open')) sizeViewport();
    });
  }

  /* 按项目填充内容（文案按当前语言取值；视口尺寸按截图比例适配） */
  function populate(p) {
    const L = DATA.LANG[S.currentLang] || DATA.LANG['zh-CN'];
    const lang = S.currentLang || 'zh-CN';
    const pick = m => { if (m == null) return ''; if (typeof m === 'string') return m; return m[lang] || m['zh-CN'] || ''; };
    const name = pick(p.name);
    const shots = (p.shots && p.shots.length) ? p.shots : null;
    count = shots ? shots.length : 3;

    /* 轮播截图 */
    track.style.transition = 'none';
    track.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const slide = document.createElement('div');
      slide.className = 'm-shot';
      const img = document.createElement('img');
      img.src = shots ? shots[i] : shotSVG(name, i, count);
      img.alt = name + ' · ' + (i + 1);
      img.decoding = 'async';
      slide.appendChild(img);
      track.appendChild(slide);
    }

    /* ★ 尺寸适配（修复横向图悬顶）：
       ① 数据里写了 shotRatio（宽/高）→ 同步生效，不依赖图片加载时序
       ② 没写 → 等第一张图加载完，按 naturalWidth/Height 自动适配
       ③ 兜底：即使两者都没成，CSS contain 也保证完整显示并居中 */
    if (typeof p.shotRatio === 'number' && p.shotRatio > 0) {
      shotRatio = p.shotRatio;
      sizeViewport();
    } else {
      const firstImg = track.querySelector('.m-shot img');
      if (firstImg) {
        const read = () => {
          if (firstImg.naturalWidth && firstImg.naturalHeight) {
            shotRatio = firstImg.naturalWidth / firstImg.naturalHeight;
            sizeViewport();
          } else {
            sizeViewport();            // 图片加载失败：按当前已知比例兜底
          }
        };
        if (firstImg.complete) read();
        else {
          firstImg.addEventListener('load',  read, { once: true });
          firstImg.addEventListener('error', read, { once: true });
        }
      }
    }

    /* 指示器 */
    dotsEl.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const d = document.createElement('span');
      d.addEventListener('click', () => go(i));
      dotsEl.appendChild(d);
    }

    /* 第一栏：应用图标（appicon 图片优先，无则 emoji 兜底） */
    const iconEl = overlay.querySelector('#m-appicon');
    iconEl.innerHTML = '';
    if (p.appicon) {
      const img = document.createElement('img');
      img.src = p.appicon;
      img.alt = name + ' icon';
      iconEl.appendChild(img);
    } else {
      iconEl.textContent = p.icon || '📱';
    }
    overlay.querySelector('#m-appname').textContent = name;

    /* 第二栏：简介 —— 按换行符分段渲染（\n 或 \n\n 都是一段），textContent 安全无注入 */
    const descBox = overlay.querySelector('#m-desc');
    descBox.innerHTML = '';
    const paras = pick(p.desc).split(/\n+/).map(s => s.trim()).filter(Boolean);
    if (paras.length) {
      paras.forEach(t => {
        const el = document.createElement('p');
        el.textContent = t;
        descBox.appendChild(el);
      });
    } else {
      const el = document.createElement('p');
      el.textContent = '—';
      descBox.appendChild(el);
    }

    /* 第三栏：运行配置 */
    overlay.querySelector('#m-req').textContent = pick(p.req) || '—';
    overlay.querySelector('#m-req-label').textContent = L.modal_req || '运行配置';

    cur = 0;
    apply();
    void track.offsetWidth;
    track.style.transition = '';
  }

  /* 应用当前帧位移：按视口实际像素宽计算 —— 一次一整张 */
  function apply() {
    const vw = track.parentElement.clientWidth;   // .m-viewport 实际宽度
    track.style.transform = 'translateX(' + (-cur * vw) + 'px)';
    dotsEl.querySelectorAll('span').forEach((d, i) => d.classList.toggle('on', i === cur));
  }

    /* 按截图比例计算视口尺寸：竖图高定宽随；横图宽封顶、高反算 —— 完整显示不裁切 */
  function sizeViewport() {
    const vp = track.parentElement;
    const maxH = Math.min(window.innerHeight * 0.52, 440);   // 高度上限
    const maxW = Math.min(window.innerWidth * 0.70, 420);    // 宽度上限（横图封顶）
    let h = maxH, w = h * shotRatio;
    if (w > maxW) { w = maxW; h = w / shotRatio; }
    vp.style.width  = Math.round(w) + 'px';
    vp.style.height = Math.round(h) + 'px';
    apply();                                   // 尺寸变了，位移基准同步重算
  }

  /* 循环翻页 */
  function go(i) {
    cur = (i + count) % count;
    apply();
  }

  function open(id) {
    const p = findProject(id);
    if (!p) return;
    build();
    populate(p);
    overlay.classList.add('open');
    lockedContainer = S.activeContainer;    // 锁定当前页滚动
    if (lockedContainer) lockedContainer.style.overflow = 'hidden';
    lastFocus = document.activeElement;
    overlay.querySelector('.m-close').focus();
  }

  function close() {
    if (!overlay || !overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    if (lockedContainer) { lockedContainer.style.overflow = ''; lockedContainer = null; }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  window.DCS.modal = { open, close };
})();
