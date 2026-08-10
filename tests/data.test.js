// 万华镜剧情脉络数据层测试：节点层级 / 防环 / 删除上移 / YAML 导入导出。
'use strict';
const { readSources, loadInContext, createRunner, makeContext, makeCharacter } = require('./harness');

// 可控定时器：角色卡持久化是防抖的，测试里手动触发。
let timerSeq = 0;
let pendingTimers = [];
const sandbox = {
  console,
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

// 触发所有待执行的防抖定时器，并等微任务跑完（持久化是 async）。
async function flushTimers() {
  const timers = pendingTimers.splice(0);
  for (const timer of timers) timer.fn();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function fresh() {
  return makeContext();
}

function makeTree(c) {
  const vol1 = ctx.createStoryNode(c, { name: '第一卷' });
  const ch1 = ctx.createStoryNode(c, { name: '第一章', parentId: vol1.id });
  const ch2 = ctx.createStoryNode(c, { name: '第二章', parentId: vol1.id });
  const rain = ctx.createStoryScript(c, { name: '雨夜事件', trigger: '夜晚且下雨', nodeId: ch1.id, content: '窗外雨声渐密。' });
  return { vol1, ch1, ch2, rain };
}

// ---------- 层级创建 ----------
runner.test('全新上下文没有任何默认节点/事件', () => {
  const c = fresh();
  assert(ctx.getStoryNodes(c).length === 0, '默认不应有节点');
  assert(ctx.getStoryScripts(c).length === 0, '默认不应有事件');
});

runner.test('创建根节点与多层子节点', () => {
  const c = fresh();
  const vol1 = ctx.createStoryNode(c, { name: '第一卷' });
  assert(vol1.parentId === '', '根节点 parentId 应为空');
  const ch1 = ctx.createStoryNode(c, { name: '第一章', parentId: vol1.id });
  assert(ch1.parentId === vol1.id, '子节点应挂到父节点下');
  const scene = ctx.createStoryNode(c, { name: '雨夜场景', parentId: ch1.id });
  assert(scene.parentId === ch1.id, '孙子节点应挂到子节点下');
  assert(ctx.getStoryRootNodes(c).length === 1, '应只有 1 个根节点');
  assert(ctx.getStoryNodeChildren(c, vol1.id).length === 1, '第一卷应只有 1 个子节点');
  assert(ctx.getStoryNodeChildren(c, ch1.id).length === 1, '第一章应只有 1 个子节点');
});

runner.test('无效父级自动回落为根节点', () => {
  const c = fresh();
  const node = ctx.createStoryNode(c, { name: '孤儿', parentId: 'no-such-id' });
  assert(node.parentId === '', '不存在的父级应回落为根');
  const root = ctx.createStoryNode(c, { name: '根' });
  const child = ctx.createStoryNode(c, { name: '子', parentId: root.id });
  ctx.updateStoryNode(c, child.id, { parentId: 'no-such-id' });
  assert(ctx.getStoryNodeById(c, child.id).parentId === '', '更新为不存在的父级应回落为根');
});

runner.test('空名称节点使用默认名', () => {
  const c = fresh();
  const node = ctx.createStoryNode(c, {});
  assert(node.name === '未命名节点', '空名称应为默认名');
});

// ---------- 防环 ----------
runner.test('禁止挂到自己或后代节点下', () => {
  const c = fresh();
  const { vol1, ch1 } = makeTree(c);
  ctx.updateStoryNode(c, vol1.id, { parentId: ch1.id });
  assert(ctx.getStoryNodeById(c, vol1.id).parentId === '', '根节点挂到后代应回落为根');
  ctx.updateStoryNode(c, ch1.id, { parentId: ch1.id });
  assert(ctx.getStoryNodeById(c, ch1.id).parentId === '', '挂到自己应回落为根（无效父级统一回落）');
});

runner.test('isStoryNodeAncestor 判定', () => {
  const c = fresh();
  const { vol1, ch1 } = makeTree(c);
  const ch2 = ctx.getStoryNodeChildren(c, vol1.id)[1];
  assert(ctx.isStoryNodeAncestor(c, vol1.id, ch1.id), 'vol1 应是 ch1 的祖先');
  assert(!ctx.isStoryNodeAncestor(c, ch1.id, vol1.id), 'ch1 不应是 vol1 的祖先');
  assert(!ctx.isStoryNodeAncestor(c, ch1.id, ch2.id), 'ch1 不应是 ch2 的祖先');
});

runner.test('移动节点到另一个父级', () => {
  const c = fresh();
  const { vol1, ch1, ch2 } = makeTree(c);
  ctx.updateStoryNode(c, ch1.id, { parentId: ch2.id });
  assert(ctx.getStoryNodeById(c, ch1.id).parentId === ch2.id, '第一章应移到第二章下');
  assert(ctx.getStoryNodeChildren(c, vol1.id).length === 1, '第一卷应只剩第二章');
  assert(ctx.getStoryNodeChildren(c, ch2.id).length === 1, '第二章下应有第一章');
});

// ---------- 删除 ----------
runner.test('删除节点：子节点上移、事件转未分类、返回统计', () => {
  const c = fresh();
  const vol1 = ctx.createStoryNode(c, { name: '第一卷' });
  const ch1 = ctx.createStoryNode(c, { name: '第一章', parentId: vol1.id });
  const ch2 = ctx.createStoryNode(c, { name: '第二章', parentId: ch1.id });
  const script = ctx.createStoryScript(c, { name: '雨夜事件', nodeId: ch1.id, content: '正文' });
  const result = ctx.deleteStoryNode(c, ch1.id);
  assert(result && result.movedChildren === 1, '应有 1 个子节点上移');
  assert(result.detachedScripts === 1, '应有 1 个事件转未分类');
  assert(ctx.getStoryNodeById(c, ch1.id) === null, '第一章应已删除');
  assert(ctx.getStoryNodeById(c, ch2.id).parentId === vol1.id, '第二章应上移到第一卷下');
  assert(ctx.getStoryScriptById(c, script.id).nodeId === '', '事件应转为未分类');
});

runner.test('删除不存在的节点返回 null', () => {
  const c = fresh();
  assert(ctx.deleteStoryNode(c, 'nope') === null, '删除不存在节点应返回 null');
});

runner.test('删除根节点：子节点成为新根', () => {
  const c = fresh();
  const { vol1, ch1 } = makeTree(c);
  const result = ctx.deleteStoryNode(c, vol1.id);
  assert(result.movedChildren === 2, '两个子节点应上移为根');
  assert(ctx.getStoryRootNodes(c).length === 2, '应有 2 个根节点');
});

// ---------- 事件 CRUD ----------
runner.test('事件创建 / 更新 / 删除', () => {
  const c = fresh();
  const script = ctx.createStoryScript(c, { name: '初见', trigger: '首次对话', content: '你好。' });
  assert(script.nodeId === '', '默认未分类');
  ctx.updateStoryScript(c, script.id, { name: '再见', content: '再见。', nodeId: 'fake' });
  const updated = ctx.getStoryScriptById(c, script.id);
  assert(updated.name === '再见', '名称应已更新');
  assert(updated.nodeId === 'fake', 'nodeId 直接赋值（由 UI 保证有效性）');
  assert(ctx.deleteStoryScript(c, script.id) === true, '删除应返回 true');
  assert(ctx.getStoryScriptById(c, script.id) === null, '删除后应查不到');
});

// ---------- 单事件 frontmatter ----------
runner.test('单事件导出/解析往返', () => {
  const script = {
    id: 'kaleido-s-1',
    name: '雨夜事件',
    trigger: '玩家第一次到达新手村且下雨',
    description: '开场引导事件',
    content: '你站在村口，\n远山如黛，\n雨丝斜织。',
  };
  const yaml = ctx.serializeSingleScript(script);
  assert(yaml.startsWith('---\n'), '应以 --- 开头');
  assert(yaml.includes('Trigger:'), '应包含 Trigger 字段');
  assert(yaml.includes('id: kaleido-s-1'), '应包含 id 字段');
  const parsed = ctx.parseSingleScriptFile(yaml);
  assert(parsed.id === 'kaleido-s-1', 'id 往返');
  assert(parsed.name === '雨夜事件', '名称往返');
  assert(parsed.trigger === '玩家第一次到达新手村且下雨', '触发条件往返');
  assert(parsed.description === '开场引导事件', '说明往返');
  assert(parsed.content === '你站在村口，\n远山如黛，\n雨丝斜织。', '正文往返');
});

runner.test('单事件解析错误处理', () => {
  let threw = false;
  try { ctx.parseSingleScriptFile('name: 无头'); } catch { threw = true; }
  assert(threw, '不以 --- 开头应报错');
  threw = false;
  try { ctx.parseSingleScriptFile('---\nname: x\n'); } catch { threw = true; }
  assert(threw, '缺少结尾 --- 应报错');
  threw = false;
  try { ctx.parseSingleScriptFile('---\ndescription: 无名\n---\n正文'); } catch { threw = true; }
  assert(threw, '缺少 name 应报错');
});

runner.test('frontmatter 支持 trigger 小写兼容', () => {
  const parsed = ctx.parseSingleScriptFile('---\nname: 测试\ntrigger: 小写触发\n---\n正文');
  assert(parsed.trigger === '小写触发', '小写 trigger 也应识别');
});

runner.test('单事件支持 id：解析保留 / 缺省 001 递增 / 重复自动顺延', () => {
  const parsed = ctx.parseSingleScriptFile('---\nname: 测试\nid: 007\nTrigger: 触发\n---\n正文');
  assert(parsed.id === '007', '应解析 id 字段');
  const c = fresh();
  const first = ctx.createStoryScript(c, { name: '测试', content: '正文' });
  assert(first.id === '001', '缺省 id 应从 001 开始');
  const second = ctx.createStoryScript(c, { name: '测试2', content: 'x' });
  assert(second.id === '002', '缺省 id 应逐次递增');
  const withId = ctx.createStoryScript(c, { id: 'kaleido-s-custom', name: '测试3', content: 'y' });
  assert(withId.id === 'kaleido-s-custom', '自定义 id 应保留');
  const dup = ctx.createStoryScript(c, { id: '001', name: '重复', content: 'z' });
  assert(dup.id === '003', '重复 id 应自动顺延为未注册 id');
  assert(ctx.getStoryScripts(c).length === 4, '应创建 4 个事件');
});

runner.test('更新事件 id：自身保持不变，与别人重复自动顺延', () => {
  const c = fresh();
  const a = ctx.createStoryScript(c, { name: 'A', content: 'a' });
  const b = ctx.createStoryScript(c, { name: 'B', content: 'b' });
  ctx.updateStoryScript(c, a.id, { id: '002' });
  assert(ctx.getStoryScriptById(c, '001') === null, '旧 id 不应保留');
  assert(ctx.getStoryScriptById(c, '002')?.name === 'B', 'B 的 id 不应受影响');
  const renamed = ctx.getStoryScriptById(c, '003');
  assert(renamed && renamed.name === 'A', '重复 id 应自动顺延为 003');
  ctx.updateStoryScript(c, '003', { id: '003', name: 'A2' });
  assert(ctx.getStoryScriptById(c, '003')?.name === 'A2', '自身 id 应保持不变');
  assert(ctx.getStoryScripts(c).length === 2, '事件数量不应变化');
});

// ---------- 整包 YAML ----------
runner.test('整包导出/导入往返保留层级与事件归属', () => {
  const c1 = fresh();
  const { vol1, ch1, ch2, rain } = makeTree(c1);
  ctx.createStoryScript(c1, { name: '无主事件', content: '孤本' });
  const yaml = ctx.serializeStoryBundle(c1);
  assert(yaml.includes('parentId:'), '导出应包含 parentId 字段');
  const bundle = ctx.parseStoryBundleFile(yaml);
  assert(bundle.nodes.length === 3, '应有 3 个节点');
  assert(bundle.scripts.length === 2, '应有 2 个事件');

  const c2 = fresh();
  const stats = ctx.mergeStoryBundleInto(c2, bundle);
  assert(stats.addedNodes === 3 && stats.addedScripts === 2, '导入统计应正确');
  const nodesByName = Object.fromEntries(ctx.getStoryNodes(c2).map((n) => [n.name, n]));
  assert(nodesByName['第一章'].parentId === nodesByName['第一卷'].id, '导入后第一章应挂第一卷下');
  assert(nodesByName['第二章'].parentId === nodesByName['第一卷'].id, '导入后第二章应挂第一卷下');
  const rainImported = ctx.getStoryScripts(c2).find((s) => s.name === '雨夜事件');
  assert(rainImported.nodeId === nodesByName['第一章'].id, '事件应保持归属第一章');
  const orphan = ctx.getStoryScripts(c2).find((s) => s.name === '无主事件');
  assert(orphan.nodeId === '', '无主事件应保持未分类');
});

runner.test('导入悬空父级回落为根', () => {
  const c = fresh();
  const stats = ctx.mergeStoryBundleInto(c, {
    nodes: [{ id: 'n1', name: 'A', parentId: 'nope' }],
    scripts: [],
  });
  assert(stats.addedNodes === 1, '应新增 1 节点');
  assert(ctx.getStoryNodeById(c, 'n1').parentId === '', '悬空父级应回落为根');
});

runner.test('导入成环后结果仍为无环树', () => {
  const c = fresh();
  ctx.mergeStoryBundleInto(c, {
    nodes: [
      { id: 'a', name: 'A', parentId: 'b' },
      { id: 'b', name: 'B', parentId: 'a' },
    ],
    scripts: [],
  });
  const nodes = ctx.getStoryNodes(c);
  assert(nodes.length === 2, '应有 2 个节点');
  for (const node of nodes) {
    const parentId = String(node.parentId || '');
    if (!parentId) continue;
    assert(nodes.some((n) => n.id === parentId), `parentId 必须指向存在的节点（${node.id} -> ${parentId}）`);
    assert(!ctx.isStoryNodeAncestor(c, node.id, parentId), `${node.id} 的父级链不应回到自身`);
  }
});

runner.test('同 id 二次导入为更新而非重复', () => {
  const c = fresh();
  const bundle = {
    nodes: [{ id: 'n1', name: '第一卷', parentId: '' }],
    scripts: [{ id: 's1', name: '雨夜', nodeId: 'n1', content: '旧' }],
  };
  let stats = ctx.mergeStoryBundleInto(c, bundle);
  assert(stats.addedNodes === 1 && stats.addedScripts === 1, '首次应为新增');
  stats = ctx.mergeStoryBundleInto(c, {
    nodes: [{ id: 'n1', name: '第一卷（修订）', parentId: '' }],
    scripts: [{ id: 's1', name: '雨夜', nodeId: 'n1', content: '新' }],
  });
  assert(stats.updatedNodes === 1 && stats.updatedScripts === 1, '二次应为更新');
  assert(ctx.getStoryNodes(c).length === 1, '节点不应重复');
  assert(ctx.getStoryScripts(c).length === 1, '事件不应重复');
  assert(ctx.getStoryNodeById(c, 'n1').name === '第一卷（修订）', '名称应已更新');
  assert(ctx.getStoryScriptById(c, 's1').content === '新', '内容应已更新');
});

runner.test('脚本引用的节点不存在时转未分类', () => {
  const c = fresh();
  ctx.mergeStoryBundleInto(c, {
    nodes: [],
    scripts: [{ id: 's1', name: '孤本', nodeId: 'ghost', content: 'x' }],
  });
  assert(ctx.getStoryScriptById(c, 's1').nodeId === '', '悬空节点引用应转未分类');
});

runner.test('parseStoryBundleFile 对非包文件报错', () => {
  let threw = false;
  try { ctx.parseStoryBundleFile('foo: bar'); } catch { threw = true; }
  assert(threw, '缺少 nodes/scripts 段应报错');
});

// ---------- 整包：角色卡绑定导出 ----------
runner.test('整包导出包含格式标记与角色卡名', () => {
  const character = makeCharacter('辉夜大小姐', 'kaguya.png');
  const bound = makeContext({ characters: [character], characterId: 0 });
  const yaml = ctx.serializeStoryBundle(bound);
  assert(yaml.includes('format: kaleidoscope-story'), '应包含格式标记');
  assert(yaml.includes('character: 辉夜大小姐'), '应包含角色卡名');
  assert(yaml.includes('nodes: []'), '空数据应正常导出');
  const plain = ctx.serializeStoryBundle(fresh());
  assert(!/^character:/m.test(plain), '未绑定角色不应写 character 字段');
  assert(plain.includes('format: kaleidoscope-story'), '未绑定角色也应写格式标记');
});

runner.test('整包解析凭 format 标记识别并带回角色卡名', () => {
  const bundle = ctx.parseStoryBundleFile([
    'format: kaleidoscope-story',
    'version: 1',
    'character: 辉夜大小姐',
    'nodes: []',
    'scripts: []',
  ].join('\n'));
  assert(bundle.character === '辉夜大小姐', '应解析出角色卡名');
  assert(bundle.nodes.length === 0 && bundle.scripts.length === 0, '空包应正常解析');
});

runner.test('整包往返保留角色卡名', () => {
  const character = makeCharacter('辉夜大小姐', 'kaguya.png');
  const c = makeContext({ characters: [character], characterId: 0 });
  const yaml = ctx.serializeStoryBundle(c);
  const bundle = ctx.parseStoryBundleFile(yaml);
  assert(bundle.character === '辉夜大小姐', '角色卡名应往返保留');
});

runner.test('整包导出文件名：绑定角色卡用角色名，未绑定回退时间戳', () => {
  const character = makeCharacter('辉夜大小姐', 'kaguya.png');
  const bound = makeContext({ characters: [character], characterId: 0 });
  assert(ctx.buildStoryBundleFilename(bound) === '剧情脉络: 辉夜大小姐.yaml', '应使用「剧情脉络: 角色卡名.yaml」');
  const fallback = ctx.buildStoryBundleFilename(fresh());
  assert(/^万华镜-剧情脉络-\d{8}-\d{4}\.yaml$/.test(fallback), '未绑定角色应回退时间戳文件名');
});

// ---------- 角色卡绑定 ----------
runner.test('getStoryCharacter 返回当前角色，群聊/无角色返回 null', () => {
  const character = makeCharacter('蕾姆', 'rem.png');
  const c = makeContext({ characters: [character], characterId: 0 });
  assert(ctx.getStoryCharacter(c) === character, '应返回当前角色');
  const group = makeContext({ characters: [character], characterId: undefined });
  assert(ctx.getStoryCharacter(group) === null, '群聊（characterId 未定义）应返回 null');
  const none = makeContext();
  assert(ctx.getStoryCharacter(none) === null, '无角色表应返回 null');
});

runner.test('getStoryNodes/Scripts 优先读角色卡，无卡时显示为空', () => {
  const character = makeCharacter('蕾姆', 'rem.png');
  character.data.extensions.kaleidoscope_story = {
    version: 1,
    nodes: [{ id: 'n1', name: '第一卷' }],
    scripts: [{ id: 's1', name: '雨夜' }],
  };
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async () => {},
  });
  assert(ctx.getStoryNodes(c).length === 1, '应读角色卡节点');
  assert(ctx.getStoryScripts(c).length === 1, '应读角色卡事件');
});

