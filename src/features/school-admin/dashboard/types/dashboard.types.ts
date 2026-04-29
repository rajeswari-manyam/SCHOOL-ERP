// ─── Attendance ──────────────────────────────────────────────────────────────

export type AttendanceStatus = "MARKED" | "NOT_MARKED";

export interface ClassAttendanceRow {
  cls: string;
  teacher: string;
  present: string;
  absent: string;
  status: AttendanceStatus;
  marked: boolean;
}

export interface AttendanceSummary {
  present: number;
  total: number;
  rate: number;
  absentCount: number;
  classCount: number;
  totalClasses: number;
  pendingClasses: string[];
  rows: ClassAttendanceRow[];
}
export interface pipelineItem {
  id: string;
  name: string;
  count: number;
}
// ─── Fees ─────────────────────────────────────────────────────────────────────

export interface FeeDefaulter {
  initials: string;
  name: string;
  cls: string;
  amount: string;
  overdueLabel: string;
  overdueDays: number;
}

export interface FeeSummary {
  totalOutstanding: string;
  collected: string;
  paidPercent: number;
  defaulters: FeeDefaulter[];
}

// ─── Admissions ───────────────────────────────────────────────────────────────

export interface AdmissionStageStat {
  label: string;
  value: string;
  colorClass: string;
  highlighted?: boolean;
}

export interface AdmissionsSummary {
  weeklyCount: number;
  weeklyDelta: number;
  pendingFollowUp: number;
  stages: AdmissionStageStat[];
}

// ─── WhatsApp / Alerts ────────────────────────────────────────────────────────

export interface WhatsAppActivity {
  icon: string;
  title: string;
  time: string;
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

export interface QuickAction {
  icon: string;
  label: string;
}

// ─── Dashboard Root ───────────────────────────────────────────────────────────

export interface DashboardData {
  schoolName: string;
  principalName: string;
  todayDate: string;
  attendance: AttendanceSummary;
  fees: FeeSummary;
  admissions: AdmissionsSummary;
  whatsappActivity: WhatsAppActivity[];
  alertBannerClasses: string[];
}