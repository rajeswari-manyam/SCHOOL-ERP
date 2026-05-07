import { useState, useEffect } from "react";
import { attendanceMock } from "../data/attendance.mock";
import type { AttendanceData } from "../types/attendance.types";

export const useAttendance = () => {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(attendanceMock);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
};