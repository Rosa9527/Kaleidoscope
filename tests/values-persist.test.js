// 万华镜变量系统持久化回归测试：
// TauriTavern 宿主下「默认值删除后刷新恢复」——角色卡写入路径静默失败 +
// 宿主设置保存防抖被刷新打断时，旧数据会从磁盘重新加载。
// 修复：TauriTavern 跳过不可靠的角色卡写入，默认值直存全局设置并立即保存，
// 同时镜像到聊天文件（随 saveChat 即时落盘，刷新不丢）。
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

// 模拟 TauriTavern 宿主：
// - window.__TAURITAVERN__ 存在（宿主 ABI 标记）；
// - writeExtensionField 存在但「静默失败」：不落盘、不抛错（宿主吞掉 4xx）；
// - saveSettingsDebounced 模拟宿主 1s 防抖：仅 flushSettings() 写盘
//   （页面刷新会打断 pending 写入，模拟真实刷新丢写）；
// - saveChat 即时写「聊天文件」（disk.chatMetadata），与真实宿主一致。
function makeTauriCtx(disk) {
  const character = makeCharacter('测试角色', 'avatar-1.png');
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async () => { /* 静默吞掉：既不落盘也不抛错 */ },
  });
  c.chatMetadata = {};
  c.saveChat = () => {
    disk.chatMetadata = JSON.parse(JSON.stringify(c.chatMetadata));
  };
  c.saveSettingsDebounced = () => { c.__settingsPending = true; };
  c.saveSettings = () => { disk.settings = JSON.parse(JSON.stringify(c.extensionSettings)); };
  c.flushSettings = () => {
    if (c.__settingsPending) {
      disk.settings = JSON.parse(JSON.stringify(c.extensionSettings));
      c.__settingsPending = false;
    }
  };
  return c;
}

// 「刷新」：新建上下文，设置与聊天元数据从磁盘快照重新加载。
function reloadFromDisk(disk) {
  const c = makeTauriCtx(disk);
  c.extensionSettings = JSON.parse(JSON.stringify(disk.settings || {}));
  c.chatMetadata = JSON.parse(JSON.stringify(disk.chatMetadata || {}));
  return c;
}

function seedOldDefaults(c) {
  c.extensionSettings.Kaleidoscope = {
    ...(c.extensionSettings.Kaleidoscope || {}),
    valuesData: {
      version: 1,
      keys: [{ name: '友谊', type: 'parent', rule: '规则' }],
      defaults: { 张三: { 友谊: 100 } },
      inject: { enabled: false, paths: [] },
      triggers: [],
      order: {},
    },
  };
}

function deleteAllDefaults(c) {
  const defaults = ctx.getValuesDefaults(c);
  for (const key of Object.keys(defaults)) ctx.valuesDeleteAtPath(defaults, [key]);
  ctx.saveValuesActiveTree(c, defaults);
}

runner.test('TauriTavern：删除默认值应写入全局设置镜像（不落卡、不置 null）', async () => {
  sandbox.__TAURITAVERN__ = { ready: Promise.resolve() };
  try {
    const disk = {};
    const c = makeTauriCtx(disk);
    seedOldDefaults(c);
    c.saveSettings(); // 旧数据已落盘
    deleteAllDefaults(c);
    await flushTimers();
    const mirror = c.extensionSettings.Kaleidoscope?.valuesData;
    assert(mirror && typeof mirror === 'object', 'TauriTavern 下全局设置镜像应保留（不应被迁移置 null）');
    assert(Object.keys(mirror.defaults || {}).length === 0, '设置镜像的默认值应立即为空');
  } finally {
    delete sandbox.__TAURITAVERN__;
  }
});

