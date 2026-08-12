# 移动端面板分级尺寸 Implementation Plan

> **v0.7.9 修订**：本计划中「剧情脉络保持移动端全屏」的决策已被推翻——
> 剧情脉络工作台改为与面板一致的浮窗（尺寸同预设模版 540px），见「重要设计.md」。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让手机端只有「剧情脉络」真正全屏，首页、API 连接、系统日志、预设模版和注入实录按内容需求使用不同大小但保留边距的浮窗。

**Architecture:** 在 `showPanelView` 切换面板视图时同步一个移动端尺寸模式类；`style.css` 只在 `max-width: 640px` 下按模式设置紧凑、中等和大型浮窗。剧情脉络继续由独立的 `.kaleido-story-dialog` 控制，不与普通面板共享全屏规则；桌面端定位与宽视图类保持不变。

**Tech Stack:** 原生 JavaScript、CSS 媒体查询、现有 Node.js 测试脚本、`build.js` 生成构建产物、Browser 进行手机视口渲染验证。

---

### Task 1: 添加移动端尺寸模式的失败回归测试

**Files:**
- Modify: `tests/ui.test.js`（在预设模版视图测试附近增加视图模式断言）
- Create: `tests/mobile-layout.test.js`

- [ ] **Step 1: 在 UI 测试中写出视图切换的失败断言**

在 `tests/ui.test.js` 的预设模版测试之前加入：

```js
runner.test('视图切换同步移动端尺寸模式且清除旧模式', () => {
  ui.createPanel();
  const dialog = $('.kaleido-panel__dialog');
  const modes = {
    'kaleido-home-view': 'is-home-mode',
    'kaleido-api-view': 'is-api-mode',
    'kaleido-log-view': 'is-log-mode',
    'kaleido-preset-view': 'is-preset-mode',
    'kaleido-inject-view': 'is-inject-mode',
  };

  for (const [viewId, mode] of Object.entries(modes)) {
    ui.showPanelView(viewId);
    assert(dialog.classList.contains(mode), `${viewId} 应添加 ${mode}`);
    for (const otherMode of Object.values(modes)) {
      if (otherMode === mode) continue;
      assert(!dialog.classList.contains(otherMode), `${viewId} 不应残留 ${otherMode}`);
    }
  }

  ui.showPanelView('kaleido-home-view');
});
```

- [ ] **Step 2: 创建静态布局回归测试**

创建 `tests/mobile-layout.test.js`，让测试同时检查源码、构建产物和移动端 CSS：

```js
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => { throw new Error(message); };
const requiredModes = [
  'is-home-mode',
  'is-api-mode',
  'is-log-mode',
  'is-preset-mode',
  'is-inject-mode',
];

const constants = read('js/constants.js');
const shell = read('js/ui-shell.js');
const bundle = read('index.js');
const css = read('style.css');

if (!constants.includes('const PANEL_MOBILE_MODES')) {
  fail('js/constants.js 缺少 PANEL_MOBILE_MODES');
}
if (!shell.includes('PANEL_MOBILE_MODES')) {
  fail('js/ui-shell.js 未在视图切换时应用 PANEL_MOBILE_MODES');
}
for (const mode of requiredModes) {
  if (!constants.includes(`'${mode}'`) || !shell.includes(`'${mode}'`)) {
    fail(`源码缺少移动端尺寸模式：${mode}`);
  }
  if (!bundle.includes(`'${mode}'`)) {
    fail(`index.js 未包含移动端尺寸模式：${mode}，请先重新构建`);
  }
  if (!css.includes(`.kaleido-panel__dialog.${mode}`)) {
    fail(`style.css 缺少移动端尺寸规则：${mode}`);
  }
}

const mobileBlock = css.slice(css.lastIndexOf('@media (max-width: 640px)'));
const panelRule = mobileBlock.match(
  /\.kaleido-panel__dialog\.kaleido-panel__dialog\s*\{([\s\S]*?)\n  \}/,
);
if (!panelRule) fail('style.css 缺少普通面板移动端基础规则');
if (/width:\s*100vw/.test(panelRule[1]) || /height:\s*100dvh/.test(panelRule[1])) {
  fail('普通面板基础规则不应再次统一铺满整个手机视口');
}
if (!/border-radius:\s*10px/.test(panelRule[1])) {
  fail('普通面板移动端应保留浮窗圆角');
}

const storyRule = css.match(
  /@media \(max-width: 640px\) \{\s*\.kaleido-story-dialog__inner\s*\{([\s\S]*?)\n  \}/,
);
if (!storyRule) fail('style.css 缺少剧情脉络移动端规则');
if (!/width:\s*100vw/.test(storyRule[1]) || !/height:\s*100dvh/.test(storyRule[1])) {
  fail('剧情脉络移动端仍应铺满动态视口');
}

console.log('移动端面板分级布局静态检查通过');
```

