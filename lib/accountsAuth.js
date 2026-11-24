import { createHmac, timingSafeEqual } from 'crypto';

// Accounts login: password is checked against the ACCOUNTS_PASSWORD environment variable.
// A signed cookie (30 days) keeps the device logged in so the password is not asked again.
export const COOKIE = 'acc_session';
const secret = () => process.env.ACCOUNTS_SECRET || process.env.ACCOUNTS_PASSWORD || '';

export function passwordOk(pw) {
  const expected = process.env.ACCOUNTS_PASSWORD || '';
  if (!expected || !pw) return false;
  const a = Buffer.from(String(pw));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function makeToken(days = 30) {
  const exp = String(Date.now() + days * 86400000);
  const sig = createHmac('sha256', secret()).update(exp).digest('hex');
  return `${exp}.${sig}`;
}

export function validToken(t) {
  if (!t || !secret()) return false;
  const [exp, sig] = String(t).split('.');
  if (!exp || !sig || Date.now() > Number(exp)) return false;
  const want = createHmac('sha256', secret()).update(exp).digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isAuthed(req) {
  return validToken(req.cookies.get(COOKIE)?.value);
}
