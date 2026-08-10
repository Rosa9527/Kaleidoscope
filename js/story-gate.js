// ===== 万华镜（Kaleidoscope）剧情预筛：Gate 预筛 + 事件注入 =====
// 触发时机：用户点击发送（宿主 messageSent 事件；宿主的 emit 会 await 监听器），
// 本模块的监听器返回 Promise，从而在「预筛完成并注入」之前阻塞主模型请求。
// 并发协调：预筛管线注册进跨扩展发送屏障（js/send-barrier.js，与 SoulLink 共用），
// 与其他扩展的发送前任务并发执行——发送前耗时 = max(各 Gate)，而非串行之和；
// 屏障不可用时回退为「自己直接阻塞」的原有行为。
// 流程：Gate（剧情预筛提示词 + 事件目录 + 最近 4 条消息）→ 解析事件 ID →
// 拼接 <Story_Event> 块 → setExtensionPrompt(IN_CHAT, depth 0, SYSTEM) 注入到
// 最后一条用户消息正下方 → 恢复发送；generationEnded / generationStopped 后清空注入。
// 稳定性设计（参考 SoulLink 角色预筛 Gate，针对「发送前阻塞」加固）：
// - 运行锁 + 签名去重：上一轮预筛还在飞时新发送直接放行（本轮内容已覆盖）；
// - 载荷校验：messageSent 载荷（文本或消息 ID）必须与末条消息一致，其他插件
//   自行 emit messageSent（QuickReply / 自动回复脚本等）直接跳过；
// - 主生成配对：确认过「generationStarted 先于 messageSent」的宿主（TauriTavern）
//   上，无生成在途的 messageSent 判定为其他插件误触发，不发起预筛 API 调用；
// - 名单交集：Gate 返回的 ID 必须与现有事件求交集，未知 ID 一律丢弃；
// - 失败即降级：Gate 失败 → 不注入直接放行，绝不让发送流程卡死；
// - 总超时：STORY_GATE_TIMEOUT_MS 硬截止，中止在途请求并放行发送；
// - 注入清理：每轮开始前清旧注入，generationEnded / generationStopped 再清一次；
// - 能力检查：宿主不提供 setExtensionPrompt / extension_prompt_types 时静默跳过。
const storyGateState = {
  running: false,
  lastSignature: '',
  // 主生成流程跟踪（参考 SoulLink 的 generationStarted → generationEnded 配对）：
  // TauriTavern 的 messageSent 在 generationStarted 之后触发，可据此确认「玩家真实
  // 发送」；标准 SillyTavern 顺序相反（messageSent 先于 generationStarted），无法在
  // messageSent 时点确认，保持放行。只有确认过「generationStarted 先于 messageSent」
  // 的宿主才启用严格配对，其他插件自行 emit messageSent（无对应生成事件）直接跳过。
  generationInProgress: false,
  strictPairing: false,
};

// 最近 N 条消息（含刚发送的用户消息）：与 SoulLink 的 getRecentMessages 对齐，
// 只取 role / name / content，不携带任何其他字段。ctx 可显式传入（测试用），
// 缺省时读宿主当前上下文。
function getStoryGateRecentMessages(count, ctx) {
  const context = ctx || getContextSafe();
  const chat = Array.isArray(context?.chat) ? context.chat : [];
  return chat.slice(-count).map((message) => ({
    role: message?.is_user ? 'user' : (message?.is_system ? 'system' : 'assistant'),
    name: String(message?.name || ''),
    content: String(message?.mes || ''),
  }));
}

