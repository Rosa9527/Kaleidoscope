// 万华镜游戏模式展示面板 UI 测试（jsdom）：视图创建 / 档案总览 / 更新状态。
'use strict';
const { JSDOM } = require('jsdom');
const { readSources, loadInContext, createRunner, makeContext } = require('./harness');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

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
  confirm: () => true,
  toastr: { success() {}, info() {}, warning() {}, error() {} },
  Luker: { getContext: () => hostCtx },
};

const ui = loadInContext(sandbox, readSources());
const runner = createRunner();
const assert = (condition, message) => { if (!condition) throw new Error(message || '断言失败'); };
const $ = (id) => dom.window.document.getElementById(id);

function click(el) {
  el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

function entries() {
  return Array.from($('kaleido-game-tree').querySelectorAll('.kaleido-game__entry'));
}

function chapters() {
  return Array.from($('kaleido-game-tree').querySelectorAll('.kaleido-game__chapter'));
}

function entryByPath(path) {
  const key = path.join('/');
  const entry = entries().find((r) => JSON.parse(r.dataset.path || '[]').join('/') === key);
  assert(entry, `未找到条目：${key}`);
  return entry;
}

// ---------- 初始化 ----------
runner.test('createPanel 创建游戏模式视图与首页卡片', () => {
  ui.createPanel();
  assert($('kaleido-game-view'), '应创建游戏模式视图');
  assert($('kaleido-home-game-button'), '首页标语旁应有游戏模式小图标');
  assert($('kaleido-game-refresh'), '应有刷新按钮');
  assert($('kaleido-game-tree'), '应有档案总览区');
  assert($('kaleido-game-updated'), '应有最近更新时间位');
  assert($('kaleido-game-view').classList.contains('is-active') === false, '初始不应激活');
});

// ---------- 数据准备 ----------
runner.test('游戏模式：档案展示游戏值，无工程标注', () => {
  // 注册键 + 默认值
  ui.upsertValuesKey(hostCtx, '好感', '友好互动 +5，冲突 -10，上限 100');
  ui.upsertValuesKey(hostCtx, '金币', '获得 +N，消费 -N，下限 0');
  const defaults = ui.getValuesDefaults(hostCtx);
  defaults['好感'] = 40;
  defaults['金币'] = 120;
  defaults['张三'] = { 好感: 30, 状态: '清醒' };
  ui.saveValuesData(hostCtx);
  // 勾选注入：好感 + 张三/状态
  ui.setValuesInjectEnabled(hostCtx, true);
  ui.setValuesInjectPath(hostCtx, '好感', true);
  ui.setValuesInjectPath(hostCtx, '张三', true);
  ui.setValuesInjectPath(hostCtx, '张三/状态', true);

  ui.showPanelView('kaleido-game-view');
  assert($('kaleido-game-view').classList.contains('is-active'), '游戏模式视图应激活');
  assert($('kaleido-panel-title').textContent === '游戏模式', '面板标题应为游戏模式');

  // 档案：顶层条目 + 章节
  const topNames = entries().map((row) => row.querySelector('.kaleido-game__entry-name')?.textContent || '');
  assert(topNames.includes('好感') && topNames.includes('金币'), '顶层应显示全部条目');
  assert(chapters().length === 1, '应有 1 个章节');
  const zhangSeal = chapters()[0].querySelector('.kaleido-game__chapter-seal');
  assert(zhangSeal && zhangSeal.textContent === '张三', '章节印应为张三');

  // 无「注入 / 派生 / 项数」等工程标注
  assert(!$('kaleido-game-tree').textContent.includes('注入'), '档案不应出现注入标注');
  assert(!$('kaleido-game-tree').textContent.includes('派生'), '档案不应出现派生标注');
  assert(!$('kaleido-game-tree').querySelector('.kaleido-game__row-count'), '不应有项数徽标');
  assert(!$('kaleido-game-tree').querySelector('[data-action="toggle"]'), '档案不应有折叠按钮');

  // 值显示
  const haoganRow = entryByPath(['好感']);
  assert(haoganRow.querySelector('.kaleido-game__entry-value').textContent === '40', '好感值应显示 40');
  const coinRow = entryByPath(['金币']);
  assert(coinRow.querySelector('.kaleido-game__entry-value').textContent === '120', '金币值应显示 120');
});

// ---------- 章节内容平铺展示 ----------
runner.test('游戏模式：章节内容直接展示，无需展开', () => {
  const childNames = entries().map((row) => row.querySelector('.kaleido-game__entry-name')?.textContent || '');
  assert(childNames.includes('状态'), '章节内条目应直接展示');
  const zhangState = entryByPath(['张三', '状态']);
  assert(zhangState.querySelector('.kaleido-game__entry-value').textContent === '清醒', '章节内值应显示');
});

// ---------- 游戏值（聊天绑定）与更新时间 ----------
runner.test('游戏模式：游戏值已初始化时显示聊天数据与最近更新', () => {
  const tree = { 好感: 55, 金币: 80, 张三: { 好感: 20, 状态: '疲惫' } };
  ui.saveValuesChatState(hostCtx, tree, { immediate: true });
  ui.renderGameView();
  const haoganRow = entryByPath(['好感']);
  assert(haoganRow.querySelector('.kaleido-game__entry-value').textContent === '55', '应显示聊天中的游戏值 55');
  const updated = $('kaleido-game-updated');
  assert(!updated.hidden && updated.textContent.includes('最近更新'), '应显示最近更新时间');
});

// ---------- 齿轮返回工作台 ----------
runner.test('游戏模式：齿轮按钮返回工作台主页', () => {
  ui.showPanelView('kaleido-game-view');
  assert($('kaleido-game-view').classList.contains('is-active'), '前置：游戏模式视图应激活');
  click($('kaleido-game-gear'));
  assert($('kaleido-home-view').classList.contains('is-active'), '点击齿轮应回到工作台主页');
  assert($('kaleido-game-view').classList.contains('is-active') === false, '游戏模式视图应隐藏');
});

// ---------- 刷新按钮 ----------
runner.test('游戏模式：刷新按钮重新渲染', () => {
  const state = ui.getValuesChatState(hostCtx);
  state.values['金币'] = 999;
  ui.saveValuesChatState(hostCtx, state.values, { immediate: true });
  click($('kaleido-game-refresh'));
  const coinRow = entryByPath(['金币']);
  assert(coinRow.querySelector('.kaleido-game__entry-value').textContent === '999', '刷新后应显示最新值');
});

// ---------- 空档案 ----------
runner.test('游戏模式：无变量时显示空档案提示', () => {
  const emptyCtx = makeContext();
  emptyCtx.chatMetadata = {};
  emptyCtx.saveChat = () => {};
  const prev = sandbox.Luker.getContext;
  sandbox.Luker.getContext = () => emptyCtx;
  try {
    ui.renderGameView();
    const empty = $('kaleido-game-tree').querySelector('.kaleido-game__empty');
    assert(empty, '应显示空档案提示');
  } finally {
    sandbox.Luker.getContext = prev;
  }
});

runner.run();
