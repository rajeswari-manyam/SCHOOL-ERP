import { motion } from 'framer-motion';
import { Check, X, Bell } from 'lucide-react';
import type { AttendanceClass } from '../types';

interface AttendanceTableProps {
  classes: AttendanceClass[];
  onSendReminder?: () => void;
}

export function AttendanceTable({ classes, onSendReminder }: AttendanceTableProps) {
  const marked  = classes.filter((c) => c.status === 'marked').length;
  const pending = classes.filter((c) => c.status === 'not_marked').length;
  const unmarked = classes.filter((c) => c.status === 'not_marked').map((c) => c.className);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
        <h2 className="text-sm sm:text-base font-bold text-gray-900">
          Today&apos;s Attendance — Class-wise
        </h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {marked} Marked
          </span>
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {pending} Pending
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['CLASS', 'SECTION', 'TEACHER', 'PRESENT', 'ABSENT', 'STATUS'].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, i) => (
              <motion.tr
                key={cls.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-4 py-3.5">
                  <span className="text-sm font-bold text-gray-900">{cls.className}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-gray-500 font-medium">{cls.section || '—'}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-gray-700">{cls.teacher}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-semibold text-gray-800 tabular-nums">{cls.present ?? '—'}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-semibold text-gray-800 tabular-nums">{cls.absent ?? '—'}</span>
                </td>
                <td className="px-4 py-3.5">
                  {cls.status === 'marked' ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                      <Check size={11} strokeWidth={2.5} /> MARKED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                      <X size={11} strokeWidth={2.5} /> NOT MARKED
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer reminder ── */}
      {unmarked.length > 0 && (
        <div className="border-t border-amber-100 bg-amber-50 px-5 py-3">
          <button
            onClick={onSendReminder}
            className="inline-flex items-center gap-2 text-amber-700 font-semibold text-xs sm:text-sm hover:text-amber-800 transition-colors"
          >
            <Bell size={14} />
            Send Reminder to Unmarked Classes ({unmarked.join(', ')})
          </button>
        </div>
      )}
    </div>
  );
}
