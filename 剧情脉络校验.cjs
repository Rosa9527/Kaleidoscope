#!/usr/bin/env node
// 剧情脉络产物结构校验脚本
// 用法: node 剧情脉络校验.cjs <剧情脉络.yaml> [更多文件...]
// 依据《剧情脉络自动生成模式》的自查清单做结构校验。
// 逐项输出 PASS/FAIL；任一 FAIL 时退出码为 1。

const fs = require('fs')
const path = require('path')

let YAML
for (const p of ['yaml', 'C:/Users/rosa/.dsh/profiles/node_modules/yaml']) {
  try { YAML = require(p); break } catch { /* try next */ }
}
if (!YAML) {
  console.error('未找到 yaml 包，请安装或指定 DSH profiles 路径')
  process.exit(2)
}

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('用法: node 剧情脉络校验.cjs <剧情脉络.yaml> [...]')
  process.exit(2)
}

let failures = 0
let total = 0
function check(file, name, ok, detail) {
  total++
  const label = ok ? 'PASS' : 'FAIL'
  if (!ok) failures++
  console.log(`[${label}] ${file}: ${name}${detail ? ' — ' + detail : ''}`)
}

const DATE_RE = /\d{4}年\d{1,2}月\d{1,2}日(?:~\d{1,2}月\d{1,2}日)?/
const NUM_ID_RE = /^\d+$/

