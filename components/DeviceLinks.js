import Link from 'next/link';
import { query } from '@/lib/db';
import { getCategoryByKey } from '@/lib/categories';

// Shared internal-link block: a card grid of product links (image + name + category).
// Links are plain <a href> so Google can follow them without JavaScript.
export function DeviceCard({ p }) {
  const c = getCategoryByKey(p.category);
  if (!c) return null;
  return (
    <Link href={`/${c.slug}/${p.slug}/`} className="card group flex items-center gap-3 p-3 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-card">
      <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-white">
        {p.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt="" loading="lazy" className="h-full w-full object-contain" /> : <span className="text-xs text-muted">{c.name.slice(0, 2)}</span>}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold group-hover:text-brand">{p.name}</span>
        <span className="block text-xs text-muted">{c.name} device</span>
      </span>
    </Link>
  );
}

export function DeviceGrid({ items, cols = 'sm:grid-cols-2 lg:grid-cols-3' }) {
  if (!items.length) return null;
  return <div className={`grid gap-3 ${cols}`}>{items.map((p) => <DeviceCard key={`${p.category}-${p.slug}`} p={p} />)}</div>;
}

// Newest products across ALL specialities, so every new device gets links from the homepage.
export async function LatestDevices({ limit = 6, exclude = null, title = 'Newest devices', eyebrow = 'Just added' }) {
  const rows = await query`select slug, name, category, image_url from products order by id desc limit ${limit + 2}`;
  const items = rows.filter((r) => !(exclude && r.slug === exclude.slug && r.category === exclude.category)).slice(0, limit);
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">{eyebrow}</p>
        <h2 className="mb-8 text-3xl font-bold md:text-4xl">{title}</h2>
        <DeviceGrid items={items} cols="sm:grid-cols-2 lg:grid-cols-3" />
      </div>
    </section>
  );
}

// Product page: same-speciality devices first, filled up from other specialities, plus category links.
export async function RelatedDevices({ product, category }) {
  const same = await query`select slug, name, category, image_url from products where category = ${category.key} and id <> ${product.id} order by sort, id limit 6`;
  let items = same;
  if (items.length < 6) {
    const more = await query`select slug, name, category, image_url from products where category <> ${category.key} order by id desc limit ${6 - items.length}`;
    items = [...items, ...more];
  }
  if (!items.length) return null;
  return (
    <div>
      <h2 className="mb-3 text-xl font-bold">Related medical devices</h2>
      <DeviceGrid items={items} cols="sm:grid-cols-2" />
    </div>
  );
}
