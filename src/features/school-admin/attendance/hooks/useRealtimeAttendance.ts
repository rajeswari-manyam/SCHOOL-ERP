import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";

// ── Realtime Updates ──────────────────────────────────────────────────────────
export const useRealtimeAttendance = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const isMock =
      import.meta.env.VITE_SUPABASE_URL === "https://mock.supabase.co";

    if (isMock) return;

    // Attendance channel
    const attendanceChannel = supabase
      .channel("attendance-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance_records" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["attendance"] });
        }
      )
      .subscribe();

    // Holiday channel
    const holidayChannel = supabase
      .channel("holiday-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "holidays" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["attendance", "holidays"],
          });
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      attendanceChannel.unsubscribe();
      holidayChannel.unsubscribe();
    };
  }, [queryClient]);
};