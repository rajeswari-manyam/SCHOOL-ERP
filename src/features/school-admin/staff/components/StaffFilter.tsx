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

const ROLES    = ["All Roles", "Class Teacher", "Subject Teacher", "Admin", "Support"];
const STATUSES = ["All Status", "ACTIVE", "ON_LEAVE", "INACTIVE"];

const ROLE_OPTIONS = ROLES.map(role => ({ label: role, value: role }));
const STATUS_OPTIONS = STATUSES.map(status => ({ label: status, value: status }));

export const StaffFilters = ({
  search, roleFilter, statusFilter, onSearch, onRoleChange, onStatusChange,
}: Props) => (
  <div className="flex items-center gap-3">
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <Input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search name or phone"
        inputSize="sm"
        className="pl-9 border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"
      />
    </div>

    <Select
      options={ROLE_OPTIONS}
      value={roleFilter}
      onValueChange={onRoleChange}
      className="h-9 border-slate-200 focus:ring-indigo-300"
    />

    <Select
      options={STATUS_OPTIONS}
      value={statusFilter}
      onValueChange={onStatusChange}
      className="h-9 border-slate-200 focus:ring-indigo-300"
    />

    <Button variant="outline" size="sm" className="w-9 h-9 p-0">
      <Filter className="w-4 h-4" />
    </Button>
  </div>
);