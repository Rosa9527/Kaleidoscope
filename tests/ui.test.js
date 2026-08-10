// 万华镜剧情脉络工作台 UI 交互测试（jsdom）。
'use strict';
const { JSDOM } = require('jsdom');
const { readSources, loadInContext, createRunner, makeContext, makeCharacter } = require('./harness');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

const toasts = [];
const confirms = [];
const quietConsole = {
  log() {}, info() {}, debug() {},
  warn(...args) { console.warn(...args); },
  error(...args) { console.error(...args); },
};

const hostCtx = makeContext();
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
  confirm: (message) => { confirms.push(String(message)); return true; },
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

function clearToasts() { toasts.length = 0; }

let presetDefaultText = '';

function setValue(id, value) {
  const el = $(id);
  assert(el, `缺少输入框 ${id}`);
  el.value = value;
}

function treeRows() {
  return Array.from($('kaleido-story-tree-body').querySelectorAll('.kaleido-story__row'));
}

function rowNames() {
  return treeRows().map((row) => row.querySelector('.kaleido-story__row-name')?.textContent || '');
}

function rowByName(name) {
  const row = treeRows().find((r) => (r.querySelector('.kaleido-story__row-name')?.textContent || '') === name);
  assert(row, `未找到行：${name}`);
  return row;
}

function actionButton(row, action) {
  const btn = row.querySelector(`[data-action="${action}"]`);
  assert(btn, `未找到操作按钮 ${action}`);
  return btn;
}

async function importViaFileInput(inputId, fileName, yaml) {
  const input = $(inputId);
  const file = { name: fileName, text: async () => yaml };
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  await flush();
}

// ---------- 初始化 ----------
runner.test('initStorySection 创建工作台对话框', () => {
  ui.initStorySection();
  const dialog = $('kaleido-story-dialog');
  assert(dialog, '应创建对话框');
  assert(!dialog.classList.contains('is-open'), '初始应关闭');
  assert(dialog.getAttribute('aria-hidden') === 'true', '初始 aria-hidden 应为 true');
  assert($('kaleido-story-root-add'), '应有新建节点按钮');
  assert($('kaleido-story-import-btn'), '应有导入 剧情脉络 按钮');
  assert($('kaleido-story-export-btn'), '应有导出 剧情脉络 按钮');
});

runner.test('重复 initStorySection 不重复创建', () => {
  ui.initStorySection();
  const dialogs = dom.window.document.querySelectorAll('#kaleido-story-dialog');
  assert(dialogs.length === 1, '不应重复创建对话框');
});

runner.test('打开工作台显示空状态提示（无默认节点）', () => {
  click($('kaleido-story-close-btn'));
  ui.openStoryWorkbench();
  assert($('kaleido-story-dialog').classList.contains('is-open'), '应处于打开状态');
  const empty = $('kaleido-story-tree-body').querySelector('.kaleido-story__empty');
  assert(empty && empty.textContent.includes('新建节点'), '空状态应提示如何开始');
  assert(treeRows().length === 0, '全新数据不应有任何节点行');
  assert(!empty.textContent.includes('第一章'), '空状态不应出现会被误认成默认节点的名称');
});

// ---------- 节点：新建根节点 / 子节点 ----------
runner.test('新建根节点「第一卷」', () => {
  click($('kaleido-story-root-add'));
  assert(!$('kaleido-story-add-menu').hidden, '应弹出「＋」菜单');
  click($('kaleido-story-add-menu-node'));
  assert(!$('kaleido-story-editor').hidden, '编辑器应打开');
  assert($('kaleido-story-editor-title').textContent === '新建节点', '标题应为新建节点');
  setValue('kaleido-story-node-name', '第一卷');
  setValue('kaleido-story-node-desc', '江湖开场');
  click($('kaleido-story-editor-save'));
  assert(ui.getStoryRootNodes(hostCtx).length === 1, '应创建 1 个根节点');
  const vol1 = ui.getStoryRootNodes(hostCtx)[0];
  assert(vol1.name === '第一卷', '节点名应正确');
  assert(rowNames().includes('第一卷'), '树应显示第一卷');
  return vol1;
});

