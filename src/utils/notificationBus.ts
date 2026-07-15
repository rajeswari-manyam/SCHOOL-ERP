// src/utils/notificationBus.ts
// Tiny pub/sub so a foreground FCM push (subscribed once, in pushNotifications.ts)
// can tell any mounted UI (e.g. the notification bell) to refresh its list,
// without every listener re-subscribing to Firebase's onMessage itself.

type Listener = () => void;

const listeners = new Set<Listener>();

export const onNewNotification = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const emitNewNotification = (): void => {
  listeners.forEach((listener) => listener());
};
