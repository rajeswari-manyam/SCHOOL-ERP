import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import type { LeaveRecord } from "@/services/school-staff.api";
import { useStaffStore } from "../store/usestore";
import { getStaffLeaveSummary, fetchLeaves } from "@/services/school-staff.api";
import type { LeaveSummaryEntry } from "@/services/school-staff.api";
import { useUIStore } from "@/store/uiStore";
import { AlertDialog } from "@/components/ui/alert-dialog";

interface Props {
  leaves: LeaveRecord[];
}

const LEAVE_TYPE_COLOR: Record<string, string> = {
  casual:    "bg-blue-50 border-blue-200 text-blue-700",
  sick:      "bg-rose-50 border-rose-200 text-rose-700",
  emergency: "bg-amber-50 border-amber-200 text-amber-700",
};

const normalizeStatus = (status?: string) => (status ?? "PENDING").toUpperCase();

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/* ── Avatar ── */
const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
];

const Avatar = ({ name, id }: { name: string; id: string }) => {
  const initials = name.slice(0, 2).toUpperCase();
  const colorIdx = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[colorIdx]}`}>
      {initials}
    </div>
  );
};

/* ── Status badge ── */
const StatusBadge = ({ status }: { status: string }) => {
  const normalized = normalizeStatus(status);
  if (normalized === "APPROVED")
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">APPROVED</span>;
  if (normalized === "REJECTED")
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600">REJECTED</span>;
  if (normalized === "CANCELLED")
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">CANCELLED</span>;
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">PENDING</span>;
};

/* ── Table header cell ── */
const TH = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap ${className}`}>
    {children}
  </th>
);

