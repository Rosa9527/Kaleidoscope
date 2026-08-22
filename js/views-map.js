// ===== 万华镜（Kaleidoscope）地图系统：游戏模式地图展示 + 变量工作台地图编辑器 =====
// 两个入口：
// - 游戏模式（视图内切换）：背景图 + 地点标记的只读展示，数据源与编辑器一致
//   （getMapBundle：角色卡优先、全局设置兜底）。
// - 变量工作台「游戏地图」tab：上传图片 → 裁剪成背景 → 双击建点 / 拖动移动 /
//   选中改名，全部编辑先落内存（mapEditorState），点「保存」才写角色卡。
// 地点坐标一律按背景图百分比（0~100）存取，展示与编辑按比例缩放对齐。
// 编辑舞台限高（60vh）内部滚动（工作台是固定高度容器，无外层滚动兜底）；
// 坐标与地点层的基准是画布层 canvas（背景图完整显示区，随滚动移动）。

// ---------- 编辑器内存态 ----------
// { card, dirty, selectedId, rawDataURL, rawImage }
// card：工作副本（克隆自角色卡 / 设置兜底）；dirty：有未保存修改；
// rawImage：原始上传图（裁剪前），「重新裁剪」时复用，不落盘。
let mapEditorState = null;
// 地点拖动中的状态（pointer 事件期间有效）。
let mapPointDrag = null;
// 裁剪弹层状态：{ image, rect, drag }
let mapCropState = null;

function ensureMapEditorState() {
  if (!mapEditorState) {
    const ctx = getContextSafe();
    const bundle = ctx ? getMapBundle(ctx) : null;
    mapEditorState = {
      card: bundle ? cloneValue(bundle) : createEmptyMapCard(),
      dirty: false,
      selectedId: null,
      rawDataURL: '',
      rawImage: null,
    };
  }
  return mapEditorState;
}

function findMapPoint(id) {
  const state = ensureMapEditorState();
  return state.card.points.find((point) => point.id === id) || null;
}

function mapClampRange(value, lo, hi) {
  return Math.min(hi, Math.max(lo, value));
}

// =========================================================
// 游戏模式 · 地图展示
// =========================================================
function renderGameMap(ctx) {
  const pane = document.getElementById(GAME_MAP_PANE_ID);
  if (!pane) return;
  const map = ctx ? getMapBundle(ctx) : null;
  pane.innerHTML = '';
  if (!map || !map.background) {
    const empty = document.createElement('div');
    empty.className = 'kaleido-game-map__empty';
    empty.innerHTML = `
      <span class="kaleido-game-map__empty-icon"><span class="${MAP_ICON_CLASS}"></span></span>
      <p class="kaleido-game-map__empty-title">暂无地图</p>
      <p class="kaleido-game-map__empty-text">到「变量系统 → 游戏地图」上传背景图、双击添加地点，<br/>保存后这里就能看到当前角色的地图。</p>
      <button type="button" id="${MAP_GO_EDIT_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary">去编辑地图</button>
    `;
    pane.appendChild(empty);
    document.getElementById(MAP_GO_EDIT_ID)?.addEventListener('click', () => openValuesMapTab());
    return;
  }
  const frame = document.createElement('div');
  frame.className = 'kaleido-game-map__frame';
  frame.innerHTML = `
    <img class="kaleido-game-map__img" src="${escapeHtml(map.background)}" alt="游戏地图" />
    <div class="kaleido-game-map__points">
      ${map.points.map((point) => `
        <button type="button" class="kaleido-game-map__point" data-id="${escapeHtml(point.id)}" title="${escapeHtml(point.name)}" style="left:${point.x}%;top:${point.y}%">
          <span class="kaleido-game-map__pin"><span class="${MAP_POINT_ICON_CLASS}"></span></span>
          <span class="kaleido-game-map__name">${escapeHtml(point.name)}</span>
        </button>`).join('')}
    </div>
  `;
  pane.appendChild(frame);
  if (map.updatedAt) {
    const meta = document.createElement('div');
    meta.className = 'kaleido-game-map__meta';
    meta.textContent = `最近更新 · ${new Date(map.updatedAt).toLocaleString()}`;
    pane.appendChild(meta);
  }
  // 点击地点：高亮当前点（点击空白处取消高亮）。
  frame.querySelectorAll('.kaleido-game-map__point').forEach((el) => {
    el.addEventListener('click', () => {
      const was = el.classList.contains('is-selected');
      frame.querySelectorAll('.kaleido-game-map__point.is-selected').forEach((other) => other.classList.remove('is-selected'));
      if (!was) el.classList.add('is-selected');
    });
  });
  frame.addEventListener('click', (event) => {
    if (event.target.closest('.kaleido-game-map__point')) return;
    frame.querySelectorAll('.kaleido-game-map__point.is-selected').forEach((other) => other.classList.remove('is-selected'));
  });
}

// =========================================================
// 变量工作台 · 地图编辑器
// =========================================================
function buildMapEditorHTML() {
  return `
    <div class="kaleido-map-editor">
      <div class="kaleido-map-editor__toolbar">
        <span id="${MAP_BINDING_ID}" class="kaleido-values__binding" data-state="idle" title="地图存储绑定状态">未绑定角色</span>
        <span class="kaleido-values__toolbar-spacer"></span>
        <button type="button" id="${MAP_UPLOAD_BTN_ID}" class="kaleido-btn kaleido-btn--mini" title="上传图片作为地图背景，上传后可裁剪">
          <span class="${MAP_ICON_CLASS}"></span> 上传图片
        </button>
        <button type="button" id="${MAP_CROP_BTN_ID}" class="kaleido-btn kaleido-btn--mini" title="用原始图片重新裁剪背景" hidden>
          <span class="${MAP_CROP_ICON_CLASS}"></span> 重新裁剪
        </button>
        <button type="button" id="${MAP_ADD_POINT_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="在背景图中央添加一个地点（也可双击地图任意处添加）">＋ 新地点</button>
        <button type="button" id="${MAP_SAVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="保存地图到当前角色卡">
          <span class="${VALUES_SAVE_ICON_CLASS}"></span> 保存
        </button>
        <button type="button" id="${MAP_DELETE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" title="删除整张地图（背景图与全部地点），保存后生效">🗑 删除地图</button>
      </div>
      <div id="${MAP_HINT_ID}" class="kaleido-map-editor__hint">双击地图添加地点 · 拖动地点调整位置 · 点击选中后改名</div>
      <div class="kaleido-map-editor__stage-wrap">
        <div id="${MAP_STAGE_ID}" class="kaleido-map-editor__stage">
          <div id="${MAP_EMPTY_ID}" class="kaleido-map-editor__empty">
            <span class="kaleido-map-editor__empty-icon"><span class="${MAP_ICON_CLASS}"></span></span>
            <p class="kaleido-map-editor__empty-title">还没有地图背景</p>
            <p class="kaleido-map-editor__empty-text">点击「上传图片」，裁剪出想要的区域后，<br/>即可双击地图添加地点。</p>
          </div>
          <div id="${MAP_CANVAS_ID}" class="kaleido-map-editor__canvas">
            <img id="${MAP_STAGE_IMG_ID}" class="kaleido-map-editor__img" alt="地图背景" hidden />
            <div id="${MAP_POINTS_ID}" class="kaleido-map-editor__points" hidden></div>
          </div>
        </div>
        <div id="${MAP_POINT_EDITOR_ID}" class="kaleido-map-editor__point-editor" hidden>
          <span class="kaleido-map-editor__point-editor-label"><span class="${MAP_POINT_ICON_CLASS}"></span> 地点名称</span>
          <input id="${MAP_POINT_NAME_ID}" class="kaleido-input" type="text" maxlength="${MAP_POINT_NAME_MAX}" placeholder="如：学校 / 森林 / 城镇" autocomplete="off" spellcheck="false" />
          <button type="button" id="${MAP_POINT_REMOVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" title="删除该地点">删除</button>
          <button type="button" id="${MAP_POINT_EDITOR_CLOSE_ID}" class="kaleido-icon-btn" title="取消选中" aria-label="取消选中">✕</button>
        </div>
      </div>
      <input id="${MAP_UPLOAD_INPUT_ID}" type="file" accept="image/*" hidden />
    </div>
  `;
}

