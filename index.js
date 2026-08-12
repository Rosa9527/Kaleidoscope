// ===== js/constants.js =====
// ===== 万华镜（Kaleidoscope）全局常量 =====
const MODULE_NAME = 'Kaleidoscope';
const MODULE_DISPLAY_NAME = '万华镜';
const MODULE_VERSION = '0.7.9';
const GITHUB_REPO_URL = 'https://github.com/Rosa9527/Kaleidoscope';

// ---------- DOM ID / class ----------
const PANEL_ID = 'kaleido-panel';
const SPHERE_ID = 'kaleido-floating-sphere';
const MENU_ITEM_ID = 'kaleido-menu-item';
const MENU_API_ID = 'kaleido-menu-api';
// 图标：fa-fan 是扇面，旋转起来即万花筒意象。
const MENU_ICON_CLASS = 'fa-solid fa-fan';
const API_ICON_CLASS = 'fa-solid fa-link';
const STORY_ICON_CLASS = 'fa-solid fa-scroll';
const NODE_ICON_CLASS = 'fa-solid fa-code-branch';
const INJECT_ICON_CLASS = 'fa-solid fa-arrow-right-to-bracket';
const LOG_ICON_CLASS = 'fa-solid fa-book';
const PRESET_ICON_CLASS = 'fa-solid fa-file-lines';
const PANEL_TITLE_ID = 'kaleido-panel-title';
const PANEL_BACK_ID = 'kaleido-panel-back';
const HOME_VIEW_ID = 'kaleido-home-view';
const API_VIEW_ID = 'kaleido-api-view';
const HOME_API_CARD_ID = 'kaleido-home-api-card';
const HOME_API_STATUS_ID = 'kaleido-home-api-status';
const API_STATUS_ID = 'kaleido-api-status';
const API_URL_ID = 'kaleido-api-url';
const API_KEY_ID = 'kaleido-api-key';
const API_KEY_TOGGLE_ID = 'kaleido-api-key-toggle';
const API_CONNECT_ID = 'kaleido-api-connect';
const API_MODEL_LIST_ID = 'kaleido-api-model-list';
const API_MODEL_ID = 'kaleido-api-model';
const API_CONCURRENCY_TOGGLE_ID = 'kaleido-api-concurrency-toggle';
const API_CONCURRENCY_INPUT_ID = 'kaleido-api-concurrency-input';
const API_REASONING_EFFORT_ID = 'kaleido-api-reasoning-effort';
// 首页「注入实录」卡片 + 注入实录视图
const HOME_INJECT_CARD_ID = 'kaleido-home-inject-card';
const HOME_INJECT_STATUS_ID = 'kaleido-home-inject-status';
const INJECT_VIEW_ID = 'kaleido-inject-view';
const INJECT_SUMMARY_ID = 'kaleido-inject-summary';
const INJECT_EMPTY_ID = 'kaleido-inject-empty';
const INJECT_GATE_TEXT_ID = 'kaleido-inject-gate-text';
const INJECT_EVENTS_ID = 'kaleido-inject-events';
const INJECT_TEXT_ID = 'kaleido-inject-text';
const INJECT_COPY_ID = 'kaleido-inject-copy';

// 系统日志
const LOG_VIEW_ID = 'kaleido-log-view';
const HOME_LOG_CARD_ID = 'kaleido-home-log-card';
const HOME_LOG_STATUS_ID = 'kaleido-home-log-status';
const HOME_LOG_BUTTON_ID = 'kaleido-home-log-button';
const HOME_LOG_BADGE_ID = 'kaleido-home-log-badge';
const LOG_SEARCH_ID = 'kaleido-log-search';
const LOG_SOURCE_ID = 'kaleido-log-source';
const LOG_MAX_ID = 'kaleido-log-max';
const LOG_NOISE_ID = 'kaleido-log-noise';
const LOG_PAUSE_ID = 'kaleido-log-pause';
const LOG_AUTOSCROLL_ID = 'kaleido-log-autoscroll';
const LOG_CLEAR_ID = 'kaleido-log-clear';
const LOG_COPY_ID = 'kaleido-log-copy';
const LOG_EXPORT_ID = 'kaleido-log-export';
const LOG_FULL_BODY_EXPORT_ID = 'kaleido-log-fullbody-export';
const LOG_LIST_ID = 'kaleido-log-list';
const LOG_BACK_ID = 'kaleido-log-back-to-latest';
const LOG_STATUS_ID = 'kaleido-log-status';
const LOG_PAUSED_ID = 'kaleido-log-paused-badge';

// 预设模版（默认提示词编辑）
const PRESET_VIEW_ID = 'kaleido-preset-view';
const HOME_PRESET_CARD_ID = 'kaleido-home-preset-card';
const HOME_PRESET_STATUS_ID = 'kaleido-home-preset-status';
const PRESET_TABS_ID = 'kaleido-preset-tabs';
const PRESET_TEXT_ID = 'kaleido-preset-text';
const PRESET_SAVE_ID = 'kaleido-preset-save';
const PRESET_RESET_ID = 'kaleido-preset-reset';
const PRESET_STATUS_ID = 'kaleido-preset-status';
const PRESET_COUNT_ID = 'kaleido-preset-count';
// 剧情预筛（预设模版设置区）
const PRESET_GATE_TOGGLE_ID = 'kaleido-preset-gate-toggle';
const PRESET_GATE_STATUS_ID = 'kaleido-preset-gate-status';

// 剧情脉络（Storyline）· 可视化工作台
const STORY_DIALOG_ID = 'kaleido-story-dialog';
const STORY_DIALOG_KEY = '__kaleido_story_dialog_key__';
const STORY_CLOSE_BTN_ID = 'kaleido-story-close-btn';
const HOME_STORY_CARD_ID = 'kaleido-home-story-card';
const HOME_STORY_STATUS_ID = 'kaleido-home-story-status';
const STORY_IMPORT_BTN_ID = 'kaleido-story-import-btn';
const STORY_IMPORT_INPUT_ID = 'kaleido-story-import-input';
const STORY_EXPORT_BTN_ID = 'kaleido-story-export-btn';
const STORY_TREE_ID = 'kaleido-story-tree';
const STORY_TREE_BODY_ID = 'kaleido-story-tree-body';
const STORY_ROOT_ADD_ID = 'kaleido-story-root-add';
const STORY_IMPORT_SCRIPT_INPUT_ID = 'kaleido-story-import-script-input';
const STORY_IMPORT_MODE_ID = 'kaleido-story-import-mode';
const STORY_IMPORT_MODE_DESC_ID = 'kaleido-story-import-mode-desc';
const STORY_IMPORT_MODE_MERGE_ID = 'kaleido-story-import-mode-merge';
const STORY_IMPORT_MODE_REPLACE_ID = 'kaleido-story-import-mode-replace';
const STORY_ADD_MENU_ID = 'kaleido-story-add-menu';
const STORY_ADD_MENU_KEY = '__kaleido_story_add_menu_key__';
const STORY_ADD_MENU_NODE_ID = 'kaleido-story-add-menu-node';
const STORY_ADD_MENU_SCRIPT_ID = 'kaleido-story-add-menu-script';
const STORY_EDITOR_ID = 'kaleido-story-editor';
const STORY_EDITOR_TITLE_ID = 'kaleido-story-editor-title';
const STORY_NODE_FIELDS_ID = 'kaleido-story-node-fields';
const STORY_SCRIPT_FIELDS_ID = 'kaleido-story-script-fields';
const STORY_NODE_NAME_ID = 'kaleido-story-node-name';
const STORY_NODE_PARENT_ID = 'kaleido-story-node-parent';
const STORY_NODE_DESC_ID = 'kaleido-story-node-desc';
const STORY_SCRIPT_NAME_ID = 'kaleido-story-script-name';
const STORY_SCRIPT_ID_ID = 'kaleido-story-script-id';
const STORY_SCRIPT_TRIGGER_ID = 'kaleido-story-script-trigger';
const STORY_SCRIPT_DESC_ID = 'kaleido-story-script-desc';
const STORY_SCRIPT_NODE_SELECT_ID = 'kaleido-story-script-node-select';
const STORY_SCRIPT_CONTENT_ID = 'kaleido-story-script-content';
const STORY_EDITOR_EXPORT_ID = 'kaleido-story-editor-export';
const STORY_EDITOR_SAVE_ID = 'kaleido-story-editor-save';
const STORY_EDITOR_CANCEL_ID = 'kaleido-story-editor-cancel';
const STORY_BINDING_ID = 'kaleido-story-binding';
const STORY_BUNDLE_VERSION = 1;
// 整包 YAML 的自描述格式标记：导入时凭此标记识别「剧情脉络包」。
const STORY_BUNDLE_FORMAT = 'kaleidoscope-story';
const STORY_BUNDLE_FILENAME_PREFIX = '万华镜-剧情脉络';
// 绑定角色卡时的整包导出文件名前缀：剧情脉络: 角色卡名.yaml。
const STORY_CARD_BUNDLE_FILENAME_PREFIX = '剧情脉络: ';
const STORY_SCRIPT_FILENAME_PREFIX = '万华镜-事件';
// 剧情脉络 · 角色卡绑定（参考 SillyTavern 局部正则脚本：数据存角色卡 extensions，
// 随角色卡导入/导出自动携带；群聊/未选角色时回退全局设置）。
const STORY_CARD_EXTENSION_KEY = 'kaleidoscope_story';
const STORY_CARD_DATA_VERSION = 1;
const STORY_CARD_SAVE_DEBOUNCE_MS = 500;
const STORY_CARD_SAVE_TIMER_KEY = '__kaleido_story_card_save_timer__';
// ---------- 剧情预筛（Story Gate）----------
const STORY_GATE_INJECT_KEY = 'Kaleidoscope_Story_Event';
const STORY_GATE_RECENT_COUNT = 4;
const STORY_GATE_TIMEOUT_MS = 45000;
const STORY_GATE_MAX_SELECTED = 5;
const STORY_GATE_HANDLER_KEY = '__kaleido_story_gate_handler__';
const STORY_GATE_LAST_ROUND_KEY = '__kaleido_story_gate_last_round__';
// 树形工作台图标（宿主为 Font Awesome 6）
const STORY_CHEVRON_ICON_CLASS = 'fa-solid fa-chevron-right';
const STORY_NODE_ICON_CLASS = 'fa-solid fa-folder';
const STORY_NODE_OPEN_ICON_CLASS = 'fa-solid fa-folder-open';
const STORY_SCRIPT_ICON_CLASS = 'fa-solid fa-scroll';
const STORY_ADD_CHILD_ICON_CLASS = 'fa-solid fa-plus';
const STORY_IMPORT_ICON_CLASS = 'fa-solid fa-file-import';
const STORY_EDIT_ICON_CLASS = 'fa-solid fa-pen';
const STORY_EXPORT_ICON_CLASS = 'fa-solid fa-download';
const STORY_DELETE_ICON_CLASS = 'fa-solid fa-trash-can';
// 思考强度选项：reasoning_effort 是 OpenAI 兼容标准参数（Ollama /v1/chat/completions
// 与 OpenAI 官方均支持）；none=关闭思考，low/medium/high/max=思考级别，空=不发送。
const REASONING_EFFORT_OPTIONS = Object.freeze([
  { value: '', label: '默认（不发送）' },
  { value: 'none', label: '关闭思考' },
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'max', label: '最大' },
]);

// ---------- 悬浮球 / 面板 ----------
const SPHERE_SIZE = 44;
const SPHERE_DRAG_THRESHOLD = 8;
const SPHERE_LONG_PRESS_MS = 650;
const EDGE_GAP = 24;
const SPHERE_POSITION_KEY = `${MODULE_NAME}_floating_sphere_position`;

// ---------- 菜单 / 启动 ----------
const MENU_RETRY_COUNT = 40;
const BOOTSTRAP_RETRY_COUNT = 60;
const HOST_EVENT_WATCHDOG_INTERVAL_MS = 4000;
const APP_READY_HANDLER_KEY = '__kaleido_app_ready_handler__';
const BOOTSTRAP_RUNTIME_KEY = '__kaleido_bootstrapped__';

// ---------- API ----------
const DEFAULT_API_TIMEOUT_MS = 30000;
const MODEL_LIST_TIMEOUT_MS = 20000;
const CHAT_COMPLETION_TIMEOUT_MS = 120000;
const CHAT_COMPLETION_MAX_ATTEMPTS = 2;
const CHAT_COMPLETION_RETRY_DELAY_MS = 1200;
const CHAT_COMPLETION_DEFAULT_MAX_TOKENS = 2048;

// ---------- 系统日志 ----------
const LOG_MAX_ENTRIES_DEFAULT = 2000;
const LOG_RENDER_CAP = 1000;
const LOG_SEARCH_DEBOUNCE_MS = 120;
const LOG_DETAIL_CAP = 20000;
const LOG_REQUEST_BODY_CAP = 6000;
const LOG_RESPONSE_BODY_CAP = 20000;
// 完整请求体/响应体捕获：只保留最近 N 次对话请求（未截断），供导出排查。
const LOG_FULL_BODY_MAX = 5;
// 噪音过滤名单：console 噪音按消息前缀（debug/info 级别），network 噪音按 URL 模式。
// 只过滤 Tavern 内部刷屏（正则跳过 / 事件总线 / 世界书概率 / 元数据保存 / 非模型 IPC），
// warn/error、万华镜自身日志与模型 API 调用永不误伤。
const LOG_NOISE_PREFIXES = Object.freeze([
  '[WI]',
  '[Prompt Template]',
  'getRegexedString: Skipping script',
  'Event emitted: ',
  'WI entry ',
  'Chat Completions: saving token cache',
  'Saving metadata',
  'Saved metadata',
  'Debounced metadata save cancelled',
  '---calling setPromptString',
  'calling runGenerate',
  'generating prompt',
  'Auto-continue is disabled by user.',
  'Skipping extension interceptors for dry run',
  'Core/all messages:',
  'skipWIAN not active',
]);
const NETWORK_NOISE_PATTERNS = Object.freeze([
  /ipc\.localhost/,
  /\/api\/chats\//,
]);
// 宿主扩展更新检查的已知报错（error 级），属运行环境噪音而非插件故障：
// TauriTavern 读扩展目录 git remote 时发现 URL 内嵌认证令牌会拒绝做版本对比。
// 单独成表、用模式匹配，避免与「warn/error 永不误伤」的通用原则冲突。
const ERROR_NOISE_PATTERNS = Object.freeze([
  /Authenticated Git remote URLs are not supported/,
  /Failed to get extension version/,
  /\/api\/extensions\/version/,
]);
const LOG_LEVELS = Object.freeze(['debug', 'info', 'warn', 'error']);
const HOST_EVENTS_TO_LOG = Object.freeze([
  'appReady',
  'extensionsLoaded',
  'settingsLoaded',
  'chatChanged',
  'groupSelected',
  'messageSent',
  'messageReceived',
  'streamStarted',
  'streamEnded',
  'generationStarted',
  'generationEnded',
  'generationStopped',
  'messageDeleted',
  'onlineStatusChanged',
]);
// 热重载共享状态 key：脚本重新执行时，新旧实例共用同一份缓冲与暂停/序列状态。
const LOG_STATE_KEY = '__kaleido_log_state__';
const LOG_CAPTURE_KEY = '__kaleido_log_capture__';
const LOG_EVENT_LOG_KEY = '__kaleido_log_event_handler__';
const NETWORK_CAPTURE_KEY = '__kaleido_network_capture__';

// ---------- 设置 ----------
const DEFAULT_SETTINGS = Object.freeze({
  apiUrl: '',
  apiKey: '',
  model: '',
  modelOptions: [],
  apiConcurrencyEnabled: true,
  apiConcurrencyLimit: 3,
  apiReasoningEffort: '',
  storyNodes: [],
  storyScripts: [],
  storyGateEnabled: true,
  storyGatePrompt: '',
});

// 宿主上下文不可扩展时的兜底设置存储（WeakMap 随上下文释放）。
const FALLBACK_SETTINGS_STORE = new WeakMap();

// ---------- 剧情预筛默认提示词 ----------
// 与「剧情预筛」的输入说明保持一致：事件目录（<Story_Events>）只含节点与事件的
// 名字 / ID / 触发条件 / 描述，不含正文；recent_messages 严格取最近 4 条。
const DEFAULT_STORY_GATE_PROMPT = [
  '【任务】',
  '你是「剧情预筛」子 agent。',
  '你的任务：判断「最后一条用户消息引发的下一轮剧情」中，哪些预置剧情事件应该被触发，筛出事件 ID 供系统注入。',
  '这是高频轻量调用，必须最快返回：直接给出结论，不要输出分析过程、不要解释、不要任何多余文字，回复越短越好。',
  '你的唯一产出是一个 JSON 名单（结构见【输出】）。',
  '',
  '【输入】',
  '本轮输入包含两份材料：',
  '- <Story_Events>：当前全部剧情节点与事件目录，是唯一的候选集。只从这份目录中挑选，目录之外的事件（即使剧情里自然发生）一律不列入。',
  '  · 每个事件只展示：所属节点、事件 ID、名称、触发条件、描述。事件正文不展示，你只负责挑选，不负责内容。',
  '- <Recent_Messages>：当前场景的最新几条消息，是判断依据。只用于判断目录中的事件，不要从对话中寻找目录之外的事件。',
  '  · 最后一条用户消息是下一轮剧情的直接触发点：优先判断它点名、涉及或会波及目录中的哪些事件；其余消息用于确认当前剧情进展到哪一步、哪些前置条件已满足。',
  '',
  '【推演】',
  '对目录中的每个事件，在心里按以下顺序过一遍，不要写出来：',
  '1. 条件判定：触发条件是否已满足？明确未满足（前置剧情未发生、地点/时间/人物不符）的直接排除。',
  '2. 时机判定：本轮是否适合触发？事件是否与当前剧情直接相关，还是属于更晚阶段的内容。',
  '3. 归类：按【判定标准】归入「必须触发 / 应触发 / 不触发」。',
  '',
  '【判定标准】',
  '- 必须触发：触发条件已满足、且本轮剧情直接命中该事件（玩家点名、行动直接触及、剧情进展到该节点）的事件。',
  '- 应触发：触发条件已满足、且当前剧情明显推进到该事件附近（前置已发生、场景/人物吻合、情绪与氛围到位），本轮不触发会显得剧情脱节的事件。',
  '- 不触发：触发条件未满足、剧情尚未推进到该阶段、或只是背景提及的事件。宁可漏选也不可错选——错误触发会破坏剧情节奏。',
  '',
  '【输出】',
  '你的回复必须且只能是一个 JSON 对象，这是本提示词的最高优先级契约：不要 Markdown、不要 ```json 代码块标记、不要解释、不要前后缀文字。',
  '结构必须是：{ "events": ["001", "002"] }',
  '- events 只能从 <Story_Events> 目录中挑选，ID 必须与目录逐字一致：程序按 ID 精确匹配，写错 ID 的事件会被丢弃。',
  '- 本轮没有事件需要触发时返回空数组：{ "events": [] }',
  '- 入选事件较多时，按触发优先级排序，最多保留 5 个最应触发的事件；优先级依次看：与最后一条用户消息的直接关联 → 触发条件的满足程度 → 剧情推进的紧迫程度。',
  '',
  '【质量红线】',
  '- 触发判定从严：条件未满足或时机未到的事件不触发——错误触发会注入无关内容干扰主模型，宁可漏选也不可错选。',
  '- 关联判定从宽：拿不准是否与本轮相关时，若触发条件已满足且剧情已推进到附近，倾向列入。',
].join('\n');

// ---------- 预设模版 ----------
// 各子系统默认提示词的编辑元信息：settingsKey 指向 settings 中的存储字段
// （空字符串 = 使用内置默认），与 API 连接页的提示词编辑区共用同一数据源。
const PRESET_DEFAULT_KEY = 'storyGate';
const PRESET_META = Object.freeze({
  storyGate: Object.freeze({
    label: '剧情预筛',
    title: '剧情预筛提示词',
    description: '发送前子 agent 依据事件目录与最近消息挑选本轮应触发的事件。',
    settingsKey: 'storyGatePrompt',
    getDefault: () => DEFAULT_STORY_GATE_PROMPT,
  }),
});

// 视图标题表：showPanelView 切换时更新面板标题。
const PANEL_VIEW_TITLES = Object.freeze({
  [HOME_VIEW_ID]: MODULE_DISPLAY_NAME,
  [API_VIEW_ID]: 'API 连接',
  [LOG_VIEW_ID]: '系统日志',
  [PRESET_VIEW_ID]: '预设模版',
  [INJECT_VIEW_ID]: '注入实录',
});
// 宽视图模式：日志视图需要更宽的窗口展示时间/级别/来源/内容。
const PANEL_WIDE_MODES = Object.freeze({
  [LOG_VIEW_ID]: 'is-log-mode',
  [PRESET_VIEW_ID]: 'is-preset-mode',
  [INJECT_VIEW_ID]: 'is-inject-mode',
});
const ESC_KEY_HANDLER_KEY = '__kaleido_esc_key_handler__';
const MENU_RECOVERY_OBSERVER_KEY = '__kaleido_menu_recovery_observer__';
const HOST_EVENT_WATCHDOG_KEY = '__kaleido_host_event_watchdog__';


// ===== js/utils.js =====
// ===== 万华镜（Kaleidoscope）通用工具：设置读写 / API 请求 =====
function cloneValue(value) {
  if (typeof globalThis.structuredClone === 'function') return globalThis.structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}


// 轻量日志：写入系统日志缓冲（面板「系统日志」视图可见），同时输出到控制台。
// pushLogEntry / CONSOLE_ORIGINALS 由 js/views-log.js 提供；加载顺序保证运行时已就绪。
function logApp(level, ...args) {
  try {
    if (typeof pushLogEntry === 'function') pushLogEntry(level, 'kaleido', args);
  } catch {}
  try {
    const method = level === 'info' ? 'log' : level;
    const original = (typeof CONSOLE_ORIGINALS !== 'undefined' && CONSOLE_ORIGINALS[method])
      || globalThis.console[method] || globalThis.console.log;
    original.apply(globalThis.console, [`[${MODULE_DISPLAY_NAME}]`, ...args]);
  } catch {}
}

// ---------- 设置读写 ----------
function getHostExtensionSettings(ctx) {
  if (!ctx || typeof ctx !== 'object') return null;
  try {
    if (!ctx.extensionSettings || typeof ctx.extensionSettings !== 'object') {
      ctx.extensionSettings = {};
      if (!ctx.extensionSettings || typeof ctx.extensionSettings !== 'object') {
        throw new TypeError('host context is not extensible');
      }
    }
    return ctx.extensionSettings;
  } catch (error) {
    // 某些宿主（如 TauriTavern）的 context 可能冻结/不可扩展，回退 WeakMap 存储。
    console.warn(`[${MODULE_DISPLAY_NAME}] host context is not extensible; using fallback settings store`, error);
    let store = FALLBACK_SETTINGS_STORE.get(ctx);
    if (!store) {
      store = {};
      FALLBACK_SETTINGS_STORE.set(ctx, store);
    }
    return store;
  }
}

function getSettings(ctx) {
  const root = getHostExtensionSettings(ctx);
  if (!root) throw new Error(`[${MODULE_DISPLAY_NAME}] host extension settings are unavailable`);
  if (!root[MODULE_NAME]) root[MODULE_NAME] = cloneValue(DEFAULT_SETTINGS);
  const settings = root[MODULE_NAME];
  let shouldSave = false;
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (settings[key] === undefined) {
      settings[key] = cloneValue(value);
      shouldSave = true;
    }
  }
  if (!Array.isArray(settings.modelOptions)) {
    settings.modelOptions = [];
    shouldSave = true;
  }
  if (shouldSave) saveSettings(ctx);
  return settings;
}

function saveSettings(ctx) {
  try {
    ctx?.saveSettingsDebounced?.();
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] unable to save host settings`, error);
  }
}

function saveSettingsImmediate(ctx) {
  try {
    const save = ctx?.saveSettings || ctx?.saveSettingsDebounced;
    if (typeof save !== 'function') return;
    const result = save.call(ctx);
    if (result && typeof result.catch === 'function') {
      result.catch((error) => console.warn(`[${MODULE_DISPLAY_NAME}] unable to save host settings`, error));
    }
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] unable to save host settings`, error);
  }
}

// ---------- API 基础 ----------
function getApiBase(settings) {
  let apiBase = String(settings?.apiUrl || '').trim().replace(/\/+$/, '');
  apiBase = apiBase.replace(/\/(chat\/completions|models)$/i, '');
  return apiBase.replace(/\/+$/, '');
}

function getAuthHeaders(settings) {
  const headers = { 'Content-Type': 'application/json' };
  const apiKey = String(settings?.apiKey || '').trim();
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}

function isCrossOriginUrl(url) {
  try {
    if (typeof location === 'undefined' || !location?.origin) return false;
    return new URL(url, location.href).origin !== location.origin;
  } catch {
    return false;
  }
}

// 宿主代理请求头：带上 session 的 CSRF Token 与请求头，否则宿主代理 POST 会 403。
function getHostProxyHeaders(extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  try {
    const ctx = getContextSafe();
    const hostHeaders = ctx?.getRequestHeaders?.()
      || globalThis.SillyTavern?.getRequestHeaders?.()
      || globalThis.getRequestHeaders?.()
      || null;
    if (hostHeaders && typeof hostHeaders === 'object') {
      Object.entries(hostHeaders).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') headers[key] = String(value);
      });
    }
  } catch {}
  try {
    const csrfToken = document?.cookie?.match(/(?:^|;\s*)csrf_token=([^;]+)/)?.[1];
    if (csrfToken && !headers['X-CSRF-Token']) headers['X-CSRF-Token'] = decodeURIComponent(csrfToken);
  } catch {}
  return headers;
}

