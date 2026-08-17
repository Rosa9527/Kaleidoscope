// 万华镜变量系统测试：键注册表 / 双层存储 / YAML 导入导出 / AI 补丁合并 / 维护消息。
'use strict';
const { readSources, loadInContext, createRunner, makeContext, makeCharacter } = require('./harness');

let timerSeq = 0;
let pendingTimers = [];
const sandbox = {
  console,
  AbortController: globalThis.AbortController,
  setTimeout: (fn, ms) => {
    timerSeq += 1;
    pendingTimers.push({ id: timerSeq, fn, ms });
    return timerSeq;
  },
  clearTimeout: (id) => {
    pendingTimers = pendingTimers.filter((timer) => timer.id !== id);
  },
};
const ctx = loadInContext(sandbox, readSources());
const runner = createRunner();
const assert = (condition, message) => {
  if (!condition) throw new Error(message || '断言失败');
};

async function flushTimers() {
  const timers = pendingTimers.splice(0);
  for (const timer of timers) timer.fn();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function fresh() {
  return makeContext();
}

function makeChatCtx() {
  const c = makeContext();
  c.chatMetadata = {};
  c.saveChat = () => {};
  return c;
}

// ---------- 键注册表 ----------
runner.test('注册键：名称去重、规则更新（内置变量常驻 / 卡键遮蔽内置）', () => {
  const c = fresh();
  // 内置默认注册变量（友谊 / 友谊等级 / 情欲 / 情欲等级）：无任何注册时也可
  // 直接使用，但不写入角色卡 / 全局设置（虚拟合并，不随 YAML 导出）。
  const builtinNames = ctx.getValuesKeys(c).map((key) => key.name).sort();
  assert(builtinNames.join(',') === '友谊,友谊等级,情欲,情欲等级', '无注册时应有内置键');
  assert(ctx.getValuesKeys(c).every((key) => ctx.isValuesBuiltinKey(key)), '初始键应全部为内置');
  assert(ctx.getValuesBundle(c).keys.length === 0, '内置键不应写入角色卡 / 全局设置');
  ctx.upsertValuesKey(c, '友谊', '友好互动 +5，冲突 -10，上限 100');
  ctx.upsertValuesKey(c, '金钱', '按剧情收支变化');
  assert(ctx.getValuesBundle(c).keys.length === 2, '卡内应有 2 个键');
  // 卡内同名键遮蔽内置：编辑内置 = 生成卡级自定义规则。
  const builtinShadowed = ctx.getValuesKeys(c).filter((key) => key.name === '友谊');
  assert(builtinShadowed.length === 1 && !ctx.isValuesBuiltinKey(builtinShadowed[0]), '卡键应遮蔽内置友谊');
  assert(ctx.getValuesKeys(c).length === 5, '合并内置后应有 5 个键');
  ctx.upsertValuesKey(c, '友谊', '新规则');
  assert(ctx.getValuesBundle(c).keys.length === 2, '同名键不应重复');
  assert(ctx.getValuesKeyByName(c, '友谊').rule === '新规则', '规则应更新');
  assert(ctx.deleteValuesKey(c, '金钱') === true, '删除应成功');
  assert(ctx.getValuesBundle(c).keys.length === 1, '删除后卡内应剩 1 个键');
  // 删除卡键后内置恢复（删除 = 恢复内置默认）。
  assert(ctx.deleteValuesKey(c, '友谊') === true, '删除卡键应成功');
  assert(ctx.getValuesKeys(c).length === 4, '删除卡键后内置键应恢复');
  assert(ctx.getValuesKeys(c).every((key) => ctx.isValuesBuiltinKey(key)), '恢复的键应全部为内置');
});

// ---------- 默认值：角色卡绑定 ----------
runner.test('默认值写入角色卡（writeExtensionField）', async () => {
  const writes = [];
  const character = makeCharacter('测试角色', 'avatar-1');
  const c = makeContext({ characters: [character], characterId: 0, writeExtensionField: (index, key, value) => {
    writes.push({ index, key, value });
    return Promise.resolve();
  } });
  ctx.upsertValuesKey(c, '好感', '规则');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感'], 30);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  ctx.saveValuesData(c);
  await flushTimers();
  assert(writes.length === 2, '每次变更立即写卡（upsert 键 + 保存默认值各一次，无防抖合并）');
  const last = writes[writes.length - 1];
  assert(last.key === 'kaleidoscope_values', '扩展字段 key 应为 kaleidoscope_values');
  assert(last.value.defaults['金钱'] === 1000, '默认值应包含金钱');
  assert(last.value.defaults['张三']['好感'] === 30, '默认值应包含张三→好感');
  assert(last.value.keys.length === 1, '键注册表应随卡保存');
});

runner.test('无角色时默认值回退全局设置', () => {
  const c = fresh();
  ctx.upsertValuesKey(c, '好感', '规则');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 500);
  ctx.saveValuesData(c);
  const settings = c.extensionSettings.Kaleidoscope;
  assert(settings.valuesData && settings.valuesData.keys.length === 1, '全局设置应保存键');
  assert(settings.valuesData.defaults['金钱'] === 500, '全局设置应保存默认值');
});

// ---------- 游戏值：聊天文件绑定 ----------
runner.test('游戏值写入 chatMetadata 并触发 saveChat', async () => {
  let saved = 0;
  const c = makeChatCtx();
  c.saveChat = () => { saved += 1; };
  const tree = { 张三: { 好感: 32 }, 金钱: 950 };
  ctx.saveValuesChatState(c, tree, { lastSignature: 'sig-1' });
  await flushTimers();
  assert(saved === 1, '应调用 saveChat');
  const state = c.chatMetadata.kaleidoscope_values;
  assert(state && state.values['金钱'] === 950, 'chatMetadata 应保存游戏值');
  assert(state.lastSignature === 'sig-1', '应保存签名');
  assert(ctx.getValuesChatState(c).values['张三']['好感'] === 32, '读取应一致');
});

runner.test('游戏值未初始化时回退默认值', () => {
  const c = makeChatCtx();
  ctx.upsertValuesKey(c, '好感', '规则');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感'], 30);
  const game = ctx.getValuesGameTree(c);
  assert(game['张三']['好感'] === 30, '游戏值应回退默认值');
  assert(ctx.isValuesGameInitialized(c) === false, '未初始化标记应为 false');
});

