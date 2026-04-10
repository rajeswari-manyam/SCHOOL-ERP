import { stats } from "../data/dashboard.data"; // ✅ ADD THIS
import {
  attendanceData,
  feeData,
  categoryData,
} from "../data/chart.data";

export const useDashboard = () => {
  return {
    stats, // ✅ NOW WORKS
    attendanceData,
    feeData,
    categoryData,
  };
};