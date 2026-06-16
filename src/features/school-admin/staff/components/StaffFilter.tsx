import { Search, Filter } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";

interface Props {
  search: string;
  roleFilter: string;
  statusFilter: string;
  onSearch: (v: string) => void;
  onRoleChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

const ROLES    = ["Teacher", "Admin", "Support", "Staff"];
const STATUSES = ["ACTIVE", "ON_LEAVE", "INACTIVE"];

const ROLE_OPTIONS   = [{ label: "All Roles", value: "" }, ...ROLES.map(role => ({ label: role, value: role }))];
const STATUS_OPTIONS = [{ label: "All Status", value: "" }, ...STATUSES.map(status => ({ label: status, value: status }))];

export const StaffFilters = ({
  search, roleFilter, statusFilter, onSearch, onRoleChange, onStatusChange,
}: Props) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

    {/* Search — full width on mobile, capped on larger screens */}
    <div className="relative w-full sm:flex-1 sm:max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <Input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search name or phone"
        inputSize="sm"
        className="pl-9 w-full border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
      />
    </div>

    {/* Selects + filter button — side by side on mobile too, but wrap if needed */}
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
      <Select
        options={ROLE_OPTIONS}
        value={roleFilter}
        onValueChange={onRoleChange}
        className="h-9 flex-1 min-w-[120px] sm:flex-none sm:w-auto border-slate-200 focus:ring-indigo-300"
      />

      <Select
        options={STATUS_OPTIONS}
        value={statusFilter}
        onValueChange={onStatusChange}
        className="h-9 flex-1 min-w-[120px] sm:flex-none sm:w-auto border-slate-200 focus:ring-indigo-300"
      />

      <Button variant="outline" size="sm" className="w-9 h-9 p-0 flex-shrink-0">
        <Filter className="w-4 h-4" />
      </Button>
    </div>

  </div>
);