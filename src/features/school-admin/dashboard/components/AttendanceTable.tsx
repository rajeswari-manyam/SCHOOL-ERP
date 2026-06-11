import { motion } from "framer-motion";
import { Check, X, Bell } from "lucide-react";
import type { AttendanceClass } from "../types";

interface AttendanceTableProps {
  classes: AttendanceClass[];
  onSendReminder?: () => void;
}

export function AttendanceTable({
  classes,
  onSendReminder,
}: AttendanceTableProps) {
  const marked = classes.filter((c) => c.status === "marked").length;
  const pending = classes.filter((c) => c.status === "not_marked").length;
  const unmarked = classes
    .filter((c) => c.status === "not_marked")
    .map((c) => c.className);

  return (
    <div className="bg-[#f5f6f8] rounded-3xl overflow-hidden shadow-sm">

      {/* ─── Header ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">
          Today&apos;s Attendance — Class-wise
        </h2>

        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            {marked} Marked
          </span>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
            {pending} Pending
          </span>
        </div>
      </div>

      {/* ─── Table ───────────────────────── */}
      <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">

          {/* Head */}
          <thead className="bg-[#e9edf3]">
            <tr>
              {["CLASS", "SECTION", "TEACHER", "PRESENT", "ABSENT", "STATUS"].map(
                (col) => (
                  <th
                    key={col}
                    className="text-[11px] sm:text-xs tracking-widest font-bold text-gray-500 text-left px-5 py-3"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {classes.map((cls, i) => (
              <motion.tr
                key={cls.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition"
              >
                {/* Class */}
                <td className="px-5 py-4">
                  <span className="text-indigo-900 font-extrabold text-lg">
                    {cls.className}
                  </span>
                </td>

                {/* Section */}
                <td className="px-5 py-4">
                  <span className="text-gray-500 font-semibold text-sm">
                    {cls.section || "--"}
                  </span>
                </td>

                {/* Teacher */}
                <td className="px-5 py-4 text-gray-600 text-sm sm:text-base">
                  {cls.teacher}
                </td>

                {/* Present */}
                <td className="px-5 py-4 text-gray-800 font-semibold">
                  {cls.present ?? "--"}
                </td>

                {/* Absent */}
                <td className="px-5 py-4 text-gray-800 font-semibold">
                  {cls.absent ?? "--"}
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  {cls.status === "marked" ? (
                    <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold w-fit">
                      MARKED <Check size={12} />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-bold w-fit">
                      NOT MARKED <X size={12} />
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Footer Reminder ───────────────── */}
      {unmarked.length > 0 && (
        <div className="bg-[#f3ecd9] px-5 sm:px-6 py-4">
          <button
            onClick={onSendReminder}
            className="flex items-center gap-2 text-amber-700 font-semibold text-sm sm:text-base hover:opacity-80 transition"
          >
            <Bell size={16} />
            Send Reminder to Unmarked Classes ({unmarked.join(", ")})
          </button>
        </div>
      )}
    </div>
  );
}