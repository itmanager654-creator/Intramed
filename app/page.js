import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { SITE } from '@/lib/site';
import InquiryForm from '@/components/InquiryForm';
import JsonLd from '@/components/JsonLd';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Medical Devices Supplier & Distributor in Pakistan | Cardiology, Urology, Gastroenterology, Vascular – IntraMed Solution',
  description: 'IntraMed Solution — medical devices supplier & distributor in Pakistan. Cardiology, urology, gastroenterology & vascular disposable devices delivered to hospitals in Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar & nationwide.',
  alternates: { canonical: '/' },
};

const FAQ = [
  ['Where can I buy surgical devices and medical equipment in Lahore?', 'IntraMed Solution is a Lahore-based supplier of disposable surgical devices serving hospitals, surgical centers and clinics across Pakistan for gastroenterology, cardiology, urology, vascular and general surgical procedures.'],
  ['What disposable medical devices does IntraMed Solution supply?', 'Four core areas: gastroenterology, cardiology, urology and peripheral vascular devices. All are sterile, single-use and meet international quality standards.'],
  ['Do you deliver outside Lahore?', 'Yes. We deliver nationwide — Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar and more — in 2-3 business days.'],
];

export default async function Home() {
  const [featured, partners, clients] = await Promise.all([
    query`select * from featured order by sort, id`,
    query`select * from partners order by sort, id`,
    query`select * from clients order by sort, id`,
  ]);
  return (
    <>
      <section className="border-b border-line bg-alt">
        <div className="wrap grid items-center gap-10 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div>
            <p className="mb-3 text-sm font-semibold text-brand">Medical devices supplier & distributor in Pakistan</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">INTRAMED <span className="text-brand">SOLUTION</span></h1>
            <p className="mt-5 max-w-xl text-lg text-muted">Sterile, single-use cardiology, urology, gastroenterology and vascular devices, delivered from Lahore to hospitals and clinics across Pakistan.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#specialities" className="btn btn-primary">Explore products</Link>
              <Link href="/contact/" className="btn btn-outline">Contact us</Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[['16+', 'Device types'], ['4', 'Specialities'], ['100%', 'Sterile, disposable']].map(([n, l]) => (
                <div key={l}><dt className="font-heading text-2xl font-bold text-brand">{n}</dt><dd className="text-xs text-muted">{l}</dd></div>
              ))}
            </dl>
          </div>
          <InquiryForm compact />
        </div>
      </section>

      <section id="specialities" className="section">
        <div className="wrap">
          <h2 className="text-3xl font-bold md:text-4xl">Purpose-built for four critical specialities</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/${c.slug}/`} className="card block p-6 transition hover:-translate-y-1 hover:border-brand">
                <h3 className="text-xl font-semibold">{c.name} Devices</h3>
                <p className="mt-2 text-sm text-muted">{c.lead}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand">View catalog →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {featured.length > 0 && (
        <section className="section bg-alt">
          <div className="wrap">
            <h2 className="text-3xl font-bold">Featured products</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((f) => (
                <article key={f.id} className="card overflow-hidden">
                  {f.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={f.image_url} alt={f.title} loading="lazy" className="aspect-[4/3] w-full object-cover" /> : <div className="aspect-[4/3] bg-surface2" />}
                  <div className="p-4">
                    {f.tag && <span className="text-xs font-semibold text-brand">{f.tag}</span>}
                    <h3 className="mt-1 font-semibold">{f.title}</h3>
                    {f.description && <p className="mt-1 text-sm text-muted">{f.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {partners.length > 0 && (
        <section className="section">
          <div className="wrap">
            <h2 className="text-3xl font-bold">Our partners</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {partners.map((p) => (
                <div key={p.id} className="card flex items-center gap-3 p-4">
                  {p.logo_url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.logo_url} alt={`${p.name} logo`} loading="lazy" className="h-12 w-12 rounded object-contain" />}
                  <div><p className="font-semibold">{p.name}</p>{p.description && <p className="text-xs text-muted">{p.description}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {clients.length > 0 && (
        <section className="section bg-alt">
          <div className="wrap">
            <h2 className="text-3xl font-bold">Trusted by hospitals and clinics</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {clients.map((c) => (
                <div key={c.id} className="card grid min-h-[84px] place-items-center p-3 text-center text-sm font-medium">
                  {c.logo_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.logo_url} alt={c.label} loading="lazy" className="max-h-14 w-auto object-contain" /> : c.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-alt">
        <div className="wrap prose-im max-w-3xl">
          <h2>Medical Devices Supplier & Distributor Across Pakistan</h2>
          <p>IntraMed Solution is a medical devices supplier and distributor in Pakistan, headquartered in Lahore. We deliver disposable cardiology, urology, gastroenterology and vascular devices to hospitals, cath-labs, endoscopy units and clinics in <b className="text-ink">{SITE.cities.join(', ')}</b>, with nationwide delivery in 2-3 business days.</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link href={`/${c.slug}/`} className="font-medium text-brand hover:underline">{c.name} Devices Supplier & Distributor in Pakistan</Link></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold">Frequently asked questions</h2>
          <div className="grid gap-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="card p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-muted">{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }} />
    </>
  );
}
