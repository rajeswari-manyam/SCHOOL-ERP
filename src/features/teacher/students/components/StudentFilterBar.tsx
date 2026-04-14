import type { MyStudentsFilters, FeeStatus } from "../types/my-students.types";

interface Props {
  filters: MyStudentsFilters;
  onChange: (f: MyStudentsFilters) => void;
  totalCount: number;
  filteredCount: number;
  onExport: () => void;
}

const StudentFilterBar = ({ filters, onChange, totalCount, filteredCount, onExport }: Props) => {
  const set = (patch: Partial<MyStudentsFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search by name or roll no…"
          className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
        />
      </div>

      {/* Fee Status filter */}
      <select
        value={filters.feeStatus}
        onChange={(e) => set({ feeStatus: e.target.value as FeeStatus | "ALL" })}
        className="h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer"
      >
        <option value="ALL">All Fees</option>
        <option value="PAID">Paid</option>
        <option value="PENDING">Pending</option>
        <option value="PARTIAL">Partial</option>
        <option value="OVERDUE">Overdue</option>
      </select>

      {/* Attendance Range filter */}
      <select
        value={filters.attendanceRange}
        onChange={(e) => set({ attendanceRange: e.target.value as MyStudentsFilters["attendanceRange"] })}
        className="h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer"
      >
        <option value="ALL">All Attendance</option>
        <option value="BELOW_75">Below 75%</option>
        <option value="75_TO_90">75% – 90%</option>
        <option value="ABOVE_90">Above 90%</option>
      </select>

      {/* Count badge */}
      {filters.search || filters.feeStatus !== "ALL" || filters.attendanceRange !== "ALL" ? (
        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
          {filteredCount} of {totalCount}
        </span>
      ) : (
        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{totalCount} students</span>
      )}

      {/* Export */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 h-10 px-4 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors flex-shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export
      </button>
    </div>
  );
};

export default StudentFilterBar;
