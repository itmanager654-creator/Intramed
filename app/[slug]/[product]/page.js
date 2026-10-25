import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { getCategory } from '@/lib/categories';
import { SITE } from '@/lib/site';
import InquiryForm from '@/components/InquiryForm';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

async function load(params) {
  const c = getCategory(params.slug);
  if (!c) return {};
  const rows = await query`select * from products where category = ${c.key} and slug = ${params.product} limit 1`;
  return { c, p: rows[0] };
}

export async function generateMetadata({ params }) {
  const { c, p } = await load(params);
  if (!p) return {};
  const desc = (p.description || p.spec || `${p.name} — sterile, single-use ${c.name.toLowerCase()} device.`).slice(0, 150);
  return {
    title: `${p.name} Supplier & Distributor in Pakistan | Lahore – IntraMed Solution`,
    description: `${p.name} supplier in Pakistan. ${desc} Delivery in Lahore, Karachi, Islamabad & nationwide.`,
    alternates: { canonical: `/${c.slug}/${p.slug}/` },
    openGraph: p.image_url ? { images: [p.image_url] } : undefined,
  };
}

export default async function ProductPage({ params }) {
  const { c, p } = await load(params);
  if (!c || !p) notFound();
  const related = await query`select slug, name from products where category = ${c.key} and id <> ${p.id} order by sort, id limit 6`;
  const url = `${SITE.url}/${c.slug}/${p.slug}/`;

  return (
    <>
      <div className="wrap py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted">
          <Link href="/" className="hover:text-brand">Home</Link> / <Link href={`/${c.slug}/`} className="hover:text-brand">{c.name}</Link> / {p.name}
        </nav>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card grid min-h-[280px] place-items-center overflow-hidden p-4">
            {p.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt={p.name} className="max-h-[420px] w-auto rounded-lg object-contain" /> : <span className="text-muted">No photo yet</span>}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold md:text-4xl">{p.name}</h1>
            <p className="mt-2 text-sm font-medium text-brand">{c.name} device · Supplier & distributor in Pakistan</p>
            {p.spec && <p className="mt-5"><span className="font-semibold">Specification:</span> <span className="text-muted">{p.spec}</span></p>}
            {p.description && <p className="mt-4 whitespace-pre-line text-muted">{p.description}</p>}
            <p className="mt-4 text-muted">Sterile, single-use and supplied from Lahore to hospitals and clinics across Pakistan, with delivery in 2-3 business days nationwide.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hello, I need a quotation for: ${p.name}`)}`} className="btn btn-primary">WhatsApp for quotation</a>
              <a href={`tel:${SITE.tel}`} className="btn btn-outline">Call {SITE.phone}</a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div><h2 className="mb-3 text-xl font-bold">Request a quotation</h2><InquiryForm product={p.name} compact /></div>
          {related.length > 0 && (
            <div><h2 className="mb-3 text-xl font-bold">More {c.name.toLowerCase()} devices</h2>
              <ul className="grid gap-2">{related.map((r) => <li key={r.slug}><Link href={`/${c.slug}/${r.slug}/`} className="text-brand hover:underline">{r.name}</Link></li>)}</ul>
            </div>
          )}
        </div>
      </div>

      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description || p.spec || `${p.name} supplied in Pakistan by ${SITE.name}.`, image: p.image_url ? [p.image_url] : undefined, category: `${c.name} devices`, url,
        brand: { '@type': 'Organization', name: SITE.name }, sku: `IM-${p.id}` }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
        { '@type': 'ListItem', position: 2, name: `${c.name} Devices`, item: `${SITE.url}/${c.slug}/` },
        { '@type': 'ListItem', position: 3, name: p.name, item: url }] }} />
    </>
  );
}
