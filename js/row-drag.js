// ===== 万华镜（Kaleidoscope）通用行拖动排序引擎 =====
// 变量系统的三处列表（变量树 / 变量注册 / 剧情触发）与剧情脉络树共用这套手势：
// 两种启动方式——按住拖动把手立即可拖；长按整行（650ms）同样进入拖动——触摸端
// 没有把手的精细落点，长按是唯一能把「点一下 = 操作行」与「按住 = 挪动行」分开的手势。
//
// 调用方（各列表）提供三件事：
//   getSiblings(row) → 该行的同级行（数组，顺序即当前显示顺序）；
//   onReorder(row, fromIndex, toIndex) → 松手后写回数据层（通常重渲染整表）；
//   options.getBlock(row) → 该行在列表里占据的整块（分类 / 节点行连同渲染在其后的
//     后代行，列表是深度优先扁平排列），拖动时整块一起走；不提供时块即单行。
// 其余规则由本引擎保证：
//   - 落点只在自己父节点内生效（两个列表的「未分类事件」各自住在一个分组容器里，
//     跨容器插入会直接抛 NotFoundError，表现为「怎么拖都只能到末尾」）；
//   - 只允许同级互排：分组由调用方的 getSiblings 决定（变量树按父路径、剧情脉络按
//     parentId / nodeId）；
//   - options.rowSelector 声明本列表的行元素（缺省 .kaleido-values__row）；
//   - options.matches 声明本次注册管哪些行（同一容器注册多个拖动规则时用）。
let rowDragState = null;
let rowPressState = null;

// 拖动期间阻止滚动与长按呼出菜单：触摸端浏览器只认 touch-action，而它在手指按下
// 那一刻就定死了，长按之后才开始的拖动只能靠非 passive 的 touchmove 兜。
function rowDragBlockScroll(event) {
  event.preventDefault();
}

// 长按呼出菜单（Android 约 500ms 就弹）比拖动阈值来得早，必须在「按下待定」
// 阶段就拦住——拖起来之后再拦已经晚了。
function rowBlockContextMenu(event) {
  if (!rowDragState && !rowPressState) return;
  event.preventDefault();
}

// 长按按下但还没到时长：手指移动超过容差即视为滚动 / 点选，放弃这次长按。
function handleRowPressMove(event) {
  const state = rowPressState;
  if (!state) return;
  if (Math.hypot(event.clientX - state.startX, event.clientY - state.startY) > VALUES_LONG_PRESS_SLOP) {
    endRowPress();
  }
}

function endRowPress() {
  const state = rowPressState;
  if (!state) return;
  rowPressState = null;
  if (state.timer) clearTimeout(state.timer);
  document.removeEventListener('pointermove', handleRowPressMove);
  document.removeEventListener('pointerup', endRowPress);
  document.removeEventListener('pointercancel', endRowPress);
}

// 长按转拖动后紧跟的那次 click 不是「点这一行」的意图，吞掉它；
// 手势不产生 click 时超时自行摘除，避免误吞下一次真实点击。
function rowSwallowNextClick() {
  const handler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    document.removeEventListener('click', handler, true);
  };
  document.addEventListener('click', handler, true);
  setTimeout(() => document.removeEventListener('click', handler, true), 350);
}

function rowDragBlockOf(row, getBlock) {
  const block = typeof getBlock === 'function' ? getBlock(row) : null;
  return Array.isArray(block) && block.length > 0 && block[0] === row ? block : [row];
}

// 深度优先扁平列表的整块收集：rootClass 命中的行连同渲染在它后面的后代行
// （--depth 严格大于自己的连续行就是它的子树）；未命中的行没有后代，块即自身。
// 变量触发的分类行与剧情脉络的节点行共用——拖动时子树跟着走，不分家。
function collectRowDepthBlock(row, rootClass, rowClass) {
  if (!row || !rootClass || !row.classList.contains(rootClass)) return [row];
  const block = [row];
  const depth = Number.parseInt(row.style.getPropertyValue('--depth') || '0', 10) || 0;
  let sibling = row.nextElementSibling;
  while (sibling && sibling.classList.contains(rowClass)) {
    const siblingDepth = Number.parseInt(sibling.style.getPropertyValue('--depth') || '0', 10) || 0;
    if (siblingDepth <= depth) break;
    block.push(sibling);
    sibling = sibling.nextElementSibling;
  }
  return block;
}

// 全局只挂一次：contextmenu 的拦截必须在「按下待定」阶段就生效（见上）。
// 键名沿用旧版（热重载时旧监听仍在，换键会让两份监听叠加）。
function initRowContextMenuBlock() {
  if (globalThis[VALUES_DIALOG_KEY + '_ctxblock']) return;
  globalThis[VALUES_DIALOG_KEY + '_ctxblock'] = rowBlockContextMenu;
  document.addEventListener('contextmenu', rowBlockContextMenu, true);
}

