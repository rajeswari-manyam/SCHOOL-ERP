import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { ExamEntry } from "../types/timetable.types";

const addExamSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  className: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  venue: z.string().min(1, "Venue is required"),
});

type AddExamFormData = z.infer<typeof addExamSchema>;

interface AddExamModalProps {
  open: boolean;
  classOptions: { id: string; label: string }[];
  defaultClass: string;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (data: Omit<ExamEntry, "id" | "notifyStatus">) => void;
}

const AddExamModal: React.FC<AddExamModalProps> = ({
  open,
  classOptions,
  defaultClass,
  isSaving,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddExamFormData>({
    resolver: zodResolver(addExamSchema),
    defaultValues: {
      subject: "",
      className: defaultClass,
      date: "",
      startTime: "",
      endTime: "",
      venue: "",
    },
  });

  const handleFormSubmit = (data: AddExamFormData) => {
    onSave(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Add Exam Schedule</h2>
            <p className="text-sm text-slate-500 mt-1">Create a new exam entry for the selected class.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close add exam modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-6 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Physics"
                  {...register("subject")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Class <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("className")}
                  onValueChange={(value) => setValue("className", value)}
                  options={classOptions.map((option) => ({
                    label: option.label,
                    value: option.label,
                  }))}
                  placeholder="Select class"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.className && (
                  <p className="mt-1 text-xs text-red-600">{errors.className.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  {...register("date")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  Start time <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  {...register("startTime")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.startTime && (
                  <p className="mt-1 text-xs text-red-600">{errors.startTime.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-bold text-slate-700">
                  End time <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="time"
                  {...register("endTime")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
                {errors.endTime && (
                  <p className="mt-1 text-xs text-red-600">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-bold text-slate-700">
                Venue <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. Room 10A"
                {...register("venue")}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              />
              {errors.venue && (
                <p className="mt-1 text-xs text-red-600">{errors.venue.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
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
              {isSaving ? "Saving…" : "Save Exam"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExamModal;
