import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllAttendance,
  getAllClassesTodayAttendance,
  getClassTodayAttendance,
  getClassAttendanceByDate,
  getStudentsByClassSection,
  createAttendance,
  updateAttendanceById,
  updateStaffAttendanceById,
  deleteStaffAttendanceById,
  createStaffAttendance,
  getAllStaffAttendance,
  getAbsentMoreThan5Days,
  type CreateAttendancePayload,
  type UpdateAttendancePayload,
  type UpdateStaffAttendancePayload,
  type CreateStaffAttendancePayload as ApiCreateStaffAttendancePayload,
} from "../../../../services/attendance.api";
import {
  getAllHolidays,
  createHoliday,
  type CreateHolidayPayload,
} from "../../../../services/holidays.api";
import { getAllClasses, getSectionsByClassId } from "../../../../services/class.api";
import { fetchStaff } from "../../../../services/school-staff.api";
import { getAuthUser } from "../../../../store/authStore";
import { useAttendanceStore } from "../store";
import type {
  AttendanceHistory,
  AttendanceDay,
  GetAllClassesTodayAttendanceResponse,
  GetClassTodayAttendanceResponse,
  CreateStaffAttendancePayload,
} from "../types/attendance.types";

export const attendanceKeys = {
  all: ["attendance"] as const,
  today: (className: string, section: string) =>
    [...attendanceKeys.all, "today", className, section] as const,
  allClassesToday: () => [...attendanceKeys.all, "allClassesToday"] as const,
  classToday: (classId: string, sectionId: string) =>
    [...attendanceKeys.all, "classToday", classId, sectionId] as const,
  history: (from: string, to: string, cls: string) =>
    [...attendanceKeys.all, "history", from, to, cls] as const,
  holidays: () => [...attendanceKeys.all, "holidays"] as const,
  classes:  () => [...attendanceKeys.all, "classes"]  as const,
  sections: (classId: string) => [...attendanceKeys.all, "sections", classId] as const,
  studentsBySection: (classId: string, sectionId: string) =>
    [...attendanceKeys.all, "students", classId, sectionId] as const,
};

// ─── Classes ──────────────────────────────────────────────────────────────────
export const useAttendanceClasses = () => {
  return useQuery({
    queryKey: attendanceKeys.classes(),
    queryFn:  () => getAllClasses(),
    staleTime: 5 * 60_000,
  });
};

// ─── Sections by Class ID ─────────────────────────────────────────────────────
export const useAttendanceSections = (classId: string) => {
  return useQuery({
    queryKey: attendanceKeys.sections(classId),
    queryFn:  () => getSectionsByClassId(classId),
    enabled:  !!classId,
    staleTime: 5 * 60_000,
  });
};

// ─── Students by Class + Section ─────────────────────────────────────────────
export const useStudentsByClassSection = (classId: string, sectionId: string) => {
  return useQuery({
    queryKey: attendanceKeys.studentsBySection(classId, sectionId),
    queryFn:  () => getStudentsByClassSection(classId, sectionId),
    enabled:  !!classId && !!sectionId,
    staleTime: 60_000,
    retry: 1,
  });
};

// ─── Submit Attendance ────────────────────────────────────────────────────────
export const useSubmitAttendance = () => {
  const queryClient = useQueryClient();
  const { closeMarkAttendance } = useAttendanceStore();

  return useMutation({
    mutationFn: (payload: CreateAttendancePayload) => createAttendance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      closeMarkAttendance();
    },
  });
};

// ─── Today ────────────────────────────────────────────────────────────────────
export const useAttendanceToday = (className: string, section: string) => {
  return useQuery<AttendanceDay | null>({
    queryKey: attendanceKeys.today(className, section),
    queryFn:  async () => {
      try {
        const res = await getAllAttendance("", new Date().toISOString().slice(0, 10));
        if (!res?.data?.length) return null;
        return null;
      } catch {
        return null;
      }
    },
    refetchInterval: 60_000,
    staleTime:        30_000,
    enabled: !!className && !!section,
  });
};

// ─── All Classes Today ──────────────────────────────────────────────────────
export const useAllClassesTodayAttendance = () => {
  return useQuery<GetAllClassesTodayAttendanceResponse>({
    queryKey: attendanceKeys.allClassesToday(),
    queryFn:  () => getAllClassesTodayAttendance(),
    refetchInterval: 60_000,
    staleTime:        30_000,
  });
};

// ─── Single Class Today ─────────────────────────────────────────────────────
export const useClassTodayAttendance = (classId: string, sectionId: string) => {
  return useQuery<GetClassTodayAttendanceResponse>({
    queryKey: attendanceKeys.classToday(classId, sectionId),
    queryFn:  () => getClassTodayAttendance(classId, sectionId),
    enabled:  !!classId && !!sectionId,
    refetchInterval: 60_000,
    staleTime:        30_000,
  });
};

