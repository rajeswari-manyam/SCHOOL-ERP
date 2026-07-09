// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, UserType, GetUserByIdResponse, Parent, Student } from "@/features/auth/types/auth.types";

// ── API userType  →  dashboard route ─────────────────────────────────────────
export const USER_TYPE_ROUTE_MAP: Record<string, string> = {
  // PascalCase (from API)
  SuperAdmin:       "/superadmin/dashboard",
  Admin:            "/schooladmin/dashboard",
  SchoolAdmin:      "/schooladmin/dashboard",
  Teacher:          "/teacher/dashboard",
  "Class Teacher":  "/teacher/dashboard",
  Accountant:       "/accountant/dashboard",
  Parent:           "/parent/dashboard",
  Student:          "/student/dashboard",
  // lowercase (safe fallbacks)
  superadmin:       "/superadmin/dashboard",
  admin:            "/schooladmin/dashboard",
  schooladmin:      "/schooladmin/dashboard",
  teacher:          "/teacher/dashboard",
  "class teacher":  "/teacher/dashboard",
  accountant:       "/accountant/dashboard",
  parent:           "/parent/dashboard",
  student:          "/student/dashboard",
};

// ── API userType  →  lowercase role key (used in ProtectedRoute) ─────────────
export const USER_TYPE_ROLE_MAP: Record<string, string> = {
  SuperAdmin:       "superadmin",
  Admin:            "schooladmin",
  SchoolAdmin:      "schooladmin",
  Teacher:          "teacher",
  "Class Teacher":  "teacher",
  Accountant:       "accountant",
  Parent:           "parent",
  Student:          "student",
  // already lowercase — pass through
  superadmin:       "superadmin",
  admin:            "schooladmin",
  schooladmin:      "schooladmin",
  teacher:          "teacher",
  "class teacher":  "teacher",
  accountant:       "accountant",
  parent:           "parent",
  student:          "student",
};

// ── Store interface ───────────────────────────────────────────────────────────
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  userType: UserType | null;
  role: string | null;           // lowercase role key, e.g. "teacher"

  // ── Parent Portal — multi-student support ────────────────────────────────
  parent: Parent | null;
  students: Student[];
  selectedStudent: Student | null;

  setLoginMeta: (userType: UserType, phone: string, schoolcode: string) => void;

  setAuth: (user: AuthUser, token: string) => void;

  login: (token: string, user: Partial<AuthUser>, rawRole: string) => void;

  // Called after OTP verify for Parent userType — seeds parent + students,
  // auto-selecting when there's exactly one student.
  setParentSession: (parent: Parent, students: Student[]) => void;

  setSelectedStudent: (student: Student | null) => void;

  // Called after getUserById — merges full profile into user
  setUserProfile: (profile: GetUserByIdResponse) => void;

  // Called after fetching school details — stores principal name
  setPrincipalName: (name: string) => void;

  // Called after saving a new avatar/admin photo — refreshes it immediately
  setUserImage: (image: string | null) => void;

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

      parent:          null,
      students:        [],
      selectedStudent: null,

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

      // ── After OTP VERIFY (Parent) ─────────────────────────────────────────
      setParentSession: (parent, students) => {
        const prevSelected = get().selectedStudent;
        const restored = prevSelected
          ? students.find((s) => s.id === prevSelected.id) ?? null
          : null;
        const selectedStudent =
          students.length === 1 ? students[0] : restored;

        set({ parent, students, selectedStudent });
      },

      setSelectedStudent: (student) => set({ selectedStudent: student }),

      // ── After getUserById — merge full profile into existing user ─────────
      setUserProfile: (profile) => {
        const current = get().user;
        if (!current || !profile.status) return;
        const d = profile.data;
        const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
        const displayName: string =
          str(d.parent_name) ?? str(d.teacher_name) ?? str(d.student_name) ??
          str(d.admin_name)  ?? str(d.accountant_name) ??
          (str(d.first_name) ? `${str(d.first_name)} ${str(d.last_name) ?? ""}`.trim() : undefined) ??
          str(d.name) ?? current.name;
        set({
          user: {
            ...current,
            name:        displayName,
            email:       d.email       ?? current.email,
            phone:       d.phone       ?? current.phone,
            address:     d.address     ?? current.address,
            students:    d.students    ?? current.students,
            role:        profile.role  ?? current.role,
            permissions: profile.permissions ?? current.permissions,
            schoolcode:  d.school_code ?? current.schoolcode,
            // schoolImage (Admin's own photo, set via School Profile) takes
            // priority over the staff record's own `image` field.
            image:       profile.schoolImage ?? d.image ?? current.image,
            principalName: profile.principalName ?? current.principalName,
          },
        });
      },

      setPrincipalName: (name) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, principalName: name } });
      },

      setUserImage: (image) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, image } });
      },

      logout: () => {
        set({
          user: null, token: null, userType: null, role: null,
          parent: null, students: [], selectedStudent: null,
        });
        localStorage.removeItem("__auth_meta__");
        localStorage.removeItem("userType");
        localStorage.removeItem("phone");
        localStorage.removeItem("schoolcode");
        localStorage.removeItem("otp");
        localStorage.removeItem("userId");
        localStorage.removeItem("activeChild");
        localStorage.removeItem("schoolName");
        localStorage.removeItem("schoolLogo");
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
        user:            state.user,
        token:           state.token,
        userType:        state.userType,
        role:            state.role,
        parent:          state.parent,
        students:        state.students,
        selectedStudent: state.selectedStudent,
      }),
    }
  )
);

// ── Non-hook selectors (for axios interceptors etc.) ─────────────────────────
export const getAuthToken = () => useAuthStore.getState().token;
export const getTenantId  = () => useAuthStore.getState().user?.schoolcode ?? null;
export const getAuthUser  = () => useAuthStore.getState().user;