import type { GenerateReportFormData, ReportType } from "../types/reports.types";
import { REPORT_CARDS, CLASSES } from "../utils/Report config";

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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-700">{label}</label>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full bg-white"
  />
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
  onChange: () => void;
  premium?: boolean;
}) => (
  <label className="flex items-center gap-2.5 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={premium}
      className="w-4 h-4 accent-indigo-600 rounded"
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
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Report Type */}
          <Field label="Report Type">
            <select
              value={form.reportType}
              onChange={e => onSetField("reportType", e.target.value as ReportType)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white w-full"
            >
              {REPORT_CARDS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>

          {/* Date Range */}
          <Field label="Date Range">
            <div className="flex gap-2">
              {DATE_RANGE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => onSetField("dateRangeType", opt)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                    form.dateRangeType === opt
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Field>

          {/* From / To dates */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="From">
              <Input
                type="date"
                value={form.fromDate}
                onChange={e => onSetField("fromDate", e.target.value)}
              />
            </Field>
            <Field label="To">
              <Input
                type="date"
                value={form.toDate}
                onChange={e => onSetField("toDate", e.target.value)}
              />
            </Field>
          </div>

          {/* Class */}
          <Field label="Class">
            <select
              value={form.classFilter}
              onChange={e => onSetField("classFilter", e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white w-full"
            >
              {CLASSES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          {/* Format */}
          <Field label="Format">
            <div className="flex gap-2">
              {(["PDF", "CSV"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => onSetField("format", f)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold border transition-colors ${
                    form.format === f
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {f}
                </button>
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
              <input
                type="checkbox"
                checked={form.emailToSelf}
                onChange={() => onSetField("emailToSelf", !form.emailToSelf)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700">My email (principal@hps.edu.in)</span>
            </label>
            <Input
              placeholder="Additional email (optional)"
              value={form.additionalEmail}
              onChange={e => onSetField("additionalEmail", e.target.value)}
            />
          </div>

          {/* Meta info */}
          <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
            <svg width="14" height="14" className="text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-gray-500">
              Estimated {form.format} size: {estimatedSize} • Includes{" "}
              {form.fromDate && form.toDate ? `${form.fromDate} to ${form.toDate}` : "selected date range"} data
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onGenerate}
            disabled={generating || success}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {success ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Generated!
              </>
            ) : generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Generate & Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;