// ===== 万华镜（Kaleidoscope）变量系统：数据模型 / 双层存储 / YAML 导入导出 =====
// 数据模型：
// - 键注册表（keys）：玩家统一注册的键，每个键带「变化规则」，是 AI 自动维护的唯一依据。
// - 默认值（defaults）：与角色卡绑定（character.data.extensions.kaleidoscope_values），
//   随角色卡导入/导出自动携带；群聊 / 未选角色时回退全局设置 valuesData。
// - 游戏值（game values）：与聊天文件绑定（chatMetadata.kaleidoscope_values，jsonl 首行
//   chat_metadata 随聊天文件保存/加载），是每轮生成结束后由 AI 维护的实际变量。
// 变量树是 YAML 式结构：映射可嵌套（如「张三 → 好感」），叶子是标量。

// ---------- 键注册表 / 默认值：角色卡绑定 ----------
// 当前角色卡里的变量包（无角色 / 卡上无数据时返回 null）；返回前就地归一化。
function getValuesCardData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character) return null;
  const extensions = character?.data?.extensions;
  if (!extensions || typeof extensions !== 'object') return null;
  const card = extensions[VALUES_CARD_EXTENSION_KEY];
  if (!card || typeof card !== 'object' || Array.isArray(card)) return null;
  if (!Array.isArray(card.keys)) card.keys = [];
  if (!card.defaults || typeof card.defaults !== 'object' || Array.isArray(card.defaults)) card.defaults = {};
  return card;
}

// 把变量包写入角色卡对象（内存态，持久化由 scheduleValuesCardSave 完成）。
function setValuesCardData(character, card) {
  if (!character || typeof character !== 'object') return;
  if (!character.data || typeof character.data !== 'object') character.data = {};
  if (!character.data.extensions || typeof character.data.extensions !== 'object') character.data.extensions = {};
  character.data.extensions[VALUES_CARD_EXTENSION_KEY] = card;
}

// 确保当前角色卡有变量数据容器：无卡时用旧版全局数据初始化（并清空全局兜底）。
// 无角色 / 宿主不支持写角色卡时返回 null（保持全局设置路径）。
function ensureValuesCardData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character || typeof ctx?.writeExtensionField !== 'function') return null;
  let card = getValuesCardData(ctx);
  if (card) return card;
  const settings = getSettings(ctx);
  const legacy = settings?.valuesData;
  card = {
    version: VALUES_CARD_DATA_VERSION,
    keys: Array.isArray(legacy?.keys) ? legacy.keys : [],
    defaults: legacy?.defaults && typeof legacy.defaults === 'object' && !Array.isArray(legacy.defaults)
      ? legacy.defaults
      : {},
    inject: legacy?.inject && typeof legacy.inject === 'object' && !Array.isArray(legacy.inject)
      ? legacy.inject
      : { enabled: false, paths: [] },
    triggers: Array.isArray(legacy?.triggers) ? legacy.triggers : [],
    order: legacy?.order && typeof legacy.order === 'object' && !Array.isArray(legacy.order)
      ? legacy.order
      : {},
  };
  setValuesCardData(character, card);
  if (Array.isArray(legacy?.keys) && legacy.keys.length > 0) {
    settings.valuesData = null;
    logApp('info', '变量已绑定角色卡', '旧版全局数据已迁入当前角色卡');
    try {
      globalThis.toastr?.info?.('变量已绑定当前角色卡，旧版全局数据已迁入；导入/导出角色卡时自动携带', `[${MODULE_DISPLAY_NAME}]`);
    } catch {}
  }
  return card;
}
// 写入角色卡失败 / 角色已删除 / 宿主不支持时的兜底：数据落回全局设置，避免丢失。
function fallbackValuesDataToSettings(ctx, card) {
  const settings = getSettings(ctx);
  settings.valuesData = {
    version: VALUES_CARD_DATA_VERSION,
    keys: Array.isArray(card?.keys) ? card.keys : [],
    defaults: card?.defaults && typeof card.defaults === 'object' && !Array.isArray(card.defaults)
      ? card.defaults
      : {},
    inject: card?.inject && typeof card.inject === 'object' && !Array.isArray(card.inject)
      ? card.inject
      : { enabled: false, paths: [] },
    triggers: Array.isArray(card?.triggers) ? card.triggers : [],
    order: card?.order && typeof card.order === 'object' && !Array.isArray(card.order)
      ? card.order
      : {},
  };
  saveSettings(ctx);
  logApp('warn', '变量写入角色卡失败，已回退全局设置');
}

// 防抖持久化（与剧情脉络同模式）：按 avatar 定位角色，避免防抖期间切换角色写错卡。
function scheduleValuesCardSave(ctx, character, card) {
  const avatar = String(character?.avatar || '');
  if (globalThis[VALUES_CARD_SAVE_TIMER_KEY]) {
    clearTimeout(globalThis[VALUES_CARD_SAVE_TIMER_KEY]);
  }
  globalThis[VALUES_CARD_SAVE_TIMER_KEY] = setTimeout(() => {
    globalThis[VALUES_CARD_SAVE_TIMER_KEY] = null;
    persistValuesCardData(ctx, avatar, card).catch((error) => {
      logApp('warn', '写入角色卡失败', String(error?.message || error));
    });
  }, VALUES_CARD_SAVE_DEBOUNCE_MS);
}

async function persistValuesCardData(ctx, avatar, card) {
  const characters = Array.isArray(ctx?.characters) ? ctx.characters : [];
  const index = characters.findIndex((character) => String(character?.avatar || '') === avatar);
  if (index < 0) {
    fallbackValuesDataToSettings(ctx, card);
    return;
  }
  const write = ctx?.writeExtensionField;
  if (typeof write !== 'function') {
    fallbackValuesDataToSettings(ctx, card);
    return;
  }
  try {
    await write.call(ctx, index, VALUES_CARD_EXTENSION_KEY, card);
  } catch (error) {
    fallbackValuesDataToSettings(ctx, card);
    throw error;
  }
}

