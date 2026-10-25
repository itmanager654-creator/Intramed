'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '@/lib/categories';
import AdminHome from '@/components/AdminHome';

const api = async (res, method = 'GET', body, qs = '') => {
  const r = await fetch(`/api/admin/${res}/${qs}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Request failed');
  return j;
};

async function upload(file) {
  const fd = new FormData(); fd.append('file', file);
  const r = await fetch('/api/admin/upload/', { method: 'POST', body: fd });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Upload failed');
  return j.url;
}

const EMPTY = { id: 0, category: 'Cardiology', name: '', spec: '', description: '', image_url: '', sort: 0 };

export default function AdminPanel() {
  const [tab, setTab] = useState('inquiries');
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [gal, setGal] = useState({ category: 'Cardiology', caption: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [canNotify, setCanNotify] = useState(false);
  const seen = useRef(null);

  const loadAll = useCallback(async () => {
    try {
      const [p, g, i] = await Promise.all([api('products'), api('gallery'), api('inquiries')]);
      setProducts(p); setGallery(g); setInquiries(i);
    } catch (e) { setMsg(e.message); }
  }, []);
  useEffect(() => { loadAll(); setCanNotify('Notification' in window); }, [loadAll]);

  // Check for new inquiries every 30s while the dashboard is open
  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const list = await api('inquiries');
        setInquiries(list);
        const top = list[0]?.id || 0;
        if (seen.current !== null && top > seen.current && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('New inquiry', { body: `${list[0].name} — ${list[0].product || list[0].message.slice(0, 60)}` });
        }
        seen.current = top;
      } catch {}
    }, 30000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (seen.current === null && inquiries.length) seen.current = inquiries[0].id; }, [inquiries]);

  const flash = useCallback((m) => { setMsg(m); setTimeout(() => setMsg(''), 4000); }, []);
  const newCount = inquiries.filter((i) => i.status === 'new').length;

  async function saveProduct(e) {
    e.preventDefault(); setBusy(true);
    try {
      await api('products', form.id ? 'PUT' : 'POST', form);
      setForm(EMPTY); await loadAll(); flash('Product saved');
    } catch (err) { flash(err.message); }
    setBusy(false);
  }
  async function pickImage(e, set) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    try { set(await upload(f)); } catch (err) { flash(err.message); }
    setBusy(false);
  }
  async function addGallery(e) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    try { const url = await upload(f); await api('gallery', 'POST', { url, ...gal }); setGal({ ...gal, caption: '' }); await loadAll(); flash('Photo added'); }
    catch (err) { flash(err.message); }
    setBusy(false); e.target.value = '';
  }
  const del = async (res, id) => { if (!confirm('Delete this item?')) return; try { await api(res, 'DELETE', null, `?id=${id}`); await loadAll(); } catch (e) { flash(e.message); } };
  const setStatus = async (id, status) => { await api('inquiries', 'PATCH', { id, status }); await loadAll(); };
  const logout = async () => { await fetch('/api/admin/logout/', { method: 'POST' }); window.location.reload(); };

  const tabBtn = (id, label) => <button onClick={() => setTab(id)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === id ? 'bg-brand text-white' : 'border border-line'}`}>{label}</button>;

  return (
    <div className="wrap section">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <div className="flex gap-2">
          {canNotify && <button className="btn btn-outline !py-2" onClick={() => Notification.requestPermission().then((p) => flash(p === 'granted' ? 'Browser alerts on' : 'Alerts blocked'))}>Enable browser alerts</button>}
          <button className="btn btn-outline !py-2" onClick={logout}>Log out</button>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">{tabBtn('inquiries', `Inquiries${newCount ? ` (${newCount} new)` : ''}`)}{tabBtn('products', `Products (${products.length})`)}{tabBtn('gallery', `Gallery (${gallery.length})`)}{tabBtn('home', 'Homepage')}</div>
      {msg && <p role="status" className="mb-4 rounded-lg bg-tint px-4 py-2 text-sm font-medium text-brand">{msg}</p>}

      {tab === 'inquiries' && (
        <div className="grid gap-3">
          {inquiries.length === 0 && <p className="text-muted">No inquiries yet.</p>}
          {inquiries.map((i) => (
            <div key={i.id} className={`card p-4 ${i.status === 'new' ? 'border-brand' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{i.name} <span className="text-sm font-normal text-muted">· {new Date(i.created_at).toLocaleString()}</span></p>
                <span className="rounded-full bg-tint px-3 py-0.5 text-xs font-semibold text-brand">{i.status}</span>
              </div>
              {i.product && <p className="text-sm text-muted">Product: {i.product}</p>}
              <p className="mt-2 whitespace-pre-line text-sm">{i.message}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <a className="btn btn-primary !px-4 !py-1.5" href={`tel:${i.phone}`}>Call {i.phone}</a>
                <a className="btn btn-outline !px-4 !py-1.5" href={`https://wa.me/${i.phone.replace(/\D/g, '').replace(/^0/, '92')}`}>WhatsApp</a>
                {i.email && <a className="btn btn-outline !px-4 !py-1.5" href={`mailto:${i.email}`}>Email</a>}
                <button className="btn btn-outline !px-4 !py-1.5" onClick={() => setStatus(i.id, i.status === 'new' ? 'done' : 'new')}>{i.status === 'new' ? 'Mark done' : 'Mark new'}</button>
                <button className="btn btn-outline !px-4 !py-1.5" onClick={() => del('inquiries', i.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <form onSubmit={saveProduct} className="card grid h-fit gap-3 p-5">
            <h2 className="font-bold">{form.id ? 'Edit product' : 'Add product'}</h2>
            <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}</select>
            <input className="field" required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="field" placeholder="Specification (e.g. 6F, 100 cm)" value={form.spec} onChange={(e) => setForm({ ...form, spec: e.target.value })} />
            <textarea className="field" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="field" type="number" placeholder="Sort order" value={form.sort} onChange={(e) => setForm({ ...form, sort: e.target.value })} />
            <label className="text-sm font-medium">Photo<input type="file" accept="image/*" className="field mt-1" onChange={(e) => pickImage(e, (url) => setForm((f) => ({ ...f, image_url: url })))} /></label>
            {form.image_url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={form.image_url} alt="" className="h-24 w-24 rounded-lg border border-line object-cover" />}
            <div className="flex gap-2"><button disabled={busy} className="btn btn-primary flex-1 disabled:opacity-60">{busy ? 'Please wait…' : 'Save product'}</button>{form.id ? <button type="button" className="btn btn-outline" onClick={() => setForm(EMPTY)}>Cancel</button> : null}</div>
          </form>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-surface2 text-muted"><tr><th className="p-3">Photo</th><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3"></th></tr></thead>
              <tbody>{products.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="p-3">{p.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt="" className="h-12 w-12 rounded object-cover" /> : '—'}</td>
                  <td className="p-3 font-medium">{p.name}</td><td className="p-3 text-muted">{p.category}</td>
                  <td className="whitespace-nowrap p-3 text-right"><button className="mr-3 text-brand" onClick={() => { setForm({ ...p, sort: p.sort ?? 0 }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button><button className="text-muted" onClick={() => del('products', p.id)}>Delete</button></td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'home' && <AdminHome flash={flash} />}

      {tab === 'gallery' && (
        <div>
          <div className="card mb-6 grid gap-3 p-5 sm:grid-cols-3">
            <select className="field" value={gal.category} onChange={(e) => setGal({ ...gal, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}</select>
            <input className="field" placeholder="Caption (optional)" value={gal.caption} onChange={(e) => setGal({ ...gal, caption: e.target.value })} />
            <input type="file" accept="image/*" className="field" disabled={busy} onChange={addGallery} />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((g) => (
              <div key={g.id} className="card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url} alt={g.caption || ''} className="aspect-square w-full object-cover" />
                <div className="flex items-center justify-between p-2 text-xs text-muted"><span>{g.category}</span><button onClick={() => del('gallery', g.id)} className="text-brand">Delete</button></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
