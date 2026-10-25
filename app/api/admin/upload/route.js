import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAdmin } from '@/lib/auth';

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: 'Image must be under 4 MB' }, { status: 400 });
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  try {
    const blob = await put(`uploads/${Date.now()}-${safe}`, file, { access: 'public' });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed. Is Vercel Blob connected?' }, { status: 500 });
  }
}
