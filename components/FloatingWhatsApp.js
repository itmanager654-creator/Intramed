'use client';
import { usePathname } from 'next/navigation';

export default function FloatingWhatsApp({ number, message }) {
  const path = usePathname();
  if (!number || path.startsWith('/admin')) return null;
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message || '')}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition hover:scale-110">
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M16.04 3C8.84 3 3 8.8 3 15.96c0 2.28.6 4.5 1.74 6.46L3 29l6.76-1.7a13.1 13.1 0 0 0 6.28 1.6c7.2 0 13.04-5.8 13.04-12.96C29.08 8.8 23.24 3 16.04 3Zm0 23.7c-1.96 0-3.88-.52-5.56-1.5l-.4-.24-4.02 1.02 1.08-3.9-.26-.4a10.5 10.5 0 0 1-1.62-5.62c0-5.82 4.78-10.56 10.66-10.56 5.86 0 10.64 4.74 10.64 10.56s-4.78 10.64-10.52 10.64Zm5.84-7.9c-.32-.16-1.9-.94-2.2-1.04-.3-.1-.5-.16-.72.16-.22.32-.84 1.04-1.02 1.26-.2.22-.38.24-.7.08-.32-.16-1.36-.5-2.58-1.6-.96-.84-1.6-1.9-1.8-2.2-.18-.32-.02-.5.14-.66.14-.14.32-.38.48-.56.16-.2.22-.32.32-.54.1-.22.06-.4-.02-.56-.08-.16-.72-1.72-.98-2.36-.26-.62-.52-.54-.72-.54h-.6c-.2 0-.56.08-.84.4-.3.32-1.12 1.1-1.12 2.66s1.14 3.08 1.3 3.3c.16.2 2.24 3.4 5.4 4.76.76.32 1.34.52 1.8.66.76.24 1.44.2 1.98.12.6-.1 1.9-.78 2.16-1.52.26-.74.26-1.38.18-1.52-.08-.14-.3-.22-.62-.38Z"/>
      </svg>
    </a>
  );
}