runner.test('有角色但卡上无数据：显示为空，不回退全局设置', () => {
  const character = makeCharacter('蕾姆', 'rem.png');
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async () => {},
  });
  const settings = ctx.getSettings(c);
  settings.storyNodes = [{ id: 'legacy', name: '旧节点' }];
  settings.storyScripts = [{ id: 'legacy-s', name: '旧事件' }];
  assert(ctx.getStoryNodes(c).length === 0, '有角色无卡时应显示为空');
  assert(ctx.getStoryScripts(c).length === 0, '有角色无卡时事件应为空');
  assert(settings.storyNodes.length === 1, '全局旧数据不应被读取或清空');
});

runner.test('切换到没有绑定文件的角色卡时显示为空', () => {
  const rem = makeCharacter('蕾姆', 'rem.png');
  rem.data.extensions.kaleidoscope_story = {
    version: 1,
    nodes: [{ id: 'n1', name: '第一卷' }],
    scripts: [{ id: 's1', name: '雨夜' }],
  };
  const ram = makeCharacter('拉姆', 'ram.png'); // 无绑定数据
  const c = makeContext({
    characters: [rem, ram],
    characterId: 0,
    writeExtensionField: async () => {},
  });
  assert(ctx.getStoryNodes(c).length === 1, '蕾姆应显示自己的剧情');
  c.characterId = 1; // 切到拉姆
  assert(ctx.getStoryNodes(c).length === 0, '拉姆没有绑定文件应显示为空');
  assert(ctx.getStoryScripts(c).length === 0, '拉姆没有绑定事件应显示为空');
});

