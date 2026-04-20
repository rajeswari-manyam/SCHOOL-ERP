import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertTriangle } from "lucide-react";

/* =========================
   TYPES
========================= */
export interface AttendanceDeduction {
  staffName: string;
  daysAbsent: number;
  amountDeducted: number;
}

export interface PayrollSummary {
  totalStaff: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
}

/* =========================
   ZOD SCHEMA
========================= */
const schema = z.object({
  paymentMode: z.enum(["Bank Transfer", "Cash", "UPI", "Cheque"]),
  paymentDate: z.string().min(1, "Payment date is required"),
  approvalNote: z.string().optional(),
  confirmAttendance: z.boolean().refine((val) => val === true, {
    message: "Please confirm attendance",
  }),
  confirmSalary: z.boolean().refine((val) => val === true, {
    message: "Please confirm salary",
  }),
});

type FormData = z.infer<typeof schema>;

/* =========================
   HELPERS
========================= */
const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

/* =========================
   PROPS
========================= */
interface ProcessPayrollModalProps {
  month?: string;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  summary: PayrollSummary;
  attendanceDeductions?: AttendanceDeduction[];
}

/* =========================
   COMPONENT
========================= */
export const ProcessPayrollModal = ({
  month = "April 2025",
  onClose,
  onSubmit,
  summary,
  attendanceDeductions = [],
}: ProcessPayrollModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      paymentMode: "Bank Transfer",
      paymentDate: new Date().toISOString().split("T")[0],
      approvalNote: "",
      confirmAttendance: false,
      confirmSalary: false,
    },
  });

  const paymentMode = watch("paymentMode");
  const PAYMENT_MODES = ["Bank Transfer", "Cash", "UPI", "Cheque"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
              Process {month} Payroll
            </h2>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Review and confirm before processing
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── SCROLL BODY ── */}
        <div className="overflow-y-auto px-5 py-4 space-y-5 flex-1">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <SummaryCard label="Total Staff" value={String(summary.totalStaff)} />
            <SummaryCard label="Total Gross" value={formatCurrency(summary.totalGross)} />
            <SummaryCard label="Total Deductions" value={formatCurrency(summary.totalDeductions)} />
            <SummaryCard
              label="Total Net Pay"
              value={formatCurrency(summary.totalNet)}
              highlight
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-2">
              Payment Mode
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setValue("paymentMode", mode, { shouldValidate: true })}
                  className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all ${
                    paymentMode === mode
                      ? "bg-[#3525CD] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
              Payment Date
            </label>
            <input
              type="date"
              {...register("paymentDate")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3525CD]/30 focus:border-[#3525CD]"
            />
            {errors.paymentDate && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.paymentDate.message}
              </p>
            )}
          </div>

          {/* Approval Note */}
          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
              Approval Note
            </label>
            <textarea
              {...register("approvalNote")}
              rows={3}
              placeholder="Add a note regarding this payroll run..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#3525CD]/30 focus:border-[#3525CD]"
            />
          </div>

          {/* Attendance Warning */}
          {attendanceDeductions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[12px] font-semibold text-amber-800">
                  {attendanceDeductions.length} staff have attendance deductions this month
                </p>
              </div>
              <ul className="pl-6 space-y-1">
                {attendanceDeductions.map((d, i) => (
                  <li key={i} className="text-[12px] text-amber-700">
                    {d.staffName}: {d.daysAbsent} day{d.daysAbsent > 1 ? "s" : ""} absent —{" "}
                    {formatCurrency(d.amountDeducted)} deducted
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Checkboxes */}
          <div className="space-y-3">
            <CheckboxField
              label={`I confirm all attendance data is verified for ${month}`}
              error={errors.confirmAttendance?.message}
              {...register("confirmAttendance")}
            />
            <CheckboxField
              label="I confirm all salary configurations are correct"
              error={errors.confirmSalary?.message}
              {...register("confirmSalary")}
            />
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="flex gap-2.5 px-5 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
            className={`flex-[2] px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              isValid
                ? "bg-[#3525CD] text-white hover:bg-[#2a1eb5] active:scale-[0.98]"
                : "bg-[#C7C2F0] text-white cursor-not-allowed"
            }`}
          >
            Process Payroll — {formatCurrency(summary.totalNet)}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   SUB-COMPONENTS
========================= */
const SummaryCard = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-xl px-3.5 py-3 ${
      highlight ? "bg-indigo-50" : "bg-gray-50"
    }`}
  >
    <p
      className={`text-[11px] uppercase tracking-wide font-medium mb-1 ${
        highlight ? "text-indigo-400" : "text-gray-400"
      }`}
    >
      {label}
    </p>
    <p
      className={`text-xl font-semibold leading-none ${
        highlight ? "text-[#3525CD]" : "text-gray-900"
      }`}
    >
      {value}
    </p>
  </div>
);

const CheckboxField = ({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) => (
  <div>
    <label className="flex items-start gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        className="mt-0.5 w-4 h-4 rounded accent-[#3525CD] cursor-pointer"
        {...props}
      />
      <span className="text-[13px] text-gray-700 leading-snug">{label}</span>
    </label>
    {error && (
      <p className="text-[11px] text-red-500 mt-1 pl-6">{error}</p>
    )}
  </div>
);

/* =========================
   DEMO (remove in production)
========================= */
export default function Demo() {
  const [open, setOpen] = useState(true);

  const summary: PayrollSummary = {
    totalStaff: 28,
    totalGross: 384000,
    totalDeductions: 36720,
    totalNet: 347280,
  };

  const deductions: AttendanceDeduction[] = [
    { staffName: "Meena Devi", daysAbsent: 1, amountDeducted: 1307 },
    { staffName: "Deepa S", daysAbsent: 2, amountDeducted: 2462 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2.5 bg-[#3525CD] text-white rounded-xl text-sm font-medium"
        >
          Open Modal
        </button>
      )}
      {open && (
        <ProcessPayrollModal
          month="April 2025"
          summary={summary}
          attendanceDeductions={deductions}
          onClose={() => setOpen(false)}
          onSubmit={(data) => {
            console.log("Payroll submitted:", data);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}