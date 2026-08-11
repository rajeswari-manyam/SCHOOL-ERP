import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Loader2, CreditCard, BookOpen, Users,
  CalendarDays, UserCheck, ChevronDown, ChevronUp,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { reportsApi } from "@/services/reports.api";
import { REPORTS_KEYS } from "../hooks/useReports";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import { getStudentsByClassSection } from "@/services/fee.api";
import { useUIStore } from "../../../../store/uiStore";
import type {
  FeeCollectionReportResponse,
  FeeCollectionReportDetail,
} from "../types/reports.types";

type PeriodKey = "THIS_MONTH" | "LAST_MONTH" | "CUSTOM";

const PERIOD_PILLS: { value: PeriodKey; label: string; apiValue: string }[] = [
  { value: "THIS_MONTH", label: "This Month", apiValue: "this_month" },
  { value: "LAST_MONTH", label: "Last Month", apiValue: "last_month" },
  { value: "CUSTOM",     label: "Custom Range", apiValue: "custom"   },
];

const INCLUDE_OPTIONS = [
  { key: "monthly_collection_summary" as const, label: "Monthly Collection Summary" },
  { key: "student_overdue_list"       as const, label: "Student Overdue List"       },
  { key: "fee_breakdown"              as const, label: "Fee Breakdown"              },
  { key: "partial_payments"           as const, label: "Partial Payments"           },
  { key: "late_fee_report"            as const, label: "Late Fee Report"            },
] as const;

function getDateRange(period: PeriodKey) {
  const now = new Date();
  if (period === "THIS_MONTH") return { from: startOfMonth(now), to: endOfMonth(now) };
  if (period === "LAST_MONTH") {
    const last = subMonths(now, 1);
    return { from: startOfMonth(last), to: endOfMonth(last) };
  }
  return null;
}

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

// ── Helpers ──────────────────────────────────────────────────────────────────

const StepLabel = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon size={14} className="text-emerald-600" />
    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">{text}</span>
  </div>
);

