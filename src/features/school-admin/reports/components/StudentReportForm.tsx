import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  X, Loader2, Users, BookOpen, UserCheck, CalendarDays,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { reportsApi } from "@/services/reports.api";
import { REPORTS_KEYS } from "../hooks/useReports";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import { getStudentsByClassSection } from "@/services/fee.api";
import { useUIStore } from "../../../../store/uiStore";
import type { StudentReportResponse } from "../types/reports.types";

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

const INCLUDE_OPTIONS = [
  { key: "student_list"             as const, label: "Student List"              },
  { key: "admission_report"         as const, label: "Admission Report"          },
  { key: "class_strength"           as const, label: "Class Strength"            },
  { key: "student_attendance"       as const, label: "Student Attendance"        },
  { key: "student_attendance_by_id" as const, label: "Student Attendance by ID"  },
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

const StatusPill = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const cls =
    s === "active"   ? "bg-emerald-100 text-emerald-700" :
    s === "inactive" ? "bg-red-100 text-red-700"         :
                       "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      {status}
    </span>
  );
};

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

// ────────────────────────────────────────────────────────────────────────────

const StudentReportForm = ({ open, onClose }: Props) => {
  const qc = useQueryClient();
  const academicYearId   = useUIStore((s) => s.academicYearId) ?? "";
  const academicYearName = useUIStore((s) => s.academicYearName) ?? "";

  const [classId,   setClassId]   = useState("");
  const [sectionId, setSectionId] = useState("");
  const [studentId, setStudentId] = useState("");

  const [period,     setPeriod]     = useState<PeriodKey>("LAST_MONTH");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");

  const [includeSections, setIncludeSections] = useState({
    student_list:             true,
    admission_report:         true,
    class_strength:           true,
    student_attendance:       true,
    student_attendance_by_id: false,
  });

  const [generating, setGenerating] = useState(false);
  const [report,     setReport]     = useState<StudentReportResponse | null>(null);

  const [expanded, setExpanded] = useState({
    studentList:       true,
    admissionReport:   true,
    classStrength:     true,
    studentAttendance: true,
    studentById:       true,
  });

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: classesData } = useQuery({
    queryKey: ["sr-classes"],
    queryFn:  () => getAllClasses(),
    staleTime: 5 * 60_000,
  });

  const { data: sectionsData } = useQuery({
    queryKey: ["sr-sections", classId],
    queryFn:  () => getSectionsByClassId(classId),
    enabled:  !!classId,
    staleTime: 5 * 60_000,
  });

  const { data: studentsData, isFetching: studentsLoading } = useQuery({
    queryKey: ["sr-students", classId, sectionId],
    queryFn:  () => getStudentsByClassSection(classId, sectionId),
    enabled:  !!classId && !!sectionId,
    staleTime: 5 * 60_000,
  });

  const classOptions   = classesData?.data ?? [];
  const sectionOptions = sectionsData?.data ?? [];
  const studentList    = studentsData?.data ?? [];

  const dateRange = getDateRange(period);

  const toggleInclude = (key: keyof typeof includeSections) =>
    setIncludeSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleExpand = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Generate ───────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!classId)   { toast.error("Please select a class");   return; }
    if (!sectionId) { toast.error("Please select a section"); return; }

    const fromDate = period === "CUSTOM" ? customFrom : dateRange ? format(dateRange.from, "yyyy-MM-dd") : "";
    const toDate   = period === "CUSTOM" ? customTo   : dateRange ? format(dateRange.to,   "yyyy-MM-dd") : "";
    if (!fromDate || !toDate) { toast.error("Please set a date range"); return; }

    if (includeSections.student_attendance_by_id && !studentId) {
      toast.error("Please select a student for Student Attendance by ID");
      return;
    }

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

      const res = await reportsApi.studentReport(payload);
      if (res.status) {
        setReport(res);
        toast.success("Student report generated");
        qc.invalidateQueries({ queryKey: REPORTS_KEYS.all });
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
    setPeriod("LAST_MONTH"); setCustomFrom(""); setCustomTo("");
    setIncludeSections({
      student_list: true, admission_report: true, class_strength: true,
      student_attendance: true, student_attendance_by_id: false,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  const d = report?.data;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <div
          className="bg-white w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95dvh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile drag handle */}
          <div className="flex justify-center pt-2.5 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {report ? "Student Report" : "Generate Student Report"}
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

                {/* Step 2: Student (optional — required only for by_id) */}
                <div className={`bg-gray-50 rounded-2xl p-4 space-y-3 transition-opacity duration-200 ${classId && sectionId ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                  <StepLabel icon={Users} text="Step 2 — Select Student (for Attendance by ID)" />
                  <div className="relative">
                    {studentsLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                        <Loader2 size={14} className="animate-spin text-indigo-500" />
                      </div>
                    )}
                    <Select
                      value={studentId}
                      placeholder="All Students (optional)"
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
                  <p className="text-[11px] text-gray-400">
                    Required only when "Student Attendance by ID" is checked below.
                  </p>
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

                {/* Step 4: Include Sections */}
                <div className={`bg-gray-50 rounded-2xl p-4 space-y-3 transition-opacity duration-200 ${classId && sectionId ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                  <StepLabel icon={UserCheck} text="Step 4 — Report Sections to Include" />
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
                    onClick={handleClose}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={generating || !classId || !sectionId}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {generating
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Generating…</>
                      : <><Users className="w-4 h-4" />Generate Report</>}
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

                {/* ── Student List ──────────────────────────────────────── */}
                {d.student_list && d.student_list.length > 0 && (
                  <Collapsible
                    title={`Student List (${d.student_list.length})`}
                    expanded={expanded.studentList}
                    onToggle={() => toggleExpand("studentList")}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <Th>Roll No</Th>
                            <Th>Name</Th>
                            <Th>Admission No</Th>
                            <Th>Gender</Th>
                            <Th>Class · Section</Th>
                            <Th center>Status</Th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {d.student_list.map((s: any) => (
                            <tr key={s.student_id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-slate-400 text-xs">{s.roll_number}</td>
                              <td className="px-4 py-3 text-slate-800 font-medium">{s.student_name}</td>
                              <td className="px-4 py-3 text-slate-500 text-xs font-mono">{s.admission_number}</td>
                              <td className="px-4 py-3 text-slate-500 capitalize">{s.gender}</td>
                              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                {s.class_name} · {s.section_name}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <StatusPill status={s.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Collapsible>
                )}

                {/* ── Admission Report ──────────────────────────────────── */}
                {d.admission_report && d.admission_report.students?.length > 0 && (
                  <Collapsible
                    title={`Admission Report (${d.admission_report.total_admissions} admissions)`}
                    expanded={expanded.admissionReport}
                    onToggle={() => toggleExpand("admissionReport")}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <Th>Roll No</Th>
                            <Th>Name</Th>
                            <Th>Admission No</Th>
                            <Th>Admission Date</Th>
                            <Th>Class · Section</Th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {d.admission_report.students.map((s: any) => (
                            <tr key={s.student_id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-slate-400 text-xs">{s.roll_number}</td>
                              <td className="px-4 py-3 text-slate-800 font-medium">{s.student_name}</td>
                              <td className="px-4 py-3 text-slate-500 text-xs font-mono">{s.admission_number}</td>
                              <td className="px-4 py-3 text-slate-500">
                                {s.admission_date
                                  ? format(new Date(s.admission_date), "dd MMM yyyy")
                                  : "—"}
                              </td>
                              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                {s.class_name} · {s.section_name}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Collapsible>
                )}

                {/* ── Class Strength ────────────────────────────────────── */}
                {d.class_strength && d.class_strength.length > 0 && (
                  <Collapsible
                    title="Class Strength"
                    expanded={expanded.classStrength}
                    onToggle={() => toggleExpand("classStrength")}
                  >
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {d.class_strength.map((c: any, i: number) => (
                        <div key={i} className="bg-indigo-50 rounded-xl p-4 text-center">
                          <p className="text-2xl font-extrabold text-indigo-700">{c.total_students}</p>
                          <p className="text-xs font-semibold text-indigo-500 mt-1">
                            {c.class_name} · {c.section_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Collapsible>
                )}

                {/* ── Student Attendance ────────────────────────────────── */}
                {d.student_attendance && d.student_attendance.length > 0 && (
                  <Collapsible
                    title="Student Attendance"
                    expanded={expanded.studentAttendance}
                    onToggle={() => toggleExpand("studentAttendance")}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <Th>Name</Th>
                            <Th center>Present</Th>
                            <Th center>Absent</Th>
                            <Th center>Leave</Th>
                            <Th right>%</Th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {d.student_attendance.map((s: any) => (
                            <tr key={s.student_id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-slate-800 font-medium">{s.student_name}</td>
                              <td className="px-4 py-3 text-center text-green-600 font-semibold">{s.total_present}</td>
                              <td className="px-4 py-3 text-center text-red-600 font-semibold">{s.total_absent}</td>
                              <td className="px-4 py-3 text-center text-amber-600 font-semibold">{s.total_leave}</td>
                              <td className="px-4 py-3 text-right font-semibold text-slate-700">
                                {parseFloat(s.attendance_percentage).toFixed(0)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Collapsible>
                )}

                {/* ── Student Attendance by ID ──────────────────────────── */}
                {d.student_attendance_by_id && (
                  <Collapsible
                    title="Student Attendance by ID"
                    expanded={expanded.studentById}
                    onToggle={() => toggleExpand("studentById")}
                  >
                    {(() => {
                      const s = d.student_attendance_by_id;
                      return (
                        <div className="p-5 space-y-4">
                          {/* Student info */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                            {[
                              ["Name",           s.student_name],
                              ["Roll No",        s.roll_number],
                              ["Admission No",   s.admission_number],
                              ["Class",          `${s.class_name} · ${s.section_name}`],
                              ["Present",        s.total_present],
                              ["Absent",         s.total_absent],
                              ["Leave",          s.total_leave],
                              ["Attendance %",   `${parseFloat(s.attendance_percentage).toFixed(0)}%`],
                            ].map(([label, val]) => (
                              <div key={String(label)}>
                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
                                <p className="font-bold text-gray-800">{val}</p>
                              </div>
                            ))}
                          </div>

                          {/* Daily attendance details */}
                          {s.attendance_details?.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Day-by-day</p>
                              <div className="flex flex-wrap gap-2">
                                {s.attendance_details.map((d: any, i: number) => (
                                  <div key={i} className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-gray-400">
                                      {format(new Date(d.date), "dd MMM")}
                                    </span>
                                    <AttPill status={d.status} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
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
    </>
  );
};

export default StudentReportForm;
