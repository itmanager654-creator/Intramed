import { NextResponse } from 'next/server';
import { queryStrict } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const rows = await queryStrict`select name from products order by name`;
  const names = [...new Set(rows.map((r) => String(r.name).replace(/\s*\(\s*\)/g, '').trim()))];
  return NextResponse.json({ names });
}
