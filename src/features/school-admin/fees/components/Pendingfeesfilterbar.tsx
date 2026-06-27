import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

interface PendingFeesFilterBarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  classFilter: string;
  onClassChange: (v: string) => void;
  sectionFilter: string;
  onSectionChange: (v: string) => void;
  classOptions: string[];
  sectionOptions: string[];
}

function PillSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm px-4 h-11 min-w-0 w-full">
      <select
        aria-label={value}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span className="flex-1 truncate text-sm font-medium text-gray-800 dark:text-slate-200 select-none pointer-events-none">
        {value}
      </span>
      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0 pointer-events-none" />
    </div>
  );
}

export function PendingFeesFilterBar({
  searchQuery, onSearchChange,
  classFilter, onClassChange,
  sectionFilter, onSectionChange,
  classOptions,
  sectionOptions,
}: PendingFeesFilterBarProps) {
  return (
    <div role="search" aria-label="Filter pending fees" className="mb-4">
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
          options={classOptions}
        />
        <PillSelect
          value={sectionFilter}
          onChange={onSectionChange}
          options={sectionOptions}
        />
      </div>
    </div>
  );
}