// 变量包读取：优先角色卡绑定的内容；只有群聊 / 未选角色 / 宿主不支持写角色卡时
// 才用全局设置 valuesData 兜底（避免把别的角色/旧数据串到当前角色卡上）。
function getValuesBundle(ctx) {
  const card = ctx ? getValuesCardData(ctx) : null;
  if (card) return card;
  const settings = ctx ? getSettings(ctx) : null;
  if (!settings) return { version: VALUES_CARD_DATA_VERSION, keys: [], defaults: {} };
  // 无角色卡时用全局设置兜底：首次读取即初始化容器，保证后续变更落在活对象上
  // （与剧情脉络的 settings.storyNodes 同模式，避免一次性对象导致变更丢失）。
  let fallback = settings.valuesData;
  if (!fallback || typeof fallback !== 'object' || Array.isArray(fallback)) {
    fallback = { version: VALUES_CARD_DATA_VERSION, keys: [], defaults: {} };
    settings.valuesData = fallback;
  }
  if (!Array.isArray(fallback.keys)) fallback.keys = [];
  if (!fallback.defaults || typeof fallback.defaults !== 'object' || Array.isArray(fallback.defaults)) {
    fallback.defaults = {};
  }
  if (!Array.isArray(fallback.triggers)) fallback.triggers = [];
  if (!fallback.order || typeof fallback.order !== 'object' || Array.isArray(fallback.order)) fallback.order = {};
  return fallback;
}

// 保存：有角色且宿主支持写角色卡 → 确保角色卡容器存在后防抖持久化；否则写全局设置。
function saveValuesData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character || typeof ctx?.writeExtensionField !== 'function') {
    const bundle = getValuesBundle(ctx);
    const settings = getSettings(ctx);
    settings.valuesData = {
      version: VALUES_CARD_DATA_VERSION,
      keys: bundle.keys,
      defaults: bundle.defaults,
      inject: bundle.inject && typeof bundle.inject === 'object' && !Array.isArray(bundle.inject)
        ? bundle.inject
        : { enabled: false, paths: [] },
      triggers: Array.isArray(bundle.triggers) ? bundle.triggers : [],
      order: bundle.order && typeof bundle.order === 'object' && !Array.isArray(bundle.order)
        ? bundle.order
        : {},
    };
    saveSettings(ctx);
    return;
  }
  let card = getValuesCardData(ctx);
  if (!card) {
    const settings = getSettings(ctx);
    const legacy = settings?.valuesData;
    card = {
      version: VALUES_CARD_DATA_VERSION,
      keys: Array.isArray(legacy?.keys) ? legacy.keys : [],
      defaults: legacy?.defaults && typeof legacy.defaults === 'object' && !Array.isArray(legacy.defaults)
        ? legacy.defaults
        : {},
      inject: legacy?.inject && typeof legacy.inject === 'object' && !Array.isArray(legacy.inject)
        ? legacy.inject
        : { enabled: false, paths: [] },
      triggers: Array.isArray(legacy?.triggers) ? legacy.triggers : [],
      order: legacy?.order && typeof legacy.order === 'object' && !Array.isArray(legacy.order)
        ? legacy.order
        : {},
    };
    setValuesCardData(character, card);
    if (Array.isArray(legacy?.keys) && legacy.keys.length > 0) {
      settings.valuesData = null;
      logApp('info', '变量已绑定角色卡', '旧版全局数据已迁入当前角色卡');
      try {
        globalThis.toastr?.info?.('变量已绑定当前角色卡，旧版全局数据已迁入；导入/导出角色卡时自动携带', `[${MODULE_DISPLAY_NAME}]`);
      } catch {}
    }
  }
  scheduleValuesCardSave(ctx, character, card);
}

// ---------- 键注册表 ----------
// 内置默认注册变量（VALUES_BUILTIN_KEYS，见 constants.js）：虚拟合并进
// getValuesKeys 的返回——不写进角色卡 / 全局设置、不随 YAML 导出；卡内注册
// 同名键自动遮蔽内置（编辑内置 = 生成卡级自定义规则），删除卡键后内置恢复
// （删除 = 恢复内置默认）。克隆副本带 builtin 标记，UI 据此渲染内置行。
function isValuesBuiltinKey(key) {
  return Boolean(key && key.builtin === true);
}

// 返回未被卡内同名键遮蔽的内置键克隆（带 builtin 标记）。
function getValuesBuiltinKeys(cardKeyNames) {
  return VALUES_BUILTIN_KEYS
    .filter((key) => !cardKeyNames.has(String(key?.name || '').trim()))
    .map((key) => Object.assign(cloneValue(key), { builtin: true }));
}

function getValuesKeys(ctx) {
  const bundle = ctx ? getValuesBundle(ctx) : null;
  if (!bundle) return [];
  // 就地归一化：type 缺省为父变量；子变量补全 parent / rules 字段。
  for (const key of bundle.keys) {
    if (!key || typeof key !== 'object' || Array.isArray(key)) continue;
    if (String(key.type || '') !== VALUES_KEY_TYPE_CHILD) {
      key.type = VALUES_KEY_TYPE_PARENT;
    } else {
      key.parent = String(key.parent || '').trim();
      if (!Array.isArray(key.rules)) key.rules = [];
    }
  }
  const cardKeyNames = new Set(bundle.keys.map((key) => String(key?.name || '').trim()).filter(Boolean));
  const builtins = getValuesBuiltinKeys(cardKeyNames);
  return builtins.length > 0 ? builtins.concat(bundle.keys) : bundle.keys;
}

function getValuesRegistryNames(ctx) {
  return new Set(getValuesKeys(ctx).map((key) => String(key?.name || '').trim()).filter(Boolean));
}

