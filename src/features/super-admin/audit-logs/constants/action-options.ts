import type { AuditAction } from "../types/audit-logs.types";

const ACTION_STYLES: Record<AuditAction, { label: string }> = {
  SCHOOL_CREATED:      { label: "School Created" },
  SCHOOL_SUSPENDED:    { label: "School Suspended" },
  PAYMENT_RECORDED:    { label: "Payment Recorded" },
  SUBSCRIPTION_CHECK:  { label: "Subscription Check" },
  TEMPLATE_ASSIGNED:   { label: "Template Assigned" },
  PLAN_CHANGED:        { label: "Plan Changed" },
  REP_ADDED:           { label: "Rep Added" },
  FEE_REMINDER_BATCH:  { label: "Fee Reminder Batch" },
  LOGIN:               { label: "Login" },
  LOGOUT:              { label: "Logout" },
  SETTINGS_UPDATED:    { label: "Settings Updated" },
  USER_DELETED:        { label: "User Deleted" },
};

export const ACTION_OPTIONS: { value: AuditAction | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Actions" },
  ...Object.entries(ACTION_STYLES).map(([value, { label }]) => ({
    value: value as AuditAction,
    label,
  })),
];
