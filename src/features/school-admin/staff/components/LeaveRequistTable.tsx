import type { StaffMember } from "../types/staff.types";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../../components/ui/table";
import { StaffAvatar } from "./StaffAvathar";

interface Props {
  staff: StaffMember[];
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

// small badge (NO external dependency)
const LeaveBadge = ({ status }: { status: string }) => {
  const color =
    status === "APPROVED"
      ? "bg-emerald-100 text-emerald-700"
      : status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span className={`px-2 py-1 text-xs rounded-md font-medium ${color}`}>
      {status}
    </span>
  );
};

export const LeaveRequestsTab = ({ staff }: Props) => {
  const requests = staff.filter((s) => s.leaveRequest);

  const pending = requests.filter(
    (s) => s.leaveRequest?.status === "PENDING"
  ).length;

  const approved = requests.filter(
    (s) => s.leaveRequest?.status === "APPROVED"
  ).length;

  const rejected = requests.filter(
    (s) => s.leaveRequest?.status === "REJECTED"
  ).length;

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
            {requests.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StaffAvatar initials={s.initials} status={s.status} />
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.role}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{s.leaveRequest?.type}</TableCell>
                <TableCell>{s.leaveRequest?.from}</TableCell>
                <TableCell>{s.leaveRequest?.to}</TableCell>
                <TableCell>{s.leaveRequest?.days}</TableCell>
                <TableCell>{s.leaveRequest?.reason}</TableCell>

                <TableCell>
                  <LeaveBadge
                    status={s.leaveRequest?.status ?? "PENDING"}
                  />
                </TableCell>

                <TableCell>
                  {s.leaveRequest?.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button size="sm">Approve</Button>
                      <Button variant="outline" size="sm">
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};