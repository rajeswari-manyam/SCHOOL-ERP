import { useState } from "react";
import { Card } from "../../../../components/ui/card";
import type { PaymentMode, FeeOption } from "../types/fees.types";
import { Form } from "../../../../components/ui/form";

interface Props {
  onClose: () => void;
}

type FeeUI = FeeOption & {
  selected: boolean;
  overdue?: boolean;
};

export function RecordFeePaymentModal({ onClose }: Props) {
  const [search, setSearch] = useState("Ravi");
  const [studentSelected] = useState(true);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("UPI");
  const [transactionId, setTransactionId] = useState("UPI123456789");
  const [receiptNo, setReceiptNo] = useState("RCP-2025-8848");
  const [paymentDate, setPaymentDate] = useState("2025-04-07");

  const [fees, setFees] = useState<FeeUI[]>([
    { id: "tuition", label: "Tuition Fee - April 2025", amount: 8500, selected: true, overdue: true },
    { id: "exam", label: "Exam Fee", amount: 1500, selected: false },
    { id: "transport", label: "Transport", amount: 2200, selected: false },
  ]);

  const toggleFee = (id: string) => {
    setFees((prev) =>
      prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f))
    );
  };

  const totalPayable = fees
    .filter((f) => f.selected)
    .reduce((s, f) => s + f.amount, 0);

  return (
    // Full-screen overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-400 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-white font-semibold text-base tracking-wide">Record Fee Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors rounded-lg p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Form className="p-6 space-y-5">

          {/* Step 1: Search Student */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
              1. Search Student
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-slate-50"
              />
            </div>

            {studentSelected && (
              <div className="mt-2 border border-emerald-200 bg-emerald-50 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-emerald-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">RK</div>
                  <span className="text-sm font-semibold text-emerald-800">Ravi Kumar - Class 10A</span>
                  <svg className="ml-auto w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Ravi Kumar</p>
                    <p className="text-xs text-slate-500">Class 10A | ADM001</p>
                    <p className="text-xs text-slate-400 mt-0.5">Parent: Suresh Kumar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-500">₹8,500 pending</p>
                    <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">OVERDUE</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Select Fees */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
              Select Fees to Pay
            </label>
            <div className="space-y-2">
              {fees.map((fee) => (
                <label
                  key={fee.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                    fee.selected
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={fee.selected}
                    onChange={() => toggleFee(fee.id)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-sm text-slate-700 flex-1">{fee.label}</span>
                  <span className={`text-sm font-semibold ${fee.selected ? "text-emerald-700" : "text-slate-600"}`}>
                    ₹{fee.amount.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
              Payment Mode
            </label>
            <div className="flex gap-2">
              {(["UPI", "CASH", "CARD"] as PaymentMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    paymentMode === mode
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {mode === "UPI" && "⚡ "}
                  {mode === "CASH" && "💵 "}
                  {mode === "CARD" && "💳 "}
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Amount to Pay
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
              <span className="text-slate-500 text-sm mr-2">Rs.</span>
              <input
                type="text"
                value={totalPayable.toLocaleString()}
                readOnly
                className="bg-transparent text-slate-800 font-bold text-lg flex-1 focus:outline-none"
              />
            </div>
          </div>

          {/* Transaction ID & Receipt No */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
                Transaction ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
                Receipt No.
              </label>
              <input
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
              />
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Payment Date
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm text-slate-500 font-medium">Total Payable</span>
            <span className="text-lg font-bold text-slate-800">₹{totalPayable.toLocaleString()}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Record Payment
            </button>
          </div>

        </Form>
      </Card>
    </div>
  );
}