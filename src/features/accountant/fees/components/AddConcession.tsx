import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Search, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import typography from "@/styles/typography";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  student: z
    .object({
      id: z.string(),
      name: z.string(),
      class: z.string(),
      admissionId: z.string(),
      initials: z.string(),
    })
    .nullable(),
  concessionType: z.string().min(1, "Required"),
  amountType: z.enum(["fixed", "percentage"]),
  amount: z.string().min(1, "Required"),
  applicableFees: z.array(z.string()).min(1, "Select at least one fee"),
  reason: z.string().min(1, "Reason is required"),
  effectiveFrom: z.string().min(1, "Required"),
  effectiveUntil: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const CONCESSION_TYPES = [
  "Sibling Discount",
  "Merit Scholarship",
  "Financial Aid",
  "Staff Ward",
  "Sports Quota",
  "Other",
];

const FEE_TYPES = [
  { id: "tuition", label: "Tuition fee" },
  { id: "examination", label: "Examination" },
  { id: "transport", label: "Transport" },
  { id: "activity", label: "Activity" },
  { id: "library", label: "Library" },
  { id: "all", label: "All fees" },
];

const DEFAULT_STUDENT = {
  id: "1",
  name: "Ravi Kumar",
  class: "Class 10A",
  admissionId: "2024098",
  initials: "RK",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AddFeeConcessionModal({ onClose }: { onClose: () => void }) {
  const [selectedStudent, setSelectedStudent] = useState<FormValues["student"]>(
    DEFAULT_STUDENT
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      student: DEFAULT_STUDENT,
      concessionType: "Sibling Discount",
      amountType: "fixed",
      amount: "1000",
      applicableFees: ["tuition"],
      reason: "",
      effectiveFrom: "01 Apr 2025",
      effectiveUntil: "31 Mar 2026",
    },
  });

  const values = watch();

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const toggleFee = (feeId: string) => {
    const current = values.applicableFees || [];
    if (feeId === "all") {
      setValue(
        "applicableFees",
        current.includes("all") ? ["tuition"] : FEE_TYPES.map((f) => f.id)
      );
      return;
    }
    setValue(
      "applicableFees",
      current.includes(feeId)
        ? current.filter((id) => id !== feeId)
        : [...current, feeId]
    );
  };

  const onSubmit = (data: FormValues) => {
    console.log("Submitted:", data);
    onClose();
  };

  const clearStudent = () => {
    setSelectedStudent(null);
    setValue("student", null);
  };

  // ─── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto"
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className={typography.heading.h6}>Add fee concession</h2>
            <p className={`${typography.body.xs} text-gray-500 mt-0.5`}>
              Concession requires principal approval
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* ── Student ── */}
          <div>
            <label className={`${typography.form.label} text-gray-700`}>
              Student <span className="text-red-500">*</span>
            </label>

            {!selectedStudent ? (
              <div className="relative mt-1.5">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="text"
                  placeholder="Search by name or admission ID..."
                  className="pl-8"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2.5 mt-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                    {selectedStudent.initials}
                  </div>
                  <div>
                    <p className={`${typography.body.small} font-semibold text-gray-900`}>
                      {selectedStudent.name}
                    </p>
                    <p className={`${typography.body.xs} text-gray-500`}>
                      {selectedStudent.class}&nbsp;·&nbsp;ID:{" "}
                      {selectedStudent.admissionId}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearStudent}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}

            {errors.student && (
              <p className={typography.form.error}>{errors.student.message}</p>
            )}
          </div>

          {/* ── Concession Type ── */}
          <div>
            <label className={`${typography.form.label} text-gray-700`}>
              Concession type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("concessionType")}
              className="w-full mt-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {CONCESSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.concessionType && (
              <p className={typography.form.error}>
                {errors.concessionType.message}
              </p>
            )}
          </div>

          {/* ── Amount Type + Amount ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`${typography.form.label} text-gray-700`}>
                Amount type <span className="text-red-500">*</span>
              </label>
              <div className="flex mt-1.5 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setValue("amountType", "fixed")}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    values.amountType === "fixed"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Fixed amount
                </button>
                <button
                  type="button"
                  onClick={() => setValue("amountType", "percentage")}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    values.amountType === "percentage"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Percentage
                </button>
              </div>
            </div>

            <div>
              <label className={`${typography.form.label} text-gray-700`}>
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 select-none pointer-events-none z-10">
                  {values.amountType === "fixed" ? "Rs." : "%"}
                </span>
                <Input {...register("amount")} className="pl-8" />
              </div>
              {errors.amount && (
                <p className={typography.form.error}>{errors.amount.message}</p>
              )}
            </div>
          </div>

          {/* ── Applicable Fees ── */}
          <div>
            <label className={`${typography.form.label} text-gray-700`}>
              Applicable on <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mt-2">
              {FEE_TYPES.map((fee) => (
                <label
                  key={fee.id}
                  className={`flex items-center gap-2 ${typography.body.small} text-gray-700 cursor-pointer`}
                >
                  {/* Use native <input type="checkbox"> — not the Input component */}
                  <input
                    type="checkbox"
                    checked={values.applicableFees?.includes(fee.id) || false}
                    onChange={() => toggleFee(fee.id)}
                    className="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer"
                  />
                  {fee.label}
                </label>
              ))}
            </div>
            {errors.applicableFees && (
              <p className={typography.form.error}>
                {errors.applicableFees.message}
              </p>
            )}
          </div>

          {/* ── Reason ── */}
          <div>
            <label className={`${typography.form.label} text-gray-700`}>
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("reason")}
              rows={3}
              placeholder="Reason for granting concession"
              className={`w-full mt-1.5 px-3 py-2 ${typography.form.input} border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400`}
            />
            {errors.reason && (
              <p className={typography.form.error}>{errors.reason.message}</p>
            )}
          </div>

          {/* ── Dates ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`${typography.form.label} text-gray-700`}>
                Effective from <span className="text-red-500">*</span>
              </label>
              <Input {...register("effectiveFrom")} className="mt-1.5" />
              {errors.effectiveFrom && (
                <p className={typography.form.error}>
                  {errors.effectiveFrom.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${typography.form.label} text-gray-700`}>
                Effective until
              </label>
              <Input {...register("effectiveUntil")} className="mt-1.5" />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add concession</Button>
        </div>
      </form>
    </div>
  );
}