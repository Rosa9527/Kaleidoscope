// ===== 万华镜（Kaleidoscope）剧情触发：变量条件确定性触发 =====
// 与「剧情脉络」互补：剧情脉络由预筛 AI 依据对话判断触发；剧情触发不依赖 API，
// 直接按「某节点下变量的当前值」是否满足预设条件，确定性判定剧情事件是否触发。
// 触发时机：用户点击发送（messageSent，经跨扩展发送屏障），与剧情预筛并发执行；
// 满足条件的事件以 <Story_Trigger> 块注入（IN_CHAT, SYSTEM），generationEnded /
// generationStopped 后清空，下一轮发送前重新判定。
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
function normalizeValuesTrigger(raw) {
  const conditions = Array.isArray(raw?.conditions) ? raw.conditions : [];
  const effects = Array.isArray(raw?.effects) ? raw.effects : [];
  return {
    id: String(raw?.id || '').trim(),
    name: String(raw?.name || '').trim() || '未命名触发',
    enabled: raw?.enabled !== false,
    once: raw?.once !== false,
    logic: String(raw?.logic || 'all').trim() === 'any' ? 'any' : 'all',
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

// 当前满足条件且启用的触发（按创建顺序）。
function evaluateValuesTriggers(ctx) {
  return getValuesTriggers(ctx).filter((trigger) => trigger.enabled !== false && evaluateValuesTrigger(ctx, trigger));
}

// 条件摘要文本：张三/好感 >= 70 且 张三/是否已知真相 == true。
function formatValuesTriggerConditions(trigger) {
  const conditions = Array.isArray(trigger?.conditions) ? trigger.conditions : [];
  const parts = conditions.map((condition) => {
    const path = String(condition?.path || '');
    const op = String(condition?.op || '==').trim();
    if (op === 'exists' || op === 'not exists') return `${path} ${op}`;
    const value = condition?.value;
    const valueText = value === null || value === undefined ? 'null' : String(value);
    return `${path} ${op} ${valueText}`;
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

function clearValuesTriggerInjection(ctx) {
  const api = getValuesTriggerExtensionPromptApi(ctx);
  if (!api) return;
  try {
    api.setExtensionPrompt(VALUES_TRIGGER_INJECT_KEY, '', api.inChat, 0);
  } catch (error) {
    logApp('warn', '清理剧情触发注入失败', String(error?.message || error));
  }
}

// 发送前任务（注册进跨扩展发送屏障）：确定性求值 + 同步注入，失败静默降级，
// 绝不阻塞发送。只处理「用户点击发送」产生的新消息；系统消息 / 非用户末条跳过。
function runValuesTriggerBarrierTask(ctx, payload) {
  const context = ctx || getContextSafe();
  const settings = context ? getSettings(context) : null;
  if (!settings || settings.valuesTriggerEnabled === false) return Promise.resolve();
  const chat = Array.isArray(context?.chat) ? context.chat : [];
  const lastMessage = chat[chat.length - 1];
  if (!lastMessage || !lastMessage.is_user) return Promise.resolve();
  const record = {
    at: new Date().toISOString(),
    totalTriggers: getValuesTriggers(context).length,
    triggeredIds: [],
    triggeredEvents: [],
    injectionText: '',
    injected: false,
    skipped: false,
  };
  try {
    const triggered = evaluateValuesTriggers(context);
    record.triggeredIds = triggered.map((trigger) => trigger.id);
    record.triggeredEvents = triggered.map((trigger) => ({
      id: trigger.id,
      name: trigger.name,
      conditions: formatValuesTriggerConditions(trigger),
      description: trigger.description,
      content: trigger.content,
    }));
    if (triggered.length === 0) {
      record.skipped = true;
      globalThis[VALUES_TRIGGER_LAST_ROUND_KEY] = record;
      return Promise.resolve();
    }
    // 事件效果：确定性修改游戏值，不依赖注入能力，先于注入执行。
    record.effectsApplied = applyValuesTriggerEffects(context, triggered);
    const api = getValuesTriggerExtensionPromptApi(context);
    if (!api) {
      logApp('warn', '剧情触发：宿主不支持提示词注入，跳过注入');
      globalThis[VALUES_TRIGGER_LAST_ROUND_KEY] = record;
      return Promise.resolve();
    }
    const injectionText = buildValuesTriggerInjectionText(context, triggered);
    record.injectionText = injectionText;
    clearValuesTriggerInjection(context);
    api.setExtensionPrompt(VALUES_TRIGGER_INJECT_KEY, injectionText, api.inChat, 0, false, api.systemRole);
    record.injected = true;
    record.autoDisabledIds = autoDisableFiredValuesTriggers(context, triggered);
    logApp('info', '剧情触发：已注入事件', '满足条件 ' + triggered.length + ' 个事件', record.triggeredIds);
    const onceNote = record.autoDisabledIds.length > 0
      ? '，' + record.autoDisabledIds.length + ' 个一次性事件已自动关闭'
      : '';
    globalThis.toastr?.success?.('剧情触发：已注入 ' + triggered.length + ' 个事件' + onceNote + '！', '[' + MODULE_DISPLAY_NAME + ']');
  } catch (error) {
    logApp('warn', '剧情触发失败，静默降级', String(error?.message || error));
  }
  globalThis[VALUES_TRIGGER_LAST_ROUND_KEY] = record;
  return Promise.resolve();
}

// 生成结束 / 停止后清空注入：swipes / 重生成 / 后续轮次不会复用本轮的旧块，
// 下一轮发送前会按最新变量值重新判定。
function onValuesTriggerGenerationCleanup() {
  const ctx = getContextSafe();
  if (!ctx) return;
  clearValuesTriggerInjection(ctx);
}

// 注册进跨扩展发送屏障：与剧情预筛 / 变量注入并发执行，保证注入在主请求发出前完成。
getPreSendBarrier()?.register('kaleidoscope-values-trigger', runValuesTriggerBarrierTask);