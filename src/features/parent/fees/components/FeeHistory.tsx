import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Virtuoso } from "react-virtuoso";
import { Download, FileDown, ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react";

import { downloadRecordFeePayment } from "@/services/fee.api";
import type { FeeHistoryProps, PaymentHistory } from "../types/fee.types";


function ReceiptCard({
  item,
  onDelete,
}: {
  item: PaymentHistory;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try { await onDelete(item.id); } finally { setDeleting(false); }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadRecordFeePayment(item.id); } finally { setDownloading(false); }
  };

  return (
    <div className="rounded-xl border border-[#E8EBF2] bg-white p-3.5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-[14px] font-semibold text-[#0B1C30] leading-snug flex-1">
          {item.feeHead}
        </p>
        <p className="text-[15px] font-semibold text-[#3525CD] whitespace-nowrap">
          Rs.{item.amount.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
        <span>{item.date}</span>
        <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
        <span className="font-mono text-[11px]">{item.receiptNo}</span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0F2F7]">
        <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {item.mode}
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 text-[12px] font-medium text-[#3525CD] hover:text-[#2a1db5] disabled:opacity-50 transition-colors"
          >
            {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} strokeWidth={1.5} />}
            Download
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 text-[12px] font-medium text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
            >
              {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


function MobileView({ data, onDelete }: { data: PaymentHistory[]; onDelete?: (id: string) => Promise<void> }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="md:hidden rounded-xl border border-[#E8EBF2] bg-white overflow-hidden">
      <Virtuoso
        style={{ height: "420px" }}
        data={data}
        itemContent={(_, item) => (
          <div className="px-3 pt-3 last:pb-3">
            <ReceiptCard item={item} onDelete={onDelete} />
          </div>
        )}
      />

      <div className="px-3.5 py-3 border-t border-[#E8EBF2] flex flex-col gap-2.5">
        <p className="text-[13px] text-gray-400">
          Total paid:{" "}
          <span className="font-semibold text-[#0B1C30]">
            Rs.{total.toLocaleString("en-IN")}
          </span>{" "}
          across{" "}
          <span className="font-semibold text-[#0B1C30]">
            {data.length} transactions
          </span>
        </p>

        <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[13px] font-medium text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white hover:bg-[#3525CD] hover:text-white transition-all">
          <FileDown size={14} strokeWidth={1.5} />
          Download All Receipts as PDF
        </button>
      </div>
    </div>
  );
}


const columnHelper = createColumnHelper<PaymentHistory>();

function DesktopView({ data, onDelete }: { data: PaymentHistory[]; onDelete?: (id: string) => Promise<void> }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    setDeletingId(id);
    try { await onDelete(id); } finally { setDeletingId(null); }
  };

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    try { await downloadRecordFeePayment(id); } finally { setDownloadingId(null); }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="text-[13px] text-gray-400">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("feeHead", {
        header: "Fee Head",
        cell: (info) => (
          <span className="text-[13px] font-semibold text-[#0B1C30]">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <span className="text-[13px] font-semibold text-[#3525CD]">
            Rs.{info.getValue().toLocaleString("en-IN")}
          </span>
        ),
      }),
      columnHelper.accessor("mode", {
        header: "Mode",
        cell: (info) => (
          <span className="text-[13px] text-[#0B1C30]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("receiptNo", {
        header: "Receipt No",
        cell: (info) => (
          <span className="font-mono text-[13px] text-gray-400">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: "Actions",
        cell: ({ row }) => {
          const id = row.original.id;
          const isDeleting = deletingId === id;
          const isDownloading = downloadingId === id;
          return (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownload(id)}
                disabled={isDownloading}
                className="flex items-center gap-1.5 text-[13px] text-[#3525CD] hover:text-[#2a1db5] disabled:opacity-50 transition-colors"
              >
                {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                Download
              </button>
              {onDelete && (
                <button
                  onClick={() => handleDelete(id)}
                  disabled={isDeleting}
                  className="flex items-center gap-1 text-[13px] text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                >
                  {isDeleting
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Trash2 size={14} />
                  }
                  Delete
                </button>
              )}
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deletingId, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const { pageIndex } = table.getState().pagination;
  const totalPages = table.getPageCount();

  return (
    <div className="hidden md:block rounded-xl border border-[#E8EBF2] bg-white overflow-hidden">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-5 py-3 text-left text-[11px] text-gray-400 uppercase">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-[#F0F2F7]">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-5 py-3.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8EBF2]">
        <p className="text-[13px] text-gray-400">
          Total paid:{" "}
          <span className="font-semibold text-[#0B1C30]">
            Rs.{total.toLocaleString("en-IN")}
          </span>{" "}
          across{" "}
          <span className="font-semibold text-[#0B1C30]">
            {data.length} transactions
          </span>
        </p>

        <div className="flex items-center gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft />
          </button>
          <span>{pageIndex + 1} / {totalPages}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function FeeHistory({ data = [], onDelete }: FeeHistoryProps) {
  return (
    <>
      <MobileView data={data} onDelete={onDelete} />
      <DesktopView data={data} onDelete={onDelete} />
    </>
  );
}
