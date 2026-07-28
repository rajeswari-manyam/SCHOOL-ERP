import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { getMonthlyStaffAttendance } from "@/services/attendance.api";
import type { AttendanceDayRecord, AttendanceSummary } from "../types/attendance.types";

export const useMonthlyAttendance = () => {
  const user = useAuthStore((s) => s.user);
  const staffId = user?.id ?? "";
  const schoolCode = user?.schoolcode ?? "";

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: apiData, isLoading, isError, refetch } = useQuery({
    queryKey: ["accountant", "monthly-attendance", staffId, month, year],
    queryFn: () =>
      getMonthlyStaffAttendance({
        staff_id: staffId,
        month,
        year,
        school_code: schoolCode,
      } as any),
    enabled: !!staffId,
    staleTime: 1000 * 60 * 5,
  });

  const records: AttendanceDayRecord[] = useMemo(
    () => apiData?.records ?? [],
    [apiData],
  );

  const summary: AttendanceSummary | null = useMemo(
    () => apiData?.summary ?? null,
    [apiData],
  );

  const recordsByDate = useMemo(() => {
    const map: Record<string, AttendanceDayRecord> = {};
    for (const r of records) {
      map[r.date] = r;
    }
    return map;
  }, [records]);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  };

  return {
    month,
    year,
    records,
    summary,
    recordsByDate,
    isLoading,
    isError,
    refetch,
    prevMonth,
    nextMonth,
    goToToday,
  };
};
