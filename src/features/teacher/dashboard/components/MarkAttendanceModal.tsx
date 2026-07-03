import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../../../store/authStore";
import { useMarkAttendance } from "../hooks/useTeacherDashboard";
import { Modal } from "../../../../components/ui/modal";
import { Button } from "../../../../components/ui/button";
import { getAllClasses, getSectionsByClassId } from "../../../../services/class.api";
import { getStudentsByClassSection } from "../../../../services/attendance.api";

type AttStatus = "PRESENT" | "ABSENT" | "HALF_DAY";

interface Student {
  id: string;
  name: string;
  rollNo: string;
}

interface MarkAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  totalStudents?: number;
  students?: Student[];
}

const statusBtn = (active: boolean, color: string) =>
  `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${active ? `${color} text-white shadow-sm` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`;

const MarkAttendanceModal = ({ open, onClose, students, totalStudents }: MarkAttendanceModalProps) => {
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const teacherId = useAuthStore((state) => state.user?.id ?? "");

  const { data: classData } = useQuery({
    queryKey: ["teacher-dashboard", "classes"],
    queryFn: () => getAllClasses(),
    enabled: open,
    staleTime: 5 * 60_000,
  });

  const { data: sectionData } = useQuery({
    queryKey: ["teacher-dashboard", "sections", classId],
    queryFn: () => getSectionsByClassId(classId),
    enabled: Boolean(classId) && open,
    staleTime: 5 * 60_000,
  });

  const { data: studentData, isLoading: studentsLoading } = useQuery({
    queryKey: ["teacher-dashboard", "students-by-class-section", classId, sectionId],
    queryFn: () => getStudentsByClassSection(classId, sectionId),
    enabled: Boolean(classId && sectionId) && open,
    staleTime: 2 * 60_000,
  });

  const list = useMemo(() => {
    if (students?.length) return students;
    return (studentData?.data ?? []).map((item) => ({
      id: item.id,
      name: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || item.admission_number || item.id,
      rollNo: item.roll_number || item.admission_number || "--",
    }));
  }, [students, studentData]);

  const selectedClass = useMemo(
    () => (classData?.data ?? []).find((item) => item.id === classId),
    [classData, classId]
  );

  const [records, setRecords] = useState<Record<string, AttStatus>>({});
  const { mutate, isPending } = useMarkAttendance();

  useEffect(() => {
    if (!list.length) return;
    setRecords((prev) => ({
      ...prev,
      ...Object.fromEntries(list.map((s) => [s.id, prev[s.id] ?? "PRESENT" as AttStatus])),
    }));
  }, [list]);

  useEffect(() => {
    if (!open) {
      setClassId("");
      setSectionId("");
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [open]);

  const setStatus = (id: string, status: AttStatus) => setRecords((prev) => ({ ...prev, [id]: status }));
  const presentCount = Object.values(records).filter((value) => value === "PRESENT").length;
  const absentCount = Object.values(records).filter((value) => value === "ABSENT").length;
  const dateLabel = date
    ? new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
    : "Choose a date";

  const handleSubmit = () => {
    if (!classId || !sectionId || !list.length) return;

    mutate({
      classId,
      sectionId,
      teacherId,
      academicYearId: selectedClass?.academicYearId || "",
      date,
      records: list.map((s) => ({ studentId: s.id, status: records[s.id] ?? "PRESENT" })),
    }, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mark Attendance"
      description={dateLabel}
      size="sm"
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          <Button variant="ghost" onClick={onClose} type="button" size="md">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending || !classId || !sectionId || !list.length} type="button" size="md">
            {isPending ? "Submitting…" : "Submit Attendance"}
          </Button>
        </div>
      }
    >
      <div className="space-y-3 border-b border-gray-100 pb-3 mb-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="text-xs font-semibold text-gray-600">Class
            <select value={classId} onChange={(event) => { setClassId(event.target.value); setSectionId(""); }} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="">Select class</option>
              {(classData?.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.class_name}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-600">Section
            <select value={sectionId} onChange={(event) => setSectionId(event.target.value)} disabled={!classId} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100">
              <option value="">Select section</option>
              {(sectionData?.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.sectionName}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-600">Date
            <input type="date" value={date} max={new Date().toISOString().split("T")[0]} onChange={(event) => setDate(event.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </label>
        </div>
        <p className="text-xs text-gray-400">Select a class and section to load the live student roster for the chosen date. Total students: {totalStudents ?? list.length}</p>
      </div>

      <div className="flex items-center gap-4 py-2 bg-gray-50 border-b border-gray-100 text-sm font-semibold mb-2">
        <span className="text-emerald-600">✅ {presentCount} Present</span>
        <span className="text-red-500">❌ {absentCount} Absent</span>
        <Button variant="ghost" size="sm" className="ml-auto text-xs text-indigo-600 hover:text-indigo-800 font-semibold" onClick={() => setRecords(Object.fromEntries(list.map((s) => [s.id, "PRESENT" as AttStatus])))}>
          Mark All Present
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 px-2">
        {!classId || !sectionId ? (
          <p className="px-4 py-6 text-sm text-gray-500">Select a class and section to load the student roster.</p>
        ) : studentsLoading ? (
          <p className="px-4 py-6 text-sm text-gray-500">Loading students…</p>
        ) : list.length === 0 ? (
          <p className="px-4 py-6 text-sm text-gray-500">No students found for this class and section.</p>
        ) : null}
        {list.map((s) => (
          <div key={s.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">{s.rollNo}</div>
            <span className="flex-1 text-sm font-semibold text-gray-900">{s.name}</span>
            <div className="flex items-center gap-1">
              <Button type="button" size="sm" variant={records[s.id] === "PRESENT" ? "default" : "ghost"} className={statusBtn(records[s.id] === "PRESENT", "bg-emerald-500")} onClick={() => setStatus(s.id, "PRESENT")}>P</Button>
              <Button type="button" size="sm" variant={records[s.id] === "ABSENT" ? "destructive" : "ghost"} className={statusBtn(records[s.id] === "ABSENT", "bg-red-500")} onClick={() => setStatus(s.id, "ABSENT")}>A</Button>
              <Button type="button" size="sm" variant={records[s.id] === "HALF_DAY" ? "outline" : "ghost"} className={statusBtn(records[s.id] === "HALF_DAY", "bg-amber-400")} onClick={() => setStatus(s.id, "HALF_DAY")}>H</Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default MarkAttendanceModal;
