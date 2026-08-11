import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import typography from "@/styles/typography";
import { toast } from "sonner";
import { CONCESSION_TYPES, CONCESSION_TYPE_TO_ENUM, CONCESSION_ENUM_TO_TYPE } from "../constants/fee.constants";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import type { ClassRecord, SectionRecord } from "@/services/class.api";
import { getStudentsByClassSection, getFeeStructures, addConcession, updateConcession } from "@/services/fee.api";

interface ConcessionRecord {
  id: string;
  studentId?: string;
  feeStructureId?: string;
  concessionType?: string;
  discountType?: string;
  discountValue?: number;
  reason?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  studentName?: string;
}

interface FeeHeadMappingDTO {
  id: string;
  feeHeadName: string;
  className: string;
  classId: string;
  sectionName: string | null;
  sectionId: string | null;
  amount: number;
  billingCycle?: string;
}

// ── Add schema ────────────────────────────────────────────────────────────────
const addSchema = z.object({
  studentId:      z.string().min(1, "Select a student"),
  feeStructureId: z.string().min(1, "Select a fee structure"),
  concessionType: z.string().min(1, "Required"),
  discountType:   z.enum(["percentage", "fixed"]),
  discountValue:  z.string().min(1, "Required"),
  reason:         z.string().min(1, "Reason is required"),
  effectiveFrom:  z.string().min(1, "Required"),
  effectiveUntil: z.string().optional(),
});

// ── Edit schema ───────────────────────────────────────────────────────────────
const editSchema = z.object({
  studentId:      z.string().optional(),
  feeStructureId: z.string().optional(),
  concessionType: z.string().min(1, "Required"),
  discountType:   z.enum(["percentage", "fixed"]),
  discountValue:  z.string().min(1, "Required"),
  reason:         z.string().min(1, "Reason is required"),
  effectiveFrom:  z.string().min(1, "Required"),
  effectiveUntil: z.string().optional(),
});

type AddFormValues = z.infer<typeof addSchema>;
type FormValues    = AddFormValues;

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
  editData?: ConcessionRecord;
  /** "Quick apply" mode — pre-fills and locks the student + fee structure
   *  (e.g. when opened from a specific row in a fee table) instead of
   *  showing the class/section/student pickers. */
  presetStudentId?: string;
  presetStudentName?: string;
  presetFeeStructureId?: string;
  presetFeeStructureLabel?: string;
  presetFeeAmount?: number;
}