// 渲染入口：tab 激活 / 首次打开时调用；内容只建一次，之后按状态刷新。
function renderMapEditor() {
  const pane = document.getElementById(VALUES_MAP_PANE_ID);
  if (!pane) return;
  ensureMapEditorState();
  if (!pane.dataset.ready) {
    pane.innerHTML = buildMapEditorHTML();
    pane.dataset.ready = 'true';
    bindMapEditorEvents();
  }
  refreshMapBindingStatus();
  refreshMapToolbar();
  renderMapStage();
  renderMapPointEditor();
  refreshMapDirty();
}

function refreshMapBindingStatus() {
  const badge = document.getElementById(MAP_BINDING_ID);
  if (!badge) return;
  const ctx = getContextSafe();
  const character = ctx ? getStoryCharacter(ctx) : null;
  if (!character) {
    badge.textContent = '未绑定角色 · 保存到全局设置';
    badge.dataset.state = 'idle';
    return;
  }
  const hasCard = Boolean(getMapCardData(ctx));
  badge.textContent = hasCard ? `已绑定 · ${character.name}` : `待绑定 · ${character.name}`;
  badge.dataset.state = hasCard ? 'ok' : 'warn';
}

function refreshMapToolbar() {
  const state = ensureMapEditorState();
  const cropBtn = document.getElementById(MAP_CROP_BTN_ID);
  const addBtn = document.getElementById(MAP_ADD_POINT_ID);
  if (cropBtn) cropBtn.hidden = !state.rawImage;
  if (addBtn) addBtn.disabled = !state.card.background;
}

function refreshMapDirty() {
  const state = ensureMapEditorState();
  const save = document.getElementById(MAP_SAVE_ID);
  const hint = document.getElementById(MAP_HINT_ID);
  if (save) {
    save.classList.toggle('is-dirty', state.dirty);
    save.title = state.dirty ? '有未保存的修改，点击保存到角色卡' : '保存地图到当前角色卡';
  }
  if (hint) {
    hint.textContent = state.dirty
      ? '✎ 有未保存的修改 · 双击添加地点 · 拖动调整位置 · 点击选中后改名'
      : '双击地图添加地点 · 拖动地点调整位置 · 点击选中后改名';
  }
}

// ---------- 编辑舞台 ----------
function renderMapStage() {
  const state = ensureMapEditorState();
  const img = document.getElementById(MAP_STAGE_IMG_ID);
  const points = document.getElementById(MAP_POINTS_ID);
  const empty = document.getElementById(MAP_EMPTY_ID);
  if (!img || !points || !empty) return;
  const hasBg = Boolean(state.card.background);
  img.hidden = !hasBg;
  points.hidden = !hasBg;
  empty.hidden = hasBg;
  if (hasBg) {
    img.src = state.card.background;
    renderMapEditorPoints(points, state);
  }
}

function renderMapEditorPoints(container, state) {
  container.innerHTML = '';
  for (const point of state.card.points) {
    const el = document.createElement('div');
    el.className = 'kaleido-map-editor__point';
    el.dataset.id = point.id;
    el.classList.toggle('is-selected', point.id === state.selectedId);
    el.style.left = `${point.x}%`;
    el.style.top = `${point.y}%`;
    el.setAttribute('title', point.name);
    el.innerHTML = `
      <span class="kaleido-map-editor__pin"><span class="${MAP_POINT_ICON_CLASS}"></span></span>
      <span class="kaleido-map-editor__name">${escapeHtml(point.name)}</span>
    `;
    container.appendChild(el);
  }
}

