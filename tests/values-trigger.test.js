// 万华镜剧情触发测试：数据读写 / 条件求值 / 注入 / YAML 导入导出。
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
  setTimeout, clearTimeout,
};
const ctx = loadInContext(sandbox, readSources());
const runner = createRunner();
const assert = (condition, message) => { if (!condition) throw new Error(message || '断言失败'); };

const INJECT_KEY = 'Kaleidoscope_Trigger_Event';
const LAST_ROUND_KEY = '__kaleido_values_trigger_last_round__';

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
  ctx.upsertValuesKey(c, '是否已知真相', '按剧情变化');
  ctx.upsertValuesKey(c, '战争状态', '按剧情变化');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感'], 30);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '是否已知真相'], false);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['世界', '战争状态'], false);
  ctx.saveValuesData(c);
}

function makeTrigger(c, overrides = {}) {
  return ctx.createValuesTrigger(c, {
    name: '告白事件',
    logic: 'all',
    conditions: [
      { path: '张三/好感', op: '>=', value: 70 },
      { path: '张三/是否已知真相', op: '==', value: true },
    ],
    content: '张三向你表白了。',
    ...overrides,
  });
}

// ---------- 数据读写 ----------
runner.test('触发 CRUD：创建 / 更新 / 删除 / 启停，ID 自动递增', () => {
  const c = fresh();
  makeValues(c);
  const t1 = makeTrigger(c);
  assert(t1.id === '001', '首个触发 ID 应为 001');
  assert(ctx.getValuesTriggers(c).length === 1, '应有 1 个触发');
  const t2 = ctx.createValuesTrigger(c, { name: '战争爆发', conditions: [{ path: '世界/战争状态', op: '==', value: true }], content: '战争爆发了。' });
  assert(t2.id === '002', '第二个触发 ID 应为 002');
  const updated = ctx.updateValuesTrigger(c, t1.id, { name: '告白事件（改）', logic: 'any' });
  assert(updated.name === '告白事件（改）' && updated.logic === 'any', '更新应生效');
  assert(ctx.getValuesTriggerById(c, t1.id).name === '告白事件（改）', '读取应一致');
  const toggled = ctx.toggleValuesTriggerEnabled(c, t1.id);
  assert(toggled.enabled === false, '关闭后 enabled 应为 false');
  assert(ctx.evaluateValuesTriggers(c).every((t) => t.id !== t1.id), '关闭的触发不应参与判定');
  assert(ctx.deleteValuesTrigger(c, t1.id) === true, '删除应成功');
  assert(ctx.getValuesTriggers(c).length === 1, '删除后应剩 1 个');
});

runner.test('触发归一化：无条件 / 空路径条件被过滤，非法逻辑回退 all', () => {
  const c = fresh();
  makeValues(c);
  const t = ctx.createValuesTrigger(c, {
    name: '空条件',
    logic: 'weird',
    conditions: [{ path: '', op: '==', value: 1 }, { path: '张三/好感', op: '>=', value: 70 }],
    content: '内容',
  });
  assert(t.logic === 'all', '非法逻辑应回退 all');
  assert(t.conditions.length === 1 && t.conditions[0].path === '张三/好感', '空路径条件应被过滤');
  assert(t.once === true, '未指定事件类型应默认为一次性');
  const persistent = ctx.createValuesTrigger(c, { name: '常驻', once: false, conditions: [{ path: '张三/好感', op: '>=', value: 70 }], content: '内容' });
  assert(persistent.once === false, 'once: false 应为常驻事件');
});

// ---------- 条件求值 ----------
runner.test('条件求值：数值 / 布尔 / 字符串 / 混合类型', () => {
  assert(ctx.evaluateValuesCondition(80, '>=', 70) === true, '80 >= 70 应为 true');
  assert(ctx.evaluateValuesCondition(60, '>=', 70) === false, '60 >= 70 应为 false');
  assert(ctx.evaluateValuesCondition(80, '==', '80') === true, '数字与数字字符串应相等');
  assert(ctx.evaluateValuesCondition('abc', '==', 'abc') === true, '字符串相等');
  assert(ctx.evaluateValuesCondition('abc', '!=', 'abd') === true, '字符串不等');
  assert(ctx.evaluateValuesCondition(true, '==', true) === true, '布尔相等');
  assert(ctx.evaluateValuesCondition(true, '==', false) === false, '布尔不等');
  assert(ctx.evaluateValuesCondition('友好互动', 'contains', '友好') === true, 'contains 应命中');
  assert(ctx.evaluateValuesCondition('友好互动', 'contains', '冲突') === false, 'contains 不应误命中');
  assert(ctx.evaluateValuesCondition(undefined, 'exists', null) === false, '未定义变量 exists 应为 false');
  assert(ctx.evaluateValuesCondition(undefined, 'not exists', null) === true, '未定义变量 not exists 应为 true');
  assert(ctx.evaluateValuesCondition(undefined, '==', 1) === false, '未定义变量其他运算符应为 false');
  assert(ctx.evaluateValuesCondition(5, '>', '3') === true, '数字与数字字符串比较应转数字');
});

