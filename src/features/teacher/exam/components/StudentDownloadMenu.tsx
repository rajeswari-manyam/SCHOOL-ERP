import { useState } from "react";
import { Download, Loader2, ChevronDown } from "lucide-react";
import { examMarksApi } from "@/services/teacher-exam-marks.api";
import type { StudentsBySubjectItem } from "../types/exam-marks.types";
import { triggerMarksDownload } from "@/services/marks.api";

interface Props {
  classId: string;
  sectionId: string;
  subjectId: string;
  academicYearId: string;
  examId: string;
}

// Per-row "download result PDF" action for an aggregated exam row — the row
// covers a whole class/section/subject, so this fetches that exam's student
// roster (/tenant/studentsbysubject) and lets the caller pick who to download for.
const StudentDownloadMenu = ({ classId, sectionId, subjectId, academicYearId, examId }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentsBySubjectItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleToggle = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (!willOpen || students.length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const list = await examMarksApi.getStudentsBySubject({
        class_id: classId,
        section_id: sectionId,
        subject_id: subjectId,
        academicYearId,
        exam_id: examId,
      });
      setStudents(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (studentId: string) => {
    setDownloadingId(studentId);
    setError(null);
    try {
      await triggerMarksDownload(studentId, examId);
    } catch (err) {
      console.error(err);
      setError("Failed to download result PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
      >
        <Download size={12} />
        Download
        <ChevronDown size={11} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg max-h-64 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={16} className="animate-spin text-indigo-500" />
            </div>
          )}
          {!loading && error && (
            <p className="px-3 py-2 text-xs text-red-500">{error}</p>
          )}
          {!loading && !error && students.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-400">No students found</p>
          )}
          {!loading && students.map((s) => {
            const sid = s.studentId || s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleDownload(sid)}
                disabled={downloadingId === sid}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                <span className="truncate">
                  {s.studentName || "Unnamed"}{s.rollNo ? ` (#${s.rollNo})` : ""}
                </span>
                {downloadingId === sid ? (
                  <Loader2 size={12} className="animate-spin text-indigo-500 shrink-0" />
                ) : (
                  <Download size={12} className="text-gray-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDownloadMenu;
