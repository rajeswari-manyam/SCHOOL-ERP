import { Pencil } from "lucide-react";
import { formatCurrency } from "../../utils/payroll.utils";
import type { StaffPayroll } from "../../types/payroll.types";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

import typography, { combineTypography } from "@/styles/typography";

interface PayrollTableProps {
  data: StaffPayroll[];
  isProcessed?: boolean;
}

export const PayrollTable = ({
  data,
  isProcessed = false,
}: PayrollTableProps) => {
  const totalPresent = data.reduce((sum, s) => sum + s.present, 0);
  const totalAbsent = data.reduce((sum, s) => sum + s.absent, 0);
  const totalGross = data.reduce((sum, s) => sum + s.gross, 0);
  const totalDeductions = data.reduce((sum, s) => sum + s.deductions, 0);
  const totalNet = data.reduce((sum, s) => sum + s.net, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#3525CD] transition-all">
      <div className="overflow-x-auto no-scrollbar">
        <Table className="min-w-[900px]">
          {/* Header */}
          <TableHeader>
            <TableRow>
              <TableHead>Staff</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Absent</TableHead>
              <TableHead>Gross</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead className="text-[#3525CD]">Net</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {data.map((staff) => (
              <TableRow key={staff.id}>
                {/* Staff */}
                <TableCell>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar fallback={staff.initials} size="sm" />
                    <span
                      className={combineTypography(
                        typography.body.small,
                        "font-medium text-gray-900"
                      )}
                    >
                      {staff.name}
                    </span>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell className={combineTypography(typography.body.xs, "text-gray-600")}>
                  {staff.role}
                </TableCell>

                {/* Present */}
                <TableCell>{staff.present}</TableCell>

                {/* Absent */}
                <TableCell
                  className={staff.absent > 0 ? "text-red-500 font-medium" : ""}
                >
                  {staff.absent}
                </TableCell>

                {/* Gross */}
                <TableCell>{formatCurrency(staff.gross)}</TableCell>

                {/* Deductions */}
                <TableCell className="text-red-500">
                  {formatCurrency(staff.deductions)}
                </TableCell>

                {/* Net */}
                <TableCell className="font-semibold text-[#3525CD]">
                  {formatCurrency(staff.net)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={isProcessed ? "success" : "warning"}>
                    {isProcessed ? "Processed" : "Draft"}
                  </Badge>
                </TableCell>

                {/* Action */}
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {/* Totals Row */}
            <TableRow className="bg-blue-50/40 font-medium">
              <TableCell>Total</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{totalPresent}</TableCell>
              <TableCell className="text-red-500">{totalAbsent}</TableCell>
              <TableCell>{formatCurrency(totalGross)}</TableCell>
              <TableCell className="text-red-500">
                {formatCurrency(totalDeductions)}
              </TableCell>
              <TableCell className="font-bold text-[#3525CD]">
                {formatCurrency(totalNet)}
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};