import { useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { Transaction, AllTransactionsTableProps } from "../types/fees.types";
import { formatCurrency } from "../../../../utils/formatters";
import { Eye, Download, Send, CheckCircle } from "lucide-react";
import { getModeBadgeClass, calculatePaymentSummary } from "../../../../utils/payment";


const WASentBadge = ({ sent }: { sent?: boolean }) =>
  sent ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-800 text-[12px] font-medium">
      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
      WA Sent
    </span>
  ) : (
    <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 text-slate-500 hover:border-green-500 hover:text-green-700 text-[12px] transition-colors">
      <Send className="w-3 h-3 flex-shrink-0" />
      Send
    </button>
  );

const col = createColumnHelper<Transaction>();



export const AllTransactionsTable = ({ data }: AllTransactionsTableProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelected((prev) =>
      prev.length === data.length ? [] : data.map((d) => d.id)
    );

  const allSelected = selected.length === data.length && data.length > 0;
  const someSelected = selected.length > 0 && !allSelected;

  const { cash, upi, cheque, total } = useMemo(
    () => calculatePaymentSummary(data),
    [data]
  );

  const columns = useMemo(
    () => [
      col.display({
        id: "select",
        header: () => (
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected; }}
            onChange={toggleAll}
            className="w-3.5 h-3.5 accent-[#3525CD] cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selected.includes(row.original.id)}
            onChange={() => toggleOne(row.original.id)}
            className="w-3.5 h-3.5 accent-[#3525CD] cursor-pointer"
          />
        ),
      }),
      col.accessor("receiptNo", {
        header: "Receipt No.",
        cell: (info) => (
          <a href="#" onClick={(e) => e.stopPropagation()} className="font-mono text-[#3525CD] hover:underline text-[12px]">
            {info.getValue() ?? info.row.original.id}
          </a>
        ),
      }),
      col.accessor("date", {
        header: "Date & Time",
        cell: (info) => (
          <span className="text-slate-400 text-[12px] whitespace-nowrap">{info.getValue()}</span>
        ),
      }),
      col.accessor("student", {
        header: "Student",
        cell: (info) => (
          <span className="font-medium text-slate-800 text-[13px] truncate max-w-[160px] block">
            {info.getValue()}
          </span>
        ),
      }),
      col.accessor("className", {
        header: "Class",
        cell: (info) => (
          <span className="text-slate-500 text-[13px]">{info.getValue() ?? "—"}</span>
        ),
      }),
      col.accessor("feeHead", {
        header: "Fee Head",
        cell: (info) => (
          <span className="text-slate-500 text-[13px] truncate max-w-[130px] block">
            {info.getValue() ?? "Tuition"}
          </span>
        ),
      }),
      col.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <span className="font-semibold text-slate-800 text-[13px]">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      col.accessor("mode", {
        header: "Mode",
        cell: (info) => (
          <span className={getModeBadgeClass(info.getValue() as any)}>
            {info.getValue()}
          </span>
        ),
      }),
      col.display({
        id: "sentToParent",
        header: "Sent to Parent",
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <WASentBadge sent={(row.original as any).waSent} />
          </div>
        ),
      }),
      col.display({
        id: "actions",
        header: "Actions",
        cell: ({ }) => (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button className="inline-flex items-center gap-1 text-[#3525CD] hover:bg-indigo-50 text-[12px] font-medium px-1.5 py-1 rounded transition-colors">
              <Eye className="w-3.5 h-3.5 flex-shrink-0" />
              View
            </button>
            <span className="text-slate-300">/</span>
            <button className="inline-flex items-center gap-1 text-[#3525CD] hover:bg-indigo-50 text-[12px] font-medium px-1.5 py-1 rounded transition-colors">
              <Download className="w-3.5 h-3.5 flex-shrink-0" />
              Download
            </button>
          </div>
        ),
      }),
    ],
    [selected, allSelected, someSelected]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();

  return (
    <div className="px-5 pb-5 font-sans w-full">

      {/* ── Summary Bar ── */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 bg-[#3525CD] rounded-full flex-shrink-0" />
          <span className="font-semibold text-slate-700">{data.length} payments</span>
          <span className="text-slate-300">·</span>
          <span className="font-bold text-[#3525CD]">{formatCurrency(total)} collected</span>
        </div>
        <div className="flex gap-4 text-xs text-slate-500">
          <span>Cash: {formatCurrency(cash)}</span>
          <span>UPI: {formatCurrency(upi)}</span>
          <span>Cheque: {formatCurrency(cheque)}</span>
        </div>
      </div>

      {/* ── Table — scrolls horizontally inside page ── */}
      <div className="border border-slate-200 rounded-xl w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm">

          {/* ── Header ── */}
          <thead className="bg-slate-50 border-b border-slate-200">
            {headerGroups.map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>

        {/* ── Virtualized rows ── */}
        <Virtuoso
          className="w-full"
          style={{ height: 540 }}
          totalCount={rows.length}
          itemContent={(index) => {
            const row = rows[index];
            const isSelected = selected.includes(row.original.id);
            return (
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr
                    className={`border-b border-slate-100 transition-colors cursor-pointer ${
                      isSelected ? "bg-indigo-50/70" : "hover:bg-slate-50/80"
                    }`}
                    onClick={() => toggleOne(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-3 align-middle whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            );
          }}
        />
      </div>

      {/* ── Footer ── */}
      <div className="flex justify-between text-xs text-slate-400 mt-2 pt-2">
        <span>
          Showing 1–{data.length} of {data.length} receipts
          {selected.length > 0 && (
            <span className="ml-2 text-[#3525CD] font-medium">· {selected.length} selected</span>
          )}
        </span>
        <span className="font-semibold text-slate-700">{formatCurrency(total)} total</span>
      </div>
    </div>
  );
};