// ===== 万华镜（Kaleidoscope）提示词预设：数据模型 / 角色卡绑定 / YAML 导入导出 =====
// 核心概念：一个预设 = 一套完整的「剧情预筛 + 变量维护」提示词配置
// （{ id, name, storyGatePrompt, valuesMaintainPrompt }）。预设负责管理和切换
// 整套提示词，而不是分别管理两个提示词组。
//
// 存储与剧情脉络同模式：自定义预设列表存角色卡
// character.data.extensions.kaleidoscope_prompt_presets，随角色卡导入/导出自动
// 携带；群聊 / 未选角色 / 宿主不支持写卡时回退全局设置
//（settings.promptPresets / promptPresetsActiveId）。
//
// 内置「默认预设」是兜底配置，永不落盘：激活内置默认预设时提示词取全局
// settings 的 storyGatePrompt / valuesMaintainPrompt（空串 = 出厂默认，兼容
// 旧版「直接改提示词即生效」与旧自定义数据）；激活自定义预设时取预设内文本
//（空串同样回退出厂默认）。

function promptPresetGenId() {
  const rand = Math.random().toString(36).slice(2, 8);
  return `kaleido-preset-${Date.now().toString(36)}-${rand}`;
}

// 归一化一个预设对象：补 id / name / 两组提示词字段（非字符串一律按空串处理）。
function normalizePromptPreset(preset) {
  const source = preset && typeof preset === 'object' && !Array.isArray(preset) ? preset : {};
  return {
    id: String(source.id || '').trim() || promptPresetGenId(),
    name: String(source.name ?? '').trim(),
    storyGatePrompt: String(source.storyGatePrompt ?? ''),
    valuesMaintainPrompt: String(source.valuesMaintainPrompt ?? ''),
  };
}

function isPromptPresetEntryValid(entry) {
  return Boolean(entry) && typeof entry === 'object' && !Array.isArray(entry)
    && String(entry.name ?? '').trim() !== ''
    && 'storyGatePrompt' in entry && 'valuesMaintainPrompt' in entry;
}

// ---------- 角色卡绑定 ----------
// 读当前角色卡上的预设容器（无角色 / 卡上无数据返回 null）。返回前就地归一化
// presets 数组与 activeId，保证后续读写始终落在合法结构上。
function getPromptPresetCardData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character) return null;
  const extensions = character?.data?.extensions;
  if (!extensions || typeof extensions !== 'object') return null;
  const card = extensions[PROMPT_PRESET_CARD_EXTENSION_KEY];
  if (!card || typeof card !== 'object' || Array.isArray(card)) return null;
  if (!Array.isArray(card.presets)) card.presets = [];
  if (typeof card.activeId !== 'string' || !card.activeId) card.activeId = PROMPT_PRESET_DEFAULT_ID;
  return card;
}

// 把预设数据写入角色卡对象（内存态，持久化由调用方完成）。
function setPromptPresetCardData(character, card) {
  if (!character || typeof character !== 'object') return;
  if (!character.data || typeof character.data !== 'object') character.data = {};
  if (!character.data.extensions || typeof character.data.extensions !== 'object') character.data.extensions = {};
  character.data.extensions[PROMPT_PRESET_CARD_EXTENSION_KEY] = card;
}

// 写卡失败 / 角色已删除 / 宿主不支持时的兜底：预设列表落回全局设置，避免丢失。
function fallbackPromptPresetsToSettings(ctx, card) {
  const settings = getSettings(ctx);
  settings.promptPresets = Array.isArray(card?.presets) ? card.presets : [];
  settings.promptPresetsActiveId = typeof card?.activeId === 'string' && card.activeId
    ? card.activeId
    : PROMPT_PRESET_DEFAULT_ID;
  saveSettingsImmediate(ctx);
  logApp('warn', '提示词预设写入角色卡失败，已回退全局设置');
}

// 立即写卡：按 avatar 重新定位角色（防切换角色写错卡），失败回退全局设置。
// 与剧情脉络同款：不做防抖，防抖窗口内退出会丢数据（TauriTavern 实测）。
function savePromptPresetCardNow(ctx, character, card) {
  const avatar = String(character?.avatar || '');
  persistPromptPresetCardData(ctx, avatar, card).catch((error) => {
    logApp('warn', '提示词预设写入角色卡失败', String(error?.message || error));
  });
}

