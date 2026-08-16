// ===== 万华镜（Kaleidoscope）变量工作台 UI：节点树 + 变量注册表 + 自动维护状态 =====
// 结构与剧情脉络一致：节点（人名 / 分组）只做嵌套容器、不对应值；变量挂在节点下
// （或顶层），是唯一对应值的条目。变量必须先注册，新建时从注册表下拉选择。
let valuesActiveLayer = 'default';   // 'default'（角色卡） | 'game'（聊天）
let valuesExpanded = new Set();      // 已展开的节点路径（path.join('/')）
let valuesEditorPath = null;         // 正在编辑的条目路径（null = 新建）
let valuesEditorMode = null;         // 'node' | 'key'
let valuesKeyEditorName = null;      // 正在编辑的注册变量名（null = 新建）
let valuesActiveTree = null;         // 当前层的活引用（渲染时赋值，增删改用它）
let valuesEditorParentPath = [];     // 新建节点 / 变量时的父路径
let valuesAddMenuContext = null;    // 「＋」菜单上下文：{ root: true } | { path: [...] }
let valuesTriggerEditorId = null;        // 正在编辑的触发 id（null = 新建）
let valuesTriggerEditorConditions = [];  // 编辑器中的条件草稿
let valuesTriggerEditorEffects = [];     // 编辑器中的事件效果草稿

function valuesToastr(kind, message) {
  try {
    const fn = globalThis.toastr?.[kind];
    if (typeof fn === 'function') fn(message, `[${MODULE_DISPLAY_NAME}]`);
  } catch {}
}

function getValuesWorkbench() {
  return document.getElementById(VALUES_DIALOG_ID);
}

function isValuesWorkbenchOpen() {
  const dialog = getValuesWorkbench();
  return Boolean(dialog && dialog.classList.contains('is-open'));
}

// ---------- 打开 / 关闭工作台 ----------
function openValuesWorkbench() {
  const dialog = getValuesWorkbench();
  if (!dialog) return;
  closeValuesEditor();
  closeValuesKeyEditor();
  closeValuesTriggerEditor();
  closeValuesAddMenu();
  dialog.classList.add('is-open');
  dialog.setAttribute('aria-hidden', 'false');
  applyValuesNavState();
  // 变量树永远从「游戏数值」层开始：不记住上次停留的层，默认数值需手动切换后才显示。
  // （setValuesLayer 内部已同步层 UI 并重渲染树。）
  setValuesLayer('game');
  refreshHomeValuesStatus();
  logApp('debug', '变量工作台已打开');
}

function closeValuesWorkbench() {
  const dialog = getValuesWorkbench();
  if (!dialog) return;
  closeValuesEditor();
  closeValuesKeyEditor();
  closeValuesTriggerEditor();
  closeValuesAddMenu();
  dialog.classList.remove('is-open');
  dialog.setAttribute('aria-hidden', 'true');
  logApp('debug', '变量工作台已关闭');
}

// 绑定徽标：角色卡 / 聊天文件 / 未绑定。
function refreshValuesBindingStatus() {
  const badge = document.getElementById(VALUES_BINDING_ID);
  if (!badge) return;
  const ctx = getContextSafe();
  const character = ctx ? getStoryCharacter(ctx) : null;
  if (!character) {
    badge.textContent = '未绑定角色';
    badge.dataset.state = 'idle';
    badge.title = '群聊或未选角色：默认值保存在全局设置，不随角色卡导入导出';
    return;
  }
  const name = String(character.name || character.avatar || '当前角色');
  const card = ctx ? getValuesCardData(ctx) : null;
  if (card) {
    badge.textContent = `默认值已绑定 · ${name}`;
    badge.dataset.state = 'ok';
    badge.title = '默认值保存在角色卡中：导入/导出角色卡时自动携带；游戏值保存在聊天文件中';
  } else {
    badge.textContent = `待绑定 · ${name}`;
    badge.dataset.state = 'warn';
    badge.title = '当前角色卡还没有变量数据：首次保存后自动写入角色卡';
  }
}

// ---------- 左侧导航：收起 / 展开 ----------
function getValuesWorkbenchEl() {
  return document.querySelector('.kaleido-values__workbench');
}

// 从设置恢复导航折叠状态（对话框与面板视图共用）。
function applyValuesNavState() {
  const bench = getValuesWorkbenchEl();
  if (!bench) return;
  let collapsed = false;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    collapsed = Boolean(settings?.valuesNavCollapsed);
  } catch {}
  bench.classList.toggle('is-nav-collapsed', collapsed);
  const expand = document.getElementById(VALUES_NAV_EXPAND_ID);
  if (expand) expand.hidden = !collapsed;
}

function setValuesNavCollapsed(collapsed) {
  const bench = getValuesWorkbenchEl();
  if (!bench) return;
  bench.classList.toggle('is-nav-collapsed', collapsed);
  const expand = document.getElementById(VALUES_NAV_EXPAND_ID);
  if (expand) expand.hidden = !collapsed;
  try {
    const ctx = getContextSafe();
    if (ctx) {
      const settings = getSettings(ctx);
      settings.valuesNavCollapsed = Boolean(collapsed);
      saveSettings(ctx);
    }
  } catch {}
}

// ---------- 层切换 ----------
function setValuesLayer(layer) {
  if (layer !== 'default' && layer !== 'game') return;
  valuesActiveLayer = layer;
  const isGame = layer === 'game';
  // 状态锚点（隐藏按钮）：保留 is-active 语义
  document.getElementById(VALUES_LAYER_DEFAULT_ID)?.classList.toggle('is-active', !isGame);
  document.getElementById(VALUES_LAYER_GAME_ID)?.classList.toggle('is-active', isGame);
  // 可见的当前层指示条：只显示当前层，右侧按钮一键切换
  const row = document.getElementById(VALUES_LAYER_ROW_ID);
  if (row) row.dataset.layer = layer;
  const icon = document.getElementById(VALUES_LAYER_ICON_ID);
  if (icon) icon.innerHTML = `<span class="${isGame ? VALUES_LAYER_GAME_ICON_CLASS : VALUES_LAYER_DEFAULT_ICON_CLASS}"></span>`;
  const title = document.getElementById(VALUES_LAYER_TITLE_ID);
  if (title) title.textContent = isGame ? '游戏数值' : '默认数值';
  const toggle = document.getElementById(VALUES_LAYER_TOGGLE_ID);
  if (toggle) {
    const target = isGame ? '默认数值' : '游戏数值';
    toggle.innerHTML = `<span class="${VALUES_LAYER_SWAP_ICON_CLASS}"></span> 切换到${target}`;
    toggle.title = isGame ? '切换到默认数值（角色卡，仅手动修改）' : '切换到游戏数值（聊天，AI 自动维护）';
  }
  closeValuesEditor();
  closeValuesKeyEditor();
  closeValuesAddMenu();
  syncValuesLayerUI();
  renderValuesTree();
}

// 层相关 UI 联动：自动维护 / 重置按钮只属于游戏值层；新建按钮只属于默认值层
// （游戏值层是 AI 维护的数据，只允许修改，不允许新建 / 删除条目）；默认值层只提示手动修改。
function syncValuesLayerUI() {
  const isGame = valuesActiveLayer === 'game';
  const maintainNow = document.getElementById(VALUES_MAINTAIN_NOW_ID);
  const resetBtn = document.getElementById(VALUES_RESET_GAME_ID);
  const status = document.getElementById(VALUES_MAINTAIN_STATUS_ID);
  const hint = document.getElementById(VALUES_DEFAULT_HINT_ID);
  const injectBar = document.getElementById(VALUES_INJECT_BAR_ID);
  const addRoot = document.getElementById(VALUES_ADD_ROOT_ID);
  const saveNow = document.getElementById(VALUES_SAVE_NOW_ID);
  if (maintainNow) maintainNow.hidden = !isGame;
  if (resetBtn) resetBtn.hidden = !isGame;
  if (status) status.hidden = !isGame;
  if (hint) hint.hidden = isGame;
  if (addRoot) addRoot.hidden = isGame;
  // 保存按钮只属于「默认数值」层（游戏值随聊天文件即时落盘，无需手动保存）。
  if (saveNow) saveNow.hidden = isGame;
  // 注入提示词条只属于「默认数值」层（勾选配置随角色卡保存）。
  if (injectBar) injectBar.hidden = isGame;
}

// 注入提示词条：开关状态 + 勾选统计。
function refreshValuesInjectUI() {
  const toggle = document.getElementById(VALUES_INJECT_TOGGLE_ID);
  const status = document.getElementById(VALUES_INJECT_STATUS_ID);
  if (!toggle && !status) return;
  const ctx = getContextSafe();
  const config = ctx ? getValuesInjectConfig(ctx) : { enabled: false, paths: [] };
  if (toggle) {
    toggle.classList.toggle('is-off', !config.enabled);
    toggle.setAttribute('aria-checked', String(Boolean(config.enabled)));
  }
  if (status) {
    // 统计实际注入的变量数（容器节点本身不注入内容）。
    let count = 0;
    if (ctx && Array.isArray(config.paths)) {
      const tree = getValuesGameTree(ctx);
      for (const item of config.paths) {
        const path = String(item || '').split('/').filter(Boolean);
        const node = valuesGetAtPath(tree, path);
        if (node !== undefined && !valuesIsContainer(node)) count += 1;
      }
    }
    if (!config.enabled) {
      status.textContent = '未开启 · 勾选条目后随提示词注入';
      status.dataset.state = 'idle';
    } else if (count === 0) {
      status.textContent = '已开启 · 尚未勾选任何变量';
      status.dataset.state = 'warn';
    } else {
      status.textContent = `已开启 · 注入 ${count} 个变量 · 位置：World Info after 之后`;
      status.dataset.state = 'ok';
    }
  }
  renderValuesInjectPreview();
}

// 注入预览：显示实际注入提示词的 <Values> 块原文（与注入管线同源，只读）。
function renderValuesInjectPreview() {
  const pre = document.getElementById(VALUES_INJECT_TEXT_ID);
  if (!pre) return;
  const ctx = getContextSafe();
  const config = ctx ? getValuesInjectConfig(ctx) : null;
  if (!config?.enabled) {
    pre.textContent = '（变量注入未开启：在「变量系统 → 默认数值」层勾选变量并打开注入开关后，这里会显示实际注入提示词的 <Values> 内容。）';
    return;
  }
  const text = buildValuesInjectText(ctx);
  pre.textContent = text || '（已开启注入，但还没有勾选任何变量。）';
}

// 当前层的活引用：默认层 = 角色卡 defaults；游戏层 = 聊天状态 values（未初始化时
// 用默认值克隆，首次修改 / AI 维护后落盘到聊天文件）。
function getValuesActiveTree(ctx) {
  const context = ctx || getContextSafe();
  if (valuesActiveLayer === 'game') {
    const state = getValuesChatState(context);
    return state ? state.values : cloneValue(getValuesDefaults(context));
  }
  return getValuesDefaults(context);
}

function saveValuesActiveTree(ctx, tree) {
  const context = ctx || getContextSafe();
  if (valuesActiveLayer === 'game') {
    // 保存前派生：手动改了父变量后，子变量按最新父变量重算再落盘。
    deriveValuesChildren(tree, context ? getValuesKeys(context) : []);
    return saveValuesChatState(context, tree);
  }
  // 默认层：先确保角色卡容器存在；若当前 tree 不是活引用（首次编辑时来自
  // 一次性兜底对象，角色卡尚不存在），把内容并入角色卡 defaults 再保存。
  ensureValuesCardData(context);
  const live = getValuesDefaults(context);
  if (tree !== live) {
    for (const key of Object.keys(live)) delete live[key];
    Object.assign(live, cloneValue(tree));
  }
  deriveValuesChildren(live, context ? getValuesKeys(context) : []);
  saveValuesData(context);
  return true;
}
// ---------- 节点树渲染 ----------
function formatValuesLeafText(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (value === null || value === undefined) return 'null';
  return String(value);
}

function buildValuesEmpty(text) {
  const empty = document.createElement('div');
  empty.className = 'kaleido-values__empty';
  empty.textContent = text;
  return empty;
}// 节点行：chevron + 名称 + 子项数 + 「＋」菜单 / 编辑 / 删除。
// 变量行：图标 + 名称 + 值 + 编辑 / 删除。
function buildValuesRow(path, name, node, depth) {
  const row = document.createElement('div');
  row.dataset.path = JSON.stringify(path);
  row.style.setProperty('--depth', String(depth));
  const ctx = getContextSafe();
  const registered = ctx ? getValuesKeyByName(ctx, name) : null;
  const isChildLeaf = Boolean(registered && isValuesChildKey(registered));
  const registryTitle = registered
    ? (isChildLeaf
      ? `子变量 · ${formatValuesChildDeriveSummary(registered)}`
      : `已注册变量 · 变化规则：${registered.rule || '（未填写规则）'}`)
    : '';
  const isNode = valuesIsContainer(node);
  // 游戏值层是 AI 维护的数据：只允许修改，不渲染新建菜单与删除按钮。
  const isGameLayer = valuesActiveLayer === 'game';
  // 注入勾选框：只在「默认数值」层显示（配置随角色卡保存）。
  const injectConfig = valuesActiveLayer === 'default' ? getValuesInjectConfig(ctx) : null;
  const pathKey = path.join('/');
  const injectChecked = injectConfig ? injectConfig.paths.includes(pathKey) : false;
  // 半选只在「自身未打开但后代有打开」时显示（正常交互下打开后代会自动提升
  // 祖先，半选仅出现在导入等数据不一致场景，作为防御性提示）。
  const injectIndeterminate = injectConfig ? !injectChecked && injectConfig.paths.some((item) => item.startsWith(pathKey + '/')) : false;
  const injectCheckHTML = injectConfig
    ? `<button type="button" class="kaleido-values__inject-switch${injectChecked ? '' : ' is-off'}${injectIndeterminate ? ' is-partial' : ''}" data-inject-toggle="1" role="switch" aria-checked="${injectChecked}" title="勾选后随提示词注入${isNode ? '（含全部子条目）' : ''}"><span class="kaleido-values__inject-switch-thumb"></span></button>`
    : '';

  if (isNode) {
    const key = path.join('/');
    const expanded = valuesExpanded.has(key);
    const count = Object.keys(node).length;
    row.className = 'kaleido-values__row kaleido-values__row--entry' + (expanded ? ' is-expanded' : '');
    row.dataset.kind = 'container';
    row.innerHTML = `
      <button type="button" class="kaleido-values__drag-handle" data-action="drag" title="拖动排序" aria-label="拖动排序"><span class="${VALUES_DRAG_ICON_CLASS}"></span></button>
      ${injectCheckHTML}
      <button type="button" class="kaleido-values__chevron${count > 0 ? '' : ' is-empty'}" data-action="toggle" title="展开 / 收起" aria-label="展开 / 收起">
        <span class="${VALUES_CHEVRON_ICON_CLASS}"></span>
      </button>
      <span class="kaleido-values__row-name" title="节点：可继续嵌套节点或挂变量">${escapeHtml(name)}</span>
      <span class="kaleido-values__row-count">${count} 项</span>
      <span class="kaleido-values__row-actions">
        ${isGameLayer ? '' : `<button type="button" class="kaleido-values__icon-btn" data-action="add-menu" title="新建子节点 / 变量" aria-label="新建子节点 / 变量"><span class="${VALUES_ADD_CHILD_ICON_CLASS}"></span></button>`}
        <button type="button" class="kaleido-values__icon-btn" data-action="edit" title="编辑节点" aria-label="编辑节点"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>
        ${isGameLayer ? '' : `<button type="button" class="kaleido-values__icon-btn kaleido-values__icon-btn--danger" data-action="delete" title="删除节点" aria-label="删除节点"><span class="${VALUES_DELETE_ICON_CLASS}"></span></button>`}
      </span>
    `;
    const injectCheck = row.querySelector('button[data-inject-toggle]');
    if (injectCheck) injectCheck.classList.toggle('is-partial', injectIndeterminate);
    return row;
  }

  row.className = 'kaleido-values__row kaleido-values__row--leaf' + (isChildLeaf ? ' is-derived' : '');
  row.dataset.kind = 'leaf';
  const derivedBadge = isChildLeaf
    ? `<span class="kaleido-values__row-derived-badge" title="子变量：值由派生规则（区间 / 公式）自动计算，不可手动编辑">派生</span>`
    : '';
  const editButton = isChildLeaf
    ? `<button type="button" class="kaleido-values__icon-btn" disabled title="子变量由父变量自动计算，不可手动编辑" aria-label="子变量不可编辑"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>`
    : `<button type="button" class="kaleido-values__icon-btn" data-action="edit" title="编辑变量" aria-label="编辑变量"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>`;
  row.innerHTML = `
    <button type="button" class="kaleido-values__drag-handle" data-action="drag" title="拖动排序" aria-label="拖动排序"><span class="${VALUES_DRAG_ICON_CLASS}"></span></button>
    ${injectCheckHTML}
    <span class="kaleido-values__row-name${registered ? ' is-registered' : ''}" title="${registryTitle}">${escapeHtml(name)}</span>
    ${derivedBadge}
    <span class="kaleido-values__row-value" title="${escapeHtml(formatValuesLeafText(node))}">${escapeHtml(formatValuesLeafText(node))}</span>
    <span class="kaleido-values__row-actions">
      ${editButton}
      ${isGameLayer ? '' : `<button type="button" class="kaleido-values__icon-btn kaleido-values__icon-btn--danger" data-action="delete" title="删除变量" aria-label="删除变量"><span class="${VALUES_DELETE_ICON_CLASS}"></span></button>`}
    </span>
  `;
  const injectCheck = row.querySelector('button[data-inject-toggle]');
  if (injectCheck) injectCheck.classList.toggle('is-partial', injectIndeterminate);
  return row;
}

