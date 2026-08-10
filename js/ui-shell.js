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
    <span class="kaleido-sphere__eye" aria-hidden="true"></span>
    <span class="kaleido-sphere__hub" aria-hidden="true"></span>
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
      dragState = {
        offsetX: event.clientX - dialog.offsetLeft,
        offsetY: event.clientY - dialog.offsetTop,
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
  window.addEventListener('resize', () => ensurePanelPosition(panel));
  panel.dataset.dragReady = 'true';
}

function openPanel() {
  const panel = getPanel();
  if (!panel) return;
  logApp('debug', '面板已打开');
  showPanelView(HOME_VIEW_ID);
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
  if (back) back.style.visibility = viewId === HOME_VIEW_ID ? 'hidden' : 'visible';
  const title = document.getElementById(PANEL_TITLE_ID);
  if (title) title.textContent = PANEL_VIEW_TITLES[viewId] || MODULE_DISPLAY_NAME;
  if (viewId === LOG_VIEW_ID) {
    renderLogList();
    updateLogStats();
  }
  if (viewId === INJECT_VIEW_ID) {
    renderInjectView();
  }
  ensurePanelPosition(panel);
}

function initPanelViews(panel) {
  if (!panel || panel.dataset.viewsReady === 'true') return;
  document.getElementById(PANEL_BACK_ID)?.addEventListener('click', () => showPanelView(HOME_VIEW_ID));
  document.getElementById(HOME_API_CARD_ID)?.addEventListener('click', () => showPanelView(API_VIEW_ID));
  document.getElementById(HOME_STORY_CARD_ID)?.addEventListener('click', () => openStoryWorkbench());
  document.getElementById(HOME_LOG_BUTTON_ID)?.addEventListener('click', () => showPanelView(LOG_VIEW_ID));
  document.getElementById(HOME_PRESET_CARD_ID)?.addEventListener('click', () => showPanelView(PRESET_VIEW_ID));
  document.getElementById(HOME_INJECT_CARD_ID)?.addEventListener('click', () => showPanelView(INJECT_VIEW_ID));
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
        <span class="kaleido-panel__logo" aria-hidden="true"><span class="${MENU_ICON_CLASS}"></span></span>
        <span id="${PANEL_TITLE_ID}" class="kaleido-panel__title">${MODULE_DISPLAY_NAME}</span>
        <button type="button" class="kaleido-panel__close" aria-label="关闭" title="关闭">✕</button>
      </div>
      <div class="kaleido-panel__body">
        <section id="${HOME_VIEW_ID}" class="kaleido-view is-active" aria-hidden="false">
          <div class="kaleido-home__hero">
            <p class="kaleido-home__slogan"><span class="kaleido-home__slogan-first" aria-hidden="true">镜</span>中万象，皆是文章</p>
            <button type="button" id="${HOME_LOG_BUTTON_ID}" class="kaleido-home__log-btn" title="系统日志：后台运行记录与网络请求" aria-label="系统日志">
              <span class="${LOG_ICON_CLASS}"></span>
              <span id="${HOME_LOG_BADGE_ID}" class="kaleido-home__log-badge" data-state="idle" hidden></span>
            </button>
          </div>
          <div class="kaleido-home__grid">
            <button type="button" id="${HOME_API_CARD_ID}" class="kaleido-home__card" title="配置 AI 接口，引擎的基石">
              <span class="kaleido-home__card-icon"><span class="${API_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">API 连接</span>
                <span id="${HOME_API_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">尚未连接</span>
              </span>
            </button>
            <button type="button" id="${HOME_STORY_CARD_ID}" class="kaleido-home__card" title="剧情脉络：节点与事件的工作台">
              <span class="kaleido-home__card-icon"><span class="${STORY_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">剧情脉络</span>
                <span id="${HOME_STORY_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">尚未添加</span>
              </span>
            </button>
            <button type="button" id="${HOME_PRESET_CARD_ID}" class="kaleido-home__card" title="预设模版：修改与重置默认提示词">
              <span class="kaleido-home__card-icon"><span class="${PRESET_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">预设模版</span>
                <span id="${HOME_PRESET_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">默认配置</span>
              </span>
            </button>
            <button type="button" id="${HOME_INJECT_CARD_ID}" class="kaleido-home__card" title="剧情预筛：点击发送时自动挑选并注入本轮事件">
              <span class="kaleido-home__card-icon"><span class="${INJECT_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">注入实录</span>
                <span id="${HOME_INJECT_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">尚未运行</span>
              </span>
            </button>
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
              <p class="kaleido-api__hint">同时最多发送的 AI 请求数（默认 3）；多出的请求会排队等待前面的请求完成后再发送。</p>
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
              <p class="kaleido-api__hint">仅对带思考能力的模型生效；「关闭思考」可避免模型把输出预算花在思考上导致正文为空。</p>
            </div>
            <div class="kaleido-api__divider" aria-hidden="true"></div>
            <div class="kaleido-api__head">
              <span class="kaleido-api__title">剧情预筛</span>
              <span id="${GATE_STATUS_ID}" class="kaleido-api__status" data-state="idle">未启用</span>
            </div>
            <p class="kaleido-api__hint">点击发送时，AI 先读取剧情脉络（节点与事件的名字 / ID / 触发条件 / 描述）与最近 4 条消息，挑选本轮应触发的事件，再把事件正文注入上下文。</p>
            <div class="kaleido-api__field">
              <span class="kaleido-api__label">启用剧情预筛</span>
              <button type="button" id="${GATE_TOGGLE_ID}" class="kaleido-btn kaleido-api__concurrency-toggle" title="开启/关闭剧情预筛">🎬 剧情预筛：开</button>
            </div>
            <div class="kaleido-api__field">
              <span class="kaleido-api__label">预筛提示词</span>
              <textarea id="${GATE_PROMPT_ID}" class="kaleido-input kaleido-gate__prompt" rows="8" spellcheck="false" placeholder="留空使用默认提示词"></textarea>
              <div class="kaleido-api__actions">
                <button type="button" id="${GATE_PROMPT_RESET_ID}" class="kaleido-btn" title="恢复为内置默认提示词">恢复默认</button>
              </div>
            </div>
            <p class="kaleido-api__hint">填入接口地址与 API Key 后点「连接并拉取模型」，再从列表选择模型；不支持模型列表的渠道可直接手动填写模型名称。</p>
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
            <p class="kaleido-preset__note">各子系统提示词按标签页切换编辑，改完点「💾 保存」；「↺ 恢复默认」可还原出厂内容。</p>
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
            <p class="kaleido-inject__note">展示最近一轮「剧情预筛」的完整结果：预筛原文（Gate 返回）、本轮触发的事件，以及最终注入上下文的提示词原文。</p>
            <div id="${INJECT_SUMMARY_ID}" class="kaleido-inject__summary" hidden></div>
            <div id="${INJECT_EMPTY_ID}" class="kaleido-inject__empty" hidden>还没有预筛记录：开启「剧情预筛」并发送消息后，这里会展示最近一轮的结果。</div>
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
          </div>
        </section>
      </div>
      <div class="kaleido-panel__footer">
        <span class="kaleido-panel__version">v${MODULE_VERSION}</span>
        <span class="kaleido-panel__slogan">镜中万象 · 皆是文章</span>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  initDraggablePanel(panel);
  initPanelViews(panel);
  initApiSection(panel);
  initStorySection();
  initLogView(panel);
  initPresetSection(panel);
  panel.querySelector('.kaleido-panel__close')?.addEventListener('click', closePanel);
  if (!globalThis[ESC_KEY_HANDLER_KEY]) {
    globalThis[ESC_KEY_HANDLER_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      if (isStoryWorkbenchOpen()) return;
      const activeView = panel.querySelector('.kaleido-view.is-active');
      if (activeView && activeView.id !== HOME_VIEW_ID) {
        showPanelView(HOME_VIEW_ID);
        return;
      }
      closePanel();
    };
    document.addEventListener('keydown', globalThis[ESC_KEY_HANDLER_KEY]);
  }
  return panel;
}
