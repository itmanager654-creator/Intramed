import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { CATEGORIES, getCategory, categoryFaqs } from '@/lib/categories';
import { getContent } from '@/lib/content';
import { buildMeta } from '@/lib/seo';
import { SITE } from '@/lib/site';
import OrganArt from '@/components/OrganArt';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const c = getCategory(params.slug);
  if (!c) return {};
  const t = await getContent();
  return buildMeta({ title: t(`cat.${c.slug}.seoTitle`), description: t(`cat.${c.slug}.seoDesc`), path: `/${c.slug}/` });
}

export default async function CategoryPage({ params }) {
  const c = getCategory(params.slug);
  if (!c) notFound();
  const t = await getContent();
  const k = (s) => t(`cat.${c.slug}.${s}`);
  const products = await query`select id, slug, name, spec, image_url from products where category = ${c.key} order by sort, id`;
  const faqs = categoryFaqs(c, t('contact.phone'));
  const url = `${SITE.url}/${c.slug}/`;
  const words = k('h1').split(' ');
  const last = words.pop();
  const items = k('items').split('\n').map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <section className="border-b border-line bg-alt">
        <div className="wrap grid items-center gap-8 py-12 md:grid-cols-[1.4fr_1fr] md:py-16">
          <div>
            <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted"><Link href="/" className="hover:text-brand">Home</Link> / {c.name}</nav>
            <h1 className="text-3xl font-extrabold md:text-5xl">{words.join(' ')} <span className="text-brand">{last}</span></h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{k('lead')}</p>
            <a href="#catalog" className="btn btn-primary mt-6">View catalog</a>
          </div>
          <OrganArt type={c.slug} className="mx-auto w-full max-w-[260px] md:max-w-[340px]" />
        </div>
      </section>

      {/* Catalog first, so visitors reach products immediately */}
      <section className="section" id="catalog">
        <div className="wrap">
          <div className="mb-4 flex items-baseline justify-between"><h2 className="text-2xl font-bold">{k('catalogHeading')}</h2><span className="text-sm text-muted">{products.length} products</span></div>
          {products.length === 0 ? (
            <div className="card p-6 text-center"><p className="font-semibold">Catalog is being updated</p><p className="text-sm text-muted">Please <Link href="/contact/" className="text-brand underline">contact us</Link> for current availability.</p></div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-surface2 text-muted"><tr><th className="p-3">SR#</th><th className="p-3">Photo</th><th className="p-3">Product name</th><th className="p-3">Specification</th></tr></thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} className="border-t border-line align-middle">
                      <td className="p-3 text-muted">{i + 1}</td>
                      <td className="p-3">{p.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt={p.name} width={64} height={64} loading="lazy" className="h-16 w-16 rounded-lg border border-line object-cover" /> : <span className="grid h-16 w-16 place-items-center rounded-lg bg-surface2 text-xs text-muted">No photo</span>}</td>
                      <td className="p-3 font-medium"><Link href={`/${c.slug}/${p.slug}/`} className="text-brand hover:underline">{p.name}</Link></td>
                      <td className="p-3 text-muted">{p.spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="section bg-alt">
        <div className="wrap prose-im max-w-3xl">
          <h2>{k('introHeading')}</h2>
          <p>{k('intro')}</p>
          {items.length > 0 && <ul className="mb-4 list-disc pl-5 text-muted">{items.map((i) => <li key={i}>{i}</li>)}</ul>}
          <h3>{k('pkHeading')}</h3><p>{k('pk')}</p>
          <h3>{k('lhHeading')}</h3><p>{k('lh')}</p>
          <h3>{k('dsHeading')}</h3><p>{k('ds')}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold">Frequently asked questions</h2>
          <div className="grid gap-3">{faqs.map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-muted">{a}</p></details>)}</div>
          <h2 className="mb-4 mt-12 text-2xl font-bold">Other specialities</h2>
          <div className="flex flex-wrap gap-3">{CATEGORIES.filter((x) => x.slug !== c.slug).map((x) => <Link key={x.slug} href={`/${x.slug}/`} className="btn btn-outline">{x.name} Devices</Link>)}</div>
        </div>
      </section>

      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
        { '@type': 'ListItem', position: 2, name: `${c.name} Devices`, item: url }] }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${c.name} Devices Catalog`, url, about: { '@type': 'Thing', name: `${c.name} devices` }, isPartOf: { '@id': `${SITE.url}/#website` }, publisher: { '@id': `${SITE.url}/#organization` },
        mainEntity: { '@type': 'ItemList', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${url}${p.slug}/`, name: p.name })) } }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }} />
    </>
  );
}
