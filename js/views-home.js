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

// 首页标语旁「系统日志」小图标状态：错误 / 警告条数徽标。
function refreshHomeLogStatus() {
  const badge = document.getElementById(HOME_LOG_BADGE_ID);
  if (!badge) return;
  try {
    const entries = (typeof logEntries !== 'undefined' && logEntries) || [];
    const errors = entries.filter((entry) => entry.level === 'error').length;
    const warns = entries.filter((entry) => entry.level === 'warn').length;
    if (errors > 0) {
      badge.textContent = String(errors);
      badge.dataset.state = 'error';
      badge.title = `${errors} 错误 · ${warns} 警告`;
      badge.hidden = false;
    } else if (warns > 0) {
      badge.textContent = String(warns);
      badge.dataset.state = 'warn';
      badge.title = `${warns} 警告`;
      badge.hidden = false;
    } else {
      badge.textContent = '';
      badge.dataset.state = 'idle';
      badge.title = '';
      badge.hidden = true;
    }
  } catch (error) {
    badge.textContent = '';
    badge.dataset.state = 'idle';
    badge.title = '';
    badge.hidden = true;
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

// 首页状态统一刷新入口：后续新增卡片状态时在此挂接。
function refreshHomeStatuses() {
  refreshHomeApiStatus();
  refreshHomeStoryStatus();
  refreshHomeLogStatus();
  refreshHomeInjectStatus();
  refreshHomePresetStatus();
}
