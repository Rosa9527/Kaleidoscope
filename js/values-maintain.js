// ===== 万华镜（Kaleidoscope）变量自动维护：AI 维护管线 =====
// 触发时机：宿主每轮生成结束（generationEnded）且确实产出了新的 AI 回复。
// 稳定设计（v1.4.2 起，配对守卫自适应）：
// - 「generationStarted → generationEnded」配对是**加强项而非前提**：确认过宿主
//   会先发 generationStarted 的（adaptivePairing 置 true），才按配对判定主生成
//   流程、拦截其他插件自行广播的 generationEnded；从未观察到配对的宿主
//   （如 TauriTavern 部分版本不发 GENERATION_STARTED）退化为「末条变化 + 去重 +
//   运行锁 + 中断检查」兜底判定，绝不让自动维护在真实宿主上永远哑火。
// - 末条签名去重 + 运行锁：同一末条只处理一次，上一轮还在飞时新事件直接跳过；
// - 中断检查：生成被用户中止时跳过，不对半截回复发起维护；
// - 失败即跳过本轮：调用失败不降级、不重试轰炸，本轮视为已处理。
// 请求体：system 维护提示词 → <Key_Rules>（键注册表 + 变化规则）→
// <Current_Values>（当前游戏值 YAML，完整树含子变量；子变量对 AI 只读）→
// <Recent_Messages>（最新 2 条消息）。
// 解析：AI 返回 YAML/JSON 补丁 → 剔除子变量（对 AI 只读，输出带了也一律无视）→
// 与当前树合并（仅已注册键可新增）→ 按最新父变量重算子变量 → 有变化才写聊天文件。

const valuesMaintainState = {
  running: false,
  lastSignature: '',
};

// 主生成流程跟踪（自适应配对，同 story-gate 的 strictPairing 思路）：
// - generationStarted 记录「开始时末条签名」+ 标记本轮见到过 started 事件；
// - generationEnded 时：startChatSignature 非空 → 严格按配对判定（末条必须变化）；
//   startChatSignature 为空 → 若从未观察到配对（adaptivePairing=false）则不再拦，
//   交给后续「末条去重 / 运行锁 / 中断检查」兜底；若确认过配对可用则维持拦截。
// - generationStopped / chatChanged 清空本轮跟踪（残留签名不跨轮复用）。
const valuesMainGenerationState = {
  startChatSignature: '',
  adaptivePairing: false,
};

function buildValuesSignature(message) {
  if (!message) return '';
  return [
    message.is_user ? 'user' : 'assistant',
    String(message.name || ''),
    String(message.mes || ''),
  ].join('|');
}

function onValuesGenerationStarted() {
  const ctx = getContextSafe();
  const chat = Array.isArray(ctx?.chat) ? ctx.chat : [];
  const last = chat[chat.length - 1];
  valuesMainGenerationState.startChatSignature = last ? buildValuesSignature(last) : '';
  // 宿主确实会发 generationStarted：此后启用严格配对（拦截无配对的 generationEnded）。
  valuesMainGenerationState.adaptivePairing = true;
}

function onValuesGenerationStopped() {
  valuesMainGenerationState.startChatSignature = '';
}

// 切换/加载聊天时清空跟踪，避免残留签名被其他插件的 generationEnded 误用。
function onValuesChatChanged() {
  valuesMainGenerationState.startChatSignature = '';
}

// 维护提示词：取当前激活预设的生效文本（自定义预设 → 预设内文本；内置默认预设
// → 全局设置自定义文本）；两者均为空时回退出厂默认。见 prompt-preset-data.js。
function getValuesMaintainPrompt(ctx) {
  return getEffectivePromptText(ctx, 'valuesMaintain');
}

