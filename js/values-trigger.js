// ===== 万华镜（Kaleidoscope）剧情触发：变量条件确定性触发 =====
// 与「剧情脉络」互补：剧情脉络由预筛 AI 依据对话判断触发；剧情触发不依赖 API，
// 直接按「某节点下变量的当前值」是否满足预设条件，确定性判定剧情事件是否触发。
// 注入方式（常驻，与变量注入 / 隔壁 BS BioTracker 同款模型）：条件满足的事件以
// <Story_Trigger> 块（IN_CHAT, SYSTEM）常驻挂在提示词上——数据变更（AI 维护 /
// 手动改值 / 触发效果 / 导入）立即重刷，不再等点击发送；生成结束只重刷不清空，
// swipe / 重新生成照常携带本轮事件。
// 副作用与注入分离：判定与注入**无副作用**（纯读）；事件效果（改值）与一次性事件
// 关闭只在「用户点击发送」的发送前任务里各执行一次（见文件末尾 runValuesTriggerBarrierTask）。
// 数据存储：随变量包（角色卡 kaleidoscope_values / 全局设置 valuesData）的
// triggers 字段保存，随角色卡导入/导出自动携带；YAML 导入导出见 values-data.js。

// ---------- 数据读写 ----------
function getValuesTriggers(ctx) {
  const bundle = ctx ? getValuesBundle(ctx) : null;
  if (!bundle) return [];
  if (!Array.isArray(bundle.triggers)) bundle.triggers = [];
  return bundle.triggers;
}

function getValuesTriggerById(ctx, id) {
  return getValuesTriggers(ctx).find((trigger) => trigger.id === id) || null;
}

// ---------- 事件分类 ----------
// 分类（categories）：把触发事件分组展示，语义与剧情脉络的节点一致——
// 分类行可展开 / 收起、可整体启停（关闭 = 其下事件不参与判定），删除分类时
// 其下事件转为「未分类」，事件本身不删除。数据随变量包 categories 字段保存；
// 旧存档 / 旧 YAML 没有该字段时归一化为空数组，trigger.categoryId 缺省为空
// （= 未分类），保证旧数据照常加载、照常判定。
function getValuesTriggerCategories(ctx) {
  const bundle = ctx ? getValuesBundle(ctx) : null;
  if (!bundle) return [];
  if (!Array.isArray(bundle.categories)) bundle.categories = [];
  return bundle.categories;
}

function getValuesTriggerCategoryById(ctx, id) {
  const target = String(id || '').trim();
  if (!target) return null;
  return getValuesTriggerCategories(ctx).find((category) => category.id === target) || null;
}

// 指定分类的直接子分类（按创建顺序）。
function getValuesTriggerCategoryChildren(ctx, parentId) {
  const target = String(parentId || '').trim();
  return getValuesTriggerCategories(ctx)
    .filter((category) => String(category.parentId || '').trim() === target);
}

// 全部顶层分类（parentId 为空或父分类已不存在）。
function getValuesTriggerRootCategories(ctx) {
  const categories = getValuesTriggerCategories(ctx);
  const known = new Set(categories.map((category) => String(category.id || '').trim()));
  return categories.filter((category) => {
    const parentId = String(category.parentId || '').trim();
    return !parentId || !known.has(parentId);
  });
}

// 同级重排（拖动排序用）：只重排「同一父分类下（parentId 为空 = 顶层）」的分类，
// 其余分类的相对顺序不变——整体插入到原组成员序列的起始位置。
// 与事件的组内重排同构：分类在界面上是树，同级才有顺序可言。
function reorderValuesTriggerCategories(ctx, parentId, ids) {
  const categories = getValuesTriggerCategories(ctx);
  const target = String(parentId || '').trim();
  const members = categories.filter((category) => String(category.parentId || '').trim() === target);
  if (members.length === 0) return categories;
  const memberIds = new Set(members.map((category) => String(category?.id || '').trim()));
  const byId = new Map(members.map((category) => [String(category?.id || '').trim(), category]));
  const wanted = Array.isArray(ids) ? ids.map((id) => String(id || '').trim()).filter(Boolean) : [];
  const group = [];
  const seen = new Set();
  for (const id of wanted) {
    const category = byId.get(id);
    if (category && !seen.has(id)) {
      group.push(category);
      seen.add(id);
    }
  }
  for (const category of members) {
    const id = String(category?.id || '').trim();
    if (!seen.has(id)) group.push(category);
  }
  const rest = categories.filter((category) => !memberIds.has(String(category?.id || '').trim()));
  const firstIndex = categories.findIndex((category) => memberIds.has(String(category?.id || '').trim()));
  let insertAt = 0;
  for (let i = 0; i < firstIndex; i += 1) {
    if (!memberIds.has(String(categories[i]?.id || '').trim())) insertAt += 1;
  }
  rest.splice(Math.min(insertAt, rest.length), 0, ...group);
  categories.length = 0;
  for (const category of rest) categories.push(category);
  saveValuesData(ctx);
  return categories;
}

