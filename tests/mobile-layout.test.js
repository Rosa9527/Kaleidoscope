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
  assert(shell.includes(mode), `js/ui-shell.js 缺少移动端模式 ${mode}`);
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

const firstStoryMobileRule = style.match(
  /@media \(max-width: 640px\)[\s\S]*?\.kaleido-story-dialog__inner\s*\{([^}]*)\}/,
);
assert(firstStoryMobileRule, '缺少剧情脉络的移动端 .kaleido-story-dialog__inner 规则');
assert(/\bwidth\s*:\s*100vw\b/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则应包含 width:100vw');
assert(/\bheight\s*:\s*100dvh\b/.test(firstStoryMobileRule[1]), '剧情脉络移动端规则应包含 height:100dvh');

console.log('移动端面板分级布局静态检查通过');
