import { SITE } from '@/lib/site';

// One place that builds complete, consistent metadata (title, description, canonical, Open Graph, Twitter).
export function buildMeta({ title, description, path = '/', image }) {
  const img = image || '/og-image.png';
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: `${SITE.url}${path}`, siteName: SITE.name, type: 'website', locale: 'en_PK', images: [{ url: img }] },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}
