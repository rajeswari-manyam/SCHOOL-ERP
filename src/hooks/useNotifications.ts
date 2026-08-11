import { useCallback, useEffect, useState } from "react";
import {
  getAllNotifications,
  type AppNotification,
} from "@/services/notifications.api";
import { onNewNotification } from "@/utils/notificationBus";
import { seedNotificationHistoryOnce, showSystemNotification } from "@/utils/pushNotifications";
import { useAuthStore } from "@/store/authStore";


const POLL_INTERVAL_MS = 45_000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    
    if (useAuthStore.getState().role === "superadmin") return;

    setIsLoading(true);
    try {
      const res = await getAllNotifications({ page: 1, limit: 20 });
      const list = res?.data ?? [];
      setNotifications(list);

    
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