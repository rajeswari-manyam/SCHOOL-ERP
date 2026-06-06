import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ChevronDown, Search } from "lucide-react";
import type { PendingFee, PaymentMode } from "../types/fees.types";
import { formatCurrency, generateReceiptNumber } from "../utils/Fee.utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface RecordPaymentModalProps {
  fee: PendingFee | null;
  pendingFees?: PendingFee[];
  onClose: () => void;
  onSubmit: (form: {
    studentId: string;
    feeHead: string;
    amountDue: number;
    amountReceived: number;
    paymentMode: PaymentMode;
    upiReference?: string;
    chequeNumber?: string;
    receiptNumber: string;
    paymentDate: string;
    notes?: string;
    sendWhatsApp: boolean;
    parentPhone: string;
  }) => Promise<void>;
}

const PAYMENT_MODES: PaymentMode[] = ["Cash", "UPI", "Cheque", "Bank Transfer"];

const schema = z
  .object({
    amountReceived: z
      .string()
      .min(1, "Amount is required")
      .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Must be a positive amount")
      .refine((v) => Number(v) <= 999999, "Amount too large"),
    paymentMode: z.enum(PAYMENT_MODES),
    upiReference: z.string().optional(),
    chequeNumber: z.string().optional(),
    paymentDate: z.string().min(1, "Payment date is required"),
    notes: z.string().optional(),
    sendWhatsApp: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMode === "UPI" && !data.upiReference?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["upiReference"],
        message: "UPI reference number is required",
      });
    }
    if (data.paymentMode === "Cheque" && !data.chequeNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["chequeNumber"],
        message: "Cheque number is required",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600";

const labelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400";

export function RecordPaymentModal({ fee, pendingFees = [], onClose, onSubmit }: RecordPaymentModalProps) {
  const receiptNumber = generateReceiptNumber();
  const [selectedFee, setSelectedFee] = useState<PendingFee | null>(fee);
  const [studentSearch, setStudentSearch] = useState("");

  const activeFee = fee || selectedFee;

  const filteredFees = pendingFees.filter((f) =>
    !studentSearch ||
    f.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    f.admissionNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      amountReceived: activeFee?.amount?.toString() ?? "",
      paymentMode: "UPI",
      upiReference: "",
      chequeNumber: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      notes: "",
      sendWhatsApp: true,
    },
  });

  useEffect(() => {
    if (activeFee) {
      reset({
        amountReceived: activeFee.amount.toString(),
        paymentMode: "UPI",
        upiReference: "",
        chequeNumber: "",
        paymentDate: new Date().toISOString().slice(0, 10),
        notes: "",
        sendWhatsApp: true,
      });
    }
  }, [activeFee, reset]);

  const paymentMode = useWatch({ control, name: "paymentMode" });
  const amountReceived = useWatch({ control, name: "amountReceived" });

  if (!activeFee) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
          </div>
          <div className="flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0">
            <div className="min-w-0 pr-3">
              <h2 className="text-base sm:text-[17px] font-bold text-gray-900 dark:text-white leading-snug">Record Fee Payment</h2>
              <p className="mt-0.5 text-xs sm:text-[13px] text-gray-400">Select a student to record payment</p>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 flex-shrink-0"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Search student name or admission no..." className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition" />
            </div>
            {filteredFees.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No students found</p>
            ) : (
              <div className="space-y-2">
                {filteredFees.map((f) => (
                  <button key={f.studentId} type="button" onClick={() => setSelectedFee(f)}
                    className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{f.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{f.studentName}</div>
                      <div className="text-xs text-gray-500">Class {f.class}{f.section} | {f.admissionNo}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-500">{f.feeHead}</div>
                      <div className="text-sm font-bold text-red-600">{formatCurrency(f.amount)}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end border-t border-gray-100 dark:border-white/10 px-4 sm:px-6 py-4 flex-shrink-0 gap-2">
            <button type="button" onClick={onClose} className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  const amountNum = Number(amountReceived) || 0;
  const remaining = Math.max(0, activeFee.amount - amountNum);
  const isFullyPaid = amountNum >= activeFee.amount;

  const onFormSubmit = async (values: FormValues) => {
    await onSubmit({
      studentId: activeFee.studentId,
      feeHead: `${activeFee.feeHead} — ${new Date().toLocaleString("default", { month: "long", year: "numeric" })}`,
      amountDue: activeFee.amount,
      amountReceived: Number(values.amountReceived),
      paymentMode: values.paymentMode,
      upiReference: values.paymentMode === "UPI" ? values.upiReference : undefined,
      chequeNumber: values.paymentMode === "Cheque" ? values.chequeNumber : undefined,
      receiptNumber,
      paymentDate: values.paymentDate,
      notes: values.notes,
      sendWhatsApp: values.sendWhatsApp,
      parentPhone: activeFee.parentPhone,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="
          w-full sm:max-w-lg
          bg-white dark:bg-gray-900
          rounded-t-2xl sm:rounded-2xl
          shadow-2xl
          max-h-[92vh] sm:max-h-[90vh]
          flex flex-col
          overflow-hidden
        "
      >
        <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
        </div>

        <div className="flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0">
          <div className="min-w-0 pr-3">
            <h2 className="text-base sm:text-[17px] font-bold text-gray-900 dark:text-white leading-snug">
              Record Fee Payment
            </h2>
            <p className="mt-0.5 text-xs sm:text-[13px] text-gray-400">
              Log a payment received from a student
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 flex-shrink-0"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-5 px-4 sm:px-6 pb-4">

            <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {activeFee.initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{activeFee.studentName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Class {activeFee.class}{activeFee.section} | {activeFee.admissionNo}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">{activeFee.feeHead}</div>
                <div className="text-sm font-bold text-red-600">{formatCurrency(activeFee.amount)} pending</div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Fee Head</label>
              <div className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {activeFee.feeHead}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>Amount Due</label>
                <div className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(activeFee.amount)}
                </div>
              </div>
              <div>
                <label className={labelClass}>Amount Received <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">₹</span>
                  <input type="number" {...register("amountReceived")} placeholder="0" min="1"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-7 pr-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white" />
                </div>
                {errors.amountReceived && <p className="mt-1 text-xs text-red-500">{errors.amountReceived.message}</p>}
                <p className="mt-1 text-[11px] text-gray-400">Enter partial amount if paying in parts</p>
              </div>
            </div>

            <div>
              <label className={`${labelClass} mb-2`}>Payment Mode <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 sm:flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1 sm:gap-0 dark:border-white/10 dark:bg-white/5">
                <input type="hidden" {...register("paymentMode")} />
                {PAYMENT_MODES.map((mode) => (
                  <button key={mode} type="button" onClick={() => setValue("paymentMode", mode, { shouldValidate: true })}
                    className={`sm:flex-1 rounded-lg py-2 px-1 text-[11px] sm:text-[12px] font-semibold transition-all ${paymentMode === mode ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>
                    {mode}
                  </button>
                ))}
              </div>
              {errors.paymentMode && <p className="mt-1 text-xs text-red-500">{errors.paymentMode.message}</p>}
            </div>

            {paymentMode === "UPI" && (
              <div>
                <label className={labelClass}>UPI Reference Number <span className="text-red-500">*</span></label>
                <input type="text" {...register("upiReference")} placeholder="Enter UPI transaction ID" className={inputClass} />
                {errors.upiReference && <p className="mt-1 text-xs text-red-500">{errors.upiReference.message}</p>}
              </div>
            )}

            {paymentMode === "Cheque" && (
              <div>
                <label className={labelClass}>Cheque Number <span className="text-red-500">*</span></label>
                <input type="text" {...register("chequeNumber")} placeholder="Enter cheque number" className={inputClass} />
                {errors.chequeNumber && <p className="mt-1 text-xs text-red-500">{errors.chequeNumber.message}</p>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className={labelClass}>Receipt Number</label>
                <div className="w-full rounded-xl border border-gray-200 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{receiptNumber}</div>
              </div>
              <div>
                <label className={labelClass}>Payment Date <span className="text-red-500">*</span></label>
                <input type="date" {...register("paymentDate")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white" />
                {errors.paymentDate && <p className="mt-1 text-xs text-red-500">{errors.paymentDate.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea {...register("notes")} rows={2} placeholder="Optional notes about this payment" className={`${inputClass} resize-none`} />
            </div>

            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Paying</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{formatCurrency(amountNum)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Remaining</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{formatCurrency(remaining)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Status</div>
                <div className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${isFullyPaid ? "bg-green-500 text-white" : "bg-orange-400 text-white"}`}>
                  {isFullyPaid ? "FULLY PAID" : "PARTIAL"}
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-start sm:items-center gap-3">
              <Checkbox {...register("sendWhatsApp")} className="h-4 w-4 mt-0.5 sm:mt-0 rounded border-gray-300 accent-indigo-600" />
              <span className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
                Send receipt to parent via WhatsApp <span className="text-gray-400 dark:text-gray-500">({activeFee.parentPhone})</span>
              </span>
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between border-t border-gray-100 dark:border-white/10 px-4 sm:px-6 py-4 flex-shrink-0 gap-2 sm:gap-0">
            <button type="button" onClick={onClose}
              className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-2.5 text-[13px] font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
              {isSubmitting ? "Recording…" : "Record Payment & Send Receipt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
