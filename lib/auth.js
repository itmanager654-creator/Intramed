import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { timingSafeEqual } from 'crypto';

const key = () => new TextEncoder().encode(process.env.ADMIN_SECRET || 'change-me-in-env');

export function passwordOk(input) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real || !input) return false;
  const a = Buffer.from(String(input));
  const b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession() {
  const token = await new SignJWT({ admin: true }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(key());
  cookies().set('im_admin', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}

export async function isAdmin() {
  const token = cookies().get('im_admin')?.value;
  if (!token) return false;
  try { await jwtVerify(token, key()); return true; } catch { return false; }
}

export function clearSession() { cookies().delete('im_admin'); }
