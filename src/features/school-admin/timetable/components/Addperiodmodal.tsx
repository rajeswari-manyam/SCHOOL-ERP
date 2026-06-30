import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getRemainingPeriods, type BulkCreateTimetablePayload, type RemainingPeriodsResponse } from "@/services/timetable.api";

// API imports
import { getAllClasses, getSectionsByClassId, type GetAllClassesResponse, type GetSectionsByClassIdResponse } from "@/services/class.api";
import { getSubjectsBySectionId, type GetSubjectsBySectionIdResponse } from "@/services/subject.api";
import { fetchDepartments, getDepartmentById } from "@/services/department.api";
import type { Department } from "@/features/school-admin/settings/types/settings.types";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { fetchAllWorkingDays } from "@/services/working-days.api";
import type { WorkingDayRecord } from "@/services/working-days.api";

/* =========================================================
   CONSTANTS
========================================================= */
const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const DAYS = DAYS_ORDER.map((d) => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }));

const PERIOD_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `Period ${i + 1}`,
}));

const TIME_SLOT_MAP: Record<string, { time_sloat: string; start_time: string; end_time: string }> = {
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
   SCHEMA — only for common fields (entries are managed separately)
========================================================= */
const commonSchema = z.object({
  class_id: z.string().min(1, "Class is required"),
  className: z.string().min(1, "Class name is required"),
  section_id: z.string().min(1, "Section is required"),
  sectionName: z.string().min(1, "Section name is required"),
  subject_id: z.string().min(1, "Subject is required"),
  subjectname: z.string().min(1, "Subject name is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
  teachername: z.string().min(1, "Teacher name is required"),
  room_no: z.string().optional(),
  lunch_start: z.string().min(1, "Lunch start is required"),
  lunch_end: z.string().min(1, "Lunch end is required"),
  break_start: z.string().min(1, "Break start is required"),
  break_end: z.string().min(1, "Break end is required"),
  academic_year: z.string().min(1, "Academic year is required"),
  school_code: z.string().min(1, "School code is required"),
  schoolWorkingDayId: z.string().optional(),
});

type CommonFormData = z.infer<typeof commonSchema>;

/* =========================================================
   ENTRY TYPE
========================================================= */
interface TimetableEntry {
  id: string;
  day_of_week: string;
  period_no: string;
  time_sloat: string;
  room_no: string;
}

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
  onSave: (data: BulkCreateTimetablePayload) => void;
  defaultClass?: { id: string; label: string };
  defaultSection?: { id: string; label: string };
}

let _entryCounter = 0;
const createEntry = (day_of_week: string, period_no = "1", room_no = ""): TimetableEntry => {
  const slot = TIME_SLOT_MAP[period_no] ?? TIME_SLOT_MAP["1"];
  return {
    id: `entry_${++_entryCounter}`,
    day_of_week,
    period_no,
    time_sloat: slot.time_sloat,
    room_no,
  };
};

/* =========================================================
   COMPONENT
========================================================= */
const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  open,
  isSaving,
  onClose,
  onSave,
  defaultClass,
  defaultSection,
}) => {
  const defaultSchoolCode = localStorage.getItem("schoolcode") ?? "";

  // ── Dropdown data state ──────────────────────────────────
  const [classOptions, setClassOptions] = useState<DropdownOption[]>([]);
  const [sectionOptions, setSectionOptions] = useState<DropdownOption[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<DropdownOption[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<DropdownOption[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [workingDays, setWorkingDays] = useState<WorkingDayRecord[]>([]);

  // ── Remaining periods ────────────────────────────────────
  const [remainingMap, setRemainingMap] = useState<Record<string, number[]>>({});
  const [loadingRemaining, setLoadingRemaining] = useState(false);

  // ── Loading states ───────────────────────────────────────
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // ── Academic years ────────────────────────────────────────
  const { years: academicYears, loading: loadingAcademicYears } = useAcademicYears();

  // ── Dynamic entries ───────────────────────────────────────
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  // ── Form ─────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CommonFormData>({
    resolver: zodResolver(commonSchema),
    defaultValues: {
      class_id: "",
      className: "",
      section_id: "",
      sectionName: "",
      subject_id: "",
      subjectname: "",
      teacher_id: "",
      teachername: "",
      room_no: "",
      lunch_start: defaultLunchStart,
      lunch_end: defaultLunchEnd,
      break_start: defaultBreakStart,
      break_end: defaultBreakEnd,
      academic_year: "",
      school_code: defaultSchoolCode,
      schoolWorkingDayId: "",
    },
  });

  const selectedClassId = watch("class_id");
  const selectedSectionId = watch("section_id");
  const selectedSubjectId = watch("subject_id");
  const selectedSubjectName = watch("subjectname");
  const selectedSWDId = watch("schoolWorkingDayId");

  // ── Compute active working days ────────────────────────────
  // Normalize to lowercase — API stores "Monday" but DAYS values are "monday"
  const activeDaySet = new Set<string>(
    (workingDays.find((wd) => wd.id === selectedSWDId)?.selected_days ?? DAYS_ORDER)
      .map((d) => d.toLowerCase()),
  );

  // ── Fetch classes on open ─────────────────────────────────
  useEffect(() => {
    if (!open) return;

    fetchAllWorkingDays().then(setWorkingDays).catch(() => {});

    const defaultAcYear = academicYears.find((y) => y.active)?.id ?? academicYears[0]?.id ?? "";

    reset({
      class_id:     defaultClass?.id     ?? "",
      className:    defaultClass?.label  ?? "",
      section_id:   defaultSection?.id   ?? "",
      sectionName:  defaultSection?.label ?? "",
      subject_id:   "",
      subjectname:  "",
      teacher_id:   "",
      teachername:  "",
      room_no:      "",
      lunch_start:  defaultLunchStart,
      lunch_end:    defaultLunchEnd,
      break_start:  defaultBreakStart,
      break_end:    defaultBreakEnd,
      academic_year: defaultAcYear,
      school_code:  defaultSchoolCode,
      schoolWorkingDayId: "",
    });
    setEntries([]);
    setSectionOptions([]);
    setSubjectOptions([]);
    setTeacherOptions([]);

    // If section is pre-selected, load its subjects immediately
    if (defaultSection?.id) {
      setLoadingSubjects(true);
      getSubjectsBySectionId(defaultSection.id)
        .then((res: GetSubjectsBySectionIdResponse) => {
          setSubjectOptions(res.data.map((s) => ({ value: s.id, label: s.subject_name ?? s.id })));
        })
        .catch(console.error)
        .finally(() => setLoadingSubjects(false));
    }

    setLoadingClasses(true);
    getAllClasses()
      .then((res: GetAllClassesResponse) => {
        const opts = res.data.map((c) => ({ value: c.id, label: c.class_name }));
        setClassOptions(opts);
      })
      .catch(console.error)
      .finally(() => setLoadingClasses(false));

    fetchDepartments()
      .then((data) => setDepartments(data))
      .catch(console.error);
  }, [open, reset, defaultSchoolCode, defaultClass, defaultSection, academicYears]);

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

    // Only clear section & subjects when user manually changes class (not on initial mount with pre-selected section)
    if (!defaultSection?.id) {
      setSubjectOptions([]);
      setTeacherOptions([]);
      setValue("section_id", "");
      setValue("sectionName", "");
      setValue("subject_id", "");
      setValue("subjectname", "");
      setValue("teacher_id", "");
      setValue("teachername", "");
    }

    getSectionsByClassId(selectedClassId)
      .then((res: GetSectionsByClassIdResponse) => {
        setSectionOptions(res.data.map((s) => ({ value: s.id, label: s.sectionName ?? "" })));
      })
      .catch(console.error)
      .finally(() => setLoadingSections(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, setValue]);


  // ── Auto-select working day when academic year changes ──
  const selectedAcYear = watch("academic_year");
  useEffect(() => {
    if (selectedAcYear && workingDays.length > 0) {
      const wd = workingDays.find((d) => d.academicYearId === selectedAcYear);
      if (wd) setValue("schoolWorkingDayId", wd.id);
    }
  }, [selectedAcYear, workingDays, setValue]);

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
        setSubjectOptions(res.data.map((s) => ({ value: s.id, label: s.subject_name ?? s.id })));
      })
      .catch(console.error)
      .finally(() => setLoadingSubjects(false));
  }, [selectedSectionId, setValue]);

  // ── Cascade: subject → teachers ────────────────────────────
  useEffect(() => {
    if (!selectedSubjectId || !selectedSubjectName) {
      setTeacherOptions([]);
      setValue("teacher_id", "");
      setValue("teachername", "");
      return;
    }

    const trimmed = selectedSubjectName.trim().toLowerCase();
    const matched = departments.find((d) => d.departmentName.toLowerCase() === trimmed);

    if (!matched) {
      setTeacherOptions([]);
      setValue("teacher_id", "");
      setValue("teachername", "");
      return;
    }

    setLoadingTeachers(true);
    setValue("teacher_id", "");
    setValue("teachername", "");
    getDepartmentById(matched.id)
      .then((dept) => {
        const opts = (dept?.staffs ?? []).map((s) => ({
          value: s.id,
          label: `${s.name} (${s.email || s.phone || s.role})`,
        }));
        setTeacherOptions(opts);
      })
      .catch(() => setTeacherOptions([]))
      .finally(() => setLoadingTeachers(false));
  }, [selectedSubjectId, selectedSubjectName, departments, setValue]);

  // ── Fetch remaining periods when class + section selected ──
  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) {
      setRemainingMap({});
      return;
    }
    setLoadingRemaining(true);
    getRemainingPeriods(selectedClassId, selectedSectionId)
      .then((res: RemainingPeriodsResponse) => {
        if (res.status && Array.isArray(res.week_summary)) {
          const map: Record<string, number[]> = {};
          for (const day of res.week_summary) {
            map[day.day_of_week] = day.remaining_periods;
          }
          setRemainingMap(map);
        }
      })
      .catch(() => setRemainingMap({}))
      .finally(() => setLoadingRemaining(false));
  }, [selectedClassId, selectedSectionId]);

  // ── Add / Remove entries ──────────────────────────────────
  const addEntry = useCallback(() => {
    const allDayValues = DAYS_ORDER;
    if (allDayValues.length === 0) return;
    const lastDay = entries.length > 0 ? entries[entries.length - 1].day_of_week : allDayValues[0];
    const idx = allDayValues.indexOf(lastDay);
    const nextDay = idx < 0 || idx >= allDayValues.length - 1 ? allDayValues[0] : allDayValues[idx + 1];
    const dayRemaining = remainingMap[nextDay];
    const defaultPeriod = dayRemaining && dayRemaining.length > 0 ? String(dayRemaining[0]) : "1";
    setEntries((prev) => [...prev, createEntry(nextDay, defaultPeriod, watch("room_no"))]);
  }, [entries, watch, DAYS_ORDER, remainingMap]);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateEntry = useCallback((id: string, field: keyof TimetableEntry, value: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }, []);

  // ── Helper: Format time to HH:MM ──────────────────────────
  const formatTimeToHHMM = (timeValue: string): string => {
    if (!timeValue) return "";
    if (timeValue.length === 5 && timeValue.includes(":")) return timeValue;
    if (timeValue.length >= 5 && timeValue.includes(":")) return timeValue.slice(0, 5);
    return timeValue;
  };

  const to24h = (t: string): string => {
    const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return t.slice(0, 5);
    let h = Number(m[1]);
    if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${m[2]}`;
  };

  const to12h = (t: string): string => {
    const m = t.match(/(\d{1,2}):(\d{2})/);
    if (!m) return t;
    let h = Number(m[1]);
    const ampm = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, "0")}:${m[2]} ${ampm}`;
  };

  // ── Submit ────────────────────────────────────────────────
  const handleFormSubmit = (data: CommonFormData) => {
    if (!data.class_id || !data.section_id || !data.subject_id || !data.teacher_id) {
      alert("Please fill in all required fields (Class, Section, Subject, Teacher)");
      return;
    }
    if (entries.length === 0) {
      alert("Please add at least one period entry");
      return;
    }

    const timetables = entries.map((entry) => {
      const slot = TIME_SLOT_MAP[entry.period_no] ?? TIME_SLOT_MAP["1"];
      return {
        class_id:       data.class_id,
        section_id:     data.section_id,
        subject_id:     data.subject_id,
        teacher_id:     data.teacher_id,
        period_no:      Number(entry.period_no),
        time_sloat:     entry.time_sloat || slot.time_sloat,
        day_of_week:    entry.day_of_week,
        room_no:        entry.room_no,
        academicYearId: data.academic_year,
        break_start:    formatTimeToHHMM(data.break_start),
        break_end:      formatTimeToHHMM(data.break_end),
        lunch_start:    formatTimeToHHMM(data.lunch_start),
        lunch_end:      formatTimeToHHMM(data.lunch_end),
        schoolWorkingDayId: data.schoolWorkingDayId,
      };
    });

    onSave({ timetables });
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
        placeholder={loading ? "Loading\u2026" : placeholder}
        disabled={disabled || loading}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 flex-shrink-0">
          <div>
            <h6 className="text-xl font-black text-slate-700">Add Timetable Periods</h6>
            <p className="text-sm text-slate-500 mt-1">
              Add multiple period entries at once for the selected class, section, and subject.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">

            {/* ── Row 0: Break & Lunch (at top) ── */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Break &amp; Lunch Timing</p>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label className="mb-2 block text-sm font-bold text-slate-700">Break Start</Label>
                  <Input type="time" defaultValue={defaultBreakStart} {...register("break_start")}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-bold text-slate-700">Break End</Label>
                  <Input type="time" defaultValue={defaultBreakEnd} {...register("break_end")}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-bold text-slate-700">Lunch Start</Label>
                  <Input type="time" defaultValue={defaultLunchStart} {...register("lunch_start")}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-bold text-slate-700">Lunch End</Label>
                  <Input type="time" defaultValue={defaultLunchEnd} {...register("lunch_end")}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200" />
                </div>
              </div>
            </div>

            {/* ── Row 1: Class → Section → Subject ── */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Class — locked when pre-filled from page */}
              {defaultClass?.id ? (
                <div>
                  <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    Class <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4">
                    <span className="text-sm font-semibold text-indigo-700">{defaultClass.label}</span>
                    <span className="ml-auto text-[10px] font-medium text-indigo-400 uppercase tracking-wide">Pre-selected</span>
                  </div>
                </div>
              ) : (
                <SelectWrapper
                  label="Class" required loading={loadingClasses}
                  value={watch("class_id")} options={classOptions}
                  placeholder="Select class"
                  onValueChange={(value) => {
                    setValue("class_id", value);
                    setValue("className", classOptions.find((c) => c.value === value)?.label ?? "");
                  }}
                  error={errors.class_id?.message}
                />
              )}
              {/* Section — locked when pre-filled from page */}
              {defaultSection?.id ? (
                <div>
                  <Label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    Section <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4">
                    <span className="text-sm font-semibold text-indigo-700">Section {defaultSection.label}</span>
                    <span className="ml-auto text-[10px] font-medium text-indigo-400 uppercase tracking-wide">Pre-selected</span>
                  </div>
                </div>
              ) : (
                <SelectWrapper
                  label="Section" required loading={loadingSections}
                  value={watch("section_id")} options={sectionOptions}
                  placeholder={selectedClassId ? "Select section" : "Pick class first"}
                  disabled={!selectedClassId}
                  onValueChange={(value) => {
                    setValue("section_id", value);
                    setValue("sectionName", sectionOptions.find((s) => s.value === value)?.label ?? "");
                  }}
                  error={errors.section_id?.message}
                />
              )}
              <SelectWrapper
                label="Subject" required loading={loadingSubjects}
                value={watch("subject_id")} options={subjectOptions}
                placeholder={selectedSectionId ? "Select subject" : "Pick section first"}
                disabled={!selectedSectionId}
                onValueChange={(value) => {
                  setValue("subject_id", value);
                  setValue("subjectname", subjectOptions.find((s) => s.value === value)?.label ?? "");
                }}
                error={errors.subject_id?.message}
              />
            </div>

            {/* ── Row 2: Teacher + Academic Year ── */}
            <div className="grid gap-4 md:grid-cols-2">
              <SelectWrapper
                label="Teacher" required loading={loadingTeachers}
                value={watch("teacher_id")} options={teacherOptions}
                placeholder={
                  !selectedSubjectId
                    ? "Pick subject first"
                    : teacherOptions.length === 0 && !loadingTeachers
                    ? "No teachers for this subject"
                    : "Select teacher"
                }
                disabled={!selectedSubjectId || teacherOptions.length === 0}
                onValueChange={(value) => {
                  setValue("teacher_id", value);
                  setValue("teachername", teacherOptions.find((t) => t.value === value)?.label ?? "");
                }}
                error={errors.teacher_id?.message}
              />
              <SelectWrapper
                label="Academic Year" required loading={loadingAcademicYears}
                value={watch("academic_year")}
                options={academicYears.map((y) => ({ value: y.id, label: y.active ? `${y.yearName} (Active)` : y.yearName }))}
                placeholder="Select academic year"
                onValueChange={(value) => setValue("academic_year", value)}
                error={errors.academic_year?.message}
              />
            </div>

            {/* ── Period Entries Table ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-slate-700">
                  Period Entries <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    {entries.length} entry(ies)
                  </span>
                </p>
                <button
                  type="button"
                  onClick={addEntry}
                  disabled={!selectedSubjectId}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={14} /> Add Entry
                </button>
              </div>

              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 rounded-xl border border-dashed border-gray-200 bg-slate-50 gap-1">
                  <p className="text-xs text-slate-400">No entries yet.</p>
                  <p className="text-xs text-slate-400">
                    {selectedSubjectId
                      ? "Click \u201cAdd Entry\u201d to start adding periods."
                      : "Select a subject first, then add period entries."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100 border-b border-gray-200">
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">#</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Day</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Period</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Time Slot</th>
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wide">Room</th>
                        <th className="px-3 py-2.5 text-right text-xs font-bold text-slate-600 uppercase tracking-wide">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {entries.map((entry, idx) => {
                        const slot = TIME_SLOT_MAP[entry.period_no] ?? TIME_SLOT_MAP["1"];
                        return (
                          <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-2 text-xs font-mono text-slate-400">{idx + 1}</td>
                            <td className="px-3 py-2">
                              <select
                                value={entry.day_of_week}
                                onChange={(e) => {
                                  const newDay = e.target.value;
                                  updateEntry(entry.id, "day_of_week", newDay);
                                  const dayRemaining = remainingMap[newDay];
                                  if (dayRemaining && !dayRemaining.includes(Number(entry.period_no))) {
                                    updateEntry(entry.id, "period_no", String(dayRemaining[0] ?? entry.period_no));
                                  }
                                }}
                                className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
                              >
                                {DAYS.map((d) => {
                                  const isWorking = activeDaySet.has(d.value);
                                  return (
                                    <option
                                      key={d.value}
                                      value={d.value}
                                      disabled={!isWorking}
                                      className={isWorking ? "" : "text-red-300 bg-red-50"}
                                    >
                                      {d.label}{isWorking ? "" : " (Holiday)"}
                                    </option>
                                  );
                                })}
                              </select>
                              {!activeDaySet.has(entry.day_of_week) && (
                                <p className="mt-0.5 text-[10px] text-red-400">Holiday \u2014 not a working day</p>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {(() => {
                                const dayRemaining = remainingMap[entry.day_of_week];
                                const availableOpts = dayRemaining
                                  ? PERIOD_OPTIONS.filter((p) => dayRemaining.includes(Number(p.value)))
                                  : PERIOD_OPTIONS;
                                return (
                                  <select
                                    value={entry.period_no}
                                    onChange={(e) => {
                                      const newPeriod = e.target.value;
                                      updateEntry(entry.id, "period_no", newPeriod);
                                      const newSlot = TIME_SLOT_MAP[newPeriod];
                                      if (newSlot) updateEntry(entry.id, "time_sloat", newSlot.time_sloat);
                                    }}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
                                  >
                                    {availableOpts.length === 0 ? (
                                      <option value="">No free periods</option>
                                    ) : (
                                      availableOpts.map((p) => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                      ))
                                    )}
                                  </select>
                                );
                              })()}
                              {loadingRemaining && (
                                <Loader2 size={10} className="mt-0.5 animate-spin text-indigo-400" />
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {(() => {
                                const parts = entry.time_sloat ? entry.time_sloat.split(" - ") : [];
                                const start24 = parts[0] ? to24h(parts[0]) : "";
                                const end24 = parts[1] ? to24h(parts[1]) : "";
                                return (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="time"
                                      value={start24}
                                      onChange={(ev) => {
                                        const s = to12h(ev.target.value);
                                        const end = parts[1] || "";
                                        updateEntry(entry.id, "time_sloat", end ? `${s} - ${end}` : s);
                                      }}
                                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500 [color-scheme:light]"
                                    />
                                    <span className="text-xs text-slate-300">-</span>
                                    <input
                                      type="time"
                                      value={end24}
                                      onChange={(ev) => {
                                        const start = parts[0] || "";
                                        const e = to12h(ev.target.value);
                                        updateEntry(entry.id, "time_sloat", start ? `${start} - ${e}` : e);
                                      }}
                                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500 [color-scheme:light]"
                                    />
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={entry.room_no}
                                onChange={(e) => updateEntry(entry.id, "room_no", e.target.value)}
                                placeholder="e.g. 101"
                                className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
                              />
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => removeEntry(entry.id)}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                              >
                                <Trash2 size={12} /> Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Hidden fields */}
            <input type="hidden" {...register("className")} />
            <input type="hidden" {...register("sectionName")} />
            <input type="hidden" {...register("subjectname")} />
            <input type="hidden" {...register("teachername")} />
            <input type="hidden" {...register("school_code")} />
            <input type="hidden" {...register("schoolWorkingDayId")} />
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
              disabled={isSaving || entries.length === 0}
              className="rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving\u2026" : `Create ${entries.length} Period(s)`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPeriodModal;