function getValuesKeyByName(ctx, name) {
  const target = String(name || '').trim();
  return getValuesKeys(ctx).find((key) => String(key?.name || '').trim() === target) || null;
}

// 变量树条目顺序表：{ [父路径]: [条目名, ...] }，父路径为 path.join('/')（顶层为 ''）。
// 只记录玩家拖动过的顺序；未记录的条目按名称排序追加在末尾。
function getValuesTreeOrder(ctx) {
  const bundle = ctx ? getValuesBundle(ctx) : null;
  if (!bundle) return {};
  if (!bundle.order || typeof bundle.order !== 'object' || Array.isArray(bundle.order)) {
    bundle.order = {};
  }
  return bundle.order;
}

// 注册 / 更新键（以名称为身份）；返回保存后的键对象。
// extra 可携带 { type, parent, rules }：type 为 child 时按子变量保存（parent 为
// 父变量名，rules 为区间规则 [{ min, max, value }]），否则按父变量保存。
function upsertValuesKey(ctx, name, rule, extra = {}) {
  const bundle = getValuesBundle(ctx);
  const target = String(name || '').trim();
  if (!target) return null;
  const type = String(extra?.type || '') === VALUES_KEY_TYPE_CHILD ? VALUES_KEY_TYPE_CHILD : VALUES_KEY_TYPE_PARENT;
  const existing = bundle.keys.find((key) => String(key?.name || '').trim() === target);
  const now = new Date().toISOString();
  if (existing) {
    existing.rule = String(rule || '').trim();
    existing.type = type;
    if (type === VALUES_KEY_TYPE_CHILD) {
      existing.parent = String(extra?.parent || '').trim();
      existing.rules = normalizeValuesChildRules(extra?.rules);
    } else {
      delete existing.parent;
      delete existing.rules;
    }
    existing.updatedAt = now;
  } else {
    const key = { name: target, rule: String(rule || '').trim(), type, createdAt: now, updatedAt: now };
    if (type === VALUES_KEY_TYPE_CHILD) {
      key.parent = String(extra?.parent || '').trim();
      key.rules = normalizeValuesChildRules(extra?.rules);
    }
    bundle.keys.push(key);
  }
  saveValuesData(ctx);
  return existing || bundle.keys[bundle.keys.length - 1];
}

function deleteValuesKey(ctx, name) {
  const bundle = getValuesBundle(ctx);
  const target = String(name || '').trim();
  const index = bundle.keys.findIndex((key) => String(key?.name || '').trim() === target);
  if (index < 0) return false;
  bundle.keys.splice(index, 1);
  saveValuesData(ctx);
  return true;
}

// 按名称重排键注册表顺序（拖动排序用）；未列出的键按原相对顺序追加在末尾。
function reorderValuesKeys(ctx, names) {
  const bundle = getValuesBundle(ctx);
  const wanted = Array.isArray(names) ? names.map((name) => String(name || '').trim()).filter(Boolean) : [];
  const byName = new Map(bundle.keys.map((key) => [String(key?.name || '').trim(), key]));
  const reordered = [];
  const seen = new Set();
  for (const name of wanted) {
    const key = byName.get(name);
    if (key && !seen.has(name)) {
      reordered.push(key);
      seen.add(name);
    }
  }
  for (const key of bundle.keys) {
    const name = String(key?.name || '').trim();
    if (!seen.has(name)) reordered.push(key);
  }
  bundle.keys = reordered;
  saveValuesData(ctx);
  return bundle.keys;
}

// ---------- 父变量 / 子变量 ----------
// 父变量：由 AI 按「变化规则」维护；子变量：不参与 AI 维护，值由同路径下的
// 父变量按区间规则（rules）自动派生（如 好感度 40 → 态度「颇具好感」）。
function isValuesChildKey(key) {
  return Boolean(key && String(key.type || '') === VALUES_KEY_TYPE_CHILD);
}

function isValuesParentKey(key) {
  return !isValuesChildKey(key);
}

function getValuesChildKeys(ctx) {
  return getValuesKeys(ctx).filter(isValuesChildKey);
}

// 依赖指定父变量的全部子变量（删除父变量前的依赖检查用）。
// 内置子变量不参与检查：内置父变量无法删除，其派生依赖恒被满足；
// 删除卡内同名父键（内置覆盖）后内置父键仍存在，不会孤立任何子变量。
function getValuesChildKeysByParent(ctx, parentName) {
  const target = String(parentName || '').trim();
  return getValuesKeys(ctx).filter(
    (key) => isValuesChildKey(key) && !isValuesBuiltinKey(key) && String(key.parent || '').trim() === target,
  );
}

// 归一化子变量区间规则：{ min?, max?, value }，min / max 可省略（省略 = 不设
// 边界），value 必填；数字字段只接受有限数值，非法条目丢弃。
function normalizeValuesChildRules(rules) {
  if (!Array.isArray(rules)) return [];
  const normalized = [];
  for (const item of rules) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const value = String(item.value ?? '').trim();
    if (value === '') continue;
    const rule = { value };
    if (item.min !== undefined && item.min !== null && item.min !== '') {
      const min = Number(item.min);
      if (Number.isFinite(min)) rule.min = min;
    }
    if (item.max !== undefined && item.max !== null && item.max !== '') {
      const max = Number(item.max);
      if (Number.isFinite(max)) rule.max = max;
    }
    normalized.push(rule);
  }
  return normalized;
}

