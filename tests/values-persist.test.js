// 万华镜变量系统持久化回归测试：
// 设定：默认数值与角色卡绑定（character.data.extensions.kaleidoscope_values，
// 随角色卡导入/导出携带），游戏数值与聊天文件绑定。
// 回归场景：删除默认值后刷新 / 退出酒馆重进，被删内容从磁盘旧数据回滚。
// 根因（两层）：
// 1. 写入角色卡走 500ms 防抖 setTimeout，防抖窗口内刷新 / 退出即丢失写入。
//    → 删除 / 修改直接落盘（不做防抖）。
// 2. 宿主 merge-attributes 是深合并语义：只更新请求里出现的键，请求里没有的
//    键原样保留；删除操作必须把「磁盘上有、新 bundle 里没有」的键标记为
//    __@@UNSET@@__ 哨兵，宿主才会真正删除。否则 merge 返回 ok:true 但角色卡
//    从未改变（写盘短路跳过），删除的内容刷新后又出现。
//    → 写卡前从磁盘重读旧值，生成带哨兵的补丁再发送。
'use strict';
const { readSources, loadInContext, createRunner, makeContext, makeCharacter } = require('./harness');

const UNSET = '__@@UNSET@@__';

let timerSeq = 0;
let pendingTimers = [];
// 宿主磁盘模拟（共享给 fetch mock：/api/characters/get 从 disk.card 构造响应）。
const hostState = { disk: null };
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
  // 模拟宿主 /api/characters/get：返回磁盘上当前角色（readValuesCardFromDisk
  // 走 fetch 分支，不替换内存 characters 数组，与真实 TauriTavern 一致）。
  fetch: async (url, options = {}) => {
    if (String(url).includes('/api/characters/get')) {
      const body = JSON.parse(options.body || '{}');
      const avatar = body.avatar_url || body.avatar || 'avatar-1.png';
      const fresh = makeCharacter('测试角色', avatar);
      const diskCard = hostState.disk && hostState.disk.card;
      if (diskCard) {
        fresh.data.extensions.kaleidoscope_values = JSON.parse(JSON.stringify(diskCard));
      }
      return { ok: true, json: async () => fresh };
    }
    return { ok: false, status: 404 };
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

// 模拟宿主 merge-attributes 的深合并语义（TauriTavern merge_json_value_with_unset）：
// 对象逐键合并，哨兵值删除键，数组 / 标量整体替换。写卡落盘 = 合并后的结果。
function hostMerge(current, updates) {
  if (updates === UNSET) return undefined;
  if (current && typeof current === 'object' && !Array.isArray(current)
    && updates && typeof updates === 'object' && !Array.isArray(updates)) {
    const result = JSON.parse(JSON.stringify(current));
    for (const key of Object.keys(updates)) {
      if (updates[key] === UNSET) {
        delete result[key];
        continue;
      }
      const merged = hostMerge(result[key], updates[key]);
      if (merged === undefined) delete result[key];
      else result[key] = merged;
    }
    return result;
  }
  return JSON.parse(JSON.stringify(updates));
}

// 模拟宿主写角色卡：writeExtensionField 走真实宿主链路（深合并 + 落盘）。
function makeCtx(disk) {
  hostState.disk = disk;
  const character = makeCharacter('测试角色', 'avatar-1.png');
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async (index, key, value) => {
      disk.card = hostMerge(disk.card || {}, value);
    },
  });
  c.saveSettings = () => {
    disk.settings = JSON.parse(JSON.stringify(c.extensionSettings));
  };
  return c;
}

// 「刷新 / 重进」：角色卡从磁盘重新加载，扩展内存态全部重建。
function reloadFromDisk(disk) {
  const character = makeCharacter('测试角色', 'avatar-1.png');
  if (disk.card) character.data.extensions.kaleidoscope_values = JSON.parse(JSON.stringify(disk.card));
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async (index, key, value) => {
      disk.card = hostMerge(disk.card || {}, value);
    },
  });
  return c;
}

// 在角色卡上播种旧数据（如 02:29 那次写入残留的 张三 / 李四）；
// 同时写入磁盘（模拟旧数据早已落盘，删除时以磁盘为基准生成哨兵补丁）。
function seedCardDefaults(c, disk) {
  const card = {
    version: 1,
    keys: [{ name: '友谊', type: 'parent', rule: '规则' }],
    defaults: { 张三: { 友谊: 100 }, 李四: { 友谊: 50 } },
    inject: { enabled: false, paths: [] },
    triggers: [],
    order: {},
  };
  c.characters[0].data.extensions.kaleidoscope_values = JSON.parse(JSON.stringify(card));
  if (disk) disk.card = JSON.parse(JSON.stringify(card));
}

async function deleteAllDefaults(c) {
  const defaults = ctx.getValuesDefaults(c);
  for (const key of Object.keys(defaults)) ctx.valuesDeleteAtPath(defaults, [key]);
  await ctx.saveValuesData(c);
}

