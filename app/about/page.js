import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { SITE } from '@/lib/site';
import { getContent } from '@/lib/content';
import { buildMeta } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const t = await getContent();
  return buildMeta({ title: t('about.seoTitle'), description: t('about.seoDesc'), path: '/about/' });
}

export default async function About() {
  const t = await getContent();
  return (
    <>
      <section className="border-b border-line bg-alt">
        <div className="wrap py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted"><Link href="/" className="hover:text-brand">Home</Link> / About</nav>
          <h1 className="text-3xl font-extrabold md:text-5xl">{t('about.heading')}</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="prose-im">
            <p className="text-lg">{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact/" className="btn btn-primary">Contact us</Link>
              {CATEGORIES.map((c) => <Link key={c.slug} href={`/${c.slug}/`} className="btn btn-outline">{c.name}</Link>)}
            </div>
          </div>
          <aside className="card h-fit p-6">
            <p className="text-sm text-muted">Leadership</p>
            <p className="mt-1 font-heading text-2xl font-bold">{t('about.leaderName')}</p>
            <p className="font-medium text-brand">{t('about.leaderRole')}</p>
            <p className="mt-2 text-sm text-muted">{t('about.leaderNote')}</p>
          </aside>
        </div>
      </section>

      <section className="section bg-alt">
        <div className="wrap grid gap-6 md:grid-cols-2">
          <div className="card p-6"><h2 className="mb-2 text-xl font-bold">Our vision</h2><p className="text-muted">{t('about.vision')}</p></div>
          <div className="card p-6"><h2 className="mb-2 text-xl font-bold">Our mission</h2><p className="text-muted">{t('about.mission')}</p></div>
        </div>
      </section>

      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'AboutPage', url: `${SITE.url}/about/`, name: t('about.heading'), isPartOf: { '@id': `${SITE.url}/#website` }, about: { '@id': `${SITE.url}/#organization` }, mainEntity: { '@id': `${SITE.url}/#organization` } }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
        { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE.url}/about/` }] }} />
    </>
  );
}