// ---------- AI 补丁合并 ----------
runner.test('补丁合并：更新 / 删除 / 新增注册键 / 忽略未注册键', () => {
  const current = { 张三: { 好感: 30, 体力: 80 }, 金钱: 1000 };
  const registered = new Set(['好感', '金钱', '体力']);
  const patch = {
    张三: { 好感: 35, 体力: null },
    金钱: 900,
    新角色: { 好感: 10 },
    好感: 99,
  };
  const merged = ctx.mergeValuesPatch(current, patch, registered);
  assert(merged.tree['张三']['好感'] === 35, '嵌套值应更新');
  assert(merged.tree['张三']['体力'] === undefined, 'null 应删除键');
  assert(merged.tree['金钱'] === 900, '顶层值应更新');
  assert(merged.tree['新角色'] === undefined, '未注册的新键应被忽略');
  assert(merged.tree['好感'] === 99, '已注册的新顶层键应允许新增');
  assert(merged.changed.includes('张三.好感'), 'changed 应包含更新路径');
  assert(merged.changed.includes('张三.体力'), 'changed 应包含删除路径');
  assert(merged.ignored.includes('新角色'), 'ignored 应包含被忽略路径');
});

runner.test('补丁合并：无变化时 changed 为空', () => {
  const current = { 金钱: 1000 };
  const merged = ctx.mergeValuesPatch(current, { 金钱: 1000 }, new Set(['金钱']));
  assert(merged.changed.length === 0, '相同值不应算变化');
  assert(merged.tree['金钱'] === 1000, '树应保持不变');
});

runner.test('补丁合并：节点不能变值、键不能变节点', () => {
  const current = { 张三: { 好感: 30 }, 金钱: 1000 };
  const registered = new Set(['好感', '金钱']);
  const patch = {
    张三: 99,          // 节点变值 → 忽略
    金钱: { 子键: 5 }, // 键变节点 → 忽略
  };
  const merged = ctx.mergeValuesPatch(current, patch, registered);
  assert(merged.tree['张三'] && typeof merged.tree['张三'] === 'object', '节点应保持容器');
  assert(merged.tree['张三']['好感'] === 30, '节点内容应保持不变');
  assert(merged.tree['金钱'] === 1000, '键应保持标量');
  assert(merged.changed.length === 0, '不应有任何变化');
  assert(merged.ignored.includes('张三'), '节点变值应记入 ignored');
  assert(merged.ignored.includes('金钱'), '键变节点应记入 ignored');
});

// ---------- AI 返回解析 ----------
runner.test('解析 AI 返回：JSON 与 YAML 两种形态', () => {
  const json = ctx.parseValuesPatch('```json\n{"金钱": 800}\n```');
  assert(json && json['金钱'] === 800, 'JSON 代码块应可解析');
  const yaml = ctx.parseValuesPatch('金钱: 700\n张三:\n  好感: 40');
  assert(yaml && yaml['金钱'] === 700, 'YAML 应可解析');
  assert(yaml['张三']['好感'] === 40, 'YAML 嵌套应可解析');
  assert(ctx.parseValuesPatch('完全不是数据') === null, '乱码应返回 null');
});

runner.test('解析 AI 返回：YAML 支持 ```yaml 代码块围栏', () => {
  const fenced = ctx.parseValuesPatch('```yaml\n金钱: 700\n张三:\n  好感: 40\n```');
  assert(fenced && fenced['金钱'] === 700, '围栏 YAML 应可解析');
  assert(fenced['张三']['好感'] === 40, '围栏 YAML 嵌套应可解析');
  // 缩进的围栏是块文本内容，不能被误删。
  const block = ctx.parseYamlSubset('说明: |-\n  ```js\n  console.log(1)\n  ```');
  assert(block && block['说明'].includes('```js'), '块文本内的围栏应保留');
});

// ---------- YAML 整包导入导出 ----------
runner.test('整包 YAML 往返：键 + 默认值', () => {
  const character = makeCharacter('测试角色', 'avatar-1');
  const c = makeContext({ characters: [character], characterId: 0, writeExtensionField: () => Promise.resolve() });
  ctx.upsertValuesKey(c, '好感', '友好互动 +5，冲突 -10，上限 100');
  ctx.upsertValuesKey(c, '金钱', '按剧情收支变化');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感'], 30);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  const yaml = ctx.serializeValuesBundle(c);
  assert(yaml.includes('format: kaleidoscope-values'), '应包含格式标记');
  assert(yaml.includes('张三:'), '应包含嵌套条目');
  const parsed = ctx.parseValuesBundle(yaml);
  assert(parsed.keys.length === 2, '应解析出 2 个键');
  assert(parsed.defaults['金钱'] === 1000, '应解析出金钱默认值');
  assert(parsed.defaults['张三']['好感'] === 30, '应解析出嵌套默认值');
});

runner.test('整包解析：错误格式抛错', () => {
  let threw = false;
  try {
    ctx.parseValuesBundle('format: other-thing\nkeys: []');
  } catch (error) {
    threw = true;
  }
  assert(threw, '错误 format 应抛错');
});

// ---------- 维护消息 ----------
runner.test('维护消息：键规则 + 当前值 + 最新 2 条消息', () => {
  const c = makeChatCtx();
  c.chat = [
    { is_user: true, name: '玩家', mes: '你好' },
    { is_user: false, name: '角色', mes: '你好呀' },
    { is_user: true, name: '玩家', mes: '送你礼物' },
    { is_user: false, name: '角色', mes: '谢谢！' },
  ];
  ctx.upsertValuesKey(c, '好感', '友好互动 +5');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['好感'], 30);
  const messages = ctx.buildValuesMaintainMessages(c, '系统提示词');
  assert(messages.length === 4, '应有 4 条消息');
  assert(messages[0].role === 'system' && messages[0].content === '系统提示词', '首条应为系统提示词');
  assert(messages[1].content.includes('好感: 友好互动 +5'), '应包含键规则');
  assert(messages[2].content.includes('好感: 30'), '应包含当前值');
  const recent = JSON.parse(messages[3].content.match(/<Recent_Messages>\n([\s\S]*?)\n<\/Recent_Messages>/)[1]);
  assert(recent.length === 2, '应只取最新 2 条消息');
  assert(recent[0].content === '送你礼物' && recent[1].content === '谢谢！', '应取最后两条');
});

