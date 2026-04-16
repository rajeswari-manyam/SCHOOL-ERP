import React from "react";
import type { PendingFee } from "../types/fees.types";
import { formatCurrency, getInitialsColor } from "../utils/Fee.utils";
import { StatusBadge, ReminderDots } from "./Feebadges";

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
            <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} className="rounded" />
            <span className="text-sm font-semibold text-indigo-700">
              {selectedIds.size} students selected
            </span>
            <span className="text-xs text-indigo-500">READY FOR BULK ACTIONS</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-600 transition-colors">
              📤 Send Reminder
            </button>
            <button className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              ⬇ Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-10 p-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Fee Head</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Status/Overdue</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Reminders</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr
                key={`${fee.studentId}-${fee.feeHead}`}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  selectedIds.has(fee.studentId) ? "bg-indigo-50/30" : ""
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(fee.studentId)}
                    onChange={() => onToggleSelect(fee.studentId)}
                    className="rounded"
                  />
                </td>
                <td className="p-3">
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
                </td>
                <td className="p-3 text-gray-700">{fee.class}{fee.section}</td>
                <td className="p-3 text-gray-700">{fee.feeHead}</td>
                <td className="p-3 font-semibold text-gray-900">{formatCurrency(fee.amount)}</td>
                <td className="p-3 text-gray-500 text-xs">{fee.dueDate}</td>
                <td className="p-3">
                  <StatusBadge fee={fee} />
                </td>
                <td className="p-3">
                  <ReminderDots sent={fee.reminders.sent} total={fee.reminders.total} />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onMarkPaid(fee)}
                      className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                    >
                      Mark Paid
                    </button>
                    <button
                      onClick={() => onSendReminder(fee)}
                      className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                      title="Send WhatsApp reminder"
                    >
                      💬
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">Showing {fees.length} of {totalRecords} records</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={`w-8 h-8 rounded text-xs font-medium ${
                p === 1 ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}