// receipts.utils.ts

import type { PaymentMode, FeeStatus } from "../receipts/types/receipts.types";



export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};


export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "Invalid Date"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

export const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "Invalid Date"
    : date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

export const getTodayISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getCurrentPeriod = (): string => {
  return new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

export const formatDisplayDate = (date: string): string => formatDate(date);

// ─── Receipt Number ──────────────────────────────────────────────────────────

export const generateReceiptNo = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RCP-${year}-${random}`;
};

// ─── Payment Mode ────────────────────────────────────────────────────────────

export const PAYMENT_MODES: { label: string; value: PaymentMode }[] = [
  { label: "Cash",   value: "CASH"   },
  { label: "UPI",    value: "UPI"    },
  { label: "Cheque", value: "CHEQUE" },
  { label: "Online", value: "ONLINE" },
];

export const modeStyle = (mode: PaymentMode): string => {
  const styles: Record<PaymentMode, string> = {
    CASH:   "bg-green-50 text-green-700 border border-green-200",
    UPI:    "bg-blue-50 text-blue-700 border border-blue-200",
    CHEQUE: "bg-amber-50 text-amber-700 border border-amber-200",
    ONLINE: "bg-purple-50 text-purple-700 border border-purple-200",
  };
  return styles[mode] ?? "bg-slate-100 text-slate-600 border border-slate-200";
};

export const getModeBadge = (mode: PaymentMode): string => {
  const styles: Record<PaymentMode, string> = {
    UPI:    "bg-purple-100 text-purple-700 border-purple-200",
    CASH:   "bg-green-100 text-green-700 border-green-200",
    CHEQUE: "bg-blue-100 text-blue-700 border-blue-200",
    ONLINE: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return styles[mode] ?? "bg-gray-100 text-gray-700";
};

export const getModeIcon = (mode: PaymentMode): string => {
  switch (mode) {
    case "UPI":    return "⚡";
    case "CASH":   return "💵";
    case "CHEQUE": return "📄";
    default:       return "";
  }
};

// ─── Fee Status ───────────────────────────────────────────────────────────────

export const getStatusColor = (status: FeeStatus): string => {
  const styles: Record<FeeStatus, string> = {
    paid:       "text-green-600",
    overdue:    "text-red-600",
    warning:    "text-amber-600",
    upcoming:   "text-blue-600",
    "due-today":"text-orange-600",
  };
  return styles[status] ?? "text-slate-500";
};

// ─── Fee Heads ───────────────────────────────────────────────────────────────

export const FEE_HEADS = [
  "Tuition Fee",
  "Transport Fee",
  "Exam Fee",
  "Library Fee",
  "Hostel Fee",
];

// ─── Number to Words ─────────────────────────────────────────────────────────

export const numberToWords = (num: number): string => {
  if (!num || isNaN(num)) return "Zero Rupees Only";
  if (num === 0) return "Zero Rupees Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  const convertBelowHundred = (n: number): string => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  };

  const convertBelowThousand = (n: number): string => {
    if (n < 100) return convertBelowHundred(n);
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + convertBelowHundred(n % 100) : "")
    );
  };

  let result = "";
  let n = Math.floor(num);

  if (n >= 10_000_000) { result += convertBelowThousand(Math.floor(n / 10_000_000)) + " Crore "; n %= 10_000_000; }
  if (n >= 100_000)    { result += convertBelowThousand(Math.floor(n / 100_000))    + " Lakh ";  n %= 100_000;    }
  if (n >= 1_000)      { result += convertBelowThousand(Math.floor(n / 1_000))      + " Thousand "; n %= 1_000;   }
  if (n > 0)           { result += convertBelowThousand(n); }

  return result.trim() + " Rupees Only";
};