// ---------- 选中地点编辑条 ----------
function renderMapPointEditor() {
  const state = ensureMapEditorState();
  const editor = document.getElementById(MAP_POINT_EDITOR_ID);
  const nameInput = document.getElementById(MAP_POINT_NAME_ID);
  if (!editor || !nameInput) return;
  const point = state.selectedId ? findMapPoint(state.selectedId) : null;
  editor.hidden = !point;
  if (point && document.activeElement !== nameInput) {
    nameInput.value = point.name;
  }
}

function selectMapPoint(id) {
  const state = ensureMapEditorState();
  state.selectedId = id || null;
  const container = document.getElementById(MAP_POINTS_ID);
  if (container) {
    container.querySelectorAll('.kaleido-map-editor__point').forEach((el) => {
      el.classList.toggle('is-selected', el.dataset.id === state.selectedId);
    });
  }
  renderMapPointEditor();
}

function addMapPoint(x, y) {
  const state = ensureMapEditorState();
  const point = {
    id: mapGenPointId(),
    name: MAP_DEFAULT_POINT_NAME,
    x: mapClampCoord(x),
    y: mapClampCoord(y),
  };
  state.card.points.push(point);
  state.selectedId = point.id;
  state.dirty = true;
  renderMapStage();
  renderMapPointEditor();
  refreshMapDirty();
  const nameInput = document.getElementById(MAP_POINT_NAME_ID);
  if (nameInput) {
    nameInput.focus();
    nameInput.select();
  }
}

// ---------- 保存 / 删除 ----------
async function handleMapSave() {
  const state = ensureMapEditorState();
  const ctx = getContextSafe();
  const character = ctx ? getStoryCharacter(ctx) : null;
  if (!character || typeof ctx?.writeExtensionField !== 'function') {
    // 无角色卡：落全局设置兜底，保证展示界面仍能用（不随角色卡导入/导出）。
    fallbackMapDataToSettings(ctx, state.card);
    state.dirty = false;
    refreshMapDirty();
    valuesToastr('success', '已保存到全局设置（当前未绑定角色卡，不随角色卡导入/导出）');
    return;
  }
  state.card.updatedAt = new Date().toISOString();
  try {
    await saveMapNow(ctx, state.card);
  } catch (error) {
    valuesToastr('error', `保存失败：${String(error?.message || error).slice(0, 160)}`);
    return;
  }
  const expected = isEmptyMapCard(state.card) ? VALUES_UNSET_SENTINEL : state.card;
  const ok = await verifyMapCardWrite(ctx, String(character.avatar), expected);
  if (ok === false) {
    valuesToastr('error', '保存未生效：角色卡写入被宿主忽略，请重试');
    return;
  }
  state.dirty = false;
  refreshMapDirty();
  refreshMapBindingStatus();
  valuesToastr('success', isEmptyMapCard(state.card) ? '地图已删除' : `已保存地图（${state.card.points.length} 个地点）`);
}

async function handleMapDelete() {
  const state = ensureMapEditorState();
  const hasData = Boolean(state.card.background) || state.card.points.length > 0;
  if (!hasData) return;
  const ok = await kaleidoConfirm('删除整张地图？\n背景图与全部地点都会被移除，保存后生效。');
  if (!ok) return;
  state.card = createEmptyMapCard();
  state.selectedId = null;
  state.dirty = true;
  renderMapStage();
  renderMapPointEditor();
  refreshMapToolbar();
  refreshMapDirty();
}

