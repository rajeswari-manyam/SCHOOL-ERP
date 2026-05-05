import { useState } from "react";

import { useMarkAttendance } from "../hooks/useTeacherDashboard";
import { Modal } from "../../../../components/ui/modal";
import { Button } from "../../../../components/ui/button";

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

const MarkAttendanceModal = ({ open, onClose,  students }: MarkAttendanceModalProps) => {
  const list = students ?? PLACEHOLDER;
  const [records, setRecords] = useState<Record<string, AttStatus>>(
    () => Object.fromEntries(list.map((s) => [s.id, "PRESENT" as AttStatus]))
  );
  const { mutate, isPending } = useMarkAttendance();



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
    <Modal
      open={open}
      onClose={onClose}
      title="Mark Attendance"
      description={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      size="sm"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" onClick={onClose} type="button" size="md">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} type="button" size="md">
            {isPending ? "Submitting…" : "Submit Attendance"}
          </Button>
        </div>
      }
    >
      {/* Summary bar */}
      <div className="flex items-center gap-4 py-2 bg-gray-50 border-b border-gray-100 text-sm font-semibold mb-2">
        <span className="text-emerald-600">✅ {presentCount} Present</span>
        <span className="text-red-500">❌ {absentCount} Absent</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          onClick={() => setRecords(Object.fromEntries(list.map((s) => [s.id, "PRESENT"])))}
        >
          Mark All Present
        </Button>
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
              <Button
                type="button"
                size="sm"
                variant={records[s.id] === "PRESENT" ? "default" : "ghost"}
                className={statusBtn(records[s.id] === "PRESENT", "bg-emerald-500")}
                onClick={() => setStatus(s.id, "PRESENT")}
              >
                P
              </Button>
              <Button
                type="button"
                size="sm"
                variant={records[s.id] === "ABSENT" ? "destructive" : "ghost"}
                className={statusBtn(records[s.id] === "ABSENT", "bg-red-500")}
                onClick={() => setStatus(s.id, "ABSENT")}
              >
                A
              </Button>
              <Button
                type="button"
                size="sm"
                variant={records[s.id] === "HALF_DAY" ? "outline" : "ghost"}
                className={statusBtn(records[s.id] === "HALF_DAY", "bg-amber-400")}
                onClick={() => setStatus(s.id, "HALF_DAY")}
              >
                H
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default MarkAttendanceModal;
