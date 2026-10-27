import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { getContent, contactOf } from '@/lib/content';

export default async function Footer() {
  const t = await getContent();
  const ct = contactOf(t);
  return (
    <footer className="mt-10 border-t-4 border-brand bg-alt">
      <div className="wrap grid gap-8 py-10 md:grid-cols-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="IntraMed Solution logo" className="mb-3 h-12 w-auto" loading="lazy" width="104" height="48" />
          <p className="text-sm text-muted">{t('site.tagline')}</p>
          {ct.social.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-3 text-sm">
              {ct.social.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">{name}</a>)}
            </p>
          )}
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          {CATEGORIES.map((c) => <Link key={c.slug} href={`/${c.slug}/`} className="text-muted hover:text-brand">{c.name} Devices</Link>)}
          <Link href="/about/" className="text-muted hover:text-brand">About us</Link>
          <Link href="/gallery/" className="text-muted hover:text-brand">Gallery</Link>
          <Link href="/contact/" className="text-muted hover:text-brand">Contact</Link>
        </nav>
        <address className="text-sm not-italic leading-7 text-muted">
          {ct.address}<br />
          <a href={`tel:${ct.tel || ct.phone}`} className="hover:text-brand">{ct.phone}</a><br />
          <a href={`mailto:${ct.email}`} className="hover:text-brand">{ct.email}</a>
          {ct.hours && <><br />{ct.hours}</>}
          {ct.maps && <><br /><a href={ct.maps} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">View on Google Maps</a></>}
        </address>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} INTRAMED SOLUTION. All Rights Reserved.</p>
    </footer>
  );
}
