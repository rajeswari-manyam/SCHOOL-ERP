// components/GenerateReportModal.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Download, Info } from "lucide-react";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { ReportType, ReportFormat } from "../types/reports.types";
import typography, { combineTypography } from "@/styles/typography";
/* =========================
   ZOD SCHEMA
========================= */
const schema = z.object({
  asOfDate: z.string(),
  classFilter: z.string(),
  minOverdue: z.enum(["7+ Days", "15+ Days", "30+ Days"]),
  format: z.enum(["PDF", "Excel"]),

  columns: z.object({
    studentName: z.boolean(),
    parentContact: z.boolean(),
    overdueAmount: z.boolean(),
    daysOverdue: z.boolean(),
    feeBreakdown: z.boolean(),
  }),

  sendTo: z.object({
    myEmail: z.boolean(),
    principal: z.boolean(),
  }),
});

type FormData = z.infer<typeof schema>;

interface GenerateReportModalProps {
  reportType: ReportType;
  title: string;
  onClose: () => void;
  onSubmit: (format: ReportFormat) => void;
}

/* =========================
   COMPONENT
========================= */
export const GenerateReportModal = ({
  title,
  onClose,
  onSubmit,
}: GenerateReportModalProps) => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      asOfDate: "2025-04-07",
      classFilter: "all",
      minOverdue: "15+ Days",
      format: "PDF",
      columns: {
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

  const submitHandler = (data: FormData) => {
    onSubmit(data.format);
  };

  const overdueOptions: FormData["minOverdue"][] = [
    "7+ Days",
    "15+ Days",
    "30+ Days",
  ];

  return (
 <div
  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
<Card className="
  w-full 
  max-w-lg 
  bg-white 
  shadow-xl 
  max-h-[90vh] 
  flex flex-col 
  border-none

  sm:rounded-xl
  sm:max-w-lg

  rounded-none h-full   // 👈 mobile full screen
">
<CardHeader className="sticky top-0 bg-white z-10 flex flex-row items-center justify-between pb-3 border-b">
          <CardTitle>Generate {title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

     <CardContent className="space-y-6 overflow-y-auto flex-1 pr-2">

  {/* Report Type */}
  <div>
    <Label className={combineTypography(typography.form.label, "text-gray-500 uppercase")}>Report Type</Label>
    <Input value={title} disabled className="mt-1  bg-[#E5EEFF] border-none" />
  </div>

  {/* DATE + CLASS (GRID) */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label className={combineTypography(typography.form.label, "text-gray-500 uppercase")}>As of Date</Label>
      <Input type="date" {...register("asOfDate")} className="mt-1  bg-[#E5EEFF] border-none" />
    </div>

    <div>
      <Label className={combineTypography(typography.form.label, "text-gray-500 uppercase")}>Class Filter</Label>
      <select
        {...register("classFilter")}
        className="mt-1 w-full px-3 py-2 border rounded-lg bg-white  bg-[#E5EEFF] border-none"
      >
        <option value="all">All Classes</option>
        <option value="1-5">Primary (1-5)</option>
        <option value="6-8">Middle (6-8)</option>
        <option value="9-10">High School</option>
        <option value="11-12">Higher Secondary</option>
      </select>
    </div>
  </div>

  {/* MIN OVERDUE */}
  <div>
    <Label className={combineTypography(typography.form.label, "text-gray-500 uppercase")}>Min Overdue</Label>
    <div className="flex gap-2 mt-2">
      {overdueOptions.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setValue("minOverdue", opt)}
          className={`px-4 py-1.5 text-sm rounded-full border transition
            ${values.minOverdue === opt
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>

  {/* INCLUDE COLUMNS (GRID LIKE FIGMA) */}
 {/* INCLUDE COLUMNS (IMPROVED UI) */}
<div>
  <Label className={combineTypography(typography.form.label, "text-gray-500 uppercase")}>
    Include Columns
  </Label>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
    {Object.entries(values.columns).map(([key, val]) => (
      <label
        key={key}
        className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition
          ${val
            ? "bg-indigo-50 border-indigo-400"
            : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
      >
        <span className="text-sm font-semibold text-gray-700 capitalize">
          {key.replace(/([A-Z])/g, " $1")}
        </span>

        <input
          type="checkbox"
          checked={val}
          onChange={(e) =>
            setValue(`columns.${key}` as any, e.target.checked)
          }
          className="accent-indigo-600 w-4 h-4"
        />
      </label>
    ))}
  </div>
</div>

  {/* FORMAT + SEND TO (GRID LIKE FIGMA) */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    {/* FORMAT */}
    <div>
      <Label className={combineTypography(typography.form.label, "text-gray-500 uppercase")}>Format</Label>
      <div className="flex gap-2 mt-2">
        {(["PDF", "Excel"] as ReportFormat[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setValue("format", f)}
            className={`px-4 py-2 text-sm rounded-lg border
              ${values.format === f
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white border-gray-300 text-gray-600"
              }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>

    {/* SEND TO */}
    <div>
      <Label className={combineTypography(typography.form.label, "text-gray-500 uppercase")}>Send To</Label>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("sendTo.myEmail")} />
          My Email
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("sendTo.principal")} />
          Principal
        </label>
      </div>
    </div>

  </div>

  {/* INFO BOX */}
  <div className="p-3 bg-indigo-50 rounded-lg flex gap-2 items-start text-sm">
    <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
    <p className="text-indigo-700">
      Report will include students with dues based on selected filters.
    </p>
  </div>

  {/* ACTIONS */}
<div className="sticky bottom-0 bg-white pt-3 pb-2 border-t shadow-sm">
  <div className="flex gap-3">
    <Button variant="outline" onClick={onClose} className="flex-1">
      Cancel
    </Button>

    <Button
      onClick={handleSubmit(submitHandler)}
      className="flex-1 bg-indigo-600 text-white gap-2"
    >
      <Download className="w-4 h-4" />
      Generate Report
    </Button>
  </div>
</div>

</CardContent>
      </Card>
    </div>
  );
};