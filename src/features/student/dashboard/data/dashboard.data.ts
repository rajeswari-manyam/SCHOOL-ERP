import type {
  StatItem,
  ScheduleItem,
  HomeworkItem,
  AttendanceDay,
  RecentResult,
  Announcement,
} from "../types/dashboard.types";

export const stats: StatItem[] = [
  {
    title: "Today's Status",
    value: "Present",
    extra: "Checked in at 08:15 AM",
    type: "attendance",
    iconType: "attendance",
  },
  {
    title: "Attendance Month",
    value: "91.7%",
    extra: "+2.4% from last month",
    iconType: "percent",
  },
  {
    title: "Homework Due",
    value: "2 this week",
    extra: "Submission portal active",
    iconType: "homework",
  },
  {
    title: "Next Exam",
    value: "9 days",
    extra: "Mathematics Finals",
    iconType: "exam",
  },
];

export const schedule: ScheduleItem[] = [
  { period: "P1", time: "08:30 – 09:20", subject: "English Literature", teacher: "Ms. Sharma" },
  { period: "P2", time: "09:20 – 10:10", subject: "Mathematics", teacher: "Mr. Reddy" },
  { period: "", time: "10:10 – 10:25", subject: "", teacher: "", isBreak: true, breakLabel: "Short Break (10:10 – 10:25)" },
  { period: "P3", time: "10:25 – 11:15", subject: "Science (Physics)", teacher: "Dr. Gupta" },
  { period: "P4", time: "11:15 – 12:05", subject: "Social Studies", teacher: "Ms. Devi" },
  { period: "", time: "12:05 – 12:50", subject: "", teacher: "", isBreak: true, breakLabel: "Lunch Interval (12:05 – 12:50)" },
  { period: "P5", time: "12:50 – 13:40", subject: "Hindi Language", teacher: "Mr. Prasad" },
  { period: "P6", time: "13:40 – 14:30", subject: "Computer Science", teacher: "Ms. Rao" },
];

export const homework: HomeworkItem[] = [
  { id: "1", subject: "English", title: "Poetry Analysis", dueDate: "Due: 26 Apr 2024", colorType: "blue" },
  { id: "2", subject: "Mathematics", title: "Quadratic Equations", dueDate: "Due: 27 Apr 2024", colorType: "green" },
  { id: "3", subject: "Science", title: "Lab Report (Optics)", dueDate: "Due: 28 Apr 2024", colorType: "amber" },
];

// April 2024: starts on Monday (weekday index 1 in Mon-first; but we use Sun-first so April 1 = Monday = index 1)
export const attendance: AttendanceDay[] = [
  { day: 0, status: "empty" }, // Sunday offset (April 1 = Monday)
  { day: 1, status: "present" },
  { day: 2, status: "present" },
  { day: 3, status: "present" },
  { day: 4, status: "present" },
  { day: 5, status: "absent" },
  { day: 6, status: "holiday" }, // Saturday
  { day: 7, status: "holiday" }, // Sunday
  { day: 8, status: "present" },
  { day: 9, status: "present" },
  { day: 10, status: "present" },
  { day: 11, status: "present" },
  { day: 12, status: "present" },
  { day: 13, status: "holiday" }, // Saturday
  { day: 14, status: "holiday" }, // Sunday
  { day: 15, status: "present" },
  { day: 16, status: "present" },
  { day: 17, status: "present" },
  { day: 18, status: "present" },
  { day: 19, status: "present" },
  { day: 20, status: "holiday" }, // Saturday
  { day: 21, status: "holiday" }, // Sunday
  { day: 22, status: "present" },
  { day: 23, status: "present" },
  { day: 24, status: "present" }, // today
  { day: 25, status: "empty" },
  { day: 26, status: "empty" },
  { day: 27, status: "empty" },
  { day: 28, status: "empty" },
  { day: 29, status: "empty" },
  { day: 30, status: "empty" },
];

export const recentResult: RecentResult = {
  testName: "Unit Test 1",
  date: "Jan 2025",
  score: 387,
  total: 500,
  passed: true,
  rank: 12,
};

export const announcements: Announcement[] = [
  {
    id: "1",
    title: "Annual Sports Day registration now open",
    timeAgo: "Published 3 hours ago",
    type: "info",
  },
  {
    id: "2",
    title: "Ambedkar Jayanti: School will remain closed on April 14",
    timeAgo: "Published Yesterday",
    type: "alert",
  },
];
