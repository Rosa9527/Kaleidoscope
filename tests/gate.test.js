// 万华镜剧情预筛测试：事件目录 / Gate 消息 / 解析 / 注入 / 管线。
'use strict';
const { readSources, loadInContext, createRunner, makeContext } = require('./harness');

const toasts = [];
const quietConsole = {
  log() {}, info() {}, debug() {},
  warn(...args) { console.warn(...args); },
  error(...args) { console.error(...args); },
};

const hostCtx = makeContext();
const sandbox = {
  console: quietConsole,
  toastr: {
    success: (msg) => toasts.push(['success', msg]),
    info: (msg) => toasts.push(['info', msg]),
    warning: (msg) => toasts.push(['warning', msg]),
    error: (msg) => toasts.push(['error', msg]),
  },
  Luker: { getContext: () => hostCtx },
  AbortController: globalThis.AbortController,
  setTimeout, clearTimeout,
};
const ctx = loadInContext(sandbox, readSources());
const runner = createRunner();
const assert = (condition, message) => { if (!condition) throw new Error(message || '断言失败'); };

// 顶层 const 不进 vm 全局对象，测试里直接用字面量。
const LAST_ROUND_KEY = '__kaleido_story_gate_last_round__';
const INJECT_KEY = 'Kaleidoscope_Story_Event';

function fresh() {
  const c = makeContext();
  c.chat = [];
  c.setExtensionPrompt = () => {};
  return c;
}

function makeStory(c) {
  const vol1 = ctx.createStoryNode(c, { name: '第一卷', description: '开篇' });
  const ch1 = ctx.createStoryNode(c, { name: '第一章', parentId: vol1.id });
  const rain = ctx.createStoryScript(c, {
    id: '001', name: '雨夜', trigger: '夜晚且下雨', nodeId: ch1.id,
    description: '窗外下起雨', content: '雨声渐密，窗棂轻响。',
  });
  const knock = ctx.createStoryScript(c, {
    id: '002', name: '敲门', trigger: '有人敲门', nodeId: ch1.id,
    description: '门外传来敲门声', content: '笃笃笃，门被敲响。',
  });
  const orphan = ctx.createStoryScript(c, {
    id: '003', name: '未分类事件', trigger: '任意', description: '未挂节点', content: '孤立的剧情片段。',
  });
  return { vol1, ch1, rain, knock, orphan };
}

function setupApi(c) {
  const settings = ctx.getSettings(c);
  settings.apiUrl = 'https://api.example.com/v1';
  settings.model = 'test-model';
  return settings;
}

// ---------- 最近消息 ----------
runner.test('getStoryGateRecentMessages 取最近 N 条并归一化', () => {
  hostCtx.chat = [
    { is_user: false, name: '蕾姆', mes: '第一句' },
    { is_user: true, mes: '第二句' },
    { is_system: true, mes: '系统提示' },
    { is_user: false, name: '拉姆', mes: '第三句' },
  ];
  const messages = ctx.getStoryGateRecentMessages(3);
  assert(messages.length === 3, '应只取最近 3 条');
  assert(messages[0].role === 'user' && messages[0].content === '第二句', '第二条应为 user');
  assert(messages[1].role === 'system' && messages[1].content === '系统提示', '第三条应为 system');
  assert(messages[2].role === 'assistant' && messages[2].name === '拉姆', '第四条应为 assistant');
});

// ---------- 事件目录 ----------
runner.test('buildStoryEventCatalog 只含名字/ID/触发条件/描述，不含正文', () => {
  const c = fresh();
  makeStory(c);
  const catalog = ctx.buildStoryEventCatalog(c);
  assert(catalog.nodes.length === 1, '应有 1 个根节点');
  const vol1 = catalog.nodes[0];
  assert(vol1.name === '第一卷' && vol1.description === '开篇', '节点应含名字与说明');
  assert(vol1.children.length === 1, '第一卷应有 1 个子节点');
  const ch1 = vol1.children[0];
  assert(ch1.events.length === 2, '第一章应有 2 个事件');
  const rain = ch1.events.find((e) => e.id === '001');
  assert(rain && rain.name === '雨夜' && rain.trigger === '夜晚且下雨' && rain.description === '窗外下起雨', '事件应含名字/ID/触发条件/描述');
  assert(rain.content === undefined, '事件目录不得携带正文');
  assert(catalog.unassigned.length === 1 && catalog.unassigned[0].id === '003', '未分类事件应单独成组');
});

