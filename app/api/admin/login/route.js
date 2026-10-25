import { NextResponse } from 'next/server';
import { passwordOk, createSession } from '@/lib/auth';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!passwordOk(password)) {
    await new Promise((r) => setTimeout(r, 800)); // slows down password guessing
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}
