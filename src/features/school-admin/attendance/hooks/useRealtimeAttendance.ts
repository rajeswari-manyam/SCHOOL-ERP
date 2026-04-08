import { useEffect } from "react";
import { supabase } from "@/config/supabase";
import { queryClient } from "@/config/queryClient";

export const useRealtimeAttendance = (date: string) => {
  useEffect(() => {
    const channel = supabase
      .channel("attendance")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
          filter: `date=eq.${date}`,
        },
        () => {
          queryClient.invalidateQueries(["attendance", date]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [date]);
};