// 请求体：system 提示词 → 键规则块 → 当前值块 → 最近消息块。
// 与「变量维护」默认提示词的输入说明保持一致：键规则是唯一依据，
// 当前值 YAML 是唯一可改动的数据，recent_messages 严格取最新 2 条。
function buildValuesMaintainMessages(ctx, prompt) {
  const keys = getValuesKeys(ctx);
  const current = getValuesGameTree(ctx);
  // 子变量是派生变量：不参与 AI 维护，规则块里只列父变量并注明子变量由系统计算。
  const parentKeys = keys.filter(isValuesParentKey);
  const childKeys = keys.filter(isValuesChildKey);
  // 内置变量的规则只在树里已出现该变量名时才列出：防止 AI 在从未使用过
  // 内置变量的聊天里凭空创建（卡内注册的键照旧全列，与旧行为一致）。
  const builtinInUse = (key) => valuesTreeContainsName(current, String(key?.name || ''));
  const keyRulesText = parentKeys
    .filter((key) => !isValuesBuiltinKey(key) || builtinInUse(key))
    .map((key) => `- ${String(key?.name || '')}: ${String(key?.rule || '')}`)
    .join('\n') || '（尚未注册任何父变量）';
  const childKeysInUse = childKeys.filter((key) => !isValuesBuiltinKey(key) || builtinInUse(key));
  const describeChildSource = (key) => {
    const formula = String(key?.formula || '').trim();
    if (formula !== '') return `${String(key?.name || '')} ← 公式 ${formula}`;
    const mapRules = Array.isArray(key?.mapRules) ? key.mapRules : [];
    if (mapRules.length > 0) return `${String(key?.name || '')} ← ${String(key?.parent || '')}按取值映射`;
    return `${String(key?.name || '')} ← ${String(key?.parent || '')}`;
  };
  const childNote = childKeysInUse.length > 0
    ? '\n\n（子变量为派生变量，由系统按派生规则自动计算，只读禁止修改：' +
      childKeysInUse.map(describeChildSource).join('、') +
      '）'
    : '';
  // 子变量对 AI 可见但只读：值表发完整树（含子变量，便于 AI 参照派生结果），
  // AI 输出里即使带了子变量也会在解析时被剔除（见 runValuesMaintain）。
  const currentText = serializeValuesTree(current, '') || '{}';
  const recentMessages = getStoryGateRecentMessages(VALUES_MAINTAIN_RECENT_COUNT, ctx);
  return [
    { role: 'system', content: prompt },
    {
      role: 'user',
      content: [
        '以下被 <Key_Rules>...</Key_Rules> 包裹的是全部已注册变量及其变化规则，这是变量变化的唯一依据。',
        '<Key_Rules>\n' + keyRulesText + childNote + '\n</Key_Rules>',
      ].join('\n'),
    },
    {
      role: 'user',
      content: [
        '以下被 <Current_Values>...</Current_Values> 包裹的是当前游戏变量（YAML 格式，完整变量树，含父变量与子变量）。父变量是唯一可改动的数据，结构、条目名与层级必须原样保留；子变量为派生变量由系统自动计算，只读禁止修改，输出中不要出现子变量。',
        '<Current_Values>\n' + currentText + '\n</Current_Values>',
      ].join('\n'),
    },
    {
      role: 'user',
      content: [
        '以下被 <Recent_Messages>...</Recent_Messages> 包裹的是最新 ' + VALUES_MAINTAIN_RECENT_COUNT + ' 条消息，是本轮维护的依据。',
        '<Recent_Messages>\n' + JSON.stringify(recentMessages) + '\n</Recent_Messages>',
      ].join('\n'),
    },
  ];
}

