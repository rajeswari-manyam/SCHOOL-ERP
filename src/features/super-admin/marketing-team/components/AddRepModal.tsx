import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { useMarketingMutations } from "../hooks/useMarketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, type SelectOption } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const ROLES: SelectOption[] = [
  { label: "Marketing Executive", value: "Marketing Executive" },
  { label: "Senior Marketing Executive", value: "Senior Marketing Executive" },
  { label: "Marketing Manager", value: "Marketing Manager" },
  { label: "Regional Marketing Head", value: "Regional Marketing Head" },
  { label: "Digital Marketing Specialist", value: "Digital Marketing Specialist" },
];

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Valid email required"),
  role: z.string().min(1, "Role is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be a 10-digit number"),
  whatsapp_number: z.string().regex(/^\d{10}$/, "WhatsApp number must be a 10-digit number"),
  date_of_join: z.string().min(1, "Date of joining is required"),
  closing_rate: z.string().min(1, "Closing rate is required"),
  notes: z.string().max(500, "Notes must be under 500 characters").optional().default(""),
  territory: z.string().min(2, "Territory must be at least 2 characters").max(100, "Territory too long"),
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
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      email: "",
      role: "",
      phone: "",
      whatsapp_number: "",
      date_of_join: "",
      closing_rate: "",
      notes: "",
      territory: "",
    },
  });

  if (!open) return null;

  const onSubmit = (values: FormValues) =>
    createRep.mutate(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <Card
          className={[
            "w-full rounded-t-2xl rounded-b-none",
            "sm:rounded-2xl sm:max-w-2xl",
            "overflow-hidden bg-white shadow-2xl",
            "max-h-[92dvh] flex flex-col",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-4 pt-5 pb-4 sm:px-6">
            <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-gray-200 sm:hidden" />

            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Add Marketing Team Member</h2>
              <p className="mt-0.5 text-sm text-gray-400">
                Add a new field representative
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </Button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-4 py-5 sm:px-6"
            noValidate
          >
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Full Name
                </Label>
                <Input
                  {...register("name")}
                  placeholder="Rohith"
                  variant={errors.name ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Email
                </Label>
                <Input
                  {...register("email")}
                  type="email"
                  inputMode="email"
                  placeholder="rohith@example.com"
                  variant={errors.email ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Role
                </Label>
                <Select
                  options={ROLES}
                  placeholder="Select role"
                  className={errors.role ? "border-red-500" : ""}
                  {...register("role")}
                  onChange={(e) => {
                    setValue("role", e.target.value, { shouldValidate: true });
                  }}
                />
                {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Phone
                </Label>
                <Input
                  {...register("phone")}
                  placeholder="9876543215"
                  inputMode="tel"
                  maxLength={10}
                  variant={errors.phone ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  WhatsApp Number
                </Label>
                <Input
                  {...register("whatsapp_number")}
                  placeholder="9876543210"
                  inputMode="tel"
                  maxLength={10}
                  variant={errors.whatsapp_number ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.whatsapp_number && <p className="text-xs text-red-500">{errors.whatsapp_number.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Date of Joining
                </Label>
                <Input
                  {...register("date_of_join")}
                  type="date"
                  variant={errors.date_of_join ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.date_of_join && <p className="text-xs text-red-500">{errors.date_of_join.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Closing Rate (₹)
                </Label>
                <Input
                  {...register("closing_rate")}
                  type="number"
                  inputMode="numeric"
                  placeholder="300"
                  variant={errors.closing_rate ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.closing_rate && <p className="text-xs text-red-500">{errors.closing_rate.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" required>
                  Territory
                </Label>
                <Input
                  {...register("territory")}
                  placeholder="Hanumankonda"
                  variant={errors.territory ? "error" : "default"}
                  className="h-11 sm:h-9"
                />
                {errors.territory && <p className="text-xs text-red-500">{errors.territory.message}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Notes
                </Label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Additional notes (optional)"
                  className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 transition duration-150 ease-in-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-24"
                />
                {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-between sm:items-center">
              <Button
                variant="outline"
                type="button"
                onClick={handleClose}
                className="w-full h-11 sm:w-auto sm:h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRep.isPending}
                className="w-full h-11 sm:w-auto sm:h-9"
              >
                {createRep.isPending ? "Adding…" : "Add Member"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddRepModal;