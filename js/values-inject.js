// ===== 万华镜（Kaleidoscope）变量注入：默认数值层勾选 → 发送前注入提示词 =====
// 触发时机：用户点击发送（messageSent，经跨扩展发送屏障），把勾选的节点 / 变量
// 以 YAML 形式注入到提示词中；注入位置 = IN_PROMPT（SillyTavern 的
// 「World Info (after)」之后，见 host.js getExtensionPromptApi 注释）；
// generationEnded / generationStopped 后清空注入，下一轮发送前重新注入最新值。
// 注入内容：当前游戏值（未初始化时回退默认值）按勾选路径裁剪后的 YAML 树。

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

// 注入：setExtensionPrompt(IN_PROMPT, depth 0) = World Info (after) 之后。
// 未开启 / 未勾选 / 无内容时不做任何调用（清理统一由 generationEnded 负责）。
function injectValuesIntoPrompt(ctx) {
  const api = getExtensionPromptApi(ctx);
  if (!api) return false;
  const text = buildValuesInjectText(ctx);
  if (!text) return false;
  api.setExtensionPrompt(VALUES_INJECT_KEY, text, api.inPrompt, 0, false, api.systemRole);
  return true;
}

function clearValuesInjection(ctx) {
  const api = getExtensionPromptApi(ctx);
  if (!api) return;
  try {
    api.setExtensionPrompt(VALUES_INJECT_KEY, '', api.inPrompt, 0);
  } catch (error) {
    logApp('warn', '清理变量注入失败', String(error?.message || error));
  }
}

// 发送前任务（注册进跨扩展发送屏障）：同步注入，失败静默降级，绝不阻塞发送。
// 只处理「用户点击发送」产生的新消息；系统消息 / 非用户末条一律跳过。
function runValuesInjectBarrierTask(ctx) {
  const chat = Array.isArray(ctx?.chat) ? ctx.chat : [];
  const lastMessage = chat[chat.length - 1];
  if (!lastMessage || !lastMessage.is_user) return Promise.resolve();
  try {
    injectValuesIntoPrompt(ctx);
  } catch (error) {
    logApp('warn', '变量注入失败', String(error?.message || error));
  }
  return Promise.resolve();
}

// 生成结束 / 停止后清空注入：swipes / 重生成 / 后续轮次不会复用本轮的旧值，
// 下一轮发送前会重新注入最新值。
function onValuesInjectGenerationCleanup() {
  const ctx = getContextSafe();
  if (!ctx) return;
  clearValuesInjection(ctx);
}

// 注册进跨扩展发送屏障：与剧情预筛并发执行，保证注入在主请求发出前完成。
getPreSendBarrier()?.register('kaleidoscope-values-inject', runValuesInjectBarrierTask);