import { useState } from "react";
import { useStudents } from "../students/hooks/useStudents";
import StudentStatCards from "../students/components/StudentStatCards";
import StudentFilterBar from "../students/components/StudentFilterBar";
import StudentTable from "../students/components/StudentTable";
import AddStudentModal from "../students/components/AddStudentModal";
import type { AddStudentFormData } from "../students/types/student.types";
import { Download, Plus } from "lucide-react";

const StudentsPage = () => {
  const {
    filtered, loading, stats,
    search, setSearch,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    addStudent,
  } = useStudents();

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddStudent = async (data: AddStudentFormData) => {
    await addStudent(data);
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
      />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <StudentTable students={filtered} />
          <p className="text-xs text-gray-400 text-center">Showing {filtered.length} student{filtered.length !== 1 ? "s" : ""}</p>
        </>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddStudent}
        />
      )}
    </div>
  );
};

export default StudentsPage;