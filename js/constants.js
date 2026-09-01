// ===== 万华镜（Kaleidoscope）全局常量 =====
const MODULE_NAME = 'Kaleidoscope';
const MODULE_DISPLAY_NAME = '万华镜';
const MODULE_VERSION = '1.4.4';
const GITHUB_REPO_URL = 'https://github.com/Rosa9527/Kaleidoscope';
// ---------- 版本检查（GitHub 对比） ----------
// 拉取远端 manifest.json 的两路源：raw 直链优先，失败回退 GitHub API（base64 解码）。
// raw.githubusercontent 与 api.github 均为公网只读资源，无需鉴权；与 SoulLink 同构。
const GITHUB_MANIFEST_URL = 'https://raw.githubusercontent.com/Rosa9527/Kaleidoscope/main/manifest.json';
const GITHUB_API_MANIFEST_URL = 'https://api.github.com/repos/Rosa9527/Kaleidoscope/contents/manifest.json';
const VERSION_CHECK_ID = 'kaleido-version-check';
// 检查结果缓存 1 小时：避免频繁联网；手动点击强制刷新。
const VERSION_CHECK_CACHE_MS = 60 * 60 * 1000;

// ---------- 主题 ----------
// 主题注册表：id 对应 style.css 中 [data-theme='...'] 的变量覆盖；name 显示在按钮与菜单里。
// 默认主题为「macOS 风格」（首位即默认，保持既有用户观感），新增主题只需在此追加条目
// 并在 style.css 补变量覆盖。
const THEME_ID = 'kaleido-theme';
const THEME_MENU_ID = 'kaleido-theme-menu';
const DEFAULT_THEME = 'doodle';
const THEMES = Object.freeze([
  { id: 'macos', name: 'macOS 风格' },
  { id: 'gufeng', name: '古风典雅' },
  { id: 'doodle', name: '手绘涂鸦' },
]);

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

