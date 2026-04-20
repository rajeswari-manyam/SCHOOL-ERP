import { useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Transaction } from "../types/fees.types";
import { formatCurrency } from "../utils/fee.utils";
import { Eye, Download, Send, CheckCircle } from "lucide-react";

type Props = { data: Transaction[] };

// ---------- helpers ----------
const modeBadge = (mode: string) => {
  switch (mode?.toUpperCase()) {
    case "UPI":
      return "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-blue-50 text-blue-800";
    case "CASH":
      return "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-green-50 text-green-800";
    case "CHEQUE":
      return "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-amber-50 text-amber-800";
    default:
      return "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-slate-100 text-slate-500";
  }
};

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

export const AllTransactionsTable = ({ data }: Props) => {
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
    () =>
      data.reduce(
        (acc, t) => {
          acc.total += t.amount;
          if (t.mode === "CASH") acc.cash += t.amount;
          if (t.mode === "UPI") acc.upi += t.amount;
          if (t.mode === "CHEQUE") acc.cheque += t.amount;
          return acc;
        },
        { cash: 0, upi: 0, cheque: 0, total: 0 }
      ),
    [data]
  );

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
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
      },
      { accessorKey: "receiptNo", header: "Receipt No." },
      { accessorKey: "date", header: "Date & Time" },
      { accessorKey: "student", header: "Student" },
      { accessorKey: "class", header: "Class" },
      { accessorKey: "feeHead", header: "Fee Head" },
      { accessorKey: "amount", header: "Amount" },
      { accessorKey: "mode", header: "Mode" },
      { id: "sentToParent", header: "Sent to Parent" },
      { id: "actions", header: "Actions" },
    ],
    [selected, allSelected, someSelected]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  // Column widths matching Figma layout
const COLS =
  "grid grid-cols-[36px_110px_minmax(90px,1.2fr)_minmax(90px,1.2fr)_70px_minmax(90px,1fr)_90px_80px_120px_140px] w-full";

  return (
<div className="px-5 pb-5 font-sans w-full">

      {/* ── SUMMARY BAR ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 bg-[#3525CD] rounded-full flex-shrink-0" />
          <span className="font-semibold text-slate-700">
            {data.length} payments
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-bold text-[#3525CD]">
            {formatCurrency(total)} collected
          </span>
        </div>
        <div className="flex gap-4 text-xs text-slate-500">
          <span>Cash: {formatCurrency(cash)}</span>
          <span>UPI: {formatCurrency(upi)}</span>
          <span>Cheque: {formatCurrency(cheque)}</span>
        </div>
      </div>

      {/* ── TABLE WRAPPER ── */}
  <div className="border border-slate-200 rounded-xl w-full overflow-x-auto"> 

        {/* ── HEADER ── */}
        <div
          className={`${COLS} text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-200 px-3 py-2.5 w-full`}
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => { if (el) el.indeterminate = someSelected; }}
              onChange={toggleAll}
              className="w-3.5 h-3.5 accent-[#3525CD] cursor-pointer"
            />
          </div>
          <div>Receipt No.</div>
          <div>Date &amp; Time</div>
          <div>Student</div>
          <div>Class</div>
          <div>Fee Head</div>
          <div>Amount</div>
          <div>Mode</div>
          <div>Sent to Parent</div>
          <div>Actions</div>
        </div>

        {/* ── ROWS ── */}
<Virtuoso
  style={{
    height: 540,
    width: "100%",
    overflowX: "hidden",
  }}
          totalCount={rows.length}
          itemContent={(index) => {
            const row = rows[index].original;
            const isSelected = selected.includes(row.id);

            return (
              <div
                className={`${COLS} text-sm px-3 border-b border-slate-100 w-full transition-colors cursor-pointer items-center
                  ${isSelected ? "bg-indigo-50/70" : "hover:bg-slate-50/80"}`}
                style={{ minHeight: 52 }}
                onClick={() => toggleOne(row.id)}
              >
                {/* checkbox */}
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOne(row.id)}
                    className="w-3.5 h-3.5 accent-[#3525CD] cursor-pointer"
                  />
                </div>

                {/* receipt */}
                <div>
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-[#3525CD] hover:underline text-[12px]"
                  >
                    {row.receiptNo ?? row.id}
                  </a>
                </div>

                {/* date */}
                <div className="text-slate-400 text-[12px] leading-snug">
                  {row.date}
                </div>

                {/* student */}
                <div className="font-medium text-slate-800 truncate pr-2 text-[13px]">
                  {row.student}
                </div>

                {/* class */}
                <div className="text-slate-500 text-[13px]">{row.className ?? "—"}</div>

                {/* fee head */}
                <div className="text-slate-500 text-[13px] truncate pr-1">
                  {row.feeHead ?? "Tuition"}
                </div>

                {/* amount */}
                <div className="font-semibold text-slate-800 text-[13px]">
                  {formatCurrency(row.amount)}
                </div>

                {/* mode badge */}
                <div>
                  <span className={modeBadge(row.mode)}>{row.mode}</span>
                </div>

                {/* sent to parent */}
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <WASentBadge sent={(row as any).waSent} />
                </div>

                {/* actions */}
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="inline-flex items-center gap-1 text-[#3525CD] hover:bg-indigo-50 text-[12px] font-medium px-1.5 py-1 rounded transition-colors">
                    <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                    View
                  </button>
                  <span className="text-slate-300 text-sm">/</span>
                  <button className="inline-flex items-center gap-1 text-[#3525CD] hover:bg-indigo-50 text-[12px] font-medium px-1.5 py-1 rounded transition-colors">
                    <Download className="w-3.5 h-3.5 flex-shrink-0" />
                    Download
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* ── FOOTER ── */}
      <div className="flex justify-between text-xs text-slate-400 mt-2 pt-2">
        <span>
          Showing 1–{data.length} of {data.length} receipts
          {selected.length > 0 && (
            <span className="ml-2 text-[#3525CD] font-medium">
              · {selected.length} selected
            </span>
          )}
        </span>
        <span className="font-semibold text-slate-700">
          {formatCurrency(total)} total
        </span>
      </div>
    </div>
  );
};