function renderValuesTreeRows(container, ctx, node, path, depth) {
  if (!valuesIsContainer(node)) return;
  const order = ctx ? getValuesTreeOrder(ctx) : {};
  const names = valuesOrderedNames(order, path.join('/'), node);
  for (const name of names) {
    const childPath = path.concat(name);
    const child = node[name];
    container.appendChild(buildValuesRow(childPath, name, child, depth));
    if (valuesIsContainer(child) && valuesExpanded.has(childPath.join('/'))) {
      renderValuesTreeRows(container, ctx, child, childPath, depth + 1);
    }
  }
}

function renderValuesTree() {
  const body = document.getElementById(VALUES_TREE_BODY_ID);
  if (!body) return;
  const ctx = getContextSafe();
  refreshValuesBindingStatus();
  refreshValuesMaintainStatus();
  syncValuesLayerUI();
  refreshValuesInjectUI();
  valuesActiveTree = ctx ? getValuesActiveTree(ctx) : {};
  body.innerHTML = '';
  const hasEntries = Object.keys(valuesActiveTree).length > 0;
  if (!hasEntries) {
    let emptyText;
    if (valuesActiveLayer === 'game' && !isValuesGameInitialized(ctx)) {
      emptyText = '游戏值尚未初始化，当前显示角色卡默认值。';
    } else if (valuesActiveLayer === 'game') {
      emptyText = '游戏值还没有条目。';
    } else {
      emptyText = '还没有节点。';
    }
    body.appendChild(buildValuesEmpty(emptyText));
    return;
  }
  renderValuesTreeRows(body, ctx, valuesActiveTree, [], 0);
}
// ---------- 「＋」新建菜单 ----------
function openValuesAddMenu(anchor, context) {
  const menu = document.getElementById(VALUES_ADD_MENU_ID);
  if (!menu) return;
  valuesAddMenuContext = context || { root: true };
  menu.hidden = false;
  const rect = anchor.getBoundingClientRect();
  let top = rect.bottom + 4;
  let left = rect.left;
  const menuRect = menu.getBoundingClientRect();
  if (top + menuRect.height > window.innerHeight - 8) {
    top = Math.max(8, rect.top - menuRect.height - 4);
  }
  if (left + menuRect.width > window.innerWidth - 8) {
    left = Math.max(8, window.innerWidth - menuRect.width - 8);
  }
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function closeValuesAddMenu() {
  const menu = document.getElementById(VALUES_ADD_MENU_ID);
  if (menu) menu.hidden = true;
  valuesAddMenuContext = null;
}

function handleValuesAddMenuPick(kind) {
  const context = valuesAddMenuContext || { root: true };
  closeValuesAddMenu();
  const parentPath = context.root ? [] : (context.path || []);
  if (kind === 'node') openValuesNodeEditor(parentPath, null);
  else if (kind === 'key') openValuesKeyEntryEditor(parentPath, null);
}// ---------- 节点 / 变量编辑器 ----------
// 上级节点下拉：列出全部节点路径（排除自身与后代），只认显式预设。
function populateValuesParentSelect(currentPath, selectedParentPath) {
  const select = document.getElementById(VALUES_EDITOR_PARENT_SELECT_ID);
  if (!select) return;
  const tree = valuesActiveTree || {};
  const order = getValuesTreeOrder(getContextSafe());
  select.innerHTML = '';
  const top = document.createElement('option');
  top.value = '';
  top.textContent = '（顶层 · 根节点）';
  select.appendChild(top);
  const walk = (node, path) => {
    if (!valuesIsContainer(node)) return;
    for (const key of valuesOrderedNames(order, path.join('/'), node)) {
      const childPath = path.concat(key);
      const child = node[key];
      if (!valuesIsContainer(child)) continue;
      if (currentPath && currentPath.join('/') === childPath.join('/')) continue;
      if (currentPath && isValuesPathAncestor(childPath, currentPath)) continue;
      const option = document.createElement('option');
      option.value = JSON.stringify(childPath);
      option.textContent = childPath.join(' / ');
      select.appendChild(option);
      walk(child, childPath);
    }
  };
  walk(tree, []);
  const preset = selectedParentPath && selectedParentPath.length > 0 ? JSON.stringify(selectedParentPath) : '';
  select.value = preset;
}

// 判断 ancestorPath 是否是 path 的祖先（用于防环）。
function isValuesPathAncestor(ancestorPath, path) {
  if (!ancestorPath || ancestorPath.length === 0) return false;
  if (!path || path.length <= ancestorPath.length) return false;
  return ancestorPath.every((segment, index) => path[index] === segment);
}

// 已注册变量下拉：变量必须先注册，新建时从这里选择。
function fillValuesKeySelect() {
  const select = document.getElementById(VALUES_EDITOR_KEY_SELECT_ID);
  if (!select) return;
  const ctx = getContextSafe();
  const keys = ctx ? getValuesKeys(ctx) : [];
  select.innerHTML = '';
  if (keys.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '（还没有已注册变量，请先到「变量注册」页注册）';
    select.appendChild(option);
    return;
  }
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '（选择已注册变量）';
  select.appendChild(placeholder);
  for (const key of keys) {
    const option = document.createElement('option');
    option.value = String(key.name || '');
    option.textContent = String(key.name || '');
    select.appendChild(option);
  }
}

function setValuesEditorMode(mode) {
  const nodeFields = document.getElementById(VALUES_EDITOR_NODE_FIELDS_ID);
  const keyFields = document.getElementById(VALUES_EDITOR_KEY_FIELDS_ID);
  if (!nodeFields || !keyFields) return;
  nodeFields.hidden = mode !== 'node';
  keyFields.hidden = mode !== 'key';
}

// 节点编辑器：只填名称与上级节点，节点不对应值。
function openValuesNodeEditor(parentPath, editPath) {
  const editor = document.getElementById(VALUES_EDITOR_ID);
  if (!editor) return;
  valuesEditorMode = 'node';
  valuesEditorPath = editPath ? editPath.slice() : null;
  valuesEditorParentPath = parentPath ? parentPath.slice() : [];
  const title = document.getElementById(VALUES_EDITOR_TITLE_ID);
  const nameInput = document.getElementById(VALUES_EDITOR_NAME_ID);
  if (valuesEditorPath) {
    title.textContent = '编辑节点';
    nameInput.value = valuesEditorPath[valuesEditorPath.length - 1];
    populateValuesParentSelect(valuesEditorPath, valuesEditorPath.slice(0, -1));
  } else {
    title.textContent = parentPath && parentPath.length > 0 ? '添加子节点' : '新建节点';
    nameInput.value = '';
    populateValuesParentSelect(null, parentPath || []);
  }
  setValuesEditorMode('node');
  editor.hidden = false;
  closeValuesKeyEditor();
  closeValuesAddMenu();
  nameInput.focus();
}

// 变量编辑器：从已注册变量下拉选择（编辑时变量名只读），填写变量值。
// 子变量：值由父变量自动派生，不提供值输入，只显示提示；保存时一律存 null。
function syncValuesKeyEntryChildHint() {
  const ctx = getContextSafe();
  const keySelect = document.getElementById(VALUES_EDITOR_KEY_SELECT_ID);
  const hint = document.getElementById(VALUES_EDITOR_CHILD_HINT_ID);
  const label = document.getElementById(VALUES_EDITOR_VALUE_LABEL_ID);
  const valueInput = document.getElementById(VALUES_EDITOR_VALUE_ID);
  const keyName = valuesEditorPath
    ? String(valuesEditorPath[valuesEditorPath.length - 1] || '').trim()
    : String(keySelect?.value || '').trim();
  const isChild = Boolean(keyName && ctx && isValuesChildKey(getValuesKeyByName(ctx, keyName)));
  if (hint) hint.hidden = !isChild;
  if (label) label.hidden = isChild;
  if (valueInput) valueInput.hidden = isChild;
}

function openValuesKeyEntryEditor(parentPath, editPath) {
  const editor = document.getElementById(VALUES_EDITOR_ID);
  if (!editor) return;
  valuesEditorMode = 'key';
  valuesEditorPath = editPath ? editPath.slice() : null;
  valuesEditorParentPath = parentPath ? parentPath.slice() : [];
  fillValuesKeySelect();
  const title = document.getElementById(VALUES_EDITOR_TITLE_ID);
  const keySelect = document.getElementById(VALUES_EDITOR_KEY_SELECT_ID);
  const keyNameSpan = document.getElementById(VALUES_EDITOR_KEY_NAME_ID);
  const valueInput = document.getElementById(VALUES_EDITOR_VALUE_ID);
  if (valuesEditorPath) {
    title.textContent = '编辑变量';
    keySelect.hidden = true;
    keyNameSpan.hidden = false;
    keyNameSpan.textContent = valuesEditorPath[valuesEditorPath.length - 1];
    const node = valuesGetAtPath(valuesActiveTree, valuesEditorPath);
    valueInput.value = valuesIsContainer(node) ? '' : formatValuesLeafText(node);
  } else {
    title.textContent = '新建变量';
    keySelect.hidden = false;
    keyNameSpan.hidden = true;
    keySelect.value = '';
    valueInput.value = '';
  }
  syncValuesKeyEntryChildHint();
  setValuesEditorMode('key');
  editor.hidden = false;
  closeValuesKeyEditor();
  closeValuesAddMenu();
  (valuesEditorPath ? valueInput : keySelect).focus();
}

function closeValuesEditor() {
  const editor = document.getElementById(VALUES_EDITOR_ID);
  if (editor) editor.hidden = true;
  valuesEditorPath = null;
  valuesEditorMode = null;
}

// 解析「变量值」输入：数字 / 布尔 / null / 字符串。
function parseValuesEditorText(text) {
  const trimmed = String(text ?? '').trim();
  if (trimmed === 'null' || trimmed === '~') return { value: null };
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    if (Number.isFinite(num)) return { value: num };
  }
  if (trimmed === 'true') return { value: true };
  if (trimmed === 'false') return { value: false };
  return { value: trimmed };
}function saveValuesEditor() {
  const ctx = getContextSafe();
  if (!ctx || !valuesActiveTree) return;
  const nodeFields = document.getElementById(VALUES_EDITOR_NODE_FIELDS_ID);
  const keyFields = document.getElementById(VALUES_EDITOR_KEY_FIELDS_ID);
  const nodeVisible = Boolean(nodeFields && !nodeFields.hidden);
  const keyVisible = Boolean(keyFields && !keyFields.hidden);
  const tree = valuesActiveTree;

  if (nodeVisible && !keyVisible) {
    // 节点：只存名称与位置，节点不对应值。
    const name = String(document.getElementById(VALUES_EDITOR_NAME_ID)?.value || '').trim();
    if (!name) {
      valuesToastr('warning', '请填写节点名称');
      return;
    }
    let parentPath = [];
    try {
      const raw = String(document.getElementById(VALUES_EDITOR_PARENT_SELECT_ID)?.value || '').trim();
      if (raw) parentPath = JSON.parse(raw);
    } catch {}
    if (valuesEditorPath) {
      const oldPath = valuesEditorPath.slice();
      const newPath = parentPath.concat(name);
      if (isValuesPathAncestor(oldPath, parentPath)) {
        valuesToastr('warning', '不能挂到自己的后代节点下');
        return;
      }
      if (newPath.join('/') !== oldPath.join('/') && valuesGetAtPath(tree, newPath) !== undefined) {
        valuesToastr('warning', `已存在同名节点「${name}」`);
        return;
      }
      const node = valuesGetAtPath(tree, oldPath);
      valuesDeleteAtPath(tree, oldPath);
      valuesSetAtPath(tree, newPath, valuesIsContainer(node) ? node : {});
    } else {
      if (valuesGetAtPath(tree, parentPath.concat(name)) !== undefined) {
        valuesToastr('warning', `已存在同名节点「${name}」`);
        return;
      }
      valuesSetAtPath(tree, parentPath.concat(name), {});
      // 新建节点默认展开，方便继续往里挂条目；挂在子层时父节点一并展开以便看到新节点。
      valuesExpanded.add(parentPath.concat(name).join('/'));
      if (parentPath.length > 0) valuesExpanded.add(parentPath.join('/'));
      // 新建节点默认开启注入（仅默认数值层；打开节点会自动提升全部祖先节点）。
      if (valuesActiveLayer === 'default') {
        setValuesInjectPath(ctx, parentPath.concat(name), true);
      }
    }
    logApp('info', valuesEditorPath ? '节点已更新' : '节点已添加', name, valuesActiveLayer);
    valuesToastr('success', valuesEditorPath
      ? '节点已保存'
      : (valuesActiveLayer === 'default' ? `节点「${name}」已添加（已默认开启注入）` : `节点「${name}」已添加`));
  } else if (keyVisible && !nodeVisible) {
    // 变量：变量名来自注册表（编辑时固定）；父变量值必填，子变量不填值（由父变量自动计算）。
    const keyName = valuesEditorPath
      ? String(valuesEditorPath[valuesEditorPath.length - 1])
      : String(document.getElementById(VALUES_EDITOR_KEY_SELECT_ID)?.value || '').trim();
    if (!keyName) {
      valuesToastr('warning', '请选择已注册变量');
      return;
    }
    const registeredKey = getValuesKeyByName(ctx, keyName);
    const isChild = Boolean(registeredKey && isValuesChildKey(registeredKey));
    const valueText = String(document.getElementById(VALUES_EDITOR_VALUE_ID)?.value || '').trim();
    if (!isChild && valueText === '') {
      valuesToastr('warning', '请填写变量值');
      return;
    }
    const parsed = isChild ? { value: null } : parseValuesEditorText(valueText);
    const parentPath = valuesEditorPath ? valuesEditorPath.slice(0, -1) : (valuesEditorParentPath || []);
    const newPath = parentPath.concat(keyName);
    if (!valuesEditorPath && valuesGetAtPath(tree, newPath) !== undefined) {
      valuesToastr('warning', `已存在同名变量「${keyName}」`);
      return;
    }
    valuesSetAtPath(tree, newPath, parsed.value);
    // 新建变量默认开启注入（仅默认数值层；打开变量会自动提升全部祖先节点）。
    if (!valuesEditorPath && valuesActiveLayer === 'default') {
      setValuesInjectPath(ctx, newPath, true);
    }
    logApp('info', valuesEditorPath ? '变量已更新' : '变量已添加', keyName, valuesActiveLayer);
    valuesToastr('success', valuesEditorPath
      ? '变量已保存'
      : (valuesActiveLayer === 'default' ? `变量「${keyName}」已添加（已默认开启注入）` : `变量「${keyName}」已添加`));
  } else {
    return;
  }
  saveValuesActiveTree(ctx, tree);
  closeValuesEditor();
  renderValuesTree();
  refreshHomeValuesStatus();
}

