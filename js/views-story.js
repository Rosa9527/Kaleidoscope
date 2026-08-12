// ===== 万华镜（Kaleidoscope）剧情脉络可视化工作台 UI =====
let storyEditorMode = null;      // 'node' | 'script'
let storyEditorId = null;        // 正在编辑的条目 id（null = 新建）
let storyEditorPresetParentId = ''; // 新建子节点时预设的上级
let storyEditorPresetNodeId = '';   // 新建事件时预设的所属节点
let storyPendingScript = null;   // 导入单事件后待确认的数据
let storyExpanded = new Set();   // 已展开的节点 id
let storyImportTargetNodeId = '';  // 节点行「导入事件」的目标节点
let storyEditorSession = 0;        // 编辑器会话号：异步导入完成后若会话已变则放弃接管
let storyAddMenuContext = null;   // 「＋」菜单上下文：{ root: true } 或 { nodeId }
let storyImportModeResolve = null;  // 导入方式选择浮层的回调（resolve 'merge' | 'replace' | null）

function storyToastr(kind, message) {
  try {
    const fn = globalThis.toastr?.[kind];
    if (typeof fn === 'function') fn(message, `[${MODULE_DISPLAY_NAME}]`);
  } catch {}
}

function setStoryInputValue(id, value) {
  const node = document.getElementById(id);
  if (node) node.value = value ?? '';
}

function getStoryWorkbench() {
  return document.getElementById(STORY_DIALOG_ID);
}

function isStoryWorkbenchOpen() {
  const dialog = getStoryWorkbench();
  return Boolean(dialog && dialog.classList.contains('is-open'));
}

function buildStoryEmpty(text) {
  const empty = document.createElement('div');
  empty.className = 'kaleido-story__empty';
  empty.textContent = text;
  return empty;
}

// ---------- 打开 / 关闭工作台 ----------
function openStoryWorkbench() {
  const dialog = getStoryWorkbench();
  if (!dialog) return;
  closeStoryEditor();
  dialog.classList.add('is-open');
  dialog.setAttribute('aria-hidden', 'false');
  renderStoryTree();
  refreshHomeStoryStatus();
  logApp('debug', '剧情脉络工作台已打开');
}

function closeStoryWorkbench() {
  const dialog = getStoryWorkbench();
  if (!dialog) return;
  closeStoryImportMode();
  closeStoryEditor();
  closeStoryAddMenu();
  dialog.classList.remove('is-open');
  dialog.setAttribute('aria-hidden', 'true');
  logApp('debug', '剧情脉络工作台已关闭');
}

// 工作台头部「角色卡绑定」徽标：已绑定 / 待绑定 / 未绑定角色。
function refreshStoryBindingStatus() {
  const badge = document.getElementById(STORY_BINDING_ID);
  if (!badge) return;
  const ctx = getContextSafe();
  const character = ctx ? getStoryCharacter(ctx) : null;
  if (!character) {
    badge.textContent = '未绑定角色';
    badge.dataset.state = 'idle';
    badge.title = '群聊或未选角色：剧情数据保存在全局设置，不随角色卡导入导出';
    return;
  }
  const name = String(character.name || character.avatar || '当前角色');
  const card = ctx ? getStoryCardData(ctx) : null;
  if (card) {
    badge.textContent = `已绑定 · ${name}`;
    badge.dataset.state = 'ok';
    badge.title = '剧情数据保存在角色卡中：导入/导出角色卡时自动携带';
  } else {
    badge.textContent = `待绑定 · ${name}`;
    badge.dataset.state = 'warn';
    badge.title = '当前角色卡还没有剧情数据：首次保存后自动写入角色卡';
  }
}

// ---------- 树状渲染 ----------
function renderStoryTree() {
  const body = document.getElementById(STORY_TREE_BODY_ID);
  if (!body) return;
  const ctx = getContextSafe();
  refreshStoryBindingStatus();
  body.innerHTML = '';
  const roots = ctx ? getStoryRootNodes(ctx).sort(byStoryCreatedAt) : [];
  if (roots.length === 0) {
    body.appendChild(buildStoryEmpty('还没有节点。点击上方「＋」新建节点或事件；\n节点可层层嵌套，事件可挂在任意节点下。'));
    return;
  }
  for (const root of roots) renderStoryNodeRows(body, ctx, root, 0);

  // 未分类事件（无节点 / 节点已不存在）
  const scripts = ctx ? getStoryScripts(ctx) : [];
  const unassigned = scripts
    .filter((script) => !String(script.nodeId || '') || !getStoryNodeById(ctx, script.nodeId))
    .sort(byStoryCreatedAt);
  if (unassigned.length > 0) {
    const group = document.createElement('div');
    group.className = 'kaleido-story__group';
    const title = document.createElement('span');
    title.className = 'kaleido-story__group-title';
    title.textContent = `未分类事件（${unassigned.length}）`;
    group.appendChild(title);
    for (const script of unassigned) group.appendChild(buildStoryScriptRow(script, 0));
    body.appendChild(group);
  }
}

