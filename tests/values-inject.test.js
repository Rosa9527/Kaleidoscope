// 万华镜变量注入测试：注入文本构建 / 发送前任务 / 清理。
'use strict';
const { readSources, loadInContext, createRunner, makeContext } = require('./harness');

const quietConsole = {
  log() {}, info() {}, debug() {},
  warn(...args) { console.warn(...args); },
  error(...args) { console.error(...args); },
};

const hostCtx = makeContext();
const sandbox = {
  console: quietConsole,
  Luker: { getContext: () => hostCtx },
  setTimeout, clearTimeout,
};
const ctx = loadInContext(sandbox, readSources());
const runner = createRunner();
const assert = (condition, message) => { if (!condition) throw new Error(message || '断言失败'); };

const INJECT_KEY = 'Kaleidoscope_Values';

function fresh() {
  const c = makeContext();
  c.chat = [];
  c.chatMetadata = {};
  c.saveChat = () => {};
  c.setExtensionPrompt = () => {};
  return c;
}

function makeValues(c) {
  ctx.upsertValuesKey(c, '好感', '友好互动 +5');
  ctx.upsertValuesKey(c, '金钱', '按剧情收支变化');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感'], 30);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  ctx.saveValuesData(c);
}

// ---------- 注入文本构建 ----------
runner.test('注入文本：关闭时不生成', () => {
  const c = fresh();
  makeValues(c);
  assert(ctx.buildValuesInjectText(c) === '', '关闭时应返回空');
});

runner.test('注入文本：开启但未勾选时不生成', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  assert(ctx.buildValuesInjectText(c) === '', '未勾选时应返回空');
});

runner.test('注入文本：只注入打开的变量，容器节点本身不注入', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['张三'], true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  const text = ctx.buildValuesInjectText(c);
  assert(text.startsWith('<Values>') && text.endsWith('</Values>'), '应以 <Values> 块包裹');
  assert(!text.includes('张三:'), '只打开容器节点不应注入内容');
  assert(text.includes('金钱: 1000'), '应包含顶层变量');
  // 打开「张三/好感」→ 注入好感（张三自动提升）
  ctx.setValuesInjectPath(c, ['张三', '好感'], true);
  const text2 = ctx.buildValuesInjectText(c);
  assert(text2.includes('张三:') && text2.includes('好感: 30'), '打开变量后应注入其子树结构');
  assert(text2.includes('金钱: 1000'), '其他变量应保留');
});

runner.test('注入文本：节点与后代同时打开时变量只注入一次', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['张三'], true);
  ctx.setValuesInjectPath(c, ['张三', '好感'], true);
  const text = ctx.buildValuesInjectText(c);
  const count = (text.match(/好感: 30/g) || []).length;
  assert(count === 1, '变量应只注入一次');
});

runner.test('注入文本：使用游戏值（未初始化回退默认值）', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  // 游戏值未初始化 → 回退默认值 1000
  assert(ctx.buildValuesInjectText(c).includes('金钱: 1000'), '未初始化应回退默认值');
  // 写入游戏值 → 注入游戏值
  ctx.saveValuesChatState(c, { 金钱: 800 }, {});
  assert(ctx.buildValuesInjectText(c).includes('金钱: 800'), '已初始化应注入游戏值');
});

runner.test('注入文本：路径不存在时跳过', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['不存在的节点'], true);
  assert(ctx.buildValuesInjectText(c) === '', '不存在的路径应跳过');
});

// ---------- 发送前任务 / 注入 / 清理 ----------
runner.test('发送前任务：开启且勾选时注入 IN_PROMPT 位置', async () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  c.chat = [{ is_user: true, mes: '你好', id: 1 }];
  const calls = [];
  c.setExtensionPrompt = (key, text, position, depth, additive, role) => calls.push({ key, text, position, depth, additive, role });
  await ctx.runValuesInjectBarrierTask(c);
  assert(calls.length === 1, '应调用一次 setExtensionPrompt');
  assert(calls[0].key === INJECT_KEY, '应使用变量注入 key');
  assert(calls[0].text.includes('金钱: 1000'), '应注入变量内容');
  assert(calls[0].position === 0, '应使用 IN_PROMPT 位置（World Info after 之后）');
  assert(calls[0].depth === 0, '深度应为 0');
  assert(calls[0].role === 0, '角色应为 SYSTEM');
});

runner.test('发送前任务：关闭或未勾选时不调用注入', async () => {
  const c = fresh();
  makeValues(c);
  c.chat = [{ is_user: true, mes: '你好', id: 1 }];
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  await ctx.runValuesInjectBarrierTask(c);
  assert(calls.length === 0, '关闭时应不调用 setExtensionPrompt');
});

runner.test('发送前任务：末条不是用户消息时跳过', async () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  c.chat = [{ is_user: false, mes: '你好', id: 1 }];
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  await ctx.runValuesInjectBarrierTask(c);
  assert(calls.length === 0, '非用户末条应跳过');
});

runner.test('生成结束清理：清空注入', () => {
  const c = fresh();
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  hostCtx.setExtensionPrompt = c.setExtensionPrompt;
  ctx.onValuesInjectGenerationCleanup();
  assert(calls.some((call) => call.key === INJECT_KEY && call.text === ''), '应清空变量注入');
});

runner.run();