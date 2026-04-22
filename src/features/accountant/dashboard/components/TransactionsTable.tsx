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
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import type { Transaction, PaymentMode } from "../types/dashboard.types";
import typography from "@/styles/typography";



const modeBadge: Record<PaymentMode, string> = {
  UPI: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  CASH: "bg-green-50 text-green-700 border border-green-200",
  CHEQUE: "bg-amber-50 text-amber-700 border border-amber-200",
  ONLINE: "bg-blue-50 text-blue-700 border border-blue-200",
};

const getBadge = (mode: PaymentMode) =>
  modeBadge[mode] ??
  "bg-slate-100 text-slate-600 border border-slate-200";



const columnHelper = createColumnHelper<Transaction>();



export const TransactionsTable = ({
  data,
  viewAll,
}: {
  data: Transaction[];
  viewAll: boolean;
}) => {
  const visibleData = useMemo(() => {
    return viewAll ? data : data.slice(0, 10);
  }, [data, viewAll]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("time", {
        header: "Time",
        cell: (info) => (
          <span className={`${typography.body.xs} font-mono text-slate-500`}>
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("student", {
        header: "Student",
        cell: (info) => (
          <span className={`${typography.body.small} font-semibold text-slate-800`}>
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("className", {
        header: "Class",
        cell: (info) => (
          <span className={`${typography.body.xs} text-slate-600`}>
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("feeHead", {
        header: "Fee Head",
        cell: (info) => (
          <span className={`${typography.body.xs} text-slate-600`}>
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <span className={`${typography.body.xs} font-semibold text-slate-800`}>
            ₹{info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor("mode", {
        header: "Mode",
        cell: (info) => {
          const mode = info.getValue();
          return (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getBadge(
                mode
              )}`}
            >
              {mode}
            </span>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: visibleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
    
      <div className="hidden md:block w-full overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="bg-[#E0E7FF] hover:bg-[#E0E7FF]"
              >
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`${typography.body.xs} font-semibold text-slate-500 uppercase tracking-wide px-5 py-3`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-5 py-3">
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

     
      <div className="md:hidden divide-y divide-slate-100">
        {table.getRowModel().rows.map((row) => {
          const t = row.original;

          return (
            <div key={row.id} className="py-3 px-1">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 font-mono">
                  {t.time}
                </p>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(
                    t.mode
                  )}`}
                >
                  {t.mode}
                </span>
              </div>

              <p className={`${typography.body.small} font-semibold text-slate-800 mt-1`}>
                {t.student}
              </p>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-400">{t.className}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-400">{t.feeHead}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-700">
                  ₹{t.amount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};