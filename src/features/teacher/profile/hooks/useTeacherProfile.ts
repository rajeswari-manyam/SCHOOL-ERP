import { useCallback, useEffect, useState } from "react";
import { getStaffById, type StaffRecord } from "@/services/staff.api";
import { leaveApi } from "@/services/teacher-leave.api";
import type { LeaveBalance } from "@/features/teacher/leave/types/leave.types";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

export interface TeacherLeaveBalances {
  balances: LeaveBalance[];
  totalAllocated: number;
  totalUsed: number;
  totalBalance: number;
}

export const useTeacherProfile = () => {
  const user = useAuthStore((s) => s.user);
  const staffId = localStorage.getItem("teacherStaffId") || user?.id || "";
  const academicYearId = useUIStore((s) => s.academicYearId);

  const [staff, setStaff] = useState<StaffRecord | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<TeacherLeaveBalances | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!staffId) {
      setError("No staff ID found. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [staffRes, balResult] = await Promise.all([
        getStaffById(staffId),
        leaveApi.getLeaveBalances(staffId, academicYearId),
      ]);
      if (staffRes?.status) setStaff(staffRes.data);
      setLeaveBalances(balResult);
    } catch (err: unknown) {
      const anyErr = err as { response?: { data?: { message?: string } }; message?: string };
      setError(anyErr?.response?.data?.message ?? anyErr?.message ?? "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [staffId, academicYearId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { user, staff, leaveBalances, loading, error, reload: loadData };
};
