import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertTriangle } from "lucide-react";

import { formatCurrency } from "../../../../utils/formatters";

import { SummaryCard } from "../../../../components/ui/summarycard";
import { CheckboxField } from "../../../../components/ui/checkbox-field.tsx";
import { Button } from "@/components/ui/button";
import type {
  ProcessPayrollModalProps,
  AttendanceDeduction,
  PayrollSummary,
  PayrollFormData,
} from "../types/payroll.types";

/* ---------------- SCHEMA ---------------- */
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

type PayrollSchemaData = z.infer<typeof schema>;

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
  } = useForm<PayrollSchemaData>({
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

  const handleFormSubmit = (data: PayrollSchemaData) => {
    onSubmit(data as PayrollFormData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-[480px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden">

        {/* HEADER */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Process {month} Payroll
            </h2>
            <p className="text-xs text-gray-400">
              Review before processing
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto px-5 py-4 space-y-5 flex-1">

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-2.5">
            <SummaryCard label="Total Staff" value={summary.totalStaff} />
            <SummaryCard label="Total Gross" value={formatCurrency(summary.totalGross)} />
            <SummaryCard label="Total Deductions" value={formatCurrency(summary.totalDeductions)} />
            <SummaryCard label="Total Net Pay" value={formatCurrency(summary.totalNet)} highlight />
          </div>

          {/* PAYMENT MODE */}
          <div>
            <label className="text-[12px] font-medium text-gray-500 mb-2 block">
              Payment Mode
            </label>

            <div className="flex flex-wrap gap-2">
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setValue("paymentMode", mode, { shouldValidate: true })}
                  className={`px-3.5 py-1.5 text-xs rounded-full font-medium ${
                    paymentMode === mode
                      ? "bg-[#3525CD] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* PAYMENT DATE */}
          <div>
            <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">
              Payment Date
            </label>
            <input
              type="date"
              {...register("paymentDate")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
            {errors.paymentDate && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.paymentDate.message}
              </p>
            )}
          </div>

          {/* APPROVAL NOTE */}
          <div>
            <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">
              Approval Note
            </label>
            <textarea
              {...register("approvalNote")}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          {/* ATTENDANCE WARNING */}
          {attendanceDeductions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <div className="flex gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <p className="text-[12px] font-semibold text-amber-800">
                  {attendanceDeductions.length} staff have deductions
                </p>
              </div>
              <ul className="pl-6 space-y-1">
                {attendanceDeductions.map((d, i) => (
                  <li key={i} className="text-[12px] text-amber-700">
                    {d.staffName}: {d.daysAbsent} day(s) — {formatCurrency(d.amountDeducted)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CHECKBOXES */}
          <div className="space-y-3">
            <CheckboxField
              label={`I confirm attendance for ${month}`}
              error={errors.confirmAttendance?.message}
              {...register("confirmAttendance")}
            />
            <CheckboxField
              label="I confirm salary configuration"
              error={errors.confirmSalary?.message}
              {...register("confirmSalary")}
            />
          </div>
        </div>

        {/* FOOTER - Border removed from buttons */}
        <div className="flex flex-col sm:flex-row gap-2 px-4 py-3 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 rounded-xl py-2.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          <Button
            type="button"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={!isValid}
            className={`w-full sm:flex-[2] rounded-xl py-2.5 text-sm font-semibold text-white ${
              isValid ? "bg-[#3525CD] hover:bg-[#2a1fb5]" : "bg-[#C7C2F0]"
            }`}
          >
            Process — {formatCurrency(summary.totalNet)}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- DEMO ---------------- */
export default function Demo() {
  const [open, setOpen] = useState(true);

  const summary: PayrollSummary = {
    totalStaff: 28,
    totalGross: 384000,
    totalDeductions: 36720,
    totalNet: 347280,
    processingDueDate: "30 April 2025",
  };

  const deductions: AttendanceDeduction[] = [
    { staffName: "Meena Devi", daysAbsent: 1, amountDeducted: 1307 },
    { staffName: "Deepa S", daysAbsent: 2, amountDeducted: 2462 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#3525CD] text-white px-5 py-2 rounded-xl"
        >
          Open Modal
        </button>
      ) : (
        <ProcessPayrollModal
          month="April 2025"
          summary={summary}
          attendanceDeductions={deductions}
          onClose={() => setOpen(false)}
          onSubmit={(data) => {
            console.log(data);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}