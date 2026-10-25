// One-time import: Firebase (Firestore) -> Neon Postgres + Vercel Blob.
// Reads the OLD site's data (read-only, nothing is deleted from Firebase).
// Run:  npm install  &&  node scripts/migrate-from-firebase.mjs
// Needs DATABASE_URL and BLOB_READ_WRITE_TOKEN in .env.local (copy from Vercel > Settings > Environment Variables).
import fs from 'fs';
import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

if (fs.existsSync('.env.local')) {
  for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
for (const k of ['DATABASE_URL', 'BLOB_READ_WRITE_TOKEN']) {
  if (!process.env[k]) { console.error(`Missing ${k} in .env.local`); process.exit(1); }
}

const PROJECT = 'imdf-a8fee';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const CATEGORIES = ['Gastroenterology', 'Cardiology', 'Urology', 'Vascular'];
const sql = neon(process.env.DATABASE_URL);

const val = (f) => (f == null ? '' : f.stringValue ?? f.integerValue ?? f.doubleValue ?? f.timestampValue ?? '');
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'item';

async function readAll(col) {
  const out = [];
  let token = '';
  do {
    const url = `${BASE}/${col}?pageSize=50${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Firestore "${col}" read failed: HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
    const j = await r.json();
    out.push(...(j.documents || []));
    token = j.nextPageToken || '';
  } while (token);
  return out.map((d) => ({ id: d.name.split('/').pop(), ...Object.fromEntries(Object.entries(d.fields || {}).map(([k, v]) => [k, val(v)])) }));
}

// Old photos are base64 data URLs inside the documents -> upload them as real files.
async function toBlobUrl(img, name) {
  if (!img) return '';
  const m = String(img).match(/^data:(image\/[a-z+.-]+);base64,(.+)$/is);
  if (!m) return img; // already a normal URL
  const ext = m[1].split('/')[1].replace('jpeg', 'jpg').replace('+xml', '');
  const blob = await put(`migrated/${slugify(name)}.${ext}`, Buffer.from(m[2], 'base64'), { access: 'public', contentType: m[1], addRandomSuffix: true });
  return blob.url;
}

const byDate = (a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || ''));

// ---------- products ----------
const catalog = (await readAll('catalog')).sort(byDate);
console.log(`Found ${catalog.length} catalog items`);
const used = new Set((await sql`select category, slug from products`).map((r) => `${r.category}/${r.slug}`));
let added = 0, skipped = 0;
for (const [i, it] of catalog.entries()) {
  const name = (it.name || '').trim();
  const category = CATEGORIES.find((c) => c.toLowerCase() === String(it.category || '').trim().toLowerCase());
  if (!name || !category) { console.warn(`  skip (no name/category): ${JSON.stringify({ name, category: it.category })}`); skipped++; continue; }
  if ((await sql`select 1 from products where category = ${category} and name = ${name}`).length) { skipped++; continue; }
  let slug = slugify(name), n = 1;
  while (used.has(`${category}/${slug}`)) slug = `${slugify(name)}-${++n}`;
  used.add(`${category}/${slug}`);
  const image = await toBlobUrl(it.imgUrl, `${category}-${name}`);
  await sql`insert into products (category, slug, name, spec, description, image_url, sort) values (${category}, ${slug}, ${name}, ${it.spec || ''}, '', ${image}, ${i})`;
  added++; console.log(`  + ${category}: ${name}`);
}
console.log(`Products: ${added} added, ${skipped} skipped\n`);

// ---------- gallery ----------
try {
  const gallery = (await readAll('gallery')).sort(byDate);
  const have = (await sql`select count(*)::int as n from gallery`)[0].n;
  if (have === 0) {
    for (const g of gallery) {
      const url = await toBlobUrl(g.imgUrl || g.url || g.image, `gallery-${g.id}`);
      if (!url) continue;
      await sql`insert into gallery (url, category, caption) values (${url}, ${g.category || ''}, ${g.caption || g.title || g.name || ''})`;
    }
    console.log(`Gallery: ${gallery.length} photos copied`);
  } else console.log('Gallery already has photos, skipped');
} catch (e) { console.warn('Gallery skipped:', e.message); }

// ---------- inquiry history ----------
try {
  const inq = (await readAll('inquiries')).sort(byDate);
  const have = (await sql`select count(*)::int as n from inquiries`)[0].n;
  if (have === 0) {
    for (const q of inq) {
      await sql`insert into inquiries (name, phone, email, message, status, created_at)
        values (${q.name || ''}, ${q.phone || ''}, ${q.email || ''}, ${q.message || ''}, 'done', ${q.createdAt || new Date().toISOString()})`;
    }
    console.log(`Inquiries: ${inq.length} old inquiries copied (marked done)`);
  } else console.log('Inquiries table not empty, skipped');
} catch (e) { console.warn('Inquiries skipped:', e.message); }


// ---------- featured / partners / clients ----------
const HOME = [
  ['featured', 'featured', (x) => [x.title, x.tag, x.desc, x.imgUrl]],
  ['partners', 'partners', (x) => [x.name, x.desc, x.logoUrl]],
  ['clients', 'clients', (x) => [x.label, x.logoUrl]],
];
for (const [col, table] of HOME) {
  try {
    const rows = (await readAll(col)).sort(byDate);
    const have = (col === 'featured' ? await sql`select count(*)::int as n from featured`
      : col === 'partners' ? await sql`select count(*)::int as n from partners`
      : await sql`select count(*)::int as n from clients`)[0].n;
    if (have > 0) { console.log(`${table}: not empty, skipped`); continue; }
    for (const [i, x] of rows.entries()) {
      if (col === 'featured') {
        const img = await toBlobUrl(x.imgUrl, `featured-${x.title}`);
        await sql`insert into featured (title, tag, description, image_url, sort) values (${x.title || ''}, ${x.tag || ''}, ${x.desc || ''}, ${img}, ${i})`;
      } else if (col === 'partners') {
        const img = await toBlobUrl(x.logoUrl, `partner-${x.name}`);
        await sql`insert into partners (name, description, logo_url, sort) values (${x.name || ''}, ${x.desc || ''}, ${img}, ${i})`;
      } else {
        const img = await toBlobUrl(x.logoUrl, `client-${x.label}`);
        await sql`insert into clients (label, logo_url, sort) values (${x.label || ''}, ${img}, ${i})`;
      }
    }
    console.log(`${table}: ${rows.length} copied`);
  } catch (e) { console.warn(`${table} skipped:`, e.message); }
}

// ---------- old contact details (just printed, so you can send them to Claude) ----------
try {
  const r = await fetch(`${BASE}/intramed/content`);
  const d = await r.json();
  const flat = (f) => (f?.mapValue ? Object.fromEntries(Object.entries(f.mapValue.fields || {}).map(([k, v]) => [k, flat(v)])) : val(f));
  console.log('\nOld contact details:', JSON.stringify(flat(d.fields?.contact), null, 2));
} catch (e) { /* optional */ }

console.log('\nDone. Open /admin/ to check products and add descriptions.');