// parentId 是否为 categoryId 的祖先（沿父链向上查，防环）。categoryId 为空时恒为否。
function isValuesTriggerCategoryAncestor(ctx, ancestorId, categoryId) {
  const ancestor = String(ancestorId || '').trim();
  if (!ancestor) return false;
  let current = getValuesTriggerCategoryById(ctx, categoryId);
  let guard = 0;
  while (current && guard < 1000) {
    if (current.id === ancestor) return true;
    current = getValuesTriggerCategoryById(ctx, String(current.parentId || ''));
    guard += 1;
  }
  return false;
}

// 计算分类可用的 parentId：空 = 顶层；指向自己或自己的后代 = 回退顶层；
// 指向不存在的分类 = 回退顶层。excludeId 为正在编辑的分类自身 id（允许保持原父级）。
function resolveValuesTriggerCategoryParent(ctx, requested, excludeId) {
  const target = String(requested ?? '').trim();
  if (!target) return '';
  if (excludeId && target === String(excludeId).trim()) return '';
  if (isValuesTriggerCategoryAncestor(ctx, String(excludeId || '').trim(), target)) return '';
  return getValuesTriggerCategoryById(ctx, target) ? target : '';
}

// 分类 ID：默认从 C001 开始逐次递增；excludeId 为正在编辑的分类自身 id（不计入）。
function nextValuesTriggerCategoryId(ctx, excludeId) {
  const categories = getValuesTriggerCategories(ctx);
  let max = 0;
  for (const category of categories) {
    if (category.id === excludeId) continue;
    const match = /(?:^|\D)C(\d+)$/.exec(String(category.id || ''));
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return 'C' + String(max + 1).padStart(3, '0');
}

// 计算分类实际使用的 id：给定 id 非空且未被占用则沿用；为空或重复时自动顺延。
function resolveValuesTriggerCategoryId(ctx, requested, excludeId) {
  const categories = getValuesTriggerCategories(ctx);
  const used = new Set();
  for (const category of categories) {
    if (category.id !== excludeId) used.add(category.id);
  }
  const candidate = String(requested ?? '').trim();
  if (candidate && !used.has(candidate)) return candidate;
  let id = nextValuesTriggerCategoryId(ctx, excludeId);
  while (used.has(id)) {
    const match = /C(\d+)$/.exec(id);
    id = 'C' + String((match ? parseInt(match[1], 10) : 0) + 1).padStart(3, '0');
  }
  return id;
}

// 归一化单条分类：补全字段。
function normalizeValuesTriggerCategory(raw) {
  const now = new Date().toISOString();
  return {
    id: String(raw?.id || '').trim(),
    parentId: String(raw?.parentId || '').trim(),
    name: String(raw?.name || '').trim() || '未命名分类',
    enabled: raw?.enabled !== false,
    description: String(raw?.description || '').trim(),
    createdAt: String(raw?.createdAt || '').trim() || now,
    updatedAt: String(raw?.updatedAt || '').trim() || now,
  };
}

function createValuesTriggerCategory(ctx, data) {
  const categories = getValuesTriggerCategories(ctx);
  const now = new Date().toISOString();
  const category = {
    ...normalizeValuesTriggerCategory(data),
    id: resolveValuesTriggerCategoryId(ctx, data?.id, ''),
    // 父分类无效（不存在 / 指向自己）时回退顶层。
    parentId: resolveValuesTriggerCategoryParent(ctx, data?.parentId, ''),
    createdAt: now,
    updatedAt: now,
  };
  categories.push(category);
  saveValuesData(ctx);
  return category;
}

function updateValuesTriggerCategory(ctx, id, data) {
  const category = getValuesTriggerCategoryById(ctx, id);
  if (!category) return null;
  if (data && typeof data === 'object') {
    if (data.name !== undefined) category.name = String(data.name).trim() || category.name;
    if (data.description !== undefined) category.description = String(data.description).trim();
    if (data.enabled !== undefined) category.enabled = Boolean(data.enabled);
    if (data.parentId !== undefined) {
      category.parentId = resolveValuesTriggerCategoryParent(
        ctx, data.parentId, id,
      );
    }
  }
  category.updatedAt = nowIso();
  saveValuesData(ctx);
  return category;
}

// 删除分类（与剧情脉络删节点同语义）：子分类上提到被删分类的原父级下，
// 其下事件转为「未分类」（categoryId 清空），事件本身不删除。
// 返回 { detachedTriggers, movedCategories }。
function deleteValuesTriggerCategory(ctx, id) {
  const categories = getValuesTriggerCategories(ctx);
  const index = categories.findIndex((category) => category.id === id);
  if (index < 0) return { detachedTriggers: [], movedCategories: 0 };
  const parentId = String(categories[index].parentId || '');
  categories.splice(index, 1);
  let movedCategories = 0;
  const now = nowIso();
  for (const child of categories) {
    if (String(child.parentId || '') === id) {
      child.parentId = parentId;
      child.updatedAt = now;
      movedCategories += 1;
    }
  }
  const detachedTriggers = [];
  for (const trigger of getValuesTriggers(ctx)) {
    if (String(trigger.categoryId || '').trim() === id) {
      trigger.categoryId = '';
      trigger.updatedAt = now;
      detachedTriggers.push(trigger.id);
    }
  }
  saveValuesData(ctx);
  return { detachedTriggers, movedCategories };
}

// 分类启用开关：关闭后其下事件不再参与判定；再点一次重新激活。
function toggleValuesTriggerCategoryEnabled(ctx, id) {
  const category = getValuesTriggerCategoryById(ctx, id);
  if (!category) return null;
  category.enabled = category.enabled === false;
  category.updatedAt = nowIso();
  saveValuesData(ctx);
  return category;
}

// 分类是否激活（级联）：分类不存在视为激活；祖先链上任一分类停用即视为停用。
function isValuesTriggerCategoryActive(ctx, trigger) {
  const id = String(trigger?.categoryId || '').trim();
  if (!id) return true;
  let current = getValuesTriggerCategoryById(ctx, id);
  let guard = 0;
  while (current && guard < 1000) {
    if (current.enabled === false) return false;
    current = getValuesTriggerCategoryById(ctx, String(current.parentId || ''));
    guard += 1;
  }
  return true;
}

// 指定分类下的触发（按创建顺序）；uncategorized 为 true 时返回未分类事件。
function getValuesTriggersByCategory(ctx, categoryId) {
  const target = String(categoryId || '').trim();
  return getValuesTriggers(ctx).filter(
    (trigger) => String(trigger.categoryId || '').trim() === target,
  );
}

// 按 id 重排触发列表顺序（拖动排序用）；未列出的触发按原相对顺序追加在末尾。
function reorderValuesTriggers(ctx, ids) {
  const triggers = getValuesTriggers(ctx);
  const wanted = Array.isArray(ids) ? ids.map((id) => String(id || '').trim()).filter(Boolean) : [];
  const byId = new Map(triggers.map((trigger) => [String(trigger?.id || '').trim(), trigger]));
  const reordered = [];
  const seen = new Set();
  for (const id of wanted) {
    const trigger = byId.get(id);
    if (trigger && !seen.has(id)) {
      reordered.push(trigger);
      seen.add(id);
    }
  }
  for (const trigger of triggers) {
    const id = String(trigger?.id || '').trim();
    if (!seen.has(id)) reordered.push(trigger);
  }
  triggers.length = 0;
  for (const trigger of reordered) triggers.push(trigger);
  saveValuesData(ctx);
  return triggers;
}

// 组内重排（拖动排序用）：只重排「指定分类下（categoryId 为空 = 未分类）」的
// 触发，其余触发的相对顺序不变——整体插入到原组成员序列的起始位置。
function reorderValuesTriggersInCategory(ctx, categoryId, ids) {
  const triggers = getValuesTriggers(ctx);
  const target = String(categoryId || '').trim();
  const members = triggers.filter((trigger) => String(trigger.categoryId || '').trim() === target);
  if (members.length === 0) return triggers;
  const memberIds = new Set(members.map((trigger) => String(trigger?.id || '').trim()));
  const byId = new Map(members.map((trigger) => [String(trigger?.id || '').trim(), trigger]));
  const wanted = Array.isArray(ids) ? ids.map((id) => String(id || '').trim()).filter(Boolean) : [];
  const group = [];
  const seen = new Set();
  for (const id of wanted) {
    const trigger = byId.get(id);
    if (trigger && !seen.has(id)) {
      group.push(trigger);
      seen.add(id);
    }
  }
  for (const trigger of members) {
    const id = String(trigger?.id || '').trim();
    if (!seen.has(id)) group.push(trigger);
  }
  const rest = triggers.filter((trigger) => !memberIds.has(String(trigger?.id || '').trim()));
  const firstIndex = triggers.findIndex((trigger) => memberIds.has(String(trigger?.id || '').trim()));
  let insertAt = 0;
  for (let i = 0; i < firstIndex; i += 1) {
    if (!memberIds.has(String(triggers[i]?.id || '').trim())) insertAt += 1;
  }
  rest.splice(Math.min(insertAt, rest.length), 0, ...group);
  triggers.length = 0;
  for (const trigger of rest) triggers.push(trigger);
  saveValuesData(ctx);
  return triggers;
}

// 触发 ID：默认从 001 开始逐次递增；excludeId 为正在编辑的触发自身 id（不计入）。
function nextValuesTriggerId(ctx, excludeId) {
  const triggers = getValuesTriggers(ctx);
  let max = 0;
  for (const trigger of triggers) {
    if (trigger.id === excludeId) continue;
    const match = /(?:^|\D)(\d+)$/.exec(String(trigger.id || ''));
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return String(max + 1).padStart(3, '0');
}

// 计算触发实际使用的 id：给定 id 非空且未被占用则沿用；为空或与其他触发重复时，
// 按 001 序列自动顺延到未注册的 id。excludeId 为正在编辑的触发自身 id。
function resolveValuesTriggerId(ctx, requested, excludeId) {
  const triggers = getValuesTriggers(ctx);
  const used = new Set();
  for (const trigger of triggers) {
    if (trigger.id !== excludeId) used.add(trigger.id);
  }
  const candidate = String(requested ?? '').trim();
  if (candidate && !used.has(candidate)) return candidate;
  let id = nextValuesTriggerId(ctx, excludeId);
  while (used.has(id)) {
    const match = /(\d+)$/.exec(id);
    id = String((match ? parseInt(match[1], 10) : 0) + 1).padStart(3, '0');
  }
  return id;
}

// 归一化单条触发：补全字段、过滤非法条件（空路径丢弃）、归一化事件效果。
// categoryId 缺省为空（= 未分类）：旧存档无此字段照常加载。
function normalizeValuesTrigger(raw) {
  const conditions = Array.isArray(raw?.conditions) ? raw.conditions : [];
  const effects = Array.isArray(raw?.effects) ? raw.effects : [];
  return {
    id: String(raw?.id || '').trim(),
    name: String(raw?.name || '').trim() || '未命名触发',
    enabled: raw?.enabled !== false,
    once: raw?.once !== false,
    logic: String(raw?.logic || 'all').trim() === 'any' ? 'any' : 'all',
    categoryId: String(raw?.categoryId || '').trim(),
    description: String(raw?.description || '').trim(),
    conditions: conditions
      .filter((condition) => condition && typeof condition === 'object' && !Array.isArray(condition))
      .map((condition) => ({
        path: String(condition?.path || '').trim(),
        op: String(condition?.op || '==').trim(),
        value: condition?.value !== undefined ? condition.value : null,
      }))
      .filter((condition) => condition.path !== ''),
    effects: effects
      .filter((effect) => effect && typeof effect === 'object' && !Array.isArray(effect))
      .map((effect) => ({
        path: String(effect?.path || '').trim(),
        op: String(effect?.op || '').trim() === 'set' ? 'set' : 'add',
        value: effect?.value !== undefined ? effect.value : null,
      }))
      .filter((effect) => effect.path !== ''),
    content: String(raw?.content || ''),
  };
}

function createValuesTrigger(ctx, data) {
  const triggers = getValuesTriggers(ctx);
  const now = new Date().toISOString();
  const trigger = {
    ...normalizeValuesTrigger(data),
    id: resolveValuesTriggerId(ctx, data?.id, ''),
    createdAt: now,
    updatedAt: now,
  };
  triggers.push(trigger);
  saveValuesData(ctx);
  return trigger;
}

function updateValuesTrigger(ctx, id, data) {
  const trigger = getValuesTriggerById(ctx, id);
  if (!trigger) return null;
  const next = normalizeValuesTrigger({ ...trigger, ...data, id: trigger.id });
  if (data?.id !== undefined && String(data.id).trim() !== trigger.id) {
    next.id = resolveValuesTriggerId(ctx, data.id, id);
  }
  Object.assign(trigger, next, { updatedAt: new Date().toISOString() });
  saveValuesData(ctx);
  return trigger;
}

function deleteValuesTrigger(ctx, id) {
  const triggers = getValuesTriggers(ctx);
  const index = triggers.findIndex((trigger) => trigger.id === id);
  if (index < 0) return false;
  triggers.splice(index, 1);
  saveValuesData(ctx);
  return true;
}

// 一次性事件触发后自动关闭：把已触发的一次性事件置为停用并持久化，
// 返回被自动关闭的触发 id 列表。常驻事件（once === false）不受影响。
function autoDisableFiredValuesTriggers(ctx, triggered) {
  const disabled = [];
  for (const trigger of Array.isArray(triggered) ? triggered : []) {
    if (trigger.once !== false) {
      trigger.enabled = false;
      trigger.updatedAt = new Date().toISOString();
      disabled.push(trigger.id);
    }
  }
  if (disabled.length > 0) saveValuesData(ctx);
  return disabled;
}

// 触发启用开关：关闭后该触发不再参与判定；再点一次重新激活。
function toggleValuesTriggerEnabled(ctx, id) {
  const trigger = getValuesTriggerById(ctx, id);
  if (!trigger) return null;
  trigger.enabled = trigger.enabled === false;
  trigger.updatedAt = new Date().toISOString();
  saveValuesData(ctx);
  return trigger;
}

// ---------- 条件求值 ----------
// 运算符：== != > >= < <= contains exists not exists。
// 语义：路径不存在（变量未定义）时除 exists / not exists 外一律不满足；
// 数值与数值按数字比较，字符串与字符串按文本比较，混合时先尝试转数字。
function evaluateValuesCondition(value, op, expected) {
  const operator = String(op || '==').trim();
  const defined = value !== undefined && value !== null;
  if (operator === 'exists') return defined;
  if (operator === 'not exists') return !defined;
  if (!defined) return false;
  if (operator === 'contains') {
    return String(value).includes(String(expected ?? ''));
  }
  const left = value;
  const right = expected;
  const leftNum = typeof left === 'number' ? left : Number(left);
  const rightNum = typeof right === 'number' ? right : Number(right);
  const numeric = (typeof left === 'number' || typeof right === 'number')
    ? Number.isFinite(leftNum) && Number.isFinite(rightNum)
    : false;
  const a = numeric ? leftNum : String(left);
  const b = numeric ? rightNum : String(right);
  switch (operator) {
    case '==': return numeric ? a === b : String(left) === String(right);
    case '!=': return numeric ? a !== b : String(left) !== String(right);
    case '>': return a > b;
    case '>=': return a >= b;
    case '<': return a < b;
    case '<=': return a <= b;
    default: return false;
  }
}

// 单条触发判定：全部条件按 logic（all=且 / any=或）组合；无条件恒不触发。
function evaluateValuesTrigger(ctx, trigger) {
  const tree = getValuesGameTree(ctx);
  const conditions = Array.isArray(trigger?.conditions) ? trigger.conditions : [];
  if (conditions.length === 0) return false;
  const results = conditions.map((condition) => {
    const path = String(condition?.path || '').split('/').filter(Boolean);
    const value = valuesGetAtPath(tree, path);
    return evaluateValuesCondition(value, condition?.op, condition?.value);
  });
  return String(trigger?.logic || 'all') === 'any' ? results.some(Boolean) : results.every(Boolean);
}

// 当前满足条件且启用的触发（按创建顺序）：挂接分类被关闭的事件不参与判定
// （分类被删除 / 未分类恒有效，与剧情脉络节点启停语义一致）。
function evaluateValuesTriggers(ctx) {
  return getValuesTriggers(ctx).filter((trigger) => {
    if (trigger.enabled === false) return false;
    if (!isValuesTriggerCategoryActive(ctx, trigger)) return false;
    return evaluateValuesTrigger(ctx, trigger);
  });
}

// 条件摘要文本：张三/好感 ≥ 70 且 张三/是否已知真相 ＝ true（运算符用符号展示）。
function formatValuesTriggerConditions(trigger) {
  const conditions = Array.isArray(trigger?.conditions) ? trigger.conditions : [];
  const parts = conditions.map((condition) => {
    const path = String(condition?.path || '');
    const op = String(condition?.op || '==').trim();
    const display = typeof valuesTriggerOpDisplay === 'function' ? valuesTriggerOpDisplay(op) : op;
    if (op === 'exists' || op === 'not exists') return `${path} ${display}`;
    const value = condition?.value;
    const valueText = value === null || value === undefined ? 'null' : String(value);
    return `${path} ${display} ${valueText}`;
  });
  if (parts.length === 0) return '（无条件）';
  const joiner = String(trigger?.logic || 'all') === 'any' ? ' 或 ' : ' 且 ';
  return parts.join(joiner);
}

// 效果摘要文本：张三/好感 +30；曹操/病 → 已治好。
function formatValuesTriggerEffects(trigger) {
  const effects = Array.isArray(trigger?.effects) ? trigger.effects : [];
  const parts = effects.map((effect) => {
    const path = String(effect?.path || '');
    if (String(effect?.op || 'set').trim() === 'add') {
      const value = effect?.value;
      const num = typeof value === 'number' ? value : Number(value);
      const delta = Number.isFinite(num) ? (num > 0 ? '+' + num : String(num)) : String(value ?? '');
      return `${path} ${delta}`;
    }
    const value = effect?.value;
    const valueText = value === null || value === undefined ? 'null' : String(value);
    return `${path} → ${valueText}`;
  });
  return parts.length === 0 ? '' : '效果：' + parts.join('；');
}

// ---------- 事件效果 ----------
// 触发后确定性修改游戏值：add = 加减（正加负减，当前值与效果值都需可转数字）；
// set = 覆盖（数字 / 文本 / 布尔 / null 均可）。效果对象只允许父变量叶子——
// 注册为子变量的叶子（由父变量派生）与树中的节点 / 容器一律跳过。
// 有改动时重算子变量并落盘（与 AI 维护管线同款收尾）；返回 { changed, skipped }。
function applyValuesTriggerEffects(ctx, triggered) {
  const changed = [];
  const skipped = [];
  const effects = [];
  for (const trigger of Array.isArray(triggered) ? triggered : []) {
    for (const effect of Array.isArray(trigger?.effects) ? trigger.effects : []) {
      const path = String(effect?.path || '').split('/').filter(Boolean);
      if (path.length === 0) continue;
      const leafKey = ctx ? getValuesKeyByName(ctx, path[path.length - 1]) : null;
      if (leafKey && isValuesChildKey(leafKey)) {
        skipped.push(`${path.join('/')}（子变量由父变量派生，不可直接修改）`);
        continue;
      }
      effects.push({ triggerId: trigger.id, path, op: String(effect?.op || 'set').trim(), value: effect?.value });
    }
  }
  if (effects.length === 0) return { changed, skipped };
  const tree = getValuesGameTree(ctx);
  const toNumber = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && String(value).trim() !== '') return Number(value);
    return NaN;
  };
  for (const effect of effects) {
    const current = valuesGetAtPath(tree, effect.path);
    if (valuesIsContainer(current)) {
      skipped.push(`${effect.path.join('/')}（节点不是变量，不可直接修改）`);
      continue;
    }
    let next;
    if (effect.op === 'add') {
      const currentNum = toNumber(current);
      const delta = toNumber(effect.value);
      if (!Number.isFinite(currentNum) || !Number.isFinite(delta)) {
        skipped.push(`${effect.path.join('/')}（加减值需要数字，当前值或效果值不可转数字）`);
        continue;
      }
      next = currentNum + delta;
    } else {
      next = effect.value;
    }
    valuesSetAtPath(tree, effect.path, next);
    changed.push(effect.path.join('/'));
  }
  if (changed.length > 0) {
    deriveValuesChildren(tree, ctx ? getValuesKeys(ctx) : []);
    saveValuesChatState(ctx, tree, {});
  }
  return { changed, skipped };
}

