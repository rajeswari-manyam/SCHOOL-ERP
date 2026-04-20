import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const classes = [
  "All Classes",
  "1A","1B","2A","2B","3A","3B","4A","4B","5A","5B",
  "6A","6B","7A","7B","8A","8B","9A","9B","10A","10B",
];
const modes = ["All Modes", "CASH", "UPI", "CHEQUE"];

type DueStatus = "All" | "3-Day Warning" | "Due Today" | "Overdue" | "Severely Overdue";

const DUE_STATUSES: {
  label: DueStatus;
  className: string;
  activeClassName: string;
}[] = [
  {
    label: "All",
    className: "border border-gray-300 text-gray-600 bg-white hover:bg-gray-50",
    activeClassName: "bg-[#3525CD] text-white border-[#3525CD]",
  },
  {
    label: "3-Day Warning",
    className: "border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100",
    activeClassName: "bg-amber-500 text-white border-amber-500",
  },
  {
    label: "Due Today",
    className: "border border-green-200 text-green-700 bg-green-50 hover:bg-green-100",
    activeClassName: "bg-green-600 text-white border-green-600",
  },
  {
    label: "Overdue",
    className: "border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100",
    activeClassName: "bg-orange-500 text-white border-orange-500",
  },
  {
    label: "Severely Overdue",
    className: "border border-red-200 text-red-700 bg-red-50 hover:bg-red-100",
    activeClassName: "bg-red-600 text-white border-red-600",
  },
];

const SORT_OPTIONS = [
  "Newest First",
  "Oldest First",
  "Amount (High to Low)",
  "Amount (Low to High)",
];

export interface FilterValues {
  search: string;
  dateFrom: string;
  dateTo: string;
  selectedClass: string;
  selectedMode: string;
  dueStatus: DueStatus;
  sortBy: string;
}

interface FilterBarProps {
  /** Called whenever filters change (Search click, pill click, sort change, clear) */
  onSearch?: (filters: FilterValues) => void;
  /** Show the DUE STATUS pills row — pass false for All Transactions tab */
  showDueStatus?: boolean;
  defaultDateFrom?: string;
  defaultDateTo?: string;
}

export const FilterBar = ({
  onSearch,
  showDueStatus = true,
  defaultDateFrom = "2025-04-01",
  defaultDateTo = "2025-04-07",
}: FilterBarProps) => {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(defaultDateFrom);
  const [dateTo, setDateTo] = useState(defaultDateTo);
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [dueStatus, setDueStatus] = useState<DueStatus>("All");
  const [sortBy, setSortBy] = useState("Newest First");

  const buildFilters = (overrides?: Partial<FilterValues>): FilterValues => ({
    search,
    dateFrom,
    dateTo,
    selectedClass,
    selectedMode,
    dueStatus,
    sortBy,
    ...overrides,
  });

  const handleSearch = () => onSearch?.(buildFilters());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleStatusClick = (status: DueStatus) => {
    setDueStatus(status);
    onSearch?.(buildFilters({ dueStatus: status }));
  };

  const handleSortChange = (value: string) => {
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
    <div className="flex flex-col gap-3">
      {/* ── Row 1: search · date range · class · mode · button ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
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

       <div className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 bg-[#EFF4FF] whitespace-nowrap">
          <span>📅</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border-none outline-none text-xs bg-transparent"
          />
          <span className="text-gray-400">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border-none outline-none text-xs bg-transparent"
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
className="h-9 px-3 rounded-lg border border-gray-200 text-xs text-gray-700 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
         className="h-9 px-3 rounded-lg border border-gray-200 text-xs text-gray-700 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {modes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <Button
          size="sm"
         className="h-9 px-5 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* ── Row 2: DUE STATUS pills + sort + clear ── */}
      {showDueStatus && (
        <div className="flex items-center gap-2 flex-wrap">
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

          <div className="ml-auto flex items-center gap-2">
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