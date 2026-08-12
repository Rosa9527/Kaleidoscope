# 移动端面板定位设计（与 SoulLink 一致）

> **v0.7.9 修订**：剧情脉络工作台不再移动端全屏，改为与面板一致的浮窗
> （内联 left/top 定位 + 标题栏拖拽，尺寸同预设模版 540px），见「重要设计.md」。

日期：2026-08-12（v0.7.8 修订）

## 目标

修正 SillyTavern 手机端的面板默认位置：

- 面板（首页 / API / 日志 / 预设 / 注入）在手机端与桌面端行为一致：始终由
  内联 `left/top` 定位并 clamp 在视口内，标题栏永远可见、可长按拖动。
- 不再出现「镜中万象」标语以上部分（含「万华镜」标题栏）跑到可见视图上方的
  问题——旧设计首页浮窗用 `top: 50% + translate(-50%,-50%)` 居中，内容高于
  视口（或 WebView 不支持 `dvh`）时顶部溢出屏幕，标题栏无法拖动。
- 「剧情脉络」继续作为独立工作台，v0.7.9 起与面板一致：浮窗尺寸（同预设模版 540px），不再移动端全屏。
- 桌面端现有尺寸、拖拽和视图行为保持不变。

## 设计

### 1. 面板定位（同 SoulLink）

- `ensurePanelPosition` 不再区分移动端：面板打开、视图切换、窗口 resize 时
  始终调用 `setPanelPosition`，写入内联 `left/top` 并 clamp 在视口内
  （`EDGE_GAP=24`，顶部最小为 0）。
- 默认位置为右上角（`left = max(EDGE_GAP, innerWidth - 宽度 - EDGE_GAP)`，
  `top = EDGE_GAP`）；用户拖动后位置记在 `panel.dataset`（会话内记忆）。
- 删除 `isMobileViewport()` 与移动端 CSS 尺寸模式（`PANEL_MOBILE_MODES`、
  `is-home-mode` / `is-api-mode` / `is-user-positioned` 等规则）。

### 2. 移动端保留的适配

- 面板主体与页脚保留底部安全区内边距（`env(safe-area-inset-bottom)`）。
- 表单控件 16px 字号防 iOS 聚焦自动放大、触控目标放大、overscroll 隔离等
  规则继续保留。
- 标题栏 `touch-action: none`，触屏拖动不被 `pointercancel` 打断。

### 3. 剧情脉络工作台

- v0.7.9 起与面板一致：独立遮罩 + 浮窗对话框（内联 left/top 定位、标题栏拖拽、
  尺寸同预设模版 540px），不再移动端全屏，标题栏不再叠加安全区顶部 inset。

## 测试策略

1. 静态回归（`tests/mobile-layout.test.js`）：断言不再存在移动端尺寸模式、
   `ensurePanelPosition` 始终写内联 left/top、面板标题栏无安全区叠加、
   工作台仍全屏。
2. UI 回归（`tests/ui.test.js`）：打开面板后对话框已写入内联 left/top，
   right/bottom 为 auto、transform 为 none。
3. 运行现有数据、UI、代理、剧情预筛、发送屏障和构建一致性测试。

## 验收标准

- 手机端打开任意面板视图，标题栏始终在可见视口内，可长按拖动。
- 拖动后位置 clamp 在视口内，不会把标题栏拖出屏幕。
- 剧情脉络工作台在手机端与预设模版同为浮窗：默认右上角、可拖拽、不再全屏。
- 桌面端现有体验与所有现有自动化测试不受影响。