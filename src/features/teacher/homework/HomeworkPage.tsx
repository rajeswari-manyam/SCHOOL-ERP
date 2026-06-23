import { useMemo, useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useHomework } from "./hooks/useHomework";
import { Plus, Upload, AlertCircle, ClipboardList, RefreshCw } from "lucide-react";
import HomeworkCard from "./components/HomeworkCard";
import AssignHomeworkModal from "./components/AssignHomeworkModal";
import { DeleteConfirmModal } from "./components/ConfirmModals";
import { StudyMaterialCard, UploadMaterialModal } from "./components/StudyMaterials";
import { Button } from "@/components/ui/button";
import type {
  AssignHomeworkFormValues,
  CreateHomeworkPayload,
  CreateStudyMaterialPayload,
  UpdateHomeworkPayload,
  UploadMaterialFormValues,
  HomeworkItem,
} from "./types/homework.types";

import { getAllClasses, getSectionsByClassId } from "../../../services/class.api";
import { getAllSubjects } from "../../../services/subject.api";
import { getHomeworkByClass } from "@/services/homework.api";
import type { Homework } from "@/services/homework.api";
import type { ClassRecord, SectionRecord } from "../../../services/class.api";
import type { SubjectRecord } from "../../../services/subject.api";

// ── Transform for gethomeworkByClass response shape ──────────────────────────
// This endpoint returns { class: { id, name }, section: { id, name }, subject: { id, name } }
// whereas getallhomework returns { class: { id, class_name }, section: { id, sectionName }, ... }

type WANotifyStatus = "SENT" | "NOT_SENT" | "SENDING";

const toStatus = (dueDate: string, isPublished: boolean) => {
  if (!isPublished) return "PAST" as const;
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due >= now ? "ACTIVE" as const : "PAST" as const;
};

const transformByClass = (h: Homework): HomeworkItem => ({
  id:    h.id,
  title: h.title,
  classId:    h.class_id    ?? "",
  sectionId:  h.section_id  ?? "",
  subjectId:  h.subject_id  ?? "",
  subject:   h.subject?.name ?? h.subject?.subject_name ?? h.subject_id  ?? "",
  className: h.class?.name   ?? h.class?.class_name     ?? h.class_id    ?? "",
  section:   h.section?.name ?? h.section?.sectionName  ?? h.section_id  ?? "",
  dueDate:        h.submission_date,
  description:    h.description,
  attachmentName: h.attachments?.[0]?.split("/").pop(),
  attachmentUrl:  h.attachments?.[0],
  attachments:    h.attachments ?? [],
  submittedCount: 0,
  totalCount:     0,
  waNotifyStatus: "NOT_SENT" as WANotifyStatus,
  status:         toStatus(h.submission_date, h.is_published),
  createdAt:      h.createdAt,
  isPublished:    h.is_published,
  academicYearId: h.academicYearId,
  teacher_id:     h.teacher_id,
});

// ─── Skeletons / States ───────────────────────────────────────────────────────

const HomeworkSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="space-y-2">
        <div className="h-7 w-40 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-36 bg-gray-200 rounded-[10px]" />
        <div className="h-9 w-36 bg-gray-200 rounded-[10px]" />
      </div>
    </div>
    <div className="flex gap-2 mb-2">
      {[...Array(3)].map((_, i) => <div key={i} className="h-8 w-28 bg-gray-100 rounded-lg" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-52 bg-gray-100 rounded-2xl" />
      ))}
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
      <AlertCircle size={28} className="text-red-500" strokeWidth={1.5} />
    </div>
    <div className="text-center max-w-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Failed to load homework</h2>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
    <Button
      onClick={onRetry}
      className="gap-2 px-5 py-2 rounded-[10px] bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm"
    >
      <RefreshCw size={15} strokeWidth={2} />
      Try Again
    </Button>
  </div>
);

