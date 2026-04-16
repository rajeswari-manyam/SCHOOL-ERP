import type {
  AttendancePageData,
  ClassDetail,
  ChronicAbsentee,
  Holiday,
  AttendanceTrendPoint,
} from "../types/attendance.types";

export const AUTO_REFRESH_MS = 60_000;

export const AVATAR_COLORS: Record<string, string> = {
  PR: "bg-purple-100 text-purple-700",
  SR: "bg-sky-100 text-sky-700",
  KK: "bg-teal-100 text-teal-700",
  SM: "bg-orange-100 text-orange-700",
  RT: "bg-rose-100 text-rose-700",
  VR: "bg-green-100 text-green-700",
  AN: "bg-pink-100 text-pink-700",
  SS: "bg-blue-100 text-blue-700",
};

export const HOLIDAY_TYPE_COLORS: Record<string, string> = {
  National: "bg-indigo-100 text-indigo-700",
  State:    "bg-emerald-100 text-emerald-700",
  School:   "bg-amber-100 text-amber-700",
  Other:    "bg-gray-100 text-gray-700",
};

export const CLASS_OPTIONS = [
  "Class 6A", "Class 6B",
  "Class 7A", "Class 7B",
  "Class 8A", "Class 8B",
  "Class 9A", "Class 9B",
  "Class 10A", "Class 10B",
];

export const SECTION_OPTIONS = ["A", "B", "C", "D"];

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_ATTENDANCE_DATA: AttendancePageData = {
  date: "Monday, 7 April 2025",
  whatsappNumber: "+91 90000 12345",
  stats: {
    totalPresent: 318,
    presentDelta: "+2.4%",
    totalAbsent: 24,
    absentDelta: "-0.8%",
    classesMarked: 12,
    totalClasses: 16,
    alertsSent: 18,
    totalAlerts: 24,
  },
  rows: [
    {
      id: "6A",
      cls: "6",
      section: "A",
      teacherInitials: "PR",
      teacherName: "Priya Reddy",
      total: 32,
      present: 30,
      absent: 2,
      status: "MARKED",
      method: "WhatsApp",
      alertsSent: "2/2",
    },
    {
      id: "6B",
      cls: "6",
      section: "B",
      teacherInitials: "SR",
      teacherName: "Suresh Kumar",
      total: 31,
      present: 29,
      absent: 2,
      status: "MARKED",
      method: "WhatsApp",
      alertsSent: "2/2",
    },
    {
      id: "7A",
      cls: "7",
      section: "A",
      teacherInitials: "KK",
      teacherName: "Kavita Kapoor",
      total: 33,
      present: 31,
      absent: 2,
      status: "MARKED",
      method: "Web Form",
      alertsSent: "2/2",
    },
    {
      id: "7B",
      cls: "7",
      section: "B",
      teacherInitials: "SM",
      teacherName: "Suman Mehta",
      total: 32,
      present: null,
      absent: null,
      status: "NOT_MARKED",
      method: null,
      alertsSent: null,
    },
  ],
};

export const MOCK_CLASS_DETAILS: ClassDetail[] = [
  {
    id: "6A",
    label: "Class 6A",
    teacher: "Priya Reddy",
    markedAt: "8:45 AM",
    present: 30,
    absent: 2,
    students: [
      { id: 1, roll: "01", name: "Aarav Sharma", present: true, alertStatus: "delivered" },
      { id: 2, roll: "02", name: "Bhavya Patel", present: true, alertStatus: "delivered" },
      { id: 3, roll: "03", name: "Chetan Gupta", present: false, alertStatus: "delivered" },
      { id: 4, roll: "04", name: "Divya Singh", present: false, alertStatus: "failed" },
    ],
  },
];

export const MOCK_CHRONIC_ABSENTEES: ChronicAbsentee[] = [
  { initials: "AG", name: "Amit Gupta", class: "8A", absentDays: 12, severity: "critical" },
  { initials: "SK", name: "Sneha Kumar", class: "7B", absentDays: 8, severity: "high" },
  { initials: "RJ", name: "Rajesh Jain", class: "9A", absentDays: 6, severity: "medium" },
];

export const MOCK_HOLIDAYS: Holiday[] = [
  { id: "1", date: "2025-01-26", name: "Republic Day", type: "National" },
  { id: "2", date: "2025-08-15", name: "Independence Day", type: "National" },
  { id: "3", date: "2025-10-02", name: "Gandhi Jayanti", type: "National" },
];

export const MOCK_TREND_DATA: AttendanceTrendPoint[] = [
  { date: "2025-03-01", present: 295, absent: 25, total: 320 },
  { date: "2025-03-02", present: 298, absent: 22, total: 320 },
  { date: "2025-03-03", present: 310, absent: 10, total: 320 },
  { date: "2025-04-01", present: 305, absent: 15, total: 320 },
  { date: "2025-04-02", present: 312, absent: 8, total: 320 },
  { date: "2025-04-03", present: 315, absent: 5, total: 320 },
  { date: "2025-04-04", present: 318, absent: 2, total: 320 },
];