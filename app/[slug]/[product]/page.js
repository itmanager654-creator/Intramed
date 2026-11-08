import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { getCategory } from '@/lib/categories';
import { SITE } from '@/lib/site';
import { getContent, contactOf } from '@/lib/content';
import { buildMeta } from '@/lib/seo';
import { CATEGORIES } from '@/lib/categories';
import { productInfo, productFaqs } from '@/lib/productInfo';
import InquiryForm from '@/components/InquiryForm';
import JsonLd from '@/components/JsonLd';
import { RelatedDevices } from '@/components/DeviceLinks';

export const dynamic = 'force-dynamic';

async function load(params) {
  const c = getCategory(params.slug);
  if (!c) return {};
  const rows = await query`select * from products where category = ${c.key} and slug = ${params.product} limit 1`;
  return { c, p: rows[0] };
}

const firstSentence = (s) => (s.match(/^.*?[.!?](\s|$)/)?.[0] || s).trim();

// Cut at a whole word so Google never shows a broken half-word.
const clip = (s, n) => {
  s = s.replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-–]\s*$/, '') + '…';
};

export async function generateMetadata({ params }) {
  const { c, p } = await load(params);
  if (!p) return {};
  const info = productInfo(p.name, c.key);
  const own = (p.description || '').trim();
  const body = own ? firstSentence(own) : firstSentence(info.use);
  const description = clip(
    `${p.name} supplier & distributor in Pakistan. ${body} Order from IntraMed Solution, Lahore. Call or WhatsApp for price & availability.`,
    158
  );
  const keywords = [
    p.name,
    info.kind,
    `${c.name} devices Pakistan`,
    `${p.name} Pakistan`,
    `${p.name} price Pakistan`,
    'medical devices supplier Pakistan',
    'disposable medical devices Lahore',
    'IntraMed Solution',
  ].filter(Boolean);
  return buildMeta({
    title: `${p.name} Supplier & Distributor in Pakistan | Lahore – IntraMed Solution`,
    description,
    keywords,
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

        <p className="mt-8 text-sm"><Link href={`/${c.slug}/`} className="font-semibold text-brand hover:underline">← Back to all {c.name.toLowerCase()} devices</Link> · <Link href="/contact/" className="font-semibold text-brand hover:underline">Contact us</Link></p>

        <div className="mt-12 max-w-3xl">
          <h2 className="mb-4 text-xl font-bold">How to order {p.name}</h2>
          <ol className="grid gap-3 text-muted sm:grid-cols-2">
            {[
              ['Send your requirement', 'Use the quotation form below or WhatsApp us with the product name and quantity.'],
              ['Get a quotation', 'We reply with availability, price and delivery time, usually within one business day.'],
              ['Confirm the order', 'Approve the quotation and share your hospital or clinic name and delivery address.'],
              ['Receive your device', 'We deliver across Pakistan in 2-3 business days. Check the box and batch details on arrival.'],
            ].map(([h, d], i) => (
              <li key={h} className="card flex gap-4 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand font-bold text-white">{i + 1}</span>
                <span><span className="block font-semibold text-ink">{h}</span><span className="text-sm">{d}</span></span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 max-w-3xl">
          <h2 className="mb-4 text-xl font-bold">Frequently asked questions</h2>
          <div className="grid gap-3">{faqs.map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-muted">{a}</p></details>)}</div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div><h2 className="mb-3 text-xl font-bold">Request a quotation</h2><InquiryForm product={p.name} compact phone={ct.phone} /></div>
          <div>
            <RelatedDevices product={p} category={c} />
            <h2 className="mb-3 mt-8 text-xl font-bold">Browse by speciality</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {CATEGORIES.map((x) => <li key={x.slug}><Link href={`/${x.slug}/`} className="text-brand hover:underline">{x.name} devices catalog →</Link></li>)}
            </ul>
          </div>
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
