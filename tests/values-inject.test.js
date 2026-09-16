// 万华镜变量注入测试：常驻注入 —— 文本构建 / 数据变更刷新 / 清理 / 发送前兜底。
'use strict';
const { readSources, loadInContext, createRunner, makeContext } = require('./harness');

const quietConsole = {
  log() {}, info() {}, debug() {},
  warn(...args) { console.warn(...args); },
  error(...args) { console.error(...args); },
};

// 可控定时器：启动 / 切聊天的补刷是有延迟的，测试里手动 flush 才触发
// （也让断言不依赖真实等待，同时避免残留定时器污染后续用例）。
const timerQueue = [];
const sandbox = {
  console: quietConsole,
  Luker: { getContext: () => hostCtx },
  setTimeout: (fn, ms) => {
    const job = { fn, ms: Number(ms) || 0 };
    timerQueue.push(job);
    return job;
  },
  clearTimeout: (job) => {
    const index = timerQueue.indexOf(job);
    if (index >= 0) timerQueue.splice(index, 1);
  },
};
const hostCtx = makeContext();
const ctx = loadInContext(sandbox, readSources());
const runner = createRunner();
const assert = (condition, message) => { if (!condition) throw new Error(message || '断言失败'); };

const INJECT_KEY = 'Kaleidoscope_Values';
const STATE_KEY = '__kaleido_values_inject_state__';

// 跑一轮待触发定时器（回调里可能再排下一个，需要就多调几次）。
function flushTimers(rounds = 1) {
  for (let i = 0; i < rounds; i += 1) {
    const jobs = timerQueue.splice(0).sort((a, b) => a.ms - b.ms);
    for (const job of jobs) job.fn();
  }
}

// 每个用例都从「未写过注入」的干净运行态开始：运行态挂 globalThis，跨用例会污染。
function fresh() {
  sandbox[STATE_KEY] = { written: false };
  timerQueue.length = 0;
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

// 记录 setExtensionPrompt 调用；返回 calls 数组。
function track(c) {
  const calls = [];
  c.setExtensionPrompt = (key, text, position, depth, additive, role) => calls.push({ key, text, position, depth, additive, role });
  return calls;
}

// 把宿主上下文临时指向 c（onValuesInjectChatChanged / startValuesInjection 走
// getContextSafe() 取宿主 ctx，不接收参数），跑完恢复。
function withHostCtx(c, fn) {
  const original = sandbox.Luker.getContext;
  sandbox.Luker.getContext = () => c;
  try {
    return fn();
  } finally {
    sandbox.Luker.getContext = original;
  }
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
  ctx.setValuesInjectPath(c, ['金钱'], true);
  const text = ctx.buildValuesInjectText(c);
  assert(text.startsWith('<Values>') && text.endsWith('</Values>'), '应以 <Values> 块包裹');
  assert(!text.includes('好感:'), '未勾选的变量不应注入');
  assert(text.includes('金钱: 1000'), '应包含顶层变量');
  // 打开节点「张三」→ 级联打开全部后代，「张三/好感」随节点一并注入
  // （容器节点本身仍不注入内容，注入的是其后代变量）。
  ctx.setValuesInjectPath(c, ['张三'], true);
  const text2 = ctx.buildValuesInjectText(c);
  assert(text2.includes('张三:') && text2.includes('好感: 30'), '打开节点应级联注入其后代变量');
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

// ---------- 常驻刷新（核心：不依赖点击发送） ----------
runner.test('常驻刷新：开启勾选后立即写入 IN_PROMPT 位置', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  const calls = track(c);
  ctx.refreshValuesInjection(c);
  assert(calls.length === 1, '应写入一次注入');
  assert(calls[0].key === INJECT_KEY, '应使用变量注入 key');
  assert(calls[0].text.includes('金钱: 1000'), '应注入变量内容');
  assert(calls[0].position === 0, '应使用 IN_PROMPT 位置（World Info after 之后）');
  assert(calls[0].depth === 0, '深度应为 0');
  assert(calls[0].role === 0, '角色应为 SYSTEM');
});

runner.test('常驻刷新：未开启且从未写入时不调用（零开销）', () => {
  const c = fresh();
  makeValues(c);
  const calls = track(c);
  ctx.refreshValuesInjection(c);
  assert(calls.length === 0, '未开启时不应调用 setExtensionPrompt');
});

runner.test('常驻刷新：数据变更后自动刷新为最新值（无需点击发送）', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  const calls = track(c);
  // 勾选本身即触发刷新（经 saveValuesData），再写游戏值触发第二次刷新。
  ctx.setValuesInjectPath(c, ['金钱'], true);
  ctx.saveValuesChatState(c, { 金钱: 800 }, {});
  assert(calls.length >= 2, '勾选与游戏值变更都应各触发一次刷新');
  const last = calls[calls.length - 1];
  assert(last.text.includes('金钱: 800'), '最后一次刷新应是最新游戏值');
});

