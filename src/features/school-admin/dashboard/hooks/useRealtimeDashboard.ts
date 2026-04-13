import { useState, useEffect, useCallback } from "react";
import type { DashboardData } from "../types/dashboard.types";
import {
  fetchDashboardData,
  sendAttendanceReminder,
  sendBroadcast,
} from "../api/dashboardApi.ts";

interface UseRealtimeDashboardReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  alertVisible: boolean;
  dismissAlert: () => void;
  triggerAttendanceReminder: () => Promise<void>;
  triggerBroadcast: (message: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Central data + state hook for the Dashboard.
 *
 * Handles:
 *  - Initial data fetch
 *  - Realtime subscription (Supabase channel stub — wire up as needed)
 *  - Alert banner visibility
 *  - Action dispatchers (reminders, broadcasts)
 */
export function useRealtimeDashboard(): UseRealtimeDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(true);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    /**
     * TODO: Wire up Supabase Realtime here, e.g.:
     *
     * const channel = supabase
     *   .channel("dashboard-changes")
     *   .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, () => {
     *     loadData();
     *   })
     *   .subscribe();
     *
     * return () => { supabase.removeChannel(channel); };
     */
  }, [loadData]);

  // ── Alert ────────────────────────────────────────────────────────────────────
  const dismissAlert = useCallback(() => setAlertVisible(false), []);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const triggerAttendanceReminder = useCallback(async () => {
    if (!data) return;
    await sendAttendanceReminder(data.alertBannerClasses);
  }, [data]);

  const triggerBroadcast = useCallback(async (message: string) => {
    await sendBroadcast(message);
  }, []);

  return {
    data,
    isLoading,
    error,
    alertVisible,
    dismissAlert,
    triggerAttendanceReminder,
    triggerBroadcast,
    refetch: loadData,
  };
}