runner.test('无角色（群聊/未选角色）时回退全局设置', () => {
  const none = makeContext();
  const node = ctx.createStoryNode(none, { name: '全局节点' });
  assert(ctx.getStoryNodes(none).length === 1, '无角色时应回退全局设置');
  assert(node.name === '全局节点', '全局节点应创建成功');
});

runner.test('首次保存：旧版全局数据迁入角色卡并清空全局', async () => {
  const character = makeCharacter('蕾姆', 'rem.png');
  const writes = [];
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async (index, key, value) => { writes.push({ index, key, value }); },
  });
  const settings = ctx.getSettings(c);
  settings.storyNodes = [{ id: 'legacy', name: '旧节点' }];
  settings.storyScripts = [{ id: 'legacy-s', name: '旧事件' }];
  ctx.createStoryNode(c, { name: '新节点' });
  await flushTimers();
  assert(settings.storyNodes.length === 0, '迁移后全局节点应清空');
  assert(settings.storyScripts.length === 0, '迁移后全局事件应清空');
  const card = character.data.extensions.kaleidoscope_story;
  assert(card && card.version === 1, '角色卡应写入版本号');
  assert(card.nodes.length === 2, '角色卡应含旧节点 + 新节点');
  assert(card.scripts.length === 1, '角色卡应含旧事件');
  assert(writes.length === 1, '应防抖持久化一次');
  assert(writes[0].index === 0 && writes[0].key === 'kaleidoscope_story', '应写入当前角色卡');
  assert(writes[0].value.nodes.length === 2, '持久化内容应含全部节点');
});