// ---------- 触发判定 ----------
runner.test('触发判定：全部满足（且）才触发', () => {
  const c = fresh();
  makeValues(c);
  makeTrigger(c);
  // 默认值：好感 30 < 70，不触发
  assert(ctx.evaluateValuesTriggers(c).length === 0, '默认值不应触发');
  // 游戏值：好感 80 + 已知真相 true → 触发
  ctx.saveValuesChatState(c, { 张三: { 好感: 80, 是否已知真相: true }, 世界: { 战争状态: false } }, {});
  const triggered = ctx.evaluateValuesTriggers(c);
  assert(triggered.length === 1 && triggered[0].name === '告白事件', '条件满足应触发');
});

runner.test('触发判定：任一满足（或）与部分满足', () => {
  const c = fresh();
  makeValues(c);
  makeTrigger(c, { logic: 'any' });
  ctx.saveValuesChatState(c, { 张三: { 好感: 80, 是否已知真相: false }, 世界: { 战争状态: false } }, {});
  assert(ctx.evaluateValuesTriggers(c).length === 1, '任一满足应触发');
  ctx.saveValuesChatState(c, { 张三: { 好感: 10, 是否已知真相: false }, 世界: { 战争状态: false } }, {});
  assert(ctx.evaluateValuesTriggers(c).length === 0, '全部不满足不应触发');
});

runner.test('触发判定：无条件恒不触发，停用不触发', () => {
  const c = fresh();
  makeValues(c);
  const t = ctx.createValuesTrigger(c, { name: '无条件', conditions: [], content: '内容' });
  assert(ctx.evaluateValuesTrigger(c, t) === false, '无条件应恒不触发');
  const t2 = makeTrigger(c);
  ctx.saveValuesChatState(c, { 张三: { 好感: 80, 是否已知真相: true }, 世界: { 战争状态: false } }, {});
  ctx.toggleValuesTriggerEnabled(c, t2.id);
  assert(ctx.evaluateValuesTriggers(c).length === 0, '停用后不应触发');
});

// ---------- 注入 ----------
runner.test('注入文本：<Story_Trigger> 块含事件与条件摘要', () => {
  const c = fresh();
  makeValues(c);
  const t = makeTrigger(c);
  const text = ctx.buildValuesTriggerInjectionText(c, [t]);
  assert(text.startsWith('<Story_Trigger>') && text.endsWith('</Story_Trigger>'), '应以 <Story_Trigger> 块包裹');
  assert(text.includes('告白事件'), '应包含事件名');
  assert(text.includes('张三/好感 >= 70'), '应包含条件摘要');
  assert(text.includes('张三向你表白了。'), '应包含事件正文');
});

runner.test('条件摘要：且 / 或 连接词与 exists 无值', () => {
  const c = fresh();
  const t1 = { logic: 'all', conditions: [{ path: '张三/好感', op: '>=', value: 70 }, { path: '张三/是否已知真相', op: '==', value: true }] };
  assert(ctx.formatValuesTriggerConditions(t1) === '张三/好感 >= 70 且 张三/是否已知真相 == true', '且连接');
  const t2 = { logic: 'any', conditions: [{ path: '张三/好感', op: '>=', value: 70 }, { path: '张三/是否已知真相', op: 'exists', value: null }] };
  assert(ctx.formatValuesTriggerConditions(t2) === '张三/好感 >= 70 或 张三/是否已知真相 exists', '或连接与 exists');
});

