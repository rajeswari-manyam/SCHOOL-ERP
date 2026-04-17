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
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card
          className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 pt-5 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Add Rep</h2>
              <p className="mt-0.5 text-sm text-gray-400">Add a new field representative</p>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Full Name
                </Label>
                <Input
                  {...register("name")}
                  placeholder="Suresh K"
                  variant={errors.name ? "error" : "default"}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Territory
                </Label>
                <Input
                  {...register("territory")}
                  placeholder="Hanamkonda"
                  variant={errors.territory ? "error" : "default"}
                />
                {errors.territory && <p className="text-xs text-red-500">{errors.territory.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Phone
                </Label>
                <Input
                  {...register("phone")}
                  placeholder="9876543210"
                  variant={errors.phone ? "error" : "default"}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Email
                </Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="rep@example.com"
                  variant={errors.email ? "error" : "default"}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Per Closing Rate (₹)
                </Label>
                <Input
                  {...register("perClosingRate")}
                  type="number"
                  variant="default"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Month Target
                </Label>
                <Input
                  {...register("monthTarget")}
                  type="number"
                  variant="default"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-between sm:items-center">
              <Button variant="outline" type="button" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={createRep.isPending} className="w-full sm:w-auto">
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
