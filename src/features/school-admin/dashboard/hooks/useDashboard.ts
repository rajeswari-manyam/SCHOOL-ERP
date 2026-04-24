import { useEffect, useState } from "react";
import { getDashboardData } from "../api/dashboard.api";
import type {
  Attendance,
  Defaulter,
  Activity,
  PipelineItem,
  QuickAction,
} from "../types/dashboard.types";

interface DashboardData {
  attendanceData: Attendance[];
  defaulters: Defaulter[];
  whatsappActivity: Activity[];
  pipeline: PipelineItem[];
  quickActions: QuickAction[];
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  return { data };
};
