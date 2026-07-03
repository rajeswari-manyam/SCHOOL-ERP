import { useState, useCallback, useMemo } from "react";
import type {
  FeeTransaction,
  PaymentStatus,
  PaymentMode,
} from "../types/fees.types";
import {
  derivePaymentStatus,
  
} from "../utils/lateFee.utils";
// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecordPaymentInput {
  feeId: string;
  studentId: string;
  studentName: string;
  className: string;
  totalAmount: number;
  paymentAmount: number;
  paymentMode: PaymentMode;
  transactionId?: string;
  receiptNo: string;
  paymentDate: string;
  feeHead?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useFeeTransactions
 *
 * Manages fee transaction state including partial payments.
 * Each call to recordPayment() creates a new transaction and updates
 * the running paidAmount / remainingAmount for that fee.
 */
export function useFeeTransactions() {
  const [transactions, setTransactions] =
    useState<FeeTransaction[]>([]);

  /**
   * Running totals per fee ID: { [feeId]: paidSoFar }
   */
  const [feePaymentMap, setFeePaymentMap] = useState<
    Record<string, { paid: number; total: number }>
  >({});

  // ── Derived aggregates ────────────────────────────────────────────────

  const totalCollected = useMemo(
    () => transactions.reduce((sum, t) => sum + t.paidAmount, 0),
    [transactions]
  );

  const totalPending = useMemo(
    () => transactions.reduce((sum, t) => sum + t.remainingAmount, 0),
    [transactions]
  );

  const transactionsByStatus = useMemo(() => {
    const map: Record<PaymentStatus, FeeTransaction[]> = {
      PAID: [],
      PARTIAL: [],
      PENDING: [],
    };
    for (const t of transactions) {
      map[t.status].push(t);
    }
    return map;
  }, [transactions]);

  // ── Actions ───────────────────────────────────────────────────────────

  /**
   * Record a new payment (full or partial).
   * Updates feePaymentMap so subsequent payments reflect the running balance.
   */
  const recordPayment = useCallback(
    (input: RecordPaymentInput): FeeTransaction => {
      const prevPaid = feePaymentMap[input.feeId]?.paid ?? 0;
      const newPaid = prevPaid + input.paymentAmount;
      const remaining = Math.max(0, input.totalAmount - newPaid);
      const status = derivePaymentStatus(input.totalAmount, newPaid);

      const transaction: FeeTransaction = {
        id: `txn-${Date.now()}`,
        date: input.paymentDate,
        student: input.studentName,
        className: input.className,
        amount: input.totalAmount,
        paidAmount: input.paymentAmount,
        remainingAmount: remaining,
        status,
        mode: input.paymentMode,
        transactionId: input.transactionId,
        receiptNo: input.receiptNo,
        feeHead: input.feeHead,
      };

      setTransactions((prev) => [transaction, ...prev]);
      setFeePaymentMap((prev) => ({
        ...prev,
        [input.feeId]: { paid: newPaid, total: input.totalAmount },
      }));

      return transaction;
    },
    [feePaymentMap]
  );

  /**
   * Get the current payment status for a given fee ID.
   */
  const getFeePaymentStatus = useCallback(
    (feeId: string, totalAmount: number): PaymentStatus => {
      const paid = feePaymentMap[feeId]?.paid ?? 0;
      return derivePaymentStatus(totalAmount, paid);
    },
    [feePaymentMap]
  );

  /**
   * Get how much has been paid so far for a fee.
   */
  const getPaidAmount = useCallback(
    (feeId: string): number => feePaymentMap[feeId]?.paid ?? 0,
    [feePaymentMap]
  );

  /**
   * Filter transactions by status.
   */
  const filterByStatus = useCallback(
    (status: PaymentStatus | "ALL") => {
      if (status === "ALL") return transactions;
      return transactions.filter((t) => t.status === status);
    },
    [transactions]
  );

  return {
    transactions,
    totalCollected,
    totalPending,
    transactionsByStatus,
    recordPayment,
    getFeePaymentStatus,
    getPaidAmount,
    filterByStatus,
  };
}

// ─── Late-fee aware fee list hook ─────────────────────────────────────────────

/**
 * useFeeListWithLateFees
 *
 * Returns fee list enriched with computed lateFee based on
 * dueDate, gracePeriod, and lateFeeAmount / lateFeeType from
 * the fee structure.
 */
export function useFeeListWithLateFees() {
  /**
   * In a real app this would fetch from the API.
   * For now we compute from mock data.
   */
  const enrichedFees = useMemo(() => {
    // Import actual fee data in your implementation
    return [] as Array<{
      id: string;
      label: string;
      amount: number;
      paidAmount: number;
      remainingAmount: number;
      overdue: boolean;
      lateFee: number;
      dueDate: string;
    }>;
  }, []);

  return { enrichedFees };
}
