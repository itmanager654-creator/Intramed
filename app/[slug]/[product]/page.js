import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { getCategory } from '@/lib/categories';
import { SITE } from '@/lib/site';
import { getContent, contactOf } from '@/lib/content';
import { buildMeta } from '@/lib/seo';
import { productInfo, productFaqs } from '@/lib/productInfo';
import InquiryForm from '@/components/InquiryForm';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

async function load(params) {
  const c = getCategory(params.slug);
  if (!c) return {};
  const rows = await query`select * from products where category = ${c.key} and slug = ${params.product} limit 1`;
  return { c, p: rows[0] };
}

const firstSentence = (s) => (s.match(/^.*?[.!?](\s|$)/)?.[0] || s).trim();

export async function generateMetadata({ params }) {
  const { c, p } = await load(params);
  if (!p) return {};
  const info = productInfo(p.name, c.key);
  const base = (p.description || '').trim() ? p.description.trim() : firstSentence(info.use);
  return buildMeta({
    title: `${p.name} Supplier & Distributor in Pakistan | Lahore – IntraMed Solution`,
    description: `${p.name} supplier in Pakistan. ${base}`.replace(/\s+/g, ' ').slice(0, 158),
    path: `/${c.slug}/${p.slug}/`,
    image: p.image_url || undefined,
  });
}

export default async function ProductPage({ params }) {
  const { c, p } = await load(params);
  if (!c || !p) notFound();
  const ct = contactOf(await getContent());
  const info = productInfo(p.name, c.key);
  const faqs = productFaqs(p.name, c.key, info, ct.phone);
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
            {p.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt={`${p.name} – ${info.kind}`} className="max-h-[420px] w-auto rounded-lg object-contain" /> : <span className="text-muted">No photo yet</span>}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold md:text-4xl">{p.name}</h1>
            <p className="mt-2 text-sm font-medium text-brand">{c.name} device · Supplier & distributor in Pakistan</p>
            {p.spec && <p className="mt-5"><span className="font-semibold">Specification:</span> <span className="text-muted">{p.spec}</span></p>}
            {p.description && <p className="mt-4 whitespace-pre-line text-muted">{p.description}</p>}
            <p className="mt-4 text-muted">{info.what}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`https://wa.me/${ct.wa}?text=${encodeURIComponent(`Hello, I need a quotation for: ${p.name}`)}`} className="btn btn-primary">WhatsApp for quotation</a>
              <a href={`tel:${ct.tel || ct.phone}`} className="btn btn-outline">Call {ct.phone}</a>
            </div>
          </div>
        </div>

        <div className="prose-im mt-12 max-w-3xl">
          <h2>What is {p.name}?</h2>
          <p>{info.what}</p>
          <h2>For which purpose is {p.name} used?</h2>
          <p>{info.use}</p>
          {info.how && (<><h2>How does {p.name} work?</h2><p>{info.how}</p></>)}
          <h2>{p.name} supplier in Pakistan</h2>
          <p>IntraMed Solution is a {c.name.toLowerCase()} devices supplier and distributor in Pakistan, based in Lahore. We supply sterile, single-use {p.name} to hospitals, clinics and {c.users} in Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar and across the country, with delivery in 2-3 business days.</p>
          <p className="text-sm">This information is general. The choice and use of any device must be made by a qualified physician according to the manufacturer&apos;s instructions for use.</p>
        </div>

        <div className="mt-10 max-w-3xl">
          <h2 className="mb-4 text-xl font-bold">Frequently asked questions</h2>
          <div className="grid gap-3">{faqs.map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-muted">{a}</p></details>)}</div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div><h2 className="mb-3 text-xl font-bold">Request a quotation</h2><InquiryForm product={p.name} compact phone={ct.phone} /></div>
          {related.length > 0 && (
            <div><h2 className="mb-3 text-xl font-bold">More {c.name.toLowerCase()} devices</h2>
              <ul className="grid gap-2">{related.map((r) => <li key={r.slug}><Link href={`/${c.slug}/${r.slug}/`} className="text-brand hover:underline">{r.name}</Link></li>)}</ul>
            </div>
          )}
        </div>
      </div>

      {/* ItemPage + FAQ + Breadcrumb. No "Product" markup: Google's Product snippets require a price or reviews, which a quotation-based supplier does not publish. */}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemPage', '@id': `${url}#page`, url, name: `${p.name} Supplier & Distributor in Pakistan`, isPartOf: { '@id': `${SITE.url}/#website` }, publisher: { '@id': `${SITE.url}/#organization` },
        mainEntity: { '@type': 'Thing', name: p.name, description: p.description || info.what, ...(p.image_url ? { image: p.image_url } : {}) } }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
        { '@type': 'ListItem', position: 2, name: `${c.name} Devices`, item: `${SITE.url}/${c.slug}/` },
        { '@type': 'ListItem', position: 3, name: p.name, item: url }] }} />
    </>
  );
}
