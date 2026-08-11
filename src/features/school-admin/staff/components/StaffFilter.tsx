import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select } from "../../../../components/ui/select";

interface Props {
  search: string;
  roleFilter: string;
  statusFilter: string;
  selectedStaffId: string;
  staffList: { id: string; name: string }[];
  onSearch: (v: string) => void;
  onRoleChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onStaffChange: (v: string) => void;
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
  { label: "Inactive",    value: "INACTIVE" },
];

export const StaffFilters = ({ search, roleFilter, statusFilter, selectedStaffId, staffList, onSearch, onRoleChange, onStatusChange, onStaffChange }: Props) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setShowAdvanced(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-nowrap items-center gap-3 overflow-x-auto"
      style={{ background: '#EFF4FF' }}
    >

      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name or phone"
          className="w-full h-9 pl-10 pr-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
        />
      </div>

      <Select
        options={ROLE_OPTIONS}
        value={roleFilter}
        onValueChange={onRoleChange}
        className="h-9 w-[130px] shrink-0 rounded-xl bg-gray-50 border-gray-200 text-xs"
      />
      <Select
        options={STATUS_OPTIONS}
        value={statusFilter}
        onValueChange={onStatusChange}
        className="h-9 w-[130px] shrink-0 rounded-xl bg-gray-50 border-gray-200 text-xs"
      />

      <div className="relative shrink-0" ref={panelRef}>
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced}
          className={`w-10 h-9 shrink-0 flex items-center justify-center rounded-xl border transition-colors ${
            showAdvanced || selectedStaffId
              ? "border-indigo-300 bg-indigo-50 text-indigo-600"
              : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {showAdvanced && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg z-20 p-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Filter by Staff Member
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => onStaffChange(e.target.value)}
              className="w-full h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">All Staff</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <p className="mt-1.5 text-[10px] text-gray-400">
              Narrows the leave balance card and Leave Requests tab to one staff member.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
