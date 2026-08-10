// ===== 万华镜（Kaleidoscope）预设模版：默认提示词编辑 =====
// 参考 SoulLink 的预设系统：标签页切换各子系统提示词，改完点「保存」，
// 「恢复默认」还原出厂内容。存储沿用各提示词在 settings 中的既有字段
// （空字符串 = 使用内置默认），与 API 连接页的提示词编辑区保持同一数据源。
let presetActiveKey = PRESET_DEFAULT_KEY;
const presetUnsaved = {};

function getPresetDefaultText(key) {
  const meta = PRESET_META[key];
  return meta && typeof meta.getDefault === 'function' ? meta.getDefault() : '';
}

function getPresetSavedText(key, ctx) {
  const meta = PRESET_META[key];
  if (!meta) return '';
  const settings = ctx ? getSettings(ctx) : null;
  const saved = settings ? String(settings[meta.settingsKey] || '') : '';
  return saved || getPresetDefaultText(key);
}

function getPresetEditorText() {
  return String(document.getElementById(PRESET_TEXT_ID)?.value ?? '');
}

function getPresetDirty(key) {
  return presetUnsaved[key] !== undefined;
}

function updatePresetTabs() {
  document.querySelectorAll('.kaleido-preset__tab').forEach((tab) => {
    const key = tab.dataset.promptKey;
    const active = key === presetActiveKey;
    tab.classList.toggle('is-active', active);
    tab.classList.toggle('is-dirty', getPresetDirty(key));
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function updatePresetStatus(key) {
  const status = document.getElementById(PRESET_STATUS_ID);
  const countNode = document.getElementById(PRESET_COUNT_ID);
  const saveBtn = document.getElementById(PRESET_SAVE_ID);
  const resetBtn = document.getElementById(PRESET_RESET_ID);
  const text = getPresetEditorText();
  const dirty = getPresetDirty(key);
  if (status) {
    status.textContent = dirty ? '未保存的更改' : (text === getPresetDefaultText(key) ? '默认内容' : '已保存的自定义内容');
    status.dataset.state = dirty ? 'dirty' : (text === getPresetDefaultText(key) ? 'default' : 'custom');
  }
  if (countNode) countNode.textContent = `${text.length} 字 · ${text.split('\n').length} 行`;
  if (saveBtn) saveBtn.disabled = !dirty;
  if (resetBtn) resetBtn.disabled = !dirty && text === getPresetDefaultText(key);
  updatePresetTabs();
}

function renderPresetEditor() {
  const ctx = getContextSafe();
  const textarea = document.getElementById(PRESET_TEXT_ID);
  if (!textarea) return;
  textarea.value = presetUnsaved[presetActiveKey] !== undefined ? presetUnsaved[presetActiveKey] : getPresetSavedText(presetActiveKey, ctx);
  updatePresetStatus(presetActiveKey);
}

// 首页「预设模版」卡片状态：已自定义的提示词份数。
function refreshHomePresetStatus() {
  const status = document.getElementById(HOME_PRESET_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    let customized = 0;
    for (const key of Object.keys(PRESET_META)) {
      const meta = PRESET_META[key];
      const saved = settings ? String(settings[meta.settingsKey] || '') : '';
      if (saved && saved !== getPresetDefaultText(key)) customized += 1;
    }
    status.textContent = customized > 0 ? `已自定义 ${customized} 份` : '默认配置';
    status.dataset.state = customized > 0 ? 'ok' : 'idle';
  } catch (error) {
    status.textContent = '默认配置';
    status.dataset.state = 'idle';
  }
}

function savePreset(key) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const meta = PRESET_META[key];
  if (!meta) return;
  const settings = getSettings(ctx);
  settings[meta.settingsKey] = getPresetEditorText();
  saveSettingsImmediate(ctx);
  delete presetUnsaved[key];
  updatePresetStatus(key);
  refreshHomePresetStatus();
  logApp('info', '预设已保存', meta.title);
  globalThis.toastr?.success?.(`${meta.title} 已保存`, `[${MODULE_DISPLAY_NAME}]`);
}

async function resetPreset(key) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const meta = PRESET_META[key];
  if (!meta) return;
  const dirty = getPresetDirty(key);
  const text = getPresetEditorText();
  if (dirty || text !== getPresetDefaultText(key)) {
    const what = dirty ? '未保存的修改' : '已保存的自定义内容';
    const confirmed = globalThis.confirm?.(`将「${meta.title}」恢复为默认内容？当前${what}将被默认内容覆盖。`);
    if (!confirmed) return;
  }
  const textarea = document.getElementById(PRESET_TEXT_ID);
  if (textarea) textarea.value = getPresetDefaultText(key);
  const settings = getSettings(ctx);
  settings[meta.settingsKey] = '';
  saveSettingsImmediate(ctx);
  delete presetUnsaved[key];
  updatePresetStatus(key);
  refreshHomePresetStatus();
  logApp('info', '预设已恢复默认', meta.title);
  globalThis.toastr?.info?.(`${meta.title} 已恢复默认`, `[${MODULE_DISPLAY_NAME}]`);
}

function initPresetSection(panel) {
  if (!panel || panel.dataset.presetReady === 'true') return;
  const getCtx = () => getContextSafe();

  document.getElementById(PRESET_TABS_ID)?.addEventListener('click', (event) => {
    const tab = event.target.closest('.kaleido-preset__tab');
    if (!tab || !tab.dataset.promptKey) return;
    presetActiveKey = tab.dataset.promptKey;
    renderPresetEditor();
  });

  document.getElementById(PRESET_TEXT_ID)?.addEventListener('input', () => {
    const ctx = getCtx();
    const text = getPresetEditorText();
    if (text === getPresetSavedText(presetActiveKey, ctx)) delete presetUnsaved[presetActiveKey];
    else presetUnsaved[presetActiveKey] = text;
    updatePresetStatus(presetActiveKey);
  });

  document.getElementById(PRESET_SAVE_ID)?.addEventListener('click', () => savePreset(presetActiveKey));
  document.getElementById(PRESET_RESET_ID)?.addEventListener('click', () => resetPreset(presetActiveKey));

  renderPresetEditor();
  refreshHomePresetStatus();
  panel.dataset.presetReady = 'true';
  logApp('info', '预设模版已就绪');
}