// 校验子变量区间规则：返回 { invalid, overlaps }。
// - invalid：min > max 的非法行下标；
// - overlaps：存在交集（含边界）的规则对下标，如 0~1000 与 1000~2000 在 1000
//   处重叠，必须写成 1001~2000；min / max 省略视为不设边界（-∞ / +∞）。
function validateValuesChildRules(rules) {
  const list = Array.isArray(rules) ? rules : [];
  const invalid = [];
  const overlaps = [];
  for (let i = 0; i < list.length; i += 1) {
    const a = list[i];
    if (a?.min !== undefined && a?.max !== undefined && a.min > a.max) invalid.push(i);
    for (let j = i + 1; j < list.length; j += 1) {
      const b = list[j];
      const aMin = a?.min !== undefined ? a.min : -Infinity;
      const aMax = a?.max !== undefined ? a.max : Infinity;
      const bMin = b?.min !== undefined ? b.min : -Infinity;
      const bMax = b?.max !== undefined ? b.max : Infinity;
      if (Math.max(aMin, bMin) <= Math.min(aMax, bMax)) overlaps.push([i, j]);
    }
  }
  return { invalid, overlaps };
}

// 单叶子派生：按子变量规则，用同路径父变量值计算子变量值（就地写入）。
// 规则按顺序匹配，首个满足的生效；父变量缺失 / 非数值 / 无规则命中时保持原值。
function deriveValuesChildAt(tree, path, childKey) {
  const parentName = String(childKey?.parent || '').trim();
  if (!parentName || !Array.isArray(path) || path.length === 0) return false;
  const parentValue = valuesGetAtPath(tree, path.slice(0, -1).concat(parentName));
  let numeric = null;
  if (typeof parentValue === 'number') {
    numeric = parentValue;
  } else if (typeof parentValue === 'string' && parentValue.trim() !== '') {
    const parsed = Number(parentValue);
    if (Number.isFinite(parsed)) numeric = parsed;
  }
  if (numeric === null) return false;
  for (const rule of Array.isArray(childKey?.rules) ? childKey.rules : []) {
    if (rule.min !== undefined && numeric < rule.min) continue;
    if (rule.max !== undefined && numeric > rule.max) continue;
    valuesSetAtPath(tree, path, String(rule.value));
    return true;
  }
  return false;
}

// 剔除树中所有已注册子变量叶子（返回新树，不修改入参）：仅按叶子名匹配，
// 容器与父变量原样保留。用于 AI 维护：发给 AI 的值表只含父变量，子变量是
// 派生变量由系统计算，不发送也不允许 AI 改动。
function stripValuesChildLeaves(tree, keys) {
  const childNames = new Set();
  for (const key of Array.isArray(keys) ? keys : []) {
    if (isValuesChildKey(key)) childNames.add(String(key.name || '').trim());
  }
  const result = cloneValue(tree);
  if (childNames.size === 0) return result;
  const walk = (node) => {
    if (!valuesIsContainer(node)) return;
    for (const name of Object.keys(node)) {
      if (valuesIsContainer(node[name])) {
        walk(node[name]);
      } else if (childNames.has(name)) {
        delete node[name];
      }
    }
  };
  walk(result);
  return result;
}

// 遍历整棵树，把所有已注册子变量叶子按父变量派生（就地修改，返回同一棵树）。
// 多轮收敛：允许导入数据里出现「子变量的父变量也是子变量」的链式场景。
function deriveValuesChildren(tree, keys) {
  if (!valuesIsContainer(tree)) return tree;
  const childKeys = new Map();
  for (const key of Array.isArray(keys) ? keys : []) {
    if (isValuesChildKey(key)) childKeys.set(String(key.name || '').trim(), key);
  }
  if (childKeys.size === 0) return tree;
  for (let pass = 0; pass < 10; pass += 1) {
    let changed = false;
    const walk = (node, path) => {
      if (!valuesIsContainer(node)) return;
      for (const name of Object.keys(node)) {
        const childPath = path.concat(name);
        const child = node[name];
        if (valuesIsContainer(child)) {
          walk(child, childPath);
        } else {
          const childKey = childKeys.get(name);
          if (childKey && deriveValuesChildAt(tree, childPath, childKey)) changed = true;
        }
      }
    };
    walk(tree, []);
    if (!changed) break;
  }
  return tree;
}

// ---------- 默认值树 ----------
function getValuesDefaults(ctx) {
  const bundle = ctx ? getValuesBundle(ctx) : null;
  if (!bundle) return {};
  // 就地派生：默认值层的子变量也按父变量显示（确定性计算，不触发保存）。
  return deriveValuesChildren(bundle.defaults, bundle.keys);
}

// ---------- 游戏值：聊天文件绑定 ----------
// 游戏值存 chatMetadata[VALUES_CHAT_KEY] = { version, values, updatedAt, lastSignature }，
// 随聊天文件保存/加载自动携带（jsonl 首行 chat_metadata）。
function getValuesChatMetadata(ctx) {
  const context = ctx || getContextSafe();
  if (!context) return null;
  return context.chatMetadata && typeof context.chatMetadata === 'object'
    ? context.chatMetadata
    : (globalThis.chat_metadata && typeof globalThis.chat_metadata === 'object' ? globalThis.chat_metadata : null);
}

function getValuesChatState(ctx) {
  const metadata = getValuesChatMetadata(ctx);
  const state = metadata ? metadata[VALUES_CHAT_KEY] : null;
  if (!state || typeof state !== 'object' || Array.isArray(state)) return null;
  if (!state.values || typeof state.values !== 'object' || Array.isArray(state.values)) return null;
  return state;
}

// 游戏值读取：聊天里已有状态 → 用它；还没有（新聊天/首次）→ 从默认值克隆，
// 此时不写聊天文件，等首次修改或 AI 维护后再持久化。
function getValuesGameTree(ctx) {
  const state = getValuesChatState(ctx);
  const tree = state ? cloneValue(state.values) : cloneValue(getValuesDefaults(ctx));
  // 读取即派生：子变量始终按父变量当前值计算（即使聊天文件里存的是旧值）。
  return deriveValuesChildren(tree, ctx ? getValuesKeys(ctx) : []);
}

