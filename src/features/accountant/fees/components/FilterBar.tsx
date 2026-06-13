import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { DueStatus, FilterValues, FilterBarProps } from "../types/fees.types";
import {
  FILTER_CLASSES,
  FILTER_MODES,
  SORT_OPTIONS,
  DUE_STATUSES,
} from "../constants/fee.constants";

export const FilterBar = ({
  onSearch,
  showDueStatus = true,
  defaultDateFrom = "2025-04-01",
  defaultDateTo = "2025-04-07",
}: FilterBarProps) => {
  const [search, setSearch]               = useState("");
  const [dateFrom, setDateFrom]           = useState(defaultDateFrom);
  const [dateTo, setDateTo]               = useState(defaultDateTo);
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedMode, setSelectedMode]   = useState("All Modes");
  const [dueStatus, setDueStatus]         = useState<DueStatus>("All");
  const [sortBy, setSortBy]               = useState("Newest First");

  const buildFilters = (overrides?: Partial<FilterValues>): FilterValues => ({
    search, dateFrom, dateTo, selectedClass, selectedMode, dueStatus, sortBy,
    ...overrides,
  });

  const handleSearch      = () => onSearch?.(buildFilters());
  const handleKeyDown     = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };
  const handleStatusClick = (status: DueStatus) => {
    setDueStatus(status);
    onSearch?.(buildFilters({ dueStatus: status }));
  };
  const handleSortChange  = (value: string) => {
    setSortBy(value);
    onSearch?.(buildFilters({ sortBy: value }));
  };
  const handleClear = () => {
    const cleared: FilterValues = {
      search: "",
      dateFrom: defaultDateFrom,
      dateTo: defaultDateTo,
      selectedClass: "All Classes",
      selectedMode: "All Modes",
      dueStatus: "All",
      sortBy: "Newest First",
    };
    setSearch(cleared.search);
    setDateFrom(cleared.dateFrom);
    setDateTo(cleared.dateTo);
    setSelectedClass(cleared.selectedClass);
    setSelectedMode(cleared.selectedMode);
    setDueStatus(cleared.dueStatus);
    setSortBy(cleared.sortBy);
    onSearch?.(cleared);
  };

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      {/* ── Row 1: search · date range · class · mode · button ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 w-full min-w-0">
        {/* Search */}
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by receipt no. or student..."
            className="w-full pl-9 pr-3 h-9 text-xs rounded-lg border border-gray-200 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Date range */}
        <div className="flex items-center gap-1 h-9 px-2 rounded-lg border border-gray-200 text-xs text-gray-600 bg-[#EFF4FF] shrink-0">
          <span>📅</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border-none outline-none text-xs bg-transparent w-[100px]"
          />
          <span className="text-gray-400">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border-none outline-none text-xs bg-transparent w-[100px]"
          />
        </div>

        {/* Class */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="h-9 px-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-indigo-200 shrink-0"
        >
          {FILTER_CLASSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Mode */}
        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          className="h-9 px-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-indigo-200 shrink-0"
        >
          {FILTER_MODES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Search button */}
        <Button
          size="sm"
          className="h-9 px-4 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white shrink-0"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* ── Row 2: DUE STATUS pills + sort + clear ── */}
      {showDueStatus && (
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-xs font-medium text-gray-500 shrink-0 uppercase tracking-wide">
            Due Status:
          </span>

          {DUE_STATUSES.map(({ label, className, activeClassName }) => (
            <button
              key={label}
              onClick={() => handleStatusClick(label)}
              className={`text-xs px-3 py-1 rounded-full font-medium border transition-colors whitespace-nowrap ${
                dueStatus === label ? activeClassName : className
              }`}
            >
              {label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-500 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-7 px-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <button
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-gray-600 underline whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};