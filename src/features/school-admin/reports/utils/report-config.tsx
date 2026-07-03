import { Calendar, CreditCard, Users, MessageSquare, Briefcase } from "lucide-react";
import type { ReportType, ReportCardConfig } from "../types/reports.types";
import type { JSX } from "react";

export const ReportIcons: Record<ReportType, (props: { size?: number }) => JSX.Element> = {
  ATTENDANCE:        ({ size = 20 }) => <Calendar     size={size} />,
  FEE_COLLECTION:    ({ size = 20 }) => <CreditCard   size={size} />,
  STUDENT:           ({ size = 20 }) => <Users         size={size} />,
  WHATSAPP:          ({ size = 20 }) => <MessageSquare size={size} />,
  WHATSAPP_ACTIVITY: ({ size = 20 }) => <MessageSquare size={size} />,
  ADMISSIONS:        ({ size = 20 }) => <Users         size={size} />,
  STAFF:             ({ size = 20 }) => <Briefcase     size={size} />,
};

export const REPORT_CARDS: ReportCardConfig[] = [
  {
    type: "ATTENDANCE",
    title: "Attendance Report",
    description: "Class-wise trends, chronic absentees, daily records",
    iconBg: "bg-blue-50 text-blue-600",
    periods: ["Monthly", "Custom Range"],
    formats: ["PDF", "CSV"],
    sections: [
      { key: "class_summary",     label: "Class-wise summary" },
      { key: "daily_grid",        label: "Daily attendance grid (all 30 days)" },
      { key: "chronic_absentees", label: "Chronic absentees list" },
      { key: "teacher_marking",   label: "Teacher-wise marking status" },
      { key: "period_attendance", label: "Period-wise attendance", premium: true },
    ],
  },
  {
    type: "FEE_COLLECTION",
    title: "Fee Collection Report",
    description: "Collection summary, defaulters, payment modes",
    iconBg: "bg-emerald-50 text-emerald-600",
    periods: ["Monthly", "Annual"],
    formats: ["PDF", "CSV"],
    badge: { text: "AUTO-SENT TO PRINCIPAL ON 1ST", color: "text-teal-700 bg-teal-50 border-teal-200" },
  },
  {
    type: "STUDENT",
    title: "Student Report",
    description: "Student list, admissions, transfers, class strength",
    iconBg: "bg-indigo-50 text-indigo-600",
    periods: ["Current", "By Class"],
    formats: ["PDF"],
  },
  {
    type: "WHATSAPP",
    title: "WhatsApp Activity",
    description: "Alerts sent, delivery rates, failed numbers, templates",
    iconBg: "bg-green-50 text-green-600",
    periods: ["Weekly", "Monthly"],
    formats: ["PDF", "CSV"],
    badge: { text: "WHATSAPP VERIFIED", color: "text-green-700 bg-green-50 border-green-200", dot: true },
  },
  {
    type: "STAFF",
    title: "Staff Report",
    description: "Staff list, attendance, leave utilization, payroll",
    iconBg: "bg-orange-50 text-orange-600",
    periods: ["Monthly"],
    formats: ["PDF", "CSV"],
  },
];