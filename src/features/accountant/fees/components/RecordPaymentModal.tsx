import { useState } from "react";
import { Card } from "../../../../components/ui/card";
import type { PaymentMode, FeeOption } from "../types/fees.types";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import typography from "@/styles/typography";
import { PaymentSuccessModal } from "./PaymentSuccessModal";

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
  const [receiptNo, setReceiptNo] = useState("RCP-2025-6848");
  const [paymentDate, setPaymentDate] = useState("2025-04-07");
  const [showSuccess, setShowSuccess] = useState(false);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <Card className="relative z-10 w-[550px] max-w-[95vw] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800 tracking-wide">Record Fee Payment</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-5 max-h-[80vh] overflow-y-auto">

          {/* 1. Search Student */}
          <div>
            <label className={`${typography.body.small} font-bold text-slate-400 uppercase tracking-widest mb-2 block`}>
              1. Search Student
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
              />
            </div>

            {studentSelected && (
              <div className="mt-2 rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Ravi Kumar - Class 10A</span>
                  <svg className="ml-auto w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="px-3 py-2.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
                    RK
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${typography.body.small} font-semibold text-slate-800`}>Ravi Kumar</p>
                    <p className={`${typography.body.small} text-slate-500`}>Class 10A | ADM001</p>
                    <p className={`${typography.body.small} text-slate-400`}>Parent: Suresh Kumar</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`${typography.body.small} font-bold text-red-500`}>Rs.8,500 pending</p>
                    <span className={`${typography.body.small} bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
                      Overdue
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Select Fees to Pay */}
          <div>
            <label className={`${typography.body.small} font-semibold text-slate-400 uppercase tracking-widest mb-2 block`}>
              Select Fees to Pay
            </label>
            <div className="space-y-2">
              {fees.map((fee) => (
                <label
                  key={fee.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                    fee.selected ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <Input
                    type="checkbox"
                    checked={fee.selected}
                    onChange={() => toggleFee(fee.id)}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                  <span className={`${typography.body.small} text-slate-700 flex-1`}>{fee.label}</span>
                  <span className={`${typography.body.small} font-semibold ${fee.selected ? "text-red-500" : "text-slate-600"}`}>
                    Rs.{fee.amount.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className={`${typography.body.small} font-semibold text-slate-400 uppercase tracking-widest mb-2 block`}>
              Payment Mode
            </label>
            <div className="flex gap-2">
              {(["UPI", "CASH", "CARD"] as PaymentMode[]).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`flex-1 py-2 rounded-lg ${typography.body.small} font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                    paymentMode === mode
                      ? "bg-indigo-700 text-white border-indigo-700"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount to Pay */}
          <div>
            <label className={`${typography.body.small} font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block`}>
              Amount to Pay
            </label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2.5 bg-white">
              <span className="text-slate-500 text-sm mr-2 font-medium">Rs.</span>
              <Input
                type="text"
                value={totalPayable.toLocaleString()}
                readOnly
                className="bg-transparent text-emerald-500 font-bold text-base flex-1 focus:outline-none"
              />
            </div>
          </div>

          {/* Transaction ID & Receipt No */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`${typography.body.small} font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block`}>
                Transaction ID
              </label>
              <Input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>
            <div>
              <label className={`${typography.body.small} font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block`}>
                Receipt No.
              </label>
              <Input
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className={`${typography.body.small} font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block`}>
              Payment Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white pr-10"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Total Payable */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className={`${typography.body.small} text-slate-500`}>Total Payable</span>
            <span className={`${typography.body.small} font-bold text-slate-800`}>Rs. {totalPayable.toLocaleString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 ${typography.body.small} font-semibold hover:bg-slate-50 transition-colors`}
            >
              Cancel
            </button>
            <Button
              onClick={() => setShowSuccess(true)}
              className="flex-1 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Record Payment
            </Button>
          </div>

        </div>
      </Card>

      {/* ── Success Modal ── */}
      {showSuccess && (
        <PaymentSuccessModal
          receiptNo={receiptNo}
          amount={totalPayable}
          paymentMode={paymentMode}
          paymentDate={paymentDate}
          studentName="Ravi Kumar"
          studentClass="Class 10A"
          onRecordAnother={() => { setShowSuccess(false); onClose(); }}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}