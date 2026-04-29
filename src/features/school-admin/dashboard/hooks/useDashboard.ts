import { useEffect, useState } from "react";
import { fetchDashboardData } from "../api/dashboardApi";
import type {
  AttendanceSummary,
  FeeDefaulter,
  WhatsAppActivity,
  pipelineItem,
  QuickAction,
} from "../types/dashboard.types";

interface DashboardData {
  attendanceData: AttendanceSummary[];
  defaulters: FeeDefaulter[];
  whatsappActivity: WhatsAppActivity[];
  pipeline: pipelineItem[];
  quickActions: QuickAction[];
}

export const useDashboard = () => {
  const [data, ] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData().then();
  }, []);

  return { data };
};
