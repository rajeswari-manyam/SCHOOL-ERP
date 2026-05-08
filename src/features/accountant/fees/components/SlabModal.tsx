import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import type { SlabModalProps } from "../types/fees.types";

const transportSlabSchema = z
  .object({
    name: z.string().min(1, "Slab name is required"),
    from: z.number().min(1, "Distance must be at least 1 km"),
    to: z.number().nullable().optional(),
    monthly: z.number().min(1, "Monthly fee is required"),
  })
  .refine(
    (data) => data.to === null || data.to === undefined || data.to >= data.from,
    {
      message: "'To' must be greater than or equal to 'From'",
      path: ["to"],
    }
  );

type FormData = z.infer<typeof transportSlabSchema>;

export function SlabModal({ slab, isAdd, onClose, onSave }: SlabModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(transportSlabSchema),
    defaultValues: {
      name: slab?.name ?? "",
      from: slab?.from ?? 0,
      to: slab?.to ?? null,
      monthly: slab?.monthly ?? 0,
    },
  });

  const monthly = watch("monthly");

  const annual = useMemo(() => {
    if (isNaN(monthly)) return 0;
    return monthly * 12;
  }, [monthly]);

  const onSubmit = (data: FormData) => {
    onSave({
      name: data.name.trim(),
      from: data.from,
      to: data.to ?? null,
      monthly: data.monthly,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center transition-opacity"
      onClick={onClose}
    >
      <div
        className="
          bg-white
          w-full sm:w-[420px]
          max-h-[92vh] sm:max-h-[85vh]
          rounded-t-2xl sm:rounded-xl
          flex flex-col
          shadow-2xl
          animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0
          duration-300
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Mobile Drag Handle ── */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-4 sm:px-5 pt-2 sm:pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {isAdd ? "Add Transport Slab" : "Edit Transport Slab"}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              {isAdd ? "New slab configuration" : `${slab?.name} configuration`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable Form Body ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Slab Name */}
            <div>
              <label className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                Slab Name
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Slab 1"
                className="bg-[#EFF4FF] mt-1.5 w-full h-10 sm:h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#3525CD] focus:ring-1 focus:ring-[#3525CD]/20 transition-all"
              />
              {errors.name && (
                <p className="text-[11px] sm:text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* From / To */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                  From (km)
                </label>
                <input
                  type="number"
                  {...register("from", {
                    setValueAs: (v) => (v === "" ? 0 : Number(v)),
                  })}
                  className="bg-[#EFF4FF] mt-1.5 w-full h-10 sm:h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#3525CD] focus:ring-1 focus:ring-[#3525CD]/20 transition-all"
                />
                {errors.from && (
                  <p className="text-[11px] sm:text-xs text-red-500 mt-1">{errors.from.message}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                  To (km)
                </label>
                <input
                  type="number"
                  {...register("to", {
                    setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                  })}
                  placeholder="∞"
                  className="bg-[#EFF4FF] mt-1.5 w-full h-10 sm:h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#3525CD] focus:ring-1 focus:ring-[#3525CD]/20 transition-all"
                />
                {errors.to && (
                  <p className="text-[11px] sm:text-xs text-red-500 mt-1">{errors.to.message}</p>
                )}
              </div>
            </div>

            {/* Monthly Fee */}
            <div>
              <label className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                Monthly Fee (₹)
              </label>
              <input
                type="number"
                {...register("monthly", {
                  setValueAs: (v) => (v === "" ? 0 : Number(v)),
                })}
                className="bg-[#EFF4FF] mt-1.5 w-full h-10 sm:h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#3525CD] focus:ring-1 focus:ring-[#3525CD]/20 transition-all"
              />
              {errors.monthly && (
                <p className="text-[11px] sm:text-xs text-red-500 mt-1">{errors.monthly.message}</p>
              )}
            </div>

            {/* Annual (read-only derived value) */}
            <div>
              <label className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                Annual Fee
              </label>
              <div className="mt-1.5 w-full h-10 sm:h-9 rounded-lg border border-gray-200 px-3 flex items-center bg-gray-50">
                <span className="text-sm text-gray-500 font-medium">
                  ₹{annual.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* ── Sticky Footer ── */}
        <div className="flex-shrink-0 px-4 sm:px-5 py-3 border-t border-gray-100 bg-white">
          <div className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none h-10 sm:h-9 text-[13px] sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="flex-1 sm:flex-none h-10 sm:h-9 text-[13px] sm:text-sm bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
            >
              Save Slab
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}