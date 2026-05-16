import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthState, Role } from "@/types/auth.types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      schoolCode: null,
      phone: null,
      userType: null,
      otp: null,
      isOtpSent: false,
      schoolId: null,

      setLoginData: (schoolCode: string, phone: string, userType: Role, otp: string) =>
        set({ schoolCode, phone, userType, otp, isOtpSent: true }),

      setAuth: (user: User, token: string) =>
        set({ user, token, isOtpSent: false, schoolId: user.schoolId || null }),

      logout: () =>
        set({
          user: null,
          token: null,
          schoolCode: null,
          phone: null,
          userType: null,
          otp: null,
          isOtpSent: false,
          schoolId: null,
        }),

      resetLoginState: () =>
        set({ userType: null, otp: null, isOtpSent: false }),
    }),
    { name: "auth-store" }
  )
);

export const getAuthToken = () => useAuthStore.getState().token;
export const getTenantId = () => useAuthStore.getState().user?.tenantId ?? null;