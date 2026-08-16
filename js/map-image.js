// ===== 万华镜（Kaleidoscope）地图系统：图片工具（读取 / 裁剪 / 降采样导出）=====
// 仅在用户交互（上传 / 裁剪）时触碰 FileReader / Image / canvas，顶层只定义函数，
// 因此 jsdom 测试环境加载本文件不会因缺 canvas 报错。

// 读取图片文件为 dataURL（Promise）。非图片类型直接拒绝。
function mapReadFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('未选择文件'));
      return;
    }
    if (typeof file.type === 'string' && file.type && !file.type.startsWith('image/')) {
      reject(new Error('请选择图片文件（PNG / JPG / WebP 等）'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });
}

// 加载图片（Promise<HTMLImageElement>），解码失败拒绝。
function mapLoadImage(dataURL) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('图片解码失败，请换一张'));
    image.src = dataURL;
  });
}

// 按源图自然像素矩形裁剪，等比降采样到最长边 ≤ maxDim，导出 PNG dataURL。
// rect = { x, y, width, height }，单位与 image.naturalWidth/Height 一致。
function mapCropImageToDataURL(image, rect, maxDim) {
  const max = Math.max(1, maxDim);
  const sx = Math.max(0, Math.min(image.naturalWidth - 1, rect.x));
  const sy = Math.max(0, Math.min(image.naturalHeight - 1, rect.y));
  const sw = Math.max(1, Math.min(image.naturalWidth - sx, rect.width));
  const sh = Math.max(1, Math.min(image.naturalHeight - sy, rect.height));
  const scale = Math.min(1, max / Math.max(sw, sh));
  const outWidth = Math.max(1, Math.round(sw * scale));
  const outHeight = Math.max(1, Math.round(sh * scale));
  const source = document.createElement('canvas');
  source.width = sw;
  source.height = sh;
  const sctx = source.getContext('2d');
  if (!sctx) throw new Error('当前环境不支持 canvas 裁剪');
  sctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
  if (scale >= 1) return source.toDataURL('image/png');
  const out = document.createElement('canvas');
  out.width = outWidth;
  out.height = outHeight;
  const octx = out.getContext('2d');
  if (!octx) throw new Error('当前环境不支持 canvas 裁剪');
  octx.drawImage(source, 0, 0, outWidth, outHeight);
  return out.toDataURL('image/png');
}
