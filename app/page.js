import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { SITE } from '@/lib/site';
import { query } from '@/lib/db';
import { getContent } from '@/lib/content';
import { buildMeta } from '@/lib/seo';
import OrganArt from '@/components/OrganArt';
import JsonLd from '@/components/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const t = await getContent();
  return buildMeta({ title: t('home.seoTitle'), description: t('home.seoDesc'), path: '/' });
}

const FAQ = [
  ['Where can I buy surgical devices and medical equipment in Lahore?', 'IntraMed Solution is a Lahore-based supplier of disposable surgical devices serving hospitals, surgical centers and clinics across Pakistan for gastroenterology, cardiology, urology, vascular and general surgical procedures.'],
  ['What disposable medical devices does IntraMed Solution supply?', 'Four core areas: gastroenterology, cardiology, urology and peripheral vascular devices. All are sterile, single-use and meet international quality standards.'],
  ['Do you deliver outside Lahore?', 'Yes. We deliver nationwide — Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar and more — in 2-3 business days.'],
  ['Are you a medical devices supplier or distributor in Pakistan?', 'Both. We supply directly from ready Lahore stock and also work as a distributor for hospitals sourcing cardiology, urology, gastroenterology and vascular devices in volume.'],
];

export default async function Home() {
  const t = await getContent();
  const [featured, partners, clients] = await Promise.all([
    query`select * from featured order by sort, id`,
    query`select * from partners order by sort, id`,
    query`select * from clients order by sort, id`,
  ]);

  return (
    <>
      <section className="border-b border-line bg-alt">
        <div className="wrap grid items-center gap-10 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="mb-3 text-sm font-semibold text-brand">{t('home.eyebrow')}</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">{t('home.title1')} <span className="text-brand">{t('home.title2')}</span></h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{t('home.lead')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#specialities" className="btn btn-primary">{t('home.cta1')}</Link>
              <Link href="/contact/" className="btn btn-outline">{t('home.cta2')}</Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n}><dt className="font-heading text-2xl font-bold text-brand">{t(`home.stat${n}n`)}</dt><dd className="text-xs text-muted">{t(`home.stat${n}l`)}</dd></div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-4" aria-label="Our specialities">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/${c.slug}/`} className="card group p-4 text-center transition hover:-translate-y-1 hover:border-brand">
                <OrganArt type={c.slug} className="mx-auto w-full max-w-[150px] transition group-hover:scale-105" />
                <p className="mt-2 text-sm font-semibold">{c.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="specialities" className="section">
        <div className="wrap">
          <h2 className="text-3xl font-bold md:text-4xl">{t('home.specHeading')}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/${c.slug}/`} className="card block p-6 transition hover:-translate-y-1 hover:border-brand">
                <h3 className="text-xl font-semibold">{c.name} Devices</h3>
                <p className="mt-2 text-sm text-muted">{t(`cat.${c.slug}.lead`)}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand">View catalog →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section bg-alt">
          <div className="wrap">
            <h2 className="text-3xl font-bold">{t('home.featuredHeading')}</h2>
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

      <section className="section">
        <div className="wrap grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="prose-im">
            <h2>{t('home.aboutHeading')}</h2>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <Link href="/about/" className="font-semibold text-brand hover:underline">Read more about us →</Link>
          </div>
          <div className="card p-6">
            <p className="text-sm text-muted">Leadership</p>
            <p className="mt-1 font-heading text-2xl font-bold">{t('about.leaderName')}</p>
            <p className="font-medium text-brand">{t('about.leaderRole')}</p>
            <p className="mt-2 text-sm text-muted">{t('about.leaderNote')}</p>
          </div>
        </div>
      </section>

      <section className="section bg-alt">
        <div className="wrap">
          <h2 className="text-3xl font-bold">{t('home.vmpHeading')}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="card p-6"><h3 className="mb-2 text-xl font-semibold">Our vision</h3><p className="text-sm text-muted">{t('about.vision')}</p></div>
            <div className="card p-6"><h3 className="mb-2 text-xl font-semibold">Our mission</h3><p className="text-sm text-muted">{t('about.mission')}</p></div>
            <div className="card p-6"><h3 className="mb-2 text-xl font-semibold">Our promise</h3><p className="text-sm text-muted">{t('about.promise')}</p></div>
          </div>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="section bg-alt">
          <div className="wrap">
            <h2 className="text-3xl font-bold">{t('home.partnersHeading')}</h2>
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
        <section className="section">
          <div className="wrap">
            <h2 className="text-3xl font-bold">{t('home.clientsHeading')}</h2>
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
          <h2>{t('home.pkHeading')}</h2>
          <p>{t('home.pkText')}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link href={`/${c.slug}/`} className="font-medium text-brand hover:underline">{c.name} Devices Supplier & Distributor in Pakistan</Link></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold">{t('home.faqHeading')}</h2>
          <div className="grid gap-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="card p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-muted">{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Medical device specialities', itemListElement: CATEGORIES.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.name} Devices`, url: `${SITE.url}/${c.slug}/` })) }} />
    </>
  );
}
