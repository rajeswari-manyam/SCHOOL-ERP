import { useForm, Controller, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import type { ReportType,  GenerateReportPayload } from "../types/reports.types";
import { REPORT_CARDS } from "../utils/report-config";
import { useGenerateReport } from "../hooks/useReports";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// ── Schema ──────────────────────────────────────────────────
const schema = z.object({
  type: z.enum(["REVENUE", "SCHOOLS", "MARKETING", "WHATSAPP", "FEE", "AUDIT"]),
  format: z.enum(["PDF", "CSV", "EXCEL"]),
  periodType: z.enum(["THIS_MONTH", "LAST_MONTH", "LAST_3_MONTHS", "CUSTOM"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  schoolFilter: z.string().default("ALL"),
  emailWhenReady: z.boolean().default(false),
}).refine(
  (d) => d.periodType !== "CUSTOM" || (!!d.startDate && !!d.endDate),
  { message: "Both dates required for custom range", path: ["startDate"] }
);

type FormValues = z.infer<typeof schema>;
type PeriodType = FormValues["periodType"];

// ── Constants ───────────────────────────────────────────────
const PERIOD_PILLS: { value: PeriodType; label: string }[] = [
  { value: "THIS_MONTH",   label: "This Month" },
  { value: "LAST_MONTH",   label: "Last Month" },
  { value: "LAST_3_MONTHS", label: "Last 3 Months" },
  { value: "CUSTOM",       label: "Custom" },
];

const FORMAT_OPTIONS: { value: FormValues["format"]; label: string }[] = [
  { value: "PDF",   label: "PDF" },
  { value: "CSV",   label: "CSV" },
  { value: "EXCEL", label: "Excel" },
];

const SCHOOL_OPTIONS = [
  { value: "ALL", label: "All Schools" },
  { value: "ACTIVE", label: "Active Schools Only" },
  { value: "TRIAL", label: "Trial Schools Only" },
];

const REPORT_TYPE_OPTIONS = REPORT_CARDS.map((c) => ({
  value: c.type,
  label: c.title,
}));

// ── Helpers ─────────────────────────────────────────────────
function getDateRange(periodType: PeriodType, startDate?: string, endDate?: string) {
  const now = new Date();
  switch (periodType) {
    case "THIS_MONTH":
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case "LAST_MONTH": {
      const last = subMonths(now, 1);
      return { from: startOfMonth(last), to: endOfMonth(last) };
    }
    case "LAST_3_MONTHS":
      return { from: startOfMonth(subMonths(now, 2)), to: endOfMonth(now) };
    case "CUSTOM":
      if (startDate && endDate) {
        return { from: new Date(startDate), to: new Date(endDate) };
      }
      return null;
    default:
      return null;
  }
}

function getPeriodLabel(periodType: PeriodType, startDate?: string, endDate?: string) {
  const range = getDateRange(periodType, startDate, endDate);
  if (!range) return "—";
  return `${format(range.from, "MMMM yyyy")}`;
}

function getEstimatedSize(type: string, fmt: string) {
  const base: Record<string, number> = { REVENUE: 2.4, SCHOOLS: 1.8, MARKETING: 3.1, WHATSAPP: 0.9, FEE: 2.8, AUDIT: 1.2 };
  const fmtMul: Record<string, number> = { PDF: 1, CSV: 0.3, EXCEL: 0.7 };
  const size = (base[type] ?? 2) * (fmtMul[fmt] ?? 1);
  return `~${size.toFixed(1)} MB`;
}

// ── Component ────────────────────────────────────────────────
interface GenerateReportModalProps {
  open: boolean;
  preselectedType?: ReportType;
  onClose: () => void;
}

const labelClass = "block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2";

const GenerateReportModal = ({ open, preselectedType, onClose }: GenerateReportModalProps) => {
  const { mutate, isPending } = useGenerateReport();

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      type: preselectedType ?? "REVENUE",
      format: "PDF",
      periodType: "LAST_MONTH",
      schoolFilter: "ALL",
      emailWhenReady: false,
    },
  });

  const type = useWatch({ control, name: "type" }) as FormValues["type"];
  const format_ = useWatch({ control, name: "format" }) as FormValues["format"];
  const periodType = useWatch({ control, name: "periodType" }) as FormValues["periodType"];
  const startDate = useWatch({ control, name: "startDate" }) as string | undefined;
  const endDate = useWatch({ control, name: "endDate" }) as string | undefined;
  const schoolFilter = useWatch({ control, name: "schoolFilter" }) as string;

  // Auto-fill dates from period
  const dateRange = useMemo(() => getDateRange(periodType, startDate, endDate), [periodType, startDate, endDate]);

  const displayFrom = dateRange ? format(dateRange.from, "dd MMM yyyy") : "—";
  const displayTo   = dateRange ? format(dateRange.to,   "dd MMM yyyy") : "—";
  const periodLabel = getPeriodLabel(periodType, startDate, endDate);
  const reportLabel = REPORT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? "Report";
  const schoolLabel = SCHOOL_OPTIONS.find((o) => o.value === schoolFilter)?.label ?? "All Schools";
  const estSize     = getEstimatedSize(type, format_);

  if (!open) return null;

  const onSubmit = (values: FormValues) => {
    mutate(values as unknown as GenerateReportPayload, { onSuccess: onClose });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <Card className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl my-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start justify-between px-7 pt-6 pb-5">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Generate Report</h2>
              <p className="text-sm text-gray-400 mt-0.5">Configure and download a platform report</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors mt-0.5"
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="px-7 space-y-5 pb-2">

              {/* Report Type — dropdown */}
              <div>
                <Label className={labelClass} required>
                  Report Type
                </Label>
                <Select
                  {...register("type")}
                  options={REPORT_TYPE_OPTIONS}
                  className="pr-10 cursor-pointer"
                />
                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
              </div>

              {/* Period — pill buttons */}
              <div>
                <Label className={labelClass} required>
                  Period
                </Label>
                <div className="flex flex-wrap gap-2">
                  {PERIOD_PILLS.map((p) => {
                    const active = periodType === p.value;
                    return (
                      <Button
                        key={p.value}
                        type="button"
                        variant={active ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue("periodType", p.value)}
                        className={active ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" : "text-gray-600 hover:bg-gray-100"}
                      >
                        {p.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* From / To — read-only display or date inputs if custom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={labelClass}>From</Label>
                  {periodType === "CUSTOM" ? (
                    <>
                      <Input type="date" {...register("startDate")} />
                      {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>}
                    </>
                  ) : (
                    <div className="h-11 px-4 flex items-center rounded-xl border border-gray-200 text-sm text-gray-800 bg-white">
                      {displayFrom}
                    </div>
                  )}
                </div>
                <div>
                  <Label className={labelClass}>To</Label>
                  {periodType === "CUSTOM" ? (
                    <Input type="date" {...register("endDate")} />
                  ) : (
                    <div className="h-11 px-4 flex items-center rounded-xl border border-gray-200 text-sm text-gray-800 bg-white">
                      {displayTo}
                    </div>
                  )}
                </div>
              </div>

              {/* School Filter */}
              <div>
                <Label className={labelClass}>School Filter</Label>
                <Select
                  {...register("schoolFilter")}
                  options={SCHOOL_OPTIONS}
                  className="pr-10 cursor-pointer"
                />
              </div>

              {/* Format — segmented button */}
              <div>
                <Label className={labelClass} required>
                  Format
                </Label>
                <div className="grid grid-cols-3 gap-0 rounded-xl border border-gray-200 overflow-hidden">
                  {FORMAT_OPTIONS.map((f, i) => {
                    const active = format_ === f.value;
                    return (
                      <Button
                        key={f.value}
                        type="button"
                        variant={active ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setValue("format", f.value)}
                        className={`h-11 rounded-none ${active ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"} ${i !== FORMAT_OPTIONS.length - 1 ? "border-r border-gray-200" : ""}`}
                      >
                        {f.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Email checkbox */}
              <div className="flex items-center gap-3">
                <Controller
                  name="emailWhenReady"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="emailWhenReady"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <label htmlFor="emailWhenReady" className="text-sm text-gray-700 cursor-pointer select-none">
                  Email report to me when ready
                </label>
              </div>

              {/* Report Preview */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 px-5 py-4">
                <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                  Report Preview
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {reportLabel} for{" "}
                  <span className="font-bold text-gray-900">{periodLabel}</span>{" "}
                  — {schoolLabel} —{" "}
                  {format_} format
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Estimated size: <span className="font-medium text-gray-500">{estSize}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-7 py-5 mt-1">
              <Button type="button" variant="outline" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-2">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm shadow-indigo-200"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Generate &amp; Download
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default GenerateReportModal;