// ===== 万华镜（Kaleidoscope）地图系统：数据模型 / 角色卡绑定 / 设置兜底 =====
// 地图数据：一张背景图（裁剪后的 base64 PNG）+ 若干地点（名称 + 百分比坐标）。
// 与变量系统同款双层存储：
// - 主存：角色卡 extensions['kaleidoscope_map']，随角色卡导入/导出自动携带；
// - 兜底：群聊 / 未选角色 / 宿主不支持写角色卡时落全局设置 mapData。
// 写卡遵循宿主深合并语义：删除字段必须用哨兵值显式标记（同 VALUES_UNSET_SENTINEL），
// 否则删除操作会被合并吞掉（TauriTavern 实测）。地点坐标一律按背景图百分比
// （0~100）存取，展示与编辑按比例缩放对齐，换背景图不丢坐标。

// ---------- 数据归一化 ----------
function mapClampCoord(value) {
  const v = Number(value);
  if (!Number.isFinite(v)) return 0;
  return Math.min(100, Math.max(0, v));
}

function mapIsPoint(value) {
  return Boolean(
    value && typeof value === 'object' && !Array.isArray(value)
    && Number.isFinite(Number(value.x)) && Number.isFinite(Number(value.y))
  );
}

function mapGenPointId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// 就地归一化：缺省字段补齐，非法地点丢弃，坐标收敛到 [0,100]。
function normalizeMapCard(card) {
  if (!card || typeof card !== 'object' || Array.isArray(card)) return card;
  if (typeof card.background !== 'string') card.background = '';
  if (!Array.isArray(card.points)) card.points = [];
  card.points = card.points.filter(mapIsPoint).map((point) => ({
    id: String(point.id || mapGenPointId()),
    name: String(point.name || MAP_DEFAULT_POINT_NAME).slice(0, MAP_POINT_NAME_MAX),
    x: mapClampCoord(point.x),
    y: mapClampCoord(point.y),
  }));
  return card;
}

// 空地图：无背景图且无地点（保存时按「删除整个字段」处理）。
function isEmptyMapCard(card) {
  return Boolean(card) && !card.background && !(Array.isArray(card.points) && card.points.length > 0);
}

// 全新空地图包（编辑器 / 删除地图后的底稿）。
function createEmptyMapCard() {
  return {
    version: MAP_CARD_DATA_VERSION,
    background: '',
    points: [],
    updatedAt: '',
  };
}

// ---------- 读取 ----------
// 当前角色卡里的地图包（无角色 / 卡上无数据时返回 null）；返回前就地归一化。
function getMapCardData(ctx) {
  const character = ctx ? getStoryCharacter(ctx) : null;
  if (!character) return null;
  const extensions = character?.data?.extensions;
  if (!extensions || typeof extensions !== 'object') return null;
  const card = extensions[MAP_CARD_EXTENSION_KEY];
  if (!card || typeof card !== 'object' || Array.isArray(card)) return null;
  return normalizeMapCard(card);
}

// 有效地图包：角色卡优先；群聊 / 未选角色 / 卡上无数据时回退全局设置 mapData。
// 返回 null 表示当前没有可用地图（展示空态）。
function getMapBundle(ctx) {
  const card = ctx ? getMapCardData(ctx) : null;
  if (card) return card;
  const settings = ctx ? getSettings(ctx) : null;
  const legacy = settings?.mapData;
  if (legacy && typeof legacy === 'object' && !Array.isArray(legacy)) {
    return normalizeMapCard(cloneValue(legacy));
  }
  return null;
}

// 把地图包写入角色卡对象（内存态，持久化由 saveMapNow 完成）。
function setMapCardData(character, card) {
  if (!character || typeof character !== 'object') return;
  if (!character.data || typeof character.data !== 'object') character.data = {};
  if (!character.data.extensions || typeof character.data.extensions !== 'object') character.data.extensions = {};
  character.data.extensions[MAP_CARD_EXTENSION_KEY] = card;
}

// ---------- 写入 ----------
// 立即持久化（不做防抖）：宿主刷新 / 退出会打断 setTimeout 挂起的写入——
// 防抖窗口内退出酒馆，修改即丢失（同变量系统实测）。返回写入 Promise。
function saveMapNow(ctx, card) {
  const character = ctx ? getStoryCharacter(ctx) : null;
  const avatar = String(character?.avatar || '');
  const promise = persistMapCardData(ctx, avatar, card);
  promise.catch((error) => {
    logApp('warn', '写入角色卡失败', String(error?.message || error));
  });
  return promise;
}

async function persistMapCardData(ctx, avatar, card) {
  const characters = Array.isArray(ctx?.characters) ? ctx.characters : [];
  const index = characters.findIndex((character) => String(character?.avatar || '') === avatar);
  if (index < 0) {
    fallbackMapDataToSettings(ctx, card);
    return;
  }
  const write = ctx?.writeExtensionField;
  if (typeof write !== 'function') {
    fallbackMapDataToSettings(ctx, card);
    return;
  }
  try {
    let payload = card;
    if (isEmptyMapCard(card)) {
      // 空地图 = 删除整个字段：整键哨兵（宿主深合并语义下删除扩展键）。
      payload = VALUES_UNSET_SENTINEL;
    } else {
      try {
        const onDisk = await readMapCardFromDisk(ctx, avatar);
        if (onDisk && typeof onDisk === 'object' && !Array.isArray(onDisk)) {
          payload = buildMapUnsetPatch(onDisk, card);
        }
      } catch (error) {
        logApp('warn', '写卡前磁盘重读失败，按全量覆盖发送', String(error?.message || error));
      }
    }
    await write.call(ctx, index, MAP_CARD_EXTENSION_KEY, payload);
    // writeExtensionField 就地写入了带哨兵的补丁：把内存角色恢复为干净状态，
    // 避免哨兵值残留在 UI 数据里。
    const character = characters[index];
    if (character && character.data && typeof character.data === 'object') {
      if (isEmptyMapCard(card)) {
        delete character.data.extensions?.[MAP_CARD_EXTENSION_KEY];
      } else {
        setMapCardData(character, card);
      }
    }
  } catch (error) {
    fallbackMapDataToSettings(ctx, card);
    throw error;
  }
}

