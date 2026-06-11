import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { CreateExamTimetablePayload, ExamEntry } from "../types/timetable.types";
import { useExamNameOptions } from "../hooks/useTimetable";

// API imports
import { getAllClasses, getSectionsByClassId } from "../../../../services/class.api";
import { getSubjectsBySectionId } from "../../../../services/subject.api";
import { getAllStaff } from "../../../../services/staff.api";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";

/* =========================================================
   SCHEMA
========================================================= */

const addExamTimetableSchema = z.object({
  class_id: z.string().min(1, "Class is required"),
  section_id: z.string().min(1, "Section is required"),
  subject_id: z.string().min(1, "Subject is required"),
  examnameid: z.string().min(1, "Exam name ID is required"),
  exam_date: z.string().min(1, "Exam date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  room_no: z.string().min(1, "Room number is required"),
  academicYearId: z.string().min(1, "Academic year ID is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
});

type AddExamTimetableFormData = z.infer<typeof addExamTimetableSchema>;

/* =========================================================
   TYPES
========================================================= */

interface DropdownOption {
  value: string;
  label: string;
}

interface AddExamTimetableModalProps {
  open: boolean;
  isSaving?: boolean;
  editData?: ExamEntry | null;
  onClose: () => void;
  onSave: (data: CreateExamTimetablePayload) => void;
}

/* =========================================================
   COMPONENT
========================================================= */

const AddExamTimetableModal: React.FC<AddExamTimetableModalProps> = ({
  open,
  isSaving,
  editData,
  onClose,
  onSave,
}) => {
  const isEditMode = !!editData;
  // ── Dropdown data ─────────────────────────────────────────
  const [classOptions, setClassOptions] = useState<DropdownOption[]>([]);
  const [sectionOptions, setSectionOptions] = useState<DropdownOption[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<DropdownOption[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<DropdownOption[]>([]);

  // ── Loading states ────────────────────────────────────────
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // ── Academic years ────────────────────────────────────────
  const { years: academicYears, loading: loadingAcademicYears } = useAcademicYears();

  // ── Exam names hook ────────────────────────────────────────
  const { data: examNameOptions = [], isLoading: loadingExamNames } = useExamNameOptions();

  // ── Form ──────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddExamTimetableFormData>({
    resolver: zodResolver(addExamTimetableSchema),
    defaultValues: {
      class_id: "",
      section_id: "",
      subject_id: "",
      examnameid: "",
      exam_date: "",
      start_time: "09:00",
      end_time: "12:00",
      room_no: "",
      academicYearId: "",
      teacher_id: "",
    },
  });

  const selectedClassId = watch("class_id");
  const selectedSectionId = watch("section_id");

  // ── Fetch classes & teachers on open ──────────────────────
  useEffect(() => {
    if (!open) return;

    const defaultAcYear = academicYears.find((y) => y.active)?.id ?? academicYears[0]?.id ?? "";
    const stripSec = (t: string) => t?.length === 8 ? t.slice(0, 5) : (t ?? "");

    if (editData) {
      reset({
        class_id:       editData.class_id       ?? "",
        section_id:     editData.section_id     ?? "",
        subject_id:     editData.subject_id     ?? "",
        examnameid:     editData.examnameid      ?? "",
        exam_date:      editData.date            ?? "",
        start_time:     stripSec(editData.startTime),
        end_time:       stripSec(editData.endTime),
        room_no:        editData.venue           ?? "",
        academicYearId: editData.academicYearId  ?? defaultAcYear,
        teacher_id:     editData.teacher_id      ?? "",
      });
    } else {
      reset({
        class_id: "",
        section_id: "",
        subject_id: "",
        examnameid: "",
        exam_date: "",
        start_time: "09:00",
        end_time: "12:00",
        room_no: "",
        academicYearId: defaultAcYear,
        teacher_id: "",
      });
    }
    setSectionOptions([]);
    setSubjectOptions([]);

    setLoadingClasses(true);
    getAllClasses()
      .then((res) => {
        setClassOptions(
          res.data.map((c) => ({ value: c.id, label: c.class_name }))
        );
      })
      .catch(console.error)
      .finally(() => setLoadingClasses(false));

    setLoadingTeachers(true);
    getAllStaff()
      .then((res) => {
        setTeacherOptions(
          res.data
            .filter((s) => s.role?.toLowerCase() === "teacher")
            .map((s) => ({ value: s.id, label: s.name }))
        );
      })
      .catch(console.error)
      .finally(() => setLoadingTeachers(false));
  }, [open, reset]);

  // ── Cascade: class → sections ─────────────────────────────
  useEffect(() => {
    if (!selectedClassId) {
      setSectionOptions([]);
      setSubjectOptions([]);
      setValue("section_id", "");
      setValue("subject_id", "");
      return;
    }

    setLoadingSections(true);
    setSectionOptions([]);
    setSubjectOptions([]);
    setValue("section_id", "");
    setValue("subject_id", "");

    getSectionsByClassId(selectedClassId)
      .then((res) => {
        setSectionOptions(
          res.data.map((s) => ({ value: s.id, label: s.sectionName ?? s.section_name ?? "" }))
        );
      })
      .catch(console.error)
      .finally(() => setLoadingSections(false));
  }, [selectedClassId, setValue]);

  // ── Cascade: section → subjects ───────────────────────────
  useEffect(() => {
    if (!selectedSectionId) {
      setSubjectOptions([]);
      setValue("subject_id", "");
      return;
    }

    setLoadingSubjects(true);
    setSubjectOptions([]);
    setValue("subject_id", "");

    getSubjectsBySectionId(selectedSectionId)
      .then((res) => {
        setSubjectOptions(
          res.data.map((s) => ({ value: s.id, label: s.subject_name }))
        );
      })
      .catch(console.error)
      .finally(() => setLoadingSubjects(false));
  }, [selectedSectionId, setValue]);

  // ── Submit ────────────────────────────────────────────────
  const handleFormSubmit = (data: AddExamTimetableFormData) => {
    const toTimeWithSeconds = (v: string) => (v.includes(":") && v.split(":").length === 2 ? `${v}:00` : v);

    const payload: CreateExamTimetablePayload = {
      class_id: data.class_id,
      section_id: data.section_id,
      subject_id: data.subject_id,
      examnameid: data.examnameid,
      exam_date: data.exam_date,
      start_time: toTimeWithSeconds(data.start_time),
      end_time: toTimeWithSeconds(data.end_time),
      room_no: data.room_no,
      academicYearId: data.academicYearId,
      teacher_id: data.teacher_id,
    };
    onSave(payload);
  };

  if (!open) return null;

  /* ── Reusable select wrapper ─────────────────────────────── */
  const SelectField = ({
    label,
    required,
    loading,
    value,
    options,
    placeholder,
    disabled,
    onValueChange,
    error,
  }: {
    label: string;
    required?: boolean;
    loading?: boolean;
    value: string;
    options: DropdownOption[];
    placeholder: string;
    disabled?: boolean;
    onValueChange: (v: string) => void;
    error?: string;
  }) => (
    <div>
      <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
        {label}
        {required && <span className="text-red-500">*</span>}
        {loading && <Loader2 size={12} className="animate-spin text-indigo-400" />}
      </Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        options={options}
        placeholder={loading ? "Loading…" : placeholder}
        disabled={disabled || loading}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 flex-shrink-0">
          <div>
            <h6 className="text-2xl font-black text-slate-800">{isEditMode ? "Edit Exam Timetable" : "Add Exam Timetable"}</h6>
            <p className="text-sm text-slate-500 mt-1">
              {isEditMode ? "Update the exam timetable entry below." : "Schedule a new exam entry for the academic year."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close add exam timetable modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">

            {/* Row 1: Class → Section → Subject (cascading dropdowns) */}
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField
                label="Class"
                required
                loading={loadingClasses}
                value={watch("class_id")}
                options={classOptions}
                placeholder="Select class"
                onValueChange={(value) => setValue("class_id", value)}
                error={errors.class_id?.message}
              />

              <SelectField
                label="Section"
                required
                loading={loadingSections}
                value={watch("section_id")}
                options={sectionOptions}
                placeholder={selectedClassId ? "Select section" : "Pick class first"}
                disabled={!selectedClassId}
                onValueChange={(value) => setValue("section_id", value)}
                error={errors.section_id?.message}
              />

              <SelectField
                label="Subject"
                required
                loading={loadingSubjects}
                value={watch("subject_id")}
                options={subjectOptions}
                placeholder={selectedSectionId ? "Select subject" : "Pick section first"}
                disabled={!selectedSectionId}
                onValueChange={(value) => setValue("subject_id", value)}
                error={errors.subject_id?.message}
              />
            </div>

            {/* Row 2: Teacher + Room No */}
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Teacher"
                required
                loading={loadingTeachers}
                value={watch("teacher_id")}
                options={teacherOptions}
                placeholder="Select teacher"
                onValueChange={(value) => setValue("teacher_id", value)}
                error={errors.teacher_id?.message}
              />

              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Room No <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. 101"
                  {...register("room_no")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.room_no && (
                  <p className="mt-1 text-xs text-red-600">{errors.room_no.message}</p>
                )}
              </div>
            </div>

            {/* Row 3: Exam Name + Exam Date */}
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Exam Name"
                required
                loading={loadingExamNames}
                value={watch("examnameid")}
                options={examNameOptions}
                placeholder="Select exam name"
                onValueChange={(value) => setValue("examnameid", value)}
                error={errors.examnameid?.message}
              />
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Exam Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  {...register("exam_date")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.exam_date && (
                  <p className="mt-1 text-xs text-red-600">{errors.exam_date.message}</p>
                )}
              </div>
            </div>

            {/* Row 4: Start Time + End Time */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Start Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  {...register("start_time")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.start_time && (
                  <p className="mt-1 text-xs text-red-600">{errors.start_time.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  End Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  {...register("end_time")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.end_time && (
                  <p className="mt-1 text-xs text-red-600">{errors.end_time.message}</p>
                )}
              </div>
            </div>

            {/* Row 5: Academic Year */}
            <SelectField
              label="Academic Year"
              required
              loading={loadingAcademicYears}
              value={watch("academicYearId")}
              options={academicYears.map((y) => ({
                value: y.id,
                label: y.active ? `${y.yearName} (Active)` : y.yearName,
              }))}
              placeholder="Select academic year"
              onValueChange={(value: string) => setValue("academicYearId", value)}
              error={errors.academicYearId?.message}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 flex-shrink-0">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving…" : isEditMode ? "Update Exam Timetable" : "Create Exam Timetable"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamTimetableModal;