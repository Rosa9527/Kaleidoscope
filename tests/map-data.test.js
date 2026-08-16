// 万华镜地图系统数据层测试：
// 设定：地图与角色卡绑定（character.data.extensions.kaleidoscope_map，
// 随角色卡导入/导出携带），群聊 / 未选角色时回退全局设置 mapData。
// 回归要点（与变量系统同款深合并陷阱）：
// 1. 写卡立即落盘（不做防抖），刷新 / 退出不丢修改。
// 2. 宿主 merge-attributes 是深合并语义：删除字段必须用哨兵标记；
//    清空背景 → background 哨兵补丁；整张地图删除 → 整键哨兵。
'use strict';
const { readSources, loadInContext, createRunner, makeContext, makeCharacter } = require('./harness');

const UNSET = '__@@UNSET@@__';

// 宿主磁盘模拟（共享给 fetch mock：/api/characters/get 从 disk.card 构造响应）。
const hostState = { disk: null };
const sandbox = {
  console,
  AbortController: globalThis.AbortController,
  setTimeout, clearTimeout,
  fetch: async (url, options = {}) => {
    if (String(url).includes('/api/characters/get')) {
      const body = JSON.parse(options.body || '{}');
      const avatar = body.avatar_url || body.avatar || 'avatar-1.png';
      const fresh = makeCharacter('测试角色', avatar);
      const diskCard = hostState.disk && hostState.disk.card;
      if (diskCard) fresh.data.extensions.kaleidoscope_map = JSON.parse(JSON.stringify(diskCard));
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
  if (disk.card) character.data.extensions.kaleidoscope_map = JSON.parse(JSON.stringify(disk.card));
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async (index, key, value) => {
      disk.card = hostMerge(disk.card || {}, value);
    },
  });
  return c;
}

function sampleMap() {
  return {
    version: 1,
    background: 'data:image/png;base64,AAAA',
    points: [
      { id: 'p_1', name: '学校', x: 42.5, y: 63.1 },
      { id: 'p_2', name: '森林', x: 10, y: 20 },
    ],
    updatedAt: '2026-08-16T00:00:00.000Z',
  };
}

// 在角色卡上播种地图数据，同时写入磁盘（写卡对比以磁盘为基准）。
function seedMapCard(c, disk) {
  const card = sampleMap();
  c.characters[0].data.extensions.kaleidoscope_map = JSON.parse(JSON.stringify(card));
  if (disk) disk.card = JSON.parse(JSON.stringify(card));
}

// ---------- 读取 / 归一化 ----------
runner.test('无角色卡地图且无全局设置时 getMapBundle 返回 null', () => {
  const c = makeContext({});
  assert(ctx.getMapBundle(c) === null, '应返回 null（无地图可用）');
});

runner.test('归一化：坐标收敛到 0~100，非法地点丢弃，缺省字段补齐', () => {
  const card = {
    version: 1,
    points: [
      { id: 'ok', name: '学校', x: 150, y: -20 },
      { id: 'bad', x: 'abc', y: 5 },
      'not-a-point',
    ],
  };
  ctx.normalizeMapCard(card);
  assert(card.background === '', 'background 缺省应补空串');
  assert(card.points.length === 1, `非法地点应丢弃，实际 ${card.points.length}`);
  const point = card.points[0];
  assert(point.x === 100 && point.y === 0, `坐标应收敛，实际 ${point.x},${point.y}`);
  assert(point.id === 'ok' && point.name === '学校', '合法地点应保留');
});

runner.test('空地图判定：无背景且无地点', () => {
  assert(ctx.isEmptyMapCard(ctx.createEmptyMapCard()), '空包应为空地图');
  const card = sampleMap();
  assert(!ctx.isEmptyMapCard(card), '有背景 / 有地点不算空地图');
  card.background = '';
  assert(!ctx.isEmptyMapCard(card), '仅剩地点也不算空地图');
});

// ---------- 保存 / 持久化 ----------
runner.test('保存地图：立即写入角色卡（无防抖），内存卡为干净数据', async () => {
  const disk = {};
  const c = makeCtx(disk);
  await ctx.saveMapNow(c, sampleMap());
  assert(disk.card && disk.card.background === 'data:image/png;base64,AAAA', '背景图应已落盘');
  assert(disk.card.points.length === 2, '地点应已落盘');
  const memory = c.characters[0].data.extensions.kaleidoscope_map;
  assert(memory && !JSON.stringify(memory).includes(UNSET), '内存卡不得残留哨兵');
});

runner.test('保存后刷新 / 重进，地图数据保持（哨兵补丁不吞写）', async () => {
  const disk = {};
  const c = makeCtx(disk);
  await ctx.saveMapNow(c, sampleMap());
  const reloaded = reloadFromDisk(disk);
  const map = ctx.getMapBundle(reloaded);
  assert(map && map.background === 'data:image/png;base64,AAAA', '重进后背景图应保持');
  assert(map.points.length === 2, '重进后地点应保持');
});

runner.test('清空背景再保存：写卡补丁把 background 标记为哨兵，磁盘上该键被删除', async () => {
  const disk = {};
  const c = makeCtx(disk);
  seedMapCard(c, disk);
  const card = sampleMap();
  card.background = '';
  // 地点保留：只有 background 被清空（非空地图），走补丁路径而非整键删除。
  await ctx.saveMapNow(c, card);
  assert(disk.card && !('background' in disk.card), 'background 键应被哨兵删除');
  assert(disk.card.points.length === 2, '其余字段应保留');
  const reloaded = reloadFromDisk(disk);
  const map = ctx.getMapBundle(reloaded);
  assert(map && map.background === '' && map.points.length === 2, '重进后应无背景但保留地点');
});

