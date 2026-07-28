import { useEffect, useState } from "react";
import { Loader2, Phone, Mail, Briefcase, Download } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { studentsApi } from "@/services/student.api";
import type { Student as AdminStudentUI } from "@/features/school-admin/students/types/student.types";
import { getYearlyAttendance, type YearlyAttendanceResponse } from "@/services/attendance.api";
import { getAllExams, type ExamRecord } from "@/services/exam.api";
import { triggerMarksDownload } from "@/services/marks.api";

interface Props {
  studentId: string;
  classId?: string;
  sectionId?: string;
}

const ParentRow = ({
  role, name, phone, email, occupation,
}: {
  role: string; name?: string; phone?: string; email?: string; occupation?: string;
}) => (
  <div className="flex-1 min-w-[200px] bg-gray-50 rounded-xl p-3">
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{role}</p>
    <p className="text-sm font-semibold text-gray-900">{name || "Not added"}</p>
    <div className="flex flex-col gap-1 mt-1.5">
      {phone && (
        <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline w-fit">
          <Phone size={11} /> {phone}
        </a>
      )}
      {email && (
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Mail size={11} /> {email}
        </span>
      )}
      {occupation && (
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Briefcase size={11} /> {occupation}
        </span>
      )}
    </div>
  </div>
);

const StudentExpandedDetails = ({ studentId, classId, sectionId }: Props) => {
  const academicYearId = useUIStore((s) => s.academicYearId);

  const [detail, setDetail] = useState<AdminStudentUI | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<YearlyAttendanceResponse | null>(null);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [examList, setExamList] = useState<ExamRecord[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    getAllExams()
      .then((list) => {
        setExamList(list);
        if (list.length > 0) setSelectedExamId((prev) => prev || list[0].id);
      })
      .catch((err) => console.error("Failed to load exam list", err));
  }, []);

  const handleDownloadResult = async () => {
    if (!studentId || !selectedExamId) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      await triggerMarksDownload(studentId, selectedExamId);
    } catch (err: any) {
      console.error(err);
      setDownloadError(err?.message || "Failed to download result PDF.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDetailError(null);
    setAttendanceError(null);

    Promise.all([
      studentsApi.getById(studentId).catch((err) => {
        if (!cancelled) setDetailError(err?.message ?? "Failed to load student details.");
        return null;
      }),
      getYearlyAttendance({
        studentId,
        year: new Date().getFullYear(),
        class_id: classId ?? "",
        section_id: sectionId ?? "",
        academicYearId: academicYearId ?? "",
      }).catch((err) => {
        if (!cancelled) setAttendanceError(err?.message ?? "Failed to load attendance.");
        return null;
      }),
    ]).then(([studentRes, attendanceRes]) => {
      if (cancelled) return;
      setDetail(studentRes ?? null);
      setAttendance(attendanceRes);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [studentId, classId, sectionId, academicYearId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 size={18} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  const summary = attendance?.summary;
  const pct = summary && summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Attendance */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Attendance (This Academic Year)</p>
        {attendanceError ? (
          <p className="text-xs text-red-500">{attendanceError}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-center min-w-[70px]">
              <p className="text-sm font-bold text-emerald-700">{summary?.present ?? 0}</p>
              <p className="text-[10px] text-emerald-600">Present</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-center min-w-[70px]">
              <p className="text-sm font-bold text-red-600">{summary?.absent ?? 0}</p>
              <p className="text-[10px] text-red-500">Absent</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-center min-w-[70px]">
              <p className="text-sm font-bold text-indigo-700">{summary?.total ?? 0}</p>
              <p className="text-[10px] text-indigo-500">Total Days</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-center min-w-[70px]">
              <p className="text-sm font-bold text-gray-700">{pct}%</p>
              <p className="text-[10px] text-gray-500">Attendance</p>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Results</p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 px-2.5 cursor-pointer"
          >
            {examList.length === 0 && <option value="">No exams available</option>}
            {examList.map((exam) => (
              <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
            ))}
          </select>
          <button
            onClick={handleDownloadResult}
            disabled={downloading || !selectedExamId}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            {downloading ? "Downloading…" : "Download Result PDF"}
          </button>
          {downloadError && <p className="text-[11px] text-red-500">{downloadError}</p>}
        </div>
      </div>

      {/* Parents */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Parent / Guardian</p>
        {detailError ? (
          <p className="text-xs text-red-500">{detailError}</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            <ParentRow
              role="Father"
              name={detail?.fatherName}
              phone={detail?.fatherPhone}
              email={detail?.fatherEmail}
              occupation={detail?.fatherOccupation}
            />
            <ParentRow
              role="Mother"
              name={detail?.motherName}
              phone={detail?.motherPhone}
              email={detail?.motherEmail}
              occupation={detail?.motherOccupation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExpandedDetails;
