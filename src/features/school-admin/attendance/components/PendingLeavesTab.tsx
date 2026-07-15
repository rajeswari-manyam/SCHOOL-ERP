import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, RefreshCw, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import api from "@/config/axios";
import { approveLeave, rejectLeave, fetchLeaves } from "@/services/staff.api";
import { getAllStaff } from "@/services/staff.api";
import { getStaffLeaveBalance } from "@/services/staff.api";
import type { LeaveBalanceResponse, LeaveRecord } from "@/services/staff.api";
import { useUIStore } from "@/store/uiStore";

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

const STATUS_BADGE: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
  pending:  "bg-amber-100 text-amber-700",
  cancelled:"bg-slate-100 text-slate-500",
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

const LEAVE_BALANCE_COLORS: Record<string, string> = {
  casual:   "bg-sky-50 border-sky-200 text-sky-700",
  sick:     "bg-rose-50 border-rose-200 text-rose-700",
  emergency:"bg-amber-50 border-amber-200 text-amber-700",
};

const isTodayInRange = (start: string, end: string) => {
  if (!start || !end) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  return today >= s && today <= e;
};

const PendingLeavesTab = () => {
  const qc = useQueryClient();
  const [filterStaffId, setFilterStaffId] = useState("");
  const [processing, setProcessing] = useState<Record<string, "approving" | "rejecting">>({});
  const [allStaff, setAllStaff] = useState<{ id: string; name: string }[]>([]);
  const academicYearId = useUIStore((s) => s.academicYearId);

  useEffect(() => {
    getAllStaff().then((res) => {
      const list = Array.isArray(res?.data) ? res.data : [];
      setAllStaff(list.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })));
    }).catch(() => {});
  }, []);

  const { data: leaves = [], isLoading, isError, refetch } = useQuery({
    queryKey: [...QUERY_KEY, filterStaffId],
    queryFn: () => fetchPendingLeaves(filterStaffId || undefined),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const { data: allLeavesToday = [], isLoading: todayLeavesLoading } = useQuery({
    queryKey: ['all-leaves-today'],
    queryFn: (): Promise<LeaveRecord[]> => fetchLeaves({}),
    staleTime: 30_000,
    refetchInterval: 120_000,
  });

  const { data: allStaffLeaves = [], isLoading: allLeavesLoading } = useQuery({
    queryKey: ['staff-all-leaves', filterStaffId],
    queryFn: (): Promise<LeaveRecord[]> => {
      if (!filterStaffId) return Promise.resolve([]);
      return fetchLeaves({ staff_id: filterStaffId });
    },
    enabled: !!filterStaffId,
    staleTime: 30_000,
  });

  const { data: leaveBalance, isLoading: balanceLoading } = useQuery({
    queryKey: ['leave-balance', filterStaffId, academicYearId],
    queryFn: async (): Promise<LeaveBalanceResponse | null> => {
      if (!filterStaffId) return null;
      return getStaffLeaveBalance(filterStaffId, academicYearId);
    },
    enabled: !!filterStaffId,
    staleTime: 30_000,
  });

  const todayLeaves = useMemo(() =>
    allLeavesToday.filter((l) => isTodayInRange(l.from, l.to)),
  [allLeavesToday]);

  const handleApprove = async (id: string) => {
    setProcessing(p => ({ ...p, [id]: "approving" }));
    try {
      await approveLeave(id);
      toast.success("Leave approved");
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ['all-leaves-today'] });
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
      qc.invalidateQueries({ queryKey: ['all-leaves-today'] });
    } catch {
      toast.error("Failed to reject leave");
    } finally {
      setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  const staffOptions = [...allStaff].sort((a, b) => a.name.localeCompare(b.name));
  const selectedStaffName = staffOptions.find((s) => s.id === filterStaffId)?.name ?? "";

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-amber-500" />
          <h2 className="text-sm font-bold text-gray-900">Leave Requests</h2>
          {!isLoading && filterStaffId && (
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
            {staffOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
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

      {/* Leave Balance Summary - shown when a specific staff is selected */}
      {filterStaffId && (
        <div className="rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-bold text-gray-900">Leave Balance</h3>
            {selectedStaffName && (
              <span className="text-xs text-gray-400">— {selectedStaffName}</span>
            )}
          </div>

          {balanceLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-4 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-20 mb-3" />
                  <div className="h-7 bg-gray-100 rounded w-12" />
                </div>
              ))}
            </div>
          ) : leaveBalance ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {leaveBalance.balance_list.map((item) => {
                  const colors = LEAVE_BALANCE_COLORS[item.leave_type] ?? "bg-gray-50 border-gray-200 text-gray-700";
                  return (
                    <div key={item.leave_type} className={`rounded-xl border p-4 ${colors}`}>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2">
                        {item.leave_type.charAt(0).toUpperCase() + item.leave_type.slice(1)} Leave
                      </p>
                      <div className="flex items-end gap-3">
                        <div className="text-center">
                          <p className="text-2xl font-extrabold leading-none">{item.balance}</p>
                          <p className="text-[10px] font-medium mt-0.5 opacity-70">Balance</p>
                        </div>
                        <div className="flex-1 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="opacity-70">Allocated</span>
                            <span className="font-semibold">{item.allocated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-70">Used</span>
                            <span className="font-semibold">{item.used}</span>
                          </div>
                          <div className="w-full bg-white/40 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-current rounded-full h-1.5 transition-all"
                              style={{ width: `${item.allocated ? Math.min(100, (item.used / item.allocated) * 100) : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span>Total Allocated: <strong>{leaveBalance.total_allocated}</strong></span>
                <span>Total Used: <strong>{leaveBalance.total_used}</strong></span>
                <span>Total Balance: <strong>{leaveBalance.total_balance}</strong></span>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400 text-center py-3">No leave allocation found.</p>
          )}
        </div>
      )}

      {/* Today's Leaves - only in All Staff mode */}
      {!filterStaffId && (
      <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-bold text-gray-900">Today's Leaves</h3>
          {todayLeaves.length > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-200 text-amber-800">
              {todayLeaves.length}
            </span>
          )}
        </div>
        {todayLeavesLoading ? (
          <div className="h-10 bg-amber-100/50 rounded-lg animate-pulse" />
        ) : todayLeaves.length === 0 ? (
          <p className="text-xs text-amber-600/70 text-center py-2">No leaves recorded for today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-amber-100/50 border-b border-amber-200">
                  <th className="text-[10px] font-bold uppercase tracking-wider text-amber-800 text-left px-3 py-2">Staff</th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-amber-800 text-left px-3 py-2">Type</th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-amber-800 text-left px-3 py-2">From</th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-amber-800 text-left px-3 py-2">To</th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-amber-800 text-center px-3 py-2">Days</th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-amber-800 text-left px-3 py-2">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {todayLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-amber-100/30 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${avatarColor(l.staffName ?? "")}`}>
                          {(l.staffName ?? "?").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{l.staffName ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${LEAVE_TYPE_STYLE[l.type?.toLowerCase()] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                        {l.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{fmt(l.from)}</td>
                    <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{fmt(l.to)}</td>
                    <td className="px-3 py-2.5 text-center text-gray-500 font-semibold">{l.days ?? "-"}</td>
                    <td className="px-3 py-2.5 text-gray-400 max-w-[180px] truncate">{l.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* All Leave History - shown only when staff selected */}
      {filterStaffId && (
        <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Leave History</h3>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500">
              {allStaffLeaves.length}
            </span>
          </div>
          {allLeavesLoading ? (
            <div className="divide-y divide-gray-50">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-gray-100" />
                    <div className="h-2.5 w-48 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : allStaffLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <CheckCircle2 size={28} className="text-gray-300" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-gray-400">No leave records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left px-4 py-2.5">#</th>
                    <th className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left px-4 py-2.5">Type</th>
                    <th className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left px-4 py-2.5">From</th>
                    <th className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left px-4 py-2.5">To</th>
                    <th className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center px-4 py-2.5">Days</th>
                    <th className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left px-4 py-2.5">Status</th>
                    <th className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left px-4 py-2.5">Reason</th>
                    <th className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left px-4 py-2.5">Applied On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allStaffLeaves.map((l, idx) => {
                    const typeStyle = LEAVE_TYPE_STYLE[l.type?.toLowerCase()] ?? "bg-gray-50 text-gray-600 border-gray-200";
                    const statusStyle = STATUS_BADGE[l.status?.toLowerCase()] ?? "bg-gray-100 text-gray-500";
                    const isToday = isTodayInRange(l.from, l.to);
                    return (
                      <tr key={l.id} className={`hover:bg-gray-50/60 transition-colors ${isToday ? "bg-amber-50/40" : ""}`}>
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${typeStyle}`}>
                            {l.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {fmt(l.from)}
                          {isToday && <span className="ml-1.5 text-[10px] font-semibold text-amber-600">●</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmt(l.to)}</td>
                        <td className="px-4 py-3 text-center text-gray-500 font-semibold">{l.days ?? "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusStyle}`}>
                            {l.status ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 max-w-[160px] truncate">{l.reason || "—"}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{l.createdAt ? fmt(l.createdAt.split("T")[0]) : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pending Leaves List */}
      {!filterStaffId && (
      <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
            <p className="text-sm font-medium">Failed to load leave requests</p>
            <button onClick={() => refetch()} className="text-xs text-indigo-600 hover:underline">Retry</button>
          </div>
        ) : leaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <CheckCircle2 size={32} className="text-emerald-300" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-gray-600">
              No pending leave requests
            </p>
            <p className="text-xs text-gray-400">All leave requests have been reviewed.</p>
          </div>
        ) : (
          <>
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
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(name)}`}>
                      {name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {fmt(leave.start_date)} → {fmt(leave.end_date)}
                        <span className="ml-1.5 font-semibold text-gray-500">{leave.total_days}d</span>
                      </p>
                    </div>

                    <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase shrink-0 ${typeStyle}`}>
                      {leave.leave_type}
                    </span>

                    <p className="hidden md:block text-xs text-gray-400 max-w-[160px] truncate shrink-0">
                      {leave.reason || "—"}
                    </p>

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
      )}
    </div>
  );
};

export default PendingLeavesTab;
