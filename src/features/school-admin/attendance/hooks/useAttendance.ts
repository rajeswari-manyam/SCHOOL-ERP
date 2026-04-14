// attendance/hooks/useAttendance.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "../api/attendance.api";
import type {
  ClassAttendanceRow, TodaySummary, ClassAttendanceDetail,
  AttendanceTrendPoint, ChronicAbsentee, Holiday, WebFormStudent,
} from "../types/attendance.types";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const ATT_KEYS = {
  all:          ["attendance"] as const,
  todaySummary: ()             => [...ATT_KEYS.all, "today-summary"]      as const,
  todayClasses: (date: string) => [...ATT_KEYS.all, "today-classes", date] as const,
  classDetail:  (id: string, date: string) => [...ATT_KEYS.all, "class-detail", id, date] as const,
  trend:        (from: string, to: string, cls: string) => [...ATT_KEYS.all, "trend", from, to, cls] as const,
  chronic:      (from: string, to: string, cls: string) => [...ATT_KEYS.all, "chronic", from, to, cls] as const,
  holidays:     (y: number, m: number)    => [...ATT_KEYS.all, "holidays", y, m] as const,
  students:     (classId: string)         => [...ATT_KEYS.all, "students", classId] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────────
export const useTodaySummary = () =>
  useQuery({ queryKey: ATT_KEYS.todaySummary(), queryFn: attendanceApi.getTodaySummary, staleTime: 60_000 });

export const useTodayClasses = (date: string) =>
  useQuery({ queryKey: ATT_KEYS.todayClasses(date), queryFn: () => attendanceApi.getTodayClasses(date), staleTime: 60_000, refetchInterval: 60_000 });

export const useClassDetail = (classId: string, date: string, enabled: boolean) =>
  useQuery({ queryKey: ATT_KEYS.classDetail(classId, date), queryFn: () => attendanceApi.getClassDetail(classId, date), enabled, staleTime: 30_000 });

export const useAttendanceTrend = (from: string, to: string, classFilter: string) =>
  useQuery({ queryKey: ATT_KEYS.trend(from, to, classFilter), queryFn: () => attendanceApi.getAttendanceTrend({ from, to, classFilter }), staleTime: 120_000 });

export const useChronicAbsentees = (from: string, to: string, classFilter: string) =>
  useQuery({ queryKey: ATT_KEYS.chronic(from, to, classFilter), queryFn: () => attendanceApi.getChronicAbsentees({ from, to, classFilter }), staleTime: 120_000 });

export const useHolidays = (year: number, month: number) =>
  useQuery({ queryKey: ATT_KEYS.holidays(year, month), queryFn: () => attendanceApi.getHolidays(year, month), staleTime: 300_000 });

export const useClassStudents = (classId: string) =>
  useQuery({ queryKey: ATT_KEYS.students(classId), queryFn: () => attendanceApi.getClassStudents(classId), staleTime: 300_000, enabled: !!classId });

// ── Mutations ─────────────────────────────────────────────────────────────────
export const useSendReminders = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (date: string) => attendanceApi.sendRemindersToUnmarked(date),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATT_KEYS.all }),
  });
};

export const useResendAlerts = () =>
  useMutation({ mutationFn: ({ classId, date }: { classId: string; date: string }) => attendanceApi.resendFailedAlerts(classId, date) });

export const useSubmitWebForm = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.submitWebForm,
    onSuccess: () => qc.invalidateQueries({ queryKey: ATT_KEYS.all }),
  });
};

export const useAddHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (h: Omit<Holiday, "id">) => attendanceApi.addHoliday(h),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATT_KEYS.all }),
  });
};

export const useDeleteHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attendanceApi.deleteHoliday(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ATT_KEYS.all }),
  });
};

// ── Mock Data ────────────────────────────────────────────────────────────────
export const MOCK_SUMMARY: TodaySummary = {
  totalPresent: 318, presentDelta: 2.4,
  totalAbsent: 24,   absentDelta: 0.8,
  classesMarked: 12, classesTotal: 15,
  alertsSent: 24,    alertsTotal: 24,
};

export const MOCK_CLASSES: ClassAttendanceRow[] = [
  { id: "6a",  classSection: "6A",  teacher: { initials: "PR", name: "Priya Reddy",   color: "bg-purple-200 text-purple-700"  }, total: 34, present: 32, absent: 2, status: "MARKED",     method: "WhatsApp", alertsSent: 2, alertsTotal: 2 },
  { id: "6b",  classSection: "6B",  teacher: { initials: "SR", name: "Sita Rao",      color: "bg-sky-200 text-sky-700"        }, total: 32, present: 30, absent: 2, status: "MARKED",     method: "Web Form", alertsSent: 2, alertsTotal: 2 },
  { id: "7a",  classSection: "7A",  teacher: { initials: "KK", name: "Kiran Kumar",   color: "bg-teal-200 text-teal-700"      }, total: 30, present: 28, absent: 2, status: "MARKED",     method: "WhatsApp", alertsSent: 2, alertsTotal: 2 },
  { id: "8a",  classSection: "8A",  teacher: { initials: "SM", name: "Suresh M",      color: "bg-orange-200 text-orange-700"  }, total: 30, present: null, absent: null, status: "NOT_MARKED", method: null, alertsSent: null, alertsTotal: null },
  { id: "9a",  classSection: "9A",  teacher: { initials: "RT", name: "Raju T",        color: "bg-red-200 text-red-700"        }, total: 29, present: null, absent: null, status: "NOT_MARKED", method: null, alertsSent: null, alertsTotal: null },
  { id: "10a", classSection: "10A", teacher: { initials: "VR", name: "Venkat R",      color: "bg-violet-200 text-violet-700"  }, total: 33, present: null, absent: null, status: "NOT_MARKED", method: null, alertsSent: null, alertsTotal: null },
];