async function persistPromptPresetCardData(ctx, avatar, card) {
  const characters = Array.isArray(ctx?.characters) ? ctx.characters : [];
  const index = characters.findIndex((item) => String(item?.avatar || '') === avatar);
  if (index < 0) {
    fallbackPromptPresetsToSettings(ctx, card);
    return;
  }
  const write = ctx?.writeExtensionField;
  if (typeof write !== 'function') {
    fallbackPromptPresetsToSettings(ctx, card);
    return;
  }
  try {
    await write.call(ctx, index, PROMPT_PRESET_CARD_EXTENSION_KEY, card);
  } catch (error) {
    fallbackPromptPresetsToSettings(ctx, card);
    throw error;
  }
}

// 统一保存入口：有角色且宿主支持写卡 → 确保卡上容器存在后立即落盘；否则写全局设置。
function savePromptPresetData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character || typeof ctx?.writeExtensionField !== 'function') {
    saveSettingsImmediate(ctx);
    return;
  }
  let card = getPromptPresetCardData(ctx);
  if (!card) {
    card = { version: PROMPT_PRESET_CARD_DATA_VERSION, presets: [], activeId: PROMPT_PRESET_DEFAULT_ID };
    setPromptPresetCardData(character, card);
  }
  savePromptPresetCardNow(ctx, character, card);
}

// ---------- 读取 ----------
// 自定义预设列表：优先角色卡；无角色 / 宿主不支持时回退全局设置。有角色但卡上
// 无数据时返回空数组（不回退全局，防止把别的角色 / 旧全局数据串到当前卡上）。
function getCustomPromptPresets(ctx) {
  const card = ctx ? getPromptPresetCardData(ctx) : null;
  if (card) return card.presets;
  if (ctx && getStoryCharacter(ctx) && typeof ctx?.writeExtensionField === 'function') return [];
  const settings = ctx ? getSettings(ctx) : null;
  return Array.isArray(settings?.promptPresets) ? settings.promptPresets : [];
}

// 当前激活预设 id：优先角色卡，同上回退全局设置（默认内置 id）。
function getActivePromptPresetId(ctx) {
  const card = ctx ? getPromptPresetCardData(ctx) : null;
  if (card) return card.activeId;
  if (ctx && getStoryCharacter(ctx) && typeof ctx?.writeExtensionField === 'function') {
    return PROMPT_PRESET_DEFAULT_ID;
  }
  const settings = ctx ? getSettings(ctx) : null;
  const activeId = String(settings?.promptPresetsActiveId || '').trim();
  return activeId || PROMPT_PRESET_DEFAULT_ID;
}

// 内置「默认预设」的运行时表示：不落盘，内容实时读取（默认提示词常量或全局
// settings 自定义文本），保证「默认预设 + 直接修改保存」的既有用法始终生效。
function buildBuiltinDefaultPromptPreset(ctx) {
  const settings = ctx ? getSettings(ctx) : null;
  return {
    id: PROMPT_PRESET_DEFAULT_ID,
    name: PROMPT_PRESET_DEFAULT_NAME,
    storyGatePrompt: String(settings?.storyGatePrompt ?? ''),
    valuesMaintainPrompt: String(settings?.valuesMaintainPrompt ?? ''),
  };
}

// 按预设 key（PRESET_META 的 storyGate / valuesMaintain）取预设内文本。
function getPromptPresetText(preset, key) {
  const text = preset ? preset[PRESET_META[key]?.settingsKey] : '';
  return String(text ?? '');
}

// 出厂默认文本（DEFAULT_STORY_GATE_PROMPT / DEFAULT_VALUES_MAINTAIN_PROMPT）。
function getPromptPresetFactoryText(key) {
  const meta = PRESET_META[key];
  return meta && typeof meta.getDefault === 'function' ? meta.getDefault() : '';
}

// 激活预设的展示名（下拉框 / 首页状态用）。
function getActivePromptPresetName(ctx) {
  const activeId = getActivePromptPresetId(ctx);
  if (activeId === PROMPT_PRESET_DEFAULT_ID) return PROMPT_PRESET_DEFAULT_NAME;
  const preset = getCustomPromptPresets(ctx).find((item) => item.id === activeId);
  return preset ? preset.name : PROMPT_PRESET_DEFAULT_NAME;
}

// 解析出当前激活的完整预设（含内置默认）；激活 id 失效（预设被删 / 数据损坏）
// 时回退内置默认。
function resolveActivePromptPreset(ctx) {
  const activeId = getActivePromptPresetId(ctx);
  if (activeId !== PROMPT_PRESET_DEFAULT_ID) {
    const preset = getCustomPromptPresets(ctx).find((item) => item.id === activeId);
    if (preset) return preset;
  }
  return buildBuiltinDefaultPromptPreset(ctx);
}

