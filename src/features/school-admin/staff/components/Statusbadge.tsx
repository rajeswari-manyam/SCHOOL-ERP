import type { StaffStatus } from "../types/staff.types";

export const StatusBadge = ({ status }: { status: StaffStatus }) => {
  const styles: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-600",
    ON_LEAVE: "bg-yellow-100 text-yellow-600",
    INACTIVE: "bg-red-100 text-red-600",
  };
  const key = status?.toUpperCase();
  const cls = styles[key] ?? styles[status] ?? "bg-gray-100 text-gray-500";

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
};