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

// 把变量包写入角色卡对象（内存态，持久化由 saveValuesCardNow 完成）。
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
  saveSettingsImmediate(ctx);
  logApp('warn', '变量写入角色卡失败，已回退全局设置');
}

// 立即持久化（不做防抖）：宿主刷新 / 退出会打断 setTimeout 挂起的写入——
// 500ms 防抖窗口内退出酒馆，删除 / 修改即丢失，旧数据从磁盘回滚（TauriTavern
// 实测）。本地写卡代价极小，每次变更直接落盘；连续变更按发起顺序落盘，最终
// 以最后一次为准。返回写入 Promise（保存按钮用 await 等落盘后再校验）。
function saveValuesCardNow(ctx, character, card) {
  const avatar = String(character?.avatar || '');
  const promise = persistValuesCardData(ctx, avatar, card);
  promise.catch((error) => {
    logApp('warn', '写入角色卡失败', String(error?.message || error));
  });
  return promise;
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
    // 宿主 merge-attributes 是深合并语义：只更新请求里出现的键，请求里没有的
    // 键原样保留。删除操作必须把「磁盘上有、新 bundle 里没有」的键标记为
    // VALUES_UNSET_SENTINEL 哨兵，宿主合并时才会真正删除；否则删除会被合并
    // 吞掉：merge 返回 ok:true 但角色卡从未改变（写盘短路跳过）。
    let payload = card;
    try {
      const onDisk = await readValuesCardFromDisk(ctx, avatar);
      if (onDisk && typeof onDisk === 'object' && !Array.isArray(onDisk)) {
        payload = buildValuesUnsetPatch(onDisk, card);
      }
    } catch (error) {
      logApp('warn', '写卡前磁盘重读失败，按全量覆盖发送', String(error?.message || error));
    }
    await write.call(ctx, index, VALUES_CARD_EXTENSION_KEY, payload);
    // writeExtensionField 就地写入了带哨兵的补丁：把内存角色恢复为干净的新包，
    // 避免哨兵值残留在 UI 数据里。
    const character = characters[index];
    if (character && character.data && typeof character.data === 'object') {
      if (!character.data.extensions || typeof character.data.extensions !== 'object') {
        character.data.extensions = {};
      }
      character.data.extensions[VALUES_CARD_EXTENSION_KEY] = card;
    }
  } catch (error) {
    fallbackValuesDataToSettings(ctx, card);
    throw error;
  }
}

// 从磁盘重读当前角色卡的变量包（写卡前对比旧值 / 保存校验用）。
// 优先独立 fetch（不触碰内存 characters 数组），回退宿主 getOneCharacter。
// 兼容宿主返回的两种形状：normalizeCharacter 后的嵌套 data.extensions，
// 以及展平的顶层 extensions。读不到 / 出错返回 null。
async function readValuesCardFromDisk(context, avatar) {
  const ctx = context || getContextSafe();
  if (!ctx || !avatar) return null;
  const extract = (character) => {
    const extensions = character?.data?.extensions ?? character?.extensions ?? null;
    const bundle = extensions && typeof extensions === 'object' ? extensions[VALUES_CARD_EXTENSION_KEY] : null;
    return bundle && typeof bundle === 'object' && !Array.isArray(bundle) ? bundle : null;
  };
  try {
    if (typeof globalThis.fetch === 'function') {
      const headers = typeof ctx.getRequestHeaders === 'function'
        ? ctx.getRequestHeaders()
        : { 'Content-Type': 'application/json' };
      const response = await globalThis.fetch('/api/characters/get', {
        method: 'POST',
        headers,
        body: JSON.stringify({ avatar_url: avatar }),
      });
      if (response.ok) {
        const data = await response.json();
        const bundle = extract(data);
        if (bundle) return bundle;
      }
    }
    if (typeof ctx.getOneCharacter === 'function') {
      await ctx.getOneCharacter(avatar);
      const fresh = Array.isArray(ctx.characters)
        ? ctx.characters.find((character) => String(character?.avatar || '') === avatar)
        : null;
      const bundle = extract(fresh);
      if (bundle) return bundle;
    }
    return null;
  } catch (error) {
    logApp('warn', '读取磁盘角色卡失败', String(error?.message || error));
    return null;
  }
}

