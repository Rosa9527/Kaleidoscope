// ===== 万华镜（Kaleidoscope）UI 外壳：悬浮球 / 面板 / 视图切换 =====
function getSphere() {
  return document.getElementById(SPHERE_ID);
}

function getPanel() {
  return document.getElementById(PANEL_ID);
}

// ---------- 悬浮球：六棱万花筒 ----------
function clampSpherePosition(sphere, left, top) {
  const width = sphere?.offsetWidth || SPHERE_SIZE;
  const height = sphere?.offsetHeight || SPHERE_SIZE;
  const maxLeft = Math.max(0, window.innerWidth - width);
  const maxTop = Math.max(0, window.innerHeight - height);
  return {
    left: Math.max(0, Math.min(left, maxLeft)),
    top: Math.max(0, Math.min(top, maxTop)),
  };
}

function setSpherePosition(sphere, left, top, persist = true) {
  if (!sphere) return;
  const next = clampSpherePosition(sphere, left, top);
  sphere.style.left = `${next.left}px`;
  sphere.style.top = `${next.top}px`;
  if (!persist) return;
  try {
    globalThis.localStorage?.setItem(SPHERE_POSITION_KEY, JSON.stringify(next));
  } catch {}
}

function restoreSpherePosition(sphere) {
  if (!sphere) return false;
  try {
    const raw = globalThis.localStorage?.getItem(SPHERE_POSITION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const left = Number(parsed?.left);
      const top = Number(parsed?.top);
      if (Number.isFinite(left) && Number.isFinite(top)) {
        setSpherePosition(sphere, left, top, false);
        return true;
      }
    }
  } catch {}
  const currentLeft = Number.parseFloat(sphere.style.left);
  const currentTop = Number.parseFloat(sphere.style.top);
  if (Number.isFinite(currentLeft) && Number.isFinite(currentTop)) {
    setSpherePosition(sphere, currentLeft, currentTop, false);
    return true;
  }
  return false;
}

function showSphere() {
  const sphere = getSphere();
  if (!sphere) return;
  if (sphere.style.display === 'flex') return;
  restoreSpherePosition(sphere);
  sphere.style.display = 'flex';
  sphere.classList.add('is-appearing');
  setTimeout(() => sphere.classList.remove('is-appearing'), 300);
}

function hideSphere() {
  const sphere = getSphere();
  if (!sphere || sphere.style.display === 'none') return;
  logApp('debug', '悬浮球已隐藏');
  sphere.classList.add('is-shrinking');
  setTimeout(() => {
    sphere.style.display = 'none';
    sphere.classList.remove('is-shrinking');
  }, 200);
}

function createSphere() {
  let sphere = getSphere();
  if (sphere) return sphere;
  sphere = document.createElement('div');
  sphere.id = SPHERE_ID;
  sphere.className = 'kaleido-sphere';
  sphere.title = `${MODULE_DISPLAY_NAME}：拖拽移动 / 点击打开 / 长按隐藏`;
  sphere.setAttribute('aria-label', MODULE_DISPLAY_NAME);
  sphere.innerHTML = `
    <span class="kaleido-sphere__frame" aria-hidden="true"></span>
    <span class="kaleido-sphere__fan" aria-hidden="true"><span class="${MENU_ICON_CLASS}"></span></span>
  `;
  document.body.appendChild(sphere);
  initDraggableSphere(sphere);
  return sphere;
}

function initDraggableSphere(sphere) {
  let dragState = null;
  let hasMoved = false;
  let longPressTriggered = false;
  let longPressTimer = null;
  let pointerDownX = 0;
  let pointerDownY = 0;

  const clearLongPressTimer = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
    longPressTimer = null;
  };

  const onPointerMove = (event) => {
    if (!dragState) return;
    const deltaX = event.clientX - pointerDownX;
    const deltaY = event.clientY - pointerDownY;
    if (!hasMoved && Math.hypot(deltaX, deltaY) >= SPHERE_DRAG_THRESHOLD) {
      hasMoved = true;
      clearLongPressTimer();
    }
    if (!hasMoved) return;
    setSpherePosition(sphere, event.clientX - dragState.offsetX, event.clientY - dragState.offsetY, false);
  };

  const onPointerUp = () => {
    if (!dragState) return;
    clearLongPressTimer();
    dragState = null;
    sphere.classList.remove('is-dragging');
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);

    if (longPressTriggered) {
      longPressTriggered = false;
      return;
    }
    if (hasMoved) {
      const left = Number.parseFloat(sphere.style.left);
      const top = Number.parseFloat(sphere.style.top);
      if (Number.isFinite(left) && Number.isFinite(top)) setSpherePosition(sphere, left, top);
      return;
    }
    hideSphere();
    openPanel();
  };

  sphere.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragState = {
      offsetX: event.clientX - sphere.offsetLeft,
      offsetY: event.clientY - sphere.offsetTop,
    };
    pointerDownX = event.clientX;
    pointerDownY = event.clientY;
    hasMoved = false;
    longPressTriggered = false;
    sphere.classList.add('is-dragging');
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    clearLongPressTimer();
    longPressTimer = setTimeout(() => {
      if (dragState && !hasMoved) {
        longPressTriggered = true;
        hideSphere();
      }
    }, SPHERE_LONG_PRESS_MS);
    event.preventDefault();
  });

  if (!restoreSpherePosition(sphere)) {
    const defaultLeft = Math.max(EDGE_GAP, window.innerWidth - sphere.offsetWidth - EDGE_GAP);
    const defaultTop = Math.max(EDGE_GAP, Math.round(window.innerHeight * 0.4));
    setSpherePosition(sphere, defaultLeft, defaultTop, false);
  }
  window.addEventListener('resize', () => {
    const left = Number.parseFloat(sphere.style.left);
    const top = Number.parseFloat(sphere.style.top);
    if (!Number.isFinite(left) || !Number.isFinite(top)) return;
    setSpherePosition(sphere, left, top, false);
  });
}