// ---------- 内置默认注册变量 ----------
runner.test('内置变量：子变量参与派生 / 维护提示词只在树中出现时列出', () => {
  // 无任何注册时：内置好感等级 ← 内置好感 直接可派生。
  const c = makeChatCtx();
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['拉姆', '友谊'], 68);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['拉姆', '友谊等级'], '占位');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['拉姆', '情欲'], 55);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['拉姆', '情欲等级'], '占位');
  const game = ctx.getValuesGameTree(c);
  assert(game['拉姆']['友谊等级'] === 'lv4: 莫逆之交', '内置子变量应按内置区间派生（68 → lv4）');
  assert(game['拉姆']['情欲等级'] === 'lv3: 卿卿我我', '内置子变量应按内置区间派生（55 → lv3）');
  // 维护提示词：树里还没有内置变量时，内置规则不列入（防止 AI 凭空创建）。
  const c2 = makeChatCtx();
  c2.chat = [{ is_user: true, name: '玩家', mes: '你好' }, { is_user: false, name: '角色', mes: '你好呀' }];
  const msgs1 = ctx.buildValuesMaintainMessages(c2, '系统提示词');
  assert(!msgs1[1].content.includes('友谊') && !msgs1[1].content.includes('情欲'), '树中没有内置变量时内置规则不应列入');
  // 树里出现内置变量（玩家新建值）后，内置规则与派生说明才进入提示词。
  const c3 = makeChatCtx();
  c3.chat = [{ is_user: true, name: '玩家', mes: '你好' }, { is_user: false, name: '角色', mes: '你好呀' }];
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c3), ['拉姆', '友谊'], 68);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c3), ['拉姆', '友谊等级'], '占位');
  const msgs2 = ctx.buildValuesMaintainMessages(c3, '系统提示词');
  assert(msgs2[1].content.includes('友谊: 友谊度区间为0~100'), '树中出现友谊时内置规则应列入');
  assert(msgs2[1].content.includes('友谊等级'), '子变量派生说明应列入');
  assert(msgs2[2].content.includes('友谊: 68'), '当前值应发送父变量');
  assert(!msgs2[2].content.includes('友谊等级'), '内置子变量叶子应被剔除，不发送给 AI');
  assert(!msgs2[1].content.includes('情欲'), '树中没有情欲时内置情欲规则不应列入');
});

runner.test('内置变量：YAML 导出不含内置键，导入同名键按卡保存', () => {
  const character = makeCharacter('测试角色', 'avatar-1');
  const c = makeContext({ characters: [character], characterId: 0, writeExtensionField: () => Promise.resolve() });
  const yaml = ctx.serializeValuesBundle(c);
  assert(!yaml.includes('友谊') && !yaml.includes('情欲'), '内置键不应出现在 YAML 导出中');
  // 导入含同名键的包 → 卡内保存（遮蔽内置），导出随卡携带。
  ctx.applyValuesBundle(c, ctx.parseValuesBundle(
    'format: kaleidoscope-values\nkeys:\n  - name: 友谊\n    type: parent\n    rule: 自定义规则\ndefaults: {}'
  ), 'merge');
  assert(ctx.getValuesBundle(c).keys.length === 1, '导入的同名键应按卡保存');
  assert(ctx.getValuesKeyByName(c, '友谊').rule === '自定义规则', '卡键规则应覆盖内置');
  assert(ctx.serializeValuesBundle(c).includes('自定义规则'), '卡内同名键应随 YAML 导出');
});

runner.test('valuesTreeContainsName：任意层级命中', () => {
  assert(ctx.valuesTreeContainsName({ 张三: { 好感: 68 } }, '好感') === true, '嵌套叶子应命中');
  assert(ctx.valuesTreeContainsName({ 张三: { 好感: 68 } }, '金钱') === false, '不存在的名字不应命中');
  assert(ctx.valuesTreeContainsName({ 好感: 68 }, '好感') === true, '顶层叶子应命中');
  assert(ctx.valuesTreeContainsName({ 张三: { 好感: 68 } }, '') === false, '空名字不应命中');
});

// ---------- 树工具 ----------
runner.test('变量树工具：路径读写删除与计数', () => {
  const tree = {};
  ctx.valuesSetAtPath(tree, ['张三', '好感'], 30);
  ctx.valuesSetAtPath(tree, ['金钱'], 1000);
  assert(ctx.valuesGetAtPath(tree, ['张三', '好感']) === 30, '路径读取应正确');
  assert(ctx.valuesCountEntries(tree) === 2, '应统计 2 个叶子');
  ctx.valuesDeleteAtPath(tree, ['张三', '好感']);
  assert(ctx.valuesGetAtPath(tree, ['张三', '好感']) === undefined, '删除后应不存在');
  assert(ctx.valuesCountEntries(tree) === 1, '删除后应剩 1 个叶子');
});

// ---------- 注入提示词配置 ----------
runner.test('注入配置：默认关闭且无勾选，可开关', () => {
  const c = fresh();
  const config = ctx.getValuesInjectConfig(c);
  assert(config.enabled === false, '默认应关闭');
  assert(Array.isArray(config.paths) && config.paths.length === 0, '默认应无勾选');
  ctx.setValuesInjectEnabled(c, true);
  assert(ctx.getValuesInjectConfig(c).enabled === true, '开启后应生效');
  ctx.setValuesInjectEnabled(c, false);
  assert(ctx.getValuesInjectConfig(c).enabled === false, '关闭后应生效');
});

