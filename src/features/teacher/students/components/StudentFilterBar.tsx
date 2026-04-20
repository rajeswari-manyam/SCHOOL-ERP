import { Search, Download } from "lucide-react";
import type { MyStudentsFilters, FeeStatus } from "../types/my-students.types";
import { Button } from "@/components/ui/button";
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
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
          size={15}
          strokeWidth={2}
        />
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
      <Button
        onClick={onExport}
        className="gap-2 h-10 px-4 bg-indigo-600 text-white hover:bg-indigo-700 flex-shrink-0"
      >
        <Download size={14} className="text-current" strokeWidth={2} />
        Export
      </Button>
    </div>
  );
};

export default StudentFilterBar;