// 删除：节点带确认（连同子树）。
async function handleValuesDelete(path) {
  const ctx = getContextSafe();
  if (!ctx || !valuesActiveTree) return;
  const node = valuesGetAtPath(valuesActiveTree, path);
  if (node === undefined) return;
  const name = path[path.length - 1];
  const isNode = valuesIsContainer(node);
  const childCount = isNode ? Object.keys(node).length : 0;
  const confirmText = isNode
    ? (childCount > 0
      ? `确定删除节点「${name}」吗？其下 ${childCount} 个子条目会一并删除。`
      : `确定删除节点「${name}」吗？`)
    : `确定删除变量「${name}」吗？`;
  if (!(await kaleidoConfirm(confirmText))) return;
  valuesDeleteAtPath(valuesActiveTree, path);
  saveValuesActiveTree(ctx, valuesActiveTree);
  logApp('info', isNode ? '节点已删除' : '变量已删除', name, valuesActiveLayer);
  valuesToastr('success', `已删除「${name}」`);
  renderValuesTree();
  refreshHomeValuesStatus();
}
// ---------- 行拖动排序 ----------
// 按住拖动把手上下移动条目，松手后按新顺序回调 onReorder(row, fromIndex, toIndex)。
// 只允许在同级条目间排序：getSiblings 由调用方按行分组提供（树按父路径分组）。
let valuesDragState = null;

function initValuesDragReorder(container, handleSelector, getSiblings, onReorder) {
  if (!container) return;
  container.addEventListener('pointerdown', (event) => {
    if (valuesDragState) return;
    const target = event.target instanceof Element ? event.target : null;
    const handle = target ? target.closest(handleSelector) : null;
    if (!handle) return;
    const row = handle.closest('.kaleido-values__row');
    if (!row || !container.contains(row)) return;
    const siblings = getSiblings(row);
    const fromIndex = siblings.indexOf(row);
    if (fromIndex < 0) return;
    event.preventDefault();
    valuesDragState = { container, row, siblings, getSiblings, fromIndex, onReorder, startY: event.clientY, moved: false };
    row.classList.add('is-dragging');
    container.classList.add('is-reordering');
    document.addEventListener('pointermove', handleValuesDragMove);
    document.addEventListener('pointerup', handleValuesDragEnd);
    document.addEventListener('pointercancel', handleValuesDragEnd);
  });
}

function handleValuesDragMove(event) {
  const state = valuesDragState;
  if (!state) return;
  if (!state.moved && Math.abs(event.clientY - state.startY) < 4) return;
  state.moved = true;
  const { container, row, siblings } = state;
  let insertBefore = null;
  let found = false;
  for (const sibling of siblings) {
    if (sibling === row) continue;
    const rect = sibling.getBoundingClientRect();
    if (event.clientY < rect.top) {
      insertBefore = sibling;
      found = true;
      break;
    }
    if (event.clientY < rect.bottom) {
      insertBefore = event.clientY < rect.top + rect.height / 2 ? sibling : sibling.nextSibling;
      found = true;
      break;
    }
  }
  if (!found) insertBefore = null;
  if (insertBefore === row || insertBefore === row.nextSibling) return;
  container.insertBefore(row, insertBefore);
}

function handleValuesDragEnd() {
  const state = valuesDragState;
  if (!state) return;
  valuesDragState = null;
  document.removeEventListener('pointermove', handleValuesDragMove);
  document.removeEventListener('pointerup', handleValuesDragEnd);
  document.removeEventListener('pointercancel', handleValuesDragEnd);
  state.row.classList.remove('is-dragging');
  state.container.classList.remove('is-reordering');
  if (!state.moved) return;
  const finalIndex = state.getSiblings(state.row).indexOf(state.row);
  if (finalIndex >= 0 && finalIndex !== state.fromIndex) {
    state.onReorder(state.row, state.fromIndex, finalIndex);
  }
}

// 树行分组：同父路径的行视为同级（可互相排序）。
function valuesRowParentKey(row) {
  try {
    const path = JSON.parse(String(row?.dataset.path || '[]'));
    return path.slice(0, -1).join('/');
  } catch {
    return '';
  }
}

function valuesTreeSiblingsOf(row) {
  const body = document.getElementById(VALUES_TREE_BODY_ID);
  if (!body) return [];
  const parentKey = valuesRowParentKey(row);
  return Array.from(body.querySelectorAll('.kaleido-values__row')).filter((item) => valuesRowParentKey(item) === parentKey);
}

function valuesListSiblingsOf(container) {
  return () => Array.from(container.querySelectorAll('.kaleido-values__row'));
}

// 重排回调：读取当前 DOM 顺序写回数据层并重渲染。
function handleValuesKeysReorder() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const body = document.getElementById(VALUES_KEYS_BODY_ID);
  if (!body) return;
  const names = Array.from(body.querySelectorAll('.kaleido-values__row')).map((row) => String(row.dataset.name || ''));
  reorderValuesKeys(ctx, names);
  renderValuesKeys();
  logApp('info', '变量注册顺序已调整');
}

function handleValuesTriggersReorder() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const body = document.getElementById(VALUES_TRIGGERS_BODY_ID);
  if (!body) return;
  const ids = Array.from(body.querySelectorAll('.kaleido-values__row')).map((row) => String(row.dataset.id || ''));
  reorderValuesTriggers(ctx, ids);
  renderValuesTriggers();
  logApp('info', '剧情触发顺序已调整');
}

function handleValuesTreeReorder(row) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const body = document.getElementById(VALUES_TREE_BODY_ID);
  if (!body) return;
  const parentKey = valuesRowParentKey(row);
  const names = Array.from(body.querySelectorAll('.kaleido-values__row'))
    .filter((item) => valuesRowParentKey(item) === parentKey)
    .map((item) => {
      try {
        const path = JSON.parse(String(item.dataset.path || '[]'));
        return path[path.length - 1];
      } catch {
        return '';
      }
    });
  reorderValuesTreeAt(ctx, parentKey, names);
  renderValuesTree();
  logApp('info', '变量树顺序已调整', parentKey || '顶层');
}

// ---------- 变量注册表渲染 ----------
function renderValuesKeys() {
  const body = document.getElementById(VALUES_KEYS_BODY_ID);
  if (!body) return;
  const ctx = getContextSafe();
  const keys = ctx ? getValuesKeys(ctx) : [];
  body.innerHTML = '';
  if (keys.length === 0) {
    body.appendChild(buildValuesEmpty('还没有注册任何变量。点击上方「＋ 注册新变量」创建，\n注册时填写该变量的变化规则，AI 自动维护会严格按规则更新。'));
    return;
  }
  for (const key of keys) {
    const row = document.createElement('div');
    row.className = 'kaleido-values__row kaleido-values__row--key';
    row.dataset.name = String(key.name || '');
    const isBuiltin = isValuesBuiltinKey(key);
    const isChild = isValuesChildKey(key);
    const typeBadge = isChild
      ? `<span class="kaleido-values__row-type-badge is-child" title="子变量：值由父变量自动派生，不参与 AI 维护">子</span>`
      : `<span class="kaleido-values__row-type-badge" title="父变量：由 AI 按变化规则维护">父</span>`;
    // 内置行：带「内置」徽标、不可拖动、无删除按钮（编辑 = 按当前角色卡保存
    // 自定义规则并生成卡级覆盖，之后该行变为普通卡键行，删除即恢复内置默认）。
    const builtinBadge = isBuiltin
      ? `<span class="kaleido-values__row-type-badge is-builtin" title="内置变量：任何角色卡 / 聊天默认注册，可直接使用；编辑后按当前角色卡覆盖">内置</span>`
      : '';
  const ruleText = isChild
    ? formatValuesChildDeriveSummary(key)
    : String(key.rule || '（未填写变化规则）');
    const dragHandle = isBuiltin
      ? ''
      : `<button type="button" class="kaleido-values__drag-handle" data-action="drag" title="拖动排序" aria-label="拖动排序"><span class="${VALUES_DRAG_ICON_CLASS}"></span></button>`;
    const deleteButton = isBuiltin
      ? ''
      : `<button type="button" class="kaleido-values__icon-btn kaleido-values__icon-btn--danger" data-action="delete-key" title="删除变量" aria-label="删除变量"><span class="${VALUES_DELETE_ICON_CLASS}"></span></button>`;
    row.innerHTML = `
      ${dragHandle}
      <span class="kaleido-values__row-name is-registered" title="${isBuiltin ? '内置变量（默认注册，可直接使用）' : '已注册变量'}">${escapeHtml(String(key.name || ''))}</span>
      ${builtinBadge}${typeBadge}
      <span class="kaleido-values__row-rule" title="${escapeHtml(ruleText)}">${escapeHtml(ruleText)}</span>
      <span class="kaleido-values__row-actions">
        <button type="button" class="kaleido-values__icon-btn" data-action="edit-key" title="编辑变量" aria-label="编辑变量"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>
        ${deleteButton}
      </span>
    `;
    body.appendChild(row);
  }
}

// 子变量派生方式摘要：公式模式显示公式，区间模式显示派生源 + 区间。
function formatValuesChildDeriveSummary(key) {
  const formula = String(key?.formula || '').trim();
  if (formula !== '') return `由公式派生：${formula}`;
  return `由「${String(key?.parent || '')}」派生：${formatValuesChildRulesSummary(key)}`;
}

// 子变量区间规则摘要（列表行 / 树行 title 用）。
function formatValuesChildRulesSummary(key) {
  const rules = Array.isArray(key?.rules) ? key.rules : [];
  return rules.map((rule) => {
    const min = rule?.min !== undefined ? String(rule.min) : '';
    const max = rule?.max !== undefined ? String(rule.max) : '';
    return `${min}~${max} ${String(rule?.value || '')}`;
  }).join('；');
}

// 派生源下拉：列出所有已注册变量（父 / 子均可，支持链式派生），排除自身。
function populateValuesKeyParentSelect(selectedParent) {
  const select = document.getElementById(VALUES_KEY_EDITOR_PARENT_ID);
  if (!select) return;
  const ctx = getContextSafe();
  const keys = ctx ? getValuesKeys(ctx) : [];
  select.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '（选择派生源变量）';
  select.appendChild(placeholder);
  for (const key of keys) {
    if (valuesKeyEditorName && String(key.name || '') === valuesKeyEditorName) continue;
    const option = document.createElement('option');
    option.value = String(key.name || '');
    option.textContent = String(key.name || '');
    select.appendChild(option);
  }
  select.value = String(selectedParent || '');
}

// 子变量区间规则行：下限 ~ 上限 + 文本 + 删除。
function buildValuesKeyRuleRow(rule) {
  const row = document.createElement('div');
  row.className = VALUES_KEY_EDITOR_RULE_ROW_CLASS;
  row.innerHTML = `
    <input type="text" inputmode="decimal" class="kaleido-input ${VALUES_KEY_EDITOR_RULE_MIN_CLASS}" placeholder="下限" title="父变量值下限（可留空 = 不设下限）" autocomplete="off" spellcheck="false" />
    <span class="kaleido-values__key-rule-tilde">~</span>
    <input type="text" inputmode="decimal" class="kaleido-input ${VALUES_KEY_EDITOR_RULE_MAX_CLASS}" placeholder="上限" title="父变量值上限（可留空 = 不设上限）" autocomplete="off" spellcheck="false" />
    <input type="text" class="kaleido-input ${VALUES_KEY_EDITOR_RULE_VALUE_CLASS}" placeholder="子变量文本" title="该区间对应的子变量文本" autocomplete="off" spellcheck="false" />
    <button type="button" class="kaleido-icon-btn ${VALUES_KEY_EDITOR_RULE_REMOVE_CLASS}" title="删除区间" aria-label="删除区间">✕</button>
  `;
  const minInput = row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MIN_CLASS);
  const maxInput = row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MAX_CLASS);
  const valueInput = row.querySelector('.' + VALUES_KEY_EDITOR_RULE_VALUE_CLASS);
  if (rule?.min !== undefined) minInput.value = String(rule.min);
  if (rule?.max !== undefined) maxInput.value = String(rule.max);
  if (rule?.value !== undefined) valueInput.value = String(rule.value);
  return row;
}

// 渲染子变量区间规则编辑器。
function renderValuesKeyRules(rules) {
  const container = document.getElementById(VALUES_KEY_EDITOR_RULES_ID);
  if (!container) return;
  container.innerHTML = '';
  const list = Array.isArray(rules) ? rules : [];
  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'kaleido-values__key-rules-empty';
    empty.textContent = '还没有区间规则。';
    container.appendChild(empty);
  }
  for (const rule of list) {
    container.appendChild(buildValuesKeyRuleRow(rule));
  }
}

