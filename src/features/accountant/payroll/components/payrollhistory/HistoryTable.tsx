import { Eye, Download } from "lucide-react";
import { formatCurrency } from "../../utils/payroll.utils";
import type { PayrollHistory } from "../../types/payroll.types";

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


interface HistoryTableProps {
  data: PayrollHistory[];
}

export const HistoryTable = ({ data }: HistoryTableProps) => {
  return (
    <div className="w-full">
      {/* ✅ MOBILE SCROLL WRAPPER */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table className="min-w-[750px]">
          
          {/* HEADER */}
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Gross</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead className="text-[#3525CD]">Net</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {data.map((record, idx) => (
              <TableRow key={idx}>

                <TableCell className="font-medium">
                  {record.month} {record.year}
                </TableCell>

                <TableCell>{record.staffCount}</TableCell>

                <TableCell>
                  {formatCurrency(record.totalGross)}
                </TableCell>

                <TableCell className="text-red-500">
                  {formatCurrency(record.totalDeductions)}
                </TableCell>

                <TableCell className="font-semibold text-[#3525CD]">
                  {formatCurrency(record.netPaid)}
                </TableCell>

                <TableCell>{record.paymentDate}</TableCell>

                <TableCell>{record.mode}</TableCell>

                {/* ✅ STATUS USING BADGE */}
                <TableCell>
                  <Badge variant="success">
                    {record.status}
                  </Badge>
                </TableCell>

                {/* ✅ ACTIONS USING BUTTON */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
    </div>
  );
};