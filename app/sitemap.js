import { query } from '@/lib/db';
import { CATEGORIES, getCategoryByKey } from '@/lib/categories';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const now = new Date();
  const base = [
    { url: `${SITE.url}/`, priority: 1 },
    ...CATEGORIES.map((c) => ({ url: `${SITE.url}/${c.slug}/`, priority: 0.9 })),
    { url: `${SITE.url}/gallery/`, priority: 0.5 },
    { url: `${SITE.url}/contact/`, priority: 0.6 },
  ].map((e) => ({ ...e, lastModified: now, changeFrequency: 'weekly' }));

  const products = await query`select category, slug, created_at from products`;
  const productUrls = products.map((p) => {
    const c = getCategoryByKey(p.category);
    return c ? { url: `${SITE.url}/${c.slug}/${p.slug}/`, lastModified: new Date(p.created_at), changeFrequency: 'monthly', priority: 0.8 } : null;
  }).filter(Boolean);
  return [...base, ...productUrls];
}
