// ===== 万华镜（Kaleidoscope）预设模版：提示词预设管理 + 默认提示词编辑 =====
// 核心概念：一个预设 = 一套完整的「剧情预筛 + 变量维护」提示词配置。预设负责
// 管理和切换整套提示词，而不是分别管理两个提示词组。
//
// 数据层在 prompt-preset-data.js：自定义预设列表存角色卡（随卡携带）；内置
// 「默认预设」永不落盘——激活它时直接读 / 写全局 settings 的 storyGatePrompt /
// valuesMaintainPrompt（空串 = 出厂默认，兼容旧版「直接改提示词即生效」习惯）。
// 三个系统开关（剧情预筛 / 变量自动维护 / 剧情触发）继续收口在本页。
let presetActiveKey = PRESET_DEFAULT_KEY;
// 未保存草稿：键为「${presetId}::${promptKey}」，切换预设 / 切换聊天时清理。
const presetUnsaved = {};

// ---------- 基础取值 ----------
function getPresetDefaultText(key) {
  const meta = PRESET_META[key];
  return meta && typeof meta.getDefault === 'function' ? meta.getDefault() : '';
}

// 指定 tab 在「当前激活预设」下的已存文本：内置默认预设 → 全局 settings 自定义
// 文本；自定义预设 → 预设内字段；两者为空都回退出厂默认（与生效逻辑一致）。
function getPresetSavedText(key, ctx) {
  const meta = PRESET_META[key];
  if (!meta || !ctx) return '';
  const activeId = getActivePromptPresetId(ctx);
  if (activeId !== PROMPT_PRESET_DEFAULT_ID) {
    const preset = getCustomPromptPresets(ctx).find((item) => item?.id === activeId);
    const text = String(preset?.[meta.settingsKey] ?? '').trim();
    return text || getPresetDefaultText(key);
  }
  const saved = String(getSettings(ctx)?.[meta.settingsKey] ?? '').trim();
  return saved || getPresetDefaultText(key);
}

function getPresetEditorText() {
  return String(document.getElementById(PRESET_TEXT_ID)?.value ?? '');
}

function getPresetDraftKey(key, presetId) {
  const ctx = getContextSafe();
  const id = presetId || (ctx ? getActivePromptPresetId(ctx) : PROMPT_PRESET_DEFAULT_ID);
  return `${id}::${key}`;
}

function getPresetDirty(key) {
  return presetUnsaved[getPresetDraftKey(key)] !== undefined;
}

// 当前激活预设的「所见即所得」快照：每个 tab 取草稿（无则已存文本），供另存 /
// 导出使用——用户改完不点保存也能直接另存 / 导出当前所见内容。
function buildActivePresetSnapshot(ctx) {
  const texts = {};
  for (const key of Object.keys(PRESET_META)) {
    const draft = presetUnsaved[getPresetDraftKey(key)];
    texts[key] = draft !== undefined ? draft : getPresetSavedText(key, ctx);
  }
  return {
    name: getActivePromptPresetName(ctx),
    storyGatePrompt: texts.storyGate,
    valuesMaintainPrompt: texts.valuesMaintain,
  };
}

// ---------- 渲染 ----------
function renderPresetSelector() {
  const ctx = getContextSafe();
  const select = document.getElementById(PRESET_SELECTOR_ID);
  if (!select) return;
  const activeId = ctx ? getActivePromptPresetId(ctx) : PROMPT_PRESET_DEFAULT_ID;
  const options = [{ id: PROMPT_PRESET_DEFAULT_ID, name: PROMPT_PRESET_DEFAULT_NAME }];
  for (const preset of (ctx ? getCustomPromptPresets(ctx) : [])) {
    if (!preset?.id) continue;
    options.push({ id: preset.id, name: preset.name || '未命名预设' });
  }
  select.innerHTML = '';
  for (const option of options) {
    const node = document.createElement('option');
    node.value = option.id;
    node.textContent = option.name;
    if (option.id === activeId) node.selected = true;
    select.appendChild(node);
  }
}

function updatePresetToolbar() {
  const ctx = getContextSafe();
  const deleteBtn = document.getElementById(PRESET_DELETE_ID);
  if (deleteBtn) {
    const custom = ctx ? getActivePromptPresetId(ctx) !== PROMPT_PRESET_DEFAULT_ID : false;
    deleteBtn.disabled = !custom;
    deleteBtn.title = custom ? '删除当前选中的自定义预设' : '内置默认预设不可删除';
  }
}