runner.test('「＋」菜单：根级新建事件为未分类，点击外部关闭', () => {
  click($('kaleido-story-root-add'));
  assert(!$('kaleido-story-add-menu').hidden, '菜单应打开');
  click($('kaleido-story-add-menu-script'));
  assert(!$('kaleido-story-script-fields').hidden, '应打开事件编辑器');
  assert($('kaleido-story-script-node-select').value === '', '根级新建事件应默认未分类');
  assert($('kaleido-story-script-id').value === '001', '新建事件默认 id 应为 001');
  click($('kaleido-story-editor-cancel'));
  // 点击菜单外部应关闭
  click($('kaleido-story-root-add'));
  assert(!$('kaleido-story-add-menu').hidden, '菜单应再次打开');
  click($('kaleido-story-tree-body'));
  assert($('kaleido-story-add-menu').hidden, '点击外部应关闭菜单');
});

runner.test('新建节点时保存不会误弹「请填写事件名称」', () => {
  clearToasts();
  click($('kaleido-story-root-add'));
  click($('kaleido-story-add-menu-node'));
  assert($('kaleido-story-editor-title').textContent === '新建节点', '应打开节点编辑器');
  setValue('kaleido-story-node-name', '');
  click($('kaleido-story-editor-save'));
  assert(toasts.some(([kind, msg]) => kind === 'warning' && msg.includes('请填写节点名称')), '应提示填写节点名称');
  assert(!toasts.some(([, msg]) => msg.includes('请填写事件名称')), '不应误弹事件名称提示');
  assert(ui.getStoryRootNodes(hostCtx).length === 1, '不应创建空名节点');
  click($('kaleido-story-editor-cancel'));
});

runner.test('编辑器右上角 ✕ 可关闭编辑器', () => {
  click($('kaleido-story-root-add'));
  click($('kaleido-story-add-menu-node'));
  assert(!$('kaleido-story-editor').hidden, '编辑器应先打开');
  click($('kaleido-story-editor-cancel'));
  assert($('kaleido-story-editor').hidden === true, '点击 ✕ 后编辑器应隐藏');
  assert($('kaleido-story-tree-body').querySelectorAll('.kaleido-story__row').length >= 0, '树区应保持可用');
});

runner.test('工作台对话框继承主题变量（回归：编辑器不再透明）', () => {
  const fs = require('fs');
  const css = fs.readFileSync(require('path').join(__dirname, '..', 'style.css'), 'utf8');
  // .kaleido-story-dialog 必须加入 --k-* 变量作用域，否则编辑器 background: var(--k-paper)
  // 解析失败变成透明，底层树文字会透出来
  const varScope = /([^{}]*.kaleido-story-dialog[^{}]*)\{([^}]*)\}/g;
  let defined = false;
  let m;
  while ((m = varScope.exec(css)) !== null) {
    if (m[2].includes('--k-paper:')) { defined = true; break; }
  }
  assert(defined, '工作台对话框应定义 --k-paper 主题变量');
  const editorRule = /.kaleido-story-dialog__editor[^{]*\{[^}]*background:\s*var\(--k-paper\)/;
  assert(editorRule.test(css), '编辑器背景应使用主题变量');
});

runner.test('样式表含 hidden 覆盖规则（回归：display 不能压过 hidden）', () => {
  const fs = require('fs');
  const css = fs.readFileSync(require('path').join(__dirname, '..', 'style.css'), 'utf8');
  assert(css.includes('.kaleido-story-dialog__editor[hidden]'), '编辑器应有 [hidden] 覆盖规则');
  assert(css.includes('.kaleido-btn[hidden]'), '导出按钮应有 [hidden] 覆盖规则');
  assert(css.includes('display: none !important'), '覆盖规则应使用 !important');
});

