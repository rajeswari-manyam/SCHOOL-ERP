// teacher/attendance/hooks/useAttendance.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "../api/attendance.api";
import type {
  MarkAttendancePayload,
  CorrectionRequestPayload,
  TodayAttendance,
  AttendanceHistoryEntry,
} from "../types/attendance.types";

// ── Query keys ────────────────────────────────────────────────────────────────
export const ATTENDANCE_KEYS = {
  all:         ["attendance"] as const,
  today:       () => [...ATTENDANCE_KEYS.all, "today"]   as const,
  students:    () => [...ATTENDANCE_KEYS.all, "students"] as const,
  myHistory:   () => [...ATTENDANCE_KEYS.all, "my-history"] as const,
  corrections: () => [...ATTENDANCE_KEYS.all, "corrections"] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────────
export const useTodayAttendance = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.today(),
    queryFn:  attendanceApi.getToday,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });

export const useAttendanceStudents = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.students(),
    queryFn:  attendanceApi.getStudents,
    staleTime: 1000 * 60 * 10,
  });

export const useMyAttendanceHistory = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.myHistory(),
    queryFn:  attendanceApi.getMyHistory,
    staleTime: 1000 * 60 * 5,
  });

export const useMyCorrectionRequests = () =>
  useQuery({
    queryKey: ATTENDANCE_KEYS.corrections(),
    queryFn:  attendanceApi.getMyCorrectionRequests,
    staleTime: 1000 * 60 * 5,
  });

// ── Mutations ─────────────────────────────────────────────────────────────────
export const useMarkAttendanceViaWeb = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MarkAttendancePayload) => attendanceApi.markViaWeb(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all }),
  });
};

export const useRetryWaAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => attendanceApi.retryWaAlert(studentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.today() }),
  });
};

export const useSubmitCorrectionRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CorrectionRequestPayload) => attendanceApi.submitCorrection(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.corrections() }),
  });
};

// ── Mock fallback data (same pattern as MOCK_BANNER in dashboard) ─────────────
export const MOCK_TODAY: TodayAttendance = {
  isMarked: false,
  totalStudents: 42,
  classLabel: "10-A",
  date: new Date().toISOString().slice(0, 10),
  absentStudents: [],
};

export const MOCK_TODAY_MARKED: TodayAttendance = {
  isMarked: true,
  markedAt: "08:52 AM",
  method: "web",
  presentCount: 38,
  absentCount: 3,
  halfDayCount: 1,
  totalStudents: 42,
  classLabel: "10-A",
  date: new Date().toISOString().slice(0, 10),
  absentStudents: [
    { student: { id: "s2", name: "Anjali Reddy",  rollNo: "02", waNumber: "9000022222" }, alertSent: true,  alertSentAt: "08:53 AM" },
    { student: { id: "s4", name: "Meera Singh",   rollNo: "04", waNumber: "9000044444" }, alertSent: true,  alertSentAt: "08:53 AM" },
    { student: { id: "s7", name: "Rahul Verma",   rollNo: "07", waNumber: "9000077777" }, alertSent: false },
  ],
};

export const MOCK_STUDENTS = Array.from({ length: 12 }, (_, i) => ({
  id:      `s${i + 1}`,
  name:    ["Arjun Sharma","Anjali Reddy","Ravi Kumar","Meera Singh","Vikram Mehta","Deepa Rao","Rahul Verma","Kavitha Nair","Priya Patel","Suresh Naidu","Divya Rao","Kiran Joshi"][i],
  rollNo:  String(i + 1).padStart(2, "0"),
  waNumber:`900${String(i + 1).padStart(8, "0")}`,
}));

export const MOCK_HISTORY: AttendanceHistoryEntry[] = [
  { id: "h1", date: "2025-04-14", classLabel: "10-A", presentCount: 0,  absentCount: 0,  totalStudents: 42, markedAt: null,    method: null,         status: null       },
  { id: "h2", date: "2025-04-13", classLabel: "10-A", presentCount: 39, absentCount: 3,  totalStudents: 42, markedAt: "08:55", method: "web",         status: "on_time"  },
  { id: "h3", date: "2025-04-12", classLabel: "10-A", presentCount: 40, absentCount: 2,  totalStudents: 42, markedAt: "09:14", method: "whatsapp",    status: "late"     },
  { id: "h4", date: "2025-04-11", classLabel: "10-A", presentCount: 42, absentCount: 0,  totalStudents: 42, markedAt: "08:44", method: "whatsapp",    status: "on_time"  },
  { id: "h5", date: "2025-04-10", classLabel: "10-A", presentCount: 0,  absentCount: 0,  totalStudents: 42, markedAt: null,    method: null,         status: "missed"   },
  { id: "h6", date: "2025-04-09", classLabel: "10-A", presentCount: 38, absentCount: 4,  totalStudents: 42, markedAt: "09:02", method: "web",         status: "late"     },
  { id: "h7", date: "2025-04-08", classLabel: "10-A", presentCount: 41, absentCount: 1,  totalStudents: 42, markedAt: "08:51", method: "web",         status: "on_time"  },
  { id: "h8", date: "2025-04-07", classLabel: "10-A", presentCount: 40, absentCount: 2,  totalStudents: 42, markedAt: "08:47", method: "whatsapp",    status: "on_time"  },
  { id: "h9", date: "2025-04-06", classLabel: "10-A", presentCount: 35, absentCount: 7,  totalStudents: 42, markedAt: null,    method: null,         status: "missed"   },
];