function updatePresetTabs() {
  document.querySelectorAll('.kaleido-preset__tab').forEach((tab) => {
    const key = tab.dataset.promptKey;
    if (!key) return;
    const active = key === presetActiveKey;
    tab.classList.toggle('is-active', active);
    tab.classList.toggle('is-dirty', getPresetDirty(key));
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function updatePresetStatus(key) {
  const ctx = getContextSafe();
  const status = document.getElementById(PRESET_STATUS_ID);
  const countNode = document.getElementById(PRESET_COUNT_ID);
  const saveBtn = document.getElementById(PRESET_SAVE_ID);
  const resetBtn = document.getElementById(PRESET_RESET_ID);
  const text = getPresetEditorText();
  const saved = getPresetSavedText(key, ctx);
  const dirty = getPresetDirty(key);
  if (status) {
    status.textContent = dirty ? '未保存的更改' : '当前预设内容';
    status.dataset.state = dirty ? 'dirty' : 'default';
  }
  if (countNode) countNode.textContent = `${text.length} 字 · ${text.split('\n').length} 行`;
  if (saveBtn) saveBtn.disabled = !dirty;
  if (resetBtn) resetBtn.disabled = !dirty && text === saved;
  updatePresetToolbar();
  updatePresetTabs();
}

function renderPresetEditor() {
  const ctx = getContextSafe();
  const textarea = document.getElementById(PRESET_TEXT_ID);
  if (!textarea) return;
  const draftKey = getPresetDraftKey(presetActiveKey);
  textarea.value = presetUnsaved[draftKey] !== undefined ? presetUnsaved[draftKey] : getPresetSavedText(presetActiveKey, ctx);
  updatePresetStatus(presetActiveKey);
}

// 预设 / 角色卡切换后的统一刷新入口。
function refreshPresetView() {
  renderPresetSelector();
  renderPresetEditor();
  refreshHomePresetStatus();
}

// 未保存草稿清理：清掉指定预设（默认全部）的所有 tab 草稿。
function clearPresetDrafts(presetId) {
  const prefix = presetId ? `${presetId}::` : '';
  for (const draftKey of Object.keys(presetUnsaved)) {
    if (!prefix || draftKey.startsWith(prefix)) delete presetUnsaved[draftKey];
  }
}

// ---------- 剧情预筛设置（自 API 连接页迁移） ----------
function renderPresetGateControl() {
  const toggle = document.getElementById(PRESET_GATE_TOGGLE_ID);
  const status = document.getElementById(PRESET_GATE_STATUS_ID);
  if (!toggle && !status) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  if (!settings) return;
  const enabled = settings.storyGateEnabled !== false;
  if (toggle) {
    toggle.textContent = enabled ? '🎬 剧情预筛：开' : '🎬 剧情预筛：关';
    toggle.classList.toggle('is-active', enabled);
    toggle.title = enabled ? '点击关闭剧情预筛' : '点击开启剧情预筛';
  }
  if (status) {
    status.textContent = enabled ? '已启用' : '未启用';
    status.dataset.state = enabled ? 'ok' : 'idle';
  }
}

function toggleStoryGate() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const settings = getSettings(ctx);
  settings.storyGateEnabled = !(settings.storyGateEnabled !== false);
  saveSettings(ctx);
  renderPresetGateControl();
  refreshHomeInjectStatus();
  logApp('info', settings.storyGateEnabled ? '剧情预筛已开启' : '剧情预筛已关闭');
  globalThis.toastr?.info?.('剧情预筛已' + (settings.storyGateEnabled ? '开启' : '关闭'), `[${MODULE_DISPLAY_NAME}]`);
}

// ---------- 变量自动维护设置（自变量工作台联动） ----------
function renderPresetValuesControl() {
  const toggle = document.getElementById(PRESET_VALUES_TOGGLE_ID);
  const status = document.getElementById(PRESET_VALUES_STATUS_ID);
  if (!toggle && !status) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  if (!settings) return;
  const enabled = settings.valuesAutoUpdateEnabled !== false;
  if (toggle) {
    toggle.textContent = enabled ? '✨ 变量自动维护：开' : '✨ 变量自动维护：关';
    toggle.classList.toggle('is-active', enabled);
    toggle.title = enabled ? '点击关闭：每轮生成结束后不再自动维护变量' : '点击开启：每轮生成结束后自动调用 AI 维护变量';
  }
  if (status) {
    status.textContent = enabled ? '已启用' : '未启用';
    status.dataset.state = enabled ? 'ok' : 'idle';
  }
}

function toggleValuesAutoUpdate() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const settings = getSettings(ctx);
  settings.valuesAutoUpdateEnabled = !(settings.valuesAutoUpdateEnabled !== false);
  saveSettings(ctx);
  renderPresetValuesControl();
  refreshHomeValuesStatus();
  logApp('info', settings.valuesAutoUpdateEnabled ? '变量自动维护已开启' : '变量自动维护已关闭');
  globalThis.toastr?.info?.('变量自动维护已' + (settings.valuesAutoUpdateEnabled ? '开启' : '关闭'), `[${MODULE_DISPLAY_NAME}]`);
}

// ---------- 剧情触发设置（与变量工作台联动） ----------
function renderPresetTriggerControl() {
  const toggle = document.getElementById(PRESET_TRIGGER_TOGGLE_ID);
  const status = document.getElementById(PRESET_TRIGGER_STATUS_ID);
  if (!toggle && !status) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  if (!settings) return;
  const enabled = settings.valuesTriggerEnabled !== false;
  if (toggle) {
    toggle.textContent = enabled ? '⚡ 剧情触发：开' : '⚡ 剧情触发：关';
    toggle.classList.toggle('is-active', enabled);
    toggle.title = enabled ? '点击关闭：发送前不再按变量条件触发剧情事件' : '点击开启：发送前按变量条件确定性触发剧情事件';
  }
  if (status) {
    status.textContent = enabled ? '已启用' : '未启用';
    status.dataset.state = enabled ? 'ok' : 'idle';
  }
}

function toggleValuesTrigger() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const settings = getSettings(ctx);
  settings.valuesTriggerEnabled = !(settings.valuesTriggerEnabled !== false);
  saveSettings(ctx);
  renderPresetTriggerControl();
  refreshHomeValuesStatus();
  logApp('info', settings.valuesTriggerEnabled ? '剧情触发已开启' : '剧情触发已关闭');
  globalThis.toastr?.info?.('剧情触发已' + (settings.valuesTriggerEnabled ? '开启' : '关闭'), `[${MODULE_DISPLAY_NAME}]`);
}

