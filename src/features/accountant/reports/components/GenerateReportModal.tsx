import { X, Download, Info } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { ReportType, ReportFormat } from "../types/reports.types";
import type { GenerateReportInput } from "../types/reports.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Controller } from "react-hook-form";
const generateReportSchema = z.object({
  asOfDate: z.string().min(1, "Date is required"),

  classFilter: z.string().min(1, "Class filter is required"),

 minOverdue: z.enum(["7+ Days", "15+ Days", "30+ Days"], {
  error: "Select overdue range",
}),
  format: z.enum(["PDF", "Excel"], {
    error: "Select format",
  }),

  includeColumns: z.object({
    studentName: z.boolean(),
    parentContact: z.boolean(),
    overdueAmount: z.boolean(),
    daysOverdue: z.boolean(),
    feeBreakdown: z.boolean(),
  }).refine(
    (data) => Object.values(data).some(Boolean),
    {
      message: "Select at least one column",
    }
  ),

  sendTo: z.object({
    myEmail: z.boolean(),
    principal: z.boolean(),
  }),
});
type GenerateReportForm = z.infer<typeof generateReportSchema>;

interface GenerateReportModalProps {
  reportType: ReportType;
  title: string;
  onClose: () => void;
  onSubmit: (data: GenerateReportInput) => void;
}

const columnLabels: Record<string, string> = {
  studentName: "Student Name",
  parentContact: "Parent Contact",
  overdueAmount: "Overdue Amount",
  daysOverdue: "Days Overdue",
  feeBreakdown: "Fee Breakdown",
};

const FigmaCheckbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-[18px] h-[18px] rounded flex items-center justify-center border-2 shrink-0 transition-colors
      ${checked
        ? "bg-indigo-600 border-indigo-600"
        : "bg-white border-gray-300 hover:border-indigo-400"
      }`}
  >
    {checked && (
      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6l3 3 5-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </button>
);

export const GenerateReportModal = ({
  reportType,
  title,
  onClose,
  onSubmit,
}: GenerateReportModalProps) => {
 const {
  register,
  setValue,
  watch,
    control,
  handleSubmit,
  formState: { errors },   
} = useForm<GenerateReportForm>({
      resolver: zodResolver(generateReportSchema),
      defaultValues: {
        asOfDate: "2025-04-07",
        classFilter: "all",
        minOverdue: "15+ Days",
        format: "PDF",
        includeColumns: {
          studentName: true,
          parentContact: true,
          overdueAmount: true,
          daysOverdue: true,
          feeBreakdown: false,
        },
        sendTo: {
          myEmail: true,
          principal: false,
        },
      },
    });

  const values = watch();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
const submitHandler = (data: GenerateReportForm) => {
  onSubmit({
    reportType,
    asOfDate: data.asOfDate,
    classFilter: data.classFilter,
    minOverdue: data.minOverdue,
    includeColumns: data.includeColumns,
    format: data.format,
    sendTo: data.sendTo,
  });

  onClose(); 
};

  const overdueOptions: GenerateReportForm["minOverdue"][] = [
    "7+ Days",
    "15+ Days",
    "30+ Days",
  ];

  const columnEntries = Object.entries(values.includeColumns);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full sm:max-w-lg bg-white shadow-2xl flex flex-col sm:rounded-2xl rounded-none h-full sm:h-auto sm:max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-900">
            Generate {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition rounded-full p-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          <div>
            <Label className="text-[11px] font-semibold text-gray-900 uppercase tracking-widest">
              Report Type
            </Label>
            <Input
              value={title}
              disabled
              className="mt-1.5 bg-[#EFF4FF] border-none text-gray-700 font-medium h-10 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                As of Date
              </Label>
             <Input
  type="date"
  {...register("asOfDate")}
  className={`mt-1.5 h-10 rounded-lg ${
    errors.asOfDate ? "border border-red-500" : "bg-[#EFF4FF] border-none"
  }`}
/>

{errors.asOfDate && (
  <p className="text-xs text-red-500 mt-1">Date is required</p>
)}
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                Class Filter
              </Label>
          <select
  {...register("classFilter")}
  className={`mt-1.5 w-full h-10 px-3 rounded-lg text-sm ${
    errors.classFilter ? "border border-red-500" : "bg-[#EFF4FF]"
  }`}
>
                <option value="all">All Classes</option>
                <option value="1-5">Primary (1-5)</option>
                <option value="6-8">Middle (6-8)</option>
                <option value="9-10">High School</option>
                <option value="11-12">Higher Secondary</option>
              </select>
            </div>
          </div>
<Controller
  name="minOverdue"
  control={control}
  render={({ field }) => (
    <div>
      <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
        Min Overdue
      </Label>

      <div className="flex gap-2 mt-2">
        {overdueOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => field.onChange(opt)}
            className={`px-4 py-1.5 text-sm rounded-full border-2 transition font-medium
              ${field.value === opt
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {errors.minOverdue && (
        <p className="text-xs text-red-500 mt-1">
          {errors.minOverdue.message}
        </p>
      )}
    </div>
  )}
/>

          <div>
            <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Include Columns
            </Label>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-3">
              {columnEntries.map(([key, val]) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                  <FigmaCheckbox
                    checked={val}
                    onChange={(v) =>
                      setValue(`includeColumns.${key}` as any, v)
                    }
                  />
                  <span className="text-sm text-gray-700">
                    {columnLabels[key]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

           <div>
  <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
    Format
  </Label>

  <div className="flex gap-2 mt-2">
    {(["PDF", "Excel"] as ReportFormat[]).map((f) => (
      <button
        key={f}
        type="button"
        onClick={() => setValue("format", f)}
        className={`px-5 py-1.5 text-sm rounded-full border-2 font-medium transition
          ${values.format === f
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-white border-gray-200 text-gray-500"
          }`}
      >
        {f}
      </button>
    ))}
  </div>

  {errors.format && (
    <p className="text-xs text-red-500 mt-1">
      {errors.format.message}
    </p>
  )}
</div>
           
            <div>
              <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                Send To
              </Label>
              <div className="flex flex-col gap-2.5 mt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <FigmaCheckbox
                    checked={values.sendTo.myEmail}
                    onChange={(v) => setValue("sendTo.myEmail", v)}
                  />
                  <span className="text-sm text-gray-700">My email</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <FigmaCheckbox
                    checked={values.sendTo.principal}
                    onChange={(v) => setValue("sendTo.principal", v)}
                  />
                  <span className="text-sm text-gray-700">Principal</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-indigo-50 rounded-xl px-4 py-3 text-sm text-indigo-600">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="leading-snug">
              Report will include students with dues based on selected filters.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit(submitHandler)}
            className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium gap-2"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </Button>
        </div>

      </div>
    </div>
  );
};