function buildHostProxyConfig(apiBase, settings, extraBody = null) {
  const apiKey = String(settings?.apiKey || '').trim();
  const config = {
    chat_completion_source: 'custom',
    custom_url: apiBase,
    reverse_proxy: apiBase,
    proxy_password: apiKey,
    custom_include_headers: apiKey ? `Authorization: Bearer ${apiKey}` : '',
  };
  if (extraBody && typeof extraBody === 'object') Object.assign(config, extraBody);
  return config;
}

// TauriTavern 宿主代理的对话接口是 /api/backends/chat-completions/generate，
// 请求体与模型列表探测（/status）不同：custom_include_headers 的值需带引号
// （`Authorization: "Bearer xxx"`）。参数格式参考宿主自带 st-chatu8 扩展。
function buildHostProxyChatConfig(apiBase, settings, body) {
  const apiKey = String(settings?.apiKey || '').trim();
  return {
    chat_completion_source: 'custom',
    custom_url: apiBase,
    custom_include_headers: apiKey ? `Authorization: "Bearer ${apiKey}"` : '',
    ...body,
  };
}

function shouldFallbackFromHostProxy(responseText, status) {
  return status === 401
    || status === 403
    || status === 404
    || status === 405
    || /cannot\s+post|not\s+found|no\s+route|ENOENT/i.test(String(responseText || ''));
}

function looksLikeJson(text) {
  const trimmed = String(text || '').trim();
  return trimmed.startsWith('{') || trimmed.startsWith('[');
}

// 检查响应文本里是否真的带有可用文本：content 为空但 reasoning_content 有内容时
// （deepseek-v4-flash 等模型偶发把答案写进思维链字段）仍视为可用；两者皆空才判
// 「等于没回复」，走直连与自动重试而不是直接判死；错误信封（{error}）不算缺内容，
// 交给上游错误分支处理。
function responseContainsUsableText(responseText) {
  const trimmed = String(responseText || '').trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return false;
  let data;
  try {
    data = JSON.parse(trimmed);
  } catch {
    return false;
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  if (data.error) return true;
  if (data.response != null && data.choices == null) {
    try {
      const nested = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
      if (nested && typeof nested === 'object') data = nested;
    } catch {}
  }
  const choice = data?.choices?.[0];
  const content = choice?.message?.content ?? choice?.text;
  if (typeof content === 'string' && content.trim()) return true;
  const reasoning = typeof choice?.message?.reasoning_content === 'string'
    ? choice.message.reasoning_content
    : (typeof choice?.message?.reasoning === 'string' ? choice.message.reasoning : '');
  return typeof reasoning === 'string' && reasoning.trim().length > 0;
}

// TauriTavern 宿主代理在后端请求失败时，会把错误文本包装成 chat.completion
// 形状的响应（content 以 [API 错误] / [后端错误] 开头，或直接是
// "Network request failed. (...)"），而不是返回非 2xx 或 {error} 信封。
// 这类内容不是模型回复，必须识别出来，否则下游（剧情预筛等）会把错误文本
// 当 AI 内容解析，报出误导性的 JSON 解析错误。
function isHostErrorEnvelopeContent(content) {
  const text = String(content || '').trim();
  return /^\[[^\]]*错误\]/.test(text)
    || /^(?:网络请求失败|Network request failed)/i.test(text);
}

async function fetchText(url, options = {}) {
  const { timeoutMs, signal, ...fetchOptions } = options;
  const limitMs = Number(timeoutMs) > 0 ? Number(timeoutMs) : DEFAULT_API_TIMEOUT_MS;
  const controller = limitMs > 0 && typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  let externalAbortHandler = null;
  if (controller) {
    if (signal && typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
      fetchOptions.signal = AbortSignal.any([controller.signal, signal]);
    } else {
      fetchOptions.signal = controller.signal;
      if (signal) {
        if (signal.aborted) {
          controller.abort();
        } else {
          externalAbortHandler = () => {
            try {
              controller.abort();
            } catch {}
          };
          signal.addEventListener('abort', externalAbortHandler, { once: true });
        }
      }
    }
    timer = setTimeout(() => {
      try {
        controller.abort();
      } catch {}
    }, limitMs);
  } else if (signal) {
    fetchOptions.signal = signal;
  }
  try {
    const response = await fetch(url, fetchOptions);
    const responseText = await response.text();
    return { response, responseText };
  } finally {
    if (timer) clearTimeout(timer);
    if (externalAbortHandler && signal) signal.removeEventListener('abort', externalAbortHandler);
  }
}

async function requestHostProxyModelList(apiBase, settings) {
  return fetchText('/api/backends/chat-completions/status', {
    method: 'POST',
    headers: getHostProxyHeaders(),
    body: JSON.stringify(buildHostProxyConfig(apiBase, settings)),
    cache: 'no-cache',
    timeoutMs: MODEL_LIST_TIMEOUT_MS,
  });
}

// 拉取 OpenAI 兼容 /models 列表；跨域走宿主代理，失败自动回退直连。
async function fetchModelList(settings) {
  const apiBase = getApiBase(settings);
  if (!apiBase) throw new Error('请先填写 API Base URL');
  const url = `${apiBase}/models`;
  const useHostProxy = isCrossOriginUrl(url);
  let response = null;
  let responseText = '';
  let transport = useHostProxy ? 'host-proxy' : 'direct';
  logApp('debug', `拉取模型列表: ${transport}`, url);
  try {
    if (useHostProxy) {
      let proxyError = null;
      try {
        ({ response, responseText } = await requestHostProxyModelList(apiBase, settings));
      } catch (error) {
        proxyError = error;
        console.warn(`[${MODULE_DISPLAY_NAME}] host proxy model list failed, trying direct`, error);
      }
      if (proxyError || (!response?.ok && shouldFallbackFromHostProxy(responseText, response?.status))) {
        transport = 'direct-after-proxy-fallback';
        ({ response, responseText } = await fetchText(url, { method: 'GET', headers: getAuthHeaders(settings), timeoutMs: MODEL_LIST_TIMEOUT_MS }));
      }
    } else {
      ({ response, responseText } = await fetchText(url, { method: 'GET', headers: getAuthHeaders(settings), timeoutMs: MODEL_LIST_TIMEOUT_MS }));
    }
  } catch (error) {
    throw new Error(`模型列表连接失败（${transport}）。请检查 Base URL / API Key；也可手动填写模型名称后直接使用。原始错误: ${String(error?.message || error)}`);
  }
  if (!response?.ok) {
    throw new Error(`模型列表请求失败 ${response?.status}（${transport}）: ${String(responseText || '').slice(0, 240)}。如果此 API 不支持 /models，可手动填写模型名称。`);
  }
  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`模型列表响应不是 JSON（${transport}）: ${String(responseText || '').slice(0, 180)}`);
  }
  if (data && typeof data === 'object' && data.data == null && data.models == null && data.response) {
    try {
      const nested = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
      if (nested && typeof nested === 'object') data = nested;
    } catch {}
  }
  const modelItems = Array.isArray(data?.data)
    ? data.data
    : (Array.isArray(data?.models) ? data.models : (Array.isArray(data) ? data : []));
  const models = modelItems
    .map((item) => (typeof item === 'string'
      ? item.trim()
      : String(item?.id || item?.name || item?.model || '').trim()))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  if (models.length === 0) throw new Error('API 有响应，但没有返回可用模型；可手动填写模型名称。');
  logApp('info', `模型列表拉取成功（${transport}）: ${models.length} 个模型`);
  return models;
}

// ---------- AI 对话（OpenAI 兼容 chat/completions）----------
// 这是后续「动态叙事引擎」的基础：剧情分析、模块选择、上下文注入都会经由此处。
function createChatError(message, retryable = false) {
  const error = new Error(message);
  error.name = 'KaleidoChatError';
  error.retryable = retryable;
  return error;
}

function createCancelError() {
  const error = new Error('请求已取消');
  error.name = 'KaleidoCancelError';
  return error;
}

async function sleepAbortable(ms, signal) {
  if (signal?.aborted) throw createCancelError();
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });
  if (signal?.aborted) throw createCancelError();
}

// 并发限制：占住一个并发名额再发送；多出的请求排队等待，前面的请求完成后再放行。
// 整个任务（含自动重试）占用同一个名额，任务结束或取消时立即释放。
const apiConcurrencyState = {
  running: 0,
  queue: [],
};

async function acquireApiConcurrencySlot(settings, signal) {
  const enabled = settings?.apiConcurrencyEnabled !== false;
  const limit = Math.min(10, Math.max(1, Math.floor(Number(settings?.apiConcurrencyLimit) || 1)));
  if (!enabled || apiConcurrencyState.running < limit) {
    apiConcurrencyState.running += 1;
    return releaseApiConcurrencySlot;
  }
  if (signal?.aborted) throw createCancelError();
  // 排队等待空闲名额；中途取消会立即出队并抛取消错误，避免请求滞留在队列里。
  const waiter = { resolve: null, reject: null, onAbort: null };
  const queued = new Promise((resolve, reject) => {
    waiter.resolve = resolve;
    waiter.reject = reject;
  });
  waiter.onAbort = () => {
    const index = apiConcurrencyState.queue.indexOf(waiter);
    if (index >= 0) {
      apiConcurrencyState.queue.splice(index, 1);
      waiter.reject(createCancelError());
    }
  };
  if (signal) {
    if (signal.aborted) throw createCancelError();
    signal.addEventListener('abort', waiter.onAbort, { once: true });
  }
  apiConcurrencyState.queue.push(waiter);
  if (signal?.aborted) waiter.onAbort();
  logApp('debug', 'API 并发已满，请求排队等待', `上限 ${limit} · 队列 ${apiConcurrencyState.queue.length}`);
  try {
    await queued;
  } finally {
    if (signal) signal.removeEventListener('abort', waiter.onAbort);
  }
  apiConcurrencyState.running += 1;
  return releaseApiConcurrencySlot;
}

function releaseApiConcurrencySlot() {
  apiConcurrencyState.running = Math.max(0, apiConcurrencyState.running - 1);
  const next = apiConcurrencyState.queue.shift();
  if (next) next.resolve();
}

async function requestHostProxyChatCompletion(apiBase, settings, body, signal) {
  return fetchText('/api/backends/chat-completions/generate', {
    method: 'POST',
    headers: getHostProxyHeaders(),
    body: JSON.stringify(buildHostProxyChatConfig(apiBase, settings, body)),
    cache: 'no-cache',
    timeoutMs: CHAT_COMPLETION_TIMEOUT_MS,
    signal,
  });
}

async function requestChatCompletionOnce(apiBase, settings, body, signal) {
  const url = `${apiBase}/chat/completions`;
  const useHostProxy = isCrossOriginUrl(url);
  let response = null;
  let responseText = '';
  let transport = useHostProxy ? 'host-proxy' : 'direct';
  try {
    if (useHostProxy) {
      let proxyError = null;
      try {
        ({ response, responseText } = await requestHostProxyChatCompletion(apiBase, settings, body, signal));
      } catch (error) {
        proxyError = error;
        console.warn(`[${MODULE_DISPLAY_NAME}] host proxy chat failed, trying direct`, error);
      }
      const proxyLooksBroken = !response?.ok || !looksLikeJson(responseText) || !responseContainsUsableText(responseText);
      if (proxyError || proxyLooksBroken || shouldFallbackFromHostProxy(responseText, response?.status)) {
        transport = 'direct-after-proxy-fallback';
        ({ response, responseText } = await fetchText(url, {
          method: 'POST',
          headers: getAuthHeaders(settings),
          body: JSON.stringify(body),
          timeoutMs: CHAT_COMPLETION_TIMEOUT_MS,
          signal,
        }));
      }
    } else {
      ({ response, responseText } = await fetchText(url, {
        method: 'POST',
        headers: getAuthHeaders(settings),
        body: JSON.stringify(body),
        timeoutMs: CHAT_COMPLETION_TIMEOUT_MS,
        signal,
      }));
    }
  } catch (error) {
    if (signal?.aborted) throw createCancelError();
    throw createChatError(`对话请求失败（${transport}）。请检查 API 配置。原始错误: ${String(error?.message || error)}`);
  }
  if (!response?.ok) {
    const transient = response?.status === 429 || (response?.status >= 500 && response?.status < 600);
    throw createChatError(`对话请求失败 ${response?.status}（${transport}）: ${String(responseText || '').slice(0, 240)}`, transient);
  }
  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw createChatError(`对话响应不是 JSON（${transport}）: ${String(responseText || '').slice(0, 180)}`);
  }
  if (data && typeof data === 'object' && data.error) {
    const errorMessage = typeof data.error === 'string'
      ? data.error
      : (data.error.message || JSON.stringify(data.error));
    const transient = /(?:429|5\d\d|overload|busy|try again|temporarily|rate\s*limit|too\s*many)/i.test(String(errorMessage));
    throw createChatError(`上游 API 返回错误（${transport}）: ${String(errorMessage).slice(0, 240)}`, transient);
  }
  if (data && typeof data === 'object' && data.response != null && data.choices == null) {
    try {
      const nested = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
      if (nested && typeof nested === 'object') data = nested;
    } catch {}
  }
  const choice = data?.choices?.[0];
  const content = choice?.message?.content ?? choice?.text;
  if (typeof content !== 'string' || !content.trim()) {
    // 带思考能力的模型偶发把答案写进 reasoning_content、content 留空——兜底取用。
    const reasoning = typeof choice?.message?.reasoning_content === 'string'
      ? choice.message.reasoning_content
      : (typeof choice?.message?.reasoning === 'string' ? choice.message.reasoning : '');
    if (reasoning.trim()) {
      logApp('warn', 'AI 回复内容位于 reasoning_content 字段', `${transport} · ${reasoning.length} 字符`);
      return { content: reasoning, transport };
    }
    const errorMessage = data?.error?.message ? `: ${data.error.message}` : '';
    const finishReason = choice?.finish_reason ? `finish_reason=${choice.finish_reason}` : '';
    const budgetHint = finishReason === 'length'
      ? '（疑似思考阶段耗尽输出预算：请调大 max_tokens 或改用非推理模型）'
      : '';
    throw createChatError(`AI 未返回文本内容（${transport}）${errorMessage}${finishReason ? `（${finishReason}）` : ''}${budgetHint}`, true);
  }
  if (isHostErrorEnvelopeContent(content)) {
    const transient = /(?:网络|network|timeout|timed\s*out|failed|失败|超时)/i.test(content);
    throw createChatError(`上游 API 返回错误（${transport}）: ${content.slice(0, 240)}`, transient);
  }
  return { content, transport };
}

// 通用对话请求：OpenAI 兼容，自动处理跨域宿主代理回退、超时、重试与并发限制。
async function chatCompletion(settings, messages, options = {}) {
  const apiBase = getApiBase(settings);
  if (!apiBase) throw new Error('请先在「API 连接」中配置 Base URL');
  const model = String(settings?.model || '').trim();
  if (!model) throw new Error('请先在「API 连接」中选择模型');
  const body = {
    model,
    messages,
    stream: false,
    temperature: Number.isFinite(options.temperature) ? options.temperature : 0.2,
    max_tokens: Number.isFinite(options.maxTokens) && options.maxTokens > 0
      ? Math.floor(options.maxTokens)
      : CHAT_COMPLETION_DEFAULT_MAX_TOKENS,
  };
  const reasoningEffort = String(settings?.apiReasoningEffort || '').trim();
  if (reasoningEffort) body.reasoning_effort = reasoningEffort;
  const maxAttempts = Math.max(1, Math.min(5, Number(options.maxAttempts) > 0 ? Number(options.maxAttempts) : CHAT_COMPLETION_MAX_ATTEMPTS));
  const release = await acquireApiConcurrencySlot(settings, options.signal);
  try {
    logApp('debug', '发送 AI 对话请求', `${model} · ${isCrossOriginUrl(`${apiBase}/chat/completions`) ? 'host-proxy' : 'direct'}`);
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (options.signal?.aborted) throw createCancelError();
      try {
        const { content, transport } = await requestChatCompletionOnce(apiBase, settings, body, options.signal);
        if (attempt > 1) {
          logApp('info', 'AI 对话请求重试成功', `${model} · ${transport} · 第 ${attempt}/${maxAttempts} 次`);
        } else {
          logApp('debug', 'AI 对话响应已接收', `${model} · ${transport}`);
        }
        return content;
      } catch (error) {
        if (options.signal?.aborted) throw createCancelError();
        lastError = error;
        const retryable = error?.retryable === true;
        if (retryable && attempt < maxAttempts) {
          const delayMs = CHAT_COMPLETION_RETRY_DELAY_MS * attempt;
          logApp('warn', 'AI 对话请求异常，稍后自动重试', `${model} · 第 ${attempt}/${maxAttempts} 次 · ${String(error.message || error).slice(0, 140)}`);
          await sleepAbortable(delayMs, options.signal);
          continue;
        }
        if (retryable && attempt > 1) {
          throw createChatError(`${String(error.message || error)}（已自动重试 ${attempt - 1} 次）`, true);
        }
        throw error;
      }
    }
    throw lastError || new Error('AI 对话请求失败');
  } finally {
    release();
  }
}

// 解析 AI 返回的 JSON：支持 ```json 代码块包裹，自动截取首尾花括号。
function parseAgentJson(text) {
  const source = String(text || '').trim();
  const fenced = source.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const candidate = fenced ? fenced[1].trim() : source;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(candidate.slice(start, end + 1));
    } catch {}
  }
  try {
    return JSON.parse(candidate);
  } catch (error) {
    throw new Error(`AI 返回内容无法解析为 JSON：${String(error?.message || error)}`);
  }
}


// ===== js/host.js =====
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


// ===== js/send-barrier.js =====
// ===== 跨扩展发送屏障协议 v1（Kaleidoscope / SoulLink 共用，两边实现必须保持一致）=====
// 背景：宿主（TauriTavern）的 eventSource.emit 会按注册顺序逐个 await messageSent
// 监听器，主模型请求要等全部监听器 resolve 后才发出。多个扩展各自阻塞发送时，
// 若各跑各的，发送前耗时 = 各 Gate 之和（串行）。本屏障把已注册任务并发执行，
// 耗时 = max(各任务耗时)，并保持「所有注入都在主请求发出前完成」的既有保证。
//
// 协议：
//   getPreSendBarrier()          取全局屏障，不存在或协议不匹配时重建（幂等自愈）
//   barrier.register(name, task) 注册发送前任务；task: (ctx, payload) => Promise<void>
//   barrier.waitAll(ctx, payload, timeoutMs)
//                                并发执行本轮所有任务；同一轮共享同一 Promise
//
// 关键语义：
//   - 轮次签名取 ctx.chat 末条消息（id 优先，否则文本）：宿主串行 emit 下，后一个
//     扩展的监听器总是晚于本轮完成才被调用，同签名直接复用本轮结果，绝不重复执行
//     （否则每次发送都会跑两遍 Gate，重复注入）；
//     [v0.7.4] 仅凭 ID 判重会误伤「删楼后重发」：宿主（TauriTavern）删除消息后
//     会复用被删消息的 ID，新发送拿到与旧轮相同的 ID 会被误判为旧轮直接放行，
//     导致剧情预筛整轮被跳过（删两层楼后首条消息不预筛、第二条才恢复）。因此
//     复用前还要比对末条消息内容：同 ID 不同内容必然是新发送，开启新轮（语义
//     扩展，SoulLink v1.4.1 已同步）；
//   - clearSendBarrierRound()：messageDeleted 后清掉旧轮，同 ID 同内容的重发
//     也不会被误判为旧轮。
//   - 新签名（新发送产生新消息 → 新 id）开启新轮并替换旧轮；
//   - 任务内部自行处理开关 / 载荷校验 / 超时 / 失败降级；任何失败都不会让
//     waitAll reject（allSettled + 整轮硬截止兜底）；
//   - 屏障挂在 globalThis，宿主重建事件源后由各自看门狗重挂监听器时自动复用；
//   - 调用方必须把全部守卫放进任务（本轮可能由任一扩展的监听器先行启动）。
const SEND_BARRIER_KEY = '__preSendInjectionBarrier__';
const SEND_BARRIER_VERSION = 1;

// 轮次签名：优先消息 ID（TauriTavern / SillyTavern 消息均有），缺失时回退文本。
function computeSendBarrierSignature(ctx) {
  const chat = Array.isArray(ctx?.chat) ? ctx.chat : [];
  const last = chat[chat.length - 1];
  if (!last) return '';
  const id = last.id;
  if (id !== undefined && id !== null && String(id).trim() !== '') return 'id:' + String(id);
  return 'text:' + String(last.mes || '');
}

// 末条消息内容快照：与签名一起构成轮次复用判据。宿主删除消息后复用被删消息的
// ID（楼层序号式 ID），只比签名会把「删楼后重发」误判为旧轮；内容不同即新发送。
function getSendBarrierLastText(ctx) {
  const chat = Array.isArray(ctx?.chat) ? ctx.chat : [];
  const last = chat[chat.length - 1];
  return last ? String(last.mes || '') : '';
}

// 清空当前轮次：messageDeleted 后旧轮签名可能被新消息复用（TauriTavern 删除消息
// 复用被删 ID），不清理会把删除后的首次发送误判为「同一发送已处理」直接放行。
// 对屏障本身只是属性重置，不改协议方法签名。
function clearSendBarrierRound() {
  const barrier = getPreSendBarrier();
  if (barrier) barrier.round = null;
}

function getPreSendBarrier() {
  try {
    const existing = globalThis[SEND_BARRIER_KEY];
    if (existing && typeof existing.register === 'function' && typeof existing.waitAll === 'function') {
      return existing;
    }
    const barrier = {
      version: SEND_BARRIER_VERSION,
      tasks: new Map(),
      round: null, // { signature, promise }：完成后的轮次保留，供级联监听器复用
      register(name, task) {
        if (typeof task !== 'function') return;
        this.tasks.set(String(name || 'task'), task);
      },
      waitAll(ctx, payload, timeoutMs) {
        const signature = computeSendBarrierSignature(ctx);
        if (signature === '') return Promise.resolve();
        const lastText = getSendBarrierLastText(ctx);
        // 同签名且末条内容一致才复用本轮（在途或已完成）：宿主逐个 await 监听器，
        // 后到的监听器必然晚于本轮结束，复用结果即可，绝不能重跑一轮造成重复注入。
        // 内容不一致说明「删楼后重发」（宿主复用被删消息 ID），必须开启新轮。
        if (this.round && this.round.signature === signature && this.round.lastText === lastText) {
          return this.round.promise;
        }
        const names = Array.from(this.tasks.keys());
        const tasks = Array.from(this.tasks.values());
        const startedAt = Date.now();
        console.debug('[SendBarrier] 本轮并发执行 ' + tasks.length + ' 个发送前任务', names);
        let deadlineTimer = null;
        let settle;
        const done = () => {
          if (deadlineTimer) {
            clearTimeout(deadlineTimer);
            deadlineTimer = null;
          }
          console.debug('[SendBarrier] 本轮发送前任务完成', (Date.now() - startedAt) + 'ms', names);
          settle();
        };
        const promise = new Promise((resolve) => { settle = resolve; });
        Promise.allSettled(tasks.map((task) => {
          try {
            return Promise.resolve(task(ctx, payload));
          } catch (error) {
            return Promise.reject(error);
          }
        })).then(done, done);
        const limit = Number(timeoutMs);
        if (limit > 0) {
          deadlineTimer = setTimeout(done, limit);
        }
        this.round = { signature, lastText, promise };
        return promise;
      },
    };
    globalThis[SEND_BARRIER_KEY] = barrier;
    return barrier;
  } catch (error) {
    console.warn('[SendBarrier] 屏障不可用，回退为直接阻塞', error);
    return null;
  }
}


// ===== js/ui-shell.js =====
// ===== 万华镜（Kaleidoscope）UI 外壳：悬浮球 / 面板 / 视图切换 =====
function getSphere() {
  return document.getElementById(SPHERE_ID);
}

function getPanel() {
  return document.getElementById(PANEL_ID);
}

// ---------- 悬浮球：六棱万花筒 ----------
function clampSpherePosition(sphere, left, top) {
  const width = sphere?.offsetWidth || SPHERE_SIZE;
  const height = sphere?.offsetHeight || SPHERE_SIZE;
  const maxLeft = Math.max(0, window.innerWidth - width);
  const maxTop = Math.max(0, window.innerHeight - height);
  return {
    left: Math.max(0, Math.min(left, maxLeft)),
    top: Math.max(0, Math.min(top, maxTop)),
  };
}

function setSpherePosition(sphere, left, top, persist = true) {
  if (!sphere) return;
  const next = clampSpherePosition(sphere, left, top);
  sphere.style.left = `${next.left}px`;
  sphere.style.top = `${next.top}px`;
  if (!persist) return;
  try {
    globalThis.localStorage?.setItem(SPHERE_POSITION_KEY, JSON.stringify(next));
  } catch {}
}

function restoreSpherePosition(sphere) {
  if (!sphere) return false;
  try {
    const raw = globalThis.localStorage?.getItem(SPHERE_POSITION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const left = Number(parsed?.left);
      const top = Number(parsed?.top);
      if (Number.isFinite(left) && Number.isFinite(top)) {
        setSpherePosition(sphere, left, top, false);
        return true;
      }
    }
  } catch {}
  const currentLeft = Number.parseFloat(sphere.style.left);
  const currentTop = Number.parseFloat(sphere.style.top);
  if (Number.isFinite(currentLeft) && Number.isFinite(currentTop)) {
    setSpherePosition(sphere, currentLeft, currentTop, false);
    return true;
  }
  return false;
}

