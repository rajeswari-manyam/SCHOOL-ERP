import React, { useState, useEffect } from "react";
import { useAttendance } from "../hooks/useAttendance";
import { AttendanceStats } from "../components/AttendanceStats";
import { AttendanceCalendar } from "../components/Attendancecalendar";
import { AbsentList } from "../components/AbsentList";
import { AttendancePolicy } from "../components/AttendancePolicy";
import { useAuthStore } from "@/store/authStore";
import { getStudentById } from "@/services/student.api";
import { getAllAcademicYears } from "@/services/academicYear.api";
import { GraduationCap } from "lucide-react";
import type { Student } from "@/services/student.api";
import type { AcademicYearRecord } from "@/services/academicYear.api";

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AttendancePage(): React.ReactElement {
  const { user } = useAuthStore();
  const studentId = user?.id;

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear] = useState<number>(today.getFullYear());

  // ── Student + Academic Year meta ─────────────────────────────────────────
  const [student, setStudent] = useState<Student | null>(null);
  const [academicYear, setAcademicYear] = useState<AcademicYearRecord | null>(null);
  const [idsReady, setIdsReady] = useState(false);
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  useEffect(() => {
    if (!studentId) return;

    getStudentById(studentId)
      .then((s) => {
        setStudent(s);
        setClassId(s.class_id ?? "");
        setSectionId(s.sectionId ?? "");
      })
      .catch(() => setStudent(null));

    getAllAcademicYears().then(({ data }) => {
      const active = data.find((y) => y.active) ?? data[0] ?? null;
      setAcademicYear(active);
      if (active) setAcademicYearId(active.id);
    });
  }, [studentId]);

  useEffect(() => {
    if (classId && sectionId && academicYearId) setIdsReady(true);
  }, [classId, sectionId, academicYearId]);

  // ── Safety check ─────────────────────────────────────────────────────────
  if (!studentId) {
    return <p className="p-6 text-gray-400">Student not found. Please login again.</p>;
  }

  const { data, loading, error, refetch } = useAttendance({
    studentId,
    month: currentMonth,
    year: currentYear,
    classId: idsReady ? classId : undefined,
    sectionId: idsReady ? sectionId : undefined,
    academicYearId: idsReady ? academicYearId : undefined,
  });

  const prevMonth = () => setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
  const nextMonth = () => setCurrentMonth((m) => (m === 11 ? 0 : m + 1));

  // ── Derived display values ────────────────────────────────────────────────
  const studentName = student
    ? `${student.first_name} ${student.last_name}`.trim()
    : data?.studentName ?? "—";

  const className = student?.classDetail?.class_name ?? data?.className ?? "—";
  const sectionName = student?.sectionDetail?.sectionName ?? "—";
  const academicYearName = academicYear?.yearName ?? data?.academicYear ?? "—";

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading attendance data…</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <p className="text-sm text-red-500 font-medium">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm font-semibold bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <p className="p-6 text-gray-400">No data available.</p>;

  return (
    <div className="min-h-screen bg-indigo-50 font-sans">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-6 sm:py-7 pb-12">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-lg sm:text-[22px] font-bold tracking-tight text-gray-900">
              My Attendance
            </h1>

            {/* Student info row — same style as HomeworkPage */}
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-400">
              {studentName && (
                <span className="font-medium text-gray-600">{studentName}</span>
              )}
              {className && className !== "—" && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap size={13} className="text-gray-400" />
                    Class {className}
                    {sectionName && sectionName !== "—" && (
                      <span className="text-gray-400">– {sectionName}</span>
                    )}
                  </span>
                </>
              )}
              <span className="text-gray-300">•</span>
              <span>Academic Year {academicYearName}</span>
            </div>
          </div>

          {/* Month Nav */}
          <div className="flex items-center justify-start sm:justify-end gap-2 text-sm font-semibold text-gray-700">
            <button
              onClick={prevMonth}
              className="w-8 h-8 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
            >
              ‹
            </button>
            <span className="min-w-[110px] text-center text-sm sm:text-base">
              {MONTH_LABELS[currentMonth]} {currentYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 border border-gray-200 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
            >
              ›
            </button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <AttendanceStats title="This Month" data={data.month} />
          <AttendanceStats title="This Year" data={data.year} />
          <AttendanceStats title="Absent This Month" data={data.month} variant="absent" />
        </div>

        {/* ── CALENDAR + ABSENT LIST ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-5">
          <div className="bg-white rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              Monthly Attendance — {MONTH_LABELS[currentMonth]} {currentYear}
            </p>
            <AttendanceCalendar
              days={data.days}
              month={currentMonth}
              year={currentYear}
            />
          </div>

          <AbsentList
            days={data.days}
            monthLabel={`${MONTH_LABELS[currentMonth]} ${currentYear}`}
          />
        </div>

        {/* ── POLICY ── */}
        <AttendancePolicy percentage={data.month.percentage} minRequired={75} />

      </div>
    </div>
  );
}