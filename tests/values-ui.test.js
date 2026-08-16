// 万华镜变量工作台 UI 交互测试（jsdom）：工作台创建 / 键注册 / 节点与键 / 层切换。
'use strict';
const { JSDOM } = require('jsdom');
const { readSources, loadInContext, createRunner, makeContext, makeCharacter } = require('./harness');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

const toasts = [];
const quietConsole = {
  log() {}, info() {}, debug() {},
  warn(...args) { console.warn(...args); },
  error(...args) { console.error(...args); },
};

const hostCtx = makeContext();
hostCtx.chatMetadata = {};
hostCtx.saveChat = () => {};
const sandbox = {
  console: quietConsole,
  document: dom.window.document,
  window: dom.window,
  Element: dom.window.Element,
  MouseEvent: dom.window.MouseEvent,
  KeyboardEvent: dom.window.KeyboardEvent,
  Event: dom.window.Event,
  localStorage: dom.window.localStorage,
  Blob: dom.window.Blob,
  FileReader: dom.window.FileReader,
  setTimeout, clearTimeout, setInterval, clearInterval,
  URL: Object.assign(globalThis.URL, {
    createObjectURL: () => 'blob:mock',
    revokeObjectURL: () => {},
  }),
  toastr: {
    success: (msg) => toasts.push(['success', msg]),
    info: (msg) => toasts.push(['info', msg]),
    warning: (msg) => toasts.push(['warning', msg]),
    error: (msg) => toasts.push(['error', msg]),
  },
  Luker: { getContext: () => hostCtx },
};

const ui = loadInContext(sandbox, readSources());
const runner = createRunner();
const assert = (condition, message) => { if (!condition) throw new Error(message || '断言失败'); };
const $ = (id) => dom.window.document.getElementById(id);

