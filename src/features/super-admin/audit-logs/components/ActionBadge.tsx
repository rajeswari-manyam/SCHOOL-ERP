import type { AuditAction } from "../types/audit-logs.types";

interface BadgeStyle { bg: string; text: string; label: string }

const ACTION_STYLES: Record<AuditAction, BadgeStyle> = {
  SCHOOL_CREATED:      { bg: "bg-blue-50",   text: "text-blue-600",   label: "School Created" },
  SCHOOL_SUSPENDED:    { bg: "bg-red-50",    text: "text-red-600",    label: "School Suspended" },
  PAYMENT_RECORDED:    { bg: "bg-green-50",  text: "text-green-600",  label: "Payment Recorded" },
  SUBSCRIPTION_CHECK:  { bg: "bg-gray-100",  text: "text-gray-500",   label: "Subscription Check" },
  TEMPLATE_ASSIGNED:   { bg: "bg-purple-50", text: "text-purple-600", label: "Template Assigned" },
  PLAN_CHANGED:        { bg: "bg-amber-50",  text: "text-amber-600",  label: "Plan Changed" },
  REP_ADDED:           { bg: "bg-indigo-50", text: "text-indigo-600", label: "Rep Added" },
  FEE_REMINDER_BATCH:  { bg: "bg-teal-50",   text: "text-teal-600",   label: "Fee Reminder Batch" },
  LOGIN:               { bg: "bg-gray-100",  text: "text-gray-600",   label: "Login" },
  LOGOUT:              { bg: "bg-gray-100",  text: "text-gray-500",   label: "Logout" },
  SETTINGS_UPDATED:    { bg: "bg-sky-50",    text: "text-sky-600",    label: "Settings Updated" },
  USER_DELETED:        { bg: "bg-red-50",    text: "text-red-700",    label: "User Deleted" },
};

export const ACTION_OPTIONS: { value: AuditAction | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Actions" },
  ...Object.entries(ACTION_STYLES).map(([value, { label }]) => ({
    value: value as AuditAction,
    label,
  })),
];

const ActionBadge = ({ action }: { action: AuditAction }) => {
  const style = ACTION_STYLES[action] ?? { bg: "bg-gray-100", text: "text-gray-500", label: action };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};

export default ActionBadge;
