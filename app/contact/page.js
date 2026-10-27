import { getContent, contactOf } from '@/lib/content';
import { buildMeta } from '@/lib/seo';
import InquiryForm from '@/components/InquiryForm';

export const dynamic = 'force-dynamic';
export const metadata = buildMeta({
  title: 'Contact IntraMed Solution | Medical Devices Supplier Lahore, Pakistan',
  description: 'Contact IntraMed Solution in Lahore for cardiology, urology, gastroenterology and vascular device quotations across Pakistan.',
  path: '/contact/',
});

export default async function Contact({ searchParams }) {
  const t = await getContent();
  const ct = contactOf(t);
  return (
    <div className="wrap section">
      <h1 className="text-3xl font-extrabold md:text-5xl">{t('contact.heading')}</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <InquiryForm product={typeof searchParams?.product === 'string' ? searchParams.product : ''} phone={ct.phone} />
        <address className="card h-fit p-6 not-italic leading-8">
          <h2 className="mb-2 text-xl font-bold">IntraMed Solution</h2>
          {ct.address}<br />
          Phone: <a className="text-brand" href={`tel:${ct.tel || ct.phone}`}>{ct.phone}</a><br />
          WhatsApp: <a className="text-brand" href={`https://wa.me/${ct.wa}`}>{ct.phone}</a><br />
          Email: <a className="text-brand" href={`mailto:${ct.email}`}>{ct.email}</a>
          {ct.hours && <><br />Hours: {ct.hours}</>}
          {ct.maps && <><br /><a className="text-brand underline" href={ct.maps} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></>}
          {ct.social.length > 0 && <><br />{ct.social.map(([n, u]) => <a key={n} className="mr-4 text-brand underline" href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}</>}
        </address>
      </div>
    </div>
  );
}