// 主维护管线：返回最近一轮记录对象（写 globalThis[VALUES_LAST_ROUND_KEY] 并刷新首页）。
// options.force=true 时跳过「末条已处理」去重（手动维护按钮用）。
async function runValuesMaintain(ctx, settings, options = {}) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), VALUES_MAINTAIN_TIMEOUT_MS);
  const record = {
    at: new Date().toISOString(),
    mode: options.force ? 'manual' : 'auto',
    durationMs: 0,
    ok: false,
    changed: [],
    ignored: [],
    raw: '',
    error: '',
  };
  const finish = (overrides = {}) => {
    clearTimeout(deadline);
    record.durationMs = Date.now() - startedAt;
    Object.assign(record, overrides);
    globalThis[VALUES_LAST_ROUND_KEY] = record;
    // 结束 toast：空轮（跳过）静默；失败 → error，有变化 → success，无变化 → info。
    if (!record.skipped) {
      if (record.error) {
        globalThis.toastr?.error?.(`变量更新失败：${record.error}`, `[${MODULE_DISPLAY_NAME}]`);
      } else if (record.changed.length > 0) {
        globalThis.toastr?.success?.(`变量更新成功：已更新 ${record.changed.length} 项`, `[${MODULE_DISPLAY_NAME}]`);
      } else {
        globalThis.toastr?.info?.('变量更新完成：本轮无变化', `[${MODULE_DISPLAY_NAME}]`);
      }
    }
    try {
      refreshHomeValuesStatus();
    } catch {}
    try {
      refreshGameViewIfActive();
    } catch {}
  };
  try {
    const keys = getValuesKeys(ctx);
    const current = getValuesGameTree(ctx);
    // 空态跳过只认卡内注册键：内置变量（友谊 / 友谊等级）常驻存在，但
    // 没有值也没有卡内注册键时没必要每轮发起维护（内置规则只有在树里
    // 已出现时才进提示词，见 buildValuesMaintainMessages）。
    const bundle = getValuesBundle(ctx);
    if (bundle.keys.length === 0 && valuesCountEntries(current) === 0) {
      logApp('debug', '变量维护跳过：没有已注册变量也没有现有变量');
      finish({ skipped: true });
      return record;
    }
    const prompt = getValuesMaintainPrompt(ctx);
    const messages = buildValuesMaintainMessages(ctx, prompt);
    logApp('info', '变量维护：AI 开始', `${record.mode} · ${keys.length} 个变量 · ${VALUES_MAINTAIN_RECENT_COUNT} 条消息`);
    globalThis.toastr?.info?.(`变量更新开始（${record.mode === 'manual' ? '手动' : '自动'}）…`, `[${MODULE_DISPLAY_NAME}]`);
    const content = await chatCompletion(settings, messages, {
      signal: controller.signal,
      maxTokens: VALUES_MAINTAIN_MAX_TOKENS,
      temperature: 0.2,
    });
    record.raw = String(content || '');
    const patch = parseValuesPatch(content);
    if (!patch) {
      logApp('warn', '变量维护：AI 返回无法解析，本轮保持原值', String(content || '').slice(0, 160));
      finish({ error: 'AI 返回无法解析' });
      return record;
    }
    // 子变量对 AI 只读：AI 输出里即使带了子变量也一律剔除（无视对子变量的修改），
    // 子变量最终值一律由合并后的父变量派生，保证与父变量一致。
    const parentPatch = stripValuesChildLeaves(patch, keys);
    const merged = mergeValuesPatch(current, parentPatch, getValuesRegistryNames(ctx));
    // 子变量派生：AI 可能改了父变量，合并后按最新父变量重算子变量（补丁里的
    // 子变量已被剔除，这里只负责把父变量变化落到子变量上）。
    deriveValuesChildren(merged.tree, keys);
    // 子变量路径不计入变化：其值由父变量决定，父变量变化时已体现在父变量路径上。
    const childKeyNames = new Set(getValuesChildKeys(ctx).map((key) => String(key.name || '').trim()));
    record.changed = merged.changed.filter((path) => {
      const leafName = String(path || '').split('.').pop();
      return !childKeyNames.has(leafName);
    });
    record.ignored = merged.ignored;
    if (merged.ignored.length > 0) {
      logApp('info', '变量维护：忽略未注册的新变量', merged.ignored.join('、'));
    }
    if (merged.changed.length === 0) {
      logApp('debug', '变量维护：本轮无变化');
      finish({ ok: true });
      return record;
    }
    const saved = saveValuesChatState(ctx, merged.tree, { lastSignature: options.signature || '' });
    logApp('info', '变量维护完成', `更新 ${record.changed.length} 项：${record.changed.join('、')}${saved ? '' : '（写入聊天文件失败）'}`);
    if (!saved) {
      globalThis.toastr?.warning?.('变量维护完成，但写入聊天文件失败', `[${MODULE_DISPLAY_NAME}]`);
    }
    finish({ ok: true });
    return record;
  } catch (error) {
    const cancelled = controller.signal.aborted;
    const message = String(error?.message || error);
    logApp('warn', '变量维护失败', cancelled ? '超时中止' : message);
    finish({ error: cancelled ? '超时中止' : message.slice(0, 200) });
    return record;
  } finally {
    valuesMaintainState.running = false;
  }
}

