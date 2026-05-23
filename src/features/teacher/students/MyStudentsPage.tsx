import { useState } from "react";
import { Check } from "lucide-react";
import { useMyStudents, MOCK_STUDENTS } from "./hooks/useMyStudents";
import ChronicAbsenteesAlert from "./components/ChronicAbsenteesAlert";
import StudentFilterBar from "./components/StudentFilterBar";
import StudentTable from "./components/StudentTable";
import StudentQuickViewDrawer from "./components/StudentQuickViewDrawer";

const MyStudentsPage = () => {
  const {
    filters, setFilters,
    filtered, chronicAbsentees,
    selectedStudent, isDrawerOpen,
    openDrawer, closeDrawer,
  } = useMyStudents();

  const [exportMsg, setExportMsg] = useState(false);

  const handleExport = () => {
    setExportMsg(true);
    setTimeout(() => setExportMsg(false), 3000);
  };

  // Determine selected student's index for avatar colour consistency
  const selectedIdx = selectedStudent
    ? MOCK_STUDENTS.findIndex((s) => s.id === selectedStudent.id)
    : 0;

  return (
    <div className="flex flex-col gap-0 min-h-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Students</h1>
          <p className="text-sm text-gray-400 mt-0.5">Class 8-A · {MOCK_STUDENTS.length} students enrolled</p>
        </div>
        {/* Export success toast */}
        {exportMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-xl animate-pulse">
            <Check size={14} className="text-current" strokeWidth={2.5} />
            Class list exported!
          </div>
        )}
      </div>

      {/* Chronic absentees alert */}
      <ChronicAbsenteesAlert students={chronicAbsentees} onView={openDrawer} />

      {/* Filter bar */}
      <StudentFilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={MOCK_STUDENTS.length}
        filteredCount={filtered.length}
        onExport={handleExport}
      />

      {/* Student table */}
      <StudentTable students={filtered} onView={openDrawer} />

      {/* Quick view drawer */}
      <StudentQuickViewDrawer
        student={selectedStudent}
        open={isDrawerOpen}
        onClose={closeDrawer}
        studentIndex={selectedIdx}
      />
    </div>
  );
};

export default MyStudentsPage;
