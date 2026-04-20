import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, X, CreditCard, Banknote, Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentSuccessModal } from "./PaymentSuccessModal";
import { mockStudents, feeOptions } from "../data/fee.data";
interface Props {
  onClose: () => void;
}

/* ─── schema ─────────────────────────────────────────────────────────────── */
const schema = z.object({
  search: z.string().min(1),
  paymentMode: z.enum(["UPI", "CASH", "CARD"]),
  transactionId: z.string().min(1),
  receiptNo: z.string().min(1),
  paymentDate: z.string().min(1),
  fees: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      amount: z.number(),
      selected: z.boolean(),
      overdue: z.boolean().optional(),
    })
  ),
});

type FormType = z.infer<typeof schema>;
type PaymentMode = "UPI" | "CASH" | "CARD";

const selectedStudent = mockStudents[0];
const PAYMENT_MODES: { value: PaymentMode; label: string; Icon: React.ElementType }[] = [
  { value: "UPI",  label: "UPI",  Icon: Smartphone },
  { value: "CASH", label: "Cash", Icon: Banknote   },
  { value: "CARD", label: "Card", Icon: CreditCard  },
];

/* ─── step label ─────────────────────────────────────────────────────────── */
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

/* ─── component ──────────────────────────────────────────────────────────── */
export function RecordFeePaymentModal({ onClose }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);
 const [studentSelected, setStudentSelected] = useState(true);  // mock: already selected

  const { register, control, watch, setValue, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: "Ravi",
      paymentMode: "UPI",
      transactionId: "UPI123456789",
      receiptNo: "RCP-2025-6848",
      paymentDate: "2025-04-07",
      fees: feeOptions.map((f) => ({ ...f, selected: false }))
    },
  });

  const fees        = watch("fees");
  const paymentMode = watch("paymentMode");
const toggleFee = (id: string) => {
  const updated = fees.map((f) =>
    f.id === id ? { ...f, selected: !f.selected } : f
  );
  setValue("fees", updated);
};

  const totalPayable = useMemo(
    () => fees.filter((f) => f.selected).reduce((s, f) => s + f.amount, 0),
    [fees]
  );

  const onSubmit = (_data: FormType) => setShowSuccess(true);
const hasOverdue = useMemo(
  () => fees.some((f) => f.overdue),
  [fees]
);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* modal */}
      <div className="relative z-10 w-[520px] max-w-[95vw] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* ── header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Record Fee Payment</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── body ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >

          {/* ── 1. Search Student ── */}
          <div>
            <StepLabel n={1} text="Search Student" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                {...register("search")}
                className="w-full pl-9 pr-3 h-9 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Search student name or admission no."
              />
            </div>

            {/* student result card */}
            {studentSelected && (
              <div className="mt-2 border border-[#3525CD]/30 rounded-xl overflow-hidden">
                {/* selected student header */}
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

                {/* student detail row */}
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                    RK
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">
                      {selectedStudent?.name}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      {selectedStudent?.className} | {selectedStudent?.admissionNo}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      Parent: {selectedStudent?.parentName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-red-600">
                      ₹{selectedStudent?.pendingAmount?.toLocaleString("en-IN")} pending
                    </p>
     {hasOverdue && (
  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
    OVERDUE FEES AVAILABLE
  </span>
)}
                   
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── 2. Select Fees to Pay ── */}
          <div>
            <StepLabel n={2} text="Select Fees to Pay" />
            <div className="space-y-2">
              {fees.map((fee) => (
                <label
                  key={fee.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                    fee.selected
                      ? "bg-[#EEF0FF] border-[#3525CD]/40"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={fee.selected}
                    onChange={() => toggleFee(fee.id)}
                    className="w-3.5 h-3.5 accent-[#3525CD] shrink-0"
                  />
                  <span className="flex-1 text-xs text-gray-700">{fee.label}</span>
                  {fee.overdue && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium mr-1">
                      Overdue
                    </span>
                  )}
                  <span className={`text-xs font-semibold ${fee.selected ? "text-[#3525CD]" : "text-gray-600"}`}>
                    ₹{fee.amount.toLocaleString("en-IN")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── 3. Payment Mode ── */}
          <div>
            <StepLabel n={3} text="Payment Mode" />
            <Controller
              control={control}
              name="paymentMode"
              render={({ field }) => (
                <div className="flex gap-2">
                  {PAYMENT_MODES.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border text-xs font-medium transition-colors ${
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

          {/* ── Amount to Pay ── */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 block mb-1.5">
              Amount to Pay
            </label>
            <div className="flex items-center h-11 px-4 rounded-lg border border-gray-200 bg-gray-50">
              <span className="text-xs text-gray-400 mr-2">Rs.</span>
              <span className="text-base font-bold text-gray-900">
                {totalPayable.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* ── Transaction ID + Receipt No (side by side) ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 block mb-1.5">
                Transaction ID
              </label>
              <input
                {...register("transactionId")}
                placeholder="UPI123456789"
                className="w-full h-9 px-3 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
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

          {/* ── Payment Date ── */}
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

          {/* ── Total Payable ── */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-700">Total Payable</span>
            <span className="text-sm font-bold text-gray-900">
              ₹{totalPayable.toLocaleString("en-IN")}
            </span>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3 pb-1">
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

      {/* Success modal */}
      {showSuccess && (
        <PaymentSuccessModal
          receiptNo={watch("receiptNo")}
          amount={totalPayable}
          paymentMode={paymentMode}
          paymentDate={watch("paymentDate")}
          studentName="Ravi Kumar"
          studentClass="Class 10A"
          onRecordAnother={() => { setShowSuccess(false); onClose(); }}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}