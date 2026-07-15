import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  X, Loader2, FileBarChart, ChevronDown, ChevronUp,
  Users, BookOpen, UserCheck, CalendarDays,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { reportsApi } from "@/services/reports.api";
import { REPORTS_KEYS } from "../hooks/useReports";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import { getStudentsByClassSection } from "@/services/fee.api";
import { useUIStore } from "../../../../store/uiStore";
import type {
  AttendanceReportResponse,
  AttendanceReportDaily,
  AttendanceReportStudentDetail,
  AttendanceReportChronicAbsentee,
  AttendanceReportTeacherStatus,
} from "../types/reports.types";

interface Props {
  open: boolean;
  onClose: () => void;
}

type PeriodKey = "THIS_MONTH" | "LAST_MONTH" | "CUSTOM";

const PERIOD_PILLS: { value: PeriodKey; label: string }[] = [
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "CUSTOM",     label: "Custom Range" },
];

function getDateRange(period: PeriodKey) {
  const now = new Date();
  if (period === "THIS_MONTH") return { from: startOfMonth(now), to: endOfMonth(now) };
  if (period === "LAST_MONTH") {
    const last = subMonths(now, 1);
    return { from: startOfMonth(last), to: endOfMonth(last) };
  }
  return null;
}

const pct = (v: number) => `${Math.round(v)}%`;

const INCLUDE_OPTIONS = [
  { key: "class_summary"      as const, label: "Class-wise summary"          },
  { key: "daily_attendance"   as const, label: "Daily attendance"            },
  { key: "chronic_absentees"  as const, label: "Chronic absentees list"      },
  { key: "teacher_wise_status"as const, label: "Teacher-wise marking status" },
] as const;

// ── Small step label ────────────────────────────────────────────────────────
const StepLabel = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon size={14} className="text-blue-500" />
    <span className="text-xs font-bold uppercase tracking-widest text-blue-500">{text}</span>
  </div>
);

// ── Select wrapper ──────────────────────────────────────────────────────────
const Select = ({
  value, onChange, disabled, children, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {children}
  </select>
);

// ────────────────────────────────────────────────────────────────────────────

const AttendanceReportForm = ({ open, onClose }: Props) => {
  const qc = useQueryClient();
  const academicYearId   = useUIStore((s) => s.academicYearId) ?? "";
  const academicYearName = useUIStore((s) => s.academicYearName) ?? "";

  const [classId,    setClassId]    = useState("");
  const [sectionId,  setSectionId]  = useState("");
  const [studentId,  setStudentId]  = useState("");

  const [period,     setPeriod]     = useState<PeriodKey>("LAST_MONTH");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");

  const [includeSections, setIncludeSections] = useState({
    class_summary:       true,
    daily_attendance:    true,
    chronic_absentees:   true,
    teacher_wise_status: true,
  });

  const [generating, setGenerating] = useState(false);
  const [report,     setReport]     = useState<AttendanceReportResponse | null>(null);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    classSummary:    true,
    dailyAttendance: true,
    studentDetails:  true,
    chronicAbsentees:true,
    teacherStatus:   true,
  });

  // ── Classes ────────────────────────────────────────────────────────────────
  const { data: classesData } = useQuery({
    queryKey: ["att-report-classes"],
    queryFn: () => getAllClasses(),
    staleTime: 5 * 60_000,
  });

  // ── Sections (depends on classId) ─────────────────────────────────────────
  const { data: sectionsData } = useQuery({
    queryKey: ["att-report-sections", classId],
    queryFn:  () => getSectionsByClassId(classId),
    enabled:  !!classId,
    staleTime: 5 * 60_000,
  });

  // ── Students (depends on classId + sectionId) ──────────────────────────────
  const { data: studentsData, isFetching: studentsLoading } = useQuery({
    queryKey: ["att-report-students", classId, sectionId],
    queryFn:  () => getStudentsByClassSection(classId, sectionId),
    enabled:  !!classId && !!sectionId,
    staleTime: 5 * 60_000,
  });

  const classOptions   = classesData?.data ?? [];
  const sectionOptions = sectionsData?.data ?? [];
  const studentList    = studentsData?.data ?? [];

  const dateRange = getDateRange(period);

  const toggleSection = (key: keyof typeof includeSections) =>
    setIncludeSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleExpand = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Generate ───────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!classId)   { toast.error("Please select a class");   return; }
    if (!sectionId) { toast.error("Please select a section"); return; }

    const fromDate = period === "CUSTOM" ? customFrom : dateRange ? format(dateRange.from, "yyyy-MM-dd") : "";
    const toDate   = period === "CUSTOM" ? customTo   : dateRange ? format(dateRange.to,   "yyyy-MM-dd") : "";

    if (!fromDate || !toDate) { toast.error("Please set a date range"); return; }

    setGenerating(true);
    setReport(null);

    try {
      const payload: any = {
        academic_year_id: academicYearId,
        class_id:         classId,
        section_id:       sectionId,
        report_range:     period === "CUSTOM" ? "custom" : "monthly",
        from_date:        fromDate,
        to_date:          toDate,
        include_sections: includeSections,
      };
      if (studentId) payload.student_id = studentId;

      const res = await reportsApi.generateAttendanceReport(payload);
      if (res.status) {
        setReport(res);
        toast.success("Attendance report generated");
        qc.invalidateQueries({ queryKey: REPORTS_KEYS.all });
      } else {
        toast.error(res.message || "Failed to generate report");
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
    setPeriod("LAST_MONTH"); setCustomFrom(""); setCustomTo("");
    setIncludeSections({ class_summary: true, daily_attendance: true, chronic_absentees: true, teacher_wise_status: true });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <div
          className="bg-white w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95dvh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="flex justify-center pt-2.5 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileBarChart size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {report ? "Attendance Report" : "Generate Attendance Report"}
                </h2>
                {academicYearName && (
                  <p className="text-[11px] text-gray-400">Academic Year: {academicYearName}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

            {/* ── FORM ──────────────────────────────────────────────────── */}
            {!report && (
              <div className="space-y-5">

                {/* Step 1: Class + Section */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                  <StepLabel icon={BookOpen} text="Step 1 — Select Class & Section" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Class */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Class <span className="text-red-500">*</span></label>
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

                    {/* Section */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Section <span className="text-red-500">*</span></label>
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

                {/* Step 2: Student (loads after class + section) */}
                <div className={`bg-gray-50 rounded-2xl p-4 space-y-3 transition-opacity duration-200 ${classId && sectionId ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                  <StepLabel icon={Users} text="Step 2 — Select Student (Optional)" />
                  <div className="relative">
                    {studentsLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                        <Loader2 size={14} className="animate-spin text-blue-500" />
                      </div>
                    )}
                    <Select
                      value={studentId}
                      placeholder="All Students"
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
                  {classId && sectionId && studentList.length === 0 && !studentsLoading && (
                    <p className="text-xs text-gray-400">No students found for this class & section.</p>
                  )}
                </div>

                {/* Step 3: Date Range */}
                <div className={`bg-gray-50 rounded-2xl p-4 space-y-3 transition-opacity duration-200 ${classId && sectionId ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                  <StepLabel icon={CalendarDays} text="Step 3 — Date Range" />

                  {/* Period pills */}
                  <div className="flex flex-wrap gap-2">
                    {PERIOD_PILLS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPeriod(p.value)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          period === p.value
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* From / To */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600">From Date</label>
                      <input
                        type="date"
                        value={customFrom || (dateRange ? format(dateRange.from, "yyyy-MM-dd") : "")}
                        onChange={(e) => { setCustomFrom(e.target.value); setPeriod("CUSTOM"); }}
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600">To Date</label>
                      <input
                        type="date"
                        value={customTo || (dateRange ? format(dateRange.to, "yyyy-MM-dd") : "")}
                        onChange={(e) => { setCustomTo(e.target.value); setPeriod("CUSTOM"); }}
                        className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
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
                        className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-blue-200 hover:bg-blue-50/40 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={includeSections[sec.key]}
                          onChange={() => toggleSection(sec.key)}
                          className="w-4 h-4 rounded accent-blue-600 shrink-0"
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
                    onClick={handleClose}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={generating || !classId || !sectionId}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {generating
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Generating…</>
                      : <><FileBarChart className="w-4 h-4" />Generate Report</>}
                  </button>
                </div>
              </div>
            )}

            {/* ── RESULTS ───────────────────────────────────────────────── */}
            {report && (
              <div className="space-y-5">

                {/* Dashboard stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Total Students",    value: report.dashboard_stats.total_students,    bg: "bg-blue-50",   text: "text-blue-700",   sub: "text-blue-400"   },
                    { label: "Avg Attendance",    value: pct(report.dashboard_stats.average_attendance), bg: "bg-green-50",  text: "text-green-700",  sub: "text-green-400"  },
                    { label: "Chronic Absentees", value: report.dashboard_stats.chronic_absentees, bg: "bg-red-50",    text: "text-red-700",    sub: "text-red-400"    },
                    { label: "Teachers Marked",   value: `${report.dashboard_stats.teachers_marked}/${report.dashboard_stats.teachers_marked + report.dashboard_stats.teachers_pending}`, bg: "bg-purple-50", text: "text-purple-700", sub: "text-purple-400" },
                  ].map(({ label, value, bg, text, sub }) => (
                    <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
                      <p className={`text-2xl font-extrabold ${text}`}>{value}</p>
                      <p className={`text-xs font-semibold mt-1 ${sub}`}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Class Summary */}
                <Collapsible
                  title="Class Summary"
                  expanded={expandedSections.classSummary}
                  onToggle={() => toggleExpand("classSummary")}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm p-5">
                    {[
                      ["Class",          report.class_wise_summary.class_name],
                      ["Section",        report.class_wise_summary.section_name],
                      ["Working Days",   report.class_wise_summary.working_days],
                      ["Attendance %",   pct(report.class_wise_summary.attendance_percentage)],
                      ["Total Students", report.class_wise_summary.total_students],
                      ["Present",        report.class_wise_summary.present],
                      ["Absent",         report.class_wise_summary.absent],
                      ["Leave",          report.class_wise_summary.leave],
                    ].map(([label, val]) => (
                      <div key={String(label)}>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
                        <p className="font-bold text-gray-800">{val}</p>
                      </div>
                    ))}
                  </div>
                </Collapsible>

                {/* Daily Attendance */}
                {report.daily_attendance?.length > 0 && (
                  <Collapsible
                    title="Daily Attendance"
                    expanded={expandedSections.dailyAttendance}
                    onToggle={() => toggleExpand("dailyAttendance")}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <Th>Date</Th>
                            <Th center>Present</Th>
                            <Th center>Absent</Th>
                            <Th right>%</Th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {report.daily_attendance.map((d: AttendanceReportDaily, i: number) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="px-5 py-3 text-slate-700 font-medium">{format(new Date(d.date), "dd MMM yyyy")}</td>
                              <td className="px-5 py-3 text-center text-green-600 font-semibold">{d.present}</td>
                              <td className="px-5 py-3 text-center text-red-600 font-semibold">{d.absent}</td>
                              <td className="px-5 py-3 text-right font-semibold text-slate-700">{pct(d.attendance_percentage)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Collapsible>
                )}

                {/* Student Details */}
                {report.student_attendance_details?.length > 0 && (
                  <Collapsible
                    title="Student Attendance Details"
                    expanded={expandedSections.studentDetails}
                    onToggle={() => toggleExpand("studentDetails")}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <Th>Roll No</Th>
                            <Th>Name</Th>
                            <Th center>Present</Th>
                            <Th center>Absent</Th>
                            <Th center>Leave</Th>
                            <Th right>%</Th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {report.student_attendance_details.map((s: AttendanceReportStudentDetail) => (
                            <tr key={s.student_id} className="hover:bg-slate-50">
                              <td className="px-5 py-3 text-slate-400 text-xs">{s.roll_number}</td>
                              <td className="px-5 py-3 text-slate-800 font-medium">{s.student_name}</td>
                              <td className="px-5 py-3 text-center text-green-600 font-semibold">{s.total_present}</td>
                              <td className="px-5 py-3 text-center text-red-600 font-semibold">{s.total_absent}</td>
                              <td className="px-5 py-3 text-center text-amber-600 font-semibold">{s.total_leave}</td>
                              <td className="px-5 py-3 text-right font-semibold text-slate-700">{pct(s.attendance_percentage)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Collapsible>
                )}

                {/* Chronic Absentees */}
                {report.chronic_absentees?.length > 0 && (
                  <Collapsible
                    title="Chronic Absentees"
                    expanded={expandedSections.chronicAbsentees}
                    onToggle={() => toggleExpand("chronicAbsentees")}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <Th>Roll No</Th>
                            <Th>Name</Th>
                            <Th center>Present</Th>
                            <Th center>Absent</Th>
                            <Th right>%</Th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {report.chronic_absentees.map((c: AttendanceReportChronicAbsentee, i: number) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="px-5 py-3 text-slate-400 text-xs">{c.roll_number}</td>
                              <td className="px-5 py-3 text-slate-800 font-medium">{c.student_name}</td>
                              <td className="px-5 py-3 text-center text-green-600 font-semibold">{c.present_days}</td>
                              <td className="px-5 py-3 text-center text-red-600 font-semibold">{c.absent_days}</td>
                              <td className="px-5 py-3 text-right font-semibold text-slate-700">{pct(c.attendance_percentage)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Collapsible>
                )}

                {/* Teacher-wise Status */}
                {report.teacher_wise_status?.length > 0 && (
                  <Collapsible
                    title="Teacher-wise Marking Status"
                    expanded={expandedSections.teacherStatus}
                    onToggle={() => toggleExpand("teacherStatus")}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <Th>Teacher</Th>
                            <Th center>Classes</Th>
                            <Th center>Marked</Th>
                            <Th center>Pending</Th>
                            <Th right>%</Th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {report.teacher_wise_status.map((t: AttendanceReportTeacherStatus) => (
                            <tr key={t.teacher_id} className="hover:bg-slate-50">
                              <td className="px-5 py-3 text-slate-800 font-medium">{t.teacher_name}</td>
                              <td className="px-5 py-3 text-center text-slate-600">{t.total_classes_assigned}</td>
                              <td className="px-5 py-3 text-center text-green-600 font-semibold">{t.attendance_marked}</td>
                              <td className="px-5 py-3 text-center text-red-600 font-semibold">{t.attendance_pending}</td>
                              <td className="px-5 py-3 text-right font-semibold text-slate-700">{pct(t.marking_percentage)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Close & View in Table
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ── Helper UI components ─────────────────────────────────────────────────────

const Collapsible = ({
  title, expanded, onToggle, children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
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
  <th className={`px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide ${center ? "text-center" : right ? "text-right" : "text-left"}`}>
    {children}
  </th>
);

export default AttendanceReportForm;