// 事件目录：节点（含层级与说明）+ 事件（只含名字 / ID / 触发条件 / 描述，不含正文）。
// 这是 Gate 的唯一候选集，刻意不携带事件正文，避免预筛阶段泄露内容、放大输入体积。
// 被关闭的节点（含其子树与事件）不进入目录，也不参与本轮预筛。
function buildStoryEventCatalog(ctx) {
  const nodes = getStoryNodes(ctx);
  const scripts = getStoryScripts(ctx);
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const childrenOf = (parentId) => nodes
    .filter((node) => String(node.parentId || '') === String(parentId || ''))
    .filter((node) => isStoryNodeActive(ctx, node))
    .sort(byStoryCreatedAt);
  const scriptsOf = (nodeId) => scripts
    .filter((script) => script.nodeId === nodeId)
    .sort(byStoryCreatedAt)
    .map((script) => ({
      id: script.id,
      name: script.name,
      trigger: script.trigger,
      description: script.description,
    }));
  const buildNode = (node) => ({
    id: node.id,
    name: node.name,
    description: node.description,
    children: childrenOf(node.id).map(buildNode),
    events: scriptsOf(node.id),
  });
  const roots = nodes
    .filter((node) => !String(node.parentId || ''))
    .filter((node) => isStoryNodeActive(ctx, node))
    .sort(byStoryCreatedAt);
  const unassigned = scripts
    .filter((script) => !String(script.nodeId || '') || !nodeMap.has(script.nodeId))
    .sort(byStoryCreatedAt)
    .map((script) => ({
      id: script.id,
      name: script.name,
      trigger: script.trigger,
      description: script.description,
    }));
  return { nodes: roots.map(buildNode), unassigned };
}

// 预筛提示词：优先用作者在设置里保存的自定义提示词，空则回退默认。
function getStoryGatePrompt(ctx) {
  const settings = ctx ? getSettings(ctx) : null;
  const saved = String(settings?.storyGatePrompt || '').trim();
  return saved || DEFAULT_STORY_GATE_PROMPT;
}

// Gate 请求体按「提示词 → 事件目录块 → 剧情块 → 输出契约」四段式组织：
// 1. system 剧情预筛提示词；
// 2. user 目录段：引导 + <Story_Events> 块（节点 + 事件目录，XML 包裹）；
// 3. user 剧情段：引导 + <Recent_Messages> 块（最近 4 条消息，XML 包裹）；
// 4. user 输出契约段：约定 JSON 模板。
// 与「剧情预筛」默认提示词的输入说明保持一致；JSON 紧凑序列化（省缩进 token），
// 减少消息轮次与输入体积，加快 Gate 返回。
function buildStoryGateMessages(ctx, prompt) {
  const catalog = buildStoryEventCatalog(ctx);
  const recentMessages = getStoryGateRecentMessages(STORY_GATE_RECENT_COUNT, ctx);
  return [
    { role: 'system', content: prompt },
    {
      role: 'user',
      content: [
        '以下被 <Story_Events>...</Story_Events> 包裹的是当前全部剧情节点与事件目录，这是唯一的候选集。',
        '只从这份目录中挑选：目录之外的事件（即使剧情里自然发生）一律不列入。',
        '每个事件只展示所属节点、事件 ID、名称、触发条件与描述，事件正文不提供。',
        '<Story_Events>\n' + JSON.stringify(catalog) + '\n</Story_Events>',
      ].join('\n'),
    },
    {
      role: 'user',
      content: [
        '以下被 <Recent_Messages>...</Recent_Messages> 包裹的是当前场景的最新 ' + STORY_GATE_RECENT_COUNT + ' 条消息（最后一条是用户刚发送的消息，是下一轮剧情的直接触发点）。',
        '请据此判断目录中哪些事件本轮应该被触发：触发条件已满足、且当前剧情直接命中或明显推进到该事件附近。',
        '只从目录中挑选，目录之外的事件一律忽略。',
        '<Recent_Messages>\n' + JSON.stringify(recentMessages) + '\n</Recent_Messages>',
      ].join('\n'),
    },
    {
      role: 'user',
      content: '请按约定输出 JSON，只从目录中列出本轮应该触发的事件 ID：\n\n' + JSON.stringify({ events: [] }),
    },
  ];
}

