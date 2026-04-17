import { BarChart2, LayoutGrid, Megaphone, MessageSquare, CreditCard, Shield, MessageSquareText, Building2,MenuSquare } from "lucide-react";
import type { ReportType } from "../types/reports.types";

export const ReportIcons: Record<ReportType, (props: { size?: number }) => JSX.Element> = {
  REVENUE: ({ size = 20 }) => <BarChart2 size={size} />,
  SCHOOLS: ({ size = 20 }) => <Building2 size={size} />,
  MARKETING: ({ size = 20 }) => <MenuSquare size={size} />,
  WHATSAPP: ({ size = 20 }) => <MessageSquareText size={size} />,
  FEE: ({ size = 20 }) => <CreditCard size={size} />,
  AUDIT: ({ size = 20 }) => <Shield size={size} />,
};

export const REPORT_CARDS = [
  {
    type: "REVENUE" as ReportType,
    title: "Revenue Report",
    description: "Comprehensive breakdown of fee collections, taxes, and net institutional earnings.",
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    type: "SCHOOLS" as ReportType,
    title: "Schools Report",
    description: "Monitor status, license validity, and performance metrics across all registered schools.",
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    type: "MARKETING" as ReportType,
    title: "Marketing Report",
    description: "Analyze lead conversion rates and enrollment campaign effectiveness by region.",
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    type: "WHATSAPP" as ReportType,
    title: "WhatsApp Report",
    description: "Messaging volume, delivery rates, and automated notification logs for school parents.",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    type: "FEE" as ReportType,
    title: "Fee Report",
    description: "Detailed audit trail of student-level fee structures and outstanding scholarship flags.",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    type: "AUDIT" as ReportType,
    title: "Audit Report",
    description: "System security logs, login attempts, and administrative permission changes history.",
    iconBg: "bg-gray-100 text-gray-600",
  },
];
