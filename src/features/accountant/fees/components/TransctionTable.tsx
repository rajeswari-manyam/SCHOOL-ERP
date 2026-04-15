import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { Transaction } from "../types/fees.types";
import { formatCurrency } from "../utils/fee.utils";

export const TransactionsTable = ({ data }: { data: Transaction[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Mode</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{t.date}</TableCell>
            <TableCell>{t.student}</TableCell>
            <TableCell>{formatCurrency(t.amount)}</TableCell>
            <TableCell>{t.mode}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};