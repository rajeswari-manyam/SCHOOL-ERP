import { useState } from "react";
import { Calendar, ChevronDown, Search } from "lucide-react";
import type { AuditLogsFilters, AuditAction } from "../types/audit-logs.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const ACTION_OPTIONS: Array<{ label: string; value: AuditAction | "ALL" }> = [
  { label: "All Actions", value: "ALL" },
  { label: "School Created", value: "SCHOOL_CREATED" },
  { label: "School Suspended", value: "SCHOOL_SUSPENDED" },
  { label: "Payment Recorded", value: "PAYMENT_RECORDED" },
  { label: "Subscription Check", value: "SUBSCRIPTION_CHECK" },
  { label: "Template Assigned", value: "TEMPLATE_ASSIGNED" },
  { label: "Plan Changed", value: "PLAN_CHANGED" },
  { label: "Rep Added", value: "REP_ADDED" },
  { label: "Fee Reminder Batch", value: "FEE_REMINDER_BATCH" },
  { label: "Login", value: "LOGIN" },
  { label: "Logout", value: "LOGOUT" },
  { label: "Settings Updated", value: "SETTINGS_UPDATED" },
  { label: "User Deleted", value: "USER_DELETED" },
];
interface AuditLogsFilterBarProps {
  filters: AuditLogsFilters;
  onChange: (patch: Partial<AuditLogsFilters>) => void;
  onClear: () => void;
}

const selectClass =
  "h-10 pl-4 pr-9 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-medium appearance-none cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition";

const AuditLogsFilterBar = ({ filters, onChange, onClear }: AuditLogsFilterBarProps) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const hasFilters = filters.search || filters.action !== "ALL" || filters.actor || filters.startDate;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          placeholder="Search logs..."
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition bg-white"
        />
       
      </div>

      {/* Action filter */}
      <div className="relative">
        <Select
          options={ACTION_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
          value={filters.action}
          onValueChange={(value) => onChange({ action: value as AuditAction | "ALL", page: 1 })}
          placeholder="All Actions"
          className={selectClass}
        />
        
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
      </div>

      {/* Actor filter */}
      <div className="relative">
        <Select
          options={[
            { label: "All Actors", value: "" },
            { label: "Ravi Kumar", value: "Ravi Kumar" },
            { label: "System", value: "System" },
            { label: "Marketing Bot", value: "Marketing Bot" }
          ]}
          value={filters.actor}
          onValueChange={(value) => onChange({ actor: value as string | "", page: 1 })}
          className={selectClass}
          placeholder="All Actors"
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
      </div>

      {/* Date range picker */}
      <div className="relative">
        <Button
          onClick={() => setDatePickerOpen((p) => !p)}
          className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-medium hover:border-gray-300 transition"
        >
          <Calendar size={14} />
          {filters.startDate && filters.endDate
            ? `${filters.startDate} → ${filters.endDate}`
            : "Select Range"}
        </Button>

        {datePickerOpen && (
          <div className="absolute top-12 left-0 z-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-72">
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1 block">From</label>
                <Input
                  type="date"
                  value={filters.startDate ?? ""}
                  onChange={(e) => onChange({ startDate: e.target.value, page: 1 })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1 block">To</label>
                <Input
                  type="date"
                  value={filters.endDate ?? ""}
                  onChange={(e) => onChange({ endDate: e.target.value, page: 1 })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <Button
                onClick={() => setDatePickerOpen(false)}
                className="w-full h-9 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button
          onClick={onClear}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default AuditLogsFilterBar;
