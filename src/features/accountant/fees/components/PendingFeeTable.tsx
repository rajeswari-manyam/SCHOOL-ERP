

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type Row,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  BellRing,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { FeeRow } from "../types/fees.types";
import { formatCurrency } from "../utils/fee.utils";
import { Button } from "@/components/ui/button";
import { SendFeeReminderModal } from "./SendRemainderModal";


// ─── Avatar helpers ──────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Days-overdue badge ───────────────────────────────────────────────────────

function DaysOverdueBadge({ days }: { days: number }) {
  if (days === 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
        <Clock className="w-3 h-3" />
        Today
      </span>
    );
  if (days <= 5)
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200">
        <AlertCircle className="w-3 h-3" />
        {days}d
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
      <AlertCircle className="w-3 h-3" />
      {days}d
    </span>
  );
}

// ─── Sort icon helper ─────────────────────────────────────────────────────────

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (isSorted === "asc") return <ArrowUp className="w-3 h-3 ml-1 inline" />;
  if (isSorted === "desc") return <ArrowDown className="w-3 h-3 ml-1 inline" />;
  return <ArrowUpDown className="w-3 h-3 ml-1 inline opacity-40" />;
}

// ─── Column helper ────────────────────────────────────────────────────────────

const columnHelper = createColumnHelper<FeeRow>();

// ─── Main component ───────────────────────────────────────────────────────────
export const PendingFeesTable = ({ data }: { data: FeeRow[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // ✅ ADD THIS INSIDE
  const [selectedRow, setSelectedRow] = useState<FeeRow | null>(null);
  const [showReminder, setShowReminder] = useState(false);


  const columns = useMemo(
    () => [
      // ── Checkbox ──────────────────────────────────────────────────────────
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="w-3.5 h-3.5 rounded border-gray-300 cursor-pointer"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="w-3.5 h-3.5 rounded border-gray-300 cursor-pointer"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 40,
      }),

      // ── Student ───────────────────────────────────────────────────────────
      columnHelper.accessor("student", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-xs text-gray-600 hover:text-gray-900"
            onClick={() => column.toggleSorting()}
          >
            Student <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row, getValue }) => {
          const idx = row.index;
          return (
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  AVATAR_COLORS[idx % AVATAR_COLORS.length]
                }`}
              >
                {getInitials(getValue())}
              </div>
              <div>
                <p className="font-medium text-[11px] sm:text-xs leading-tight">
                  {getValue()}
                </p>
                <p className="text-gray-400 text-[10px] sm:text-xs leading-tight">
                  {row.original.admissionNo}
                </p>
              </div>
            </div>
          );
        },
      }),

      // ── Class ─────────────────────────────────────────────────────────────
      columnHelper.accessor("className", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-xs text-gray-600 hover:text-gray-900"
            onClick={() => column.toggleSorting()}
          >
            Class <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => (
          <span className="text-xs text-gray-700">{info.getValue()}</span>
        ),
      }),

      // ── Fee Head ──────────────────────────────────────────────────────────
      columnHelper.accessor("feeHead", {
        header: () => (
          <span className="font-medium text-xs text-gray-600">Fee Head</span>
        ),
        cell: (info) => (
          <span className="text-xs text-gray-700">{info.getValue()}</span>
        ),
      }),

      // ── Amount ────────────────────────────────────────────────────────────
      columnHelper.accessor("amount", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-xs text-gray-600 hover:text-gray-900"
            onClick={() => column.toggleSorting()}
          >
            Amount <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => (
          <span className="text-xs font-semibold text-gray-800">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),

      // ── Due Date ──────────────────────────────────────────────────────────
      columnHelper.accessor("dueDate", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-xs text-gray-600 hover:text-gray-900"
            onClick={() => column.toggleSorting()}
          >
            Due Date <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => (
          <span className="text-xs text-gray-600">{info.getValue()}</span>
        ),
      }),

      // ── Days Overdue ──────────────────────────────────────────────────────
      columnHelper.accessor("daysOverdue", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-xs text-gray-600 hover:text-gray-900"
            onClick={() => column.toggleSorting()}
          >
            Overdue <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => <DaysOverdueBadge days={info.getValue()} />,
      }),

      // ── Reminders ─────────────────────────────────────────────────────────
      columnHelper.accessor("reminders", {
        header: () => (
          <span className="font-medium text-xs text-gray-600">Reminders</span>
        ),
        cell: (info) => (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <BellRing className="w-3 h-3 text-gray-400" />
            {info.getValue()} Sent
          </span>
        ),
      }),

      // ── Actions ───────────────────────────────────────────────────────────
     columnHelper.display({
  id: "actions",
  header: () => (
    <span className="font-medium text-xs text-gray-600">Actions</span>
  ),
  cell: ({ row }) => (
    <Button
      variant="outline"
      size="sm"
      className="text-[10px] sm:text-xs h-7 px-2.5 border-blue-200 text-blue-600 hover:bg-blue-50 gap-1"
      onClick={() => {
        setSelectedRow(row.original);
        setShowReminder(true);
      }}
    >
      <CheckCircle2 className="w-3 h-3" />
      Send Reminder
    </Button>
  ),
}),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });

  const { rows } = table.getRowModel();

  return (
    <div className="overflow-auto no-scrollbar scroll-smooth max-h-[520px] rounded-md border border-gray-200">
      <table className="min-w-[960px] w-full border-collapse text-sm">
        {/* ── Header ── */}
        <thead className="sticky top-0 z-10 bg-[#EFF4FF]">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap select-none"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* ── Body ── */}
        <tbody>
          {rows.map((row: Row<FeeRow>) => {
            const isOverdue = row.original.daysOverdue > 10;
            return (
              <tr
                key={row.id}
                className={[
                  "border-t border-gray-100 transition-colors",
                  isOverdue ? "bg-red-50/30" : "hover:bg-gray-50/60",
                  row.getIsSelected() ? "bg-blue-50/40" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 align-middle whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="py-16 text-center text-sm text-gray-400">
          No pending fees found.
        </div>
      )}


{showReminder && selectedRow && (
  <SendFeeReminderModal
    onClose={() => {
      setShowReminder(false);
      setSelectedRow(null);
    }}
    studentName={selectedRow.student}
    studentClass={selectedRow.className}
    amountOverdue={selectedRow.amount}
    daysPastDue={selectedRow.daysOverdue}
    remindersSent={selectedRow.reminders}
    fatherPhone="+91 98765 43210"
    motherPhone="+91 87654 32109"
  />
)}
    </div>
  );
};