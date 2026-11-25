import { NextResponse } from 'next/server';
import { queryStrict, ensureBusiness } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';
const num = (x) => Number(x) || 0;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Profit and loss for one year, month by month.
// Revenue = invoice subtotals (before tax). Cost = purchase cost of items sold. Expenses = entered expenses.
export async function GET(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await ensureBusiness();
  const sp = new URL(req.url).searchParams;
  const year = sp.get('year') || String(new Date().getFullYear());

  const yrs = await queryStrict`select distinct y from (select to_char(invoice_date, 'YYYY') as y from invoices union select to_char(spent_on, 'YYYY') from expenses) t order by y desc`;
  const rev = await queryStrict`select to_char(invoice_date, 'MM') as mo, sum(subtotal) as v from invoices where to_char(invoice_date, 'YYYY') = ${year} group by 1`;
  const cogs = await queryStrict`select to_char(i.invoice_date, 'MM') as mo, sum(it.qty * it.unit_cost) as v from invoice_items it join invoices i on i.id = it.invoice_id
    where to_char(i.invoice_date, 'YYYY') = ${year} group by 1`;
  const exp = await queryStrict`select to_char(spent_on, 'MM') as mo, sum(amount) as v from expenses where to_char(spent_on, 'YYYY') = ${year} group by 1`;

  const pick = (rows) => Object.fromEntries(rows.map((r) => [r.mo, num(r.v)]));
  const R = pick(rev), C = pick(cogs), E = pick(exp);
  const months = MONTHS.map((name, i) => {
    const k = String(i + 1).padStart(2, '0');
    const revenue = R[k] || 0, cost = C[k] || 0, expenses = E[k] || 0;
    return { month: name, revenue, cogs: cost, gross: revenue - cost, expenses, net: revenue - cost - expenses };
  });
  const sum = (key) => months.reduce((a, m) => a + m[key], 0);
  const totals = { revenue: sum('revenue'), cogs: sum('cogs'), gross: sum('gross'), expenses: sum('expenses'), net: sum('net') };
  return NextResponse.json({ year, years: yrs.map((y) => y.y), months, totals });
}
