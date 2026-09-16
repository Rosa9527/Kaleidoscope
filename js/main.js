// ===== 万华镜（Kaleidoscope）入口：启动 / 菜单注册 / 事件订阅 =====
function hasMenuEntry() {
  const menu = document.getElementById('extensionsMenu');
  if (!menu) return false;
  return Array.from(menu.children).some((node) => (
    node.id === MENU_ITEM_ID || node.id === MENU_API_ID || String(node.textContent || '').trim() === MODULE_DISPLAY_NAME
  ));
}

function createManualMenuItem() {
  if (hasMenuEntry()) return true;
  const menu = document.getElementById('extensionsMenu');
  if (!menu) return false;
  const item = document.createElement('div');
  item.id = MENU_ITEM_ID;
  item.className = 'list-group-item flex-container flexGap5 interactable';
  item.tabIndex = 0;
  item.innerHTML = `<div class="${MENU_ICON_CLASS} extensionsMenuExtensionButton"></div><span>${MODULE_DISPLAY_NAME}</span>`;
  const handleActivate = (event) => {
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
    if (event.type === 'keydown') event.preventDefault();
    togglePanel();
  };
  item.addEventListener('click', handleActivate);
  item.addEventListener('keydown', handleActivate);
  menu.appendChild(item);
  return true;
}

function ensureManualMenuItem(retries = MENU_RETRY_COUNT) {
  if (createManualMenuItem()) return;
  if (retries <= 0) {
    console.warn(`[${MODULE_DISPLAY_NAME}] 未找到 #extensionsMenu，无法插入菜单项。`);
    return;
  }
  setTimeout(() => ensureManualMenuItem(retries - 1), 500);
}

// 菜单自愈：宿主重建 #extensionsMenu 后重新注入菜单项。
function ensureMenuRecovery() {
  const insertRecoveryEntry = () => {
    if (!createManualMenuItem()) return false;
    document.getElementById('extensionsMenuButton')?.style.setProperty('display', 'flex');
    return true;
  };

  insertRecoveryEntry();
  if (globalThis[MENU_RECOVERY_OBSERVER_KEY] || typeof MutationObserver !== 'function' || !document.body) return;

  let scheduled = false;
  const observer = new MutationObserver((mutations) => {
    const menuChanged = mutations.some((mutation) => {
      if (mutation.target instanceof Element && mutation.target.id === 'extensionsMenu') return true;
      return Array.from(mutation.addedNodes).some((node) => (
        node instanceof Element && (node.id === 'extensionsMenu' || Boolean(node.querySelector?.('#extensionsMenu')))
      ));
    });
    if (!menuChanged || scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      insertRecoveryEntry();
    }, 0);
  });
  globalThis[MENU_RECOVERY_OBSERVER_KEY] = observer;
  observer.observe(document.body, { childList: true, subtree: true });
}

async function registerHostMenuItem() {
  const uiApi = globalThis.ST_API?.ui;
  if (typeof uiApi?.registerExtensionsMenuItem !== 'function') return false;
  const result = await uiApi.registerExtensionsMenuItem({
    id: MENU_API_ID,
    label: MODULE_DISPLAY_NAME,
    icon: MENU_ICON_CLASS,
    onClick: () => togglePanel(),
  });
  return result !== false;
}

