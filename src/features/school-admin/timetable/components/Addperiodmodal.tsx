import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { CreateTimetablePayload } from "../types/timetable.types";

// API imports
import { getAllClasses, getSectionsByClassId, type GetAllClassesResponse, type GetSectionsByClassIdResponse } from "@/services/class.api";
import { getSubjectsBySectionId, type GetSubjectsBySectionIdResponse } from "@/services/subject.api";
import { getAllStaff, type GetAllStaffResponse } from "@/services/staff.api";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";

/* =========================================================
   CONSTANTS
========================================================= */

const DAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
];

const PERIOD_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `Period ${i + 1}`,
}));

const TIME_SLOT_MAP: Record<
  string,
  { time_sloat: string; start_time: string; end_time: string }
> = {
  "1": { time_sloat: "09:00 AM - 09:45 AM", start_time: "09:00:00", end_time: "09:45:00" },
  "2": { time_sloat: "09:45 AM - 10:30 AM", start_time: "09:45:00", end_time: "10:30:00" },
  "3": { time_sloat: "10:30 AM - 11:15 AM", start_time: "10:30:00", end_time: "11:15:00" },
  "4": { time_sloat: "11:15 AM - 12:00 PM", start_time: "11:15:00", end_time: "12:00:00" },
  "5": { time_sloat: "12:00 PM - 12:45 PM", start_time: "12:00:00", end_time: "12:45:00" },
  "6": { time_sloat: "01:30 PM - 02:15 PM", start_time: "13:30:00", end_time: "14:15:00" },
  "7": { time_sloat: "02:15 PM - 03:00 PM", start_time: "14:15:00", end_time: "15:00:00" },
  "8": { time_sloat: "03:00 PM - 03:45 PM", start_time: "15:00:00", end_time: "15:45:00" },
};

const defaultLunchStart = "12:30";
const defaultLunchEnd = "13:15";
const defaultBreakStart = "10:30";
const defaultBreakEnd = "10:45";

/* =========================================================
   SCHEMA
========================================================= */

