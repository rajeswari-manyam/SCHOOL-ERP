import React from "react";
import type { PendingFee } from "../types/fees.types";
import { getStatusLabel } from "../utils/Fee.utils";

interface StatusBadgeProps {
  fee: PendingFee;
}

export function StatusBadge({ fee }: StatusBadgeProps) {
  const { label, color } = getStatusLabel(fee);
  const colorMap = {
    red: "text-red-600",
    orange: "text-orange-500",
    green: "text-green-600",
    gray: "text-gray-500",
  };
  return <span className={`text-xs font-semibold ${colorMap[color]}`}>{label}</span>;
}

interface ReminderDotsProps {
  sent: number;
  total: number;
}

export function ReminderDots({ sent, total }: ReminderDotsProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-600">{sent}/{total}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-sm ${i < sent ? "bg-indigo-500" : "bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
}

interface PaymentModeBadgeProps {
  mode: string;
}

export function PaymentModeBadge({ mode }: PaymentModeBadgeProps) {
  const styles: Record<string, string> = {
    UPI: "bg-blue-100 text-blue-700",
    CASH: "bg-gray-100 text-gray-700",
    Cash: "bg-gray-100 text-gray-700",
    Cheque: "bg-orange-100 text-orange-700",
    CHEQUE: "bg-orange-100 text-orange-700",
    "Bank Transfer": "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${styles[mode] || "bg-gray-100 text-gray-700"}`}>
      {mode}
    </span>
  );
}

interface FeeStatusChipProps {
  status: "PAID" | "PENDING" | "OVERDUE";
}

export function FeeStatusChip({ status }: FeeStatusChipProps) {
  const styles = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-orange-100 text-orange-700",
    OVERDUE: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${styles[status]}`}>
      {status}
    </span>
  );
}