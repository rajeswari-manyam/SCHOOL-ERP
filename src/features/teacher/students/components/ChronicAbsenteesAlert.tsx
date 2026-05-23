import { AlertTriangle } from "lucide-react";
import type { Student } from "../types/my-students.types";
import { Button } from "@/components/ui/button";

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
          <AlertTriangle size={12} className="text-white" strokeWidth={2.5} />
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
          <Button
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
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChronicAbsenteesAlert;
