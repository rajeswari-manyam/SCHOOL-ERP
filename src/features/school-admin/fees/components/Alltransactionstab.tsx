import React from "react";
import type { FeeTransaction, PeriodSummary } from "../types/fees.types";
import { formatCurrency } from "../utils/Fee.utils";
import { PaymentModeBadge } from "../components/Feebadges";

interface AllTransactionsTabProps {
  transactions: FeeTransaction[];
  periodSummary: PeriodSummary | null;
  txSearch: string;
  onTxSearchChange: (v: string) => void;
  txClassFilter: string;
  onTxClassChange: (v: string) => void;
  txModeFilter: string;
  onTxModeChange: (v: string) => void;
  txDateRange: string;
}

const CLASSES = ["All Classes", "6A", "7B", "8A", "9B", "10A", "10B", "11C", "12A"];
const MODES = [
  "All Modes (Cash, UPI, Cheque, Bank)",
  "Cash",
  "UPI",
  "Cheque",
  "Bank Transfer",
];

export function AllTransactionsTab({
  transactions,
  periodSummary,
  txSearch,
  onTxSearchChange,
  txClassFilter,
  onTxClassChange,
  txModeFilter,
  onTxModeChange,
  txDateRange,
}: AllTransactionsTabProps) {
  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by student, receipt no."
            value={txSearch}
            onChange={(e) => onTxSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 hover:bg-gray-50">
          📅 {txDateRange}
        </button>
        <select
          value={txClassFilter}
          onChange={(e) => onTxClassChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          {CLASSES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 hover:bg-gray-50">
          ⬇ Export CSV
        </button>
      </div>

      {/* Mode filter */}
      <div className="mb-4">
        <select
          value={txModeFilter}
          onChange={(e) => onTxModeChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          {MODES.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Period summary bar */}
      {periodSummary && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-4 flex items-center gap-6 flex-wrap text-sm">
          <div>
            <span className="text-indigo-400 font-semibold">THIS PERIOD: </span>
            <span className="font-bold text-gray-800">{periodSummary.totalPayments} PAYMENTS</span>
          </div>
          <div>
            <span className="text-indigo-400">COLLECTED: </span>
            <span className="font-bold text-indigo-700">{formatCurrency(periodSummary.collected)}</span>
          </div>
          <div className="text-gray-400 text-xs">BREAKDOWN</div>
          <div className="text-xs text-gray-600">
            Cash: {formatCurrency(periodSummary.breakdown.cash)} &nbsp;|&nbsp;
            UPI: {formatCurrency(periodSummary.breakdown.upi)} &nbsp;|&nbsp;
            Cheque: {formatCurrency(periodSummary.breakdown.cheque)}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Receipt No</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Fee Head</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Mode</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Sent to Parent</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.receiptNo} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <span className="text-indigo-600 font-semibold text-xs">{tx.receiptNo}</span>
                  </td>
                  <td className="p-3 text-xs text-gray-500 whitespace-pre-line">{tx.dateTime}</td>
                  <td className="p-3 font-medium text-gray-800">{tx.studentName}</td>
                  <td className="p-3 text-gray-600">{tx.class}</td>
                  <td className="p-3 text-gray-600">{tx.feeHead}</td>
                  <td className="p-3 font-semibold text-gray-900">{formatCurrency(tx.amount)}</td>
                  <td className="p-3">
                    <PaymentModeBadge mode={tx.mode} />
                  </td>
                  <td className="p-3">
                    {tx.sentToParent && (
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        WA Sent
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-indigo-600 hover:underline">View</button>
                      <button className="text-xs text-gray-500 hover:underline">PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing 1-10 of {transactions.length} transactions this period
        </div>
      </div>
    </div>
  );
}