import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { TemplateFilters, TemplateCategory, TemplateLanguage, MetaStatus } from "../types/templates.types";
import { Select } from "@/components/ui/select";

interface TemplateFilterBarProps {
  filters: TemplateFilters;
  onChange: (patch: Partial<TemplateFilters>) => void;
}

// const selectClass =
//   "h-9 sm:h-10 pl-3 pr-8 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-700 font-medium appearance-none cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition w-full";

const CATEGORIES = ["ALL", "UTILITY", "MARKETING", "AUTHENTICATION"];
const LANGUAGES  = ["ALL", "Telugu", "English", "Telugu+English", "Hindi"];
const STATUSES   = ["ALL", "APPROVED", "PENDING", "REJECTED"];

const TemplateFilterBar = ({ filters, onChange }: TemplateFilterBarProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasActiveFilters =
    filters.category !== "ALL" ||
    filters.language  !== "ALL" ||
    filters.status    !== "ALL";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* ── Main row: search + mobile filter toggle ── */}
      <div className="flex items-center gap-2 px-3 py-3 sm:px-4">

        {/* Search — grows to fill available width */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            placeholder="Search template name..."
            className="h-9 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:h-10"
          />
        </div>

        {/* Desktop selects — hidden on mobile */}
        <div className="hidden items-center gap-2 sm:flex">
          <SelectField
            options={CATEGORIES.map((c) => ({ label: c === "ALL" ? "All Categories" : c, value: c }))}
            value={filters.category}
            onValueChange={(v) => onChange({ category: v as TemplateCategory | "ALL", page: 1 })}
          />
          <SelectField
            options={LANGUAGES.map((l) => ({ label: l === "ALL" ? "All Languages" : l, value: l }))}
            value={filters.language}
            onValueChange={(v) => onChange({ language: v as TemplateLanguage | "ALL", page: 1 })}
          />
          <SelectField
            options={STATUSES.map((s) => ({ label: s === "ALL" ? "All Statuses" : s, value: s }))}
            value={filters.status}
            onValueChange={(v) => onChange({ status: v as MetaStatus | "ALL", page: 1 })}
          />
        </div>

        {/* Mobile filter toggle button */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-label="Toggle filters"
          className={[
            "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition sm:hidden",
            hasActiveFilters
              ? "border-indigo-300 bg-indigo-50 text-indigo-600"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50",
          ].join(" ")}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {/* Active dot indicator */}
          {hasActiveFilters && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-indigo-500" />
          )}
        </button>
      </div>

      {/* ── Mobile filter panel — slides open below search row ── */}
      {filtersOpen && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2 sm:hidden">
          <div className="flex flex-col gap-2">
            <SelectField
              label="Category"
              options={CATEGORIES.map((c) => ({ label: c === "ALL" ? "All Categories" : c, value: c }))}
              value={filters.category}
              onValueChange={(v) => onChange({ category: v as TemplateCategory | "ALL", page: 1 })}
            />
            <SelectField
              label="Language"
              options={LANGUAGES.map((l) => ({ label: l === "ALL" ? "All Languages" : l, value: l }))}
              value={filters.language}
              onValueChange={(v) => onChange({ language: v as TemplateLanguage | "ALL", page: 1 })}
            />
            <SelectField
              label="Status"
              options={STATUSES.map((s) => ({ label: s === "ALL" ? "All Statuses" : s, value: s }))}
              value={filters.status}
              onValueChange={(v) => onChange({ status: v as MetaStatus | "ALL", page: 1 })}
            />

            {/* Clear filters — only shown when something is active */}
            {hasActiveFilters && (
              <button
                onClick={() =>
                  onChange({ category: "ALL", language: "ALL", status: "ALL", page: 1 })
                }
                className="mt-1 w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Reusable select wrapper ── */
interface SelectFieldProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onValueChange: (v: string) => void;
}

const SelectField = ({ label, options, value, onValueChange }: SelectFieldProps) => (
  <div className="relative w-full sm:w-auto">
    {/* Optional label for mobile panel */}
    {label && (
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
    )}
    <Select
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder="Choose an option"
     
      className={[
        "h-9 sm:h-10 w-full sm:w-auto",
        "pl-3 pr-8 rounded-xl border border-gray-200 bg-white",
        "text-xs sm:text-sm text-gray-700 font-medium",
        "appearance-none cursor-pointer",
        "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition",
      ].join(" ")}
    />
    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 sm:top-1/2" style={{ top: label ? "calc(50% + 10px)" : undefined }} />
  </div>
);

export default TemplateFilterBar;