// ---------- 节点启停 ----------
runner.test('停用节点：目录排除其子树与事件，未分类保留', () => {
  const c = fresh();
  const { vol1, ch1 } = makeStory(c);
  ctx.toggleStoryNodeEnabled(c, ch1.id);
  const catalog = ctx.buildStoryEventCatalog(c);
  assert(catalog.nodes.length === 1, '根节点仍在目录');
  assert(catalog.nodes[0].children.length === 0, '停用子节点不应出现在目录');
  assert(catalog.unassigned.length === 1 && catalog.unassigned[0].id === '003', '未分类事件应保留');
  const active = ctx.getStoryActiveScripts(c);
  assert(active.length === 1 && active[0].id === '003', '停用节点下的事件不应参与预筛');
});

runner.test('停用整棵子树：后代节点与事件一并排除', () => {
  const c = fresh();
  const vol1 = ctx.createStoryNode(c, { name: '第一卷' });
  const ch1 = ctx.createStoryNode(c, { name: '第一章', parentId: vol1.id });
  ctx.createStoryScript(c, { id: '001', name: '雨夜', nodeId: ch1.id, content: 'x' });
  ctx.toggleStoryNodeEnabled(c, vol1.id);
  const catalog = ctx.buildStoryEventCatalog(c);
  assert(catalog.nodes.length === 0, '停用根节点后整棵树不应出现');
  assert(catalog.unassigned.length === 0, '未分类事件不应凭空出现');
  assert(ctx.getStoryActiveScripts(c).length === 0, '整棵子树的事件不应参与预筛');
});

// ---------- 提示词 ----------
runner.test('getStoryGatePrompt 空设置回退默认，保存后优先自定义', () => {
  const c = fresh();
  const prompt = ctx.getStoryGatePrompt(c);
  assert(typeof prompt === 'string' && prompt.includes('剧情预筛') && prompt.includes('<Story_Events>'), '空设置应回退默认提示词');
  const settings = ctx.getSettings(c);
  settings.storyGatePrompt = '自定义预筛提示词';
  assert(ctx.getStoryGatePrompt(c) === '自定义预筛提示词', '应优先使用自定义提示词');
});

// ---------- Gate 消息 ----------
runner.test('buildStoryGateMessages 四段式：提示词 → 目录 → 剧情 → 契约', () => {
  const c = fresh();
  makeStory(c);
  c.chat = [{ is_user: true, mes: '我推开门' }];
  const messages = ctx.buildStoryGateMessages(c, '预筛提示词');
  assert(messages.length === 4, '应有 4 条消息');
  assert(messages[0].role === 'system' && messages[0].content === '预筛提示词', '首条应为 system 提示词');
  assert(messages[1].content.includes('<Story_Events>'), '第二条应含事件目录块');
  assert(messages[1].content.includes('"雨夜"'), '目录块应含事件名');
  assert(!messages[1].content.includes('雨声渐密'), '目录块不得含事件正文');
  assert(messages[2].content.includes('<Recent_Messages>'), '第三条应含剧情块');
  assert(messages[2].content.includes('我推开门'), '剧情块应含最近消息');
  assert(messages[3].content.includes('"events":[]'), '第四条应为输出契约');
});

// ---------- 解析 ----------
runner.test('parseStoryGateEventIds 精确匹配、去重、丢弃未知、限 5 个', () => {
  const allowed = ['001', '002', '003', '004', '005', '006'];
  const parsed = { events: ['001', ' 002 ', '001', '999', '003', '004', '005', '006'] };
  const ids = ctx.parseStoryGateEventIds(parsed, allowed);
  assert(ids.length === 5, '应最多保留 5 个');
  assert(ids[0] === '001' && ids[1] === '002' && ids[2] === '003', '应保留合法 ID 并去重');
  assert(!ids.includes('999'), '未知 ID 应被丢弃');
  assert(ctx.parseStoryGateEventIds(null, allowed).length === 0, 'null 应返回空');
  assert(ctx.parseStoryGateEventIds({ events: '001' }, allowed).length === 0, '非数组应返回空');
});

