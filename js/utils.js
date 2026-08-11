// ===== 万华镜（Kaleidoscope）通用工具：设置读写 / API 请求 =====
function cloneValue(value) {
  if (typeof globalThis.structuredClone === 'function') return globalThis.structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}


// 轻量日志：写入系统日志缓冲（面板「系统日志」视图可见），同时输出到控制台。
// pushLogEntry / CONSOLE_ORIGINALS 由 js/views-log.js 提供；加载顺序保证运行时已就绪。
function logApp(level, ...args) {
  try {
    if (typeof pushLogEntry === 'function') pushLogEntry(level, 'kaleido', args);
  } catch {}
  try {
    const method = level === 'info' ? 'log' : level;
    const original = (typeof CONSOLE_ORIGINALS !== 'undefined' && CONSOLE_ORIGINALS[method])
      || globalThis.console[method] || globalThis.console.log;
    original.apply(globalThis.console, [`[${MODULE_DISPLAY_NAME}]`, ...args]);
  } catch {}
}

// ---------- 设置读写 ----------
function getHostExtensionSettings(ctx) {
  if (!ctx || typeof ctx !== 'object') return null;
  try {
    if (!ctx.extensionSettings || typeof ctx.extensionSettings !== 'object') {
      ctx.extensionSettings = {};
      if (!ctx.extensionSettings || typeof ctx.extensionSettings !== 'object') {
        throw new TypeError('host context is not extensible');
      }
    }
    return ctx.extensionSettings;
  } catch (error) {
    // 某些宿主（如 TauriTavern）的 context 可能冻结/不可扩展，回退 WeakMap 存储。
    console.warn(`[${MODULE_DISPLAY_NAME}] host context is not extensible; using fallback settings store`, error);
    let store = FALLBACK_SETTINGS_STORE.get(ctx);
    if (!store) {
      store = {};
      FALLBACK_SETTINGS_STORE.set(ctx, store);
    }
    return store;
  }
}

function getSettings(ctx) {
  const root = getHostExtensionSettings(ctx);
  if (!root) throw new Error(`[${MODULE_DISPLAY_NAME}] host extension settings are unavailable`);
  if (!root[MODULE_NAME]) root[MODULE_NAME] = cloneValue(DEFAULT_SETTINGS);
  const settings = root[MODULE_NAME];
  let shouldSave = false;
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (settings[key] === undefined) {
      settings[key] = cloneValue(value);
      shouldSave = true;
    }
  }
  if (!Array.isArray(settings.modelOptions)) {
    settings.modelOptions = [];
    shouldSave = true;
  }
  if (shouldSave) saveSettings(ctx);
  return settings;
}