// 构造写卡补丁：宿主 merge-attributes 是深合并语义（只更新请求里出现的键，
// 请求里没有的键原样保留）。把「磁盘上有、新 bundle 里没有」的键标记为
// VALUES_UNSET_SENTINEL 哨兵，宿主合并时才会真正删除；新值 / 变化值直接携带；
// 数组与标量整体替换（宿主对非对象值即整体覆盖）。
function buildValuesUnsetPatch(oldCard, newCard) {
  const build = (oldNode, newNode) => {
    const oldIsMap = valuesIsContainer(oldNode);
    const newIsMap = valuesIsContainer(newNode);
    if (oldIsMap && newIsMap) {
      const merged = {};
      for (const key of Object.keys(oldNode)) {
        if (!Object.prototype.hasOwnProperty.call(newNode, key)) {
          merged[key] = VALUES_UNSET_SENTINEL;
        } else {
          merged[key] = build(oldNode[key], newNode[key]);
        }
      }
      for (const key of Object.keys(newNode)) {
        if (!Object.prototype.hasOwnProperty.call(merged, key)) {
          merged[key] = cloneValue(newNode[key]);
        }
      }
      return merged;
    }
    return cloneValue(newNode);
  };
  return build(oldCard, newCard);
}

// 写卡校验：经宿主接口从磁盘重读角色卡，比对扩展字段是否与期望一致。
// TauriTavern 的 writeExtensionField 失败只 console.error 不抛错（扩展无法感知），
// 保存按钮用本函数把静默失败变成可见反馈。返回 true / false；宿主不支持从磁盘
// 重读（无 fetch / getOneCharacter / getCharacters）或重读失败时返回 null（无法校验）。
async function verifyValuesCardWrite(ctx, avatar, expected) {
  const context = ctx || getContextSafe();
  if (!context || !avatar) return null;
  try {
    if (typeof context.getOneCharacter === 'function') {
      await context.getOneCharacter(avatar);
    } else if (typeof context.getCharacters === 'function') {
      await context.getCharacters();
    } else {
      return null;
    }
    const fresh = Array.isArray(context.characters)
      ? context.characters.find((character) => String(character?.avatar || '') === avatar)
      : null;
    const extensions = fresh?.data?.extensions ?? fresh?.extensions ?? null;
    const onDisk = extensions && typeof extensions === 'object' ? extensions[VALUES_CARD_EXTENSION_KEY] : null;
    if (!onDisk || typeof onDisk !== 'object' || Array.isArray(onDisk)) return false;
    const ok = jsonDeepEqual(onDisk, expected);
    if (!ok) logApp('warn', '保存校验不一致', `期望:${describeJsonDiff(expected, onDisk)}`);
    return ok;
  } catch (error) {
    logApp('warn', '保存校验失败', String(error?.message || error));
    return null;
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

// 保存：有角色且宿主支持写角色卡 → 确保角色卡容器存在后立即持久化；否则写全局设置。
// 返回落盘 Promise（保存按钮 await 后从磁盘重读校验，避免校验与写入并行读到旧数据）。
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
    saveSettingsImmediate(ctx);
    return Promise.resolve();
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
  return saveValuesCardNow(ctx, character, card);
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
      if (!Array.isArray(key.mapRules)) key.mapRules = [];
      if (typeof key.formula !== 'string') key.formula = '';
      if (toValuesDecimals(key.decimals) === null) key.decimals = 0;
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
// extra 可携带 { type, parent, rules, mapRules, formula }：type 为 child 时按子变量
// 保存——formula 非空为公式派生（引用变量名写在公式里，不用 parent）；mapRules
// 为数组时为取值映射派生（parent 为派生源变量名，mapRules 为等值规则
// [{ match, value }]，match 留空 = 兜底行），适合「当某子变量 = 某文本时输出
// 另一文本」的链式场景；否则为区间派生（parent 为派生源变量名，rules 为区间
// 规则 [{ min, max, value }]）；否则按父变量保存。
function upsertValuesKey(ctx, name, rule, extra = {}) {
  const bundle = getValuesBundle(ctx);
  const target = String(name || '').trim();
  if (!target) return null;
  const type = String(extra?.type || '') === VALUES_KEY_TYPE_CHILD ? VALUES_KEY_TYPE_CHILD : VALUES_KEY_TYPE_PARENT;
  const existing = bundle.keys.find((key) => String(key?.name || '').trim() === target);
  const now = new Date().toISOString();
  const applyChild = (key) => {
    const formula = String(extra?.formula || '').trim();
    if (formula !== '') {
      key.formula = formula;
      key.parent = '';
      key.rules = [];
      key.mapRules = [];
      const decimals = toValuesDecimals(extra?.decimals);
      key.decimals = decimals !== null ? decimals : 0;
    } else if (Array.isArray(extra?.mapRules)) {
      key.parent = String(extra?.parent || '').trim();
      key.mapRules = normalizeValuesChildMapRules(extra.mapRules);
      key.rules = [];
      delete key.formula;
      delete key.decimals;
    } else {
      key.parent = String(extra?.parent || '').trim();
      key.rules = normalizeValuesChildRules(extra?.rules);
      key.mapRules = [];
      delete key.formula;
      delete key.decimals;
    }
  };
  if (existing) {
    existing.rule = String(rule || '').trim();
    existing.type = type;
    if (type === VALUES_KEY_TYPE_CHILD) {
      applyChild(existing);
    } else {
      delete existing.parent;
      delete existing.rules;
      delete existing.mapRules;
      delete existing.formula;
      delete existing.decimals;
    }
    existing.updatedAt = now;
  } else {
    const key = { name: target, rule: String(rule || '').trim(), type, createdAt: now, updatedAt: now };
    if (type === VALUES_KEY_TYPE_CHILD) {
      applyChild(key);
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
// 父变量按派生规则自动计算——区间（rules，如 好感度 40 → 态度「颇具好感」）、
// 取值映射（mapRules，如 情欲等级「干柴烈火」→ 性爱态度「……」）或公式（formula）。
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

// 依赖指定变量的全部子变量（删除前的依赖检查用）：区间 / 取值映射派生按派生
// 源 parent 匹配，公式派生按公式引用变量匹配；内置子变量不参与检查。
function getValuesChildKeysByRef(ctx, varName) {
  const target = String(varName || '').trim();
  if (!target) return [];
  return getValuesKeys(ctx).filter((key) => {
    if (!isValuesChildKey(key) || isValuesBuiltinKey(key)) return false;
    const formula = String(key.formula || '').trim();
    if (formula !== '') {
      const syntax = validateValuesFormulaSyntax(formula);
      return syntax.ok ? syntax.refs.includes(target) : false;
    }
    return String(key.parent || '').trim() === target;
  });
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

// 归一化子变量取值映射规则：{ match?, value }，value 必填（输出文本），match
// 可省略（省略 = 兜底行：具名行都不匹配时输出）；非法条目丢弃。
function normalizeValuesChildMapRules(rules) {
  if (!Array.isArray(rules)) return [];
  const normalized = [];
  for (const item of rules) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const value = String(item.value ?? '').trim();
    if (value === '') continue;
    normalized.push({ match: String(item.match ?? '').trim(), value });
  }
  return normalized;
}

// 取值映射匹配判定：派生源当前值与映射值文本等值（去空白）或数值等值
// （85 与 "85" / 85.0 互相匹配）即命中；来源缺失不命中。
function valuesMapRuleMatches(sourceValue, matchText) {
  if (sourceValue === undefined || sourceValue === null) return false;
  const source = String(sourceValue).trim();
  const match = String(matchText ?? '').trim();
  if (source === match) return true;
  const a = toValuesNumeric(source);
  const b = toValuesNumeric(match);
  return a !== null && b !== null && a === b;
}

// 校验子变量取值映射规则：返回 { duplicates }。
// - duplicates：match 会命中同一来源取值的规则对下标（文本等值或数值等值，
//   如「干柴烈火」重复、100 与 100.0；两条兜底行同样算重复，兜底只允许一行）。
function validateValuesChildMapRules(rules) {
  const list = Array.isArray(rules) ? rules : [];
  const duplicates = [];
  for (let i = 0; i < list.length; i += 1) {
    const match = String(list[i]?.match ?? '').trim();
    for (let j = i + 1; j < list.length; j += 1) {
      const other = String(list[j]?.match ?? '').trim();
      if (match === '') {
        if (other === '') duplicates.push([i, j]);
      } else if (other !== '' && valuesMapRuleMatches(match, other)) {
        duplicates.push([i, j]);
      }
    }
  }
  return { duplicates };
}

// ---------- 子变量公式派生 ----------
// 公式 = 四则运算 + 括号 + 变量名（如 0.5*服从值+0.5*美貌值）。自写递归下降
// 解析器，白名单 token（数字 / + - * / ( ) / 变量名），不使用 eval，任意输入
// 都只会得到语法错误而非执行代码。变量名 = 不含空白、运算符、括号的连续字符
// 序列（支持中文）。AST：{ t:'num' } | { t:'var' } | { t:'neg' } | { t:'bin' }。
function tokenizeValuesFormula(input) {
  const tokens = [];
  let i = 0;
  const text = String(input || '');
  while (i < text.length) {
    const ch = text[i];
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i += 1;
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '(' || ch === ')') {
      tokens.push({ t: ch });
      i += 1;
      continue;
    }
    if (ch >= '0' && ch <= '9' || ch === '.') {
      let j = i;
      while (j < text.length && (text[j] >= '0' && text[j] <= '9' || text[j] === '.')) j += 1;
      const raw = text.slice(i, j);
      const num = Number(raw);
      if (!Number.isFinite(num)) return { error: `数字「${raw}」不合法` };
      tokens.push({ t: 'num', v: num });
      i = j;
      continue;
    }
    let j = i;
    while (j < text.length && !'+-*/(). \t\n\r'.includes(text[j])) j += 1;
    const name = text.slice(i, j).trim();
    if (name === '') return { error: '无法识别的字符' };
    tokens.push({ t: 'var', name });
    i = j;
  }
  return { tokens };
}

function parseValuesFormulaNode(tokens, state, minPrec) {
  let left = null;
  const first = tokens[state.pos];
  if (!first) return { error: '表达式不完整' };
  if (first.t === 'num') {
    left = { t: 'num', v: first.v };
    state.pos += 1;
  } else if (first.t === 'var') {
    left = { t: 'var', name: first.name };
    state.pos += 1;
  } else if (first.t === '(') {
    state.pos += 1;
    const inner = parseValuesFormulaNode(tokens, state, 0);
    if (inner.error) return inner;
    const close = tokens[state.pos];
    if (!close || close.t !== ')') return { error: '括号不匹配' };
    state.pos += 1;
    left = inner;
  } else if (first.t === '-') {
    state.pos += 1;
    const operand = parseValuesFormulaNode(tokens, state, 4);
    if (operand.error) return operand;
    left = { t: 'neg', v: operand };
  } else {
    return { error: `「${first.t}」位置缺少数字或变量` };
  }
  while (true) {
    const op = tokens[state.pos];
    if (!op || op.t === ')' ) break;
    const prec = op.t === '*' || op.t === '/' ? 2 : (op.t === '+' || op.t === '-' ? 1 : -1);
    if (prec < 0) return { error: `无法识别的运算符「${op.t}」` };
    if (prec < minPrec) break;
    state.pos += 1;
    const right = parseValuesFormulaNode(tokens, state, prec + 1);
    if (right.error) return right;
    left = { t: 'bin', op: op.t, l: left, r: right };
  }
  return left;
}

// 解析公式：成功返回 { ok:true, ast, refs }；失败返回 { ok:false, error }。
function validateValuesFormulaSyntax(formula) {
  const text = String(formula || '').trim();
  if (text === '') return { ok: false, error: '公式不能为空' };
  const tokenized = tokenizeValuesFormula(text);
  if (tokenized.error) return { ok: false, error: tokenized.error };
  const state = { pos: 0 };
  const ast = parseValuesFormulaNode(tokenized.tokens, state, 0);
  if (ast.error) return { ok: false, error: ast.error };
  if (state.pos < tokenized.tokens.length) return { ok: false, error: '公式末尾有多余内容' };
  const refs = [];
  const seen = new Set();
  const collect = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.t === 'var' && !seen.has(node.name)) {
      seen.add(node.name);
      refs.push(node.name);
    } else if (node.t === 'neg') {
      collect(node.v);
    } else if (node.t === 'bin') {
      collect(node.l);
      collect(node.r);
    }
  };
  collect(ast);
  return { ok: true, ast, refs };
}

// 变量值 → 数值：数字原样；字符串去空白后支持「%」后缀并按百分比小数参与
// 计算（如 43% → 0.43、89% → 0.89），转不出有限数返回 null。公式求值与
// 区间派生的父值转换共用。
function toValuesNumeric(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const isPercent = trimmed.endsWith('%');
    const normalized = isPercent ? trimmed.slice(0, -1).trim() : trimmed;
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed)) return null;
    return isPercent ? parsed / 100 : parsed;
  }
  return null;
}

