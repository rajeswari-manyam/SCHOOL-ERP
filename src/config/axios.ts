import axios from "axios";
import { getAuthToken, getTenantId } from "@/store/authStore";
import { errorHandler } from "@/utils/errorHandler";
import { env } from "./env";

export const api = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  const tenantId = getTenantId();

  if (token) {
    config.headers?.set("Authorization", `Bearer ${token}`);
  }

  if (tenantId) {
    config.headers?.set("X-Tenant-Id", tenantId);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    errorHandler(error);
    return Promise.reject(error);
  },
);

export { api as axios, api as axiosInstance };
export default api;