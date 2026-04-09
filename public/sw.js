/* QueueTip service worker — push notifications only */
self.addEventListener("push", (event) => {
  let data = { title: "QueueTip", body: "", url: "/app/track" };
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch {
    /* use defaults */
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/brand/queue-tip-logo.png",
      badge: "/brand/queue-tip-logo.png",
      data: { url: data.url || "/app/track" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const path = event.notification.data?.url || "/app/track";
  const full = new URL(path, self.location.origin).href;
  event.waitUntil(self.clients.openWindow(full));
});
