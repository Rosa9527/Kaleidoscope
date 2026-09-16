// ===== 万华镜（Kaleidoscope）注入实录视图 =====
// 参考 SoulLink「角色扮演」视图：展示最近一轮剧情预筛的完整结果——
// 预筛原文（Gate 返回）、本轮触发的事件（含触发条件 / 说明 / 正文）、
// 以及最终注入上下文的 <Story_Event> 提示词原文。

function getStoryGateLastRound() {
  return globalThis[STORY_GATE_LAST_ROUND_KEY] || null;
}

function getValuesTriggerLastRound() {
  return globalThis[VALUES_TRIGGER_LAST_ROUND_KEY] || null;
}

// 剧情触发摘要：本轮结果 + 统计 + 触发事件名单。
function buildValuesTriggerSummary(round) {
  const wrap = document.createElement('div');
  wrap.className = 'kaleido-inject__summary';
  const outcome = document.createElement('span');
  outcome.className = 'kaleido-inject__summary-outcome';
  if (round.injected) {
    const autoDisabled = Array.isArray(round.autoDisabledIds) ? round.autoDisabledIds.length : 0;
    outcome.textContent = '已注入 ' + round.triggeredIds.length + ' 个事件'
      + (autoDisabled > 0 ? '，' + autoDisabled + ' 个一次性事件已自动关闭' : '');
    outcome.dataset.state = 'ok';
  } else if (round.skipped) {
    outcome.textContent = '本轮无事件满足条件';
    outcome.dataset.state = 'idle';
  } else {
    outcome.textContent = '未注入';
    outcome.dataset.state = 'warn';
  }
  const stats = document.createElement('span');
  stats.className = 'kaleido-inject__summary-stats';
  stats.textContent = '候选 ' + round.totalTriggers + ' 个触发 · 满足 ' + round.triggeredIds.length + ' 个';
  wrap.append(outcome, stats);
  if (Array.isArray(round.triggeredEvents) && round.triggeredEvents.length > 0) {
    const names = document.createElement('span');
    names.className = 'kaleido-inject__summary-names';
    names.textContent = '触发：' + round.triggeredEvents.map((event) => event.name || event.id).join('、');
    wrap.appendChild(names);
  }
  return wrap;
}

// 摘要：本轮结果 + 统计 + 触发事件名单。
function buildInjectSummary(round) {
  const wrap = document.createElement('div');
  wrap.className = 'kaleido-inject__summary';
  const outcome = document.createElement('span');
  outcome.className = 'kaleido-inject__summary-outcome';
  if (round.injected) {
    outcome.textContent = '已注入 ' + round.selectedIds.length + ' 个事件';
    outcome.dataset.state = 'ok';
  } else if (round.timedOut) {
    outcome.textContent = '超时放行';
    outcome.dataset.state = 'warn';
  } else if (round.skipped) {
    outcome.textContent = '本轮无事件触发';
    outcome.dataset.state = 'idle';
  } else if (String(round.error || '').trim()) {
    outcome.textContent = '预筛失败，已放行';
    outcome.dataset.state = 'error';
  } else {
    outcome.textContent = '未注入';
    outcome.dataset.state = 'warn';
  }
  const stats = document.createElement('span');
  stats.className = 'kaleido-inject__summary-stats';
  stats.textContent = '耗时 ' + Math.round(round.durationMs) + 'ms · 候选 ' + round.totalEvents + ' 个事件 · 入选 ' + round.selectedIds.length + ' 个';
  wrap.append(outcome, stats);
  // 失败原因：toast 转瞬即逝，这里留一份可回看的原文（不省略截断）。
  if (String(round.error || '').trim()) {
    const error = document.createElement('span');
    error.className = 'kaleido-inject__summary-error';
    error.textContent = '失败原因：' + round.error;
    wrap.appendChild(error);
  }
  if (Array.isArray(round.selectedEvents) && round.selectedEvents.length > 0) {
    const names = document.createElement('span');
    names.className = 'kaleido-inject__summary-names';
    names.textContent = '触发：' + round.selectedEvents.map((event) => event.name || event.id).join('、');
    wrap.appendChild(names);
  }
  return wrap;
}

// 单个触发事件卡片：名称 / ID / 触发条件 / 说明 / 正文。
function buildInjectEventCard(event) {
  const card = document.createElement('div');
  card.className = 'kaleido-inject__event';
  const head = document.createElement('div');
  head.className = 'kaleido-inject__event-head';
  const name = document.createElement('span');
  name.className = 'kaleido-inject__event-name';
  name.textContent = event.name || '（未命名事件）';
  const id = document.createElement('span');
  id.className = 'kaleido-inject__event-id';
  id.textContent = event.id || '';
  head.append(name, id);
  card.appendChild(head);
  const triggerText = String(event.trigger || event.conditions || '').trim();
  if (triggerText) {
    const trigger = document.createElement('p');
    trigger.className = 'kaleido-inject__event-line';
    trigger.textContent = '触发条件：' + triggerText;
    card.appendChild(trigger);
  }
  if (String(event.description || '').trim()) {
    const description = document.createElement('p');
    description.className = 'kaleido-inject__event-line';
    description.textContent = '事件说明：' + event.description;
    card.appendChild(description);
  }
  const body = document.createElement('div');
  body.className = 'kaleido-inject__event-body';
  body.textContent = String(event.content || '').trim() || '（事件正文为空）';
  card.appendChild(body);
  return card;
}

