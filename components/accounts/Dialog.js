'use client';
import { useEffect, useState } from 'react';

export default function Dialog() {
  const [req, setReq] = useState(null);
  useEffect(() => {
    const on = (e) => setReq(e.detail);
    window.addEventListener('acc-ask', on);
    return () => window.removeEventListener('acc-ask', on);
  }, []);
  useEffect(() => {
    if (!req) return;
    const key = (e) => { if (e.key === 'Escape') close(false); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [req]);
  if (!req) return null;
  const close = (v) => { req.resolve(v); setReq(null); };
  return (
    <div className="acc-backdrop fixed inset-0 z-[100] grid place-items-center p-4" onClick={() => close(false)}>
      <div role="dialog" aria-modal="true" className="acc-card acc-pop w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${req.danger ? 'bg-red-50 text-red-700' : 'bg-tint text-brand'}`}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="9" /></svg>
        </div>
        <h3 className="text-lg font-extrabold">{req.title}</h3>
        {req.message && <p className="mt-1 text-sm text-muted">{req.message}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-outline" onClick={() => close(false)}>Cancel</button>
          <button className={`btn ${req.danger ? 'bg-red-700 text-white' : 'btn-primary'}`} onClick={() => close(true)}>{req.confirmText}</button>
        </div>
      </div>
    </div>
  );
}
