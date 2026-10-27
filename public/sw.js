// Receives push notifications so an alert shows on the phone even when the site is closed.
self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch { d = { title: 'New inquiry', body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(d.title || 'New inquiry', {
    body: d.body || '', icon: '/favicon.png', badge: '/favicon.png', tag: 'inquiry', renotify: true, data: { url: d.url || '/admin/' },
  }));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/admin/';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) if (c.url.includes('/admin') && 'focus' in c) return c.focus();
    return self.clients.openWindow(url);
  }));
});
