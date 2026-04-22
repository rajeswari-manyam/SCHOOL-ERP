import { useState } from "react";
import { X, Search, Phone, CheckCircle2, RefreshCw, Download, MessageCircle, Save } from "lucide-react";
import { formatCurrency, FEE_HEADS, PAYMENT_MODES, numberToWords } from "../../utils/useAccountant";
import { useReceiptsManager } from "../hooks/useReceiptsManager";
import { ReceiptDetailModal } from "./ReceiptDetailModal";
import type { GenerateReceiptModalProps, Student, ReceiptDetail } from "../types/receipts.types";

export const GenerateReceiptModal = ({
  onClose,
  onSuccess,
}: GenerateReceiptModalProps) => {
  const {
    query, suggestions, showDropdown, selectedStudent, dropdownRef,
    feeHead, paymentMode, period, amount, paymentDate, receiptNo,
    isSubmitting, isSuccess, canGenerate,
    setFeeHead, setPaymentMode, setPeriod, setAmount, setPaymentDate, setReceiptNo,
    handleQueryChange, handleSelectStudent, handleGenerate,
  } = useReceiptsManager(onClose, onSuccess);

  const [showReceiptDetail, setShowReceiptDetail] = useState(false);

  const numAmount = Number(amount) || 0;
  const showPreview = !!selectedStudent;

  const receiptDetailData: ReceiptDetail | null = selectedStudent && receiptNo ? {
    id: Date.now().toString(),
    receiptNo,
    date: paymentDate
      ? new Date(paymentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "—",
    time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    student: selectedStudent.name,
    className: `${selectedStudent.className}${selectedStudent.section}`,
    feeHead,
    amount: numAmount,
    mode: paymentMode as any,
    status: "Not Sent",
    waStatus: "Not Sent",
    fatherName: selectedStudent.fatherName,
    admissionNo: selectedStudent.admissionNo,
    referenceNo: "—",
    period,
    collectedBy: "Accountant",
  } : null;

  const handleSelectAndScroll = (s: Student) => {
    handleSelectStudent(s);
    setTimeout(() => {
      document.getElementById("receipt-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">

          {/* INFO BANNER */}
          <div className="bg-blue-50 border-b border-blue-100 px-5 py-2.5 rounded-t-2xl flex items-center gap-2">
            <span className="text-blue-500 text-xs">ℹ️</span>
            <p className="text-[11px] text-blue-600">
              Use this form to generate a receipt for a payment that was collected but not yet recorded in the system.
            </p>
          </div>

          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Generate Fee Receipt</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* BODY */}
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

        
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Step 1 — Find Student
              </p>

              <div ref={dropdownRef} className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search student by name or admission number..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {showDropdown && (
                  <div className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-xl overflow-hidden">
                    {suggestions.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectAndScroll(s)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 cursor-pointer border-b last:border-0 border-gray-50"
                      >
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {s.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{s.name}</p>
                          <p className="text-[10px] text-gray-400">Class {s.className}{s.section} · {s.admissionNo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected student */}
              {selectedStudent && (
                <div className="mt-2 rounded-xl border border-gray-200 overflow-hidden">
                  {/* Chip row */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border-b border-indigo-100">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                      {selectedStudent.avatar}
                    </div>
                    <span className="text-xs font-semibold text-indigo-800">{selectedStudent.name}</span>
                    <span className="text-[10px] text-indigo-400">
                      Class {selectedStudent.className}{selectedStudent.section} — {selectedStudent.admissionNo}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 ml-auto flex-shrink-0" />
                  </div>

                  {/* Expanded card */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-white">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-700 text-xs font-bold">{selectedStudent.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900">{selectedStudent.name}</p>
                      <p className="text-[10px] text-gray-400">
                        · Class {selectedStudent.className}{selectedStudent.section} &nbsp;·&nbsp; {selectedStudent.admissionNo}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-gray-400 uppercase mb-0.5">Parent Contact</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-[11px] font-semibold text-gray-700">+91 {selectedStudent.parentContact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

        
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Step 2 — Fee Details
              </p>

     
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 block mb-1">Fee Head</label>
                  <select
                    value={feeHead}
                    onChange={(e) => setFeeHead(e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                  >
                    <option value="">Select fee head</option>
                    {FEE_HEADS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-gray-500 block mb-1">Payment Mode</label>
                  <div className="flex gap-1.5">
                    {PAYMENT_MODES.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setPaymentMode(m.value)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
                          paymentMode === m.value
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-200 text-gray-600 hover:border-indigo-300"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

          
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 block mb-1">Period</label>
                  <input
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="April 2025"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 block mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium">Rs.</span>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      type="number"
                      className="w-full border border-gray-200 pl-8 pr-3 py-2 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>
              </div>

        
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 block mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 block mb-1">Receipt Number</label>
                  <div className="flex gap-1.5">
                    <input
                      value={receiptNo}
                      onChange={(e) => setReceiptNo(e.target.value)}
                      placeholder="RCP-2025-0848"
                      className="flex-1 border border-gray-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      onClick={() => setReceiptNo(`RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <RefreshCw className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-semibold text-gray-500 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Add any specific details regarding this payment..."
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-500"
                />
              </div>
            </div>

            {/* ── RECEIPT PREVIEW ── */}
            {showPreview && (
              <div id="receipt-preview">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Receipt Preview
                </p>

                <div className="flex gap-3 items-start">

                  {/* Left: Receipt card */}
                  <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden">

                    {/* School header */}
                    <div className="flex items-center justify-between px-3 py-2.5 bg-[#1a237e]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                          <span className="text-[#1a237e] text-[10px] font-black">H</span>
                        </div>
                        <div>
                          <p className="text-white text-[10px] font-bold leading-tight">HANAMKONDA PUBLIC SCHOOL</p>
                          <p className="text-blue-200 text-[8px]">Recognised by Govt of Telangana</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-300 text-[8px] uppercase">Office Copy</p>
                        <p className="text-white text-[10px] font-bold">{receiptNo || "—"}</p>
                      </div>
                    </div>

                    {/* Receipt details */}
                    <div className="p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[8px] text-gray-400 uppercase">Student Name</p>
                          <p className="text-[10px] font-semibold text-gray-900">{selectedStudent!.name}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-400 uppercase">Class & Section</p>
                          <p className="text-[10px] font-semibold text-gray-900">
                            {selectedStudent!.className}{selectedStudent!.section}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-400 uppercase">Date of Payment</p>
                          <p className="text-[10px] font-semibold text-gray-900">
                            {paymentDate
                              ? new Date(paymentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-400 uppercase">Payment Mode</p>
                          <p className="text-[10px] font-semibold text-gray-900">{paymentMode || "—"}</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-2 flex items-end justify-between">
                        <div>
                          <p className="text-[8px] text-gray-400 uppercase">Grand Total</p>
                          <p className="text-[8px] text-gray-400 italic">
                            {numAmount > 0 ? numberToWords(numAmount) : "—"}
                          </p>
                        </div>
                        <p className="text-base font-extrabold text-indigo-700">
                          {numAmount > 0 ? formatCurrency(numAmount) : "₹0"}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <p className="text-[7px] text-gray-300">Computer Generated Receipt — Signature Not Required</p>
                        <p className="text-[7px] text-gray-400 font-medium">AUTHORIZED SIGNATORY</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action buttons */}
                  <div className="flex flex-col gap-2 w-40 flex-shrink-0">

                    {/* WhatsApp Receipt */}
                    <button className="flex items-start gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-semibold text-green-700">WhatsApp Receipt</p>
                        <p className="text-[8px] text-green-500 leading-tight">
                          Send receipt to parent via WhatsApp (+91 {selectedStudent!.parentContact})
                        </p>
                      </div>
                    </button>

                    {/* Save to Records */}
                    <button
                      onClick={handleGenerate}
                      disabled={!canGenerate}
                      className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl transition-colors ${
                        canGenerate
                          ? "bg-white border-gray-200 hover:bg-gray-50"
                          : "bg-gray-50 border-gray-100 cursor-not-allowed"
                      }`}
                    >
                      <Save className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      <p className="text-[10px] font-semibold text-gray-700">
                        {isSubmitting ? "Saving..." : isSuccess ? "✓ Saved" : "Save to Records"}
                      </p>
                    </button>

                    {/* Generate & Download PDF */}
                    <button
                      onClick={() => receiptDetailData && setShowReceiptDetail(true)}
                      disabled={!receiptDetailData}
                      className="flex items-center gap-2 px-3 py-2.5 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-3.5 h-3.5 text-white flex-shrink-0" />
                      <p className="text-[10px] font-semibold text-white leading-tight">Generate & Download PDF</p>
                    </button>

                    {/* Generate & Send WhatsApp */}
                    <button
                      onClick={() => receiptDetailData && setShowReceiptDetail(true)}
                      disabled={!receiptDetailData}
                      className="flex items-center gap-2 px-3 py-2.5 bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-white flex-shrink-0" />
                      <p className="text-[10px] font-semibold text-white leading-tight">Generate & Send WhatsApp</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── FOOTER ── */}
          <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors ${
                canGenerate
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Saving..." : isSuccess ? "✓ Saved" : "Save to Records"}
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Detail Popup — opens on PDF/WhatsApp button click */}
      {showReceiptDetail && receiptDetailData && (
        <ReceiptDetailModal
          receipt={receiptDetailData}
          onClose={() => setShowReceiptDetail(false)}
        />
      )}
    </>
  );
};