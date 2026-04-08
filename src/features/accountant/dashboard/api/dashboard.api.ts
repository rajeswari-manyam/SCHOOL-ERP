import { axios } from "@/config/axios";
import { AccountantDashboardStats } from "../types/dashboard.types";

export const fetchAccountantDashboardStats =
  async (): Promise<AccountantDashboardStats> => {
    const { data } = await axios.get("/accountant/dashboard/stats");
    return data;
  };
