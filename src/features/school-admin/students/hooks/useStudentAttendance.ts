import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getMonthlyAttendance,
  getYearlyAttendance,
  getStudentTodayAttendance,
  type MonthlyAttendanceResponse,
  type YearlyAttendanceResponse,
  type StudentTodayAttendanceResponse,
} from "@/services/attendance.api";
import { useUIStore } from "@/store/uiStore";
import type { Student } from "../types/student.types";

const attendanceKeys = {
  today: (studentId: string) => ["student-attendance", "today", studentId] as const,
  monthly: (studentId: string, month: number, year: number) =>
    ["student-attendance", "monthly", studentId, month, year] as const,
  yearly: (
    studentId: string,
    year: number,
    classId: string,
    sectionId: string,
    academicYearId: string
  ) => ["student-attendance", "yearly", studentId, year, classId, sectionId, academicYearId] as const,
};

/**
 * @param student     The student whose attendance is being viewed.
 * @param activeTab   Which tab of the Student Profile page is currently open.
 *                     All three attendance calls only matter while the
 *                     "attendance" tab is visible, so they're gated behind
 *                     `enabled` — opening the profile on another tab (e.g.
 *                     Overview) no longer fires any of these requests.
 */
export const useStudentAttendance = (student: Student | null, activeTab: string) => {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-12
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const studentId = student?.id ?? "";
  const isAttendanceTab = activeTab === "attendance";
  const enabledBase = !!studentId && isAttendanceTab;

  const todayQuery = useQuery({
    queryKey: attendanceKeys.today(studentId),
    queryFn: async (): Promise<StudentTodayAttendanceResponse | null> => {
      const res = await getStudentTodayAttendance(studentId);
      return res?.status ? res : null;
    },
    enabled: enabledBase,
  });

  // Also needed by the Overview tab's "Attendance this month" quick-stat —
  // unlike today/yearly (Attendance-tab-only), this one is genuinely shared
  // across two tabs, so it stays enabled for both rather than being starved
  // on Overview the way a strict per-tab gate would leave it.
  const monthlyQuery = useQuery({
    queryKey: attendanceKeys.monthly(studentId, viewMonth, viewYear),
    queryFn: async (): Promise<MonthlyAttendanceResponse | null> => {
      const res = await getMonthlyAttendance({ studentId, month: viewMonth, year: viewYear });
      return res?.status ? res : null;
    },
    enabled: !!studentId && (activeTab === "attendance" || activeTab === "overview"),
  });

  const classId = student?.classId ?? "";
  const sectionId = student?.sectionId ?? "";
  // Matches the original: prefer the student's own academicYearId, falling
  // back to a one-off (non-reactive) read of the UI store's current value.
  const academicYearId = student?.academicYearId || useUIStore.getState().academicYearId || "";
  const canFetchYearly = enabledBase && !!classId && !!sectionId && !!academicYearId;

  const yearlyQuery = useQuery({
    queryKey: attendanceKeys.yearly(studentId, viewYear, classId, sectionId, academicYearId),
    queryFn: async (): Promise<YearlyAttendanceResponse | null> => {
      const res = await getYearlyAttendance({
        studentId,
        year: viewYear,
        class_id: classId,
        section_id: sectionId,
        academicYearId,
      });
      return res?.status ? res : null;
    },
    enabled: canFetchYearly,
  });

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  return {
    todayData: todayQuery.data ?? null,
    todayLoading: todayQuery.isLoading,
    monthlyData: monthlyQuery.data ?? null,
    yearlyData: yearlyQuery.data ?? null,
    viewMonth,
    viewYear,
    monthlyLoading: monthlyQuery.isLoading,
    yearlyLoading: yearlyQuery.isLoading,
    prevMonth,
    nextMonth,
  };
};
