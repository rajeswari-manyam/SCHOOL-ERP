// utils/fee.utils.ts

export type FeeStatus =
  | "paid"
  | "overdue"
  | "warning"
  | "upcoming"
  | "due-today";

export const getStatusColor = (status: FeeStatus): string => {
  const styles: Record<FeeStatus, string> = {
    paid: "text-green-600",
    overdue: "text-red-600",
    warning: "text-amber-600",
    upcoming: "text-blue-600",
    "due-today": "text-orange-600",
  };

  return styles[status] ?? "text-slate-500";
};

export const FEE_HEADS = [
  "Tuition Fee",
  "Transport Fee",
  "Exam Fee",
  "Library Fee",
  "Hostel Fee",
];