const addPeriodSchema = z.object({
  class_id: z.string().min(1, "Class is required"),
  className: z.string().min(1, "Class name is required"),
  section_id: z.string().min(1, "Section is required"),
  sectionName: z.string().min(1, "Section name is required"),
  subject_id: z.string().min(1, "Subject is required"),
  subjectname: z.string().min(1, "Subject name is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
  teachername: z.string().min(1, "Teacher name is required"),
  period_no: z.string().min(1, "Period is required"),
  time_sloat: z.string().min(1, "Time slot is required"),
  day_of_week: z.string().min(1, "Day is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  room_no: z.string().min(1, "Room number is required"),
  lunch_start: z.string().min(1, "Lunch start is required"),
  lunch_end: z.string().min(1, "Lunch end is required"),
  break_start: z.string().min(1, "Break start is required"),
  break_end: z.string().min(1, "Break end is required"),
  academic_year: z.string().min(1, "Academic year is required"),
  school_code: z.string().min(1, "School code is required"),
});

type AddPeriodFormData = z.infer<typeof addPeriodSchema>;

/* =========================================================
   DROPDOWN OPTION TYPE
========================================================= */

interface DropdownOption {
  value: string;
  label: string;
}

/* =========================================================
   PROPS
========================================================= */

interface AddPeriodModalProps {
  open: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (data: CreateTimetablePayload) => void;
}

/* =========================================================
   COMPONENT
========================================================= */

const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  open,
  isSaving,
  onClose,
  onSave,
}) => {
  const defaultSchoolCode = localStorage.getItem("schoolcode") ?? "";

  // ── Dropdown data state ──────────────────────────────────
  const [classOptions, setClassOptions] = useState<DropdownOption[]>([]);
  const [sectionOptions, setSectionOptions] = useState<DropdownOption[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<DropdownOption[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<DropdownOption[]>([]);

  // ── Loading states ───────────────────────────────────────
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // ── Academic years ────────────────────────────────────────
  const { years: academicYears, loading: loadingAcademicYears } = useAcademicYears();

  // ── Form ─────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddPeriodFormData>({
    resolver: zodResolver(addPeriodSchema),
    defaultValues: {
      class_id: "",
      className: "",
      section_id: "",
      sectionName: "",
      subject_id: "",
      subjectname: "",
      teacher_id: "",
      teachername: "",
      period_no: "1",
      time_sloat: TIME_SLOT_MAP["1"].time_sloat,
      day_of_week: "monday",
      start_time: TIME_SLOT_MAP["1"].start_time,
      end_time: TIME_SLOT_MAP["1"].end_time,
      room_no: "",
      lunch_start: defaultLunchStart,
      lunch_end: defaultLunchEnd,
      break_start: defaultBreakStart,
      break_end: defaultBreakEnd,
      academic_year: academicYears.find((y) => y.active)?.id ?? academicYears[0]?.id ?? "",
      school_code: defaultSchoolCode,
    },
  });

  const selectedClassId = watch("class_id");
  const selectedSectionId = watch("section_id");
  const selectedPeriodNo = watch("period_no");

  // ── Fetch classes on open ─────────────────────────────────
  useEffect(() => {
    if (!open) return;

    const defaultAcYear = academicYears.find((y) => y.active)?.id ?? academicYears[0]?.id ?? "";

    reset({
      class_id: "",
      className: "",
      section_id: "",
      sectionName: "",
      subject_id: "",
      subjectname: "",
      teacher_id: "",
      teachername: "",
      period_no: "1",
      time_sloat: TIME_SLOT_MAP["1"].time_sloat,
      day_of_week: "monday",
      start_time: TIME_SLOT_MAP["1"].start_time,
      end_time: TIME_SLOT_MAP["1"].end_time,
      room_no: "",
      lunch_start: defaultLunchStart,
      lunch_end: defaultLunchEnd,
      break_start: defaultBreakStart,
      break_end: defaultBreakEnd,
      academic_year: defaultAcYear,
      school_code: defaultSchoolCode,
    });
    setSectionOptions([]);
    setSubjectOptions([]);

    // Fetch classes
    setLoadingClasses(true);
    getAllClasses()
      .then((res: GetAllClassesResponse) => {
        const opts = res.data.map((c) => ({
          value: c.id,
          label: c.class_name,
        }));
        setClassOptions(opts);
      })
      .catch(console.error)
      .finally(() => setLoadingClasses(false));

    // Fetch all teachers (Teachers only, filter by role)
    setLoadingTeachers(true);
    getAllStaff()
      .then((res: GetAllStaffResponse) => {
        const opts = res.data
          .filter((s) => s.role?.toLowerCase() === "teacher")
          .map((s) => ({ value: s.id, label: s.name }));
        setTeacherOptions(opts);
      })
      .catch(console.error)
      .finally(() => setLoadingTeachers(false));
  }, [open, reset, defaultSchoolCode]);

  // ── Cascade: class → sections ─────────────────────────────
  useEffect(() => {
    if (!selectedClassId) {
      setSectionOptions([]);
      setSubjectOptions([]);
      setValue("section_id", "");
      setValue("sectionName", "");
      setValue("subject_id", "");
      setValue("subjectname", "");
      return;
    }

    setLoadingSections(true);
    setSectionOptions([]);
    setSubjectOptions([]);
    setValue("section_id", "");
    setValue("sectionName", "");
    setValue("subject_id", "");
    setValue("subjectname", "");

    getSectionsByClassId(selectedClassId)
      .then((res: GetSectionsByClassIdResponse) => {
        const opts = res.data.map((s) => ({
          value: s.id,
          label: s.sectionName ?? s.section_name ?? "",
        }));
        setSectionOptions(opts);
      })
      .catch(console.error)
      .finally(() => setLoadingSections(false));
  }, [selectedClassId, setValue]);

  // ── Cascade: section → subjects ───────────────────────────
  useEffect(() => {
    if (!selectedSectionId) {
      setSubjectOptions([]);
      setValue("subject_id", "");
      setValue("subjectname", "");
      return;
    }

    setLoadingSubjects(true);
    setSubjectOptions([]);
    setValue("subject_id", "");
    setValue("subjectname", "");

    getSubjectsBySectionId(selectedSectionId)
      .then((res: GetSubjectsBySectionIdResponse) => {
      const opts = res.data.map((s) => ({
  value: s.id,
  label: s.subject_name ?? s.id,
}));
        setSubjectOptions(opts);
      })
      .catch(console.error)
      .finally(() => setLoadingSubjects(false));
  }, [selectedSectionId, setValue]);

  // ── Sync time slot when period changes ────────────────────
  useEffect(() => {
    const slot = TIME_SLOT_MAP[selectedPeriodNo];
    if (slot) {
      setValue("time_sloat", slot.time_sloat);
      setValue("start_time", slot.start_time);
      setValue("end_time", slot.end_time);
    }
  }, [selectedPeriodNo, setValue]);

  // ── Helper: Format time to HH:MM ────────────────────────
  const formatTimeToHHMM = (timeValue: string): string => {
    if (!timeValue) return "";
    // If already HH:MM, return as-is
    if (timeValue.length === 5 && timeValue.includes(":")) return timeValue;
    // If HH:MM:SS, extract HH:MM
    if (timeValue.length >= 5 && timeValue.includes(":")) return timeValue.slice(0, 5);
    return timeValue;
  };

  // ── Submit ────────────────────────────────────────────────
  const handleFormSubmit = (data: AddPeriodFormData) => {
    // Validate that all required fields are filled
    if (!data.class_id || !data.section_id || !data.subject_id || !data.teacher_id) {
      alert("Please fill in all required fields (Class, Section, Subject, Teacher)");
      return;
    }
    
    // Remove school_code since API doesn't expect it
    const { school_code, ...payload } = data;
    
    // Ensure time fields are in HH:MM format
    const cleanPayload = {
      ...payload,
      break_start: formatTimeToHHMM(payload.break_start),
      break_end: formatTimeToHHMM(payload.break_end),
      lunch_start: formatTimeToHHMM(payload.lunch_start),
      lunch_end: formatTimeToHHMM(payload.lunch_end),
    };
    
    onSave(cleanPayload as unknown as CreateTimetablePayload);
  };

  if (!open) return null;

  /* ── Helpers ─────────────────────────────────────────────── */
  const SelectWrapper = ({
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
        <div className="flex items-center justify-between b
        
        order-b border-slate-900 px-6 py-5 flex-shrink-0">
          <div>
            <h6 className="text-1xl font-black text-slate-700">Add Timetable Period</h6>
            <p className="text-sm text-slate-500 mt-1">
              Create a new period entry for the weekly timetable.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">

            {/* Row 1: Class → Section → Subject (cascading) */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Class */}
              <SelectWrapper
                label="Class"
                required
                loading={loadingClasses}
                value={watch("class_id")}
                options={classOptions}
                placeholder="Select class"
                onValueChange={(value) => {
                  setValue("class_id", value);
                  const found = classOptions.find((c) => c.value === value);
                  setValue("className", found?.label ?? "");
                }}
                error={errors.class_id?.message}
              />

              {/* Section — disabled until class chosen */}
              <SelectWrapper
                label="Section"
                required
                loading={loadingSections}
                value={watch("section_id")}
                options={sectionOptions}
                placeholder={selectedClassId ? "Select section" : "Pick class first"}
                disabled={!selectedClassId}
                onValueChange={(value) => {
                  setValue("section_id", value);
                  const found = sectionOptions.find((s) => s.value === value);
                  setValue("sectionName", found?.label ?? "");
                }}
                error={errors.section_id?.message}
              />

              {/* Subject — disabled until section chosen */}
              <SelectWrapper
                label="Subject"
                required
                loading={loadingSubjects}
                value={watch("subject_id")}
                options={subjectOptions}
                placeholder={selectedSectionId ? "Select subject" : "Pick section first"}
                disabled={!selectedSectionId}
                onValueChange={(value) => {
                  setValue("subject_id", value);
                  const found = subjectOptions.find((s) => s.value === value);
                  setValue("subjectname", found?.label ?? "");
                }}
                error={errors.subject_id?.message}
              />
            </div>

            {/* Row 2: Teacher + Room No */}
            <div className="grid gap-4 md:grid-cols-2">
              <SelectWrapper
                label="Teacher"
                required
                loading={loadingTeachers}
                value={watch("teacher_id")}
                options={teacherOptions}
                placeholder="Select teacher"
                onValueChange={(value) => {
                  setValue("teacher_id", value);
                  const found = teacherOptions.find((t) => t.value === value);
                  setValue("teachername", found?.label ?? "");
                }}
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

            {/* Row 3: Day + Period No + Time Slot */}
            <div className="grid gap-4 md:grid-cols-3">
              <SelectWrapper
                label="Day"
                required
                value={watch("day_of_week")}
                options={DAYS}
                placeholder="Select day"
                onValueChange={(value) => setValue("day_of_week", value)}
                error={errors.day_of_week?.message}
              />

              <SelectWrapper
                label="Period No"
                required
                value={watch("period_no")}
                options={PERIOD_OPTIONS}
                placeholder="Select period"
                onValueChange={(value) => setValue("period_no", value)}
                error={errors.period_no?.message}
              />

              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Time Slot <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  readOnly
                  {...register("time_sloat")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Row 5: Break Time */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Break Start <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  defaultValue={defaultBreakStart}
                  {...register("break_start")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.break_start && (
                  <p className="mt-1 text-xs text-red-600">{errors.break_start.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Break End <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  defaultValue={defaultBreakEnd}
                  {...register("break_end")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.break_end && (
                  <p className="mt-1 text-xs text-red-600">{errors.break_end.message}</p>
                )}
              </div>
            </div>

            {/* Row 6: Lunch Time */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Lunch Start <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  defaultValue={defaultLunchStart}
                  {...register("lunch_start")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.lunch_start && (
                  <p className="mt-1 text-xs text-red-600">{errors.lunch_start.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Lunch End <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  defaultValue={defaultLunchEnd}
                  {...register("lunch_end")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.lunch_end && (
                  <p className="mt-1 text-xs text-red-600">{errors.lunch_end.message}</p>
                )}
              </div>
            </div>

            {/* Row 7: Academic Year + School Code */}
            <div className="grid gap-4 md:grid-cols-2">
              <SelectWrapper
                label="Academic Year"
                required
                loading={loadingAcademicYears}
                value={watch("academic_year")}
                options={academicYears.map((y) => ({
                  value: y.id,
                  label: y.active ? `${y.yearName} (Active)` : y.yearName,
                }))}
                placeholder="Select academic year"
                onValueChange={(value) => setValue("academic_year", value)}
                error={errors.academic_year?.message}
              />
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-slate-500">School Code:</span>
                <span className="text-sm text-slate-400">{defaultSchoolCode || "—"}</span>
              </div>
            </div>

            {/* Hidden fields */}
            <input type="hidden" {...register("className")} />
            <input type="hidden" {...register("sectionName")} />
            <input type="hidden" {...register("subjectname")} />
            <input type="hidden" {...register("teachername")} />
            <input type="hidden" {...register("start_time")} />
            <input type="hidden" {...register("end_time")} />
            <input type="hidden" {...register("school_code")} />
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
              {isSaving ? "Saving…" : "Create Period"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPeriodModal;