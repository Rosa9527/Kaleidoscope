// 万华镜自绘确认弹层测试（jsdom）：宿主拦截原生 confirm 后的替代路径。
'use strict';
const { JSDOM } = require('jsdom');
const { readSources, loadInContext, createRunner } = require('./harness');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

const quietConsole = {
  log() {}, info() {}, debug() {}, warn() {}, error() {},
};

const sandbox = {
  console: quietConsole,
  document: dom.window.document,
  window: dom.window,
  Element: dom.window.Element,
  MouseEvent: dom.window.MouseEvent,
  KeyboardEvent: dom.window.KeyboardEvent,
  Event: dom.window.Event,
  localStorage: dom.window.localStorage,
  setTimeout, clearTimeout, setInterval, clearInterval,
  toastr: { success() {}, info() {}, warning() {}, error() {} },
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

runner.test('kaleidoConfirm：打开弹层显示消息，点确定 resolve true 并关闭', async () => {
  const promise = ui.kaleidoConfirm('确定删除节点「甲」吗？');
  const overlay = $('kaleido-confirm-overlay');
  assert(overlay && overlay.classList.contains('is-open'), '弹层应打开');
  assert(overlay.querySelector('.kaleido-confirm__message').textContent === '确定删除节点「甲」吗？', '消息应显示');
  click(overlay.querySelector('.kaleido-confirm__ok'));
  assert(await promise === true, '点确定应 resolve true');
  assert(!overlay.classList.contains('is-open'), '弹层应关闭');
});

runner.test('kaleidoConfirm：点取消 resolve false', async () => {
  const promise = ui.kaleidoConfirm('继续吗？');
  click($('kaleido-confirm-overlay').querySelector('.kaleido-confirm__cancel'));
  assert(await promise === false, '点取消应 resolve false');
});

runner.test('kaleidoConfirm：Esc 取消且不关闭面板', async () => {
  ui.createPanel();
  ui.openPanel();
  const promise = ui.kaleidoConfirm('按 Esc 取消');
  dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await flush();
  assert(await promise === false, 'Esc 应 resolve false');
  assert($('kaleido-panel').classList.contains('is-open'), '面板应保持打开');
  ui.closePanel();
});

runner.test('kaleidoConfirm：并发调用时旧弹层以取消结掉', async () => {
  const first = ui.kaleidoConfirm('第一个确认');
  const second = ui.kaleidoConfirm('第二个确认');
  assert(await first === false, '旧弹层应以 false 结掉');
  assert($('kaleido-confirm-overlay').querySelector('.kaleido-confirm__message').textContent === '第二个确认', '应显示新消息');
  click($('kaleido-confirm-overlay').querySelector('.kaleido-confirm__ok'));
  assert(await second === true, '新弹层正常确认');
});

runner.test('kaleidoConfirm：Esc 不打开弹层时面板正常关闭', async () => {
  ui.openPanel();
  dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await flush();
  assert(!$('kaleido-panel').classList.contains('is-open'), '无弹层时 Esc 应关闭面板');
});

runner.run();
