import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
// no-store => the site always shows fresh data (no stale Firebase-style delay)
const client = url ? neon(url, { fetchOptions: { cache: 'no-store' } }) : null;

// Reads: never crash a public page if the database is down or not set up yet.
export async function query(strings, ...values) {
  if (!client) return [];
  try {
    return await client(strings, ...values);
  } catch (e) {
    console.error('DB read failed:', e.message);
    return [];
  }
}

// Writes: errors must be visible to the caller.
export function db() {
  if (!client) throw new Error('DATABASE_URL is not set');
  return client;
}
