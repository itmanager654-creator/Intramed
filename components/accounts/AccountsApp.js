'use client';
import { useEffect, useMemo, useState } from 'react';
import { words } from '@/lib/numWords';

const DOC = {
  office: 'Office # 05 Opposite Jamal-e-Mustafa Mosque Amir Town Road, Harbanspura, Lahore.',
  email: 'intramedsolution@gmail.com',
  contact: '0346-4711440, 0315-6564179',
};
const TABS = [['dashboard', 'Dashboard'], ['new', 'New invoice'], ['list', 'Invoices'], ['stock', 'Stock'], ['pnl', 'Profit & Loss']];

const todayISO = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
const fmt = (n) => Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: 2 });
const dmy = (iso) => {
  if (!iso) return '';
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  return `${d}-${m}-${y.slice(2)}`;
};
const emptyItem = () => ({ qty: 1, description: '', specs: '', batch: '', exp_date: '', unit_price: '' });
const daysSince = (iso) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) : Infinity);

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
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/accounts/sw.js', { scope: '/accounts/' }).catch(() => {});
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

  return (
    <div className="acc min-h-screen">
      <header className="acc-header sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="IntraMed Solution" className="h-9 w-auto" />
            <div><span className="block font-heading text-lg font-extrabold leading-tight">Accounts</span><span className="block text-[11px] text-muted">IntraMed Solution · Lahore</span></div>
          </div>
          <div className="flex gap-2">
            {installEvt && <button onClick={install} className="btn btn-primary !py-2 text-sm">Install app</button>}
            <button onClick={logout} className="btn btn-outline !py-2 text-sm">Log out</button>
          </div>
        </div>
        <nav className="acc-tabs mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`acc-tab whitespace-nowrap ${tab === k ? 'is-active' : ''}`}>{l}</button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {tab === 'dashboard' && <Dashboard go={setTab} />}
        {tab === 'new' && <NewInvoice />}
        {tab === 'list' && <InvoiceList />}
        {tab === 'stock' && <StockTab />}
        {tab === 'pnl' && <ProfitLoss />}
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
    <div className="acc acc-login grid min-h-screen place-items-center p-4">
      <form onSubmit={go} className="acc-card w-full max-w-sm space-y-4 p-7">
        <div className="text-center">
          <img src="/logo.png" alt="IntraMed Solution" className="mx-auto h-16 w-auto" />
          <h1 className="mt-3 text-xl font-bold">Accounts login</h1>
        </div>
        <input type="password" autoFocus className="field" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p className="text-sm text-red-700">{err}</p>}
        <button disabled={busy || !pw} className="btn btn-primary w-full disabled:opacity-60">{busy ? 'Checking…' : 'Log in'}</button>
        <p className="text-center text-xs text-muted">This device stays logged in for 30 days.</p>
      </form>
    </div>
  );
}