for (const file of files) {
  console.log(`\n===== ${file} =====`)
  let doc
  try {
    doc = YAML.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    check(file, 'YAML 可解析', false, String(e && e.message || e))
    continue
  }

  check(file, 'format 标记', doc.format === 'kaleidoscope-story', String(doc.format))
  check(file, 'version', doc.version === 1, String(doc.version))
  check(file, 'nodes 与 scripts 存在', Array.isArray(doc.nodes) && Array.isArray(doc.scripts))

  if (!Array.isArray(doc.nodes) || !Array.isArray(doc.scripts)) continue

  // ---- 节点 ----
  const nodeIds = new Set()
  const nodeById = {}
  const byParent = {}
  const roots = []
  for (const n of doc.nodes) {
    if (!n.id || !n.name) { check(file, `节点字段齐全 (${JSON.stringify(n).slice(0, 60)})`, false); continue }
    if (nodeIds.has(n.id)) check(file, `节点 id 唯一 (${n.id})`, false)
    nodeIds.add(n.id)
    nodeById[n.id] = n
    const p = n.parentId || ''
    if (!p) roots.push(n)
    else (byParent[p] = byParent[p] || []).push(n)
  }

  // 恰好两个根节点
  check(file, '恰好两个根节点', roots.length === 2,
    roots.map(r => `${r.id}(${r.name})`).join(', '))
  const plotRoot = roots.find(r => r.id === 'plot-events')
  const ruleRoot = roots.find(r => r.id === 'rule-events')
  check(file, '根节点为 plot-events / rule-events',
    !!plotRoot && !!ruleRoot && plotRoot.name === '剧情类事件' && ruleRoot.name === '规则类事件')

  // parentId 引用存在
  let badRef = 0
  for (const p of Object.keys(byParent)) if (!nodeById[p]) badRef++
  check(file, 'parentId 全部指向存在的节点', badRef === 0, badRef ? `缺失: ${badRef}` : '')

  // 层级：plot-events 下只挂时间节点；时间下不挂时间
  const depth = {}
  function setDepth(id, d) { depth[id] = d; for (const c of byParent[id] || []) setDepth(c.id, d + 1) }
  for (const r of roots) setDepth(r.id, 1)

  let timeChildrenOK = true, plotChildrenOK = true, leafOK = true
  for (const n of doc.nodes) {
    const d = depth[n.id] || 0
    const isDate = DATE_RE.test(n.name)
    if (d === 2 && !isDate) plotChildrenOK = false
    if (isDate && (byParent[n.id] || []).some(c => DATE_RE.test(c.name))) timeChildrenOK = false
    if (d === 4 && (byParent[n.id] || []).length > 0) leafOK = false
    if (d > 4) leafOK = false
  }
  check(file, '时间下不挂时间节点', timeChildrenOK)
  check(file, 'plot-events 下只挂时间节点', plotChildrenOK)
  check(file, '人物层(第4层)为末层', leafOK)

  // 跨天同名地点各建节点（同名节点必须挂不同时间父节点下）
  const locNames = {}
  let crossDayOK = true
  for (const n of doc.nodes) {
    const d = depth[n.id] || 0
    if (d !== 3) continue
    const key = n.name
    const parent = n.parentId ? nodeById[n.parentId] : null
    const parentDate = parent && DATE_RE.test(parent.name) ? parent.name : '?'
    if (!locNames[key]) locNames[key] = []
    if (locNames[key].some(x => x === parentDate)) crossDayOK = false // 同一天同名重复
    locNames[key].push(parentDate)
  }
  check(file, '同一地点同一天不重复建节点', crossDayOK)

  // ---- 脚本 ----
  const scriptIds = new Set()
  let dupId = 0
  const nodeIdDepthOK = []
  for (const s of doc.scripts) {
    if (typeof s.id !== 'string' || !s.id) check(file, `脚本 id 为字符串(数字样需加引号) (${JSON.stringify(s.id)})`, false)
    if (scriptIds.has(s.id)) { dupId++; check(file, `脚本 id 唯一 (${s.id})`, false) }
    scriptIds.add(s.id)
    if (typeof s.nodeId === 'string') nodeIdDepthOK.push(s.nodeId)
  }
  if (!dupId) check(file, '脚本 id 唯一', true)

  // nodeId 引用存在且挂载合法（事件必须挂 地点(3)/人物(4) 或规则根(1) 下）
  let badNode = 0, badMount = 0
  for (const nid of nodeIdDepthOK) {
    if (!nodeById[nid]) { badNode++; continue }
    const d = depth[nid] || 0
    if (!(d === 3 || d === 4 || nid === 'rule-events')) badMount++
  }
  check(file, 'scripts.nodeId 全部存在', badNode === 0, badNode ? `缺失: ${badNode}` : '')
  check(file, '事件只挂地点/人物/规则根节点下', badMount === 0, badMount ? `非法挂载: ${badMount}` : '')

  // trigger / content 与节点链一致
  let trigOK = 0, trigFail = 0, contentOK = 0, contentFail = 0, skipRule = 0
  for (const s of doc.scripts) {
    const node = nodeById[s.nodeId]
    if (!node) continue
    // 找时间祖先
    let anc = node, dateName = null
    while (anc && !DATE_RE.test(anc.name)) anc = anc.parentId ? nodeById[anc.parentId] : null
    if (anc) dateName = anc.name
    const trig = s.trigger || ''
    const isRule = s.nodeId === 'rule-events' || (node.parentId === 'rule-events')
    if (isRule) { skipRule++; continue }

    const datePart = dateName ? dateName.match(DATE_RE)[0] : ''
    // 时间段节点：trigger 可写「X日至X日期间」
    const rangeOK = datePart.includes('~') && trig.includes('期间')
    const singleOK = !datePart.includes('~') && trig.includes(datePart)
    if (datePart && (singleOK || rangeOK)) trigOK++; else { trigFail++; check(file, `trigger 含节点日期 (${s.id}: ${s.name})`, false, `期望含「${datePart}」, 实际「${trig.slice(0, 50)}」`) }

    // 挂载地点/人物名出现在 trigger
    const mountName = depth[node.id] === 4 ? (node.parentId && nodeById[node.parentId] ? nodeById[node.parentId].name : '') : node.name
    if (mountName && !trig.includes(mountName)) { trigFail++; check(file, `trigger 含挂载地点/人物名 (${s.id}: ${s.name})`, false, `期望含「${mountName}」`) }

    // content 首行带日期
    const c = s.content || ''
    const firstLine = c.split('\n')[0] || ''
    const hasDate = /^\s*\d{4}年\d{1,2}月\d{1,2}日/.test(firstLine)
    if (hasDate) contentOK++; else { contentFail++; check(file, `content 首行交代日期 (${s.id}: ${s.name})`, false, `首行「${firstLine.slice(0, 40)}」`) }
  }
  if (trigOK + trigFail > 0) check(file, `trigger 与节点链一致 (${trigOK}/${trigOK + trigFail})`, trigFail === 0)
  if (contentOK + contentFail > 0) check(file, `content 首行日期 (${contentOK}/${contentOK + contentFail})`, contentFail === 0)
  if (skipRule > 0) console.log(`[SKIP] ${file}: 规则事件 ${skipRule} 条（不要求日期链）`)
}

console.log(`\n===== 汇总: ${total - failures}/${total} 通过 =====`)
process.exit(failures ? 1 : 0)
