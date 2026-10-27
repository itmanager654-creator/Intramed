import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifyInquiry } from '@/lib/notify';
import { getContent } from '@/lib/content';

const clean = (v, n) => String(v ?? '').trim().slice(0, n);

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  if (b.website) return NextResponse.json({ ok: true }); // honeypot: bots fill this hidden field

  const i = { name: clean(b.name, 100), phone: clean(b.phone, 30), email: clean(b.email, 120), product: clean(b.product, 150), message: clean(b.message, 2000) };
  if (!i.name || !i.message || i.phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json({ error: 'Please enter your name, a valid phone number and a message.' }, { status: 400 });
  }
  try {
    await db()`insert into inquiries (name, phone, email, product, message) values (${i.name}, ${i.phone}, ${i.email}, ${i.product}, ${i.message})`;
    await notifyInquiry(i);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    const phone = (await getContent())('contact.phone');
    return NextResponse.json({ error: `Could not send. Please call ${phone}.` }, { status: 500 });
  }
}
