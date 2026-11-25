import { NextResponse } from 'next/server';
import { queryStrict, ensureBusiness } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';
import { stockRows, itemIdFor } from '@/lib/stock';

export const dynamic = 'force-dynamic';
const num = (x) => Number(x) || 0;

export async function GET(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await ensureBusiness();
  return NextResponse.json({ items: await stockRows() });
}

// Record a purchase (stock in).
export async function POST(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await ensureBusiness();
  const b = await req.json();
  const name = String(b.name || '').trim();
  const qty = num(b.qty);
  if (!name) return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
  if (qty <= 0) return NextResponse.json({ error: 'Quantity must be more than 0' }, { status: 400 });
  const itemId = await itemIdFor(name);
  if (b.reorder_level !== undefined && b.reorder_level !== '') {
    await queryStrict`update stock_items set reorder_level = ${num(b.reorder_level)} where id = ${itemId}`;
  }
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.moved_on || '') ? b.moved_on : new Date().toISOString().slice(0, 10);
  await queryStrict`insert into stock_movements (item_id, kind, qty, unit_cost, batch, exp_date, ref, moved_on)
    values (${itemId}, 'in', ${qty}, ${num(b.unit_cost)}, ${String(b.batch || '').trim()}, ${String(b.exp_date || '').trim()}, ${String(b.supplier || '').trim()}, ${date})`;
  return NextResponse.json({ ok: true });
}
