import { query } from '@/lib/db';
import { CATEGORIES, getCategoryByKey } from '@/lib/categories';
import { SITE } from '@/lib/site';

// Always built fresh from the database: add products in /admin/ and they appear here automatically.
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const products = await query`select category, slug, created_at from products order by id`;
  const dateOf = (p) => new Date(p.created_at);
  const latest = (list) => list.length ? new Date(Math.max(...list.map((p) => dateOf(p).getTime()))) : new Date('2026-01-01');
  const all = latest(products);

  const base = [
    { url: `${SITE.url}/`, lastModified: all, changeFrequency: 'weekly', priority: 1 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE.url}/${c.slug}/`,
      lastModified: latest(products.filter((p) => p.category === c.key)),
      changeFrequency: 'weekly', priority: 0.9,
    })),
    { url: `${SITE.url}/about/`, lastModified: all, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/gallery/`, lastModified: all, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/contact/`, lastModified: all, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const productUrls = products.map((p) => {
    const c = getCategoryByKey(p.category);
    return c ? { url: `${SITE.url}/${c.slug}/${p.slug}/`, lastModified: dateOf(p), changeFrequency: 'monthly', priority: 0.8 } : null;
  }).filter(Boolean);
  return [...base, ...productUrls];
}
