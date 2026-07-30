import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, RefreshCw, Ban, Download } from "lucide-react";
import type { School } from "../types/school.types";
import SchoolAvatar from "./Schoolavatar";
import { PlanBadge, StatusBadge } from "./Schoolbadges";
import SubscriptionEndCell from "./Subscriptionendcell";
import SchoolActionsMenu from "./Schoolactionmenu";
import { useSchoolMutations } from "../hooks/useSchools";

interface SchoolTableProps {
  schools: School[];
  isLoading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const COL_CLASS = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3";

const SchoolTable = ({ schools, isLoading, onView, onEdit }: SchoolTableProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { suspendSchool } = useSchoolMutations();

  const allSelected = schools.length > 0 && selectedIds.size === schools.length;

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(schools.map((s) => s.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedSchools = schools.filter((s) => selectedIds.has(s.id));

  const handleSuspendSelected = () => {
    selectedSchools.forEach((s) => suspendSchool.mutate(s.id));
    toast.success(`Suspending ${selectedSchools.length} school(s)…`);
    setSelectedIds(new Set());
  };

  const handleExportSelected = () => {
    const header = ["School", "City", "Plan", "Status", "Students", "Subscription End"];
    const rows = selectedSchools.map((s) => [s.name, s.city, s.plan, s.status, String(s.students), s.subscriptionEnd]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schools-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-gray-50 last:border-0 animate-pulse">
            <div className="w-4 h-4 rounded bg-gray-100" />
            <div className="w-10 h-10 rounded-full bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 rounded bg-gray-100" />
              <div className="h-2.5 w-24 rounded bg-gray-100" />
            </div>
            <div className="w-16 h-5 rounded bg-gray-100" />
            <div className="w-16 h-5 rounded bg-gray-100" />
            <div className="w-10 h-4 rounded bg-gray-100" />
            <div className="w-24 h-8 rounded bg-gray-100" />
            <div className="w-16 h-4 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-50 border-b border-indigo-100 px-4 py-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer"
            />
            <span className="text-sm font-semibold text-indigo-700">
              {selectedIds.size} school{selectedIds.size > 1 ? "s" : ""} selected
            </span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => toast.info("WhatsApp broadcast to selected schools — coming soon")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Send WhatsApp
            </button>
            <button
              onClick={() => toast.info("Bulk plan change — coming soon")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Change Plan
            </button>
            <button
              onClick={handleSuspendSelected}
              disabled={suspendSchool.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Ban className="w-3.5 h-3.5" /> Suspend Selected
            </button>
            <button
              onClick={handleExportSelected}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export Selected
            </button>
          </div>
        </div>
      )}
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100 bg-[#EFF4FF]">
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer"
              />
            </th>
            <th className={`${COL_CLASS} text-left`}>School</th>
            <th className={`${COL_CLASS} text-left`}>Plan</th>
            <th className={`${COL_CLASS} text-left`}>Status</th>
            <th className={`${COL_CLASS} text-left`}>Students</th>
            <th className={`${COL_CLASS} text-left`}>Subscription End</th>
            <th className={`${COL_CLASS} text-left`}>Last Active</th>
            <th className={`${COL_CLASS} text-left`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {schools.map((school) => (
            <tr
              key={school.id}
              className={`hover:bg-gray-50/60 transition-colors ${selectedIds.has(school.id) ? "bg-indigo-50/30" : ""}`}
            >
              {/* Checkbox */}
              <td className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(school.id)}
                  onChange={() => toggleOne(school.id)}
                  className="w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer"
                />
              </td>

              {/* School */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <SchoolAvatar initials={school.initials} color={school.avatarColor} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{school.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{school.city}</p>
                  </div>
                </div>
              </td>

              {/* Plan */}
              <td className="px-4 py-4">
                <PlanBadge plan={school.plan} />
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <StatusBadge status={school.status} />
              </td>

              {/* Students */}
              <td className="px-4 py-4 text-sm font-medium text-gray-700">
                {school.students.toLocaleString()}
              </td>

              {/* Subscription End */}
              <td className="px-4 py-4">
                <SubscriptionEndCell dateStr={school.subscriptionEnd} status={school.status} />
              </td>

              {/* Last Active */}
              <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                {school.lastActive}
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <SchoolActionsMenu school={school} onView={onView} onEdit={onEdit} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolTable;