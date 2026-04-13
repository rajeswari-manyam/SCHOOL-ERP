import { useState, useEffect, useCallback } from "react";
import type { AttendancePageData } from "../types/attendance.types";
import { fetchAttendanceData, sendReminderToUnmarked, exportAttendanceCSV } from "../api/attendance.api";

interface UseAttendanceReturn {
  data: AttendancePageData | null;
  isLoading: boolean;
  error: string | null;
  bannerVisible: boolean;
  dismissBanner: () => void;
  sendReminder: () => Promise<void>;
  exportCSV: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useAttendance(): UseAttendanceReturn {
  const [data, setData] = useState<AttendancePageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAttendanceData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load attendance data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const dismissBanner = useCallback(() => setBannerVisible(false), []);

  const sendReminder = useCallback(async () => {
    if (!data) return;
    const unmarkedClasses = data.rows
      .filter((row) => row.status === "NOT_MARKED")
      .map((row) => row.id);
    await sendReminderToUnmarked(unmarkedClasses);
  }, [data]);

  const exportCSV = useCallback(async () => {
    if (!data) return;
    await exportAttendanceCSV(data.date);
  }, [data]);

  return {
    data,
    isLoading,
    error,
    bannerVisible,
    dismissBanner,
    sendReminder,
    exportCSV,
    refetch: loadData,
  };
}