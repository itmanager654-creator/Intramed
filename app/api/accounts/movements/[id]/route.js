import { NextResponse } from 'next/server';
import { queryStrict } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';

// Only purchases (stock in) can be removed here. Sales are removed by deleting the invoice.
export async function DELETE(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const [m] = await queryStrict`select kind from stock_movements where id = ${Number(params.id)}`;
  if (!m) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (m.kind !== 'in') return NextResponse.json({ error: 'Delete the invoice to remove a sale' }, { status: 400 });
  await queryStrict`delete from stock_movements where id = ${Number(params.id)}`;
  return NextResponse.json({ ok: true });
}