function renderStoryNodeRows(container, ctx, node, depth) {
  const expanded = storyExpanded.has(node.id);
  const children = getStoryNodeChildren(ctx, node.id).sort(byStoryCreatedAt);
  const scripts = getStoryScripts(ctx)
    .filter((script) => script.nodeId === node.id)
    .sort(byStoryCreatedAt);
  container.appendChild(buildStoryNodeRow(node, depth, expanded, children.length + scripts.length));
  if (!expanded) return;
  for (const child of children) renderStoryNodeRows(container, ctx, child, depth + 1);
  for (const script of scripts) container.appendChild(buildStoryScriptRow(script, depth + 1));
}

function buildStoryNodeRow(node, depth, expanded, childCount) {
  const row = document.createElement('div');
  row.className = 'kaleido-story__row kaleido-story__row--node';
  row.dataset.id = node.id;
  row.style.setProperty('--depth', String(depth));
  const enabled = node.enabled !== false;
  row.innerHTML = `
    <button type="button" class="kaleido-story__chevron${childCount > 0 ? '' : ' is-empty'}" data-action="toggle" data-id="${escapeHtml(node.id)}" title="展开 / 收起" aria-label="展开 / 收起">
      <span class="${STORY_CHEVRON_ICON_CLASS}"></span>
    </button>
    <span class="kaleido-story__row-icon"><span class="${expanded ? STORY_NODE_OPEN_ICON_CLASS : STORY_NODE_ICON_CLASS}"></span></span>
    <span class="kaleido-story__row-name" title="${escapeHtml(node.description || node.name)}">${escapeHtml(node.name)}</span>
    <span class="kaleido-story__row-count">${childCount} 项</span>
    <button type="button" class="kaleido-story__switch${enabled ? '' : ' is-off'}" data-action="toggle-enabled" data-id="${escapeHtml(node.id)}" role="switch" aria-checked="${enabled}" title="${enabled ? '点击关闭：本节点及其子节点、事件不再参与剧情预筛' : '点击激活：本节点及其子节点、事件重新参与剧情预筛'}" aria-label="启用 / 关闭节点"><span class="kaleido-story__switch-thumb"></span></button>
    <span class="kaleido-story__row-actions">
      <button type="button" class="kaleido-story__icon-btn" data-action="add-menu" data-id="${escapeHtml(node.id)}" title="新建节点 / 事件" aria-label="新建节点 / 事件"><span class="${STORY_ADD_CHILD_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn" data-action="import-script" data-id="${escapeHtml(node.id)}" title="导入事件文件" aria-label="导入事件文件"><span class="${STORY_IMPORT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn" data-action="edit" data-id="${escapeHtml(node.id)}" title="编辑节点" aria-label="编辑节点"><span class="${STORY_EDIT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn kaleido-story__icon-btn--danger" data-action="delete" data-id="${escapeHtml(node.id)}" title="删除节点" aria-label="删除节点"><span class="${STORY_DELETE_ICON_CLASS}"></span></button>
    </span>
  `;
  if (expanded) row.classList.add('is-expanded');
  if (!enabled) row.classList.add('is-disabled');
  return row;
}

function buildStoryScriptRow(script, depth) {
  const row = document.createElement('div');
  row.className = 'kaleido-story__row kaleido-story__row--script';
  row.dataset.id = script.id;
  row.style.setProperty('--depth', String(depth));
  const ctx = getContextSafe();
  const node = script.nodeId ? getStoryNodeById(ctx, script.nodeId) : null;
  const badge = node ? escapeHtml(node.name) : '未分类';
  row.innerHTML = `
    <span class="kaleido-story__row-icon kaleido-story__row-icon--script"><span class="${STORY_SCRIPT_ICON_CLASS}"></span></span>
    <span class="kaleido-story__row-name" title="${escapeHtml(script.name)}">${escapeHtml(script.name)}</span>
    ${script.trigger ? `<span class="kaleido-story__row-trigger" title="${escapeHtml(script.trigger)}">${escapeHtml(script.trigger)}</span>` : ''}
    <span class="kaleido-story__row-badge">${badge}</span>
    <span class="kaleido-story__row-actions">
      <button type="button" class="kaleido-story__icon-btn" data-action="edit-script" data-id="${escapeHtml(script.id)}" title="编辑事件" aria-label="编辑事件"><span class="${STORY_EDIT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn" data-action="export-script" data-id="${escapeHtml(script.id)}" title="导出事件" aria-label="导出事件"><span class="${STORY_EXPORT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn kaleido-story__icon-btn--danger" data-action="delete-script" data-id="${escapeHtml(script.id)}" title="删除事件" aria-label="删除事件"><span class="${STORY_DELETE_ICON_CLASS}"></span></button>
    </span>
  `;
  return row;
}