// 解析 Gate 返回的事件 ID，并与现有事件求交集：模型可能返回乱格式、含未知 ID 或
// 根本没返回 events，这里统一归一化后只保留现有事件，杜绝未知 ID 混进后续注入。
// ID 只做精确匹配（去空白后逐字一致），靠提示词约束模型输出目录中的原 ID。
function parseStoryGateEventIds(parsed, allowedIds) {
  const allowed = new Set(allowedIds);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return [];
  if (!Array.isArray(parsed.events)) return [];
  const out = [];
  const seen = new Set();
  for (const item of parsed.events) {
    const id = String(item ?? '').trim();
    if (!id || seen.has(id) || !allowed.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out.slice(0, STORY_GATE_MAX_SELECTED);
}

// 拼接注入块：统一格式的 <Story_Event> 文本，明确告知主模型这不是剧情正文，
// 并给出不可弃用的强制执行规则——消除「与设定冲突可弃用」「仅供参考」等让主模型
// 跳过本块的漏洞。每个事件带 id / name / 触发条件 / 说明与正文。
function buildStoryGateInjectionText(ctx, events) {
  const lines = [
    '<Story_Event>',
    '【系统导演注 · 强制指令】本块不是剧情正文，也不是任何角色的台词、旁白或可引用文本；它是系统在发送前依据预置剧情与当前剧情进展，判定「本轮应该触发的剧情事件」。以下规则必须逐条执行，不得忽略、不得淡化，不得以任何理由整体弃用。',
    '',
    '执行规则：',
    '1. 直接驱动：本块中的事件内容必须真实落地到接下来的剧情中（对象、方式、时机都要兑现）；禁止敷衍带过、写与事件无关的日常。',
    '2. 自然衔接：事件内容要与当前对话无缝衔接，作为剧情的一部分自然发生，不得生硬插入，也不得让角色复述本块原文。',
    '3. 冲突裁决：若事件内容与已发生剧情冲突，保留事件意图，改用符合当前剧情的方式表达；不得整段弃用，也不得以「与设定不符」为由跳过本指令。',
    '4. 优先级：在接下来的剧情中，若与你对剧情走向的一般印象或惯性理解冲突，以本段为准。',
    '',
  ];
  for (const event of events) {
    lines.push('<event id="' + event.id + '" name="' + event.name + '">');
    if (String(event.trigger || '').trim()) lines.push('触发条件：' + event.trigger);
    if (String(event.description || '').trim()) lines.push('事件说明：' + event.description);
    lines.push('');
    lines.push(String(event.content || '').trim());
    lines.push('</event>');
  }
  lines.push('</Story_Event>');
  return lines.join('\n');
}

// 宿主注入 API：标准 SillyTavern 的 getContext() 会提供 extension_prompt_types /
// extension_prompt_roles；TauriTavern 2.x 不提供这两个对象（也不挂 globalThis），
// 因此只把 setExtensionPrompt 作为必需项，枚举值按已知数值常量兜底：
// extension_prompt_types: NONE=-1, IN_PROMPT=0, IN_CHAT=1, BEFORE_PROMPT=2
// extension_prompt_roles: SYSTEM=0, USER=1, ASSISTANT=2
function getStoryGateExtensionPromptApi(ctx) {
  const context = ctx || getContextSafe();
  if (!context) return null;
  const setExtensionPrompt = typeof context.setExtensionPrompt === 'function'
    ? context.setExtensionPrompt
    : (typeof globalThis.setExtensionPrompt === 'function' ? globalThis.setExtensionPrompt : null);
  if (typeof setExtensionPrompt !== 'function') return null;
  const types = context.extension_prompt_types || globalThis.extension_prompt_types || null;
  const roles = context.extension_prompt_roles || globalThis.extension_prompt_roles || null;
  const inChat = (types && Number.isFinite(types.IN_CHAT)) ? types.IN_CHAT : 1;
  const systemRole = (roles && Number.isFinite(roles.SYSTEM)) ? roles.SYSTEM : 0;
  return { setExtensionPrompt, inChat, systemRole };
}

function clearStoryGateInjection(ctx) {
  const api = getStoryGateExtensionPromptApi(ctx);
  if (!api) return;
  try {
    api.setExtensionPrompt(STORY_GATE_INJECT_KEY, '', api.inChat, 0);
  } catch (error) {
    logApp('warn', '清理剧情预筛注入失败', String(error?.message || error));
  }
}

function buildStoryGateSignature(message) {
  if (!message) return '';
  return [
    message.is_user ? 'user' : 'assistant',
    String(message.id ?? ''),
    String(message.name || ''),
    String(message.mes || ''),
  ].join('|');
}

// 单轮完整管线：Gate → 解析 → 注入。任何一步失败都按「降级放行」处理，
// 绝不让发送流程卡死；总耗时受 STORY_GATE_TIMEOUT_MS 硬截止。
async function runStoryGatePipeline(ctx, settings) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), STORY_GATE_TIMEOUT_MS);
  // 只取「激活」事件：节点（或任一祖先）被关闭的事件不参与本轮预筛。
  const scripts = getStoryActiveScripts(ctx);
  const record = {
    triggeredAt: new Date().toISOString(),
    durationMs: 0,
    totalEvents: scripts.length,
    selectedIds: [],
    selectedEvents: [],
    raw: '',
    injectionText: '',
    injected: false,
    skipped: false,
    timedOut: false,
  };
  const finish = (overrides = {}) => {
    clearTimeout(deadline);
    record.durationMs = Date.now() - startedAt;
    Object.assign(record, overrides);
    globalThis[STORY_GATE_LAST_ROUND_KEY] = record;
    try {
      refreshHomeInjectStatus();
    } catch {}
  };
  try {
    if (scripts.length === 0) {
      logApp('debug', '剧情预筛跳过：没有事件');
      finish({ skipped: true });
      return;
    }
    globalThis.toastr?.info?.('剧情预筛中…', '[' + MODULE_DISPLAY_NAME + ']');
    const prompt = getStoryGatePrompt(ctx);
    const messages = buildStoryGateMessages(ctx, prompt);
    logApp('info', '剧情预筛：Gate 开始', scripts.length + ' 个事件');
    // Gate 只产出事件 ID 名单，输出量小：限制 maxTokens 并降低 temperature，
    // 避免模型长篇输出拖慢发送前阻塞链路，同时保持判定确定性（与 SoulLink 一致）。
    const content = await chatCompletion(settings, messages, { signal: controller.signal, maxTokens: 1024, temperature: 0.1 });
    const parsed = parseAgentJson(content);
    const selectedIds = parseStoryGateEventIds(parsed, scripts.map((script) => script.id));
    record.selectedIds = selectedIds;
    record.raw = String(content || '');
    logApp('info', '剧情预筛：Gate 完成', '入选 ' + selectedIds.length + '/' + scripts.length + ' 个事件', selectedIds);
    if (selectedIds.length === 0) {
      logApp('debug', '剧情预筛：0 入选，原文', String(content || '').slice(0, 400));
      globalThis.toastr?.info?.('剧情预筛完成：本轮无事件触发，直接生成', '[' + MODULE_DISPLAY_NAME + ']');
      finish({ skipped: true });
      return;
    }
    const api = getStoryGateExtensionPromptApi(ctx);
    if (!api) {
      logApp('warn', '剧情预筛：宿主不支持提示词注入，跳过注入');
      globalThis.toastr?.warning?.('剧情预筛完成，但宿主不支持注入（setExtensionPrompt 不可用）', '[' + MODULE_DISPLAY_NAME + ']');
      finish();
      return;
    }
    const selected = selectedIds
      .map((id) => scripts.find((script) => script.id === id))
      .filter(Boolean);
    const injectionText = buildStoryGateInjectionText(ctx, selected);
    record.selectedEvents = selected.map((script) => ({
      id: script.id,
      name: script.name,
      trigger: script.trigger,
      description: script.description,
      content: script.content,
    }));
    record.injectionText = injectionText;
    clearStoryGateInjection(ctx);
    api.setExtensionPrompt(STORY_GATE_INJECT_KEY, injectionText, api.inChat, 0, false, api.systemRole);
    record.injected = true;
    logApp('info', '剧情预筛：已注入事件', '成功 ' + selected.length + ' 个事件，位于最后一条用户消息下方', selectedIds);
    globalThis.toastr?.success?.('剧情预筛完成：已注入 ' + selected.length + ' 个事件！', '[' + MODULE_DISPLAY_NAME + ']');
    finish();
  } catch (error) {
    if (controller.signal.aborted) {
      record.timedOut = true;
      logApp('warn', '剧情预筛超时，直接放行发送', STORY_GATE_TIMEOUT_MS + 'ms');
      globalThis.toastr?.warning?.('剧情预筛超时，已直接放行发送', '[' + MODULE_DISPLAY_NAME + ']');
    } else {
      const message = String(error?.message || error);
      logApp('error', '剧情预筛失败，直接放行发送', message);
      globalThis.toastr?.error?.('剧情预筛失败，已直接放行：' + message.slice(0, 160), '[' + MODULE_DISPLAY_NAME + ']');
    }
    finish();
  }
}

