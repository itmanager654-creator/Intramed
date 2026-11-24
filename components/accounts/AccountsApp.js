'use client';
import { useEffect, useState } from 'react';
import { words } from '@/lib/numWords';

const DOC = {
  office: 'Office # 05 Opposite Jamal-e-Mustafa Mosque Amir Town Road, Harbanspura, Lahore.',
  email: 'intramedsolution@gmail.com',
  contact: '0346-4711440, 0315-6564179',
};

const todayISO = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
const fmt = (n) => Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: 2 });
const dmy = (iso) => {
  if (!iso) return '';
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  return `${d}-${m}-${y.slice(2)}`;
};
const emptyItem = () => ({ qty: 1, description: '', specs: '', batch: '', exp_date: '', unit_price: '' });

async function api(path, opts = {}) {
  const r = await fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(j.error || `Error ${r.status}`);
    e.status = r.status;
    throw e;
  }
  return j;
}

export default function AccountsApp() {
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [installEvt, setInstallEvt] = useState(null);

  useEffect(() => {
    document.body.classList.add('app-mode');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/accounts/sw.js', { scope: '/accounts/' }).catch(() => {});
    }
    const onPrompt = (e) => { e.preventDefault(); setInstallEvt(e); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    api('/api/accounts/invoices').then(() => setAuthed(true)).catch(() => setAuthed(false));
    return () => {
      document.body.classList.remove('app-mode');
      window.removeEventListener('beforeinstallprompt', onPrompt);
    };
  }, []);

  async function install() {
    if (!installEvt) return;
    installEvt.prompt();
    await installEvt.userChoice;
    setInstallEvt(null);
  }
  async function logout() {
    await api('/api/accounts/logout', { method: 'POST' }).catch(() => {});
    setAuthed(false);
  }

  if (authed === null) return <div className="grid min-h-screen place-items-center text-muted">Loading…</div>;
  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  const tabs = [['dashboard', 'Dashboard'], ['new', 'New invoice'], ['list', 'Invoices']];
  return (
    <div className="min-h-screen bg-alt">
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="IntraMed Solution" className="h-9 w-auto" />
            <span className="font-heading text-lg font-bold">Accounts</span>
          </div>
          <div className="flex gap-2">
            {installEvt && <button onClick={install} className="btn btn-primary !py-2 text-sm">Install app</button>}
            <button onClick={logout} className="btn btn-outline !py-2 text-sm">Log out</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${tab === k ? 'border-brand bg-brand text-white' : 'border-line bg-surface'}`}>{l}</button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'new' && <NewInvoice />}
        {tab === 'list' && <InvoiceList />}
      </main>
    </div>
  );
}

function Login({ onOk }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await api('/api/accounts/login', { method: 'POST', body: JSON.stringify({ password: pw }) });
      onOk();
    } catch (x) {
      setErr(x.message);
    }
    setBusy(false);
  }
  return (
    <div className="grid min-h-screen place-items-center bg-alt p-4">
      <form onSubmit={go} className="card w-full max-w-sm space-y-4 p-6">
        <div className="text-center">
          <img src="/logo.png" alt="IntraMed Solution" className="mx-auto h-16 w-auto" />
          <h1 className="mt-3 text-xl font-bold">Accounts login</h1>
        </div>
        <input type="password" autoFocus className="field" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p className="text-sm text-red-700">{err}</p>}
        <button disabled={busy || !pw} className="btn btn-primary w-full disabled:opacity-60">{busy ? 'Checking…' : 'Log in'}</button>
        <p className="text-center text-xs text-muted">Is device par 30 din tak dobara password nahi maanga jayega.</p>
      </form>
    </div>
  );
}

function Dashboard() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api('/api/accounts/stats').then(setS).catch((e) => setErr(e.message)); }, []);
  if (err) return <p className="text-red-700">{err}</p>;
  if (!s) return <p className="text-muted">Loading…</p>;
  const max = Math.max(1, ...s.monthly.map((m) => m.total));
  const cards = [['Total sales', s.total], ['Received', s.paid], ['Outstanding', s.total - s.paid], ['This month', s.month.total]];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map(([l, v]) => (
          <div key={l} className="card p-4">
            <p className="text-xs text-muted">{l}</p>
            <p className="mt-1 text-xl font-bold">Rs. {fmt(v)}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-bold">Last 6 months</h2>
          <div className="flex h-48 items-end gap-3">
            {s.monthly.length === 0 && <p className="text-sm text-muted">Abhi koi sale nahi.</p>}
            {s.monthly.map((m) => (
              <div key={m.m} className="flex flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] text-muted">{fmt(m.total)}</span>
                <div className="w-full rounded-t-md bg-brand" style={{ height: `${(m.total / max) * 100}%` }} />
                <span className="text-[10px] text-muted">{m.m.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="mb-3 font-bold">Top customers</h2>
          {s.topCustomers.length === 0 && <p className="text-sm text-muted">Data nahi.</p>}
          <ul className="divide-y divide-line text-sm">
            {s.topCustomers.map((c) => <li key={c.name} className="flex justify-between py-2"><span>{c.name} <span className="text-muted">({c.n})</span></span><b>Rs. {fmt(c.total)}</b></li>)}
          </ul>
          <h2 className="mb-3 mt-6 font-bold">Top items</h2>
          <ul className="divide-y divide-line text-sm">
            {s.topItems.map((c) => <li key={c.name} className="flex justify-between py-2"><span>{c.name} <span className="text-muted">(qty {fmt(c.qty)})</span></span><b>Rs. {fmt(c.total)}</b></li>)}
          </ul>
        </div>
      </div>
      <p className="text-xs text-muted">iPhone par: Safari &gt; Share &gt; Add to Home Screen. Android/Chrome par: Install app button ya ⋮ &gt; Install app.</p>
    </div>
  );
}

function NewInvoice() {
  const [h, setH] = useState({ invoice_date: todayISO(), customer_name: '', age: '', hospital: '', city: 'Lahore', payment_mode: 'Cash', paid: '', tax_pct: '0', notes: '' });
  const [items, setItems] = useState([emptyItem()]);
  const [products, setProducts] = useState([]);
  const [nextNo, setNextNo] = useState('');
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/api/accounts/products').then((r) => setProducts(r.names || [])).catch(() => {});
    api('/api/accounts/invoices').then((r) => setNextNo(r.nextNo)).catch(() => {});
  }, []);

  const set = (k) => (e) => setH({ ...h, [k]: e.target.value });
  const setItem = (i, k, v) => setItems(items.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const rows = items
    .filter((x) => x.description.trim())
    .map((x) => {
      const qty = Number(x.qty) || 0;
      const unit = Number(x.unit_price) || 0;
      return { ...x, qty, unit_price: unit, amount: qty * unit };
    });
  const subtotal = rows.reduce((a, r) => a + r.amount, 0);
  const tax = Math.round(subtotal * (Number(h.tax_pct) || 0)) / 100;
  const total = subtotal + tax;
  const paid = Number(h.paid) || 0;

  const doc = () => ({
    invoice_no: saved?.invoice_no || nextNo,
    invoice_date: h.invoice_date, customer_name: h.customer_name, age: h.age, hospital: h.hospital, city: h.city,
    items: rows, subtotal, tax_amount: tax, total, paid, notes: h.notes,
  });

  async function save() {
    setErr('');
    if (!h.customer_name.trim()) return setErr('Customer ka naam likhein.');
    if (!rows.length) return setErr('Kam az kam ek item likhein.');
    setBusy(true);
    try {
      const r = await api('/api/accounts/invoices', { method: 'POST', body: JSON.stringify({ ...h, items: rows }) });
      setSaved(r);
      setNextNo('');
      setPreview({ ...doc(), invoice_no: r.invoice_no });
      api('/api/accounts/invoices').then((x) => setNextNo(x.nextNo)).catch(() => {});
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  }

  function newOne() {
    setSaved(null);
    setPreview(null);
    setItems([emptyItem()]);
    setH({ ...h, customer_name: '', age: '', hospital: '', paid: '', notes: '' });
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {saved
            ? <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Saved ✓ Invoice {saved.invoice_no}</span>
            : <span className="text-sm text-muted">Preview (abhi save nahi hua)</span>}
          <button className="btn btn-primary !py-2" onClick={() => window.print()}>Print / Save as PDF</button>
          {!saved && <button className="btn btn-outline !py-2" onClick={() => setPreview(null)}>Wapas edit</button>}
          {saved && <button className="btn btn-outline !py-2" onClick={newOne}>Naya invoice</button>}
        </div>
        <InvoiceView inv={preview} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card grid gap-4 p-5 md:grid-cols-3">
        <label className="text-xs font-medium">Date<input type="date" className="field mt-1" value={h.invoice_date} onChange={set('invoice_date')} /></label>
        <label className="text-xs font-medium md:col-span-2">Customer name *<input className="field mt-1" placeholder="e.g. Balqees Bibi w/o Rasheed Ahmad" value={h.customer_name} onChange={set('customer_name')} /></label>
        <label className="text-xs font-medium">Age<input className="field mt-1" placeholder="e.g. 66" value={h.age} onChange={set('age')} /></label>
        <label className="text-xs font-medium md:col-span-2">Hospital / clinic<input className="field mt-1" placeholder="e.g. Fauji Foundation Hospital" value={h.hospital} onChange={set('hospital')} /></label>
        <label className="text-xs font-medium">City<input className="field mt-1" value={h.city} onChange={set('city')} /></label>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Items</h2>
          <button className="btn btn-outline !py-2 text-sm" onClick={() => setItems([...items, emptyItem()])}>+ Item add karein</button>
        </div>
        <datalist id="acc-products">{products.map((n) => <option key={n} value={n} />)}</datalist>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-line p-3 md:grid-cols-12">
              <input type="number" min="1" className="field md:col-span-1" placeholder="Qty" value={it.qty} onChange={(e) => setItem(i, 'qty', e.target.value)} />
              <input list="acc-products" className="field md:col-span-3" placeholder="Item description" value={it.description} onChange={(e) => setItem(i, 'description', e.target.value)} />
              <input className="field md:col-span-2" placeholder="Specs (e.g. 18 FR)" value={it.specs} onChange={(e) => setItem(i, 'specs', e.target.value)} />
              <input className="field md:col-span-2" placeholder="Batch no" value={it.batch} onChange={(e) => setItem(i, 'batch', e.target.value)} />
              <input className="field md:col-span-1" placeholder="Exp (9-2028)" value={it.exp_date} onChange={(e) => setItem(i, 'exp_date', e.target.value)} />
              <input type="number" className="field md:col-span-1" placeholder="Unit price" value={it.unit_price} onChange={(e) => setItem(i, 'unit_price', e.target.value)} />
              <div className="flex items-center justify-between gap-2 md:col-span-2">
                <span className="text-sm font-semibold">Rs. {fmt((Number(it.qty) || 0) * (Number(it.unit_price) || 0))}</span>
                {items.length > 1 && <button className="text-sm text-muted hover:text-brand" onClick={() => setItems(items.filter((_, j) => j !== i))}>Remove</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-3 p-5">
          <label className="text-xs font-medium">Payment mode
            <select className="field mt-1" value={h.payment_mode} onChange={set('payment_mode')}>
              {['Cash', 'Bank transfer', 'Cheque', 'Credit'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium">Amount received (Rs.)<input type="number" className="field mt-1" placeholder="Khali ya 0 = unpaid" value={h.paid} onChange={set('paid')} /></label>
          <label className="text-xs font-medium">Sales tax %<input type="number" className="field mt-1" value={h.tax_pct} onChange={set('tax_pct')} /></label>
          <label className="text-xs font-medium">Notes (optional)<input className="field mt-1" value={h.notes} onChange={set('notes')} /></label>
        </div>
        <div className="card space-y-2 p-5 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><b>Rs. {fmt(subtotal)}</b></div>
          {tax > 0 && <div className="flex justify-between"><span>Tax</span><b>Rs. {fmt(tax)}</b></div>}
          <div className="flex justify-between text-lg"><span className="font-bold">Total</span><b>Rs. {fmt(total)}</b></div>
          <div className="flex justify-between"><span>Balance due</span><b>Rs. {fmt(Math.max(0, total - paid))}</b></div>
          {total > 0 && <p className="pt-2 text-xs italic text-muted">({words(total)})</p>}
        </div>
      </div>

      {err && <p className="text-sm text-red-700">{err}</p>}
      <div className="flex flex-wrap gap-3">
        <button disabled={busy} onClick={save} className="btn btn-primary disabled:opacity-60">{busy ? 'Saving…' : 'Invoice save karein'}</button>
        <button className="btn btn-outline" onClick={() => setPreview(doc())}>Preview & print</button>
      </div>
    </div>
  );
}

function InvoiceList() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [open, setOpen] = useState(null);
  const [err, setErr] = useState('');

  const load = () => api('/api/accounts/invoices').then((r) => setList(r.invoices)).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const shown = list.filter((i) =>
    (!q || `${i.invoice_no} ${i.customer_name} ${i.hospital}`.toLowerCase().includes(q.toLowerCase())) &&
    (!from || i.invoice_date >= from) && (!to || i.invoice_date <= to));

  async function view(id) {
    const r = await api(`/api/accounts/invoices/${id}`);
    setOpen(r.invoice);
  }
  async function del(id, no) {
    if (!window.confirm(`Invoice ${no} delete karein? Ye wapas nahi hoga.`)) return;
    await api(`/api/accounts/invoices/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="card grid gap-3 p-4 md:grid-cols-4">
        <input className="field md:col-span-2" placeholder="Search: invoice no, customer, hospital" value={q} onChange={(e) => setQ(e.target.value)} />
        <input type="date" className="field" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" className="field" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{shown.length} invoices · Total Rs. {fmt(shown.reduce((a, i) => a + i.total, 0))}</p>
        <a href={`/api/accounts/export?from=${from}&to=${to}`} className="btn btn-outline !py-2 text-sm">Export CSV (Excel)</a>
      </div>
      {err && <p className="text-red-700">{err}</p>}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-tint text-left">
            <tr><th className="p-3">Invoice</th><th className="p-3">Date</th><th className="p-3">Customer</th><th className="p-3">Hospital</th><th className="p-3 text-right">Total</th><th className="p-3 text-right">Received</th><th className="p-3">Status</th><th className="p-3" /></tr>
          </thead>
          <tbody>
            {shown.map((i) => (
              <tr key={i.id} className="border-t border-line">
                <td className="p-3 font-semibold">{i.invoice_no}</td>
                <td className="p-3">{dmy(i.invoice_date)}</td>
                <td className="p-3">{i.customer_name}</td>
                <td className="p-3 text-muted">{i.hospital}</td>
                <td className="p-3 text-right">{fmt(i.total)}</td>
                <td className="p-3 text-right">{fmt(i.paid)}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${i.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : i.status === 'Partial' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{i.status}</span>
                </td>
                <td className="whitespace-nowrap p-3">
                  <button className="text-brand hover:underline" onClick={() => view(i.id)}>View / Print</button>
                  {' · '}
                  <button className="text-muted hover:text-brand" onClick={() => del(i.id, i.invoice_no)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="p-6 text-center text-sm text-muted">Abhi koi invoice nahi.</p>}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4">
          <div className="mx-auto max-w-4xl space-y-3">
            <div className="flex justify-end gap-2">
              <button className="btn btn-primary !py-2" onClick={() => window.print()}>Print / Save as PDF</button>
              <button className="btn btn-outline !py-2" onClick={() => setOpen(null)}>Band karein</button>
            </div>
            <InvoiceView inv={open} />
          </div>
        </div>
      )}
    </div>
  );
}

// The printable invoice. Layout follows the paper invoice (no stamp; signature line only).
function InvoiceView({ inv }) {
  const items = inv.items || [];
  const heads = ['QTY', 'ITEM DESCRIPTION', 'SPECS', 'BATCH NO', 'EXP DATE', 'UNIT PRICE', 'NET AMOUNT'];
  const cell = 'border border-black p-2';
  return (
    <div id="invoice-print" className="mx-auto w-full max-w-[210mm] bg-white p-8 text-[13px] text-black shadow-card">
      <img src="/logo.png" alt="IntraMed Solution" className="h-16 w-auto" />
      <h1 className="mt-6 text-3xl font-normal">INVOICE</h1>
      <div className="mt-4 grid grid-cols-[90px_1fr] gap-y-1">
        <span>Date:</span><span>{dmy(inv.invoice_date)}</span>
        <span>Invoice #</span><span>{inv.invoice_no}</span>
      </div>
      <p className="mt-6 font-bold underline">CUSTOMER:</p>
      <div className="mt-1 leading-relaxed">
        <div>{inv.customer_name}{inv.age ? ` Age: ${inv.age}y` : ''}</div>
        {inv.hospital && <div>{inv.hospital}</div>}
        {inv.city && <div>{inv.city}</div>}
      </div>
      <table className="mt-6 w-full border-collapse text-[12px]">
        <thead>
          <tr className="bg-[#a9c4e6]">{heads.map((h) => <th key={h} className={`${cell} text-center font-bold`}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className={`${cell} text-center`}>{it.qty}</td>
              <td className={cell}>{it.description}</td>
              <td className={`${cell} text-center`}>{it.specs}</td>
              <td className={`${cell} text-center`}>{it.batch}</td>
              <td className={`${cell} text-center`}>{it.exp_date}</td>
              <td className={`${cell} text-right`}>{fmt(it.unit_price)}</td>
              <td className={`${cell} text-right`}>{fmt(it.amount ?? it.qty * it.unit_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-y-1 text-right">
        {inv.tax_amount > 0 && <div>Subtotal: {fmt(inv.subtotal)} · Tax: {fmt(inv.tax_amount)}</div>}
        <div className="text-base font-bold">{fmt(inv.total)}</div>
        {inv.paid > 0 && <div>Received: {fmt(inv.paid)} · Balance: {fmt(Math.max(0, inv.total - inv.paid))}</div>}
      </div>
      <p className="mt-4 font-serif">({words(inv.total)})</p>
      {inv.notes && <p className="mt-3 text-[12px]">Note: {inv.notes}</p>}
      <p className="mt-8 font-serif text-[12px]">For. INTRAMED SOLUTION</p>
      <div className="mt-14 w-56 border-t border-black pt-1 text-[12px]">Authorized signature</div>
      <div className="mt-16 text-center text-[12px] font-bold text-[#b3151b]">
        <p>{DOC.office}</p>
        <p>E-mail: {DOC.email} Contact: {DOC.contact}</p>
      </div>
    </div>
  );
}