function showSphere() {
  const sphere = getSphere();
  if (!sphere) return;
  if (sphere.style.display === 'flex') return;
  restoreSpherePosition(sphere);
  sphere.style.display = 'flex';
  sphere.classList.add('is-appearing');
  setTimeout(() => sphere.classList.remove('is-appearing'), 300);
}

function hideSphere() {
  const sphere = getSphere();
  if (!sphere || sphere.style.display === 'none') return;
  logApp('debug', '悬浮球已隐藏');
  sphere.classList.add('is-shrinking');
  setTimeout(() => {
    sphere.style.display = 'none';
    sphere.classList.remove('is-shrinking');
  }, 200);
}

function createSphere() {
  let sphere = getSphere();
  if (sphere) return sphere;
  sphere = document.createElement('div');
  sphere.id = SPHERE_ID;
  sphere.className = 'kaleido-sphere';
  sphere.title = `${MODULE_DISPLAY_NAME}：拖拽移动 / 点击打开 / 长按隐藏`;
  sphere.setAttribute('aria-label', MODULE_DISPLAY_NAME);
  sphere.innerHTML = `
    <span class="kaleido-sphere__frame" aria-hidden="true"></span>
    <span class="kaleido-sphere__eye" aria-hidden="true"></span>
    <span class="kaleido-sphere__hub" aria-hidden="true"></span>
  `;
  document.body.appendChild(sphere);
  initDraggableSphere(sphere);
  return sphere;
}

function initDraggableSphere(sphere) {
  let dragState = null;
  let hasMoved = false;
  let longPressTriggered = false;
  let longPressTimer = null;
  let pointerDownX = 0;
  let pointerDownY = 0;

  const clearLongPressTimer = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
    longPressTimer = null;
  };

  const onPointerMove = (event) => {
    if (!dragState) return;
    const deltaX = event.clientX - pointerDownX;
    const deltaY = event.clientY - pointerDownY;
    if (!hasMoved && Math.hypot(deltaX, deltaY) >= SPHERE_DRAG_THRESHOLD) {
      hasMoved = true;
      clearLongPressTimer();
    }
    if (!hasMoved) return;
    setSpherePosition(sphere, event.clientX - dragState.offsetX, event.clientY - dragState.offsetY, false);
  };

  const onPointerUp = () => {
    if (!dragState) return;
    clearLongPressTimer();
    dragState = null;
    sphere.classList.remove('is-dragging');
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);

    if (longPressTriggered) {
      longPressTriggered = false;
      return;
    }
    if (hasMoved) {
      const left = Number.parseFloat(sphere.style.left);
      const top = Number.parseFloat(sphere.style.top);
      if (Number.isFinite(left) && Number.isFinite(top)) setSpherePosition(sphere, left, top);
      return;
    }
    hideSphere();
    openPanel();
  };

  sphere.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragState = {
      offsetX: event.clientX - sphere.offsetLeft,
      offsetY: event.clientY - sphere.offsetTop,
    };
    pointerDownX = event.clientX;
    pointerDownY = event.clientY;
    hasMoved = false;
    longPressTriggered = false;
    sphere.classList.add('is-dragging');
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    clearLongPressTimer();
    longPressTimer = setTimeout(() => {
      if (dragState && !hasMoved) {
        longPressTriggered = true;
        hideSphere();
      }
    }, SPHERE_LONG_PRESS_MS);
    event.preventDefault();
  });

  if (!restoreSpherePosition(sphere)) {
    const defaultLeft = Math.max(EDGE_GAP, window.innerWidth - sphere.offsetWidth - EDGE_GAP);
    const defaultTop = Math.max(EDGE_GAP, Math.round(window.innerHeight * 0.4));
    setSpherePosition(sphere, defaultLeft, defaultTop, false);
  }
  window.addEventListener('resize', () => {
    const left = Number.parseFloat(sphere.style.left);
    const top = Number.parseFloat(sphere.style.top);
    if (!Number.isFinite(left) || !Number.isFinite(top)) return;
    setSpherePosition(sphere, left, top, false);
  });
}

// ---------- 面板 ----------
// 与同目录 SoulLink 一致：面板始终由内联 left/top 定位（clamp 在视口内），
// 移动端不依赖 CSS 居中/铺边布局，标题栏始终可见可拖。

function clampPanelPosition(dialog, left, top) {
  const width = dialog?.offsetWidth || 360;
  const height = dialog?.offsetHeight || 420;
  const maxLeft = Math.max(0, window.innerWidth - width);
  const maxTop = Math.max(0, window.innerHeight - height);
  return {
    left: Math.max(0, Math.min(left, maxLeft)),
    top: Math.max(0, Math.min(top, maxTop)),
  };
}

function setPanelPosition(panel, left, top) {
  const dialog = panel?.querySelector('.kaleido-panel__dialog');
  if (!panel || !dialog) return;
  const next = clampPanelPosition(dialog, left, top);
  dialog.style.left = `${next.left}px`;
  dialog.style.top = `${next.top}px`;
  dialog.style.right = 'auto';
  dialog.style.bottom = 'auto';
  dialog.style.transform = 'none';
  panel.dataset.left = String(next.left);
  panel.dataset.top = String(next.top);
  panel.dataset.positioned = 'true';
}

function ensurePanelPosition(panel) {
  const dialog = panel?.querySelector('.kaleido-panel__dialog');
  if (!panel || !dialog) return;
  const storedLeft = Number(panel.dataset.left);
  const storedTop = Number(panel.dataset.top);
  if (Number.isFinite(storedLeft) && Number.isFinite(storedTop)) {
    setPanelPosition(panel, storedLeft, storedTop);
    return;
  }
  const defaultLeft = Math.max(EDGE_GAP, window.innerWidth - dialog.offsetWidth - EDGE_GAP);
  const defaultTop = EDGE_GAP;
  setPanelPosition(panel, defaultLeft, defaultTop);
}

function initDraggablePanel(panel) {
  if (!panel || panel.dataset.dragReady === 'true') return;
  const dialog = panel.querySelector('.kaleido-panel__dialog');
  const handles = panel.querySelectorAll('.kaleido-drag-handle');
  if (!dialog || handles.length === 0) return;

  let dragState = null;

  const stopDragging = () => {
    dragState = null;
    dialog.classList.remove('is-dragging');
  };

  handles.forEach((handle) =>
    handle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      // 指针落在标题栏内的按钮上（返回/关闭）时，不启动拖拽、不捕获指针，
      // 否则 setPointerCapture 会把后续 click 重定向到标题栏，按钮点击失效。
      const target = event.target;
      if (target instanceof Element && typeof target.closest === 'function' && target.closest('button')) return;
      // 用视觉位置（getBoundingClientRect）计算偏移：移动端居中布局带 transform，
      // offsetLeft/offsetTop 是布局位置，会导致首帧跳动。
      const rect = dialog.getBoundingClientRect();
      dragState = {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      };
      dialog.classList.add('is-dragging');
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }),
  );

  window.addEventListener('pointermove', (event) => {
    if (!dragState) return;
    setPanelPosition(panel, event.clientX - dragState.offsetX, event.clientY - dragState.offsetY);
  });
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);
  window.addEventListener('resize', () => ensurePanelPosition(panel));
  panel.dataset.dragReady = 'true';
}

function openPanel() {
  const panel = getPanel();
  if (!panel) return;
  logApp('debug', '面板已打开');
  showPanelView(HOME_VIEW_ID);
  refreshHomeStatuses();
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  ensurePanelPosition(panel);
}

function closePanel() {
  const panel = getPanel();
  if (!panel) return;
  logApp('debug', '面板已关闭');
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  // 关闭面板后把悬浮球请回来（点击悬浮球打开面板时会先隐藏它）
  showSphere();
}

function togglePanel() {
  const panel = getPanel();
  if (!panel) return;
  if (panel.classList.contains('is-open')) closePanel();
  else openPanel();
}

// ---------- 视图切换 ----------
function showPanelView(viewId) {
  const panel = getPanel();
  if (!panel) return;
  panel.querySelectorAll('.kaleido-view').forEach((view) => {
    const active = view.id === viewId;
    view.classList.toggle('is-active', active);
    view.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
  const dialog = panel.querySelector('.kaleido-panel__dialog');
  if (dialog) {
    for (const mode of Object.values(PANEL_WIDE_MODES)) dialog.classList.remove(mode);
    const wideMode = PANEL_WIDE_MODES[viewId];
    if (wideMode) dialog.classList.add(wideMode);
  }
  const back = document.getElementById(PANEL_BACK_ID);
  if (back) back.style.visibility = viewId === HOME_VIEW_ID ? 'hidden' : 'visible';
  const title = document.getElementById(PANEL_TITLE_ID);
  if (title) title.textContent = PANEL_VIEW_TITLES[viewId] || MODULE_DISPLAY_NAME;
  if (viewId === LOG_VIEW_ID) {
    renderLogList();
    updateLogStats();
  }
  if (viewId === INJECT_VIEW_ID) {
    renderInjectView();
  }
  ensurePanelPosition(panel);
}

function initPanelViews(panel) {
  if (!panel || panel.dataset.viewsReady === 'true') return;
  document.getElementById(PANEL_BACK_ID)?.addEventListener('click', () => showPanelView(HOME_VIEW_ID));
  document.getElementById(HOME_API_CARD_ID)?.addEventListener('click', () => showPanelView(API_VIEW_ID));
  document.getElementById(HOME_STORY_CARD_ID)?.addEventListener('click', () => openStoryWorkbench());
  document.getElementById(HOME_LOG_BUTTON_ID)?.addEventListener('click', () => showPanelView(LOG_VIEW_ID));
  document.getElementById(HOME_PRESET_CARD_ID)?.addEventListener('click', () => showPanelView(PRESET_VIEW_ID));
  document.getElementById(HOME_INJECT_CARD_ID)?.addEventListener('click', () => showPanelView(INJECT_VIEW_ID));
  document.getElementById(INJECT_COPY_ID)?.addEventListener('click', copyInjectInjectionText);
  panel.dataset.viewsReady = 'true';
}

// ---------- 面板总装配 ----------
function createPanel() {
  let panel = getPanel();
  if (panel) return panel;
  panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.className = 'kaleido-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="kaleido-panel__dialog" role="dialog" aria-label="${MODULE_DISPLAY_NAME}">
      <div class="kaleido-panel__header kaleido-drag-handle">
        <button type="button" id="${PANEL_BACK_ID}" class="kaleido-panel__back" aria-label="返回" title="返回" style="visibility:hidden">←</button>
        <span class="kaleido-panel__logo" aria-hidden="true"><span class="${MENU_ICON_CLASS}"></span></span>
        <span id="${PANEL_TITLE_ID}" class="kaleido-panel__title">${MODULE_DISPLAY_NAME}</span>
        <button type="button" class="kaleido-panel__close" aria-label="关闭" title="关闭">✕</button>
      </div>
      <div class="kaleido-panel__body">
        <section id="${HOME_VIEW_ID}" class="kaleido-view is-active" aria-hidden="false">
          <div class="kaleido-home__hero">
            <p class="kaleido-home__slogan"><span class="kaleido-home__slogan-first" aria-hidden="true">镜</span>中万象，皆是文章</p>
            <button type="button" id="${HOME_LOG_BUTTON_ID}" class="kaleido-home__log-btn" title="系统日志：后台运行记录与网络请求" aria-label="系统日志">
              <span class="${LOG_ICON_CLASS}"></span>
              <span id="${HOME_LOG_BADGE_ID}" class="kaleido-home__log-badge" data-state="idle" hidden></span>
            </button>
          </div>
          <div class="kaleido-home__grid">
            <button type="button" id="${HOME_API_CARD_ID}" class="kaleido-home__card" title="配置 AI 接口，引擎的基石">
              <span class="kaleido-home__card-icon"><span class="${API_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">API 连接</span>
                <span id="${HOME_API_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">尚未连接</span>
              </span>
            </button>
            <button type="button" id="${HOME_STORY_CARD_ID}" class="kaleido-home__card" title="剧情脉络：节点与事件的工作台">
              <span class="kaleido-home__card-icon"><span class="${STORY_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">剧情脉络</span>
                <span id="${HOME_STORY_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">尚未添加</span>
              </span>
            </button>
            <button type="button" id="${HOME_PRESET_CARD_ID}" class="kaleido-home__card" title="预设模版：修改与重置默认提示词">
              <span class="kaleido-home__card-icon"><span class="${PRESET_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">预设模版</span>
                <span id="${HOME_PRESET_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">默认配置</span>
              </span>
            </button>
            <button type="button" id="${HOME_INJECT_CARD_ID}" class="kaleido-home__card" title="剧情预筛：点击发送时自动挑选并注入本轮事件">
              <span class="kaleido-home__card-icon"><span class="${INJECT_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">注入实录</span>
                <span id="${HOME_INJECT_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">尚未运行</span>
              </span>
            </button>
          </div>
        </section>
        <section id="${API_VIEW_ID}" class="kaleido-view" aria-hidden="true">
          <div class="kaleido-api">
            <div class="kaleido-api__head">
              <span class="kaleido-api__title">API 连接</span>
              <span id="${API_STATUS_ID}" class="kaleido-api__status" data-state="idle">尚未连接</span>
            </div>
            <label class="kaleido-api__field" for="${API_URL_ID}">
              <span class="kaleido-api__label">Base URL</span>
              <input id="${API_URL_ID}" class="kaleido-input" type="text" placeholder="https://api.openai.com/v1" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${API_KEY_ID}">
              <span class="kaleido-api__label">API Key</span>
              <span class="kaleido-api__key-row">
                <input id="${API_KEY_ID}" class="kaleido-input" type="password" placeholder="sk-..." autocomplete="off" spellcheck="false" />
                <button type="button" id="${API_KEY_TOGGLE_ID}" class="kaleido-icon-btn" title="显示密钥" aria-label="显示密钥">👁</button>
              </span>
            </label>
            <div class="kaleido-api__actions">
              <button type="button" id="${API_CONNECT_ID}" class="kaleido-btn kaleido-btn--primary">连接并拉取模型</button>
            </div>
            <div class="kaleido-api__field">
              <span class="kaleido-api__label">模型</span>
              <select id="${API_MODEL_LIST_ID}" class="kaleido-input">
                <option value="">请先连接并拉取模型</option>
              </select>
              <input id="${API_MODEL_ID}" class="kaleido-input" type="text" placeholder="或手动填写模型名称" autocomplete="off" spellcheck="false" />
            </div>
            <div class="kaleido-api__field">
              <span class="kaleido-api__label">限制并发</span>
              <div class="kaleido-api__concurrency-row">
                <button type="button" id="${API_CONCURRENCY_TOGGLE_ID}" class="kaleido-btn kaleido-api__concurrency-toggle" title="开启/关闭并发限制">🔀 并发限制：开</button>
                <input id="${API_CONCURRENCY_INPUT_ID}" class="kaleido-input kaleido-api__concurrency-input" type="number" min="1" max="10" step="1" placeholder="3" autocomplete="off" aria-label="并发上限" />
              </div>
              <p class="kaleido-api__hint">同时最多发送的 AI 请求数（默认 3）；多出的请求会排队等待前面的请求完成后再发送。</p>
            </div>
            <div class="kaleido-api__field">
              <span class="kaleido-api__label">思考强度</span>
              <select id="${API_REASONING_EFFORT_ID}" class="kaleido-input" title="控制带思考能力模型的思考强度（reasoning_effort）">
                <option value="">默认（不发送）</option>
                <option value="none">关闭思考</option>
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="max">最大</option>
              </select>
              <p class="kaleido-api__hint">仅对带思考能力的模型生效；「关闭思考」可避免模型把输出预算花在思考上导致正文为空。</p>
            </div>
            <p class="kaleido-api__hint">填入接口地址与 API Key 后点「连接并拉取模型」，再从列表选择模型；不支持模型列表的渠道可直接手动填写模型名称。</p>
          </div>
        </section>
        <section id="${LOG_VIEW_ID}" class="kaleido-view" aria-hidden="true">
          <div class="kaleido-log">
            <div class="kaleido-log__chips" role="group" aria-label="按级别筛选日志">
              <button type="button" class="kaleido-log__chip is-active" data-level="">全部 <span class="kaleido-log__chip-count" data-level="">0</span></button>
              <button type="button" class="kaleido-log__chip" data-level="debug">调试 <span class="kaleido-log__chip-count" data-level="debug">0</span></button>
              <button type="button" class="kaleido-log__chip" data-level="info">信息 <span class="kaleido-log__chip-count" data-level="info">0</span></button>
              <button type="button" class="kaleido-log__chip" data-level="warn">警告 <span class="kaleido-log__chip-count" data-level="warn">0</span></button>
              <button type="button" class="kaleido-log__chip" data-level="error">错误 <span class="kaleido-log__chip-count" data-level="error">0</span></button>
            </div>
            <div class="kaleido-log__tools">
              <input id="${LOG_SEARCH_ID}" class="kaleido-input kaleido-log__search" type="search" placeholder="🔍 搜索日志内容…" autocomplete="off" spellcheck="false" />
              <select id="${LOG_SOURCE_ID}" class="kaleido-input kaleido-log__source" title="按来源筛选日志">
                <option value="">全部来源</option>
                <option value="network">网络请求</option>
                <option value="kaleido">万华镜</option>
                <option value="console">控制台</option>
                <option value="event">宿主事件</option>
                <option value="external">外部扩展</option>
                <option value="window">页面错误</option>
                <option value="promise">Promise 拒绝</option>
              </select>
              <select id="${LOG_MAX_ID}" class="kaleido-input kaleido-log__max" title="内存中保留的日志条数，超出自动丢弃最旧">
                <option value="500">500 条</option>
                <option value="2000" selected>2000 条</option>
                <option value="5000">5000 条</option>
                <option value="10000">10000 条</option>
              </select>
            </div>
            <div class="kaleido-log__actions">
              <button type="button" id="${LOG_PAUSE_ID}" class="kaleido-log__action" title="暂停：新日志先缓存（+N），不追加到列表；点「继续」一次性显示">⏸ 暂停</button>
              <button type="button" id="${LOG_AUTOSCROLL_ID}" class="kaleido-log__action is-active" title="跟随：钉在底部，新日志自动滚到底部（点一下关闭）">⏬ 跟随</button>
              <button type="button" id="${LOG_CLEAR_ID}" class="kaleido-log__action" title="清空缓冲中的所有日志">🧹 清空</button>
              <button type="button" id="${LOG_COPY_ID}" class="kaleido-log__action" title="复制全部日志为纯文本">📋 复制</button>
              <button type="button" id="${LOG_EXPORT_ID}" class="kaleido-log__action" title="导出完整 JSON 日志文件">💾 导出</button>
              <button type="button" id="${LOG_FULL_BODY_EXPORT_ID}" class="kaleido-log__action" title="导出最近 ${LOG_FULL_BODY_MAX} 次对话请求的完整请求体/响应体（未截断）">📦 完整请求体</button>
              <button type="button" id="${LOG_NOISE_ID}" class="kaleido-log__action is-active" title="过滤已知噪音（世界书扫描 / 宏变量 dump / 正则跳过 / 事件总线 / 内部保存 / 非模型网络调用 / 宿主扩展更新检查报错）">🔇 过滤噪音</button>
            </div>
            <div class="kaleido-log__console">
              <div id="${LOG_LIST_ID}" class="kaleido-log__list" role="log" aria-live="off" aria-label="运行日志"></div>
              <button type="button" id="${LOG_BACK_ID}" class="kaleido-log__back" hidden>↓ 回到最新</button>
            </div>
            <div class="kaleido-log__status">
              <span id="${LOG_STATUS_ID}">共 0 条</span>
              <span id="${LOG_PAUSED_ID}" class="kaleido-log__paused" title="暂停期间新日志只入内存（+N），点「继续」后一次性显示" hidden>已暂停 · 新增 +0</span>
            </div>
          </div>
        </section>
        <section id="${PRESET_VIEW_ID}" class="kaleido-view" aria-hidden="true">
          <div class="kaleido-preset">
            <div class="kaleido-preset__gate">
              <div class="kaleido-preset__gate-head">
                <span class="kaleido-preset__gate-title">剧情预筛</span>
                <span id="${PRESET_GATE_STATUS_ID}" class="kaleido-preset__status" data-state="idle">未启用</span>
              </div>
              <p class="kaleido-preset__gate-hint">点击发送时，AI 先读取剧情脉络（节点与事件的名字 / ID / 触发条件 / 描述）与最近 4 条消息，挑选本轮应触发的事件，再把事件正文注入上下文。</p>
              <div class="kaleido-preset__gate-row">
                <span class="kaleido-preset__gate-label">启用剧情预筛</span>
                <button type="button" id="${PRESET_GATE_TOGGLE_ID}" class="kaleido-btn kaleido-api__concurrency-toggle" title="开启/关闭剧情预筛">🎬 剧情预筛：开</button>
              </div>
            </div>
            <p class="kaleido-preset__note">各子系统提示词按标签页切换编辑，改完点「💾 保存」；「↺ 恢复默认」可还原出厂内容。</p>
            <div id="${PRESET_TABS_ID}" class="kaleido-preset__tabs" role="tablist" aria-label="选择要编辑的提示词">
              ${Object.entries(PRESET_META).map(([key, meta]) => `
                <button type="button" class="kaleido-preset__tab${key === presetActiveKey ? ' is-active' : ''}" role="tab" aria-selected="${key === presetActiveKey ? 'true' : 'false'}" data-prompt-key="${key}" title="${meta.title}">${meta.label}</button>
              `).join('')}
            </div>
            <div class="kaleido-preset__editor">
              <div class="kaleido-preset__meta">
                <span id="${PRESET_STATUS_ID}" class="kaleido-preset__status" data-state="default">默认内容</span>
                <span id="${PRESET_COUNT_ID}" class="kaleido-preset__count">0 字</span>
              </div>
              <textarea id="${PRESET_TEXT_ID}" class="kaleido-input kaleido-preset__text" spellcheck="false" aria-label="提示词内容" placeholder="（提示词内容为空）"></textarea>
              <div class="kaleido-preset__actions">
                <button type="button" id="${PRESET_RESET_ID}" class="kaleido-btn kaleido-btn--ghost">↺ 恢复默认</button>
                <button type="button" id="${PRESET_SAVE_ID}" class="kaleido-btn" disabled>💾 保存</button>
              </div>
            </div>
          </div>
        </section>
        <section id="${INJECT_VIEW_ID}" class="kaleido-view" aria-hidden="true">
          <div class="kaleido-inject">
            <p class="kaleido-inject__note">展示最近一轮「剧情预筛」的完整结果：预筛原文（Gate 返回）、本轮触发的事件，以及最终注入上下文的提示词原文。</p>
            <div id="${INJECT_SUMMARY_ID}" class="kaleido-inject__summary" hidden></div>
            <div id="${INJECT_EMPTY_ID}" class="kaleido-inject__empty" hidden>还没有预筛记录：开启「剧情预筛」并发送消息后，这里会展示最近一轮的结果。</div>
            <div class="kaleido-inject__gate-head" hidden>
              <span class="kaleido-panel__section-title">预筛原文（Gate 返回）</span>
            </div>
            <pre id="${INJECT_GATE_TEXT_ID}" class="kaleido-inject__gate-text" hidden></pre>
            <div class="kaleido-inject__events-head" hidden>
              <span class="kaleido-panel__section-title">本轮触发的事件</span>
            </div>
            <div id="${INJECT_EVENTS_ID}" class="kaleido-inject__events" hidden></div>
            <div class="kaleido-inject__inject-head" hidden>
              <span class="kaleido-panel__section-title">注入提示词原文</span>
              <button type="button" id="${INJECT_COPY_ID}" class="kaleido-btn kaleido-btn--ghost kaleido-inject__copy">⧉ 复制</button>
            </div>
            <pre id="${INJECT_TEXT_ID}" class="kaleido-inject__inject-text" hidden></pre>
          </div>
        </section>
      </div>
      <div class="kaleido-panel__footer">
        <span class="kaleido-panel__version">v${MODULE_VERSION}</span>
        <span class="kaleido-panel__slogan">镜中万象 · 皆是文章</span>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  initDraggablePanel(panel);
  initPanelViews(panel);
  initApiSection(panel);
  initStorySection();
  initLogView(panel);
  initPresetSection(panel);
  panel.querySelector('.kaleido-panel__close')?.addEventListener('click', closePanel);
  if (!globalThis[ESC_KEY_HANDLER_KEY]) {
    globalThis[ESC_KEY_HANDLER_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      if (isStoryWorkbenchOpen()) return;
      const activeView = panel.querySelector('.kaleido-view.is-active');
      if (activeView && activeView.id !== HOME_VIEW_ID) {
        showPanelView(HOME_VIEW_ID);
        return;
      }
      closePanel();
    };
    document.addEventListener('keydown', globalThis[ESC_KEY_HANDLER_KEY]);
  }
  return panel;
}


// ===== js/views-api.js =====
// ===== 万华镜（Kaleidoscope）API 连接视图 UI =====
function setApiStatus(message, state = 'idle') {
  const status = document.getElementById(API_STATUS_ID);
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
}

function populateModelList(settings) {
  const select = document.getElementById(API_MODEL_LIST_ID);
  if (!select) return;
  const models = Array.isArray(settings?.modelOptions) ? settings.modelOptions : [];
  select.innerHTML = '';
  if (models.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '请先连接并拉取模型';
    select.appendChild(option);
    return;
  }
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '选择一个模型';
  select.appendChild(placeholder);
  for (const modelId of models) {
    const option = document.createElement('option');
    option.value = modelId;
    option.textContent = modelId;
    if (modelId === settings.model) option.selected = true;
    select.appendChild(option);
  }
}

function readApiForm(ctx) {
  const settings = getSettings(ctx);
  settings.apiUrl = String(document.getElementById(API_URL_ID)?.value || '').trim();
  settings.apiKey = String(document.getElementById(API_KEY_ID)?.value || '').trim();
  return settings;
}

async function connectAndLoadModels(ctx) {
  const settings = readApiForm(ctx);
  logApp('info', '开始连接 API', getApiBase(settings) || '');
  if (!getApiBase(settings)) {
    setApiStatus('请先填写 API Base URL', 'error');
    globalThis.toastr?.error?.('请先填写 API Base URL', `[${MODULE_DISPLAY_NAME}]`);
    return;
  }
  const button = document.getElementById(API_CONNECT_ID);
  if (button) button.disabled = true;
  setApiStatus('连接中，正在拉取模型...', 'busy');
  try {
    const models = await fetchModelList(settings);
    settings.modelOptions = models;
    if (!settings.model || !models.includes(settings.model)) settings.model = models[0];
    saveSettingsImmediate(ctx);
    populateModelList(settings);
    const modelInput = document.getElementById(API_MODEL_ID);
    if (modelInput) modelInput.value = settings.model;
    setApiStatus(`已连接，拉取到 ${models.length} 个模型`, 'ok');
    globalThis.toastr?.success?.(`API 已拉取 ${models.length} 个模型`, `[${MODULE_DISPLAY_NAME}]`);
  } catch (error) {
    console.error(`[${MODULE_DISPLAY_NAME}] connectAndLoadModels failed`, error);
    const message = String(error?.message || error);
    setApiStatus(message, 'error');
    globalThis.toastr?.error?.(`API 连接失败：${message}`, `[${MODULE_DISPLAY_NAME}]`);
  } finally {
    if (button) button.disabled = false;
    refreshHomeApiStatus();
  }
}

function renderApiConcurrencyControl() {
  const toggle = document.getElementById(API_CONCURRENCY_TOGGLE_ID);
  const input = document.getElementById(API_CONCURRENCY_INPUT_ID);
  if (!toggle && !input) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  if (!settings) return;
  const enabled = settings.apiConcurrencyEnabled !== false;
  if (toggle) {
    toggle.textContent = enabled ? '🔀 并发限制：开' : '🔀 并发限制：关';
    toggle.classList.toggle('is-active', enabled);
    toggle.title = enabled ? '点击关闭并发限制' : '点击开启并发限制';
  }
  if (input) {
    input.value = settings.apiConcurrencyLimit;
    input.disabled = !enabled;
  }
}

function toggleApiConcurrency() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const settings = getSettings(ctx);
  settings.apiConcurrencyEnabled = !settings.apiConcurrencyEnabled;
  saveSettings(ctx);
  renderApiConcurrencyControl();
  logApp('info', settings.apiConcurrencyEnabled ? '并发限制已开启' : '并发限制已关闭');
  globalThis.toastr?.info?.(`API 并发限制已${settings.apiConcurrencyEnabled ? '开启' : '关闭'}`, `[${MODULE_DISPLAY_NAME}]`);
}

function clampApiConcurrencyLimit(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 1;
  return Math.min(10, Math.max(1, Math.floor(num)));
}

function applyApiSettingsToForm(ctx) {
  const settings = getSettings(ctx);
  const setValue = (id, value) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.value = value ?? '';
  };
  setValue(API_URL_ID, settings.apiUrl);
  setValue(API_KEY_ID, settings.apiKey);
  setValue(API_MODEL_ID, settings.model);
  const effortSelect = document.getElementById(API_REASONING_EFFORT_ID);
  if (effortSelect) effortSelect.value = String(settings.apiReasoningEffort || '');
  renderApiConcurrencyControl();
  populateModelList(settings);
  if (settings.modelOptions.length > 0) {
    setApiStatus(`已缓存 ${settings.modelOptions.length} 个模型`, 'ok');
  } else {
    setApiStatus('尚未连接', 'idle');
  }
  refreshHomeApiStatus();
}

