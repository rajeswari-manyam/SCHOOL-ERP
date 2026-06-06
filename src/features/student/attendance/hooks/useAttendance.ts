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
}

export const useAttendance = (options: UseAttendanceOptions) => {
  const { studentId, month, year } = options;

  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async () => {
    if (!studentId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch monthly and yearly attendance in parallel
      const [monthlyRes, yearlyRes] = await Promise.all([
        getMonthlyAttendance({ studentId, month: month + 1, year }), // API uses 1-indexed months
        getYearlyAttendance({ studentId, year }),
      ]);

      // ── Map monthly records → AttendanceDay[] ──────────────────────────
     const days: AttendanceDay[] = (monthlyRes?.records ?? []).map(
        (record: any): AttendanceDay => ({
          date: record.date,
          // API statuses: "present" | "absent" | "late" → map "late" → "present"
        status:
  record.status === "absent" || record.status === "Absent"
    ? "absent"
    : record.status === "holiday" || record.status === "Holiday"
    ? "holiday"
    : "present",
          whatsappTime: record.whatsappAlertTime ?? undefined,
        })
      );

      // ── Derive monthly summary from records ────────────────────────────
      const presentDays = days.filter((d) => d.status === "present").length;
      const absentDays = days.filter((d) => d.status === "absent").length;
      const totalDays = presentDays + absentDays;
      const monthPercentage =
        totalDays > 0 ? parseFloat(((presentDays / totalDays) * 100).toFixed(1)) : 0;

   const yearlyRecords: any[] = yearlyRes?.records ?? [];
      
    const yearPresent = yearlyRecords.filter(
  (r: any) =>
    r.status !== "absent" && r.status !== "Absent" &&
    r.status !== "holiday" && r.status !== "Holiday"
).length;
const yearAbsent = yearlyRecords.filter(
  (r: any) => r.status === "absent" || r.status === "Absent"
).length;
      const yearTotal = yearPresent + yearAbsent;
      const yearPercentage =
        yearTotal > 0 ? parseFloat(((yearPresent / yearTotal) * 100).toFixed(1)) : 0;

      // ── Grab student meta from first available record ──────────────────
      const firstRecord = monthlyRes?.records?.[0] ?? yearlyRes?.records?.[0];

      const assembled: AttendanceData = {
        studentName: firstRecord?.studentName ?? "Student",
        className: firstRecord?.className
          ? `${firstRecord.className}${firstRecord.section ? firstRecord.section : ""}`
          : "—",
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
  }, [studentId, month, year]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return { data, loading, error, refetch: fetchAttendance };
};