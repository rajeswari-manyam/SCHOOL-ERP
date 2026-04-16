import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const feeSchema = z.object({
  student: z.string().min(1),
  amount: z.coerce.number().min(1),
  dueDate: z.string().min(1),
});
type FeeFormSchema = z.infer<typeof feeSchema>;
type FeeFormProps = {
 defaultValues?: Partial<FeeFormSchema>;
  onSubmit: any;
  loading?: boolean;
};

export const FeeForm = ({
  defaultValues = {},
  onSubmit,
  loading,
}: FeeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeeFormSchema>({
  resolver: zodResolver(feeSchema) as any,
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Student</label>
        <input {...register("student")} className="input" />
        {errors.student && (
          <span className="text-red-600">{errors.student.message}</span>
        )}
      </div>
      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
        {...register("amount")}
          className="input"
        />
        {errors.amount && (
          <span className="text-red-600">{errors.amount.message}</span>
        )}
      </div>
      <div>
        <label>Due Date</label>
        <input type="date" {...register("dueDate")} className="input" />
        {errors.dueDate && (
          <span className="text-red-600">{errors.dueDate.message}</span>
        )}
      </div>
      <Button type="submit" className="btn btn-primary" disabled={loading}>
        Submit
      </Button>
    </form>
  );
};