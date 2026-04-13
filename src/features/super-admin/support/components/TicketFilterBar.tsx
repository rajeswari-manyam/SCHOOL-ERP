import { useState } from "react";
import type { TicketFilters, TicketPriority, TicketStatus } from "../types/support.types";
import { Button } from "@/components/ui/button";


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
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
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
      <select
        value={filters.priority}
        onChange={(e) => onChange({ priority: e.target.value as TicketPriority | "ALL" })}
        className={selectClass}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p === "ALL" ? "All Priority" : p}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>

    {/* Status */}
    <div className="relative">
      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value as TicketStatus | "ALL" })}
        className={selectClass}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s === "ALL" ? "All Status" : s.replace("_", " ")}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>

    {/* School */}
    <div className="relative">
      <select
        value={filters.school}
        onChange={(e) => onChange({ school: e.target.value })}
        className={`${selectClass} min-w-[140px]`}
      >
        <option value="">All Schools</option>
        {schools.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
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
