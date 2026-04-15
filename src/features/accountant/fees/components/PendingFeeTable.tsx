import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { FeeRow } from "../types/fees.types";
import { formatCurrency, getStatusColor } from "../utils/fee.utils";

export const PendingFeesTable = ({ data }: { data: FeeRow[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.student}</TableCell>
            <TableCell>{row.className}</TableCell>
            <TableCell>{formatCurrency(row.amount)}</TableCell>
            <TableCell>{row.dueDate}</TableCell>
            <TableCell className={getStatusColor(row.status)}>
              {row.status}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};