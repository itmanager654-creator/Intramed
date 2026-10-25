'use client';
import { useCallback, useEffect, useState } from 'react';

const KINDS = {
  featured: { label: 'Featured products', fields: [['title', 'Title'], ['tag', 'Tag (e.g. Cardiology)'], ['description', 'Description']], img: 'image_url', name: 'title' },
  partners: { label: 'Partners', fields: [['name', 'Name'], ['description', 'Short description']], img: 'logo_url', name: 'name' },
  clients: { label: 'Clients', fields: [['label', 'Client name']], img: 'logo_url', name: 'label' },
};

async function call(res, method = 'GET', body, qs = '') {
  const r = await fetch(`/api/admin/${res}/${qs}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Request failed');
  return j;
}

function Section({ kind, flash }) {
  const cfg = KINDS[kind];
  const [rows, setRows] = useState([]);
  const [vals, setVals] = useState({});
  const [img, setImg] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { try { setRows(await call(kind)); } catch (e) { flash(e.message); } }, [kind, flash]);
  useEffect(() => { load(); }, [load]);

  async function pick(e) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    try {
      const fd = new FormData(); fd.append('file', f);
      const r = await fetch('/api/admin/upload/', { method: 'POST', body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Upload failed');
      setImg(j.url);
    } catch (err) { flash(err.message); }
    setBusy(false);
  }
  async function add(e) {
    e.preventDefault(); setBusy(true);
    try { await call(kind, 'POST', { ...vals, [cfg.img]: img, sort: rows.length }); setVals({}); setImg(''); e.target.reset(); await load(); flash('Saved'); }
    catch (err) { flash(err.message); }
    setBusy(false);
  }
  async function del(id) { if (!confirm('Delete this item?')) return; try { await call(kind, 'DELETE', null, `?id=${id}`); await load(); } catch (e) { flash(e.message); } }

  return (
    <div className="card p-5">
      <h2 className="mb-3 font-bold">{cfg.label} ({rows.length})</h2>
      <form onSubmit={add} className="mb-4 grid gap-2 sm:grid-cols-2">
        {cfg.fields.map(([k, label], i) => (
          <input key={k} className={`field ${i === 0 ? '' : ''}`} required={i === 0} placeholder={label} value={vals[k] || ''} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
        ))}
        <input type="file" accept="image/*" className="field" onChange={pick} />
        <button disabled={busy} className="btn btn-primary !py-2 disabled:opacity-60">{busy ? 'Please wait…' : 'Add'}</button>
      </form>
      <ul className="grid gap-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-3 rounded-lg border border-line p-2 text-sm">
            {r[cfg.img] ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={r[cfg.img]} alt="" className="h-10 w-10 rounded object-cover" /> : <span className="grid h-10 w-10 place-items-center rounded bg-surface2 text-xs text-muted">—</span>}
            <span className="flex-1 font-medium">{r[cfg.name]}</span>
            <button className="text-muted hover:text-brand" onClick={() => del(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminHome({ flash }) {
  return <div className="grid gap-6 lg:grid-cols-3">{Object.keys(KINDS).map((k) => <Section key={k} kind={k} flash={flash} />)}</div>;
}
