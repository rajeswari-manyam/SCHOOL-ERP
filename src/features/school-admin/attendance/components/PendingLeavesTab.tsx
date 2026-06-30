import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, RefreshCw, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import api from "@/config/axios";
import { approveLeave, rejectLeave } from "@/services/school-staff.api";

interface PendingLeave {
  id: string;
  staff_id: string;
  staff_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  academicYearId: string | null;
  staff?: { id: string; name: string; email?: string; phone?: string };
}

const LEAVE_TYPE_STYLE: Record<string, string> = {
  casual:    "bg-sky-50 text-sky-700 border-sky-200",
  sick:      "bg-rose-50 text-rose-700 border-rose-200",
  personal:  "bg-violet-50 text-violet-700 border-violet-200",
  emergency: "bg-amber-50 text-amber-700 border-amber-200",
};

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700", "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700",
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

const fmt = (d: string) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const QUERY_KEY = ["attendance", "pending-leaves"];

const fetchPendingLeaves = async (staffId?: string): Promise<PendingLeave[]> => {
  const params: Record<string, string> = {};
  if (staffId) params.staff_id = staffId;
  const { data } = await api.get("/tenant/getpendingleaves", { params });
  return Array.isArray(data?.data) ? data.data : [];
};

const PendingLeavesTab = () => {
  const qc = useQueryClient();
  const [filterStaffId, setFilterStaffId] = useState("");
  const [processing, setProcessing] = useState<Record<string, "approving" | "rejecting">>({});

  const { data: leaves = [], isLoading, isError, refetch } = useQuery({
    queryKey: [...QUERY_KEY, filterStaffId],
    queryFn: () => fetchPendingLeaves(filterStaffId || undefined),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const handleApprove = async (id: string) => {
    setProcessing(p => ({ ...p, [id]: "approving" }));
    try {
      await approveLeave(id);
      toast.success("Leave approved");
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    } catch {
      toast.error("Failed to approve leave");
    } finally {
      setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(p => ({ ...p, [id]: "rejecting" }));
    try {
      await rejectLeave(id);
      toast.success("Leave rejected");
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    } catch {
      toast.error("Failed to reject leave");
    } finally {
      setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  // Collect unique staff names for filter dropdown
  const staffOptions = Array.from(
    new Map(leaves.map(l => [l.staff_id, l.staff?.name ?? l.staff_name])).entries()
  );

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-amber-500" />
          <h2 className="text-sm font-bold text-gray-900">Pending Leave Requests</h2>
          {!isLoading && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
              {leaves.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStaffId}
            onChange={e => setFilterStaffId(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All Staff</option>
            {staffOptions.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-gray-100" />
                  <div className="h-2.5 w-48 rounded bg-gray-100" />
                </div>
                <div className="h-8 w-24 rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2 text-red-400">
            <p className="text-sm font-medium">Failed to load pending leaves</p>
            <button onClick={() => refetch()} className="text-xs text-indigo-600 hover:underline">Retry</button>
          </div>
        ) : leaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <CheckCircle2 size={32} className="text-emerald-300" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-gray-600">No pending leave requests</p>
            <p className="text-xs text-gray-400">All leave requests have been reviewed.</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-4 items-center px-5 py-2.5 bg-gray-50 border-b border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 col-start-2">Staff</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Type</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Duration</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Reason</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</span>
            </div>

            <div className="divide-y divide-gray-50">
              {leaves.map(leave => {
                const name = leave.staff?.name ?? leave.staff_name ?? "?";
                const typeStyle = LEAVE_TYPE_STYLE[leave.leave_type?.toLowerCase()] ?? "bg-gray-50 text-gray-600 border-gray-200";
                const busy = !!processing[leave.id];

                return (
                  <div key={leave.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(name)}`}>
                      {name.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Name + date */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {fmt(leave.start_date)} → {fmt(leave.end_date)}
                        <span className="ml-1.5 font-semibold text-gray-500">{leave.total_days}d</span>
                      </p>
                    </div>

                    {/* Leave type */}
                    <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase shrink-0 ${typeStyle}`}>
                      {leave.leave_type}
                    </span>

                    {/* Reason */}
                    <p className="hidden md:block text-xs text-gray-400 max-w-[160px] truncate shrink-0">
                      {leave.reason || "—"}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={busy}
                        onClick={() => handleApprove(leave.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                        {processing[leave.id] === "approving" ? "…" : "Approve"}
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => handleReject(leave.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold border border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle size={12} strokeWidth={2.5} />
                        {processing[leave.id] === "rejecting" ? "…" : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingLeavesTab;
