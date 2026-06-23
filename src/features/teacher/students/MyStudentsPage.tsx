import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { useMyStudents } from "./hooks/useMyStudents";
import ChronicAbsenteesAlert from "./components/ChronicAbsenteesAlert";
import StudentFilterBar from "./components/StudentFilterBar";
import StudentTable from "./components/StudentTable";
import StudentQuickViewDrawer from "./components/StudentQuickViewDrawer";

const MyStudentsPage = () => {
  const {
    students, filtered, chronicAbsentees, isLoading, isError, error,
    filters, setFilters,
    selectedStudent, isDrawerOpen,
    openDrawer, closeDrawer,
  } = useMyStudents();

  const [exportMsg, setExportMsg] = useState(false);

  const handleExport = () => {
    setExportMsg(true);
    setTimeout(() => setExportMsg(false), 3000);
  };

  const first = students[0];
  const headerClass = first ? `${first.className}${first.section ? ` - ${first.section}` : ""}` : "—";

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 min-h-full p-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-gray-100" />
        <div className="space-y-3 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6">
        <AlertCircle size={40} className="text-red-400" strokeWidth={1.5} />
        <p className="text-red-500 font-medium">Failed to load students.</p>
        <p className="text-sm text-gray-500 max-w-md text-center">
          {error instanceof Error ? error.message : "Something went wrong. Please try again."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-h-full p-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {headerClass} · {students.length} student{students.length === 1 ? "" : "s"} enrolled
          </p>
        </div>
        {exportMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-2 rounded-lg">
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
        totalCount={students.length}
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
        studentIndex={selectedStudent ? students.findIndex((s) => s.id === selectedStudent.id) : 0}
      />
    </div>
  );
};

export default MyStudentsPage;