export const LeaveRequestsTab = ({ leaves: _leaves }: Props) => {
  const approveLeave    = useStaffStore((s) => s.approveLeave);
  const rejectLeave     = useStaffStore((s) => s.rejectLeave);
  const leaveProcessing = useStaffStore((s) => s.leaveProcessing);
  const staffList       = useStaffStore((s) => s.staffData);

  const academicYearId = useUIStore.getState().academicYearId ?? "";

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [summary, setSummary]                 = useState<LeaveSummaryEntry[]>([]);
  const [summaryLoading, setSummaryLoading]   = useState(false);
  const [staffLeaves, setStaffLeaves]         = useState<LeaveRecord[]>([]);
  const [leavesLoading, setLeavesLoading]     = useState(false);
  const [todayLeaves, setTodayLeaves]         = useState<LeaveRecord[]>([]);
  const [todayLoading, setTodayLoading]       = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  // Fetch all leaves on mount and filter for today
  useEffect(() => {
    setTodayLoading(true);
    fetchLeaves()
      .then((all) => {
        const onLeaveToday = all.filter((l) => {
          const from = l.from ? l.from.slice(0, 10) : "";
          const to   = l.to   ? l.to.slice(0, 10)   : "";
          return from <= today && today <= to;
        });
        setTodayLeaves(onLeaveToday);
      })
      .catch(() => setTodayLeaves([]))
      .finally(() => setTodayLoading(false));
  }, [today]);

  useEffect(() => {
    if (!selectedStaffId) { setSummary([]); setStaffLeaves([]); return; }

    // Fetch balance summary
    setSummaryLoading(true);
    getStaffLeaveSummary(selectedStaffId, academicYearId)
      .then(setSummary)
      .catch(() => setSummary([]))
      .finally(() => setSummaryLoading(false));

    // Fetch leave history for selected staff
    setLeavesLoading(true);
    fetchLeaves({ staff_id: selectedStaffId })
      .then(setStaffLeaves)
      .catch(() => setStaffLeaves([]))
      .finally(() => setLeavesLoading(false));
  }, [selectedStaffId, academicYearId]);

  const displayLeaves = staffLeaves;

  const pending  = displayLeaves.filter((l) => normalizeStatus(l.status) === "PENDING").length;
  const approved = displayLeaves.filter((l) => normalizeStatus(l.status) === "APPROVED").length;
  const rejected = displayLeaves.filter((l) => normalizeStatus(l.status) === "REJECTED").length;

  const handleApprove = async (id: string) => {
    try {
      await approveLeave(id);
      toast.success("Leave approved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectLeave(id);
      toast.success("Leave rejected");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject");
    }
  };

  const editLeave = useStaffStore((s) => s.editLeave);
  const deleteLeave = useStaffStore((s) => s.deleteLeave);

  const [deleteTarget, setDeleteTarget] = useState<LeaveRecord | null>(null);
  const [editTarget, setEditTarget] = useState<LeaveRecord | null>(null);
  const [editReason, setEditReason] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const handleEditSubmit = async () => {
    if (!editTarget) return;
    try {
      await editLeave(editTarget.id, editReason, editStatus);
      toast.success("Leave updated");
      setEditTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update leave");
    }
  };

  const openEditDialog = (r: LeaveRecord) => {
    setEditTarget(r);
    setEditReason(r.reason || "");
    setEditStatus(r.status);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLeave(deleteTarget.id);
      toast.success("Leave deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete leave");
    }
  };

  return (
    <div className="space-y-4">

      {/* ── Leave Balance Summary (always first) ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Leave Balance Summary</h3>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="ml-auto text-sm border border-gray-200 rounded-xl px-3 py-1.5 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select staff member…</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {!selectedStaffId && (
          <p className="text-xs text-gray-400 text-center py-3">Select a staff member to view their leave balance.</p>
        )}

        {selectedStaffId && summaryLoading && (
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-24 mb-3" />
                <div className="h-7 bg-gray-100 rounded w-12" />
              </div>
            ))}
          </div>
        )}

        {selectedStaffId && !summaryLoading && summary.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {summary.map((s) => (
              <div key={s.id} className={`rounded-xl border p-4 ${LEAVE_TYPE_COLOR[s.leave_type] ?? "bg-gray-50 border-gray-200 text-gray-700"}`}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2">
                  {s.leave_type.charAt(0).toUpperCase() + s.leave_type.slice(1)} Leave
                </p>
                <div className="flex items-end gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold leading-none">{s.balance}</p>
                    <p className="text-[10px] font-medium mt-0.5 opacity-70">Balance</p>
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="opacity-70">Allocated</span>
                      <span className="font-semibold">{s.allocated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Used</span>
                      <span className="font-semibold">{s.used}</span>
                    </div>
                    <div className="w-full bg-white/40 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-current rounded-full h-1.5 transition-all"
                        style={{ width: `${s.allocated ? Math.min(100, (s.used / s.allocated) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedStaffId && !summaryLoading && summary.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">No leave allocation found for this staff member.</p>
        )}
      </div>

      {/* ── Today's Leaves — only when no staff selected ── */}
      {!selectedStaffId && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Today's Leaves
              <span className="ml-2 text-xs font-normal text-gray-400">
                {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </h3>
            {!todayLoading && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${todayLeaves.length > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                {todayLeaves.length} on leave
              </span>
            )}
          </div>

          {todayLoading ? (
            <div className="flex items-center justify-center py-6 gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
              Loading…
            </div>
          ) : todayLeaves.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No staff on leave today.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayLeaves.map((r) => (
                <div key={r.id} className="flex items-center gap-3 py-2.5">
                  <Avatar name={r.staffName ?? "?"} id={r.id} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.staffName ?? "—"}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {r.type} · {formatDate(r.from)} – {formatDate(r.to)}
                      {r.days ? ` · ${r.days} day${r.days > 1 ? "s" : ""}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Staff leave history — only when staff selected ── */}
      {selectedStaffId && (
        <>
      {/* ── Summary badges ── */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          Pending: {pending}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          Approved This Month: {approved}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          Rejected: {rejected}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-b border-gray-100" style={{ background: '#EFF4FF' }}>
                <TH>Staff Name</TH>
                <TH>Leave Type</TH>
                <TH>From</TH>
                <TH>To</TH>
                <TH>Days</TH>
                <TH>Reason</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leavesLoading ? (
                <tr>
                  <td colSpan={8} className="text-center text-sm text-gray-400 py-10">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                      Loading leaves…
                    </div>
                  </td>
                </tr>
              ) : displayLeaves.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-sm text-gray-400 py-10">
                    {selectedStaffId ? "No leave requests for this staff member." : "No leave requests found."}
                  </td>
                </tr>
              ) : (
                displayLeaves.map((r) => {
                  const isPending  = normalizeStatus(r.status) === "PENDING";
                  const isProcessing = !!leaveProcessing[r.id];
                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors ${isPending ? "bg-amber-50/60 hover:bg-amber-50" : "hover:bg-gray-50/60"}`}
                    >
                      {/* Staff Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.staffName ?? "?"} id={r.id} />
                          <p className="text-sm font-semibold text-gray-900 leading-snug">{r.staffName ?? "—"}</p>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-700">{r.type ?? "—"}</span>
                      </td>

                      {/* From */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-700 whitespace-nowrap">{formatDate(r.from)}</span>
                      </td>

                      {/* To */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-700 whitespace-nowrap">{formatDate(r.to)}</span>
                      </td>

                      {/* Days */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-gray-800">
                          {r.days != null ? `${r.days} ${Number(r.days) === 1 ? "day" : "days"}` : "—"}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="px-4 py-3.5 max-w-[180px]">
                        <span className="text-sm text-gray-500 line-clamp-2">{r.reason || "—"}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={r.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditDialog(r)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(r)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {isPending ? (
                            <>
                              <button
                                disabled={isProcessing}
                                onClick={() => handleApprove(r.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {leaveProcessing[r.id] === "approving" ? "Approving…" : "Approve"}
                              </button>
                              <button
                                disabled={isProcessing}
                                onClick={() => handleReject(r.id)}
                                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {leaveProcessing[r.id] === "rejecting" ? "Rejecting…" : "Reject"}
                              </button>
                            </>
                          ) : (
                            <span className="text-sm text-gray-300">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete Confirmation ── */}
      <AlertDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Leave Request?"
        description={`This will permanently delete the leave request for ${deleteTarget?.staffName ?? ""} (${deleteTarget?.type ?? ""}).`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      {/* ── Edit Reason Dialog ── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEditTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-1">Edit Leave Request</h3>
            <p className="text-xs text-gray-400 mb-4">
              {editTarget.staffName} — {editTarget.type} ({editTarget.days} day{editTarget.days > 1 ? 's' : ''})
            </p>

            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-4"
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Reason</label>
            <textarea
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              placeholder="Enter reason for leave…"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditTarget(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
