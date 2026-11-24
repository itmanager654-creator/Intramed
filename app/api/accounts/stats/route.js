import { NextResponse } from 'next/server';
import { queryStrict, ensureAccounts } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';
const num = (x) => Number(x) || 0;

export async function GET(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await ensureAccounts();
  const [t] = await queryStrict`select coalesce(sum(total), 0) as total, coalesce(sum(paid), 0) as paid from invoices`;
  const [m] = await queryStrict`select coalesce(sum(total), 0) as total, count(*) as n from invoices where date_trunc('month', invoice_date) = date_trunc('month', current_date)`;
  const monthly = await queryStrict`select to_char(date_trunc('month', invoice_date), 'YYYY-MM') as m, sum(total) as total
    from invoices where invoice_date >= date_trunc('month', current_date) - interval '5 months' group by 1 order by 1`;
  const topCustomers = await queryStrict`select customer_name as name, sum(total) as total, count(*) as n from invoices group by customer_name order by total desc limit 5`;
  const topItems = await queryStrict`select description as name, sum(qty) as qty, sum(amount) as total from invoice_items group by description order by total desc limit 5`;
  return NextResponse.json({
    total: num(t.total), paid: num(t.paid),
    month: { total: num(m.total), n: num(m.n) },
    monthly: monthly.map((r) => ({ m: r.m, total: num(r.total) })),
    topCustomers: topCustomers.map((r) => ({ name: r.name, total: num(r.total), n: num(r.n) })),
    topItems: topItems.map((r) => ({ name: r.name, qty: num(r.qty), total: num(r.total) })),
  });
}