// 聊天文件写入入口：写 chatMetadata 后防抖调用宿主保存接口。
function saveChatNow(ctx) {
  const context = ctx || getContextSafe();
  if (!context) return;
  try {
    if (typeof context.saveChat === 'function') {
      context.saveChat();
      return;
    }
    if (typeof globalThis.saveChatConditional === 'function') {
      globalThis.saveChatConditional();
      return;
    }
    if (typeof globalThis.saveChat === 'function') {
      globalThis.saveChat();
      return;
    }
    if (typeof context.saveMetadata === 'function') {
      context.saveMetadata();
      return;
    }
    if (typeof globalThis.saveMetadataDebounced === 'function') {
      globalThis.saveMetadataDebounced();
    }
  } catch (error) {
    logApp('warn', '保存聊天文件失败', String(error?.message || error));
  }
}

function scheduleValuesChatSave(ctx, immediate) {
  const context = ctx || getContextSafe();
  if (!context) return;
  if (globalThis[VALUES_CHAT_SAVE_TIMER_KEY]) {
    clearTimeout(globalThis[VALUES_CHAT_SAVE_TIMER_KEY]);
  }
  if (immediate) {
    saveChatNow(context);
    return;
  }
  globalThis[VALUES_CHAT_SAVE_TIMER_KEY] = setTimeout(() => {
    globalThis[VALUES_CHAT_SAVE_TIMER_KEY] = null;
    saveChatNow(context);
  }, VALUES_CHAT_SAVE_DEBOUNCE_MS);
}

// 写入游戏值：metadata[key] = 状态包，防抖保存聊天文件。meta 可携带 updatedAt /
// lastSignature 等附加字段。
function saveValuesChatState(ctx, values, meta = {}) {
  const context = ctx || getContextSafe();
  if (!context) return false;
  let metadata = getValuesChatMetadata(context);
  if (!metadata) {
    try {
      context.chatMetadata = {};
      metadata = context.chatMetadata;
    } catch (error) {
      logApp('warn', '聊天元数据不可写', String(error?.message || error));
      return false;
    }
  }
  metadata[VALUES_CHAT_KEY] = {
    version: VALUES_CARD_DATA_VERSION,
    values,
    updatedAt: String(meta.updatedAt || new Date().toISOString()),
    lastSignature: String(meta.lastSignature || ''),
  };
  scheduleValuesChatSave(context, !!meta.immediate);
  return true;
}

// 游戏值「未初始化」判断：聊天里还没有独立状态（当前显示的是默认值的克隆）。
function isValuesGameInitialized(ctx) {
  return Boolean(getValuesChatState(ctx));
}

// ---------- 变量树工具 ----------
function valuesIsContainer(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}


// 按路径读取节点；路径不存在返回 undefined。
function valuesGetAtPath(tree, path) {
  let node = tree;
  for (const key of path) {
    if (!valuesIsContainer(node) || !Object.prototype.hasOwnProperty.call(node, key)) return undefined;
    node = node[key];
  }
  return node;
}

// 按路径写入叶子值；路径上的中间层必须已是容器。
function valuesSetAtPath(tree, path, value) {
  if (path.length === 0) return false;
  let node = tree;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    if (!valuesIsContainer(node[key])) {
      node[key] = {};
    }
    node = node[key];
  }
  node[path[path.length - 1]] = value;
  return true;
}

// 按路径删除；只删叶子或空容器，容器删除由 UI 确认（连同子树）。
function valuesDeleteAtPath(tree, path) {
  if (path.length === 0) return false;
  let node = tree;
  for (let i = 0; i < path.length - 1; i += 1) {
    if (!valuesIsContainer(node[path[i]])) return false;
    node = node[path[i]];
  }
  const key = path[path.length - 1];
  if (!Object.prototype.hasOwnProperty.call(node, key)) return false;
  delete node[key];
  return true;
}

// 统计树中叶子数量（顶层条目数 = 键数量）。
function valuesCountEntries(tree) {
  let count = 0;
  const walk = (node) => {
    if (!valuesIsContainer(node)) {
      count += 1;
      return;
    }
    for (const key of Object.keys(node)) walk(node[key]);
  };
  walk(tree);
  return count;
}

// 树中是否存在指定名字的条目（任意层级的叶子 / 节点名）。
// 维护提示词过滤内置规则用：内置变量规则只在树里已出现该变量名时才发给 AI，
// 避免 AI 在从未使用过该变量的聊天里凭空创建。
function valuesTreeContainsName(tree, name) {
  const target = String(name || '').trim();
  if (!target) return false;
  const walk = (node) => {
    if (!valuesIsContainer(node)) return false;
    for (const key of Object.keys(node)) {
      if (key === target) return true;
      if (walk(node[key])) return true;
    }
    return false;
  };
  return walk(tree);
}

// 按顺序表返回节点下的条目名：已记录顺序的条目按记录排列，未记录的按名称排序追加。
function valuesOrderedNames(order, parentPath, node) {
  const names = valuesIsContainer(node) ? Object.keys(node) : [];
  if (!Array.isArray(order?.[parentPath]) || order[parentPath].length === 0) {
    return names.slice().sort();
  }
  const present = new Set(names);
  const ordered = [];
  const seen = new Set();
  for (const name of order[parentPath]) {
    const key = String(name || '').trim();
    if (key && present.has(key) && !seen.has(key)) {
      ordered.push(key);
      seen.add(key);
    }
  }
  const rest = names.filter((name) => !seen.has(name)).sort();
  return ordered.concat(rest);
}

// 记录某父路径下条目的显示顺序（拖动排序用）；保存后返回顺序表。
function reorderValuesTreeAt(ctx, parentPath, names) {
  const order = getValuesTreeOrder(ctx);
  const key = Array.isArray(parentPath) ? parentPath.join('/') : String(parentPath || '');
  order[key] = Array.isArray(names)
    ? names.map((name) => String(name || '').trim()).filter(Boolean)
    : [];
  saveValuesData(ctx);
  return order;
}

