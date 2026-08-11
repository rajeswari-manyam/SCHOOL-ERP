import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PaymentSuccessModal } from "../components/PaymentSuccessModal";
import type { PaymentMode } from "../types/fees.types";
import {
  requiresTransactionId,
  derivePaymentStatus,
  calculateLateFee,
  paymentStatusBadge,
} from "../utils/lateFee.utils";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import type { ClassRecord, SectionRecord } from "@/services/class.api";
import { getStudentsByClassSection, createRecordFeePayment, getPendingFeesByStudentId } from "@/services/fee.api";
import type { StudentByClassSectionRecord } from "@/services/fee.api";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const schema = z
  .object({
    classId: z.string().min(1, "Select a class"),
    sectionId: z.string().min(1, "Select a section"),
    studentId: z.string().min(1, "Select a student"),
    paymentMode: z.enum(["UPI", "CASH", "CARD", "CHEQUE", "BANK"]),
    transactionId: z.string().optional(),
    receiptNo: z.string().min(1, "Receipt no. is required"),
    paymentDate: z.string().min(1, "Date is required"),
    paymentAmount: z
      .number({ error: "Enter a valid amount" })
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
    if (requiresTransactionId(data.paymentMode) && !data.transactionId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["transactionId"],
        message: "Transaction ID is required for this payment mode",
      });
    }
    const totalRemaining = data.fees
      .filter((f) => f.selected)
      .reduce((s, f) => s + f.remainingAmount + (f.lateFee ?? 0), 0);
    if (totalRemaining > 0 && data.paymentAmount > totalRemaining) {
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

const selectCls =
  "w-full h-10 px-3 text-sm rounded-lg border border-gray-200 bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-200 " +
  "disabled:bg-gray-50 disabled:text-gray-400";

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

export default function RecordFeePaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTab = (location.state as { returnTab?: string } | null)?.returnTab ?? "Pending Fees";

  const goBack = () => navigate("/accountant/fees", { state: { activeTab: returnTab } });

  const [showSuccess, setShowSuccess]           = useState(false);
  const [successReceiptNo, setSuccessReceiptNo] = useState("");
  const [submitting, setSubmitting]             = useState(false);
  const [loadingFees, setLoadingFees]           = useState(false);

  const [classes,  setClasses]  = useState<ClassRecord[]>([]);
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [students, setStudents] = useState<StudentByClassSectionRecord[]>([]);

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
      classId:       "",
      sectionId:     "",
      studentId:     "",
      paymentMode:   "UPI",
      transactionId: "",
      receiptNo: `RCP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentAmount: 0,
      fees: [],
    },
  });

  const watchClassId   = watch("classId");
  const watchSectionId = watch("sectionId");
  const watchStudentId = watch("studentId");
  const fees           = watch("fees");
  const paymentMode    = watch("paymentMode");
  const paymentAmount  = watch("paymentAmount");

  // Load classes on mount
  useEffect(() => {
    getAllClasses().then((r) => setClasses(r.data ?? [])).catch(() => {});
  }, []);

  // Reset section/student and load sections when class changes
  useEffect(() => {
    if (!watchClassId) { setSections([]); setStudents([]); return; }
    setValue("sectionId", "");
    setValue("studentId", "");
    getSectionsByClassId(watchClassId)
      .then((r) => setSections(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, [watchClassId]);

  // Load students when both class + section are selected
  useEffect(() => {
    if (!watchClassId || !watchSectionId) { setStudents([]); setValue("studentId", ""); return; }
    getStudentsByClassSection(watchClassId, watchSectionId)
      .then((res) => {
        if (res.status && Array.isArray(res.data)) setStudents(res.data);
      })
      .catch(() => {});
  }, [watchClassId, watchSectionId]);

  // Load pending fees when student is selected
  useEffect(() => {
    if (!watchStudentId) { setValue("fees", []); setValue("paymentAmount", 0); return; }
    setLoadingFees(true);
    getPendingFeesByStudentId(watchStudentId)
      .then((res) => {
        if (res.status && res.data?.details) {
          const today = new Date();
          const feeItems = res.data.details
            .filter((d) => d.status !== "PAID")
            .map((d) => {
              const isOverdue = d.dueDate ? new Date(d.dueDate) < today : false;
              return {
                id:              d.id,
                label:           d.feeHeadName ?? "Fee",
                amount:          d.finalAmount,
                paidAmount:      d.paidAmount,
                remainingAmount: d.dueAmount,
                selected:        false,
                overdue:         isOverdue,
                lateFee:         isOverdue
                  ? calculateLateFee(d.finalAmount, d.dueDate ?? "", 0, 50, "flat")
                  : 0,
              };
            });
          setValue("fees", feeItems);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingFees(false));
  }, [watchStudentId, setValue]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === watchStudentId) ?? null,
    [students, watchStudentId]
  );

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

  const paymentStatus     = derivePaymentStatus(totalRemaining, paymentAmount);
  const statusBadge       = paymentStatusBadge(paymentStatus);
  const showTransactionId = requiresTransactionId(paymentMode);

  const onSubmit = async (data: FormType) => {
    setSubmitting(true);
    try {
      await createRecordFeePayment({
        class_id: data.classId,
        section_id: data.sectionId,
        student_id: data.studentId,
        payment_mode: data.paymentMode,
        amount: data.paymentAmount,
        topay: data.paymentAmount,
        receipt_no: data.receiptNo,
        transaction_id: data.transactionId || undefined,
        payment_date: data.paymentDate,
      });
      setSuccessReceiptNo(data.receiptNo);
      setShowSuccess(true);
    } catch {
      toast.error("Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  const studentInitials = selectedStudent
    ? `${selectedStudent.first_name[0] ?? ""}${selectedStudent.last_name[0] ?? ""}`.toUpperCase()
    : "";
  const studentFullName = selectedStudent
    ? `${selectedStudent.first_name} ${selectedStudent.last_name}`
    : "Student";
  const studentClass = selectedStudent
    ? `${selectedStudent.class_name} ${selectedStudent.section_name}`
    : "";

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBack} className="hover:text-gray-600 transition-colors">
          Fee Management
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Record Fee Payment</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              Record Fee Payment
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Log a payment against a student's pending fees
            </p>
          </div>
          <button
            type="button"
            onClick={goBack}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-5 sm:px-6 py-5 space-y-4 sm:space-y-5">

          {/* Step 1 – Select Student */}
          <div>
            <StepLabel n={1} text="Select Student" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <select {...register("classId")} className={selectCls}>
                  <option value="">Select class…</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.class_name}</option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.classId.message}</p>
                )}
              </div>

              <div>
                <select
                  {...register("sectionId")}
                  className={selectCls}
                  disabled={!watchClassId}
                >
                  <option value="">Select section…</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.sectionName}</option>
                  ))}
                </select>
                {errors.sectionId && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.sectionId.message}</p>
                )}
              </div>

              <div>
                <select
                  {...register("studentId")}
                  className={selectCls}
                  disabled={!watchClassId || !watchSectionId}
                >
                  <option value="">Select student…</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} ({s.admission_number})
                    </option>
                  ))}
                </select>
                {errors.studentId && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.studentId.message}</p>
                )}
              </div>
            </div>

            {/* Selected student card */}
            {selectedStudent && (
              <div className="mt-3 border border-[#3525CD]/30 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-[#EEF0FF]">
                  <div className="w-6 h-6 rounded-full bg-[#3525CD]/20 flex items-center justify-center text-[10px] font-bold text-[#3525CD] shrink-0">
                    {studentInitials}
                  </div>
                  <span className="text-xs font-medium text-[#3525CD] truncate">
                    {studentFullName} · {studentClass}
                  </span>
                </div>
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 shrink-0">
                    {studentInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">
                      {studentFullName}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      {studentClass} | {selectedStudent.admission_number}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2 – Select Fees */}
          <div>
            <StepLabel n={2} text="Select Fees to Pay" />
            {!watchStudentId ? (
              <p className="text-[11px] text-gray-400 py-4 text-center">
                Select a student above to see pending fees
              </p>
            ) : loadingFees ? (
              <div className="flex items-center justify-center gap-2 py-4 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Loading pending fees…</span>
              </div>
            ) : fees.length === 0 ? (
              <p className="text-[11px] text-gray-400 py-4 text-center">
                No pending fees for this student
              </p>
            ) : (
            <div className="space-y-2">
              {fees.map((fee) => (
                <label
                  key={fee.id}
                  className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                    fee.selected
                      ? "bg-[#EEF0FF] border-[#3525CD]/40"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={fee.selected}
                      onChange={() => toggleFee(fee.id)}
                      className="w-3.5 h-3.5 accent-[#3525CD] shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-700 block">{fee.label}</span>
                      {fee.paidAmount > 0 && (
                        <div className="mt-1">
                          <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                            <span>Paid: ₹{fee.paidAmount.toLocaleString("en-IN")}</span>
                            <span>Remaining: ₹{fee.remainingAmount.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-green-500"
                              style={{
                                width: `${Math.min(100, (fee.paidAmount / fee.amount) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {fee.overdue && (fee.lateFee ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 mt-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Late fee: ₹{(fee.lateFee ?? 0).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right shrink-0 pl-6 sm:pl-0">
                    {fee.overdue && (
                      <span className="block text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-medium sm:mb-1">
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
            )}
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

          {/* Step 4 – Amount to Pay */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Amount to Pay
              </label>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
              <input
                type="number"
                step="0.01"
                min="1"
                max={totalRemaining || undefined}
                {...register("paymentAmount", { valueAsNumber: true })}
                className="w-full pl-7 pr-3 h-11 text-base font-bold rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            {errors.paymentAmount && (
              <p className="text-[11px] text-red-500 mt-1">{errors.paymentAmount.message}</p>
            )}
            {paymentStatus === "PARTIAL" && (
              <p className="flex items-center gap-1 text-[11px] text-amber-600 mt-1">
                <Info className="w-3 h-3 shrink-0" />
                Partial payment — ₹
                {(totalRemaining - paymentAmount).toLocaleString("en-IN")} will remain outstanding
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
                    errors.transactionId ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.transactionId && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.transactionId.message}</p>
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
            <span className="text-xs font-semibold text-gray-700">Total Payable</span>
            <span className="text-sm font-bold text-gray-900">
              ₹{(paymentAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-1">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={goBack}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Record Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <PaymentSuccessModal
          receiptNo={successReceiptNo}
          amount={totalRemaining}
          paidAmount={watch("paymentAmount") ?? 0}
          remainingAmount={totalRemaining - (watch("paymentAmount") ?? 0)}
          paymentStatus={paymentStatus}
          paymentMode={paymentMode}
          paymentDate={watch("paymentDate")}
          studentName={studentFullName}
          studentClass={studentClass}
          onRecordAnother={() => {
            setShowSuccess(false);
            goBack();
          }}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
