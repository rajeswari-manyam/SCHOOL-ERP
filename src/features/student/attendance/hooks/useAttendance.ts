// src/features/attendance/hooks/useAttendance.ts

import { useState, useEffect, useCallback } from "react";
import {
  getMonthlyAttendance,
  getYearlyAttendance,
} from "../../../../services/attendance.api";
import type { AttendanceData, AttendanceDay } from "../types/Attendance.types";

interface UseAttendanceOptions {
  studentId: string;
  month: number;  // 0-indexed (0 = January)
  year: number;
  classId?: string;
  sectionId?: string;
  academicYearId?: string;
}

export const useAttendance = (options: UseAttendanceOptions) => {
  const { studentId, month, year, classId, sectionId, academicYearId } = options;

  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async () => {
    if (!studentId) return;

    setLoading(true);
    setError(null);

    try {
      const monthlyPromise = getMonthlyAttendance({ studentId, month: month + 1, year });

      const yearlyPromise = (classId && sectionId && academicYearId)
        ? getYearlyAttendance({ studentId, year, class_id: classId, section_id: sectionId, academicYearId })
        : Promise.resolve(null);

      const [monthlyRes, yearlyRes] = await Promise.all([monthlyPromise, yearlyPromise]);

      const summary = monthlyRes?.summary;

      const presentDates: string[] = summary?.present_dates ?? [];
      const absentDates: string[] = summary?.absent_dates ?? [];

      const days: AttendanceDay[] = [
        ...presentDates.map((date: string): AttendanceDay => ({
          date,
          status: "present",
        })),
        ...absentDates.map((date: string): AttendanceDay => ({
          date,
          status: "absent",
        })),
      ];

      const totalDays = summary?.total ?? 0;
      const presentDays = summary?.present ?? 0;
      const absentDays = summary?.absent ?? 0;
      const monthPercentage =
        totalDays > 0 ? parseFloat(((presentDays / totalDays) * 100).toFixed(1)) : 0;

      let yearPresent = 0;
      let yearAbsent = 0;
      let yearTotal = 0;
      let yearPercentage = 0;

      if (yearlyRes?.summary) {
        yearPresent = yearlyRes.summary.present ?? 0;
        yearAbsent = yearlyRes.summary.absent ?? 0;
        yearTotal = yearlyRes.summary.total ?? 0;
      } else if (yearlyRes?.records) {
        const records: any[] = yearlyRes.records;
        yearPresent = records.filter(
          (r: any) => r.status !== "absent" && r.status !== "Absent" &&
            r.status !== "holiday" && r.status !== "Holiday"
        ).length;
        yearAbsent = records.filter(
          (r: any) => r.status === "absent" || r.status === "Absent"
        ).length;
        yearTotal = yearPresent + yearAbsent;
      }
      yearPercentage =
        yearTotal > 0 ? parseFloat(((yearPresent / yearTotal) * 100).toFixed(1)) : 0;

      const assembled: AttendanceData = {
        studentName: "Student",
        className: "—",
        academicYear: `${year - 1}-${String(year).slice(2)}`,
        month: {
          totalDays,
          presentDays,
          absentDays,
          percentage: monthPercentage,
        },
        year: {
          totalDays: yearTotal,
          presentDays: yearPresent,
          absentDays: yearAbsent,
          percentage: yearPercentage,
        },
        days,
      };

      setData(assembled);
    } catch (err: any) {
      console.error("[useAttendance] fetch failed:", err);
      setError(err?.message ?? "Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  }, [studentId, month, year, classId, sectionId, academicYearId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return { data, loading, error, refetch: fetchAttendance };
};