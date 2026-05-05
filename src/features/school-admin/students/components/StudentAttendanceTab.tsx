import { Button } from "@/components/ui/button";
import type { StudentAttendanceDay } from "../types/student.types";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const DayCell = ({ day }: { day: StudentAttendanceDay | null }) => {
  if (!day) return <div className="w-8 h-8" />;
  const cls = !day.status ? "bg-gray-100 text-gray-300" :
    day.status === "present" ? "bg-emerald-500 text-white" :
    day.status === "absent" ? "bg-red-400 text-white" :
    "bg-amber-100 text-amber-500";
  const date = new Date(day.date).getDate();
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${cls}`}>
      {date}
    </div>
  );
};

const StudentAttendanceTab = ({ attendance }: { attendance: StudentAttendanceDay[] }) => {
  const present = attendance.filter(d => d.status === "present").length;
  const absent = attendance.filter(d => d.status === "absent").length;
  const holidays = attendance.filter(d => d.status === "holiday").length;

  // Build calendar rows for April 2025
  // April 1 is Tuesday (index 1 in 0=Mon grid)
  const calendarCells: (StudentAttendanceDay | null)[] = [];
  // April 1 = Tuesday => offset 1
  for (let i = 0; i < 1; i++) calendarCells.push(null);
  attendance.forEach(d => {
    const date = new Date(d.date);
    if (date.getFullYear() === 2025 && date.getMonth() === 3) {
      calendarCells.push(d);
    }
  });

  const rows: (StudentAttendanceDay | null)[][] = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    const row = calendarCells.slice(i, i + 7);
    while (row.length < 7) row.push(null);
    rows.push(row);
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </Button>
          <h3 className="font-bold text-gray-800">April 2025</h3>
          <Button variant="ghost" size="sm" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </Button>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4">
          {[["bg-emerald-500","Present"],["bg-red-400","Absent"],["bg-amber-200","Holiday"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${c}`} />
              <span className="text-xs text-gray-500">{l}</span>
            </div>
          ))}
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d}</div>)}
        </div>
        {/* Calendar rows */}
        <div className="space-y-1">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-7 gap-1">
              {row.map((cell, j) => (
                <div key={j} className="flex justify-center">
                  <DayCell day={cell} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "This Month", val: present, sub: "Present", cls: "text-emerald-600" },
          { label: "This Month", val: absent, sub: "Absent", cls: "text-red-500" },
          { label: "This Month", val: holidays, sub: "Holiday", cls: "text-amber-500" },
          { label: "This Year", val: "180/204", sub: "Total", cls: "text-gray-700" },
        ].map(({ label, val, sub, cls }) => (
          <div key={sub} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${cls}`}>{val}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Absence history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h4 className="font-bold text-gray-800 mb-4">Absence History — This Year</h4>
        <div className="border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 py-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
            <span>Date</span>
            <span>Day</span>
            <span>Parent Notified</span>
          </div>
          <div className="py-3 text-center text-xs text-gray-400">
            {absent === 0 ? "No absences recorded." : (
              <div className="grid grid-cols-3 gap-4 py-2 text-sm text-gray-600 border-t border-gray-50">
                <span>5 Apr 2025</span>
                <span>Saturday</span>
                <span className="text-gray-400">Not available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceTab;