import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateReceiptInput } from "../types/receipts.types";

const schema = z.object({
  studentId: z.string().min(1),
  amount: z.number().min(0.01),
  date: z.string().min(1),
  paymentMethod: z.string().min(1),
  description: z.string().optional(),
});

type ReceiptFormProps = {
  defaultValues?: Partial<CreateReceiptInput>;
  onSubmit: (values: CreateReceiptInput) => void;
  loading?: boolean;
};

export const ReceiptForm = ({
  defaultValues = {},
  onSubmit,
  loading,
}: ReceiptFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReceiptInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Student ID</label>
        <input {...register("studentId")} className="input" />
        {errors.studentId && (
          <span className="text-red-600">{errors.studentId.message}</span>
        )}
      </div>
      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          className="input"
        />
        {errors.amount && (
          <span className="text-red-600">{errors.amount.message}</span>
        )}
      </div>
      <div>
        <label>Date</label>
        <input type="date" {...register("date")} className="input" />
        {errors.date && (
          <span className="text-red-600">{errors.date.message}</span>
        )}
      </div>
      <div>
        <label>Payment Method</label>
        <input {...register("paymentMethod")} className="input" />
        {errors.paymentMethod && (
          <span className="text-red-600">{errors.paymentMethod.message}</span>
        )}
      </div>
      <div>
        <label>Description</label>
        <textarea {...register("description")} className="input" rows={2} />
        {errors.description && (
          <span className="text-red-600">
            {errors.description.message as string}
          </span>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Submit
      </button>
    </form>
  );
};
