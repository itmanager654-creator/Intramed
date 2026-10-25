import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { CATEGORIES, getCategory, categoryFaqs } from '@/lib/categories';
import { SITE } from '@/lib/site';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }) {
  const c = getCategory(params.slug);
  if (!c) return {};
  return {
    title: `${c.name} Devices Supplier & Distributor in Pakistan | Lahore, Karachi, Islamabad – IntraMed Solution`,
    description: `${c.name} devices supplier & distributor in Pakistan — based in Lahore, delivering to Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar & nationwide. Sterile disposable ${c.name.toLowerCase()} devices for hospitals.`,
    alternates: { canonical: `/${c.slug}/` },
  };
}

export default async function CategoryPage({ params }) {
  const c = getCategory(params.slug);
  if (!c) notFound();
  const n = c.name.toLowerCase();
  const products = await query`select id, slug, name, spec, image_url from products where category = ${c.key} order by sort, id`;
  const faqs = categoryFaqs(c);
  const url = `${SITE.url}/${c.slug}/`;

  return (
    <>
      <section className="border-b border-line bg-alt">
        <div className="wrap py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted"><Link href="/" className="hover:text-brand">Home</Link> / {c.name}</nav>
          <h1 className="text-3xl font-extrabold md:text-5xl">{c.name} Devices Supplier & Distributor in <span className="text-brand">Pakistan</span></h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{c.lead}</p>
        </div>
      </section>

      {/* Catalog first, so visitors reach products immediately */}
      <section className="section" id="catalog">
        <div className="wrap">
          <div className="mb-4 flex items-baseline justify-between"><h2 className="text-2xl font-bold">{c.name} product catalog</h2><span className="text-sm text-muted">{products.length} products</span></div>
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
          <h2>{c.name} Devices in Lahore, Pakistan</h2>
          <p>IntraMed Solution is a Lahore-based supplier of disposable {n} devices, serving {c.users} across Pakistan. Every device is sterile, single-use and sourced to the specifications clinicians already trust, with ready stock and on-time delivery across Lahore and nationwide.</p>
          <ul className="mb-4 list-disc pl-5 text-muted">{c.items.map((i) => <li key={i}>{i}</li>)}</ul>
          <h3>{c.name} Devices Supplier in Pakistan</h3>
          <p>As a dedicated {n} devices supplier in Pakistan, IntraMed Solution delivers to hospitals, private clinics and government institutions in {SITE.cities.slice(0, 7).join(', ')} and beyond. Nationwide orders are dispatched within 2-3 business days so {c.users} never run short of essential disposables.</p>
          <h3>{c.name} Devices Supplier in Lahore</h3>
          <p>In Lahore we hold ready stock of {n} devices for same-day or next-day delivery, so local hospitals can restock without long lead times.</p>
          <h3>{c.name} Devices Distributor in Pakistan</h3>
          <p>Beyond direct supply, we work as a {n} devices distributor in Pakistan, partnering with international manufacturers to bring authentic, regulatory-compliant products to the local market, with consistent pricing, batch traceability and dedicated after-sales support.</p>
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
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${c.name} Devices Catalog`, url,
        mainEntity: { '@type': 'ItemList', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${url}${p.slug}/`, name: p.name })) } }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }} />
    </>
  );
}