runner.test('删除默认值应立即写角色卡（无防抖窗口，不依赖定时器）', async () => {
  const disk = {};
  const c = makeCtx(disk);
  seedCardDefaults(c, disk);
  await deleteAllDefaults(c);
  // 立即写入：saveValuesData 同步发起写卡，无需等待任何定时器
  assert(disk.card && typeof disk.card === 'object', '删除后应立即落盘角色卡');
  assert(Object.keys(disk.card.defaults || {}).length === 0, `删除后角色卡默认值应为空，实际: ${JSON.stringify(disk.card.defaults)}`);
});

runner.test('删除后刷新 / 重进，被删默认值不应回滚（核心回归：深合并宿主下哨兵删除）', async () => {
  const disk = {};
  const c = makeCtx(disk);
  seedCardDefaults(c, disk);
  await deleteAllDefaults(c);
  const reloaded = reloadFromDisk(disk);
  const restored = ctx.getValuesDefaults(reloaded);
  assert(Object.keys(restored).length === 0, `刷新后默认值应保持为空，实际恢复了: ${JSON.stringify(restored)}`);
});

runner.test('快速连续删除：最后一次写入包含最终状态', async () => {
  const disk = {};
  const c = makeCtx(disk);
  seedCardDefaults(c, disk);
  const defaults = ctx.getValuesDefaults(c);
  ctx.valuesDeleteAtPath(defaults, ['张三']);
  await ctx.saveValuesData(c);
  ctx.valuesDeleteAtPath(defaults, ['李四']);
  await ctx.saveValuesData(c);
  await flushTimers();
  const finalCard = disk.card;
  assert(finalCard && Object.keys(finalCard.defaults || {}).length === 0, '最后一次写入应为空树');
});

runner.test('角色卡绑定恢复：卡上有数据时优先读角色卡，不回退全局设置', async () => {
  const disk = {};
  const c = makeCtx(disk);
  seedCardDefaults(c);
  // 全局设置里有另一份旧数据（上一轮修复残留）：有卡时不得读它
  c.extensionSettings.Kaleidoscope = {
    valuesData: {
      version: 1,
      keys: [],
      defaults: { 测试: {} },
      inject: {},
      triggers: [],
      order: {},
    },
  };
  const defaults = ctx.getValuesDefaults(c);
  assert(defaults.张三 && defaults.李四, '默认值应来自角色卡（张三/李四），而不是全局设置');
  assert(!defaults.测试, '全局设置的数据不得串入当前角色卡');
});

runner.test('群聊 / 未选角色：回退全局设置 valuesData 并立即保存', async () => {
  const disk = {};
  const c = makeContext({});
  c.saveSettings = () => {
    disk.settings = JSON.parse(JSON.stringify(c.extensionSettings));
  };
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  ctx.saveValuesData(c);
  const saved = c.extensionSettings.Kaleidoscope?.valuesData;
  assert(saved && saved.defaults && saved.defaults.金钱 === 1000, '群聊下默认值应写入全局设置');
  assert(disk.settings && disk.settings.Kaleidoscope.valuesData.defaults.金钱 === 1000, '设置应已立即落盘');
});

runner.test('写卡失败（宿主异常）→ 回退全局设置，数据不丢', async () => {
  const character = makeCharacter('测试角色', 'avatar-1.png');
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async () => { throw new Error('宿主写卡失败'); },
  });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  ctx.saveValuesData(c);
  const saved = c.extensionSettings.Kaleidoscope?.valuesData;
  assert(saved && saved.defaults && saved.defaults.金钱 === 1000, '写卡失败时应回退全局设置');
});

runner.test('剧情脉络同款：新增 / 删除节点立即写角色卡，刷新不回滚', async () => {
  const disk = {};
  const c = makeCtx(disk);
  const node = ctx.createStoryNode(c, { name: '第一章' });
  assert(disk.card && disk.card.nodes.some((item) => item.id === node.id), '新增节点应立即落盘角色卡');
  ctx.deleteStoryNode(c, node.id);
  const reloaded = reloadFromDisk(disk);
  const nodes = ctx.getStoryNodes(reloaded);
  assert(nodes.length === 0, `删除节点后刷新不应恢复，实际: ${JSON.stringify(nodes)}`);
});

// ---------- 深合并宿主：删除必须用哨兵标记 ----------
runner.test('深合并宿主：删除单个角色 → 写卡补丁带哨兵，磁盘真正删除', async () => {
  const disk = {};
  const c = makeCtx(disk);
  seedCardDefaults(c, disk);
  const defaults = ctx.getValuesDefaults(c);
  ctx.valuesDeleteAtPath(defaults, ['李四']);
  await ctx.saveValuesData(c);
  assert(disk.card && disk.card.defaults && !disk.card.defaults.李四, '李四应从磁盘删除');
  assert(disk.card.defaults.张三 && disk.card.defaults.张三.友谊 === 100, '张三应原样保留');
});

