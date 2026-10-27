'use client';
import { useState } from 'react';

export default function InquiryForm({ product = '', compact = false, phone = '' }) {
  const [state, setState] = useState({ status: 'idle', error: '' });

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget; // keep a reference: currentTarget is null after an await
    setState({ status: 'sending', error: '' });
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/inquiries/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || 'Something went wrong');
      form.reset();
      setState({ status: 'sent', error: '' });
    } catch (err) {
      setState({ status: 'error', error: err.message });
    }
  }

  if (state.status === 'sent') {
    return (
      <div className="card p-6 text-center" role="status">
        <h3 className="text-lg font-semibold">Inquiry sent</h3>
        <p className="mt-1 text-sm text-muted">Our team will contact you shortly.{phone ? ` For urgent orders call ${phone}.` : ''}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-3 p-5 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">Name<input name="name" required maxLength={100} className="field" autoComplete="name" /></label>
        <label className="grid gap-1 text-sm font-medium">Phone / WhatsApp<input name="phone" required maxLength={30} inputMode="tel" className="field" autoComplete="tel" /></label>
      </div>
      {!compact && <label className="grid gap-1 text-sm font-medium">Email (optional)<input name="email" type="email" maxLength={120} className="field" autoComplete="email" /></label>}
      <label className="grid gap-1 text-sm font-medium">Product<input name="product" defaultValue={product} maxLength={150} className="field" placeholder="Which product do you need?" /></label>
      <label className="grid gap-1 text-sm font-medium">Message<textarea name="message" required rows={compact ? 3 : 4} maxLength={2000} className="field" placeholder="Quantity, hospital / city, any specification…" /></label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {state.status === 'error' && <p role="alert" className="text-sm font-medium text-brand">{state.error}</p>}
      <button disabled={state.status === 'sending'} className="btn btn-primary disabled:opacity-60">{state.status === 'sending' ? 'Sending…' : 'Send inquiry'}</button>
    </form>
  );
}
