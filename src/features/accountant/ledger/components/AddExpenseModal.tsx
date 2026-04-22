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
  "h-8 border border-[#D6E0FF] rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-[#EFF4FF] placeholder:text-gray-400 text-gray-700"
);
const selectCls =
  "w-full px-3 py-1.5 text-sm border border-[#D6E0FF] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-[#EFF4FF] text-gray-700";
const labelCls = combineTypography(
  typography.form.label,
  "text-gray-800"
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-md shadow-xl flex flex-col overflow-hidden max-h-[82vh]">

        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between py-2.5 px-5 border-b border-[#D6E0FF] shrink-0">
          <CardTitle className={combineTypography(typography.heading.h6, "text-gray-800")}>
            {initialData ? "Edit Expense Entry" : "Add Expense Entry"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </CardHeader>

        {/* Body */}
        <CardContent className="px-5 py-3 space-y-2.5 overflow-y-auto flex-1">

          {/* Category */}
          <div className="space-y-1">
            <Label className={labelCls}>Category</Label>
            <select {...register("category")} className={selectCls}>
              <option value="">Select category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className={typography.form.error}>{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className={labelCls}>Description</Label>
            <Input
              placeholder="e.g. Electricity bill — April 2025"
              {...register("description")}
              className={inputCls}
            />
            {errors.description && (
              <p className={typography.form.error}>{errors.description.message}</p>
            )}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className={labelCls}>Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                  ₹
                </span>
                <Input
                  type="number"
                  {...register("amount")}
                  className={`${inputCls} pl-9`}
                />
              </div>
              {errors.amount && (
                <p className={typography.form.error}>{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className={labelCls}>Date</Label>
              <Input type="date" {...register("date")} className={inputCls} />
              {errors.date && (
                <p className={typography.form.error}>{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-1">
            <Label className={labelCls}>Reference Number</Label>
            <Input {...register("reference")} className={inputCls} />
          </div>

          {/* Upload */}
          <div className="space-y-1">
            <Label className={labelCls}>Bill / Receipt Upload</Label>
            <div className="border border-dashed border-[#B6CAFF] bg-[#E6EDFF] rounded-md py-2.5 px-4 flex flex-col items-center gap-1 hover:border-indigo-400 transition-colors cursor-pointer">
              <CloudUpload className="w-4 h-4 text-indigo-400" />
              <p className="text-[11px] text-gray-500">
                Attach bill or receipt (optional)
              </p>
              <p className="text-[10px] text-gray-400">
                PDF, JPG, PNG | Max 5MB
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-indigo-600 border-indigo-300 h-6 text-[11px] mt-0.5 bg-white"
              >
                Browse File
              </Button>
            </div>
          </div>

          {/* Paid Via */}
          <div className="space-y-1">
            <Label className={labelCls}>Paid Via</Label>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_OPTIONS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setValue("paidVia", method.label)}
                  className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
                    selectedPayment === method.label
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-[#D6E0FF] hover:bg-indigo-50"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
            <input type="hidden" {...register("paidVia")} />
            {errors.paidVia && (
              <p className={typography.form.error}>{errors.paidVia.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label className={labelCls}>Notes</Label>
            <Input {...register("notes")} className={inputCls} />
          </div>

        </CardContent>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-3 border-t border-[#D6E0FF] bg-[#EFF4FF] shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-8 text-sm text-gray-600 border-[#D6E0FF] bg-white hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 h-8 text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {initialData ? "Save Changes" : "Add Expense"}
          </Button>
        </div>

      </Card>
    </div>
  );
};