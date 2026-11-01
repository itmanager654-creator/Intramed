import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAdmin } from '@/lib/auth';

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'No file' }, { status: 400 });
  const isImg = (file.type || '').startsWith('image/') || /\.(png|jpe?g|webp|gif|svg|avif|heic|ico)$/i.test(file.name || '');
  if (!isImg) return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: 'Image is too big (over 4 MB). Pick a smaller one' }, { status: 400 });
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  try {
    const blob = await put(`uploads/${Date.now()}-${safe}`, file, { access: 'public', contentType: file.type || undefined });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: `Upload failed: ${e?.message || 'unknown error'}. Is Vercel Blob connected (BLOB_READ_WRITE_TOKEN)?` }, { status: 500 });
  }
}
