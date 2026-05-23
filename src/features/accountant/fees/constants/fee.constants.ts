import type { DueStatus, OverdueSeverity } from "../types/fees.types";



export const BILLING_CYCLES = ["Monthly", "Quarterly", "Annual", "One-Time"] as const;
export type BillingCycle = typeof BILLING_CYCLES[number];



export const CONCESSION_TYPES = [
  "Sibling Discount",
  "Merit Scholarship",
  "Financial Aid",
  "Staff Ward",
  "Sports Quota",
  "Other",
];

export const FEE_TYPES = [
  { id: "tuition",     label: "Tuition fee" },
  { id: "examination", label: "Examination" },
  { id: "transport",   label: "Transport"   },
  { id: "activity",    label: "Activity"    },
  { id: "library",     label: "Library"     },
  { id: "all",         label: "All fees"    },
];

export const FEE_HEAD_COLORS: Record<string, string> = {
  "Tuition Fee":     "bg-blue-500",
  "Examination Fee": "bg-amber-500",
  "Transport Fee":   "bg-green-500",
  "Activity Fee":    "bg-purple-500",
  "Library Fee":     "bg-pink-500",
  "Lab Fee":         "bg-orange-500",
};


export const FEE_STATS = [
  { label: "Total Pending",    value: "₹1,18,000",  color: "text-red-600"   },
  { label: "Collected Today",  value: "₹24,500",    color: "text-green-600" },
  { label: "Reminders Sent",   value: "47",          color: "text-blue-600"  },
  { label: "Overdue 30+ days", value: "12 students", color: "text-amber-600" },
];



export const DEFAULT_STUDENT = {
  id: "1",
  name: "Ravi Kumar",
  class: "Class 10A",
  admissionId: "2024098",
  initials: "RK",
};


export const FILTER_CLASSES = [
  "All Classes",
  "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B",
  "6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B",
];

export const FILTER_MODES = ["All Modes", "CASH", "UPI", "CHEQUE"];

export const SORT_OPTIONS = [
  "Newest First",
  "Oldest First",
  "Amount (High to Low)",
  "Amount (Low to High)",
];

export const DUE_STATUSES: {
  label: DueStatus;
  className: string;
  activeClassName: string;
}[] = [
  {
    label: "All",
    className: "border border-gray-300 text-gray-600 bg-white hover:bg-gray-50",
    activeClassName: "bg-[#3525CD] text-white border-[#3525CD]",
  },
  {
    label: "3-Day Warning",
    className: "border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100",
    activeClassName: "bg-amber-500 text-white border-amber-500",
  },
  {
    label: "Due Today",
    className: "border border-green-200 text-green-700 bg-green-50 hover:bg-green-100",
    activeClassName: "bg-green-600 text-white border-green-600",
  },
  {
    label: "Overdue",
    className: "border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100",
    activeClassName: "bg-orange-500 text-white border-orange-500",
  },
  {
    label: "Severely Overdue",
    className: "border border-red-200 text-red-700 bg-red-50 hover:bg-red-100",
    activeClassName: "bg-red-600 text-white border-red-600",
  },
];



export const PAYMENT_MODE_OPTIONS = [
  { value: "UPI",  label: "UPI"  },
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
] as const;

export type PaymentModeOption = typeof PAYMENT_MODE_OPTIONS[number]["value"];



export const TRANSACTIONS_TABLE_COLS =
  "grid grid-cols-[36px_120px_180px_180px_90px_140px_110px_90px_140px_160px] min-w-[1200px]";

export const CONCESSIONS_PAGE_SIZE = 6;

export const CONCESSION_TABLE_COLS =
  "grid-cols-[2.2fr_0.65fr_1.2fr_0.9fr_1.6fr_1.3fr_0.9fr_0.6fr]";

export const CONCESSION_TABLE_HEADERS = [
  "Student", "Class", "Type", "Amount",
  "Reason", "Approved By", "Status", "Actions",
];

export const SECTION_LABELS = ["Section A", "Section B", "Both Same"] as const;



export const AVATAR_COLORS_BG = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-cyan-500",
];

export const AVATAR_COLORS_SOFT = [
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
];

export const AVATAR_INDIGO = "bg-indigo-100 text-indigo-700";



export const OVERDUE_BADGE_STYLES: Record<OverdueSeverity, string> = {
  today:
    "inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200",
  warning:
    "inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200",
  critical:
    "inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200",
};