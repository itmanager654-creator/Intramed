'use client';
import { useState } from 'react';

export default function AdminLogin() {
  const [err, setErr] = useState('');
  async function submit(e) {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/admin/login/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: new FormData(e.currentTarget).get('password') }) });
    if (res.ok) window.location.reload(); else setErr('Wrong password');
  }
  return (
    <div className="wrap section max-w-md">
      <form onSubmit={submit} className="card grid gap-3 p-6">
        <h1 className="text-2xl font-bold">Admin login</h1>
        <input name="password" type="password" required placeholder="Password" className="field" autoComplete="current-password" />
        {err && <p role="alert" className="text-sm font-medium text-brand">{err}</p>}
        <button className="btn btn-primary">Log in</button>
      </form>
    </div>
  );
}
