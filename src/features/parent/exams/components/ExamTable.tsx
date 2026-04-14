import type { Exam } from "../types/exam.types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import typography, { combineTypography } from "@/styles/typography";

export function ExamTable({ exams }: { exams: Exam[] }) {
  return (
    <div className="bg-white rounded-2xl mb-6 shadow-sm overflow-x-auto">
      <Table className="min-w-[700px] md:min-w-full">
        <TableHeader>
          <tr>
            {["Subject", "Date", "Day", "Time", "Venue"].map((h) => (
              <TableHead key={h}>
                {h}
              </TableHead>
            ))}
          </tr>
        </TableHeader>

        <TableBody>
          {exams.map((e) => (
            <TableRow
              key={e.id}
              className="
                group
                hover:bg-[#F8FAFC]
                transition-colors
              "
            >
              <TableCell
                className={combineTypography(
                  typography.body.small,
                  "font-medium text-[#0B1C30] group-hover:border-l-2 group-hover:border-blue-500"
                )}
              >
                {e.subject}
              </TableCell>

              <TableCell className="text-gray-500">
                {e.date}
              </TableCell>

              <TableCell className="text-gray-500">
                {e.day}
              </TableCell>

              <TableCell className="text-gray-500">
                {e.time}
              </TableCell>

              <TableCell className="text-gray-500">
                {e.venue}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}