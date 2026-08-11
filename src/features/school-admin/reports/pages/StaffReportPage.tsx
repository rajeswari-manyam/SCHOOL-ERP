import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Loader2, Briefcase, UserCheck, CalendarDays,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { reportsApi } from "@/services/reports.api";
import { REPORTS_KEYS } from "../hooks/useReports";
import { getAllStaff } from "@/services/staff.api";
import { useUIStore } from "../../../../store/uiStore";
import type { StaffReportResponse } from "../types/reports.types";

type PeriodKey = "THIS_MONTH" | "LAST_MONTH" | "CUSTOM";

const PERIOD_PILLS: { value: PeriodKey; label: string }[] = [
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "CUSTOM",     label: "Custom Range" },
];

const INCLUDE_OPTIONS = [
  { key: "staff_list"             as const, label: "Staff List"              },
  { key: "staff_attendance"       as const, label: "Staff Attendance"        },
  { key: "leave_utilization"      as const, label: "Leave Utilization"       },
  { key: "payroll_report"         as const, label: "Payroll Report"          },
  { key: "staff_attendance_by_id" as const, label: "Staff Attendance by ID"  },
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

// ── Small helpers ────────────────────────────────────────────────────────────

const StepLabel = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon size={14} className="text-indigo-500" />
    <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{text}</span>
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
    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed"
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

const AttPill = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const cls =
    s === "present" ? "bg-emerald-100 text-emerald-700" :
    s === "absent"  ? "bg-red-100 text-red-700"         :
    s === "leave"   ? "bg-amber-100 text-amber-700"     :
                      "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${cls}`}>
      {status}
    </span>
  );
};

const titleCase = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const cellValue = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};

/** Renders any array of plain objects as a table, deriving columns from the
 * first row's keys — the exact shape of these sections isn't documented, so
 * this avoids guessing field names that don't exist on the real payload. */
