import { useState, useMemo } from "react";
import { toast } from "sonner";
import { X, Calendar, Loader2, Download, Info } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { REPORT_CARDS, ReportIcons } from "../utils/report-config";
import { useGenerateReport } from "../hooks/useReports";
import { getAuthUser } from "../../../../store/authStore";
import type { ReportType } from "../types/reports.types";

interface Props {
  open: boolean;
  preselectedType?: ReportType;
  onClose: () => void;
}

type PeriodKey = "THIS_MONTH" | "LAST_MONTH" | "CUSTOM";

const PERIOD_PILLS: { value: PeriodKey; label: string }[] = [
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "CUSTOM",     label: "Custom Range" },
];

const CLASS_OPTIONS = [
  { value: "", label: "All Classes" },
  ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Class ${i + 1}` })),
];

const REPORT_TYPE_OPTIONS = REPORT_CARDS.map((c) => ({ value: c.type, label: c.title }));

const DEFAULT_SECTIONS = new Set(["class_summary", "daily_grid", "chronic_absentees", "teacher_marking"]);

function getDateRange(period: PeriodKey) {
  const now = new Date();
  if (period === "THIS_MONTH") return { from: startOfMonth(now), to: endOfMonth(now) };
  if (period === "LAST_MONTH") {
    const last = subMonths(now, 1);
    return { from: startOfMonth(last), to: endOfMonth(last) };
  }
  return null;
}

const GenerateReportModal = ({ open, preselectedType, onClose }: Props) => {
  const [reportType, setReportType] = useState<ReportType>(preselectedType ?? "ATTENDANCE");
  const [period, setPeriod] = useState<PeriodKey>("LAST_MONTH");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [classId, setClassId] = useState("");
  const [fmt, setFmt] = useState<"PDF" | "CSV">("PDF");
  const [checkedSections, setCheckedSections] = useState<Set<string>>(new Set(DEFAULT_SECTIONS));
  const [myEmailChecked, setMyEmailChecked] = useState(true);
  const [additionalEmail, setAdditionalEmail] = useState("");
  const generateMutation = useGenerateReport();
  const [generating, setGenerating] = useState(false);

  const cardConfig = REPORT_CARDS.find((c) => c.type === reportType);
  const Icon = ReportIcons[reportType];

  const dateRange = useMemo(() => getDateRange(period), [period]);
  const displayFrom = period === "CUSTOM" && customFrom
    ? format(new Date(customFrom), "dd MMM yyyy")
    : dateRange ? format(dateRange.from, "dd MMM yyyy") : "—";
  const displayTo = period === "CUSTOM" && customTo
    ? format(new Date(customTo), "dd MMM yyyy")
    : dateRange ? format(dateRange.to, "dd MMM yyyy") : "—";
  const periodLabel = dateRange ? format(dateRange.from, "MMMM yyyy") : "selected period";

  const toggleSection = (key: string) => {
    setCheckedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const user = getAuthUser();
      const fromDate = period === "CUSTOM" ? customFrom : dateRange ? format(dateRange.from, "yyyy-MM-dd") : "";
      const toDate = period === "CUSTOM" ? customTo : dateRange ? format(dateRange.to, "yyyy-MM-dd") : "";

      await generateMutation.mutateAsync({
        reportype: cardConfig?.title ?? "Attendance Report",
        from: fromDate,
        to: toDate,
        class_id: classId,
        section_id: "",
        academic_year_id: "",
        format: fmt,
        emailreport: myEmailChecked || !!additionalEmail,
        school_code: user?.schoolcode ?? "",
      });
      toast.success("Report generated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <div
          className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92dvh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile drag handle */}
          <div className="flex justify-center pt-2.5 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2.5">
              {Icon && (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cardConfig?.iconBg ?? "bg-indigo-50 text-indigo-600"}`}>
                  <Icon size={16} />
                </div>
              )}
              <h2 className="text-base font-bold text-gray-900">
                Generate {cardConfig?.title ?? "Report"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

            {/* Report Type */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Report Type</label>
              <Select
                value={reportType}
                onValueChange={(v) => setReportType(v as ReportType)}
                options={REPORT_TYPE_OPTIONS}
                placeholder="Select report type"
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Date Range</label>
              <div className="flex flex-wrap gap-2">
                {PERIOD_PILLS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPeriod(p.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      period === p.value
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* From / To */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">From</label>
                {period === "CUSTOM" ? (
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  />
                ) : (
                  <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-gray-600">
                    <span className="flex-1 truncate">{displayFrom}</span>
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">To</label>
                {period === "CUSTOM" ? (
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  />
                ) : (
                  <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-gray-600">
                    <span className="flex-1 truncate">{displayTo}</span>
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                )}
              </div>
            </div>

            {/* Class filter */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Class</label>
              <Select
                value={classId}
                onValueChange={setClassId}
                options={CLASS_OPTIONS}
                placeholder="All Classes"
              />
            </div>

            {/* Format */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Format</label>
              <div className="flex gap-2">
                {(["PDF", "CSV"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFmt(f)}
                    className={`px-7 py-2 rounded-xl text-sm font-bold transition-all ${
                      fmt === f
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Include Sections */}
            {cardConfig?.sections && cardConfig.sections.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-[10px] font-extrabold tracking-widest uppercase text-indigo-600">
                  Include Sections
                </label>
                <div className="space-y-2.5">
                  {cardConfig.sections.map((sec) => (
                    <label
                      key={sec.key}
                      className={`flex items-center gap-3 ${
                        sec.premium ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={sec.premium ? false : checkedSections.has(sec.key)}
                        disabled={sec.premium}
                        onChange={() => !sec.premium && toggleSection(sec.key)}
                        className="w-4 h-4 rounded accent-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{sec.label}</span>
                      {sec.premium && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 tracking-wide">
                          PREMIUM
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Email Report To */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700">Email Report To</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={myEmailChecked}
                  onChange={(e) => setMyEmailChecked(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                <span className="text-sm text-gray-700">My email (principal@hps.edu.in)</span>
              </label>
              <Input
                placeholder="Additional email (optional)"
                value={additionalEmail}
                onChange={(e) => setAdditionalEmail(e.target.value)}
                className="text-sm bg-gray-50"
              />
            </div>

            {/* Estimated size info */}
            <div className="flex items-start gap-2.5 rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-3 text-xs text-gray-500">
              <Info className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
              <span>
                Estimated {fmt} size: <strong className="text-gray-700">~1.8 MB</strong>
                {" • "}Includes {periodLabel} data for all students
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 shrink-0">
            <Button type="button" onClick={onClose} variant="outline" className="px-5">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-6 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {generating
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Download className="w-4 h-4" />
              }
              {generating ? "Generating..." : "Generate & Download"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateReportModal;