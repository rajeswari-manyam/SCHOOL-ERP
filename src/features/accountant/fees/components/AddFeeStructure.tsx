import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import typography from "@/styles/typography";

const feeHeadSchema = z.object({
  name: z.string().min(1, "Fee head name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  mandatory: z.boolean(),
  taxable: z.boolean(),
  billingCycle: z.enum(["Monthly", "Quarterly", "Annual", "One-Time"]),
  displayOrder: z.string().regex(/^\d+$/, "Must be a number"),
});

type FeeHeadFormValues = z.infer<typeof feeHeadSchema>;

const billingCycles = ["Monthly", "Quarterly", "Annual", "One-Time"] as const;

export const AddFeeHeadModal = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeeHeadFormValues>({
    resolver: zodResolver(feeHeadSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      mandatory: false,
      taxable: false,
      billingCycle: "Annual",
      displayOrder: "1",
    },
  });

  const billingCycle = watch("billingCycle");
  const mandatory = watch("mandatory");
  const taxable = watch("taxable");

  const onSubmit = (data: FeeHeadFormValues) => {
    console.log("Form Data:", data);
    onClose();
  };

  // Shared input class with light blue background
  const inputClass = (hasError: boolean) =>
    `w-full px-3 h-10 ${typography.body.xs} rounded-lg border outline-none transition-all
     bg-[#EFF4FF] placeholder:text-gray-400 text-gray-800
     ${hasError
       ? "border-red-400 focus:ring-2 focus:ring-red-200"
       : "border-transparent focus:ring-2 focus:ring-indigo-300"
     }`;

  return (
   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="
        bg-white w-full h-[92vh] sm:h-auto sm:max-h-[90vh]
        sm:w-[520px] rounded-t-2xl sm:rounded-2xl
        shadow-xl p-4 sm:p-6 overflow-y-auto
      ">

        {/* Header */}
     <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">
    Add New Fee Head
  </h3>
  <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
       <X className="w-5 h-5 text-gray-500" />
  </button>
</div>

             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


          {/* Name + Code row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Fee Head Name */}
            <div>
              <label className={`${typography.body.xs} font-semibold text-gray900 mb-1.5 block tracking-wide uppercase`}>
                Fee Head Name
              </label>
              <input
                placeholder="e.g. Annual Day Fee"
                className={inputClass(!!errors.name)}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 {typography.body.xs} mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.name.message}
                </p>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="{typography.body.xs} font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
                Code
              </label>
              <input
                placeholder="ADF001"
                className={inputClass(!!errors.code)}
                {...register("code")}
              />
              {errors.code && (
                <p className="text-red-500 {typography.body.xs} mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.code.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="{typography.body.xs} font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
              Description
            </label>
            <textarea
              placeholder="Brief description of this fee"
              rows={3}
              className={`w-full px-3 py-2.5 {typography.body.xs} rounded-lg border outline-none resize-none transition-all
                bg-[#EFF4FF] placeholder:text-gray-400 text-gray-800
                border-transparent focus:ring-2 focus:ring-indigo-300`}
              {...register("description")}
            />
          </div>

          {/* Mandatory + Taxable toggles */}
          <div className="flex gap-8">
            {/* Mandatory Toggle */}
<div className="flex items-center gap-3">
  <span className="text-xs text-gray-900">Mandatory for all students?</span>
  <button
    type="button"
    onClick={() => setValue("mandatory", !mandatory)}
    className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${
      mandatory ? "bg-[#3525CD]" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${
        mandatory ? "left-[23px]" : "left-[3px]"
      }`}
    />
  </button>
</div>

{/* Taxable Toggle */}
<div className="flex items-center gap-3">
  <span className="text-xs text-gray-900">Taxable?</span>
  <button
    type="button"
    onClick={() => setValue("taxable", !taxable)}
    className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${
      taxable ? "bg-[#3525CD]" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${
        taxable ? "left-[23px]" : "left-[3px]"
      }`}
    />
  </button>
</div>
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="{typography.body.xs} font-semibold text-gray-900 mb-2 block tracking-wide uppercase">
              Billing Cycle
            </label>
           <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              {billingCycles.map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setValue("billingCycle", cycle)}
                  className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                    billingCycle === cycle
                      ? "bg-[#3525CD] text-white border-[#3525CD]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

          {/* Display Order */}
          <div>
            <label className="{typography.body.xs} font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase">
              Display Order
            </label>
            <input
              className={`${inputClass(!!errors.displayOrder)} w-28`}
              {...register("displayOrder")}
            />
            {errors.displayOrder && (
              <p className="text-red-500 {typography.body.xs} mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.displayOrder.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:justify-end">
  <Button
    type="button"
    variant="outline"
    className="w-full sm:w-auto"
    onClick={onClose}
  >
    Cancel
  </Button>
  <Button
    type="submit"
    className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
  >
    Add Fee Head
  </Button>
</div>

        </form>
      </div>
    </div>
  );
};