// ---------- 发送前任务 ----------
runner.test('发送前任务：条件满足时注入 IN_CHAT 位置', async () => {
  const c = fresh();
  makeValues(c);
  makeTrigger(c);
  ctx.saveValuesChatState(c, { 张三: { 好感: 80, 是否已知真相: true }, 世界: { 战争状态: false } }, {});
  c.chat = [{ is_user: true, mes: '你好', id: 1 }];
  const calls = [];
  c.setExtensionPrompt = (key, text, position, depth, additive, role) => calls.push({ key, text, position, depth, additive, role });
  await ctx.runValuesTriggerBarrierTask(c);
  const inject = calls.find((call) => call.key === INJECT_KEY && call.text.includes('告白事件'));
  assert(Boolean(inject), '应注入触发事件');
  assert(inject.position === 1, '应使用 IN_CHAT 位置');
  assert(inject.depth === 0, '深度应为 0');
  assert(inject.role === 0, '角色应为 SYSTEM');
  const round = sandbox[LAST_ROUND_KEY];
  assert(round && round.injected === true && round.triggeredIds.includes('001'), '应记录本轮注入');
});

runner.test('一次性事件触发后自动关闭，常驻事件保留', async () => {
  const c = fresh();
  makeValues(c);
  makeTrigger(c);
  makeTrigger(c, { name: '常驻事件', once: false, conditions: [{ path: '世界/战争状态', op: '==', value: true }], content: '常驻正文' });
  ctx.saveValuesChatState(c, { 张三: { 好感: 80, 是否已知真相: true }, 世界: { 战争状态: true } }, {});
  c.chat = [{ is_user: true, mes: '你好', id: 1 }];
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  await ctx.runValuesTriggerBarrierTask(c);
  assert(calls.some((call) => call.key === INJECT_KEY && call.text.includes('告白事件')), '应注入一次性事件');
  const triggers = ctx.getValuesTriggers(c);
  const onceTrigger = triggers.find((t) => t.name === '告白事件');
  const persistentTrigger = triggers.find((t) => t.name === '常驻事件');
  assert(onceTrigger.enabled === false, '一次性事件触发后应自动关闭');
  assert(persistentTrigger.enabled === true, '常驻事件应保持启用');
  const round = sandbox[LAST_ROUND_KEY];
  assert(Array.isArray(round.autoDisabledIds) && round.autoDisabledIds.includes(onceTrigger.id), '记录应包含自动关闭的 id');
  // 第二轮：一次性已关闭不再注入，常驻仍注入
  calls.length = 0;
  await ctx.runValuesTriggerBarrierTask(c);
  assert(!calls.some((call) => call.key === INJECT_KEY && call.text.includes('告白事件')), '一次性事件不应再次注入');
  assert(calls.some((call) => call.key === INJECT_KEY && call.text.includes('常驻正文')), '常驻事件应再次注入');
});

runner.test('发送前任务：条件不满足 / 关闭 / 非用户末条时不注入', async () => {
  const c = fresh();
  makeValues(c);
  makeTrigger(c);
  c.chat = [{ is_user: true, mes: '你好', id: 1 }];
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  // 条件不满足
  await ctx.runValuesTriggerBarrierTask(c);
  assert(calls.length === 0, '条件不满足不应注入');
  // 总开关关闭
  ctx.getSettings(c).valuesTriggerEnabled = false;
  ctx.saveValuesChatState(c, { 张三: { 好感: 80, 是否已知真相: true }, 世界: { 战争状态: false } }, {});
  await ctx.runValuesTriggerBarrierTask(c);
  assert(calls.length === 0, '总开关关闭不应注入');
  // 非用户末条
  ctx.getSettings(c).valuesTriggerEnabled = true;
  c.chat = [{ is_user: false, mes: '你好', id: 2 }];
  await ctx.runValuesTriggerBarrierTask(c);
  assert(calls.length === 0, '非用户末条不应注入');
});

runner.test('生成结束清理：清空注入', () => {
  const c = fresh();
  const calls = [];
  c.setExtensionPrompt = (key, text) => calls.push({ key, text });
  hostCtx.setExtensionPrompt = c.setExtensionPrompt;
  ctx.onValuesTriggerGenerationCleanup();
  assert(calls.some((call) => call.key === INJECT_KEY && call.text === ''), '应清空剧情触发注入');
});

// ---------- YAML 导入导出 ----------
runner.test('整包导出：triggers 段随变量包导出', () => {
  const c = fresh();
  makeValues(c);
  makeTrigger(c);
  const text = ctx.serializeValuesBundle(c);
  assert(text.includes('triggers:'), '应包含 triggers 段');
  assert(text.includes('id: "001"'), '应包含触发 ID');
  assert(text.includes('张三/好感'), '应包含条件路径');
  assert(text.includes('op: ">="'), '应包含运算符');
  assert(text.includes('value: 70'), '应包含条件值');
  assert(text.includes('once: true'), '应导出事件类型 once');
  assert(text.includes('张三向你表白了。'), '应包含事件正文');
  makeTrigger(c, { name: '常驻', once: false, conditions: [{ path: '世界/战争状态', op: '==', value: true }], content: '常驻正文' });
  const text2 = ctx.serializeValuesBundle(c);
  assert(text2.includes('once: false'), '常驻事件应导出 once: false');
});

runner.test('整包解析：triggers 段解析并归一化', () => {
  const text = [
    'format: kaleidoscope-values',
    'keys:',
    '  - name: 好感',
    '    rule: 友好互动 +5',
    'defaults:',
    '  张三:',
    '    好感: 30',
    'triggers:',
    '  - id: "001"',
    '    name: 告白事件',
    '    enabled: true',
    '    once: false',
    '    logic: all',
    '    conditions:',
    '      - path: 张三/好感',
    '        op: ">="',
    '        value: 70',
    '      - path: 张三/是否已知真相',
    '        op: "=="',
    '        value: true',
    '    content: |-',
    '      张三向你表白了。',
  ].join('\n');
  const parsed = ctx.parseValuesBundle(text);
  assert(parsed.triggers.length === 1, '应解析 1 个触发');
  const t = parsed.triggers[0];
  assert(t.id === '001' && t.name === '告白事件' && t.logic === 'all', '触发字段应正确');
  assert(t.conditions.length === 2, '应有 2 个条件');
  assert(t.conditions[0].path === '张三/好感' && t.conditions[0].op === '>=' && t.conditions[0].value === 70, '条件 1 应正确');
  assert(t.conditions[1].value === true, '布尔值应保持布尔');
  assert(t.once === false, 'once: false 应解析为常驻事件');
  assert(t.content.includes('张三向你表白了。'), '正文应解析');
});

runner.test('整包导入：旧数据无 triggers 字段时也能合并', () => {
  const c = fresh();
  makeValues(c);
  // 模拟旧版角色卡：变量包没有 triggers 字段
  const bundle = ctx.getValuesBundle(c);
  delete bundle.triggers;
  const parsed = { keys: [], defaults: {}, triggers: [{ id: '001', name: '新触发', enabled: true, logic: 'all', conditions: [{ path: '张三/好感', op: '>=', value: 80 }], content: '正文' }] };
  ctx.applyValuesBundle(c, parsed, 'merge');
  assert(ctx.getValuesTriggers(c).length === 1, '旧数据应能正常合并触发');
  assert(ctx.getValuesTriggers(c)[0].name === '新触发', '触发应写入');
});

runner.test('整包导入：合并更新同 id 触发，覆盖模式清空', () => {
  const c = fresh();
  makeValues(c);
  makeTrigger(c);
  const bundle = {
    keys: [],
    defaults: {},
    triggers: [
      { id: '001', name: '告白事件（导入版）', enabled: true, logic: 'all', conditions: [{ path: '张三/好感', op: '>=', value: 80 }], content: '导入正文' },
      { id: '009', name: '新触发', enabled: true, logic: 'any', conditions: [{ path: '世界/战争状态', op: '==', value: true }], content: '新正文' },
    ],
  };
  ctx.applyValuesBundle(c, bundle, 'merge');
  const triggers = ctx.getValuesTriggers(c);
  assert(triggers.length === 2, '合并后应有 2 个触发');
  assert(triggers.find((t) => t.id === '001').name === '告白事件（导入版）', '同 id 应更新');
  assert(triggers.some((t) => t.id === '009'), '新 id 应追加');
  ctx.applyValuesBundle(c, bundle, 'replace');
  assert(ctx.getValuesTriggers(c).length === 2, '覆盖后应只剩导入的 2 个');
  assert(ctx.getValuesTriggers(c).every((t) => t.id === '001' || t.id === '009'), '覆盖后不应保留旧触发');
});

runner.run();