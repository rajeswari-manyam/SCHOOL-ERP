import type { Stat,HomeworkItem } from "../types/dashboard.types";

export const stats: Stat[] = [
  { title: "Attendance", value: "91.7%", status: "success" },
  { title: "Fees Pending", value: "₹8,500", status: "error" },
  { title: "Assignments", value: "2 Pending", status: "warning" },
  { title: "Working Days", value: "90 days" },
];

export interface FeeItem {
  month: string;
  amount: number;
  status: "paid" | "pending";
}

export interface FeeSummary {
  isPaid: boolean;
  lastPayment?: {
    amount: number;
    date: string;
    method: string;
  };
  nextDue?: {
    label: string;
    date: string;
  };
  fees: FeeItem[];
}

export const feeSummary: FeeSummary = {
  isPaid: false,

  lastPayment: {
    amount: 8500,
    date: "1 April 2025",
    method: "UPI",
  },

  nextDue: {
    label: "May fees",
    date: "5 May 2025",
  },

  fees: [
    { month: "April 2025", amount: 8500, status: "pending" },
    { month: "March 2025", amount: 8500, status: "paid" },
    { month: "February 2025", amount: 8500, status: "paid" },
    { month: "January 2025", amount: 8500, status: "pending" },
  ],
};

export interface StatItem {
  label: string;
  value?: string;
  badge?: {
    text: string;
    variant: "green" | "red" | "amber" | "blue";
  };
  sub?: string;
  path: string;
}

export const paidStats: StatItem[] = [
  {
    label: "Today's Attendance",
    badge: { text: "Present", variant: "green" },
    sub: "7 April 2025",
    path: "/parent/attendance",
  },
  {
    label: "Fee Status",
    badge: { text: "All Paid", variant: "green" },
    sub: "April fees paid",
    path: "/parent/fees",
  },
  {
    label: "Homework Due",
    value: "2 assignments",
    badge: { text: "Due today", variant: "amber" },
    path: "/parent/homework",
  },
  {
    label: "Next Exam",
    value: "9 days",
    badge: { text: "Mathematics", variant: "blue" },
    sub: "Unit Test",
    path: "/parent/exams",
  },
];

export const unpaidStats: StatItem[] = [
  {
    label: "Today's Attendance",
    badge: { text: "Present", variant: "green" },
    sub: "7 April 2025",
    path: "/parent/attendance",
  },
  {
    label: "Fee Status",
    value: "₹8,500",
    badge: { text: "Pending", variant: "red" },
    sub: "Tuition-Due 9 Apr",
    path: "/parent/fees",
  },
  {
    label: "Homework Due",
    value: "2 assignments",
    badge: { text: "Pending submission", variant: "amber" },
    path: "/parent/homework",
  },
  {
    label: "Next Exam",
    value: "9 days",
    badge: { text: "Mathematics", variant: "blue" },
    sub: "Unit Test",
    path: "/parent/exams",
  },
];

export interface Announcement {
  title: string;
  description: string;
  date: string;
}

export const announcements: Announcement[] = [
  {
    title: "Summer Vacation Schedule",
    description: "School closed from May 15 to June 20",
    date: "Apr 22, 2026",
  },
  {
    title: "Sports Day",
    description: "Annual sports event announcement",
    date: "Apr 18, 2026",
  },
  {
    title: "Exam Timetable",
    description: "Unit test schedule released",
    date: "Apr 15, 2026",
  },
];


export const homeworkCardData: HomeworkItem[] = [
  {
    title: "Tenses and Modals",
    subject: "ENGLISH",
    fileUrl: "/files/english.pdf", // ✅
  },
  {
    title: "Quadratic Equations",
    subject: "MATHS",
    fileUrl: "/files/maths.pdf", // ✅
  },
  {
    title: "Chemical Bonding",
    subject: "SCIENCE",
    fileUrl: "/files/science.pdf", // ✅
  },
];

export const homeworkSimpleData: HomeworkItem[] = [
  { title: "Mathematics: Quadratic Equations", subject: "Mathematics", fileUrl: "/files/maths.pdf" },
  { title: "Physics: Optics Lab Report", subject: "Physics", fileUrl: "/files/physics.pdf" },
  { title: "English: Shakespeare Essay", subject: "English", fileUrl: "/files/english.pdf" },
];
import type { Exam } from "../types/dashboard.types";

export const upcomingExams: Exam[] = [
  {
    subject: "Mathematics",
    date: "16 April 2025",
    day: "Wednesday",
    time: "09:00 AM – 12:00 PM",
    venue: "Hall A-102",
  },
  {
    subject: "Physics",
    date: "18 April 2025",
    day: "Friday",
    time: "09:00 AM – 12:00 PM",
    venue: "Science Lab 2",
  },
  {
    subject: "Chemistry",
    date: "21 April 2025",
    day: "Monday",
    time: "01:30 PM – 04:30 PM",
    venue: "Hall B-205",
  },
];