// 剧情预筛发送前任务（注册进跨扩展发送屏障）：所有守卫都必须在任务内，
// 因为本轮可能由其他扩展的 messageSent 监听器先行启动。返回 Promise，绝不 reject。
function runStoryGateBarrierTask(ctx, payload) {
  let settings;
  try {
    settings = getSettings(ctx);
  } catch (error) {
    console.warn('[' + MODULE_DISPLAY_NAME + '] 剧情预筛：读取设置失败', error);
    return Promise.resolve();
  }
  if (settings.storyGateEnabled === false) return Promise.resolve();
  if (!getStoryGateExtensionPromptApi(ctx)) {
    logApp('warn', '剧情预筛跳过：宿主不支持提示词注入');
    return Promise.resolve();
  }
  if (!getApiBase(settings) || !String(settings.model || '').trim()) return Promise.resolve();
  const chat = Array.isArray(ctx.chat) ? ctx.chat : [];
  const lastMessage = chat[chat.length - 1];
  // 只处理「用户点击发送」产生的新消息；系统消息 / 非用户末条一律放行。
  if (!lastMessage || !lastMessage.is_user) return Promise.resolve();
  // 校验事件载荷与末条消息一致：其他插件自行 emit messageSent 时通常携带自己的
  // 载荷（文本或消息 ID），与末条消息不一致即可判定为误触发。
  // - 字符串载荷：必须与末条消息文本一致（QuickReply 发送、自动回复脚本等）；
  // - 数字载荷：必须与末条消息 ID 一致（宿主以消息 ID 为载荷，如 TauriTavern）；
  // - 其他类型（对象等）：无法校验，一律跳过（疑似其他插件触发）；
  // - 无载荷 / null：无法校验，按原有逻辑放行。
  const lastText = String(lastMessage.mes || '').trim();
  if (typeof payload === 'string') {
    if (lastText && String(payload).trim() !== lastText) {
      logApp('debug', '剧情预筛跳过：messageSent 载荷与末条消息不一致（疑似其他插件触发）');
      return Promise.resolve();
    }
  } else if (typeof payload === 'number') {
    const lastId = lastMessage.id;
    if (lastId !== undefined && lastId !== null && Number.isFinite(Number(lastId)) && Number(payload) !== Number(lastId)) {
      logApp('debug', '剧情预筛跳过：messageSent 消息 ID 与末条消息不一致（疑似其他插件触发）');
      return Promise.resolve();
    }
  } else if (payload !== undefined && payload !== null) {
    logApp('debug', '剧情预筛跳过：messageSent 载荷类型无法校验（疑似其他插件触发）');
    return Promise.resolve();
  }
  // 主生成配对：确认过「generationStarted 先行」的宿主上，无生成在途的
  // messageSent 判定为其他插件误触发，直接跳过，不发起预筛 API 调用。
  if (storyGateState.generationInProgress) {
    storyGateState.strictPairing = true;
  }
  if (storyGateState.strictPairing && !storyGateState.generationInProgress) {
    logApp('debug', '剧情预筛跳过：messageSent 无对应生成事件（疑似其他插件触发）');
    return Promise.resolve();
  }
  const signature = buildStoryGateSignature(lastMessage);
  if (storyGateState.running) {
    logApp('debug', '剧情预筛跳过：上一轮仍在运行（本轮内容已覆盖）');
    return Promise.resolve();
  }
  if (storyGateState.lastSignature === signature) {
    logApp('debug', '剧情预筛跳过：同一发送已处理');
    return Promise.resolve();
  }
  storyGateState.running = true;
  storyGateState.lastSignature = signature;
  return runStoryGatePipeline(ctx, settings)
    .catch((error) => {
      console.error('[' + MODULE_DISPLAY_NAME + '] 剧情预筛任务异常', error);
    })
    .finally(() => {
      storyGateState.running = false;
      storyGateState.lastSignature = '';
    });
}

