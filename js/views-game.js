// ===== 万华镜（Kaleidoscope）游戏模式：玩家档案 + 游戏地图 =====
// 手机桌面式双入口：视图里先看到两个 App 图标（游戏地图 / 游戏数据），
// 点击某个图标后图标消失、进入对应界面（地图界面 / 数据档案界面，
// 「变量系统」注入提示词的那些变量总览，展示的就是主模型实际看到的内容）。
// 界面内点左上角返回键回到图标入口，点右上角 ✕ 关闭面板回悬浮球。
// 两个区块均只读，无编辑入口；地图编辑在「变量系统 → 游戏地图」tab 里完成。
// 视觉：档案体例——朱砂印章节 + 点线目次，只呈现数值本身，不做工作台式标注。

let gameActivePane = null; // null（图标入口）| 'map'（游戏地图） | 'data'（游戏数据）

function getGameView() {
  return document.getElementById(GAME_VIEW_ID);
}

function isGameViewActive() {
  const view = getGameView();
  return Boolean(view && view.classList.contains('is-active'));
}

// 刷新入口：视图打开 / 手动刷新 / 每轮生成结束后（若视图正打开）调用。
// resetToLauncher：进入视图时重置到入口（不点击不显示任何界面）。
function renderGameView(resetToLauncher = false) {
  const view = getGameView();
  if (!view) return;
  if (resetToLauncher) gameActivePane = null;
  const ctx = getContextSafe();
  renderGameMeta(ctx);
  renderGameTree(ctx);
  renderGameMap(ctx);
  applyGamePane();
}

// 视图正打开时刷新（变量维护完成 / 生成结束后调用，让面板数据保持最新）。
function refreshGameViewIfActive() {
  if (!isGameViewActive()) return;
  renderGameView();
}

// 手机桌面式切换：入口态只显示两个 App 图标；点击图标后图标消失、
// 对应界面接管整个视图；界面内左上角返回键（面板头部）回到入口。
function applyGamePane() {
  const mapPane = document.getElementById(GAME_MAP_PANE_ID);
  const tree = document.getElementById(GAME_TREE_ID);
  const mapTab = document.getElementById(GAME_MAP_TAB_ID);
  const dataTab = document.getElementById(GAME_DATA_TAB_ID);
  const switchEl = document.getElementById(GAME_SWITCH_ID);
  const hint = document.getElementById(GAME_LAUNCHER_HINT_ID);
  if (!mapPane || !tree) return;
  const isMap = gameActivePane === 'map';
  const isData = gameActivePane === 'data';
  const inInterface = gameActivePane !== null;
  mapPane.hidden = !isMap;
  tree.hidden = !isData;
  if (switchEl) switchEl.hidden = inInterface;
  if (hint) hint.hidden = inInterface;
  if (mapTab) {
    mapTab.classList.toggle('is-active', isMap);
    mapTab.setAttribute('aria-selected', String(isMap));
  }
  if (dataTab) {
    dataTab.classList.toggle('is-active', isData);
    dataTab.setAttribute('aria-selected', String(isData));
  }
  // 界面内显示左上角返回键（回到图标入口）；入口态隐藏（与首页一致）。
  const back = document.getElementById(PANEL_BACK_ID);
  if (back) back.style.visibility = inInterface ? 'visible' : 'hidden';
}

// 封面副题：只保留最近更新时间（注入 / 自动维护等工程信息不面向玩家）。
function renderGameMeta(ctx) {
  const updated = document.getElementById(GAME_UPDATED_ID);
  if (!updated) return;
  const round = globalThis[VALUES_LAST_ROUND_KEY] || null;
  const state = ctx ? getValuesChatState(ctx) : null;
  const updatedAt = state?.updatedAt || round?.at || '';
  if (updatedAt) {
    updated.textContent = `最近更新 · ${new Date(updatedAt).toLocaleString()}`;
    updated.hidden = false;
  } else {
    updated.textContent = '';
    updated.hidden = true;
  }
}

// ---------- 档案正文（游戏值总览）----------
// 条目行：名称 + 点线目次 + 数值，一眼可读、无任何徽标。
function buildGameEntry(path, name, node, depth) {
  const entry = document.createElement('div');
  entry.className = 'kaleido-game__entry';
  entry.dataset.path = JSON.stringify(path);
  entry.style.setProperty('--depth', String(depth));
  const text = formatValuesLeafText(node);
  entry.innerHTML = [
    `<span class="kaleido-game__entry-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>`,
    '<span class="kaleido-game__entry-leader" aria-hidden="true"></span>',
    `<span class="kaleido-game__entry-value${typeof node === 'number' ? ' is-numeric' : ''}" title="${escapeHtml(text)}">${escapeHtml(text)}</span>`,
  ].join('');
  return entry;
}

// 章节头：节点名（比变量条目稍大）+ 渐变分隔线。
function buildGameChapter(path, name, depth) {
  const chapter = document.createElement('section');
  chapter.className = 'kaleido-game__chapter';
  chapter.dataset.path = JSON.stringify(path);
  chapter.style.setProperty('--depth', String(depth));
  chapter.innerHTML = `
    <header class="kaleido-game__chapter-head">
      <span class="kaleido-game__chapter-seal">${escapeHtml(name)}</span>
      <span class="kaleido-game__chapter-rule" aria-hidden="true"></span>
    </header>
  `;
  return chapter;
}

