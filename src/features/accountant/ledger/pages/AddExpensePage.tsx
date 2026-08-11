import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, CloudUpload, Paperclip, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLedger } from "../hooks/useledger";
import type { LedgerEntry, ExpenseFormInput } from "../types/Ledger.types";
import { EXPENSE_CATEGORIES } from "../constants/finance.constants";
import { PAYMENT_OPTIONS } from "../../../../utils/payment";
import { getTodayISO } from "@/utils/date";
import typography, { combineTypography } from "@/styles/typography";

const schema = z.object({
  category:    z.string().min(2, "Category required"),
  description: z.string().min(2, "Description required"),
  amount:      z.coerce.number().min(1, "Amount must be greater than 0"),
  reference:   z.string().optional(),
  date:        z.string().min(1, "Date required"),
  paidVia:     z.string().min(2, "Payment method required"),
  notes:       z.string().optional(),
});

const inputCls = combineTypography(
  typography.form.input,
  "h-10 sm:h-9 border border-[#D6E0FF] rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-[#EFF4FF] placeholder:text-gray-400 text-gray-700 text-sm"
);
const selectCls =
  "w-full h-10 sm:h-9 px-3 text-sm border border-[#D6E0FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-[#EFF4FF] text-gray-700";
const labelCls = combineTypography(
  typography.form.label,
  "text-gray-800 font-semibold text-xs sm:text-sm"
);

export default function AddExpensePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const state = location.state as { editData?: LedgerEntry; month?: number; year?: number } | null;
  const editData = state?.editData ?? null;
  const isEdit = !!id;
  const now = new Date();
  const month = state?.month ?? now.getMonth() + 1;
  const year  = state?.year  ?? now.getFullYear();

  const { createEntry, updateEntry } = useLedger(month, year);

  const goBack = () =>
    navigate("/accountant/ledger", { state: { activeTab: "expenses", month, year } });

  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialData: ExpenseFormInput | undefined = editData
    ? {
        id:          editData.id,
        category:    editData.category,
        description: editData.description,
        amount:      String(editData.amount),
        reference:   editData.reference,
        date:        editData.date,
        paidVia:     editData.paidVia ?? "Bank Transfer",
        notes:       editData.notes,
      }
    : undefined;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormInput>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialData ?? { date: getTodayISO(), paidVia: "Bank Transfer" },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPayment = watch("paidVia");

  const onSubmit = async (data: ExpenseFormInput) => {
    setSubmitting(true);
    try {
      if (isEdit && editData) {
        await updateEntry(editData.id, data, selectedFile ?? undefined);
      } else {
        await createEntry(data, selectedFile ?? undefined);
      }
      goBack();
    } catch {
      // toast shown in hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBack} className="hover:text-gray-600 transition-colors">
          Ledger
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">
          {isEdit ? "Edit Expense Entry" : "Add Expense Entry"}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              {isEdit ? "Edit Expense Entry" : "Add Expense Entry"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Record a school expense against this month's ledger
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
        <form onSubmit={handleSubmit(onSubmit)} className="px-5 sm:px-6 py-5 space-y-4">

          {/* Category */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Category</Label>
            <select {...register("category")} className={selectCls}>
              <option value="">Select category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Description</Label>
            <Input placeholder="e.g. Electricity bill — April 2025" {...register("description")} className={inputCls} />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={labelCls}>Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                <Input type="number" {...register("amount")} className={`${inputCls} pl-8`} />
              </div>
              {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className={labelCls}>Date</Label>
              <Input type="date" {...register("date")} className={inputCls} />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Reference Number</Label>
            <Input {...register("reference")} className={inputCls} placeholder="e.g. INV-1001 (optional)" />
          </div>

          {/* Attachment */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Bill / Receipt</Label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            {selectedFile ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                <Paperclip className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-xs text-indigo-700 truncate flex-1">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="text-gray-400 hover:text-red-500 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                className="border border-dashed border-[#B6CAFF] bg-[#E6EDFF] rounded-lg py-4 px-4 flex flex-col items-center gap-2 hover:border-indigo-400 transition-colors cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                <CloudUpload className="w-5 h-5 text-indigo-400" />
                <p className="text-xs text-gray-500">Attach bill or receipt (optional)</p>
                <p className="text-[10px] text-gray-400">PDF, JPG, PNG | Max 5MB</p>
                <Button type="button" variant="outline" size="sm"
                  className="text-indigo-600 border-indigo-300 h-7 text-xs mt-1 bg-white hover:bg-indigo-50">
                  Browse File
                </Button>
              </div>
            )}
          </div>

          {/* Paid Via */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Paid Via</Label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_OPTIONS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setValue("paidVia", method.label)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                    selectedPayment === method.label
                      ? "bg-[#3525CD] text-white shadow-sm"
                      : "bg-white text-gray-600 border border-[#D6E0FF] hover:bg-indigo-50"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
            <input type="hidden" {...register("paidVia")} />
            {errors.paidVia && <p className="text-xs text-red-500">{errors.paidVia.message}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Notes</Label>
            <Input {...register("notes")} className={inputCls} placeholder="Any additional notes" />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={goBack} disabled={submitting} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2a1fb5] text-white gap-2"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