runner.test('深合并宿主：删除全部 → 磁盘 defaults 清空', async () => {
  const disk = {};
  const c = makeCtx(disk);
  seedCardDefaults(c, disk);
  const defaults = ctx.getValuesDefaults(c);
  ctx.valuesDeleteAtPath(defaults, ['张三']);
  await ctx.saveValuesData(c);
  ctx.valuesDeleteAtPath(defaults, ['李四']);
  await ctx.saveValuesData(c);
  await flushTimers();
  assert(disk.card && Object.keys(disk.card.defaults || {}).length === 0, '磁盘 defaults 应为空');
});

runner.test('深合并宿主：修改值只覆盖变更键，不误删其他角色', async () => {
  const disk = {};
  const c = makeCtx(disk);
  seedCardDefaults(c, disk);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['张三', '友谊'], 200);
  await ctx.saveValuesData(c);
  assert(disk.card.defaults.张三.友谊 === 200, '修改的值应落盘');
  assert(disk.card.defaults.李四 && disk.card.defaults.李四.友谊 === 50, '未修改的角色应原样保留');
});

// ---------- 保存按钮：写卡校验（把宿主的静默写失败变成可见反馈） ----------
// 模拟宿主从磁盘重读角色卡（TauriTavern getOneCharacter → /api/characters/get，
// 返回磁盘上的真实数据并替换内存角色）。
function makeVerifyCtx(disk, { swallowWrite = false } = {}) {
  hostState.disk = disk;
  const character = makeCharacter('测试角色', 'avatar-1.png');
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: swallowWrite
      ? async () => { /* 静默失败：既不落盘也不抛错（宿主吞掉 4xx/5xx） */ }
      : async (index, key, value) => {
        disk.card = hostMerge(disk.card || {}, value);
      },
  });
  c.getOneCharacter = async (avatar) => {
    const fresh = makeCharacter('测试角色', 'avatar-1.png');
    if (disk.card) fresh.data.extensions.kaleidoscope_values = JSON.parse(JSON.stringify(disk.card));
    c.characters[0] = fresh;
  };
  return c;
}

runner.test('保存校验：写卡成功 → 从磁盘重读一致，返回 true', async () => {
  const disk = {};
  const c = makeVerifyCtx(disk);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  await ctx.saveValuesData(c);
  const bundle = ctx.getValuesBundle(c);
  const verified = await ctx.verifyValuesCardWrite(c, 'avatar-1.png', bundle);
  assert(verified === true, '写卡成功时校验应通过');
});

runner.test('保存校验：宿主静默吞掉写入 → 从磁盘重读不一致，返回 false', async () => {
  const disk = {};
  const c = makeVerifyCtx(disk, { swallowWrite: true });
  // 磁盘上已有旧数据（本次写入被吞掉时读到的就是它）
  c.characters[0].data.extensions.kaleidoscope_values = {
    version: 1, keys: [], defaults: { 旧: {} }, inject: {}, triggers: [], order: {},
  };
  disk.card = JSON.parse(JSON.stringify(c.characters[0].data.extensions.kaleidoscope_values));
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['新'], 1);
  await ctx.saveValuesData(c);
  const bundle = ctx.getValuesBundle(c);
  const verified = await ctx.verifyValuesCardWrite(c, 'avatar-1.png', bundle);
  assert(verified === false, '宿主吞掉写入时校验应失败');
});

runner.test('保存校验：宿主不支持从磁盘重读 → 返回 null（无法校验）', async () => {
  const character = makeCharacter('测试角色', 'avatar-1.png');
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async () => {},
  });
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  await ctx.saveValuesData(c);
  const bundle = ctx.getValuesBundle(c);
  const verified = await ctx.verifyValuesCardWrite(c, 'avatar-1.png', bundle);
  assert(verified === null, '宿主不支持重读时校验应返回 null');
});

// ---------- 校验读取形状兼容（TauriTavern get 响应为展平结构） ----------
runner.test('保存校验：get 响应为展平结构（顶层 extensions，无 data 字段）也能读到', async () => {
  const disk = {};
  const c = makeVerifyCtx(disk);
  ctx.valuesSetAtPath(ctx.getValuesDefaults(c), ['金钱'], 1000);
  await ctx.saveValuesData(c);
  const bundle = ctx.getValuesBundle(c);
  // 展平响应：顶层 extensions 直接放扩展键（TauriTavern CharacterDto 形状）
  c.getOneCharacter = async (avatar) => {
    const fresh = { name: '测试角色', avatar: 'avatar-1.png', extensions: {} };
    if (disk.card) fresh.extensions.kaleidoscope_values = JSON.parse(JSON.stringify(disk.card));
    c.characters[0] = fresh;
  };
  const verified = await ctx.verifyValuesCardWrite(c, 'avatar-1.png', bundle);
  assert(verified === true, '展平响应下校验也应通过');
});

runner.run().then((ok) => {
  if (!ok) process.exitCode = 1;
});