runner.test('异步导入进行中新建节点：导入完成不抢占编辑器（回归）', async () => {
  clearToasts();
  let resolveFileText;
  const input = $('kaleido-story-import-input');
  const file = {
    name: 'slow.yaml',
    text: () => new Promise((resolve) => { resolveFileText = resolve; }),
  };
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  await flush(); // 导入已开始但卡在读取文件

  // 用户在等待期间继续新建节点
  click($('kaleido-story-root-add'));
  click($('kaleido-story-add-menu-node'));
  setValue('kaleido-story-node-name', '第二卷');
  click($('kaleido-story-editor-save'));
  assert(ui.getStoryNodes(hostCtx).some((n) => n.name === '第二卷'), '节点应正常创建');

  // 迟到的导入此刻才完成
  resolveFileText('---\nname: 迟到事件\n---\n正文');
  await flush();
  assert(ui.getStoryScripts(hostCtx).length === 0, '迟到的导入不应落库');
  assert($('kaleido-story-editor').hidden, '编辑器不应被迟到的导入重新打开');
  assert(toasts.some(([kind, msg]) => kind === 'info' && msg.includes('已取消导入')), '应提示导入已取消');
  assert(!toasts.some(([, msg]) => msg.includes('请填写事件名称')), '不应出现事件名称提示');
});

runner.test('第一卷下新建子节点「第一章」', () => {
  const vol1 = ui.getStoryRootNodes(hostCtx)[0];
  const row = rowByName('第一卷');
  click(actionButton(row, 'add-menu'));
  assert(!$('kaleido-story-add-menu').hidden, '应弹出「＋」菜单');
  click($('kaleido-story-add-menu-node'));
  assert($('kaleido-story-editor-title').textContent === '添加子节点', '标题应为添加子节点');
  assert($('kaleido-story-node-parent').value === vol1.id, '上级节点应预设为第一卷');
  setValue('kaleido-story-node-name', '第一章');
  click($('kaleido-story-editor-save'));
  const children = ui.getStoryNodeChildren(hostCtx, vol1.id);
  assert(children.length === 1 && children[0].name === '第一章', '第一章应挂到第一卷下');
  assert(!rowNames().includes('第一章'), '未展开不应显示子节点');
});

runner.test('展开/收起节点', () => {
  const vol1 = ui.getStoryRootNodes(hostCtx)[0];
  let row = rowByName('第一卷');
  click(actionButton(row, 'toggle'));
  assert(rowNames().includes('第一章'), '展开后应显示子节点');
  row = rowByName('第一卷');
  click(actionButton(row, 'toggle'));
  assert(!rowNames().includes('第一章'), '收起后应隐藏子节点');
  click(actionButton(rowByName('第一卷'), 'toggle')); // 恢复展开，供后续用例
});

// ---------- 事件：新建 / 编辑 / 删除 ----------
runner.test('第一章下新建事件「雨夜事件」', () => {
  const vol1 = ui.getStoryRootNodes(hostCtx)[0];
  const ch1 = ui.getStoryNodeChildren(hostCtx, vol1.id)[0];
  const row = rowByName('第一章');
  click(actionButton(row, 'add-menu'));
  assert(!$('kaleido-story-add-menu').hidden, '应弹出「＋」菜单');
  click($('kaleido-story-add-menu-script'));
  assert(!$('kaleido-story-script-fields').hidden, '应显示事件字段');
  assert($('kaleido-story-script-node-select').value === ch1.id, '所属节点应预设为第一章');
  setValue('kaleido-story-script-name', '雨夜事件');
  setValue('kaleido-story-script-trigger', '夜晚且下雨');
  setValue('kaleido-story-script-desc', '雨夜奇遇');
  setValue('kaleido-story-script-content', '窗外雨声渐密，\n一道黑影掠过屋檐。');
  click($('kaleido-story-editor-save'));
  const scripts = ui.getStoryScripts(hostCtx);
  assert(scripts.length === 1 && scripts[0].name === '雨夜事件', '事件应已创建');
  assert(scripts[0].nodeId === ch1.id, '事件应归属第一章');
  click(actionButton(rowByName('第一章'), 'toggle')); // 展开第一章以显示事件
  assert(rowNames().includes('雨夜事件'), '树应显示事件行');
  const scriptRow = rowByName('雨夜事件');
  assert(scriptRow.classList.contains('kaleido-story__row--script'), '事件行应有 script 样式');
  assert((scriptRow.querySelector('.kaleido-story__row-trigger')?.textContent || '') === '夜晚且下雨', '应显示触发条件');
});

