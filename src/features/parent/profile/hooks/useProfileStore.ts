import { create } from "zustand";
import type { ContactInfo, NotificationPref } from "../types/profile.types";
import { parentProfile } from "../data/profile.data";

interface ProfileState {
  contact: ContactInfo;
  notifications: NotificationPref[];
  setContact: (contact: ContactInfo) => void;
  toggleNotification: (id: string) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  contact: parentProfile.contact,
  notifications: parentProfile.notifications,
  setContact: (contact) => set({ contact }),
  toggleNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      ),
    })),
}));