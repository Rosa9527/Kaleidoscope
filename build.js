// 万华镜（Kaleidoscope）构建脚本：把 js/ 下的源码按依赖顺序拼接成单个 index.js。
//
// 为什么需要它：TauriTavern 的 manifest 只接受单个 JS 文件（"js" 必须是字符串或
// 单元素数组），不支持多文件数组。因此源码拆在 js/ 下便于维护，发布时用本脚本
// 拼回一个 index.js 供宿主加载。
//
// 用法：
//   node build.js          一次性构建
//   node build.js --watch  监听 js/ 与 build.js 的变更，自动重建（Ctrl+C 退出）
//   node build.js --check  校验磁盘上的 index.js 是否与当前源码一致（提交前跑）
// 依赖：仅 Node 内置模块，无第三方依赖。
//
// 防呆设计（都是踩过坑的）：
// - watch 同时监听 build.js 自身：FILES 增删文件或脚本逻辑改动后，watch 进程
//   自动重启（重新 spawn 自己），不会再出现旧进程拿旧文件列表覆盖产物的情况
//   （曾因此把地图系统拼丢，宿主启动即报 renderGameMap is not defined）。
// - 每次构建对比 js/ 目录与 FILES：新写的源文件若忘记加入列表会大声警告，
//   避免"改了源码却没进产物"。
// - 产物头部写入构建时间与内容指纹（FNV-1a），宿主加载的 index.js 新旧一眼
//   可辨；--check 用字节对比校验产物是否落后。
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 拼接顺序必须与依赖关系一致：常量 → 工具 → 宿主 → UI 外壳 → 各视图 → 入口。
// 每个文件都是普通脚本（非 ES module），顶层 const/function 进入全局作用域，
// 顺序保证「被调用时已定义」即可（实际所有调用都发生在 bootstrap 里，顺序很宽松）。
const FILES = [
  'js/constants.js',
  'js/utils.js',
  'js/host.js',
  'js/send-barrier.js',
  'js/ui-shell.js',
  'js/views-api.js',
  'js/views-log.js',
  'js/views-preset.js',
  'js/views-home.js',
  'js/views-inject.js',
  'js/story-data.js',
  'js/story-gate.js',
  'js/views-story.js',
  'js/values-data.js',
  'js/values-maintain.js',
  'js/values-inject.js',
  'js/values-trigger.js',
  'js/views-values.js',
  'js/map-data.js',
  'js/map-image.js',
  'js/views-map.js',
  'js/views-game.js',
  'js/main.js',
];

const root = __dirname;
const outPath = path.join(root, 'index.js');

// FNV-1a 32 位指纹：拼接内容有任何变化，指纹即变。
function fingerprint(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function buildParts() {
  const parts = FILES.map((file) => {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) {
      console.error(`[build] 缺少文件: ${file}`);
      process.exit(1);
    }
    const content = fs.readFileSync(full, 'utf8');
    return `// ===== ${file} =====\n${content}`;
  });
  // 防呆：js/ 下新增文件忘记加入 FILES 时报警（只警告不中断，可能是临时脚本）。
  const listed = new Set(FILES.map((file) => path.basename(file)));
  for (const name of fs.readdirSync(path.join(root, 'js'))) {
    if (name.endsWith('.js') && !listed.has(name)) {
      console.error(`[build] 警告: js/${name} 未加入 FILES，不会被打进 index.js！`);
    }
  }
  return parts;
}

function assemble(parts) {
  const body = parts.join('\n\n') + '\n';
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const header = [
    '// ===== 万华镜（Kaleidoscope）index.js — 构建产物，勿手改 =====',
    `// 构建时间: ${stamp} · 文件数: ${FILES.length} · 指纹: ${fingerprint(body)}`,
  ].join('\n');
  return `${header}\n\n${body}`;
}

function buildOnce() {
  const output = assemble(buildParts());
  fs.writeFileSync(outPath, output, 'utf8');
  console.log(`[build] 已生成 index.js（${FILES.length} 个文件，${output.split('\n').length} 行）`);
  return output;
}

// 提交前校验：磁盘上的 index.js 必须与当前源码逐字节一致（容忍 CRLF 差异）。
// 只比较头部以下的正文——头部里的构建时间戳是元数据，不应参与一致性判断。
function checkOnce() {
  let onDisk;
  try {
    onDisk = fs.readFileSync(outPath, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    console.error('[build] --check 失败：index.js 不存在，请先运行 node build.js');
    process.exit(1);
  }
  const fresh = assemble(buildParts());
  // 源码文件本身是 CRLF，拼出来的产物是混合换行；两侧都去掉 \r 再比，
  // 换行风格差异不算不一致。
  const norm = (text) => text.replace(/\r/g, '');
  const sliceBody = (text) => {
    const sep = text.indexOf('\n\n');
    return sep === -1 ? text : text.slice(sep + 2);
  };
  if (sliceBody(norm(onDisk)) === sliceBody(norm(fresh))) {
    console.log('[build] --check 通过：index.js 与当前源码一致');
    return;
  }
  console.error('[build] --check 失败：index.js 与当前源码不一致！');
  console.error('[build] 请运行 node build.js 重建后重新 git add index.js 再提交。');
  process.exit(1);
}

const watchMode = process.argv.includes('--watch');
const checkMode = process.argv.includes('--check');

if (checkMode) {
  checkOnce();
} else if (watchMode) {
  // 启动先构建一次，保证产物始终是最新的（不会因为上次忘构建而落后）。
  buildOnce();
  const rebuild = () => {
    try {
      buildOnce();
    } catch (error) {
      console.error('[build] 重建失败', error);
    }
  };
  let timer = null;
  const debounce = (fn) => {
    clearTimeout(timer);
    timer = setTimeout(fn, 200);
  };
  // js/ 源码变更 → 重建。
  fs.watch(path.join(root, 'js'), { persistent: true }, () => debounce(rebuild));
  // build.js 自身变更 → 重启 watch：重新读取 FILES 与脚本逻辑（fs.watch 不跟随
  // 文件被替换的场景，所以监听根目录而非 build.js 本身）。
  let restarting = false;
  const restart = () => {
    if (restarting) return;
    restarting = true;
    console.log('[build] build.js 已变更，自动重启 watch…');
    const child = spawn(process.execPath, [__filename, '--watch'], { stdio: 'inherit' });
    child.on('spawn', () => {
      // 不 detached（保持同一控制台，Ctrl+C 能停到新进程）。Windows 上父进程
      // 退出可能连带清理进程组，等 250ms 让子进程完成启动再退出。
      setTimeout(() => process.exit(0), 250);
    });
    child.on('error', (error) => {
      console.error('[build] 重启失败（旧进程继续运行）', error.message);
      restarting = false;
    });
  };
  fs.watch(root, { persistent: true }, (event, filename) => {
    if (filename === 'build.js') debounce(restart);
  });
  console.log('[build] watch 模式：监听 js/（重建）与 build.js（重启），Ctrl+C 退出');
} else {
  buildOnce();
}