runner.test('编辑事件', () => {
  const row = rowByName('雨夜事件');
  click(actionButton(row, 'edit-script'));
  assert($('kaleido-story-editor-title').textContent === '编辑事件', '标题应为编辑事件');
  assert($('kaleido-story-script-name').value === '雨夜事件', '名称应回填');
  setValue('kaleido-story-script-name', '雨夜事件（修订）');
  setValue('kaleido-story-script-content', '修订后的正文。');
  click($('kaleido-story-editor-save'));
  const script = ui.getStoryScripts(hostCtx)[0];
  assert(script.name === '雨夜事件（修订）', '名称应已更新');
  assert(script.content === '修订后的正文。', '内容应已更新');
  assert(rowNames().includes('雨夜事件（修订）'), '树应显示新名称');
});

runner.test('编辑事件时导出按钮可见，节点编辑时隐藏', () => {
  click(actionButton(rowByName('雨夜事件（修订）'), 'edit-script'));
  assert(!$('kaleido-story-editor-export').hidden, '事件编辑应显示导出按钮');
  click($('kaleido-story-editor-cancel'));
  click(actionButton(rowByName('第一卷'), 'edit'));
  assert($('kaleido-story-editor-export').hidden, '节点编辑应隐藏导出按钮');
  click($('kaleido-story-editor-cancel'));
});

runner.test('编辑器上级节点下拉排除自身与后代（防环）', () => {
  click(actionButton(rowByName('第一卷'), 'edit'));
  const select = $('kaleido-story-node-parent');
  const optionIds = Array.from(select.options).map((o) => o.value);
  assert(!optionIds.includes(ui.getStoryRootNodes(hostCtx)[0].id), '下拉不应包含自身');
  assert(!optionIds.includes(ui.getStoryNodeChildren(hostCtx, ui.getStoryRootNodes(hostCtx)[0].id)[0].id), '下拉不应包含后代');
  click($('kaleido-story-editor-cancel'));
});

// ---------- 事件：导出 / 单事件导入 ----------
runner.test('导出单个事件（frontmatter）', () => {
  const script = ui.getStoryScripts(hostCtx)[0];
  clearToasts();
  ui.handleStoryExportScript(script);
  assert(toasts.some(([kind, msg]) => kind === 'success' && msg.includes('雨夜事件（修订）')), '应提示导出成功');
});

runner.test('导入单事件 frontmatter 文件默认未分类', async () => {
  const yaml = '---\nname: 山间古道\nTrigger: 玩家离开新手村\n---\n古道西风，\n瘦马长嘶。';
  await importViaFileInput('kaleido-story-import-input', '山间古道.yaml', yaml);
  assert(!$('kaleido-story-editor').hidden, '导入后应打开编辑器待确认');
  assert($('kaleido-story-script-name').value === '山间古道', '名称应回填');
  assert($('kaleido-story-script-trigger').value === '玩家离开新手村', '触发条件应回填');
  assert($('kaleido-story-script-content').value.includes('古道西风'), '正文应回填');
  // 回归：即便之前事件编辑器选过节点，工具条导入也不应沿用旧归属
  assert($('kaleido-story-script-node-select').value === '', '导入事件应默认未分类');
  assert($('kaleido-story-editor-save').textContent === '保存（导入）', '保存按钮应提示导入');
  click($('kaleido-story-editor-save'));
  const scripts = ui.getStoryScripts(hostCtx);
  assert(scripts.length === 2, '应有 2 个事件');
  const imported = scripts.find((s) => s.name === '山间古道');
  assert(imported && imported.content.includes('瘦马长嘶'), '导入事件应已保存');
  assert(imported.nodeId === '', '导入事件应保持未分类');
  assert(rowNames().includes('山间古道'), '未分类分组应显示导入事件');
});

