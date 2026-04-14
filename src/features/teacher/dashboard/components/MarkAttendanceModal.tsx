import { useState } from "react";
import { useMarkAttendance } from "../hooks/useTeacherDashboard";

type AttStatus = "PRESENT" | "ABSENT" | "HALF_DAY";

interface Student { id: string; name: string; rollNo: string; }

interface MarkAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  totalStudents: number;
  students?: Student[];
}

// Placeholder students when real data isn't passed
const PLACEHOLDER: Student[] = Array.from({ length: 8 }, (_, i) => ({
  id: `s${i + 1}`,
  name: ["Arjun Sharma","Priya Reddy","Ravi Kumar","Anjali Singh","Vikram Mehta","Deepa Rao","Suresh Patil","Kavitha Nair"][i],
  rollNo: String(i + 1).padStart(2, "0"),
}));

const statusBtn = (active: boolean, color: string) =>
  `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${active ? `${color} text-white shadow-sm` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`;

const MarkAttendanceModal = ({ open, onClose, totalStudents, students }: MarkAttendanceModalProps) => {
  const list = students ?? PLACEHOLDER;
  const [records, setRecords] = useState<Record<string, AttStatus>>(
    () => Object.fromEntries(list.map((s) => [s.id, "PRESENT" as AttStatus]))
  );
  const { mutate, isPending } = useMarkAttendance();

  if (!open) return null;

  const setStatus = (id: string, status: AttStatus) =>
    setRecords((p) => ({ ...p, [id]: status }));

  const presentCount = Object.values(records).filter((v) => v === "PRESENT").length;
  const absentCount  = Object.values(records).filter((v) => v === "ABSENT").length;

  const handleSubmit = () => {
    mutate({
      classId: "class-1",
      date: new Date().toISOString().slice(0, 10),
      records: list.map((s) => ({ studentId: s.id, status: records[s.id] })),
    }, { onSuccess: onClose });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Mark Attendance</h2>
              <p className="text-sm text-gray-400 mt-0.5">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Summary bar */}
          <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0 text-sm font-semibold">
            <span className="text-emerald-600">✅ {presentCount} Present</span>
            <span className="text-red-500">❌ {absentCount} Absent</span>
            <button onClick={() => setRecords(Object.fromEntries(list.map((s) => [s.id, "PRESENT"])))}
              className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-semibold">Mark All Present</button>
          </div>

          {/* Student list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 px-2">
            {list.map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {s.rollNo}
                </div>
                <span className="flex-1 text-sm font-semibold text-gray-900">{s.name}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setStatus(s.id, "PRESENT")} className={statusBtn(records[s.id] === "PRESENT", "bg-emerald-500")}>P</button>
                  <button onClick={() => setStatus(s.id, "ABSENT")}  className={statusBtn(records[s.id] === "ABSENT", "bg-red-500")}>A</button>
                  <button onClick={() => setStatus(s.id, "HALF_DAY")} className={statusBtn(records[s.id] === "HALF_DAY", "bg-amber-400")}>H</button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Cancel</button>
            <button onClick={handleSubmit} disabled={isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm">
              {isPending ? "Submitting…" : "Submit Attendance"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkAttendanceModal;
