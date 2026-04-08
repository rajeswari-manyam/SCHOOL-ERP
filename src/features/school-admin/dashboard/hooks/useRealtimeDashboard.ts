import { useEffect } from "react";
import { supabase } from "@/config/supabase";
import { queryClient } from "@/config/queryClient";

export const useRealtimeDashboard = () => {
  useEffect(() => {
    const channel = supabase
      .channel("dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dashboard_stats" },
        (payload) => {
          queryClient.invalidateQueries(["dashboard-stats"]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};