runner.test('已有角色卡数据时保存直接更新卡并持久化', async () => {
  const character = makeCharacter('蕾姆', 'rem.png');
  character.data.extensions.kaleidoscope_story = { version: 1, nodes: [], scripts: [] };
  const writes = [];
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async (index, key, value) => { writes.push({ index, key, value }); },
  });
  ctx.createStoryNode(c, { name: '节点A' });
  await flushTimers();
  const card = character.data.extensions.kaleidoscope_story;
  assert(card.nodes.length === 1, '节点应写入角色卡');
  assert(writes.length === 1, '应持久化一次');
  assert(writes[0].value.nodes.length === 1, '持久化内容应含新节点');
});

runner.test('防抖期间切换角色不会写错卡', async () => {
  const rem = makeCharacter('蕾姆', 'rem.png');
  const ram = makeCharacter('拉姆', 'ram.png');
  const writes = [];
  const c = makeContext({
    characters: [rem, ram],
    characterId: 0,
    writeExtensionField: async (index, key, value) => { writes.push({ index, key, value }); },
  });
  ctx.createStoryNode(c, { name: '节点A' });
  c.characterId = 1; // 防抖期间切到拉姆
  await flushTimers();
  assert(writes.length === 1, '应持久化一次');
  assert(writes[0].index === 0, '应写回原角色（蕾姆）而不是当前角色');
});

