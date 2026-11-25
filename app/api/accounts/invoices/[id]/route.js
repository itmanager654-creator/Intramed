import { NextResponse } from 'next/server';
import { queryStrict, ensureBusiness } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';
const num = (x) => Number(x) || 0;

export async function GET(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await ensureBusiness();
  const id = Number(params.id);
  const [inv] = await queryStrict`select id, invoice_no, to_char(invoice_date, 'YYYY-MM-DD') as invoice_date, customer_name, age, hospital, city, notes, phone, show_stamp,
    subtotal, tax_pct, tax_amount, total, paid, payment_mode from invoices where id = ${id}`;
  if (!inv) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const items = await queryStrict`select qty, description, specs, batch, exp_date, unit_price, amount from invoice_items where invoice_id = ${id} order by position, id`;
  return NextResponse.json({
    invoice: { ...inv, subtotal: num(inv.subtotal), tax_pct: num(inv.tax_pct), tax_amount: num(inv.tax_amount), total: num(inv.total), paid: num(inv.paid),
      items: items.map((i) => ({ ...i, qty: num(i.qty), unit_price: num(i.unit_price), amount: num(i.amount) })) },
  });
}

// Deleting an invoice also gives its quantities back to stock.
export async function DELETE(req, { params }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await ensureBusiness();
  const id = Number(params.id);
  const [inv] = await queryStrict`select invoice_no from invoices where id = ${id}`;
  if (inv) await queryStrict`delete from stock_movements where ref = ${inv.invoice_no} and kind = 'out'`;
  await queryStrict`delete from invoices where id = ${id}`;
  return NextResponse.json({ ok: true });
}
