import type { ReportCard } from "../types/reports.types";

export const REPORT_CARDS: ReportCard[] = [
  {
    id: "ATTENDANCE",
    title: "Attendance Report",
    description: "Class-wise trends, chronic absentees, daily records",
    icon: "calendar",
    periods: ["Monthly", "Custom Range"],
    formats: ["PDF"],
    accentColor: "indigo",
  },
  {
    id: "FEE_COLLECTION",
    title: "Fee Collection Report",
    description: "Collection summary, defaulters, payment modes",
    icon: "banknote",
    badge: { label: "Auto-sent to Principal on 1st", color: "emerald" },
    periods: ["Monthly", "Annual"],
    formats: ["PDF", "CSV"],
    accentColor: "emerald",
  },
  {
    id: "STUDENT",
    title: "Student Report",
    description: "Student list, admissions, transfers, class strength",
    icon: "users",
    periods: ["Current", "By Class"],
    formats: ["PDF"],
    accentColor: "blue",
  },
  {
    id: "WHATSAPP_ACTIVITY",
    title: "WhatsApp Activity",
    description: "Alerts sent, delivery rates, failed numbers, templates",
    icon: "message-circle",
    badge: { label: "WhatsApp Verified", color: "green" },
    periods: ["Weekly", "Monthly"],
    formats: ["PDF", "CSV"],
    accentColor: "green",
  },
  {
    id: "ADMISSIONS",
    title: "Admissions Report",
    description: "Pipeline conversion, source analysis, academic year",
    icon: "user-plus",
    periods: ["Monthly", "Academic Year"],
    formats: ["PDF"],
    accentColor: "violet",
  },
  {
    id: "STAFF",
    title: "Staff Report",
    description: "Staff list, attendance, leave utilization, payroll",
    icon: "id-card",
    periods: ["Monthly"],
    formats: ["PDF"],
    accentColor: "amber",
  },
];

export const ACADEMIC_YEARS = ["2024-25", "2023-24", "2022-23"];
export const CLASSES = ["All Classes", "6", "7", "8", "9", "10", "11", "12"];