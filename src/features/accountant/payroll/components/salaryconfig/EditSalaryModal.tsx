import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom"; // Add this import

import { X, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import typography, { combineTypography } from "@/styles/typography";


import type { SalaryConfig, SalaryFormData } from "../../types/payroll.types";

const schema = z.object({
  basicSalary: z.number().min(1, "Required"),
  hra: z.number(),
  transportAllowance: z.number(),
  otherAllowance: z.number(),
  pfPercentage: z.number().min(0),
  professionalTax: z.number(),
  tds: z.number(),
  effectiveFrom: z.string().min(1, "Date required"),
});

type FormData = z.infer<typeof schema>;

interface EditSalaryModalProps {
  staff?: SalaryConfig | null;
  onClose: () => void;
  onSave: (id: string, data: SalaryFormData) => void;
}

// Custom format function for Rs. format
const formatRsCurrency = (amount: number) => {
  return `Rs.${amount.toLocaleString("en-IN")}`;
};

// Format date to "01 May 2025" format
const formatDisplayDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const EditSalaryModal = ({
  staff,
  onClose,
  onSave,
}: EditSalaryModalProps) => {
  const navigate = useNavigate(); // Add this
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  defaultValues: {
  basicSalary: staff?.basic || 0,
  hra: staff?.hra || 0,
  transportAllowance: staff?.transport || 0,
  otherAllowance: staff?.other || 0,
  pfPercentage: staff?.pfPercentage || 12,
  professionalTax: staff?.professionalTax || 0,
  tds: 0,
  effectiveFrom: "2025-05-01",
},
  });

  const values = watch();

  const gross =
    values.basicSalary +
    values.hra +
    values.transportAllowance +
    values.otherAllowance;

  const pf = (values.basicSalary * values.pfPercentage) / 100;

  const totalDeductions = pf + values.professionalTax + values.tds;

  const net = gross - totalDeductions;

  // Handle cancel with navigation
  const handleCancel = () => {
    onClose();
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-white w-full max-w-[480px] rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* HEADER - Fixed to show name and role properly */}
   <div className="flex justify-between items-start p-5">     
          <div>
            <h2 className={combineTypography(typography.body.small, "font-semibold text-gray-900")}>
             Edit Salary — {staff?.name || "New Staff"}
            </h2>
            <p className={combineTypography(typography.body.xs, "text-gray-500 mt-0.5")}>
            {staff?.role || "New Role"} • EMP-{staff?.id || "NEW"}• Current since: 1 June 2024
            </p>
          </div>

          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* SCROLL BODY */}
        <div className="overflow-y-auto p-5 space-y-4">
          
          {/* INPUT GRID - Fixed layout with proper labels */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Row 1: Basic Salary + PF Percentage */}
            <div>
              <label className={combineTypography(typography.form.label, "mb-1.5 block text-sm font-medium text-gray-700")}>
                Basic Salary *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  Rs.
                </span>
                <Input
                  type="number"
                  className="pl-10"
                  {...register("basicSalary", { valueAsNumber: true })}
                />
              </div>
              {errors.basicSalary && (
                <p className="text-xs text-red-500 mt-1">{errors.basicSalary.message}</p>
              )}
            </div>

            <div>
              <label className={combineTypography(typography.form.label, "mb-1.5 block text-sm font-medium text-gray-700")}>
                PF Percentage *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  className="pr-8"
                  {...register("pfPercentage", { valueAsNumber: true })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Of basic salary</p>
            </div>

            {/* Row 2: HRA + Professional Tax */}
            <div>
              <label className={combineTypography(typography.form.label, "mb-1.5 block text-sm font-medium text-gray-700")}>
                HRA
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  Rs.
                </span>
                <Input
                  type="number"
                  className="pl-10"
                  {...register("hra", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div>
              <label className={combineTypography(typography.form.label, "mb-1.5 block text-sm font-medium text-gray-700")}>
                Professional Tax
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  Rs.
                </span>
                <Input
                  type="number"
                  className="pl-10"
                  {...register("professionalTax", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Row 3: Transport Allowance + TDS */}
            <div>
              <label className={combineTypography(typography.form.label, "mb-1.5 block text-sm font-medium text-gray-700")}>
                Transport Allowance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  Rs.
                </span>
                <Input
                  type="number"
                  className="pl-10"
                  {...register("transportAllowance", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div>
              <label className={combineTypography(typography.form.label, "mb-1.5 block text-sm font-medium text-gray-700")}>
                TDS (monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  Rs.
                </span>
                <Input
                  type="number"
                  className="pl-10"
                  {...register("tds", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Row 4: Other Allowance (full width) */}
            <div className="col-span-2">
              <label className={combineTypography(typography.form.label, "mb-1.5 block text-sm font-medium text-gray-700")}>
                Other Allowance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  Rs.
                </span>
                <Input
                  type="number"
                  className="pl-10"
                  {...register("otherAllowance", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Row 5: Effective From (full width) */}
            <div className="col-span-2">
              <label className={combineTypography(typography.form.label, "mb-1.5 block text-sm font-medium text-gray-700")}>
                Effective From *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  className="pl-10"
                  {...register("effectiveFrom")}
                />
              </div>
            </div>
          </div>

          {/* SALARY PREVIEW - Updated with Rs. format */}
          <div className="bg-[#F8F9FF] rounded-lg p-4 space-y-3">
            <p className="text-[11px] font-semibold text-[#3525CD] uppercase tracking-wide">
              Salary Preview
            </p>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Gross Salary</span>
              <span className="font-semibold text-[#3525CD]">
                {formatRsCurrency(gross)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Deductions</span>
              <span className="font-semibold text-red-500">
                {formatRsCurrency(totalDeductions)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Net Pay</span>
              <span className="font-bold text-lg text-green-600">
                {formatRsCurrency(net)}
              </span>
            </div>
          </div>

          {/* DISCLAIMER */}
          <p className="text-xs text-gray-500 text-center">
            Changes apply from May 2025 onward. Previous months unaffected.
          </p>
        </div>

        {/* FOOTER - Fixed with Cancel navigation */}
        <div className="flex items-center justify-end gap-3 p-5 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2 h-auto font-medium"
          >
            Cancel
          </Button>

          <Button
            disabled={!isValid}
           onClick={handleSubmit((data) => onSave(staff?.id || "new", data))}
            className="px-6 py-2 h-auto bg-[#3525CD] hover:bg-[#2a1da3] text-white font-medium"
          >
            Save Salary Config
          </Button>
        </div>
      </div>
    </div>
  );
};