import React, { useCallback, useEffect, useState } from "react";
import { Pencil, Printer, CalendarPlus, Plus, Pencil as PencilIcon, Trash2, X, Loader2, BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ── Timetable hooks ──────────────────────────────────────────────────────────
import {
  useTimetablePage,
  useClassList,
  useSectionsByClass,
  useExamTimetable,
  useCreateTimetable,
  useCreateExamTimetable,
  useUpdateExamTimetable,
  useAddExam,
  useDeleteExam,
} from "./hooks/useTimetable";

// ── Exam Manager hooks ───────────────────────────────────────────────────────
import { useExams, useCreateExam, useUpdateExam, useDeleteExam as useDeleteExamRecord } from "./hooks/useExam";

// ── Types ────────────────────────────────────────────────────────────────────
import type {
  ExamEntry,
  ExamTimetable,
  CreateTimetablePayload,
  CreateExamTimetablePayload,
} from "./types/timetable.types";
import type { ExamRecord } from "@/services/exam.api";

// ── Components ───────────────────────────────────────────────────────────────
import ClassTabs from "./components/Classtabs";
import WeeklyTimetableGrid from "./components/Weeklytimetablegrid";
import ExamTimetableTable from "./components/Examtimetable";
import AddExamModal from "./components/Addexammodal";
import AddPeriodModal from "./components/Addperiodmodal";
import AddExamTimetableModal from "./components/AddExamtimetablemodal";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
// Tab type
// ─────────────────────────────────────────────────────────────────────────────

type PageTab = "timetable" | "exam-timetable" | "exam-manager";

// ─────────────────────────────────────────────────────────────────────────────
// Exam Manager — modal schemas
// ─────────────────────────────────────────────────────────────────────────────

const examSchema = z.object({
  exam_name: z.string().min(1, "Exam name is required"),
  academicYearId: z.string().min(1, "Academic year is required"),
});
type ExamFormData = z.infer<typeof examSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Exam Manager — Add/Edit Modal
// ─────────────────────────────────────────────────────────────────────────────

interface ExamModalProps {
  open: boolean;
  defaultAcademicYearId: string;
  academicYearOptions: { id: string; label: string }[];
  editing: ExamRecord | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: ExamFormData) => void;
}