- [ ] **Step 3: 运行失败测试，确认失败来自缺少新行为**

运行：

```powershell
node tests/mobile-layout.test.js
node tests/ui.test.js
```

预期：`mobile-layout.test.js` 报告缺少 `PANEL_MOBILE_MODES` 或对应规则；`ui.test.js` 在新断言处失败，不能是语法错误或测试路径错误。

- [ ] **Step 4: 提交测试基线**

```powershell
git add -- tests/ui.test.js tests/mobile-layout.test.js
git commit -m "test: cover mobile panel sizing modes"
```

### Task 2: 为视图切换添加移动端尺寸模式

**Files:**
- Modify: `js/constants.js`（紧接 `PANEL_WIDE_MODES` 增加移动端模式表）
- Modify: `js/ui-shell.js`（在 `showPanelView` 同步模式类，并修正移动端定位注释）

- [ ] **Step 1: 添加移动端模式表**

在 `js/constants.js` 的 `PANEL_WIDE_MODES` 后加入：

```js
// 移动端面板尺寸模式：仅由手机端 CSS 使用，桌面端不改变尺寸。
const PANEL_MOBILE_MODES = Object.freeze({
  [HOME_VIEW_ID]: 'is-home-mode',
  [API_VIEW_ID]: 'is-api-mode',
  [LOG_VIEW_ID]: 'is-log-mode',
  [PRESET_VIEW_ID]: 'is-preset-mode',
  [INJECT_VIEW_ID]: 'is-inject-mode',
});
```

- [ ] **Step 2: 在 `showPanelView` 切换模式类**

在 `js/ui-shell.js` 的 `showPanelView` 中，保留已有宽视图逻辑，并在其后加入：

```js
  if (dialog) {
    for (const mode of Object.values(PANEL_MOBILE_MODES)) dialog.classList.remove(mode);
    const mobileMode = PANEL_MOBILE_MODES[viewId];
    if (mobileMode) dialog.classList.add(mobileMode);
  }
```

同时把 `setPanelPosition` 中“移动端全屏”的注释改为说明：移动端位置交给 CSS 尺寸模式，普通面板保留浮窗，剧情脉络使用独立工作台。

- [ ] **Step 3: 运行 UI 测试，确认模式行为变绿**

运行：

```powershell
node tests/ui.test.js
```

预期：新增加的模式切换测试通过；`mobile-layout.test.js` 仍可能因为 CSS 或尚未重建的 `index.js` 失败，这个失败属于下一步工作范围。

- [ ] **Step 4: 提交视图模式实现**

```powershell
git add -- js/constants.js js/ui-shell.js
git commit -m "feat: add mobile panel view modes"
```

### Task 3: 用分级 CSS 替换普通面板的统一全屏规则

**Files:**
- Modify: `style.css`（移动端全面适配媒体查询中的普通面板规则）

- [ ] **Step 1: 删除普通面板的统一全屏覆盖**

在 `style.css` 的 `@media (max-width: 640px)` 中，将原来的普通面板规则：

```css
.kaleido-panel__dialog.kaleido-panel__dialog {
  left: 0 !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw;
  max-width: none;
  height: 100vh;
  height: 100dvh;
  max-height: none;
  border-radius: 0;
  border: none;
  box-shadow: none;
}
```

替换为以下分级规则：

```css
  /* ---------- 普通面板：按视图分级的大浮窗 ---------- */
  .kaleido-panel__dialog.kaleido-panel__dialog {
    left: 14px !important;
    top: calc(14px + env(safe-area-inset-top)) !important;
    right: 14px !important;
    bottom: calc(14px + env(safe-area-inset-bottom)) !important;
    width: auto;
    max-width: none;
    height: auto;
    max-height: none;
    border-radius: 10px;
    border: 1.5px solid rgba(59, 51, 42, 0.8);
    box-shadow:
      0 10px 28px rgba(59, 51, 42, 0.3),
      0 0 0 1px rgba(184, 134, 47, 0.35);
  }

  /* 首页与 API：居中的紧凑 / 中等浮窗，内容高度自适应。 */
  .kaleido-panel__dialog.is-home-mode,
  .kaleido-panel__dialog.is-api-mode {
    left: 50% !important;
    right: auto !important;
    top: 50% !important;
    bottom: auto !important;
    transform: translate(-50%, -50%);
    max-width: none;
    max-height: calc(100dvh - 32px);
  }

  .kaleido-panel__dialog.is-home-mode {
    width: min(360px, calc(100vw - 32px));
  }

  .kaleido-panel__dialog.is-api-mode {
    width: min(420px, calc(100vw - 28px));
    max-height: calc(100dvh - 28px);
  }

  /* 日志、预设、注入：给长内容更多空间，但仍保留可见浮窗边距。 */
  .kaleido-panel__dialog.is-log-mode,
  .kaleido-panel__dialog.is-preset-mode,
  .kaleido-panel__dialog.is-inject-mode {
    left: 10px !important;
    top: calc(10px + env(safe-area-inset-top)) !important;
    right: 10px !important;
    bottom: calc(10px + env(safe-area-inset-bottom)) !important;
    transform: none;
  }
```

