import webpush from 'web-push';
import { db } from '@/lib/db';

export function channelStatus() {
  return { push: !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) };
}

// Browser / phone push notification (works even when the website is closed).
async function sendPush(payload) {
  webpush.setVapidDetails('mailto:info@intramedsolution.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const sql = db();
  const subs = await sql`select endpoint, p256dh, auth from push_subs`;
  if (!subs.length) throw new Error('No device subscribed yet. Open /admin/ in Chrome on your phone and tap "Enable phone notifications".');
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
  if (!sent) throw new Error(lastErr ? `Push failed: ${lastErr.statusCode || ''} ${lastErr.message}` : 'This device has expired. Tap "Enable phone notifications" again.');
}

// Never throws and never blocks the inquiry form.
export async function notifyInquiry(i) {
  if (!channelStatus().push) return [{ channel: 'push', ok: false, error: 'VAPID keys are missing in Vercel (VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY).' }];
  try {
    await sendPush({ title: `New inquiry: ${i.name}`, body: `${i.product ? i.product + ' — ' : ''}${i.message}`.slice(0, 140), url: '/admin/' });
    return [{ channel: 'push', ok: true }];
  } catch (e) {
    console.error('[notify:push]', e.message);
    return [{ channel: 'push', ok: false, error: e.message }];
  }
}
