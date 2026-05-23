import type { StaffStatus } from "../types/staff.types";

export const StatusBadge = ({ status }: { status: StaffStatus }) => {
  const styles = {
    ACTIVE: "bg-green-100 text-green-600",
    ON_LEAVE: "bg-yellow-100 text-yellow-600",
    INACTIVE: "bg-red-100 text-red-600",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
      {status}
    </span>
  );
};