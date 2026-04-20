import type { PaymentMode } from "../types/fees.types";

export const modeStyle = (mode: PaymentMode) => {
  switch (mode) {
    case "CASH":
      return "bg-green-50 text-green-700 border border-green-200";
    case "UPI":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "CHEQUE":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "ONLINE":
      return "bg-purple-50 text-purple-700 border border-purple-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

export const sentStyle = (status: string) => {
  if (status === "WA Sent") return "text-green-600";
  if (status === "Sent") return "text-blue-600";
  return "text-slate-400";
};

import type { FeeStatus } from "../types/fees.types";

export const getStatusColor = (status: FeeStatus) => {
  switch (status) {
    case "paid":
      return "text-green-600";
    case "overdue":
      return "text-red-600";
    case "warning":
      return "text-amber-600";
    case "upcoming":
      return "text-blue-600";
    case "due-today":
      return "text-orange-600";
    default:
      return "text-slate-500";
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/* =========================
   FEE STRUCTURE UTILS
========================= */

import type { BillingCycle } from "../types/fees.types";

export const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const billingCycleColor = (cycle: BillingCycle) => {
  switch (cycle) {
    case "Monthly":
      return "text-blue-600";
    case "Quarterly":
      return "text-indigo-600";
    case "Annual":
      return "text-green-600";
    case "One-Time":
      return "text-amber-600";
    default:
      return "text-gray-500";
  }
};

export const statusDot = (mandatory: boolean) => {
  return mandatory ? "bg-green-500" : "bg-gray-300";
};