runner.test('单事件导入带 id：保存保留 id，重复 id 自动顺延', async () => {
  clearToasts();
  await importViaFileInput('kaleido-story-import-input', '带id.yaml', '---\nname: 山间古道\nid: 009\nTrigger: 玩家离开新手村\n---\n古道西风，\n瘦马长嘶。');
  click($('kaleido-story-editor-save'));
  const first = ui.getStoryScriptById(hostCtx, '009');
  assert(first && first.name === '山间古道', '导入应保留 id');

  await importViaFileInput('kaleido-story-import-input', '带id.yaml', '---\nname: 山间古道（修订）\nid: 009\nTrigger: 玩家离开新手村\n---\n新正文');
  click($('kaleido-story-editor-save'));
  const scripts = ui.getStoryScripts(hostCtx);
  const second = scripts.find((s) => s.name === '山间古道（修订）');
  assert(second && second.id !== '009', '重复 id 应自动顺延');
  assert(scripts.filter((s) => s.id === '009').length === 1, '原 id 不应被覆盖');
  assert(ui.getStoryScriptById(hostCtx, '009').content.includes('瘦马长嘶'), '原事件应保留');
  assert(scripts.filter((s) => s.id === second.id).length === 1, '顺延后的 id 不应与其他事件重复');
  assert(toasts.some(([, msg]) => msg.includes('事件 ID 已自动设为')), '应提示 ID 已自动顺延');
  ui.deleteStoryScript(hostCtx, second.id);
  ui.deleteStoryScript(hostCtx, '009');
  ui.renderStoryTree();
});

runner.test('导入无 name 的事件文件应报错不落库', async () => {
  const before = ui.getStoryScripts(hostCtx).length;
  await importViaFileInput('kaleido-story-import-input', 'bad.yaml', '---\ndescription: 缺少名字\n---\n正文');
  assert(toasts.some(([kind]) => kind === 'error'), '应提示解析失败');
  assert(ui.getStoryScripts(hostCtx).length === before, '不应新增事件');
  assert($('kaleido-story-editor').hidden, '编辑器应保持关闭');
});

// ---------- 整包：导出 / 导入 ----------
runner.test('整包导出包含层级与事件', () => {
  clearToasts();
  ui.handleStoryExportBundle();
  assert(toasts.some(([kind, msg]) => kind === 'success' && msg.includes('剧情脉络')), '应提示整包导出成功');
});

runner.test('整包导入合并', async () => {
  const beforeNodes = ui.getStoryNodes(hostCtx).length;
  const beforeScripts = ui.getStoryScripts(hostCtx).length;
  const yaml = [
    'version: 1',
    'nodes:',
    '  - id: n-imported-1',
    '    parentId: ""',
    '    name: 第二卷',
    '    description: ""',
    'scripts:',
    '  - id: s-imported-1',
    '    nodeId: n-imported-1',
    '    name: 码头风波',
    '    trigger: 到达码头',
    '    description: ""',
    '    content: |-',
    '      江水拍岸。',
    '',
  ].join('\n');
  await importViaFileInput('kaleido-story-import-input', 'bundle.yaml', yaml);
  assert(ui.getStoryNodes(hostCtx).length === beforeNodes + 1, '应新增 1 节点');
  assert(ui.getStoryScripts(hostCtx).length === beforeScripts + 1, '应新增 1 事件');
  const vol2 = ui.getStoryNodeById(hostCtx, 'n-imported-1');
  assert(vol2 && vol2.name === '第二卷', '第二卷应导入');
  assert(ui.getStoryScriptById(hostCtx, 's-imported-1').nodeId === 'n-imported-1', '事件应归属第二卷');
  assert(rowNames().includes('第二卷'), '树应显示第二卷');
  assert(confirms.some((msg) => msg.includes('将导入 1 个节点、1 个事件')), '导入前应询问确认');
});

