// ===== 万华镜（Kaleidoscope）变量注入：默认数值层勾选 → 常驻注入提示词 =====
// 注入方式（与隔壁 BS BioTracker 的 mainflow 提示词同款「常驻」模型）：
// 不在点击发送时临时写入，而是**只要数据变了就把注入刷成最新**，注入结果一直
// 挂在宿主提示词上，直到内容本身变化（开关关闭 / 取消勾选 / 变量被删）才清空。
// 刷新时机：
//   - 变量数据落盘（saveValuesData / saveValuesChatState 两个写入口统一挂钩），
//     覆盖手动编辑、AI 维护完成、剧情触发/预筛事件效果、YAML 导入、重置游戏值；
//   - 切换聊天（chatChanged，含启动补刷，等宿主把新聊天的 chatMetadata 读出来）；
//   - 生成结束 / 停止（只重刷不清空：宿主清掉提示词缓存时把常驻块补回来）；
//   - 点击发送（发送屏障兜底重断言：内容通常已是最新，此处只防御宿主漏刷）。
// 注入位置 = IN_PROMPT（SillyTavern 的「World Info (after)」之后，见 host.js
// getExtensionPromptApi 注释）。
// 注入内容：当前游戏值（未初始化时回退默认值）按勾选路径裁剪后的 YAML 树。
//
// 为什么从「发送时注入」改成「常驻」：原实现把 setExtensionPrompt 放在 messageSent
// 里、生成结束再清空，等于注入的存活期只有一轮，且**完全依赖宿主发 messageSent**——
// swipe / 重新生成等不发 messageSent 的路径拿到的是空块，维护完成后也不能立刻反映到
// 提示词上。常驻模型下这些场景天然正确：注入始终等于「最近一次数据变更后的变量状态」。

// 注入文本：<Values> 块 + 说明 + YAML。只注入「自身打开」的变量（叶子）；
// 容器节点本身不注入内容（打开节点 = 允许子树，具体注入哪些变量由各后代
// 自己的开关决定）；祖先未打开的路径防御性跳过；路径不存在时跳过。
function buildValuesInjectText(ctx) {
  const config = getValuesInjectConfig(ctx);
  if (!config.enabled || !Array.isArray(config.paths) || config.paths.length === 0) return '';
  const tree = getValuesGameTree(ctx);
  const selected = {};
  for (const item of config.paths) {
    const path = String(item || '').split('/').filter(Boolean);
    if (path.length === 0) continue;
    const node = valuesGetAtPath(tree, path);
    if (node === undefined || valuesIsContainer(node)) continue;
    // 防御：祖先必须全部打开（正常交互下由自动提升保证）。
    let ancestorsOk = true;
    for (let i = 1; i < path.length; i += 1) {
      if (!config.paths.includes(path.slice(0, i).join('/'))) {
        ancestorsOk = false;
        break;
      }
    }
    if (!ancestorsOk) continue;
    valuesSetAtPath(selected, path, cloneValue(node));
  }
  const yaml = serializeValuesTree(selected, '');
  if (!yaml) return '';
  return [
    '<Values>',
    '【系统信息】本块不是剧情正文，是当前变量状态（YAML 格式）。请让接下来的剧情与这些变量保持一致；变量发生变化时按规则自然体现，不要复述本块原文。',
    '',
    yaml,
    '</Values>',
  ].join('\n');
}

// 注入运行态：`written` 记住「当前提示词里是否已有一份注入」。空内容时只有写过
// 才需要清理调用——从不写入的聊天（未开启 / 未勾选）零调用，与旧行为一致。
function getValuesInjectState() {
  const existing = globalThis[VALUES_INJECT_STATE_KEY];
  if (existing && typeof existing === 'object') return existing;
  const state = { written: false };
  globalThis[VALUES_INJECT_STATE_KEY] = state;
  return state;
}

// 刷新注入：内容变了就写入最新，内容为空且曾写过就清空。返回是否写入了非空注入。
// 宿主不支持注入（无 setExtensionPrompt）时静默返回，绝不抛错。
function refreshValuesInjection(ctx) {
  const api = getExtensionPromptApi(ctx);
  if (!api) return false;
  const state = getValuesInjectState();
  let text = '';
  try {
    text = buildValuesInjectText(ctx);
  } catch (error) {
    logApp('warn', '变量注入失败', String(error?.message || error));
    return false;
  }
  if (!text) {
    if (!state.written) return false;
    try {
      api.setExtensionPrompt(VALUES_INJECT_KEY, '', api.inPrompt, 0);
      state.written = false;
    } catch (error) {
      logApp('warn', '清理变量注入失败', String(error?.message || error));
    }
    return false;
  }
  try {
    api.setExtensionPrompt(VALUES_INJECT_KEY, text, api.inPrompt, 0, false, api.systemRole);
    state.written = true;
    return true;
  } catch (error) {
    logApp('warn', '变量注入失败', String(error?.message || error));
    return false;
  }
}

