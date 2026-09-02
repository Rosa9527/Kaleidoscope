// ===== 万华镜（Kaleidoscope）首页状态 =====
function refreshHomeApiStatus() {
  const status = document.getElementById(HOME_API_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    const model = String(settings?.model || '').trim();
    const hasUrl = Boolean(getApiBase(settings));
    if (model && hasUrl) {
      status.textContent = model.length > 18 ? `${model.slice(0, 18)}…` : model;
      status.dataset.state = 'ok';
    } else if (hasUrl) {
      status.textContent = '已填地址 · 未选模型';
      status.dataset.state = 'warn';
    } else {
      status.textContent = '尚未连接';
      status.dataset.state = 'idle';
    }
  } catch (error) {
    status.textContent = '尚未连接';
    status.dataset.state = 'idle';
  }
}

// 首页「剧情脉络」卡片状态：节点数 / 事件数 + 角色卡绑定提示。
function refreshHomeStoryStatus() {
  const status = document.getElementById(HOME_STORY_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const nodes = ctx ? getStoryNodes(ctx) : [];
    const scripts = ctx ? getStoryScripts(ctx) : [];
    const total = nodes.length + scripts.length;
    const character = ctx ? getStoryCharacter(ctx) : null;
    const card = ctx ? getStoryCardData(ctx) : null;
    if (character) {
      const name = String(character.name || character.avatar || '');
      status.title = card
        ? `剧情数据已绑定角色卡「${name}」：导入/导出角色卡时自动携带`
        : `当前角色卡「${name}」还没有剧情数据：首次保存后自动写入角色卡`;
    } else {
      status.title = '未绑定角色（群聊/未选角色）：数据存全局设置，不随角色卡导入导出';
    }
    if (total === 0) {
      status.textContent = character ? (card ? '已绑定 · 尚未添加' : '待绑定 · 尚未添加') : '尚未添加';
      status.dataset.state = 'idle';
    } else {
      status.textContent = `${nodes.length} 节点 · ${scripts.length} 事件`;
      status.dataset.state = 'ok';
    }
  } catch (error) {
    status.textContent = '尚未添加';
    status.dataset.state = 'idle';
  }
}

// 首页「系统日志」卡片状态：错误 / 警告条数文字提示。
function refreshHomeLogStatus() {
  const status = document.getElementById(HOME_LOG_STATUS_ID);
  if (!status) return;
  try {
    const entries = (typeof logEntries !== 'undefined' && logEntries) || [];
    const errors = entries.filter((entry) => entry.level === 'error').length;
    const warns = entries.filter((entry) => entry.level === 'warn').length;
    const state = errors > 0 ? 'error' : (warns > 0 ? 'warn' : 'idle');
    const text = errors > 0
      ? errors + ' 错误 · ' + warns + ' 警告'
      : (warns > 0 ? warns + ' 警告' : (entries.length > 0 ? '共 ' + entries.length + ' 条' : '暂无记录'));
    status.textContent = text;
    status.dataset.state = state;
  } catch (error) {
    status.textContent = '暂无记录';
    status.dataset.state = 'idle';
  }
}

// 首页「注入实录」卡片状态：剧情预筛最近一轮的结果。
function refreshHomeInjectStatus() {
  const status = document.getElementById(HOME_INJECT_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    if (!settings || settings.storyGateEnabled === false) {
      status.textContent = '未启用';
      status.dataset.state = 'idle';
      return;
    }
    const round = globalThis[STORY_GATE_LAST_ROUND_KEY] || null;
    if (!round) {
      status.textContent = '尚未运行';
      status.dataset.state = 'idle';
      return;
    }
    if (round.injected) {
      status.textContent = '已注入 ' + round.selectedIds.length + ' 事件';
      status.dataset.state = 'ok';
    } else if (round.timedOut) {
      status.textContent = '超时放行';
      status.dataset.state = 'warn';
    } else if (round.skipped) {
      status.textContent = '本轮无事件';
      status.dataset.state = 'idle';
    } else {
      status.textContent = '未注入';
      status.dataset.state = 'warn';
    }
  } catch (error) {
    status.textContent = '尚未运行';
    status.dataset.state = 'idle';
  }
}

