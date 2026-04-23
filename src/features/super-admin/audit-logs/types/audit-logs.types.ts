export type AuditAction =
  | "SCHOOL_CREATED"
  | "SCHOOL_SUSPENDED"
  | "PAYMENT_RECORDED"
  | "SUBSCRIPTION_CHECK"
  | "TEMPLATE_ASSIGNED"
  | "PLAN_CHANGED"
  | "REP_ADDED"
  | "FEE_REMINDER_BATCH"
  | "LOGIN"
  | "LOGOUT"
  | "SETTINGS_UPDATED"
  | "USER_DELETED";

export type AuditActor = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "SYSTEM" | "MARKETING_BOT";

export interface AuditLog {
  id: string;
  timestamp: string;        // ISO datetime
  actor: string;            // Display name e.g. "Ravi Kumar"
  actorRole?: string;       // e.g. "Super Admin"
  action: AuditAction;
  school?: string;          // School name or "All schools"
  ipAddress: string;        // e.g. "103.21.xx.xx" or "internal"
  metadata?: Record<string, unknown>;
}

export interface AuditLogsFilters {
  search: string;
  action: AuditAction | "ALL";
  actor: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
}


