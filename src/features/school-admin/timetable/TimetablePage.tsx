import React, { useCallback, useState } from "react";
import {
  useTimetablePage,
  useExamTimetable,
  useSubjectOptions,
  useTeacherOptions,
  useSavePeriod,
  useCreateTimetable,
  useCreateExamTimetable,
  useAddExam,
  useDeleteExam,
  useEditPeriodState,
} from "./hooks/useTimetable";
import type { DayOfWeek, ExamEntry, ExamTimetable, CreateTimetablePayload, CreateExamTimetablePayload } from "./types/";
import { mockClass10Timetable } from "./store";
import ClassTabs from "./components/Classtabs";
import WeeklyTimetableGrid from "./components/Weeklytimetablegrid";
import ExamTimetableTable from "./components/Examtimetabletable";
import AddExamModal from "./components/Addexammodal";
import EditPeriodModal from "./components/Editperiodmodal";
import AddPeriodModal from "./components/Addperiodmodal";
import AddExamTimetableModal from "./components/AddExamtimetablemodal";

const DEFAULT_ACADEMIC_YEAR = String(new Date().getFullYear());

const TimetablePage: React.FC = () => {
  const [activeClass, setActiveClass] = useState({ className: "10", sectionName: "A" });
  const selectedClassId = `class-${activeClass.className}`;

  // ── Data ──────────────────────────────────────────────────────────────────────
  const { data, isLoading } = useTimetablePage(activeClass.className, activeClass.sectionName, DEFAULT_ACADEMIC_YEAR);
  const { data: examTtData, isLoading: examLoading, error: examError, refetch: examRefetch } = useExamTimetable();
  const { data: subjects = [] } = useSubjectOptions();
  const { data: teachers = [] } = useTeacherOptions();

  // ── Mutations ─────────────────────────────────────────────────────────────────
  const { mutate: savePeriod, isPending: isSaving } = useSavePeriod();
  const { mutate: createTimetable, isPending: isCreatingTimetable } = useCreateTimetable();
  const { mutate: createExamTimetable, isPending: isCreatingExamTimetable } = useCreateExamTimetable();
  const { mutate: addExam, isPending: isAddingExam } = useAddExam();
  const { mutate: deleteExam } = useDeleteExam();
  const [addExamOpen, setAddExamOpen] = useState(false);
  const [addPeriodOpen, setAddPeriodOpen] = useState(false);
  const [addExamTimetableOpen, setAddExamTimetableOpen] = useState(false);

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

  const handleCreatePeriod = (payload: CreateTimetablePayload) => {
    createTimetable(payload, {
      onSuccess: () => {
        setAddPeriodOpen(false);
      },
    });
  };

  const handleCreateExamTimetable = (payload: CreateExamTimetablePayload) => {
    createExamTimetable(payload, {
      onSuccess: () => {
        setAddExamTimetableOpen(false);
      },
    });
  };

  const handleTabSelect = (tabId: string) => {
    const className = tabId.replace("class-", "");
    setActiveClass({ className, sectionName: "A" });
  };

  if (isLoading || !data) {
    return (
      <div className="p-6 text-sm text-gray-400 animate-pulse">Loading timetable…</div>
    );
  }

  const { classTabs = [], classTimetable = mockClass10Timetable } = data ?? {};
  const safeExamTt: ExamTimetable = examTtData ?? { title: "Exam Timetable", subtitle: "Final Assessment Schedule", notifyParentsEnabled: true, entries: [] };
  const handleRetryExam = useCallback(() => { examRefetch(); }, [examRefetch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ── Page header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            The Academic Curator / <span className="text-indigo-600 font-semibold">Timetable</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-sm text-gray-400 mt-0.5">{classTimetable?.academicYear ?? DEFAULT_ACADEMIC_YEAR} Academic Year</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAddPeriodOpen(true)}
            className="flex items-center gap-1.5 border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            + Add Period
          </button>
          <button
            onClick={() => setAddExamTimetableOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            + Add Exam Timetable
          </button>
        </div>
      </div>

      {/* ── Class tabs ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 mb-5">
        <ClassTabs
          tabs={classTabs}
          selectedId={selectedClassId}
          onSelect={handleTabSelect}
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
        exam={safeExamTt}
        loading={examLoading}
        error={examError ? (examError as Error).message : null}
        onRetry={handleRetryExam}
        onAddExam={() => setAddExamOpen(true)}
        onEditExam={(entry) => console.log("Edit exam", entry)}
        onDeleteExam={(id) => deleteExam(id)}
      />

      <AddPeriodModal
        open={addPeriodOpen}
        isSaving={isCreatingTimetable}
        subjects={subjects}
        teachers={teachers}
        onClose={() => setAddPeriodOpen(false)}
        onSave={handleCreatePeriod}
      />

      <AddExamTimetableModal
        open={addExamTimetableOpen}
        isSaving={isCreatingExamTimetable}
        onClose={() => setAddExamTimetableOpen(false)}
        onSave={handleCreateExamTimetable}
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