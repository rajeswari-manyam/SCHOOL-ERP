import { useState } from "react";
import type { School } from "../types/school.types";
import SchoolAvatar from "./Schoolavatar";
import { PlanBadge, StatusBadge } from "./Schoolbadges";
import SubscriptionEndCell from "./Subscriptionendcell";
import SchoolActionsMenu from "./Schoolactionmenu";

interface SchoolTableProps {
  schools: School[];
  isLoading: boolean;
}

const COL_CLASS = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3";

const SchoolTable = ({ schools, isLoading }: SchoolTableProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected = schools.length > 0 && selectedIds.size === schools.length;

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(schools.map((s) => s.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100">
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
                <SchoolActionsMenu school={school} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolTable;