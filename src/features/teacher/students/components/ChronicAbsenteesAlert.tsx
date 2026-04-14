import type { Student } from "../types/my-students.types";

interface Props {
  students: Student[];
  onView: (s: Student) => void;
}

const ChronicAbsenteesAlert = ({ students, onView }: Props) => {
  if (students.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-extrabold text-red-700">
            {students.length} Chronic {students.length === 1 ? "Absentee" : "Absentees"} — Below 75% Attendance
          </p>
          <p className="text-xs text-red-400 mt-0.5">These students require immediate attention and parent communication.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {students.map((s) => (
          <button
            key={s.id}
            onClick={() => onView(s)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors group"
          >
            <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-red-700 transition-colors">{s.name}</p>
              <p className="text-[10px] text-gray-400">Roll {s.rollNo} · <span className="text-red-500 font-bold">{s.attendancePct}%</span></p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChronicAbsenteesAlert;
