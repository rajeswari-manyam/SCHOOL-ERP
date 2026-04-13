import type {
  DashboardData,
  QuickAction,
} from "../types/dashboard.types";

// ─── Avatar Colour Map ────────────────────────────────────────────────────────

export const AVATAR_COLOR_MAP: Record<string, string> = {
  RT: "bg-orange-400",
  PS: "bg-purple-400",
  KK: "bg-teal-500",
};

// ─── Quick Actions List ───────────────────────────────────────────────────────

export const QUICK_ACTIONS: QuickAction[] = [
  { icon: "👤+", label: "ADD STUDENT" },
  { icon: "✓", label: "ATTENDANCE" },
  { icon: "💳", label: "FEE PAYMENT" },
  { icon: "📣", label: "SEND BROADCAST" },
  { icon: "🔍", label: "ADD ENQUIRY" },
  { icon: "📊", label: "GEN. REPORT" },
];

// ─── Mock Dashboard Seed Data ─────────────────────────────────────────────────
// Replace this with real API calls in api/dashboardApi.ts

export const MOCK_DASHBOARD_DATA: DashboardData = {
  schoolName: "Hanamkonda Public School",
  principalName: "Ramesh",
  todayDate: "Monday, 7 April 2025",
  alertBannerClasses: ["8A", "9A", "10A"],

  attendance: {
    present: 318,
    total: 342,
    rate: 93,
    absentCount: 24,
    classCount: 12,
    totalClasses: 15,
    pendingClasses: ["8A", "9A", "10A"],
    rows: [
      { cls: "10A", teacher: "Mrs. Lakshmi Reddy", present: "--", absent: "--", status: "NOT_MARKED", marked: false },
      { cls: "10B", teacher: "Mr. Srikant Ch.",    present: "38",  absent: "2",  status: "MARKED",     marked: true  },
      { cls: "9A",  teacher: "Mrs. Vanaja M.",     present: "--",  absent: "--", status: "NOT_MARKED", marked: false },
      { cls: "9B",  teacher: "Mr. Anand G.",       present: "35",  absent: "5",  status: "MARKED",     marked: true  },
      { cls: "8A",  teacher: "Mrs. Sharada P.",    present: "--",  absent: "--", status: "NOT_MARKED", marked: false },
    ],
  },

  fees: {
    totalOutstanding: "₹1,18,000",
    collected: "₹2,34,000",
    paidPercent: 66,
    defaulters: [
      { initials: "RT", name: "Ravi Teja",    cls: "Class 10A", amount: "₹14,500", overdueLabel: "OVERDUE 15D", overdueDays: 15 },
      { initials: "PS", name: "Priya Sharma", cls: "Class 9B",  amount: "₹12,000", overdueLabel: "OVERDUE 10D", overdueDays: 10 },
      { initials: "KK", name: "Kiran Kumar",  cls: "Class 8A",  amount: "₹10,500", overdueLabel: "OVERDUE 5D",  overdueDays: 5  },
    ],
  },

  admissions: {
    weeklyCount: 7,
    weeklyDelta: 2,
    pendingFollowUp: 3,
    stages: [
      { label: "ENQUIRY",   value: "12", colorClass: "text-gray-800" },
      { label: "INTERVIEW", value: "4",  colorClass: "text-blue-600", highlighted: true },
      { label: "DOCS",      value: "3",  colorClass: "text-gray-800" },
      { label: "CONFIRMED", value: "7",  colorClass: "text-green-600" },
      { label: "DECLINED",  value: "2",  colorClass: "text-red-500"  },
    ],
  },

  whatsappActivity: [
    { icon: "👁",  title: "24 absence alerts sent to parents",            time: "10:32 AM — Delivered to all recipients" },
    { icon: "💬",  title: "Fee reminder sent to Class 10A Defaulters",    time: "09:45 AM — 12 parents notified"         },
    { icon: "📢",  title: 'Broadcast: "Annual Sports Day Date Finalized"', time: "09:15 AM — 342 parents reached"        },
    { icon: "👤",  title: "Staff attendance reminder sent",               time: "Yesterday, 06:00 PM"                    },
  ],
};