// ---------- 首页「预设模版」卡片状态：当前生效的预设名 ----------
function refreshHomePresetStatus() {
  const status = document.getElementById(HOME_PRESET_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const name = ctx ? getActivePromptPresetName(ctx) : PROMPT_PRESET_DEFAULT_NAME;
    const custom = ctx ? getActivePromptPresetId(ctx) !== PROMPT_PRESET_DEFAULT_ID : false;
    status.textContent = `当前：${name}`;
    status.dataset.state = custom ? 'ok' : 'idle';
  } catch (error) {
    status.textContent = `当前：${PROMPT_PRESET_DEFAULT_NAME}`;
    status.dataset.state = 'idle';
  }
}

// ---------- 保存 / 恢复默认（针对当前 tab） ----------
// 保存当前 tab 的编辑内容到激活预设：内置默认预设 → 写全局 settings（既有的
// 「直接修改即生效」）；自定义预设 → 写预设内字段。两条路径都在数据层收口。
function savePreset(key) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const meta = PRESET_META[key];
  if (!meta) return;
  const text = getPresetEditorText();
  savePromptPresetText(ctx, key, text);
  delete presetUnsaved[getPresetDraftKey(key)];
  updatePresetStatus(key);
  refreshHomePresetStatus();
  logApp('info', '预设已保存', `${getActivePromptPresetName(ctx)} · ${meta.title}`);
  globalThis.toastr?.success?.(`「${meta.title}」已保存到「${getActivePromptPresetName(ctx)}」`, `[${MODULE_DISPLAY_NAME}]`);
}

// 恢复出厂默认：当前 tab 在激活预设中清空自定义（空串 = 回退出厂默认文本）。
async function resetPreset(key) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const meta = PRESET_META[key];
  if (!meta) return;
  const dirty = getPresetDirty(key);
  const text = getPresetEditorText();
  if (dirty || text !== getPresetDefaultText(key)) {
    const what = dirty ? '未保存的修改' : '已保存的自定义内容';
    if (!(await kaleidoConfirm(`将「${meta.title}」恢复为出厂默认内容？当前${what}将被覆盖。`))) return;
  }
  document.getElementById(PRESET_TEXT_ID).value = getPresetDefaultText(key);
  savePromptPresetText(ctx, key, '');
  delete presetUnsaved[getPresetDraftKey(key)];
  renderPresetEditor();
  refreshHomePresetStatus();
  logApp('info', '已恢复出厂默认', meta.title);
  globalThis.toastr?.info?.(`「${meta.title}」已恢复出厂默认`, `[${MODULE_DISPLAY_NAME}]`);
}

