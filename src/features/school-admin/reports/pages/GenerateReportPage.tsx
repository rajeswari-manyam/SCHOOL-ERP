import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Download, Info } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { REPORT_CARDS, ReportIcons } from "../utils/report-config";
import { useGenerateReport } from "../hooks/useReports";
import { getAuthUser } from "../../../../store/authStore";
import { useUIStore } from "../../../../store/uiStore";
import { getAllClasses, getSectionsByClassId } from "../../../../services/class.api";
import type { ReportType } from "../types/reports.types";

type PeriodKey = "THIS_MONTH" | "LAST_MONTH" | "CUSTOM";

const PERIOD_PILLS: { value: PeriodKey; label: string }[] = [
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "CUSTOM",     label: "Custom Range" },
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

const GenerateReportPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedType = (searchParams.get("type") as ReportType | null) ?? undefined;
  const goBackToReports = () => navigate("/schooladmin/reports");

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
  const academicYearId = useUIStore(s => s.academicYearId) ?? "";
  const [generating, setGenerating] = useState(false);
  const [sectionId, setSectionId] = useState("");

  const { data: classesData } = useQuery({
    queryKey: ["report-modal-classes"],
    queryFn: () => getAllClasses(),
    staleTime: 5 * 60_000,
  });
  const classOptions = [
    { value: "", label: "All Classes" },
    ...(classesData?.data ?? []).map(c => ({ value: c.id, label: c.class_name })),
  ];

  const { data: sectionsData } = useQuery({
    queryKey: ["report-modal-sections", classId],
    queryFn: () => getSectionsByClassId(classId),
    enabled: !!classId,
    staleTime: 5 * 60_000,
  });
  const sectionOptions = [
    { value: "", label: "All Sections" },
    ...(sectionsData?.data ?? []).map(s => ({ value: s.id, label: s.sectionName })),
  ];

  const cardConfig = REPORT_CARDS.find((c) => c.type === reportType);
  const Icon = ReportIcons[reportType];

  const dateRange = useMemo(() => getDateRange(period), [period]);
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
        section_id: sectionId,
        academic_year_id: academicYearId,
        format: fmt,
        emailreport: myEmailChecked || !!additionalEmail,
        school_code: user?.schoolcode ?? "",
      });
      toast.success("Report generated successfully");
      goBackToReports();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBackToReports} className="hover:text-gray-600 transition-colors">
          Reports
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Generate {cardConfig?.title ?? "Report"}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cardConfig?.iconBg ?? "bg-indigo-50 text-indigo-600"}`}>
                <Icon size={16} />
              </div>
            )}
            <h1 className="text-base font-bold text-gray-900">
              Generate {cardConfig?.title ?? "Report"}
            </h1>
          </div>
          <button
            onClick={goBackToReports}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-5 space-y-5">

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
              <input
                type="date"
                value={customFrom || (dateRange ? format(dateRange.from, "yyyy-MM-dd") : "")}
                onChange={(e) => { setCustomFrom(e.target.value); setPeriod("CUSTOM"); }}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">To</label>
              <input
                type="date"
                value={customTo || (dateRange ? format(dateRange.to, "yyyy-MM-dd") : "")}
                onChange={(e) => { setCustomTo(e.target.value); setPeriod("CUSTOM"); }}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Class filter */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Class</label>
            <Select
              value={classId}
              onValueChange={(v) => { setClassId(v); setSectionId(""); }}
              options={classOptions}
              placeholder="All Classes"
            />
          </div>

          {/* Section filter */}
          {classId && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Section</label>
              <Select
                value={sectionId}
                onValueChange={setSectionId}
                options={sectionOptions}
                placeholder="All Sections"
              />
            </div>
          )}

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
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-gray-100 shrink-0">
          <Button type="button" onClick={goBackToReports} variant="outline" className="px-5">
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
  );
};

export default GenerateReportPage;
