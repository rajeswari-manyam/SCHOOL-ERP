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
  ArrowUpDown, ArrowUp, ArrowDown,
  CheckCircle2, BellRing, Clock, AlertCircle,
} from "lucide-react";
import type { FeeRow, PendingFeesTableProps } from "../types/fees.types";
import { formatCurrency } from "../../../../utils/formatters";
import { Button } from "@/components/ui/button";
import { SendFeeReminderModal } from "./SendRemainderModal";
import {
  getAvatarSoftColor,
  getInitials,
  getOverdueSeverity,
  OVERDUE_BADGE_STYLES,
} from "../utils/fee.utils";



function DaysOverdueBadge({ days }: { days: number }) {
  const severity  = getOverdueSeverity(days);
  const className = OVERDUE_BADGE_STYLES[severity];
  const icon      = severity === "today"
    ? <Clock className="w-3 h-3" />
    : <AlertCircle className="w-3 h-3" />;
  const label     = severity === "today" ? "Today" : `${days}d`;

  return <span className={className}>{icon}{label}</span>;
}



function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (isSorted === "asc")  return <ArrowUp className="w-3 h-3 ml-1 inline" />;
  if (isSorted === "desc") return <ArrowDown className="w-3 h-3 ml-1 inline" />;
  return <ArrowUpDown className="w-3 h-3 ml-1 inline opacity-40" />;
}



const columnHelper = createColumnHelper<FeeRow>();


type Props = PendingFeesTableProps & { isLoading?: boolean };

export const PendingFeesTable = ({ data = [], isLoading }: Props) => {
  const [sorting, setSorting]           = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection]  = useState<RowSelectionState>({});
  const [selectedRow, setSelectedRow]    = useState<FeeRow | null>(null);
  const [showReminder, setShowReminder]  = useState(false);

  const columns = useMemo(
    () => [
    
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

    
      columnHelper.accessor("student", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-xs text-gray-600 hover:text-gray-900"
            onClick={() => column.toggleSorting()}
          >
            Student <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row, getValue }) => (
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarSoftColor(row.index)}`}>
              {getInitials(getValue())}
            </div>
            <div>
              <p className="font-medium text-[11px] sm:text-xs leading-tight">{getValue()}</p>
              <p className="text-gray-400 text-[10px] sm:text-xs leading-tight">{row.original.admissionNo}</p>
            </div>
          </div>
        ),
      }),

    
      columnHelper.accessor("className", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-xs text-gray-600 hover:text-gray-900"
            onClick={() => column.toggleSorting()}
          >
            Class <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => <span className="text-xs text-gray-700">{info.getValue()}</span>,
      }),

  
      columnHelper.accessor("feeHead", {
        header: () => <span className="font-medium text-xs text-gray-600">Fee Head</span>,
        cell: (info) => <span className="text-xs text-gray-700">{info.getValue()}</span>,
      }),

 
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

   
      columnHelper.accessor("lateFee", {
        header: () => <span className="font-medium text-xs text-gray-600">Late Fee</span>,
        cell: (info) => {
          const val = info.getValue() ?? 0;
          return val > 0 ? (
            <span className="text-xs font-semibold text-red-600">
              +{formatCurrency(val)}
            </span>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          );
        },
      }),

      columnHelper.accessor("dueDate", {
        header: ({ column }) => (
          <button
            className="flex items-center font-medium text-xs text-gray-600 hover:text-gray-900"
            onClick={() => column.toggleSorting()}
          >
            Due Date <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: (info) => {
          const days = info.row.original.daysOverdue;
          const isLate = days > 0;
          return (
            <div>
              <span className={`text-xs ${isLate ? "text-red-600 font-medium" : "text-gray-600"}`}>
                {info.getValue()}
              </span>
              {isLate && (
                <p className="text-[10px] text-red-500 font-medium">{days}d late</p>
              )}
            </div>
          );
        },
      }),

  
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

      columnHelper.accessor("reminders", {
        header: () => <span className="font-medium text-xs text-gray-600">Reminders</span>,
        cell: (info) => (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <BellRing className="w-3 h-3 text-gray-400" />
            {info.getValue()} Sent
          </span>
        ),
      }),

   
      columnHelper.display({
        id: "actions",
        header: () => <span className="font-medium text-xs text-gray-600">Actions</span>,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3525CD] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading pending fees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full max-w-full no-scrollbar scroll-smooth max-h-[520px] rounded-md border border-gray-200">
      {/* ── Mobile View ── */}
<div className="md:hidden space-y-3 p-3">
  {rows.map((row) => (
    <div
      key={row.id}
      className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${getAvatarSoftColor(row.index)}`}>
            {getInitials(row.original.student)}
          </div>

          <div>
            <p className="text-sm font-medium">{row.original.student}</p>
            <p className="text-[11px] text-gray-400">{row.original.admissionNo}</p>
          </div>
        </div>

        <DaysOverdueBadge days={row.original.daysOverdue} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div>
          <span className="text-gray-400">Class:</span> {row.original.className}
        </div>
        <div>
          <span className="text-gray-400">Fee:</span> {row.original.feeHead}
        </div>
        <div>
          <span className="text-gray-400">Amount:</span>{" "}
          {formatCurrency(row.original.amount)}
        </div>
        <div>
          <span className="text-gray-400">Late Fee:</span>{" "}
          {row.original.lateFee ? (
            <span className="text-red-600 font-semibold">+{formatCurrency(row.original.lateFee)}</span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
        <div>
          <span className="text-gray-400">Due:</span> {row.original.dueDate}
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <BellRing className="w-3 h-3" />
          {row.original.reminders} Sent
        </span>

        <Button
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            setSelectedRow(row.original);
            setShowReminder(true);
          }}
        >
          Send Reminder
        </Button>
      </div>
    </div>
  ))}
</div>
      <table className="hidden md:table min-w-[960px] w-full border-collapse text-sm">

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
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* ── Body ── */}
        <tbody>
          {rows.map((row: Row<FeeRow>) => {
            const days = row.original.daysOverdue;
            const isCritical = days > 30;
            const isWarning = days > 10 && days <= 30;
            const rowHighlight = isCritical
              ? "bg-red-50/40 border-l-4 border-l-red-500"
              : isWarning
                ? "bg-amber-50/40"
                : "hover:bg-gray-50/60";
            return (
              <tr
                key={row.id}
                className={[
                  "border-t border-gray-100 transition-colors",
                  rowHighlight,
                  row.getIsSelected() ? "bg-blue-50/40" : "",
                ].filter(Boolean).join(" ")}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {(data || []).length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <span className="text-4xl mb-3">📋</span>
          <p className="text-sm font-medium">No pending fees found</p>
          <p className="text-xs mt-1">All fees are up to date for this period</p>
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