export const MOCK_CLASS_DETAIL: ClassAttendanceDetail = {
  classSection: "6A", date: "2025-04-07", teacherName: "Priya Reddy",
  method: "WhatsApp", markedAt: "8:47 AM",
  presentCount: 10, absentCount: 2, alertsSent: 1, alertsTotal: 2,
  students: [
    { id: "s1", name: "Priya Sharma",  rollNo: "#101", initials: "PS", mark: "ABSENT",  alertStatus: "delivered" },
    { id: "s2", name: "Suresh M",      rollNo: "#102", initials: "SM", mark: "ABSENT",  alertStatus: "failed"    },
    { id: "s3", name: "Ananya Kapoor", rollNo: "#103", initials: "AK", mark: "PRESENT", alertStatus: "not_sent"  },
    { id: "s4", name: "Rahul Verma",   rollNo: "#104", initials: "RV", mark: "PRESENT", alertStatus: "not_sent"  },
    { id: "s5", name: "Divya Rao",     rollNo: "#105", initials: "DR", mark: "PRESENT", alertStatus: "not_sent"  },
    { id: "s6", name: "Arjun Patel",   rollNo: "#106", initials: "AP", mark: "PRESENT", alertStatus: "not_sent"  },
  ],
};

export const MOCK_WEB_STUDENTS: WebFormStudent[] = [
  { id: "s1", rollNo: "01", name: "Aravind Kumar",  present: true  },
  { id: "s2", rollNo: "02", name: "Divya Rao",      present: true  },
  { id: "s3", rollNo: "03", name: "Mohammed Adil",  present: true  },
  { id: "s4", rollNo: "04", name: "Suresh Nair",    present: false },
  { id: "s5", rollNo: "05", name: "Priya Sharma",   present: true  },
  { id: "s6", rollNo: "06", name: "Arjun Patel",    present: true  },
  { id: "s7", rollNo: "07", name: "Ananya Singh",   present: true  },
  { id: "s8", rollNo: "08", name: "Ravi Kumar",     present: true  },
];

export const MOCK_TREND: AttendanceTrendPoint[] = [
  { date: "05 Mar", "6A": 95, "7A": 88, "8A": 78, avg: 87 },
  { date: "10 Mar", "6A": 93, "7A": 90, "8A": 75, avg: 86 },
  { date: "15 Mar", "6A": 96, "7A": 85, "8A": 80, avg: 87 },
  { date: "20 Mar", "6A": 94, "7A": 92, "8A": 76, avg: 87 },
  { date: "25 Mar", "6A": 97, "7A": 88, "8A": 79, avg: 88 },
  { date: "30 Mar", "6A": 95, "7A": 91, "8A": 77, avg: 88 },
  { date: "05 Apr", "6A": 96, "7A": 89, "8A": 80, avg: 88 },
];

export const MOCK_CHRONIC: ChronicAbsentee[] = [
  { id: "c1", initials: "RT", name: "Ravi Teja",  class: "10A", absentDays: 8, severity: "critical", lastAbsent: "Today",  parentContact: "+91 98765 43210" },
  { id: "c2", initials: "PS", name: "Priya S",    class: "9B",  absentDays: 6, severity: "warning",  lastAbsent: "5 Apr",  parentContact: "+91 87654 32109" },
  { id: "c3", initials: "KR", name: "Kiran R",    class: "8A",  absentDays: 6, severity: "warning",  lastAbsent: "4 Apr",  parentContact: "+91 76543 21098" },
  { id: "c4", initials: "SN", name: "Suresh N",   class: "7B",  absentDays: 5, severity: "moderate", lastAbsent: "3 Apr",  parentContact: "+91 65432 10987" },
  { id: "c5", initials: "AD", name: "Anitha D",   class: "6A",  absentDays: 5, severity: "moderate", lastAbsent: "2 Apr",  parentContact: "+91 54321 09876" },
  { id: "c6", initials: "VR", name: "Venkat R",   class: "10B", absentDays: 5, severity: "moderate", lastAbsent: "1 Apr",  parentContact: "+91 43210 98765" },
];

export const MOCK_HOLIDAYS: Holiday[] = [
  { id: "h1", name: "School Day",         date: "2025-04-01", type: "SCHOOL_DAY",       repeatAnnually: false },
  { id: "h2", name: "Ambedkar Jayanti",   date: "2025-04-14", type: "NATIONAL_HOLIDAY", repeatAnnually: true  },
  { id: "h3", name: "Good Friday",        date: "2025-04-18", type: "PUBLIC_HOLIDAY",   repeatAnnually: true  },
  { id: "h4", name: "School Sports Day",  date: "2025-04-21", type: "SCHOOL_EVENT",     repeatAnnually: false },
];
