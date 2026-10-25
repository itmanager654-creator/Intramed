// Sends a phone/email alert for every new inquiry. Failures never block the form.
export async function notifyInquiry(i) {
  const text =
    `🔔 New inquiry — IntraMed Solution\n` +
    `Name: ${i.name}\nPhone: ${i.phone}\n` +
    (i.email ? `Email: ${i.email}\n` : '') +
    (i.product ? `Product: ${i.product}\n` : '') +
    `Message: ${i.message}`;

  const jobs = [];

  const bot = process.env.TELEGRAM_BOT_TOKEN;
  const chats = (process.env.TELEGRAM_CHAT_ID || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (bot) {
    for (const chat_id of chats) {
      jobs.push(fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id, text }),
      }));
    }
  }

  if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
    jobs.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'IntraMed Solution <onboarding@resend.dev>',
        to: process.env.NOTIFY_EMAIL.split(',').map((s) => s.trim()),
        subject: `New inquiry from ${i.name}`,
        text,
      }),
    }));
  }

  await Promise.allSettled(jobs);
}