function saveSettings(ctx) {
  try {
    ctx?.saveSettingsDebounced?.();
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] unable to save host settings`, error);
  }
}

function saveSettingsImmediate(ctx) {
  try {
    const save = ctx?.saveSettings || ctx?.saveSettingsDebounced;
    if (typeof save !== 'function') return;
    const result = save.call(ctx);
    if (result && typeof result.catch === 'function') {
      result.catch((error) => console.warn(`[${MODULE_DISPLAY_NAME}] unable to save host settings`, error));
    }
  } catch (error) {
    console.warn(`[${MODULE_DISPLAY_NAME}] unable to save host settings`, error);
  }
}

// ---------- API 基础 ----------
function getApiBase(settings) {
  let apiBase = String(settings?.apiUrl || '').trim().replace(/\/+$/, '');
  apiBase = apiBase.replace(/\/(chat\/completions|models)$/i, '');
  return apiBase.replace(/\/+$/, '');
}

function getAuthHeaders(settings) {
  const headers = { 'Content-Type': 'application/json' };
  const apiKey = String(settings?.apiKey || '').trim();
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}

function isCrossOriginUrl(url) {
  try {
    if (typeof location === 'undefined' || !location?.origin) return false;
    return new URL(url, location.href).origin !== location.origin;
  } catch {
    return false;
  }
}

// 宿主代理请求头：带上 session 的 CSRF Token 与请求头，否则宿主代理 POST 会 403。
function getHostProxyHeaders(extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  try {
    const ctx = getContextSafe();
    const hostHeaders = ctx?.getRequestHeaders?.()
      || globalThis.SillyTavern?.getRequestHeaders?.()
      || globalThis.getRequestHeaders?.()
      || null;
    if (hostHeaders && typeof hostHeaders === 'object') {
      Object.entries(hostHeaders).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') headers[key] = String(value);
      });
    }
  } catch {}
  try {
    const csrfToken = document?.cookie?.match(/(?:^|;\s*)csrf_token=([^;]+)/)?.[1];
    if (csrfToken && !headers['X-CSRF-Token']) headers['X-CSRF-Token'] = decodeURIComponent(csrfToken);
  } catch {}
  return headers;
}

function buildHostProxyConfig(apiBase, settings, extraBody = null) {
  const apiKey = String(settings?.apiKey || '').trim();
  const config = {
    chat_completion_source: 'custom',
    custom_url: apiBase,
    reverse_proxy: apiBase,
    proxy_password: apiKey,
    custom_include_headers: apiKey ? `Authorization: Bearer ${apiKey}` : '',
  };
  if (extraBody && typeof extraBody === 'object') Object.assign(config, extraBody);
  return config;
}

// TauriTavern 宿主代理的对话接口是 /api/backends/chat-completions/generate，
// 请求体与模型列表探测（/status）不同：custom_include_headers 的值需带引号
// （`Authorization: "Bearer xxx"`）。参数格式参考宿主自带 st-chatu8 扩展。
function buildHostProxyChatConfig(apiBase, settings, body) {
  const apiKey = String(settings?.apiKey || '').trim();
  return {
    chat_completion_source: 'custom',
    custom_url: apiBase,
    custom_include_headers: apiKey ? `Authorization: "Bearer ${apiKey}"` : '',
    ...body,
  };
}

function shouldFallbackFromHostProxy(responseText, status) {
  return status === 401
    || status === 403
    || status === 404
    || status === 405
    || /cannot\s+post|not\s+found|no\s+route|ENOENT/i.test(String(responseText || ''));
}

function looksLikeJson(text) {
  const trimmed = String(text || '').trim();
  return trimmed.startsWith('{') || trimmed.startsWith('[');
}

// 检查响应文本里是否真的带有可用文本：content 为空但 reasoning_content 有内容时
// （deepseek-v4-flash 等模型偶发把答案写进思维链字段）仍视为可用；两者皆空才判
// 「等于没回复」，走直连与自动重试而不是直接判死；错误信封（{error}）不算缺内容，
// 交给上游错误分支处理。
function responseContainsUsableText(responseText) {
  const trimmed = String(responseText || '').trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return false;
  let data;
  try {
    data = JSON.parse(trimmed);
  } catch {
    return false;
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  if (data.error) return true;
  if (data.response != null && data.choices == null) {
    try {
      const nested = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
      if (nested && typeof nested === 'object') data = nested;
    } catch {}
  }
  const choice = data?.choices?.[0];
  const content = choice?.message?.content ?? choice?.text;
  if (typeof content === 'string' && content.trim()) return true;
  const reasoning = typeof choice?.message?.reasoning_content === 'string'
    ? choice.message.reasoning_content
    : (typeof choice?.message?.reasoning === 'string' ? choice.message.reasoning : '');
  return typeof reasoning === 'string' && reasoning.trim().length > 0;
}

// TauriTavern 宿主代理在后端请求失败时，会把错误文本包装成 chat.completion
// 形状的响应（content 以 [API 错误] / [后端错误] 开头，或直接是
// "Network request failed. (...)"），而不是返回非 2xx 或 {error} 信封。
// 这类内容不是模型回复，必须识别出来，否则下游（剧情预筛等）会把错误文本
// 当 AI 内容解析，报出误导性的 JSON 解析错误。
function isHostErrorEnvelopeContent(content) {
  const text = String(content || '').trim();
  return /^\[[^\]]*错误\]/.test(text)
    || /^(?:网络请求失败|Network request failed)/i.test(text);
}

async function fetchText(url, options = {}) {
  const { timeoutMs, signal, ...fetchOptions } = options;
  const limitMs = Number(timeoutMs) > 0 ? Number(timeoutMs) : DEFAULT_API_TIMEOUT_MS;
  const controller = limitMs > 0 && typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  let externalAbortHandler = null;
  if (controller) {
    if (signal && typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
      fetchOptions.signal = AbortSignal.any([controller.signal, signal]);
    } else {
      fetchOptions.signal = controller.signal;
      if (signal) {
        if (signal.aborted) {
          controller.abort();
        } else {
          externalAbortHandler = () => {
            try {
              controller.abort();
            } catch {}
          };
          signal.addEventListener('abort', externalAbortHandler, { once: true });
        }
      }
    }
    timer = setTimeout(() => {
      try {
        controller.abort();
      } catch {}
    }, limitMs);
  } else if (signal) {
    fetchOptions.signal = signal;
  }
  try {
    const response = await fetch(url, fetchOptions);
    const responseText = await response.text();
    return { response, responseText };
  } finally {
    if (timer) clearTimeout(timer);
    if (externalAbortHandler && signal) signal.removeEventListener('abort', externalAbortHandler);
  }
}

async function requestHostProxyModelList(apiBase, settings) {
  return fetchText('/api/backends/chat-completions/status', {
    method: 'POST',
    headers: getHostProxyHeaders(),
    body: JSON.stringify(buildHostProxyConfig(apiBase, settings)),
    cache: 'no-cache',
    timeoutMs: MODEL_LIST_TIMEOUT_MS,
  });
}

// 拉取 OpenAI 兼容 /models 列表；跨域走宿主代理，失败自动回退直连。
async function fetchModelList(settings) {
  const apiBase = getApiBase(settings);
  if (!apiBase) throw new Error('请先填写 API Base URL');
  const url = `${apiBase}/models`;
  const useHostProxy = isCrossOriginUrl(url);
  let response = null;
  let responseText = '';
  let transport = useHostProxy ? 'host-proxy' : 'direct';
  logApp('debug', `拉取模型列表: ${transport}`, url);
  try {
    if (useHostProxy) {
      let proxyError = null;
      try {
        ({ response, responseText } = await requestHostProxyModelList(apiBase, settings));
      } catch (error) {
        proxyError = error;
        console.warn(`[${MODULE_DISPLAY_NAME}] host proxy model list failed, trying direct`, error);
      }
      if (proxyError || (!response?.ok && shouldFallbackFromHostProxy(responseText, response?.status))) {
        transport = 'direct-after-proxy-fallback';
        ({ response, responseText } = await fetchText(url, { method: 'GET', headers: getAuthHeaders(settings), timeoutMs: MODEL_LIST_TIMEOUT_MS }));
      }
    } else {
      ({ response, responseText } = await fetchText(url, { method: 'GET', headers: getAuthHeaders(settings), timeoutMs: MODEL_LIST_TIMEOUT_MS }));
    }
  } catch (error) {
    throw new Error(`模型列表连接失败（${transport}）。请检查 Base URL / API Key；也可手动填写模型名称后直接使用。原始错误: ${String(error?.message || error)}`);
  }
  if (!response?.ok) {
    throw new Error(`模型列表请求失败 ${response?.status}（${transport}）: ${String(responseText || '').slice(0, 240)}。如果此 API 不支持 /models，可手动填写模型名称。`);
  }
  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`模型列表响应不是 JSON（${transport}）: ${String(responseText || '').slice(0, 180)}`);
  }
  if (data && typeof data === 'object' && data.data == null && data.models == null && data.response) {
    try {
      const nested = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
      if (nested && typeof nested === 'object') data = nested;
    } catch {}
  }
  const modelItems = Array.isArray(data?.data)
    ? data.data
    : (Array.isArray(data?.models) ? data.models : (Array.isArray(data) ? data : []));
  const models = modelItems
    .map((item) => (typeof item === 'string'
      ? item.trim()
      : String(item?.id || item?.name || item?.model || '').trim()))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  if (models.length === 0) throw new Error('API 有响应，但没有返回可用模型；可手动填写模型名称。');
  logApp('info', `模型列表拉取成功（${transport}）: ${models.length} 个模型`);
  return models;
}

// ---------- AI 对话（OpenAI 兼容 chat/completions）----------
// 这是后续「动态叙事引擎」的基础：剧情分析、模块选择、上下文注入都会经由此处。
function createChatError(message, retryable = false) {
  const error = new Error(message);
  error.name = 'KaleidoChatError';
  error.retryable = retryable;
  return error;
}

function createCancelError() {
  const error = new Error('请求已取消');
  error.name = 'KaleidoCancelError';
  return error;
}

async function sleepAbortable(ms, signal) {
  if (signal?.aborted) throw createCancelError();
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });
  if (signal?.aborted) throw createCancelError();
}

// 并发限制：占住一个并发名额再发送；多出的请求排队等待，前面的请求完成后再放行。
// 整个任务（含自动重试）占用同一个名额，任务结束或取消时立即释放。
const apiConcurrencyState = {
  running: 0,
  queue: [],
};

async function acquireApiConcurrencySlot(settings, signal) {
  const enabled = settings?.apiConcurrencyEnabled !== false;
  const limit = Math.min(10, Math.max(1, Math.floor(Number(settings?.apiConcurrencyLimit) || 1)));
  if (!enabled || apiConcurrencyState.running < limit) {
    apiConcurrencyState.running += 1;
    return releaseApiConcurrencySlot;
  }
  if (signal?.aborted) throw createCancelError();
  // 排队等待空闲名额；中途取消会立即出队并抛取消错误，避免请求滞留在队列里。
  const waiter = { resolve: null, reject: null, onAbort: null };
  const queued = new Promise((resolve, reject) => {
    waiter.resolve = resolve;
    waiter.reject = reject;
  });
  waiter.onAbort = () => {
    const index = apiConcurrencyState.queue.indexOf(waiter);
    if (index >= 0) {
      apiConcurrencyState.queue.splice(index, 1);
      waiter.reject(createCancelError());
    }
  };
  if (signal) {
    if (signal.aborted) throw createCancelError();
    signal.addEventListener('abort', waiter.onAbort, { once: true });
  }
  apiConcurrencyState.queue.push(waiter);
  if (signal?.aborted) waiter.onAbort();
  logApp('debug', 'API 并发已满，请求排队等待', `上限 ${limit} · 队列 ${apiConcurrencyState.queue.length}`);
  try {
    await queued;
  } finally {
    if (signal) signal.removeEventListener('abort', waiter.onAbort);
  }
  apiConcurrencyState.running += 1;
  return releaseApiConcurrencySlot;
}

function releaseApiConcurrencySlot() {
  apiConcurrencyState.running = Math.max(0, apiConcurrencyState.running - 1);
  const next = apiConcurrencyState.queue.shift();
  if (next) next.resolve();
}

async function requestHostProxyChatCompletion(apiBase, settings, body, signal) {
  return fetchText('/api/backends/chat-completions/generate', {
    method: 'POST',
    headers: getHostProxyHeaders(),
    body: JSON.stringify(buildHostProxyChatConfig(apiBase, settings, body)),
    cache: 'no-cache',
    timeoutMs: CHAT_COMPLETION_TIMEOUT_MS,
    signal,
  });
}

async function requestChatCompletionOnce(apiBase, settings, body, signal) {
  const url = `${apiBase}/chat/completions`;
  const useHostProxy = isCrossOriginUrl(url);
  let response = null;
  let responseText = '';
  let transport = useHostProxy ? 'host-proxy' : 'direct';
  try {
    if (useHostProxy) {
      let proxyError = null;
      try {
        ({ response, responseText } = await requestHostProxyChatCompletion(apiBase, settings, body, signal));
      } catch (error) {
        proxyError = error;
        console.warn(`[${MODULE_DISPLAY_NAME}] host proxy chat failed, trying direct`, error);
      }
      const proxyLooksBroken = !response?.ok || !looksLikeJson(responseText) || !responseContainsUsableText(responseText);
      if (proxyError || proxyLooksBroken || shouldFallbackFromHostProxy(responseText, response?.status)) {
        transport = 'direct-after-proxy-fallback';
        ({ response, responseText } = await fetchText(url, {
          method: 'POST',
          headers: getAuthHeaders(settings),
          body: JSON.stringify(body),
          timeoutMs: CHAT_COMPLETION_TIMEOUT_MS,
          signal,
        }));
      }
    } else {
      ({ response, responseText } = await fetchText(url, {
        method: 'POST',
        headers: getAuthHeaders(settings),
        body: JSON.stringify(body),
        timeoutMs: CHAT_COMPLETION_TIMEOUT_MS,
        signal,
      }));
    }
  } catch (error) {
    if (signal?.aborted) throw createCancelError();
    throw createChatError(`对话请求失败（${transport}）。请检查 API 配置。原始错误: ${String(error?.message || error)}`);
  }
  if (!response?.ok) {
    const transient = response?.status === 429 || (response?.status >= 500 && response?.status < 600);
    throw createChatError(`对话请求失败 ${response?.status}（${transport}）: ${String(responseText || '').slice(0, 240)}`, transient);
  }
  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw createChatError(`对话响应不是 JSON（${transport}）: ${String(responseText || '').slice(0, 180)}`);
  }
  if (data && typeof data === 'object' && data.error) {
    const errorMessage = typeof data.error === 'string'
      ? data.error
      : (data.error.message || JSON.stringify(data.error));
    const transient = /(?:429|5\d\d|overload|busy|try again|temporarily|rate\s*limit|too\s*many)/i.test(String(errorMessage));
    throw createChatError(`上游 API 返回错误（${transport}）: ${String(errorMessage).slice(0, 240)}`, transient);
  }
  if (data && typeof data === 'object' && data.response != null && data.choices == null) {
    try {
      const nested = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
      if (nested && typeof nested === 'object') data = nested;
    } catch {}
  }
  const choice = data?.choices?.[0];
  const content = choice?.message?.content ?? choice?.text;
  if (typeof content !== 'string' || !content.trim()) {
    // 带思考能力的模型偶发把答案写进 reasoning_content、content 留空——兜底取用。
    const reasoning = typeof choice?.message?.reasoning_content === 'string'
      ? choice.message.reasoning_content
      : (typeof choice?.message?.reasoning === 'string' ? choice.message.reasoning : '');
    if (reasoning.trim()) {
      logApp('warn', 'AI 回复内容位于 reasoning_content 字段', `${transport} · ${reasoning.length} 字符`);
      return { content: reasoning, transport };
    }
    const errorMessage = data?.error?.message ? `: ${data.error.message}` : '';
    const finishReason = choice?.finish_reason ? `finish_reason=${choice.finish_reason}` : '';
    const budgetHint = finishReason === 'length'
      ? '（疑似思考阶段耗尽输出预算：请调大 max_tokens 或改用非推理模型）'
      : '';
    throw createChatError(`AI 未返回文本内容（${transport}）${errorMessage}${finishReason ? `（${finishReason}）` : ''}${budgetHint}`, true);
  }
  if (isHostErrorEnvelopeContent(content)) {
    const transient = /(?:网络|network|timeout|timed\s*out|failed|失败|超时)/i.test(content);
    throw createChatError(`上游 API 返回错误（${transport}）: ${content.slice(0, 240)}`, transient);
  }
  return { content, transport };
}

// 通用对话请求：OpenAI 兼容，自动处理跨域宿主代理回退、超时、重试与并发限制。
async function chatCompletion(settings, messages, options = {}) {
  const apiBase = getApiBase(settings);
  if (!apiBase) throw new Error('请先在「API 连接」中配置 Base URL');
  const model = String(settings?.model || '').trim();
  if (!model) throw new Error('请先在「API 连接」中选择模型');
  const body = {
    model,
    messages,
    stream: false,
    temperature: Number.isFinite(options.temperature) ? options.temperature : 0.2,
    max_tokens: Number.isFinite(options.maxTokens) && options.maxTokens > 0
      ? Math.floor(options.maxTokens)
      : CHAT_COMPLETION_DEFAULT_MAX_TOKENS,
  };
  const reasoningEffort = String(settings?.apiReasoningEffort || '').trim();
  if (reasoningEffort) body.reasoning_effort = reasoningEffort;
  const maxAttempts = Math.max(1, Math.min(5, Number(options.maxAttempts) > 0 ? Number(options.maxAttempts) : CHAT_COMPLETION_MAX_ATTEMPTS));
  const release = await acquireApiConcurrencySlot(settings, options.signal);
  try {
    logApp('debug', '发送 AI 对话请求', `${model} · ${isCrossOriginUrl(`${apiBase}/chat/completions`) ? 'host-proxy' : 'direct'}`);
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (options.signal?.aborted) throw createCancelError();
      try {
        const { content, transport } = await requestChatCompletionOnce(apiBase, settings, body, options.signal);
        if (attempt > 1) {
          logApp('info', 'AI 对话请求重试成功', `${model} · ${transport} · 第 ${attempt}/${maxAttempts} 次`);
        } else {
          logApp('debug', 'AI 对话响应已接收', `${model} · ${transport}`);
        }
        return content;
      } catch (error) {
        if (options.signal?.aborted) throw createCancelError();
        lastError = error;
        const retryable = error?.retryable === true;
        if (retryable && attempt < maxAttempts) {
          const delayMs = CHAT_COMPLETION_RETRY_DELAY_MS * attempt;
          logApp('warn', 'AI 对话请求异常，稍后自动重试', `${model} · 第 ${attempt}/${maxAttempts} 次 · ${String(error.message || error).slice(0, 140)}`);
          await sleepAbortable(delayMs, options.signal);
          continue;
        }
        if (retryable && attempt > 1) {
          throw createChatError(`${String(error.message || error)}（已自动重试 ${attempt - 1} 次）`, true);
        }
        throw error;
      }
    }
    throw lastError || new Error('AI 对话请求失败');
  } finally {
    release();
  }
}

// 解析 AI 返回的 JSON：支持 ```json 代码块包裹，自动截取首尾花括号。
function parseAgentJson(text) {
  const source = String(text || '').trim();
  const fenced = source.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const candidate = fenced ? fenced[1].trim() : source;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(candidate.slice(start, end + 1));
    } catch {}
  }
  try {
    return JSON.parse(candidate);
  } catch (error) {
    throw new Error(`AI 返回内容无法解析为 JSON：${String(error?.message || error)}`);
  }
}
