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
  await query`alter table products add column if not exists intro text not null default ''`;
  await query`alter table products add column if not exists features text not null default ''`;
  await query`alter table products add column if not exists specs text not null default ''`;
  await query`alter table products add column if not exists uses text not null default ''`;
  await query`alter table products add column if not exists faqs text not null default ''`;
  await query`alter table products add column if not exists brand text not null default ''`;
  await query`alter table products add column if not exists origin text not null default ''`;
  await query`alter table products add column if not exists reg_no text not null default ''`;
  await query`alter table products add column if not exists sizes text not null default ''`;
  await query`alter table products add column if not exists img_alt text not null default ''`;
  seoReady = true;
}

// Creates the Website-text table on first use (safe to run repeatedly).
let contentReady = false;
export async function ensureSiteContent() {
  if (contentReady) return;
  await query`create table if not exists site_content (key text primary key, value text not null default '', updated_at timestamptz default now())`;
  contentReady = true;
}

// Accounts (invoices) tables: created on first use.
let accountsReady = false;
export async function ensureAccounts() {
  if (accountsReady) return;
  await queryStrict`create table if not exists invoices (
    id serial primary key,
    invoice_no text unique not null,
    invoice_date date not null default current_date,
    customer_name text not null default '',
    age text not null default '',
    hospital text not null default '',
    city text not null default '',
    notes text not null default '',
    subtotal numeric not null default 0,
    tax_pct numeric not null default 0,
    tax_amount numeric not null default 0,
    total numeric not null default 0,
    paid numeric not null default 0,
    payment_mode text not null default '',
    created_at timestamptz default now()
  )`;
  await queryStrict`create table if not exists invoice_items (
    id serial primary key,
    invoice_id int not null references invoices(id) on delete cascade,
    position int not null default 0,
    qty numeric not null default 1,
    description text not null default '',
    specs text not null default '',
    batch text not null default '',
    exp_date text not null default '',
    unit_price numeric not null default 0,
    amount numeric not null default 0
  )`;
  accountsReady = true;
}

// Stock, expenses and extra invoice fields: created/extended on first use.
let bizReady = false;
export async function ensureBusiness() {
  if (bizReady) return;
  await ensureAccounts();
  await queryStrict`alter table invoices add column if not exists phone text not null default ''`;
  await queryStrict`alter table invoice_items add column if not exists item_id int`;
  await queryStrict`alter table invoice_items add column if not exists unit_cost numeric not null default 0`;
  await queryStrict`create table if not exists stock_items (id serial primary key, name text not null, reorder_level numeric not null default 0, created_at timestamptz default now())`;
  await queryStrict`create unique index if not exists stock_items_name_idx on stock_items (lower(name))`;
  await queryStrict`create table if not exists stock_movements (
    id serial primary key,
    item_id int not null references stock_items(id) on delete cascade,
    kind text not null,
    qty numeric not null,
    unit_cost numeric not null default 0,
    unit_price numeric not null default 0,
    ref text not null default '',
    batch text not null default '',
    exp_date text not null default '',
    moved_on date not null default current_date,
    created_at timestamptz default now()
  )`;
  await queryStrict`create table if not exists expenses (
    id serial primary key,
    spent_on date not null default current_date,
    category text not null default '',
    amount numeric not null default 0,
    note text not null default '',
    created_at timestamptz default now()
  )`;
  bizReady = true;
}
