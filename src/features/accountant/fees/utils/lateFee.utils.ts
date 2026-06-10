import type { PaymentStatus } from "../types/fees.types";

/**
 * Calculates the late fee for a given fee item.
 *
 * @param amount       - original fee amount
 * @param dueDate      - ISO date string of due date
 * @param gracePeriod  - number of days after dueDate before late fee kicks in
 * @param lateFeeAmount - flat amount OR percentage rate (based on lateFeeType)
 * @param lateFeeType  - "flat" | "percentage"
 * @returns calculated late fee (0 if not overdue or within grace period)
 */
export function calculateLateFee(
  amount: number,
  dueDate: string,
  gracePeriod: number,
  lateFeeAmount: number,
  lateFeeType: "flat" | "percentage"
): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const graceDeadline = new Date(due);
  graceDeadline.setDate(graceDeadline.getDate() + gracePeriod);

  if (today <= graceDeadline) return 0;

  if (lateFeeType === "percentage") {
    return Math.round((amount * lateFeeAmount) / 100);
  }
  return lateFeeAmount;
}

/**
 * Returns number of days overdue (negative means not yet due).
 */
export function daysOverdue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Derives PaymentStatus from paidAmount vs totalAmount.
 */
export function derivePaymentStatus(
  totalAmount: number,
  paidAmount: number
): PaymentStatus {
  if (paidAmount <= 0) return "PENDING";
  if (paidAmount >= totalAmount) return "PAID";
  return "PARTIAL";
}

/**
 * Checks whether a transactionId is required for the selected payment mode.
 */
export function requiresTransactionId(
  mode: "UPI" | "CASH" | "CARD" | "CHEQUE" | "BANK"
): boolean {
  return mode !== "CASH";
}

/**
 * Returns a human-readable label + colour class for a PaymentStatus value.
 */
export function paymentStatusBadge(status: PaymentStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        className:
          "bg-green-50 text-green-700 border border-green-200",
      };
    case "PARTIAL":
      return {
        label: "Partial",
        className:
          "bg-amber-50 text-amber-700 border border-amber-200",
      };
    case "PENDING":
    default:
      return {
        label: "Pending",
        className:
          "bg-red-50 text-red-700 border border-red-200",
      };
  }
}
