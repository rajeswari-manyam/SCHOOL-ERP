import axios from "axios";
import { getAuthToken, getTenantId, useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _skipLogoutOn401?: boolean;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://192.168.1.17:4000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
});


api.interceptors.request.use(
  (config) => {
    const token    = getAuthToken();
    const tenantId = getTenantId();
    config.headers = config.headers ?? {};
    const academicYearId = useUIStore.getState().academicYearId;
    // Only force JSON when the body isn't FormData — a hardcoded
    // "application/json" here would make axios silently JSON-stringify
    // FormData uploads instead of sending them as real multipart requests,
    // dropping any attached files with no error.
    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      (config.headers as Record<string, string>)["Content-Type"] = "application/json";
    }
    if (token)          (config.headers as Record<string, string>)["Authorization"]    = `Bearer ${token}`;
    if (tenantId)       (config.headers as Record<string, string>)["X-Tenant-Id"]      = tenantId;
    if (academicYearId) (config.headers as Record<string, string>)["X-Academic-Year"]  = academicYearId;
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