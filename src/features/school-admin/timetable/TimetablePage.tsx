import React, { useEffect, useState } from "react";
import { Download, Plus, Pencil as PencilIcon, Trash2, X, Loader2, BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// ── Timetable hooks ──────────────────────────────────────────────────────────
import {
  useTimetablePage,
  useClassList,
  useSectionsByClass,
  useTodayExamTimetable,
  useExamTimetableByClassSection,
  useBulkCreateTimetable,
  useBulkCreateExamTimetable,
  useUpdateExamTimetable,
  useDeleteExam,
  useDeleteTimetable,
} from "./hooks/useTimetable";

// ── Exam Manager hooks ───────────────────────────────────────────────────────
import { useExams, useCreateExam, useUpdateExam, useDeleteExam as useDeleteExamRecord } from "./hooks/useExam";

// ── Types ────────────────────────────────────────────────────────────────────
import { downloadClassTimetable, type BulkCreateTimetablePayload } from "@/services/timetable.api";
import type {
  ExamEntry,
  DayOfWeek,
} from "./types/timetable.types";
import type { ExamRecord } from "@/services/exam.api";

// ── Components ───────────────────────────────────────────────────────────────
import WeeklyTimetableGrid from "./components/Weeklytimetablegrid";
import AddPeriodModal from "./components/Addperiodmodal";
import AddExamTimetableModal from "./components/AddExamtimetablemodal";
import FreeTeachersPanel from "./components/FreeTeachersPanel";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { fetchAllWorkingDays } from "@/services/working-days.api";
import type { WorkingDayRecord } from "@/services/working-days.api";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
// Tab type
// ─────────────────────────────────────────────────────────────────────────────

type PageTab    = "timetable" | "exam";
type ExamSubTab = "create-exam" | "exam-timetable";

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
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
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
// Exam Timetable Filtered Tab
// ─────────────────────────────────────────────────────────────────────────────

const ExamTimetableFilteredTab: React.FC<{
  onAddExamTimetable: () => void;
  onEditExam: (entry: ExamEntry) => void;
  onDeleteExam: (id: string) => void;
}> = ({ onAddExamTimetable, onEditExam, onDeleteExam: _onDeleteExam }) => {
  const [filterClassId,    setFilterClassId]    = useState("");
  const [filterSectionId,  setFilterSectionId]  = useState("");
  const [classInit,        setClassInit]        = useState(false);
  const [sectionInit,      setSectionInit]      = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const { mutate: deleteExamTt } = useDeleteExam();

  const { data: classList = [],   isLoading: classLoading }   = useClassList();
  const { data: sectionList = [], isLoading: sectionLoading } = useSectionsByClass(filterClassId);

  const hasClassSection = !!filterClassId && !!filterSectionId;

  // When class+section selected → filtered API; else → today's exams
  const {
    data: filteredData = [], isLoading: filteredLoading, isError: filteredError, refetch: refetchFiltered,
  } = useExamTimetableByClassSection(filterClassId, filterSectionId);

  const {
    data: todayData, isLoading: todayLoading, isError: todayError, refetch: refetchToday,
  } = useTodayExamTimetable(today);

  const isLoading = hasClassSection ? filteredLoading : todayLoading;
  const isError   = hasClassSection ? filteredError   : todayError;
  const refetch   = hasClassSection ? refetchFiltered : refetchToday;

  // Auto-select first class
  useEffect(() => {
    if (!classInit && classList.length > 0) {
      setClassInit(true);
    }
  }, [classList, classInit]);

  // Auto-select first section when class changes
  useEffect(() => {
    if (!sectionInit && filterClassId && sectionList.length > 0) {
      setSectionInit(true);
    }
  }, [sectionList, sectionInit, filterClassId]);

  type DisplayRow = {
    id: string; subject: string; exam_name: string; exam_date: string;
    start_time: string; end_time: string; room_no: string; syllabus: string;
    teacher_name: string; teacher_id: string;
    section_id: string; subject_id: string; exam_id: string;
    class_id: string; section_name: string; class_name: string;
  };

  const rows: DisplayRow[] = hasClassSection
    ? filteredData.map((r) => ({
        id: r.id,
        subject: r.subject?.subject_name ?? "—",
        exam_name: r.exam?.exam_name ?? "—",
        exam_date: r.exam_date,
        start_time: r.start_time,
        end_time: r.end_time,
        room_no: r.room_no ?? "",
        syllabus: r.syllabus ?? "",
        teacher_name: r.teacher?.name ?? "",
        teacher_id: r.teacher?.id ?? "",
        section_id: r.section?.id ?? "",
        subject_id: r.subject?.id ?? "",
        exam_id: r.exam?.id ?? "",
        class_id: r.class?.id ?? "",
        class_name: r.class?.class_name ?? "",
        section_name: r.section?.sectionName ?? "",
      }))
    : (todayData?.data ?? []).flatMap((cls) =>
        cls.exams.map((e) => ({
          id: e.id,
          subject: e.subject_name ?? "—",
          exam_name: e.exam_name ?? "—",
          exam_date: e.exam_date,
          start_time: e.start_time,
          end_time: e.end_time,
          room_no: e.room_no ?? "",
          syllabus: e.syllabus ?? "",
          teacher_name: e.teacher_name ?? "",
          teacher_id: e.teacher_id ?? "",
          section_id: e.section_id,
          subject_id: e.subject_id,
          exam_id: e.exam_id,
          class_id: cls.class_id,
          class_name: cls.class_name,
          section_name: e.section_name,
        }))
      );

  const fmt = (t: string) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hh = parseInt(h, 10);
    return `${hh % 12 || 12}:${m} ${hh >= 12 ? "PM" : "AM"}`;
  };
  const fmtDate = (d: string) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="flex flex-col gap-5">

      {/* Filter bar — Class + Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          {/* Class */}
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Class</label>
            {classLoading ? (
              <div className="h-10 w-full rounded-xl bg-gray-100 animate-pulse" />
            ) : (
              <select
                value={filterClassId}
                onChange={(e) => {
                  setFilterClassId(e.target.value);
                  setFilterSectionId("");
                  setSectionInit(false);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              >
                <option value="">All Classes</option>
                {classList.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* Section */}
          <div className="flex flex-col gap-1 min-w-[120px]">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Section</label>
            {sectionLoading ? (
              <div className="h-10 w-full rounded-xl bg-gray-100 animate-pulse" />
            ) : (
              <select
                value={filterSectionId}
                onChange={(e) => setFilterSectionId(e.target.value)}
                disabled={!filterClassId}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 disabled:opacity-50"
              >
                <option value="">All Sections</option>
                {sectionList.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* label showing mode */}
          <div className="flex items-end pb-0.5">
            <span className="text-[10px] text-gray-400 italic">
              {hasClassSection ? "Showing all exams for selected class/section" : `Showing today's exams · ${fmtDate(today)}`}
            </span>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={onAddExamTimetable}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              <Plus size={14} /> Add Exam Timetable
            </button>
          </div>
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-sm text-gray-400">
            <Loader2 size={18} className="animate-spin text-indigo-500" /> Loading…
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-red-500">Failed to load exam timetable.</p>
            <button onClick={() => refetch()} className="text-xs text-indigo-500 underline">Try again</button>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <BookOpen size={28} className="text-gray-200" />
            <p className="text-sm text-gray-400">
              {hasClassSection ? "No exam entries found for this class and section." : `No exams scheduled for today (${fmtDate(today)}).`}
            </p>
            <button
              onClick={onAddExamTimetable}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              <Plus size={13} /> Add Entry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
            <table className="w-full text-sm" style={{ minWidth: 760 }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["#", "Class / Sec", "Subject", "Exam", "Date", "Time", "Room", "Syllabus", "Invigilator", "Actions"].map((h, i) => (
                    <th key={h} className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 ${i === 9 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row, idx) => {
                  const entry: ExamEntry = {
                    id: row.id,
                    subject: row.subject,
                    className: `${row.class_name} ${row.section_name}`.trim(),
                    date: row.exam_date,
                    startTime: row.start_time,
                    endTime: row.end_time,
                    venue: row.room_no,
                    syllabus: row.syllabus,
                    notifyStatus: "PENDING" as const,
                    teacher_id: row.teacher_id,
                    section_id: row.section_id,
                    class_id: row.class_id,
                    subject_id: row.subject_id,
                    examnameid: row.exam_id,
                    academicYearId: "",
                  };
                  return (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                        {row.class_name}<span className="text-indigo-600">{row.section_name}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.subject}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{row.exam_name}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(row.exam_date)}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmt(row.start_time)} – {fmt(row.end_time)}</td>
                      <td className="px-4 py-3 text-gray-600">{row.room_no || "—"}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px]">
                        <span className="line-clamp-2" title={row.syllabus || undefined}>
                          {row.syllabus || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {row.teacher_name ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
                            {row.teacher_name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditExam(entry)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                          >
                            <PencilIcon size={11} /> Edit
                          </button>
                          <button
                            onClick={() => deleteExamTt(row.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
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

  const [activeTab,        setActiveTab]        = useState<PageTab>("timetable");
  const [activeExamSubTab, setActiveExamSubTab] = useState<ExamSubTab>("create-exam");
  // Store selected class and section as { id: UUID, label: string }
  const [activeClass,   setActiveClass]   = useState({ id: "", label: "" });
  const [activeSection, setActiveSection] = useState({ id: "", label: "" });
  const [classInitialised,   setClassInitialised]   = useState(false);
  const [sectionInitialised, setSectionInitialised] = useState(false);
  const [workingDays, setWorkingDays] = useState<WorkingDayRecord[]>([]);

  useEffect(() => {
    fetchAllWorkingDays().then(setWorkingDays).catch(() => {});
  }, []);

  const activeWD = workingDays.find((wd) => wd.academicYearId === academicYearId);
  const activeWDSelectedDays = activeWD?.selected_days;

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data: classTabsData,   isLoading: classTabsLoading }  = useClassList();
  const { data: sectionTabsData, isLoading: sectionTabsLoading } = useSectionsByClass(activeClass.id);
  const { data, isLoading } = useTimetablePage(
    activeClass.id, activeClass.label,
    activeSection.id, activeSection.label,
    academicYearId,
  );
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
  const { mutate: bulkCreateTimetable, isPending: isCreatingTimetable } = useBulkCreateTimetable();
  const { mutateAsync: bulkCreateExamTimetable, isPending: isCreatingExamTimetable } = useBulkCreateExamTimetable();
  const { mutateAsync: updateExamTimetable, isPending: isUpdatingExamTimetable } = useUpdateExamTimetable();
  const { mutate: deleteExam } = useDeleteExam();
  const { mutate: deleteTimetable, isPending: isDeletingTimetable } = useDeleteTimetable();

  const [addPeriodOpen, setAddPeriodOpen] = useState(false);
  const [addExamTimetableOpen, setAddExamTimetableOpen] = useState(false);
  const [editExamEntry, setEditExamEntry] = useState<ExamEntry | null>(null);
  const [deleteExamTarget, setDeleteExamTarget] = useState<ExamEntry | null>(null);
  const [deletePeriodTarget, setDeletePeriodTarget] = useState<{
    id: string; day: DayOfWeek; periodNo: number; subject: string; teacherName: string;
  } | null>(null);
  const [downloadingTimetable, setDownloadingTimetable] = useState(false);

  const { classTabs = [], classTimetable } = data ?? {};
  const headingClass   = classTimetable?.classLabel ?? activeClass.label;
  const headingSection = classTimetable?.section    ?? activeSection.label;
  const selectedClassId = activeClass.id;

  const handleDownloadTimetable = async () => {
    if (!activeClass.id || !activeSection.id) return;
    setDownloadingTimetable(true);
    try {
      await downloadClassTimetable(activeClass.id, activeSection.id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? err?.message ?? "Failed to download timetable");
    } finally {
      setDownloadingTimetable(false);
    }
  };

  // ── Tab definitions ──────────────────────────────────────────────────────────
  const mainTabs: { id: PageTab; label: string }[] = [
    { id: "timetable", label: "Timetable"      },
    { id: "exam",      label: "Exam Timetable" },
  ];
  const examSubTabs: { id: ExamSubTab; label: string }[] = [
    { id: "create-exam",      label: "Create Exam"      },
    { id: "exam-timetable",   label: "Exam Timetable"   },
  ];

  return (
    <div className="min-h-screen ">
      <div className="px-3 sm:px-4 py-3">

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">Timetable</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {academicYearOptions.find(y => y.id === academicYearId)?.label ?? new Date().getFullYear()} Academic Year
            </p>
          </div>

          {/* Action buttons + class dropdown — only on timetable tab */}
          {activeTab === "timetable" && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Class dropdown in header */}
              {classTabsLoading ? (
                <div className="h-10 w-36 rounded-xl bg-gray-100 animate-pulse" />
              ) : (
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    const tab = (classTabsData ?? classTabs).find((t) => t.id === e.target.value);
                    setActiveClass({ id: e.target.value, label: tab?.label ?? e.target.value });
                    setActiveSection({ id: "", label: "" });
                    setSectionInitialised(false);
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 h-9 text-xs font-medium text-gray-700 shadow-sm outline-none focus:border-indigo-500"
  >
                  {(classTabsData ?? classTabs).map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              )}
              <button
                onClick={() => setAddPeriodOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 h-9 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                <Plus size={13} /> Add Period
              </button>
              <button
                onClick={handleDownloadTimetable}
                disabled={downloadingTimetable || !classTimetable?.slots.length}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 h-9 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloadingTimetable ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                {downloadingTimetable ? "Generating…" : "Download Timetable"}
              </button>
            </div>
          )}
        </div>



        {/* ── Main tabs ───────────────────────────────────────────────────────── */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex items-center">
            {mainTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`relative flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === t.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-700 hover:text-gray-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Timetable tab ───────────────────────────────────────────────────── */}
        {activeTab === "timetable" && (
          <>
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
                      className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                        activeSection.id === sec.id
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
                      }`}
                    >
                      Section {sec.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly grid + Free Teachers panel */}
            <div className="mb-5 flex gap-5 items-start flex-col xl:flex-row">
              {/* Grid */}
              <div className="flex-1 min-w-0 w-full">
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
                  <div className="bg-white">
                    <WeeklyTimetableGrid
                      timetable={classTimetable}
                      onEditCell={() => setAddPeriodOpen(true)}
                      onEditPeriod={() => setAddPeriodOpen(true)}
                      onDeletePeriod={(id, day, periodNo, subject, teacherName) =>
                        setDeletePeriodTarget({ id, day, periodNo, subject, teacherName })
                      }
                      workingDays={activeWDSelectedDays}
                    />
                  </div>
                )}
              </div>

              {/* Free Teachers panel — sidebar on xl, stacked on smaller */}
              <div className="w-full xl:w-72 xl:shrink-0">
                <FreeTeachersPanel />
              </div>
            </div>
          </>
        )}

        {/* ── Exam Timetable main tab ─────────────────────────────────────────── */}
        {activeTab === "exam" && (
          <>
            {/* Sub-tabs */}
            <div className="flex gap-0 border-b border-gray-200 mb-6">
              {examSubTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveExamSubTab(t.id)}
                  className={`px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                    activeExamSubTab === t.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Create Exam sub-tab */}
            {activeExamSubTab === "create-exam" && (
              <ExamManagerTab
                academicYearOptions={academicYearOptions}
                defaultAcademicYearId={activeYear?.id ?? ""}
              />
            )}

            {/* Exam Timetable sub-tab */}
            {activeExamSubTab === "exam-timetable" && (
              <ExamTimetableFilteredTab
                onAddExamTimetable={() => setAddExamTimetableOpen(true)}
                onEditExam={(entry) => { setEditExamEntry(entry); setAddExamTimetableOpen(true); }}
                onDeleteExam={(id) => {
                  setDeleteExamTarget({ id, subject: "", className: "", date: "", startTime: "", endTime: "", venue: "", notifyStatus: "PENDING" });
                }}
              />
            )}

           
          </>
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      <AddPeriodModal
        open={addPeriodOpen}
        isSaving={isCreatingTimetable}
        defaultClass={activeClass.id ? activeClass : undefined}
        defaultSection={activeSection.id ? activeSection : undefined}
        onClose={() => setAddPeriodOpen(false)}
        onSave={(payload: BulkCreateTimetablePayload) =>
          bulkCreateTimetable(payload, { onSuccess: () => setAddPeriodOpen(false) })
        }
      />
      <AddExamTimetableModal
        open={addExamTimetableOpen}
        isSaving={isCreatingExamTimetable || isUpdatingExamTimetable}
        editData={editExamEntry}
        onClose={() => { setAddExamTimetableOpen(false); setEditExamEntry(null); }}
        onSave={async (payload) => {
          if (editExamEntry) {
            await updateExamTimetable({ id: editExamEntry.id, data: payload.examsTimetables[0] });
            setAddExamTimetableOpen(false);
            setEditExamEntry(null);
          } else {
            await bulkCreateExamTimetable(payload);
            setAddExamTimetableOpen(false);
          }
        }}
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

      {/* ── Delete Period Confirm Modal ─────────────────────────────── */}
      {deletePeriodTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-400/40">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <h3 className="text-lg font-black text-slate-900 mb-2">Delete Period</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {deletePeriodTarget.subject} ({deletePeriodTarget.teacherName})
              </span>{" "}
              on period {deletePeriodTarget.periodNo}? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletePeriodTarget(null)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTimetable(deletePeriodTarget.id, { onSuccess: () => setDeletePeriodTarget(null) })}
                disabled={isDeletingTimetable}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isDeletingTimetable && <Loader2 size={14} className="animate-spin" />}
                {isDeletingTimetable ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;