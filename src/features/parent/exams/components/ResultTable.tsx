import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  BookOpen,
  Hash,
  Percent,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import typography from "@/styles/typography";
import type { ExamResult } from "../types/exam.types";

const columnHelper = createColumnHelper<ExamResult>();

// ── header icon map ──
const headerIcons: Record<string, React.ReactNode> = {
  Subject:        <BookOpen    size={13} className="text-[#9CA3AF]" />,
  "Marks Obtained": <Hash      size={13} className="text-[#9CA3AF]" />,
  Percentage:     <Percent     size={13} className="text-[#9CA3AF]" />,
  Grade:          <Award       size={13} className="text-[#9CA3AF]" />,
  Status:         <CheckCircle2 size={13} className="text-[#9CA3AF]" />,
};

export function ResultsTable({ results }: { results: ExamResult[] }) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: (info) => (
          <span className="font-medium text-[#0B1C30] text-sm">
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("marksObtained", {
        header: "Marks Obtained",
        cell: (info) => {
          const row = info.row.original;
          return (
            <span className="text-sm text-gray-600">
              {info.getValue()} / {row.totalMarks}
            </span>
          );
        },
      }),

      columnHelper.accessor("percentage", {
        header: "Percentage",
        cell: (info) => (
          <span className="text-sm text-gray-600">{info.getValue()}%</span>
        ),
      }),

      columnHelper.accessor("grade", {
        header: "Grade",
        cell: (info) => (
          <span className="font-semibold text-[#0B1C30] text-sm">
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const pass = info.getValue() === "Pass";
          return (
            <span
              className={`
                inline-flex items-center gap-1.5
                text-[11px] font-semibold px-2.5 py-1 rounded-lg
                ${pass
                  ? "bg-[#DCFCE7] text-[#166534]"
                  : "bg-[#FEE2E2] text-[#991B1B]"
                }
              `}
            >
              {pass
                ? <CheckCircle2 size={12} />
                : <XCircle      size={12} />
              }
              {info.getValue()}
            </span>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">

          {/* HEADER */}
          <TableHeader className="bg-[#F8FAFC]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-0">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`${typography.form.label} text-gray-400 border-0`}
                  >
                    <span className="flex items-center gap-1.5">
                      {headerIcons[header.column.columnDef.header as string]}
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-0 hover:bg-[#F8FAFC] transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border-0">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}