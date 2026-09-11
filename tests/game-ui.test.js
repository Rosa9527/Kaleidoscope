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

// 折叠场景：条目不渲染时返回 null（不抛错）。
function entryByPathMaybe(path) {
  const key = path.join('/');
  return entries().find((r) => JSON.parse(r.dataset.path || '[]').join('/') === key) || null;
}

function chapterByPath(path) {
  const key = path.join('/');
  return chapters().find((c) => JSON.parse(c.dataset.path || '[]').join('/') === key) || null;
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

// ---------- 地图系统独立入口 ----------
runner.test('首页应有「游戏地图」卡片，点击打开地图工作台', () => {
  assert($('kaleido-home-map-card'), '首页应有游戏地图卡片');
  assert($('kaleido-home-map-status'), '游戏地图卡片应有状态位');
  click($('kaleido-home-map-card'));
  assert($('kaleido-map-dialog').classList.contains('is-open'), '点击卡片应打开地图工作台');
  assert(dom.window.document.querySelector('.kaleido-map-editor'), '地图编辑器内容应已渲染');
  // 关闭工作台，不影响后续用例
  click($('kaleido-map-close-btn'));
  assert($('kaleido-map-dialog').classList.contains('is-open') === false, '关闭按钮应能关闭工作台');
});

runner.test('首页地图卡片状态：无地图显示「尚未制作」，有地图显示地点数', () => {
  ui.refreshHomeMapStatus();
  assert($('kaleido-home-map-status').textContent === '尚未制作', '无地图应显示尚未制作');
  const mapCtx = makeContext();
  mapCtx.extensionSettings.Kaleidoscope = {
    mapData: {
      version: 1,
      background: 'data:image/png;base64,AAAA',
      points: [{ id: 'p_1', name: '学校', x: 30, y: 40 }],
      updatedAt: '2026-08-16T00:00:00.000Z',
    },
  };
  const prev = sandbox.Luker.getContext;
  sandbox.Luker.getContext = () => mapCtx;
  try {
    ui.refreshHomeMapStatus();
    assert($('kaleido-home-map-status').textContent.includes('1 地点'), '有地图应显示地点数');
  } finally {
    sandbox.Luker.getContext = prev;
    ui.refreshHomeMapStatus();
  }
});

runner.test('变量工作台不应再有游戏地图 tab', () => {
  assert($('kaleido-values-tab-map') === null, '变量工作台不应有游戏地图 tab');
  assert($('kaleido-values-map-pane') === null, '变量工作台不应有地图 pane');
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

  // 值显示
  const haoganRow = entryByPath(['好感']);
  assert(haoganRow.querySelector('.kaleido-game__entry-value').textContent === '40', '好感值应显示 40');
  const coinRow = entryByPath(['金币']);
  assert(coinRow.querySelector('.kaleido-game__entry-value').textContent === '120', '金币值应显示 120');
});

// ---------- 章节默认折叠 ----------
runner.test('游戏模式：章节默认折叠，只显示章节头不显示内容', () => {
  const zhangChapter = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  assert(zhangChapter, '应有张三章节');
  assert(!zhangChapter.classList.contains('is-expanded'), '章节默认应为折叠态');
  const head = zhangChapter.querySelector('.kaleido-game__chapter-head');
  assert(head && head.getAttribute('aria-expanded') === 'false', '折叠态章节头 aria-expanded 应为 false');
  assert(head.querySelector('.kaleido-game__chapter-chevron'), '章节头应有展开箭头');
  assert(!entryByPathMaybe(['张三', '状态']), '折叠时章节内条目不渲染');
  assert(entries().every((row) => JSON.parse(row.dataset.path || '[]')[0] !== '张三'), '折叠时不应出现章节内条目');
});

runner.test('游戏模式：点章节头展开显示内容，再点收起', () => {
  const zhangChapter = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  click(zhangChapter.querySelector('.kaleido-game__chapter-head'));
  const expandedChapter = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  assert(expandedChapter.classList.contains('is-expanded'), '点击后章节应展开');
  assert(
    expandedChapter.querySelector('.kaleido-game__chapter-head').getAttribute('aria-expanded') === 'true',
    '展开后 aria-expanded 应为 true',
  );
  const state = entryByPath(['张三', '状态']);
  assert(state.querySelector('.kaleido-game__entry-value').textContent === '清醒', '展开后章节内值应显示');
  assert(entryByPath(['张三', '好感']), '展开后章节内全部条目应显示');
  // 再点一次收起
  click(expandedChapter.querySelector('.kaleido-game__chapter-head'));
  const collapsedChapter = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  assert(!collapsedChapter.classList.contains('is-expanded'), '再次点击应收起章节');
  assert(!entryByPathMaybe(['张三', '状态']), '收起后章节内条目应消失');
});

runner.test('游戏模式：手动刷新保留已展开的章节，重新进入视图仍保持展开', () => {
  ui.showPanelView('kaleido-game-view');
  const zhangChapter = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  click(zhangChapter.querySelector('.kaleido-game__chapter-head'));
  click($('kaleido-game-refresh'));
  const afterRefresh = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  assert(afterRefresh.classList.contains('is-expanded'), '刷新应保留展开状态');
  // 离开再进入：展开状态从设置恢复，仍是上次的样子
  ui.showPanelView('kaleido-home-view');
  ui.showPanelView('kaleido-game-view');
  click($('kaleido-game-data-tab'));
  const afterReenter = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  assert(afterReenter.classList.contains('is-expanded'), '重新进入应保持上次的展开状态');
  // 收起后同样记住：重新进入是折叠的
  click(afterReenter.querySelector('.kaleido-game__chapter-head'));
  ui.showPanelView('kaleido-home-view');
  ui.showPanelView('kaleido-game-view');
  click($('kaleido-game-data-tab'));
  const collapsedAgain = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  assert(!collapsedAgain.classList.contains('is-expanded'), '收起操作也应被记住');
});

// ---------- 展开状态持久化 ----------
runner.test('游戏模式：展开状态写入设置（路径数组），换角色卡不命中的路径自然折叠', () => {
  ui.saveValuesChatState(hostCtx, { 好感: 55, 张三: { 好感: 20 } }, { immediate: true });
  ui.showPanelView('kaleido-game-view');
  click($('kaleido-game-data-tab'));
  const zhang = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  click(zhang.querySelector('.kaleido-game__chapter-head'));
  const saved = hostCtx.extensionSettings.Kaleidoscope.gameExpandedChapters;
  assert(Array.isArray(saved), '展开状态应以数组形式写入设置');
  assert(saved.includes('张三'), '设置里应记录已展开的章节路径');
  // 换角色卡：设置里的旧路径（张三 / 不存在/的/路径）在新变量树里不命中，
  // 新树里的章节照常默认折叠，陈旧项不影响渲染。
  const otherCtx = makeContext();
  otherCtx.chatMetadata = {};
  otherCtx.saveChat = () => {};
  otherCtx.extensionSettings.Kaleidoscope = {
    ...hostCtx.extensionSettings.Kaleidoscope,
    gameExpandedChapters: ['张三', '不存在/的/路径'],
  };
  ui.saveValuesChatState(otherCtx, { 李四: { 状态: '清醒' } }, { immediate: true });
  const prev = sandbox.Luker.getContext;
  sandbox.Luker.getContext = () => otherCtx;
  try {
    ui.renderGameView(true);
    const lisi = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '李四');
    assert(lisi, '新变量树的章节应正常渲染');
    assert(!lisi.classList.contains('is-expanded'), '陈旧路径不应展开其它章节');
  } finally {
    sandbox.Luker.getContext = prev;
  }
  // 还原：清掉本用例写入的展开路径并复位内存状态，避免影响后续用例
  hostCtx.extensionSettings.Kaleidoscope.gameExpandedChapters = [];
  ui.saveValuesChatState(hostCtx, { 好感: 55, 金币: 80, 张三: { 好感: 20, 状态: '疲惫' } }, { immediate: true });
  ui.renderGameView(true);
});

