import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Search,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentSuccessModal } from "./PaymentSuccessModal";
import { mockStudents, feeOptions } from "../data/fee.data";
import type {
  RecordFeePaymentModalProps,
  PaymentMode,
} from "../types/fees.types";
import {
  requiresTransactionId,
  derivePaymentStatus,
  calculateLateFee,
  paymentStatusBadge,
} from "../utils/lateFee.utils";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const schema = z
  .object({
    search: z.string().min(1, "Search is required"),
    paymentMode: z.enum(["UPI", "CASH", "CARD", "CHEQUE", "BANK"]),
    transactionId: z.string().optional(),
    receiptNo: z.string().min(1, "Receipt no. is required"),
    paymentDate: z.string().min(1, "Date is required"),
    /** The amount the student is paying right now (may be partial) */
    paymentAmount: z
      .number({ invalid_type_error: "Enter a valid amount" })
      .positive("Amount must be greater than 0"),
    fees: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        amount: z.number(),
        paidAmount: z.number(),
        remainingAmount: z.number(),
        selected: z.boolean(),
        overdue: z.boolean().optional(),
        lateFee: z.number().optional(),
      })
    ),
  })
  .superRefine((data, ctx) => {
    // transactionId is required for non-cash modes
    if (
      requiresTransactionId(data.paymentMode) &&
      !data.transactionId?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["transactionId"],
        message: "Transaction ID is required for this payment mode",
      });
    }
    // paymentAmount must not exceed total remaining
    const totalRemaining = data.fees
      .filter((f) => f.selected)
      .reduce((s, f) => s + f.remainingAmount + (f.lateFee ?? 0), 0);
    if (data.paymentAmount > totalRemaining) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentAmount"],
        message: "Payment cannot exceed total remaining amount",
      });
    }
  });

