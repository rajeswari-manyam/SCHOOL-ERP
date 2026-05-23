export interface PlatformStats {
  totalSchools: number;
  totalSchoolsDelta: number;
  activeSchools: number;
  onTrial: number;
  mrr: number;
  mrrVsLastMonthPct: number;
  usageTodayPct: number;
  usageTodayCount: number;
  usageTodayTotal: number;
}

export type SchoolPlan        = "PRO" | "GROWTH" | "STARTER";
export type AttendanceStatus  = "OK" | "PENDING" | "NONE";
export type SystemHealth      = "HEALTHY" | "WARNING" | "DOWN" | "PENDING";
export type CronStatus        = "OK" | "PENDING" | "ERROR";
export type TicketPriority    = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type TicketStatus      = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface SchoolActivityRow {
  id: string;
  name: string;
  plan: SchoolPlan;
  attendanceStatus: AttendanceStatus;
  feeAlerts: number | null;
  lastActive: string;
}

export interface HealthItem  { label: string; status: SystemHealth; }
export interface CronJob     { label: string; status: CronStatus; }

export interface RecentSchool {
  id: string;
  name: string;
  city: string;
  initials: string;
  plan: SchoolPlan;
  joinedAgo: string;
}

export interface RevenuePoint   { month: string; value: number; }

export interface CriticalTicket {
  id: string;
  ticketId: string;
  school: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAgo: string;
}

export interface SuperAdminDashboardData {
  stats: PlatformStats;
  schoolActivity: SchoolActivityRow[];
  healthItems: HealthItem[];
  cronJobs: CronJob[];
  recentSchools: RecentSchool[];
  revenueHistory: RevenuePoint[];
  criticalTickets: CriticalTicket[];
  requiresAction: number;
}
