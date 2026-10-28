import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { SITE } from '@/lib/site';
import { query } from '@/lib/db';
import { getContent, contactOf } from '@/lib/content';
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

  const ct = contactOf(t);
  const loop = clients.length ? Array.from({ length: Math.max(1, Math.ceil(8 / clients.length)) }, () => clients).flat() : [];
  const TRUST = ['Sterile & single-use', 'Nationwide delivery in 2-3 days', 'Genuine, authentic devices', 'Dedicated after-sales support'];
  const Tick = () => <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8.2" /><path d="M6.2 10.3l2.6 2.6 5-5.4" /></svg>;
  const Head = ({ eyebrow, title, sub }) => (
    <div className="reveal mx-auto max-w-2xl text-center">
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">{eyebrow}</p>}
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted">{sub}</p>}
    </div>
  );

  return (
    <>
      {/* HERO */}
      <section className="hero-bg relative overflow-hidden border-b border-line">
        <div className="blob pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
        <div className="blob pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" style={{ animationDelay: '-6s' }} />
        <div className="wrap relative grid items-center gap-10 py-14 md:grid-cols-[1.1fr_1fr] md:py-24">
          <div>
            <p className="reveal mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand shadow-card">
              <svg viewBox="0 0 24 24" className="heartbeat h-4 w-4" fill="currentColor"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" /></svg>
              {t('home.eyebrow')}
            </p>
            <h1 className="reveal text-4xl font-extrabold leading-tight md:text-6xl" style={{ '--d': '80ms' }}>{t('home.title1')} <span className="text-brand">{t('home.title2')}</span></h1>
            <svg viewBox="0 0 260 36" className="reveal mt-3 h-8 w-64 text-brand" style={{ '--d': '140ms' }} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path className="ecg-line" d="M2 20 H70 L82 20 L90 6 L102 32 L112 12 L120 20 H260" />
            </svg>
            <p className="reveal mt-4 max-w-xl text-lg text-muted" style={{ '--d': '200ms' }}>{t('home.lead')}</p>
            <div className="reveal mt-7 flex flex-wrap gap-3" style={{ '--d': '260ms' }}>
              <Link href="#specialities" className="btn btn-primary">{t('home.cta1')}</Link>
              <Link href="/contact/" className="btn btn-outline">{t('home.cta2')}</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4" aria-label="Our specialities">
            {CATEGORIES.map((c, i) => (
              <Link key={c.slug} href={`/${c.slug}/`} className="reveal" style={{ '--d': `${i * 90}ms` }}>
                <div className="floaty card group p-4 text-center transition hover:border-brand hover:shadow-xl" style={{ '--d': `${i * 400}ms` }}>
                  <OrganArt type={c.slug} className="mx-auto w-full max-w-[150px] transition duration-500 group-hover:scale-110" />
                  <p className="mt-2 text-sm font-semibold">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-line bg-surface">
        <div className="wrap grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((x, i) => (
            <p key={x} className="reveal flex items-center gap-2 text-sm font-medium" style={{ '--d': `${i * 70}ms` }}><Tick />{x}</p>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stat-band text-white">
        <dl className="wrap grid grid-cols-3 gap-4 py-8 text-center">
          {[1, 2, 3].map((n) => (
            <div key={n} className="reveal" style={{ '--d': `${n * 90}ms` }}>
              <dt className="font-heading text-3xl font-extrabold md:text-5xl">{t(`home.stat${n}n`)}</dt>
              <dd className="mt-1 text-xs text-white/85 md:text-sm">{t(`home.stat${n}l`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* SPECIALITIES */}
      <section id="specialities" className="section">
        <div className="wrap">
          <Head eyebrow="What we supply" title={t('home.specHeading')} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c, i) => (
              <Link key={c.slug} href={`/${c.slug}/`} className="reveal group card relative block overflow-hidden p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-xl" style={{ '--d': `${i * 90}ms` }}>
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
                <span className="font-heading text-4xl font-extrabold text-brand/20">0{i + 1}</span>
                <h3 className="mt-1 text-xl font-semibold">{c.name} Devices</h3>
                <p className="mt-2 text-sm text-muted">{t(`cat.${c.slug}.lead`)}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">View catalog <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section bg-alt">
          <div className="wrap">
            <Head eyebrow="Popular" title={t('home.featuredHeading')} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((f, i) => (
                <article key={f.id} className="reveal card group overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-xl" style={{ '--d': `${(i % 4) * 90}ms` }}>
                  <div className="overflow-hidden">
                    {f.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={f.image_url} alt={f.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="aspect-[4/3] bg-surface2" />}
                  </div>
                  <div className="p-4">
                    {f.tag && <span className="rounded-full bg-tint px-2 py-0.5 text-xs font-semibold text-brand">{f.tag}</span>}
                    <h3 className="mt-2 font-semibold">{f.title}</h3>
                    {f.description && <p className="mt-1 text-sm text-muted">{f.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      <section className="section">
        <div className="wrap grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="prose-im reveal">
            <h2>{t('home.aboutHeading')}</h2>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <Link href="/about/" className="font-semibold text-brand hover:underline">Read more about us →</Link>
          </div>
          <div className="reveal card relative overflow-hidden p-6" style={{ '--d': '120ms' }}>
            <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-tint" />
            <p className="relative text-sm text-muted">Leadership</p>
            <p className="relative mt-1 font-heading text-2xl font-bold">{t('about.leaderName')}</p>
            <p className="relative font-medium text-brand">{t('about.leaderRole')}</p>
            <p className="relative mt-2 text-sm text-muted">{t('about.leaderNote')}</p>
          </div>
        </div>
      </section>

      <section className="section bg-alt">
        <div className="wrap">
          <Head title={t('home.vmpHeading')} />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[['Our vision', 'about.vision'], ['Our mission', 'about.mission'], ['Our promise', 'about.promise']].map(([h, k], i) => (
              <div key={k} className="reveal card p-6 transition duration-300 hover:-translate-y-1 hover:border-brand" style={{ '--d': `${i * 100}ms` }}>
                <h3 className="mb-2 text-xl font-semibold">{h}</h3><p className="text-sm text-muted">{t(k)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MANUFACTURERS / PARTNERS */}
      {partners.length > 0 && (
        <section className="section">
          <div className="wrap">
            <Head eyebrow="Where our products come from" title={t('home.partnersHeading')} sub="Genuine devices sourced directly from trusted manufacturers." />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((p, i) => (
                <div key={p.id} className="reveal card group flex items-center gap-4 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl" style={{ '--d': `${(i % 3) * 90}ms` }}>
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white p-2">
                    {p.logo_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.logo_url} alt={`${p.name} logo`} loading="lazy" className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-110" /> : <span className="font-heading text-2xl font-bold text-brand">{p.name.slice(0, 1)}</span>}
                  </div>
                  <div><p className="text-lg font-semibold">{p.name}</p>{p.description && <p className="mt-0.5 text-sm text-muted">{p.description}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLIENTS: scrolling logo strip */}
      {clients.length > 0 && (
        <section className="section bg-alt">
          <div className="wrap"><Head eyebrow="Our clients" title={t('home.clientsHeading')} /></div>
          <div className="marquee mt-10">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <ul key={copy} className="flex shrink-0 items-center gap-5 pr-5" aria-hidden={copy === 1 ? 'true' : undefined}>
                  {loop.map((c, i) => (
                    <li key={`${c.id}-${i}`} className="card grid h-24 w-44 shrink-0 place-items-center p-3 text-center text-sm font-medium">
                      {c.logo_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.logo_url} alt={copy === 0 ? c.label : ''} loading="lazy" className="max-h-16 w-auto max-w-full object-contain grayscale transition duration-300 hover:grayscale-0" /> : c.label}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <div className="reveal stat-band relative overflow-hidden rounded-3xl p-8 text-center text-white md:p-12">
            <span className="blob pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <h2 className="relative text-2xl font-bold md:text-4xl">Need devices for your hospital or clinic?</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/85">Tell us what you need and we will reply with availability and pricing.</p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact/" className="btn bg-white !text-brand hover:bg-white/90">Send inquiry</Link>
              {ct.tel && <a href={`tel:${ct.tel}`} className="btn border-white/60 text-white hover:bg-white/10">Call {ct.phone}</a>}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-alt">
        <div className="wrap prose-im reveal max-w-3xl">
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
          <h2 className="reveal mb-6 text-3xl font-bold">{t('home.faqHeading')}</h2>
          <div className="grid gap-3">
            {FAQ.map(([q, a], i) => (
              <details key={q} className="reveal card p-4" style={{ '--d': `${i * 60}ms` }}><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-muted">{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Medical device specialities', itemListElement: CATEGORIES.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.name} Devices`, url: `${SITE.url}/${c.slug}/` })) }} />
    </>
  );
}