runner.test('游戏模式：嵌套章节逐级折叠展开', () => {
  ui.saveValuesChatState(hostCtx, {
    好感: 55,
    张三: { 装备: { 佩剑: '精钢长剑' } },
  }, { immediate: true });
  ui.renderGameView();
  // 顶层折叠 → 内层章节不可见
  assert(chapters().length === 1, '顶层只应有张三章节');
  click(chapters()[0].querySelector('.kaleido-game__chapter-head'));
  // 展开张三 → 露出嵌套的装备章节（仍是折叠态）
  const zhang = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  assert(zhang.classList.contains('is-expanded'), '张三应展开');
  const gear = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '装备');
  assert(gear && !gear.classList.contains('is-expanded'), '嵌套章节默认折叠');
  assert(!entryByPathMaybe(['张三', '装备', '佩剑']), '嵌套章节折叠时其条目不渲染');
  click(gear.querySelector('.kaleido-game__chapter-head'));
  const gearExpanded = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '装备');
  assert(gearExpanded.classList.contains('is-expanded'), '点嵌套章节头应展开');
  assert(entryByPath(['张三', '装备', '佩剑']).querySelector('.kaleido-game__entry-value').textContent === '精钢长剑', '嵌套值应显示');
  // 收起外层：内层随之隐藏，但内层展开状态保留（再次展开外层仍在）
  const zhangChapter = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三');
  click(zhangChapter.querySelector('.kaleido-game__chapter-head'));
  click(chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '张三').querySelector('.kaleido-game__chapter-head'));
  const gearAgain = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '装备');
  assert(gearAgain.classList.contains('is-expanded'), '外层重新展开后内层应保持展开');
  // 还原数据，避免影响后续用例
  const restored = { 好感: 55, 金币: 80, 张三: { 好感: 20, 状态: '疲惫' } };
  ui.saveValuesChatState(hostCtx, restored, { immediate: true });
  ui.renderGameView();
});

