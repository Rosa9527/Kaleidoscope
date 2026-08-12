'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => { throw new Error(message); };

const manifest = JSON.parse(read('manifest.json'));
const source = read('js/constants.js');
const bundle = read('index.js');
const sourceVersion = source.match(/const MODULE_VERSION = ['"]([^'"]+)['"]/);
const bundleVersion = bundle.match(/const MODULE_VERSION = ['"]([^'"]+)['"]/);

if (!sourceVersion) fail('js/constants.js 缺少 MODULE_VERSION');
if (!bundleVersion) fail('index.js 缺少 MODULE_VERSION');
if (manifest.version !== sourceVersion[1]) {
  fail(`manifest.json 与 js/constants.js 版本不一致：${manifest.version} !== ${sourceVersion[1]}`);
}
if (bundleVersion[1] !== sourceVersion[1]) {
  fail(`index.js 与 js/constants.js 版本不一致：${bundleVersion[1]} !== ${sourceVersion[1]}`);
}

console.log(`构建产物一致性通过：${sourceVersion[1]}`);
