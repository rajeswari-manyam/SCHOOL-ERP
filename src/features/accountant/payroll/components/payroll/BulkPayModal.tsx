import { useState } from "react";
import { X, CreditCard, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import type { BulkPayModalProps, PaySalaryFormData } from "../../types/payroll.types";

const PAYMENT_METHODS = ["Bank Transfer", "Cash", "UPI", "Cheque"] as const;

export function BulkPayModal({ staff, onClose, onPay }: BulkPayModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [paymentMethod, setPaymentMethod] = useState<PaySalaryFormData["paymentMethod"]>("Bank Transfer");
  const [paymentDate, setPaymentDate]     = useState(today);
  const [remarks, setRemarks]             = useState("");
  const [loading, setLoading]             = useState(false);

  const totalNet = staff.reduce((s, x) => s + x.net, 0);

  const handleSubmit = async () => {
    if (!paymentDate) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onPay(
      staff.map((s) => s.id),
      {
        bonus: 0, overtime: 0, extraClass: 0,
        leaveDeductions: 0, otherDeductions: 0,
        paymentMethod, paymentDate, remarks,
      }
    );
    setLoading(false);
  };

  const inputCls =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD]";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm px-2 sm:px-4">
      <div className="bg-white rounded-t-xl md:rounded-xl shadow-2xl w-full max-w-[460px] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-slate-100 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#3525CD]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Pay Selected Staff</h2>
              <p className="text-[11px] text-slate-400">{staff.length} employees selected</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">

          {/* Staff List */}
          <div className="bg-slate-50 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-52 overflow-y-auto">
            {staff.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {s.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{s.name}</p>
                    <p className="text-[10px] text-slate-400">{s.role}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#3525CD]">{formatCurrency(s.net)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#3525CD]/5 to-transparent rounded-xl px-4 py-3 border border-[#3525CD]/10">
            <span className="text-sm font-semibold text-slate-700">Total Payout</span>
            <span className="text-xl font-bold text-[#3525CD]">{formatCurrency(totalNet)}</span>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                className={inputCls}
              >
                {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date" value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">Remarks</label>
              <textarea
                rows={2} value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional notes for this batch payment..."
                className={`${inputCls} resize-none placeholder:text-slate-400`}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-4 flex gap-2.5">
          <Button variant="outline" onClick={onClose} className="flex-1 border-slate-200">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !paymentDate}
            className="flex-1 bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-2 disabled:opacity-60"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <CreditCard className="w-4 h-4" />}
            Pay {staff.length} Staff
          </Button>
        </div>
      </div>
    </div>
  );
}
