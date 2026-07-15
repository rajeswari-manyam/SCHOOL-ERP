import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import type { ClassOption } from "@/services/student.api";

interface StudentFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  classFilter: string;
  setClassFilter: (v: string) => void;
  sectionFilter: string;
  setSectionFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  classOptions?: ClassOption[];
  sectionOptions?: ClassOption[];
}

const STATUSES = [
  { value: "All",         label: "All Status"   },
  { value: "Active",      label: "Active"       },
  { value: "Transferred", label: "Transferred"  },
];

const StudentFilterBar = ({
  search,
  setSearch,
  classFilter,
  setClassFilter,
  sectionFilter,
  setSectionFilter,
  statusFilter,
  setStatusFilter,
  classOptions = [],
  sectionOptions = [],
}: StudentFilterBarProps) => {
  const classSelectOptions = [
    { value: "All", label: "All Classes" },
    ...classOptions.map((c) => ({ value: c.value, label: c.label })),
  ];
  const sectionSelectOptions = [
    { value: "All", label: "All Sections" },
    ...sectionOptions.map((s) => ({ value: s.value, label: s.label })),
  ];
  const [panelOpen, setPanelOpen] = useState(false);

  const hasActiveFilters =
    classFilter   !== "All" ||
    sectionFilter !== "All" ||
    statusFilter  !== "All";

  const clearAll = () => {
    setClassFilter("All");
    setSectionFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="flex flex-col gap-2">

      {/* ── Row 1: Search + mobile toggle + desktop filters ── */}
      <div className="flex items-center gap-2">

        {/* Search — grows to fill */}
        <div className="relative min-w-0 flex-1">
          <Input
            placeholder="Search by name or admission no."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full text-xs sm:h-10"
          />
          {/* Clear search */}
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Desktop: inline selects + advanced button */}
        <div className="hidden items-center gap-2 sm:flex">
          {/* Class */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-400">Class</span>
            <Select
              value={classFilter}
              onValueChange={setClassFilter}
              options={classSelectOptions}
               className="h-9 w-[120px] rounded-lg border-gray-200 text-xs sm:h-10"
            />
          </div>

          {/* Section */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-400">Section</span>
            <Select
              value={sectionFilter}
              onValueChange={setSectionFilter}
              options={sectionSelectOptions}
              className="h-9 w-[120px] rounded-lg border-gray-200 text-xs sm:h-10"
            />
          </div>

          {/* Status */}
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={STATUSES}
            className="h-9 w-[130px] rounded-lg border-gray-200 text-xs sm:h-10"
          />

        </div>

        {/* Mobile: filter toggle button */}
        <button
          onClick={() => setPanelOpen((v) => !v)}
          aria-expanded={panelOpen}
          aria-label="Toggle filters"
          className={[
            "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition sm:hidden",
            hasActiveFilters
              ? "border-indigo-300 bg-indigo-50 text-indigo-600"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50",
          ].join(" ")}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-indigo-500" />
          )}
        </button>
      </div>

      {/* ── Row 2: Mobile filter panel ── */}
      {panelOpen && (
        <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:hidden">

          {/* Class */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Class
            </span>
            <Select
              value={classFilter}
              onValueChange={setClassFilter}
              options={classSelectOptions}
               className="h-9 w-full rounded-lg border-gray-200 text-xs"
            />
          </div>

          {/* Section */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Section
            </span>
            <Select
              value={sectionFilter}
              onValueChange={setSectionFilter}
              options={sectionSelectOptions}
              className="h-9 w-full rounded-lg border-gray-200 text-xs"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Status
            </span>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={STATUSES}
              className="h-9 w-full rounded-lg border-gray-200 text-xs"
            />
          </div>

          {/* Footer: clear filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={clearAll}
                className="rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-semibold text-gray-500 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentFilterBar;