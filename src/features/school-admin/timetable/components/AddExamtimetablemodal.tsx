import { useEffect, useState, useCallback } from "react";
import { X, Loader2, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { CreateExamTimetablePayload, ExamEntry } from "../types/timetable.types";
import { useExamNameOptions } from "../hooks/useTimetable";
import { getAllClasses, getSectionsByClassId } from "../../../../services/class.api";
import { getSubjectsBySectionId } from "../../../../services/subject.api";
import { getAllStaff } from "../../../../services/staff.api";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { fetchAllWorkingDays } from "@/services/working-days.api";
import type { WorkingDayRecord } from "@/services/working-days.api";
import type { BulkExamTimetablePayload } from "@/services/examtimetable.api";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface DropdownOption { value: string; label: string; }

interface BulkEntry {
  id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
}

let _counter = 0;
const createEntry = (): BulkEntry => ({
  id: `ex_${++_counter}`,
  exam_date: "",
  start_time: "09:00",
  end_time: "12:00",
});

interface AddExamTimetableModalProps {
  open: boolean;
  isSaving?: boolean;
  editData?: ExamEntry | null;
  onClose: () => void;
  onSave: (payload: BulkExamTimetablePayload) => void;
}

const AddExamTimetableModal: React.FC<AddExamTimetableModalProps> = ({
  open, isSaving, editData, onClose, onSave,
}) => {
  const isEditMode = !!editData;

  // ── Common fields ─────────────────────────────────────────
  const [classId,           setClassId]           = useState("");
  const [sectionId,         setSectionId]         = useState("");
  const [subjectId,         setSubjectId]         = useState("");
  const [examNameId,        setExamNameId]        = useState("");
  const [academicYearId,    setAcademicYearId]    = useState("");
  const [schoolWorkingDayId, setSchoolWorkingDayId] = useState("");

  // ── Edit-mode single fields ───────────────────────────────
  const [editDate,  setEditDate]  = useState("");
  const [editStart, setEditStart] = useState("09:00");
  const [editEnd,   setEditEnd]   = useState("12:00");
  const [teacherId, setTeacherId] = useState("");
  const [roomNo,    setRoomNo]    = useState("");

  // ── Bulk entries ──────────────────────────────────────────
  const [entries, setEntries] = useState<BulkEntry[]>([]);

  // ── Dropdown options ──────────────────────────────────────
  const [classOptions,   setClassOptions]   = useState<DropdownOption[]>([]);
  const [sectionOptions, setSectionOptions] = useState<DropdownOption[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<DropdownOption[]>([]);
  const [staffOptions,   setStaffOptions]   = useState<DropdownOption[]>([]);
  const [workingDays,    setWorkingDays]    = useState<WorkingDayRecord[]>([]);

  // ── Loading ───────────────────────────────────────────────
  const [loadingClasses,  setLoadingClasses]  = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // ── Validation errors ─────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── External data ─────────────────────────────────────────
  const { years: academicYears, loading: loadingAcYears } = useAcademicYears();
  const { data: examNameOptions = [], isLoading: loadingExamNames } = useExamNameOptions();

  // ── Working day set for holiday check ─────────────────────
  const activeWD = workingDays.find((wd) => wd.academicYearId === academicYearId);
  const workingDayNames = activeWD?.selected_days ?? [];

  const isHoliday = useCallback((dateStr: string) => {
    if (!dateStr || workingDayNames.length === 0) return null;
    const dayName = DAY_NAMES[new Date(dateStr + "T00:00:00").getDay()];
    return !workingDayNames.some((d) => d.toLowerCase() === dayName.toLowerCase())
      ? dayName : null;
  }, [workingDayNames]);

  // ── Fetch on open ─────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    fetchAllWorkingDays().then(setWorkingDays).catch(() => {});

    const stripSec = (t: string) => t?.length === 8 ? t.slice(0, 5) : (t ?? "");
    const defaultAcYear = academicYears.find((y) => y.active)?.id ?? academicYears[0]?.id ?? "";

    if (isEditMode && editData) {
      setClassId(editData.class_id ?? "");
      setSectionId(editData.section_id ?? "");
      setSubjectId(editData.subject_id ?? "");
      setExamNameId(editData.examnameid ?? "");
      setAcademicYearId(editData.academicYearId ?? defaultAcYear);
      setSchoolWorkingDayId("");
      setEditDate(editData.date ?? "");
      setEditStart(stripSec(editData.startTime));
      setEditEnd(stripSec(editData.endTime));
      setTeacherId(editData.teacher_id ?? "");
      setRoomNo(editData.venue ?? "");
    } else {
      setClassId(""); setSectionId(""); setSubjectId("");
      setExamNameId(""); setAcademicYearId(defaultAcYear); setSchoolWorkingDayId("");
      setTeacherId(""); setRoomNo("");
      setEntries([createEntry()]);
    }
    setSectionOptions([]); setSubjectOptions([]);
    setErrors({});

    setLoadingClasses(true);
    getAllClasses()
      .then((res) => setClassOptions(res.data.map((c) => ({ value: c.id, label: c.class_name }))))
      .catch(console.error)
      .finally(() => setLoadingClasses(false));

    getAllStaff()
      .then((res) => setStaffOptions((res.data ?? []).map((s: any) => ({ value: s.id, label: s.name ?? s.staff_name ?? s.id }))))
      .catch(console.error);

  }, [open]);

  // ── Cascade: class → sections ─────────────────────────────
  useEffect(() => {
    if (!classId) { setSectionOptions([]); setSubjectOptions([]); setSectionId(""); setSubjectId(""); return; }
    setLoadingSections(true);
    setSectionOptions([]); setSubjectOptions([]);
    if (!isEditMode) { setSectionId(""); setSubjectId(""); }
    getSectionsByClassId(classId)
      .then((res) => setSectionOptions(res.data.map((s) => ({ value: s.id, label: s.sectionName ?? "" }))))
      .catch(console.error)
      .finally(() => setLoadingSections(false));
  }, [classId]);

  // ── Cascade: section → subjects ───────────────────────────
  useEffect(() => {
    if (!sectionId) { setSubjectOptions([]); if (!isEditMode) setSubjectId(""); return; }
    setLoadingSubjects(true);
    setSubjectOptions([]); if (!isEditMode) setSubjectId("");
    getSubjectsBySectionId(sectionId)
      .then((res) => setSubjectOptions(res.data.map((s) => ({ value: s.id, label: s.subject_name ?? s.id }))))
      .catch(console.error)
      .finally(() => setLoadingSubjects(false));
  }, [sectionId]);

  // ── Auto-set schoolWorkingDayId ───────────────────────────
  useEffect(() => {
    if (academicYearId && workingDays.length > 0) {
      const wd = workingDays.find((d) => d.academicYearId === academicYearId);
      if (wd) setSchoolWorkingDayId(wd.id);
    }
  }, [academicYearId, workingDays]);

  // ── Entry helpers ─────────────────────────────────────────
  const addEntry = useCallback(() => setEntries((p) => [...p, createEntry()]), []);
  const removeEntry = useCallback((id: string) => setEntries((p) => p.filter((e) => e.id !== id)), []);
  const updateEntry = useCallback((id: string, field: keyof BulkEntry, value: string) =>
    setEntries((p) => p.map((e) => e.id === id ? { ...e, [field]: value } : e)), []);

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!classId)       errs.class_id    = "Class is required";
    if (!sectionId)     errs.section_id  = "Section is required";
    if (!subjectId)     errs.subject_id  = "Subject is required";
    if (!examNameId)    errs.examNameId  = "Exam name is required";
    if (!academicYearId) errs.academicYearId = "Academic year is required";
    if (isEditMode) {
      if (!editDate)  errs.editDate = "Exam date is required";
    } else {
      entries.forEach((e, i) => {
        if (!e.exam_date) errs[`date_${i}`] = "Date required";
      });
      if (entries.length === 0) errs.entries = "Add at least one entry";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!validate()) return;
    const toSec = (t: string) => t.split(":").length === 2 ? `${t}:00` : t;

    const base: Partial<CreateExamTimetablePayload> = {
      class_id: classId, section_id: sectionId, subject_id: subjectId,
      examnameid: examNameId, academicYearId,
      schoolWorkingDayId: schoolWorkingDayId || undefined,
      teacher_id: teacherId,
      room_no: roomNo,
    };

    const examsTimetables: CreateExamTimetablePayload[] = isEditMode
      ? [{ ...(base as CreateExamTimetablePayload), exam_date: editDate, start_time: toSec(editStart), end_time: toSec(editEnd) }]
      : entries.map((e) => ({ ...(base as CreateExamTimetablePayload), exam_date: e.exam_date, start_time: toSec(e.start_time), end_time: toSec(e.end_time) }));

    onSave({ examsTimetables });
  };

  if (!open) return null;

  // ── Select helper ─────────────────────────────────────────
  const SF = ({ label, required, loading, value, options, placeholder, disabled, onChange, error }: {
    label: string; required?: boolean; loading?: boolean; value: string;
    options: DropdownOption[]; placeholder: string; disabled?: boolean;
    onChange: (v: string) => void; error?: string;
  }) => (
    <div>
      <Label className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
        {label}{required && <span className="text-red-500">*</span>}
        {loading && <Loader2 size={12} className="animate-spin text-indigo-400" />}
      </Label>
      <Select value={value} onValueChange={onChange} options={options}
        placeholder={loading ? "Loading…" : placeholder} disabled={disabled || loading}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 disabled:opacity-50" />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );

  const inputCls = (hasErr?: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:ring-1 transition ${
      hasErr ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-200"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 flex-shrink-0">
          <div>
            <h6 className="text-xl font-black text-slate-800">
              {isEditMode ? "Edit Exam Timetable" : "Add Exam Timetable"}
            </h6>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEditMode ? "Update the exam entry below." : "Fill common details, then add one or more exam date entries."}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">

            {/* ── Common: Class / Section / Subject ── */}
            <div className="grid gap-4 md:grid-cols-3">
              <SF label="Class" required loading={loadingClasses} value={classId}
                options={classOptions} placeholder="Select class" onChange={setClassId}
                error={errors.class_id} />
              <SF label="Section" required loading={loadingSections} value={sectionId}
                options={sectionOptions} placeholder={classId ? "Select section" : "Pick class first"}
                disabled={!classId} onChange={setSectionId} error={errors.section_id} />
              <SF label="Subject" required loading={loadingSubjects} value={subjectId}
                options={subjectOptions} placeholder={sectionId ? "Select subject" : "Pick section first"}
                disabled={!sectionId} onChange={setSubjectId} error={errors.subject_id} />
            </div>

            {/* ── Common: Academic Year / Exam Name ── */}
            <div className="grid gap-4 md:grid-cols-2">
              <SF label="Academic Year" required loading={loadingAcYears} value={academicYearId}
                options={academicYears.map((y) => ({ value: y.id, label: y.active ? `${y.yearName} (Active)` : y.yearName }))}
                placeholder="Select academic year" onChange={setAcademicYearId}
                error={errors.academicYearId} />
              <SF label="Exam Name" required loading={loadingExamNames} value={examNameId}
                options={examNameOptions} placeholder="Select exam name" onChange={setExamNameId}
                error={errors.examNameId} />
            </div>

            {/* ── Edit mode: date/time + teacher + room ── */}
            {isEditMode ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label className="mb-2 block text-sm font-bold text-slate-700">Exam Date <span className="text-red-500">*</span></Label>
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                      className={inputCls(!!errors.editDate || !!isHoliday(editDate))} />
                    {isHoliday(editDate) && (
                      <div className="mt-1 flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-2.5 py-1.5">
                        <AlertTriangle size={12} className="text-red-500 shrink-0" />
                        <p className="text-[10px] font-semibold text-red-600">{isHoliday(editDate)} is a holiday</p>
                      </div>
                    )}
                    {errors.editDate && <p className="mt-1 text-xs text-red-600">{errors.editDate}</p>}
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm font-bold text-slate-700">Start Time <span className="text-red-500">*</span></Label>
                    <input type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} className={inputCls()} />
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm font-bold text-slate-700">End Time <span className="text-red-500">*</span></Label>
                    <input type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} className={inputCls()} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <SF label="Assign Teacher" value={teacherId}
                    options={staffOptions} placeholder="Select teacher (optional)"
                    onChange={setTeacherId} />
                  <div>
                    <Label className="mb-2 block text-sm font-bold text-slate-700">Room No.</Label>
                    <input type="text" value={roomNo} onChange={(e) => setRoomNo(e.target.value)}
                      placeholder="e.g. 101"
                      className={inputCls()} />
                  </div>
                </div>
              </div>
            ) : (
              /* ── Bulk entries table ── */
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-slate-700">
                    Exam Entries <span className="text-red-500">*</span>
                    <span className="ml-2 text-xs font-normal text-slate-400">{entries.length} entry(ies)</span>
                  </p>
                  <button type="button" onClick={addEntry}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition">
                    <Plus size={13} /> Add Entry
                  </button>
                </div>
                {errors.entries && <p className="mb-2 text-xs text-red-600">{errors.entries}</p>}

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200">
                        {["#", "Exam Date", "Start Time", "End Time", "Action"].map((h, i) => (
                          <th key={h} className={`px-3 py-2.5 text-xs font-bold text-slate-600 uppercase tracking-wide ${i === 4 ? "text-right" : "text-left"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {entries.map((entry, idx) => {
                        const holiday = isHoliday(entry.exam_date);
                        return (
                          <tr key={entry.id} className={holiday ? "bg-red-50/40" : "hover:bg-slate-50 transition-colors"}>
                            <td className="px-3 py-2 text-xs font-mono text-slate-400">{idx + 1}</td>
                            <td className="px-3 py-2 min-w-[160px]">
                              <input type="date" value={entry.exam_date}
                                onChange={(e) => updateEntry(entry.id, "exam_date", e.target.value)}
                                className={`w-full rounded-lg border px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500 ${
                                  holiday || errors[`date_${idx}`] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                                }`} />
                              {holiday && (
                                <div className="mt-0.5 flex items-center gap-1">
                                  <AlertTriangle size={10} className="text-red-500 shrink-0" />
                                  <span className="text-[9px] font-semibold text-red-500">{holiday} is a holiday</span>
                                </div>
                              )}
                              {errors[`date_${idx}`] && <p className="mt-0.5 text-[10px] text-red-600">{errors[`date_${idx}`]}</p>}
                            </td>
                            <td className="px-3 py-2">
                              <input type="time" value={entry.start_time}
                                onChange={(e) => updateEntry(entry.id, "start_time", e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500" />
                            </td>
                            <td className="px-3 py-2">
                              <input type="time" value={entry.end_time}
                                onChange={(e) => updateEntry(entry.id, "end_time", e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500" />
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button type="button" onClick={() => removeEntry(entry.id)} disabled={entries.length === 1}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed">
                                <Trash2 size={11} /> Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 flex-shrink-0">
            <Button type="button" onClick={onClose} variant="outline"
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}
              className="rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2">
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              {isSaving ? "Saving…" : isEditMode ? "Update Entry" : `Create ${entries.length} Entry(ies)`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamTimetableModal;