// ---------- 注入文本 ----------
runner.test('buildStoryGateInjectionText 含规则、事件元信息与正文', () => {
  const c = fresh();
  const { rain } = makeStory(c);
  const text = ctx.buildStoryGateInjectionText(c, [rain]);
  assert(text.includes('<Story_Event>'), '应以 Story_Event 包裹');
  assert(text.includes('【系统导演注 · 强制指令】'), '应含强制指令');
  assert(text.includes('<event id="001" name="雨夜">'), '应含事件 id 与名字');
  assert(text.includes('触发条件：夜晚且下雨'), '应含触发条件');
  assert(text.includes('雨声渐密，窗棂轻响。'), '应含事件正文');
  assert(text.includes('</Story_Event>'), '应正确闭合');
});

// ---------- 管线：成功注入 ----------
runner.test('runStoryGatePipeline 预筛成功并注入事件', async () => {
  const c = fresh();
  makeStory(c);
  c.chat = [{ is_user: true, mes: '我推开门' }];
  setupApi(c);
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  sandbox.chatCompletion = async () => '{"events":["001","003"]}';
  await ctx.runStoryGatePipeline(c, ctx.getSettings(c));
  assert(calls.length === 2, '应先清旧注入再写入新注入');
  const inject = calls.find((call) => call.key === INJECT_KEY && call.text.includes('雨声渐密'));
  assert(Boolean(inject), '应注入含事件正文的提示词');
  const round = sandbox[LAST_ROUND_KEY];
  assert(round && round.injected === true, '应记录已注入');
  assert(round.selectedIds.length === 2 && round.selectedIds[0] === '001', '应记录入选 ID');
  assert(round.selectedEvents.length === 2 && round.selectedEvents[0].name === '雨夜', '应记录入选事件详情');
  assert(round.selectedEvents[0].content === '雨声渐密，窗棂轻响。', '事件详情应含正文');
  assert(round.injectionText.includes('<Story_Event>') && round.injectionText.includes('雨声渐密'), '应记录注入提示词原文');
});

// ---------- 管线：0 入选 ----------
runner.test('runStoryGatePipeline 0 入选时不注入', async () => {
  const c = fresh();
  makeStory(c);
  c.chat = [{ is_user: true, mes: '我推开门' }];
  setupApi(c);
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  sandbox.chatCompletion = async () => '{"events":[]}';
  await ctx.runStoryGatePipeline(c, ctx.getSettings(c));
  assert(calls.length === 0, '0 入选不应调用注入');
  const round = sandbox[LAST_ROUND_KEY];
  assert(round && round.skipped === true, '应记录本轮跳过');
});

// ---------- 管线：失败降级 ----------
runner.test('runStoryGatePipeline 失败时直接放行不注入', async () => {
  const c = fresh();
  makeStory(c);
  c.chat = [{ is_user: true, mes: '我推开门' }];
  setupApi(c);
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  sandbox.chatCompletion = async () => { throw new Error('上游超时'); };
  await ctx.runStoryGatePipeline(c, ctx.getSettings(c));
  assert(calls.length === 0, '失败不应注入');
  const round = sandbox[LAST_ROUND_KEY];
  assert(round && round.injected === false && round.timedOut === false, '应记录失败轮');
});

// ---------- messageSent 监听 ----------
runner.test('messageSent 监听器：启用时预筛注入，关闭/载荷不符时放行', async () => {
  const c = hostCtx;
  c.chat = [{ is_user: false, name: '蕾姆', mes: '你来了。', id: 0 }, { is_user: true, mes: '我推开门', id: 1 }];
  makeStory(c);
  setupApi(c);
  const listeners = {};
  c.eventSource = {
    on(type, fn) { listeners[type] = fn; },
    removeListener(type, fn) { if (listeners[type] === fn) delete listeners[type]; },
  };
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  sandbox.chatCompletion = async () => '{"events":["001"]}';

  ctx.installStoryGateMessageSentHook(c);
  assert(typeof listeners.messageSent === 'function', '应订阅 messageSent');

  // 载荷与末条消息不一致 → 跳过
  await listeners.messageSent('别的文本');
  assert(calls.length === 0, '载荷不一致应跳过');

  // 正常发送（新消息 → 新签名 → 屏障开新轮）→ 预筛并注入
  c.chat.push({ is_user: true, mes: '我推开门', id: 2 });
  await listeners.messageSent('我推开门');
  assert(calls.some((call) => call.key === INJECT_KEY && call.text.includes('雨声渐密')), '应注入事件');

  // 关闭开关 → 放行
  ctx.getSettings(c).storyGateEnabled = false;
  sandbox.chatCompletion = async () => { throw new Error('不应被调用'); };
  c.chat.push({ is_user: true, mes: '我推开门', id: 3 });
  await listeners.messageSent('我推开门');
  assert(calls.length === 2, '关闭后不应再调用');
});


