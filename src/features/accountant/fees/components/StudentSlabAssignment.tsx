import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { TableVirtuoso } from "react-virtuoso";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { TransportStudent, StudentSlabAssignmentProps } from "../types/fees.types";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const columnHelper = createColumnHelper<TransportStudent>();

export function StudentSlabAssignment({
  students,
  slabs,
  search,
  onSearchChange,
  pendingSlabs,
  onSlabChange,
  onSaveStudentSlab,
}: StudentSlabAssignmentProps) {
  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.cls.toLowerCase().includes(search.toLowerCase())
      ),
    [students, search]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Student",
        meta: { label: "Student" },
        cell: (info) => {
          const st = info.row.original;
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-50 text-[#3525CD] flex items-center justify-center text-[11px] font-medium flex-shrink-0">
                {initials(st.name)}
              </div>
              <div>
                <div className="text-xs font-medium text-gray-800">{st.name}</div>
                <div className="text-[11px] text-gray-400">ID: {st.id}</div>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("cls", {
        header: "Class",
        meta: { label: "Class" },
        cell: (info) => (
          <span className="text-xs text-gray-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("distance", {
        header: "Distance",
        meta: { label: "Distance" },
        cell: (info) => (
          <span className="text-xs text-gray-700">{info.getValue()} km</span>
        ),
      }),
      columnHelper.display({
        id: "currentSlab",
        header: "Current Slab",
        meta: { label: "Current Slab" },
        cell: ({ row }) => {
          const currentSlab = slabs.find((s) => s.id === row.original.slabId);
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-[#3525CD]">
              {currentSlab?.name ?? "—"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "changeSlab",
        header: "Change Slab",
        meta: { label: "Change Slab" },
        cell: ({ row }) => {
          const st = row.original;
          const selectedSlabId = pendingSlabs[st.id] ?? st.slabId;
          return (
            <select
              value={selectedSlabId}
              onChange={(e) => onSlabChange(st.id, e.target.value)}
              className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-[#3525CD] bg-white"
            >
              {slabs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          );
        },
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        meta: { label: "Action" },
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 text-[#3525CD] border-indigo-200 hover:bg-indigo-50"
            onClick={() => onSaveStudentSlab(row.original.id)}
          >
            Save
          </Button>
        ),
      }),
    ],
    [slabs, pendingSlabs, onSlabChange, onSaveStudentSlab]
  );

  const table = useReactTable({
    data: filtered,
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
      {/* Section header */}
      <div className="px-5 pt-4 pb-2 border-t border-gray-100">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
          Student Slab Assignment
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Assign transport slab per student based on their distance
        </p>
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search students..."
            className="w-full h-8 border border-gray-200 rounded-lg pl-8 pr-3 text-xs focus:outline-none focus:border-[#3525CD] text-gray-800 placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* DESKTOP: Virtualised table */}
      <div className="hidden md:block">
        <TableVirtuoso
          style={{ height: Math.min(rows.length * 56 + 44, 480) }}
          totalCount={rows.length}
          fixedHeaderContent={() =>
            headerGroups.map((hg) => (
              <tr key={hg.id} className="bg-white border-b border-gray-100">
                {hg.headers.map((header) => (
                  <th key={header.id} className={thClass}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                style={{ ...style, minWidth: 700, borderCollapse: "collapse" }}
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

      {/* MOBILE: Card layout */}
      <div className="md:hidden px-3 pb-4 space-y-3">
        {rows.map((row) => {
          const cells = row.getVisibleCells();
          const nameCell = cells.find((c) => c.column.id === "name");
          const actionCell = cells.find((c) => c.column.id === "action");
          const dataCells = cells.filter(
            (c) => c.column.id !== "name" && c.column.id !== "action"
          );

          return (
            <div
              key={row.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
            >
              {/* Card Header: Avatar + Name */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                <div className="flex-1 min-w-0">
                  {nameCell && (
                    <div className="truncate">
                      {flexRender(
                        nameCell.column.columnDef.cell,
                        nameCell.getContext()
                      )}
                    </div>
                  )}
                </div>
                {actionCell && (
                  <div className="ml-3 flex-shrink-0">
                    {flexRender(
                      actionCell.column.columnDef.cell,
                      actionCell.getContext()
                    )}
                  </div>
                )}
              </div>

              {/* Card Body: Key-Value pairs */}
              <div className="space-y-2.5">
                {dataCells.map((cell) => {
                  const label =
                    (cell.column.columnDef.meta as { label?: string })?.label ??
                    cell.column.columnDef.header;
                  return (
                    <div key={cell.id} className="flex items-start justify-between gap-3">
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide flex-shrink-0">
                        {typeof label === "string" ? label : ""}
                      </span>
                      <div className="text-right min-w-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {rows.length === 0 && (
          <div className="text-center py-10 text-xs text-gray-400">
            No students found.
          </div>
        )}
      </div>
    </div>
  );
}