import { useState } from "react";
import { format, getDaysInMonth } from "date-fns";
import type { AttendanceRecord, AttendanceMark } from "../types/marketing.types";
import { RepAvatar } from "./RepBadges";
import { useAttendance } from "../hooks/useMarketing";
import AttendanceModal from "./AttendanceModal";

const dotColors: Record<AttendanceMark, string> = {
  P: "bg-emerald-500", A: "bg-red-500", H: "bg-amber-400", "-": "bg-transparent",
};
const dotTitles: Record<AttendanceMark, string> = {
  P: "Present", A: "Absent", H: "Half Day", "-": "Weekend/Holiday",
};

const AttendanceTab = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: recordsData, isLoading } = useAttendance(month, year);

  const rawRecords = recordsData as unknown;
  const records: AttendanceRecord[] = Array.isArray(rawRecords)
    ? rawRecords
    : (rawRecords as { data?: AttendanceRecord[]; records?: AttendanceRecord[] })?.data ??
      (rawRecords as { data?: AttendanceRecord[]; records?: AttendanceRecord[] })?.records ?? [];

  const daysCount = getDaysInMonth(new Date(year, month - 1));
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className="flex flex-col gap-6">
      {/* Month nav + legend + mark button */}
  
      <div className="flex items-center justify-between bg-gray-100 rounded-2xl px-5 py-3">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="font-bold text-gray-900 text-base min-w-[110px] text-center">
            {format(new Date(year, month - 1), "MMMM yyyy")}
          </span>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <div className="flex items-center gap-4 ml-4">
            {(["P","A","H"] as AttendanceMark[]).map((m) => (
              <span key={m} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span className={`w-2.5 h-2.5 rounded-full ${dotColors[m]}`} />
                {dotTitles[m]}
              </span>
            ))}
          </div>
        </div>

        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Mark Today's Attendance
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Loading attendance…</div>
        ) : (
          <table className="w-full" style={{ minWidth: `${120 + daysCount * 32}px` }}>
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 text-left min-w-[140px]">Representative</th>
                {days.map((d) => (
                  <th key={d} className="text-[11px] font-semibold text-gray-400 w-8 py-3 text-center">{d}</th>
                ))}
                <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-3 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(records ?? []).map((rec) => (
                <tr key={rec.repId} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <RepAvatar initials={rec.initials} size="sm" />
                      <span className="text-sm font-semibold text-gray-900">{rec.repName}</span>
                    </div>
                  </td>
                  {days.map((d) => {
                    const mark = rec.days[d] ?? "-";
                    return (
                      <td key={d} className="py-4 text-center">
                        {mark === "-" ? (
                          <span className="text-gray-200 text-xs select-none">—</span>
                        ) : (
                          <span title={dotTitles[mark]} className={`inline-block w-4 h-4 rounded-full ${dotColors[mark]}`} />
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-4 text-right text-xs font-bold text-emerald-600">{rec.totalPresent}P</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info note */}
      <div className="bg-gray-100 rounded-2xl px-5 py-4 max-w-md">
        <p className="text-sm font-bold text-gray-600 mb-1">Automated Field Validation</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Attendance indicators are automatically updated based on the representative's mobile app check-in location and time.
          Manual overrides require Super Admin approval.
        </p>
      </div>

      <AttendanceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default AttendanceTab;