// ---------- 注入 ----------
// 注入块：<Story_Trigger> 块 + 说明 + 每个满足条件的事件（含触发条件 / 说明 / 正文）。
// 与剧情预筛的 <Story_Event> 同款强制指令，保证主模型真实落地事件内容。
function buildValuesTriggerInjectionText(ctx, triggers) {
  const lines = [
    '<Story_Trigger>',
    '【系统导演注 · 强制指令】本块不是剧情正文，也不是任何角色的台词、旁白或可引用文本；它是系统在发送前依据「变量条件」确定性判定「本轮应该触发的剧情事件」（相关变量的当前值已满足预设条件）。以下规则必须逐条执行，不得忽略、不得淡化，不得以任何理由整体弃用。',
    '',
    '执行规则：',
    '1. 直接驱动：本块中的事件内容必须真实落地到接下来的剧情中（对象、方式、时机都要兑现）；禁止敷衍带过、写与事件无关的日常。',
    '2. 自然衔接：事件内容要与当前对话无缝衔接，作为剧情的一部分自然发生，不得生硬插入，也不得让角色复述本块原文。',
    '3. 冲突裁决：若事件内容与已发生剧情冲突，保留事件意图，改用符合当前剧情的方式表达；不得整段弃用，也不得以「与设定不符」为由跳过本指令。',
    '4. 优先级：在接下来的剧情中，若与你对剧情走向的一般印象或惯性理解冲突，以本段为准。',
    '',
  ];
  for (const trigger of triggers) {
    lines.push('<event id="' + String(trigger.id || '') + '" name="' + String(trigger.name || '') + '">');
    lines.push('触发条件：' + formatValuesTriggerConditions(trigger));
    if (String(trigger.description || '').trim()) lines.push('事件说明：' + trigger.description);
    lines.push('');
    lines.push(String(trigger.content || '').trim());
    lines.push('</event>');
  }
  lines.push('</Story_Trigger>');
  return lines.join('\n');
}

