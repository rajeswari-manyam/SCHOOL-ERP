import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { SubjectOption, TeacherOption } from "../types/timetable.types";
import type { CreateTimetablePayload } from "../types/timetable.types";

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

const DEFAULT_SUBJECTS: SubjectOption[] = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Social", label: "Social" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "PT", label: "PT" },
  { value: "Art", label: "Art" },
];

const currentYear = new Date().getFullYear();
const defaultAcademicYear = `${currentYear}`;
const defaultSchoolCode = localStorage.getItem("schoolcode") ?? "";
const defaultLunchStart = "12:30:00";
const defaultLunchEnd = "01:00:00";

const addPeriodSchema = z.object({
  className: z.string().min(1, "Class is required"),
  sectionName: z.string().min(1, "Section is required"),
  subjectname: z.string().min(1, "Subject is required"),
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
  academic_year: z.string().min(1, "Academic year is required"),
  school_code: z.string().min(1, "School code is required"),
});

type AddPeriodFormData = z.infer<typeof addPeriodSchema>;

interface AddPeriodModalProps {
  open: boolean;
  isSaving?: boolean;
  subjects: SubjectOption[];
  teachers: TeacherOption[];
  onClose: () => void;
  onSave: (data: CreateTimetablePayload) => void;
}

const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  open,
  isSaving,
  subjects = [],
  teachers = [],
  onClose,
  onSave,
}) => {
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
      className: "",
      sectionName: "A",
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
      academic_year: defaultAcademicYear,
      school_code: defaultSchoolCode,
    },
  });

  const subjectOptions = subjects.length > 0 ? subjects : DEFAULT_SUBJECTS;
  const defaultSubject = subjectOptions[0]?.value ?? "";

  useEffect(() => {
    if (open) {
      reset({
        className: "",
        sectionName: "A",
        subjectname: defaultSubject,
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
        academic_year: defaultAcademicYear,
        school_code: defaultSchoolCode,
      });
    }
  }, [open, reset, defaultSubject]);

  const selectedPeriodNo = watch("period_no");
  const selectedTeacherValue = watch("teacher_id");

  useEffect(() => {
    const slot = TIME_SLOT_MAP[selectedPeriodNo];
    if (slot) {
      setValue("time_sloat", slot.time_sloat);
      setValue("start_time", slot.start_time);
      setValue("end_time", slot.end_time);
    }
  }, [selectedPeriodNo, setValue]);

  useEffect(() => {
    const teacher = teachers.find(
      (t) => t.value === selectedTeacherValue || t.label === selectedTeacherValue
    );
    if (teacher) {
      setValue("teachername", teacher.label);
    }
  }, [selectedTeacherValue, teachers, setValue]);

  const handleFormSubmit = (data: AddPeriodFormData) => {
    onSave(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Add Timetable Period</h2>
            <p className="text-sm text-slate-500 mt-1">Create a new period entry for the weekly timetable.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Class <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. 9"
                  {...register("className")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.className && (
                  <p className="mt-1 text-xs text-red-600">{errors.className.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Section <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. A"
                  {...register("sectionName")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.sectionName && (
                  <p className="mt-1 text-xs text-red-600">{errors.sectionName.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("subjectname")}
                  onValueChange={(value) => setValue("subjectname", value)}
                  options={subjectOptions}
                  placeholder="Select subject"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.subjectname && (
                  <p className="mt-1 text-xs text-red-600">{errors.subjectname.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Teacher <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedTeacherValue}
                  onValueChange={(value) => setValue("teacher_id", value)}
                  options={teachers}
                  placeholder="Select teacher"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.teacher_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.teacher_id.message}</p>
                )}
              </div>
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

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Day <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("day_of_week")}
                  onValueChange={(value) => setValue("day_of_week", value)}
                  options={DAYS}
                  placeholder="Select day"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.day_of_week && (
                  <p className="mt-1 text-xs text-red-600">{errors.day_of_week.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Period No <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedPeriodNo}
                  onValueChange={(value) => setValue("period_no", value)}
                  options={PERIOD_OPTIONS}
                  placeholder="Select period"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.period_no && (
                  <p className="mt-1 text-xs text-red-600">{errors.period_no.message}</p>
                )}
              </div>
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
                {errors.time_sloat && (
                  <p className="mt-1 text-xs text-red-600">{errors.time_sloat.message}</p>
                )}
              </div>
            </div>

            <input type="hidden" {...register("teachername")} />
            <input type="hidden" {...register("start_time")} />
            <input type="hidden" {...register("end_time")} />
            <input type="hidden" {...register("lunch_start")} />
            <input type="hidden" {...register("lunch_end")} />
            <input type="hidden" {...register("academic_year")} />
            <input type="hidden" {...register("school_code")} />

            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Auto-filled</p>
              <div className="grid gap-3 md:grid-cols-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">School Code:</span>
                  <span className="text-slate-400">{defaultSchoolCode || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Academic Year:</span>
                  <span className="text-slate-400">{defaultAcademicYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Lunch:</span>
                  <span className="text-slate-400">{defaultLunchStart} – {defaultLunchEnd}</span>
                </div>
              </div>
            </div>
          </div>

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