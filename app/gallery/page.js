import { query } from '@/lib/db';
import { getContent } from '@/lib/content';
import { buildMeta } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata = buildMeta({
  title: 'Product Gallery | Medical Devices in Pakistan – IntraMed Solution',
  description: 'Photos of cardiology, urology, gastroenterology and vascular devices supplied by IntraMed Solution in Pakistan.',
  path: '/gallery/',
});

export default async function Gallery() {
  const t = await getContent();
  const items = await query`select id, url, category, caption from gallery order by id desc`;
  return (
    <div className="wrap section">
      <h1 className="text-3xl font-extrabold md:text-5xl">{t('gallery.heading')}</h1>
      {items.length === 0 ? <p className="mt-6 text-muted">Photos are being added.</p> : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((g) => (
            <figure key={g.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.caption || `${g.category} device`} loading="lazy" className="aspect-square w-full object-cover" />
              {(g.caption || g.category) && <figcaption className="p-3 text-sm text-muted">{g.caption || g.category}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