// ─── History ──────────────────────────────────────────────────────────────────
export const useAttendanceHistory = () => {
  const { historyDateFrom, historyDateTo, historyClass } = useAttendanceStore();
  return useQuery<AttendanceHistory | null>({
    queryKey: attendanceKeys.history(historyDateFrom, historyDateTo, historyClass),
    queryFn:  async () => null,
    staleTime: 2 * 60_000,
  });
};

// ─── Holidays ─────────────────────────────────────────────────────────────────
export const useAllHolidays = () => {
  return useQuery({
    queryKey: attendanceKeys.holidays(),
    queryFn:  () => getAllHolidays(),
    staleTime: 10 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// ─── Add Holiday ──────────────────────────────────────────────────────────────
export const useAddHoliday = () => {
  const queryClient = useQueryClient();
  const { closeAddHoliday } = useAttendanceStore();

  return useMutation({
    mutationFn: (payload: CreateHolidayPayload) => createHoliday(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.holidays() });
      closeAddHoliday();
    },
  });
};

// ─── Send Reminders ───────────────────────────────────────────────────────────
export const useSendReminders = () => {
  return useMutation({
    mutationFn: async () => ({ success: true, remindersSent: 0 }),
  });
};

// ─── Export CSV ───────────────────────────────────────────────────────────────
export const useExportCSV = () => {
  return useMutation<Blob, unknown, void>({
    mutationFn: async () => {
      const csv = "Class,Present,Absent\n";
      return new Blob([csv], { type: "text/csv" });
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a   = document.createElement("a");
      a.href     = url;
      a.download = `attendance_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
};


// ─── Staff List ────────────────────────────────────────────────────────────────
export const useStaffList = () => {
  return useQuery({
    queryKey: [...attendanceKeys.all, "staffList"] as const,
    queryFn: () => fetchStaff(),
    staleTime: 5 * 60_000,
  });
};

// ─── Submit Staff Attendance ──────────────────────────────────────────────────
export const useSubmitStaffAttendance = () => {
  const queryClient = useQueryClient();
  const { closeMarkStaffAttendance } = useAttendanceStore();

  return useMutation({
    mutationFn: (payload: CreateStaffAttendancePayload) => {
      const user = getAuthUser();
      const schoolCode = user?.schoolcode ?? "";
      const apiPayload: ApiCreateStaffAttendancePayload = {
        school_code: schoolCode,
        attendance_records: payload.attendance_records,
      };
      return createStaffAttendance(apiPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      closeMarkStaffAttendance();
    },
  });
};

// ─── All Staff Attendance Records ────────────────────────────────────────────
export const useAllStaffAttendance = () => {
  return useQuery({
    queryKey: [...attendanceKeys.all, "allStaffAttendance"] as const,
    queryFn: () => getAllStaffAttendance(),
    staleTime: 60_000,
  });
};

// ─── Create Staff Attendance (single row, no modal close) ────────────────────
export const useCreateSingleStaffAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStaffAttendancePayload) => {
      const user = getAuthUser();
      const schoolCode = user?.schoolcode ?? "";
      const apiPayload: ApiCreateStaffAttendancePayload = {
        school_code: schoolCode,
        attendance_records: payload.attendance_records,
      };
      return createStaffAttendance(apiPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
};

// ─── Update Staff Attendance ─────────────────────────────────────────────────
export const useUpdateStaffAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStaffAttendancePayload }) =>
      updateStaffAttendanceById(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
};

// ─── Delete Staff Attendance ──────────────────────────────────────────────────
export const useDeleteStaffAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStaffAttendanceById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
};

// ─── Chronic Absentees (absent > 5 days) ─────────────────────────────────────
export const useChronicAbsentees = () => {
  return useQuery({
    queryKey: [...attendanceKeys.all, "chronicAbsentees"] as const,
    queryFn:  () => getAbsentMoreThan5Days(),
    staleTime: 2 * 60_000,
    retry: 1,
  });
};

// ─── Class Attendance by Date ─────────────────────────────────────────────────
export const useClassAttendanceByDate = (
  classId: string,
  sectionId: string,
  date: string
) => {
  return useQuery({
    queryKey: [...attendanceKeys.all, "byDate", classId, sectionId, date] as const,
    queryFn:  () => getClassAttendanceByDate(classId, sectionId, date),
    enabled:  !!classId && !!sectionId && !!date,
    staleTime: 30_000,
    retry: 1,
  });
};

// ─── Update Individual Student Attendance ─────────────────────────────────────
export const useUpdateStudentAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAttendancePayload }) =>
      updateAttendanceById(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
};