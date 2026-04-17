import { useState } from "react";
import type { PaymentHistory } from "../types/fee.types";
// import { Pagination } from "../../../../components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../../components/ui/table";

interface FeeHistoryProps {
  data: PaymentHistory[];
}

const DownloadIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1v8M4 6l3 3 3-3M1 12h12"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Mobile card for a single transaction ───────────────────────────────────
function ReceiptCard({ item }: { item: PaymentHistory }) {
  return (
    <div className="rounded-xl border border-[#E8EBF2] bg-white p-3.5">
      {/* Top row: fee head + amount */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-[14px] font-semibold text-[#0B1C30] leading-snug flex-1">
          {item.feeHead}
        </p>
        <p className="text-[15px] font-semibold text-[#3525CD] whitespace-nowrap">
          Rs.{item.amount.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Meta row: date · receipt */}
      <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
        <span>{item.date}</span>
        <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
        <span className="font-mono text-[11px]">{item.receiptNo}</span>
      </div>

      {/* Bottom row: mode badge + download */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0F2F7]">
        <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {item.mode}
        </span>
        <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#3525CD] hover:text-[#2a1db5] transition-colors">
          <DownloadIcon size={13} />
          Download
        </button>
      </div>
    </div>
  );
}

// ─── Mobile list view ────────────────────────────────────────────────────────
function MobileView({
  data,
  page,
  pageSize,
  totalPages,
  onPageChange,
}: {
  data: PaymentHistory[];
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="rounded-xl border border-[#E8EBF2] bg-white overflow-hidden">
      {/* Cards */}
      <div className="flex flex-col gap-2 p-3">
        {paginatedData.map((item) => (
          <ReceiptCard key={item.id} item={item} />
        ))}
      </div>

      {/* Footer */}
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
        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[13px] font-medium
            text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white
            transition-all duration-200
            hover:bg-[#3525CD] hover:text-white hover:border-[#3525CD]"
        >
          <DownloadIcon />
          Download All Receipts as PDF
        </button>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="border-t border-[#E8EBF2]"
        />
      )}
    </div>
  );
}

// ─── Desktop table view ──────────────────────────────────────────────────────
function DesktopView({
  data,
  page,
  pageSize,
  totalPages,
  onPageChange,
}: {
  data: PaymentHistory[];
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="rounded-xl border border-[#E8EBF2] bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[700px] w-full">
          <TableHeader>
            <TableRow className="border-b border-[#E8EBF2] bg-white hover:bg-white">
              <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 w-[130px]">
                Date
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">
                Fee Head
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 w-[110px]">
                Amount
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 w-[120px]">
                Mode
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 w-[160px]">
                Receipt No
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3 w-[90px]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.id}
                className="border-b border-[#F0F2F7] last:border-0 hover:bg-[#F8F9FF] transition-colors bg-white"
              >
                <TableCell className="text-[13px] text-gray-400 px-5 py-3.5">
                  {item.date}
                </TableCell>
                <TableCell className="text-[13px] font-semibold text-[#0B1C30] px-5 py-3.5">
                  {item.feeHead}
                </TableCell>
                <TableCell className="text-[13px] font-semibold text-[#3525CD] px-5 py-3.5">
                  Rs.{item.amount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-[13px] text-[#0B1C30] px-5 py-3.5">
                  {item.mode}
                </TableCell>
                <TableCell className="font-mono text-[13px] text-gray-400 px-5 py-3.5">
                  {item.receiptNo}
                </TableCell>
                <TableCell className="px-5 py-3.5">
                  {index === 0 ? (
                    <button className="text-[#3525CD] hover:text-[#2a1db5] transition-colors">
                      <DownloadIcon size={16} />
                    </button>
                  ) : (
                    <button className="flex items-center gap-1.5 text-[13px] text-[#3525CD] hover:text-[#2a1db5] transition-colors">
                      <DownloadIcon />
                      Download
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-3.5 bg-white border-t border-[#E8EBF2]">
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
        <button
          className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium
            text-[#3525CD] border border-[#DCE9FF] rounded-lg bg-white
            transition-all duration-200
            hover:bg-[#3525CD] hover:text-white hover:border-[#3525CD]"
        >
          <DownloadIcon />
          Download All Receipts as PDF
        </button>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="border-t border-[#E8EBF2]"
        />
      )}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function FeeHistory({ data }: FeeHistoryProps) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(data.length / pageSize);

  const sharedProps = { data, page, pageSize, totalPages, onPageChange: setPage };

  return (
    <>
      {/* Mobile: shown below md breakpoint */}
      <div className="block md:hidden">
        <MobileView {...sharedProps} />
      </div>

      {/* Desktop: shown at md and above */}
      <div className="hidden md:block">
        <DesktopView {...sharedProps} />
      </div>
    </>
  );
}