function initApiSection(panel) {
  if (!panel || panel.dataset.apiReady === 'true') return;
  const getCtx = () => getContextSafe();

  document.getElementById(API_CONNECT_ID)?.addEventListener('click', () => {
    const ctx = getCtx();
    if (!ctx) return;
    connectAndLoadModels(ctx);
  });

  document.getElementById(API_KEY_TOGGLE_ID)?.addEventListener('click', (event) => {
    const input = document.getElementById(API_KEY_ID);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    event.currentTarget.textContent = show ? '🙈' : '👁';
    event.currentTarget.title = show ? '隐藏密钥' : '显示密钥';
  });

  const bindPersist = (id, key) => {
    document.getElementById(id)?.addEventListener('input', () => {
      const ctx = getCtx();
      if (!ctx) return;
      const settings = getSettings(ctx);
      settings[key] = String(document.getElementById(id)?.value || '').trim();
      saveSettings(ctx);
    });
  };
  bindPersist(API_URL_ID, 'apiUrl');
  bindPersist(API_KEY_ID, 'apiKey');

  document.getElementById(API_MODEL_LIST_ID)?.addEventListener('change', (event) => {
    const ctx = getCtx();
    if (!ctx) return;
    const settings = getSettings(ctx);
    settings.model = String(event.target?.value || '').trim();
    const modelInput = document.getElementById(API_MODEL_ID);
    if (modelInput) modelInput.value = settings.model;
    saveSettings(ctx);
  });
  bindPersist(API_MODEL_ID, 'model');

  document.getElementById(API_CONCURRENCY_TOGGLE_ID)?.addEventListener('click', toggleApiConcurrency);
  const concurrencyInput = document.getElementById(API_CONCURRENCY_INPUT_ID);
  concurrencyInput?.addEventListener('input', (event) => {
    const ctx = getCtx();
    if (!ctx) return;
    const settings = getSettings(ctx);
    settings.apiConcurrencyLimit = clampApiConcurrencyLimit(event.target?.value);
    saveSettings(ctx);
  });
  concurrencyInput?.addEventListener('change', (event) => {
    if (!event.target) return;
    event.target.value = clampApiConcurrencyLimit(event.target.value);
  });

  document.getElementById(API_REASONING_EFFORT_ID)?.addEventListener('change', (event) => {
    const ctx = getCtx();
    if (!ctx) return;
    const settings = getSettings(ctx);
    settings.apiReasoningEffort = String(event.target?.value || '');
    saveSettings(ctx);
    logApp('info', '思考强度已设置', settings.apiReasoningEffort || '默认（不发送）');
  });

  try {
    const ctx = getCtx();
    if (ctx) applyApiSettingsToForm(ctx);
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] applyApiSettingsToForm failed`, error);
  }
  panel.dataset.apiReady = 'true';
}


// ===== js/views-log.js =====
// ===== 万华镜（Kaleidoscope）系统日志：捕获 / 存储 / 视图 UI =====
// 参考 SoulLink 的日志系统：捕获 console、页面错误、Promise 拒绝、宿主事件与
// fetch 网络请求，统一进内存缓冲，支持级别/来源/搜索过滤、暂停、跟随、清空、
// 复制、导出与噪音过滤。热重载时新旧实例共用同一份缓冲（不丢状态）。

const CONSOLE_ORIGINALS = {};
// 热重载共享状态：脚本重新执行时，新旧实例共用同一份缓冲与暂停/序列状态，
// 保证「暂停」「继续」按钮与日志捕获管道永远指向同一份数据（热重载不丢状态）。
const logState = globalThis[LOG_STATE_KEY] || (globalThis[LOG_STATE_KEY] = {
  entries: [],
  sequence: 0,
  paused: false,
  pausedCount: 0,
  pausedAtId: 0,
});
let logEntries = logState.entries;
let logMaxEntries = LOG_MAX_ENTRIES_DEFAULT;
let logAutoScroll = true;
let logLevelFilter = '';
let logSourceFilter = '';
let logConsoleNoise = true;
let logSearchQuery = '';
let logVisibleCount = 0;
let logStatsRafId = 0;
let logSearchTimer = null;
let fullBodyCaptures = [];

function clampInt(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function formatLogTime(timestamp) {
  const date = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${String(date.getMilliseconds()).padStart(3, '0')}`;
}

function safeStringify(value) {
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  try {
    const seen = new WeakSet();
    const text = JSON.stringify(value, (key, item) => {
      if (typeof item === 'bigint') return `${item}n`;
      if (item instanceof Error) return `[${item.name || 'Error'}: ${item.message}]`;
      if (typeof item === 'function') return '[function]';
      if (item && typeof item === 'object') {
        if (seen.has(item)) return '[circular]';
        seen.add(item);
      }
      return item;
    });
    return text === undefined ? String(value) : text;
  } catch {
    return String(value);
  }
}

function argToText(arg) {
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) return `${arg.name || 'Error'}: ${arg.message}`;
  if (arg && typeof arg === 'object' && arg.nodeType === 1) return `<${String(arg.tagName || 'element').toLowerCase()}>`;
  if (typeof arg === 'symbol') return String(arg);
  const text = safeStringify(arg);
  return text.length > 800 ? `${text.slice(0, 800)}…(截断)` : text;
}

function buildLogMessage(args) {
  const parts = [];
  for (const arg of args) {
    try {
      parts.push(argToText(arg));
    } catch {
      parts.push('[unserializable]');
    }
  }
  const message = parts.join(' ');
  return message.length > 4000 ? `${message.slice(0, 4000)}…(截断)` : message;
}

function pushLogEntry(level, source, args, detail) {
  try {
    const safeLevel = LOG_LEVELS.includes(level) ? level : 'info';
    const timestamp = Date.now();
    const entry = {
      id: ++logState.sequence,
      ts: timestamp,
      time: formatLogTime(timestamp),
      level: safeLevel,
      source: String(source || 'app').slice(0, 24),
      message: redactSensitive(buildLogMessage(Array.isArray(args) ? args : [args])),
    };
    if (detail) entry.detail = redactSensitive(String(detail)).slice(0, LOG_DETAIL_CAP);
    // 噪音过滤：Tavern 内部刷屏（世界书扫描 / 宏变量 dump / 正则跳过 / 事件总线 / 元数据保存 / 非模型 IPC）。
    // 注意：真实环境里 [WI] / [Prompt Template] 常以 info 级别输出，只过滤 debug 会漏网，故 debug+info 都过滤；
    // warn/error 永不误伤。
    if (logConsoleNoise) {
      if (source === 'console' && (safeLevel === 'debug' || safeLevel === 'info')
        && LOG_NOISE_PREFIXES.some((prefix) => entry.message.startsWith(prefix))) return;
      if (source === 'network' && safeLevel === 'debug'
        && NETWORK_NOISE_PATTERNS.some((pattern) => pattern.test(entry.message))) return;
      // 宿主扩展更新检查的已知报错（error 级，见 constants 注释）：按内容精确匹配，不误伤其他 error。
      if (ERROR_NOISE_PATTERNS.some((pattern) => pattern.test(entry.message))) return;
    }
    // 连续重复折叠：同一级别/来源/内容紧挨着出现时，只更新最后一条的计数与时间
    const last = logEntries[logEntries.length - 1];
    if (last && last.level === entry.level && last.source === entry.source
      && last.message === entry.message && (last.detail || '') === (entry.detail || '')) {
      last.repeat = (last.repeat || 1) + 1;
      last.ts = timestamp;
      last.time = entry.time;
      if (logState.paused) logState.pausedCount += 1;
      refreshLastLogRow();
      scheduleLogStats();
      return;
    }
    logEntries.push(entry);
    if (logEntries.length > logMaxEntries) logEntries.splice(0, logEntries.length - logMaxEntries);
    if (logState.paused) logState.pausedCount += 1;
    appendLiveLogEntry(logEntries[logEntries.length - 1]);
    scheduleLogStats();
  } catch (error) {
    try {
      CONSOLE_ORIGINALS.error?.apply(globalThis.console, ['[Kaleidoscope] 日志捕获失败', error]);
    } catch {}
  }
}

function initLogCapture() {
  if (typeof globalThis.window === 'undefined') return;
  try {
    const state = globalThis[LOG_CAPTURE_KEY] || (globalThis[LOG_CAPTURE_KEY] = { handlers: [], originals: {} });
    if (state.handlers.length === 0) {
      ['log', 'info', 'warn', 'error', 'debug'].forEach((method) => {
        const original = globalThis.console?.[method]?.bind?.(globalThis.console);
        if (typeof original !== 'function') return;
        state.originals[method] = original;
        globalThis.console[method] = (...args) => {
          try {
            (state.originals[method] || globalThis.console[method])(...args);
          } catch {}
          for (const handler of state.handlers) {
            try {
              handler(method === 'log' ? 'info' : method, 'console', args);
            } catch {}
          }
        };
      });
      globalThis.window.addEventListener('error', (event) => {
        const where = event?.filename ? ` @ ${event.filename}${event.lineno ? `:${event.lineno}` : ''}` : '';
        for (const handler of state.handlers) {
          try {
            handler('error', 'window', [String(event?.message || '未知错误') + where]);
          } catch {}
        }
      });
      globalThis.window.addEventListener('unhandledrejection', (event) => {
        for (const handler of state.handlers) {
          try {
            handler('error', 'promise', [event?.reason ?? '未捕获的 Promise 拒绝']);
          } catch {}
        }
      });
    }
    // 热重载（扩展脚本重新执行）时，沿用已有的 console 包装与窗口监听，
    // 只把捕获目标换成当前实例的 pushLogEntry，日志不中断、不重复包装。
    state.handlers = [pushLogEntry];
    for (const method of Object.keys(state.originals)) {
      if (!CONSOLE_ORIGINALS[method]) CONSOLE_ORIGINALS[method] = state.originals[method];
    }
  } catch (error) {
    try {
      globalThis.console?.error?.('[Kaleidoscope] 日志捕获初始化失败', error);
    } catch {}
  }
}

function initHostEventLogging() {
  const ctx = getContextSafe();
  const eventSource = ctx?.eventSource;
  if (!eventSource || typeof eventSource.on !== 'function') return;
  const wrappers = globalThis[LOG_EVENT_LOG_KEY] || (globalThis[LOG_EVENT_LOG_KEY] = {});
  for (const eventName of HOST_EVENTS_TO_LOG) {
    const eventType = resolveHostEventType(ctx, eventName);
    const previous = wrappers[eventName];
    if (previous && typeof eventSource.removeListener === 'function') {
      eventSource.removeListener(eventType, previous);
    }
    const wrapped = (...args) => pushLogEntry('debug', 'event', [`[${eventName}]`, ...args]);
    wrappers[eventName] = wrapped;
    eventSource.on(eventType, wrapped);
  }
}

// ---------- 日志系统：网络请求捕获 ----------
function redactSensitive(text) {
  return String(text || '')
    .replace(/("(?:api[_-]?key|zapikey|key|password|proxy_password|authorization|token)"\s*:\s*")[^"]*(")/gi, '$1***$2')
    .replace(/(Authorization:\s*Bearer\s+)[A-Za-z0-9._-]+/gi, '$1***')
    .replace(/(Bearer\s+)[A-Za-z0-9._-]+/gi, '$1***')
    .replace(/\b(sk-[A-Za-z0-9_-]{12,})\b/g, 'sk-***')
    .replace(/\b(tauri-invoke-key:\s*)[^\s]+/gi, '$1***');
}

function prettyJsonOrRaw(text, cap) {
  const trimmed = String(text || '');
  if (!trimmed) return '(无)';
  try {
    const parsed = JSON.parse(trimmed);
    const pretty = JSON.stringify(parsed, null, 2);
    return pretty.length > cap ? `${pretty.slice(0, cap)}…(截断)` : pretty;
  } catch {
    return trimmed.length > cap ? `${trimmed.slice(0, cap)}…(截断)` : trimmed;
  }
}

function formatHeadersForLog(headers) {
  try {
    const normalized = new Headers(headers || {});
    const lines = [];
    normalized.forEach((value, key) => {
      const lower = key.toLowerCase();
      const redacted = /authorization|api[_-]?key|password|proxy_password|token|cookie|invoke/i.test(lower) ? '***' : value;
      lines.push(`${key}: ${redacted}`);
    });
    return lines.join('\n') || '(无)';
  } catch {
    return '(无法读取)';
  }
}

function formatBodyForLog(body) {
  if (body === undefined || body === null) return '(无)';
  if (typeof body === 'string') return redactSensitive(prettyJsonOrRaw(body, LOG_REQUEST_BODY_CAP));
  if (body instanceof URLSearchParams) return redactSensitive(String(body).slice(0, LOG_REQUEST_BODY_CAP));
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    const lines = [];
    body.forEach((value, key) => {
      const text = typeof value === 'string' ? value : `[File ${value.name || '?'} ${value.size || '?'}B]`;
      lines.push(`${key}: ${/key|password|token/i.test(key) ? '***' : text}`);
    });
    return lines.join('\n') || '(空)';
  }
  if (body instanceof Blob) return `[Blob ${body.size} 字节]`;
  if (body instanceof ArrayBuffer) return `[ArrayBuffer ${body.byteLength} 字节]`;
  if (body instanceof ReadableStream) return '[ReadableStream]';
  return `[${Object.prototype.toString.call(body)}]`;
}

async function readStreamText(stream, cap) {
  if (!stream) return '';
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';
  try {
    while (text.length < cap) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
    if (text.length >= cap) {
      try {
        await reader.cancel();
      } catch {}
      text = `${text.slice(0, cap)}…(截断)`;
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }
  return text;
}

function isChatCompletionUrl(url) {
  return /chat-completions|generate_chat_completion/i.test(String(url || ''));
}

async function readStreamFully(stream) {
  if (!stream) return '';
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }
  return text;
}

function pushFullBodyCapture(capture) {
  fullBodyCaptures.push(capture);
  if (fullBodyCaptures.length > LOG_FULL_BODY_MAX) fullBodyCaptures.splice(0, fullBodyCaptures.length - LOG_FULL_BODY_MAX);
  pushLogEntry('debug', 'network', ['完整请求体已捕获', `${capture.method} ${capture.url}`]);
}

async function describeFetchRequest(args) {
  const [input, init] = args;
  let url = '';
  let method = 'GET';
  let headers = null;
  let bodyText = '(无)';
  let fullBody = '';
  if (input instanceof Request) {
    url = input.url;
    method = input.method || 'GET';
    headers = input.headers;
    try {
      const clone = input.clone();
      const rawBody = await readStreamText(clone.body, LOG_REQUEST_BODY_CAP);
      bodyText = rawBody ? redactSensitive(prettyJsonOrRaw(rawBody, LOG_REQUEST_BODY_CAP)) : '(无)';
      if (isChatCompletionUrl(url)) {
        const fullClone = input.clone();
        fullBody = redactSensitive(await readStreamFully(fullClone.body));
      }
    } catch {
      bodyText = '(请求体已消费，无法读取)';
    }
  } else {
    url = String(input);
    method = String(init?.method || 'GET').toUpperCase();
    headers = init?.headers || null;
    bodyText = formatBodyForLog(init?.body);
    if (isChatCompletionUrl(url)) {
      fullBody = redactSensitive(prettyJsonOrRaw(String(init?.body ?? ''), Number.MAX_SAFE_INTEGER));
    }
  }
  return {
    url,
    method,
    fullBody,
    detail: `请求头:\n${formatHeadersForLog(headers)}\n请求体:\n${bodyText}`,
  };
}

async function readResponseBodyForLog(response, url) {
  try {
    const cappedClone = response.clone();
    let capped = '';
    let full = '';
    // 对话接口的响应体直接从同一个 clone 完整读完（再截断出展示文本），
    // 避免二次 clone 在 fetchText 已消费原始响应体后抛错、把已读到的内容一起丢掉
    // （旧实现因此把有内容的响应也记成「(空)」，误导排查）。
    if (isChatCompletionUrl(url)) {
      full = redactSensitive(await readStreamFully(cappedClone.body));
      capped = full.length > LOG_RESPONSE_BODY_CAP ? `${full.slice(0, LOG_RESPONSE_BODY_CAP)}…(截断)` : full;
    } else {
      capped = await readStreamText(cappedClone.body, LOG_RESPONSE_BODY_CAP);
    }
    return { capped, full };
  } catch {
    return { capped: '', full: '' };
  }
}

function handleNetworkEvent(event) {
  try {
    if (event.kind === 'request') {
      pushLogEntry('debug', 'network', [`${event.method} ${event.url}`], event.detail);
      return;
    }
    if (event.kind === 'error') {
      pushLogEntry('error', 'network', [`请求失败 ${event.method} ${event.url}`, String(event.error?.message || event.error)], event.detail);
      return;
    }
    const { response, method, url, detail, fullBody, startedAt } = event;
    const duration = Date.now() - startedAt;
    const level = response.status >= 500 ? 'error' : (response.status >= 400 ? 'warn' : 'debug');
    const message = `${response.status} ${method} ${url} · ${duration}ms`;
    readResponseBodyForLog(response, url)
      .then(({ capped, full }) => {
        pushLogEntry(level, 'network', [message], `${detail}\n\n响应头:\n${formatHeadersForLog(response.headers)}\n响应体:\n${redactSensitive(capped) || '(空)'}`);
        if (fullBody || full) {
          pushFullBodyCapture({ url, method, requestBody: fullBody, responseBody: full, at: new Date().toISOString() });
        }
      })
      .catch(() => {
        pushLogEntry(level, 'network', [message], `${detail}\n\n响应体: (读取失败)`);
      });
  } catch (error) {
    try {
      CONSOLE_ORIGINALS.error?.apply(globalThis.console, ['[Kaleidoscope] 网络日志处理失败', error]);
    } catch {}
  }
}

function initNetworkCapture() {
  if (typeof globalThis.window === 'undefined') return;
  try {
    const state = globalThis[NETWORK_CAPTURE_KEY] || (globalThis[NETWORK_CAPTURE_KEY] = { handlers: [], original: null });
    if (!state.original && typeof globalThis.fetch === 'function') {
      state.original = globalThis.fetch.bind(globalThis);
      globalThis.fetch = async (...args) => {
        const requestInfo = await describeFetchRequest(args);
        const startedAt = Date.now();
        for (const handler of state.handlers) {
          try {
            handler({ kind: 'request', ...requestInfo, startedAt });
          } catch {}
        }
        let response;
        try {
          response = await state.original(...args);
        } catch (error) {
          for (const handler of state.handlers) {
            try {
              handler({ kind: 'error', ...requestInfo, error, startedAt });
            } catch {}
          }
          throw error;
        }
        for (const handler of state.handlers) {
          try {
            handler({ kind: 'response', ...requestInfo, response, startedAt });
          } catch {}
        }
        return response;
      };
    }
    // 热重载时沿用已安装的 fetch 包装，只替换捕获目标。
    state.handlers = [handleNetworkEvent];
  } catch (error) {
    try {
      globalThis.console?.error?.('[Kaleidoscope] 网络日志捕获初始化失败', error);
    } catch {}
  }
}

// ---------- 日志系统：列表渲染 ----------
function scheduleFrame(callback) {
  if (typeof globalThis.requestAnimationFrame === 'function') return globalThis.requestAnimationFrame(callback);
  return setTimeout(callback, 16);
}

function entryMatchesLog(entry) {
  if (logLevelFilter && entry.level !== logLevelFilter) return false;
  if (logSourceFilter && entry.source !== logSourceFilter) return false;
  const query = logSearchQuery.trim().toLowerCase();
  if (!query) return true;
  return `${entry.time} ${entry.level} ${entry.source} ${entry.message} ${entry.detail || ''}`.toLowerCase().includes(query);
}

function getVisibleLogEntries() {
  // 暂停时只渲染暂停时刻之前的快照：暂停期间缓冲的新日志不会因过滤/搜索/重开视图泄漏到列表
  const base = logState.paused && logState.pausedAtId > 0
    ? logEntries.filter((entry) => entry.id <= logState.pausedAtId)
    : logEntries;
  return base.filter(entryMatchesLog);
}

function createLogRow(entry) {
  const row = document.createElement('div');
  row.className = `kaleido-log__row kaleido-log__row--${entry.level}`;
  row.title = '点击展开 / 收起完整内容';
  const time = document.createElement('span');
  time.className = 'kaleido-log__time';
  time.textContent = entry.time;
  const level = document.createElement('span');
  level.className = 'kaleido-log__level';
  level.textContent = entry.level;
  const source = document.createElement('span');
  source.className = 'kaleido-log__source';
  source.textContent = entry.source;
  source.title = `来源: ${entry.source}`;
  const text = document.createElement('span');
  text.className = 'kaleido-log__text';
  text.textContent = entry.message;
  text.title = entry.message;
  row.dataset.id = String(entry.id);
  row.append(time, level, source, text);
  if (entry.detail) {
    const detail = document.createElement('pre');
    detail.className = 'kaleido-log__detail';
    detail.textContent = entry.detail;
    row.appendChild(detail);
  }
  if (entry.repeat > 1) {
    const repeat = document.createElement('span');
    repeat.className = 'kaleido-log__repeat';
    repeat.textContent = `×${entry.repeat}`;
    repeat.title = `同一内容连续出现 ${entry.repeat} 次`;
    row.appendChild(repeat);
  }
  row.addEventListener('click', () => row.classList.toggle('is-expanded'));
  return row;
}

function scrollLogToBottom(list) {
  if (!list) return;
  list.scrollTop = list.scrollHeight;
}

function isLogAtBottom(list) {
  return list.scrollHeight - list.scrollTop - list.clientHeight < 24;
}

function syncLogNote(list) {
  if (!list) return;
  if (logVisibleCount <= LOG_RENDER_CAP) {
    list.querySelector('.kaleido-log__note')?.remove();
    return;
  }
  let note = list.querySelector('.kaleido-log__note');
  if (!note) {
    note = document.createElement('div');
    note.className = 'kaleido-log__note';
    list.insertBefore(note, list.firstChild);
  }
  note.textContent = `仅显示最近 ${LOG_RENDER_CAP} 条 · 共 ${logVisibleCount} 条`;
}

function updateLogBackButton() {
  const list = document.getElementById(LOG_LIST_ID);
  const back = document.getElementById(LOG_BACK_ID);
  if (!list || !back) return;
  back.hidden = isLogAtBottom(list);
}

function renderLogList() {
  const list = document.getElementById(LOG_LIST_ID);
  if (!list) return;
  list.textContent = '';
  const entries = getVisibleLogEntries();
  logVisibleCount = entries.length;
  const slice = entries.slice(-LOG_RENDER_CAP);
  const fragment = document.createDocumentFragment();
  for (const entry of slice) fragment.appendChild(createLogRow(entry));
  list.appendChild(fragment);
  syncLogNote(list);
  if (entries.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'kaleido-log__empty';
    empty.textContent = '暂无日志 —— 后台日志会自动记录到这里。';
    list.appendChild(empty);
  }
  scrollLogToBottom(list);
  updateLogBackButton();
}

function refreshLastLogRow() {
  const list = document.getElementById(LOG_LIST_ID);
  const view = document.getElementById(LOG_VIEW_ID);
  const entry = logEntries[logEntries.length - 1];
  if (!list || !view || !entry || !view.classList.contains('is-active') || logState.paused) return;
  const lastRow = list.querySelector('.kaleido-log__row:last-child');
  if (!lastRow || lastRow.dataset.id !== String(entry.id)) return;
  const timeEl = lastRow.querySelector('.kaleido-log__time');
  if (timeEl) timeEl.textContent = entry.time;
  let badge = lastRow.querySelector('.kaleido-log__repeat');
  if (entry.repeat > 1) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'kaleido-log__repeat';
      lastRow.appendChild(badge);
    }
    badge.textContent = `×${entry.repeat}`;
    badge.title = `同一内容连续出现 ${entry.repeat} 次`;
  } else if (badge) {
    badge.remove();
  }
}

