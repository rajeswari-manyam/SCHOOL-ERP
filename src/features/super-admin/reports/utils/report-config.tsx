import type { ReportType } from "../types/reports.types";

// Inline SVG icons per report type
export const ReportIcons: Record<ReportType, (props: { size?: number }) => JSX.Element> = {
  REVENUE: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  SCHOOLS: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  MARKETING: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <line x1="14" y1="11" x2="20" y2="11"/><line x1="14" y1="15" x2="20" y2="15"/>
    </svg>
  ),
  WHATSAPP: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/>
    </svg>
  ),
  FEE: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  AUDIT: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
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