保留同一媒体查询里剧情脉络的 `.kaleido-story-dialog__inner` 全屏规则不变；保留安全区、表单字号、触控目标和内部滚动规则不变。

- [ ] **Step 2: 运行静态布局测试，确认 CSS 约束通过**

运行：

```powershell
node tests/mobile-layout.test.js
```

预期：如果还未重建 `index.js`，只剩构建产物未包含模式的提示；普通面板不再因 `100vw/100dvh` 触发失败，剧情脉络仍被识别为全屏。

- [ ] **Step 3: 检查样式差异**

运行：

```powershell
git diff --check
```

预期：无空白或换行错误。

- [ ] **Step 4: 提交移动端分级样式**

```powershell
git add -- style.css
git commit -m "fix: size mobile panels by view"
```

### Task 4: 重建并验证宿主实际加载的 JavaScript 构建产物

**Files:**
- Modify: `index.js`（仅由 `build.js` 生成）
- Test: `tests/build.test.js`

- [ ] **Step 1: 重建构建产物**

运行：

```powershell
node build.js
```

预期输出包含 `[build] 已生成 index.js`，且只把 `js/` 源码拼接进 `index.js`。

- [ ] **Step 2: 检查生成文件语法**

运行：

```powershell
node --check index.js
```

预期：退出码为 0，无语法错误。

- [ ] **Step 3: 运行构建与布局一致性测试**

运行：

```powershell
node tests/build.test.js
node tests/mobile-layout.test.js
```

预期：分别报告构建版本一致和移动端面板分级布局静态检查通过。

- [ ] **Step 4: 提交构建产物**

```powershell
git add -- index.js
git commit -m "build: update mobile panel modes"
```

### Task 5: 运行完整自动化测试并检查工作区范围

**Files:**
- Test: `tests/data.test.js`
- Test: `tests/ui.test.js`
- Test: `tests/proxy.test.js`
- Test: `tests/gate.test.js`
- Test: `tests/barrier.test.js`
- Test: `tests/build.test.js`
- Test: `tests/mobile-layout.test.js`

- [ ] **Step 1: 运行全部测试**

运行：

```powershell
node tests/data.test.js
node tests/ui.test.js
node tests/proxy.test.js
node tests/gate.test.js
node tests/barrier.test.js
node tests/build.test.js
node tests/mobile-layout.test.js
```

预期：每个测试进程退出码为 0；没有因本次布局变更产生的新错误或警告。

- [ ] **Step 2: 检查最终差异与未跟踪文件**

运行：

```powershell
git diff --check
git status --short
```

预期：任务变更只包含本计划涉及的测试、`js/` 源码、`style.css`、生成的 `index.js` 和计划文件；工作区已有的未跟踪 RPG 指南保持原样、不纳入提交。

### Task 6: 在桌面与手机视口验证渲染结果

**Files:**
- Verify: `style.css`
- Verify: `index.js`
- Verify: `tests/_mobile_preview.html`
- Verify: `tests/_mobile_preview_story.html`

- [ ] **Step 1: 定义验证流程**

目标流程：

`手机预览加载 -> 首页显示紧凑浮窗 -> 切换 API / 日志 / 预设 / 注入实录 -> 检查分级尺寸 -> 打开剧情脉络 -> 检查工作台全屏`

- [ ] **Step 2: 使用 Browser 检查手机尺寸**

使用 Browser 在 `346×778` 视口检查：

- 页面有有效内容且无框架错误覆盖层；
- 首页有明显边距且不占满高度；
- API 连接为中等浮窗，主要字段和按钮可见；
- 日志、预设模版、注入实录使用大浮窗，圆角和边框可见，长内容在内部滚动；
- 剧情脉络覆盖视口四边，树行名称和操作按钮没有横向裁切；
- 视图切换后没有沿用上一个视图的尺寸模式。

每次切换后读取 DOM 状态并截图，至少保留首页、预设模版和剧情脉络三张证据图。

- [ ] **Step 3: 使用默认桌面视口复查**

在默认桌面视口复查：

- 首页仍使用原有小面板；
- 日志、预设、注入仍使用原有 540px 宽视图；
- 标题栏拖拽定位仍可用；
- 剧情脉络工作台仍是独立大窗口，非普通面板嵌套。

- [ ] **Step 4: 运行完成前验证**

重新运行 `git diff --check` 和所有测试，读取完整输出后再报告结果；未通过的检查必须如实记录，不把“代码已修改”当作“手机端已修复”。