// messageSent 阻塞监听器：返回 Promise，宿主 emit 会 await 它，
// 从而在预筛注入完成前阻止主模型请求；所有分支都必须尽快 resolve。
// 经跨扩展发送屏障与其他扩展的发送前任务并发执行（屏障不可用时回退为直接阻塞）。
async function onStoryGateMessageSent(...args) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const payload = args?.[0];
  const barrier = getPreSendBarrier();
  if (!barrier) {
    return runStoryGateBarrierTask(ctx, payload);
  }
  return barrier.waitAll(ctx, payload, STORY_GATE_TIMEOUT_MS);
}


// messageSent 专用订阅：与 onHostEvent 不同，这里的监听器必须「返回 Promise」，
// 宿主 emit 才会等待它——这是「阻止立即请求主模型」的机制基础。
function installStoryGateMessageSentHook(ctx) {
  const eventSource = ctx?.eventSource;
  if (!eventSource || typeof eventSource.on !== 'function') return;
  const eventType = resolveHostEventType(ctx, 'messageSent');
  const previous = globalThis[STORY_GATE_HANDLER_KEY];
  if (previous && typeof eventSource.removeListener === 'function') {
    eventSource.removeListener(eventType, previous);
    globalThis[STORY_GATE_HANDLER_KEY] = null;
  }
  const wrapped = (...args) => {
    try {
      return onStoryGateMessageSent(...args).catch((error) => {
        console.error('[' + MODULE_DISPLAY_NAME + '] host event messageSent（剧情预筛）失败', error);
      });
    } catch (error) {
      console.error('[' + MODULE_DISPLAY_NAME + '] host event messageSent（剧情预筛）失败', error);
      return Promise.resolve();
    }
  };
  globalThis[STORY_GATE_HANDLER_KEY] = wrapped;
  eventSource.on(eventType, wrapped);
}

// 生成开始：标记主生成在途，供 messageSent 主生成配对使用。
function onStoryGateGenerationStarted() {
  storyGateState.generationInProgress = true;
}

// 生成结束 / 停止后清空注入并复位生成状态：保证 swipes / 重生成 / 后续轮次
// 不会复用本轮的预筛块，也让「无生成在途」的 messageSent 能被配对逻辑拦截。
function onStoryGateGenerationCleanup() {
  storyGateState.generationInProgress = false;
  const ctx = getContextSafe();
  if (!ctx) return;
  if (!getStoryGateExtensionPromptApi(ctx)) return;
  clearStoryGateInjection(ctx);
}

// 注册进跨扩展发送屏障：与其他扩展的发送前任务并发执行，发送前耗时从
// 「各 Gate 之和」降为「各 Gate 最大值」。注册在模块加载时完成，屏障挂在
// globalThis，宿主重建事件源后由看门狗重挂监听器时自动复用。
getPreSendBarrier()?.register('kaleidoscope-story-gate', runStoryGateBarrierTask);