// ---------- 预设管理：切换 / 另存 / 删除 ----------
async function handlePresetSelectChange(target) {
  const ctx = getContextSafe();
  if (!ctx || !target) return;
  const nextId = String(target.value || PROMPT_PRESET_DEFAULT_ID);
  const previousId = getActivePromptPresetId(ctx);
  if (nextId === previousId) return;
  // 旧预设存在未保存修改时征询：切走后草稿会被清理。
  const dirtyKeys = Object.keys(presetUnsaved).filter((draftKey) => draftKey.startsWith(`${previousId}::`));
  if (dirtyKeys.length > 0) {
    if (!(await kaleidoConfirm('当前预设还有未保存的修改，切换预设将丢弃这些修改。继续切换？'))) {
      target.value = previousId;
      return;
    }
    clearPresetDrafts(previousId);
  }
  setActivePromptPreset(ctx, nextId);
  refreshPresetView();
  logApp('info', '已切换提示词预设', getActivePromptPresetName(ctx));
  globalThis.toastr?.success?.(`已切换到「${getActivePromptPresetName(ctx)}」`, `[${MODULE_DISPLAY_NAME}]`);
}

// 另存为预设：把当前两组提示词的所见内容（含未保存草稿）保存为一个新具名预设，
// 保存后自动激活。
async function savePresetAs() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const snapshot = buildActivePresetSnapshot(ctx);
  const suggestedBase = getActivePromptPresetId(ctx) === PROMPT_PRESET_DEFAULT_ID
    ? '我的预设'
    : `${getActivePromptPresetName(ctx)} 副本`;
  const name = await kaleidoPrompt('为新预设命名（同时包含剧情预筛与变量维护两组提示词）：', suggestedName(suggestedBase));
  if (!name) return;
  try {
    const preset = createPromptPreset(ctx, name, {
      storyGatePrompt: snapshot.storyGatePrompt,
      valuesMaintainPrompt: snapshot.valuesMaintainPrompt,
    });
    // 当前编辑状态已被完整捕获为新预设，清掉旧预设的遗留草稿。
    clearPresetDrafts();
    renderPresetSelector();
    updatePresetToolbar();
    renderPresetEditor();
    refreshHomePresetStatus();
    logApp('info', '已另存为预设', preset.name);
    globalThis.toastr?.success?.(`预设「${preset.name}」已保存并激活`, `[${MODULE_DISPLAY_NAME}]`);
  } catch (error) {
    globalThis.toastr?.error?.(String(error?.message || error), `[${MODULE_DISPLAY_NAME}]`);
  }
}

// 另存默认名称：默认预设建议「我的预设」，已有同名时顺延编号。
function suggestedName(base) {
  return String(base || '我的预设').slice(0, 30);
}

async function deleteActivePreset() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const activeId = getActivePromptPresetId(ctx);
  if (activeId === PROMPT_PRESET_DEFAULT_ID) {
    globalThis.toastr?.info?.('内置默认预设不可删除', `[${MODULE_DISPLAY_NAME}]`);
    return;
  }
  const name = getActivePromptPresetName(ctx);
  if (!(await kaleidoConfirm(`删除预设「${name}」？该预设保存的两组提示词将一并删除，且不可恢复。`))) return;
  const deleted = deletePromptPreset(ctx, activeId);
  if (!deleted) {
    globalThis.toastr?.error?.('预设删除失败：未找到该预设', `[${MODULE_DISPLAY_NAME}]`);
    return;
  }
  clearPresetDrafts(activeId === PROMPT_PRESET_DEFAULT_ID ? '' : activeId);
  renderPresetSelector();
  renderPresetEditor();
  refreshHomePresetStatus();
  logApp('info', '提示词预设已删除', name);
  globalThis.toastr?.info?.(`预设「${name}」已删除，已切回默认预设`, `[${MODULE_DISPLAY_NAME}]`);
}

