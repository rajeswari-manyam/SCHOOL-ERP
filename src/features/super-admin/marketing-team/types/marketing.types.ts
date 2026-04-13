export type RepStatus = "PRESENT" | "ABSENT" | "HALF_DAY";
export type PayoutStatus = "PENDING" | "APPROVED" | "PAID";
export type MarketingTab = "team-overview" | "attendance" | "targets" | "payouts";
export type AttendanceMark = "P" | "A" | "H" | "-";

export interface MarketingRep {
  id: string;
  name: string;
  initials: string;
  role: string;
  territory: string;
  todayStatus: RepStatus;
  mtdDemos: number;
  mtdClosings: number;
  monthTarget: number;
  payoutStatus: PayoutStatus;
  perClosingRate: number;
  totalEarned: number;
  conversionPct: number;
  achievementPct: number;
}

export interface MarketingStats {
  totalReps: number;
  presentToday: number;
  presentPct: number;
  demosThisMonth: number;
  demosTarget: number;
  schoolsClosed: number;
  schoolsClosedDelta: number;
}

export interface AttendanceRecord {
  repId: string;
  repName: string;
  initials: string;
  days: Record<number, AttendanceMark>;
  totalPresent: number;
}

export interface RepFilters {
  search: string;
  territory: string;
  status: RepStatus | "ALL";
  page: number;
  pageSize: number;
}

export interface RepsResponse {
  data: MarketingRep[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RepFormValues {
  name: string;
  territory: string;
  phone: string;
  email: string;
  perClosingRate: number;
  monthTarget: number;
}