// ---------- messageSent 载荷加固 ----------
runner.test('messageSent 数字载荷：与末条消息 ID 一致时处理，不一致时跳过', async () => {
  const c = hostCtx;
  c.chat = [{ is_user: false, name: '蕾姆', mes: '你来了。', id: 0 }, { is_user: true, mes: '我推开门', id: 1 }];
  ctx.getSettings(c).storyGateEnabled = true;
  setupApi(c);
  const listeners = {};
  c.eventSource = {
    on(type, fn) { listeners[type] = fn; },
    removeListener(type, fn) { if (listeners[type] === fn) delete listeners[type]; },
  };
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  sandbox.chatCompletion = async () => '{"events":["001"]}';
  ctx.installStoryGateMessageSentHook(c);

  // 数字载荷与末条消息 ID 不一致 → 跳过
  await listeners.messageSent(2);
  assert(calls.length === 0, '消息 ID 不一致应跳过');

  // 数字载荷与末条消息 ID 一致（新消息 → 新签名 → 屏障开新轮）→ 预筛并注入
  c.chat.push({ is_user: true, mes: '我推开门', id: 2 });
  await listeners.messageSent(2);
  assert(calls.some((call) => call.key === INJECT_KEY && call.text.includes('雨声渐密')), '消息 ID 一致应注入事件');
});

runner.test('messageSent 对象载荷：无法校验一律跳过', async () => {
  const c = hostCtx;
  c.chat = [{ is_user: true, mes: '我推开门' }];
  ctx.getSettings(c).storyGateEnabled = true;
  setupApi(c);
  const listeners = {};
  c.eventSource = {
    on(type, fn) { listeners[type] = fn; },
    removeListener(type, fn) { if (listeners[type] === fn) delete listeners[type]; },
  };
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  sandbox.chatCompletion = async () => { throw new Error('不应被调用'); };
  ctx.installStoryGateMessageSentHook(c);

  await listeners.messageSent({ message: '我推开门' });
  assert(calls.length === 0, '对象载荷应跳过');
});

// ---------- 主生成配对 ----------
runner.test('messageSent 主生成配对：无生成在途时跳过，生成在途时处理', async () => {
  const c = hostCtx;
  c.chat = [{ is_user: false, name: '蕾姆', mes: '你来了。', id: 0 }];
  ctx.getSettings(c).storyGateEnabled = true;
  setupApi(c);
  const listeners = {};
  c.eventSource = {
    on(type, fn) { listeners[type] = fn; },
    removeListener(type, fn) { if (listeners[type] === fn) delete listeners[type]; },
  };
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  sandbox.chatCompletion = async () => '{"events":["001"]}';
  ctx.installStoryGateMessageSentHook(c);

  // 每次发送都产生新消息（新 id → 新签名 → 屏障开新轮），与宿主行为一致。
  const send = (id, text) => {
    c.chat.push({ is_user: true, mes: text, id });
    return listeners.messageSent(text);
  };
  const injectCount = () => calls.filter((call) => call.key === INJECT_KEY && call.text.includes('雨声渐密')).length;

  // 未确认宿主顺序前：无生成事件也放行（兼容 SillyTavern 顺序）
  await send(1, '我推开门');
  assert(injectCount() === 1, '未确认顺序前应放行');

  // 生成开始 → messageSent 在途 → 确认严格配对并处理
  ctx.onStoryGateGenerationStarted();
  await send(2, '我推开门');
  assert(injectCount() === 2, '生成在途应处理');

  // 生成结束 → 无生成在途的 messageSent 判定为其他插件误触发
  ctx.onStoryGateGenerationCleanup();
  sandbox.chatCompletion = async () => { throw new Error('不应被调用'); };
  await send(3, '我推开门');
  assert(injectCount() === 2, '无生成在途应跳过');
});

runner.run();