runner.test('常驻刷新：关闭开关后清空已写入的注入', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  const calls = track(c);
  ctx.setValuesInjectEnabled(c, false);
  assert(calls.some((call) => call.key === INJECT_KEY && call.text === ''), '关闭后应清空注入');
  // 继续写值不应再产生写入（内容已空且运行态标记为未写）。
  calls.length = 0;
  ctx.saveValuesChatState(c, { 金钱: 700 }, {});
  assert(calls.length === 0, '关闭后数据变更不应再写入');
});

runner.test('常驻刷新：变量被删（勾选仍在）时清空注入', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  const calls = track(c);
  // 删除默认值里的「金钱」→ 构建结果为空 → 清掉旧注入。
  const defaults = ctx.getValuesDefaults(c);
  delete defaults.金钱;
  ctx.saveValuesData(c);
  assert(calls.some((call) => call.key === INJECT_KEY && call.text === ''), '变量消失后应清空注入');
});

runner.test('常驻刷新：切换聊天后按新数据重建注入', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  const calls = track(c);
  withHostCtx(c, () => {
    ctx.onValuesInjectChatChanged();
    // 补刷定时器在本用例内排空，避免残留到后续用例。
    flushTimers(3);
  });
  assert(calls.some((call) => call.key === INJECT_KEY && call.text.includes('金钱')), '切换聊天后应重新写入注入');
});

runner.test('常驻刷新：启动首次注入 + 延迟补刷', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  const calls = track(c);
  ctx.saveValuesChatState(c, { 金钱: 320 }, {});
  calls.length = 0;
  // 补刷回调经 getContextSafe() 取宿主 ctx，flush 时必须仍指向 c。
  withHostCtx(c, () => {
    ctx.startValuesInjection();
    assert(calls.length >= 1, '启动时应立即写入一次注入');
    // 补刷：两次延迟到点后各刷一次（chatMetadata 可能晚于 APP_READY 就绪）。
    flushTimers(3);
  });
  assert(calls.length >= 3, '补刷应按时再写入注入，实际 ' + calls.length + ' 次');
  assert(calls[calls.length - 1].text.includes('金钱: 320'), '补刷应写入最新游戏值');
});

runner.test('常驻刷新：宿主不支持注入时静默降级', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  c.setExtensionPrompt = undefined;
  withHostCtx(c, () => {
    ctx.refreshValuesInjection(c);
    ctx.onValuesInjectChatChanged();
  });
  assert(true, '不支持注入时不应抛错');
});

// ---------- 生成结束后补刷 ----------
runner.test('生成结束：只重刷不清空（常驻块被宿主清掉时补回）', () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  const calls = track(c);
  withHostCtx(c, () => ctx.onValuesInjectGenerationRefresh());
  assert(calls.length === 1, '生成结束应重写一次注入');
  assert(calls[0].key === INJECT_KEY && calls[0].text.includes('金钱'), '重写的应是变量块');
  assert(calls.every((call) => call.text !== ''), '生成结束不应清空注入');
});

// ---------- 发送前兜底任务 ----------
runner.test('发送前任务：兜底重断言（开启且勾选时写入）', async () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  c.chat = [{ is_user: true, mes: '你好', id: 1 }];
  const calls = track(c);
  await ctx.runValuesInjectBarrierTask(c);
  assert(calls.length === 1, '兜底任务应重断言一次注入');
  assert(calls[0].text.includes('金钱: 1000'), '应注入变量内容');
  assert(calls[0].position === 0, '应使用 IN_PROMPT 位置');
  assert(calls[0].role === 0, '角色应为 SYSTEM');
});

runner.test('发送前任务：关闭或未勾选时不调用注入', async () => {
  const c = fresh();
  makeValues(c);
  c.chat = [{ is_user: true, mes: '你好', id: 1 }];
  const calls = track(c);
  await ctx.runValuesInjectBarrierTask(c);
  assert(calls.length === 0, '关闭时应不调用 setExtensionPrompt');
});

runner.test('发送前任务：末条不是用户消息时跳过', async () => {
  const c = fresh();
  makeValues(c);
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  c.chat = [{ is_user: false, mes: '你好', id: 1 }];
  const calls = track(c);
  await ctx.runValuesInjectBarrierTask(c);
  assert(calls.length === 0, '非用户末条应跳过');
});

runner.run();