// 读取单行区间规则（文本为空返回 null，非法数字忽略）。
function readValuesKeyRuleFromRow(row) {
  if (!row) return null;
  const minText = String(row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MIN_CLASS)?.value || '').trim();
  const maxText = String(row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MAX_CLASS)?.value || '').trim();
  const value = String(row.querySelector('.' + VALUES_KEY_EDITOR_RULE_VALUE_CLASS)?.value || '').trim();
  if (value === '') return null;
  const rule = { value };
  if (minText !== '') {
    const min = Number(minText);
    if (Number.isFinite(min)) rule.min = min;
  }
  if (maxText !== '') {
    const max = Number(maxText);
    if (Number.isFinite(max)) rule.max = max;
  }
  return rule;
}

// 读取规则编辑器当前内容（空文本行丢弃，非法数字忽略）。
function readValuesKeyRules() {
  const container = document.getElementById(VALUES_KEY_EDITOR_RULES_ID);
  if (!container) return [];
  const rules = [];
  for (const row of container.querySelectorAll('.' + VALUES_KEY_EDITOR_RULE_ROW_CLASS)) {
    const rule = readValuesKeyRuleFromRow(row);
    if (rule) rules.push(rule);
  }
  return rules;
}

// 实时标红重叠 / 非法的区间行（只统计已填文本的行）。
function refreshValuesKeyRuleConflicts() {
  const container = document.getElementById(VALUES_KEY_EDITOR_RULES_ID);
  if (!container) return;
  const rows = Array.from(container.querySelectorAll('.' + VALUES_KEY_EDITOR_RULE_ROW_CLASS));
  const participating = [];
  rows.forEach((row, index) => {
    if (readValuesKeyRuleFromRow(row)) participating.push(index);
  });
  const validation = validateValuesChildRules(participating.map((index) => readValuesKeyRuleFromRow(rows[index])));
  const conflictSet = new Set();
  for (const [i, j] of validation.overlaps) {
    conflictSet.add(participating[i]);
    conflictSet.add(participating[j]);
  }
  for (const index of validation.invalid) conflictSet.add(participating[index]);
  rows.forEach((row, index) => row.classList.toggle('is-conflict', conflictSet.has(index)));
}

// 新行下限自动接续：上一行上限 + 1（如 0~1000 之后自动填 1001）。
function nextValuesChildRuleMinFromRow(row) {
  if (!row) return '';
  const maxText = String(row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MAX_CLASS)?.value || '').trim();
  if (maxText === '') return '';
  const max = Number(maxText);
  if (!Number.isFinite(max)) return '';
  return String(max + 1);
}

// 派生方式联动：区间显示派生源 + 区间编辑器，公式显示公式输入。
function syncValuesKeyDeriveUI() {
  const deriveSelect = document.getElementById(VALUES_KEY_EDITOR_DERIVE_ID);
  const formulaFields = document.getElementById(VALUES_KEY_EDITOR_FORMULA_FIELDS_ID);
  const rulesFields = document.getElementById(VALUES_KEY_EDITOR_RULES_FIELDS_ID);
  const isFormula = String(deriveSelect?.value || '') === VALUES_KEY_DERIVE_FORMULA;
  if (formulaFields) formulaFields.hidden = !isFormula;
  if (rulesFields) rulesFields.hidden = isFormula;
}

// 类型切换联动：父变量显示变化规则，子变量显示派生方式 + 派生源 / 公式。
function syncValuesKeyEditorTypeUI() {
  const typeSelect = document.getElementById(VALUES_KEY_EDITOR_TYPE_ID);
  const ruleFields = document.getElementById(VALUES_KEY_EDITOR_RULE_FIELDS_ID);
  const childFields = document.getElementById(VALUES_KEY_EDITOR_CHILD_FIELDS_ID);
  const isChild = String(typeSelect?.value || '') === VALUES_KEY_TYPE_CHILD;
  if (ruleFields) ruleFields.hidden = isChild;
  if (childFields) childFields.hidden = !isChild;
  syncValuesKeyDeriveUI();
}

function openValuesKeyEditor(name) {
  const editor = document.getElementById(VALUES_KEY_EDITOR_ID);
  if (!editor) return;
  valuesKeyEditorName = name || null;
  const title = document.getElementById(VALUES_KEY_EDITOR_TITLE_ID);
  const nameInput = document.getElementById(VALUES_KEY_EDITOR_NAME_ID);
  const ruleInput = document.getElementById(VALUES_KEY_EDITOR_RULE_ID);
  const typeSelect = document.getElementById(VALUES_KEY_EDITOR_TYPE_ID);
  const deriveSelect = document.getElementById(VALUES_KEY_EDITOR_DERIVE_ID);
  const formulaInput = document.getElementById(VALUES_KEY_EDITOR_FORMULA_ID);
  const ctx = getContextSafe();
  if (valuesKeyEditorName) {
    const key = getValuesKeyByName(ctx, valuesKeyEditorName);
    title.textContent = '编辑变量';
    nameInput.value = valuesKeyEditorName;
    nameInput.disabled = true;
    nameInput.title = '变量名是注册身份，不可修改；可删除后重新注册';
    const isChild = key ? isValuesChildKey(key) : false;
    typeSelect.value = isChild ? VALUES_KEY_TYPE_CHILD : VALUES_KEY_TYPE_PARENT;
    ruleInput.value = isChild ? '' : (key ? String(key.rule || '') : '');
    const formula = isChild ? String(key?.formula || '').trim() : '';
    if (deriveSelect) deriveSelect.value = formula !== '' ? VALUES_KEY_DERIVE_FORMULA : VALUES_KEY_DERIVE_RULES;
    if (formulaInput) formulaInput.value = formula;
    populateValuesKeyParentSelect(isChild ? String(key?.parent || '') : '');
    renderValuesKeyRules(isChild ? key?.rules : []);
  } else {
    title.textContent = '注册新变量';
    nameInput.value = '';
    nameInput.disabled = false;
    nameInput.title = '';
    typeSelect.value = VALUES_KEY_TYPE_PARENT;
    ruleInput.value = '';
    if (deriveSelect) deriveSelect.value = VALUES_KEY_DERIVE_RULES;
    if (formulaInput) formulaInput.value = '';
    populateValuesKeyParentSelect('');
    renderValuesKeyRules([]);
  }
  syncValuesKeyEditorTypeUI();
  editor.hidden = false;
  closeValuesEditor();
  nameInput.focus();
}

function closeValuesKeyEditor() {
  const editor = document.getElementById(VALUES_KEY_EDITOR_ID);
  if (editor) editor.hidden = true;
  valuesKeyEditorName = null;
}

function saveValuesKeyEditor() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const name = String(document.getElementById(VALUES_KEY_EDITOR_NAME_ID)?.value || '').trim();
  if (!name) {
    valuesToastr('warning', '请填写变量名');
    return;
  }
  const type = String(document.getElementById(VALUES_KEY_EDITOR_TYPE_ID)?.value || '').trim() === VALUES_KEY_TYPE_CHILD
    ? VALUES_KEY_TYPE_CHILD
    : VALUES_KEY_TYPE_PARENT;
  if (type === VALUES_KEY_TYPE_CHILD) {
    const deriveSelect = document.getElementById(VALUES_KEY_EDITOR_DERIVE_ID);
    const isFormula = String(deriveSelect?.value || '') === VALUES_KEY_DERIVE_FORMULA;
    if (isFormula) {
      const formula = String(document.getElementById(VALUES_KEY_EDITOR_FORMULA_ID)?.value || '').trim();
      const syntax = validateValuesFormulaSyntax(formula);
      if (!syntax.ok) {
        valuesToastr('warning', `派生公式不合法：${syntax.error}`);
        return;
      }
      const cycle = findValuesChildCycle(getValuesKeys(ctx), name, syntax.refs);
      if (cycle) {
        valuesToastr('warning', `派生存在循环引用：${cycle.join(' → ')}`);
        return;
      }
      upsertValuesKey(ctx, name, '', { type, formula });
    } else {
      const parent = String(document.getElementById(VALUES_KEY_EDITOR_PARENT_ID)?.value || '').trim();
      if (!parent) {
        valuesToastr('warning', '请选择派生源变量');
        return;
      }
      const rules = readValuesKeyRules();
      if (rules.length === 0) {
        valuesToastr('warning', '请至少添加一个派生区间');
        return;
      }
      const validation = validateValuesChildRules(rules);
      if (validation.invalid.length > 0) {
        valuesToastr('warning', `第 ${validation.invalid.map((index) => index + 1).join('、')} 行区间下限大于上限，请检查`);
        return;
      }
      if (validation.overlaps.length > 0) {
        const pairs = validation.overlaps.map(([i, j]) => `第 ${i + 1} 行与第 ${j + 1} 行`);
        valuesToastr('warning', `派生区间不能重叠（含边界）：${pairs.join('、')}，如 0~1000 之后只能从 1001 开始`);
        return;
      }
      const cycle = findValuesChildCycle(getValuesKeys(ctx), name, [parent]);
      if (cycle) {
        valuesToastr('warning', `派生存在循环引用：${cycle.join(' → ')}`);
        return;
      }
      upsertValuesKey(ctx, name, '', { type, parent, rules });
    }
  } else {
    const rule = String(document.getElementById(VALUES_KEY_EDITOR_RULE_ID)?.value || '').trim();
    upsertValuesKey(ctx, name, rule, { type });
  }
  // 保存内置变量（友谊 / 友谊等级）时提示覆盖语义：编辑内置 = 生成卡级
  // 自定义规则，删除该卡键后恢复内置默认。
  const isBuiltinName = VALUES_BUILTIN_KEYS.some((key) => String(key?.name || '') === String(name || ''));
  logApp('info', valuesKeyEditorName ? '变量已更新' : '变量已注册', name);
  valuesToastr('success', valuesKeyEditorName
    ? (isBuiltinName ? `「${name}」自定义规则已保存（删除后恢复内置默认）` : '变量已保存')
    : (isBuiltinName ? `「${name}」已注册（覆盖内置默认规则）` : `变量「${name}」已注册`));
  closeValuesKeyEditor();
  renderValuesKeys();
  renderValuesTree();
  refreshHomeValuesStatus();
}

async function handleValuesDeleteKey(name) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const dependents = getValuesChildKeysByRef(ctx, name);
  if (dependents.length > 0) {
    valuesToastr('warning', `请先删除或改绑依赖它的子变量：${dependents.map((key) => key.name).join('、')}`);
    return;
  }
  // 删除内置变量名的卡键 = 删除自定义规则并恢复内置默认（内置本身不可删除）。
  const isBuiltinName = VALUES_BUILTIN_KEYS.some((key) => String(key?.name || '') === String(name || ''));
  const message = isBuiltinName
    ? `确定删除「${name}」的自定义规则吗？删除后将恢复内置默认规则。`
    : `确定删除已注册变量「${name}」吗？已存在的变量不会自动删除。`;
  if (!(await kaleidoConfirm(message))) return;
  deleteValuesKey(ctx, name);
  logApp('info', '变量已删除', name);
  valuesToastr('success', isBuiltinName ? `已删除「${name}」自定义规则，恢复内置默认` : `已删除变量「${name}」`);
  renderValuesKeys();
  renderValuesTree();
  refreshHomeValuesStatus();
}
// ---------- 剧情触发：列表 / 编辑器 ----------
// 剧情触发状态：只同步总开关滑块（开 / 关由滑块本身呈现，不再显示文字状态条）。
function refreshValuesTriggerStatus() {
  const toggle = document.getElementById(VALUES_TRIGGERS_TOGGLE_ID);
  if (!toggle) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  const enabled = settings ? settings.valuesTriggerEnabled !== false : true;
  toggle.classList.toggle('is-off', !enabled);
  toggle.setAttribute('aria-checked', String(Boolean(enabled)));
  toggle.title = enabled ? '点击关闭：发送前不再按变量条件触发剧情事件' : '点击开启：发送前按变量条件确定性触发剧情事件';
}

function toggleValuesTriggerSystem() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const settings = getSettings(ctx);
  settings.valuesTriggerEnabled = !(settings.valuesTriggerEnabled !== false);
  saveSettings(ctx);
  refreshValuesTriggerStatus();
  logApp('info', settings.valuesTriggerEnabled ? '剧情触发已开启' : '剧情触发已关闭');
  globalThis.toastr?.info?.('剧情触发已' + (settings.valuesTriggerEnabled ? '开启' : '关闭'), '[' + MODULE_DISPLAY_NAME + ']');
}

// 触发列表：名称 + 条件摘要 + 启用开关 + 编辑 / 删除。
function buildValuesTriggerRow(trigger) {
  const row = document.createElement('div');
  row.className = 'kaleido-values__row kaleido-values__row--trigger';
  row.dataset.id = String(trigger.id || '');
  const enabled = trigger.enabled !== false;
  const conditionsText = formatValuesTriggerConditions(trigger);
  const effectsText = formatValuesTriggerEffects(trigger);
  const onceBadge = trigger.once === false
    ? '<span class="kaleido-values__row-trigger-type" title="常驻事件：条件满足时可重复触发">常驻</span>'
    : '<span class="kaleido-values__row-trigger-type is-once" title="一次性事件：触发一次后自动关闭">一次性</span>';
  row.innerHTML = `
    <button type="button" class="kaleido-values__drag-handle" data-action="drag" title="拖动排序" aria-label="拖动排序"><span class="${VALUES_DRAG_ICON_CLASS}"></span></button>
    <span class="kaleido-values__row-name" title="${escapeHtml(trigger.name)}">${escapeHtml(trigger.name)}</span>
    ${onceBadge}
    <span class="kaleido-values__row-trigger" title="${escapeHtml(conditionsText)}">${escapeHtml(conditionsText)}</span>
    ${effectsText ? `<span class="kaleido-values__row-trigger is-effect" title="${escapeHtml(effectsText)}">${escapeHtml(effectsText)}</span>` : ''}
    <button type="button" class="kaleido-values__inject-switch${enabled ? '' : ' is-off'}" data-action="toggle-trigger" data-id="${escapeHtml(String(trigger.id || ''))}" role="switch" aria-checked="${enabled}" title="${enabled ? '点击关闭：该触发不再参与判定' : '点击激活：该触发重新参与判定'}" aria-label="启用 / 关闭触发"><span class="kaleido-values__inject-switch-thumb"></span></button>
    <span class="kaleido-values__row-actions">
      <button type="button" class="kaleido-values__icon-btn" data-action="edit-trigger" data-id="${escapeHtml(String(trigger.id || ''))}" title="编辑触发" aria-label="编辑触发"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-values__icon-btn kaleido-values__icon-btn--danger" data-action="delete-trigger" data-id="${escapeHtml(String(trigger.id || ''))}" title="删除触发" aria-label="删除触发"><span class="${VALUES_DELETE_ICON_CLASS}"></span></button>
    </span>
  `;
  if (!enabled) row.classList.add('is-disabled');
  return row;
}