function storyToggleNode(id) {
  if (storyExpanded.has(id)) storyExpanded.delete(id);
  else storyExpanded.add(id);
  renderStoryTree();
}

// ---------- 「＋」新建菜单 ----------
function openStoryAddMenu(anchor, context) {
  const menu = document.getElementById(STORY_ADD_MENU_ID);
  if (!menu) return;
  storyAddMenuContext = context || null;
  menu.hidden = false;
  const rect = anchor.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  let left = rect.left;
  let top = rect.bottom + 4;
  if (top + menuRect.height > window.innerHeight - 8) {
    top = Math.max(8, rect.top - menuRect.height - 4);
  }
  if (left + menuRect.width > window.innerWidth - 8) {
    left = Math.max(8, window.innerWidth - menuRect.width - 8);
  }
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function closeStoryAddMenu() {
  const menu = document.getElementById(STORY_ADD_MENU_ID);
  if (menu) menu.hidden = true;
  storyAddMenuContext = null;
}

function handleStoryAddMenuPick(kind) {
  const context = storyAddMenuContext || {};
  closeStoryAddMenu();
  if (kind === 'node') openStoryNodeEditor(null, context.nodeId || '');
  else if (kind === 'script') openStoryScriptEditor(null, context.nodeId || '', null);
}

// ---------- 编辑器 ----------
function populateStoryNodeParentSelect(currentId, selectedParentId) {
  const select = document.getElementById(STORY_NODE_PARENT_ID);
  if (!select) return;
  const ctx = getContextSafe();
  const nodes = ctx ? getStoryNodes(ctx) : [];
  select.innerHTML = '';
  const top = document.createElement('option');
  top.value = '';
  top.textContent = '（顶层 · 根节点）';
  select.appendChild(top);
  for (const node of nodes) {
    if (node.id === currentId) continue;
    if (currentId && isStoryNodeAncestor(ctx, currentId, node.id)) continue; // 不能挂到自己的后代下
    const option = document.createElement('option');
    option.value = node.id;
    option.textContent = node.name;
    select.appendChild(option);
  }
  // 只认显式预设，避免沿用上一次会话的旧值导致误挂父级
  select.value = nodes.some((node) => node.id === selectedParentId) ? selectedParentId : '';
}

function populateStoryScriptNodeSelect(selectedNodeId) {
  const select = document.getElementById(STORY_SCRIPT_NODE_SELECT_ID);
  if (!select) return;
  const ctx = getContextSafe();
  const nodes = ctx ? getStoryNodes(ctx) : [];
  select.innerHTML = '';
  const unassigned = document.createElement('option');
  unassigned.value = '';
  unassigned.textContent = '未分类';
  select.appendChild(unassigned);
  for (const node of nodes) {
    const option = document.createElement('option');
    option.value = node.id;
    option.textContent = node.name;
    select.appendChild(option);
  }
  // 只认显式预设（含未分类），避免沿用上一次会话的旧值导致事件误归属
  select.value = nodes.some((node) => node.id === selectedNodeId) ? selectedNodeId : '';
}

function openStoryNodeEditor(item, presetParentId) {
  const editor = document.getElementById(STORY_EDITOR_ID);
  if (!editor) return;
  storyEditorSession += 1;
  storyEditorMode = 'node';
  storyEditorId = item && item.id ? item.id : null;
  storyEditorPresetParentId = item ? String(item.parentId || '') : String(presetParentId || '');
  storyEditorPresetNodeId = '';
  storyPendingScript = null;
  editor.hidden = false;
  setStoryEditorMode('node');
  setStoryInputValue(STORY_NODE_NAME_ID, item?.name || '');
  setStoryInputValue(STORY_NODE_DESC_ID, item?.description || '');
  populateStoryNodeParentSelect(storyEditorId, storyEditorPresetParentId);
}

function openStoryScriptEditor(item, presetNodeId, pending) {
  const editor = document.getElementById(STORY_EDITOR_ID);
  if (!editor) return;
  storyEditorSession += 1;
  storyEditorMode = 'script';
  storyEditorId = item && item.id ? item.id : null;
  storyEditorPresetParentId = '';
  storyEditorPresetNodeId = String(presetNodeId || '');
  storyPendingScript = pending && typeof pending === 'object' ? { ...pending } : null;
  editor.hidden = false;
  setStoryEditorMode('script');
  const data = storyPendingScript || item || {};
  const scriptCtx = getContextSafe();
  const defaultId = scriptCtx ? nextStoryScriptId(scriptCtx, storyEditorId || '') : '';
  setStoryInputValue(STORY_SCRIPT_ID_ID, String(data.id || '').trim() || defaultId);
  setStoryInputValue(STORY_SCRIPT_NAME_ID, data.name || '');
  setStoryInputValue(STORY_SCRIPT_TRIGGER_ID, data.trigger || '');
  setStoryInputValue(STORY_SCRIPT_DESC_ID, data.description || '');
  setStoryInputValue(STORY_SCRIPT_CONTENT_ID, data.content || '');
  populateStoryScriptNodeSelect(storyEditorPresetNodeId || data.nodeId || '');
}

function setStoryEditorMode(mode) {
  const title = document.getElementById(STORY_EDITOR_TITLE_ID);
  const nodeFields = document.getElementById(STORY_NODE_FIELDS_ID);
  const scriptFields = document.getElementById(STORY_SCRIPT_FIELDS_ID);
  const exportBtn = document.getElementById(STORY_EDITOR_EXPORT_ID);
  const saveBtn = document.getElementById(STORY_EDITOR_SAVE_ID);
  if (!title || !nodeFields || !scriptFields || !exportBtn || !saveBtn) return;
  if (mode === 'node') {
    nodeFields.hidden = false;
    scriptFields.hidden = true;
    exportBtn.hidden = true;
    title.textContent = storyEditorId ? '编辑节点' : (storyEditorPresetParentId ? '添加子节点' : '新建节点');
    saveBtn.textContent = '保存';
  } else {
    nodeFields.hidden = true;
    scriptFields.hidden = false;
    exportBtn.hidden = false;
    title.textContent = storyEditorId ? '编辑事件' : '新建事件';
    saveBtn.textContent = storyPendingScript ? '保存（导入）' : '保存';
  }
}

function closeStoryEditor() {
  const editor = document.getElementById(STORY_EDITOR_ID);
  if (editor) editor.hidden = true;
  storyEditorSession += 1;
  storyEditorMode = null;
  storyEditorId = null;
  storyEditorPresetParentId = '';
  storyEditorPresetNodeId = '';
  storyPendingScript = null;
}

function readStoryScriptForm() {
  return {
    id: String(document.getElementById(STORY_SCRIPT_ID_ID)?.value || '').trim(),
    name: String(document.getElementById(STORY_SCRIPT_NAME_ID)?.value || '').trim(),
    trigger: String(document.getElementById(STORY_SCRIPT_TRIGGER_ID)?.value || '').trim(),
    description: String(document.getElementById(STORY_SCRIPT_DESC_ID)?.value || '').trim(),
    content: String(document.getElementById(STORY_SCRIPT_CONTENT_ID)?.value || ''),
    nodeId: String(document.getElementById(STORY_SCRIPT_NODE_SELECT_ID)?.value || '').trim(),
  };
}

function saveStoryEditor() {
  const ctx = getContextSafe();
  if (!ctx) return;
  // 以当前可见的表单为准（而不是内部模式标记），避免异步导入等场景
  // 出现「界面是节点表单、保存却按事件校验」的错位。
  const nodeFields = document.getElementById(STORY_NODE_FIELDS_ID);
  const scriptFields = document.getElementById(STORY_SCRIPT_FIELDS_ID);
  const nodeVisible = Boolean(nodeFields && !nodeFields.hidden);
  const scriptVisible = Boolean(scriptFields && !scriptFields.hidden);
  if (nodeVisible && !scriptVisible) {
    const name = String(document.getElementById(STORY_NODE_NAME_ID)?.value || '').trim();
    if (!name) {
      storyToastr('warning', '请填写节点名称');
      return;
    }
    const parentId = String(document.getElementById(STORY_NODE_PARENT_ID)?.value || '').trim();
    const data = {
      name,
      parentId,
      description: String(document.getElementById(STORY_NODE_DESC_ID)?.value || '').trim(),
    };
    if (storyEditorId) updateStoryNode(ctx, storyEditorId, data);
    else createStoryNode(ctx, data);
    logApp('info', storyEditorId ? '节点已更新' : '节点已添加', name);
    storyToastr('success', storyEditorId ? '节点已保存' : '节点已添加');
  } else if (scriptVisible && !nodeVisible) {
    const data = readStoryScriptForm();
    if (!data.name) {
      storyToastr('warning', '请填写事件名称');
      return;
    }
    if (!data.content.trim()) {
      storyToastr('warning', '事件内容不能为空');
      return;
    }
    const requestedId = String(data.id || '').trim();
    let saved;
    if (storyEditorId) {
      saved = updateStoryScript(ctx, storyEditorId, data);
    } else {
      saved = createStoryScript(ctx, data);
    }
    if (saved && String(saved.id || '').trim() !== requestedId) {
      storyToastr('info', `事件 ID 已自动设为 ${saved.id}`);
    }
    logApp('info', storyEditorId ? '事件已更新' : '事件已添加', data.name);
    storyToastr('success', storyEditorId ? '事件已保存' : '事件已添加');
  }
  closeStoryEditor();
  renderStoryTree();
  refreshHomeStoryStatus();
}

function handleStoryEditorExport() {
  if (storyEditorMode !== 'script') return;
  const data = readStoryScriptForm();
  if (!data.name) {
    storyToastr('warning', '请先填写事件名称再导出');
    return;
  }
  if (!data.content.trim()) {
    storyToastr('warning', '事件内容为空，无法导出');
    return;
  }
  const filename = `${STORY_SCRIPT_FILENAME_PREFIX}-${sanitizeStoryFilename(data.name)}.yaml`;
  if (downloadTextFile(filename, serializeSingleScript(data))) {
    storyToastr('success', `已导出事件：${filename}`);
  }
}

// ---------- 删除 ----------
function handleStoryDeleteNode(ctx, id) {
  const node = getStoryNodeById(ctx, id);
  if (!node) return;
  const children = getStoryNodeChildren(ctx, id);
  const scripts = getStoryScripts(ctx).filter((script) => script.nodeId === id);
  const parts = [];
  if (children.length > 0) parts.push(`${children.length} 个子节点将上移`);
  if (scripts.length > 0) parts.push(`${scripts.length} 个事件将转为未分类`);
  const suffix = parts.length > 0 ? `（${parts.join('，')}，均不会删除）` : '';
  if (!globalThis.confirm?.(`确定删除节点「${node.name}」？${suffix}`)) return;
  const result = deleteStoryNode(ctx, id);
  if (!result) return;
  renderStoryTree();
  refreshHomeStoryStatus();
  const message = [
    '节点已删除',
    result.movedChildren > 0 ? `${result.movedChildren} 个子节点已上移` : '',
    result.detachedScripts > 0 ? `${result.detachedScripts} 个事件已转为未分类` : '',
  ].filter(Boolean).join('，');
  storyToastr('success', message);
}

function handleStoryDeleteScript(ctx, id) {
  const script = getStoryScriptById(ctx, id);
  if (!script) return;
  if (!globalThis.confirm?.(`确定删除事件「${script.name}」？`)) return;
  deleteStoryScript(ctx, id);
  renderStoryTree();
  refreshHomeStoryStatus();
  storyToastr('success', '事件已删除');
}

// ---------- 导入 / 导出 ----------
async function handleStoryImportFile(file) {
  const session = storyEditorSession;
  let text;
  try {
    text = await readTextFile(file);
  } catch (error) {
    storyToastr('error', `读取文件失败：${String(error?.message || error)}`);
    return;
  }
  if (session !== storyEditorSession) {
    // 读取期间用户已打开/关闭了别的编辑器，放弃接管，避免把正在编辑的内容顶掉
    storyToastr('info', '已取消导入：编辑器状态已变化');
    return;
  }
  const trimmed = String(text).trimStart();
  if (trimmed.startsWith('---')) {
    // 单事件 frontmatter 文件：解析后打开编辑器待确认
    try {
      const script = parseSingleScriptFile(text);
      openStoryScriptEditor(null, storyImportTargetNodeId, script);
      storyImportTargetNodeId = '';
      storyToastr('info', '已读取事件 frontmatter，确认信息后点击保存');
    } catch (error) {
      storyToastr('error', `事件解析失败：${String(error?.message || error)}`);
    }
    return;
  }
  try {
    const bundle = parseStoryBundleFile(text);
    const ctx = getContextSafe();
    if (!ctx) return;
    const mode = await storyAskImportMode(bundle);
    if (!mode) {
      storyToastr('info', '已取消导入');
      return;
    }
    const stats = mergeStoryBundleInto(ctx, bundle, { replace: mode === 'replace' });
    renderStoryTree();
    refreshHomeStoryStatus();
    if (mode === 'replace') {
      storyToastr('success', `覆盖导入完成：已整体替换为 ${stats.addedNodes} 节点 / ${stats.addedScripts} 事件`);
    } else {
      storyToastr('success', `合并导入完成：新增 ${stats.addedNodes} 节点 / ${stats.addedScripts} 事件，更新 ${stats.updatedNodes} 节点 / ${stats.updatedScripts} 事件`);
    }
  } catch (error) {
    storyToastr('error', `导入失败：${String(error?.message || error)}`);
  }
}

// 导入方式选择浮层：整包导入前询问「合并 / 覆盖」，返回 'merge' | 'replace' | null（取消）。
function storyAskImportMode(bundle) {
  const overlay = document.getElementById(STORY_IMPORT_MODE_ID);
  if (!overlay) return Promise.resolve('merge');
  const desc = document.getElementById(STORY_IMPORT_MODE_DESC_ID);
  if (desc) {
    const source = bundle.character ? `（来自「${bundle.character}」）` : '';
    desc.textContent = `将导入 ${bundle.nodes.length} 个节点、${bundle.scripts.length} 个事件${source}。请选择处理方式：合并 = 同 id 更新、其余追加；覆盖 = 清空当前剧情脉络后整体替换。`;
  }
  overlay.hidden = false;
  return new Promise((resolve) => {
    storyImportModeResolve = (mode) => {
      storyImportModeResolve = null;
      overlay.hidden = true;
      resolve(mode);
    };
  });
}

// 结束导入方式选择：mode 为 null / 缺省时视为取消（工作台关闭时也会调用）。
function closeStoryImportMode(mode) {
  if (storyImportModeResolve) storyImportModeResolve(mode || null);
  storyImportModeResolve = null;
  const overlay = document.getElementById(STORY_IMPORT_MODE_ID);
  if (overlay) overlay.hidden = true;
}

function handleStoryExportBundle() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const text = serializeStoryBundle(ctx);
  const filename = buildStoryBundleFilename(ctx);
  if (downloadTextFile(filename, text)) {
    storyToastr('success', `已导出脉络包：${filename}`);
  }
}