runner.test('角色已删除时持久化回退全局设置', async () => {
  const character = makeCharacter('蕾姆', 'rem.png');
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async () => {},
  });
  ctx.createStoryNode(c, { name: '节点A' });
  c.characters = []; // 模拟角色被删除
  await flushTimers();
  const settings = ctx.getSettings(c);
  assert(settings.storyNodes.length === 1, '数据应回退全局设置');
});

runner.test('写入角色卡失败时回退全局设置', async () => {
  const character = makeCharacter('蕾姆', 'rem.png');
  const c = makeContext({
    characters: [character],
    characterId: 0,
    writeExtensionField: async () => { throw new Error('boom'); },
  });
  ctx.createStoryNode(c, { name: '节点A' });
  await flushTimers();
  const settings = ctx.getSettings(c);
  assert(settings.storyNodes.length === 1, '失败后应回退全局设置');
});

runner.test('宿主不支持写角色卡时保存走全局设置', () => {
  const character = makeCharacter('蕾姆', 'rem.png');
  const c = makeContext({ characters: [character], characterId: 0 });
  ctx.createStoryNode(c, { name: '节点A' });
  const settings = ctx.getSettings(c);
  assert(settings.storyNodes.length === 1, '应写入全局设置');
  assert(!character.data.extensions.kaleidoscope_story, '不应创建角色卡数据');
});

runner.run();
