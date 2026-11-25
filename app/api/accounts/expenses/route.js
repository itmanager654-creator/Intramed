import { NextResponse } from 'next/server';
import { queryStrict, ensureBusiness } from '@/lib/db';
import { isAuthed } from '@/lib/accountsAuth';

export const dynamic = 'force-dynamic';
const num = (x) => Number(x) || 0;

export async function GET(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await ensureBusiness();
  const rows = await queryStrict`select id, to_char(spent_on, 'YYYY-MM-DD') as spent_on, category, amount, note from expenses order by spent_on desc, id desc limit 300`;
  return NextResponse.json({ expenses: rows.map((r) => ({ ...r, amount: num(r.amount) })) });
}

export async function POST(req) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  await ensureBusiness();
  const b = await req.json();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.spent_on || '') ? b.spent_on : new Date().toISOString().slice(0, 10);
  if (num(b.amount) <= 0) return NextResponse.json({ error: 'Amount must be more than 0' }, { status: 400 });
  await queryStrict`insert into expenses (spent_on, category, amount, note) values (${date}, ${String(b.category || '').trim()}, ${num(b.amount)}, ${String(b.note || '').trim()})`;
  return NextResponse.json({ ok: true });
}
