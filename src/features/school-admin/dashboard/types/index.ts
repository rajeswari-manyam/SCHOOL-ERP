// ─── Dashboard Feature Types ───────────────────────────────────────────────

export interface AttendanceClass {
  id: string;
  className: string;
  teacher: string;
  present: number | null;
  absent: number | null;
  status: 'marked' | 'not_marked';
}

export interface FeeDefaulter {
  id: string;
  initials: string;
  name: string;
  className: string;
  amount: number;
  overdueDays: number;
  color: string;
}

export interface WhatsAppActivity {
  id: string;
  type: 'alert' | 'fee' | 'broadcast' | 'staff';
  message: string;
  time: string;
  delivered: string;
}

export interface AdmissionStage {
  stage: string;
  count: number;
  highlight?: boolean;
  danger?: boolean;
}

export type StatVariant = 'green' | 'red' | 'orange' | 'blue';

export interface StatsCard {
  id: string;
  label: string;
  value: string;
  badge?: { text: string; variant: StatVariant };
  sub: string;
  action?: { label: string };
  alert?: boolean;
  icon: 'users' | 'check' | 'rupee' | 'user-plus';
}

export interface DashboardData {
  stats: StatsCard[];
  attendanceClasses: AttendanceClass[];
  feeDefaulters: FeeDefaulter[];
  feeCollected: number;
  feePending: number;
  feeTotalOutstanding: number;
  feePaidPercent: number;
  whatsappActivity: WhatsAppActivity[];
  admissionPipeline: AdmissionStage[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}
