import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import type{ PaymentModeSummary } from "../types/dashboard.types";
import { formatCurrency } from "../utils/format";

export const PaymentModeTable = ({
  data,
}: {
  data: PaymentModeSummary[];
}) => {
  return (
    <Table>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.mode}>
            <TableCell>{item.mode}</TableCell>
            <TableCell>{formatCurrency(item.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};