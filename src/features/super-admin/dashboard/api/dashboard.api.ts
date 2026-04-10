import type { PlatformStats, SchoolHealth, RevenueData, CronJobStatus } from "../types/dashboard.types";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const fetchPlatformStats = async (): Promise<PlatformStats> => {
  await delay();
  return {
    totalSchools:            47,
    activeSchools:           44,
    totalStudents:           18420,
    totalTeachers:           940,
    totalRevenue:            5840000,
    monthlyRevenue:          420000,
    pendingPayments:         138000,
    expiringSubscriptions:   5,
  };
};

export const fetchSchoolHealthList = async (): Promise<SchoolHealth[]> => {
  await delay();
  return [
    { schoolId: "s1", schoolName: "Hanamkonda Public School", status: "healthy",  studentCount: 820,  lastActivity: "2026-04-09T10:30:00Z" },
    { schoolId: "s2", schoolName: "Warangal Central School",  status: "warning",  studentCount: 530,  lastActivity: "2026-04-08T14:15:00Z" },
    { schoolId: "s3", schoolName: "Manyam Model School",       status: "healthy",  studentCount: 1240, lastActivity: "2026-04-09T09:00:00Z" },
    { schoolId: "s4", schoolName: "Karimnagar High School",    status: "critical", studentCount: 210,  lastActivity: "2026-04-06T08:45:00Z" },
    { schoolId: "s5", schoolName: "Nizamabad Scholars",        status: "healthy",  studentCount: 670,  lastActivity: "2026-04-09T11:20:00Z" },
  ];
};

export const fetchRevenueData = async (): Promise<RevenueData[]> => {
  await delay();
  return [
    { month: "Nov", revenue: 320000 },
    { month: "Dec", revenue: 380000 },
    { month: "Jan", revenue: 410000 },
    { month: "Feb", revenue: 390000 },
    { month: "Mar", revenue: 430000 },
    { month: "Apr", revenue: 420000 },
  ];
};

export const fetchCronStatus = async (): Promise<CronJobStatus[]> => {
  await delay();
  return [
    { name: "Fee Reminder",       status: "idle",    lastRun: "2026-04-09T06:00:00Z", nextRun: "2026-04-10T06:00:00Z" },
    { name: "Attendance Sync",    status: "running", lastRun: "2026-04-09T10:00:00Z" },
    { name: "Report Generation",  status: "idle",    lastRun: "2026-04-08T22:00:00Z", nextRun: "2026-04-09T22:00:00Z" },
    { name: "WhatsApp Broadcast", status: "failed",  lastRun: "2026-04-09T08:30:00Z" },
  ];
};
