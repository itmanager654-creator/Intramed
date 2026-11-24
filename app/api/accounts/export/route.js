import { queryStrict, ensureAccounts } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';

// CSV (opens in Excel) of every invoice line, optionally filtered by date range.
export async function GET(req) {
  if (!isAuthed(req)) return new Response('Login required', { status: 401 });
  await ensureAccounts();
  const sp = new URL(req.url).searchParams;
  const from = sp.get('from') || '';
  const to = sp.get('to') || '';
  const rows = await queryStrict`select i.invoice_no, to_char(i.invoice_date, 'YYYY-MM-DD') as inv_date, i.customer_name, i.age, i.hospital, i.city,
    it.description, it.specs, it.batch, it.exp_date, it.qty, it.unit_price, it.amount, i.total, i.paid, i.payment_mode
    from invoices i join invoice_items it on it.invoice_id = i.id order by i.id, it.position`;
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const head = ['Invoice', 'Date', 'Customer', 'Age', 'Hospital', 'City', 'Item', 'Specs', 'Batch', 'Expiry', 'Qty', 'Unit price', 'Line amount', 'Invoice total', 'Received', 'Payment mode'];
  const body = rows
    .filter((r) => (!from || r.inv_date >= from) && (!to || r.inv_date <= to))
    .map((r) => [r.invoice_no, r.inv_date, r.customer_name, r.age, r.hospital, r.city, r.description, r.specs, r.batch, r.exp_date, r.qty, r.unit_price, r.amount, r.total, r.paid, r.payment_mode].map(esc).join(','));
  const csv = '\uFEFF' + [head.map(esc).join(','), ...body].join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="intramed-invoices-${from || 'all'}.csv"` } });
}