// 生效提示词：底层注入（剧情预筛 / 变量维护）统一从这里取文本——
// 激活自定义预设 → 该预设内文本，空串回退出厂默认；
// 激活内置默认 → 全局 settings 的自定义文本（空串 = 出厂默认，旧数据兼容）。
function getEffectivePromptText(ctx, key) {
  const preset = resolveActivePromptPreset(ctx);
  const text = String(getPromptPresetText(preset, key) ?? '').trim();
  return text || getPromptPresetFactoryText(key);
}

// ---------- 写入 ----------
// 把编辑器里的当前 tab 文本保存进激活预设。内置默认预设不可覆盖 → 写全局
// settings（既有的「直接修改即生效」），自定义预设 → 写预设内字段。
function savePromptPresetText(ctx, key, text) {
  const meta = PRESET_META[key];
  if (!meta) return;
  const activeId = getActivePromptPresetId(ctx);
  if (activeId === PROMPT_PRESET_DEFAULT_ID) {
    const settings = getSettings(ctx);
    settings[meta.settingsKey] = String(text ?? '');
    saveSettingsImmediate(ctx);
    return;
  }
  // 角色卡路径：改激活预设的内嵌字段并立即写卡。
  const character = getStoryCharacter(ctx);
  const card = ensurePromptPresetCardData(ctx);
  if (card) {
    const preset = card.presets.find((item) => item.id === activeId);
    if (preset) {
      preset[meta.settingsKey] = String(text ?? '');
      savePromptPresetCardNow(ctx, character, card);
    }
    return;
  }
  // 全局兜底路径：改 settings 里的预设列表（无角色卡可写时）。
  const settings = getSettings(ctx);
  const fallbackPresets = Array.isArray(settings.promptPresets) ? settings.promptPresets : [];
  const fallbackPreset = fallbackPresets.find((item) => item.id === activeId);
  if (fallbackPreset) {
    fallbackPreset[meta.settingsKey] = String(text ?? '');
    settings.promptPresets = fallbackPresets;
    saveSettingsImmediate(ctx);
  }
}

// 确保当前角色卡有预设容器（首次写卡才创建，不自动迁移旧数据）。无角色 /
// 宿主不支持写卡时返回 null（走全局设置路径）。
function ensurePromptPresetCardData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character || typeof ctx?.writeExtensionField !== 'function') return null;
  let card = getPromptPresetCardData(ctx);
  if (!card) {
    card = { version: PROMPT_PRESET_CARD_DATA_VERSION, presets: [], activeId: PROMPT_PRESET_DEFAULT_ID };
    setPromptPresetCardData(character, card);
  }
  return card;
}

// 另存为新预设：写入当前角色卡（或全局兜底），成功后返回新预设对象。
function createPromptPreset(ctx, name, texts) {
  const cleanName = String(name ?? '').trim();
  if (!cleanName) throw new Error('预设名称不能为空');
  const preset = normalizePromptPreset({
    name: cleanName,
    storyGatePrompt: String(texts?.storyGatePrompt ?? ''),
    valuesMaintainPrompt: String(texts?.valuesMaintainPrompt ?? ''),
  });
  const settings = getSettings(ctx);
  const character = getStoryCharacter(ctx);
  if (character && typeof ctx?.writeExtensionField === 'function') {
    const card = ensurePromptPresetCardData(ctx);
    card.presets = Array.isArray(card.presets) ? card.presets : [];
    card.presets.push(preset);
    card.activeId = preset.id;
    savePromptPresetCardNow(ctx, character, card);
  } else {
    const presets = Array.isArray(settings.promptPresets) ? settings.promptPresets : [];
    presets.push(cloneValue(preset));
    settings.promptPresets = presets;
    settings.promptPresetsActiveId = preset.id;
    savePromptPresetData(ctx);
  }
  return preset;
}

