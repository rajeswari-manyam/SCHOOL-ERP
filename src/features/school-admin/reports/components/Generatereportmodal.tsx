import type { GenerateReportFormData, ReportType } from "../types/reports.types";
import type { ChangeEventHandler, ReactNode } from "react";
import { Check, Download, Info, X } from "lucide-react";
import { REPORT_CARDS, CLASSES } from "../utils/Report config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface GenerateReportModalProps {
  form: GenerateReportFormData;
  generating: boolean;
  success: boolean;
  estimatedSize: string;
  onClose: () => void;
  onSetField: <K extends keyof GenerateReportFormData>(key: K, value: GenerateReportFormData[K]) => void;
  onToggleSection: (key: keyof GenerateReportFormData["includeSections"]) => void;
  onGenerate: () => void;
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-700">{label}</label>
    {children}
  </div>
);

const DATE_RANGE_OPTIONS = ["This Month", "Last Month", "Custom Range"] as const;

const SectionCheckbox = ({
  label,
  checked,
  onChange,
  premium,
}: {
  label: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  premium?: boolean;
}) => (
  <label className="flex items-center gap-2.5 cursor-pointer">
    <Checkbox
      checked={checked}
      onChange={onChange}
      disabled={premium}
      className="w-4 h-4"
    />
    <span className={`text-sm ${premium ? "text-gray-400" : "text-gray-700"}`}>{label}</span>
    {premium && (
      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase rounded">
        Premium
      </span>
    )}
  </label>
);

const GenerateReportModal = ({
  form,
  generating,
  success,
  estimatedSize,
  onClose,
  onSetField,
  onToggleSection,
  onGenerate,
}: GenerateReportModalProps) => {
  const reportLabel = REPORT_CARDS.find(c => c.id === form.reportType)?.title ?? "Report";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Generate {reportLabel}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Configure and download your report</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Report Type */}
          <Field label="Report Type">
            <Select
              options={REPORT_CARDS.map(c => ({ label: c.title, value: c.id }))}
              value={form.reportType}
              onValueChange={(value) => onSetField("reportType", value as ReportType)}
              className="text-sm"
            />
          </Field>

          {/* Date Range */}
          <Field label="Date Range">
            <div className="flex gap-2">
              {DATE_RANGE_OPTIONS.map(opt => (
                <Button
                  key={opt}
                  type="button"
                  variant={form.dateRangeType === opt ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSetField("dateRangeType", opt)}
                  className="flex-1"
                >
                  {opt}
                </Button>
              ))}
            </div>
          </Field>

          {/* From / To dates */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="From">
              <Input
                type="date"
                value={form.fromDate}
                onChange={(e) => onSetField("fromDate", e.target.value)}
                className="w-full"
              />
            </Field>
            <Field label="To">
              <Input
                type="date"
                value={form.toDate}
                onChange={(e) => onSetField("toDate", e.target.value)}
                className="w-full"
              />
            </Field>
          </div>

          {/* Class */}
          <Field label="Class">
            <Select
              options={CLASSES.map(c => ({ label: c, value: c }))}
              value={form.classFilter}
              onValueChange={(value) => onSetField("classFilter", value)}
              className="text-sm"
            />
          </Field>

          {/* Format */}
          <Field label="Format">
            <div className="flex gap-2">
              {(["PDF", "CSV"] as const).map(f => (
                <Button
                  key={f}
                  type="button"
                  variant={form.format === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSetField("format", f)}
                  className="px-5"
                >
                  {f}
                </Button>
              ))}
            </div>
          </Field>

          {/* Include sections */}
          {form.reportType === "ATTENDANCE" && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Include Sections</p>
              <SectionCheckbox
                label="Class-wise summary"
                checked={form.includeSections.classwiseSummary}
                onChange={() => onToggleSection("classwiseSummary")}
              />
              <SectionCheckbox
                label="Daily attendance grid (all 30 days)"
                checked={form.includeSections.dailyAttendanceGrid}
                onChange={() => onToggleSection("dailyAttendanceGrid")}
              />
              <SectionCheckbox
                label="Chronic absentees list"
                checked={form.includeSections.chronicAbsentees}
                onChange={() => onToggleSection("chronicAbsentees")}
              />
              <SectionCheckbox
                label="Teacher-wise marking status"
                checked={form.includeSections.teacherWiseMarkingStatus}
                onChange={() => onToggleSection("teacherWiseMarkingStatus")}
              />
              <SectionCheckbox
                label="Period-wise attendance"
                checked={false}
                onChange={() => {}}
                premium
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Report To</p>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={form.emailToSelf}
                onChange={() => onSetField("emailToSelf", !form.emailToSelf)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">My email (principal@hps.edu.in)</span>
            </label>
            <Input
              placeholder="Additional email (optional)"
              value={form.additionalEmail}
              onChange={(e) => onSetField("additionalEmail", e.target.value)}
            />
          </div>

          {/* Meta info */}
          <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
            <Info className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Estimated {form.format} size: {estimatedSize} • Includes{" "}
              {form.fromDate && form.toDate ? `${form.fromDate} to ${form.toDate}` : "selected date range"} data
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onGenerate}
            disabled={generating || success}
            className="px-5 py-2.5 flex items-center gap-2"
          >
            {success ? (
              <>
                <Check className="h-4 w-4" />
                Generated!
              </>
            ) : generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate & Download
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;