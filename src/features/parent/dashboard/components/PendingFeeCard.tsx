import { useEffect, useState } from "react";
import { getPendingFeesByStudentId } from "@/services/fee.api";
import type { StudentFeeSummaryResponse } from "@/services/fee.api";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const STATUS_STYLE: Record<string, string> = {
  PARTIAL: "bg-amber-50 text-amber-600 border-amber-200",
  PENDING: "bg-red-50 text-red-600 border-red-200",
  PAID:    "bg-emerald-50 text-emerald-600 border-emerald-200",
};

interface Props {
  studentId: string;
}

export function PendingFeeCard({ studentId }: Props) {
  const [data, setData]     = useState<StudentFeeSummaryResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    getPendingFeesByStudentId(studentId)
      .then((res) => { if (res?.status) setData(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentId]);

  const summary = data?.summary;
  const details = data?.details ?? [];
  const paidPct = summary && summary.totalFinal > 0
    ? Math.round((summary.totalPaid / summary.totalFinal) * 100)
    : 0;

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">Fee Status</h3>
        {summary && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[summary.overallStatus] ?? STATUS_STYLE["PENDING"]}`}>
            {summary.overallStatus}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 animate-pulse">
          <div className="h-8 w-2/3 rounded-lg bg-gray-100" />
          <div className="h-3 w-full rounded-full bg-gray-100" />
          <div className="h-4 w-full rounded-lg bg-gray-100" />
          <div className="h-4 w-full rounded-lg bg-gray-100" />
        </div>
      ) : !summary ? (
        <p className="text-xs text-gray-400 text-center py-4">No fee data available.</p>
      ) : (
        <>
          {/* Total due */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Total Due</p>
            <p className="text-2xl font-black text-red-500 tabular-nums">{fmt(summary.totalDue)}</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-gray-400">
              <span>Paid ({paidPct}%)</span>
              <span>Pending ({100 - paidPct}%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                style={{ width: `${paidPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>{fmt(summary.totalPaid)} paid</span>
              <span>{fmt(summary.totalFinal)} total</span>
            </div>
          </div>

          {/* Detail rows */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-50">
            {details.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{d.feeHeadName ?? "Fee"}</p>
                  {d.dueDate && (
                    <p className="text-[10px] text-gray-400">Due {d.dueDate}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold text-red-500">{fmt(d.dueAmount)}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${STATUS_STYLE[d.status] ?? STATUS_STYLE["PENDING"]}`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
