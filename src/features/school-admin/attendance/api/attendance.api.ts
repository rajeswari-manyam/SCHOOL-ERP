<<<<<<< HEAD
// import axios from "@/config/axios";
// import type {
//   AttendancePageData,
//   ClassDetail,
//   ChronicAbsentee,
//   Holiday,
//   AttendanceTrendPoint,
//   AttendanceHistoryFilters,
// } from "../types/attendance.types";
// import {
//   MOCK_ATTENDANCE_DATA,
//   MOCK_CLASS_DETAILS,
//   MOCK_CHRONIC_ABSENTEES,
//   MOCK_HOLIDAYS,
//   MOCK_TREND_DATA,
// } from "../utils/constants";

// export const attendanceApi = {
//   // ── Today ──────────────────────────────────────────────────────────────────
//   getTodayAttendance: async (): Promise<AttendancePageData> => {
//     // const response = await axios.get("/attendance/today");
//     // return response.data;
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(MOCK_ATTENDANCE_DATA), 500);
//     });
//   },

//   getClassDetails: async (classId: string): Promise<ClassDetail> => {
//     // const response = await axios.get(`/attendance/class/${classId}`);
//     // return response.data;
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const classDetail = MOCK_CLASS_DETAILS.find((c) => c.id === classId);
//         if (!classDetail) throw new Error("Class not found");
//         resolve(classDetail);
//       }, 300);
//     });
//   },

//   // ── History ────────────────────────────────────────────────────────────────
//   getAttendanceHistory: async (
//     filters: AttendanceHistoryFilters
//   ): Promise<AttendanceTrendPoint[]> => {
//     // const response = await axios.get("/attendance/history", { params: filters });
//     // return response.data;
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(MOCK_TREND_DATA), 500);
//     });
//   },

//   getChronicAbsentees: async (): Promise<ChronicAbsentee[]> => {
//     // const response = await axios.get("/attendance/chronic-absentees");
//     // return response.data;
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(MOCK_CHRONIC_ABSENTEES), 500);
//     });
//   },

//   // ── Holidays ───────────────────────────────────────────────────────────────
//   getHolidays: async (): Promise<Holiday[]> => {
//     // const response = await axios.get("/attendance/holidays");
//     // return response.data;
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(MOCK_HOLIDAYS), 500);
//     });
//   },

//   createHoliday: async (holiday: Omit<Holiday, "id">): Promise<Holiday> => {
//     // const response = await axios.post("/attendance/holidays", holiday);
//     // return response.data;
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const newHoliday: Holiday = { ...holiday, id: Date.now().toString() };
//         resolve(newHoliday);
//       }, 300);
//     });
//   },

//   deleteHoliday: async (id: string): Promise<void> => {
//     // await axios.delete(`/attendance/holidays/${id}`);
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(), 300);
//     });
//   },

//   // ── Mutations ──────────────────────────────────────────────────────────────
//   markAttendance: async (
//     studentId: string,
//     date: string,
//     status: "present" | "absent" | "late"
//   ): Promise<void> => {
//     // await axios.post("/attendance/mark", { studentId, date, status });
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(), 300);
//     });
//   },

//   bulkMarkAttendance: async (
//     classId: string,
//     date: string,
//     attendance: Record<string, "present" | "absent" | "late">
//   ): Promise<void> => {
//     // await axios.post("/attendance/bulk-mark", { classId, date, attendance });
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(), 500);
//     });
//   },
// };
=======
import type { AttendanceDay, AttendanceHistory, HolidayCalendar, MarkAttendanceForm } from "../types/attendance.types";
import {
  mockAttendanceToday,
  mockAttendanceHistory,
  mockHolidayCalendar,
} from "../store/mockData";

// ─── Simulate async API delay ───────────────────────────────────────────────
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ─── Attendance API ──────────────────────────────────────────────────────────
export const attendanceApi = {
  /** Fetch today's attendance summary + class list */
  getToday: async (): Promise<AttendanceDay> => {
    await delay();
    return mockAttendanceToday;
  },

  /** Fetch attendance history with trend data + chronic absentees */
  getHistory: async (_params: {
    dateFrom: string;
    dateTo: string;
    classFilter: string;
  }): Promise<AttendanceHistory> => {
    await delay(600);
    return mockAttendanceHistory;
  },

  /** Fetch holiday calendar for a given month/year */
  getHolidayCalendar: async (): Promise<HolidayCalendar> => {
    await delay(300);
    return mockHolidayCalendar;
  },

  /** Submit attendance via web form */
  submitAttendance: async (form: MarkAttendanceForm): Promise<{ success: boolean; message: string }> => {
    await delay(800);
    const absentCount = form.students.filter((s) => !s.isPresent).length;
    return {
      success: true,
      message: `Attendance submitted. ${absentCount} parent alert(s) will be sent via WhatsApp.`,
    };
  },

  /** Add a new holiday */
  addHoliday: async (_holiday: {
    name: string;
    date: string;
    type: string;
    repeatAnnually: boolean;
    notes?: string;
    notifyTeachers: boolean;
  }): Promise<{ success: boolean }> => {
    await delay(500);
    return { success: true };
  },

  /** Send reminder to all unmarked classes */
  sendReminders: async (): Promise<{ success: boolean; remindersSent: number }> => {
    await delay(600);
    return { success: true, remindersSent: 3 };
  },

  /** Export attendance CSV */
  exportCSV: async (): Promise<Blob> => {
    await delay(500);
    const csv = "Class,Present,Absent,Method\n6A,32,2,WhatsApp\n6B,30,2,Web Form\n7A,28,2,WhatsApp\n";
    return new Blob([csv], { type: "text/csv" });
  },
};
>>>>>>> b2322df0c36881311796dd895aa45e054008ba98
