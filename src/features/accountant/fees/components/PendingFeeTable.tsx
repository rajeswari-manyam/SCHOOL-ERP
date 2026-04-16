import type { FeeRow } from "../types/fees.types";
import { formatCurrency } from "../utils/fee.utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // adjust path if needed
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function DaysOverdueBadge({ days }: { days: number }) {
  if (days === 0)
    return (
      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
        Today
      </span>
    );
  if (days <= 5)
    return (
      <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200">
        {days} days
      </span>
    );
  return (
    <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
      {days} days
    </span>
  );
}
export const PendingFeesTable = ({ data }: { data: FeeRow[] }) => {
  return (
    <Table>
      <TableHeader className="bg-[#EFF4FF]">
        <TableRow>
          <TableHead className="w-8 px-4 py-3">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded border-gray-300"
            />
          </TableHead>

          <TableHead>Student</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Fee Head</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Days Overdue</TableHead>
          <TableHead>Reminders</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row, idx) => (
          <TableRow
            key={row.id}
            className={row.daysOverdue > 10 ? "bg-red-50/30" : ""}
          >
            <TableCell className="px-4 py-3">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" />
            </TableCell>

            {/* Student */}
            <TableCell>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${AVATAR_COLORS[idx % AVATAR_COLORS.length]
                    }`}
                >
                  {getInitials(row.student)}
                </div>
                <div>
                  <p className="font-medium text-xs">{row.student}</p>
                  <p className="text-gray-400 text-xs">{row.admissionNo}</p>
                </div>
              </div>
            </TableCell>

            <TableCell>{row.className}</TableCell>
            <TableCell>{row.feeHead}</TableCell>

            <TableCell className="font-medium">
              {formatCurrency(row.amount)}
            </TableCell>

            <TableCell className="text-gray-600">
              {row.dueDate}
            </TableCell>

            <TableCell>
              <DaysOverdueBadge days={row.daysOverdue} />
            </TableCell>

            <TableCell className="text-gray-500">
              {row.reminders} Sent
            </TableCell>

            <TableCell>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2.5 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Mark Paid
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};