// src/features/auth/types/auth.types.ts

export type UserType =
  | "Teacher"
  | "SchoolAdmin"
  | "SuperAdmin"
  | "Admin"
  | "Accountant"
  | "Parent"
  | "Student";

// ── Login API ──────────────────────────────────────
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

// ── OTP Verify API ─────────────────────────────────
export interface OtpVerifyPayload {
  schoolcode: string;
  phone: string;
  otp: string;
}

export interface OtpVerifyResponse {
  status: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    phone: string;
    userType: UserType;
    schoolcode: string;
  };
}

// ── Auth Session (stored in Zustand + localStorage) ─
export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  userType: UserType;
  schoolcode: string;
}

// ── Login Step State ───────────────────────────────
export type LoginStep = "credentials" | "otp";

// Transient state passed from LoginPage → OtpPage via router state
export interface OtpRouteState {
  phone: string;
  schoolcode: string;
  userType: UserType;
  otp?: string; // only present in dev builds
}