// ---------- 注入提示词配置（默认数值层勾选）----------
// 配置存变量包 inject 字段：{ enabled, paths }。paths 是打开条目的路径数组
// （path.join('/')），节点上下级联动：打开下级自动提升全部祖先，关闭上级
// 级联关闭全部后代；随角色卡 / 全局设置保存。
function getValuesInjectConfig(ctx) {
  const bundle = ctx ? getValuesBundle(ctx) : null;
  if (!bundle) return { enabled: false, paths: [] };
  if (!bundle.inject || typeof bundle.inject !== 'object' || Array.isArray(bundle.inject)) {
    bundle.inject = { enabled: false, paths: [] };
  }
  if (typeof bundle.inject.enabled !== 'boolean') bundle.inject.enabled = false;
  if (!Array.isArray(bundle.inject.paths)) bundle.inject.paths = [];
  return bundle.inject;
}

function saveValuesInjectConfig(ctx, config) {
  const bundle = getValuesBundle(ctx);
  bundle.inject = {
    enabled: Boolean(config?.enabled),
    paths: Array.isArray(config?.paths)
      ? config.paths.filter((item) => typeof item === 'string' && String(item).trim() !== '')
      : [],
  };
  saveValuesData(ctx);
  return bundle.inject;
}

function setValuesInjectEnabled(ctx, enabled) {
  const config = getValuesInjectConfig(ctx);
  config.enabled = Boolean(enabled);
  saveValuesData(ctx);
  return config;
}

// 打开 / 关闭一个条目（节点上下级联动）：
// - 打开条目 = 自身 + 全部祖先打开（下级打开 → 上级必须打开）；
// - 关闭条目 = 自身 + 全部后代关闭（上级关闭 → 下级全部关闭）；
// - 打开节点不自动打开后代（上级打开 → 下级选择性打开）。
function setValuesInjectPath(ctx, path, checked) {
  const config = getValuesInjectConfig(ctx);
  const key = Array.isArray(path) ? path.join('/') : String(path || '');
  if (!key) return config;
  if (checked) {
    const segments = key.split('/');
    for (let i = 1; i <= segments.length; i += 1) {
      const ancestorKey = segments.slice(0, i).join('/');
      if (!config.paths.includes(ancestorKey)) config.paths.push(ancestorKey);
    }
  } else {
    config.paths = config.paths.filter((item) => !(item === key || item.startsWith(key + '/')));
  }
  saveValuesData(ctx);
  return config;
}

function toggleValuesInjectPath(ctx, path) {
  const config = getValuesInjectConfig(ctx);
  const key = Array.isArray(path) ? path.join('/') : String(path || '');
  return setValuesInjectPath(ctx, path, !config.paths.includes(key));
}

// 某路径是否已被覆盖勾选（自身或任一祖先被勾选）。
function isValuesInjectPathSelected(ctx, path) {
  const config = getValuesInjectConfig(ctx);
  const key = Array.isArray(path) ? path.join('/') : String(path || '');
  if (!key) return false;
  if (config.paths.includes(key)) return true;
  return config.paths.some((item) => key.startsWith(item + '/'));
}

// ---------- AI 维护：补丁合并 ----------
// 把 AI 返回的补丁合并进当前树：
// - 值写 null → 删除该键；
// - 两侧都是容器 → 递归合并；
// - 其余情况 → 用补丁值替换；
// - 补丁里出现当前树不存在的新键时，只有「已注册键」才允许新增（人名/条目等
//   新容器由玩家在界面创建，AI 不得擅自发明结构）。
// 返回 { tree, changed, ignored }：tree 是合并后的新树（不修改入参），
// changed 是实际变化的路径列表，ignored 是被丢弃的新键路径列表。
function mergeValuesPatch(current, patch, registeredNames) {
  const tree = cloneValue(current);
  const changed = [];
  const ignored = [];
  const walk = (target, patchNode, path) => {
    if (!valuesIsContainer(patchNode)) {
      if (patchNode === null || patchNode === undefined) {
        const existed = valuesGetAtPath(target, path) !== undefined;
        if (existed) {
          valuesDeleteAtPath(target, path);
          changed.push(path.join('.'));
        }
        return;
      }
      const current = valuesGetAtPath(target, path);
      // 节点（容器）不能变成值：AI 不得把节点改成标量。
      if (valuesIsContainer(current)) {
        ignored.push(path.join('.'));
        return;
      }
      const oldValue = current;
      if (oldValue !== patchNode && JSON.stringify(oldValue) !== JSON.stringify(patchNode)) {
        valuesSetAtPath(target, path, patchNode);
        changed.push(path.join('.'));
      }
      return;
    }
    const current = valuesGetAtPath(target, path);
    // 键（叶子）不能变成节点：AI 不得给键挂子条目。
    if (current !== undefined && !valuesIsContainer(current)) {
      ignored.push(path.join('.'));
      return;
    }
    for (const key of Object.keys(patchNode)) {
      const childPath = path.concat(key);
      const targetChild = valuesGetAtPath(target, path);
      const exists = valuesIsContainer(targetChild) && Object.prototype.hasOwnProperty.call(targetChild, key);
      if (exists) {
        walk(target, patchNode[key], childPath);
      } else if (registeredNames.has(key)) {
        valuesSetAtPath(target, childPath, cloneValue(patchNode[key]));
        changed.push(childPath.join('.'));
      } else if (patchNode[key] !== null && patchNode[key] !== undefined) {
        ignored.push(childPath.join('.'));
      }
    }
  };
  walk(tree, patch, []);
  return { tree, changed, ignored };
}

// 解析 AI 维护返回：优先 JSON（代码块或裸对象），失败回退轻量 YAML。
function parseValuesPatch(text) {
  const source = String(text || '').trim();
  if (!source) return null;
  let parsed = null;
  try {
    if (source.includes('{')) parsed = parseAgentJson(source);
  } catch {}
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    try {
      const yaml = parseYamlSubset(source);
      if (yaml && typeof yaml === 'object' && !Array.isArray(yaml)) parsed = yaml;
    } catch (error) {
      logApp('debug', '变量维护：YAML 解析失败', String(error?.message || error));
    }
  }
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
}

