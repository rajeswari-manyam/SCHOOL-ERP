import type { TemplateFilters, TemplateCategory, TemplateLanguage, MetaStatus } from "../types/templates.types";
import { Select } from "@/components/ui/select";
interface TemplateFilterBarProps {
  filters: TemplateFilters;
  onChange: (patch: Partial<TemplateFilters>) => void;
}

const selectClass =
  "h-10 pl-3 pr-8 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-medium appearance-none cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition";

const CATEGORIES = ["ALL", "UTILITY", "MARKETING", "AUTHENTICATION"];
const LANGUAGES  = ["ALL", "Telugu", "English", "Telugu+English", "Hindi"];
const STATUSES   = ["ALL", "APPROVED", "PENDING", "REJECTED"];

const TemplateFilterBar = ({ filters, onChange }: TemplateFilterBarProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
    {/* Search */}
    <div className="relative flex-1 min-w-[220px]">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
        placeholder="Search template name..."
        className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition bg-white"
      />
    </div>

    {/* Category */}
    <div className="relative">
      <Select
        options={CATEGORIES.map((c) => ({ label: c === "ALL" ? "All Categories" : c, value: c }))}
        value={filters.category}
        onValueChange={(value) => onChange({ category: value as TemplateCategory | "ALL", page: 1 })}
        placeholder="Choose an option"
        className={selectClass}
      />
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>

    {/* Language */}
    <div className="relative">
      <Select
        options={LANGUAGES.map((l) => ({ label: l === "ALL" ? "All Languages" : l, value: l }))}
        value={filters.language}  
        onValueChange={(value) => onChange({ language: value as TemplateLanguage | "ALL", page: 1 })}
        placeholder="Choose an option"
        className={selectClass}
      />
      
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>

    {/* Status */}
    <div className="relative">
      <Select
        options={STATUSES.map((s) => ({ label: s === "ALL" ? "All Statuses" : s, value: s }))}
        value={filters.status}
        onValueChange={(value) => onChange({ status: value as MetaStatus | "ALL", page: 1 })}
        placeholder="Choose an option"
        className={selectClass}
      />
     
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  </div>
);

export default TemplateFilterBar;
