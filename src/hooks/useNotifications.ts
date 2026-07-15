import { useCallback, useEffect, useState } from "react";
import {
  getAllNotifications,
  type AppNotification,
} from "@/services/notifications.api";
import { onNewNotification } from "@/utils/notificationBus";
import { seedNotificationHistoryOnce, showSystemNotification } from "@/utils/pushNotifications";

// Not every notification type is pushed via FCM yet (only attendance is,
// today) — polling is what surfaces the rest (homework, exams, fees, etc.)
// as system notifications too, so every type reaches both the app's history
// and the OS notification center.
const POLL_INTERVAL_MS = 45_000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllNotifications({ page: 1, limit: 20 });
      const list = res?.data ?? [];
      setNotifications(list);

      // First-ever fetch in this browser: mark existing history as already
      // seen instead of notifying, so opening the app doesn't dump years of
      // old notifications into the OS notification center.
      const justSeeded = seedNotificationHistoryOnce(list.map((n) => n.id));
      if (!justSeeded) {
        list
          .filter((n) => !n.is_read)
          .forEach((n) => {
            void showSystemNotification({ id: n.id, title: n.title, body: n.message });
          });
      }
    } catch (err) {
      console.error("fetchNotifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh on mount, whenever a foreground push arrives (catch-up), and on
  // a fixed interval (so types the backend doesn't push via FCM still surface).
  useEffect(() => {
    fetchNotifications();
    const unsubscribe = onNewNotification(fetchNotifications);
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return { notifications, isLoading, unreadCount, refetch: fetchNotifications };
}
