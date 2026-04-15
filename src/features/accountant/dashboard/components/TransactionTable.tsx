import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import type{ Transaction } from "../types/dashboard.types";
import { formatCurrency } from "../utils/format";

export const TransactionsTable = ({ data }: { data: Transaction[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Mode</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{t.time}</TableCell>
            <TableCell>{t.student}</TableCell>
            <TableCell>{t.className}</TableCell>
            <TableCell>{t.feeHead}</TableCell>
            <TableCell>{formatCurrency(t.amount)}</TableCell>
            <TableCell>{t.mode}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};