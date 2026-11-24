import { NextResponse } from 'next/server';
import { queryStrict, ensureAccounts } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';
const pad = (n) => String(n).padStart(6, '0');
const num = (x) => Number(x) || 0;
const deny = () => NextResponse.json({ error: 'Login required' }, { status: 401 });

// Next invoice number continues after the highest existing one (starts at M000188).
async function nextNumber() {
  const r = await queryStrict`select coalesce(max(cast(substring(invoice_no from 2) as int)), 187) as m from invoices where invoice_no ~ '^M[0-9]+$'`;
  return 'M' + pad(Math.max(187, Number(r[0].m)) + 1);
}

export async function GET(req) {
  if (!isAuthed(req)) return deny();
  await ensureAccounts();
  const rows = await queryStrict`select id, invoice_no, to_char(invoice_date, 'YYYY-MM-DD') as invoice_date, customer_name, hospital, total, paid,
    case when paid >= total then 'Paid' when paid > 0 then 'Partial' else 'Unpaid' end as status
    from invoices order by id desc limit 1000`;
  return NextResponse.json({
    invoices: rows.map((r) => ({ ...r, total: num(r.total), paid: num(r.paid) })),
    nextNo: await nextNumber(),
  });
}

export async function POST(req) {
  if (!isAuthed(req)) return deny();
  await ensureAccounts();
  const b = await req.json();
  if (!String(b.customer_name || '').trim()) return NextResponse.json({ error: 'Customer name required' }, { status: 400 });
  const lines = (b.items || [])
    .filter((i) => String(i.description || '').trim())
    .map((i, n) => {
      const qty = num(i.qty);
      const unit = num(i.unit_price);
      return { n, qty, description: String(i.description).trim(), specs: String(i.specs || '').trim(), batch: String(i.batch || '').trim(), exp_date: String(i.exp_date || '').trim(), unit, amount: Math.round(qty * unit * 100) / 100 };
    });
  if (!lines.length) return NextResponse.json({ error: 'At least one item required' }, { status: 400 });

  const subtotal = lines.reduce((a, l) => a + l.amount, 0);
  const taxPct = num(b.tax_pct);
  const tax = Math.round(subtotal * taxPct) / 100;
  const total = subtotal + tax;
  const paid = num(b.paid);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.invoice_date || '') ? b.invoice_date : new Date().toISOString().slice(0, 10);

  let invoice_no = '';
  let id = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      invoice_no = await nextNumber();
      const r = await queryStrict`insert into invoices (invoice_no, invoice_date, customer_name, age, hospital, city, notes, subtotal, tax_pct, tax_amount, total, paid, payment_mode)
        values (${invoice_no}, ${date}, ${String(b.customer_name).trim()}, ${String(b.age || '').trim()}, ${String(b.hospital || '').trim()}, ${String(b.city || '').trim()}, ${String(b.notes || '').trim()}, ${subtotal}, ${taxPct}, ${tax}, ${total}, ${paid}, ${String(b.payment_mode || '')}) returning id`;
      id = r[0].id;
      break;
    } catch (e) {
      if (attempt === 2) throw e;
    }
  }
  try {
    for (const l of lines) {
      await queryStrict`insert into invoice_items (invoice_id, position, qty, description, specs, batch, exp_date, unit_price, amount)
        values (${id}, ${l.n}, ${l.qty}, ${l.description}, ${l.specs}, ${l.batch}, ${l.exp_date}, ${l.unit}, ${l.amount})`;
    }
  } catch (e) {
    await queryStrict`delete from invoices where id = ${id}`;
    throw e;
  }
  return NextResponse.json({ id, invoice_no, total });
}