function appendLiveLogEntry(entry) {
  const list = document.getElementById(LOG_LIST_ID);
  const view = document.getElementById(LOG_VIEW_ID);
  if (!list || !view || !entry) return;
  if (!view.classList.contains('is-active') || logState.paused) return;
  if (!entryMatchesLog(entry)) return;
  // 跟随开启 = 钉在底部：无论当前滚动位置，新日志一律滚到底部显示最新
  const shouldFollow = logAutoScroll;
  list.querySelector('.kaleido-log__empty')?.remove();
  list.appendChild(createLogRow(entry));
  logVisibleCount += 1;
  let rowCount = list.querySelectorAll('.kaleido-log__row').length;
  while (rowCount > LOG_RENDER_CAP) {
    const firstRow = list.querySelector('.kaleido-log__row');
    if (!firstRow) break;
    firstRow.remove();
    rowCount -= 1;
  }
  syncLogNote(list);
  if (shouldFollow) scrollLogToBottom(list);
  updateLogBackButton();
}

function updateLogStats() {
  const counts = { debug: 0, info: 0, warn: 0, error: 0 };
  for (const entry of logEntries) counts[entry.level] = (counts[entry.level] || 0) + 1;
  const total = logEntries.length;
  document.querySelectorAll('.kaleido-log__chip-count').forEach((node) => {
    const level = node.dataset.level || '';
    node.textContent = level ? counts[level] || 0 : total;
  });
  const status = document.getElementById(LOG_STATUS_ID);
  if (status) status.textContent = `共 ${total} 条`;
  const paused = document.getElementById(LOG_PAUSED_ID);
  if (paused) {
    paused.hidden = !logState.paused;
    if (logState.paused) paused.textContent = `已暂停 · 新增 +${logState.pausedCount}`;
  }
  logVisibleCount = getVisibleLogEntries().length;
  syncLogNote(document.getElementById(LOG_LIST_ID));
}

function scheduleLogStats() {
  if (logStatsRafId) return;
  logStatsRafId = scheduleFrame(() => {
    logStatsRafId = 0;
    try {
      updateLogStats();
    } catch {}
  });
}

function buildLogExportText() {
  return `${logEntries
    .map((entry) => {
      const suffix = entry.repeat > 1 ? ` (×${entry.repeat})` : '';
      const line = `${entry.time} [${entry.level}] (${entry.source}) ${entry.message}${suffix}`;
      if (!entry.detail) return line;
      return `${line}\n${entry.detail.split('\n').map((detailLine) => `  ${detailLine}`).join('\n')}`;
    })
    .join('\n')}\n`;
}

// ---------- 日志系统：视图 UI ----------
function initLogView(panel) {
  if (!panel || panel.dataset.logReady === 'true') return;

  const autoscroll = document.getElementById(LOG_AUTOSCROLL_ID);
  if (autoscroll) autoscroll.classList.toggle('is-active', logAutoScroll);

  const noiseToggle = document.getElementById(LOG_NOISE_ID);
  if (noiseToggle) noiseToggle.classList.toggle('is-active', logConsoleNoise);
  noiseToggle?.addEventListener('click', () => {
    logConsoleNoise = !logConsoleNoise;
    noiseToggle.classList.toggle('is-active', logConsoleNoise);
    noiseToggle.title = logConsoleNoise ? '过滤已知噪音（世界书扫描 / 宏变量 dump / 正则跳过 / 事件总线 / 内部保存 / 非模型网络调用 / 宿主扩展更新检查报错）' : '不过滤噪音（显示全部 console 与网络日志）';
    renderLogList();
    updateLogStats();
  });

  panel.querySelectorAll('.kaleido-log__chip').forEach((chip) =>
    chip.addEventListener('click', () => {
      logLevelFilter = chip.dataset.level || '';
      panel.querySelectorAll('.kaleido-log__chip').forEach((node) => node.classList.toggle('is-active', node === chip));
      renderLogList();
      updateLogStats();
    }),
  );

  const search = document.getElementById(LOG_SEARCH_ID);
  search?.addEventListener('input', () => {
    clearTimeout(logSearchTimer);
    logSearchTimer = setTimeout(() => {
      logSearchQuery = String(search.value || '').trim();
      renderLogList();
      updateLogStats();
    }, LOG_SEARCH_DEBOUNCE_MS);
  });

  document.getElementById(LOG_PAUSE_ID)?.addEventListener('click', () => {
    logState.paused = !logState.paused;
    logState.pausedCount = 0;
    if (logState.paused) {
      // 记录暂停时刻的可见边界：暂停期间的新日志只入内存，恢复后一次性显示
      logState.pausedAtId = logEntries.length ? logEntries[logEntries.length - 1].id : 0;
    } else {
      logState.pausedAtId = 0;
      renderLogList();
    }
    const pause = document.getElementById(LOG_PAUSE_ID);
    if (pause) {
      pause.textContent = logState.paused ? '▶ 继续' : '⏸ 暂停';
      pause.classList.toggle('is-active', logState.paused);
      pause.title = logState.paused
        ? '已暂停：新日志先缓存（+N），不追加到列表；点「继续」一次性显示'
        : '暂停：新日志先缓存（+N），不再追加到列表';
    }
    updateLogStats();
  });

  autoscroll?.addEventListener('click', () => {
    logAutoScroll = !logAutoScroll;
    autoscroll.classList.toggle('is-active', logAutoScroll);
    autoscroll.title = logAutoScroll
      ? '跟随：钉在底部，新日志自动滚到底部（点一下关闭）'
      : '已停止跟随：新日志仍追加，但不再自动滚动';
    if (logAutoScroll) scrollLogToBottom(document.getElementById(LOG_LIST_ID));
  });

  const sourceSelect = document.getElementById(LOG_SOURCE_ID);
  sourceSelect?.addEventListener('change', () => {
    logSourceFilter = sourceSelect.value || '';
    renderLogList();
    updateLogStats();
  });

  const maxSelect = document.getElementById(LOG_MAX_ID);
  if (maxSelect) {
    if (![...maxSelect.options].some((option) => option.value === String(logMaxEntries))) {
      const customOption = document.createElement('option');
      customOption.value = String(logMaxEntries);
      customOption.textContent = `${logMaxEntries} 条`;
      maxSelect.appendChild(customOption);
    }
    maxSelect.value = String(logMaxEntries);
    maxSelect.addEventListener('change', () => {
      logMaxEntries = clampInt(maxSelect.value, 100, 20000, LOG_MAX_ENTRIES_DEFAULT);
      if (logEntries.length > logMaxEntries) logEntries.splice(0, logEntries.length - logMaxEntries);
      renderLogList();
      updateLogStats();
    });
  }

  document.getElementById(LOG_CLEAR_ID)?.addEventListener('click', () => {
    logEntries.length = 0;
    logState.pausedCount = 0;
    logState.pausedAtId = 0;
    renderLogList();
    updateLogStats();
    globalThis.toastr?.info?.('日志已清空', `[${MODULE_DISPLAY_NAME}]`);
  });

  document.getElementById(LOG_COPY_ID)?.addEventListener('click', () => {
    try {
      const text = buildLogExportText();
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
      } else {
        fallbackCopyText(text);
      }
      globalThis.toastr?.success?.(`已复制 ${logEntries.length} 条日志`, `[${MODULE_DISPLAY_NAME}]`);
    } catch (error) {
      globalThis.toastr?.error?.(`日志复制失败：${error?.message || error}`, `[${MODULE_DISPLAY_NAME}]`);
    }
  });

  document.getElementById(LOG_EXPORT_ID)?.addEventListener('click', () => {
    const payload = {
      app: MODULE_DISPLAY_NAME,
      version: MODULE_VERSION,
      exportedAt: new Date().toISOString(),
      count: logEntries.length,
      entries: logEntries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `kaleidoscope-log-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (logEntries.length === 0) {
      globalThis.toastr?.warning?.('暂无日志可导出', `[${MODULE_DISPLAY_NAME}]`);
    } else {
      globalThis.toastr?.success?.(`已导出 ${logEntries.length} 条日志（JSON 文件）`, `[${MODULE_DISPLAY_NAME}]`);
    }
  });

  document.getElementById(LOG_FULL_BODY_EXPORT_ID)?.addEventListener('click', () => {
    const payload = {
      app: MODULE_DISPLAY_NAME,
      version: MODULE_VERSION,
      exportedAt: new Date().toISOString(),
      count: fullBodyCaptures.length,
      captures: fullBodyCaptures,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `kaleidoscope-fullbody-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (fullBodyCaptures.length === 0) {
      globalThis.toastr?.warning?.('暂无完整请求体可导出（触发一次对话请求后自动捕获）', `[${MODULE_DISPLAY_NAME}]`);
    } else {
      globalThis.toastr?.success?.(`已导出最近 ${fullBodyCaptures.length} 次完整请求体（JSON 文件）`, `[${MODULE_DISPLAY_NAME}]`);
    }
  });

  const list = document.getElementById(LOG_LIST_ID);
  list?.addEventListener('scroll', () => updateLogBackButton());
  document.getElementById(LOG_BACK_ID)?.addEventListener('click', () => {
    if (list) scrollLogToBottom(list);
    updateLogBackButton();
  });

  renderLogList();
  updateLogStats();
  panel.dataset.logReady = 'true';
  logApp('info', `系统日志已就绪（内存保留 ${logMaxEntries} 条）`);
}

function fallbackCopyText(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand?.('copy');
    textarea.remove();
  } catch {}
}

// ---------- 日志系统：对外 API ----------
function exposeLogApi() {
  // 每次脚本（重新）执行都整体重建 API，保证热重载后仍指向当前实例的缓冲。
  globalThis.KaleidoscopeLog = {
    debug: (...args) => pushLogEntry('debug', 'external', args),
    info: (...args) => pushLogEntry('info', 'external', args),
    warn: (...args) => pushLogEntry('warn', 'external', args),
    error: (...args) => pushLogEntry('error', 'external', args),
    log: (...args) => pushLogEntry('info', 'external', args),
    clear: () => {
      logEntries.length = 0;
      logState.pausedCount = 0;
      logState.pausedAtId = 0;
      renderLogList();
      updateLogStats();
    },
    getEntries: () => logEntries.slice(),
    setMaxEntries: (count) => {
      logMaxEntries = clampInt(count, 100, 20000, LOG_MAX_ENTRIES_DEFAULT);
      if (logEntries.length > logMaxEntries) logEntries.splice(0, logEntries.length - logMaxEntries);
      const select = document.getElementById(LOG_MAX_ID);
      if (select) select.value = String(logMaxEntries);
      renderLogList();
      updateLogStats();
    },
  };
}

// ---------- 日志系统：启动捕获（热重载安全） ----------
initLogCapture();
exposeLogApi();
initNetworkCapture();

// ===== js/views-preset.js =====
// ===== 万华镜（Kaleidoscope）预设模版：默认提示词编辑 =====
// 参考 SoulLink 的预设系统：标签页切换各子系统提示词，改完点「保存」，
// 「恢复默认」还原出厂内容。存储沿用各提示词在 settings 中的既有字段
// （空字符串 = 使用内置默认）。剧情预筛的启用开关与提示词编辑统一收口在这里。
let presetActiveKey = PRESET_DEFAULT_KEY;
const presetUnsaved = {};

function getPresetDefaultText(key) {
  const meta = PRESET_META[key];
  return meta && typeof meta.getDefault === 'function' ? meta.getDefault() : '';
}

function getPresetSavedText(key, ctx) {
  const meta = PRESET_META[key];
  if (!meta) return '';
  const settings = ctx ? getSettings(ctx) : null;
  const saved = settings ? String(settings[meta.settingsKey] || '') : '';
  return saved || getPresetDefaultText(key);
}

function getPresetEditorText() {
  return String(document.getElementById(PRESET_TEXT_ID)?.value ?? '');
}

function getPresetDirty(key) {
  return presetUnsaved[key] !== undefined;
}

function updatePresetTabs() {
  document.querySelectorAll('.kaleido-preset__tab').forEach((tab) => {
    const key = tab.dataset.promptKey;
    const active = key === presetActiveKey;
    tab.classList.toggle('is-active', active);
    tab.classList.toggle('is-dirty', getPresetDirty(key));
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function updatePresetStatus(key) {
  const status = document.getElementById(PRESET_STATUS_ID);
  const countNode = document.getElementById(PRESET_COUNT_ID);
  const saveBtn = document.getElementById(PRESET_SAVE_ID);
  const resetBtn = document.getElementById(PRESET_RESET_ID);
  const text = getPresetEditorText();
  const dirty = getPresetDirty(key);
  if (status) {
    status.textContent = dirty ? '未保存的更改' : (text === getPresetDefaultText(key) ? '默认内容' : '已保存的自定义内容');
    status.dataset.state = dirty ? 'dirty' : (text === getPresetDefaultText(key) ? 'default' : 'custom');
  }
  if (countNode) countNode.textContent = `${text.length} 字 · ${text.split('\n').length} 行`;
  if (saveBtn) saveBtn.disabled = !dirty;
  if (resetBtn) resetBtn.disabled = !dirty && text === getPresetDefaultText(key);
  updatePresetTabs();
}

function renderPresetEditor() {
  const ctx = getContextSafe();
  const textarea = document.getElementById(PRESET_TEXT_ID);
  if (!textarea) return;
  textarea.value = presetUnsaved[presetActiveKey] !== undefined ? presetUnsaved[presetActiveKey] : getPresetSavedText(presetActiveKey, ctx);
  updatePresetStatus(presetActiveKey);
}

// ---------- 剧情预筛设置（自 API 连接页迁移） ----------
function renderPresetGateControl() {
  const toggle = document.getElementById(PRESET_GATE_TOGGLE_ID);
  const status = document.getElementById(PRESET_GATE_STATUS_ID);
  if (!toggle && !status) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  if (!settings) return;
  const enabled = settings.storyGateEnabled !== false;
  if (toggle) {
    toggle.textContent = enabled ? '🎬 剧情预筛：开' : '🎬 剧情预筛：关';
    toggle.classList.toggle('is-active', enabled);
    toggle.title = enabled ? '点击关闭剧情预筛' : '点击开启剧情预筛';
  }
  if (status) {
    status.textContent = enabled ? '已启用' : '未启用';
    status.dataset.state = enabled ? 'ok' : 'idle';
  }
}

function toggleStoryGate() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const settings = getSettings(ctx);
  settings.storyGateEnabled = !(settings.storyGateEnabled !== false);
  saveSettings(ctx);
  renderPresetGateControl();
  refreshHomeInjectStatus();
  logApp('info', settings.storyGateEnabled ? '剧情预筛已开启' : '剧情预筛已关闭');
  globalThis.toastr?.info?.('剧情预筛已' + (settings.storyGateEnabled ? '开启' : '关闭'), '[' + MODULE_DISPLAY_NAME + ']');
}

// 首页「预设模版」卡片状态：已自定义的提示词份数。
function refreshHomePresetStatus() {
  const status = document.getElementById(HOME_PRESET_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    let customized = 0;
    for (const key of Object.keys(PRESET_META)) {
      const meta = PRESET_META[key];
      const saved = settings ? String(settings[meta.settingsKey] || '') : '';
      if (saved && saved !== getPresetDefaultText(key)) customized += 1;
    }
    status.textContent = customized > 0 ? `已自定义 ${customized} 份` : '默认配置';
    status.dataset.state = customized > 0 ? 'ok' : 'idle';
  } catch (error) {
    status.textContent = '默认配置';
    status.dataset.state = 'idle';
  }
}

function savePreset(key) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const meta = PRESET_META[key];
  if (!meta) return;
  const settings = getSettings(ctx);
  settings[meta.settingsKey] = getPresetEditorText();
  saveSettingsImmediate(ctx);
  delete presetUnsaved[key];
  updatePresetStatus(key);
  refreshHomePresetStatus();
  logApp('info', '预设已保存', meta.title);
  globalThis.toastr?.success?.(`${meta.title} 已保存`, `[${MODULE_DISPLAY_NAME}]`);
}

async function resetPreset(key) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const meta = PRESET_META[key];
  if (!meta) return;
  const dirty = getPresetDirty(key);
  const text = getPresetEditorText();
  if (dirty || text !== getPresetDefaultText(key)) {
    const what = dirty ? '未保存的修改' : '已保存的自定义内容';
    const confirmed = globalThis.confirm?.(`将「${meta.title}」恢复为默认内容？当前${what}将被默认内容覆盖。`);
    if (!confirmed) return;
  }
  const textarea = document.getElementById(PRESET_TEXT_ID);
  if (textarea) textarea.value = getPresetDefaultText(key);
  const settings = getSettings(ctx);
  settings[meta.settingsKey] = '';
  saveSettingsImmediate(ctx);
  delete presetUnsaved[key];
  updatePresetStatus(key);
  refreshHomePresetStatus();
  logApp('info', '预设已恢复默认', meta.title);
  globalThis.toastr?.info?.(`${meta.title} 已恢复默认`, `[${MODULE_DISPLAY_NAME}]`);
}

function initPresetSection(panel) {
  if (!panel || panel.dataset.presetReady === 'true') return;
  const getCtx = () => getContextSafe();

  document.getElementById(PRESET_TABS_ID)?.addEventListener('click', (event) => {
    const tab = event.target.closest('.kaleido-preset__tab');
    if (!tab || !tab.dataset.promptKey) return;
    presetActiveKey = tab.dataset.promptKey;
    renderPresetEditor();
  });

  document.getElementById(PRESET_TEXT_ID)?.addEventListener('input', () => {
    const ctx = getCtx();
    const text = getPresetEditorText();
    if (text === getPresetSavedText(presetActiveKey, ctx)) delete presetUnsaved[presetActiveKey];
    else presetUnsaved[presetActiveKey] = text;
    updatePresetStatus(presetActiveKey);
  });

  document.getElementById(PRESET_SAVE_ID)?.addEventListener('click', () => savePreset(presetActiveKey));
  document.getElementById(PRESET_RESET_ID)?.addEventListener('click', () => resetPreset(presetActiveKey));
  document.getElementById(PRESET_GATE_TOGGLE_ID)?.addEventListener('click', toggleStoryGate);

  renderPresetEditor();
  renderPresetGateControl();
  refreshHomePresetStatus();
  panel.dataset.presetReady = 'true';
  logApp('info', '预设模版已就绪');
}


// ===== js/views-home.js =====
// ===== 万华镜（Kaleidoscope）首页状态 =====
function refreshHomeApiStatus() {
  const status = document.getElementById(HOME_API_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    const model = String(settings?.model || '').trim();
    const hasUrl = Boolean(getApiBase(settings));
    if (model && hasUrl) {
      status.textContent = model.length > 18 ? `${model.slice(0, 18)}…` : model;
      status.dataset.state = 'ok';
    } else if (hasUrl) {
      status.textContent = '已填地址 · 未选模型';
      status.dataset.state = 'warn';
    } else {
      status.textContent = '尚未连接';
      status.dataset.state = 'idle';
    }
  } catch (error) {
    status.textContent = '尚未连接';
    status.dataset.state = 'idle';
  }
}

// 首页「剧情脉络」卡片状态：节点数 / 事件数 + 角色卡绑定提示。
function refreshHomeStoryStatus() {
  const status = document.getElementById(HOME_STORY_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const nodes = ctx ? getStoryNodes(ctx) : [];
    const scripts = ctx ? getStoryScripts(ctx) : [];
    const total = nodes.length + scripts.length;
    const character = ctx ? getStoryCharacter(ctx) : null;
    const card = ctx ? getStoryCardData(ctx) : null;
    if (character) {
      const name = String(character.name || character.avatar || '');
      status.title = card
        ? `剧情数据已绑定角色卡「${name}」：导入/导出角色卡时自动携带`
        : `当前角色卡「${name}」还没有剧情数据：首次保存后自动写入角色卡`;
    } else {
      status.title = '未绑定角色（群聊/未选角色）：数据存全局设置，不随角色卡导入导出';
    }
    if (total === 0) {
      status.textContent = character ? (card ? '已绑定 · 尚未添加' : '待绑定 · 尚未添加') : '尚未添加';
      status.dataset.state = 'idle';
    } else {
      status.textContent = `${nodes.length} 节点 · ${scripts.length} 事件`;
      status.dataset.state = 'ok';
    }
  } catch (error) {
    status.textContent = '尚未添加';
    status.dataset.state = 'idle';
  }
}

// 首页标语旁「系统日志」小图标状态：错误 / 警告条数徽标。
function refreshHomeLogStatus() {
  const badge = document.getElementById(HOME_LOG_BADGE_ID);
  if (!badge) return;
  try {
    const entries = (typeof logEntries !== 'undefined' && logEntries) || [];
    const errors = entries.filter((entry) => entry.level === 'error').length;
    const warns = entries.filter((entry) => entry.level === 'warn').length;
    if (errors > 0) {
      badge.textContent = String(errors);
      badge.dataset.state = 'error';
      badge.title = `${errors} 错误 · ${warns} 警告`;
      badge.hidden = false;
    } else if (warns > 0) {
      badge.textContent = String(warns);
      badge.dataset.state = 'warn';
      badge.title = `${warns} 警告`;
      badge.hidden = false;
    } else {
      badge.textContent = '';
      badge.dataset.state = 'idle';
      badge.title = '';
      badge.hidden = true;
    }
  } catch (error) {
    badge.textContent = '';
    badge.dataset.state = 'idle';
    badge.title = '';
    badge.hidden = true;
  }
}

// 首页「注入实录」卡片状态：剧情预筛最近一轮的结果。
function refreshHomeInjectStatus() {
  const status = document.getElementById(HOME_INJECT_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    if (!settings || settings.storyGateEnabled === false) {
      status.textContent = '未启用';
      status.dataset.state = 'idle';
      return;
    }
    const round = globalThis[STORY_GATE_LAST_ROUND_KEY] || null;
    if (!round) {
      status.textContent = '尚未运行';
      status.dataset.state = 'idle';
      return;
    }
    if (round.injected) {
      status.textContent = '已注入 ' + round.selectedIds.length + ' 事件';
      status.dataset.state = 'ok';
    } else if (round.timedOut) {
      status.textContent = '超时放行';
      status.dataset.state = 'warn';
    } else if (round.skipped) {
      status.textContent = '本轮无事件';
      status.dataset.state = 'idle';
    } else {
      status.textContent = '未注入';
      status.dataset.state = 'warn';
    }
  } catch (error) {
    status.textContent = '尚未运行';
    status.dataset.state = 'idle';
  }
}

// 首页状态统一刷新入口：后续新增卡片状态时在此挂接。
function refreshHomeStatuses() {
  refreshHomeApiStatus();
  refreshHomeStoryStatus();
  refreshHomeLogStatus();
  refreshHomeInjectStatus();
  refreshHomePresetStatus();
}


