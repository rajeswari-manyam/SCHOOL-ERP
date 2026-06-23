import { Search, SlidersHorizontal } from "lucide-react";
import { Select } from "../../../../components/ui/select";

interface Props {
  search: string;
  roleFilter: string;
  statusFilter: string;
  onSearch: (v: string) => void;
  onRoleChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

const ROLE_OPTIONS = [
  { label: "All Roles",    value: "" },
  { label: "Teacher",      value: "Teacher" },
  { label: "Admin",        value: "Admin" },
  { label: "Support",      value: "Support" },
  { label: "Staff",        value: "Staff" },
];

const STATUS_OPTIONS = [
  { label: "All Status",  value: "" },
  { label: "Active",      value: "ACTIVE" },
  { label: "On Leave",    value: "ON_LEAVE" },
  { label: "Inactive",    value: "INACTIVE" },
];

export const StaffFilters = ({ search, roleFilter, statusFilter, onSearch, onRoleChange, onStatusChange }: Props) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

    {/* Search */}
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search name or phone"
        className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
      />
    </div>

    {/* Dropdowns + filter icon */}
    <div className="flex items-center gap-2">
      <Select
        options={ROLE_OPTIONS}
        value={roleFilter}
        onValueChange={onRoleChange}
        className="h-10 rounded-xl bg-gray-50 border-gray-200 text-sm min-w-[120px]"
      />
      <Select
        options={STATUS_OPTIONS}
        value={statusFilter}
        onValueChange={onStatusChange}
        className="h-10 rounded-xl bg-gray-50 border-gray-200 text-sm min-w-[120px]"
      />
      <button className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-500">
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>

  </div>
);
