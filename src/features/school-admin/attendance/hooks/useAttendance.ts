import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllAttendance,
  getAllClassesTodayAttendance,
  getClassTodayAttendance,
  getStudentsByClassSection,
  createAttendance,
  getAbsentMoreThan5Days,
  type CreateAttendancePayload,
} from "../../../../services/attendance.api";
import {
  getAllHolidays,
  createHoliday,
  type CreateHolidayPayload,
} from "../../../../services/holidays.api";
import { getAllClasses, getSectionsByClassId } from "../../../../services/class.api";
import { useAttendanceStore } from "../store";
import type {
  AttendanceHistory,
  AttendanceDay,
  GetAllClassesTodayAttendanceResponse,
  GetClassTodayAttendanceResponse,
} from "../types/attendance.types";
import {
  mockAttendanceToday,
  mockAttendanceHistory,
} from "../store/mockData";


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
  return useQuery<AttendanceDay>({
    queryKey: attendanceKeys.today(className, section),
    queryFn:  async () => {
      try {
        const res = await getAllAttendance("", new Date().toISOString().slice(0, 10));
        if (!res?.data?.length) return mockAttendanceToday;
        return mockAttendanceToday; // replace with real mapper when endpoint is stable
      } catch {
        return mockAttendanceToday;
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
  return useQuery<AttendanceHistory>({
    queryKey: attendanceKeys.history(historyDateFrom, historyDateTo, historyClass),
    queryFn:  async () => mockAttendanceHistory,
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


// ─── Chronic Absentees (absent > 5 days) ─────────────────────────────────────
export const useChronicAbsentees = () => {
  return useQuery({
    queryKey: [...attendanceKeys.all, "chronicAbsentees"] as const,
    queryFn:  () => getAbsentMoreThan5Days(),
    staleTime: 2 * 60_000,
    retry: 1,
  });
};