// ===== js/views-inject.js =====
// ===== 万华镜（Kaleidoscope）注入实录视图 =====
// 参考 SoulLink「角色扮演」视图：展示最近一轮剧情预筛的完整结果——
// 预筛原文（Gate 返回）、本轮触发的事件（含触发条件 / 说明 / 正文）、
// 以及最终注入上下文的 <Story_Event> 提示词原文。

function getStoryGateLastRound() {
  return globalThis[STORY_GATE_LAST_ROUND_KEY] || null;
}

// 摘要：本轮结果 + 统计 + 触发事件名单。
function buildInjectSummary(round) {
  const wrap = document.createElement('div');
  wrap.className = 'kaleido-inject__summary';
  const outcome = document.createElement('span');
  outcome.className = 'kaleido-inject__summary-outcome';
  if (round.injected) {
    outcome.textContent = '已注入 ' + round.selectedIds.length + ' 个事件';
    outcome.dataset.state = 'ok';
  } else if (round.timedOut) {
    outcome.textContent = '超时放行';
    outcome.dataset.state = 'warn';
  } else if (round.skipped) {
    outcome.textContent = '本轮无事件触发';
    outcome.dataset.state = 'idle';
  } else {
    outcome.textContent = '未注入';
    outcome.dataset.state = 'warn';
  }
  const stats = document.createElement('span');
  stats.className = 'kaleido-inject__summary-stats';
  stats.textContent = '耗时 ' + Math.round(round.durationMs) + 'ms · 候选 ' + round.totalEvents + ' 个事件 · 入选 ' + round.selectedIds.length + ' 个';
  wrap.append(outcome, stats);
  if (Array.isArray(round.selectedEvents) && round.selectedEvents.length > 0) {
    const names = document.createElement('span');
    names.className = 'kaleido-inject__summary-names';
    names.textContent = '触发：' + round.selectedEvents.map((event) => event.name || event.id).join('、');
    wrap.appendChild(names);
  }
  return wrap;
}

// 单个触发事件卡片：名称 / ID / 触发条件 / 说明 / 正文。
function buildInjectEventCard(event) {
  const card = document.createElement('div');
  card.className = 'kaleido-inject__event';
  const head = document.createElement('div');
  head.className = 'kaleido-inject__event-head';
  const name = document.createElement('span');
  name.className = 'kaleido-inject__event-name';
  name.textContent = event.name || '（未命名事件）';
  const id = document.createElement('span');
  id.className = 'kaleido-inject__event-id';
  id.textContent = event.id || '';
  head.append(name, id);
  card.appendChild(head);
  if (String(event.trigger || '').trim()) {
    const trigger = document.createElement('p');
    trigger.className = 'kaleido-inject__event-line';
    trigger.textContent = '触发条件：' + event.trigger;
    card.appendChild(trigger);
  }
  if (String(event.description || '').trim()) {
    const description = document.createElement('p');
    description.className = 'kaleido-inject__event-line';
    description.textContent = '事件说明：' + event.description;
    card.appendChild(description);
  }
  const body = document.createElement('div');
  body.className = 'kaleido-inject__event-body';
  body.textContent = String(event.content || '').trim() || '（事件正文为空）';
  card.appendChild(body);
  return card;
}

// 渲染注入实录视图：无记录时显示空态，有记录时按
// 摘要 → 预筛原文 → 触发事件 → 注入提示词原文 四段展示。
function renderInjectView() {
  const summary = document.getElementById(INJECT_SUMMARY_ID);
  const empty = document.getElementById(INJECT_EMPTY_ID);
  const gateHead = document.querySelector('.kaleido-inject__gate-head');
  const gateText = document.getElementById(INJECT_GATE_TEXT_ID);
  const eventsHead = document.querySelector('.kaleido-inject__events-head');
  const events = document.getElementById(INJECT_EVENTS_ID);
  const injectHead = document.querySelector('.kaleido-inject__inject-head');
  const injectText = document.getElementById(INJECT_TEXT_ID);
  if (!summary || !empty || !gateHead || !gateText || !eventsHead || !events || !injectHead || !injectText) return;
  const round = getStoryGateLastRound();
  if (!round) {
    summary.hidden = true;
    gateHead.hidden = true;
    gateText.hidden = true;
    eventsHead.hidden = true;
    events.hidden = true;
    injectHead.hidden = true;
    injectText.hidden = true;
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  summary.hidden = false;
  summary.textContent = '';
  summary.appendChild(buildInjectSummary(round));
  const hasGateRaw = Boolean(String(round.raw || '').trim());
  gateHead.hidden = !hasGateRaw;
  gateText.hidden = !hasGateRaw;
  gateText.textContent = round.raw || '';
  const hasEvents = Array.isArray(round.selectedEvents) && round.selectedEvents.length > 0;
  eventsHead.hidden = !hasEvents;
  events.hidden = !hasEvents;
  events.textContent = '';
  if (hasEvents) {
    for (const event of round.selectedEvents) {
      events.appendChild(buildInjectEventCard(event));
    }
  }
  const hasInjection = Boolean(String(round.injectionText || '').trim());
  injectHead.hidden = !hasInjection;
  injectText.hidden = !hasInjection;
  injectText.textContent = round.injectionText || '';
}

// 复制注入提示词原文：优先 Clipboard API，回退隐藏 textarea + execCommand。
async function copyInjectInjectionText() {
  const text = getStoryGateLastRound()?.injectionText || '';
  if (!text) return;
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    globalThis.toastr?.success?.('已复制注入提示词原文', '[' + MODULE_DISPLAY_NAME + ']');
  } catch (error) {
    console.warn('[' + MODULE_DISPLAY_NAME + '] 复制注入提示词失败', error);
    globalThis.toastr?.warning?.('注入原文复制失败，请手动选择文本', '[' + MODULE_DISPLAY_NAME + ']');
  }
}

// ===== js/story-data.js =====
// ===== 万华镜（Kaleidoscope）剧情脉络：数据模型 / YAML 导入导出 =====
function genStoryId(prefix) {
  const rand = Math.random().toString(36).slice(2, 8);
  return `kaleido-${prefix}-${Date.now().toString(36)}-${rand}`;
}

function nowIso() {
  return new Date().toISOString();
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

function storyTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function sanitizeStoryFilename(name) {
  const cleaned = String(name || '').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 40).replace(/^_+|_+$/g, '');
  return cleaned || '未命名';
}

// ---------- 角色卡绑定 ----------
// 剧情脉络数据与角色卡绑定（参考 SillyTavern 局部正则脚本）：数据存
// character.data.extensions.kaleidoscope_story，随角色卡导入/导出自动携带。
// 群聊 / 未选角色 / 宿主不支持写角色卡时，回退全局设置（storyNodes /
// storyScripts，兼容旧数据）。

// 当前选中的角色对象；群聊 / 未选角色 / 上下文无角色表时返回 null。
function getStoryCharacter(ctx) {
  if (!ctx || typeof ctx !== 'object') return null;
  const characters = Array.isArray(ctx.characters) ? ctx.characters : null;
  if (!characters) return null;
  const index = Number(ctx.characterId);
  if (!Number.isInteger(index) || index < 0 || index >= characters.length) return null;
  const character = characters[index];
  return character && typeof character === 'object' ? character : null;
}

// 当前角色卡里的剧情数据（无角色 / 卡上无数据时返回 null）；返回前就地
// 归一化 nodes / scripts 数组，保证后续变更始终落在角色卡数据上。
function getStoryCardData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character) return null;
  const extensions = character?.data?.extensions;
  if (!extensions || typeof extensions !== 'object') return null;
  const card = extensions[STORY_CARD_EXTENSION_KEY];
  if (!card || typeof card !== 'object' || Array.isArray(card)) return null;
  if (!Array.isArray(card.nodes)) card.nodes = [];
  if (!Array.isArray(card.scripts)) card.scripts = [];
  return card;
}

// 把剧情数据写入角色卡对象（内存态，持久化由 saveStoryData 防抖完成）。
function setStoryCardData(character, card) {
  if (!character || typeof character !== 'object') return;
  if (!character.data || typeof character.data !== 'object') character.data = {};
  if (!character.data.extensions || typeof character.data.extensions !== 'object') character.data.extensions = {};
  character.data.extensions[STORY_CARD_EXTENSION_KEY] = card;
}

// 写入角色卡失败 / 角色已删除 / 宿主不支持时的兜底：数据落回全局设置，避免丢失。
function fallbackStoryDataToSettings(ctx, card) {
  const settings = getSettings(ctx);
  settings.storyNodes = Array.isArray(card?.nodes) ? card.nodes : [];
  settings.storyScripts = Array.isArray(card?.scripts) ? card.scripts : [];
  saveSettings(ctx);
  logApp('warn', '剧情脉络写入角色卡失败，已回退全局设置');
}

// 防抖持久化：内存态已由调用方（数组引用）更新，这里只负责把整包数据
// 写回角色卡。按 avatar 定位角色，避免防抖期间切换角色写错卡。
function scheduleStoryCardSave(ctx, character, card) {
  const avatar = String(character?.avatar || '');
  if (globalThis[STORY_CARD_SAVE_TIMER_KEY]) {
    clearTimeout(globalThis[STORY_CARD_SAVE_TIMER_KEY]);
  }
  globalThis[STORY_CARD_SAVE_TIMER_KEY] = setTimeout(() => {
    globalThis[STORY_CARD_SAVE_TIMER_KEY] = null;
    persistStoryCardData(ctx, avatar, card).catch((error) => {
      logApp('warn', '写入角色卡失败', String(error?.message || error));
    });
  }, STORY_CARD_SAVE_DEBOUNCE_MS);
}

async function persistStoryCardData(ctx, avatar, card) {
  const characters = Array.isArray(ctx?.characters) ? ctx.characters : [];
  const index = characters.findIndex((character) => String(character?.avatar || '') === avatar);
  if (index < 0) {
    // 角色已删除：数据回退全局设置，避免丢失
    fallbackStoryDataToSettings(ctx, card);
    return;
  }
  const write = ctx?.writeExtensionField;
  if (typeof write !== 'function') {
    fallbackStoryDataToSettings(ctx, card);
    return;
  }
  try {
    await write.call(ctx, index, STORY_CARD_EXTENSION_KEY, card);
  } catch (error) {
    fallbackStoryDataToSettings(ctx, card);
    throw error;
  }
}

// ---------- 节点 / 事件：数据读写 ----------
// 剧情脉络只显示「当前角色卡绑定的内容」：有角色但卡上无数据时返回空数组，
// 不回退全局设置（避免把别的角色/旧数据串到当前角色卡上）；只有群聊 / 未选
// 角色 / 宿主不支持写角色卡时才用全局设置兜底。
function getStoryNodes(ctx) {
  const card = ctx ? getStoryCardData(ctx) : null;
  if (card) return card.nodes;
  if (ctx && getStoryCharacter(ctx) && typeof ctx?.writeExtensionField === 'function') return [];
  const settings = ctx ? getSettings(ctx) : null;
  return Array.isArray(settings?.storyNodes) ? settings.storyNodes : [];
}

function getStoryScripts(ctx) {
  const card = ctx ? getStoryCardData(ctx) : null;
  if (card) return card.scripts;
  if (ctx && getStoryCharacter(ctx) && typeof ctx?.writeExtensionField === 'function') return [];
  const settings = ctx ? getSettings(ctx) : null;
  return Array.isArray(settings?.storyScripts) ? settings.storyScripts : [];
}

// 确保当前角色卡有剧情数据容器：无卡时用旧版全局数据初始化（并清空全局兜底）。
// 无角色 / 宿主不支持写角色卡时返回 null（保持全局设置路径）。
function ensureStoryCardData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character || typeof ctx?.writeExtensionField !== 'function') return null;
  let card = getStoryCardData(ctx);
  if (card) return card;
  const settings = getSettings(ctx);
  const legacyNodes = Array.isArray(settings.storyNodes) ? settings.storyNodes : [];
  const legacyScripts = Array.isArray(settings.storyScripts) ? settings.storyScripts : [];
  card = { version: STORY_CARD_DATA_VERSION, nodes: legacyNodes, scripts: legacyScripts };
  setStoryCardData(character, card);
  if (legacyNodes.length > 0 || legacyScripts.length > 0) {
    settings.storyNodes = [];
    settings.storyScripts = [];
    logApp('info', '剧情脉络已绑定角色卡', '旧版全局数据已迁入当前角色卡');
    try {
      globalThis.toastr?.info?.('剧情脉络已绑定当前角色卡，旧版全局数据已迁入；导入/导出角色卡时自动携带', `[${MODULE_DISPLAY_NAME}]`);
    } catch {}
  }
  return card;
}

// 保存：有角色且宿主支持写角色卡 → 确保角色卡容器存在（首次变更时迁入旧版
// 全局数据），随后防抖持久化；否则写全局设置。
function saveStoryData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character || typeof ctx?.writeExtensionField !== 'function') {
    saveSettings(ctx);
    return;
  }
  const card = ensureStoryCardData(ctx);
  if (card) scheduleStoryCardSave(ctx, character, card);
}

function getStoryNodeById(ctx, id) {
  return getStoryNodes(ctx).find((node) => node.id === id) || null;
}

function getStoryScriptById(ctx, id) {
  return getStoryScripts(ctx).find((script) => script.id === id) || null;
}

function getStoryNodeScriptCount(ctx, nodeId) {
  return getStoryScripts(ctx).filter((script) => script.nodeId === nodeId).length;
}

function getStoryNodeChildren(ctx, parentId) {
  return getStoryNodes(ctx).filter((node) => String(node.parentId || '') === String(parentId || ''));
}

function getStoryRootNodes(ctx) {
  return getStoryNodes(ctx).filter((node) => !String(node.parentId || ''));
}

function byStoryCreatedAt(a, b) {
  return String(a?.createdAt || '').localeCompare(String(b?.createdAt || ''));
}

// nodeId 是否为 ancestorId 的后代（沿 parentId 链向上查）。
function isStoryNodeAncestor(ctx, ancestorId, nodeId) {
  let current = getStoryNodeById(ctx, nodeId);
  let guard = 0;
  while (current && guard < 1000) {
    if (current.id === ancestorId) return true;
    current = getStoryNodeById(ctx, String(current.parentId || ''));
    guard += 1;
  }
  return false;
}

function createStoryNode(ctx, data) {
  ensureStoryCardData(ctx);
  const nodes = getStoryNodes(ctx);
  const now = nowIso();
  let parentId = String(data?.parentId || '').trim();
  if (parentId && !nodes.some((node) => node.id === parentId)) parentId = '';
  const node = {
    id: genStoryId('n'),
    parentId,
    name: String(data?.name || '').trim() || '未命名节点',
    description: String(data?.description || '').trim(),
    enabled: data?.enabled === false ? false : true,
    createdAt: now,
    updatedAt: now,
  };
  nodes.push(node);
  saveStoryData(ctx);
  return node;
}

function updateStoryNode(ctx, id, data) {
  ensureStoryCardData(ctx);
  const node = getStoryNodeById(ctx, id);
  if (!node) return null;
  if (data && typeof data === 'object') {
    if (data.name !== undefined) node.name = String(data.name).trim() || node.name;
    if (data.description !== undefined) node.description = String(data.description).trim();
    if (data.enabled !== undefined) node.enabled = Boolean(data.enabled);
    if (data.parentId !== undefined) {
      const nextParent = String(data.parentId).trim();
      if (nextParent === '' || nextParent === id || isStoryNodeAncestor(ctx, id, nextParent)) {
        // 空=顶层；禁止挂到自己或自己的后代下
        node.parentId = '';
      } else if (getStoryNodeById(ctx, nextParent)) {
        node.parentId = nextParent;
      } else {
        node.parentId = '';
      }
    }
  }
  node.updatedAt = nowIso();
  saveStoryData(ctx);
  return node;
}

// 节点启用开关：关闭后本节点及其子节点、事件不再参与剧情预筛；再点一次重新激活。
function toggleStoryNodeEnabled(ctx, id) {
  ensureStoryCardData(ctx);
  const node = getStoryNodeById(ctx, id);
  if (!node) return null;
  node.enabled = node.enabled === false;
  node.updatedAt = nowIso();
  saveStoryData(ctx);
  return node;
}

// 节点是否激活：自身或任一祖先被关闭则视为停用（子树整体停用）。
function isStoryNodeActive(ctx, node) {
  let current = node || null;
  let guard = 0;
  while (current && guard < 1000) {
    if (current.enabled === false) return false;
    current = String(current.parentId || '') ? getStoryNodeById(ctx, current.parentId) : null;
    guard += 1;
  }
  return true;
}

// 当前参与预筛的事件：挂接节点（或任一祖先）被关闭的事件不返回；未分类事件恒有效。
function getStoryActiveScripts(ctx) {
  return getStoryScripts(ctx).filter((script) => {
    if (!script.nodeId || !getStoryNodeById(ctx, script.nodeId)) return true;
    return isStoryNodeActive(ctx, getStoryNodeById(ctx, script.nodeId));
  });
}

