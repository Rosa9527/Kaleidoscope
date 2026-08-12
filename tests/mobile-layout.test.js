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

// 面板与 SoulLink 一致：不再有移动端尺寸模式，始终由内联 left/top 定位。
assert(!constants.includes('PANEL_MOBILE_MODES'), 'js/constants.js 不应再包含 PANEL_MOBILE_MODES');
assert(!shell.includes('PANEL_MOBILE_MODES'), 'js/ui-shell.js 不应再应用 PANEL_MOBILE_MODES');
assert(!bundle.includes('PANEL_MOBILE_MODES'), 'index.js 不应再包含 PANEL_MOBILE_MODES');
assert(!style.includes('is-home-mode'), 'style.css 不应再包含移动端 is-home-mode 规则');
assert(!style.includes('is-api-mode'), 'style.css 不应再包含移动端 is-api-mode 规则');
assert(!style.includes('is-user-positioned'), 'style.css 不应再包含 is-user-positioned 规则');

// 移动端默认位置不再交给 CSS：ensurePanelPosition 始终写入内联 left/top
//（clamp 在视口内），标题栏始终可见可拖，不会出现「镜中万象」以上部分
// 跑到可见视图上方的问题。
assert(!shell.includes('isMobileViewport'), 'js/ui-shell.js 不应再包含 isMobileViewport 跳过逻辑');
assert(!bundle.includes('isMobileViewport'), 'index.js 不应再包含 isMobileViewport 跳过逻辑');
assert(shell.includes('dialog.style.left'), 'js/ui-shell.js 应始终写入内联 left');
assert(shell.includes('dialog.style.top'), 'js/ui-shell.js 应始终写入内联 top');
assert(bundle.includes('dialog.style.left'), 'index.js 应始终写入内联 left');

// 标题栏可拖拽（与 SoulLink 一致）：基于视觉位置计算偏移，触屏不被 pointercancel 打断。
assert(shell.includes('dialog.getBoundingClientRect()'), 'js/ui-shell.js 应基于视觉位置计算拖拽偏移');
assert(/\.kaleido-panel__header\s*\{[^}]*touch-action:\s*none/.test(style), '标题栏应设置 touch-action: none，避免触屏拖动被 pointercancel 打断');

// 回归：面板标题栏不叠加安全区 inset（基础规则），剧情工作台标题栏保留（全屏工作台需要）。
const baseHeaderRule = style.match(/\.kaleido-panel__header\s*\{([^}]*)\}/);
assert(baseHeaderRule, '缺少 .kaleido-panel__header 基础规则');
assert(!baseHeaderRule[1].includes('env(safe-area-inset-top)'), '面板标题栏不应叠加安全区 inset');
const lastMobileStart = style.lastIndexOf('@media (max-width: 640px)');
assert(lastMobileStart !== -1, 'style.css 缺少 @media (max-width: 640px)');
const lastMobileStyle = style.slice(lastMobileStart);
const storyHeaderRule = lastMobileStyle.match(/\.kaleido-story-dialog__header\s*\{([^}]*)\}/);
assert(storyHeaderRule && storyHeaderRule[1].includes('env(safe-area-inset-top)'), '剧情工作台标题栏应保留安全区 inset（全屏工作台仍需要）');

// 剧情脉络工作台仍为移动端全屏。
const firstStoryMobileRule = style.match(
  /@media \(max-width: 640px\)[\s\S]*?\.kaleido-story-dialog__inner\s*\{([^}]*)\}/,
);
assert(firstStoryMobileRule, '缺少剧情脉络的移动端 .kaleido-story-dialog__inner 规则');
assert(/\bwidth\s*:\s*100vw\b/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则应包含 width:100vw');
assert(/\bheight\s*:\s*100dvh\b/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则应包含 height:100dvh');

console.log('移动端面板定位静态检查通过');