runner.test('注入配置：打开下级自动提升祖先，打开节点级联打开后代，关闭节点级联关闭后代', () => {
  const c = fresh();
  const defaults = ctx.getValuesDefaults(c);
  defaults['张三'] = { '好感': 30, '金钱': 1000 };
  ctx.saveValuesData(c);
  ctx.setValuesInjectPath(c, ['张三', '好感'], true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  let config = ctx.getValuesInjectConfig(c);
  assert(config.paths.includes('张三/好感') && config.paths.includes('金钱'), '应勾选两个变量');
  assert(config.paths.includes('张三'), '打开下级应自动提升上级');
  // 打开节点「张三」→ 全部后代级联打开
  ctx.setValuesInjectPath(c, ['张三'], true);
  config = ctx.getValuesInjectConfig(c);
  assert(config.paths.includes('张三'), '节点应打开');
  assert(config.paths.includes('张三/好感'), '后代好感应级联打开');
  assert(config.paths.includes('张三/金钱'), '后代金钱应级联打开');
  // 关闭节点 → 节点与后代全部关闭
  ctx.setValuesInjectPath(c, ['张三'], false);
  config = ctx.getValuesInjectConfig(c);
  assert(!config.paths.includes('张三'), '节点应关闭');
  assert(!config.paths.includes('张三/好感'), '后代应级联关闭');
  assert(!config.paths.includes('张三/金钱'), '金钱应级联关闭');
  assert(config.paths.includes('金钱'), '其他路径应保留');
});

runner.test('注入配置：祖先勾选覆盖后代（isValuesInjectPathSelected）', () => {
  const c = fresh();
  ctx.setValuesInjectPath(c, ['张三'], true);
  assert(ctx.isValuesInjectPathSelected(c, ['张三']) === true, '节点自身应选中');
  assert(ctx.isValuesInjectPathSelected(c, ['张三', '好感']) === true, '后代应被覆盖选中');
  assert(ctx.isValuesInjectPathSelected(c, ['金钱']) === false, '无关路径不应选中');
});

runner.test('注入配置：随角色卡保存', async () => {
  const writes = [];
  const character = makeCharacter('测试角色', 'avatar-1');
  const c = makeContext({ characters: [character], characterId: 0, writeExtensionField: (index, key, value) => {
    writes.push({ index, key, value });
    return Promise.resolve();
  } });
  ctx.setValuesInjectEnabled(c, true);
  ctx.setValuesInjectPath(c, ['金钱'], true);
  await flushTimers();
  assert(writes.length === 2, '每次变更立即写卡（开关注入 + 勾选路径各一次，无防抖合并）');
  const last = writes[writes.length - 1];
  assert(last.value.inject && last.value.inject.enabled === true, '角色卡应保存注入开关');
  assert(last.value.inject.paths.includes('金钱'), '角色卡应保存勾选路径');
});

// ---------- 父变量 / 子变量 ----------
runner.test('注册子变量：类型 / 父变量 / 区间规则，旧键归一化为父变量', () => {
  const c = fresh();
  ctx.upsertValuesKey(c, '好感度', '友好互动 +5，冲突 -10，上限 100');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [
    { min: 0, max: 30, value: '冷淡' },
    { min: 31, max: 60, value: '颇具好感' },
    { min: 61, max: 100, value: '生死相依' },
  ] });
  const keys = ctx.getValuesKeys(c);
  assert(keys.filter((key) => !ctx.isValuesBuiltinKey(key)).length === 2, '卡内应有 2 个键（另含 2 个内置键）');
  const attitude = ctx.getValuesKeyByName(c, '态度');
  assert(ctx.isValuesChildKey(attitude) === true, '态度应为子变量');
  assert(attitude.parent === '好感度', '父变量名应保存');
  assert(attitude.rules.length === 3, '应有 3 条区间规则');
  assert(ctx.isValuesParentKey(ctx.getValuesKeyByName(c, '好感度')) === true, '好感度应为父变量');
  assert(ctx.getValuesChildKeysByParent(c, '好感度').length === 1, '应能查到依赖好感度的子变量');
  // 删除守卫：内置子变量（友谊等级 ← 友谊）不算卡键依赖，删除卡内友谊不会被误拦截。
  ctx.upsertValuesKey(c, '好感', '规则');
  assert(ctx.getValuesChildKeysByParent(c, '好感').length === 0, '内置子变量不应算作删除依赖');
  // 缺省 type 的旧键归一化为父变量
  const c2 = fresh();
  ctx.upsertValuesKey(c2, '金钱', '按剧情收支变化');
  assert(ctx.getValuesKeyByName(c2, '金钱').type === 'parent', '旧键应归一化为父变量');
});

runner.test('子变量派生：按父变量值命中区间（40 → 颇具好感，90 → 生死相依）', () => {
  const c = makeChatCtx();
  ctx.upsertValuesKey(c, '好感度', '规则');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [
    { min: 0, max: 30, value: '冷淡' },
    { min: 31, max: 60, value: '颇具好感' },
    { min: 61, max: 100, value: '生死相依' },
  ] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感度'], 40);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '态度'], '未知');
  assert(ctx.getValuesGameTree(c)['张三']['态度'] === '颇具好感', '40 应派生为颇具好感');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感度'], 90);
  assert(ctx.getValuesGameTree(c)['张三']['态度'] === '生死相依', '90 应派生为生死相依');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感度'], 30);
  assert(ctx.getValuesGameTree(c)['张三']['态度'] === '冷淡', '30 应命中 0~30 区间');
  // 无规则命中（101）保持原值
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感度'], 101);
  assert(ctx.getValuesGameTree(c)['张三']['态度'] === '冷淡', '超出范围应保持原值');
});

runner.test('子变量派生：带 % 的字符串父值按百分比小数命中区间（43% = 0.43）', () => {
  const c = makeChatCtx();
  ctx.upsertValuesKey(c, '好感度', '规则');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [
    { max: 0.5, value: '低' },
    { min: 0.51, value: '高' },
  ] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感度'], '43%');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '态度'], '未知');
  assert(ctx.getValuesGameTree(c)['张三']['态度'] === '低', '43% = 0.43 应命中 ~0.5 区间');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感度'], '60%');
  assert(ctx.getValuesGameTree(c)['张三']['态度'] === '高', '60% = 0.6 应命中 0.51~ 区间');
});

runner.test('子变量派生：默认值层就地派生；父变量缺失 / 非数值保持原值', () => {
  const c = fresh();
  ctx.upsertValuesKey(c, '好感度', '规则');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [{ min: 0, max: 100, value: '友好' }] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['好感度'], 50);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['态度'], '旧值');
  assert(ctx.getValuesDefaults(c)['态度'] === '友好', '默认值层子变量应派生');
  const c2 = makeChatCtx();
  ctx.upsertValuesKey(c2, '好感度', '规则');
  ctx.upsertValuesKey(c2, '态度', '', { type: 'child', parent: '好感度', rules: [{ min: 0, max: 100, value: '友好' }] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c2), ['态度'], '回退值');
  assert(ctx.getValuesGameTree(c2)['态度'] === '回退值', '父变量缺失应保持原值');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c2), ['好感度'], '未知');
  assert(ctx.getValuesGameTree(c2)['态度'] === '回退值', '父变量非数值应保持原值');
});

runner.test('子变量区间校验：重叠（含边界）/ 非法行 / 开区间', () => {
  // 0~1000 与 1000~2000 在 1000 处重叠，必须写成 1001~2000
  const overlap = ctx.validateValuesChildRules([
    { min: 0, max: 1000, value: 'a' },
    { min: 1000, max: 2000, value: 'b' },
  ]);
  assert(overlap.overlaps.length === 1, '含边界重叠应检出');
  const ok = ctx.validateValuesChildRules([
    { min: 0, max: 1000, value: 'a' },
    { min: 1001, max: 2000, value: 'b' },
  ]);
  assert(ok.overlaps.length === 0, '接续区间不应重叠');
  // 开区间：~1000 与 1001~ 不重叠；~1000 与 1000~ 重叠
  const openOk = ctx.validateValuesChildRules([
    { max: 1000, value: 'a' },
    { min: 1001, value: 'b' },
  ]);
  assert(openOk.overlaps.length === 0, '开区间接续不应重叠');
  const openBad = ctx.validateValuesChildRules([
    { max: 1000, value: 'a' },
    { min: 1000, value: 'b' },
  ]);
  assert(openBad.overlaps.length === 1, '开区间含边界重叠应检出');
  // min > max 非法
  const invalid = ctx.validateValuesChildRules([
    { min: 100, max: 50, value: 'a' },
  ]);
  assert(invalid.invalid.length === 1, '下限大于上限应标记非法');
});

