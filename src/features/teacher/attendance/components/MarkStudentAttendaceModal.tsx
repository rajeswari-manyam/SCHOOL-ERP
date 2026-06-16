// teacher/attendance/components/MarkStudentAttendanceModal.tsx
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import { getStudentsByClassSection, createAttendance } from "@/services/attendance.api";

// ── Types ─────────────────────────────────────────────────────────────────────
type AttStatus = "PRESENT" | "ABSENT" | "HALF_DAY";

interface StudentRow {
  id: string;
  name: string;
  rollNo: string;
}

interface MarkStudentAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  defaultClassId?: string;
  defaultSectionId?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusBtnCls = (active: boolean, activeColor: string) =>
  `w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center
   ${active ? `${activeColor} text-white shadow-sm` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`;

const StatusPill = ({ count, label, color }: { count: number; label: string; color: string }) => (
  <span className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
    {label === "Present" ? (
      <CheckCircle2 size={14} />
    ) : label === "Absent" ? (
      <XCircle size={14} />
    ) : (
      <Clock size={14} />
    )}
    {count} {label}
  </span>
);

// ── Main Component ────────────────────────────────────────────────────────────
const MarkStudentAttendanceModal = ({
  open,
  onClose,
  defaultClassId = "",
  defaultSectionId = "",
}: MarkStudentAttendanceModalProps) => {
  const teacherId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();

  // ── Filter state ────────────────────────────────────────────────────────────
  const [classId, setClassId] = useState(defaultClassId);
  const [sectionId, setSectionId] = useState(defaultSectionId);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Reset when modal opens/closes
  useEffect(() => {
    if (open) {
      setClassId(defaultClassId);
      setSectionId(defaultSectionId);
      setDate(new Date().toISOString().slice(0, 10));
      setRecords({});
      setAlreadyMarked([]);
    }
  }, [open, defaultClassId, defaultSectionId]);

  // ── Data queries ─────────────────────────────────────────────────────────────
  const { data: classData } = useQuery({
    queryKey: ["att-modal", "classes"],
    queryFn: () => getAllClasses(),           // ✅ fixed: wrapped in arrow fn
    enabled: open,
    staleTime: 5 * 60_000,
  });

  const { data: sectionData } = useQuery({
    queryKey: ["att-modal", "sections", classId],
    queryFn: () => getSectionsByClassId(classId),
    enabled: Boolean(classId) && open,
    staleTime: 5 * 60_000,
  });

  const { data: studentData, isLoading: studentsLoading } = useQuery({
    queryKey: ["att-modal", "students", classId, sectionId],
    queryFn: () => getStudentsByClassSection(classId, sectionId),
    enabled: Boolean(classId && sectionId) && open,
    staleTime: 2 * 60_000,
  });

  // ── Build student list ───────────────────────────────────────────────────────
  const students: StudentRow[] = useMemo(
    () =>
      (studentData?.data ?? []).map((item) => ({
        id: item.id,
        name:
          `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() ||
          item.admission_number ||
          item.id,
        rollNo: item.roll_number || item.admission_number || "--",
      })),
    [studentData]
  );

  // ── Attendance records ───────────────────────────────────────────────────────
  const [records, setRecords] = useState<Record<string, AttStatus>>({});
  const [alreadyMarked, setAlreadyMarked] = useState<string[]>([]);

  // Default all students to PRESENT when list loads
  useEffect(() => {
    if (!students.length) return;
    setRecords((prev) => ({
      ...Object.fromEntries(students.map((s) => [s.id, "PRESENT" as AttStatus])),
      ...prev,
    }));
  }, [students]);

  const setStatus = (id: string, status: AttStatus) =>
    setRecords((prev) => ({ ...prev, [id]: status }));

  const markAllPresent = () =>
    setRecords(Object.fromEntries(students.map((s) => [s.id, "PRESENT" as AttStatus])));

  // ── Counts ───────────────────────────────────────────────────────────────────
  const presentCount = Object.values(records).filter((v) => v === "PRESENT").length;
  const absentCount = Object.values(records).filter((v) => v === "ABSENT").length;
  const halfDayCount = Object.values(records).filter((v) => v === "HALF_DAY").length;

  // ── Submit mutation ──────────────────────────────────────────────────────────
  const selectedClass = useMemo(
    () => (classData?.data ?? []).find((c) => c.id === classId),
    [classData, classId]
  );

  const { mutate, isPending, reset } = useMutation({   // ✅ fixed: removed unused `isSuccess`
    mutationFn: async () => {
      const result = await createAttendance({
        class_id: classId,
        section_id: sectionId,
        teacher_id: teacherId,
        academicYearId: selectedClass?.academicYearId ?? "",
        date,
        attendance: students.map((s) => ({
          studentId: s.id,
          status:
            records[s.id] === "ABSENT"
              ? ("absent" as const)
              : ("present" as const),
        })),
      });

      const raw = result as unknown as {
        errors?: { data?: { studentId?: string }; error?: string }[];
      };
      const ids = (raw?.errors ?? [])
        .filter((e) => e?.error?.toLowerCase().includes("already marked"))
        .map((e) => e?.data?.studentId ?? "");

      return { alreadyMarkedIds: ids };
    },
    onSuccess: ({ alreadyMarkedIds }) => {
      if (alreadyMarkedIds.length) {
        setAlreadyMarked(alreadyMarkedIds);
      } else {
        queryClient.invalidateQueries({ queryKey: ["attendance"] });
        onClose();
      }
    },
  });

  const handleSubmit = () => {
    if (!classId || !sectionId || !students.length) return;
    reset();
    mutate();
  };

  // ── Date label ────────────────────────────────────────────────────────────────
  const dateLabel = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "Choose a date";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mark Attendance"
      description={dateLabel}
      size="sm"
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          <Button variant="ghost" onClick={onClose} type="button" size="md">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !classId || !sectionId || !students.length}
            type="button"
            size="md"
          >
            {isPending ? "Submitting…" : "Submit Attendance"}
          </Button>
        </div>
      }
    >
      {/* ── Filter row ──────────────────────────────────────────────────────── */}
      <div className="space-y-3 border-b border-gray-100 pb-4 mb-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Class */}
          <label className="text-xs font-semibold text-gray-600">
            Class
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setSectionId("");
                setRecords({});
              }}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Select class</option>
              {(classData?.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.class_name}
                </option>
              ))}
            </select>
          </label>

          {/* Section */}
          <label className="text-xs font-semibold text-gray-600">
            Section
            <select
              value={sectionId}
              onChange={(e) => {
                setSectionId(e.target.value);
                setRecords({});
              }}
              disabled={!classId}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100"
            >
              <option value="">Select section</option>
              {(sectionData?.data ?? []).map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.sectionName}    {/* ✅ fixed: was sec.section_name */}
                </option>
              ))}
            </select>
          </label>

          {/* Date */}
          <label className="text-xs font-semibold text-gray-600">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </label>
        </div>
      </div>

      {/* ── Already-marked warning ───────────────────────────────────────────── */}
      {alreadyMarked.length > 0 && (
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700 font-medium">
          ⚠️ {alreadyMarked.length} student(s) already had attendance marked for this date.
          The rest were saved successfully.
        </div>
      )}

      {/* ── Summary row ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 py-2 bg-gray-50 rounded-xl px-3 mb-3 border border-gray-100">
        <StatusPill count={presentCount} label="Present" color="text-emerald-600" />
        <StatusPill count={absentCount} label="Absent" color="text-red-500" />
        {halfDayCount > 0 && (
          <StatusPill count={halfDayCount} label="Half Day" color="text-amber-500" />
        )}
        <button
          onClick={markAllPresent}
          className="ml-auto text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Mark All Present
        </button>
      </div>

      {/* ── Student list ─────────────────────────────────────────────────────── */}
      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto -mx-1 px-1">
        {!classId || !sectionId ? (
          <p className="py-8 text-center text-sm text-gray-400">
            Select a class and section to load students.
          </p>
        ) : studentsLoading ? (
          <div className="space-y-2 py-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No students found for this class and section.
          </p>
        ) : (
          students.map((s, idx) => {
            const isAlreadyMarked = alreadyMarked.includes(s.id);
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
                  isAlreadyMarked ? "opacity-50" : ""
                }`}
              >
                {/* Roll number badge */}
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 border border-indigo-100">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">Roll #{s.rollNo}</p>
                </div>

                {/* P / A / H buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setStatus(s.id, "PRESENT")}
                    className={statusBtnCls(records[s.id] === "PRESENT", "bg-emerald-500")}
                    title="Present"
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(s.id, "ABSENT")}
                    className={statusBtnCls(records[s.id] === "ABSENT", "bg-red-500")}
                    title="Absent"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(s.id, "HALF_DAY")}
                    className={statusBtnCls(records[s.id] === "HALF_DAY", "bg-amber-400")}
                    title="Half Day"
                  >
                    H
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};

export default MarkStudentAttendanceModal;