function renderValuesTriggers() {
  const body = document.getElementById(VALUES_TRIGGERS_BODY_ID);
  if (!body) return;
  const ctx = getContextSafe();
  const triggers = ctx ? getValuesTriggers(ctx) : [];
  refreshValuesTriggerStatus();
  body.innerHTML = '';
  if (triggers.length === 0) {
    body.appendChild(buildValuesEmpty('还没有剧情触发。点击上方「＋ 新建触发」创建：\n设置变量条件（如 张三/好感 >= 70），条件满足时自动注入对应剧情事件。'));
    return;
  }
  for (const trigger of triggers) {
    body.appendChild(buildValuesTriggerRow(trigger));
  }
}

// 条件路径下拉：列出变量树全部叶子路径（结构以默认值为准，游戏值同构）。
function populateValuesTriggerPathSelect(select, selectedPath) {
  if (!select) return;
  const ctx = getContextSafe();
  const tree = ctx ? getValuesDefaults(ctx) : {};
  const order = ctx ? getValuesTreeOrder(ctx) : {};
  select.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '（选择变量路径）';
  select.appendChild(placeholder);
  const walk = (node, path) => {
    if (!valuesIsContainer(node)) return;
    for (const key of valuesOrderedNames(order, path.join('/'), node)) {
      const childPath = path.concat(key);
      const child = node[key];
      if (valuesIsContainer(child)) {
        walk(child, childPath);
      } else {
        const option = document.createElement('option');
        option.value = childPath.join('/');
        option.textContent = childPath.join(' / ');
        select.appendChild(option);
      }
    }
  };
  walk(tree, []);
  const escapeCss = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
    ? (value) => CSS.escape(value)
    : (value) => String(value).replace(/["\\]/g, '\\$&');
  const target = String(selectedPath || '');
  select.value = select.querySelector(`option[value="${escapeCss(target)}"]`) ? target : '';
}

// 效果路径下拉：列出变量树全部叶子路径，但过滤注册为子变量的叶子
// （子变量由父变量派生，效果只能改父变量；未注册的叶子视为父变量）。
function populateValuesTriggerEffectPathSelect(select, selectedPath) {
  if (!select) return;
  const ctx = getContextSafe();
  const tree = ctx ? getValuesDefaults(ctx) : {};
  const order = ctx ? getValuesTreeOrder(ctx) : {};
  select.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '（选择父变量路径）';
  select.appendChild(placeholder);
  const walk = (node, path) => {
    if (!valuesIsContainer(node)) return;
    for (const key of valuesOrderedNames(order, path.join('/'), node)) {
      const childPath = path.concat(key);
      const child = node[key];
      if (valuesIsContainer(child)) {
        walk(child, childPath);
      } else {
        const registered = ctx ? getValuesKeyByName(ctx, key) : null;
        if (registered && isValuesChildKey(registered)) continue;
        const option = document.createElement('option');
        option.value = childPath.join('/');
        option.textContent = childPath.join(' / ');
        select.appendChild(option);
      }
    }
  };
  walk(tree, []);
  const escapeCss = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
    ? (value) => CSS.escape(value)
    : (value) => String(value).replace(/["\\]/g, '\\$&');
  const target = String(selectedPath || '');
  select.value = select.querySelector(`option[value="${escapeCss(target)}"]`) ? target : '';
}

// 条件行：路径 + 运算符 + 值（exists / not exists 隐藏值输入）+ 删除。
function buildValuesTriggerConditionRow(condition) {
  const row = document.createElement('div');
  row.className = VALUES_TRIGGER_CONDITION_ROW_CLASS;
  const pathSelect = document.createElement('select');
  pathSelect.className = 'kaleido-input ' + VALUES_TRIGGER_CONDITION_PATH_CLASS;
  populateValuesTriggerPathSelect(pathSelect, condition?.path || '');
  const opCenter = document.createElement('div');
  opCenter.className = VALUES_TRIGGER_CONDITION_OP_CENTER_CLASS;
  const opWrap = document.createElement('div');
  opWrap.className = VALUES_TRIGGER_CONDITION_OP_WRAP_CLASS;
  const opText = document.createElement('span');
  opText.className = VALUES_TRIGGER_CONDITION_OP_TEXT_CLASS;
  const opSelect = document.createElement('select');
  opSelect.className = 'kaleido-input ' + VALUES_TRIGGER_CONDITION_OP_CLASS;
  for (const op of VALUES_TRIGGER_OPS) {
    const option = document.createElement('option');
    option.value = op.value;
    option.textContent = op.label;
    opSelect.appendChild(option);
  }
  opSelect.value = VALUES_TRIGGER_OPS.some((op) => op.value === String(condition?.op || '').trim())
    ? String(condition?.op || '').trim()
    : '==';
  const syncOpText = () => {
    const matched = VALUES_TRIGGER_OPS.find((op) => op.value === String(opSelect.value || '').trim());
    opText.textContent = matched ? (matched.display || matched.value) : String(opSelect.value || '');
    opWrap.title = matched ? matched.label : '';
  };
  const valueInput = document.createElement('input');
  valueInput.className = 'kaleido-input ' + VALUES_TRIGGER_CONDITION_VALUE_CLASS;
  valueInput.type = 'text';
  valueInput.placeholder = '如：70 / true / 友好';
  valueInput.autocomplete = 'off';
  valueInput.spellcheck = false;
  const value = condition?.value;
  valueInput.value = value === null || value === undefined ? '' : String(value);
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'kaleido-values__icon-btn kaleido-values__icon-btn--danger ' + VALUES_TRIGGER_CONDITION_REMOVE_CLASS;
  removeBtn.title = '删除条件';
  removeBtn.setAttribute('aria-label', '删除条件');
  removeBtn.innerHTML = `<span class="${VALUES_DELETE_ICON_CLASS}"></span>`;
  opWrap.append(opText, opSelect);
  opCenter.append(opWrap);
  row.append(pathSelect, opCenter, valueInput, removeBtn);
  const syncValueVisibility = () => {
    const op = String(opSelect.value || '').trim();
    valueInput.hidden = op === 'exists' || op === 'not exists';
  };
  opSelect.addEventListener('change', () => {
    syncOpText();
    syncValueVisibility();
  });
  syncOpText();
  syncValueVisibility();
  return row;
}

// 编辑器条件区：按草稿渲染全部条件行。
function renderValuesTriggerConditionRows() {
  const container = document.getElementById(VALUES_TRIGGER_EDITOR_CONDITIONS_ID);
  if (!container) return;
  container.innerHTML = '';
  for (const condition of valuesTriggerEditorConditions) {
    container.appendChild(buildValuesTriggerConditionRow(condition));
  }
}

function addValuesTriggerConditionRow() {
  valuesTriggerEditorConditions.push({ path: '', op: '==', value: null });
  renderValuesTriggerConditionRows();
}

// 读取编辑器条件区当前草稿（含用户未保存的修改）。
function readValuesTriggerConditionRows() {
  const container = document.getElementById(VALUES_TRIGGER_EDITOR_CONDITIONS_ID);
  if (!container) return valuesTriggerEditorConditions.slice();
  const conditions = [];
  container.querySelectorAll('.' + VALUES_TRIGGER_CONDITION_ROW_CLASS).forEach((row) => {
    const path = String(row.querySelector('.' + VALUES_TRIGGER_CONDITION_PATH_CLASS)?.value || '').trim();
    const op = String(row.querySelector('.' + VALUES_TRIGGER_CONDITION_OP_CLASS)?.value || '==').trim();
    const valueInput = row.querySelector('.' + VALUES_TRIGGER_CONDITION_VALUE_CLASS);
    const valueText = String(valueInput?.value || '').trim();
    const parsed = parseValuesEditorText(valueText);
    conditions.push({ path, op, value: parsed.value });
  });
  return conditions;
}

// 效果行：路径（只列父变量）+ 类型（加减 / 覆盖）+ 值 + 删除。
function buildValuesTriggerEffectRow(effect) {
  const row = document.createElement('div');
  row.className = VALUES_TRIGGER_EFFECT_ROW_CLASS;
  const pathSelect = document.createElement('select');
  pathSelect.className = 'kaleido-input ' + VALUES_TRIGGER_EFFECT_PATH_CLASS;
  populateValuesTriggerEffectPathSelect(pathSelect, effect?.path || '');
  const opCenter = document.createElement('div');
  opCenter.className = VALUES_TRIGGER_EFFECT_OP_CENTER_CLASS;
  const opWrap = document.createElement('div');
  opWrap.className = VALUES_TRIGGER_EFFECT_OP_WRAP_CLASS;
  const opText = document.createElement('span');
  opText.className = VALUES_TRIGGER_EFFECT_OP_TEXT_CLASS;
  const opSelect = document.createElement('select');
  opSelect.className = 'kaleido-input ' + VALUES_TRIGGER_EFFECT_OP_CLASS;
  for (const op of VALUES_TRIGGER_EFFECT_OPS) {
    const option = document.createElement('option');
    option.value = op.value;
    option.textContent = op.label;
    opSelect.appendChild(option);
  }
  opSelect.value = String(effect?.op || '').trim() === 'set' ? 'set' : 'add';
  const syncOpText = () => {
    const matched = VALUES_TRIGGER_EFFECT_OPS.find((op) => op.value === String(opSelect.value || '').trim());
    opText.textContent = matched ? (matched.display || matched.value) : String(opSelect.value || '');
    opWrap.title = matched ? matched.label : '';
    valueInput.placeholder = String(opSelect.value || '') === 'add' ? '如：+30 / -5（加减值）' : '如：100 / 已治好 / null';
  };
  const valueInput = document.createElement('input');
  valueInput.className = 'kaleido-input ' + VALUES_TRIGGER_EFFECT_VALUE_CLASS;
  valueInput.type = 'text';
  valueInput.autocomplete = 'off';
  valueInput.spellcheck = false;
  const value = effect?.value;
  valueInput.value = value === null || value === undefined ? '' : String(value);
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'kaleido-values__icon-btn kaleido-values__icon-btn--danger ' + VALUES_TRIGGER_EFFECT_REMOVE_CLASS;
  removeBtn.title = '删除效果';
  removeBtn.setAttribute('aria-label', '删除效果');
  removeBtn.innerHTML = `<span class="${VALUES_DELETE_ICON_CLASS}"></span>`;
  opWrap.append(opText, opSelect);
  opCenter.append(opWrap);
  row.append(pathSelect, opCenter, valueInput, removeBtn);
  opSelect.addEventListener('change', syncOpText);
  syncOpText();
  return row;
}

// 编辑器效果区：按草稿渲染全部效果行。
function renderValuesTriggerEffectRows() {
  const container = document.getElementById(VALUES_TRIGGER_EDITOR_EFFECTS_ID);
  if (!container) return;
  container.innerHTML = '';
  for (const effect of valuesTriggerEditorEffects) {
    container.appendChild(buildValuesTriggerEffectRow(effect));
  }
}

function addValuesTriggerEffectRow() {
  valuesTriggerEditorEffects.push({ path: '', op: 'add', value: null });
  renderValuesTriggerEffectRows();
}

// 读取编辑器效果区当前草稿（含用户未保存的修改）。
function readValuesTriggerEffectRows() {
  const container = document.getElementById(VALUES_TRIGGER_EDITOR_EFFECTS_ID);
  if (!container) return valuesTriggerEditorEffects.slice();
  const effects = [];
  container.querySelectorAll('.' + VALUES_TRIGGER_EFFECT_ROW_CLASS).forEach((row) => {
    const path = String(row.querySelector('.' + VALUES_TRIGGER_EFFECT_PATH_CLASS)?.value || '').trim();
    const op = String(row.querySelector('.' + VALUES_TRIGGER_EFFECT_OP_CLASS)?.value || 'add').trim();
    const valueText = String(row.querySelector('.' + VALUES_TRIGGER_EFFECT_VALUE_CLASS)?.value || '').trim();
    effects.push({ path, op: op === 'set' ? 'set' : 'add', value: parseValuesEditorText(valueText).value });
  });
  return effects;
}

function openValuesTriggerEditor(item) {
  const editor = document.getElementById(VALUES_TRIGGER_EDITOR_ID);
  if (!editor) return;
  valuesTriggerEditorId = item && item.id ? item.id : null;
  valuesTriggerEditorConditions = Array.isArray(item?.conditions)
    ? item.conditions.map((condition) => ({ ...condition }))
    : [];
  valuesTriggerEditorEffects = Array.isArray(item?.effects)
    ? item.effects.map((effect) => ({ ...effect }))
    : [];
  const title = document.getElementById(VALUES_TRIGGER_EDITOR_TITLE_ID);
  const nameInput = document.getElementById(VALUES_TRIGGER_EDITOR_NAME_ID);
  const logicSelect = document.getElementById(VALUES_TRIGGER_EDITOR_LOGIC_ID);
  const onceSelect = document.getElementById(VALUES_TRIGGER_EDITOR_ONCE_ID);
  const descInput = document.getElementById(VALUES_TRIGGER_EDITOR_DESC_ID);
  const contentInput = document.getElementById(VALUES_TRIGGER_EDITOR_CONTENT_ID);
  if (title) title.textContent = valuesTriggerEditorId ? '编辑触发' : '新建触发';
  if (nameInput) nameInput.value = item?.name || '';
  if (logicSelect) {
    logicSelect.innerHTML = '';
    for (const option of VALUES_TRIGGER_LOGIC_OPTIONS) {
      const el = document.createElement('option');
      el.value = option.value;
      el.textContent = option.label;
      logicSelect.appendChild(el);
    }
    logicSelect.value = String(item?.logic || 'all') === 'any' ? 'any' : 'all';
  }
  if (onceSelect) {
    onceSelect.innerHTML = '';
    for (const option of VALUES_TRIGGER_ONCE_OPTIONS) {
      const el = document.createElement('option');
      el.value = option.value;
      el.textContent = option.label;
      onceSelect.appendChild(el);
    }
    onceSelect.value = item?.once === false ? 'persistent' : 'once';
  }
  if (descInput) descInput.value = item?.description || '';
  if (contentInput) contentInput.value = item?.content || '';
  renderValuesTriggerConditionRows();
  renderValuesTriggerEffectRows();
  editor.hidden = false;
  closeValuesEditor();
  closeValuesKeyEditor();
  closeValuesAddMenu();
  nameInput?.focus();
}

function closeValuesTriggerEditor() {
  const editor = document.getElementById(VALUES_TRIGGER_EDITOR_ID);
  if (editor) editor.hidden = true;
  valuesTriggerEditorId = null;
  valuesTriggerEditorConditions = [];
  valuesTriggerEditorEffects = [];
}

function saveValuesTriggerEditor() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const name = String(document.getElementById(VALUES_TRIGGER_EDITOR_NAME_ID)?.value || '').trim();
  if (!name) {
    valuesToastr('warning', '请填写事件名称');
    return;
  }
  const content = String(document.getElementById(VALUES_TRIGGER_EDITOR_CONTENT_ID)?.value || '');
  if (!content.trim()) {
    valuesToastr('warning', '事件内容不能为空');
    return;
  }
  const logic = String(document.getElementById(VALUES_TRIGGER_EDITOR_LOGIC_ID)?.value || 'all').trim();
  const once = String(document.getElementById(VALUES_TRIGGER_EDITOR_ONCE_ID)?.value || 'once').trim() !== 'persistent';
  const conditions = readValuesTriggerConditionRows().filter((condition) => condition.path !== '');
  if (conditions.length === 0) {
    valuesToastr('warning', '请至少添加一个变量条件');
    return;
  }
  const effects = readValuesTriggerEffectRows().filter((effect) => effect.path !== '');
  for (const effect of effects) {
    if (effect.value === '') {
      valuesToastr('warning', '请填写效果值（要设为无值请填 null）');
      return;
    }
    if (effect.op === 'add') {
      const delta = typeof effect.value === 'number'
        ? effect.value
        : (typeof effect.value === 'string' && String(effect.value).trim() !== '' ? Number(effect.value) : NaN);
      if (!Number.isFinite(delta)) {
        valuesToastr('warning', '加减值的效果值必须是数字');
        return;
      }
    }
  }
  const data = {
    name,
    logic: logic === 'any' ? 'any' : 'all',
    once,
    description: String(document.getElementById(VALUES_TRIGGER_EDITOR_DESC_ID)?.value || '').trim(),
    conditions,
    effects,
    content,
  };
  if (valuesTriggerEditorId) updateValuesTrigger(ctx, valuesTriggerEditorId, data);
  else createValuesTrigger(ctx, data);
  logApp('info', valuesTriggerEditorId ? '剧情触发已更新' : '剧情触发已添加', name);
  valuesToastr('success', valuesTriggerEditorId ? '触发已保存' : `触发「${name}」已创建`);
  closeValuesTriggerEditor();
  renderValuesTriggers();
  refreshHomeValuesStatus();
}

async function handleValuesDeleteTrigger(id) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const trigger = getValuesTriggerById(ctx, id);
  if (!trigger) return;
  if (!(await kaleidoConfirm(`确定删除剧情触发「${trigger.name}」吗？`))) return;
  deleteValuesTrigger(ctx, id);
  logApp('info', '剧情触发已删除', trigger.name);
  valuesToastr('success', '触发已删除');
  renderValuesTriggers();
  refreshHomeValuesStatus();
}

function handleValuesToggleTrigger(id) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const trigger = toggleValuesTriggerEnabled(ctx, id);
  if (!trigger) return;
  logApp('info', trigger.enabled ? '剧情触发已激活' : '剧情触发已关闭', trigger.name);
  renderValuesTriggers();
}


// ---------- 自动维护状态 ----------
function refreshValuesMaintainStatus() {
  const status = document.getElementById(VALUES_MAINTAIN_STATUS_ID);
  if (!status) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  const enabled = settings ? settings.valuesAutoUpdateEnabled !== false : true;
  const round = globalThis[VALUES_LAST_ROUND_KEY] || null;
  let text = enabled ? '自动维护：开' : '自动维护：关';
  if (!settings || !getApiBase(settings) || !String(settings?.model || '').trim()) {
    text += ' · API 未配置';
    status.dataset.state = 'warn';
  } else if (!round) {
    text += ' · 尚未运行';
    status.dataset.state = 'idle';
  } else if (round.error) {
    text += ` · 最近一轮失败：${round.error}`;
    status.dataset.state = 'error';
  } else if (round.skipped) {
    text += ' · 最近一轮：跳过';
    status.dataset.state = 'idle';
  } else if (round.changed && round.changed.length > 0) {
    text += ` · 最近一轮更新 ${round.changed.length} 项`;
    status.dataset.state = 'ok';
  } else {
    text += ' · 最近一轮无变化';
    status.dataset.state = 'ok';
  }
  status.textContent = text;
  status.title = round ? `最近一轮：${new Date(round.at).toLocaleString()}` : '';
}

// 游戏值重置：把当前聊天的游戏值整体重置为角色卡默认值（写入聊天文件）。
async function handleValuesResetGame() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const defaults = getValuesDefaults(ctx);
  const count = valuesCountEntries(defaults);
  const confirmText = count > 0
    ? `确定把游戏值重置为默认值吗？当前 ${count} 项游戏值会被默认值覆盖。`
    : '确定把游戏值重置为默认值吗？当前游戏值会被清空（默认值当前为空）。';
  if (!(await kaleidoConfirm(confirmText))) return;
  const saved = saveValuesChatState(ctx, cloneValue(defaults), { immediate: true });
  logApp('info', '游戏值已重置为默认值', `覆盖 ${count} 项`);
  valuesToastr('success', saved ? '游戏值已重置为默认值' : '游戏值已重置（写入聊天文件失败）');
  renderValuesTree();
  refreshHomeValuesStatus();
}

// 默认数值保存：把当前默认值立即保存到绑定位置（角色卡 / 全局设置），
// 并在支持从磁盘重读的宿主（TauriTavern getOneCharacter）上校验写入是否生效——
// 该宿主写角色卡失败时只 console.error 不抛错，校验能把静默失败变成可见反馈。
async function handleValuesSaveNow() {
  const ctx = getContextSafe();
  if (!ctx) {
    valuesToastr('warning', '无法读取宿主上下文');
    return;
  }
  const character = getStoryCharacter(ctx);
  const boundToCard = Boolean(character && typeof ctx?.writeExtensionField === 'function');
  const target = boundToCard ? '角色卡' : '全局设置';
  const bundle = getValuesBundle(ctx);
  // 先等落盘完成再校验：校验走磁盘重读，与写入并行会读到旧数据误报失败。
  await saveValuesData(ctx);
  const verified = await verifyValuesCardWrite(ctx, String(character?.avatar || ''), bundle);
  if (verified === true) {
    logApp('info', '默认数值已保存', target);
    valuesToastr('success', `默认数值已保存到${target}，并已从磁盘校验通过`);
  } else if (verified === false) {
    logApp('warn', '默认数值保存未生效', target);
    valuesToastr('error', `保存未生效：${target}上的数据与修改不一致（写入被宿主拦截或返回旧数据）。请重启酒馆后重试，并检查系统日志`);
  } else {
    logApp('info', '默认数值已保存', target);
    valuesToastr('success', `默认数值已保存到${target}`);
  }
}
// ---------- 导入 / 导出 ----------
function handleValuesExportBundle() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const filename = getValuesBundleFilename(ctx);
  if (downloadTextFile(filename, serializeValuesBundle(ctx))) {
    valuesToastr('success', `已导出变量包：${filename}`);
  }
}

async function handleValuesImportFile(file) {
  if (!file) return;
  const ctx = getContextSafe();
  if (!ctx) return;
  try {
    const text = await readTextFile(file);
    const parsed = parseValuesBundle(text);
    if (!(await kaleidoConfirm(
      '导入将更新变量注册表与默认值：\n- 同名变量更新变化规则，其余追加；\n- 默认值按路径合并，同名路径覆盖。\n继续？'
    ))) return;
    applyValuesBundle(ctx, parsed, 'merge');
    logApp('info', '变量包已导入', `变量 ${parsed.keys.length} 个`);
    valuesToastr('success', `已导入 ${parsed.keys.length} 个变量`);
    renderValuesTree();
    renderValuesKeys();
    refreshHomeValuesStatus();
  } catch (error) {
    const message = String(error?.message || error);
    logApp('warn', '变量包导入失败', message);
    valuesToastr('error', `导入失败：${message.slice(0, 160)}`);
  }
}// ---------- 内容事件绑定（对话框与面板视图共用） ----------
// 面板切换：is-active 控制显示，hidden 同步（[hidden] 覆盖规则会强制隐藏）
function setValuesPaneActive(paneId, active) {
  const pane = document.getElementById(paneId);
  if (!pane) return;
  pane.classList.toggle('is-active', active);
  pane.hidden = !active;
}

// 统一 tab 切换：5 个 tab 的 is-active 与 5 个 pane 的显隐一次到位，
// 并收尾打开中的编辑器 / 新建菜单。
function setValuesTabActive(tabId) {
  const tabs = [VALUES_TAB_TREE_ID, VALUES_TAB_KEYS_ID, VALUES_TAB_TRIGGERS_ID, VALUES_TAB_INJECT_ID, VALUES_TAB_MAP_ID];
  for (const id of tabs) {
    const tab = document.getElementById(id);
    if (tab) tab.classList.toggle('is-active', id === tabId);
  }
  setValuesPaneActive(VALUES_TREE_PANE_ID, tabId === VALUES_TAB_TREE_ID);
  setValuesPaneActive(VALUES_KEYS_PANE_ID, tabId === VALUES_TAB_KEYS_ID);
  setValuesPaneActive(VALUES_TRIGGERS_PANE_ID, tabId === VALUES_TAB_TRIGGERS_ID);
  setValuesPaneActive(VALUES_INJECT_PANE_ID, tabId === VALUES_TAB_INJECT_ID);
  setValuesPaneActive(VALUES_MAP_PANE_ID, tabId === VALUES_TAB_MAP_ID);
  closeValuesEditor();
  closeValuesKeyEditor();
  closeValuesTriggerEditor();
  closeValuesAddMenu();
}

// 打开「游戏地图」编辑器：桌面开工作台 / 手机切面板视图，并激活地图 tab。
// （游戏模式空态「去编辑地图」按钮也走这里。）
function openValuesMapTab() {
  if (isNarrowViewport()) {
    showPanelView(VALUES_VIEW_ID);
  } else {
    openValuesWorkbench();
  }
  setValuesTabActive(VALUES_TAB_MAP_ID);
  renderMapEditor();
}

