// Shrinks big phone photos in the browser before upload (keeps transparency for PNG logos).
// Phone screenshots/photos are often 5-10 MB, which the server would reject.
export async function prepareImage(file, max = 1200) {
  const t = (file.type || '').toLowerCase();
  if (t === 'image/svg+xml' || t === 'image/gif') return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(bmp, 0, 0, w, h);
    const keepAlpha = /png|webp/i.test(t + file.name);
    const type = keepAlpha ? 'image/png' : 'image/jpeg';
    const blob = await new Promise((res) => c.toBlob(res, type, 0.9));
    if (!blob) return file;
    if (blob.size >= file.size && file.size < 3.5 * 1024 * 1024 && t.startsWith('image/')) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + (keepAlpha ? '.png' : '.jpg'), { type });
  } catch {
    return file;
  }
}
