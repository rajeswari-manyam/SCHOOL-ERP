import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateExamTimetablePayload } from "../types/timetable.types";

const addExamTimetableSchema = z.object({
  subjectname: z.string().min(1, "Subject is required"),
  classname: z.string().min(1, "Class is required"),
  sectionname: z.string().min(1, "Section is required"),
  exam_name: z.string().min(1, "Exam name is required"),
  exam_date: z.string().min(1, "Exam date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  room_no: z.string().min(1, "Room number is required"),
  academic_year: z.string().min(1, "Academic year is required"),
  school_code: z.string().min(1, "School code is required"),
});

type AddExamTimetableFormData = z.infer<typeof addExamTimetableSchema>;

interface AddExamTimetableModalProps {
  open: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (data: CreateExamTimetablePayload) => void;
}

const AddExamTimetableModal: React.FC<AddExamTimetableModalProps> = ({
  open,
  isSaving,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddExamTimetableFormData>({
    resolver: zodResolver(addExamTimetableSchema),
    defaultValues: {
      subjectname: "",
      classname: "",
      sectionname: "A",
      exam_name: "",
      exam_date: "",
      start_time: "09:00",
      end_time: "12:00",
      room_no: "",
      academic_year: "2026-2027",
      school_code: "",
    },
  });

  const handleFormSubmit = (data: AddExamTimetableFormData) => {
    onSave(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Add Exam Timetable</h2>
            <p className="text-sm text-slate-500 mt-1">Schedule a new exam entry for the academic year.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close add exam timetable modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            {/* Row 1: Subject + Class + Section */}
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
                  Class <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. 10"
                  {...register("classname")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.classname && (
                  <p className="mt-1 text-xs text-red-600">{errors.classname.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Section <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. A"
                  {...register("sectionname")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.sectionname && (
                  <p className="mt-1 text-xs text-red-600">{errors.sectionname.message}</p>
                )}
              </div>
            </div>

            {/* Row 2: Exam Name + Exam Date + Room No */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Exam Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Final Exams"
                  {...register("exam_name")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.exam_name && (
                  <p className="mt-1 text-xs text-red-600">{errors.exam_name.message}</p>
                )}
              </div>
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

            {/* Row 3: Start Time + End Time */}
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

            {/* Row 4: Academic Year + School Code */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Academic Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. 2026-2027"
                  {...register("academic_year")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.academic_year && (
                  <p className="mt-1 text-xs text-red-600">{errors.academic_year.message}</p>
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
              {isSaving ? "Saving…" : "Create Exam Timetable"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamTimetableModal;
