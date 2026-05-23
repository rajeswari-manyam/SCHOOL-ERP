import type { PendingFee, FeeStatusFilter, SortOption } from "../types/fees.types";

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function generateReceiptNumber(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `RCP-2025-0${num}`;
}

export function getTodayDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).split("/").join("/");
}

export function getStatusLabel(fee: PendingFee): {
  label: string;
  color: "red" | "orange" | "green" | "gray";
} {
  if (fee.daysOverdue && fee.daysOverdue > 0) {
    return {
      label: `${fee.daysOverdue} days overdue`,
      color: fee.daysOverdue >= 14 ? "red" : "orange",
    };
  }
  if (fee.isDueToday) return { label: "Due Today", color: "orange" };
  if (fee.daysRemaining !== null) {
    return { label: `${fee.daysRemaining} days remaining`, color: "green" };
  }
  return { label: "Unknown", color: "gray" };
}

export function filterPendingFees(
  fees: PendingFee[],
  statusFilter: FeeStatusFilter,
  searchQuery: string,
  classFilter: string,
  sectionFilter: string,
  feeHeadFilter: string
): PendingFee[] {
  return fees.filter((fee) => {
    // Status filter
    if (statusFilter === "Overdue" && (!fee.daysOverdue || fee.daysOverdue <= 0)) return false;
    if (statusFilter === "Severely Overdue" && (!fee.daysOverdue || fee.daysOverdue < 30)) return false;
    if (statusFilter === "Due Today" && !fee.isDueToday) return false;
    if (statusFilter === "3-Day Warning" && (fee.daysRemaining === null || fee.daysRemaining > 3)) return false;

    // Class filter
    if (classFilter !== "All Classes" && fee.class !== classFilter.replace("Class ", "")) return false;

    // Section filter
    if (sectionFilter !== "All Sections" && fee.section !== sectionFilter.replace("Section ", "")) return false;

    // Fee head filter
    if (feeHeadFilter !== "All Fee Heads" && fee.feeHead !== feeHeadFilter) return false;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        fee.studentName.toLowerCase().includes(q) ||
        fee.admissionNo.toLowerCase().includes(q)
      );
    }

    return true;
  });
}

export function sortPendingFees(fees: PendingFee[], sort: SortOption): PendingFee[] {
  return [...fees].sort((a, b) => {
    if (sort === "Days Overdue") return (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0);
    if (sort === "Amount") return b.amount - a.amount;
    if (sort === "Name") return a.studentName.localeCompare(b.studentName);
    return 0;
  });
}

export function getInitialsColor(initials: string): string {
  const colors: Record<string, string> = {
    RT: "#6366f1",
    PS: "#8b5cf6",
    KK: "#3b82f6",
    SR: "#06b6d4",
    AD: "#10b981",
    VR: "#f59e0b",
    DK: "#ef4444",
  };
  return colors[initials] || "#6366f1";
}