runner.test('AI 维护：父变量变化后子变量自动重算，AI 改子变量被覆盖', async () => {
  const c = makeChatCtx();
  c.chat = [
    { is_user: true, name: '玩家', mes: '送你礼物' },
    { is_user: false, name: '角色', mes: '谢谢！' },
  ];
  ctx.upsertValuesKey(c, '好感度', '友好互动 +5');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [
    { min: 0, max: 30, value: '冷淡' },
    { min: 31, max: 100, value: '颇具好感' },
  ] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['好感度'], 20);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['态度'], '冷淡');
  ctx.chatCompletion = async () => '{"好感度": 40, "态度": "AI乱改"}';
  const settings = ctx.getSettings(c);
  settings.apiUrl = 'https://example.com/v1';
  settings.model = 'test-model';
  const record = await ctx.runValuesMaintain(c, settings, { force: true });
  assert(record.ok === true, '维护应成功');
  const state = ctx.getValuesChatState(c);
  assert(state.values['好感度'] === 40, '父变量应更新为 40');
  assert(state.values['态度'] === '颇具好感', '子变量应重算为颇具好感（AI 改动被覆盖）');
});

runner.test('维护消息：子变量不列入键规则并注明派生关系', () => {
  const c = makeChatCtx();
  ctx.upsertValuesKey(c, '好感度', '友好互动 +5');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [{ min: 0, max: 100, value: '友好' }] });
  const messages = ctx.buildValuesMaintainMessages(c, '系统提示词');
  const rulesBlock = messages[1].content;
  assert(rulesBlock.includes('好感度: 友好互动 +5'), '应包含父变量规则');
  assert(!rulesBlock.includes('态度:'), '子变量不应列入键规则');
  assert(rulesBlock.includes('态度 ← 好感度'), '应注明子变量派生关系');
});

runner.test('维护消息：Current_Values 只含父变量，子变量叶子不发送', () => {
  const c = makeChatCtx();
  ctx.upsertValuesKey(c, '好感度', '友好互动 +5');
  ctx.upsertValuesKey(c, '金钱', '按剧情收支变化');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [{ min: 0, max: 100, value: '友好' }] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感度'], 40);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '态度'], '未知');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  const messages = ctx.buildValuesMaintainMessages(c, '系统提示词');
  const valuesBlock = messages[2].content;
  assert(valuesBlock.includes('好感度: 40'), '应包含父变量当前值');
  assert(valuesBlock.includes('金钱: 1000'), '应包含其他父变量当前值');
  assert(!valuesBlock.includes('态度'), 'Current_Values 不应包含子变量');
  assert(valuesBlock.includes('仅含父变量'), '应注明只含父变量');
});

runner.test('stripValuesChildLeaves：仅剔除子变量叶子，容器与父变量保留且不修改入参', () => {
  const c = fresh();
  ctx.upsertValuesKey(c, '好感度', '规则');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [{ min: 0, max: 100, value: '友好' }] });
  const tree = {
    张三: { 好感度: 40, 态度: '友好' },
    态度: { 备注: '同名容器不应被剔除' },
  };
  const stripped = ctx.stripValuesChildLeaves(tree, ctx.getValuesKeys(c));
  assert(stripped['张三']['好感度'] === 40, '父变量应保留');
  assert(stripped['张三']['态度'] === undefined, '子变量叶子应剔除');
  assert(stripped['态度']['备注'] === '同名容器不应被剔除', '同名容器不应剔除');
  assert(tree['张三']['态度'] === '友好', '原树不应被修改');
});

runner.test('AI 维护：补丁里的子变量增删改一律被剔除，子变量由父变量派生', async () => {
  const c = makeChatCtx();
  c.chat = [
    { is_user: true, name: '玩家', mes: '送你礼物' },
    { is_user: false, name: '角色', mes: '谢谢！' },
  ];
  ctx.upsertValuesKey(c, '好感度', '友好互动 +5');
  ctx.upsertValuesKey(c, '金钱', '按剧情收支变化');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [
    { min: 0, max: 30, value: '冷淡' },
    { min: 31, max: 100, value: '颇具好感' },
  ] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['好感度'], 20);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['态度'], '冷淡');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  // AI 试图改子变量、新增不存在的子变量并删除已有子变量
  ctx.chatCompletion = async () => '{"好感度": 40, "态度": "AI乱改", "金钱": 500}';
  const settings = ctx.getSettings(c);
  settings.apiUrl = 'https://example.com/v1';
  settings.model = 'test-model';
  const record = await ctx.runValuesMaintain(c, settings, { force: true });
  assert(record.ok === true, '维护应成功');
  const state = ctx.getValuesChatState(c);
  assert(state.values['好感度'] === 40, '父变量应更新为 40');
  assert(state.values['金钱'] === 500, '父变量金钱应更新');
  assert(state.values['态度'] === '颇具好感', '子变量应按父变量派生（AI 改动被剔除）');
  assert(record.changed.indexOf('态度') < 0, '子变量不应计入变化');
});

runner.test('AI 维护：父变量不可派生时，AI 改子变量也不得残留', async () => {
  const c = makeChatCtx();
  c.chat = [
    { is_user: true, name: '玩家', mes: '你好' },
    { is_user: false, name: '角色', mes: '你好呀' },
  ];
  ctx.upsertValuesKey(c, '好感度', '友好互动 +5');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [{ min: 0, max: 100, value: '友好' }] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['态度'], '旧值');
  // 父变量缺失（无法派生），AI 直接改子变量 → 改动必须被剔除、不得残留
  ctx.chatCompletion = async () => '{"态度": "AI改的"}';
  const settings = ctx.getSettings(c);
  settings.apiUrl = 'https://example.com/v1';
  settings.model = 'test-model';
  const record = await ctx.runValuesMaintain(c, settings, { force: true });
  assert(record.ok === true, '维护应成功');
  assert(record.changed.length === 0, '子变量改动不应计入变化');
  assert(ctx.getValuesGameTree(c)['态度'] === '旧值', '父变量缺失时 AI 改子变量不得残留');
});

// ---------- 维护 toast ----------
runner.test('AI 维护 toast：开始 / 成功有变化 / 无变化 / 失败 / 空轮静默', async () => {
  const calls = [];
  sandbox.toastr = {
    info: (message) => calls.push(['info', message]),
    success: (message) => calls.push(['success', message]),
    error: (message) => calls.push(['error', message]),
    warning: (message) => calls.push(['warning', message]),
  };
  const runOne = async (chatCompletion) => {
    const c = makeChatCtx();
    c.chat = [
      { is_user: true, name: '玩家', mes: '送你礼物' },
      { is_user: false, name: '角色', mes: '谢谢！' },
    ];
    ctx.upsertValuesKey(c, '好感度', '友好互动 +5');
    ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['好感度'], 20);
    ctx.chatCompletion = chatCompletion;
    const settings = ctx.getSettings(c);
    settings.apiUrl = 'https://example.com/v1';
    settings.model = 'test-model';
    calls.length = 0;
    return ctx.runValuesMaintain(c, settings, { force: true });
  };
  // 成功：有变化
  await runOne(async () => '{"好感度": 40}');
  assert(calls.some(([kind, msg]) => kind === 'info' && msg.includes('变量更新开始（手动）')), '应有开始 toast');
  assert(calls.some(([kind, msg]) => kind === 'success' && msg.includes('变量更新成功：已更新 1 项')), '应有成功 toast');
  // 成功：无变化
  await runOne(async () => '{}');
  assert(calls.some(([kind, msg]) => kind === 'info' && msg.includes('变量更新完成：本轮无变化')), '应有无变化 toast');
  assert(!calls.some(([kind]) => kind === 'success'), '无变化时不应有成功 toast');
  // 失败：AI 返回无法解析
  await runOne(async () => '不是 YAML');
  assert(calls.some(([kind, msg]) => kind === 'error' && msg.includes('变量更新失败')), '应有失败 toast');
  // 空轮（无变量无现有值）：静默，不应有任何 toast
  const empty = makeChatCtx();
  const settings = ctx.getSettings(empty);
  settings.apiUrl = 'https://example.com/v1';
  settings.model = 'test-model';
  calls.length = 0;
  await ctx.runValuesMaintain(empty, settings, { force: true });
  assert(calls.length === 0, '空轮不应有 toast');
});

runner.test('整包 YAML 往返：子变量类型 / 父变量 / 区间规则', () => {
  const character = makeCharacter('测试角色', 'avatar-1');
  const c = makeContext({ characters: [character], characterId: 0, writeExtensionField: () => Promise.resolve() });
  ctx.upsertValuesKey(c, '好感度', '友好互动 +5，冲突 -10，上限 100');
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '好感度', rules: [
    { min: 0, max: 30, value: '冷淡' },
    { min: 31, max: 60, value: '颇具好感' },
    { min: 61, max: 100, value: '生死相依' },
  ] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感度'], 40);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '态度'], '未知');
  const yaml = ctx.serializeValuesBundle(c);
  assert(yaml.includes('type: child'), '应导出子变量类型');
  assert(yaml.includes('parent: 好感度'), '应导出父变量名');
  assert(yaml.includes('value: 颇具好感'), '应导出区间文本');
  assert(yaml.includes('态度: 颇具好感'), '默认值树应导出派生后的子变量值');
  const parsed = ctx.parseValuesBundle(yaml);
  const attitude = parsed.keys.find((key) => key.name === '态度');
  assert(attitude && attitude.type === 'child', '导入应识别子变量');
  assert(attitude.parent === '好感度', '导入应保留父变量名');
  assert(attitude.rules.length === 3, '导入应保留区间规则');
  const c2 = fresh();
  ctx.applyValuesBundle(c2, parsed, 'merge');
  const key = ctx.getValuesKeyByName(c2, '态度');
  assert(ctx.isValuesChildKey(key) && key.parent === '好感度', '合并导入应保留子变量');
  assert(key.rules.length === 3, '合并导入应保留区间规则');
});

// ---------- 拖动排序：顺序表 ----------
runner.test('键注册表重排：按名称调整顺序并保存', () => {
  const c = makeChatCtx();
  ctx.upsertValuesKey(c, '好感', '规则1');
  ctx.upsertValuesKey(c, '金钱', '规则2');
  ctx.upsertValuesKey(c, '体力', '规则3');
  ctx.reorderValuesKeys(c, ['体力', '好感', '金钱']);
  const names = ctx.getValuesKeys(c).filter((key) => !ctx.isValuesBuiltinKey(key)).map((key) => key.name);
  assert(names.join(',') === '体力,好感,金钱', '应按给定顺序重排');
  // 未列出的键按原相对顺序追加在末尾
  ctx.upsertValuesKey(c, '魔力', '规则4');
  ctx.reorderValuesKeys(c, ['金钱']);
  const names2 = ctx.getValuesKeys(c).filter((key) => !ctx.isValuesBuiltinKey(key)).map((key) => key.name);
  assert(names2.join(',') === '金钱,体力,好感,魔力', '未列出的键应追加在末尾');
});

runner.test('触发列表重排：按 id 调整顺序并保存', () => {
  const c = makeChatCtx();
  ctx.createValuesTrigger(c, { id: '001', name: 'A', conditions: [], content: 'x' });
  ctx.createValuesTrigger(c, { id: '002', name: 'B', conditions: [], content: 'x' });
  ctx.createValuesTrigger(c, { id: '003', name: 'C', conditions: [], content: 'x' });
  ctx.reorderValuesTriggers(c, ['003', '001', '002']);
  const ids = ctx.getValuesTriggers(c).map((trigger) => trigger.id);
  assert(ids.join(',') === '003,001,002', '应按给定顺序重排');
});

runner.test('变量树顺序表：记录顺序 + 未记录条目按名称排序追加', () => {
  const c = makeChatCtx();
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感'], 30);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '态度'], '友好');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['李四', '金钱'], 100);
  ctx.reorderValuesTreeAt(c, '', ['李四', '张三']);
  ctx.reorderValuesTreeAt(c, ['张三'], ['态度', '好感']);
  const order = ctx.getValuesTreeOrder(c);
  assert(order[''].join(',') === '李四,张三', '顶层顺序应记录');
  assert(order['张三'].join(',') === '态度,好感', '子级顺序应记录');
  const root = ctx.getValuesDefaults(c);
  assert(ctx.valuesOrderedNames(order, '', root).join(',') === '李四,张三', '顶层应按记录顺序');
  assert(ctx.valuesOrderedNames(order, '张三', root['张三']).join(',') === '态度,好感', '子级应按记录顺序');
  // 未记录顺序的父路径回退为名称排序
  assert(ctx.valuesOrderedNames({}, '李四', root['李四']).join(',') === '金钱', '无记录时按名称排序');
  // 顺序表里的失效名被过滤，新条目按名称排序追加
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['王五'], 1);
  assert(ctx.valuesOrderedNames(order, '', root).join(',') === '李四,张三,王五', '新条目应追加在末尾');
});