function getValuesTriggerExtensionPromptApi(ctx) {
  return getExtensionPromptApi(ctx);
}

// ---------- 常驻注入 ----------
// 注入运行态（挂 globalThis：热重载后宿主里的注入是否已写过仍然可知）：
// - written：宿主提示词里是否已有一份非空注入（空内容时只有写过才需要清理调用，
//   与变量注入同款——没配剧情触发的聊天零调用）；
// - locked：本轮是否已由「发送前判定」锁定——锁定后一律按本轮记录原样重写，不再
//   重新判定（事件效果改值、一次性事件自动关闭都是本轮判定的后果，重新判定会把
//   刚触发的事件从块里冲掉；swipe / 重新生成也据此拿到与本轮一致的事件）；
// - busy：发送前任务正在判定 / 应用效果，期间的数据变更刷新直接跳过。
function getValuesTriggerInjectState() {
  const existing = globalThis[VALUES_TRIGGER_STATE_KEY];
  if (existing && typeof existing === 'object') return existing;
  const state = { written: false, locked: false, busy: false };
  globalThis[VALUES_TRIGGER_STATE_KEY] = state;
  return state;
}

// 解锁本轮：下一次刷新按实时数据重新判定（切聊天 / 启动 / 新一轮发送）。
function unlockValuesTriggerRound() {
  getValuesTriggerInjectState().locked = false;
}

