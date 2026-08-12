// 万华镜剧情脉络 · 手机端面板内视图测试（jsdom，模拟 ≤640px 视口）。
'use strict';
const { JSDOM } = require('jsdom');
const { readSources, loadInContext, createRunner, makeContext } = require('./harness');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
// 模拟手机端视口：matchMedia 命中 max-width: 640px
dom.window.matchMedia = () => ({ matches: true, media: '(max-width: 640px)', addListener() {}, removeListener() {} });

const toasts = [];
const quietConsole = { log() {}, info() {}, debug() {}, warn() {}, error() {} };

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
  confirm: () => true,
  toastr: {
    success: (m) => toasts.push(['success', m]),
    info: (m) => toasts.push(['info', m]),
    warning: (m) => toasts.push(['warning', m]),
    error: (m) => toasts.push(['error', m]),
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

// ---------- 初始化 ----------
runner.test('手机端 initStorySection 创建面板内视图（不创建独立对话框）', () => {
  ui.createPanel();
  const view = $('kaleido-story-view');
  assert(view, '应创建剧情脉络面板视图');
  assert(view.classList.contains('kaleido-view'), '视图应带 kaleido-view 类');
  assert(!$('kaleido-story-dialog'), '手机端不应创建独立对话框');
  assert($('kaleido-story-root-add'), '视图内应有新建按钮');
  assert($('kaleido-story-import-btn'), '视图内应有导入按钮');
  assert($('kaleido-story-export-btn'), '视图内应有导出按钮');
  assert($('kaleido-story-binding'), '视图内应有绑定徽标');
});

runner.test('首页剧情卡片由主页切换进入剧情脉络视图', () => {
  click($('kaleido-home-story-card'));
  assert($('kaleido-story-view').classList.contains('is-active'), '剧情脉络视图应激活');
  assert(!$('kaleido-home-view').classList.contains('is-active'), '首页应取消激活');
  assert($('kaleido-panel-title').textContent === '剧情脉络', '面板标题应为剧情脉络');
  assert($('kaleido-panel-back').style.visibility === 'visible', '返回键应可见');
  assert($('kaleido-panel').querySelector('.kaleido-panel__dialog').classList.contains('is-story-mode'), '应应用 is-story-mode 宽视图');
});

runner.test('剧情脉络视图显示空状态提示', () => {
  const empty = $('kaleido-story-tree-body').querySelector('.kaleido-story__empty');
  assert(empty && empty.textContent.includes('新建节点'), '空状态应提示如何开始');
  assert(treeRows().length === 0, '全新数据不应有任何节点行');
});

runner.test('视图内新建根节点「第一卷」', () => {
  click($('kaleido-story-root-add'));
  click($('kaleido-story-add-menu-node'));
  setValue('kaleido-story-node-name', '第一卷');
  click($('kaleido-story-editor-save'));
  assert(rowNames().includes('第一卷'), '树应显示新建节点');
});

runner.test('ESC 从剧情脉络视图返回首页', () => {
  dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert($('kaleido-home-view').classList.contains('is-active'), 'ESC 应回到首页');
  assert(!$('kaleido-story-view').classList.contains('is-active'), '剧情脉络视图应取消激活');
});

runner.test('返回按钮从剧情脉络视图回首页', () => {
  click($('kaleido-home-story-card'));
  assert($('kaleido-story-view').classList.contains('is-active'), '前置：剧情脉络视图应激活');
  click($('kaleido-panel-back'));
  assert($('kaleido-home-view').classList.contains('is-active'), '返回键应回到首页');
  assert($('kaleido-panel-back').style.visibility === 'hidden', '首页时返回键应隐藏');
});

runner.test('视图内绑定徽标显示未绑定角色', () => {
  assert($('kaleido-story-binding').textContent === '未绑定角色', '无角色时应显示未绑定角色');
});

runner.run();