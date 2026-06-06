import { useMemo, useCallback } from "react";
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
} from "./types/homework.types";

const HomeworkSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="space-y-2">
        <div className="h-7 w-40 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
      <div className="h-10 w-40 bg-gray-200 rounded-xl" />
    </div>
    <div className="flex gap-2 mb-2">
      {[...Array(3)].map((_, i) => <div key={i} className="h-8 w-28 bg-gray-100 rounded-lg" />)}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
    <Button onClick={onRetry} className="gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm">
      <RefreshCw size={15} strokeWidth={2} />
      Try Again
    </Button>
  </div>
);

const EmptyState = ({ onAssign }: { onAssign: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center">
      <ClipboardList size={28} className="text-gray-300" strokeWidth={1.5} />
    </div>
    <div className="text-center max-w-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-1">No homework assigned</h2>
      <p className="text-sm text-gray-500">Click the button below to assign your first homework.</p>
    </div>
    <Button onClick={onAssign} className="gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm">
      <Plus size={15} strokeWidth={2} />
      Assign Homework
    </Button>
  </div>
);

const HomeworkPage = () => {
  const {
    tab, setTab,
    teacherId, schoolCode,
    activeHomework, pastHomework, materials,
    isLoading, isError, error, refetch,
    modal, setModal,
    reminderSent, sendReminder,
    createHomework, updateHomework, deleteHomework,
    uploadMaterial, deleteMaterial,
    isCreating, isUpdating,
  } = useHomework();

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

  const toCreatePayload = useCallback(
    (values: AssignHomeworkFormValues): CreateHomeworkPayload => ({
      className: values.className,
      sectionName: values.sectionName,
      subjectName: values.subjectName,
      teacher_id: teacherId,
      title: values.title,
      description: values.description,
      submission_date: values.submission_date,
      attachments: values.attachments ?? [],
      school_code: schoolCode,
    }),
    [teacherId, schoolCode],
  );

  const toUpdatePayload = useCallback(
    (values: AssignHomeworkFormValues): UpdateHomeworkPayload => ({
      className: values.className,
      sectionName: values.sectionName,
      subjectName: values.subjectName,
      title: values.title,
      description: values.description,
      submission_date: values.submission_date,
      attachments: values.attachments ?? [],
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
      className: values.className,
      section: values.section,
      subjectName: values.subjectName,
      upload_date: new Date().toISOString().split("T")[0],
      title: values.title,
      description: values.description,
      downloadFile: values.materialType === "FILE" ? values.file?.[0] : undefined,
      open_link: values.materialType === "LINK" ? values.url : undefined,
      school_code: schoolCode,
    }),
    [schoolCode],
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

  const TABS = [
    { id: "active"    as const, label: "Active Homework",  count: activeHomework.length },
    { id: "past"      as const, label: "Past Homework",    count: pastHomework.length },
    { id: "materials" as const, label: "Study Materials",  count: materials.length },
  ];

  if (isLoading) return <HomeworkSkeleton />;

  if (isError) {
    return <ErrorState message={error?.message ?? "An unexpected error occurred"} onRetry={refetch} />;
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="flex flex-col gap-0 min-h-full">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Homework</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage assignments and study materials</p>
        </div>
        <Button onClick={() => setModal({ type: "assign" })} className="flex items-center gap-2 h-10 px-5 rounded-xl shadow-sm">
          <Plus size={14} className="text-current" strokeWidth={2.5} />
          Assign Homework
        </Button>
      </div>

      <div className="flex gap-0.5 border-b border-gray-200 mb-6 overflow-x-auto flex-nowrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === t.id
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-400 border-transparent hover:text-gray-700"
            }`}
          >
            {t.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              tab === t.id ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "active" && (
        <div className="flex flex-col gap-4">
          {activeHomework.length === 0 ? (
            <EmptyState onAssign={() => setModal({ type: "assign" })} />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {activeHomework.map((hw) => (
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
          )}
        </div>
      )}

      {tab === "past" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {pastHomework.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">No past homework</p>
            </div>
          ) : (
            pastHomework.map((hw) => (
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
      )}

      {tab === "materials" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button onClick={() => setModal({ type: "uploadMaterial" })} className="flex items-center gap-2 h-10 px-5 rounded-xl shadow-sm">
              <Upload size={14} className="text-current" strokeWidth={2.5} />
              Upload Study Material
            </Button>
          </div>
          {materials.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-sm font-semibold text-gray-500">No materials uploaded yet</p>
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

      <AssignHomeworkModal
        open={modal.type === "assign" || modal.type === "edit"}
        mode={modal.type === "edit" ? "edit" : "assign"}
        onClose={() => setModal({ type: "none" })}
        onConfirm={handleConfirm}
        initialValues={
          modal.type === "edit" && editingHw
            ? {
                className: editingHw.className,
                sectionName: editingHw.section,
                subjectName: editingHw.subject,
                title: editingHw.title,
                submission_date: editingHw.dueDate,
                description: editingHw.description,
                is_published: editingHw.isPublished,
                attachments: editingHw.attachments,
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
