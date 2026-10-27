'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function AdminContent({ flash }) {
  const [fields, setFields] = useState([]);
  const [vals, setVals] = useState({});
  const [orig, setOrig] = useState({});
  const [group, setGroup] = useState('Contact details');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/content/');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Could not load');
      setFields(j);
      const v = Object.fromEntries(j.map((f) => [f.k, f.v]));
      setVals(v); setOrig(v);
    } catch (e) { flash(e.message); }
  }, [flash]);
  useEffect(() => { load(); }, [load]);

  const groups = useMemo(() => [...new Set(fields.map((f) => f.g))], [fields]);
  const dirty = fields.filter((f) => vals[f.k] !== orig[f.k]);

  async function save() {
    setBusy(true);
    try {
      const values = Object.fromEntries(dirty.map((f) => [f.k, vals[f.k] === f.d ? '' : vals[f.k]]));
      const r = await fetch('/api/admin/content/', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ values }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Save failed');
      setOrig({ ...vals });
      flash(`Saved ${dirty.length} change${dirty.length === 1 ? '' : 's'} — live on the website now`);
    } catch (e) { flash(e.message); }
    setBusy(false);
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted">Change any heading, paragraph, contact detail or Google (SEO) title here. Changes go live immediately after Save. "Reset" brings back the original text.</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {groups.map((g) => (
          <button key={g} onClick={() => setGroup(g)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${group === g ? 'bg-brand text-white' : 'border border-line'}`}>
            {g}{fields.some((f) => f.g === g && vals[f.k] !== orig[f.k]) ? ' •' : ''}
          </button>
        ))}
      </div>
      <div className="card grid gap-4 p-5">
        {fields.filter((f) => f.g === group).map((f) => (
          <label key={f.k} className="grid gap-1 text-sm font-medium">
            <span className="flex items-center justify-between gap-3">{f.l}
              {vals[f.k] !== f.d && <button type="button" className="text-xs font-normal text-brand" onClick={() => setVals({ ...vals, [f.k]: f.d })}>Reset</button>}
            </span>
            {f.t === 'area'
              ? <textarea className="field" rows={f.k.endsWith('.items') ? 6 : 3} value={vals[f.k] ?? ''} onChange={(e) => setVals({ ...vals, [f.k]: e.target.value })} maxLength={3000} />
              : <input className="field" value={vals[f.k] ?? ''} onChange={(e) => setVals({ ...vals, [f.k]: e.target.value })} maxLength={600} />}
          </label>
        ))}
      </div>
      <div className="sticky bottom-3 mt-5 flex justify-end">
        <button onClick={save} disabled={busy || dirty.length === 0} className="btn btn-primary shadow-card disabled:opacity-50">{busy ? 'Saving…' : dirty.length ? `Save ${dirty.length} change${dirty.length === 1 ? '' : 's'}` : 'No changes'}</button>
      </div>
    </div>
  );
}
