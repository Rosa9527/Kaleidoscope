// ===== 万华镜（Kaleidoscope）剧情脉络：数据模型 / YAML 导入导出 =====
function genStoryId(prefix) {
  const rand = Math.random().toString(36).slice(2, 8);
  return `kaleido-${prefix}-${Date.now().toString(36)}-${rand}`;
}

function nowIso() {
  return new Date().toISOString();
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

function storyTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function sanitizeStoryFilename(name) {
  const cleaned = String(name || '').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 40).replace(/^_+|_+$/g, '');
  return cleaned || '未命名';
}

// ---------- 角色卡绑定 ----------
// 剧情脉络数据与角色卡绑定（参考 SillyTavern 局部正则脚本）：数据存
// character.data.extensions.kaleidoscope_story，随角色卡导入/导出自动携带。
// 群聊 / 未选角色 / 宿主不支持写角色卡时，回退全局设置（storyNodes /
// storyScripts，兼容旧数据）。

// 当前选中的角色对象；群聊 / 未选角色 / 上下文无角色表时返回 null。
function getStoryCharacter(ctx) {
  if (!ctx || typeof ctx !== 'object') return null;
  const characters = Array.isArray(ctx.characters) ? ctx.characters : null;
  if (!characters) return null;
  const index = Number(ctx.characterId);
  if (!Number.isInteger(index) || index < 0 || index >= characters.length) return null;
  const character = characters[index];
  return character && typeof character === 'object' ? character : null;
}

// 当前角色卡里的剧情数据（无角色 / 卡上无数据时返回 null）；返回前就地
// 归一化 nodes / scripts 数组，保证后续变更始终落在角色卡数据上。
function getStoryCardData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character) return null;
  const extensions = character?.data?.extensions;
  if (!extensions || typeof extensions !== 'object') return null;
  const card = extensions[STORY_CARD_EXTENSION_KEY];
  if (!card || typeof card !== 'object' || Array.isArray(card)) return null;
  if (!Array.isArray(card.nodes)) card.nodes = [];
  if (!Array.isArray(card.scripts)) card.scripts = [];
  return card;
}

// 把剧情数据写入角色卡对象（内存态，持久化由 saveStoryData 防抖完成）。
function setStoryCardData(character, card) {
  if (!character || typeof character !== 'object') return;
  if (!character.data || typeof character.data !== 'object') character.data = {};
  if (!character.data.extensions || typeof character.data.extensions !== 'object') character.data.extensions = {};
  character.data.extensions[STORY_CARD_EXTENSION_KEY] = card;
}

// 写入角色卡失败 / 角色已删除 / 宿主不支持时的兜底：数据落回全局设置，避免丢失。
function fallbackStoryDataToSettings(ctx, card) {
  const settings = getSettings(ctx);
  settings.storyNodes = Array.isArray(card?.nodes) ? card.nodes : [];
  settings.storyScripts = Array.isArray(card?.scripts) ? card.scripts : [];
  saveSettings(ctx);
  logApp('warn', '剧情脉络写入角色卡失败，已回退全局设置');
}

// 防抖持久化：内存态已由调用方（数组引用）更新，这里只负责把整包数据
// 写回角色卡。按 avatar 定位角色，避免防抖期间切换角色写错卡。
function scheduleStoryCardSave(ctx, character, card) {
  const avatar = String(character?.avatar || '');
  if (globalThis[STORY_CARD_SAVE_TIMER_KEY]) {
    clearTimeout(globalThis[STORY_CARD_SAVE_TIMER_KEY]);
  }
  globalThis[STORY_CARD_SAVE_TIMER_KEY] = setTimeout(() => {
    globalThis[STORY_CARD_SAVE_TIMER_KEY] = null;
    persistStoryCardData(ctx, avatar, card).catch((error) => {
      logApp('warn', '写入角色卡失败', String(error?.message || error));
    });
  }, STORY_CARD_SAVE_DEBOUNCE_MS);
}

async function persistStoryCardData(ctx, avatar, card) {
  const characters = Array.isArray(ctx?.characters) ? ctx.characters : [];
  const index = characters.findIndex((character) => String(character?.avatar || '') === avatar);
  if (index < 0) {
    // 角色已删除：数据回退全局设置，避免丢失
    fallbackStoryDataToSettings(ctx, card);
    return;
  }
  const write = ctx?.writeExtensionField;
  if (typeof write !== 'function') {
    fallbackStoryDataToSettings(ctx, card);
    return;
  }
  try {
    await write.call(ctx, index, STORY_CARD_EXTENSION_KEY, card);
  } catch (error) {
    fallbackStoryDataToSettings(ctx, card);
    throw error;
  }
}

