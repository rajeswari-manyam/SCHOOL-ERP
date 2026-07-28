import React, { useState, useEffect } from "react";
import { SetupProgressBanner } from "@/features/school-admin/dashboard/components/SetupProgressBanner";
import { Plus, BookOpen, Users, Layers, BookText, Loader2, Calendar, ChevronDown, ChevronLeft, ChevronRight, Trash2, Pencil, X, GraduationCap, User, School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { useClasses } from "./hooks/useClasses";
import { useSectionsByClass } from "./hooks/useSectionsByClass";
import { useSubjectsBySection } from "./hooks/useSubjectsBySection";
import { useAcademicYears } from "@/components/common/hooks/useAcademicYears";
import { Select } from "@/components/ui/select";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { AddClassModal } from "./components/AddClassModal";
import { BulkAddSectionModal } from "./components/BulkAddSectionModal";
import { AddSectionModal } from "./components/AddSectionModal";
import { AddSubjectModal } from "./components/AddSubjectModal";
import { BulkAddSubjectModal } from "./components/BulkAddSubjectModal";
import { EditClassModal } from "./components/EditClassModal";
import { EditSectionModal } from "./components/EditSectionModal";
import { EditSubjectModal } from "./components/EditSubjectModal";
import type { SectionItem, SubjectItem } from "./types/classes.types";
import { getSectionStrength, getStudentsByClassSection } from "@/services/section.api";
import type { SectionStrength, SectionStudent } from "@/services/section.api";
import { getSubjectById } from "@/services/subject.api";
import type { SubjectDetail } from "@/services/subject.api";

/* ── Draft row type ── */
interface DraftRow {
  id: string;
  class_name: string;
  academicYearId: string;
}

let _draftId = 0;
const makeDraft = (defaultYear = ""): DraftRow => ({
  id: `draft_${++_draftId}`,
  class_name: "",
  academicYearId: defaultYear,
});

/* ── Stat card ── */
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-2.5 shadow-sm">
    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>{icon}</div>
    <div>
      <p className="text-[10px] text-gray-500 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

/* ── Section students side panel ── */
const SectionStudentsPanel = ({
  sectionId, sectionName, classId, onClose,
}: {
  sectionId: string; sectionName: string; classId: string; onClose: () => void;
}) => {
  const [strength, setStrength] = useState<SectionStrength | null>(null);
  const [students, setStudents] = useState<SectionStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSectionStrength(sectionId).catch(() => null),
      getStudentsByClassSection(classId, sectionId).catch(() => []),
    ]).then(([s, st]) => {
      setStrength(s);
      setStudents(st ?? []);
    }).finally(() => setLoading(false));
  }, [sectionId, classId]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Section {sectionName} — Students</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Students enrolled in this section</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Strength bar */}
        {strength && (
          <div className="px-5 py-3 border-b border-gray-100 bg-purple-50/60 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">Seat Strength</span>
              <span className="text-xs font-bold text-purple-700">{strength.currentStrength} / {strength.totalStrength}</span>
            </div>
            <div className="h-1.5 rounded-full bg-purple-100 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (strength.currentStrength / strength.totalStrength) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-gray-400">Filled: <span className="font-semibold text-gray-700">{strength.currentStrength}</span></span>
              <span className="text-[10px] text-gray-400">Available: <span className="font-semibold text-emerald-600">{strength.availableSeats}</span></span>
            </div>
          </div>
        )}

        {/* Student list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <Users className="w-8 h-8 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400 font-medium">No students enrolled</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {students.map((s, idx) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {s.first_name}{s.last_name ? ` ${s.last_name}` : ""}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      Roll: {s.roll_number} · {s.admission_number}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ── Subject detail popup ── */
const SubjectDetailPopup = ({
  subjectId, onClose,
}: {
  subjectId: string; onClose: () => void;
}) => {
  const [detail, setDetail] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSubjectById(subjectId)
      .then(setDetail)
      .catch(() => setError("Failed to load subject details."))
      .finally(() => setLoading(false));
  }, [subjectId]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <BookText className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">Subject Details</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
            )}
            {error && (
              <p className="text-sm text-red-500 text-center py-8">{error}</p>
            )}
            {!loading && !error && detail && (
              <div className="space-y-4">
                {/* Subject name */}
                <div className="text-center pb-3 border-b border-gray-100">
                  <p className="text-xl font-bold text-gray-900">{detail.subject_name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest">Subject</p>
                </div>

                {/* Info rows */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                      <School className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Class</p>
                      <p className="text-sm font-semibold text-gray-800">{detail.class_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Section</p>
                      <p className="text-sm font-semibold text-gray-800">Section {detail.section_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Teacher</p>
                      <p className="text-sm font-semibold text-gray-800">{detail.teacher_name || "Not assigned"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Academic Year ID</p>
                      <p className="text-xs font-mono text-gray-600 truncate max-w-[200px]">{detail.academicYearId}</p>
                    </div>
                  </div>
                </div>

                {/* Footer timestamps */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400">Added: <span className="text-gray-600 font-medium">{fmt(detail.createdAt)}</span></span>
                  <span className="text-[10px] text-gray-400">Updated: <span className="text-gray-600 font-medium">{fmt(detail.updatedAt)}</span></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Section card with strength ── */
const SectionCard = ({
  sec, classId, clsName, refreshKey,
  onAddSubject, onBulkAddSubject, onEditSubject, onDeleteSubject, onUpdateSubjects,
  onEditSection, onDeleteSection, onViewStudents, onViewSubject,
}: {
  sec: SectionItem; classId: string; clsName: string; refreshKey: number;
  onAddSubject: (p: { classId: string; className: string; sectionId: string; sectionName: string }) => void;
  onBulkAddSubject: (p: { classId: string; sectionId: string }) => void;
  onEditSubject: (p: { id: string; name: string }) => void;
  onDeleteSubject: (p: { id: string; name: string }) => void;
  onUpdateSubjects: (id: string, subjects: SubjectItem[]) => void;
  onEditSection: (p: { id: string; name: string }) => void;
  onDeleteSection: (p: { id: string; name: string }) => void;
  onViewStudents: (p: { sectionId: string; sectionName: string; classId: string }) => void;
  onViewSubject: (id: string) => void;
}) => {
  const [strength, setStrength] = useState<SectionStrength | null>(null);

  useEffect(() => {
    getSectionStrength(sec.id).then(setStrength).catch(() => {});
  }, [sec.id]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm transition-all" onMouseEnter={e => (e.currentTarget.style.background = '#EFF4FF')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
      {/* Clickable header */}
      <div
        className="flex items-center gap-2.5 p-3 cursor-pointer"
        onClick={() => onViewStudents({ sectionId: sec.id, sectionName: sec.name, classId })}
      >
        <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center text-xs font-medium shrink-0">
          {sec.name}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-900">Section {sec.name}</p>
          <p className="text-[10px] text-gray-500 truncate">{sec.classTeacher || "No teacher assigned"}</p>
        </div>
        {/* Strength badge */}
        {strength ? (
          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
            {strength.currentStrength}/{strength.totalStrength}
          </span>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap shrink-0">
            <Users className="w-3 h-3 text-purple-400" />
            {sec.totalStudents}
          </div>
        )}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEditSection({ id: sec.id, name: sec.name }); }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
            title="Edit section"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteSection({ id: sec.id, name: sec.name }); }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="border-t border-gray-100 px-3 pb-3">
        <p className="text-[9px] font-medium uppercase tracking-widest text-gray-400 mb-1 pt-2">Subjects</p>
        <SectionSubjectChips
          key={`${sec.id}-${refreshKey}`}
          sectionId={sec.id}
          sectionName={sec.name}
          classId={classId}
          className={clsName}
          onAddSubject={onAddSubject}
          onBulkAddSubject={onBulkAddSubject}
          onEditSubject={onEditSubject}
          onDeleteSubject={onDeleteSubject}
          onUpdateSubjects={onUpdateSubjects}
          onViewSubject={onViewSubject}
        />
      </div>
    </div>
  );
};

/* ── Subject chips for one section ── */
const SectionSubjectChips = ({
  sectionId, sectionName, classId, className: clsName,
  onAddSubject, onBulkAddSubject, onEditSubject, onDeleteSubject, onUpdateSubjects, onViewSubject,
}: {
  sectionId: string; sectionName: string; classId: string; className: string;
  onAddSubject: (p: { classId: string; className: string; sectionId: string; sectionName: string }) => void;
  onBulkAddSubject: (p: { classId: string; sectionId: string }) => void;
  onEditSubject: (p: { id: string; name: string }) => void;
  onDeleteSubject: (p: { id: string; name: string }) => void;
  onUpdateSubjects: (id: string, subjects: SubjectItem[]) => void;
  onViewSubject: (id: string) => void;
}) => {
  const { subjects, loading, error, refresh } = useSubjectsBySection(
    sectionId,
    (id, data) => onUpdateSubjects(id, data),
  );

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1.5">
      {loading && <span className="flex items-center gap-1 text-[10px] text-gray-400"><Loader2 className="w-3 h-3 animate-spin" />Loading...</span>}
      {error && <span className="text-[10px] text-red-400">Error - <button onClick={refresh} className="underline">retry</button></span>}
      {!loading && !error && subjects.length === 0 && <span className="text-[10px] text-gray-400 italic">No subjects yet</span>}
      {!loading && !error && subjects.map((sub) => (
        <span key={sub.id} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-md font-medium group">
          <button
            onClick={() => onViewSubject(sub.id)}
            className="hover:text-indigo-600 hover:underline transition-colors"
            title="View subject details"
          >
            {sub.name}
          </button>
          <button
            onClick={() => onEditSubject({ id: sub.id, name: sub.name })}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-600 transition-all"
            title="Edit subject"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDeleteSubject({ id: sub.id, name: sub.name })}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
            title="Delete subject"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={() => onAddSubject({ classId, className: clsName, sectionId, sectionName })}
        className="flex items-center gap-0.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Plus className="w-3 h-3" /> Add Subject
      </button>
      <button
        onClick={() => onBulkAddSubject({ classId, sectionId })}
        className="flex items-center gap-0.5 text-[10px] font-bold text-purple-600 hover:text-purple-800 transition-colors"
      >
        <Plus className="w-3 h-3" /> Bulk Subjects
      </button>
    </div>
  );
};

/* ── Sections grid for selected class ── */
const SelectedClassSections = ({
  classId, className: clsName, refreshKey,
  onAddSection, onBulkAddSection, onBulkAddSubject, onAddSubject,
  onEditSection, onDeleteSection, onEditSubject, onDeleteSubject,
  onUpdateSections, onUpdateSubjects, onViewStudents, onViewSubject,
}: {
  classId: string; className: string; refreshKey: number;
  onAddSection: (p: { classId: string; className: string }) => void;
  onBulkAddSection: () => void;
  onBulkAddSubject: (p: { classId: string; sectionId: string }) => void;
  onAddSubject: (p: { classId: string; className: string; sectionId: string; sectionName: string }) => void;
  onEditSection: (p: { id: string; name: string }) => void;
  onDeleteSection: (p: { id: string; name: string }) => void;
  onEditSubject: (p: { id: string; name: string }) => void;
  onDeleteSubject: (p: { id: string; name: string }) => void;
  onUpdateSections: (classId: string, sections: SectionItem[]) => void;
  onUpdateSubjects: (sectionId: string, subjects: SubjectItem[]) => void;
  onViewStudents: (p: { sectionId: string; sectionName: string; classId: string }) => void;
  onViewSubject: (id: string) => void;
}) => {
  const { sections, loading, error, refresh } = useSectionsByClass(
    classId,
    (id, data) => onUpdateSections(id, data),
  );

  if (loading) return (
    <div className="flex items-center gap-2 justify-center py-16 text-sm text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Loading sections...
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {error}
      <button onClick={refresh} className="text-xs font-semibold text-indigo-600 underline ml-2">Retry</button>
    </div>
  );

  return (
    <div className="space-y-4">
      {sections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-400 font-medium">No sections yet for this class</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => (
            <SectionCard
              key={sec.id}
              sec={sec}
              classId={classId}
              clsName={clsName}
              refreshKey={refreshKey}
              onAddSubject={onAddSubject}
              onBulkAddSubject={onBulkAddSubject}
              onEditSubject={onEditSubject}
              onDeleteSubject={onDeleteSubject}
              onUpdateSubjects={onUpdateSubjects}
              onEditSection={onEditSection}
              onDeleteSection={onDeleteSection}
              onViewStudents={onViewStudents}
              onViewSubject={onViewSubject}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => onAddSection({ classId, className: clsName })}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-indigo-200 rounded-2xl text-sm font-semibold text-indigo-500 hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50/40 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Section
        </button>
        <button
          onClick={onBulkAddSection}
          className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" /> Bulk Sections
        </button>
      </div>
    </div>
  );
};

/* ======================================================
   Main page
====================================================== */
const ClassesPage = () => {
  const {
    classes, loading, error, stats,
    loadClasses, addClass, bulkAddClasses, addSection, addSubject, bulkAddSections, bulkAddSubjects,
    updateClassSections, updateSectionSubjects,
    deleteClass, updateClass, updateSection, deleteSection, updateSubject, deleteSubject,
  } = useClasses();

  const academicYearId = useUIStore((state) => state.academicYearId);
  const navigate = useNavigate();
  const { years, loading: yearsLoading } = useAcademicYears();

  const [showAddClass, setShowAddClass] = useState(false);
  const [showBulkAddSection, setShowBulkAddSection] = useState(false);
  const [bulkSubjectFor, setBulkSubjectFor] = useState<{ classId: string; sectionId: string } | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [addSectionFor, setAddSectionFor] = useState<{ classId: string; className: string } | null>(null);
  const [addSubjectFor, setAddSubjectFor] = useState<{
    classId: string; className: string; sectionId: string; sectionName: string;
  } | null>(null);
  const [sectionsRefreshKey, setSectionsRefreshKey] = useState(0);
  const [classPage, setClassPage] = useState(1);
  const CLASS_PAGE_SIZE = 5;
  const [editClassFor, setEditClassFor] = useState<{ id: string; name: string } | null>(null);
  const [editSectionFor, setEditSectionFor] = useState<{ id: string; name: string } | null>(null);
  const [editSubjectFor, setEditSubjectFor] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "class" | "section" | "subject"; name: string } | null>(null);
  const [viewStudentsFor, setViewStudentsFor] = useState<{ sectionId: string; sectionName: string; classId: string } | null>(null);
  const [viewSubjectId, setViewSubjectId] = useState<string | null>(null);

  /* ── Inline draft rows ── */
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);
  const [savingDrafts, setSavingDrafts] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [expandedDrafts, setExpandedDrafts] = useState<Set<string>>(new Set());

  const toggleDraft = (id: string) =>
    setExpandedDrafts((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const addDraftRow = () => {
    const draft = makeDraft(academicYearId ?? "");
    setDraftRows((prev) => [...prev, draft]);
    setExpandedDrafts((prev) => new Set([...prev, draft.id]));
  };

  const removeDraftRow = (id: string) =>
    setDraftRows((prev) => prev.filter((r) => r.id !== id));

  const updateDraft = (id: string, field: keyof Omit<DraftRow, "id">, value: string) =>
    setDraftRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const saveDraftRows = async () => {
    const valid = draftRows.filter((r) => r.class_name.trim() && r.academicYearId);
    if (!valid.length) {
      setDraftError("Fill in class name and academic year for at least one row.");
      return;
    }
    setDraftError(null);
    setSavingDrafts(true);
    try {
      await bulkAddClasses(valid.map((r) => ({ class_name: r.class_name.trim(), academicYearId: r.academicYearId })));
      setDraftRows([]);
    } catch (err: unknown) {
      setDraftError(err instanceof Error ? err.message : "Failed to create classes");
    } finally {
      setSavingDrafts(false);
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId) ?? null;
  const validDraftCount = draftRows.filter((r) => r.class_name.trim() && r.academicYearId).length;
  const yearOptions = years.map((y) => ({ value: y.id, label: y.active ? `${y.yearName} (Active)` : y.yearName }));

  const sortedClasses = [...classes].sort((a, b) => {
    const numA = parseInt(a.className.match(/\d+/)?.[0] ?? "9999");
    const numB = parseInt(b.className.match(/\d+/)?.[0] ?? "9999");
    return numA !== numB ? numA - numB : a.className.localeCompare(b.className);
  });

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Classes</h1>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {stats.totalClasses} classes active
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="appearance-none h-9 pl-3 pr-8 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 cursor-pointer transition min-w-[140px]"
            >
              <option value="">Select Class...</option>
              {sortedClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>Class {cls.className}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => navigate("/schooladmin/timetable")}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm shrink-0"
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Timetable</span>
          </button>

          <button
            onClick={() => setShowAddClass(true)}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Class</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<BookOpen className="w-4 h-4 text-white" />} label="Total Classes"  value={stats.totalClasses}  color="bg-indigo-500" />
        <StatCard icon={<Layers   className="w-4 h-4 text-white" />} label="Total Sections" value={stats.totalSections} color="bg-purple-500" />
        <StatCard icon={<BookText className="w-4 h-4 text-white" />} label="Total Subjects" value={stats.totalSubjects} color="bg-blue-500"   />
        <StatCard icon={<Users    className="w-4 h-4 text-white" />} label="Total Students" value={stats.totalStudents} color="bg-emerald-500" />
      </div>

      <SetupProgressBanner />

      {/* Error / Loading */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={loadClasses} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors">Retry</button>
        </div>
      )}
      {!error && loading && (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Class list with inline add rows */}
      {!error && !loading && !selectedClass && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-200 hover:bg-indigo-100 transition-colors group" style={{ background: '#EFF4FF' }}>
                {["Class", "Sections", "Students", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-indigo-600 transition-colors">{h}</th>
                ))}
                <th className="w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">

              {/* Existing class rows */}
              {(classPage > 1 || sortedClasses.length > CLASS_PAGE_SIZE ? sortedClasses.slice((classPage - 1) * CLASS_PAGE_SIZE, classPage * CLASS_PAGE_SIZE) : sortedClasses).map((cls) => (
                <tr
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className="hover:bg-indigo-200 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold text-gray-900">Class {cls.className}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {cls.sections.length > 0
                        ? cls.sections.map((s) => (
                          <span key={s.id} className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-md font-bold">{s.name}</span>
                        ))
                        : null}
                      <button
                        onClick={(e) => { e.stopPropagation(); setAddSectionFor({ classId: cls.id, className: cls.className }); }}
                        className="flex items-center gap-0.5 text-[10px] font-bold text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 px-1.5 py-0.5 rounded-md transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Section
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {cls.sections.length > 1 ? (
                      <span className="text-sm text-gray-700 font-semibold">
                        {cls.sections.map((s) => s.totalStudents).join(" / ")}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-700 font-semibold">{cls.totalStudents}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      cls.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditClassFor({ id: cls.id, name: cls.className }); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                        title="Edit class"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: cls.id, type: "class", name: cls.className }); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete class"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {classes.length === 0 && draftRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No classes found</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Add Class" to get started</p>
                  </td>
                </tr>
              )}

              {/* Draft / new rows */}
              {draftRows.map((row, idx) => {
                const isExpanded = expandedDrafts.has(row.id);
                return (
                  <React.Fragment key={row.id}>
                    {/* Collapsed header row — click anywhere to expand */}
                    <tr
                      className="bg-indigo-50/60 border-t border-indigo-100 cursor-pointer hover:bg-indigo-100/60 transition-colors"
                      onClick={() => toggleDraft(row.id)}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <ChevronDown className={`w-4 h-4 text-indigo-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          <span className="text-xs font-bold text-indigo-600 shrink-0">#{idx + 1}</span>
                          <span className="text-xs font-semibold text-gray-700 truncate">
                            {row.class_name || "New Class"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-2.5" colSpan={2}>
                        <span className="text-xs text-gray-400 italic">
                          {yearOptions.find(y => y.value === row.academicYearId)?.label || "Select year"}
                        </span>
                      </td>
                      <td className="px-5 py-2.5">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-600">PENDING</span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); removeDraftRow(row.id); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {/* Expanded form row */}
                    {isExpanded && (
                      <tr key={`${row.id}-form`} className="bg-indigo-50/30 border-b border-indigo-100">
                        <td className="px-4 pb-3 pt-1">
                          <input
                            autoFocus={idx === draftRows.length - 1}
                            className="w-full h-9 px-3 rounded-lg border border-indigo-200 bg-white text-sm font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                            placeholder="e.g. Class 11"
                            value={row.class_name}
                            onChange={(e) => updateDraft(row.id, "class_name", e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="px-4 pb-3 pt-1" colSpan={3}>
                          {yearsLoading ? (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading years...
                            </div>
                          ) : (
                            <Select
                              value={row.academicYearId}
                              onValueChange={(v) => updateDraft(row.id, "academicYearId", v)}
                              options={yearOptions}
                              placeholder="Select academic year"
                              className="h-9 text-sm"
                            />
                          )}
                        </td>
                        <td />
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Add Row link */}
              <tr>
                <td colSpan={5} className="px-5 py-2.5 border-t border-dashed border-gray-100">
                  <button
                    onClick={addDraftRow}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Class
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          </div>

          {/* Pagination */}
          {sortedClasses.length > CLASS_PAGE_SIZE && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/40">
              <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-700">{(classPage - 1) * CLASS_PAGE_SIZE + 1}–{Math.min(classPage * CLASS_PAGE_SIZE, sortedClasses.length)}</span> of{" "}
                <span className="font-semibold text-gray-700">{sortedClasses.length}</span> classes
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setClassPage((p) => p - 1)}
                  disabled={classPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <button
                  onClick={() => setClassPage((p) => p + 1)}
                  disabled={classPage >= Math.ceil(sortedClasses.length / CLASS_PAGE_SIZE)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Save / Discard bar */}
          {draftRows.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-t border-indigo-100 bg-indigo-50/60">
              <div>
                <p className="text-xs font-semibold text-indigo-700">
                  {validDraftCount} class{validDraftCount !== 1 ? "es" : ""} ready to save
                </p>
                {draftError && <p className="text-[11px] text-red-600 mt-0.5">{draftError}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setDraftRows([]); setDraftError(null); }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={saveDraftRows}
                  disabled={savingDrafts || validDraftCount === 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm"
                >
                  {savingDrafts ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {savingDrafts ? "Saving..." : `Save ${validDraftCount} Class${validDraftCount !== 1 ? "es" : ""}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected class sections */}
      {!error && !loading && selectedClass && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white rounded-2xl border border-indigo-100 px-5 py-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm shrink-0 overflow-hidden">
                {selectedClass.className.replace(/\D/g, "") || selectedClass.className.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Class {selectedClass.className}</p>
                <p className="text-[10px] text-gray-500">
                  {selectedClass.sections.length} sections - {selectedClass.totalStudents} students
                  {selectedClass.classTeacher && ` - ${selectedClass.classTeacher}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedClassId("")}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 border border-indigo-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Classes
            </button>
          </div>

          <SelectedClassSections
            key={`${selectedClass.id}-${sectionsRefreshKey}`}
            classId={selectedClass.id}
            className={selectedClass.className}
            refreshKey={sectionsRefreshKey}
            onAddSection={setAddSectionFor}
            onBulkAddSection={() => setShowBulkAddSection(true)}
            onBulkAddSubject={setBulkSubjectFor}
            onAddSubject={setAddSubjectFor}
            onEditSection={setEditSectionFor}
            onDeleteSection={(p) => setDeleteTarget({ ...p, type: "section" })}
            onEditSubject={setEditSubjectFor}
            onDeleteSubject={(p) => setDeleteTarget({ ...p, type: "subject" })}
            onUpdateSections={updateClassSections}
            onUpdateSubjects={updateSectionSubjects}
            onViewStudents={setViewStudentsFor}
            onViewSubject={setViewSubjectId}
          />
        </div>
      )}

      {/* Modals */}
      {showAddClass && (
        <AddClassModal
          onClose={() => setShowAddClass(false)}
          onSubmit={async (data) => { await addClass(data); setShowAddClass(false); }}
        />
      )}
      {addSectionFor && (
        <AddSectionModal
          classId={addSectionFor.classId}
          className={addSectionFor.className}
          onClose={() => setAddSectionFor(null)}
          onSubmit={async (data) => {
            await addSection(addSectionFor.className, data);
            setSectionsRefreshKey((k) => k + 1);
          }}
        />
      )}
      {addSubjectFor && (
        <AddSubjectModal
          classId={addSubjectFor.classId}
          className={addSubjectFor.className}
          sectionId={addSubjectFor.sectionId}
          sectionName={addSubjectFor.sectionName}
          academicYearId={academicYearId || ""}
          onClose={() => setAddSubjectFor(null)}
          onSubmit={async (data) => {
            await addSubject(data);
            setSectionsRefreshKey((k) => k + 1);
          }}
        />
      )}
      {showBulkAddSection && (
        <BulkAddSectionModal
          classId={selectedClassId}
          onClose={() => setShowBulkAddSection(false)}
          onSubmit={async (data) => {
            const res = await bulkAddSections(data);
            setShowBulkAddSection(false);
            setSectionsRefreshKey((k) => k + 1);
            return res;
          }}
        />
      )}
      {bulkSubjectFor && (
        <BulkAddSubjectModal
          presetClassId={bulkSubjectFor.classId}
          presetSectionId={bulkSubjectFor.sectionId}
          onClose={() => setBulkSubjectFor(null)}
          onSubmit={async (data) => {
            await bulkAddSubjects(data);
            setBulkSubjectFor(null);
            setSectionsRefreshKey((k) => k + 1);
          }}
        />
      )}
      {editClassFor && (
        <EditClassModal
          classId={editClassFor.id}
          className={editClassFor.name}
          onClose={() => setEditClassFor(null)}
          onSubmit={async (id, payload) => {
            await updateClass(id, payload);
            setEditClassFor(null);
            loadClasses();
          }}
        />
      )}
      {editSectionFor && (
        <EditSectionModal
          sectionId={editSectionFor.id}
          sectionName={editSectionFor.name}
          onClose={() => setEditSectionFor(null)}
          onSubmit={async (id, payload) => {
            await updateSection(id, payload);
            setEditSectionFor(null);
            setSectionsRefreshKey((k) => k + 1);
          }}
        />
      )}
      {editSubjectFor && (
        <EditSubjectModal
          subjectId={editSubjectFor.id}
          subjectName={editSubjectFor.name}
          onClose={() => setEditSubjectFor(null)}
          onSubmit={async (id, payload) => {
            await updateSubject(id, payload);
            setEditSubjectFor(null);
            setSectionsRefreshKey((k) => k + 1);
          }}
        />
      )}
      {/* Students side panel */}
      {viewStudentsFor && (
        <SectionStudentsPanel
          sectionId={viewStudentsFor.sectionId}
          sectionName={viewStudentsFor.sectionName}
          classId={viewStudentsFor.classId}
          onClose={() => setViewStudentsFor(null)}
        />
      )}

      {/* Subject detail popup */}
      {viewSubjectId && (
        <SubjectDetailPopup
          subjectId={viewSubjectId}
          onClose={() => setViewSubjectId(null)}
        />
      )}

      <AlertDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            if (deleteTarget.type === "class") await deleteClass(deleteTarget.id);
            else if (deleteTarget.type === "section") await deleteSection(deleteTarget.id);
            else if (deleteTarget.type === "subject") await deleteSubject(deleteTarget.id);
            setSectionsRefreshKey((k) => k + 1);
          } catch { /* error handled by hook */ }
          setDeleteTarget(null);
        }}
        title={`Delete ${deleteTarget?.type ?? ""}?`}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default ClassesPage;