import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { TableVirtuoso } from "react-virtuoso";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { TransportSlab, TransportSlabsTableProps } from "../types/fees.types";
import { distanceLabel } from "../utils/fee.utils";
import { formatINR } from "../../../../utils/formatters";

const columnHelper = createColumnHelper<TransportSlab>();

export function TransportSlabsTable({ slabs, onEdit, onDelete }: TransportSlabsTableProps) {
  const totalStudents = slabs.reduce((sum, s) => sum + s.students, 0);
  const totalRevenue = slabs.reduce((sum, s) => sum + s.monthly * s.students, 0);
  const [expandedSlab, setExpandedSlab] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSlab((prev) => (prev === id ? null : id));
  };

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
  {/* Header / Summary */}
<div className="flex items-start justify-between px-5 py-3 border-b border-gray-100">

  {/* LEFT: Title + subtitle */}
  <div>
    <div className="text-sm font-medium text-gray-800">
      Transport Fee Slabs
    </div>

    <div className="text-xs text-gray-400 mt-0.5">
      Distance-based fee configuration
    </div>
  </div>

  {/* RIGHT: Stats */}
  <div className="bg-[#EFF4FF] flex items-center gap-6 px-4 py-2 rounded-lg">
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

      {/* DESKTOP: Virtualized Table */}
      <div className="hidden md:block">
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

      {/* MOBILE: Card List */}
      <div className="md:hidden px-3 pb-4 space-y-2">
        {rows.map((row) => {
          const slab = row.original;
          const isExpanded = expandedSlab === slab.id;

          return (
            <div
              key={slab.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Card Header */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer active:bg-gray-50"
                onClick={() => toggleExpand(slab.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#3525CD] flex items-center justify-center text-xs font-bold">
                    {slab.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {slab.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {distanceLabel(slab)} · {slab.students} students
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {formatINR(slab.monthly)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <div className="pt-3 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Distance Range</span>
                      <span className="font-medium text-gray-700">
                        {distanceLabel(slab)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Monthly Fee</span>
                      <span className="font-medium text-gray-700">
                        {formatINR(slab.monthly)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Assigned Students</span>
                      <span className="font-medium text-gray-700">
                        {slab.students}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Monthly Revenue</span>
                      <span className="font-medium text-indigo-700">
                        {formatINR(slab.monthly * slab.students)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                      <button
                        onClick={() => onEdit(slab)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-50 text-[#3525CD] text-xs font-medium active:bg-indigo-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(slab.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium active:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {rows.length === 0 && (
          <div className="text-center py-8 text-xs text-gray-400 bg-white rounded-xl border border-gray-200">
            No slabs configured yet.
          </div>
        )}
      </div>
    </div>
  );
}