// ---------- 节点 / 事件：数据读写 ----------
// 剧情脉络只显示「当前角色卡绑定的内容」：有角色但卡上无数据时返回空数组，
// 不回退全局设置（避免把别的角色/旧数据串到当前角色卡上）；只有群聊 / 未选
// 角色 / 宿主不支持写角色卡时才用全局设置兜底。
function getStoryNodes(ctx) {
  const card = ctx ? getStoryCardData(ctx) : null;
  if (card) return card.nodes;
  if (ctx && getStoryCharacter(ctx) && typeof ctx?.writeExtensionField === 'function') return [];
  const settings = ctx ? getSettings(ctx) : null;
  return Array.isArray(settings?.storyNodes) ? settings.storyNodes : [];
}

function getStoryScripts(ctx) {
  const card = ctx ? getStoryCardData(ctx) : null;
  if (card) return card.scripts;
  if (ctx && getStoryCharacter(ctx) && typeof ctx?.writeExtensionField === 'function') return [];
  const settings = ctx ? getSettings(ctx) : null;
  return Array.isArray(settings?.storyScripts) ? settings.storyScripts : [];
}

// 确保当前角色卡有剧情数据容器：无卡时用旧版全局数据初始化（并清空全局兜底）。
// 无角色 / 宿主不支持写角色卡时返回 null（保持全局设置路径）。
function ensureStoryCardData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character || typeof ctx?.writeExtensionField !== 'function') return null;
  let card = getStoryCardData(ctx);
  if (card) return card;
  const settings = getSettings(ctx);
  const legacyNodes = Array.isArray(settings.storyNodes) ? settings.storyNodes : [];
  const legacyScripts = Array.isArray(settings.storyScripts) ? settings.storyScripts : [];
  card = { version: STORY_CARD_DATA_VERSION, nodes: legacyNodes, scripts: legacyScripts };
  setStoryCardData(character, card);
  if (legacyNodes.length > 0 || legacyScripts.length > 0) {
    settings.storyNodes = [];
    settings.storyScripts = [];
    logApp('info', '剧情脉络已绑定角色卡', '旧版全局数据已迁入当前角色卡');
    try {
      globalThis.toastr?.info?.('剧情脉络已绑定当前角色卡，旧版全局数据已迁入；导入/导出角色卡时自动携带', `[${MODULE_DISPLAY_NAME}]`);
    } catch {}
  }
  return card;
}

// 保存：有角色且宿主支持写角色卡 → 确保角色卡容器存在（首次变更时迁入旧版
// 全局数据），随后防抖持久化；否则写全局设置。
function saveStoryData(ctx) {
  const character = getStoryCharacter(ctx);
  if (!character || typeof ctx?.writeExtensionField !== 'function') {
    saveSettings(ctx);
    return;
  }
  const card = ensureStoryCardData(ctx);
  if (card) scheduleStoryCardSave(ctx, character, card);
}

function getStoryNodeById(ctx, id) {
  return getStoryNodes(ctx).find((node) => node.id === id) || null;
}

function getStoryScriptById(ctx, id) {
  return getStoryScripts(ctx).find((script) => script.id === id) || null;
}

function getStoryNodeScriptCount(ctx, nodeId) {
  return getStoryScripts(ctx).filter((script) => script.nodeId === nodeId).length;
}

function getStoryNodeChildren(ctx, parentId) {
  return getStoryNodes(ctx).filter((node) => String(node.parentId || '') === String(parentId || ''));
}

function getStoryRootNodes(ctx) {
  return getStoryNodes(ctx).filter((node) => !String(node.parentId || ''));
}

function byStoryCreatedAt(a, b) {
  return String(a?.createdAt || '').localeCompare(String(b?.createdAt || ''));
}

// nodeId 是否为 ancestorId 的后代（沿 parentId 链向上查）。
function isStoryNodeAncestor(ctx, ancestorId, nodeId) {
  let current = getStoryNodeById(ctx, nodeId);
  let guard = 0;
  while (current && guard < 1000) {
    if (current.id === ancestorId) return true;
    current = getStoryNodeById(ctx, String(current.parentId || ''));
    guard += 1;
  }
  return false;
}

function createStoryNode(ctx, data) {
  ensureStoryCardData(ctx);
  const nodes = getStoryNodes(ctx);
  const now = nowIso();
  let parentId = String(data?.parentId || '').trim();
  if (parentId && !nodes.some((node) => node.id === parentId)) parentId = '';
  const node = {
    id: genStoryId('n'),
    parentId,
    name: String(data?.name || '').trim() || '未命名节点',
    description: String(data?.description || '').trim(),
    enabled: data?.enabled === false ? false : true,
    createdAt: now,
    updatedAt: now,
  };
  nodes.push(node);
  saveStoryData(ctx);
  return node;
}

function updateStoryNode(ctx, id, data) {
  ensureStoryCardData(ctx);
  const node = getStoryNodeById(ctx, id);
  if (!node) return null;
  if (data && typeof data === 'object') {
    if (data.name !== undefined) node.name = String(data.name).trim() || node.name;
    if (data.description !== undefined) node.description = String(data.description).trim();
    if (data.enabled !== undefined) node.enabled = Boolean(data.enabled);
    if (data.parentId !== undefined) {
      const nextParent = String(data.parentId).trim();
      if (nextParent === '' || nextParent === id || isStoryNodeAncestor(ctx, id, nextParent)) {
        // 空=顶层；禁止挂到自己或自己的后代下
        node.parentId = '';
      } else if (getStoryNodeById(ctx, nextParent)) {
        node.parentId = nextParent;
      } else {
        node.parentId = '';
      }
    }
  }
  node.updatedAt = nowIso();
  saveStoryData(ctx);
  return node;
}

// 节点启用开关：关闭后本节点及其子节点、事件不再参与剧情预筛；再点一次重新激活。
function toggleStoryNodeEnabled(ctx, id) {
  ensureStoryCardData(ctx);
  const node = getStoryNodeById(ctx, id);
  if (!node) return null;
  node.enabled = node.enabled === false;
  node.updatedAt = nowIso();
  saveStoryData(ctx);
  return node;
}

// 节点是否激活：自身或任一祖先被关闭则视为停用（子树整体停用）。
function isStoryNodeActive(ctx, node) {
  let current = node || null;
  let guard = 0;
  while (current && guard < 1000) {
    if (current.enabled === false) return false;
    current = String(current.parentId || '') ? getStoryNodeById(ctx, current.parentId) : null;
    guard += 1;
  }
  return true;
}

// 当前参与预筛的事件：挂接节点（或任一祖先）被关闭的事件不返回；未分类事件恒有效。
function getStoryActiveScripts(ctx) {
  return getStoryScripts(ctx).filter((script) => {
    if (!script.nodeId || !getStoryNodeById(ctx, script.nodeId)) return true;
    return isStoryNodeActive(ctx, getStoryNodeById(ctx, script.nodeId));
  });
}

// 事件 ID：默认从 001 开始逐次递增；excludeId 为正在编辑的事件自身 id（不计入）。
function nextStoryScriptId(ctx, excludeId) {
  const scripts = getStoryScripts(ctx);
  let max = 0;
  for (const script of scripts) {
    if (script.id === excludeId) continue;
    const match = /(?:^|\D)(\d+)$/.exec(String(script.id || ''));
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return String(max + 1).padStart(3, '0');
}

// 计算事件实际使用的 id：给定 id 非空且未被占用则沿用；为空或与其他事件重复时，
// 按 001 序列自动顺延到未注册的 id。excludeId 为正在编辑的事件自身 id。
function resolveStoryScriptId(ctx, requested, excludeId) {
  const scripts = getStoryScripts(ctx);
  const used = new Set();
  for (const script of scripts) {
    if (script.id !== excludeId) used.add(script.id);
  }
  const candidate = String(requested ?? '').trim();
  if (candidate && !used.has(candidate)) return candidate;
  let id = nextStoryScriptId(ctx, excludeId);
  while (used.has(id)) {
    const match = /(\d+)$/.exec(id);
    id = String((match ? parseInt(match[1], 10) : 0) + 1).padStart(3, '0');
  }
  return id;
}

// 删除节点：子节点上移到其上级（顶层则成根节点），其下事件改为「未分类」，
// 事件本身不删除。返回 { movedChildren, detachedScripts }。
function deleteStoryNode(ctx, id) {
  ensureStoryCardData(ctx);
  const nodes = getStoryNodes(ctx);
  const index = nodes.findIndex((node) => node.id === id);
  if (index < 0) return null;
  const node = nodes[index];
  const parentId = String(node.parentId || '');
  const now = nowIso();
  let movedChildren = 0;
  for (const child of nodes) {
    if (String(child.parentId || '') === id) {
      child.parentId = parentId;
      child.updatedAt = now;
      movedChildren += 1;
    }
  }
  let detachedScripts = 0;
  for (const script of getStoryScripts(ctx)) {
    if (script.nodeId === id) {
      script.nodeId = '';
      script.updatedAt = now;
      detachedScripts += 1;
    }
  }
  nodes.splice(index, 1);
  saveStoryData(ctx);
  return { movedChildren, detachedScripts };
}

function createStoryScript(ctx, data) {
  ensureStoryCardData(ctx);
  const scripts = getStoryScripts(ctx);
  const now = nowIso();
  const script = {
    id: resolveStoryScriptId(ctx, data?.id, ''),
    nodeId: String(data?.nodeId || '').trim(),
    name: String(data?.name || '').trim() || '未命名事件',
    trigger: String(data?.trigger || '').trim(),
    description: String(data?.description || '').trim(),
    content: String(data?.content || ''),
    createdAt: now,
    updatedAt: now,
  };
  scripts.push(script);
  saveStoryData(ctx);
  return script;
}

function updateStoryScript(ctx, id, data) {
  ensureStoryCardData(ctx);
  const script = getStoryScriptById(ctx, id);
  if (!script) return null;
  if (data && typeof data === 'object') {
    if (data.id !== undefined && String(data.id).trim() !== script.id) {
      script.id = resolveStoryScriptId(ctx, data.id, id);
    }
    if (data.name !== undefined) script.name = String(data.name).trim() || script.name;
    if (data.trigger !== undefined) script.trigger = String(data.trigger).trim();
    if (data.description !== undefined) script.description = String(data.description).trim();
    if (data.content !== undefined) script.content = String(data.content);
    if (data.nodeId !== undefined) script.nodeId = String(data.nodeId).trim();
  }
  script.updatedAt = nowIso();
  saveStoryData(ctx);
  return script;
}

function deleteStoryScript(ctx, id) {
  ensureStoryCardData(ctx);
  const scripts = getStoryScripts(ctx);
  const index = scripts.findIndex((script) => script.id === id);
  if (index < 0) return false;
  scripts.splice(index, 1);
  saveStoryData(ctx);
  return true;
}

// ---------- 轻量 YAML（本项目所需子集）----------
// 支持：映射 / 列表 / 普通与引号标量 / 块文本（|、|-）/ 注释 / --- 文档标记。
// 高级特性（锚点、多文档、流式集合内嵌等）不支持，导入时会给出可读报错。
function yamlIndentOf(line) {
  const match = /^\s*/.exec(line);
  return match ? match[0].length : 0;
}

function stripYamlComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quote) {
      if (ch === quote && line[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '#' && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}

function isYamlBlank(line) {
  return stripYamlComment(line).trim() === '';
}

function isYamlDocMarker(line) {
  const trimmed = String(line).trim();
  return trimmed === '---' || trimmed === '...';
}

function parseYamlScalarToken(token) {
  if (token === '' || token === 'null' || token === '~') return null;
  if (token === 'true') return true;
  if (token === 'false') return false;
  if (token === '[]') return [];
  if (token === '{}') return {};
  if (/^0\d+$/.test(token)) return token; // 保留前导零（如事件 id 001）
  if (/^-?\d+(\.\d+)?$/.test(token)) {
    const num = Number(token);
    if (Number.isFinite(num)) return num;
  }
  if (token.startsWith('"')) {
    const match = /^"([\s\S]*)"$/.exec(token);
    if (match) {
      try {
        return JSON.parse(`"${match[1]}"`);
      } catch {}
      return match[1].replace(/\\"/g, '"');
    }
    return token.slice(1);
  }
  if (token.startsWith("'")) {
    const match = /^'([\s\S]*)'$/.exec(token);
    if (match) return match[1].replace(/''/g, "'");
    return token.slice(1);
  }
  return token;
}

// 块文本：读取所有比键行缩进更深的行（| 保留末尾换行，|- 去除）。
function readYamlBlockScalar(state, keyIndent) {
  const { lines } = state;
  const collected = [];
  let contentIndent = null;
  while (state.index < lines.length) {
    const line = lines[state.index];
    if (line.trim() === '') {
      if (contentIndent !== null) collected.push('');
      state.index += 1;
      continue;
    }
    const indent = yamlIndentOf(line);
    if (indent <= keyIndent) break;
    if (contentIndent === null) contentIndent = indent;
    collected.push(line.slice(contentIndent));
    state.index += 1;
  }
  while (collected.length > 0 && collected[collected.length - 1] === '') collected.pop();
  return collected.join('\n');
}

function parseYamlNode(state, minIndent) {
  const { lines } = state;
  while (state.index < lines.length) {
    const line = lines[state.index];
    if (isYamlBlank(line)) {
      state.index += 1;
      continue;
    }
    if (isYamlDocMarker(line)) {
      state.index += 1;
      continue;
    }
    const indent = yamlIndentOf(line);
    if (indent < minIndent) return null;
    if (indent > minIndent) throw new Error(`YAML 缩进异常（第 ${state.index + 1} 行）`);
    const content = stripYamlComment(line).trim();
    if (content === '-' || /^-\s/.test(content)) {
      throw new Error(`意外的列表项（第 ${state.index + 1} 行）`);
    }
    const keyMatch = /^([^:]+?):\s*(.*)$/.exec(content);
    if (!keyMatch) throw new Error(`无法解析的 YAML 行（第 ${state.index + 1} 行）：${content}`);
    const key = keyMatch[1].trim();
    const rest = keyMatch[2].trim();
    state.index += 1;

    if (rest === '|' || rest === '|-') {
      const body = readYamlBlockScalar(state, indent);
      return { key, value: rest === '|' ? `${body}\n` : body };
    }
    if (rest === '') {
      while (state.index < lines.length && isYamlBlank(lines[state.index])) state.index += 1;
      if (state.index >= lines.length) return { key, value: null };
      const nestedIndent = yamlIndentOf(lines[state.index]);
      if (nestedIndent <= indent) return { key, value: null };
      const nestedContent = stripYamlComment(lines[state.index]).trim();
      if (nestedContent === '[]' || nestedContent === '{}') {
        state.index += 1;
        return { key, value: parseYamlScalarToken(nestedContent) };
      }
      if (nestedContent === '-' || /^-\s/.test(nestedContent)) {
        return { key, value: parseYamlList(state, nestedIndent) };
      }
      return { key, value: parseYamlMap(state, nestedIndent) };
    }
    return { key, value: parseYamlScalarToken(rest) };
  }
  return null;
}

function parseYamlMap(state, minIndent) {
  const map = {};
  for (;;) {
    const node = parseYamlNode(state, minIndent);
    if (!node) break;
    map[node.key] = node.value;
  }
  return map;
}

function parseYamlList(state, minIndent) {
  const { lines } = state;
  const list = [];
  while (state.index < lines.length) {
    const line = lines[state.index];
    if (isYamlBlank(line)) {
      state.index += 1;
      continue;
    }
    if (isYamlDocMarker(line)) {
      state.index += 1;
      continue;
    }
    const indent = yamlIndentOf(line);
    if (indent < minIndent) break;
    if (indent > minIndent) throw new Error(`YAML 缩进异常（第 ${state.index + 1} 行）`);
    const content = stripYamlComment(line).trim();
    const listMatch = /^-\s*(.*)$/.exec(content);
    if (!listMatch) break;
    const rest = listMatch[1].trim();
    state.index += 1;

    if (rest === '') {
      while (state.index < lines.length && isYamlBlank(lines[state.index])) state.index += 1;
      if (state.index >= lines.length) {
        list.push(null);
        continue;
      }
      const nestedIndent = yamlIndentOf(lines[state.index]);
      if (nestedIndent <= indent) {
        list.push(null);
        continue;
      }
      const nestedContent = stripYamlComment(lines[state.index]).trim();
      if (nestedContent === '-' || /^-\s/.test(nestedContent)) list.push(parseYamlList(state, nestedIndent));
      else list.push(parseYamlMap(state, nestedIndent));
      continue;
    }

    const keyMatch = /^([^:]+?):\s*(.*)$/.exec(rest);
    if (keyMatch) {
      const item = {};
      const key = keyMatch[1].trim();
      const itemRest = keyMatch[2].trim();
      if (itemRest === '|' || itemRest === '|-') {
        const body = readYamlBlockScalar(state, indent);
        item[key] = itemRest === '|' ? `${body}\n` : body;
      } else if (itemRest === '') {
        while (state.index < lines.length && isYamlBlank(lines[state.index])) state.index += 1;
        let nestedIndent = null;
        if (state.index < lines.length && yamlIndentOf(lines[state.index]) > indent) {
          nestedIndent = yamlIndentOf(lines[state.index]);
        }
        if (nestedIndent === null) {
          item[key] = null;
        } else {
          const nestedContent = stripYamlComment(lines[state.index]).trim();
          if (nestedContent === '-' || /^-\s/.test(nestedContent)) item[key] = parseYamlList(state, nestedIndent);
          else item[key] = parseYamlMap(state, nestedIndent);
        }
      } else {
        item[key] = parseYamlScalarToken(itemRest);
      }
      // 该地图项后续的键：缩进取下一非空行（若比破折号深）
      let itemIndent = indent + 2;
      while (state.index < lines.length && isYamlBlank(lines[state.index])) state.index += 1;
      if (state.index < lines.length && yamlIndentOf(lines[state.index]) > indent) {
        itemIndent = yamlIndentOf(lines[state.index]);
      }
      if (itemIndent > indent) {
        for (;;) {
          const node = parseYamlNode(state, itemIndent);
          if (!node) break;
          item[node.key] = node.value;
        }
      }
      list.push(item);
      continue;
    }

    list.push(parseYamlScalarToken(rest));
  }
  return list;
}

function parseYamlSubset(text) {
  const state = {
    index: 0,
    // 支持 ```yaml 代码块围栏（与 parseAgentJson 一致）：只剥离顶格围栏行，
    // 缩进的围栏是块文本内容（如剧情里的 markdown），必须原样保留。
    lines: String(text || '').replace(/\r\n?/g, '\n').split('\n').filter((line) => !/^```/.test(line)),
  };
  while (
    state.index < state.lines.length
    && (isYamlBlank(state.lines[state.index]) || isYamlDocMarker(state.lines[state.index]))
  ) {
    state.index += 1;
  }
  if (state.index >= state.lines.length) return {};
  const firstContent = stripYamlComment(state.lines[state.index]).trim();
  if (firstContent === '-' || /^-\s/.test(firstContent)) {
    return parseYamlList(state, yamlIndentOf(state.lines[state.index]));
  }
  const map = parseYamlMap(state, 0);
  return map && typeof map === 'object' && !Array.isArray(map) ? map : {};
}

// ---------- YAML 输出 ----------
function yamlScalar(value) {
  const str = String(value ?? '');
  if (str === '') return '""';
  if (/[\n\r]/.test(str)) return JSON.stringify(str);
  if (/^-?\d+(\.\d+)?$/.test(str) || /^(true|false|null|~)$/.test(str)) return JSON.stringify(str);
  if (/^[\s#]|[\s#]$/.test(str) || /:\s/.test(str) || /^[-?:,\[\]{}&*!|>'"%@`]/.test(str)) {
    return JSON.stringify(str);
  }
  return str;
}

function yamlBlockScalarText(content, baseIndent = '') {
  const normalized = String(content ?? '').replace(/\r\n?/g, '\n').replace(/\n+$/, '');
  if (normalized === '') return '""';
  const indented = normalized.split('\n').map((line) => (line === '' ? baseIndent : `${baseIndent}  ${line}`)).join('\n');
  return `|-\n${indented}`;
}

// 整包导出：nodes + scripts（脚本内嵌为 name / trigger / description / content 字段）。
// 自描述头部：format 标记固定输出，character 只写当前绑定的角色卡名（群聊/未选角色省略）。
function serializeStoryBundle(ctx) {
  const nodes = getStoryNodes(ctx);
  const scripts = getStoryScripts(ctx);
  const character = ctx ? getStoryCharacter(ctx) : null;
  const characterName = character ? String(character.name || character.avatar || '').trim() : '';
  const lines = [];
  lines.push('# 万华镜（Kaleidoscope）剧情脉络导出');
  lines.push('# 在「剧情脉络 → 导入 剧情脉络」中可重新导入：合并（同 id 更新、其余追加）或覆盖（清空后整体替换）。');
  lines.push(`format: ${STORY_BUNDLE_FORMAT}`);
  lines.push(`version: ${STORY_BUNDLE_VERSION}`);
  if (characterName) {
    lines.push(`character: ${yamlScalar(characterName)}`);
  }
  if (nodes.length === 0) {
    lines.push('nodes: []');
  } else {
    lines.push('nodes:');
    for (const node of nodes) {
      lines.push(`  - id: ${yamlScalar(node.id)}`);
      lines.push(`    parentId: ${yamlScalar(node.parentId || '')}`);
      lines.push(`    name: ${yamlScalar(node.name)}`);
      lines.push(`    description: ${yamlScalar(node.description || '')}`);
      lines.push(`    enabled: ${node.enabled === false ? 'false' : 'true'}`);
    }
  }
  if (scripts.length === 0) {
    lines.push('scripts: []');
  } else {
    lines.push('scripts:');
    for (const script of scripts) {
      lines.push(`  - id: ${yamlScalar(script.id)}`);
      lines.push(`    nodeId: ${yamlScalar(script.nodeId || '')}`);
      lines.push(`    name: ${yamlScalar(script.name)}`);
      lines.push(`    trigger: ${yamlScalar(script.trigger || '')}`);
      lines.push(`    description: ${yamlScalar(script.description || '')}`);
      lines.push(`    content: ${yamlBlockScalarText(script.content, '    ')}`);
    }
  }
  return `${lines.join('\n')}\n`;
}

// 整包导出文件名：绑定角色卡 → 「剧情脉络: 角色卡名.yaml」；
// 群聊 / 未选角色时回退时间戳名（万华镜-剧情脉络-时间戳.yaml）。
function buildStoryBundleFilename(ctx) {
  const character = ctx ? getStoryCharacter(ctx) : null;
  const name = character ? String(character.name || character.avatar || '').trim() : '';
  if (name) return `${STORY_CARD_BUNDLE_FILENAME_PREFIX}${sanitizeStoryFilename(name)}.yaml`;
  return `${STORY_BUNDLE_FILENAME_PREFIX}-${storyTimestamp()}.yaml`;
}

// 单事件导出：遵循 frontmatter 格式（name / id / Trigger / description + 正文）。
function serializeSingleScript(script) {
  const lines = [];
  lines.push('---');
  lines.push(`name: ${yamlScalar(script?.name)}`);
  lines.push(`id: ${yamlScalar(script?.id || '')}`);
  lines.push(`Trigger: ${yamlScalar(script?.trigger || '')}`);
  lines.push(`description: ${yamlScalar(script?.description || '')}`);
  lines.push('---');
  lines.push(String(script?.content || '').replace(/\n+$/, ''));
  return `${lines.join('\n')}\n`;
}

// 单事件文件解析：--- 开头 frontmatter + 正文。
function parseSingleScriptFile(text) {
  const source = String(text || '').replace(/\r\n?/g, '\n');
  const lines = source.split('\n');
  if ((lines[0] || '').trim() !== '---') {
    throw new Error('事件文件必须以 --- 开头（YAML frontmatter 格式）');
  }
  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      endIndex = i;
      break;
    }
  }
  if (endIndex < 0) throw new Error('事件文件缺少结尾的 --- 分隔线');
  const meta = parseYamlSubset(lines.slice(1, endIndex).join('\n'));
  const content = lines.slice(endIndex + 1).join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
  const name = String(meta?.name ?? '').trim();
  if (!name) throw new Error('事件 frontmatter 缺少 name 字段');
  return {
    id: String(meta?.id ?? '').trim(),
    name,
    trigger: String(meta?.Trigger ?? meta?.trigger ?? '').trim(),
    description: String(meta?.description ?? '').trim(),
    content,
  };
}

// 整包文件解析：凭 format 标记或 nodes / scripts 段识别（兼容旧版导出）。
function parseStoryBundleFile(text) {
  const data = parseYamlSubset(text);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('无法识别剧情脉络 YAML 格式');
  }
  const hasSections = data.nodes != null || data.scripts != null;
  const hasMarker = String(data.format || '').trim() === STORY_BUNDLE_FORMAT;
  if (!hasSections && !hasMarker) {
    throw new Error('未找到 nodes / scripts 段，无法作为剧情脉络包导入');
  }
  return {
    character: String(data.character ?? '').trim(),
    nodes: Array.isArray(data.nodes) ? data.nodes : [],
    scripts: Array.isArray(data.scripts) ? data.scripts : [],
  };
}