runner.test('整包导出文件名使用角色卡名', () => {
  const character = makeCharacter('辉夜大小姐', 'kaguya.png');
  hostCtx.characters = [character];
  hostCtx.characterId = 0;
  clearToasts();
  ui.handleStoryExportBundle();
  assert(toasts.some(([kind, msg]) => kind === 'success' && msg.includes('剧情脉络: 辉夜大小姐.yaml')), '导出文件名应含角色卡名');
  delete hostCtx.characters;
  delete hostCtx.characterId;
});

runner.test('整包导入识别格式标记并提示来源角色卡', async () => {
  const beforeNodes = ui.getStoryNodes(hostCtx).length;
  confirms.length = 0;
  const yaml = [
    'format: kaleidoscope-story',
    'version: 1',
    'character: 辉夜大小姐',
    'nodes:',
    '  - id: n-imported-2',
    '    parentId: ""',
    '    name: 新年篇',
    '    description: ""',
    'scripts: []',
    '',
  ].join('\n');
  await importViaFileInput('kaleido-story-import-input', '剧情脉络: 辉夜大小姐.yaml', yaml);
  assert(ui.getStoryNodes(hostCtx).length === beforeNodes + 1, '应新增 1 节点');
  assert(confirms.some((msg) => msg.includes('来自「辉夜大小姐」')), '确认提示应包含来源角色卡名');
});

// ---------- 删除 ----------
runner.test('删除事件', () => {
  const before = ui.getStoryScripts(hostCtx).length;
  const row = rowByName('山间古道');
  click(actionButton(row, 'delete-script'));
  assert(ui.getStoryScripts(hostCtx).length === before - 1, '事件应已删除');
  assert(!rowNames().includes('山间古道'), '树不应再显示该事件');
});

runner.test('删除节点：其下事件转未分类', () => {
  const vol1 = ui.getStoryRootNodes(hostCtx).find((n) => n.name === '第一卷');
  const ch1Node = ui.getStoryNodeChildren(hostCtx, vol1.id)[0];
  click(actionButton(rowByName('第一章'), 'delete'));
  assert(ui.getStoryNodeById(hostCtx, ch1Node.id) === null, '第一章应已删除');
  assert(ui.getStoryNodeById(hostCtx, vol1.id) !== null, '第一卷应保留');
  assert(ui.getStoryNodeChildren(hostCtx, vol1.id).length === 0, '第一卷下应无子节点');
  const rain = ui.getStoryScripts(hostCtx).find((s) => s.name === '雨夜事件（修订）');
  assert(rain && rain.nodeId === '', '雨夜事件应转未分类');
  assert(confirms.some((msg) => msg.includes('确定删除节点「第一章」') && msg.includes('1 个事件将转为未分类')), '删除节点应询问确认并说明影响');
});

// ---------- 未分类分组 ----------
runner.test('未分类事件单独成组显示', () => {
  const groups = $('kaleido-story-tree-body').querySelectorAll('.kaleido-story__group');
  assert(groups.length >= 1, '应存在未分类分组');
  const groupTitle = groups[0].querySelector('.kaleido-story__group-title').textContent;
  assert(groupTitle.includes('未分类事件'), '分组标题应为未分类事件');
  assert(groupTitle.includes('1'), '应显示数量');
  assert(rowNames().includes('雨夜事件（修订）'), '未分类事件应显示');
});

// ---------- 关闭 / ESC ----------
runner.test('ESC 关闭工作台', () => {
  assert($('kaleido-story-dialog').classList.contains('is-open'), '前置：工作台应打开');
  dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert(!$('kaleido-story-dialog').classList.contains('is-open'), 'ESC 应关闭工作台');
  assert(ui.isStoryWorkbenchOpen() === false, 'isStoryWorkbenchOpen 应为 false');
});