// 数据落盘后的刷新入口（saveValuesData / saveValuesChatState 统一调用）：
// 没有 ctx 可用时静默跳过，读取失败一律降级，绝不影响保存本身。
function onValuesDataChangedForInject(ctx) {
  try {
    refreshValuesInjection(ctx);
  } catch (error) {
    logApp('warn', '变量注入刷新失败', String(error?.message || error));
  }
}

// 链式延迟补刷（变量注入 / 剧情触发共用）：按 delays 依次 setTimeout 执行 job，
// 同 key 只保留一条链（重排时先清旧定时器）。供「启动 / 切聊天」等宿主数据可能
// 晚于事件就绪的场景收敛到实际值。
function scheduleDelayedRefreshes(timerKey, delays, job) {
  const pending = (Array.isArray(delays) ? delays : [])
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0);
  if (globalThis[timerKey]) {
    clearTimeout(globalThis[timerKey]);
    globalThis[timerKey] = null;
  }
  const scheduleNext = () => {
    const delay = pending.shift();
    if (delay === undefined) {
      globalThis[timerKey] = null;
      return;
    }
    globalThis[timerKey] = setTimeout(() => {
      try {
        job();
      } catch (error) {
        logApp('warn', '延迟补刷失败', String(error?.message || error));
      }
      scheduleNext();
    }, delay);
  };
  scheduleNext();
}

// 切换聊天 / 启动后的补刷：新聊天的 chatMetadata（游戏值所在处）可能晚于事件
// 才就绪，早刷只能拿到默认值，因此按 delays 再刷几次收敛到实际值。
function scheduleValuesInjectionRefresh(ctx, delays) {
  scheduleDelayedRefreshes(
    VALUES_INJECT_STARTUP_TIMER_KEY,
    delays || VALUES_INJECT_STARTUP_REFRESH_DELAYS,
    () => {
      const freshCtx = getContextSafe();
      if (!freshCtx) return;
      try {
        refreshValuesInjection(freshCtx);
      } catch (error) {
        logApp('warn', '变量注入补刷失败', String(error?.message || error));
      }
    },
  );
}

// 切换聊天：按新聊天的数据重刷注入（游戏值随聊天文件走）。运行态**不能**在这里
// 重置：新聊天若没有可注入内容，「曾经写过」这个事实正是清掉旧聊天残留块的依据。
function onValuesInjectChatChanged() {
  const ctx = getContextSafe();
  if (!ctx) return;
  try {
    refreshValuesInjection(ctx);
  } catch (error) {
    logApp('warn', '变量注入刷新失败', String(error?.message || error));
  }
  scheduleValuesInjectionRefresh(ctx);
}

// 启动首次注入 + 补刷：与 biotracker 的 bootstrap 刷新同款，保证插件载入后
// 不点发送也能在提示词里看到变量块。
function startValuesInjection() {
  const ctx = getContextSafe();
  if (!ctx) return;
  try {
    refreshValuesInjection(ctx);
  } catch (error) {
    logApp('warn', '变量注入启动刷新失败', String(error?.message || error));
  }
  scheduleValuesInjectionRefresh(ctx);
}

// 发送前任务（注册进跨扩展发送屏障）：**兜底重断言**，不是唯一注入点。
// 常驻刷新已覆盖全部数据变更路径，此处只防御「数据在宿主侧被改动而扩展未收到
// 通知」之类的漏刷；同步执行、失败静默降级，绝不阻塞发送。
// 只处理「用户点击发送」产生的新消息；系统消息 / 非用户末条一律跳过。
function runValuesInjectBarrierTask(ctx) {
  const chat = Array.isArray(ctx?.chat) ? ctx.chat : [];
  const lastMessage = chat[chat.length - 1];
  if (!lastMessage || !lastMessage.is_user) return Promise.resolve();
  onValuesDataChangedForInject(ctx);
  return Promise.resolve();
}

// 生成结束 / 停止后的重断言：**只重刷、不清空**（与旧版「清空等下一轮」相反）。
// 常驻注入要求提示词里始终有最新变量块；宿主重建 prompt 缓存或扩展提示词被
// 其他环节清掉时，这一步把它补回来（内容相同则等价于无操作）。
function onValuesInjectGenerationRefresh() {
  const ctx = getContextSafe();
  if (!ctx) return;
  try {
    refreshValuesInjection(ctx);
  } catch (error) {
    logApp('warn', '变量注入刷新失败', String(error?.message || error));
  }
}

// 注册进跨扩展发送屏障：与剧情预筛并发执行，保证注入在主请求发出前是最新的。
getPreSendBarrier()?.register('kaleidoscope-values-inject', runValuesInjectBarrierTask);
