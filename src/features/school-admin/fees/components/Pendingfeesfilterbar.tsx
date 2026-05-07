import type { FeeStatusFilter, SortOption } from "../types/fees.types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PendingFeesFilterBarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  classFilter: string;
  onClassChange: (v: string) => void;
  sectionFilter: string;
  onSectionChange: (v: string) => void;
  statusFilter: FeeStatusFilter;
  onStatusChange: (v: FeeStatusFilter) => void;
  feeHeadFilter: string;
  onFeeHeadChange: (v: string) => void;
  sortOption: SortOption;
  onSortChange: (v: SortOption) => void;
}

const STATUS_OPTIONS: FeeStatusFilter[] = [
  "All",
  "3-Day Warning",
  "Due Today",
  "Overdue",
  "Severely Overdue",
];
const CLASSES = [
  "All Classes", "Class 6", "Class 7", "Class 8",
  "Class 9", "Class 10", "Class 11", "Class 12",
];
const SECTIONS = ["All Sections", "Section A", "Section B", "Section C"];
const FEE_HEADS = [
  "All Fee Heads", "Tuition Fee", "Exam Fee",
  "Transport Fee", "Activity Fee", "Library Fee",
];
const SORT_OPTIONS: SortOption[] = ["Days Overdue", "Amount", "Name", "Due Date"];

// ─── Shared select wrapper ────────────────────────────────────────────────────
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </Select>
  );
}

// ─── PendingFeesFilterBar ─────────────────────────────────────────────────────
export function PendingFeesFilterBar({
  searchQuery, onSearchChange,
  classFilter, onClassChange,
  sectionFilter, onSectionChange,
  statusFilter, onStatusChange,
  feeHeadFilter, onFeeHeadChange,
  sortOption, onSortChange,
}: PendingFeesFilterBarProps) {
  return (
    <div
      role="search"
      aria-label="Filter pending fees"
      className="mb-4 space-y-3"
    >
      {/* ── Row 1: Search + Class + Section ─────────────────────────────── */}
      {/*
        Mobile  : stacked (1 col)
        sm+     : search full-width on first row, class+section on second row
        lg+     : all three in one row
      */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_160px_160px]">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          >
            🔍
          </span>
          <Input
            type="search"
            placeholder="Search student or admission no."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search students"
            className="h-10 w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <FilterSelect
          label="Filter by class"
          value={classFilter}
          onChange={onClassChange}
          options={CLASSES}
        />

        <FilterSelect
          label="Filter by section"
          value={sectionFilter}
          onChange={onSectionChange}
          options={SECTIONS}
        />
      </div>

      {/* ── Row 2: Status tabs ───────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="Filter by status"
        className="flex flex-wrap items-center gap-1.5"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mr-1 shrink-0">
          Status:
        </span>
        {STATUS_OPTIONS.map((s) => {
          const isActive = statusFilter === s;
          return (
            <Button
              key={s}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange(s)}
              aria-pressed={isActive}
              className={[
                "h-8 rounded-lg px-3 text-xs font-medium transition-colors duration-150",
                "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                isActive
                  ? "bg-indigo-600 text-white border-transparent hover:bg-indigo-700"
                  : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600",
              ].join(" ")}
            >
              {s}
            </Button>
          );
        })}
      </div>

      {/* ── Row 3: Fee Head + Sort ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_auto]">
        <FilterSelect
          label="Filter by fee head"
          value={feeHeadFilter}
          onChange={onFeeHeadChange}
          options={FEE_HEADS}
        />

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
            Sort:
          </span>
          <div className="flex-1 lg:w-44">
            <FilterSelect
              label="Sort by"
              value={sortOption}
              onChange={(v) => onSortChange(v as SortOption)}
              options={SORT_OPTIONS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}