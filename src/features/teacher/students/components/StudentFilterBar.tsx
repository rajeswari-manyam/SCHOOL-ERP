import { Search } from "lucide-react";
import type { MyStudentsFilters } from "../types/my-students.types";

interface Props {
  filters: MyStudentsFilters;
  onChange: (f: MyStudentsFilters) => void;
  totalCount: number;
  filteredCount: number;
}

const StudentFilterBar = ({ filters, onChange, totalCount, filteredCount }: Props) => {
  const set = (patch: Partial<MyStudentsFilters>) => onChange({ ...filters, ...patch });
  const isFiltered = filters.search || filters.attendanceRange !== "ALL";
  const inputCls = "h-8 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

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

      {/* Attendance filter + count — grouped into one row on mobile, flattened back on sm+ */}
      <div className="flex items-center justify-between gap-3 sm:contents">
        <select
          value={filters.attendanceRange}
          onChange={(e) => set({ attendanceRange: e.target.value as MyStudentsFilters["attendanceRange"] })}
          className={`${inputCls} flex-1 sm:flex-none`}
        >
          <option value="ALL">All Attendance</option>
          <option value="BELOW_75">Below 75%</option>
          <option value="75_TO_90">75% – 90%</option>
          <option value="ABOVE_90">Above 90%</option>
        </select>

        {/* Count badge */}
        <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
          {isFiltered ? `${filteredCount} of ${totalCount}` : `${totalCount} students`}
        </span>
      </div>
    </div>
  );
};

export default StudentFilterBar;
