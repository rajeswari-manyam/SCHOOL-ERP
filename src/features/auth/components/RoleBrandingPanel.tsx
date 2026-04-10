// src/features/auth/components/RoleBrandingPanel.tsx

import { MessageCircle } from "lucide-react";

export type RoleId =
  | "superadmin"
  | "schooladmin"
  | "teacher"
  | "accountant"
  | "parent"
  | "student";

interface PanelConfig {
  badge: string;
  headline: string;
  body: string;
  stats: { value: string; label: string }[];
  pills: string[];
  bg: string;
  barColor: string;
}

const PANEL_CONFIGS: Record<RoleId, PanelConfig> = {
  superadmin: {
    badge: "Super admin",
    headline: "Manage all schools\non one platform.",
    body: "Full platform visibility, tenant management, WhatsApp template controls and audit logs.",
    stats: [
      { value: "500+", label: "Institutions" },
      { value: "1.2M", label: "Active users" },
    ],
    pills: ["Tenant management", "Audit logs", "WA templates"],
    bg: "#4f46e5",
    barColor: "rgba(255,255,255,0.4)",
  },
  schooladmin: {
    badge: "School admin",
    headline: "Everything your school\nneeds, automated.",
    body: "Attendance alerts, fee reminders and parent broadcasts — all on WhatsApp. No app needed.",
    stats: [
      { value: "47+", label: "Schools" },
      { value: "Daily", label: "Broadcasts" },
    ],
    pills: ["Attendance alerts", "Fee reminders", "Broadcasts"],
    bg: "#0891b2",
    barColor: "rgba(255,255,255,0.4)",
  },
  teacher: {
    badge: "Teacher",
    headline: "Mark attendance,\nshare results instantly.",
    body: "Class management, exam results and homework alerts sent to parents automatically.",
    stats: [
      { value: "30+", label: "Subjects" },
      { value: "Real-time", label: "Alerts" },
    ],
    pills: ["Attendance", "Exam results", "Homework"],
    bg: "#059669",
    barColor: "rgba(255,255,255,0.4)",
  },
  accountant: {
    badge: "Accountant",
    headline: "Fee collection,\ntracked and automated.",
    body: "Pending fee reminders, payment receipts and financial reports delivered on WhatsApp.",
    stats: [
      { value: "98%", label: "Collection rate" },
      { value: "Auto", label: "Reminders" },
    ],
    pills: ["Fee collection", "Receipts", "Reports"],
    bg: "#d97706",
    barColor: "rgba(255,255,255,0.4)",
  },
  parent: {
    badge: "Parent portal",
    headline: "Stay connected with\nyour child's school.",
    body: "Get real-time attendance, fee and exam updates on WhatsApp — no app download needed.",
    stats: [
      { value: "Live", label: "Attendance" },
      { value: "Instant", label: "Notifications" },
    ],
    pills: ["Attendance alerts", "Fee payments", "Exam results"],
    bg: "#db2777",
    barColor: "rgba(255,255,255,0.4)",
  },
  student: {
    badge: "Student portal",
    headline: "Your academics,\nall in one place.",
    body: "Access timetables, homework, results and fee status with instant WhatsApp notifications.",
    stats: [
      { value: "All", label: "Subjects" },
      { value: "Live", label: "Results" },
    ],
    pills: ["Timetable", "Results", "Homework"],
    bg: "#7c3aed",
    barColor: "rgba(255,255,255,0.4)",
  },
};

const BAR_HEIGHTS = [40, 65, 45, 80, 55, 70, 50, 85, 60, 75];

interface RoleBrandingPanelProps {
  roleId: RoleId;
}

export const RoleBrandingPanel = ({ roleId }: RoleBrandingPanelProps) => {
  const cfg = PANEL_CONFIGS[roleId];

  return (
    <div
      className="flex flex-col lg:flex-1 px-6 sm:px-12 py-12 sm:py-16 relative overflow-hidden"
      style={{ background: cfg.bg }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-60px] right-[-60px] w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute bottom-[-40px] left-[-40px] w-36 h-36 sm:w-56 sm:h-56 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          <span className="text-[10px] uppercase tracking-widest text-white/70 font-medium">
            {cfg.badge}
          </span>
        </div>

        {/* Mock chart */}
        <div className="bg-black/20 rounded-xl p-3 sm:p-4 mb-6">
          <div className="flex items-end gap-1 h-10 sm:h-12">
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="w-1 sm:w-2 rounded-sm flex-shrink-0"
                style={{ height: `${h}%`, background: cfg.barColor }}
              />
            ))}
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3 whitespace-pre-line">
          {cfg.headline}
        </h2>

        {/* Body */}
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-5">{cfg.body}</p>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mb-5">
          {cfg.stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <div className="text-lg sm:text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs sm:text-sm text-white/55">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          {cfg.pills.map((p) => (
            <span
              key={p}
              className="text-xs sm:text-sm border border-white/30 rounded-full px-3 py-1 text-white/80"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* WhatsApp help button */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-10">
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base font-medium px-3 sm:px-4 py-2 rounded-full transition"
        >
          <MessageCircle className="w-4 h-4" />
          Get Help
        </a>
      </div>
    </div>
  );
};