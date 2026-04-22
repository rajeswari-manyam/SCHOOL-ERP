import type { FeeRow, OverdueSeverity, TransportSlab } from "../types/fees.types";
import { AVATAR_COLORS_BG, AVATAR_COLORS_SOFT, AVATAR_INDIGO, OVERDUE_BADGE_STYLES } from "../constants/fee.constants";


export { AVATAR_INDIGO, OVERDUE_BADGE_STYLES };



export const getAvatarBgColor = (name: string) =>
  AVATAR_COLORS_BG[name.charCodeAt(0) % AVATAR_COLORS_BG.length];

export const getAvatarSoftColor = (index: number) =>
  AVATAR_COLORS_SOFT[index % AVATAR_COLORS_SOFT.length];

export const getInitials = (name: string) =>
  (name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);



export const typeBadgeClass = (typeColor: string) =>
  `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${typeColor}`;

export const statusBadgeClass = (status: string) =>
  status === "ACTIVE"
    ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100"
    : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100";

export const statusDotClass = (status: string) =>
  status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500";



export const getTransactionStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "severely overdue":
      return "bg-red-100 text-red-700 border border-red-200";
    case "overdue":
      return "bg-orange-100 text-orange-700 border border-orange-200";
    case "due today":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "pending":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    default:
      return "bg-green-100 text-green-700 border border-green-200";
  }
};



export const getOverdueSeverity = (days: number): OverdueSeverity => {
  if (days === 0) return "today";
  if (days <= 5) return "warning";
  return "critical";
};



export function applyDueStatus(rows: FeeRow[], status: string): FeeRow[] {
  switch (status) {
    case "3-Day Warning":    return rows.filter((r) => r.daysOverdue > 0 && r.daysOverdue <= 3);
    case "Due Today":        return rows.filter((r) => r.daysOverdue === 0);
    case "Overdue":          return rows.filter((r) => r.daysOverdue > 0 && r.daysOverdue <= 30);
    case "Severely Overdue": return rows.filter((r) => r.daysOverdue > 30);
    default:                 return rows;
  }
}

export function applySortBy(rows: FeeRow[], sortBy: string): FeeRow[] {
  const copy = [...rows];
  switch (sortBy) {
    case "Oldest First":         return copy.sort((a, b) => a.daysOverdue - b.daysOverdue);
    case "Amount (High to Low)": return copy.sort((a, b) => b.amount - a.amount);
    case "Amount (Low to High)": return copy.sort((a, b) => a.amount - b.amount);
    default:                     return copy.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }
}



export const distanceLabel = (slab: TransportSlab) =>
  slab.to == null ? `${slab.from}+ km` : `${slab.from}–${slab.to} km`;