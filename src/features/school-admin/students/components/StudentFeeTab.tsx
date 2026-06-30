import { useState } from "react";
import { Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadPaymentReceipt } from "@/services/fee.api";
import type { StudentFeeSummaryResponse, PaymentsByStudentData } from "@/services/fee.api";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const STATUS_STYLES: Record<string, string> = {
  PAID:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PARTIAL: "bg-amber-50 text-amber-700 border border-amber-200",
  PENDING: "bg-red-50 text-red-600 border border-red-200",
};

interface Props {
  feeSummary: StudentFeeSummaryResponse["data"] | null;
  feePayments: PaymentsByStudentData | null;
}

const StudentFeeTab = ({ feeSummary, feePayments }: Props) => {
  const summary = feeSummary?.summary;
  const details = feeSummary?.details ?? [];
  const payments = feePayments?.payments ?? [];
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (paymentId: string) => {
    setDownloading(paymentId);
    try {
      await downloadPaymentReceipt(paymentId);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-5">

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Paid This Year</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">
            {summary ? fmt(summary.totalPaid) : "—"}
          </p>
          {summary && (
            <p className="text-xs text-gray-400 mt-1">
              {fmt(summary.totalFinal)} total &nbsp;·&nbsp; {fmt(summary.totalDiscount)} discount
            </p>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 border-l-4 border-l-red-400">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Outstanding</p>
          <p className="text-3xl font-extrabold text-red-500 mt-2">
            {summary ? fmt(summary.totalDue) : "—"}
          </p>
          {summary && summary.totalDue > 0 && (
            <p className="text-xs text-red-400 mt-1">{summary.overallStatus}</p>
          )}
          {summary && summary.totalDue > 0 && (
            <Button className="mt-3 px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Send Reminder
            </Button>
          )}
        </div>
      </div>

      {/* Fee breakdown by head */}
      {details.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h4 className="font-bold text-gray-800">Fee Breakdown</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Fee Head", "Original", "Discount", "Final", "Paid", "Due", "Due Date", "Status"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {details.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                      {d.feeHeadName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{fmt(d.originalAmount)}</td>
                    <td className="px-4 py-3 text-emerald-600">
                      {d.discountAmount > 0 ? `-${fmt(d.discountAmount)}` : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{fmt(d.finalAmount)}</td>
                    <td className="px-4 py-3 text-emerald-700 font-semibold">{fmt(d.paidAmount)}</td>
                    <td className={`px-4 py-3 font-bold ${d.dueAmount > 0 ? "text-red-600" : "text-gray-400"}`}>
                      {d.dueAmount > 0 ? fmt(d.dueAmount) : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {d.dueDate ? new Date(d.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[d.status] ?? STATUS_STYLES.PENDING}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h4 className="font-bold text-gray-800">Payment History</h4>
          <Button variant="outline" size="sm" className="text-xs text-indigo-600 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
            ↓ Download All Receipts
          </Button>
        </div>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
            <AlertCircle className="w-8 h-8 text-gray-200" />
            <p className="text-sm">No payment records found</p>
          </div>
        ) : (
          <div>
            {payments.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-4 px-5 py-3.5 ${i < payments.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 transition-colors`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{p.feeName ?? "Fee Payment"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-gray-900">{fmt(p.amount_received)}</span>
                  {p.payment_mode && <span className="text-xs text-gray-400 uppercase">{p.payment_mode}</span>}
                  {p.receipt_no && <span className="text-xs text-gray-400">{p.receipt_no}</span>}
                  <button
                    onClick={() => handleDownload(p.id)}
                    disabled={downloading === p.id}
                    title="Download receipt"
                    className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
                  >
                    {downloading === p.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Download className="h-4 w-4" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentFeeTab;
