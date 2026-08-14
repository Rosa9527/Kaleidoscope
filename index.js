// ===== js/constants.js =====
// ===== 万华镜（Kaleidoscope）全局常量 =====
const MODULE_NAME = 'Kaleidoscope';
const MODULE_DISPLAY_NAME = '万华镜';
const MODULE_VERSION = '1.0.7';
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
const VALUES_ICON_CLASS = 'fa-solid fa-gauge-high';
const VALUES_ADD_CHILD_ICON_CLASS = 'fa-solid fa-plus';
const VALUES_EDIT_ICON_CLASS = 'fa-solid fa-pen';
const VALUES_DELETE_ICON_CLASS = 'fa-solid fa-trash-can';
const VALUES_CHEVRON_ICON_CLASS = 'fa-solid fa-chevron-right';
const VALUES_DRAG_ICON_CLASS = 'fa-solid fa-grip-vertical';
const VALUES_EXPORT_ICON_CLASS = 'fa-solid fa-download';
const VALUES_IMPORT_ICON_CLASS = 'fa-solid fa-file-import';
const VALUES_SPARK_ICON_CLASS = 'fa-solid fa-wand-magic-sparkles';
const VALUES_TREE_ICON_CLASS = 'fa-solid fa-sitemap';
const VALUES_KEYS_ICON_CLASS = 'fa-solid fa-key';
const VALUES_LAYER_GAME_ICON_CLASS = 'fa-solid fa-gamepad';
const VALUES_LAYER_SWAP_ICON_CLASS = 'fa-solid fa-arrows-rotate';
const VALUES_LAYER_DEFAULT_ICON_CLASS = 'fa-solid fa-book-open';
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
// 注入实录 · 剧情触发（变量条件确定性触发）最近一轮
const INJECT_TRIGGER_SUMMARY_ID = 'kaleido-inject-trigger-summary';
const INJECT_TRIGGER_EVENTS_ID = 'kaleido-inject-trigger-events';
const INJECT_TRIGGER_TEXT_ID = 'kaleido-inject-trigger-text';

// 系统日志
const LOG_VIEW_ID = 'kaleido-log-view';
const HOME_LOG_CARD_ID = 'kaleido-home-log-card';
const HOME_LOG_STATUS_ID = 'kaleido-home-log-status';
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
// 变量自动维护（预设模版设置区）
const PRESET_VALUES_TOGGLE_ID = 'kaleido-preset-values-toggle';
const PRESET_VALUES_STATUS_ID = 'kaleido-preset-values-status';
// 剧情触发（预设模版设置区）
const PRESET_TRIGGER_TOGGLE_ID = 'kaleido-preset-trigger-toggle';
const PRESET_TRIGGER_STATUS_ID = 'kaleido-preset-trigger-status';