function click(el) {
  el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

async function flush() {
  await new Promise((resolve) => setTimeout(resolve, 10));
}

// 自绘确认弹层（kaleidoConfirm）辅助：宿主拦截原生 confirm，测试改为点击弹层按钮。
function confirmOverlay() {
  const overlay = $('kaleido-confirm-overlay');
  return overlay && overlay.classList.contains('is-open') ? overlay : null;
}

function confirmMessage() {
  return confirmOverlay()?.querySelector('.kaleido-confirm__message').textContent || '';
}

function clickConfirmOk() {
  const overlay = confirmOverlay();
  assert(overlay, '确认弹层应已打开');
  click(overlay.querySelector('.kaleido-confirm__ok'));
}

function setValue(id, value) {
  const el = $(id);
  assert(el, `缺少输入框 ${id}`);
  el.value = value;
}

function treeRows() {
  return Array.from($('kaleido-values-tree-body').querySelectorAll('.kaleido-values__row'));
}

function rowNames() {
  return treeRows().map((row) => row.querySelector('.kaleido-values__row-name')?.textContent || '');
}

function rowByName(name) {
  const row = treeRows().find((r) => (r.querySelector('.kaleido-values__row-name')?.textContent || '') === name);
  assert(row, `未找到行：${name}`);
  return row;
}

function rowByPath(path) {
  const key = path.join('/');
  const row = treeRows().find((r) => JSON.parse(r.dataset.path || '[]').join('/') === key);
  assert(row, `未找到路径行：${key}`);
  return row;
}

function actionButton(row, action) {
  const btn = row.querySelector(`[data-action="${action}"]`);
  assert(btn, `未找到操作按钮 ${action}`);
  return btn;
}

// 打开顶部「＋ 新建」菜单并选择指定项（node | key）。
function pickAddMenu(kind) {
  click($('kaleido-values-add-root'));
  const menu = $('kaleido-values-add-menu');
  assert(!menu.hidden, '应打开新建菜单');
  const item = kind === 'node' ? $('kaleido-values-add-menu-node') : $('kaleido-values-add-menu-key');
  click(item);
}

// ---------- 初始化 ----------
runner.test('initValuesSection 创建工作台对话框', () => {
  ui.initValuesSection();
  const dialog = $('kaleido-values-dialog');
  assert(dialog, '应创建对话框');
  assert(!dialog.classList.contains('is-open'), '初始应关闭');
  assert($('kaleido-values-add-root'), '应有新建按钮');
  assert($('kaleido-values-add-menu'), '应有新建菜单');
  assert($('kaleido-values-add-menu-node'), '菜单应有新建节点');
  assert($('kaleido-values-add-menu-key'), '菜单应有新建键');
  assert($('kaleido-values-add-key'), '应有注册新键按钮');
  assert($('kaleido-values-import-btn'), '应有导入按钮');
  assert($('kaleido-values-export-btn'), '应有导出按钮');
  assert($('kaleido-values-layer-default'), '应有默认值层按钮');
  assert($('kaleido-values-layer-game'), '应有游戏值层按钮');
  assert($('kaleido-values-save-now'), '应有默认数值保存按钮');
  assert($('kaleido-values-reset-game'), '应有重置为默认值按钮');
  assert($('kaleido-values-default-hint'), '应有默认值手动提示');
});

// ---------- 键注册 ----------
runner.test('键注册：填写名称与规则后保存（内置变量常驻）', () => {
  click($('kaleido-values-add-key'));
  assert(!$('kaleido-values-key-editor').hidden, '应打开键编辑器');
  setValue('kaleido-values-key-editor-name', '友谊');
  setValue('kaleido-values-key-editor-rule', '友好互动 +5，冲突 -10，上限 100');
  click($('kaleido-values-key-editor-save'));
  const keys = ui.getValuesKeys(hostCtx);
  assert(keys.length === 4, '合并内置后应有 4 个键（内置 3 + 卡键友谊遮蔽内置友谊）');
  assert(keys.some((key) => key.name === '友谊' && key.rule.includes('友好互动')), '应保存变化规则');
  const rows = Array.from($('kaleido-values-keys-body').querySelectorAll('.kaleido-values__row'));
  assert(rows.length === 4, '键列表应显示 4 行');
  // 内置变量默认可选：新建变量下拉直接列出，无需先注册。
  pickAddMenu('key');
  const selectValues = Array.from($('kaleido-values-editor-key-select').options).map((option) => option.value);
  assert(['友谊', '友谊等级', '情欲', '情欲等级'].every((name) => selectValues.includes(name)), '下拉应含全部内置变量');
});

// ---------- 内置变量：编辑覆盖 / 删除恢复 ----------
runner.test('内置变量：编辑生成卡级覆盖，删除后恢复内置默认', async () => {
  for (const key of ui.getValuesKeys(hostCtx).slice()) ui.deleteValuesKey(hostCtx, key.name);
  click($('kaleido-values-tab-keys'));
  ui.renderValuesKeys();
  const rows = () => Array.from($('kaleido-values-keys-body').querySelectorAll('.kaleido-values__row'));
  assert(rows().length === 4, '清空卡键后应只剩 4 个内置行');
  // 编辑内置变量 → 保存生成卡级覆盖（行变为普通卡键行）。
  const builtinRow = rows().find((r) => r.dataset.name === '友谊');
  click(builtinRow.querySelector('button[data-action="edit-key"]'));
  assert(!$('kaleido-values-key-editor').hidden, '应能编辑内置变量');
  assert($('kaleido-values-key-editor-name').value === '友谊', '变量名应回填');
  setValue('kaleido-values-key-editor-rule', '自定义规则');
  click($('kaleido-values-key-editor-save'));
  const cardKey = ui.getValuesKeyByName(hostCtx, '友谊');
  assert(cardKey && cardKey.rule === '自定义规则' && !ui.isValuesBuiltinKey(cardKey), '保存应生成卡级覆盖');
  const overriddenRow = rows().find((r) => r.dataset.name === '友谊');
  assert(overriddenRow.querySelector('button[data-action="delete-key"]'), '覆盖态行应显示删除按钮');
  assert(!overriddenRow.querySelector('.is-builtin'), '覆盖态行不应显示内置徽标');
  // 删除覆盖 → 恢复内置默认。
  click(overriddenRow.querySelector('button[data-action="delete-key"]'));
  assert(confirmMessage().includes('内置默认'), '删除提示应说明恢复内置默认');
  clickConfirmOk();
  await flush();
  assert(ui.getValuesBundle(hostCtx).keys.length === 0, '卡键应被删除');
  const restoredRow = rows().find((r) => r.dataset.name === '友谊');
  assert(restoredRow && restoredRow.querySelector('.is-builtin'), '删除后内置行应恢复');
  assert(!restoredRow.querySelector('button[data-action="delete-key"]'), '恢复的内置行不应有删除按钮');
});

// ---------- 键注册：子变量 ----------
runner.test('键注册：子变量类型 + 父变量 + 派生区间', () => {
  // 先注册父变量
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', '好感度');
  setValue('kaleido-values-key-editor-rule', '友好互动 +5');
  click($('kaleido-values-key-editor-save'));
  // 注册子变量
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', '态度');
  const typeSelect = $('kaleido-values-key-editor-type');
  typeSelect.value = 'child';
  typeSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  assert($('kaleido-values-key-editor-rule-fields').hidden, '子变量应隐藏变化规则');
  assert(!$('kaleido-values-key-editor-child-fields').hidden, '子变量应显示派生区间');
  const parentSelect = $('kaleido-values-key-editor-parent');
  const parentOptions = Array.from(parentSelect.options).map((option) => option.value);
  assert(parentOptions.includes('好感度'), '派生源下拉应含好感度');
  assert(!parentOptions.includes('态度'), '派生源下拉应排除正在编辑的自身');
  parentSelect.value = '好感度';
  click($('kaleido-values-key-editor-rules-add'));
  click($('kaleido-values-key-editor-rules-add'));
  const rows = $('kaleido-values-key-editor-rules').querySelectorAll('.kaleido-values__key-rule-row');
  assert(rows.length === 2, '应有 2 行区间');
  rows[0].querySelector('.kaleido-values__key-rule-min').value = '0';
  rows[0].querySelector('.kaleido-values__key-rule-max').value = '30';
  rows[0].querySelector('.kaleido-values__key-rule-value').value = '冷淡';
  rows[1].querySelector('.kaleido-values__key-rule-min').value = '31';
  rows[1].querySelector('.kaleido-values__key-rule-max').value = '100';
  rows[1].querySelector('.kaleido-values__key-rule-value').value = '颇具好感';
  click($('kaleido-values-key-editor-save'));
  const key = ui.getValuesKeyByName(hostCtx, '态度');
  assert(ui.isValuesChildKey(key), '态度应为子变量');
  assert(key.parent === '好感度', '父变量应保存');
  assert(key.rules.length === 2, '应有 2 条区间规则');
  assert(key.rules[0].value === '冷淡' && key.rules[0].min === 0 && key.rules[0].max === 30, '首条区间应保存');
  // 键列表应显示类型徽标
  const listRows = Array.from($('kaleido-values-keys-body').querySelectorAll('.kaleido-values__row'));
  const attitudeRow = listRows.find((r) => r.dataset.name === '态度');
  assert(attitudeRow && attitudeRow.querySelector('.kaleido-values__row-type-badge.is-child'), '子变量行应显示「子」徽标');
});

// ---------- 键注册：派生区间重叠校验 ----------
runner.test('键注册：派生区间重叠时阻止保存并标红', () => {
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', '态度2');
  const typeSelect = $('kaleido-values-key-editor-type');
  typeSelect.value = 'child';
  typeSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  $('kaleido-values-key-editor-parent').value = '好感度';
  click($('kaleido-values-key-editor-rules-add'));
  click($('kaleido-values-key-editor-rules-add'));
  const rows = $('kaleido-values-key-editor-rules').querySelectorAll('.kaleido-values__key-rule-row');
  rows[0].querySelector('.kaleido-values__key-rule-min').value = '0';
  rows[0].querySelector('.kaleido-values__key-rule-max').value = '1000';
  rows[0].querySelector('.kaleido-values__key-rule-value').value = '冷淡';
  rows[1].querySelector('.kaleido-values__key-rule-min').value = '1000';
  rows[1].querySelector('.kaleido-values__key-rule-max').value = '2000';
  rows[1].querySelector('.kaleido-values__key-rule-value').value = '友好';
  rows[1].querySelector('.kaleido-values__key-rule-value').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  assert(rows[0].classList.contains('is-conflict') && rows[1].classList.contains('is-conflict'), '重叠行应标红');
  click($('kaleido-values-key-editor-save'));
  assert(!ui.getValuesKeyByName(hostCtx, '态度2'), '重叠区间不应保存');
  assert(toasts.some((t) => t[0] === 'warning' && t[1].includes('重叠')), '应提示区间重叠');
  // 改成 1001~2000 后可保存
  rows[1].querySelector('.kaleido-values__key-rule-min').value = '1001';
  rows[1].querySelector('.kaleido-values__key-rule-min').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  click($('kaleido-values-key-editor-save'));
  const key = ui.getValuesKeyByName(hostCtx, '态度2');
  assert(key && key.rules.length === 2, '修正后应保存');
  assert(key.rules[1].min === 1001, '第二行下限应为 1001');
});

// ---------- 键注册：新行自动接续下限 ----------
runner.test('键注册：添加区间自动接续下限（上一行上限 + 1）', () => {
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', '态度3');
  const typeSelect = $('kaleido-values-key-editor-type');
  typeSelect.value = 'child';
  typeSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  $('kaleido-values-key-editor-parent').value = '好感度';
  click($('kaleido-values-key-editor-rules-add'));
  const row0 = $('kaleido-values-key-editor-rules').querySelector('.kaleido-values__key-rule-row');
  row0.querySelector('.kaleido-values__key-rule-max').value = '1000';
  row0.querySelector('.kaleido-values__key-rule-value').value = '冷淡';
  click($('kaleido-values-key-editor-rules-add'));
  const rows = $('kaleido-values-key-editor-rules').querySelectorAll('.kaleido-values__key-rule-row');
  assert(rows[1].querySelector('.kaleido-values__key-rule-min').value === '1001', '新行下限应自动接续为 1001');
  click($('kaleido-values-key-editor-cancel'));
});

// ---------- 树行：子变量派生 ----------
runner.test('树行：子变量显示派生徽标、不可编辑、值自动计算', () => {
  const defaults = ui.getValuesDefaults(hostCtx);
  defaults['好感度'] = 40;
  defaults['态度'] = '未知';
  ui.saveValuesData(hostCtx);
  ui.renderValuesTree();
  const attitudeRow = rowByName('态度');
  assert(attitudeRow.classList.contains('is-derived'), '子变量行应有 is-derived 类');
  assert(attitudeRow.querySelector('.kaleido-values__row-derived-badge'), '应显示派生徽标');
  assert(!attitudeRow.querySelector('button[data-action="edit"]'), '子变量行不应有编辑按钮');
  assert(attitudeRow.querySelector('.kaleido-values__row-value').textContent === '颇具好感', '树行应显示派生后的值');
});

// ---------- 新建变量：子变量值由父变量自动计算 ----------
runner.test('新建变量：选择子变量时不提供值输入、只显示派生提示', () => {
  pickAddMenu('key');
  const select = $('kaleido-values-editor-key-select');
  select.value = '态度';
  select.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  assert(!$('kaleido-values-editor-child-hint').hidden, '应显示子变量提示');
  assert($('kaleido-values-editor-child-hint').textContent === '子变量值由派生规则（区间 / 公式）自动计算', '提示文字应为派生规则说明');
  assert($('kaleido-values-editor-value').hidden, '子变量不应显示值输入框');
  assert($('kaleido-values-editor-value-label').hidden, '子变量不应显示值标签');
  click($('kaleido-values-editor-cancel'));
});

// ---------- 删除父变量：依赖保护 ----------
runner.test('删除父变量：有依赖子变量时阻止并提示', () => {
  const before = ui.getValuesKeys(hostCtx).length;
  const row = Array.from($('kaleido-values-keys-body').querySelectorAll('.kaleido-values__row'))
    .find((r) => r.dataset.name === '好感度');
  assert(row, '应找到好感度行');
  click(row.querySelector('button[data-action="delete-key"]'));
  assert(ui.getValuesKeys(hostCtx).length === before, '不应删除父变量');
  assert(toasts.some((t) => t[0] === 'warning' && t[1].includes('态度')), '应提示依赖子变量');
});

// ---------- 键注册：公式派生 ----------
runner.test('键注册：子变量切换派生方式为公式并保存', () => {
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', '综合评分');
  const typeSelect = $('kaleido-values-key-editor-type');
  typeSelect.value = 'child';
  typeSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  const deriveSelect = $('kaleido-values-key-editor-derive');
  assert(deriveSelect, '子变量应显示派生方式下拉');
  assert(deriveSelect.value === 'rules', '默认应为区间派生');
  assert(!$('kaleido-values-key-editor-rules-fields').hidden, '区间模式应显示派生源与区间');
  assert($('kaleido-values-key-editor-formula-fields').hidden, '区间模式应隐藏公式输入');
  deriveSelect.value = 'formula';
  deriveSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  assert(!$('kaleido-values-key-editor-formula-fields').hidden, '公式模式应显示公式输入');
  assert($('kaleido-values-key-editor-rules-fields').hidden, '公式模式应隐藏派生源与区间');
  setValue('kaleido-values-key-editor-formula', '0.5*服从值+0.5*美貌值');
  click($('kaleido-values-key-editor-save'));
  const key = ui.getValuesKeyByName(hostCtx, '综合评分');
  assert(key && key.formula === '0.5*服从值+0.5*美貌值', '公式应保存');
  assert(key.parent === '', '公式模式不应有派生源');
  assert(key.rules.length === 0, '公式模式不应有区间');
  const listRows = Array.from($('kaleido-values-keys-body').querySelectorAll('.kaleido-values__row'));
  const scoreRow = listRows.find((r) => r.dataset.name === '综合评分');
  assert(scoreRow && scoreRow.querySelector('.kaleido-values__row-rule').textContent.includes('0.5*服从值+0.5*美貌值'), '列表应显示公式摘要');
});

runner.test('键注册：公式非法语法阻止保存并提示', () => {
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', '评分2');
  const typeSelect = $('kaleido-values-key-editor-type');
  typeSelect.value = 'child';
  typeSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  const deriveSelect = $('kaleido-values-key-editor-derive');
  deriveSelect.value = 'formula';
  deriveSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  setValue('kaleido-values-key-editor-formula', '2**3');
  click($('kaleido-values-key-editor-save'));
  assert(!ui.getValuesKeyByName(hostCtx, '评分2'), '非法公式不应保存');
  assert(toasts.some((t) => t[0] === 'warning' && t[1].includes('派生公式不合法')), '应提示公式不合法');
  click($('kaleido-values-key-editor-cancel'));
});

runner.test('键注册：循环引用阻止保存并提示环链', () => {
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', '环A');
  let typeSelect = $('kaleido-values-key-editor-type');
  typeSelect.value = 'child';
  typeSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  let deriveSelect = $('kaleido-values-key-editor-derive');
  deriveSelect.value = 'formula';
  deriveSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  setValue('kaleido-values-key-editor-formula', '环B*2');
  click($('kaleido-values-key-editor-save'));
  assert(ui.getValuesKeyByName(hostCtx, '环A'), '环A 应先保存');
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', '环B');
  typeSelect = $('kaleido-values-key-editor-type');
  typeSelect.value = 'child';
  typeSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  $('kaleido-values-key-editor-parent').value = '环A';
  click($('kaleido-values-key-editor-rules-add'));
  const row = $('kaleido-values-key-editor-rules').querySelector('.kaleido-values__key-rule-row');
  row.querySelector('.kaleido-values__key-rule-min').value = '0';
  row.querySelector('.kaleido-values__key-rule-value').value = 'x';
  click($('kaleido-values-key-editor-save'));
  assert(!ui.getValuesKeyByName(hostCtx, '环B'), '成环引用不应保存');
  assert(toasts.some((t) => t[0] === 'warning' && t[1].includes('循环引用')), '应提示循环引用');
  click($('kaleido-values-key-editor-cancel'));
});

runner.test('键注册：派生源可选子变量（链式派生）', () => {
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', 'A级');
  const typeSelect = $('kaleido-values-key-editor-type');
  typeSelect.value = 'child';
  typeSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  const parentSelect = $('kaleido-values-key-editor-parent');
  const parentOptions = Array.from(parentSelect.options).map((option) => option.value);
  assert(parentOptions.includes('综合评分'), '派生源下拉应含子变量 综合评分');
  parentSelect.value = '综合评分';
  click($('kaleido-values-key-editor-rules-add'));
  const row = $('kaleido-values-key-editor-rules').querySelector('.kaleido-values__key-rule-row');
  row.querySelector('.kaleido-values__key-rule-min').value = '70';
  row.querySelector('.kaleido-values__key-rule-max').value = '150';
  row.querySelector('.kaleido-values__key-rule-value').value = 'A级';
  click($('kaleido-values-key-editor-save'));
  const key = ui.getValuesKeyByName(hostCtx, 'A级');
  assert(key && key.parent === '综合评分', '派生源应为子变量 综合评分');
});

// ---------- 新建键（顶层） ----------
runner.test('新建键：菜单 → 下拉选择已注册键 + 键值', () => {
  pickAddMenu('key');
  assert(!$('kaleido-values-editor').hidden, '应打开键编辑器');
  assert(!$('kaleido-values-editor-key-fields').hidden, '应显示键字段');
  assert($('kaleido-values-editor-node-fields').hidden, '不应显示节点字段');
  const select = $('kaleido-values-editor-key-select');
  const selectValues = Array.from(select.options).map((option) => option.value);
  assert(selectValues.includes('友谊'), '下拉应含已注册键 友谊');
  select.value = '友谊';
  setValue('kaleido-values-editor-value', '30');
  click($('kaleido-values-editor-save'));
  const defaults = ui.getValuesDefaults(hostCtx);
  assert(defaults['友谊'] === 30, '默认值应保存 友谊=30');
  assert(rowNames().includes('友谊'), '树应显示 友谊 键行');
  const injectConfig = ui.getValuesInjectConfig(hostCtx);
  assert(injectConfig.paths.includes('友谊'), '新建变量应默认开启注入');
});// ---------- 新建节点 + 节点下挂键 ----------
runner.test('新建节点：张三 → 节点下新建键', () => {
  pickAddMenu('node');
  assert(!$('kaleido-values-editor').hidden, '应打开节点编辑器');
  assert(!$('kaleido-values-editor-node-fields').hidden, '应显示节点字段');
  assert($('kaleido-values-editor-key-fields').hidden, '不应显示键字段');
  setValue('kaleido-values-editor-name', '张三');
  click($('kaleido-values-editor-save'));
  const defaults = ui.getValuesDefaults(hostCtx);
  assert(defaults['张三'] && typeof defaults['张三'] === 'object', '张三应为节点（容器）');
  const zhangRow = rowByName('张三');
  assert(zhangRow.dataset.kind === 'container', '张三行应为节点行');
  const configAfterNode = ui.getValuesInjectConfig(hostCtx);
  assert(configAfterNode.paths.includes('张三'), '新建节点应默认开启注入');
  // 张三下新建键
  click(actionButton(zhangRow, 'add-menu'));
  assert(!$('kaleido-values-add-menu').hidden, '节点行应打开新建菜单');
  click($('kaleido-values-add-menu-key'));
  const select = $('kaleido-values-editor-key-select');
  select.value = '友谊';
  setValue('kaleido-values-editor-value', '30');
  click($('kaleido-values-editor-save'));
  assert(defaults['张三']['友谊'] === 30, '张三→友谊 应保存为 30');
  const injectConfig = ui.getValuesInjectConfig(hostCtx);
  assert(injectConfig.paths.includes('张三/友谊'), '节点下新建变量应默认开启注入');
  assert(injectConfig.paths.includes('张三'), '打开下级应自动提升上级');
  // 新建节点默认展开：无需手动点击即可看到子键（顶层也有同名 友谊，须按路径区分）
  const childVisible = () => treeRows().some((r) => JSON.parse(r.dataset.path || '[]').join('/') === '张三/友谊');
  assert(childVisible(), '新建节点默认展开，应直接显示子键');
  // 收起 / 再展开
  click(actionButton(rowByName('张三'), 'toggle'));
  assert(!childVisible(), '收起后应隐藏子键');
  click(actionButton(rowByName('张三'), 'toggle'));
  assert(childVisible(), '再次展开后应显示子键');
});

// ---------- 编辑键：键名只读 ----------
runner.test('编辑键：键名只读，只改键值', () => {
  const topKeyRow = rowByName('友谊');
  click(actionButton(topKeyRow, 'edit'));
  assert(!$('kaleido-values-editor').hidden, '应打开键编辑器');
  assert($('kaleido-values-editor-key-select').hidden, '编辑键时下拉应隐藏');
  assert(!$('kaleido-values-editor-key-name').hidden, '编辑键时应显示键名');
  assert($('kaleido-values-editor-key-name').textContent === '友谊', '键名应显示为 友谊');
  setValue('kaleido-values-editor-value', '50');
  click($('kaleido-values-editor-save'));
  const defaults = ui.getValuesDefaults(hostCtx);
  assert(defaults['友谊'] === 50, '键值应更新为 50');
});

// ---------- 双击行进入编辑 ----------
runner.test('双击行：变量进入变量编辑，节点进入节点编辑', () => {
  const defaults = ui.getValuesDefaults(hostCtx);
  defaults['张三'] = { '友谊': 20 };
  ui.saveValuesData(hostCtx);
  // 双击变量行 → 变量编辑器
  const keyRow = rowByName('友谊');
  keyRow.dispatchEvent(new dom.window.MouseEvent('dblclick', { bubbles: true, cancelable: true }));
  assert(!$('kaleido-values-editor').hidden, '双击变量应打开编辑器');
  assert($('kaleido-values-editor-title').textContent === '编辑变量', '标题应为 编辑变量');
  click($('kaleido-values-editor-cancel'));
  // 双击节点行 → 节点编辑器
  const nodeRow = rowByName('张三');
  nodeRow.dispatchEvent(new dom.window.MouseEvent('dblclick', { bubbles: true, cancelable: true }));
  assert(!$('kaleido-values-editor').hidden, '双击节点应打开编辑器');
  assert($('kaleido-values-editor-title').textContent === '编辑节点', '标题应为 编辑节点');
  click($('kaleido-values-editor-cancel'));
  // 双击按钮区域 → 不触发
  const editBtn = actionButton(rowByName('友谊'), 'edit');
  editBtn.dispatchEvent(new dom.window.MouseEvent('dblclick', { bubbles: true, cancelable: true }));
  assert($('kaleido-values-editor').hidden, '双击按钮不应打开编辑器');
});

// ---------- 游戏值层 ----------
runner.test('游戏值层：只可修改，修改写入 chatMetadata', () => {
  // 先注册「金钱」
  click($('kaleido-values-tab-keys'));
  click($('kaleido-values-add-key'));
  setValue('kaleido-values-key-editor-name', '金钱');
  setValue('kaleido-values-key-editor-rule', '获得 +N，消费 -N');
  click($('kaleido-values-key-editor-save'));
  // 新建只能在默认值层完成
  click($('kaleido-values-tab-tree'));
  click($('kaleido-values-layer-default'));
  pickAddMenu('key');
  const select = $('kaleido-values-editor-key-select');
  select.value = '金钱';
  setValue('kaleido-values-editor-value', '1000');
  click($('kaleido-values-editor-save'));
  // 切到游戏值层：无新建按钮、无删除按钮，只能修改
  click($('kaleido-values-layer-game'));
  assert($('kaleido-values-add-root').hidden, '游戏值层应隐藏新建按钮');
  const moneyRow = rowByName('金钱');
  assert(!moneyRow.querySelector('button[data-action="delete"]'), '游戏值层不应有删除按钮');
  click(actionButton(moneyRow, 'edit'));
  setValue('kaleido-values-editor-value', '500');
  click($('kaleido-values-editor-save'));
  const state = hostCtx.chatMetadata.kaleidoscope_values;
  assert(state && state.values['金钱'] === 500, '游戏值应写入 chatMetadata');
  assert(ui.isValuesGameInitialized(hostCtx) === true, '游戏值应标记为已初始化');
});

// ---------- 删除 ----------
runner.test('删除条目：确认后从默认值层移除；游戏值层无删除按钮', async () => {
  click($('kaleido-values-layer-game'));
  const moneyRow = rowByName('金钱');
  assert(!moneyRow.querySelector('button[data-action="delete"]'), '游戏值层不应有删除按钮');
  click($('kaleido-values-layer-default'));
  const zhangRow = rowByName('张三');
  click(actionButton(zhangRow, 'delete'));
  assert(confirmMessage().includes('确定删除节点「张三」'), '删除节点应先弹确认');
  clickConfirmOk();
  await flush();
  assert(ui.getValuesDefaults(hostCtx)['张三'] === undefined, '默认值层应删除张三');
  const moneyDefaultRow = rowByName('金钱');
  click(actionButton(moneyDefaultRow, 'delete'));
  assert(confirmMessage().includes('确定删除变量「金钱」'), '删除变量应先弹确认');
  clickConfirmOk();
  await flush();
  assert(ui.getValuesDefaults(hostCtx)['金钱'] === undefined, '默认值层应删除金钱');
});

// ---------- 游戏值层：节点行只保留编辑 ----------
runner.test('游戏值层：节点行无新建菜单与删除按钮，只保留编辑', () => {
  // 直接播种游戏值与默认值（含节点），不依赖前面测试的顺序
  hostCtx.chatMetadata.kaleidoscope_values = {
    version: 1,
    values: { '张三': { '好感': 30 } },
    updatedAt: new Date().toISOString(),
    lastSignature: '',
  };
  const defaults = ui.getValuesDefaults(hostCtx);
  defaults['张三'] = { '好感': 20 };
  ui.saveValuesData(hostCtx);
  click($('kaleido-values-layer-game'));
  assert($('kaleido-values-add-root').hidden, '游戏值层应隐藏新建按钮');
  const nodeRow = rowByName('张三');
  assert(!nodeRow.querySelector('button[data-action="add-menu"]'), '游戏值层节点行不应有新建菜单');
  assert(!nodeRow.querySelector('button[data-action="delete"]'), '游戏值层节点行不应有删除按钮');
  assert(nodeRow.querySelector('button[data-action="edit"]'), '游戏值层节点行应保留编辑');
  const leafRow = rowByName('好感');
  assert(!leafRow.querySelector('button[data-action="delete"]'), '游戏值层变量行不应有删除按钮');
  assert(leafRow.querySelector('button[data-action="edit"]'), '游戏值层变量行应保留编辑');
  // 对照：默认值层同样数据应有三件套（新建菜单 / 编辑 / 删除）
  click($('kaleido-values-layer-default'));
  assert(!$('kaleido-values-add-root').hidden, '默认值层应显示新建按钮');
  const nodeRowDefault = rowByName('张三');
  assert(nodeRowDefault.querySelector('button[data-action="add-menu"]'), '默认值层节点行应有新建菜单');
  assert(nodeRowDefault.querySelector('button[data-action="delete"]'), '默认值层节点行应有删除按钮');
});

// ---------- 空树新建节点 ----------
runner.test('新建节点：空树时立即显示节点（不显示空状态）', () => {
  const defaults = ui.getValuesDefaults(hostCtx);
  for (const key of Object.keys(defaults)) delete defaults[key];
  ui.saveValuesData(hostCtx);
  click($('kaleido-values-layer-default'));
  pickAddMenu('node');
  setValue('kaleido-values-editor-name', '张三');
  click($('kaleido-values-editor-save'));
  assert(rowNames().includes('张三'), '空树新建节点应显示节点行');
  assert(!$('kaleido-values-tree-body').querySelector('.kaleido-values__empty'), '不应显示空状态');
});

// ---------- 层联动：维护 / 重置只属于游戏值层，新建只属于默认值层 ----------
runner.test('层联动：默认值层隐藏维护与重置，游戏值层隐藏新建', () => {
  click($('kaleido-values-layer-default'));
  assert($('kaleido-values-maintain-now').hidden, '默认值层应隐藏立即维护');
  assert($('kaleido-values-reset-game').hidden, '默认值层应隐藏重置按钮');
  assert($('kaleido-values-maintain-status').hidden, '默认值层应隐藏维护状态');
  assert(!$('kaleido-values-default-hint').hidden, '默认值层应显示手动修改提示');
  assert(!$('kaleido-values-add-root').hidden, '默认值层应显示新建按钮');
  click($('kaleido-values-layer-game'));
  assert(!$('kaleido-values-maintain-now').hidden, '游戏值层应显示立即维护');
  assert(!$('kaleido-values-reset-game').hidden, '游戏值层应显示重置按钮');
  assert(!$('kaleido-values-maintain-status').hidden, '游戏值层应显示维护状态');
  assert($('kaleido-values-default-hint').hidden, '游戏值层应隐藏手动修改提示');
  assert($('kaleido-values-add-root').hidden, '游戏值层应隐藏新建按钮');
});

// ---------- 游戏值重置为默认值 ----------
runner.test('游戏值重置：点击重置按钮恢复为默认值并写入聊天文件', async () => {
  const defaults = ui.getValuesDefaults(hostCtx);
  defaults['好感'] = 30;
  ui.saveValuesData(hostCtx);
  hostCtx.chatMetadata.kaleidoscope_values = {
    version: 1,
    values: { '好感': 50 },
    updatedAt: new Date().toISOString(),
    lastSignature: 'old-sig',
  };
  click($('kaleido-values-layer-game'));
  click($('kaleido-values-reset-game'));
  assert(confirmMessage().includes('重置为默认值'), '重置应弹确认');
  clickConfirmOk();
  await flush();
  const state = hostCtx.chatMetadata.kaleidoscope_values;
  assert(state.values['好感'] === 30, '游戏值应重置为默认值 30');
  assert(state.lastSignature === '', '重置后应清空 lastSignature');
  assert(rowNames().includes('好感'), '树应显示重置后的键');
});

// ---------- 样式回归：维护状态在默认值层必须真正隐藏 ----------
runner.test('维护状态 hidden 覆盖规则（回归：display 不能压过 hidden）', () => {
  const fs = require('fs');
  const css = fs.readFileSync(require('path').join(__dirname, '..', 'style.css'), 'utf8');
  const rule = /.kaleido-values__maintain-status\[hidden\][^{]*\{[^}]*display:\s*none/;
  assert(rule.test(css), '维护状态应有 [hidden] 覆盖规则');
});

// ---------- 层切换按钮：单行指示 + 一键切换 ----------
runner.test('层切换按钮：只显示当前层，点击按钮切换', () => {
  const title = $('kaleido-values-layer-title');
  const toggle = $('kaleido-values-layer-toggle');
  assert(title, '应有当前层标题');
  assert(toggle, '应有切换按钮');
  const before = title.textContent;
  const target = before === '游戏数值' ? '默认数值' : '游戏数值';
  click(toggle);
  assert(title.textContent === target, `点击后应显示 ${target}`);
  assert(toggle.textContent.includes(`切换到${before}`), '切换按钮应指向另一层');
  assert($('kaleido-values-layer-row').dataset.layer === (target === '游戏数值' ? 'game' : 'default'), '指示条应更新层标记');
  click(toggle);
  assert(title.textContent === before, '再点应回到原层');
});

// ---------- 默认数值「保存」按钮 ----------
runner.test('默认数值保存按钮：仅在默认层显示；点击保存到绑定位置并提示', async () => {
  // 前置：切到默认数值层
  click($('kaleido-values-layer-default'));
  const saveBtn = $('kaleido-values-save-now');
  assert(saveBtn, '应有保存按钮');
  assert(!saveBtn.hidden, '默认数值层应显示保存按钮');
  // 游戏值层隐藏（游戏值随聊天文件即时落盘，无需手动保存）
  click($('kaleido-values-layer-game'));
  assert(saveBtn.hidden, '游戏值层应隐藏保存按钮');
  click($('kaleido-values-layer-default'));
  // 无角色（测试上下文）：保存落到全局设置
  toasts.length = 0;
  click(saveBtn);
  await flush();
  assert(
    toasts.some(([kind, message]) => kind === 'success' && message.includes('全局设置')),
    `无角色时应提示已保存到全局设置，实际: ${JSON.stringify(toasts)}`,
  );
});

// ---------- 打开工作台：总是先展示游戏数值层 ----------
runner.test('打开工作台：不记住上次停留的层，总是先展示游戏数值', () => {
  // 上次停在默认数值层
  click($('kaleido-values-layer-default'));
  assert($('kaleido-values-layer-title').textContent === '默认数值', '前置：当前应为默认数值层');
  // 重新打开工作台 → 应回到游戏数值层
  ui.openValuesWorkbench();
  assert($('kaleido-values-layer-title').textContent === '游戏数值', '重开工作台应先展示游戏数值');
  assert($('kaleido-values-layer-row').dataset.layer === 'game', '指示条应标记为游戏值层');
  assert($('kaleido-values-add-root').hidden, '游戏值层应隐藏新建按钮');
  assert(!$('kaleido-values-maintain-now').hidden, '游戏值层应显示立即维护');
  assert($('kaleido-values-default-hint').hidden, '游戏值层应隐藏默认值手动提示');
});

runner.test('点击遮罩不关闭工作台', () => {
  ui.openValuesWorkbench();
  click($('kaleido-values-dialog'));
  assert($('kaleido-values-dialog').classList.contains('is-open'), '点击遮罩不应关闭工作台');
});

// ---------- 注入提示词（默认数值层） ----------
function injectCheck(row) {
  const button = row.querySelector('button[data-inject-toggle]');
  assert(button, '行内应有注入滑块');
  return button;
}

function toggleInject(row) {
  click(injectCheck(row));
}

runner.test('注入条：默认层显示，游戏值层隐藏', () => {
  click($('kaleido-values-layer-default'));
  assert(!$('kaleido-values-inject-bar').hidden, '默认值层应显示注入条');
  assert($('kaleido-values-inject-toggle'), '应有注入开关');
  assert($('kaleido-values-inject-status'), '应有注入状态');
  click($('kaleido-values-layer-game'));
  assert($('kaleido-values-inject-bar').hidden, '游戏值层应隐藏注入条');
  click($('kaleido-values-layer-default'));
});

runner.test('注入开关：滑块点击后写入配置并更新状态', () => {
  click($('kaleido-values-layer-default'));
  const toggle = $('kaleido-values-inject-toggle');
  assert(toggle.classList.contains('is-off'), '初始应为关闭态');
  assert(toggle.getAttribute('aria-checked') === 'false', 'aria-checked 初始应为 false');
  click(toggle);
  assert(ui.getValuesInjectConfig(hostCtx).enabled === true, '开关应写入配置');
  assert(!toggle.classList.contains('is-off'), '滑块应显示开启态');
  assert(toggle.getAttribute('aria-checked') === 'true', 'aria-checked 应为 true');
  assert($('kaleido-values-inject-status').textContent.includes('已开启'), '状态应显示已开启');
  click(toggle);
  assert(ui.getValuesInjectConfig(hostCtx).enabled === false, '关闭应写入配置');
  assert(toggle.classList.contains('is-off'), '滑块应回到关闭态');
});

runner.test('注入预览：标签页展示实际注入的 <Values> 内容', () => {
  const tab = $('kaleido-values-tab-inject');
  assert(tab, '应有注入预览标签');
  const pane = $('kaleido-values-inject-pane');
  assert(pane, '应有注入预览面板');
  const preview = $('kaleido-values-inject-text');
  assert(preview, '应有注入预览文本区');
  assert(!pane.classList.contains('is-active'), '初始不应激活注入预览面板');

  // 注入关闭：提示未开启
  click(tab);
  assert(tab.classList.contains('is-active'), '点击后注入预览标签应激活');
  assert(pane.classList.contains('is-active'), '点击后注入预览面板应激活');
  assert(preview.textContent.includes('未开启'), '注入关闭时预览应提示未开启');

  // 注册变量 + 写入游戏值 + 勾选 + 开启注入
  ui.upsertValuesKey(hostCtx, '好感', '友好互动 +5，冲突 -10，上限 100');
  ui.saveValuesChatState(hostCtx, { 好感: 40, 张三: { 状态: '清醒' } }, { immediate: true });
  ui.setValuesInjectEnabled(hostCtx, true);
  ui.setValuesInjectPath(hostCtx, '好感', true);
  ui.setValuesInjectPath(hostCtx, '张三', true);
  ui.setValuesInjectPath(hostCtx, '张三/状态', true);
  ui.renderValuesTree();

  assert(preview.textContent.includes('<Values>'), '预览应包含 <Values> 块');
  assert(preview.textContent.includes('好感: 40'), '预览应包含 好感: 40');
  assert(preview.textContent.includes('状态: 清醒'), '预览应包含 张三/状态');
  assert(!preview.textContent.includes('金币'), '预览不应包含未勾选变量');

  // 切回变量树：注入预览面板应取消激活
  click($('kaleido-values-tab-tree'));
  assert(!pane.classList.contains('is-active'), '切回变量树后注入预览面板应取消激活');
});

runner.test('导航切换：面板 hidden 与 is-active 同步（回归：注册/触发/注入视图空白）', () => {
  const panes = {
    tree: $('kaleido-values-tree-pane'),
    keys: $('kaleido-values-keys-pane'),
    triggers: $('kaleido-values-triggers-pane'),
    inject: $('kaleido-values-inject-pane'),
  };
  const assertVisible = (name) => {
    for (const [key, pane] of Object.entries(panes)) {
      assert(pane.classList.contains('is-active') === (key === name), `${key} is-active 应${key === name ? '激活' : '取消'}`);
      assert(pane.hidden === (key !== name), `${key} hidden 应${key === name ? '移除' : '置位'}`);
    }
  };
  assertVisible('tree');
  click($('kaleido-values-tab-keys'));
  assertVisible('keys');
  click($('kaleido-values-tab-triggers'));
  assertVisible('triggers');
  click($('kaleido-values-tab-inject'));
  assertVisible('inject');
  click($('kaleido-values-tab-tree'));
  assertVisible('tree');
});

runner.test('行内滑块：打开下级自动提升上级，打开上级级联打开后代，关闭上级级联关闭后代', () => {
  const defaults = ui.getValuesDefaults(hostCtx);
  defaults['张三'] = { '好感': 30, '金钱': 1000 };
  ui.saveValuesData(hostCtx);
  // 清空注入配置：前面测试新建变量 / 节点已默认开启注入，避免干扰本测试的开关断言。
  ui.saveValuesInjectConfig(hostCtx, { enabled: false, paths: [] });
  click($('kaleido-values-layer-default'));
  // 展开张三节点
  let zhangRow = rowByName('张三');
  if (!zhangRow.classList.contains('is-expanded')) {
    click(zhangRow.querySelector('[data-action="toggle"]'));
    zhangRow = rowByName('张三');
  }
  // 打开变量「张三/好感」→ 上级「张三」自动提升打开
  toggleInject(rowByPath(['张三', '好感']));
  let config = ui.getValuesInjectConfig(hostCtx);
  assert(config.paths.includes('张三/好感'), '应打开好感');
  assert(config.paths.includes('张三'), '打开下级应自动提升上级');
  // 再打开「张三/金钱」
  toggleInject(rowByPath(['张三', '金钱']));
  config = ui.getValuesInjectConfig(hostCtx);
  assert(config.paths.includes('张三/金钱'), '应打开金钱');
  assert(config.paths.includes('张三'), '上级保持打开');
  // 关闭上级「张三」→ 全部后代级联关闭
  toggleInject(rowByName('张三'));
  config = ui.getValuesInjectConfig(hostCtx);
  assert(!config.paths.includes('张三'), '节点应关闭');
  assert(!config.paths.includes('张三/好感'), '好感应级联关闭');
  assert(!config.paths.includes('张三/金钱'), '金钱应级联关闭');
  // 打开上级「张三」→ 全部后代级联打开
  toggleInject(rowByName('张三'));
  config = ui.getValuesInjectConfig(hostCtx);
  assert(config.paths.includes('张三'), '节点应打开');
  assert(config.paths.includes('张三/好感'), '好感应级联打开');
  assert(config.paths.includes('张三/金钱'), '金钱应级联打开');
});

runner.test('行内滑块状态：数据不一致时节点显示半选（防御）', () => {
  const defaults = ui.getValuesDefaults(hostCtx);
  defaults['张三'] = { '好感': 30 };
  ui.saveValuesData(hostCtx);
  // 直接写入不一致配置：后代打开但祖先未打开（正常交互不会出现）
  const config = ui.getValuesInjectConfig(hostCtx);
  config.paths = ['张三/好感'];
  ui.saveValuesInjectConfig(hostCtx, config);
  click($('kaleido-values-layer-default'));
  const zhangCheck = injectCheck(rowByName('张三'));
  assert(zhangCheck.classList.contains('is-partial'), '节点应显示半选');
  assert(zhangCheck.classList.contains('is-off'), '节点自身不应打开');
  // 半选点击 → 打开节点（后代保留）
  toggleInject(rowByName('张三'));
  const config2 = ui.getValuesInjectConfig(hostCtx);
  assert(config2.paths.includes('张三'), '半选点击应打开节点');
  assert(config2.paths.includes('张三/好感'), '后代应保留');
});

// ---------- 剧情触发 ----------
function triggerRows() {
  return Array.from($('kaleido-values-triggers-body').querySelectorAll('.kaleido-values__row--trigger'));
}

function openTriggersTab() {
  click($('kaleido-values-tab-triggers'));
  assert($('kaleido-values-triggers-pane').classList.contains('is-active'), '应显示剧情触发面板');
  assert(!$('kaleido-values-tree-pane').classList.contains('is-active'), '变量树面板应隐藏');
  assert(!$('kaleido-values-keys-pane').classList.contains('is-active'), '变量注册面板应隐藏');
}

runner.test('剧情触发：标签页与总开关', () => {
  openTriggersTab();
  assert($('kaleido-values-triggers-toggle'), '应有总开关');

  assert($('kaleido-values-triggers-add'), '应有新建按钮');
  const toggle = $('kaleido-values-triggers-toggle');
  assert(!toggle.classList.contains('is-off'), '默认应开启');
  click(toggle);
  assert(hostCtx.extensionSettings.Kaleidoscope.valuesTriggerEnabled === false, '点击应写入设置');
  assert(toggle.classList.contains('is-off'), '滑块应显示关闭态');
  click(toggle);
  assert(hostCtx.extensionSettings.Kaleidoscope.valuesTriggerEnabled === true, '再点应恢复');
});

runner.test('剧情触发：新建触发（名称 / 逻辑 / 条件 / 正文）', () => {
  const defaults = ui.getValuesDefaults(hostCtx);
  defaults['张三'] = { '好感': 30, '是否已知真相': false };
  ui.saveValuesData(hostCtx);
  openTriggersTab();
  click($('kaleido-values-triggers-add'));
  assert(!$('kaleido-values-trigger-editor').hidden, '应打开触发编辑器');
  setValue('kaleido-values-trigger-editor-name', '告白事件');
  const logic = $('kaleido-values-trigger-editor-logic');
  logic.value = 'all';
  const onceSelect = $('kaleido-values-trigger-editor-once');
  assert(onceSelect, '应有事件类型选择');
  assert(onceSelect.value === 'once', '默认应为一次性事件');
  // 添加两条条件
  click($('kaleido-values-trigger-editor-condition-add'));
  click($('kaleido-values-trigger-editor-condition-add'));
  const rows = Array.from($('kaleido-values-trigger-editor-conditions').querySelectorAll('.kaleido-values__trigger-condition'));
  assert(rows.length === 2, '应有 2 个条件行');
  const pathSelects = rows.map((row) => row.querySelector('.kaleido-values__trigger-condition-path'));
  const opSelects = rows.map((row) => row.querySelector('.kaleido-values__trigger-condition-op'));
  const valueInputs = rows.map((row) => row.querySelector('.kaleido-values__trigger-condition-value'));
  // 路径下拉应包含变量树叶子路径
  const pathOptions = Array.from(pathSelects[0].options).map((option) => option.value);
  assert(pathOptions.includes('张三/好感'), '路径下拉应包含 张三/好感');
  assert(pathOptions.includes('张三/是否已知真相'), '路径下拉应包含 张三/是否已知真相');
  pathSelects[0].value = '张三/好感';
  opSelects[0].value = '>=';
  valueInputs[0].value = '70';
  pathSelects[1].value = '张三/是否已知真相';
  opSelects[1].value = '==';
  valueInputs[1].value = 'true';
  setValue('kaleido-values-trigger-editor-content', '张三向你表白了。');
  click($('kaleido-values-trigger-editor-save'));
  const triggers = ui.getValuesTriggers(hostCtx);
  assert(triggers.length === 1, '应创建 1 个触发');
  assert(triggers[0].name === '告白事件' && triggers[0].logic === 'all', '名称与逻辑应正确');
  assert(triggers[0].once === true, '默认应保存为一次性事件');
  assert(triggers[0].conditions.length === 2, '应有 2 个条件');
  assert(triggers[0].conditions[0].path === '张三/好感' && triggers[0].conditions[0].op === '>=' && triggers[0].conditions[0].value === 70, '条件 1 应正确');
  assert(triggers[0].conditions[1].value === true, '布尔值应解析为布尔');
  assert(triggers[0].content.includes('张三向你表白了。'), '正文应保存');
  // 列表行显示条件摘要
  const listRows = triggerRows();
  assert(listRows.length === 1, '列表应有 1 行');
  assert(listRows[0].querySelector('.kaleido-values__row-trigger').textContent.includes('张三/好感 >= 70'), '应显示条件摘要');
  assert(listRows[0].querySelector('.kaleido-values__row-trigger-type').textContent === '一次性', '应显示一次性徽标');
  // 编辑为常驻事件
  click(listRows[0].querySelector('[data-action="edit-trigger"]'));
  const onceSelect2 = $('kaleido-values-trigger-editor-once');
  assert(onceSelect2.value === 'once', '编辑时回显一次性');
  onceSelect2.value = 'persistent';
  click($('kaleido-values-trigger-editor-save'));
  assert(ui.getValuesTriggers(hostCtx)[0].once === false, '常驻事件应保存 once=false');
  assert(triggerRows()[0].querySelector('.kaleido-values__row-trigger-type').textContent === '常驻', '应显示常驻徽标');
});

runner.test('剧情触发：启停滑块与删除', async () => {
  const triggers = ui.getValuesTriggers(hostCtx);
  assert(triggers.length === 1, '前置：应有 1 个触发');
  openTriggersTab();
  let row = triggerRows()[0];
  click(row.querySelector('[data-action="toggle-trigger"]'));
  assert(ui.getValuesTriggerById(hostCtx, triggers[0].id).enabled === false, '点击应停用');
  row = triggerRows()[0];
  assert(row.classList.contains('is-disabled'), '行应显示停用态');
  click(row.querySelector('[data-action="toggle-trigger"]'));
  assert(ui.getValuesTriggerById(hostCtx, triggers[0].id).enabled === true, '再点应激活');
  row = triggerRows()[0];
  click(row.querySelector('[data-action="delete-trigger"]'));
  assert(confirmMessage().includes('确定删除剧情触发'), '删除触发应先弹确认');
  clickConfirmOk();
  await flush();
  assert(ui.getValuesTriggers(hostCtx).length === 0, '删除后应为空');
  assert(triggerRows().length === 0, '列表应清空');
});

runner.test('剧情触发：事件效果（加减 / 覆盖）填写与保存，路径只列父变量', () => {
  ui.getValuesTriggers(hostCtx).slice().forEach((t) => ui.deleteValuesTrigger(hostCtx, t.id));
  // 注册子变量：效果路径下拉应过滤它
  ui.upsertValuesKey(hostCtx, '态度', '', { type: 'child', parent: '好感', rules: [{ min: 0, max: 50, value: '冷淡' }, { min: 51, max: 100, value: '热络' }] });
  const defaults = ui.getValuesDefaults(hostCtx);
  defaults['张三'] = { '好感': 30, '态度': '冷淡', '是否已知真相': false };
  ui.saveValuesData(hostCtx);
  openTriggersTab();
  click($('kaleido-values-triggers-add'));
  setValue('kaleido-values-trigger-editor-name', '好感上升');
  click($('kaleido-values-trigger-editor-condition-add'));
  const condRow = $('kaleido-values-trigger-editor-conditions').querySelector('.kaleido-values__trigger-condition');
  condRow.querySelector('.kaleido-values__trigger-condition-path').value = '张三/好感';
  condRow.querySelector('.kaleido-values__trigger-condition-op').value = '>=';
  condRow.querySelector('.kaleido-values__trigger-condition-value').value = '30';
  // 添加两条效果：加减 + 覆盖
  click($('kaleido-values-trigger-editor-effect-add'));
  click($('kaleido-values-trigger-editor-effect-add'));
  const effectRows = Array.from($('kaleido-values-trigger-editor-effects').querySelectorAll('.kaleido-values__trigger-effect'));
  assert(effectRows.length === 2, '应有 2 个效果行');
  const pathSelects = effectRows.map((row) => row.querySelector('.kaleido-values__trigger-effect-path'));
  const opSelects = effectRows.map((row) => row.querySelector('.kaleido-values__trigger-effect-op'));
  const valueInputs = effectRows.map((row) => row.querySelector('.kaleido-values__trigger-effect-value'));
  const pathOptions = Array.from(pathSelects[0].options).map((option) => option.value);
  assert(pathOptions.includes('张三/好感'), '效果路径应包含父变量 张三/好感');
  assert(!pathOptions.includes('张三/态度'), '效果路径应过滤子变量 张三/态度');
  pathSelects[0].value = '张三/好感';
  opSelects[0].value = 'add';
  valueInputs[0].value = '30';
  pathSelects[1].value = '张三/好感';
  opSelects[1].value = 'set';
  valueInputs[1].value = '100';
  setValue('kaleido-values-trigger-editor-content', '好感提升。');
  click($('kaleido-values-trigger-editor-save'));
  const triggers = ui.getValuesTriggers(hostCtx);
  assert(triggers.length === 1, '应创建 1 个触发');
  assert(triggers[0].effects.length === 2, '应保存 2 个效果');
  assert(triggers[0].effects[0].path === '张三/好感' && triggers[0].effects[0].op === 'add' && triggers[0].effects[0].value === 30, '效果 1 应为 add 30');
  assert(triggers[0].effects[1].op === 'set' && triggers[0].effects[1].value === 100, '效果 2 应为 set 100');
  // 列表行显示效果摘要
  const row = triggerRows()[0];
  const effectSpan = row.querySelector('.kaleido-values__row-trigger.is-effect');
  assert(effectSpan && effectSpan.textContent.includes('张三/好感 +30'), '列表应显示效果摘要');
});

runner.test('剧情触发：编辑回填效果行；效果值留空阻止保存', () => {
  ui.getValuesTriggers(hostCtx).slice().forEach((t) => ui.deleteValuesTrigger(hostCtx, t.id));
  ui.createValuesTrigger(hostCtx, { name: '回填', conditions: [{ path: '张三/好感', op: '>=', value: 30 }], effects: [{ path: '张三/好感', op: 'add', value: 10 }], content: '内容' });
  openTriggersTab();
  click(triggerRows()[0].querySelector('[data-action="edit-trigger"]'));
  let effectRows = Array.from($('kaleido-values-trigger-editor-effects').querySelectorAll('.kaleido-values__trigger-effect'));
  assert(effectRows.length === 1, '编辑时应回填 1 个效果行');
  assert(effectRows[0].querySelector('.kaleido-values__trigger-effect-path').value === '张三/好感', '应回填路径');
  assert(effectRows[0].querySelector('.kaleido-values__trigger-effect-op').value === 'add', '应回填类型');
  assert(effectRows[0].querySelector('.kaleido-values__trigger-effect-value').value === '10', '应回填值');
  // 新加一条效果行但值留空 → 保存被阻止
  click($('kaleido-values-trigger-editor-effect-add'));
  effectRows = Array.from($('kaleido-values-trigger-editor-effects').querySelectorAll('.kaleido-values__trigger-effect'));
  assert(effectRows[1].querySelector('.kaleido-values__trigger-effect-op').value === 'add', '新效果行默认应为加减值');
  effectRows[1].querySelector('.kaleido-values__trigger-effect-path').value = '张三/好感';
  const before = ui.getValuesTriggers(hostCtx)[0].effects.length;
  click($('kaleido-values-trigger-editor-save'));
  assert(toasts.at(-1) && toasts.at(-1)[0] === 'warning', '值留空应弹出警告');
  assert(ui.getValuesTriggers(hostCtx)[0].effects.length === before, '不应保存空值效果');
  // 覆盖类型下显式填 null 后可保存
  effectRows[1].querySelector('.kaleido-values__trigger-effect-op').value = 'set';
  effectRows[1].querySelector('.kaleido-values__trigger-effect-value').value = 'null';
  click($('kaleido-values-trigger-editor-save'));
  const triggers = ui.getValuesTriggers(hostCtx);
  assert(triggers[0].effects.length === 2, '填 null 后应保存 2 个效果');
  assert(triggers[0].effects[1].value === null, 'null 应解析为 null');
});

// ---------- 左侧导航收起 / 展开 ----------
runner.test('导航栏：收起后隐藏并显示展开按钮，点击展开恢复', () => {
  const bench = dom.window.document.querySelector('.kaleido-values__workbench');
  assert(bench, '应有工作台');
  assert(!bench.classList.contains('is-nav-collapsed'), '初始应展开');
  assert($('kaleido-values-nav-expand').hidden, '展开时展开按钮应隐藏');
  click($('kaleido-values-nav-collapse'));
  assert(bench.classList.contains('is-nav-collapsed'), '点击收起后应折叠');
  assert(!$('kaleido-values-nav-expand').hidden, '折叠后应显示展开按钮');
  assert(hostCtx.extensionSettings.Kaleidoscope.valuesNavCollapsed === true, '折叠状态应写入设置');
  click($('kaleido-values-nav-expand'));
  assert(!bench.classList.contains('is-nav-collapsed'), '点击展开后应恢复');
  assert($('kaleido-values-nav-expand').hidden, '展开后展开按钮应隐藏');
  assert(hostCtx.extensionSettings.Kaleidoscope.valuesNavCollapsed === false, '展开状态应写入设置');
});

// ---------- 拖动排序 ----------
function stubRowRects(rows, height = 30) {
  rows.forEach((row, index) => {
    row.getBoundingClientRect = () => ({
      top: index * height,
      bottom: (index + 1) * height,
      height,
      left: 0,
      right: 200,
      width: 200,
      x: 0,
      y: index * height,
      toJSON() {},
    });
  });
}

function pointerEvent(type, clientY) {
  return new dom.window.PointerEvent(type, { bubbles: true, cancelable: true, clientY });
}

function dragRowByHandle(handle, fromY, toY) {
  handle.dispatchEvent(pointerEvent('pointerdown', fromY));
  dom.window.document.dispatchEvent(pointerEvent('pointermove', toY));
  dom.window.document.dispatchEvent(pointerEvent('pointerup', toY));
}

runner.test('键列表：拖动把手改变注册顺序并持久化', () => {
  // 清掉旧键，注册 3 个新键
  for (const key of ui.getValuesKeys(hostCtx).slice()) ui.deleteValuesKey(hostCtx, key.name);
  for (const name of ['好感', '金钱', '体力']) {
    click($('kaleido-values-add-key'));
    setValue('kaleido-values-key-editor-name', name);
    setValue('kaleido-values-key-editor-rule', '规则');
    click($('kaleido-values-key-editor-save'));
  }
  click($('kaleido-values-tab-keys'));
  const body = $('kaleido-values-keys-body');
  const rows = () => Array.from(body.querySelectorAll('.kaleido-values__row'));
  assert(rows().map((r) => r.dataset.name).join(',') === '友谊,友谊等级,情欲,情欲等级,好感,金钱,体力', '初始顺序应为内置在前 + 注册顺序');
  // 内置行（友谊）：带「内置」徽标、不可拖动、无删除按钮。
  const builtinRow = rows()[0];
  assert(builtinRow.dataset.name === '友谊' && builtinRow.querySelector('.is-builtin'), '内置行应显示内置徽标');
  assert(!builtinRow.querySelector('.kaleido-values__drag-handle'), '内置行不应有拖动把手');
  assert(!builtinRow.querySelector('[data-action="delete-key"]'), '内置行不应有删除按钮');
  stubRowRects(rows());
  const handle = rows()[4].querySelector('.kaleido-values__drag-handle');
  assert(handle, '卡键行应有拖动把手');
  dragRowByHandle(handle, 135, 210);
  assert(rows().map((r) => r.dataset.name).join(',') === '友谊,友谊等级,情欲,情欲等级,金钱,体力,好感', '拖动后 DOM 顺序应变化');
  const names = ui.getValuesKeys(hostCtx).map((key) => key.name);
  assert(names.join(',') === '友谊,友谊等级,情欲,情欲等级,金钱,体力,好感', '数据层顺序应同步');
});

runner.test('变量树：同级条目拖动排序并保持', () => {
  click($('kaleido-values-tab-tree'));
  click($('kaleido-values-layer-default'));
  const defaults = ui.getValuesDefaults(hostCtx);
  for (const key of Object.keys(defaults)) delete defaults[key];
  defaults['张三'] = { '好感': 30 };
  defaults['李四'] = { '金钱': 100 };
  defaults['王五'] = 1;
  ui.saveValuesData(hostCtx);
  ui.renderValuesTree();
  // 收起此前测试展开的节点，只看顶层条目
  const zhangRow = rowByName('张三');
  if (zhangRow.classList.contains('is-expanded')) click(actionButton(zhangRow, 'toggle'));
  assert(rowNames().join(',') === '张三,李四,王五', '初始按名称排序');
  stubRowRects(treeRows());
  const handle = rowByName('张三').querySelector('.kaleido-values__drag-handle');
  assert(handle, '树行应有拖动把手');
  dragRowByHandle(handle, 15, 75);
  assert(rowNames().join(',') === '李四,王五,张三', '拖动后顺序应变化');
  const order = ui.getValuesTreeOrder(hostCtx);
  assert(order[''].join(',') === '李四,王五,张三', '顺序表应保存');
  ui.renderValuesTree();
  assert(rowNames().join(',') === '李四,王五,张三', '重渲染后顺序应保持');
});

runner.test('剧情触发：拖动把手改变触发顺序', () => {
  click($('kaleido-values-tab-triggers'));
  for (const trigger of ui.getValuesTriggers(hostCtx).slice()) ui.deleteValuesTrigger(hostCtx, trigger.id);
  for (const name of ['事件A', '事件B', '事件C']) {
    click($('kaleido-values-triggers-add'));
    setValue('kaleido-values-trigger-editor-name', name);
    setValue('kaleido-values-trigger-editor-content', '触发内容');
    click($('kaleido-values-trigger-editor-condition-add'));
    const condRow = $('kaleido-values-trigger-editor-conditions').querySelector('.kaleido-values__trigger-condition');
    condRow.querySelector('.kaleido-values__trigger-condition-path').value = '张三/好感';
    click($('kaleido-values-trigger-editor-save'));
  }
  const body = $('kaleido-values-triggers-body');
  const rows = () => Array.from(body.querySelectorAll('.kaleido-values__row'));
  assert(rows().length === 3, '应有 3 个触发');
  stubRowRects(rows());
  const handle = rows()[0].querySelector('.kaleido-values__drag-handle');
  assert(handle, '触发行应有拖动把手');
  dragRowByHandle(handle, 15, 75);
  const domIds = rows().map((r) => r.dataset.id).join(',');
  const dataIds = ui.getValuesTriggers(hostCtx).map((t) => t.id).join(',');
  assert(domIds === dataIds, '数据层顺序应与 DOM 一致');
  assert(rows()[2].querySelector('.kaleido-values__row-name').textContent === '事件A', '事件A 应拖到末尾');
});

runner.run();
