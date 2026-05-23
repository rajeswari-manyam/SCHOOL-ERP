import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: "info" | "success" | "error";
  createdAt: string;
}

interface NotificationState {
  list: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      list: [],
      unreadCount: 0,
      addNotification: (n) =>
        set((state) => ({
          list: [n, ...state.list],
          unreadCount: state.unreadCount + 1,
        })),
      markRead: (id) =>
        set((state) => ({
          list: state.list.map((n) => (n.id === id ? { ...n, read: true } : n)),
          unreadCount: state.list.filter((n) => !n.read && n.id !== id).length,
        })),
      clear: () => set({ list: [], unreadCount: 0 }),
    }),
    { name: "notification-store" },
  ),
);