// 剧情脉络（Storyline）· 可视化工作台
const STORY_DIALOG_ID = 'kaleido-story-dialog';
const STORY_VIEW_ID = 'kaleido-story-view';
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
// ---------- 变量系统（键注册表 + 默认值 / 游戏值两层）----------
const VALUES_VIEW_ID = 'kaleido-values-view';
const VALUES_DIALOG_ID = 'kaleido-values-dialog';
const VALUES_DIALOG_KEY = '__kaleido_values_dialog_key__';
const VALUES_CLOSE_BTN_ID = 'kaleido-values-close-btn';
const HOME_VALUES_CARD_ID = 'kaleido-home-values-card';
const HOME_VALUES_STATUS_ID = 'kaleido-home-values-status';
const VALUES_IMPORT_BTN_ID = 'kaleido-values-import-btn';
const VALUES_IMPORT_INPUT_ID = 'kaleido-values-import-input';
const VALUES_EXPORT_BTN_ID = 'kaleido-values-export-btn';
const VALUES_TAB_TREE_ID = 'kaleido-values-tab-tree';
const VALUES_NAV_TREE_COUNT_ID = 'kaleido-values-nav-tree-count';
const VALUES_NAV_KEYS_COUNT_ID = 'kaleido-values-nav-keys-count';
const VALUES_NAV_COLLAPSE_ID = 'kaleido-values-nav-collapse';
const VALUES_NAV_EXPAND_ID = 'kaleido-values-nav-expand';
const VALUES_NAV_COLLAPSE_ICON_CLASS = 'fa-solid fa-chevron-left';
const VALUES_TAB_KEYS_ID = 'kaleido-values-tab-keys';
const VALUES_TREE_PANE_ID = 'kaleido-values-tree-pane';
const VALUES_KEYS_PANE_ID = 'kaleido-values-keys-pane';
const VALUES_BINDING_ID = 'kaleido-values-binding';
const VALUES_LAYER_ROW_ID = 'kaleido-values-layer-row';
const VALUES_LAYER_TOGGLE_ID = 'kaleido-values-layer-toggle';
const VALUES_LAYER_ICON_ID = 'kaleido-values-layer-icon';
const VALUES_LAYER_TITLE_ID = 'kaleido-values-layer-title';
const VALUES_LAYER_DEFAULT_ID = 'kaleido-values-layer-default';
const VALUES_LAYER_GAME_ID = 'kaleido-values-layer-game';
const VALUES_MAINTAIN_STATUS_ID = 'kaleido-values-maintain-status';
const VALUES_MAINTAIN_NOW_ID = 'kaleido-values-maintain-now';
const VALUES_RESET_GAME_ID = 'kaleido-values-reset-game';
const VALUES_DEFAULT_HINT_ID = 'kaleido-values-default-hint';
const VALUES_TREE_ID = 'kaleido-values-tree';
const VALUES_TREE_BODY_ID = 'kaleido-values-tree-body';
const VALUES_ADD_ROOT_ID = 'kaleido-values-add-root';
const VALUES_KEYS_BODY_ID = 'kaleido-values-keys-body';
const VALUES_ADD_KEY_ID = 'kaleido-values-add-key';
const VALUES_EDITOR_ID = 'kaleido-values-editor';
const VALUES_EDITOR_TITLE_ID = 'kaleido-values-editor-title';
const VALUES_EDITOR_NAME_ID = 'kaleido-values-editor-name';
const VALUES_EDITOR_KEY_SELECT_ID = 'kaleido-values-editor-key-select';
const VALUES_EDITOR_VALUE_ID = 'kaleido-values-editor-value';
const VALUES_EDITOR_VALUE_LABEL_ID = 'kaleido-values-editor-value-label';
const VALUES_EDITOR_SAVE_ID = 'kaleido-values-editor-save';
const VALUES_EDITOR_CANCEL_ID = 'kaleido-values-editor-cancel';
const VALUES_EDITOR_NODE_FIELDS_ID = 'kaleido-values-editor-node-fields';
const VALUES_EDITOR_KEY_FIELDS_ID = 'kaleido-values-editor-key-fields';
const VALUES_EDITOR_PARENT_SELECT_ID = 'kaleido-values-editor-parent-select';
const VALUES_EDITOR_KEY_NAME_ID = 'kaleido-values-editor-key-name';
const VALUES_ADD_MENU_ID = 'kaleido-values-add-menu';
const VALUES_ADD_MENU_NODE_ID = 'kaleido-values-add-menu-node';
const VALUES_ADD_MENU_KEY_ID = 'kaleido-values-add-menu-key';
const VALUES_KEY_EDITOR_ID = 'kaleido-values-key-editor';
const VALUES_KEY_EDITOR_TITLE_ID = 'kaleido-values-key-editor-title';
const VALUES_KEY_EDITOR_NAME_ID = 'kaleido-values-key-editor-name';
const VALUES_KEY_EDITOR_RULE_ID = 'kaleido-values-key-editor-rule';
const VALUES_KEY_EDITOR_SAVE_ID = 'kaleido-values-key-editor-save';
const VALUES_KEY_EDITOR_CANCEL_ID = 'kaleido-values-key-editor-cancel';
// 变量类型：父变量（AI 按变化规则维护）/ 子变量（按父变量值自动派生）。
const VALUES_KEY_TYPE_PARENT = 'parent';
const VALUES_KEY_TYPE_CHILD = 'child';
const VALUES_KEY_EDITOR_TYPE_ID = 'kaleido-values-key-editor-type';
const VALUES_KEY_EDITOR_PARENT_ID = 'kaleido-values-key-editor-parent';
const VALUES_KEY_EDITOR_CHILD_FIELDS_ID = 'kaleido-values-key-editor-child-fields';
const VALUES_KEY_EDITOR_RULE_FIELDS_ID = 'kaleido-values-key-editor-rule-fields';
const VALUES_KEY_EDITOR_RULES_ID = 'kaleido-values-key-editor-rules';
const VALUES_KEY_EDITOR_RULES_ADD_ID = 'kaleido-values-key-editor-rules-add';
const VALUES_KEY_EDITOR_RULE_ROW_CLASS = 'kaleido-values__key-rule-row';
const VALUES_KEY_EDITOR_RULE_MIN_CLASS = 'kaleido-values__key-rule-min';
const VALUES_KEY_EDITOR_RULE_MAX_CLASS = 'kaleido-values__key-rule-max';
const VALUES_KEY_EDITOR_RULE_VALUE_CLASS = 'kaleido-values__key-rule-value';
const VALUES_KEY_EDITOR_RULE_REMOVE_CLASS = 'kaleido-values__key-rule-remove';
const VALUES_EDITOR_CHILD_HINT_ID = 'kaleido-values-editor-child-hint';
// 变量 · 角色卡绑定（与剧情脉络同模式）：数据存角色卡 extensions，
// 随角色卡导入/导出自动携带；群聊/未选角色时回退全局设置 valuesData。
const VALUES_CARD_EXTENSION_KEY = 'kaleidoscope_values';
const VALUES_CARD_DATA_VERSION = 1;
const VALUES_CARD_SAVE_DEBOUNCE_MS = 500;
const VALUES_CARD_SAVE_TIMER_KEY = '__kaleido_values_card_save_timer__';
// 变量 · 聊天文件绑定：游戏值存 chatMetadata[kaleidoscope_values]，
// 随聊天文件（jsonl 首行 chat_metadata）保存 / 加载自动携带。
const VALUES_CHAT_KEY = 'kaleidoscope_values';
const VALUES_CHAT_SAVE_DEBOUNCE_MS = 400;
const VALUES_CHAT_SAVE_TIMER_KEY = '__kaleido_values_chat_save_timer__';
// 整包 YAML 的自描述格式标记与文件名前缀。
const VALUES_BUNDLE_FORMAT = 'kaleidoscope-values';
const VALUES_BUNDLE_FILENAME_PREFIX = '万华镜-变量';
const VALUES_CARD_BUNDLE_FILENAME_PREFIX = '变量: ';
// 内置默认注册变量：任何角色卡 / 聊天都可直接用，无需手动注册。
// 虚拟合并进 getValuesKeys 返回（不落盘、不随 YAML 导出）；卡内注册同名键
// 自动遮蔽内置（编辑内置 = 生成卡级自定义规则，删除卡键 = 恢复内置默认）。
const VALUES_BUILTIN_KEYS = [
  {
    name: '友谊',
    type: VALUES_KEY_TYPE_PARENT,
    rule: '友谊度区间为0~100，变化幅度取决于当前关系——例如:泛泛之交打招呼可以+3，而莫逆之交则不会变化；较大利益赠予对泛泛之交+20，但对莫逆之交可能只+10。',
  },
  {
    name: '友谊等级',
    type: VALUES_KEY_TYPE_CHILD,
    parent: '友谊',
    rule: '',
    rules: [
      { min: 0, max: 20, value: 'lv1: 萍水相逢' },
      { min: 21, max: 40, value: 'lv2: 泛泛之交' },
      { min: 41, max: 60, value: 'lv3: 意气相投' },
      { min: 61, max: 80, value: 'lv4: 莫逆之交' },
      { min: 81, max: 100, value: 'lv5: 生死与共' },
    ],
  },
  {
    name: '情欲',
    type: VALUES_KEY_TYPE_PARENT,
    rule: '情欲值的变化幅度取决于亲密行为的强度,而非日常互动的日积月累——例如:一个暧昧的眼神对视只能有+5左右的小增量,一次亲吻可以带来+20甚至更多的跃迁式增长,发生关系则会直接带来+40以上的大幅跃升;但同样的行为,对情欲值已经很高的关系加成会递减,后期的增长更多依赖亲密互动的频率与默契积累,而非单次行为本身的强度。',
  },
  {
    name: '情欲等级',
    type: VALUES_KEY_TYPE_CHILD,
    parent: '情欲',
    rule: '',
    rules: [
      { min: 0, max: 20, value: 'lv1: 暗生情愫' },
      { min: 21, max: 40, value: 'lv2: 眉来眼去' },
      { min: 41, max: 60, value: 'lv3: 卿卿我我' },
      { min: 61, max: 80, value: 'lv4: 干柴烈火' },
      { min: 81, max: 100, value: 'lv5: 鱼水之欢' },
    ],
  },
];
// 变量自动维护（AI 维护管线）
const VALUES_AUTO_UPDATE_ENABLED = true;
const VALUES_MAINTAIN_RECENT_COUNT = 2;
const VALUES_MAINTAIN_TIMEOUT_MS = 60000;
const VALUES_MAINTAIN_MAX_TOKENS = 2000;
const VALUES_MAINTAIN_HANDLER_KEY = '__kaleido_values_maintain_handler__';
const VALUES_MAINTAIN_STARTED_KEY = '__kaleido_values_maintain_started__';
const VALUES_MAINTAIN_STOPPED_KEY = '__kaleido_values_maintain_stopped__';
const VALUES_MAINTAIN_CHAT_CHANGED_KEY = '__kaleido_values_maintain_chat_changed__';
const VALUES_MAINTAIN_STATE_KEY = '__kaleido_values_maintain_state__';
const VALUES_LAST_ROUND_KEY = '__kaleido_values_last_round__';
// 变量注入提示词（默认数值层勾选 → 发送前注入 World Info after 之后）
const VALUES_INJECT_KEY = 'Kaleidoscope_Values';
const VALUES_INJECT_BAR_ID = 'kaleido-values-inject-bar';
const VALUES_INJECT_TOGGLE_ID = 'kaleido-values-inject-toggle';
const VALUES_INJECT_STATUS_ID = 'kaleido-values-inject-status';
const VALUES_INJECT_ICON_CLASS = 'fa-solid fa-bullhorn';
const VALUES_INJECT_CLEANUP_ENDED_KEY = '__kaleido_values_inject_cleanup_ended__';
const VALUES_INJECT_CLEANUP_STOPPED_KEY = '__kaleido_values_inject_cleanup_stopped__';
// 注入预览：变量系统内查看实际注入提示词的 <Values> 内容（只读）。
const VALUES_INJECT_PREVIEW_ICON_CLASS = 'fa-solid fa-scroll';
const VALUES_TAB_INJECT_ID = 'kaleido-values-tab-inject';
const VALUES_INJECT_PANE_ID = 'kaleido-values-inject-pane';
const VALUES_INJECT_TEXT_ID = 'kaleido-values-inject-text';
// 剧情触发（变量条件确定性触发）：不依赖 API，按变量当前值判定事件是否触发。
const VALUES_TRIGGER_ICON_CLASS = 'fa-solid fa-bolt';
const VALUES_TAB_TRIGGERS_ID = 'kaleido-values-tab-triggers';
const VALUES_NAV_TRIGGERS_COUNT_ID = 'kaleido-values-nav-triggers-count';
const VALUES_TRIGGERS_PANE_ID = 'kaleido-values-triggers-pane';
const VALUES_TRIGGERS_TOGGLE_ID = 'kaleido-values-triggers-toggle';
const VALUES_TRIGGERS_ADD_ID = 'kaleido-values-triggers-add';
const VALUES_TRIGGERS_BODY_ID = 'kaleido-values-triggers-body';
const VALUES_TRIGGER_EDITOR_ID = 'kaleido-values-trigger-editor';
const VALUES_TRIGGER_EDITOR_TITLE_ID = 'kaleido-values-trigger-editor-title';
const VALUES_TRIGGER_EDITOR_NAME_ID = 'kaleido-values-trigger-editor-name';
const VALUES_TRIGGER_EDITOR_LOGIC_ID = 'kaleido-values-trigger-editor-logic';
const VALUES_TRIGGER_EDITOR_ONCE_ID = 'kaleido-values-trigger-editor-once';
const VALUES_TRIGGER_EDITOR_DESC_ID = 'kaleido-values-trigger-editor-desc';
const VALUES_TRIGGER_EDITOR_CONDITIONS_ID = 'kaleido-values-trigger-editor-conditions';
const VALUES_TRIGGER_EDITOR_CONDITION_ADD_ID = 'kaleido-values-trigger-editor-condition-add';
const VALUES_TRIGGER_EDITOR_CONTENT_ID = 'kaleido-values-trigger-editor-content';
const VALUES_TRIGGER_EDITOR_SAVE_ID = 'kaleido-values-trigger-editor-save';
const VALUES_TRIGGER_EDITOR_CANCEL_ID = 'kaleido-values-trigger-editor-cancel';
const VALUES_TRIGGER_CONDITION_ROW_CLASS = 'kaleido-values__trigger-condition';
const VALUES_TRIGGER_CONDITION_PATH_CLASS = 'kaleido-values__trigger-condition-path';
const VALUES_TRIGGER_CONDITION_OP_CLASS = 'kaleido-values__trigger-condition-op';
const VALUES_TRIGGER_CONDITION_OP_CENTER_CLASS = 'kaleido-values__trigger-condition-op-center';
const VALUES_TRIGGER_CONDITION_OP_WRAP_CLASS = 'kaleido-values__trigger-condition-op-wrap';
const VALUES_TRIGGER_CONDITION_OP_TEXT_CLASS = 'kaleido-values__trigger-condition-op-text';
const VALUES_TRIGGER_CONDITION_VALUE_CLASS = 'kaleido-values__trigger-condition-value';
const VALUES_TRIGGER_CONDITION_REMOVE_CLASS = 'kaleido-values__trigger-condition-remove';
// 剧情触发 · 注入与轮次记录
const VALUES_TRIGGER_INJECT_KEY = 'Kaleidoscope_Trigger_Event';
const VALUES_TRIGGER_LAST_ROUND_KEY = '__kaleido_values_trigger_last_round__';
const VALUES_TRIGGER_CLEANUP_ENDED_KEY = '__kaleido_values_trigger_cleanup_ended__';
const VALUES_TRIGGER_CLEANUP_STOPPED_KEY = '__kaleido_values_trigger_cleanup_stopped__';
// 剧情触发 · 条件运算符与逻辑选项
const VALUES_TRIGGER_OPS = Object.freeze([
  { value: '==', label: '等于（==）' },
  { value: '!=', label: '不等于（!=）' },
  { value: '>', label: '大于（>）' },
  { value: '>=', label: '大于等于（>=）' },
  { value: '<', label: '小于（<）' },
  { value: '<=', label: '小于等于（<=）' },
  { value: 'contains', label: '包含（contains）' },
  { value: 'exists', label: '存在（exists）' },
  { value: 'not exists', label: '不存在（not exists）' },
]);
const VALUES_TRIGGER_LOGIC_OPTIONS = Object.freeze([
  { value: 'all', label: '全部满足（且）' },
  { value: 'any', label: '任一满足（或）' },
]);
// 事件类型：once = 一次性（触发后自动关闭，默认）；persistent = 常驻（可重复触发）。
const VALUES_TRIGGER_ONCE_OPTIONS = Object.freeze([
  { value: 'once', label: '一次性事件（触发后自动关闭）' },
  { value: 'persistent', label: '常驻事件（可重复触发）' },
]);
// ---------- 游戏模式（玩家数据展示面板）----------
// 只读展示「变量系统」注入提示词的那些变量：当前游戏值总览，
// 让玩家随时看到当前游戏中的各种数据（角色属性、资源、好感、状态等）。
const GAME_VIEW_ID = 'kaleido-game-view';
const HOME_GAME_BUTTON_ID = 'kaleido-home-game-button';
const GAME_ICON_CLASS = 'fa-solid fa-gamepad';
const GAME_UPDATED_ID = 'kaleido-game-updated';
const GAME_REFRESH_ID = 'kaleido-game-refresh';
const GAME_GEAR_ID = 'kaleido-game-gear';
const GAME_TREE_ID = 'kaleido-game-tree';
const GAME_REFRESH_ENDED_KEY = '__kaleido_game_refresh_ended__';
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
// 第三方扩展的弃用 API 警告（console warn，[DEPRECATED] 开头）：属他方代码的
// 未来兼容性提示，万华镜不干预其他扩展，统一按噪音过滤。内容匹配、不分级别，
// 只认该前缀，不误伤其他 warn/error。已知实例：JS-Slash-Runner 用旧 API
// MacrosParser.registerMacro 注册 userAvatarPath / charAvatarPath 宏。
const CONSOLE_NOISE_PATTERNS = Object.freeze([
  /^\[DEPRECATED\]/i,
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
  valuesTriggerEnabled: true,
  storyGatePrompt: '',
  valuesNavCollapsed: false,
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

// ---------- 变量自动维护默认提示词 ----------
// 与「变量维护」的输入说明保持一致：输入有 <Key_Rules>（键注册表及其变化规则）、
// <Current_Values>（当前游戏值，YAML）与 <Recent_Messages>（最近 2 条消息）。
// 输出约定：YAML 映射：只列出有变化的键，未提及的键保持原值；值写 null 表示删除。
const DEFAULT_VALUES_MAINTAIN_PROMPT = [
  '【任务】',
  '你是「变量维护」子 agent。',
  '你的职责：每轮生成结束后，根据最新剧情维护当前聊天中的游戏变量（角色属性、资源、好感、关系、状态等），让变量与剧情保持一致。',
  '这是高频轻量调用：只更新确有变化的变量，没有变化就不改动；直接输出结果，不要解释、不要分析过程、不要任何多余文字。',
  '',
  '【输入】',
  '本轮输入包含三份材料：',
  '- <Key_Rules>：全部已注册变量及其变化规则。规则是变量变化的唯一依据，规则之外的变量不要随意改动。',
  '- <Current_Values>：当前游戏变量（YAML 格式，仅含父变量；子变量为派生变量由系统自动计算，不要输出子变量）。这是唯一可改动的数据，结构、条目名与层级必须原样保留。',
  '- <Recent_Messages>：最新两条消息（用户消息 + AI 回复），是本轮维护的依据。',
  '',
  '【维护原则】',
  '1. 只依据 <Recent_Messages> 中的剧情更新变量：角色实际做了什么、获得或失去了什么、关系发生了什么变化。',
  '2. 严格遵循 <Key_Rules> 中各变量的变化规则：规则规定了增减方式、范围（上限/下限）、触发条件；与规则冲突的改动一律不做。',
  '3. 消息中没有明确体现的变化不要改；拿不准时保持不变，宁可漏更也不可乱更。',
  '4. 保持结构与命名：顶层条目（人名、资源名）与层级不要删除、改名或合并，除非剧情明确要求；只更新叶子值。',
  '5. 变量必须是 YAML 标量（数字 / 字符串 / 布尔）：数字保留变量形态，字符串按剧情原样书写。',
  '6. 子变量是派生变量：<Current_Values> 中不会出现子变量，输出中也一律不要出现子变量，子变量由系统按父变量自动计算。',
  '',
  '【输出】',
  '你的回复必须且只能是一个 YAML 映射（可用 ```yaml 代码块包裹），内容是本次需要更新的变量：只列出有变化的键，不是完整变量树。',
  '- 只列出确实需要更新的变量；未提及的变量保持原值不动。',
  '- 需要删除某个变量时，把它的值写成 null。',
  '- 不要输出解释、备注或任何前后缀文字。',
  '',
  '【示例】',
  '剧情中「艾莉」的金币从 100 变为 110、好感从 30 变为 40，其余变量不变，则回复：',
  '```yaml',
  '艾莉:',
  '  金币: 110',
  '  好感: 40',
  '```',
  '示例仅为格式演示：实际键名与数值以 <Key_Rules> 中的规则和本轮剧情为准。',
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
  valuesMaintain: Object.freeze({
    label: '变量维护',
    title: '变量维护提示词',
    description: '每轮生成结束后自动调用 AI 维护游戏变量：依据已注册变量的变化规则与最新两条消息更新聊天中的变量。',
    settingsKey: 'valuesMaintainPrompt',
    getDefault: () => DEFAULT_VALUES_MAINTAIN_PROMPT,
  }),
});

// 视图标题表：showPanelView 切换时更新面板标题。
const PANEL_VIEW_TITLES = Object.freeze({
  [HOME_VIEW_ID]: MODULE_DISPLAY_NAME,
  [API_VIEW_ID]: 'API 连接',
  [LOG_VIEW_ID]: '系统日志',
  [PRESET_VIEW_ID]: '预设模版',
  [INJECT_VIEW_ID]: '注入实录',
  [STORY_VIEW_ID]: '剧情脉络',
  [VALUES_VIEW_ID]: '变量系统',
  [GAME_VIEW_ID]: '游戏模式',
});
// 宽视图模式：日志视图需要更宽的窗口展示时间/级别/来源/内容。
// 游戏模式是面板内视图（与首页一致），不需要加宽。
const PANEL_WIDE_MODES = Object.freeze({
  [LOG_VIEW_ID]: 'is-log-mode',
  [PRESET_VIEW_ID]: 'is-preset-mode',
  [INJECT_VIEW_ID]: 'is-inject-mode',
  [STORY_VIEW_ID]: 'is-story-mode',
  [VALUES_VIEW_ID]: 'is-values-mode',
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
  showPanelView(GAME_VIEW_ID);
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
  if (back) back.style.visibility = (viewId === HOME_VIEW_ID || viewId === GAME_VIEW_ID) ? 'hidden' : 'visible';
  const title = document.getElementById(PANEL_TITLE_ID);
  if (title) title.textContent = PANEL_VIEW_TITLES[viewId] || MODULE_DISPLAY_NAME;
  if (viewId === LOG_VIEW_ID) {
    renderLogList();
    updateLogStats();
  }
  if (viewId === INJECT_VIEW_ID) {
    renderInjectView();
  }
  if (viewId === STORY_VIEW_ID) {
    renderStoryTree();
    refreshHomeStoryStatus();
  }
  if (viewId === VALUES_VIEW_ID) {
    renderValuesTree();
    refreshHomeValuesStatus();
  }
  if (viewId === GAME_VIEW_ID) {
    renderGameView();
  }
  ensurePanelPosition(panel);
}

function initPanelViews(panel) {
  if (!panel || panel.dataset.viewsReady === 'true') return;
  document.getElementById(PANEL_BACK_ID)?.addEventListener('click', () => showPanelView(HOME_VIEW_ID));
  document.getElementById(HOME_API_CARD_ID)?.addEventListener('click', () => showPanelView(API_VIEW_ID));
  document.getElementById(HOME_STORY_CARD_ID)?.addEventListener('click', () => {
    if (isNarrowViewport()) showPanelView(STORY_VIEW_ID);
    else openStoryWorkbench();
  });
  document.getElementById(HOME_GAME_BUTTON_ID)?.addEventListener('click', () => showPanelView(GAME_VIEW_ID));
  document.getElementById(HOME_PRESET_CARD_ID)?.addEventListener('click', () => showPanelView(PRESET_VIEW_ID));
  document.getElementById(HOME_INJECT_CARD_ID)?.addEventListener('click', () => showPanelView(INJECT_VIEW_ID));
  document.getElementById(HOME_VALUES_CARD_ID)?.addEventListener('click', () => {
    if (isNarrowViewport()) showPanelView(VALUES_VIEW_ID);
    else openValuesWorkbench();
  });
  document.getElementById(HOME_LOG_CARD_ID)?.addEventListener('click', () => showPanelView(LOG_VIEW_ID));
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
            <button type="button" id="${HOME_GAME_BUTTON_ID}" class="kaleido-home__log-btn" title="游戏模式：玩家数据档案" aria-label="游戏模式">
              <span class="${GAME_ICON_CLASS}"></span>
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
<button type="button" id="${HOME_PRESET_CARD_ID}" class="kaleido-home__card" title="预设模版：修改与重置默认提示词">
              <span class="kaleido-home__card-icon"><span class="${PRESET_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">预设模版</span>
                <span id="${HOME_PRESET_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">默认配置</span>
              </span>
            </button>
<button type="button" id="${HOME_VALUES_CARD_ID}" class="kaleido-home__card" title="变量系统：变量注册 + 默认值 / 游戏值，AI 自动维护">
              <span class="kaleido-home__card-icon"><span class="${VALUES_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">变量系统</span>
                <span id="${HOME_VALUES_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">尚未添加</span>
              </span>
            </button>
<button type="button" id="${HOME_STORY_CARD_ID}" class="kaleido-home__card" title="剧情脉络：节点与事件的工作台">
              <span class="kaleido-home__card-icon"><span class="${STORY_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">剧情脉络</span>
                <span id="${HOME_STORY_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">尚未添加</span>
              </span>
            </button>
<button type="button" id="${HOME_LOG_CARD_ID}" class="kaleido-home__card" title="系统日志：后台运行记录与网络请求">
              <span class="kaleido-home__card-icon"><span class="${LOG_ICON_CLASS}"></span></span>
              <span class="kaleido-home__card-text">
                <span class="kaleido-home__card-title">系统日志</span>
                <span id="${HOME_LOG_STATUS_ID}" class="kaleido-home__card-status" data-state="idle">暂无记录</span>
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
            <div class="kaleido-preset__gate">
              <div class="kaleido-preset__gate-head">
                <span class="kaleido-preset__gate-title">变量自动维护</span>
                <span id="${PRESET_VALUES_STATUS_ID}" class="kaleido-preset__status" data-state="idle">未启用</span>
              </div>
              <p class="kaleido-preset__gate-hint">每轮生成结束后，自动调用 AI 依据「已注册变量的变化规则 + 当前游戏值 + 最新 2 条消息」维护聊天中的游戏值（存聊天文件）。</p>
              <div class="kaleido-preset__gate-row">
                <span class="kaleido-preset__gate-label">启用变量自动维护</span>
                <button type="button" id="${PRESET_VALUES_TOGGLE_ID}" class="kaleido-btn kaleido-api__concurrency-toggle" title="开启/关闭变量自动维护">✨ 变量自动维护：开</button>
              </div>
            </div>
            <div class="kaleido-preset__gate">
              <div class="kaleido-preset__gate-head">
                <span class="kaleido-preset__gate-title">剧情触发</span>
                <span id="${PRESET_TRIGGER_STATUS_ID}" class="kaleido-preset__status" data-state="idle">未启用</span>
              </div>
              <p class="kaleido-preset__gate-hint">不依赖 AI 判断：每次发送前按「某节点下变量的当前值」是否满足预设条件，确定性触发对应剧情事件并注入上下文（条件与事件在变量工作台「剧情触发」页配置）。</p>
              <div class="kaleido-preset__gate-row">
                <span class="kaleido-preset__gate-label">启用剧情触发</span>
                <button type="button" id="${PRESET_TRIGGER_TOGGLE_ID}" class="kaleido-btn kaleido-api__concurrency-toggle" title="开启/关闭剧情触发">⚡ 剧情触发：开</button>
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
            <div class="kaleido-inject__trigger-head" hidden>
              <span class="kaleido-panel__section-title">剧情触发（变量条件）</span>
            </div>
            <div id="${INJECT_TRIGGER_SUMMARY_ID}" class="kaleido-inject__summary" hidden></div>
            <div id="${INJECT_TRIGGER_EVENTS_ID}" class="kaleido-inject__events" hidden></div>
            <pre id="${INJECT_TRIGGER_TEXT_ID}" class="kaleido-inject__inject-text" hidden></pre>
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
  initStorySection(panel);
  initValuesSection(panel);
  initGameSection(panel);
  initLogView(panel);
  initPresetSection(panel);
  panel.querySelector('.kaleido-panel__close')?.addEventListener('click', closePanel);
  if (!globalThis[ESC_KEY_HANDLER_KEY]) {
    globalThis[ESC_KEY_HANDLER_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      // 确认弹层优先：开着时 Esc 只取消确认，不关面板。
      if (isKaleidoConfirmOpen()) {
        settleKaleidoConfirm(false);
        return;
      }
      if (isStoryWorkbenchOpen()) return;
      const activeView = panel.querySelector('.kaleido-view.is-active');
      if (activeView && activeView.id !== HOME_VIEW_ID && activeView.id !== GAME_VIEW_ID) {
        showPanelView(HOME_VIEW_ID);
        return;
      }
      closePanel();
    };
    document.addEventListener('keydown', globalThis[ESC_KEY_HANDLER_KEY]);
  }
  return panel;
}

// ---------- 确认弹层 ----------
// TauriTavern 的 WebView 会把原生 window.confirm 拦截为 plugin:dialog|confirm 命令，
// 但宿主 ACL 未放行该命令，调用会 Promise reject 并打印
// 「Command plugin:dialog|confirm not allowed by ACL」。因此自绘确认弹层，
// 破坏性操作统一用 await kaleidoConfirm(...) 确认，避免误删也避免未处理拒绝。
const KALEIDO_CONFIRM_ID = 'kaleido-confirm-overlay';
let kaleidoConfirmResolve = null;

function isKaleidoConfirmOpen() {
  const overlay = document.getElementById(KALEIDO_CONFIRM_ID);
  return Boolean(overlay && overlay.classList.contains('is-open'));
}

function settleKaleidoConfirm(result) {
  const resolve = kaleidoConfirmResolve;
  kaleidoConfirmResolve = null;
  const overlay = document.getElementById(KALEIDO_CONFIRM_ID);
  if (overlay) overlay.classList.remove('is-open');
  resolve?.(result);
}

function getKaleidoConfirmOverlay() {
  let overlay = document.getElementById(KALEIDO_CONFIRM_ID);
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = KALEIDO_CONFIRM_ID;
  overlay.className = 'kaleido-confirm';
  overlay.innerHTML = `
    <div class="kaleido-confirm__card" role="alertdialog" aria-modal="true" aria-label="确认操作">
      <p class="kaleido-confirm__message"></p>
      <div class="kaleido-confirm__actions">
        <button type="button" class="kaleido-confirm__cancel">取消</button>
        <button type="button" class="kaleido-btn kaleido-confirm__ok">确定</button>
      </div>
    </div>
  `;
  overlay.querySelector('.kaleido-confirm__cancel')?.addEventListener('click', () => settleKaleidoConfirm(false));
  overlay.querySelector('.kaleido-confirm__ok')?.addEventListener('click', () => settleKaleidoConfirm(true));
  document.body.appendChild(overlay);
  return overlay;
}

// 自绘确认：返回 Promise<boolean>，await 后为 true 表示用户点了「确定」。
// 同一时刻只允许一个待确认弹层，新的会以「取消」结掉旧的。
function kaleidoConfirm(message) {
  if (kaleidoConfirmResolve) settleKaleidoConfirm(false);
  const overlay = getKaleidoConfirmOverlay();
  overlay.querySelector('.kaleido-confirm__message').textContent = message;
  overlay.classList.add('is-open');
  const okButton = overlay.querySelector('.kaleido-confirm__ok');
  setTimeout(() => okButton?.focus?.(), 0);
  return new Promise((resolve) => {
    kaleidoConfirmResolve = resolve;
  });
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
      // 第三方扩展的弃用 API 警告（[DEPRECATED] 开头，warn 级，见 constants 注释）：
      // 他方代码的未来兼容性提示，不干预其他扩展，按内容精确匹配成噪音。
      if (CONSOLE_NOISE_PATTERNS.some((pattern) => pattern.test(entry.message))) return;
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
    noiseToggle.title = logConsoleNoise ? '过滤已知噪音（世界书扫描 / 宏变量 dump / 正则跳过 / 事件总线 / 内部保存 / 非模型网络调用 / 宿主扩展更新检查报错 / 第三方扩展弃用 API 警告）' : '不过滤噪音（显示全部 console 与网络日志）';
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

// ---------- 变量自动维护设置（自变量工作台联动） ----------
function renderPresetValuesControl() {
  const toggle = document.getElementById(PRESET_VALUES_TOGGLE_ID);
  const status = document.getElementById(PRESET_VALUES_STATUS_ID);
  if (!toggle && !status) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  if (!settings) return;
  const enabled = settings.valuesAutoUpdateEnabled !== false;
  if (toggle) {
    toggle.textContent = enabled ? '✨ 变量自动维护：开' : '✨ 变量自动维护：关';
    toggle.classList.toggle('is-active', enabled);
    toggle.title = enabled ? '点击关闭：每轮生成结束后不再自动维护变量' : '点击开启：每轮生成结束后自动调用 AI 维护变量';
  }
  if (status) {
    status.textContent = enabled ? '已启用' : '未启用';
    status.dataset.state = enabled ? 'ok' : 'idle';
  }
}

function toggleValuesAutoUpdate() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const settings = getSettings(ctx);
  settings.valuesAutoUpdateEnabled = !(settings.valuesAutoUpdateEnabled !== false);
  saveSettings(ctx);
  renderPresetValuesControl();
  refreshHomeValuesStatus();
  logApp('info', settings.valuesAutoUpdateEnabled ? '变量自动维护已开启' : '变量自动维护已关闭');
  globalThis.toastr?.info?.('变量自动维护已' + (settings.valuesAutoUpdateEnabled ? '开启' : '关闭'), '[' + MODULE_DISPLAY_NAME + ']');
}

// ---------- 剧情触发设置（与变量工作台联动） ----------
function renderPresetTriggerControl() {
  const toggle = document.getElementById(PRESET_TRIGGER_TOGGLE_ID);
  const status = document.getElementById(PRESET_TRIGGER_STATUS_ID);
  if (!toggle && !status) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  if (!settings) return;
  const enabled = settings.valuesTriggerEnabled !== false;
  if (toggle) {
    toggle.textContent = enabled ? '⚡ 剧情触发：开' : '⚡ 剧情触发：关';
    toggle.classList.toggle('is-active', enabled);
    toggle.title = enabled ? '点击关闭：发送前不再按变量条件触发剧情事件' : '点击开启：发送前按变量条件确定性触发剧情事件';
  }
  if (status) {
    status.textContent = enabled ? '已启用' : '未启用';
    status.dataset.state = enabled ? 'ok' : 'idle';
  }
}

function toggleValuesTrigger() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const settings = getSettings(ctx);
  settings.valuesTriggerEnabled = !(settings.valuesTriggerEnabled !== false);
  saveSettings(ctx);
  renderPresetTriggerControl();
  refreshHomeValuesStatus();
  logApp('info', settings.valuesTriggerEnabled ? '剧情触发已开启' : '剧情触发已关闭');
  globalThis.toastr?.info?.('剧情触发已' + (settings.valuesTriggerEnabled ? '开启' : '关闭'), '[' + MODULE_DISPLAY_NAME + ']');
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
    if (!(await kaleidoConfirm(`将「${meta.title}」恢复为默认内容？当前${what}将被默认内容覆盖。`))) return;
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
  document.getElementById(PRESET_VALUES_TOGGLE_ID)?.addEventListener('click', toggleValuesAutoUpdate);
  document.getElementById(PRESET_TRIGGER_TOGGLE_ID)?.addEventListener('click', toggleValuesTrigger);

  renderPresetEditor();
  renderPresetGateControl();
  renderPresetValuesControl();
  renderPresetTriggerControl();
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

// 首页「系统日志」卡片状态：错误 / 警告条数文字提示。
function refreshHomeLogStatus() {
  const status = document.getElementById(HOME_LOG_STATUS_ID);
  if (!status) return;
  try {
    const entries = (typeof logEntries !== 'undefined' && logEntries) || [];
    const errors = entries.filter((entry) => entry.level === 'error').length;
    const warns = entries.filter((entry) => entry.level === 'warn').length;
    const state = errors > 0 ? 'error' : (warns > 0 ? 'warn' : 'idle');
    const text = errors > 0
      ? errors + ' 错误 · ' + warns + ' 警告'
      : (warns > 0 ? warns + ' 警告' : (entries.length > 0 ? '共 ' + entries.length + ' 条' : '暂无记录'));
    status.textContent = text;
    status.dataset.state = state;
  } catch (error) {
    status.textContent = '暂无记录';
    status.dataset.state = 'idle';
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

// 首页「变量」卡片状态：键数量 / 条目数量 + 绑定与自动维护提示。
function refreshHomeValuesStatus() {
  const status = document.getElementById(HOME_VALUES_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    const keys = ctx ? getValuesKeys(ctx) : [];
    const defaults = ctx ? getValuesDefaults(ctx) : {};
    const entries = valuesCountEntries(defaults);
    const triggers = ctx ? getValuesTriggers(ctx) : [];
    const gameInitialized = ctx ? isValuesGameInitialized(ctx) : false;
    const character = ctx ? getStoryCharacter(ctx) : null;
    const card = ctx ? getValuesCardData(ctx) : null;
    const maintainEnabled = settings ? settings.valuesAutoUpdateEnabled !== false : true;
    const triggerEnabled = settings ? settings.valuesTriggerEnabled !== false : true;
    if (character) {
      status.title = card
        ? `变量已绑定角色卡「${character.name || ''}」：默认值随角色卡导入导出；游戏值存聊天文件（${gameInitialized ? '已初始化' : '未初始化'}）`
        : `当前角色卡还没有变量数据：首次保存后自动写入角色卡；自动维护${maintainEnabled ? '已开启' : '已关闭'}`;
    } else {
      status.title = '未绑定角色（群聊/未选角色）：默认值存全局设置，不随角色卡导入导出';
    }
    if (keys.length === 0 && entries === 0 && triggers.length === 0) {
      status.textContent = character ? (card ? '已绑定 · 尚未添加' : '待绑定 · 尚未添加') : '尚未添加';
      status.dataset.state = 'idle';
    } else {
      const parts = [`${keys.length} 变量`, `${entries} 值`];
      if (triggers.length > 0) parts.push(`${triggers.length} 触发`);
      if (triggers.length > 0 && !triggerEnabled) parts.push('触发已关');
      status.textContent = parts.join(' · ');
      status.dataset.state = 'ok';
    }
  } catch (error) {
    status.textContent = '尚未添加';
    status.dataset.state = 'idle';
  }
}

// 首页状态统一刷新入口：后续新增卡片状态时在此挂接。
function refreshHomeStatuses() {
  refreshHomeApiStatus();
  refreshHomeStoryStatus();
  refreshHomeValuesStatus();
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

function getValuesTriggerLastRound() {
  return globalThis[VALUES_TRIGGER_LAST_ROUND_KEY] || null;
}

// 剧情触发摘要：本轮结果 + 统计 + 触发事件名单。
function buildValuesTriggerSummary(round) {
  const wrap = document.createElement('div');
  wrap.className = 'kaleido-inject__summary';
  const outcome = document.createElement('span');
  outcome.className = 'kaleido-inject__summary-outcome';
  if (round.injected) {
    const autoDisabled = Array.isArray(round.autoDisabledIds) ? round.autoDisabledIds.length : 0;
    outcome.textContent = '已注入 ' + round.triggeredIds.length + ' 个事件'
      + (autoDisabled > 0 ? '，' + autoDisabled + ' 个一次性事件已自动关闭' : '');
    outcome.dataset.state = 'ok';
  } else if (round.skipped) {
    outcome.textContent = '本轮无事件满足条件';
    outcome.dataset.state = 'idle';
  } else {
    outcome.textContent = '未注入';
    outcome.dataset.state = 'warn';
  }
  const stats = document.createElement('span');
  stats.className = 'kaleido-inject__summary-stats';
  stats.textContent = '候选 ' + round.totalTriggers + ' 个触发 · 满足 ' + round.triggeredIds.length + ' 个';
  wrap.append(outcome, stats);
  if (Array.isArray(round.triggeredEvents) && round.triggeredEvents.length > 0) {
    const names = document.createElement('span');
    names.className = 'kaleido-inject__summary-names';
    names.textContent = '触发：' + round.triggeredEvents.map((event) => event.name || event.id).join('、');
    wrap.appendChild(names);
  }
  return wrap;
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
  const triggerText = String(event.trigger || event.conditions || '').trim();
  if (triggerText) {
    const trigger = document.createElement('p');
    trigger.className = 'kaleido-inject__event-line';
    trigger.textContent = '触发条件：' + triggerText;
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
  renderValuesTriggerSection();
}

// 剧情触发段：摘要 → 触发事件 → 注入提示词原文。
function renderValuesTriggerSection() {
  const head = document.querySelector('.kaleido-inject__trigger-head');
  const summary = document.getElementById(INJECT_TRIGGER_SUMMARY_ID);
  const events = document.getElementById(INJECT_TRIGGER_EVENTS_ID);
  const text = document.getElementById(INJECT_TRIGGER_TEXT_ID);
  if (!head || !summary || !events || !text) return;
  const round = getValuesTriggerLastRound();
  if (!round) {
    head.hidden = true;
    summary.hidden = true;
    events.hidden = true;
    text.hidden = true;
    return;
  }
  head.hidden = false;
  summary.hidden = false;
  summary.textContent = '';
  summary.appendChild(buildValuesTriggerSummary(round));
  const hasEvents = Array.isArray(round.triggeredEvents) && round.triggeredEvents.length > 0;
  events.hidden = !hasEvents;
  events.textContent = '';
  if (hasEvents) {
    for (const event of round.triggeredEvents) {
      events.appendChild(buildInjectEventCard(event));
    }
  }
  const hasInjection = Boolean(String(round.injectionText || '').trim());
  text.hidden = !hasInjection;
  text.textContent = round.injectionText || '';
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
    // 支持 ```yaml 代码块围栏（与 parseAgentJson 一致）：只剥离顶格围栏行，
    // 缩进的围栏是块文本内容（如剧情里的 markdown），必须原样保留。
    lines: String(text || '').replace(/\r\n?/g, '\n').split('\n').filter((line) => !/^```/.test(line)),
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
  return getExtensionPromptApi(ctx);
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
async function handleStoryDeleteNode(ctx, id) {
  const node = getStoryNodeById(ctx, id);
  if (!node) return;
  const children = getStoryNodeChildren(ctx, id);
  const scripts = getStoryScripts(ctx).filter((script) => script.nodeId === id);
  const parts = [];
  if (children.length > 0) parts.push(`${children.length} 个子节点将上移`);
  if (scripts.length > 0) parts.push(`${scripts.length} 个事件将转为未分类`);
  const suffix = parts.length > 0 ? `（${parts.join('，')}，均不会删除）` : '';
  if (!(await kaleidoConfirm(`确定删除节点「${node.name}」？${suffix}`))) return;
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

async function handleStoryDeleteScript(ctx, id) {
  const script = getStoryScriptById(ctx, id);
  if (!script) return;
  if (!(await kaleidoConfirm(`确定删除事件「${script.name}」？`))) return;
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
// ---------- 手机端 / 电脑端分流 ----------
function isNarrowViewport() {
  return Boolean(window.matchMedia && window.matchMedia('(max-width: 640px)').matches);
}

// 工作台内容模板（树区 + 编辑器 + 导入方式 + 新建菜单 + 文件输入）：
// 电脑端大窗口对话框与手机端面板视图共用，仅编辑器浮层类名不同。
function buildStoryContentHTML(editorClass) {
  return `
        <div id="${STORY_TREE_ID}" class="kaleido-story__tree">
          <div class="kaleido-story__tree-actions">
            <button type="button" id="${STORY_ROOT_ADD_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="新建节点或事件">＋ 新建</button>
            <span class="kaleido-story__tree-hint">节点可层层嵌套 · 事件挂在节点下</span>
          </div>
          <div id="${STORY_TREE_BODY_ID}" class="kaleido-story__tree-body"></div>
        </div>
        <div id="${STORY_EDITOR_ID}" class="${editorClass}" hidden>
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
  `;
}

// 内容事件绑定（对话框与面板视图共用）：新建菜单、导入导出、树操作、编辑器。
function bindStoryContentEvents() {
  document.getElementById(STORY_ROOT_ADD_ID)?.addEventListener('click', (event) => {
    openStoryAddMenu(event.currentTarget, { root: true });
  });
  document.getElementById(STORY_ADD_MENU_NODE_ID)?.addEventListener('click', () => handleStoryAddMenuPick('node'));
  document.getElementById(STORY_ADD_MENU_SCRIPT_ID)?.addEventListener('click', () => handleStoryAddMenuPick('script'));

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

// ---------- 电脑端：独立大窗口工作台（全屏遮罩 + 920×680） ----------
function initStoryWorkbench() {
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
${buildStoryContentHTML('kaleido-story-dialog__editor')}
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  bindStoryContentEvents();
  document.getElementById(STORY_CLOSE_BTN_ID)?.addEventListener('click', closeStoryWorkbench);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeStoryWorkbench();
  });
  if (!globalThis[STORY_DIALOG_KEY]) {
    globalThis[STORY_DIALOG_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      if (isStoryWorkbenchOpen()) closeStoryWorkbench();
    };
    document.addEventListener('keydown', globalThis[STORY_DIALOG_KEY]);
  }
}

// ---------- 手机端：面板内视图（与其它功能一致，共用面板标题栏与返回键） ----------
function initStoryPanelView(panel) {
  if (!panel || document.getElementById(STORY_VIEW_ID)) return;
  const section = document.createElement('section');
  section.id = STORY_VIEW_ID;
  section.className = 'kaleido-view kaleido-story-view';
  section.setAttribute('aria-hidden', 'true');
  section.innerHTML = `
    <div class="kaleido-story__toolbar">
      <span id="${STORY_BINDING_ID}" class="kaleido-story__binding" data-state="idle" title="剧情数据与角色卡绑定状态">未绑定角色</span>
      <div class="kaleido-story__toolbar-actions">
        <button type="button" id="${STORY_IMPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini">导入 剧情脉络</button>
        <button type="button" id="${STORY_EXPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost">导出 剧情脉络</button>
      </div>
    </div>
${buildStoryContentHTML('kaleido-story__editor')}
  `;
  panel.querySelector('.kaleido-panel__body')?.appendChild(section);
  bindStoryContentEvents();
}

function initStorySection(panel) {
  if (isNarrowViewport()) {
    initStoryPanelView(panel);
  } else {
    initStoryWorkbench();
  }
}


// ===== js/values-data.js =====
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

// 把变量包写入角色卡对象（内存态，持久化由 scheduleValuesCardSave 完成）。
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
  saveSettings(ctx);
  logApp('warn', '变量写入角色卡失败，已回退全局设置');
}

// 防抖持久化（与剧情脉络同模式）：按 avatar 定位角色，避免防抖期间切换角色写错卡。
function scheduleValuesCardSave(ctx, character, card) {
  const avatar = String(character?.avatar || '');
  if (globalThis[VALUES_CARD_SAVE_TIMER_KEY]) {
    clearTimeout(globalThis[VALUES_CARD_SAVE_TIMER_KEY]);
  }
  globalThis[VALUES_CARD_SAVE_TIMER_KEY] = setTimeout(() => {
    globalThis[VALUES_CARD_SAVE_TIMER_KEY] = null;
    persistValuesCardData(ctx, avatar, card).catch((error) => {
      logApp('warn', '写入角色卡失败', String(error?.message || error));
    });
  }, VALUES_CARD_SAVE_DEBOUNCE_MS);
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
    await write.call(ctx, index, VALUES_CARD_EXTENSION_KEY, card);
  } catch (error) {
    fallbackValuesDataToSettings(ctx, card);
    throw error;
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

// 保存：有角色且宿主支持写角色卡 → 确保角色卡容器存在后防抖持久化；否则写全局设置。
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
    saveSettings(ctx);
    return;
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
  scheduleValuesCardSave(ctx, character, card);
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
// extra 可携带 { type, parent, rules }：type 为 child 时按子变量保存（parent 为
// 父变量名，rules 为区间规则 [{ min, max, value }]），否则按父变量保存。
function upsertValuesKey(ctx, name, rule, extra = {}) {
  const bundle = getValuesBundle(ctx);
  const target = String(name || '').trim();
  if (!target) return null;
  const type = String(extra?.type || '') === VALUES_KEY_TYPE_CHILD ? VALUES_KEY_TYPE_CHILD : VALUES_KEY_TYPE_PARENT;
  const existing = bundle.keys.find((key) => String(key?.name || '').trim() === target);
  const now = new Date().toISOString();
  if (existing) {
    existing.rule = String(rule || '').trim();
    existing.type = type;
    if (type === VALUES_KEY_TYPE_CHILD) {
      existing.parent = String(extra?.parent || '').trim();
      existing.rules = normalizeValuesChildRules(extra?.rules);
    } else {
      delete existing.parent;
      delete existing.rules;
    }
    existing.updatedAt = now;
  } else {
    const key = { name: target, rule: String(rule || '').trim(), type, createdAt: now, updatedAt: now };
    if (type === VALUES_KEY_TYPE_CHILD) {
      key.parent = String(extra?.parent || '').trim();
      key.rules = normalizeValuesChildRules(extra?.rules);
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
// 父变量按区间规则（rules）自动派生（如 好感度 40 → 态度「颇具好感」）。
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

// 单叶子派生：按子变量规则，用同路径父变量值计算子变量值（就地写入）。
// 规则按顺序匹配，首个满足的生效；父变量缺失 / 非数值 / 无规则命中时保持原值。
function deriveValuesChildAt(tree, path, childKey) {
  const parentName = String(childKey?.parent || '').trim();
  if (!parentName || !Array.isArray(path) || path.length === 0) return false;
  const parentValue = valuesGetAtPath(tree, path.slice(0, -1).concat(parentName));
  let numeric = null;
  if (typeof parentValue === 'number') {
    numeric = parentValue;
  } else if (typeof parentValue === 'string' && parentValue.trim() !== '') {
    const parsed = Number(parentValue);
    if (Number.isFinite(parsed)) numeric = parsed;
  }
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
// 容器与父变量原样保留。用于 AI 维护：发给 AI 的值表只含父变量，子变量是
// 派生变量由系统计算，不发送也不允许 AI 改动。
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

// ---------- 注入提示词配置（默认数值层勾选）----------
// 配置存变量包 inject 字段：{ enabled, paths }。paths 是打开条目的路径数组
// （path.join('/')），节点上下级联动：打开下级自动提升全部祖先，关闭上级
// 级联关闭全部后代；随角色卡 / 全局设置保存。
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

// 打开 / 关闭一个条目（节点上下级联动）：
// - 打开条目 = 自身 + 全部祖先打开（下级打开 → 上级必须打开）；
// - 关闭条目 = 自身 + 全部后代关闭（上级关闭 → 下级全部关闭）；
// - 打开节点不自动打开后代（上级打开 → 下级选择性打开）。
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
  lines.push('keys:');
  for (const key of bundle.keys) {
    lines.push(`  - name: ${yamlScalar(String(key?.name || ''))}`);
    if (isValuesChildKey(key)) {
      lines.push('    type: child');
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
    } else {
      lines.push('    type: parent');
      lines.push(`    rule: ${yamlBlockScalarText(String(key?.rule || ''), '    ')}`);
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
  if (parsed.keys !== undefined) {
    if (!Array.isArray(parsed.keys)) throw new Error('keys 必须是列表');
    for (const item of parsed.keys) {
      const name = String(item?.name || '').trim();
      if (!name) throw new Error('变量缺少 name');
      const type = String(item?.type || '').trim() === VALUES_KEY_TYPE_CHILD ? VALUES_KEY_TYPE_CHILD : VALUES_KEY_TYPE_PARENT;
      const key = { name, type };
      if (type === VALUES_KEY_TYPE_CHILD) {
        key.parent = String(item?.parent || '').trim();
        key.rules = normalizeValuesChildRules(item?.rules);
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
      triggers.push({
        id,
        name: String(item.name || '').trim() || '未命名触发',
        enabled: item.enabled !== false,
        once: item.once !== false,
        logic: String(item.logic || 'all').trim() === 'any' ? 'any' : 'all',
        description: String(item.description || '').trim(),
        conditions,
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
        existing.parent = String(key.parent || '').trim();
        existing.rules = normalizeValuesChildRules(key.rules);
      } else {
        delete existing.parent;
        delete existing.rules;
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


// ===== js/values-maintain.js =====
// ===== 万华镜（Kaleidoscope）变量自动维护：AI 维护管线 =====
// 触发时机：宿主每轮生成结束（generationEnded）且确实产出了新的 AI 回复。
// 与 SoulLink 自动档案维护同款稳定设计：
// - 「generationStarted → generationEnded」配对判定主生成流程，其他插件自行
//   广播的 generationEnded（无配对 / 末条未变化）直接跳过；
// - 末条签名去重 + 运行锁：同一末条只处理一次，上一轮还在飞时新事件直接跳过；
// - 中断检查：生成被用户中止时跳过，不对半截回复发起维护；
// - 失败即跳过本轮：调用失败不降级、不重试轰炸，本轮视为已处理。
// 请求体：system 维护提示词 → <Key_Rules>（键注册表 + 变化规则）→
// <Current_Values>（当前游戏值 YAML，仅父变量；子变量是派生变量不发送）→
// <Recent_Messages>（最新 2 条消息）。
// 解析：AI 返回 YAML/JSON 补丁 → 剔除子变量（不允许 AI 改动）→ 与当前树合并
// （仅已注册键可新增）→ 按最新父变量重算子变量 → 有变化才写聊天文件。

const valuesMaintainState = {
  running: false,
  lastSignature: '',
};

// 主生成流程跟踪：generationStarted 记录末条签名，generationEnded 时末条必须变化。
const valuesMainGenerationState = {
  startChatSignature: '',
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
}

function onValuesGenerationStopped() {
  valuesMainGenerationState.startChatSignature = '';
}

// 切换/加载聊天时清空跟踪，避免残留签名被其他插件的 generationEnded 误用。
function onValuesChatChanged() {
  valuesMainGenerationState.startChatSignature = '';
}

// 维护提示词：自定义优先，空则回退默认。
function getValuesMaintainPrompt(ctx) {
  const settings = ctx ? getSettings(ctx) : null;
  const saved = String(settings?.valuesMaintainPrompt || '').trim();
  return saved || DEFAULT_VALUES_MAINTAIN_PROMPT;
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
  const childNote = childKeysInUse.length > 0
    ? '\n\n（子变量为派生变量，由系统按父变量自动计算，禁止修改：' +
      childKeysInUse.map((key) => `${String(key?.name || '')} ← ${String(key?.parent || '')}`).join('、') +
      '）'
    : '';
  // 子变量是派生变量：发给 AI 的值表只含父变量，子变量不发送（也不允许 AI 改动）。
  const parentCurrent = stripValuesChildLeaves(current, keys);
  const currentText = serializeValuesTree(parentCurrent, '') || '{}';
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
        '以下被 <Current_Values>...</Current_Values> 包裹的是当前游戏变量（YAML 格式，仅含父变量；子变量为派生变量由系统计算，不在此列出），这是唯一可改动的数据，结构、条目名与层级必须原样保留。',
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
    // 子变量是派生变量：AI 输出里即使带了子变量也一律剔除（不允许增删改），
    // 子变量最终值一律由合并后的父变量派生，保证与父变量一致。
    const parentPatch = stripValuesChildLeaves(patch, keys);
    const merged = mergeValuesPatch(current, parentPatch, getValuesRegistryNames(ctx));
    // 子变量派生：AI 可能改了父变量，合并后按最新父变量重算子变量（子变量没有
    // 发给 AI、补丁里的子变量也被剔除，这里只负责把父变量变化落到子变量上）。
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

// generationEnded 入口：主生成配对 + 末条变化 + 去重 + 运行锁 + 配置检查。
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
  // 非主生成流程的 generationEnded（其他插件自行广播）直接跳过。
  if (valuesMainGenerationState.startChatSignature === '') {
    logApp('debug', '变量维护跳过：非主生成流程的 generationEnded');
    return;
  }
  const startSignature = valuesMainGenerationState.startChatSignature;
  valuesMainGenerationState.startChatSignature = '';
  const signature = buildValuesSignature(lastMessage);
  if (signature === startSignature) {
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


// ===== js/values-inject.js =====
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

// ===== js/values-trigger.js =====
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

// 归一化单条触发：补全字段、过滤非法条件（空路径丢弃）。
function normalizeValuesTrigger(raw) {
  const conditions = Array.isArray(raw?.conditions) ? raw.conditions : [];
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

// ===== js/views-values.js =====
// ===== 万华镜（Kaleidoscope）变量工作台 UI：节点树 + 变量注册表 + 自动维护状态 =====
// 结构与剧情脉络一致：节点（人名 / 分组）只做嵌套容器、不对应值；变量挂在节点下
// （或顶层），是唯一对应值的条目。变量必须先注册，新建时从注册表下拉选择。
let valuesActiveLayer = 'default';   // 'default'（角色卡） | 'game'（聊天）
let valuesExpanded = new Set();      // 已展开的节点路径（path.join('/')）
let valuesEditorPath = null;         // 正在编辑的条目路径（null = 新建）
let valuesEditorMode = null;         // 'node' | 'key'
let valuesKeyEditorName = null;      // 正在编辑的注册变量名（null = 新建）
let valuesActiveTree = null;         // 当前层的活引用（渲染时赋值，增删改用它）
let valuesEditorParentPath = [];     // 新建节点 / 变量时的父路径
let valuesAddMenuContext = null;    // 「＋」菜单上下文：{ root: true } | { path: [...] }
let valuesTriggerEditorId = null;        // 正在编辑的触发 id（null = 新建）
let valuesTriggerEditorConditions = [];  // 编辑器中的条件草稿

function valuesToastr(kind, message) {
  try {
    const fn = globalThis.toastr?.[kind];
    if (typeof fn === 'function') fn(message, `[${MODULE_DISPLAY_NAME}]`);
  } catch {}
}

function getValuesWorkbench() {
  return document.getElementById(VALUES_DIALOG_ID);
}

function isValuesWorkbenchOpen() {
  const dialog = getValuesWorkbench();
  return Boolean(dialog && dialog.classList.contains('is-open'));
}

// ---------- 打开 / 关闭工作台 ----------
function openValuesWorkbench() {
  const dialog = getValuesWorkbench();
  if (!dialog) return;
  closeValuesEditor();
  closeValuesKeyEditor();
  closeValuesTriggerEditor();
  closeValuesAddMenu();
  dialog.classList.add('is-open');
  dialog.setAttribute('aria-hidden', 'false');
  applyValuesNavState();
  renderValuesTree();
  refreshHomeValuesStatus();
  logApp('debug', '变量工作台已打开');
}

function closeValuesWorkbench() {
  const dialog = getValuesWorkbench();
  if (!dialog) return;
  closeValuesEditor();
  closeValuesKeyEditor();
  closeValuesTriggerEditor();
  closeValuesAddMenu();
  dialog.classList.remove('is-open');
  dialog.setAttribute('aria-hidden', 'true');
  logApp('debug', '变量工作台已关闭');
}

// 绑定徽标：角色卡 / 聊天文件 / 未绑定。
function refreshValuesBindingStatus() {
  const badge = document.getElementById(VALUES_BINDING_ID);
  if (!badge) return;
  const ctx = getContextSafe();
  const character = ctx ? getStoryCharacter(ctx) : null;
  if (!character) {
    badge.textContent = '未绑定角色';
    badge.dataset.state = 'idle';
    badge.title = '群聊或未选角色：默认值保存在全局设置，不随角色卡导入导出';
    return;
  }
  const name = String(character.name || character.avatar || '当前角色');
  const card = ctx ? getValuesCardData(ctx) : null;
  if (card) {
    badge.textContent = `默认值已绑定 · ${name}`;
    badge.dataset.state = 'ok';
    badge.title = '默认值保存在角色卡中：导入/导出角色卡时自动携带；游戏值保存在聊天文件中';
  } else {
    badge.textContent = `待绑定 · ${name}`;
    badge.dataset.state = 'warn';
    badge.title = '当前角色卡还没有变量数据：首次保存后自动写入角色卡';
  }
}

// ---------- 左侧导航：收起 / 展开 ----------
function getValuesWorkbenchEl() {
  return document.querySelector('.kaleido-values__workbench');
}

// 从设置恢复导航折叠状态（对话框与面板视图共用）。
function applyValuesNavState() {
  const bench = getValuesWorkbenchEl();
  if (!bench) return;
  let collapsed = false;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    collapsed = Boolean(settings?.valuesNavCollapsed);
  } catch {}
  bench.classList.toggle('is-nav-collapsed', collapsed);
  const expand = document.getElementById(VALUES_NAV_EXPAND_ID);
  if (expand) expand.hidden = !collapsed;
}

function setValuesNavCollapsed(collapsed) {
  const bench = getValuesWorkbenchEl();
  if (!bench) return;
  bench.classList.toggle('is-nav-collapsed', collapsed);
  const expand = document.getElementById(VALUES_NAV_EXPAND_ID);
  if (expand) expand.hidden = !collapsed;
  try {
    const ctx = getContextSafe();
    if (ctx) {
      const settings = getSettings(ctx);
      settings.valuesNavCollapsed = Boolean(collapsed);
      saveSettings(ctx);
    }
  } catch {}
}

// ---------- 层切换 ----------
function setValuesLayer(layer) {
  if (layer !== 'default' && layer !== 'game') return;
  valuesActiveLayer = layer;
  const isGame = layer === 'game';
  // 状态锚点（隐藏按钮）：保留 is-active 语义
  document.getElementById(VALUES_LAYER_DEFAULT_ID)?.classList.toggle('is-active', !isGame);
  document.getElementById(VALUES_LAYER_GAME_ID)?.classList.toggle('is-active', isGame);
  // 可见的当前层指示条：只显示当前层，右侧按钮一键切换
  const row = document.getElementById(VALUES_LAYER_ROW_ID);
  if (row) row.dataset.layer = layer;
  const icon = document.getElementById(VALUES_LAYER_ICON_ID);
  if (icon) icon.innerHTML = `<span class="${isGame ? VALUES_LAYER_GAME_ICON_CLASS : VALUES_LAYER_DEFAULT_ICON_CLASS}"></span>`;
  const title = document.getElementById(VALUES_LAYER_TITLE_ID);
  if (title) title.textContent = isGame ? '游戏数值' : '默认数值';
  const toggle = document.getElementById(VALUES_LAYER_TOGGLE_ID);
  if (toggle) {
    const target = isGame ? '默认数值' : '游戏数值';
    toggle.innerHTML = `<span class="${VALUES_LAYER_SWAP_ICON_CLASS}"></span> 切换到${target}`;
    toggle.title = isGame ? '切换到默认数值（角色卡，仅手动修改）' : '切换到游戏数值（聊天，AI 自动维护）';
  }
  closeValuesEditor();
  closeValuesKeyEditor();
  closeValuesAddMenu();
  syncValuesLayerUI();
  renderValuesTree();
}

// 层相关 UI 联动：自动维护 / 重置按钮只属于游戏值层；新建按钮只属于默认值层
// （游戏值层是 AI 维护的数据，只允许修改，不允许新建 / 删除条目）；默认值层只提示手动修改。
function syncValuesLayerUI() {
  const isGame = valuesActiveLayer === 'game';
  const maintainNow = document.getElementById(VALUES_MAINTAIN_NOW_ID);
  const resetBtn = document.getElementById(VALUES_RESET_GAME_ID);
  const status = document.getElementById(VALUES_MAINTAIN_STATUS_ID);
  const hint = document.getElementById(VALUES_DEFAULT_HINT_ID);
  const injectBar = document.getElementById(VALUES_INJECT_BAR_ID);
  const addRoot = document.getElementById(VALUES_ADD_ROOT_ID);
  if (maintainNow) maintainNow.hidden = !isGame;
  if (resetBtn) resetBtn.hidden = !isGame;
  if (status) status.hidden = !isGame;
  if (hint) hint.hidden = isGame;
  if (addRoot) addRoot.hidden = isGame;
  // 注入提示词条只属于「默认数值」层（勾选配置随角色卡保存）。
  if (injectBar) injectBar.hidden = isGame;
}

// 注入提示词条：开关状态 + 勾选统计。
function refreshValuesInjectUI() {
  const toggle = document.getElementById(VALUES_INJECT_TOGGLE_ID);
  const status = document.getElementById(VALUES_INJECT_STATUS_ID);
  if (!toggle && !status) return;
  const ctx = getContextSafe();
  const config = ctx ? getValuesInjectConfig(ctx) : { enabled: false, paths: [] };
  if (toggle) {
    toggle.classList.toggle('is-off', !config.enabled);
    toggle.setAttribute('aria-checked', String(Boolean(config.enabled)));
  }
  if (status) {
    // 统计实际注入的变量数（容器节点本身不注入内容）。
    let count = 0;
    if (ctx && Array.isArray(config.paths)) {
      const tree = getValuesGameTree(ctx);
      for (const item of config.paths) {
        const path = String(item || '').split('/').filter(Boolean);
        const node = valuesGetAtPath(tree, path);
        if (node !== undefined && !valuesIsContainer(node)) count += 1;
      }
    }
    if (!config.enabled) {
      status.textContent = '未开启 · 勾选条目后随提示词注入';
      status.dataset.state = 'idle';
    } else if (count === 0) {
      status.textContent = '已开启 · 尚未勾选任何变量';
      status.dataset.state = 'warn';
    } else {
      status.textContent = `已开启 · 注入 ${count} 个变量 · 位置：World Info after 之后`;
      status.dataset.state = 'ok';
    }
  }
  renderValuesInjectPreview();
}

// 注入预览：显示实际注入提示词的 <Values> 块原文（与注入管线同源，只读）。
function renderValuesInjectPreview() {
  const pre = document.getElementById(VALUES_INJECT_TEXT_ID);
  if (!pre) return;
  const ctx = getContextSafe();
  const config = ctx ? getValuesInjectConfig(ctx) : null;
  if (!config?.enabled) {
    pre.textContent = '（变量注入未开启：在「变量系统 → 默认数值」层勾选变量并打开注入开关后，这里会显示实际注入提示词的 <Values> 内容。）';
    return;
  }
  const text = buildValuesInjectText(ctx);
  pre.textContent = text || '（已开启注入，但还没有勾选任何变量。）';
}

// 当前层的活引用：默认层 = 角色卡 defaults；游戏层 = 聊天状态 values（未初始化时
// 用默认值克隆，首次修改 / AI 维护后落盘到聊天文件）。
function getValuesActiveTree(ctx) {
  const context = ctx || getContextSafe();
  if (valuesActiveLayer === 'game') {
    const state = getValuesChatState(context);
    return state ? state.values : cloneValue(getValuesDefaults(context));
  }
  return getValuesDefaults(context);
}

function saveValuesActiveTree(ctx, tree) {
  const context = ctx || getContextSafe();
  if (valuesActiveLayer === 'game') {
    // 保存前派生：手动改了父变量后，子变量按最新父变量重算再落盘。
    deriveValuesChildren(tree, context ? getValuesKeys(context) : []);
    return saveValuesChatState(context, tree);
  }
  // 默认层：先确保角色卡容器存在；若当前 tree 不是活引用（首次编辑时来自
  // 一次性兜底对象，角色卡尚不存在），把内容并入角色卡 defaults 再保存。
  ensureValuesCardData(context);
  const live = getValuesDefaults(context);
  if (tree !== live) {
    for (const key of Object.keys(live)) delete live[key];
    Object.assign(live, cloneValue(tree));
  }
  deriveValuesChildren(live, context ? getValuesKeys(context) : []);
  saveValuesData(context);
  return true;
}
// ---------- 节点树渲染 ----------
function formatValuesLeafText(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (value === null || value === undefined) return 'null';
  return String(value);
}

function buildValuesEmpty(text) {
  const empty = document.createElement('div');
  empty.className = 'kaleido-values__empty';
  empty.textContent = text;
  return empty;
}// 节点行：chevron + 名称 + 子项数 + 「＋」菜单 / 编辑 / 删除。
// 变量行：图标 + 名称 + 值 + 编辑 / 删除。
function buildValuesRow(path, name, node, depth) {
  const row = document.createElement('div');
  row.dataset.path = JSON.stringify(path);
  row.style.setProperty('--depth', String(depth));
  const ctx = getContextSafe();
  const registered = ctx ? getValuesKeyByName(ctx, name) : null;
  const isChildLeaf = Boolean(registered && isValuesChildKey(registered));
  const registryTitle = registered
    ? (isChildLeaf
      ? `子变量 · 由「${registered.parent || ''}」派生：${formatValuesChildRulesSummary(registered)}`
      : `已注册变量 · 变化规则：${registered.rule || '（未填写规则）'}`)
    : '';
  const isNode = valuesIsContainer(node);
  // 游戏值层是 AI 维护的数据：只允许修改，不渲染新建菜单与删除按钮。
  const isGameLayer = valuesActiveLayer === 'game';
  // 注入勾选框：只在「默认数值」层显示（配置随角色卡保存）。
  const injectConfig = valuesActiveLayer === 'default' ? getValuesInjectConfig(ctx) : null;
  const pathKey = path.join('/');
  const injectChecked = injectConfig ? injectConfig.paths.includes(pathKey) : false;
  // 半选只在「自身未打开但后代有打开」时显示（正常交互下打开后代会自动提升
  // 祖先，半选仅出现在导入等数据不一致场景，作为防御性提示）。
  const injectIndeterminate = injectConfig ? !injectChecked && injectConfig.paths.some((item) => item.startsWith(pathKey + '/')) : false;
  const injectCheckHTML = injectConfig
    ? `<button type="button" class="kaleido-values__inject-switch${injectChecked ? '' : ' is-off'}${injectIndeterminate ? ' is-partial' : ''}" data-inject-toggle="1" role="switch" aria-checked="${injectChecked}" title="勾选后随提示词注入${isNode ? '（含全部子条目）' : ''}"><span class="kaleido-values__inject-switch-thumb"></span></button>`
    : '';

  if (isNode) {
    const key = path.join('/');
    const expanded = valuesExpanded.has(key);
    const count = Object.keys(node).length;
    row.className = 'kaleido-values__row kaleido-values__row--entry' + (expanded ? ' is-expanded' : '');
    row.dataset.kind = 'container';
    row.innerHTML = `
      <button type="button" class="kaleido-values__drag-handle" data-action="drag" title="拖动排序" aria-label="拖动排序"><span class="${VALUES_DRAG_ICON_CLASS}"></span></button>
      ${injectCheckHTML}
      <button type="button" class="kaleido-values__chevron${count > 0 ? '' : ' is-empty'}" data-action="toggle" title="展开 / 收起" aria-label="展开 / 收起">
        <span class="${VALUES_CHEVRON_ICON_CLASS}"></span>
      </button>
      <span class="kaleido-values__row-name" title="节点：可继续嵌套节点或挂变量">${escapeHtml(name)}</span>
      <span class="kaleido-values__row-count">${count} 项</span>
      <span class="kaleido-values__row-actions">
        ${isGameLayer ? '' : `<button type="button" class="kaleido-values__icon-btn" data-action="add-menu" title="新建子节点 / 变量" aria-label="新建子节点 / 变量"><span class="${VALUES_ADD_CHILD_ICON_CLASS}"></span></button>`}
        <button type="button" class="kaleido-values__icon-btn" data-action="edit" title="编辑节点" aria-label="编辑节点"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>
        ${isGameLayer ? '' : `<button type="button" class="kaleido-values__icon-btn kaleido-values__icon-btn--danger" data-action="delete" title="删除节点" aria-label="删除节点"><span class="${VALUES_DELETE_ICON_CLASS}"></span></button>`}
      </span>
    `;
    const injectCheck = row.querySelector('button[data-inject-toggle]');
    if (injectCheck) injectCheck.classList.toggle('is-partial', injectIndeterminate);
    return row;
  }

  row.className = 'kaleido-values__row kaleido-values__row--leaf' + (isChildLeaf ? ' is-derived' : '');
  row.dataset.kind = 'leaf';
  const derivedBadge = isChildLeaf
    ? `<span class="kaleido-values__row-derived-badge" title="子变量：值由「${escapeHtml(String(registered.parent || ''))}」自动派生，不可手动编辑">派生</span>`
    : '';
  const editButton = isChildLeaf
    ? `<button type="button" class="kaleido-values__icon-btn" disabled title="子变量由父变量自动计算，不可手动编辑" aria-label="子变量不可编辑"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>`
    : `<button type="button" class="kaleido-values__icon-btn" data-action="edit" title="编辑变量" aria-label="编辑变量"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>`;
  row.innerHTML = `
    <button type="button" class="kaleido-values__drag-handle" data-action="drag" title="拖动排序" aria-label="拖动排序"><span class="${VALUES_DRAG_ICON_CLASS}"></span></button>
    ${injectCheckHTML}
    <span class="kaleido-values__row-name${registered ? ' is-registered' : ''}" title="${registryTitle}">${escapeHtml(name)}</span>
    ${derivedBadge}
    <span class="kaleido-values__row-value" title="${escapeHtml(formatValuesLeafText(node))}">${escapeHtml(formatValuesLeafText(node))}</span>
    <span class="kaleido-values__row-actions">
      ${editButton}
      ${isGameLayer ? '' : `<button type="button" class="kaleido-values__icon-btn kaleido-values__icon-btn--danger" data-action="delete" title="删除变量" aria-label="删除变量"><span class="${VALUES_DELETE_ICON_CLASS}"></span></button>`}
    </span>
  `;
  const injectCheck = row.querySelector('button[data-inject-toggle]');
  if (injectCheck) injectCheck.classList.toggle('is-partial', injectIndeterminate);
  return row;
}

function renderValuesTreeRows(container, ctx, node, path, depth) {
  if (!valuesIsContainer(node)) return;
  const order = ctx ? getValuesTreeOrder(ctx) : {};
  const names = valuesOrderedNames(order, path.join('/'), node);
  for (const name of names) {
    const childPath = path.concat(name);
    const child = node[name];
    container.appendChild(buildValuesRow(childPath, name, child, depth));
    if (valuesIsContainer(child) && valuesExpanded.has(childPath.join('/'))) {
      renderValuesTreeRows(container, ctx, child, childPath, depth + 1);
    }
  }
}

// 左侧导航徽标：变量树显示当前层顶层条目数，变量注册显示已注册变量数。
function refreshValuesNavCounts() {
  const treeBadge = document.getElementById(VALUES_NAV_TREE_COUNT_ID);
  const keysBadge = document.getElementById(VALUES_NAV_KEYS_COUNT_ID);
  const ctx = getContextSafe();
  if (treeBadge) {
    const tree = ctx ? getValuesActiveTree(ctx) : {};
    const count = Object.keys(tree).length;
    treeBadge.textContent = String(count);
    treeBadge.hidden = count === 0;
  }
  if (keysBadge) {
    const keys = ctx ? getValuesKeys(ctx) : [];
    const count = keys.length;
    keysBadge.textContent = String(count);
    keysBadge.hidden = count === 0;
  }
  const triggersBadge = document.getElementById(VALUES_NAV_TRIGGERS_COUNT_ID);
  if (triggersBadge) {
    const triggers = ctx ? getValuesTriggers(ctx) : [];
    const count = triggers.length;
    triggersBadge.textContent = String(count);
    triggersBadge.hidden = count === 0;
  }
}

function renderValuesTree() {
  const body = document.getElementById(VALUES_TREE_BODY_ID);
  if (!body) return;
  const ctx = getContextSafe();
  refreshValuesBindingStatus();
  refreshValuesMaintainStatus();
  refreshValuesNavCounts();
  syncValuesLayerUI();
  refreshValuesInjectUI();
  valuesActiveTree = ctx ? getValuesActiveTree(ctx) : {};
  body.innerHTML = '';
  const hasEntries = Object.keys(valuesActiveTree).length > 0;
  if (!hasEntries) {
    let emptyText;
    if (valuesActiveLayer === 'game' && !isValuesGameInitialized(ctx)) {
      emptyText = '游戏值尚未初始化：默认值会在首次修改或 AI 维护后写入聊天文件。\n现在显示的是当前角色卡的默认值。';
    } else if (valuesActiveLayer === 'game') {
      emptyText = '游戏值还没有条目：请在「默认数值」层新建，\n或等 AI 维护按注册规则自动建立。';
    } else {
      emptyText = '还没有节点。点击上方「＋ 新建」新建节点或变量；\n节点可层层嵌套，变量挂在节点下。';
    }
    body.appendChild(buildValuesEmpty(emptyText));
    return;
  }
  renderValuesTreeRows(body, ctx, valuesActiveTree, [], 0);
}
// ---------- 「＋」新建菜单 ----------
function openValuesAddMenu(anchor, context) {
  const menu = document.getElementById(VALUES_ADD_MENU_ID);
  if (!menu) return;
  valuesAddMenuContext = context || { root: true };
  menu.hidden = false;
  const rect = anchor.getBoundingClientRect();
  let top = rect.bottom + 4;
  let left = rect.left;
  const menuRect = menu.getBoundingClientRect();
  if (top + menuRect.height > window.innerHeight - 8) {
    top = Math.max(8, rect.top - menuRect.height - 4);
  }
  if (left + menuRect.width > window.innerWidth - 8) {
    left = Math.max(8, window.innerWidth - menuRect.width - 8);
  }
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function closeValuesAddMenu() {
  const menu = document.getElementById(VALUES_ADD_MENU_ID);
  if (menu) menu.hidden = true;
  valuesAddMenuContext = null;
}

function handleValuesAddMenuPick(kind) {
  const context = valuesAddMenuContext || { root: true };
  closeValuesAddMenu();
  const parentPath = context.root ? [] : (context.path || []);
  if (kind === 'node') openValuesNodeEditor(parentPath, null);
  else if (kind === 'key') openValuesKeyEntryEditor(parentPath, null);
}// ---------- 节点 / 变量编辑器 ----------
// 上级节点下拉：列出全部节点路径（排除自身与后代），只认显式预设。
function populateValuesParentSelect(currentPath, selectedParentPath) {
  const select = document.getElementById(VALUES_EDITOR_PARENT_SELECT_ID);
  if (!select) return;
  const tree = valuesActiveTree || {};
  const order = getValuesTreeOrder(getContextSafe());
  select.innerHTML = '';
  const top = document.createElement('option');
  top.value = '';
  top.textContent = '（顶层 · 根节点）';
  select.appendChild(top);
  const walk = (node, path) => {
    if (!valuesIsContainer(node)) return;
    for (const key of valuesOrderedNames(order, path.join('/'), node)) {
      const childPath = path.concat(key);
      const child = node[key];
      if (!valuesIsContainer(child)) continue;
      if (currentPath && currentPath.join('/') === childPath.join('/')) continue;
      if (currentPath && isValuesPathAncestor(childPath, currentPath)) continue;
      const option = document.createElement('option');
      option.value = JSON.stringify(childPath);
      option.textContent = childPath.join(' / ');
      select.appendChild(option);
      walk(child, childPath);
    }
  };
  walk(tree, []);
  const preset = selectedParentPath && selectedParentPath.length > 0 ? JSON.stringify(selectedParentPath) : '';
  select.value = preset;
}

// 判断 ancestorPath 是否是 path 的祖先（用于防环）。
function isValuesPathAncestor(ancestorPath, path) {
  if (!ancestorPath || ancestorPath.length === 0) return false;
  if (!path || path.length <= ancestorPath.length) return false;
  return ancestorPath.every((segment, index) => path[index] === segment);
}

// 已注册变量下拉：变量必须先注册，新建时从这里选择。
function fillValuesKeySelect() {
  const select = document.getElementById(VALUES_EDITOR_KEY_SELECT_ID);
  if (!select) return;
  const ctx = getContextSafe();
  const keys = ctx ? getValuesKeys(ctx) : [];
  select.innerHTML = '';
  if (keys.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '（还没有已注册变量，请先到「变量注册」页注册）';
    select.appendChild(option);
    return;
  }
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '（选择已注册变量）';
  select.appendChild(placeholder);
  for (const key of keys) {
    const option = document.createElement('option');
    option.value = String(key.name || '');
    option.textContent = String(key.name || '');
    select.appendChild(option);
  }
}

function setValuesEditorMode(mode) {
  const nodeFields = document.getElementById(VALUES_EDITOR_NODE_FIELDS_ID);
  const keyFields = document.getElementById(VALUES_EDITOR_KEY_FIELDS_ID);
  if (!nodeFields || !keyFields) return;
  nodeFields.hidden = mode !== 'node';
  keyFields.hidden = mode !== 'key';
}

// 节点编辑器：只填名称与上级节点，节点不对应值。
function openValuesNodeEditor(parentPath, editPath) {
  const editor = document.getElementById(VALUES_EDITOR_ID);
  if (!editor) return;
  valuesEditorMode = 'node';
  valuesEditorPath = editPath ? editPath.slice() : null;
  valuesEditorParentPath = parentPath ? parentPath.slice() : [];
  const title = document.getElementById(VALUES_EDITOR_TITLE_ID);
  const nameInput = document.getElementById(VALUES_EDITOR_NAME_ID);
  if (valuesEditorPath) {
    title.textContent = '编辑节点';
    nameInput.value = valuesEditorPath[valuesEditorPath.length - 1];
    populateValuesParentSelect(valuesEditorPath, valuesEditorPath.slice(0, -1));
  } else {
    title.textContent = parentPath && parentPath.length > 0 ? '添加子节点' : '新建节点';
    nameInput.value = '';
    populateValuesParentSelect(null, parentPath || []);
  }
  setValuesEditorMode('node');
  editor.hidden = false;
  closeValuesKeyEditor();
  closeValuesAddMenu();
  nameInput.focus();
}

// 变量编辑器：从已注册变量下拉选择（编辑时变量名只读），填写变量值。
// 子变量：值由父变量自动派生，值输入可留空（留空存 null，父变量存在时自动计算）。
function syncValuesKeyEntryChildHint() {
  const ctx = getContextSafe();
  const keySelect = document.getElementById(VALUES_EDITOR_KEY_SELECT_ID);
  const hint = document.getElementById(VALUES_EDITOR_CHILD_HINT_ID);
  const label = document.getElementById(VALUES_EDITOR_VALUE_LABEL_ID);
  const keyName = String(keySelect?.value || '').trim();
  const isChild = Boolean(keyName && ctx && isValuesChildKey(getValuesKeyByName(ctx, keyName)));
  if (hint) hint.hidden = !isChild;
  if (label) label.textContent = isChild ? '变量值（可留空）' : '变量值 *';
}

function openValuesKeyEntryEditor(parentPath, editPath) {
  const editor = document.getElementById(VALUES_EDITOR_ID);
  if (!editor) return;
  valuesEditorMode = 'key';
  valuesEditorPath = editPath ? editPath.slice() : null;
  valuesEditorParentPath = parentPath ? parentPath.slice() : [];
  fillValuesKeySelect();
  const title = document.getElementById(VALUES_EDITOR_TITLE_ID);
  const keySelect = document.getElementById(VALUES_EDITOR_KEY_SELECT_ID);
  const keyNameSpan = document.getElementById(VALUES_EDITOR_KEY_NAME_ID);
  const valueInput = document.getElementById(VALUES_EDITOR_VALUE_ID);
  if (valuesEditorPath) {
    title.textContent = '编辑变量';
    keySelect.hidden = true;
    keyNameSpan.hidden = false;
    keyNameSpan.textContent = valuesEditorPath[valuesEditorPath.length - 1];
    const node = valuesGetAtPath(valuesActiveTree, valuesEditorPath);
    valueInput.value = valuesIsContainer(node) ? '' : formatValuesLeafText(node);
  } else {
    title.textContent = '新建变量';
    keySelect.hidden = false;
    keyNameSpan.hidden = true;
    keySelect.value = '';
    valueInput.value = '';
  }
  syncValuesKeyEntryChildHint();
  setValuesEditorMode('key');
  editor.hidden = false;
  closeValuesKeyEditor();
  closeValuesAddMenu();
  (valuesEditorPath ? valueInput : keySelect).focus();
}

function closeValuesEditor() {
  const editor = document.getElementById(VALUES_EDITOR_ID);
  if (editor) editor.hidden = true;
  valuesEditorPath = null;
  valuesEditorMode = null;
}

// 解析「变量值」输入：数字 / 布尔 / null / 字符串。
function parseValuesEditorText(text) {
  const trimmed = String(text ?? '').trim();
  if (trimmed === 'null' || trimmed === '~') return { value: null };
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    if (Number.isFinite(num)) return { value: num };
  }
  if (trimmed === 'true') return { value: true };
  if (trimmed === 'false') return { value: false };
  return { value: trimmed };
}function saveValuesEditor() {
  const ctx = getContextSafe();
  if (!ctx || !valuesActiveTree) return;
  const nodeFields = document.getElementById(VALUES_EDITOR_NODE_FIELDS_ID);
  const keyFields = document.getElementById(VALUES_EDITOR_KEY_FIELDS_ID);
  const nodeVisible = Boolean(nodeFields && !nodeFields.hidden);
  const keyVisible = Boolean(keyFields && !keyFields.hidden);
  const tree = valuesActiveTree;

  if (nodeVisible && !keyVisible) {
    // 节点：只存名称与位置，节点不对应值。
    const name = String(document.getElementById(VALUES_EDITOR_NAME_ID)?.value || '').trim();
    if (!name) {
      valuesToastr('warning', '请填写节点名称');
      return;
    }
    let parentPath = [];
    try {
      const raw = String(document.getElementById(VALUES_EDITOR_PARENT_SELECT_ID)?.value || '').trim();
      if (raw) parentPath = JSON.parse(raw);
    } catch {}
    if (valuesEditorPath) {
      const oldPath = valuesEditorPath.slice();
      const newPath = parentPath.concat(name);
      if (isValuesPathAncestor(oldPath, parentPath)) {
        valuesToastr('warning', '不能挂到自己的后代节点下');
        return;
      }
      if (newPath.join('/') !== oldPath.join('/') && valuesGetAtPath(tree, newPath) !== undefined) {
        valuesToastr('warning', `已存在同名节点「${name}」`);
        return;
      }
      const node = valuesGetAtPath(tree, oldPath);
      valuesDeleteAtPath(tree, oldPath);
      valuesSetAtPath(tree, newPath, valuesIsContainer(node) ? node : {});
    } else {
      if (valuesGetAtPath(tree, parentPath.concat(name)) !== undefined) {
        valuesToastr('warning', `已存在同名节点「${name}」`);
        return;
      }
      valuesSetAtPath(tree, parentPath.concat(name), {});
      // 新建节点默认展开，方便继续往里挂条目；挂在子层时父节点一并展开以便看到新节点。
      valuesExpanded.add(parentPath.concat(name).join('/'));
      if (parentPath.length > 0) valuesExpanded.add(parentPath.join('/'));
    }
    logApp('info', valuesEditorPath ? '节点已更新' : '节点已添加', name, valuesActiveLayer);
    valuesToastr('success', valuesEditorPath ? '节点已保存' : '节点已添加');
  } else if (keyVisible && !nodeVisible) {
    // 变量：变量名来自注册表（编辑时固定）；父变量值必填，子变量可留空。
    const keyName = valuesEditorPath
      ? String(valuesEditorPath[valuesEditorPath.length - 1])
      : String(document.getElementById(VALUES_EDITOR_KEY_SELECT_ID)?.value || '').trim();
    if (!keyName) {
      valuesToastr('warning', '请选择已注册变量');
      return;
    }
    const registeredKey = getValuesKeyByName(ctx, keyName);
    const isChild = Boolean(registeredKey && isValuesChildKey(registeredKey));
    const valueText = String(document.getElementById(VALUES_EDITOR_VALUE_ID)?.value || '').trim();
    if (!isChild && valueText === '') {
      valuesToastr('warning', '请填写变量值');
      return;
    }
    const parsed = isChild && valueText === '' ? { value: null } : parseValuesEditorText(valueText);
    const parentPath = valuesEditorPath ? valuesEditorPath.slice(0, -1) : (valuesEditorParentPath || []);
    const newPath = parentPath.concat(keyName);
    if (!valuesEditorPath && valuesGetAtPath(tree, newPath) !== undefined) {
      valuesToastr('warning', `已存在同名变量「${keyName}」`);
      return;
    }
    valuesSetAtPath(tree, newPath, parsed.value);
    // 新建变量默认开启注入（仅默认数值层；打开变量会自动提升全部祖先节点）。
    if (!valuesEditorPath && valuesActiveLayer === 'default') {
      setValuesInjectPath(ctx, newPath, true);
    }
    logApp('info', valuesEditorPath ? '变量已更新' : '变量已添加', keyName, valuesActiveLayer);
    valuesToastr('success', valuesEditorPath
      ? '变量已保存'
      : (valuesActiveLayer === 'default' ? `变量「${keyName}」已添加（已默认开启注入）` : `变量「${keyName}」已添加`));
  } else {
    return;
  }
  saveValuesActiveTree(ctx, tree);
  closeValuesEditor();
  renderValuesTree();
  refreshHomeValuesStatus();
}

// 删除：节点带确认（连同子树）。
async function handleValuesDelete(path) {
  const ctx = getContextSafe();
  if (!ctx || !valuesActiveTree) return;
  const node = valuesGetAtPath(valuesActiveTree, path);
  if (node === undefined) return;
  const name = path[path.length - 1];
  const isNode = valuesIsContainer(node);
  const childCount = isNode ? Object.keys(node).length : 0;
  const confirmText = isNode
    ? (childCount > 0
      ? `确定删除节点「${name}」吗？其下 ${childCount} 个子条目会一并删除。`
      : `确定删除节点「${name}」吗？`)
    : `确定删除变量「${name}」吗？`;
  if (!(await kaleidoConfirm(confirmText))) return;
  valuesDeleteAtPath(valuesActiveTree, path);
  saveValuesActiveTree(ctx, valuesActiveTree);
  logApp('info', isNode ? '节点已删除' : '变量已删除', name, valuesActiveLayer);
  valuesToastr('success', `已删除「${name}」`);
  renderValuesTree();
  refreshHomeValuesStatus();
}
// ---------- 行拖动排序 ----------
// 按住拖动把手上下移动条目，松手后按新顺序回调 onReorder(row, fromIndex, toIndex)。
// 只允许在同级条目间排序：getSiblings 由调用方按行分组提供（树按父路径分组）。
let valuesDragState = null;

function initValuesDragReorder(container, handleSelector, getSiblings, onReorder) {
  if (!container) return;
  container.addEventListener('pointerdown', (event) => {
    if (valuesDragState) return;
    const target = event.target instanceof Element ? event.target : null;
    const handle = target ? target.closest(handleSelector) : null;
    if (!handle) return;
    const row = handle.closest('.kaleido-values__row');
    if (!row || !container.contains(row)) return;
    const siblings = getSiblings(row);
    const fromIndex = siblings.indexOf(row);
    if (fromIndex < 0) return;
    event.preventDefault();
    valuesDragState = { container, row, siblings, getSiblings, fromIndex, onReorder, startY: event.clientY, moved: false };
    row.classList.add('is-dragging');
    container.classList.add('is-reordering');
    document.addEventListener('pointermove', handleValuesDragMove);
    document.addEventListener('pointerup', handleValuesDragEnd);
    document.addEventListener('pointercancel', handleValuesDragEnd);
  });
}

function handleValuesDragMove(event) {
  const state = valuesDragState;
  if (!state) return;
  if (!state.moved && Math.abs(event.clientY - state.startY) < 4) return;
  state.moved = true;
  const { container, row, siblings } = state;
  let insertBefore = null;
  let found = false;
  for (const sibling of siblings) {
    if (sibling === row) continue;
    const rect = sibling.getBoundingClientRect();
    if (event.clientY < rect.top) {
      insertBefore = sibling;
      found = true;
      break;
    }
    if (event.clientY < rect.bottom) {
      insertBefore = event.clientY < rect.top + rect.height / 2 ? sibling : sibling.nextSibling;
      found = true;
      break;
    }
  }
  if (!found) insertBefore = null;
  if (insertBefore === row || insertBefore === row.nextSibling) return;
  container.insertBefore(row, insertBefore);
}

function handleValuesDragEnd() {
  const state = valuesDragState;
  if (!state) return;
  valuesDragState = null;
  document.removeEventListener('pointermove', handleValuesDragMove);
  document.removeEventListener('pointerup', handleValuesDragEnd);
  document.removeEventListener('pointercancel', handleValuesDragEnd);
  state.row.classList.remove('is-dragging');
  state.container.classList.remove('is-reordering');
  if (!state.moved) return;
  const finalIndex = state.getSiblings(state.row).indexOf(state.row);
  if (finalIndex >= 0 && finalIndex !== state.fromIndex) {
    state.onReorder(state.row, state.fromIndex, finalIndex);
  }
}

// 树行分组：同父路径的行视为同级（可互相排序）。
function valuesRowParentKey(row) {
  try {
    const path = JSON.parse(String(row?.dataset.path || '[]'));
    return path.slice(0, -1).join('/');
  } catch {
    return '';
  }
}

function valuesTreeSiblingsOf(row) {
  const body = document.getElementById(VALUES_TREE_BODY_ID);
  if (!body) return [];
  const parentKey = valuesRowParentKey(row);
  return Array.from(body.querySelectorAll('.kaleido-values__row')).filter((item) => valuesRowParentKey(item) === parentKey);
}

function valuesListSiblingsOf(container) {
  return () => Array.from(container.querySelectorAll('.kaleido-values__row'));
}

// 重排回调：读取当前 DOM 顺序写回数据层并重渲染。
function handleValuesKeysReorder() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const body = document.getElementById(VALUES_KEYS_BODY_ID);
  if (!body) return;
  const names = Array.from(body.querySelectorAll('.kaleido-values__row')).map((row) => String(row.dataset.name || ''));
  reorderValuesKeys(ctx, names);
  renderValuesKeys();
  logApp('info', '变量注册顺序已调整');
}

function handleValuesTriggersReorder() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const body = document.getElementById(VALUES_TRIGGERS_BODY_ID);
  if (!body) return;
  const ids = Array.from(body.querySelectorAll('.kaleido-values__row')).map((row) => String(row.dataset.id || ''));
  reorderValuesTriggers(ctx, ids);
  renderValuesTriggers();
  logApp('info', '剧情触发顺序已调整');
}

function handleValuesTreeReorder(row) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const body = document.getElementById(VALUES_TREE_BODY_ID);
  if (!body) return;
  const parentKey = valuesRowParentKey(row);
  const names = Array.from(body.querySelectorAll('.kaleido-values__row'))
    .filter((item) => valuesRowParentKey(item) === parentKey)
    .map((item) => {
      try {
        const path = JSON.parse(String(item.dataset.path || '[]'));
        return path[path.length - 1];
      } catch {
        return '';
      }
    });
  reorderValuesTreeAt(ctx, parentKey, names);
  renderValuesTree();
  logApp('info', '变量树顺序已调整', parentKey || '顶层');
}

// ---------- 变量注册表渲染 ----------
function renderValuesKeys() {
  const body = document.getElementById(VALUES_KEYS_BODY_ID);
  if (!body) return;
  const ctx = getContextSafe();
  const keys = ctx ? getValuesKeys(ctx) : [];
  refreshValuesNavCounts();
  body.innerHTML = '';
  if (keys.length === 0) {
    body.appendChild(buildValuesEmpty('还没有注册任何变量。点击上方「＋ 注册新变量」创建，\n注册时填写该变量的变化规则，AI 自动维护会严格按规则更新。'));
    return;
  }
  for (const key of keys) {
    const row = document.createElement('div');
    row.className = 'kaleido-values__row kaleido-values__row--key';
    row.dataset.name = String(key.name || '');
    const isBuiltin = isValuesBuiltinKey(key);
    const isChild = isValuesChildKey(key);
    const typeBadge = isChild
      ? `<span class="kaleido-values__row-type-badge is-child" title="子变量：值由父变量自动派生，不参与 AI 维护">子</span>`
      : `<span class="kaleido-values__row-type-badge" title="父变量：由 AI 按变化规则维护">父</span>`;
    // 内置行：带「内置」徽标、不可拖动、无删除按钮（编辑 = 按当前角色卡保存
    // 自定义规则并生成卡级覆盖，之后该行变为普通卡键行，删除即恢复内置默认）。
    const builtinBadge = isBuiltin
      ? `<span class="kaleido-values__row-type-badge is-builtin" title="内置变量：任何角色卡 / 聊天默认注册，可直接使用；编辑后按当前角色卡覆盖">内置</span>`
      : '';
    const ruleText = isChild
      ? `由「${String(key.parent || '')}」派生：${formatValuesChildRulesSummary(key)}`
      : String(key.rule || '（未填写变化规则）');
    const dragHandle = isBuiltin
      ? ''
      : `<button type="button" class="kaleido-values__drag-handle" data-action="drag" title="拖动排序" aria-label="拖动排序"><span class="${VALUES_DRAG_ICON_CLASS}"></span></button>`;
    const deleteButton = isBuiltin
      ? ''
      : `<button type="button" class="kaleido-values__icon-btn kaleido-values__icon-btn--danger" data-action="delete-key" title="删除变量" aria-label="删除变量"><span class="${VALUES_DELETE_ICON_CLASS}"></span></button>`;
    row.innerHTML = `
      ${dragHandle}
      <span class="kaleido-values__row-name is-registered" title="${isBuiltin ? '内置变量（默认注册，可直接使用）' : '已注册变量'}">${escapeHtml(String(key.name || ''))}</span>
      ${builtinBadge}${typeBadge}
      <span class="kaleido-values__row-rule" title="${escapeHtml(ruleText)}">${escapeHtml(ruleText)}</span>
      <span class="kaleido-values__row-actions">
        <button type="button" class="kaleido-values__icon-btn" data-action="edit-key" title="编辑变量" aria-label="编辑变量"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>
        ${deleteButton}
      </span>
    `;
    body.appendChild(row);
  }
}

// 子变量区间规则摘要（列表行 / 树行 title 用）。
function formatValuesChildRulesSummary(key) {
  const rules = Array.isArray(key?.rules) ? key.rules : [];
  return rules.map((rule) => {
    const min = rule?.min !== undefined ? String(rule.min) : '';
    const max = rule?.max !== undefined ? String(rule.max) : '';
    return `${min}~${max} ${String(rule?.value || '')}`;
  }).join('；');
}

// 父变量下拉：只列已注册的父变量（排除自身），供子变量选择。
function populateValuesKeyParentSelect(selectedParent) {
  const select = document.getElementById(VALUES_KEY_EDITOR_PARENT_ID);
  if (!select) return;
  const ctx = getContextSafe();
  const keys = ctx ? getValuesKeys(ctx) : [];
  select.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '（选择父变量）';
  select.appendChild(placeholder);
  for (const key of keys) {
    if (!isValuesParentKey(key)) continue;
    if (valuesKeyEditorName && String(key.name || '') === valuesKeyEditorName) continue;
    const option = document.createElement('option');
    option.value = String(key.name || '');
    option.textContent = String(key.name || '');
    select.appendChild(option);
  }
  select.value = String(selectedParent || '');
}

// 子变量区间规则行：下限 ~ 上限 + 文本 + 删除。
function buildValuesKeyRuleRow(rule) {
  const row = document.createElement('div');
  row.className = VALUES_KEY_EDITOR_RULE_ROW_CLASS;
  row.innerHTML = `
    <input type="text" inputmode="decimal" class="kaleido-input ${VALUES_KEY_EDITOR_RULE_MIN_CLASS}" placeholder="下限" title="父变量值下限（可留空 = 不设下限）" autocomplete="off" spellcheck="false" />
    <span class="kaleido-values__key-rule-tilde">~</span>
    <input type="text" inputmode="decimal" class="kaleido-input ${VALUES_KEY_EDITOR_RULE_MAX_CLASS}" placeholder="上限" title="父变量值上限（可留空 = 不设上限）" autocomplete="off" spellcheck="false" />
    <input type="text" class="kaleido-input ${VALUES_KEY_EDITOR_RULE_VALUE_CLASS}" placeholder="子变量文本" title="该区间对应的子变量文本" autocomplete="off" spellcheck="false" />
    <button type="button" class="kaleido-icon-btn ${VALUES_KEY_EDITOR_RULE_REMOVE_CLASS}" title="删除区间" aria-label="删除区间">✕</button>
  `;
  const minInput = row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MIN_CLASS);
  const maxInput = row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MAX_CLASS);
  const valueInput = row.querySelector('.' + VALUES_KEY_EDITOR_RULE_VALUE_CLASS);
  if (rule?.min !== undefined) minInput.value = String(rule.min);
  if (rule?.max !== undefined) maxInput.value = String(rule.max);
  if (rule?.value !== undefined) valueInput.value = String(rule.value);
  return row;
}

// 渲染子变量区间规则编辑器。
function renderValuesKeyRules(rules) {
  const container = document.getElementById(VALUES_KEY_EDITOR_RULES_ID);
  if (!container) return;
  container.innerHTML = '';
  const list = Array.isArray(rules) ? rules : [];
  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'kaleido-values__key-rules-empty';
    empty.textContent = '还没有区间规则：添加「父变量值区间 → 子变量文本」的映射，如 0~30 冷淡、31~60 颇具好感。';
    container.appendChild(empty);
  }
  for (const rule of list) {
    container.appendChild(buildValuesKeyRuleRow(rule));
  }
}

// 读取单行区间规则（文本为空返回 null，非法数字忽略）。
function readValuesKeyRuleFromRow(row) {
  if (!row) return null;
  const minText = String(row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MIN_CLASS)?.value || '').trim();
  const maxText = String(row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MAX_CLASS)?.value || '').trim();
  const value = String(row.querySelector('.' + VALUES_KEY_EDITOR_RULE_VALUE_CLASS)?.value || '').trim();
  if (value === '') return null;
  const rule = { value };
  if (minText !== '') {
    const min = Number(minText);
    if (Number.isFinite(min)) rule.min = min;
  }
  if (maxText !== '') {
    const max = Number(maxText);
    if (Number.isFinite(max)) rule.max = max;
  }
  return rule;
}

// 读取规则编辑器当前内容（空文本行丢弃，非法数字忽略）。
function readValuesKeyRules() {
  const container = document.getElementById(VALUES_KEY_EDITOR_RULES_ID);
  if (!container) return [];
  const rules = [];
  for (const row of container.querySelectorAll('.' + VALUES_KEY_EDITOR_RULE_ROW_CLASS)) {
    const rule = readValuesKeyRuleFromRow(row);
    if (rule) rules.push(rule);
  }
  return rules;
}

// 实时标红重叠 / 非法的区间行（只统计已填文本的行）。
function refreshValuesKeyRuleConflicts() {
  const container = document.getElementById(VALUES_KEY_EDITOR_RULES_ID);
  if (!container) return;
  const rows = Array.from(container.querySelectorAll('.' + VALUES_KEY_EDITOR_RULE_ROW_CLASS));
  const participating = [];
  rows.forEach((row, index) => {
    if (readValuesKeyRuleFromRow(row)) participating.push(index);
  });
  const validation = validateValuesChildRules(participating.map((index) => readValuesKeyRuleFromRow(rows[index])));
  const conflictSet = new Set();
  for (const [i, j] of validation.overlaps) {
    conflictSet.add(participating[i]);
    conflictSet.add(participating[j]);
  }
  for (const index of validation.invalid) conflictSet.add(participating[index]);
  rows.forEach((row, index) => row.classList.toggle('is-conflict', conflictSet.has(index)));
}

// 新行下限自动接续：上一行上限 + 1（如 0~1000 之后自动填 1001）。
function nextValuesChildRuleMinFromRow(row) {
  if (!row) return '';
  const maxText = String(row.querySelector('.' + VALUES_KEY_EDITOR_RULE_MAX_CLASS)?.value || '').trim();
  if (maxText === '') return '';
  const max = Number(maxText);
  if (!Number.isFinite(max)) return '';
  return String(max + 1);
}

// 类型切换联动：父变量显示变化规则，子变量显示父变量选择 + 派生区间。
function syncValuesKeyEditorTypeUI() {
  const typeSelect = document.getElementById(VALUES_KEY_EDITOR_TYPE_ID);
  const ruleFields = document.getElementById(VALUES_KEY_EDITOR_RULE_FIELDS_ID);
  const childFields = document.getElementById(VALUES_KEY_EDITOR_CHILD_FIELDS_ID);
  const isChild = String(typeSelect?.value || '') === VALUES_KEY_TYPE_CHILD;
  if (ruleFields) ruleFields.hidden = isChild;
  if (childFields) childFields.hidden = !isChild;
}

function openValuesKeyEditor(name) {
  const editor = document.getElementById(VALUES_KEY_EDITOR_ID);
  if (!editor) return;
  valuesKeyEditorName = name || null;
  const title = document.getElementById(VALUES_KEY_EDITOR_TITLE_ID);
  const nameInput = document.getElementById(VALUES_KEY_EDITOR_NAME_ID);
  const ruleInput = document.getElementById(VALUES_KEY_EDITOR_RULE_ID);
  const typeSelect = document.getElementById(VALUES_KEY_EDITOR_TYPE_ID);
  const ctx = getContextSafe();
  if (valuesKeyEditorName) {
    const key = getValuesKeyByName(ctx, valuesKeyEditorName);
    title.textContent = '编辑变量';
    nameInput.value = valuesKeyEditorName;
    nameInput.disabled = true;
    nameInput.title = '变量名是注册身份，不可修改；可删除后重新注册';
    const isChild = key ? isValuesChildKey(key) : false;
    typeSelect.value = isChild ? VALUES_KEY_TYPE_CHILD : VALUES_KEY_TYPE_PARENT;
    ruleInput.value = isChild ? '' : (key ? String(key.rule || '') : '');
    populateValuesKeyParentSelect(isChild ? String(key?.parent || '') : '');
    renderValuesKeyRules(isChild ? key?.rules : []);
  } else {
    title.textContent = '注册新变量';
    nameInput.value = '';
    nameInput.disabled = false;
    nameInput.title = '';
    typeSelect.value = VALUES_KEY_TYPE_PARENT;
    ruleInput.value = '';
    populateValuesKeyParentSelect('');
    renderValuesKeyRules([]);
  }
  syncValuesKeyEditorTypeUI();
  editor.hidden = false;
  closeValuesEditor();
  nameInput.focus();
}

function closeValuesKeyEditor() {
  const editor = document.getElementById(VALUES_KEY_EDITOR_ID);
  if (editor) editor.hidden = true;
  valuesKeyEditorName = null;
}

function saveValuesKeyEditor() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const name = String(document.getElementById(VALUES_KEY_EDITOR_NAME_ID)?.value || '').trim();
  if (!name) {
    valuesToastr('warning', '请填写变量名');
    return;
  }
  const type = String(document.getElementById(VALUES_KEY_EDITOR_TYPE_ID)?.value || '').trim() === VALUES_KEY_TYPE_CHILD
    ? VALUES_KEY_TYPE_CHILD
    : VALUES_KEY_TYPE_PARENT;
  if (type === VALUES_KEY_TYPE_CHILD) {
    const parent = String(document.getElementById(VALUES_KEY_EDITOR_PARENT_ID)?.value || '').trim();
    if (!parent) {
      valuesToastr('warning', '请选择父变量');
      return;
    }
    const rules = readValuesKeyRules();
    if (rules.length === 0) {
      valuesToastr('warning', '请至少添加一个派生区间');
      return;
    }
    const validation = validateValuesChildRules(rules);
    if (validation.invalid.length > 0) {
      valuesToastr('warning', `第 ${validation.invalid.map((index) => index + 1).join('、')} 行区间下限大于上限，请检查`);
      return;
    }
    if (validation.overlaps.length > 0) {
      const pairs = validation.overlaps.map(([i, j]) => `第 ${i + 1} 行与第 ${j + 1} 行`);
      valuesToastr('warning', `派生区间不能重叠（含边界）：${pairs.join('、')}，如 0~1000 之后只能从 1001 开始`);
      return;
    }
    upsertValuesKey(ctx, name, '', { type, parent, rules });
  } else {
    const rule = String(document.getElementById(VALUES_KEY_EDITOR_RULE_ID)?.value || '').trim();
    upsertValuesKey(ctx, name, rule, { type });
  }
  // 保存内置变量（友谊 / 友谊等级）时提示覆盖语义：编辑内置 = 生成卡级
  // 自定义规则，删除该卡键后恢复内置默认。
  const isBuiltinName = VALUES_BUILTIN_KEYS.some((key) => String(key?.name || '') === String(name || ''));
  logApp('info', valuesKeyEditorName ? '变量已更新' : '变量已注册', name);
  valuesToastr('success', valuesKeyEditorName
    ? (isBuiltinName ? `「${name}」自定义规则已保存（删除后恢复内置默认）` : '变量已保存')
    : (isBuiltinName ? `「${name}」已注册（覆盖内置默认规则）` : `变量「${name}」已注册`));
  closeValuesKeyEditor();
  renderValuesKeys();
  renderValuesTree();
  refreshHomeValuesStatus();
}

async function handleValuesDeleteKey(name) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const dependents = getValuesChildKeysByParent(ctx, name);
  if (dependents.length > 0) {
    valuesToastr('warning', `请先删除或改绑依赖它的子变量：${dependents.map((key) => key.name).join('、')}`);
    return;
  }
  // 删除内置变量名的卡键 = 删除自定义规则并恢复内置默认（内置本身不可删除）。
  const isBuiltinName = VALUES_BUILTIN_KEYS.some((key) => String(key?.name || '') === String(name || ''));
  const message = isBuiltinName
    ? `确定删除「${name}」的自定义规则吗？删除后将恢复内置默认规则。`
    : `确定删除已注册变量「${name}」吗？已存在的变量不会自动删除。`;
  if (!(await kaleidoConfirm(message))) return;
  deleteValuesKey(ctx, name);
  logApp('info', '变量已删除', name);
  valuesToastr('success', isBuiltinName ? `已删除「${name}」自定义规则，恢复内置默认` : `已删除变量「${name}」`);
  renderValuesKeys();
  renderValuesTree();
  refreshHomeValuesStatus();
}
// ---------- 剧情触发：列表 / 编辑器 ----------
// 剧情触发状态：只同步总开关滑块（开 / 关由滑块本身呈现，不再显示文字状态条）。
function refreshValuesTriggerStatus() {
  const toggle = document.getElementById(VALUES_TRIGGERS_TOGGLE_ID);
  if (!toggle) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  const enabled = settings ? settings.valuesTriggerEnabled !== false : true;
  toggle.classList.toggle('is-off', !enabled);
  toggle.setAttribute('aria-checked', String(Boolean(enabled)));
  toggle.title = enabled ? '点击关闭：发送前不再按变量条件触发剧情事件' : '点击开启：发送前按变量条件确定性触发剧情事件';
}

function toggleValuesTriggerSystem() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const settings = getSettings(ctx);
  settings.valuesTriggerEnabled = !(settings.valuesTriggerEnabled !== false);
  saveSettings(ctx);
  refreshValuesTriggerStatus();
  logApp('info', settings.valuesTriggerEnabled ? '剧情触发已开启' : '剧情触发已关闭');
  globalThis.toastr?.info?.('剧情触发已' + (settings.valuesTriggerEnabled ? '开启' : '关闭'), '[' + MODULE_DISPLAY_NAME + ']');
}

// 触发列表：名称 + 条件摘要 + 启用开关 + 编辑 / 删除。
function buildValuesTriggerRow(trigger) {
  const row = document.createElement('div');
  row.className = 'kaleido-values__row kaleido-values__row--trigger';
  row.dataset.id = String(trigger.id || '');
  const enabled = trigger.enabled !== false;
  const conditionsText = formatValuesTriggerConditions(trigger);
  const onceBadge = trigger.once === false
    ? '<span class="kaleido-values__row-trigger-type" title="常驻事件：条件满足时可重复触发">常驻</span>'
    : '<span class="kaleido-values__row-trigger-type is-once" title="一次性事件：触发一次后自动关闭">一次性</span>';
  row.innerHTML = `
    <button type="button" class="kaleido-values__drag-handle" data-action="drag" title="拖动排序" aria-label="拖动排序"><span class="${VALUES_DRAG_ICON_CLASS}"></span></button>
    <span class="kaleido-values__row-name" title="${escapeHtml(trigger.name)}">${escapeHtml(trigger.name)}</span>
    ${onceBadge}
    <span class="kaleido-values__row-trigger" title="${escapeHtml(conditionsText)}">${escapeHtml(conditionsText)}</span>
    <button type="button" class="kaleido-values__inject-switch${enabled ? '' : ' is-off'}" data-action="toggle-trigger" data-id="${escapeHtml(String(trigger.id || ''))}" role="switch" aria-checked="${enabled}" title="${enabled ? '点击关闭：该触发不再参与判定' : '点击激活：该触发重新参与判定'}" aria-label="启用 / 关闭触发"><span class="kaleido-values__inject-switch-thumb"></span></button>
    <span class="kaleido-values__row-actions">
      <button type="button" class="kaleido-values__icon-btn" data-action="edit-trigger" data-id="${escapeHtml(String(trigger.id || ''))}" title="编辑触发" aria-label="编辑触发"><span class="${VALUES_EDIT_ICON_CLASS}"></span></button>
      <button type="button" class="kaleido-values__icon-btn kaleido-values__icon-btn--danger" data-action="delete-trigger" data-id="${escapeHtml(String(trigger.id || ''))}" title="删除触发" aria-label="删除触发"><span class="${VALUES_DELETE_ICON_CLASS}"></span></button>
    </span>
  `;
  if (!enabled) row.classList.add('is-disabled');
  return row;
}

function renderValuesTriggers() {
  const body = document.getElementById(VALUES_TRIGGERS_BODY_ID);
  if (!body) return;
  const ctx = getContextSafe();
  const triggers = ctx ? getValuesTriggers(ctx) : [];
  refreshValuesNavCounts();
  refreshValuesTriggerStatus();
  body.innerHTML = '';
  if (triggers.length === 0) {
    body.appendChild(buildValuesEmpty('还没有剧情触发。点击上方「＋ 新建触发」创建：\n设置变量条件（如 张三/好感 >= 70），条件满足时自动注入对应剧情事件。'));
    return;
  }
  for (const trigger of triggers) {
    body.appendChild(buildValuesTriggerRow(trigger));
  }
}

// 条件路径下拉：列出变量树全部叶子路径（结构以默认值为准，游戏值同构）。
function populateValuesTriggerPathSelect(select, selectedPath) {
  if (!select) return;
  const ctx = getContextSafe();
  const tree = ctx ? getValuesDefaults(ctx) : {};
  const order = ctx ? getValuesTreeOrder(ctx) : {};
  select.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '（选择变量路径）';
  select.appendChild(placeholder);
  const walk = (node, path) => {
    if (!valuesIsContainer(node)) return;
    for (const key of valuesOrderedNames(order, path.join('/'), node)) {
      const childPath = path.concat(key);
      const child = node[key];
      if (valuesIsContainer(child)) {
        walk(child, childPath);
      } else {
        const option = document.createElement('option');
        option.value = childPath.join('/');
        option.textContent = childPath.join(' / ');
        select.appendChild(option);
      }
    }
  };
  walk(tree, []);
  const escapeCss = (typeof CSS !== 'undefined' && typeof CSS.escape === 'function')
    ? (value) => CSS.escape(value)
    : (value) => String(value).replace(/["\\]/g, '\\$&');
  const target = String(selectedPath || '');
  select.value = select.querySelector(`option[value="${escapeCss(target)}"]`) ? target : '';
}

// 条件行：路径 + 运算符 + 值（exists / not exists 隐藏值输入）+ 删除。
function buildValuesTriggerConditionRow(condition) {
  const row = document.createElement('div');
  row.className = VALUES_TRIGGER_CONDITION_ROW_CLASS;
  const pathSelect = document.createElement('select');
  pathSelect.className = 'kaleido-input ' + VALUES_TRIGGER_CONDITION_PATH_CLASS;
  populateValuesTriggerPathSelect(pathSelect, condition?.path || '');
  const opCenter = document.createElement('div');
  opCenter.className = VALUES_TRIGGER_CONDITION_OP_CENTER_CLASS;
  const opWrap = document.createElement('div');
  opWrap.className = VALUES_TRIGGER_CONDITION_OP_WRAP_CLASS;
  const opText = document.createElement('span');
  opText.className = VALUES_TRIGGER_CONDITION_OP_TEXT_CLASS;
  const opSelect = document.createElement('select');
  opSelect.className = 'kaleido-input ' + VALUES_TRIGGER_CONDITION_OP_CLASS;
  for (const op of VALUES_TRIGGER_OPS) {
    const option = document.createElement('option');
    option.value = op.value;
    option.textContent = op.label;
    opSelect.appendChild(option);
  }
  opSelect.value = VALUES_TRIGGER_OPS.some((op) => op.value === String(condition?.op || '').trim())
    ? String(condition?.op || '').trim()
    : '==';
  const syncOpText = () => {
    const matched = VALUES_TRIGGER_OPS.find((op) => op.value === String(opSelect.value || '').trim());
    opText.textContent = matched ? matched.value : String(opSelect.value || '');
    opWrap.title = matched ? matched.label : '';
  };
  const valueInput = document.createElement('input');
  valueInput.className = 'kaleido-input ' + VALUES_TRIGGER_CONDITION_VALUE_CLASS;
  valueInput.type = 'text';
  valueInput.placeholder = '如：70 / true / 友好';
  valueInput.autocomplete = 'off';
  valueInput.spellcheck = false;
  const value = condition?.value;
  valueInput.value = value === null || value === undefined ? '' : String(value);
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'kaleido-values__icon-btn kaleido-values__icon-btn--danger ' + VALUES_TRIGGER_CONDITION_REMOVE_CLASS;
  removeBtn.title = '删除条件';
  removeBtn.setAttribute('aria-label', '删除条件');
  removeBtn.innerHTML = `<span class="${VALUES_DELETE_ICON_CLASS}"></span>`;
  opWrap.append(opText, opSelect);
  opCenter.append(opWrap);
  row.append(pathSelect, opCenter, valueInput, removeBtn);
  const syncValueVisibility = () => {
    const op = String(opSelect.value || '').trim();
    valueInput.hidden = op === 'exists' || op === 'not exists';
  };
  opSelect.addEventListener('change', () => {
    syncOpText();
    syncValueVisibility();
  });
  syncOpText();
  syncValueVisibility();
  return row;
}

// 编辑器条件区：按草稿渲染全部条件行。
function renderValuesTriggerConditionRows() {
  const container = document.getElementById(VALUES_TRIGGER_EDITOR_CONDITIONS_ID);
  if (!container) return;
  container.innerHTML = '';
  for (const condition of valuesTriggerEditorConditions) {
    container.appendChild(buildValuesTriggerConditionRow(condition));
  }
}

function addValuesTriggerConditionRow() {
  valuesTriggerEditorConditions.push({ path: '', op: '==', value: null });
  renderValuesTriggerConditionRows();
}

// 读取编辑器条件区当前草稿（含用户未保存的修改）。
function readValuesTriggerConditionRows() {
  const container = document.getElementById(VALUES_TRIGGER_EDITOR_CONDITIONS_ID);
  if (!container) return valuesTriggerEditorConditions.slice();
  const conditions = [];
  container.querySelectorAll('.' + VALUES_TRIGGER_CONDITION_ROW_CLASS).forEach((row) => {
    const path = String(row.querySelector('.' + VALUES_TRIGGER_CONDITION_PATH_CLASS)?.value || '').trim();
    const op = String(row.querySelector('.' + VALUES_TRIGGER_CONDITION_OP_CLASS)?.value || '==').trim();
    const valueInput = row.querySelector('.' + VALUES_TRIGGER_CONDITION_VALUE_CLASS);
    const valueText = String(valueInput?.value || '').trim();
    const parsed = parseValuesEditorText(valueText);
    conditions.push({ path, op, value: parsed.value });
  });
  return conditions;
}

function openValuesTriggerEditor(item) {
  const editor = document.getElementById(VALUES_TRIGGER_EDITOR_ID);
  if (!editor) return;
  valuesTriggerEditorId = item && item.id ? item.id : null;
  valuesTriggerEditorConditions = Array.isArray(item?.conditions)
    ? item.conditions.map((condition) => ({ ...condition }))
    : [];
  const title = document.getElementById(VALUES_TRIGGER_EDITOR_TITLE_ID);
  const nameInput = document.getElementById(VALUES_TRIGGER_EDITOR_NAME_ID);
  const logicSelect = document.getElementById(VALUES_TRIGGER_EDITOR_LOGIC_ID);
  const onceSelect = document.getElementById(VALUES_TRIGGER_EDITOR_ONCE_ID);
  const descInput = document.getElementById(VALUES_TRIGGER_EDITOR_DESC_ID);
  const contentInput = document.getElementById(VALUES_TRIGGER_EDITOR_CONTENT_ID);
  if (title) title.textContent = valuesTriggerEditorId ? '编辑触发' : '新建触发';
  if (nameInput) nameInput.value = item?.name || '';
  if (logicSelect) {
    logicSelect.innerHTML = '';
    for (const option of VALUES_TRIGGER_LOGIC_OPTIONS) {
      const el = document.createElement('option');
      el.value = option.value;
      el.textContent = option.label;
      logicSelect.appendChild(el);
    }
    logicSelect.value = String(item?.logic || 'all') === 'any' ? 'any' : 'all';
  }
  if (onceSelect) {
    onceSelect.innerHTML = '';
    for (const option of VALUES_TRIGGER_ONCE_OPTIONS) {
      const el = document.createElement('option');
      el.value = option.value;
      el.textContent = option.label;
      onceSelect.appendChild(el);
    }
    onceSelect.value = item?.once === false ? 'persistent' : 'once';
  }
  if (descInput) descInput.value = item?.description || '';
  if (contentInput) contentInput.value = item?.content || '';
  renderValuesTriggerConditionRows();
  editor.hidden = false;
  closeValuesEditor();
  closeValuesKeyEditor();
  closeValuesAddMenu();
  nameInput?.focus();
}

function closeValuesTriggerEditor() {
  const editor = document.getElementById(VALUES_TRIGGER_EDITOR_ID);
  if (editor) editor.hidden = true;
  valuesTriggerEditorId = null;
  valuesTriggerEditorConditions = [];
}

function saveValuesTriggerEditor() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const name = String(document.getElementById(VALUES_TRIGGER_EDITOR_NAME_ID)?.value || '').trim();
  if (!name) {
    valuesToastr('warning', '请填写事件名称');
    return;
  }
  const content = String(document.getElementById(VALUES_TRIGGER_EDITOR_CONTENT_ID)?.value || '');
  if (!content.trim()) {
    valuesToastr('warning', '事件内容不能为空');
    return;
  }
  const logic = String(document.getElementById(VALUES_TRIGGER_EDITOR_LOGIC_ID)?.value || 'all').trim();
  const once = String(document.getElementById(VALUES_TRIGGER_EDITOR_ONCE_ID)?.value || 'once').trim() !== 'persistent';
  const conditions = readValuesTriggerConditionRows().filter((condition) => condition.path !== '');
  if (conditions.length === 0) {
    valuesToastr('warning', '请至少添加一个变量条件');
    return;
  }
  const data = {
    name,
    logic: logic === 'any' ? 'any' : 'all',
    once,
    description: String(document.getElementById(VALUES_TRIGGER_EDITOR_DESC_ID)?.value || '').trim(),
    conditions,
    content,
  };
  if (valuesTriggerEditorId) updateValuesTrigger(ctx, valuesTriggerEditorId, data);
  else createValuesTrigger(ctx, data);
  logApp('info', valuesTriggerEditorId ? '剧情触发已更新' : '剧情触发已添加', name);
  valuesToastr('success', valuesTriggerEditorId ? '触发已保存' : `触发「${name}」已创建`);
  closeValuesTriggerEditor();
  renderValuesTriggers();
  refreshHomeValuesStatus();
}

async function handleValuesDeleteTrigger(id) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const trigger = getValuesTriggerById(ctx, id);
  if (!trigger) return;
  if (!(await kaleidoConfirm(`确定删除剧情触发「${trigger.name}」吗？`))) return;
  deleteValuesTrigger(ctx, id);
  logApp('info', '剧情触发已删除', trigger.name);
  valuesToastr('success', '触发已删除');
  renderValuesTriggers();
  refreshHomeValuesStatus();
}

function handleValuesToggleTrigger(id) {
  const ctx = getContextSafe();
  if (!ctx) return;
  const trigger = toggleValuesTriggerEnabled(ctx, id);
  if (!trigger) return;
  logApp('info', trigger.enabled ? '剧情触发已激活' : '剧情触发已关闭', trigger.name);
  renderValuesTriggers();
}


// ---------- 自动维护状态 ----------
function refreshValuesMaintainStatus() {
  const status = document.getElementById(VALUES_MAINTAIN_STATUS_ID);
  if (!status) return;
  const ctx = getContextSafe();
  const settings = ctx ? getSettings(ctx) : null;
  const enabled = settings ? settings.valuesAutoUpdateEnabled !== false : true;
  const round = globalThis[VALUES_LAST_ROUND_KEY] || null;
  let text = enabled ? '自动维护：开' : '自动维护：关';
  if (!settings || !getApiBase(settings) || !String(settings?.model || '').trim()) {
    text += ' · API 未配置';
    status.dataset.state = 'warn';
  } else if (!round) {
    text += ' · 尚未运行';
    status.dataset.state = 'idle';
  } else if (round.error) {
    text += ` · 最近一轮失败：${round.error}`;
    status.dataset.state = 'error';
  } else if (round.skipped) {
    text += ' · 最近一轮：跳过';
    status.dataset.state = 'idle';
  } else if (round.changed && round.changed.length > 0) {
    text += ` · 最近一轮更新 ${round.changed.length} 项`;
    status.dataset.state = 'ok';
  } else {
    text += ' · 最近一轮无变化';
    status.dataset.state = 'ok';
  }
  status.textContent = text;
  status.title = round ? `最近一轮：${new Date(round.at).toLocaleString()}` : '';
}

// 游戏值重置：把当前聊天的游戏值整体重置为角色卡默认值（写入聊天文件）。
async function handleValuesResetGame() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const defaults = getValuesDefaults(ctx);
  const count = valuesCountEntries(defaults);
  const confirmText = count > 0
    ? `确定把游戏值重置为默认值吗？当前 ${count} 项游戏值会被默认值覆盖。`
    : '确定把游戏值重置为默认值吗？当前游戏值会被清空（默认值当前为空）。';
  if (!(await kaleidoConfirm(confirmText))) return;
  const saved = saveValuesChatState(ctx, cloneValue(defaults), { immediate: true });
  logApp('info', '游戏值已重置为默认值', `覆盖 ${count} 项`);
  valuesToastr('success', saved ? '游戏值已重置为默认值' : '游戏值已重置（写入聊天文件失败）');
  renderValuesTree();
  refreshHomeValuesStatus();
}
// ---------- 导入 / 导出 ----------
function handleValuesExportBundle() {
  const ctx = getContextSafe();
  if (!ctx) return;
  const filename = getValuesBundleFilename(ctx);
  if (downloadTextFile(filename, serializeValuesBundle(ctx))) {
    valuesToastr('success', `已导出变量包：${filename}`);
  }
}

async function handleValuesImportFile(file) {
  if (!file) return;
  const ctx = getContextSafe();
  if (!ctx) return;
  try {
    const text = await readTextFile(file);
    const parsed = parseValuesBundle(text);
    if (!(await kaleidoConfirm(
      '导入将更新变量注册表与默认值：\n- 同名变量更新变化规则，其余追加；\n- 默认值按路径合并，同名路径覆盖。\n继续？'
    ))) return;
    applyValuesBundle(ctx, parsed, 'merge');
    logApp('info', '变量包已导入', `变量 ${parsed.keys.length} 个`);
    valuesToastr('success', `已导入 ${parsed.keys.length} 个变量`);
    renderValuesTree();
    renderValuesKeys();
    refreshHomeValuesStatus();
  } catch (error) {
    const message = String(error?.message || error);
    logApp('warn', '变量包导入失败', message);
    valuesToastr('error', `导入失败：${message.slice(0, 160)}`);
  }
}// ---------- 内容事件绑定（对话框与面板视图共用） ----------
function bindValuesContentEvents() {
  document.getElementById(VALUES_TAB_TREE_ID)?.addEventListener('click', () => {
    document.getElementById(VALUES_TAB_TREE_ID)?.classList.add('is-active');
    document.getElementById(VALUES_TAB_KEYS_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TAB_TRIGGERS_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TAB_INJECT_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TREE_PANE_ID)?.classList.add('is-active');
    document.getElementById(VALUES_KEYS_PANE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TRIGGERS_PANE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_INJECT_PANE_ID)?.classList.remove('is-active');
    closeValuesEditor();
    closeValuesKeyEditor();
    closeValuesTriggerEditor();
    closeValuesAddMenu();
    renderValuesTree();
  });
  document.getElementById(VALUES_TAB_KEYS_ID)?.addEventListener('click', () => {
    document.getElementById(VALUES_TAB_TREE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TAB_KEYS_ID)?.classList.add('is-active');
    document.getElementById(VALUES_TAB_TRIGGERS_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TAB_INJECT_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TREE_PANE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_KEYS_PANE_ID)?.classList.add('is-active');
    document.getElementById(VALUES_TRIGGERS_PANE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_INJECT_PANE_ID)?.classList.remove('is-active');
    closeValuesEditor();
    closeValuesKeyEditor();
    closeValuesTriggerEditor();
    closeValuesAddMenu();
    renderValuesKeys();
  });
  document.getElementById(VALUES_TAB_TRIGGERS_ID)?.addEventListener('click', () => {
    document.getElementById(VALUES_TAB_TREE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TAB_KEYS_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TAB_TRIGGERS_ID)?.classList.add('is-active');
    document.getElementById(VALUES_TAB_INJECT_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TREE_PANE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_KEYS_PANE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TRIGGERS_PANE_ID)?.classList.add('is-active');
    document.getElementById(VALUES_INJECT_PANE_ID)?.classList.remove('is-active');
    closeValuesEditor();
    closeValuesKeyEditor();
    closeValuesTriggerEditor();
    closeValuesAddMenu();
    renderValuesTriggers();
  });

  document.getElementById(VALUES_TAB_INJECT_ID)?.addEventListener('click', () => {
    document.getElementById(VALUES_TAB_TREE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TAB_KEYS_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TAB_TRIGGERS_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TAB_INJECT_ID)?.classList.add('is-active');
    document.getElementById(VALUES_TREE_PANE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_KEYS_PANE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_TRIGGERS_PANE_ID)?.classList.remove('is-active');
    document.getElementById(VALUES_INJECT_PANE_ID)?.classList.add('is-active');
    closeValuesEditor();
    closeValuesKeyEditor();
    closeValuesTriggerEditor();
    closeValuesAddMenu();
    renderValuesInjectPreview();
  });

  document.getElementById(VALUES_LAYER_DEFAULT_ID)?.addEventListener('click', () => setValuesLayer('default'));
  document.getElementById(VALUES_LAYER_GAME_ID)?.addEventListener('click', () => setValuesLayer('game'));
  document.getElementById(VALUES_LAYER_TOGGLE_ID)?.addEventListener('click', () => {
    setValuesLayer(valuesActiveLayer === 'game' ? 'default' : 'game');
  });

  document.getElementById(VALUES_NAV_COLLAPSE_ID)?.addEventListener('click', () => setValuesNavCollapsed(true));
  document.getElementById(VALUES_NAV_EXPAND_ID)?.addEventListener('click', () => setValuesNavCollapsed(false));
  applyValuesNavState();

  document.getElementById(VALUES_ADD_ROOT_ID)?.addEventListener('click', (event) => {
    openValuesAddMenu(event.currentTarget, { root: true });
  });
  document.getElementById(VALUES_ADD_MENU_NODE_ID)?.addEventListener('click', () => handleValuesAddMenuPick('node'));
  document.getElementById(VALUES_ADD_MENU_KEY_ID)?.addEventListener('click', () => handleValuesAddMenuPick('key'));
  document.getElementById(VALUES_ADD_KEY_ID)?.addEventListener('click', () => openValuesKeyEditor(null));

  document.getElementById(VALUES_MAINTAIN_NOW_ID)?.addEventListener('click', () => {
    runValuesMaintainNow().then(() => {
      renderValuesTree();
      refreshHomeValuesStatus();
    });
  });

  document.getElementById(VALUES_RESET_GAME_ID)?.addEventListener('click', handleValuesResetGame);

  document.getElementById(VALUES_INJECT_TOGGLE_ID)?.addEventListener('click', (event) => {
    const ctx = getContextSafe();
    if (!ctx) return;
    const enabled = event.currentTarget.classList.contains('is-off');
    setValuesInjectEnabled(ctx, enabled);
    logApp('info', enabled ? '变量注入已开启' : '变量注入已关闭');
    refreshValuesInjectUI();
    renderValuesTree();
  });

  document.getElementById(VALUES_TRIGGERS_TOGGLE_ID)?.addEventListener('click', toggleValuesTriggerSystem);
  document.getElementById(VALUES_TRIGGERS_ADD_ID)?.addEventListener('click', () => openValuesTriggerEditor(null));
  document.getElementById(VALUES_TRIGGER_EDITOR_CANCEL_ID)?.addEventListener('click', closeValuesTriggerEditor);
  document.getElementById(VALUES_TRIGGER_EDITOR_SAVE_ID)?.addEventListener('click', saveValuesTriggerEditor);
  document.getElementById(VALUES_TRIGGER_EDITOR_CONDITION_ADD_ID)?.addEventListener('click', addValuesTriggerConditionRow);
  document.getElementById(VALUES_TRIGGER_EDITOR_CONDITIONS_ID)?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('.' + VALUES_TRIGGER_CONDITION_REMOVE_CLASS) : null;
    if (!button) return;
    const row = button.closest('.' + VALUES_TRIGGER_CONDITION_ROW_CLASS);
    if (!row) return;
    row.remove();
  });

  document.getElementById(VALUES_IMPORT_BTN_ID)?.addEventListener('click', () => {
    document.getElementById(VALUES_IMPORT_INPUT_ID)?.click();
  });
  document.getElementById(VALUES_IMPORT_INPUT_ID)?.addEventListener('change', (event) => {
    const file = event.target?.files?.[0];
    if (file) handleValuesImportFile(file);
    event.target.value = '';
  });
  document.getElementById(VALUES_EXPORT_BTN_ID)?.addEventListener('click', handleValuesExportBundle);

  const treeBody = document.getElementById(VALUES_TREE_BODY_ID);
  treeBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-action]') : null;
    if (!button) return;
    event.preventDefault();
    const action = String(button.dataset.action || '');
    const row = button.closest('.kaleido-values__row');
    const path = JSON.parse(String(row?.dataset.path || '[]'));
    const ctx = getContextSafe();
    if (!ctx || !valuesActiveTree) return;
    switch (action) {
      case 'toggle': {
        const key = path.join('/');
        if (valuesExpanded.has(key)) valuesExpanded.delete(key);
        else valuesExpanded.add(key);
        renderValuesTree();
        break;
      }
      case 'add-menu': {
        openValuesAddMenu(button, { path });
        break;
      }
      case 'edit': {
        const node = valuesGetAtPath(valuesActiveTree, path);
        if (valuesIsContainer(node)) openValuesNodeEditor(path.slice(0, -1), path);
        else openValuesKeyEntryEditor(path.slice(0, -1), path);
        break;
      }
      case 'delete': {
        handleValuesDelete(path);
        break;
      }
      default:
        break;
    }
  });

  // 双击行直接进入编辑（与行内编辑按钮一致：节点编辑节点、变量编辑变量）。
  // 按钮 / 输入框等交互元素上的双击不触发，避免与滑块、折叠等操作冲突。
  treeBody?.addEventListener('dblclick', (event) => {
    const interactive = event.target instanceof Element
      ? event.target.closest('button, input, select, textarea, label')
      : null;
    if (interactive) return;
    const row = event.target instanceof Element ? event.target.closest('.kaleido-values__row') : null;
    if (!row) return;
    const path = JSON.parse(String(row?.dataset.path || '[]'));
    const ctx = getContextSafe();
    if (!ctx || !valuesActiveTree || path.length === 0) return;
    const node = valuesGetAtPath(valuesActiveTree, path);
    if (valuesIsContainer(node)) {
      openValuesNodeEditor(path.slice(0, -1), path);
    } else {
      // 子变量由父变量派生，双击不进入编辑。
      const registered = getValuesKeyByName(ctx, path[path.length - 1]);
      if (registered && isValuesChildKey(registered)) return;
      openValuesKeyEntryEditor(path.slice(0, -1), path);
    }
  });

  // 行内注入滑块：勾选 / 取消勾选节点或变量（默认数值层）。半选点击 = 全选。
  treeBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-inject-toggle]') : null;
    if (!button) return;
    const row = button.closest('.kaleido-values__row');
    const path = JSON.parse(String(row?.dataset.path || '[]'));
    const ctx = getContextSafe();
    if (!ctx || !valuesActiveTree) return;
    const checked = button.classList.contains('is-off') || button.classList.contains('is-partial');
    setValuesInjectPath(ctx, path, checked);
    logApp('info', checked ? '已勾选注入条目' : '已取消勾选注入条目', path.join('/'));
    renderValuesTree();
  });

  const keysBody = document.getElementById(VALUES_KEYS_BODY_ID);
  keysBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-action]') : null;
    if (!button) return;
    event.preventDefault();
    const row = button.closest('.kaleido-values__row');
    const name = String(row?.dataset.name || '');
    const action = String(button.dataset.action || '');
    switch (action) {
      case 'edit-key': {
        openValuesKeyEditor(name);
        break;
      }
      case 'delete-key': {
        handleValuesDeleteKey(name);
        break;
      }
      default:
        break;
    }
  });

  const triggersBody = document.getElementById(VALUES_TRIGGERS_BODY_ID);
  triggersBody?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-action]') : null;
    if (!button) return;
    event.preventDefault();
    const id = String(button.dataset.id || '');
    const action = String(button.dataset.action || '');
    switch (action) {
      case 'edit-trigger': {
        const trigger = getValuesTriggerById(getContextSafe(), id);
        if (trigger) openValuesTriggerEditor(trigger);
        break;
      }
      case 'delete-trigger': {
        handleValuesDeleteTrigger(id);
        break;
      }
      case 'toggle-trigger': {
        handleValuesToggleTrigger(id);
        break;
      }
      default:
        break;
    }
  });

  document.getElementById(VALUES_EDITOR_CANCEL_ID)?.addEventListener('click', closeValuesEditor);
  document.getElementById(VALUES_EDITOR_SAVE_ID)?.addEventListener('click', saveValuesEditor);
  document.getElementById(VALUES_KEY_EDITOR_CANCEL_ID)?.addEventListener('click', closeValuesKeyEditor);
  document.getElementById(VALUES_KEY_EDITOR_SAVE_ID)?.addEventListener('click', saveValuesKeyEditor);
  document.getElementById(VALUES_KEY_EDITOR_TYPE_ID)?.addEventListener('change', syncValuesKeyEditorTypeUI);
  document.getElementById(VALUES_KEY_EDITOR_RULES_ADD_ID)?.addEventListener('click', () => {
    const container = document.getElementById(VALUES_KEY_EDITOR_RULES_ID);
    if (!container) return;
    const empty = container.querySelector('.kaleido-values__key-rules-empty');
    if (empty) empty.remove();
    const rows = container.querySelectorAll('.' + VALUES_KEY_EDITOR_RULE_ROW_CLASS);
    const lastRow = rows[rows.length - 1];
    const nextMin = nextValuesChildRuleMinFromRow(lastRow);
    container.appendChild(buildValuesKeyRuleRow(nextMin !== '' ? { min: Number(nextMin) } : {}));
    refreshValuesKeyRuleConflicts();
  });
  document.getElementById(VALUES_KEY_EDITOR_RULES_ID)?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('.' + VALUES_KEY_EDITOR_RULE_REMOVE_CLASS) : null;
    if (!button) return;
    button.closest('.' + VALUES_KEY_EDITOR_RULE_ROW_CLASS)?.remove();
    refreshValuesKeyRuleConflicts();
  });
  document.getElementById(VALUES_KEY_EDITOR_RULES_ID)?.addEventListener('input', () => {
    refreshValuesKeyRuleConflicts();
  });
  document.getElementById(VALUES_EDITOR_KEY_SELECT_ID)?.addEventListener('change', syncValuesKeyEntryChildHint);

  document.getElementById(VALUES_EDITOR_VALUE_ID)?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) saveValuesEditor();
  });
  document.getElementById(VALUES_KEY_EDITOR_RULE_ID)?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) saveValuesKeyEditor();
  });
  document.getElementById(VALUES_TRIGGER_EDITOR_CONTENT_ID)?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) saveValuesTriggerEditor();
  });

  // 行拖动排序：变量树 / 变量注册 / 剧情触发 三处列表。
  initValuesDragReorder(
    document.getElementById(VALUES_TREE_BODY_ID),
    '.kaleido-values__drag-handle',
    valuesTreeSiblingsOf,
    handleValuesTreeReorder
  );
  initValuesDragReorder(
    document.getElementById(VALUES_KEYS_BODY_ID),
    '.kaleido-values__drag-handle',
    valuesListSiblingsOf(document.getElementById(VALUES_KEYS_BODY_ID)),
    handleValuesKeysReorder
  );
  initValuesDragReorder(
    document.getElementById(VALUES_TRIGGERS_BODY_ID),
    '.kaleido-values__drag-handle',
    valuesListSiblingsOf(document.getElementById(VALUES_TRIGGERS_BODY_ID)),
    handleValuesTriggersReorder
  );

  if (!globalThis[VALUES_DIALOG_KEY + '_menu']) {
    globalThis[VALUES_DIALOG_KEY + '_menu'] = (event) => {
      const menu = document.getElementById(VALUES_ADD_MENU_ID);
      if (!menu || menu.hidden) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (menu.contains(target)) return;
      // 点「＋」按钮本身不算外部：按钮的 click 会负责打开/重定位菜单
      if (target.closest(`#${VALUES_ADD_ROOT_ID}, [data-action="add-menu"]`)) return;
      closeValuesAddMenu();
    };
    document.addEventListener('click', globalThis[VALUES_DIALOG_KEY + '_menu']);
  }
}// 工作台内容模板（树区 + 变量注册区 + 编辑器 + 新建菜单 + 文件输入）：
// 电脑端大窗口对话框与手机端面板视图共用。
function buildValuesContentHTML(editorClass) {
  return `
        <div class="kaleido-values__workbench">
          <button type="button" id="${VALUES_NAV_EXPAND_ID}" class="kaleido-values__nav-expand" title="展开导航" aria-label="展开导航" hidden>
            <span class="${VALUES_CHEVRON_ICON_CLASS}"></span>
          </button>
          <nav class="kaleido-values__nav" aria-label="变量系统导航">
            <div class="kaleido-values__nav-head">
              <span>视图</span>
              <button type="button" id="${VALUES_NAV_COLLAPSE_ID}" class="kaleido-values__nav-collapse" title="收起导航" aria-label="收起导航">
                <span class="${VALUES_NAV_COLLAPSE_ICON_CLASS}"></span>
              </button>
            </div>
            <button type="button" id="${VALUES_TAB_TREE_ID}" class="kaleido-values__nav-item is-active" role="tab" aria-selected="true" title="变量树：按节点层级查看与编辑变量">
              <span class="kaleido-values__nav-icon"><span class="${VALUES_TREE_ICON_CLASS}"></span></span>
              <span class="kaleido-values__nav-label">变量树</span>
              <span id="${VALUES_NAV_TREE_COUNT_ID}" class="kaleido-values__nav-badge" hidden>0</span>
            </button>
            <button type="button" id="${VALUES_TAB_KEYS_ID}" class="kaleido-values__nav-item" role="tab" aria-selected="false" title="变量注册：注册变量名与变化规则，AI 自动维护的唯一依据">
              <span class="kaleido-values__nav-icon"><span class="${VALUES_KEYS_ICON_CLASS}"></span></span>
              <span class="kaleido-values__nav-label">变量注册</span>
              <span id="${VALUES_NAV_KEYS_COUNT_ID}" class="kaleido-values__nav-badge" hidden>0</span>
            </button>
            <button type="button" id="${VALUES_TAB_TRIGGERS_ID}" class="kaleido-values__nav-item" role="tab" aria-selected="false" title="剧情触发：按变量当前值是否满足条件，确定性触发剧情事件（不依赖 AI 判断）">
              <span class="kaleido-values__nav-icon"><span class="${VALUES_TRIGGER_ICON_CLASS}"></span></span>
              <span class="kaleido-values__nav-label">剧情触发</span>
              <span id="${VALUES_NAV_TRIGGERS_COUNT_ID}" class="kaleido-values__nav-badge" hidden>0</span>
            </button>
            <button type="button" id="${VALUES_TAB_INJECT_ID}" class="kaleido-values__nav-item" role="tab" aria-selected="false" title="注入预览：查看实际注入提示词的 <Values> 内容（只读）">
              <span class="kaleido-values__nav-icon"><span class="${VALUES_INJECT_PREVIEW_ICON_CLASS}"></span></span>
              <span class="kaleido-values__nav-label">注入预览</span>
            </button>
          </nav>
          <div class="kaleido-values__main">
            <div id="${VALUES_TREE_PANE_ID}" class="kaleido-values__pane is-active">
              <div id="${VALUES_LAYER_ROW_ID}" class="kaleido-values__layer-row" data-layer="default" role="group" aria-label="编辑层">
                <span id="${VALUES_LAYER_ICON_ID}" class="kaleido-values__layer-icon"><span class="${VALUES_LAYER_DEFAULT_ICON_CLASS}"></span></span>
                <span id="${VALUES_LAYER_TITLE_ID}" class="kaleido-values__layer-title">默认数值</span>
                <span class="kaleido-values__toolbar-spacer"></span>
                <button type="button" id="${VALUES_LAYER_TOGGLE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" title="切换到游戏数值（聊天，AI 自动维护）">
                  <span class="${VALUES_LAYER_SWAP_ICON_CLASS}"></span> 切换到游戏数值
                </button>
                <button type="button" id="${VALUES_LAYER_GAME_ID}" class="kaleido-values__layer-btn" data-layer="game" hidden aria-hidden="true" tabindex="-1"></button>
                <button type="button" id="${VALUES_LAYER_DEFAULT_ID}" class="kaleido-values__layer-btn is-active" data-layer="default" hidden aria-hidden="true" tabindex="-1"></button>
              </div>
              <div class="kaleido-values__tree-actions">
                <button type="button" id="${VALUES_ADD_ROOT_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="新建节点或变量">＋ 新建</button>
                <span class="kaleido-values__toolbar-spacer"></span>
                <button type="button" id="${VALUES_MAINTAIN_NOW_ID}" class="kaleido-btn kaleido-btn--mini" title="手动对当前游戏值执行一轮 AI 维护">✨ 立即维护</button>
                <button type="button" id="${VALUES_RESET_GAME_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost" title="把当前聊天的游戏值整体重置为角色卡默认值">↺ 重置为默认值</button>
              </div>
              <div class="kaleido-values__status-strip">
                <span id="${VALUES_MAINTAIN_STATUS_ID}" class="kaleido-values__maintain-status" data-state="idle">自动维护：开 · 尚未运行</span>
                <span id="${VALUES_DEFAULT_HINT_ID}" class="kaleido-values__default-hint" hidden>默认值仅手动修改</span>
              </div>
              <div id="${VALUES_INJECT_BAR_ID}" class="kaleido-values__inject-bar">
                <div class="kaleido-values__inject-toggle" title="把勾选的节点与变量注入提示词（World Info after 之后）">
                  <button type="button" id="${VALUES_INJECT_TOGGLE_ID}" class="kaleido-values__inject-switch is-off" role="switch" aria-checked="false" aria-label="注入提示词开关"><span class="kaleido-values__inject-switch-thumb"></span></button>
                  <span class="kaleido-values__inject-toggle-label"><span class="${VALUES_INJECT_ICON_CLASS}"></span> 注入提示词</span>
                </div>
                <span id="${VALUES_INJECT_STATUS_ID}" class="kaleido-values__inject-status" data-state="idle">未开启 · 勾选条目后随提示词注入</span>
              </div>
              <div id="${VALUES_TREE_ID}" class="kaleido-values__tree">
                <div id="${VALUES_TREE_BODY_ID}" class="kaleido-values__tree-body"></div>
              </div>
            </div>
            <div id="${VALUES_KEYS_PANE_ID}" class="kaleido-values__pane" hidden>
              <div class="kaleido-values__keys-actions">
                <button type="button" id="${VALUES_ADD_KEY_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="注册新变量并填写变化规则">＋ 注册新变量</button>
              </div>
              <div id="${VALUES_KEYS_BODY_ID}" class="kaleido-values__keys-body"></div>
            </div>
            <div id="${VALUES_TRIGGERS_PANE_ID}" class="kaleido-values__pane" hidden>
              <div class="kaleido-values__triggers-actions">
                <div class="kaleido-values__inject-toggle" title="剧情触发总开关：开启后每次发送前按变量当前值判定并注入满足条件的事件">
                  <button type="button" id="${VALUES_TRIGGERS_TOGGLE_ID}" class="kaleido-values__inject-switch is-off" role="switch" aria-checked="false" aria-label="剧情触发开关"><span class="kaleido-values__inject-switch-thumb"></span></button>
                  <span class="kaleido-values__inject-toggle-label"><span class="${VALUES_TRIGGER_ICON_CLASS}"></span> 剧情触发</span>
                </div>
                <span class="kaleido-values__toolbar-spacer"></span>
                <button type="button" id="${VALUES_TRIGGERS_ADD_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary" title="新建剧情触发事件">＋ 新建触发</button>
              </div>
              <div id="${VALUES_TRIGGERS_BODY_ID}" class="kaleido-values__triggers-body"></div>
            </div>
            <div id="${VALUES_INJECT_PANE_ID}" class="kaleido-values__pane" hidden>
              <div class="kaleido-values__inject-preview-head">
                <span class="kaleido-values__inject-preview-title"><span class="${VALUES_INJECT_PREVIEW_ICON_CLASS}"></span> 注入预览</span>
                <span class="kaleido-values__inject-preview-hint">勾选变量并打开注入开关后，这里显示主模型实际读到的 <Values> 内容</span>
              </div>
              <pre id="${VALUES_INJECT_TEXT_ID}" class="kaleido-values__inject-text" spellcheck="false"></pre>
            </div>
            <div id="${VALUES_EDITOR_ID}" class="${editorClass}" hidden>
              <div class="kaleido-values__editor-head">
                <span id="${VALUES_EDITOR_TITLE_ID}" class="kaleido-values__editor-title">新建节点</span>
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_EDITOR_CANCEL_ID}" class="kaleido-icon-btn" title="取消" aria-label="取消">✕</button>
              </div>
              <div id="${VALUES_EDITOR_NODE_FIELDS_ID}">
                <label class="kaleido-api__field" for="${VALUES_EDITOR_NAME_ID}">
                  <span class="kaleido-api__label">节点名称 *</span>
                  <input id="${VALUES_EDITOR_NAME_ID}" class="kaleido-input" type="text" placeholder="如：张三 / 队伍 / 城镇" autocomplete="off" spellcheck="false" />
                </label>
                <label class="kaleido-api__field" for="${VALUES_EDITOR_PARENT_SELECT_ID}">
                  <span class="kaleido-api__label">上级节点</span>
                  <select id="${VALUES_EDITOR_PARENT_SELECT_ID}" class="kaleido-input">
                    <option value="">（顶层 · 根节点）</option>
                  </select>
                </label>
              </div>
              <div id="${VALUES_EDITOR_KEY_FIELDS_ID}" hidden>
                <label class="kaleido-api__field" for="${VALUES_EDITOR_KEY_SELECT_ID}">
                  <span class="kaleido-api__label">已注册变量 *</span>
                  <select id="${VALUES_EDITOR_KEY_SELECT_ID}" class="kaleido-input" title="变量必须先注册，新建时从这里选择"></select>
                  <span id="${VALUES_EDITOR_KEY_NAME_ID}" class="kaleido-values__editor-key-name" hidden></span>
                </label>
                <label class="kaleido-api__field" for="${VALUES_EDITOR_VALUE_ID}">
                  <span id="${VALUES_EDITOR_VALUE_LABEL_ID}" class="kaleido-api__label">变量值 *</span>
                  <textarea id="${VALUES_EDITOR_VALUE_ID}" class="kaleido-input kaleido-values__textarea kaleido-values__textarea--small" rows="2" placeholder="如：30 / 1000 / 友好 / true" spellcheck="false"></textarea>
                  <span id="${VALUES_EDITOR_CHILD_HINT_ID}" class="kaleido-values__editor-hint" hidden>子变量值由父变量自动计算，可留空</span>
                </label>
              </div>
              <div class="kaleido-values__editor-actions">
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_EDITOR_SAVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary">保存</button>
              </div>
            </div>
            <div id="${VALUES_KEY_EDITOR_ID}" class="${editorClass}" hidden>
              <div class="kaleido-values__editor-head">
                <span id="${VALUES_KEY_EDITOR_TITLE_ID}" class="kaleido-values__editor-title">注册新变量</span>
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_KEY_EDITOR_CANCEL_ID}" class="kaleido-icon-btn" title="取消" aria-label="取消">✕</button>
              </div>
              <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_NAME_ID}">
                <span class="kaleido-api__label">变量名 *</span>
                <input id="${VALUES_KEY_EDITOR_NAME_ID}" class="kaleido-input" type="text" placeholder="如：好感 / 金钱 / 体力" autocomplete="off" spellcheck="false" />
              </label>
              <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_TYPE_ID}">
                <span class="kaleido-api__label">变量类型</span>
                <select id="${VALUES_KEY_EDITOR_TYPE_ID}" class="kaleido-input" title="父变量：由 AI 按变化规则维护；子变量：值由同路径下的父变量按区间自动派生">
                  <option value="${VALUES_KEY_TYPE_PARENT}">父变量（AI 按变化规则维护）</option>
                  <option value="${VALUES_KEY_TYPE_CHILD}">子变量（由父变量自动派生）</option>
                </select>
              </label>
              <div id="${VALUES_KEY_EDITOR_RULE_FIELDS_ID}">
                <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_RULE_ID}">
                  <span class="kaleido-api__label">变化规则</span>
                  <textarea id="${VALUES_KEY_EDITOR_RULE_ID}" class="kaleido-input kaleido-values__textarea kaleido-values__textarea--small" rows="4" placeholder="如：好感随互动变化，友好互动 +5，冲突 -10，上限 100" spellcheck="false"></textarea>
                </label>
              </div>
              <div id="${VALUES_KEY_EDITOR_CHILD_FIELDS_ID}" hidden>
                <label class="kaleido-api__field" for="${VALUES_KEY_EDITOR_PARENT_ID}">
                  <span class="kaleido-api__label">父变量 *</span>
                  <select id="${VALUES_KEY_EDITOR_PARENT_ID}" class="kaleido-input" title="子变量的值由同路径下该父变量的值决定（如 张三/态度 ← 张三/好感度）"></select>
                </label>
                <div class="kaleido-api__field">
                  <span class="kaleido-api__label">派生区间 *</span>
                  <div id="${VALUES_KEY_EDITOR_RULES_ID}" class="kaleido-values__key-rules"></div>
                  <button type="button" id="${VALUES_KEY_EDITOR_RULES_ADD_ID}" class="kaleido-btn kaleido-btn--mini">＋ 添加区间</button>
                  <div class="kaleido-values__key-rules-hint">区间不能重叠（含边界）：如 0~1000 之后只能从 1001 开始；新行会自动接续下限。</div>
                </div>
              </div>
              <div class="kaleido-values__editor-actions">
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_KEY_EDITOR_SAVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary">保存</button>
              </div>
            </div>
            <div id="${VALUES_TRIGGER_EDITOR_ID}" class="${editorClass}" hidden>
              <div class="kaleido-values__editor-head">
                <span id="${VALUES_TRIGGER_EDITOR_TITLE_ID}" class="kaleido-values__editor-title">新建触发</span>
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_TRIGGER_EDITOR_CANCEL_ID}" class="kaleido-icon-btn" title="取消" aria-label="取消">✕</button>
              </div>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_NAME_ID}">
                <span class="kaleido-api__label">事件名称 *</span>
                <input id="${VALUES_TRIGGER_EDITOR_NAME_ID}" class="kaleido-input" type="text" placeholder="如：告白事件 / 战争爆发" autocomplete="off" spellcheck="false" />
              </label>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_LOGIC_ID}">
                <span class="kaleido-api__label">条件逻辑</span>
                <select id="${VALUES_TRIGGER_EDITOR_LOGIC_ID}" class="kaleido-input" title="全部满足（且）= 所有条件都满足才触发；任一满足（或）= 满足任意一条即触发"></select>
              </label>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_ONCE_ID}">
                <span class="kaleido-api__label">事件类型</span>
                <select id="${VALUES_TRIGGER_EDITOR_ONCE_ID}" class="kaleido-input" title="一次性事件：触发一次后自动关闭；常驻事件：条件满足时可重复触发"></select>
              </label>
              <div class="kaleido-api__field">
                <span class="kaleido-api__label">变量条件 *</span>
                <div id="${VALUES_TRIGGER_EDITOR_CONDITIONS_ID}" class="kaleido-values__trigger-conditions"></div>
                <button type="button" id="${VALUES_TRIGGER_EDITOR_CONDITION_ADD_ID}" class="kaleido-btn kaleido-btn--mini">＋ 添加条件</button>
              </div>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_DESC_ID}">
                <span class="kaleido-api__label">事件说明</span>
                <input id="${VALUES_TRIGGER_EDITOR_DESC_ID}" class="kaleido-input" type="text" placeholder="可选：一句话说明用途" autocomplete="off" spellcheck="false" />
              </label>
              <label class="kaleido-api__field" for="${VALUES_TRIGGER_EDITOR_CONTENT_ID}">
                <span class="kaleido-api__label">事件内容 *</span>
                <textarea id="${VALUES_TRIGGER_EDITOR_CONTENT_ID}" class="kaleido-input kaleido-values__textarea" rows="6" placeholder="条件满足后注入的剧情事件正文" spellcheck="false"></textarea>
              </label>
              <div class="kaleido-values__editor-actions">
                <span class="kaleido-values__editor-spacer"></span>
                <button type="button" id="${VALUES_TRIGGER_EDITOR_SAVE_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--primary">保存</button>
              </div>
            </div>
            <div id="${VALUES_ADD_MENU_ID}" class="kaleido-values__add-menu" hidden role="menu" aria-label="新建">
              <button type="button" id="${VALUES_ADD_MENU_NODE_ID}" class="kaleido-values__add-menu-item" role="menuitem" data-kind="node">新建节点</button>
              <button type="button" id="${VALUES_ADD_MENU_KEY_ID}" class="kaleido-values__add-menu-item" role="menuitem" data-kind="key">新建变量</button>
            </div>
            <input id="${VALUES_IMPORT_INPUT_ID}" type="file" accept=".yaml,.yml,text/yaml,application/x-yaml" hidden />
          </div>
        </div>
  `;
}

// ---------- 电脑端：独立大窗口工作台 ----------
function initValuesWorkbench() {
  if (getValuesWorkbench()) return;
  const dialog = document.createElement('div');
  dialog.id = VALUES_DIALOG_ID;
  dialog.className = 'kaleido-values-dialog';
  dialog.setAttribute('aria-hidden', 'true');
  dialog.innerHTML = `
    <div class="kaleido-values-dialog__inner" role="dialog" aria-label="变量工作台">
      <div class="kaleido-values-dialog__header">
        <span class="kaleido-values-dialog__title"><span class="${VALUES_ICON_CLASS}"></span> 变量系统</span>
        <span id="${VALUES_BINDING_ID}" class="kaleido-values__binding" data-state="idle" title="变量存储绑定状态">未绑定角色</span>
        <div class="kaleido-values-dialog__toolbar">
          <button type="button" id="${VALUES_IMPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini">导入 变量</button>
          <button type="button" id="${VALUES_EXPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost">导出 变量</button>
          <button type="button" id="${VALUES_CLOSE_BTN_ID}" class="kaleido-icon-btn" title="关闭工作台" aria-label="关闭工作台">✕</button>
        </div>
      </div>
      <div class="kaleido-values-dialog__body">
${buildValuesContentHTML('kaleido-values-dialog__editor')}
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  bindValuesContentEvents();
  document.getElementById(VALUES_CLOSE_BTN_ID)?.addEventListener('click', closeValuesWorkbench);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeValuesWorkbench();
  });
  if (!globalThis[VALUES_DIALOG_KEY]) {
    globalThis[VALUES_DIALOG_KEY] = (event) => {
      if (event.key !== 'Escape') return;
      const editor = document.getElementById(VALUES_EDITOR_ID);
      const keyEditor = document.getElementById(VALUES_KEY_EDITOR_ID);
      const triggerEditor = document.getElementById(VALUES_TRIGGER_EDITOR_ID);
      if (editor && !editor.hidden) {
        closeValuesEditor();
        return;
      }
      if (keyEditor && !keyEditor.hidden) {
        closeValuesKeyEditor();
        return;
      }
      if (triggerEditor && !triggerEditor.hidden) {
        closeValuesTriggerEditor();
        return;
      }
      if (isValuesWorkbenchOpen()) closeValuesWorkbench();
    };
    document.addEventListener('keydown', globalThis[VALUES_DIALOG_KEY]);
  }
}

// ---------- 手机端：面板内视图 ----------
function initValuesPanelView(panel) {
  if (!panel || document.getElementById(VALUES_VIEW_ID)) return;
  const section = document.createElement('section');
  section.id = VALUES_VIEW_ID;
  section.className = 'kaleido-view kaleido-values-view';
  section.setAttribute('aria-hidden', 'true');
  section.innerHTML = `
    <div class="kaleido-values__binding-row">
      <span id="${VALUES_BINDING_ID}" class="kaleido-values__binding" data-state="idle" title="变量存储绑定状态">未绑定角色</span>
      <div class="kaleido-values__binding-actions">
        <button type="button" id="${VALUES_IMPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini">导入</button>
        <button type="button" id="${VALUES_EXPORT_BTN_ID}" class="kaleido-btn kaleido-btn--mini kaleido-btn--ghost">导出</button>
      </div>
    </div>
${buildValuesContentHTML('kaleido-values__editor')}
  `;
  panel.querySelector('.kaleido-panel__body')?.appendChild(section);
  bindValuesContentEvents();
}

function initValuesSection(panel) {
  if (isNarrowViewport()) {
    initValuesPanelView(panel);
  } else {
    initValuesWorkbench();
  }
}


// ===== js/views-game.js =====
// ===== 万华镜（Kaleidoscope）游戏模式：玩家数据档案 =====
// 只读展示「变量系统」注入提示词的那些变量：当前游戏值总览，
// 让玩家随时看到当前游戏中的各种数据（角色属性、资源、好感、状态等）。
// 数据源与「变量注入」完全一致（getValuesGameTree），
// 展示的就是主模型实际看到的内容；本视图不提供任何编辑入口。
// 视觉：档案体例——朱砂印章节 + 点线目次，只呈现数值本身，不做工作台式标注。

function getGameView() {
  return document.getElementById(GAME_VIEW_ID);
}

function isGameViewActive() {
  const view = getGameView();
  return Boolean(view && view.classList.contains('is-active'));
}

// 刷新入口：视图打开 / 手动刷新 / 每轮生成结束后（若视图正打开）调用。
function renderGameView() {
  const view = getGameView();
  if (!view) return;
  const ctx = getContextSafe();
  renderGameMeta(ctx);
  renderGameTree(ctx);
}

// 视图正打开时刷新（变量维护完成 / 生成结束后调用，让面板数据保持最新）。
function refreshGameViewIfActive() {
  if (!isGameViewActive()) return;
  renderGameView();
}



// 封面副题：只保留最近更新时间（注入 / 自动维护等工程信息不面向玩家）。
function renderGameMeta(ctx) {
  const updated = document.getElementById(GAME_UPDATED_ID);
  if (!updated) return;
  const round = globalThis[VALUES_LAST_ROUND_KEY] || null;
  const state = ctx ? getValuesChatState(ctx) : null;
  const updatedAt = state?.updatedAt || round?.at || '';
  if (updatedAt) {
    updated.textContent = `最近更新 · ${new Date(updatedAt).toLocaleString()}`;
    updated.hidden = false;
  } else {
    updated.textContent = '';
    updated.hidden = true;
  }
}

// ---------- 档案正文（游戏值总览）----------
// 条目行：名称 + 点线目次 + 数值，一眼可读、无任何徽标。
function buildGameEntry(path, name, node, depth) {
  const entry = document.createElement('div');
  entry.className = 'kaleido-game__entry';
  entry.dataset.path = JSON.stringify(path);
  entry.style.setProperty('--depth', String(depth));
  const text = formatValuesLeafText(node);
  entry.innerHTML = [
    `<span class="kaleido-game__entry-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>`,
    '<span class="kaleido-game__entry-leader" aria-hidden="true"></span>',
    `<span class="kaleido-game__entry-value${typeof node === 'number' ? ' is-numeric' : ''}" title="${escapeHtml(text)}">${escapeHtml(text)}</span>`,
  ].join('');
  return entry;
}

// 章节头：朱砂印（章节名）+ 鎏金分隔线。
function buildGameChapter(path, name, depth) {
  const chapter = document.createElement('section');
  chapter.className = 'kaleido-game__chapter';
  chapter.dataset.path = JSON.stringify(path);
  chapter.style.setProperty('--depth', String(depth));
  chapter.innerHTML = `
    <header class="kaleido-game__chapter-head">
      <span class="kaleido-game__chapter-seal">${escapeHtml(name)}</span>
      <span class="kaleido-game__chapter-rule" aria-hidden="true"></span>
    </header>
  `;
  return chapter;
}

// 一层档案内容：先列条目（叶子），再排章节（容器）；全部平铺展示，不折叠。
function renderGameLevel(parent, ctx, node, path, depth) {
  const order = ctx ? getValuesTreeOrder(ctx) : {};
  const names = valuesOrderedNames(order, path.join('/'), node);
  const entries = document.createElement('div');
  entries.className = 'kaleido-game__entries';
  entries.style.setProperty('--depth', String(depth));
  for (const name of names) {
    const child = node[name];
    if (valuesIsContainer(child)) continue;
    entries.appendChild(buildGameEntry(path.concat(name), name, child, depth));
  }
  if (entries.childElementCount > 0) parent.appendChild(entries);
  for (const name of names) {
    const child = node[name];
    if (!valuesIsContainer(child)) continue;
    const childPath = path.concat(name);
    const chapter = buildGameChapter(childPath, name, depth);
    renderGameLevel(chapter, ctx, child, childPath, depth + 1);
    parent.appendChild(chapter);
  }
}

function renderGameTree(ctx) {
  const body = document.getElementById(GAME_TREE_ID);
  if (!body) return;
  const tree = ctx ? getValuesGameTree(ctx) : {};
  body.innerHTML = '';
  if (Object.keys(tree).length === 0) {
    const empty = document.createElement('div');
    empty.className = 'kaleido-game__empty';
    empty.textContent = '在「变量系统」登记变量并设置默认值后，这里会呈现你的游戏数据。';
    body.appendChild(empty);
    return;
  }
  renderGameLevel(body, ctx, tree, [], 0);
}

// ---------- 视图装配（手机端 / 电脑端共用面板内视图）----------
function initGameSection(panel) {
  if (!panel || document.getElementById(GAME_VIEW_ID)) return;
  const section = document.createElement('section');
  section.id = GAME_VIEW_ID;
  section.className = 'kaleido-view kaleido-game-view';
  section.setAttribute('aria-hidden', 'true');
  section.innerHTML = `
    <div class="kaleido-game">
      <!-- 档案封面 -->
      <div class="kaleido-game__cover">
        <span class="kaleido-game__cover-seal" aria-hidden="true"><span class="${GAME_ICON_CLASS}"></span></span>
        <span class="kaleido-game__cover-text">
          <span class="kaleido-game__cover-title">游戏档案</span>
          <span id="${GAME_UPDATED_ID}" class="kaleido-game__cover-updated" hidden title="最近一次游戏值写入时间"></span>
        </span>
        <span class="kaleido-game__cover-spacer"></span>
        <button type="button" id="${GAME_REFRESH_ID}" class="kaleido-game__refresh" title="刷新当前游戏数据">
          <span class="fa-solid fa-arrows-rotate"></span> 刷新
        </button>
        <button type="button" id="${GAME_GEAR_ID}" class="kaleido-game__gear" title="返回工作台主页" aria-label="返回工作台主页">
          <span class="fa-solid fa-house"></span>
        </button>
      </div>
      <!-- 档案正文：游戏值总览 -->
      <div id="${GAME_TREE_ID}" class="kaleido-game__tree"></div>
    </div>
  `;
  panel.querySelector('.kaleido-panel__body')?.appendChild(section);
  document.getElementById(GAME_REFRESH_ID)?.addEventListener('click', () => {
    renderGameView();
  });
  document.getElementById(GAME_GEAR_ID)?.addEventListener('click', () => showPanelView(HOME_VIEW_ID));
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
  // 变量自动维护：generationStarted → generationEnded 配对后，对最新两条消息
  // 发起一轮 AI 维护（更新聊天绑定的游戏值）；generationStopped / chatChanged
  // 清空配对跟踪，防止其他插件自行广播的 generationEnded 误触发。
  onHostEvent(ctx, 'generationStarted', onValuesGenerationStarted, VALUES_MAINTAIN_STARTED_KEY);
  onHostEvent(ctx, 'generationEnded', onValuesGenerationEnded, VALUES_MAINTAIN_HANDLER_KEY);
  onHostEvent(ctx, 'generationStopped', onValuesGenerationStopped, VALUES_MAINTAIN_STOPPED_KEY);
  onHostEvent(ctx, 'chatChanged', onValuesChatChanged, VALUES_MAINTAIN_CHAT_CHANGED_KEY);
  // 变量注入：generationEnded / generationStopped 后清空注入，下一轮发送前
  // 经发送屏障重新注入最新值（勾选条目见变量工作台「默认数值」层）。
  onHostEvent(ctx, 'generationEnded', onValuesInjectGenerationCleanup, VALUES_INJECT_CLEANUP_ENDED_KEY);
  onHostEvent(ctx, 'generationStopped', onValuesInjectGenerationCleanup, VALUES_INJECT_CLEANUP_STOPPED_KEY);
  // 剧情触发：generationEnded / generationStopped 后清空注入，下一轮发送前
  // 经发送屏障按最新变量值重新判定（条件与事件见变量工作台「剧情触发」页）。
  onHostEvent(ctx, 'generationEnded', onValuesTriggerGenerationCleanup, VALUES_TRIGGER_CLEANUP_ENDED_KEY);
  onHostEvent(ctx, 'generationStopped', onValuesTriggerGenerationCleanup, VALUES_TRIGGER_CLEANUP_STOPPED_KEY);
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

