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

// Strict read for pages where "not found" must mean the row really does not exist.
// A database error throws (so the page answers 500, which Google retries) instead of a fake 404.
export async function queryStrict(strings, ...values) {
  if (!client) throw new Error('DATABASE_URL is not set');
  return client(strings, ...values);
}

// Adds optional SEO columns to products the first time they are needed (safe to run repeatedly).
let seoReady = false;
export async function ensureProductSeo() {
  if (seoReady) return;
  await query`alter table products add column if not exists seo_title text not null default ''`;
  await query`alter table products add column if not exists seo_description text not null default ''`;
  await query`alter table products add column if not exists seo_keywords text not null default ''`;
  seoReady = true;
}

// Creates the Website-text table on first use (safe to run repeatedly).
let contentReady = false;
export async function ensureSiteContent() {
  if (contentReady) return;
  await query`create table if not exists site_content (key text primary key, value text not null default '', updated_at timestamptz default now())`;
  contentReady = true;
}