// 事件 ID：默认从 001 开始逐次递增；excludeId 为正在编辑的事件自身 id（不计入）。
function nextStoryScriptId(ctx, excludeId) {
  const scripts = getStoryScripts(ctx);
  let max = 0;
  for (const script of scripts) {
    if (script.id === excludeId) continue;
    const match = /(?:^|\D)(\d+)$/.exec(String(script.id || ''));
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return String(max + 1).padStart(3, '0');
}

// 计算事件实际使用的 id：给定 id 非空且未被占用则沿用；为空或与其他事件重复时，
// 按 001 序列自动顺延到未注册的 id。excludeId 为正在编辑的事件自身 id。
function resolveStoryScriptId(ctx, requested, excludeId) {
  const scripts = getStoryScripts(ctx);
  const used = new Set();
  for (const script of scripts) {
    if (script.id !== excludeId) used.add(script.id);
  }
  const candidate = String(requested ?? '').trim();
  if (candidate && !used.has(candidate)) return candidate;
  let id = nextStoryScriptId(ctx, excludeId);
  while (used.has(id)) {
    const match = /(\d+)$/.exec(id);
    id = String((match ? parseInt(match[1], 10) : 0) + 1).padStart(3, '0');
  }
  return id;
}

// 删除节点：子节点上移到其上级（顶层则成根节点），其下事件改为「未分类」，
// 事件本身不删除。返回 { movedChildren, detachedScripts }。
function deleteStoryNode(ctx, id) {
  ensureStoryCardData(ctx);
  const nodes = getStoryNodes(ctx);
  const index = nodes.findIndex((node) => node.id === id);
  if (index < 0) return null;
  const node = nodes[index];
  const parentId = String(node.parentId || '');
  const now = nowIso();
  let movedChildren = 0;
  for (const child of nodes) {
    if (String(child.parentId || '') === id) {
      child.parentId = parentId;
      child.updatedAt = now;
      movedChildren += 1;
    }
  }
  let detachedScripts = 0;
  for (const script of getStoryScripts(ctx)) {
    if (script.nodeId === id) {
      script.nodeId = '';
      script.updatedAt = now;
      detachedScripts += 1;
    }
  }
  nodes.splice(index, 1);
  saveStoryData(ctx);
  return { movedChildren, detachedScripts };
}

function createStoryScript(ctx, data) {
  ensureStoryCardData(ctx);
  const scripts = getStoryScripts(ctx);
  const now = nowIso();
  const script = {
    id: resolveStoryScriptId(ctx, data?.id, ''),
    nodeId: String(data?.nodeId || '').trim(),
    name: String(data?.name || '').trim() || '未命名事件',
    trigger: String(data?.trigger || '').trim(),
    description: String(data?.description || '').trim(),
    content: String(data?.content || ''),
    createdAt: now,
    updatedAt: now,
  };
  scripts.push(script);
  saveStoryData(ctx);
  return script;
}

function updateStoryScript(ctx, id, data) {
  ensureStoryCardData(ctx);
  const script = getStoryScriptById(ctx, id);
  if (!script) return null;
  if (data && typeof data === 'object') {
    if (data.id !== undefined && String(data.id).trim() !== script.id) {
      script.id = resolveStoryScriptId(ctx, data.id, id);
    }
    if (data.name !== undefined) script.name = String(data.name).trim() || script.name;
    if (data.trigger !== undefined) script.trigger = String(data.trigger).trim();
    if (data.description !== undefined) script.description = String(data.description).trim();
    if (data.content !== undefined) script.content = String(data.content);
    if (data.nodeId !== undefined) script.nodeId = String(data.nodeId).trim();
  }
  script.updatedAt = nowIso();
  saveStoryData(ctx);
  return script;
}

function deleteStoryScript(ctx, id) {
  ensureStoryCardData(ctx);
  const scripts = getStoryScripts(ctx);
  const index = scripts.findIndex((script) => script.id === id);
  if (index < 0) return false;
  scripts.splice(index, 1);
  saveStoryData(ctx);
  return true;
}

// ---------- 轻量 YAML（本项目所需子集）----------
// 支持：映射 / 列表 / 普通与引号标量 / 块文本（|、|-）/ 注释 / --- 文档标记。
// 高级特性（锚点、多文档、流式集合内嵌等）不支持，导入时会给出可读报错。
function yamlIndentOf(line) {
  const match = /^\s*/.exec(line);
  return match ? match[0].length : 0;
}

function stripYamlComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quote) {
      if (ch === quote && line[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '#' && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}

function isYamlBlank(line) {
  return stripYamlComment(line).trim() === '';
}

function isYamlDocMarker(line) {
  const trimmed = String(line).trim();
  return trimmed === '---' || trimmed === '...';
}

function parseYamlScalarToken(token) {
  if (token === '' || token === 'null' || token === '~') return null;
  if (token === 'true') return true;
  if (token === 'false') return false;
  if (token === '[]') return [];
  if (token === '{}') return {};
  if (/^0\d+$/.test(token)) return token; // 保留前导零（如事件 id 001）
  if (/^-?\d+(\.\d+)?$/.test(token)) {
    const num = Number(token);
    if (Number.isFinite(num)) return num;
  }
  if (token.startsWith('"')) {
    const match = /^"([\s\S]*)"$/.exec(token);
    if (match) {
      try {
        return JSON.parse(`"${match[1]}"`);
      } catch {}
      return match[1].replace(/\\"/g, '"');
    }
    return token.slice(1);
  }
  if (token.startsWith("'")) {
    const match = /^'([\s\S]*)'$/.exec(token);
    if (match) return match[1].replace(/''/g, "'");
    return token.slice(1);
  }
  return token;
}

// 块文本：读取所有比键行缩进更深的行（| 保留末尾换行，|- 去除）。
function readYamlBlockScalar(state, keyIndent) {
  const { lines } = state;
  const collected = [];
  let contentIndent = null;
  while (state.index < lines.length) {
    const line = lines[state.index];
    if (line.trim() === '') {
      if (contentIndent !== null) collected.push('');
      state.index += 1;
      continue;
    }
    const indent = yamlIndentOf(line);
    if (indent <= keyIndent) break;
    if (contentIndent === null) contentIndent = indent;
    collected.push(line.slice(contentIndent));
    state.index += 1;
  }
  while (collected.length > 0 && collected[collected.length - 1] === '') collected.pop();
  return collected.join('\n');
}

function parseYamlNode(state, minIndent) {
  const { lines } = state;
  while (state.index < lines.length) {
    const line = lines[state.index];
    if (isYamlBlank(line)) {
      state.index += 1;
      continue;
    }
    if (isYamlDocMarker(line)) {
      state.index += 1;
      continue;
    }
    const indent = yamlIndentOf(line);
    if (indent < minIndent) return null;
    if (indent > minIndent) throw new Error(`YAML 缩进异常（第 ${state.index + 1} 行）`);
    const content = stripYamlComment(line).trim();
    if (content === '-' || /^-\s/.test(content)) {
      throw new Error(`意外的列表项（第 ${state.index + 1} 行）`);
    }
    const keyMatch = /^([^:]+?):\s*(.*)$/.exec(content);
    if (!keyMatch) throw new Error(`无法解析的 YAML 行（第 ${state.index + 1} 行）：${content}`);
    const key = keyMatch[1].trim();
    const rest = keyMatch[2].trim();
    state.index += 1;

    if (rest === '|' || rest === '|-') {
      const body = readYamlBlockScalar(state, indent);
      return { key, value: rest === '|' ? `${body}\n` : body };
    }
    if (rest === '') {
      while (state.index < lines.length && isYamlBlank(lines[state.index])) state.index += 1;
      if (state.index >= lines.length) return { key, value: null };
      const nestedIndent = yamlIndentOf(lines[state.index]);
      if (nestedIndent <= indent) return { key, value: null };
      const nestedContent = stripYamlComment(lines[state.index]).trim();
      if (nestedContent === '[]' || nestedContent === '{}') {
        state.index += 1;
        return { key, value: parseYamlScalarToken(nestedContent) };
      }
      if (nestedContent === '-' || /^-\s/.test(nestedContent)) {
        return { key, value: parseYamlList(state, nestedIndent) };
      }
      return { key, value: parseYamlMap(state, nestedIndent) };
    }
    return { key, value: parseYamlScalarToken(rest) };
  }
  return null;
}

function parseYamlMap(state, minIndent) {
  const map = {};
  for (;;) {
    const node = parseYamlNode(state, minIndent);
    if (!node) break;
    map[node.key] = node.value;
  }
  return map;
}

function parseYamlList(state, minIndent) {
  const { lines } = state;
  const list = [];
  while (state.index < lines.length) {
    const line = lines[state.index];
    if (isYamlBlank(line)) {
      state.index += 1;
      continue;
    }
    if (isYamlDocMarker(line)) {
      state.index += 1;
      continue;
    }
    const indent = yamlIndentOf(line);
    if (indent < minIndent) break;
    if (indent > minIndent) throw new Error(`YAML 缩进异常（第 ${state.index + 1} 行）`);
    const content = stripYamlComment(line).trim();
    const listMatch = /^-\s*(.*)$/.exec(content);
    if (!listMatch) break;
    const rest = listMatch[1].trim();
    state.index += 1;

    if (rest === '') {
      while (state.index < lines.length && isYamlBlank(lines[state.index])) state.index += 1;
      if (state.index >= lines.length) {
        list.push(null);
        continue;
      }
      const nestedIndent = yamlIndentOf(lines[state.index]);
      if (nestedIndent <= indent) {
        list.push(null);
        continue;
      }
      const nestedContent = stripYamlComment(lines[state.index]).trim();
      if (nestedContent === '-' || /^-\s/.test(nestedContent)) list.push(parseYamlList(state, nestedIndent));
      else list.push(parseYamlMap(state, nestedIndent));
      continue;
    }

    const keyMatch = /^([^:]+?):\s*(.*)$/.exec(rest);
    if (keyMatch) {
      const item = {};
      const key = keyMatch[1].trim();
      const itemRest = keyMatch[2].trim();
      if (itemRest === '|' || itemRest === '|-') {
        const body = readYamlBlockScalar(state, indent);
        item[key] = itemRest === '|' ? `${body}\n` : body;
      } else if (itemRest === '') {
        while (state.index < lines.length && isYamlBlank(lines[state.index])) state.index += 1;
        let nestedIndent = null;
        if (state.index < lines.length && yamlIndentOf(lines[state.index]) > indent) {
          nestedIndent = yamlIndentOf(lines[state.index]);
        }
        if (nestedIndent === null) {
          item[key] = null;
        } else {
          const nestedContent = stripYamlComment(lines[state.index]).trim();
          if (nestedContent === '-' || /^-\s/.test(nestedContent)) item[key] = parseYamlList(state, nestedIndent);
          else item[key] = parseYamlMap(state, nestedIndent);
        }
      } else {
        item[key] = parseYamlScalarToken(itemRest);
      }
      // 该地图项后续的键：缩进取下一非空行（若比破折号深）
      let itemIndent = indent + 2;
      while (state.index < lines.length && isYamlBlank(lines[state.index])) state.index += 1;
      if (state.index < lines.length && yamlIndentOf(lines[state.index]) > indent) {
        itemIndent = yamlIndentOf(lines[state.index]);
      }
      if (itemIndent > indent) {
        for (;;) {
          const node = parseYamlNode(state, itemIndent);
          if (!node) break;
          item[node.key] = node.value;
        }
      }
      list.push(item);
      continue;
    }

    list.push(parseYamlScalarToken(rest));
  }
  return list;
}

function parseYamlSubset(text) {
  const state = {
    index: 0,
    lines: String(text || '').replace(/\r\n?/g, '\n').split('\n'),
  };
  while (
    state.index < state.lines.length
    && (isYamlBlank(state.lines[state.index]) || isYamlDocMarker(state.lines[state.index]))
  ) {
    state.index += 1;
  }
  if (state.index >= state.lines.length) return {};
  const firstContent = stripYamlComment(state.lines[state.index]).trim();
  if (firstContent === '-' || /^-\s/.test(firstContent)) {
    return parseYamlList(state, yamlIndentOf(state.lines[state.index]));
  }
  const map = parseYamlMap(state, 0);
  return map && typeof map === 'object' && !Array.isArray(map) ? map : {};
}

// ---------- YAML 输出 ----------
function yamlScalar(value) {
  const str = String(value ?? '');
  if (str === '') return '""';
  if (/[\n\r]/.test(str)) return JSON.stringify(str);
  if (/^-?\d+(\.\d+)?$/.test(str) || /^(true|false|null|~)$/.test(str)) return JSON.stringify(str);
  if (/^[\s#]|[\s#]$/.test(str) || /:\s/.test(str) || /^[-?:,\[\]{}&*!|>'"%@`]/.test(str)) {
    return JSON.stringify(str);
  }
  return str;
}

function yamlBlockScalarText(content, baseIndent = '') {
  const normalized = String(content ?? '').replace(/\r\n?/g, '\n').replace(/\n+$/, '');
  if (normalized === '') return '""';
  const indented = normalized.split('\n').map((line) => (line === '' ? baseIndent : `${baseIndent}  ${line}`)).join('\n');
  return `|-\n${indented}`;
}

// 整包导出：nodes + scripts（脚本内嵌为 name / trigger / description / content 字段）。
// 自描述头部：format 标记固定输出，character 只写当前绑定的角色卡名（群聊/未选角色省略）。
function serializeStoryBundle(ctx) {
  const nodes = getStoryNodes(ctx);
  const scripts = getStoryScripts(ctx);
  const character = ctx ? getStoryCharacter(ctx) : null;
  const characterName = character ? String(character.name || character.avatar || '').trim() : '';
  const lines = [];
  lines.push('# 万华镜（Kaleidoscope）剧情脉络导出');
  lines.push('# 在「剧情脉络 → 导入 剧情脉络」中可重新导入：合并（同 id 更新、其余追加）或覆盖（清空后整体替换）。');
  lines.push(`format: ${STORY_BUNDLE_FORMAT}`);
  lines.push(`version: ${STORY_BUNDLE_VERSION}`);
  if (characterName) {
    lines.push(`character: ${yamlScalar(characterName)}`);
  }
  if (nodes.length === 0) {
    lines.push('nodes: []');
  } else {
    lines.push('nodes:');
    for (const node of nodes) {
      lines.push(`  - id: ${yamlScalar(node.id)}`);
      lines.push(`    parentId: ${yamlScalar(node.parentId || '')}`);
      lines.push(`    name: ${yamlScalar(node.name)}`);
      lines.push(`    description: ${yamlScalar(node.description || '')}`);
      lines.push(`    enabled: ${node.enabled === false ? 'false' : 'true'}`);
    }
  }
  if (scripts.length === 0) {
    lines.push('scripts: []');
  } else {
    lines.push('scripts:');
    for (const script of scripts) {
      lines.push(`  - id: ${yamlScalar(script.id)}`);
      lines.push(`    nodeId: ${yamlScalar(script.nodeId || '')}`);
      lines.push(`    name: ${yamlScalar(script.name)}`);
      lines.push(`    trigger: ${yamlScalar(script.trigger || '')}`);
      lines.push(`    description: ${yamlScalar(script.description || '')}`);
      lines.push(`    content: ${yamlBlockScalarText(script.content, '    ')}`);
    }
  }
  return `${lines.join('\n')}\n`;
}

// 整包导出文件名：绑定角色卡 → 「剧情脉络: 角色卡名.yaml」；
// 群聊 / 未选角色时回退时间戳名（万华镜-剧情脉络-时间戳.yaml）。
function buildStoryBundleFilename(ctx) {
  const character = ctx ? getStoryCharacter(ctx) : null;
  const name = character ? String(character.name || character.avatar || '').trim() : '';
  if (name) return `${STORY_CARD_BUNDLE_FILENAME_PREFIX}${sanitizeStoryFilename(name)}.yaml`;
  return `${STORY_BUNDLE_FILENAME_PREFIX}-${storyTimestamp()}.yaml`;
}

// 单事件导出：遵循 frontmatter 格式（name / id / Trigger / description + 正文）。
function serializeSingleScript(script) {
  const lines = [];
  lines.push('---');
  lines.push(`name: ${yamlScalar(script?.name)}`);
  lines.push(`id: ${yamlScalar(script?.id || '')}`);
  lines.push(`Trigger: ${yamlScalar(script?.trigger || '')}`);
  lines.push(`description: ${yamlScalar(script?.description || '')}`);
  lines.push('---');
  lines.push(String(script?.content || '').replace(/\n+$/, ''));
  return `${lines.join('\n')}\n`;
}

// 单事件文件解析：--- 开头 frontmatter + 正文。
function parseSingleScriptFile(text) {
  const source = String(text || '').replace(/\r\n?/g, '\n');
  const lines = source.split('\n');
  if ((lines[0] || '').trim() !== '---') {
    throw new Error('事件文件必须以 --- 开头（YAML frontmatter 格式）');
  }
  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      endIndex = i;
      break;
    }
  }
  if (endIndex < 0) throw new Error('事件文件缺少结尾的 --- 分隔线');
  const meta = parseYamlSubset(lines.slice(1, endIndex).join('\n'));
  const content = lines.slice(endIndex + 1).join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
  const name = String(meta?.name ?? '').trim();
  if (!name) throw new Error('事件 frontmatter 缺少 name 字段');
  return {
    id: String(meta?.id ?? '').trim(),
    name,
    trigger: String(meta?.Trigger ?? meta?.trigger ?? '').trim(),
    description: String(meta?.description ?? '').trim(),
    content,
  };
}

// 整包文件解析：凭 format 标记或 nodes / scripts 段识别（兼容旧版导出）。
function parseStoryBundleFile(text) {
  const data = parseYamlSubset(text);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('无法识别剧情脉络 YAML 格式');
  }
  const hasSections = data.nodes != null || data.scripts != null;
  const hasMarker = String(data.format || '').trim() === STORY_BUNDLE_FORMAT;
  if (!hasSections && !hasMarker) {
    throw new Error('未找到 nodes / scripts 段，无法作为剧情脉络包导入');
  }
  return {
    character: String(data.character ?? '').trim(),
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    scripts: Array.isArray(data.scripts) ? data.scripts : [],
  };
}

// 导入：默认合并（同 id 更新、其余追加）；options.replace 为覆盖模式（清空现有内容后整体替换）。
// 脚本引用的节点不存在时转为「未分类」。
function mergeStoryBundleInto(ctx, bundle, options) {
  ensureStoryCardData(ctx);
  const nodes = getStoryNodes(ctx);
  const scripts = getStoryScripts(ctx);
  if (options?.replace) {
    nodes.length = 0;
    scripts.length = 0;
  }
  const now = nowIso();
  const stats = { addedNodes: 0, updatedNodes: 0, addedScripts: 0, updatedScripts: 0 };

  const imported = new Map(); // id -> { raw, node }
  for (const raw of bundle.nodes || []) {
    if (!raw || typeof raw !== 'object') continue;
    const id = String(raw.id || '').trim() || genStoryId('n');
    const existing = nodes.find((node) => node.id === id);
    let node;
    if (existing) {
      existing.name = String(raw.name ?? '').trim() || existing.name;
      existing.description = String(raw.description ?? existing.description ?? '').trim();
      // 导入文件未写 enabled 时按「默认启用」处理（文件对启停状态有最终决定权）
      existing.enabled = typeof raw.enabled === 'boolean' ? raw.enabled : true;
      existing.updatedAt = now;
      node = existing;
      stats.updatedNodes += 1;
    } else {
      node = {
        id,
        name: String(raw.name || '').trim() || '未命名节点',
        description: String(raw.description || '').trim(),
        enabled: typeof raw.enabled === 'boolean' ? raw.enabled : true,
        createdAt: now,
        updatedAt: now,
      };
      nodes.push(node);
      stats.addedNodes += 1;
    }
    imported.set(id, node);
  }

  // 导入集内的成环检测：沿 parentId 链走，若回到自身则视为无效父级。
  function leadsBackTo(map, candidateParentId, nodeId) {
    let current = candidateParentId;
    let guard = 0;
    while (current && map.has(current) && guard < 1000) {
      if (current === nodeId) return true;
      current = String(map.get(current).parentId || '');
      guard += 1;
    }
    return false;
  }

  for (const raw of bundle.nodes || []) {
    if (!raw || typeof raw !== 'object') continue;
    const id = String(raw.id || '').trim();
    const node = imported.get(id);
    if (!node) continue;
    const candidate = String(raw.parentId || '').trim();
    if (
      candidate
      && candidate !== id
      && (imported.has(candidate) || nodes.some((existing) => existing.id === candidate))
      && !leadsBackTo(imported, candidate, id)
      && !isStoryNodeAncestor(ctx, id, candidate)
    ) {
      node.parentId = candidate;
    } else {
      node.parentId = '';
    }
  }

  for (const raw of bundle.scripts || []) {
    if (!raw || typeof raw !== 'object') continue;
    const id = String(raw.id || '').trim() || genStoryId('s');
    const existing = scripts.find((script) => script.id === id);
    const nodeId = String(raw.nodeId || '').trim();
    const resolvedNodeId = nodeId && nodes.some((node) => node.id === nodeId) ? nodeId : '';
    const data = {
      name: String(raw.name || '').trim() || '未命名事件',
      trigger: String(raw.trigger ?? '').trim(),
      description: String(raw.description ?? '').trim(),
      content: String(raw.content ?? ''),
      nodeId: resolvedNodeId,
    };
    if (existing) {
      Object.assign(existing, data, { updatedAt: now });
      stats.updatedScripts += 1;
    } else {
      scripts.push({ id, ...data, createdAt: now, updatedAt: now });
      stats.addedScripts += 1;
    }
  }

  saveStoryData(ctx);
  return stats;
}

// ---------- 文件读写 ----------
function readTextFile(file) {
  if (typeof file?.text === 'function') {
    return Promise.resolve(file.text());
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('读取文件失败'));
    reader.readAsText(file, 'utf-8');
  });
}

function downloadTextFile(filename, text) {
  try {
    const blob = new Blob([String(text ?? '')], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] 下载文件失败`, error);
    return false;
  }
}


// ===== js/story-gate.js =====
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


// ===== js/views-story.js =====
// ===== 万华镜（Kaleidoscope）剧情脉络可视化工作台 UI =====
let storyEditorMode = null;      // 'node' | 'script'
let storyEditorId = null;        // 正在编辑的条目 id（null = 新建）
let storyEditorPresetParentId = ''; // 新建子节点时预设的上级
let storyEditorPresetNodeId = '';   // 新建事件时预设的所属节点
let storyPendingScript = null;   // 导入单事件后待确认的数据
let storyExpanded = new Set();   // 已展开的节点 id
let storyImportTargetNodeId = '';  // 节点行「导入事件」的目标节点
let storyEditorSession = 0;        // 编辑器会话号：异步导入完成后若会话已变则放弃接管
let storyAddMenuContext = null;   // 「＋」菜单上下文：{ root: true } 或 { nodeId }
let storyImportModeResolve = null;  // 导入方式选择浮层的回调（resolve 'merge' | 'replace' | null）

function storyToastr(kind, message) {
  try {
    const fn = globalThis.toastr?.[kind];
    if (typeof fn === 'function') fn(message, `[${MODULE_DISPLAY_NAME}]`);
  } catch {}
}

function setStoryInputValue(id, value) {
  const node = document.getElementById(id);
  if (node) node.value = value ?? '';
}

function getStoryWorkbench() {
  return document.getElementById(STORY_DIALOG_ID);
}

function isStoryWorkbenchOpen() {
  const dialog = getStoryWorkbench();
  return Boolean(dialog && dialog.classList.contains('is-open'));
}

function buildStoryEmpty(text) {
  const empty = document.createElement('div');
  empty.className = 'kaleido-story__empty';
  empty.textContent = text;
  return empty;
}

// ---------- 打开 / 关闭工作台 ----------
function openStoryWorkbench() {
  const dialog = getStoryWorkbench();
  if (!dialog) return;
  closeStoryEditor();
  dialog.classList.add('is-open');
  dialog.setAttribute('aria-hidden', 'false');
  renderStoryTree();
  refreshHomeStoryStatus();
  logApp('debug', '剧情脉络工作台已打开');
}

function closeStoryWorkbench() {
  const dialog = getStoryWorkbench();
  if (!dialog) return;
  closeStoryImportMode();
  closeStoryEditor();
  closeStoryAddMenu();
  dialog.classList.remove('is-open');
  dialog.setAttribute('aria-hidden', 'true');
  logApp('debug', '剧情脉络工作台已关闭');
}

// 工作台头部「角色卡绑定」徽标：已绑定 / 待绑定 / 未绑定角色。
function refreshStoryBindingStatus() {
  const badge = document.getElementById(STORY_BINDING_ID);
  if (!badge) return;
  const ctx = getContextSafe();
  const character = ctx ? getStoryCharacter(ctx) : null;
  if (!character) {
    badge.textContent = '未绑定角色';
    badge.dataset.state = 'idle';
    badge.title = '群聊或未选角色：剧情数据保存在全局设置，不随角色卡导入导出';
    return;
  }
  const name = String(character.name || character.avatar || '当前角色');
  const card = ctx ? getStoryCardData(ctx) : null;
  if (card) {
    badge.textContent = `已绑定 · ${name}`;
    badge.dataset.state = 'ok';
    badge.title = '剧情数据保存在角色卡中：导入/导出角色卡时自动携带';
  } else {
    badge.textContent = `待绑定 · ${name}`;
    badge.dataset.state = 'warn';
    badge.title = '当前角色卡还没有剧情数据：首次保存后自动写入角色卡';
  }
}

// ---------- 树状渲染 ----------
function renderStoryTree() {
  const body = document.getElementById(STORY_TREE_BODY_ID);
  if (!body) return;
  const ctx = getContextSafe();
  refreshStoryBindingStatus();
  body.innerHTML = '';
  const roots = ctx ? getStoryRootNodes(ctx).sort(byStoryCreatedAt) : [];
  if (roots.length === 0) {
    body.appendChild(buildStoryEmpty('还没有节点。点击上方「＋」新建节点或事件；\n节点可层层嵌套，事件可挂在任意节点下。'));
    return;
  }
  for (const root of roots) renderStoryNodeRows(body, ctx, root, 0);

  // 未分类事件（无节点 / 节点已不存在）
  const scripts = ctx ? getStoryScripts(ctx) : [];
  const unassigned = scripts
    .filter((script) => !String(script.nodeId || '') || !getStoryNodeById(ctx, script.nodeId))
    .sort(byStoryCreatedAt);
  if (unassigned.length > 0) {
    const group = document.createElement('div');
    group.className = 'kaleido-story__group';
    const title = document.createElement('span');
    title.className = 'kaleido-story__group-title';
    title.textContent = `未分类事件（${unassigned.length}）`;
    group.appendChild(title);
    for (const script of unassigned) group.appendChild(buildStoryScriptRow(script, 0));
    body.appendChild(group);
  }
}

function renderStoryNodeRows(container, ctx, node, depth) {
  const expanded = storyExpanded.has(node.id);
  const children = getStoryNodeChildren(ctx, node.id).sort(byStoryCreatedAt);
  const scripts = getStoryScripts(ctx)
    .filter((script) => script.nodeId === node.id)
    .sort(byStoryCreatedAt);
  container.appendChild(buildStoryNodeRow(node, depth, expanded, children.length + scripts.length));
  if (!expanded) return;
  for (const child of children) renderStoryNodeRows(container, ctx, child, depth + 1);
  for (const script of scripts) container.appendChild(buildStoryScriptRow(script, depth + 1));
}

function buildStoryNodeRow(node, depth, expanded, childCount) {
  const row = document.createElement('div');
  row.className = 'kaleido-story__row kaleido-story__row--node';
  row.dataset.id = node.id;
  row.style.setProperty('--depth', String(depth));
  const enabled = node.enabled !== false;
  row.innerHTML = `
    <button type="button" class="kaleido-story__chevron${childCount > 0 ? '' : ' is-empty'}" data-action="toggle" data-id="${escapeHtml(node.id)}" title="展开 / 收起" aria-label="展开 / 收起">
      <span class="${STORY_CHEVRON_ICON_CLASS}"></span>
    </button>
    <span class="kaleido-story__row-icon"><span class="${expanded ? STORY_NODE_OPEN_ICON_CLASS : STORY_NODE_ICON_CLASS}"></span></span>
    <span class="kaleido-story__row-name" title="${escapeHtml(node.description || node.name)}">${escapeHtml(node.name)}</span>
    <span class="kaleido-story__row-count">${childCount} 项</span>
    <button type="button" class="kaleido-story__switch${enabled ? '' : ' is-off'}" data-action="toggle-enabled" data-id="${escapeHtml(node.id)}" role="switch" aria-checked="${enabled}" title="${enabled ? '点击关闭：本节点及其子节点、事件不再参与剧情预筛' : '点击激活：本节点及其子节点、事件重新参与剧情预筛'}" aria-label="启用 / 关闭节点"><span class="kaleido-story__switch-thumb"></span></button>
    <span class="kaleido-story__row-actions">
      <button type="button" class="kaleido-story__icon-btn" data-action="add-menu" data-id="${escapeHtml(node.id)}" title="新建节点 / 事件" aria-label="新建节点 / 事件"><span class="${STORY_ADD_CHILD_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn" data-action="import-script" data-id="${escapeHtml(node.id)}" title="导入事件文件" aria-label="导入事件文件"><span class="${STORY_IMPORT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn" data-action="edit" data-id="${escapeHtml(node.id)}" title="编辑节点" aria-label="编辑节点"><span class="${STORY_EDIT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn kaleido-story__icon-btn--danger" data-action="delete" data-id="${escapeHtml(node.id)}" title="删除节点" aria-label="删除节点"><span class="${STORY_DELETE_ICON_CLASS}"></span></button>
    </span>
  `;
  if (expanded) row.classList.add('is-expanded');
  if (!enabled) row.classList.add('is-disabled');
  return row;
}

function buildStoryScriptRow(script, depth) {
  const row = document.createElement('div');
  row.className = 'kaleido-story__row kaleido-story__row--script';
  row.dataset.id = script.id;
  row.style.setProperty('--depth', String(depth));
  const ctx = getContextSafe();
  const node = script.nodeId ? getStoryNodeById(ctx, script.nodeId) : null;
  const badge = node ? escapeHtml(node.name) : '未分类';
  row.innerHTML = `
    <span class="kaleido-story__row-icon kaleido-story__row-icon--script"><span class="${STORY_SCRIPT_ICON_CLASS}"></span></span>
    <span class="kaleido-story__row-name" title="${escapeHtml(script.name)}">${escapeHtml(script.name)}</span>
    ${script.trigger ? `<span class="kaleido-story__row-trigger" title="${escapeHtml(script.trigger)}">${escapeHtml(script.trigger)}</span>` : ''}
    <span class="kaleido-story__row-badge">${badge}</span>
    <span class="kaleido-story__row-actions">
      <button type="button" class="kaleido-story__icon-btn" data-action="edit-script" data-id="${escapeHtml(script.id)}" title="编辑事件" aria-label="编辑事件"><span class="${STORY_EDIT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn" data-action="export-script" data-id="${escapeHtml(script.id)}" title="导出事件" aria-label="导出事件"><span class="${STORY_EXPORT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-story__icon-btn kaleido-story__icon-btn--danger" data-action="delete-script" data-id="${escapeHtml(script.id)}" title="删除事件" aria-label="删除事件"><span class="${STORY_DELETE_ICON_CLASS}"></span></button>
    </span>
  `;
  return row;
}

function storyToggleNode(id) {
  if (storyExpanded.has(id)) storyExpanded.delete(id);
  else storyExpanded.add(id);
  renderStoryTree();
}

// ---------- 「＋」新建菜单 ----------
function openStoryAddMenu(anchor, context) {
  const menu = document.getElementById(STORY_ADD_MENU_ID);
  if (!menu) return;
  storyAddMenuContext = context || null;
  menu.hidden = false;
  const rect = anchor.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  let left = rect.left;
  let top = rect.bottom + 4;
  if (top + menuRect.height > window.innerHeight - 8) {
    top = Math.max(8, rect.top - menuRect.height - 4);
  }
  if (left + menuRect.width > window.innerWidth - 8) {
    left = Math.max(8, window.innerWidth - menuRect.width - 8);
  }
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function closeStoryAddMenu() {
  const menu = document.getElementById(STORY_ADD_MENU_ID);
  if (menu) menu.hidden = true;
  storyAddMenuContext = null;
}

function handleStoryAddMenuPick(kind) {
  const context = storyAddMenuContext || {};
  closeStoryAddMenu();
  if (kind === 'node') openStoryNodeEditor(null, context.nodeId || '');
  else if (kind === 'script') openStoryScriptEditor(null, context.nodeId || '', null);
}

// ---------- 编辑器 ----------
function populateStoryNodeParentSelect(currentId, selectedParentId) {
  const select = document.getElementById(STORY_NODE_PARENT_ID);
  if (!select) return;
  const ctx = getContextSafe();
  const nodes = ctx ? getStoryNodes(ctx) : [];
  select.innerHTML = '';
  const top = document.createElement('option');
  top.value = '';
  top.textContent = '（顶层 · 根节点）';
  select.appendChild(top);
  for (const node of nodes) {
    if (node.id === currentId) continue;
    if (currentId && isStoryNodeAncestor(ctx, currentId, node.id)) continue; // 不能挂到自己的后代下
    const option = document.createElement('option');
    option.value = node.id;
    option.textContent = node.name;
    select.appendChild(option);
  }
  // 只认显式预设，避免沿用上一次会话的旧值导致误挂父级
  select.value = nodes.some((node) => node.id === selectedParentId) ? selectedParentId : '';
}

function populateStoryScriptNodeSelect(selectedNodeId) {
  const select = document.getElementById(STORY_SCRIPT_NODE_SELECT_ID);
  if (!select) return;
  const ctx = getContextSafe();
  const nodes = ctx ? getStoryNodes(ctx) : [];
  select.innerHTML = '';
  const unassigned = document.createElement('option');
  unassigned.value = '';
  unassigned.textContent = '未分类';
  select.appendChild(unassigned);
  for (const node of nodes) {
    const option = document.createElement('option');
    option.value = node.id;
    option.textContent = node.name;
    select.appendChild(option);
  }
  // 只认显式预设（含未分类），避免沿用上一次会话的旧值导致事件误归属
  select.value = nodes.some((node) => node.id === selectedNodeId) ? selectedNodeId : '';
}

function openStoryNodeEditor(item, presetParentId) {
  const editor = document.getElementById(STORY_EDITOR_ID);
  if (!editor) return;
  storyEditorSession += 1;
  storyEditorMode = 'node';
  storyEditorId = item && item.id ? item.id : null;
  storyEditorPresetParentId = item ? String(item.parentId || '') : String(presetParentId || '');
  storyEditorPresetNodeId = '';
  storyPendingScript = null;
  editor.hidden = false;
  setStoryEditorMode('node');
  setStoryInputValue(STORY_NODE_NAME_ID, item?.name || '');
  setStoryInputValue(STORY_NODE_DESC_ID, item?.description || '');
  populateStoryNodeParentSelect(storyEditorId, storyEditorPresetParentId);
}

function openStoryScriptEditor(item, presetNodeId, pending) {
  const editor = document.getElementById(STORY_EDITOR_ID);
  if (!editor) return;
  storyEditorSession += 1;
  storyEditorMode = 'script';
  storyEditorId = item && item.id ? item.id : null;
  storyEditorPresetParentId = '';
  storyEditorPresetNodeId = String(presetNodeId || '');
  storyPendingScript = pending && typeof pending === 'object' ? { ...pending } : null;
  editor.hidden = false;
  setStoryEditorMode('script');
  const data = storyPendingScript || item || {};
  const scriptCtx = getContextSafe();
  const defaultId = scriptCtx ? nextStoryScriptId(scriptCtx, storyEditorId || '') : '';
  setStoryInputValue(STORY_SCRIPT_ID_ID, String(data.id || '').trim() || defaultId);
  setStoryInputValue(STORY_SCRIPT_NAME_ID, data.name || '');
  setStoryInputValue(STORY_SCRIPT_TRIGGER_ID, data.trigger || '');
  setStoryInputValue(STORY_SCRIPT_DESC_ID, data.description || '');
  setStoryInputValue(STORY_SCRIPT_CONTENT_ID, data.content || '');
  populateStoryScriptNodeSelect(storyEditorPresetNodeId || data.nodeId || '');
}

function setStoryEditorMode(mode) {
  const title = document.getElementById(STORY_EDITOR_TITLE_ID);
  const nodeFields = document.getElementById(STORY_NODE_FIELDS_ID);
  const scriptFields = document.getElementById(STORY_SCRIPT_FIELDS_ID);
  const exportBtn = document.getElementById(STORY_EDITOR_EXPORT_ID);
  const saveBtn = document.getElementById(STORY_EDITOR_SAVE_ID);
  if (!title || !nodeFields || !scriptFields || !exportBtn || !saveBtn) return;
  if (mode === 'node') {
    nodeFields.hidden = false;
    scriptFields.hidden = true;
    exportBtn.hidden = true;
    title.textContent = storyEditorId ? '编辑节点' : (storyEditorPresetParentId ? '添加子节点' : '新建节点');
    saveBtn.textContent = '保存';
  } else {
    nodeFields.hidden = true;
    scriptFields.hidden = false;
    exportBtn.hidden = false;
    title.textContent = storyEditorId ? '编辑事件' : '新建事件';
    saveBtn.textContent = storyPendingScript ? '保存（导入）' : '保存';
  }
}

function closeStoryEditor() {
  const editor = document.getElementById(STORY_EDITOR_ID);
  if (editor) editor.hidden = true;
  storyEditorSession += 1;
  storyEditorMode = null;
  storyEditorId = null;
  storyEditorPresetParentId = '';
  storyEditorPresetNodeId = '';
  storyPendingScript = null;
}

function readStoryScriptForm() {
  return {
    id: String(document.getElementById(STORY_SCRIPT_ID_ID)?.value || '').trim(),
    name: String(document.getElementById(STORY_SCRIPT_NAME_ID)?.value || '').trim(),
    trigger: String(document.getElementById(STORY_SCRIPT_TRIGGER_ID)?.value || '').trim(),
    description: String(document.getElementById(STORY_SCRIPT_DESC_ID)?.value || '').trim(),
    content: String(document.getElementById(STORY_SCRIPT_CONTENT_ID)?.value || ''),
    nodeId: String(document.getElementById(STORY_SCRIPT_NODE_SELECT_ID)?.value || '').trim(),
  };
}

function saveStoryEditor() {
  const ctx = getContextSafe();
  if (!ctx) return;
  // 以当前可见的表单为准（而不是内部模式标记），避免异步导入等场景
  // 出现「界面是节点表单、保存却按事件校验」的错位。
  const nodeFields = document.getElementById(STORY_NODE_FIELDS_ID);
  const scriptFields = document.getElementById(STORY_SCRIPT_FIELDS_ID);
  const nodeVisible = Boolean(nodeFields && !nodeFields.hidden);
  const scriptVisible = Boolean(scriptFields && !scriptFields.hidden);
  if (nodeVisible && !scriptVisible) {
    const name = String(document.getElementById(STORY_NODE_NAME_ID)?.value || '').trim();
    if (!name) {
      storyToastr('warning', '请填写节点名称');
      return;
    }
    const parentId = String(document.getElementById(STORY_NODE_PARENT_ID)?.value || '').trim();
    const data = {
      name,
      parentId,
      description: String(document.getElementById(STORY_NODE_DESC_ID)?.value || '').trim(),
    };
    if (storyEditorId) updateStoryNode(ctx, storyEditorId, data);
    else createStoryNode(ctx, data);
    logApp('info', storyEditorId ? '节点已更新' : '节点已添加', name);
    storyToastr('success', storyEditorId ? '节点已保存' : '节点已添加');
  } else if (scriptVisible && !nodeVisible) {
    const data = readStoryScriptForm();
    if (!data.name) {
      storyToastr('warning', '请填写事件名称');
      return;
    }
    if (!data.content.trim()) {
      storyToastr('warning', '事件内容不能为空');
      return;
    }
    const requestedId = String(data.id || '').trim();
    let saved;
    if (storyEditorId) {
      saved = updateStoryScript(ctx, storyEditorId, data);
    } else {
      saved = createStoryScript(ctx, data);
    }
    if (saved && String(saved.id || '').trim() !== requestedId) {
      storyToastr('info', `事件 ID 已自动设为 ${saved.id}`);
    }
    logApp('info', storyEditorId ? '事件已更新' : '事件已添加', data.name);
    storyToastr('success', storyEditorId ? '事件已保存' : '事件已添加');
  }
  closeStoryEditor();
  renderStoryTree();
  refreshHomeStoryStatus();
}

function handleStoryEditorExport() {
  if (storyEditorMode !== 'script') return;
  const data = readStoryScriptForm();
  if (!data.name) {
    storyToastr('warning', '请先填写事件名称再导出');
    return;
  }
  if (!data.content.trim()) {
    storyToastr('warning', '事件内容为空，无法导出');
    return;
  }
  const filename = `${STORY_SCRIPT_FILENAME_PREFIX}-${sanitizeStoryFilename(data.name)}.yaml`;
  if (downloadTextFile(filename, serializeSingleScript(data))) {
    storyToastr('success', `已导出事件：${filename}`);
  }
}

// ---------- 删除 ----------
function handleStoryDeleteNode(ctx, id) {
  const node = getStoryNodeById(ctx, id);
  if (!node) return;
  const children = getStoryNodeChildren(ctx, id);
  const scripts = getStoryScripts(ctx).filter((script) => script.nodeId === id);
  const parts = [];
  if (children.length > 0) parts.push(`${children.length} 个子节点将上移`);
  if (scripts.length > 0) parts.push(`${scripts.length} 个事件将转为未分类`);
  const suffix = parts.length > 0 ? `（${parts.join('，')}，均不会删除）` : '';
  if (!globalThis.confirm?.(`确定删除节点「${node.name}」？${suffix}`)) return;
  const result = deleteStoryNode(ctx, id);
  if (!result) return;
  renderStoryTree();
  refreshHomeStoryStatus();
  const message = [
    '节点已删除',
    result.movedChildren > 0 ? `${result.movedChildren} 个子节点已上移` : '',
    result.detachedScripts > 0 ? `${result.detachedScripts} 个事件已转为未分类` : '',
  ].filter(Boolean).join('，');
  storyToastr('success', message);
}

function handleStoryDeleteScript(ctx, id) {
  const script = getStoryScriptById(ctx, id);
  if (!script) return;
  if (!globalThis.confirm?.(`确定删除事件「${script.name}」？`)) return;
  deleteStoryScript(ctx, id);
  renderStoryTree();
  refreshHomeStoryStatus();
  storyToastr('success', '事件已删除');
}

// ---------- 导入 / 导出 ----------
async function handleStoryImportFile(file) {
  const session = storyEditorSession;
  let text;
  try {
    text = await readTextFile(file);
  } catch (error) {
    storyToastr('error', `读取文件失败：${String(error?.message || error)}`);
    return;
  }
  if (session !== storyEditorSession) {
    // 读取期间用户已打开/关闭了别的编辑器，放弃接管，避免把正在编辑的内容顶掉
    storyToastr('info', '已取消导入：编辑器状态已变化');
    return;
  }
  const trimmed = String(text).trimStart();
  if (trimmed.startsWith('---')) {
    // 单事件 frontmatter 文件：解析后打开编辑器待确认
    try {
      const script = parseSingleScriptFile(text);
      openStoryScriptEditor(null, storyImportTargetNodeId, script);
      storyImportTargetNodeId = '';
      storyToastr('info', '已读取事件 frontmatter，确认信息后点击保存');
    } catch (error) {
      storyToastr('error', `事件解析失败：${String(error?.message || error)}`);
    }
    return;
  }
  try {
    const bundle = parseStoryBundleFile(text);
    const ctx = getContextSafe();
    if (!ctx) return;
    const mode = await storyAskImportMode(bundle);
    if (!mode) {
      storyToastr('info', '已取消导入');
      return;
    }
    const stats = mergeStoryBundleInto(ctx, bundle, { replace: mode === 'replace' });
    renderStoryTree();
    refreshHomeStoryStatus();
    if (mode === 'replace') {
      storyToastr('success', `覆盖导入完成：已整体替换为 ${stats.addedNodes} 节点 / ${stats.addedScripts} 事件`);
    } else {
      storyToastr('success', `合并导入完成：新增 ${stats.addedNodes} 节点 / ${stats.addedScripts} 事件，更新 ${stats.updatedNodes} 节点 / ${stats.updatedScripts} 事件`);
    }
  } catch (error) {
    storyToastr('error', `导入失败：${String(error?.message || error)}`);
  }
}

// 导入方式选择浮层：整包导入前询问「合并 / 覆盖」，返回 'merge' | 'replace' | null（取消）。
function storyAskImportMode(bundle) {
  const overlay = document.getElementById(STORY_IMPORT_MODE_ID);
  if (!overlay) return Promise.resolve('merge');
  const desc = document.getElementById(STORY_IMPORT_MODE_DESC_ID);
  if (desc) {
    const source = bundle.character ? `（来自「${bundle.character}」）` : '';
    desc.textContent = `将导入 ${bundle.nodes.length} 个节点、${bundle.scripts.length} 个事件${source}。请选择处理方式：合并 = 同 id 更新、其余追加；覆盖 = 清空当前剧情脉络后整体替换。`;
  }
  overlay.hidden = false;
  return new Promise((resolve) => {
    storyImportModeResolve = (mode) => {
      storyImportModeResolve = null;
      overlay.hidden = true;
      resolve(mode);
    };
  });
}

// 结束导入方式选择：mode 为 null / 缺省时视为取消（工作台关闭时也会调用）。
function closeStoryImportMode(mode) {
  if (storyImportModeResolve) storyImportModeResolve(mode || null);
  storyImportModeResolve = null;
  const overlay = document.getElementById(STORY_IMPORT_MODE_ID);
  if (overlay) overlay.hidden = true;
}

function handleStoryExportBundle() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const text = serializeStoryBundle(ctx);
  const filename = buildStoryBundleFilename(ctx);
  if (downloadTextFile(filename, text)) {
    storyToastr('success', `已导出脉络包：${filename}`);
  }
}

function handleStoryExportScript(script) {
  const filename = `${STORY_SCRIPT_FILENAME_PREFIX}-${sanitizeStoryFilename(script?.name)}.yaml`;
  if (downloadTextFile(filename, serializeSingleScript(script))) {
    storyToastr('success', `已导出事件：${filename}`);
  }
}

// ---------- 初始化 ----------
function initStorySection() {
  if (getStoryWorkbench()) return;
  const dialog = document.createElement('div');
  dialog.id = STORY_DIALOG_ID;
  dialog.className = 'kaleido-story-dialog';
  dialog.setAttribute('aria-hidden', 'true');
  dialog.innerHTML = `
    <div class="kaleido-story-dialog__inner" role="dialog" aria-label="剧情脉络工作台">
      <div class="kaleido-story-dialog__header">
        <span class="kaleido-story-dialog__title"><span class="${STORY_ICON_CLASS}"></span> 剧情脉络</span>
        <span id="${STORY_BINDING_ID}" class="kaleido-story__binding" data-state="idle" title="剧情数据与角色卡绑定状态">未绑定角色</span>
        <div class="kaleido-story-dialog__toolbar">
          <button type="button" id="${STORY_IMPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini">导入 剧情脉络</button>
          <button type="button" id="${STORY_EXPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost">导出 剧情脉络</button>
          <button type="button" id="${STORY_CLOSE_BTN_ID}" class="kaleido-icon-btn" title="关闭工作台" aria-label="关闭工作台">✕</button>
        </div>
      </div>
      <div class="kaleido-story-dialog__body">
        <div id="${STORY_TREE_ID}" class="kaleido-story__tree">
          <div class="kaleido-story__tree-actions">
            <button type="button" id="${STORY_ROOT_ADD_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="新建节点或事件">＋ 新建</button>
            <span class="kaleido-story__tree-hint">节点可层层嵌套 · 事件挂在节点下</span>
          </div>
          <div id="${STORY_TREE_BODY_ID}" class="kaleido-story__tree-body"></div>
        </div>
        <div id="${STORY_EDITOR_ID}" class="kaleido-story-dialog__editor" hidden>
          <div class="kaleido-story__editor-head">
            <span id="${STORY_EDITOR_TITLE_ID}" class="kaleido-story__editor-title">新建节点</span>
            <span class="kaleido-story__editor-spacer"></span>
            <button type="button" id="${STORY_EDITOR_CANCEL_ID}" class="kaleido-icon-btn" title="取消" aria-label="取消">✕</button>
          </div>
          <div id="${STORY_NODE_FIELDS_ID}">
            <label class="kaleido-api__field" for="${STORY_NODE_NAME_ID}">
              <span class="kaleido-api__label">节点名称 *</span>
              <input id="${STORY_NODE_NAME_ID}" class="kaleido-input" type="text" placeholder="填写节点名称" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${STORY_NODE_PARENT_ID}">
              <span class="kaleido-api__label">上级节点</span>
              <select id="${STORY_NODE_PARENT_ID}" class="kaleido-input">
                <option value="">（顶层 · 根节点）</option>
              </select>
            </label>
            <label class="kaleido-api__field" for="${STORY_NODE_DESC_ID}">
              <span class="kaleido-api__label">节点说明</span>
              <textarea id="${STORY_NODE_DESC_ID}" class="kaleido-input kaleido-story__textarea kaleido-story__textarea--small" rows="3" placeholder="这个节点下的剧情大概讲什么（可选）"></textarea>
            </label>
          </div>
          <div id="${STORY_SCRIPT_FIELDS_ID}" hidden>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_NAME_ID}">
              <span class="kaleido-api__label">事件名称 *</span>
              <input id="${STORY_SCRIPT_NAME_ID}" class="kaleido-input" type="text" placeholder="填写事件名称" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_ID_ID}">
              <span class="kaleido-api__label">事件 ID *</span>
              <input id="${STORY_SCRIPT_ID_ID}" class="kaleido-input" type="text" placeholder="如：001（默认自动递增）" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_TRIGGER_ID}">
              <span class="kaleido-api__label">触发条件</span>
              <input id="${STORY_SCRIPT_TRIGGER_ID}" class="kaleido-input" type="text" placeholder="如：玩家第一次到达新手村" autocomplete="off" spellcheck="false" />
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_DESC_ID}">
              <span class="kaleido-api__label">事件说明</span>
              <textarea id="${STORY_SCRIPT_DESC_ID}" class="kaleido-input kaleido-story__textarea kaleido-story__textarea--small" rows="2" placeholder="这个事件的用途（可选）"></textarea>
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_NODE_SELECT_ID}">
              <span class="kaleido-api__label">所属节点</span>
              <select id="${STORY_SCRIPT_NODE_SELECT_ID}" class="kaleido-input">
                <option value="">未分类</option>
              </select>
            </label>
            <label class="kaleido-api__field" for="${STORY_SCRIPT_CONTENT_ID}">
              <span class="kaleido-api__label">事件内容 *</span>
              <textarea id="${STORY_SCRIPT_CONTENT_ID}" class="kaleido-input kaleido-story__textarea" rows="9" placeholder="{{事件正文}}" spellcheck="false"></textarea>
            </label>
          </div>
          <div class="kaleido-story__editor-actions">
            <button type="button" id="${STORY_EDITOR_EXPORT_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" hidden>导出事件</button>
            <span class="kaleido-story__editor-spacer"></span>
            <button type="button" id="${STORY_EDITOR_SAVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary">保存</button>
          </div>
        </div>
      </div>
      <div id="${STORY_IMPORT_MODE_ID}" class="kaleido-story__import-mode" hidden role="dialog" aria-label="选择导入方式">
        <div class="kaleido-story__import-mode-card">
          <div class="kaleido-story__import-mode-title">选择导入方式</div>
          <div id="${STORY_IMPORT_MODE_DESC_ID}" class="kaleido-story__import-mode-desc"></div>
          <div class="kaleido-story__import-mode-actions">
            <button type="button" id="${STORY_IMPORT_MODE_MERGE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="同 id 条目更新，其余追加">🔀 合并导入</button>
            <button type="button" id="${STORY_IMPORT_MODE_REPLACE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" title="清空当前剧情脉络后整体替换">📦 覆盖导入</button>
          </div>
        </div>
      </div>
      <div id="${STORY_ADD_MENU_ID}" class="kaleido-story__add-menu" hidden role="menu" aria-label="新建">
        <button type="button" id="${STORY_ADD_MENU_NODE_ID}" class="kaleido-story__add-menu-item" role="menuitem" data-kind="node">
          <span class="${STORY_NODE_ICON_CLASS}"></span> 新建节点
        </button>
        <button type="button" id="${STORY_ADD_MENU_SCRIPT_ID}" class="kaleido-story__add-menu-item" role="menuitem" data-kind="script">
          <span class="${STORY_SCRIPT_ICON_CLASS}"></span> 新建事件
        </button>
      </div>
      <input id="${STORY_IMPORT_INPUT_ID}" type="file" accept=".yaml,.yml,text/yaml,application/x-yaml" hidden />
      <input id="${STORY_IMPORT_SCRIPT_INPUT_ID}" type="file" accept=".yaml,.yml,text/yaml,application/x-yaml" hidden />
    </div>
  `;
  document.body.appendChild(dialog);

  document.getElementById(STORY_ROOT_ADD_ID)?.addEventListener('click', (event) => {
    openStoryAddMenu(event.currentTarget, { root: true });
  });
  document.getElementById(STORY_ADD_MENU_NODE_ID)?.addEventListener('click', () => handleStoryAddMenuPick('node'));
  document.getElementById(STORY_ADD_MENU_SCRIPT_ID)?.addEventListener('click', () => handleStoryAddMenuPick('script'));
  document.getElementById(STORY_CLOSE_BTN_ID)?.addEventListener('click', closeStoryWorkbench);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeStoryWorkbench();
  });

  document.getElementById(STORY_IMPORT_BTN_ID)?.addEventListener('click', () => {
    storyImportTargetNodeId = '';
    document.getElementById(STORY_IMPORT_INPUT_ID)?.click();
  });
  document.getElementById(STORY_IMPORT_INPUT_ID)?.addEventListener('change', (event) => {
    const file = event.target?.files?.[0];
    if (file) handleStoryImportFile(file);
    event.target.value = '';
  });
  document.getElementById(STORY_IMPORT_SCRIPT_INPUT_ID)?.addEventListener('change', (event) => {
    const file = event.target?.files?.[0];
    if (file) handleStoryImportFile(file);
    event.target.value = '';
  });
  document.getElementById(STORY_EXPORT_BTN_ID)?.addEventListener('click', handleStoryExportBundle);

  document.getElementById(STORY_IMPORT_MODE_MERGE_ID)?.addEventListener('click', () => closeStoryImportMode('merge'));
  document.getElementById(STORY_IMPORT_MODE_REPLACE_ID)?.addEventListener('click', () => closeStoryImportMode('replace'));
  document.getElementById(STORY_IMPORT_MODE_ID)?.addEventListener('click', (event) => {
    // 只认点击遮罩（卡片内部点击不取消）
    const overlay = document.getElementById(STORY_IMPORT_MODE_ID);
    if (event.target === overlay) closeStoryImportMode();
  });

  const treeBody = document.getElementById(STORY_TREE_BODY_ID);
  treeBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-action]') : null;
    if (!button) return;
    event.preventDefault();
    const id = String(button.dataset.id || '');
    const action = String(button.dataset.action || '');
    const ctx = getContextSafe();
    if (!ctx) return;
    switch (action) {
      case 'toggle': {
        storyToggleNode(id);
        break;
      }
      case 'toggle-enabled': {
        const node = toggleStoryNodeEnabled(ctx, id);
        if (node) {
          storyToastr('info', node.enabled === false
            ? `节点「${node.name}」已关闭：其子节点与事件不再参与剧情预筛`
            : `节点「${node.name}」已激活`);
        }
        renderStoryTree();
        refreshHomeStoryStatus();
        break;
      }
      case 'add-menu': {
        openStoryAddMenu(button, { nodeId: id });
        break;
      }
      case 'edit': {
        const node = getStoryNodeById(ctx, id);
        if (node) openStoryNodeEditor(node);
        break;
      }
      case 'delete': {
        handleStoryDeleteNode(ctx, id);
        break;
      }
      case 'import-script': {
        storyImportTargetNodeId = id;
        document.getElementById(STORY_IMPORT_SCRIPT_INPUT_ID)?.click();
        break;
      }
      case 'edit-script': {
        const script = getStoryScriptById(ctx, id);
        if (script) openStoryScriptEditor(script);
        break;
      }
      case 'export-script': {
        const script = getStoryScriptById(ctx, id);
        if (script) handleStoryExportScript(script);
        break;
      }
      case 'delete-script': {
        handleStoryDeleteScript(ctx, id);
        break;
      }
      default:
        break;
    }
  });

  // 双击已建立的节点 / 事件行：默认进入编辑（按钮、输入控件上保持原行为）
  treeBody?.addEventListener('dblclick', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('button, input, select, textarea, a')) return;
    const row = target.closest('.kaleido-story__row');
    if (!row) return;
    const ctx = getContextSafe();
    if (!ctx) return;
    const id = String(row.dataset.id || '');
    if (row.classList.contains('kaleido-story__row--node')) {
      const node = getStoryNodeById(ctx, id);
      if (node) openStoryNodeEditor(node);
    } else if (row.classList.contains('kaleido-story__row--script')) {
      const script = getStoryScriptById(ctx, id);
      if (script) openStoryScriptEditor(script);
    }
  });

  document.getElementById(STORY_EDITOR_CANCEL_ID)?.addEventListener('click', closeStoryEditor);
  document.getElementById(STORY_EDITOR_SAVE_ID)?.addEventListener('click', saveStoryEditor);
  document.getElementById(STORY_EDITOR_EXPORT_ID)?.addEventListener('click', handleStoryEditorExport);

  if (!globalThis[STORY_DIALOG_KEY]) {
    globalThis[STORY_DIALOG_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      if (isStoryWorkbenchOpen()) closeStoryWorkbench();
    };
    document.addEventListener('keydown', globalThis[STORY_DIALOG_KEY]);
  }
  if (!globalThis[STORY_ADD_MENU_KEY]) {
    globalThis[STORY_ADD_MENU_KEY] = (event) => {
      const menu = document.getElementById(STORY_ADD_MENU_ID);
      if (!menu || menu.hidden) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (menu.contains(target)) return;
      // 点「＋」按钮本身不算外部：按钮的 click 会负责打开/重定位菜单
      if (target.closest(`#${STORY_ROOT_ADD_ID}, [data-action="add-menu"]`)) return;
      closeStoryAddMenu();
    };
    document.addEventListener('click', globalThis[STORY_ADD_MENU_KEY]);
  }
}


// ===== js/main.js =====
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
  // 删消息后清空发送屏障旧轮：宿主（TauriTavern）删除消息会复用被删消息的 ID
  // （楼层序号式），旧轮签名与新发送相同会让剧情预筛被误判为「同一发送已处理」
  // 而整轮跳过（删两层楼后首条消息不预筛、第二条才恢复）；删除后必然是新发送，清掉旧轮即可。
  onHostEvent(ctx, 'messageDeleted', clearSendBarrierRound, '__kaleido_send_barrier_clear_on_delete__');
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