// 导入：默认合并（同 id 更新、其余追加）；options.replace 为覆盖模式（清空现有内容后整体替换）。
// 脚本引用的节点不存在时转为「未分类」。
function mergeStoryBundleInto(ctx, bundle, options) {
  ensureStoryCardData(ctx);
  const nodes = getStoryNodes(ctx);
  const scripts = getStoryScripts(ctx);
  if (options?.replace) {
    nodes.length = 0;
    scripts.length = 0;
  }
  const now = nowIso();
  const stats = { addedNodes: 0, updatedNodes: 0, addedScripts: 0, updatedScripts: 0 };

  const imported = new Map(); // id -> { raw, node }
  for (const raw of bundle.nodes || []) {
    if (!raw || typeof raw !== 'object') continue;
    const id = String(raw.id || '').trim() || genStoryId('n');
    const existing = nodes.find((node) => node.id === id);
    let node;
    if (existing) {
      existing.name = String(raw.name ?? '').trim() || existing.name;
      existing.description = String(raw.description ?? existing.description ?? '').trim();
      // 导入文件未写 enabled 时按「默认启用」处理（文件对启停状态有最终决定权）
      existing.enabled = typeof raw.enabled === 'boolean' ? raw.enabled : true;
      existing.updatedAt = now;
      node = existing;
      stats.updatedNodes += 1;
    } else {
      node = {
        id,
        name: String(raw.name || '').trim() || '未命名节点',
        description: String(raw.description || '').trim(),
        enabled: typeof raw.enabled === 'boolean' ? raw.enabled : true,
        createdAt: now,
        updatedAt: now,
      };
      nodes.push(node);
      stats.addedNodes += 1;
    }
    imported.set(id, node);
  }

  // 导入集内的成环检测：沿 parentId 链走，若回到自身则视为无效父级。
  function leadsBackTo(map, candidateParentId, nodeId) {
    let current = candidateParentId;
    let guard = 0;
    while (current && map.has(current) && guard < 1000) {
      if (current === nodeId) return true;
      current = String(map.get(current).parentId || '');
      guard += 1;
    }
    return false;
  }

  for (const raw of bundle.nodes || []) {
    if (!raw || typeof raw !== 'object') continue;
    const id = String(raw.id || '').trim();
    const node = imported.get(id);
    if (!node) continue;
    const candidate = String(raw.parentId || '').trim();
    if (
      candidate
      && candidate !== id
      && (imported.has(candidate) || nodes.some((existing) => existing.id === candidate))
      && !leadsBackTo(imported, candidate, id)
      && !isStoryNodeAncestor(ctx, id, candidate)
    ) {
      node.parentId = candidate;
    } else {
      node.parentId = '';
    }
  }

  for (const raw of bundle.scripts || []) {
    if (!raw || typeof raw !== 'object') continue;
    const id = String(raw.id || '').trim() || genStoryId('s');
    const existing = scripts.find((script) => script.id === id);
    const nodeId = String(raw.nodeId || '').trim();
    const resolvedNodeId = nodeId && nodes.some((node) => node.id === nodeId) ? nodeId : '';
    const data = {
      name: String(raw.name || '').trim() || '未命名事件',
      trigger: String(raw.trigger ?? '').trim(),
      description: String(raw.description ?? '').trim(),
      content: String(raw.content ?? ''),
      nodeId: resolvedNodeId,
    };
    if (existing) {
      Object.assign(existing, data, { updatedAt: now });
      stats.updatedScripts += 1;
    } else {
      scripts.push({ id, ...data, createdAt: now, updatedAt: now });
      stats.addedScripts += 1;
    }
  }

  saveStoryData(ctx);
  return stats;
}

// ---------- 文件读写 ----------
function readTextFile(file) {
  if (typeof file?.text === 'function') {
    return Promise.resolve(file.text());
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('读取文件失败'));
    reader.readAsText(file, 'utf-8');
  });
}

function downloadTextFile(filename, text) {
  try {
    const blob = new Blob([String(text ?? '')], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] 下载文件失败`, error);
    return false;
  }
}