const ExamRecordModal: React.FC<ExamModalProps> = ({
  open, defaultAcademicYearId, academicYearOptions, editing, isSaving, onClose, onSave,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    values: editing
      ? { exam_name: editing.exam_name, academicYearId: editing.academicYearId }
      : { exam_name: "", academicYearId: defaultAcademicYearId },
  });

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">{editing ? "Edit Exam" : "Add Exam"}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {editing ? "Update the exam details below." : "Create a new exam for the academic year."}
            </p>
          </div>
          <button onClick={() => { reset(); onClose(); }} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Exam Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Quarterly Exam"
                {...register("exam_name")}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              />
              {errors.exam_name && <p className="mt-1 text-xs text-red-600">{errors.exam_name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                {...register("academicYearId")}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              >
                <option value="">Select academic year</option>
                {academicYearOptions.map((y) => (
                  <option key={y.id} value={y.id}>{y.label}</option>
                ))}
              </select>
              {errors.academicYearId && <p className="mt-1 text-xs text-red-600">{errors.academicYearId.message}</p>}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button type="button" onClick={() => { reset(); onClose(); }} className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2">
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              {isSaving ? "Saving…" : editing ? "Update Exam" : "Create Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Exam Manager — Delete Modal
// ─────────────────────────────────────────────────────────────────────────────

const DeleteExamRecordModal: React.FC<{
  exam: ExamRecord | null; isDeleting: boolean; onConfirm: () => void; onCancel: () => void;
}> = ({ exam, isDeleting, onConfirm, onCancel }) => {
  if (!exam) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
        <h3 className="text-lg font-black text-slate-900 mb-2">Delete Exam</h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">"{exam.exam_name}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2">
            {isDeleting && <Loader2 size={14} className="animate-spin" />}
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Exam Manager Tab Content
// ─────────────────────────────────────────────────────────────────────────────

const ExamManagerTab: React.FC<{
  academicYearOptions: { id: string; label: string }[];
  defaultAcademicYearId: string;
}> = ({ academicYearOptions, defaultAcademicYearId }) => {
  const { data: exams = [], isLoading, isError } = useExams();
  const { mutate: createExam, isPending: isCreating } = useCreateExam();
  const { mutate: updateExam, isPending: isUpdating } = useUpdateExam();
  const { mutate: deleteExam, isPending: isDeleting } = useDeleteExamRecord();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExamRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExamRecord | null>(null);

  const handleSave = (data: ExamFormData) => {
    if (editing) {
      updateExam({ id: editing.id, data }, { onSuccess: () => { setModalOpen(false); setEditing(null); } });
    } else {
      createExam(data, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">Exam Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">Create and manage exam names for all academic years.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus size={15} /> Add Exam
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-52 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <Loader2 size={24} className="animate-spin text-indigo-500" />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-52 rounded-2xl border border-red-100 bg-white shadow-sm">
          <p className="text-sm text-red-500">Failed to load exams. Please try again.</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-52 rounded-2xl border border-dashed border-gray-200 bg-white shadow-sm gap-3">
          <BookOpen size={32} className="text-gray-300" />
          <p className="text-sm text-gray-400">No exams found. Add your first exam.</p>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            <Plus size={14} /> Add Exam
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["#", "Exam Name", "Academic Year", "Created", "Actions"].map((h, i) => (
                  <th key={h} className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-500 ${i === 4 ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {exams.map((exam, idx) => (
                <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-400 font-medium">{idx + 1}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{exam.exam_name}</td>
                  <td className="px-5 py-4 text-gray-600 text-sm">{exam.academicYear?.yearName ?? academicYearOptions.find(y => y.id === exam.academicYearId)?.label ?? exam.academicYearId}</td>
                  <td className="px-5 py-4 text-gray-400">
                    {new Date(exam.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditing(exam); setModalOpen(true); }}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                      >
                        <PencilIcon size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(exam)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ExamRecordModal
        open={modalOpen}
        defaultAcademicYearId={defaultAcademicYearId}
        academicYearOptions={academicYearOptions}
        editing={editing}
        isSaving={isCreating || isUpdating}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
      />
      <DeleteExamRecordModal
        exam={deleteTarget}
        isDeleting={isDeleting}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteExam(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Combined Page
// ─────────────────────────────────────────────────────────────────────────────

const TimetablePage: React.FC = () => {
  const { activeYear, years } = useAcademicYears();
  const academicYearId = activeYear?.id ?? String(new Date().getFullYear());
  const academicYearOptions = (years ?? []).map((y: any) => ({
    id: y.id,
    label: y.yearName ?? y.year ?? y.name ?? y.academic_year ?? y.id,
  }));

  const [activeTab, setActiveTab] = useState<PageTab>("timetable");
  // Store selected class and section as { id: UUID, label: string }
  const [activeClass,   setActiveClass]   = useState({ id: "", label: "" });
  const [activeSection, setActiveSection] = useState({ id: "", label: "" });
  const [classInitialised,   setClassInitialised]   = useState(false);
  const [sectionInitialised, setSectionInitialised] = useState(false);

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data: classTabsData,   isLoading: classTabsLoading }  = useClassList();
  const { data: sectionTabsData, isLoading: sectionTabsLoading } = useSectionsByClass(activeClass.id);
  const { data, isLoading } = useTimetablePage(
    activeClass.id, activeClass.label,
    activeSection.id, activeSection.label,
    academicYearId,
  );
  const { data: examTtData, isLoading: examLoading, error: examError, refetch: examRefetch } = useExamTimetable();

  // Auto-select first class on load
  useEffect(() => {
    const tabs = classTabsData ?? [];
    if (!classInitialised && tabs.length > 0) {
      setActiveClass({ id: tabs[0].id, label: tabs[0].label });
      setClassInitialised(true);
      setSectionInitialised(false); // reset so section auto-selects for new class
    }
  }, [classTabsData, classInitialised]);

  // Auto-select first section when class changes or sections load
  useEffect(() => {
    const sections = sectionTabsData ?? [];
    if (!sectionInitialised && sections.length > 0) {
      setActiveSection({ id: sections[0].id, label: sections[0].label });
      setSectionInitialised(true);
    }
  }, [sectionTabsData, sectionInitialised]);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const { mutate: createTimetable, isPending: isCreatingTimetable } = useCreateTimetable();
  const { mutate: createExamTimetable, isPending: isCreatingExamTimetable } = useCreateExamTimetable();
  const { mutate: updateExamTimetable, isPending: isUpdatingExamTimetable } = useUpdateExamTimetable();
  const { mutate: addExam, isPending: isAddingExam } = useAddExam();
  const { mutate: deleteExam } = useDeleteExam();

  const [addExamOpen, setAddExamOpen] = useState(false);
  const [addPeriodOpen, setAddPeriodOpen] = useState(false);
  const [addExamTimetableOpen, setAddExamTimetableOpen] = useState(false);
  const [editExamEntry, setEditExamEntry] = useState<ExamEntry | null>(null);
  const [deleteExamTarget, setDeleteExamTarget] = useState<ExamEntry | null>(null);

  const { classTabs = [], classTimetable } = data ?? {};
  const safeExamTt: ExamTimetable = examTtData ?? {
    title: "Exam Timetable", subtitle: "Scheduled Examinations", notifyParentsEnabled: true, entries: [],
  };
  const handleRetryExam = useCallback(() => examRefetch(), [examRefetch]);
  const headingClass   = classTimetable?.classLabel ?? activeClass.label;
  const headingSection = classTimetable?.section    ?? activeSection.label;
  const selectedClassId = activeClass.id;

  // ── Tab definitions ──────────────────────────────────────────────────────────
  const tabs: { id: PageTab; label: string }[] = [
    { id: "timetable",       label: "Timetable" },
    { id: "exam-timetable",  label: "Exam Timetable" },
    { id: "exam-manager",    label: "Exam Manager" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          Academic Curator <span className="mx-1 text-gray-300">/</span>
          <span className="text-indigo-600 font-semibold">
            {activeTab === "timetable" ? "Timetable" : activeTab === "exam-timetable" ? "Exam Timetable" : "Exam Manager"}
          </span>
        </p>

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Timetable</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {academicYearOptions.find(y => y.id === academicYearId)?.label ?? new Date().getFullYear()} Academic Year
            </p>
          </div>

          {/* Action buttons — only on timetable tab */}
          {activeTab === "timetable" && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setAddPeriodOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                <Pencil size={14} /> Edit Period
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                <Printer size={14} /> Print Timetable
              </button>
              <button
                onClick={() => setAddExamTimetableOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <CalendarPlus size={14} /> Add Exam Schedule
              </button>
            </div>
          )}
        </div>

        {/* ── Top-level page tabs ─────────────────────────────────────────────── */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === t.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Timetable tab ───────────────────────────────────────────────────── */}
        {activeTab === "timetable" && (
          <>
            {/* Class tabs */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-3 overflow-hidden">
              {classTabsLoading ? (
                <div className="flex gap-1 p-3 overflow-x-auto">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="h-9 w-24 rounded-lg bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : (
                <ClassTabs
                  tabs={classTabsData ?? classTabs}
                  selectedId={selectedClassId}
                  onSelect={(tabId) => {
                    const tab = (classTabsData ?? classTabs).find((t) => t.id === tabId);
                    setActiveClass({ id: tabId, label: tab?.label ?? tabId });
                    setActiveSection({ id: "", label: "" }); // reset — sections will auto-select
                    setSectionInitialised(false);
                  }}
                />
              )}
            </div>

            {/* Section sub-tabs */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
              {sectionTabsLoading ? (
                <div className="flex gap-1 p-3 overflow-x-auto">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-8 w-16 rounded-lg bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : (sectionTabsData ?? []).length === 0 ? null : (
                <div className="flex overflow-x-auto border-b border-gray-100 px-2">
                  {(sectionTabsData ?? []).map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSection({ id: sec.id, label: sec.label })}
                      className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                        activeSection.id === sec.id
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Section {sec.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly grid */}
            <div className="mb-5">
              {isLoading ? (
                <div className="flex items-center justify-center h-52 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Loading timetable…
                  </div>
                </div>
              ) : !activeSection.id ? (
                <div className="flex flex-col items-center justify-center h-52 rounded-2xl border border-dashed border-gray-200 bg-white shadow-sm gap-2">
                  <p className="text-sm text-gray-400">Select a section to view the timetable.</p>
                </div>
              ) : !classTimetable || classTimetable.slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-52 rounded-2xl border border-dashed border-gray-200 bg-white shadow-sm gap-3">
                  <p className="text-sm text-gray-400">No timetable found for {headingClass} – {headingSection}.</p>
                  <button
                    onClick={() => setAddPeriodOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                  >
                    + Add the first period
                  </button>
                </div>
              ) : (
                <WeeklyTimetableGrid timetable={classTimetable} onEditCell={() => setAddPeriodOpen(true)} />
              )}
            </div>
          </>
        )}

        {/* ── Exam Timetable tab ──────────────────────────────────────────────── */}
        {activeTab === "exam-timetable" && (
          <ExamTimetableTable
            exam={safeExamTt}
            loading={examLoading}
            error={examError ? (examError as Error).message : null}
            onRetry={handleRetryExam}
            onAddExamTimetable={() => setAddExamTimetableOpen(true)}
            onEditExam={(entry) => { setEditExamEntry(entry); setAddExamTimetableOpen(true); }}
            onDeleteExam={(id) => { const entry = safeExamTt.entries.find(e => e.id === id); if (entry) setDeleteExamTarget(entry); }}
          />
        )}

        {/* ── Exam Manager tab ────────────────────────────────────────────────── */}
        {activeTab === "exam-manager" && (
          <ExamManagerTab
            academicYearOptions={academicYearOptions}
            defaultAcademicYearId={activeYear?.id ?? ""}
          />
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      <AddPeriodModal
        open={addPeriodOpen}
        isSaving={isCreatingTimetable}
        onClose={() => setAddPeriodOpen(false)}
        onSave={(payload: CreateTimetablePayload) =>
          createTimetable(payload, { onSuccess: () => setAddPeriodOpen(false) })
        }
      />
      <AddExamTimetableModal
        open={addExamTimetableOpen}
        isSaving={isCreatingExamTimetable || isUpdatingExamTimetable}
        editData={editExamEntry}
        onClose={() => { setAddExamTimetableOpen(false); setEditExamEntry(null); }}
        onSave={(payload: CreateExamTimetablePayload) => {
          if (editExamEntry) {
            updateExamTimetable(
              { id: editExamEntry.id, data: payload },
              { onSuccess: () => { setAddExamTimetableOpen(false); setEditExamEntry(null); } }
            );
          } else {
            createExamTimetable(payload, { onSuccess: () => setAddExamTimetableOpen(false) });
          }
        }}
      />
      <AddExamModal
        open={addExamOpen}
        classOptions={classTabs}
        defaultClass={classTimetable?.classLabel ?? ""}
        isSaving={isAddingExam}
        onClose={() => setAddExamOpen(false)}
        onSave={(payload: Omit<ExamEntry, "id" | "notifyStatus">) =>
          addExam(payload, { onSuccess: () => setAddExamOpen(false) })
        }
      />

      {/* ── Delete Exam Timetable Confirm Modal ─────────────────────────────── */}
      {(() => {
        const target = deleteExamTarget;
        if (!target) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
              <h3 className="text-lg font-black text-slate-900 mb-2">Delete Exam Timetable</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete the{" "}
                <span className="font-semibold text-slate-700">
                  {target.subject} ({target.className})
                </span>{" "}
                exam on <span className="font-semibold text-slate-700">{target.date}</span>? This cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteExamTarget(null)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteExam(target.id, { onSuccess: () => setDeleteExamTarget(null) })}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition flex items-center gap-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default TimetablePage;