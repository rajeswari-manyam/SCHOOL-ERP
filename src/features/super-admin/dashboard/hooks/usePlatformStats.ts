import { useQuery } from "@tanstack/react-query";
import { fetchPlatformStats, fetchSchoolHealthList, fetchRevenueData, fetchCronStatus } from "../api/dashboard.api";

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ["super-admin-platform-stats"],
    queryFn: fetchPlatformStats,
  });
};

export const useSchoolHealthList = () => {
  return useQuery({
    queryKey: ["super-admin-school-health"],
    queryFn: fetchSchoolHealthList,
  });
};

export const useRevenueData = () => {
  return useQuery({
    queryKey: ["super-admin-revenue"],
    queryFn: fetchRevenueData,
  });
};

export const useCronStatus = () => {
  return useQuery({
    queryKey: ["super-admin-cron-status"],
    queryFn: fetchCronStatus,
    refetchInterval: 60000,
  });
};
