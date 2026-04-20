import { useHomework } from "./hooks/useHomework";
import { Plus, Upload } from "lucide-react";
import HomeworkCard from "./components/HomeworkCard";
import AssignHomeworkModal from "./components/AssignHomeworkModal";
import { ConfirmAssignModal, DeleteConfirmModal } from "./components/ConfirmModals";
import { StudyMaterialCard, UploadMaterialModal } from "./components/StudyMaterials";
import { Button } from "@/components/ui/button";
import type { AssignHomeworkFormValues } from "./types/homework.types";

const HomeworkPage = () => {
  const {
    tab, setTab,
    activeHomework, pastHomework, materials,
    modal, setModal,
    reminderSent, sendReminder,
    deleteHomework, deleteMaterial,
  } = useHomework();

  const [pendingAssign, setPendingAssign] =
    [null as AssignHomeworkFormValues | null, (_: AssignHomeworkFormValues | null) => {}];

  const TABS = [
    { id: "active"    as const, label: "Active Homework",  count: activeHomework.length },
    { id: "past"      as const, label: "Past Homework",    count: pastHomework.length },
    { id: "materials" as const, label: "Study Materials",  count: materials.length },
  ];

  const currentHw = modal.type === "deleteHomework"
    ? [...activeHomework, ...pastHomework].find((h) => h.id === modal.id)
    : null;
  const currentMat = modal.type === "deleteMaterial"
    ? materials.find((m) => m.id === modal.id)
    : null;

  return (
    <div className="flex flex-col gap-0 min-h-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Homework</h1>
          <p className="text-sm text-gray-400 mt-0.5">Class 8-A · Manage assignments and study materials</p>
        </div>
        <Button onClick={() => setModal({ type: "assign" })} className="flex items-center gap-2 h-10 px-5 rounded-xl shadow-sm">
          <Plus size={14} className="text-current" strokeWidth={2.5} />
          Assign Homework
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-gray-200 mb-6">
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

      {/* ── Active Homework ── */}
      {tab === "active" && (
        <div className="flex flex-col gap-4">
          {activeHomework.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-sm font-semibold text-gray-500">No active homework</p>
              <p className="text-xs text-gray-300 mt-1">Click "Assign Homework" to get started</p>
            </div>
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

      {/* ── Past Homework ── */}
      {tab === "past" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {pastHomework.map((hw) => (
            <HomeworkCard
              key={hw.id}
              hw={hw}
              onEdit={() => {}}
              onDelete={() => setModal({ type: "deleteHomework", id: hw.id })}
              onSendReminder={() => {}}
            />
          ))}
        </div>
      )}

      {/* ── Study Materials ── */}
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

      {/* ── Modals ── */}
      <AssignHomeworkModal
        open={modal.type === "assign" || modal.type === "edit"}
        mode={modal.type === "edit" ? "edit" : "assign"}
        onClose={() => setModal({ type: "none" })}
        onConfirm={(data) => {
          // In real app: show confirm modal, then submit
          void data;
          setModal({ type: "none" });
        }}
      />

      <DeleteConfirmModal
        open={modal.type === "deleteHomework"}
        title={currentHw?.title ?? ""}
        onConfirm={() => modal.type === "deleteHomework" && deleteHomework(modal.id)}
        onCancel={() => setModal({ type: "none" })}
      />

      <DeleteConfirmModal
        open={modal.type === "deleteMaterial"}
        title={currentMat?.title ?? ""}
        onConfirm={() => modal.type === "deleteMaterial" && deleteMaterial(modal.id)}
        onCancel={() => setModal({ type: "none" })}
      />

      <UploadMaterialModal
        open={modal.type === "uploadMaterial"}
        onClose={() => setModal({ type: "none" })}
        onUpload={() => setModal({ type: "none" })}
      />

      {void pendingAssign}
    </div>
  );
};

export default HomeworkPage;
