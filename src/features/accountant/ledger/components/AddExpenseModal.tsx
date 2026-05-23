import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CloudUpload } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { AddExpenseModalProps, ExpenseFormInput } from "../types/Ledger.types";
import { EXPENSE_CATEGORIES } from "../constants/finance.constants";
import { PAYMENT_OPTIONS } from "../../../../utils/payment";
import { getTodayISO } from "@/utils/date";
import typography, { combineTypography } from "@/styles/typography";

const schema = z.object({
  category: z.string().min(2, "Category required"),
  description: z.string().min(2, "Description required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  reference: z.string().optional(),
  date: z.string().min(1, "Date required"),
  paidVia: z.string().min(2, "Payment method required"),
  notes: z.string().optional(),
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

export const AddExpenseModal = ({ onClose, onAdd, initialData }: AddExpenseModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormInput>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialData || {
      date: getTodayISO(),
      paidVia: "Bank Transfer",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const selectedPayment = watch("paidVia");

  const onSubmit = (data: ExpenseFormInput) => {
    onAdd({
      id: initialData?.id || nanoid(),
      ...data,
      amount: Number(data.amount),
      type: "Expense",
      recordedBy: "Ramu Teja",
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center transition-opacity"
      onClick={onClose}
    >
      <Card 
        className="
          w-full sm:w-[480px] sm:max-w-lg
          shadow-2xl flex flex-col overflow-hidden
          h-[95dvh] sm:h-auto sm:max-h-[90vh]
          rounded-t-2xl sm:rounded-xl
          animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0
          duration-300
        "
        onClick={(e) => e.stopPropagation()}
      > 
        {/* ── Mobile Drag Handle ── */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* ── Header ── */}
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 sm:px-6 shrink-0 border-b border-gray-100">
          <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
            {initialData ? "Edit Expense Entry" : "Add Expense Entry"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* ── Body ── */}
        <CardContent className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto flex-1">

          {/* Category */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Category</Label>
            <select {...register("category")} className={selectCls}>
              <option value="">Select category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Description</Label>
            <Input
              placeholder="e.g. Electricity bill — April 2025"
              {...register("description")}
              className={inputCls}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={labelCls}>Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  ₹
                </span>
                <Input
                  type="number"
                  {...register("amount")}
                  className={`${inputCls} pl-8`}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className={labelCls}>Date</Label>
              <Input type="date" {...register("date")} className={inputCls} />
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Reference Number</Label>
            <Input {...register("reference")} className={inputCls} placeholder="e.g. ELEC-0343 (optional)" />
          </div>

          {/* Upload */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Bill / Receipt Upload</Label>
            <div className="border border-dashed border-[#B6CAFF] bg-[#E6EDFF] rounded-lg py-4 px-4 flex flex-col items-center gap-2 hover:border-indigo-400 transition-colors cursor-pointer">
              <CloudUpload className="w-5 h-5 text-indigo-400" />
              <p className="text-xs text-gray-500">
                Attach bill or receipt (optional)
              </p>
              <p className="text-[10px] text-gray-400">
                PDF, JPG, PNG | Max 5MB
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-indigo-600 border-indigo-300 h-7 text-xs mt-1 bg-white hover:bg-indigo-50"
              >
                Browse File
              </Button>
            </div>
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
            {errors.paidVia && (
              <p className="text-xs text-red-500 mt-1">{errors.paidVia.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Notes</Label>
            <Input {...register("notes")} className={inputCls} placeholder="Any additional notes" />
          </div>

        </CardContent>

        {/* ── Footer ── */}
        <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 py-3 border-t border-[#D6E0FF] bg-[#EFF4FF] shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 sm:h-9 text-sm bg-white hover:bg-gray-100 text-gray-600 border border-[#D6E0FF]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 h-10 sm:h-9 text-sm bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
          >
            {initialData ? "Save Changes" : "Add Expense"}
          </Button>
        </div>

      </Card>
    </div>
  );
};