// 万华镜开发测试：提示词预设（剧情预筛 + 变量维护 的一套具名配置）。
// 覆盖：角色卡绑定读写、全局设置兜底、防串卡、激活/删除/另存、
// 生效文本解析（默认预设兼容旧全局自定义）、YAML 导入导出往返与校验。
// 常量在 vm 沙箱内是 global lexical binding，外部取不到 → 断言用字面量 /
// getPromptPresetFactoryText（与 values.test.js 用字面量同款约定）。
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

const CARD_KEY = 'kaleidoscope_prompt_presets';
const DEFAULT_ID = '__default__';
const DEFAULT_NAME = '默认预设';
const BUNDLE_FORMAT = 'kaleidoscope-prompt-preset';

async function flushTimers() {
  const timers = pendingTimers.splice(0);
  for (const timer of timers) timer.fn();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function fresh() {
  return makeContext();
}

function makeCardCtx() {
  const writes = [];
  const character = makeCharacter('测试角色', 'avatar-1');
  const c = makeContext({ characters: [character], characterId: 0, writeExtensionField: (index, key, value) => {
    writes.push({ index, key, value: JSON.parse(JSON.stringify(value)) });
    return Promise.resolve();
  } });
  return { c, writes, character };
}

function makeBrokenWriteCtx() {
  return makeContext({
    characters: [makeCharacter('坏卡', 'bad.png')],
    characterId: 0,
    writeExtensionField: () => Promise.reject(new Error('宿主写入失败')),
  });
}

// ---------- 生效文本解析 ----------
runner.test('默认状态：无任何数据时激活内置默认预设，提示词取出厂默认', () => {
  const c = fresh();
  assert(ctx.getActivePromptPresetId(c) === DEFAULT_ID, '激活 id 应为内置默认');
  assert(ctx.getActivePromptPresetName(c) === DEFAULT_NAME, '激活名应为「默认预设」');
  assert(ctx.getEffectivePromptText(c, 'storyGate') === ctx.getPromptPresetFactoryText('storyGate'), '剧情预筛应取出厂默认');
  assert(ctx.getEffectivePromptText(c, 'valuesMaintain') === ctx.getPromptPresetFactoryText('valuesMaintain'), '变量维护应取出厂默认');
});

runner.test('内置默认预设路径：直接保存写全局 settings（旧习惯兼容），旧自定义继续生效', () => {
  const c = fresh();
  ctx.savePromptPresetText(c, 'storyGate', '自定义预筛提示词');
  const settings = c.extensionSettings.Kaleidoscope;
  assert(settings.storyGatePrompt === '自定义预筛提示词', '应写全局 settings.storyGatePrompt');
  assert(ctx.getEffectivePromptText(c, 'storyGate') === '自定义预筛提示词', '生效文本应等于旧全局自定义');
  // 恢复默认：写空串回到出厂默认。
  ctx.savePromptPresetText(c, 'storyGate', '');
  assert(ctx.getEffectivePromptText(c, 'storyGate') === ctx.getPromptPresetFactoryText('storyGate'), '空串应回退出厂默认');
});

runner.test('激活自定义预设后生效文本取预设内内容（消费端读取）', () => {
  const { c } = makeCardCtx();
  ctx.createPromptPreset(c, '高精度版', { storyGatePrompt: '预筛 v2', valuesMaintainPrompt: '维护 v2' });
  assert(ctx.getStoryGatePrompt(c) === '预筛 v2', '剧情预筛应取预设内文本');
  assert(ctx.getValuesMaintainPrompt(c) === '维护 v2', '变量维护应取预设内文本');
  // 预设内空串回退出厂默认。
  const card = c.characters[0].data.extensions[CARD_KEY];
  card.presets[0].storyGatePrompt = '';
  assert(ctx.getEffectivePromptText(c, 'storyGate') === ctx.getPromptPresetFactoryText('storyGate'), '预设内空串应回退出厂默认');
  assert(ctx.getEffectivePromptText(c, 'valuesMaintain') === '维护 v2', '另一组不受影响');
});

// ---------- 角色卡绑定 ----------
runner.test('另存预设写入角色卡 extensions 并激活（立即写卡）', async () => {
  const { c, writes } = makeCardCtx();
  const preset = ctx.createPromptPreset(c, 'RP增强版', { storyGatePrompt: 'A 提示词', valuesMaintainPrompt: 'B 提示词' });
  assert(preset.name === 'RP增强版', '预设名不符');
  const card = c.characters[0].data.extensions[CARD_KEY];
  assert(card, '角色卡上应有预设容器');
  assert(Array.isArray(card.presets) && card.presets.length === 1, '卡上应有 1 个自定义预设');
  assert(card.presets[0].name === 'RP增强版' && card.presets[0].storyGatePrompt === 'A 提示词', '预设内容不完整');
  assert(card.presets[0].valuesMaintainPrompt === 'B 提示词', '两组提示词都应保存');
  assert(card.activeId === preset.id, '另存后应自动激活新预设');
  await flushTimers();
  assert(writes.length === 1, '应触发一次 writeExtensionField 立即写卡');
  assert(writes[0].key === CARD_KEY, '写卡键名错误');
});

runner.test('保存到激活预设：写预设内字段并立即写卡', async () => {
  const { c, writes } = makeCardCtx();
  ctx.createPromptPreset(c, '保存目标', { storyGatePrompt: '旧', valuesMaintainPrompt: '旧' });
  ctx.savePromptPresetText(c, 'storyGate', '新预筛文本');
  const card = c.characters[0].data.extensions[CARD_KEY];
  assert(card.presets[0].storyGatePrompt === '新预筛文本', '预筛字段应更新');
  assert(card.presets[0].valuesMaintainPrompt === '旧', '未编辑的另一组不受影响');
  await flushTimers();
  assert(writes.length >= 1, '应立即写卡');
});

runner.test('防串卡：有角色但卡上无数据 → 预设列表为空、激活内置默认（不读全局）', () => {
  const { c } = makeCardCtx();
  // 全局 settings 里有别的预设（模拟其他角色的旧数据）。
  c.extensionSettings.Kaleidoscope = {
    promptPresets: [{ id: 'kaleido-preset-x', name: '别人的预设', storyGatePrompt: 'X', valuesMaintainPrompt: 'Y' }],
    promptPresetsActiveId: 'kaleido-preset-x',
  };
  assert(ctx.getCustomPromptPresets(c).length === 0, '卡上无数据时应返回空数组');
  assert(ctx.getActivePromptPresetId(c) === DEFAULT_ID, '激活应回退内置默认');
  assert(ctx.getEffectivePromptText(c, 'storyGate') === ctx.getPromptPresetFactoryText('storyGate'), '应回退出厂默认文本');
});

runner.test('无角色（群聊）：预设走全局 settings 兜底路径', () => {
  const c = fresh();
  const preset = ctx.createPromptPreset(c, '全局预设', { storyGatePrompt: 'g1', valuesMaintainPrompt: 'g2' });
  const settings = c.extensionSettings.Kaleidoscope;
  assert(Array.isArray(settings.promptPresets) && settings.promptPresets.length === 1, '应写入全局 settings');
  assert(settings.promptPresetsActiveId === preset.id, '应激活新预设');
  assert(ctx.getEffectivePromptText(c, 'storyGate') === 'g1', '预筛生效文本应取新预设');
  assert(ctx.getEffectivePromptText(c, 'valuesMaintain') === 'g2', '维护生效文本应取新预设');
});

// ---------- 生命周期：切换 / 删除 ----------
runner.test('切换 + 删除：完整生命周期（角色卡路径）', () => {
  const { c } = makeCardCtx();
  const preset = ctx.createPromptPreset(c, 'RP增强版', { storyGatePrompt: 'A', valuesMaintainPrompt: 'B' });
  assert(ctx.getActivePromptPresetId(c) === preset.id, '另存后应激活');
  ctx.setActivePromptPreset(c, DEFAULT_ID);
  assert(ctx.getActivePromptPresetId(c) === DEFAULT_ID, '应切回内置默认');
  assert(ctx.getEffectivePromptText(c, 'storyGate') === ctx.getPromptPresetFactoryText('storyGate'), '切回默认应回退出厂文本');
  ctx.setActivePromptPreset(c, preset.id);
  assert(ctx.getActivePromptPresetName(c) === 'RP增强版', '激活名应更新');
  assert(ctx.deletePromptPreset(c, preset.id) === true, '删除应成功');
  assert(ctx.getActivePromptPresetId(c) === DEFAULT_ID, '删除激活预设后应回退内置默认');
  assert(ctx.getCustomPromptPresets(c).length === 0, '删除后列表应为空');
});

runner.test('切换预设不复制文本：各自持有完整内容', () => {
  const { c } = makeCardCtx();
  const a = ctx.createPromptPreset(c, 'A', { storyGatePrompt: '预筛A', valuesMaintainPrompt: '维护A' });
  ctx.savePromptPresetText(c, 'storyGate', '预筛A-改');
  ctx.setActivePromptPreset(c, DEFAULT_ID);
  const b = ctx.createPromptPreset(c, 'B', { storyGatePrompt: '预筛B', valuesMaintainPrompt: '维护B' });
  ctx.setActivePromptPreset(c, a.id);
  assert(ctx.getEffectivePromptText(c, 'storyGate') === '预筛A-改', '切回 A 应看到 A 自己的文本');
  ctx.setActivePromptPreset(c, b.id);
  assert(ctx.getEffectivePromptText(c, 'storyGate') === '预筛B', '切到 B 应看到 B 的文本');
});

runner.test('删除：内置默认不可删除，激活未知 id 回退默认', () => {
  const { c } = makeCardCtx();
  assert(ctx.deletePromptPreset(c, DEFAULT_ID) === false, '内置默认不应可删除');
  assert(ctx.deletePromptPreset(c, '不存在') === false, '删除不存在的预设应返回 false');
  // activeId 指向不存在的预设时解析回退内置默认。
  const card = ctx.ensurePromptPresetCardData(c);
  card.activeId = 'ghost-id';
  const resolved = ctx.resolveActivePromptPreset(c);
  assert(resolved.id === DEFAULT_ID, '失效 id 应回退内置默认');
});

// ---------- 写卡失败兜底 ----------
runner.test('写入失败回退全局设置（writeExtensionField reject）', async () => {
  const c = makeContext({
    characters: [makeCharacter('坏卡', 'bad.png')],
    characterId: 0,
    writeExtensionField: () => Promise.reject(new Error('宿主写入失败')),
  });
  const preset = ctx.createPromptPreset(c, '兜底预设', { storyGatePrompt: 'a', valuesMaintainPrompt: 'b' });
  await flushTimers();
  const settings = c.extensionSettings.Kaleidoscope;
  assert(Array.isArray(settings.promptPresets) && settings.promptPresets.length === 1, '写卡失败应回退全局 settings.promptPresets');
  assert(settings.promptPresets[0].name === '兜底预设', '回退数据应完整');
  assert(settings.promptPresetsActiveId === preset.id, '回退后激活 id 完整');
});

// ---------- YAML 导入导出 ----------
runner.test('YAML 导入导出往返：name + 两组提示词（含换行与空串）', () => {
  const preset = { name: '往返测试\n第二行', storyGatePrompt: '线1\n线2', valuesMaintainPrompt: '' };
  const yaml = ctx.serializePromptPresetBundle(preset);
  assert(yaml.includes(`format: ${BUNDLE_FORMAT}`), '导出应带 format 标记');
  const parsed = ctx.parsePromptPresetBundle(yaml);
  assert(parsed.name === '往返测试\n第二行', '往返后 name 应一致');
  assert(parsed.storyGatePrompt === '线1\n线2', '往返后预筛文本应一致');
  assert(parsed.valuesMaintainPrompt === '', '往返后维护文本应一致（空串保留）');
});

runner.test('导出文件名：带前缀与 .yaml，无非法字符', () => {
  const filename = ctx.buildPromptPresetBundleFilename({ name: '我的/预设: v2' });
  assert(filename.startsWith('万华镜-提示词预设-'), '导出文件名应带前缀');
  assert(filename.endsWith('.yaml'), '导出文件名应为 .yaml');
  const body = filename.replace(/^万华镜-提示词预设-/, '').replace(/\.yaml$/, '');
  assert(!/[\\/:*?"<>|]/.test(body), '文件名不应含非法字符');
});

runner.test('导入校验：format 不符 / 缺 name / 缺提示词字段均报错', () => {
  const cases = [
    { text: 'format: 其他格式\nname: X\nstoryGatePrompt: ""\nvaluesMaintainPrompt: ""', expect: 'format' },
    { text: 'format: kaleidoscope-prompt-preset\nstoryGatePrompt: ""\nvaluesMaintainPrompt: ""', expect: 'name' },
    { text: 'format: kaleidoscope-prompt-preset\nname: 测试\nstoryGatePrompt: "只有一组"', expect: 'valuesMaintainPrompt' },
  ];
  for (const item of cases) {
    let threw = null;
    try { ctx.parsePromptPresetBundle(item.text); } catch (error) { threw = error; }
    assert(threw, `应报错：${item.expect}`);
    assert(String(threw.message).includes(item.expect), `错误信息应含「${item.expect}」`);
  }
});

runner.test('导入写卡并激活：同名自动去重编号', () => {
  const { c } = makeCardCtx();
  const first = ctx.importPromptPreset(c, { name: '导入预设', storyGatePrompt: 'a', valuesMaintainPrompt: 'b' });
  assert(first.name === '导入预设', '首个导入保留原名');
  const second = ctx.importPromptPreset(c, { name: '导入预设', storyGatePrompt: 'c', valuesMaintainPrompt: 'd' });
  assert(second.name === '导入预设(2)', '同名导入应自动编号');
  const card = c.characters[0].data.extensions[CARD_KEY];
  assert(card.presets.length === 2, '应导入两个预设');
  assert(card.activeId === second.id, '导入后应激活最新导入');
});

runner.run();