// ---------- 面板 ----------
// 与同目录 SoulLink 一致：面板始终由内联 left/top 定位（clamp 在视口内），
// 移动端不依赖 CSS 居中/铺边布局，标题栏始终可见可拖。

function clampPanelPosition(dialog, left, top) {
  const width = dialog?.offsetWidth || 360;
  const height = dialog?.offsetHeight || 420;
  const maxLeft = Math.max(0, window.innerWidth - width);
  const maxTop = Math.max(0, window.innerHeight - height);
  return {
    left: Math.max(0, Math.min(left, maxLeft)),
    top: Math.max(0, Math.min(top, maxTop)),
  };
}

function setPanelPosition(panel, left, top) {
  const dialog = panel?.querySelector('.kaleido-panel__dialog');
  if (!panel || !dialog) return;
  const next = clampPanelPosition(dialog, left, top);
  dialog.style.left = `${next.left}px`;
  dialog.style.top = `${next.top}px`;
  dialog.style.right = 'auto';
  dialog.style.bottom = 'auto';
  dialog.style.transform = 'none';
  panel.dataset.left = String(next.left);
  panel.dataset.top = String(next.top);
  panel.dataset.positioned = 'true';
}

function ensurePanelPosition(panel) {
  const dialog = panel?.querySelector('.kaleido-panel__dialog');
  if (!panel || !dialog) return;
  const storedLeft = Number(panel.dataset.left);
  const storedTop = Number(panel.dataset.top);
  if (Number.isFinite(storedLeft) && Number.isFinite(storedTop)) {
    setPanelPosition(panel, storedLeft, storedTop);
    return;
  }
  const defaultLeft = Math.max(EDGE_GAP, window.innerWidth - dialog.offsetWidth - EDGE_GAP);
  const defaultTop = EDGE_GAP;
  setPanelPosition(panel, defaultLeft, defaultTop);
}

function initDraggablePanel(panel) {
  if (!panel || panel.dataset.dragReady === 'true') return;
  const dialog = panel.querySelector('.kaleido-panel__dialog');
  const handles = panel.querySelectorAll('.kaleido-drag-handle');
  if (!dialog || handles.length === 0) return;

  let dragState = null;

  const stopDragging = () => {
    dragState = null;
    dialog.classList.remove('is-dragging');
  };

  handles.forEach((handle) =>
    handle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      // 指针落在标题栏内的按钮上（返回/关闭）时，不启动拖拽、不捕获指针，
      // 否则 setPointerCapture 会把后续 click 重定向到标题栏，按钮点击失效。
      const target = event.target;
      if (target instanceof Element && typeof target.closest === 'function' && target.closest('button')) return;
      // 用视觉位置（getBoundingClientRect）计算偏移：移动端居中布局带 transform，
      // offsetLeft/offsetTop 是布局位置，会导致首帧跳动。
      const rect = dialog.getBoundingClientRect();
      dragState = {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      };
      dialog.classList.add('is-dragging');
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }),
  );

  window.addEventListener('pointermove', (event) => {
    if (!dragState) return;
    setPanelPosition(panel, event.clientX - dragState.offsetX, event.clientY - dragState.offsetY);
  });
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);
  window.addEventListener('resize', () => ensurePanelPosition(panel));
  panel.dataset.dragReady = 'true';
}

function openPanel() {
  const panel = getPanel();
  if (!panel) return;
  logApp('debug', '面板已打开');
  showPanelView(GAME_VIEW_ID);
  refreshHomeStatuses();
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  ensurePanelPosition(panel);
}

function closePanel() {
  const panel = getPanel();
  if (!panel) return;
  logApp('debug', '面板已关闭');
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  // 关闭面板后把悬浮球请回来（点击悬浮球打开面板时会先隐藏它）
  showSphere();
}

function togglePanel() {
  const panel = getPanel();
  if (!panel) return;
  if (panel.classList.contains('is-open')) closePanel();
  else openPanel();
}

