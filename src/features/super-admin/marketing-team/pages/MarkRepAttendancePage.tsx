import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReps, useMarketingMutations } from "../hooks/useMarketing";
import type { MarketingRep } from "../types/marketing.types";
import { Button } from "@/components/ui/button";
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

const MarkRepAttendancePage = () => {
  const navigate = useNavigate();
  const goBackToMarketing = () => navigate("/superadmin/marketing");
  const { data: repsResponse } = useReps({ search: "", territory: "", status: "ALL", page: 1, pageSize: 100 });
  const reps = (repsResponse?.data ?? []) as MarketingRep[];

  const { markAttendance } = useMarketingMutations();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      repId: "",
      date: new Date().toISOString().slice(0, 10),
      status: "P",
      notes: "",
    },
  });

  const selectedStatus = watch("status");

  const onSubmit = (values: FormValues) => {
    markAttendance.mutate(
      { repId: values.repId, date: values.date, status: values.status },
      { onSuccess: goBackToMarketing }
    );
  };

  const statusColors: Record<string, string> = {
    P: "border-emerald-400 bg-emerald-50 text-emerald-700",
    A: "border-red-400 bg-red-50 text-red-700",
    H: "border-amber-400 bg-amber-50 text-amber-700",
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
        <button
          type="button"
          onClick={goBackToMarketing}
          className="hover:text-gray-600 dark:hover:text-gray-300"
        >
          Marketing Team
        </button>
        <span>›</span>
        <span className="text-gray-600 dark:text-gray-300">Mark Attendance</span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-white/10 px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <CalendarCheck size={18} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">Mark Attendance</h1>
              <p className="mt-0.5 text-sm text-gray-400">
                Record today's attendance for a representative
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
            onClick={goBackToMarketing}
            aria-label="Back to marketing team"
          >
            <ArrowLeft size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-5" noValidate>
          {/* Representative */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
              Representative
            </Label>
            <Select
              {...register("repId")}
              options={reps.map((rep) => ({
                value: rep.id,
                label: `${rep.name} — ${rep.territory}`,
              }))}
              className="mt-1 h-11 sm:h-9 bg-[#EFF4FF]"
              placeholder="Select representative"
            />
            {errors.repId && <p className="text-xs text-red-500">{errors.repId.message}</p>}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
              Date
            </Label>
            <Input type="date" {...register("date")} className="h-11 sm:h-9 bg-[#EFF4FF]" />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
          </div>

          {/* Status toggle buttons */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
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
                      "min-h-[44px]",
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
            {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
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
              className="w-full rounded-2xl border border-gray-200 bg-[#EFF4FF] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          {/* Footer actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 dark:border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBackToMarketing}
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
      </div>
    </div>
  );
};

export default MarkRepAttendancePage;
