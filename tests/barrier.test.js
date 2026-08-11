// 万华镜发送屏障测试：跨扩展发送前任务的并发协调协议（与 SoulLink 共用）。
'use strict';
const { readSources, loadInContext, createRunner, makeContext } = require('./harness');

const quietConsole = {
  log() {}, info() {}, debug() {},
  warn(...args) { console.warn(...args); },
  error(...args) { console.error(...args); },
};

// 每个单元测试用全新上下文：注册进屏障的任务会留在实例里，跨测试复用
// 会产生悬空 Promise（上一轮注册的任务在新轮再次启动却无人释放）。
function freshContext() {
  const hostCtx = makeContext();
  const sandbox = {
    console: quietConsole,
    toastr: { success() {}, info() {}, warning() {}, error() {} },
    Luker: { getContext: () => hostCtx },
    AbortController: globalThis.AbortController,
    setTimeout, clearTimeout,
  };
  return { ctx: loadInContext(sandbox, readSources()), sandbox, hostCtx };
}

const runner = createRunner();
const assert = (condition, message) => { if (!condition) throw new Error(message || '断言失败'); };

// 顶层 const 不进 vm 全局对象，测试里直接用字面量。
const LAST_ROUND_KEY = '__kaleido_story_gate_last_round__';
const INJECT_KEY = 'Kaleidoscope_Story_Event';

function chatWith(last) {
  const c = makeContext();
  c.chat = [{ is_user: false, name: '蕾姆', mes: '你来了。', id: 0 }, last];
  c.setExtensionPrompt = () => {};
  return c;
}
const userMsg = (id, text) => ({ is_user: true, mes: text, id });

// ---------- 屏障基础 ----------
runner.test('getPreSendBarrier 幂等：重复获取返回同一实例', () => {
  const { ctx } = freshContext();
  const b1 = ctx.getPreSendBarrier();
  const b2 = ctx.getPreSendBarrier();
  assert(b1 && b2, '应返回屏障');
  assert(b1 === b2, '应复用同一实例');
  assert(typeof b1.register === 'function' && typeof b1.waitAll === 'function', '协议方法应齐全');
  assert(b1.version >= 1, '应有版本号');
});

runner.test('签名计算：优先消息 ID，缺失回退文本', () => {
  const { ctx } = freshContext();
  assert(ctx.computeSendBarrierSignature(chatWith(userMsg(7, '你好'))) === 'id:7', 'id 优先');
  assert(ctx.computeSendBarrierSignature(chatWith({ is_user: true, mes: '你好' })) === 'text:你好', '文本兜底');
  assert(ctx.computeSendBarrierSignature({ chat: [] }) === '', '空聊天为空签名');
});

runner.test('waitAll 并发执行：任务同步启动，先启动后等完成', async () => {
  const { ctx } = freshContext();
  const barrier = ctx.getPreSendBarrier();
  const started = [];
  let gateA;
  let gateB;
  barrier.register('test-a', () => { started.push('a'); return new Promise((resolve) => { gateA = resolve; }); });
  barrier.register('test-b', () => { started.push('b'); return new Promise((resolve) => { gateB = resolve; }); });
  const c = chatWith(userMsg(100, '并发'));
  const waitPromise = barrier.waitAll(c, '100');
  assert(started.includes('a') && started.includes('b'), '两个任务都应已启动（并行而非串行）');
  gateA();
  gateB();
  await waitPromise;
});

runner.test('waitAll 同签名幂等：在途轮次共享同一 Promise，任务只执行一次', async () => {
  const { ctx } = freshContext();
  const barrier = ctx.getPreSendBarrier();
  let runs = 0;
  let release;
  barrier.register('test-once', () => { runs += 1; return new Promise((resolve) => { release = resolve; }); });
  const c = chatWith(userMsg(200, '幂等'));
  const p1 = barrier.waitAll(c, '200');
  const p2 = barrier.waitAll(c, '200');
  assert(p1 === p2, '同签名应返回同一 Promise');
  assert(runs === 1, '任务应只启动一次');
  release();
  await p1;
  await p2;
});

runner.test('waitAll 级联去重：轮次完成后同签名不再重跑（宿主逐个 await 监听器）', async () => {
  const { ctx } = freshContext();
  const barrier = ctx.getPreSendBarrier();
  let runs = 0;
  barrier.register('test-cascade', () => { runs += 1; return Promise.resolve(); });
  const c = chatWith(userMsg(300, '级联'));
  await barrier.waitAll(c, '300');
  await barrier.waitAll(c, '300');
  assert(runs === 1, '同签名不应重跑');
  const c2 = chatWith(userMsg(301, '新发送'));
  await barrier.waitAll(c2, '301');
  assert(runs === 2, '新签名应开启新轮');
});

runner.test('waitAll 删楼重发：同 ID 不同内容应开启新轮（宿主复用被删消息 ID）', async () => {
  const { ctx } = freshContext();
  const barrier = ctx.getPreSendBarrier();
  let runs = 0;
  barrier.register('test-reused-id', () => { runs += 1; return Promise.resolve(); });
  const c1 = chatWith(userMsg(8, '第一轮'));
  await barrier.waitAll(c1, '8');
  assert(runs === 1, '第一轮应执行一次');
  // 删掉 8、9 两层楼后重发：新消息复用被删消息的 ID（8），但内容不同，
  // 仅凭 ID 判重会把这次发送误判为旧轮直接放行（剧情预筛整轮被跳过）。
  const c2 = chatWith(userMsg(8, '删楼后重发'));
  await barrier.waitAll(c2, '8');
  assert(runs === 2, '同 ID 不同内容应视为新发送，任务应再次执行');
  await barrier.waitAll(c2, '8');
  assert(runs === 2, '同 ID 同内容应复用本轮，不得重跑');
});

