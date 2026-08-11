// 万华镜宿主代理测试：对话端点 /generate、请求体格式、损坏响应回退直连。
'use strict';
const { readSources, loadInContext, createRunner, makeContext } = require('./harness');

const quietConsole = {
  log() {}, info() {}, debug() {},
  warn(...args) { console.warn(...args); },
  error(...args) { console.error(...args); },
};
const hostCtx = makeContext();
const sandbox = {
  console: quietConsole,
  Luker: { getContext: () => hostCtx },
  location: { origin: 'http://localhost:8000', href: 'http://localhost:8000/' },
  URL: globalThis.URL,
  AbortController: globalThis.AbortController,
  setTimeout, clearTimeout,
};
const ctx = loadInContext(sandbox, readSources());
const runner = createRunner();
const assert = (condition, message) => { if (!condition) throw new Error(message || '断言失败'); };

function jsonResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, text: async () => JSON.stringify(body) };
}

runner.test('responseContainsUsableText：模型列表判为无内容', () => {
  const usable = ctx.responseContainsUsableText('{"data":[{"id":"deepseek-v4-flash:0731"}],"object":"list"}');
  assert(usable === false, '模型列表不应视为可用文本');
});

runner.test('responseContainsUsableText：正常对话响应可用', () => {
  assert(ctx.responseContainsUsableText('{"choices":[{"message":{"content":"你好"}}]}') === true);
});

runner.test('responseContainsUsableText：content 空但 reasoning_content 有内容可用', () => {
  assert(ctx.responseContainsUsableText('{"choices":[{"message":{"content":"","reasoning_content":"思考"}}]}') === true);
});

runner.test('responseContainsUsableText：全空判为无内容', () => {
  assert(ctx.responseContainsUsableText('{"choices":[{"message":{"content":""}}]}') === false);
});

runner.test('responseContainsUsableText：错误信封不算缺内容', () => {
  assert(ctx.responseContainsUsableText('{"error":{"message":"boom"}}') === true);
});

runner.test('responseContainsUsableText：HTML 判为无内容', () => {
  assert(ctx.responseContainsUsableText('<!DOCTYPE html><html></html>') === false);
});

runner.test('buildHostProxyChatConfig：custom_include_headers 带引号', () => {
  const config = ctx.buildHostProxyChatConfig('https://ollama.com/v1', { apiKey: 'sk-123' }, { model: 'm', messages: [], stream: false });
  assert(config.chat_completion_source === 'custom', 'source 应为 custom');
  assert(config.custom_url === 'https://ollama.com/v1', 'custom_url 应保留');
  assert(config.custom_include_headers === 'Authorization: "Bearer sk-123"', 'Authorization 值应带引号');
  assert(config.model === 'm' && Array.isArray(config.messages), 'body 字段应平铺');
});

runner.test('requestHostProxyChatCompletion：POST 到 /generate 端点', async () => {
  let capturedUrl = null;
  let capturedBody = null;
  sandbox.fetch = async (url, init) => {
    capturedUrl = url;
    capturedBody = JSON.parse(init.body);
    return jsonResponse({ choices: [{ message: { content: 'ok' } }] });
  };
  const result = await ctx.requestHostProxyChatCompletion('https://ollama.com/v1', { apiKey: 'sk-123' }, { model: 'm', messages: [], stream: false });
  assert(capturedUrl === '/api/backends/chat-completions/generate', '应请求 /generate，实际 ' + capturedUrl);
  assert(capturedBody.custom_include_headers === 'Authorization: "Bearer sk-123"', '请求体应带引号格式');
  assert(result.response.ok === true, '应返回响应');
});

runner.test('isHostErrorEnvelopeContent：识别宿主 [API 错误] 信封', () => {
  assert(ctx.isHostErrorEnvelopeContent('[API 错误]\n网络请求失败：Network request failed. (https://ollama.com/v1/chat/completions)') === true);
});

runner.test('isHostErrorEnvelopeContent：识别 [后端错误] 信封', () => {
  assert(ctx.isHostErrorEnvelopeContent('[后端错误] 上游超时') === true);
});

runner.test('isHostErrorEnvelopeContent：识别裸 Network request failed', () => {
  assert(ctx.isHostErrorEnvelopeContent('Network request failed. (https://ollama.com/v1/chat/completions)') === true);
});

runner.test('isHostErrorEnvelopeContent：正常模型回复不算信封', () => {
  assert(ctx.isHostErrorEnvelopeContent('{"events":["vol1-002"]}') === false);
  assert(ctx.isHostErrorEnvelopeContent('你好，这里是剧情回复') === false);
});

runner.test('requestChatCompletionOnce：代理返回错误信封时抛清晰错误而非当内容返回', async () => {
  sandbox.fetch = async (url) => {
    if (url === '/api/backends/chat-completions/generate') {
      return jsonResponse({ choices: [{ message: { content: '[API 错误]\n网络请求失败：Network request failed. (https://ollama.com/v1/chat/completions)' } }] });
    }
    throw new Error('不应回退直连');
  };
  let thrown = null;
  try {
    await ctx.requestChatCompletionOnce('https://ollama.com/v1', { apiKey: 'sk-123' }, { model: 'm', messages: [], stream: false });
  } catch (error) {
    thrown = error;
  }
  assert(thrown, '应抛出错误');
  assert(/上游 API 返回错误/.test(thrown.message), '错误应标明上游 API 错误，实际: ' + thrown.message);
  assert(/网络请求失败/.test(thrown.message), '错误应包含宿主错误原文，实际: ' + thrown.message);
  assert(thrown.retryable === true, '网络类错误应可重试');
});

runner.test('requestChatCompletionOnce：代理返回模型列表时回退直连', async () => {
  const calls = [];
  sandbox.fetch = async (url, init) => {
    calls.push(url);
    if (url === '/api/backends/chat-completions/generate') {
      return jsonResponse({ data: [{ id: 'deepseek-v4-flash:0731' }], object: 'list' });
    }
    return jsonResponse({ choices: [{ message: { content: '直连回复' } }] });
  };
  const result = await ctx.requestChatCompletionOnce('https://ollama.com/v1', { apiKey: 'sk-123' }, { model: 'm', messages: [], stream: false });
  assert(result.content === '直连回复', '应回退直连拿到内容');
  assert(result.transport === 'direct-after-proxy-fallback', 'transport 应为 direct-after-proxy-fallback');
  assert(calls.length === 2, '应先代理后直连，实际调用 ' + calls.length + ' 次');
});

runner.run();
