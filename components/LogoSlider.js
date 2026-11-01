'use client';
import { useEffect, useRef, useState } from 'react';

// Logo carousel: moves to the next set every 8 seconds, with arrows, dots and swipe. Pauses on hover/touch.
export default function LogoSlider({ items, variant = 'client', interval = 8000 }) {
  const [per, setPer] = useState(2);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(null);

  useEffect(() => {
    const calc = () => setPer(window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 3 : 2);
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const pages = Math.max(1, Math.ceil(items.length / per));
  const safe = Math.min(page, pages - 1);
  const go = (n) => setPage(((n % pages) + pages) % pages);

  useEffect(() => {
    if (pages < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => setPage((p) => (Math.min(p, pages - 1) + 1) % pages), interval);
    return () => clearTimeout(id);
  }, [safe, pages, paused, interval]);

  const chunks = Array.from({ length: pages }, (_, i) => items.slice(i * per, i * per + per));
  const arrow = 'absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-card transition hover:border-brand hover:bg-brand hover:text-white';

  return (
    <div
      className="relative px-12 md:px-16"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onTouchStart={(e) => { startX.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (startX.current ?? 0);
        if (Math.abs(dx) > 40) go(safe + (dx < 0 ? 1 : -1));
        startX.current = null; setPaused(false);
      }}
      role="region" aria-roledescription="carousel" aria-label={variant === 'vendor' ? 'Our vendors' : 'Our clients'}
    >
      {pages > 1 && (
        <>
          <button type="button" aria-label="Previous" className={`${arrow} left-0`} onClick={() => go(safe - 1)}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" aria-label="Next" className={`${arrow} right-0`} onClick={() => go(safe + 1)}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}

      <div className="-my-4 overflow-hidden py-4">
        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${safe * 100}%)` }}>
          {chunks.map((group, gi) => (
            <ul key={gi} className="grid w-full shrink-0 gap-4 px-1" style={{ gridTemplateColumns: `repeat(${per}, minmax(0, 1fr))` }} aria-hidden={gi !== safe ? 'true' : undefined}>
              {group.map((it) => (
                <li key={it.id} className="card group flex min-h-[150px] flex-col items-center justify-center gap-2 p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl">
                  <div className="grid h-20 w-full place-items-center">
                    {it.logo
                      ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={it.logo} alt={`${it.name} logo`} loading="lazy" className="max-h-20 w-auto max-w-full object-contain transition duration-300 group-hover:scale-105" />
                      : <span className="grid h-16 w-16 place-items-center rounded-full bg-tint font-heading text-2xl font-bold text-brand">{it.name.slice(0, 1)}</span>}
                  </div>
                  <p className="text-sm font-semibold">{it.name}</p>
                  {variant === 'vendor' && it.desc && <p className="text-xs text-muted">{it.desc}</p>}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {chunks.map((_, i) => (
            <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => go(i)} className={`h-2 rounded-full transition-all duration-300 ${i === safe ? 'w-8 bg-brand' : 'w-2 bg-line hover:bg-brand/50'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
