import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type{ StaffPayroll } from "../types/payroll.types";

export const PayrollTable = ({
  data,
  onProcess,
}: {
  data: StaffPayroll[];
  onProcess: () => void;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Present</TableHead>
          <TableHead>Absent</TableHead>
          <TableHead>Gross</TableHead>
          <TableHead>Deductions</TableHead>
          <TableHead>Net</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead> {/* ✅ add column */}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell>{row.present}</TableCell>
            <TableCell>{row.absent}</TableCell>
            <TableCell>{row.gross}</TableCell>
            <TableCell>{row.deductions}</TableCell>
            <TableCell>{row.net}</TableCell>
            <TableCell>
              {row.status === "Processed" ? (
                <span className="text-green-600">Processed</span>
              ) : (
                <span className="text-amber-600">Pending</span>
              )}
            </TableCell>

            {/* ✅ Action button */}
            <TableCell>
              {row.status === "Pending" && (
                <Button size="sm" onClick={onProcess}>
                  Process
                </Button>
              )}
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};