runner.test('clearSendBarrierRound：清空旧轮后同签名重新执行（messageDeleted 场景）', async () => {
  const { ctx } = freshContext();
  const barrier = ctx.getPreSendBarrier();
  let runs = 0;
  barrier.register('test-clear', () => { runs += 1; return Promise.resolve(); });
  const c = chatWith(userMsg(9, '删后原样重发'));
  await barrier.waitAll(c, '9');
  assert(runs === 1, '首轮应执行一次');
  // 删消息 → 清轮；即使重发内容与旧轮完全相同（内容判据兜不住），
  // 清掉旧轮后也必须重新执行，而不是被误判为「同一发送已处理」。
  ctx.clearSendBarrierRound();
  await barrier.waitAll(c, '9');
  assert(runs === 2, '清轮后同签名应重新执行');
});

runner.test('waitAll 失败隔离：单个任务 reject 不阻塞整轮', async () => {
  const { ctx } = freshContext();
  const barrier = ctx.getPreSendBarrier();
  let otherDone = false;
  barrier.register('test-fail', () => Promise.reject(new Error('boom')));
  barrier.register('test-ok', () => { otherDone = true; return Promise.resolve(); });
  const c = chatWith(userMsg(400, '失败隔离'));
  await barrier.waitAll(c, '400');
  assert(otherDone, '另一个任务应正常完成');
});

runner.test('waitAll 透传载荷给任务', async () => {
  const { ctx } = freshContext();
  const barrier = ctx.getPreSendBarrier();
  let seen = 'none';
  barrier.register('test-payload', (ctxArg, payload) => { seen = payload; return Promise.resolve(); });
  const c = chatWith(userMsg(500, '载荷'));
  await barrier.waitAll(c, '我是载荷');
  assert(seen === '我是载荷', '任务应收到载荷');
});

// ---------- 与剧情预筛打通（共享上下文：任务都自解析，无悬空 Promise）----------
const main = freshContext();
const { ctx, sandbox, hostCtx } = main;

function setupStoryGateHost(c) {
  c.chat = [{ is_user: false, name: '蕾姆', mes: '你来了。', id: 0 }, { is_user: true, mes: '我推开门', id: 1 }];
  const vol1 = ctx.createStoryNode(c, { name: '第一卷', description: '开篇' });
  const ch1 = ctx.createStoryNode(c, { name: '第一章', parentId: vol1.id });
  ctx.createStoryScript(c, {
    id: '001', name: '雨夜', trigger: '夜晚且下雨', nodeId: ch1.id,
    description: '窗外下起雨', content: '雨声渐密，窗棂轻响。',
  });
  const settings = ctx.getSettings(c);
  settings.apiUrl = 'https://api.example.com/v1';
  settings.model = 'test-model';
  const listeners = {};
  c.eventSource = {
    on(type, fn) { listeners[type] = fn; },
    removeListener(type, fn) { if (listeners[type] === fn) delete listeners[type]; },
  };
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  const calls = [];
  return { listeners, calls };
}

runner.test('story-gate 监听器经屏障与另一扩展任务并发执行', async () => {
  const c = hostCtx;
  const { listeners, calls } = setupStoryGateHost(c);
  sandbox.chatCompletion = async () => '{"events":["001"]}';
  let peerRan = false;
  ctx.getPreSendBarrier().register('test-peer', () => { peerRan = true; return Promise.resolve(); });

  ctx.installStoryGateMessageSentHook(c);
  await listeners.messageSent('我推开门');

  assert(peerRan, '另一扩展任务应随本轮并发执行');
  assert(calls.some((call) => call.key === INJECT_KEY && call.text.includes('雨声渐密')), '剧情预筛应注入事件');
  assert(sandbox[LAST_ROUND_KEY]?.injected === true, '应留下注入实录');
});

runner.test('messageSent 监听器屏障缺失时回退直接阻塞', async () => {
  const c = hostCtx;
  c.chat = [{ is_user: false, name: '蕾姆', mes: '你来了。', id: 0 }, { is_user: true, mes: '我推开门', id: 2 }];
  const settings = ctx.getSettings(c);
  settings.apiUrl = 'https://api.example.com/v1';
  settings.model = 'test-model';
  const listeners = {};
  c.eventSource = {
    on(type, fn) { listeners[type] = fn; },
    removeListener(type, fn) { if (listeners[type] === fn) delete listeners[type]; },
  };
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  sandbox.chatCompletion = async () => '{"events":["001"]}';
  ctx.installStoryGateMessageSentHook(c);

  // 模拟屏障不可用（协议缺失）：监听器应回退为「自己直接阻塞」并正常注入。
  const originalGet = ctx.getPreSendBarrier;
  ctx.getPreSendBarrier = () => null;
  try {
    await listeners.messageSent('我推开门');
  } finally {
    ctx.getPreSendBarrier = originalGet;
  }
  assert(calls.some((call) => call.key === INJECT_KEY && call.text.includes('雨声渐密')), '回退路径应注入事件');
});

// 硬截止放最后：挂起任务会留在共享屏障里，用全新上下文隔离。
runner.test('waitAll 硬截止：超时任务不阻塞整轮', async () => {
  const { ctx: freshCtx } = freshContext();
  freshCtx.getPreSendBarrier().register('test-hang', () => new Promise(() => {}));
  const c = makeContext();
  c.chat = [{ is_user: true, mes: '硬截止', id: 600 }];
  c.setExtensionPrompt = () => {};
  const t0 = Date.now();
  await freshCtx.getPreSendBarrier().waitAll(c, '600', 50);
  const elapsed = Date.now() - t0;
  assert(elapsed < 200, '应按时截止，实际 ' + elapsed + 'ms');
});

runner.run();