function initRowDragReorder(container, handleSelector, getSiblings, onReorder, options = {}) {
  if (!container) return;
  initRowContextMenuBlock();
  const getBlock = typeof options.getBlock === 'function' ? options.getBlock : null;
  // 同一容器可能注册多次（触发行与分类行各有各的分组规则）：matches 声明本次
  // 注册管哪些行，别的注册碰到的行直接放手，避免两边抢同一个长按计时器。
  const matches = typeof options.matches === 'function' ? options.matches : () => true;
  const rowSelector = typeof options.rowSelector === 'string' && options.rowSelector
    ? options.rowSelector
    : '.kaleido-values__row';

  const beginDrag = (row, clientY, byLongPress) => {
    const siblings = getSiblings(row);
    const fromIndex = siblings.indexOf(row);
    if (fromIndex < 0) return false;
    rowDragState = {
      container, row, siblings, getSiblings, getBlock, fromIndex, onReorder, byLongPress, startY: clientY, moved: false,
    };
    for (const node of rowDragBlockOf(row, getBlock)) node.classList.add('is-dragging');
    container.classList.add('is-reordering');
    document.addEventListener('pointermove', handleRowDragMove);
    document.addEventListener('pointerup', handleRowDragEnd);
    document.addEventListener('pointercancel', handleRowDragEnd);
    document.addEventListener('touchmove', rowDragBlockScroll, { passive: false, capture: true });
    return true;
  };

  container.addEventListener('pointerdown', (event) => {
    if (rowDragState || rowPressState || event.button !== 0) return;
    const target = event.target instanceof Element ? event.target : null;
    const row = target ? target.closest(rowSelector) : null;
    if (!row || !container.contains(row) || !matches(row)) return;
    if (target.closest(handleSelector)) {
      event.preventDefault();
      beginDrag(row, event.clientY, false);
      return;
    }
    // 按钮 / 输入框上的长按留给原生行为（开关、删除按钮不该变成拖动）；
    // 没有把手的行（内置键、分类停用行）本来就不参与排序，长按也不该唤醒拖动。
    if (target.closest('button, input, select, textarea, label')) return;
    if (!row.querySelector(handleSelector)) return;
    endRowPress();
    const state = { startX: event.clientX, startY: event.clientY, timer: null };
    rowPressState = state;
    state.timer = setTimeout(() => {
      if (rowPressState !== state) return;
      endRowPress();
      // 长按成立：此后手指移动就是拖动，不再是滚动。
      beginDrag(row, state.startY, true);
    }, VALUES_LONG_PRESS_MS);
    document.addEventListener('pointermove', handleRowPressMove);
    document.addEventListener('pointerup', endRowPress);
    document.addEventListener('pointercancel', endRowPress);
  });
}

function handleRowDragMove(event) {
  const state = rowDragState;
  if (!state) return;
  if (!state.moved && Math.abs(event.clientY - state.startY) < 4) return;
  state.moved = true;
  const { row, siblings, getBlock } = state;
  const parent = row.parentElement;
  if (!parent) return;
  let insertBefore = null;
  let found = false;
  for (const sibling of siblings) {
    if (sibling === row) continue;
    const block = rowDragBlockOf(sibling, getBlock);
    const firstRect = block[0].getBoundingClientRect();
    const last = block[block.length - 1];
    const lastRect = last === block[0] ? firstRect : last.getBoundingClientRect();
    if (event.clientY < firstRect.top) {
      insertBefore = block[0];
      found = true;
      break;
    }
    if (event.clientY < lastRect.bottom) {
      // 落在兄弟块的纵向范围里：按整块中线判前后，块整体让位。
      insertBefore = event.clientY < (firstRect.top + lastRect.bottom) / 2 ? block[0] : last.nextElementSibling;
      found = true;
      break;
    }
  }
  if (!found) {
    // 指针落在所有同级之下：插到最后一个同级块之后。不能直接 append 到父节点末尾
    // （insertBefore = null）——父节点里还排着别的组，那样会把行挪出自己的分组，
    // 正是「怎么拖都只能到末尾」的成因。
    const lastSibling = siblings[siblings.length - 1];
    const lastBlock = rowDragBlockOf(lastSibling, getBlock);
    insertBefore = lastBlock[lastBlock.length - 1].nextElementSibling;
  }
  const block = rowDragBlockOf(row, getBlock);
  if (insertBefore === row || insertBefore === block[block.length - 1].nextElementSibling) return;
  if (insertBefore && insertBefore.parentElement !== parent) return;
  for (const node of block) parent.insertBefore(node, insertBefore);
}

function handleRowDragEnd() {
  const state = rowDragState;
  if (!state) return;
  rowDragState = null;
  endRowPress();
  document.removeEventListener('pointermove', handleRowDragMove);
  document.removeEventListener('pointerup', handleRowDragEnd);
  document.removeEventListener('pointercancel', handleRowDragEnd);
  document.removeEventListener('touchmove', rowDragBlockScroll, { capture: true });
  for (const node of rowDragBlockOf(state.row, state.getBlock)) node.classList.remove('is-dragging');
  state.container.classList.remove('is-reordering');
  if (!state.moved) return;
  if (state.byLongPress) rowSwallowNextClick();
  const finalIndex = state.getSiblings(state.row).indexOf(state.row);
  if (finalIndex >= 0 && finalIndex !== state.fromIndex) {
    state.onReorder(state.row, state.fromIndex, finalIndex);
  }
}