function Dashboard({ go }) {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api('/api/accounts/stats').then(setS).catch((e) => setErr(e.message)); }, []);
  if (err) return <p className="text-red-700">{err}</p>;
  if (!s) return <p className="text-muted">Loading…</p>;
  const max = Math.max(1, ...s.monthly.map((m) => m.total));
  const cards = [
    ['Total sales', s.total], ['Received', s.paid], ['Outstanding', s.total - s.paid],
    ['Sales this month', s.month.total], ['Gross profit (all time)', s.grossProfit], ['Stock value (cost)', s.stockValue],
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold">Overview</h2>
          <p className="text-sm text-muted">Sales, payments and profit at a glance.</p>
        </div>
        <button onClick={() => go('new')} className="btn btn-primary">+ New invoice</button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map(([l, v]) => (
          <div key={l} className="acc-card acc-stat p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{l}</p>
            <p className="mt-2 text-2xl font-extrabold tabular-nums">Rs. {fmt(v)}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="acc-card p-5">
          <h2 className="mb-4 text-lg font-bold">Last 6 months sales</h2>
          <div className="flex h-48 items-end gap-3">
            {s.monthly.length === 0 && <p className="text-sm text-muted">No sales yet. Create an invoice to see data here.</p>}
            {s.monthly.map((m) => (
              <div key={m.m} className="flex flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] text-muted">{fmt(m.total)}</span>
                <div className="w-full rounded-t-md bg-brand" style={{ height: `${(m.total / max) * 100}%` }} />
                <span className="text-[10px] text-muted">{m.m.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="acc-card p-5">
          <h2 className="mb-3 text-lg font-bold">Top customers</h2>
          {s.topCustomers.length === 0 && <p className="text-sm text-muted">No data yet.</p>}
          <ul className="divide-y divide-line text-sm">
            {s.topCustomers.map((c) => <li key={c.name} className="flex justify-between py-2"><span>{c.name} <span className="text-muted">({c.n})</span></span><b>Rs. {fmt(c.total)}</b></li>)}
          </ul>
          <h2 className="mb-3 mt-6 text-lg font-bold">Top items</h2>
          <ul className="divide-y divide-line text-sm">
            {s.topItems.map((c) => <li key={c.name} className="flex justify-between py-2"><span>{c.name} <span className="text-muted">(qty {fmt(c.qty)})</span></span><b>Rs. {fmt(c.total)}</b></li>)}
          </ul>
        </div>
      </div>
      <p className="text-xs text-muted">iPhone: Safari, Share, Add to Home Screen. Android/Chrome: Install app button, or menu, Install app.</p>
    </div>
  );
}

function NewInvoice() {
  const [h, setH] = useState({ invoice_date: todayISO(), customer_name: '', phone: '', age: '', hospital: '', city: 'Lahore', payment_mode: 'Cash', paid: '', tax_pct: '0', notes: '' });
  const [items, setItems] = useState([emptyItem()]);
  const [names, setNames] = useState([]);
  const [nextNo, setNextNo] = useState('');
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([api('/api/accounts/products'), api('/api/accounts/stock')])
      .then(([p, s]) => setNames([...new Set([...(p.names || []), ...s.items.map((i) => i.name)])]))
      .catch(() => {});
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

  const doc = (no) => ({
    invoice_no: no, invoice_date: h.invoice_date, customer_name: h.customer_name, phone: h.phone, age: h.age,
    hospital: h.hospital, city: h.city, items: rows, subtotal, tax_amount: tax, total, paid, notes: h.notes,
  });

  async function save() {
    setErr('');
    if (!h.customer_name.trim()) return setErr('Please enter the customer name.');
    if (!rows.length) return setErr('Please add at least one item.');
    setBusy(true);
    try {
      const r = await api('/api/accounts/invoices', { method: 'POST', body: JSON.stringify({ ...h, items: rows }) });
      setSaved(r);
      setPreview(doc(r.invoice_no));
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
    setH({ ...h, customer_name: '', phone: '', age: '', hospital: '', paid: '', notes: '' });
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 no-print">
          {saved
            ? <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Saved. Invoice {saved.invoice_no}</span>
            : <span className="text-sm text-muted">Preview (not saved yet)</span>}
          <ShareButtons inv={preview} />
          {!saved && <button className="btn btn-outline !py-2" onClick={() => setPreview(null)}>Back to edit</button>}
          {saved && <button className="btn btn-outline !py-2" onClick={newOne}>New invoice</button>}
        </div>
        <InvoiceView inv={preview} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="acc-card grid gap-4 p-5 md:grid-cols-3">
        <label className="text-xs font-medium">Date<input type="date" className="field mt-1" value={h.invoice_date} onChange={set('invoice_date')} /></label>
        <label className="text-xs font-medium">Customer name *<input className="field mt-1" placeholder="e.g. Balqees Bibi w/o Rasheed Ahmad" value={h.customer_name} onChange={set('customer_name')} /></label>
        <label className="text-xs font-medium">WhatsApp / phone<input className="field mt-1" placeholder="e.g. 03001234567" value={h.phone} onChange={set('phone')} /></label>
        <label className="text-xs font-medium">Age<input className="field mt-1" placeholder="e.g. 66" value={h.age} onChange={set('age')} /></label>
        <label className="text-xs font-medium md:col-span-2">Hospital / clinic<input className="field mt-1" placeholder="e.g. Fauji Foundation Hospital" value={h.hospital} onChange={set('hospital')} /></label>
        <label className="text-xs font-medium">City<input className="field mt-1" value={h.city} onChange={set('city')} /></label>
      </div>

      <div className="acc-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold">Items <span className="text-xs font-normal text-muted">({rows.length} filled, bade bill ke liye unlimited)</span></h2>
          <button className="btn btn-outline !py-2 text-sm" onClick={() => setItems([...items, emptyItem()])}>+ Add item</button>
        </div>
        <datalist id="acc-names">{names.map((n) => <option key={n} value={n} />)}</datalist>
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-line p-3 md:grid-cols-12">
              <input type="number" min="1" className="field md:col-span-1" placeholder="Qty" value={it.qty} onChange={(e) => setItem(i, 'qty', e.target.value)} />
              <input list="acc-names" className="field md:col-span-3" placeholder="Item description" value={it.description} onChange={(e) => setItem(i, 'description', e.target.value)} />
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
        <div className="acc-card space-y-3 p-5">
          <label className="text-xs font-medium">Payment mode
            <select className="field mt-1" value={h.payment_mode} onChange={set('payment_mode')}>
              {['Cash', 'Bank transfer', 'Cheque', 'Credit'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium">Amount received (Rs.)<input type="number" className="field mt-1" placeholder="Leave empty if unpaid" value={h.paid} onChange={set('paid')} /></label>
          <label className="text-xs font-medium">Sales tax %<input type="number" className="field mt-1" value={h.tax_pct} onChange={set('tax_pct')} /></label>
          <label className="text-xs font-medium">Notes (optional)<input className="field mt-1" value={h.notes} onChange={set('notes')} /></label>
        </div>
        <div className="acc-card space-y-2 p-5 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><b>Rs. {fmt(subtotal)}</b></div>
          {tax > 0 && <div className="flex justify-between"><span>Tax</span><b>Rs. {fmt(tax)}</b></div>}
          <div className="flex justify-between text-lg"><span className="font-bold">Total</span><b>Rs. {fmt(total)}</b></div>
          <div className="flex justify-between"><span>Balance due</span><b>Rs. {fmt(Math.max(0, total - paid))}</b></div>
          {total > 0 && <p className="pt-2 text-xs italic text-muted">({words(total)})</p>}
          <p className="pt-2 text-xs text-muted">Next invoice number: {nextNo || '…'}</p>
        </div>
      </div>

      {err && <p className="text-sm text-red-700">{err}</p>}
      <div className="flex flex-wrap gap-3">
        <button disabled={busy} onClick={save} className="btn btn-primary disabled:opacity-60">{busy ? 'Saving…' : 'Save invoice'}</button>
        <button className="btn btn-outline" onClick={() => setPreview(doc(nextNo))}>Preview</button>
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
    if (!window.confirm(`Delete invoice ${no}? Its items go back to stock. This cannot be undone.`)) return;
    await api(`/api/accounts/invoices/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="acc-card grid gap-3 p-4 md:grid-cols-4">
        <input className="field md:col-span-2" placeholder="Search invoice no, customer, hospital" value={q} onChange={(e) => setQ(e.target.value)} />
        <input type="date" className="field" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" className="field" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{shown.length} invoices · Total Rs. {fmt(shown.reduce((a, i) => a + i.total, 0))}</p>
        <a href={`/api/accounts/export?from=${from}&to=${to}`} className="btn btn-outline !py-2 text-sm">Export CSV (Excel)</a>
      </div>
      {err && <p className="text-red-700">{err}</p>}
      <div className="acc-card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="acc-thead text-left">
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
                  <button className="text-brand hover:underline" onClick={() => view(i.id)}>Open</button>
                  {' · '}
                  <button className="text-muted hover:text-brand" onClick={() => del(i.id, i.invoice_no)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="acc-empty p-6 text-center text-sm text-muted">No invoices yet.</p>}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4">
          <div className="mx-auto max-w-4xl space-y-3">
            <div className="flex flex-wrap justify-end gap-2 no-print">
              <ShareButtons inv={open} />
              <button className="btn btn-outline !py-2" onClick={() => setOpen(null)}>Close</button>
            </div>
            <InvoiceView inv={open} />
          </div>
        </div>
      )}
    </div>
  );
}

// Print, PDF download and WhatsApp share. PDF is built from the invoice pages on screen.
function ShareButtons({ inv }) {
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

  async function pdfFile() {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;
    const pages = document.querySelectorAll('#invoice-print .inv-page');
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, backgroundColor: '#ffffff' });
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, (210 * canvas.height) / canvas.width);
    }
    return pdf;
  }
  async function downloadPdf() {
    setBusy('pdf'); setMsg('');
    try {
      const pdf = await pdfFile();
      pdf.save(`${inv.invoice_no}.pdf`);
    } catch (e) { setMsg(`PDF failed: ${e.message}`); }
    setBusy('');
  }
  async function whatsapp() {
    setBusy('wa'); setMsg('');
    try {
      const pdf = await pdfFile();
      const name = `${inv.invoice_no}.pdf`;
      const file = new File([pdf.output('blob')], name, { type: 'application/pdf' });
      const text = `IntraMed Solution invoice ${inv.invoice_no}, total Rs. ${fmt(inv.total)}. Thank you.`;
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text, title: inv.invoice_no });
      } else {
        pdf.save(name);
        const digits = String(inv.phone || '').replace(/\D/g, '').replace(/^0/, '92');
        const url = `https://wa.me/${digits}?text=${encodeURIComponent(text + ' (PDF attached in our chat)')}`;
        window.open(url, '_blank');
        setMsg('PDF downloaded. Attach it in the WhatsApp chat that just opened.');
      }
    } catch (e) { if (e.name !== 'AbortError') setMsg(`Share failed: ${e.message}`); }
    setBusy('');
  }
  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <button className="btn btn-primary !py-2" onClick={() => window.print()}>Print</button>
      <button className="btn btn-outline !py-2" disabled={!!busy} onClick={downloadPdf}>{busy === 'pdf' ? 'Making PDF…' : 'Download PDF'}</button>
      <button className="btn btn-outline !py-2" disabled={!!busy} onClick={whatsapp}>{busy === 'wa' ? 'Preparing…' : 'Send on WhatsApp'}</button>
      {msg && <span className="text-xs text-muted">{msg}</span>}
    </div>
  );
}

function StockTab() {
  const [items, setItems] = useState([]);
  const [moves, setMoves] = useState([]);
  const [filter, setFilter] = useState('all');
  const [err, setErr] = useState('');
  const [f, setF] = useState({ name: '', qty: '', unit_cost: '', batch: '', exp_date: '', supplier: '', moved_on: todayISO(), reorder_level: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const load = () => {
    api('/api/accounts/stock').then((r) => setItems(r.items)).catch((e) => setErr(e.message));
    api('/api/accounts/movements').then((r) => setMoves(r.movements)).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const shown = items.filter((s) => {
    if (filter === 'low') return s.status === 'Low' || s.status === 'Out of stock';
    if (filter === 'dead') return s.on_hand > 0 && daysSince(s.last_sold) > 90;
    if (filter === 'negative') return s.status === 'Negative';
    return true;
  });
  const totalValue = items.reduce((a, s) => a + s.value, 0);

  async function addPurchase(e) {
    e.preventDefault();
    setErr('');
    try {
      await api('/api/accounts/stock', { method: 'POST', body: JSON.stringify(f) });
      setF({ ...f, name: '', qty: '', unit_cost: '', batch: '', exp_date: '', supplier: '', reorder_level: '' });
      load();
    } catch (x) { setErr(x.message); }
  }
  async function delMove(m) {
    if (!window.confirm('Delete this purchase entry?')) return;
    try { await api(`/api/accounts/movements/${m.id}`, { method: 'DELETE' }); load(); }
    catch (x) { setErr(x.message); }
  }

  const chips = [['all', 'All items'], ['low', 'Low / out of stock'], ['dead', 'Slow / dead (no sale 90 days)'], ['negative', 'Negative stock']];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="acc-card acc-stat p-5"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Items</p><p className="mt-2 text-2xl font-extrabold">{items.length}</p></div>
        <div className="acc-card acc-stat p-5"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Stock value (cost)</p><p className="mt-2 text-2xl font-extrabold tabular-nums">Rs. {fmt(totalValue)}</p></div>
        <div className="acc-card acc-stat p-5"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Low stock</p><p className="mt-2 text-2xl font-extrabold">{items.filter((s) => s.status === 'Low' || s.status === 'Out of stock').length}</p></div>
        <div className="acc-card acc-stat p-5"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Dead / slow</p><p className="mt-2 text-2xl font-extrabold">{items.filter((s) => s.on_hand > 0 && daysSince(s.last_sold) > 90).length}</p></div>
      </div>

      <form onSubmit={addPurchase} className="acc-card grid gap-3 p-5 md:grid-cols-4">
        <h2 className="font-bold md:col-span-4">Add purchase (stock in)</h2>
        <label className="text-xs font-medium md:col-span-2">Item name *<input list="stock-names" className="field mt-1" value={f.name} onChange={set('name')} required /></label>
        <datalist id="stock-names">{items.map((s) => <option key={s.id} value={s.name} />)}</datalist>
        <label className="text-xs font-medium">Quantity *<input type="number" min="1" className="field mt-1" value={f.qty} onChange={set('qty')} required /></label>
        <label className="text-xs font-medium">Unit cost (Rs.)<input type="number" className="field mt-1" value={f.unit_cost} onChange={set('unit_cost')} /></label>
        <label className="text-xs font-medium">Batch no<input className="field mt-1" value={f.batch} onChange={set('batch')} /></label>
        <label className="text-xs font-medium">Expiry<input className="field mt-1" placeholder="e.g. 9-2028" value={f.exp_date} onChange={set('exp_date')} /></label>
        <label className="text-xs font-medium">Supplier<input className="field mt-1" value={f.supplier} onChange={set('supplier')} /></label>
        <label className="text-xs font-medium">Date<input type="date" className="field mt-1" value={f.moved_on} onChange={set('moved_on')} /></label>
        <label className="text-xs font-medium">Low-stock alert at (qty)<input type="number" className="field mt-1" value={f.reorder_level} onChange={set('reorder_level')} /></label>
        <div className="md:col-span-4"><button className="btn btn-primary">Add to stock</button></div>
      </form>

      {err && <p className="text-sm text-red-700">{err}</p>}
      <div className="flex flex-wrap gap-2">
        {chips.map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${filter === k ? 'border-brand bg-brand text-white' : 'border-line bg-surface'}`}>{l}</button>
        ))}
      </div>
      <div className="acc-card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="acc-thead text-left">
            <tr><th className="p-3">Item</th><th className="p-3 text-right">On hand</th><th className="p-3 text-right">Avg cost</th><th className="p-3 text-right">Value</th><th className="p-3">Last sold</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {shown.map((s) => {
              const dead = s.on_hand > 0 && daysSince(s.last_sold) > 90;
              return (
                <tr key={s.id} className="border-t border-line">
                  <td className="p-3 font-semibold">{s.name}</td>
                  <td className={`p-3 text-right ${s.on_hand < 0 ? 'text-red-700' : ''}`}>{fmt(s.on_hand)}</td>
                  <td className="p-3 text-right">{fmt(s.avg_cost)}</td>
                  <td className="p-3 text-right">{fmt(s.value)}</td>
                  <td className="p-3">{s.last_sold ? dmy(s.last_sold) : <span className="text-muted">never</span>}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.status === 'OK' && !dead ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {dead ? 'Slow / dead' : s.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && <p className="acc-empty p-6 text-center text-sm text-muted">No items in this view.</p>}
      </div>

      <div className="acc-card overflow-x-auto p-5">
        <h2 className="mb-3 text-lg font-bold">Stock history (latest 300)</h2>
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-muted"><tr><th className="py-2">Date</th><th>Item</th><th>Type</th><th className="text-right">Qty</th><th className="text-right">Cost / price</th><th>Reference</th><th /></tr></thead>
          <tbody>
            {moves.map((m) => (
              <tr key={m.id} className="border-t border-line">
                <td className="py-2">{dmy(m.moved_on)}</td>
                <td>{m.name}</td>
                <td>{m.kind === 'in' ? 'Purchase' : 'Sold'}</td>
                <td className="text-right">{fmt(m.qty)}</td>
                <td className="text-right">{m.kind === 'in' ? fmt(m.unit_cost) : fmt(m.unit_price)}</td>
                <td className="text-muted">{m.ref}{m.batch ? ` · batch ${m.batch}` : ''}</td>
                <td className="text-right">{m.kind === 'in' && <button className="text-muted hover:text-brand" onClick={() => delMove(m)}>Delete</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {moves.length === 0 && <p className="acc-empty p-4 text-sm text-muted">No stock movements yet.</p>}
      </div>
    </div>
  );
}

function ProfitLoss() {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [ex, setEx] = useState({ spent_on: todayISO(), category: '', amount: '', note: '' });
  const [expenses, setExpenses] = useState([]);

  const load = () => {
    api(`/api/accounts/pnl?year=${year}`).then(setData).catch((e) => setErr(e.message));
    api('/api/accounts/expenses').then((r) => setExpenses(r.expenses)).catch(() => {});
  };
  useEffect(() => { load(); }, [year]);

  async function addExpense(e) {
    e.preventDefault();
    try {
      await api('/api/accounts/expenses', { method: 'POST', body: JSON.stringify(ex) });
      setEx({ ...ex, category: '', amount: '', note: '' });
      load();
    } catch (x) { setErr(x.message); }
  }
  async function delExpense(id) {
    if (!window.confirm('Delete this expense?')) return;
    await api(`/api/accounts/expenses/${id}`, { method: 'DELETE' });
    load();
  }

  if (err) return <p className="text-red-700">{err}</p>;
  if (!data) return <p className="text-muted">Loading…</p>;
  const max = Math.max(1, ...data.months.flatMap((m) => [m.revenue, m.cogs, m.net > 0 ? m.net : 0]));
  const t = data.totals;
  const margin = t.revenue > 0 ? ((t.net / t.revenue) * 100).toFixed(1) : '0.0';
  const yearsList = [...new Set([...data.years, String(new Date().getFullYear())])];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Profit & Loss {year}</h2>
        <select className="field !w-auto" value={year} onChange={(e) => setYear(e.target.value)}>
          {yearsList.map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[['Revenue', t.revenue], ['Cost of goods', t.cogs], ['Gross profit', t.gross], ['Expenses', t.expenses], ['Net profit', t.net]].map(([l, v]) => (
          <div key={l} className="acc-card acc-stat p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">{l}</p><p className={`mt-2 text-lg font-extrabold tabular-nums ${l === 'Net profit' && v < 0 ? 'text-red-700' : ''}`}>Rs. {fmt(v)}</p></div>
        ))}
      </div>
      <p className="text-sm text-muted">Net margin: {margin}%. Revenue is before sales tax. Cost of goods uses the average purchase cost of each item.</p>

      <div className="acc-card p-5">
        <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted">
          <span><i className="mr-1 inline-block h-2 w-3 bg-brand" />Revenue</span>
          <span><i className="mr-1 inline-block h-2 w-3 bg-zinc-400" />Cost of goods</span>
          <span><i className="mr-1 inline-block h-2 w-3 bg-emerald-600" />Net profit</span>
        </div>
        <div className="flex h-64 items-end gap-2">
          {data.months.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div className="flex h-full w-full items-end justify-center gap-[2px]">
                <div title={`Revenue ${fmt(m.revenue)}`} className="w-[30%] rounded-t bg-brand" style={{ height: `${(m.revenue / max) * 100}%` }} />
                <div title={`Cost ${fmt(m.cogs)}`} className="w-[30%] rounded-t bg-zinc-400" style={{ height: `${(m.cogs / max) * 100}%` }} />
                <div title={`Net ${fmt(m.net)}`} className={`w-[30%] rounded-t ${m.net >= 0 ? 'bg-emerald-600' : 'bg-red-700'}`} style={{ height: `${(Math.abs(m.net) / max) * 100}%` }} />
              </div>
              <span className="text-[10px] text-muted">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="acc-card overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="acc-thead text-left"><tr><th className="p-3">Month</th><th className="p-3 text-right">Revenue</th><th className="p-3 text-right">Cost</th><th className="p-3 text-right">Gross</th><th className="p-3 text-right">Expenses</th><th className="p-3 text-right">Net</th></tr></thead>
          <tbody>
            {data.months.map((m) => (
              <tr key={m.month} className="border-t border-line">
                <td className="p-3">{m.month}</td>
                <td className="p-3 text-right">{fmt(m.revenue)}</td>
                <td className="p-3 text-right">{fmt(m.cogs)}</td>
                <td className="p-3 text-right">{fmt(m.gross)}</td>
                <td className="p-3 text-right">{fmt(m.expenses)}</td>
                <td className={`p-3 text-right font-semibold ${m.net < 0 ? 'text-red-700' : ''}`}>{fmt(m.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={addExpense} className="acc-card grid gap-3 p-5 md:grid-cols-5">
        <h2 className="font-bold md:col-span-5">Add expense</h2>
        <label className="text-xs font-medium">Date<input type="date" className="field mt-1" value={ex.spent_on} onChange={(e) => setEx({ ...ex, spent_on: e.target.value })} /></label>
        <label className="text-xs font-medium">Category<input className="field mt-1" placeholder="e.g. Rent, Salary, Transport" value={ex.category} onChange={(e) => setEx({ ...ex, category: e.target.value })} /></label>
        <label className="text-xs font-medium">Amount (Rs.)<input type="number" className="field mt-1" value={ex.amount} onChange={(e) => setEx({ ...ex, amount: e.target.value })} required /></label>
        <label className="text-xs font-medium md:col-span-2">Note<input className="field mt-1" value={ex.note} onChange={(e) => setEx({ ...ex, note: e.target.value })} /></label>
        <div className="md:col-span-5"><button className="btn btn-primary">Save expense</button></div>
      </form>
      <div className="acc-card overflow-x-auto p-5">
        <h2 className="mb-3 text-lg font-bold">Recent expenses</h2>
        <ul className="divide-y divide-line text-sm">
          {expenses.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span>{dmy(e.spent_on)} · {e.category || 'Expense'}{e.note ? ` · ${e.note}` : ''}</span>
              <span className="flex items-center gap-3"><b>Rs. {fmt(e.amount)}</b><button className="text-muted hover:text-brand" onClick={() => delExpense(e.id)}>Delete</button></span>
            </li>
          ))}
        </ul>
        {expenses.length === 0 && <p className="text-sm text-muted">No expenses yet.</p>}
      </div>
    </div>
  );
}

// Printable invoice. Long bills split across pages automatically, with the table header repeated.
function paginate(items) {
  const FIRST = 11;
  const NEXT = 20;
  const pages = [items.slice(0, FIRST)];
  let i = FIRST;
  while (i < items.length) { pages.push(items.slice(i, i + NEXT)); i += NEXT; }
  if (pages[pages.length - 1].length > 8) pages.push([]);
  return pages;
}

function InvoiceView({ inv }) {
  const pages = paginate(inv.items || []);
  const heads = ['QTY', 'ITEM DESCRIPTION', 'SPECS', 'BATCH NO', 'EXP DATE', 'UNIT PRICE', 'NET AMOUNT'];
  const cell = 'border border-black p-1.5';
  const rowNo = useMemo(() => {
    let n = 0;
    return pages.map((p) => { const start = n; n += p.length; return start; });
  }, [pages]);

  return (
    <div id="invoice-print" className="mx-auto w-full max-w-[210mm] text-[13px] text-black">
      {pages.map((rows, idx) => {
        const last = idx === pages.length - 1;
        return (
          <div key={idx} className="inv-page relative overflow-hidden bg-white shadow-card" style={{ width: '210mm', height: '297mm', padding: '14mm', boxSizing: 'border-box', margin: '0 auto 10px' }}>
            {idx === 0 ? (
              <>
                <img src="/logo.png" alt="IntraMed Solution" className="h-16 w-auto" />
                <h1 className="mt-5 text-3xl font-normal">INVOICE</h1>
                <div className="mt-3 grid grid-cols-[90px_1fr] gap-y-1">
                  <span>Date:</span><span>{dmy(inv.invoice_date)}</span>
                  <span>Invoice #</span><span>{inv.invoice_no}</span>
                </div>
                <p className="mt-5 font-bold underline">CUSTOMER:</p>
                <div className="mt-1 leading-relaxed">
                  <div>{inv.customer_name}{inv.age ? ` Age: ${inv.age}y` : ''}</div>
                  {inv.hospital && <div>{inv.hospital}</div>}
                  {inv.city && <div>{inv.city}</div>}
                  {inv.phone && <div>Phone: {inv.phone}</div>}
                </div>
              </>
            ) : (
              <div className="flex justify-between text-[12px]"><span>INVOICE {inv.invoice_no} (continued)</span><span>Page {idx + 1} of {pages.length}</span></div>
            )}

            {rows.length > 0 && (
              <table className="mt-5 w-full border-collapse text-[12px]">
                <thead><tr className="bg-[#a9c4e6]">{heads.map((h) => <th key={h} className={`${cell} text-center font-bold`}>{h}</th>)}</tr></thead>
                <tbody>
                  {rows.map((it, i) => (
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
            )}

            {last && (
              <div className="mt-4">
                <div className="space-y-1 text-right">
                  {inv.tax_amount > 0 && <div>Subtotal: {fmt(inv.subtotal)} · Tax: {fmt(inv.tax_amount)}</div>}
                  <div className="text-base font-bold">{fmt(inv.total)}</div>
                  {inv.paid > 0 && <div>Received: {fmt(inv.paid)} · Balance: {fmt(Math.max(0, inv.total - inv.paid))}</div>}
                </div>
                <p className="mt-3 font-serif">({words(inv.total)})</p>
                {inv.notes && <p className="mt-2 text-[12px]">Note: {inv.notes}</p>}
                <p className="mt-6 font-serif text-[12px]">For. INTRAMED SOLUTION</p>
                <div className="mt-12 w-56 border-t border-black pt-1 text-[12px]">Authorized signature</div>
              </div>
            )}

            <div className="absolute bottom-[10mm] left-[14mm] right-[14mm] text-center text-[11px] font-bold text-[#b3151b]">
              <p>{DOC.office}</p>
              <p>E-mail: {DOC.email} Contact: {DOC.contact}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
