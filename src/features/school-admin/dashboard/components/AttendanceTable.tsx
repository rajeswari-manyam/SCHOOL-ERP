import type { Attendance } from "../types/dashboard.types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const AttendanceTable = ({ data }: { data: Attendance[] }) => {
  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow-sm border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.class} className="hover:bg-slate-50 transition-colors">
              <TableCell className="text-slate-700">{row.class}</TableCell>
              <TableCell className="text-slate-700">{row.teacher}</TableCell>
              <TableCell className="text-slate-700">{row.present}</TableCell>
              <TableCell className="text-slate-700">{row.absent}</TableCell>
              <TableCell>
                <Badge variant={row.status === "MARKED" ? "emerald" : "red"}>
                  {row.status === "MARKED" ? "Marked" : "Not marked"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