// ---------- 编辑器事件 ----------
function bindMapEditorEvents() {
  if (globalThis[MAP_EDITOR_EVENTS_KEY]) return;
  globalThis[MAP_EDITOR_EVENTS_KEY] = true;
  const uploadBtn = document.getElementById(MAP_UPLOAD_BTN_ID);
  const uploadInput = document.getElementById(MAP_UPLOAD_INPUT_ID);
  uploadBtn?.addEventListener('click', () => uploadInput?.click());
  uploadInput?.addEventListener('change', handleMapUpload);
  document.getElementById(MAP_CROP_BTN_ID)?.addEventListener('click', handleMapRecrop);
  document.getElementById(MAP_ADD_POINT_ID)?.addEventListener('click', () => addMapPoint(50, 50));
  document.getElementById(MAP_SAVE_ID)?.addEventListener('click', handleMapSave);
  document.getElementById(MAP_DELETE_ID)?.addEventListener('click', handleMapDelete);
  document.getElementById(MAP_STAGE_ID)?.addEventListener('dblclick', handleMapStageDblClick);
  document.getElementById(MAP_POINTS_ID)?.addEventListener('pointerdown', handleMapPointsPointerDown);
  document.getElementById(MAP_POINTS_ID)?.addEventListener('pointermove', handleMapPointsPointerMove);
  document.getElementById(MAP_POINTS_ID)?.addEventListener('pointerup', handleMapPointsPointerUp);
  document.getElementById(MAP_POINTS_ID)?.addEventListener('pointercancel', handleMapPointsPointerUp);
  const nameInput = document.getElementById(MAP_POINT_NAME_ID);
  nameInput?.addEventListener('input', () => {
    const state = ensureMapEditorState();
    const point = state.selectedId ? findMapPoint(state.selectedId) : null;
    if (!point) return;
    point.name = nameInput.value.slice(0, MAP_POINT_NAME_MAX);
    state.dirty = true;
    refreshMapDirty();
  });
  nameInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') nameInput.blur();
  });
  nameInput?.addEventListener('change', () => {
    const state = ensureMapEditorState();
    const point = state.selectedId ? findMapPoint(state.selectedId) : null;
    if (!point) return;
    const name = nameInput.value.trim() || MAP_DEFAULT_POINT_NAME;
    point.name = name.slice(0, MAP_POINT_NAME_MAX);
    renderMapStage();
  });
  document.getElementById(MAP_POINT_REMOVE_ID)?.addEventListener('click', async () => {
    const state = ensureMapEditorState();
    const point = state.selectedId ? findMapPoint(state.selectedId) : null;
    if (!point) return;
    const ok = await kaleidoConfirm(`删除地点「${point.name}」？`);
    if (!ok) return;
    state.card.points = state.card.points.filter((item) => item.id !== point.id);
    state.selectedId = null;
    state.dirty = true;
    renderMapStage();
    renderMapPointEditor();
    refreshMapDirty();
  });
  document.getElementById(MAP_POINT_EDITOR_CLOSE_ID)?.addEventListener('click', () => selectMapPoint(null));
}

async function handleMapUpload(event) {
  const input = event.target;
  const file = input?.files?.[0];
  input.value = ''; // 允许再次选择同一文件
  if (!file) return;
  try {
    const dataURL = await mapReadFileAsDataURL(file);
    const image = await mapLoadImage(dataURL);
    const state = ensureMapEditorState();
    state.rawDataURL = dataURL;
    state.rawImage = image;
    openMapCropDialog(image);
  } catch (error) {
    valuesToastr('error', String(error?.message || error));
  }
}

function handleMapRecrop() {
  const state = ensureMapEditorState();
  if (!state.rawImage) return;
  openMapCropDialog(state.rawImage);
}

function handleMapStageDblClick(event) {
  if (event.target.closest(`#${MAP_POINTS_ID} .kaleido-map-editor__point`)) return;
  const state = ensureMapEditorState();
  if (!state.card.background) return;
  // 坐标基准是 canvas（背景图完整显示区），舞台限高滚动后 rect 仍随内容移动，公式不变。
  const canvas = document.getElementById(MAP_CANVAS_ID);
  const rect = canvas?.getBoundingClientRect();
  if (!rect || !rect.width || !rect.height) return;
  addMapPoint(
    mapClampCoord(((event.clientX - rect.left) / rect.width) * 100),
    mapClampCoord(((event.clientY - rect.top) / rect.height) * 100)
  );
}