// generationEnded 入口：自适应主生成配对 + 末条变化 + 去重 + 运行锁 + 配置检查。
async function onValuesGenerationEnded() {
  const ctx = getContextSafe();
  if (!ctx) return;
  let settings;
  try {
    settings = getSettings(ctx);
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] 变量维护：读取设置失败`, error);
    return;
  }
  if (settings.valuesAutoUpdateEnabled === false) return;
  // 用户中断生成：跳过，避免对半截回复发起维护。
  if (ctx?.streamingProcessor?.abortController?.signal?.aborted) {
    logApp('info', '变量维护跳过：生成被中断');
    return;
  }
  const chat = Array.isArray(ctx.chat) ? ctx.chat : [];
  const lastMessage = chat[chat.length - 1];
  // 末条不是 AI 回复（空生成/失败/系统消息）：本轮没有可维护的新剧情。
  if (!lastMessage || lastMessage.is_user || lastMessage.is_system) {
    logApp('debug', '变量维护跳过：末条不是 AI 回复');
    return;
  }
  // 主生成流程判定（自适应配对）：
  // - 宿主确认会发 generationStarted（adaptivePairing=true）→ 严格配对：无配对的
  //   generationEnded（其他插件自行广播）直接跳过；
  // - 宿主从未发过 generationStarted（TauriTavern 部分版本如此）→ 不再因缺配对
  //   跳过，交给下方「末条签名去重 + 运行锁 + 中断检查」兜底防误触发。
  // - 配对在途（startChatSignature 非空）→ 一律按配对走，无论 adaptivePairing。
  const startSignature = valuesMainGenerationState.startChatSignature;
  valuesMainGenerationState.startChatSignature = '';
  const signature = buildValuesSignature(lastMessage);
  if (startSignature === '') {
    if (valuesMainGenerationState.adaptivePairing) {
      logApp('debug', '变量维护跳过：非主生成流程的 generationEnded');
      return;
    }
    logApp('debug', '变量维护：宿主无 generationStarted 配对，按末条变化兜底判定');
  } else if (signature === startSignature) {
    logApp('debug', '变量维护跳过：末条消息未变化');
    return;
  }
  if (valuesMaintainState.lastSignature === signature) {
    logApp('debug', '变量维护跳过：本轮已处理');
    return;
  }
  if (valuesMaintainState.running) {
    logApp('debug', '变量维护跳过：上一轮仍在运行');
    return;
  }
  if (!getApiBase(settings) || !String(settings.model || '').trim()) {
    logApp('debug', '变量维护跳过：API 未配置');
    return;
  }
  valuesMaintainState.running = true;
  valuesMaintainState.lastSignature = signature;
  await runValuesMaintain(ctx, settings, { signature });
}

// 手动维护（工作台按钮触发）：不受主生成配对约束，直接对当前游戏值跑一轮。
async function runValuesMaintainNow() {
  const ctx = getContextSafe();
  if (!ctx) return;
  let settings;
  try {
    settings = getSettings(ctx);
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] 变量维护：读取设置失败`, error);
    return;
  }
  if (!getApiBase(settings) || !String(settings.model || '').trim()) {
    logApp('warn', '变量维护：API 未配置');
    globalThis.toastr?.warning?.('变量维护需要先配置 API（Base URL / 模型）', `[${MODULE_DISPLAY_NAME}]`);
    return;
  }
  if (valuesMaintainState.running) {
    globalThis.toastr?.info?.('上一轮变量维护仍在进行', `[${MODULE_DISPLAY_NAME}]`);
    return;
  }
  valuesMaintainState.running = true;
  await runValuesMaintain(ctx, settings, { force: true });
}
