import { useState } from "react";
import { Plus, BookOpen, Users, Layers, GraduationCap, ChevronDown, ChevronRight, BookText, Loader2 } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useClasses } from "./hooks/useClasses";
import { useSectionsByClass } from "./hooks/useSectionsByClass";
import { useSubjectsBySection } from "./hooks/useSubjectsBySection";
import { AddClassModal } from "./components/AddClassModal";
import { AddSectionModal } from "./components/AddSectionModal";
import { AddSubjectModal } from "./components/AddSubjectModal";

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const SectionSubjects = ({
  sectionId, sectionName, classId, className: clsName,
  onAddSubject, onUpdateSubjects,
}: {
  sectionId: string; sectionName: string; classId: string; className: string;
  onAddSubject: (params: { classId: string; className: string; sectionId: string; sectionName: string }) => void;
  onUpdateSubjects: (sectionId: string, subjects: import("./types/classes.types").SubjectItem[]) => void;
}) => {
  const { subjects, loading: subsLoading, error: subsError, refresh: refreshSubjects } = useSubjectsBySection(
    sectionId,
    (id, data) => onUpdateSubjects(id, data)
  );

  if (subsLoading) {
    return (
      <div className="ml-6 mt-2 flex items-center gap-2 py-2 pl-3">
        <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
        <span className="text-xs text-gray-400">Loading subjects...</span>
      </div>
    );
  }

  if (subsError) {
    return (
      <div className="ml-6 mt-2 mx-3">
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {subsError}
        </div>
        <button
          onClick={refreshSubjects}
          className="mt-1.5 ml-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="ml-6 mt-2 space-y-1">
      {subjects.length === 0 ? (
        <p className="text-xs text-gray-400 italic pl-3">No subjects assigned</p>
      ) : (
        subjects.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center gap-2 pl-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <BookText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium">{sub.name}</span>
            <span className="text-[10px] text-gray-400 uppercase">{sub.subjectCode}</span>
            <span className="ml-auto text-xs text-gray-500">{sub.teacher || "—"}</span>
          </div>
        ))
      )}
      <button
        onClick={() => onAddSubject({ classId, className: clsName, sectionId, sectionName })}
        className="flex items-center gap-1 pl-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
      >
        <Plus className="w-3 h-3" />
        Add Subject
      </button>
    </div>
  );
};

const ClassSectionList = ({
  classId, className: clsName,
  expandedSection, onToggleSection, onAddSection, onAddSubject, onUpdateSections, onUpdateSubjects,
}: {
  classId: string; className: string;
  expandedSection: string | null;
  onToggleSection: (id: string) => void;
  onAddSection: (params: { classId: string; className: string }) => void;
  onAddSubject: (params: { classId: string; className: string; sectionId: string; sectionName: string }) => void;
  onUpdateSections: (classId: string, sections: import("./types/classes.types").SectionItem[]) => void;
  onUpdateSubjects: (sectionId: string, subjects: import("./types/classes.types").SubjectItem[]) => void;
}) => {
  const { sections, loading: sectionsLoading, error: sectionsError, refresh: refreshSections } = useSectionsByClass(
    classId,
    (id, data) => onUpdateSections(id, data)
  );

  if (sectionsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        <span className="ml-2 text-sm text-gray-500">Loading sections...</span>
      </div>
    );
  }

  if (sectionsError) {
    return (
      <div className="mx-4 mb-4">
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {sectionsError}
        </div>
        <button
          onClick={refreshSections}
          className="mt-1.5 ml-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {sections.map((section) => {
        const isSectionExpanded = expandedSection === section.id;
        return (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => onToggleSection(section.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                {section.name}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-gray-900">Section {section.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {section.totalStudents} students · {section.subjects.length} subjects
                </span>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">
                {section.classTeacher || "No teacher"}
              </span>
              {isSectionExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
            </button>
            {isSectionExpanded && (
              <SectionSubjects
                sectionId={section.id}
                sectionName={section.name}
                classId={classId}
                className={clsName}
                onAddSubject={onAddSubject}
                onUpdateSubjects={onUpdateSubjects}
              />
            )}
          </div>
        );
      })}

      <button
        onClick={() => onAddSection({ classId, className: clsName })}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Section
      </button>
    </div>
  );
};

const ClassesPage = () => {
  const { classes, loading, error, stats, loadClasses, addClass, addSection, addSubject, updateClassSections, updateSectionSubjects } = useClasses();
  const academicYearId = useUIStore((state) => state.academicYearId);
  const [showAddClass, setShowAddClass] = useState(false);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [addSectionFor, setAddSectionFor] = useState<{ classId: string; className: string } | null>(null);
  const [addSubjectFor, setAddSubjectFor] = useState<{ classId: string; className: string; sectionId: string; sectionName: string } | null>(null);

  const toggleClass = (className: string) => {
    setExpandedClass((prev) => (prev === className ? null : className));
    setExpandedSection(null);
  };

  const ClassCard = ({ cls }: { cls: typeof classes[0] }) => {
    const isExpanded = expandedClass === cls.className;
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleClass(cls.className)}
          className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 text-white font-bold text-sm">
            {cls.className}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900">Class {cls.className}</h3>
            <p className="text-xs text-gray-500">
              {cls.sections.length} section{cls.sections.length !== 1 ? "s" : ""} · {cls.totalStudents} student{cls.totalStudents !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {cls.totalStudents}/{cls.capacity}
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              {cls.classTeacher || "—"}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              cls.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}>
              {cls.status}
            </span>
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
        </button>

        {isExpanded && (
          <div className="border-t border-gray-100 bg-gray-50/50">
            <ClassSectionList
              classId={cls.id}
              className={cls.className}
              expandedSection={expandedSection}
              onToggleSection={(id) => setExpandedSection((prev) => (prev === id ? null : id))}
              onAddSection={setAddSectionFor}
              onAddSubject={setAddSubjectFor}
              onUpdateSections={updateClassSections}
              onUpdateSubjects={updateSectionSubjects}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">Classes</h1>
          <p className="text-xs sm:text-sm text-emerald-600 font-semibold mt-0.5">● {stats.totalClasses} classes active</p>
        </div>
        <button
          onClick={() => setShowAddClass(true)}
          className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Class
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<BookOpen className="w-5 h-5 text-white" />} label="Total Classes" value={stats.totalClasses} color="bg-indigo-500" />
        <StatCard icon={<Layers className="w-5 h-5 text-white" />} label="Total Sections" value={stats.totalSections} color="bg-purple-500" />
        <StatCard icon={<BookText className="w-5 h-5 text-white" />} label="Total Subjects" value={stats.totalSubjects} color="bg-blue-500" />
        <StatCard icon={<Users className="w-5 h-5 text-white" />} label="Total Students" value={stats.totalStudents} color="bg-emerald-500" />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={loadClasses} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors">Retry</button>
        </div>
      )}

      {/* Class List */}
      {!error && (loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {classes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No classes found</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Class" to create your first class</p>
            </div>
          ) : (
            classes.map((cls) => <ClassCard key={cls.id} cls={cls} />)
          )}
        </div>
      ))}

      {/* Modals */}
      {showAddClass && (
        <AddClassModal
          onClose={() => setShowAddClass(false)}
          onSubmit={async (data) => {
            await addClass(data);
          }}
        />
      )}

      {addSectionFor && (
        <AddSectionModal
          classId={addSectionFor.classId}
          className={addSectionFor.className}
          onClose={() => setAddSectionFor(null)}
          onSubmit={async (data) => {
            await addSection(addSectionFor.className, data);
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
          }}
        />
      )}
    </div>
  );
};

export default ClassesPage;
