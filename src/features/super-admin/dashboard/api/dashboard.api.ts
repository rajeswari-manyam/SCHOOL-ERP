import axios from "axios";
import { PlatformStats, SchoolHealth, RevenueData, CronJobStatus } from "../types/dashboard.types";

export const fetchPlatformStats = async (): Promise<PlatformStats> => {
  const { data } = await axios.get("/super-admin/dashboard/stats");
  return data;
};

export const fetchSchoolHealthList = async (): Promise<SchoolHealth[]> => {
  const { data } = await axios.get("/super-admin/dashboard/school-health");
  return data;
};

export const fetchRevenueData = async (): Promise<RevenueData[]> => {
  const { data } = await axios.get("/super-admin/dashboard/revenue");
  return data;
};

export const fetchCronStatus = async (): Promise<CronJobStatus[]> => {
  const { data } = await axios.get("/super-admin/dashboard/cron-status");
  return data;
};