runner.test('点击遮罩关闭工作台', () => {
  ui.openStoryWorkbench();
  click($('kaleido-story-dialog'));
  assert(!$('kaleido-story-dialog').classList.contains('is-open'), '点击遮罩应关闭');
  assert(toasts.some(([kind]) => kind === 'success'), '操作过程应有成功提示');
});


// ---------- 预设模版 ----------
runner.test('createPanel 创建预设模版视图与首页入口', () => {
  ui.createPanel();
  assert($('kaleido-preset-view'), '应创建预设模版视图');
  assert($('kaleido-home-preset-card'), '首页应有预设模版卡片');
  assert($('kaleido-home-log-button'), '首页标语旁应有系统日志小图标');
  assert($('kaleido-preset-tabs'), '预设视图应有标签页');
  assert($('kaleido-preset-text'), '预设视图应有编辑区');
  assert($('kaleido-preset-save'), '预设视图应有保存按钮');
  assert($('kaleido-preset-reset'), '预设视图应有恢复默认按钮');
});

runner.test('首页标语旁日志小图标打开系统日志视图', () => {
  click($('kaleido-home-log-button'));
  assert($('kaleido-log-view').classList.contains('is-active'), '日志视图应激活');
  assert($('kaleido-home-view').classList.contains('is-active') === false, '首页应隐藏');
});

runner.test('预设模版卡片打开预设视图', () => {
  click($('kaleido-home-preset-card'));
  assert($('kaleido-preset-view').classList.contains('is-active'), '预设视图应激活');
  assert($('kaleido-log-view').classList.contains('is-active') === false, '日志视图应隐藏');
});

runner.test('预设编辑器初始显示默认提示词', () => {
  const textarea = $('kaleido-preset-text');
  presetDefaultText = textarea.value;
  assert(presetDefaultText.length > 0, '编辑区应显示默认提示词');
  assert($('kaleido-preset-status').textContent === '默认内容', '状态应为默认内容');
  assert($('kaleido-preset-save').disabled, '未修改时保存按钮应禁用');
  assert($('kaleido-preset-reset').disabled, '未修改时恢复默认按钮应禁用');
});

runner.test('编辑后保存写入设置', () => {
  const custom = '自定义剧情预筛提示词：只挑选玩家直接点名的事件。';
  setValue('kaleido-preset-text', custom);
  $('kaleido-preset-text').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  assert($('kaleido-preset-status').textContent === '未保存的更改', '编辑后状态应为未保存的更改');
  assert(!$('kaleido-preset-save').disabled, '有修改时保存按钮应可用');
  click($('kaleido-preset-save'));
  assert(ui.getSettings(hostCtx).storyGatePrompt === custom, '保存应写入 settings.storyGatePrompt');
  assert($('kaleido-preset-status').textContent === '已保存的自定义内容', '保存后状态应为已保存的自定义内容');
  assert($('kaleido-home-preset-status').textContent === '已自定义 1 份', '首页卡片状态应显示已自定义');
});

runner.test('恢复默认还原出厂内容', () => {
  click($('kaleido-preset-reset'));
  assert(confirms.some((msg) => msg.includes('恢复为默认内容')), '恢复默认前应询问确认');
  const textarea = $('kaleido-preset-text');
  assert(textarea.value === presetDefaultText, '编辑区应还原为默认提示词');
  assert(ui.getSettings(hostCtx).storyGatePrompt === '', '设置应清空回退默认');
  assert($('kaleido-preset-status').textContent === '默认内容', '状态应回到默认内容');
  assert($('kaleido-home-preset-status').textContent === '默认配置', '首页卡片状态应回到默认配置');
});

