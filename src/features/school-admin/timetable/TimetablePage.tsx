import { useState, useCallback } from "react";
import WeeklyTimetableGrid from "./components/Weeklytimetablegrid";
import ExamScheduleTable from "./components/Examscheduletable";
import EditPeriodModal from "./components/Editperiodmodal";
import AddExamModal from "./components/Addexammodal";
import {
  ErrorBanner,
  EmptyState,
  Toast,
  TimetableErrorBoundary,
  type ToastType,
} from "./components/Timetableerrorstates";
import {
  useTimetable,
  useExamSchedule,
  useTeachers,
  useSubjects,
  useTimetableMutations,
} from "./hooks/useTimetable";
import type { DayOfWeek, PeriodRow, ExamScheduleEntry } from "./types/timetable.types";

// ─── Class tabs (matching the screenshots) ───────────────────────────────────
const CLASS_TABS = [
  { id: "6A", label: "Class 6" },
  { id: "7A", label: "Class 7" },
  { id: "8A", label: "Class 8" },
  { id: "9A", label: "Class 9" },
  { id: "10A", label: "Class 10" },
];

interface Toast {
  type: ToastType;
  message: string;
}

const TimetablePage = () => {
  const [activeClass, setActiveClass] = useState("10A");
  const [notifyParents, setNotifyParents] = useState(true);

  // Edit Period Modal state
  const [editModal, setEditModal] = useState<{
    open: boolean;
    period: PeriodRow | null;
    day: DayOfWeek | null;
  }>({ open: false, period: null, day: null });

  // Add Exam Modal state
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamScheduleEntry | null>(null);

  // Toast state
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Data fetching
  const {
    data: timetable,
    isLoading: timetableLoading,
    error: timetableError,
    refetch: refetchTimetable,
  } = useTimetable(activeClass);

  const {
    data: exams,
    isLoading: examsLoading,
    error: examsError,
    refetch: refetchExams,
  } = useExamSchedule(activeClass);

  const { data: teachers = [] } = useTeachers();
  const { data: subjects = [] } = useSubjects();

  const { updatePeriod, addExam, updateExam, deleteExam, resendNotification } =
    useTimetableMutations(activeClass);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleCellClick = (period: PeriodRow, day: DayOfWeek) => {
    setEditModal({ open: true, period, day });
  };

  const handleSavePeriod = async (payload: {
    subject: string;
    teacherId: string;
    room: string;
    applyToAllWeeks: boolean;
  }) => {
    if (!editModal.period || !editModal.day) return;
    try {
      await updatePeriod.mutateAsync({
        classId: activeClass,
        periodNumber: editModal.period.periodNumber,
        day: editModal.day,
        ...payload,
      });
      setEditModal({ open: false, period: null, day: null });
      showToast("success", "Period updated successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update period.";
      showToast("error", msg);
    }
  };

  const handleAddExam = async (payload: Parameters<typeof addExam.mutateAsync>[0]) => {
    try {
      if (editingExam) {
        await updateExam.mutateAsync({ id: editingExam.id, payload });
      } else {
        await addExam.mutateAsync(payload);
      }
      setExamModalOpen(false);
      setEditingExam(null);
      showToast("success", editingExam ? "Exam updated successfully." : "Exam added successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to ${editingExam ? 'update' : 'add'} exam.`;
      showToast("error", msg);
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!window.confirm("Delete this exam? This cannot be undone.")) return;
    try {
      await deleteExam.mutateAsync(id);
      showToast("success", "Exam deleted.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete exam.";
      showToast("error", msg);
    }
  };

  const handleResendNotification = async () => {
    try {
      const result = await resendNotification.mutateAsync();
      showToast("success", `Notification resent to ${result.sentTo} parents.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend notification.";
      showToast("error", msg);
    }
  };

  // ─── Derived values for EditPeriodModal ────────────────────────────────────
  const currentCell =
    editModal.period && editModal.day
      ? editModal.period.days[editModal.day]
      : null;

  const periodLabel = editModal.period
    ? `Period ${editModal.period.periodNumber} (${editModal.period.startTime}–${editModal.period.endTime})`
    : "";

  const timeSlot = editModal.period
    ? `${editModal.period.startTime} – ${editModal.period.endTime}`
    : "";

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <TimetableErrorBoundary onReset={refetchTimetable}>
      <div className="flex flex-col gap-6 min-h-full">
        {/* Breadcrumb */}
        <nav className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
          <span>Academic Curator</span>
          <span className="mx-2">›</span>
          <span className="text-indigo-600">Timetable</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Timetable
            </h1>
            <p className="text-sm text-gray-500 mt-1">2024-25 Academic Year</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Period
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Timetable
            </button>
            <button
              onClick={() => setExamModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="6.5" y1="1" x2="6.5" y2="12" /><line x1="1" y1="6.5" x2="12" y2="6.5" />
              </svg>
              Add Exam Schedule
            </button>
          </div>
        </div>

        {/* Class Tabs */}
        <div className="flex gap-0 border-b border-gray-200">
          {CLASS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveClass(tab.id)}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeClass === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timetable Error */}
        {timetableError && (
          <ErrorBanner
            message={
              timetableError instanceof Error
                ? timetableError.message
                : "Failed to load timetable. Please try again."
            }
            onRetry={refetchTimetable}
          />
        )}

        {/* Weekly Timetable Grid */}
     {/* Weekly Timetable Grid */}
{!timetableError && (
  <>
    {timetable && !timetableLoading && (timetable.periods?.length ?? 0) === 0 ? (
      <EmptyState
        title="No timetable configured"
        description={`Class ${activeClass} doesn't have a weekly schedule yet. Start by adding periods.`}
        actionLabel="Edit Period"
      />
    ) : (
      <WeeklyTimetableGrid
        timetable={
                  timetable ?? {
                    classId: activeClass,
                    className: activeClass,
                    classTeacher: "",
                    periods: [],
                    breaks: [],
                  }
                }
                isLoading={timetableLoading}
                onCellClick={handleCellClick}
              />
            )}
          </>
        )}

        {/* Exam Schedule Error */}
        {examsError && (
          <ErrorBanner
            message={
              examsError instanceof Error
                ? examsError.message
                : "Failed to load exam schedule. Please try again."
            }
            onRetry={refetchExams}
          />
        )}

        {/* Exam Schedule Table */}
        {!examsError && (
          <ExamScheduleTable
            exams={exams ?? []}
            isLoading={examsLoading}
            notifyParents={notifyParents}
            onToggleNotify={setNotifyParents}
            onAddExam={() => setExamModalOpen(true)}
            onEditExam={(exam) => {
              setEditingExam(exam);
              setExamModalOpen(true);
            }}
            onDeleteExam={handleDeleteExam}
            onResendNotification={handleResendNotification}
            isResending={resendNotification.isPending}
            lastNotifiedText="Exam schedule WhatsApp sent to 66 Class 10 parents on 5 April 2025 ✓"
          />
        )}

        {/* Edit Period Modal */}
        <EditPeriodModal
          open={editModal.open}
          onClose={() => setEditModal({ open: false, period: null, day: null })}
          onSave={handleSavePeriod}
          isSaving={updatePeriod.isPending}
          classId={activeClass}
          className={activeClass}
          day={editModal.day ?? "MON"}
          periodNumber={editModal.period?.periodNumber ?? 1}
          periodLabel={periodLabel}
          timeSlot={timeSlot}
          defaultSubject={currentCell?.subject ?? ""}
          defaultTeacherName={currentCell?.teacher ?? ""}
          defaultRoom={currentCell?.room ?? `Room ${activeClass}`}
          teachers={teachers}
          subjects={subjects}
        />

        {/* Add / Edit Exam Modal */}
        <AddExamModal
          open={examModalOpen}
          onClose={() => {
            setExamModalOpen(false);
            setEditingExam(null);
          }}
          onSave={handleAddExam}
          isSaving={addExam.isPending || updateExam.isPending}
          classId={activeClass}
          className={activeClass}
        />

        {/* Toast */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onDismiss={() => setToast(null)}
          />
        )}
      </div>
    </TimetableErrorBoundary>
  );
};

export default TimetablePage;
