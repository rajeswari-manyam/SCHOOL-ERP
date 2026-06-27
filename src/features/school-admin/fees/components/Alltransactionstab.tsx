import type { FeeTransaction, PeriodSummary } from "../types/fees.types";
import { formatCurrency } from "../utils/Fee.utils";
import { PaymentModeBadge } from "../components/Feebadges";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";

interface AllTransactionsTabProps {
  transactions: FeeTransaction[];
  periodSummary: PeriodSummary | null;
  txSearch: string;
  onTxSearchChange: (v: string) => void;
  txClassFilter: string;
  onTxClassChange: (v: string) => void;
  txSectionFilter: string;
  onTxSectionChange: (v: string) => void;
  classOptions: string[];
  txSectionOptions: string[];
  txDateRange: string;
}

function PillSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm px-4 h-11 min-w-0 w-full">
      <select
        aria-label={value}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span className="flex-1 truncate text-sm font-medium text-gray-800 dark:text-slate-200 select-none pointer-events-none">
        {value}
      </span>
      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0 pointer-events-none" />
    </div>
  );
}

export function AllTransactionsTab({
  transactions,
  periodSummary,
  txSearch,
  onTxSearchChange,
  txClassFilter,
  onTxClassChange,
  txSectionFilter,
  onTxSectionChange,
  classOptions,
  txSectionOptions,
  txDateRange,
}: AllTransactionsTabProps) {
  return (
    <div>
      {/* ── Filters — same layout as Pending Fees tab ── */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[1fr_168px_168px] mb-4">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </span>
          <Input
            type="search"
            placeholder="Search by student, receipt no."
            value={txSearch}
            onChange={(e) => onTxSearchChange(e.target.value)}
            aria-label="Search transactions"
            className="h-11 w-full rounded-2xl border border-gray-200 dark:border-slate-700
              bg-white dark:bg-slate-900 pl-10 pr-4
              text-sm text-gray-800 dark:text-slate-200
              shadow-sm placeholder:text-gray-400
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <PillSelect
          value={txClassFilter}
          onChange={onTxClassChange}
          options={classOptions}
        />
        <PillSelect
          value={txSectionFilter}
          onChange={onTxSectionChange}
          options={txSectionOptions}
        />
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Receipt No</TableHead>
                <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Date & Time</TableHead>
                <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Student</TableHead>
                <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Class</TableHead>
                <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Fee Head</TableHead>
                <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Amount</TableHead>
                <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Mode</TableHead>
                <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Sent to Parent</TableHead>
                <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-sm text-gray-400">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.receiptNo} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <TableCell className="p-3">
                      <span className="text-indigo-600 font-semibold text-xs">{tx.receiptNo}</span>
                    </TableCell>
                    <TableCell className="p-3 text-xs text-gray-500 whitespace-pre-line">{tx.dateTime}</TableCell>
                    <TableCell className="p-3 font-medium text-gray-800">{tx.studentName}</TableCell>
                    <TableCell className="p-3 text-gray-600">{tx.class}</TableCell>
                    <TableCell className="p-3 text-gray-600">{tx.feeHead || "—"}</TableCell>
                    <TableCell className="p-3 font-semibold text-gray-900">{formatCurrency(tx.amount)}</TableCell>
                    <TableCell className="p-3">
                      <PaymentModeBadge mode={tx.mode} />
                    </TableCell>
                    <TableCell className="p-3">
                      {tx.sentToParent && (
                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                          WA Sent
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:underline p-0">
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:underline p-0">
                          PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing 1-{transactions.length} of {transactions.length} transactions this period
        </div>
      </div>
    </div>
  );
}
