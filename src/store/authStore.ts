// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, UserType } from "@/features/auth/types/auth.types";

// ── API userType  →  dashboard route ─────────────────────────────────────────
export const USER_TYPE_ROUTE_MAP: Record<string, string> = {
  // PascalCase (from API)
  SuperAdmin:  "/superadmin/dashboard",
  Admin:       "/schooladmin/dashboard",
  SchoolAdmin: "/schooladmin/dashboard",
  Teacher:     "/teacher/dashboard",
  Accountant:  "/accountant/dashboard",
  Parent:      "/parent/dashboard",
  Student:     "/student/dashboard",
  // lowercase (safe fallbacks)
  superadmin:  "/superadmin/dashboard",
  admin:       "/schooladmin/dashboard",
  schooladmin: "/schooladmin/dashboard",
  teacher:     "/teacher/dashboard",
  accountant:  "/accountant/dashboard",
  parent:      "/parent/dashboard",
  student:     "/student/dashboard",
};

// ── API userType  →  lowercase role key (used in ProtectedRoute) ─────────────
export const USER_TYPE_ROLE_MAP: Record<string, string> = {
  SuperAdmin:  "superadmin",
  Admin:       "schooladmin",
  SchoolAdmin: "schooladmin",
  Teacher:     "teacher",
  Accountant:  "accountant",
  Parent:      "parent",
  Student:     "student",
  // already lowercase — pass through
  superadmin:  "superadmin",
  admin:       "schooladmin",
  schooladmin: "schooladmin",
  teacher:     "teacher",
  accountant:  "accountant",
  parent:      "parent",
  student:     "student",
};

// ── Store interface ───────────────────────────────────────────────────────────
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  userType: UserType | null;
  role: string | null;           // lowercase role key, e.g. "teacher"

  // Called right after LOGIN API — saves userType before OTP
  setLoginMeta: (userType: UserType, phone: string, schoolcode: string) => void;

  // Called after OTP verify — saves full session
  setAuth: (user: AuthUser, token: string) => void;

  // ⬇️  login() — backward-compatible alias used by old OtpPage code
  //    login(token, user, rawRole)  where rawRole can be "Teacher" or "teacher"
  login: (token: string, user: Partial<AuthUser>, rawRole: string) => void;

  logout: () => void;
  isAuthenticated: () => boolean;
  getRoleRoute: () => string;
  getRole: () => string | null;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:     null,
      token:    null,
      userType: null,
      role:     null,

      // ── After LOGIN API ───────────────────────────────────────────────────
      setLoginMeta: (userType, phone, schoolcode) => {
        const role = USER_TYPE_ROLE_MAP[userType] ?? userType.toLowerCase();
        set({ userType, role });
        localStorage.setItem(
          "__auth_meta__",
          JSON.stringify({ userType, phone, schoolcode })
        );
        // Also write individual keys for old OtpPage code that reads them
        localStorage.setItem("userType", userType);
        localStorage.setItem("phone", phone);
        localStorage.setItem("schoolcode", schoolcode);
      },

      // ── After OTP VERIFY ─────────────────────────────────────────────────
      setAuth: (user, token) => {
        const role = USER_TYPE_ROLE_MAP[user.userType] ?? user.userType.toLowerCase();
        set({ user, token, userType: user.userType, role });
        localStorage.removeItem("__auth_meta__");
        localStorage.setItem("userId", user.id);
      },

      // ── Backward-compatible login() for old OtpPage code ─────────────────
      login: (token, partialUser, rawRole) => {
        // rawRole may be "Teacher", "teacher", "SchoolAdmin", etc.
        const role      = USER_TYPE_ROLE_MAP[rawRole] ?? rawRole.toLowerCase();
        const userType  = (rawRole as UserType) ?? "Teacher";
        const phone     = localStorage.getItem("phone") ?? "";
        const schoolcode = localStorage.getItem("schoolcode") ?? "";

        const user: AuthUser = {
          id:         partialUser?.id         ?? `user-${phone}`,
          name:       partialUser?.name        ?? "User",
          phone:      partialUser?.phone       ?? phone,
          userType:   partialUser?.userType    ?? userType,
          schoolcode: partialUser?.schoolcode  ?? schoolcode,
          class_id:   partialUser?.class_id,
          section_id: partialUser?.section_id,
        };

        set({ user, token, userType: user.userType, role });
        localStorage.removeItem("__auth_meta__");
        localStorage.setItem("userId", user.id);
      },

      logout: () => {
        set({ user: null, token: null, userType: null, role: null });
        localStorage.removeItem("__auth_meta__");
        localStorage.removeItem("userType");
        localStorage.removeItem("phone");
        localStorage.removeItem("schoolcode");
        localStorage.removeItem("otp");
        localStorage.removeItem("userId");
      },

      isAuthenticated: () => {
        const { token, user } = get();
        return !!(token && user);
      },

      getRoleRoute: () => {
        const { userType } = get();
        if (!userType) return "/login";
        return USER_TYPE_ROUTE_MAP[userType] ?? "/login";
      },

      getRole: () => get().role,
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user:     state.user,
        token:    state.token,
        userType: state.userType,
        role:     state.role,
      }),
    }
  )
);

// ── Non-hook selectors (for axios interceptors etc.) ─────────────────────────
export const getAuthToken = () => useAuthStore.getState().token;
export const getTenantId  = () => useAuthStore.getState().user?.schoolcode ?? null;
export const getAuthUser  = () => useAuthStore.getState().user;