runner.test('删除整张地图：写空包触发整键哨兵，磁盘字段消失', async () => {
  const disk = {};
  const c = makeCtx(disk);
  seedMapCard(c, disk);
  await ctx.saveMapNow(c, ctx.createEmptyMapCard());
  assert(disk.card === undefined || !('kaleidoscope_map' in disk.card), '整键哨兵后磁盘不应再有地图字段');
  const reloaded = reloadFromDisk(disk);
  assert(ctx.getMapCardData(reloaded) === null, '重进后角色卡不应有地图数据');
});

runner.test('群聊 / 未选角色：保存回退全局设置 mapData 并立即落盘', async () => {
  const disk = {};
  const c = makeContext({});
  c.saveSettings = () => {
    disk.settings = JSON.parse(JSON.stringify(c.extensionSettings));
  };
  await ctx.saveMapNow(c, sampleMap());
  const saved = c.extensionSettings.Kaleidoscope?.mapData;
  assert(saved && saved.background === 'data:image/png;base64,AAAA', '群聊下地图应写入全局设置');
  assert(disk.settings && disk.settings.Kaleidoscope.mapData.points.length === 2, '设置应已立即落盘');
  assert(ctx.getMapBundle(c)?.points.length === 2, '读回时应能拿到设置兜底数据');
});

// ---------- 写卡校验 ----------
// 写卡校验：harness 的 makeContext 不透传 getOneCharacter，手动挂载。
function makeVerifyCtx(disk) {
  const character = makeCharacter('测试角色', 'avatar-1.png');
  const c = makeContext({
    characters: [character],
    characterId: 0,
  });
  c.getOneCharacter = async (avatar) => {
    const fresh = makeCharacter('测试角色', avatar);
    if (disk.card) fresh.data.extensions.kaleidoscope_map = JSON.parse(JSON.stringify(disk.card));
    c.characters[0] = fresh;
  };
  return c;
}

runner.test('写卡校验：一致返回 true，磁盘被篡改返回 false', async () => {
  const disk = { card: JSON.parse(JSON.stringify(sampleMap())) };
  const c = makeVerifyCtx(disk);
  const ok = await ctx.verifyMapCardWrite(c, 'avatar-1.png', sampleMap());
  assert(ok === true, '磁盘一致时应校验通过');
  disk.card.points[0].name = '被篡改';
  const bad = await ctx.verifyMapCardWrite(c, 'avatar-1.png', sampleMap());
  assert(bad === false, '磁盘不一致时应校验失败');
});

runner.test('写卡校验：宿主重排键序（TauriTavern 实测）不误判', async () => {
  // 宿主序列化角色卡会重排对象键序（实测重读回来 background 排在 version 前）：
  // 用逆序重建磁盘卡，内容一致时应仍判成功。
  const original = sampleMap();
  const reordered = {};
  reordered.background = original.background;
  reordered.points = original.points.map((point) => {
    const p = {};
    p.y = point.y;
    p.x = point.x;
    p.name = point.name;
    p.id = point.id;
    return p;
  });
  reordered.updatedAt = original.updatedAt;
  reordered.version = original.version;
  const disk = { card: reordered };
  const c = makeVerifyCtx(disk);
  const ok = await ctx.verifyMapCardWrite(c, 'avatar-1.png', sampleMap());
  assert(ok === true, '键序不同的相同内容应校验通过');
});

runner.test('jsonDeepEqual：忽略键序、数组顺序敏感、原始值严格', () => {
  assert(ctx.jsonDeepEqual({ a: 1, b: { c: [1, 2] } }, { b: { c: [1, 2] }, a: 1 }) === true, '键序不同应相等');
  assert(ctx.jsonDeepEqual({ a: [1, 2] }, { a: [2, 1] }) === false, '数组顺序不同应不等');
  assert(ctx.jsonDeepEqual({ a: 1 }, { a: '1' }) === false, '数字与字符串不应相等');
  assert(ctx.jsonDeepEqual(null, null) === true, 'null 应相等');
  assert(ctx.jsonDeepEqual({ a: null }, { a: undefined }) === false, 'null 与 undefined 不应相等');
  assert(ctx.jsonDeepEqual(5, 5) === true, '原始值相等应通过');
});

runner.test('describeJsonDiff：指出第一个不一致字段', () => {
  const diff = ctx.describeJsonDiff({ version: 1, points: [{ id: 'p1', name: 'A', x: 1, y: 2 }] },
    { version: 1, points: [{ id: 'p1', name: 'A', x: 1, y: 3 }] });
  assert(diff.includes('points') && diff.includes('y'), '应指出 points 内的坐标差异');
  const missing = ctx.describeJsonDiff({ version: 1, points: [] }, { version: 1 });
  assert(missing.includes('+points') || missing.includes('-points'), '应指出字段增删');
  const length = ctx.describeJsonDiff({ points: [1] }, { points: [1, 2] });
  assert(length.includes('长度'), '应指出数组长度差异');
  assert(ctx.describeJsonDiff({ a: 1 }, { a: 1 }) === '', '一致时应无差异');
});

runner.test('删除地图后校验：磁盘无字段视为成功', async () => {
  const disk = {};
  const c = makeVerifyCtx(disk);
  const ok = await ctx.verifyMapCardWrite(c, 'avatar-1.png', UNSET);
  assert(ok === true, '删除后磁盘无字段应校验通过');
});

runner.test('写卡补丁：清空背景标记哨兵，其余字段整体携带', () => {
  const oldCard = sampleMap();
  const newCard = sampleMap();
  newCard.background = '';
  const patch = ctx.buildMapUnsetPatch(oldCard, newCard);
  assert(patch.background === UNSET, '清空的 background 应标记哨兵');
  assert(Array.isArray(patch.points), 'points 应整体携带');
});

runner.run();
