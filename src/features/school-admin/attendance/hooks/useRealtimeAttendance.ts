import { useEffect } from "react";

export const useRealtimeAttendance = (date: string) => {
  useEffect(() => {
    // Realtime attendance disabled in mock mode.
    console.log(`Mock mode: simulate realtime tracking for date = ${date}`);
  }, [date]);
};