// 渲染注入实录视图：无记录时显示空态，有记录时按
// 摘要 → 预筛原文 → 变量表 → 触发事件 → 注入提示词原文 五段展示。
function renderInjectView() {
  const summary = document.getElementById(INJECT_SUMMARY_ID);
  const empty = document.getElementById(INJECT_EMPTY_ID);
  const gateHead = document.querySelector('.kaleido-inject__gate-head');
  const gateText = document.getElementById(INJECT_GATE_TEXT_ID);
  const valuesHead = document.querySelector('.kaleido-inject__values-head');
  const valuesText = document.getElementById(INJECT_VALUES_TEXT_ID);
  const eventsHead = document.querySelector('.kaleido-inject__events-head');
  const events = document.getElementById(INJECT_EVENTS_ID);
  const injectHead = document.querySelector('.kaleido-inject__inject-head');
  const injectText = document.getElementById(INJECT_TEXT_ID);
  if (!summary || !empty || !gateHead || !gateText || !valuesHead || !valuesText
    || !eventsHead || !events || !injectHead || !injectText) return;
  const round = getStoryGateLastRound();
  if (!round) {
    summary.hidden = true;
    gateHead.hidden = true;
    gateText.hidden = true;
    valuesHead.hidden = true;
    valuesText.hidden = true;
    eventsHead.hidden = true;
    events.hidden = true;
    injectHead.hidden = true;
    injectText.hidden = true;
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  summary.hidden = false;
  summary.textContent = '';
  summary.appendChild(buildInjectSummary(round));
  const hasGateRaw = Boolean(String(round.raw || '').trim());
  gateHead.hidden = !hasGateRaw;
  gateText.hidden = !hasGateRaw;
  gateText.textContent = round.raw || '';
  // 变量表段：只在预筛请求确实带了变量表时出现（未使用变量系统时整段隐藏）。
  const hasValues = Boolean(String(round.valuesText || '').trim());
  valuesHead.hidden = !hasValues;
  valuesText.hidden = !hasValues;
  valuesText.textContent = round.valuesText || '';
  const hasEvents = Array.isArray(round.selectedEvents) && round.selectedEvents.length > 0;
  eventsHead.hidden = !hasEvents;
  events.hidden = !hasEvents;
  events.textContent = '';
  if (hasEvents) {
    for (const event of round.selectedEvents) {
      events.appendChild(buildInjectEventCard(event));
    }
  }
  const hasInjection = Boolean(String(round.injectionText || '').trim());
  injectHead.hidden = !hasInjection;
  injectText.hidden = !hasInjection;
  injectText.textContent = round.injectionText || '';
  renderValuesTriggerSection();
}

// 剧情触发段：摘要 → 触发事件 → 注入提示词原文。
function renderValuesTriggerSection() {
  const head = document.querySelector('.kaleido-inject__trigger-head');
  const summary = document.getElementById(INJECT_TRIGGER_SUMMARY_ID);
  const events = document.getElementById(INJECT_TRIGGER_EVENTS_ID);
  const text = document.getElementById(INJECT_TRIGGER_TEXT_ID);
  if (!head || !summary || !events || !text) return;
  const round = getValuesTriggerLastRound();
  if (!round) {
    head.hidden = true;
    summary.hidden = true;
    events.hidden = true;
    text.hidden = true;
    return;
  }
  head.hidden = false;
  summary.hidden = false;
  summary.textContent = '';
  summary.appendChild(buildValuesTriggerSummary(round));
  const hasEvents = Array.isArray(round.triggeredEvents) && round.triggeredEvents.length > 0;
  events.hidden = !hasEvents;
  events.textContent = '';
  if (hasEvents) {
    for (const event of round.triggeredEvents) {
      events.appendChild(buildInjectEventCard(event));
    }
  }
  const hasInjection = Boolean(String(round.injectionText || '').trim());
  text.hidden = !hasInjection;
  text.textContent = round.injectionText || '';
}

// 复制注入提示词原文：优先 Clipboard API，回退隐藏 textarea + execCommand。
async function copyInjectInjectionText() {
  const text = getStoryGateLastRound()?.injectionText || '';
  if (!text) return;
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    globalThis.toastr?.success?.('已复制注入提示词原文', '[' + MODULE_DISPLAY_NAME + ']');
  } catch (error) {
    console.warn('[' + MODULE_DISPLAY_NAME + '] 复制注入提示词失败', error);
    globalThis.toastr?.warning?.('注入原文复制失败，请手动选择文本', '[' + MODULE_DISPLAY_NAME + ']');
  }
}