// 一层档案内容：先列条目（叶子），再排章节（容器）；全部平铺展示，不折叠。
function renderGameLevel(parent, ctx, node, path, depth) {
  const order = ctx ? getValuesTreeOrder(ctx) : {};
  const names = valuesOrderedNames(order, path.join('/'), node);
  const entries = document.createElement('div');
  entries.className = 'kaleido-game__entries';
  entries.style.setProperty('--depth', String(depth));
  for (const name of names) {
    const child = node[name];
    if (valuesIsContainer(child)) continue;
    entries.appendChild(buildGameEntry(path.concat(name), name, child, depth));
  }
  if (entries.childElementCount > 0) parent.appendChild(entries);
  for (const name of names) {
    const child = node[name];
    if (!valuesIsContainer(child)) continue;
    const childPath = path.concat(name);
    const chapter = buildGameChapter(childPath, name, depth);
    renderGameLevel(chapter, ctx, child, childPath, depth + 1);
    parent.appendChild(chapter);
  }
}

function renderGameTree(ctx) {
  const body = document.getElementById(GAME_TREE_ID);
  if (!body) return;
  const tree = ctx ? getValuesGameTree(ctx) : {};
  body.innerHTML = '';
  if (Object.keys(tree).length === 0) {
    const empty = document.createElement('div');
    empty.className = 'kaleido-game__empty';
    empty.textContent = '暂无游戏数据。';
    body.appendChild(empty);
    return;
  }
  renderGameLevel(body, ctx, tree, [], 0);
}

// ---------- 视图装配（手机端 / 电脑端共用面板内视图）----------
function initGameSection(panel) {
  if (!panel || document.getElementById(GAME_VIEW_ID)) return;
  const section = document.createElement('section');
  section.id = GAME_VIEW_ID;
  section.className = 'kaleido-view kaleido-game-view';
  section.setAttribute('aria-hidden', 'true');
  section.innerHTML = `
    <div class="kaleido-game">
      <!-- 档案封面 -->
      <div class="kaleido-game__cover">
        <span class="kaleido-game__cover-seal" aria-hidden="true"><span class="${GAME_ICON_CLASS}"></span></span>
        <span class="kaleido-game__cover-text">
          <span class="kaleido-game__cover-title">游戏模式</span>
          <span id="${GAME_UPDATED_ID}" class="kaleido-game__cover-updated" hidden title="最近一次游戏值写入时间"></span>
        </span>
        <span class="kaleido-game__cover-spacer"></span>
        <button type="button" id="${GAME_REFRESH_ID}" class="kaleido-game__refresh" title="刷新当前游戏数据">
          <span class="fa-solid fa-arrows-rotate"></span> 刷新
        </button>
        <button type="button" id="${GAME_GEAR_ID}" class="kaleido-game__gear" title="返回工作台主页" aria-label="返回工作台主页">
          <span class="fa-solid fa-house"></span>
        </button>
      </div>
      <!-- 双入口 App 图标：游戏地图 / 游戏数据（点击图标消失、进入对应界面） -->
      <div id="${GAME_SWITCH_ID}" class="kaleido-game__switch" role="tablist" aria-label="游戏模式入口">
        <button type="button" id="${GAME_MAP_TAB_ID}" class="kaleido-game__switch-btn" role="tab" aria-selected="false" title="进入当前角色绑定的游戏地图（在「变量系统 → 游戏地图」编辑）">
          <span class="kaleido-game__switch-icon"><span class="${MAP_ICON_CLASS}"></span></span>
          <span class="kaleido-game__switch-label">游戏地图</span>
        </button>
        <button type="button" id="${GAME_DATA_TAB_ID}" class="kaleido-game__switch-btn" role="tab" aria-selected="false" title="进入当前游戏数据总览">
          <span class="kaleido-game__switch-icon"><span class="${MAP_DATA_ICON_CLASS}"></span></span>
          <span class="kaleido-game__switch-label">游戏数据</span>
        </button>
      </div>
      <p id="${GAME_LAUNCHER_HINT_ID}" class="kaleido-game__launcher-hint">点击图标进入对应界面 · 左上角返回键回到入口</p>
      <!-- 地图展示（渲染函数见 views-map.js） -->
      <div id="${GAME_MAP_PANE_ID}" class="kaleido-game__map"></div>
      <!-- 档案正文：游戏值总览 -->
      <div id="${GAME_TREE_ID}" class="kaleido-game__tree" hidden></div>
    </div>
  `;
  panel.querySelector('.kaleido-panel__body')?.appendChild(section);
  document.getElementById(GAME_REFRESH_ID)?.addEventListener('click', () => {
    renderGameView();
  });
  document.getElementById(GAME_GEAR_ID)?.addEventListener('click', () => showPanelView(HOME_VIEW_ID));
  document.getElementById(GAME_MAP_TAB_ID)?.addEventListener('click', () => {
    gameActivePane = 'map';
    applyGamePane();
  });
  document.getElementById(GAME_DATA_TAB_ID)?.addEventListener('click', () => {
    gameActivePane = 'data';
    applyGamePane();
  });
}
