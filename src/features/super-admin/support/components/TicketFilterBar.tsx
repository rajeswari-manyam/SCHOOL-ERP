import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { TicketFilters, TicketPriority, TicketStatus } from "../types/support.types";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

interface TicketFilterBarProps {
  filters: TicketFilters;
  schools: string[];
  onChange: (patch: Partial<TicketFilters>) => void;
  onApply: () => void;
}

const selectClass =
  "h-10 pl-3 pr-8 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-medium appearance-none cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition";

const PRIORITIES = ["ALL", "URGENT", "HIGH", "MEDIUM", "LOW"];
const STATUSES   = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const TicketFilterBar = ({ filters, schools, onChange, onApply }: TicketFilterBarProps) => (
  <div className="flex flex-wrap items-center gap-3">
    {/* Search */}
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
      <input
        type="text"
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
        placeholder="Search tickets..."
        className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition bg-white"
      />
    </div>

    {/* Priority */}
    <div className="relative">
      <Select
        options={PRIORITIES.map((p) => ({ label: p === "ALL" ? "All Priorities" : p, value: p }))}
        value={filters.priority}
        onValueChange={(value) => onChange({ priority: value as TicketPriority | "ALL" })}
        placeholder="Choose an option"
        className={selectClass}
      />
     
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
    </div>

    {/* Status */}
    <div className="relative">
      <Select
        options={STATUSES.map((s) => ({ label: s === "ALL" ? "All Statuses" : s.replace("_", " "), value: s }))}
        value={filters.status}
        onValueChange={(value) => onChange({ status: value as TicketStatus | "ALL" })}
        placeholder="Choose an option"
        className={selectClass}
      />
     
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
    </div>

    {/* School */}
    <div className="relative">
      <Select
        options={[{ label: "All Schools", value: "" }, ...schools.map((s) => ({ label: s, value: s }))]}
        value={filters.school}
        onValueChange={(value) => onChange({ school: value })}
        placeholder="All Schools"
        className={`${selectClass} min-w-[140px]`}
      />
    
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
    </div>

    {/* Apply */}
    <Button
      onClick={onApply}
      className="h-10 px-5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0"
    >
      Apply Filters
    </Button>
  </div>
);

export default TicketFilterBar;
