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

// 回归：面板标题栏不叠加安全区 inset（基础规则），剧情工作台窗口不再全屏，同样不叠加。
const baseHeaderRule = style.match(/\.kaleido-panel__header\s*\{([^}]*)\}/);
assert(baseHeaderRule, '缺少 .kaleido-panel__header 基础规则');
assert(!baseHeaderRule[1].includes('env(safe-area-inset-top)'), '面板标题栏不应叠加安全区 inset');
const lastMobileStart = style.lastIndexOf('@media (max-width: 640px)');
assert(lastMobileStart !== -1, 'style.css 缺少 @media (max-width: 640px)');
const lastMobileStyle = style.slice(lastMobileStart);
const storyBodyRule = lastMobileStyle.match(/\.kaleido-story-dialog__body\s*\{([^}]*)\}/);
assert(storyBodyRule && !storyBodyRule[1].includes('env(safe-area-inset-bottom)'), '剧情工作台 body 不应叠加安全区 inset（窗口不再全屏）');

// 剧情脉络工作台移动端与预设模版一致：540px 视窗（视口内自适应），不再全屏。
const firstStoryMobileRule = style.match(
  /@media \(max-width: 640px\)[\s\S]*?\.kaleido-story-dialog__inner\s*\{([^}]*)\}/,
);
assert(firstStoryMobileRule, '缺少剧情脉络的移动端 .kaleido-story-dialog__inner 规则');
assert(/\bwidth\s*:\s*540px\b/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则应包含 width:540px');
assert(/max-width:\s*calc\(100vw - 24px\)/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则应包含 max-width:calc(100vw - 24px)');
assert(/max-height:\s*calc\(100dvh - 24px\)/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则应包含 max-height:calc(100dvh - 24px)');
assert(!/\bwidth\s*:\s*100vw\b/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则不应再全屏 width:100vw');
assert(!/\bheight\s*:\s*100dvh\b/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则不应再全屏 height:100dvh');
// 手机端剧情脉络与其它功能一致：面板内视图（由主页切换进入），不再使用独立对话框。
assert(constants.includes("const STORY_VIEW_ID = 'kaleido-story-view';"), 'js/constants.js 应定义 STORY_VIEW_ID');
assert(constants.includes("[STORY_VIEW_ID]: '剧情脉络'"), 'js/constants.js 应登记剧情脉络视图标题');
assert(constants.includes("[STORY_VIEW_ID]: 'is-story-mode'"), 'js/constants.js 应登记剧情脉络宽视图模式');
assert(shell.includes('isNarrowViewport()'), 'js/ui-shell.js 应按视口分流剧情脉络入口');
assert(shell.includes('showPanelView(STORY_VIEW_ID)'), 'js/ui-shell.js 手机端应走面板视图');
assert(/\.kaleido-story-view\s*\{[^}]*flex-direction:\s*column/.test(style), 'style.css 应有 .kaleido-story-view 布局');
assert(/\.kaleido-panel__dialog\.is-story-mode\s*\{\s*width:\s*540px/.test(style), 'style.css 应有 is-story-mode 540px 宽视图');
assert(/\.kaleido-story__editor\s*\{/.test(style), 'style.css 应有视图内编辑器样式');

// 手机端变量系统导航：隐藏导航项图标（如「变量注册」前的钥匙图标），只留文字标签。
assert(
  /@media \(max-width: 640px\)[\s\S]*?\.kaleido-values__nav-item \.kaleido-values__nav-icon\s*\{\s*display:\s*none;?\s*\}/.test(style),
  'style.css 手机端应隐藏变量系统导航项图标',
);

// 手机端游戏模式：档案封面保持单行（题签「游戏档案」+ 刷新 + 返回主页图标不换行）。
assert(
  /\.kaleido-game__cover\s*\{[^}]*flex-wrap:\s*nowrap/.test(lastMobileStyle),
  'style.css 手机端 .kaleido-game__cover 应保持单行 flex-wrap: nowrap',
);

// 回归：游戏档案数值列不被固定百分比上限截断（窄屏「好感等级 ····· 相谈甚欢、刮目相看」
// 只显示成「相谈甚…」）。数值列应取用名称与点线目次让出的剩余空间（可收缩 + min-width:0），
// 空间真正不足时才省略号兜底；手机端也不应再对数值列二次限宽。
const gameEntryValueRule = style.match(/\.kaleido-game__entry-value\s*\{([^}]*)\}/);
assert(gameEntryValueRule, 'style.css 缺少 .kaleido-game__entry-value 基础规则');
assert(
  /flex:\s*0\s+1\s+auto/.test(gameEntryValueRule[1]),
  '数值列应可收缩（flex: 0 1 auto），超长值才能省略号兜底',
);
assert(
  /min-width:\s*0/.test(gameEntryValueRule[1]),
  '数值列应允许收缩到 0（min-width: 0），否则 flex 无法让位',
);
assert(
  !/max-width/.test(gameEntryValueRule[1]),
  '数值列不应再有固定最大宽度（曾被 44% 上限截断长值）',
);
assert(
  !/@media \(max-width: 640px\)[\s\S]*?\.kaleido-game__entry-value\s*\{[^}]*max-width:\s*40%/.test(style),
  '手机端不应再对数值列施加 40% 最大宽度截断',
);
assert(
  /@media \(max-width: 640px\)[\s\S]*?\.kaleido-game__entry-name\s*\{[^}]*max-width:\s*40%/.test(style),
  '手机端名称列应保留 40% 占比上限，保护点线目次与数值空间',
);

console.log('移动端面板定位静态检查通过');