// 公式结果保留小数位：归一化 decimals（0~6 的整数，其余返回 null）。
function toValuesDecimals(value) {
  if (typeof value !== 'number') {
    if (typeof value !== 'string' || value.trim() === '') return null;
    value = Number(value);
  }
  if (!Number.isInteger(value) || value < 0 || value > 6) return null;
  return value;
}

// 四舍五入到指定小数位（half away from zero，负数如 -0.5 → -1）；
// + EPSILON 抵消 1.005*100 = 100.499… 这类浮点误差。
function roundValuesResult(value, digits) {
  if (!Number.isFinite(value)) return null;
  const factor = Math.pow(10, digits);
  return Math.sign(value) * Math.round((Math.abs(value) + Number.EPSILON) * factor) / factor;
}

// 求值公式 AST：lookup(name) 返回变量原始值（数字或字符串，缺失 / 非数值返回
// null）；除零、结果非有限都视为求值失败返回 null（保持原值）。
function evalValuesFormula(ast, lookup) {
  if (!ast || typeof ast !== 'object') return null;
  if (ast.t === 'num') return ast.v;
  if (ast.t === 'var') {
    return toValuesNumeric(lookup ? lookup(ast.name) : null);
  }
  if (ast.t === 'neg') {
    const v = evalValuesFormula(ast.v, lookup);
    return v === null ? null : -v;
  }
  if (ast.t === 'bin') {
    const l = evalValuesFormula(ast.l, lookup);
    const r = evalValuesFormula(ast.r, lookup);
    if (l === null || r === null) return null;
    if (ast.op === '+') return l + r;
    if (ast.op === '-') return l - r;
    if (ast.op === '*') return l * r;
    if (ast.op === '/') return r === 0 ? null : l / r;
    return null;
  }
  return null;
}

// 子变量引用图环检测：从指定键（name，引用为 refs）出发，沿「区间派生源 /
// 公式引用」追踪所有已注册子变量，若绕回起点即成环。返回环链（如
// ['A','B','A']）或 null。
function findValuesChildCycle(keys, name, refs) {
  const target = String(name || '').trim();
  if (!target) return null;
  const byName = new Map();
  for (const key of Array.isArray(keys) ? keys : []) {
    if (isValuesChildKey(key)) byName.set(String(key.name || '').trim(), key);
  }
  const refsOf = (key) => {
    const formula = String(key?.formula || '').trim();
    if (formula !== '') {
      const syntax = validateValuesFormulaSyntax(formula);
      return syntax.ok ? syntax.refs : [];
    }
    const parent = String(key?.parent || '').trim();
    return parent ? [parent] : [];
  };
  const path = [target];
  const stack = new Set([target]);
  const walk = (currentRefs) => {
    for (const ref of currentRefs) {
      if (ref === target) return path.concat(ref);
      if (stack.has(ref)) continue;
      const next = byName.get(ref);
      if (!next) continue;
      stack.add(ref);
      path.push(ref);
      const cycle = walk(refsOf(next));
      if (cycle) return cycle;
      path.pop();
      stack.delete(ref);
    }
    return null;
  };
  return walk(refs);
}