function bindValuesContentEvents() {
  document.getElementById(VALUES_TAB_TREE_ID)?.addEventListener('click', () => {
    setValuesTabActive(VALUES_TAB_TREE_ID);
    renderValuesTree();
  });
  document.getElementById(VALUES_TAB_KEYS_ID)?.addEventListener('click', () => {
    setValuesTabActive(VALUES_TAB_KEYS_ID);
    renderValuesKeys();
  });
  document.getElementById(VALUES_TAB_TRIGGERS_ID)?.addEventListener('click', () => {
    setValuesTabActive(VALUES_TAB_TRIGGERS_ID);
    renderValuesTriggers();
  });
  document.getElementById(VALUES_TAB_INJECT_ID)?.addEventListener('click', () => {
    setValuesTabActive(VALUES_TAB_INJECT_ID);
    renderValuesInjectPreview();
  });
  document.getElementById(VALUES_TAB_MAP_ID)?.addEventListener('click', () => {
    setValuesTabActive(VALUES_TAB_MAP_ID);
    renderMapEditor();
  });
  document.getElementById(VALUES_LAYER_DEFAULT_ID)?.addEventListener('click', () => setValuesLayer('default'));
  document.getElementById(VALUES_LAYER_GAME_ID)?.addEventListener('click', () => setValuesLayer('game'));
  document.getElementById(VALUES_LAYER_TOGGLE_ID)?.addEventListener('click', () => {
    setValuesLayer(valuesActiveLayer === 'game' ? 'default' : 'game');
  });

  document.getElementById(VALUES_NAV_COLLAPSE_ID)?.addEventListener('click', () => setValuesNavCollapsed(true));
  document.getElementById(VALUES_NAV_EXPAND_ID)?.addEventListener('click', () => setValuesNavCollapsed(false));
  applyValuesNavState();

  document.getElementById(VALUES_ADD_ROOT_ID)?.addEventListener('click', (event) => {
    openValuesAddMenu(event.currentTarget, { root: true });
  });
  document.getElementById(VALUES_ADD_MENU_NODE_ID)?.addEventListener('click', () => handleValuesAddMenuPick('node'));
  document.getElementById(VALUES_ADD_MENU_KEY_ID)?.addEventListener('click', () => handleValuesAddMenuPick('key'));
  document.getElementById(VALUES_ADD_KEY_ID)?.addEventListener('click', () => openValuesKeyEditor(null));

  document.getElementById(VALUES_MAINTAIN_NOW_ID)?.addEventListener('click', () => {
    runValuesMaintainNow().then(() => {
      renderValuesTree();
      refreshHomeValuesStatus();
    });
  });

  document.getElementById(VALUES_RESET_GAME_ID)?.addEventListener('click', handleValuesResetGame);
  document.getElementById(VALUES_SAVE_NOW_ID)?.addEventListener('click', handleValuesSaveNow);

  document.getElementById(VALUES_INJECT_TOGGLE_ID)?.addEventListener('click', (event) => {
    const ctx = getContextSafe();
    if (!ctx) return;
    const enabled = event.currentTarget.classList.contains('is-off');
    setValuesInjectEnabled(ctx, enabled);
    logApp('info', enabled ? '变量注入已开启' : '变量注入已关闭');
    refreshValuesInjectUI();
    renderValuesTree();
  });

  document.getElementById(VALUES_TRIGGERS_TOGGLE_ID)?.addEventListener('click', toggleValuesTriggerSystem);
  document.getElementById(VALUES_TRIGGERS_ADD_ID)?.addEventListener('click', () => openValuesTriggerEditor(null));
  document.getElementById(VALUES_TRIGGER_EDITOR_CANCEL_ID)?.addEventListener('click', closeValuesTriggerEditor);
  document.getElementById(VALUES_TRIGGER_EDITOR_SAVE_ID)?.addEventListener('click', saveValuesTriggerEditor);
  document.getElementById(VALUES_TRIGGER_EDITOR_CONDITION_ADD_ID)?.addEventListener('click', addValuesTriggerConditionRow);
  document.getElementById(VALUES_TRIGGER_EDITOR_CONDITIONS_ID)?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('.' + VALUES_TRIGGER_CONDITION_REMOVE_CLASS) : null;
    if (!button) return;
    const row = button.closest('.' + VALUES_TRIGGER_CONDITION_ROW_CLASS);
    if (!row) return;
    row.remove();
  });
  document.getElementById(VALUES_TRIGGER_EDITOR_EFFECT_ADD_ID)?.addEventListener('click', addValuesTriggerEffectRow);
  document.getElementById(VALUES_TRIGGER_EDITOR_EFFECTS_ID)?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('.' + VALUES_TRIGGER_EFFECT_REMOVE_CLASS) : null;
    if (!button) return;
    const row = button.closest('.' + VALUES_TRIGGER_EFFECT_ROW_CLASS);
    if (!row) return;
    row.remove();
  });

  document.getElementById(VALUES_IMPORT_BTN_ID)?.addEventListener('click', () => {
    document.getElementById(VALUES_IMPORT_INPUT_ID)?.click();
  });
  document.getElementById(VALUES_IMPORT_INPUT_ID)?.addEventListener('change', (event) => {
    const file = event.target?.files?.[0];
    if (file) handleValuesImportFile(file);
    event.target.value = '';
  });
  document.getElementById(VALUES_EXPORT_BTN_ID)?.addEventListener('click', handleValuesExportBundle);

  const treeBody = document.getElementById(VALUES_TREE_BODY_ID);
  treeBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-action]') : null;
    if (!button) return;
    event.preventDefault();
    const action = String(button.dataset.action || '');
    const row = button.closest('.kaleido-values__row');
    const path = JSON.parse(String(row?.dataset.path || '[]'));
    const ctx = getContextSafe();
    if (!ctx || !valuesActiveTree) return;
    switch (action) {
      case 'toggle': {
        const key = path.join('/');
        if (valuesExpanded.has(key)) valuesExpanded.delete(key);
        else valuesExpanded.add(key);
        renderValuesTree();
        break;
      }
      case 'add-menu': {
        openValuesAddMenu(button, { path });
        break;
      }
      case 'edit': {
        const node = valuesGetAtPath(valuesActiveTree, path);
        if (valuesIsContainer(node)) openValuesNodeEditor(path.slice(0, -1), path);
        else openValuesKeyEntryEditor(path.slice(0, -1), path);
        break;
      }
      case 'delete': {
        handleValuesDelete(path);
        break;
      }
      default:
        break;
    }
  });

  // 双击行直接进入编辑（与行内编辑按钮一致：节点编辑节点、变量编辑变量）。
  // 按钮 / 输入框等交互元素上的双击不触发，避免与滑块、折叠等操作冲突。
  treeBody?.addEventListener('dblclick', (event) => {
    const interactive = event.target instanceof Element
      ? event.target.closest('button, input, select, textarea, label')
      : null;
    if (interactive) return;
    const row = event.target instanceof Element ? event.target.closest('.kaleido-values__row') : null;
    if (!row) return;
    const path = JSON.parse(String(row?.dataset.path || '[]'));
    const ctx = getContextSafe();
    if (!ctx || !valuesActiveTree || path.length === 0) return;
    const node = valuesGetAtPath(valuesActiveTree, path);
    if (valuesIsContainer(node)) {
      openValuesNodeEditor(path.slice(0, -1), path);
    } else {
      // 子变量由父变量派生，双击不进入编辑。
      const registered = getValuesKeyByName(ctx, path[path.length - 1]);
      if (registered && isValuesChildKey(registered)) return;
      openValuesKeyEntryEditor(path.slice(0, -1), path);
    }
  });

  // 行内注入滑块：勾选 / 取消勾选节点或变量（默认数值层）。半选点击 = 全选。
  treeBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-inject-toggle]') : null;
    if (!button) return;
    const row = button.closest('.kaleido-values__row');
    const path = JSON.parse(String(row?.dataset.path || '[]'));
    const ctx = getContextSafe();
    if (!ctx || !valuesActiveTree) return;
    const checked = button.classList.contains('is-off') || button.classList.contains('is-partial');
    setValuesInjectPath(ctx, path, checked);
    logApp('info', checked ? '已勾选注入条目' : '已取消勾选注入条目', path.join('/'));
    renderValuesTree();
  });

  const keysBody = document.getElementById(VALUES_KEYS_BODY_ID);
  keysBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-action]') : null;
    if (!button) return;
    event.preventDefault();
    const row = button.closest('.kaleido-values__row');
    const name = String(row?.dataset.name || '');
    const action = String(button.dataset.action || '');
    switch (action) {
      case 'edit-key': {
        openValuesKeyEditor(name);
        break;
      }
      case 'delete-key': {
        handleValuesDeleteKey(name);
        break;
      }
      default:
        break;
    }
  });

  const triggersBody = document.getElementById(VALUES_TRIGGERS_BODY_ID);
  triggersBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-action]') : null;
    if (!button) return;
    event.preventDefault();
    const id = String(button.dataset.id || '');
    const action = String(button.dataset.action || '');
    switch (action) {
      case 'edit-trigger': {
        const trigger = getValuesTriggerById(getContextSafe(), id);
        if (trigger) openValuesTriggerEditor(trigger);
        break;
      }
      case 'delete-trigger': {
        handleValuesDeleteTrigger(id);
        break;
      }
      case 'toggle-trigger': {
        handleValuesToggleTrigger(id);
        break;
      }
      default:
        break;
    }
  });

  document.getElementById(VALUES_EDITOR_CANCEL_ID)?.addEventListener('click', closeValuesEditor);
  document.getElementById(VALUES_EDITOR_SAVE_ID)?.addEventListener('click', saveValuesEditor);
  document.getElementById(VALUES_KEY_EDITOR_CANCEL_ID)?.addEventListener('click', closeValuesKeyEditor);
  document.getElementById(VALUES_KEY_EDITOR_SAVE_ID)?.addEventListener('click', saveValuesKeyEditor);
  document.getElementById(VALUES_KEY_EDITOR_TYPE_ID)?.addEventListener('change', syncValuesKeyEditorTypeUI);
  document.getElementById(VALUES_KEY_EDITOR_DERIVE_ID)?.addEventListener('change', syncValuesKeyDeriveUI);
  document.getElementById(VALUES_KEY_EDITOR_RULES_ADD_ID)?.addEventListener('click', () => {
    const container = document.getElementById(VALUES_KEY_EDITOR_RULES_ID);
    if (!container) return;
    const empty = container.querySelector('.kaleido-values__key-rules-empty');
    if (empty) empty.remove();
    const rows = container.querySelectorAll('.' + VALUES_KEY_EDITOR_RULE_ROW_CLASS);
    const lastRow = rows[rows.length - 1];
    const nextMin = nextValuesChildRuleMinFromRow(lastRow);
    container.appendChild(buildValuesKeyRuleRow(nextMin !== '' ? { min: Number(nextMin) } : {}));
    refreshValuesKeyRuleConflicts();
  });
  document.getElementById(VALUES_KEY_EDITOR_RULES_ID)?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('.' + VALUES_KEY_EDITOR_RULE_REMOVE_CLASS) : null;
    if (!button) return;
    button.closest('.' + VALUES_KEY_EDITOR_RULE_ROW_CLASS)?.remove();
    refreshValuesKeyRuleConflicts();
  });
  document.getElementById(VALUES_KEY_EDITOR_RULES_ID)?.addEventListener('input', () => {
    refreshValuesKeyRuleConflicts();
  });
  document.getElementById(VALUES_EDITOR_KEY_SELECT_ID)?.addEventListener('change', syncValuesKeyEntryChildHint);

  document.getElementById(VALUES_EDITOR_VALUE_ID)?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) saveValuesEditor();
  });
  document.getElementById(VALUES_KEY_EDITOR_RULE_ID)?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) saveValuesKeyEditor();
  });
  document.getElementById(VALUES_TRIGGER_EDITOR_CONTENT_ID)?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) saveValuesTriggerEditor();
  });

  // 行拖动排序：变量树 / 变量注册 / 剧情触发 三处列表。
  initValuesDragReorder(
    document.getElementById(VALUES_TREE_BODY_ID),
    '.kaleido-values__drag-handle',
    valuesTreeSiblingsOf,
    handleValuesTreeReorder
  );
  initValuesDragReorder(
    document.getElementById(VALUES_KEYS_BODY_ID),
    '.kaleido-values__drag-handle',
    valuesListSiblingsOf(document.getElementById(VALUES_KEYS_BODY_ID)),
    handleValuesKeysReorder
  );
  initValuesDragReorder(
    document.getElementById(VALUES_TRIGGERS_BODY_ID),
    '.kaleido-values__drag-handle',
    valuesListSiblingsOf(document.getElementById(VALUES_TRIGGERS_BODY_ID)),
    handleValuesTriggersReorder
  );

  if (!globalThis[VALUES_DIALOG_KEY + '_menu']) {
    globalThis[VALUES_DIALOG_KEY + '_menu'] = (event) => {
      const menu = document.getElementById(VALUES_ADD_MENU_ID);
      if (!menu || menu.hidden) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (menu.contains(target)) return;
      // 点「＋」按钮本身不算外部：按钮的 click 会负责打开/重定位菜单
      if (target.closest(`#${VALUES_ADD_ROOT_ID}, [data-action="add-menu"]`)) return;
      closeValuesAddMenu();
    };
    document.addEventListener('click', globalThis[VALUES_DIALOG_KEY + '_menu']);
  }
}// 工作台内容模板（树区 + 变量注册区 + 编辑器 + 新建菜单 + 文件输入）：
// 电脑端大窗口对话框与手机端面板视图共用。
function buildValuesContentHTML(editorClass) {
  return `
        <div class="kaleido-values__workbench">
          <button type="button" id="${VALUES_NAV_EXPAND_ID}" class="kaleido-values__nav-expand" title="展开导航" aria-label="展开导航" hidden>
            <span class="${VALUES_CHEVRON_ICON_CLASS}"></span>
          </button>
          <nav class="kaleido-values__nav" aria-label="变量系统导航">
            <div class="kaleido-values__nav-head">
              <span>视图</span>
              <button type="button" id="${VALUES_NAV_COLLAPSE_ID}" class="kaleido-values__nav-collapse" title="收起导航" aria-label="收起导航">
                <span class="${VALUES_NAV_COLLAPSE_ICON_CLASS}"></span>
              </button>
            </div>
            <button type="button" id="${VALUES_TAB_TREE_ID}" class="kaleido-values__nav-item is-active" role="tab" aria-selected="true" title="变量树：按节点层级查看与编辑变量">
              <span class="kaleido-values__nav-icon"><span class="${VALUES_TREE_ICON_CLASS}"></span></span>
              <span class="kaleido-values__nav-label">变量树</span>
            </button>
            <button type="button" id="${VALUES_TAB_KEYS_ID}" class="kaleido-values__nav-item" role="tab" aria-selected="false" title="变量注册：注册变量名与变化规则，AI 自动维护的唯一依据">
              <span class="kaleido-values__nav-icon"><span class="${VALUES_KEYS_ICON_CLASS}"></span></span>
              <span class="kaleido-values__nav-label">变量注册</span>
            </button>
            <button type="button" id="${VALUES_TAB_TRIGGERS_ID}" class="kaleido-values__nav-item" role="tab" aria-selected="false" title="剧情触发：按变量当前值是否满足条件，确定性触发剧情事件（不依赖 AI 判断）">
              <span class="kaleido-values__nav-icon"><span class="${VALUES_TRIGGER_ICON_CLASS}"></span></span>
              <span class="kaleido-values__nav-label">剧情触发</span>
            </button>
            <button type="button" id="${VALUES_TAB_INJECT_ID}" class="kaleido-values__nav-item" role="tab" aria-selected="false" title="注入预览：查看实际注入提示词的 <Values> 内容（只读）">
              <span class="kaleido-values__nav-icon"><span class="${VALUES_INJECT_PREVIEW_ICON_CLASS}"></span></span>
              <span class="kaleido-values__nav-label">注入预览</span>
            </button>
            <button type="button" id="${VALUES_TAB_MAP_ID}" class="kaleido-values__nav-item" role="tab" aria-selected="false" title="游戏地图：为当前角色卡上传背景图、添加地点，供游戏模式展示">
              <span class="kaleido-values__nav-icon"><span class="${MAP_ICON_CLASS}"></span></span>
              <span class="kaleido-values__nav-label">游戏地图</span>
            </button>
          </nav>
          <div class="kaleido-values__main">
            <div id="${VALUES_TREE_PANE_ID}" class="kaleido-values__pane is-active">
              <div id="${VALUES_LAYER_ROW_ID}" class="kaleido-values__layer-row" data-layer="default" role="group" aria-label="编辑层">
                <span id="${VALUES_LAYER_ICON_ID}" class="kaleido-values__layer-icon"><span class="${VALUES_LAYER_DEFAULT_ICON_CLASS}"></span></span>
                <span id="${VALUES_LAYER_TITLE_ID}" class="kaleido-values__layer-title">默认数值</span>
                <span class="kaleido-values__toolbar-spacer"></span>
                <button type="button" id="${VALUES_SAVE_NOW_ID}" class="kaleido-btn kaleido-btn--mini" title="把当前默认数值立即保存到角色卡，并从磁盘重读校验写入是否生效">
                  <span class="${VALUES_SAVE_ICON_CLASS}"></span> 保存
                </button>
                <button type="button" id="${VALUES_LAYER_TOGGLE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" title="切换到游戏数值（聊天，AI 自动维护）">
                  <span class="${VALUES_LAYER_SWAP_ICON_CLASS}"></span> 切换到游戏数值
                </button>
                <button type="button" id="${VALUES_LAYER_GAME_ID}" class="kaleido-values__layer-btn" data-layer="game" hidden aria-hidden="true" tabindex="-1"></button>
                <button type="button" id="${VALUES_LAYER_DEFAULT_ID}" class="kaleido-values__layer-btn is-active" data-layer="default" hidden aria-hidden="true" tabindex="-1"></button>
              </div>
              <div class="kaleido-values__tree-actions">
                <button type="button" id="${VALUES_ADD_ROOT_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="新建节点或变量">＋ 新建</button>
                <span class="kaleido-values__toolbar-spacer"></span>
                <button type="button" id="${VALUES_MAINTAIN_NOW_ID}" class="kaleido-btn kaleido-btn--mini" title="手动对当前游戏值执行一轮 AI 维护">✨ 立即维护</button>
                <button type="button" id="${VALUES_RESET_GAME_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" title="把当前聊天的游戏值整体重置为角色卡默认值">↺ 重置为默认值</button>
              </div>
              <div class="kaleido-values__status-strip">
                <span id="${VALUES_MAINTAIN_STATUS_ID}" class="kaleido-values__maintain-status" data-state="idle">自动维护：开 · 尚未运行</span>
                <span id="${VALUES_DEFAULT_HINT_ID}" class="kaleido-values__default-hint" hidden>默认值仅手动修改</span>
              </div>
              <div id="${VALUES_INJECT_BAR_ID}" class="kaleido-values__inject-bar">
                <div class="kaleido-values__inject-toggle" title="把勾选的节点与变量注入提示词（World Info after 之后）">
                  <button type="button" id="${VALUES_INJECT_TOGGLE_ID}" class="kaleido-values__inject-switch is-off" role="switch" aria-checked="false" aria-label="注入提示词开关"><span class="kaleido-values__inject-switch-thumb"></span></button>
                  <span class="kaleido-values__inject-toggle-label"><span class="${VALUES_INJECT_ICON_CLASS}"></span> 注入提示词</span>
                </div>
                <span id="${VALUES_INJECT_STATUS_ID}" class="kaleido-values__inject-status" data-state="idle">未开启 · 勾选条目后随提示词注入</span>
              </div>
              <div id="${VALUES_TREE_ID}" class="kaleido-values__tree">
                <div id="${VALUES_TREE_BODY_ID}" class="kaleido-values__tree-body"></div>
              </div>
            </div>
            <div id="${VALUES_KEYS_PANE_ID}" class="kaleido-values__pane" hidden>
              <div class="kaleido-values__keys-actions">
                <button type="button" id="${VALUES_ADD_KEY_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="注册新变量并填写变化规则">＋ 注册新变量</button>
              </div>
              <div id="${VALUES_KEYS_BODY_ID}" class="kaleido-values__keys-body"></div>
            </div>
            <div id="${VALUES_TRIGGERS_PANE_ID}" class="kaleido-values__pane" hidden>
              <div class="kaleido-values__triggers-actions">
                <div class="kaleido-values__inject-toggle" title="剧情触发总开关：开启后每次发送前按变量当前值判定并注入满足条件的事件">
                  <button type="button" id="${VALUES_TRIGGERS_TOGGLE_ID}" class="kaleido-values__inject-switch is-off" role="switch" aria-checked="false" aria-label="剧情触发开关"><span class="kaleido-values__inject-switch-thumb"></span></button>
                  <span class="kaleido-values__inject-toggle-label"><span class="${VALUES_TRIGGER_ICON_CLASS}"></span> 剧情触发</span>
                </div>
                <span class="kaleido-values__toolbar-spacer"></span>
                <button type="button" id="${VALUES_TRIGGERS_ADD_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="新建剧情触发事件">＋ 新建触发</button>
              </div>
              <div id="${VALUES_TRIGGERS_BODY_ID}" class="kaleido-values__triggers-body"></div>
            </div>
            <div id="${VALUES_INJECT_PANE_ID}" class="kaleido-values__pane" hidden>
              <div class="kaleido-values__inject-preview-head">
                <span class="kaleido-values__inject-preview-title"><span class="${VALUES_INJECT_PREVIEW_ICON_CLASS}"></span> 注入预览</span>
              </div>
              <pre id="${VALUES_INJECT_TEXT_ID}" class="kaleido-values__inject-text" spellcheck="false"></pre>
            </div>
            <div id="${VALUES_MAP_PANE_ID}" class="kaleido-values__pane" hidden></div>
            <div id="${VALUES_EDITOR_ID}" class="${editorClass}" hidden>
              <div class="kaleido-values__editor-head">
                <span id="${VALUES_EDITOR_TITLE_ID}" class="kaleido-values__editor-title">新建节点</span>
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_EDITOR_CANCEL_ID}" class="kaleido-icon-btn" title="取消" aria-label="取消">✕</button>
              </div>
              <div id="${VALUES_EDITOR_NODE_FIELDS_ID}">
                <label class="kaleido-api__field" for="${VALUES_EDITOR_NAME_ID}">
                  <span class="kaleido-api__label">节点名称 *</span>
                  <input id="${VALUES_EDITOR_NAME_ID}" class="kaleido-input" type="text" placeholder="如：张三 / 队伍 / 城镇" autocomplete="off" spellcheck="false" />
                </label>
                <label class="kaleido-api__field" for="${VALUES_EDITOR_PARENT_SELECT_ID}">
                  <span class="kaleido-api__label">上级节点</span>
                  <select id="${VALUES_EDITOR_PARENT_SELECT_ID}" class="kaleido-input">
                    <option value="">（顶层 · 根节点）</option>
                  </select>
                </label>
              </div>
              <div id="${VALUES_EDITOR_KEY_FIELDS_ID}" hidden>
                <label class="kaleido-api__field" for="${VALUES_EDITOR_KEY_SELECT_ID}">
                  <span class="kaleido-api__label">已注册变量 *</span>
                  <select id="${VALUES_EDITOR_KEY_SELECT_ID}" class="kaleido-input" title="变量必须先注册，新建时从这里选择"></select>
                  <span id="${VALUES_EDITOR_KEY_NAME_ID}" class="kaleido-values__editor-key-name" hidden></span>
                </label>
                <label class="kaleido-api__field" for="${VALUES_EDITOR_VALUE_ID}">
                  <span id="${VALUES_EDITOR_VALUE_LABEL_ID}" class="kaleido-api__label">变量值 *</span>
                  <textarea id="${VALUES_EDITOR_VALUE_ID}" class="kaleido-input kaleido-values__textarea kaleido-values__textarea--small" rows="2" placeholder="如：30 / 1000 / 友好 / true" spellcheck="false"></textarea>
                  <span id="${VALUES_EDITOR_CHILD_HINT_ID}" class="kaleido-values__editor-hint" hidden>子变量值由派生规则（区间 / 公式）自动计算</span>
                </label>
              </div>
              <div class="kaleido-values__editor-actions">
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_EDITOR_SAVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary">保存</button>
              </div>
            </div>
            <div id="${VALUES_KEY_EDITOR_ID}" class="${editorClass}" hidden>
              <div class="kaleido-values__editor-head">
                <span id="${VALUES_KEY_EDITOR_TITLE_ID}" class="kaleido-values__editor-title">注册新变量</span>
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_KEY_EDITOR_CANCEL_ID}" class="kaleido-icon-btn" title="取消" aria-label="取消">✕</button>
              </div>
              <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_NAME_ID}">
                <span class="kaleido-api__label">变量名 *</span>
                <input id="${VALUES_KEY_EDITOR_NAME_ID}" class="kaleido-input" type="text" placeholder="如：好感 / 金钱 / 体力" autocomplete="off" spellcheck="false" />
              </label>
              <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_TYPE_ID}">
                <span class="kaleido-api__label">变量类型</span>
                <select id="${VALUES_KEY_EDITOR_TYPE_ID}" class="kaleido-input" title="父变量：由 AI 按变化规则维护；子变量：按派生规则（区间 / 公式）由同路径变量自动计算">
                  <option value="${VALUES_KEY_TYPE_PARENT}">父变量（AI 按变化规则维护）</option>
                  <option value="${VALUES_KEY_TYPE_CHILD}">子变量（按派生规则自动计算）</option>
                </select>
              </label>
              <div id="${VALUES_KEY_EDITOR_RULE_FIELDS_ID}">
                <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_RULE_ID}">
                  <span class="kaleido-api__label">变化规则</span>
                  <textarea id="${VALUES_KEY_EDITOR_RULE_ID}" class="kaleido-input kaleido-values__textarea kaleido-values__textarea--small" rows="4" placeholder="如：好感随互动变化，友好互动 +5，冲突 -10，上限 100" spellcheck="false"></textarea>
                </label>
              </div>
              <div id="${VALUES_KEY_EDITOR_CHILD_FIELDS_ID}" hidden>
                <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_DERIVE_ID}">
                  <span class="kaleido-api__label">派生方式</span>
                  <select id="${VALUES_KEY_EDITOR_DERIVE_ID}" class="kaleido-input" title="区间：按派生源数值匹配区间输出文本；公式：引用一个或多个同路径变量四则运算输出数值">
                    <option value="${VALUES_KEY_DERIVE_RULES}">区间（按派生源数值匹配，输出文本）</option>
                    <option value="${VALUES_KEY_DERIVE_FORMULA}">公式（引用变量计算，输出数值）</option>
                  </select>
                </label>
                <div id="${VALUES_KEY_EDITOR_FORMULA_FIELDS_ID}" hidden>
                  <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_FORMULA_ID}">
                    <span class="kaleido-api__label">派生公式 *</span>
                    <textarea id="${VALUES_KEY_EDITOR_FORMULA_ID}" class="kaleido-input kaleido-values__textarea kaleido-values__textarea--small" rows="3" placeholder="如：((0.5*友谊+0.5*情欲)+1.2*情欲)/10" title="支持 + - * / 与括号；变量为同路径下的已注册变量（父 / 子均可）" spellcheck="false"></textarea>
                    <span class="kaleido-api__hint">支持 + - * / 与括号；变量为同路径下的已注册变量（父 / 子均可）。</span>
                  </label>
                </div>
                <div id="${VALUES_KEY_EDITOR_RULES_FIELDS_ID}">
                  <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_PARENT_ID}">
                    <span class="kaleido-api__label">派生源 *</span>
                    <select id="${VALUES_KEY_EDITOR_PARENT_ID}" class="kaleido-input" title="子变量的值由同路径下该变量的值决定（父 / 子变量均可，如 张三/态度 ← 张三/综合评分）"></select>
                  </label>
                  <div class="kaleido-api__field">
                    <span class="kaleido-api__label">派生区间 *</span>
                    <div id="${VALUES_KEY_EDITOR_RULES_ID}" class="kaleido-values__key-rules"></div>
                    <button type="button" id="${VALUES_KEY_EDITOR_RULES_ADD_ID}" class="kaleido-btn kaleido-btn--mini">＋ 添加区间</button>
                  </div>
                </div>
              </div>
              <div class="kaleido-values__editor-actions">
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_KEY_EDITOR_SAVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary">保存</button>
              </div>
            </div>
            <div id="${VALUES_TRIGGER_EDITOR_ID}" class="${editorClass}" hidden>
              <div class="kaleido-values__editor-head">
                <span id="${VALUES_TRIGGER_EDITOR_TITLE_ID}" class="kaleido-values__editor-title">新建触发</span>
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_TRIGGER_EDITOR_CANCEL_ID}" class="kaleido-icon-btn" title="取消" aria-label="取消">✕</button>
              </div>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_NAME_ID}">
                <span class="kaleido-api__label">事件名称 *</span>
                <input id="${VALUES_TRIGGER_EDITOR_NAME_ID}" class="kaleido-input" type="text" placeholder="如：告白事件 / 战争爆发" autocomplete="off" spellcheck="false" />
              </label>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_LOGIC_ID}">
                <span class="kaleido-api__label">条件逻辑</span>
                <select id="${VALUES_TRIGGER_EDITOR_LOGIC_ID}" class="kaleido-input" title="全部满足（且）= 所有条件都满足才触发；任一满足（或）= 满足任意一条即触发"></select>
              </label>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_ONCE_ID}">
                <span class="kaleido-api__label">事件类型</span>
                <select id="${VALUES_TRIGGER_EDITOR_ONCE_ID}" class="kaleido-input" title="一次性事件：触发一次后自动关闭；常驻事件：条件满足时可重复触发"></select>
              </label>
              <div class="kaleido-api__field">
                <span class="kaleido-api__label">变量条件 *</span>
                <div id="${VALUES_TRIGGER_EDITOR_CONDITIONS_ID}" class="kaleido-values__trigger-conditions"></div>
                <button type="button" id="${VALUES_TRIGGER_EDITOR_CONDITION_ADD_ID}" class="kaleido-btn kaleido-btn--mini">＋ 添加条件</button>
              </div>
              <div class="kaleido-api__field">
                <span class="kaleido-api__label">事件效果（可选 · 触发时修改父变量）</span>
                <div id="${VALUES_TRIGGER_EDITOR_EFFECTS_ID}" class="kaleido-values__trigger-effects"></div>
                <button type="button" id="${VALUES_TRIGGER_EDITOR_EFFECT_ADD_ID}" class="kaleido-btn kaleido-btn--mini">＋ 添加效果</button>
              </div>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_DESC_ID}">
                <span class="kaleido-api__label">事件说明</span>
                <input id="${VALUES_TRIGGER_EDITOR_DESC_ID}" class="kaleido-input" type="text" placeholder="可选：一句话说明用途" autocomplete="off" spellcheck="false" />
              </label>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_CONTENT_ID}">
                <span class="kaleido-api__label">事件内容 *</span>
                <textarea id="${VALUES_TRIGGER_EDITOR_CONTENT_ID}" class="kaleido-input kaleido-values__textarea" rows="6" placeholder="条件满足后注入的剧情事件正文" spellcheck="false"></textarea>
              </label>
              <div class="kaleido-values__editor-actions">
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_TRIGGER_EDITOR_SAVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary">保存</button>
              </div>
            </div>
            <div id="${VALUES_ADD_MENU_ID}" class="kaleido-values__add-menu" hidden role="menu" aria-label="新建">
              <button type="button" id="${VALUES_ADD_MENU_NODE_ID}" class="kaleido-values__add-menu-item" role="menuitem" data-kind="node">新建节点</button>
              <button type="button" id="${VALUES_ADD_MENU_KEY_ID}" class="kaleido-values__add-menu-item" role="menuitem" data-kind="key">新建变量</button>
            </div>
            <input id="${VALUES_IMPORT_INPUT_ID}" type="file" accept=".yaml,.yml,text/yaml,application/x-yaml" hidden />
          </div>
        </div>
  `;
}

