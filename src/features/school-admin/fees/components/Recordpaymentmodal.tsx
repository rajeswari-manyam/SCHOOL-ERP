import React, { useState, useEffect } from "react";
import type { PendingFee, PaymentMode, RecordPaymentForm } from "../types/fees.types";
import { formatCurrency, generateReceiptNumber, getTodayDate } from "../utils/Fee.utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface RecordPaymentModalProps {
  fee: PendingFee | null;
  onClose: () => void;
  onSubmit: (form: RecordPaymentForm) => Promise<void>;
}

const PAYMENT_MODES: PaymentMode[] = ["Cash", "UPI", "Cheque", "Bank Transfer"];

export function RecordPaymentModal({ fee, onClose, onSubmit }: RecordPaymentModalProps) {
  const [amountReceived, setAmountReceived] = useState(fee?.amount || 0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("UPI");
  const [upiReference, setUpiReference] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [receiptNumber] = useState(generateReceiptNumber);
  const [paymentDate, setPaymentDate] = useState(getTodayDate);
  const [notes, setNotes] = useState("");
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fee) setAmountReceived(fee.amount);
  }, [fee]);

  if (!fee) return null;

  const remaining = Math.max(0, fee.amount - amountReceived);
  const isFullyPaid = amountReceived >= fee.amount;

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit({
      studentId: fee.studentId,
      feeHead: `${fee.feeHead} — April 2025`,
      amountDue: fee.amount,
      amountReceived,
      paymentMode,
      upiReference: paymentMode === "UPI" ? upiReference : undefined,
      receiptNumber,
      paymentDate,
      notes,
      sendWhatsApp,
      parentPhone: fee.parentPhone,
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Record Fee Payment</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none p-0">
            ×
          </Button>
        </div>

        {/* Student info */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {fee.initials}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{fee.studentName}</div>
                <div className="text-xs text-gray-500">Class {fee.class}{fee.section} | {fee.admissionNo}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">{fee.feeHead} — April 2025</div>
              <div className="text-sm font-bold text-red-600">{formatCurrency(fee.amount)} pending</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-4">
          {/* Fee Head */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fee Head</label>
            <div className="mt-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50">
              {fee.feeHead} — April 2025
            </div>
          </div>

          {/* Amount row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount Due</label>
              <div className="mt-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50">
                ₹ {fee.amount.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Amount Received <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                <Input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(Number(e.target.value))}
                  className="w-full pl-7"
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">Enter partial amount if paying in parts</div>
            </div>
          </div>

          {/* Payment mode */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Payment Mode <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mt-2">
              {PAYMENT_MODES.map((mode) => (
                <Button
                  key={mode}
                  variant={paymentMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentMode(mode)}
                  className="flex-1 text-xs font-semibold"
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          {/* UPI reference */}
          {paymentMode === "UPI" && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                UPI Reference Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter UPI transaction ID"
                value={upiReference}
                onChange={(e) => setUpiReference(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
          )}

          {/* Cheque number */}
          {paymentMode === "Cheque" && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Cheque Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter cheque number"
                value={chequeNumber}
                onChange={(e) => setChequeNumber(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
          )}

          {/* Receipt + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Receipt Number <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50">
                {receiptNumber}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>
            <Input
              type="text"
              placeholder="Optional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full"
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">Paying</div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">{formatCurrency(amountReceived)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">Remaining</div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">{formatCurrency(remaining)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">Status</div>
              <div className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${
                isFullyPaid ? "bg-green-500 text-white" : "bg-orange-400 text-white"
              }`}>
                {isFullyPaid ? "FULLY PAID" : "PARTIAL"}
              </div>
            </div>
          </div>

          {/* WhatsApp toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs">
              💬
            </div>
            <Checkbox
              checked={sendWhatsApp}
              onCheckedChange={(checked) => setSendWhatsApp(Boolean(checked))}
            />
            <span className="text-sm text-gray-600">
              Send receipt to parent via WhatsApp{" "}
              <span className="text-gray-400">({fee.parentPhone})</span>
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <Button
            variant="outline"
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Recording..." : "Record Payment & Send Receipt"}
          </Button>
        </div>
      </div>
    </div>
  );
}