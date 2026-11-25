import { NextResponse } from 'next/server';
import { queryStrict } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';

export async function DELETE(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await queryStrict`delete from expenses where id = ${Number(params.id)}`;
  return NextResponse.json({ ok: true });
}