async function registerMenuItem() {
  ensureMenuRecovery();
  ensureManualMenuItem(MENU_RETRY_COUNT);

  const tauriReady = globalThis.__TAURITAVERN__?.ready || globalThis.__TAURITAVERN_MAIN_READY__;
  if (tauriReady && typeof tauriReady.then === 'function') {
    try {
      await tauriReady;
    } catch (error) {
      console.warn(`[${MODULE_DISPLAY_NAME}] 等待 TauriTavern 宿主就绪失败。`, error);
    }
  }
  let registered = false;
  try {
    registered = await registerHostMenuItem();
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] host 菜单注册失败，改用手动注入。`, error);
  }
  if (registered) {
    document.getElementById(MENU_ITEM_ID)?.remove();
    logApp('info', '扩展菜单已通过宿主 API 注册');
    return;
  }
  ensureManualMenuItem();
  logApp('info', '扩展菜单已注入 #extensionsMenu');
}

// 宿主事件订阅统一入口：剧情预筛的 messageSent 阻塞监听与生成结束清理都在这里挂载。
function installHostEventSubscriptions(ctx) {
  installStoryGateMessageSentHook(ctx);
  onHostEvent(ctx, 'generationStarted', onStoryGateGenerationStarted, '__kaleido_story_gate_generation_started__');
  onHostEvent(ctx, 'generationEnded', onStoryGateGenerationCleanup, '__kaleido_story_gate_cleanup_ended__');
  onHostEvent(ctx, 'generationStopped', onStoryGateGenerationCleanup, '__kaleido_story_gate_cleanup_stopped__');
  // 变量自动维护：generationStarted → generationEnded 配对后，对最新两条消息
  // 发起一轮 AI 维护（更新聊天绑定的游戏值）；generationStopped / chatChanged
  // 清空配对跟踪，防止其他插件自行广播的 generationEnded 误触发。
  onHostEvent(ctx, 'generationStarted', onValuesGenerationStarted, VALUES_MAINTAIN_STARTED_KEY);
  onHostEvent(ctx, 'generationEnded', onValuesGenerationEnded, VALUES_MAINTAIN_HANDLER_KEY);
  onHostEvent(ctx, 'generationStopped', onValuesGenerationStopped, VALUES_MAINTAIN_STOPPED_KEY);
  onHostEvent(ctx, 'chatChanged', onValuesChatChanged, VALUES_MAINTAIN_CHAT_CHANGED_KEY);
  // 切换聊天 / 角色卡后刷新预设模版页：激活预设与预设列表随角色卡走（懒式
  // 读取，无事件也能取到最新数据，但面板若停在预设页需要重渲染）。
  onHostEvent(ctx, 'chatChanged', onPresetChatChanged, PROMPT_PRESET_CHAT_CHANGED_KEY);
  // 变量注入：常驻注入（与隔壁 BS BioTracker 的 mainflow 提示词同款）——
  // 数据变更时经 saveValuesData / saveValuesChatState 立即重刷，不再等点击发送，
  // 生成结束也不清空（swipe / 重新生成等不发 messageSent 的路径照常携带最新值）。
  // 这里负责「切换聊天」「启动」与「每轮生成结束后补刷」三条主动刷新路径，
  // 其中生成结束只重刷不清空（宿主清掉缓存时把常驻块补回来）。
  onHostEvent(ctx, 'chatChanged', onValuesInjectChatChanged, VALUES_INJECT_CHAT_CHANGED_KEY);
  onHostEvent(ctx, 'generationEnded', onValuesInjectGenerationRefresh, VALUES_INJECT_ENDED_KEY);
  onHostEvent(ctx, 'generationStopped', onValuesInjectGenerationRefresh, VALUES_INJECT_STOPPED_KEY);
  // 剧情触发：常驻注入（与变量注入同款）——条件满足的事件块一直挂在提示词上，
  // 数据变更经 saveValuesData / saveValuesChatState 立即重刷；这里负责「切换聊天」
  // 「启动」与「每轮生成结束后补刷」三条主动刷新路径，生成结束只重刷不清空
  // （本轮锁定者原样重写，swipe / 重新生成拿到与本轮一致的事件）。
  // 求值本身无副作用；事件效果与一次性关闭只在发送前任务里各执行一次。
  onHostEvent(ctx, 'chatChanged', onValuesTriggerChatChanged, VALUES_TRIGGER_CHAT_CHANGED_KEY);
  onHostEvent(ctx, 'generationEnded', onValuesTriggerGenerationRefresh, VALUES_TRIGGER_ENDED_KEY);
  onHostEvent(ctx, 'generationStopped', onValuesTriggerGenerationRefresh, VALUES_TRIGGER_STOPPED_KEY);
  // 游戏模式：每轮生成结束后若展示面板正打开，刷新游戏数据（变量维护完成
  // 后也会经 refreshGameViewIfActive 再刷一次，保证展示最新值）。
  onHostEvent(ctx, 'generationEnded', onGameViewGenerationRefresh, GAME_REFRESH_ENDED_KEY);
  // 删消息后清空发送屏障旧轮：宿主（TauriTavern）删除消息会复用被删消息的 ID
  // （楼层序号式），旧轮签名与新发送相同会让剧情预筛被误判为「同一发送已处理」
  // 而整轮跳过（删两层楼后首条消息不预筛、第二条才恢复）；删除后必然是新发送，清掉旧轮即可。
  onHostEvent(ctx, 'messageDeleted', clearSendBarrierRound, '__kaleido_send_barrier_clear_on_delete__');
}

// 游戏模式展示面板：生成结束后刷新（视图未打开时为空操作）。
function onGameViewGenerationRefresh() {
  refreshGameViewIfActive();
}

// 事件源自愈看门狗：TauriTavern 在主生成后可能重建 ctx.eventSource，导致 bootstrap 时
// 绑定到旧事件源的订阅成为孤儿。周期对比当前绑定事件源与宿主现时事件源的身份，
// 一旦被换就重挂订阅。
function startHostEventWatchdog() {
  if (globalThis[HOST_EVENT_WATCHDOG_KEY]) {
    globalThis.clearInterval?.(globalThis[HOST_EVENT_WATCHDOG_KEY]);
  }
  let boundEventSource = getContextSafe()?.eventSource || null;
  globalThis[HOST_EVENT_WATCHDOG_KEY] = globalThis.setInterval(() => {
    try {
      const freshCtx = getContextSafe();
      const freshEventSource = freshCtx?.eventSource || null;
      if (boundEventSource && freshEventSource && boundEventSource !== freshEventSource) {
        logApp('warn', '宿主事件源已更换，重新绑定事件订阅');
        installHostEventSubscriptions(freshCtx);
        boundEventSource = freshEventSource;
      }
    } catch (error) {
      console.warn(`[${MODULE_DISPLAY_NAME}] 事件源看门狗巡检失败`, error);
    }
  }, HOST_EVENT_WATCHDOG_INTERVAL_MS);
}

async function bootstrap() {
  if (globalThis[BOOTSTRAP_RUNTIME_KEY]) return;
  const ctx = getContextSafe();
  if (!ctx || !document.body) return;
  globalThis[BOOTSTRAP_RUNTIME_KEY] = true;
  try {
    initHostEventLogging();
    installHostEventSubscriptions(ctx);
    startHostEventWatchdog();
    createPanel();
    createSphere();
    showSphere();
    applyTheme(getCurrentTheme());
    // 常驻注入的首次写入：插件载入后不等用户点发送，提示词里就该有变量块与
    // 满足条件的剧情事件块（宿主 chatMetadata 可能稍后才就绪，内部自带补刷）。
    startValuesInjection();
    startValuesTriggerInjection();
    await registerMenuItem();
    logApp('info', `扩展就绪 v${MODULE_VERSION}`);
  } catch (error) {
    globalThis[BOOTSTRAP_RUNTIME_KEY] = false;
    throw error;
  }
}

onHostEvent(getContextSafe(), 'appReady', bootstrap, APP_READY_HANDLER_KEY);

function scheduleBootstrapFallback(retries = BOOTSTRAP_RETRY_COUNT) {
  const attempt = () => {
    bootstrap()
      .catch((error) => console.error(`[${MODULE_DISPLAY_NAME}] bootstrap failed`, error))
      .finally(() => {
        if (!globalThis[BOOTSTRAP_RUNTIME_KEY] && retries > 0) {
          retries -= 1;
          setTimeout(attempt, 500);
        }
      });
  };
  attempt();
}
scheduleBootstrapFallback();
