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
    watch,
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

  const selectedStatus = watch("status");

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

  const statusColors: Record<string, string> = {
    P: "border-emerald-400 bg-emerald-50 text-emerald-700",
    A: "border-red-400 bg-red-50 text-red-700",
    H: "border-amber-400 bg-amber-50 text-amber-700",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container — bottom sheet on mobile, centered card on sm+ */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <Card
          className={[
            // Mobile: full-width bottom sheet
            "w-full rounded-t-2xl rounded-b-none",
            // sm+: floating centered card
            "sm:rounded-2xl sm:max-w-xl",
            // Shared
            "overflow-hidden bg-white shadow-2xl",
            // Scrollable on small screens (e.g. when keyboard is open)
            "max-h-[92dvh] flex flex-col",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative flex items-start justify-between gap-4 border-b border-gray-100 px-4 pt-6 pb-4 sm:px-6">
            {/* Drag handle — mobile only */}
            <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-gray-200 sm:hidden" />

            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Mark Attendance</h2>
              <p className="mt-0.5 text-sm text-gray-400">
                Record today's attendance for a representative
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Scrollable form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto space-y-5 px-4 py-5 sm:px-6 sm:pb-6"
            noValidate
          >
            {/* Representative */}
            <div className="space-y-1.5">
              <Label
                className="text-[11px] font-bold uppercase tracking-widest text-gray-500"
                required
              >
                Representative
              </Label>
              <Select
                {...register("repId")}
                options={reps.map((rep) => ({
                  value: rep.id,
                  label: `${rep.name} — ${rep.territory}`,
                }))}
                className="mt-1 h-11 sm:h-9"
                placeholder="Select representative"
              />
              {errors.repId && (
                <p className="text-xs text-red-500">{errors.repId.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label
                className="text-[11px] font-bold uppercase tracking-widest text-gray-500"
                required
              >
                Date
              </Label>
              <Input
                type="date"
                {...register("date")}
                className="h-11 sm:h-9"
              />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date.message}</p>
              )}
            </div>

            {/* Status toggle buttons */}
            <div className="space-y-1.5">
              <Label
                className="text-[11px] font-bold uppercase tracking-widest text-gray-500"
                required
              >
                Status
              </Label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {STATUS_OPTIONS.map((option) => {
                  const isSelected = selectedStatus === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setValue("status", option.value as FormValues["status"], {
                          shouldValidate: true,
                        })
                      }
                      className={[
                        "rounded-2xl border px-2 py-3 text-sm font-semibold transition-colors",
                        "min-h-[44px]", // accessible touch target
                        isSelected
                          ? statusColors[option.value]
                          : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {errors.status && (
                <p className="text-xs text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* Info banner */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              Rep's location will be logged automatically from their last WhatsApp check-in.
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Notes (optional)
              </Label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="e.g. On field visit to Khammam"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
              />
            </div>

            {/* Footer actions — stacked on mobile, inline on sm+ */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full h-11 text-sm font-semibold sm:w-auto sm:h-9 sm:px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={markAttendance.isPending}
                className="w-full h-11 text-sm font-bold sm:w-auto sm:h-9 sm:px-6"
              >
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