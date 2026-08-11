import { AlertCircle } from "lucide-react";
import { useMyStudents } from "./hooks/useMyStudents";
import ChronicAbsenteesAlert from "./components/ChronicAbsenteesAlert";
import StudentFilterBar from "./components/StudentFilterBar";
import StudentTable from "./components/StudentTable";

const MyStudentsPage = () => {
  const {
    students, filtered, chronicAbsentees, isLoading, isError, error,
    filters, setFilters,
  } = useMyStudents();

  const first = students[0];
  const headerClass = first ? `${first.className}${first.section ? ` - ${first.section}` : ""}` : "—";

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 min-h-full px-3 sm:px-6 pt-2 pb-6">
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
    <div className="flex flex-col gap-4 min-h-full px-3 sm:px-6 pt-2 pb-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">My Students</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {headerClass} · {students.length} student{students.length === 1 ? "" : "s"} enrolled
          </p>
        </div>
      </div>

      {/* Chronic absentees alert */}
      <ChronicAbsenteesAlert students={chronicAbsentees} />

      {/* Filter bar */}
      <StudentFilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={students.length}
        filteredCount={filtered.length}
      />

      {/* Student table */}
      <StudentTable students={filtered} />
    </div>
  );
};

export default MyStudentsPage;
