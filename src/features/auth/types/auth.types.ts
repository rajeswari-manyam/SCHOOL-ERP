// src/features/auth/types/auth.types.ts

export type UserType =
  | "Teacher"
  | "SchoolAdmin"
  | "SuperAdmin"
  | "Admin"
  | "Accountant"
  | "Parent"
  | "Student";

// ── Login API ──────────────────────────────────────────────────────────────────
export interface LoginPayload {
  schoolcode: string;
  phone: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  userType: UserType;
  otp: string; // dev: returned by API; prod: sent via SMS
}

// ── OTP Verify API ─────────────────────────────────────────────────────────────
export interface OtpVerifyPayload {
  schoolcode: string;
  phone: string;
  otp: string;
}

// ── Parent Portal — multi-student support ───────────────────────────────────────
export interface Parent {
  id: string;
  parent_name: string;
  email: string;
  phone: string;
  school_id: string;
}

export interface Student {
  id: string;
  name: string;
  roll_number: string;
  class_id: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  academicYearId?: string;
  academicYear?: {
    id: string;
    yearName: string;
  };
}

export interface OtpVerifyResponse {
  status: boolean;
  message: string;

  token?: string;
  userId?: string;
  userType?: string;
  email?: string;
  name?: string;

  role?: Role;
  permissions?: Permission[];

  data?: {
    id: string;
    first_name: string;
    last_name: string;
    roll_number: string;
    admission_number: string;
    class: string;
    section: string;
    school_code: string;
  };

  user?: {
    id: string;
    name: string;
    phone: string;
    userType: UserType;
    schoolcode: string;
  };

  // Present when userType is Parent
  parent?: Parent;
  students?: Student[];
}

// ── Logout API ──────────────────────────────────────────────────────────────────
export interface LogoutResponse {
  status: boolean;
  message: string;
}

// ── Get User By ID ─────────────────────────────────────────────────────────────
export interface Permission {
  module: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
}

export interface GetUserByIdResponse {
  status: boolean;
  userType: string;
  role: Role;
  permissions: Permission[];
  // Present for Admin/SchoolAdmin — the school's own profile fields
  principalName?: string;
  schoolImage?: string | null;
  schoolLogo?: string | null;
  data: {
    // Common
    id: string;
    email?: string;
    phone?: string;
    school_id?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;

    // Parent-specific
    parent_name?: string;
    relation?: string;
    occupation?: string;
    address?: string;
    students?: { id: string; name: string }[];

    // Teacher / Admin / Accountant / Student-specific
    name?: string;
    first_name?: string;
    last_name?: string;
    teacher_name?: string;
    admin_name?: string;
    accountant_name?: string;
    student_name?: string;

    // Student-specific
    roll_number?: string;
    admission_number?: string;
    class?: string;
    section?: string;
    class_id?: string;
    section_id?: string;
    school_code?: string;
    image?: string | null;
  };
}

// ── Auth Session (stored in Zustand + localStorage) ────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  schoolcode?: string;
  // Parent-specific
  students?: { id: string; name: string }[];
  // Student-specific
  class_id?: string;
  section_id?: string;
}

// Full auth user stored in Zustand
export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  userType: UserType;
  schoolcode: string;
  principalName?: string;
  studentId?: string;
  class_id?: string;
  section_id?: string;
  permissions?: Permission[];
  role?: Role;
  students?: { id: string; name: string }[];
  image?: string | null;
}

// ── Login Step State ───────────────────────────────────────────────────────────
export type LoginStep = "credentials" | "otp";

// Transient state passed from LoginPage → OtpPage via router state
export interface OtpRouteState {
  phone: string;
  schoolcode: string;
  userType: UserType;
  otp?: string; // only present in dev builds
}