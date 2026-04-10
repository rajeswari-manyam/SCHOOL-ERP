import type { PaymentHistory } from "../types/fee.types";

interface FeeHistoryProps {
  data: PaymentHistory[];
}

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1v8M4 6l3 3 3-3M1 12h12"
      stroke="#3525CD"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function FeeHistory({ data }: FeeHistoryProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Download all */}
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 text-[13px] text-[#3525CD] font-medium hover:underline">
          <DownloadIcon />
          Download All as PDF
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#E8EBF2] bg-white overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[120px_1fr_100px_120px_140px_60px] gap-3 px-5 py-3 bg-[#F8F9FF] border-b border-[#E8EBF2]">
          {["DATE", "FEE HEAD", "AMOUNT", "MODE", "RECEIPT NO", "ACTION"].map((h) => (
            <p key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{h}</p>
          ))}
        </div>

        {/* Rows */}
        {data.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[120px_1fr_100px_120px_140px_60px] gap-3 items-center px-5 py-3.5 border-b border-[#F4F6FA] last:border-0 hover:bg-[#F8F9FF] transition-colors"
          >
            <p className="text-[13px] text-gray-500">{item.date}</p>
            <p className="text-[13px] font-semibold text-[#0B1C30] truncate">{item.feeHead}</p>
            <p className="text-[13px] font-semibold text-[#3525CD]">Rs.{item.amount.toLocaleString("en-IN")}</p>
            <p className="text-[13px] text-gray-500">{item.mode}</p>
            <p className="text-[12px] text-gray-400 font-mono">{item.receiptNo}</p>
            <button className="flex items-center gap-1 text-[12px] text-[#3525CD] font-medium hover:underline">
              <DownloadIcon />
            </button>
          </div>
        ))}
      </div>

      {/* Footer summary */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[13px] text-gray-500">
          Total paid: <span className="font-semibold text-[#0B1C30]">Rs.{total.toLocaleString("en-IN")}</span> across {data.length} transactions
        </p>
        <button className="flex items-center gap-1.5 text-[13px] text-[#3525CD] font-medium hover:underline">
          <DownloadIcon />
          Download All Receipts as PDF
        </button>
      </div>
    </div>
  );
}