// 从磁盘重读当前角色卡的地图包（写卡前对比旧值 / 保存校验用）。
// 优先独立 fetch（不触碰内存 characters 数组），回退宿主 getOneCharacter。
// 兼容宿主返回的两种形状：normalizeCharacter 后的嵌套 data.extensions，
// 以及展平的顶层 extensions。读不到 / 出错返回 null。
async function readMapCardFromDisk(context, avatar) {
  const ctx = context || getContextSafe();
  if (!ctx || !avatar) return null;
  const extract = (character) => {
    const extensions = character?.data?.extensions ?? character?.extensions ?? null;
    const bundle = extensions && typeof extensions === 'object' ? extensions[MAP_CARD_EXTENSION_KEY] : null;
    return bundle && typeof bundle === 'object' && !Array.isArray(bundle) ? bundle : null;
  };
  try {
    if (typeof globalThis.fetch === 'function') {
      const headers = typeof ctx.getRequestHeaders === 'function'
        ? ctx.getRequestHeaders()
        : { 'Content-Type': 'application/json' };
      const response = await globalThis.fetch('/api/characters/get', {
        method: 'POST',
        headers,
        body: JSON.stringify({ avatar_url: avatar }),
      });
      if (response.ok) {
        const data = await response.json();
        const bundle = extract(data);
        if (bundle) return bundle;
      }
    }
    if (typeof ctx.getOneCharacter === 'function') {
      await ctx.getOneCharacter(avatar);
      const fresh = Array.isArray(ctx.characters)
        ? ctx.characters.find((character) => String(character?.avatar || '') === avatar)
        : null;
      const bundle = extract(fresh);
      if (bundle) return bundle;
    }
    return null;
  } catch (error) {
    logApp('warn', '读取磁盘角色卡失败', String(error?.message || error));
    return null;
  }
}

// 构造写卡补丁：宿主 merge-attributes 是深合并语义（只更新请求里出现的键，
// 请求里没有的键原样保留）。地图包除 background 外的字段（version / points /
// updatedAt）要么保留原值要么整体替换，只有 background 可能被删（清空背景），
// 因此只需把「磁盘有、新包没有」的 background 标记为哨兵；points 为数组整体覆盖。
function buildMapUnsetPatch(oldCard, newCard) {
  const patch = cloneValue(newCard);
  if (typeof oldCard?.background === 'string' && !newCard?.background) {
    patch.background = VALUES_UNSET_SENTINEL;
  }
  return patch;
}

// 写卡校验：经宿主接口从磁盘重读角色卡，比对扩展字段是否与期望一致。
// TauriTavern 的 writeExtensionField 失败只 console.error 不抛错（扩展无法感知），
// 保存按钮用本函数把静默失败变成可见反馈。返回 true / false；宿主不支持从磁盘
// 重读（无 fetch / getOneCharacter / getCharacters）或重读失败时返回 null（无法校验）。
async function verifyMapCardWrite(ctx, avatar, expected) {
  const context = ctx || getContextSafe();
  if (!context || !avatar) return null;
  try {
    if (typeof context.getOneCharacter === 'function') {
      await context.getOneCharacter(avatar);
    } else if (typeof context.getCharacters === 'function') {
      await context.getCharacters();
    } else {
      return null;
    }
    const fresh = Array.isArray(context.characters)
      ? context.characters.find((character) => String(character?.avatar || '') === avatar)
      : null;
    const extensions = fresh?.data?.extensions ?? fresh?.extensions ?? null;
    const onDisk = extensions && typeof extensions === 'object' ? extensions[MAP_CARD_EXTENSION_KEY] : null;
    if (expected === VALUES_UNSET_SENTINEL) {
      // 删除地图：磁盘上字段应已不存在；若宿主只存下了哨兵串（未真正删除），
      // 读取路径也会把它当作「无地图」，同样视为成功。
      return onDisk === null || onDisk === undefined || onDisk === VALUES_UNSET_SENTINEL;
    }
    if (!onDisk || typeof onDisk !== 'object' || Array.isArray(onDisk)) return false;
    const ok = jsonDeepEqual(onDisk, expected);
    if (!ok) logApp('warn', '保存校验不一致', `期望:${describeJsonDiff(expected, onDisk)}`);
    return ok;
  } catch (error) {
    logApp('warn', '保存校验失败', String(error?.message || error));
    return null;
  }
}

// 写入角色卡失败 / 角色已删除 / 宿主不支持时的兜底：数据落回全局设置，避免丢失。
function fallbackMapDataToSettings(ctx, card) {
  const settings = ctx ? getSettings(ctx) : null;
  if (settings) {
    settings.mapData = cloneValue(card);
    saveSettingsImmediate(ctx);
    logApp('warn', '地图写入角色卡失败，已回退全局设置');
  }
}
