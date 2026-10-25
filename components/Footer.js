import Link from 'next/link';
import { SITE } from '@/lib/site';
import { CATEGORIES } from '@/lib/categories';

export default function Footer() {
  return (
    <footer className="mt-10 border-t-4 border-brand bg-alt">
      <div className="wrap grid gap-8 py-10 md:grid-cols-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="IntraMed Solution logo" className="mb-3 h-10 w-auto" loading="lazy" />
          <p className="text-sm text-muted">Medical devices supplier and distributor in Pakistan, based in Lahore.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          {CATEGORIES.map((c) => <Link key={c.slug} href={`/${c.slug}/`} className="text-muted hover:text-brand">{c.name} Devices</Link>)}
          <Link href="/gallery/" className="text-muted hover:text-brand">Gallery</Link>
          <Link href="/contact/" className="text-muted hover:text-brand">Contact</Link>
        </nav>
        <address className="text-sm not-italic leading-7 text-muted">
          Lahore, Punjab, Pakistan<br />
          <a href={`tel:${SITE.tel}`} className="hover:text-brand">{SITE.phone}</a><br />
          <a href={`mailto:${SITE.email}`} className="hover:text-brand">{SITE.email}</a>
        </address>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} INTRAMED SOLUTION. All Rights Reserved.</p>
    </footer>
  );
}