runner.test('TauriTavern：删除默认值应立即镜像到聊天文件（即时落盘）', async () => {
  sandbox.__TAURITAVERN__ = { ready: Promise.resolve() };
  try {
    const disk = {};
    const c = makeTauriCtx(disk);
    seedOldDefaults(c);
    c.saveSettings();
    deleteAllDefaults(c);
    await flushTimers();
    const chatBundle = c.chatMetadata.kaleidoscope_values_bundle;
    assert(chatBundle && typeof chatBundle === 'object', '聊天元数据应写入变量包镜像');
    assert(Object.keys(chatBundle.defaults || {}).length === 0, '聊天镜像的默认值应立即为空');
    const onDisk = disk.chatMetadata.kaleidoscope_values_bundle;
    assert(onDisk && Object.keys(onDisk.defaults || {}).length === 0, '聊天文件落盘后镜像应为空');
  } finally {
    delete sandbox.__TAURITAVERN__;
  }
});

runner.test('TauriTavern：设置防抖被刷新打断时，刷新不应恢复已删除的默认值', async () => {
  sandbox.__TAURITAVERN__ = { ready: Promise.resolve() };
  try {
    const disk = {};
    const c = makeTauriCtx(disk);
    seedOldDefaults(c);
    c.saveSettings(); // 旧数据已落盘
    deleteAllDefaults(c);
    await flushTimers();
    // 宿主设置防抖未及落盘即刷新（pending 丢失）；聊天镜像已即时落盘
    const reloaded = reloadFromDisk(disk);
    const restored = ctx.getValuesDefaults(reloaded);
    assert(Object.keys(restored).length === 0, `刷新后默认值应保持为空，实际恢复了: ${JSON.stringify(restored)}`);
  } finally {
    delete sandbox.__TAURITAVERN__;
  }
});

runner.test('TauriTavern：宿主防抖落盘后刷新也应保持为空（对照）', async () => {
  sandbox.__TAURITAVERN__ = { ready: Promise.resolve() };
  try {
    const disk = {};
    const c = makeTauriCtx(disk);
    seedOldDefaults(c);
    c.saveSettings();
    deleteAllDefaults(c);
    await flushTimers();
    c.flushSettings(); // 宿主设置防抖正常落盘
    const reloaded = reloadFromDisk(disk);
    const restored = ctx.getValuesDefaults(reloaded);
    assert(Object.keys(restored).length === 0, '落盘后刷新应保持为空');
  } finally {
    delete sandbox.__TAURITAVERN__;
  }
});

runner.test('TauriTavern：角色卡有旧数据时读取应跳过角色卡（删除后不回滚）', async () => {
  sandbox.__TAURITAVERN__ = { ready: Promise.resolve() };
  try {
    const disk = {};
    const c = makeTauriCtx(disk);
    // 角色卡里有旧数据（历史残留——之前某次写入或导入留下的）
    const character = c.characters[0];
    character.data.extensions.kaleidoscope_values = {
      version: 1,
      keys: [{ name: '友谊', type: 'parent', rule: '规则' }],
      defaults: { 张三: { 友谊: 100 } },
      inject: { enabled: false, paths: [] },
      triggers: [],
      order: {},
    };
    // 全局设置为空（用户已删除）
    c.extensionSettings.Kaleidoscope = { valuesData: { version: 1, keys: [], defaults: {}, inject: {}, triggers: [], order: {} } };
    c.chatMetadata = { kaleidoscope_values_bundle: { version: 1, keys: [], defaults: {}, inject: {}, triggers: [], order: {} } };
    // TauriTavern 下读取应跳过角色卡，从全局设置/聊天镜像取（都为空）
    const defaults = ctx.getValuesDefaults(c);
    assert(Object.keys(defaults).length === 0, `角色卡有旧数据时 TauriTavern 应跳过角色卡，实际读到: ${JSON.stringify(defaults)}`);
  } finally {
    delete sandbox.__TAURITAVERN__;
  }
});

runner.test('标准宿主（无 __TAURITAVERN__）：角色卡写入路径行为不变', async () => {
  const writes = [];
  const character = makeCharacter('测试角色', 'avatar-1');
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: (index, key, value) => {
      writes.push({ index, key, value });
      return Promise.resolve();
    },
  });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  ctx.saveValuesData(c);
  await flushTimers();
  assert(writes.length === 1, '标准宿主应仍走角色卡写入');
  assert(writes[0].value.defaults['金钱'] === 1000, '角色卡应包含最新默认值');
});

runner.run().then((ok) => {
  if (!ok) process.exitCode = 1;
});