// 首页「变量」卡片状态：键数量 / 条目数量 + 绑定与自动维护提示。
function refreshHomeValuesStatus() {
  const status = document.getElementById(HOME_VALUES_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const settings = ctx ? getSettings(ctx) : null;
    const keys = ctx ? getValuesKeys(ctx) : [];
    const defaults = ctx ? getValuesDefaults(ctx) : {};
    const entries = valuesCountEntries(defaults);
    const triggers = ctx ? getValuesTriggers(ctx) : [];
    const gameInitialized = ctx ? isValuesGameInitialized(ctx) : false;
    const character = ctx ? getStoryCharacter(ctx) : null;
    const card = ctx ? getValuesCardData(ctx) : null;
    const maintainEnabled = settings ? settings.valuesAutoUpdateEnabled !== false : true;
    const triggerEnabled = settings ? settings.valuesTriggerEnabled !== false : true;
    if (character) {
      status.title = card
        ? `变量已绑定角色卡「${character.name || ''}」：默认值随角色卡导入导出；游戏值存聊天文件（${gameInitialized ? '已初始化' : '未初始化'}）`
        : `当前角色卡还没有变量数据：首次保存后自动写入角色卡；自动维护${maintainEnabled ? '已开启' : '已关闭'}`;
    } else {
      status.title = '未绑定角色（群聊/未选角色）：默认值存全局设置，不随角色卡导入导出';
    }
    if (keys.length === 0 && entries === 0 && triggers.length === 0) {
      status.textContent = character ? (card ? '已绑定 · 尚未添加' : '待绑定 · 尚未添加') : '尚未添加';
      status.dataset.state = 'idle';
    } else {
      const parts = [`${keys.length} 变量`, `${entries} 值`];
      if (triggers.length > 0) parts.push(`${triggers.length} 触发`);
      if (triggers.length > 0 && !triggerEnabled) parts.push('触发已关');
      status.textContent = parts.join(' · ');
      status.dataset.state = 'ok';
    }
  } catch (error) {
    status.textContent = '尚未添加';
    status.dataset.state = 'idle';
  }
}

// 首页「游戏地图」卡片状态：背景图 / 地点数量 + 绑定提示。
function refreshHomeMapStatus() {
  const status = document.getElementById(HOME_MAP_STATUS_ID);
  if (!status) return;
  try {
    const ctx = getContextSafe();
    const map = ctx ? getMapBundle(ctx) : null;
    const character = ctx ? getStoryCharacter(ctx) : null;
    if (character) {
      status.title = map
        ? `地图已绑定角色卡「${character.name || ''}」：随角色卡导入导出自动携带`
        : '当前角色卡还没有地图：到游戏地图编辑器制作一张';
    } else {
      status.title = '未绑定角色（群聊/未选角色）：地图存全局设置，不随角色卡导入导出';
    }
    if (!map || (!map.background && map.points.length === 0)) {
      status.textContent = '尚未制作';
      status.dataset.state = 'idle';
      return;
    }
    const parts = [];
    if (map.background) parts.push('有背景图');
    parts.push(`${map.points.length} 地点`);
    status.textContent = parts.join(' · ');
    status.dataset.state = 'ok';
  } catch (error) {
    status.textContent = '尚未制作';
    status.dataset.state = 'idle';
  }
}

// 首页状态统一刷新入口：后续新增卡片状态时在此挂接。
function refreshHomeStatuses() {
  refreshHomeApiStatus();
  refreshHomeStoryStatus();
  refreshHomeValuesStatus();
  refreshHomeMapStatus();
  refreshHomeLogStatus();
  refreshHomeInjectStatus();
  refreshHomePresetStatus();
}
