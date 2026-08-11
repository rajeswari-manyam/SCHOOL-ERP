import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { SubmittedExam, ExamStatus } from "../types/exam-marks.types";
import StudentDownloadMenu from "./StudentDownloadMenu";

const STATUS_CONFIG: Record<ExamStatus, { label: string; classes: string }> = {
  DRAFT:     { label: "Draft",     classes: "bg-gray-100 text-gray-500 border border-gray-200" },
  SUBMITTED: { label: "Submitted", classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  APPROVED:  { label: "Approved",  classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  PUBLISHED: { label: "Published", classes: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface Props {
  exams: SubmittedExam[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  /** Whether the user has clicked Search at least once */
  hasSearched?: boolean;
  /** Shows the Publish toggle column — used by the school-admin Results page, not the teacher view */
  showPublish?: boolean;
  /** Publishes a single exam row's results to students & parents */
  onPublish?: (exam: SubmittedExam) => void;
  /** id of the exam row currently being published, if any */
  publishingId?: string | null;
  /** Filter context needed to look up a row's student roster for per-student PDF download */
  classId?: string;
  sectionId?: string;
  subjectId?: string;
  academicYearId?: string;
}

const SubmittedMarksTab = ({
  exams, loading, error, onRetry, hasSearched, showPublish, onPublish, publishingId,
  classId, sectionId, subjectId, academicYearId,
}: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Idle state: no search triggered yet
  if (!hasSearched && !loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-sm font-semibold text-gray-500">Select filters and click Search</p>
        <p className="text-xs text-gray-400 mt-1">
          Choose Class, Section and Subject above to load submitted marks
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-500">Loading submitted marks…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
        <div className="text-3xl mb-3 text-red-400">⚠</div>
        <p className="text-sm font-semibold text-gray-500 mb-2">Failed to load submitted marks</p>
        {onRetry && (
          <button onClick={onRetry} className="text-xs font-semibold text-indigo-600 hover:underline">
            Try again
          </button>
        )}
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
        <div className="text-4xl mb-3">📤</div>
        <p className="text-sm font-semibold text-gray-500">No submitted exams found</p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting the filters above</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Results count */}
      <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Results
        </p>
        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {exams.length} {exams.length === 1 ? "exam" : "exams"}
        </span>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-gray-50">
        {exams.map((ex) => {
          const cfg = STATUS_CONFIG[ex.status] ?? STATUS_CONFIG.SUBMITTED;
          const completion = ex.completionPercentage ?? 0;
          const isExpanded = expandedId === ex.id;
          return (
            <div key={ex.id}>
              <div
                onClick={() => setExpandedId(isExpanded ? null : ex.id)}
                className={`p-4 cursor-pointer active:bg-gray-50 transition-colors ${isExpanded ? "bg-indigo-50/40" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{ex.examLabel}</p>
                    <p className="text-[11px] text-gray-400">{ex.academicYear}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.classes}`}>
                    {cfg.label}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-gray-500">
                  <span className="truncate">{ex.className} · {ex.subject}</span>
                  <span className="shrink-0">{formatDate(ex.submittedOn)}</span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  <span>{ex.appeared}/{ex.totalStudents} entered</span>
                  <span className="font-semibold text-indigo-600">Avg {ex.average}</span>
                  <span className={`font-semibold ${completion === 100 ? "text-emerald-600" : "text-amber-600"}`}>
                    {completion}% complete
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {ex.status === "SUBMITTED" && (
                      <button className="text-xs font-semibold text-amber-600 hover:text-amber-800 hover:underline transition-colors">
                        Approve
                      </button>
                    )}

                    {showPublish && (
                      ex.status === "PUBLISHED" ? (
                        <span className="flex items-center gap-1.5" title="Results published to students & parents">
                          <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-indigo-600">
                            <span className="inline-block h-3 w-3 translate-x-3.5 rounded-full bg-white" />
                          </span>
                          <span className="text-[11px] font-bold text-indigo-600">Published</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onPublish?.(ex)}
                          disabled={publishingId === ex.id}
                          title="Publish results to students & parents"
                          className="flex items-center gap-1.5 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-gray-200 group-hover:bg-gray-300 transition-colors">
                            <span className="inline-block h-3 w-3 translate-x-0.5 rounded-full bg-white shadow transition-transform" />
                          </span>
                          <span className="text-[11px] font-semibold text-gray-500 group-hover:text-gray-700">
                            {publishingId === ex.id ? "Publishing…" : "Publish"}
                          </span>
                        </button>
                      )
                    )}

                    {classId && sectionId && subjectId && ex.examId && (
                      <StudentDownloadMenu
                        classId={classId}
                        sectionId={sectionId}
                        subjectId={subjectId}
                        academicYearId={academicYearId ?? ex.academicYearId ?? ""}
                        examId={ex.examId}
                      />
                    )}
                  </div>

                  <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 shrink-0">
                    {isExpanded ? "Close" : "View"}
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 bg-gray-50/60">
                  {!ex.enteredStudents || ex.enteredStudents.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-3">No student marks found for this exam.</p>
                  ) : (
                    <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
                      {ex.enteredStudents.map((s) => (
                        <div key={s.studentId} className="p-3 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{s.studentName}</p>
                            <p className="text-[11px] text-gray-400">{s.admissionNo || "—"}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-semibold text-indigo-600">{s.marksObtained}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.isPublished
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              {s.isPublished ? "Published" : "Not Published"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Exam", "Class · Subject", "Exam Date", "Entered / Total", "Avg Marks", "Completion", "Status", ""].map((h) => (
                <th
                  key={h}
                  className={`text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 px-5 py-3.5 ${
                    h === "" ? "text-right" : ""
                  } ${["Entered / Total", "Avg Marks", "Completion"].includes(h) ? "hidden sm:table-cell" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exams.map((ex) => {
              const cfg = STATUS_CONFIG[ex.status] ?? STATUS_CONFIG.SUBMITTED;
              const completion = ex.completionPercentage ?? 0;
              const isExpanded = expandedId === ex.id;
              return (
                <Fragment key={ex.id}>
                <tr
                  onClick={() => setExpandedId(isExpanded ? null : ex.id)}
                  className={`cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${isExpanded ? "bg-indigo-50/40" : ""}`}
                >
                  {/* Exam name */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-900">{ex.examLabel}</p>
                    <p className="text-[11px] text-gray-400">{ex.academicYear}</p>
                  </td>

                  {/* Class · Subject */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-gray-700">{ex.className}</p>
                    <p className="text-[11px] text-gray-400">{ex.subject}</p>
                  </td>

                  {/* Exam date */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-600">{formatDate(ex.submittedOn)}</span>
                  </td>

                  {/* Marks entered / total */}
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-gray-700">{ex.appeared}/{ex.totalStudents}</span>
                  </td>

                  {/* Average marks */}
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm font-semibold text-indigo-600">{ex.average}</span>
                  </td>

                  {/* Completion % with mini progress bar */}
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${completion === 100 ? "bg-emerald-500" : "bg-indigo-400"}`}
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${completion === 100 ? "text-emerald-600" : "text-amber-600"}`}>
                        {completion}%
                      </span>
                    </div>
                  </td>

                  {/* Status badge */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.classes}`}>
                      {cfg.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                        {ex.status === "SUBMITTED" && (
                          <button className="text-xs font-semibold text-amber-600 hover:text-amber-800 hover:underline transition-colors">
                            Approve
                          </button>
                        )}

                        {/* Publish toggle — publishing has no undo, so once PUBLISHED it's a disabled on-state */}
                        {showPublish && (
                          ex.status === "PUBLISHED" ? (
                            <span className="flex items-center gap-1.5" title="Results published to students & parents">
                              <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-indigo-600">
                                <span className="inline-block h-3 w-3 translate-x-3.5 rounded-full bg-white" />
                              </span>
                              <span className="text-[11px] font-bold text-indigo-600">Published</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onPublish?.(ex)}
                              disabled={publishingId === ex.id}
                              title="Publish results to students & parents"
                              className="flex items-center gap-1.5 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-gray-200 group-hover:bg-gray-300 transition-colors">
                                <span className="inline-block h-3 w-3 translate-x-0.5 rounded-full bg-white shadow transition-transform" />
                              </span>
                              <span className="text-[11px] font-semibold text-gray-500 group-hover:text-gray-700">
                                {publishingId === ex.id ? "Publishing…" : "Publish"}
                              </span>
                            </button>
                          )
                        )}

                        {classId && sectionId && subjectId && ex.examId && (
                          <StudentDownloadMenu
                            classId={classId}
                            sectionId={sectionId}
                            subjectId={subjectId}
                            academicYearId={academicYearId ?? ex.academicYearId ?? ""}
                            examId={ex.examId}
                          />
                        )}
                      </div>

                      <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                        {isExpanded ? "Close" : "View"}
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </span>
                    </div>
                  </td>
                </tr>

                {isExpanded && (
                  <tr className="border-b border-gray-50 last:border-0 bg-gray-50/60">
                    <td colSpan={8} className="px-5 py-4">
                      {!ex.enteredStudents || ex.enteredStudents.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-3">No student marks found for this exam.</p>
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-100 bg-gray-50/80">
                                {["Admission No", "Student Name", "Marks Obtained", "Published"].map((h) => (
                                  <th key={h} className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 py-2.5">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {ex.enteredStudents.map((s) => (
                                <tr key={s.studentId} className="border-b border-gray-50 last:border-0">
                                  <td className="px-4 py-2.5 text-sm text-gray-600">{s.admissionNo || "—"}</td>
                                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{s.studentName}</td>
                                  <td className="px-4 py-2.5 text-sm font-semibold text-indigo-600">{s.marksObtained}</td>
                                  <td className="px-4 py-2.5">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      s.isPublished
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "bg-gray-100 text-gray-500"
                                    }`}>
                                      {s.isPublished ? "Published" : "Not Published"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmittedMarksTab;