runner.test('整包 YAML 往返：order 顺序表', () => {
  const character = makeCharacter('测试角色', 'avatar-1');
  const c = makeContext({ characters: [character], characterId: 0, writeExtensionField: () => Promise.resolve() });
  ctx.upsertValuesKey(c, '好感', '规则');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '好感'], 30);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['李四'], 1);
  ctx.reorderValuesTreeAt(c, '', ['李四', '张三']);
  const yaml = ctx.serializeValuesBundle(c);
  assert(yaml.includes('order:'), '应导出 order 段');
  assert(yaml.includes('path: ""'), '应导出顶层路径');
  const parsed = ctx.parseValuesBundle(yaml);
  assert(parsed.order[''].join(',') === '李四,张三', '导入应保留顺序');
  const c2 = fresh();
  ctx.applyValuesBundle(c2, parsed, 'merge');
  assert(ctx.getValuesTreeOrder(c2)[''].join(',') === '李四,张三', '合并导入应保留顺序');
});

// ---------- 公式派生 ----------
runner.test('公式语法：四则 / 括号 / 中文变量 / 负号 / 非法输入', () => {
  const ok = (formula, refs) => {
    const syntax = ctx.validateValuesFormulaSyntax(formula);
    assert(syntax.ok, `公式「${formula}」应合法：${syntax.error || ''}`);
    assert(syntax.refs.join(',') === refs, `「${formula}」引用变量应为「${refs}」，实际「${syntax.refs.join(',')}」`);
  };
  const bad = (formula) => {
    const syntax = ctx.validateValuesFormulaSyntax(formula);
    assert(!syntax.ok, `公式「${formula}」应非法`);
  };
  ok('0.5*服从值+0.5*美貌值', '服从值,美貌值');
  ok('((0.5*友谊+0.5*情欲)+1.2*情欲)/10', '友谊,情欲');
  ok('2+3*4', '');
  ok('(2+3)*4', '');
  ok('(服从值+美貌值)/2', '服从值,美貌值');
  ok('-服从值+100', '服从值');
  ok(' 综合评分 *1.5 ', '综合评分');
  bad('');
  bad('(2+3');
  bad('2+3)');
  bad('2**3');
  bad('2+');
  bad('*3');
  bad('2+3 4');
  bad('1.2.3');
  bad('()');
});

runner.test('公式求值：优先级 / 括号 / 缺失与非数值 / 除零', () => {
  const close = (a, b) => Math.abs(a - b) < 1e-9;
  const evalFormula = (formula, values) => {
    const syntax = ctx.validateValuesFormulaSyntax(formula);
    if (!syntax.ok) throw new Error(`公式非法：${syntax.error}`);
    return ctx.evalValuesFormula(syntax.ast, (name) => (name in values ? values[name] : null));
  };
  assert(evalFormula('2+3*4', {}) === 14, '乘法优先');
  assert(evalFormula('(2+3)*4', {}) === 20, '括号优先');
  assert(evalFormula('0.5*服从值+0.5*美貌值', { 服从值: 80, 美貌值: 60 }) === 70, '加权求和');
  assert(evalFormula('10-服从值', { 服从值: 3 }) === 7, '减法');
  assert(evalFormula('-服从值+100', { 服从值: 30 }) === 70, '负号');
  assert(evalFormula('服从值/2', { 服从值: '80' }) === 40, '字符串数值可参与');
  assert(close(evalFormula('立法会席位*支持度', { 立法会席位: 89, 支持度: '43%' }), 38.27), '带 % 的字符串按百分比小数参与（43% = 0.43）');
  assert(close(evalFormula('立法会席位*支持度', { 立法会席位: '89%', 支持度: '43%' }), 0.3827), '两个 % 相乘按小数计算');
  assert(close(evalFormula('立法会席位*2', { 立法会席位: '89.5%' }), 1.79), '带小数与 % 的字符串可参与');
  assert(evalFormula('服从值+1', {}) === null, '变量缺失返回 null');
  assert(evalFormula('服从值+1', { 服从值: '未知' }) === null, '非数值返回 null');
  assert(evalFormula('1/0', {}) === null, '除零返回 null');
});

runner.test('子变量派生：公式模式（多变量加权，同路径查找）', () => {
  const c = fresh();
  ctx.upsertValuesKey(c, '服从值', '服从值规则');
  ctx.upsertValuesKey(c, '美貌值', '美貌值规则');
  ctx.upsertValuesKey(c, '综合评分', '', { type: 'child', formula: '0.5*服从值+0.5*美貌值' });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '服从值'], 80);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '美貌值'], 60);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '综合评分'], '旧值');
  assert(ctx.getValuesGameTree(c)['奴隶']['综合评分'] === 70, '80/60 应加权为 70');
  // 带 % 后缀的字符串值（如 80% / 60%）按百分比小数参与（0.8 / 0.6），
  // 默认结果小数位为 0（四舍五入取整）
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '服从值'], '80%');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '美貌值'], '60%');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '综合评分'], '旧值');
  assert(ctx.getValuesGameTree(c)['奴隶']['综合评分'] === 1, '0.7 默认取整为 1');
  // 指定小数位 1 后保留一位（0.7）
  ctx.upsertValuesKey(c, '综合评分', '', { type: 'child', formula: '0.5*服从值+0.5*美貌值', decimals: 1 });
  assert(Math.abs(ctx.getValuesGameTree(c)['奴隶']['综合评分'] - 0.7) < 1e-9, 'decimals=1 应保留一位（0.7）');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '服从值'], 100);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '美貌值'], 0);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '综合评分'], '旧值');
  assert(ctx.getValuesGameTree(c)['奴隶']['综合评分'] === 50, '100/0 应加权为 50');
  // 变量缺失 / 非数值保持原值
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '服从值'], '未知');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '综合评分'], '保持');
  assert(ctx.getValuesGameTree(c)['奴隶']['综合评分'] === '保持', '非数值输入应保持原值');
});

runner.test('子变量派生：公式结果按小数位四舍五入（默认取整）', () => {
  const c = fresh();
  ctx.upsertValuesKey(c, '立法会席位', '规则');
  ctx.upsertValuesKey(c, '支持度', '规则');
  ctx.upsertValuesKey(c, '有效席位', '', { type: 'child', formula: '立法会席位*支持度' });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['大道寺家族', '立法会席位'], 89);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['大道寺家族', '支持度'], '43%');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['大道寺家族', '有效席位'], '旧值');
  assert(ctx.getValuesGameTree(c)['大道寺家族']['有效席位'] === 38, '38.27 默认四舍五入取整为 38');
  ctx.upsertValuesKey(c, '有效席位', '', { type: 'child', formula: '立法会席位*支持度', decimals: 1 });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['大道寺家族', '有效席位'], '旧值');
  assert(Math.abs(ctx.getValuesGameTree(c)['大道寺家族']['有效席位'] - 38.3) < 1e-9, 'decimals=1 应保留一位（38.3）');
  ctx.upsertValuesKey(c, '有效席位', '', { type: 'child', formula: '立法会席位*支持度', decimals: 2 });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['大道寺家族', '有效席位'], '旧值');
  assert(Math.abs(ctx.getValuesGameTree(c)['大道寺家族']['有效席位'] - 38.27) < 1e-9, 'decimals=2 应保留两位（38.27）');
});

