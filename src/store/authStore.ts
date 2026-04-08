// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "../types/api.types"; // type-only import

interface AuthState {
  user: object | null;
  token: string | null;
  role: Role | null;
  tenantId: string | null;
  setAuth: (payload: {
    user: object;
    token: string;
    role: Role;
    tenantId: string;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      tenantId: null,
      setAuth: ({ user, token, role, tenantId }) =>
        set({ user, token, role, tenantId }),
      logout: () =>
        set({ user: null, token: null, role: null, tenantId: null }),
    }),
    { name: "auth-store" }
  )
);

export const getAuthToken = () => useAuthStore.getState().token;
export const getTenantId = () => useAuthStore.getState().tenantId;