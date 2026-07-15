// Firebase Cloud Messaging service worker.
//
// Registered from src/utils/pushNotifications.ts, which appends the public
// Firebase web config as query params — a service worker runs in its own
// scope and can't import from src/config/firebase.ts, so the config has to
// arrive this way instead.
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js");

const params = new URLSearchParams(self.location.search);

firebase.initializeApp({
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
});

const messaging = firebase.messaging();

// Fires only when the tab is unfocused/closed — the foreground case is
// handled by listenForForegroundMessages in src/utils/pushNotifications.ts.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "New notification";
  const options = {
    body: payload.notification?.body ?? "",
    icon: payload.notification?.icon ?? "/favicon.png",
    badge: "/favicon.png",
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});