runner.test('子变量派生：链式（公式子变量 → 区间子变量）', () => {
  const c = fresh();
  ctx.upsertValuesKey(c, '服从值', '规则');
  ctx.upsertValuesKey(c, '美貌值', '规则');
  ctx.upsertValuesKey(c, '综合评分', '', { type: 'child', formula: '0.5*服从值+0.5*美貌值' });
  ctx.upsertValuesKey(c, 'A级', '', { type: 'child', parent: '综合评分', rules: [
    { max: 69, value: 'B级' },
    { min: 70, max: 150, value: 'A级' },
    { min: 151, value: 'S级' },
  ] });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '服从值'], 80);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '美貌值'], 60);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '综合评分'], 0);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', 'A级'], '未知');
  let tree = ctx.getValuesGameTree(c);
  assert(tree['奴隶']['综合评分'] === 70, '公式应算出 70');
  assert(tree['奴隶']['A级'] === 'A级', '70 应命中 70~150 区间');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '服从值'], 40);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '美貌值'], 20);
  tree = ctx.getValuesGameTree(c);
  assert(tree['奴隶']['综合评分'] === 30, '公式应算出 30');
  assert(tree['奴隶']['A级'] === 'B级', '30 应命中 ~69 区间');
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '服从值'], 200);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['奴隶', '美貌值'], 200);
  assert(ctx.getValuesGameTree(c)['奴隶']['A级'] === 'S级', '200 应命中 151~ 区间');
});

runner.test('派生循环检测：区间互引 / 公式环 / 自引用 / 无环不误报', () => {
  const only = (c, names) => ctx.getValuesKeys(c).filter((key) => names.includes(key.name));
  const c1 = fresh();
  ctx.upsertValuesKey(c1, 'A', '', { type: 'child', parent: 'B', rules: [{ min: 0, max: 100, value: 'x' }] });
  ctx.upsertValuesKey(c1, 'B', '', { type: 'child', parent: 'A', rules: [{ min: 0, max: 100, value: 'x' }] });
  const cycleAB = ctx.findValuesChildCycle(only(c1, ['A', 'B']), 'A', ['B']);
  assert(cycleAB && cycleAB.join(' → ') === 'A → B → A', '区间互引应检出环');
  const c2 = fresh();
  ctx.upsertValuesKey(c2, 'A', '', { type: 'child', formula: 'B*2' });
  ctx.upsertValuesKey(c2, 'B', '', { type: 'child', parent: 'A', rules: [{ min: 0, max: 100, value: 'x' }] });
  const cycleFormula = ctx.findValuesChildCycle(only(c2, ['A', 'B']), 'A', ['B']);
  assert(cycleFormula && cycleFormula.join(' → ') === 'A → B → A', '公式引用成环应检出');
  const c3 = fresh();
  ctx.upsertValuesKey(c3, 'A', '', { type: 'child', parent: 'A', rules: [{ min: 0, value: 'x' }] });
  const selfCycle = ctx.findValuesChildCycle(only(c3, ['A']), 'A', ['A']);
  assert(selfCycle && selfCycle.join(' → ') === 'A → A', '自引用应检出');
  const c4 = fresh();
  ctx.upsertValuesKey(c4, '服从值', '规则');
  ctx.upsertValuesKey(c4, '综合评分', '', { type: 'child', formula: '0.5*服从值' });
  ctx.upsertValuesKey(c4, 'A级', '', { type: 'child', parent: '综合评分', rules: [{ min: 70, value: 'A' }] });
  const noCycle = ctx.findValuesChildCycle(only(c4, ['服从值', '综合评分', 'A级']), 'A级', ['综合评分']);
  assert(noCycle === null, '链式无环不应误报');
});

runner.test('整包 YAML 往返：公式派生子变量', () => {
  const character = makeCharacter('测试角色', 'avatar-1');
  const c = makeContext({ characters: [character], characterId: 0, writeExtensionField: () => Promise.resolve() });
  ctx.upsertValuesKey(c, '服从值', '规则');
  ctx.upsertValuesKey(c, '综合评分', '', { type: 'child', formula: '0.5*服从值+0.5*美貌值', decimals: 2 });
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '服从值', rules: [{ min: 0, max: 50, value: '低' }] });
  const yaml = ctx.serializeValuesBundle(c);
  assert(yaml.includes('formula: 0.5*服从值+0.5*美貌值'), '应导出公式');
  assert(yaml.includes('decimals: 2'), '应导出小数位');
  assert(yaml.includes('parent: 服从值'), '区间模式应照旧导出派生源');
  const parsed = ctx.parseValuesBundle(yaml);
  const score = parsed.keys.find((key) => key.name === '综合评分');
  assert(score.formula === '0.5*服从值+0.5*美貌值', '导入应还原公式');
  assert(score.decimals === 2, '导入应还原小数位');
  assert(score.parent === '', '公式模式不应有派生源');
  const attitude = parsed.keys.find((key) => key.name === '态度');
  assert(attitude.parent === '服从值' && attitude.rules.length === 1, '区间模式应还原');
  const c2 = fresh();
  ctx.applyValuesBundle(c2, parsed, 'merge');
  assert(ctx.getValuesKeyByName(c2, '综合评分').formula === '0.5*服从值+0.5*美貌值', '合并导入应保留公式');
  assert(ctx.getValuesKeyByName(c2, '综合评分').decimals === 2, '合并导入应保留小数位');
});

runner.test('删除依赖检查：公式引用者被列为依赖', () => {
  const c = fresh();
  ctx.upsertValuesKey(c, '服从值', '规则');
  ctx.upsertValuesKey(c, '综合评分', '', { type: 'child', formula: '0.5*服从值' });
  ctx.upsertValuesKey(c, '态度', '', { type: 'child', parent: '服从值', rules: [{ min: 0, value: 'x' }] });
  const refDeps = ctx.getValuesChildKeysByRef(c, '服从值').map((key) => key.name).sort();
  assert(refDeps.join(',') === '态度,综合评分', '公式引用与区间派生都应列为依赖');
  assert(ctx.getValuesChildKeysByRef(c, '美貌值').length === 0, '未引用不误报');
});

runner.run();
