import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import typography from "@/styles/typography";
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto relative shadow-lg">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900">
          {isAdd ? "Add Transport Slab" : "Edit Transport Slab"}
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          {isAdd ? "New slab configuration" : `${slab?.name} configuration`}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">

          {/* Slab Name */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Slab Name
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Slab 1"
              className="bg-[#EFF4FF] mt-1 w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#3525CD]"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`${typography.form.label} text-gray-500 uppercase`}>
                From (km)
              </label>
              <input
                type="number"
                {...register("from", {
                  setValueAs: (v) => (v === "" ? 0 : Number(v)),
                })}
                className="bg-[#EFF4FF] mt-1 w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#3525CD]"
              />
              {errors.from && (
                <p className="text-xs text-red-500 mt-1">{errors.from.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">
                To (km)
              </label>
              <input
                type="number"
                {...register("to", {
                  setValueAs: (v) => (v === "" || v == null ? null : Number(v)),
                })}
                placeholder="∞"
                className="bg-[#EFF4FF] mt-1 w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#3525CD]"
              />
              {errors.to && (
                <p className="text-xs text-red-500 mt-1">{errors.to.message}</p>
              )}
            </div>
          </div>

          {/* Monthly Fee */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Monthly Fee (₹)
            </label>
            <input
              type="number"
              {...register("monthly", {
                setValueAs: (v) => (v === "" ? 0 : Number(v)),
              })}
              className="bg-[#EFF4FF] mt-1 w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#3525CD]"
            />
            {errors.monthly && (
              <p className="text-xs text-red-500 mt-1">{errors.monthly.message}</p>
            )}
          </div>

          {/* Annual (read-only derived value) */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Annual Fee
            </label>
            <input
              readOnly
              value={`₹${annual.toLocaleString("en-IN")}`}
              className="bg-[#EFF4FF] mt-1 w-full h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-500"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
            >
              Save Slab
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}