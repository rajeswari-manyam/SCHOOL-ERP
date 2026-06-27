import { useState } from "react";
import { X, FileBarChart, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import type {
  RawReport,
  RawReportDailyAttendance,
  RawReportStudentDetail,
  RawReportChronicAbsentee,
  RawReportTeacherStatus,
} from "../types/reports.types";

interface Props {
  report: RawReport | null;
  onClose: () => void;
}

const pct = (v: number) => `${Math.round(v)}%`;

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
  <th className={`px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide ${center ? "text-center" : right ? "text-right" : "text-left"}`}>
    {children}
  </th>
);

const ReportViewModal = ({ report, onClose }: Props) => {
  const [expanded, setExpanded] = useState({
    classSummary: true,
    dailyAttendance: true,
    studentDetails: true,
    chronicAbsentees: true,
    teacherStatus: true,
  });

  const toggle = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!report) return null;

  const stats = report.dashboard_stats;
  const classWise = report.class_wise_summary;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
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
                <h2 className="text-base font-bold text-gray-900">{report.reportype}</h2>
                {report.academic_year && (
                  <p className="text-[11px] text-gray-400">Academic Year: {report.academic_year}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

            {/* Dashboard stat cards */}
            {stats ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total Students",    value: stats.total_students,                                                                                          bg: "bg-blue-50",   text: "text-blue-700",   sub: "text-blue-400"   },
                  { label: "Avg Attendance",    value: pct(stats.average_attendance),                                                                                 bg: "bg-green-50",  text: "text-green-700",  sub: "text-green-400"  },
                  { label: "Chronic Absentees", value: stats.chronic_absentees,                                                                                       bg: "bg-red-50",    text: "text-red-700",    sub: "text-red-400"    },
                  { label: "Teachers Marked",   value: `${stats.teachers_marked}/${stats.teachers_marked + stats.teachers_pending}`,                                  bg: "bg-purple-50", text: "text-purple-700", sub: "text-purple-400" },
                ].map(({ label, value, bg, text, sub }) => (
                  <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
                    <p className={`text-2xl font-extrabold ${text}`}>{value}</p>
                    <p className={`text-xs font-semibold mt-1 ${sub}`}>{label}</p>
                  </div>
                ))}
              </div>
            ) : (
              /* Basic info for non-attendance reports */
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                {([
                  ["Report Type",    report.reportype],
                  ["Class",          report.class_name ?? "—"],
                  ["Section",        report.section_name ?? "—"],
                  ["Period",         `${report.from} – ${report.to}`],
                  ["Format",         report.format],
                  ["Academic Year",  report.academic_year ?? "—"],
                ] as [string, string][]).map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
                    <p className="font-bold text-gray-800">{val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Class Summary */}
            {classWise && (
              <Collapsible
                title="Class Summary"
                expanded={expanded.classSummary}
                onToggle={() => toggle("classSummary")}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm p-5">
                  {([
                    ["Class",          classWise.class_name],
                    ["Section",        classWise.section_name],
                    ["Working Days",   classWise.working_days],
                    ["Attendance %",   pct(classWise.attendance_percentage)],
                    ["Total Students", classWise.total_students],
                    ["Present",        classWise.present],
                    ["Absent",         classWise.absent],
                    ["Leave",          classWise.leave],
                  ] as [string, string | number][]).map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
                      <p className="font-bold text-gray-800">{val}</p>
                    </div>
                  ))}
                </div>
              </Collapsible>
            )}

            {/* Daily Attendance */}
            {report.daily_attendance && report.daily_attendance.length > 0 && (
              <Collapsible
                title="Daily Attendance"
                expanded={expanded.dailyAttendance}
                onToggle={() => toggle("dailyAttendance")}
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
                      {report.daily_attendance.map((d: RawReportDailyAttendance, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-5 py-3 text-slate-700 font-medium">
                            {format(new Date(d.date), "dd MMM yyyy")}
                          </td>
                          <td className="px-5 py-3 text-center text-green-600 font-semibold">{d.present}</td>
                          <td className="px-5 py-3 text-center text-red-600 font-semibold">{d.absent}</td>
                          <td className="px-5 py-3 text-right font-semibold text-slate-700">
                            {pct(d.attendance_percentage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Collapsible>
            )}

            {/* Student Attendance Details */}
            {report.student_attendance_details && report.student_attendance_details.length > 0 && (
              <Collapsible
                title="Student Attendance Details"
                expanded={expanded.studentDetails}
                onToggle={() => toggle("studentDetails")}
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
                      {report.student_attendance_details.map((s: RawReportStudentDetail) => (
                        <tr key={s.student_id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 text-slate-400 text-xs">{s.roll_number}</td>
                          <td className="px-5 py-3 text-slate-800 font-medium">{s.student_name}</td>
                          <td className="px-5 py-3 text-center text-green-600 font-semibold">{s.total_present}</td>
                          <td className="px-5 py-3 text-center text-red-600 font-semibold">{s.total_absent}</td>
                          <td className="px-5 py-3 text-center text-amber-600 font-semibold">{s.total_leave}</td>
                          <td className="px-5 py-3 text-right font-semibold text-slate-700">
                            {pct(s.attendance_percentage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Collapsible>
            )}

            {/* Chronic Absentees */}
            {report.chronic_absentees && report.chronic_absentees.length > 0 && (
              <Collapsible
                title="Chronic Absentees"
                expanded={expanded.chronicAbsentees}
                onToggle={() => toggle("chronicAbsentees")}
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
                      {report.chronic_absentees.map((c: RawReportChronicAbsentee, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-5 py-3 text-slate-400 text-xs">{c.roll_number}</td>
                          <td className="px-5 py-3 text-slate-800 font-medium">{c.student_name}</td>
                          <td className="px-5 py-3 text-center text-green-600 font-semibold">{c.present_days}</td>
                          <td className="px-5 py-3 text-center text-red-600 font-semibold">{c.absent_days}</td>
                          <td className="px-5 py-3 text-right font-semibold text-slate-700">
                            {pct(c.attendance_percentage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Collapsible>
            )}

            {/* Teacher-wise Marking Status */}
            {report.teacher_wise_status && report.teacher_wise_status.length > 0 && (
              <Collapsible
                title="Teacher-wise Marking Status"
                expanded={expanded.teacherStatus}
                onToggle={() => toggle("teacherStatus")}
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
                      {report.teacher_wise_status.map((t: RawReportTeacherStatus) => (
                        <tr key={t.teacher_id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 text-slate-800 font-medium">{t.teacher_name}</td>
                          <td className="px-5 py-3 text-center text-slate-600">{t.total_classes_assigned}</td>
                          <td className="px-5 py-3 text-center text-green-600 font-semibold">{t.attendance_marked}</td>
                          <td className="px-5 py-3 text-center text-red-600 font-semibold">{t.attendance_pending}</td>
                          <td className="px-5 py-3 text-right font-semibold text-slate-700">
                            {pct(t.marking_percentage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Collapsible>
            )}

            {/* Close button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Generate Another Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportViewModal;
