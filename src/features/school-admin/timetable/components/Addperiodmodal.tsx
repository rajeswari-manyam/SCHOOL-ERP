import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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

const TIME_SLOTS = [
  "08:00 AM - 08:45 AM",
  "08:45 AM - 09:30 AM",
  "09:30 AM - 10:15 AM",
  "10:15 AM - 11:00 AM",
  "11:15 AM - 12:00 PM",
  "12:00 PM - 12:45 PM",
  "01:30 PM - 02:15 PM",
  "02:15 PM - 03:00 PM",
].map((slot) => ({ value: slot, label: slot }));

const addPeriodSchema = z.object({
  className: z.string().min(1, "Class name is required"),
  sectionName: z.string().min(1, "Section is required"),
  subjectname: z.string().min(1, "Subject is required"),
  teacher_id: z.string().min(1, "Teacher ID is required"),
  teachername: z.string().min(1, "Teacher name is required"),
  period_no: z.string().min(1, "Period number is required"),
  time_sloat: z.string().min(1, "Time slot is required"),
  day_of_week: z.string().min(1, "Day is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  room_no: z.string().min(1, "Room number is required"),
  lunch_start: z.string().min(1, "Lunch start time is required"),
  lunch_end: z.string().min(1, "Lunch end time is required"),
  academic_year: z.string().min(1, "Academic year is required"),
  school_code: z.string().min(1, "School code is required"),
});

type AddPeriodFormData = z.infer<typeof addPeriodSchema>;

interface AddPeriodModalProps {
  open: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (data: CreateTimetablePayload) => void;
}

const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  open,
  isSaving,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
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
      time_sloat: "09:00 AM - 09:45 AM",
      day_of_week: "monday",
      start_time: "09:00:00",
      end_time: "09:45:00",
      room_no: "",
      lunch_start: "12:30:00",
      lunch_end: "01:00:00",
      academic_year: "2026",
      school_code: "",
    },
  });

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
            aria-label="Close add period modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            {/* Row 1: Class + Section + Academic Year */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Class <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. 10"
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
                  Academic Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. 2026"
                  {...register("academic_year")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.academic_year && (
                  <p className="mt-1 text-xs text-red-600">{errors.academic_year.message}</p>
                )}
              </div>
            </div>

            {/* Row 2: Subject + Teacher Name + Teacher ID */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Mathematics"
                  {...register("subjectname")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.subjectname && (
                  <p className="mt-1 text-xs text-red-600">{errors.subjectname.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Teacher Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Ramesh Sir"
                  {...register("teachername")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.teachername && (
                  <p className="mt-1 text-xs text-red-600">{errors.teachername.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Teacher ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="UUID"
                  {...register("teacher_id")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.teacher_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.teacher_id.message}</p>
                )}
              </div>
            </div>

            {/* Row 3: Day + Period No + Time Slot */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Day <span className="text-red-500">*</span>
                </Label>
                <Select
                  {...register("day_of_week")}
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
                  {...register("period_no")}
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
                <Select
                  {...register("time_sloat")}
                  options={TIME_SLOTS}
                  placeholder="Select time slot"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.time_sloat && (
                  <p className="mt-1 text-xs text-red-600">{errors.time_sloat.message}</p>
                )}
              </div>
            </div>

            {/* Row 4: Start Time + End Time + Room No */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Start Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  step="1"
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
                  step="1"
                  {...register("end_time")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.end_time && (
                  <p className="mt-1 text-xs text-red-600">{errors.end_time.message}</p>
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

            {/* Row 5: Lunch Start + Lunch End + School Code */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Lunch Start <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  step="1"
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
                  step="1"
                  {...register("lunch_end")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.lunch_end && (
                  <p className="mt-1 text-xs text-red-600">{errors.lunch_end.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  School Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. 556677"
                  {...register("school_code")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.school_code && (
                  <p className="mt-1 text-xs text-red-600">{errors.school_code.message}</p>
                )}
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
