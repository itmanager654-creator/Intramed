import { SITE } from '@/lib/site';
import InquiryForm from '@/components/InquiryForm';

export const metadata = {
  title: 'Contact IntraMed Solution | Medical Devices Supplier Lahore, Pakistan',
  description: 'Contact IntraMed Solution in Lahore for cardiology, urology, gastroenterology and vascular device quotations. Call 0346 4711440.',
  alternates: { canonical: '/contact/' },
};

export default function Contact({ searchParams }) {
  return (
    <div className="wrap section">
      <h1 className="text-3xl font-extrabold md:text-5xl">Contact us</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <InquiryForm product={typeof searchParams?.product === 'string' ? searchParams.product : ''} />
        <address className="card h-fit p-6 not-italic leading-8">
          <h2 className="mb-2 text-xl font-bold">IntraMed Solution</h2>
          Lahore, Punjab, Pakistan<br />
          Phone: <a className="text-brand" href={`tel:${SITE.tel}`}>{SITE.phone}</a><br />
          WhatsApp: <a className="text-brand" href={`https://wa.me/${SITE.whatsapp}`}>{SITE.phone}</a><br />
          Email: <a className="text-brand" href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </address>
      </div>
    </div>
  );
}
