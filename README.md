# 万华镜（Kaleidoscope）

一套基于 LLM 的动态叙事引擎的 SillyTavern / TauriTavern 插件（当前版本 v1.0.0）。

> 万华镜允许作者将预先设计好的剧情、世界观、事件节点等内容以多层级文件结构进行组织，
> 在运行时由 AI 根据当前对话状态、角色行为和剧情进展，自动分析并选择需要读取的剧情模块，
> 将相关内容动态注入上下文，从而实现非线性的剧情推进。

## 当前版本（v1.0.9）包含

- **彩虹风车悬浮球**：玻璃底 + 旋转彩虹风车（fa-fan）图标，可拖拽、点击打开面板、长按隐藏。
- **主题切换**：页脚主题按钮可切换皮肤——「古风典雅」（默认，宣纸底 + 墨色描边 + 朱砂印章 + 鎏金点缀，楷体字，仿 SoulLink 同款主题）与「macOS 风格」（玻璃 / 圆角 / 蓝紫强调，亮暗自适应），选择后即时生效并持久化。
- **API 连接**：Base URL / API Key / 模型列表 / 并发限制 / 思考强度；跨域走宿主代理并自动回退直连。
- **扩展菜单入口**：宿主 API 注册 + 手动注入双保险。
- **剧情脉络（可视化工作台）**：树状工作台，支持节点 / 事件的新建、编辑、删除、导入导出与角色卡绑定。
- **系统日志**：面板内日志视图，支持过滤、暂停、跟随、清空、复制、导出。
- **首页**：Logo 英雄区 + 功能一览行列表。
- **游戏模式**：玩家数据展示面板，只读展示变量系统注入的变量。
- **对话请求基础**：`chatCompletion`（OpenAI 兼容）。
- **剧情预筛（Story Gate）**：发送前预筛并注入事件正文。
- **跨扩展发送屏障**：与 SoulLink 并发协调发送前任务。
- **注入实录**：展示最近一轮剧情预筛的完整结果。
- **变量系统**：玩家自定义变量系统，支持变量注册、双层存储、AI 自动维护、注入提示词。

## 目录结构

```
Kaleidoscope/
├── manifest.json          # 插件清单（宿主读取）
├── index.js               # 构建产物（由 build.js 生成，勿手改）
├── style.css              # 界面样式：macOS 风格基础 + 古风典雅主题覆盖（亮/暗双主题）
├── build.js / build.bat   # 构建脚本（拼接 js/ → index.js）
├── js/
│   ├── constants.js       # 全局常量（DOM ID / 设置默认值 / 超时）
│   ├── utils.js           # 设置读写 / API 请求 / chatCompletion
│   ├── host.js            # 宿主适配（SillyTavern / TauriTavern）
│   ├── send-barrier.js     # 跨扩展发送屏障：与 SoulLink 并发协调发送前任务
│   ├── ui-shell.js        # 悬浮球 / 面板 / 视图切换
│   ├── views-api.js       # API 连接视图 UI
│   ├── views-log.js       # 系统日志：捕获 / 存储 / 视图 UI
│   ├── views-home.js      # 首页状态
│   ├── views-inject.js    # 注入实录：最近一轮预筛结果详情视图
│   ├── story-data.js      # 剧情脉络：数据模型 / YAML 导入导出 / 合并
│   ├── story-gate.js      # 剧情预筛：Gate 预筛 + 事件注入（messageSent 阻塞，经发送屏障并发）
│   ├── views-story.js     # 剧情脉络：可视化树状工作台 UI
│   ├── values-data.js     # 变量系统：变量注册表 / 双层存储 / YAML 导入导出 / 补丁合并
│   ├── values-maintain.js # 变量自动维护：generationEnded 后 AI 维护游戏值
│   ├── values-inject.js   # 变量注入：勾选条目发送前注入提示词（World Info after 之后）
│   ├── views-values.js    # 变量工作台 UI（变量树 + 变量注册 + 自动维护状态）
│   └── main.js            # 入口：bootstrap / 菜单注册 / 事件看门狗
├── tests/                 # 开发测试（data / ui / proxy / gate / barrier，不参与构建）
├── 剧情脉络语法指南.md      # 剧情脉络文件格式与编写方法
├── 变量系统指南.md          # 变量系统：变量注册 / 双层变量 / AI 自动维护
├── RPG剧情脉络制作指南.md    # RPG 剧本制作方法（详细版）
├── RPG剧情脉络语法指南.md    # RPG 语法与概念速查
├── 开发日志.md            # 开发进度（按日期）
├── 开发日志-归档.md       # 历史开发日志归档（v0.1.x）
├── 重要开发经验.md        # 踩坑与解决方案
├── 重要设计.md            # 架构与设计决策
└── README.md
```

## 开发与构建

改 `js/` 下的源码，**不要手改 index.js**；构建产物会被覆盖。

```bash
node build.js          # 一次性构建
node build.js --watch  # 监听 js/ 变更自动重建
```

改完构建后重启酒馆（或热重载扩展）即可生效。

数据层与工作台 UI 有自动化测试（jsdom，仅开发用）：

```bash
node tests/data.test.js   # 数据层：层级 / 防环 / 删除上移 / YAML 往返 / 角色卡绑定
node tests/ui.test.js     # UI：打开工作台 / 建节点 / 建事件 / 导入导出 / 删除 / 绑定徽标
node tests/gate.test.js   # 剧情预筛：目录 / Gate 消息 / 解析 / 注入 / 管线
node tests/values.test.js # 变量系统：注册表 / 双层存储 / YAML / 注入配置
node tests/values-inject.test.js # 变量注入：文本构建 / 发送前任务 / 清理
node tests/values-ui.test.js # 变量工作台 UI：树 / 注册 / 层切换 / 注入勾选
```

## 宿主差异说明

- TauriTavern 的 manifest 只接受单个 JS 文件，因此源码拆在 `js/` 下、构建时拼接。
- 事件订阅统一经 `host.js` 适配（`ctx.event_types` 解析 + 事件源自愈看门狗）。
- 跨域 API 请求自动走宿主代理：对话用 `/api/backends/chat-completions/generate`（TauriTavern 专用接口），模型列表探测用 `/api/backends/chat-completions/status`；代理明显损坏（非 JSON / 无内容 / 路由不存在）时回退直连。

## Roadmap（规划）

- 事件触发条件（trigger）结构化与运行时求值
- 多轮事件去重 / 冷却（同一事件避免连续触发）