// ---------- 导入 / 导出 ----------
// 导出当前选中的完整预设（名称 + 两组提示词，含未保存草稿的所见内容）。
function exportActivePreset() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const preset = buildActivePresetSnapshot(ctx);
  try {
    const yaml = serializePromptPresetBundle(preset);
    downloadTextFile(buildPromptPresetBundleFilename(preset), yaml);
    logApp('info', '提示词预设已导出', preset.name);
  } catch (error) {
    globalThis.toastr?.error?.(`导出失败：${String(error?.message || error)}`, `[${MODULE_DISPLAY_NAME}]`);
  }
}

async function handlePresetImportFile(file) {
  const ctx = getContextSafe();
  if (!ctx || !file) return;
  try {
    const text = await readTextFile(file);
    const parsed = parsePromptPresetBundle(text);
    const preset = importPromptPreset(ctx, parsed);
    clearPresetDrafts();
    renderPresetSelector();
    renderPresetEditor();
    updatePresetToolbar();
    refreshHomePresetStatus();
    logApp('info', '提示词预设已导入', preset.name);
    globalThis.toastr?.success?.(`预设「${preset.name}」已导入并激活`, `[${MODULE_DISPLAY_NAME}]`);
  } catch (error) {
    const message = String(error?.message || error);
    logApp('warn', '提示词预设导入失败', message);
    globalThis.toastr?.error?.(`导入失败：${message}`, `[${MODULE_DISPLAY_NAME}]`);
  }
}

// 切换聊天 / 角色卡后刷新（main.js 的 chatChanged 订阅入口）：预设列表与激活
// 预设随角色卡走，编辑器 / 选择器 / 首页状态统一重渲染。
function onPresetChatChanged() {
  refreshPresetView();
  updatePresetToolbar();
}

// ---------- 事件绑定 ----------
function initPresetSection(panel) {
  if (!panel || panel.dataset.presetReady === 'true') return;

  document.getElementById(PRESET_TABS_ID)?.addEventListener('click', (event) => {
    const tab = event.target.closest('.kaleido-preset__tab');
    if (!tab || !tab.dataset.promptKey) return;
    presetActiveKey = tab.dataset.promptKey;
    renderPresetEditor();
  });

  document.getElementById(PRESET_TEXT_ID)?.addEventListener('input', () => {
    const ctx = getContextSafe();
    const text = getPresetEditorText();
    const draftKey = getPresetDraftKey(presetActiveKey);
    if (ctx && text === getPresetSavedText(presetActiveKey, ctx)) delete presetUnsaved[draftKey];
    else presetUnsaved[draftKey] = text;
    updatePresetStatus(presetActiveKey);
  });

  document.getElementById(PRESET_SAVE_ID)?.addEventListener('click', () => savePreset(presetActiveKey));
  document.getElementById(PRESET_RESET_ID)?.addEventListener('click', () => resetPreset(presetActiveKey));

  // 预设选择工具栏。
  document.getElementById(PRESET_SELECTOR_ID)?.addEventListener('change', (event) => {
    handlePresetSelectChange(event.target);
  });
  document.getElementById(PRESET_SAVE_AS_ID)?.addEventListener('click', () => savePresetAs());
  document.getElementById(PRESET_DELETE_ID)?.addEventListener('click', () => deleteActivePreset());
  document.getElementById(PRESET_EXPORT_ID)?.addEventListener('click', () => exportActivePreset());
  document.getElementById(PRESET_IMPORT_BTN_ID)?.addEventListener('click', () => {
    document.getElementById(PRESET_IMPORT_INPUT_ID)?.click();
  });
  document.getElementById(PRESET_IMPORT_INPUT_ID)?.addEventListener('change', async (event) => {
    const file = event.target?.files?.[0];
    if (file) await handlePresetImportFile(file);
    event.target.value = '';
  });

  document.getElementById(PRESET_GATE_TOGGLE_ID)?.addEventListener('click', toggleStoryGate);
  document.getElementById(PRESET_VALUES_TOGGLE_ID)?.addEventListener('click', toggleValuesAutoUpdate);
  document.getElementById(PRESET_TRIGGER_TOGGLE_ID)?.addEventListener('click', toggleValuesTrigger);

  renderPresetSelector();
  renderPresetEditor();
  renderPresetGateControl();
  renderPresetValuesControl();
  renderPresetTriggerControl();
  refreshHomePresetStatus();
  panel.dataset.presetReady = 'true';
  logApp('info', '预设模版已就绪');
}