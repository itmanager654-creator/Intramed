'use client';
import { useCallback, useEffect, useState } from 'react';

function b64ToUint8(b64) {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function AdminNotify({ flash }) {
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);

  const load = useCallback(async () => {
    try { const r = await fetch('/api/admin/push/'); if (r.ok) setInfo(await r.json()); } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  async function enable() {
    setBusy(true);
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) throw new Error('This browser does not support push notifications. Use Chrome on Android or desktop.');
      if (!info?.publicKey) throw new Error('VAPID keys are missing on the server. Add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in Vercel and redeploy.');
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') throw new Error('Notifications are blocked. Allow them in the browser/site settings, then try again.');
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const old = await reg.pushManager.getSubscription();
      if (old) await old.unsubscribe();
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToUint8(info.publicKey) });
      const r = await fetch('/api/admin/push/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub.toJSON()) });
      if (!r.ok) throw new Error('Could not save this device');
      flash('Phone notifications enabled on this device');
      await load();
    } catch (e) { flash(e.message); }
    setBusy(false);
  }

  async function test() {
    setBusy(true); setReport(null);
    try {
      const r = await fetch('/api/admin/test-notify/', { method: 'POST' });
      const j = await r.json();
      setReport(j.results || []);
    } catch (e) { flash(e.message); }
    setBusy(false);
  }

  const dot = (ok) => <span className={ok ? 'text-green-600' : 'text-muted'}>{ok ? '●' : '○'}</span>;
  return (
    <div className="card mb-6 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-bold">Inquiry notifications</h2>
        {info && <span className="text-xs text-muted">{dot(info.telegram)} Telegram &nbsp; {dot(info.push)} Phone push ({info.subscribers} device{info.subscribers === 1 ? '' : 's'}) &nbsp; {dot(info.email)} Email</span>}
        <div className="ml-auto flex gap-2">
          <button disabled={busy} onClick={enable} className="btn btn-primary !px-4 !py-2 disabled:opacity-60">Enable phone notifications</button>
          <button disabled={busy} onClick={test} className="btn btn-outline !px-4 !py-2 disabled:opacity-60">Send test</button>
        </div>
      </div>
      {report && (
        <ul className="mt-3 grid gap-1 text-sm">
          {report.map((r) => (
            <li key={r.channel}><b className="capitalize">{r.channel}</b>: {r.ok ? <span className="text-green-600">sent</span> : <span className="text-brand">{r.error}</span>}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
