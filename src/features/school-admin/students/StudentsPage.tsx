import { useState } from "react";
import { useStudents } from "../students/hooks/useStudents";
import { useClassesList } from "../students/hooks/useClassesList";
import { useSectionsList } from "../students/hooks/useSectionsList";
import { useUIStore } from "@/store/uiStore";

import StudentFilterBar from "../students/components/StudentFilterBar";
import StudentTable from "../students/components/StudentTable";
import AddStudentModal from "../students/components/AddStudentModal";
import BulkAddStudentModal from "../students/components/BulkAddStudentModal";
import { EditStudentModal } from "../students/components/EditStudentModal";

import StudentStatCards from "../students/components/StudentStatCards";
import type { AddStudentFormData, Student } from "../students/types/student.types";

const StudentsPage = () => {
  const {
    students, filtered, loading, error, stats,
    search, setSearch,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    addStudent,
    updateStudent,
    deleteStudent,
    loadStudents,
  } = useStudents();

  const academicYearId = useUIStore((s) => s.academicYearId);
  const { classes: classOptions } = useClassesList(academicYearId);
  const selectedClassId = classFilter !== "All"
    ? classOptions.find((c) => c.value === classFilter)?.id ?? null
    : null;
  const { sections: sectionOptions } = useSectionsList(selectedClassId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
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
          <h1 className="text-base font-semibold text-gray-900 truncate">Students</h1>
          <p className="text-xs sm:text-sm text-emerald-600 font-semibold mt-1 sm:mt-0.5">● {stats.totalActive} active students</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 h-9 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Bulk Add
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 h-9 text-xs font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + Add Student
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
          <StudentTable students={filtered} onEdit={setEditingStudent} onDelete={deleteStudent} />
        </>
      ))}

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddStudent}
          students={students}
        />
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={updateStudent}
        />
      )}

      {showBulkModal && (
        <BulkAddStudentModal
          onClose={() => {
            setShowBulkModal(false);
            loadStudents(academicYearId);
          }}
        />
      )}
    </div>
  );
};

export default StudentsPage;