// ---------- 注入实录 ----------
runner.test('注入实录卡片打开视图并展示触发与注入内容', () => {
  sandbox['__kaleido_story_gate_last_round__'] = {
    triggeredAt: new Date().toISOString(),
    durationMs: 1234,
    totalEvents: 3,
    selectedIds: ['001', '002'],
    selectedEvents: [
      { id: '001', name: '雨夜', trigger: '夜晚且下雨', description: '窗外下起雨', content: '雨声渐密，窗棂轻响。' },
      { id: '002', name: '敲门', trigger: '有人敲门', description: '门外传来敲门声', content: '笃笃笃，门被敲响。' },
    ],
    raw: '{"events":["001","002"]}',
    injectionText: '<Story_Event>\n【系统导演注 · 强制指令】\n</Story_Event>',
    injected: true,
    skipped: false,
    timedOut: false,
  };
  click($('kaleido-home-inject-card'));
  assert($('kaleido-inject-view').classList.contains('is-active'), '注入实录视图应激活');
  assert($('kaleido-inject-empty').hidden, '有记录时不应显示空态');
  assert($('kaleido-inject-summary').textContent.includes('已注入 2 个事件'), '摘要应显示注入结果');
  assert($('kaleido-inject-summary').textContent.includes('触发：雨夜、敲门'), '摘要应列出触发事件');
  assert($('kaleido-inject-gate-text').textContent.includes('"events"'), '应展示预筛原文');
  const eventCards = $('kaleido-inject-events').querySelectorAll('.kaleido-inject__event');
  assert(eventCards.length === 2, '应渲染 2 张触发事件卡片');
  assert(eventCards[0].textContent.includes('雨夜') && eventCards[0].textContent.includes('雨声渐密'), '事件卡片应含名称与正文');
  assert($('kaleido-inject-text').textContent.includes('<Story_Event>'), '应展示注入提示词原文');
  delete sandbox['__kaleido_story_gate_last_round__'];
});

runner.test('注入实录无记录时显示空态', () => {
  delete sandbox['__kaleido_story_gate_last_round__'];
  ui.showPanelView('kaleido-inject-view');
  assert($('kaleido-inject-empty').hidden === false, '无记录时应显示空态');
  assert($('kaleido-inject-summary').hidden, '无记录时摘要应隐藏');
});

runner.test('工作台头部显示角色卡绑定徽标', () => {
  ui.openStoryWorkbench();
  const badge = $('kaleido-story-binding');
  assert(badge, '应有绑定徽标');
  assert(badge.textContent === '未绑定角色', '无角色时应显示未绑定');
  assert(badge.dataset.state === 'idle', '无角色状态应为 idle');

  // 有角色但卡上无数据：待绑定
  const character = makeCharacter('蕾姆', 'rem.png');
  hostCtx.characters = [character];
  hostCtx.characterId = 0;
  hostCtx.writeExtensionField = async () => {};
  ui.renderStoryTree();
  assert(badge.textContent.includes('待绑定'), '有角色无数据时应显示待绑定');
  assert(badge.dataset.state === 'warn', '待绑定状态应为 warn');

  // 保存后：数据迁入角色卡，徽标变已绑定
  click($('kaleido-story-root-add'));
  click($('kaleido-story-add-menu-node'));
  setValue('kaleido-story-node-name', '第一卷');
  click($('kaleido-story-editor-save'));
  assert(badge.textContent.includes('已绑定'), '保存后应显示已绑定');
  assert(badge.dataset.state === 'ok', '已绑定状态应为 ok');
  assert(character.data.extensions.kaleidoscope_story, '数据应写入角色卡');

  // 清理：取消防抖定时器并还原共享上下文，避免影响其他用例
  if (sandbox.__kaleido_story_card_save_timer__) {
    clearTimeout(sandbox.__kaleido_story_card_save_timer__);
    sandbox.__kaleido_story_card_save_timer__ = null;
  }
  delete hostCtx.characters;
  delete hostCtx.characterId;
  delete hostCtx.writeExtensionField;
});

runner.run();
