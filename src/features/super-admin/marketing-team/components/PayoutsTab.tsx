import type { MarketingRep } from "../types/marketing.types";
import { RepAvatar, PayoutBadge } from "./RepBadges";
import { useMarketingMutations } from "../hooks/useMarketing";

interface PayoutsTabProps { reps: MarketingRep[]; }

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const COL = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 text-left";

const PayoutsTab = ({ reps }: PayoutsTabProps) => {
  const { approvePayout, approveAll } = useMarketingMutations();
  const totalPayout    = reps.reduce((s, r) => s + r.totalEarned, 0);
  const approvedAmount = reps.filter((r) => r.payoutStatus === "APPROVED").reduce((s, r) => s + r.totalEarned, 0);
  const pendingAmount  = reps.filter((r) => r.payoutStatus === "PENDING").reduce((s, r) => s + r.totalEarned, 0);
  const totalClosings  = reps.reduce((s, r) => s + r.mtdClosings, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Payout summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex flex-wrap items-center gap-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Payout This Month</p>
          <p className="text-2xl font-extrabold text-gray-900">{fmt(totalPayout)}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Approved</p>
          <p className="text-2xl font-extrabold text-emerald-600">{fmt(approvedAmount)}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-extrabold text-amber-500">{fmt(pendingAmount)}</p>
        </div>
        <button
          onClick={() => approveAll.mutate()}
          disabled={approveAll.isPending || pendingAmount === 0}
          className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Approve All
        </button>
      </div>

      {/* Payouts table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className={COL}>Rep</th>
              <th className={COL}>Territory</th>
              <th className={COL}>Closings</th>
              <th className={COL}>Per Closing Rate</th>
              <th className={COL}>Total Earned</th>
              <th className={COL}>Status</th>
              <th className={COL}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reps.map((rep) => (
              <tr key={rep.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <RepAvatar initials={rep.initials} size="sm" />
                    <span className="text-sm font-bold text-gray-900">{rep.name}</span>
                  </div>
                </td>
                <td className="px-4 py-5 text-sm text-gray-600">{rep.territory}</td>
                <td className="px-4 py-5 text-sm font-medium text-gray-700">{rep.mtdClosings}</td>
                <td className="px-4 py-5 text-sm text-gray-600">{fmt(rep.perClosingRate)}</td>
                <td className="px-4 py-5 text-sm font-bold text-gray-900">{fmt(rep.totalEarned)}</td>
                <td className="px-4 py-5"><PayoutBadge status={rep.payoutStatus} /></td>
                <td className="px-4 py-5">
                  {rep.payoutStatus === "PENDING" ? (
                    <button
                      onClick={() => approvePayout.mutate(rep.id)}
                      disabled={approvePayout.isPending}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300 italic">Approved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Total row */}
          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50/60">
              <td className="px-4 py-4 text-sm font-extrabold text-gray-900">Total</td>
              <td />
              <td className="px-4 py-4 text-sm font-bold text-indigo-600">{totalClosings} closings</td>
              <td />
              <td className="px-4 py-4 text-sm font-extrabold text-gray-900">{fmt(totalPayout)}</td>
              <td />
              <td className="px-4 py-4">
                <button
                  onClick={() => approveAll.mutate()}
                  disabled={approveAll.isPending || pendingAmount === 0}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wide hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Approve All
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PayoutsTab;