// 判定记录：本次判定的完整快照（注入实录展示用）。source = 'send'（用户点击发送的
// 发送前判定，含事件效果与一次性自动关闭）/ 'refresh'（常驻刷新：数据变更 / 启动 / 切聊天）。
function buildValuesTriggerRecord(ctx, triggered, source) {
  return {
    at: new Date().toISOString(),
    source,
    totalTriggers: getValuesTriggers(ctx).length,
    triggeredIds: triggered.map((trigger) => trigger.id),
    triggeredEvents: triggered.map((trigger) => ({
      id: trigger.id,
      name: trigger.name,
      conditions: formatValuesTriggerConditions(trigger),
      description: trigger.description,
      content: trigger.content,
    })),
    injectionText: '',
    injected: false,
    skipped: triggered.length === 0,
  };
}

// 写入注入块：无条件重新断言（不做内容去重——宿主每轮可能重建 prompt 缓存，去重会
// 让「状态以为写过、宿主其实已经清掉」的补写落空，与变量注入的取舍一致）。
// 空内容且从未写过时零调用。
function writeValuesTriggerInjection(ctx, text) {
  const state = getValuesTriggerInjectState();
  if (!text && !state.written) return false;
  const api = getValuesTriggerExtensionPromptApi(ctx);
  if (!api) return false;
  try {
    api.setExtensionPrompt(VALUES_TRIGGER_INJECT_KEY, text, api.inChat, 0, false, api.systemRole);
    state.written = Boolean(text);
    return Boolean(text);
  } catch (error) {
    logApp('warn', '剧情触发注入失败', String(error?.message || error));
    return false;
  }
}

