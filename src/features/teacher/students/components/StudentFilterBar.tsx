import { Search, Download } from "lucide-react";
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
  const isFiltered = filters.search || filters.feeStatus !== "ALL" || filters.attendanceRange !== "ALL";
  const inputCls = "h-10 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={2} />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search by name or roll no…"
          className={`w-full pl-9 pr-4 ${inputCls}`}
        />
      </div>

      {/* Fee Status filter */}
      <select
        value={filters.feeStatus}
        onChange={(e) => set({ feeStatus: e.target.value as FeeStatus | "ALL" })}
        className={inputCls}
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
        className={inputCls}
      >
        <option value="ALL">All Attendance</option>
        <option value="BELOW_75">Below 75%</option>
        <option value="75_TO_90">75% – 90%</option>
        <option value="ABOVE_90">Above 90%</option>
      </select>

      {/* Count badge */}
      <span className="text-sm text-gray-500 whitespace-nowrap shrink-0">
        {isFiltered ? `${filteredCount} of ${totalCount}` : `${totalCount} students`}
      </span>

      {/* Export */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 h-10 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shrink-0"
      >
        <Download size={14} strokeWidth={2} />
        Export
      </button>
    </div>
  );
};

export default StudentFilterBar;
