import { useState } from "react";
import { Plus, BookOpen, Users, Layers, BookText, Loader2, Calendar, ChevronDown, ChevronLeft, ChevronRight, Trash2, Pencil } from "lucide-react";
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
import { EditSectionModal } from "./components/EditSectionModal";
import { EditSubjectModal } from "./components/EditSubjectModal";
import type { SectionItem, SubjectItem } from "./types/classes.types";

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
  <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

/* ── Subject chips for one section ── */
const SectionSubjectChips = ({
  sectionId, sectionName, classId, className: clsName,
  onAddSubject, onBulkAddSubject, onEditSubject, onDeleteSubject, onUpdateSubjects,
}: {
  sectionId: string; sectionName: string; classId: string; className: string;
  onAddSubject: (p: { classId: string; className: string; sectionId: string; sectionName: string }) => void;
  onBulkAddSubject: () => void;
  onEditSubject: (p: { id: string; name: string }) => void;
  onDeleteSubject: (p: { id: string; name: string }) => void;
  onUpdateSubjects: (id: string, subjects: SubjectItem[]) => void;
}) => {
  const { subjects, loading, error, refresh } = useSubjectsBySection(
    sectionId,
    (id, data) => onUpdateSubjects(id, data),
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {loading && <span className="flex items-center gap-1 text-[11px] text-gray-400"><Loader2 className="w-3 h-3 animate-spin" />Loading...</span>}
      {error && <span className="text-[11px] text-red-400">Error - <button onClick={refresh} className="underline">retry</button></span>}
      {!loading && !error && subjects.length === 0 && <span className="text-[11px] text-gray-400 italic">No subjects yet</span>}
      {!loading && !error && subjects.map((sub) => (
        <span key={sub.id} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium group">
          {sub.name}
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
        className="flex items-center gap-0.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Plus className="w-3 h-3" /> Add Subject
      </button>
      <button
        onClick={onBulkAddSubject}
        className="flex items-center gap-0.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
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
  onUpdateSections, onUpdateSubjects,
}: {
  classId: string; className: string; refreshKey: number;
  onAddSection: (p: { classId: string; className: string }) => void;
  onBulkAddSection: () => void;
  onBulkAddSubject: () => void;
  onAddSubject: (p: { classId: string; className: string; sectionId: string; sectionName: string }) => void;
  onEditSection: (p: { id: string; name: string }) => void;
  onDeleteSection: (p: { id: string; name: string }) => void;
  onEditSubject: (p: { id: string; name: string }) => void;
  onDeleteSubject: (p: { id: string; name: string }) => void;
  onUpdateSections: (classId: string, sections: SectionItem[]) => void;
  onUpdateSubjects: (sectionId: string, subjects: SubjectItem[]) => void;
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
            <div key={sec.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center text-sm font-extrabold shrink-0">
                  {sec.name}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">Section {sec.name}</p>
                  <p className="text-xs text-gray-500 truncate">{sec.classTeacher || "No teacher assigned"}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  {sec.totalStudents}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditSection({ id: sec.id, name: sec.name })}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                    title="Edit section"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteSection({ id: sec.id, name: sec.name })}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Subjects</p>
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
                />
              </div>
            </div>
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
    deleteClass, updateSection, deleteSection, updateSubject, deleteSubject,
  } = useClasses();

  const academicYearId = useUIStore((state) => state.academicYearId);
  const navigate = useNavigate();
  const { years, loading: yearsLoading } = useAcademicYears();

  const [showAddClass, setShowAddClass] = useState(false);
  const [showBulkAddSection, setShowBulkAddSection] = useState(false);
  const [showBulkAddSubject, setShowBulkAddSubject] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [addSectionFor, setAddSectionFor] = useState<{ classId: string; className: string } | null>(null);
  const [addSubjectFor, setAddSubjectFor] = useState<{
    classId: string; className: string; sectionId: string; sectionName: string;
  } | null>(null);
  const [sectionsRefreshKey, setSectionsRefreshKey] = useState(0);
  const [classPage, setClassPage] = useState(1);
  const CLASS_PAGE_SIZE = 5;
  const [editSectionFor, setEditSectionFor] = useState<{ id: string; name: string } | null>(null);
  const [editSubjectFor, setEditSubjectFor] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "class" | "section" | "subject"; name: string } | null>(null);

  /* ── Inline draft rows ── */
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);
  const [savingDrafts, setSavingDrafts] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  const addDraftRow = () =>
    setDraftRows((prev) => [...prev, makeDraft(academicYearId ?? "")]);

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
          <h1 className="text-xl font-bold text-gray-900">Classes</h1>
          <p className="text-xs sm:text-sm text-emerald-600 font-semibold mt-0.5">
            {stats.totalClasses} classes active
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="appearance-none h-10 pl-4 pr-9 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 cursor-pointer transition min-w-[160px]"
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
            className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm shrink-0"
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Timetable</span>
          </button>

          <button
            onClick={() => setShowAddClass(true)}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Class</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<BookOpen className="w-5 h-5 text-white" />} label="Total Classes"  value={stats.totalClasses}  color="bg-indigo-500" />
        <StatCard icon={<Layers   className="w-5 h-5 text-white" />} label="Total Sections" value={stats.totalSections} color="bg-purple-500" />
        <StatCard icon={<BookText className="w-5 h-5 text-white" />} label="Total Subjects" value={stats.totalSubjects} color="bg-blue-500"   />
        <StatCard icon={<Users    className="w-5 h-5 text-white" />} label="Total Students" value={stats.totalStudents} color="bg-emerald-500" />
      </div>

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
              <tr className="bg-gray-50 border-b border-gray-200 hover:bg-indigo-100 transition-colors group">
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
                    <span className="text-sm font-bold text-gray-900">Class {cls.className}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {cls.sections.length > 0
                        ? cls.sections.map((s) => (
                          <span key={s.id} className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-md font-bold">{s.name}</span>
                        ))
                        : <span className="text-xs text-gray-400">-</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-700 font-semibold">{cls.totalStudents}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      cls.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: cls.id, type: "class", name: cls.className }); }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
              {draftRows.map((row, idx) => (
                <tr key={row.id} className="bg-indigo-50/40 border-t border-indigo-100">
                  <td className="px-4 py-2.5">
                    <input
                      autoFocus={idx === draftRows.length - 1}
                      className="w-full h-9 px-3 rounded-lg border border-indigo-200 bg-white text-sm font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                      placeholder="e.g. Class 11"
                      value={row.class_name}
                      onChange={(e) => updateDraft(row.id, "class_name", e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2.5" colSpan={2}>
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
                  <td className="px-5 py-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-600">PENDING</span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={() => removeDraftRow(row.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

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
                <p className="text-base font-extrabold text-gray-900">Class {selectedClass.className}</p>
                <p className="text-xs text-gray-500">
                  {selectedClass.sections.length} sections - {selectedClass.totalStudents} students
                  {selectedClass.classTeacher && ` - ${selectedClass.classTeacher}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedClassId("")}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 border border-indigo-100"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              All Classes
            </button>
          </div>

          <SelectedClassSections
            key={`${selectedClass.id}-${sectionsRefreshKey}`}
            classId={selectedClass.id}
            className={selectedClass.className}
            refreshKey={sectionsRefreshKey}
            onAddSection={setAddSectionFor}
            onBulkAddSection={() => setShowBulkAddSection(true)}
            onBulkAddSubject={() => setShowBulkAddSubject(true)}
            onAddSubject={setAddSubjectFor}
            onEditSection={setEditSectionFor}
            onDeleteSection={(p) => setDeleteTarget({ ...p, type: "section" })}
            onEditSubject={setEditSubjectFor}
            onDeleteSubject={(p) => setDeleteTarget({ ...p, type: "subject" })}
            onUpdateSections={updateClassSections}
            onUpdateSubjects={updateSectionSubjects}
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
      {showBulkAddSubject && (
        <BulkAddSubjectModal
          onClose={() => setShowBulkAddSubject(false)}
          onSubmit={async (data) => {
            await bulkAddSubjects(data);
            setShowBulkAddSubject(false);
            setSectionsRefreshKey((k) => k + 1);
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