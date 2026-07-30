import axios from "@/config/axios";
import type { SuperAdminDashboardData } from "@/features/super-admin/dashboard/types/dashboard.types";

const JOB_LABELS: Record<string, string> = {
  feeReminder: "Fee Reminders",
  attendanceCheck: "Attendance Check",
  monthlyReport: "Monthly Report",
  subscriptionCheck: "Subscription Check",
};

const mapDashboard = (raw: any): SuperAdminDashboardData => {
  const overview = raw?.overviewCards ?? {};
  const health = raw?.platformHealth ?? {};
  const scheduledJobs: Record<string, { status: string; lastRun: string | null }> = health.scheduledJobs ?? {};
  const criticalTickets = Array.isArray(raw?.criticalTickets) ? raw.criticalTickets : [];

  return {
    stats: {
      totalSchools: overview.totalSchools ?? 0,
      activeSchools: overview.activeSchools ?? 0,
      monthlyRevenue: overview.monthlyRevenue ?? 0,
      usageToday: overview.usageToday ?? "0%",
    },
    schoolActivity: (raw?.schoolActivity ?? []).map((s: any) => ({
      id: s.schoolId,
      name: s.schoolName,
      plan: s.subscriptionPlan,
      attendanceMarked: !!s.attendanceMarked,
      feeAlerts: !!s.feeAlerts,
      lastActive: s.lastActive,
    })),
    healthItems: [
      { label: "API Server", status: health.apiServer?.status ?? "unknown" },
      { label: "Workflow Status", status: health.workflowStatus?.status ?? "unknown" },
      { label: "WhatsApp Gateway", status: health.whatsappGateway?.status ?? "unknown" },
      { label: "Database", status: health.database?.status ?? "unknown" },
    ],
    cronJobs: Object.entries(scheduledJobs).map(([key, job]) => ({
      label: JOB_LABELS[key] ?? key,
      status: job?.status ?? "unknown",
      lastRun: job?.lastRun ?? null,
    })),
    recentSchools: (raw?.recentSchools ?? []).map((s: any) => ({
      id: s.schoolId,
      name: s.schoolName,
      location: typeof s.location === "string" ? s.location.trim() : "",
      plan: s.subscriptionPlan,
      createdAt: s.createdAt,
    })),
    revenueHistory: (raw?.revenueGrowth ?? []).map((r: any) => ({
      month: r.month,
      value: r.total,
      count: r.count,
    })),
    criticalTickets,
    requiresAction: criticalTickets.length,
  };
};

export const dashboardApi = {
  getDashboard: async (): Promise<SuperAdminDashboardData> => {
    try {
      const { data } = await axios.get("/organization/superadmindashboard");
      return mapDashboard(data?.data ?? data);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Failed to load dashboard";
      throw new Error(message);
    }
  },
};