runner.test('游戏模式：空章节只是题签，无箭头不响应点击', () => {
  ui.saveValuesChatState(hostCtx, { 好感: 55, 空门派: {} }, { immediate: true });
  ui.renderGameView();
  const empty = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '空门派');
  assert(empty, '空容器应渲染为章节题签');
  assert(empty.classList.contains('is-empty'), '空容器应带 is-empty 标记');
  const head = empty.querySelector('.kaleido-game__chapter-head');
  assert(head && head.tagName !== 'BUTTON', '空章节头不应是可点击按钮');
  assert(!head.hasAttribute('aria-expanded'), '空章节头不应有 aria-expanded');
  assert(head.querySelector('.kaleido-game__chapter-chevron'), '空章节仍保留箭头占位（CSS 隐藏）以对齐文字');
  click(head);
  const after = chapters().find((c) => c.querySelector('.kaleido-game__chapter-seal')?.textContent === '空门派');
  assert(!after.classList.contains('is-expanded'), '点击空章节不应展开');
  // 还原数据，避免影响后续用例
  ui.saveValuesChatState(hostCtx, { 好感: 55, 金币: 80, 张三: { 好感: 20, 状态: '疲惫' } }, { immediate: true });
  ui.renderGameView();
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
runner.test('游戏模式：双入口图标，未点击只显示入口', () => {
  ui.showPanelView('kaleido-game-view');
  const mapTab = $('kaleido-game-map-tab');
  const dataTab = $('kaleido-game-data-tab');
  assert(mapTab && dataTab, '应有「游戏地图」「游戏数据」两个入口图标');
  assert(mapTab.textContent.includes('游戏地图'), '左边应是游戏地图');
  assert(dataTab.textContent.includes('游戏数据'), '右边应是游戏数据');
  assert(mapTab.classList.contains('is-active') === false, '未点击前地图入口不激活');
  assert(dataTab.classList.contains('is-active') === false, '未点击前数据入口不激活');
  assert($('kaleido-game-map-pane').hidden === true, '未点击前地图区不显示');
  assert($('kaleido-game-tree').hidden === true, '未点击前数据区不显示');
  assert($('kaleido-game-launcher-hint').hidden === false, '应显示入口提示');
  assert($('kaleido-map-crop-dialog'), '裁剪弹层应随面板创建');
});

runner.test('游戏模式：点击图标进入对应界面，图标消失，返回键回到入口', () => {
  ui.showPanelView('kaleido-game-view');
  click($('kaleido-game-map-tab'));
  assert($('kaleido-game-map-tab').classList.contains('is-active'), '点击地图图标应进入地图界面');
  assert($('kaleido-game-map-pane').hidden === false, '地图区应显示');
  assert($('kaleido-game-tree').hidden === true, '数据区应隐藏');
  assert($('kaleido-game-switch').hidden === true, '进入界面后入口图标应消失');
  assert($('kaleido-game-launcher-hint').hidden === true, '进入界面后入口提示应隐藏');
  assert($('kaleido-panel-back').style.visibility === 'visible', '界面内左上角返回键应可见');
  click($('kaleido-panel-back'));
  assert($('kaleido-game-map-tab').classList.contains('is-active') === false, '返回键应回到图标入口');
  assert($('kaleido-game-map-pane').hidden === true, '回到入口后地图区应隐藏');
  assert($('kaleido-game-switch').hidden === false, '回到入口后图标应恢复');
  assert($('kaleido-game-launcher-hint').hidden === false, '回到入口后提示应恢复');
  assert($('kaleido-panel-back').style.visibility === 'hidden', '入口态返回键应隐藏');
});

runner.test('游戏模式：界面内右上角关闭按钮关掉面板回悬浮球', () => {
  ui.showPanelView('kaleido-game-view');
  click($('kaleido-game-data-tab'));
  assert($('kaleido-game-tree').hidden === false, '先进入数据界面');
  const closeBtn = dom.window.document.querySelector('.kaleido-panel__close');
  assert(closeBtn, '应有右上角关闭按钮');
  click(closeBtn);
  assert(!$('kaleido-panel').classList.contains('is-open'), '关闭按钮应关掉面板');
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

runner.test('游戏模式：再次进入视图重置回入口', () => {
  ui.showPanelView('kaleido-game-view');
  click($('kaleido-game-data-tab'));
  assert($('kaleido-game-tree').hidden === false, '先进入数据界面');
  ui.showPanelView('kaleido-home-view');
  ui.showPanelView('kaleido-game-view');
  assert($('kaleido-game-data-tab').classList.contains('is-active') === false, '重新进入应回到入口');
  assert($('kaleido-game-tree').hidden === true, '重新进入后数据区应隐藏');
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

runner.test('游戏模式：空态「去编辑地图」打开地图工作台并渲染编辑器', () => {
  const emptyCtx = makeContext();
  emptyCtx.chatMetadata = {};
  emptyCtx.saveChat = () => {};
  const prev = sandbox.Luker.getContext;
  sandbox.Luker.getContext = () => emptyCtx;
  try {
    ui.renderGameView();
    click($('kaleido-map-go-edit'));
    assert($('kaleido-map-dialog').classList.contains('is-open'), '应打开地图工作台');
    assert(dom.window.document.querySelector('.kaleido-map-editor'), '地图编辑器内容应已渲染');
    assert($('kaleido-map-stage'), '应有编辑舞台');
  } finally {
    sandbox.Luker.getContext = prev;
  }
});

runner.run();
