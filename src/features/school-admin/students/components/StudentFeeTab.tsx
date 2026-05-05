import { Button } from "@/components/ui/button";
import type { FeePayment } from "../types/student.types";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const StudentFeeTab = ({ payments }: { payments: FeePayment[] }) => {
  const totalPaid = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const outstanding = payments.filter(p => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Paid This Year</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{fmt(totalPaid)}</p>
          <p className="text-xs text-gray-400 mt-1">Tuition + Exam + Activity</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 border-l-4 border-l-red-400">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Outstanding</p>
          <p className="text-3xl font-extrabold text-red-500 mt-2">{fmt(outstanding)}</p>
          {outstanding > 0 && payments.find(p => p.status === "PENDING") && (
            <p className="text-xs text-red-400 mt-1">{payments.find(p => p.status === "PENDING")?.description}</p>
          )}
          <Button className="mt-3 px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Send Reminder
          </Button>
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h4 className="font-bold text-gray-800">Payment History</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
              Filter
            </Button>
            <Button variant="outline" size="sm" className="text-xs text-indigo-600 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
              ↓ Download All Receipts
            </Button>
          </div>
        </div>
        <div>
          {payments.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < payments.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 transition-colors`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{p.date}</span>
                  <span className="text-sm font-semibold text-gray-800">{p.description}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-900">{fmt(p.amount)}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.status === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                  {p.status}
                </span>
                {p.mode && <span className="text-xs text-gray-400">{p.mode}</span>}
                {p.receiptNo && <span className="text-xs text-gray-400">{p.receiptNo}</span>}
                {p.status === "PAID" && (
                  <Button variant="ghost" size="sm" className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentFeeTab;