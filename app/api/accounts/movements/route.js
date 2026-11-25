import { NextResponse } from 'next/server';
import { queryStrict, ensureBusiness } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';
const num = (x) => Number(x) || 0;

export async function GET(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await ensureBusiness();
  const rows = await queryStrict`select m.id, m.kind, m.qty, m.unit_cost, m.unit_price, m.ref, m.batch, m.exp_date,
    to_char(m.moved_on, 'YYYY-MM-DD') as moved_on, s.name
    from stock_movements m join stock_items s on s.id = m.item_id order by m.id desc limit 300`;
  return NextResponse.json({ movements: rows.map((r) => ({ ...r, qty: num(r.qty), unit_cost: num(r.unit_cost), unit_price: num(r.unit_price) })) });
}
