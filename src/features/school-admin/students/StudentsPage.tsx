import { useState } from "react";
import { useStudents } from "../students/hooks/useStudents";
import StudentStatCards from "../students/components/StudentStatCards";
import StudentFilterBar from "../students/components/StudentFilterBar";
import StudentTable from "../students/components/StudentTable";
import AddStudentModal from "../students/components/AddStudentModal";
import type { AddStudentFormData } from "../students/types/student.types";

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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Students</h1>
          <p className="text-sm text-emerald-600 font-semibold mt-0.5">● {stats.totalActive} active students</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 text-xs font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Import CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
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