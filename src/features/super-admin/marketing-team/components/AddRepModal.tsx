import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import type { RepFormValues } from "../types/marketing.types";
import { useMarketingMutations } from "../hooks/useMarketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  territory: z.string().min(2, "Territory required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
  perClosingRate: z.number().min(0),
  monthTarget: z.number().min(1),
});

type FormValues = z.infer<typeof schema>;

interface AddRepModalProps {
  open: boolean;
  onClose: () => void;
}

const AddRepModal = ({ open, onClose }: AddRepModalProps) => {
  const { createRep } = useMarketingMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { perClosingRate: 2000, monthTarget: 4 },
  });

  if (!open) return null;

  const onSubmit = (values: FormValues) =>
    createRep.mutate(values as RepFormValues, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container — full-screen on mobile, centered card on sm+ */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <Card
          className={[
            // Mobile: full-width bottom sheet with rounded top corners
            "w-full rounded-t-2xl rounded-b-none",
            // sm+: floating card with all corners rounded, capped width
            "sm:rounded-2xl sm:max-w-2xl",
            // Shared
            "overflow-hidden bg-white shadow-2xl",
            // Mobile: allow scrolling when content overflows viewport height
            "max-h-[92dvh] flex flex-col",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-4 pt-5 pb-4 sm:px-6">
            {/* Drag handle — visible only on mobile as a bottom-sheet affordance */}
            <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-gray-200 sm:hidden" />

            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Add Rep</h2>
              <p className="mt-0.5 text-sm text-gray-400">
                Add a new field representative
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Scrollable form body */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-4 py-5 sm:px-6"
            noValidate
          >
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label
                  className="text-[11px] font-bold uppercase tracking-widest text-gray-500"
                  required
                >
                  Full Name
                </Label>
                <Input
                  {...register("name")}
                  placeholder="Suresh K"
                  variant={errors.name ? "error" : "default"}
                  // Larger tap target on mobile
                  className="h-11 sm:h-9"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Territory */}
              <div className="space-y-1.5">
                <Label
                  className="text-[11px] font-bold uppercase tracking-widest text-gray-500"
                  required
                >
                  Territory
                </Label>
                <Input
                  {...register("territory")}
                  placeholder="Hanamkonda"
                  variant={errors.territory ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.territory && (
                  <p className="text-xs text-red-500">
                    {errors.territory.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label
                  className="text-[11px] font-bold uppercase tracking-widest text-gray-500"
                  required
                >
                  Phone
                </Label>
                <Input
                  {...register("phone")}
                  placeholder="9876543210"
                  inputMode="tel"
                  variant={errors.phone ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  className="text-[11px] font-bold uppercase tracking-widest text-gray-500"
                  required
                >
                  Email
                </Label>
                <Input
                  {...register("email")}
                  type="email"
                  inputMode="email"
                  placeholder="rep@example.com"
                  variant={errors.email ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Per Closing Rate */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Per Closing Rate (₹)
                </Label>
                <Input
                  {...register("perClosingRate", { valueAsNumber: true })}
                  type="number"
                  inputMode="numeric"
                  variant="default"
                  className="h-11 sm:h-9"
                />
              </div>

              {/* Month Target */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Month Target
                </Label>
                <Input
                  {...register("monthTarget", { valueAsNumber: true })}
                  type="number"
                  inputMode="numeric"
                  variant="default"
                  className="h-11 sm:h-9"
                />
              </div>
            </div>

            {/* Footer actions — stacked on mobile, inline on sm+ */}
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-between sm:items-center">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                className="w-full h-11 sm:w-auto sm:h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRep.isPending}
                className="w-full h-11 sm:w-auto sm:h-9"
              >
                {createRep.isPending ? "Adding…" : "Add Rep"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddRepModal;