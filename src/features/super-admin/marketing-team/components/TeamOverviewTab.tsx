import type { MarketingRep } from "../types/marketing.types";
import { RepAvatar, StatusBadge, PayoutBadge } from "./RepBadges";

interface TeamOverviewTabProps {
  reps: MarketingRep[];
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onView: (rep: MarketingRep) => void;
}

const COL = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 text-left";

const TeamOverviewTab = ({ reps, isLoading, total, page, pageSize, onPageChange, onView }: TeamOverviewTabProps) => {
  if (isLoading) {
    return <div className="divide-y">{[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 px-4 py-5 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-100" />
        <div className="flex-1 space-y-2 pt-1"><div className="h-3 w-32 rounded bg-gray-100"/><div className="h-2.5 w-20 rounded bg-gray-100"/></div>
        <div className="w-20 h-6 rounded-full bg-gray-100 self-center" />
        <div className="w-8 h-3 rounded bg-gray-100 self-center" />
        <div className="w-8 h-3 rounded bg-gray-100 self-center" />
      </div>
    ))}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className={COL}>Rep</th>
            <th className={COL}>Territory</th>
            <th className={COL}>Today's Status</th>
            <th className={COL}>MTD Demos</th>
            <th className={COL}>MTD Closings</th>
            <th className={COL}>Month Target</th>
            <th className={COL}>Payout Status</th>
            <th className={COL}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {reps.map((rep) => (
            <tr key={rep.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-5">
                <div className="flex items-center gap-3">
                  <RepAvatar initials={rep.initials} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{rep.name}</p>
                    <p className="text-xs text-gray-400">{rep.role}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-5 text-sm text-gray-600">{rep.territory}</td>
              <td className="px-4 py-5"><StatusBadge status={rep.todayStatus} /></td>
              <td className="px-4 py-5 text-sm font-medium text-gray-700">{rep.mtdDemos}</td>
              <td className="px-4 py-5 text-sm font-medium text-gray-700">{rep.mtdClosings}</td>
              <td className="px-4 py-5 text-sm text-gray-600">{rep.monthTarget} closings</td>
              <td className="px-4 py-5"><PayoutBadge status={rep.payoutStatus} /></td>
              <td className="px-4 py-5">
                <button onClick={() => onView(rep)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination footer */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
        <p className="text-sm text-gray-400">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} total field representatives</p>
        <div className="flex items-center gap-1">
          {[...Array(Math.ceil(total / pageSize))].map((_, i) => (
            <button key={i} onClick={() => onPageChange(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-indigo-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamOverviewTab;