const Select = ({
  value, onChange, disabled, children, placeholder,
}: {
  value: string; onChange: (v: string) => void; disabled?: boolean;
  children: React.ReactNode; placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {children}
  </select>
);

const Collapsible = ({
  title, expanded, onToggle, children,
}: {
  title: string; expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
    >
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      {expanded
        ? <ChevronUp className="w-4 h-4 text-slate-400" />
        : <ChevronDown className="w-4 h-4 text-slate-400" />}
    </button>
    {expanded && children}
  </div>
);

const Th = ({ children, center, right }: { children: React.ReactNode; center?: boolean; right?: boolean }) => (
  <th className={`px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide ${center ? "text-center" : right ? "text-right" : "text-left"}`}>
    {children}
  </th>
);

const StatusPill = ({ status }: { status: string }) => {
  const s = status.toUpperCase();
  const cls =
    s === "PAID"    ? "bg-emerald-100 text-emerald-700" :
    s === "PARTIAL" ? "bg-amber-100 text-amber-700"     :
    s === "OVERDUE" ? "bg-red-100 text-red-700"         :
                      "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      {status}
    </span>
  );
};

// ────────────────────────────────────────────────────────────────────────────

const FeeCollectionReportPage = () => {
  const navigate = useNavigate();
  const goBackToReports = () => navigate("/schooladmin/reports");

  const qc = useQueryClient();
  const academicYearId   = useUIStore((s) => s.academicYearId) ?? "";
  const academicYearName = useUIStore((s) => s.academicYearName) ?? "";

  const [classId,   setClassId]   = useState("");
  const [sectionId, setSectionId] = useState("");
  const [studentId, setStudentId] = useState("");

  const [period,     setPeriod]     = useState<PeriodKey>("THIS_MONTH");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");

  const [includeSections, setIncludeSections] = useState({
    monthly_collection_summary: true,
    student_overdue_list:       true,
    fee_breakdown:              true,
    partial_payments:           true,
    late_fee_report:            true,
  });

  const [generating, setGenerating] = useState(false);
  const [report, setReport]         = useState<FeeCollectionReportResponse | null>(null);

  const [expanded, setExpanded] = useState({
    summary:  true,
    details:  true,
  });

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: classesData } = useQuery({
    queryKey: ["fee-rep-classes"],
    queryFn:  () => getAllClasses(),
    staleTime: 5 * 60_000,
  });

  const { data: sectionsData } = useQuery({
    queryKey: ["fee-rep-sections", classId],
    queryFn:  () => getSectionsByClassId(classId),
    enabled:  !!classId,
    staleTime: 5 * 60_000,
  });

  const { data: studentsData, isFetching: studentsLoading } = useQuery({
    queryKey: ["fee-rep-students", classId, sectionId],
    queryFn:  () => getStudentsByClassSection(classId, sectionId),
    enabled:  !!classId && !!sectionId,
    staleTime: 5 * 60_000,
  });

  const classOptions   = classesData?.data   ?? [];
  const sectionOptions = sectionsData?.data  ?? [];
  const studentList    = studentsData?.data  ?? [];

  const dateRange = getDateRange(period);

  const toggleInclude = (key: keyof typeof includeSections) =>
    setIncludeSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleExpand = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Generate ───────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!classId)   { toast.error("Please select a class");   return; }
    if (!sectionId) { toast.error("Please select a section"); return; }
    if (!studentId) { toast.error("Please select a student"); return; }

    const fromDate = period === "CUSTOM" ? customFrom : dateRange ? format(dateRange.from, "yyyy-MM-dd") : "";
    const toDate   = period === "CUSTOM" ? customTo   : dateRange ? format(dateRange.to,   "yyyy-MM-dd") : "";
    if (!fromDate || !toDate) { toast.error("Please set a date range"); return; }

    setGenerating(true);
    setReport(null);
    try {
      const apiPeriod = PERIOD_PILLS.find((p) => p.value === period)?.apiValue ?? "custom";
      const res = await reportsApi.monthlyFeeCollectionReport({
        academic_year_id: academicYearId,
        class_id:         classId,
        section_id:       sectionId,
        student_id:       studentId,
        report_range:     apiPeriod,
        from_date:        fromDate,
        to_date:          toDate,
        include_sections: includeSections,
      });
      if (res.status) {
        setReport(res);
        toast.success("Fee collection report generated");
        qc.invalidateQueries({ queryKey: REPORTS_KEYS.all, refetchType: "all" });
      } else {
        toast.error("Failed to generate report");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setReport(null);
    setClassId(""); setSectionId(""); setStudentId("");
    setPeriod("THIS_MONTH"); setCustomFrom(""); setCustomTo("");
    setIncludeSections({
      monthly_collection_summary: true, student_overdue_list: true,
      fee_breakdown: true, partial_payments: true, late_fee_report: true,
    });
  };

  const d = report?.data;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBackToReports} className="hover:text-gray-600 transition-colors">
          Reports
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Fee Collection Report</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard size={16} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                {report ? "Fee Collection Report" : "Generate Fee Collection Report"}
              </h1>
              {academicYearName && (
                <p className="text-[11px] text-gray-400">Academic Year: {academicYearName}</p>
              )}
            </div>
          </div>
          <button
            onClick={goBackToReports}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5 space-y-5">

          {/* ── FORM ──────────────────────────────────────────────────── */}
          {!report && (
            <div className="space-y-5">

              {/* Step 1: Class + Section */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                <StepLabel icon={BookOpen} text="Step 1 — Select Class & Section" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={classId}
                      placeholder="Select Class"
                      onChange={(v) => { setClassId(v); setSectionId(""); setStudentId(""); }}
                    >
                      {classOptions.map((c) => (
                        <option key={c.id} value={c.id}>{c.class_name}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={sectionId}
                      placeholder={classId ? "Select Section" : "Select class first"}
                      disabled={!classId}
                      onChange={(v) => { setSectionId(v); setStudentId(""); }}
                    >
                      {sectionOptions.map((s) => (
                        <option key={s.id} value={s.id}>{s.sectionName}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              {/* Step 2: Student */}
              <div className={`bg-gray-50 rounded-2xl p-4 space-y-3 transition-opacity duration-200 ${classId && sectionId ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                <StepLabel icon={Users} text="Step 2 — Select Student" />
                <div className="relative">
                  {studentsLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                      <Loader2 size={14} className="animate-spin text-emerald-500" />
                    </div>
                  )}
                  <Select
                    value={studentId}
                    placeholder={classId && sectionId ? "Select Student" : "Select class & section first"}
                    disabled={!classId || !sectionId || studentsLoading}
                    onChange={setStudentId}
                  >
                    {studentList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.first_name} {s.last_name}
                        {s.roll_number ? ` (Roll: ${s.roll_number})` : ""}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Step 3: Date Range */}
              <div className={`bg-gray-50 rounded-2xl p-4 space-y-3 transition-opacity duration-200 ${classId && sectionId ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                <StepLabel icon={CalendarDays} text="Step 3 — Date Range" />
                <div className="flex flex-wrap gap-2">
                  {PERIOD_PILLS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPeriod(p.value)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        period === p.value
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">From Date</label>
                    <input
                      type="date"
                      value={customFrom || (dateRange ? format(dateRange.from, "yyyy-MM-dd") : "")}
                      onChange={(e) => { setCustomFrom(e.target.value); setPeriod("CUSTOM"); }}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">To Date</label>
                    <input
                      type="date"
                      value={customTo || (dateRange ? format(dateRange.to, "yyyy-MM-dd") : "")}
                      onChange={(e) => { setCustomTo(e.target.value); setPeriod("CUSTOM"); }}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Include Sections */}
              <div className={`bg-gray-50 rounded-2xl p-4 space-y-3 transition-opacity duration-200 ${classId && sectionId ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                <StepLabel icon={UserCheck} text="Step 4 — Report Sections to Include" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INCLUDE_OPTIONS.map((sec) => (
                    <label
                      key={sec.key}
                      className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={includeSections[sec.key]}
                        onChange={() => toggleInclude(sec.key)}
                        className="w-4 h-4 rounded accent-emerald-600 shrink-0"
                      />
                      <span className="text-sm text-gray-700 font-medium">{sec.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={goBackToReports}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating || !classId || !sectionId || !studentId}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generating
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Generating…</>
                    : <><CreditCard className="w-4 h-4" />Generate Report</>}
                </button>
              </div>
            </div>
          )}

          {/* ── RESULTS ───────────────────────────────────────────────── */}
          {report && d && (
            <div className="space-y-5">

              {/* Student + period banner */}
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                <span className="text-sm font-bold text-emerald-700">{d.student.name}</span>
                <span className="text-xs font-semibold text-emerald-400">
                  {customFrom || format(getDateRange(period)?.from ?? new Date(), "yyyy-MM-dd")} –{" "}
                  {customTo   || format(getDateRange(period)?.to   ?? new Date(), "yyyy-MM-dd")}
                </span>
              </div>

              {/* Summary stat cards */}
              <Collapsible
                title="Collection Summary"
                expanded={expanded.summary}
                onToggle={() => toggleExpand("summary")}
              >
                <div className="p-4 space-y-3">
                  {/* Status badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Overall Status</span>
                    <StatusPill status={d.summary.overallStatus} />
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Total Original",  value: inr(d.summary.totalOriginal),  bg: "bg-gray-50",    text: "text-gray-700"   },
                      { label: "Total Discount",  value: inr(d.summary.totalDiscount),  bg: "bg-blue-50",   text: "text-blue-700"   },
                      { label: "Net Payable",     value: inr(d.summary.totalFinal),     bg: "bg-indigo-50",  text: "text-indigo-700" },
                      { label: "Amount Paid",     value: inr(d.summary.totalPaid),      bg: "bg-emerald-50", text: "text-emerald-700"},
                      { label: "Amount Due",      value: inr(d.summary.totalDue),       bg: "bg-red-50",     text: "text-red-700"    },
                    ].map(({ label, value, bg, text }) => (
                      <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                        <p className={`text-lg font-extrabold ${text} tabular-nums`}>{value}</p>
                        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Collapsible>

              {/* Fee Breakdown */}
              {d.details && d.details.length > 0 && (
                <Collapsible
                  title={`Fee Breakdown (${d.details.length} heads)`}
                  expanded={expanded.details}
                  onToggle={() => toggleExpand("details")}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <Th>Fee Head</Th>
                          <Th right>Original</Th>
                          <Th right>Discount</Th>
                          <Th right>Net Payable</Th>
                          <Th right>Paid</Th>
                          <Th right>Due</Th>
                          <Th center>Status</Th>
                          <Th>Due Date</Th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {d.details.map((row: FeeCollectionReportDetail) => (
                          <tr key={row.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-800">
                              {row.feeHeadName}
                              {row.fee_type === "transport" && (
                                <span className="ml-2 text-[10px] font-semibold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                                  Transport
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{inr(row.originalAmount)}</td>
                            <td className="px-4 py-3 text-right text-blue-600 tabular-nums font-medium">
                              {row.discountAmount > 0 ? `–${inr(row.discountAmount)}` : "—"}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-700 font-semibold tabular-nums">{inr(row.finalAmount)}</td>
                            <td className="px-4 py-3 text-right text-emerald-600 font-semibold tabular-nums">{inr(row.paidAmount)}</td>
                            <td className="px-4 py-3 text-right text-red-600 font-semibold tabular-nums">{inr(row.dueAmount)}</td>
                            <td className="px-4 py-3 text-center">
                              <StatusPill status={row.status} />
                            </td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                              {row.dueDate ? format(new Date(row.dueDate), "dd MMM yyyy") : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Totals row */}
                      <tfoot>
                        <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold">
                          <td className="px-4 py-3 text-slate-700">Total</td>
                          <td className="px-4 py-3 text-right text-slate-700 tabular-nums">{inr(d.summary.totalOriginal)}</td>
                          <td className="px-4 py-3 text-right text-blue-600 tabular-nums">
                            {d.summary.totalDiscount > 0 ? `–${inr(d.summary.totalDiscount)}` : "—"}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700 tabular-nums">{inr(d.summary.totalFinal)}</td>
                          <td className="px-4 py-3 text-right text-emerald-600 tabular-nums">{inr(d.summary.totalPaid)}</td>
                          <td className="px-4 py-3 text-right text-red-600 tabular-nums">{inr(d.summary.totalDue)}</td>
                          <td colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </Collapsible>
              )}

              {/* Generate another */}
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Generate Another
                </button>
                <button
                  type="button"
                  onClick={goBackToReports}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  Close & View in Table
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeCollectionReportPage;