// 地点拖动：按下即选中；位移超过阈值才算拖动，抬起时提交坐标。
// 坐标基准是 canvas（背景图完整显示区）：舞台限高滚动后 rect 随内容移动，
// clientY - rect.top 天然含滚动偏移，无需再读 scrollTop。
function handleMapPointsPointerDown(event) {
  const pointEl = event.target.closest('.kaleido-map-editor__point');
  if (!pointEl) return;
  const state = ensureMapEditorState();
  const id = pointEl.dataset.id;
  if (state.selectedId !== id) selectMapPoint(id);
  const canvas = document.getElementById(MAP_CANVAS_ID);
  const rect = canvas?.getBoundingClientRect();
  if (!rect || !rect.width || !rect.height) return;
  mapPointDrag = {
    id,
    el: pointEl,
    startX: event.clientX,
    startY: event.clientY,
    canvasLeft: rect.left,
    canvasTop: rect.top,
    canvasW: rect.width,
    canvasH: rect.height,
    moved: false,
  };
  pointEl.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function handleMapPointsPointerMove(event) {
  const drag = mapPointDrag;
  if (!drag) return;
  const dx = event.clientX - drag.startX;
  const dy = event.clientY - drag.startY;
  if (!drag.moved && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
  drag.moved = true;
  const x = mapClampCoord(((event.clientX - drag.canvasLeft) / drag.canvasW) * 100);
  const y = mapClampCoord(((event.clientY - drag.canvasTop) / drag.canvasH) * 100);
  const point = findMapPoint(drag.id);
  if (!point) return;
  point.x = x;
  point.y = y;
  drag.el.style.left = `${x}%`;
  drag.el.style.top = `${y}%`;
}

function handleMapPointsPointerUp(event) {
  const drag = mapPointDrag;
  if (!drag) return;
  mapPointDrag = null;
  try {
    drag.el.releasePointerCapture?.(event.pointerId);
  } catch {}
  if (drag.moved) {
    const state = ensureMapEditorState();
    state.dirty = true;
    refreshMapDirty();
  }
}

// =========================================================
// 裁剪弹层（全屏遮罩，挂在 body；is-open 控制显示）
// =========================================================
// 舞台内图片等比缩放铺出「视图层」（kaleido-map-crop-view，含留白居中），
// 裁剪框只在该视图层内移动 / 缩放；换算到自然像素时用视图层尺寸做比例。
function initMapCropDialog() {
  if (getMapCropDialog()) return;
  const dialog = document.createElement('div');
  dialog.id = MAP_CROP_DIALOG_ID;
  dialog.className = 'kaleido-map-dialog';
  dialog.setAttribute('aria-hidden', 'true');
  dialog.innerHTML = `
    <div class="kaleido-map-dialog__inner" role="dialog" aria-label="裁剪地图背景">
      <div class="kaleido-map-dialog__header">
        <span class="kaleido-map-dialog__title"><span class="${MAP_CROP_ICON_CLASS}"></span> 裁剪背景图</span>
        <span class="kaleido-map-dialog__spacer"></span>
        <span id="${MAP_CROP_INFO_ID}" class="kaleido-map-dialog__info"></span>
        <button type="button" class="kaleido-map-dialog__cancel kaleido-icon-btn" title="取消裁剪" aria-label="取消裁剪">✕</button>
      </div>
      <div class="kaleido-map-dialog__body">
        <div id="${MAP_CROP_STAGE_ID}" class="kaleido-map-dialog__stage">
          <div id="${MAP_CROP_VIEW_ID}" class="kaleido-map-dialog__view">
            <img id="${MAP_CROP_IMG_ID}" class="kaleido-map-dialog__img" alt="待裁剪的背景图" />
            <div id="${MAP_CROP_BOX_ID}" class="kaleido-map-dialog__box">
              <span class="kaleido-map-dialog__handle" data-handle="nw" aria-hidden="true"></span>
              <span class="kaleido-map-dialog__handle" data-handle="ne" aria-hidden="true"></span>
              <span class="kaleido-map-dialog__handle" data-handle="sw" aria-hidden="true"></span>
              <span class="kaleido-map-dialog__handle" data-handle="se" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="kaleido-map-dialog__footer">
        <button type="button" id="${MAP_CROP_CONFIRM_ID}" class="kaleido-btn kaleido-btn--primary">确定裁剪</button>
        <button type="button" class="kaleido-map-dialog__cancel kaleido-btn kaleido-btn--ghost">取消</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  document.querySelectorAll(`#${MAP_CROP_DIALOG_ID} .kaleido-map-dialog__cancel`).forEach((btn) => {
    btn.addEventListener('click', closeMapCropDialog);
  });
  document.getElementById(MAP_CROP_CONFIRM_ID)?.addEventListener('click', handleMapCropConfirm);
  // 点遮罩空白处关闭。
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeMapCropDialog();
  });
  bindMapCropBoxEvents();
  if (!globalThis[MAP_CROP_ESC_KEY]) {
    globalThis[MAP_CROP_ESC_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      const dialogEl = getMapCropDialog();
      if (dialogEl && dialogEl.classList.contains('is-open')) closeMapCropDialog();
    };
    document.addEventListener('keydown', globalThis[MAP_CROP_ESC_KEY]);
  }
}

function getMapCropDialog() {
  return document.getElementById(MAP_CROP_DIALOG_ID);
}

function isMapCropDialogOpen() {
  const dialog = getMapCropDialog();
  return Boolean(dialog && dialog.classList.contains('is-open'));
}

function openMapCropDialog(image) {
  const dialog = getMapCropDialog();
  if (!dialog) return;
  const img = document.getElementById(MAP_CROP_IMG_ID);
  mapCropState = { image, view: null, rect: null, drag: null };
  // 先挂 onload / onerror 再赋 src（dataURL 解码可能同步完成，避免错过事件）。
  img.onload = () => {
    dialog.classList.add('is-open');
    dialog.setAttribute('aria-hidden', 'false');
    layoutMapCropView();
  };
  img.onerror = () => {
    closeMapCropDialog();
    valuesToastr('error', '图片加载失败，请重新上传');
  };
  img.src = image.src;
}

// 舞台内把图片等比缩放居中铺出视图层，裁剪框默认取视图层 70%。
function layoutMapCropView() {
  const state = mapCropState;
  if (!state?.image) return;
  const stage = document.getElementById(MAP_CROP_STAGE_ID);
  const view = document.getElementById(MAP_CROP_VIEW_ID);
  if (!stage || !view) return;
  const stageRect = stage.getBoundingClientRect();
  if (!stageRect.width || !stageRect.height) return;
  const scale = Math.min(stageRect.width / state.image.naturalWidth, stageRect.height / state.image.naturalHeight);
  const width = Math.max(1, Math.round(state.image.naturalWidth * scale));
  const height = Math.max(1, Math.round(state.image.naturalHeight * scale));
  const x = Math.round((stageRect.width - width) / 2);
  const y = Math.round((stageRect.height - height) / 2);
  state.view = { x, y, width, height };
  view.style.display = 'block';
  view.style.left = `${x}px`;
  view.style.top = `${y}px`;
  view.style.width = `${width}px`;
  view.style.height = `${height}px`;
  const boxW = Math.max(60, Math.round(width * 0.7));
  const boxH = Math.max(60, Math.round(height * 0.7));
  state.rect = {
    x: Math.round((width - boxW) / 2),
    y: Math.round((height - boxH) / 2),
    width: boxW,
    height: boxH,
  };
  applyMapCropBox();
  updateMapCropInfo();
}

function closeMapCropDialog() {
  const dialog = getMapCropDialog();
  if (!dialog) return;
  mapCropState = null;
  dialog.classList.remove('is-open');
  dialog.setAttribute('aria-hidden', 'true');
}

function applyMapCropBox() {
  const box = document.getElementById(MAP_CROP_BOX_ID);
  const state = mapCropState;
  if (!box || !state?.rect) return;
  box.style.left = `${state.rect.x}px`;
  box.style.top = `${state.rect.y}px`;
  box.style.width = `${state.rect.width}px`;
  box.style.height = `${state.rect.height}px`;
}