export function AddFeeConcessionModal({
  onClose, onSuccess, editData,
  presetStudentId, presetStudentName, presetFeeStructureId, presetFeeStructureLabel, presetFeeAmount,
}: Props) {
  const isEdit = !!editData;
  const isQuickApply = !isEdit && !!presetStudentId && !!presetFeeStructureId;

  // ── Student cascade filters (not form fields) ──────────────────────────────
  const [classFilter, setClassFilter]     = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [classes,  setClasses]            = useState<ClassRecord[]>([]);
  const [sections, setSections]           = useState<SectionRecord[]>([]);
  const [students, setStudents]           = useState<{ id: string; label: string }[]>([]);

  // ── Fee structures for selected class ────────────────────────────────────
  const [feeStructures, setFeeStructures] = useState<FeeHeadMappingDTO[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<FeeHeadMappingDTO | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(isEdit ? editSchema : addSchema) as any,
    defaultValues: {
      studentId:      presetStudentId ?? "",
      feeStructureId: presetFeeStructureId ?? "",
      concessionType: editData?.concessionType
        ? (CONCESSION_ENUM_TO_TYPE[editData.concessionType] ?? editData.concessionType)
        : CONCESSION_TYPES[0],
      discountType:   (editData?.discountType === "PERCENTAGE" ? "percentage" : "fixed") as "percentage" | "fixed",
      discountValue:  editData?.discountValue != null ? String(editData.discountValue) : "",
      reason:         editData?.reason ?? "",
      effectiveFrom:  editData?.effectiveFrom  ?? "",
      effectiveUntil: editData?.effectiveUntil ?? "",
    },
  });

  const watchStudentId      = watch("studentId");
  const watchFeeStructureId = watch("feeStructureId");
  const watchDiscountType   = watch("discountType");
  const watchDiscountValue  = watch("discountValue");

  // Load classes on mount (add mode, but not quick-apply — student/fee are already known)
  useEffect(() => {
    if (!isEdit && !isQuickApply) {
      getAllClasses().then((r) => setClasses(r.data ?? [])).catch(() => {});
    }
  }, [isEdit, isQuickApply]);

  // Load sections when class filter changes
  useEffect(() => {
    if (!classFilter) {
      setSections([]);
      setStudents([]);
      setFeeStructures([]);
      setSelectedStructure(null);
      return;
    }
    getSectionsByClassId(classFilter)
      .then((r) => setSections(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, [classFilter]);

  // Load students when class + section filter changes
  useEffect(() => {
    if (!classFilter || !sectionFilter) { setStudents([]); return; }
    getStudentsByClassSection(classFilter, sectionFilter)
      .then((res) => {
        if (res.status && Array.isArray(res.data)) {
          setStudents(res.data.map((s) => ({ id: s.id, label: `${s.first_name} ${s.last_name} (${s.admission_number})` })));
        }
      })
      .catch(() => {});
  }, [classFilter, sectionFilter]);

  // Load fee structures when class filter changes
  useEffect(() => {
    if (!classFilter) { setFeeStructures([]); return; }
    getFeeStructures({ class_id: classFilter, section_id: "", fromDate: "2020-01-01", toDate: "2030-12-31" })
      .then((res) => {
        if (res.status && Array.isArray(res.data)) {
          setFeeStructures(res.data.map((m) => ({
            id: m.id,
            feeHeadName: m.feeHeadName,
            className: m.className,
            classId: m.classId,
            sectionName: m.sectionName,
            sectionId: m.sectionId,
            amount: m.amount,
            billingCycle: m.billingCycle,
          })));
        }
      })
      .catch(() => {});
  }, [classFilter]);

  // Track selected structure
  useEffect(() => {
    if (!watchFeeStructureId) { setSelectedStructure(null); return; }
    const found = feeStructures.find((f) => f.id === watchFeeStructureId) ?? null;
    setSelectedStructure(found);
  }, [watchFeeStructureId, feeStructures]);

  // In quick-apply mode there's no fee-structure list to look the amount up
  // in — it's passed straight from the row that opened this modal.
  const effectiveAmount = isQuickApply ? presetFeeAmount : selectedStructure?.amount;

  // Calculate preview amount
  const previewAmount = (() => {
    if (effectiveAmount == null || !watchDiscountValue) return null;
    const val = Number(watchDiscountValue);
    if (isNaN(val) || val <= 0) return null;
    if (watchDiscountType === "percentage") {
      return Math.round((val / 100) * effectiveAmount);
    }
    return Math.min(val, effectiveAmount);
  })();

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        studentId: data.studentId,
        feeStructureId: data.feeStructureId,
        concessionType: CONCESSION_TYPE_TO_ENUM[data.concessionType] ?? data.concessionType.toUpperCase().replace(/\s+/g, "_"),
        discountType: (data.discountType === "percentage" ? "PERCENTAGE" : "FIXED") as "PERCENTAGE" | "FIXED",
        discountValue: Number(data.discountValue),
        reason: data.reason,
        effectiveFrom: data.effectiveFrom,
        effectiveUntil: data.effectiveUntil || undefined,
      };
      if (isEdit && editData) {
        await updateConcession(editData.id, payload);
      } else {
        await addConcession(payload);
      }
      toast.success(isEdit ? "Concession updated successfully" : "Concession added successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save concession");
    } finally {
      setSubmitting(false);
    }
  };

  const selectCls =
    "w-full mt-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD] disabled:bg-gray-50 disabled:text-gray-400";
  const inputCls =
    "w-full mt-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD]";
  const errorCls = "text-red-500 text-[11px] mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm px-2 sm:px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-t-xl md:rounded-xl shadow-2xl w-full max-w-[520px] h-[95vh] md:h-auto md:max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className={typography.heading.h6}>
            {isEdit ? "Edit Concession" : isQuickApply ? "Apply Concession" : "Add Fee Concession"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">

          {/* ── Student Section ────────────────────────────────────────────── */}
          {isEdit || isQuickApply ? (
            <div>
              <label className={`${typography.form.label} text-gray-700`}>Student</label>
              <div className="mt-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800">
                {isEdit ? editData!.studentName : presetStudentName}
              </div>
              {isQuickApply && (
                <>
                  <input type="hidden" {...register("studentId")} />
                  <input type="hidden" {...register("feeStructureId")} />
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-[#EFF4FF] bg-[#F8FAFF] p-4">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Find Student
              </p>

              {/* Class filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`${typography.form.label} text-gray-600`}>Class</label>
                  <select
                    value={classFilter}
                    onChange={(e) => { setClassFilter(e.target.value); setSectionFilter(""); setValue("studentId", ""); setValue("feeStructureId", ""); }}
                    className={selectCls}
                  >
                    <option value="">All Classes</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`${typography.form.label} text-gray-600`}>Section</label>
                  <select
                    value={sectionFilter}
                    onChange={(e) => { setSectionFilter(e.target.value); setValue("studentId", ""); setValue("feeStructureId", ""); }}
                    disabled={!classFilter}
                    className={selectCls}
                  >
                    <option value="">All Sections</option>
                    {sections.map((s) => <option key={s.id} value={s.id}>{s.sectionName}</option>)}
                  </select>
                </div>
              </div>

              {/* Student required field */}
              <div>
                <label className={`${typography.form.label} text-gray-700`}>
                  Student <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("studentId")}
                  className={selectCls}
                  disabled={!classFilter}
                >
                  <option value="">Select student…</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                {errors.studentId && <p className={errorCls}>{errors.studentId.message}</p>}
              </div>
            </div>
          )}

          {/* ── Fee Structure (locked in quick-apply mode) ──────────────────── */}
          {isQuickApply && (
            <div>
              <label className={`${typography.form.label} text-gray-700`}>Fee Structure</label>
              <div className="mt-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800">
                {presetFeeStructureLabel}
                {presetFeeAmount != null && (
                  <span className="text-gray-500"> — ₹{presetFeeAmount.toLocaleString("en-IN")}</span>
                )}
              </div>
            </div>
          )}

          {/* ── Fee Structure (filtered by student) ──────────────────────── */}
          {!isEdit && !isQuickApply && (
            <div>
              <label className={`${typography.form.label} text-gray-700`}>
                Fee Structure <span className="text-red-500">*</span>
              </label>
              <select
                {...register("feeStructureId")}
                disabled={!watchStudentId || feeStructures.length === 0}
                className={selectCls}
              >
                <option value="">
                  {!watchStudentId
                    ? "Select a student first…"
                    : feeStructures.length === 0
                    ? "No fee structures assigned"
                    : "Select fee structure…"}
                </option>
                {feeStructures.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.feeHeadName} — ₹{f.amount?.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
              {errors.feeStructureId && <p className={errorCls}>{errors.feeStructureId.message}</p>}
              {selectedStructure && (
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 bg-[#EFF4FF] rounded-lg px-3 py-2">
                  <span>Original: <strong className="text-gray-800">₹{selectedStructure.amount?.toLocaleString("en-IN")}</strong></span>
                  <span className="w-px h-4 bg-gray-300" />
                  <span>{selectedStructure.billingCycle}</span>
                </div>
              )}
            </div>
          )}

          {/* ── Concession Type ───────────────────────────────────────────── */}
          <div>
            <label className={`${typography.form.label} text-gray-700`}>
              Concession Type <span className="text-red-500">*</span>
            </label>
            <select {...register("concessionType")} className={selectCls}>
              {CONCESSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.concessionType && <p className={errorCls}>{errors.concessionType.message}</p>}
          </div>

          {/* ── Discount Type ─────────────────────────────────────────────── */}
          <div>
            <label className={`${typography.form.label} text-gray-700`}>
              Discount Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 mt-2">
              {(["percentage", "fixed"] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...register("discountType")}
                    value={type}
                    className="accent-[#3525CD]"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {type === "percentage" ? "Percentage (%)" : "Fixed Amount (₹)"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Discount Value ────────────────────────────────────────────── */}
          <div>
            <label className={`${typography.form.label} text-gray-700`}>
              Discount Value <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {watchDiscountType === "percentage" ? "%" : "₹"}
              </span>
              <input
                {...register("discountValue")}
                type="number"
                min="0"
                max={watchDiscountType === "percentage" ? "100" : undefined}
                placeholder={watchDiscountType === "percentage" ? "e.g. 20" : "e.g. 1000"}
                className={`${inputCls} pl-8`}
              />
            </div>
            {errors.discountValue && <p className={errorCls}>{errors.discountValue.message}</p>}

            {/* Balance summary card */}
            {effectiveAmount != null && (
              <div className="mt-3 rounded-xl border border-indigo-100 bg-[#F8FAFF] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-indigo-100">
                  <span className="text-xs text-gray-500">Original Amount</span>
                  <span className="text-sm font-semibold text-gray-800">
                    ₹{effectiveAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-indigo-100">
                  <span className="text-xs text-gray-500">
                    Discount{" "}
                    {previewAmount != null && watchDiscountType === "percentage"
                      ? `(${watchDiscountValue}%)`
                      : previewAmount != null
                      ? "(Fixed)"
                      : ""}
                  </span>
                  <span className={`text-sm font-semibold ${previewAmount != null ? "text-red-500" : "text-gray-300"}`}>
                    {previewAmount != null
                      ? `- ₹${previewAmount.toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-[#EEF2FF]">
                  <span className="text-sm font-bold text-[#3525CD]">Remaining Balance</span>
                  <span className="text-base font-extrabold text-[#3525CD]">
                    {previewAmount != null
                      ? `₹${(effectiveAmount - previewAmount).toLocaleString("en-IN")}`
                      : `₹${effectiveAmount.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Reason ───────────────────────────────────────────────────── */}
          <div>
            <label className={`${typography.form.label} text-gray-700`}>
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("reason")}
              rows={3}
              placeholder="Reason for granting concession"
              className={`w-full mt-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD] placeholder:text-gray-400`}
            />
            {errors.reason && <p className={errorCls}>{errors.reason.message}</p>}
          </div>

          {/* ── Dates ────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`${typography.form.label} text-gray-700`}>
                Effective From <span className="text-red-500">*</span>
              </label>
              <input {...register("effectiveFrom")} type="date" className={inputCls} />
              {errors.effectiveFrom && <p className={errorCls}>{errors.effectiveFrom.message}</p>}
            </div>
            <div>
              <label className={`${typography.form.label} text-gray-700`}>Effective Until</label>
              <input {...register("effectiveUntil")} type="date" className={inputCls} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-2 px-5 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2d1fb5] text-white disabled:opacity-60"
          >
            {submitting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : isEdit ? "Update Concession" : "Add Concession"}
          </Button>
        </div>
      </form>
    </div>
  );
}