// ---------- YAML 导入导出 ----------
// 变量标量序列化：数字 / 布尔 / null 保持原生形态（不引号化），字符串沿用
// yamlScalar 的引号规则（形如数字的字符串加引号，导入后仍是字符串）。
function yamlValueScalar(value) {
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === null || value === undefined) return 'null';
  return yamlScalar(value);
}

// 树序列化：映射（可嵌套）→ 缩进 YAML；叶子经 yamlValueScalar / yamlBlockScalarText。
function serializeValuesTree(value, baseIndent) {
  const indent = baseIndent || '';
  const lines = [];
  const walk = (node, currentIndent) => {
    if (!valuesIsContainer(node)) return;
    for (const key of Object.keys(node)) {
      const child = node[key];
      const prefix = `${currentIndent}${key}: `;
      if (valuesIsContainer(child)) {
        lines.push(`${currentIndent}${key}:`);
        walk(child, `${currentIndent}  `);
      } else if (child === null || child === undefined) {
        lines.push(`${prefix}null`);
      } else if (typeof child === 'string' && child.includes('\n')) {
        lines.push(`${currentIndent}${key}: ${yamlBlockScalarText(child, currentIndent)}`);
      } else {
        lines.push(`${prefix}${yamlValueScalar(child)}`);
      }
    }
  };
  walk(value, indent);
  return lines.join('\n');
}

// 整包导出：format 标记 + keys（注册表）+ defaults（默认值树）。
// 自描述头部：format 固定输出，character 只写当前绑定的角色卡名（群聊/未选角色省略）。
function serializeValuesBundle(ctx) {
  const bundle = ctx ? getValuesBundle(ctx) : { keys: [], defaults: {} };
  const character = ctx ? getStoryCharacter(ctx) : null;
  // 导出前派生一次：默认值树里的子变量按父变量当前值输出。
  deriveValuesChildren(bundle.defaults, bundle.keys);
  const lines = ['format: ' + yamlScalar(VALUES_BUNDLE_FORMAT)];
  if (character) lines.push('character: ' + yamlScalar(String(character.name || '')));
  lines.push('keys:');
  for (const key of bundle.keys) {
    lines.push(`  - name: ${yamlScalar(String(key?.name || ''))}`);
    if (isValuesChildKey(key)) {
      lines.push('    type: child');
      lines.push(`    parent: ${yamlScalar(String(key?.parent || ''))}`);
      lines.push('    rules:');
      const rules = Array.isArray(key?.rules) ? key.rules : [];
      if (rules.length === 0) {
        lines.push('      []');
      } else {
        for (const rule of rules) {
          lines.push(`      - min: ${rule?.min !== undefined ? String(rule.min) : 'null'}`);
          lines.push(`        max: ${rule?.max !== undefined ? String(rule.max) : 'null'}`);
          lines.push(`        value: ${yamlScalar(String(rule?.value || ''))}`);
        }
      }
    } else {
      lines.push('    type: parent');
      lines.push(`    rule: ${yamlBlockScalarText(String(key?.rule || ''), '    ')}`);
    }
  }
  lines.push('defaults:');
  const defaultsText = serializeValuesTree(bundle.defaults, '  ');
  if (defaultsText) lines.push(defaultsText);
  else lines.push('  {}');
  lines.push('order:');
  const order = getValuesTreeOrder(ctx);
  const orderPaths = Object.keys(order).filter((path) => Array.isArray(order[path]) && order[path].length > 0);
  if (orderPaths.length === 0) {
    lines.push('  []');
  } else {
    for (const path of orderPaths) {
      lines.push(`  - path: ${yamlScalar(path)}`);
      lines.push('    names:');
      for (const name of order[path]) {
        lines.push(`      - ${yamlScalar(String(name))}`);
      }
    }
  }
  lines.push('triggers:');
  const triggers = Array.isArray(bundle.triggers) ? bundle.triggers : [];
  if (triggers.length === 0) {
    lines.push('  []');
  } else {
    for (const trigger of triggers) {
      lines.push(`  - id: ${yamlScalar(String(trigger?.id || ''))}`);
      lines.push(`    name: ${yamlScalar(String(trigger?.name || ''))}`);
      lines.push(`    enabled: ${trigger?.enabled === false ? 'false' : 'true'}`);
      lines.push(`    once: ${trigger?.once === false ? 'false' : 'true'}`);
      lines.push(`    logic: ${String(trigger?.logic || 'all') === 'any' ? 'any' : 'all'}`);
      if (String(trigger?.description || '').trim()) {
        lines.push(`    description: ${yamlScalar(String(trigger?.description || ''))}`);
      }
      lines.push('    conditions:');
      const conditions = Array.isArray(trigger?.conditions) ? trigger.conditions : [];
      if (conditions.length === 0) {
        lines.push('      []');
      } else {
        for (const condition of conditions) {
          lines.push(`      - path: ${yamlScalar(String(condition?.path || ''))}`);
          lines.push(`        op: ${yamlScalar(String(condition?.op || '==').trim())}`);
          lines.push(`        value: ${yamlValueScalar(condition?.value)}`);
        }
      }
      lines.push(`    content: ${yamlBlockScalarText(String(trigger?.content || ''), '    ')}`);
    }
  }
  return lines.join('\n');
}

