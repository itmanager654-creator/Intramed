import { NextResponse } from 'next/server';
import { passwordOk, makeToken, COOKIE } from '@/lib/accountsAuth';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!passwordOk(password)) {
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeToken(30), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 30 * 86400 });
  return res;
}
