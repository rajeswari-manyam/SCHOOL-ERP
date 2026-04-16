import { Button } from "../../../../components/ui/button";

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

export const StaffFilters = ({
  search, roleFilter, statusFilter, onSearch, onRoleChange, onStatusChange,
}: Props) => (
  <div className="flex items-center gap-3">
    <div className="relative flex-1 max-w-sm">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search name or phone"
        className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white"
      />
    </div>

    <select
      value={roleFilter}
      onChange={(e) => onRoleChange(e.target.value)}
      className="h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      {ROLES.map((r) => <option key={r}>{r}</option>)}
    </select>

    <select
      value={statusFilter}
      onChange={(e) => onStatusChange(e.target.value)}
      className="h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      {STATUSES.map((s) => <option key={s}>{s}</option>)}
    </select>

    <Button variant="outline" size="sm" className="w-9 h-9 p-0">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
      </svg>
    </Button>
  </div>
);