const DynamicTable = ({ rows }: { rows: Record<string, unknown>[] }) => {
  if (rows.length === 0) return null;
  const columns = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((c) => <Th key={c}>{titleCase(c)}</Th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c} className="px-4 py-3 text-slate-700 whitespace-nowrap">{cellValue(row[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────

const StaffReportPage = () => {
  const navigate = useNavigate();
  const goBackToReports = () => navigate("/schooladmin/reports");

  const qc = useQueryClient();
  const academicYearId   = useUIStore((s) => s.academicYearId) ?? "";
  const academicYearName = useUIStore((s) => s.academicYearName) ?? "";

  const [staffId, setStaffId] = useState("");

  const [period,     setPeriod]     = useState<PeriodKey>("LAST_MONTH");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");

  const [includeSections, setIncludeSections] = useState({
    staff_list:             true,
    staff_attendance:       true,
    leave_utilization:      true,
    payroll_report:         true,
    staff_attendance_by_id: false,
  });

  const [generating, setGenerating] = useState(false);
  const [report,     setReport]     = useState<StaffReportResponse | null>(null);

  const [expanded, setExpanded] = useState({
    staffList:        true,
    staffAttendance:  true,
    leaveUtilization: true,
    payrollReport:    true,
    staffById:        true,
  });

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: staffData, isFetching: staffLoading } = useQuery({
    queryKey: ["staffr-all-staff"],
    queryFn:  () => getAllStaff(),
    staleTime: 5 * 60_000,
  });

  const staffList = staffData?.data ?? [];

  const dateRange = getDateRange(period);

  const toggleInclude = (key: keyof typeof includeSections) =>
    setIncludeSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleExpand = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Generate ───────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    const fromDate = period === "CUSTOM" ? customFrom : dateRange ? format(dateRange.from, "yyyy-MM-dd") : "";
    const toDate   = period === "CUSTOM" ? customTo   : dateRange ? format(dateRange.to,   "yyyy-MM-dd") : "";
    if (!fromDate || !toDate) { toast.error("Please set a date range"); return; }

    if (includeSections.staff_attendance_by_id && !staffId) {
      toast.error("Please select a staff member for Staff Attendance by ID");
      return;
    }

    setGenerating(true);
    setReport(null);

    try {
      const payload: any = {
        academic_year_id: academicYearId,
        report_range:     period === "CUSTOM" ? "custom" : "monthly",
        from_date:        fromDate,
        to_date:          toDate,
        include_sections: includeSections,
      };
      if (staffId) payload.staff_id = staffId;

      const res = await reportsApi.staffReport(payload);
      if (res.status) {
        setReport(res);
        toast.success("Staff report generated");
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
    setStaffId("");
    setPeriod("LAST_MONTH"); setCustomFrom(""); setCustomTo("");
    setIncludeSections({
      staff_list: true, staff_attendance: true, leave_utilization: true,
      payroll_report: true, staff_attendance_by_id: false,
    });
  };

  const d = report?.data;
  const byId = d?.staff_attendance_by_id;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBackToReports} className="hover:text-gray-600 transition-colors">
          Reports
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Staff Report</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                {report ? "Staff Report" : "Generate Staff Report"}
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

              {/* Step 1: Staff */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <StepLabel icon={UserCheck} text="Step 1 — Select Staff (for Attendance by ID)" />
                <div className="relative">
                  {staffLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                      <Loader2 size={14} className="animate-spin text-indigo-500" />
                    </div>
                  )}
                  <Select
                    value={staffId}
                    placeholder="All Staff (optional)"
                    disabled={staffLoading}
                    onChange={setStaffId}
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                        {s.emp_number ? ` (${s.emp_number})` : ""}
                        {s.role ? ` — ${s.role}` : ""}
                      </option>
                    ))}
                  </Select>
                </div>
                <p className="text-[11px] text-gray-400">
                  Required only when "Staff Attendance by ID" is checked below.
                </p>
              </div>

              {/* Step 2: Date Range */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <StepLabel icon={CalendarDays} text="Step 2 — Date Range" />
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">From Date</label>
                    <input
                      type="date"
                      value={customFrom || (dateRange ? format(dateRange.from, "yyyy-MM-dd") : "")}
                      onChange={(e) => { setCustomFrom(e.target.value); setPeriod("CUSTOM"); }}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">To Date</label>
                    <input
                      type="date"
                      value={customTo || (dateRange ? format(dateRange.to, "yyyy-MM-dd") : "")}
                      onChange={(e) => { setCustomTo(e.target.value); setPeriod("CUSTOM"); }}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Include Sections */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <StepLabel icon={Briefcase} text="Step 3 — Report Sections to Include" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INCLUDE_OPTIONS.map((sec) => (
                    <label
                      key={sec.key}
                      className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={includeSections[sec.key]}
                        onChange={() => toggleInclude(sec.key)}
                        className="w-4 h-4 rounded accent-indigo-600 shrink-0"
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
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generating
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Generating…</>
                    : <><Briefcase className="w-4 h-4" />Generate Report</>}
                </button>
              </div>
            </div>
          )}

          {/* ── RESULTS ───────────────────────────────────────────────── */}
          {report && d && (
            <div className="space-y-5">

              {/* Report period banner */}
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                <span className="text-xs font-semibold text-indigo-600">
                  Period: {report.report_period.from} – {report.report_period.to}
                </span>
                <span className="text-xs font-semibold text-indigo-400">
                  {report.message}
                </span>
              </div>

              {/* ── Staff List ────────────────────────────────────────── */}
              {d.staff_list && d.staff_list.length > 0 && (
                <Collapsible
                  title={`Staff List (${d.staff_list.length})`}
                  expanded={expanded.staffList}
                  onToggle={() => toggleExpand("staffList")}
                >
                  <DynamicTable rows={d.staff_list} />
                </Collapsible>
              )}

              {/* ── Staff Attendance ──────────────────────────────────── */}
              {d.staff_attendance && d.staff_attendance.length > 0 && (
                <Collapsible
                  title="Staff Attendance"
                  expanded={expanded.staffAttendance}
                  onToggle={() => toggleExpand("staffAttendance")}
                >
                  <DynamicTable rows={d.staff_attendance} />
                </Collapsible>
              )}

              {/* ── Leave Utilization ─────────────────────────────────── */}
              {d.leave_utilization && d.leave_utilization.length > 0 && (
                <Collapsible
                  title="Leave Utilization"
                  expanded={expanded.leaveUtilization}
                  onToggle={() => toggleExpand("leaveUtilization")}
                >
                  <DynamicTable rows={d.leave_utilization} />
                </Collapsible>
              )}

              {/* ── Payroll Report ────────────────────────────────────── */}
              {d.payroll_report && d.payroll_report.length > 0 && (
                <Collapsible
                  title="Payroll Report"
                  expanded={expanded.payrollReport}
                  onToggle={() => toggleExpand("payrollReport")}
                >
                  <DynamicTable rows={d.payroll_report} />
                </Collapsible>
              )}

              {/* ── Staff Attendance by ID ────────────────────────────── */}
              {byId && (
                <Collapsible
                  title="Staff Attendance by ID"
                  expanded={expanded.staffById}
                  onToggle={() => toggleExpand("staffById")}
                >
                  <div className="p-5 space-y-4">
                    {/* Staff info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      {[
                        ["Name",           byId.staff_name],
                        ["Employee ID",    byId.employee_id],
                        ["Department",     byId.department],
                        ["Designation",    byId.designation ?? "—"],
                        ["Present",        byId.total_present],
                        ["Absent",         byId.total_absent],
                        ["Leave",          byId.total_leave],
                        ["Attendance %",   `${parseFloat(byId.attendance_percentage).toFixed(0)}%`],
                      ].map(([label, val]) => (
                        <div key={String(label)}>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
                          <p className="font-bold text-gray-800">{val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Daily attendance details */}
                    {byId.attendance_details?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Day-by-day</p>
                        <div className="flex flex-wrap gap-2">
                          {byId.attendance_details.map((det: any, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <span className="text-[10px] text-gray-400">
                                {format(new Date(det.date), "dd MMM")}
                              </span>
                              <AttPill status={det.status} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Collapsible>
              )}

              {/* Generate another / Close */}
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
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
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

export default StaffReportPage;
