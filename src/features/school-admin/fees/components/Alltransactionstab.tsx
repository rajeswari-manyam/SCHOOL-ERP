import type { FeeTransaction, PeriodSummary } from "../types/fees.types";
import { formatCurrency } from "../utils/Fee.utils";
import { PaymentModeBadge } from "../components/Feebadges";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

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

const CLASS_OPTIONS = CLASSES.map((name) => ({ label: name, value: name }));
const MODE_OPTIONS = MODES.map((mode) => ({ label: mode, value: mode }));

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
          <Input
            placeholder="Search by student, receipt no."
            value={txSearch}
            onChange={(e) => onTxSearchChange(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 text-sm">
          📅 {txDateRange}
        </Button>
        <Select
          options={CLASS_OPTIONS}
          value={txClassFilter}
          onValueChange={(value) => onTxClassChange(value)}
          className="text-sm"
        />
        <Button variant="outline" className="flex items-center gap-1.5 text-sm">
          ⬇ Export CSV
        </Button>
      </div>

      {/* Mode filter */}
      <div className="mb-4">
        <Select
          options={MODE_OPTIONS}
          value={txModeFilter}
          onValueChange={(value) => onTxModeChange(value)}
          className="text-sm"
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
              {transactions.map((tx) => (
                <TableRow key={tx.receiptNo} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <TableCell className="p-3">
                    <span className="text-indigo-600 font-semibold text-xs">{tx.receiptNo}</span>
                  </TableCell>
                  <TableCell className="p-3 text-xs text-gray-500 whitespace-pre-line">{tx.dateTime}</TableCell>
                  <TableCell className="p-3 font-medium text-gray-800">{tx.studentName}</TableCell>
                  <TableCell className="p-3 text-gray-600">{tx.class}</TableCell>
                  <TableCell className="p-3 text-gray-600">{tx.feeHead}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing 1-10 of {transactions.length} transactions this period
        </div>
      </div>
    </div>
  );
}