import type { ExamResult } from "../types/exam.types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import typography from "@/styles/typography";

export function ResultsTable({ results }: { results: ExamResult[] }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow">

      {/* RESPONSIVE WRAPPER */}
      <div className="overflow-x-auto">

        <Table className="min-w-[800px]">

          {/* HEADER */}
          <TableHeader className="bg-[#F8FAFC]">
            <TableRow className="border-0">
              {["Subject", "Marks Obtained", "Percentage", "Grade", "Status"].map((h) => (
                <TableHead
                  key={h}
                  className={`${typography.form.label} text-gray-400 border-0`}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {results.map((r) => (
              <TableRow
                key={r.subject}
                className="border-0 hover:bg-[#F8FAFC] transition-colors"
              >
                <TableCell className="font-medium text-[#0B1C30] border-0">
                  {r.subject}
                </TableCell>

                <TableCell className="text-gray-600 border-0">
                  {r.marksObtained} / {r.totalMarks}
                </TableCell>

                <TableCell className="text-gray-600 border-0">
                  {r.percentage}%
                </TableCell>

                <TableCell className="font-semibold text-[#0B1C30] border-0">
                  {r.grade}
                </TableCell>

                <TableCell className="border-0">
                  <span
                    className={`
                      text-[11px] font-semibold px-2.5 py-1 rounded-lg
                      ${
                        r.status === "Pass"
                          ? "bg-[#DCFCE7] text-[#166534]"
                          : "bg-[#FEE2E2] text-[#991B1B]"
                      }
                    `}
                  >
                    {r.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}