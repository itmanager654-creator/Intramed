import { SITE } from '@/lib/site';

// One place that builds complete, consistent metadata (title, description, canonical, Open Graph, Twitter).
export function buildMeta({ title, description, path = '/', image, keywords }) {
  const img = image || '/og-image.png';
  return {
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    alternates: { canonical: path },
    openGraph: { title, description, url: `${SITE.url}${path}`, siteName: SITE.name, type: 'website', locale: 'en_PK', images: [{ url: img }] },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}
