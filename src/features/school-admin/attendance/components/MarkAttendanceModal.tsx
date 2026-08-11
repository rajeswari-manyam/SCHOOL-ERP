import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAttendanceStore } from "../store";
import {
  useAttendanceClasses,
  useAttendanceSections,
  useStudentsByClassSection,
  useClassAttendanceByDate,
  useSubmitAttendance,
} from "../hooks/useAttendance";
import {
  getAllAttendance,
  updateAttendanceById,
} from "../../../../services/attendance.api";
import type { ClassTodayStudentRecord } from "../../../../services/attendance.api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { Label } from "../../../../components/ui/label";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Badge } from "../../../../components/ui/badge";

/* ─── Local state per student ─────────────────────────────────────────────── */
interface StudentRow {
  studentId: string;
  rollNo: string;
  name: string;
  isPresent: boolean;
  isMarked: boolean; // has an existing attendance record for this date
}

const MarkAttendanceModal = () => {
  const { showMarkAttendanceModal, closeMarkAttendance, prefilledClassId, prefilledSectionId } =
    useAttendanceStore();

  const todayStr = new Date().toISOString().slice(0, 10);

  // Selected IDs — initialised from store prefill when modal opens
  const [selectedClassId, setSelectedClassId] = useState(prefilledClassId);
  const [selectedSectionId, setSelectedSectionId] = useState(prefilledSectionId);
  const [date, setDate] = useState(todayStr);

  // Student rows local state
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync selections when modal opens — prefilled from the Edit button, or blank
  // when opened via the page-level "Mark Attendance" button.
  useEffect(() => {
    if (showMarkAttendanceModal) {
      setSelectedClassId(prefilledClassId);
      setSelectedSectionId(prefilledSectionId);
      setDate(new Date().toISOString().slice(0, 10));
      setRows([]);
      setSubmitError(null);
    }
  }, [showMarkAttendanceModal, prefilledClassId, prefilledSectionId]);

  // ── Fetch classes ──
  const { data: classesData, isLoading: classesLoading } = useAttendanceClasses();

  const classOptions = useMemo(
    () =>
      (classesData?.data ?? []).map((c) => ({
        label: c.class_name,
        value: c.id,
      })),
    [classesData]
  );

  // ── Fetch sections when class selected ──
  const { data: sectionsData, isLoading: sectionsLoading } = useAttendanceSections(selectedClassId);

  const sectionOptions = useMemo(
    () =>
      (sectionsData?.data ?? []).map((s) => ({
        label: s.sectionName,
        value: s.id,
      })),
    [sectionsData]
  );

  // ── Fetch students when both class + section selected ──
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useStudentsByClassSection(selectedClassId, selectedSectionId);

  // ── Fetch existing attendance for the selected date ──
  const { data: existingAttendance, isLoading: attendanceLoading } =
    useClassAttendanceByDate(selectedClassId, selectedSectionId, date);

  // Populate rows — merge students with any existing records for the date
  useEffect(() => {
    if (!studentsData?.data) return;
    // Build a set of already-marked student names (attendance_status from the date's records)
    const existingByName = new Map<string, string>(); // name → status
    (existingAttendance?.students ?? []).forEach((s: ClassTodayStudentRecord) => {
      existingByName.set(s.student_name.toLowerCase().trim(), s.attendance_status);
    });
    setRows(
      studentsData.data.map((s) => {
        const fullName = `${s.first_name} ${s.last_name}`.trim();
        const existingStatus = existingByName.get(fullName.toLowerCase());
        return {
          studentId: s.id,
          rollNo: s.roll_number,
          name: fullName,
          isPresent: existingStatus ? existingStatus !== "absent" : true,
          isMarked: existingByName.has(fullName.toLowerCase()),
        };
      })
    );
  }, [studentsData, existingAttendance]);

  // Reset section + rows when class changes
  const handleClassChange = useCallback((value: string) => {
    setSelectedClassId(value);
    setSelectedSectionId("");
    setRows([]);
    setSubmitError(null);
  }, []);

  // Reset rows when section changes
  const handleSectionChange = useCallback((value: string) => {
    setSelectedSectionId(value);
    setRows([]);
    setSubmitError(null);
  }, []);

  const toggleStudent = useCallback((studentId: string) => {
    setRows((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, isPresent: !s.isPresent } : s))
    );
  }, []);

  const markAllPresent = useCallback(() => setRows((prev) => prev.map((s) => ({ ...s, isPresent: true }))), []);
  const markAllAbsent = useCallback(() => setRows((prev) => prev.map((s) => ({ ...s, isPresent: false }))), []);

  const presentCount = useMemo(() => rows.filter((s) => s.isPresent).length, [rows]);
  const absentCount = rows.length - presentCount;

  // ── Derive labels for display ──
  const selectedClass = classesData?.data?.find((c) => c.id === selectedClassId);
  const selectedSection = sectionsData?.data?.find((s) => s.id === selectedSectionId);

  // ── Per-student update ──
  // Fetch the real attendance record ID at click time (the class-attendance response
  // returns student IDs in `id`, not the attendance record ID).
  const handleUpdateOne = useCallback(async (row: StudentRow) => {
    if (!row.isMarked) return;
    setSavingId(row.studentId);
    try {
      const res = await getAllAttendance(row.studentId, date);
      const record = (res.data ?? []).find((r) => r.date?.slice(0, 10) === date);
      if (!record?.id) {
        toast.error(`No attendance record found for ${row.name} on ${date}`);
        return;
      }
      await updateAttendanceById(record.id, {
        status: row.isPresent ? "present" : "absent",
        remarks: "",
      });
      toast.success(`Updated ${row.name} → ${row.isPresent ? "Present" : "Absent"}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? `Failed to update ${row.name}`);
    } finally {
      setSavingId(null);
    }
  }, [date]);

  // ── Submit ──
  const submitMutation = useSubmitAttendance();

  const handleSubmit = useCallback(() => {
    if (!selectedClassId || !selectedSectionId || !rows.length) return;
    setSubmitError(null);

    // teacher_id: from section's classTeacherId; academicYearId: from section or class
    const teacherId = (sectionsData?.data?.find((s) => s.id === selectedSectionId) as any)?.classTeacherId ?? "";
    const academicYearId = (sectionsData?.data?.find((s) => s.id === selectedSectionId) as any)?.academicYearId ?? "";

    const payload = {
      class_id: selectedClassId,
      section_id: selectedSectionId,
      teacher_id: teacherId,
      academicYearId,
      date,
      attendance: rows.map((s) => ({
        studentId: s.studentId,
        status: s.isPresent ? ("present" as const) : ("absent" as const),
      })),
    };

    submitMutation.mutate(payload, {
      onSuccess: () => toast.success("Attendance submitted successfully"),
      onError: (err: any) =>
        setSubmitError(err?.response?.data?.message ?? err?.message ?? "Failed to submit attendance"),
    });
  }, [selectedClassId, selectedSectionId, rows, sectionsData, submitMutation]);

  if (!showMarkAttendanceModal) return null;

  const loading = studentsLoading || attendanceLoading;
  const bothSelected = !!selectedClassId && !!selectedSectionId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <CardTitle className="text-lg">Mark Attendance</CardTitle>
            <CardDescription>Select class and section to mark attendance</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full p-0 text-gray-400 hover:text-gray-600"
            onClick={closeMarkAttendance}
          >
            <span className="text-2xl leading-none">&times;</span>
          </Button>
        </CardHeader>

        {/* Class / Section / Date row */}
        <CardContent className="px-6 py-4 bg-slate-50/60">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Class */}
            <div>
              <Label htmlFor="mark-class" className="uppercase tracking-wide text-xs text-gray-500">
                Class
              </Label>
              <Select
                id="mark-class"
                options={classOptions}
                placeholder={classesLoading ? "Loading…" : "Select class"}
                value={selectedClassId}
                onValueChange={handleClassChange}
                className="mt-2 bg-slate-50 border-slate-200"
                disabled={classesLoading}
              />
            </div>

            {/* Section */}
            <div>
              <Label htmlFor="mark-section" className="uppercase tracking-wide text-xs text-gray-500">
                Section
              </Label>
              <Select
                id="mark-section"
                options={sectionOptions}
                placeholder={
                  !selectedClassId
                    ? "Select class first"
                    : sectionsLoading
                    ? "Loading…"
                    : "Select section"
                }
                value={selectedSectionId}
                onValueChange={handleSectionChange}
                className="mt-2 bg-slate-50 border-slate-200"
                disabled={!selectedClassId || sectionsLoading}
              />
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="mark-date" className="uppercase tracking-wide text-xs text-gray-500">
                Date
              </Label>
              <Input
                id="mark-date"
                type="date"
                value={date}
                max={todayStr}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 bg-slate-50 border-slate-200"
              />
            </div>
          </div>
        </CardContent>

        {/* Submit error (e.g. holiday / non-working day) */}
        {submitError && (
          <div className="px-6 pt-4">
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
              <span className="text-red-500 text-base leading-none">⚠</span>
              <span>{submitError}</span>
            </div>
          </div>
        )}

        {/* Student list */}
        <CardContent className="flex-1 overflow-y-auto min-h-[200px]">
          {!bothSelected ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Select a class and section to view students
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading students…
              </div>
            </div>
          ) : studentsError ? (
            <div className="flex items-center justify-center h-40 text-red-500 text-sm">
              Failed to load students. Please try again.
            </div>
          ) : rows.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No students found for {selectedClass?.class_name} — Section {selectedSection?.sectionName}
            </div>
          ) : (
            <>
              {/* Stats + bulk actions */}
              <div className="px-6 py-3 border-b border-gray-100 -mx-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Student Attendance</p>
                    <p className="text-xs text-gray-500">
                      Marking {presentCount} present, {absentCount} absent
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={markAllPresent} className="text-xs h-8">
                      All Present
                    </Button>
                    <Button variant="outline" size="sm" onClick={markAllAbsent} className="text-xs h-8">
                      All Absent
                    </Button>
                  </div>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-50 -mx-6">
                {rows.map((student, idx) => (
                  <div
                    key={student.studentId}
                    className={`flex items-center justify-between px-6 py-2.5 hover:bg-gray-50 transition-colors ${
                      !student.isPresent ? "bg-red-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox
                        checked={student.isPresent}
                        onCheckedChange={() => toggleStudent(student.studentId)}
                        className="cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-gray-400 w-6 font-mono shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-sm font-medium truncate ${
                          !student.isPresent ? "text-red-600" : "text-gray-800"
                        }`}
                      >
                        {student.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={student.isPresent ? "success" : "error"}
                        className="uppercase text-[10px] px-2 py-0.5"
                      >
                        {student.isPresent ? "PRESENT" : "ABSENT"}
                      </Badge>
                      {student.isMarked && (
                        <button
                          onClick={() => handleUpdateOne(student)}
                          disabled={savingId === student.studentId}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {savingId === student.studentId ? "…" : "Update"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* WhatsApp notice */}
          <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 -mx-6 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-sm">&#9888;</span>
              <p className="text-xs text-amber-700 italic">
                Parent WhatsApp alerts will be sent automatically for all absent students.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-6 border-t border-gray-100">
          <Button variant="ghost" onClick={closeMarkAttendance} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!bothSelected || rows.length === 0 || submitMutation.isPending}
            className="w-full sm:w-auto"
          >
            {submitMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting…
              </span>
            ) : (
              "Submit Attendance"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MarkAttendanceModal;