// 只清注入块，不动本轮记录与运行态（发送前判定「本轮无事件」时用：块要清掉，记录留档）。
function clearValuesTriggerInjection(ctx) {
  const state = getValuesTriggerInjectState();
  if (!state.written) return;
  const api = getValuesTriggerExtensionPromptApi(ctx);
  if (!api) return;
  try {
    api.setExtensionPrompt(VALUES_TRIGGER_INJECT_KEY, '', api.inChat, 0);
    state.written = false;
  } catch (error) {
    logApp('warn', '清理剧情触发注入失败', String(error?.message || error));
  }
}

// 复位：解锁本轮 + 清注入块 + 丢弃记录（总开关关闭 / 切换聊天）。
// 已无注入时只做状态复位，不产生宿主调用。
function resetValuesTriggerInjection(ctx) {
  unlockValuesTriggerRound();
  globalThis[VALUES_TRIGGER_LAST_ROUND_KEY] = null;
  clearValuesTriggerInjection(ctx);
}

// 刷新注入（常驻模型的唯一写入入口）：总开关关闭 → 复位；本轮已锁定 → 按锁定的
// 事件集合重写（内容取当前定义，事件被删除则从块里移除，集合为空则块清空但**保持
// 锁定**——本轮该触发哪些事件在发送时就定了）；未锁定 → 按实时数据重新判定，写入 /
// 清空并把判定记入「注入实录」。
function refreshValuesTriggerInjection(ctx) {
  const context = ctx || getContextSafe();
  if (!context) return false;
  let settings = null;
  try {
    settings = getSettings(context);
  } catch (error) {
    settings = null;
  }
  if (!settings || settings.valuesTriggerEnabled === false) {
    resetValuesTriggerInjection(context);
    return false;
  }
  const state = getValuesTriggerInjectState();
  if (state.busy) return false;
  if (state.locked) {
    const round = globalThis[VALUES_TRIGGER_LAST_ROUND_KEY] || null;
    const ids = round && Array.isArray(round.triggeredIds) ? round.triggeredIds : [];
    // 只按「事件是否还存在」过滤：本轮自动关闭的一次性事件仍属于本轮，必须留在块里。
    const kept = ids
      .map((id) => getValuesTriggerById(context, id))
      .filter(Boolean);
    if (kept.length !== ids.length && round) {
      // 有事件被删除：同步记录，保证实录与本轮块一致。
      round.triggeredIds = kept.map((trigger) => trigger.id);
      round.triggeredEvents = buildValuesTriggerRecord(context, kept, round.source || 'send').triggeredEvents;
      round.injectionText = kept.length > 0 ? buildValuesTriggerInjectionText(context, kept) : '';
      round.injected = kept.length > 0;
      round.skipped = kept.length === 0;
    }
    const text = round ? String(round.injectionText || '') : '';
    return writeValuesTriggerInjection(context, text);
  }
  const triggered = evaluateValuesTriggers(context);
  const record = buildValuesTriggerRecord(context, triggered, 'refresh');
  if (triggered.length > 0) {
    record.injectionText = buildValuesTriggerInjectionText(context, triggered);
    record.injected = true;
  }
  // 没配触发事件的聊天不写记录：实录的触发段保持隐藏（与旧行为一致）。
  globalThis[VALUES_TRIGGER_LAST_ROUND_KEY] = record.totalTriggers > 0 ? record : null;
  return writeValuesTriggerInjection(context, record.injectionText);
}

