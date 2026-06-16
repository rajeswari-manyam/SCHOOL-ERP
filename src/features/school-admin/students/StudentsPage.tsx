import { useState } from "react";
import { useStudents } from "../students/hooks/useStudents";
import { useClassesList } from "../students/hooks/useClassesList";
import { useSectionsList } from "../students/hooks/useSectionsList";
import { useUIStore } from "@/store/uiStore";

import StudentStatCards from "../students/components/StudentStatCards";
import StudentFilterBar from "../students/components/StudentFilterBar";
import StudentTable from "../students/components/StudentTable";
import AddStudentModal from "../students/components/AddStudentModal";
import { EditStudentModal } from "../students/components/EditStudentModal";

import type { AddStudentFormData, Student } from "../students/types/student.types";

import { Download, Plus } from "lucide-react";

const StudentsPage = () => {
  const {
    filtered, loading, error, stats,
    search, setSearch,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    addStudent,
    updateStudent,
    loadStudents,
  } = useStudents();

  const academicYearId = useUIStore((s) => s.academicYearId);
  const { classes: classOptions } = useClassesList(academicYearId);
  const selectedClassId = classFilter !== "All"
    ? classOptions.find((c) => c.value === classFilter)?.id ?? null
    : null;
  const { sections: sectionOptions } = useSectionsList(selectedClassId);



  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleAddStudent = async (data: AddStudentFormData) => {
    const student = await addStudent(data);
    return { status: true, message: "Student created", data: student };
  };



  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 truncate">Students</h1>
          <p className="text-xs sm:text-sm text-emerald-600 font-semibold mt-1 sm:mt-0.5">● {stats.totalActive} active students</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
         
          <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-gray-700">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import CSV</span><span className="sm:hidden">Import</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-lg sm:rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <StudentStatCards stats={stats} />

      {/* Filter bar */}
      <StudentFilterBar
        search={search} setSearch={setSearch}
        classFilter={classFilter} setClassFilter={setClassFilter}
        sectionFilter={sectionFilter} setSectionFilter={setSectionFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        classOptions={classOptions} sectionOptions={sectionOptions}
      />

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={loadStudents}
            className="rounded-lg bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!error && (loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <StudentTable students={filtered} onEdit={setEditingStudent} />
          {filtered.length > 0 && (
            <p className="text-xs text-gray-400 text-center">Showing {filtered.length} student{filtered.length !== 1 ? "s" : ""}</p>
          )}
        </>
      ))}

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddStudent}
        />
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={updateStudent}
        />
      )}

     
    </div>
  );
};

export default StudentsPage;