import React from "react";
import type { PendingFee } from "../types/fees.types";
import { formatCurrency, getInitialsColor } from "../utils/Fee.utils";
import { StatusBadge, ReminderDots } from "./Feebadges";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface PendingFeesTableProps {
  fees: PendingFee[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onMarkPaid: (fee: PendingFee) => void;
  onSendReminder: (fee: PendingFee) => void;
  totalRecords: number;
}

export function PendingFeesTable({
  fees,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onMarkPaid,
  onSendReminder,
  totalRecords,
}: PendingFeesTableProps) {
  const allSelected = fees.length > 0 && selectedIds.size === fees.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-indigo-50 border-b border-indigo-100 px-4 py-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
            <span className="text-sm font-semibold text-indigo-700">
              {selectedIds.size} students selected
            </span>
            <span className="text-xs text-indigo-500">READY FOR BULK ACTIONS</span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
              📤 Send Reminder
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              ⬇ Export Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 p-3">
                <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
              </TableHead>
              <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Student</TableHead>
              <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Class</TableHead>
              <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Fee Head</TableHead>
              <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Amount</TableHead>
              <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Due Date</TableHead>
              <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Status/Overdue</TableHead>
              <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Reminders</TableHead>
              <TableHead className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.map((fee) => (
              <TableRow
                key={`${fee.studentId}-${fee.feeHead}`}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  selectedIds.has(fee.studentId) ? "bg-indigo-50/30" : ""
                }`}
              >
                <TableCell className="p-3">
                  <Checkbox
                    checked={selectedIds.has(fee.studentId)}
                    onCheckedChange={() => onToggleSelect(fee.studentId)}
                  />
                </TableCell>
                <TableCell className="p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: getInitialsColor(fee.initials) }}
                    >
                      {fee.initials}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{fee.studentName}</div>
                      <div className="text-xs text-gray-400">ADM: {fee.admissionNo}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-3 text-gray-700">{fee.class}{fee.section}</TableCell>
                <TableCell className="p-3 text-gray-700">{fee.feeHead}</TableCell>
                <TableCell className="p-3 font-semibold text-gray-900">{formatCurrency(fee.amount)}</TableCell>
                <TableCell className="p-3 text-gray-500 text-xs">{fee.dueDate}</TableCell>
                <TableCell className="p-3">
                  <StatusBadge fee={fee} />
                </TableCell>
                <TableCell className="p-3">
                  <ReminderDots sent={fee.reminders.sent} total={fee.reminders.total} />
                </TableCell>
                <TableCell className="p-3">
                  <div className="flex items-center gap-1.5">
                    <Button variant="default" size="sm" className="whitespace-nowrap" onClick={() => onMarkPaid(fee)}>
                      Mark Paid
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onSendReminder(fee)} title="Send WhatsApp reminder">
                      💬
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">Showing {fees.length} of {totalRecords} records</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((p) => (
            <Button
              key={p}
              variant={p === 1 ? "default" : "outline"}
              size="icon"
              className={`w-8 h-8 rounded text-xs font-medium ${
                p === 1 ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}