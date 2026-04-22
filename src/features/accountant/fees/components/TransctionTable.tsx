import { useState, useCallback, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type RowSelectionState,
} from "@tanstack/react-table";
import { TableVirtuoso } from "react-virtuoso";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  MoreVertical,
  Check,
  Download,
  X,
} from "lucide-react";
import type { FeeTransaction } from "../types/fees.types";
import { formatCurrency } from "../../../../utils/formatters";
import { SendFeeReminderModal } from "./SendRemainderModal";
import {
  getInitials,
  getTransactionStatusStyle,
  AVATAR_INDIGO,
} from "../utils/fee.utils";



const col = createColumnHelper<FeeTransaction>();



export const TransactionsTable = ({ data }: { data: FeeTransaction[] }) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [reminderStudent, setReminderStudent] = useState<FeeTransaction | null>(null);
  const [showBulkReminder, setShowBulkReminder] = useState(false);

  const columns = useMemo(
    () => [
    
      col.display({
        id: "select",
        size: 40,
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected();
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
          />
        ),
      }),

    
      col.accessor("student", {
        header: "Student Details",
        cell: ({ row, getValue }) => (
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full ${AVATAR_INDIGO} flex items-center justify-center text-xs font-bold flex-shrink-0`}
            >
              {getInitials(getValue())}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{getValue()}</p>
              <p className="text-xs text-slate-400">{row.original.id}</p>
            </div>
          </div>
        ),
      }),

     
      col.accessor("class", {
        header: "Class",
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-600">{getValue() ?? "—"}</span>
        ),
      }),

      col.accessor("amount", {
        header: "Amount Due",
        cell: ({ getValue }) => (
          <span className="text-sm font-bold text-slate-800">
            {formatCurrency(getValue())}
          </span>
        ),
      }),

      col.accessor("date", {
        header: "Due Date",
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-600">{getValue()}</span>
        ),
      }),

    
      col.accessor("status", {
        header: "Status",
        cell: ({ getValue, row }) => {
          const status = getValue() ?? row.original.mode ?? "";
          return (
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${getTransactionStatusStyle(status)}`}
            >
              {status}
            </span>
          );
        },
      }),

     
      col.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setReminderStudent(row.original)}
              title="Send WhatsApp Reminder"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const selectedIds = Object.keys(rowSelection).filter((k) => rowSelection[k]);
  const selectedCount = selectedIds.length;

  const headerGroups = table.getHeaderGroups();
  const { rows } = table.getRowModel();

  const fixedHeaderContent = useCallback(
    () =>
      headerGroups.map((hg) => (
        <tr key={hg.id} className="bg-slate-50">
          {hg.headers.map((header) => (
            <th
              key={header.id}
              style={{ width: header.column.columnDef.size }}
              className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      )),
    [headerGroups]
  );

  const itemContent = useCallback(
    (_index: number, row: (typeof rows)[number]) => {
      const isSelected = row.getIsSelected();
      return (
        <>
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={`px-4 py-3 border-b border-slate-100 transition-colors ${
                isSelected ? "bg-indigo-50" : "bg-white hover:bg-slate-50"
              }`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </>
      );
    },
    []
  );

  return (
    <>
      {/* ── Bulk Action Bar ── */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 mb-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-indigo-700">
            {selectedCount} student{selectedCount > 1 ? "s" : ""} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={() => setShowBulkReminder(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Send WhatsApp Reminder
            </Button>
            <Button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Export Selected
            </Button>
            <button
              onClick={() => setRowSelection({})}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-400 text-xs font-semibold hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* ── Virtualized Table ── */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <TableVirtuoso
          data={rows}
          style={{ height: 520 }}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={itemContent}
          components={{
            Table: (props) => (
              <table {...props} className="w-full border-collapse table-auto" />
            ),
            TableHead: (props) => (
              <thead {...props} className="sticky top-0 z-10 shadow-sm" />
            ),
            TableBody: (props) => <tbody {...props} />,
            TableRow: (props) => <tr {...props} />,
          }}
        />
      </div>

      {/* ── Single Student Reminder Modal ── */}
      {reminderStudent && (
        <SendFeeReminderModal
          studentName={reminderStudent.student}
          studentClass={reminderStudent.class}
          amountOverdue={reminderStudent.amount}
          onClose={() => setReminderStudent(null)}
        />
      )}

      {/* ── Bulk Reminder Modal ── */}
      {showBulkReminder && (
        <SendFeeReminderModal
          studentName={`${selectedCount} students`}
          onClose={() => setShowBulkReminder(false)}
        />
      )}
    </>
  );
};