// 删除自定义预设；删除的是当前激活预设时回退内置默认。内置默认不可删除。
function deletePromptPreset(ctx, presetId) {
  const targetId = String(presetId || '').trim();
  if (!targetId || targetId === PROMPT_PRESET_DEFAULT_ID) return false;
  const card = getPromptPresetCardData(ctx);
  if (card) {
    const before = card.presets.length;
    card.presets = card.presets.filter((item) => item?.id !== targetId);
    if (card.presets.length === before) return false;
    if (card.activeId === targetId) card.activeId = PROMPT_PRESET_DEFAULT_ID;
    savePromptPresetCardNow(ctx, getStoryCharacter(ctx), card);
    return true;
  }
  const settings = getSettings(ctx);
  const presets = Array.isArray(settings.promptPresets) ? settings.promptPresets : [];
  const before = presets.length;
  settings.promptPresets = presets.filter((item) => item?.id !== targetId);
  if (settings.promptPresets.length === before) return false;
  if (String(settings.promptPresetsActiveId || '') === targetId) {
    settings.promptPresetsActiveId = PROMPT_PRESET_DEFAULT_ID;
  }
  savePromptPresetData(ctx);
  return true;
}

// 切换激活预设。切换只改 activeId，不复制文本——预设各自持有完整内容。
function setActivePromptPreset(ctx, presetId) {
  const targetId = String(presetId || '').trim() || PROMPT_PRESET_DEFAULT_ID;
  if (targetId !== PROMPT_PRESET_DEFAULT_ID) {
    const exists = getCustomPromptPresets(ctx).some((item) => item?.id === targetId);
    if (!exists) targetId = PROMPT_PRESET_DEFAULT_ID;
  }
  const card = ensurePromptPresetCardData(ctx);
  if (card) {
    card.activeId = targetId;
    savePromptPresetCardNow(ctx, getStoryCharacter(ctx), card);
    return;
  }
  const settings = getSettings(ctx);
  settings.promptPresetsActiveId = targetId;
  savePromptPresetData(ctx);
}

// ---------- YAML 导入导出 ----------
// 导出当前选中的完整预设（名称 + 两组提示词），自描述头凭 format 标记识别。
function serializePromptPresetBundle(preset) {
  const lines = [];
  lines.push('# 万华镜（Kaleidoscope）提示词预设导出');
  lines.push('# 在「预设模版 → 导入预设」中可重新导入：一个预设 = 剧情预筛 + 变量维护 的一套完整配置。');
  lines.push(`format: ${PROMPT_PRESET_BUNDLE_FORMAT}`);
  lines.push(`version: ${PROMPT_PRESET_BUNDLE_VERSION}`);
  lines.push(`name: ${yamlScalar(String(preset?.name ?? '').trim())}`);
  lines.push(`storyGatePrompt: ${yamlBlockScalarText(preset?.storyGatePrompt ?? '', '  ')}`);
  lines.push(`valuesMaintainPrompt: ${yamlBlockScalarText(preset?.valuesMaintainPrompt ?? '', '  ')}`);
  return `${lines.join('\n')}\n`;
}

function buildPromptPresetBundleFilename(preset) {
  const name = sanitizeStoryFilename(String(preset?.name ?? '').trim() || '未命名预设');
  return `${PROMPT_PRESET_BUNDLE_FILENAME_PREFIX}-${name}.yaml`;
}

// 解析导入的预设文件：校验 format 标记与必填字段（name 必填，两组提示词字段
// 必须存在、允许空串 = 导入后使用出厂默认）。
function parsePromptPresetBundle(text) {
  const data = parseYamlSubset(String(text ?? ''));
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('预设文件格式不正确：顶层必须是 YAML 映射');
  }
  const format = String(data.format ?? '').trim();
  if (format !== PROMPT_PRESET_BUNDLE_FORMAT) {
    throw new Error(`预设文件 format 标记不匹配：期望 ${PROMPT_PRESET_BUNDLE_FORMAT}，实际「${format || '（缺失）'}」`);
  }
  const name = String(data.name ?? '').trim();
  if (!name) throw new Error('预设文件缺少 name 字段');
  if (typeof data.storyGatePrompt !== 'string' || typeof data.valuesMaintainPrompt !== 'string') {
    throw new Error('预设文件必须同时包含 storyGatePrompt 与 valuesMaintainPrompt 两组提示词（可为空串）');
  }
  return {
    name,
    storyGatePrompt: data.storyGatePrompt,
    valuesMaintainPrompt: data.valuesMaintainPrompt,
  };
}

// 导入预设：写入当前角色卡（或全局兜底）、激活，并返回新预设。同名预设不覆盖，
// 自动追加「(2)」「(3)」后缀去重。
function importPromptPreset(ctx, parsed) {
  const settings = getSettings(ctx);
  const existing = getCustomPromptPresets(ctx);
  let name = parsed.name;
  let suffix = 2;
  while (existing.some((item) => item?.name === name)) {
    name = `${parsed.name}(${suffix})`;
    suffix += 1;
  }
  return createPromptPreset(ctx, name, parsed);
}