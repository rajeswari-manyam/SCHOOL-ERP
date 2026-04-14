export type ClassAttendanceStatus = "MARKED" | "NOT_MARKED";

export interface AlertBanner {
  unmmarkedClasses: string[];
  count: number;
}

export interface DashboardStat {
  studentsPresent: number;
  studentsTotal: number;
  attendanceRate: number;
  absentCount: number;
  absentClasses: number;
  classesMarked: number;
  classesTotal: number;
  collectedThisMonth: number;
  collectionPct: number;
  pendingAmount: number;
  admissionsThisWeek: number;
  admissionsVsLastWeek: number;
  admissionsPendingFollowup: number;
}

export interface ClassAttendanceRow {
  id: string;
  className: string;
  teacher: string;
  present: number | null;
  absent: number | null;
  status: ClassAttendanceStatus;
}

export interface FeeDefaulter {
  id: string;
  name: string;
  initials: string;
  class: string;
  amount: number;
  overdueDays: number;
}

export interface FeeDuesSummary {
  totalOutstanding: number;
  paidPct: number;
  pendingPct: number;
  topDefaulters: FeeDefaulter[];
}

export interface WAActivity {
  id: string;
  message: string;
  time: string;
  type: "attendance" | "fee" | "broadcast" | "staff";
}

export interface AdmissionStage {
  label: string;
  key: "ENQUIRY" | "INTERVIEW" | "DOCS" | "CONFIRMED" | "DECLINED";
  count: number;
}

export interface SchoolAdminDashboardData {
  adminName: string;
  schoolName: string;
  date: string;
  alertBanner: AlertBanner;
  stats: DashboardStat;
  classAttendance: ClassAttendanceRow[];
  feeDues: FeeDuesSummary;
  waActivity: WAActivity[];
  admissionPipeline: AdmissionStage[];
}
