import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { TableVirtuoso } from "react-virtuoso";
import type { TransportSlab, TransportSlabsTableProps } from "../types/fees.types";
import { distanceLabel } from "../utils/fee.utils";
import { formatINR } from "../../../../utils/formatters";

const columnHelper = createColumnHelper<TransportSlab>();



export function TransportSlabsTable({ slabs, onEdit, onDelete }: TransportSlabsTableProps) {
  const totalStudents = slabs.reduce((sum, s) => sum + s.students, 0);
  const totalRevenue = slabs.reduce((sum, s) => sum + s.monthly * s.students, 0);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Slab",
        cell: (info) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-indigo-50 text-[#3525CD] border border-indigo-100">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "distance",
        header: "Distance",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-gray-700">
            {distanceLabel(row.original)}
          </span>
        ),
      }),
      columnHelper.accessor("students", {
        header: "Students",
        cell: (info) => (
          <span className="text-sm text-gray-600 font-medium">
            {info.getValue()}{" "}
            <span className="text-[10px] text-gray-400 uppercase">Users</span>
          </span>
        ),
      }),
      columnHelper.accessor("monthly", {
        header: "Monthly Fee",
        cell: (info) => (
          <span className="text-sm font-bold text-gray-900">
            {formatINR(info.getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "revenue",
        header: "Revenue",
        cell: ({ row }) => (
          <span className="text-sm font-bold text-indigo-700">
            {formatINR(row.original.monthly * row.original.students)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="flex justify-end">Actions</span>,
        cell: ({ row }) => (
          <div className="flex gap-2 justify-end">
            <button
              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all font-bold text-xs uppercase"
              onClick={() => onEdit(row.original)}
            >
              Edit
            </button>
            <button
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all font-bold text-xs uppercase"
              onClick={() => onDelete(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: slabs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const headerGroups = table.getHeaderGroups();

  const thClass =
    "text-xs font-bold uppercase text-gray-400 tracking-wider px-4 py-3 text-left";
  const tdClass = "px-4 py-3";

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div>
          <span className="text-sm font-medium text-gray-800">
            Transport Fee Slabs
          </span>
          <span className="text-xs text-gray-400 ml-2">
            Distance-based fee configuration
          </span>
        </div>
        <div className="bg-[#EFF4FF] flex items-center gap-6">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800">
              {totalStudents} students
            </div>
            <div className="text-xs text-gray-400">Total Usage</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-[#3525CD]">
              {formatINR(totalRevenue)}
            </div>
            <div className="text-xs text-gray-400">Monthly Revenue</div>
          </div>
        </div>
      </div>

      {/* Virtualised table */}
      <TableVirtuoso
        style={{ height: Math.min(rows.length * 52 + 44, 420) }}
        totalCount={rows.length}
        fixedHeaderContent={() =>
          headerGroups.map((hg) => (
            <tr key={hg.id} className="bg-white border-b border-gray-100">
              {hg.headers.map((header) => (
                <th key={header.id} className={thClass}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))
        }
        itemContent={(index) => {
          const row = rows[index];
          return row.getVisibleCells().map((cell) => (
            <td key={cell.id} className={tdClass}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ));
        }}
        components={{
          Table: ({ style, ...props }) => (
            <table
              {...props}
              style={{ ...style, minWidth: 600, borderCollapse: "collapse" }}
              className="w-full"
            />
          ),
          TableRow: ({ style, ...props }) => (
            <tr
              {...props}
              style={style}
              className="hover:bg-gray-50/50 border-b border-gray-50 last:border-0"
            />
          ),
        }}
      />
    </div>
  );
}