function handleStoryExportScript(script) {
  const filename = `${STORY_SCRIPT_FILENAME_PREFIX}-${sanitizeStoryFilename(script?.name)}.yaml`;
  if (downloadTextFile(filename, serializeSingleScript(script))) {
    storyToastr('success', `已导出事件：${filename}`);
  }
}

// ---------- 初始化 ----------
function initStorySection() {
  if (getStoryWorkbench()) return;
  const dialog = document.createElement('div');
  dialog.id = STORY_DIALOG_ID;
  dialog.className = 'kaleido-story-dialog';
  dialog.setAttribute('aria-hidden', 'true');
  dialog.innerHTML = `
    <div class="kaleido-story-dialog__inner" role="dialog" aria-label="剧情脉络工作台">
      <div class="kaleido-story-dialog__header">
        <span class="kaleido-story-dialog__title"><span class="${STORY_ICON_CLASS}"></span> 剧情脉络</span>
        <span id="${STORY_BINDING_ID}" class="kaleido-story__binding" data-state="idle" title="剧情数据与角色卡绑定状态">未绑定角色</span>
        <div class="kaleido-story-dialog__toolbar">
          <button type="button" id="${STORY_IMPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini">导入 剧情脉络</button>
          <button type="button" id="${STORY_EXPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost">导出 剧情脉络</button>
          <button type="button" id="${STORY_CLOSE_BTN_ID}" class="kaleido-icon-btn" title="关闭工作台" aria-label="关闭工作台">✕</button>
        </div>
      </div>
      <div class="kaleido-story-dialog__body">
        <div id="${STORY_TREE_ID}" class="kaleido-story__tree">
          <div class="kaleido-story__tree-actions">
            <button type="button" id="${STORY_ROOT_ADD_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="新建节点或事件">＋ 新建</button>
            <span class="kaleido-story__tree-hint">节点可层层嵌套 · 事件挂在节点下</span>
          </div>
          <div id="${STORY_TREE_BODY_ID}" class="kaleido-story__tree-body"></div>
        </div>
        <div id="${STORY_EDITOR_ID}" class="kaleido-story-dialog__editor" hidden>
          <div class="kaleido-story__editor-head">
            <span id="${STORY_EDITOR_TITLE_ID}" class="kaleido-story__editor-title">新建节点</span>
            <span class="kaleido-story__editor-spacer"></span>
            <button type="button" id="${STORY_EDITOR_CANCEL_ID}" class="kaleido-icon-btn" title="取消" aria-label="取消">✕</button>
          </div>
          <div id="${STORY_NODE_FIELDS_ID}">
            <label class="kaleido-api__field" for="${STORY_NODE_NAME_ID}">
              <span class="kaleido-api__label">节点名称 *</span>
              <input id="${STORY_NODE_NAME_ID}" class="kaleido-input" type="text" placeholder="填写节点名称" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${STORY_NODE_PARENT_ID}">
              <span class="kaleido-api__label">上级节点</span>
              <select id="${STORY_NODE_PARENT_ID}" class="kaleido-input">
                <option value="">（顶层 · 根节点）</option>
              </select>
            </label>
            <label class="kaleido-api__field" for="${STORY_NODE_DESC_ID}">
              <span class="kaleido-api__label">节点说明</span>
              <textarea id="${STORY_NODE_DESC_ID}" class="kaleido-input kaleido-story__textarea kaleido-story__textarea--small" rows="3" placeholder="这个节点下的剧情大概讲什么（可选）"></textarea>
            </label>
          </div>
          <div id="${STORY_SCRIPT_FIELDS_ID}" hidden>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_NAME_ID}">
              <span class="kaleido-api__label">事件名称 *</span>
              <input id="${STORY_SCRIPT_NAME_ID}" class="kaleido-input" type="text" placeholder="填写事件名称" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_ID_ID}">
              <span class="kaleido-api__label">事件 ID *</span>
              <input id="${STORY_SCRIPT_ID_ID}" class="kaleido-input" type="text" placeholder="如：001（默认自动递增）" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_TRIGGER_ID}">
              <span class="kaleido-api__label">触发条件</span>
              <input id="${STORY_SCRIPT_TRIGGER_ID}" class="kaleido-input" type="text" placeholder="如：玩家第一次到达新手村" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_DESC_ID}">
              <span class="kaleido-api__label">事件说明</span>
              <textarea id="${STORY_SCRIPT_DESC_ID}" class="kaleido-input kaleido-story__textarea kaleido-story__textarea--small" rows="2" placeholder="这个事件的用途（可选）"></textarea>
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_NODE_SELECT_ID}">
              <span class="kaleido-api__label">所属节点</span>
              <select id="${STORY_SCRIPT_NODE_SELECT_ID}" class="kaleido-input">
                <option value="">未分类</option>
              </select>
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_CONTENT_ID}">
              <span class="kaleido-api__label">事件内容 *</span>
              <textarea id="${STORY_SCRIPT_CONTENT_ID}" class="kaleido-input kaleido-story__textarea" rows="9" placeholder="{{事件正文}}" spellcheck="false"></textarea>
            </label>
          </div>
          <div class="kaleido-story__editor-actions">
            <button type="button" id="${STORY_EDITOR_EXPORT_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" hidden>导出事件</button>
            <span class="kaleido-story__editor-spacer"></span>
            <button type="button" id="${STORY_EDITOR_SAVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary">保存</button>
          </div>
        </div>
      </div>
      <div id="${STORY_IMPORT_MODE_ID}" class="kaleido-story__import-mode" hidden role="dialog" aria-label="选择导入方式">
        <div class="kaleido-story__import-mode-card">
          <div class="kaleido-story__import-mode-title">选择导入方式</div>
          <div id="${STORY_IMPORT_MODE_DESC_ID}" class="kaleido-story__import-mode-desc"></div>
          <div class="kaleido-story__import-mode-actions">
            <button type="button" id="${STORY_IMPORT_MODE_MERGE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="同 id 条目更新，其余追加">🔀 合并导入</button>
            <button type="button" id="${STORY_IMPORT_MODE_REPLACE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" title="清空当前剧情脉络后整体替换">📦 覆盖导入</button>
          </div>
        </div>
      </div>
      <div id="${STORY_ADD_MENU_ID}" class="kaleido-story__add-menu" hidden role="menu" aria-label="新建">
        <button type="button" id="${STORY_ADD_MENU_NODE_ID}" class="kaleido-story__add-menu-item" role="menuitem" data-kind="node">
          <span class="${STORY_NODE_ICON_CLASS}"></span> 新建节点
        </button>
        <button type="button" id="${STORY_ADD_MENU_SCRIPT_ID}" class="kaleido-story__add-menu-item" role="menuitem" data-kind="script">
          <span class="${STORY_SCRIPT_ICON_CLASS}"></span> 新建事件
        </button>
      </div>
      <input id="${STORY_IMPORT_INPUT_ID}" type="file" accept=".yaml,.yml,text/yaml,application/x-yaml" hidden />
      <input id="${STORY_IMPORT_SCRIPT_INPUT_ID}" type="file" accept=".yaml,.yml,text/yaml,application/x-yaml" hidden />
    </div>
  `;
  document.body.appendChild(dialog);

  document.getElementById(STORY_ROOT_ADD_ID)?.addEventListener('click', (event) => {
    openStoryAddMenu(event.currentTarget, { root: true });
  });
  document.getElementById(STORY_ADD_MENU_NODE_ID)?.addEventListener('click', () => handleStoryAddMenuPick('node'));
  document.getElementById(STORY_ADD_MENU_SCRIPT_ID)?.addEventListener('click', () => handleStoryAddMenuPick('script'));
  document.getElementById(STORY_CLOSE_BTN_ID)?.addEventListener('click', closeStoryWorkbench);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeStoryWorkbench();
  });

  document.getElementById(STORY_IMPORT_BTN_ID)?.addEventListener('click', () => {
    storyImportTargetNodeId = '';
    document.getElementById(STORY_IMPORT_INPUT_ID)?.click();
  });
  document.getElementById(STORY_IMPORT_INPUT_ID)?.addEventListener('change', (event) => {
    const file = event.target?.files?.[0];
    if (file) handleStoryImportFile(file);
    event.target.value = '';
  });
  document.getElementById(STORY_IMPORT_SCRIPT_INPUT_ID)?.addEventListener('change', (event) => {
    const file = event.target?.files?.[0];
    if (file) handleStoryImportFile(file);
    event.target.value = '';
  });
  document.getElementById(STORY_EXPORT_BTN_ID)?.addEventListener('click', handleStoryExportBundle);

  document.getElementById(STORY_IMPORT_MODE_MERGE_ID)?.addEventListener('click', () => closeStoryImportMode('merge'));
  document.getElementById(STORY_IMPORT_MODE_REPLACE_ID)?.addEventListener('click', () => closeStoryImportMode('replace'));
  document.getElementById(STORY_IMPORT_MODE_ID)?.addEventListener('click', (event) => {
    // 只认点击遮罩（卡片内部点击不取消）
    const overlay = document.getElementById(STORY_IMPORT_MODE_ID);
    if (event.target === overlay) closeStoryImportMode();
  });

  const treeBody = document.getElementById(STORY_TREE_BODY_ID);
  treeBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-action]') : null;
    if (!button) return;
    event.preventDefault();
    const id = String(button.dataset.id || '');
    const action = String(button.dataset.action || '');
    const ctx = getContextSafe();
    if (!ctx) return;
    switch (action) {
      case 'toggle': {
        storyToggleNode(id);
        break;
      }
      case 'toggle-enabled': {
        const node = toggleStoryNodeEnabled(ctx, id);
        if (node) {
          storyToastr('info', node.enabled === false
            ? `节点「${node.name}」已关闭：其子节点与事件不再参与剧情预筛`
            : `节点「${node.name}」已激活`);
        }
        renderStoryTree();
        refreshHomeStoryStatus();
        break;
      }
      case 'add-menu': {
        openStoryAddMenu(button, { nodeId: id });
        break;
      }
      case 'edit': {
        const node = getStoryNodeById(ctx, id);
        if (node) openStoryNodeEditor(node);
        break;
      }
      case 'delete': {
        handleStoryDeleteNode(ctx, id);
        break;
      }
      case 'import-script': {
        storyImportTargetNodeId = id;
        document.getElementById(STORY_IMPORT_SCRIPT_INPUT_ID)?.click();
        break;
      }
      case 'edit-script': {
        const script = getStoryScriptById(ctx, id);
        if (script) openStoryScriptEditor(script);
        break;
      }
      case 'export-script': {
        const script = getStoryScriptById(ctx, id);
        if (script) handleStoryExportScript(script);
        break;
      }
      case 'delete-script': {
        handleStoryDeleteScript(ctx, id);
        break;
      }
      default:
        break;
    }
  });

  // 双击已建立的节点 / 事件行：默认进入编辑（按钮、输入控件上保持原行为）
  treeBody?.addEventListener('dblclick', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('button, input, select, textarea, a')) return;
    const row = target.closest('.kaleido-story__row');
    if (!row) return;
    const ctx = getContextSafe();
    if (!ctx) return;
    const id = String(row.dataset.id || '');
    if (row.classList.contains('kaleido-story__row--node')) {
      const node = getStoryNodeById(ctx, id);
      if (node) openStoryNodeEditor(node);
    } else if (row.classList.contains('kaleido-story__row--script')) {
      const script = getStoryScriptById(ctx, id);
      if (script) openStoryScriptEditor(script);
    }
  });

  document.getElementById(STORY_EDITOR_CANCEL_ID)?.addEventListener('click', closeStoryEditor);
  document.getElementById(STORY_EDITOR_SAVE_ID)?.addEventListener('click', saveStoryEditor);
  document.getElementById(STORY_EDITOR_EXPORT_ID)?.addEventListener('click', handleStoryEditorExport);

  if (!globalThis[STORY_DIALOG_KEY]) {
    globalThis[STORY_DIALOG_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      if (isStoryWorkbenchOpen()) closeStoryWorkbench();
    };
    document.addEventListener('keydown', globalThis[STORY_DIALOG_KEY]);
  }
  if (!globalThis[STORY_ADD_MENU_KEY]) {
    globalThis[STORY_ADD_MENU_KEY] = (event) => {
      const menu = document.getElementById(STORY_ADD_MENU_ID);
      if (!menu || menu.hidden) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (menu.contains(target)) return;
      // 点「＋」按钮本身不算外部：按钮的 click 会负责打开/重定位菜单
      if (target.closest(`#${STORY_ROOT_ADD_ID}, [data-action="add-menu"]`)) return;
      closeStoryAddMenu();
    };
    document.addEventListener('click', globalThis[STORY_ADD_MENU_KEY]);
  }
}