function updateMapCropInfo() {
  const info = document.getElementById(MAP_CROP_INFO_ID);
  const state = mapCropState;
  if (!info || !state?.rect || !state.image || !state.view?.width) return;
  const scaleX = state.image.naturalWidth / state.view.width;
  const scaleY = state.image.naturalHeight / state.view.height;
  const w = Math.round(state.rect.width * scaleX);
  const h = Math.round(state.rect.height * scaleY);
  info.textContent = `选中 ${w} × ${h} px · 拖动裁剪框 / 拖四角调整`;
}

function handleMapCropConfirm() {
  const state = mapCropState;
  if (!state?.rect || !state.image || !state.view?.width) return;
  const scaleX = state.image.naturalWidth / state.view.width;
  const scaleY = state.image.naturalHeight / state.view.height;
  const rect = {
    x: Math.round(state.rect.x * scaleX),
    y: Math.round(state.rect.y * scaleY),
    width: Math.round(state.rect.width * scaleX),
    height: Math.round(state.rect.height * scaleY),
  };
  try {
    const dataURL = mapCropImageToDataURL(state.image, rect, MAP_IMAGE_MAX_DIM);
    const editor = ensureMapEditorState();
    editor.card.background = dataURL;
    editor.dirty = true;
    closeMapCropDialog();
    renderMapStage();
    refreshMapToolbar();
    refreshMapDirty();
    if (dataURL.length > MAP_IMAGE_MAX_LEN) {
      valuesToastr('warning', '图片体积较大，角色卡文件会明显变大；建议换用尺寸更小的图片');
    }
  } catch (error) {
    valuesToastr('error', `裁剪失败：${String(error?.message || error)}`);
  }
}

// 裁剪框交互：框体拖动移位，四角手柄缩放（最小 60px，不越出图片视图层）。
function bindMapCropBoxEvents() {
  const box = document.getElementById(MAP_CROP_BOX_ID);
  if (!box) return;
  box.addEventListener('pointerdown', (event) => {
    const state = mapCropState;
    if (!state?.rect) return;
    const handle = event.target.closest('[data-handle]');
    state.drag = {
      mode: handle ? handle.dataset.handle : 'move',
      startX: event.clientX,
      startY: event.clientY,
      rect: { ...state.rect },
    };
    event.preventDefault();
    box.setPointerCapture?.(event.pointerId);
  });
  box.addEventListener('pointermove', (event) => {
    const state = mapCropState;
    const drag = state?.drag;
    if (!drag || !state.view) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const min = 60;
    const maxX = state.view.width;
    const maxY = state.view.height;
    let { x, y, width, height } = drag.rect;
    if (drag.mode === 'move') {
      x = mapClampRange(x + dx, 0, maxX - width);
      y = mapClampRange(y + dy, 0, maxY - height);
    } else {
      if (drag.mode.includes('w')) {
        const nx = mapClampRange(x + dx, 0, x + width - min);
        width += x - nx;
        x = nx;
      }
      if (drag.mode.includes('e')) width = mapClampRange(width + dx, min, maxX - x);
      if (drag.mode.includes('n')) {
        const ny = mapClampRange(y + dy, 0, y + height - min);
        height += y - ny;
        y = ny;
      }
      if (drag.mode.includes('s')) height = mapClampRange(height + dy, min, maxY - y);
    }
    state.rect = { x, y, width, height };
    applyMapCropBox();
    updateMapCropInfo();
  });
  const end = (event) => {
    const state = mapCropState;
    if (!state?.drag) return;
    state.drag = null;
    try {
      box.releasePointerCapture?.(event.pointerId);
    } catch {}
  };
  box.addEventListener('pointerup', end);
  box.addEventListener('pointercancel', end);
}

// ---------- 装配入口（ui-shell createPanel 调用） ----------
function initMapSection() {
  initMapCropDialog();
}