// ---------- 视图切换 ----------
function showPanelView(viewId) {
  const panel = getPanel();
  if (!panel) return;
  panel.querySelectorAll('.kaleido-view').forEach((view) => {
    const active = view.id === viewId;
    view.classList.toggle('is-active', active);
    view.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
  const dialog = panel.querySelector('.kaleido-panel__dialog');
  if (dialog) {
    for (const mode of Object.values(PANEL_WIDE_MODES)) dialog.classList.remove(mode);
    const wideMode = PANEL_WIDE_MODES[viewId];
    if (wideMode) dialog.classList.add(wideMode);
  }
  const back = document.getElementById(PANEL_BACK_ID);
  if (back) back.style.visibility = (viewId === HOME_VIEW_ID || viewId === GAME_VIEW_ID) ? 'hidden' : 'visible';
  const title = document.getElementById(PANEL_TITLE_ID);
  if (title) {
    title.textContent = PANEL_VIEW_TITLES[viewId] || MODULE_DISPLAY_NAME;
    title.classList.toggle('is-homepage', viewId === HOME_VIEW_ID);
  }
  if (viewId === HOME_VIEW_ID) {
    // 从日志页等返回首页时全量刷新首页卡片状态，避免残留打开面板那一刻的旧读数
    //（如日志已清空仍显示「1 警告」）。openPanel 也是这么刷的，保持一致。
    refreshHomeStatuses();
  }
  if (viewId === LOG_VIEW_ID) {
    renderLogList();
    updateLogStats();
  }
  if (viewId === INJECT_VIEW_ID) {
    renderInjectView();
  }
  if (viewId === STORY_VIEW_ID) {
    renderStoryTree();
    refreshHomeStoryStatus();
  }
  if (viewId === VALUES_VIEW_ID) {
    // 变量树永远从「游戏数值」层开始（与桌面工作台一致）：不记住上次停留的层，
    // 默认数值需手动切换后才显示。（setValuesLayer 内部已重渲染树。）
    setValuesLayer('game');
    refreshHomeValuesStatus();
  }
  if (viewId === PRESET_VIEW_ID) {
    // 预设选择器与编辑器都依赖当前角色卡数据（激活预设 / 预设列表随卡切换），
    // 每次进入视图重渲染，避免显示别的角色卡的旧列表。
    renderPresetSelector();
    renderPresetEditor();
  }
  if (viewId === GAME_VIEW_ID) {
    // 进入游戏模式时重置到入口：不点击图标不显示任何界面。
    renderGameView(true);
  }
  ensurePanelPosition(panel);
}

function initPanelViews(panel) {
  if (!panel || panel.dataset.viewsReady === 'true') return;
  document.getElementById(PANEL_BACK_ID)?.addEventListener('click', () => {
    // 游戏模式界面内（地图 / 数据）：返回键回到图标入口，而不是首页。
    if (isGameViewActive() && gameActivePane !== null) {
      gameActivePane = null;
      applyGamePane();
      return;
    }
    showPanelView(HOME_VIEW_ID);
  });
  document.getElementById(HOME_API_CARD_ID)?.addEventListener('click', () => showPanelView(API_VIEW_ID));
  document.getElementById(HOME_STORY_CARD_ID)?.addEventListener('click', () => {
    if (isNarrowViewport()) showPanelView(STORY_VIEW_ID);
    else openStoryWorkbench();
  });
  document.getElementById(HOME_GAME_BUTTON_ID)?.addEventListener('click', () => showPanelView(GAME_VIEW_ID));
  document.getElementById(HOME_PRESET_CARD_ID)?.addEventListener('click', () => showPanelView(PRESET_VIEW_ID));
  document.getElementById(HOME_INJECT_CARD_ID)?.addEventListener('click', () => showPanelView(INJECT_VIEW_ID));
  document.getElementById(HOME_VALUES_CARD_ID)?.addEventListener('click', () => {
    if (isNarrowViewport()) showPanelView(VALUES_VIEW_ID);
    else openValuesWorkbench();
  });
  document.getElementById(HOME_LOG_CARD_ID)?.addEventListener('click', () => showPanelView(LOG_VIEW_ID));
  document.getElementById(INJECT_COPY_ID)?.addEventListener('click', copyInjectInjectionText);
  panel.dataset.viewsReady = 'true';
}

// ---------- 面板总装配 ----------
function createPanel() {
  let panel = getPanel();
  if (panel) return panel;
  panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.className = 'kaleido-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="kaleido-panel__dialog" role="dialog" aria-label="${MODULE_DISPLAY_NAME}">
      <div class="kaleido-panel__header kaleido-drag-handle">
        <button type="button" id="${PANEL_BACK_ID}" class="kaleido-panel__back" aria-label="返回" title="返回" style="visibility:hidden">←</button>
        <span id="${PANEL_TITLE_ID}" class="kaleido-panel__title">${MODULE_DISPLAY_NAME}</span>
        <button type="button" class="kaleido-panel__close" aria-label="关闭" title="关闭">✕</button>
      </div>
      <div class="kaleido-panel__body">
        <section id="${HOME_VIEW_ID}" class="kaleido-view is-active" aria-hidden="false">
          <div class="kaleido-home">
            <div class="kaleido-home__hero">
              <span class="kaleido-home__logo"><span class="${MENU_ICON_CLASS}"></span></span>
              <p class="kaleido-home__slogan"><span class="kaleido-home__slogan-first" aria-hidden="true">镜</span>中万象</p>
              <button type="button" id="${HOME_GAME_BUTTON_ID}" class="kaleido-home__log-btn" title="游戏模式：游戏地图与玩家数据档案" aria-label="游戏模式">
                <span class="${GAME_ICON_CLASS}"></span>
              </button>
            </div>
            <div class="kaleido-home__section-head">
              <span class="kaleido-panel__section-title">功能一览</span>
            </div>
            <div class="kaleido-home__rows">
              <button type="button" id="${HOME_API_CARD_ID}" class="kaleido-home__row" title="配置 AI 接口，引擎的基石">
                <span class="kaleido-home__row-icon"><span class="${API_ICON_CLASS}"></span></span>
                <span class="kaleido-home__row-label">API 连接</span>
                <span id="${HOME_API_STATUS_ID}" class="kaleido-home__row-status" data-state="idle">尚未连接</span>
                <span class="kaleido-home__row-chevron" aria-hidden="true"></span>
              </button>
              <button type="button" id="${HOME_PRESET_CARD_ID}" class="kaleido-home__row" title="预设模版：修改与重置默认提示词">
                <span class="kaleido-home__row-icon"><span class="${PRESET_ICON_CLASS}"></span></span>
                <span class="kaleido-home__row-label">预设模版</span>
                <span id="${HOME_PRESET_STATUS_ID}" class="kaleido-home__row-status" data-state="idle">默认配置</span>
                <span class="kaleido-home__row-chevron" aria-hidden="true"></span>
              </button>
              <button type="button" id="${HOME_VALUES_CARD_ID}" class="kaleido-home__row" title="变量系统：变量注册 + 默认值 / 游戏值，AI 自动维护">
                <span class="kaleido-home__row-icon"><span class="${VALUES_ICON_CLASS}"></span></span>
                <span class="kaleido-home__row-label">变量系统</span>
                <span id="${HOME_VALUES_STATUS_ID}" class="kaleido-home__row-status" data-state="idle">尚未添加</span>
                <span class="kaleido-home__row-chevron" aria-hidden="true"></span>
              </button>
              <button type="button" id="${HOME_STORY_CARD_ID}" class="kaleido-home__row" title="剧情脉络：节点与事件的工作台">
                <span class="kaleido-home__row-icon"><span class="${STORY_ICON_CLASS}"></span></span>
                <span class="kaleido-home__row-label">剧情脉络</span>
                <span id="${HOME_STORY_STATUS_ID}" class="kaleido-home__row-status" data-state="idle">尚未添加</span>
                <span class="kaleido-home__row-chevron" aria-hidden="true"></span>
              </button>
              <button type="button" id="${HOME_LOG_CARD_ID}" class="kaleido-home__row" title="系统日志：后台运行记录与网络请求">
                <span class="kaleido-home__row-icon"><span class="${LOG_ICON_CLASS}"></span></span>
                <span class="kaleido-home__row-label">系统日志</span>
                <span id="${HOME_LOG_STATUS_ID}" class="kaleido-home__row-status" data-state="idle">暂无记录</span>
                <span class="kaleido-home__row-chevron" aria-hidden="true"></span>
              </button>
              <button type="button" id="${HOME_INJECT_CARD_ID}" class="kaleido-home__row" title="剧情预筛：点击发送时自动挑选并注入本轮事件">
                <span class="kaleido-home__row-icon"><span class="${INJECT_ICON_CLASS}"></span></span>
                <span class="kaleido-home__row-label">注入实录</span>
                <span id="${HOME_INJECT_STATUS_ID}" class="kaleido-home__row-status" data-state="idle">尚未运行</span>
                <span class="kaleido-home__row-chevron" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </section>
        <section id="${API_VIEW_ID}" class="kaleido-view" aria-hidden="true">
          <div class="kaleido-api">
            <div class="kaleido-api__head">
              <span class="kaleido-api__title">API 连接</span>
              <span id="${API_STATUS_ID}" class="kaleido-api__status" data-state="idle">尚未连接</span>
            </div>
            <label class="kaleido-api__field" for="${API_URL_ID}">
              <span class="kaleido-api__label">Base URL</span>
              <input id="${API_URL_ID}" class="kaleido-input" type="text" placeholder="https://api.openai.com/v1" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${API_KEY_ID}">
              <span class="kaleido-api__label">API Key</span>
              <span class="kaleido-api__key-row">
                <input id="${API_KEY_ID}" class="kaleido-input" type="password" placeholder="sk-..." autocomplete="off" spellcheck="false" />
                <button type="button" id="${API_KEY_TOGGLE_ID}" class="kaleido-icon-btn" title="显示密钥" aria-label="显示密钥">👁</button>
              </span>
            </label>
            <div class="kaleido-api__actions">
              <button type="button" id="${API_CONNECT_ID}" class="kaleido-btn kaleido-btn--primary">连接并拉取模型</button>
            </div>
            <div class="kaleido-api__field">
              <span class="kaleido-api__label">模型</span>
              <select id="${API_MODEL_LIST_ID}" class="kaleido-input">
                <option value="">请先连接并拉取模型</option>
              </select>
              <input id="${API_MODEL_ID}" class="kaleido-input" type="text" placeholder="或手动填写模型名称" autocomplete="off" spellcheck="false" />
            </div>
            <div class="kaleido-api__field">
              <span class="kaleido-api__label">限制并发</span>
              <div class="kaleido-api__concurrency-row">
                <button type="button" id="${API_CONCURRENCY_TOGGLE_ID}" class="kaleido-btn kaleido-api__concurrency-toggle" title="开启/关闭并发限制">🔀 并发限制：开</button>
                <input id="${API_CONCURRENCY_INPUT_ID}" class="kaleido-input kaleido-api__concurrency-input" type="number" min="1" max="10" step="1" placeholder="3" autocomplete="off" aria-label="并发上限" />
              </div>
            </div>
            <div class="kaleido-api__field">
              <span class="kaleido-api__label">思考强度</span>
              <select id="${API_REASONING_EFFORT_ID}" class="kaleido-input" title="控制带思考能力模型的思考强度（reasoning_effort）">
                <option value="">默认（不发送）</option>
                <option value="none">关闭思考</option>
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="max">最大</option>
              </select>
            </div>
          </div>
        </section>
        <section id="${LOG_VIEW_ID}" class="kaleido-view" aria-hidden="true">
          <div class="kaleido-log">
            <div class="kaleido-log__chips" role="group" aria-label="按级别筛选日志">
              <button type="button" class="kaleido-log__chip is-active" data-level="">全部 <span class="kaleido-log__chip-count" data-level="">0</span></button>
              <button type="button" class="kaleido-log__chip" data-level="debug">调试 <span class="kaleido-log__chip-count" data-level="debug">0</span></button>
              <button type="button" class="kaleido-log__chip" data-level="info">信息 <span class="kaleido-log__chip-count" data-level="info">0</span></button>
              <button type="button" class="kaleido-log__chip" data-level="warn">警告 <span class="kaleido-log__chip-count" data-level="warn">0</span></button>
              <button type="button" class="kaleido-log__chip" data-level="error">错误 <span class="kaleido-log__chip-count" data-level="error">0</span></button>
            </div>
            <div class="kaleido-log__tools">
              <input id="${LOG_SEARCH_ID}" class="kaleido-input kaleido-log__search" type="search" placeholder="🔍 搜索日志内容…" autocomplete="off" spellcheck="false" />
              <select id="${LOG_SOURCE_ID}" class="kaleido-input kaleido-log__source" title="按来源筛选日志">
                <option value="">全部来源</option>
                <option value="network">网络请求</option>
                <option value="kaleido">万华镜</option>
                <option value="console">控制台</option>
                <option value="event">宿主事件</option>
                <option value="external">外部扩展</option>
                <option value="window">页面错误</option>
                <option value="promise">Promise 拒绝</option>
              </select>
              <select id="${LOG_MAX_ID}" class="kaleido-input kaleido-log__max" title="内存中保留的日志条数，超出自动丢弃最旧">
                <option value="500">500 条</option>
                <option value="2000" selected>2000 条</option>
                <option value="5000">5000 条</option>
                <option value="10000">10000 条</option>
              </select>
            </div>
            <div class="kaleido-log__actions">
              <button type="button" id="${LOG_PAUSE_ID}" class="kaleido-log__action" title="暂停：新日志先缓存（+N），不追加到列表；点「继续」一次性显示">⏸ 暂停</button>
              <button type="button" id="${LOG_AUTOSCROLL_ID}" class="kaleido-log__action is-active" title="跟随：钉在底部，新日志自动滚到底部（点一下关闭）">⏬ 跟随</button>
              <button type="button" id="${LOG_CLEAR_ID}" class="kaleido-log__action" title="清空缓冲中的所有日志">🧹 清空</button>
              <button type="button" id="${LOG_COPY_ID}" class="kaleido-log__action" title="复制全部日志为纯文本">📋 复制</button>
              <button type="button" id="${LOG_EXPORT_ID}" class="kaleido-log__action" title="导出完整 JSON 日志文件">💾 导出</button>
              <button type="button" id="${LOG_FULL_BODY_EXPORT_ID}" class="kaleido-log__action" title="导出最近 ${LOG_FULL_BODY_MAX} 次对话请求的完整请求体/响应体（未截断）">📦 完整请求体</button>
              <button type="button" id="${LOG_NOISE_ID}" class="kaleido-log__action is-active" title="过滤已知噪音（世界书扫描 / 宏变量 dump / 正则跳过 / 事件总线 / 内部保存 / 非模型网络调用 / 宿主扩展更新检查报错）">🔇 过滤噪音</button>
            </div>
            <div class="kaleido-log__console">
              <div id="${LOG_LIST_ID}" class="kaleido-log__list" role="log" aria-live="off" aria-label="运行日志"></div>
              <button type="button" id="${LOG_BACK_ID}" class="kaleido-log__back" hidden>↓ 回到最新</button>
            </div>
            <div class="kaleido-log__status">
              <span id="${LOG_STATUS_ID}">共 0 条</span>
              <span id="${LOG_PAUSED_ID}" class="kaleido-log__paused" title="暂停期间新日志只入内存（+N），点「继续」后一次性显示" hidden>已暂停 · 新增 +0</span>
            </div>
          </div>
        </section>
        <section id="${PRESET_VIEW_ID}" class="kaleido-view" aria-hidden="true">
          <div class="kaleido-preset">
            <div class="kaleido-preset__gate">
              <div class="kaleido-preset__gate-head">
                <span class="kaleido-preset__gate-title">剧情预筛</span>
                <span id="${PRESET_GATE_STATUS_ID}" class="kaleido-preset__status" data-state="idle">未启用</span>
              </div>
              <div class="kaleido-preset__gate-row">
                <span class="kaleido-preset__gate-label">启用剧情预筛</span>
                <button type="button" id="${PRESET_GATE_TOGGLE_ID}" class="kaleido-btn kaleido-api__concurrency-toggle" title="开启/关闭剧情预筛">🎬 剧情预筛：开</button>
              </div>
            </div>
            <div class="kaleido-preset__gate">
              <div class="kaleido-preset__gate-head">
                <span class="kaleido-preset__gate-title">变量自动维护</span>
                <span id="${PRESET_VALUES_STATUS_ID}" class="kaleido-preset__status" data-state="idle">未启用</span>
              </div>
              <div class="kaleido-preset__gate-row">
                <span class="kaleido-preset__gate-label">启用变量自动维护</span>
                <button type="button" id="${PRESET_VALUES_TOGGLE_ID}" class="kaleido-btn kaleido-api__concurrency-toggle" title="开启/关闭变量自动维护">✨ 变量自动维护：开</button>
              </div>
            </div>
            <div class="kaleido-preset__gate">
              <div class="kaleido-preset__gate-head">
                <span class="kaleido-preset__gate-title">剧情触发</span>
                <span id="${PRESET_TRIGGER_STATUS_ID}" class="kaleido-preset__status" data-state="idle">未启用</span>
              </div>
              <div class="kaleido-preset__gate-row">
                <span class="kaleido-preset__gate-label">启用剧情触发</span>
                <button type="button" id="${PRESET_TRIGGER_TOGGLE_ID}" class="kaleido-btn kaleido-api__concurrency-toggle" title="开启/关闭剧情触发">⚡ 剧情触发：开</button>
              </div>
            </div>
            <div class="kaleido-preset__toolbar">
              <select id="${PRESET_SELECTOR_ID}" class="kaleido-input kaleido-preset__select" aria-label="选择提示词预设" title="切换当前生效的提示词预设"></select>
              <button type="button" id="${PRESET_SAVE_AS_ID}" class="kaleido-btn kaleido-btn--ghost" title="把当前两组提示词另存为一个新预设">📝 另存</button>
              <button type="button" id="${PRESET_DELETE_ID}" class="kaleido-btn kaleido-btn--ghost" title="删除当前选中的自定义预设">🗑</button>
              <span class="kaleido-preset__toolbar-gap"></span>
              <button type="button" id="${PRESET_EXPORT_ID}" class="kaleido-btn kaleido-btn--ghost" title="把当前选中的完整预设导出为独立文件">⬆ 导出</button>
              <button type="button" id="${PRESET_IMPORT_BTN_ID}" class="kaleido-btn kaleido-btn--ghost" title="从预设文件导入（含名称 + 两组提示词）">⬇ 导入</button>
              <input type="file" id="${PRESET_IMPORT_INPUT_ID}" accept=".yaml,.yml" hidden />
            </div>
            <div id="${PRESET_TABS_ID}" class="kaleido-preset__tabs" role="tablist" aria-label="选择要编辑的提示词">
              ${Object.entries(PRESET_META).map(([key, meta]) => `
                <button type="button" class="kaleido-preset__tab${key === presetActiveKey ? ' is-active' : ''}" role="tab" aria-selected="${key === presetActiveKey ? 'true' : 'false'}" data-prompt-key="${key}" title="${meta.title}">${meta.label}</button>
              `).join('')}
            </div>
            <div class="kaleido-preset__editor">
              <div class="kaleido-preset__meta">
                <span id="${PRESET_STATUS_ID}" class="kaleido-preset__status" data-state="default">默认内容</span>
                <span id="${PRESET_COUNT_ID}" class="kaleido-preset__count">0 字</span>
              </div>
              <textarea id="${PRESET_TEXT_ID}" class="kaleido-input kaleido-preset__text" spellcheck="false" aria-label="提示词内容" placeholder="（提示词内容为空）"></textarea>
              <div class="kaleido-preset__actions">
                <button type="button" id="${PRESET_RESET_ID}" class="kaleido-btn kaleido-btn--ghost">↺ 恢复默认</button>
                <button type="button" id="${PRESET_SAVE_ID}" class="kaleido-btn" disabled>💾 保存</button>
              </div>
            </div>
          </div>
        </section>
        <section id="${INJECT_VIEW_ID}" class="kaleido-view" aria-hidden="true">
          <div class="kaleido-inject">
            <div id="${INJECT_SUMMARY_ID}" class="kaleido-inject__summary" hidden></div>
            <div id="${INJECT_EMPTY_ID}" class="kaleido-inject__empty" hidden>还没有预筛记录。</div>
            <div class="kaleido-inject__gate-head" hidden>
              <span class="kaleido-panel__section-title">预筛原文（Gate 返回）</span>
            </div>
            <pre id="${INJECT_GATE_TEXT_ID}" class="kaleido-inject__gate-text" hidden></pre>
            <div class="kaleido-inject__events-head" hidden>
              <span class="kaleido-panel__section-title">本轮触发的事件</span>
            </div>
            <div id="${INJECT_EVENTS_ID}" class="kaleido-inject__events" hidden></div>
            <div class="kaleido-inject__inject-head" hidden>
              <span class="kaleido-panel__section-title">注入提示词原文</span>
              <button type="button" id="${INJECT_COPY_ID}" class="kaleido-btn kaleido-btn--ghost kaleido-inject__copy">⧉ 复制</button>
            </div>
            <pre id="${INJECT_TEXT_ID}" class="kaleido-inject__inject-text" hidden></pre>
            <div class="kaleido-inject__trigger-head" hidden>
              <span class="kaleido-panel__section-title">剧情触发（变量条件）</span>
            </div>
            <div id="${INJECT_TRIGGER_SUMMARY_ID}" class="kaleido-inject__summary" hidden></div>
            <div id="${INJECT_TRIGGER_EVENTS_ID}" class="kaleido-inject__events" hidden></div>
            <pre id="${INJECT_TRIGGER_TEXT_ID}" class="kaleido-inject__inject-text" hidden></pre>
          </div>
        </section>
      </div>
      <div class="kaleido-panel__footer">
        <span class="kaleido-panel__version">
          v${MODULE_VERSION}
          <button type="button" id="${VERSION_CHECK_ID}" class="kaleido-panel__version-check" data-state="checking" title="正在联网检查 GitHub 上的最新版本">检查更新…</button>
        </span>
        <span class="kaleido-panel__theme-wrap">
          <button type="button" id="${THEME_ID}" class="kaleido-panel__theme" aria-haspopup="menu" aria-expanded="false" title="切换主题">🎨 手绘涂鸦</button>
          <div id="${THEME_MENU_ID}" class="kaleido-panel__theme-menu" role="menu" hidden></div>
        </span>
        <span class="kaleido-panel__slogan">镜中万象</span>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  initDraggablePanel(panel);
  initPanelViews(panel);
  initApiSection(panel);
  initStorySection(panel);
  initValuesSection(panel);
  initGameSection(panel);
  initMapSection();
  initLogView(panel);
  initPresetSection(panel);
  initThemeSection(panel);
  document.getElementById(VERSION_CHECK_ID)?.addEventListener('click', () => checkLatestVersion(true));
  checkLatestVersion();
  panel.querySelector('.kaleido-panel__close')?.addEventListener('click', closePanel);
  if (!globalThis[ESC_KEY_HANDLER_KEY]) {
    globalThis[ESC_KEY_HANDLER_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      // 确认弹层优先：开着时 Esc 只取消确认，不关面板。
      if (isKaleidoConfirmOpen()) {
        settleKaleidoConfirm(false);
        return;
      }
      if (isStoryWorkbenchOpen()) return;
      const activeView = panel.querySelector('.kaleido-view.is-active');
      if (activeView && activeView.id !== HOME_VIEW_ID && activeView.id !== GAME_VIEW_ID) {
        showPanelView(HOME_VIEW_ID);
        return;
      }
      // 游戏模式界面内：Esc 先回到图标入口，再按才关闭面板。
      if (activeView?.id === GAME_VIEW_ID && gameActivePane !== null) {
        gameActivePane = null;
        applyGamePane();
        return;
      }
      closePanel();
    };
    document.addEventListener('keydown', globalThis[ESC_KEY_HANDLER_KEY]);
  }
  return panel;
}

// ---------- 版本检查（GitHub 对比） ----------
// 与 SoulLink 同构：拉取远端 manifest.json 的 version 与本地 MODULE_VERSION 比较，
// 结果缓存 1 小时；点击按钮强制重查。两路源（raw 直链 / GitHub API）互为兜底。
let versionCheckCache = null;

function compareVersions(a, b) {
  const parse = (v) => String(v || '').trim().replace(/^v/i, '').split('.').map((part) => {
    const num = Number.parseInt(part, 10);
    return Number.isFinite(num) ? num : 0;
  });
  const pa = parse(a);
  const pb = parse(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

function renderVersionCheck(node, cache) {
  if (!node || !cache) return;
  if (cache.isLatest) {
    node.dataset.state = 'ok';
    node.textContent = '已是最新版';
    node.title = '当前已是最新版本，点击重新检查';
  } else {
    node.dataset.state = 'new';
    node.textContent = `发现新版本 v${cache.latest}`;
    node.title = `GitHub 上已有新版本 v${cache.latest}，点击重新检查`;
  }
}

async function fetchLatestManifestVersion() {
  const sources = [
    {
      url: GITHUB_MANIFEST_URL,
      parse: (text) => JSON.parse(text)?.version,
    },
    {
      url: GITHUB_API_MANIFEST_URL,
      parse: (text) => {
        const data = JSON.parse(text);
        if (data?.encoding !== 'base64' || typeof data?.content !== 'string') {
          throw new Error('API 响应格式异常');
        }
        if (typeof globalThis.atob !== 'function') throw new Error('环境不支持 base64 解码');
        return JSON.parse(globalThis.atob(data.content))?.version;
      },
    },
  ];
  let lastError = null;
  for (const source of sources) {
    try {
      const { response, responseText } = await fetchText(source.url, { timeoutMs: 10000 });
      if (!response?.ok) throw new Error(`HTTP ${response?.status || '?'}`);
      const version = String(source.parse(responseText) || '').trim();
      if (!version) throw new Error('manifest 中没有版本号');
      return version;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('所有检查源都失败');
}

async function checkLatestVersion(force = false) {
  const node = document.getElementById(VERSION_CHECK_ID);
  if (!node) return;
  if (!force && versionCheckCache && Date.now() - versionCheckCache.checkedAt < VERSION_CHECK_CACHE_MS) {
    renderVersionCheck(node, versionCheckCache);
    return;
  }
  node.dataset.state = 'checking';
  node.textContent = '检查更新…';
  node.title = '正在联网检查 GitHub 上的最新版本';
  try {
    const latest = await fetchLatestManifestVersion();
    const isLatest = compareVersions(MODULE_VERSION, latest) >= 0;
    versionCheckCache = { latest, isLatest, checkedAt: Date.now() };
    renderVersionCheck(node, versionCheckCache);
    logApp('debug', `版本检查完成: 本地 v${MODULE_VERSION} / 远端 v${latest}${isLatest ? '（已是最新）' : '（发现新版本）'}`);
  } catch (error) {
    versionCheckCache = null;
    node.dataset.state = 'error';
    node.textContent = '检查失败，点击重试';
    node.title = '联网检查最新版本失败，点击重试';
    // 自动检查失败只记 debug：离线 / 网络受限环境每次打开面板都会失败，记 warn 会让
    // 首页常驻「1 警告」；失败状态在版本 UI（「检查失败，点击重试」）仍然可见。
    // 手动点击重试仍记 warn——用户主动触发，值得一条警告。
    logApp(force ? 'warn' : 'debug', `版本检查失败: ${String(error?.message || error)}`);
  }
}

// ---------- 主题切换 ----------
// 主题注册表见 constants.js 的 THEMES / DEFAULT_THEME；id 对应 style.css 中
// [data-theme='...'] 的变量覆盖。默认「手绘涂鸦」，切换后持久化到 settings.theme。
function getCurrentTheme() {
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    const id = settings?.theme;
    return THEMES.some((theme) => theme.id === id) ? id : DEFAULT_THEME;
  } catch (error) {
    logApp('warn', `读取主题设置失败: ${String(error?.message || error)}`);
    return DEFAULT_THEME;
  }
}

function applyTheme(themeId) {
  const id = THEMES.some((theme) => theme.id === themeId) ? themeId : DEFAULT_THEME;
  // 以 <html> 为唯一主题作用域：所有宿主元素（含后续懒创建的工作台对话框、确认弹层、
  // 新建菜单等）都是 html 的后代，主题经变量继承自动覆盖到每一个窗口。
  document.documentElement?.setAttribute('data-theme', id);
  const panel = getPanel();
  const sphere = getSphere();
  if (panel) panel.dataset.theme = id;
  if (sphere) sphere.dataset.theme = id;
  const theme = THEMES.find((item) => item.id === id);
  const button = document.getElementById(THEME_ID);
  if (button && theme) button.textContent = '🎨 ' + theme.name;
  return id;
}

function initThemeSection(panel) {
  if (!panel || panel.dataset.themeReady === 'true') return;
  const button = document.getElementById(THEME_ID);
  const menu = document.getElementById(THEME_MENU_ID);
  if (!button || !menu) return;

  const closeThemeMenu = () => {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  };

  const renderThemeMenu = () => {
    const current = getCurrentTheme();
    menu.innerHTML = '';
    for (const theme of THEMES) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'kaleido-panel__theme-option';
      item.dataset.themeId = theme.id;
      item.textContent = theme.name;
      item.setAttribute('role', 'menuitemradio');
      item.setAttribute('aria-checked', String(theme.id === current));
      if (theme.id === current) item.classList.add('is-active');
      item.addEventListener('click', () => {
        try {
          const ctx = getContextSafe();
          const settings = ctx ? getSettings(ctx) : null;
          if (settings) {
            settings.theme = theme.id;
            saveSettings(ctx);
          }
        } catch (error) {
          logApp('warn', `保存主题失败: ${String(error?.message || error)}`);
        }
        applyTheme(theme.id);
        closeThemeMenu();
      });
      menu.appendChild(item);
    }
  };

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    if (menu.hidden) {
      renderThemeMenu();
      menu.hidden = false;
      button.setAttribute('aria-expanded', 'true');
    } else {
      closeThemeMenu();
    }
  });
  document.addEventListener('click', (event) => {
    if (menu.hidden) return;
    if (event.target instanceof Element && typeof event.target.closest === 'function'
      && event.target.closest('#' + THEME_ID + ', #' + THEME_MENU_ID)) return;
    closeThemeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) closeThemeMenu();
  });

  applyTheme(getCurrentTheme());
  panel.dataset.themeReady = 'true';
}

// ---------- 确认弹层 ----------
// TauriTavern 的 WebView 会把原生 window.confirm 拦截为 plugin:dialog|confirm 命令，
// 但宿主 ACL 未放行该命令，调用会 Promise reject 并打印
// 「Command plugin:dialog|confirm not allowed by ACL」。因此自绘确认弹层，
// 破坏性操作统一用 await kaleidoConfirm(...) 确认，避免误删也避免未处理拒绝。
const KALEIDO_CONFIRM_ID = 'kaleido-confirm-overlay';
let kaleidoConfirmResolve = null;

function isKaleidoConfirmOpen() {
  const overlay = document.getElementById(KALEIDO_CONFIRM_ID);
  return Boolean(overlay && overlay.classList.contains('is-open'));
}

function settleKaleidoConfirm(result) {
  const resolve = kaleidoConfirmResolve;
  kaleidoConfirmResolve = null;
  const overlay = document.getElementById(KALEIDO_CONFIRM_ID);
  if (overlay) overlay.classList.remove('is-open');
  resolve?.(result);
}

function getKaleidoConfirmOverlay() {
  let overlay = document.getElementById(KALEIDO_CONFIRM_ID);
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = KALEIDO_CONFIRM_ID;
  overlay.className = 'kaleido-confirm';
  overlay.innerHTML = `
    <div class="kaleido-confirm__card" role="alertdialog" aria-modal="true" aria-label="确认操作">
      <p class="kaleido-confirm__message"></p>
      <div class="kaleido-confirm__actions">
        <button type="button" class="kaleido-confirm__cancel">取消</button>
        <button type="button" class="kaleido-btn kaleido-confirm__ok">确定</button>
      </div>
    </div>
  `;
  overlay.querySelector('.kaleido-confirm__cancel')?.addEventListener('click', () => settleKaleidoConfirm(false));
  overlay.querySelector('.kaleido-confirm__ok')?.addEventListener('click', () => settleKaleidoConfirm(true));
  document.body.appendChild(overlay);
  return overlay;
}

// 自绘确认：返回 Promise<boolean>，await 后为 true 表示用户点了「确定」。
// 同一时刻只允许一个待确认弹层，新的会以「取消」结掉旧的。
function kaleidoConfirm(message) {
  if (kaleidoConfirmResolve) settleKaleidoConfirm(false);
  const overlay = getKaleidoConfirmOverlay();
  overlay.querySelector('.kaleido-confirm__message').textContent = message;
  overlay.classList.add('is-open');
  const okButton = overlay.querySelector('.kaleido-confirm__ok');
  setTimeout(() => okButton?.focus?.(), 0);
  return new Promise((resolve) => {
    kaleidoConfirmResolve = resolve;
  });
}

// ---------- 自绘文本输入弹层（另存预设命名等） ----------
// 与确认弹层同款：宿主没有可用的 prompt 对话框（ACL 拦截 window.prompt），
// 文本输入统一走自绘浮层。返回 Promise<string|null>，取消返回 null。
const KALEIDO_PROMPT_ID = 'kaleido-prompt-overlay';
let kaleidoPromptResolve = null;

function isKaleidoPromptOpen() {
  const overlay = document.getElementById(KALEIDO_PROMPT_ID);
  return Boolean(overlay && overlay.classList.contains('is-open'));
}

function settleKaleidoPrompt(result) {
  const resolve = kaleidoPromptResolve;
  kaleidoPromptResolve = null;
  const overlay = document.getElementById(KALEIDO_PROMPT_ID);
  if (overlay) overlay.classList.remove('is-open');
  resolve?.(result);
}

function getKaleidoPromptOverlay() {
  let overlay = document.getElementById(KALEIDO_PROMPT_ID);
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = KALEIDO_PROMPT_ID;
  overlay.className = 'kaleido-confirm';
  overlay.innerHTML = `
    <div class="kaleido-confirm__card" role="dialog" aria-modal="true" aria-label="输入">
      <p class="kaleido-prompt__message kaleido-confirm__message"></p>
      <input type="text" class="kaleido-input kaleido-prompt__input" spellcheck="false" aria-label="输入内容" />
      <div class="kaleido-confirm__actions">
        <button type="button" class="kaleido-confirm__cancel">取消</button>
        <button type="button" class="kaleido-btn kaleido-prompt__ok">确定</button>
      </div>
    </div>
  `;
  const input = overlay.querySelector('.kaleido-prompt__input');
  const submit = () => {
    const value = String(input?.value ?? '').trim();
    settleKaleidoPrompt(value || null);
  };
  overlay.querySelector('.kaleido-confirm__cancel')?.addEventListener('click', () => settleKaleidoPrompt(null));
  overlay.querySelector('.kaleido-prompt__ok')?.addEventListener('click', submit);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  });
  document.body.appendChild(overlay);
  return overlay;
}

// 自绘文本输入：返回 Promise<string|null>（trim 后为空 / 取消 → null）。
// 同一时刻只允许一个待输入弹层，新的会以「取消」结掉旧的。
function kaleidoPrompt(message, defaultValue = '') {
  if (kaleidoPromptResolve) settleKaleidoPrompt(null);
  const overlay = getKaleidoPromptOverlay();
  overlay.querySelector('.kaleido-prompt__message').textContent = message;
  const input = overlay.querySelector('.kaleido-prompt__input');
  if (input) input.value = String(defaultValue ?? '');
  overlay.classList.add('is-open');
  setTimeout(() => {
    input?.focus?.();
    input?.select?.();
  }, 0);
  return new Promise((resolve) => {
    kaleidoPromptResolve = resolve;
  });
}
