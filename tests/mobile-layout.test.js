'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const constants = read('js/constants.js');
const shell = read('js/ui-shell.js');
const bundle = read('index.js');
const style = read('style.css');
const requiredModes = [
  'is-home-mode',
  'is-api-mode',
  'is-log-mode',
  'is-preset-mode',
  'is-inject-mode',
];

assert(constants.includes('const PANEL_MOBILE_MODES'), 'js/constants.js 缺少 const PANEL_MOBILE_MODES');
assert(shell.includes('PANEL_MOBILE_MODES'), 'js/ui-shell.js 缺少 PANEL_MOBILE_MODES');
assert(bundle.includes('PANEL_MOBILE_MODES'), 'index.js 缺少 PANEL_MOBILE_MODES');

for (const mode of requiredModes) {
  assert(constants.includes(mode), `js/constants.js 缺少移动端模式 ${mode}`);
  assert(shell.includes('PANEL_MOBILE_MODES'), 'js/ui-shell.js 未在视图切换时应用 PANEL_MOBILE_MODES');
  assert(bundle.includes(mode), `index.js 缺少移动端模式 ${mode}`);
  assert(style.includes(`.kaleido-panel__dialog.${mode}`), `style.css 缺少面板模式规则 ${mode}`);
}

const lastMobileStart = style.lastIndexOf('@media (max-width: 640px)');
assert(lastMobileStart !== -1, 'style.css 缺少 @media (max-width: 640px)');
const lastMobileStyle = style.slice(lastMobileStart);
const panelRule = lastMobileStyle.match(/\.kaleido-panel__dialog\.kaleido-panel__dialog\s*\{([^}]*)\}/);
assert(panelRule, '最后一个移动端媒体查询缺少面板规则');
assert(!/\bwidth\s*:\s*100vw\b/.test(panelRule[1]), '移动端面板规则不应包含 width:100vw');
assert(!/\bheight\s*:\s*100dvh\b/.test(panelRule[1]), '移动端面板规则不应包含 height:100dvh');
assert(/\bborder-radius\s*:\s*10px\b/.test(panelRule[1]), '移动端面板规则应包含 border-radius:10px');

// 移动端面板应可拖动定位（与 SoulLink 一致）：标题栏拖拽不再被
// isMobileViewport() 拦截，拖动后由 is-user-positioned 解除 CSS 布局约束。
assert(shell.includes('is-user-positioned'), 'js/ui-shell.js 缺少 is-user-positioned 用户定位状态');
assert(shell.includes('dialog.getBoundingClientRect()'), 'js/ui-shell.js 应基于视觉位置计算拖拽偏移');
assert(bundle.includes('is-user-positioned'), 'index.js 缺少 is-user-positioned 用户定位状态');
assert(style.includes('.kaleido-panel__dialog.is-user-positioned'), 'style.css 缺少移动端 is-user-positioned 规则');
assert(!style.includes('left: 14px !important'), '移动端面板规则不应再以 !important 固定 left');
assert(!style.includes('left: 50% !important'), '移动端居中规则不应再以 !important 固定 left');
assert(!style.includes('left: 10px !important'), '移动端大浮窗规则不应再以 !important 固定 left');
assert(/\.kaleido-panel__header\s*\{[^}]*touch-action:\s*none/.test(style), '标题栏应设置 touch-action: none，避免触屏拖动被 pointercancel 打断');

const firstStoryMobileRule = style.match(
  /@media \(max-width: 640px\)[\s\S]*?\.kaleido-story-dialog__inner\s*\{([^}]*)\}/,
);
assert(firstStoryMobileRule, '缺少剧情脉络的移动端 .kaleido-story-dialog__inner 规则');
assert(/\bwidth\s*:\s*100vw\b/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则应包含 width:100vw');
assert(/\bheight\s*:\s*100dvh\b/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则应包含 height:100dvh');

console.log('移动端面板分级布局静态检查通过');