// 数据落盘后的刷新入口（saveValuesData / saveValuesChatState 统一调用）：读取失败
// 一律降级，绝不影响保存本身。
function onValuesDataChangedForTriggerInject(ctx) {
  try {
    refreshValuesTriggerInjection(ctx);
  } catch (error) {
    logApp('warn', '剧情触发注入刷新失败', String(error?.message || error));
  }
}

// 切换聊天 / 启动后的延迟补刷：新聊天的 chatMetadata（游戏值所在处）可能晚于事件
// 才就绪，早刷只能拿到默认值，按 delays 再刷几次收敛到实际值。
function scheduleValuesTriggerInjectionRefresh(delays) {
  scheduleDelayedRefreshes(
    VALUES_TRIGGER_STARTUP_TIMER_KEY,
    delays || VALUES_TRIGGER_STARTUP_REFRESH_DELAYS,
    () => {
      const freshCtx = getContextSafe();
      if (!freshCtx) return;
      try {
        refreshValuesTriggerInjection(freshCtx);
      } catch (error) {
        logApp('warn', '剧情触发注入补刷失败', String(error?.message || error));
      }
    },
  );
}

// 切换聊天：新聊天没有「本轮」，解锁后按新聊天的数据重新判定。运行态 written
// **不**重置：新聊天若没有可注入内容，「曾经写过」正是清掉上个聊天残留块的依据。
function onValuesTriggerChatChanged() {
  unlockValuesTriggerRound();
  const ctx = getContextSafe();
  if (!ctx) return;
  try {
    refreshValuesTriggerInjection(ctx);
  } catch (error) {
    logApp('warn', '剧情触发注入刷新失败', String(error?.message || error));
  }
  scheduleValuesTriggerInjectionRefresh();
}

