'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const LINKS = [
  ['/', 'Home'],
  ['/gastroenterology-devices/', 'Gastroenterology'],
  ['/cardiology-devices/', 'Cardiology'],
  ['/urology-devices/', 'Urology'],
  ['/vascular-devices/', 'Vascular'],
  ['/about/', 'About'],
  ['/gallery/', 'Gallery'],
  ['/contact/', 'Contact'],
];

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href) => (href === '/' ? path === '/' : path.startsWith(href));

  function toggleTheme() {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="IntraMed Solution home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="IntraMed Solution logo" className="h-10 w-auto" />
        </Link>
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className={`rounded-lg px-2.5 py-2 text-sm font-medium transition ${active(href) ? 'bg-tint text-brand' : 'text-muted hover:text-ink'}`}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="grid h-10 w-10 place-items-center rounded-lg border border-line text-lg">◐</button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-lg border border-line text-lg xl:hidden">{open ? '✕' : '☰'}</button>
        </div>
      </div>
      {open && (
        <nav className="wrap flex flex-col gap-1 pb-4 xl:hidden" aria-label="Mobile">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-2.5 text-sm font-medium ${active(href) ? 'bg-tint text-brand' : 'text-ink'}`}>{label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
