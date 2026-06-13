import { useState } from "react";
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
import type { LeaveRecord } from "../api/staff.api";
import { useStaffStore } from "../store/usestore";

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
  const rejectLeave = useStaffStore((s) => s.rejectLeave);
  const leaveProcessing = useStaffStore((s) => s.leaveProcessing);
  const [confirmId, setConfirmId] = useState<string | null>(null);

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