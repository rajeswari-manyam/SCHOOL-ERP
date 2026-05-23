import type { FeeStatusFilter, SortOption } from "../types/fees.types";
import { Input } from "@/components/ui/input";

import { ChevronDown } from "lucide-react";

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

// ─── Pill-style native select ────────────────────────────────────────────────
// Matches the screenshot: white rounded card, label text, chevron icon
function PillSelect({
  label,
  value,
  onChange,
  options,
  bold = false,
}: {
  label?: string;          // optional prefix label e.g. "SORT:"
  value: string;
  onChange: (v: string) => void;
  options: string[];
  bold?: boolean;          // bold value text (used for Sort dropdown)
}) {
  return (
    <div className="relative inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm px-4 h-11 min-w-0 w-full">
      {label && (
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 pr-0.5">
          {label}
        </span>
      )}
      {/* Native select is invisible but covers the whole pill */}
      <select
        aria-label={label ?? value}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {/* Visible label — shows current value */}
      <span
        className={`flex-1 truncate text-sm text-gray-800 dark:text-slate-200 select-none pointer-events-none
          ${bold ? "font-bold" : "font-medium"}`}
      >
        {value}
      </span>
      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0 pointer-events-none" />
    </div>
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
      className="space-y-3 mb-4"
    >
      {/* ── Row 1: Search · All Classes · All Sections ───────────────────── */}
      {/*
        Mobile : stacked 1 col
        sm+    : search spans 2 cols, dropdowns each 1 col
        lg+    : all three in one row [1fr · 160px · 160px]
      */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[1fr_168px_168px]">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </span>
          <Input
            type="search"
            placeholder="Search student/adm no."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search students"
            className="h-11 w-full rounded-2xl border border-gray-200 dark:border-slate-700
              bg-white dark:bg-slate-900 pl-10 pr-4
              text-sm text-gray-800 dark:text-slate-200
              shadow-sm placeholder:text-gray-400
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <PillSelect
          value={classFilter}
          onChange={onClassChange}
          options={CLASSES}
        />
        <PillSelect
          value={sectionFilter}
          onChange={onSectionChange}
          options={SECTIONS}
        />
      </div>

      {/* ── Row 2: STATUS pills ──────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="Filter by status"
        className="flex flex-wrap items-center gap-2"
      >
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mr-0.5">
          Status:
        </span>
        {STATUS_OPTIONS.map((s) => {
          const isActive = statusFilter === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onStatusChange(s)}
              aria-pressed={isActive}
              className={[
                "h-9 rounded-full px-4 text-sm font-medium border transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                "active:scale-95",
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-indigo-900"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-700 dark:hover:border-indigo-500",
              ].join(" ")}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* ── Row 3: All Fee Heads · Sort ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Fee head — fixed width pill */}
        <div className="w-full sm:w-44">
          <PillSelect
            value={feeHeadFilter}
            onChange={onFeeHeadChange}
            options={FEE_HEADS}
          />
        </div>

        {/* Sort pill — label inside the pill, bold value */}
        <div className="w-full sm:w-56">
          <PillSelect
            label="SORT:"
            value={sortOption}
            onChange={(v) => onSortChange(v as SortOption)}
            options={SORT_OPTIONS}
            bold
          />
        </div>
      </div>
    </div>
  );
}