import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { channelStatus } from '@/lib/notify';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let subscribers = 0;
  try { subscribers = (await db()`select count(*)::int as n from push_subs`)[0].n; } catch {}
  return NextResponse.json({ ...channelStatus(), publicKey: process.env.VAPID_PUBLIC_KEY || '', subscribers });
}

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const s = await req.json().catch(() => null);
  if (!s?.endpoint || !s?.keys?.p256dh || !s?.keys?.auth) return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
  await db()`insert into push_subs (endpoint, p256dh, auth) values (${s.endpoint}, ${s.keys.p256dh}, ${s.keys.auth})
    on conflict (endpoint) do update set p256dh = excluded.p256dh, auth = excluded.auth`;
  return NextResponse.json({ ok: true });
}
