import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../../components/ui/table";
import type { LeaveRecord } from "@/services/school-staff.api";
import { useStaffStore } from "../store/usestore";
import { getStaffLeaveSummary } from "@/services/leave-allocation.api";
import type { StaffLeaveSummary } from "@/services/leave-allocation.api";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";

interface Props {
  leaves: LeaveRecord[];
}

const COLUMNS = [
  "Staff Name",
  "Leave Type",
  "From",
  "To",
  "Days",
  "Reason",
  "Status",
  "Actions",
];

const LEAVE_TYPE_COLOR: Record<string, string> = {
  casual:    "bg-blue-50 border-blue-200 text-blue-700",
  sick:      "bg-rose-50 border-rose-200 text-rose-700",
  emergency: "bg-amber-50 border-amber-200 text-amber-700",
};

const normalizeStatus = (status?: string) => (status ?? "PENDING").toUpperCase();

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const LeaveBadge = ({ status }: { status: string }) => {
  const normalized = normalizeStatus(status);
  const color =
    normalized === "APPROVED"
      ? "bg-emerald-100 text-emerald-700"
      : normalized === "REJECTED"
      ? "bg-red-100 text-red-700"
      : normalized === "CANCELLED"
      ? "bg-slate-100 text-slate-600"
      : "bg-amber-100 text-amber-700";

  return (
    <span className={`px-2 py-1 text-xs rounded-md font-medium ${color}`}>
      {normalized}
    </span>
  );
};

export const LeaveRequestsTab = ({ leaves }: Props) => {
  const approveLeave = useStaffStore((s) => s.approveLeave);
  const rejectLeave  = useStaffStore((s) => s.rejectLeave);
  const leaveProcessing = useStaffStore((s) => s.leaveProcessing);
  const staffList    = useStaffStore((s) => s.staffData);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const academicYearId = useUIStore.getState().academicYearId ?? "";
  const school_code    = useAuthStore.getState().user?.schoolcode ?? localStorage.getItem("schoolcode") ?? "";

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [summary, setSummary]     = useState<StaffLeaveSummary[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (!selectedStaffId || !academicYearId) { setSummary([]); return; }
    setSummaryLoading(true);
    getStaffLeaveSummary({ staff_id: selectedStaffId, academicYearId, school_code })
      .then(setSummary)
      .catch(() => setSummary([]))
      .finally(() => setSummaryLoading(false));
  }, [selectedStaffId, academicYearId, school_code]);

  const requests = leaves;

  const pending = requests.filter(
    (s) => s.status === "PENDING"
  ).length;

  const approved = requests.filter(
    (s) => s.status === "APPROVED"
  ).length;

  const rejected = requests.filter(
    (s) => s.status === "REJECTED"
  ).length;

  const handleApprove = async (id: string) => {
    setConfirmId(null);
    try {
      await approveLeave(id);
      toast.success("Leave approved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    setConfirmId(null);
    try {
      await rejectLeave(id);
      toast.success("Leave rejected");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject");
    }
  };

  return (
    <div className="space-y-4">

      {/* ── Staff Leave Balance Summary ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h3 className="text-sm font-bold text-gray-900">Leave Balance Summary</h3>
          <select
            value={selectedStaffId}
            onChange={e => setSelectedStaffId(e.target.value)}
            className="ml-auto text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select staff member…</option>
            {staffList.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {!selectedStaffId && (
          <p className="text-xs text-gray-400 text-center py-3">Select a staff member to view their leave balance.</p>
        )}

        {selectedStaffId && summaryLoading && (
          <div className="grid grid-cols-3 gap-3">
            {[0,1,2].map(i => (
              <div key={i} className="rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-24 mb-3" />
                <div className="h-7 bg-gray-100 rounded w-12" />
              </div>
            ))}
          </div>
        )}

        {selectedStaffId && !summaryLoading && summary.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {summary.map(s => (
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

      {/* STATS */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-amber-600">Pending: {pending}</span>
        <span className="text-emerald-600">Approved: {approved}</span>
        <span className="text-red-500">Rejected: {rejected}</span>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} className="text-center text-sm text-gray-500 py-8">
                  No leave requests were returned by /tenant/getallleaves.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                      {r.staffName?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p className="font-medium">{r.staffName ?? '—'}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{r.type}</TableCell>
                <TableCell>{formatDate(r.from)}</TableCell>
                <TableCell>{formatDate(r.to)}</TableCell>
                <TableCell>{r.days}</TableCell>
                <TableCell className="max-w-xs">{r.reason || "—"}</TableCell>

                <TableCell>
                  <LeaveBadge status={r.status} />
                </TableCell>

                <TableCell>
                  {r.status === "PENDING" ? (
                    <div className="flex gap-2">
                      {confirmId === r.id ? (
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={!!leaveProcessing[r.id]}
                            onClick={() => handleApprove(r.id)}
                          >
                            {leaveProcessing[r.id] === 'approving' ? '…' : 'Yes'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            disabled={!!leaveProcessing[r.id]}
                            onClick={() => setConfirmId(null)}
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={!!leaveProcessing[r.id]}
                            onClick={() => setConfirmId(r.id)}
                          >
                            {leaveProcessing[r.id] === 'approving'
                              ? 'Approving…'
                              : leaveProcessing[r.id] === 'rejecting'
                              ? 'Rejecting…'
                              : 'Approve'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!!leaveProcessing[r.id]}
                            onClick={() => handleReject(r.id)}
                          >
                            {leaveProcessing[r.id] === 'rejecting' ? 'Rejecting…' : 'Reject'}
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};