// 预设模版（提示词预设管理 + 默认提示词编辑）
const PRESET_VIEW_ID = 'kaleido-preset-view';
const HOME_PRESET_CARD_ID = 'kaleido-home-preset-card';
const HOME_PRESET_STATUS_ID = 'kaleido-home-preset-status';
// 预设选择工具栏：下拉切换激活预设 + 另存 / 删除 / 导入 / 导出。
const PRESET_SELECTOR_ID = 'kaleido-preset-select';
const PRESET_SAVE_AS_ID = 'kaleido-preset-save-as';
const PRESET_DELETE_ID = 'kaleido-preset-delete';
const PRESET_EXPORT_ID = 'kaleido-preset-export';
const PRESET_IMPORT_BTN_ID = 'kaleido-preset-import-btn';
const PRESET_IMPORT_INPUT_ID = 'kaleido-preset-import-input';
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
// 剧情脉络 · 事件效果（触发时修改父变量）：行控件 class 复用变量系统的
// VALUES_TRIGGER_EFFECT_*（同款交互与样式），读取 / 删除委托按容器隔离。
const STORY_SCRIPT_EFFECTS_ID = 'kaleido-story-script-effects';
const STORY_SCRIPT_EFFECT_ADD_ID = 'kaleido-story-script-effect-add';
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
// ---------- 提示词预设（剧情预筛 + 变量维护 的一套具名配置）----------
// 一个预设 = { id, name, storyGatePrompt, valuesMaintainPrompt }。自定义预设列表
// 与剧情脉络同模式存角色卡 extensions，随角色卡导入/导出携带；群聊 / 未选角色 /
// 宿主不支持写卡时回退全局设置 promptPresets / promptPresetsActiveId。
// 内置「默认预设」是兜底配置，永不落盘：激活它时提示词取全局 settings 的
// storyGatePrompt / valuesMaintainPrompt（空串 = 出厂默认），见 prompt-preset-data.js。
const PROMPT_PRESET_CARD_EXTENSION_KEY = 'kaleidoscope_prompt_presets';
const PROMPT_PRESET_CARD_DATA_VERSION = 1;
const PROMPT_PRESET_DEFAULT_ID = '__default__';
const PROMPT_PRESET_DEFAULT_NAME = '默认预设';
const PROMPT_PRESET_BUNDLE_FORMAT = 'kaleidoscope-prompt-preset';
const PROMPT_PRESET_BUNDLE_VERSION = 1;
const PROMPT_PRESET_BUNDLE_FILENAME_PREFIX = '万华镜-提示词预设';
// chatChanged 时刷新预设模版页的宿主事件去重 key（onHostEvent 按 globalThis key 防重复挂载）。
const PROMPT_PRESET_CHAT_CHANGED_KEY = '__kaleido_prompt_preset_chat_changed__';
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
// 默认数值层「保存」按钮：把当前默认值立即保存到角色卡并从磁盘校验。
const VALUES_SAVE_NOW_ID = 'kaleido-values-save-now';
const VALUES_SAVE_ICON_CLASS = 'fa-solid fa-floppy-disk';
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
// 子变量派生方式：区间（单派生源数值 + 区间规则，输出文本）/ 取值映射（单
// 派生源取值 + 等值映射，输出文本）/ 公式（引用变量四则运算，输出数值）。
const VALUES_KEY_DERIVE_RULES = 'rules';
const VALUES_KEY_DERIVE_MAP = 'map';
const VALUES_KEY_DERIVE_FORMULA = 'formula';
const VALUES_KEY_EDITOR_DERIVE_ID = 'kaleido-values-key-editor-derive';
const VALUES_KEY_EDITOR_FORMULA_ID = 'kaleido-values-key-editor-formula';
const VALUES_KEY_EDITOR_FORMULA_FIELDS_ID = 'kaleido-values-key-editor-formula-fields';
const VALUES_KEY_EDITOR_DECIMALS_ID = 'kaleido-values-key-editor-decimals';
const VALUES_KEY_EDITOR_RULES_FIELDS_ID = 'kaleido-values-key-editor-rules-fields';
const VALUES_KEY_EDITOR_PARENT_FIELDS_ID = 'kaleido-values-key-editor-parent-fields';
const VALUES_KEY_EDITOR_MAP_FIELDS_ID = 'kaleido-values-key-editor-map-fields';
const VALUES_KEY_EDITOR_MAP_RULES_ID = 'kaleido-values-key-editor-map-rules';
const VALUES_KEY_EDITOR_MAP_RULES_ADD_ID = 'kaleido-values-key-editor-map-rules-add';
const VALUES_KEY_EDITOR_MAP_RULE_ROW_CLASS = 'kaleido-values__key-map-row';
const VALUES_KEY_EDITOR_MAP_MATCH_CLASS = 'kaleido-values__key-map-match';
const VALUES_KEY_EDITOR_MAP_VALUE_CLASS = 'kaleido-values__key-map-value';
const VALUES_KEY_EDITOR_MAP_REMOVE_CLASS = 'kaleido-values__key-map-remove';
const VALUES_EDITOR_CHILD_HINT_ID = 'kaleido-values-editor-child-hint';
// 变量 · 角色卡绑定（与剧情脉络同模式）：数据存角色卡 extensions，
// 随角色卡导入/导出自动携带；群聊/未选角色时回退全局设置 valuesData。
const VALUES_CARD_EXTENSION_KEY = 'kaleidoscope_values';
const VALUES_CARD_DATA_VERSION = 1;
// 宿主 merge-attributes 是深合并语义：只更新请求里出现的键，请求里没有的键
// 原样保留。删除键必须用哨兵值显式标记（TauriTavern 与 SillyTavern 同约定），
// 否则删除操作会被合并语义吞掉：merge 返回 ok:true 但角色卡从未改变。
const VALUES_UNSET_SENTINEL = '__@@UNSET@@__';
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
    rule: '友谊度区间为0~100，变化幅度取决于当前关系——例如:泛泛之交打招呼可以+3，而莫逆之交则不会变化；较大利益赠予对泛泛之交+20，但对莫逆之交可能只+10。修改须判断当前行为在当前关系下是否应产生好感度变化。',
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
    rule: '情欲值的变化幅度取决于亲密行为的强度,而非日常互动的日积月累——例如:一个暧昧的眼神对视只能有+5左右的小增量,一次亲吻可以带来+10甚至更多的跃迁式增长,发生关系则会直接带来+30以上的大幅跃升;但同样的行为,对情欲值已经很高的关系（lv3以上）加成会递减,后期的增长更多依赖亲密互动的频率与默契积累,而非单次行为本身的强度。',
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
const VALUES_MAINTAIN_MAX_TOKENS = 8192;
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
// 剧情触发 · 事件效果（触发时修改父变量）：效果行控件 class 独立命名，
// 样式与条件行一致（style.css 组选择器），读取 / 删除委托按容器隔离。
const VALUES_TRIGGER_EDITOR_EFFECTS_ID = 'kaleido-values-trigger-editor-effects';
const VALUES_TRIGGER_EDITOR_EFFECT_ADD_ID = 'kaleido-values-trigger-editor-effect-add';
const VALUES_TRIGGER_EFFECT_ROW_CLASS = 'kaleido-values__trigger-effect';
const VALUES_TRIGGER_EFFECT_PATH_CLASS = 'kaleido-values__trigger-effect-path';
const VALUES_TRIGGER_EFFECT_OP_CENTER_CLASS = 'kaleido-values__trigger-effect-op-center';
const VALUES_TRIGGER_EFFECT_OP_WRAP_CLASS = 'kaleido-values__trigger-effect-op-wrap';
const VALUES_TRIGGER_EFFECT_OP_TEXT_CLASS = 'kaleido-values__trigger-effect-op-text';
const VALUES_TRIGGER_EFFECT_OP_CLASS = 'kaleido-values__trigger-effect-op';
const VALUES_TRIGGER_EFFECT_VALUE_CLASS = 'kaleido-values__trigger-effect-value';
const VALUES_TRIGGER_EFFECT_REMOVE_CLASS = 'kaleido-values__trigger-effect-remove';
// 效果类型：add = 加减值（正加负减，当前值需可转数字）；set = 覆盖（数字/文本/布尔/null 均可）。
const VALUES_TRIGGER_EFFECT_OPS = Object.freeze([
  { value: 'add', display: '+/-', label: '加减值（+/-，正加负减）' },
  { value: 'set', display: '＝', label: '覆盖（直接设为指定值）' },
]);
// 剧情触发 · 注入与轮次记录
const VALUES_TRIGGER_INJECT_KEY = 'Kaleidoscope_Trigger_Event';
const VALUES_TRIGGER_LAST_ROUND_KEY = '__kaleido_values_trigger_last_round__';
const VALUES_TRIGGER_CLEANUP_ENDED_KEY = '__kaleido_values_trigger_cleanup_ended__';
const VALUES_TRIGGER_CLEANUP_STOPPED_KEY = '__kaleido_values_trigger_cleanup_stopped__';
// 剧情触发 · 条件运算符与逻辑选项
const VALUES_TRIGGER_OPS = Object.freeze([
  { value: '==', display: '＝', label: '等于（==）' },
  { value: '!=', display: '≠', label: '不等于（!=）' },
  { value: '>', display: '>', label: '大于（>）' },
  { value: '>=', display: '≥', label: '大于等于（>=）' },
  { value: '<', display: '<', label: '小于（<）' },
  { value: '<=', display: '≤', label: '小于等于（<=）' },
  { value: 'contains', display: '包含', label: '包含（contains）' },
  { value: 'exists', display: '存在', label: '存在（exists）' },
  { value: 'not exists', display: '不存在', label: '不存在（not exists）' },
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
// ---------- 地图系统（游戏地图：角色卡绑定）----------
// 地图数据存角色卡 extensions['kaleidoscope_map']，随角色卡导入/导出自动携带；
// 群聊 / 未选角色时回退全局设置 mapData。背景图为裁剪后的 base64 PNG，
// 地点坐标为背景图百分比（0~100），展示与编辑按比例缩放对齐。
const MAP_CARD_EXTENSION_KEY = 'kaleidoscope_map';
const MAP_CARD_DATA_VERSION = 1;
// 裁剪导出最长边上限（px）：超出等比降采样，避免角色卡被超大图片撑爆。
const MAP_IMAGE_MAX_DIM = 1600;
// 背景图 dataURL 超过该长度（字符数）时提示体积偏大。
const MAP_IMAGE_MAX_LEN = 1.5 * 1024 * 1024;
const MAP_DEFAULT_POINT_NAME = '新地点';
const MAP_POINT_NAME_MAX = 40;
// 游戏模式 · 地图展示（游戏地图 / 游戏数据 两个切换图标）
const GAME_MAP_TAB_ID = 'kaleido-game-map-tab';
const GAME_DATA_TAB_ID = 'kaleido-game-data-tab';
const GAME_MAP_PANE_ID = 'kaleido-game-map-pane';
const GAME_SWITCH_ID = 'kaleido-game-switch';
const GAME_LAUNCHER_HINT_ID = 'kaleido-game-launcher-hint';
const MAP_GO_EDIT_ID = 'kaleido-map-go-edit';
const MAP_ICON_CLASS = 'fa-solid fa-map';
const MAP_DATA_ICON_CLASS = 'fa-solid fa-chart-simple';
const MAP_POINT_ICON_CLASS = 'fa-solid fa-location-dot';
const MAP_CROP_ICON_CLASS = 'fa-solid fa-crop';
// 变量工作台 · 地图编辑器（第 5 个 tab）
const VALUES_TAB_MAP_ID = 'kaleido-values-tab-map';
const VALUES_MAP_PANE_ID = 'kaleido-values-map-pane';
const MAP_BINDING_ID = 'kaleido-map-binding';
const MAP_UPLOAD_BTN_ID = 'kaleido-map-upload-btn';
const MAP_UPLOAD_INPUT_ID = 'kaleido-map-upload-input';
const MAP_CROP_BTN_ID = 'kaleido-map-crop-btn';
const MAP_ADD_POINT_ID = 'kaleido-map-add-point';
const MAP_SAVE_ID = 'kaleido-map-save';
const MAP_DELETE_ID = 'kaleido-map-delete';
const MAP_STAGE_ID = 'kaleido-map-stage';
const MAP_CANVAS_ID = 'kaleido-map-canvas';
const MAP_STAGE_IMG_ID = 'kaleido-map-stage-img';
const MAP_POINTS_ID = 'kaleido-map-points';
const MAP_EMPTY_ID = 'kaleido-map-empty';
const MAP_HINT_ID = 'kaleido-map-hint';
const MAP_POINT_EDITOR_ID = 'kaleido-map-point-editor';
const MAP_POINT_NAME_ID = 'kaleido-map-point-name';
const MAP_POINT_REMOVE_ID = 'kaleido-map-point-remove';
const MAP_POINT_EDITOR_CLOSE_ID = 'kaleido-map-point-editor-close';
// 裁剪弹层（全屏遮罩，挂在 body；is-open 控制显示）
const MAP_CROP_DIALOG_ID = 'kaleido-map-crop-dialog';
const MAP_CROP_STAGE_ID = 'kaleido-map-crop-stage';
const MAP_CROP_VIEW_ID = 'kaleido-map-crop-view';
const MAP_CROP_IMG_ID = 'kaleido-map-crop-img';
const MAP_CROP_BOX_ID = 'kaleido-map-crop-box';
const MAP_CROP_INFO_ID = 'kaleido-map-crop-info';
const MAP_CROP_CONFIRM_ID = 'kaleido-map-crop-confirm';
const MAP_CROP_CANCEL_ID = 'kaleido-map-crop-cancel';
// 编辑器内存态 / 事件去重 key
const MAP_EDITOR_KEY = '__kaleido_map_editor__';
const MAP_CROP_ESC_KEY = '__kaleido_map_crop_esc_key__';
const MAP_EDITOR_EVENTS_KEY = '__kaleido_map_editor_events__';
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
  valuesMaintainPrompt: '',
  // 提示词预设的全局兜底存储：仅在没有角色卡可写（群聊 / 未选角色 / 宿主不支持
  // 写角色卡）时使用；有角色卡时预设列表存角色卡 extensions（随卡携带）。
  promptPresets: [],
  promptPresetsActiveId: PROMPT_PRESET_DEFAULT_ID,
  valuesNavCollapsed: false,
  theme: DEFAULT_THEME,
  mapData: null,
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
  [HOME_VIEW_ID]: 'Kaleidoscope', // 首页标题：英文铜板体字标（Copperplate）
  [API_VIEW_ID]: 'API 连接',
  [LOG_VIEW_ID]: '系统日志',
  [PRESET_VIEW_ID]: '预设模版',
  [INJECT_VIEW_ID]: '注入实录',
  [STORY_VIEW_ID]: '剧情脉络',
  [VALUES_VIEW_ID]: '变量系统',
  [GAME_VIEW_ID]: '游戏模式',
});
// 宽视图模式：日志视图需要更宽的窗口展示时间/级别/来源/内容。
// 游戏模式也加宽：地图展示需要更大的展示空间（地图图片随面板宽度缩放）。
const PANEL_WIDE_MODES = Object.freeze({
  [LOG_VIEW_ID]: 'is-log-mode',
  [PRESET_VIEW_ID]: 'is-preset-mode',
  [INJECT_VIEW_ID]: 'is-inject-mode',
  [STORY_VIEW_ID]: 'is-story-mode',
  [VALUES_VIEW_ID]: 'is-values-mode',
  [GAME_VIEW_ID]: 'is-game-mode',
});
const ESC_KEY_HANDLER_KEY = '__kaleido_esc_key_handler__';
const MENU_RECOVERY_OBSERVER_KEY = '__kaleido_menu_recovery_observer__';
const HOST_EVENT_WATCHDOG_KEY = '__kaleido_host_event_watchdog__';

