import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Transaction } from "../types/fees.types";
import { formatCurrency } from "../utils/fee.utils";
import { SendFeeReminderModal } from "./SendRemainderModal";

export const TransactionsTable = ({ data }: { data: Transaction[] }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [reminderStudent, setReminderStudent] = useState<Transaction | null>(null);
  const [showBulkReminder, setShowBulkReminder] = useState(false);

  const allSelected = data.length > 0 && selected.length === data.length;

  const toggleAll = () => {
    setSelected(allSelected ? [] : data.map((t) => t.id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getStatusStyle = (status: string) => {
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

  return (
    <>
      {/* ── Bulk Action Bar ── */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 mb-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-indigo-700">
            {selected.length} student{selected.length > 1 ? "s" : ""} selected
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={() => setShowBulkReminder(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
              </svg>
              Send WhatsApp Reminder
            </Button>
            <Button
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Export Selected
            </Button>
            <button
              onClick={() => setSelected([])}
              className="px-3 py-1.5 rounded-lg text-slate-400 text-xs font-semibold hover:text-slate-600 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              {/* Select All */}
              <TableHead className="w-10 px-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Student Details
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Class
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Amount Due
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Due Date
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((t) => {
              const isSelected = selected.includes(t.id);
              return (
                <TableRow
                  key={t.id}
                  className={`transition-colors ${isSelected ? "bg-indigo-50 hover:bg-indigo-50" : "hover:bg-slate-50"}`}
                >
                  {/* Checkbox */}
                  <TableCell className="px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOne(t.id)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </TableCell>

                  {/* Student */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
                        {t.student?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{t.student}</p>
                        <p className="text-xs text-slate-400">{t.id}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Class */}
                  <TableCell className="text-sm text-slate-600">
                    {(t as any).class ?? "—"}
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="text-sm font-bold text-slate-800">
                    {formatCurrency(t.amount)}
                  </TableCell>

                  {/* Due Date */}
                  <TableCell className="text-sm text-slate-600">
                    {t.date}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${getStatusStyle((t as any).status ?? "")}`}>
                      {(t as any).status ?? t.mode}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {/* WhatsApp reminder button */}
                      <button
                        onClick={() => setReminderStudent(t)}
                        title="Send WhatsApp Reminder"
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
                        </svg>
                      </button>
                      {/* More options */}
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ── Single Student Reminder Modal ── */}
      {reminderStudent && (
        <SendFeeReminderModal
          studentName={reminderStudent.student}
          studentClass={(reminderStudent as any).class}
          amountOverdue={reminderStudent.amount}
          onClose={() => setReminderStudent(null)}
        />
      )}

      {/* ── Bulk Reminder Modal ── */}
      {showBulkReminder && (
        <SendFeeReminderModal
          studentName={`${selected.length} students`}
          onClose={() => setShowBulkReminder(false)}
        />
      )}
    </>
  );
};