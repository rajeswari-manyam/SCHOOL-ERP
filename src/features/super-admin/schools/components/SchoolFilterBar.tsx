import type { SchoolFilters, Plan, SchoolStatus } from "../types/school.types";

interface SchoolFilterBarProps {
  filters: SchoolFilters;
  cities: string[];
  onChange: (patch: Partial<SchoolFilters>) => void;
  onClear: () => void;
}

const PLANS = ["ALL", "STARTER", "GROWTH", "PRO"];
const STATUSES = ["ALL", "ACTIVE", "TRIAL", "SUSPENDED", "EXPIRED"];

const selectClass =
  "h-10 px-3 pr-8 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-medium appearance-none cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";

const SchoolFilterBar = ({ filters, cities, onChange, onClear }: SchoolFilterBarProps) => {
  const hasActiveFilters =
    filters.search || filters.plan !== "ALL" || filters.status !== "ALL" || filters.city;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          placeholder="Search school name, city..."
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
      </div>

      {/* Plan */}
      <div className="relative">
        <select
          value={filters.plan}
          onChange={(e) => onChange({ plan: e.target.value as Plan | "ALL", page: 1 })}
          className={selectClass}
        >
          {PLANS.map((p) => (
            <option key={p} value={p}>{p === "ALL" ? "All Plans" : p}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      {/* Status */}
      <div className="relative">
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value as SchoolStatus | "ALL", page: 1 })}
          className={selectClass}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? "All Status" : s}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      {/* City */}
      <div className="relative">
        <select
          value={filters.city}
          onChange={(e) => onChange({ city: e.target.value, page: 1 })}
          className={selectClass}
        >
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors ml-auto"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default SchoolFilterBar;