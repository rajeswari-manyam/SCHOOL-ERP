// components/AddExpenseModal.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CloudUpload } from "lucide-react";  // FIX: Removed unused Upload import

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { LedgerEntry } from "../types/Ledger.types";
import typography from "@/styles/typography";
const schema = z.object({
  category: z.string().min(2, "Category required"),
  description: z.string().min(2, "Description required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  reference: z.string().optional(),
  date: z.string().min(1, "Date required"),
  paidVia: z.string().min(2, "Payment method required"),
  notes: z.string().optional(),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

const paymentMethods = [
  { id: "cash", label: "Cash" },
  { id: "bank", label: "Bank Transfer" },
  { id: "upi", label: "UPI" },
  { id: "cheque", label: "Cheque" },
];

export const AddExpenseModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: LedgerEntry) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      paidVia: "Bank Transfer",
    },
  });

  const selectedPayment = watch("paidVia");

  const onSubmit = (data: FormData) => {
    onAdd({
      id: nanoid(),
      ...data,
      type: "Expense",
      recordedBy: "Ramu Teja",
    });
    onClose();
  };

  return (
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start overflow-y-auto z-50 p-4">
      <Card className="w-full max-w-lg bg-white shadow-xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-none">
          <CardTitle className="text-lg font-semibold text-gray-800">Add Expense Entry</CardTitle>
          {/* FIX: Use size="sm" with p-0 instead of size="icon" */}
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-gray-500">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 overflow-y-auto pr-1">
          {/* Category */}
          <div className="space-y-1.5">
            <Label className={`${typography.body.small} font-bold text-gray-900`}>Category</Label>
            <select
              {...register("category")}
              className={`w-full px-3 py-2 ${typography.body.small} border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
            >
              <option value="">Select category</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Utilities">Utilities</option>
              <option value="Stationery">Stationery</option>
              <option value="Transport">Transport</option>
              <option value="Salaries">Salaries</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className={`${typography.body.small} font-bold text-gray-900`}>Description</Label>
            <Input 
              placeholder="e.g. Electricity bill — April 2025" 
              {...register("description")} 
              className={`${typography.body.small}`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description.message}</p>
            )}
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={`${typography.body.small} font-bold text-gray-900`}>Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rs.</span>
                <Input 
                  type="number" 
                  {...register("amount")} 
                  className={`${typography.body.small} pl-10`}
                  placeholder="0"
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-xs">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className={`${typography.body.small} font-bold text-gray-900`}>Date</Label>
              <Input 
                type="date" 
                {...register("date")} 
                className={`${typography.body.small}`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Reference Number */}
          <div className="space-y-1.5">
            <Label className={`${typography.body.small} font-bold text-gray-900`}>Reference Number</Label>
            <Input 
              placeholder="e.g. ELEC-0343 (optional)" 
              {...register("reference")} 
              className={`${typography.body.small}`}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-1.5">
            <Label className={`${typography.body.small} font-bold text-gray-900`}>Bill / Receipt Upload</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer">
              <CloudUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className={`${typography.body.small} text-gray-600 mb-1`}>Attach bill or receipt (optional)</p>
              <p className={`${typography.body.small} text-gray-400 mb-3`}>PDF, JPG, PNG | Max 5MB</p>
              <Button type="button" variant="outline" size="sm" className="text-indigo-600 border-indigo-200">
                Browse File
              </Button>
            </div>
          </div>

          {/* Paid Via */}
          <div className="space-y-1.5">
            <Label className={`${typography.body.small} font-bold text-gray-900`}>Paid Via</Label>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setValue("paidVia", method.label)}
                  className={`px-4 py-2 ${typography.body.small} font-medium rounded-lg transition-all ${
                    selectedPayment === method.label
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
            <input type="hidden" {...register("paidVia")} />
            {errors.paidVia && (
              <p className="text-red-500 text-xs">{errors.paidVia.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className={`${typography.body.small} font-bold text-gray-900`}>Notes</Label>
            <Input 
              placeholder="Any additional notes" 
              {...register("notes")} 
              className={`${typography.body.small}`}
            />
          </div>

          {/* Buttons */}
         <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit(onSubmit)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Expense
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};