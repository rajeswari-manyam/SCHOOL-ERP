import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { loginWithEmail, loginWithPhone } from "../api/auth.api";
import type { LoginEmailPayload, LoginPhonePayload } from "../types/auth.types";
import { setToken } from "../utils/token.utils";

export const useAuth = () => {
  const { setAuth, logout } = useAuthStore();

  const emailLogin = useMutation({
    mutationFn: async (data: LoginEmailPayload) => {
      const res = await loginWithEmail(data);
      setToken(res.token);
      setAuth(res.user, res.token);
      return res.user;
    },
  });

  const phoneLogin = useMutation({
    mutationFn: async (data: LoginPhonePayload) => {
      const res = await loginWithPhone(data);
      setToken(res.token);
      setAuth(res.user, res.token);
      return res.user;
    },
  });

  return { emailLogin, phoneLogin, logout };
};