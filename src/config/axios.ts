
import axios from "axios";
import { getAuthToken, getTenantId, useAuthStore } from "@/store/authStore";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _skipLogoutOn401?: boolean;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://192.168.1.6:4000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use(
  (config) => {
    const token    = getAuthToken();
    const tenantId = getTenantId();
    config.headers = config.headers ?? {};
    if (token)    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    if (tenantId) (config.headers as Record<string, string>)["X-Tenant-Id"] = tenantId;
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?._skipLogoutOn401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
export { api as axiosInstance };
