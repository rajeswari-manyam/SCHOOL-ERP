import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { useReps, useMarketingMutations } from "../hooks/useMarketing";
import type { MarketingRep } from "../types/marketing.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const schema = z.object({
  repId: z.string().min(1, "Select a representative"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["P", "A", "H"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const STATUS_OPTIONS = [
  { value: "P", label: "Present" },
  { value: "A", label: "Absent" },
  { value: "H", label: "Half Day" },
];


interface AttendanceModalProps {
  open: boolean;
  onClose: () => void;
  defaultRepId?: string;
}

const AttendanceModal = ({ open, onClose, defaultRepId }: AttendanceModalProps) => {
  const { data: repsResponse } = useReps({ search: "", territory: "", status: "ALL", page: 1, pageSize: 100 });
  const reps = (repsResponse?.data ?? []) as MarketingRep[];

  const { markAttendance } = useMarketingMutations();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      repId: defaultRepId ?? "",
      date: new Date().toISOString().slice(0, 10),
      status: "P",
      notes: "",
    },
  });

  useEffect(() => {
    if (defaultRepId) {
      setValue("repId", defaultRepId, { shouldValidate: true });
    }
  }, [defaultRepId, setValue]);

  const onSubmit = (values: FormValues) => {
    markAttendance.mutate(
      { repId: values.repId, date: values.date, status: values.status },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-xl overflow-hidden bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 pt-6 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Mark Attendance</h2>
              <p className="mt-0.5 text-sm text-gray-400">Record today's attendance for a representative</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 pb-6" noValidate>
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                Representative
              </Label>
              <Select
                {...register("repId")}
                options={reps.map((rep) => ({ value: rep.id, label: `${rep.name} — ${rep.territory}` }))}
                className="mt-2"
                placeholder="Select representative"
              />
              {errors.repId && <p className="text-xs text-red-500 mt-2">{errors.repId.message}</p>}
            </div>

            <div>
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                Date
              </Label>
              <Input
                type="date"
                {...register("date")}
                className="mt-2"
              />
              {errors.date && <p className="text-xs text-red-500 mt-2">{errors.date.message}</p>}
            </div>

            <div>
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                Status
              </Label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("status", option.value as FormValues["status"], { shouldValidate: true })}
                    className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-indigo-300 hover:bg-gray-50"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.status && <p className="text-xs text-red-500 mt-2">{errors.status.message}</p>}
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              Rep's location will be logged automatically from their last WhatsApp check-in.
            </div>

            <div>
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Notes (optional)
              </Label>
              <textarea
                {...register("notes")}
                rows={4}
                placeholder="e.g. On field visit to Khammam"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold">
                Cancel
              </Button>
              <Button type="submit" className="px-6 py-3 text-sm font-bold">
                {markAttendance.isPending ? "Saving…" : "Save Attendance"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AttendanceModal;
