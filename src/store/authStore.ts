// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types/api.types";

interface User {
  id: string;
  name: string;
  role: Role;
  email?: string;
  phone?: string;
  tenantId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "auth-store" }
  )
);

export const getAuthToken = () => useAuthStore.getState().token;
export const getTenantId = () => useAuthStore.getState().user?.tenantId ?? null;