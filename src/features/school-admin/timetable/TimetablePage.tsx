import React, { useState } from "react";
import {
  useTimetablePage,
  useSubjectOptions,
  useTeacherOptions,
  useSavePeriod,
  useAddExam,
  useDeleteExam,
  useToggleNotifyParents,
  useResendNotification,
  usePrintTimetable,
  useEditPeriodState,
} from "./hooks/useTimetable";
import type { DayOfWeek, ExamEntry } from "./types/";
import ClassTabs from "./components/Classtabs";
import WeeklyTimetableGrid from "./components/Weeklytimetablegrid";
import ExamTimetableTable from "./components/Examtimetabletable";
import AddExamModal from "./components/AddExamModal";
import EditPeriodModal from "./components/Editperiodmodal";

const TimetablePage: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState("class-10");

  // ── Data ──────────────────────────────────────────────────────────────────────
  const { data, isLoading } = useTimetablePage(selectedClassId);
  const { data: subjects = [] } = useSubjectOptions();
  const { data: teachers = [] } = useTeacherOptions();

  // ── Mutations ─────────────────────────────────────────────────────────────────
  const { mutate: savePeriod, isPending: isSaving } = useSavePeriod();
  const { mutate: addExam, isPending: isAddingExam } = useAddExam();
  const { mutate: deleteExam } = useDeleteExam();
  const { mutate: toggleNotify } = useToggleNotifyParents();
  const { mutate: resendNotification } = useResendNotification();
  const { print: printTimetable, loading: isPrinting } = usePrintTimetable();
  const [addExamOpen, setAddExamOpen] = useState(false);

  // ── Edit period modal ─────────────────────────────────────────────────────────
  const { state: editState, openModal, closeModal, setField } = useEditPeriodState();

  const handleEditCell = (
    day: DayOfWeek,
    periodNo: number,
    subject: string,
    teacherName: string
  ) => {
    openModal(selectedClassId, day, periodNo, subject, teacherName);
  };

  const handleSavePeriod = () => {
    if (!editState.day || editState.periodNo == null) return;
    savePeriod(
      {
        classId: editState.classId,
        day: editState.day,
        periodNo: editState.periodNo,
        subject: editState.subject,
        teacherName: editState.teacherName,
        room: editState.room,
        applyToAllWeeks: editState.applyToAllWeeks,
      },
      { onSuccess: closeModal }
    );
  };

  const handleAddExamSave = (payload: Omit<ExamEntry, "id" | "notifyStatus">) => {
    addExam(payload, {
      onSuccess: () => {
        setAddExamOpen(false);
      },
    });
  };

  if (isLoading || !data) {
    return (
      <div className="p-6 text-sm text-gray-400 animate-pulse">Loading timetable…</div>
    );
  }

  const { classTabs, classTimetable, examTimetable } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ── Page header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            The Academic Curator / <span className="text-indigo-600 font-semibold">Timetable</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-sm text-gray-400 mt-0.5">{classTimetable.academicYear} Academic Year</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
         
          <button
            onClick={() => printTimetable(selectedClassId)}
            disabled={isPrinting}
            className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            🖨️ {isPrinting ? "Printing…" : "Print Timetable"}
          </button>
            <button
            onClick={() => openModal(selectedClassId, "MON", 1, subjects[0]?.value ?? "", teachers[0]?.value ?? "")}
            className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ✏️ Edit Period
          </button>
          <button
            onClick={() => setAddExamOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            + Add Exam Schedule
          </button>
        </div>
      </div>

      {/* ── Class tabs ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 mb-5">
        <ClassTabs
          tabs={classTabs}
          selectedId={selectedClassId}
          onSelect={setSelectedClassId}
        />
      </div>

      {/* ── Weekly timetable ───────────────────────────────────────────────────── */}
      <div className="mb-5">
        <WeeklyTimetableGrid
          timetable={classTimetable}
          onEditCell={handleEditCell}
        />
      </div>

      {/* ── Exam timetable ─────────────────────────────────────────────────────── */}
      <ExamTimetableTable
        exam={examTimetable}
        onAddExam={() => setAddExamOpen(true)}
        onEditExam={(entry) => console.log("Edit exam", entry)}
        onDeleteExam={(id) => deleteExam(id)}
        onToggleNotify={(enabled) => toggleNotify(enabled)}
        onResendNotification={() => resendNotification()}
      />

      <AddExamModal
        open={addExamOpen}
        classOptions={classTabs}
        defaultClass={classTimetable.classLabel}
        isSaving={isAddingExam}
        onClose={() => setAddExamOpen(false)}
        onSave={handleAddExamSave}
      />

      {/* ── Edit Period Modal ──────────────────────────────────────────────────── */}
      <EditPeriodModal
        state={editState}
        subjects={subjects}
        teachers={teachers}
        isSaving={isSaving}
        onClose={closeModal}
        onSave={handleSavePeriod}
        onFieldChange={setField}
      />
    </div>
  );
};

export default TimetablePage;