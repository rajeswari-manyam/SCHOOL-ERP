import { useEffect } from "react";

export const useRealtimeDashboard = () => {
  useEffect(() => {
    // Realtime dashboard updates disabled in mock mode.
    console.log("Mock mode: simulate realtime dashboard updates");
  }, []);
};