type FormType = z.infer<typeof schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYMENT_MODE_OPTIONS: { value: PaymentMode; label: string; Icon: React.ElementType }[] = [
  { value: "UPI", label: "UPI", Icon: Smartphone },
  { value: "CASH", label: "Cash", Icon: Banknote },
  { value: "CARD", label: "Card", Icon: CreditCard },
  { value: "BANK", label: "Bank", Icon: Building2 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepLabel({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-5 h-5 rounded-full bg-[#3525CD] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        {n}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
        {text}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RecordFeePaymentModal({ onClose }: RecordFeePaymentModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [studentSelected, setStudentSelected] = useState(true);

  const selectedStudent = mockStudents[0];

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: "Ravi",
      paymentMode: "UPI",
      transactionId: "",
      receiptNo: `RCP-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentAmount: 0,
      fees: feeOptions.map((f) => ({
        ...f,
        paidAmount: 0,
        remainingAmount: f.amount,
        selected: false,
        lateFee: f.overdue
          ? calculateLateFee(f.amount, f.dueDate ?? "", 0, 50, "flat")
          : 0,
      })),
    },
  });

  const fees = watch("fees");
  const paymentMode = watch("paymentMode");
  const paymentAmount = watch("paymentAmount");

  // Auto-fill paymentAmount when fees are toggled
  const totalRemaining = useMemo(
    () =>
      fees
        .filter((f) => f.selected)
        .reduce((s, f) => s + f.remainingAmount + (f.lateFee ?? 0), 0),
    [fees]
  );

  useEffect(() => {
    setValue("paymentAmount", totalRemaining);
  }, [totalRemaining, setValue]);

  const toggleFee = (id: string) => {
    setValue(
      "fees",
      fees.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f))
    );
  };

  const paymentStatus = derivePaymentStatus(totalRemaining, paymentAmount);
  const statusBadge = paymentStatusBadge(paymentStatus);
  const showTransactionId = requiresTransactionId(paymentMode);

  const onSubmit = (_data: FormType) => setShowSuccess(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full sm:w-[540px] h-full sm:h-auto max-w-full sm:max-w-[95vw] rounded-none sm:rounded-2xl bg-white shadow-2xl flex flex-col max-h-full sm:max-h-[92vh]">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Record Fee Payment
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5"
        >
          {/* Step 1 – Search Student */}
          <div>
            <StepLabel n={1} text="Search Student" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                {...register("search")}
                className="w-full pl-9 pr-3 h-10 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Search student name or admission no."
              />
            </div>

            {studentSelected && (
              <div className="mt-2 border border-[#3525CD]/30 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-[#EEF0FF]">
                  <div className="w-6 h-6 rounded-full bg-[#3525CD]/20 flex items-center justify-center text-[10px] font-bold text-[#3525CD]">
                    RK
                  </div>
                  <span className="text-xs font-medium text-[#3525CD]">
                    Ravi Kumar – Class 10A
                  </span>
                  <button
                    type="button"
                    className="ml-auto text-[#3525CD]/50 hover:text-[#3525CD]"
                    onClick={() => setStudentSelected(false)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 shrink-0">
                    RK
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">
                      {selectedStudent?.name}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      {selectedStudent?.className} |{" "}
                      {selectedStudent?.admissionNo}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      Parent: {selectedStudent?.parentName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-red-600">
                      ₹
                      {selectedStudent?.pendingAmount?.toLocaleString("en-IN")}{" "}
                      pending
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2 – Select Fees */}
          <div>
            <StepLabel n={2} text="Select Fees to Pay" />
            <div className="space-y-2">
              {fees.map((fee) => (
                <label
                  key={fee.id}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                    fee.selected
                      ? "bg-[#EEF0FF] border-[#3525CD]/40"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={fee.selected}
                    onChange={() => toggleFee(fee.id)}
                    className="w-3.5 h-3.5 accent-[#3525CD] shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-700 block">
                      {fee.label}
                    </span>
                    {/* Partial payment progress */}
                    {fee.paidAmount > 0 && (
                      <div className="mt-1">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                          <span>
                            Paid: ₹{fee.paidAmount.toLocaleString("en-IN")}
                          </span>
                          <span>
                            Remaining: ₹
                            {fee.remainingAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (fee.paidAmount / fee.amount) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {/* Late fee badge */}
                    {fee.overdue && (fee.lateFee ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 mt-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Late fee: ₹{(fee.lateFee ?? 0).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {fee.overdue && (
                      <span className="block text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-medium mb-1">
                        Overdue
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        fee.selected ? "text-[#3525CD]" : "text-gray-600"
                      }`}
                    >
                      ₹{fee.remainingAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3 – Payment Mode */}
          <div>
            <StepLabel n={3} text="Payment Mode" />
            <Controller
              control={control}
              name="paymentMode"
              render={({ field }) => (
                <div className="flex gap-2 flex-wrap">
                  {PAYMENT_MODE_OPTIONS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 h-9 rounded-lg border text-xs font-medium transition-colors ${
                        field.value === value
                          ? "bg-[#3525CD] text-white border-[#3525CD]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Step 4 – Amount to Pay (editable for partial) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Amount to Pay
              </label>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                max={totalRemaining}
                {...register("paymentAmount", { valueAsNumber: true })}
                className="w-full pl-7 pr-3 h-11 text-base font-bold rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            {errors.paymentAmount && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.paymentAmount.message}
              </p>
            )}
            {paymentStatus === "PARTIAL" && (
              <p className="flex items-center gap-1 text-[11px] text-amber-600 mt-1">
                <Info className="w-3 h-3" />
                Partial payment — ₹
                {(totalRemaining - paymentAmount).toLocaleString("en-IN")}{" "}
                will remain outstanding
              </p>
            )}
            <p className="text-[11px] text-gray-400 mt-0.5">
              Total due: ₹{totalRemaining.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Transaction ID (conditional) + Receipt No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {showTransactionId && (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 block mb-1.5">
                  Transaction ID *
                </label>
                <input
                  {...register("transactionId")}
                  placeholder="UPI123456789"
                  className={`w-full h-9 px-3 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                    errors.transactionId
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.transactionId && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.transactionId.message}
                  </p>
                )}
              </div>
            )}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 block mb-1.5">
                Receipt No.
              </label>
              <input
                {...register("receiptNo")}
                placeholder="RCP-2025-6848"
                className="w-full h-9 px-3 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 block mb-1.5">
              Payment Date
            </label>
            <input
              type="date"
              {...register("paymentDate")}
              className="w-full h-9 px-3 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Summary row */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-700">
              Total Payable
            </span>
            <span className="text-sm font-bold text-gray-900">
              ₹{(paymentAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-white pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Record Payment
            </Button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <PaymentSuccessModal
          receiptNo={watch("receiptNo")}
          amount={totalRemaining}
          paidAmount={watch("paymentAmount") ?? 0}
          remainingAmount={
            totalRemaining - (watch("paymentAmount") ?? 0)
          }
          paymentStatus={paymentStatus}
          paymentMode={paymentMode}
          paymentDate={watch("paymentDate")}
          studentName="Ravi Kumar"
          studentClass="Class 10A"
          onRecordAnother={() => {
            setShowSuccess(false);
            onClose();
          }}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
