import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { nanoid } from "nanoid";

/* =========================
   Schema
========================= */
const schema = z.object({
  category: z.string().min(2, "Category required"),
  description: z.string().min(2, "Description required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  reference: z.string().optional(),
  date: z.string().min(1, "Date required"),
  paidVia: z.string().min(2, "Payment method required"),
  notes: z.string().optional(),
});

/* =========================
   Types
========================= */
type FormInput = z.input<typeof schema>;   // raw form values
type FormData = z.output<typeof schema>;  // parsed values

/* =========================
   Component
========================= */
export const AddExpenseModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: any) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0], // auto today
    },
  });

  const onSubmit = (data: FormData) => {
    onAdd({
      id: nanoid(),
      ...data,
      type: "Expense",
      recordedBy: "Admin",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <Card className="w-[480px]">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          
          {/* Category */}
          <div>
            <Input placeholder="Category" {...register("category")} />
            {errors.category && (
              <p className="text-red-500 text-sm">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Input placeholder="Description" {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <Input type="number" placeholder="Amount" {...register("amount")} />
            {errors.amount && (
              <p className="text-red-500 text-sm">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Reference */}
          <div>
            <Input placeholder="Reference" {...register("reference")} />
          </div>

          {/* Date */}
          <div>
            <Input type="date" {...register("date")} />
            {errors.date && (
              <p className="text-red-500 text-sm">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Paid Via */}
          <div>
            <Input
              placeholder="Paid Via (Cash/UPI)"
              {...register("paidVia")}
            />
            {errors.paidVia && (
              <p className="text-red-500 text-sm">
                {errors.paidVia.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Input placeholder="Notes" {...register("notes")} />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit(onSubmit)}>
              Add Expense
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};