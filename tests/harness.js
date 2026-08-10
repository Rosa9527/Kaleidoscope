// 万华镜开发测试：共享加载器（把 js/ 源码按构建顺序载入 vm / jsdom 沙箱）。
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SOURCE_FILES = [
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
];
// main.js 单独列出：含 bootstrap 副作用（定时器、菜单注入），仅数据测试不加载。

function readSources() {
  return SOURCE_FILES.map((file) => ({
    file,
    code: fs.readFileSync(path.join(ROOT, file), 'utf8'),
  }));
}

function loadInContext(sandbox, files = readSources()) {
  const context = vm.createContext(sandbox);
  for (const { file, code } of files) {
    try {
      vm.runInContext(code, context, { filename: file });
    } catch (error) {
      throw new Error(`加载 ${file} 失败: ${error.message}`);
    }
  }
  return context;
}

// 简易测试运行器
function createRunner() {
  const results = [];
  const runner = {
    test(name, fn) {
      results.push({ name, fn });
    },
    async run() {
      let passed = 0;
      const failures = [];
      for (const { name, fn } of results) {
        try {
          await fn();
          passed += 1;
          console.log(`  ✔ ${name}`);
        } catch (error) {
          failures.push({ name, error });
          console.error(`  ✘ ${name}`);
          console.error(`    ${error && error.stack ? error.stack.split('\n').slice(0, 4).join('\n    ') : error}`);
        }
      }
      console.log(`\n通过 ${passed}/${results.length}`);
      if (failures.length > 0) process.exitCode = 1;
      return failures.length === 0;
    },
  };
  return runner;
}

// 简易上下文：宿主 extensionSettings 可直接扩展；
// 可选传入 characters / characterId / writeExtensionField 模拟角色卡绑定。
function makeContext(options = {}) {
  const ctx = {
    extensionSettings: {},
    saveSettingsDebounced() {},
    saveSettings() {},
  };
  if (options.characters !== undefined) ctx.characters = options.characters;
  if (options.characterId !== undefined) ctx.characterId = options.characterId;
  if (options.writeExtensionField !== undefined) ctx.writeExtensionField = options.writeExtensionField;
  return ctx;
}

// 简易角色卡：data.extensions 可直接扩展。
function makeCharacter(name, avatar) {
  return { name, avatar, data: { extensions: {} } };
}

module.exports = { ROOT, readSources, loadInContext, createRunner, makeContext, makeCharacter };