// 整包解析：识别 format 标记（兼容缺标记的裸包：keys 列表 + defaults 映射），
// 校验字段并归一化。返回 { keys, defaults }；格式不可识别时抛错。
function parseValuesBundle(text) {
  const parsed = parseYamlSubset(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('无法解析为 YAML 映射');
  }
  if (parsed.format && String(parsed.format) !== VALUES_BUNDLE_FORMAT) {
    throw new Error(`不是万华镜变量包（format=${String(parsed.format)}）`);
  }
  const keys = [];
  if (parsed.keys !== undefined) {
    if (!Array.isArray(parsed.keys)) throw new Error('keys 必须是列表');
    for (const item of parsed.keys) {
      const name = String(item?.name || '').trim();
      if (!name) throw new Error('变量缺少 name');
      const type = String(item?.type || '').trim() === VALUES_KEY_TYPE_CHILD ? VALUES_KEY_TYPE_CHILD : VALUES_KEY_TYPE_PARENT;
      const key = { name, type };
      if (type === VALUES_KEY_TYPE_CHILD) {
        key.parent = String(item?.parent || '').trim();
        key.rules = normalizeValuesChildRules(item?.rules);
      } else {
        key.rule = String(item?.rule || '').trim();
      }
      keys.push(key);
    }
  }
  const defaults = parsed.defaults && typeof parsed.defaults === 'object' && !Array.isArray(parsed.defaults)
    ? parsed.defaults
    : {};
  const triggers = [];
  if (parsed.triggers !== undefined) {
    if (!Array.isArray(parsed.triggers)) throw new Error('triggers 必须是列表');
    for (const item of parsed.triggers) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
      const id = String(item.id || '').trim();
      if (!id) throw new Error('触发缺少 id');
      const conditions = [];
      if (item.conditions !== undefined) {
        if (!Array.isArray(item.conditions)) throw new Error(`触发「${id}」的 conditions 必须是列表`);
        for (const condition of item.conditions) {
          if (!condition || typeof condition !== 'object' || Array.isArray(condition)) continue;
          const path = String(condition.path || '').trim();
          if (!path) continue;
          conditions.push({
            path,
            op: String(condition.op || '==').trim(),
            value: condition.value !== undefined ? condition.value : null,
          });
        }
      }
      triggers.push({
        id,
        name: String(item.name || '').trim() || '未命名触发',
        enabled: item.enabled !== false,
        once: item.once !== false,
        logic: String(item.logic || 'all').trim() === 'any' ? 'any' : 'all',
        description: String(item.description || '').trim(),
        conditions,
        content: String(item.content || ''),
      });
    }
  }
  const order = {};
  if (parsed.order !== undefined) {
    if (!Array.isArray(parsed.order)) throw new Error('order 必须是列表');
    for (const item of parsed.order) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
      const path = String(item.path ?? '').trim();
      const names = Array.isArray(item.names)
        ? item.names.map((name) => String(name ?? '').trim()).filter(Boolean)
        : [];
      if (names.length > 0) order[path] = names;
    }
  }
  return { keys, defaults, triggers, order };
}

// 整包导出文件名：绑定角色卡 → 「变量: 角色卡名.yaml」；群聊 / 未选角色时回退时间戳名。
function getValuesBundleFilename(ctx) {
  const character = ctx ? getStoryCharacter(ctx) : null;
  if (character) return `${VALUES_CARD_BUNDLE_FILENAME_PREFIX}${sanitizeStoryFilename(String(character.name || ''))}.yaml`;
  return `${VALUES_BUNDLE_FILENAME_PREFIX}-${storyTimestamp()}.yaml`;
}

// 导入合并：同名校的键更新规则，其余追加；defaults 深合并（同路径补丁覆盖，其余保留）。
function applyValuesBundle(ctx, parsed, mode) {
  const bundle = getValuesBundle(ctx);
  if (mode === 'replace') {
    bundle.keys.length = 0;
    bundle.defaults = {};
    bundle.order = {};
  }
  for (const key of parsed.keys) {
    const existing = bundle.keys.find((item) => String(item?.name || '').trim() === String(key.name || '').trim());
    if (existing) {
      existing.rule = String(key.rule || '').trim();
      existing.type = key.type === VALUES_KEY_TYPE_CHILD ? VALUES_KEY_TYPE_CHILD : VALUES_KEY_TYPE_PARENT;
      if (existing.type === VALUES_KEY_TYPE_CHILD) {
        existing.parent = String(key.parent || '').trim();
        existing.rules = normalizeValuesChildRules(key.rules);
      } else {
        delete existing.parent;
        delete existing.rules;
      }
    } else {
      bundle.keys.push(cloneValue(key));
    }
  }
  const patch = parsed.defaults || {};
  const merged = mergeValuesTreeMaps(bundle.defaults, patch);
  bundle.defaults = merged;
  const order = getValuesTreeOrder(ctx);
  for (const path of Object.keys(parsed.order || {})) {
    order[path] = (parsed.order[path] || []).slice();
  }
  const triggers = getValuesTriggers(ctx);
  if (mode === 'replace') {
    triggers.length = 0;
  }
  for (const trigger of Array.isArray(parsed.triggers) ? parsed.triggers : []) {
    const existing = triggers.find((item) => item.id === trigger.id);
    if (existing) Object.assign(existing, cloneValue(trigger));
    else triggers.push(cloneValue(trigger));
  }
  saveValuesData(ctx);
  return { keyCount: bundle.keys.length, defaults: bundle.defaults, triggerCount: triggers.length };
}

// 深合并两个映射（补丁覆盖，其余保留；不处理 null 删除，导入即覆盖语义）。
function mergeValuesTreeMaps(base, patch) {
  const result = cloneValue(valuesIsContainer(base) ? base : {});
  const walk = (target, patchNode) => {
    if (!valuesIsContainer(patchNode)) return;
    for (const key of Object.keys(patchNode)) {
      if (valuesIsContainer(patchNode[key]) && valuesIsContainer(target[key])) {
        walk(target[key], patchNode[key]);
      } else {
        target[key] = cloneValue(patchNode[key]);
      }
    }
  };
  walk(result, patch);
  return result;
}

// 游戏值导出（单独）：只导出当前聊天游戏值树，供玩家备份/查看。
function serializeValuesGameTree(ctx) {
  return serializeValuesTree(getValuesGameTree(ctx), '');
}
