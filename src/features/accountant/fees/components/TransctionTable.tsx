import { useState, useCallback, useMemo,useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  MessageSquare,
  MoreVertical,
  Check,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FeeTransaction } from "../types/fees.types";
import { formatCurrency } from "../../../../utils/formatters";
import { SendFeeReminderModal } from "./SendRemainderModal";
import {
  getInitials,
  getTransactionStatusStyle,
  AVATAR_INDIGO,
} from "../utils/fee.utils";

const col = createColumnHelper<FeeTransaction>();

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// ─── Mobile card list ────────────────────────────────────────────
function MobileTransactionList({
  data,
  rowSelection,
  onToggle,
  onReminder,
}: {
  data: FeeTransaction[];
  rowSelection: RowSelectionState;
  onToggle: (id: string) => void;
  onReminder: (row: FeeTransaction) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {data.map((st) => {
        const isSelected = !!rowSelection[st.id];
        return (
          <div
            key={st.id}
            className={`rounded-xl border p-3 flex flex-col gap-2.5 transition-colors ${
              isSelected
                ? "bg-indigo-50 border-indigo-300"
                : "bg-white border-slate-200"
            }`}
          >
            {/* Top row: avatar + name + checkbox */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-full ${AVATAR_INDIGO} flex items-center justify-center text-xs font-bold flex-shrink-0`}
              >
                {getInitials(st.student)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {st.student}
                </p>
                <p className="text-[11px] text-slate-400">{st.id}</p>
              </div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(st.id)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer flex-shrink-0"
              />
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                  Class
                </p>
                <p className="text-xs font-medium text-slate-700">
                  {st.class ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                  Amount due
                </p>
                <p className="text-xs font-semibold text-slate-800">
                  {formatCurrency(st.amount)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                  Due date
                </p>
                <p className="text-xs font-medium text-slate-700">{st.date}</p>
              </div>
            </div>

            {/* Bottom row: status badge + actions */}
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${getTransactionStatusStyle(
                  st.status ?? st.mode ?? ""
                )}`}
              >
                {st.status ?? st.mode}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onReminder(st)}
                  title="Send WhatsApp Reminder"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 border border-slate-100 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Desktop virtualized table (your original) ───────────────────
import { TableVirtuoso } from "react-virtuoso";

function DesktopTransactionTable({
  data,
  rowSelection,
  onRowSelectionChange,
 
  columns,
}: {
  data: FeeTransaction[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: (updater: any) => void;
  onReminder: (row: FeeTransaction) => void;
  columns: any[];
}) {
  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

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
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
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
  );
}

// ─── Main export ─────────────────────────────────────────────────
export const TransactionsTable = ({ data }: { data: FeeTransaction[] }) => {
  const isMobile = useIsMobile();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [reminderStudent, setReminderStudent] = useState<FeeTransaction | null>(null);
  const [showBulkReminder, setShowBulkReminder] = useState(false);

  const selectedIds = Object.keys(rowSelection).filter((k) => rowSelection[k]);
  const selectedCount = selectedIds.length;

  const handleToggle = useCallback((id: string) => {
    setRowSelection((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

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

  return (
    <>
      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 mb-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-indigo-700">
            {selectedCount} student{selectedCount > 1 ? "s" : ""} selected
          </span>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <Button
              onClick={() => setShowBulkReminder(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send WhatsApp Reminder</span>
              <span className="sm:hidden">Remind</span>
            </Button>
            <Button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 hidden sm:flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Export Selected
            </Button>
            <button
              onClick={() => setRowSelection({})}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-400 text-xs font-semibold hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Selection</span>
            </button>
          </div>
        </div>
      )}

      {/* Responsive: cards on mobile, table on desktop */}
      {isMobile ? (
        <MobileTransactionList
          data={data}
          rowSelection={rowSelection}
          onToggle={handleToggle}
          onReminder={setReminderStudent}
        />
      ) : (
        <DesktopTransactionTable
          data={data}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onReminder={setReminderStudent}
          columns={columns}
        />
      )}

      {reminderStudent && (
        <SendFeeReminderModal
          studentName={reminderStudent.student}
          studentClass={reminderStudent.class}
          amountOverdue={reminderStudent.amount}
          onClose={() => setReminderStudent(null)}
        />
      )}

      {showBulkReminder && (
        <SendFeeReminderModal
          studentName={`${selectedCount} students`}
          onClose={() => setShowBulkReminder(false)}
        />
      )}
    </>
  );
};