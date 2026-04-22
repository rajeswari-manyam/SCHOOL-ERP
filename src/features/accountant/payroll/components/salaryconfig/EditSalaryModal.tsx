import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { formatCurrency } from "../../../../../utils/formatters";
import { getTodayISO } from "../../../../../utils/date";
import type { EditSalaryModalProps } from "../../types/payroll.types";

const schema = z.object({
  basicSalary:        z.number().min(1, "Required"),
  hra:                z.number(),
  transportAllowance: z.number(),
  otherAllowance:     z.number(),
  pfPercentage:       z.number().min(0),
  professionalTax:    z.number(),
  tds:                z.number(),
  effectiveFrom:      z.string().min(1, "Date required"),
});

type FormData = z.infer<typeof schema>;


export const EditSalaryModal = ({ staff, onClose, onSave }: EditSalaryModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      basicSalary:        staff?.basic          || 0,
      hra:                staff?.hra             || 0,
      transportAllowance: staff?.transport       || 0,
      otherAllowance:     staff?.other           || 0,
      pfPercentage:       staff?.pfPercentage    || 12,
      professionalTax:    staff?.professionalTax || 0,
      tds:                0,
      effectiveFrom:      getTodayISO(),
    },
  });

  const values = watch();
  const gross           = values.basicSalary + values.hra + values.transportAllowance + values.otherAllowance;
  const pf              = (values.basicSalary * values.pfPercentage) / 100;
  const totalDeductions = pf + values.professionalTax + values.tds;
  const net             = gross - totalDeductions;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="flex justify-between items-start px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Edit Salary — {staff?.name || "New Staff"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {staff?.role || "New Role"} | EMP-{staff?.id || "NEW"} | Current since: 1 June 2024
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* SCROLL BODY */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">

          {/* 2-COLUMN GRID */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">

            {/* Basic Salary */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Basic Salary *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                <Input
                  type="number"
                  className="pl-9 text-sm"
                  {...register("basicSalary", { valueAsNumber: true })}
                />
              </div>
              {errors.basicSalary && (
                <p className="text-xs text-red-500 mt-1">{errors.basicSalary.message}</p>
              )}
            </div>

            {/* PF Percentage */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                PF Percentage *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  className="pr-9 text-sm"
                  {...register("pfPercentage", { valueAsNumber: true })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Of basic salary</p>
            </div>

            {/* HRA */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                HRA
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                <Input
                  type="number"
                  className="pl-9 text-sm"
                  {...register("hra", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Professional Tax */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Professional Tax
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                <Input
                  type="number"
                  className="pl-9 text-sm"
                  {...register("professionalTax", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Transport Allowance */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Transport Allowance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                <Input
                  type="number"
                  className="pl-9 text-sm"
                  {...register("transportAllowance", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* TDS */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                TDS (monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                <Input
                  type="number"
                  className="pl-9 text-sm"
                  {...register("tds", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Other Allowance */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Other Allowance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                <Input
                  type="number"
                  className="pl-9 text-sm"
                  {...register("otherAllowance", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Effective From */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Effective From *
              </label>
              <div className="relative">
                <Input
                  type="date"
                  className="pr-9 text-sm"
                  {...register("effectiveFrom")}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              {errors.effectiveFrom && (
                <p className="text-xs text-red-500 mt-1">{errors.effectiveFrom.message}</p>
              )}
            </div>

          </div>

          {/* SALARY PREVIEW */}
          <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "#E5EEFF" }}>
            <p className="text-[11px] font-semibold text-[#3525CD] uppercase tracking-wide">
              Salary Preview
            </p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Gross Salary</span>
              <span className="font-semibold text-[#3525CD]">{formatCurrency(gross)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Deductions</span>
              <span className="font-semibold text-red-500">{formatCurrency(totalDeductions)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#C7D7F9]">
              <span className="font-semibold text-gray-900">Net Pay</span>
              <span className="font-bold text-lg text-[#3525CD]">{formatCurrency(net)}</span>
            </div>
          </div>

          {/* DISCLAIMER */}
          <p className="text-xs text-gray-400 text-center">
            Changes apply from May 2025 onward. Previous months unaffected.
          </p>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 h-9 text-sm font-medium text-gray-700"
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            onClick={handleSubmit((data) => { onSave(staff?.id || "new", data); onClose(); })}
            className="px-6 h-9 text-sm font-medium bg-[#3525CD] hover:bg-[#2a1da3] text-white disabled:opacity-50"
          >
            Save Salary Config
          </Button>
        </div>

      </div>
    </div>
  );
};