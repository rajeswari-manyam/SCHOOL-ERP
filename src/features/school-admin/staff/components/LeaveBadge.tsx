import type { LeaveRequest } from "../types/staff.types";

interface Props {
  status: LeaveRequest["status"];
}

export const LeaveBadge = ({ status }: Props) => {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

  const styles: Record<LeaveRequest["status"], string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  const dot: Record<LeaveRequest["status"], string> = {
    PENDING: "bg-amber-500",
    APPROVED: "bg-emerald-500",
    REJECTED: "bg-red-500",
  };

  return (
    <span className={`${base} ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot[status]}`} />
      {status}
    </span>
  );
};