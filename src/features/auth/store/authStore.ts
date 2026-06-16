// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Permission, Role, UserProfile, UserType } from "@/features/auth/types/auth.types";

// ── Role → dashboard route map ─────────────────────────────────────────────────
export const USER_TYPE_ROUTE_MAP: Record<string, string> = {
  Teacher:    "/teacher/dashboard",
  Parent:     "/parent/dashboard",
  Student:    "/student/dashboard",
  Accountant: "/accountant/dashboard",
  Admin:      "/admin/dashboard",
  SchoolAdmin:"/admin/dashboard",
  SuperAdmin: "/superadmin/dashboard",
};

// ── State shape ────────────────────────────────────────────────────────────────
interface AuthState {
  token: string | null;
  userType: string | null;
  userId: string | null;
  profile: UserProfile | null;
  role: Role | null;
  permissions: Permission[];

  /**
   * Step 1 — called right after sendOtp succeeds.
   * Saves phone / schoolcode / userType so OtpPage can read them.
   */
  setLoginMeta: (userType: string, phone: string, schoolcode: string) => void;

  /**
   * Step 2 — called after getUserById resolves.
   * Commits the full session (token, profile, role, permissions) to store + localStorage.
   */
  setAuth: (
    token: string,
    userId: string,
    userType: string,
    profile: UserProfile,
    role: Role,
    permissions: Permission[]
  ) => void;

  /**
   * Backward-compat shim — OtpPage & student login still call login().
   * Stores a minimal session; you can migrate callers to setAuth over time.
   */
  login: (
    token: string,
    user: {
      id: string;
      name?: string;
      email?: string;
      phone?: string;
      userType?: UserType;
      schoolcode?: string;
      class_id?: string;
      section_id?: string;
      students?: { id: string; name: string }[];
    },
    userType: string
  ) => void;

  logout: () => void;
}

// ── Store ──────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token:       null,
      userType:    null,
      userId:      null,
      profile:     null,
      role:        null,
      permissions: [],

      // ── setLoginMeta ──────────────────────────────────────────────────────────
      setLoginMeta: (userType, phone, schoolcode) => {
        localStorage.setItem("userType",   userType);
        localStorage.setItem("phone",      phone);
        localStorage.setItem("schoolcode", schoolcode);
        set({ userType });
      },

      // ── setAuth ───────────────────────────────────────────────────────────────
      setAuth: (token, userId, userType, profile, role, permissions) => {
        // Keep raw localStorage keys so Axios interceptor can read token
        localStorage.setItem("token",  token);
        localStorage.setItem("userId", userId);
        set({ token, userId, userType, profile, role, permissions });
      },

      // ── login (shim) ──────────────────────────────────────────────────────────
      login: (token, user, userType) => {
        localStorage.setItem("token",  token);
        localStorage.setItem("userId", user.id ?? "");
        set({
          token,
          userType,
          userId: user.id ?? null,
          profile: {
            id:         user.id,
            name:       user.name ?? "",
            email:      user.email,
            phone:      user.phone,
            schoolcode: user.schoolcode,
            class_id:   user.class_id,
            section_id: user.section_id,
            students:   user.students,
          },
          // permissions / role stay whatever they were (populated by setAuth)
        });
      },

      // ── logout ────────────────────────────────────────────────────────────────
      logout: () => {
        [
          "token", "userId", "userType",
          "phone", "schoolcode", "otp",
          "parentId",
        ].forEach((key) => localStorage.removeItem(key));

        set({
          token:       null,
          userType:    null,
          userId:      null,
          profile:     null,
          role:        null,
          permissions: [],
        });
      },
    }),
    {
      name: "auth-storage",
      // Only persist the fields that are safe to rehydrate across page refreshes.
      // Avoid persisting function references — zustand/persist handles that automatically.
      partialize: (s) => ({
        token:       s.token,
        userType:    s.userType,
        userId:      s.userId,
        profile:     s.profile,
        role:        s.role,
        permissions: s.permissions,
      }),
    }
  )
);