// ---------- 电脑端：独立大窗口工作台 ----------
function initValuesWorkbench() {
  if (getValuesWorkbench()) return;
  const dialog = document.createElement('div');
  dialog.id = VALUES_DIALOG_ID;
  dialog.className = 'kaleido-values-dialog';
  dialog.setAttribute('aria-hidden', 'true');
  dialog.innerHTML = `
    <div class="kaleido-values-dialog__inner" role="dialog" aria-label="变量工作台">
      <div class="kaleido-values-dialog__header">
        <span class="kaleido-values-dialog__title"><span class="${VALUES_ICON_CLASS}"></span> 变量系统</span>
        <span id="${VALUES_BINDING_ID}" class="kaleido-values__binding" data-state="idle" title="变量存储绑定状态">未绑定角色</span>
        <div class="kaleido-values-dialog__toolbar">
          <button type="button" id="${VALUES_IMPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini">导入 变量</button>
          <button type="button" id="${VALUES_EXPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost">导出 变量</button>
          <button type="button" id="${VALUES_CLOSE_BTN_ID}" class="kaleido-icon-btn" title="关闭工作台" aria-label="关闭工作台">✕</button>
        </div>
      </div>
      <div class="kaleido-values-dialog__body">
${buildValuesContentHTML('kaleido-values-dialog__editor')}
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  bindValuesContentEvents();
  document.getElementById(VALUES_CLOSE_BTN_ID)?.addEventListener('click', closeValuesWorkbench);
  if (!globalThis[VALUES_DIALOG_KEY]) {
    globalThis[VALUES_DIALOG_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      // 裁剪弹层开着时先由地图模块自己的 Esc 处理器关闭，这里不抢。
      if (isMapCropDialogOpen()) return;
      const editor = document.getElementById(VALUES_EDITOR_ID);
      const keyEditor = document.getElementById(VALUES_KEY_EDITOR_ID);
      const triggerEditor = document.getElementById(VALUES_TRIGGER_EDITOR_ID);
      if (editor && !editor.hidden) {
        closeValuesEditor();
        return;
      }
      if (keyEditor && !keyEditor.hidden) {
        closeValuesKeyEditor();
        return;
      }
      if (triggerEditor && !triggerEditor.hidden) {
        closeValuesTriggerEditor();
        return;
      }
      if (isValuesWorkbenchOpen()) closeValuesWorkbench();
    };
    document.addEventListener('keydown', globalThis[VALUES_DIALOG_KEY]);
  }
}

// ---------- 手机端：面板内视图 ----------
function initValuesPanelView(panel) {
  if (!panel || document.getElementById(VALUES_VIEW_ID)) return;
  const section = document.createElement('section');
  section.id = VALUES_VIEW_ID;
  section.className = 'kaleido-view kaleido-values-view';
  section.setAttribute('aria-hidden', 'true');
  section.innerHTML = `
    <div class="kaleido-values__binding-row">
      <span id="${VALUES_BINDING_ID}" class="kaleido-values__binding" data-state="idle" title="变量存储绑定状态">未绑定角色</span>
      <div class="kaleido-values__binding-actions">
        <button type="button" id="${VALUES_IMPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini">导入</button>
        <button type="button" id="${VALUES_EXPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost">导出</button>
      </div>
    </div>
${buildValuesContentHTML('kaleido-values__editor')}
  `;
  panel.querySelector('.kaleido-panel__body')?.appendChild(section);
  bindValuesContentEvents();
}

function initValuesSection(panel) {
  if (isNarrowViewport()) {
    initValuesPanelView(panel);
  } else {
    initValuesWorkbench();
  }
}
