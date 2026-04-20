import type { ClassAttendanceRow } from "../types/attendance.types";
import { TeacherAvatar } from "./TeacherAvatar";
import { StatusBadge, MethodBadge } from "./StatusBadge";

import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../../components/ui/table";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../components/ui/card";

interface Props {
  rows: ClassAttendanceRow[];
  date: string;
  onSendReminder: () => void;
  isSendingReminder?: boolean;
}

const Dash = () => <span className="text-gray-300">—</span>;

export function AttendanceTable({
  rows,
  date,
  onSendReminder,
  isSendingReminder,
}: Props) {
  const unmarkedCount = rows.filter(
    (r) => r.status === "NOT_MARKED"
  ).length;

  return (
    <Card className="rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>
            Class-wise Attendance — Today
          </CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            {date}
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-blue-500 text-xs">
              ↻ Auto-refreshing every 60s
            </span>
          </CardDescription>
        </div>

        {unmarkedCount > 0 && (
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
            {unmarkedCount} class
            {unmarkedCount > 1 ? "es" : ""} pending
          </span>
        )}
      </CardHeader>

      {/* Table */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Class / Sec",
                "Class Teacher",
                "Total",
                "Present",
                "Absent",
                "Status",
                "Method",
                "Alerts",
              ].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row) => {
              const isUnmarked = row.status === "NOT_MARKED";

              return (
                <TableRow
                  key={row.id}
                  className={
                    isUnmarked
                      ? "bg-orange-50/40 hover:bg-orange-50/70"
                      : ""
                  }
                >
                  <TableCell className="font-bold text-base">
                    {row.cls}
                  </TableCell>

                  <TableCell>
                    <TeacherAvatar
                      initials={row.teacherInitials}
                      name={row.teacherName}
                    />
                  </TableCell>

                  <TableCell>{row.total}</TableCell>

                  <TableCell className="font-semibold text-emerald-600">
                    {row.present ?? <Dash />}
                  </TableCell>

                  <TableCell className="font-semibold text-red-500">
                    {row.absent ?? <Dash />}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>

                  <TableCell>
                    <MethodBadge method={row.method} />
                  </TableCell>

                  <TableCell>
                    {row.alertsSent ?? <Dash />}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      {/* Footer */}
      {unmarkedCount > 0 && (
        <CardFooter>
          <Button
            onClick={onSendReminder}
            disabled={isSendingReminder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
          >
            {isSendingReminder ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Sending…
              </span>
            ) : (
              "📣 Send Reminder to All Unmarked Classes"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}