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

// ---------- 游戏地图 / 游戏数据 双入口 ----------
runner.test('游戏模式：双入口图标，默认停在游戏地图', () => {
  ui.showPanelView('kaleido-game-view');
  const mapTab = $('kaleido-game-map-tab');
  const dataTab = $('kaleido-game-data-tab');
  assert(mapTab && dataTab, '应有「游戏地图」「游戏数据」两个切换图标');
  assert(mapTab.textContent.includes('游戏地图'), '左边应是游戏地图');
  assert(dataTab.textContent.includes('游戏数据'), '右边应是游戏数据');
  assert(mapTab.classList.contains('is-active'), '默认应停在游戏地图');
  assert(dataTab.classList.contains('is-active') === false, '游戏数据默认不激活');
  assert($('kaleido-game-map-pane').hidden === false, '地图区应显示');
  assert($('kaleido-game-tree').hidden === true, '数据区默认隐藏');
  assert($('kaleido-map-crop-dialog'), '裁剪弹层应随面板创建');
});

runner.test('游戏模式：点击「游戏数据」切换值树，再切回地图', () => {
  ui.showPanelView('kaleido-game-view');
  click($('kaleido-game-data-tab'));
  assert($('kaleido-game-data-tab').classList.contains('is-active'), '游戏数据应激活');
  assert($('kaleido-game-tree').hidden === false, '值树应显示');
  assert($('kaleido-game-map-pane').hidden === true, '地图区应隐藏');
  click($('kaleido-game-map-tab'));
  assert($('kaleido-game-map-tab').classList.contains('is-active'), '切回游戏地图应激活');
  assert($('kaleido-game-map-pane').hidden === false, '地图区应恢复显示');
});

// ---------- 地图展示 ----------
runner.test('游戏模式：无地图时显示空态与「去编辑地图」', () => {
  const emptyCtx = makeContext();
  emptyCtx.chatMetadata = {};
  emptyCtx.saveChat = () => {};
  const prev = sandbox.Luker.getContext;
  sandbox.Luker.getContext = () => emptyCtx;
  try {
    ui.renderGameView();
    const pane = $('kaleido-game-map-pane');
    const empty = pane.querySelector('.kaleido-game-map__empty');
    assert(empty, '应显示地图空态');
    assert(empty.textContent.includes('暂无地图'), '空态应有「暂无地图」');
    assert($('kaleido-map-go-edit'), '空态应有去编辑按钮');
  } finally {
    sandbox.Luker.getContext = prev;
  }
});

runner.test('游戏模式：有地图时展示背景图与地点标记（名称常显）', () => {
  const mapCtx = makeContext();
  mapCtx.chatMetadata = {};
  mapCtx.saveChat = () => {};
  mapCtx.extensionSettings.Kaleidoscope = {
    mapData: {
      version: 1,
      background: 'data:image/png;base64,AAAA',
      points: [
        { id: 'p_1', name: '学校', x: 30, y: 40 },
        { id: 'p_2', name: '森林', x: 70, y: 60 },
      ],
      updatedAt: '2026-08-16T00:00:00.000Z',
    },
  };
  const prev = sandbox.Luker.getContext;
  sandbox.Luker.getContext = () => mapCtx;
  try {
    ui.renderGameView();
    const pane = $('kaleido-game-map-pane');
    assert(pane.querySelector('.kaleido-game-map__img'), '应有背景图');
    const points = pane.querySelectorAll('.kaleido-game-map__point');
    assert(points.length === 2, '应有 2 个地点标记');
    assert(points[0].textContent.includes('学校'), '标记应显示地点名称');
    const meta = pane.querySelector('.kaleido-game-map__meta');
    assert(meta && meta.textContent.includes('最近更新'), '应显示最近更新时间');
  } finally {
    sandbox.Luker.getContext = prev;
  }
});

runner.test('游戏模式：空态「去编辑地图」打开变量工作台并激活游戏地图 tab', () => {
  const emptyCtx = makeContext();
  emptyCtx.chatMetadata = {};
  emptyCtx.saveChat = () => {};
  const prev = sandbox.Luker.getContext;
  sandbox.Luker.getContext = () => emptyCtx;
  try {
    ui.renderGameView();
    click($('kaleido-map-go-edit'));
    assert($('kaleido-values-dialog').classList.contains('is-open'), '应打开变量工作台');
    assert($('kaleido-values-tab-map').classList.contains('is-active'), '应激活游戏地图 tab');
    assert(dom.window.document.querySelector('.kaleido-map-editor'), '地图编辑器内容应已渲染');
    assert($('kaleido-map-stage'), '应有编辑舞台');
  } finally {
    sandbox.Luker.getContext = prev;
  }
});

runner.run();
