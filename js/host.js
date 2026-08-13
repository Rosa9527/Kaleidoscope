// ===== 万华镜（Kaleidoscope）宿主适配层：SillyTavern / TauriTavern =====
function getContextSafe() {
  try {
    return globalThis.Luker?.getContext?.() || globalThis.SillyTavern?.getContext?.() || null;
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] unable to read host context`, error);
    return null;
  }
}

// 宿主事件名 → ctx.event_types 键 的映射。
// TauriTavern 的 eventSource 需要 event_types 的值（如 ctx.event_types.GENERATION_ENDED），
// 裸字符串名不会触发；标准 SillyTavern 的 event_types 值则是 snake_case。统一经
// ctx.event_types 解析，取不到时回退原字符串。
const HOST_EVENT_TYPE_KEYS = Object.freeze({
  appReady: 'APP_READY',
  extensionsLoaded: 'EXTENSIONS_LOADED',
  settingsLoaded: 'SETTINGS_LOADED',
  chatChanged: 'CHAT_CHANGED',
  groupSelected: 'GROUP_SELECTED',
  messageSent: 'MESSAGE_SENT',
  messageReceived: 'MESSAGE_RECEIVED',
  streamStarted: 'STREAM_STARTED',
  streamEnded: 'STREAM_ENDED',
  generationStarted: 'GENERATION_STARTED',
  generationEnded: 'GENERATION_ENDED',
  generationStopped: 'GENERATION_STOPPED',
  messageDeleted: 'MESSAGE_DELETED',
  onlineStatusChanged: 'ONLINE_STATUS_CHANGED',
});

function resolveHostEventType(ctx, eventName) {
  const typeKey = HOST_EVENT_TYPE_KEYS[eventName];
  if (typeKey && ctx?.event_types && ctx.event_types[typeKey] !== undefined && ctx.event_types[typeKey] !== null) {
    return ctx.event_types[typeKey];
  }
  return eventName;
}

// 统一挂载宿主事件订阅：以全局 key 去重，重挂时先移除旧监听，避免重复触发。
function onHostEvent(ctx, eventName, handler, key) {
  const eventSource = ctx?.eventSource;
  if (!eventSource || typeof eventSource.on !== 'function' || typeof handler !== 'function') return;
  const eventType = resolveHostEventType(ctx, eventName);
  if (globalThis[key] && typeof eventSource.removeListener === 'function') {
    eventSource.removeListener(eventType, globalThis[key]);
    globalThis[key] = null;
  }
  const wrapped = (...args) => {
    try {
      const result = handler(...args);
      if (result && typeof result.catch === 'function') {
        result.catch((error) => console.error(`[${MODULE_DISPLAY_NAME}] host event ${eventName} failed`, error));
      }
    } catch (error) {
      console.error(`[${MODULE_DISPLAY_NAME}] host event ${eventName} failed`, error);
    }
  };
  globalThis[key] = wrapped;
  eventSource.on(eventType, wrapped);
}

// 宿主注入 API 适配（剧情预筛 / 变量注入共用）：标准 SillyTavern 的 getContext()
// 会提供 extension_prompt_types / extension_prompt_roles；TauriTavern 2.x 不提供
// 这两个对象（也不挂 globalThis），因此只把 setExtensionPrompt 作为必需项，枚举值
// 按已知数值常量兜底：
// extension_prompt_types: NONE=-1, IN_PROMPT=0, IN_CHAT=1, BEFORE_PROMPT=2
// extension_prompt_roles: SYSTEM=0, USER=1, ASSISTANT=2
// IN_PROMPT 位置 = 提示词中「World Info (after)」之后（SillyTavern 的
// beforeScenarioAnchor / afterScenarioAnchor 锚点语义）。
function getExtensionPromptApi(ctx) {
  const context = ctx || getContextSafe();
  if (!context) return null;
  const setExtensionPrompt = typeof context.setExtensionPrompt === 'function'
    ? context.setExtensionPrompt
    : (typeof globalThis.setExtensionPrompt === 'function' ? globalThis.setExtensionPrompt : null);
  if (typeof setExtensionPrompt !== 'function') return null;
  const types = context.extension_prompt_types || globalThis.extension_prompt_types || null;
  const roles = context.extension_prompt_roles || globalThis.extension_prompt_roles || null;
  const inChat = (types && Number.isFinite(types.IN_CHAT)) ? types.IN_CHAT : 1;
  const inPrompt = (types && Number.isFinite(types.IN_PROMPT)) ? types.IN_PROMPT : 0;
  const systemRole = (roles && Number.isFinite(roles.SYSTEM)) ? roles.SYSTEM : 0;
  return { setExtensionPrompt, inChat, inPrompt, systemRole };
}
