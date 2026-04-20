import { Pencil } from "lucide-react";
import { formatCurrency } from "../../utils/payroll.utils";
import type { SalaryConfig } from "../../types/payroll.types";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../../../components/ui/table";

interface SalaryTableProps {
  data: SalaryConfig[];
  onEdit: (staff: SalaryConfig) => void;
}

export const SalaryTable = ({ data, onEdit }: SalaryTableProps) => {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <Table className="min-w-[900px] border-0">
        <TableHeader className="border-0">
          <TableRow className="border-0">
            <TableHead className="border-0">Staff Name</TableHead>
            <TableHead className="border-0">Role</TableHead>
            <TableHead className="border-0">Basic</TableHead>
            <TableHead className="border-0">HRA</TableHead>
            <TableHead className="border-0">Transport</TableHead>
            <TableHead className="border-0">Other</TableHead>
            <TableHead className="border-0">PF %</TableHead>
            <TableHead className="border-0">Prof. Tax</TableHead>
            <TableHead className="border-0">Gross</TableHead>
            <TableHead className="border-0 text-[#3525CD]">Net</TableHead>
            <TableHead className="border-0">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((staff) => (
            <TableRow key={staff.id} className="border-0">
              <TableCell className="border-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-semibold">
                    {staff.initials}
                  </div>
                  <span className="font-medium">{staff.name}</span>
                </div>
              </TableCell>

              <TableCell className="border-0">{staff.role}</TableCell>
              <TableCell className="border-0">
                {formatCurrency(staff.basic)}
              </TableCell>
              <TableCell className="border-0">
                {formatCurrency(staff.hra)}
              </TableCell>
              <TableCell className="border-0">
                {formatCurrency(staff.transport)}
              </TableCell>
              <TableCell className="border-0">
                {formatCurrency(staff.other)}
              </TableCell>

              <TableCell className="border-0 text-blue-600">
                {staff.pfPercentage}%
              </TableCell>

              <TableCell className="border-0">
                {formatCurrency(staff.professionalTax)}
              </TableCell>

              <TableCell className="border-0 font-medium">
                {formatCurrency(staff.gross)}
              </TableCell>

              <TableCell className="border-0 font-semibold text-[#3525CD]">
                {formatCurrency(staff.net)}
              </TableCell>

              <TableCell className="border-0">
                <button
                  onClick={() => onEdit(staff)}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};