// 单叶子派生：按子变量派生方式计算子变量值（就地写入）。
// 公式模式（formula 非空）：用同路径下各引用变量求值，写数值；
// 区间模式：按 parent 值顺序匹配规则，写文本；取值映射模式（mapRules 非空）：
// 按 parent 值等值匹配（先具名行后兜底行），写文本。输入缺失 / 非数值 /
// 求值失败 / 无规则命中时保持原值。
function deriveValuesChildAt(tree, path, childKey) {
  if (!Array.isArray(path) || path.length === 0) return false;
  const formula = String(childKey?.formula || '').trim();
  if (formula !== '') {
    const syntax = validateValuesFormulaSyntax(formula);
    if (!syntax.ok) return false;
    const lookup = (varName) => valuesGetAtPath(tree, path.slice(0, -1).concat(varName));
    const result = evalValuesFormula(syntax.ast, lookup);
    if (result === null || !Number.isFinite(result)) return false;
    // 按小数位设置四舍五入写入（默认取整，decimals 归一化在 getValuesKeys）。
    const digits = toValuesDecimals(childKey?.decimals);
    const stored = digits === null ? result : roundValuesResult(result, digits);
    if (stored === null || !Number.isFinite(stored)) return false;
    valuesSetAtPath(tree, path, stored);
    return true;
  }
  const parentName = String(childKey?.parent || '').trim();
  if (!parentName) return false;
  const parentValue = valuesGetAtPath(tree, path.slice(0, -1).concat(parentName));
  const mapRules = Array.isArray(childKey?.mapRules) ? childKey.mapRules : [];
  if (mapRules.length > 0) {
    for (const rule of mapRules) {
      const match = String(rule?.match ?? '').trim();
      if (match === '') continue;
      if (valuesMapRuleMatches(parentValue, match)) {
        valuesSetAtPath(tree, path, String(rule.value));
        return true;
      }
    }
    for (const rule of mapRules) {
      if (String(rule?.match ?? '').trim() === '') {
        valuesSetAtPath(tree, path, String(rule.value));
        return true;
      }
    }
    return false;
  }
  const numeric = toValuesNumeric(parentValue);
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
// 容器与父变量原样保留。用于 AI 维护：子变量是派生变量由系统计算，对 AI 只读，
// 发给 AI 的补丁解析时用它剔除子变量，AI 对子变量的修改一律无视。
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

// 新建条目追加到父路径顺序表末尾：新建的节点 / 变量排在该层条目序列的最后，
// 而不是混进未记录条目的名称排序里。父路径未记录过顺序时先按当前显示顺序
// 固化，保证新条目之前的相对顺序不变。
function appendValuesTreeOrder(ctx, tree, parentPath, newName) {
  const key = Array.isArray(parentPath) ? parentPath.join('/') : String(parentPath || '');
  const node = valuesGetAtPath(tree, Array.isArray(parentPath) ? parentPath : []);
  const names = valuesOrderedNames(getValuesTreeOrder(ctx), key, node)
    .filter((item) => item !== newName);
  names.push(newName);
  return reorderValuesTreeAt(ctx, key, names);
}

// ---------- 注入提示词配置（默认数值层勾选）----------
// 配置存变量包 inject 字段：{ enabled, paths }。paths 是打开条目的路径数组
// （path.join('/')），节点上下级联动：打开条目 = 自身 + 全部祖先 + 全部后代
// 打开，关闭条目 = 自身 + 全部后代关闭；随角色卡 / 全局设置保存。
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

// 打开 / 关闭一个条目（节点上下级联动，打开与关闭对称）：
// - 打开条目 = 自身 + 全部祖先 + 全部后代打开（打开节点 = 子树全部勾选）；
// - 关闭条目 = 自身 + 全部后代关闭（上级关闭 → 下级全部关闭）。
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
    // 打开节点时级联打开全部后代条目（含嵌套节点），与关闭时的级联对称。
    const tree = getValuesDefaults(ctx);
    const node = valuesGetAtPath(tree, segments);
    if (node !== undefined && valuesIsContainer(node)) {
      const collect = (container, prefix) => {
        for (const name of Object.keys(container)) {
          const childPath = prefix.concat(name);
          const childKey = childPath.join('/');
          if (!config.paths.includes(childKey)) config.paths.push(childKey);
          const child = container[name];
          if (valuesIsContainer(child)) collect(child, childPath);
        }
      };
      collect(node, segments);
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
  const keys = Array.isArray(bundle.keys) ? bundle.keys : [];
  if (keys.length === 0) {
    lines.push('keys: []');
  } else {
    lines.push('keys:');
    for (const key of keys) {
    lines.push(`  - name: ${yamlScalar(String(key?.name || ''))}`);
    if (isValuesChildKey(key)) {
      lines.push('    type: child');
      const formula = String(key?.formula || '').trim();
      if (formula !== '') {
        lines.push(`    formula: ${yamlScalar(formula)}`);
        const decimals = toValuesDecimals(key?.decimals);
        lines.push(`    decimals: ${decimals === null ? 0 : decimals}`);
      } else if (Array.isArray(key?.mapRules) && key.mapRules.length > 0) {
        lines.push(`    parent: ${yamlScalar(String(key?.parent || ''))}`);
        lines.push('    mapRules:');
        for (const rule of key.mapRules) {
          lines.push(`      - match: ${yamlScalar(String(rule?.match ?? ''))}`);
          lines.push(`        value: ${yamlScalar(String(rule?.value ?? ''))}`);
        }
      } else {
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
      }
    } else {
      lines.push('    type: parent');
      lines.push(`    rule: ${yamlBlockScalarText(String(key?.rule || ''), '    ')}`);
    }
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
      lines.push('    effects:');
      const effects = Array.isArray(trigger?.effects) ? trigger.effects : [];
      if (effects.length === 0) {
        lines.push('      []');
      } else {
        for (const effect of effects) {
          lines.push(`      - path: ${yamlScalar(String(effect?.path || ''))}`);
          lines.push(`        op: ${yamlScalar(String(effect?.op || 'set').trim())}`);
          lines.push(`        value: ${yamlValueScalar(effect?.value)}`);
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
  // != null：缺省与旧版导出的裸 keys:（解析为 null）都视为无键。
  if (parsed.keys != null) {
    if (!Array.isArray(parsed.keys)) throw new Error('keys 必须是列表');
    for (const item of parsed.keys) {
      const name = String(item?.name || '').trim();
      if (!name) throw new Error('变量缺少 name');
      const type = String(item?.type || '').trim() === VALUES_KEY_TYPE_CHILD ? VALUES_KEY_TYPE_CHILD : VALUES_KEY_TYPE_PARENT;
      const key = { name, type };
      if (type === VALUES_KEY_TYPE_CHILD) {
        const formula = String(item?.formula || '').trim();
        if (formula !== '') {
          key.formula = formula;
          key.parent = '';
          key.rules = [];
          const decimals = toValuesDecimals(item?.decimals);
          key.decimals = decimals === null ? 0 : decimals;
        } else if (item?.mapRules !== undefined) {
          if (!Array.isArray(item.mapRules)) throw new Error(`变量「${name}」的 mapRules 必须是列表`);
          key.parent = String(item?.parent || '').trim();
          key.mapRules = normalizeValuesChildMapRules(item.mapRules);
        } else {
          key.parent = String(item?.parent || '').trim();
          key.rules = normalizeValuesChildRules(item?.rules);
        }
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
      const effects = [];
      if (item.effects !== undefined) {
        if (!Array.isArray(item.effects)) throw new Error(`触发「${id}」的 effects 必须是列表`);
        for (const effect of item.effects) {
          if (!effect || typeof effect !== 'object' || Array.isArray(effect)) continue;
          const path = String(effect.path || '').trim();
          if (!path) continue;
          effects.push({
            path,
            op: String(effect.op || '').trim() === 'set' ? 'set' : 'add',
            value: effect.value !== undefined ? effect.value : null,
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
        effects,
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
        const formula = String(key.formula || '').trim();
        if (formula !== '') {
          existing.formula = formula;
          const decimals = toValuesDecimals(key.decimals);
          existing.decimals = decimals !== null ? decimals : 0;
          existing.parent = '';
          existing.rules = [];
          existing.mapRules = [];
        } else if (Array.isArray(key.mapRules) && key.mapRules.length > 0) {
          existing.parent = String(key.parent || '').trim();
          existing.mapRules = normalizeValuesChildMapRules(key.mapRules);
          existing.rules = [];
          delete existing.formula;
          delete existing.decimals;
        } else {
          existing.parent = String(key.parent || '').trim();
          existing.rules = normalizeValuesChildRules(key.rules);
          existing.mapRules = [];
          delete existing.formula;
          delete existing.decimals;
        }
      } else {
        delete existing.parent;
        delete existing.rules;
        delete existing.mapRules;
        delete existing.formula;
        delete existing.decimals;
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
