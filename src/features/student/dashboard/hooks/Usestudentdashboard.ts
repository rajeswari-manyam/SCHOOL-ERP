
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentDashboardApi } from "../api/Student dashboard.api";

// ─── Query key factory ──────────────────────────────────────────────────────────
export const STUDENT_DASHBOARD_KEYS = {
  all: ["student"] as const,
  dashboard: () => [...STUDENT_DASHBOARD_KEYS.all, "dashboard"] as const,
  attendance: (year: number, month: number) =>
    [...STUDENT_DASHBOARD_KEYS.all, "attendance", year, month] as const,
  schedule: () => [...STUDENT_DASHBOARD_KEYS.all, "schedule", "today"] as const,
  homeworkWeek: () => [...STUDENT_DASHBOARD_KEYS.all, "homework", "week"] as const,
  recentResults: (limit: number) =>
    [...STUDENT_DASHBOARD_KEYS.all, "results", "recent", limit] as const,
  announcements: (limit: number) =>
    [...STUDENT_DASHBOARD_KEYS.all, "announcements", limit] as const,
};

// ─── Full dashboard ─────────────────────────────────────────────────────────────
export const useStudentDashboard = () =>
  useQuery({
    queryKey: STUDENT_DASHBOARD_KEYS.dashboard(),
    queryFn: studentDashboardApi.getDashboard,
    staleTime: 1000 * 60 * 5,
  });

// ─── Attendance calendar ────────────────────────────────────────────────────────
export const useAttendance = () =>
  useQuery({
    queryKey: STUDENT_DASHBOARD_KEYS.attendance(2024, 4),
    queryFn: () => studentDashboardApi.getAttendance(),
    staleTime: 1000 * 60 * 10,
  });

// ─── Today's schedule ───────────────────────────────────────────────────────────
export const useTodaySchedule = () =>
  useQuery({
    queryKey: STUDENT_DASHBOARD_KEYS.schedule(),
    queryFn: studentDashboardApi.getTodaySchedule,
    staleTime: 1000 * 60 * 60, // schedule rarely changes intra-day
  });

// ─── Homework week ──────────────────────────────────────────────────────────────
export const useHomeworkWeek = () =>
  useQuery({
    queryKey: STUDENT_DASHBOARD_KEYS.homeworkWeek(),
    queryFn: studentDashboardApi.getHomeworkWeek,
    staleTime: 1000 * 60 * 5,
  });

// ─── Recent results ─────────────────────────────────────────────────────────────
export const useRecentResults = (limit = 5) =>
  useQuery({
    queryKey: STUDENT_DASHBOARD_KEYS.recentResults(limit),
    queryFn: () => studentDashboardApi.getRecentResults(limit),
    staleTime: 1000 * 60 * 15,
  });

// ─── Announcements ─────────────────────────────────────────────────────────────
export const useAnnouncements = (limit = 5) =>
  useQuery({
    queryKey: STUDENT_DASHBOARD_KEYS.announcements(limit),
    queryFn: () => studentDashboardApi.getAnnouncements(limit),
    staleTime: 1000 * 60 * 5,
  });

// ─── Homework brief download ────────────────────────────────────────────────────
export const useDownloadHomeworkBrief = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const download = async (id: string, subject: string, title: string) => {
    setLoadingId(id);
    try {
      const blob = await studentDashboardApi.downloadHomeworkBrief(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${subject}-${title}`.replace(/\s+/g, "-").toLowerCase() + ".pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoadingId(null);
    }
  };

  return { download, loadingId };
};