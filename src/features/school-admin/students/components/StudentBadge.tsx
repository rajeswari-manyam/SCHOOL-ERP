import type { FeeStatus, StudentStatus } from "../types/student.types";

export const StatusBadge = ({ status }: { status: StudentStatus }) => {
  const map: Record<StudentStatus, { cls: string; label: string }> = {
    ACTIVE: { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", label: "Active" },
    TRANSFERRED: { cls: "bg-blue-50 text-blue-700 border border-blue-200", label: "Transferred" },
    INACTIVE: { cls: "bg-gray-100 text-gray-500 border border-gray-200", label: "Inactive" },
  };
  const { cls, label } = map[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>{label}</span>;
};

export const FeeBadge = ({ status }: { status: FeeStatus }) => {
  const map: Record<FeeStatus, { cls: string }> = {
    PAID: { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    PENDING: { cls: "bg-amber-50 text-amber-700 border border-amber-200" },
    OVERDUE: { cls: "bg-red-50 text-red-700 border border-red-200" },
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status].cls}`}>{status}</span>;
};
