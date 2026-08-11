import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Bell } from 'lucide-react';
import type { AttendanceClass } from '../types';

const PAGE_SIZE = 3;

interface AttendanceTableProps {
  classes: AttendanceClass[];
  onSendReminder?: () => void;
}

export function AttendanceTable({ classes, onSendReminder }: AttendanceTableProps) {
  const [showAll, setShowAll] = useState(false);

  const marked   = classes.filter((c) => c.status === 'marked').length;
  const pending  = classes.filter((c) => c.status === 'not_marked').length;
  const unmarked = classes.filter((c) => c.status === 'not_marked').map((c) =>
    c.section ? `${c.className}${c.section}` : c.className
  );
  const visible = showAll ? classes : classes.slice(0, PAGE_SIZE);

  return (
    <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col bg-white">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <h2 className="text-xs font-medium text-gray-700">
          Today's Attendance — Class-wise
        </h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {marked} Marked
          </span>
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {pending} Pending
          </span>
        </div>
      </div>

      {/* ── Table (sm and up) ── */}
      <div className="overflow-x-auto flex-1 hidden sm:block">
        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <p className="text-xs text-gray-400">No attendance data for today</p>
          </div>
        ) : (
          <table className="w-full min-w-[380px]">
            <thead>
              <tr className="border-b border-gray-100" style={{ background: '#EEF2FF' }}>
                {['CLASS', 'TEACHER', 'PRESENT', 'ABSENT', 'STATUS'].map((col) => (
                  <th key={col} className="px-3 py-2 text-left text-[9px] uppercase tracking-widest text-gray-400">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((cls, i) => (
                <motion.tr
                  key={cls.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-3 py-2">
                    <span className="text-xs font-semibold text-indigo-700">
                      {cls.className}{cls.section ? cls.section : ''}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-600">{cls.teacher}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-700 tabular-nums">{cls.present ?? '--'}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-700 tabular-nums">{cls.absent ?? '--'}</span>
                  </td>
                  <td className="px-3 py-2">
                    {cls.status === 'marked' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-medium">
                        <Check size={10} strokeWidth={2.5} /> MARKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 text-[10px] font-medium">
                        <X size={10} strokeWidth={2.5} /> NOT MARKED
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Card list (mobile only) — avoids horizontal scroll on narrow screens ── */}
      <div className="flex-1 sm:hidden">
        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <p className="text-xs text-gray-400">No attendance data for today</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {visible.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-indigo-700">
                    {cls.className}{cls.section ? cls.section : ''}
                  </span>
                  {cls.status === 'marked' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-medium shrink-0">
                      <Check size={10} strokeWidth={2.5} /> MARKED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-500 text-[10px] font-medium shrink-0">
                      <X size={10} strokeWidth={2.5} /> NOT MARKED
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-[11px] text-gray-500 truncate">{cls.teacher}</span>
                  <span className="text-[11px] text-gray-500 tabular-nums shrink-0">
                    {cls.present ?? '--'} present · {cls.absent ?? '--'} absent
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Show more / less ── */}
      {classes.length > PAGE_SIZE && (
        <div className="border-t border-gray-100 px-4 py-1.5 text-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-[10px] text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            {showAll ? 'Show Less ▲' : `Show More (${classes.length - PAGE_SIZE} more) ▼`}
          </button>
        </div>
      )}

      {/* ── Footer: Send Reminder ── */}
      {unmarked.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2">
          <button
            onClick={onSendReminder}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Bell size={11} />
            Send Reminder to Unmarked Classes ({unmarked.join(', ')})
          </button>
        </div>
      )}
    </div>
  );
}