// 启动首次注入 + 补刷：插件载入后不等点击发送，满足条件的事件就该在提示词里。
function startValuesTriggerInjection() {
  unlockValuesTriggerRound();
  const ctx = getContextSafe();
  if (!ctx) return;
  try {
    refreshValuesTriggerInjection(ctx);
  } catch (error) {
    logApp('warn', '剧情触发注入启动刷新失败', String(error?.message || error));
  }
  scheduleValuesTriggerInjectionRefresh();
}

// 生成结束 / 停止：只重刷不清空（与变量注入同款）——宿主清掉提示词缓存时把常驻块
// 补回来；本轮锁定者原样重写，保证 swipe / 重新生成拿到与本轮一致的事件。
function onValuesTriggerGenerationRefresh() {
  const ctx = getContextSafe();
  if (!ctx) return;
  try {
    refreshValuesTriggerInjection(ctx);
  } catch (error) {
    logApp('warn', '剧情触发注入刷新失败', String(error?.message || error));
  }
}

// 发送前任务（注册进跨扩展发送屏障）：本轮的**权威判定**——求值、应用事件效果、
// 一次性事件自动关闭、写入注入并在本轮内锁定。只处理「用户点击发送」产生的新消息；
// 系统消息 / 非用户末条跳过；失败静默降级，绝不阻塞发送。
function runValuesTriggerBarrierTask(ctx, payload) {
  const context = ctx || getContextSafe();
  if (!context) return Promise.resolve();
  let settings = null;
  try {
    settings = getSettings(context);
  } catch (error) {
    settings = null;
  }
  // 总开关关闭：常驻模型下要顺手清掉已注入的块（旧模型靠生成结束清理兜底）。
  if (!settings || settings.valuesTriggerEnabled === false) {
    resetValuesTriggerInjection(context);
    return Promise.resolve();
  }
  const chat = Array.isArray(context?.chat) ? context.chat : [];
  const lastMessage = chat[chat.length - 1];
  if (!lastMessage || !lastMessage.is_user) return Promise.resolve();
  const state = getValuesTriggerInjectState();
  unlockValuesTriggerRound();
  let record = null;
  state.busy = true;
  try {
    const triggered = evaluateValuesTriggers(context);
    record = buildValuesTriggerRecord(context, triggered, 'send');
    // 先发布本轮记录再产生任何副作用：效果应用 / 一次性关闭都会经保存入口回调刷新，
    // 锁定分支要读到的就是这份记录（迟一步读到的是上一轮，会把刚写的块清掉）。
    if (record.totalTriggers > 0) globalThis[VALUES_TRIGGER_LAST_ROUND_KEY] = record;
    if (triggered.length === 0) {
      // 本轮无事件：清掉上一轮留下的常驻块，记录留档供实录核对。
      clearValuesTriggerInjection(context);
      logApp('debug', '剧情触发：本轮无事件满足条件');
      return Promise.resolve();
    }
    // 先算好本轮块并锁定，再产生副作用：效果改值 / 一次性关闭都会经保存入口回调
    // 刷新，锁定后这些刷新一律按本块原样重写，不会把刚触发的事件冲掉。
    record.injectionText = buildValuesTriggerInjectionText(context, triggered);
    state.locked = true;
    // 事件效果：确定性修改游戏值，不依赖注入能力，先于注入执行。
    record.effectsApplied = applyValuesTriggerEffects(context, triggered);
    const written = writeValuesTriggerInjection(context, record.injectionText);
    record.injected = written;
    if (!written) {
      // 宿主不支持提示词注入（或写入抛错）：没有块可守，解锁即可。
      state.locked = false;
      logApp('warn', '剧情触发：宿主不支持提示词注入，跳过注入');
      return Promise.resolve();
    }
    record.autoDisabledIds = autoDisableFiredValuesTriggers(context, triggered);
    logApp('info', '剧情触发：已注入事件', '满足条件 ' + triggered.length + ' 个事件', record.triggeredIds);
    const onceNote = record.autoDisabledIds.length > 0
      ? '，' + record.autoDisabledIds.length + ' 个一次性事件已自动关闭'
      : '';
    globalThis.toastr?.success?.('剧情触发：已注入 ' + triggered.length + ' 个事件' + onceNote + '！', '[' + MODULE_DISPLAY_NAME + ']');
  } catch (error) {
    logApp('warn', '剧情触发失败，静默降级', String(error?.message || error));
  } finally {
    state.busy = false;
  }
  return Promise.resolve();
}

// 注册进跨扩展发送屏障：与剧情预筛 / 变量注入并发执行，保证注入在主请求发出前完成。
getPreSendBarrier()?.register('kaleidoscope-values-trigger', runValuesTriggerBarrierTask);