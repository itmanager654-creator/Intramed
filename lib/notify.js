import webpush from 'web-push';
import { db } from '@/lib/db';

const TIMEOUT = 8000;

export function channelStatus() {
  return {
    telegram: !!(process.env.TELEGRAM_BOT_TOKEN && (process.env.TELEGRAM_CHAT_ID || '').trim()),
    email: !!(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL),
    push: !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
  };
}

async function sendTelegram(text) {
  const chats = process.env.TELEGRAM_CHAT_ID.split(',').map((s) => s.trim()).filter(Boolean);
  for (const chat_id of chats) {
    const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id, text }), signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error(j.description || `Telegram HTTP ${r.status}`);
    }
  }
}

async function sendEmail(subject, text) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'IntraMed Solution <onboarding@resend.dev>',
      to: process.env.NOTIFY_EMAIL.split(',').map((s) => s.trim()),
      subject, text,
    }),
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.message || `Resend HTTP ${r.status}`);
  }
}

// Phone / desktop push notification (works even when the website is closed).
async function sendPush(payload) {
  webpush.setVapidDetails(`mailto:${(process.env.NOTIFY_EMAIL || 'info@intramedsolution.com').split(',')[0].trim()}`, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const sql = db();
  const subs = await sql`select endpoint, p256dh, auth from push_subs`;
  if (!subs.length) throw new Error('No device subscribed yet. Open /admin/ on your phone and tap "Enable phone notifications".');
  let sent = 0, lastErr = null;
  await Promise.all(subs.map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload), { TTL: 3600, urgency: 'high' });
      sent++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) await sql`delete from push_subs where endpoint = ${s.endpoint}`;
      else lastErr = e;
    }
  }));
  if (!sent) throw new Error(lastErr ? `Push failed: ${lastErr.statusCode || ''} ${lastErr.message}` : 'Subscribed device has expired. Tap "Enable phone notifications" again.');
}

// Never throws and never blocks the form. Returns what happened on each channel.
export async function notifyInquiry(i) {
  const text =
    `🔔 New inquiry — IntraMed Solution\nName: ${i.name}\nPhone: ${i.phone}\n` +
    (i.email ? `Email: ${i.email}\n` : '') + (i.product ? `Product: ${i.product}\n` : '') + `Message: ${i.message}`;
  const on = channelStatus();
  const results = [];
  const run = async (channel, fn) => {
    try { await fn(); results.push({ channel, ok: true }); }
    catch (e) { console.error(`[notify:${channel}]`, e.message); results.push({ channel, ok: false, error: e.message }); }
  };
  const jobs = [];
  if (on.telegram) jobs.push(run('telegram', () => sendTelegram(text))); else results.push({ channel: 'telegram', ok: false, error: 'not configured (add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)' });
  if (on.email) jobs.push(run('email', () => sendEmail(`New inquiry from ${i.name}`, text))); else results.push({ channel: 'email', ok: false, error: 'not configured (optional)' });
  if (on.push) jobs.push(run('push', () => sendPush({ title: `New inquiry: ${i.name}`, body: `${i.product ? i.product + ' — ' : ''}${i.message}`.slice(0, 140), url: '/admin/' }))); else results.push({ channel: 'push', ok: false, error: 'not configured (add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY)' });
  await Promise.all(jobs);
  return results;
}
