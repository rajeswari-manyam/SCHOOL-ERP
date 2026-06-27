import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import typography from "@/styles/typography";
import type { FeeHeadFormValues } from "../types/fees.types";
import { createFeeHead, updateFeeHead } from "@/services/fee.api";
import type { FeeHeadDTO } from "@/services/fee.api";

const feeHeadSchema = z.object({
  name:         z.string().min(1, "Fee head name is required"),
  description:  z.string().optional(),
  displayOrder: z.string().regex(/^\d+$/, "Must be a number"),
  status:       z.enum(["active", "inactive"]),
});

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
  editData?: FeeHeadDTO;
}

export const AddFeeHeadModal = ({ onClose, onSuccess, editData }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!editData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeeHeadFormValues>({
    resolver: zodResolver(feeHeadSchema),
    defaultValues: {
      name:         editData?.feeName ?? "",
      description:  editData?.description ?? "",
      displayOrder: editData ? String(editData.displayOrder) : "",
      status:       "active",
    },
  });

  const status = watch("status");

  const onSubmit = async (data: FeeHeadFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        feeName:      data.name,
        description:  data.description,
        displayOrder: Number(data.displayOrder),
        status:       data.status === "active" ? "Active" : "Inactive",
      };
      if (isEdit && editData) {
        await updateFeeHead(editData.id, payload);
      } else {
        await createFeeHead(payload);
      }
      toast.success(isEdit ? "Fee head updated successfully" : "Fee head created successfully");
      onSuccess?.();
      onClose();
    } catch {
      toast.error("Failed to save fee head");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 h-11 text-sm ${typography.body.xs} rounded-lg border outline-none transition-all
     bg-[#EFF4FF] placeholder:text-gray-400 text-gray-800
     ${hasError
       ? "border-red-400 focus:ring-2 focus:ring-red-200"
       : "border-transparent focus:ring-2 focus:ring-indigo-300"
     }`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full h-[95vh] sm:h-auto sm:max-h-[90vh] sm:w-[520px] rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-6 overflow-y-auto pb-6">

        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Fee Head" : "Add New Fee Head"}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Fee Name */}
          <div>
            <label className={`${typography.body.xs} font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase`}>
              Fee Name <span className="text-red-500 normal-case">*</span>
            </label>
            <input placeholder="e.g. Exam Fee" className={inputClass(!!errors.name)} {...register("name")} />
            {errors.name && (
              <p className={`text-red-500 ${typography.body.xs} mt-1 flex items-center gap-1`}>
                <span>⚠</span> {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`${typography.body.xs} font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase`}>
              Description
            </label>
            <textarea
              placeholder="Brief description of this fee"
              rows={3}
              className={`w-full px-3 py-2.5 ${typography.body.xs} rounded-lg border outline-none resize-none transition-all bg-[#EFF4FF] placeholder:text-gray-400 text-gray-800 border-transparent focus:ring-2 focus:ring-indigo-300`}
              {...register("description")}
            />
          </div>

          {/* Display Order */}
          <div>
            <label className={`${typography.body.xs} font-semibold text-gray-900 mb-1.5 block tracking-wide uppercase`}>
              Display Order <span className="text-red-500 normal-case">*</span>
            </label>
            <input className={`${inputClass(!!errors.displayOrder)} w-28`} {...register("displayOrder")} />
            {errors.displayOrder && (
              <p className={`text-red-500 ${typography.body.xs} mt-1 flex items-center gap-1`}>
                <span>⚠</span> {errors.displayOrder.message}
              </p>
            )}
          </div>

          {/* Status Toggle */}
          <div>
            <label className={`${typography.body.xs} font-semibold text-gray-900 mb-2 block tracking-wide uppercase`}>
              Status
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setValue("status", status === "active" ? "inactive" : "active")}
                className={`relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200 flex-shrink-0 ${
                  status === "active" ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${
                  status === "active" ? "left-[23px]" : "left-[3px]"
                }`} />
              </button>
              <span className={`text-sm font-medium ${status === "active" ? "text-emerald-600" : "text-gray-400"}`}>
                {status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white pt-3 pb-2 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-[#3525CD] hover:bg-[#2a1fb5] text-white disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "Update Fee Head" : "Add Fee Head"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
