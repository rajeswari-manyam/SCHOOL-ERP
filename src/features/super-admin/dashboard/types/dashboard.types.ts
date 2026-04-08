export interface PlatformStats {
  totalSchools: number;
  activeSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  expiringSubscriptions: number;
}

export interface SchoolHealth {
  schoolId: string;
  schoolName: string;
  status: "healthy" | "warning" | "critical";
  studentCount: number;
  lastActivity: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface CronJobStatus {
  name: string;
  status: "running" | "idle" | "failed";
  lastRun: string;
  nextRun?: string;
}
