export interface PlatformStats {
  totalSchools: number;
  activeSchools: number;
  monthlyRevenue: number;
  usageToday: string;
}

export interface SchoolActivityRow {
  id: string;
  name: string;
  plan: string;
  attendanceMarked: boolean;
  feeAlerts: boolean;
  lastActive: string;
}

export interface PlatformHealthStatus {
  label: string;
  status: string;
}

export interface ScheduledJobStatus {
  label: string;
  status: string;
  lastRun: string | null;
}

export interface RecentSchool {
  id: string;
  name: string;
  location: string;
  plan: string;
  createdAt: string;
}

export interface RevenuePoint {
  month: string;
  value: number;
  count: number;
}

export interface CriticalTicket {
  id?: string;
  ticketId?: string;
  school?: string;
  subject?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
}

export interface SuperAdminDashboardData {
  stats: PlatformStats;
  schoolActivity: SchoolActivityRow[];
  healthItems: PlatformHealthStatus[];
  cronJobs: ScheduledJobStatus[];
  recentSchools: RecentSchool[];
  revenueHistory: RevenuePoint[];
  criticalTickets: CriticalTicket[];
  requiresAction: number;
}