const EmptyState = ({ onAssign }: { onAssign: () => void }) => (
  <div className="bg-white border border-slate-200 rounded-2xl py-12 px-6 flex flex-col items-center gap-3 text-center">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
      <ClipboardList size={22} className="text-slate-400" strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-[15px] font-bold text-slate-900">No homework assigned</p>
      <p className="text-[13px] text-slate-500 mt-1 max-w-[260px]">
        Click the button below to assign your first homework.
      </p>
    </div>
    <Button
      onClick={onAssign}
      className="mt-1 gap-2 h-9 px-4 rounded-[10px] bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold shadow-sm"
    >
      <Plus size={14} strokeWidth={2.5} />
      Assign Homework
    </Button>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const HomeworkPage = () => {
  const {
    tab, setTab,
    teacherId,
    activeHomework, pastHomework, materials, isMaterialsError, refetchMaterials,
    isLoading, isError, error, refetch,
    modal, setModal,
    reminderSent, sendReminder,
    createHomework, updateHomework, deleteHomework,
    uploadMaterial, deleteMaterial,
    isCreating, isUpdating,
  } = useHomework();

  // ── Filter dropdown data ──────────────────────────────────────────────────
  const [classes,  setClasses]  = useState<ClassRecord[]>([]);
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);

  // ── Selected filter values (IDs) ──────────────────────────────────────────
  const [filterClassId,   setFilterClassId]   = useState("");
  const [filterSectionId, setFilterSectionId] = useState("");
  const [filterSubjectId, setFilterSubjectId] = useState("");
  const [filterDate,      setFilterDate]      = useState(""); // YYYY-MM-DD

  // Load classes on mount
  useEffect(() => {
    getAllClasses().then((res) => setClasses(res.data ?? [])).catch(() => {});
  }, []);

  // Load sections when class filter changes
  useEffect(() => {
    setSections([]);
    setFilterSectionId("");
    setSubjects([]);
    setFilterSubjectId("");
    if (!filterClassId) return;
    getSectionsByClassId(filterClassId)
      .then((res) => setSections(res.data ?? []))
      .catch(() => {});
  }, [filterClassId]);

  // Load subjects when section filter changes
  useEffect(() => {
    setSubjects([]);
    setFilterSubjectId("");
    if (!filterSectionId) return;
    getAllSubjects({ class_id: filterClassId, section_id: filterSectionId })
      .then((res) => setSubjects(res.data ?? []))
      .catch(() => {});
  }, [filterSectionId]);

  // ── Server-side filtered query (fires only when class is selected) ─────────
  const isFiltering = !!filterClassId;

  const {
    data: filteredRaw,
    isLoading: isFilterLoading,
    isError: isFilterError,
  } = useQuery({
    queryKey: ["homework", "byClass", filterClassId, filterSectionId, filterSubjectId, filterDate],
    queryFn: async () => {
      const res = await getHomeworkByClass({
        class_id:   filterClassId,
        section_id: filterSectionId || undefined,
        subject_id: filterSubjectId || undefined,
        date:       filterDate      || undefined,
      });
      return (res.data ?? []).map(transformByClass);
    },
    staleTime: 1000 * 60 * 2,
    enabled: isFiltering,
  });

  // ── Merge: use server-filtered results when filtering, else hook data ──────
  const displayActive = useMemo(() => {
    if (isFiltering) return (filteredRaw ?? []).filter((h) => h.status === "ACTIVE");
    return activeHomework;
  }, [isFiltering, filteredRaw, activeHomework]);

  const displayPast = useMemo(() => {
    if (isFiltering) return (filteredRaw ?? []).filter((h) => h.status === "PAST");
    return pastHomework;
  }, [isFiltering, filteredRaw, pastHomework]);

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const editingHw = useMemo(() => {
    if (modal.type !== "edit") return null;
    return [...activeHomework, ...pastHomework].find((h) => h.id === modal.id) ?? null;
  }, [modal, activeHomework, pastHomework]);

  const deletingHw = useMemo(() => {
    if (modal.type !== "deleteHomework") return null;
    return [...activeHomework, ...pastHomework].find((h) => h.id === modal.id) ?? null;
  }, [modal, activeHomework, pastHomework]);

  const deletingMat = useMemo(() => {
    if (modal.type !== "deleteMaterial") return null;
    return materials.find((m) => m.id === modal.id) ?? null;
  }, [modal, materials]);

  // ── Payload builders ──────────────────────────────────────────────────────
  const toCreatePayload = useCallback(
    (values: AssignHomeworkFormValues): CreateHomeworkPayload => ({
      class_id:       values.class_id,
      section_id:     values.section_id,
      subject_id:     values.subject_id,
      academicYearId: values.academicYearId,
      teacher_id:     teacherId,
      title:          values.title,
      description:    values.description,
      submission_date: values.submission_date,
      attachments:    values.attachments ?? [],
      is_published:   values.is_published,
    }),
    [teacherId],
  );

  const toUpdatePayload = useCallback(
    (values: AssignHomeworkFormValues): UpdateHomeworkPayload => ({
      class_id:        values.class_id,
      section_id:      values.section_id,
      subject_id:      values.subject_id,
      title:           values.title,
      description:     values.description,
      submission_date: values.submission_date,
      attachments:     values.attachments ?? [],
      is_published:    values.is_published,
    }),
    [],
  );

  const handleConfirm = useCallback(async (values: AssignHomeworkFormValues) => {
    try {
      if (modal.type === "edit" && modal.id) {
        await updateHomework(modal.id, toUpdatePayload(values));
        toast.success("Homework updated");
      } else {
        await createHomework(toCreatePayload(values));
        toast.success("Homework assigned successfully");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    }
  }, [modal, updateHomework, createHomework, toCreatePayload, toUpdatePayload]);

  const handleDeleteHomework = useCallback(async () => {
    if (modal.type !== "deleteHomework") return;
    try {
      await deleteHomework(modal.id);
      toast.success("Homework deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }, [modal, deleteHomework]);

  const toCreateStudyMaterialPayload = useCallback(
    (values: UploadMaterialFormValues): CreateStudyMaterialPayload => ({
      class_id:     values.classId,
      section_id:   values.sectionId,
      subject_id:   values.subjectId,
      teacher_id:   teacherId,
      upload_date:  new Date().toISOString().split("T")[0],
      title:        values.title,
      description:  values.description,
      upload_type:  values.materialType === "LINK" ? "link" : "pdf",
      open_link:    values.materialType === "LINK" ? values.url : undefined,
      pdf:          values.materialType === "FILE" ? values.file?.[0] ?? null : null,
    }),
    [teacherId],
  );

  const handleUploadMaterial = useCallback(async (values: UploadMaterialFormValues) => {
    try {
      await uploadMaterial(toCreateStudyMaterialPayload(values));
      toast.success("Material uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload material");
    }
  }, [uploadMaterial, toCreateStudyMaterialPayload]);

  const handleDeleteMaterial = useCallback(async () => {
    if (modal.type !== "deleteMaterial") return;
    try {
      await deleteMaterial(modal.id);
      toast.success("Material deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }, [modal, deleteMaterial]);

  const CARDS_PER_PAGE = 4;
  const [showAllActive, setShowAllActive] = useState(false);
  const [showAllPast,   setShowAllPast]   = useState(false);

  const visibleActive = showAllActive ? displayActive : displayActive.slice(0, CARDS_PER_PAGE);
  const visiblePast   = showAllPast   ? displayPast   : displayPast.slice(0, CARDS_PER_PAGE);

  const TABS = [
    { id: "active"    as const, label: "Active",          count: displayActive.length },
    { id: "past"      as const, label: "Past",            count: displayPast.length },
    { id: "materials" as const, label: "Study materials", count: materials.length },
  ];

  const selectCls = "h-10 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer";

  if (isLoading) return <HomeworkSkeleton />;
  if (isError && !isFiltering) return <ErrorState message={error?.message ?? "An unexpected error occurred"} onRetry={refetch} />;

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="flex flex-col gap-0 min-h-full">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Homework & Study Materials
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage assignments, track submissions and share resources
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => setModal({ type: "uploadMaterial" })}
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Upload size={15} className="text-current" />
            Upload Material
          </Button>
          <Button
            onClick={() => setModal({ type: "assign" })}
            className="flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Plus size={15} strokeWidth={2.5} className="text-current" />
            Assign Homework
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap items-center">

        {/* Class */}
        <select
          className={selectCls}
          value={filterClassId}
          onChange={(e) => setFilterClassId(e.target.value)}
        >
          <option value="">All classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.class_name}</option>
          ))}
        </select>

        {/* Section — only shown when a class is selected */}
        {filterClassId && (
          <select
            className={selectCls}
            value={filterSectionId}
            onChange={(e) => setFilterSectionId(e.target.value)}
          >
            <option value="">All sections</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.sectionName}</option>
            ))}
          </select>
        )}

        {/* Subject — shown when section is selected */}
        {filterSectionId && (
          <select
            className={selectCls}
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
          >
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.subject_name}</option>
            ))}
          </select>
        )}

        {/* Date picker */}
        <input
          type="date"
          className={selectCls + " pr-2"}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {/* Clear filters */}
        {isFiltering && (
          <button
            onClick={() => {
              setFilterClassId("");
              setFilterSectionId("");
              setFilterSubjectId("");
              setFilterDate("");
            }}
            className="h-10 px-3 text-sm font-medium text-gray-500 hover:text-red-500 border border-gray-300 rounded-lg bg-white hover:border-red-200 transition-colors"
          >
            Clear
          </button>
        )}

        {/* Filter loading indicator */}
        {isFiltering && isFilterLoading && (
          <span className="text-[11px] text-slate-400 animate-pulse">Loading…</span>
        )}

        {/* Filter error */}
        {isFiltering && isFilterError && (
          <span className="text-[11px] text-red-500">Failed to load filtered results</span>
        )}
      </div>

      {/* Pill Tabs */}
      <div className="inline-flex bg-indigo-50 rounded-xl p-[3px] gap-0.5 mb-5 self-start">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-[6px] px-[14px] py-[7px] rounded-[9px] text-[13px] font-semibold transition-all border-none cursor-pointer ${
              tab === t.id
                ? "bg-white text-indigo-600 shadow-[0_1px_3px_rgba(79,70,229,0.12)]"
                : "bg-transparent text-indigo-400 hover:text-indigo-600"
            }`}
          >
            {t.label}
            <span className={`text-[11px] font-bold px-[7px] py-[1px] rounded-full ${
              tab === t.id
                ? "bg-indigo-50 text-indigo-600"
                : "bg-indigo-100/60 text-indigo-500"
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Active Panel */}
      {tab === "active" && (
        <div className="flex flex-col gap-4">
          {displayActive.length === 0 ? (
            <EmptyState onAssign={() => setModal({ type: "assign" })} />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {visibleActive.map((hw) => (
                  <HomeworkCard
                    key={hw.id}
                    hw={hw}
                    onEdit={() => setModal({ type: "edit", id: hw.id })}
                    onDelete={() => setModal({ type: "deleteHomework", id: hw.id })}
                    onSendReminder={() => sendReminder(hw.id)}
                    reminderSent={reminderSent.has(hw.id)}
                  />
                ))}
              </div>
              {displayActive.length > CARDS_PER_PAGE && (
                <button
                  onClick={() => setShowAllActive((v) => !v)}
                  className="mx-auto flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  {showAllActive
                    ? "Show less"
                    : `Show ${displayActive.length - CARDS_PER_PAGE} more`}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className={`transition-transform duration-200 ${showAllActive ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Past Panel */}
      {tab === "past" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayPast.length === 0 ? (
              <div className="col-span-full bg-white border border-slate-200 rounded-2xl py-12 flex flex-col items-center gap-3 text-center">
                <p className="text-[15px] font-bold text-slate-500">No past homework</p>
              </div>
            ) : (
              visiblePast.map((hw) => (
                <HomeworkCard
                  key={hw.id}
                  hw={hw}
                  onEdit={() => setModal({ type: "edit", id: hw.id })}
                  onDelete={() => setModal({ type: "deleteHomework", id: hw.id })}
                  onSendReminder={() => {}}
                />
              ))
            )}
          </div>
          {displayPast.length > CARDS_PER_PAGE && (
            <button
              onClick={() => setShowAllPast((v) => !v)}
              className="mx-auto flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              {showAllPast
                ? "Show less"
                : `Show ${displayPast.length - CARDS_PER_PAGE} more`}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform duration-200 ${showAllPast ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Study Materials Panel */}
      {tab === "materials" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold text-slate-900">
              Study materials{" "}
              <span className="text-slate-400 font-medium">({materials.length} resources)</span>
            </p>
          </div>
          {isMaterialsError ? (
            <div className="bg-white border border-red-200 rounded-2xl py-12 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-400 text-2xl">
                !
              </div>
              <p className="text-[15px] font-bold text-slate-900">Failed to load study materials</p>
              <p className="text-[13px] text-slate-500 max-w-[260px]">
                Something went wrong. Try refreshing.
              </p>
              <button
                onClick={() => refetchMaterials()}
                className="mt-2 px-4 py-2 text-[13px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
              >
                Retry
              </button>
            </div>
          ) : materials.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl py-12 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
                📁
              </div>
              <p className="text-[15px] font-bold text-slate-900">No materials uploaded yet</p>
              <p className="text-[13px] text-slate-500 max-w-[260px]">
                Upload PDFs, documents, presentations, or links for your students.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {materials.map((m) => (
                <StudyMaterialCard
                  key={m.id}
                  material={m}
                  onDelete={() => setModal({ type: "deleteMaterial", id: m.id })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      <AssignHomeworkModal
        open={modal.type === "assign" || modal.type === "edit"}
        mode={modal.type === "edit" ? "edit" : "assign"}
        onClose={() => setModal({ type: "none" })}
        onConfirm={handleConfirm}
        initialValues={
          modal.type === "edit" && editingHw
            ? {
                class_id:        editingHw.classId,
                section_id:      editingHw.sectionId,
                subject_id:      editingHw.subjectId,
                academicYearId:  editingHw.academicYearId,
                title:           editingHw.title,
                submission_date: editingHw.dueDate,
                description:     editingHw.description,
                is_published:    editingHw.isPublished,
                attachments:     editingHw.attachments,
              }
            : undefined
        }
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        open={modal.type === "deleteHomework"}
        title={deletingHw?.title ?? ""}
        onConfirm={handleDeleteHomework}
        onCancel={() => setModal({ type: "none" })}
      />

      <DeleteConfirmModal
        open={modal.type === "deleteMaterial"}
        title={deletingMat?.title ?? ""}
        onConfirm={handleDeleteMaterial}
        onCancel={() => setModal({ type: "none" })}
      />

      <UploadMaterialModal
        open={modal.type === "uploadMaterial"}
        onClose={() => setModal({ type: "none" })}
        onUpload={handleUploadMaterial}
      />

    </div>
  );
};

export default HomeworkPage;