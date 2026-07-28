import { useState } from "react";
import {
  useClassTimetable,
  useUpcomingExaminations,
  useAddExamsToCalendar,
} from "../hooks/useClassTimetable";

import TimetableGrid from "../components/Timetablegrid";
import SubjectLegend from "../components/Subjectlegend";
import ExaminationTable from "../components/Examinationtable";
import { GraduationCap } from "lucide-react";
import { downloadClassTimetable } from "@/services/timetable.api";

const ClassTimetablePage = () => {
  const { data: timetable, meta, isLoading, isError } = useClassTimetable();
  const [downloading, setDownloading] = useState(false);

  // Real IDs, once timetable loads (class_id / section_id are encoded inside
  // timetable rows — we get them from meta)
  const classId = timetable?.rows?.[0] ? (timetable as any)._classId : undefined;
  const sectionId = timetable?.rows?.[0] ? (timetable as any)._sectionId : undefined;

  const { data: examinations } = useUpcomingExaminations(classId, sectionId);

  const { addAll } = useAddExamsToCalendar();

  const handleDownload = async () => {
    if (!classId || !sectionId) return;
    setDownloading(true);
    try {
      await downloadClassTimetable(classId, sectionId);
    } catch (err) {
      console.error("Failed to download timetable", err);
    } finally {
      setDownloading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          <p className="text-sm text-gray-400 font-medium">Loading timetable…</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError || !timetable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6 text-gray-500">
        <span className="text-4xl">⚠️</span>
        <p className="text-sm sm:text-base font-semibold">
          Failed to load timetable. Please refresh.
        </p>
      </div>
    );
  }

  const handleAddToCalendar = () => {
    if (examinations) {
      addAll(examinations.exams.map((e) => e.id));
    }
  };

  return (
    <div className="
      flex flex-col gap-5 sm:gap-6
      min-h-full
      px-3 sm:px-5 lg:px-6
      py-4 sm:py-6
    ">

      {/* ── HEADER ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          My Class Timetable
        </h1>

        {/* Student info row — consistent with HomeworkPage & AttendancePage */}
        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-sm text-gray-400">

          {meta?.studentName && (
            <span className="font-medium text-gray-600">{meta.studentName}</span>
          )}

          {meta?.className && (
            <>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <GraduationCap size={13} className="text-gray-400" />
                Class {meta.className}
                {meta.sectionName && (
                  <span className="text-gray-400">– {meta.sectionName}</span>
                )}
              </span>
            </>
          )}

          <span className="text-gray-300">•</span>
          <span>Academic Year {meta?.academicYear ?? timetable.academicYear}</span>

        </div>
      </div>

      {/* ── TIMETABLE GRID ── */}
      <div className="
        w-full overflow-hidden
        rounded-2xl border border-gray-100
        transition-all duration-200
        hover:border-indigo-200 hover:shadow-sm
      ">
        <TimetableGrid
          rows={timetable.rows}
          todayDay={timetable.todayDay}
          onPrint={() => window.print()}
          onDownload={classId && sectionId ? handleDownload : undefined}
          downloading={downloading}
        />
      </div>

      {/* ── SUBJECT LEGEND ── */}
      <div className="
        w-full overflow-hidden
        rounded-xl border border-gray-100
        transition-all duration-200
        hover:border-indigo-200 hover:shadow-sm
        hover:-translate-y-0.5
      ">
        <SubjectLegend subjects={timetable.subjects} />
      </div>

      {/* ── UPCOMING EXAMS ── */}
      {examinations && (
        <div className="
          w-full overflow-hidden
          rounded-2xl border border-gray-100
          transition-all duration-200
          hover:border-indigo-200 hover:shadow-sm
        ">
          <ExaminationTable
            examinations={examinations}
            onAddToCalendar={handleAddToCalendar}
          />
        </div>
      )}

    </div>
  );
};

export default ClassTimetablePage;