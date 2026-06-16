// src/features/auth/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { sendOtp, verifyOtp } from "@/services/auth.api";
import { useAuthStore, USER_TYPE_ROUTE_MAP } from "@/store/authStore";
import type { LoginPayload, OtpVerifyPayload, OtpRouteState } from "../types/auth.types";

// ─────────────────────────────────────────────────────────────────────────────
// useLogin — calls POST /tenant/userlogin, saves userType, navigates to /otp
// ─────────────────────────────────────────────────────────────────────────────
export const useLogin = () => {
  const navigate       = useNavigate();
  const setLoginMeta   = useAuthStore((s) => s.setLoginMeta);

  return useMutation({
    mutationFn: (payload: LoginPayload) => sendOtp(payload),

    onSuccess: (data, variables) => {
      if (!data.status) {
        toast.error(data.message ?? "Failed to send OTP");
        return;
      }

      // ✅ Save userType in Zustand + localStorage immediately after login API
      setLoginMeta(data.userType, variables.phone, variables.schoolcode);
      toast.success(data.message ?? "OTP sent successfully!");

      const otpState: OtpRouteState = {
        phone:      variables.phone,
        schoolcode: variables.schoolcode,
        userType:   data.userType,
        otp: import.meta.env.DEV ? data.otp : undefined,
      };

      navigate("/otp", { state: otpState });
    },

    onError: (error: Error) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        error.message ??
        "Something went wrong";
      toast.error(msg);
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// useVerifyOtp — calls POST /tenant/otpverify, sets session, redirects by role
// ─────────────────────────────────────────────────────────────────────────────
export const useVerifyOtp = () => {
  const navigate  = useNavigate();
  const setAuth   = useAuthStore((s) => s.setAuth);
  const userType  = useAuthStore((s) => s.userType);

  return useMutation({
    mutationFn: (payload: OtpVerifyPayload) => verifyOtp(payload),

    onSuccess: (data, variables) => {
      if (!data.status) {
        toast.error(data.message ?? "Invalid OTP");
        return;
      }

      const resolvedUser = data.user ?? {
        id:         `user-${variables.phone}`,
        name:       "User",
        phone:      variables.phone,
        userType:   userType!,
        schoolcode: variables.schoolcode,
      };

      const resolvedToken = data.token ?? `token-${Date.now()}`;

      // ✅ Persist full session to Zustand + localStorage
      setAuth(resolvedUser, resolvedToken);
      toast.success("Login successful!");

      // ✅ Redirect to correct dashboard based on userType
      const redirectPath = USER_TYPE_ROUTE_MAP[resolvedUser.userType] ?? "/login";
      navigate(redirectPath, { replace: true });
    },

    onError: (error: Error) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        error.message ??
        "OTP verification failed";
      toast.error(msg);
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// useLogout
// ─────────────────────────────────────────────────────────────────────────────
export const useLogout = () => {
  const navigate = useNavigate();
  const logout   = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return { logout: handleLogout };
};
